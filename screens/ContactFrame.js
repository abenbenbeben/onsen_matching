import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { FontSize, Color } from "../GlobalStyles";
import HeaderScreen from "../components/HeaderScreen";

const ContactScreen = () => {
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

  return (
    <>
      <HeaderScreen headerText="設定" />
      <ScrollView style={styles.container}>
        {/* Support Section */}
        <Text style={styles.sectionTitle}>サポート</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("お問い合わせ")}
        >
          <Text style={styles.menuText}>お問い合わせ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("よくある質問")}
        >
          <Text style={styles.menuText}>よくある質問</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("利用規約")}
        >
          <Text style={styles.menuText}>利用規約</Text>
        </TouchableOpacity>

        {/* About App Section */}
        <Text style={styles.sectionTitle}>アプリについて</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("バージョン情報")}
        >
          <Text style={styles.menuText}>バージョン情報</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handlePress("プライバシーポリシー")}
        >
          <Text style={styles.menuText}>プライバシーポリシー</Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: FontSize.bodySub,
    fontWeight: "300",
    color: Color.labelColorLightPrimary,
    marginVertical: 16,
  },
  menuItem: {
    backgroundColor: Color.labelColorDarkPrimary,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
