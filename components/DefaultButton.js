import React from "react";
import { StyleSheet, Text, TouchableOpacity, PixelRatio } from "react-native";

export default function DefaultButton(props) {
  const { label, onPress, style } = props;
  return (
    <>
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
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
    marginBottom: 50,
  },
  buttonText: {
    color: "white", // 白色のテキスト
    fontSize: 16 / PixelRatio.getFontScale(),
    fontWeight: "bold",
  },
});
