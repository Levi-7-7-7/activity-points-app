import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import TutorTabs from './TutorTabs'; // Main tab layout for tutors

// Auth and Student Screens
import LoginScreen from '../screens/LoginScreen';
import SendOtpScreen from '../screens/SendOtpScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import HomeScreen from '../screens/HomeScreen';
import AuthLandingScreen from '../screens/AuthLandingScreen';

// Tutor-only Screens
import CertificateReviewScreen from '../screens/CertificateReviewScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userToken, userInfo, loading } = useContext(AuthContext);

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
          userInfo?.role === 'tutor' ? (
            <>
              {/* Main tutor tab navigator (Home, Pending, Profile) */}
              <Stack.Screen name="TutorTabs" component={TutorTabs} />
              {/* Extra screen accessible from within the tabs */}
              <Stack.Screen name="CertificateReview" component={CertificateReviewScreen} />
            </>
          ) : (
            <>
              {/* Student dashboard */}
              <Stack.Screen name="Home" component={HomeScreen} />
              {/* Add other student-specific screens here */}
            </>
          )
        ) : (
          <>
            {/* Unauthenticated flow */}
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
