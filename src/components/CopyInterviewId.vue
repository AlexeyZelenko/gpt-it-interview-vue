<template>
  <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700 mb-1">Interview ID:</label>
      <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ interviewId }}</code>
    </div>
    <button
      @click="handleCopy"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      <Check v-if="copied" class="w-4 h-4 text-green-500" />
      <Copy v-else class="w-4 h-4" />
      {{ copied ? 'Copied!' : 'Copy ID' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Copy, Check } from 'lucide-vue-next';

const props = defineProps<{
  interviewId: string;
}>();

const copied = ref(false);

const handleCopy = async () => {
  await navigator.clipboard.writeText(props.interviewId);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>