import OpenAI from 'openai';
import { Language, Question, QuestionType } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true
});

const getLanguagePrompt = (language: Language) => {
  switch (language) {
    case 'Ukrainian':
      return 'Відповідай українською мовою';
    case 'Russian':
      return 'Отвечай на русском языке';
    default:
      return 'Answer in English';
  }
};

export const generateQuestion = async (
  technology: string,
  difficulty: string,
  language: Language,
  type: QuestionType
): Promise<{ question: string; sampleSolution?: string }> => {
  const languagePrompt = getLanguagePrompt(language);
  
  const prompt = type === 'coding' 
    ? `${languagePrompt}. Generate a ${difficulty} level coding challenge for ${technology}. Return JSON with format: {"question": string, "sampleSolution": string}. The question should be a programming task, and sampleSolution should contain working code.`
    : `${languagePrompt}. Generate a ${difficulty} level theoretical interview question about ${technology}.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: prompt
    }],
  });

  const content = response.choices[0].message.content || '';
  
  if (type === 'coding') {
    try {
      const parsed = JSON.parse(content);
      return {
        question: parsed.question,
        sampleSolution: parsed.sampleSolution
      };
    } catch {
      return { question: content };
    }
  }

  return { question: content };
};

export const evaluateAnswer = async (
  question: string,
  answer: string,
  technology: string,
  language: Language,
  type: QuestionType,
  sampleSolution?: string
): Promise<{ isCorrect: boolean; feedback: string }> => {
  const languagePrompt = getLanguagePrompt(language);
  
  const prompt = type === 'coding'
    ? `${languagePrompt}. Evaluate this ${technology} coding solution. Compare with sample solution: ${sampleSolution}. Return JSON with format: {"isCorrect": boolean, "feedback": string}. Include specific feedback about the implementation.`
    : `${languagePrompt}. Evaluate this ${technology} interview answer and provide feedback. Return JSON with format: {"isCorrect": boolean, "feedback": string}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt
      },
      {
        role: "user",
        content: `Question: ${question}\nAnswer: ${answer}`
      }
    ],
  });

  try {
    return JSON.parse(response.choices[0].message.content || '');
  } catch {
    const errorMessage = language === 'Ukrainian' ? 
      'Помилка оцінки відповіді' : 
      language === 'Russian' ? 
        'Ошибка оценки ответа' : 
        'Error evaluating answer';
    
    return { isCorrect: false, feedback: errorMessage };
  }
};

export const generateOverallFeedback = async (
  questions: Question[],
  technology: string,
  language: Language
): Promise<string> => {
  const languagePrompt = getLanguagePrompt(language);
  
  const questionsAndAnswers = questions.map((q, i) => `
    Question ${i + 1} (${q.type}): ${q.question}
    Answer: ${q.userAnswer}
    Correct: ${q.isCorrect}
    Feedback: ${q.feedback}
  `).join('\n');

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `${languagePrompt}. Analyze these ${technology} interview responses and provide overall feedback about strengths and areas for improvement. Consider both theoretical knowledge and coding skills where applicable. Be constructive and specific.`
      },
      {
        role: "user",
        content: questionsAndAnswers
      }
    ],
  });

  return response.choices[0].message.content || '';
};