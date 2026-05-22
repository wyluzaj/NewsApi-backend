export type UserLanguage = {
    id: number;
    language?: string | null;
    abbreviation?: string | null;
};

export type UserKeyword = {
    id: number;
    keyword: string;
};

export type UserProfile = {
    id: number;
    email: string;
    name?: string | null;
    languages?: UserLanguage[];
    keywords?: UserKeyword[];
};

export type UpdateUserAccountRequest = {
    name: string;
    email: string;
    oldPassword: string;
    newPassword?: string;
};

export type UpdateUserAccountResponse = {
    token: string;
    user: UserProfile;
};

export type CreateLanguageRequest = {
    language: string;
    abbreviation: string;
};

export type CreateKeywordRequest = {
    keyword: string;
};