import * as React from "react";
import { useContext } from "react";
import { StyleSheet, View, Text, Alert, PixelRatio } from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import Button from "./Button";
import { DataContext } from "../DataContext";
import { GlobalData } from "../GlobalData";
import { GlobalStyles } from "../GlobalStyles";

const FormContainer3 = ({
  navigation,
  selectednum,
  data_feature,
  data_purpose,
  selectedButtons_feature,
  selectedButtons_purpose,
  selectedButtons_purposeName = [],
  maxnum,
  matchingItemsFeature,
  matchingItemsPurpose,
  containerHeight,
}) => {
  const { setData } = useContext(DataContext);
  const dynamicStyles = styles(containerHeight);
  const tagNameList = GlobalData.tagNameList;
  const tagNameListPurpose = GlobalData.tagNameListPurpose;
  //  const navigation = useNavigation();

  // タグをフィルタリングして取得
  let filteredTags;
  if (data_feature) {
    filteredTags = data_feature.flat();
  }
  // 1次元配列に変換して結合
  const mergedArray = [...data_feature.flat(), ...data_purpose.flat()];
  const uniqueArray = [...new Set(mergedArray)];
  const idMergedArray = [
    ...data_feature.flat(),
    ...selectedButtons_purposeName,
  ];
  const uniqueArrayWithId = idMergedArray.map((item) => {
    const match_feature = matchingItemsFeature.find((feature) =>
      feature.data.includes(item)
    );
    const match_purpose = matchingItemsPurpose.find((feature) =>
      feature.data_purpose.includes(item)
    );
    return {
      data: item,
      id: match_feature ? match_feature.id : match_purpose.id,
    };
  });
  let purposeTags = selectedButtons_purposeName;
  const handleSaveButtonPress = () => {
    if (uniqueArray.length === 0) {
      // selectednum が 0 の場合にアラートを表示
      Alert.alert("注意", "選択されているアイテムがありません。");
    } else {
      setData({
        selecteddata_feature: data_feature,
        selecteddata_purpose: data_purpose,
        selectedButtons_feature,
        selectedButtons_purpose,
        selectedButtons_purposeName,
        matchingItemsFeature,
        matchingItemsPurpose,
      });
      // selectednum が 0 でない場合に画面遷移
      navigation.replace("Root", {
        screen: "HOME",
        params: {
          data: uniqueArray,
          data_withId: uniqueArrayWithId,
          matchingItems: matchingItemsFeature,
        },
      });
    }
  };

  return (
    <View style={dynamicStyles.view}>
      <View style={dynamicStyles.view1}>
        {filteredTags.length === 0 && purposeTags.length === 0 && (
          <View style={[{ width: 240 }]}>
            <Text
              style={[
                GlobalStyles.positionCenter,
                dynamicStyles.noConditionText,
              ]}
            >
              条件が選択されていません
            </Text>
          </View>
        )}

        <View style={dynamicStyles.tagContainer}>
          {/* data_feature からのタグ表示 */}
          {filteredTags.map((tagKey) => (
            <View
              key={tagKey}
              style={[dynamicStyles.tag, dynamicStyles.matchTag]}
            >
              <Text style={[dynamicStyles.tagText, dynamicStyles.matchTag]}>
                {tagNameList[tagKey]}
              </Text>
            </View>
          ))}

          {/* selecteddata_purposeData からのタグ表示 */}
          {purposeTags.map((tagKey) => (
            <View
              key={tagKey}
              style={[
                dynamicStyles.tag,
                dynamicStyles.purposeTag, // タグの背景色を変える
              ]}
            >
              <Text
                style={[
                  dynamicStyles.purposeTagText, // テキスト色を変える
                ]}
              >
                {tagNameListPurpose[tagKey]}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Button
        style={[dynamicStyles.pressable, GlobalStyles.positionCenter]}
        label="探す"
        onPress={handleSaveButtonPress}
      />
    </View>
  );
};

const styles = (containerHeight) =>
  StyleSheet.create({
    view: {
      bottom: 0,
      backgroundColor: "white",
      height: containerHeight,
      width: "100%",
      position: "absolute",
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    view1: {
      marginTop: 8,
      marginLeft: 16,
      width: 240,
      height: 56,
      // overflow: "hidden",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    pressable: {
      right: 16,
      height: 56,
      marginTop: 8,
      overflow: "hidden",
      position: "absolute",
    },
    text2: {
      left: 40,
      fontSize: 24 / PixelRatio.getFontScale(),
    },

    noConditionText: {
      textAlign: "center",
      color: Color.colorGrayText,
      fontSize: FontSize.bodySub,
    },

    // tag
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 5,
      justifyContent: "center",
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
      fontSize: FontSize.caption,
    },
    purposeTag: {
      backgroundColor: "#b2ebf2", // matchTag の色に近い色
    },
    purposeTagText: {
      color: "#00695c", // tagText の色に近い色
      fontSize: FontSize.caption,
    },
  });

export default FormContainer3;
