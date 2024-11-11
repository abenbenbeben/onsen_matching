import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { Color, FontSize, GlobalStyles } from "../GlobalStyles";
import { IconButton } from "react-native-paper";
import Modal from "react-native-modal";
import { GlobalData } from "../GlobalData";

const HomeSubHeader = ({
  matchCount = 0,
  sortTextFlag = false,
  filter,
  setFilter,
}) => {
  const options = GlobalData.filterOption;
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const sortModal = (data) => {
    if (data !== filter) {
      setFilter(data);
    }
    setSortModalVisible(!isSortModalVisible);
  };
  const controlModalVisible = () => {
    setSortModalVisible(!isSortModalVisible);
  };
  const saveModal = () => {
    console.log("pressSaveModal");
  };

  return (
    <View style={[styles.wrapper]}>
      <Modal
        isVisible={isSortModalVisible}
        onBackdropPress={controlModalVisible}
        style={styles.bottomModal} // モーダルを下部に配置
      >
        <View style={styles.modalContent}>
          <View style={styles.optionButton}>
            <Text style={styles.optionTitle}>並び替え</Text>
          </View>

          {/* 並び替えの選択肢 */}
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => sortModal(option.data)}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={[styles.modalContent, { marginTop: 20, marginBottom: 40 }]}
        >
          {/* キャンセルボタン */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={controlModalVisible}
          >
            <Text style={[styles.optionCancelText]}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={[styles.matchText, GlobalStyles.positionCenter]}>
        <Text style={[styles.defaultText]}>マッチ数：{matchCount}</Text>
      </View>
      {sortTextFlag && (
        <View style={[styles.flexDirectionRow, GlobalStyles.positionCenter]}>
          <TouchableOpacity
            onPress={controlModalVisible} // ここに実行したい関数を設定
            style={[styles.flexDirectionRow, GlobalStyles.positionCenter]}
          >
            <IconButton
              icon="menu-swap"
              iconColor={Color.labelColorDarkPrimary}
              selected="true"
              size={26}
              style={[
                { marginLeft: -6, marginRight: -10, marginVertical: -10 },
              ]}
            />
            {options
              .filter((option) => option.data === filter)
              .map((option, index) => (
                <Text
                  key={option.data}
                  style={[styles.defaultText, styles.sortText]}
                >
                  {option.text}
                </Text>
              ))}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={saveModal}
            style={[
              styles.flexDirectionRow,
              GlobalStyles.positionCenter,
              styles.conditionSaveWrapper,
            ]}
          >
            <IconButton
              icon="plus-circle-outline"
              iconColor={Color.labelColorDarkPrimary}
              selected="true"
              size={20}
              // onPress={fetchFavorite}
              style={[{ marginLeft: -6, marginRight: -6, marginVertical: -10 }]}
            />
            <Text style={[styles.defaultText, styles.conditionSave]}>
              条件保存
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: 10,
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
  sortText: {},
  conditionSaveWrapper: {
    paddingHorizontal: 2,
    marginHorizontal: 4,
    borderLeftWidth: 2,
    borderColor: Color.colorDarkMain,
  },
  conditionSave: {},
  flexDirectionRow: {
    flexDirection: "row",
  },

  //   モーダルスタイル
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0, // 画面下部にモーダルをぴったり配置
  },
  modalContent: {
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: 15,
    alignItems: "center",
  },
  optionButton: {
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Color.colorGray,
  },
  optionTitle: {
    fontSize: FontSize.bodySub,
    fontWeight: "200",
  },
  optionText: {
    fontSize: FontSize.bodySub,
    fontWeight: "500",
    color: Color.colorAzureBlue,
  },
  optionCancelText: {
    fontSize: FontSize.bodySub,
    fontWeight: "600",
    color: Color.colorAzureBlue,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "red",
  },
});

export default HomeSubHeader;
