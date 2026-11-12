import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Do not watch zip files: a zip left in the project folder (e.g. src.zip) is locked by Windows
    // while it is open and crashes Vite with "EBUSY: resource busy or locked".
    watch: { ignored: ['**/*.zip', '**/backend/**'] },
  },
});
