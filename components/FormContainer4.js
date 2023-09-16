import React, { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const FormContainer4 = ({ spaName, crowdednessStatus, propLeft }) => {
  const frameViewStyle = useMemo(() => {
    return {
      ...getStyleValue("left", propLeft),
    };
  }, [propLeft]);

  return (
    <View
      style={[styles.rectangleParent, styles.frameItemLayout, frameViewStyle]}
    >
      <View style={[styles.frameChild, styles.text1Layout]} />
      <View style={[styles.frameItem, styles.frameBorder]} />
      <View style={[styles.frameInner, styles.textLayout]} />
      <Text style={[styles.text, styles.textFlexBox]}>{spaName}</Text>
      <Text style={[styles.text1, styles.textFlexBox]}>
        {crowdednessStatus}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  frameItemLayout: {
    height: 80,
    top: 0,
  },
  text1Layout: {
    height: 56,
    top: 24,
  },
  frameBorder: {
    borderWidth: 1,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
    backgroundColor: Color.labelColorDarkPrimary,
    left: 0,
    width: 114,
    position: "absolute",
  },
  textLayout: {
    height: 24,
    top: 0,
  },
  textFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    left: 0,
    width: 114,
    position: "absolute",
  },
  frameChild: {
    backgroundColor: Color.labelColorDarkPrimary,
    left: 0,
    height: 56,
    top: 24,
    width: 114,
    position: "absolute",
  },
  frameItem: {
    height: 80,
    top: 0,
    borderWidth: 1,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
  },
  frameInner: {
    borderWidth: 1,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
    backgroundColor: Color.labelColorDarkPrimary,
    left: 0,
    width: 114,
    position: "absolute",
  },
  text: {
    fontSize: FontSize.size_3xs,
    height: 24,
    top: 0,
  },
  text1: {
    fontSize: FontSize.size_xl,
    height: 56,
    top: 24,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
  },
  rectangleParent: {
    left: 2,
    overflow: "hidden",
    width: 114,
    position: "absolute",
    height: 80,
    top: 0,
  },
});

export default FormContainer4;
