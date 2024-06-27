import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {StyleSheet} from 'react-native';
import {themes} from '../utils';

const theme = themes.defaultTheme;

const CurrencyPicker = ({
  prompt,
  customStyles,
  dropdownIconColor,
  selectedItem,
  items,
  onValueChange,
  customItemStyle,
  symbols,
}) => {
  return (
    <Picker
      prompt={prompt}
      style={[styles.picker, customStyles]}
      dropdownIconColor={dropdownIconColor}
      selectedValue={selectedItem}
      onValueChange={(value, index) => {
        onValueChange(value);
      }}>
      {items &&
        items.map((c, index) => (
          <Picker.Item
            key={index}
            label={`${symbols[c].code} - ${symbols[c].description}`}
            value={symbols[c].code}
            style={[styles.pickerItem, customItemStyle]}
          />
        ))}
    </Picker>
  );
};

const styles = StyleSheet.create({
  picker: {
    backgroundColor: theme.backgroundColor,
    marginHorizontal: 10,
    color: 'white',
  },
  pickerItem: {
    backgroundColor: 'orange',
    color: 'white',
    padding: 10,
  },
});

export default CurrencyPicker;
