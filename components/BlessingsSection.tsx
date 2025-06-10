import React, { useState, useEffect, use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
  TouchableOpacity,
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
import MaskedView from '@react-native-masked-view/masked-view';
import BackgroundStars from '@/components/BackgroundEffects';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARDS = [
  {
    id: 'mantra',
    title: 'LUCKY MANTRA',
    value: 'Om Gam Ganapataye Namaha',
    sanskrit: 'ओम गं गणपत्ये नमः',
    colors: ['#4B0082', '#800080'],
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

const timeDescriptions = [
  "Divine energies will be the strongest at this time.",
  "This is the best time to meditate, pray, and start important tasks.",
  "The cosmos aligns in your favor during this sacred window.",
  "This is a spiritually charged moment — ideal for new beginnings.",
  "The stars shine brighter for you in this auspicious phase."
]

const colorDescriptions = [
  "Wear or surround yourself with this color today. This royal color amplifies your spiritual awareness and intuition.",
  "Wear or carry this color to align with cosmic harmony and inner strength.",
  "This color radiates positive vibrations that will uplift your energy today.",
  "Let this shade guide your emotions and sharpen your inner clarity.",
  "Let this color be your shield and your spark — it draws luck your way."
]

const numberDescriptions = [
  "A sacred number in Vedic tradition. Keep this number in mind for important decisions today.",
  "This number holds divine resonance — a subtle guide for your choices today.",
  "A number blessed with cosmic vibration. Let it be your silent compass.",
  "This sacred digit echoes through your karmic path — notice where it appears.",
  "Symbol of balance and inner clarity. Keep this number close as you navigate decisions."
]

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
  const tapTextOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const gradientPosition = useSharedValue(0);
  const overlayOpacity = useSharedValue(isActive ? 0 : 0.4);

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
    overlayOpacity.value = withTiming(isActive ? 0 : 0.4, { duration: 500 });
  }, [flipped, position, isActive]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value * pulseScale.value },
      { rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` },
    ],
    opacity: 1,
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value * pulseScale.value },
      { rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` },
    ],
    opacity: 1,
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

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleFlip = () => {
    console.log("Pressed");
    if (isActive) {
      console.log("Flipping");
      onFlip();
    }
  };

  return (
    <>
      <Animated.View style={[styles.card, frontStyle]}>
        <Pressable
          style={styles.cardInner}
          onPress={() => handleFlip()}
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
          <Animated.View style={[styles.cardOverlay, overlayStyle]} />
          <CardPattern />
          {/* <TouchableOpacity style={styles.centerStrip} onPress={() => handleFlip()} ></TouchableOpacity> */}
          <Text style={styles.starTop}>∙∘∘∙</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Animated.Text style={[styles.tapText, tapTextStyle]}>
              TAP TO REVEAL YOUR DESTINY
            </Animated.Text>
          </View>
          <Text style={styles.starBottom}>∙∘∘∙</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
        <Pressable
          style={styles.cardInner}
          onPress={() => handleFlip()}
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

          {/* Dark overlay for non-active cards */}
          <Animated.View style={[styles.cardOverlay, overlayStyle]} />

          {/* <TouchableOpacity style={styles.centerStrip} onPress={() => handleFlip()} ></TouchableOpacity> */}

          {/* 🌟 Content */}
          <Text style={styles.starTop}> </Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>{card.value}</Text>
            {card.sanskrit && (
              <Text style={styles.cardValue}>{card.sanskrit}</Text>
            )}
            <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'center', alignItems: 'center' }}>
              {card.id === 'color' && card.colors && (
                card.colors.map((color: string, index: number) => (
                  <Text key={index} style={[styles.colorIconLine, { color: color }]}>ꕥ</Text>
                ))
              )}
            </View>
            <View style={styles.separator} />
            <Text style={styles.cardDescription}>{card.description}</Text>
          </View>
          <Text style={styles.starBottom}> </Text>
        </Pressable>
      </Animated.View>

    </>
  );
}

function extractColors(colorDescription: string): string[] {
  if (!colorDescription) return [];

  // Convert to lowercase for uniformity
  const lowercased = colorDescription.toLowerCase();

  // Match known colors using regex OR split by ',' and filter out adjectives
  const possibleColors = lowercased
    .split(',')
    .map(part => part.trim().split(' ').pop() || '') // get last word
    .filter(Boolean);

  return possibleColors;
}

export default function BlessingsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const titleGlow = useSharedValue(1);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      const response = await AsyncStorage.getItem('dailyBlessings');
      const data = JSON.parse(response || '{}');
      const cards1 = [
        {
          id: 'mantra',
          title: 'LUCKY MANTRA',
          value: data.luckyMantra.latinScript,
          sanskrit: data.luckyMantra.sanskritScript,
          description: data.luckyMantra.direction,
        },
        {
          id: 'color',
          title: 'LUCKY COLOR',
          value: data.luckyColor,
          colors: extractColors(data.luckyColor),
          description: colorDescriptions[Math.floor(Math.random() * colorDescriptions.length)]
        },
        {
          id: 'number',
          title: 'LUCKY NUMBER',
          value: data.luckyNumber,
          description: numberDescriptions[Math.floor(Math.random() * numberDescriptions.length)]
        },
        {
          id: 'time',
          title: 'AUSPICIOUS TIME',
          value: data.auspiciousTime,
          description: timeDescriptions[Math.floor(Math.random() * timeDescriptions.length)]
        }
      ]
      setCards(cards1);
    };
    fetchCards();
  }, []);

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
      {/* Background Panel - For entire section */}
      <View style={styles.backgroundPanel}>
        <View style={styles.header}>
          <MaskedView
            style={styles.titleContainer}
            maskElement={
              <Animated.Text style={[styles.titleMask, titleStyle, { backgroundColor: 'transparent' }]}>
                Your Daily Blessings
              </Animated.Text>
            }
          >
            <LinearGradient
              colors={['#FFD700', '#FF8C00', '#FFD700']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.titleContainer}
            >
              <Animated.Text style={[styles.titleMask, titleStyle, { opacity: 0 }]}>
                Your Daily Blessings
              </Animated.Text>
            </LinearGradient>
          </MaskedView>
          <Text style={styles.subtitle}>Tap on the card to reveal your destiny</Text>
          <ProgressDots activeIndex={activeIndex} />
        </View>

        <View style={styles.carouselContainer}>
          {cards && cards.map((card: any, index: number) => (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    // backgroundColor: '#360059',
  },
  backgroundPanel: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'rgba(70, 10, 100, 0.35)', // bg-purple-900/20
    borderRadius: 24, // rounded-lg
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)', // border-purple-500/20
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    height: 550,
    zIndex: 1
  },
  header: {
    paddingTop: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleMask: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#FFD700',
    opacity: 0.8,
    marginTop: 6,
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
    zIndex: 10,
  },
  card: {
    position: 'absolute',
    top: 10,
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
  centerStrip: {
    position: 'absolute',
    top: "45%",
    left: 10,
    width: "110%",
    height: 50,
    zIndex: 500,
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
    zIndex: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    paddingHorizontal: 40,
    marginTop: -25,
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
    opacity: 0,
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

  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
