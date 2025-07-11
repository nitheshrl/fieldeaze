import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; 
import { useBookmarks as useCart } from '../context/BookmarkContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainNavigator';

const CartScreen = () => {
  const { bookmarks: cartItems, removeBookmark: removeFromCart } = useCart();
  // Local state for quantity per service (default 1)
  const [quantities, setQuantities] = useState(() => {
    const initial: Record<string, number> = {};
    cartItems.forEach(item => { initial[item.id] = 1; });
    return initial;
  });

  // Update quantities if cart changes
  React.useEffect(() => {
    setQuantities(prev => {
      const updated = { ...prev };
      cartItems.forEach(item => {
        if (!(item.id in updated)) updated[item.id] = 1;
      });
      // Remove quantities for items no longer in cart
      Object.keys(updated).forEach(id => {
        if (!cartItems.some(item => item.id === id)) delete updated[id];
      });
      return updated;
    });
  }, [cartItems]);

  const handleRemoveFromCart = (serviceId: string, serviceTitle: string) => {
    Alert.alert(
      'Remove from Cart',
      `Are you sure you want to remove ${serviceTitle} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(serviceId),
        },
      ]
    );
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[id] || 1) + delta);
      return { ...prev, [id]: newQty };
    });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace(/[^\d.]/g, '') || '0');
    return sum + price * (quantities[item.id] || 1);
  }, 0);

  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>No items in cart yet.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {cartItems.map((service, idx) => (
            <View key={service.id + idx} style={styles.cartItem}>
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemTitle}>{service.title}</Text>
                {service.serviceName && (
                  <Text style={styles.cartItemCategory}>{service.serviceName}</Text>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  <Text style={styles.cartItemPrice}>{service.price}</Text>
                  {service.oldPrice && <Text style={styles.cartItemOldPrice}>{service.oldPrice}</Text>}
                  {service.duration && <Text style={styles.cartItemDuration}>{service.duration}</Text>}
                </View>
                {service.features && service.features.length > 0 && (
                  <Text style={styles.cartItemDesc}>{service.features.join(', ')}</Text>
                )}
                <View style={styles.cartItemActions}>
                  <View style={styles.qtySelector}>
                    <TouchableOpacity onPress={() => handleQuantityChange(service.id, -1)}>
                      <MaterialIcon name="remove-circle-outline" size={22} color="#27537B" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantities[service.id] || 1}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(service.id, 1)}>
                      <MaterialIcon name="add-circle-outline" size={22} color="#27537B" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveFromCart(service.id, service.title)}>
                    <MaterialIcon name="delete" size={22} color="#E53935" style={styles.trashIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {/* Summary Section */}
      {cartItems.length > 0 && (
        <View style={styles.summarySection}>
          <Text style={styles.summaryText}>Total services: {cartItems.length}</Text>
          <Text style={styles.summaryText}>Subtotal: ₹{subtotal.toFixed(2)}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  cartItemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  cartItemCategory: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  cartItemPrice: {
    fontSize: 15,
    color: '#27537B',
    fontWeight: 'bold',
    marginRight: 8,
  },
  cartItemOldPrice: {
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  cartItemDuration: {
    fontSize: 13,
    color: '#888',
    marginLeft: 8,
  },
  cartItemDesc: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
    marginBottom: 2,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 16,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#27537B',
    marginHorizontal: 8,
  },
  trashIcon: {
    marginLeft: 8,
  },
  summarySection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  checkoutButton: {
    backgroundColor: '#27537B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen; 