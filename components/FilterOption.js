import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { FontSize, Color, FontFamily } from "../GlobalStyles";
import { useEffect, useState } from "react";

const FilterOptions = ({
  filter1,
  filter2,
  filter3,
  setFilter1,
  setFilter2,
  setFilter3,
}) => {
  const [showFilters, setShowFilters] = useState(false);
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
            style={[styles.filterOption, filter1 && styles.selectedFilter]}
            onPress={() => setFilter1(!filter1)}
          >
            <Text style={styles.filterText}>フィルター 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterOption, filter2 && styles.selectedFilter]}
            onPress={() => setFilter2(!filter2)}
          >
            <Text style={styles.filterText}>フィルター 2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filter3Option, filter3 && styles.selectedFilter]}
            onPress={() => setFilter3(!filter3)}
          >
            <Text style={styles.filterText}>フィルター 3</Text>
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
  },
  filterButton: { margin: 0 },
  filtersContainer: {
    position: "absolute",
    right: 4,
    top: 30,
    width: 200,
    // height: 300,
    marginTop: 10,
    backgroundColor: Color.colorGoogleBlack,
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
    backgroundColor: "#ddd",
  },
  filterText: {
    fontSize: 16,
    color: Color.labelColorDarkPrimary,
  },
});

export default FilterOptions;
