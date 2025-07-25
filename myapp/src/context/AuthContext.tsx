// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  userToken: string | null;
  userInfo: any | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  userInfo: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      try {
        const res = await fetch('https://poly-activity-points.onrender.com/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUserToken(token);
          setUserInfo(data.user); // ✅ set user info from backend
        } else {
          await AsyncStorage.removeItem('token');
          setUserToken(null);
          setUserInfo(null);
        }
      } catch (err) {
        console.error('Token check failed:', err);
        setUserToken(token); // fallback
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('token', token);
    setUserToken(token);

    try {
      const res = await fetch('https://poly-activity-points.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUserInfo(data.user); // ✅ set user info after login
    } catch (err) {
      console.error('Login fetch failed:', err);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
