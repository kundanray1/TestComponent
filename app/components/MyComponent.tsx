import React, { useState, useRef, useCallback } from "react";
import { Text, View, TouchableOpacity, FlatList, TextInput, ViewStyle, StyleSheet } from "react-native";
import { TextField } from "./TextField";
import { colors, spacing } from "app/theme";
import { Button } from "./Button";
import { useAppDispatch, useAppSelector } from "app/services/root";
import { setSearchQuery } from "app/services/search.slice";

const MyComponent = ({ data }) => {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(state => state.search.searchQuery)
  const [selectedItems, setSelectedItems] = useState(new Set());

  const inputRef = useRef<TextInput>(null);

  const filteredData = data?.filter((item) =>
    item?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = useCallback((item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      newSelectedItems.add(item);
      return newSelectedItems;
    });



  }, []);

  const handleClear = useCallback(() => {
    dispatch(setSearchQuery({ searchQuery: '' }))
    inputRef?.current?.clear();
  }, []);

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedItems?.has(item);


    return (
      <TouchableOpacity onPress={() => handleSelect(item)} style={[$itemStyle, isSelected && $active]}>
        <Text>{item?.title}</Text>
        <Text>{isSelected ? "Selected" : "Not selected"}</Text>
      </TouchableOpacity>
    );
  }, [selectedItems, handleSelect]);

  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  const getItemLayout = useCallback((data, index) => ({
    length: 50,  // approximate height of each item
    offset: 50 * index,
    index
  }), []);


  const handleSearchQuery = (e) => {
    dispatch(setSearchQuery({ searchQuery: e }))
  }




  return (
    <View>
      <TextField
        ref={inputRef}
        onChangeText={handleSearchQuery}
      // value={searchTerm}
      // inputWrapperStyle={{borderColor:spacing.lg}}

      />
      <Button style={{ maxHeight: spacing.md }} onPress={handleClear} preset="filled">Clear</Button>

      <FlatList
        data={filteredData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={10}  // render the first 5 items initially
        maxToRenderPerBatch={10} // render up to 10 items per batch
        windowSize={5}           // render 5 screens worth of data at a time
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export default MyComponent;





const $itemStyle: ViewStyle = {

  marginVertical: spacing.xs,
  padding: spacing.xs,
  backgroundColor: colors.palette.accent300
  // borderWidth:1
}

const $active: ViewStyle = { backgroundColor: colors.palette.secondary100, borderWidth: StyleSheet.hairlineWidth }