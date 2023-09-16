const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Frame from "./screens/Frame";
import Frame1 from "./screens/Frame1";
import Frame2 from "./screens/Frame2";
import HOME from "./screens/HOME";
import Frame3 from "./screens/Frame3";
import Frame4 from "./screens/Frame4";
import Component18 from "./components/Component18";
import Component17 from "./components/Component17";
import Component16 from "./components/Component16";
import Component15 from "./components/Component15";
import Component14 from "./components/Component14";
import Component13 from "./components/Component13";
import Component12 from "./components/Component12";
import Component11 from "./components/Component11";
import Component10 from "./components/Component10";
import Component9 from "./components/Component9";
import Component8 from "./components/Component8";
import Component7 from "./components/Component7";
import Component6 from "./components/Component6";
import Component5 from "./components/Component5";
import Component4 from "./components/Component4";
import Component3 from "./components/Component3";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  const [fontsLoaded, error] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Frame"
              component={Frame}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Frame1"
              component={Frame1}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Frame2"
              component={Frame2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HOME"
              component={HOME}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Frame3"
              component={Frame3}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Frame4"
              component={Frame4}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};
export default App;
