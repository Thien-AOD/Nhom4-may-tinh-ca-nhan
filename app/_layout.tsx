import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";
import Colors from "@/constants/colors";

// Cấu hình cho Expo Router: đặt tên route khởi đầu
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Ngăn splash screen tự động ẩn trước khi load assets xong
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Hook tải font FontAwesome, trả về trạng thái loaded/error
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Nếu lỗi trong quá trình tải font, ghi log và ném lỗi để xử lý ngoài
  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  // Khi font đã tải xong, ẩn splash screen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Nếu chưa load xong font, không render gì (tránh hiện UI lỗi)
  if (!loaded) {
    return null;
  }

  // Khi font đã load, render phần điều hướng chính
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // Lấy trạng thái chế độ sáng/tối từ store
  const isDarkMode = useCalculatorStore(state => state.isDarkMode);

  // Chọn theme tương ứng
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    // Stack navigator của expo-router, cấu hình style header và background theo theme
    <Stack
      screenOptions={{
        headerBackTitle: "Back",       // Text cho nút back trên header
        headerStyle: {
          backgroundColor: theme.background,  // Màu nền header theo theme
        },
        headerTintColor: theme.text,          // Màu chữ/nút header theo theme
        contentStyle: {
          backgroundColor: theme.background,  // Màu nền nội dung theo theme
        },
      }}
    >
      {/* Màn hình tab (gồm nhiều tab con), ẩn header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
