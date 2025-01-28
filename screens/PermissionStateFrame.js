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

const PermissionStateFrame = () => {
  const navigation = useNavigation();
  const [showTermsModal, setShowTermsModal] = useState(false); // モーダルを表示するための状態
  const [hasAgreed, setHasAgreed] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const { globalSharedData, setGlobalSharedData } = useContext(DataContext);

  return (
    <>
      <ImageBackground
        source={require("../assets/FirstBackImage.jpg")} // 背景画像を指定
        style={styles.background} // 背景のスタイル
      >
        <View style={styles.overlay} />
        <View style={styles.titleContainer}>
          <Text style={[styles.text]}>{`温泉施設の検索には
位置情報が必要です`}</Text>
        </View>
        <Pressable
          style={[styles.vectorParent, GlobalStyles.positionCenter]}
          onPress={() =>
            navigation.replace("Root", {
              screen: "探す",
            })
          }
        >
          <View>
            <Text style={[styles.text1]}>さっそく探す</Text>
          </View>
        </Pressable>
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

export default PermissionStateFrame;
