import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, FlatList, Platform, ScrollView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { request, PERMISSIONS } from 'react-native-permissions';

interface Address {
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
}

const DEFAULT_REGION = {
  latitude: 11.0168, // Default to Coimbatore
  longitude: 76.9558,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const AddAddressScreen = () => {
  const [marker, setMarker] = useState<{ latitude: number; longitude: number }>(DEFAULT_REGION);
  const [address, setAddress] = useState<Address>({
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home'
  });
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<WebView>(null);
  const navigation = useNavigation();

  // Get address from coordinates
  const fetchAddress = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const url = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'fieldeaze-app/1.0 (contact@fieldeaze.com)'
        }
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error:', res.status, errorText);
        setLoading(false);
        return;
      }
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON response:', text);
        setLoading(false);
        return;
      }
      // Parse the address components
      const addressComponents = data.address || {};
      setAddress((prev: Address) => ({
        ...prev,
        street: [addressComponents.road, addressComponents.house_number].filter(Boolean).join(' '),
        city: addressComponents.city || addressComponents.town || addressComponents.village || '',
        state: addressComponents.state || '',
        pincode: addressComponents.postcode || ''
      }));
    } catch (e) {
      console.error('Error fetching address:', e);
    }
    setLoading(false);
  };

  // On marker move or region change
  useEffect(() => {
    fetchAddress(marker.latitude, marker.longitude);
  }, [marker]);

  // Search address
  const searchAddress = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'fieldeaze-app/1.0 (contact@fieldeaze.com)'
        }
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error:', res.status, errorText);
        setLoading(false);
        return;
      }
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON response:', text);
        setSearchResults([]);
        setLoading(false);
        return;
      }
      setSearchResults(data);
    } catch (e) {
      setSearchResults([]);
      console.error('Error searching address:', e);
    }
    setLoading(false);
  };

  // Use current location
  const getCurrentLocation = async () => {
    setLocating(true);
    Geolocation.getCurrentPosition(
      (position: any) => {
        const { latitude, longitude } = position.coords;
        setMarker({ latitude, longitude });
        mapRef.current?.injectJavaScript(`
          if (window.map && window.marker) {
            window.map.setView([${latitude}, ${longitude}], 16);
            window.marker.setLatLng([${latitude}, ${longitude}]);
          }
        `);
        setLocating(false);
      },
      () => {
        setLocating(false);
        // Optionally show error to user
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // On search result select
  const onSelectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setMarker({ latitude: lat, longitude: lon });
    setSearch('');
    setSearchResults([]);
    Keyboard.dismiss();
    mapRef.current?.injectJavaScript(`
      if (window.map && window.marker) {
        window.map.setView([${lat}, ${lon}], 16);
        window.marker.setLatLng([${lat}, ${lon}]);
      }
    `);
  };

  // Handle marker drag from WebView
  const onWebViewMessage = (event: any) => {
    try {
      const coords = JSON.parse(event.nativeEvent.data);
      setMarker(coords);
    } catch (e) {}
  };

  // Save address
  const handleSaveAddress = () => {
    // Validate required fields
    if (!address.street || !address.city || !address.pincode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Here you would typically save the address to your backend/storage
    // For now, we'll just go back
    navigation.goBack();
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      } else {
        await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
    };
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Address</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a location"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => searchAddress(search)}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setSearch('')}>
            <Text style={{ fontSize: 18 }}>×</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.locateBtn} onPress={getCurrentLocation}>
          {locating ? <ActivityIndicator size="small" color="#27537B" /> : <Text style={{ color: '#27537B', fontWeight: 'bold' }}>Use my current location</Text>}
        </TouchableOpacity>
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.place_id.toString()}
            style={styles.searchResults}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => onSelectSearchResult(item)}>
                <Text style={styles.resultTitle}>{item.display_name.split(',')[0]}</Text>
                <Text style={styles.resultSubtitle}>{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {/* Map */}
      <View style={styles.mapContainer}>
        <WebView
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <style>
                  #map { height: 100vh; width: 100vw; }
                  html, body { margin: 0; padding: 0; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <script>
                  window.map = L.map('map').setView([${marker.latitude}, ${marker.longitude}], 16);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                  }).addTo(window.map);
                  window.marker = L.marker([${marker.latitude}, ${marker.longitude}], {draggable:true}).addTo(window.map);
                  window.marker.on('dragend', function(e) {
                    var latlng = window.marker.getLatLng();
                    window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: latlng.lat, longitude: latlng.lng }));
                  });
                  window.map.on('click', function(e) {
                    window.marker.setLatLng(e.latlng);
                    window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: e.latlng.lat, longitude: e.latlng.lng }));
                  });
                </script>
              </body>
              </html>
            `
          }}
          onMessage={onWebViewMessage}
          style={{ flex: 1 }}
        />
      </View>
      {/* Address Form */}
      <ScrollView style={styles.addressForm}>
        <View style={styles.addressTypeContainer}>
          {['home', 'work', 'other'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.addressTypeButton,
                address.type === type && styles.addressTypeButtonActive
              ]}
              onPress={() => setAddress((prev: Address) => ({ ...prev, type: type as Address['type'] }))}
            >
              <Text style={[
                styles.addressTypeText,
                address.type === type && styles.addressTypeTextActive
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Street Address *"
          value={address.street}
          onChangeText={(text) => setAddress((prev: Address) => ({ ...prev, street: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Landmark (Optional)"
          value={address.landmark}
          onChangeText={(text) => setAddress((prev: Address) => ({ ...prev, landmark: text }))}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="City *"
            value={address.city}
            onChangeText={(text) => setAddress((prev: Address) => ({ ...prev, city: text }))}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="State *"
            value={address.state}
            onChangeText={(text) => setAddress((prev: Address) => ({ ...prev, state: text }))}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="PIN Code *"
          value={address.pincode}
          onChangeText={(text) => setAddress((prev: Address) => ({ ...prev, pincode: text }))}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveAddress}
        >
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  searchBarContainer: { padding: 16, backgroundColor: '#fff', zIndex: 2 },
  searchBar: { backgroundColor: '#f2f2f2', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  clearBtn: { position: 'absolute', right: 30, top: 22 },
  locateBtn: { marginTop: 10, alignSelf: 'flex-start' },
  searchResults: { backgroundColor: '#fff', borderRadius: 8, marginTop: 8, maxHeight: 180, borderWidth: 1, borderColor: '#eee' },
  resultItem: { padding: 10, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  resultTitle: { fontWeight: 'bold', color: '#27537B' },
  resultSubtitle: { color: '#888', fontSize: 13 },
  mapContainer: { flex: 1, minHeight: 260, maxHeight: 320, borderRadius: 16, overflow: 'hidden', marginHorizontal: 16, marginBottom: 10 },
  addressForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    maxHeight: 400,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  addressTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressTypeButtonActive: {
    backgroundColor: '#27537B',
    borderColor: '#27537B',
  },
  addressTypeText: {
    color: '#666',
  },
  addressTypeTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#27537B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddAddressScreen; 