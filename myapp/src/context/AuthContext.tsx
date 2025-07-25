import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  registerNumber?: string;
  email: string;
  role: 'student' | 'tutor';
}

interface AuthContextProps {
  userToken: string | null;
  userInfo: User | null;
  login: (token: string, user: User) => Promise<void>;
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
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('userInfo');

    if (token && userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUserToken(token);
        setUserInfo(parsedUser);
      } catch (err) {
        console.error('Failed to parse user info:', err);
        await AsyncStorage.removeItem('userInfo');
        await AsyncStorage.removeItem('token');
        setUserToken(null);
        setUserInfo(null);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = async (token: string, user: User) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    setUserToken(token);
    setUserInfo(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userInfo');
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
