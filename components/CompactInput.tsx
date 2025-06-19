import React, { forwardRef, memo } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TextInputProps,
} from 'react-native';
import Colors from '@/constants/Colors';

interface CompactInputProps {
  label?: string;
  width?: number;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  errorMsg?: string;
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
  returnKeyType?: string;
}

const CompactInput = forwardRef<TextInput, CompactInputProps>(
  (
    {
      label,
      width = 60,
      value,
      onChange,
      placeholder,
      errorMsg,
      keyboardType = 'number-pad',
      maxLength = 2,
      returnKeyType = "done",
      ...props
    },
    ref
  ) => {
    const borderColor = value
      ? (placeholder === 'YYYY' && value.length === 4) || (placeholder !== 'YYYY' && value.length > 0)
        ? `${Colors.gold.DEFAULT}90`
        : `${Colors.gold.DEFAULT}20`
      : `${Colors.gold.DEFAULT}20`;

    return (
      <TextInput
        ref={ref}
        style={[styles.input, { width, borderColor }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={`${Colors.gold.DEFAULT}40`}
        keyboardType={keyboardType}
        maxLength={maxLength}
        returnKeyType="next"
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({

  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    textAlign: "center",
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    marginLeft: 4,
  },
  errorMsg: {
    color: 'red',
    fontSize: 10,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default memo(CompactInput);
