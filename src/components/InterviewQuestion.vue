<template>
  <div class="space-y-6">
    <!-- Вопрос -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-lg">Question:</h3>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {{ interviewStore.questionType === 'coding' ? 'Coding Challenge' : 'Theoretical' }}
        </span>
      </div>
      <p class="text-gray-700 whitespace-pre-wrap">{{ interviewStore.currentQuestion }}</p>
    </div>

    <!-- Форма ответа -->
    <form v-if="!interviewStore.questionResult" @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="answer" class="block text-sm font-medium text-gray-700 mb-2">
          {{ interviewStore.questionType === 'coding' ? 'Your Solution:' : 'Your Answer (5 sentences max):' }}
        </label>
        <textarea
            id="answer"
            v-model="answer"
            :rows="interviewStore.questionType === 'coding' ? 12 : 6"
            :class="[
            'w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono',
            error ? 'border-red-300' : ''
          ]"
            :disabled="isSubmitting"
            :placeholder="interviewStore.questionType === 'coding' ? 'Write your code here...' : 'Write your answer here...'"
        />
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
      </div>

      <button
          type="submit"
          :disabled="isSubmitting || !answer.trim()"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Answer' }}
      </button>
    </form>

    <!-- Результат ответа -->
    <div v-if="interviewStore.questionResult" class="space-y-4">
      <div :class="[
        'p-6 rounded-lg',
        interviewStore.questionResult.isCorrect ? 'bg-green-50' : 'bg-red-50'
      ]">
        <h3 :class="[
          'font-semibold',
          interviewStore.questionResult.isCorrect ? 'text-green-800' : 'text-red-800'
        ]">
          {{ interviewStore?.questionResult?.isCorrect ? 'Correct!' : 'Incorrect' }}
        </h3>
        <p class="mt-2 text-gray-700">{{ interviewStore.questionResult.feedback }}</p>
      </div>

      <!-- Пример решения (для coding-вопросов) -->
      <div
          v-if="interviewStore.questionType === 'coding' && interviewStore.currentSampleSolution"
          class="p-6 rounded-lg bg-gray-50"
      >
        <h3 class="font-semibold text-gray-900 mb-2">Sample Solution:</h3>
        <pre class="p-4 bg-gray-800 text-gray-100 rounded overflow-x-auto">
          <code>{{ interviewStore.currentSampleSolution }}</code>
        </pre>
      </div>

      <!-- Кнопка "Next" или "Show Results" -->
      <button
          v-if="interviewStore.showNextButton"
          @click="handleNext"
          class="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ interviewStore.questionNumber === interviewStore.questionCount ? 'Show Results' : 'Next Question' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useInterviewStore } from '../stores/interview';

const router = useRouter();
const interviewStore = useInterviewStore();

const answer = ref('');
const error = ref('');
const isSubmitting = ref(false);

/**
 * Проверяет ответ на теоретический вопрос.
 */
const validateTheoreticalAnswer = (answer: string): boolean => {
  const sentences = answer.split(/[.!?]+\s*/).filter(Boolean);
  if (sentences.length > 5) {
    error.value = 'Please limit your answer to 5 sentences or less.';
    return false;
  }
  return true;
};

/**
 * Обрабатывает отправку ответа.
 */
const handleSubmit = async () => {
  if (interviewStore.questionType === 'theoretical' && !validateTheoreticalAnswer(answer.value)) {
    return;
  }

  error.value = '';
  isSubmitting.value = true;

  try {
    await interviewStore.handleAnswerSubmit(answer.value);
  } catch (err) {
    error.value = 'An error occurred while submitting your answer. Please try again.';
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Обрабатывает переход к следующему вопросу или результатам.
 */
const handleNext = async () => {
  try {
    const { completed, interviewId } = await interviewStore.handleNextQuestion();
    if (completed && interviewId) {
      await router.push(`/results/${interviewId}`);
    }
    answer.value = '';
  } catch (err) {
    error.value = 'An error occurred while moving to the next question. Please try again.';
    console.error(err);
  }
};
</script>