import * as React from "react";
import { useState,useEffect } from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Pressable, StatusBar, ScrollView, Alert,FlatList,ActivityIndicator} from "react-native";
import MatchingButtonContainer from "../components/MatchingButtonContainer";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

import FormContainer3 from "../components/FormContainer3";
import { Border,FontSize, FontFamily, Color } from "../GlobalStyles";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { collection, addDoc,getFirestore,getDocs } from "firebase/firestore";

const db = getFirestore(app); 
const storage = getStorage(app);

const Matching_Frame = ({navigation}) => {
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selecteddata, setSelecteddata] = useState([]);
  const [matchingItems, setMatchingItems] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  const fetchURL = async (imagepath) => {
    try {
      const pathReference = ref(storage, imagepath);
      const url = await getDownloadURL(pathReference);
      return url;
    } catch (error) {
      console.error("Error fetching URL: ", error);
      return null;
    }
  };

  //firestoreの設定

  const fetch_matchingdata = async() => {
    try {
      // キャッシュからデータを取得する
      const cachedData = await AsyncStorage.getItem('matchingDataCache');
      
      const lastUpdatedTimestamp = await AsyncStorage.getItem('matchingDataLastUpdatedTimestamp');
      const shouldFetchFromFirebase = await isDataOutdated(lastUpdatedTimestamp) || !lastUpdatedTimestamp ;
      if (cachedData && !shouldFetchFromFirebase) {
        console.log("キャッシュを読み込んだ！！")
        // キャッシュが存在する場合は、キャッシュからデータを読み込む
        const matchingDataArray = JSON.parse(cachedData);
        setMatchingItems(matchingDataArray);
        setLoading(false);// データ読み込みが完了したらローディング状態を解除
      } else {
        console.log("firebaseを読み込んだ！！")
        // キャッシュが存在しない場合は、データを取得し、キャッシュに保存する。
        const querySnapshot = await getDocs(collection(db, "matching_screen"));
        const fetchPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const beforeImagePromise = fetchURL(data.beforeimage);
          const afterImagePromise = fetchURL(data.afterimage);
          const [beforeImage, afterImage] = await Promise.all([
            beforeImagePromise,
            afterImagePromise,
          ]);
          return {
            id: doc.id,
            sentence: data.sentence,
            beforeImage,
            afterImage,
            data: data.data,
            // その他のデータフィールドを追加
          };
        });
        const matchingDataArray = await Promise.all(fetchPromises);

        // データをキャッシュに保存
        await AsyncStorage.setItem('matchingDataCache', JSON.stringify(matchingDataArray));
        
        setMatchingItems(matchingDataArray);
        setLoading(false); // データ読み込みが完了したらローディング状態を解除
      }
    }catch (e) {
      console.error("Error fetching data: ", e);
      
    }
  }

  // データが更新されたかどうかを確認する関数
const isDataOutdated = async(lastUpdatedTimestamp) => {
  // ここでFirebaseのデータのタイムスタンプと比較して更新されたかを確認
  // 更新された場合は true を返す
  // 更新されていない場合は false を返す
  let matchingDataTimestamp="";
  const querySnapshot_global = await getDocs(collection(db, "global_match_data"));
  querySnapshot_global.forEach((doc) => {
    matchingDataTimestamp=doc.data().matchingDataTimestamp;
  });
  console.log("matchingDataTimestamp",matchingDataTimestamp,lastUpdatedTimestamp)
  if (!lastUpdatedTimestamp) {
    // タイムスタンプが存在しない場合、データが更新されたとみなす（初回起動時）
    await AsyncStorage.setItem('matchingDataLastUpdatedTimestamp', JSON.stringify(matchingDataTimestamp));
    return true;
  }
  const dataUpdated = matchingDataTimestamp  > lastUpdatedTimestamp;
  if(dataUpdated){
    await AsyncStorage.setItem('matchingDataLastUpdatedTimestamp', JSON.stringify(matchingDataTimestamp));
  }
  console.log(dataUpdated)
  return dataUpdated
};

  useEffect(() => {

    // fetch_matchingdata関数を呼び出す
    fetch_matchingdata();
  }, []);



  // Create a reference with an initial file path and name
  //'matching_images/go_onsen.png'

  const handleButtonToggle = (buttonIndex,buttondata) => {
    console.log("handleButtonToggle動いた")

    if (selectedButtons.includes(buttonIndex)) {
      // すでに選択されている場合、選択を解除
      setSelectedButtons(selectedButtons.filter((index) => index !== buttonIndex));
      setSelecteddata(selecteddata.filter((index) => index !== buttondata));
    } else if (selectedButtons.length < 4) {
      // 2つ以上選択されていない場合、選択を許可
      setSelectedButtons([...selectedButtons, buttonIndex]);
      setSelecteddata([...selecteddata, buttondata]);
    } else {
      // 2つ以上のボタンが選択された場合、アラートを表示
      Alert.alert('注意', '4つ以上のボタンを選択できません。');
    }
  };

  if (loading) {
    // ローディング中の表示
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <View style={styles.frameParent}>
        <View style={[styles.wrapper, styles.textLayout]}>
            <Text
              style={[styles.text, styles.textPosition]}
            >{`あなたがスーパー銭湯に求める
ことを選んでください`}</Text>
        </View>
            <FlatList
              data={matchingItems}
              numColumns={2} // 2列で表示
              keyExtractor={(item) => item.id}
              style={styles.flatlist}
              contentContainerStyle={styles.flatlistContent}
              renderItem={({ item }) => (
    
                <MatchingButtonContainer
                    value={item.sentence}
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    onToggle={() => handleButtonToggle(item.id,item.data)}
                    selected={selectedButtons.includes(item.id)}
                />
              )}
            />
      </View>
      <FormContainer3 
        navigation = {navigation}
        selectednum = {selectedButtons.length}
        data = {selecteddata}
      />
      <StatusBar style={styles.textPosition} barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  flatlistContent:{
    alignItems:"center",
    paddingBottom:10,
  },
  flatlist: {
    width:"100%",
    marginBottom:100,

    // borderWidth:2,
    // borderColor:"purple",
  },
  scrollview: {
    width:"96%",
    height:"100%",
    borderWidth:4,

    // borderColor:"green",
    // marginBottom:100,
  },
  textLayout: {
    height: 75,
    width: 360,
  },
  textPosition: {
    top: 0,
    left: 0,
    position: "absolute",
  },
  parent: {
    width:"96%",
    height:"100%",
    // right: 0,
    height: 1000,
    width:"100%",
    alignItems: "center",
    

    // borderWidth:2,
    // borderColor:"blue",
  },
  column:{
    flexDirection:"row",
    justifyContent:"center",
    marginVertical:8,

    // borderColor:"red",
    // borderWidth:1,
  },
  text: {
    fontSize: FontSize.size_3xl,
    letterSpacing: 0,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorLightPrimary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 75,
    width: 360,
  },
  wrapper: {
    top: 6,
    left: 0,
    // position: "absolute",
    overflow: "hidden",
  },
  frameParent: {
    top: 0,
    // left: 10,
    backgroundColor: Color.colorWhitesmoke_100,
    height: "100%",
    width: "100%",
    // position: "absolute",
    overflow: "hidden",
    alignItems: "center",

    // borderWidth:3,
    // borderColor:"blue",
  },
  view: {
    backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    width: "100%",
    height: 799,
    overflow: "hidden",
    textAlign: "center",
    alignItems: "center",
    // borderWidth:2,
    // borderColor:"red",
    
  },

});

export default Matching_Frame;
