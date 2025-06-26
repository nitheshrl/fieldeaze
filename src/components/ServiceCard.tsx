import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainNavigator';

interface ServiceCardProps {
  id: string;
  title: string;
  image: ImageSourcePropType;
  rating: number;
  reviewCount: number;
  price: string;
}

const ServiceCard = ({ id, title, image, rating, reviewCount, price }: ServiceCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: id })}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={14} color="#F6B93B" />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.reviewCount}>({reviewCount})</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the opacity (0.2 = 20% black overlay)
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
    height: 40,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#27537B',
  },
});

export default ServiceCard; 