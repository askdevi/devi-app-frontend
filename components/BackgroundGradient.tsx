import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export default function BackgroundGradient() {
    return (
        <LinearGradient
            colors={['#1f0b3c', '#281048', '#341b43', '#341b43', '#341b43', '#381d39', '#381e3e', '#2b133f']}
            style={styles.background}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        />
    )
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
})