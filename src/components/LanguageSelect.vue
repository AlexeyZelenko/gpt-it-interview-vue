<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <button
      v-for="{ lang, label, description } in languages"
      :key="lang"
      @click="handleSelect(lang)"
      :class="[
        'p-6 rounded-lg border-2 transition-all',
        interviewStore.language === lang
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
      ]"
    >
      <div class="flex flex-col items-center gap-2">
        <Languages class="w-8 h-8" />
        <h3 class="font-semibold">{{ label }}</h3>
        <p class="text-sm text-gray-600">{{ description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Languages } from 'lucide-vue-next';
import { useInterviewStore } from '../stores/interview';
import type { Language } from '../types';

const interviewStore = useInterviewStore();

const languages: { lang: Language; label: string; description: string }[] = [
  { lang: 'English', label: 'English', description: 'International language' },
  { lang: 'Ukrainian', label: 'Українська', description: 'Ukrainian language' },
  { lang: 'Russian', label: 'Русский', description: 'Russian language' },
];

const handleSelect = (lang: Language) => {
  interviewStore.language = lang;
};
</script>