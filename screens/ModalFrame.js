import * as React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import DefaultButton from "../components/DefaultButton";

const ModalFrame = () => {
  const navigation = useNavigation();
  const handleReportPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Matching_Frame" }],
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 30 }}>再マッチングしますか？</Text>
      <DefaultButton
        onPress={handleReportPress}
        label="マッチングする"
        style={[{ marginVertical: 20 }]}
      />
    </View>
  );
};

export default ModalFrame;
