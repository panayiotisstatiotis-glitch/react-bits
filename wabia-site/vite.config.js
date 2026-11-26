import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Two pages: the home page and the quote request page. Both load src/main.jsx, which reads body[data-page].
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        quote: new URL('./quote.html', import.meta.url).pathname
      }
    }
  }
});
