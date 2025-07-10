import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const mockBookings = [
  { id: '1', service: 'AC Repair', date: '2024-06-10', status: 'Completed' },
  { id: '2', service: 'Washing Machine Service', date: '2024-06-15', status: 'Upcoming' },
  { id: '3', service: 'TV Installation', date: '2024-06-18', status: 'Cancelled' },
];

const statusColors = {
  Completed: '#27ae60',
  Upcoming: '#f39c12',
  Cancelled: '#e74c3c',
};

const tabs = ['Upcoming', 'Completed', 'Cancelled'];

const MyBookingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const navigation = useNavigation();
  const bookings = mockBookings.filter(b => b.status === selectedTab);

  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingInfo}>
        <Icon name="event" size={32} color="#27537B" />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.service}>{item.service}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.statusBadgeWrap}>
        <Text style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || '#ccc' }]}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#27537B" />
      </TouchableOpacity>
      <Text style={styles.title}>My Bookings</Text>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, selectedTab === tab && styles.tabBtnActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</Text>
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
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
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