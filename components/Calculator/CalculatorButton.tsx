import React from 'react';
import { 
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface CalculatorButtonProps {
  text: string;
  onPress: () => void;
  type?: 'number' | 'operation' | 'function' | 'equal';
  isDouble?: boolean;
  isDarkMode?: boolean;
}

const { width } = Dimensions.get('window');
const buttonWidth = (width - 50) / 4;

export default function CalculatorButton(props: CalculatorButtonProps) {
  const { text, onPress, type = 'number', isDouble = false, isDarkMode = false } = props;
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      if (type === 'function' || text === 'C') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    onPress();
  };

  const buttonStyle = [
    styles.button,
    { width: isDouble ? buttonWidth * 2 + 10 : buttonWidth },
    {
      backgroundColor: 
        type === 'number'
          ? theme.numberButton
          : type === 'operation'
            ? theme.operationButton
            : type === 'equal'
              ? theme.equalButton
              : theme.functionButton,
      shadowColor: theme.shadow,
    },
  ];

  const textStyle = [
    styles.buttonText,
    {
      color: 
        type === 'number'
          ? theme.numberButtonText
          : type === 'operation'
            ? theme.operationButtonText
            : type === 'equal'
              ? theme.equalButtonText
              : theme.functionButtonText,
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: buttonWidth,
    borderRadius: buttonWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '500',
  },
});