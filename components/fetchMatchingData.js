import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDocs, collection, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "../firebaseconfig";
import { GlobalData } from "../GlobalData";
const db = getFirestore(app);
const storage = getStorage(app);

// ユーティリティ関数
// データが更新されたかどうかを確認する関数
const isDataOutdated = async (lastUpdatedTimestamp, matchingDataTimestamp) => {
  // ここでFirebaseのデータのタイムスタンプと比較して更新されたかを確認
  // 更新された場合は true を返す
  // 更新されていない場合は false を返す
  console.log(
    "matchingResultDataArrayLastUpdatedTimestamp",
    matchingDataTimestamp,
    lastUpdatedTimestamp
  );
  matchingDataTimestamp = matchingDataTimestamp || 1;
  if (!lastUpdatedTimestamp) {
    // タイムスタンプが存在しない場合、データが更新されたとみなす（初回起動時）
    await AsyncStorage.setItem(
      "matchingResultDataArrayLastUpdatedTimestamp",
      JSON.stringify(matchingDataTimestamp)
    );
    return true;
  }
  const dataUpdated = matchingDataTimestamp > lastUpdatedTimestamp;
  if (dataUpdated) {
    await AsyncStorage.setItem(
      "matchingResultDataArrayLastUpdatedTimestamp",
      JSON.stringify(matchingDataTimestamp)
    );
  }
  console.log(dataUpdated);
  return dataUpdated;
};

//firestorageの内のパスをURLに変換する関数
const fetchURL = async (imagepath) => {
  try {
    const pathReference = ref(storage, imagepath);
    const url = await getDownloadURL(pathReference);
    return url;
  } catch (error) {
    console.error("Error fetching URL: ", error);
    return null;
  }
};

// 主要関数
export const fetchMatchingData = async (
  point2,
  match_array = [],
  match_array_array = []
) => {
  let nedan_min;
  let matchingDataResultTimestamp = null;
  const querySnapshot_global = await getDocs(
    collection(db, "global_match_data")
  );
  querySnapshot_global.forEach((doc) => {
    // furosyurui_max = doc.data().furosyurui_max;
    // nedan_min = doc.data().nedan_min;
    // ganbansyurui_max = doc.data().ganbansyurui_max;
    matchingDataResultTimestamp = doc.data().matchingDataResultTimestamp;
  });
  let querySnapshot = null;
  let matchingDataArray = null;
  let matchingDataArray_origin = null;
  let matchingDataArray_cache = await AsyncStorage.getItem(
    "matchingResultDataArray"
  );
  matchingDataArray_origin = JSON.parse(matchingDataArray_cache);

  let lastUpdatedTimestamp = await AsyncStorage.getItem(
    "matchingResultDataArrayLastUpdatedTimestamp"
  );
  const shouldFetchFromFirebase =
    (await isDataOutdated(lastUpdatedTimestamp, matchingDataResultTimestamp)) ||
    !lastUpdatedTimestamp;
  if (!matchingDataArray_origin || shouldFetchFromFirebase) {
    console.log("HOME画面：firebaseを読み込んだ");
    querySnapshot = await getDocs(collection(db, GlobalData.firebaseOnsenData));
    matchingDataArray_origin = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        let data = doc.data();
        data.id = doc.id;
        data.onsenName = data.onsen_name;
        data.heijitunedan = data.heijitunedan;
        data.kyujitunedan = data.kyuzitunedan;
        return data;
      })
    );
    await AsyncStorage.setItem(
      "matchingResultDataArray",
      JSON.stringify(matchingDataArray_origin)
    );
  }

  nedan_min = Math.min(
    ...matchingDataArray_origin.map(
      (item) => (item.heijitunedan + item.kyujitunedan) / 2
    )
  );
  // processField 関数を定義して、必要なデータ処理を行う
  function processField(field, fieldData) {
    if (field === "heikinnedan") {
      return parseFloat((nedan_min / fieldData).toFixed(2)); // heikinnedanの場合に処理を実行
    } else {
      return fieldData; // それ以外の場合は処理を行わず、元のデータを返す
    }
  }
  // 2つの座標の緯度と経度をラジアンに変換するヘルパー関数
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  // ヒュベニの公式を使用して2つの座標間の距離を計算
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球の半径（単位: km）

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  matchingDataArray = await Promise.all(
    matchingDataArray_origin.map(async (item) => {
      const now = new Date();
      let dayOfWeek = now.getDay();
      const period = item.periods.filter(
        (dayinfo) => dayinfo.day === dayOfWeek
      )[0];
      // データの追加
      if (period.open < 800 || period.close > 3000) {
        item.asaeigyo = 1;
      }
      item.heikinnedan = (item.heijitunedan + item.kyujitunedan) / 2;
      if (item.ekitika.zikan && item.ekitika.zikan <= 10) {
        item.ekitika_zikan = 1;
      } else {
        item.ekitika_zikan = 0;
      }
      // データの追加終了

      const point1 = { latitude: item.latitude, longitude: item.longitude };
      const distanceInMeters = haversineDistance(
        point1.latitude,
        point1.longitude,
        point2.latitude,
        point2.longitude
      );
      item.distance = parseFloat(distanceInMeters.toFixed(1));

      if (match_array_array.length === 0) {
        item.scoreData = match_array.map((field) => {
          // データを加工してから scoreData に追加
          return processField(field, item[field]);
        });
        //matchDataDict.scoreData配列の平均を計算
        const average =
          (item.scoreData.reduce((acc, value) => acc + value, 0) /
            item.scoreData.length) *
          100;
        // 平均を matchDataDict.score に代入
        item.score = Math.floor(average);

        if (item.distance <= 40 && item.score > 50) {
          item.image = await fetchURL(item.images[0]);
        }
      } else {
        item.scoreData = match_array_array.map((match_array_array_unit) => {
          const scoreData_matchArrrayArray =
            match_array_array_unit.concatenatedData.map((field) => {
              // データを加工してから scoreData に追加
              return processField(field, item[field]);
            });
          const average =
            (scoreData_matchArrrayArray.reduce((acc, value) => acc + value, 0) /
              scoreData_matchArrrayArray.length) *
            100;
          // 平均を matchDataDict.score に代入
          const score = Math.floor(average);
          return {
            score: score,
            conditionId: match_array_array_unit.conditionId,
          };
        });
        // 配列内の score を取得
        const scores = item.scoreData.map((item) => item.score);
        const maxScore = Math.max(...scores);
        if (item.distance <= 40 && maxScore > 50) {
          item.image = await fetchURL(item.images[0]);
        }
      }

      return item;
    })
  );
  return matchingDataArray;
};
