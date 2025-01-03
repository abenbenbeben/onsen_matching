import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Pressable,
  Button,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
  PixelRatio,
  Clipboard,
  Alert,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import {
  FontFamily,
  Color,
  FontSize,
  Border,
  GlobalStyles,
} from "../GlobalStyles";
import FavoriteButton from "../components/FavoriteButton";
import AttractiveSpace from "../components/attractive_space";
import LinkButton from "../components/LinkButton";
import DefaultButton from "../components/DefaultButton";
import OperatingHours from "../components/OperatingHours";
import FacilityCard from "../components/FacilityContainer";
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
import OnsenDetailBlock from "../components/OnsenDetailBlock";
import { useFocusEffect } from "@react-navigation/native";
import { GlobalData } from "../GlobalData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = getFirestore(app);
const storage = getStorage(app);

const Onsen_detail_Frame = ({ navigation, route }) => {
  const data_id = route.params.data;
  const match_array = route.params.match_array || [];
  const [contents_data, setcontents_data] = useState();
  const [onsen_detail_data, setonsen_detail_data] = useState();
  const [facility_card_data, setfacility_card_data] = useState();
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cardArrayWithImages, setCardArrayWithImages] = useState([]);
  const [favoriteDataArray, setFavoriteDataArray] = useState([]);
  let onsen_data = "";
  let salesFlag;

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
    try {
      const querySnapshot = await getDoc(
        doc(db, GlobalData.firebaseOnsenData, data_id)
      );
      const querySnapshot_detail = await getDocs(
        collection(db, "onsen_detail_data_v2")
      );
      const querySnapshot_matching_screen = await getDocs(
        collection(db, "matching_screen_v2")
      );
      onsen_data = querySnapshot.data();
      const imageData = await Promise.all(
        onsen_data.images.map(async (item) => await fetchURL(item))
      );
      setImageData(imageData);
      setcontents_data(onsen_data);

      function checkValue(value, valuetitle) {
        if (valuetitle == "furosyurui") {
          return value + "種類";
        }
        if (valuetitle == "ganbansyurui") {
          return value + "種類";
        }
        if (value <= 0.3) {
          return "×";
        } else if (value <= 0.6) {
          return "△";
        } else {
          return "○";
        }
      }

      const matchingFacilityCardArray = querySnapshot_detail.docs.reduce(
        (acc, doc) => {
          const data = doc.data();
          if (
            (data.data !== "furosyurui" &&
              data.data !== "ganbansyurui" &&
              onsen_data[data.data] >= 0.5) ||
            data.data === "ekitika"
          ) {
            acc.push({
              id: doc.id,
              title: data.title,
              data: data.data,
              reviewsArray: onsen_data["reviews"][data.data] || [],
              imagePath: async () => {
                for (const querySnapshot_matching_screen_doc of querySnapshot_matching_screen.docs) {
                  const querySnapshot_matching_screen_data =
                    querySnapshot_matching_screen_doc.data();
                  if (
                    querySnapshot_matching_screen_data.data &&
                    querySnapshot_matching_screen_data.data[0] ===
                      (data.data === "ekitika" ? "ekitika_zikan" : data.data)
                  ) {
                    return await fetchURL(
                      querySnapshot_matching_screen_data.afterimage
                    );
                  }
                }
              },
              moyorieki: onsen_data["ekitika"]["moyorieki"] || null,
              zikan: onsen_data["ekitika"]["zikan"] || null,
              kyori: onsen_data["ekitika"]["kyori"] || null,
              // その他のデータフィールドを追加
            });
          }
          return acc;
        },
        []
      );
      // 優先キーワードに基づいてmatchingFacilityCardArrayをソート
      const sortedMatchingFacilityCardArray = matchingFacilityCardArray.sort(
        (a, b) => {
          const aHasPriority = match_array.includes(a.data);
          const bHasPriority = match_array.includes(b.data);

          if (aHasPriority === bHasPriority) {
            return 0;
          }
          return aHasPriority ? -1 : 1;
        }
      );

      const cardArrayWithImages = await Promise.all(
        sortedMatchingFacilityCardArray.map(async (card) => {
          const imageUrl = await card.imagePath(); // 非同期で画像URLを取得
          return {
            ...card,
            imageUrl,
          };
        })
      );

      setCardArrayWithImages(cardArrayWithImages); // ステートに保存

      const matchingDataArray = querySnapshot_detail.docs.map((doc) => {
        const data = doc.data();
        const matchDataDict = {
          id: doc.id,
          title: data.title,
          data: checkValue(onsen_data[data.data], data.data),
          // その他のデータフィールドを追加
        };
        return matchDataDict;
      });
      setonsen_detail_data(matchingDataArray);
      setLoading(false); //データ読み込みが完了したらローディング状態を解除
    } catch (e) {
      console.error("Error fetching data: ", e);
    }
  };

  const openModal = (image) => {
    console.log("SelectedImage: " + image);
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const copyToClipboard = (text, CopyContents) => {
    Clipboard.setString(text);
    Alert.alert(
      "コピー完了",
      `${CopyContents}をクリップボードにコピーしました。`
    );
  };

  const handleEditPress = () => {
    // 編集ボタンが押されたときの処理
    navigation.navigate("Editdetail_Frame", {
      data: contents_data,
      data_id: data_id,
    });
  };
  const handleReportPress = (category) => {
    // 編集ボタンが押されたときの処理
    navigation.navigate("Reportdetail_Frame", {
      data: contents_data,
      data_id: data_id,
      category: category === "営業時間" ? category : null,
    });
    console.log(`報告ボタンが押されました。${data_id}`);
  };

  const additems = async () => {
    try {
      const docRef = await addDoc(collection(db, "onsen_detail_data_v2"), {
        title: "最寄駅",
        data: "moyorieki",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
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

  useEffect(() => {
    const initializeData = async () => {
      await fetchFavoriteData();
      await fetch_matchingdata();
    };

    initializeData();
  }, []);

  useEffect(() => {
    console.log(onsen_detail_data);
  }, [onsen_detail_data]);
  useEffect(() => {
    console.log(contents_data);
  }, [contents_data]);

  //Backボタンで戻ってきた時に動く。
  useFocusEffect(
    React.useCallback(() => {
      // ここにフォーカスが戻ってきた時に実行したい処理を記述
      // 例: 関数の呼び出し
      fetch_matchingdata();
      fetchFavoriteData();
    }, [])
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
      <ScrollView style={styles.parent}>
        <View>
          <View style={[styles.headerContainer]}>
            <View style={[styles.view1, GlobalStyles.positionLeft]}>
              <Text style={styles.textTypo1}>{contents_data.onsen_name}</Text>
            </View>
            <View style={[styles.favoriteButtonContainer]}>
              <FavoriteButton
                id={data_id}
                favoriteDataArray={favoriteDataArray}
              />
            </View>
          </View>
          <FlatList
            data={imageData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openModal(item)}>
                <Image
                  style={styles.childLayout}
                  contentFit="cover"
                  source={item}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true} // 横方向にスクロール
            numColumns={1} // 列数を1に設定
            showsHorizontalScrollIndicator={false}
            style={styles.flatlist}
          />
          {/* モーダル */}
          <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Image source={selectedImage} style={styles.fullImage} />
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={styles.inyou}>
            <Text style={styles.inyou_text}>
              画像は{contents_data.onsen_name}公式サイトから引用
            </Text>
          </View>
          <View style={styles.view4}>
            <Text style={styles.text1}>
              平日：{contents_data.heijitunedan}円　祝日：
              {contents_data.kyuzitunedan}円
            </Text>
          </View>
          <OperatingHours
            contents_data={contents_data}
            onPress={handleReportPress}
          />
          <View style={styles.view5}>
            <Text
              // onPress={() => copyToClipboard(contents_data.place, "住所")}
              style={styles.text3}
            >
              住所：{contents_data.place}
            </Text>
          </View>
          <View style={styles.LinkButtonContainer}>
            <LinkButton
              ButtonText={"GoogleMap"}
              ButtonFlag={"GoogleMap"}
              url={`https://www.google.com/maps?q=${contents_data.onsen_name}`}
            />
            <LinkButton
              locationName={contents_data.onsen_name}
              ButtonText={"公式サイト"}
              ButtonFlag={"OfficialSite"}
              url={contents_data.url}
            />
          </View>

          <View style={styles.view6}>
            <AttractiveSpace miryokuText={contents_data.feature} />
          </View>
          <FlatList
            data={cardArrayWithImages}
            renderItem={({ item }) => (
              <FacilityCard
                title={item.title}
                reviews={item.reviewsArray}
                imagePath={item.imageUrl}
                data={item.data}
                moyorieki={item.moyorieki}
                zikan={item.zikan}
                kyori={item.kyori}
                isHighlight={match_array.includes(item.data)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={1} // 3列で表示
            // style={styles.flatlist}
            // contentContainerStyle={styles.flatlistContent}
            scrollEnabled={false}
          />

          <View style={styles.view7}>
            <FlatList
              data={onsen_detail_data}
              renderItem={({ item }) => (
                <OnsenDetailBlock title={item.title} data={item.data} />
              )}
              keyExtractor={(item) => item.id}
              numColumns={3} // 3列で表示
              // style={styles.flatlist}
              contentContainerStyle={styles.flatlistContent}
              scrollEnabled={false}
            />
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <DefaultButton onPress={handleReportPress} label="情報の修正を提案" />
        </View>

        {contents_data.url && (
          <View style={{ marginBottom: 50, marginHorizontal: 20 }}>
            <Text style={styles.syutten_text}>画像出典</Text>
            <Text style={styles.syutten_text}>{contents_data.onsen_name}</Text>
            <Text style={styles.syutten_text}>{contents_data.url}</Text>
          </View>
        )}
      </ScrollView>
      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    padding: 0,
    borderRadius: 5,
    left: 7,
    marginVertical: 4,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  view1: {
    width: "70%",
    // height: 32,
    left: 8,
    marginVertical: 8,
  },
  textTypo1: {
    fontFamily: FontFamily.interMedium,
    fontSize: 20 / PixelRatio.getFontScale(),
    fontWeight: "600",
    color: Color.labelColorLightPrimary,
    flexWrap: "wrap",
  },
  // お気に入りボタンのスタイル
  favoriteButtonContainer: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  // お気に入りボタンのスタイル終了
  // モーダル画像のスタイル
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  closeButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullImage: {
    width: "100%",
    height: "90%",
    resizeMode: "contain",
  },
  //引用注意書きのスタイル
  inyou: {
    right: 3,
  },
  inyou_text: {
    textAlign: "right",
    fontSize: 10 / PixelRatio.getFontScale(),
    color: "#696969",
  },
  //引用注意書きのスタイル終了

  childLayout: {
    width: 144,
    height: 144,
    top: 0,
    // position: "absolute",
    // left: 288,
  },

  item: {
    left: 144,
  },
  inner: {
    left: 0,
  },
  rectangleIcon: {
    left: 432,
  },
  child1: {
    left: 576,
  },
  view3: {
    width: 749,
    left: 0,
    top: 0,
  },
  view2: {
    height: 144,
    // position: "absolute",
    // top: 41,
    width: 342,
    left: 7,
    marginVertical: 3,
  },
  text1: {
    fontSize: 17 / PixelRatio.getFontScale(),
    height: 24,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    // fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
    left: 0,
    top: 0,
  },
  view4: {
    height: 24,
    left: 7,
    overflow: "hidden",
    width: 345,
    height: 24,
    marginVertical: 3,
  },
  frameIcon: {
    left: -12,
    top: -16,
    // maxHeight: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  text2: {
    left: 33,
    width: "85%",
    height: "100%",
    fontSize: 20 / PixelRatio.getFontScale(),
    top: 0,
    textAlign: "left",
    textAlignVertical: "center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    color: Color.labelColorLightPrimary,
    textDecorationLine: "underline",
  },
  text3: {
    left: 0,
    width: "100%",
    height: "100%",
    fontSize: 17 / PixelRatio.getFontScale(),
    top: 0,
    // position: "absolute",

    // display: "flex",
    textAlign: "left",
    textAlignVertical: "center",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    // lineHeight: 22,
    // letterSpacing: 0,
    color: Color.labelColorLightPrimary,
  },
  view5: {
    width: "98%",
    height: 30,
    left: 7,
    overflow: "hidden",
    justifyContent: "center",
    marginVertical: 3,
  },
  LinkButtonContainer: {
    width: "100%",
    flexDirection: "row",
    // overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 3,
  },
  view6: {
    marginVertical: 3,
    // height: 104,
    width: "98%",
    left: 7,
    overflow: "hidden",
    // justifyContent:"center",
    alignContent: "center",
    marginVertical: 5,
  },
  view7: {
    // height: 700,
    width: "97%",
    left: 7,
    // overflow: "hidden",
    // alignItems:"center",
    marginVertical: 20,

    // borderWidth:1,
    // borderColor:"red",
  },
  parent: {
    marginBottom: 10,
    backgroundColor: Color.colorWhitesmoke_100,
    width: "100%",
    height: "99%",
  },
  view: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: Color.labelColorDarkPrimary,

    // borderColor:"red",
    // borderWidth:2,
  },
  flatlistContent: {
    alignItems: "center",
  },

  // //編集するボタンのスタイル
  // button: {
  //   width: 200,
  //   backgroundColor: "#007BFF", // 青色の背景
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  //   marginBottom: 50,
  // },
  // buttonText: {
  //   color: "white", // 白色のテキスト
  //   fontSize: 16 / PixelRatio.getFontScale(),
  //   fontWeight: "bold",
  // },
  //編集するボタンのスタイル終了

  //引用元のスタイル
  urlText: {
    color: "#007BFF", // 白色のテキスト
    fontSize: 14 / PixelRatio.getFontScale(),
    fontWeight: "300",
  },

  //引用元のスタイル終了

  //出典のスタイル
  syutten_text: {
    color: "#696969",
  },
  //出典のスタイル終了
});

export default Onsen_detail_Frame;
