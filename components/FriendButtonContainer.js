import * as React from "react";
import {
  Pressable,
  ImageBackground,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const FriendButtonContainer = () => {
  return (
    <Pressable
      style={styles.pressable}
      withfriends="友達と行きたい"
      onPress={() => {}}
    >
      <ImageBackground
        style={[styles.child, styles.itemLayout]}
        resizeMode="cover"
        source={require("../assets/rectangle3.png")}
      />
      <View style={[styles.item, styles.itemLayout]} />
      <Text style={styles.text}>{`友達と
行きたい`}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemLayout: {
    borderRadius: Border.br_3xs,
    left: 0,
    height: 88,
    position: "absolute",
  },
  child: {
    marginTop: -44,
    right: 0,
    top: "50%",
  },
  item: {
    top: 0,
    backgroundColor: Color.colorGray,
    width: 156,
    left: 0,
  },
  text: {
    marginTop: -32,
    marginLeft: -70,
    left: "50%",
    fontSize: FontSize.size_3xl,
    letterSpacing: 0,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorDarkPrimary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 64,
    top: "50%",
    position: "absolute",
  },
  pressable: {
    top: 10,
    left: 16,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    height: 88,
    width: 156,
    position: "absolute",
  },
});

export default FriendButtonContainer;
