import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, PixelRatio } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 矢印アイコン用のライブラリ
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";
import { GlobalData } from "../GlobalData";

const OperatingHours = ({ contents_data, onPress }) => {
  let salesFlag;
  const dayOfWeekName = GlobalData.dayOfWeekName;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handlePress = () => {
    onPress("営業時間");
  };

  //時間変換する関数
  function formatTime(time) {
    let hours = Math.floor(time / 100);
    let minutes = time % 100;

    // 24時間を超える時間を処理
    if (hours >= 24) {
      hours = hours - 24;
      hours = `翌${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  }

  function reorderArray(arr, startDay) {
    // 配列を2つに分割して、startDay以降の部分とそれ以前の部分を結合
    const beforeStart = arr.filter((item) => item.day < startDay);
    const afterStart = arr.filter((item) => item.day >= startDay);
    // 再結合して並び替えた新しい配列を返す
    return [...afterStart, ...beforeStart];
  }

  // 営業時間を算出する関数
  function getSalesFlag(periods) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let dayOfWeek = now.getDay();
    let closeTime = null;
    let SalesFlag = false;
    const currentFormatedTime = `${hours}${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
    const period = periods.filter((dayinfo) => dayinfo.day === dayOfWeek)[0];
    const nextPeriod = () => {
      for (let i = 1; i <= periods.length; i++) {
        const nextDay = (dayOfWeek + i) % 7;
        const dayinfo = periods.find((day) => day.day === nextDay);
        if (dayinfo && dayinfo.open !== null && dayinfo.close !== null) {
          return dayinfo;
        }
      }
      return null;
    };
    if (period.close !== null) {
      closeTime = period.close < 1200 ? period.close + 2400 : period.close;
    }
    if (period.open !== null && closeTime !== null) {
      SalesFlag =
        period.open < currentFormatedTime && closeTime > currentFormatedTime;
    }

    const result = {
      regularHoliday: period.open == null && period.close == null,
      SalesFlag: SalesFlag,
      dayOfWeek: dayOfWeek,
      period: period,
      nextPeriod: nextPeriod(),
      nextPeriodFlag: currentFormatedTime > closeTime,
    };

    return result;
  }
  if (contents_data !== null) {
    salesFlag = getSalesFlag(contents_data.periods);
  }

  return (
    <>
      <View style={styles.view4}>
        <Text style={styles.text1}>
          浴場：
          <Text
            style={{
              color: salesFlag.SalesFlag
                ? Color.colorForestGreen
                : Color.colorRedOrange,
              fontWeight: "bold",
              fontFamily: "System",
            }}
          >
            {salesFlag.regularHoliday ? "定休日" : ""}
            {!salesFlag.regularHoliday &&
              `${salesFlag.SalesFlag ? "入浴可能" : "入浴時間外"}`}
          </Text>
          ・
          {salesFlag.SalesFlag &&
            `終了時間: ${
              salesFlag.period.close > 0 && salesFlag.period.close < 1200
                ? dayOfWeekName[(salesFlag.dayOfWeek + 1) % 7]
                : ""
            } ${formatTime(salesFlag.period.close)}`}
          {!salesFlag.SalesFlag &&
            !salesFlag.nextPeriodFlag &&
            `開始時間: ${formatTime(salesFlag.period.open)}`}
          {!salesFlag.SalesFlag &&
            salesFlag.nextPeriodFlag &&
            `開始時間: ${
              dayOfWeekName[
                salesFlag.nextPeriod.day ? salesFlag.nextPeriod.day : 0
              ]
            } ${formatTime(
              salesFlag.nextPeriod.open ? salesFlag.nextPeriod.open : 0
            )}`}
        </Text>
        <TouchableOpacity onPress={toggleDropdown} style={styles.arrowButton}>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View>
        {isOpen && (
          <>
            <View style={styles.dropdown}>
              <View style={styles.periods}>
                {reorderArray(contents_data.periods, salesFlag.dayOfWeek).map(
                  (hours, index) => (
                    <Text key={index} style={styles.dropdownText}>
                      {dayOfWeekName[hours.day]}曜日　　　
                      {(hours.open !== null || hours.close !== null) &&
                        `${formatTime(hours.open)} 〜 ${formatTime(
                          hours.close
                        )}`}
                      {hours.open == null && hours.close == null && `定休日`}
                    </Text>
                  )
                )}
              </View>
              <TouchableOpacity onPress={handlePress} style={styles.button}>
                <Text style={[styles.buttonText]}>新しい営業時間を提案</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
};

const styles = {
  view4: {
    // height: 24,
    left: 7,
    // overflow: "hidden",
    // width: 345,
    marginVertical: 3,
    flexDirection: "row",
  },
  text1: {
    fontSize: 17 / PixelRatio.getFontScale(),
    height: 24,
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    fontFamily: FontFamily.interMedium,
    // fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0,
    color: Color.labelColorLightPrimary,
    left: 0,
    top: 0,
  },
  arrowButton: {
    justifyContent: "center",
    height: 24,
    marginLeft: 10,
    // 矢印ボタンのスタイル
    // justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    // プルダウンメニューのスタイル
    // marginTop: 8,
    paddingLeft: 54,
    padding: 8,
    paddingBottom: 12,
    justifyContent: "center",
  },
  dropdownText: {
    // 営業時間のテキストスタイル
    fontSize: 17 / PixelRatio.getFontScale(),
    paddingVertical: 4,
  },

  periods: {
    paddingBottom: 10,
  },

  // ボタンのスタイル
  button: {
    // ボタンの初期状態（背景色なし、枠なし）
    padding: 4,
  },
  buttonText: {
    // テキストの初期スタイル
    fontSize: 17 / PixelRatio.getFontScale(),
    fontWeight: 500,
    color: Color.colorRoyalblue,
  },
};

export default OperatingHours;
