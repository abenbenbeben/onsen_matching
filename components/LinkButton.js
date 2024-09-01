import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import IconButton from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "./Button";
import { Color } from "../GlobalStyles";

const LinkButton = ({ ButtonText, ButtonFlag, url = null }) => {
  let imagePath;
  const [isPressed, setIsPressed] = useState(false);
  if (ButtonFlag == "GoogleMap") {
    imagePath = require("../assets/GoogleMapIcon.png");
    borderColor = Color.colorAzureBlue;
    paddingLeft = 8;
    paddingRight = 12;
  } else if (ButtonFlag == "OfficialSite") {
    borderColor = Color.colorBrightBlack;
    paddingLeft = 12;
    paddingRight = 12;
  } else {
    url = null; //ButtonFlagが入っていない場合には、表示しない。
  }

  return (
    url && (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(url);
        }}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <View
          style={[
            styles.buttonContainer,
            {
              borderColor,
              paddingLeft,
              paddingRight,
              backgroundColor: isPressed
                ? Color.colorGray
                : Color.colorWhitesmoke_100,
            },
          ]}
        >
          {imagePath && (
            <Image
              source={imagePath} // アイコンのパス
              style={styles.iconStyle}
            />
          )}
          <Text style={styles.buttonText}>{ButtonText}</Text>
        </View>
      </TouchableOpacity>
    )
  );
};

export default LinkButton;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#4285F4", // Googleのブルー
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 5,
    alignSelf: "flex-start",
    borderWidth: 2,
  },
  iconStyle: {
    width: 26, // アイコンの幅
    height: 26,
    marginRight: 10,
  },
  buttonText: {
    color: Color.colorBrightBlack,
    fontSize: 16,
    fontWeight: "bold",
  },
});
