import * as React from "react";
import { useState,useEffect } from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Pressable, StatusBar, ScrollView, Alert,FlatList,ActivityIndicator,TouchableOpacity, PixelRatio} from "react-native";
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
  const [selectedButtons_purpose, setSelectedButtons_purpose] = useState([]);
  const [selecteddata_purpose, setSelecteddata_purpose] = useState([]);
  const [matchingItems, setMatchingItems] = useState([]);
  const [matchingItemsPurpose, setMatchingItemsPurpose] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [activeTab, setActiveTab] = useState(1); // タブの状態を管理例えば、1と2のタブがあると仮定


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
      const cachedData_purpose = await AsyncStorage.getItem('matchingDataCache_purpose');
      
      const lastUpdatedTimestamp = await AsyncStorage.getItem('matchingDataLastUpdatedTimestamp');
      const shouldFetchFromFirebase = await isDataOutdated(lastUpdatedTimestamp) || !lastUpdatedTimestamp ;
      if (cachedData && cachedData_purpose && !shouldFetchFromFirebase) {
        console.log("キャッシュを読み込んだ！！")
        // キャッシュが存在する場合は、キャッシュからデータを読み込む
        const matchingDataArray = JSON.parse(cachedData);
        const matchingDataArray_purpose = JSON.parse(cachedData_purpose);
        setMatchingItems(matchingDataArray);
        setMatchingItemsPurpose(matchingDataArray_purpose);
        setLoading(false);// データ読み込みが完了したらローディング状態を解除
      } else {
        console.log("firebaseを読み込んだ！！")
        // キャッシュが存在しない場合は、データを取得し、キャッシュに保存する。
        const querySnapshot = await getDocs(collection(db, "matching_screen"));
        const querySnapshot_purpose = await getDocs(collection(db, "matching_screen_purpose"));
        const processData = async (doc) => {
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
        };
        const fetchPromises = querySnapshot.docs.map(doc => processData(doc));
        const fetchPromises_purpose = querySnapshot_purpose.docs.map(doc => processData(doc));
        
        const matchingDataArray = await Promise.all(fetchPromises);
        const matchingDataArray_purpose = await Promise.all(fetchPromises_purpose);

        // データをキャッシュに保存
        await AsyncStorage.setItem('matchingDataCache', JSON.stringify(matchingDataArray));
        await AsyncStorage.setItem('matchingDataCache_purpose', JSON.stringify(matchingDataArray_purpose));
        
        setMatchingItemsPurpose(matchingDataArray_purpose);
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
  matchingDataTimestamp = matchingDataTimestamp || 1;
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
  const additems = async() => {
    try {
      const docRef = await addDoc(collection(db, "matching_screen_purpose"), {
        afterimage: "matching_images/kondenai.png",
        beforeimage: "matching_images/kondenai_dark.png",
        data:["komiguai","manga","wifi"],
        sentence: "コスパが良い"
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    // fetch_matchingdata関数を呼び出す
    fetch_matchingdata();
    //additems();
  }, []);



  // Create a reference with an initial file path and name
  //'matching_images/go_onsen.png'

  const handleButtonToggle = (buttonIndex,buttondata) => {

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

  const handleButtonToggle_purpose = (buttonIndex,buttondata) => {

    if (selectedButtons_purpose.includes(buttonIndex)) {
      // すでに選択されている場合、選択を解除
      setSelectedButtons_purpose(selectedButtons_purpose.filter((index) => index !== buttonIndex));
      setSelecteddata_purpose(selecteddata_purpose.filter((index) => index !== buttondata));
    } else if (selectedButtons_purpose.length < 1) {
      // 2つ以上選択されていない場合、選択を許可
      setSelectedButtons_purpose([...selectedButtons_purpose, buttonIndex]);
      setSelecteddata_purpose([...selecteddata_purpose, buttondata]);
    } else {
      // 2つ以上のボタンが選択された場合、アラートを表示
      Alert.alert('注意', '1つ以上のボタンを選択できません。');
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

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 1 ? styles.tabButtonActive : null]}
            onPress={() => setActiveTab(1)}
          >
            <Text style={[styles.tabButtonText, activeTab === 1 ? styles.tabButtonTextActive : null]}>
              特徴から
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 2 ? styles.tabButtonActive : null]}
            onPress={() => setActiveTab(2)}
          >
            <Text style={[styles.tabButtonText, activeTab === 2 ? styles.tabButtonTextActive : null]}>
              目的から
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 1 && (
          <>
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
                    height={88}
                    width={156}
                />
              )}
            />
            <FormContainer3 
              navigation = {navigation}
              selectednum = {selectedButtons.length}
              data = {selecteddata}
              maxnum={4}
            />
          </>
        )}
        {activeTab === 2 && (
          <>
            <FlatList
              data={matchingItemsPurpose}
              numColumns={1} // 2列で表示
              keyExtractor={(item) => item.id}
              style={styles.flatlist}
              contentContainerStyle={styles.flatlistContent}
              renderItem={({ item }) => (
    
                <MatchingButtonContainer
                    value={item.sentence}
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    onToggle={() => handleButtonToggle_purpose(item.id,item.data)}
                    selected={selectedButtons_purpose.includes(item.id)}
                    height={132}
                    width={328}
                />
              )}
            />
            <FormContainer3 
              navigation = {navigation}
              selectednum = {selectedButtons_purpose.length}
              data = {selecteddata_purpose}
              maxnum={1}
            />
          </>
        )}
      </View>
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
  },
  scrollview: {
    width:"96%",
    height:"100%",
    borderWidth:4,

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
  },
  column:{
    flexDirection:"row",
    justifyContent:"center",
    marginVertical:8,
  },
  text: {
    fontSize: 22/PixelRatio.getFontScale(),
    letterSpacing: 0,
    // lineHeight: 22,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorLightPrimary,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 75,
    width: 360,
    // borderWidth:1,
    // borderColor:"red",
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

  //タブのスタイル
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    // backgroundColor: '#f8f8f8', // 薄いグレーの背景色
  },
  tabButton: {
    borderBottomWidth: 2,
    borderColor: 'transparent', // 透明な境界線
    paddingBottom: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  tabButtonText: {
    color: '#666', // 暗めのグレーテキスト
    fontSize: 16/PixelRatio.getFontScale(),
  },
  tabButtonActive: {
    //borderBottomColor: '#007BFF', // アクティブなタブの境界線は青色
    borderBottomWidth:1,
    paddingBottom: 6, // アクティブなタブは少し境界線に近づける
    marginBottom:2,

    borderColor:"#007BFF",
  },
  tabButtonTextActive: {
    color: '#007BFF', // アクティブなタブのテキストも青色
    fontWeight: 'bold',
  },
  //タブのスタイル終了
});

export default Matching_Frame;
