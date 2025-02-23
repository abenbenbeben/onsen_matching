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
import Editdetail_Frame from "./screens/Editdetail_Frame.js";
import Reportdetail_Frame from "./screens/Reportdetail_Frame.js";
import InfomationFrame from "./screens/InfomationFrame.js";
import PermissionStateFrame from "./screens/PermissionStateFrame.js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Button,
  useWindowDimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import { DataProvider } from "./DataContext.js";
import { Color } from "./GlobalStyles.js";
import { TabView, SceneMap, ScrollPager, TabBar } from "react-native-tab-view";

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
    <DataProvider>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator
            initialRouteName="FirstFrame"
            screenOptions={{
              headerStyle: { backgroundColor: Color.colorMain },
              headerTitleStyle: { color: "#ffffff" },
              headerTitle: "スーパー銭湯マッチング",
              headerTintColor: "white",
              headerBackTitle: "Back",
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen
              name="FirstFrame"
              component={FirstFrame}
              options={{
                headerShown: false,
                href: null,
                // tabBarIcon: ({ color }) => (
                //   <MaterialCommunityIcons name="home" color={color} size={26} />
                // ),
              }}
            />
            <Stack.Screen
              name="PermissionStateFrame"
              component={PermissionStateFrame}
              options={{
                headerShown: false,
                href: null,
                // tabBarIcon: ({ color }) => (
                //   <MaterialCommunityIcons name="home" color={color} size={26} />
                // ),
              }}
            />
            <Stack.Screen
              name="Matching_Frame"
              component={Matching_Frame}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Root"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Onsen_detail_Frame"
              component={onsen_detail_Frame}
              options={{ headerTitle: "施設詳細" }}
            />
            <Stack.Screen
              name="InformationFrame"
              component={InfomationFrame}
              options={{ headerTitle: "お知らせ" }}
            />
            <Stack.Screen
              name="Editdetail_Frame"
              component={Editdetail_Frame}
              // options={{ headerBackVisible: false }}
            />
            <Stack.Screen
              name="Reportdetail_Frame"
              component={Reportdetail_Frame}
              // options={{ headerBackVisible: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </DataProvider>
  );
};

function HomeTabs({ route, navigation }) {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName="HOME">
      <Tab.Screen
        name="探す"
        component={ModalFrame}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={30} />
          ),
          tabBarActiveTintColor: "#3A6AE5",
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
          tabBarActiveTintColor: "#3A6AE5",
        }}
      />
      <Tab.Screen
        name="気になる"
        component={FavoriteFrame}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="star" color={color} size={30} />
          ),
          tabBarActiveTintColor: "#3A6AE5",
        }}
      />
      <Tab.Screen
        name="ヘルプ"
        component={ContactScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="help-circle-outline"
              color={color}
              size={30}
            />
          ),
          tabBarActiveTintColor: "#3A6AE5",
        }}
      />
    </Tab.Navigator>
  );
}

// function TopTabView() {
//   const [index, setIndex] = React.useState(0);
//   const [routes] = React.useState([
//     { key: "first", title: "通知" },
//     { key: "second", title: "情報" },
//   ]);

//   const layout = useWindowDimensions();

//   const initialLayout = { width: layout.width };

//   // SceneMap の修正
//   const renderScene = SceneMap({
//     first: Matching_Frame,
//     second: () => (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>テストフレーム</Text>
//       </View>
//     ),
//   });

//   // TabBar のカスタマイズ
//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={{ backgroundColor: "#e91e63" }}
//       style={{ backgroundColor: "white" }}
//       labelStyle={{ color: "black" }}
//     />
//   );

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={initialLayout}
//       renderTabBar={renderTabBar}
//     />
//   );
// }

export default App;
