import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainNavigator';
import mockData from '../mockData.json';
import PopularServicesSection from '../components/PopularServicesSection';
import { useBookmarks } from '../context/BookmarkContext';

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
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27537B" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{serviceDetails.name}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-alt" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

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

        {/* Offers Section */}
        <View style={styles.offersSection}>
          <TouchableOpacity style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <Icon name="tag" size={20} color="#4E84C1" />
            </View>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Save 10% on every order</Text>
              <Text style={styles.offerSubtitle}>Get Plus now</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <Icon name="credit-card" size={20} color="#3AC46E" />
            </View>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Up to ₹150 cashback</Text>
              <Text style={styles.offerSubtitle}>Valid for Paytm payments</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#27537B',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
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
  offersSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  offerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  offerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
});

export default ServiceDetailsScreen; 