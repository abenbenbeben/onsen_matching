import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text } from "react-native";
import FormContainer4 from "./FormContainer4";
import { FontSize, Color, FontFamily } from "../GlobalStyles";

const FormContainer1 = () => {
  return (
    <View style={styles.view}>
      <FormContainer4 spaName="天然温泉" crowdednessStatus="○" />
      <View style={[styles.vectorParent, styles.parentLayout]}>
        <Image
          style={styles.frameChild}
          contentFit="cover"
          source={require("../assets/rectangle-13.png")}
        />
        <View style={styles.frameItem} />
        <View style={styles.frameInner} />
        <Text style={styles.text}>泉質の良さ</Text>
        <Text style={[styles.text1, styles.textTypo]}>×</Text>
      </View>
      <View style={[styles.rectangleParent, styles.parentLayout]}>
        <View style={styles.rectangleView} />
        <View style={styles.frameItem} />
        <View style={styles.frameInner} />
        <Text style={styles.text}>お風呂の種類</Text>
        <Text style={styles.textTypo}>
          <Text style={styles.txt}>
            <Text style={styles.text4}>多い</Text>11種類
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentLayout: {
    width: 114,
    top: 0,
    overflow: "hidden",
    height: 80,
    position: "absolute",
  },
  textTypo: {
    fontSize: FontSize.size_xl,
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    height: 56,
    top: 24,
    width: 114,
    left: 0,
    position: "absolute",
  },
  frameChild: {
    height: 56,
    top: 24,
    width: 114,
    left: 0,
    position: "absolute",
  },
  frameItem: {
    borderWidth: 1,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
    backgroundColor: Color.labelColorDarkPrimary,
    width: 114,
    top: 0,
    height: 80,
    left: 0,
    position: "absolute",
  },
  frameInner: {
    height: 24,
    borderWidth: 1,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
    backgroundColor: Color.labelColorDarkPrimary,
    width: 114,
    top: 0,
    left: 0,
    position: "absolute",
  },
  text: {
    fontSize: FontSize.size_3xs,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    height: 24,
    width: 114,
    top: 0,
    left: 0,
    position: "absolute",
  },
  text1: {
    justifyContent: "center",
  },
  vectorParent: {
    left: 115,
  },
  rectangleView: {
    backgroundColor: Color.labelColorDarkPrimary,
    height: 56,
    top: 24,
    width: 114,
    left: 0,
    position: "absolute",
  },
  text4: {
    marginBottom: 10,
  },
  txt: {
    lineBreak: "anywhere",
    width: "100%",
  },
  rectangleParent: {
    left: 228,
  },
  view: {
    top: 87,
    width: 344,
    overflow: "hidden",
    height: 80,
    left: 0,
    position: "absolute",
  },
});

export default FormContainer1;
