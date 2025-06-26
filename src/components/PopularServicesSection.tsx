import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageSourcePropType } from 'react-native';
import ServiceCard from './ServiceCard';
import mockData from '../mockData.json';

const localImages: { [key: string]: ImageSourcePropType } = {
  'ac-service.jpg': require('../assets/ac-service.jpg'),
  'air-purifier.jpg': require('../assets/air-purifier.jpg'),
  'air-freshner.jpg': require('../assets/air-freshner.jpg'),
};

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
            image={localImages[service.image] || localImages['ac-service.jpg']}
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
    marginTop: 8,
    bottom: -9,
  },
  scrollView: {
    marginBottom: 20,
  },
});

export default PopularServicesSection; 