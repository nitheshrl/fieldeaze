import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ServiceCard from './ServiceCard';
import mockData from '../mockData.json';

const PopularServicesSection = () => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Popular Services</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollView}
      >
        {mockData.servicesList.filter(s => s.popular).map(service => (
          <ServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            image={service.image} // Pass the URL directly
            rating={service.rating}
            reviewCount={service.reviewCount}
            price={service.price}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    color: '#222',
    marginBottom: 10,
    marginTop: 18,
    bottom: 5,
  },
  scrollView: {
    marginBottom: 40, // Increased from 30
    paddingBottom: 16, // Added for extra space
  },
});

export default PopularServicesSection; 