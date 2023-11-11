const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import FirstFrame from "./screens/FirstFrame";
import onsen_detail_Frame from "./screens/onsen_detail_Frame";
import FavoriteFrame from "./screens/FavoriteFrame";
import HOME from "./screens/HOME";
import Matching_Frame from "./screens/Matching_Frame";
import ModalFrame from "./screens/ModalFrame";
import ContactScreen from "./screens/ContactFrame";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity, Button } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';



const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  const [fontsLoaded, error] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();


  return (
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator
            initialRouteName="FirstFrame"
            screenOptions={{
              headerStyle: { backgroundColor: '#3A6AE5'},
              headerTitleStyle: { color: '#ffffff' },
              headerTitle: 'スーパー銭湯マッチング',
              headerTintColor: 'white',
              headerBackTitle: 'Back',
              animation: "slide_from_right",
            }}>
            <Stack.Screen
              name="FirstFrame"
              component={FirstFrame}
              // options={{ headerShown: false }}
              options={{
                href: null,
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
            <Stack.Screen
              name="Matching_Frame"
              component={Matching_Frame}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Root"
              component={HomeTabs}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Onsen_detail_Frame"
              component={onsen_detail_Frame}
              // options={{ headerBackVisible: false }}
            />

            
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
  );
};


function HomeTabs() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="HOME"
    >
      <Tab.Screen
        name="マッチング"
        component={ModalFrame}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={30} />
          ),
          tabBarActiveTintColor:"#3A6AE5",
        }}
      />
      <Tab.Screen
        name="HOME"
        component={HOME}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
          tabBarActiveTintColor:"#3A6AE5",
        }}
      />
      <Tab.Screen
        name="お気に入り"
        component={FavoriteFrame}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="star" color={color} size={30} />
          ),
          tabBarActiveTintColor:"#3A6AE5",
        }}
      />
      <Tab.Screen
        name="ヘルプ"
        component={ContactScreen}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="help-circle-outline" color={color} size={30} />
          ),
          tabBarActiveTintColor:"#3A6AE5",
        }}
      />
    </Tab.Navigator>
  );
}

export default App;
