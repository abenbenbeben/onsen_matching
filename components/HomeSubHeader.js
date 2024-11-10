import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color, FontSize, GlobalStyles } from "../GlobalStyles";

const HomeSubHeader = ({ matchCount = 0, sortTextFlag = false }) => {
  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.matchText, GlobalStyles.positionCenter]}>
        <Text style={[styles.defaultText]}>マッチ数：{matchCount}</Text>
      </View>
      {sortTextFlag && (
        <View style={[styles.sortWrapper]}>
          <Text style={[styles.defaultText, styles.sortText]}>
            距離マッチ度順
          </Text>
          <Text style={[styles.defaultText, styles.conditionSave]}>
            条件保存
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    backgroundColor: Color.colorMain,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  matchText: {
    height: "100%",
  },
  sortWrapper: { flexDirection: "row" },
  defaultText: {
    color: Color.labelColorDarkPrimary,
    fontSize: FontSize.bodySub,
    fontWeight: "400",
  },
  sortText: {
    paddingHorizontal: 2,
    marginHorizontal: 2,
  },
  conditionSave: {
    paddingHorizontal: 2,
    marginHorizontal: 2,
  },
});

export default HomeSubHeader;
