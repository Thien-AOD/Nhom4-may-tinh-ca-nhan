import React from "react";
import { Tabs } from "expo-router";
import { Calculator, History } from 'lucide-react-native';
import { useCalculatorStore } from '@/store/calculatorStore';
import Colors from "@/constants/colors";

export default function TabLayout() {
  const isDarkMode = useCalculatorStore(state => state.isDarkMode);
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.operationButton,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.background,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color }) => <Calculator size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}