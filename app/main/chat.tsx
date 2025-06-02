import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Clock } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
  withDelay,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
// import BackgroundStars from '../../components/BackgroundStars';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
};

const sampleResponses = [
  "Venus aur Mars ki positioning suggest karti hai ki aapka career growth ka time aa raha hai. Next 3 months mein ek bada opportunity milne ki sambhavna hai.",
  "Mercury retrograde khatam hone ke baad communication mein clarity aayegi. Tab tak patience rakhe aur preparation continue kare.",
  "Jupiter ki energy aapke favor mein hai. Creative projects pe focus kare, success zaroor milegi.",
  "Rahu indicates transformation period. Koi bhi decision lene se pehle deep research kare.",
];

const ANIMATION_CONFIG = {
  duration: 1500,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! Main aapki vedic astrologer Devi. Aaj ke stars kya kehte hain, jaanne ke liye koi sawaal poochiye.',
      isUser: false,
      timestamp: '11:59 AM',
      status: 'read'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isThinking, setIsThinking] = useState(false);
  const logoFloat = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const logoGlowScale = useSharedValue(1);
  const logoGlowOpacity = useSharedValue(0);

  const floatAnimation = useMemo(() => {
    return withRepeat(
      withSequence(
        withTiming(-5, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  React.useEffect(() => {
    logoFloat.value = floatAnimation;
    return () => {
      cancelAnimation(logoFloat);
    };
  }, []);

  React.useEffect(() => {
    if (isThinking) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0);
    }
  }, [isThinking]);

  React.useEffect(() => {
    if (isThinking) {
      logoGlowScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      logoGlowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      logoGlowScale.value = withTiming(1);
      logoGlowOpacity.value = withTiming(0);
    }
  }, [isThinking]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoFloat.value }]
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const logoGlowStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      logoGlowScale.value,
      [1, 1.2],
      [1, 1.2]
    );
    
    return {
      transform: [{ scale }],
      opacity: logoGlowOpacity.value,
    };
  });

  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
      });

      const userMessage: Message = {
        id: Date.now().toString(),
        text: newMessage,
        isUser: true,
        timestamp: currentTime,
        status: 'sending'
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsThinking(true);

      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'delivered' } 
              : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { 
            hour: '2-digit',
            minute: '2-digit',
            hour12: true 
          }),
          status: 'read'
        };
        setIsThinking(false);
        setMessages(prev => [...prev, botResponse]);
      }, 2000 + Math.random() * 1000);
    }
  }, [newMessage]);

  const MessageBubble = React.memo(({ message }: { message: Message }) => {
    const gradientPosition = useSharedValue(-SCREEN_WIDTH);
    
    React.useEffect(() => {
      if (!message.isUser) {
        gradientPosition.value = withRepeat(
          withSequence(
            withTiming(-SCREEN_WIDTH, { duration: 0 }),
            withTiming(SCREEN_WIDTH * 2, {
              duration: 4000,
              easing: Easing.bezier(0.4, 0, 0.6, 1),
            })
          ),
          -1,
          false
        );
        
        return () => {
          cancelAnimation(gradientPosition);
        };
      }
    }, [message.isUser]);

    const animatedGradientStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: gradientPosition.value }],
      opacity: interpolate(
        gradientPosition.value,
        [-SCREEN_WIDTH, -SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_WIDTH * 2],
        [0, 0.5, 0.9, 0.5, 0]
      ),
    }));

    return (
      <View style={[
        styles.messageWrapper,
        message.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
      ]}>
        <View style={[
          styles.messageBubble,
          message.isUser ? styles.userMessage : styles.botMessage,
          !message.isUser && styles.botMessageBorder,
        ]}>
          {!message.isUser && (
            <AnimatedLinearGradient
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.2)',
                'rgba(255, 255, 255, 0.5)',
                'rgba(255, 255, 255, 0.2)',
                'transparent'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                StyleSheet.absoluteFill,
                { transform: [{ rotate: '45deg' }] },
                animatedGradientStyle
              ]}
            />
          )}
          <Text style={[styles.messageText, { color: message.isUser ? '#fff' : '#000' }]}>{message.text}</Text>
          <View style={styles.messageFooter}>
            {!message.isUser && (
              <Text style={styles.signature}>- Ask Devi</Text>
            )}
            <Text style={[
              styles.timestamp,
              message.isUser ? styles.userTimestamp : styles.botTimestamp
            ]}>{message.timestamp}</Text>
            {message.isUser && (
              <View style={styles.statusContainer}>
                {message.status === 'delivered' && (
                  <View style={styles.tickWrapper}>
                    <Image 
                      source={require('../../assets/images/tick.png')}
                      style={styles.tickImage}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  });

  const HeaderContent = React.memo(() => {
    const AnimatedGlow = () => (
      <Animated.View style={[styles.logoGlow, logoGlowStyle]}>
        <AnimatedSvg height="120" width="120" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient
              id="logo-glow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#f7c615" stopOpacity="0.5" />
              <Stop offset="0.4" stopColor="#f7c615" stopOpacity="0.3" />
              <Stop offset="0.7" stopColor="#f7c615" stopOpacity="0.1" />
              <Stop offset="1" stopColor="#f7c615" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="60" cy="60" r="60" fill="url(#logo-glow)" />
        </AnimatedSvg>
      </Animated.View>
    );

    return (
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.iconButton}>
          <X color="#f7c615" size={24} />
        </TouchableOpacity>
        
        <View style={styles.logoWrapper}>
          {isThinking && <AnimatedGlow />}
          <Animated.Image 
            source={require('../../assets/images/logo.png')}
            style={[styles.logo, logoStyle]}
          />
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.credits}>
            <Clock size={14} color="#f7c615" />
            <Text style={styles.creditsText}>19</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  const TypingDots = () => {
    const dots = [0, 1, 2];
    const animations = dots.map(() => useSharedValue(0));

    React.useEffect(() => {
      dots.forEach((_, index) => {
        animations[index].value = withRepeat(
          withSequence(
            withDelay(index * 200,
              withTiming(1, { duration: 400 })
            ),
            withDelay(600,
              withTiming(0, { duration: 400 })
            )
          ),
          -1
        );
      });

      return () => {
        animations.forEach(anim => cancelAnimation(anim));
      };
    }, []);

    return (
      <View style={styles.dotsContainer}>
        <BlurView intensity={Platform.OS === 'ios' ? 60 : 100} tint="dark" style={styles.dotsBlurBackground}>
          {dots.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                useAnimatedStyle(() => ({
                  transform: [{ scale: animations[index].value }],
                  opacity: animations[index].value,
                })),
              ]}
            />
          ))}
        </BlurView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <LinearGradient
          colors={['#360059', '#1D0033', '#0D0019']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        
        {/* <BackgroundStars count={30} /> */}

        <View style={styles.header}>
          <BlurView intensity={Platform.OS === 'ios' ? 60 : 100} tint="dark" style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={['rgba(88, 17, 137, 0.8)', 'rgba(88, 17, 137, 0.6)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </BlurView>
          <HeaderContent />
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isThinking && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingContainer}>
                <Image 
                  source={require('../../assets/images/welcome.png')}
                  style={styles.typingImage}
                  resizeMode="contain"
                />
                <TypingDots />
              </View>
            </View>
          )}
        </ScrollView>

        <Text style={styles.copyright}>
          © Ask Devi. All rights reserved.
        </Text>

        <View style={styles.inputContainer}>
          <BlurView intensity={Platform.OS === 'ios' ? 60 : 100} tint="dark" style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={['rgba(88, 17, 137, 0.8)', 'rgba(88, 17, 137, 0.6)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </BlurView>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your question..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              multiline
            />
            <TouchableOpacity 
              onPress={sendMessage} 
              style={styles.sendButton}
              disabled={!newMessage.trim()}
            >
              <Text style={[
                styles.sendButtonText,
                !newMessage.trim() && styles.sendButtonDisabled
              ]}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#360059',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247, 198, 21, 0.3)',
    height: Platform.OS === 'ios' ? 120 : 100,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDots: {
    color: '#f7c615',
    fontSize: 24,
    fontWeight: '600',
  },
  logoWrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 48,
    height: 48,
    transform: [{ translateX: -24 }, { translateY: -24 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    left: -36,
    top: -36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  credits: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(88, 17, 137, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#f7c615',
  },
  creditsText: {
    color: '#f7c615',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  userMessage: {
    backgroundColor: '#581189',
  },
  botMessage: {
    backgroundColor: '#e3dff2',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  botMessageBorder: {
    borderWidth: 1,
    borderColor: 'rgba(247, 198, 21, 0.3)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  signature: {
    color: '#000',
    fontSize: 10,
  },
  timestamp: {
    fontSize: 10,
    marginLeft: 8,
  },
  userTimestamp: {
    color: '#fff',
  },
  botTimestamp: {
    color: '#000',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  tickWrapper: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tickImage: {
    width: 10,
    height: 10,
    tintColor: '#ffffff',
    opacity: 0.8,
    resizeMode: 'contain',
  },
  typingIndicator: {
    position: 'absolute',
    bottom: -70,
    left: -210,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  typingImage: {
    width: 160,
    height: 160,
    marginRight: -20,
    marginTop: 60,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsBlurBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(54, 0, 89, 0.8)',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(247, 198, 21, 0.3)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  copyright: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    paddingVertical: 8,
    backgroundColor: '#360058',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(247, 198, 21, 0.3)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 100,
    backgroundColor: 'rgba(88, 17, 137, 0.3)',
    borderRadius: 23,
    paddingHorizontal: 20,
    paddingRight: 50,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(247, 198, 21, 0.3)',
  },
  sendButton: {
    position: 'absolute',
    right: 12,
    bottom: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#f7c615',
    fontSize: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});