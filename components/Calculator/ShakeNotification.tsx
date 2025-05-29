import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import Colors from '@/constants/colors';

interface ShakeNotificationProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  isDarkMode: boolean;
}

export default function ShakeNotification({
  message,
  visible,
  onHide,
  isDarkMode
}: ShakeNotificationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto hide after 2 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          backgroundColor: theme.displayBackground,
          borderColor: theme.operationButton,
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
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
  },
});