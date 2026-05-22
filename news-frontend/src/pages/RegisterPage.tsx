import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Link,
    MenuItem,
    Paper,
    TextField,
} from '@mui/material';
import { register } from '../api/authApi';

type RegisterPageProps = {
    onGoToLogin: () => void;
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

export function RegisterPage({ onGoToLogin }: RegisterPageProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [keyword, setKeyword] = useState('');
    const [language, setLanguage] = useState('pl');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleRegister() {
        setError('');
        setSuccess('');

        if (!name || !email || !password || !repeatedPassword || !keyword || !language) {
            setError('Uzupełnij wszystkie pola.');
            return;
        }

        if (password !== repeatedPassword) {
            setError('Hasła nie są takie same.');
            return;
        }

        try {
            await register({
                name,
                email,
                password,
                keyword,
                language,
            });

            setSuccess('Konto zostało utworzone. Możesz się teraz zalogować.');

            setName('');
            setEmail('');
            setPassword('');
            setRepeatedPassword('');
            setKeyword('');
            setLanguage('pl');
        } catch {
            setError('Nie udało się utworzyć konta.');
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f1f5f9',
                padding: { xs: 1.5, md: 2 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1.1fr' },
                gap: 1.5,
                overflow: 'hidden',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '28px',
                    padding: { xs: 2, md: 3 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                }}
            >
                <Box
                    component="form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleRegister();
                    }}
                    sx={{
                        width: '100%',
                        maxWidth: 440,
                    }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '14px',
                            backgroundColor: '#020617',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 22,
                            marginBottom: 1.5,
                            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.18)',
                        }}
                    >
                        <ShieldOutlinedIcon fontSize="medium" />
                    </Box>

                    <Box
                        component="p"
                        sx={{
                            margin: 0,
                            marginBottom: 1,
                            fontSize: 13,
                            fontWeight: 800,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: '#64748b',
                        }}
                    >
                        Nowe konto
                    </Box>

                    <Box
                        component="h1"
                        sx={{
                            margin: 0,
                            fontSize: { xs: 30, md: 34 },
                            lineHeight: 1.1,
                            fontWeight: 800,
                            color: '#020617',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Rejestracja
                    </Box>

                    <Box
                        component="p"
                        sx={{
                            marginTop: 1,
                            marginBottom: 2,
                            color: '#64748b',
                            fontSize: 14,
                            lineHeight: 1.4,
                        }}
                    >
                        Utwórz konto i ustaw pierwsze preferencje.
                    </Box>

                    <Box sx={{ display: 'grid', gap: 1.2 }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <TextField
                            label="Nazwa użytkownika"
                            placeholder="np. Magda"
                            fullWidth
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />

                        <TextField
                            label="Adres e-mail"
                            placeholder="np. magda@poczta.pl"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        <TextField
                            label="Hasło"
                            placeholder="Wpisz hasło"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />

                        <TextField
                            label="Powtórz hasło"
                            placeholder="Wpisz hasło ponownie"
                            type="password"
                            fullWidth
                            value={repeatedPassword}
                            onChange={(event) => setRepeatedPassword(event.target.value)}
                        />

                        <TextField
                            label="Pierwsze słowo kluczowe"
                            placeholder="np. sport"
                            fullWidth
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />

                        <TextField
                            label="Język wiadomości"
                            select
                            fullWidth
                            value={language}
                            onChange={(event) => setLanguage(event.target.value)}
                        >
                            {languageOptions.map((option) => (
                                <MenuItem key={option.abbreviation} value={option.abbreviation}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                marginTop: 1,
                                paddingY: 1.4,
                                borderRadius: '18px',
                                backgroundColor: '#020617',
                                fontWeight: 800,
                                textTransform: 'none',
                                fontSize: 16,
                                boxShadow: '0 16px 30px rgba(15, 23, 42, 0.25)',
                                '&:hover': {
                                    backgroundColor: '#1e293b',
                                },
                            }}
                        >
                            Utwórz konto
                        </Button>
                    </Box>

                    <Box
                        component="p"
                        sx={{
                            marginTop: 3,
                            textAlign: 'center',
                            color: '#64748b',
                            fontSize: 14,
                        }}
                    >
                        Masz już konto?{' '}
                        <Link
                            component="button"
                            type="button"
                            onClick={onGoToLogin}
                            underline="none"
                            sx={{
                                fontWeight: 900,
                                color: '#020617',
                                cursor: 'pointer',
                            }}
                        >
                            Zaloguj się
                        </Link>
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '32px',
                    padding: 6,
                    backgroundColor: '#020617',
                    color: '#ffffff',
                    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.28)',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: -90,
                        top: -90,
                        width: 260,
                        height: 260,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        left: 40,
                        bottom: -80,
                        width: 220,
                        height: 220,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                    }}
                />

                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                borderRadius: '999px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                paddingX: 2,
                                paddingY: 1,
                                fontSize: 20,
                                fontWeight: 800,
                                marginBottom: 4,
                            }}
                        >
                            Czas start
                        </Box>

                        <Box
                            component="h2"
                            sx={{
                                margin: 0,
                                maxWidth: 580,
                                fontSize: { lg: 40, xl: 48 },
                                lineHeight: 1.14,
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Wybierz język, słowo kluczowe i zacznij czytać już teraz.
                        </Box>

                        <Box
                            component="p"
                            sx={{
                                marginTop: 3,
                                maxWidth: 480,
                                color: '#cbd5e1',
                                fontSize: 17,
                                lineHeight: 1.7,
                            }}
                        >
                            Zapiszemy Twoje preferencje, dzięki czemu zobaczysz lepiej dopasowane newsy.
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 2,
                        }}
                    >
                        {['Szybkość', 'Wygoda', 'Personalizacja'].map((item) => (
                            <Box
                                key={item}
                                sx={{
                                    borderRadius: '24px',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: 2,
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <AutoAwesomeOutlinedIcon sx={{ fontSize: 24, marginBottom: 1 }} />
                                <Box sx={{ fontSize: 20, fontWeight: 800 }}>{item}</Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}