import { apiFetch } from './apiClient';
import type { NewsFilters, NewsResponse } from '../types/news';

function buildQuery(params: Record<string, string | number | undefined>) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export function getUserNews(userId: number) {
    return apiFetch<NewsResponse>(`/api/news/user/${userId}`);
}

export function searchEverything(userId: number, filters: NewsFilters) {
    return apiFetch<NewsResponse>(
        `/api/news/search/everything${buildQuery({
            userId,
            q: filters.q,
            language: filters.language,
            sources: filters.sources,
            page: filters.page ?? 1,
            pageSize: filters.pageSize ?? 24,
            sortBy: 'publishedAt',
        })}`
    );
}

export function searchTopHeadlines(userId: number, filters: NewsFilters) {
    return apiFetch<NewsResponse>(
        `/api/news/search/top-headlines${buildQuery({
            userId,
            q: filters.q,
            category: filters.category,
            page: filters.page ?? 1,
            pageSize: filters.pageSize ?? 24,
        })}`
    );
}