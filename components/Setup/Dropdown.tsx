import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { ChevronDown } from 'lucide-react-native';

interface DropdownProps {
    label: string;
    value: string;
    items: string[];
    onSelect: (item: string) => void;
    placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    value,
    items,
    onSelect,
    placeholder = 'Select an option'
}) => {
    const [visible, setVisible] = useState(false);

    const toggleDropdown = () => {
        setVisible(!visible);
    };

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                onSelect(item);
                setVisible(false);
            }}
        >
            <Text style={[styles.itemText, item === value && styles.selectedItemText]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={toggleDropdown}
            >
                <Text style={[styles.buttonText, !value && styles.placeholderText]}>
                    {value || placeholder}
                </Text>
                <ChevronDown color={Colors.gold.DEFAULT} size={20} />
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#d1d5dbe6',
        marginBottom: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(45, 17, 82, 0.3)',
        borderWidth: 2,
        borderColor: `${Colors.gold.DEFAULT}20`,
        borderRadius: 12,
        padding: 16,
    },
    buttonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: Colors.white,
    },
    placeholderText: {
        color: `${Colors.gold.DEFAULT}40`,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: Colors.deepPurple.dark,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: `${Colors.gold.DEFAULT}20`,
        padding: 8,
        width: Dimensions.get('window').width * 0.85,
        maxHeight: 300,
    },
    item: {
        padding: 16,
        borderRadius: 8,
    },
    itemText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: Colors.white,
    },
    selectedItemText: {
        color: Colors.gold.DEFAULT,
        fontFamily: 'Poppins-Medium',
    },
});

export default Dropdown; 