import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const { userToken, logout } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const netState = await NetInfo.fetch();

      if (!netState.isConnected) {
        // 🔌 Offline: Load from AsyncStorage
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          Alert.alert('Offline', 'User data not found. Please connect to internet and login.');
        }
        setLoading(false);
        return;
      }

      // 🌐 Online: Fetch from API
      try {
        const res = await axios.get('https://poly-activity-points.onrender.com/api/auth/me', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (res.data.user) {
          setUser(res.data.user);
          await AsyncStorage.setItem('user', JSON.stringify(res.data.user)); // 🔁 Update local copy
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        Alert.alert('Session expired', 'Please log in again.');
        await logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.name || 'Student'}!</Text>
      <Text>Register Number: {user?.registerNumber}</Text>
      <Text>Email: {user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  logoutButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, marginTop: 20 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
});
