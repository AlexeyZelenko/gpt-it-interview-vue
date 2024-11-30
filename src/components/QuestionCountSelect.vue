<template>
  <div class="grid grid-cols-5 gap-4">
    <button
      v-for="count in counts"
      :key="count"
      @click="handleSelect(count)"
      :class="[
        'p-4 rounded-lg border-2 transition-all',
        interviewStore.questionCount === count
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
      ]"
    >
      <div class="flex flex-col items-center gap-2">
        <Hash class="w-6 h-6" />
        <span class="font-semibold">{{ count }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Hash } from 'lucide-vue-next';
import { useInterviewStore } from '../stores/interview';

const interviewStore = useInterviewStore();
const counts = Array.from({ length: 10 }, (_, i) => i + 1);

const handleSelect = (count: number) => {
  interviewStore.questionCount = count;
};
</script>