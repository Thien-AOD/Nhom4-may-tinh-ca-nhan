import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Colors from '@/constants/colors';

// Định nghĩa kiểu props cho component hiển thị kết quả và biểu thức
interface CalculatorDisplayProps {
  value: string;           // Giá trị hiện tại đang hiển thị (số hoặc kết quả)
  expression?: string;     // Biểu thức toán học (ví dụ: "3 +")
  isDarkMode?: boolean;    // Có phải đang dùng chế độ tối hay không (mặc định false)
}

// Lấy chiều rộng màn hình để tính kích thước phần hiển thị
const { width } = Dimensions.get('window');

export default function CalculatorDisplay({
  value,
  expression = '',   // Giá trị mặc định nếu không truyền expression là chuỗi rỗng
  isDarkMode = false, // Mặc định không dùng chế độ tối
}: CalculatorDisplayProps) {
  // Lấy màu sắc theo theme hiện tại
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    // Khung chứa phần hiển thị biểu thức và kết quả
    <View style={[styles.container, { backgroundColor: theme.displayBackground }]}>
      
      {/* Nếu có biểu thức thì hiển thị */}
      {expression ? (
        <Text style={[styles.expression, { color: theme.secondaryText }]}>
          {expression}
        </Text>
      ) : null}

      {/* Hiển thị giá trị chính (kết quả hoặc số đang nhập) */}
      <Text 
        style={[styles.value, { color: theme.primaryText }]}
        numberOfLines={1}            // Giới hạn chỉ 1 dòng, nếu dài quá sẽ thu nhỏ font
        adjustsFontSizeToFit         // Tự động giảm cỡ chữ nếu chữ quá dài vượt khung
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 30,          // Rộng gần bằng màn hình trừ padding 15 bên trái và phải
    minHeight: 120,             // Chiều cao tối thiểu để đủ chứa chữ lớn
    padding: 20,                // Padding bên trong để chữ không dính sát viền
    borderRadius: 15,           // Bo góc để nhìn mềm mại
    justifyContent: 'flex-end', // Canh chữ xuống dưới cùng theo chiều dọc
    alignItems: 'flex-end',     // Canh chữ sang phải theo chiều ngang
    marginBottom: 20,           // Khoảng cách bên dưới với phần tử khác
    shadowColor: 'rgba(0, 0, 0, 0.1)',  // Màu bóng đổ rất nhẹ
    shadowOffset: { width: 0, height: 2 }, // Bóng đổ lệch xuống dưới
    shadowOpacity: 0.2,         // Độ mờ bóng đổ
    shadowRadius: 3,            // Độ lan tỏa bóng đổ
    elevation: 3,               // Bóng đổ trên Android
  },
  expression: {
    fontSize: 20,               // Cỡ chữ vừa phải cho biểu thức nhỏ
    marginBottom: 10,           // Cách biệt giữa biểu thức và giá trị chính
  },
  value: {
    fontSize: 48,               // Cỡ chữ lớn cho giá trị hiển thị chính
    fontWeight: '300',          // Độ đậm nhẹ để nhìn thanh thoát
  },
});
