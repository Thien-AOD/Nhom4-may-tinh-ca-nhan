import React from "react";
// Import Tabs từ expo-router để tạo thanh điều hướng dạng tab
import { Tabs } from "expo-router";

// Import icon Calculator và History từ thư viện lucide-react-native
import { Calculator, History } from 'lucide-react-native';

// Import hook useCalculatorStore để lấy trạng thái dark mode từ store
import { useCalculatorStore } from '@/store/calculatorStore';

// Import bảng màu (theme) được định nghĩa sẵn cho app (gồm màu sáng và tối)
import Colors from "@/constants/colors";

export default function TabLayout() {
  // Lấy trạng thái dark mode từ store (true: đang bật chế độ tối, false: sáng)
  const isDarkMode = useCalculatorStore(state => state.isDarkMode);

  // Chọn bảng màu dựa trên trạng thái dark mode
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        // Màu sắc cho icon/text khi tab được chọn (active)
        tabBarActiveTintColor: theme.operationButton,

        // Màu sắc cho icon/text khi tab không được chọn (inactive)
        tabBarInactiveTintColor: theme.secondaryText,

        // Style cho thanh tab (nền màu)
        tabBarStyle: {
          backgroundColor: theme.background,
        },

        // Style cho thanh header (nền màu)
        headerStyle: {
          backgroundColor: theme.background,
        },

        // Màu chữ và icon trên header
        headerTintColor: theme.text,
      }}
    >
      {/* Tab màn hình chính (Calculator) */}
      <Tabs.Screen
        name="index" // Tên màn hình, liên kết với file index.tsx
        options={{
          title: "Calculator", // Tiêu đề hiển thị trên header và tab
          tabBarIcon: ({ color }) => (
            <Calculator size={24} color={color} /> // Icon máy tính, màu tự động theo trạng thái tab
          ),
        }}
      />

      {/* Tab màn hình lịch sử (History) */}
      <Tabs.Screen
        name="history" // Tên màn hình, liên kết với file history.tsx
        options={{
          title: "History", // Tiêu đề hiển thị trên header và tab
          tabBarIcon: ({ color }) => (
            <History size={24} color={color} /> // Icon lịch sử, màu tự động theo trạng thái tab
          ),
        }}
      />
    </Tabs>
  );
}
