import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import mockData from '../mockData.json';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Address {
  id: number;
  label: string;
  address: string;
}

const ManageAddressScreen: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (mockData.user && mockData.user.addresses) {
      setAddresses(mockData.user.addresses);
    }
  }, []);

  const renderItem = ({ item }: { item: Address }) => (
    <View style={styles.addressItem}>
      <Icon name="map-pin" size={20} color="#6C63FF" style={styles.addressIcon} />
      <View>
        <Text style={styles.addressLabel}>{item.label}</Text>
        <Text style={styles.addressText}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#27537B" />
        </TouchableOpacity>
        <Text style={styles.header}>Manage Address</Text>
      </View>
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={[styles.addAddressBtn, { borderColor: '#27537B' }]} onPress={() => navigation.navigate('AddAddress' as never)}>
        <Text style={[styles.addAddressText, { color: '#27537B' }]}>+ Add New Shipping Address</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.applyBtn}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
  },
  backBtn: {
    top: 10,
    marginRight: 12,
    padding: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    left: 50,
    top: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 0,
    left: 10,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  addressIcon: {
    marginRight: 14,
    marginTop: 2,
  },
  addressLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  addressText: {
    color: '#888',
    fontSize: 14,
    maxWidth: width - 80,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 2,
  },
  addAddressBtn: {
    borderWidth: 1,
    borderColor: '#6C63FF33',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  addAddressText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '500',
  },
  applyBtn: {
    backgroundColor: '#4A5C5F',
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManageAddressScreen; 