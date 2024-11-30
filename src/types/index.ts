export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Technology = 
  | 'React' 
  | 'Vue' 
  | 'Angular' 
  | 'Node.js' 
  | 'Python'
  | 'TypeScript'
  | 'JavaScript'
  | 'Java'
  | 'C#'
  | 'PHP'
  | 'Go'
  | 'Ruby'
  | 'Swift'
  | 'Kotlin'
  | 'Rust';

export type Language = 'English' | 'Ukrainian' | 'Russian';

export type QuestionType = 'theoretical' | 'coding';

export interface Question {
  id: string;
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
  timestamp: number;
  type: QuestionType;
  sampleSolution?: string;
}

export interface Interview {
  id: string;
  technology: Technology;
  difficulty: Difficulty;
  language: Language;
  questionCount: number;
  questionType: QuestionType;
  questions: Question[];
  completed: boolean;
  score: number;
  overallFeedback: string;
}