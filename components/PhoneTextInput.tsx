import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { memo, useState } from 'react'
import Colors from '@/constants/Colors';
interface PhoneTextInputProps {
  value: string;
  onChange: (text: string) => void;
  label?: string;
  placeholder?:string;
  editable?:boolean
}
// const PhoneTextInput: React.FC<CustomInputProps> = ({placeholder,value,onChange}) => {
    const PhoneTextInput: React.FC<PhoneTextInputProps> = ({
   placeholder,
   value,
   onChange,
   label,
   editable
    }) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = value || isFocused
  ? `${Colors.gold.DEFAULT}90`
    : `${Colors.gold.DEFAULT}20`;
  return (
    <View style={styles.inputGroup}>
          {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={[styles.inputContainer, { borderColor }]}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.prefixText}>+91</Text>
                </View>
                {/* <View style={styles.divider} /> */}
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  placeholderTextColor="rgba(255, 215, 0, 0.4)"
                  keyboardType="phone-pad"
                  editable={editable}
                  value={value}
                        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
                  onChangeText={(text) => {
                    onChange(text);
                    if (text.length === 10) Keyboard.dismiss();
                  }}
                  maxLength={10}
                />
              </View>
               </View>
  )
}


const styles = StyleSheet.create({
      inputGroup: {
    marginVertical: 12,
  },
      inputContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
  },
  phonePrefix: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  prefixText: { color: Colors.white, fontWeight: 'bold' },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginVertical: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    color: Colors.white,
    fontSize: 16,
  },
    inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    marginLeft: 4,
  },
})
export default memo(PhoneTextInput)