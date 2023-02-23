import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    mimeTypes: {
      // serve all .jsx files as application/javascript
      '.jsx': 'application/javascript'
    }
  }
})
