import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ManageAddressScreen from '../screens/ManageAddressScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import MyWalletScreen from '../screens/MyWalletScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

export type MainStackParamList = {
  Home: undefined;
  ServiceDetails: { serviceId: string };
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  HelpCenter: undefined;
  ManageAddress: undefined;
  EditProfile: undefined;
  AddAddress: undefined;
  PaymentMethods: undefined;
  MyBookings: undefined;
  MyWallet: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  // In a real app, use context or redux for auth state
  // For now, always start with Splash
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen 
        name="Onboarding" 
        children={({ navigation }) => (
          <OnboardingScreen onFinish={() => navigation.replace('Login')} />
        )}
      />
      <Stack.Screen 
        name="Login" 
        children={({ navigation }) => (
          <LoginScreen 
            onLogin={() => navigation.replace('Tabs')} 
            onNavigateToRegister={() => navigation.replace('Register')} 
          />
        )} 
      />
      <Stack.Screen 
        name="Register" 
        children={({ navigation }) => (
          <RegisterScreen 
            onRegister={() => navigation.replace('Login')} 
            onNavigateToLogin={() => navigation.replace('Login')} 
          />
        )} 
      />
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="MyWallet" component={MyWalletScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator; 