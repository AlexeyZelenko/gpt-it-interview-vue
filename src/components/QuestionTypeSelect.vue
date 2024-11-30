<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <button
      v-for="{ type, icon, label, description } in questionTypes"
      :key="type"
      @click="handleSelect(type)"
      :class="[
        'p-6 rounded-lg border-2 transition-all',
        interviewStore.questionType === type
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
      ]"
    >
      <div class="flex flex-col items-center gap-2">
        <component :is="icon" class="w-8 h-8" />
        <h3 class="font-semibold">{{ label }}</h3>
        <p class="text-sm text-gray-600">{{ description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Code2 } from 'lucide-vue-next';
import { useInterviewStore } from '../stores/interview';
import type { QuestionType } from '../types';

const interviewStore = useInterviewStore();

const questionTypes = [
  {
    type: 'theoretical' as QuestionType,
    icon: BookOpen,
    label: 'Theoretical',
    description: 'Concept-based questions'
  },
  {
    type: 'coding' as QuestionType,
    icon: Code2,
    label: 'Coding',
    description: 'Programming challenges'
  }
];

const handleSelect = (type: QuestionType) => {
  interviewStore.questionType = type;
};
</script>