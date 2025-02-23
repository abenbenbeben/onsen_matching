import * as React from "react";
import { useEffect, useState, useRef } from "react";
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
  Animated,
  Platform,
} from "react-native";
import CardWithMatchPercentage from "../components/CardWithMatchPercentage";
import FilterOptions from "../components/FilterOption";
import HeaderScreen from "../components/HeaderScreen";
import HomeSubHeader from "../components/HomeSubHeader";
import { getCachedOrNewLocation } from "../components/getCurrentLocation ";
import { fetchMatchingData } from "../components/fetchMatchingData";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { IconButton } from "react-native-paper";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import { GlobalData } from "../GlobalData";

const db = getFirestore(app);
const storage = getStorage(app);

const HOME = ({ navigation, route }) => {
  const match_array = route.params.data.flat();
  const match_array_with_id = route.params.data_withId;
  const [matchingItems, setMatchingItems] = useState([]);
  const [favoriteDataArray, setFavoriteDataArray] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [loadingMessage, setLoadingMessage] = useState(""); //ローディング中の文字を管理
  const [filter, setFilter] = useState(1);

  const fetch_matchingdata = async () => {
    try {
      setLoadingMessage("現在地取得中");
      let point2 = null;
      point2 = await getCachedOrNewLocation(async () => {
        return await Location.getCurrentPositionAsync({});
      });
      if (!point2) {
        check_settings();
        //point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
        //point2 = { latitude:35.86542717384397, longitude: 139.51970407189944  };//さいたま市
        //point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
        //point2 = { latitude:35.87146725131986, longitude: 139.18089139695007 };//飯能
        //point2 = { latitude:36.01938773645486, longitude: 139.2840038132889 };//
      }
      point2 = { latitude: 35.443018794602715, longitude: 139.3872117068581 }; //海老名

      setLoadingMessage("マッチング中");
      const matchingDataArray = await fetchMatchingData(point2, match_array);
      setMatchingItems(matchingDataArray);

      try {
        // フラグが保存されているか確認
        const hasExecuted = await AsyncStorage.getItem(
          "hasUpdatedFavoriteData"
        );
        console.log("hasExecuted: " & hasExecuted);

        if (hasExecuted === null) {
          // 初回実行時のみ関数を呼び出す
          updateFavoriteData(matchingDataArray);

          // フラグを保存
          await AsyncStorage.setItem("hasUpdatedFavoriteData", "true");
        }
      } catch (error) {
        console.error("Error checking or setting execution flag:", error);
      }

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

  //スクロールした時のヘッダーの高さ処理
  const scrollY = useRef(new Animated.Value(0)).current;
  const previousScrollY = useRef(0); // 前のスクロール位置を保持

  // ヘッダーの高さを設定するアニメーション値
  const headerHeight = scrollY.interpolate({
    inputRange: [0, Platform.OS === "android" ? 30 : 60], // スクロールの範囲
    outputRange: [
      Platform.OS === "android" ? 60 : 115,
      Platform.OS === "android" ? 30 : 55,
    ], // 高さの範囲
    extrapolate: "clamp",
  });

  // ヘッダーのテキストの透明度を設定するアニメーション値
  const headerTextOpacity = scrollY.interpolate({
    inputRange: [0, 60], // スクロールの範囲
    outputRange: [1, 0], // 透明度の範囲
    extrapolate: "clamp",
  });

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const isScrollingDown = currentScrollY > previousScrollY.current;

    // 値が負にならないように調整
    const clampedScrollY = Math.max(0, currentScrollY);

    // 前回のスクロール位置と比較してスクロール方向を判断
    if (isScrollingDown) {
      Animated.timing(scrollY, {
        toValue: clampedScrollY,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(scrollY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    // 前回のスクロール位置を更新
    previousScrollY.current = currentScrollY;
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

  const updateFavoriteData = async (matchingDataArray) => {
    try {
      // 非同期でデータを取得
      const favoriteArrayDataString = await AsyncStorage.getItem(
        "favoriteArrayData"
      );

      // JSON.parseの前に検証
      if (!favoriteArrayDataString) {
        console.warn("favoriteArrayDataStringがnullまたは空です。");
        return;
      }

      // JSON.parseの結果を確認
      let favoriteArrayData;
      try {
        favoriteArrayData = JSON.parse(favoriteArrayDataString);
      } catch (error) {
        console.error("JSON.parseでエラー:", error);
        return;
      }

      // データ形式の確認
      if (!Array.isArray(favoriteArrayData)) {
        console.error(
          "favoriteArrayDataが配列ではありません。",
          favoriteArrayData
        );
        return;
      }

      // 後続の処理
      const updateFavoriteArrayData = favoriteArrayData.map((item) => {
        if (!item || !item.onsenName) {
          console.warn("無効なデータ:", item);
          return null;
        }

        const matchingItem = matchingDataArray.find(
          (feature) => feature.onsen_name === item.onsenName
        );

        return matchingItem || null; // nullの場合を考慮
      });

      // フィルタリングして保存
      const validFavoriteArrayData = updateFavoriteArrayData.filter(Boolean); // nullを除外
      await AsyncStorage.setItem(
        "favoriteArrayData",
        JSON.stringify(validFavoriteArrayData)
      );

      console.log("favoriteArrayData: ", validFavoriteArrayData);

      const updateFavoriteArrayBefore = validFavoriteArrayData
        .filter((item) => item) // nullやundefinedを除外
        .map((item) => item.id);

      await AsyncStorage.setItem(
        "favoriteArrayBefore",
        JSON.stringify(updateFavoriteArrayBefore)
      );
      await AsyncStorage.setItem(
        "favoriteArray",
        JSON.stringify(updateFavoriteArrayBefore)
      );

      console.log("更新されたfavoriteArrayDataを保存しました。");
    } catch (e) {
      console.error("エラーが発生しました:", e);
    }
  };

  useEffect(() => {
    fetch_matchingdata();
    //additems();
    // updateFavoriteData();
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
      images={item.image}
      isfavorite={favoriteDataArray.includes(item.id)}
      favoriteDataArray={favoriteDataArray}
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
  const matchingItemsLength = matchingItems.filter(
    (item) => item.distance <= 40 && item.score > 50
  ).length;
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
        (item) => item.score > 50 && item.score < 60 && item.distance <= 40
      )
      .sort((a, b) => b.score - a.score);
    distanceArray = [
      { data: withinFirst, number: 100, unit: "%" },
      { data: withinSecond, number: 80, unit: "%以上" },
      { data: withinThird, number: 60, unit: "%以上" },
      { data: withinFourth, number: 50, unit: "%以上" },
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
      <>
        <HeaderScreen headerText={loadingMessage} headerHeight={headerHeight} />
        <HomeSubHeader matchCount={matchingItemsLength} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text>{`${loadingMessage}...`}</Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.home}>
      <HeaderScreen
        headerText="マッチング結果"
        headerHeight={headerHeight}
        headerTextOpacity={headerTextOpacity}
      />
      <HomeSubHeader
        matchCount={matchingItemsLength}
        match_array_with_id={match_array_with_id}
        sortTextFlag={true}
        filter={filter}
        setFilter={setFilter}
      />
      {/* <View style={[{ zIndex: 10 }]}>
        <FilterOptions filter={filter} setFilter={setFilter} />
      </View> */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 0 }}
        onScroll={handleScroll}
        scrollEventThrottle={16} // スクロールのスムーズさを調整
      >
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
    height: 24,
    width: 92,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  kmLayout: {
    color: Color.labelColorLightPrimaryMuted,
    fontFamily: FontFamily.interMedium,
    fontWeight: "200",
    lineHeight: 26,
    letterSpacing: 1,
    fontSize: FontSize.caption,
  },
  kmLayoutNumber: {
    color: Color.labelColorLightPrimaryMuted,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0,
    marginHorizontal: 2,
    fontSize: FontSize.body,
  },
  home: {
    backgroundColor: "#ececec",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  flatlistContent: {
    // width: "100%",
    // justifyContent: "center",
    // alignContent: "center",
    // alignItems: "center",
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
