import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, Test } from '../models/auth.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test-start',
  templateUrl: './test-start.component.html',
  styleUrls: ['./test-start.component.css'],
  imports: [CommonModule, NgIf, NgFor]
})
export class TestStartComponent implements OnInit, OnDestroy {

  isFinished = false;
  tabSwitchCount = 0;

  questions: Question[] = [];
  testId!: number;
  attemptId!: number;

  testDuration: number = 0;
  remainingTime: number = 0;
  timer: any;

  userAnswers: any = {};
  private autoSaveTimeout: any;

  private boundSave = this.saveProgress.bind(this);
  private boundHandleViolation = this.handleViolation.bind(this);

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('TestStartComponent initialized');

    this.testId = Number(this.route.snapshot.paramMap.get('id'));

    const savedAttemptId = localStorage.getItem('attemptId');
    const savedTestId = localStorage.getItem('testId');
    const savedRemainingTime = localStorage.getItem('remainingTime');

    if (savedAttemptId && savedTestId === this.testId.toString()) {
      this.attemptId = Number(savedAttemptId);
      console.log('Restoring attempt for same test:', this.attemptId);

      if (savedRemainingTime) {
        this.remainingTime = Number(savedRemainingTime);
      }

      this.loadTestInfo();
    } else {
      console.log('Different test or no saved attempt, starting new');
      localStorage.removeItem('attemptId');
      localStorage.removeItem('testId');
      localStorage.removeItem('remainingTime');
      this.resetAllState();
      this.startAttempt();
    }

    window.addEventListener('beforeunload', this.boundSave);
    window.addEventListener('testViolation', this.boundHandleViolation);

