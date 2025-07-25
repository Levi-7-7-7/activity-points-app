import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

type Props = NativeStackScreenProps<any, 'Login'>;

const API_BASE_URL = 'https://poly-activity-points.onrender.com/api';

const LoginScreen = ({ navigation }: Props) => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!registerNumber || !password) {
      return Alert.alert('Error', 'Please enter both register number and password.');
    }

    const loginEndpoint = `${API_BASE_URL}/auth/login`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber, password }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (response.ok) {
        await login(data.token, data.user);
        Alert.alert('Success', `Welcome, ${data.user.name}`);
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.name === 'AbortError') {
        Alert.alert('Network Slow', 'Server is taking too long to respond. Please try again.');
      } else {
        Alert.alert('Error', 'Network error. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Register Number"
        value={registerNumber}
        onChangeText={setRegisterNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SendOtp')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  forgotText: { marginTop: 10, color: '#007bff', textDecorationLine: 'underline' },
});
