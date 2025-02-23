import * as React from "react";
import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
  Modal,
  ScrollView,
  Platform,
  Alert,
  Linking,
  AppState,
  PixelRatio,
  ImageBackground,
} from "react-native";
import Video from "react-native-video";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Color, GlobalStyles } from "../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  query,
  updateDoc,
} from "firebase/firestore";
import { app } from "../firebaseconfig";
import Constants from "expo-constants";
import { DataContext } from "../DataContext";

const db = getFirestore(app);

const FirstFrame = () => {
  const navigation = useNavigation();
  const [showTermsModal, setShowTermsModal] = useState(false); // モーダルを表示するための状態
  const [hasAgreed, setHasAgreed] = useState(false);
  // let kiyaku_sentence = "";//利用規約文章
  const [sentence, set_sentence] = useState(""); //利用規約文章
  const [appState, setAppState] = useState(AppState.currentState);
  const { globalSharedData, setGlobalSharedData } = useContext(DataContext);

  const handleAgreeTerms = async () => {
    setHasAgreed(true);
    setShowTermsModal(false);

    // 同意ボタンが押されたら同意フラグを保存
    await AsyncStorage.setItem("hasAgreedToTerms", "true");
  };

  const resetAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage has been cleared.");
    } catch (error) {
      console.error("Error clearing AsyncStorage: ", error);
    }
  };

  const checkVersionAndUpdateIfNeeded = async () => {
    const currentVersion = Constants.expoConfig?.version;
    const latestVersion =
      Platform.OS === "android"
        ? sentence.android_version
        : sentence.ios_version;
    const storeUrl =
      Platform.OS === "android"
        ? "https://play.google.com/store/apps/details?id=com.abebebe.onsen_maching"
        : "https://apps.apple.com/jp/app/%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E9%8A%AD%E6%B9%AF%E3%83%9E%E3%83%83%E3%83%81%E3%83%B3%E3%82%B0/id6471331298";

    console.log(currentVersion, latestVersion);
    if (currentVersion && latestVersion && currentVersion !== latestVersion) {
      Alert.alert(
        "新しいバージョンが利用可能です",
        "最新の機能を利用するには、ストアからアップデートしてください。",
        [{ text: "ストアへ遷移", onPress: () => Linking.openURL(storeUrl) }],
        { cancelable: false }
      );
    }
  };

  const fetch_global_data = async () => {
    let data = {};
    const querySnapshot_global = await getDocs(
      collection(db, "global_match_data")
    );
    setGlobalSharedData(querySnapshot_global);
    querySnapshot_global.forEach((doc) => {
      data.kiyakudata = doc.data().kiyaku;
      data.pre_title = doc.data().pre_title;
      data.pre_content = doc.data().pre_content;
      data.android_version = doc.data().android_version;
      data.ios_version = doc.data().ios_version;
    });
    set_sentence(data);
  };

  // 初回起動時に同意フラグを読み込む
  useEffect(() => {
    async function checkAgreement() {
      const agreed = await AsyncStorage.getItem("hasAgreedToTerms");
      if (agreed === "true") {
        setHasAgreed(true);
      } else {
        setShowTermsModal(true);
      }

      // // お気に入り画面のupgradeを起動させる
      // try {
      //   await AsyncStorage.removeItem("hasUpdatedFavoriteData");
      //   let lastUpdatedTimestamp = await AsyncStorage.setItem(
      //     "matchingResultDataArrayLastUpdatedTimestamp",
      //     JSON.stringify(24)
      //   );
      //   await AsyncStorage.setItem(
      //     "matchingDataLastUpdatedTimestamp",
      //     JSON.stringify(14)
      //   );
      // } catch (e) {
      //   console.log(e);
      // }
    }
    // resetAsyncStorage();
    checkAgreement();
    fetch_global_data();
    // additems();
  }, []);

  useEffect(() => {
    if (sentence.ios_version && sentence.android_version) {
      checkVersionAndUpdateIfNeeded();
    }
  }, [sentence]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("アプリがフォアグラウンドに戻りました！");
        // ここに実行したい関数を呼び出す
        if (sentence.ios_version && sentence.android_version) {
          checkVersionAndUpdateIfNeeded();
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <>
      <ImageBackground
        source={require("../assets/FirstBackImage.jpg")} // 背景画像を指定
        style={styles.background} // 背景のスタイル
      >
        <View style={styles.overlay} />
        <View style={styles.titleContainer}>
          <Text style={[styles.textWelcome]}>{`ようこそ！`}</Text>
          <Text style={[styles.text]}>{`スーパー銭湯マッチングで
好みの施設を探そう`}</Text>
        </View>
        {/* {sentence.pre_title && sentence.pre_content && (
          <View style={styles.container}>
            <View style={styles.box}>
              <Text style={styles.title}>{sentence.pre_title}</Text>
              <Text style={styles.content}>{sentence.pre_content}</Text>
            </View>
          </View>
        )} */}
        <Pressable
          style={[styles.vectorParent, GlobalStyles.positionCenter]}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "PermissionStateFrame" }],
            })
          }
        >
          <View>
            <Text style={[styles.text1]}>次へ</Text>
          </View>
        </Pressable>
        {/* 利用規約の同意モーダル */}
        <Modal
          visible={showTermsModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.termsContainer}>
              <Text style={[styles.termsTitle, GlobalStyles.positionCenter]}>
                利用規約
              </Text>
              <ScrollView>
                <Text style={styles.termsText}>{sentence.kiyakudata}</Text>
              </ScrollView>
              <Pressable
                onPress={handleAgreeTerms}
                style={({ pressed }) => [
                  styles.button,
                  pressed ? styles.buttonPressed : null,
                  !sentence.kiyakudata ? styles.buttonDisabled : null,
                ]}
                disabled={!sentence.kiyakudata} // kiyakudataが無い場合はボタンを無効化
              >
                <Text style={styles.buttonText}>同意</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  //モーダルのスタイル
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  termsContainer: {
    maxHeight: "60%",
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    marginVertical: 10,
    borderRadius: 10,
  },
  termsText: {
    fontSize: FontSize.bodySub,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    //利用規約が表示されていない時のボタンスタイル
    backgroundColor: "grey", // 無効化されたボタンの色
    // その他のスタイル定義
  },
  buttonText: {
    color: "white",
    fontSize: 18 / PixelRatio.getFontScale(),
  },
  //モーダルのスタイル終了

  textPosition: {
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: 0,
    left: "50%",
    position: "absolute",

    borderWidth: 1,
  },
  childPosition: {
    left: 0,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  titleContainer: {
    top: "20%",
    position: "absolute",
    width: "100%",
    justifyContent: "center",
  },
  textWelcome: {
    fontWeight: "500",
    fontSize: 40,
    color: Color.labelColorDarkPrimary,
    textAlign: "center",
    marginVertical: 10,
    textShadowColor: "rgba(0, 0, 0, 0.9)", // 影の色（黒に近いグレー）
    textShadowOffset: { width: 4, height: 4 }, // 影の位置（横方向・縦方向のオフセット）
    textShadowRadius: 10, // 影のぼかし半
  },
  text: {
    fontWeight: "500",
    fontSize: FontSize.subTitle,
    color: Color.labelColorDarkPrimary,
    textAlign: "center",
    marginVertical: 10,
    lineHeight: 40,
    textShadowColor: "rgba(0, 0, 0, 0.9)", // 影の色（黒に近いグレー）
    textShadowOffset: { width: 4, height: 4 }, // 影の位置（横方向・縦方向のオフセット）
    textShadowRadius: 5, // 影のぼかし半径
  },
  frameChild: {
    right: 0,
    bottom: 0,
    borderRadius: 8,
    maxWidth: "100%",
    maxHeight: "100%",
  },
  text1: {
    fontSize: FontSize.title,
    fontWeight: "500",
    color: Color.labelColorDarkPrimary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  vectorParent: {
    top: "80%",
    width: 342,
    height: 63,
    position: "absolute",
    overflow: "hidden",
    backgroundColor: Color.colorAzureBlue,

    borderRadius: 10,
  },
  view: {
    // backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    // width: "100%",
    // height: 800,
    // overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  //メッセージボックス
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 100,
    marginBottom: 16,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  box: {
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "100",
  },
  content: {
    fontSize: FontSize.bodySub,
    fontWeight: "100",
  },
  termsTitle: {
    fontSize: FontSize.body,
    fontWeight: "500",
    paddingVertical: 10,
  },
});

export default FirstFrame;
