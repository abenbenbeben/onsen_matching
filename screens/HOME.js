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
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import CardWithMatchPercentage from "../components/CardWithMatchPercentage";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import MapView, { Marker } from 'react-native-maps';
import geolib from 'geolib';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';


const db = getFirestore(app); 
const storage = getStorage(app);

const HOME = ({navigation, route}) => {
  const match_array = route.params.data.flat();
  console.log(match_array)
  const [matchingItems, setMatchingItems] = useState([]);
  const [favoriteDataArray, setFavoriteDataArray] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を管理

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
    try {
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
              const location = await Location.getCurrentPositionAsync({});
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
          console.log('No cached location. Fetching new location.');
          // キャッシュが存在しない場合は新しい位置情報を取得
          const { status } = await Location.requestForegroundPermissionsAsync();
    
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            point2 = { latitude, longitude };
    
            // 新しい位置情報とタイムスタンプをキャッシュに保存
            const currentTimestamp = Date.now();
            await AsyncStorage.setItem('currentLocation', JSON.stringify(point2));
            await AsyncStorage.setItem('currentLocationTimestamp', currentTimestamp.toString());
          } else {
            console.error('Location permission denied.');
          }
        }
        let furosyurui_max="";let nedan_min="";let ganbansyurui_max="";
        const querySnapshot_global = await getDocs(collection(db, "global_match_data"));
        querySnapshot_global.forEach((doc) => {
          furosyurui_max=doc.data().furosyurui_max;
          nedan_min = doc.data().nedan_min;
          ganbansyurui_max = doc.data().ganbansyurui_max;

        });
        let querySnapshot = null;
        querySnapshot = await getDocs(collection(db, "onsen_data"));
        const matchingDataArray = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const matchDataDict = {};
          matchDataDict.scoreData = match_array.map((field) => {
            // データを加工してから scoreData に追加
            return processField(field,data[field]);
          });
          
          // processField 関数を定義して、必要なデータ処理を行う
          function processField(field, fieldData) {
            if (field === "furosyurui") {
              return parseFloat((fieldData/furosyurui_max).toFixed(2)); // furosyuruiの場合に処理を実行
            }if(field === "heikinnedan") {
              return parseFloat((nedan_min/fieldData).toFixed(2)); // heikinnedanの場合に処理を実行
            }if(field === "ganbansyurui") {
              return parseFloat((fieldData/ganbansyurui_max).toFixed(2)); // ganbansyuruiの場合に処理を実行
            }if(field === "komiguai") {
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
          // matchDataDict.scoreData配列の平均を計算
          const average = (matchDataDict.scoreData.reduce((acc, value) => acc + value, 0) / matchDataDict.scoreData.length)*100;
          // 平均を matchDataDict.score に代入
          matchDataDict.score = Math.floor(average);
          const point1 = { latitude: data.latitude, longitude: data.longitude }; 
          // const point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
          const distanceInMeters = haversineDistance(point1.latitude,point1.longitude,point2.latitude,point2.longitude);
          matchDataDict.distance = parseFloat((distanceInMeters).toFixed(1));
          matchDataDict.id = doc.id;
          matchDataDict.onsenName = data.onsen_name;
          matchDataDict.heijitunedan = data.heijitunedan;
          matchDataDict.kyujitunedan = data.kyuzitunedan;
          matchDataDict.images = await fetchURL(data.images[0]);

          return matchDataDict;
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
  
  

const additems = async() => {
  try {
    const docRef = await addDoc(collection(db, "onsen_data"), {
      onsen_name: "さいたま清河寺温泉",
      feature: `竹林の中の温泉は薄い褐色でつるつる。デスクワークのコーナーにWi-Fiも照明も整備され非常に○。`,
      zikan_heijitu_start: 1000,
      zikan_heijitu_end: 2400,
      zikan_kyujitu_start: 1000,
      zikan_kyujitu_end: 2400,
      sauna: 1,
      rouryu: 0,
      siosauna:0,
      doro:0,
      mizuburo:1,
      tennen:1,
      sensitu:"ナトリウム一塩化物温泉 (拡張性・弱アルカリ性・温泉)",
      sensituyosa:0.8,
      tansan:1,
      furosyurui:8,
      manga:0,
      wifi:1,
      tyusyazyo:1,
      heijitunedan:820,
      kyuzitunedan:920,
      heikinnedan:870,
      ganban:0,
      ganbansyurui:0,
      senzai:0.5,
      facewash:0,
      komiguai:0.7,
      wadai:0.2,
      kodomo:0.2,
      latitude: 35.93395036246008,
      longitude: 139.58206893929895,
      place: "埼玉県さいたま市西区清河寺６８３−４",
      images:["onsen_images/seiganji1.jpeg","onsen_images/seiganji2.jpeg","onsen_images/seiganji3.jpeg","onsen_images/seiganji4.jpeg","onsen_images/seiganji5.jpeg","onsen_images/seiganji6.jpeg","onsen_images/seiganji7.jpeg"]
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// const additems = async() => {
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

useEffect(() => {
  // matchingItems が更新された際にログを出力
  console.log(matchingItems);
}, [matchingItems]);

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
        <Text>マッチング中...</Text>
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

    // borderWidth:1,
    // borderColor:"red",
  },
  home: {
    backgroundColor: Color.labelColorDarkPrimary,
    // flex: 1,
    height: "100%",
    overflow: "hidden",
    width: "100%",
    // justifyContent:"center",

    // borderColor:"red",
    // borderWidth:2,
  },
  flatlist: {
    // borderColor:"red",
    // borderWidth:1,
    
  },
  flatlistContent:{
      // width: "100%",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",

    // borderColor:"blue",
    // borderWidth:1,
  },
});

export default HOME;
