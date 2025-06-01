import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';

interface WheelPickerProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 3;

export default function WheelPicker({ items, value, onChange, label }: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      const index = items.findIndex(item => item === value);
      if (index !== -1) {
        scrollRef.current.scrollTo({
          y: index * ITEM_HEIGHT,
          animated: false
        });
      }
    }
  }, [value, items]);

  const handleScroll = (event: any) => {
    if (!isDragging && scrollRef.current) {
      const y = event.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      const selectedValue = items[index];
      
      if (selectedValue && selectedValue !== value) {
        onChange(selectedValue);
        
        // Snap to the selected item
        scrollRef.current.scrollTo({
          y: index * ITEM_HEIGHT,
          animated: true
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <View style={styles.selection} />
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => setIsDragging(true)}
          onScrollEndDrag={() => setIsDragging(false)}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2)
          }}
        >
          {items.map((item) => (
            <View key={item} style={styles.item}>
              <Text style={[
                styles.itemText,
                item === value && styles.selectedItemText
              ]}>
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

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