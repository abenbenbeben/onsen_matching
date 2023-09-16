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
import CardWithMatchPercentage from "../components/CardWithMatchPercentage";
import FavoriteCard from "../components/FavoriteCard";
import CardWithHotSpring from "../components/CardWithHotSpring";
import SectionCard from "../components/SectionCard";
import SectionCard1 from "../components/SectionCard1";
import DarkModeTrueTypeDefault from "../components/DarkModeTrueTypeDefault";
import DarkModeFalse from "../components/DarkModeFalse";
import { FontSize, Color, FontFamily } from "../GlobalStyles";

const HOME = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.home}>
      <View style={[styles.grid, styles.gridPosition]} />
      <ScrollView
        style={[styles.wrapper, styles.gridPosition]}
        horizontal={true}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.frameScrollViewContent}
      >
        <View style={styles.view}>
          <CardWithMatchPercentage
            onsenName="吉川天然温泉 ゆあみ"
            matchPercentage="マッチ度 70%"
          />
          <FavoriteCard
            onsenName="早稲田生源泉"
            matchPercentage="マッチ度 98%"
            propTop={273}
          />
          <CardWithHotSpring />
          <FavoriteCard
            onsenName="湯の郷"
            matchPercentage="マッチ度 65%"
            propTop={480}
          />
          <Text style={[styles.km, styles.kmLayout]}>10km圏内</Text>
          <Text style={[styles.km1, styles.kmLayout]}>15km圏内</Text>
          <CardWithMatchPercentage
            onsenName="のだ温泉 ほのか"
            matchPercentage="マッチ度 90%"
            viewTop={32}
            onFramePressablePress={() => navigation.navigate("Frame1")}
          />
          <View style={[styles.km2, styles.km2Position]}>
            <Text style={[styles.km3, styles.km3Position]}>5km圏内</Text>
          </View>
          <SectionCard
            spaName="早稲田生源泉"
            matchPercentage="マッチ度 98%"
            viewTop={617}
          />
          <SectionCard1 />
          <SectionCard
            spaName="湯の郷"
            matchPercentage="マッチ度 65%"
            viewTop={824}
          />
          <SectionCard
            spaName="湯の郷"
            matchPercentage="マッチ度 60%"
            viewTop={929}
          />
        </View>
      </ScrollView>
      <StatusBar style={styles.km3Position} barStyle="default" />
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
  kmLayout: {
    height: 32,
    width: 92,
    left: 8,
    position: "absolute",
  },
  km2Position: {
    top: 0,
    overflow: "hidden",
  },
  km3Position: {
    left: 0,
    position: "absolute",
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
  groupPosition: {
    bottom: -2,
    overflow: "hidden",
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
  km: {
    top: 241,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    fontSize: FontSize.defaultBoldBody_size,
    height: 32,
  },
  km1: {
    top: 585,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    fontSize: FontSize.defaultBoldBody_size,
    height: 32,
  },
  km3: {
    top: 2,
    height: 29,
    width: 92,
    left: 0,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    fontSize: FontSize.defaultBoldBody_size,
  },
  km2: {
    height: 32,
    width: 92,
    left: 8,
    position: "absolute",
  },
  view: {
    width: 360,
    height: 632,
  },
  wrapper: {
    top: 84,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  home: {
    backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    height: 804,
    overflow: "hidden",
    width: "100%",
  },
});

export default HOME;
