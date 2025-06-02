import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const RING_COUNT = 8;

const RippleRings= memo(() => {
    const rings = Array.from({ length: RING_COUNT }, (_, i) => i);

    return (
        <View style={styles.container}>
            {rings.map((index) => (
                <View
                    key={index}
                    style={[
                        styles.ring,
                        {
                            transform: [{ scale: 0.4 + (index * 0.1) }],
                            opacity: 0.7 - (index * 0.06),
                        }
                    ]}
                />
            ))}
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 154, // Increased by 10% from 140
        height: 154, // Increased by 10% from 140
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 77, // Half of container width/height
        borderWidth: 1,
        borderColor: '#FFD700',
    },
});

export default RippleRings
