import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing, 
  Image,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

interface SplashScreenProps {
  onComplete: () => void;
}

const NUM_FLOWERS = 16;
const CIRCLE_RADIUS = 140;

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(20)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const flowerAnims = useRef(
    Array(NUM_FLOWERS).fill(0).map(() => new Animated.Value(0))
  ).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(textSlideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
      delay: 500,
    }).start();
    
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    flowerAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 1000 + (index * 100),
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }).start();
    });
    
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
      delay: 1000,
    }).start(() => {
      setTimeout(onComplete, 500);
    });
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const renderFlowerPetal = (rotation: string) => (
    <View style={[styles.petal, { transform: [{ rotate: rotation }] }]} />
  );

  const renderFlowers = () => {
    return flowerAnims.map((anim, index) => {
      const angle = (index / NUM_FLOWERS) * 2 * Math.PI;
      const x = Math.cos(angle) * CIRCLE_RADIUS;
      const y = Math.sin(angle) * CIRCLE_RADIUS;

      return (
        <Animated.View
          key={index}
          style={[
            styles.flower,
            {
              transform: [
                { translateX: x },
                { translateY: y },
                { scale: anim },
                { rotate: `${angle + Math.PI/4}rad` },
              ],
              opacity: anim,
            }
          ]}
        >
          {renderFlowerPetal('0deg')}
          {renderFlowerPetal('72deg')}
          {renderFlowerPetal('144deg')}
          {renderFlowerPetal('216deg')}
          {renderFlowerPetal('288deg')}
          <View style={styles.flowerCenter} />
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.Text 
          style={[
            styles.title,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: textSlideAnim }] 
            }
          ]}
        >
          Bonjour
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.subtitle,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: textSlideAnim }] 
            }
          ]}
        >
          Loading Your Personal Vedic Astrologer
        </Animated.Text>
        
        <View style={styles.imageContainer}>
          <Animated.View style={[styles.flowerRing, { transform: [{ rotate: rotation }] }]}>
            {renderFlowers()}
          </Animated.View>
          
          <Image
            source={require('@/assets/images/welcome.png')}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.quote}>
          The universe speaks in the language of stars
        </Text>

        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: loadingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: Colors.gold.DEFAULT,
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 60,
    textAlign: 'center',
    opacity: 0.9,
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeImage: {
    width: 200,
    height: 200,
  },
  flowerRing: {
    position: 'absolute',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flower: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petal: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: Colors.gold.DEFAULT,
    borderRadius: 6,
    opacity: 0.8,
  },
  flowerCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold.DEFAULT,
    opacity: 0.9,
  },
  quote: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    opacity: 0.7,
    marginBottom: 40,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  progressContainer: {
    width: '70%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.gold.DEFAULT,
  },
});

export default SplashScreen;