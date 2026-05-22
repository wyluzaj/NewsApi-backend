import { useEffect, useState } from 'react';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    createUserKeyword,
    createUserLanguage,
    deleteUserKeyword,
    deleteUserLanguage,
    getUserProfile,
    updateUserAccount,
} from '../api/userApi';
import type { UserKeyword, UserLanguage, UserProfile } from '../types/user';

type UserPageProps = {
    onGoToHome: () => void;
    onLogout: () => void;
};

const languageOptions = [
    { language: 'polski', abbreviation: 'pl', label: 'polski / pl' },
    { language: 'english', abbreviation: 'en', label: 'english / en' },
    { language: 'deutsch', abbreviation: 'de', label: 'deutsch / de' },
    { language: 'français', abbreviation: 'fr', label: 'français / fr' },
];

function getLanguageLabel(language: UserLanguage) {
    const abbreviation = language.abbreviation ?? '';
    const name = language.language ?? '';

    if (name && abbreviation) {
        return `${name} / ${abbreviation}`;
    }

    return abbreviation || name || 'język';
}

export function UserPage({ onGoToHome, onLogout }: UserPageProps) {
    const userId = Number(localStorage.getItem('userId'));
    const savedEmail = localStorage.getItem('email') ?? 'zalogowany użytkownik';

    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState(savedEmail);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const [languages, setLanguages] = useState<UserLanguage[]>([]);
    const [keywords, setKeywords] = useState<UserKeyword[]>([]);

    const [selectedLanguage, setSelectedLanguage] = useState('pl');
    const [newKeyword, setNewKeyword] = useState('');

    const [accountMessage, setAccountMessage] = useState('');
    const [preferencesMessage, setPreferencesMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function loadProfile() {
        if (!userId) {
            setError('Brak identyfikatora użytkownika. Zaloguj się ponownie.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await getUserProfile(userId);

            setProfile(response);
            setName(response.name ?? '');
            setEmail(response.email ?? savedEmail);
            setLanguages(response.languages ?? []);
            setKeywords(response.keywords ?? []);

            if (response.email) {
                localStorage.setItem('email', response.email);
            }
        } catch {
            setError('Nie udało się pobrać danych użytkownika.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');

        onLogout();
    }

    async function handleSaveAccount() {
        setError('');
        setAccountMessage('');

        if (!name.trim() || !email.trim()) {
            setError('Nazwa użytkownika i adres e-mail są wymagane.');
            return;
        }

        if (!oldPassword.trim()) {
            setError('Wpisz stare hasło, aby zapisać zmiany konta.');
            return;
        }

        try {
            const response = await updateUserAccount(userId, {
                name: name.trim(),
                email: email.trim(),
                oldPassword,
                newPassword: newPassword.trim() || undefined,
            });

            setProfile(response.user);
            setName(response.user.name ?? '');
            setEmail(response.user.email);
            setLanguages(response.user.languages ?? []);
            setKeywords(response.user.keywords ?? []);
            setNewPassword('');
            setOldPassword('');

            localStorage.setItem('token', response.token);
            localStorage.setItem('email', response.user.email);

            setAccountMessage('Dane konta zostały zapisane.');
        } catch {
            setError('Nie udało się zapisać danych konta. Sprawdź stare hasło.');
        }
    }

    async function handleAddLanguage() {
        setError('');
        setPreferencesMessage('');

        if (!selectedLanguage) {
            setError('Wybierz język.');
            return;
        }

        const option = languageOptions.find((item) => item.abbreviation === selectedLanguage);

        if (!option) {
            setError('Nieprawidłowy język.');
            return;
        }

        const alreadyExists = languages.some(
            (language) => language.abbreviation === option.abbreviation
        );

        if (alreadyExists) {
            setError('Ten język jest już dodany.');
            return;
        }

        try {
            const createdLanguage = await createUserLanguage(userId, {
                language: option.language,
                abbreviation: option.abbreviation,
            });

            setLanguages((current) => [...current, createdLanguage]);
            setPreferencesMessage('Język został dodany.');
        } catch {
            setError('Nie udało się dodać języka.');
        }
    }

    async function handleRemoveLanguage(languageId: number) {
        setError('');
        setPreferencesMessage('');

        try {
            await deleteUserLanguage(languageId);

            setLanguages((current) => current.filter((language) => language.id !== languageId));
            setPreferencesMessage('Język został usunięty.');
        } catch {
            setError('Nie udało się usunąć języka.');
        }
    }

    async function handleAddKeyword() {
        setError('');
        setPreferencesMessage('');

        const cleanedKeyword = newKeyword.trim();

        if (!cleanedKeyword) {
            setError('Wpisz słowo kluczowe.');
            return;
        }

        const alreadyExists = keywords.some(
            (keyword) => keyword.keyword.toLowerCase() === cleanedKeyword.toLowerCase()
        );

        if (alreadyExists) {
            setError('To słowo kluczowe jest już dodane.');
            return;
        }

        try {
            const createdKeyword = await createUserKeyword(userId, {
                keyword: cleanedKeyword,
            });

            setKeywords((current) => [...current, createdKeyword]);
            setNewKeyword('');
            setPreferencesMessage('Słowo kluczowe zostało dodane.');
        } catch {
            setError('Nie udało się dodać słowa kluczowego.');
        }
    }

    async function handleRemoveKeyword(keywordId: number) {
        setError('');
        setPreferencesMessage('');

        try {
            await deleteUserKeyword(keywordId);

            setKeywords((current) => current.filter((keyword) => keyword.id !== keywordId));
            setPreferencesMessage('Słowo kluczowe zostało usunięte.');
        } catch {
            setError('Nie udało się usunąć słowa kluczowego.');
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
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

                    <Typography sx={{ fontWeight: 900, mr: 'auto' }}>
                        NewsFlow
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={<HomeOutlinedIcon />}
                        onClick={onGoToHome}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '14px',
                            display: { xs: 'none', sm: 'inline-flex' },
                        }}
                    >
                        Strona główna
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '14px',
                            display: { xs: 'none', sm: 'inline-flex' },
                        }}
                    >
                        Panel użytkownika
                    </Button>

                    <Chip
                        avatar={<Avatar>{email.slice(0, 1).toUpperCase()}</Avatar>}
                        label={email}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                        }}
                    />

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutOutlinedIcon />}
                        onClick={handleLogout}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '14px',
                            backgroundColor: '#fff1f2',
                            borderColor: '#fecdd3',
                        }}
                    >
                        Wyloguj
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '28px',
                        p: { xs: 2, md: 3 },
                        mb: 3,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        sx={{
                            alignItems: { xs: 'flex-start', md: 'center' },
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 900,
                                    letterSpacing: '0.16em',
                                    textTransform: 'uppercase',
                                    color: '#64748b',
                                }}
                            >
                                Panel użytkownika
                            </Typography>

                            <Typography
                                component="h1"
                                sx={{
                                    mt: 0.5,
                                    fontSize: { xs: 26, md: 34 },
                                    fontWeight: 900,
                                    color: '#020617',
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                Cześć, możesz zmienić swoje ustawienia
                            </Typography>
                        </Box>

                        <Chip
                            avatar={<Avatar>{email.slice(0, 1).toUpperCase()}</Avatar>}
                            label={email}
                            sx={{
                                fontWeight: 800,
                                backgroundColor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                            }}
                        />
                    </Stack>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '18px' }}>
                        {error}
                    </Alert>
                )}

                {isLoading && (
                    <Alert severity="info" sx={{ mb: 2, borderRadius: '18px' }}>
                        Ładowanie danych użytkownika...
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '0.95fr 1.35fr' },
                        gap: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '28px',
                            p: { xs: 2, md: 3 },
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                mb: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 52,
                                    height: 52,
                                    backgroundColor: '#2563eb',
                                    fontWeight: 900,
                                }}
                            >
                                {email.slice(0, 1).toUpperCase()}
                            </Avatar>

                            <Box>
                                <Typography sx={{ color: '#64748b', fontSize: 14 }}>
                                    {email}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={2}>
                            {accountMessage && (
                                <Alert severity="success" sx={{ borderRadius: '16px' }}>
                                    {accountMessage}
                                </Alert>
                            )}


                            <TextField
                                label="Adres e-mail"
                                placeholder="test@example.com"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                slotProps={{
                                    input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon />
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                label="Nowe hasło"
                                placeholder="Zostaw puste, jeśli nie zmieniasz"
                                type="password"
                                fullWidth
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon/>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                label="Wpisz stare hasło"
                                placeholder="Potwierdź stare hasło"
                                type="password"
                                fullWidth
                                value={oldPassword}
                                onChange={(event) => setOldPassword(event.target.value)}
                                slotProps={{
                                    input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon />
                                        </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSaveAccount}
                                sx={{
                                    py: 1.4,
                                    borderRadius: '18px',
                                    backgroundColor: '#020617',
                                    fontWeight: 900,
                                    textTransform: 'none',
                                    boxShadow: '0 16px 30px rgba(15, 23, 42, 0.22)',
                                    '&:hover': {
                                        backgroundColor: '#1e293b',
                                    },
                                }}
                            >
                                Zapisz zmiany konta
                            </Button>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '28px',
                            p: { xs: 2, md: 3 },
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                mb: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                component="h2"
                                sx={{
                                    fontSize: { xs: 22, md: 26 },
                                    fontWeight: 900,
                                    color: '#020617',
                                }}
                            >
                                Preferencje
                            </Typography>
                            <SettingsOutlinedIcon sx={{ color: '#64748b' }} />
                        </Stack>

                        <Typography sx={{ color: '#64748b', mb: 3 }}>
                            Te ustawienia wpływają na wiadomości pokazywane na stronie głównej.
                        </Typography>

                        {preferencesMessage && (
                            <Alert severity="success" sx={{ mb: 2, borderRadius: '16px' }}>
                                {preferencesMessage}
                            </Alert>
                        )}

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 2,
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '22px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f8fafc',
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        mb: 2,
                                        alignItems: 'center',
                                    }}
                                >
                                    <LanguageOutlinedIcon sx={{ color: '#2563eb' }} />
                                    <Typography sx={{ fontWeight: 900, color: '#020617' }}>
                                        Języki
                                    </Typography>
                                </Stack>

                                <Stack spacing={1.2} sx={{ mb: 2 }}>
                                    {languages.length === 0 ? (
                                        <Typography sx={{ color: '#64748b', fontSize: 14 }}>
                                            Nie dodano jeszcze języków.
                                        </Typography>
                                    ) : (
                                        languages.map((language) => (
                                            <Chip
                                                key={language.id}
                                                label={getLanguageLabel(language)}
                                                onDelete={() => handleRemoveLanguage(language.id)}
                                                deleteIcon={<CloseOutlinedIcon />}
                                                sx={{
                                                    justifyContent: 'space-between',
                                                    borderRadius: '14px',
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e2e8f0',
                                                    fontWeight: 700,
                                                }}
                                            />
                                        ))
                                    )}
                                </Stack>

                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        label="Dodaj język"
                                        select
                                        fullWidth
                                        value={selectedLanguage}
                                        onChange={(event) => setSelectedLanguage(event.target.value)}
                                    >
                                        {languageOptions.map((language) => (
                                            <MenuItem
                                                key={language.abbreviation}
                                                value={language.abbreviation}
                                            >
                                                {language.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <IconButton
                                        onClick={handleAddLanguage}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '16px',
                                            backgroundColor: '#2563eb',
                                            color: '#ffffff',
                                            '&:hover': {
                                                backgroundColor: '#1d4ed8',
                                            },
                                        }}
                                    >
                                        <AddOutlinedIcon />
                                    </IconButton>
                                </Stack>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '22px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f8fafc',
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        mb: 2,
                                        alignItems: 'center',
                                    }}
                                >
                                    <KeyOutlinedIcon sx={{ color: '#2563eb' }} />
                                    <Typography sx={{ fontWeight: 900, color: '#020617' }}>
                                        Słowa kluczowe
                                    </Typography>
                                </Stack>

                                <Stack spacing={1.2} sx={{ mb: 2 }}>
                                    {keywords.length === 0 ? (
                                        <Typography sx={{ color: '#64748b', fontSize: 14 }}>
                                            Nie dodano jeszcze słów kluczowych.
                                        </Typography>
                                    ) : (
                                        keywords.map((keyword) => (
                                            <Chip
                                                key={keyword.id}
                                                label={`#${keyword.keyword}`}
                                                onDelete={() => handleRemoveKeyword(keyword.id)}
                                                deleteIcon={<CloseOutlinedIcon />}
                                                sx={{
                                                    justifyContent: 'space-between',
                                                    borderRadius: '14px',
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e2e8f0',
                                                    fontWeight: 700,
                                                }}
                                            />
                                        ))
                                    )}
                                </Stack>

                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        label="Dodaj słowo"
                                        placeholder="np. sport"
                                        fullWidth
                                        value={newKeyword}
                                        onChange={(event) => setNewKeyword(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleAddKeyword();
                                            }
                                        }}
                                    />

                                    <IconButton
                                        onClick={handleAddKeyword}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '16px',
                                            backgroundColor: '#2563eb',
                                            color: '#ffffff',
                                            '&:hover': {
                                                backgroundColor: '#1d4ed8',
                                            },
                                        }}
                                    >
                                        <AddOutlinedIcon />
                                    </IconButton>
                                </Stack>
                            </Paper>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.4,
                                borderRadius: '18px',
                                backgroundColor: '#020617',
                                fontWeight: 900,
                                textTransform: 'none',
                                boxShadow: '0 16px 30px rgba(15, 23, 42, 0.22)',
                                '&:hover': {
                                    backgroundColor: '#1e293b',
                                },
                            }}
                            onClick={() => setPreferencesMessage('Preferencje są zapisywane po dodaniu lub usunięciu elementu.')}
                        >
                            Zapisz zmiany
                        </Button>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}