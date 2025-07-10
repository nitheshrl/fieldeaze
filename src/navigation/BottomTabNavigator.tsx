import React, { ReactNode } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Error boundary component
interface ErrorBoundaryProps {
  children: ReactNode;
  name: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`Error in ${this.props.name}:`, error);
    console.error('Error Info:', errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: 'red', fontSize: 16, marginBottom: 10 }}>
            Error in {this.props.name}
          </Text>
          <Text style={{ color: 'red', fontSize: 14 }}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Wrap screen components with error boundary
const withErrorBoundary = (ScreenComponent: React.ComponentType<any>, screenName: string) => {
  return (props: any) => (
    <ErrorBoundary name={screenName}>
      <ScreenComponent {...props} />
    </ErrorBoundary>
  );
};

const BottomTabNavigator = () => {
  console.log('BottomTabNavigator rendering...'); // Debug log

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#27537B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={withErrorBoundary(HomeScreen, 'HomeScreen')}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
     
      <Tab.Screen
        name="Wishlist"
        component={withErrorBoundary(BookmarkScreen, 'BookmarkScreen')}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="favorite" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={withErrorBoundary(ChatScreen, 'ChatScreen')}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="chat" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={withErrorBoundary(ProfileScreen, 'ProfileScreen')}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 