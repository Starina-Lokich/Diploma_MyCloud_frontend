import type { User } from './userTypes';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}
