import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sable_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sable_token') || '');
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing token with backend on mount
  useEffect(() => {
    async function verifyUser() {
      const savedToken = localStorage.getItem('sable_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('sable_user', JSON.stringify(data.user));
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Auth verification check skipped or offline:', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sable_token', data.token);
    localStorage.setItem('sable_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sable_token', data.token);
    localStorage.setItem('sable_user', JSON.stringify(data.user));
    return data.user;
  };

  const demoLogin = async (provider = 'github') => {
    const res = await fetch(`${API_BASE}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Demo login failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sable_token', data.token);
    localStorage.setItem('sable_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('sable_token');
    localStorage.removeItem('sable_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
