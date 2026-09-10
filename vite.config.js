import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base './' ensures assets load correctly whether deployed at
// https://<username>.github.io/<repo-name>/ or https://<username>.github.io/
export default defineConfig({
  plugins: [react()],
  base: './',
})
