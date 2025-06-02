import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
    interpolate,
} from 'react-native-reanimated';

const STAR_COUNT = 10;

export default function OrbitingStars() {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 20000,
                easing: Easing.linear
            }),
            -1,
            false
        );
    }, []);

    // Generate completely random starting positions for all stars
    const startAngles = Array.from({ length: STAR_COUNT }, () =>
        Math.random() * 2 * Math.PI
    );

    return (
        <View style={styles.container}>
            {Array.from({ length: STAR_COUNT }).map((_, index) => (
                <Star
                    key={index}
                    index={index}
                    totalStars={STAR_COUNT}
                    rotation={rotation}
                    startAngle={startAngles[index]}
                />
            ))}
        </View>
    );
}

function Star({
    index,
    totalStars,
    rotation,
    startAngle
}: {
    index: number;
    totalStars: number;
    rotation: any;
    startAngle: number;
}) {
    // Randomize the radius within a small range for each star
    const baseRadius = 35;
    const ringSpacing = 12;
    const ringIndex = Math.floor(index / 2);
    const radiusVariation = Math.random() * 4 - 2; // ±2 pixels variation
    const radius = baseRadius + (ringIndex * ringSpacing) + radiusVariation;

    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, {
                duration: 1500 + Math.random() * 2000, // More variation in pulse duration
                easing: Easing.inOut(Easing.ease)
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const angle = startAngle + (rotation.value * Math.PI / 180);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const scale = interpolate(pulse.value, [0, 1], [0.8, 1.2]);
        const opacity = interpolate(pulse.value, [0, 1], [0.6, 1]);

        return {
            transform: [
                { translateX: x },
                { translateY: y },
                { scale }
            ],
            opacity,
        };
    });

    // Randomize star sizes slightly
    const baseSize = 3 + (ringIndex % 3) * 1.5;
    const sizeVariation = Math.random() * 0.5;

    return (
        <Animated.View
            style={[
                styles.star,
                {
                    width: baseSize + sizeVariation,
                    height: baseSize + sizeVariation,
                },
                animatedStyle,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 154,
        height: 154,
        justifyContent: 'center',
        alignItems: 'center',
    },
    star: {
        position: 'absolute',
        backgroundColor: '#FFD700',
        borderRadius: 10,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
});