import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface BlessingCardProps {
  data: {
    title: string;
    mantra?: string;
    sanskrit?: string;
    direction?: string;
    color?: string;
    number?: string;
    time?: string;
  };
  delay: number;
}

const BlessingCard: React.FC<BlessingCardProps> = ({ data }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const gradientPosition = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Start gradient animation
    const gradientAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(gradientPosition, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientPosition, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    gradientAnimation.start();

    return () => {
      gradientAnimation.stop();
    };
  }, []);

  const handlePress = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg']
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0]
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1]
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={StyleSheet.absoluteFill}
      >
        {/* Front of card */}
        <Animated.View
          style={[
            styles.cardFace,
            {
              opacity: frontOpacity,
              transform: [{ rotateY: frontInterpolate }],
              zIndex: isFlipped ? 0 : 1,
            }
          ]}
        >
          <LinearGradient
            colors={[Colors.gold.DEFAULT, Colors.gold.light]}
            style={styles.cardContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.diagonalLine1} />
            
            <View style={styles.diagonalLine2} />

            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.tapText}>TAP TO REVEAL YOUR DESTINY</Text>
          </LinearGradient>
        </Animated.View>

        {/* Back of card */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            {
              opacity: backOpacity,
              transform: [{ rotateY: backInterpolate }],
              zIndex: isFlipped ? 1 : 0,
            }
          ]}
        >
          <LinearGradient
            colors={['#6B46C1', '#553C9A', '#44337A']}
            style={styles.cardContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.revealedContent}>
              <Text style={styles.titleFlipped}>{data.title}</Text>
              {data.title === 'LUCKY MANTRA' && (
                <>
                  <Text style={styles.mantra}>{data.mantra}jai</Text>
                  <Text style={styles.sanskrit}>{data.sanskrit}</Text>
                  <Text style={styles.description}>{data.direction}</Text>
                </>
              )}
              {data.title === 'LUCKY COLOR' && (
                <>
                  <Text style={styles.mainText}>{data.color}</Text>
                  <Text style={styles.description}>Wear this color today to enhance your spiritual energy</Text>
                </>
              )}
              {data.title === 'LUCKY NUMBER' && (
                <>
                  <Text style={styles.mainText}>{data.number}</Text>
                  <Text style={styles.description}>This number brings prosperity today</Text>
                </>
              )}
              {data.title === 'AUSPICIOUS TIME' && (
                <>
                  <Text style={styles.mainText}>{data.time}</Text>
                  <Text style={styles.description}>Divine energies will be strongest at this time</Text>
                </>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf:"center",
    height: 250,
    width: "95%",
    position: 'relative',
  },
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  diagonalLine1: {
    position: 'absolute',
    width: '200%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    transform: [{ rotate: '45deg' }],
  },
  diagonalLine2: {
    position: 'absolute',
    width: '200%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.deepPurple.DEFAULT,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleFlipped: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  tapText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.deepPurple.DEFAULT,
    opacity: 0.7,
    textAlign: 'center',
  },
  revealedContent: {
    alignItems: 'center',
  },
  mantra: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  sanskrit: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    color: Colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  mainText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default BlessingCard;