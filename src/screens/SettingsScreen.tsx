import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const languages = ['English', 'Hindi', 'Spanish'];

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [showLangs, setShowLangs] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={theme.primary} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.primary }]}>Settings</Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Preferences</Text>
        <View style={[styles.row, { borderBottomColor: theme.inputBorder }]}>
          <Icon name="notifications" size={22} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? theme.primary : '#ccc'}
            trackColor={{ true: theme.header, false: '#eee' }}
          />
        </View>
        <TouchableOpacity style={styles.row} onPress={() => setShowLangs(!showLangs)}>
          <Icon name="language" size={22} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Language</Text>
          <Text style={[styles.value, { color: theme.text }]}>{language}</Text>
          <Icon name={showLangs ? 'expand-less' : 'expand-more'} size={22} color={theme.textSecondary} />
        </TouchableOpacity>
        {showLangs && (
          <View style={styles.langList}>
            {languages.map((lang) => (
              <TouchableOpacity key={lang} style={styles.langItem} onPress={() => { setLanguage(lang); setShowLangs(false); }}>
                <Text style={[styles.langText, lang === language && { color: theme.primary, fontWeight: '700' }, { color: theme.text }]}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.row}>
          <Icon name="dark-mode" size={22} color={theme.primary} />
          <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={theme.mode === 'dark'}
            onValueChange={() => {}}
            thumbColor={theme.mode === 'dark' ? theme.primary : '#ccc'}
            trackColor={{ true: theme.header, false: '#eee' }}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.row}>
          <Icon name="lock" size={22} color={theme.primary} />
          <Text style={styles.label}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Icon name="logout" size={22} color="#e74c3c" />
          <Text style={[styles.label, { color: '#e74c3c' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.rowNoBorder}>
          <Icon name="info" size={22} color={theme.primary} />
          <Text style={styles.label}>App Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 0,
    alignSelf: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#27537B',
    marginRight: 8,
  },
  langList: {
    marginLeft: 38,
    marginBottom: 8,
  },
  langItem: {
    paddingVertical: 6,
  },
  langText: {
    fontSize: 15,
    color: '#333',
  },
});

export default SettingsScreen; 