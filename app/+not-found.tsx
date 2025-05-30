import { Link, Stack } from "expo-router"; 
// Link: dùng để tạo đường dẫn chuyển trang (navigation)
// Stack: dùng để cấu hình màn hình và header trong navigation

import { StyleSheet, Text, View } from "react-native";
// Các component cơ bản của React Native:
// View: khung chứa, Text: hiển thị chữ, StyleSheet: tạo style

export default function NotFoundScreen() {
  return (
    <>
      {/* 
        Thiết lập tiêu đề cho màn hình trên thanh header
        Khi vào màn hình này, header sẽ hiển thị "Oops!"
      */}
      <Stack.Screen options={{ title: "Oops!" }} />

      {/* 
        Container chính của màn hình 
        flex:1 để chiếm hết không gian màn hình
        alignItems: "center" để căn giữa theo chiều ngang
        justifyContent: "center" để căn giữa theo chiều dọc
        padding: 20 để tạo khoảng cách trong
      */}
      <View style={styles.container}>

        {/* 
          Hiển thị thông báo lỗi khi người dùng truy cập trang không tồn tại 
          Font chữ to và đậm để thu hút sự chú ý
        */}
        <Text style={styles.title}>This screen doesn't exist.</Text>

        {/* 
          Link giúp người dùng quay lại trang chủ
          href="/" nghĩa là khi bấm sẽ chuyển về route chính
          style tạo khoảng cách và diện tích bấm dễ dàng
        */}
        <Link href="/" style={styles.link}>
          {/* 
            Text bên trong link
            Màu xanh dương, cỡ chữ nhỏ hơn để phân biệt với tiêu đề
          */}
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

// Tạo các style dùng cho các component trên
const styles = StyleSheet.create({
  container: {
    flex: 1,                 // Chiếm toàn bộ màn hình
    alignItems: "center",    // Căn giữa ngang
    justifyContent: "center",// Căn giữa dọc
    padding: 20,             // Khoảng cách bên trong container
  },
  title: {
    fontSize: 20,            // Cỡ chữ lớn cho tiêu đề
    fontWeight: "bold",      // In đậm chữ
  },
  link: {
    marginTop: 15,           // Khoảng cách trên link so với nội dung trên
    paddingVertical: 15,     // Tăng vùng bấm trên/dưới link cho dễ thao tác
  },
  linkText: {
    fontSize: 14,            // Cỡ chữ nhỏ hơn tiêu đề, phù hợp với link
    color: "#2e78b7",        // Màu xanh dương đặc trưng cho link
  },
});
