import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from "react-native";
import { IconButton } from "react-native-paper";
import { FontSize, Color } from "../GlobalStyles";
import HeaderScreen from "../components/HeaderScreen";
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
import { DataContext } from "../DataContext";
import { useNavigation } from "@react-navigation/native";

const db = getFirestore(app);

const ContactScreen = () => {
  const navigation = useNavigation();
  const [globalMatchData, setGlobalMatchData] = useState(null);
  const { globalSharedData } = useContext(DataContext);

  const fetchSettingData = async () => {
    let globalData = {};
    globalSharedData.forEach((doc) => {
      const docData = doc.data();
      globalData.kiyakudata = docData.kiyaku;
      globalData.notice = docData.notice;
      globalData.android_version = docData.android_version;
      globalData.ios_version = docData.ios_version;
    });
    setGlobalMatchData(globalData);
    console.log(globalData);
  };

  const openGoogleForm = () => {
    const url =
      "https://docs.google.com/forms/d/e/1FAIpQLSfi_PeZwHhEKXyDWbEXwcAd4qCAHgBCAsR2YtqzG5j9dY5ugw/viewform?usp=sf_link"; // GoogleフォームのURLに置き換えてください
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const handlePress = (menu) => {
    console.log(`${menu} tapped!`);
    // Add navigation or functionality here
  };
  const handleContact = () => {
    Alert.alert(
      "外部リンクの確認", // アラートのタイトル
      `このリンクをタップすると、外部サイト（Googleフォーム）が開きます。\n続行しますか？`, // メッセージ
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "開く",
          onPress: () => {
            openGoogleForm();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleNotice = () => {
    navigation.navigate("InformationFrame", {});
  };

  const MenuItem = ({ title, onPress, style }) => (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={styles.menuText}>{title}</Text>
      <IconButton
        icon="chevron-right"
        iconColor={Color.colorDarkGray}
        selected="true"
        size={20}
        style={[styles.buttonLayout]}
      />
    </TouchableOpacity>
  );
  return (
    <>
      <HeaderScreen headerText="設定" />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>サポート</Text>
        <View style={[styles.menuContainer]}>
          <MenuItem
            title="お知らせ"
            onPress={() => handleNotice()}
            style={[styles.menuItem, { borderTopWidth: 0 }]}
          />
          <MenuItem
            title="改修リクエスト"
            onPress={() => handlePress("改修リクエスト")}
            style={styles.menuItem}
          />
          <MenuItem
            title="お問い合わせ"
            onPress={() => handleContact("お問い合わせ")}
            style={styles.menuItem}
          />
          <MenuItem
            title="利用規約"
            onPress={() => handlePress("利用規約")}
            style={styles.menuItem}
          />
        </View>

        <Text style={styles.sectionTitle}>アプリについて</Text>
        <View style={[styles.menuContainer]}>
          <TouchableOpacity
            style={[styles.menuItem, { borderTopWidth: 0 }]}
            onPress={() => handlePress("バージョン情報")}
          >
            <Text style={styles.menuText}>バージョン</Text>
          </TouchableOpacity>
          <MenuItem
            title="プライバシーポリシー"
            onPress={() => handlePress("プライバシーポリシー")}
            style={styles.menuItem}
          />
        </View>
      </ScrollView>

      {/* <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.subtitle}>開発に至った経緯</Text>
          <Text style={styles.content}>
            私はスーパー銭湯が大好きです。サウナで汗を流して水風呂入って整って、この時間をとても愛してます。でもそれはお気に入りの銭湯でした味わえませんでした。
            でも、そんなことないはずです。どこに行ったとしてもあなたのお気に入りの銭湯、もしかしたらさらにいい銭湯に出会えるかもしれません。
            「どこに行ってもお気に入りのスーパー銭湯を見つけたい」そんな思いで開発をしています。
          </Text>
          <Text style={styles.subtitle}>開発者について</Text>
          <Text style={styles.content}>
            {`こんにちは、個人開発していますあべべです。
          個人開発なため、1人で開発してます。ただ1人で開発するのは、気楽ではありますが孤独でもあります。そこで１つお願いがあります。こんな機能があればいいな、この機能とってもいいよ、のような声を送ってもらいたいです。
          あなたと一緒にこのアプリを良くしていきたいと思ってます。お便り待っています。`}
          </Text>

          <Text style={styles.subtitle}>開発者に連絡</Text>
          <Text style={styles.content}>
            ご意見やご質問があれば、以下のボタンからGoogleフォームを通してお知らせください。
          </Text>
          <TouchableOpacity style={styles.button} onPress={openGoogleForm}>
            <Text style={styles.buttonText}>Googleフォームを開く</Text>
          </TouchableOpacity>
        </View>
      </ScrollView> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  buttonLayout: {
    margin: 0,
    height: 15,
  },
  sectionTitle: {
    fontSize: FontSize.bodySub,
    fontWeight: "300",
    color: Color.labelColorLightPrimary,
    marginVertical: 16,
  },
  menuContainer: {
    backgroundColor: Color.labelColorDarkPrimary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderColor: Color.colorGray,
  },
  menuText: {
    fontSize: FontSize.bodySub,
  },

  // title: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   marginBottom: 20,
  //   color: "#333", // タイトルの色を濃く
  // },
  // subtitle: {
  //   fontSize: 18,
  //   fontWeight: "600",
  //   marginBottom: 10,
  //   color: "#666",
  // },
  // content: {
  //   fontSize: 16,
  //   textAlign: "center",
  //   marginBottom: 20,
  //   lineHeight: 24, // 読みやすくするために行間を追加
  // },
  // button: {
  //   backgroundColor: "#007BFF", // 青色をよりプロフェッショナルなトーンに
  //   paddingVertical: 12,
  //   paddingHorizontal: 24,
  //   borderRadius: 8,
  //   shadowColor: "#000", // ボタンに影を追加
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  //   elevation: 3, // Androidのための影効果
  // },
  // buttonText: {
  //   color: "white",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
});

export default ContactScreen;
