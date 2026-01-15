export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: number;
  user_id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationLog {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateReminderRequest {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface ApiError {
  success: false;
  error: string;
}