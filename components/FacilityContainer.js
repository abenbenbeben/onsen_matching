import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { IconButton } from "react-native-paper";

// Android の場合、レイアウトアニメーションの許可が必要
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FacilityCard = ({
  reviews = [],
  title,
  data,
  imagePath,
  moyorieki = "",
  zikan,
  kyori,
  isHighlight,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!reviews) {
    reviews = [];
  }
  if (!title) {
    title = "サウナ";
  }
  if (!moyorieki) {
    moyorieki = "";
  }

  // レビューを表示する数を制御
  const displayedReviews = expanded ? reviews : reviews.slice(0, 2);

  // 展開/閉じるを行う関数
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // アニメーション設定
    setExpanded(!expanded);
  };

  return (
    <View
      style={[
        styles.cardContainer,
        isHighlight && styles.highlightContainer, // フラグがONならハイライト
      ]}
    >
      <Image source={{ uri: imagePath }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        {reviews.length === 0 && data !== "ekitika" && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon={"alert"}
              iconColor={"#666"}
              selected="true"
              size={19}
              style={{ margin: 0 }}
            />
            <Text style={{ color: "#666" }}>施設情報を確認してください</Text>
          </View>
        )}
        {reviews.length === 0 && data === "ekitika" && moyorieki === "" && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon={"alert"}
              iconColor={"#666"}
              selected="true"
              size={19}
              style={{ margin: 0 }}
            />
            <Text style={{ color: "#666" }}>最寄駅から少し離れています</Text>
          </View>
        )}
        {reviews.length === 0 && data === "ekitika" && moyorieki !== "" && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "#666", fontSize: 40 }}>{zikan}</Text>
                <Text style={{ color: "#666" }}>{`徒歩\n分`}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: "#666", fontSize: 40 }}>{kyori}</Text>
                <Text style={{ color: "#666" }}>{`距離\nkm`}</Text>
              </View>
              {moyorieki.length <= 4 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#666", fontSize: 20 }}>
                    {moyorieki}
                  </Text>
                </View>
              )}
            </View>
            {moyorieki.length > 4 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginVertical: 4,
                }}
              >
                <Text style={{ color: "#666", fontSize: 20 }}>{moyorieki}</Text>
              </View>
            )}
          </>
        )}

        {displayedReviews.map((review, index) => (
          <View
            key={index}
            style={[
              styles.reviewContainer,
              index === displayedReviews.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Text style={styles.review}>{review}</Text>
          </View>
        ))}

        {/* 口コミが3つ以上の場合にタッチで展開 */}
        {reviews.length > 2 && (
          <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
            <Text style={styles.expandText}>
              {expanded ? "閉じる" : "さらに表示"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightContainer: {
    backgroundColor: "#f0f8ff", // アクア系の柔らかい色
    borderColor: "#007bff", // 明るい青のボーダー
    borderWidth: 2, // ボーダーを少し太く
    shadowColor: "#007bff", // 影の色も青系にして光沢を追加
    shadowOpacity: 0.3, // 影の強調
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  reviewContainer: {
    borderBottomWidth: 1,
    borderColor: "#dcdcdc",
    marginVertical: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  review: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
  },
  expandButton: {
    marginTop: 8,
  },
  expandText: {
    color: "#1E90FF",
    fontSize: 14,
  },
});

export default FacilityCard;
