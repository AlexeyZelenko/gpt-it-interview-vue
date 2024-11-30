import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Technology, Difficulty, Language, Question, Interview, QuestionType } from '../types';
import { createInterview, submitAnswer, getInterviewResults } from '../services/interview';
import { generateQuestion } from '../services/openai';

export const useInterviewStore = defineStore('interview', () => {
  const technology = ref<Technology | null>(null);
  const difficulty = ref<Difficulty | null>(null);
  const language = ref<Language | null>(null);
  const questionType = ref<QuestionType | null>(null);
  const questionCount = ref<number | null>(null);
  const interviewStarted = ref(false);
  const interviewId = ref<string | null>(null);
  const currentQuestion = ref<string | null>(null);
  const currentSampleSolution = ref<string | null>(null);
  const questionResult = ref<Question | null>(null);
  const questionNumber = ref(1);
  const loading = ref(false);
  const showNextButton = ref(false);

  async function startInterview() {
    if (!technology.value || !difficulty.value || !language.value || !questionCount.value || !questionType.value) return;

    loading.value = true;
    const id = await createInterview(
      technology.value,
      difficulty.value,
      language.value,
      questionCount.value
    );
    interviewId.value = id;
    
    const { question, sampleSolution } = await generateQuestion(
      technology.value,
      difficulty.value,
      language.value,
      questionType.value
    );
    currentQuestion.value = question;
    currentSampleSolution.value = sampleSolution || null;
    
    interviewStarted.value = true;
    loading.value = false;
  }

  async function handleAnswerSubmit(answer: string) {
    if (!interviewId.value || !currentQuestion.value || !technology.value || !language.value || !questionType.value) return;

    const result = await submitAnswer(
      interviewId.value,
      currentQuestion.value,
      answer,
      technology.value,
      language.value,
      questionType.value,
      currentSampleSolution.value || undefined
    );
    questionResult.value = result;
    showNextButton.value = true;
  }

  async function handleNextQuestion() {
    if (!technology.value || !difficulty.value || !language.value || !questionCount.value || !questionType.value) return;

    if (questionNumber.value === questionCount.value) {
      return { completed: true, interviewId: interviewId.value };
    }

    const { question, sampleSolution } = await generateQuestion(
      technology.value,
      difficulty.value,
      language.value,
      questionType.value
    );
    currentQuestion.value = question;
    currentSampleSolution.value = sampleSolution || null;
    questionResult.value = null;
    questionNumber.value++;
    showNextButton.value = false;
    return { completed: false };
  }

  function reset() {
    technology.value = null;
    difficulty.value = null;
    language.value = null;
    questionType.value = null;
    questionCount.value = null;
    interviewStarted.value = false;
    interviewId.value = null;
    currentQuestion.value = null;
    currentSampleSolution.value = null;
    questionResult.value = null;
    questionNumber.value = 1;
    loading.value = false;
    showNextButton.value = false;
  }

  return {
    technology,
    difficulty,
    language,
    questionType,
    questionCount,
    interviewStarted,
    interviewId,
    currentQuestion,
    currentSampleSolution,
    questionResult,
    questionNumber,
    loading,
    showNextButton,
    startInterview,
    handleAnswerSubmit,
    handleNextQuestion,
    reset
  };
});