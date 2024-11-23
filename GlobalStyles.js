import { StyleSheet, PixelRatio } from "react-native";

/* fonts */
export const FontFamily = {
  interMedium: "Inter-Medium",
  interRegular: "Inter-Regular",
  defaultBoldBody: "SF Pro Text",
};
/* font sizes */
export const FontSize = {
  title: 30 / PixelRatio.getFontScale(),
  subTitle: 26 / PixelRatio.getFontScale(),
  body: 18 / PixelRatio.getFontScale(),
  bodySub: 16 / PixelRatio.getFontScale(),
  caption: 12 / PixelRatio.getFontScale(),

  size_5xl: 24,
  size_2xs: 11,
  size_xl: 20,
  size_3xs: 10,
  defaultBoldBody_size: 17,
  size_base: 16,
  size_3xl: 22,
};
/* Colors */
export const Color = {
  colorMain: "#3A6AE5",
  colorDarkMain: "#3058B8",
  labelColorDarkPrimary: "#fff",
  labelColorLightPrimary: "#000",
  colorWhitesmoke_100: "#f3f3f3",
  colorWhitesmoke_200: "rgba(238, 238, 238, 0.7)",
  colorBrightBlack: "#333",
  colorLightpink: "#ffafaf",
  colorRed: "#ff002e",
  colorRedOrange: "#DC362E",
  colorForestGreen: "#198639",
  colorGainsboro: "#d9d9d9",
  colorRoyalblue: "#3a6ae5",
  colorAzureBlue: "#4285F4",
  colorGray: "rgba(0, 0, 0, 0.1)",
  colorDarkGray: "#555",
  colorDarkGrayLight: "#999",
  colorGoogleBlack: "#202124",
  colorGrayText: "#666", // 暗めのグレーテキスト
};
/* border radiuses */
export const Border = {
  br_3xs: 10,
  br_12xs: 1,
};

export const GlobalStyles = StyleSheet.create({
  positionCenter: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  positionLeft: {
    textAlign: "left",
    alignItems: "left",
    justifyContent: "center",
  },
  positionRight: {
    textAlign: "right",
    alignItems: "right",
    justifyContent: "center",
  },
});
