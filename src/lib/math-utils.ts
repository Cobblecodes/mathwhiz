import type { Difficulty, ArithmeticOperation, Problem } from '@/components/math-whiz/types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateArithmeticProblem(
  difficulty: Difficulty,
  operationType: ArithmeticOperation | 'Mixed'
): Problem {
  let op1: number, op2: number, question: string, correctAnswer: number;
  let operation: ArithmeticOperation;

  if (operationType === 'Mixed') {
    const operations: ArithmeticOperation[] = ['+', '-', '*', '/'];
    operation = operations[getRandomInt(0, 3)];
  } else {
    operation = operationType;
  }

  switch (difficulty) {
    case 'beginner':
      op1 = getRandomInt(1, 10);
      op2 = getRandomInt(1, 10);
      if (operation === '/' ) {
        correctAnswer = getRandomInt(1,5);
        op1 = op2 * correctAnswer;
      } else if (operation === '-' && op1 < op2) {
        [op1, op2] = [op2, op1]; // Ensure op1 >= op2 for beginner subtraction
      }
      break;
    case 'intermediate':
      op1 = getRandomInt(1, 50);
      op2 = getRandomInt(1, 50);
      if (operation === '*' || operation === '/') {
        op1 = getRandomInt(1, 12);
        op2 = getRandomInt(1, 12);
      }
      if (operation === '/') {
         correctAnswer = getRandomInt(1,10);
         op1 = op2 * correctAnswer;
      } else if (operation === '-' && op1 < op2) {
         [op1, op2] = [op2, op1];
      }
      break;
    case 'advanced':
    default:
      op1 = getRandomInt(1, 100);
      op2 = getRandomInt(1, 100);
      if (operation === '*' || operation === '/') {
        op1 = getRandomInt(1, 20);
        op2 = getRandomInt(1, 20);
      }
       if (operation === '/') {
        correctAnswer = getRandomInt(1,20);
        op1 = op2 * correctAnswer;
      }
      // For advanced, subtraction can result in negative numbers.
      break;
  }
  
  // Ensure op2 is not zero for division
  if (operation === '/' && op2 === 0) {
    op2 = 1; // Avoid division by zero, default to 1
    correctAnswer = getRandomInt(1, difficulty === 'beginner' ? 5 : (difficulty === 'intermediate' ? 10 : 20));
    op1 = op2 * correctAnswer;
  }


  switch (operation) {
    case '+':
      correctAnswer = op1 + op2;
      question = `${op1} + ${op2} = ?`;
      break;
    case '-':
      correctAnswer = op1 - op2;
      question = `${op1} - ${op2} = ?`;
      break;
    case '*':
      correctAnswer = op1 * op2;
      question = `${op1} × ${op2} = ?`;
      break;
    case '/':
      // This case is handled by ensuring op1 is a multiple of op2 during generation
      correctAnswer = op1 / op2;
      question = `${op1} ÷ ${op2} = ?`;
      break;
    default: // Should not happen
      correctAnswer = 0;
      question = "Invalid problem";
      operation = '+'; 
  }

  return {
    id: crypto.randomUUID(),
    question,
    correctAnswer,
    operation,
    operands: [op1, op2],
  };
}
