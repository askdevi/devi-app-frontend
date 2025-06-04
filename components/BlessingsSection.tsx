import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import BackgroundStars from '../components/BackgroundStars';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARDS = [
  {
    id: 'mantra',
    title: 'LUCKY MANTRA',
    value: 'Om Gam Ganapataye Namaha',
    description:
      'This powerful Ganesh mantra removes obstacles and brings success. Chant 108 times for maximum benefit.',
  },
  {
    id: 'color',
    title: 'LUCKY COLOR',
    value: 'Deep Purple',
    description:
      'Wear or surround yourself with deep purple today. This royal color amplifies your spiritual awareness and intuition.',
  },
  {
    id: 'number',
    title: 'LUCKY NUMBER',
    value: '108',
    description:
      'A sacred number in Vedic tradition. Keep this number in mind for important decisions today.',
  },
  {
    id: 'time',
    title: 'AUSPICIOUS TIME',
    value: 'Sunrise (5:42 AM - 6:30 AM)',
    description:
      'The Brahma Muhurta is ideal for meditation, prayer, and starting important tasks.',
  },
];

function ProgressDots({ activeIndex }: { activeIndex: number }) {
  return (
    <View style={styles.dotsContainer}>
      {CARDS.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.activeDot]}
        />
      ))}
    </View>
  );
}

function CardPattern() {
  return (
    <View style={styles.cardPattern}>
      

      {/* Border Pattern */}
      {Array.from({ length: 4 }).map((_, side) => (
        <View
          key={`border-${side}`}
          style={[
            styles.borderPattern,
            {
              transform: [{ rotate: `${side * 90}deg` }],
            },
          ]}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={`ornament-${i}`}
              style={[
                styles.borderOrnament,
                {
                  left: `${20 + i * 15}%`,
                },
              ]}
            />
          ))}
        </View>
      ))}

      {/* Diagonal Lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`diagonal-${i}`}
          style={[
            styles.diagonalLine,
            {
              transform: [{ rotate: `${i * 45}deg` }],
              opacity: 0.15,
            },
          ]}
        />
      ))}
    </View>
  );
}

function BlessingCard({
  card,
  index,
  activeIndex,
  flipped,
  onFlip,
}: {
  card: (typeof CARDS)[0];
  index: number;
  activeIndex: number;
  flipped: boolean;
  onFlip: () => void;
}) {
  const position = index - activeIndex;
  const isActive = position === 0;

  const rotate = useSharedValue(flipped ? 180 : 0);
  const translateX = useSharedValue(position * (SCREEN_WIDTH * 0.65));
  const scale = useSharedValue(isActive ? 1 : 0.85);
  const opacity = useSharedValue(isActive ? 1 : 0.6);
  const tapTextOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const gradientPosition = useSharedValue(0);

  useEffect(() => {
    tapTextOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    gradientPosition.value = withRepeat(
      withTiming(1, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (flipped) {
      pulseScale.value = withSequence(withSpring(1.1), withSpring(1));
    }
  }, [flipped]);

  React.useEffect(() => {
    rotate.value = withTiming(flipped ? 180 : 0, { duration: 800 });
    translateX.value = withTiming(position * (SCREEN_WIDTH * 0.65), {
      duration: 500,
    });
    scale.value = withTiming(isActive ? 1 : 0.85, { duration: 500 });
    opacity.value = withTiming(isActive ? 1 : 0.6, { duration: 500 });
  }, [flipped, position, isActive]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value * pulseScale.value },
      { rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` },
    ],
    opacity: opacity.value,
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value * pulseScale.value },
      { rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` },
    ],
    opacity: opacity.value,
    backfaceVisibility: 'hidden',
  }));

  const tapTextStyle = useAnimatedStyle(() => ({
    opacity: tapTextOpacity.value,
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(gradientPosition.value, [0, 1], [-200, 200]),
      },
    ],
    opacity: interpolate(gradientPosition.value, [0, 0.5, 1], [0, 0.3, 0]),
  }));

  return (
    <>
      <Animated.View style={[styles.card, frontStyle]}>
        <Pressable
          style={styles.cardInner}
          onPress={isActive ? onFlip : undefined}
        >
          <LinearGradient
            colors={['#FFD700', '#FDB931', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.animatedGradient, gradientStyle]}>
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.4)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <CardPattern />
          <Text style={styles.starTop}>⊰∙∘❀∘∙⊱</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Animated.Text style={[styles.tapText, tapTextStyle]}>
              TAP TO REVEAL YOUR DESTINY
            </Animated.Text>
          </View>
          <Text style={styles.starBottom}>⊰∙∘❀∘∙⊱</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
  <Pressable
    style={styles.cardInner}
    onPress={isActive ? onFlip : undefined}
  >
    {/* ✅ Add this as a floating overlay inside Pressable */}
    <View style={styles.innerBorder} />

    {/* ✨ Background Layer */}
    <LinearGradient
      colors={['#e6c4ff', '#e6c4ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />

    {/* ✨ Shimmer Effect */}
    <Animated.View style={[styles.animatedGradient, gradientStyle]}>
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>

    {/* 🌟 Content */}
    <Text style={styles.starTop}> </Text>
    <View style={styles.cardContent}>
      <Text style={styles.cardValue}>{card.value}</Text>
      {card.id === 'color' && (
        <Text style={styles.colorIconLine}>ꕥ</Text>
      )}
      <View style={styles.separator} />
      <Text style={styles.cardDescription}>{card.description}</Text>
    </View>
    <Text style={styles.starBottom}> </Text>
  </Pressable>
</Animated.View>

</>
  );
}


