import React, { useMemo } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const DarkModeTrueTypeDefault = ({
  darkModeTrueTypeDefaultPosition,
  darkModeTrueTypeDefaultHeight,
  darkModeTrueTypeDefaultTop,
  darkModeTrueTypeDefaultRight,
  darkModeTrueTypeDefaultLeft,
  darkModeTrueTypeDefaultElevation,
  darkModeTrueTypeDefaultWidth,
  notchIconMarginLeft,
  leftSideMarginLeft,
  rightSideIconMarginLeft,
}) => {
  const darkModeTrueTypeDefaultStyle = useMemo(() => {
    return {
      ...getStyleValue("position", darkModeTrueTypeDefaultPosition),
      ...getStyleValue("height", darkModeTrueTypeDefaultHeight),
      ...getStyleValue("top", darkModeTrueTypeDefaultTop),
      ...getStyleValue("right", darkModeTrueTypeDefaultRight),
      ...getStyleValue("left", darkModeTrueTypeDefaultLeft),
      ...getStyleValue("elevation", darkModeTrueTypeDefaultElevation),
      ...getStyleValue("width", darkModeTrueTypeDefaultWidth),
    };
  }, [
    darkModeTrueTypeDefaultPosition,
    darkModeTrueTypeDefaultHeight,
    darkModeTrueTypeDefaultTop,
    darkModeTrueTypeDefaultRight,
    darkModeTrueTypeDefaultLeft,
    darkModeTrueTypeDefaultElevation,
    darkModeTrueTypeDefaultWidth,
  ]);

  const notchIconStyle = useMemo(() => {
    return {
      ...getStyleValue("marginLeft", notchIconMarginLeft),
    };
  }, [notchIconMarginLeft]);

  const leftSideStyle = useMemo(() => {
    return {
      ...getStyleValue("marginLeft", leftSideMarginLeft),
    };
  }, [leftSideMarginLeft]);

  const rightSideIconStyle = useMemo(() => {
    return {
      ...getStyleValue("marginLeft", rightSideIconMarginLeft),
    };
  }, [rightSideIconMarginLeft]);

  return (
    <View
      style={[styles.darkModetrueTypedefault, darkModeTrueTypeDefaultStyle]}
    >
      <Image
        style={[styles.notchIcon, styles.iconPosition, notchIconStyle]}
        contentFit="cover"
        source={require("../assets/notch.png")}
      />
      <View style={[styles.leftSide, styles.leftSideLayout, leftSideStyle]}>
        <View style={[styles.statusbarTime, styles.leftSideLayout]}>
          <Text style={styles.text}>9:41</Text>
        </View>
      </View>
      <Image
        style={[styles.rightSideIcon, styles.iconPosition, rightSideIconStyle]}
        contentFit="cover"
        source={require("../assets/right-side.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    left: "50%",
    position: "absolute",
  },
  leftSideLayout: {
    height: 21,
    width: 54,
    left: "50%",
    position: "absolute",
  },
  notchIcon: {
    marginLeft: -82,
    width: 164,
    height: 32,
    top: 0,
  },
  text: {
    top: 1,
    left: 0,
    fontSize: FontSize.defaultBoldBody_size,
    letterSpacing: 0,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.defaultBoldBody,
    color: Color.labelColorDarkPrimary,
    textAlign: "center",
    height: 20,
    width: 54,
    position: "absolute",
  },
  statusbarTime: {
    marginLeft: -27,
    borderRadius: Border.br_5xl,
    top: 0,
  },
  leftSide: {
    marginLeft: -168,
    top: 14,
  },
  rightSideIcon: {
    marginLeft: 91,
    top: 19,
    width: 77,
    height: 13,
  },
  darkModetrueTypedefault: {
    height: 47,
    overflow: "hidden",
  },
});

export default DarkModeTrueTypeDefault;
