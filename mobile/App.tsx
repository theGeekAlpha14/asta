import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './src/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from './src/constants/theme';

// Core Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import RoutePlannerScreen from './src/screens/RoutePlannerScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ReportIncidentScreen from './src/screens/ReportIncidentScreen';

// Registration Flow
import RegisterIdentityScreen from './src/screens/RegisterIdentityScreen';
import RegisterProfileScreen from './src/screens/RegisterProfileScreen';
import RegisterContactScreen from './src/screens/RegisterContactScreen';
import RegisterSecurityScreen from './src/screens/RegisterSecurityScreen';
import RegisterNetworkScreen from './src/screens/RegisterNetworkScreen';
import RegisterPermissionsScreen from './src/screens/RegisterPermissionsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#211116',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        height: 70,
        paddingBottom: 10,
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: '#94a3b8',
      tabBarIcon: ({ color, size }) => {
        let iconName = 'home';
        if (route.name === 'Map') iconName = 'map';
        else if (route.name === 'Community') iconName = 'groups';
        else if (route.name === 'Profile') iconName = 'person';
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={MapScreen} />
    <Tab.Screen name="Map" component={RoutePlannerScreen} />
    <Tab.Screen name="Community" component={CommunityScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <StoreProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />

          {/* Registration Flow */}
          <Stack.Screen name="RegisterIdentity" component={RegisterIdentityScreen} />
          <Stack.Screen name="RegisterProfile" component={RegisterProfileScreen} />
          <Stack.Screen name="RegisterContact" component={RegisterContactScreen} />
          <Stack.Screen name="RegisterSecurity" component={RegisterSecurityScreen} />
          <Stack.Screen name="RegisterNetwork" component={RegisterNetworkScreen} />
          <Stack.Screen name="RegisterPermissions" component={RegisterPermissionsScreen} />

          {/* Functional Modules */}
          <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
          <Stack.Screen name="RoutePlanner" component={RoutePlannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;
