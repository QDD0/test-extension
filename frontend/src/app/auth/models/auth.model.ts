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

export interface Question {
  id_test: number;
  question_text: string;
  type_question: string;
  points: number;
}
