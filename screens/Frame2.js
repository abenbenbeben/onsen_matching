import * as React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  StatusBar,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import SectionCard from "../components/SectionCard";
import FavoriteCard from "../components/FavoriteCard";
import DarkModeTrueTypeDefault from "../components/DarkModeTrueTypeDefault";
import DarkModeFalse from "../components/DarkModeFalse";
import { FontSize, Color, FontFamily } from "../GlobalStyles";

const Frame2 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <View style={[styles.grid, styles.gridPosition]} />
      <ScrollView
        style={[styles.wrapper, styles.gridPosition]}
        horizontal={true}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.frameScrollViewContent}
      >
        <View style={styles.view1}>
          <SectionCard
            spaName="吉川天然温泉 ゆあみ"
            matchPercentage="マッチ度 70%"
          />
          <FavoriteCard
            onsenName="のだ温泉 ほのか"
            matchPercentage="マッチ度 90%"
            onFramePressablePress={() => navigation.navigate("Frame1")}
          />
          <View style={styles.km}>
            <Text style={styles.text}>お気に入り</Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar barStyle="default" />
      <DarkModeTrueTypeDefault
        darkModeTrueTypeDefaultPosition="absolute"
        darkModeTrueTypeDefaultHeight={45}
        darkModeTrueTypeDefaultTop={0}
        darkModeTrueTypeDefaultRight={0}
        darkModeTrueTypeDefaultLeft={0}
        darkModeTrueTypeDefaultWidth="unset"
        notchIconMarginLeft={-81.5}
        leftSideMarginLeft={-162.5}
        rightSideIconMarginLeft={86.5}
      />
      <DarkModeFalse
        darkModeFalsePosition="absolute"
        darkModeFalseRight={0}
        darkModeFalseBottom={0}
        darkModeFalseLeft={0}
        darkModeFalseWidth="unset"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frameScrollViewContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  gridPosition: {
    left: 8,
    position: "absolute",
  },
  parentLayout: {
    height: 45,
    width: 65,
    bottom: -2,
    position: "absolute",
    overflow: "hidden",
  },
  textTypo: {
    height: 15,
    justifyContent: "center",
    textAlign: "center",
    fontSize: FontSize.size_2xs,
    alignItems: "center",
    display: "flex",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
  },
  groupLayout: {
    width: 59,
    position: "absolute",
  },
  grid: {
    top: 44,
    right: 7,
    bottom: 34,
    overflow: "hidden",
  },
  text: {
    top: 2,
    fontSize: FontSize.defaultBoldBody_size,
    textAlign: "left",
    height: 29,
    alignItems: "center",
    display: "flex",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    left: 0,
    width: 92,
    position: "absolute",
  },
  km: {
    height: 32,
    width: 92,
    top: 0,
    left: 8,
    position: "absolute",
    overflow: "hidden",
  },
  view1: {
    width: 360,
    height: 629,
  },
  wrapper: {
    top: 84,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  view: {
    backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    height: 800,
    overflow: "hidden",
    width: "100%",
  },
});

export default Frame2;
