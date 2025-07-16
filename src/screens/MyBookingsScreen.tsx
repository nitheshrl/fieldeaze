import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import mockData from '../mockData.json';

const statusColors = {
  Completed: '#27ae60',
  'In Progress': '#f39c12',
  Started: '#f39c12',
  Upcoming: '#f39c12',
  Cancelled: '#e74c3c',
  Complaint: '#e74c3c',
  Incomplete: '#e67e22',
};

const tabs = [
  { label: 'Upcoming', statuses: ['Upcoming', 'Started', 'In Progress'] },
  { label: 'Completed', statuses: ['Completed'] },
  { label: 'Cancelled', statuses: ['Cancelled', 'Complaint', 'Incomplete'] },
];

const MyBookingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].label);
  const navigation = useNavigation();
  // Combine all bookings from mockData
  const allBookings = [
    ...(mockData.bookings.ongoing || []),
    ...(mockData.bookings.completed || []),
    ...(mockData.bookings.incomplete || []),
    ...(mockData.bookings.complaints || []),
  ];
  // Filter bookings for the selected tab
  const tabObj = tabs.find(t => t.label === selectedTab);
  const bookings = allBookings.filter(b => tabObj.statuses.includes(b.status));

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingInfo}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#eaf1fa', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="event" size={26} color="#27537B" />
        </View>
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.service}>{item.service}</Text>
          <Text style={styles.date}>{item.provider} • {item.date || '2024-06-15'}</Text>
        </View>
      </View>
      <View style={styles.statusBadgeWrap}>
        <Text style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || '#ccc' }]}>{item.status.toUpperCase()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 18, marginBottom: 8 }}>
        <TouchableOpacity style={{ padding: 6, marginRight: 8 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#27537B" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, fontWeight: 'bold', color: '#27537B', textAlign: 'center', marginRight: 36 }}>My Bookings</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tabBtn, selectedTab === tab.label && styles.tabBtnActive]}
              onPress={() => setSelectedTab(tab.label)}
            >
              <Text style={[styles.tabText, selectedTab === tab.label && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Bookings List or Empty State */}
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="event-busy" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No {selectedTab.toLowerCase()} bookings found.</Text>
          </View>
        ) : (
          bookings.map(booking => (
            <View key={booking.id} style={{ marginBottom: 14 }}>{renderBooking({ item: booking })}</View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: '#27537B',
          borderRadius: 12,
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 18,
          marginBottom: 18,
        }}
        onPress={() => {}}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>Book New Service</Text>
        </View>
      </TouchableOpacity>
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
    marginBottom: 20,
    color: '#27537B',
    marginTop: 0,
    alignSelf: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 18,
    backgroundColor: '#eaf1fa',
    borderRadius: 8,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#27537B',
    fontWeight: '700',
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  service: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  statusBadgeWrap: {
    marginLeft: 12,
  },
  statusBadge: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 12,
  },
});

export default MyBookingsScreen; 