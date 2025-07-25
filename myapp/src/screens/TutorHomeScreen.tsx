import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TutorHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Tutor!</Text>
    </View>
  );
};

export default TutorHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
