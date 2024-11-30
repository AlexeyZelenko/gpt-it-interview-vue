<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <button
      v-for="{ tech, icon, description } in technologies"
      :key="tech"
      @click="handleSelect(tech)"
      :class="[
        'p-6 rounded-lg border-2 transition-all',
        interviewStore.technology === tech
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
      ]"
    >
      <div class="flex flex-col items-center gap-2">
        <component :is="icon" class="w-8 h-8" />
        <h3 class="font-semibold">{{ tech }}</h3>
        <p class="text-sm text-gray-600">{{ description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Code2, Blocks, Box, Terminal, Binary, FileJson, FileCode2, Hash, Settings, FileType, Laptop, Globe, Server, Database, Cpu } from 'lucide-vue-next';
import { useInterviewStore } from '../stores/interview';
import type { Technology } from '../types';

const interviewStore = useInterviewStore();

const technologies = [
  { tech: 'React' as Technology, icon: Code2, description: 'Modern UI library' },
  { tech: 'Vue' as Technology, icon: Blocks, description: 'Progressive framework' },
  { tech: 'Angular' as Technology, icon: Box, description: 'Full-featured framework' },
  { tech: 'TypeScript' as Technology, icon: FileJson, description: 'Typed JavaScript' },
  { tech: 'JavaScript' as Technology, icon: FileCode2, description: 'Web programming' },
  { tech: 'Node.js' as Technology, icon: Terminal, description: 'JavaScript runtime' },
  { tech: 'Python' as Technology, icon: Binary, description: 'Versatile language' },
  { tech: 'Java' as Technology, icon: Cpu, description: 'Enterprise development' },
  { tech: 'C#' as Technology, icon: Hash, description: '.NET development' },
  { tech: 'PHP' as Technology, icon: Globe, description: 'Web development' },
  { tech: 'Go' as Technology, icon: Server, description: 'System programming' },
  { tech: 'Ruby' as Technology, icon: Settings, description: 'Web development' },
  { tech: 'Swift' as Technology, icon: Laptop, description: 'iOS development' },
  { tech: 'Kotlin' as Technology, icon: FileType, description: 'Android development' },
  { tech: 'Rust' as Technology, icon: Database, description: 'Systems programming' }
];

const handleSelect = (tech: Technology) => {
  interviewStore.technology = tech;
};
</script>