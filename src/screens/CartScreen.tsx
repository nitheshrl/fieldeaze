import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { useBookmarks as useCart } from '../context/BookmarkContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import mockData from '../mockData.json';
import LinearGradient from 'react-native-linear-gradient';
import AdCarousel from '../components/AdCarousel';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const BLUE_PRIMARY = '#0e376e';
const BLUE_LIGHT = '#E6F2FF';
const BLUE_GRADIENT_END = '#B3D8F7';
const PILL_BLUE = '#E0EDFF';
const BG_SECTION = '#F8FAFC';

const CartScreen = () => {
  const navigation = useNavigation();
  const { bookmarks: cartItems, removeBookmark } = useCart();
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

  // Handle hardware back button to always go to Home tab
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // @ts-ignore
        navigation.navigate('Home');
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[id] || 1) + delta);
      return { ...prev, [id]: newQty };
    });
  };

  // Helper to get specialities from mockData.servicesList using serviceId
  const getSpecialities = (pkg: any) => {
    // Try to use serviceId if present
    let serviceId = pkg.serviceId;
    // Fallback: try to infer from title or name
    if (!serviceId) {
      // Try to match by title or name (case-insensitive)
      const found = mockData.servicesList.find(s =>
        (pkg.title && s.title && s.title.toLowerCase().includes(pkg.title.toLowerCase())) ||
        (pkg.name && s.title && s.title.toLowerCase().includes(pkg.name.toLowerCase()))
      );
      serviceId = found?.id;
    }
    const service = mockData.servicesList.find(s => s.id === serviceId);
    return service?.specialities || [];
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[BLUE_LIGHT, BLUE_GRADIENT_END]} style={styles.headerGradient}>
        <Text style={styles.header}>Your cart</Text>
      </LinearGradient>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 80 }} contentContainerStyle={{ backgroundColor: BG_SECTION, paddingTop: 8, flexGrow: 1 }}>
        {cartItems.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
            <Text style={{ fontSize: 18, color: BLUE_PRIMARY, fontWeight: '600', marginBottom: 8 }}>Your cart is empty</Text>
            <Text style={{ fontSize: 15, color: '#888' }}>Add services to see them here.</Text>
          </View>
        ) : (
          <>
            {cartItems.map(pkg => (
              <View key={pkg.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.packageTitle}>{pkg.title}</Text>
                  <View style={styles.qtyBox}>
                    <TouchableOpacity onPress={() => handleQuantityChange(pkg.id, -1)}>
                      <Text style={styles.qtyBtn}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantities[pkg.id] || 1}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(pkg.id, 1)}>
                      <Text style={styles.qtyBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ alignItems: 'flex-end', minWidth: 70 }}>
                    <Text style={styles.price}>{pkg.price}</Text>
                    {pkg.oldPrice && <Text style={styles.oldPrice}>{pkg.oldPrice}</Text>}
                  </View>
                  <TouchableOpacity onPress={() => removeBookmark(pkg.id)} style={{ marginLeft: 10, padding: 4 }}>
                    <Icon name="delete" size={20} color="#d32f2f" />
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 8, marginBottom: 8 }}>
                  {pkg.features && pkg.features.map((item: string, idx: number) => (
                    <Text key={idx} style={styles.bullet}>• {item}</Text>
                  ))}
                  {getSpecialities(pkg).map((spec: string, idx: number) => (
                    <Text key={idx} style={styles.bullet}>• {spec}</Text>
                  ))}
                </View>
              </View>
            ))}
            <AdCarousel />
          </>
        )}
      </ScrollView>
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.bottomBtnText}>Proceed to checkout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_SECTION,
    padding: 0,
  },
  headerGradient: {
    width: '100%',
    paddingTop: 36,
    paddingBottom: 18,
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 8,
    flexDirection: 'row',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 36,
    zIndex: 2,
    padding: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: BLUE_PRIMARY,
    alignSelf: 'center',
    flex: 1,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 18,
    padding: 18,
    shadowColor: BLUE_PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: PILL_BLUE,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE_PRIMARY,
    flex: 1,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PILL_BLUE,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 10,
  },
  qtyBtn: {
    fontSize: 22,
    color: BLUE_PRIMARY,
    paddingHorizontal: 6,
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 16,
    color: BLUE_PRIMARY,
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  price: {
    fontSize: 16,
    color: BLUE_PRIMARY,
    fontWeight: 'bold',
  },
  oldPrice: {
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  bullet: {
    fontSize: 15,
    color: '#444',
    marginLeft: 4,
    marginBottom: 2,
  },
  specialitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
    marginTop: 2,
  },
  specialityPill: {
    backgroundColor: PILL_BLUE,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  specialityPillText: {
    color: BLUE_PRIMARY,
    fontWeight: '600',
    fontSize: 13,
  },
  specialitiesColumn: {
    flexDirection: 'column',
    marginBottom: 6,
    marginTop: 2,
  },
  specialityButtonPoint: {
    backgroundColor: '#fff',
    borderColor: BLUE_PRIMARY,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 120,
  },
  specialityButtonPointText: {
    color: BLUE_PRIMARY,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'left',
  },
 
  
  bottomBtn: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: BLUE_PRIMARY,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  bottomBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default CartScreen; 