export default function BlessingsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const titleGlow = useSharedValue(1);

  useEffect(() => {
    titleGlow.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    textShadowRadius: interpolate(titleGlow.value, [1, 1.2], [10, 20]),
  }));

  const navigateCards = (direction: 'left' | 'right') => {
    const newIndex =
      direction === 'left'
        ? Math.max(0, activeIndex - 1)
        : Math.min(CARDS.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
  };

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#360059', '#1D0033', '#0D0019']}
        style={StyleSheet.absoluteFill}
      />

      <BackgroundStars count={30} />

      <View style={styles.header}>
        <Animated.Text style={[styles.title, titleStyle]}>
          Your Daily Blessings
        </Animated.Text>
        <Text style={styles.subtitle}>Tap to reveal your destiny</Text>
        <ProgressDots activeIndex={activeIndex} />
      </View>

      <View style={styles.carouselContainer}>
        {CARDS.map((card, index) => (
          <BlessingCard
            key={card.id}
            card={card}
            index={index}
            activeIndex={activeIndex}
            flipped={flippedCards[card.id] || false}
            onFlip={() => toggleFlip(card.id)}
          />
        ))}

        <View style={styles.navigationButtons}>
          <Pressable
            style={[
              styles.navButton,
              activeIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={() => navigateCards('left')}
            disabled={activeIndex === 0}
          >
            <LinearGradient
              colors={['#360059', '#581189']}
              style={styles.navButtonGradient}
            >
              <ChevronLeft color="#FFD700" size={32} />
            </LinearGradient>
          </Pressable>

          <Pressable
            style={[
              styles.navButton,
              activeIndex === CARDS.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={() => navigateCards('right')}
            disabled={activeIndex === CARDS.length - 1}
          >
            <LinearGradient
              colors={['#360059', '#581189']}
              style={styles.navButtonGradient}
            >
              <ChevronRight color="#FFD700" size={32} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#360059',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 110 : 90,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#FFD700',
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  activeDot: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.65,
    height: 380,
    borderRadius: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBack: {
    position: 'absolute',
  },
  cardInner: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  cornerMandala: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mandalaPetal: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: '#FFD700',
    opacity: 0.3,
    borderRadius: 1,
    transform: [{ translateX: 15 }],
  },
  borderPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    flexDirection: 'row',
  },
  borderOrnament: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    opacity: 0.3,
    transform: [{ rotate: '45deg' }],
  },
  diagonalLine: {
    position: 'absolute',
    width: '200%',
    height: 1,
    backgroundColor: '#FFD700',
    top: '50%',
    left: '-50%',
  },
  starTop: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    color: '#360059',
    opacity: 0.3,
  },
  starBottom: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    color: '#360059',
    opacity: 0.3,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#360059',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#360059',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 20,
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#360059',
    marginVertical: 15,
  
  },
  cardDescription: {
    fontSize: 14,
    color: '#360059',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  tapText: {
    color: '#360059',
    opacity: 0.7,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 30,
    textAlign: 'center',
    width: '100%',
  },
  navigationButtons: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  navButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 25,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  animatedGradient: {
    position: 'absolute',
    width: '200%',
    height: '140%',
    left: '-50%',
    top: '-20%',
  },

  colorIconLine: {
    fontSize: 30,
    color: '#4B0082', // Deep purple
    marginBottom: 10,
    textAlign: 'center',
  },

  innerBorder: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700', // or a soft glow like 'rgba(255,215,0,0.5)'
    zIndex: 1,
  },
  
  
  
  
});
