import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import FormContainer3 from "../components/FormContainer3";
import MatchingButtonContainer from "../components/MatchingButtonContainer";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalData } from "../GlobalData";
import * as Location from "expo-location";
import { getCachedOrNewLocation } from "../components/getCurrentLocation ";
import { fetchMatchingData } from "../components/fetchMatchingData";

const MatchingContainer = ({ data, containerHeight }) => {
  const navigation = useNavigation();
  const matchingItemsFeature = data?.matchingItemsFeature || [];
  const matchingItemsPurpose = data?.matchingItemsPurpose || [];
  console.log(matchingItemsPurpose);
  const [selecteddata_feature, setSelecteddata_feature] = useState(
    data?.selecteddata_feature || []
  );
  const [selectedButtons, setSelectedButtons] = useState(
    data?.selectedButtons_feature || []
  );
  const [selectedButtons_purpose, setSelectedButtons_purpose] = useState(
    data?.selectedButtons_purpose || []
  );
  const [selecteddata_purpose, setSelecteddata_purpose] = useState(
    data?.selecteddata_purpose || []
  );
  const [selecteddata_purposeData, setSelecteddata_purposeData] = useState(
    data?.selectedButtons_purposeName || []
  );
  const [conditionData, setConditionData] = useState([]);
  const [saveConditionData, setSaveConditionData] = useState([]);
  const [matchingItems, setMatchingItems] = useState([]);
  const flatListRef = useRef(null); // FlatListの参照
  const screenWidth = Dimensions.get("window").width;
  const [activeTab, setActiveTab] = useState(0); // 現在のタブ

  // タブをタップした際の処理
  const handleTabPress = (index) => {
    setActiveTab(index);
    flatListRef.current.scrollToIndex({ index });
  };

  // ページをスワイプした際の処理
  const handleScroll = (event) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setActiveTab(pageIndex);
  };

  const handleButtonToggle = (buttonIndex, buttondata) => {
    if (selectedButtons.includes(buttonIndex)) {
      setSelectedButtons(
        selectedButtons.filter((index) => index !== buttonIndex)
      );
      setSelecteddata_feature(
        selecteddata_feature.filter((index) => index !== buttondata)
      );
    } else if (selectedButtons.length < 4) {
      setSelectedButtons([...selectedButtons, buttonIndex]);
      setSelecteddata_feature([...selecteddata_feature, buttondata]);
    } else {
      Alert.alert("注意", "特徴は4つ以上選択できません");
    }
  };

  const handleButtonToggle_purpose = (
    buttonIndex,
    buttondata,
    pre_selecteddata_purposeData
  ) => {
    if (selectedButtons_purpose.includes(buttonIndex)) {
      setSelectedButtons_purpose(
        selectedButtons_purpose.filter((index) => index !== buttonIndex)
      );
      setSelecteddata_purpose(
        selecteddata_purpose.filter((index) => index !== buttondata)
      );
      setSelecteddata_purposeData([]);
    } else if (selectedButtons_purpose.length < 1) {
      setSelectedButtons_purpose([...selectedButtons_purpose, buttonIndex]);
      setSelecteddata_purpose([...selecteddata_purpose, buttondata]);
      setSelecteddata_purposeData([pre_selecteddata_purposeData]);
    } else {
      Alert.alert("注意", "目的は1つ以上選択できません");
    }
  };
  const tagNameList = GlobalData.tagNameList;
  const tagNameListPurpose = GlobalData.tagNameListPurpose;

  const fetchAsData = async () => {
    // 既存のデータを取得
    const storedData = await AsyncStorage.getItem("conditionData");
    const parsedDatas = storedData ? JSON.parse(storedData) : [];
    setConditionData(parsedDatas);
    console.log(conditionData);
    const updatedData = parsedDatas.map((parsedData) => {
      // idArray を名前付きオブジェクトに変換
      const updatedIdArray = parsedData.idArray.map((id) => {
        const matchFeature = matchingItemsFeature.find(
          (feature) => feature.id === id
        );
        const matchPurpose = matchingItemsPurpose.find(
          (feature) => feature.id === id
        );

        const dataName = matchFeature
          ? matchFeature.data[0]
          : matchPurpose.data_purpose;
        const data = matchFeature ? matchFeature.data[0] : matchPurpose.data;

        return {
          id: id,
          dataName: dataName,
          data: data,
          tagName: tagNameList[data]
            ? tagNameList[data]
            : tagNameListPurpose[data],
        };
      });

      return {
        ...parsedData,
        idArray: updatedIdArray,
      };
    });

    console.log(JSON.stringify(updatedData));
    setSaveConditionData(updatedData);
  };
  const fetch_matchingdata = async () => {
    try {
      // setLoadingMessage("現在地取得中");
      let point2 = null;
      point2 = await getCachedOrNewLocation(async () => {
        return await Location.getCurrentPositionAsync({});
      });
      if (!point2) {
        check_settings();
        //point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
      }
      //point2 = { latitude:35.86542717384397, longitude: 139.51970407189944  };//さいたま市
      //point2 = { latitude:35.89189813203356 , longitude: 139.85816944009025 };
      //point2 = { latitude:35.87146725131986, longitude: 139.18089139695007 };//飯能
      //point2 = { latitude:36.01938773645486, longitude: 139.2840038132889 };//
      point2 = { latitude: 35.443018794602715, longitude: 139.3872117068581 }; //海老名
      // setLoadingMessage("マッチング中");
      // 1次元配列に変換して結合
      const mergedArrayArray = saveConditionData.map((item) => {
        const concatenatedData = item.idArray.flatMap((idItem) => {
          // data が配列の場合はそのまま展開、文字列の場合は配列に変換
          return Array.isArray(idItem.data) ? idItem.data : [idItem.data];
        });

        return {
          concatenatedData, // idArray の data を結合した配列
          conditionId: item.conditionId, // conditionId
        };
      });
      console.log(mergedArrayArray);
      const matchingDataArray = await fetchMatchingData(
        point2,
        mergedArrayArray
      );
      setMatchingItems(matchingDataArray);

      // setLoading(false); // データ読み込みが完了したらローディング状態を解除
    } catch (e) {
      console.error("Error fetching data: ", e);
    }
  };

  useEffect(() => {
    fetchAsData();
    fetch_matchingdata();
  }, []);

  const tabs = [
    {
      key: "search",
      title: "探す",
      content: (
        <>
          <ScrollView style={{ marginBottom: containerHeight }}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>目的から</Text>
            </View>
            <FlatList
              data={matchingItemsPurpose}
              numColumns={1}
              keyExtractor={(item) => item.id.toString()}
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
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>特徴から</Text>
            </View>
            <FlatList
              data={matchingItemsFeature}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
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
          </ScrollView>
          {/* フォーム */}
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
      ),
    },
    {
      key: "saveCondition",
      title: "保存条件",
      content: (
        <FlatList
          data={saveConditionData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.saveConditionCardTitle}>
                {item.editConditionText
                  ? `${item.editConditionText}の周辺施設`
                  : "未設定"}
                {/* タイトルが空の場合は "未設定" を表示 */}
              </Text>
              <View style={styles.tagContainer}>
                {item.idArray.map((tag) => (
                  <View style={[styles.tag, styles.matchTag]} key={tag.id}>
                    <Text style={styles.tagText}>{tag.tagName}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          contentContainerStyle={styles.saveConditionCardContainer}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* タブバー */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handleTabPress(index)}
            style={[
              styles.tabButton,
              activeTab === index && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === index && styles.activeTabButtonText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* タブのコンテンツ */}
      <FlatList
        ref={flatListRef}
        data={tabs}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={{ width: screenWidth }}>{item.content}</View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.colorWhitesmoke_100 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tabButton: { padding: 10 },
  tabButtonText: { fontSize: 16, color: "#888" },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: "#007BFF" },
  activeTabButtonText: { color: "#007BFF", fontWeight: "bold" },
  // タイトル
  titleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  titleText: {
    fontSize: FontSize.body,
    fontWeight: "400",
  },
  // タイトル

  flatlistContent: { alignItems: "center", paddingBottom: 10 },
  flatlist: {
    flex: 1,
    width: "100%",
  },

  saveConditionCardContainer: {},
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: Color.colorWhitesmoke_100,
  },
  saveConditionCardTitle: {
    fontSize: FontSize.bodySub,
    fontWeight: "500",
    marginBottom: 8,
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

export default MatchingContainer;
