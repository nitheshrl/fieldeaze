import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { serviceIcons, ServiceIconName } from '../utils/icons';

interface ServiceIconCardProps {
  name: string;
  icon: ServiceIconName;
  onPress?: () => void;
}

const ServiceIconCard = ({ name, icon, onPress }: ServiceIconCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={serviceIcons[icon]} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  name: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default ServiceIconCard; 