import * as React from "react";
import { StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../DataContext";
import MatchingContainer from "../components/MatchingContainer";
import HeaderScreen from "../components/HeaderScreen";

const ModalFrame = ({ route }) => {
  const { data } = useContext(DataContext);
  return (
    <>
      <HeaderScreen headerText="探す" />
      <MatchingContainer data={data} containerHeight={72} />
    </>
  );
};
const styles = StyleSheet.create({});

export default ModalFrame;
