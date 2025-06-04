import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Colors from '@/constants/Colors';

interface WheelPickerProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 3;


const WheelPicker = ({ items, value, onChange, label }: WheelPickerProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync scroll with selected value
  useEffect(() => {
    const index = items.findIndex((item) => item === value);
    if (index !== -1 && index !== selectedIndex) {
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
      setSelectedIndex(index);
    }
  }, [value, items]);

  // Finalize selection after scroll ends
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);

      if (index !== selectedIndex && index >= 0 && index < items.length) {
        const selectedValue = items[index];
        onChange(selectedValue);
        setSelectedIndex(index);
      }

      // Snap exactly to the item
      scrollRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    },
    [items, selectedIndex, onChange]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <View style={styles.selection} />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
          }}
        >
          {items.map((item, i) => (
            <View key={item} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  i === selectedIndex && styles.selectedItemText,
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default memo(WheelPicker);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: `${Colors.gold.DEFAULT}70`,
    marginBottom: 8,
  },
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 80,
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    overflow: 'hidden',
  },
  selection: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: `${Colors.gold.DEFAULT}10`,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: `${Colors.gold.DEFAULT}20`,
    transform: [{ translateY: -ITEM_HEIGHT / 2 }],
    zIndex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: `${Colors.gold.DEFAULT}40`,
  },
  selectedItemText: {
    color: Colors.gold.DEFAULT,
    fontSize: 18,
  },
});
