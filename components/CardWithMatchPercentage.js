import React, { useMemo } from "react";
import { useState,useEffect } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { IconButton, MD3Colors } from 'react-native-paper';
import { Image } from "expo-image";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const CardWithMatchPercentage = ({
  onsenName,
  matchPercentage,
  viewTop,
  onFramePressablePress,
  heijitunedan,
  kyuzitunedan,
  images,
  isfavorite,
}) => {

  const buttonColor =  isfavorite? 'yellow' : '#FFF';
  const buttonStyle = isfavorite ? 'star' : 'star';

  return (
    <Pressable
      style={[styles.rectangleParent]}
      onPress={onFramePressablePress}
    >
      <View style={styles.frameChild} />
      <IconButton
            icon={buttonStyle}
            iconColor={buttonColor}
            selected="true"
            size={30}
            style={[styles.starLayout]}
        />
      <Image
        style={styles.frameItem}
        contentFit="cover"
        source={images}
      />
      <View style={styles.textComponent}>
        <Text style={styles.text}>{onsenName}</Text>
        {matchPercentage && (
          <View style={styles.view}>
            <Text style={[styles.text1, styles.textTypo]}>{`マッチ度 ${matchPercentage}%`}</Text>
          </View>
        )}
        <View style={styles.wrapper}>
          <Text style={[styles.text2, styles.textTypo]}>
            {`平日 ${heijitunedan}円 祝日 ${kyuzitunedan}円`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  starLayout: {
    top: -10,
    right:-5,
    height: 42,
    width: 42,
    overflow: "hidden",
    position: "absolute",
},
  textComponent:{
    width:242,
    height:90,
    left:111,
    marginTop: 3,
    position: "absolute",
  },
  textTypo: {
    fontSize: FontSize.size_3xs,
    height: 16,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    left: 0,
    top: 0,
    position: "absolute",
  },
  frameChild: {
    backgroundColor: Color.labelColorDarkPrimary,
    left: 0,
    top: 0,
    height: 96,
    width: "100%",
    position: "absolute",
  },
  frameItem: {
    marginTop: 2,
    left: 3,
    width: 101,
    height: 90,
    position: "absolute",
  },
  text: {
    top: 3,
    fontSize: FontSize.size_base,
    width: 224,
    height: 21,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    // left: 111,
    color: Color.labelColorLightPrimary,
    marginVertical:1,
    // position: "absolute",

  },
  text1: {
    color: Color.colorRed,
    width: "100%",
  },
  view: {
    // top: 24,
    width: 80,
    height: 16,
    // left: 111,
    overflow: "hidden",
    // position: "absolute",
    marginVertical:1,

  },
  text2: {
    width: 160,
    color: Color.labelColorLightPrimary,
    fontSize: FontSize.size_3xs,
  },
  wrapper: {
    marginVertical:1,
    // top: 40,
    width: 153,
    height: 16,
    // left: 111,
    overflow: "hidden",
    // position: "absolute",
  },
  rectangleParent: {
    // top: 136,
    // left: 8,
    borderRadius: Border.br_12xs,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    overflow: "hidden",
    height: 96,
    width: 343,
    marginVertical:4,



  },
});

export default CardWithMatchPercentage;
