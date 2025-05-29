import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Colors from '@/constants/colors';

interface CalculatorDisplayProps {
  value: string;
  expression?: string;
  isDarkMode?: boolean;
}

const { width } = Dimensions.get('window');

export default function CalculatorDisplay({
  value,
  expression = '',
  isDarkMode = false,
}: CalculatorDisplayProps) {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.displayBackground }]}>
      {expression ? (
        <Text style={[styles.expression, { color: theme.secondaryText }]}>
          {expression}
        </Text>
      ) : null}
      <Text 
        style={[styles.value, { color: theme.primaryText }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 30,
    minHeight: 120,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  expression: {
    fontSize: 20,
    marginBottom: 10,
  },
  value: {
    fontSize: 48,
    fontWeight: '300',
  },
});