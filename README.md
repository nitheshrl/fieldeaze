# FieldEaze - Home Services App

FieldEaze is a React Native mobile application that connects users with verified home service professionals. Similar to Urban Company, it provides a platform for booking various home services like cleaning, plumbing, electrical work, and more.

## Features

### ✅ Completed Features
- **Splash Screen**: Beautiful animated splash screen with app branding
- **Onboarding Flow**: Multi-slide onboarding explaining app features
- **Authentication System**: 
  - Login with email/password
  - Registration with full user details
  - Form validation and error handling
  - Social login options (UI ready)
- **Home Screen**: Dashboard with quick actions and popular services
- **State Management**: Persistent authentication state using AsyncStorage
- **Modern UI/UX**: Clean, professional design with smooth animations

### 🚧 Planned Features
- Service booking flow
- Service provider profiles
- Real-time chat
- Payment integration
- Push notifications
- Service history
- Reviews and ratings
- Location-based services

## Tech Stack

- **React Native**: 0.80.0
- **TypeScript**: For type safety
- **AsyncStorage**: For local data persistence
- **React Navigation**: For screen navigation (ready to implement)

## Getting Started

### Prerequisites

- Node.js (>=18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fieldeaze
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start the Metro bundler**
   ```bash
   npm start
   ```

5. **Run the app**

   **For Android:**
   ```bash
   npm run android
   ```

   **For iOS:**
   ```bash
   npm run ios
   ```

## App Flow

1. **Splash Screen** → Shows app logo and branding (3 seconds)
2. **Onboarding** → First-time users see feature introduction
3. **Authentication** → Login or Register
4. **Home Screen** → Main dashboard with services

## Testing the App

### Login Credentials (Mock)
- **Email**: `test@example.com`
- **Password**: `password`

### Registration
- Fill in all required fields
- Password must be at least 6 characters
- Passwords must match

## Project Structure

```
src/
├── screens/
│   ├── SplashScreen.tsx      # App launch screen
│   ├── OnboardingScreen.tsx  # Feature introduction
│   ├── LoginScreen.tsx       # User authentication
│   ├── RegisterScreen.tsx    # User registration
│   └── HomeScreen.tsx        # Main dashboard
├── components/               # Reusable UI components
├── navigation/              # Navigation configuration
├── utils/
│   └── auth.ts              # Authentication utilities
└── assets/                  # Images, icons, etc.
```

## Key Components

### SplashScreen
- Animated logo and text
- Loading indicators
- Auto-navigation after 3 seconds

### OnboardingScreen
- Horizontal scrollable slides
- Pagination dots
- Skip and Next buttons
- Feature highlights with icons

### LoginScreen
- Email and password validation
- Loading states
- Social login options
- Navigation to registration

### RegisterScreen
- Comprehensive form validation
- Password confirmation
- Terms and conditions
- Social registration options

### HomeScreen
- Welcome section
- Quick action cards
- Popular services list
- Logout functionality

## Authentication Flow

The app uses AsyncStorage for persistent authentication:

1. **App Launch**: Checks for existing user data
2. **Login/Register**: Validates credentials and stores user data
3. **Session Management**: Maintains user session across app restarts
4. **Logout**: Clears all stored data and returns to login

## Styling

The app uses a consistent design system:
- **Primary Color**: #4A90E2 (Blue)
- **Background**: #f8f9fa (Light Gray)
- **Text Colors**: #333 (Dark), #666 (Medium), #999 (Light)
- **Border Radius**: 12px for cards, 8px for buttons
- **Shadows**: Subtle elevation for depth

## Next Steps

1. **Implement React Navigation** for proper screen transitions
2. **Add Service Booking Flow** with service selection and scheduling
3. **Integrate Real Backend** for actual authentication and data
4. **Add Push Notifications** for booking updates
5. **Implement Payment Gateway** for service payments
6. **Add Service Provider App** for professionals

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

## Backend API (Coming Soon)

A backend will be scaffolded in a new `backend/` directory using FastAPI, PostgreSQL, and JWT authentication. It will provide endpoints and models matching all features in `src/mockData.json` (users, addresses, services, service details, etc.).

Setup and usage instructions will be included once the backend is scaffolded.
