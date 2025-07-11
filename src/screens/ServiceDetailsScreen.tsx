import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { MainStackParamList } from '../navigation/MainNavigator';
import type { StackNavigationProp } from '@react-navigation/stack';
import mockData from '../mockData.json';
import PopularServicesSection from '../components/PopularServicesSection';
import { useBookmarks } from '../context/BookmarkContext';
import LinearGradient from 'react-native-linear-gradient';
import AdCarousel from '../components/AdCarousel';

const { width } = Dimensions.get('window');

type ServiceDetailsScreenRouteProp = RouteProp<MainStackParamList, 'ServiceDetails'>;

type ServiceDetail = {
  id: string;
  name: string;
  description: string;
  rating: number;
  totalBookings: string;
  warranty: string;
  image: string;
  packages: Array<{
    id: string;
    name: string;
    title: string;
    description: string;
    price: string;
    savings: string;
    features: string[];
  }>;
  superSaverPacks: Array<{
    id: string;
    name: string;
    title: string;
    description: string;
    price: string;
    savings: string;
    features: string[];
  }>;
  categories?: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    oldPrice?: string;
    duration?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

const ServiceDetailsScreen = () => {
  const route = useRoute<ServiceDetailsScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const serviceId = route.params.serviceId;

  console.log('Received serviceId:', serviceId);
  console.log('Available serviceDetails keys:', Object.keys(mockData.serviceDetails));
  
  // Find the service details from mockData
  const serviceDetails = (mockData.serviceDetails as { [key: string]: ServiceDetail })[serviceId];
  console.log('Found serviceDetails:', serviceDetails?.name);

  const [selectedPackage, setSelectedPackage] = useState(serviceDetails?.packages[0]?.id || '');
  const { addBookmark, removeBookmark, bookmarks } = useBookmarks();
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [modalOpacity] = useState(new Animated.Value(0));

  const showAddedToCartModal = () => {
    setShowAddedModal(true);
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowAddedModal(false));
      }, 1200);
    });
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const [discountY, setDiscountY] = useState(0);
  const [serviceY, setServiceY] = useState(0);
  const [repairY, setRepairY] = useState(0);
  const [installY, setInstallY] = useState(0);
  const [faqY, setFaqY] = useState(0);

  const scrollToSection = (y: number) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [animations, setAnimations] = useState<{ [key: number]: Animated.Value }>({});

  const handleFaqPress = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
    setAnimations((prev) => {
      if (!prev[idx]) {
        prev[idx] = new Animated.Value(0);
      }
      Animated.timing(prev[idx], {
        toValue: expandedFaq === idx ? 0 : 1,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
      return { ...prev };
    });
  };

  if (!serviceDetails) {
    return (
      <View style={styles.container}>
        <Text>Service not found</Text>
      </View>
    );
  }

  // Example offers (replace with dynamic if available)
  const offers = [
    { id: '1', label: 'save 10% on every order', sub: 'Get Plus now' },
    { id: '2', label: 'Assured Reward from CRED', sub: 'on all online payments' },
    { id: '3', label: 'Amazon offer', sub: 'via Amazon Pay' },
  ];

  // Calculate total services and total cost from bookmarks
  const totalServices = bookmarks.length;
  const totalCost = bookmarks.reduce((sum, item) => sum + (parseFloat(item.price?.replace(/[^\d.]/g, '') || '0')), 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E6F2FF" />
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#27537B" />
      </TouchableOpacity>
      {/* Top Section with Gradient */}
      <LinearGradient colors={["#E6F2FF", "#B3D8F7"]} style={styles.gradientTopSection}>
        <View style={styles.topRowExactCentered}>
         
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.serviceTitleExactCentered}>{serviceDetails.name}</Text>
          </View>
          <View style={styles.iconRowExact}>
            <TouchableOpacity style={styles.circleIconExact}>
              <Icon name="search" size={18} color="#27537B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleIconExact}>
              <Icon name="share-alt" size={18} color="#27537B" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Offers Pills with Chevron */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersPillScrollExact} contentContainerStyle={{paddingRight: 16}}>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerPillExact}>
              {/* Blue diamond/triangle icon */}
              <View style={styles.offerPillIcon} />
              <View>
                <Text style={styles.offerPillMainText}>{offer.label}</Text>
                <Text style={styles.offerPillSubText}>{offer.sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {/* Categories Horizontal Scroll, Icon Above Label */}
        {serviceDetails.categories && (
          <View style={styles.categoryRowFixed}>
            {/* Discount card */}
            <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => scrollToSection(discountY)}>
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details-discount.png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>Discount</Text>
            </TouchableOpacity>
            {/* Service card */}
            <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => scrollToSection(serviceY)}>
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details1.png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>Service</Text>
            </TouchableOpacity>
            {/* Installation/uninstallation card */}
            <TouchableOpacity
              style={{ alignItems: 'center', flex: 1 }}
              onPress={() => {
                const hasInstall = serviceDetails.categories && serviceDetails.categories.some(category => /install|uninstall/i.test(category.name));
                scrollToSection(hasInstall ? installY : serviceY);
              }}
            >
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details3.png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>installtion/{'\n'}uninstalllation</Text>
            </TouchableOpacity>
            {/* Repair card (now FAQ) */}
            <TouchableOpacity style={{ alignItems: 'center', flex: 1 }} onPress={() => scrollToSection(faqY)}>
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details2..png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>FAQ</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Packages */}
        <View onLayout={e => setDiscountY(e.nativeEvent.layout.y)}>
          <AdCarousel />
          <View style={styles.packagesSection}>
            <Text style={styles.sectionTitle}>Super saver packages</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.packagesContainer}
            >
              {serviceDetails.superSaverPacks.map((pkg) => {
                const isBookmarked = bookmarks.some(b => b.id === pkg.id);
                return (
                  <View
                    key={pkg.id}
                    style={[
                      styles.packageCard,
                      selectedPackage === pkg.id && styles.packageCardSelected
                    ]}
                  >
                    {/* Heart icon for bookmarking */}
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
                      onPress={() => {
                        if (isBookmarked) {
                          removeBookmark(pkg.id);
                        } else {
                          addBookmark({
                            id: pkg.id,
                            title: pkg.title,
                            price: pkg.price,
                            features: pkg.features,
                            rating: serviceDetails.rating,
                            reviewCount: serviceDetails.totalBookings,
                            duration: '3 hrs',
                            serviceName: serviceDetails.name,
                            serviceId: serviceDetails.id,
                          });
                          showAddedToCartModal();
                        }
                      }}
                    >
                      <MaterialIcon name="shopping-cart" size={22} color={isBookmarked ? '#27537B' : '#888'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      activeOpacity={0.9}
                      onPress={() => setSelectedPackage(pkg.id)}
                    >
                      <View style={styles.packageHeader}>
                        <Text style={styles.packageType}>{pkg.name}</Text>
                      </View>
                      <Text style={styles.packageTitle}>{pkg.title}</Text>
                      <Text style={styles.packageDesc}>{pkg.description}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.packagePrice}>{pkg.price}</Text>
                        <Text style={styles.savingsText}>Save {pkg.savings}</Text>
                      </View>
                      <View style={styles.packageFeatures}>
                        {pkg.features.map((feature, i) => (
                          <View key={i} style={styles.featureRow}>
                            <Icon name="check" size={14} color="#27537B" />
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Service Categories */}
        <View onLayout={e => setServiceY(e.nativeEvent.layout.y)}>
        {serviceDetails.categories && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Service Categories</Text>
            {serviceDetails.categories.filter(category => !/install|uninstall/i.test(category.name)).map((category) => (
              <View key={category.id} style={styles.newCategoryCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.newCategoryTitle}>{category.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                      <Icon name="star" size={16} color="#FFC107" style={{ marginRight: 4 }} />
                      <Text style={styles.newCategoryRating}>4.8 (23k)</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.heartIconWrap}
                    onPress={() => {
                      if (bookmarks.some(b => b.id === category.id)) {
                        removeBookmark(category.id);
                      } else {
                        addBookmark({
                          id: category.id,
                          title: category.name,
                          price: category.price,
                          oldPrice: category.oldPrice,
                          duration: category.duration,
                          serviceId: serviceDetails.id,
                          serviceName: serviceDetails.name,
                        });
                        showAddedToCartModal();
                      }
                    }}
                  >
                    <MaterialIcon name="shopping-cart" size={20} color={bookmarks.some(b => b.id === category.id) ? '#27537B' : '#888'} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
                  <Text style={styles.newCategoryPrice}>{category.price}</Text>
                  {category.oldPrice && <Text style={styles.newCategoryOldPrice}>{category.oldPrice}</Text>}
                  <Text style={styles.newCategoryDuration}>{category.duration}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.viewDetailsText}>view details</Text>
                </TouchableOpacity>
                <View style={styles.dottedLine} />
              </View>
            ))}
          </View>
        )}
        </View>
        {/* Installation / Uninstallation Section */}
        <View onLayout={e => setInstallY(e.nativeEvent.layout.y)}>
        {serviceDetails.categories && serviceDetails.categories.some(category => /install|uninstall/i.test(category.name)) && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Installation / Uninstallation</Text>
            {serviceDetails.categories.filter(category => /install|uninstall/i.test(category.name)).map((category) => (
              <View key={category.id} style={styles.newCategoryCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.newCategoryTitle}>{category.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                      <Icon name="star" size={16} color="#FFC107" style={{ marginRight: 4 }} />
                      <Text style={styles.newCategoryRating}>4.8 (23k)</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.heartIconWrap}
                    onPress={() => {
                      if (bookmarks.some(b => b.id === category.id)) {
                        removeBookmark(category.id);
                      } else {
                        addBookmark({
                          id: category.id,
                          title: category.name,
                          price: category.price,
                          oldPrice: category.oldPrice,
                          duration: category.duration,
                          serviceId: serviceDetails.id,
                          serviceName: serviceDetails.name,
                        });
                        showAddedToCartModal();
                      }
                    }}
                  >
                    <MaterialIcon name="shopping-cart" size={20} color={bookmarks.some(b => b.id === category.id) ? '#27537B' : '#888'} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
                  <Text style={styles.newCategoryPrice}>{category.price}</Text>
                  {category.oldPrice && <Text style={styles.newCategoryOldPrice}>{category.oldPrice}</Text>}
                  <Text style={styles.newCategoryDuration}>{category.duration}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.viewDetailsText}>view details</Text>
                </TouchableOpacity>
                <View style={styles.dottedLine} />
              </View>
            ))}
          </View>
        )}
        </View>

        {/* FAQs Section */}
        {serviceDetails.faqs && (
          <View style={styles.faqsSection} onLayout={e => setFaqY(e.nativeEvent.layout.y)}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {serviceDetails.faqs.map((faq, i) => {
              const isOpen = expandedFaq === i;
              const rotate = animations[i]
                ? animations[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '90deg'],
                  })
                : '0deg';
              return (
                <View
                  key={i}
                  style={{
                    backgroundColor: isOpen ? '#f0f6ff' : '#fff',
                    borderRadius: 12,
                    marginBottom: 12,
                    padding: 0,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleFaqPress(i)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 18,
                      paddingHorizontal: 18,
                      borderBottomWidth: isOpen ? 1 : 0,
                      borderBottomColor: '#e0e0e0',
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={{
                        fontWeight: isOpen ? 'bold' : '600',
                        fontSize: 16,
                        color: '#222',
                        flex: 1,
                      }}
                    >
                      {faq.question}
                    </Text>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                      <Icon name="chevron-right" size={20} color="#27537B" />
                    </Animated.View>
                  </TouchableOpacity>
                  {isOpen && (
                    <Animated.View
                      style={{
                        paddingHorizontal: 18,
                        paddingBottom: 16,
                        opacity: animations[i] ? animations[i] : 1,
                      }}
                    >
                      <Text style={{ color: '#444', fontSize: 15, lineHeight: 22 }}>
                        {faq.answer}
                      </Text>
                    </Animated.View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Popular Services Section */}
        <View style={styles.popularServicesSection}>
          <PopularServicesSection />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {bookmarks.length > 0 && (
        <View style={styles.bottomCTA}>
          <View style={{ flex: 2 }}>
            <Text style={{ fontSize: 15, color: '#222', fontWeight: 'bold' }}>Total services: {totalServices}</Text>
            <Text style={{ fontSize: 15, color: '#27537B', fontWeight: 'bold' }}>Total: ₹{totalCost.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={[styles.bookNowButton, { flex: 1, marginLeft: 12 }]} onPress={() => navigation.navigate('Tabs', { screen: 'Cart' })}>
            <Text style={styles.bookNowText}>Go to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal transparent visible={showAddedModal} animationType="none">
        <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', opacity: modalOpacity }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 6, alignItems: 'center' }}>
            <MaterialIcon name="check-circle" size={48} color="#27537B" />
            <Text style={{ fontSize: 18, color: '#27537B', fontWeight: 'bold', marginTop: 12 }}>Service added to cart</Text>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    position: 'absolute',
    top: 38,
    left: 20,
    zIndex: 20,
    padding: 0,
    backgroundColor: 'transparent',
  },
  gradientTopSection: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 0,
  },
  topRowExact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  serviceTitleExact: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    left:95
  },
  iconRowExact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleIconExact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  offersPillScrollExact: {
    paddingLeft: 20,
    marginBottom: 12,
  },
  offerPillExact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#B3D8F7',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
    minWidth: 170,
    gap: 8,
  },
  offerPillIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#3CA6F2',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    marginRight: 8,
  },
  offerPillMainText: {
    fontWeight: '500',
    fontSize: 11,
    color: '#27537B',
  },
  offerPillSubText: {
    fontSize: 9,
    color: '#222',
    marginTop: -2,
  },
  content: {
    flex: 1,
  },
  packagesSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  packagesContainer: {
    paddingRight: 16,
  },
  packageCard: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  packageCardSelected: {
    borderColor: '#27537B',
    borderWidth: 2,
  },
  packageHeader: {
    backgroundColor: '#27537B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  packageType: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  packageDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27537B',
    marginRight: 12,
  },
  savingsText: {
    fontSize: 14,
    color: '#3AC46E',
    fontWeight: '600',
  },
  packageFeatures: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
  },
  categoriesSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  newCategoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  newCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  newCategoryRating: {
    fontSize: 14,
    color: '#222',
    fontWeight: '400',
  },
  heartIconWrap: {
    padding: 4,
  },
  newCategoryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27537B',
    marginRight: 8,
  },
  newCategoryOldPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  newCategoryDuration: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#F5F8FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
  addButtonText: {
    color: '#27537B',
    fontWeight: '600',
    fontSize: 16,
  },
  viewDetailsText: {
    color: '#3A6EF6',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 6,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 0.5,
    borderColor: '#bbb',
    marginTop: 8,
    marginBottom: 0,
  },
  faqsSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 80,
  },
  faqCard: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bookNowButton: {
    flex: 2,
    backgroundColor: '#27537B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  popularServicesSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 80,
  },
  categoryRowFixed: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 8,
    marginHorizontal: 0,
  },
  categorySquareCard: {
    width: 75,
    height: 75,
    backgroundColor: '#27537B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 6,
  },
  categorySquareIconWrap: {
    width: 40,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginBottom: 4,
  },
  categorySquareIcon: {
    width: 68,
    height: 68,
  },
  categorySquareLabel: {
    fontSize: 10,
    color: '#222',
    textAlign: 'center',
    fontWeight: '300',
    marginTop: 6,
  },
  topRowExactCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  serviceTitleExactCentered: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
});

export default ServiceDetailsScreen;  