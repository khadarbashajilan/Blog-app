import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Define the backend URL
const BACKEND_URL = 'http://localhost:8000';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // This allows external connections
    port: 5173,
    strictPort: true, // Prevent port switching
    proxy: {
      // String shorthand for simple cases
      '/api': {
        target: BACKEND_URL, // Your Backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  }, 
  // ... other config
  plugins: [react(), tailwindcss()],
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// // https://vite.dev/config/
// export default defineConfig({
//   server: {
//     host: '0.0.0.0', // This allows external connections
//     port: 5173,
//     strictPort: true, // Prevent port switching
//   },
//   // ... other config
//   plugins: [react(), tailwindcss()],
// });