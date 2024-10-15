import React from "react";
import { Pressable, StyleSheet, View, Text, PixelRatio } from "react-native";
import { IconButton } from "react-native-paper";
import { Image } from "expo-image";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";

const CardWithMatchPercentage = ({
  onsenName,
  matchPercentage,
  onFramePressablePress,
  heijitunedan,
  kyuzitunedan,
  images,
  isfavorite,
  data,
  match_array = [],
  distance,
  filter,
}) => {
  const buttonColor = isfavorite ? "#FFC800" : "#FFF";
  const buttonIcon = isfavorite ? "star" : "star-outline";
  const tagNameList = {
    doro: "泥パック",
    ekitika: "駅近",
    facewash: "フェイスウォッシュ",
    ganban: "岩盤浴",
    manga: "漫画",
    mizuburo: "水風呂",
    rouryu: "ロウリュウ",
    sauna: "サウナ",
    siosauna: "塩サウナ",
    tansan: "炭酸泉",
    tennen: "天然",
    wifi: "wifi",
  };
  // タグをフィルタリングして取得
  let filteredTags;
  if (data) {
    filteredTags = Object.keys(tagNameList).filter(
      (key) => data[key] && data[key] >= 0.5
    );
  }

  return (
    <Pressable style={styles.cardContainer} onPress={onFramePressablePress}>
      <View style={styles.backgroundFrame} />
      <IconButton
        icon={buttonIcon}
        iconColor={buttonColor}
        size={30}
        style={styles.favoriteIcon}
      />
      <Image style={styles.image} contentFit="cover" source={images} />
      <View style={styles.textContainer}>
        <Text style={styles.onsenName}>{onsenName}</Text>
        {matchPercentage && filter === 1 && (
          <View style={[styles.matchContainer, styles.flexDirectionRow]}>
            <Text style={[styles.matchTextRatio]}>{matchPercentage}</Text>
            <Text style={styles.matchText}>{`マッチ度\n%`}</Text>
          </View>
        )}
        {matchPercentage && filter === 2 && (
          <View style={[styles.flexDirectionRow]}>
            <View style={[styles.matchContainer, styles.flexDirectionRow]}>
              <Text style={[styles.matchTextRatio]}>{matchPercentage}</Text>
              <Text style={styles.matchText}>{`マッチ度\n%`}</Text>
            </View>
            <View style={[styles.matchContainer, styles.flexDirectionRow]}>
              <Text style={[styles.matchTextRatio]}>{distance}</Text>
              <Text style={styles.matchText}>{`距離\nkm`}</Text>
            </View>
          </View>
        )}
        {matchPercentage && filter === 3 && (
          <View style={[styles.flexDirectionRow]}>
            <View style={[styles.matchContainer, styles.flexDirectionRow]}>
              <Text style={[styles.matchTextRatio]}>{distance}</Text>
              <Text style={styles.matchText}>{`距離\nkm`}</Text>
            </View>
            <View style={[styles.matchContainer, styles.flexDirectionRow]}>
              <Text style={[styles.matchTextRatio]}>{matchPercentage}</Text>
              <Text style={styles.matchText}>{`マッチ度\n%`}</Text>
            </View>
          </View>
        )}
        <Text style={styles.priceText}>
          {`平日 ${heijitunedan}円 祝日 ${kyuzitunedan}円`}
        </Text>
        <View style={styles.tagContainer}>
          {filteredTags.map((tagKey) => (
            <View
              key={tagKey}
              style={[
                styles.tag,
                match_array.includes(tagKey) ? styles.matchTag : styles.grayTag,
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  match_array.includes(tagKey)
                    ? styles.matchTag
                    : styles.grayTag,
                ]}
              >
                {tagNameList[tagKey]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: Border.br_12xs,
    // borderWidth: 1,
    // borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: Color.labelColorDarkPrimary,
    width: "100%",
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backgroundFrame: {
    position: "absolute",
    backgroundColor: Color.labelColorDarkPrimary,
    borderRadius: Border.br_12xs,
    height: "100%",
    width: "100%",
  },
  favoriteIcon: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    // justifyContent: "space-between",
  },
  onsenName: {
    fontSize: 16 / PixelRatio.getFontScale(),
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorLightPrimary,
  },
  matchContainer: {
    backgroundColor: "#fdecef",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    alignItems: "center",
    marginVertical: 2,
    marginRight: 8,
  },
  matchTextRatio: {
    color: Color.colorRed,
    fontSize: 25 / PixelRatio.getFontScale(),
  },
  matchText: {
    color: Color.colorRed,
    fontSize: 11 / PixelRatio.getFontScale(),
  },
  priceText: {
    color: Color.labelColorLightPrimary,
    fontSize: 12 / PixelRatio.getFontScale(),
  },
  flexDirectionColumn: {
    flexDirection: "column",
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  matchTag: {
    backgroundColor: "#e0f7fa", // マッチした場合の色
  },
  grayTag: {
    backgroundColor: "#e0e0e0", // マッチしなかった場合の灰色
  },
  tagText: {
    color: "#00796b",
    fontSize: 12,
  },
});

export default CardWithMatchPercentage;
