<template>
  <div class="flex gap-4">
    <button
      v-for="{ level, icon, description } in difficulties"
      :key="level"
      @click="handleSelect(level)"
      :class="[
        'flex-1 p-4 rounded-lg border-2 transition-all',
        interviewStore.difficulty === level
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
      ]"
    >
      <div class="flex flex-col items-center gap-2">
        <component :is="icon" class="w-6 h-6" />
        <h3 class="font-semibold capitalize">{{ level }}</h3>
        <p class="text-sm text-gray-600">{{ description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, Zap, Flame } from 'lucide-vue-next';
import { useInterviewStore } from '../stores/interview';
import type { Difficulty } from '../types';

const interviewStore = useInterviewStore();

const difficulties = [
  { level: 'beginner' as Difficulty, icon: Sparkles, description: 'Fundamental concepts' },
  { level: 'intermediate' as Difficulty, icon: Zap, description: 'Advanced topics' },
  { level: 'advanced' as Difficulty, icon: Flame, description: 'Expert challenges' },
];

const handleSelect = (level: Difficulty) => {
  interviewStore.difficulty = level;
};
</script>