import { StatusBar } from "expo-status-bar"; 
// Import component để điều chỉnh màu sắc thanh trạng thái (status bar) trên điện thoại
import { Platform, StyleSheet, Text, View } from "react-native";
// Import các component cơ bản của React Native
// Platform: xác định hệ điều hành (iOS hay Android)
// StyleSheet: tạo style riêng cho component
// Text: hiển thị văn bản
// View: container để chứa các component con

export default function ModalScreen() {
  return (
    // View chính chứa toàn bộ nội dung modal
    <View style={styles.container}>
      {/* Tiêu đề modal, chữ lớn và in đậm */}
      <Text style={styles.title}>Modal</Text>

      {/* Dòng kẻ ngăn cách (separator) tạo khoảng cách */}
      <View style={styles.separator} />

      {/* Nội dung thông báo chính của modal */}
      <Text>This is an example modal. You can edit it in app/modal.tsx.</Text>

      {/* 
        Điều chỉnh màu thanh trạng thái (StatusBar)
        Nếu là iOS thì dùng màu sáng (light) để phù hợp với phần đen phía trên modal
        Nếu không phải iOS thì dùng tự động (auto)
      */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

// Định nghĩa style cho các thành phần trên
const styles = StyleSheet.create({
  container: {
    flex: 1,                 // Chiếm hết không gian màn hình
    alignItems: "center",    // Căn giữa nội dung theo chiều ngang
    justifyContent: "center",// Căn giữa nội dung theo chiều dọc
  },
  title: {
    fontSize: 20,            // Cỡ chữ lớn cho tiêu đề
    fontWeight: "bold",      // In đậm chữ
  },
  separator: {
    marginVertical: 30,      // Khoảng cách trên dưới cho dòng kẻ
    height: 1,               // Chiều cao dòng kẻ (1 pixel)
    width: "80%",            // Chiều ngang chiếm 80% chiều rộng màn hình
  },
});
