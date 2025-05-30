import React from 'react';
// Import các thành phần cần thiết từ react-native
import { 
  StyleSheet, // Tạo style cho component
  Text, // Hiển thị chữ
  TouchableOpacity, // Nút bấm có hiệu ứng chạm
  Dimensions, // Lấy kích thước màn hình
  Platform // Kiểm tra nền tảng (iOS, Android, web)
} from 'react-native';
import * as Haptics from 'expo-haptics'; // Hiệu ứng rung khi bấm nút
import Colors from '@/constants/colors'; // Màu sắc dùng cho giao diện

// Định nghĩa kiểu dữ liệu cho props của CalculatorButton
interface CalculatorButtonProps {
  text: string; // Chữ trên nút
  onPress: () => void; // Hàm xử lý khi bấm nút
  type?: 'number' | 'operation' | 'function' | 'equal'; // Loại nút
  isDouble?: boolean; // Nút chiếm 2 cột không (ví dụ nút 0)
  isDarkMode?: boolean; // Giao diện tối hay sáng
}

// Lấy chiều rộng màn hình thiết bị
const { width } = Dimensions.get('window');
// Tính chiều rộng mỗi nút (chia đều cho 4 cột, trừ khoảng cách)
const buttonWidth = (width - 50) / 4;

// Component nút máy tính
export default function CalculatorButton(props: CalculatorButtonProps) {
  // Lấy giá trị props
  const { text, onPress, type = 'number', isDouble = false, isDarkMode = false } = props;
  // Chọn theme màu theo chế độ sáng/tối
  const theme = isDarkMode ? Colors.dark : Colors.light;

  // Hàm xử lý khi bấm nút
  const handlePress = () => {
    // Nếu không phải nền tảng web thì tạo hiệu ứng rung
    if (Platform.OS !== 'web') {
      // Nếu là nút chức năng hoặc nút 'C' thì rung mạnh hơn
      if (type === 'function' || text === 'C') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        // Các nút khác rung nhẹ hơn
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    // Gọi hàm xử lý khi bấm nút
    onPress();
  };

  // Tạo style cho nút dựa vào loại nút, kích thước và màu sắc
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

  // Tạo style cho chữ trên nút dựa vào loại nút và màu sắc
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

  // Trả về giao diện nút bấm
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

// Định nghĩa các style cho nút và chữ
const styles = StyleSheet.create({
  button: {
    height: buttonWidth, // Chiều cao nút
    borderRadius: buttonWidth / 2, // Bo tròn nút
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    margin: 5, // Khoảng cách giữa các nút
    shadowOffset: { width: 0, height: 2 }, // Đổ bóng
    shadowOpacity: 0.2, // Độ mờ bóng
    shadowRadius: 3, // Bán kính bóng
    elevation: 3, // Độ nổi (Android)
  },
  buttonText: {
    fontSize: 28, // Cỡ chữ
    fontWeight: '500', // Độ đậm chữ
  },
});