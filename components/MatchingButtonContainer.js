import * as React from "react";
import { useState } from "react";
import { Pressable, StyleSheet, View, Text, PixelRatio } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";
import { Image } from "expo-image";

const MatchingButtonContainer = ({
  value,
  beforeImage,
  afterImage,
  onToggle,
  selected,
  height,
  width,
}) => {
  const [isColor, setIsColor] = useState(true);
  const scale = useSharedValue(1);
  // スタイルを動的に生成
  const dynamicStyles = styles(height, width);

  const toggleImage = () => {
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
      style={dynamicStyles.pressable}
      onPress={toggleImage}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[dynamicStyles.wrapper, animatedStyle]}>
        <Image
          style={[dynamicStyles.child, dynamicStyles.itemLayout]}
          contentFit="cover"
          // source={isColor ? require("../assets/rectangle3.png") : require("../assets/rectangle1.png")}
          source={selected ? { uri: afterImage } : { uri: beforeImage }}
          cachePolicy="memory-disk"
        />
        <View style={[dynamicStyles.item, dynamicStyles.itemLayout]} />
        <Text style={dynamicStyles.text}>{value}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = (height, width) =>
  StyleSheet.create({
    itemLayout: {
      left: 0,
      height: height,
      position: "absolute",
    },
    child: {
      right: 0,
    },
    wrapper: {
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Border.br_3xs,
      overflow: "hidden",
    },
    item: {
      top: 0,
      backgroundColor: "rgba(0, 0, 0, 0.2)", // 黒いフィルター。0.3は透過度
      width: width,
      left: 0,
    },
    text: {
      fontSize: FontSize.body,
      letterSpacing: 0,
      fontWeight: "500",
      // fontFamily: FontFamily.interMedium,
      color: Color.labelColorDarkPrimary,
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
    },
    pressable: {
      shadowColor: "rgba(0, 0, 0, 0.25)",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      elevation: 4,
      shadowOpacity: 1,
      height: height,
      width: width,
      marginHorizontal: 8,
      marginVertical: 8,
      borderRadius: 10,
      backgroundColor: "transparent",
      // position: "absolute",
    },
  });

export default MatchingButtonContainer;
