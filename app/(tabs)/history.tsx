import React from 'react';
// Import các component cần thiết từ React Native
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';

// Import hook lấy dữ liệu từ store (lịch sử, clear, chế độ tối)
import { useCalculatorStore } from '@/store/calculatorStore';

// Import component hiển thị danh sách lịch sử tính toán
import HistoryList from '@/components/Calculator/HistoryList';

// Import bảng màu theme sáng/tối
import Colors from '@/constants/colors';

export default function HistoryScreen() {
  // Lấy các dữ liệu cần thiết từ store:
  // history: danh sách lịch sử tính toán
  // clearHistory: hàm xóa toàn bộ lịch sử
  // isDarkMode: trạng thái dark mode (true/false)
  const { history, clearHistory, isDarkMode } = useCalculatorStore();

  // Chọn bảng màu phù hợp với chế độ sáng/tối
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    // SafeAreaView giúp tránh các vùng bị che bởi notch, thanh trạng thái
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* StatusBar thay đổi màu sắc và kiểu chữ theo dark mode */}
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />

      {/* View chính chứa nội dung lịch sử */}
      <View style={styles.content}>
        {/* Component HistoryList nhận props:
            - history: dữ liệu lịch sử
            - onClear: hàm gọi khi xóa lịch sử
            - isDarkMode: để điều chỉnh giao diện */}
        <HistoryList 
          history={history} 
          onClear={clearHistory}
          isDarkMode={isDarkMode}
        />
      </View>
    </SafeAreaView>
  );
}

// Định nghĩa style cho các thành phần giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ màn hình
  },
  content: {
    flex: 1, // Chiếm toàn bộ không gian còn lại trong container
    padding: 15, // Khoảng cách bên trong
    alignItems: 'center', // Canh giữa theo chiều ngang
  },
});
