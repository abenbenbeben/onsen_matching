import React from "react";
import { StyleSheet, Text, TouchableOpacity, PixelRatio } from "react-native";

export default function DefaultButton(props) {
  const { label, onPress, style, isPressable = false } = props;
  return (
    <>
      <TouchableOpacity
        style={[styles.button, style, isPressable && { opacity: 0.5 }]}
        onPress={onPress}
        disabled={isPressable}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    backgroundColor: "#007BFF", // 青色の背景
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // marginBottom: 20,
  },
  buttonText: {
    color: "white", // 白色のテキスト
    fontSize: 16 / PixelRatio.getFontScale(),
    fontWeight: "bold",
  },
});
