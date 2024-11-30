import { defineConfig } from 'vite';  // Импортируем функцию для определения конфигурации
import vue from '@vitejs/plugin-vue';  // Импортируем плагин для поддержки Vue

export default defineConfig({
  plugins: [vue()],  // Указываем, что используем плагин Vue
});
