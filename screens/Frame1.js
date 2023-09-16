import * as React from "react";
import { StyleSheet, View, Text, StatusBar, Pressable } from "react-native";
import { Image } from "expo-image";
import FormContainer1 from "../components/FormContainer1";
import FormContainer from "../components/FormContainer";
import FormContainer4 from "../components/FormContainer4";
import DarkModeTrueTypeDefault from "../components/DarkModeTrueTypeDefault";
import DarkModeFalse from "../components/DarkModeFalse";
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";

const Frame1 = () => {
  return (
    <View style={styles.view}>
      <View style={styles.grid} />
      <View style={styles.parent}>
        <View style={[styles.view1, styles.textPosition]}>
          <Text style={[styles.text, styles.textTypo1]}>のだ温泉　ほのか</Text>
        </View>
        <Image
          style={[styles.frameChild, styles.textPosition]}
          contentFit="cover"
          source={require("../assets/frame-37.png")}
        />
        <View style={[styles.view2, styles.viewLayout]}>
          <View style={[styles.view3, styles.viewLayout]}>
            <Image
              style={[styles.child, styles.childLayout]}
              contentFit="cover"
              source={require("../assets/rectangle-8.png")}
            />
            <Image
              style={[styles.item, styles.childLayout]}
              contentFit="cover"
              source={require("../assets/rectangle-7.png")}
            />
            <Image
              style={[styles.inner, styles.childLayout]}
              contentFit="cover"
              source={require("../assets/rectangle-6.png")}
            />
            <Image
              style={[styles.rectangleIcon, styles.childLayout]}
              contentFit="cover"
              source={require("../assets/rectangle-9.png")}
            />
            <Image
              style={[styles.child1, styles.childLayout]}
              contentFit="cover"
              source={require("../assets/rectangle-10.png")}
            />
          </View>
        </View>
        <View style={[styles.view4, styles.view4Layout]}>
          <Text style={[styles.text1, styles.view4Layout]}>
            祝日：1200円　平日：1000円
          </Text>
        </View>
        <View style={styles.view5}>
          <Image
            style={[styles.frameIcon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/frame-30.png")}
          />
          <Text style={[styles.text2, styles.textTypo1]}>
            埼玉県野田市野田3丁目
          </Text>
        </View>
        <View style={styles.view6}>
          <Text style={[styles.text3, styles.text3Position]}>
            岩盤浴とマンガが豊富！
          </Text>
          <View style={styles.rectangleView} />
          <Image
            style={[styles.child2, styles.text4Position]}
            contentFit="cover"
            source={require("../assets/rectangle-101.png")}
          />
          <Text style={[styles.text4, styles.textFlexBox]}>魅力</Text>
        </View>
        <View style={styles.view7}>
          <View style={[styles.view8, styles.text3Position]}>
            <View style={[styles.rectangleParent, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text
                style={[styles.wifi, styles.rectanglePosition]}
              >{`フリーWifi `}</Text>
              <Text style={[styles.text5, styles.text5Position]}>○</Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text
                style={[styles.wifi, styles.rectanglePosition]}
              >{`施設の新しさ `}</Text>
              <Text style={[styles.text5, styles.text5Position]}>
                やや新しい
              </Text>
            </View>
            <View style={[styles.rectangleContainer, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                マンガ
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>○</Text>
            </View>
          </View>
          <FormContainer1 />
          <FormContainer />
          <View style={styles.view9}>
            <View style={[styles.rectangleParent, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                ドライサウナ
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>○</Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                ロウリュ
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>×</Text>
            </View>
            <View style={[styles.rectangleContainer, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                水風呂
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>○</Text>
            </View>
          </View>
          <View style={styles.view10}>
            <View style={[styles.rectangleParent, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                ミストサウナ
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>×</Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                塩サウナ
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>×</Text>
            </View>
            <View style={[styles.rectangleContainer, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                泥パック
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>×</Text>
            </View>
          </View>
          <View style={styles.view11}>
            <View style={[styles.rectangleParent, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                子供も楽しめる
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>×</Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                キッズスペース
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>×</Text>
            </View>
            <View style={[styles.rectangleContainer, styles.rectanglePosition]}>
              <View style={[styles.frameItem, styles.text5Position]} />
              <View style={[styles.frameInner, styles.frameBorder]} />
              <View style={[styles.frameChild1, styles.frameBorder]} />
              <Text style={[styles.wifi, styles.rectanglePosition]}>
                話題性
              </Text>
              <Text style={[styles.text5, styles.text5Position]}>×</Text>
            </View>
          </View>
          <View style={styles.view12}>
            <FormContainer4
              spaName="混み具合"
              crowdednessStatus="混んでない"
              propLeft={2}
            />
          </View>
        </View>
      </View>
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
  textPosition: {
    height: 32,
    top: 0,
    position: "absolute",
  },
  textTypo1: {
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
  },
  viewLayout: {
    height: 144,
    position: "absolute",
  },
  childLayout: {
    width: 144,
    height: 144,
    top: 0,
    position: "absolute",
  },
  view4Layout: {
    width: 345,
    height: 24,
    position: "absolute",
  },
  iconLayout: {
    maxHeight: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  text3Position: {
    top: 8,
    height: 80,
    position: "absolute",
  },
  text4Position: {
    width: 41,
    left: 13,
    position: "absolute",
  },
  textFlexBox: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    display: "flex",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
  },
  rectanglePosition: {
    width: 114,
    top: 0,
    position: "absolute",
  },
  text5Position: {
    height: 56,
    top: 24,
    width: 114,
    left: 0,
    position: "absolute",
  },
  frameBorder: {
    borderColor: Color.labelColorLightPrimary,
    width: 114,
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
    backgroundColor: Color.labelColorDarkPrimary,
  },
  groupLayout: {
    height: 45,
    width: 65,
    bottom: -2,
    position: "absolute",
    overflow: "hidden",
  },
  textTypo: {
    height: 15,
    fontSize: FontSize.size_2xs,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    display: "flex",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
  },
  text30Layout: {
    width: 59,
    position: "absolute",
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
    width: 344,
    fontSize: FontSize.size_xl,
    left: 0,
    height: 32,
    top: 0,
    position: "absolute",
  },
  view1: {
    width: 300,
    left: 7,
    overflow: "hidden",
  },
  frameChild: {
    left: 316,
    width: 32,
    overflow: "hidden",
  },
  child: {
    left: 288,
  },
  item: {
    left: 144,
  },
  inner: {
    left: 0,
  },
  rectangleIcon: {
    left: 432,
  },
  child1: {
    left: 576,
  },
  view3: {
    width: 749,
    left: 0,
    top: 0,
  },
  view2: {
    top: 41,
    width: 342,
    left: 7,
  },
  text1: {
    fontSize: FontSize.defaultBoldBody_size,
    height: 24,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
    left: 0,
    top: 0,
  },
  view4: {
    top: 194,
    height: 24,
    left: 7,
    overflow: "hidden",
  },
  frameIcon: {
    bottom: 0,
    width: 24,
    left: 0,
    top: 0,
  },
  text2: {
    left: 32,
    width: 304,
    height: 25,
    fontSize: FontSize.size_xl,
    top: 0,
    position: "absolute",
  },
  view5: {
    top: 227,
    width: 336,
    height: 24,
    left: 7,
    position: "absolute",
    overflow: "hidden",
  },
  text3: {
    width: 328,
    height: 80,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
    fontSize: FontSize.size_xl,
    left: 8,
  },
  rectangleView: {
    borderRadius: Border.br_3xs,
    borderColor: Color.colorLightpink,
    height: 88,
    borderWidth: 1,
    borderStyle: "solid",
    top: 8,
    width: 344,
    left: 0,
    position: "absolute",
    backgroundColor: Color.labelColorDarkPrimary,
  },
  child2: {
    top: 2,
    height: 10,
  },
  text4: {
    top: 3,
    color: Color.colorLightpink,
    height: 9,
    fontSize: FontSize.size_3xs,
    textAlign: "center",
    width: 41,
    left: 13,
    position: "absolute",
  },
  view6: {
    top: 260,
    height: 104,
    width: 344,
    left: 7,
    position: "absolute",
    overflow: "hidden",
  },
  frameItem: {
    backgroundColor: Color.labelColorDarkPrimary,
  },
  frameInner: {
    height: 80,
  },
  frameChild1: {
    height: 24,
  },
  wifi: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    display: "flex",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    fontSize: FontSize.size_3xs,
    height: 24,
    color: Color.labelColorLightPrimary,
    left: 0,
  },
  text5: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    display: "flex",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
    fontSize: FontSize.size_xl,
  },
  rectangleParent: {
    left: 2,
    height: 80,
    overflow: "hidden",
  },
  rectangleGroup: {
    left: 115,
    height: 80,
    overflow: "hidden",
  },
  rectangleContainer: {
    left: 228,
    height: 80,
    overflow: "hidden",
  },
  view8: {
    height: 80,
    width: 344,
    left: 0,
    overflow: "hidden",
  },
  view9: {
    top: 245,
    height: 80,
    width: 344,
    left: 0,
    position: "absolute",
    overflow: "hidden",
  },
  view10: {
    top: 324,
    height: 80,
    width: 344,
    left: 0,
    position: "absolute",
    overflow: "hidden",
  },
  view11: {
    top: 403,
    height: 80,
    width: 344,
    left: 0,
    position: "absolute",
    overflow: "hidden",
  },
  view12: {
    top: 482,
    height: 80,
    width: 344,
    left: 0,
    position: "absolute",
    overflow: "hidden",
  },
  view7: {
    top: 373,
    height: 628,
    width: 344,
    left: 7,
    position: "absolute",
    overflow: "hidden",
  },
  parent: {
    marginTop: -316,
    top: "50%",
    backgroundColor: Color.colorWhitesmoke_100,
    width: 360,
    height: 641,
    left: 8,
    position: "absolute",
  },
  view: {
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
    backgroundColor: Color.labelColorDarkPrimary,
  },
});

export default Frame1;
