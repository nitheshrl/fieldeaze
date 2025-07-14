import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const ads = [
  {
    title: 'Laptop Repair & Upgrade',
    subtitle: 'Fast fixes, genuine parts, and expert technicians',
    image: require('../assets/icons/Laptop.png'),
  },
  {
    title: 'Virus Removal & Protection',
    subtitle: 'Keep your PC safe from malware and threats',
    image: require('../assets/pick-services.png'),
  },
  {
    title: 'Custom PC Assembly',
    subtitle: 'Gaming, work, or home – built to your needs',
    image: require('../assets/choose-provider.png'),
  },
  {
    title: 'Data Recovery Services',
    subtitle: 'Lost files? We recover your important data',
    image: require('../assets/icons/service-details1.png'),
  },
];

const AdCarousel = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(0);

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
          <View key={idx} style={styles.adCard}>
            <View style={styles.adTextWrap}>
              <Text style={styles.adTitle}>{ad.title}</Text>
              <Text style={styles.adSubtitle}>{ad.subtitle}</Text>
            </View>
            <View style={styles.adImageCircleWrap}>
              <Image source={ad.image} style={styles.adImage} />
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 10,
    position: 'relative',
  },
  adTextWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
    zIndex: 2,
  },
  adTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  adSubtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
  adImageCircleWrap: {
    position: 'absolute',
    right: -65,
    top: -10,
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  adImage: {
    width: 180,
    height: 180,
    resizeMode: 'cover',
  },
});

export default AdCarousel; 