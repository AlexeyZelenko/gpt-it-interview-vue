<template>
  <form @submit.prevent="handleSubmit" class="flex gap-2">
    <input
      v-model="interviewId"
      type="text"
      placeholder="Enter Interview ID"
      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <button
      type="submit"
      :disabled="!interviewId.trim()"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
    >
      <Search class="w-4 h-4" />
      View Results
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from 'lucide-vue-next';

const router = useRouter();
const interviewId = ref('');

const handleSubmit = () => {
  if (interviewId.value.trim()) {
    router.push(`/results/${interviewId.value}`);
  }
};
</script>