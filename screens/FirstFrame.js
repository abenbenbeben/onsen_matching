import * as React from "react";
import { useState,useEffect } from "react";
import { StyleSheet, View, Text, Pressable, StatusBar, Modal,ScrollView } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc,getFirestore,getDocs,getDoc,doc,serverTimestamp, query,updateDoc } from "firebase/firestore";
import { app } from "../firebaseconfig";

const db = getFirestore(app); 

const FirstFrame = () => {
  const navigation = useNavigation();
  const [showTermsModal, setShowTermsModal] = useState(false); // モーダルを表示するための状態
  const [hasAgreed, setHasAgreed] = useState(false);
  // let kiyaku_sentence = "";//利用規約文章
  const [kiyaku_sentence, setkiyaku_sentence] = useState("");//利用規約文章

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
  let data= "";
  const querySnapshot_global = await getDocs(collection(db, "global_match_data"));
  querySnapshot_global.forEach((doc) => {
    data = doc.data().kiyaku;
  });
  setkiyaku_sentence(data)
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
    // resetAsyncStorage();
    checkAgreement();
    fetch_global_data();
    // additems();
  }, []);

  return (
    <View style={styles.view}>
      <View style={styles.grid} />
      <Text style={[styles.text, styles.textPosition]}>{`あなたの求めている
スーパー銭湯
を探しましょう`}</Text>
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
                {kiyaku_sentence}
              </Text>
            </ScrollView>
            <Pressable onPress={handleAgreeTerms} style={styles.button}>
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
    fontSize: 20,
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
    fontSize: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems:"center",
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  //モーダルのスタイル終了

  textPosition: {
    // borderColor:"red",
    // borderWidth:2,
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
    fontSize: FontSize.size_5xl,
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
    fontSize: 36,
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
});

export default FirstFrame;
