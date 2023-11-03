import * as React from "react";
import { useState,useEffect } from "react";
import { IconButton, MD3Colors } from 'react-native-paper';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const FavoriteButton = (data) => {
    const data_id = data.id
    const [isPressed, setIsPressed] = useState();
    const [isIcon, setIsIcon] = useState();
    const [favoriteDataArray, setFavoriteDataArray] = useState([]);
    const fetchFavorite = async () => {
        if (favoriteDataArray.includes(data_id)) {
          const updatedFavoriteDataArray = favoriteDataArray.filter(id => id !== data_id);
          await AsyncStorage.setItem('favoriteArray', JSON.stringify(updatedFavoriteDataArray));
          setFavoriteDataArray(updatedFavoriteDataArray);
        } else {
          const updatedFavoriteDataArray = [...favoriteDataArray, data_id];
          await AsyncStorage.setItem('favoriteArray', JSON.stringify(updatedFavoriteDataArray));
          setFavoriteDataArray(updatedFavoriteDataArray);
        }
      };


    const buttonColor =  favoriteDataArray.includes(data_id)? 'yellow' : 'black'
    const buttonStyle = favoriteDataArray.includes(data_id) ? 'star' : 'star-outline'

    useEffect(() => {
        // コンポーネントがマウントされた後にお気に入りデータを読み込む
        const fetchFavoriteData = async () => {
          const storedData = await AsyncStorage.getItem('favoriteArray');
          if (storedData) {
            setFavoriteDataArray(JSON.parse(storedData));
          }
        };
        fetchFavoriteData();
      }, []);

    return(
        <IconButton
            icon={buttonStyle}
            iconColor={buttonColor}
            selected="true"
            size={35}
            onPress={fetchFavorite}
            style={[styles.starLayout]}
        />
    );
};

const styles = StyleSheet.create({
    starLayout: {
        top: -10,
        right:0,
        height: 42,
        width: 42,
        overflow: "hidden",
        position: "absolute",
    },
})



export default FavoriteButton;
