
export enum Difficulty {
  EASY = 'Easy (NCERT Level)',
  MEDIUM = 'Medium (Standard Practice)',
  HARD = 'Hard (Olympiad/Competitive)'
}

export interface Question {
  id: number;
  question: string;
  type: 'MCQ' | 'Short Answer';
  options?: string[];
  answer: string;
  solution: string;
}

export interface Worksheet {
  title: string;
  grade: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
}

export interface CBSEData {
  [grade: string]: string[];
}
