import { apiFetch } from './apiClient';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
} from '../types/auth';

export function login(data: LoginRequest) {
    return apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function register(data: RegisterRequest) {
    return apiFetch<LoginResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}