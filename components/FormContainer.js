import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import FormContainer4 from "./FormContainer4";
import { Color, FontFamily, FontSize } from "../GlobalStyles";

const FormContainer = () => {
  return (
    <View style={styles.view}>
      <FormContainer4
        spaName="ソープの良さ"
        crowdednessStatus="○"
        propLeft={2}
      />
      <View style={styles.rectangleParent}>
        <View style={[styles.frameChild, styles.frameBorder]} />
        <View style={[styles.frameItem, styles.textLayout]} />
        <Text style={[styles.text, styles.textFlexBox]}>炭酸泉</Text>
        <Text style={[styles.text1, styles.textFlexBox]}>×</Text>
      </View>
      <FormContainer4
        spaName="フェイスウォッシュ"
        crowdednessStatus="○"
        propLeft={228}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frameBorder: {
    borderWidth: 1,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
    backgroundColor: Color.labelColorDarkPrimary,
    width: 114,
    left: 0,
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
    width: 114,
    left: 0,
    position: "absolute",
  },
  frameChild: {
    top: 0,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
    backgroundColor: Color.labelColorDarkPrimary,
    height: 80,
  },
  frameItem: {
    borderWidth: 1,
    borderColor: Color.labelColorLightPrimary,
    borderStyle: "solid",
    backgroundColor: Color.labelColorDarkPrimary,
    width: 114,
    left: 0,
    position: "absolute",
  },
  text: {
    fontSize: FontSize.size_3xs,
    height: 24,
    top: 0,
  },
  text1: {
    top: 24,
    fontSize: FontSize.size_xl,
    height: 56,
  },
  rectangleParent: {
    left: 115,
    width: 114,
    top: 0,
    overflow: "hidden",
    height: 80,
    position: "absolute",
  },
  view: {
    top: 166,
    width: 344,
    overflow: "hidden",
    height: 80,
    left: 0,
    position: "absolute",
  },
});

export default FormContainer;
