export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ArithmeticOperation = '+' | '-' | '*' | '/';

export interface Problem {
  id: string;
  question: string;
  correctAnswer: number;
  operation: ArithmeticOperation;
  operands: number[];
}
