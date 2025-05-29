import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  ScrollView, 
  Switch, 
  Text,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { useCalculatorStore } from '@/store/calculatorStore';
import CalculatorButton from '@/components/Calculator/CalculatorButton';
import CalculatorDisplay from '@/components/Calculator/CalculatorDisplay';
import ShakeNotification from '@/components/Calculator/ShakeNotification';
import Colors from '@/constants/colors';
import { Moon, Sun } from 'lucide-react-native';
import useShakeDetection from '@/hooks/useShakeDetection';
import { generateRandomCalculation, getRandomMessage } from '@/utils/randomCalculation';

export default function CalculatorScreen() {
  const { 
    displayValue, 
    previousValue, 
    operator, 
    inputDigit, 
    inputDecimal, 
    clearDisplay, 
    toggleSign, 
    inputOperator, 
    performOperation,
    isDarkMode,
    toggleDarkMode,
    setCalculation
  } = useCalculatorStore();

  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height 
      ? 'landscape' 
      : 'portrait'
  );

  const [notification, setNotification] = useState({
    visible: false,
    message: ''
  });

  // Handle screen orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => subscription.remove();
  }, []);

  // Handle shake detection
  const handleShake = () => {
    // 30% chance to show a random calculation, 70% chance to clear
    if (Math.random() < 0.3) {
      // Generate random calculation
      const randomCalc = generateRandomCalculation();
      const message = getRandomMessage();
      
      // Set the calculation in the store
      setCalculation(
        String(randomCalc.firstNumber), 
        String(randomCalc.secondNumber), 
        randomCalc.operator
      );
      
      // Show notification
      setNotification({
        visible: true,
        message: message
      });
    } else {
      // Clear the display
      clearDisplay();
      
      // Show notification
      setNotification({
        visible: true,
        message: "Calculator cleared!"
      });
    }
  };

  // Use shake detection hook (only on mobile)
  useShakeDetection(handleShake);

  // Create expression string for display
  const expressionValue = previousValue && operator 
    ? `${previousValue} ${operator}`
    : '';

  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />
      
      <View style={styles.themeToggle}>
        <Sun size={20} color={theme.secondaryText} />
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          style={styles.switch}
        />
        <Moon size={20} color={theme.secondaryText} />
      </View>

      <ShakeNotification 
        message={notification.message}
        visible={notification.visible}
        onHide={() => setNotification({ ...notification, visible: false })}
        isDarkMode={isDarkMode}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <CalculatorDisplay 
          value={displayValue} 
          expression={expressionValue}
          isDarkMode={isDarkMode}
        />

        {Platform.OS !== 'web' && (
          <Text style={[styles.shakeHint, { color: theme.secondaryText }]}>
            Shake your device to clear or get a surprise!
          </Text>
        )}

        <View style={orientation === 'landscape' ? styles.buttonsContainerLandscape : styles.buttonsContainer}>
          <View style={styles.row}>
            <CalculatorButton 
              text="C" 
              onPress={clearDisplay} 
              type="function"
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="±" 
              onPress={toggleSign} 
              type="function"
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="%" 
              onPress={() => {
                const value = parseFloat(displayValue) / 100;
                useCalculatorStore.setState({ displayValue: String(value) });
              }} 
              type="function"
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="÷" 
              onPress={() => inputOperator('÷')} 
              type="operation"
              isDarkMode={isDarkMode}
            />
          </View>

          <View style={styles.row}>
            <CalculatorButton 
              text="7" 
              onPress={() => inputDigit('7')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="8" 
              onPress={() => inputDigit('8')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="9" 
              onPress={() => inputDigit('9')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="×" 
              onPress={() => inputOperator('×')} 
              type="operation"
              isDarkMode={isDarkMode}
            />
          </View>

          <View style={styles.row}>
            <CalculatorButton 
              text="4" 
              onPress={() => inputDigit('4')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="5" 
              onPress={() => inputDigit('5')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="6" 
              onPress={() => inputDigit('6')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="-" 
              onPress={() => inputOperator('-')} 
              type="operation"
              isDarkMode={isDarkMode}
            />
          </View>

          <View style={styles.row}>
            <CalculatorButton 
              text="1" 
              onPress={() => inputDigit('1')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="2" 
              onPress={() => inputDigit('2')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="3" 
              onPress={() => inputDigit('3')}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="+" 
              onPress={() => inputOperator('+')} 
              type="operation"
              isDarkMode={isDarkMode}
            />
          </View>

          <View style={styles.row}>
            <CalculatorButton 
              text="0" 
              onPress={() => inputDigit('0')} 
              isDouble
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="." 
              onPress={inputDecimal}
              isDarkMode={isDarkMode}
            />
            <CalculatorButton 
              text="=" 
              onPress={performOperation} 
              type="equal"
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    paddingRight: 10,
    marginTop: 10,
  },
  switch: {
    marginHorizontal: 10,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonsContainerLandscape: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  shakeHint: {
    marginBottom: 15,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});