import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";

const FacilityCard = ({ reviews, title, data, imagePath }) => {
  const [expanded, setExpanded] = useState(false); // 表示を拡大するかどうかの状態

  if (!reviews) {
    reviews = [];
  }
  if (!title) {
    title = "サウナ";
  }

  // タッチした際に表示するレビューの数を決定
  const displayedReviews = expanded ? reviews : reviews.slice(0, 2);

  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: imagePath }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        {reviews.length === 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
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
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.expandButton}
          >
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
