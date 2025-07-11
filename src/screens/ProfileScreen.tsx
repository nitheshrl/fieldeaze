import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import mockData from '../mockData.json';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainNavigator';

const stats = [
  { label: 'Bookings', value: 12, icon: 'event' },
  { label: 'Total Spent', value: '₹1250', icon: 'account-balance-wallet' },
  { label: 'Points', value: 320, icon: 'star' },
];

const navCards = [
  { icon: 'event', title: 'My Bookings', onPress: 'MyBookings' },
  { icon: 'payment', title: 'Payment Methods', onPress: 'PaymentMethods' },
 // { icon: 'account-balance-wallet', title: 'My Wallet', onPress: 'MyWallet' },
  { icon: 'settings', title: 'Settings', onPress: 'Settings' },
  { icon: 'help', title: 'Help Center', onPress: 'HelpCenter' },
  { icon: 'privacy-tip', title: 'Privacy Policy', onPress: 'PrivacyPolicy' },
];

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { user } = mockData;
  const [imgError, setImgError] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Overview */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <Image
            source={imgError ? require('../assets/icons/default-profile.png') : { uri: user.profileImage }}
            style={styles.profileImage}
            onError={() => setImgError(true)}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            {/* Removed user.role as it's not present in user object */}
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, stats.length - 1 !== stats.indexOf(stat) && { marginRight: 16 }] }>
              <Icon name={stat.icon} size={22} color="#27537B" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Navigation Cards */}
      <View style={styles.navSection}>
        {navCards.map((item) => (
          <TouchableOpacity key={item.title} style={styles.navCard} onPress={() => navigation.navigate(item.onPress as any)}>
            <View style={styles.navIconWrap}>
              <Icon name={item.icon} size={24} color="#27537B" />
            </View>
            <Text style={styles.navTitle}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#bbb" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eee',
  },
  profileInfo: {
    marginLeft: 18,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  profileRole: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: '#27537B',
    borderRadius: 20,
    padding: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f7fafd',
    borderRadius: 10,
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27537B',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  navSection: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  navIconWrap: {
    backgroundColor: '#eaf1fa',
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
  },
  navTitle: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
});

export default ProfileScreen; 