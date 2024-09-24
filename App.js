import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { displayLocalNotification, registerForPushNotificationsAsync } from './notification';
import { firebaseData, firebaseConfigData } from './app/firebaseData';
import dashboardScreen from './screens/dashboard'
import historyScreen from './screens/history'
import optionsScreen from './screens/options'

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  const tempConfig = firebaseConfigData().tempConfig;
  const { lastTemp, lastTime } = firebaseData();
  //Notification code
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
      <Tab.Navigator>
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
          name="History"
          component={historyScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="area-chart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
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
