import { useEffect, useState } from 'react';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
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
    Collapse,
    Container,
    Divider,
    IconButton,
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

type PreferencesMessage = {
    text: string;
    severity: 'success' | 'error';
};

const languageOptions = [
    { language: 'polski', abbreviation: 'pl', label: 'polski / pl' },
    { language: 'german', abbreviation: 'de', label: 'german / de' },
    { language: 'english', abbreviation: 'en', label: 'english / en' },
    { language: 'spanish', abbreviation: 'es', label: 'spanish / es' },
    { language: 'french', abbreviation: 'fr', label: 'french / fr' },
    { language: 'italian', abbreviation: 'it', label: 'italian / it' },
    { language: 'dutch', abbreviation: 'nl', label: 'dutch / nl' },
    { language: 'norwegian', abbreviation: 'no', label: 'norwegian / no' },
    { language: 'portuguese', abbreviation: 'pt', label: 'portuguese / pt' },
    { language: 'russian', abbreviation: 'ru', label: 'russian / ru' },
    { language: 'swedish', abbreviation: 'sv', label: 'swedish / sv' },
];

function getLanguageLabel(language: UserLanguage) {
    const name = language.language ?? '';
    const abbreviation = language.abbreviation ?? '';

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

    const [error, setError] = useState('');
    const [accountMessage, setAccountMessage] = useState('');
    const [preferencesMessage, setPreferencesMessage] =
        useState<PreferencesMessage | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    function getAvatarLetter() {
        const source = name.trim() || email.trim();

        return source.slice(0, 1).toUpperCase();
    }

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (!preferencesMessage) {
            return;
        }

        const timer = window.setTimeout(() => {
            setPreferencesMessage(null);
        }, 4500);

        return () => {
            window.clearTimeout(timer);
        };
    }, [preferencesMessage]);

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

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');

        onLogout();
    }

    async function handleSaveAccount() {
        setError('');
        setAccountMessage('');

        if (!name.trim()) {
            setError('Nazwa użytkownika jest wymagana.');
            return;
        }

        if (!email.trim()) {
            setError('Adres e-mail jest wymagany.');
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
            setOldPassword('');
            setNewPassword('');

            localStorage.setItem('token', response.token);
            localStorage.setItem('email', response.user.email);

            setAccountMessage('Dane konta zostały zapisane.');
        } catch {
            setError('Nie udało się zapisać danych konta. Sprawdź stare hasło.');
        }
    }

    async function handleAddLanguage() {
        setError('');

        const option = languageOptions.find(
            (language) => language.abbreviation === selectedLanguage
        );

        if (!option) {
            setPreferencesMessage({
                text: 'Wybierz poprawny język.',
                severity: 'error',
            });
            return;
        }

        const alreadyExists = languages.some(
            (language) => language.abbreviation === option.abbreviation
        );

        if (alreadyExists) {
            setPreferencesMessage({
                text: 'Ten język jest już dodany.',
                severity: 'error',
            });
            return;
        }

        try {
            const createdLanguage = await createUserLanguage(userId, {
                language: option.language,
                abbreviation: option.abbreviation,
            });

            setLanguages((current) => [...current, createdLanguage]);

            setPreferencesMessage({
                text: 'Język został dodany.',
                severity: 'success',
            });
        } catch {
            setPreferencesMessage({
                text: 'Nie udało się dodać języka.',
                severity: 'error',
            });
        }
    }

    async function handleRemoveLanguage(languageId: number) {
        setError('');

        try {
            await deleteUserLanguage(languageId);

            setLanguages((current) =>
                current.filter((language) => language.id !== languageId)
            );

            setPreferencesMessage({
                text: 'Język został usunięty.',
                severity: 'success',
            });
        } catch {
            setPreferencesMessage({
                text: 'Nie udało się usunąć języka.',
                severity: 'error',
            });
        }
    }

    async function handleAddKeyword() {
        setError('');

        const cleanedKeyword = newKeyword.trim();

        if (!cleanedKeyword) {
            setPreferencesMessage({
                text: 'Wpisz słowo kluczowe.',
                severity: 'error',
            });
            return;
        }

        const alreadyExists = keywords.some(
            (keyword) => keyword.keyword.toLowerCase() === cleanedKeyword.toLowerCase()
        );

        if (alreadyExists) {
            setPreferencesMessage({
                text: 'To słowo kluczowe jest już dodane.',
                severity: 'error',
            });
            return;
        }

        try {
            const createdKeyword = await createUserKeyword(userId, {
                keyword: cleanedKeyword,
            });

            setKeywords((current) => [...current, createdKeyword]);
            setNewKeyword('');

            setPreferencesMessage({
                text: 'Słowo kluczowe zostało dodane.',
                severity: 'success',
            });
        } catch {
            setPreferencesMessage({
                text: 'Nie udało się dodać słowa kluczowego.',
                severity: 'error',
            });
        }
    }

    async function handleRemoveKeyword(keywordId: number) {
        setError('');

        try {
            await deleteUserKeyword(keywordId);

            setKeywords((current) =>
                current.filter((keyword) => keyword.id !== keywordId)
            );

            setPreferencesMessage({
                text: 'Słowo kluczowe zostało usunięte.',
                severity: 'success',
            });
        } catch {
            setPreferencesMessage({
                text: 'Nie udało się usunąć słowa kluczowego.',
                severity: 'error',
            });
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

            <Container
                maxWidth="xl"
                sx={{
                    height: { xs: 'auto', md: 'calc(100vh - 64px)' },
                    py: { xs: 3, md: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: { xs: 'visible', md: 'hidden' },
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '18px', flexShrink: 0 }}>
                        {error}
                    </Alert>
                )}

                {isLoading && (
                    <Alert severity="info" sx={{ mb: 2, borderRadius: '18px', flexShrink: 0 }}>
                        Ładowanie danych użytkownika...
                    </Alert>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '28px',
                        p: { xs: 2, md: 2 },
                        mb: 2,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        flexShrink: 0,
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
                                    fontSize: { xs: 24, md: 30 },
                                    fontWeight: 900,
                                    color: '#020617',
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                Cześć, {name || profile?.email || 'użytkowniku'}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '0.95fr 1.35fr' },
                        gap: 3,
                        alignItems: 'stretch',
                        flex: 1,
                        minHeight: 0,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '28px',
                            p: { xs: 2, md: 3 },
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            height: '100%',
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                mb: 2,
                                alignItems: 'center',
                                flexShrink: 0,
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
                                {getAvatarLetter()}
                            </Avatar>

                            <Box>
                                <Typography sx={{ fontWeight: 900, color: '#020617' }}>
                                    {name || 'Użytkownik'}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: 14 }}>
                                    {email}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 2, flexShrink: 0 }} />

                        <Stack
                            spacing={2}
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {accountMessage && (
                                <Alert severity="success" sx={{ borderRadius: '16px', flexShrink: 0 }}>
                                    {accountMessage}
                                </Alert>
                            )}

                            <TextField
                                label="Nazwa użytkownika"
                                placeholder="np. Anna"
                                fullWidth
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />

                            <TextField
                                label="Adres e-mail"
                                placeholder="test@example.com"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />

                            <TextField
                                label="Nowe hasło"
                                placeholder="Zostaw puste, jeśli nie zmieniasz"
                                type="password"
                                fullWidth
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                            />

                            <TextField
                                label="Wpisz stare hasło"
                                placeholder="Potwierdź stare hasło"
                                type="password"
                                fullWidth
                                value={oldPassword}
                                onChange={(event) => setOldPassword(event.target.value)}
                            />

                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSaveAccount}
                                sx={{
                                    mt: 'auto',
                                    flexShrink: 0,
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
                            height: '100%',
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={1}
                            sx={{
                                mb: 2,
                                alignItems: { xs: 'flex-start', md: 'center' },
                                flexShrink: 0,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: 'center',
                                    flexShrink: 0,
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

                            <Collapse
                                in={Boolean(preferencesMessage)}
                                orientation="horizontal"
                                timeout={250}
                                sx={{
                                    maxWidth: { xs: '100%', md: 460 },
                                }}
                            >
                                {preferencesMessage && (
                                    <Alert
                                        severity={preferencesMessage.severity}
                                        sx={{
                                            py: 0.35,
                                            px: 1.25,
                                            borderRadius: '14px',
                                            fontSize: 14,
                                            alignItems: 'center',
                                            whiteSpace: { xs: 'normal', md: 'nowrap' },
                                            '& .MuiAlert-icon': {
                                                fontSize: 20,
                                                mr: 0.75,
                                            },
                                            '& .MuiAlert-message': {
                                                py: 0,
                                            },
                                        }}
                                    >
                                        {preferencesMessage.text}
                                    </Alert>
                                )}
                            </Collapse>
                        </Stack>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 2,
                                flex: 1,
                                minHeight: 0,
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '22px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f8fafc',
                                    height: '100%',
                                    minHeight: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        mb: 2,
                                        alignItems: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <LanguageOutlinedIcon sx={{ color: '#2563eb' }} />
                                    <Typography sx={{ fontWeight: 900, color: '#020617' }}>
                                        Języki
                                    </Typography>
                                </Stack>

                                <Stack
                                    spacing={1.2}
                                    sx={{
                                        mb: 2,
                                        flex: 1,
                                        minHeight: 0,
                                        overflowY: 'auto',
                                        pr: 0.5,
                                    }}
                                >
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
                                                    fontWeight: 800,
                                                    fontSize: 16,
                                                    height: 42,
                                                    flexShrink: 0,
                                                    '& .MuiChip-label': {
                                                        px: 1.5,
                                                    },
                                                    '& .MuiChip-deleteIcon': {
                                                        fontSize: 22,
                                                    },
                                                }}
                                            />
                                        ))
                                    )}
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        flexShrink: 0,
                                    }}
                                >
                                    <TextField
                                        label="Dodaj język"
                                        select
                                        fullWidth
                                        value={selectedLanguage}
                                        onChange={(event) =>
                                            setSelectedLanguage(event.target.value)
                                        }
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
                                            flexShrink: 0,
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
                                    height: '100%',
                                    minHeight: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        mb: 2,
                                        alignItems: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <KeyOutlinedIcon sx={{ color: '#2563eb' }} />
                                    <Typography sx={{ fontWeight: 900, color: '#020617' }}>
                                        Słowa kluczowe
                                    </Typography>
                                </Stack>

                                <Stack
                                    spacing={1.2}
                                    sx={{
                                        mb: 2,
                                        flex: 1,
                                        minHeight: 0,
                                        overflowY: 'auto',
                                        pr: 0.5,
                                    }}
                                >
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
                                                    fontWeight: 800,
                                                    fontSize: 16,
                                                    height: 42,
                                                    flexShrink: 0,
                                                    '& .MuiChip-label': {
                                                        px: 1.5,
                                                    },
                                                    '& .MuiChip-deleteIcon': {
                                                        fontSize: 22,
                                                    },
                                                }}
                                            />
                                        ))
                                    )}
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        flexShrink: 0,
                                    }}
                                >
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
                                            flexShrink: 0,
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
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}