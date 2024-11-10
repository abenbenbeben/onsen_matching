import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
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

  return (
    <>
      <HeaderScreen headerText="ヘルプ" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* 開発に至った経緯 */}
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
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0", // ScrollView自体の背景色
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 100,
    backgroundColor: "#f0f0f0", // 背景色をより落ち着いたものに変更
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // タイトルの色を濃く
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  content: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24, // 読みやすくするために行間を追加
  },
  button: {
    backgroundColor: "#007BFF", // 青色をよりプロフェッショナルなトーンに
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#000", // ボタンに影を追加
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // Androidのための影効果
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContactScreen;
