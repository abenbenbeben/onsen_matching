import * as React from "react";
import { useEffect ,useState} from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc,getFirestore,getDocs,getDoc,doc,serverTimestamp, query } from "firebase/firestore";
import { app } from "../firebaseconfig";
import { useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import CardWithMatchPercentage from "../components/CardWithMatchPercentage";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';


const db = getFirestore(app); 
const storage = getStorage(app);

const HOME = ({navigation, route}) => {
  const match_array = route.params.data.flat();
  console.log(match_array)
  const [matchingItems, setMatchingItems] = useState([]);
  const [favoriteDataArray, setFavoriteDataArray] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [loadingMessage, setLoadingMessage] = useState('');//ローディング中の文字を管理

  //firestorageの内のパスをURLに変換する関数
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

  const fetch_matchingdata = async() => {

    //現在地情報を取得する関数。Androidが処理停止にならない対策。
    function getCurrentLocation() {
      const timeout = 10000;
      return new Promise(async (resolve, reject) => {
        setTimeout(() => { reject(new Error(`Error getting gps location after ${(timeout * 2) / 1000} s`)) }, timeout * 2);
        setTimeout(async () => { resolve(await Location.getLastKnownPositionAsync()) }, timeout);
        resolve(await Location.getCurrentPositionAsync());
      });
    }
    // データが更新されたかどうかを確認する関数
    const isDataOutdated = async(lastUpdatedTimestamp,matchingDataTimestamp) => {
      // ここでFirebaseのデータのタイムスタンプと比較して更新されたかを確認
      // 更新された場合は true を返す
      // 更新されていない場合は false を返す
      console.log("matchingResultDataArrayLastUpdatedTimestamp",matchingDataTimestamp,lastUpdatedTimestamp)
      matchingDataTimestamp = matchingDataTimestamp || 1;
      if (!lastUpdatedTimestamp) {
        // タイムスタンプが存在しない場合、データが更新されたとみなす（初回起動時）
        await AsyncStorage.setItem('matchingResultDataArrayLastUpdatedTimestamp', JSON.stringify(matchingDataTimestamp));
        return true;
      }
      const dataUpdated = matchingDataTimestamp  > lastUpdatedTimestamp;
      if(dataUpdated){
        await AsyncStorage.setItem('matchingResultDataArrayLastUpdatedTimestamp', JSON.stringify(matchingDataTimestamp));
      }
      console.log(dataUpdated)
      return dataUpdated
    };


    try {
        setLoadingMessage('現在地取得中...');
        let point2 = null;
        const cachedLocation = await AsyncStorage.getItem('currentLocation');
        const cachedLocationTimestamp = await AsyncStorage.getItem('currentLocationTimestamp');
        console.log(cachedLocation)
        console.log(cachedLocationTimestamp)
        if (cachedLocation && cachedLocationTimestamp) {
          // キャッシュから位置情報とタイムスタンプを読み込む
          point2 = JSON.parse(cachedLocation);
          const cachedTimestamp = parseInt(cachedLocationTimestamp, 10);
          const currentTimestamp = Date.now();
          
          // 30分経過していない場合はキャッシュを使用
          if (currentTimestamp - cachedTimestamp <= 30 * 60 * 1000) {
            console.log('Using cached location.');
          } else {
            // キャッシュのタイムスタンプから30分以上経過した場合は新しい位置情報を取得
            console.log('Fetching new location.');
            const { status } = await Location.requestForegroundPermissionsAsync();
    
            if (status === 'granted') {
              let location = await getCurrentLocation();
              const { latitude, longitude } = location.coords;
              point2 = { latitude, longitude };
    
              // 新しい位置情報とタイムスタンプをキャッシュに保存
              await AsyncStorage.setItem('currentLocation', JSON.stringify(point2));
              await AsyncStorage.setItem('currentLocationTimestamp', currentTimestamp.toString());
            } else {
              console.error('Location permission denied.');
            }
          }
        } else {
          try{
            console.log('No cached location. Fetching new location.');
            // キャッシュが存在しない場合は新しい位置情報を取得
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log("status:",status)
      
            if (status === 'granted') {
              let location = await getCurrentLocation()
              console.log("location:",location)
              const { latitude, longitude } = location.coords;
              point2 = { latitude, longitude };
              console.log(point2)
      
              // 新しい位置情報とタイムスタンプをキャッシュに保存
              const currentTimestamp = Date.now();
              await AsyncStorage.setItem('currentLocation', JSON.stringify(point2));
              await AsyncStorage.setItem('currentLocationTimestamp', currentTimestamp.toString());
            } else {
              console.error('Location permission denied.');
              check_settings();
            }
          }catch(e){
            console.log(e)
          }
        }
        if(!point2){
          check_settings();
          //point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
        }
        //point2 = { latitude:35.86542717384397, longitude: 139.51970407189944  };//さいたま市
        //point2 = { latitude:35.87146725131986, longitude: 139.18089139695007 };//飯能
        setLoadingMessage('マッチング中...');
        let furosyurui_max="";let nedan_min="";let ganbansyurui_max="";let matchingDataResultTimestamp=null;
        const querySnapshot_global = await getDocs(collection(db, "global_match_data"));
        querySnapshot_global.forEach((doc) => {
          furosyurui_max=doc.data().furosyurui_max;
          nedan_min = doc.data().nedan_min;
          ganbansyurui_max = doc.data().ganbansyurui_max;
          matchingDataResultTimestamp = doc.data().matchingDataResultTimestamp;
        });
        let querySnapshot = null;
        let matchingDataArray = null;
        let matchingDataArray_origin = null;
        let matchingDataArray_cache = await AsyncStorage.getItem('matchingResultDataArray');
        matchingDataArray_origin = JSON.parse(matchingDataArray_cache);

        let lastUpdatedTimestamp = await AsyncStorage.getItem('matchingResultDataArrayLastUpdatedTimestamp');
        const shouldFetchFromFirebase = await isDataOutdated(lastUpdatedTimestamp,matchingDataResultTimestamp) || !lastUpdatedTimestamp ;
        if(!matchingDataArray_origin || shouldFetchFromFirebase){
          console.log("HOME画面：firebaseを読み込んだ")
          querySnapshot = await getDocs(collection(db, "onsen_data"));
          matchingDataArray_origin = await Promise.all(querySnapshot.docs.map(async (doc) => {
              let data = doc.data();
              data.id = doc.id;
              data.onsenName = data.onsen_name;
              data.heijitunedan = data.heijitunedan;
              data.kyujitunedan = data.kyuzitunedan;
              return data;
          }));
          await AsyncStorage.setItem('matchingResultDataArray', JSON.stringify(matchingDataArray_origin));
        }


        // processField 関数を定義して、必要なデータ処理を行う
        function processField(field, fieldData) {
          if (field === "furosyurui") {
            return parseFloat((fieldData/furosyurui_max).toFixed(2)); // furosyuruiの場合に処理を実行
          }else if(field === "heikinnedan") {
            return parseFloat((nedan_min/fieldData).toFixed(2)); // heikinnedanの場合に処理を実行
          }else if(field === "ganbansyurui") {
            return parseFloat((fieldData/ganbansyurui_max).toFixed(2)); // ganbansyuruiの場合に処理を実行
          }else if(field === "komiguai") {
            return 1-fieldData; // komiguaiの場合に処理を実行
          }else {
            return fieldData; // それ以外の場合は処理を行わず、元のデータを返す
          }
        }
        // 2つの座標の緯度と経度をラジアンに変換するヘルパー関数
        function toRadians(degrees) {
          return degrees * (Math.PI / 180);
        }
        // ヒュベニの公式を使用して2つの座標間の距離を計算
        function haversineDistance(lat1, lon1, lat2, lon2) {
          const R = 6371; // 地球の半径（単位: km）

          const dLat = toRadians(lat2 - lat1);
          const dLon = toRadians(lon2 - lon1);

          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          return R * c;
        }


        matchingDataArray = await Promise.all(matchingDataArray_origin.map(async (item) => {
          item.scoreData = match_array.map((field) => {
            // データを加工してから scoreData に追加
            return processField(field,item[field]);
          });
          
          //matchDataDict.scoreData配列の平均を計算
          const average = (item.scoreData.reduce((acc, value) => acc + value, 0) / item.scoreData.length)*100;
          // 平均を matchDataDict.score に代入
          item.score = Math.floor(average);
          const point1 = { latitude: item.latitude, longitude: item.longitude };
          const distanceInMeters = haversineDistance(point1.latitude,point1.longitude,point2.latitude,point2.longitude);
          item.distance = parseFloat((distanceInMeters).toFixed(1));
          if(item.distance <= 30 && item.score > 50){
            item.images = await fetchURL(item.images[0]);
          }
          return item;
        }));

      setMatchingItems(matchingDataArray);
      setLoading(false); // データ読み込みが完了したらローディング状態を解除
    }catch (e) {
      console.error("Error fetching data: ", e);
    }
  }
  

  // コンポーネントがマウントされた後にお気に入りデータを読み込む
  const fetchFavoriteData = async () => {
    const storedData = await AsyncStorage.getItem('favoriteArray');
    if (JSON.parse(storedData).length>=1) {
      const parsedData = JSON.parse(storedData);
      if (JSON.stringify(parsedData) !== JSON.stringify(favoriteDataArray)) {
        setFavoriteDataArray(parsedData);
      }
    }else{
      setFavoriteDataArray([])
    }
  };

//設定を開く関数
const check_settings = () => {
  Alert.alert(
    "位置情報の許可が必要",
    "この機能を使用するには、位置情報の許可が必要です。設定を開いて許可してください。",
    [
      {text: "設定を開く", onPress: () => Linking.openSettings()},
      {text: "キャンセル", style: "cancel"}
    ],
    { cancelable: false }
  );
}
  

const additems = async() => {
  try {
    const docRef = await addDoc(collection(db, "onsen_data"), {
      onsen_name: "越生温泉 美白の湯 『 梅の湯 』",
      feature: `高アルカリのぬるぬるの美肌の湯`,
      zikan_heijitu_start: 900,
      zikan_heijitu_end: 2100,
      zikan_kyujitu_start: 900,
      zikan_kyujitu_end: 2100,
      sauna: 0,
      rouryu: 0,
      siosauna:0,
      doro:0,
      mizuburo:0,
      tennen:1,
      sensitu:"強アルカリ泉",
      sensituyosa:1,
      tansan:0,
      furosyurui:2,
      manga:0,
      wifi:0,
      tyusyazyo:1,
      heijitunedan:600,
      kyuzitunedan:700,
      heikinnedan:650,
      ganban:0,
      ganbansyurui:0,
      senzai:0,
      facewash:0,
      komiguai:0.3,
      wadai:0,
      kodomo:0,
      latitude:35.97992689879138, 
      longitude: 139.2758944586734,
      place: "埼玉県入間郡越生町古池",
      images:["onsen_images/umenoyu1.jpeg","onsen_images/umenoyu2.png","onsen_images/umenoyu3.png","onsen_images/umenoyu4.png","onsen_images/umenoyu5.png","onsen_images/umenoyu6.png","onsen_images/umenoyu7.png"]
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// const additems = async() => {//
//   try {
//     const docRef = await addDoc(doc(db, "global_match_data","z9eDm6HDqFRpf3fO9nkd"), {
//       firebaseDataTimestamp: serverTimestamp(),
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }



useEffect(() => {
  fetch_matchingdata();
  // additems();
  
}, []);

// useEffect(() => {
//   // matchingItems が更新された際にログを出力
//   console.log(matchingItems);
// }, [matchingItems]);

//お気に入り配列を取得
useEffect(() => {
  fetchFavoriteData();
  // console.log(favoriteDataArray);
}, []);
//Backボタンで戻ってきた時に動く。
useFocusEffect(
  React.useCallback(() => {
    // ここにフォーカスが戻ってきた時に実行したい処理を記述
    // 例: 関数の呼び出し
    fetchFavoriteData();
    console.log(favoriteDataArray);
  }, [])
);

  const renderCard = (item) => (
    <CardWithMatchPercentage
      onsenName={item.onsenName}
      matchPercentage={item.score}
      viewTop={0}
      onFramePressablePress={() => 
        navigation.navigate("Onsen_detail_Frame",{
          data:item.id,
        }
      )}
      heijitunedan={item.heijitunedan}
      kyuzitunedan={item.kyujitunedan}
      images={item.images}
      isfavorite = {favoriteDataArray.includes(item.id)}
    />
  );

  const within5Km = matchingItems.filter(item => item.distance <= 5 && item.score > 50);
  const within10Km = matchingItems.filter(item => item.distance > 5 && item.distance <= 10 && item.score > 50);
  const within15Km = matchingItems.filter(item => item.distance > 10 && item.distance <= 15 && item.score > 50);
  const within20Km = matchingItems.filter(item => item.distance > 15 && item.distance <= 20 && item.score > 50);
  const within25Km = matchingItems.filter(item => item.distance > 20 && item.distance <= 25 && item.score > 50);
  const within30Km = matchingItems.filter(item => item.distance > 25 && item.distance <= 30 && item.score > 50);

  if (loading) {
    // ローディング中の表示
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>{loadingMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.home}>

      <ScrollView>
        {within5Km.length > 0 && (
          <>
            <Text style={styles.kmLayout}>5km圏内</Text>
            <View>
              <FlatList
                data={within5Km}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item.onsenName}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
        {within10Km.length > 0 && (
          <>
            <Text style={styles.kmLayout}>10km圏内</Text>
            <View>
              <FlatList
                data={within10Km}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item.onsenName}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
        {within15Km.length > 0 && (
          <>
            <Text style={styles.kmLayout}>15km圏内</Text>
            <View>
              <FlatList
                data={within15Km}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item.onsenName}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
        {within20Km.length > 0 && (
          <>
            <Text style={styles.kmLayout}>20km圏内</Text>
            <View>
              <FlatList
                data={within20Km}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item.onsenName}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
        {within25Km.length > 0 && (
          <>
            <Text style={styles.kmLayout}>25km圏内</Text>
            <View>
              <FlatList
                data={within25Km}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item.onsenName}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
        {within30Km.length > 0 && (
          <>
            <Text style={styles.kmLayout}>30km圏内</Text>
            <View>
              <FlatList
                data={within30Km}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item.onsenName}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
        {within5Km.length === 0 && within10Km.length === 0 && within15Km.length === 0 && within20Km.length === 0 && within25Km.length === 0 && within30Km.length === 0 && (
          <View style={styles.container}>
            {/* ... 他のコンテンツ ... */}
            <Text style={styles.title}>{`スーパー銭湯は
見つかりませんでした。`}</Text>
            <Text style={styles.content}>
              {`以下Googleフォームから
追加してほしい地域をおしえてください。
優先して追加します。`}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSfXT5iEFCHz7HE1y__QKaZorrwj5CdOMt26gzHPND0sHcfKjw/viewform?usp=sf_link')}>
              <Text style={styles.link}>Googleフォームを開く</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  kmLayout: {
    height: 32,
    width: 92,
    left: 8,
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    // lineHeight: 22,
    letterSpacing: 0,
    fontSize: FontSize.defaultBoldBody_size,
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center",
  },
  home: {
    backgroundColor: Color.labelColorDarkPrimary,
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  flatlistContent:{
      // width: "100%",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",

    // borderColor:"blue",
    // borderWidth:1,
  },

  //アイテムなしの時のスタイル
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
});

export default HOME;
