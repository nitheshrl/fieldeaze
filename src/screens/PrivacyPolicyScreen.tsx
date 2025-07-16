import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 18, marginBottom: 8 }}>
        <TouchableOpacity style={{ padding: 6, marginRight: 8 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#27537B" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, fontWeight: 'bold', color: '#27537B', textAlign: 'center', marginRight: 36 }}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: '#888', fontSize: 13, marginBottom: 18, textAlign: 'center' }}>Last updated: June 2024</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#27537B', marginBottom: 6, marginTop: 10 }}>1. Introduction</Text>
        <Text style={{ fontSize: 15, color: '#222', marginBottom: 18 }}>This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#27537B', marginBottom: 6 }}>2. Information We Collect</Text>
        <Text style={{ fontSize: 15, color: '#222', marginBottom: 18 }}>We may collect information such as your name, email, address, payment details, and usage data to provide and improve our services.</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#27537B', marginBottom: 6 }}>3. How We Use Information</Text>
        <Text style={{ fontSize: 15, color: '#222', marginBottom: 18 }}>Your information is used to process bookings, manage your account, communicate with you, and enhance your experience.</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#27537B', marginBottom: 6 }}>4. Data Security</Text>
        <Text style={{ fontSize: 15, color: '#222', marginBottom: 18 }}>We implement industry-standard security measures to protect your data from unauthorized access or disclosure.</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#27537B', marginBottom: 6 }}>5. Your Rights</Text>
        <Text style={{ fontSize: 15, color: '#222', marginBottom: 18 }}>You have the right to access, update, or delete your personal information. Contact us for any privacy-related requests.</Text>
      </ScrollView>
    </SafeAreaView>
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