import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';

interface RegisterScreenProps {
  onRegister: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onNavigateToLogin: () => void;
}

const { height } = Dimensions.get('window');

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onNavigateToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { theme } = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the terms of service and privacy policy');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await onRegister({
        name,
        email,
        phone,
        password,
        confirmPassword,
      });
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
      <View style={styles.topHalf}>
        <ImageBackground
          source={require('../assets/login-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]} >Registration Now!</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]} >create your account</Text>
          </View>
        </ImageBackground>
      </View>

      <KeyboardAvoidingView
        style={[styles.bottomHalf, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          <View style={styles.inputWrapper}>
            <Icon name="user" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="phone" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Phone no"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="mail" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              placeholderTextColor={theme.textSecondary}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              placeholderTextColor={theme.textSecondary}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.orText, { color: theme.textSecondary }]}>or register with</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={[styles.socialButton, { borderColor: '#1877F2' }]}>
              <Icon name="facebook" size={22} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { borderColor: '#DB4437' }]}>
              <Icon name="mail" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { borderColor: '#E4405F' }]}>
              <Icon name="instagram" size={22} color="#E4405F" />
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <Icon
                name={agreeToTerms ? "check-square" : "square"}
                size={20}
                color={agreeToTerms ? "#6C63FF" : "#999"}
              />
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: theme.textSecondary }]}>
              I agree to{' '}
              <Text style={styles.termsLink}>terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>privacy policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Sign in!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topHalf: {
    height: height * 0.45,
  },
  bottomHalf: {
    flex: 1,
    marginTop: -height * 0.15,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.22  ,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginTop: -height * 0.14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    height: 55,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  eyeIcon: {
    padding: 5,
  },
  orText: {
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 25,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  termsText: {
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  termsLink: {
    color: '#6C63FF',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#6C63FF',
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen; 