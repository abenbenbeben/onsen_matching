import React from "react";
import { Pressable, StyleSheet, View, Text, PixelRatio } from "react-native";
import { IconButton } from "react-native-paper";
import { Image } from "expo-image";
import {
  FontSize,
  FontFamily,
  Color,
  Border,
  GlobalStyles,
} from "../GlobalStyles";
import { GlobalData } from "../GlobalData";
import FavoriteButton from "./FavoriteButton";

const CardWithMatchPercentage = ({
  onsenName,
  matchPercentage,
  onFramePressablePress,
  heijitunedan,
  kyuzitunedan,
  images,
  isfavorite = false,
  favoriteDataArray = [],
  data,
  match_array = [],
  distance,
  filter = 1,
}) => {
  const tagNameList = GlobalData.tagNameList;
  // タグをフィルタリングして取得
  let filteredTags;
  if (data) {
    filteredTags = Object.keys(tagNameList).filter(
      (key) => data[key] && data[key] >= 0.5
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.topContainer]}>
        <View style={styles.nameContainer}>
          <Text style={styles.onsenName} numberOfLines={2}>
            {onsenName}
          </Text>
        </View>
        <View style={[{ zIndex: 10 }, styles.favoriteButtonContainer]}>
          <FavoriteButton id={data.id} favoriteDataArray={favoriteDataArray} />
        </View>
      </View>
      <Pressable onPress={onFramePressablePress}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image style={styles.image} contentFit="cover" source={images} />
          <View style={styles.textContainer}>
            {matchPercentage && (
              <View style={[styles.matchContainer, styles.flexDirectionRow]}>
                <Text style={[styles.matchTextRatio]}>{matchPercentage}</Text>
                <Text style={styles.matchText}>{`マッチ度\n%`}</Text>
              </View>
            )}
            <View style={styles.tagContainer}>
              {filteredTags.map((tagKey) => (
                <View
                  key={tagKey}
                  style={[
                    styles.tag,
                    match_array.includes(tagKey)
                      ? styles.matchTag
                      : styles.grayTag,
                  ]}
                >
                  <Text
                    style={[
                      match_array.includes(tagKey)
                        ? styles.matchTagText
                        : styles.tagText,
                    ]}
                  >
                    {tagNameList[tagKey]}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.priceContainer}>
              <View
                style={[
                  { flexDirection: "row", width: "50%", alignItems: "center" },
                ]}
              >
                <Text
                  style={[
                    styles.priceText,
                    {
                      backgroundColor: Color.colorGray,
                      marginRight: 8,
                      padding: 3,
                      borderRadius: 5,
                    },
                  ]}
                >
                  平日
                </Text>
                <Text style={styles.priceText}>{`${heijitunedan}円`}</Text>
              </View>
              <View
                style={[
                  { flexDirection: "row", width: "50%", alignItems: "center" },
                ]}
              >
                <Text
                  style={[
                    styles.priceText,
                    {
                      backgroundColor: Color.colorGray,
                      marginRight: 8,
                      padding: 3,
                      borderRadius: 5,
                    },
                  ]}
                >
                  土日祝
                </Text>
                <Text style={styles.priceText}>{`${kyuzitunedan}円`}</Text>
              </View>
            </View>
            {distance && (
              <View>
                <View
                  style={[
                    {
                      flexDirection: "row",
                      width: "50%",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priceText,
                      {
                        backgroundColor: Color.colorGray,
                        marginRight: 8,
                        padding: 3,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    現在地からの距離
                  </Text>
                  <Text style={styles.priceText}>{`${distance} km`}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </View>
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
    // flexDirection: "row",
    // alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // 子要素を左右端に配置
    alignItems: "center", // 縦方向で中央揃え
    marginVertical: 8,
  },
  favoriteButtonContainer: {
    // position: "absolute",
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
  nameContainer: {
    marginVertical: 2,
    flex: 1,
  },
  onsenName: {
    textAlign: "left",
    flexWrap: "wrap",
    fontSize: FontSize.body,
    fontFamily: FontFamily.interMedium,
    color: Color.labelColorLightPrimary,
  },
  matchContainer: {
    backgroundColor: "rgba(58, 106, 229, 0.1)", // 半透明の背景色
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    alignItems: "center",
    marginVertical: 4,
    marginRight: 10,
    // borderWidth: 0.2,
    // borderColor: Color.colorMain, // 主色で縁取り
  },
  matchTextRatio: {
    color: Color.colorMain,
    fontSize: FontSize.subTitle,
    fontWeight: "600",
  },
  matchText: {
    color: "#6D8AEF", // 主色より明るい近似色
    fontSize: FontSize.caption,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    // color: Color.labelColorLightPrimaryMuted,
    fontSize: FontSize.caption,
    marginVertical: 4,
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
    backgroundColor: Color.colorMain, // マッチした場合の色
  },
  grayTag: {
    backgroundColor: Color.labelColorDarkPrimary, // マッチしなかった場合の灰色
    borderWidth: 0.3,
    borderColor: Color.colorMain,
  },
  tagText: {
    color: Color.colorMain,
    fontSize: 12,
  },
  matchTagText: {
    color: Color.labelColorDarkPrimary,
    fontSize: 12,
  },
});

export default CardWithMatchPercentage;
