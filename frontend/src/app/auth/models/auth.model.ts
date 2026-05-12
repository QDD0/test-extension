export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  surname: string;
  email: string
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  role: string;
}

export interface Test {
  id_test: number;
  title: string;
  description: string;
  duration_minutes: number;
  created_by: number;
  created_at: Date;
}

export interface Answer {
  id_answer: number;
  answer_text: string;
  is_correct: boolean;
}

export type TypeQuestion = 'SINGLE' | 'MULTIPLE' | 'TEXT';

export interface Question {
  id_question: number;
  question_text: string;
  type_question: TypeQuestion;
  points: number;
  answers: Answer[];
}

export type TypeStatus = 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface TestAttempt {
  id_attempt?: number;
  id_person: number;
  id_test: number;
  start_time?: Date;
  end_time?: Date;
  score?: number;
  status?: TypeStatus;
  testTitle?: string;
}

export interface AttemptAnswer {
  id_attempt_answer?: number;
  id_attempt: number;
  id_question: number;
  id_answer?: number;
  text_answer?: string;
  answered_at?: Date;
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  correct: boolean;
  userAnswer: string[];
  correctAnswers: string[];
}

export interface TestResult {
  score: number;
  totalPoints: number;
  percentage: number;
  questions: QuestionResult[];
}

export interface ActivityEvent {
  id_event: number;
  id_attempt: number;
  event_type: string;
  event_time: Date;
  event_data: any;
}
