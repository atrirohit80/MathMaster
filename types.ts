
export enum Difficulty {
  EASY = 'Easy (Foundation)',
  MEDIUM = 'Medium (Standard)',
  HARD = 'Hard (Exemplar/Advanced)'
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
  subject: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
}

export interface SubjectData {
  [subjectName: string]: string[];
}

export interface CurriculumData {
  [grade: string]: SubjectData;
}
