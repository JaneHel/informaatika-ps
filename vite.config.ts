import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// three.js ja @react-three/fiber jõuavad eraldi tükki ainult tänu laisale importile
// (src/components/decor/Decor3D.tsx). ÄRA lisa siia manualChunks'i, mis tõmbaks
// jagatud mooduleid (nt scheduler) three-tükki – siis sõltuks kogu leht sellest tükist.
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1200 },
});
