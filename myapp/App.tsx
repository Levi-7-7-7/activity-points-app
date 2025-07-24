// App.tsx
import React, { useEffect, useContext } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

const MainApp = () => {
  const { loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hide(); // ✅ Hide splash after auth check is done
    }
  }, [loading]);

  return <AppNavigator />;
};

const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
