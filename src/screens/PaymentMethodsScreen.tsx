import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const mockCards = [
  { id: '1', type: 'Visa', last4: '1234', isDefault: true },
  { id: '2', type: 'Mastercard', last4: '5678', isDefault: false },
];

const PaymentMethodsScreen = () => {
  const [cards, setCards] = useState(mockCards);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleRemove = (id) => {
    Alert.alert('Remove Card', 'Are you sure you want to remove this card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setCards(cards.filter(c => c.id !== id)) },
    ]);
  };

  const handleSetDefault = (id) => {
    setCards(cards.map(card => ({ ...card, isDefault: card.id === id })));
  };

  const renderCard = ({ item }) => (
    <View style={[styles.cardContainer, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}>
      <View style={styles.cardInfo}>
        <Icon name={item.type === 'Visa' ? 'credit-card' : 'payment'} size={32} color={theme.primary} />
        <View style={{ marginLeft: 16 }}>
          <Text style={[styles.cardType, { color: theme.text }]}>{item.type} **** {item.last4}</Text>
          {item.isDefault && <Text style={[styles.defaultLabel, { color: theme.primary }]}>Default</Text>}
        </View>
      </View>
      <View style={styles.cardActions}>
        {!item.isDefault && (
          <TouchableOpacity style={[styles.setDefaultBtn, { backgroundColor: theme.primary }]} onPress={() => handleSetDefault(item.id)}>
            <Text style={[styles.setDefaultText, { color: '#fff' }]}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
          <Icon name="delete" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 18, marginBottom: 8 }}>
        <TouchableOpacity style={{ padding: 6, marginRight: 8 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#27537B" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, fontWeight: 'bold', color: '#27537B', textAlign: 'center', marginRight: 36 }}>Payment Methods</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="credit-card-off" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No payment methods added yet.</Text>
          </View>
        ) : (
          cards.map(card => (
            <View key={card.id} style={{ marginBottom: 18 }}>{renderCard({ item: card })}</View>
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
        onPress={() => Alert.alert('Add Payment Method', 'This would open the add payment method flow.')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>Add Payment Method</Text>
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
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  defaultLabel: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#27537B',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  setDefaultBtn: {
    backgroundColor: '#eaf1fa',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  setDefaultText: {
    color: '#27537B',
    fontWeight: '600',
    fontSize: 13,
  },
  removeBtn: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#27537B',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
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

export default PaymentMethodsScreen; 