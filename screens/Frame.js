import * as React from "react";
import { StyleSheet, View, Text, Pressable, StatusBar } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const Frame = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <View style={styles.grid} />
      <Text style={[styles.text, styles.textPosition]}>{`あなたの求めている
スーパー銭湯
を探しましょう`}</Text>
      <Pressable
        style={styles.vectorParent}
        start_match="さっそく探す"
        onPress={() => navigation.navigate("Frame3")}
      >
        <Image
          style={[styles.frameChild, styles.childPosition]}
          contentFit="cover"
          source={require("../assets/rectangle-1.png")}
        />
        <Text style={[styles.text1, styles.textPosition]}>さっそく探す</Text>
      </Pressable>
      <StatusBar style={styles.childPosition} barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  textPosition: {
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0,
    left: "50%",
    position: "absolute",
  },
  childPosition: {
    left: 0,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  grid: {
    top: 44,
    right: 7,
    bottom: 34,
    left: 8,
    position: "absolute",
    overflow: "hidden",
  },
  text: {
    marginLeft: -143.5,
    top: 190,
    fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.interRegular,
    color: Color.labelColorLightPrimary,
    width: 286,
    height: 91,
  },
  frameChild: {
    right: 0,
    bottom: -1,
    borderRadius: 8,
    maxWidth: "100%",
    maxHeight: "100%",
  },
  text1: {
    marginTop: -24.5,
    marginLeft: -132,
    top: "50%",
    fontSize: 36,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorDarkPrimary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 265,
    height: 49,
  },
  vectorParent: {
    marginLeft: -170.5,
    top: 677,
    width: 342,
    height: 63,
    left: "50%",
    position: "absolute",
    overflow: "hidden",
  },
  view: {
    backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },
});

export default Frame;
