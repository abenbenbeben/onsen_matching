import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  StatusBar,
  Pressable,
  FlatList,
  ActivityIndicator,
  PixelRatio,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { app } from "../firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CardWithMatchPercentage from "../components/CardWithMatchPercentage";
import HeaderScreen from "../components/HeaderScreen";
import { GlobalData } from "../GlobalData";
import { GlobalStyles } from "../GlobalStyles";
import { IconButton } from "react-native-paper";

const db = getFirestore(app);
const storage = getStorage(app);

const FavoriteFrame = () => {
  const navigation = useNavigation();
  const [favoriteData, setFavoriteData] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [favoriteDataArray, setFavoriteDataArray] = useState([]);

  // コンポーネントがマウントされた後にお気に入りデータを読み込む
  const fetchFavoriteData = async () => {
    const currentFavoritesString = await AsyncStorage.getItem("favoriteArray");
    setFavoriteDataArray(currentFavoritesString);
    const beforeFavoritesString = await AsyncStorage.getItem(
      "favoriteArrayBefore"
    );

    if (currentFavoritesString) {
      const currentFavorites = JSON.parse(currentFavoritesString);
      const beforeFavorites = beforeFavoritesString
        ? JSON.parse(beforeFavoritesString)
        : [];

      // 新しく追加されたお気に入りと削除されたお気に入りを識別
      const newFavoriteIds = currentFavorites.filter(
        (id) => !beforeFavorites.includes(id)
      );
      const removedFavoriteIds = beforeFavorites.filter(
        (id) => !currentFavorites.includes(id)
      );

      // 既存のお気に入りデータを取得
      let existingFavoritesData = beforeFavoritesString
        ? JSON.parse(await AsyncStorage.getItem("favoriteArrayData"))
        : [];

      // 削除されたお気に入りを既存のデータから削除
      existingFavoritesData = existingFavoritesData.filter(
        (item) => !removedFavoriteIds.includes(item.id)
      );

      // 新しいお気に入りデータをFirestoreから取得
      const newFavoritesData = [];
      if (newFavoriteIds.length > 0) {
        const matchingDataArray_cache = await AsyncStorage.getItem(
          "matchingResultDataArray"
        );
        const matchingResultDataArray = JSON.parse(matchingDataArray_cache);

        for (const id of newFavoriteIds) {
          const docSnap = matchingResultDataArray.find(
            (item) => item.id === id
          );

          if (docSnap) {
            const data = docSnap;
            // data.id = docSnap.id;
            data.image = await fetchURL(data.images[0]);
            newFavoritesData.push(data);
          }
        }
      }

      // 既存のデータに新しいデータを追加
      const updatedFavoritesData = [
        ...existingFavoritesData,
        ...newFavoritesData,
      ];

      // 更新されたお気に入りデータをセット
      setFavoriteData(updatedFavoritesData);

      // データをキャッシュに保存
      await AsyncStorage.setItem(
        "favoriteArrayData",
        JSON.stringify(updatedFavoritesData)
      );
      await AsyncStorage.setItem("favoriteArrayBefore", currentFavoritesString);
    }
    setLoading(false); // データ読み込みが完了したらローディング状態を解除
  };

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

  const handlePress = () => {
    Alert.alert(
      "確認", // アラートのタイトル
      "マッチングをやり直しますか？", // メッセージ
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "やり直す",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Matching_Frame" }],
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  //お気に入り配列を取得
  useEffect(() => {
    fetchFavoriteData();
  }, []);
  //Backボタンで戻ってきた時に動く。
  useFocusEffect(
    React.useCallback(() => {
      // ここにフォーカスが戻ってきた時に実行したい処理を記述
      // 例: 関数の呼び出し
      fetchFavoriteData();
      console.log(favoriteData);
    }, [])
  );

  const renderCard = (item) => (
    <CardWithMatchPercentage
      onsenName={item.onsen_name}
      matchPercentage={item.score}
      viewTop={0}
      onFramePressablePress={() =>
        navigation.navigate("Onsen_detail_Frame", {
          data: item.id,
        })
      }
      heijitunedan={item.heijitunedan}
      kyuzitunedan={item.kyuzitunedan}
      images={item.image}
      data={item}
      isfavorite={true}
      favoriteDataArray={favoriteDataArray}
    />
  );

  if (loading) {
    // ローディング中の表示
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <HeaderScreen headerText="気になる！リスト" />
      {favoriteData.length > 0 && (
        <ScrollView
          style={styles.wrapper}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.frameScrollViewContent}
        >
          <FlatList
            data={favoriteData}
            renderItem={({ item }) => renderCard(item)}
            keyExtractor={(item) => item.onsen_name}
            style={styles.flatlist}
            contentContainerStyle={styles.flatlistContent}
            scrollEnabled={false}
          />
          {/* 画面下部に再マッチングボタンを追加 */}

          <TouchableOpacity
            style={styles.PanelContainer}
            onPress={() => handlePress()}
          >
            <Image
              source={require("../assets/FavoriteScreenPanel.png")}
              style={{ width: 342, height: 121, borderRadius: 20 }}
            />
          </TouchableOpacity>
        </ScrollView>
      )}
      {favoriteData.length === 0 && (
        <View style={[{ flex: 1 }, GlobalStyles.positionCenter]}>
          <IconButton
            icon={"star-plus-outline"}
            iconColor={Color.colorFavoriteButton}
            selected="false"
            size={100}
            style={[
              {
                backgroundColor: Color.labelColorDarkPrimary,
                width: 150,
                height: 150,
                borderRadius: 100,
              },
            ]}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: FontSize.bodySub,
              marginVertical: 20,
              textAlign: "center",
              lineHeight: 30,
            }}
          >
            {`あとで詳しく見たい施設は\n気になる！リストに登録しましょう。`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  frameScrollViewContent: {
    // alignItems: "center",
  },
  flatlist: {
    marginHorizontal: 8,
  },
  flatlistContent: {
    // alignItems: "center",
  },
  textTypo: {
    height: 15,
    justifyContent: "center",
    textAlign: "center",
    fontSize: 11 / PixelRatio.getFontScale(),
    alignItems: "center",
    display: "flex",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
  },
  groupLayout: {
    width: 59,
    position: "absolute",
  },
  favoriteText: {
    fontSize: 20 / PixelRatio.getFontScale(),
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    letterSpacing: 0,
  },
  favoriteTextContainer: {
    marginTop: 6,
    marginBottom: 4,
    marginLeft: 7,
    justifyContent: "center",
  },
  view1: {
    width: 360,
    height: 629,
  },
  wrapper: {
    width: "100%",
  },
  view: {
    backgroundColor: Color.colorWhitesmoke_200,
    height: "100%",
    // overflow: "hidden",
    width: "100%",
  },

  // 再マッチングしよう！のスタイル
  PanelContainer: {
    marginVertical: 50,
    width: "100%",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default FavoriteFrame;
