import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { useCalculatorStore } from '@/store/calculatorStore';
import HistoryList from '@/components/Calculator/HistoryList';
import Colors from '@/constants/colors';

export default function HistoryScreen() {
  const { history, clearHistory, isDarkMode } = useCalculatorStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />
      <View style={styles.content}>
        <HistoryList 
          history={history} 
          onClear={clearHistory}
          isDarkMode={isDarkMode}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
});