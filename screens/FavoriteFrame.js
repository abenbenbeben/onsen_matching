import * as React from "react";
import { useEffect ,useState} from "react";
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
import FavoriteCard from "../components/FavoriteCard";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc,getFirestore,getDocs,getDoc,doc } from "firebase/firestore";
import { app } from "../firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CardWithMatchPercentage from "../components/CardWithMatchPercentage";

const db = getFirestore(app); 
const storage = getStorage(app);

const FavoriteFrame = () => {
  const navigation = useNavigation();
  const [favoriteData, setFavoriteData] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  // コンポーネントがマウントされた後にお気に入りデータを読み込む
  const fetchFavoriteData = async () => {
    const storedData = await AsyncStorage.getItem('favoriteArray');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
  
      // Firestoreからお気に入りデータを取得
      const fetch_favoriteData = [];
      const favoriteDataArray =[];
      for (const id of parsedData) {
        const docSnap = await getDoc(doc(db, 'onsen_data', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          data.id = docSnap.id;
          data.image = await fetchURL(data.images[0])
          fetch_favoriteData.push(data);
        }
      }
      setFavoriteData(fetch_favoriteData) 
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

  useEffect(() => {

    console.log(favoriteData)
  },[favoriteData])

  const renderCard = (item) => (
    <CardWithMatchPercentage
      onsenName={item.onsen_name}
      matchPercentage={item.score}
      viewTop={0}
      onFramePressablePress={() => 
        navigation.navigate("Onsen_detail_Frame",{
          data:item.id,
        }
      )}
      heijitunedan={item.heijitunedan}
      kyuzitunedan={item.kyuzitunedan}
      images={item.image}
      // isfavorite = {favoriteDataArray.includes(item.id)}
    />
  );

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
      <ScrollView
        style={styles.wrapper}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.frameScrollViewContent}
      >
        <View style={styles.km}>
          <Text style={styles.text}>お気に入り</Text>
        </View>
        <FlatList
          data={favoriteData}
          renderItem={({ item }) => renderCard(item)}
          keyExtractor={(item) => item.onsen_name}
          style={styles.flatlist}
          contentContainerStyle={styles.flatlistContent}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  frameScrollViewContent: {
     alignItems: "center",
  },
  flatlist:{
    width:"100%",
  },
  flatlistContent:{
    alignItems:"center",
  },
  textTypo: {
    height: 15,
    justifyContent: "center",
    textAlign: "center",
    fontSize: FontSize.size_2xs,
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
  text: {
    // top: 2,
    fontSize: FontSize.defaultBoldBody_size,
    textAlign: "left",
    // height: 29,
    // alignItems: "center",
    // display: "flex",
    color: Color.labelColorLightPrimary,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    // lineHeight: 22,
    letterSpacing: 0,
    left: 0,
    width: 92,
    position: "absolute",
  },
  km: {
    height: 32,
    width: 343,
    overflow: "hidden",
    justifyContent:"center",

  },
  view1: {
    width: 360,
    height: 629,
  },
  wrapper: {
    // position: "absolute",
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",

  },
  view: {
    backgroundColor: Color.labelColorDarkPrimary,
    height: "100%",
    // overflow: "hidden",
    width: "100%",
  },
});

export default FavoriteFrame;
