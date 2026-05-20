import { useState } from 'react';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import {
    Alert,
    Box,
    Button,
    Link,
    Paper,
    TextField,
} from '@mui/material';
import { login } from '../api/authApi';

type LoginPageProps = {
    onGoToRegister?: () => void;
};

export function LoginPage({ onGoToRegister }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleLogin() {
        setError('');

        if (!email || !password) {
            setError('Uzupełnij e-mail i hasło.');
            return;
        }

        try {
            const response = await login({
                email,
                password,
            });

            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', String(response.userId));

            alert('Zalogowano poprawnie');
        } catch {
            setError('Nie udało się zalogować. Sprawdź dane.');
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f1f5f9',
                padding: { xs: 2, md: 3 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1.1fr' },
                gap: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '32px',
                    padding: { xs: 3, md: 6 },
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
                        handleLogin();
                    }}
                    sx={{
                        width: '100%',
                        maxWidth: 430,
                    }}
                >
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '18px',
                            backgroundColor: '#020617',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            marginBottom: 3,
                            boxShadow: '0 14px 30px rgba(15, 23, 42, 0.25)',
                        }}
                    >
                        <NewspaperOutlinedIcon fontSize="large" />
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
                        NewsFlow
                    </Box>

                    <Box
                        component="h1"
                        sx={{
                            margin: 0,
                            fontSize: { xs: 34, md: 40 },
                            lineHeight: 1.15,
                            fontWeight: 800,
                            color: '#020617',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Zaloguj się
                    </Box>

                    <Box
                        component="p"
                        sx={{
                            marginTop: 2,
                            marginBottom: 4,
                            color: '#64748b',
                            fontSize: 16,
                            lineHeight: 1.6,
                        }}
                    >
                        Po zalogowaniu przejdziesz do strony głównej z newsami
                    </Box>

                    <Box sx={{ display: 'grid', gap: 2 }}>
                        {error && <Alert severity="error">{error}</Alert>}

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
                            Zaloguj się
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
                        Nie masz konta?{' '}
                        <Link
                            component="button"
                            type="button"
                            onClick={onGoToRegister}
                            underline="none"
                            sx={{
                                fontWeight: 900,
                                color: '#020617',
                                cursor: 'pointer',
                            }}
                        >
                            Utwórz konto
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
                            Personalizowane wiadomości
                        </Box>

                        <Box
                            component="h2"
                            sx={{
                                margin: 0,
                                maxWidth: 580,
                                fontSize: { lg: 42, xl: 50 },
                                lineHeight: 1.12,
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Czytaj tylko to, co jest dla Ciebie ważne.
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
                            NewsFlow - wiadomości według Twoich preferencji
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