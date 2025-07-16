import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, LayoutAnimation, Platform, UIManager, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import mockData from '../mockData.json';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CONTACTS = (mockData.contacts || []).map(contact => ({
  ...contact,
  icon: (() => {
    switch (contact.key) {
      case 'customer_service':
        return <Icon name="headset-mic" size={28} color="#27537B" />;
      case 'whatsapp':
        return <FontAwesome name="whatsapp" size={28} color="#27537B" />;
      case 'website':
        return <Icon name="language" size={28} color="#27537B" />;
      case 'facebook':
        return <FontAwesome name="facebook" size={28} color="#27537B" />;
      case 'twitter':
        return <FontAwesome name="twitter" size={28} color="#27537B" />;
      case 'instagram':
        return <FontAwesome name="instagram" size={28} color="#27537B" />;
      default:
        return null;
    }
  })()
}));

const HelpCenterScreen = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('contact');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const handleExpand = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === key ? null : key);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#27537B" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#27537B' }]}>Help Center</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color="#aaa" style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'faq' && { borderBottomWidth: 3, borderBottomColor: '#000' }]}
          onPress={() => setActiveTab('faq')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'faq' ? '#000' : '#27537B' }]}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && { borderBottomWidth: 3, borderBottomColor: '#000' }]}
          onPress={() => setActiveTab('contact')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'contact' ? '#000' : '#27537B' }]}>Contact Us</Text>
        </TouchableOpacity>
      </View>
      {/* Contact List */}
      {activeTab === 'contact' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {CONTACTS.map((item) => (
            <View key={item.key} style={styles.card}>
              <TouchableOpacity style={styles.cardHeader} onPress={() => handleExpand(item.key)}>
                <View style={styles.cardIcon}>{item.icon}</View>
                <Text style={[styles.cardLabel, { color: '#27537B' }]}>{item.label}</Text>
                <Icon name={expanded === item.key ? 'expand-less' : 'expand-more'} size={24} color="#27537B" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              {expanded === item.key && (
                <View style={styles.cardDetails}>
                  <Text style={[styles.cardDetailsText, { color: '#888' }]}>{item.details}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      {/* FAQ Tab Placeholder */}
      {activeTab === 'faq' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#aaa', fontSize: 16 }}>FAQ content coming soon...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '600', marginLeft: 16 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    margin: 16,
    height: 44,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    color: '#222',
    backgroundColor: 'transparent',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#4B9A7D',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4B9A7D',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cardDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardDetailsText: {
    color: '#4B9A7D',
    fontSize: 15,
    marginTop: 4,
  },
});

export default HelpCenterScreen; 