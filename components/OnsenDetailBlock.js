import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const OnsenDetailBlock = ({title,data}) => {
  return(
    <View style={styles.rectangleParent}>
        <Text style={styles.wifi}>
            {title}
        </Text>
        <View style={ styles.list1Position } >
          <Text style={styles.innerText}>{data}</Text>
        </View>
      </View>
  )
}


const styles = StyleSheet.create({
  rectangleParent: {
    // top: 0,
    // left: 2,
    height: 80,
    overflow: "hidden",
    width: 114,
    // position: "absolute",
    marginRight:-1,
    marginTop:0,
    marginBottom:-1,
  },
  wifi: {
    left: 0,
    textAlign: "center",
    alignItems: "center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    fontSize: FontSize.size_3xs,
    height: 24,
    color: Color.labelColorLightPrimary,
    width: 114,
    top: 0,
    position: "absolute",

    borderColor:"black",
    borderWidth:1,
  },
  list1Position: {
    height: 56,
    top: 24,
    width: 114,
    left: 0,
    position: "absolute",
    backgroundColor: Color.labelColorDarkPrimary,
    justifyContent:"center",
    alignItems:"center",
    borderStyle: "solid",
    borderColor:"black",
    borderWidth:1,
    marginTop:-1,
  },
  innerText:{
    fontFamily: FontFamily.interMedium,
    // lineHeight: 22,
    color: Color.labelColorLightPrimary,
    fontSize: FontSize.size_xl,
    fontWeight: "500",

  },
});

export default OnsenDetailBlock;