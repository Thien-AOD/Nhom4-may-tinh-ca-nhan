import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface HistoryListProps {
  history: string[];
  onClear: () => void;
  isDarkMode?: boolean;
}

export default function HistoryList({
  history,
  onClear,
  isDarkMode = false,
}: HistoryListProps) {
  const theme = isDarkMode ? Colors.dark : Colors.light;

  if (history.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.displayBackground }]}>
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
          No calculation history yet
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.displayBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primaryText }]}>History</Text>
        <TouchableOpacity onPress={onClear}>
          <X size={20} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={history.slice().reverse()}
        keyExtractor={(item, index) => `history-${index}`}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={[styles.historyText, { color: theme.primaryText }]}>{item}</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    maxHeight: 200,
    width: '100%',
  },
  emptyContainer: {
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: '100%',
  },
  emptyText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  list: {
    width: '100%',
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  historyText: {
    fontSize: 16,
  },
});