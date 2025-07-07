import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '../navigation/MainNavigator';
import mockData from '../mockData.json';
import PopularServicesSection from '../components/PopularServicesSection';
import { useBookmarks } from '../context/BookmarkContext';
import LinearGradient from 'react-native-linear-gradient';

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
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

const ServiceDetailsScreen = () => {
  const route = useRoute<ServiceDetailsScreenRouteProp>();
  const serviceId = route.params.serviceId;

  console.log('Received serviceId:', serviceId);
  console.log('Available serviceDetails keys:', Object.keys(mockData.serviceDetails));
  
  // Find the service details from mockData
  const serviceDetails = (mockData.serviceDetails as { [key: string]: ServiceDetail })[serviceId];
  console.log('Found serviceDetails:', serviceDetails?.name);

  const [selectedPackage, setSelectedPackage] = useState(serviceDetails?.superSaverPacks[0]?.id || '');
  const { addBookmark, removeBookmark, bookmarks } = useBookmarks();

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E6F2FF" />
      {/* Top Section with Gradient */}
      <LinearGradient colors={["#E6F2FF", "#B3D8F7"]} style={styles.gradientTopSection}>
        <View style={styles.topRowExact}>
          <Text style={styles.serviceTitleExact}>{serviceDetails.name}</Text>
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
              <Text style={styles.offerPillTextExact}>{offer.label}</Text>
              <Icon name="chevron-right" size={12} color="#27537B" style={{marginLeft: 6}} />
            </View>
          ))}
        </ScrollView>
        {/* Categories Horizontal Scroll, Icon Above Label */}
        {serviceDetails.categories && (
          <View style={styles.categoryRowFixed}>
            {/* Discount card */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details-discount.png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>Discount</Text>
            </View>
            {/* Service card */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details1.png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>Service</Text>
            </View>
            {/* Repair & gas refill card */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details2..png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>Repair & gas refill</Text>
            </View>
            {/* Installation/uninstallation card */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={styles.categorySquareCard}>
                <View style={styles.categorySquareIconWrap}>
                  <Image source={require('../assets/icons/service-details3.png')} style={styles.categorySquareIcon} resizeMode="contain" />
                </View>
              </View>
              <Text style={styles.categorySquareLabel}>installtion/{`\n`}uninstalllation</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingNumber}>{serviceDetails.rating}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon 
                  key={star} 
                  name="star" 
                  size={16} 
                  color="#F6B93B"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.bookingsCount}>
              ({serviceDetails.totalBookings} bookings)
            </Text>
          </View>
        </View>

        {/* UC Cover Section */}
        <View style={styles.ucCoverSection}>
          <View style={styles.ucCoverHeader}>
            <Icon name="check-circle" size={20} color="#27537B" />
            <Text style={styles.ucCoverTitle}>UC COVER</Text>
          </View>
          <TouchableOpacity style={styles.warrantyBox}>
            <Text style={styles.warrantyText}>Up to {serviceDetails.warranty} warranty on repairs</Text>
            <Icon name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Service Packages */}
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
                      }
                    }}
                  >
                    <Icon name={isBookmarked ? 'heart' : 'heart-o'} size={22} color="#27537B" />
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

        {/* Service Categories */}
        {serviceDetails.categories && (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Service Categories</Text>
            <View style={styles.categoryRow}>
              {serviceDetails.categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryIconCircle}>
                    <Icon name="wrench" size={24} color="#27537B" />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryPrice}>{category.price}</Text>
                  <Text style={styles.categoryDesc}>{category.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* FAQs Section */}
        {serviceDetails.faqs && (
          <View style={styles.faqsSection}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {serviceDetails.faqs.map((faq, i) => (
              <View key={i} style={styles.faqCard}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Popular Services Section */}
        <View style={styles.popularServicesSection}>
          <PopularServicesSection />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  offerPillTextExact: {
    fontSize: 13,
    color: '#27537B',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  ratingSection: {
    backgroundColor: '#27537B',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  ratingBox: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bookingsCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  ucCoverSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  ucCoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ucCoverTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27537B',
    marginLeft: 8,
  },
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  warrantyText: {
    fontSize: 14,
    color: '#222',
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
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  categoryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27537B',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#666',
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
    width: 80,
    height: 80,
    backgroundColor: '#27537B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 6,
  },
  categorySquareIconWrap: {
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginBottom: 4,
  },
  categorySquareIcon: {
    width: 48,
    height: 48,
  },
  categorySquareLabel: {
    fontSize: 10,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 6,
  },
});

export default ServiceDetailsScreen;  