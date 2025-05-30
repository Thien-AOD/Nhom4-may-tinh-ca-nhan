import { create } from 'zustand'; 
// Tạo "cửa hàng" trạng thái (store) cho app

import AsyncStorage from '@react-native-async-storage/async-storage'; 
// Dùng để lưu dữ liệu vào bộ nhớ điện thoại (giữ khi tắt app)

import { persist, createJSONStorage } from 'zustand/middleware'; 
// Giúp tự động lưu trạng thái lâu dài (persist = lưu trữ)

// Định nghĩa những dữ liệu mà app sẽ quản lý:
type CalculatorState = {
  displayValue: string;       // Số đang hiển thị trên màn hình
  previousValue: string | null; // Số nhập trước đó, chưa tính xong
  operator: string | null;    // Phép toán đang chọn (+, -, ×, ÷)
  waitingForOperand: boolean; // Đang chờ nhập số mới (sau khi chọn phép toán)
  history: string[];          // Lịch sử các phép tính đã làm
  isDarkMode: boolean;        // Có đang bật chế độ tối không
};

// Các hành động thay đổi trạng thái
type CalculatorActions = {
  inputDigit: (digit: string) => void;       // Nhập 1 số
  inputDecimal: () => void;                   // Nhập dấu chấm (.)
  clearDisplay: () => void;                   // Xóa màn hình về 0
  toggleSign: () => void;                     // Đổi dấu số (+/-)
  inputOperator: (nextOperator: string) => void; // Nhập phép toán mới
  performOperation: () => void;                // Tính kết quả
  toggleDarkMode: () => void;                   // Bật/tắt chế độ tối
  clearHistory: () => void;                      // Xóa lịch sử tính toán
  setCalculation: (firstNumber: string, secondNumber: string, operator: string) => void; // Đặt phép tính trực tiếp
};

// Tạo store kết hợp lưu trữ lâu dài
export const useCalculatorStore = create<CalculatorState & CalculatorActions>()(
  persist(
    (set, get) => ({
      displayValue: '0',          // Màn hình ban đầu là 0
      previousValue: null,        // Chưa có số trước
      operator: null,             // Chưa chọn phép toán
      waitingForOperand: false,   // Không đang chờ số mới
      history: [],                // Lịch sử trống
      isDarkMode: false,          // Mặc định chế độ sáng

      // Nhập số mới
      inputDigit: (digit) => {
        const { displayValue, waitingForOperand } = get();

        if (waitingForOperand) {
          // Nếu vừa chọn phép toán thì bắt đầu nhập số mới
          set({
            displayValue: digit,     // Ghi số mới vào màn hình
            waitingForOperand: false, // Bỏ cờ chờ
          });
        } else {
          // Nếu đang nhập số thì nối số mới vào sau
          set({
            displayValue:
              displayValue === '0' ? digit : displayValue + digit,
          });
        }
      },

      // Nhập dấu chấm
      inputDecimal: () => {
        const { displayValue, waitingForOperand } = get();

        if (waitingForOperand) {
          // Nếu đang chờ số mới thì bắt đầu bằng "0."
          set({
            displayValue: '0.',
            waitingForOperand: false,
          });
          return;
        }

        // Nếu chưa có dấu chấm trong số đang nhập thì thêm dấu chấm
        if (displayValue.indexOf('.') === -1) {
          set({
            displayValue: displayValue + '.',
          });
        }
      },

      // Xóa màn hình về 0, reset mọi thứ
      clearDisplay: () => {
        set({
          displayValue: '0',
          previousValue: null,
          operator: null,
          waitingForOperand: false,
        });
      },

      // Đổi dấu số hiện tại
      toggleSign: () => {
        const { displayValue } = get();

        set({
          displayValue:
            displayValue.charAt(0) === '-' 
              ? displayValue.substring(1)  // Nếu là âm thì bỏ dấu -
              : '-' + displayValue,        // Nếu là dương thì thêm dấu -
        });
      },

      // Nhập phép toán mới (+, -, ×, ÷)
      inputOperator: (nextOperator) => {
        const { displayValue, operator, previousValue } = get();
        const inputValue = parseFloat(displayValue);

        if (previousValue === null) {
          // Lần đầu chọn phép toán thì lưu số hiện tại và nhớ phép toán
          set({
            previousValue: displayValue,
            waitingForOperand: true,  // Chờ nhập số mới
            operator: nextOperator,
          });
        } else if (operator) {
          // Nếu đã có phép toán trước đó thì tính kết quả luôn
          const currentValue = parseFloat(previousValue);
          let newValue;

          switch (operator) {
            case '+':
              newValue = currentValue + inputValue;
              break;
            case '-':
              newValue = currentValue - inputValue;
              break;
            case '×':
              newValue = currentValue * inputValue;
              break;
            case '÷':
              newValue = currentValue / inputValue;
              break;
            default:
              newValue = inputValue;
          }

          // Thêm phép tính vào lịch sử
          const historyItem = `${currentValue} ${operator} ${inputValue} = ${newValue}`;
          const history = [...get().history, historyItem];

          // Cập nhật kết quả mới lên màn hình và lưu phép toán tiếp theo
          set({
            displayValue: String(newValue),
            previousValue: String(newValue),
            waitingForOperand: true,
            operator: nextOperator,
            history,
          });
        }
      },

      // Khi bấm =, tính toán kết quả cuối cùng
      performOperation: () => {
        const { displayValue, operator, previousValue } = get();

        if (!previousValue || !operator) {
          return; // Không có gì để tính
        }

        const inputValue = parseFloat(displayValue);
        const currentValue = parseFloat(previousValue);
        let newValue;

        switch (operator) {
          case '+':
            newValue = currentValue + inputValue;
            break;
          case '-':
            newValue = currentValue - inputValue;
            break;
          case '×':
            newValue = currentValue * inputValue;
            break;
          case '÷':
            if (inputValue === 0) {
              // Nếu chia cho 0, báo lỗi
              set({
                displayValue: 'Error',
                previousValue: null,
                operator: null,
                waitingForOperand: true,
              });
              return;
            }
            newValue = currentValue / inputValue;
            break;
          default:
            newValue = inputValue;
        }

        // Ghi lại phép tính vào lịch sử
        const historyItem = `${currentValue} ${operator} ${inputValue} = ${newValue}`;
        const history = [...get().history, historyItem];

        // Hiển thị kết quả, reset phép toán
        set({
          displayValue: String(newValue),
          previousValue: null,
          operator: null,
          waitingForOperand: true,
          history,
        });
      },

      // Bật hoặc tắt chế độ tối
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },

      // Xóa toàn bộ lịch sử tính toán
      clearHistory: () => {
        set({ history: [] });
      },

      // Đặt phép tính trực tiếp (dùng cho tính toán ngẫu nhiên)
      setCalculation: (firstNumber, secondNumber, operator) => {
        set({
          displayValue: secondNumber,
          previousValue: firstNumber,
          operator: operator,
          waitingForOperand: true,
        });
      },
    }),
    {
      // Lưu trữ trạng thái trong AsyncStorage với key 'calculator-storage'
      name: 'calculator-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
