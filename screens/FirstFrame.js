import * as React from "react";
import { useState,useEffect } from "react";
import { StyleSheet, View, Text, Pressable, StatusBar, Modal,ScrollView, Platform,Alert,Linking, AppState, PixelRatio,} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc,getFirestore,getDocs,getDoc,doc,serverTimestamp, query,updateDoc } from "firebase/firestore";
import { app } from "../firebaseconfig";

import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { useFocusEffect } from '@react-navigation/native';

const db = getFirestore(app); 

const FirstFrame = () => {
  const navigation = useNavigation();
  const [showTermsModal, setShowTermsModal] = useState(false); // モーダルを表示するための状態
  const [hasAgreed, setHasAgreed] = useState(false);
  // let kiyaku_sentence = "";//利用規約文章
  const [sentence, set_sentence] = useState("");//利用規約文章
  const [appState, setAppState] = useState(AppState.currentState);

  const handleAgreeTerms = async () => {
    setHasAgreed(true);
    setShowTermsModal(false);
    
    // 同意ボタンが押されたら同意フラグを保存
    await AsyncStorage.setItem('hasAgreedToTerms', 'true');
  };

  const resetAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage has been cleared.');
    } catch (error) {
      console.error('Error clearing AsyncStorage: ', error);
    }
  };

  const checkVersionAndUpdateIfNeeded = async () => {
    const currentVersion = Platform.OS === 'android' ? Constants.expoConfig.android.versionCode : Constants.expoConfig.ios.buildNumber;
    const latestVersion = Platform.OS === 'android' ? sentence.android_version : sentence.ios_version;
    const storeUrl = Platform.OS === 'android'
      ? 'https://play.google.com/store/apps/details?id=com.abebebe.onsen_maching'
      : 'https://apps.apple.com/jp/app/%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E9%8A%AD%E6%B9%AF%E3%83%9E%E3%83%83%E3%83%81%E3%83%B3%E3%82%B0/id6471331298';
  
    if (currentVersion !== latestVersion) {
      Alert.alert(
        "新しいバージョンが利用可能です",
        "最新の機能を利用するには、ストアからアップデートしてください。",
        [{ text: "ストアへ遷移", onPress: () => Linking.openURL(storeUrl) }],
        { cancelable: false }
      );
    }
  };

  const additems = async() => {
  try {
    const docRef = await updateDoc(doc(db, "global_match_data","z9eDm6HDqFRpf3fO9nkd"),  {
      kiyaku: `アプリ「スーパー銭湯マッチング」の利用規約


この利用規約（以下、「本規約」といいます）は、アプリ「スーパー銭湯マッチング」（以下、「アプリ」といいます）の利用に関する条件を定めるものです。アプリをダウンロードし、ご利用いただく前に、本規約をよくお読みいただき、内容を理解した上でご利用ください。アプリを利用することで、本規約に同意したものとみなします。

第1条 利用規約の適用
1.1 本規約は、アプリの利用に関する一切の事項に適用されます。本規約は、アプリの提供者（以下、「提供者」といいます）とアプリの利用者（以下、「利用者」といいます）との間の契約です。

第2条 利用者の権利と義務
2.1 利用者は、アプリを提供者が定める方法に従い、使用する権利を有します。
2.2 利用者は、本アプリを以下のように利用しないことを確約します。
(a) 法律に反する目的での利用
(b) アプリ内のコンテンツの不正使用、複製、転送、販売、再配布、または変更
(c) アプリ内の情報の改ざん、ハッキング、不正アクセス、または不正使用
(d) 他の利用者に対する嫌がらせ、脅迫、またはプライバシーの侵害
(e) アプリの正常な運用に損害を与える行為
(f) その他、提供者が不適切と判断する行為
2.3 利用者は、アプリ内の情報やコンテンツを信頼する際には自己責任で行動する必要があります。アプリ内の温泉データは最新でない場合があり、その正確性や完全性について提供者は一切の保証をしないことを理解してください。

第3条 サービスの提供と変更
3.1 提供者は、アプリの提供や機能の変更、一時停止、または終了について、提供者の裁量で行います。提供者は、利用者に通知することなく、いつでもアプリの提供や機能を変更または終了する権利を有します。

第4条 利用者情報の取り扱い
4.1 提供者は、利用者のプライバシーに配慮し、利用者情報の取り扱いについてはプライバシーポリシーに従います。

第5条 免責事項
5.1 提供者は、アプリの利用によって生じたいかなる損害についても一切の責任を負いません。
5.2 提供者は、アプリ内の情報やコンテンツの正確性、完全性、信頼性についていかなる保証も提供しません。アプリ内の温泉データは最新でない場合があり、その情報に依存する前に必ず確認を行うようお願いします。

第6条 本規約の変更
6.1 提供者は、本規約を変更する権利を有し、変更が行われた場合は、利用者に通知することなく効力を発生させます。利用者は、変更後の規約に同意しない場合、アプリの利用を中止する義務があります。

第7条 準拠法と管轄裁判所
7.1 本規約は、[提供者の所在地]の法律に基づいて解釈され、適用されます。
7.2 本規約に関する一切の紛争については、[提供者の所在地]の裁判所を専属の管轄裁判所とします。

本利用規約は、2023年11月1日に制定され、効力を発揮します。
`
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
 
 const fetch_global_data = async() => {
  let data= {};
  const querySnapshot_global = await getDocs(collection(db, "global_match_data"));
  querySnapshot_global.forEach((doc) => {
    data.kiyakudata = doc.data().kiyaku;
    data.pre_title = doc.data().pre_title;
    data.pre_content = doc.data().pre_content;
    data.android_version=doc.data().android_version;
    data.ios_version=doc.data().ios_version;
  });
  set_sentence(data)
 }


 // 初回起動時に同意フラグを読み込む
  useEffect(() => {
    async function checkAgreement() {
      const agreed = await AsyncStorage.getItem('hasAgreedToTerms');
      if (agreed === 'true') {
        setHasAgreed(true);
      } else {
        setShowTermsModal(true);
      }
    }
    //resetAsyncStorage();
    checkAgreement();
    fetch_global_data();
    // additems();


  }, []);
  
  useEffect(() => {
    if(sentence.ios_version&&sentence.android_version){
      checkVersionAndUpdateIfNeeded();
    }
  },[sentence])

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
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
    <View style={styles.view}>
      <View style={styles.grid} />
      <Text style={[styles.text, styles.textPosition]}>{`あなたの求めている
スーパー銭湯
を探しましょう`}</Text>
      <View style={styles.container}>
      {sentence.pre_title && sentence.pre_content && (
        <>
          <View style={styles.box}>
            <Text style={styles.title}>{sentence.pre_title}</Text>
            <Text style={styles.content}>{sentence.pre_content}</Text>
          </View>
        </>
        )}
      </View>
      <Pressable
        style={styles.vectorParent}
        start_match="さっそく探す"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Matching_Frame'}]
        })}
      >
        
        <Image
          style={[styles.frameChild, styles.childPosition]}
          contentFit="cover"
          source={require("../assets/rectangle-1.png")}
        />
        <Text style={[styles.text1, styles.textPosition2]}>さっそく探す</Text>
      </Pressable>
      <StatusBar style={styles.childPosition} barStyle="default" />

      {/* 利用規約の同意モーダル */}
      <Modal visible={showTermsModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.termsContainer}>
            <Text style={styles.title}>利用規約</Text>
            <ScrollView>
              <Text style={styles.termsText}>
                {sentence.kiyakudata}
              </Text>
            </ScrollView>
            <Pressable 
              onPress={handleAgreeTerms} 
              style={({ pressed }) => [
                styles.button,
                pressed ? styles.buttonPressed : null,
                !sentence.kiyakudata ? styles.buttonDisabled : null
              ]}
              disabled={!sentence.kiyakudata} // kiyakudataが無い場合はボタンを無効化
            >
              <Text style={styles.buttonText}>同意</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({

  //モーダルのスタイル
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 20/PixelRatio.getFontScale(),
    fontWeight: 'bold',
    marginBottom:10,
  },
  termsContainer: {
    maxHeight: '60%',
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 10,
    borderRadius: 10,
  },
  termsText: {
    fontSize: 16/PixelRatio.getFontScale(),
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems:"center",
  },
  buttonDisabled: {//利用規約が表示されていない時のボタンスタイル
    backgroundColor: 'grey', // 無効化されたボタンの色
    // その他のスタイル定義
  },
  buttonText: {
    color: 'white',
    fontSize: 18/PixelRatio.getFontScale(),
  },
  //モーダルのスタイル終了

  textPosition: {
    textAlign: "center",
    lineHeight: 29,
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
  grid: {
    top: 44,
    right: 7,
    bottom: 34,
    left: 8,
    position: "absolute",
    overflow: "hidden",
  },
  text: {
    marginLeft: -143.5,
    top: 190,
    fontSize: 24/PixelRatio.getFontScale(),
    fontFamily: FontFamily.interRegular,
    color: Color.labelColorLightPrimary,
    width: 286,
    height: 100,
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
    fontSize: 36/PixelRatio.getFontScale(),
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
    backgroundColor: Color.labelColorDarkPrimary,
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },

  //メッセージボックス
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  box: {
    alignItems: 'center',
    marginVertical: 20, // 斜線との間隔
  },
  title: {
    fontSize: 20/PixelRatio.getFontScale(),
    fontWeight:"100",
  },
  content: {
    fontSize: 14/PixelRatio.getFontScale(),
    fontWeight:"100",
  },
});

export default FirstFrame;
