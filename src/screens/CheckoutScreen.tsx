import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList, TextInput, SafeAreaView } from 'react-native';
import { useBookmarks as useCart } from '../context/BookmarkContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import mockData from '../mockData.json';

const BLUE_PRIMARY = '#0e376e';
const GREEN = '#27ae60';
const BG = '#f4f7fb';
const CARD_BG = '#fff';
const BORDER = '#e0e0e0';

const paymentOptions = [
  { key: 'wallet', label: 'Wallet / UPI' },
  { key: 'netbanking', label: 'Net Banking' },
  { key: 'card', label: 'Credit / Debit / ATM Card' },
  { key: 'cod', label: 'Cash on Delivery' },
];

const CheckoutScreen = () => {
  const { bookmarks: cartItems } = useCart();
  const navigation = useNavigation();
  const [step, setStep] = React.useState(0); // 0: Delivery, 1: Payment
  const [selectedPayment, setSelectedPayment] = React.useState('wallet');
  const addresses = mockData.user.addresses || [];
  const [selectedAddress, setSelectedAddress] = React.useState(addresses[0] || null);
  const [addressModalVisible, setAddressModalVisible] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState('');
  const subtotal = cartItems.reduce((sum, item) => {
    // @ts-ignore
    const price = parseFloat(item.price?.replace(/[^\d.]/g, '') || '0');
    // @ts-ignore
    const qty = typeof item.qty === 'number' ? item.qty : 1;
    return sum + price * qty;
  }, 0);
  const discount = appliedCoupon === 'SAVE10' ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  // --- UI Components ---
  const StepIndicator = () => (
    <View style={styles.stepRow}>
      <TouchableOpacity style={styles.stepBtn} disabled>
        <View style={[styles.dot, { backgroundColor: step === 0 ? BLUE_PRIMARY : GREEN }]} />
        <Text style={[styles.stepLabel, step === 0 && { color: BLUE_PRIMARY, fontWeight: 'bold' }]}>Delivery</Text>
      </TouchableOpacity>
      <View style={styles.stepLine} />
      <TouchableOpacity style={styles.stepBtn} disabled>
        <View style={[styles.dot, { backgroundColor: step === 1 ? BLUE_PRIMARY : BORDER }]} />
        <Text style={[styles.stepLabel, step === 1 && { color: BLUE_PRIMARY, fontWeight: 'bold' }]}>Payment</Text>
      </TouchableOpacity>
    </View>
  );

  const AddressCard = () => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
       
        <View style={{ flex: 1 }}>
          <Text style={styles.addrName}>{selectedAddress?.label || ''}</Text>
          <Text style={styles.addrDetails}>{selectedAddress?.address || ''}</Text>
        </View>
        <MaterialIcon name="check-circle" size={22} color={BLUE_PRIMARY} />
      </View>
      <TouchableOpacity style={styles.addrChangeBtn} onPress={() => setAddressModalVisible(true)}>
        <Text style={styles.addrChangeText}>Change Address</Text>
      </TouchableOpacity>
      {/* Address Selection Modal */}
      <Modal visible={addressModalVisible} transparent animationType="slide" onRequestClose={() => setAddressModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.addressModalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: BLUE_PRIMARY, marginBottom: 12 }}>Select Address</Text>
            <FlatList
              data={addresses}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.addressOption, selectedAddress?.id === item.id && styles.addressOptionSelected]}
                  onPress={() => { setSelectedAddress(item); setAddressModalVisible(false); }}
                >
                  <Text style={{ fontSize: 15, color: '#222', fontWeight: selectedAddress?.id === item.id ? 'bold' : 'normal' }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>{item.address}</Text>
                  {selectedAddress?.id === item.id && (
                    <MaterialIcon name="check-circle" size={18} color={BLUE_PRIMARY} style={{ position: 'absolute', right: 8, top: 18 }} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
            <TouchableOpacity style={styles.modalBtn} onPress={() => setAddressModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  const OrderSummaryCard = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>No items in cart.</Text>
      ) : (
        <>
          {cartItems.map((item, idx) => (
            <View key={item.id + idx} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.title}</Text>
              {/* @ts-ignore */}
              <Text style={styles.itemQty}>Qty: {typeof item.qty === 'number' ? item.qty : 1}</Text>
              <Text style={styles.itemPrice}>₹{parseFloat(item.price?.replace(/[^\d.]/g, '') || '0').toFixed(0)}</Text>
            </View>
          ))}
          {/* Coupon Input */}
          <View style={styles.couponRow}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={coupon}
              onChangeText={setCoupon}
              placeholderTextColor="#b0b0b0"
            />
            <TouchableOpacity
              style={[styles.applyBtn, { marginLeft: 8 }]}
              onPress={() => setAppliedCoupon(coupon.trim().toUpperCase())}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {/* Discount and Total */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(1)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={[styles.summaryValue, { color: discount > 0 ? '#27ae60' : '#888' }]}>-₹{discount.toFixed(1)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total</Text>
            <Text style={[styles.summaryValue, { fontWeight: 'bold', color: BLUE_PRIMARY }]}>₹{total.toFixed(1)}</Text>
          </View>
        </>
      )}
    </View>
  );

  const PaymentCard = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      {paymentOptions.map(opt => (
        <TouchableOpacity
          key={opt.key}
          style={[styles.payOption, selectedPayment === opt.key && styles.payOptionActive]}
          onPress={() => setSelectedPayment(opt.key)}
        >
          <View style={styles.radioOuter}>
            {selectedPayment === opt.key && <View style={styles.radioInner} />}
          </View>
          <Text style={[styles.payLabel, selectedPayment === opt.key && { color: BLUE_PRIMARY, fontWeight: 'bold' }]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // --- Main Render ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={26} color={BLUE_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>
      <StepIndicator />
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        {step === 0 ? (
          <>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <AddressCard />
            <OrderSummaryCard />
          </>
        ) : (
          <>
            <PaymentCard />
          </>
        )}
      </ScrollView>
      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>₹{subtotal.toFixed(1)}</Text>
        {step === 0 ? (
          <TouchableOpacity style={styles.actionBtn} onPress={() => setStep(1)}>
            <Text style={styles.actionBtnText}>CONFIRM</Text>
            <MaterialIcon name="check" size={20} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: GREEN }]} onPress={() => Alert.alert('Order Placed', 'Your order has been placed!')}>
            <Text style={styles.actionBtnText}>PROCEED</Text>
            <MaterialIcon name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: BG },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 32, paddingBottom: 8, paddingHorizontal: 12, backgroundColor: BG, zIndex: 2 },
  backBtn: { padding: 6, marginRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: BLUE_PRIMARY, flex: 1, textAlign: 'left' },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 18, marginTop: 2 },
  stepBtn: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  stepLabel: { fontSize: 15, color: '#888', fontWeight: '500', marginRight: 8 },
  stepLine: { width: 32, height: 2, backgroundColor: BORDER, marginHorizontal: 2 },
  card: { backgroundColor: CARD_BG, borderRadius: 14, padding: 16, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2, borderWidth: 1, borderColor: BORDER },
  addrName: { fontSize: 15, fontWeight: 'bold', color: BLUE_PRIMARY,top:5 },
  addrDetails: { fontSize: 13, color: '#555',top:5 },
  addrChangeBtn: { alignSelf: 'flex-end', marginTop: 8, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#f0f6ff' },
  addrChangeText: { color: BLUE_PRIMARY, fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: BLUE_PRIMARY, marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  itemName: { fontSize: 15, color: '#222', flex: 1 },
  itemQty: { fontSize: 13, color: '#888', marginHorizontal: 8 },
  itemPrice: { fontSize: 15, color: BLUE_PRIMARY, fontWeight: 'bold', minWidth: 48, textAlign: 'right' },
  emptyText: { fontSize: 15, color: '#888', textAlign: 'center', marginVertical: 20 },
  payOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: BORDER, marginBottom: 10, backgroundColor: '#f8fafc' },
  payOptionActive: { backgroundColor: '#e6f2ff', borderColor: BLUE_PRIMARY },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: BLUE_PRIMARY, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#fff' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: BLUE_PRIMARY },
  payLabel: { fontSize: 15, color: '#222' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: CARD_BG, borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingVertical: 16, paddingHorizontal: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8, position: 'absolute', left: 0, right: 0, bottom: 0 },
  totalLabel: { fontSize: 16, color: '#888', fontWeight: '600', marginRight: 8 },
  totalValue: { fontSize: 18, color: BLUE_PRIMARY, fontWeight: 'bold', marginRight: 18 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: BLUE_PRIMARY, borderRadius: 24, paddingVertical: 10, paddingHorizontal: 28, shadowColor: BLUE_PRIMARY, shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center' },
  addressModalContent: { backgroundColor: '#fff', borderRadius: 18, padding: 24, alignItems: 'stretch', width: 320, maxHeight: 420, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  addressOption: { padding: 12, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: BORDER, marginBottom: 0, position: 'relative' },
  addressOptionSelected: { backgroundColor: '#e6f2ff', borderColor: BLUE_PRIMARY },
  modalBtn: { backgroundColor: BLUE_PRIMARY, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 18, alignSelf: 'center' },
  couponRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 4 },
  couponInput: { flex: 1, borderWidth: 1, borderColor: BORDER, borderRadius: 8, padding: 8, backgroundColor: '#fff', fontSize: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, color: '#222' },
  applyBtn: { backgroundColor: BLUE_PRIMARY, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  applyBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default CheckoutScreen; 