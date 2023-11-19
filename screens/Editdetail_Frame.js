import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Button, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // 矢印アイコンにFontAwesomeを使用
import { collection, addDoc,getFirestore,getDocs,getDoc,doc,updateDoc } from "firebase/firestore";
import { app } from "../firebaseconfig";
import TimeEditor from '../components/TImeEditor';
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";

// Firebaseの設定と初期化をここに記述（すでに設定されている場合は不要）

const db = getFirestore(app);

const Editdetail_Frame = ({navigation, route}) => {
  const onsenDetailData_origin = route.params.data
  const data_id = route.params.data_id
  const [onsenDetailData, setonsenDetailData] = useState(onsenDetailData_origin);
  const [loading, setLoading] = useState(false); // ローディング状態を管理
  
  const handleSave = async (navigation) => {
    // 確認ダイアログを表示
    Alert.alert(
      "確認", 
      "データを保存しますか？",
      [
        {
          text: "キャンセル",
          onPress: () => console.log("キャンセルされました"),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              setLoading(true);
              const washingtonRef = doc(db, "onsen_data", data_id);
              await updateDoc(washingtonRef, {
                ...onsenDetailData
              });
              alert("データを更新しました。");
              navigation.goBack(); // 保存後に前の画面に戻る
            } catch (error) {
              console.error("Error updating data: ", error);
            }
            setLoading(false);
          }
        }
      ],
      { cancelable: false }
    );
  };
  
  const changeProperty = (property, increment) => {
    setonsenDetailData({
      ...onsenDetailData,
      [property]: Math.max(onsenDetailData[property] + increment, 0)
    });
  };

  const options_p1 = [
    { label: '男女あり', value: 1 },
    { label: '男女片方のみ', value: 0.5 },
    { label: 'なし', value: 0 }
  ];
  const options_p2 = [
    { label: 'あり', value: 1 },
    { label: 'なし', value: 0 }
  ];
  const options_p3 = [
    { label: '豊富にある', min: 0.71, max: 1 },
    { label: '普通', min: 0.3, max: 0.7 },
    { label: 'あまりない', min: 0, max: 0.3 }
  ];
  const options_p4 = [
    { label: '○', value: 1 },
    { label: '×', value: 0 }
  ];
  const options_p5 = [
    { label: 'すごく楽しめる', min: 0.71, max: 1 },
    { label: '楽しめる', min: 0.3, max: 0.7 },
    { label: '普通', min: 0, max: 0.3 }
  ];
  const options_p6 = [
    { label: 'すごく良い', min: 0.71, max: 1 },
    { label: '良い', min: 0.31, max: 0.7 },
    { label: '普通', min: 0, max: 0.3 }
  ];
  const options_p7 = [
    { label: 'あり', min: 0.51, max: 1 },
    { label: 'なし', min: 0, max: 0.5 }
  ];
  const options_p8 = [
    { label: '泉質抜群', min: 0.91, max: 1 },
    { label: '天然温泉', min: 0.61, max: 0.9 },
    { label: '沸かし湯', min: 0, max: 0.6 }
  ];
  const options_p9 = [
    { label: '激混み', min: 0.751, max: 1 },
    { label: '混んでる', min: 0.51, max: 0.75 },
    { label: '普通', min: 0.251, max: 0.5 },
    { label: '空いてる', min: 0, max: 0.25 }
  ];
  const handlePress = (key, value) => {
    setonsenDetailData({ ...onsenDetailData, [key]: value });
  };

  useEffect(() => {
    console.log(onsenDetailData)
  }, [onsenDetailData]);

  useEffect(() => {
    console.log(data_id)
  }, [data_id]);

  if (loading||!onsenDetailData) {
    // ローディング中の表示
    return (
      <View style={{ 
        position: 'absolute', // 画面全体にオーバーレイ
        width: '100%',       // 幅を画面全体に
        height: '100%',      // 高さを画面全体に
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景を半透明に設定
      }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.inputContainer}>
        <View style={[styles.view1, styles.textPosition]}>
          <Text style={styles.textTypo1}>{onsenDetailData.onsen_name}</Text>
        </View>
        <Text style={styles.label}>平日値段</Text>
        <View style={styles.furosyuruiContainer}>
          <TouchableOpacity onPress={() => changeProperty('heijitunedan',-10)}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.furosyuruiText}>{onsenDetailData.heijitunedan}円</Text>
          <TouchableOpacity onPress={() => changeProperty('heijitunedan',10)}>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>休日値段</Text>
        <View style={styles.furosyuruiContainer}>
          <TouchableOpacity onPress={() => changeProperty('kyuzitunedan',-10)}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.furosyuruiText}>{onsenDetailData.kyuzitunedan}円</Text>
          <TouchableOpacity onPress={() => changeProperty('kyuzitunedan',10)}>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>平日営業開始時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_heijitu_start}
          setTime={(newTime) => setonsenDetailData({ ...onsenDetailData, zikan_heijitu_start: newTime })}
        />

        <Text style={styles.label}>平日営業終了時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_heijitu_end}
          setTime={(newTime) => setonsenDetailData({ ...onsenDetailData, zikan_heijitu_end: newTime })}
        />
        <Text style={styles.label}>休日営業開始時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_kyujitu_start}
          setTime={(newTime) => setonsenDetailData({ ...onsenDetailData, zikan_kyujitu_start: newTime })}
        />
        <Text style={styles.label}>休日営業終了時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_kyujitu_end}
          setTime={(newTime) => setonsenDetailData({ ...onsenDetailData, zikan_kyujitu_end: newTime })}
        />

        <Text style={styles.label}>フェイスウォッシュ</Text>
        <View style={styles.buttonContainer}>
          {options_p1.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.facewash === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('facewash', option.value)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>塩サウナ</Text>
        <View style={styles.buttonContainer}>
          {options_p1.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.siosauna === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('siosauna', option.value)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>マンガ</Text>
        <View style={styles.buttonContainer}>
          {options_p3.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.manga >= option.min && onsenDetailData.manga <= option.max ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('manga', (option.min + option.max) / 2)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>サウナ</Text>
        <View style={styles.buttonContainer}>
          {options_p2.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.sauna === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('sauna', option.value)} // 'sauna' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>ロウリュウ</Text>
        <View style={styles.buttonContainer}>
          {options_p1.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.rouryu === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('rouryu', option.value)} // 'rouryu' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>水風呂</Text>
        <View style={styles.buttonContainer}>
          {options_p2.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.mizuburo === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('mizuburo', option.value)} // 'mizuburo' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>炭酸泉</Text>
        <View style={styles.buttonContainer}>
          {options_p2.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.tansan === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('tansan', option.value)} // 'tansan' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>お風呂の種類</Text>
        <View style={styles.furosyuruiContainer}>
          <TouchableOpacity onPress={() => changeProperty('furosyurui',-1)}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.furosyuruiText}>{onsenDetailData.furosyurui}</Text>
          <TouchableOpacity onPress={() => changeProperty('furosyurui',1)}>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>天然温泉</Text>
        <View style={styles.buttonContainer}>
          {options_p4.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.tennen === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('tennen', option.value)} // 'tennen' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>子供も楽しめるか</Text>
        <View style={styles.buttonContainer}>
          {options_p5.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.kodomo >= option.min && onsenDetailData.kodomo <= option.max ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('kodomo', (option.min + option.max) / 2)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>泥パック</Text>
        <View style={styles.buttonContainer}>
          {options_p1.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.doro === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('doro', option.value)} // 'doro' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>フリーwifi</Text>
        <View style={styles.buttonContainer}>
          {options_p2.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.wifi === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('wifi', option.value)} // 'wifi' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>ソープの良さ</Text>
        <View style={styles.buttonContainer}>
          {options_p6.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.senzai >= option.min && onsenDetailData.senzai <= option.max ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('senzai', (option.min + option.max) / 2)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>岩盤浴</Text>
        <View style={styles.buttonContainer}>
          {options_p2.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.ganban === option.value ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('ganban', option.value)} // 'ganban' を指定
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>岩盤浴の種類</Text>
        <View style={styles.furosyuruiContainer}>
          <TouchableOpacity onPress={() => changeProperty('ganbansyurui',-1)}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.furosyuruiText}>{onsenDetailData.ganbansyurui}</Text>
          <TouchableOpacity onPress={() => changeProperty('ganbansyurui',1)}>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>話題性</Text>
        <View style={styles.buttonContainer}>
          {options_p7.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.wadai >= option.min && onsenDetailData.wadai <= option.max ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('wadai', (option.min + option.max) / 2)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>泉質の良さ</Text>
        <View style={styles.buttonContainer}>
          {options_p8.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.sensituyosa >= option.min && onsenDetailData.sensituyosa <= option.max ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('sensituyosa', (option.min + option.max) / 2)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>混み具合</Text>
        <View style={styles.buttonContainer}>
          {options_p9.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.komiguai >= option.min && onsenDetailData.komiguai <= option.max ? styles.selected : styles.unselected
              ]}
              onPress={() => handlePress('komiguai', (option.min + option.max) / 2)}
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* 他のフィールドも同様に追加... */}
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={styles.savebutton} onPress={() => handleSave(navigation)}>
          <Text style={styles.savebuttonText}>更新</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
  
  const styles = StyleSheet.create({
    //タイトルのスタイル
    view1: {
      height: 32,
      top: 0,
      width: 330,
      left: 7,
      overflow: "hidden",
      marginTop:4,
      marginBottom:10,
    },
    textTypo1: {
      alignItems: "center",
      display: "flex",
      textAlign: "left",
      fontFamily: FontFamily.interMedium,
      fontSize: FontSize.size_xl,
      fontWeight: "500",
      letterSpacing: 0,
      color: Color.labelColorLightPrimary,
      width: 344,
      left: 0,
      height: 32,
    },
    //タイトルのスタイル終了
    container: {
      flex: 1,
      padding: 10,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      margin: 5,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selected: {
      backgroundColor: '#007BFF', // ハイライト色
    },
    unselected: {
      backgroundColor: '#ccc', // 暗い色
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },

    //風呂種類のスタイル
    furosyuruiContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    furosyuruiText: {
      marginHorizontal: 20,
      fontSize: 20,
      fontWeight: 'bold',
    },
    //風呂種類のスタイル終了

    //編集するボタンのスタイル
  savebutton: {
    width:200,
    backgroundColor: '#007BFF', // 青色の背景
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop:30,
    marginBottom:50,
  },
  savebuttonText: {
    color: 'white', // 白色のテキスト
    fontSize: 16,
    fontWeight: 'bold',
  },
  //編集するボタンのスタイル終了
  });
  
  export default Editdetail_Frame;
  