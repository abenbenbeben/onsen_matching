import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import { useEffect, useState } from "react";

const FilterOptions = ({ filter, setFilter }) => {
  const [showFilters, setShowFilters] = useState(false);
  const handlePress = (value) => {
    setShowFilters(false);
    setFilter(value);
  };
  return (
    <View>
      <View style={[styles.filterButtonContainer]}>
        <IconButton
          icon={"filter"}
          iconColor={Color.colorBrightBlack}
          size={30}
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
        />
      </View>
      {showFilters && (
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterOption, filter === 1 && styles.selectedFilter]}
            onPress={() => handlePress(1)}
          >
            <Text style={styles.filterText}>距離＆マッチ度順</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterOption, filter === 2 && styles.selectedFilter]}
            onPress={() => handlePress(2)}
          >
            <Text style={styles.filterText}>マッチ度順</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filter3Option,
              filter === 3 && styles.selectedFilter,
            ]}
            onPress={() => handlePress(3)}
          >
            <Text style={styles.filterText}>距離順</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterButtonContainer: {
    position: "absolute",
    right: 4,
    zIndex: 10,
    // backgroundColor: Color.colorGray,
  },
  filterButton: { margin: 0 },
  filtersContainer: {
    position: "absolute",
    right: 4,
    top: 30,
    width: 200,
    // height: 300,
    marginTop: 10,
    backgroundColor: Color.colorDarkGray,
    padding: 10,
    borderRadius: 5,
  },
  filterOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  filter3Option: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  selectedFilter: {
    backgroundColor: Color.colorDarkGrayLight,
  },
  filterText: {
    fontSize: 16,
    color: Color.labelColorDarkPrimary,
  },
});

export default FilterOptions;
