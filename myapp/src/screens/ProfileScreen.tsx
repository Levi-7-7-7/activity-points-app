import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ProfileScreen = () => {
  const { userInfo, userToken, logout, login } = useAuth();
  const [email, setEmail] = useState(userInfo?.email || '');
  const [editing, setEditing] = useState(false);

  const handleUpdate = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/tutor/update-email`,
        { email },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      await login(userToken!, res.data.user); // Update local user info
      Alert.alert('Success', 'Email updated successfully');
      setEditing(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update email');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Profile</Text>
      <Text>Name: {userInfo?.name}</Text>
      <Text>Role: {userInfo?.role}</Text>

      {editing ? (
        <>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
          />
          <Button title="Save" onPress={handleUpdate} />
        </>
      ) : (
        <>
          <Text>Email: {userInfo?.email}</Text>
          <Button title="Edit Email" onPress={() => setEditing(true)} />
        </>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={logout} />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    marginBottom: 10,
    borderRadius: 8,
  },
});
