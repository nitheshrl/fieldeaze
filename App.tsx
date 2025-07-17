/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import { Text, View, BackHandler, AppState, Alert, AppStateStatus } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import { BookmarkProvider } from './src/context/BookmarkContext';
import { ThemeProvider } from './src/context/ThemeContext';

// Error boundary component
interface ErrorBoundaryProps {
  children: ReactNode;
  name?: string;
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
    console.error(`Error in ${this.props.name || 'unknown'} boundary:`, error);
    console.error('Error Info:', errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: 'red', fontSize: 16, marginBottom: 10 }}>
            Error in {this.props.name || 'app'}: Something went wrong!
          </Text>
          <Text style={{ color: 'red', fontSize: 14 }}>{this.state.error?.message}</Text>
          <Text style={{ color: 'red', fontSize: 12, marginTop: 10 }}>{this.state.error?.stack}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export const navigationRef = createNavigationContainerRef();

export default function App() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Handle back button press
    const backAction = () => {
      // Check if navigation can go back
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        // Let navigation handle the back action
        return false;
      }
      
      // Show exit confirmation only when at the root level
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit the app?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false }
      );
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Handle app state changes (when app goes to background)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        console.log('App has come to the foreground!');
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App is going to the background
        console.log('App is going to the background!');
      }
      appState.current = nextAppState;
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      backHandler.remove();
      appStateSubscription?.remove();
    };
  }, []);

  return (
    <ThemeProvider>
      <BookmarkProvider>
        <ErrorBoundary name="root">
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <ErrorBoundary name="navigation">
                <MainNavigator />
              </ErrorBoundary>
            </NavigationContainer>
          </SafeAreaProvider>
        </ErrorBoundary>
      </BookmarkProvider>
    </ThemeProvider>
  );
}
