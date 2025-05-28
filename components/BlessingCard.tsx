import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface BlessingCardProps {
  title: string;
  delay: number;
}

const BlessingCard: React.FC<BlessingCardProps> = ({ title }) => {
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
    if (Platform.OS !== 'web') {
      // Add haptic feedback for mobile
    }
    
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

  const getCardContent = () => {
    switch (title) {
      case 'LUCKY MANTRA':
        return {
          mantra: 'Om Hanumate Namah',
          sanskrit: 'ॐ हनुमते नमः',
          description: 'Chant 108 times for courage and protection'
        };
      case 'LUCKY COLOR':
        return {
          color: 'Magenta',
          description: 'Wear this color today to enhance your spiritual energy'
        };
      case 'LUCKY NUMBER':
        return {
          number: '9',
          description: 'This number brings prosperity today'
        };
      case 'AUSPICIOUS TIME':
        return {
          time: '3:30 PM - 5:47 PM',
          description: 'Divine energies will be strongest at this time'
        };
      default:
        return null;
    }
  };

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
            colors={Colors.gradients.goldPrimary}
            style={styles.cardContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.diagonalLine1} />
            <View style={styles.diagonalLine2} />
            
            <Text style={styles.title}>{title}</Text>
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
              <Text style={styles.titleFlipped}>{title}</Text>
              {title === 'LUCKY MANTRA' && (
                <>
                  <Text style={styles.mantra}>{getCardContent()?.mantra}</Text>
                  <Text style={styles.sanskrit}>{getCardContent()?.sanskrit}</Text>
                  <Text style={styles.description}>{getCardContent()?.description}</Text>
                </>
              )}
              {(title === 'LUCKY COLOR' || title === 'LUCKY NUMBER' || title === 'AUSPICIOUS TIME') && (
                <>
                  <Text style={styles.mainText}>
                    {getCardContent()?.color || getCardContent()?.number || getCardContent()?.time}
                  </Text>
                  <Text style={styles.description}>{getCardContent()?.description}</Text>
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
    height: 400,
    marginBottom: 16,
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
    marginBottom: 16,
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
    fontSize: 28,
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  sanskrit: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  mainText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
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

export default BlessingCard