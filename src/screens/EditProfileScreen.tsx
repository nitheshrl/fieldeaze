import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import mockData from '../mockData.json';

const { width } = Dimensions.get('window');

const genders = ['Male', 'Female', 'Other'];

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = mockData.user;
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [gender, setGender] = useState(user.gender || '');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Your Profile</Text>
      </View>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIconContainer}>
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.changeBtn}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowGenderDropdown(!showGenderDropdown)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: gender ? '#222' : '#aaa' }}>{gender || 'Select'}</Text>
            <Icon name="arrow-drop-down" size={24} color="#888" />
          </View>
        </TouchableOpacity>
        {showGenderDropdown && (
          <View style={styles.dropdown}>
            {genders.map((g, idx) => (
              <TouchableOpacity
                key={g}
                style={styles.dropdownItem}
                onPress={() => {
                  setGender(g);
                  setShowGenderDropdown(false);
                }}
              >
                <Text style={{ color: '#222', fontSize: 16 }}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    marginBottom: 8,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  editIconContainer: {
    position: 'absolute',
    right: width / 2 - 55 - 18,
    bottom: 0,
    backgroundColor: '#27537B',
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  label: {
    color: '#888',
    fontSize: 15,
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  changeBtn: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  changeText: {
    color: '#4A5C5F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  updateBtn: {
    backgroundColor: '#4A5C5F',
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen; 