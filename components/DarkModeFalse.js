import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Border, Color } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const DarkModeFalse = ({
  darkModeFalsePosition,
  darkModeFalseRight,
  darkModeFalseBottom,
  darkModeFalseLeft,
  darkModeFalseElevation,
  darkModeFalseWidth,
}) => {
  const darkModeFalseStyle = useMemo(() => {
    return {
      ...getStyleValue("position", darkModeFalsePosition),
      ...getStyleValue("right", darkModeFalseRight),
      ...getStyleValue("bottom", darkModeFalseBottom),
      ...getStyleValue("left", darkModeFalseLeft),
      ...getStyleValue("elevation", darkModeFalseElevation),
      ...getStyleValue("width", darkModeFalseWidth),
    };
  }, [
    darkModeFalsePosition,
    darkModeFalseRight,
    darkModeFalseBottom,
    darkModeFalseLeft,
    darkModeFalseElevation,
    darkModeFalseWidth,
  ]);

  return (
    <View style={[styles.darkModefalse, darkModeFalseStyle]}>
      <View style={styles.homeIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  homeIndicator: {
    position: "absolute",
    marginLeft: -66.5,
    bottom: 8,
    left: "50%",
    borderRadius: Border.br_81xl,
    backgroundColor: Color.labelColorLightPrimary,
    width: 134,
    height: 5,
  },
  darkModefalse: {
    height: 34,
  },
});

export default DarkModeFalse;
