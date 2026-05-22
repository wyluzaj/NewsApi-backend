import { useEffect, useState } from 'react';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import { getUserNews, searchEverything, searchTopHeadlines } from '../api/newsApi';
import type { Article, NewsFilters } from '../types/news';

type HomePageProps = {
    onLogout: () => void;
    onGoToUserPanel?: () => void;
};

const PAGE_SIZE = 20;
const MAX_SEARCH_PAGES = 5;

const categories = [
    { value: '', label: 'Wszystkie kategorie' },
    { value: 'business', label: 'Biznes' },
    { value: 'entertainment', label: 'Rozrywka' },
    { value: 'general', label: 'Ogólne' },
    { value: 'health', label: 'Zdrowie' },
    { value: 'science', label: 'Nauka' },
    { value: 'sports', label: 'Sport' },
    { value: 'technology', label: 'Technologia' },
];

const languages = [
    { value: '', label: 'Dowolny język' },
    { value: 'pl', label: 'polski / pl' },
    { value: 'en', label: 'english / en' },
    { value: 'de', label: 'deutsch / de' },
    { value: 'fr', label: 'français / fr' },
];

function formatDate(value?: string | null) {
    if (!value) return 'Brak daty';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function hasAnySearchFilter(filters: NewsFilters) {
    return Boolean(filters.q || filters.language || filters.category || filters.sources);
}

export function HomePage({ onLogout, onGoToUserPanel }: HomePageProps) {
    const userId = Number(localStorage.getItem('userId'));
    const userEmail = localStorage.getItem('email') ?? 'zalogowany użytkownik';

    const [articles, setArticles] = useState<Article[]>([]);
    const [totalResults, setTotalResults] = useState(0);

    const [filters, setFilters] = useState<NewsFilters>({
        q: '',
        language: '',
        category: '',
        sources: '',
        page: 1,
        pageSize: PAGE_SIZE,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const isSearchMode = hasAnySearchFilter(filters);
    const realTotalPages = Math.ceil(totalResults / PAGE_SIZE);
    const totalPages = isSearchMode ? Math.min(realTotalPages || 1, MAX_SEARCH_PAGES) : 1;

    async function loadNews(nextFilters = filters) {
        if (!userId) {
            setError('Brak identyfikatora użytkownika. Zaloguj się ponownie.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const nextIsSearchMode = hasAnySearchFilter(nextFilters);

            const fixedFilters: NewsFilters = {
                ...nextFilters,
                page: nextFilters.page ?? 1,
                pageSize: PAGE_SIZE,
            };

            const response = fixedFilters.category
                ? await searchTopHeadlines(userId, fixedFilters)
                : nextIsSearchMode
                    ? await searchEverything(userId, fixedFilters)
                    : await getUserNews(userId);

            const articlesFromBackend = response.articles ?? [];

            setArticles(articlesFromBackend.slice(0, PAGE_SIZE));

            if (nextIsSearchMode) {
                setTotalResults(response.totalResults ?? articlesFromBackend.length);
            } else {
                setTotalResults(articlesFromBackend.length);
            }
        } catch {
            setError(
                'Nie udało się pobrać wiadomości. Darmowe NewsAPI pozwala wyświetlić tylko ograniczoną liczbę stron wyników.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadNews();
    }, []);

    function handleFilterChange(key: keyof NewsFilters, value: string) {
        setFilters((current) => ({
            ...current,
            [key]: value,
            page: 1,
            pageSize: PAGE_SIZE,
        }));
    }

    function handleSubmitFilters() {
        const nextFilters = {
            ...filters,
            page: 1,
            pageSize: PAGE_SIZE,
        };

        setFilters(nextFilters);
        loadNews(nextFilters);
    }

    async function handlePageChange(nextPage: number) {
        if (nextPage < 1 || nextPage > totalPages) return;

        const nextFilters = {
            ...filters,
            page: nextPage,
            pageSize: PAGE_SIZE,
        };

        setFilters(nextFilters);
        await loadNews(nextFilters);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');

        onLogout();
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            {/* Górny pasek nawigacji */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: '#ffffffcc',
                    color: '#020617',
                    borderBottom: '1px solid #e2e8f0',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    {/* Ikona aplikacji */}
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '14px',
                            backgroundColor: '#020617',
                            color: '#ffffff',
                            display: 'grid',
                            placeItems: 'center',
                        }}
                    >
                        <NewspaperOutlinedIcon />
                    </Box>
                    {/* Nazwa aplikacji */}
                    <Typography sx={{ fontWeight: 900, mr: 'auto' }}>
                        NewsFlow
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ textTransform: 'none', borderRadius: '14px' }}
                    >
                        Strona główna
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={onGoToUserPanel}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '14px',
                            display: { xs: 'none', sm: 'inline-flex' },
                        }}
                    >
                        Panel użytkownika
                    </Button>


                    {/* Email aktualnie zalogowanego użytkownika */}
                    <Chip
                        avatar={<Avatar>{userEmail.slice(0, 1).toUpperCase()}</Avatar>}
                        label={userEmail}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                        }}
                    />

                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<LogoutOutlinedIcon />}
                        onClick={handleLogout}
                        sx={{ textTransform: 'none', borderRadius: '14px' }}
                    >
                        Wyloguj
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
                {/* Nagłówek strony */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '28px',
                        p: { xs: 2.5, md: 4 },
                        mb: 3,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#64748b',
                            fontSize: 13,
                            fontWeight: 900,
                            letterSpacing: '0.12em',
                        }}
                    >
                        STRONA GŁÓWNA
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Cześć! Oto Twoje wiadomości
                    </Typography>
                </Paper>
                {/* Sekcja filtrów */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '28px',
                        p: { xs: 2, md: 3 },
                        mb: 3,
                    }}
                >
                    <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
                        <FilterAltOutlinedIcon />
                        <Typography sx={{ fontWeight: 900 }}>
                            Filtry wiadomości
                        </Typography>
                    </Stack>
                    {/* Formularz filtrów */}
                    <Box
                        component="form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSubmitFilters();
                        }}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1.4fr 1fr 1fr 1fr auto',
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Szukaj"
                            placeholder="np. AI, sport, pogoda"
                            value={filters.q ?? ''}
                            onChange={(event) => handleFilterChange('q', event.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon sx={{ color: '#94a3b8' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <TextField
                            label="Język"
                            select
                            value={filters.language ?? ''}
                            onChange={(event) => handleFilterChange('language', event.target.value)}
                            disabled={Boolean(filters.category)}
                            helperText={filters.category ? 'Kategoria korzysta z osobnego wyszukiwania' : ' '}
                        >
                            {languages.map((language) => (
                                <MenuItem key={language.value} value={language.value}>
                                    {language.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Kategoria"
                            select
                            value={filters.category ?? ''}
                            onChange={(event) => handleFilterChange('category', event.target.value)}
                            helperText=" "
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.value} value={category.value}>
                                    {category.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Źródło"
                            placeholder="np. bbc-news"
                            value={filters.sources ?? ''}
                            onChange={(event) => handleFilterChange('sources', event.target.value)}
                            disabled={Boolean(filters.category)}
                            helperText={filters.category ? 'Źródło działa bez wybranej kategorii' : ' '}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                borderRadius: '16px',
                                px: 3,
                                height: 56,
                                textTransform: 'none',
                                fontWeight: 900,
                            }}
                        >
                            Filtruj
                        </Button>
                    </Box>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}


                {isSearchMode && totalResults > PAGE_SIZE * MAX_SEARCH_PAGES && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Darmowe NewsAPI pozwala przeglądać ograniczoną liczbę wyników, maksymalnie {PAGE_SIZE * MAX_SEARCH_PAGES} artykułów.
                    </Alert>
                )}

                {!isLoading && articles.length === 0 && !error && (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '28px',
                            p: 5,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                            Brak wiadomości do wyświetlenia
                        </Typography>

                        <Typography sx={{ color: '#64748b', mt: 1 }}>
                            Zmień filtry albo dodaj preferencje w panelu użytkownika.
                        </Typography>
                    </Paper>
                )}
                {/* Lista kafelków z artykułami */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, 1fr)',
                            xl: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {articles.map((article, index) => (
                        <Card
                            key={`${article.url ?? article.title}-${index}`}
                            elevation={0}
                            sx={{
                                borderRadius: '28px',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                            }}
                        >
                            {article.urlToImage ? (
                                <CardMedia
                                    component="img"
                                    height="210"
                                    image={article.urlToImage}
                                    alt={article.title ?? 'Obrazek artykułu'}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: 210,
                                        display: 'grid',
                                        placeItems: 'center',
                                        backgroundColor: '#e2e8f0',
                                        color: '#64748b',
                                    }}
                                >
                                    <ImageNotSupportedOutlinedIcon fontSize="large" />
                                </Box>
                            )}

                            <CardContent
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
                                >
                                    <Chip size="small" label={article.author || 'Źródło nieznane'} />
                                    <Chip size="small" label={formatDate(article.publishedAt)} />
                                </Stack>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 900,
                                        lineHeight: 1.2,
                                        mb: 1,
                                    }}
                                >
                                    {article.title || 'Brak tytułu'}
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setSelectedArticle(article)}
                                    sx={{
                                        mt: 'auto',
                                        height: 52,
                                        borderRadius: '16px',
                                        textTransform: 'none',
                                        fontWeight: 900,
                                    }}
                                >
                                    Podgląd
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {isSearchMode && totalPages > 1 && (
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            mt: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="outlined"
                            disabled={isLoading || (filters.page ?? 1) <= 1}
                            onClick={() => handlePageChange((filters.page ?? 1) - 1)}
                            sx={{
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontWeight: 900,
                            }}
                        >
                            Poprzednia
                        </Button>

                        <Typography sx={{ fontWeight: 900 }}>
                            Strona {filters.page ?? 1} z {totalPages}
                        </Typography>

                        <Button
                            variant="contained"
                            disabled={isLoading || (filters.page ?? 1) >= totalPages}
                            onClick={() => handlePageChange((filters.page ?? 1) + 1)}
                            sx={{
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontWeight: 900,
                            }}
                        >
                            Następna
                        </Button>
                    </Stack>
                )}
            </Container>
            {/* podgląd artykułu */}
            <Dialog
                open={Boolean(selectedArticle)}
                onClose={() => setSelectedArticle(null)}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '24px',
                        maxHeight: '90vh',
                    },
                }}
            >
                {selectedArticle && (
                    <>
                        <DialogTitle sx={{ fontWeight: 900 }}>
                            {selectedArticle.title || 'Podgląd wiadomości'}
                        </DialogTitle>

                        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
                            {selectedArticle.urlToImage && (
                                <Box
                                    component="img"
                                    src={selectedArticle.urlToImage}
                                    alt="Obrazek artykułu"
                                    sx={{
                                        width: '100%',
                                        maxHeight: 360,
                                        objectFit: 'cover',
                                        borderRadius: '24px',
                                        mb: 2,
                                    }}
                                />
                            )}

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
                            >
                                <Chip label={selectedArticle.author || 'Źródło nieznane'} />
                                <Chip label={formatDate(selectedArticle.publishedAt)} />
                            </Stack>

                            <Typography sx={{ fontWeight: 900, mb: 1 }}>
                                Krótki opis
                            </Typography>

                            <Typography
                                sx={{
                                    color: '#475569',
                                    lineHeight: 1.7,
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                {selectedArticle.description || 'Brak opisu.'}
                            </Typography>
                        </DialogContent>

                        <DialogActions sx={{ p: 3 }}>
                            <Button
                                onClick={() => setSelectedArticle(null)}
                                sx={{ textTransform: 'none' }}
                            >
                                Zamknij
                            </Button>

                            <Button
                                variant="contained"
                                disabled={!selectedArticle.url}
                                onClick={() => {
                                    if (selectedArticle.url) {
                                        window.open(selectedArticle.url, '_blank', 'noreferrer');
                                    }
                                }}
                                sx={{
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    fontWeight: 900,
                                    gap: 1,
                                }}
                            >
                                Otwórz źródło
                                <OpenInNewOutlinedIcon fontSize="small" />
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}