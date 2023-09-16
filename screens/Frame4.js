import * as React from "react";
import { StyleSheet, View, Text, Pressable, StatusBar } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const Frame4 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <View style={[styles.grid, styles.gridPosition]} />
      <Pressable
        style={[styles.ellipseParent, styles.gridPosition]}
        onPress={() => navigation.navigate("HOME")}
      >
        <Image
          style={styles.frameChild}
          contentFit="cover"
          source={require("../assets/ellipse-1.png")}
        />
        <Text style={styles.text}>マッチング中</Text>
      </Pressable>
      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  gridPosition: {
    left: 8,
    position: "absolute",
    overflow: "hidden",
  },
  grid: {
    top: 44,
    right: 7,
    bottom: 34,
  },
  frameChild: {
    top: 374,
    left: 160,
    width: 40,
    height: 40,
    position: "absolute",
  },
  text: {
    top: 310,
    left: 68,
    fontSize: FontSize.defaultBoldBody_size,
    letterSpacing: 0,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorLightPrimary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 224,
    height: 43,
    position: "absolute",
  },
  ellipseParent: {
    top: 84,
    backgroundColor: Color.colorWhitesmoke_100,
    width: 360,
    height: 682,
  },
  view: {
    backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },
});

export default Frame4;
