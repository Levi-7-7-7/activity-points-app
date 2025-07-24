import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  userToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      try {
        const response = await fetch('https://poly-activity-points.onrender.com/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setUserToken(token); // ✅ valid token
        } else {
          console.log('Token is invalid or expired. Logging out...');
          await AsyncStorage.removeItem('token');
          setUserToken(null);
        }
      } catch (err) {
        console.error('Token verification failed (maybe no internet):', err);
        // Optionally: keep token but warn the user later in the UI
        setUserToken(token);
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
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
