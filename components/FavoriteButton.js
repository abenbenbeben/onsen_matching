import * as React from "react";
import { useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
import { StyleSheet, View, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontSize, Color } from "../GlobalStyles";

const FavoriteButton = (params) => {
  const data_id = params.id;
  const [favoriteDataArray, setFavoriteDataArray] = useState(
    params.favoriteDataArray
  );
  const fetchFavorite = async () => {
    const storedData = await AsyncStorage.getItem("favoriteArray");
    if (storedData) {
      JSON.parse(storedData);
    }
    const favoriteDataArray = storedData ? JSON.parse(storedData) : [];
    if (favoriteDataArray.includes(data_id)) {
      const updatedFavoriteDataArray = favoriteDataArray.filter(
        (id) => id !== data_id
      );
      await AsyncStorage.setItem(
        "favoriteArray",
        JSON.stringify(updatedFavoriteDataArray)
      );
      setFavoriteDataArray(updatedFavoriteDataArray);
    } else {
      const updatedFavoriteDataArray = [...favoriteDataArray, data_id];
      await AsyncStorage.setItem(
        "favoriteArray",
        JSON.stringify(updatedFavoriteDataArray)
      );
      setFavoriteDataArray(updatedFavoriteDataArray);
    }
  };

  const selectedColor = favoriteDataArray.includes(data_id)
    ? "#FFF"
    : Color.colorFavoriteButton;
  const selectedColor_reverse = favoriteDataArray.includes(data_id)
    ? Color.colorFavoriteButton
    : "rgba(0, 0, 0, 0)";

  useEffect(() => {
    const initializeData = async () => {
      const storedData = await AsyncStorage.getItem("favoriteArray");
      setFavoriteDataArray(storedData ? storedData : []);
    };
    initializeData();
  }, []);

  useEffect(() => {
    setFavoriteDataArray(params.favoriteDataArray);
  }, [params.favoriteDataArray]);

  // useEffect(() => {
  //   // コンポーネントがマウントされた後にお気に入りデータを読み込む
  //   const fetchFavoriteData = async () => {
  //     const storedData = await AsyncStorage.getItem("favoriteArray");
  //     if (storedData) {
  //       setFavoriteDataArray(JSON.parse(storedData));
  //     }
  //   };
  //   fetchFavoriteData();
  // }, []);

  return (
    <>
      <Pressable
        style={[
          styles.buttonContainer,
          { backgroundColor: selectedColor_reverse },
        ]}
        onPress={fetchFavorite}
      >
        <IconButton
          icon={"star"}
          iconColor={selectedColor}
          selected="true"
          size={20}
          style={[styles.starLayout]}
        />
        <Text style={[styles.favoriteText, { color: selectedColor }]}>
          気になる
        </Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 30,
    width: 96,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFC800",
    alignItems: "center",
    borderRadius: 2,
    flexDirection: "row",
  },
  starLayout: {
    margin: 0,
    height: 22,
    width: 22,
    overflow: "hidden",
  },
  favoriteText: {
    color: "#FFC800",
    fontSize: FontSize.bodySub,
    fontWeight: "500",
  },
});

export default FavoriteButton;
