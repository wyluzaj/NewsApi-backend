import { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#020617',
    },
    background: {
      default: '#f1f5f9',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {authView === 'register' ? (
            <RegisterPage onGoToLogin={() => setAuthView('login')} />
        ) : (
            <LoginPage onGoToRegister={() => setAuthView('register')} />
        )}
      </ThemeProvider>
  );
}

export default App;