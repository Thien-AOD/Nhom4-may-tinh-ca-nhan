import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the types for our calculator state
type CalculatorState = {
  displayValue: string;
  previousValue: string | null;
  operator: string | null;
  waitingForOperand: boolean;
  history: string[];
  isDarkMode: boolean;
};

// Define the actions for our calculator
type CalculatorActions = {
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  clearDisplay: () => void;
  toggleSign: () => void;
  inputOperator: (nextOperator: string) => void;
  performOperation: () => void;
  toggleDarkMode: () => void;
  clearHistory: () => void;
  // New action for setting a calculation directly (for random calculations)
  setCalculation: (firstNumber: string, secondNumber: string, operator: string) => void;
};

// Create the store with Zustand
export const useCalculatorStore = create<CalculatorState & CalculatorActions>()(
  persist(
    (set, get) => ({
      displayValue: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
      history: [],
      isDarkMode: false,

      inputDigit: (digit) => {
        const { displayValue, waitingForOperand } = get();

        if (waitingForOperand) {
          set({
            displayValue: digit,
            waitingForOperand: false,
          });
        } else {
          set({
            displayValue:
              displayValue === '0' ? digit : displayValue + digit,
          });
        }
      },

      inputDecimal: () => {
        const { displayValue, waitingForOperand } = get();

        if (waitingForOperand) {
          set({
            displayValue: '0.',
            waitingForOperand: false,
          });
          return;
        }

        if (displayValue.indexOf('.') === -1) {
          set({
            displayValue: displayValue + '.',
          });
        }
      },

      clearDisplay: () => {
        set({
          displayValue: '0',
          previousValue: null,
          operator: null,
          waitingForOperand: false,
        });
      },

      toggleSign: () => {
        const { displayValue } = get();
        set({
          displayValue:
            displayValue.charAt(0) === '-'
              ? displayValue.substring(1)
              : '-' + displayValue,
        });
      },

      inputOperator: (nextOperator) => {
        const { displayValue, operator, previousValue } = get();
        const inputValue = parseFloat(displayValue);

        if (previousValue === null) {
          set({
            previousValue: displayValue,
            waitingForOperand: true,
            operator: nextOperator,
          });
        } else if (operator) {
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

          // Add to history
          const historyItem = `${currentValue} ${operator} ${inputValue} = ${newValue}`;
          const history = [...get().history, historyItem];

          set({
            displayValue: String(newValue),
            previousValue: String(newValue),
            waitingForOperand: true,
            operator: nextOperator,
            history,
          });
        }
      },

      performOperation: () => {
        const { displayValue, operator, previousValue } = get();
        
        if (!previousValue || !operator) {
          return;
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
              // Handle division by zero
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

        // Add to history
        const historyItem = `${currentValue} ${operator} ${inputValue} = ${newValue}`;
        const history = [...get().history, historyItem];

        set({
          displayValue: String(newValue),
          previousValue: null,
          operator: null,
          waitingForOperand: true,
          history,
        });
      },

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      // New method to set a calculation directly (for random calculations)
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
      name: 'calculator-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);