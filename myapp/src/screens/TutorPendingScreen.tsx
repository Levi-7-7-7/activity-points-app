import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

// ✅ Define the type for navigation route
type RootStackParamList = {
  CertificateReview: { certificate: any }; // replace `any` with stricter type if available
};

type TutorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CertificateReview'
>;

const TutorPendingScreen = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuth();
  const navigation = useNavigation<TutorScreenNavigationProp>();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tutor/certificates/pending`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setCertificates(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CertificateReview', { certificate: item })}
    >
      <Text style={styles.title}>
        {item.student?.name} - {item.category?.name}
      </Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pending Certificates</Text>
      <FlatList
        data={certificates}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TutorPendingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  title: { fontSize: 16, fontWeight: 'bold' }
});
