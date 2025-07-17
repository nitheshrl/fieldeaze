import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const logoScale = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  const loadingOpacity = new Animated.Value(0);

  useEffect(() => {
    // Animate logo scale
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();

    // Animate text opacity
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Animate loading indicator
    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate to next screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [logoScale, textOpacity, loadingOpacity, navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.primary }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.primary} />
      
      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logo}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 90, height: 90, resizeMode: 'contain' }}
          />
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text style={[styles.appName, { color: theme.text }]}>FieldEaze</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>Your Home Services Partner</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View style={[styles.loadingContainer, { opacity: loadingOpacity }]}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});

export default SplashScreen; 