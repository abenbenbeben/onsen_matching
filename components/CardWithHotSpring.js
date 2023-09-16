import * as React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";

const CardWithHotSpring = () => {
  return (
    <Pressable style={styles.rectangleParent}>
      <View style={styles.frameChild} />
      <View style={styles.frameItem} />
      <View style={[styles.view, styles.viewPosition]}>
        <Text style={styles.text}>マッチ度 85%</Text>
      </View>
      <View style={[styles.wrapper, styles.viewPosition]}>
        <Text style={[styles.text1, styles.textTypo]}>
          平日 1200円 祝日 1300円
        </Text>
      </View>
      <Text style={[styles.text2, styles.textTypo]}>湯の郷</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  viewPosition: {
    height: 16,
    left: 111,
    overflow: "hidden",
    position: "absolute",
  },
  textTypo: {
    color: Color.labelColorLightPrimary,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    position: "absolute",
  },
  frameChild: {
    backgroundColor: Color.labelColorDarkPrimary,
    left: 0,
    top: 0,
    height: 96,
    width: 343,
    position: "absolute",
  },
  frameItem: {
    marginTop: -45,
    top: "50%",
    left: 3,
    backgroundColor: Color.colorGainsboro,
    width: 101,
    height: 90,
    position: "absolute",
  },
  text: {
    color: Color.colorRed,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    fontSize: FontSize.size_3xs,
    height: 16,
    width: 65,
    left: 0,
    top: 0,
    position: "absolute",
  },
  view: {
    top: 24,
    width: 65,
    height: 16,
  },
  text1: {
    width: 160,
    fontSize: FontSize.size_3xs,
    color: Color.labelColorLightPrimary,
    height: 16,
    left: 0,
    top: 0,
  },
  wrapper: {
    top: 40,
    width: 153,
  },
  text2: {
    top: 3,
    fontSize: FontSize.size_base,
    width: 224,
    height: 21,
    color: Color.labelColorLightPrimary,
    left: 111,
  },
  rectangleParent: {
    top: 376,
    left: 8,
    borderRadius: Border.br_12xs,
    borderStyle: "solid",
    borderColor: Color.labelColorLightPrimary,
    borderWidth: 1,
    overflow: "hidden",
    height: 96,
    width: 343,
    position: "absolute",
  },
});

export default CardWithHotSpring;
