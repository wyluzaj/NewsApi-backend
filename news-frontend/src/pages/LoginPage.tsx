import { useState } from 'react';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import { login } from '../api/authApi';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {
        try {
            const response = await login({
                email,
                password,
            });

            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', String(response.userId));

            alert('Zalogowano poprawnie');
        } catch {
            alert('Błąd logowania');
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Logowanie
                </Typography>

                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <TextField
                    label="Hasło"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    onClick={handleLogin}
                >
                    Zaloguj
                </Button>
            </Paper>
        </Container>
    );
}