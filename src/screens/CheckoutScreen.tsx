import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useBookmarks as useCart } from '../context/BookmarkContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const CheckoutScreen = () => {
  const { bookmarks: cartItems } = useCart();
  const [promo, setPromo] = React.useState('');
  const [address, setAddress] = React.useState('123 Main St, City, Country'); // Placeholder
  const [payment, setPayment] = React.useState('Visa **** 4242'); // Placeholder
  const navigation = useNavigation();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace(/[^\d.]/g, '') || '0');
    return sum + price;
  }, 0);
  const discount = promo === 'SAVE10' ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handlePlaceOrder = () => {
    Alert.alert('Order Placed', 'Your order has been placed successfully!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcon name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>
      <Text style={styles.title}>Checkout</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>No items in cart.</Text>
        ) : (
          cartItems.map((item, idx) => (
            <View key={item.id + idx} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.serviceName && <Text style={styles.itemCategory}>{item.serviceName}</Text>}
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))
        )}
        {/* Address */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity style={styles.selectRow}>
          <Text style={styles.selectText}>{address}</Text>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity style={styles.selectRow}>
          <Text style={styles.selectText}>{payment}</Text>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
        {/* Promo Code */}
        <Text style={styles.sectionTitle}>Promo Code</Text>
        <View style={styles.promoRow}>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter promo code"
            value={promo}
            onChangeText={setPromo}
          />
          <TouchableOpacity style={styles.applyBtn} onPress={() => {}}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {/* Price Breakdown */}
        <View style={styles.priceRow}><Text>Subtotal</Text><Text>₹{subtotal.toFixed(2)}</Text></View>
        {discount > 0 && <View style={styles.priceRow}><Text>Discount</Text><Text>-₹{discount.toFixed(2)}</Text></View>}
        <View style={styles.priceRow}><Text style={{ fontWeight: 'bold' }}>Total</Text><Text style={{ fontWeight: 'bold' }}>₹{total.toFixed(2)}</Text></View>
        {/* Place Order */}
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  backButton: { position: 'absolute', top: 16, left: 16, zIndex: 10, padding: 0 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 16, alignSelf: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#27537B', marginTop: 18, marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center', marginVertical: 20 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  itemTitle: { fontSize: 15, fontWeight: '500', color: '#222' },
  itemCategory: { fontSize: 12, color: '#888' },
  itemPrice: { fontSize: 15, color: '#27537B', fontWeight: 'bold', marginLeft: 12 },
  selectRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 8 },
  selectText: { fontSize: 15, color: '#222' },
  changeText: { fontSize: 14, color: '#007AFF', fontWeight: '500' },
  promoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  promoInput: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 10, backgroundColor: '#fff', fontSize: 15 },
  applyBtn: { marginLeft: 8, backgroundColor: '#27537B', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  applyBtnText: { color: '#fff', fontWeight: 'bold' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, paddingHorizontal: 2 },
  placeOrderBtn: { backgroundColor: '#27537B', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 32 },
  placeOrderText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});

export default CheckoutScreen; 