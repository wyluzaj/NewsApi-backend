import { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { UserPage } from './pages/UserPage';

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
  const [appView, setAppView] = useState<'home' | 'user'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    function syncAuthState() {
      const hasToken = Boolean(localStorage.getItem('token'));

      setIsLoggedIn(hasToken);

      if (!hasToken) {
        setAppView('home');
      }
    }

    window.addEventListener('auth-changed', syncAuthState);
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener('auth-changed', syncAuthState);
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  function handleLogout() {
    setIsLoggedIn(false);
    setAppView('home');
  }

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {isLoggedIn ? (
            appView === 'user' ? (
                <UserPage
                    onGoToHome={() => setAppView('home')}
                    onLogout={handleLogout}
                />
            ) : (
                <HomePage
                    onLogout={handleLogout}
                    onGoToUserPanel={() => setAppView('user')}
                />
            )
        ) : authView === 'register' ? (
            <RegisterPage onGoToLogin={() => setAuthView('login')} />
        ) : (
            <LoginPage onGoToRegister={() => setAuthView('register')} />
        )}
      </ThemeProvider>
  );
}

export default App;