import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

export default function Button(props){
    const { label, onPress, style } = props;
    return (
        <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
            <Text style={styles.buttonLabel}>{ label }</Text>
        </TouchableOpacity>
    ) 
}


const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#3A6AE5',
        borderRadius: 4,
        //ボタンが横長の時に以下を記載する。
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    buttonLabel: {
        fontSize: 22,
        lineHeight: 32,
        paddingVertical: 8,
        paddingHorizontal: 32,
        color: 'white',
    },
})