import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useBookmarks } from '../context/BookmarkContext';
import { navigationRef } from '../../App';

const BookmarkScreen = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  const handleRemoveBookmark = (serviceId: string, serviceTitle: string) => {
    Alert.alert(
      'Remove from Wishlist',
      `Are you sure you want to remove "${serviceTitle}" from your wishlist?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeBookmark(serviceId),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      {bookmarks.length === 0 ? (
        <Text style={styles.emptyText}>No bookmarks yet.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {bookmarks.map((service, idx) => (
            <TouchableOpacity
              key={service.id + idx}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => {
                if (service.serviceId && navigationRef.isReady()) {
                  (navigationRef as any).navigate('ServiceDetails', { serviceId: service.serviceId });
                }
              }}
            >
              {/* Header Row */}
              <View style={styles.headerRow}>
                <View style={styles.packageLabelRow}>
                  <Icon name="gift" size={16} color="#27537B" style={{ marginRight: 6 }} />
                  <Text style={styles.packageLabel}>Packages</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveBookmark(service.id, service.title)}>
                  <Icon name="heart" size={20} color="#27537B" style={styles.heartIcon} />
                </TouchableOpacity>
              </View>
              {/* Title */}
              <Text style={styles.cardTitle}>{service.title}</Text>
              {/* Rating Row */}
              <View style={styles.ratingRow}>
                <Icon name="star" size={16} color="#F6B93B" />
                <Text style={styles.ratingText}>{service.rating || '4.8'}</Text>
                <Text style={styles.reviewCountText}>({service.reviewCount || '23k'})</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.priceText}>{service.price || '₹2,493'}</Text>
                {service.oldPrice && (
                  <Text style={styles.oldPriceText}>{service.oldPrice}</Text>
                )}
                <Text style={styles.dot}>•</Text>
                <Text style={styles.durationText}>{service.duration || '3 hrs'}</Text>
              </View>
              {/* Features */}
              <View style={styles.featuresList}>
                {(service.features || [
                  'Applicable for both windows or split AC\'s',
                  'Indoor unit deep cleaning with foam & jet spray',
                ]).map((feature, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  packageLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageLabel: {
    fontSize: 13,
    color: '#27537B',
    fontWeight: '600',
  },
  heartIcon: {
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginLeft: 4,
  },
  reviewCountText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  dot: {
    fontSize: 16,
    color: '#bbb',
    marginHorizontal: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27537B',
  },
  oldPriceText: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  featuresList: {
    marginTop: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    color: '#27537B',
    marginRight: 6,
    marginTop: 1,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default BookmarkScreen; 