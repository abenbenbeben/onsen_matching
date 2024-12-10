import * as React from "react";
import { StyleSheet, Animated, Text, Pressable } from "react-native";
import { Color, FontSize } from "../GlobalStyles";
import { IconButton } from "react-native-paper";

const ModalHeaderScreen = ({
  headerText = "スーパー銭湯マッチング",
  headerHeight = 90,
  onPress_cancelButton = () => {},
  deleteTextLabel = "削除",
}) => {
  return (
    <Animated.View style={[styles.wrapper, { height: headerHeight }]}>
      <IconButton
        icon={"window-close"}
        iconColor={Color.labelColorDarkPrimary}
        selected="true"
        size={30}
        style={[styles.closeButton]}
      />
      <Text style={[styles.headerText]}>{headerText}</Text>
      <Pressable
        style={styles.deleteButton}
        onPress={() => onPress_cancelButton()}
      >
        <Text style={styles.deleteButtonText}>{deleteTextLabel}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Color.colorMain,
    alignItems: "center",
    flexDirection: "row",
  },
  headerText: {
    width: "100%",
    textAlign: "center",
    fontSize: FontSize.bodySub,
    fontWeight: "500",
    color: Color.labelColorDarkPrimary,
    position: "absolute",
    bottom: 16, // 下から5の位置に配置
  },
  closeButton: {
    position: "absolute",
    bottom: 3, // 下から5の位置に配置
    left: 10,
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
