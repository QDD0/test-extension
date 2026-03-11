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
