package org.example.testextension.controllers;

import org.example.testextension.enums.TypeStatus;
import org.example.testextension.models.*;
import org.example.testextension.repositories.AttemptAnswerRepository;
import org.example.testextension.repositories.PersonRepository;
import org.example.testextension.repositories.TestAttemptRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attempt")
public class TestAttemptController {

    private static final Logger log = LoggerFactory.getLogger(TestAttemptController.class);

    private final TestAttemptRepository attemptRepository;
    private final PersonRepository personRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    @Autowired
    public TestAttemptController(TestAttemptRepository attemptRepository,
                                 PersonRepository personRepository,
                                 AttemptAnswerRepository attemptAnswerRepository) {
        this.attemptRepository = attemptRepository;
        this.personRepository = personRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
    }

    private String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.debug("Principal class: {}", principal.getClass().getName());
        log.debug("Principal: {}", principal);

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            log.debug("Email from UserDetails: {}", email);
            return email;
        } else {
            log.debug("Principal as String: {}", principal.toString());
            return principal.toString();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody Map<String, Object> data) {
        try {
            Integer testId = (Integer) data.get("testId");
            Map<String, Object> answers = (Map<String, Object>) data.get("answers");

            Person currentUser = personRepository.findByEmail(getCurrentUserEmail())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            log.info("Submitting test for user: {}, testId: {}", currentUser.getEmail(), testId);

            List<TestAttempt> attempts = attemptRepository.findByTestIdAndPersonIdAndStatus(
                    testId.longValue(), currentUser.getId_person(), TypeStatus.IN_PROGRESS
            );

            TestAttempt attempt;

            if (attempts.isEmpty()) {
                log.error("No active attempt found for test {} and user {}", testId, currentUser.getEmail());
                throw new RuntimeException("Нет активной попытки для завершения");

            } else if (attempts.size() > 1) {
                log.warn("Found {} active attempts for test {} and user {}. Using first and cleaning others",
                        attempts.size(), testId, currentUser.getEmail());

                attempt = attempts.get(0);

                for (int i = 1; i < attempts.size(); i++) {
                    TestAttempt extraAttempt = attempts.get(i);
                    extraAttempt.setStatus(TypeStatus.BLOCKED);
                    attemptRepository.save(extraAttempt);
                    log.info("Marked extra attempt {} as ERROR", extraAttempt.getId_attempt());
                }

            } else {
                attempt = attempts.get(0);
                log.debug("Found single active attempt: {}", attempt.getId_attempt());
            }

            saveAnswers(answers, attempt, currentUser);

            attempt.setEnd_time(LocalDateTime.now());
            attempt.setStatus(TypeStatus.COMPLETED);
            attemptRepository.save(attempt);

            log.info("Test {} completed successfully for user {}", testId, currentUser.getEmail());
            return ResponseEntity.ok(Map.of("message", "Тест успешно завершен"));

        } catch (Exception e) {
            log.error("Error submitting test: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/start/{testId}")
    public ResponseEntity<?> startAttempt(@PathVariable Long testId) {
        try {
            Person currentUser = personRepository.findByEmail(getCurrentUserEmail())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

            log.info("Starting test {} for user {}", testId, currentUser.getEmail());

            List<TestAttempt> existingAttempts = attemptRepository.findByTestIdAndPersonIdAndStatus(
                    testId, currentUser.getId_person(), TypeStatus.IN_PROGRESS
            );

            if (!existingAttempts.isEmpty()) {
                log.warn("User {} already has {} active attempts for test {}. Returning existing attempt.",
                        currentUser.getEmail(), existingAttempts.size(), testId);

                return ResponseEntity.ok(existingAttempts.get(0));
            }

            TestAttempt attempt = new TestAttempt();
            attempt.setStart_time(LocalDateTime.now());
            attempt.setStatus(TypeStatus.IN_PROGRESS);
            attempt.setPersonAttempt(currentUser);
            attempt.setTestAttempt(new Test(testId));

            TestAttempt savedAttempt = attemptRepository.save(attempt);
            log.info("Created new attempt {} for test {} and user {}",
                    savedAttempt.getId_attempt(), testId, currentUser.getEmail());

            return ResponseEntity.ok(savedAttempt);

        } catch (Exception e) {
            log.error("Error starting test: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/finish/{attemptId}")
    public ResponseEntity<?> finishAttempt(@PathVariable Long attemptId) {
        try {
            TestAttempt attempt = attemptRepository.findById(attemptId)
                    .orElseThrow(() -> new RuntimeException("Попытка не найдена"));

            log.info("Finishing attempt {} for user {}", attemptId, attempt.getPersonAttempt().getEmail());

            attempt.setEnd_time(LocalDateTime.now());
            attempt.setStatus(TypeStatus.COMPLETED);

            TestAttempt finishedAttempt = attemptRepository.save(attempt);
            log.info("Attempt {} finished successfully", attemptId);

            return ResponseEntity.ok(finishedAttempt);

        } catch (Exception e) {
            log.error("Error finishing attempt: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/save-progress/{attemptId}")
    public ResponseEntity<?> saveProgress(@PathVariable Long attemptId, @RequestBody Map<String, Object> answers) {
        try {
            TestAttempt attempt = attemptRepository.findById(attemptId)
                    .orElseThrow(() -> new RuntimeException("Попытка не найдена"));

            log.info("Saving progress for attempt {}", attemptId);

            saveAnswers(answers, attempt, attempt.getPersonAttempt());

            log.info("Progress saved for attempt {}", attemptId);
            return ResponseEntity.ok(Map.of("message", "Прогресс сохранен"));

        } catch (Exception e) {
            log.error("Error saving progress: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private void saveAnswers(Map<String, Object> answers, TestAttempt attempt, Person currentUser) {
        if (answers == null || answers.isEmpty()) {
            log.debug("No answers to save for attempt {}", attempt.getId_attempt());
            return;
        }

        int answerCount = 0;

        for (Map.Entry<String, Object> entry : answers.entrySet()) {
            Long questionId = Long.valueOf(entry.getKey());
            Object answerValue = entry.getValue();

            if (answerValue instanceof Integer) {
                AttemptAnswer aa = new AttemptAnswer();
                aa.setTestAttempt(attempt);
                aa.setMainQuestion(new Question(questionId));
                aa.setText_answer(null);
                aa.setMainAnswer(new Answer(((Integer) answerValue).longValue()));
                aa.setAnswered_at(LocalDateTime.now());
                attemptAnswerRepository.save(aa);
                answerCount++;

            } else if (answerValue instanceof List) {
                List<?> list = (List<?>) answerValue;
                for (Object ansObj : list) {
                    if (ansObj instanceof Integer) {
                        AttemptAnswer aa = new AttemptAnswer();
                        aa.setTestAttempt(attempt);
                        aa.setMainQuestion(new Question(questionId));
                        aa.setText_answer(null);
                        aa.setMainAnswer(new Answer(((Integer) ansObj).longValue()));
                        aa.setAnswered_at(LocalDateTime.now());
                        attemptAnswerRepository.save(aa);
                        answerCount++;
                    }
                }

            } else if (answerValue instanceof String) {
                AttemptAnswer aa = new AttemptAnswer();
                aa.setTestAttempt(attempt);
                aa.setMainQuestion(new Question(questionId));
                aa.setText_answer((String) answerValue);
                aa.setMainAnswer(null);
                aa.setAnswered_at(LocalDateTime.now());
                attemptAnswerRepository.save(aa);
                answerCount++;
            }
        }
        log.debug("Saved {} answers for attempt {}", answerCount, attempt.getId_attempt());
    }
}