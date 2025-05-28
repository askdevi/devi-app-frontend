import { Platform, Pressable, TouchableOpacity } from 'react-native';

// Create a compatibility wrapper that uses the appropriate component
const TouchableWrapper = Platform.select({
  web: Pressable,
  default: TouchableOpacity,
}) as typeof TouchableOpacity;

export default TouchableWrapper;