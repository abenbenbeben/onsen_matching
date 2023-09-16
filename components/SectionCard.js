import React, { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const SectionCard = ({ spaName, matchPercentage, viewTop }) => {
  const frameView1Style = useMemo(() => {
    return {
      ...getStyleValue("top", viewTop),
    };
  }, [viewTop]);

  return (
    <View style={[styles.rectangleParent, frameView1Style]}>
      <View style={styles.frameChild} />
      <View style={styles.frameItem} />
      <Text style={styles.text}>{spaName}</Text>
      <View style={[styles.view, styles.viewPosition]}>
        <Text style={[styles.text1, styles.textTypo]}>{matchPercentage}</Text>
      </View>
      <View style={[styles.wrapper, styles.viewPosition]}>
        <Text style={[styles.text2, styles.textTypo]}>
          平日 1200円 祝日 1300円
        </Text>
      </View>
    </View>
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
    fontSize: FontSize.size_3xs,
    height: 16,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    left: 0,
    top: 0,
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
    top: 3,
    fontSize: FontSize.size_base,
    width: 224,
    height: 21,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    left: 111,
    color: Color.labelColorLightPrimary,
    position: "absolute",
  },
  text1: {
    color: Color.colorRed,
    width: 65,
  },
  view: {
    top: 24,
    width: 65,
  },
  text2: {
    width: 160,
    color: Color.labelColorLightPrimary,
    fontSize: FontSize.size_3xs,
  },
  wrapper: {
    top: 40,
    width: 153,
  },
  rectangleParent: {
    top: 136,
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

export default SectionCard;
