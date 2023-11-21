import * as React from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import Button from "./Button";

const FormContainer3 = ({navigation,selectednum,data,maxnum}) => {
  //  const navigation = useNavigation();

  const handleSaveButtonPress = () => {
    if (selectednum === 0) {
      // selectednum が 0 の場合にアラートを表示
      Alert.alert("注意",'選択されているアイテムがありません。');
    } else {
      // selectednum が 0 でない場合に画面遷移
      
      navigation.replace('Root', {
        screen:"HOME",
        params :{data: data},
      });
    }
  };

  return (
    <View style={styles.view}>
      <View style={styles.view1}>
        <Text style={styles.text2}>{selectednum} / {maxnum}</Text>
        <Text style={styles.text1}>選択中</Text>
      </View>
      <Button
          style={styles.pressable}
          label="保存" 
          onPress={handleSaveButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    // left: "60%",
    height: 56,
    top: 8,
    overflow: "hidden",
    // position: "absolute",
  },
  text1: {
    left: 52,
    width:96,
    fontSize: FontSize.size_xl,
    color: Color.labelColorLightPrimary,
    alignItems: "center",
    textAlign: "center",
    alignContent:"center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    
  },
  text2: {
    left: 40,
    fontSize: FontSize.size_5xl,
  },
  view1: {
    top: 8,
    width: 208,
    height: 56,
    overflow: "hidden",
    flexDirection:"row",
    alignItems:"center",
    marginRight:8,
  },
  view: {
    bottom: 0,
    backgroundColor: "white",
    height: 100,
    width:"100%",
    position: "absolute",
    flexDirection:"row",
    justifyContent:"center",
  },
});

export default FormContainer3;
