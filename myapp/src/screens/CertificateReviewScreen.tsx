import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../utils/constants';

// 🔹 Define the correct route param type
type RootStackParamList = {
  CertificateReview: { certificate: any }; // Replace `any` with proper Certificate type if available
};

type CertificateReviewRouteProp = RouteProp<RootStackParamList, 'CertificateReview'>;

const CertificateReviewScreen = () => {
  const route = useRoute<CertificateReviewRouteProp>();
  const navigation = useNavigation();
  const { certificate } = route.params;
  const { userToken } = useAuth();

  const [points, setPoints] = useState(certificate.assignedPoints?.toString() || '');
  const [remarks, setRemarks] = useState('');

  const handleAction = async (status: 'Approved' | 'Rejected') => {
    try {
      await axios.put(
        `${BASE_URL}/api/tutor/certificates/${certificate._id}/review`,
        {
          status,
          updatedPoints: Number(points),
          remarks
        },
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );
      Alert.alert('Success', `Certificate ${status.toLowerCase()} successfully`);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Student: {certificate.student.name}</Text>
      <Text>Register No: {certificate.student.registerNumber}</Text>
      <Text>Category: {certificate.category.name}</Text>

      <Image
        source={{ uri: certificate.certificateUrl }}
        style={styles.image}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={points}
        onChangeText={setPoints}
        placeholder="Assign Points"
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={remarks}
        onChangeText={setRemarks}
        placeholder="Remarks (optional)"
      />

      <Button title="Approve" onPress={() => handleAction('Approved')} />
      <View style={{ height: 10 }} />
      <Button title="Reject" color="red" onPress={() => handleAction('Rejected')} />
    </View>
  );
};

export default CertificateReviewScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 18, fontWeight: 'bold' },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6
  }
});
