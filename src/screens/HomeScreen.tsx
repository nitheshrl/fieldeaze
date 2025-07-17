import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
  ScrollView as RNScrollView,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainNavigator';
import mockData from '../mockData.json';
import Icon from 'react-native-vector-icons/FontAwesome';
import PopularServicesSection from '../components/PopularServicesSection';
import { useTheme } from '../context/ThemeContext';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'ongoing', label: 'On Going Works' },
  { key: 'completed', label: 'Completed Works' },
  { key: 'incomplete', label: 'Incomplete' },
  { key: 'complaints', label: 'Complaints' },
];

// Helper to get star color based on offer background
const getStarColor = (bgColor: string) => {
  switch (bgColor) {
    case '#C0E4FF': // light blue
      return '#2266C1'; // dark blue
    case '#D6FCD6': // light green
      return '#3AC46E'; // green
    case '#FFF7CC': // light yellow
      return '#F6B93B'; // orange
    default:
      return '#2266C1';
  }
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const spacing = 8;
const boxSize = (SCREEN_WIDTH - 3 * spacing) / 4.3;
const ONGOING_CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.92);
const HORIZONTAL_PADDING = Math.round((SCREEN_WIDTH - ONGOING_CARD_WIDTH) / 2);

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { theme, toggleTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('all');
  const { user, services } = mockData;
  const bookings = mockData.bookings;
  const [showAllServices, setShowAllServices] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<typeof services>([]);

  // Filtered bookings/services based on tab
  let filteredBookings: any[] = [];
  if (selectedTab === 'all') {
    filteredBookings = bookings.ongoing || [];
  } else if (selectedTab === 'ongoing') {
    filteredBookings = bookings.ongoing || [];
  } else if (selectedTab === 'completed') {
    filteredBookings = bookings.completed || [];
  } else if (selectedTab === 'incomplete') {
    filteredBookings = bookings.incomplete || [];
  } else if (selectedTab === 'complaints') {
    filteredBookings = bookings.complaints || [];
  }

  // Search filter handler
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim().length === 0) {
      setRecommendations([]);
      setShowRecommendations(false);
      return;
    }
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(text.toLowerCase())
    );
    setRecommendations(filtered);
    setShowRecommendations(filtered.length > 0);
  };

  // Handle recommendation selection
  const handleRecommendationSelect = (service: typeof services[0]) => {
    setSearchQuery(service.name);
    setShowRecommendations(false);
    setRecommendations([]);
    navigation.navigate('ServiceDetails', { serviceId: service.id });
  };

  const [showAllModal, setShowAllModal] = useState(false);

  // Combine all bookings for modal (grouped)
  const modalSections = [
    { title: 'Ongoing', data: bookings.ongoing || [] },
    { title: 'Completed', data: bookings.completed || [] },
    { title: 'Incomplete', data: bookings.incomplete || [] },
    { title: 'Complaints', data: bookings.complaints || [] },
  ];

  // Split services
  const first8 = services.slice(0, 8);
  const rest = services.slice(8);
  // Pad the rest to always fill rows of 4
  let restPadded = rest.slice();
  if (rest.length > 0 && rest.length % 4 !== 0) {
    for (let i = rest.length % 4; i < 4; i++) {
      restPadded.push({ _empty: true, id: `empty-rest-${i}` } as any);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.header} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {/* Notification Icon (Bell) */}
        <TouchableOpacity style={{ marginRight: -42 }}>
          <Text style={{ fontSize: 18, top:10,color: theme.accent }}>🔔</Text>
        </TouchableOpacity>
        {/* Theme Toggle Button (toggle both ways) */}
        <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: -90 , top:10,}}>
          <MaterialIcon name={theme.mode === 'dark' ? 'light-mode' : 'dark-mode'} size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text, paddingRight: 36 }]}
              placeholder="What service do you need ?"
              placeholderTextColor={theme.mode === 'dark' ? '#888' : '#b0b0b0'}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => {
                if (searchQuery && recommendations.length > 0) setShowRecommendations(true);
              }}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={{ position: 'absolute', right: 8, top: 0, bottom: 0, justifyContent: 'center', height: '100%' }}
                onPress={() => {
                  setSearchQuery('');
                  setRecommendations([]);
                  setShowRecommendations(false);
                }}
              >
                <Icon name="close" size={18} color={theme.text} />
              </TouchableOpacity>
            )}
          </View>
          {/* Recommendations Dropdown */}
          {showRecommendations && (
            <View style={{
              position: 'absolute',
              top: 48,
              left: 0,
              right: 0,
              backgroundColor: theme.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.inputBorder,
              zIndex: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 4,
              maxHeight: 180,
            }}>
              {recommendations.map(service => (
                <TouchableOpacity
                  key={service.id}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: theme.inputBorder }}
                  onPress={() => handleRecommendationSelect(service)}
                >
                  <Image
                    source={{ uri: service.icon }}
                    style={{ width: 28, height: 28, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <Text style={{ fontSize: 15, color: theme.text }}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tabs */}
        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsRow}
        >
          {TABS.map((tab, idx) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                selectedTab === tab.key && { backgroundColor: theme.tabActive },
                idx !== TABS.length - 1 && { marginRight: 12 },
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && { color: '#fff' }]}>
                {tab.label} <Text style={styles.tabCount}></Text>
              </Text>
            </TouchableOpacity>
          ))}
        </RNScrollView>

        {/* Filtered Bookings Cards (multiple, scrollable) */}
        {filteredBookings.length > 0 ? (
          <RNScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.ongoingScroll}
            contentContainerStyle={{
              ...styles.ongoingScrollContent,
              paddingLeft: Math.max(HORIZONTAL_PADDING - 16, 0),
              paddingRight: HORIZONTAL_PADDING,
            }}
            pagingEnabled
            snapToInterval={ONGOING_CARD_WIDTH}
            decelerationRate="fast"
          >
            {filteredBookings.map((booking) => {
              return (
                <View
                  key={booking.id}
                  style={[
                    styles.ongoingCard,
                    { width: ONGOING_CARD_WIDTH },
                    styles.ongoingCardHorizontal,
                  ]}
                >
                  {/* Bottom Left BG */}
                  <Image
                    source={require('../assets/ongoing_service-bg.png')}
                    style={[styles.ongoingBg, styles.ongoingBgBottomLeft]}
                    resizeMode="contain"
                  />
                  {/* Top Right BG */}
                  <Image
                    source={require('../assets/ongoing_service-bg.png')}
                    style={[styles.ongoingBg, styles.ongoingBgTopRight]}
                    resizeMode="contain"
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Image
                      source={{ uri: booking.workerProfileImage || user.profileImage }}
                      style={styles.profilePic}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.ongoingName}>{booking.provider} </Text>
                      <Text style={styles.ongoingServiceName}>{booking.service}</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${booking.progress}%` }]} />
                  </View>
                  <View style={styles.progressBarLabelRow}>
                    <View style={styles.tick}>
                      <Image
                        source={require('../assets/progress-tick.png')}
                        style={{ width: 10, height: 10 }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.progressBarLabelText}>{booking.progress} % {booking.status}</Text>
                  </View>
                </View>
              );
            })}
          </RNScrollView>
        ) : (
          <Text style={{ textAlign: 'center', color: theme.textSecondary || '#888', marginVertical: 16 }}>
            No bookings found for this filter.
          </Text>
        )}
        {/* Ongoing Services Footer Bar (static) */}
        <View style={styles.ongoingFooterBar}>
          <View style={styles.ongoingFooterLeft}>
            <Text style={styles.ongoingFooterIcon}>🛠️</Text>
            <Text style={styles.ongoingFooterLabel}>Ongoing Services</Text>
            <View style={styles.ongoingFooterPill}><Text style={styles.ongoingFooterPillText}>{mockData.bookings.ongoing.length}</Text></View>
          </View>
          <View style={styles.ongoingFooterRight}>
            <TouchableOpacity onPress={() => setShowAllModal(true)}>
              <Text style={styles.ongoingFooterSeeAll}>See all</Text>
            </TouchableOpacity>
            <Text style={styles.ongoingFooterChevron}>›</Text>
          </View>
        </View>

        {/* Our Services Section: 2x4 grid for first 8, scroll for extra */}
        <Text style={[styles.servicesTitle, { color: theme.text }]}>Our Services</Text>
        {/* First 8 services grid */}
        <View style={{
          width: SCREEN_WIDTH,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: 'transparent',
        }}>
          {first8.map((service: any, idx: number) => {
            const colIdx = idx % 4;
            return (
              <TouchableOpacity
                key={service.id}
                style={{
                  width: boxSize,
                  height: boxSize,
                  backgroundColor: theme.serviceBox || '#E7E7E7',
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing,
                  marginRight: colIdx === 3 ? 0 : spacing,
                }}
                onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
              >
                <View style={styles.serviceIconCircle}>
                  <Image
                    source={{ uri: service.icon }}
                    style={styles.serviceIconImg}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.serviceName, { color: theme.text, fontSize: 9 }]} numberOfLines={2} ellipsizeMode="tail">
                  {service.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Remaining services grid */}
        {showAllServices && rest.length > 0 && (
          <View style={{
            width: SCREEN_WIDTH,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            backgroundColor: 'transparent',
          }}>
            {restPadded.map((service: any, idx: number) => {
              const colIdx = idx % 4;
              return service._empty ? (
                <View
                  key={service.id}
                  style={{
                    width: boxSize,
                    height: boxSize,
                    marginBottom: spacing,
                    marginRight: colIdx === 3 ? 0 : spacing,
                  }}
                />
              ) : (
                <TouchableOpacity
                  key={service.id}
                  style={{
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: theme.serviceBox || '#E7E7E7',
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing,
                    marginRight: colIdx === 3 ? 0 : spacing,
                  }}
                  onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
                >
                  <View style={styles.serviceIconCircle}>
                    <Image
                      source={{ uri: service.icon }}
                      style={styles.serviceIconImg}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.serviceName, { color: theme.text, fontSize: 9 }]} numberOfLines={2} ellipsizeMode="tail">
                    {service.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {/* Show More/Less text link */}
        {services.length > 8 && (
          <TouchableOpacity
            style={{ alignSelf: 'center', marginVertical: 10 }}
            onPress={() => setShowAllServices(s => !s)}
          >
            <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline' }}>
              {showAllServices ? 'Show Less' : 'Show More Services'}
            </Text>
          </TouchableOpacity>
        )}
        {/* Optional: page indicator */}
        {/* Removed page indicator as grid is no longer paged */}

        <PopularServicesSection />

        {/* Offer Cards Horizontal Scroll */}
        <RNScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offerScroll} contentContainerStyle={styles.offerScrollContent}>
          {mockData.offers.map((offer, idx) => (
            <View key={offer.id} style={[styles.offerCard, idx !== 0 && { marginLeft: 16 }, { backgroundColor: offer.bgColor || '#eaf4ff' }]}> 
              {/* Stars background using vector icons */}
              <Icon name="star" size={16} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar1]} />
              <Icon name="star" size={12} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar2]} />
              <Icon name="star" size={18} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar3]} />
              <Icon name="star" size={10} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar4]} />
              <Icon name="star" size={14} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar5]} />
              <Icon name="star" size={12} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar6]} />
              <Icon name="star" size={16} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar7]} />
              <Icon name="star" size={9} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar8]} />
              <Icon name="star" size={9} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar9]} />
              <Icon name="star" size={9} color={getStarColor(offer.bgColor)} style={[styles.offerStar, styles.offerStar10]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerSubtitle}>on your every booking</Text>
                <Text style={styles.offerDesc}>{offer.description}</Text>
              </View>
              <View style={[styles.offerCodeBox, { backgroundColor: offer.codeBoxColor || '#fff' }] }>
                <Text style={styles.offerCodeLabel}>USE CODE</Text>
                <Text style={styles.offerCode}>{offer.code}</Text>
              </View>
          </View>
          ))}
        </RNScrollView>
      </ScrollView>
      {/* All Bookings Modal */}
      <Modal
        visible={showAllModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAllModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.card, borderRadius: 18, width: '92%', maxHeight: '85%', padding: 16, elevation: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary }}>All Bookings</Text>
              <TouchableOpacity onPress={() => setShowAllModal(false)}>
                <Icon name="close" size={22} color={theme.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {modalSections.map(section => (
                section.data.length > 0 && (
                  <View key={section.title} style={{ marginBottom: 18 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary, marginBottom: 8 }}>{section.title}</Text>
                    {section.data.map(item => (
                      <View key={item.id} style={[styles.ongoingCard, { width: '100%', marginBottom: 12 }]}> 
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <Image
                            source={{ uri: item.workerProfileImage || user.profileImage }}
                            style={styles.profilePic}
                          />
                          <View style={{ marginLeft: 10 }}>
                            <Text style={styles.ongoingName}>{item.provider} </Text>
                            <Text style={styles.ongoingServiceName}>{item.service}</Text>
                          </View>
                        </View>
                        <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
                        </View>
                        <View style={styles.progressBarLabelRow}>
                          <View style={styles.tick}>
                            <Image
                              source={require('../assets/progress-tick.png')}
                              style={{ width: 10, height: 10 }}
                              resizeMode="contain"
                            />
                          </View>
                          <Text style={styles.progressBarLabelText}>{item.progress} % {item.status}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )
              ))}
              {modalSections.every(section => section.data.length === 0) && (
                <Text style={{ color: theme.textSecondary || '#888', textAlign: 'center', marginTop: 40 }}>No bookings found.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#eaf4ff',
  },
  tick:{
    width: 15,
    height: 15,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 3,
  
  },
  logo: {
    width: 138,
    height: 58,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2a5fa0',
  },
  bellButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    marginTop: 18,
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabsScroll: {
    marginBottom: 8,
    marginTop: 0,
    maxHeight: 44,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  tabButton: {
    backgroundColor: '#E6F4FF', // changed from #C0E4FF to a brighter blue
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    top: 8,
  },
  tabButtonActive: {
    backgroundColor: '#2a5fa0',
    
  },
  tabText: {
    color: 'black', // changed from 'dark-grey' to a visible blue
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 38,
  },
  tabTextActive: {
    color: '#fff', // ensure active tab text is bright white
  },
  tabCount: {
    fontSize: 10,
    backgroundColor: '#C0E4FF',
    color: 'white',
    paddingHorizontal: 4,
    borderRadius: 2,
    position: 'absolute',
    top: -2,
    right: -2,  
  },
  ongoingCard: {
    backgroundColor: '#27537B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  profilePic: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0e0e0',
  },
  ongoingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ongoingServiceName: {
    fontSize: 13,
    color: '#e0af55',
    fontWeight: '400',
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'grey',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressBarLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginBottom: 2,
  },
  progressBarLabelIcon: {
    fontSize: 15,
    color: 'white',
    marginRight: 4,
  },
  progressBarLabelText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 11,
  },
  ongoingFooterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F2FF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: -27,
    marginBottom: 18,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    zIndex: -1,
  },
  ongoingFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ongoingFooterIcon: {
    fontSize: 12,
    marginRight: 2,
    top: 7,
  },
  ongoingFooterLabel: {
    fontWeight: 'bold',
    color: '#3A4A5A',
    fontSize: 11,
    marginRight: 4,
    top: 7,
  },
  ongoingFooterPill: {
    backgroundColor: '#4E84C1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 2,
    minWidth: 26,
    minHeight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    top: 9,
  },
  ongoingFooterPillText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  ongoingFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    top: 9,
  },
  ongoingFooterSeeAll: {
    color: '#7B8A9A',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 2,
  },
  ongoingFooterChevron: {
    color: '#7B8A9A',
    fontSize: 18,
    fontWeight: 'semibold',
    marginTop: 1,
  },
  servicesTitle: {
    fontSize: 17,
    
    color: '#222',
    marginBottom: 10,
    marginTop: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  serviceBox: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#E7E7E7',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceBoxActive: {
    backgroundColor: '#27537B',
    borderRadius: 20,
    transform: [{ rotate: '-8deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  serviceBoxShadow: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    height: 18,
    backgroundColor: '#000',
    opacity: 0.10,
    borderRadius: 20,
    zIndex: 1,
  },
  serviceIconImg: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 10,
    color: '#222',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  serviceNameActive: {
    color: '#fff',
  },
  offerScroll: {
    marginBottom: 30,
    marginTop:20,
  },
  offerScrollContent: {
    paddingRight: 16,
  },

  sectionTitle:{
    fontSize: 17,
    
    color: '#222',
    marginBottom: 10,
    top: 8,
    bottom: -9,
  
  },
  offerCard: {
    backgroundColor: '#eaf4ff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 0,
    position: 'relative',
    minWidth: 320,
    maxWidth: 340,
    marginRight: 0,
    height: 150,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  offerSubtitle: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
  },
  offerDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
  },
  offerCodeBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 18,
    minWidth: 90,
  },
  offerCodeLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  offerCode: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  ongoingBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    opacity: 0.7,
    zIndex: 0,
  },
  ongoingBgBottomLeft: {
    left: -20,
    bottom: -20,
    transform: [{ rotate: '180deg' }, { scaleX: -1 }],
  },
  ongoingBgTopRight: {
    right: -20,
    top: -20,
    transform: [{ rotate: '0deg' }, { scaleX: -1 }],
  },
  serviceIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#cfcfcf',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  offerStar: {
    position: 'absolute',
    zIndex: 0,
    opacity: 0.8,
  },
  offerStar1: { top: 10, left: 240, width: 16, height: 16 },
  offerStar2: { top: 10, left: 300, width: 12, height: 12 },
  offerStar3: { top: 30, left: 280, width: 18, height: 18 },
  offerStar4: { top: 60, left: 220, width: 10, height: 10 },
  offerStar5: { top: 110, left: 340, width: 14, height: 14 },
  offerStar6: { top: 130, left: 280, width: 12, height: 12 },
  offerStar7: { top: 125, left: 230, width: 16, height: 16 },
  offerStar8: { top: 12, left: 190, width: 16, height: 16 },
  offerStar9: { top: 125, left: 180, width: 16, height: 16 },
  offerStar10: { top: 60, left: 185, width: 16, height: 16 },
  ongoingScroll: {
    marginBottom: 8,
    marginTop: 0,
  },
  ongoingScrollContent: {
    alignItems: 'flex-start',
  },
  ongoingCardHorizontal: {
    height: 130,
    marginBottom: 0,
  },
  cardTabsScroll: {
    marginBottom: 8,
    marginTop: 8,
    maxHeight: 44,
  },
  cardTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});

export default HomeScreen; 