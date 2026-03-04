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
