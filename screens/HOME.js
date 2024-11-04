import * as React from "react";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  query,
} from "firebase/firestore";
import { app } from "../firebaseconfig";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  PixelRatio,
} from "react-native";
import CardWithMatchPercentage from "../components/CardWithMatchPercentage";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { IconButton } from "react-native-paper";
import FilterOptions from "../components/FilterOption";
import { GlobalData } from "../GlobalData";

const db = getFirestore(app);
const storage = getStorage(app);

const HOME = ({ navigation, route }) => {
  const match_array = route.params.data.flat();
  console.log(match_array);
  const [matchingItems, setMatchingItems] = useState([]);
  const [favoriteDataArray, setFavoriteDataArray] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [loadingMessage, setLoadingMessage] = useState(""); //ローディング中の文字を管理
  const [filter, setFilter] = useState(1);

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

  const fetch_matchingdata = async () => {
    async function getCurrentLocation() {
      const timeout = 5000;

      try {
        // 最初に現在の位置情報を取得を試みる
        const currentPosition = await Promise.race([
          Location.getCurrentPositionAsync(),
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    `Error getting GPS location after ${timeout / 1000} s`
                  )
                ),
              timeout
            )
          ),
        ]);
        return currentPosition;
      } catch (error) {
        // 現在の位置情報の取得に失敗した場合、最後に知られている位置情報を試みる
        try {
          const lastKnownPosition = await Location.getLastKnownPositionAsync();
          if (lastKnownPosition) {
            return lastKnownPosition;
          } else {
            throw new Error("No known last position");
          }
        } catch (lastError) {
          // 最後に知られている位置情報の取得も失敗した場合、エラーを返す
          throw new Error(`Unable to get location: ${lastError.message}`);
        }
      }
    }
    // データが更新されたかどうかを確認する関数
    const isDataOutdated = async (
      lastUpdatedTimestamp,
      matchingDataTimestamp
    ) => {
      // ここでFirebaseのデータのタイムスタンプと比較して更新されたかを確認
      // 更新された場合は true を返す
      // 更新されていない場合は false を返す
      console.log(
        "matchingResultDataArrayLastUpdatedTimestamp",
        matchingDataTimestamp,
        lastUpdatedTimestamp
      );
      matchingDataTimestamp = matchingDataTimestamp || 1;
      if (!lastUpdatedTimestamp) {
        // タイムスタンプが存在しない場合、データが更新されたとみなす（初回起動時）
        await AsyncStorage.setItem(
          "matchingResultDataArrayLastUpdatedTimestamp",
          JSON.stringify(matchingDataTimestamp)
        );
        return true;
      }
      const dataUpdated = matchingDataTimestamp > lastUpdatedTimestamp;
      if (dataUpdated) {
        await AsyncStorage.setItem(
          "matchingResultDataArrayLastUpdatedTimestamp",
          JSON.stringify(matchingDataTimestamp)
        );
      }
      console.log(dataUpdated);
      return dataUpdated;
    };

    try {
      setLoadingMessage("現在地取得中...");
      let point2 = null;
      const cachedLocation = await AsyncStorage.getItem("currentLocation");
      const cachedLocationTimestamp = await AsyncStorage.getItem(
        "currentLocationTimestamp"
      );
      console.log(cachedLocation);
      console.log(cachedLocationTimestamp);
      if (cachedLocation && cachedLocationTimestamp) {
        // キャッシュから位置情報とタイムスタンプを読み込む
        point2 = JSON.parse(cachedLocation);
        const cachedTimestamp = parseInt(cachedLocationTimestamp, 10);
        const currentTimestamp = Date.now();

        // 30分経過していない場合はキャッシュを使用
        if (currentTimestamp - cachedTimestamp <= 30 * 60 * 1000) {
          console.log("Using cached location.");
        } else {
          // キャッシュのタイムスタンプから30分以上経過した場合は新しい位置情報を取得
          console.log("Fetching new location.");
          const { status } = await Location.requestForegroundPermissionsAsync();

          if (status === "granted") {
            let location = await getCurrentLocation();
            const { latitude, longitude } = location.coords;
            point2 = { latitude, longitude };

            // 新しい位置情報とタイムスタンプをキャッシュに保存
            await AsyncStorage.setItem(
              "currentLocation",
              JSON.stringify(point2)
            );
            await AsyncStorage.setItem(
              "currentLocationTimestamp",
              currentTimestamp.toString()
            );
          } else {
            console.error("Location permission denied.");
          }
        }
      } else {
        try {
          console.log("No cached location. Fetching new location.");
          // キャッシュが存在しない場合は新しい位置情報を取得
          const { status } = await Location.requestForegroundPermissionsAsync();
          console.log("status:", status);

          if (status === "granted") {
            let location = await getCurrentLocation();
            console.log("location:", location);
            const { latitude, longitude } = location.coords;
            point2 = { latitude, longitude };
            console.log(point2);

            // 新しい位置情報とタイムスタンプをキャッシュに保存
            const currentTimestamp = Date.now();
            await AsyncStorage.setItem(
              "currentLocation",
              JSON.stringify(point2)
            );
            await AsyncStorage.setItem(
              "currentLocationTimestamp",
              currentTimestamp.toString()
            );
          } else {
            console.error("Location permission denied.");
            check_settings();
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (!point2) {
        check_settings();
        //point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
      }
      //point2 = { latitude:35.86542717384397, longitude: 139.51970407189944  };//さいたま市
      //point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
      //point2 = { latitude:35.87146725131986, longitude: 139.18089139695007 };//飯能
      //point2 = { latitude:36.01938773645486, longitude: 139.2840038132889 };//
      point2 = { latitude: 35.443018794602715, longitude: 139.3872117068581 }; //海老名
      setLoadingMessage("マッチング中...");
      let furosyurui_max = "";
      let nedan_min = "";
      let ganbansyurui_max = "";
      let matchingDataResultTimestamp = null;
      const querySnapshot_global = await getDocs(
        collection(db, "global_match_data")
      );
      querySnapshot_global.forEach((doc) => {
        furosyurui_max = doc.data().furosyurui_max;
        nedan_min = doc.data().nedan_min;
        ganbansyurui_max = doc.data().ganbansyurui_max;
        matchingDataResultTimestamp = doc.data().matchingDataResultTimestamp;
      });
      let querySnapshot = null;
      let matchingDataArray = null;
      let matchingDataArray_origin = null;
      let matchingDataArray_cache = await AsyncStorage.getItem(
        "matchingResultDataArray"
      );
      matchingDataArray_origin = JSON.parse(matchingDataArray_cache);

      let lastUpdatedTimestamp = await AsyncStorage.getItem(
        "matchingResultDataArrayLastUpdatedTimestamp"
      );
      const shouldFetchFromFirebase =
        (await isDataOutdated(
          lastUpdatedTimestamp,
          matchingDataResultTimestamp
        )) || !lastUpdatedTimestamp;
      if (!matchingDataArray_origin || shouldFetchFromFirebase) {
        console.log("HOME画面：firebaseを読み込んだ");
        querySnapshot = await getDocs(
          collection(db, GlobalData.firebaseOnsenData)
        );
        matchingDataArray_origin = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            let data = doc.data();
            data.id = doc.id;
            data.onsenName = data.onsen_name;
            data.heijitunedan = data.heijitunedan;
            data.kyujitunedan = data.kyuzitunedan;
            return data;
          })
        );
        await AsyncStorage.setItem(
          "matchingResultDataArray",
          JSON.stringify(matchingDataArray_origin)
        );
      }

      // processField 関数を定義して、必要なデータ処理を行う
      function processField(field, fieldData) {
        if (field === "furosyurui") {
          return parseFloat((fieldData / furosyurui_max).toFixed(2)); // furosyuruiの場合に処理を実行
        } else if (field === "heikinnedan") {
          return parseFloat((nedan_min / fieldData).toFixed(2)); // heikinnedanの場合に処理を実行
        } else if (field === "ganbansyurui") {
          return parseFloat((fieldData / ganbansyurui_max).toFixed(2)); // ganbansyuruiの場合に処理を実行
        } else if (field === "komiguai") {
          return 1 - fieldData; // komiguaiの場合に処理を実行
        } else {
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

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      }

      matchingDataArray = await Promise.all(
        matchingDataArray_origin.map(async (item) => {
          if (
            item.zikan_heijitu_start < 800 ||
            item.zikan_kyujitu_start < 800 ||
            item.zikan_heijitu_end > 3000 ||
            item.zikan_kyujitu_end > 3000
          ) {
            item.asaeigyo = 1;
          }
          item.scoreData = match_array.map((field) => {
            // データを加工してから scoreData に追加
            return processField(field, item[field]);
          });
          //matchDataDict.scoreData配列の平均を計算
          const average =
            (item.scoreData.reduce((acc, value) => acc + value, 0) /
              item.scoreData.length) *
            100;
          // 平均を matchDataDict.score に代入
          item.score = Math.floor(average);
          const point1 = { latitude: item.latitude, longitude: item.longitude };
          const distanceInMeters = haversineDistance(
            point1.latitude,
            point1.longitude,
            point2.latitude,
            point2.longitude
          );
          item.distance = parseFloat(distanceInMeters.toFixed(1));
          if (item.distance <= 40 && item.score > 50) {
            item.images = await fetchURL(item.images[0]);
          }
          return item;
        })
      );

      setMatchingItems(matchingDataArray);
      setLoading(false); // データ読み込みが完了したらローディング状態を解除
    } catch (e) {
      console.error("Error fetching data: ", e);
    }
  };

  // コンポーネントがマウントされた後にお気に入りデータを読み込む
  const fetchFavoriteData = async () => {
    const storedData = await AsyncStorage.getItem("favoriteArray");
    const parsedData = storedData ? JSON.parse(storedData) : [];
    if (parsedData.length >= 1) {
      if (JSON.stringify(parsedData) !== JSON.stringify(favoriteDataArray)) {
        setFavoriteDataArray(parsedData);
      }
    } else {
      setFavoriteDataArray([]);
    }
  };

  //設定を開く関数
  const check_settings = () => {
    Alert.alert(
      "位置情報の許可が必要",
      "この機能を使用するには、位置情報の許可が必要です。設定を開いて許可してください。",
      [
        { text: "設定を開く", onPress: () => Linking.openSettings() },
        { text: "キャンセル", style: "cancel" },
      ],
      { cancelable: false }
    );
  };

  const additems = async () => {
    try {
      const docRef = await addDoc(
        collection(db, GlobalData.firebaseOnsenData),
        {
          onsen_name: "サウナリウム高円寺",
          feature: `屋上に整いスペースがあり、気持ちよく整える。外気浴にはポンチョに着替える。`,
          zikan_heijitu_start: 800,
          zikan_heijitu_end: 2400,
          zikan_kyujitu_start: 800,
          zikan_kyujitu_end: 2400,
          sauna: 1,
          rouryu: 1,
          siosauna: 0,
          doro: 0,
          mizuburo: 1,
          tennen: 0,
          sensitu: "なし",
          sensituyosa: 0,
          tansan: 0,
          furosyurui: 5,
          manga: 1,
          wifi: 1,
          tyusyazyo: 0,
          heijitunedan: 2180,
          kyuzitunedan: 2480,
          heikinnedan: 2330,
          ganban: 1,
          ganbansyurui: 6,
          senzai: 0,
          facewash: 1,
          komiguai: 0.7,
          wadai: 0,
          kodomo: 0,
          ekitika: 1,
          url: "https://www.nagomino-yu.com/",
          latitude: 35.7050720020267,
          longitude: 139.61832245755133,
          place: "東京都杉並区上荻１丁目１０−１０",
          images: [
            "onsen_images/nagominoyu1.jpeg",
            "onsen_images/nagominoyu2.jpeg",
            "onsen_images/nagominoyu3.jpeg",
            "onsen_images/nagominoyu4.jpeg",
            "onsen_images/nagominoyu5.jpeg",
            "onsen_images/nagominoyu6.jpeg",
            "onsen_images/nagominoyu7.jpeg",
          ],
        }
      );
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

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
    //additems();
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
        navigation.navigate("Onsen_detail_Frame", {
          data: item.id,
          match_array: match_array,
        })
      }
      heijitunedan={item.heijitunedan}
      kyuzitunedan={item.kyujitunedan}
      images={item.images}
      isfavorite={favoriteDataArray.includes(item.id)}
      data={item}
      match_array={match_array}
      distance={item.distance}
      filter={filter}
    />
  );

  let withinFirst = [];
  let withinSecond = [];
  let withinThird = [];
  let withinFourth = [];
  let withinFifth = [];
  let withinSixth = [];
  let withinSeventh = [];
  let withinEighth = [];
  let distanceArray = [];
  if (filter === 1) {
    withinFirst = matchingItems
      .filter((item) => item.distance <= 5 && item.score > 50)
      .sort((a, b) => b.score - a.score);
    withinSecond = matchingItems
      .filter(
        (item) => item.distance > 5 && item.distance <= 10 && item.score > 50
      )
      .sort((a, b) => b.score - a.score);
    withinThird = matchingItems
      .filter(
        (item) => item.distance > 10 && item.distance <= 15 && item.score > 50
      )
      .sort((a, b) => b.score - a.score);
    withinFourth = matchingItems
      .filter(
        (item) => item.distance > 15 && item.distance <= 20 && item.score > 50
      )
      .sort((a, b) => b.score - a.score);
    withinFifth = matchingItems
      .filter(
        (item) => item.distance > 20 && item.distance <= 25 && item.score > 50
      )
      .sort((a, b) => b.score - a.score);
    withinSixth = matchingItems
      .filter(
        (item) => item.distance > 25 && item.distance <= 30 && item.score > 50
      )
      .sort((a, b) => b.score - a.score);
    withinSeventh = matchingItems
      .filter(
        (item) => item.distance > 30 && item.distance <= 35 && item.score > 50
      )
      .sort((a, b) => b.score - a.score);
    withinEighth = matchingItems
      .filter(
        (item) => item.distance > 35 && item.distance <= 40 && item.score > 50
      )
      .sort((a, b) => b.score - a.score);
    distanceArray = [
      { data: withinFirst, number: 5, unit: "km圏内" },
      { data: withinSecond, number: 10, unit: "km圏内" },
      { data: withinThird, number: 15, unit: "km圏内" },
      { data: withinFourth, number: 20, unit: "km圏内" },
      { data: withinFifth, number: 25, unit: "km圏内" },
      { data: withinSixth, number: 30, unit: "km圏内" },
      { data: withinSeventh, number: 35, unit: "km圏内" },
      { data: withinEighth, number: 40, unit: "km圏内" },
    ].filter((item) => item.data && item.data.length > 0);
  } else if (filter === 2) {
    withinFirst = matchingItems
      .filter((item) => item.score >= 100 && item.distance <= 40)
      .sort((a, b) => b.score - a.score);
    withinSecond = matchingItems
      .filter(
        (item) => item.score >= 80 && item.score < 100 && item.distance <= 40
      )
      .sort((a, b) => b.score - a.score);
    withinThird = matchingItems
      .filter(
        (item) => item.score >= 60 && item.score < 80 && item.distance <= 40
      )
      .sort((a, b) => b.score - a.score);
    withinFourth = matchingItems
      .filter(
        (item) => item.score >= 40 && item.score < 60 && item.distance <= 40
      )
      .sort((a, b) => b.score - a.score);
    distanceArray = [
      { data: withinFirst, number: 100, unit: "%" },
      { data: withinSecond, number: 80, unit: "%以上" },
      { data: withinThird, number: 60, unit: "%以上" },
      { data: withinFourth, number: 40, unit: "%以上" },
    ].filter((item) => item.data && item.data.length > 0);
  } else if (filter === 3) {
    withinFirst = matchingItems
      .filter((item) => item.distance <= 5 && item.score > 50)
      .sort((a, b) => a.distance - b.distance);
    withinSecond = matchingItems
      .filter(
        (item) => item.distance > 5 && item.distance <= 10 && item.score > 50
      )
      .sort((a, b) => a.distance - b.distance);
    withinThird = matchingItems
      .filter(
        (item) => item.distance > 10 && item.distance <= 15 && item.score > 50
      )
      .sort((a, b) => a.distance - b.distance);
    withinFourth = matchingItems
      .filter(
        (item) => item.distance > 15 && item.distance <= 20 && item.score > 50
      )
      .sort((a, b) => a.distance - b.distance);
    withinFifth = matchingItems
      .filter(
        (item) => item.distance > 20 && item.distance <= 25 && item.score > 50
      )
      .sort((a, b) => a.distance - b.distance);
    withinSixth = matchingItems
      .filter(
        (item) => item.distance > 25 && item.distance <= 30 && item.score > 50
      )
      .sort((a, b) => a.distance - b.distance);
    withinSeventh = matchingItems
      .filter(
        (item) => item.distance > 30 && item.distance <= 35 && item.score > 50
      )
      .sort((a, b) => a.distance - b.distance);
    withinEighth = matchingItems
      .filter(
        (item) => item.distance > 35 && item.distance <= 40 && item.score > 50
      )
      .sort((a, b) => a.distance - b.distance);
    distanceArray = [
      { data: withinFirst, number: 5, unit: "km圏内" },
      { data: withinSecond, number: 10, unit: "km圏内" },
      { data: withinThird, number: 15, unit: "km圏内" },
      { data: withinFourth, number: 20, unit: "km圏内" },
      { data: withinFifth, number: 25, unit: "km圏内" },
      { data: withinSixth, number: 30, unit: "km圏内" },
      { data: withinSeventh, number: 35, unit: "km圏内" },
      { data: withinEighth, number: 40, unit: "km圏内" },
    ].filter((item) => item.data && item.data.length > 0);
  }

  if (loading) {
    // ローディング中の表示
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>{loadingMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.home}>
      <View style={[{ zIndex: 10 }]}>
        <FilterOptions filter={filter} setFilter={setFilter} />
      </View>
      <ScrollView>
        {distanceArray.map(({ data, number, unit }) =>
          data.length > 0 ? (
            <View key={number} style={{ marginVertical: 10 }}>
              <View
                style={[{ flexDirection: "row" }, styles.kmLayoutContainer]}
              >
                <Text style={styles.kmLayoutNumber}>{number}</Text>
                <Text style={styles.kmLayout}>{unit}</Text>
              </View>
              <FlatList
                data={data}
                renderItem={({ item }) => renderCard(item)}
                keyExtractor={(item) => item.onsenName}
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                scrollEnabled={false}
              />
            </View>
          ) : null
        )}

        {withinFirst.length === 0 &&
          withinSecond.length === 0 &&
          withinThird.length === 0 &&
          withinFourth.length === 0 &&
          withinFifth.length === 0 &&
          withinSixth.length === 0 &&
          withinSeventh.length === 0 &&
          withinEighth.length === 0 && (
            <View style={styles.container}>
              <Text style={styles.title}>{`マッチ度の高いスーパー銭湯は
      見つかりませんでした。`}</Text>
              <Text style={styles.content}>
                {`以下Googleフォームから
      追加してほしい地域をおしえてください。
      優先して追加します。`}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://docs.google.com/forms/d/e/1FAIpQLSfXT5iEFCHz7HE1y__QKaZorrwj5CdOMt26gzHPND0sHcfKjw/viewform?usp=sf_link"
                  )
                }
              >
                <Text style={styles.link}>Googleフォームを開く</Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  kmLayoutContainer: {
    height: 32,
    width: 92,
    left: 8,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  kmLayout: {
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "200",
    lineHeight: 26,
    letterSpacing: 1,
    fontSize: FontSize.bodySub,
  },
  kmLayoutNumber: {
    // height: 32,
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 32,
    letterSpacing: 0,
    marginHorizontal: 2,
    fontSize: FontSize.subTitle,
  },
  home: {
    backgroundColor: "#ececec",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  flatlistContent: {
    // width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",

    // borderColor:"blue",
    // borderWidth:1,
  },

  //アイテムなしの時のスタイル
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20 / PixelRatio.getFontScale(),
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    fontSize: 16 / PixelRatio.getFontScale(),
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    fontSize: 16 / PixelRatio.getFontScale(),
    color: "blue",
    marginTop: 10,
  },
});

export default HOME;
