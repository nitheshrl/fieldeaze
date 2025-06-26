import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import mockData from '../mockData.json';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainNavigator';

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const menuItems = [
    { icon: 'person', title: 'Your profile', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'location-on', title: 'Manage Address', onPress: () => navigation.navigate('ManageAddress') },
    { icon: 'payment', title: 'Payment Methods' },
    { icon: 'calendar-today', title: 'My Bookings' },
    { icon: 'account-balance-wallet', title: 'My Wallet' },
    { icon: 'settings', title: 'Settings' },
    { icon: 'help', title: 'Help Center', onPress: () => navigation.navigate('HelpCenter') },
    { icon: 'privacy-tip', title: 'Privacy Policy' },
  ];

  const { user } = mockData;
  const [imgError, setImgError] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Image
            source={
              imgError
                ? require('../assets/icons/default-profile.png') // Add this image to your assets/icons
                : { uri: user.profileImage }
            }
            style={styles.profileImage}
            onError={() => setImgError(true)}
          />
          <View style={styles.editIconContainer}>
            <Icon name="edit" size={20} color="#fff" />
          </View>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              <Icon name={item.icon} size={24} color="#555" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#555" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileInfo: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#27537B',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
});

export default ProfileScreen; 