<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading results...</p>
    </div>

    <div v-else-if="error" class="text-center">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        @click="router.push('/')"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Home class="w-5 h-5" />
        Return to Home
      </button>
    </div>

    <div v-else-if="interview" class="bg-white rounded-lg shadow-sm p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-4">Interview Results</h2>
        <div class="flex items-center justify-center gap-4">
          <span class="text-2xl font-semibold">{{ percentage.toFixed(1) }}%</span>
          <div class="text-gray-600">
            ({{ correctAnswers }} correct out of {{ interview.questions.length }})
          </div>
        </div>
      </div>

      <CopyInterviewId :interview-id="interview.id" />

      <div class="mt-8 space-y-8">
        <div v-for="(question, index) in interview.questions" :key="question.id" class="border rounded-lg p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <CheckCircle v-if="question.isCorrect" class="w-6 h-6 text-green-500" />
              <XCircle v-else class="w-6 h-6 text-red-500" />
            </div>
            <div class="flex-grow">
              <h3 class="font-semibold mb-2">Question {{ index + 1 }}:</h3>
              <p class="text-gray-700 mb-4">{{ question.question }}</p>
              
              <div class="bg-gray-50 p-4 rounded mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Your Answer:</h4>
                <p class="text-gray-600">{{ question.userAnswer }}</p>
              </div>

              <div :class="`p-4 rounded ${question.isCorrect ? 'bg-green-50' : 'bg-red-50'}`">
                <h4 class="text-sm font-medium mb-2">Feedback:</h4>
                <p class="text-gray-700">{{ question.feedback }}</p>
              </div>

              <div v-if="question.type === 'coding' && question.sampleSolution" class="mt-4 p-4 bg-gray-50 rounded">
                <h4 class="text-sm font-medium mb-2">Sample Solution:</h4>
                <pre class="p-4 bg-gray-800 text-gray-100 rounded overflow-x-auto">
                  <code>{{ question.sampleSolution }}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="interview.overallFeedback" class="mt-8 p-6 bg-blue-50 rounded-lg">
        <div class="flex items-center gap-3 mb-4">
          <Brain class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-blue-900">Overall Analysis</h3>
        </div>
        <p class="text-gray-700 whitespace-pre-line">{{ interview.overallFeedback }}</p>
      </div>

      <div class="mt-8 text-center">
        <button
          @click="router.push('/')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home class="w-5 h-5" />
          Return to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CheckCircle, XCircle, Home, Brain } from 'lucide-vue-next';
import type { Interview } from '../types';
import { getInterviewResults } from '../services/interview';
import CopyInterviewId from '../components/CopyInterviewId.vue';

const router = useRouter();
const route = useRoute();
const interview = ref<Interview | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const correctAnswers = computed(() => 
  interview.value?.questions.filter(q => q.isCorrect).length || 0
);

const percentage = computed(() => 
  interview.value ? (correctAnswers.value / interview.value.questions.length) * 100 : 0
);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    if (id) {
      const data = await getInterviewResults(id);
      interview.value = data;
    }
  } catch (err) {
    error.value = 'Failed to load interview results. Please check the Interview ID.';
  } finally {
    loading.value = false;
  }
});
</script>