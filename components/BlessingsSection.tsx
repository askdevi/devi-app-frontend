import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import BackgroundStars from '@/components/BackgroundEffects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as amplitude from '@amplitude/analytics-react-native';

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
  isFlipped,
  onFlip,
}: {
  card: (typeof CARDS)[0];
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(flipAnimation, {
        toValue: isFlipped ? 180 : 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    if (isFlipped) {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFlipped]);

  const frontAnimatedStyle = {
    transform: [
      { scale: pulseAnimation },
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      { scale: pulseAnimation },
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.cardInner, frontAnimatedStyle, { backfaceVisibility: 'hidden' }]}>
        <LinearGradient
          colors={['#FFD700', '#FDB931', '#FFA500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <CardPattern />
        <Text style={styles.starTop}>∙∘∘∙</Text>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.tapText}>TAP TO REVEAL YOUR DESTINY</Text>
        </View>
        <Text style={styles.starBottom}>∙∘∘∙</Text>
      </Animated.View>

      <Animated.View style={[styles.cardInner, backAnimatedStyle, { backfaceVisibility: 'hidden' }]}>
        <View style={styles.innerBorder} />
        <LinearGradient
          colors={['#e6c4ff', '#e6c4ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
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
      </Animated.View>

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onFlip}
      />
    </View>
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
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [cards, setCards] = useState<any[]>([]);
  const [snapOffsets, setSnapOffsets] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const navigateCards = (direction: 'left' | 'right') => {
    if (!scrollViewRef.current) return;

    const newIndex = direction === 'right'
      ? Math.min(activeIndex + 1, cards.length - 1)
      : Math.max(activeIndex - 1, 0);

    const offset = newIndex * (SCREEN_WIDTH * 0.65 + 20);
    scrollViewRef.current.scrollTo({ x: offset, animated: true });
    setActiveIndex(newIndex);
  };

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

      // After cards are ready, compute snap offsets for precise centering
      const CARD_WIDTH = SCREEN_WIDTH * 0.65;
      const CARD_SPACING = 20; // marginHorizontal 10 on each side in wrapper
      const offsets = cards1.map((_, index) => index * (CARD_WIDTH + CARD_SPACING));
      setSnapOffsets(offsets);
    };
    fetchCards();
  }, []);

  const toggleFlip = (cardId: string) => {
    if (!flippedCards[cardId]) {
      amplitude.track(`${cards[activeIndex].title} Revealed`, { screen: 'Home' });
    }
    else {
      amplitude.track(`${cards[activeIndex].title} Hidden`, { screen: 'Home' });
    }
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundPanel}>
        <View style={styles.header}>
          <MaskedView
            style={styles.titleContainer}
            maskElement={
              <Text style={styles.titleMask}>
                Your Daily Blessings
              </Text>
            }
          >
            <LinearGradient
              colors={['#FFD700', '#FF8C00', '#FFD700']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.titleContainer}
            >
              <Text style={[styles.titleMask, { opacity: 0 }]}>
                Your Daily Blessings
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text style={styles.subtitle}>Tap on the card to reveal your destiny</Text>
          <ProgressDots activeIndex={activeIndex} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          {...(Platform.OS === 'ios' ? {
            snapToOffsets: snapOffsets,
            decelerationRate: 'fast',
            snapToAlignment: 'center',
          } : {
            pagingEnabled: true,
            snapToAlignment: 'center',
            decelerationRate: 0,
          })}
          showsHorizontalScrollIndicator={false}
          style={styles.cardsContainer}
          contentContainerStyle={[
            styles.cardsContent,
          ]}
          onMomentumScrollEnd={(event) => {
            const offset = event.nativeEvent.contentOffset.x;
            const cardWidth = SCREEN_WIDTH * 0.65 + 20;
            const newIndex = Math.round(offset / cardWidth);
            setActiveIndex(newIndex);
          }}
        >
          {cards && cards.map((card: any) => (
            <View key={card.id} style={styles.cardWrapper}>
              <BlessingCard
                card={card}
                isFlipped={flippedCards[card.id] || false}
                onFlip={() => toggleFlip(card.id)}
              />
            </View>
          ))}
        </ScrollView>
        {/* <View style={styles.navigationButtons}> */}
        <Pressable
          style={[
            styles.navButtonLeft,
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
            styles.navButtonRight,
            activeIndex === cards.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={() => navigateCards('right')}
          disabled={activeIndex === cards.length - 1}
        >
          <LinearGradient
            colors={['#360059', '#581189']}
            style={styles.navButtonGradient}
          >
            <ChevronRight color="#FFD700" size={32} />
          </LinearGradient>
        </Pressable>
        {/* </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  backgroundPanel: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'rgba(70, 10, 100, 0.35)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    height: 570,
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
  cardsContainer: {
    flex: 1,
    width: '100%',
  },
  cardsContent: {
    paddingLeft: (SCREEN_WIDTH - 40 - (SCREEN_WIDTH * 0.65 + 20)) / 2,
    paddingRight: (SCREEN_WIDTH - 40 - (SCREEN_WIDTH * 0.65 + 20)) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: SCREEN_WIDTH * 0.65,
    height: 380,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  cardInner: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
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
    zIndex: 5000,
    backgroundColor: 'red',
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
  innerBorder: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    zIndex: 1,
  },
  colorIconLine: {
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
    paddingHorizontal: 10,
  },
  navButtonLeft: {
    zIndex: 15,
    position: 'absolute',
    left: 10,
    bottom: "35%",
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  navButtonRight: {
    zIndex: 15,
    position: 'absolute',
    right: 10,
    bottom: "35%",
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
});
