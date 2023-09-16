import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Pressable, StatusBar } from "react-native";
import FriendButtonContainer from "../components/FriendButtonContainer";
import Component18 from "../components/Component18";
import Component17 from "../components/Component17";
import Component16 from "../components/Component16";
import Component15 from "../components/Component15";
import Component14 from "../components/Component14";
import Component13 from "../components/Component13";
import Component12 from "../components/Component12";
import Component11 from "../components/Component11";
import Component10 from "../components/Component10";
import Component9 from "../components/Component9";
import Component8 from "../components/Component8";
import Component7 from "../components/Component7";
import Component6 from "../components/Component6";
import Component5 from "../components/Component5";
import Component4 from "../components/Component4";
import Component3 from "../components/Component3";
import FormContainer3 from "../components/FormContainer3";
import DarkModeTrueTypeDefault from "../components/DarkModeTrueTypeDefault";
import DarkModeFalse from "../components/DarkModeFalse";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const Frame3 = () => {
  return (
    <View style={styles.view}>
      <View style={styles.frameParent}>
        <View style={[styles.parent, styles.parentPosition]}>
          <FriendButtonContainer />
          <Component18
            viewPosition="absolute"
            viewTop={10}
            viewLeft={188}
            viewHeight={88}
          />
          <Component17
            viewPosition="absolute"
            viewTop={114}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
          <Component16
            viewPosition="absolute"
            viewTop={114}
            viewLeft={188}
            viewWidth={156}
            viewHeight={88}
          />
          <Component15
            viewPosition="absolute"
            viewTop={218}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
          <Component14
            viewPosition="absolute"
            viewTop={218}
            viewLeft={188}
            viewWidth={156}
            viewHeight={88}
          />
          <Component13
            viewPosition="absolute"
            viewTop={322}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
          <Component12
            viewPosition="absolute"
            viewTop={322}
            viewLeft={188}
            viewWidth={156}
            viewHeight={88}
          />
          <Component11
            viewPosition="absolute"
            viewTop={426}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
          <Component10
            viewPosition="absolute"
            viewTop={426}
            viewLeft={188}
            viewWidth={156}
            viewHeight={88}
          />
          <Component9
            viewPosition="absolute"
            viewTop={530}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
          <Component8
            viewPosition="absolute"
            viewTop={530}
            viewLeft={188}
            viewWidth={156}
            viewHeight={88}
          />
          <Component7
            viewPosition="absolute"
            viewTop={634}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
          <Component6
            viewPosition="absolute"
            viewTop={634}
            viewLeft={188}
            viewWidth={156}
            viewHeight={88}
          />
          <Component5
            viewPosition="absolute"
            viewTop={738}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
          <Component4
            viewPosition="absolute"
            viewTop={738}
            viewLeft={188}
            viewWidth={156}
            viewHeight={88}
          />
          <Component3
            viewPosition="absolute"
            viewTop={842}
            viewLeft={16}
            viewWidth={156}
            viewHeight={88}
          />
        </View>
        <View style={[styles.wrapper, styles.textLayout]}>
          <Text
            style={[styles.text, styles.textPosition]}
          >{`あなたがスーパー銭湯に求める
ことを選んでください`}</Text>
        </View>
      </View>
      <FormContainer3 />
      <StatusBar style={styles.textPosition} barStyle="default" />
      <DarkModeTrueTypeDefault
        darkModeTrueTypeDefaultPosition="absolute"
        darkModeTrueTypeDefaultHeight={45}
        darkModeTrueTypeDefaultTop={0}
        darkModeTrueTypeDefaultRight="unset"
        darkModeTrueTypeDefaultLeft={0}
        darkModeTrueTypeDefaultElevation={4}
        darkModeTrueTypeDefaultWidth={375}
        notchIconMarginLeft={-81.5}
        leftSideMarginLeft={-162.5}
        rightSideIconMarginLeft={86.5}
      />
      <DarkModeFalse
        darkModeFalsePosition="absolute"
        darkModeFalseRight="unset"
        darkModeFalseBottom={0}
        darkModeFalseLeft={0}
        darkModeFalseElevation={4}
        darkModeFalseWidth={375}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentPosition: {
    left: 0,
    position: "absolute",
  },
  textLayout: {
    height: 75,
    width: 360,
  },
  textPosition: {
    top: 0,
    left: 0,
    position: "absolute",
  },
  parent: {
    marginTop: -413,
    top: "50%",
    right: 0,
    height: 522,
  },
  text: {
    fontSize: FontSize.size_3xl,
    letterSpacing: 0,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorLightPrimary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 75,
    width: 360,
  },
  wrapper: {
    top: 6,
    left: 0,
    position: "absolute",
    overflow: "hidden",
  },
  frameParent: {
    top: 84,
    left: 8,
    backgroundColor: Color.colorWhitesmoke_100,
    height: 988,
    width: 360,
    position: "absolute",
    overflow: "hidden",
  },
  view: {
    backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    width: "100%",
    height: 799,
    overflow: "hidden",
  },
});

export default Frame3;
