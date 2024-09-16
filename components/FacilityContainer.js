import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const FacilityCard = () => {
  const reviews = [
    "このサウナは本当に最高,また行きたい。",
    "ロウリュウいいね。",
  ];
  const title = "サウナ";
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: "https://example.com/sauna.jpg" }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {reviews.slice(0, 3).map((review, index) => (
          <Text key={index} style={styles.review}>
            {review}
          </Text>
        ))}
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
});

export default FacilityCard;
