// Generate random calculations for the easter egg feature

// Random number generator within a range
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random operator selection
const getRandomOperator = (): string => {
  const operators = ['+', '-', '×', '÷'];
  return operators[Math.floor(Math.random() * operators.length)];
};

// Generate a fun calculation that has a reasonable result
export const generateRandomCalculation = (): {
  firstNumber: number;
  secondNumber: number;
  operator: string;
  result: number;
} => {
  let firstNumber: number;
  let secondNumber: number;
  let operator = getRandomOperator();
  let result: number;

  // Generate numbers based on operator to avoid weird results
  switch (operator) {
    case '+':
      firstNumber = getRandomNumber(1, 100);
      secondNumber = getRandomNumber(1, 100);
      result = firstNumber + secondNumber;
      break;
    case '-':
      firstNumber = getRandomNumber(50, 100);
      secondNumber = getRandomNumber(1, 49);
      result = firstNumber - secondNumber;
      break;
    case '×':
      firstNumber = getRandomNumber(1, 12);
      secondNumber = getRandomNumber(1, 12);
      result = firstNumber * secondNumber;
      break;
    case '÷':
      // Ensure clean division
      secondNumber = getRandomNumber(1, 10);
      result = getRandomNumber(1, 10);
      firstNumber = secondNumber * result;
      break;
    default:
      firstNumber = getRandomNumber(1, 100);
      secondNumber = getRandomNumber(1, 100);
      result = firstNumber + secondNumber;
      operator = '+';
  }

  return {
    firstNumber,
    secondNumber,
    operator,
    result
  };
};

// Fun messages to display with random calculations
export const getRandomMessage = (): string => {
  const messages = [
    "Shake it up!",
    "Magic calculation!",
    "Math surprise!",
    "Shake for more!",
    "Random math!",
    "Math magic!",
    "Shake-a-lator!",
    "Math happens!",
    "Surprise numbers!",
    "Shake-n-calculate!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};