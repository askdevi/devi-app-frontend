import React, { useState, memo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
} from 'react-native';
import Colors from '@/constants/Colors';

interface CustomInputProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?:string;
  errorMsg?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  label,
  errorMsg,
  placeholder,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = value || isFocused
  ? `${Colors.gold.DEFAULT}90`
    : `${Colors.gold.DEFAULT}20`;

  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[styles.input, { borderColor }]}
        value={value}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={`${Colors.gold.DEFAULT}20`}
        {...rest}
      />
      {!!errorMsg && (
        <Text style={styles.errorText}>{errorMsg}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginVertical: 12,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color:Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#d1d5dbe6',
    marginBottom: 8,
    marginLeft: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default memo(CustomInput);
