import React, { useState, useEffect } from 'react';
// Import các component và API cần thiết từ React Native
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

// Import hook lấy dữ liệu và thao tác từ store calculator
import { useCalculatorStore } from '@/store/calculatorStore';

// Import các component con dùng trong màn hình
import CalculatorButton from '@/components/Calculator/CalculatorButton';
import CalculatorDisplay from '@/components/Calculator/CalculatorDisplay';
import ShakeNotification from '@/components/Calculator/ShakeNotification';

// Import bảng màu sáng/tối
import Colors from '@/constants/colors';

// Import icon mặt trời & mặt trăng để chuyển đổi theme
import { Moon, Sun } from 'lucide-react-native';

// Hook phát hiện lắc điện thoại (shake)
import useShakeDetection from '@/hooks/useShakeDetection';

// Các hàm tạo phép tính & tin nhắn ngẫu nhiên
import { generateRandomCalculation, getRandomMessage } from '@/utils/randomCalculation';

export default function CalculatorScreen() {
  // Lấy nhiều giá trị và hàm từ store calculator (Zustand)
  const { 
    displayValue,       // Giá trị đang hiển thị trên màn hình
    previousValue,      // Giá trị trước đó (dùng khi tính toán)
    operator,           // Toán tử đang chọn (+, -, ×, ÷)
    inputDigit,         // Hàm nhập số
    inputDecimal,       // Hàm nhập dấu thập phân
    clearDisplay,       // Hàm xóa màn hình
    toggleSign,         // Hàm đổi dấu (+/-)
    inputOperator,      // Hàm nhập toán tử
    performOperation,   // Hàm thực hiện phép tính
    isDarkMode,         // Trạng thái chế độ tối/sáng
    toggleDarkMode,     // Hàm đổi chế độ tối/sáng
    setCalculation      // Hàm đặt phép tính mới (dùng khi lắc để random phép tính)
  } = useCalculatorStore();

  // State lưu hướng màn hình: portrait hoặc landscape
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height 
      ? 'landscape' 
      : 'portrait'
  );

  // State lưu trạng thái thông báo lắc điện thoại (shake)
  const [notification, setNotification] = useState({
    visible: false,  // Có hiện thông báo không
    message: ''      // Nội dung thông báo
  });

  // Lắng nghe thay đổi kích thước màn hình để cập nhật hướng (portrait/landscape)
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    // Cleanup khi component unmount
    return () => subscription.remove();
  }, []);

  // Hàm xử lý khi phát hiện lắc điện thoại
  const handleShake = () => {
    // 30% khả năng tạo phép tính ngẫu nhiên, 70% khả năng xóa màn hình
    if (Math.random() < 0.3) {
      // Tạo phép tính ngẫu nhiên
      const randomCalc = generateRandomCalculation();
      // Lấy tin nhắn ngẫu nhiên kèm theo
      const message = getRandomMessage();
      
      // Đặt phép tính mới lên store (hiển thị lên màn hình)
      setCalculation(
        String(randomCalc.firstNumber), 
        String(randomCalc.secondNumber), 
        randomCalc.operator
      );
      
      // Hiện thông báo tin nhắn vui
      setNotification({
        visible: true,
        message: message
      });
    } else {
      // Nếu không, xóa màn hình hiện tại
      clearDisplay();
      
      // Hiện thông báo "Calculator cleared!"
      setNotification({
        visible: true,
        message: "Calculator cleared!"
      });
    }
  };

  // Sử dụng hook phát hiện lắc (chỉ chạy trên mobile, không dùng trên web)
  useShakeDetection(handleShake);

  // Tạo chuỗi biểu thức để hiển thị (ví dụ: "12 +")
  const expressionValue = previousValue && operator 
    ? `${previousValue} ${operator}`
    : '';

  // Chọn bảng màu theo chế độ tối hoặc sáng
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    // SafeAreaView để tránh vùng bị che (notch, thanh trạng thái)
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Cấu hình thanh trạng thái (StatusBar) phù hợp chế độ sáng/tối */}
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />
      
      {/* Thanh chuyển đổi chế độ sáng/tối */}
      <View style={styles.themeToggle}>
        {/* Icon mặt trời (sáng) */}
        <Sun size={20} color={theme.secondaryText} />
        
        {/* Switch bật/tắt dark mode */}
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          style={styles.switch}
        />
        
        {/* Icon mặt trăng (tối) */}
        <Moon size={20} color={theme.secondaryText} />
      </View>

      {/* Hiển thị thông báo khi lắc điện thoại */}
      <ShakeNotification 
        message={notification.message}
        visible={notification.visible}
        onHide={() => setNotification({ ...notification, visible: false })}
        isDarkMode={isDarkMode}
      />

      {/* Khu vực cuộn chính chứa màn hình tính và các nút */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hiển thị giá trị hiện tại và biểu thức */}
        <CalculatorDisplay 
          value={displayValue} 
          expression={expressionValue}
          isDarkMode={isDarkMode}
        />

        {/* Gợi ý lắc thiết bị chỉ hiện trên mobile (không hiện trên web) */}
        {Platform.OS !== 'web' && (
          <Text style={[styles.shakeHint, { color: theme.secondaryText }]}>
            Shake your device to clear or get a surprise!
          </Text>
        )}

        {/* Container chứa các nút của máy tính */}
        <View style={orientation === 'landscape' ? styles.buttonsContainerLandscape : styles.buttonsContainer}>
          
          {/* Dòng nút 1: C, ±, %, ÷ */}
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
                // Chia giá trị hiện tại cho 100 khi nhấn %
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

          {/* Dòng nút 2: 7, 8, 9, × */}
          <View style={styles.row}>
            <CalculatorButton text="7" onPress={() => inputDigit('7')} isDarkMode={isDarkMode} />
            <CalculatorButton text="8" onPress={() => inputDigit('8')} isDarkMode={isDarkMode} />
            <CalculatorButton text="9" onPress={() => inputDigit('9')} isDarkMode={isDarkMode} />
            <CalculatorButton text="×" onPress={() => inputOperator('×')} type="operation" isDarkMode={isDarkMode} />
          </View>

          {/* Dòng nút 3: 4, 5, 6, - */}
          <View style={styles.row}>
            <CalculatorButton text="4" onPress={() => inputDigit('4')} isDarkMode={isDarkMode} />
            <CalculatorButton text="5" onPress={() => inputDigit('5')} isDarkMode={isDarkMode} />
            <CalculatorButton text="6" onPress={() => inputDigit('6')} isDarkMode={isDarkMode} />
            <CalculatorButton text="-" onPress={() => inputOperator('-')} type="operation" isDarkMode={isDarkMode} />
          </View>

          {/* Dòng nút 4: 1, 2, 3, + */}
          <View style={styles.row}>
            <CalculatorButton text="1" onPress={() => inputDigit('1')} isDarkMode={isDarkMode} />
            <CalculatorButton text="2" onPress={() => inputDigit('2')} isDarkMode={isDarkMode} />
            <CalculatorButton text="3" onPress={() => inputDigit('3')} isDarkMode={isDarkMode} />
            <CalculatorButton text="+" onPress={() => inputOperator('+')} type="operation" isDarkMode={isDarkMode} />
          </View>

          {/* Dòng nút 5: 0 (dài gấp đôi), ., = */}
          <View style={styles.row}>
            <CalculatorButton 
              text="0" 
              onPress={() => inputDigit('0')} 
              isDouble  // Nút 0 chiếm gấp đôi chiều rộng
              isDarkMode={isDarkMode}
            />
            <CalculatorButton text="." onPress={inputDecimal} isDarkMode={isDarkMode} />
            <CalculatorButton text="=" onPress={performOperation} type="equal" isDarkMode={isDarkMode} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Định nghĩa style cho các phần tử trong màn hình
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,  // Padding 2 bên màn hình
  },
  scrollContainer: {
    flexGrow: 1,             // Cho phép ScrollView mở rộng toàn bộ không gian
    alignItems: 'center',    // Canh giữa theo chiều ngang
    justifyContent: 'center',// Canh giữa theo chiều dọc
    paddingVertical: 20,     // Padding trên dưới
  },
  themeToggle: {
    flexDirection: 'row',    // Các phần tử nằm ngang
    alignItems: 'center',    // Canh giữa theo chiều dọc
    justifyContent: 'flex-end', // Đẩy sang phải
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0, // Tránh chèn lên StatusBar Android
    paddingRight: 10,
    marginTop: 10,
  },
  switch: {
    marginHorizontal: 10,    // Khoảng cách 2 bên switch
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonsContainerLandscape: {
    width: '100%',
    flexDirection: 'row',    // Nút xếp theo hàng ngang khi landscape
    flexWrap: 'wrap',        // Cho phép xuống hàng
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',    // Các nút trong 1 hàng nằm ngang
    marginBottom: 10,        // Khoảng cách dưới mỗi hàng
  },
  shakeHint: {
    marginBottom: 15,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
