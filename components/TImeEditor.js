import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome アイコンを使用

const TimeEditor = ({ label, time, setTime }) => {
    const increaseTime = () => {
        let hours = Math.floor(time / 100);
        let minutes = time % 100;
      
        minutes += 30; // 分を30分増やす
        if (minutes >= 60) { // 分が60に達したら時間を繰り上げ
          hours++;
          minutes -= 60;
        }
      
        // if (hours >= 24) { // 時間が24に達したら1日加算
        //   hours -= 24;
        // }
        
        const newTime = hours * 100 + minutes;
        setTime(newTime >= 3600 ? 0 : newTime); // 時間が36:00を超えたら0:00にリセット
      };

    const decreaseTime = () => {
        let hours = Math.floor(time / 100);
        let minutes = time % 100;
      
        minutes -= 30; // 分を30分減らす
        if (minutes < 0) { // 分が負の数になったら時間を繰り下げ
          hours--;
          minutes += 60;
        }
      
        if (hours < 0) { // 時間が負の数になったら24時を起点とする
          hours += 36;
        }
      
        const newTime = hours * 100 + minutes;
        setTime(newTime);
      };

  // 時間をHH:MM形式にフォーマット
  const formatTime = (time) => {
    let hours = Math.floor(time / 100);
    const minutes = time % 100;
    let nextDay = false;
  
    if (hours >= 24) {
      hours -= 24;
      nextDay = true;
    }
  
    return `${nextDay ? '翌' : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <TouchableOpacity onPress={decreaseTime} style={styles.button}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
        <TouchableOpacity onPress={increaseTime} style={styles.button}>
          <FontAwesome name="arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginHorizontal: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    // backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default TimeEditor;
