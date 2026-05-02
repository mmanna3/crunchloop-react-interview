import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// Tailwind must run before/alongside React so CSS from ./src/index.css is transformed.
export default defineConfig({
  plugins: [tailwindcss(), react()],
})
