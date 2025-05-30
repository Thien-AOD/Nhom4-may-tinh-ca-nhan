import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native'; // Icon chữ X dùng cho nút xóa lịch sử
import Colors from '@/constants/colors';

// Định nghĩa kiểu props cho component lịch sử tính toán
interface HistoryListProps {
  history: string[];      // Mảng các biểu thức hoặc kết quả đã tính trước đó
  onClear: () => void;    // Hàm callback để xóa hết lịch sử
  isDarkMode?: boolean;   // Chế độ tối hay sáng, mặc định false (sáng)
}

export default function HistoryList({
  history,
  onClear,
  isDarkMode = false,
}: HistoryListProps) {
  // Lấy theme màu theo chế độ tối/sáng
  const theme = isDarkMode ? Colors.dark : Colors.light;

  // Nếu lịch sử trống, hiển thị thông báo không có lịch sử
  if (history.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.displayBackground }]}>
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
          No calculation history yet
        </Text>
      </View>
    );
  }

  // Nếu có lịch sử, hiển thị danh sách lịch sử cùng nút xóa
  return (
    <View style={[styles.container, { backgroundColor: theme.displayBackground }]}>
      {/* Header chứa tiêu đề và nút xóa lịch sử */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primaryText }]}>History</Text>
        {/* Nút xóa gọi hàm onClear khi nhấn */}
        <TouchableOpacity onPress={onClear}>
          <X size={20} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Danh sách lịch sử sử dụng FlatList */}
      <FlatList
        data={history.slice().reverse()}  // Đảo ngược lịch sử để hiển thị mới nhất lên trên
        keyExtractor={(item, index) => `history-${index}`}  // Key duy nhất cho mỗi item
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
    borderRadius: 15,       // Bo góc cho khung lịch sử
    padding: 15,            // Padding bên trong
    marginTop: 20,          // Khoảng cách trên với phần tử trước
    maxHeight: 200,         // Giới hạn chiều cao tối đa để không chiếm quá nhiều không gian
    width: '100%',          // Rộng 100% vùng cha chứa
  },
  emptyContainer: {
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',   // Canh giữa theo chiều ngang
    justifyContent: 'center', // Canh giữa theo chiều dọc
    height: 100,
    width: '100%',
  },
  emptyText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',            // Hiển thị theo hàng ngang
    justifyContent: 'space-between', // Căn đều 2 đầu (tiêu đề trái, nút xóa phải)
    alignItems: 'center',            // Căn giữa theo chiều dọc
    marginBottom: 10,                // Cách dưới với danh sách
  },
  title: {
    fontSize: 18,
    fontWeight: '600',               // Chữ đậm vừa phải cho tiêu đề
  },
  list: {
    width: '100%',
  },
  historyItem: {
    paddingVertical: 8,              // Khoảng cách trên dưới mỗi mục lịch sử
    borderBottomWidth: 1,            // Viền dưới mỗi mục
    borderBottomColor: 'rgba(150, 150, 150, 0.2)', // Màu viền nhạt
  },
  historyText: {
    fontSize: 16,
  },
});
