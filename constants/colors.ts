// Bảng màu cho ứng dụng máy tính, gồm 2 chế độ: sáng (light) và tối (dark)
export default {
  light: {
    background: "#F2F2F7",          // Màu nền chính của app (gần trắng xám)
    displayBackground: "#FFFFFF",   // Nền hiển thị kết quả (trắng)
    text: "#000000",                // Màu chữ chính (đen)
    primaryText: "#000000",         // Màu chữ chính (đen) dùng trong nhiều nơi
    secondaryText: "#8E8E93",       // Màu chữ phụ (xám nhạt)
    numberButton: "#F5F5F5",        // Màu nền nút số (xám rất nhạt)
    numberButtonText: "#000000",    // Màu chữ nút số (đen)
    operationButton: "#FF9500",     // Màu nền nút phép toán (cam sáng)
    operationButtonText: "#FFFFFF", // Màu chữ nút phép toán (trắng)
    functionButton: "#D1D1D6",      // Màu nền nút chức năng (xám nhạt)
    functionButtonText: "#000000",  // Màu chữ nút chức năng (đen)
    equalButton: "#FF9500",         // Màu nền nút bằng (=) (giống nút phép toán)
    equalButtonText: "#FFFFFF",     // Màu chữ nút bằng (=) (trắng)
    shadow: "rgba(0, 0, 0, 0.1)",  // Màu bóng đổ mờ nhẹ (đen với độ trong suốt 10%)
  },
  dark: {
    background: "#1C1C1E",          // Màu nền chính app chế độ tối (đen xám)
    displayBackground: "#2C2C2E",   // Nền hiển thị kết quả (đen xám đậm hơn)
    text: "#FFFFFF",                // Màu chữ chính (trắng)
    primaryText: "#FFFFFF",         // Màu chữ chính dùng trong nhiều nơi (trắng)
    secondaryText: "#8E8E93",       // Màu chữ phụ (xám nhạt, cùng với chế độ sáng)
    numberButton: "#333333",        // Màu nền nút số (xám đen)
    numberButtonText: "#FFFFFF",    // Màu chữ nút số (trắng)
    operationButton: "#FF9500",     // Màu nền nút phép toán (cam sáng, giữ nguyên)
    operationButtonText: "#FFFFFF", // Màu chữ nút phép toán (trắng)
    functionButton: "#505050",      // Màu nền nút chức năng (xám vừa)
    functionButtonText: "#FFFFFF",  // Màu chữ nút chức năng (trắng)
    equalButton: "#FF9500",         // Màu nền nút bằng (=) (giữ màu cam)
    equalButtonText: "#FFFFFF",     // Màu chữ nút bằng (=) (trắng)
    shadow: "rgba(0, 0, 0, 0.3)",  // Màu bóng đổ đậm hơn (đen với 30% opacity)
  }
};
