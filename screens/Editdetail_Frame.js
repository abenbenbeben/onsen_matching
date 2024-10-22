import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // 矢印アイコンにFontAwesomeを使用
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../firebaseconfig";
import TimeEditor from "../components/TImeEditor";
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";
import { GlobalData } from "../GlobalData";

// Firebaseの設定と初期化をここに記述（すでに設定されている場合は不要）

const db = getFirestore(app);

const Editdetail_Frame = ({ navigation, route }) => {
  const onsenDetailData_origin = route.params.data;
  const data_id = route.params.data_id;
  const [onsenDetailData, setonsenDetailData] = useState(
    onsenDetailData_origin
  );
  const [loading, setLoading] = useState(false); // ローディング状態を管理

  const handleSave = async (navigation) => {
    // 確認ダイアログを表示
    Alert.alert(
      "確認",
      "データを更新しますか？",
      [
        {
          text: "キャンセル",
          onPress: () => console.log("キャンセルされました"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              setLoading(true);
              const washingtonRef = doc(
                db,
                GlobalData.firebaseOnsenData,
                data_id
              );
              await updateDoc(washingtonRef, {
                ...onsenDetailData,
              });
              const washingtonRef_global = doc(
                db,
                "global_match_data",
                "z9eDm6HDqFRpf3fO9nkd"
              );
              let matchingDataResultTimestamp = null;
              const querySnapshot_global = await getDocs(
                collection(db, "global_match_data")
              );
              querySnapshot_global.forEach((doc) => {
                matchingDataResultTimestamp =
                  doc.data().matchingDataResultTimestamp;
              });
              await updateDoc(washingtonRef_global, {
                matchingDataResultTimestamp: matchingDataResultTimestamp + 1,
              });
              Alert.alert("完了", "データを更新しました。");
              navigation.goBack(); // 保存後に前の画面に戻る
            } catch (error) {
              console.error("Error updating data: ", error);
            }
            setLoading(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const changeProperty = (property, increment) => {
    setonsenDetailData({
      ...onsenDetailData,
      [property]: Math.max(onsenDetailData[property] + increment, 0),
    });
  };

  const options_p1 = [
    { label: "男女あり", value: 1 },
    { label: "男女片方のみ", value: 0.5 },
    { label: "なし", value: 0 },
  ];
  const options_p2 = [
    { label: "あり", value: 1 },
    { label: "なし", value: 0 },
  ];
  const options_p3 = [
    { label: "豊富にある", min: 0.71, max: 1 },
    { label: "普通", min: 0.3, max: 0.7 },
    { label: "あまりない", min: 0, max: 0.3 },
  ];
  const options_p4 = [
    { label: "○", value: 1 },
    { label: "×", value: 0 },
  ];
  const options_p5 = [
    { label: "すごく楽しめる", min: 0.71, max: 1 },
    { label: "楽しめる", min: 0.3, max: 0.7 },
    { label: "普通", min: 0, max: 0.3 },
  ];
  const options_p6 = [
    { label: "すごく良い", min: 0.71, max: 1 },
    { label: "良い", min: 0.31, max: 0.7 },
    { label: "普通", min: 0, max: 0.3 },
  ];
  const options_p7 = [
    { label: "あり", min: 0.51, max: 1 },
    { label: "なし", min: 0, max: 0.5 },
  ];
  const options_p8 = [
    { label: "泉質抜群", min: 0.91, max: 1 },
    { label: "天然温泉", min: 0.61, max: 0.9 },
    { label: "沸かし湯", min: 0, max: 0.6 },
  ];
  const options_p9 = [
    { label: "激混み", min: 0.751, max: 1 },
    { label: "混んでる", min: 0.51, max: 0.75 },
    { label: "普通", min: 0.251, max: 0.5 },
    { label: "空いてる", min: 0, max: 0.25 },
  ];
  const handlePress = (key, value) => {
    setonsenDetailData({ ...onsenDetailData, [key]: value });
  };

  const PriceAdjuster = ({ label, value, onChange }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.furosyuruiContainer}>
        <TouchableOpacity onPress={() => onChange(value - 10)}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.furosyuruiText}>{value}円</Text>
        <TouchableOpacity onPress={() => onChange(value + 10)}>
          <FontAwesome name="arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ButtonSelector = ({ label, options, selectedValue, onValueChange }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.button,
              selectedValue === option.value
                ? styles.selected
                : styles.unselected,
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text style={styles.buttonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const ButtonRange = ({ label, options, selectedValue, onValue }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.button,
              selectedValue >= option.min && selectedValue <= option.max
                ? styles.selected
                : styles.unselected,
            ]}
            onPress={() => handlePress(onValue, (option.min + option.max) / 2)}
          >
            <Text style={styles.buttonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  useEffect(() => {
    console.log(onsenDetailData);
  }, [onsenDetailData]);

  useEffect(() => {
    console.log(data_id);
  }, [data_id]);

  if (loading || !onsenDetailData) {
    // ローディング中の表示
    return (
      <View
        style={{
          position: "absolute", // 画面全体にオーバーレイ
          width: "100%", // 幅を画面全体に
          height: "100%", // 高さを画面全体に
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 背景を半透明に設定
        }}
      >
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={[styles.view1, styles.textPosition]}>
          <Text style={styles.textTypo1}>{onsenDetailData.onsen_name}</Text>
        </View>
        <PriceAdjuster
          label="平日値段"
          value={onsenDetailData.heijitunedan}
          onChange={(newValue) =>
            setonsenDetailData({ ...onsenDetailData, heijitunedan: newValue })
          }
        />
        <PriceAdjuster
          label="休日値段"
          value={onsenDetailData.kyuzitunedan}
          onChange={(newValue) =>
            setonsenDetailData({ ...onsenDetailData, kyuzitunedan: newValue })
          }
        />

        <Text style={styles.label}>平日営業開始時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_heijitu_start}
          setTime={(newTime) =>
            setonsenDetailData({
              ...onsenDetailData,
              zikan_heijitu_start: newTime,
            })
          }
        />

        <Text style={styles.label}>平日営業終了時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_heijitu_end}
          setTime={(newTime) =>
            setonsenDetailData({
              ...onsenDetailData,
              zikan_heijitu_end: newTime,
            })
          }
        />
        <Text style={styles.label}>休日営業開始時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_kyujitu_start}
          setTime={(newTime) =>
            setonsenDetailData({
              ...onsenDetailData,
              zikan_kyujitu_start: newTime,
            })
          }
        />
        <Text style={styles.label}>休日営業終了時間</Text>
        <TimeEditor
          time={onsenDetailData.zikan_kyujitu_end}
          setTime={(newTime) =>
            setonsenDetailData({
              ...onsenDetailData,
              zikan_kyujitu_end: newTime,
            })
          }
        />

        <ButtonSelector
          label="フェイスウォッシュ"
          options={options_p1}
          selectedValue={onsenDetailData.facewash}
          onValueChange={(value) => handlePress("facewash", value)}
        />
        <ButtonSelector
          label="塩サウナ"
          options={options_p1}
          selectedValue={onsenDetailData.siosauna}
          onValueChange={(value) => handlePress("siosauna", value)}
        />
        <ButtonRange
          label="マンガ"
          options={options_p3}
          selectedValue={onsenDetailData.manga}
          onValue="manga"
        />
        <ButtonSelector
          label="サウナ"
          options={options_p2}
          selectedValue={onsenDetailData.sauna}
          onValueChange={(value) => handlePress("sauna", value)}
        />
        <ButtonSelector
          label="ロウリュウ"
          options={options_p1}
          selectedValue={onsenDetailData.rouryu}
          onValueChange={(value) => handlePress("rouryu", value)}
        />
        <ButtonSelector
          label="水風呂"
          options={options_p2}
          selectedValue={onsenDetailData.mizuburo}
          onValueChange={(value) => handlePress("mizuburo", value)}
        />
        <ButtonSelector
          label="炭酸泉"
          options={options_p2}
          selectedValue={onsenDetailData.tansan}
          onValueChange={(value) => handlePress("tansan", value)}
        />

        <Text style={styles.label}>お風呂の種類</Text>
        <View style={styles.furosyuruiContainer}>
          <TouchableOpacity onPress={() => changeProperty("furosyurui", -1)}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.furosyuruiText}>
            {onsenDetailData.furosyurui}
          </Text>
          <TouchableOpacity onPress={() => changeProperty("furosyurui", 1)}>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ButtonSelector
          label="天然温泉"
          options={options_p4}
          selectedValue={onsenDetailData.tennen}
          onValueChange={(value) => handlePress("tennen", value)}
        />
        <ButtonRange
          label="子供も楽しめるか"
          options={options_p5}
          selectedValue={onsenDetailData.kodomo}
          onValue="kodomo"
        />
        <ButtonSelector
          label="泥パック"
          options={options_p1}
          selectedValue={onsenDetailData.doro}
          onValueChange={(value) => handlePress("doro", value)}
        />
        <ButtonSelector
          label="フリーwifi"
          options={options_p2}
          selectedValue={onsenDetailData.wifi}
          onValueChange={(value) => handlePress("wifi", value)}
        />
        <ButtonRange
          label="ソープの良さ"
          options={options_p6}
          selectedValue={onsenDetailData.senzai}
          onValue="senzai"
        />
        <ButtonSelector
          label="岩盤浴"
          options={options_p2}
          selectedValue={onsenDetailData.ganban}
          onValueChange={(value) => handlePress("ganban", value)}
        />
        <Text style={styles.label}>岩盤浴の種類</Text>
        <View style={styles.furosyuruiContainer}>
          <TouchableOpacity onPress={() => changeProperty("ganbansyurui", -1)}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.furosyuruiText}>
            {onsenDetailData.ganbansyurui}
          </Text>
          <TouchableOpacity onPress={() => changeProperty("ganbansyurui", 1)}>
            <FontAwesome name="arrow-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>話題性</Text>
        <View style={styles.buttonContainer}>
          {options_p7.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.button,
                onsenDetailData.wadai >= option.min &&
                onsenDetailData.wadai <= option.max
                  ? styles.selected
                  : styles.unselected,
              ]}
              onPress={() =>
                handlePress("wadai", (option.min + option.max) / 2)
              }
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ButtonRange
          label="泉質の良さ"
          options={options_p8}
          selectedValue={onsenDetailData.sensituyosa}
          onValue="sensituyosa"
        />
        <ButtonRange
          label="混み具合"
          options={options_p9}
          selectedValue={onsenDetailData.komiguai}
          onValue="komiguai"
        />
        {/* 他のフィールドも同様に追加... */}
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.savebutton}
          onPress={() => handleSave(navigation)}
        >
          <Text style={styles.savebuttonText}>更新</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  //タイトルのスタイル
  view1: {
    height: 32,
    top: 0,
    width: 330,
    left: 7,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 10,
  },
  textTypo1: {
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    fontSize: FontSize.size_xl,
    fontWeight: "500",
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
    width: 344,
    left: 0,
    height: 32,
  },
  //タイトルのスタイル終了
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: "#007BFF", // ハイライト色
  },
  unselected: {
    backgroundColor: "#ccc", // 暗い色
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  //風呂種類のスタイル
  furosyuruiContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  furosyuruiText: {
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  //風呂種類のスタイル終了

  //編集するボタンのスタイル
  savebutton: {
    width: 200,
    backgroundColor: "#007BFF", // 青色の背景
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 30,
    marginBottom: 50,
  },
  savebuttonText: {
    color: "white", // 白色のテキスト
    fontSize: 16,
    fontWeight: "bold",
  },
  //編集するボタンのスタイル終了
});

export default Editdetail_Frame;
