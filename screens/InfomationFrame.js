import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontSize } from "../GlobalStyles";
import HeaderScreen from "../components/HeaderScreen";

// const notices = [
//   {
//     icon: "♨️",
//     noticeId: 1,
//     sentence:
//       "ようこそスーパー銭湯マッチングへ！ここでは皆さんへのお知らせを流していきます。新機能などなどぜひチェックしてみてください！",
//     update: new Date("2024-12-21T10:00:00"),
//   },
//   {
//     icon: "🌟",
//     noticeId: 2,
//     sentence:
//       "新しい機能が追加されました！お気に入りの銭湯を登録してみましょう。",
//     update: new Date("2024-12-20T15:30:00"),
//   },
// ];

const InfomationFrame = ({ navigation, route }) => {
  const notices = route.params.notice || [];
  // データをソート
  const sortedNotices = notices.sort(
    (a, b) => new Date(a.update) - new Date(b.update)
  );

  // Firebase Timestamp を Date に変換
  function firebaseTimestampToDate(timestamp) {
    return new Date(
      timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6)
    );
  }

  function getRelativeTime(date) {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffDays < 1) {
      return "今日";
    } else if (diffDays < 30) {
      return `${diffDays}日前`;
    } else {
      return `${diffMonths}ヶ月前`;
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedNotices}
        keyExtractor={(item) => item.noticeId.toString()}
        renderItem={({ item }) => {
          const updateDate = firebaseTimestampToDate(item.update);
          return (
            <View style={styles.listItem}>
              <Text style={styles.icon}>{item.icon}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.sentence}>{item.sentence}</Text>
                <Text style={styles.update}>{getRelativeTime(updateDate)}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: Color.labelColorDarkPrimary,
    borderColor: Color.colorGray,
    borderTopWidth: 1,
  },
  icon: {
    fontSize: FontSize.subTitle,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  sentence: {
    fontSize: FontSize.bodySub,
    marginBottom: 5,
  },
  update: {
    fontSize: 12,
    color: "#888",
  },
});

export default InfomationFrame;
