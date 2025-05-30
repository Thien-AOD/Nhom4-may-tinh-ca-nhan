import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import Colors from '@/constants/colors';

interface ShakeNotificationProps {
  message: string;        // Nội dung thông báo hiển thị
  visible: boolean;       // Trạng thái hiển thị/ẩn của thông báo
  onHide: () => void;     // Callback khi thông báo ẩn đi
  isDarkMode: boolean;    // Chế độ tối hay sáng
}

export default function ShakeNotification({
  message,
  visible,
  onHide,
  isDarkMode
}: ShakeNotificationProps) {
  // Khai báo animation giá trị opacity bắt đầu từ 0 (ẩn)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Lấy theme màu theo chế độ tối/sáng
  const theme = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    if (visible) {
      // Khi visible = true, thực hiện animation fade-in (hiện lên)
      Animated.timing(fadeAnim, {
        toValue: 1,           // Opacity từ 0 lên 1
        duration: 300,        // Trong 300ms
        useNativeDriver: true,
      }).start();
      
      // Tự động ẩn sau 2 giây
      const timer = setTimeout(() => {
        // Thực hiện animation fade-out (ẩn đi)
        Animated.timing(fadeAnim, {
          toValue: 0,         // Opacity từ 1 xuống 0
          duration: 300,      // Trong 300ms
          useNativeDriver: true,
        }).start(() => {
          // Sau khi ẩn xong, gọi callback onHide để báo hiệu component cha
          onHide();
        });
      }, 2000);

      // Cleanup timer khi component unmount hoặc visible thay đổi
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Nếu không visible thì không render gì
  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,                // Áp dụng opacity animation
          backgroundColor: theme.displayBackground, // Nền theo theme
          borderColor: theme.operationButton,       // Viền theo theme
        }
      ]}
    >
      <Text style={[styles.message, { color: theme.primaryText }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',     // Thông báo nổi trên các view khác
    top: 100,                // Cách đỉnh màn hình 100px
    alignSelf: 'center',     // Canh giữa theo chiều ngang
    paddingHorizontal: 20,   // Padding ngang
    paddingVertical: 12,     // Padding dọc
    borderRadius: 25,        // Bo tròn góc
    borderWidth: 1,          // Viền 1px
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Bóng đổ nhẹ
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,            // Shadow trên Android
    zIndex: 1000,            // Đảm bảo nổi trên các thành phần khác
  },
  message: {
    fontSize: 16,
    fontWeight: '600',       // Chữ đậm vừa phải
  },
});
