export type Article = {
    author?: string | null;
    title?: string | null;
    description?: string | null;
    url?: string | null;
    urlToImage?: string | null;
    publishedAt?: string | null;
    content?: string | null;
};

export type NewsResponse = {
    status: string;
    totalResults: number;
    articles: Article[];
};

export type NewsFilters = {
    q?: string;
    language?: string;
    category?: string;
    sources?: string;
    page?: number;
    pageSize?: number;
};