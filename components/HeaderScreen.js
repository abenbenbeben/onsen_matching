import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Animated, Text, Platform } from "react-native";
import { Color, FontSize } from "../GlobalStyles";

const HeaderScreen = ({
  headerText = "スーパー銭湯マッチング",
  headerHeight = Platform.OS === "android" ? 60 : 100,
  headerTextOpacity = 1,
}) => {
  return (
    <Animated.View style={[styles.wrapper, { height: headerHeight }]}>
      <Animated.Text
        style={[styles.headerText, { opacity: headerTextOpacity }]}
      >
        {headerText}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Color.colorMain,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerText: {
    fontSize: FontSize.bodySub,
    fontWeight: "500",
    color: Color.labelColorDarkPrimary,
    marginBottom: 14, // 下から10の位置に配置
  },
});

export default HeaderScreen;