    this.notifyExtensionReady();
    this.checkExtensionStatus();
  }

  ngOnDestroy(): void {
    console.log('TestStartComponent destroyed');

    clearInterval(this.timer);

    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    if (!this.isFinished && this.attemptId) {
      this.forceSave();
      localStorage.setItem('remainingTime', this.remainingTime.toString());
    }

    window.removeEventListener('beforeunload', this.boundSave);
    window.removeEventListener('testViolation', this.boundHandleViolation);
  }

  startAttempt() {
    this.resetAllState();

    this.testService.startTest(this.testId).subscribe({
      next: (attempt: any) => {
        this.attemptId = attempt.id_attempt;

        localStorage.setItem('attemptId', this.attemptId.toString());
        localStorage.setItem('testId', this.testId.toString());

        console.log('New attempt started with ID:', this.attemptId);

        // Загружаем информацию о тесте и вопросы
        this.loadTestInfo();
      },
      error: (err) => console.error('Error starting attempt:', err)
    });
  }

  resetAllState() {
    console.log('Resetting all state for new attempt');

    this.userAnswers = {};
    this.questions = [];

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.isFinished = false;

    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = null;
    }

    this.remainingTime = 0;
    this.testDuration = 0;
    this.tabSwitchCount = 0;

    this.resetAllControls();
  }

  resetAllControls() {
    setTimeout(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox: any) => {
        checkbox.checked = false;
      });

      const radios = document.querySelectorAll('input[type="radio"]');
      radios.forEach((radio: any) => {
        radio.checked = false;
      });

      const textareas = document.querySelectorAll('textarea');
      textareas.forEach((textarea: any) => {
        textarea.value = '';
      });

      const textInputs = document.querySelectorAll('input[type="text"]');
      textInputs.forEach((input: any) => {
        input.value = '';
      });

      console.log('All UI controls reset');
    }, 50);
  }

  loadTestInfo() {
    this.testService.getTestById(this.testId).subscribe({
      next: (test: Test) => {
        this.testDuration = test.duration_minutes || 30;

        if (this.remainingTime === 0) {
          this.remainingTime = this.testDuration * 60;
        }

        localStorage.setItem('remainingTime', this.remainingTime.toString());

        this.loadQuestions();
      },
      error: () => {
        this.testDuration = 30;
        if (this.remainingTime === 0) {
          this.remainingTime = 30 * 60;
        }
        this.loadQuestions();
      }
    });
  }

  loadQuestions() {
    this.testService.getQuestions(this.testId).subscribe({
      next: (data: Question[]) => {
        this.questions = data;
        console.log('Questions loaded:', data.length);

        this.resetAllControls();

        if (this.attemptId) {
          this.loadProgress();
        } else {
          this.initializeEmptyAnswers();
        }

        this.startTimer();
      },
      error: (err) => console.error('Error loading questions:', err)
    });
  }

  loadProgress() {
    this.testService.getProgress(this.attemptId).subscribe({
      next: (data: any) => {
        console.log('Loaded progress from server:', data);

        this.userAnswers = data || {};

        this.questions.forEach(question => {
          if (!this.userAnswers.hasOwnProperty(question.id_question)) {
            if (question.type_question === 'MULTIPLE') {
              this.userAnswers[question.id_question] = [];
            } else if (question.type_question === 'SINGLE') {
              this.userAnswers[question.id_question] = null;
            } else if (question.type_question === 'TEXT') {
              this.userAnswers[question.id_question] = '';
            }
          }
        });

        console.log('Total answers after load:', Object.keys(this.userAnswers).length);

        setTimeout(() => {
          this.restoreUIState();
        }, 100);
      },
      error: (err) => {
        console.error('Error loading progress:', err);
        this.userAnswers = {};
        this.initializeEmptyAnswers();
      }
    });
  }

  initializeEmptyAnswers() {
    console.log('Initializing empty answers');
    this.userAnswers = {};

    this.questions.forEach(question => {
      if (question.type_question === 'MULTIPLE') {
        this.userAnswers[question.id_question] = [];
      } else if (question.type_question === 'SINGLE') {
        this.userAnswers[question.id_question] = null;
      } else if (question.type_question === 'TEXT') {
        this.userAnswers[question.id_question] = '';
      }
    });
  }

  restoreUIState() {
    if (!this.questions || this.questions.length === 0) {
      console.warn('No questions loaded yet for UI restoration');
      return;
    }

    const savedTestId = localStorage.getItem('testId');
    if (savedTestId !== this.testId.toString()) {
      console.log('Different test, not restoring UI');
      return;
    }

    console.log('Restoring UI state for saved answers');

    if (Object.keys(this.userAnswers).length === 0) {
      console.log('No saved answers to restore');
      return;
    }

    this.questions.forEach(question => {
      const savedAnswer = this.userAnswers[question.id_question];
      if (!savedAnswer) return;

      if (question.type_question === 'MULTIPLE' && Array.isArray(savedAnswer) && savedAnswer.length > 0) {
        question.answers?.forEach(answer => {
          const checkbox = document.getElementById(`answer_${answer.id_answer}`) as HTMLInputElement;
          if (checkbox) {
            checkbox.checked = savedAnswer.includes(answer.id_answer);
          }
        });
      } else if (question.type_question === 'SINGLE' && typeof savedAnswer === 'number') {
        const radio = document.getElementById(`answer_${savedAnswer}`) as HTMLInputElement;
        if (radio) {
          radio.checked = true;
        }
      } else if (question.type_question === 'TEXT' && typeof savedAnswer === 'string' && savedAnswer.trim() !== '') {
        const textarea = document.getElementById(`text_${question.id_question}`) as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = savedAnswer;
        }
      }
    });

    console.log('UI state restored');
  }

  setSingleAnswer(questionId: number, answerId: number) {
    this.userAnswers[questionId] = answerId;
    console.log(`Single answer set: question ${questionId} = ${answerId}`);
    this.scheduleAutoSave();
  }

  toggleMultiple(questionId: number, answerId: number, event: any) {
    if (!this.userAnswers[questionId]) {
      this.userAnswers[questionId] = [];
    }

    if (event.target.checked) {
      this.userAnswers[questionId].push(answerId);
    } else {
      this.userAnswers[questionId] = this.userAnswers[questionId].filter((id: number) => id !== answerId);
    }

    console.log(`Multiple answer toggled: question ${questionId} =`, this.userAnswers[questionId]);
    this.scheduleAutoSave();
  }

  setTextAnswer(questionId: number, event: any) {
    const value = event.target.value;
    this.userAnswers[questionId] = value;
    console.log(`Text answer set: question ${questionId} = "${value}"`);
    this.scheduleAutoSave();
  }

  scheduleAutoSave() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(() => {
      this.forceSave();
    }, 1500);
  }

  forceSave() {
    if (!this.attemptId) return;

    const answersToSave: any = {};

    Object.keys(this.userAnswers).forEach(questionId => {
      const answer = this.userAnswers[questionId];

      if (answer === null || answer === undefined) return;
      if (typeof answer === 'string' && answer.trim() === '') return;
      if (Array.isArray(answer) && answer.length === 0) return;

      answersToSave[questionId] = answer;
    });

    if (Object.keys(answersToSave).length === 0) {
      console.log('No answers to save');
      return;
    }

    console.log(`Saving ${Object.keys(answersToSave).length} answers`);

    this.testService.saveProgress(this.attemptId, answersToSave)
      .subscribe({
        next: () => console.log('Progress saved successfully'),
        error: (err) => console.error('Error saving progress:', err)
      });
  }

  saveProgress(event?: any) {
    if (!this.attemptId) return;

    const answersToSave = this.getAnswersToSave();

    if (Object.keys(answersToSave).length > 0) {
      navigator.sendBeacon(
        `http://localhost:8080/attempt/save-progress/${this.attemptId}`,
        JSON.stringify(answersToSave)
      );
    }

    localStorage.setItem('remainingTime', this.remainingTime.toString());

    if (event) {
      event.returnValue = 'Вы точно хотите выйти? Прогресс будет сохранен.';
    }
  }

  getAnswersToSave(): any {
    const answersToSave: any = {};

    Object.keys(this.userAnswers).forEach(questionId => {
      const answer = this.userAnswers[questionId];

      if (answer === null || answer === undefined) return;
      if (typeof answer === 'string' && answer.trim() === '') return;
      if (Array.isArray(answer) && answer.length === 0) return;

      answersToSave[questionId] = answer;
    });

    return answersToSave;
  }

  startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;

        if (this.remainingTime % 10 === 0) {
          localStorage.setItem('remainingTime', this.remainingTime.toString());
        }
      } else {
        clearInterval(this.timer);
        this.finishTest();
      }
    }, 1000);
  }

  get formattedTime(): string {
    const m = Math.floor(this.remainingTime / 60);
    const s = this.remainingTime % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  notifyExtensionReady() {
    window.dispatchEvent(new CustomEvent('angularTestReady', {
      detail: { testId: this.testId, timestamp: Date.now() }
    }));
  }

  checkExtensionStatus() {
    setTimeout(() => {
      const win = window as any;
      if (win.__testProtectionAPI) {
        console.log('Extension is loaded and ready');
        const status = win.__testProtectionAPI.status();
        console.log('Extension status:', status);
      } else {
        console.warn('Extension not detected!');
      }
    }, 1000);
  }

  handleViolation(event: any) {
    this.ngZone.run(() => {
      const { reason, count } = event.detail;
      console.log(`Violation: ${reason}`, event.detail);

      switch(reason) {
        case 'tabSwitchWarning':
          this.tabSwitchCount = count || 1;
          console.warn(`Tab switch warning #${this.tabSwitchCount}`);
          break;

        case 'tabSwitchViolation':
        case 'devToolsViolation':
        case 'devToolsDetected':
          console.error(`Test finished due to: ${reason}`);
          this.finishTest();
          break;

        case 'extensionReady':
          console.log('Extension is ready and protection is active');
          break;
      }
    });
  }

  finishTest() {
    if (this.isFinished) return;
    this.isFinished = true;

    clearInterval(this.timer);

    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.forceSave();

    console.log('Finishing test with attemptId:', this.attemptId);
    console.log('Final answers:', this.userAnswers);

    this.testService.submitTest({
      testId: this.testId,
      answers: this.userAnswers
    }).subscribe({
      next: () => {
        localStorage.removeItem('attemptId');
        localStorage.removeItem('testId');
        localStorage.removeItem('remainingTime');

        this.resetAllState();

        this.router.navigate(['/result', this.attemptId]);
      },
      error: (err) => {
        console.error('Error submitting test:', err);

        localStorage.removeItem('attemptId');
        localStorage.removeItem('testId');
        localStorage.removeItem('remainingTime');
        this.resetAllState();

        this.router.navigate(['/result', this.attemptId]);
      }
    });
  }

  trackByQuestion(index: number, question: Question): number {
    return question.id_question;
  }

  trackByAnswer(index: number, answer: any): number {
    return answer.id_answer;
  }
}
