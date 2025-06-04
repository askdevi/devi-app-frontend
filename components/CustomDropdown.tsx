import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface DropdownItem {
  label: string;
  value: string;
  [key: string]: any;
}

interface CustomDropdownProps {
  renderData: DropdownItem[];
  labelName: string;
  placeholder?: string;
  required?: boolean;
  search?: boolean;
  setSelected?: (value: string) => void;
  selected: string;
  setOptionsOnChange?: (value: string | number) => void;
  valueField?: string;
  labelField?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = memo(({
  renderData,
  labelName,
  placeholder,
  required,
  search = false,
  setSelected,
  selected,
  setOptionsOnChange,
  valueField = 'value',
  labelField = 'label',
  containerStyle,
}) => {
  const [isFocus, setIsFocused] = useState(false);

  useEffect(() => {
    // This could be used if you had form state you wanted to sync
  }, [selected]);

  const handleChange = (item: DropdownItem) => {
      setSelected?.(item?.value);
    // setSelected?.(item[valueField]);
    setIsFocused(false);
    // if (setOptionsOnChange) {
    //   setOptionsOnChange(item[valueField]);
    // }
  };

  const renderLabel = () => (
    <View style={{ width: '100%' }}>
      <Text style={styles.label}>
        {labelName}{' '}
        {required && <Text style={styles.required}>*</Text>}
      </Text>
    </View>
  );

  const renderItem = (item: DropdownItem) => (
    <View style={styles.itemContentStyle}>
      <View style={styles.itemStyle}>
        <Text style={[styles.textItem ,{color:selected===item.name? Colors.gold.DEFAULT:"#FFF",}]}>{item[labelField] || item.name}</Text>
      </View>
    </View>
  );

  return (
    <View style={containerStyle}>
      {renderLabel()}
      <View
        style={[
          styles.containerWrapper,
          (isFocus || selected) && styles.inputWrapperFocus,
        ]}
      >
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          containerStyle={styles.dropdownContainerStyle}
          data={renderData}
          placeholder={placeholder || labelName}
          search={search}
          dropdownPosition="bottom"
          labelField={labelField}
          valueField={valueField}
          searchPlaceholder="Search..."
          value={selected}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          renderRightIcon={() => (
            <MaterialCommunityIcons
              name={isFocus ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={`${Colors.gold.DEFAULT}`}
            />
          )}
          renderItem={renderItem}
          
          // selectedStyle={styles.selectedStyle}
        />
      </View>
    </View>
  );
});

export default CustomDropdown;

const styles = StyleSheet.create({
  containerWrapper: {
    height: 48,
    borderWidth: 2,
    marginVertical: 15,
    borderRadius: 8,
    borderColor: `${Colors.gold.DEFAULT}20`,
  },
  label: {
         fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#d1d5dbe6',
        // marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  textItem: {
    fontSize: 14,
    marginBottom: 1,
  },
  dropdown: {
    height: 48,
    // backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  inputWrapperFocus: {
    borderColor: `${Colors.gold.DEFAULT}90`,
    borderWidth: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: `${Colors.gold.DEFAULT}20`,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: Colors.white,
    paddingBottom:5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownContainerStyle: {
 backgroundColor: 'rgba(45, 17, 82, 0.9)',
    borderRadius: 4,
    maxHeight: 245,
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    paddingVertical: 5,
  },
  itemStyle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(45, 17, 82, 0.9)',
  },
  itemContentStyle: {
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.deepPurple.dark,
  },
});
