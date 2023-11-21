import * as React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, Color, FontSize, Border } from '../GlobalStyles';

const AttractiveSpace = ({miryokuText}) => {
    return (
        <View style={styles.rectangleView}>
            <Text style={styles.text4}></Text>
            <View style={styles.wrapper}>
                <Text style={styles.text3}>
                    {miryokuText}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rectangleView: {
        borderRadius: Border.br_3xs,
        borderColor: Color.colorLightpink,
        // height: 88,
        borderWidth: 1,
        borderStyle: "solid",
        width: "98%",
        // position: "absolute",
        backgroundColor: Color.labelColorDarkPrimary,
      },
      wrapper: {
        width:"100%",
        alignItems:"center",
      },
    text3: {
        // top: 25,
        // height: 80,
        // position: "absolute",
        width: "96%",
        // height: 56,
        alignItems: "center",
        display: "flex",
        textAlign: "left",
        fontFamily: FontFamily.interMedium,
        fontWeight: "500",
        lineHeight: 23,
        letterSpacing: 0,
        color: Color.labelColorLightPrimary,
        fontSize: FontSize.size_xl,
        // left: 8,
        marginTop:5,
        marginBottom:20,

        // borderColor:"red",
        // borderWidth:1,
    },
    text4: {
        // top: 8,
        left: 13,
        // position: "absolute",
        //color:"black",
        color: Color.colorLightpink,
        width: 41,
        height: 9,
        fontSize: FontSize.size_3xs,
        textAlign: "center",
        
        justifyContent: "center",
        textAlign: "center",
        fontFamily: FontFamily.interMedium,
        fontWeight: "500",
        letterSpacing: 0,

        marginVertical:7,


    },
})

export default AttractiveSpace;