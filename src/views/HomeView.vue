<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-12 px-4">
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <BrainCircuit class="w-12 h-12 text-blue-600" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          IT Interview Practice
        </h1>
        <p class="text-lg text-gray-600 mb-8">
          Practice technical interviews with AI-powered feedback
        </p>
        <div class="max-w-xl mx-auto">
          <InterviewIdInput />
        </div>
      </div>

      <template v-if="!interviewStore.interviewStarted">
        <div class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold mb-4">Select Language</h2>
            <LanguageSelect />
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Select Question Type</h2>
            <QuestionTypeSelect />
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Select Technology</h2>
            <TechnologySelect />
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Select Difficulty</h2>
            <DifficultySelect />
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Number of Questions</h2>
            <QuestionCountSelect />
          </div>

          <button
            @click="startInterview"
            :disabled="!canStartInterview || interviewStore.loading"
            class="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ interviewStore.loading ? 'Starting Interview...' : 'Start Interview' }}
          </button>
        </div>
      </template>

      <template v-else>
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-sm font-medium text-gray-500">Question</span>
              <h2 class="text-2xl font-bold">{{ interviewStore.questionNumber }} of {{ interviewStore.questionCount }}</h2>
            </div>
            <div class="text-right">
              <span class="text-sm font-medium text-gray-500">Technology</span>
              <p class="font-semibold">{{ interviewStore.technology }}</p>
            </div>
          </div>

          <InterviewQuestion v-if="interviewStore.currentQuestion" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BrainCircuit } from 'lucide-vue-next';
import { useInterviewStore } from '../stores/interview';
import InterviewIdInput from '../components/InterviewIdInput.vue';
import LanguageSelect from '../components/LanguageSelect.vue';
import TechnologySelect from '../components/TechnologySelect.vue';
import DifficultySelect from '../components/DifficultySelect.vue';
import QuestionCountSelect from '../components/QuestionCountSelect.vue';
import QuestionTypeSelect from '../components/QuestionTypeSelect.vue';
import InterviewQuestion from '../components/InterviewQuestion.vue';

const interviewStore = useInterviewStore();

const canStartInterview = computed(() => 
  interviewStore.technology && 
  interviewStore.difficulty && 
  interviewStore.language && 
  interviewStore.questionCount && 
  interviewStore.questionType
);

const startInterview = async () => {
  await interviewStore.startInterview();
};
</script>