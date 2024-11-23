import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  PixelRatio,
} from "react-native";
import MatchingButtonContainer from "../components/MatchingButtonContainer";
import FormContainer3 from "../components/FormContainer3";
import HeaderScreen from "../components/HeaderScreen";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";
import firebase from "firebase/app";
import "firebase/firestore";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { DataContext } from "../DataContext";
import MatchingContainer from "../components/MatchingContainer";

const db = getFirestore(app);
const storage = getStorage(app);

const Matching_Frame = ({ navigation }) => {
  const { setData } = useContext(DataContext);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selecteddata, setSelecteddata] = useState([]);
  const [selectedButtons_purpose, setSelectedButtons_purpose] = useState([]);
  const [selecteddata_purpose, setSelecteddata_purpose] = useState([]);
  const [selecteddata_purposeData, setSelecteddata_purposeData] = useState([]);
  const [matchingItemsFeature, setMatchingItemsFeature] = useState([]);
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

  const fetch_matchingdata = async () => {
    try {
      // キャッシュからデータを取得する
      const cachedData = await AsyncStorage.getItem("matchingDataCache");
      const cachedData_purpose = await AsyncStorage.getItem(
        "matchingDataCache_purpose"
      );

      const lastUpdatedTimestamp = await AsyncStorage.getItem(
        "matchingDataLastUpdatedTimestamp"
      );
      const shouldFetchFromFirebase =
        (await isDataOutdated(lastUpdatedTimestamp)) || !lastUpdatedTimestamp;
      if (cachedData && cachedData_purpose && !shouldFetchFromFirebase) {
        console.log("キャッシュを読み込んだ！！");
        // キャッシュが存在する場合は、キャッシュからデータを読み込む
        const matchingDataArray = JSON.parse(cachedData);
        const matchingDataArray_purpose = JSON.parse(cachedData_purpose);
        setMatchingItemsFeature(matchingDataArray);
        setMatchingItemsPurpose(matchingDataArray_purpose);
        setLoading(false); // データ読み込みが完了したらローディング状態を解除
      } else {
        console.log("firebaseを読み込んだ！！");
        // キャッシュが存在しない場合は、データを取得し、キャッシュに保存する。
        const querySnapshot = await getDocs(
          collection(db, "matching_screen_v2")
        );
        const querySnapshot_purpose = await getDocs(
          collection(db, "matching_screen_purpose_v2")
        );
        const processData = async (doc) => {
          const data = doc.data();
          const beforeImagePromise = fetchURL(data.beforeimage);
          const afterImagePromise = fetchURL(data.afterimage);
          const [beforeImage, afterImage] = await Promise.all([
            beforeImagePromise,
            afterImagePromise,
          ]);
          return {
            fbid: doc.id,
            id: data.id,
            sentence: data.sentence,
            beforeImage,
            afterImage,
            data: data.data,
            data_purpose: data.data_purpose ? data.data_purpose : "",
            // その他のデータフィールドを追加
          };
        };
        const fetchPromises = querySnapshot.docs.map((doc) => processData(doc));
        const fetchPromises_purpose = querySnapshot_purpose.docs.map((doc) =>
          processData(doc)
        );

        const matchingDataArray = await Promise.all(fetchPromises);
        const matchingDataArray_purpose = await Promise.all(
          fetchPromises_purpose
        );

        // データをキャッシュに保存
        await AsyncStorage.setItem(
          "matchingDataCache",
          JSON.stringify(matchingDataArray)
        );
        await AsyncStorage.setItem(
          "matchingDataCache_purpose",
          JSON.stringify(matchingDataArray_purpose)
        );

        setMatchingItemsPurpose(matchingDataArray_purpose);
        setMatchingItemsFeature(matchingDataArray);
        setLoading(false); // データ読み込みが完了したらローディング状態を解除
      }
    } catch (e) {
      console.error("Error fetching data: ", e);
    }
  };

  // データが更新されたかどうかを確認する関数
  const isDataOutdated = async (lastUpdatedTimestamp) => {
    // ここでFirebaseのデータのタイムスタンプと比較して更新されたかを確認
    // 更新された場合は true を返す
    // 更新されていない場合は false を返す
    let matchingDataTimestamp = "";
    const querySnapshot_global = await getDocs(
      collection(db, "global_match_data")
    );
    querySnapshot_global.forEach((doc) => {
      matchingDataTimestamp = doc.data().matchingDataTimestamp;
    });
    console.log(
      "matchingDataTimestamp",
      matchingDataTimestamp,
      lastUpdatedTimestamp
    );
    matchingDataTimestamp = matchingDataTimestamp || 1;
    if (!lastUpdatedTimestamp) {
      // タイムスタンプが存在しない場合、データが更新されたとみなす（初回起動時）
      await AsyncStorage.setItem(
        "matchingDataLastUpdatedTimestamp",
        JSON.stringify(matchingDataTimestamp)
      );
      return true;
    }
    const dataUpdated = matchingDataTimestamp > lastUpdatedTimestamp;
    if (dataUpdated) {
      await AsyncStorage.setItem(
        "matchingDataLastUpdatedTimestamp",
        JSON.stringify(matchingDataTimestamp)
      );
    }
    console.log(dataUpdated);
    return dataUpdated;
  };

  useEffect(() => {
    fetch_matchingdata();
  }, []);

  if (loading) {
    // ローディング中の表示
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const transferData = {
    selecteddata_feature: selecteddata,
    selecteddata_purpose: selecteddata_purpose,
    selectedButtons_feature: selectedButtons,
    selectedButtons_purpose: selectedButtons_purpose,
    selectedButtons_purposeName: selecteddata_purposeData,
    matchingItemsFeature: matchingItemsFeature,
    matchingItemsPurpose: matchingItemsPurpose,
  };

  return (
    <View style={styles.view}>
      <HeaderScreen headerText="好みの条件を選ぶ" />
      <MatchingContainer data={transferData} containerHeight={100} />
    </View>
  );
};

{
  /* <FormContainer3
          navigation={navigation}
          selectednum={selectedButtons.length}
          data_feature={selecteddata}
          data_purpose={selecteddata_purpose}
          selectedButtons_feature={selectedButtons}
          selectedButtons_purpose={selectedButtons_purpose}
          selectedButtons_purposeName={selecteddata_purposeData}
          matchingItemsFeature={matchingItemsFeature}
          matchingItemsPurpose={matchingItemsPurpose}
          maxnum={4}
          containerHeight={100}
        /> */
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default Matching_Frame;
