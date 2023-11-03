import * as React from "react";
import { StyleSheet, View, Text, Button} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const ModalFrame = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>再マッチングしますか？</Text>
      <Button onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Matching_Frame'}]
        })} title="マッチングする" />
    </View>
  );
};



export default ModalFrame;
