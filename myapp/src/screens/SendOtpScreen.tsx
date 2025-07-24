// src/screens/SendOtpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'https://poly-activity-points.onrender.com/api/auth';

const SendOtpScreen = ({ navigation }: any) => {
  const [registerNumber, setRegisterNumber] = useState('');

  const handleSendOtp = async () => {
    if (!registerNumber.trim()) {
      Alert.alert('Error', 'Please enter your register number.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/send-otp`, {
        registerNumber: registerNumber.trim(),
      });
      Alert.alert('OTP Sent', 'Please check your college email.');

      // ✅ Navigate to correct screen
      navigation.navigate('VerifyOtp', { registerNumber: registerNumber.trim() });

    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Register Number</Text>
      <TextInput
        style={styles.input}
        placeholder="eg: 2301131789"
        value={registerNumber}
        onChangeText={setRegisterNumber}
      />
      <Button title="Send OTP" onPress={handleSendOtp} />
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

export default SendOtpScreen;
