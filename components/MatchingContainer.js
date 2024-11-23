import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import FormContainer3 from "../components/FormContainer3";
import MatchingButtonContainer from "../components/MatchingButtonContainer";
import HeaderScreen from "../components/HeaderScreen";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, ScrollPager, TabBar } from "react-native-tab-view";

const MatchingContainer = ({ data, containerHeight }) => {
  const navigation = useNavigation();
  const matchingItemsFeature = data?.matchingItemsFeature;
  const matchingItemsPurpose = data?.matchingItemsPurpose;
  const [selecteddata_feature, setSelecteddata_feature] = useState(
    data?.selecteddata_feature
  );
  const [selectedButtons, setSelectedButtons] = useState(
    data?.selectedButtons_feature
  );
  const [selectedButtons_purpose, setSelectedButtons_purpose] = useState(
    data?.selectedButtons_purpose
  );
  const [selecteddata_purpose, setSelecteddata_purpose] = useState(
    data?.selecteddata_purpose
  );
  const [selecteddata_purposeData, setSelecteddata_purposeData] = useState(
    data?.selectedButtons_purposeName
  );

  const [activeTab, setActiveTab] = useState(1); // タブの管理

  //   タブビュー
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "Notification" },
    { key: "second", title: "Information" },
  ]);

  // タブビューここまで

  const handleButtonToggle = (buttonIndex, buttondata) => {
    if (selectedButtons.includes(buttonIndex)) {
      // すでに選択されている場合、選択を解除
      setSelectedButtons(
        selectedButtons.filter((index) => index !== buttonIndex)
      );
      setSelecteddata_feature(
        selecteddata_feature.filter((index) => index !== buttondata)
      );
    } else if (selectedButtons.length < 4) {
      // 2つ以上選択されていない場合、選択を許可
      setSelectedButtons([...selectedButtons, buttonIndex]);
      setSelecteddata_feature([...selecteddata_feature, buttondata]);
    } else {
      // 2つ以上のボタンが選択された場合、アラートを表示
      Alert.alert("注意", "特徴は4つ以上選択できません");
    }
  };

  const handleButtonToggle_purpose = (
    buttonIndex,
    buttondata,
    pre_selecteddata_purposeData
  ) => {
    if (selectedButtons_purpose.includes(buttonIndex)) {
      // すでに選択されている場合、選択を解除
      setSelectedButtons_purpose(
        selectedButtons_purpose.filter((index) => index !== buttonIndex)
      );
      setSelecteddata_purpose(
        selecteddata_purpose.filter((index) => index !== buttondata)
      );
      setSelecteddata_purposeData([]);
    } else if (selectedButtons_purpose.length < 1) {
      // 2つ以上選択されていない場合、選択を許可
      setSelectedButtons_purpose([...selectedButtons_purpose, buttonIndex]);
      setSelecteddata_purpose([...selecteddata_purpose, buttondata]);
      setSelecteddata_purposeData([pre_selecteddata_purposeData]);
    } else {
      // 2つ以上のボタンが選択された場合、アラートを表示
      Alert.alert("注意", "目的は1つ以上選択できません");
    }
    console.log(selecteddata_purposeData);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 1 ? styles.tabButtonActive : null,
            ]}
            onPress={() => setActiveTab(1)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 1 ? styles.tabButtonTextActive : null,
              ]}
            >
              特徴から
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 2 ? styles.tabButtonActive : null,
            ]}
            onPress={() => setActiveTab(2)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 2 ? styles.tabButtonTextActive : null,
              ]}
            >
              目的から
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === 1 && (
          <>
            <FlatList
              data={matchingItemsFeature}
              numColumns={2} // 2列で表示
              keyExtractor={(item) => item.id}
              style={styles.flatlist}
              contentContainerStyle={styles.flatlistContent}
              renderItem={({ item }) => (
                <MatchingButtonContainer
                  value={item.sentence}
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  onToggle={() => handleButtonToggle(item.id, item.data)}
                  selected={selectedButtons.includes(item.id)}
                  height={88}
                  width={156}
                />
              )}
            />
          </>
        )}
        {activeTab === 2 && (
          <>
            <FlatList
              data={matchingItemsPurpose}
              numColumns={1} // 2列で表示
              keyExtractor={(item) => item.id}
              style={styles.flatlist}
              contentContainerStyle={styles.flatlistContent}
              renderItem={({ item }) => (
                <MatchingButtonContainer
                  value={item.sentence}
                  beforeImage={item.beforeImage}
                  afterImage={item.afterImage}
                  onToggle={() =>
                    handleButtonToggle_purpose(
                      item.id,
                      item.data,
                      item.data_purpose
                    )
                  }
                  selected={selectedButtons_purpose.includes(item.id)}
                  height={132}
                  width={328}
                />
              )}
            />
          </>
        )}
        <FormContainer3
          navigation={navigation}
          selectednum={selectedButtons.length}
          data_feature={selecteddata_feature}
          data_purpose={selecteddata_purpose}
          selectedButtons_feature={selectedButtons}
          selectedButtons_purpose={selectedButtons_purpose}
          selectedButtons_purposeName={selecteddata_purposeData}
          matchingItemsFeature={matchingItemsFeature}
          matchingItemsPurpose={matchingItemsPurpose}
          maxnum={4}
          containerHeight={containerHeight}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlistContent: {
    alignItems: "center",
    paddingBottom: 10,
  },
  flatlist: {
    flex: 1,
    width: "100%",
    marginBottom: 72,
  },
  //タブのスタイル
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  tabButton: {
    borderBottomWidth: 2,
    borderColor: "transparent", // 透明な境界線
    paddingBottom: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  tabButtonText: {
    color: Color.colorGrayText,
    fontSize: FontSize.body,
  },
  tabButtonActive: {
    borderBottomWidth: 1,
    paddingBottom: 6, // アクティブなタブは少し境界線に近づける
    marginBottom: 2,

    borderColor: "#007BFF",
  },
  tabButtonTextActive: {
    color: "#007BFF", // アクティブなタブのテキストも青色
    fontWeight: "bold",
  },
  //タブのスタイル終了
});

export default MatchingContainer;
