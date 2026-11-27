import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Three pages: home and the quote request page load src/main.jsx (which reads body[data-page]); the sample
// website loads its own small entry, src/sample.jsx.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        quote: new URL('./quote.html', import.meta.url).pathname,
        sample: new URL('./sample.html', import.meta.url).pathname
      }
    }
  }
});
