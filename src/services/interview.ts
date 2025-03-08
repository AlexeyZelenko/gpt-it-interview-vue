import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Interview, Question, Technology, Difficulty, Language, QuestionType } from '../types';
import { evaluateAnswer, generateOverallFeedback } from './openai';

export const createInterview = async (
    technology: Technology,
    difficulty: Difficulty,
    language: Language,
    questionCount: number
): Promise<string> => {
  const interview: {
    difficulty: "beginner" | "intermediate" | "advanced";
    questionCount: number;
    score: number;
    questions: any[];
    language: "English" | "Ukrainian" | "Russian";
    technology: "React" | "Vue" | "Angular" | "Node.js" | "Python" | "TypeScript" | "JavaScript" | "Java" | "C#" | "PHP" | "Go" | "Ruby" | "Swift" | "Kotlin" | "Rust";
    completed: boolean;
    overallFeedback: string
  } = {
    technology,
    difficulty,
    language,
    questionCount,
    questions: [],
    completed: false,
    score: 0,
    overallFeedback: ''
  };

  const docRef = await addDoc(collection(db, 'interviews'), interview);
  return docRef.id;
};

export const submitAnswer = async (
    interviewId: string,
    questionText: string,
    answer: string,
    technology: Technology,
    language: Language,
    type: QuestionType
): Promise<Question> => {
  const evaluation = await evaluateAnswer(questionText, answer, technology, language, type);

  const question: Question = {
    type,
    id: Date.now().toString(),
    question: questionText,
    userAnswer: answer,
    isCorrect: evaluation.isCorrect,
    feedback: evaluation.feedback,
    timestamp: Date.now()
  };

  const interviewRef = doc(db, 'interviews', interviewId);
  const interviewDoc = await getDoc(interviewRef);
  const interviewData = interviewDoc.data() as Interview;

  const updatedQuestions = [...interviewData.questions, question];
  const score = updatedQuestions.filter(q => q.isCorrect).length;
  const completed = updatedQuestions.length === interviewData.questionCount;

  if (completed) {
    const overallFeedback = await generateOverallFeedback(updatedQuestions, technology, language);
    await updateDoc(interviewRef, {
      questions: updatedQuestions,
      score,
      completed,
      overallFeedback
    });
  } else {
    await updateDoc(interviewRef, {
      questions: updatedQuestions,
      score,
      completed
    });
  }

  return question;
};

export const getInterviewResults = async (interviewId: string): Promise<Interview> => {
  const interviewRef = doc(db, 'interviews', interviewId);
  const interviewDoc = await getDoc(interviewRef);
  return { id: interviewId, ...interviewDoc.data() } as Interview;
};