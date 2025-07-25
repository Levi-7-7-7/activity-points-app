// src/screens/VerifyOtpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'https://poly-activity-points.onrender.com/api';

const VerifyOtpScreen = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { registerNumber } = route.params as { registerNumber: string };

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        registerNumber,
        otp,
        password,
      });

      Alert.alert('Success', 'Password set successfully. You can now login.', [
        {
          text: 'Go to Login',
          onPress: () => navigation.navigate('Login' as never),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'OTP verification failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      <Text style={styles.label}>Set Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default VerifyOtpScreen;
