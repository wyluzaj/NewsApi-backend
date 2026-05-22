import { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';

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
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    function syncAuthState() {
      setIsLoggedIn(Boolean(localStorage.getItem('token')));
    }

    window.addEventListener('auth-changed', syncAuthState);
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener('auth-changed', syncAuthState);
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {isLoggedIn ? (
            <HomePage onLogout={() => setIsLoggedIn(false)} />
        ) : authView === 'register' ? (
            <RegisterPage onGoToLogin={() => setAuthView('login')} />
        ) : (
            <LoginPage onGoToRegister={() => setAuthView('register')} />
        )}
      </ThemeProvider>
  );
}

export default App;