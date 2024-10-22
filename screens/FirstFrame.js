import * as React from "react";
import { useState, useEffect } from "react";
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
import { FontSize, FontFamily, Color } from "../GlobalStyles";
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
import * as Application from "expo-application";
import { useFocusEffect } from "@react-navigation/native";

const db = getFirestore(app);

const FirstFrame = () => {
  const navigation = useNavigation();
  const [showTermsModal, setShowTermsModal] = useState(false); // モーダルを表示するための状態
  const [hasAgreed, setHasAgreed] = useState(false);
  // let kiyaku_sentence = "";//利用規約文章
  const [sentence, set_sentence] = useState(""); //利用規約文章
  const [appState, setAppState] = useState(AppState.currentState);

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
    const currentVersion =
      Platform.OS === "android"
        ? Constants.expoConfig.android.versionCode
        : Constants.expoConfig.ios.buildNumber;
    const latestVersion =
      Platform.OS === "android"
        ? sentence.android_version
        : sentence.ios_version;
    const storeUrl =
      Platform.OS === "android"
        ? "https://play.google.com/store/apps/details?id=com.abebebe.onsen_maching"
        : "https://apps.apple.com/jp/app/%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E9%8A%AD%E6%B9%AF%E3%83%9E%E3%83%83%E3%83%81%E3%83%B3%E3%82%B0/id6471331298";

    if (currentVersion !== latestVersion) {
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
        checkVersionAndUpdateIfNeeded();
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
        <View style={styles.view}>
          <Text style={[styles.text, styles.textPosition]}>{`スーパー銭湯
を探しましょう`}</Text>
          {sentence.pre_title && sentence.pre_content && (
            <View style={styles.container}>
              <View style={styles.box}>
                <Text style={styles.title}>{sentence.pre_title}</Text>
                <Text style={styles.content}>{sentence.pre_content}</Text>
              </View>
            </View>
          )}
          <Pressable
            style={styles.vectorParent}
            start_match="さっそく探す"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Matching_Frame" }],
              })
            }
          >
            <Image
              style={[styles.frameChild, styles.childPosition]}
              contentFit="cover"
              source={require("../assets/rectangle-1.png")}
            />
            <Text style={[styles.text1, styles.textPosition2]}>
              さっそく探す
            </Text>
          </Pressable>
          <StatusBar style={styles.childPosition} barStyle="default" />

          {/* 利用規約の同意モーダル */}
          <Modal
            visible={showTermsModal}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.termsContainer}>
                <Text style={styles.title}>利用規約</Text>
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
        </View>
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
  title: {
    fontSize: 20 / PixelRatio.getFontScale(),
    fontWeight: "bold",
    marginBottom: 10,
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
    fontSize: 16 / PixelRatio.getFontScale(),
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
  },
  textPosition2: {
    textAlign: "center",
    lineHeight: 55,
    letterSpacing: 0,
    left: "50%",
    position: "absolute",
  },
  childPosition: {
    left: 0,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  text: {
    marginLeft: -143.5,
    top: 230,
    fontWeight: "500",
    fontSize: 30 / PixelRatio.getFontScale(),
    color: Color.labelColorDarkPrimary,
    lineHeight: 5,
    width: 286,
    height: 100,
    textShadowColor: "rgba(0, 0, 0, 0.75)", // 影の色（黒に近いグレー）
    textShadowOffset: { width: 2, height: 2 }, // 影の位置（横方向・縦方向のオフセット）
    textShadowRadius: 20, // 影のぼかし半径
  },
  frameChild: {
    right: 0,
    bottom: -1,
    borderRadius: 8,
    maxWidth: "100%",
    maxHeight: "100%",
  },
  text1: {
    marginLeft: -132,
    fontSize: 36 / PixelRatio.getFontScale(),
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorDarkPrimary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 265,
    height: 63,
  },
  vectorParent: {
    marginLeft: -170.5,
    top: "80%",
    width: 342,
    height: 63,
    left: "50%",
    position: "absolute",
    overflow: "hidden",
  },
  view: {
    // backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },

  //メッセージボックス
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
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
    fontSize: 20 / PixelRatio.getFontScale(),
    fontWeight: "100",
  },
  content: {
    fontSize: 14 / PixelRatio.getFontScale(),
    fontWeight: "100",
  },
});

export default FirstFrame;
