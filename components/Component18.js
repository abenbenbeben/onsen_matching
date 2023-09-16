import React, { useMemo } from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text } from "react-native";
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const Component18 = ({ viewPosition, viewTop, viewLeft, viewHeight }) => {
  const viewStyle = useMemo(() => {
    return {
      ...getStyleValue("position", viewPosition),
      ...getStyleValue("top", viewTop),
      ...getStyleValue("left", viewLeft),
      ...getStyleValue("height", viewHeight),
    };
  }, [viewPosition, viewTop, viewLeft, viewHeight]);

  return (
    <View style={[styles.view, viewStyle]}>
      <Image
        style={[styles.child, styles.itemLayout]}
        contentFit="cover"
        source={require("../assets/rectangle-3.png")}
      />
      <View style={[styles.item, styles.itemLayout]} />
      <Text style={styles.text}>{`体臭が
気になる`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemLayout: {
    borderRadius: Border.br_3xs,
    left: 0,
    position: "absolute",
    height: 88,
  },
  child: {
    marginTop: -44,
    right: 0,
    maxWidth: "100%",
    overflow: "hidden",
    top: "50%",
  },
  item: {
    top: 0,
    backgroundColor: Color.colorGray,
    width: 156,
    left: 0,
  },
  text: {
    marginTop: -32,
    marginLeft: -70,
    left: "50%",
    fontSize: FontSize.size_3xl,
    letterSpacing: 0,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorDarkPrimary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 64,
    top: "50%",
    position: "absolute",
  },
  view: {
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
  },
});

export default Component18;
