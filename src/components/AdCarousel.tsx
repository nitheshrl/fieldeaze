import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import mockData from '../mockData.json';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainNavigator';

const { width } = Dimensions.get('window');

const ads = [
  {
    title: 'Laptop Repair & Upgrade',
    subtitle: 'Fast fixes, genuine parts, and expert technicians',
    image: mockData.servicesList[0].image,
    serviceId: mockData.servicesList[0].id,
  },
  {
    title: 'Virus Removal & Protection',
    subtitle: 'Keep your PC safe from malware and threats',
    image: mockData.servicesList[2].image,
    serviceId: mockData.servicesList[2].id,
  },
  {
    title: 'Custom PC Assembly',
    subtitle: 'Gaming, work, or home – built to your needs',
    image: mockData.servicesList[1].image,
    serviceId: mockData.servicesList[1].id,
  },
  {
    title: 'Data Recovery Services',
    subtitle: 'Lost files? We recover your important data',
    image: mockData.servicesList[3].image,
    serviceId: mockData.servicesList[3].id,
  },
];

const AdCarousel = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (current + 1) % ads.length;
      setCurrent(next);
      scrollRef.current?.scrollTo({ x: next * width * 0.9, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <View style={{ alignItems: 'center' }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 16, width: width * 0.9 }}
        contentContainerStyle={{ alignItems: 'center' }}
        scrollEnabled={false}
      >
        {ads.map((ad, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.adCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ServiceDetails', { serviceId: ad.serviceId })}
          >
            <Image source={{ uri: ad.image }} style={styles.bgImage} />
            <View style={styles.bgOverlay} />
            <View style={styles.adTextOverlay}>
              <Text style={styles.adTitle}>{ad.title}</Text>
              <Text style={styles.adSubtitle}>{ad.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  adCard: {
    width: width * 0.9,
    height: 130,
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 0,
    position: 'relative',
    justifyContent: 'center',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    zIndex: 0,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
    zIndex: 1,
  },
  adTextOverlay: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  adTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'left',
  },
  adSubtitle: {
    fontSize: 14,
    color: '#eee',
    fontWeight: '400',
    textAlign: 'left',
  },
});

export default AdCarousel; 