import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockWallet = {
  balance: 1250.75,
  transactions: [
    { id: '1', type: 'Credit', amount: 500, date: '2024-06-01', desc: 'Added to wallet' },
    { id: '2', type: 'Debit', amount: 250, date: '2024-06-05', desc: 'Service Payment' },
  ],
};

const MyWalletScreen = () => {
  const [wallet, setWallet] = useState(mockWallet);
  const navigation = useNavigation();

  const renderTransaction = ({ item }) => (
    <View style={styles.txnCard}>
      <Icon name={item.type === 'Credit' ? 'arrow-downward' : 'arrow-upward'} size={24} color={item.type === 'Credit' ? '#27ae60' : '#e74c3c'} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.txnDesc}>{item.desc}</Text>
        <Text style={styles.txnDate}>{item.date}</Text>
      </View>
      <Text style={[styles.txnAmount, { color: item.type === 'Credit' ? '#27ae60' : '#e74c3c' }] }>
        {item.type === 'Credit' ? '+' : '-'}₹{item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 18, marginBottom: 8 }}>
        <TouchableOpacity style={{ padding: 6, marginRight: 8 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#27537B" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, fontWeight: 'bold', color: '#27537B', textAlign: 'center', marginRight: 36 }}>My Wallet</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.balanceCard, { marginTop: 8 }]}> 
          <Icon name="account-balance-wallet" size={32} color="#27537B" />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceValue}>₹{wallet.balance.toFixed(2)}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {wallet.transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No transactions yet.</Text>
          </View>
        ) : (
          wallet.transactions.map(txn => (
            <View key={txn.id} style={{ marginBottom: 10 }}>{renderTransaction({ item: txn })}</View>
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
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>Add Funds</Text>
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
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#888',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#27537B',
    marginVertical: 8,
  },
  addFundsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27537B',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 'auto',
  },
  addFundsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27537B',
    marginBottom: 12,
  },
  txnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  txnDesc: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  txnDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 12,
  },
});

export default MyWalletScreen; 