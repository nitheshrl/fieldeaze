import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#27537B" />
      </TouchableOpacity>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.lastUpdated}>Last updated: June 2024</Text>
      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.content}>
        This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
      </Text>
      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.content}>
        We may collect information such as your name, email, address, payment details, and usage data to provide and improve our services.
      </Text>
      <Text style={styles.sectionTitle}>3. How We Use Information</Text>
      <Text style={styles.content}>
        Your information is used to process bookings, manage your account, communicate with you, and enhance your experience.
      </Text>
      <Text style={styles.sectionTitle}>4. Data Security</Text>
      <Text style={styles.content}>
        We implement industry-standard security measures to protect your data from unauthorized access or disclosure.
      </Text>
      <Text style={styles.sectionTitle}>5. Your Rights</Text>
      <Text style={styles.content}>
        You have the right to access, update, or delete your personal information. Contact us for any privacy-related requests.
      </Text>
      <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
      <Text style={styles.content}>
        We may update this Privacy Policy from time to time. We will notify you of any significant changes.
      </Text>
      <Text style={styles.sectionTitle}>7. Contact Us</Text>
      <Text style={styles.content}>
        If you have any questions or concerns about this Privacy Policy, please contact our support team.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#27537B',
    marginTop: 0,
    alignSelf: 'center',
  },
  lastUpdated: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27537B',
    marginTop: 18,
    marginBottom: 6,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
});

export default PrivacyPolicyScreen; 