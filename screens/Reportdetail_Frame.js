import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  PixelRatio,
} from "react-native";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebaseconfig";
import { GlobalData } from "../GlobalData";
import { GlobalStyles } from "../GlobalStyles";
import DefaultButton from "../components/defaultButton";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

const db = getFirestore(app);

const Reportdetail_Frame = ({ navigation, route }) => {
  const data_id = route.params.data_id;
  const data = route.params.data;
  const category = route.params.category;
  const defaultCategory = category === "営業時間" ? { 営業時間: true } : {};
  const [selectedItems, setSelectedItems] = useState(defaultCategory);
  const [reportDetails, setReportDetails] = useState("");
  const [isBusinessHoursChecked, setIsBusinessHoursChecked] = useState(false);
  const [businessHours, setBusinessHours] = useState(data.periods);
  // 時間と分を分けたステートを作成
  const defaultPeriods = Object.keys(data.periods).reduce((acc, day) => {
    acc[day] = {
      openHH: String(data.periods[day].open).padStart(4, "0").slice(0, 2),
      openMM: String(data.periods[day].open).padStart(4, "0").slice(2, 4),
      closeHH: String(data.periods[day].close).padStart(4, "0").slice(0, 2),
      closeMM: String(data.periods[day].close).padStart(4, "0").slice(2, 4),
    };
    return acc;
  }, {});
  console.log("==========================");
  console.log(defaultPeriods);
  console.log("==========================");
  const [localHours, setLocalHours] = useState(defaultPeriods);

  const items = [
    "施設設備",
    "営業時間",
    "料金",
    "その他",
    // 他に必要な項目を追加
  ];
  //matchingItems.filter(item => item.distance <= 5 && item.score > 50);

  const handleCheckboxChange = (item) => {
    let instance = selectedItems;
    if (selectedItems[item]) {
      instance[item] = false;
    } else {
      Object.keys(instance).forEach((key) => {
        instance[key] = false;
      });
      instance = { ...selectedItems, [item]: !selectedItems[item] };
    }

    let filteredInstance = Object.keys(instance).reduce((newObj, key) => {
      if (instance[key] === true) {
        newObj[key] = true;
      }
      return newObj;
    }, {});
    setSelectedItems(filteredInstance);
  };

  const handleBusinessHoursChange = (day, type, value) => {
    setBusinessHours((prevHours) => ({
      ...prevHours,
      [day]: { ...prevHours[day], [type]: value },
    }));
  };

  const handleFullHourCheckboxChange = (day) => {
    if (businessHours[day].open === 0 && businessHours[day].close === 0) {
      if (
        defaultPeriods[day].openHH + defaultPeriods[day].openMM === "null" ||
        defaultPeriods[day].openHH + defaultPeriods[day].openMM === "0000"
      ) {
        setBusinessHours((prevHours) => ({
          ...prevHours,
          [day]: { ...prevHours[day], ["open"]: 1, ["close"]: 1 },
        }));
        setLocalHours((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            openHH: "",
            openMM: "",
            closeHH: "",
            closeMM: "",
          },
        }));
      } else {
        const opentime = parseInt(
          defaultPeriods[day].openHH + defaultPeriods[day].openMM,
          10
        );
        const closetime = parseInt(
          defaultPeriods[day].closeHH + defaultPeriods[day].closeMM,
          10
        );
        setBusinessHours((prevHours) => ({
          ...prevHours,
          [day]: {
            ...prevHours[day],
            ["open"]: opentime,
            ["close"]: closetime,
          },
        }));
        setLocalHours((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            openHH: defaultPeriods[day].openHH,
            openMM: defaultPeriods[day].openMM,
            closeHH: defaultPeriods[day].closeHH,
            closeMM: defaultPeriods[day].closeMM,
          },
        }));
      }
    } else {
      setBusinessHours((prevHours) => ({
        ...prevHours,
        [day]: {
          ...prevHours[day],
          ["open"]: 0,
          ["close"]: 0,
        },
      }));
    }
  };

  const handleCloseHourCheckboxChange = (day) => {
    if (businessHours[day].open === null && businessHours[day].close === null) {
      if (
        defaultPeriods[day].openHH + defaultPeriods[day].openMM === "null" ||
        defaultPeriods[day].openHH + defaultPeriods[day].openMM === "0000"
      ) {
        setBusinessHours((prevHours) => ({
          ...prevHours,
          [day]: { ...prevHours[day], ["open"]: 1, ["close"]: 1 },
        }));
        setLocalHours((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            openHH: "",
            openMM: "",
            closeHH: "",
            closeMM: "",
          },
        }));
      } else {
        const opentime = parseInt(
          defaultPeriods[day].openHH + defaultPeriods[day].openMM,
          10
        );
        const closetime = parseInt(
          defaultPeriods[day].closeHH + defaultPeriods[day].closeMM,
          10
        );
        setBusinessHours((prevHours) => ({
          ...prevHours,
          [day]: {
            ...prevHours[day],
            ["open"]: opentime,
            ["close"]: closetime,
          },
        }));
        setLocalHours((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            openHH: defaultPeriods[day].openHH,
            openMM: defaultPeriods[day].openMM,
            closeHH: defaultPeriods[day].closeHH,
            closeMM: defaultPeriods[day].closeMM,
          },
        }));
      }
    } else {
      setBusinessHours((prevHours) => ({
        ...prevHours,
        [day]: {
          ...prevHours[day],
          ["open"]: null,
          ["close"]: null,
        },
      }));
    }
  };

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
      return true;
    }

    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 === null ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  };

  const submitReport = () => {
    const additems = async () => {
      try {
        const detail = selectedItems["営業時間"]
          ? { after: businessHours, before: data.periods }
          : reportDetails;
        const docRef = await addDoc(collection(db, "report_onsen_data"), {
          data_id: data_id,
          onsen_name: data.onsen_name,
          category: selectedItems,
          detail: detail,
        });
        console.log("Document written with ID: ", docRef.id);
        Alert.alert("送信完了", "ご報告ありがとうございました！");
      } catch (e) {
        console.error("Error adding document: ", e);
        Alert.alert("送信失敗", "再度送信してください。");
      }
    };
    console.log(
      "報告内容:",
      data.onsen_name,
      data_id,
      selectedItems,
      reportDetails
    );
    console.log(Object.keys(selectedItems).length);

    if (
      (!selectedItems["営業時間"] && reportDetails.length <= 0) ||
      Object.keys(selectedItems).length <= 0
    ) {
      Alert.alert("注意", "カテゴリーと詳細どちらも入力してください");
    } else if (
      selectedItems["営業時間"] &&
      deepEqual(businessHours, data.periods)
    ) {
      Alert.alert("注意", "営業時間を変更してください。");
    } else {
      Alert.alert(
        "確認", // アラートのタイトル
        "送信してもよろしいですか？", // メッセージ
        [
          {
            text: "キャンセル",
            onPress: () => console.log("キャンセルされました"),
            style: "cancel",
          },
          {
            text: "送信する",
            onPress: () => {
              additems();
              navigation.goBack(); // 保存後に前の画面に戻る
            },
          },
        ],
        { cancelable: false }
      );
    }

    // ここに報告を送信する処理を追加
  };

  useEffect(() => {
    console.log(businessHours);
  }, [businessHours]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>情報修正の報告</Text>
      <Text style={styles.onsenNameLabel}>施設名：{data.onsen_name}</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.checkboxContainer}
          onPress={() => handleCheckboxChange(item)}
        >
          <Text style={styles.checkboxLabel}>{item}</Text>
          <View style={styles.checkbox}>
            {selectedItems[item] && <View style={styles.checked} />}
          </View>
        </TouchableOpacity>
      ))}

      {selectedItems["営業時間"] && (
        <View>
          {Object.keys(businessHours).map((day) => (
            <View key={day} style={styles.businessHoursContainer}>
              <View style={styles.dayLabel}>
                <Text style={styles.dayLabelText}>
                  {GlobalData.dayOfWeekName[day]}曜日
                </Text>
              </View>

              <View style={styles.flexDirectionColumn}>
                {data.periods[day].open === 0 &&
                  data.periods[day].close === 0 &&
                  (businessHours[day].open !== 0 ||
                    businessHours[day].open !== 0) && (
                    <Text
                      style={[
                        styles.textDecorationLineThrough,
                        styles.fullHourText,
                        GlobalStyles.positionCenter,
                        styles.normalFontSize,
                      ]}
                    >
                      24時間営業
                    </Text>
                  )}
                {data.periods[day].open === null &&
                  data.periods[day].close === null &&
                  (businessHours[day].open !== null ||
                    businessHours[day].open !== null) && (
                    <Text
                      style={[
                        styles.textDecorationLineThrough,
                        styles.fullHourText,
                        GlobalStyles.positionCenter,
                        styles.normalFontSize,
                      ]}
                    >
                      営業終了
                    </Text>
                  )}

                {data.periods[day].open !== null &&
                  data.periods[day].close !== null &&
                  (String(businessHours[day].open).padStart(4, "0") !==
                    defaultPeriods[day].openHH + defaultPeriods[day].openMM ||
                    String(businessHours[day].close).padStart(4, "0") !==
                      defaultPeriods[day].closeHH +
                        defaultPeriods[day].closeMM) && (
                    <View style={styles.flexDirectionRow}>
                      <View style={GlobalStyles.positionCenter}>
                        <Text
                          style={[
                            styles.defaulthour,
                            styles.textDecorationLineThrough,
                          ]}
                        >
                          {defaultPeriods[day].openHH}
                        </Text>
                      </View>
                      <Text style={styles.colon}>:</Text>
                      <View style={GlobalStyles.positionCenter}>
                        <Text
                          style={[
                            styles.defaulthour,
                            styles.textDecorationLineThrough,
                          ]}
                        >
                          {defaultPeriods[day].openMM}
                        </Text>
                      </View>
                      <View style={styles.defaultTimeOf}>
                        <Text style={styles.timeOfText}>{`〜`}</Text>
                      </View>
                      <View style={GlobalStyles.positionCenter}>
                        <Text
                          style={[
                            styles.defaulthour,
                            styles.textDecorationLineThrough,
                          ]}
                        >
                          {defaultPeriods[day].closeHH}
                        </Text>
                      </View>
                      <Text style={styles.colon}>:</Text>
                      <View style={GlobalStyles.positionCenter}>
                        <Text
                          style={[
                            styles.defaulthour,
                            styles.textDecorationLineThrough,
                          ]}
                        >
                          {defaultPeriods[day].closeMM}
                        </Text>
                      </View>
                    </View>
                  )}
                {(businessHours[day].open !== null ||
                  businessHours[day].close !== null) &&
                  (businessHours[day].open !== 0 ||
                    businessHours[day].close !== 0) && (
                    <View style={styles.flexDirectionRow}>
                      {/* 開始時刻 */}
                      <View style={styles.timeWrapper}>
                        <TextInput
                          style={styles.hourInput}
                          placeholder="HH"
                          value={localHours[day].openHH} // 時間（HH）の部分のみ表示
                          keyboardType="numeric"
                          maxLength={2} // 時間は最大2桁
                          onChangeText={(value) => {
                            if (value === "") {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], openHH: "" },
                              }));
                            } else if (
                              /^\d{0,2}$/.test(value) &&
                              parseInt(value, 10) < 24
                            ) {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], openHH: value },
                              }));
                            }
                          }}
                          onBlur={() => {
                            const hours = localHours[day].openHH.padStart(
                              2,
                              "0"
                            );
                            const minutes = localHours[day].openMM.padStart(
                              2,
                              "0"
                            );
                            handleBusinessHoursChange(
                              day,
                              "open",
                              parseInt(hours + minutes),
                              10
                            );
                            setLocalHours((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                openHH: hours,
                                openMM: minutes,
                              },
                            }));
                          }}
                        />
                        <Text style={styles.colon}>:</Text>
                        <TextInput
                          style={styles.minuteInput}
                          placeholder="MM"
                          value={localHours[day].openMM} // 分（MM）の部分のみ表示
                          keyboardType="numeric"
                          maxLength={2} // 分は最大2桁
                          onChangeText={(value) => {
                            // 入力中はそのまま反映
                            if (value === "") {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], openMM: "" },
                              }));
                            } else if (
                              /^\d{0,2}$/.test(value) &&
                              parseInt(value, 10) < 60
                            ) {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], openMM: value },
                              }));
                            }
                          }}
                          onBlur={() => {
                            const hours = localHours[day].openHH.padStart(
                              2,
                              "0"
                            );
                            const minutes = localHours[day].openMM.padStart(
                              2,
                              "0"
                            );
                            handleBusinessHoursChange(
                              day,
                              "open",
                              parseInt(hours + minutes, 10)
                            );
                            setLocalHours((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                openHH: hours,
                                openMM: minutes,
                              },
                            }));
                          }}
                        />
                      </View>
                      <View
                        style={[styles.timeOf, GlobalStyles.positionCenter]}
                      >
                        <Text style={styles.timeOfText}>{`〜`}</Text>
                      </View>

                      {/* 終了時刻 */}
                      <View style={styles.timeWrapper}>
                        <TextInput
                          style={styles.hourInput}
                          placeholder="HH"
                          value={localHours[day].closeHH} // 時間（HH）の部分のみ表示
                          keyboardType="numeric"
                          maxLength={2} // 時間は最大2桁
                          onChangeText={(value) => {
                            if (value === "") {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], closeHH: "" },
                              }));
                            } else if (
                              /^\d{0,2}$/.test(value) &&
                              parseInt(value, 10) < 24
                            ) {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], closeHH: value },
                              }));
                            }
                          }}
                          onBlur={() => {
                            const hours = localHours[day].closeHH.padStart(
                              2,
                              "0"
                            );
                            const minutes = localHours[day].closeMM.padStart(
                              2,
                              "0"
                            );
                            handleBusinessHoursChange(
                              day,
                              "close",
                              parseInt(hours + minutes, 10)
                            );
                            setLocalHours((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                closeHH: hours,
                                closeMM: minutes,
                              },
                            }));
                          }}
                        />
                        <Text style={styles.colon}>:</Text>
                        <TextInput
                          style={styles.minuteInput}
                          placeholder="MM"
                          value={localHours[day].closeMM} // 分（MM）の部分のみ表示
                          keyboardType="numeric"
                          maxLength={2} // 分は最大2桁
                          onChangeText={(value) => {
                            // 入力中はそのまま反映
                            if (value === "") {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], closeMM: "" },
                              }));
                            } else if (
                              /^\d{0,2}$/.test(value) &&
                              parseInt(value, 10) < 60
                            ) {
                              setLocalHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], closeMM: value },
                              }));
                            }
                          }}
                          onBlur={() => {
                            const hours = localHours[day].closeHH.padStart(
                              2,
                              "0"
                            );
                            const minutes = localHours[day].closeMM.padStart(
                              2,
                              "0"
                            );
                            handleBusinessHoursChange(
                              day,
                              "close",
                              parseInt(hours + minutes, 10)
                            );
                            setLocalHours((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                closeHH: hours,
                                closeMM: minutes,
                              },
                            }));
                          }}
                        />
                      </View>
                    </View>
                  )}

                <View style={styles.flexDirectionRow}>
                  <TouchableOpacity
                    key={"fullhour" + day}
                    onPress={() => handleFullHourCheckboxChange(day)}
                  >
                    <View style={styles.flexDirectionRow}>
                      <View
                        style={[
                          GlobalStyles.positionCenter,
                          styles.fullHourCheckbox,
                        ]}
                      >
                        <View style={[styles.checkbox]}>
                          {businessHours[day].open === 0 &&
                            businessHours[day].close === 0 && (
                              <View style={styles.checked} />
                            )}
                        </View>
                      </View>
                      <View
                        style={[
                          styles.fullHoursOpen,
                          GlobalStyles.positionCenter,
                        ]}
                      >
                        <Text
                          style={[
                            styles.fullHoursOpenText,
                            styles.normalFontSize,
                          ]}
                        >
                          24時間営業
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    key={"closehour" + day}
                    onPress={() => handleCloseHourCheckboxChange(day)}
                  >
                    <View style={[styles.flexDirectionRow]}>
                      <View
                        style={[
                          GlobalStyles.positionCenter,
                          styles.fullHourCheckbox,
                        ]}
                      >
                        <View style={[styles.checkbox]}>
                          {businessHours[day].open === null &&
                            businessHours[day].close === null && (
                              <View style={styles.checked} />
                            )}
                        </View>
                      </View>
                      <View
                        style={[
                          styles.fullHoursOpen,
                          GlobalStyles.positionCenter,
                        ]}
                      >
                        <Text
                          style={[
                            styles.fullHoursOpenText,
                            styles.normalFontSize,
                          ]}
                        >
                          営業終了
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {!selectedItems["営業時間"] && (
        <>
          <Text style={styles.inputLabel}>詳細:</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder={`詳細を入力してください
    例：泥パックがなくなっていた。〇〇温泉は閉店した。`}
            value={reportDetails}
            onChangeText={setReportDetails}
          />
        </>
      )}
      <View style={{ height: 30 }}></View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <DefaultButton onPress={submitReport} label="報告を送信" />
      </View>
      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  //温泉名のスタイル
  onsenNameLabel: {
    fontSize: 16 / PixelRatio.getFontScale(),
    marginBottom: 15,
    fontWeight: "500",
  },
  //温泉名のスタイル
  title: {
    fontSize: 20 / PixelRatio.getFontScale(),
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16 / PixelRatio.getFontScale(),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: "blue",
  },
  inputLabel: {
    fontSize: 16 / PixelRatio.getFontScale(),
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16 / PixelRatio.getFontScale(),
  },
  businessHoursContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // marginVertical: 10,

    // borderWidth: 1,
  },
  dayLabel: {
    height: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24,
  },
  dayLabelText: {
    fontSize: 16 / PixelRatio.getFontScale(),
    fontWeight: "bold",
    color: "#333",
  },
  flexDirectionColumn: {
    flexDirection: "column",
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  positionCenter: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  timeOf: {
    height: 40,
    paddingHorizontal: 4,
  },
  defaultTimeOf: {
    height: 20,
    paddingHorizontal: 4,
  },
  timeOfText: {
    fontSize: 16 / PixelRatio.getFontScale(),
  },
  hourInput: {
    width: 50,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 16 / PixelRatio.getFontScale(),
    borderRadius: 4,
  },
  defaulthour: {
    width: 50,
    height: 20,
    textAlign: "center",
    fontSize: 16 / PixelRatio.getFontScale(),
  },
  minuteInput: {
    width: 50,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 16 / PixelRatio.getFontScale(),
    borderRadius: 4,
  },
  colon: {
    fontSize: 16 / PixelRatio.getFontScale(),
    fontWeight: "bold",
    paddingHorizontal: 5,
  },

  textDecorationLineThrough: {
    textDecorationLine: "line-through",
  },

  fullHourText: {
    letterSpacing: 5,
  },

  // 24h営業、営業終了のチェックボックス
  fullHourCheckbox: {
    paddingHorizontal: 4,
  },
  fullHoursOpen: {
    paddingRight: 4,
    height: 40,
  },
  normalFontSize: { fontSize: 16 / PixelRatio.getFontScale() },
  fullHoursOpenText: {},
});

export default Reportdetail_Frame;
