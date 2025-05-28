import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepPurple.DEFAULT,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
  },
  heading: {
    fontFamily: 'Cormorant-Bold',
    fontSize: 28,
    color: Colors.white,
    textAlign: 'center',
  },
  subheading: {
    fontFamily: 'Cormorant-Medium',
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
  },
  bodyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.white,
  },
  smallText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.white,
  },
  goldGradient: {
    colors: [Colors.gold.dark, Colors.gold.DEFAULT, Colors.gold.light],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  purpleGradient: {
    colors: [Colors.deepPurple.dark, Colors.deepPurple.DEFAULT, Colors.deepPurple.light],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  shadowLight: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  shadowMedium: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.deepPurple.DEFAULT,
  },
});

export const getTextShadow = (color: string, opacity: number = 0.5, blur: number = 10) => {
  return {
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: blur,
  };
};

export default {
  Colors,
  GlobalStyles,
  getTextShadow,
};