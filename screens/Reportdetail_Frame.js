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
} from "react-native";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebaseconfig";
import { GlobalData } from "../GlobalData";

const db = getFirestore(app);

const Reportdetail_Frame = ({ navigation, route }) => {
  const data_id = route.params.data_id;
  const data = route.params.data;
  const [selectedItems, setSelectedItems] = useState({});
  const [reportDetails, setReportDetails] = useState("");
  const [isBusinessHoursChecked, setIsBusinessHoursChecked] = useState(false);
  const [businessHours, setBusinessHours] = useState(data.periods);
  // 時間と分を分けたステートを作成
  const [localHours, setLocalHours] = useState(
    Object.keys(businessHours).reduce((acc, day) => {
      acc[day] = {
        openHH: String(businessHours[day].open).padStart(4, "0").slice(0, 2),
        openMM: String(businessHours[day].open).padStart(4, "0").slice(2, 4),
        closeHH: String(businessHours[day].close).padStart(4, "0").slice(0, 2),
        closeMM: String(businessHours[day].close).padStart(4, "0").slice(2, 4),
      };
      return acc;
    }, {})
  );

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

  const submitReport = () => {
    const additems = async () => {
      try {
        const docRef = await addDoc(collection(db, "report_onsen_data"), {
          data_id: data_id,
          onsen_name: data.onsen_name,
          category: selectedItems,
          detail: reportDetails,
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
    if (reportDetails.length <= 0 || Object.keys(selectedItems).length <= 0) {
      Alert.alert("注意", "カテゴリーと詳細どちらも入力してください");
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
              <Text style={styles.dayLabel}>
                {GlobalData.dayOfWeekName[day]}曜日
              </Text>

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
                    const hours = localHours[day].openHH.padStart(2, "0");
                    const minutes = localHours[day].openMM.padStart(2, "0");
                    handleBusinessHoursChange(day, "open", hours + minutes);
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
                    const hours = localHours[day].openHH.padStart(2, "0");
                    const minutes = localHours[day].openMM.padStart(2, "0");
                    handleBusinessHoursChange(day, "open", hours + minutes);
                    setLocalHours((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], openHH: hours },
                    }));
                    setLocalHours((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], openMM: minutes },
                    }));
                  }}
                />
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
                    const hours = localHours[day].closeHH.padStart(2, "0");
                    const minutes = localHours[day].closeMM.padStart(2, "0");
                    handleBusinessHoursChange(day, "close", hours + minutes);
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
                    const hours = localHours[day].closeHH.padStart(2, "0");
                    const minutes = localHours[day].closeMM.padStart(2, "0");
                    handleBusinessHoursChange(day, "open", hours + minutes);
                    setLocalHours((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], closeHH: hours },
                    }));
                    setLocalHours((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], closeMM: minutes },
                    }));
                  }}
                />
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
      <TouchableOpacity style={styles.button} onPress={submitReport}>
        <Text style={styles.buttonText}>報告を送信</Text>
      </TouchableOpacity>
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
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "500",
  },
  //温泉名のスタイル
  title: {
    fontSize: 20,
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
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 16,
  },
  businessHoursContainer: {
    flexDirection: "column",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
  },
  dayLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  hourInput: {
    width: 50,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 18,
    borderRadius: 4,
  },
  minuteInput: {
    width: 50,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 18,
    borderRadius: 4,
  },
  colon: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
});

export default Reportdetail_Frame;
