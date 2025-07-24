// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SendOtpScreen from '../screens/SendOtpScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import HomeScreen from '../screens/HomeScreen';
import AuthLandingScreen from '../screens/AuthLandingScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SendOtp" component={SendOtpScreen} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
