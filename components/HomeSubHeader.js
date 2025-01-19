import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Alert,
} from "react-native";
import { Color, FontSize, GlobalStyles } from "../GlobalStyles";
import { IconButton } from "react-native-paper";
import Modal from "react-native-modal";
import { GlobalData } from "../GlobalData";
import DefaultButton from "./DefaultButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

const HomeSubHeader = ({
  matchCount = 0,
  sortTextFlag = false,
  filter,
  setFilter,
  match_array_with_id = [],
}) => {
  const maxLength = 10; //最大文字数
  const options = GlobalData.filterOption;
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isChoiceSaveModalVisible, setChoiceSaveModalVisible] = useState(false);
  const [editConditionText, setEditConditionText] = useState("");
  const [isSaveConditionModalVisible, setSaveConditionModalVisible] =
    useState(false);
  const [conditionData, setConditionData] = useState([]);
  const [isExistConditionData, setIsExistConditionData] = useState(false);
  const [pendingModal, setPendingModal] = useState(null);
  const [pendingConditionId, setPendingConditionId] = useState(null);

  let idArray = [];
  if (match_array_with_id.length > 0) {
    idArray = match_array_with_id.map((item) => item.id);
  }

  const sortModal = (data) => {
    if (data !== filter) {
      setFilter(data);
    }
    setSortModalVisible(!isSortModalVisible);
  };
  const controlSortModalVisible = () => {
    setSortModalVisible(!isSortModalVisible);
  };
  const controlSaveConditionModal = () => {
    if (conditionData.length === 0) {
      controlSaveConditionModalVisible();
    } else {
      controlChoiceModalVisible();
    }
  };
  const controlChoiceModalVisible = () => {
    setChoiceSaveModalVisible(!isChoiceSaveModalVisible);
  };
  const controlSaveConditionModalVisible = () => {
    setSaveConditionModalVisible(true);
  };
  const closeSaveConditionModal = () => {
    setSaveConditionModalVisible(false);
  };
  const closeChoiceModalVisible = () => {
    setChoiceSaveModalVisible(false);
  };

  const openSaveConditionModal = () => {
    setChoiceSaveModalVisible(false);
    setPendingModal("saveCondition");
  };
  const fetchData = async () => {
    // 既存のデータを取得
    const storedData = await AsyncStorage.getItem("conditionData");
    const parsedData = storedData ? JSON.parse(storedData) : [];
    setConditionData(parsedData);

    console.log("conditionData");
    console.log(conditionData);

    const exists = parsedData.some(
      (condition) =>
        JSON.stringify(condition.idArray) === JSON.stringify(idArray)
    );
    setIsExistConditionData(exists);
  };
  const handleSaveCondition = async (inputConditionId = null) => {
    const newCondition = { editConditionText, idArray, conditionId: uuid.v4() };
    try {
      const updatedConditionData = conditionData.map((item) => {
        if (item.conditionId === inputConditionId) {
          return {
            ...item,
            editConditionText: editConditionText, // データを変更
            idArray: idArray,
          };
        }
        return item; // 該当しない場合はそのまま返す
      });
      // 存在しない場合、新しいデータを追加
      if (inputConditionId === null) {
        updatedConditionData.push(newCondition);
      }
      await AsyncStorage.setItem(
        "conditionData",
        JSON.stringify(updatedConditionData)
      );
      await fetchData();
      Alert.alert("保存が完了しました");
      console.log("新しいデータが保存されました:", newCondition);
      closeSaveConditionModal();
    } catch (error) {
      Alert.alert("保存に失敗しました。", "再度保存してください");
      console.error("データの保存中にエラーが発生しました:", error);
    }
  };

  useEffect(() => {
    fetchData(); // 非同期関数を呼び出す
  }, []); // match_array_with_id を依存配列に追加

  return (
    <>
      <Modal
        isVisible={isSortModalVisible}
        onBackdropPress={controlSortModalVisible}
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
            onPress={controlSortModalVisible}
          >
            <Text style={[styles.optionCancelText]}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 条件保存前の選択肢 */}

      <Modal
        isVisible={isChoiceSaveModalVisible}
        transparent
        onBackdropPress={closeChoiceModalVisible}
        style={styles.bottomModal} // モーダルを下部に配置
        onModalHide={() => {
          if (pendingModal === "saveCondition") {
            setSaveConditionModalVisible(true);
            setPendingModal(null);
          }
        }}
      >
        <View style={styles.modalContent}>
          {/* 並び替えの選択肢 */}
          {conditionData.length < 3 && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                openSaveConditionModal();
              }}
            >
              <Text style={styles.optionText}>新規保存</Text>
            </TouchableOpacity>
          )}
          {conditionData.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                setEditConditionText(option.editConditionText);
                setPendingConditionId(option.conditionId);
                setChoiceSaveModalVisible(false);
                setPendingModal("saveCondition");
              }}
            >
              <Text style={styles.optionText}>
                {option.editConditionText}に上書き
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={[styles.modalContent, { marginTop: 20, marginBottom: 40 }]}
        >
          {/* キャンセルボタン */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={closeChoiceModalVisible}
          >
            <Text style={[styles.optionCancelText]}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={isSaveConditionModalVisible}
        transparent
        onBackdropPress={closeSaveConditionModal}
        style={styles.centerModal} // モーダルを中央に配置
        onModalHide={() => {
          if (editConditionText) {
            setEditConditionText("");
            setPendingConditionId(null);
          }
        }}
      >
        <View style={styles.saveModalContent}>
          <TouchableOpacity
            style={[styles.saveModalCancelButton, GlobalStyles.positionCenter]}
            onPress={closeSaveConditionModal}
          >
            <IconButton
              icon="window-close"
              iconColor={Color.colorDarkGray}
              selected="true"
              size={26}
              style={[
                {
                  marginLeft: -6,
                  marginRight: 0,
                  marginBottom: -8,
                  marginTop: -8,
                },
              ]}
            />
          </TouchableOpacity>
          <View style={styles.saveModalTitleContainer}>
            <Text style={styles.saveModalTitle}>この検索条件を保存します</Text>
          </View>

          <View style={[styles.editConditionNameContainer]}>
            <IconButton
              icon="pencil"
              iconColor={Color.colorDarkGray}
              selected="true"
              size={20}
              style={[
                {
                  marginLeft: -6,
                  marginRight: 0,
                  marginBottom: -8,
                  marginTop: -8,
                },
              ]}
            />
            <Text style={styles.editConditionNameTitle}>
              検索条件に名前をつける
            </Text>
          </View>
          <View style={styles.editConditionNameInputContainer}>
            <View style={styles.editConditionNameInput}>
              <TextInput
                style={styles.textInput}
                value={editConditionText}
                onChangeText={(value) => setEditConditionText(value)}
                placeholder="文字を入力してください"
                maxLength={maxLength}
              />
            </View>
            <Text style={styles.charCount}>
              {editConditionText.length} / {maxLength}
            </Text>
          </View>
          {/* <View style={styles.editConditionNameContainer}>
            <Text style={styles.editConditionNameTitle}>
              検索条件にアイコンを設定
            </Text>
          </View> */}
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <DefaultButton
              label="保存"
              onPress={() => handleSaveCondition(pendingConditionId)}
              isPressable={editConditionText.length === 0}
            />
          </View>
        </View>
      </Modal>

      <View style={[styles.wrapper]}>
        {sortTextFlag && (
          <View
            style={[
              styles.flexDirectionRow,
              GlobalStyles.positionCenter,
              { width: "100%", justifyContent: "flex-end" },
            ]}
          >
            <TouchableOpacity
              onPress={() => {}}
              disabled={false} // クリックを無効化する条件
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
                style={[
                  { marginLeft: -6, marginRight: -6, marginVertical: -10 },
                ]}
              />
              <Text style={[styles.defaultText, styles.conditionSave]}>
                基準：100%
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={controlSaveConditionModal}
              disabled={isExistConditionData} // クリックを無効化する条件
              style={[
                styles.flexDirectionRow,
                GlobalStyles.positionCenter,
                styles.conditionSaveWrapper,
                isExistConditionData && { opacity: 0.5 }, // 無効時のスタイル
              ]}
            >
              <IconButton
                icon="plus-circle-outline"
                iconColor={Color.labelColorDarkPrimary}
                selected="true"
                size={20}
                style={[
                  { marginLeft: -6, marginRight: -6, marginVertical: -10 },
                ]}
              />
              <Text style={[styles.defaultText, styles.conditionSave]}>
                条件保存
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={[styles.wrapper]}>
        <View style={[styles.matchText, GlobalStyles.positionCenter]}>
          <Text style={[styles.defaultText]}>マッチ数：{matchCount}</Text>
        </View>
        {sortTextFlag && (
          <View style={[styles.flexDirectionRow, GlobalStyles.positionCenter]}>
            <TouchableOpacity
              onPress={controlSortModalVisible} // ここに実行したい関数を設定
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
          </View>
        )}
      </View>
    </>
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
  centerModal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
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
  // 条件保存モーダルのスタイル
  saveModalCancelButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    zIndex: 10,
  },
  saveModalContent: {
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: 8,
    width: "90%",
    // alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },

  saveModalTitleContainer: {
    paddingVertical: 20,
    width: "100%",
  },
  saveModalTitle: {
    marginVertical: 8,
    fontSize: FontSize.body,
  },
  editConditionNameContainer: {
    textAlign: "left",
    flexDirection: "row",
  },
  editConditionNameTitle: {
    fontSize: FontSize.bodySub,
  },
  editConditionNameInputContainer: {
    marginVertical: 12,
    width: "100%",
  },
  editConditionNameInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    // position: "relative",
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },
  charCount: {
    alignSelf: "flex-end",
    marginVertical: 4,
    fontSize: FontSize.caption,
    color: "#888",
  },
});

export default HomeSubHeader;
