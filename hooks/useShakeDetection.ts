import { useEffect, useState, useRef } from 'react';
import { Gyroscope } from 'expo-sensors';
import { Platform } from 'react-native';

// Tham số cấu hình cho việc phát hiện rung lắc (shake)
const SHAKE_THRESHOLD = 1.5;           // Ngưỡng cường độ chuyển động để tính là rung
const SHAKE_TIMEOUT = 1000;            // Thời gian tối thiểu giữa 2 lần rung (ms)
const SHAKE_COUNT_THRESHOLD = 3;       // Số lần chuyển động vượt ngưỡng để kích hoạt shake

export default function useShakeDetection(onShake: () => void) {
  // Lưu trạng thái gia tốc theo 3 trục (x, y, z)
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  // Lưu subscription để có thể hủy khi unmount
  const [subscription, setSubscription] = useState<ReturnType<typeof Gyroscope.addListener> | null>(null);
  
  // Sử dụng ref để lưu trạng thái giữa các lần render:
  const lastShakeTime = useRef(0);  // Thời điểm rung cuối cùng được phát hiện
  const shakeCount = useRef(0);     // Đếm số lần chuyển động vượt ngưỡng trong một chuỗi
  const lastX = useRef(0);           // Gia tốc lần đọc trước trên trục X
  const lastY = useRef(0);           // Gia tốc lần đọc trước trên trục Y
  const lastZ = useRef(0);           // Gia tốc lần đọc trước trên trục Z

  // Hàm bắt đầu đăng ký cảm biến gyroscope
  const _subscribe = () => {
    if (Platform.OS === 'web') {
      // Gyroscope không hỗ trợ trên web, chỉ log ra thôi
      console.log('Gyroscope not available on web');
      return;
    }
    
    Gyroscope.setUpdateInterval(100); // Cập nhật dữ liệu mỗi 100ms
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);       // Cập nhật giá trị gia tốc
        detectShake(gyroscopeData);   // Kiểm tra có rung lắc hay không
      })
    );
  };

  // Hàm hủy đăng ký khi component unmount
  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Hàm phát hiện rung lắc dựa trên gia tốc hiện tại
  const detectShake = (data: { x: number; y: number; z: number }) => {
    const now = Date.now();
    
    // Tính delta chuyển động so với lần đọc trước
    const deltaX = Math.abs(lastX.current - data.x);
    const deltaY = Math.abs(lastY.current - data.y);
    const deltaZ = Math.abs(lastZ.current - data.z);
    
    // Cập nhật lại gia tốc lần đọc trước
    lastX.current = data.x;
    lastY.current = data.y;
    lastZ.current = data.z;
    
    // Tính tổng chuyển động theo vector 3 chiều
    const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    
    // Nếu chuyển động vượt ngưỡng, tăng bộ đếm
    if (movement > SHAKE_THRESHOLD) {
      shakeCount.current += 1;
      
      // Nếu đủ số lần chuyển động và đủ thời gian từ lần rung trước,
      // xem như đã xảy ra 1 lần rung lắc, gọi callback
      if (shakeCount.current >= SHAKE_COUNT_THRESHOLD && now - lastShakeTime.current > SHAKE_TIMEOUT) {
        shakeCount.current = 0;       // Reset đếm
        lastShakeTime.current = now;  // Cập nhật thời điểm rung
        
        onShake();                    // Gọi hàm xử lý rung lắc bên ngoài
      }
    }
  };

  // Tự động đăng ký khi mount, hủy khi unmount
  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // Trả về dữ liệu gyroscope nếu muốn dùng thêm bên ngoài
  return { gyroscopeData: { x, y, z } };
}
