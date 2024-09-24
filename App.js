import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useColorScheme } from 'react-native';
import { displayLocalNotification, registerForPushNotificationsAsync } from './notification';
import { fetchLastFirebaseData, firebaseConfigData } from './app/firebaseData';
import dashboardScreen from './screens/dashboard'
import historyScreen from './screens/history'
import optionsScreen from './screens/options'

const Tab = createBottomTabNavigator();

/* Main Function */
export default function App() {
  const colorScheme = useColorScheme();
  const tempConfig = firebaseConfigData().tempConfig;
  const { lastTemp } = fetchLastFirebaseData();

  /* Notification code */
  useEffect(() => {
    registerForPushNotificationsAsync();
    console.log("tempConfig  ", tempConfig[0])

    if (lastTemp !== null && tempConfig[0].maxTemp !== undefined && tempConfig[0].minTemp !== undefined) {
      if (lastTemp >= tempConfig[0].maxTemp || lastTemp <= tempConfig[0].minTemp) {
        displayLocalNotification(lastTemp);
      }
    }
  }, [lastTemp, tempConfig]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
            borderTopColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
          },
          tabBarActiveTintColor: colorScheme === 'dark' ? '#8CEE00' : '#6200EE',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#B0B0B0' : '#8e8e8e',
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={dashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="dashboard" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Historique"
          component={historyScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="area-chart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Paramètres"
          component={optionsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="cog" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
