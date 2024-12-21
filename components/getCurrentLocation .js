import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export const getCachedOrNewLocation = async (getCurrentLocation) => {
  async function getCurrentLocation() {
    const timeout = 5000;

    try {
      // 位置情報の権限をリクエスト
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission not granted");
      }
      // 最初に現在の位置情報を取得を試みる
      const currentPosition = await Promise.race([
        Location.getCurrentPositionAsync(),
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Error getting GPS location after ${timeout / 1000} s`
                )
              ),
            timeout
          )
        ),
      ]);
      return currentPosition;
    } catch (error) {
      // 現在の位置情報の取得に失敗した場合、最後に知られている位置情報を試みる
      try {
        const lastKnownPosition = await Location.getLastKnownPositionAsync();
        if (lastKnownPosition) {
          return lastKnownPosition;
        } else {
          throw new Error("No known last position");
        }
      } catch (lastError) {
        // 最後に知られている位置情報の取得も失敗した場合、エラーを返す
        throw new Error(`Unable to get location: ${lastError.message}`);
      }
    }
  }

  let point2 = null;

  try {
    const cachedLocation = await AsyncStorage.getItem("currentLocation");
    const cachedLocationTimestamp = await AsyncStorage.getItem(
      "currentLocationTimestamp"
    );

    if (cachedLocation && cachedLocationTimestamp) {
      // キャッシュから位置情報とタイムスタンプを読み込む
      point2 = JSON.parse(cachedLocation);
      const cachedTimestamp = parseInt(cachedLocationTimestamp, 10);
      const currentTimestamp = Date.now();

      // 30分経過していない場合はキャッシュを使用
      if (currentTimestamp - cachedTimestamp <= 30 * 60 * 1000) {
        console.log("Using cached location.");
        return point2;
      } else {
        console.log("Fetching new location due to cache expiration.");
      }
    } else {
      console.log("No cached location available. Fetching new location.");
    }

    // 新しい位置情報を取得
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await getCurrentLocation();
      const { latitude, longitude } = location.coords;
      point2 = { latitude, longitude };

      // 新しい位置情報とタイムスタンプをキャッシュに保存
      const currentTimestamp = Date.now();
      await AsyncStorage.setItem("currentLocation", JSON.stringify(point2));
      await AsyncStorage.setItem(
        "currentLocationTimestamp",
        currentTimestamp.toString()
      );

      return point2;
    } else {
      console.error("Location permission denied.");
      return null;
    }
  } catch (e) {
    console.error("Error fetching location:", e);
    return null;
  }
};
