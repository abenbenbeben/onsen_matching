import * as React from "react";
import { useState } from "react";
import {
  Pressable,
  ImageBackground,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";
import { Image } from "expo-image";



const MatchingButtonContainer = ({value,beforeImage,afterImage,onToggle,selected}) => {
  const [isColor, setIsColor] = useState(true)
  const scale = useSharedValue(1);

  const toggleImage = () => {
    console.log("Pressed")
    setIsColor(!isColor);
    onToggle();
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.8, {
      damping: 2,
      stiffness: 80,
      overshootClamping: false,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 800,
      overshootClamping: false,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
      <Pressable
        style={styles.pressable}
        onPress={toggleImage}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        // disabled={true}
      >
        <Animated.View style={[styles.wrapper,animatedStyle]}>
          <Image
            style={[styles.child, styles.itemLayout]}
            contentFit="cover"
            // source={isColor ? require("../assets/rectangle3.png") : require("../assets/rectangle1.png")}
            source={selected ? {uri:afterImage} : {uri:beforeImage }}
            cachePolicy="memory-disk"
          />
          <View style={[styles.item, styles.itemLayout]} />
          <Text style={styles.text}>{value}</Text>
        </Animated.View>
      </Pressable>
  );
};

const styles = StyleSheet.create({
  itemLayout: {
    left: 0,
    height: 88,
    position: "absolute",
  },
  child: {
    // marginTop: ,
    right: 0,
    // top: "50%",
  },
  wrapper:{
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    borderRadius: Border.br_3xs,
    overflow:"hidden",
  },
  item: {
    top: 0,
    backgroundColor: Color.colorGray,
    width: 156,
    left: 0,
  },
  text: {
    // marginTop: -32,
    // marginLeft: -70,
    // left: "50%",
    fontSize: FontSize.size_3xl,
    letterSpacing: 0,
    // lineHeight: 22,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorDarkPrimary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 140,

  },
  // align:{
  // top: 10,
  // left: 16,
  // },
  pressable: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    height: 88,
    width: 156,
    marginHorizontal:8,
    marginVertical:8,
    
    // position: "absolute",

  },
});

export default MatchingButtonContainer;
