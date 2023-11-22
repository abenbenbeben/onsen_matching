import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,Alert } from 'react-native';
import { collection, addDoc,getFirestore} from "firebase/firestore";
import { app } from "../firebaseconfig";

const db = getFirestore(app); 

const Reportdetail_Frame = ({navigation,route}) => {
  const data_id = route.params.data_id;
  const data = route.params.data;
  const [selectedItems, setSelectedItems] = useState({});
  const [reportDetails, setReportDetails] = useState('');

  const items = [
    '施設設備について',
    '営業時間・料金について',
    'その他',
    // 他に必要な項目を追加
  ];
  //matchingItems.filter(item => item.distance <= 5 && item.score > 50);

  const handleCheckboxChange = (item) => {
    let instance = { ...selectedItems, [item]: !selectedItems[item] }
    let filteredInstance = Object.keys(instance).reduce((newObj, key) => {
      if (instance[key] === true) {
        newObj[key] = true;
      }
      return newObj;
    }, {});
    setSelectedItems(filteredInstance);
  };

  const submitReport = () => {
    const additems = async() => {
      try {
        const docRef = await addDoc(collection(db, "report_onsen_data"), {
          data_id: data_id,
          onsen_name: data.onsen_name,
          category: selectedItems,
          detail: reportDetails,
        });
        console.log("Document written with ID: ", docRef.id);
        Alert.alert("送信完了","ご報告ありがとうございました！")
      } catch (e) {
        console.error("Error adding document: ", e);
        Alert.alert("送信失敗","再度送信してください。")
      }
    }
    console.log('報告内容:', data.onsen_name ,data_id,selectedItems, reportDetails);
    console.log(Object.keys(selectedItems).length)
    if(reportDetails.length <=0 || Object.keys(selectedItems).length<=0){
      Alert.alert("注意","カテゴリーと詳細どちらも入力してください")
    }else{
      Alert.alert(
        "確認", // アラートのタイトル
        "送信してもよろしいですか？", // メッセージ
        [
          {
            text: "キャンセル",
            onPress: () => console.log("キャンセルされました"),
            style: "cancel"
          },
          { 
            text: "送信する", 
            onPress: () => {
              additems();
              navigation.goBack(); // 保存後に前の画面に戻る
            }
          }
        ],
        { cancelable: false }
      );
    }

    // ここに報告を送信する処理を追加
  };

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
      <Text style={styles.inputLabel}>詳細:</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder={`詳細を入力してください
例：泥パックがなくなっていた。〇〇温泉は閉店した。`}
        value={reportDetails}
        onChangeText={setReportDetails}
      />
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
  onsenNameLabel:{
    fontSize: 16,
    marginBottom:15,
    fontWeight:"500",
  },
  //温泉名のスタイル
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: 'blue',
  },
  inputLabel: {
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Reportdetail_Frame;
