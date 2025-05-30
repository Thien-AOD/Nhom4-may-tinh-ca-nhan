// Hàm lấy số ngẫu nhiên trong khoảng từ min đến max (cả min và max đều có thể được chọn)
const getRandomNumber = (min: number, max: number): number => {
  // Math.random() tạo số thập phân ngẫu nhiên từ 0 đến gần 1 (không bao gồm 1)
  // (max - min + 1) tính số lượng số trong khoảng cần lấy
  // Math.floor làm tròn xuống để thành số nguyên
  // Cộng min để dịch số về đúng khoảng
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Hàm chọn một phép toán ngẫu nhiên trong mảng ['+', '-', '×', '÷']
const getRandomOperator = (): string => {
  // Mảng các phép toán có thể chọn
  const operators = ['+', '-', '×', '÷'];
  // Math.random() * operators.length lấy số từ 0 đến dưới 4
  // Math.floor lấy phần nguyên làm index để chọn phép toán
  return operators[Math.floor(Math.random() * operators.length)];
};

// Hàm tạo phép tính ngẫu nhiên với số và phép toán phù hợp, trả về kết quả luôn
export const generateRandomCalculation = (): {
  firstNumber: number;     // số thứ nhất
  secondNumber: number;    // số thứ hai
  operator: string;        // phép toán
  result: number;          // kết quả phép tính
} => {
  let firstNumber: number;   // khai báo biến số thứ nhất
  let secondNumber: number;  // khai báo biến số thứ hai
  let operator = getRandomOperator();  // lấy phép toán ngẫu nhiên
  let result: number;        // khai báo biến kết quả

  // Kiểm tra phép toán để tạo số sao cho kết quả phù hợp
  switch (operator) {
    case '+':   // nếu phép toán là cộng
      // random số từ 1 đến 100 cho số thứ nhất
      firstNumber = getRandomNumber(1, 100);
      // random số từ 1 đến 100 cho số thứ hai
      secondNumber = getRandomNumber(1, 100);
      // tính tổng
      result = firstNumber + secondNumber;
      break;

    case '-':   // nếu phép toán là trừ
      // số thứ nhất từ 50 đến 100 để tránh kết quả âm
      firstNumber = getRandomNumber(50, 100);
      // số thứ hai từ 1 đến 49, nhỏ hơn số thứ nhất
      secondNumber = getRandomNumber(1, 49);
      // tính hiệu
      result = firstNumber - secondNumber;
      break;

    case '×':   // nếu phép toán là nhân
      // số thứ nhất từ 1 đến 12 (giống bảng cửu chương)
      firstNumber = getRandomNumber(1, 12);
      // số thứ hai từ 1 đến 12
      secondNumber = getRandomNumber(1, 12);
      // tính tích
      result = firstNumber * secondNumber;
      break;

    case '÷':   // nếu phép toán là chia
      // chọn số chia từ 1 đến 10 (không chia cho 0)
      secondNumber = getRandomNumber(1, 10);
      // chọn kết quả nguyên từ 1 đến 10 (để chia trơn)
      result = getRandomNumber(1, 10);
      // tính số bị chia = số chia * kết quả để chia hết
      firstNumber = secondNumber * result;
      break;

    default:   // trường hợp mặc định (không dùng, phòng lỗi)
      // giống như cộng, lấy số từ 1 đến 100
      firstNumber = getRandomNumber(1, 100);
      secondNumber = getRandomNumber(1, 100);
      result = firstNumber + secondNumber;
      operator = '+';
  }

  // Trả về kết quả: số thứ nhất, số thứ hai, phép toán, kết quả
  return {
    firstNumber,
    secondNumber,
    operator,
    result
  };
};

// Mảng chứa các câu thông điệp vui khi hiện phép tính ngẫu nhiên
export const getRandomMessage = (): string => {
  // Danh sách câu để chọn
  const messages = [
    "Shake it up!",        // Lắc lên nào!
    "Magic calculation!",  // Phép tính thần kỳ!
    "Math surprise!",      // Toán học bất ngờ!
    "Shake for more!",     // Lắc để có thêm!
    "Random math!",        // Toán ngẫu nhiên!
    "Math magic!",         // Toán phép thuật!
    "Shake-a-lator!",      // Máy lắc tính!
    "Math happens!",       // Toán xảy ra rồi!
    "Surprise numbers!",   // Số bất ngờ!
    "Shake-n-calculate!"   // Lắc rồi tính luôn!
  ];
  
  // Chọn ngẫu nhiên 1 câu trong mảng messages rồi trả về
  return messages[Math.floor(Math.random() * messages.length)];
};
