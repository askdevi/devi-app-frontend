import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SetupProgress from '@/components/Setup/SetupProgress';

export default function NameScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (name.trim()) {
      router.push('/setup/gender');
    }
  };

  const handleExit = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light]}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity 
        onPress={handleExit}
        style={styles.exitButton}
      >
        <X color={Colors.gold.DEFAULT} size={24} />
      </TouchableOpacity>

      <View style={styles.content}>
        <SetupProgress currentStep={1} totalSteps={4} />

        <View style={styles.header}>
          <Text style={styles.title}>Namaste</Text>
          <Text style={styles.subtitle}>Please enter your full name</Text>
        </View>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={`${Colors.gold.DEFAULT}40`}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.gradients.goldPrimary}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <ArrowRight color={Colors.deepPurple.DEFAULT} size={20} />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.quote}>
          The journey of self-discovery begins with a single step
        </Text>

        <TouchableOpacity
          onPress={handleExit}
          style={styles.exitTextButton}
        >
          <X color={`${Colors.gold.DEFAULT}50`} size={16} />
          <Text style={styles.exitText}>Exit Setup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exitButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 17, 82, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.gold.DEFAULT}20`,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.gold.DEFAULT,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  input: {
    backgroundColor: 'rgba(45, 17, 82, 0.3)',
    borderWidth: 2,
    borderColor: `${Colors.gold.DEFAULT}20`,
    borderRadius: 12,
    padding: 16,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
    marginRight: 8,
  },
  quote: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.white,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  exitTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  exitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: `${Colors.gold.DEFAULT}50`,
    marginLeft: 8,
  },
});