import * as React from "react";
import { StyleSheet, Animated, Text, Pressable } from "react-native";
import { Color, FontSize } from "../GlobalStyles";
import { IconButton } from "react-native-paper";

const ModalHeaderScreen = ({
  headerText = "スーパー銭湯マッチング",
  isConditionSetting,
  setIsConditionSetting,
  deleteTextLabel = "削除",
}) => {
  const headerHeight = 100;
  const onPress_cancelButton = () => {
    setIsConditionSetting(false);
  };

  return (
    <Animated.View style={[styles.wrapper, { height: headerHeight }]}>
      <Pressable
        onPress={() => onPress_cancelButton()}
        style={[styles.closeButtonWrapper]}
      >
        <IconButton
          icon={"window-close"}
          iconColor={Color.labelColorDarkPrimary}
          selected="true"
          size={30}
          style={[styles.closeButton]}
        />
      </Pressable>
      <Text style={[styles.headerText]}>{headerText}</Text>
      {/* <Pressable
        style={styles.deleteButton}
        // onPress={() => onPress_cancelButton()}
      >
        <Text style={styles.deleteButtonText}>{deleteTextLabel}</Text>
      </Pressable> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Color.colorMain,
    alignItems: "center",
    flexDirection: "row",
    zIndex: 10,
  },
  headerText: {
    width: "100%",
    textAlign: "center",
    fontSize: FontSize.bodySub,
    fontWeight: "500",
    color: Color.labelColorDarkPrimary,
    position: "absolute",
    bottom: 16, // 下から5の位置に配置
    zIndex: 10,
  },
  closeButtonWrapper: {
    bottom: 3,
    left: 10,
    position: "absolute",
    zIndex: 20,
  },
  closeButton: {
    margin: 0,
  },
  deleteButton: {
    position: "absolute",
    right: 16,
    bottom: 16, // 下から5の位置に配置
  },
  deleteButtonText: {
    fontSize: FontSize.bodySub,
    fontWeight: "500",
    color: Color.labelColorDarkPrimary,
  },
});

export default ModalHeaderScreen;
