import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'https://poly-activity-points.onrender.com/api';

const SendOtpScreen = ({ navigation }: any) => {
  const [registerNumber, setRegisterNumber] = useState('');

  const handleSendOtp = async () => {
    if (!registerNumber.trim()) {
    Alert.alert('Error', 'Please enter your register number.');
    return;
    }

    const endpoint = `${API_BASE_URL}/auth/send-otp`; // ✅ Always use this route

    try {
    const res = await axios.post(endpoint, {
      registerNumber: registerNumber.trim(),
    });

      Alert.alert('OTP Sent', 'Please check your college email.');

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
