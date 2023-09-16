import * as React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Border, FontSize } from "../GlobalStyles";

const FormContainer3 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <Pressable
        style={[styles.pressable, styles.view1Position]}
        onPress={() => navigation.navigate("HOME")}
      >
        <View style={styles.child} />
        <Text style={styles.text}>保存</Text>
      </Pressable>
      <View style={[styles.view1, styles.view1Position]}>
        <View style={[styles.view2, styles.view2Layout]}>
          <Text style={[styles.text1, styles.text1Layout]}>選択中</Text>
        </View>
        <View style={[styles.wrapper, styles.text1Layout]}>
          <Text style={[styles.text2, styles.textFlexBox]}>4</Text>
        </View>
        <View style={[styles.container, styles.text1Layout]}>
          <Text style={[styles.text2, styles.textFlexBox]}>3</Text>
        </View>
        <Image
          style={styles.item}
          contentFit="cover"
          source={require("../assets/line-1.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view1Position: {
    height: 56,
    top: 8,
    overflow: "hidden",
    position: "absolute",
  },
  view2Layout: {
    height: 40,
    position: "absolute",
  },
  text1Layout: {
    width: 96,
    height: 40,
    position: "absolute",
  },
  textFlexBox: {
    color: Color.labelColorLightPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    top: 0,
  },
  child: {
    left: 0,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorRoyalblue,
    top: 0,
    height: 56,
    width: 121,
    position: "absolute",
  },
  text: {
    fontSize: FontSize.size_3xl,
    color: Color.labelColorDarkPrimary,
    width: 104,
    height: 39,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    top: 8,
    left: 8,
    position: "absolute",
  },
  pressable: {
    left: 224,
    width: 121,
    height: 56,
  },
  text1: {
    marginLeft: -48,
    left: "50%",
    fontSize: FontSize.size_xl,
    color: Color.labelColorLightPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    top: 0,
  },
  view2: {
    left: 104,
    width: 72,
    top: 8,
    overflow: "hidden",
  },
  text2: {
    left: 56,
    fontSize: FontSize.size_5xl,
    width: 40,
    height: 40,
    position: "absolute",
  },
  wrapper: {
    top: 8,
    overflow: "hidden",
    left: 8,
  },
  container: {
    left: -26,
    top: 8,
    overflow: "hidden",
  },
  item: {
    top: 14,
    left: 61,
    width: 14,
    height: 28,
    position: "absolute",
  },
  view1: {
    width: 208,
    left: 8,
  },
  view: {
    right: 7,
    bottom: 33,
    backgroundColor: Color.labelColorDarkPrimary,
    height: 74,
    overflow: "hidden",
    left: 8,
    position: "absolute",
  },
});

export default FormContainer3;
