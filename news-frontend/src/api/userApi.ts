import { apiFetch, apiFetchVoid } from './apiClient';
import type {
    CreateKeywordRequest,
    CreateLanguageRequest,
    UpdateUserAccountRequest,
    UpdateUserAccountResponse,
    UserKeyword,
    UserLanguage,
    UserProfile,
} from '../types/user';

export function getUserProfile(userId: number) {
    return apiFetch<UserProfile>(`/users/full/${userId}`);
}

export function updateUserAccount(userId: number, data: UpdateUserAccountRequest) {
    return apiFetch<UpdateUserAccountResponse>(`/users/${userId}/account`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function createUserLanguage(userId: number, data: CreateLanguageRequest) {
    return apiFetch<UserLanguage>(`/languages?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function deleteUserLanguage(languageId: number) {
    return apiFetchVoid(`/languages/${languageId}`, {
        method: 'DELETE',
    });
}

export function createUserKeyword(userId: number, data: CreateKeywordRequest) {
    return apiFetch<UserKeyword>(`/keywords?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function deleteUserKeyword(keywordId: number) {
    return apiFetchVoid(`/keywords/${keywordId}`, {
        method: 'DELETE',
    });
}