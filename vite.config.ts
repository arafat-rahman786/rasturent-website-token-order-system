import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        token: resolve(__dirname, 'token.html'),
        liveToken: resolve(__dirname, 'live-token.html'),
        edit: resolve(__dirname, 'edit.html'),
      }
    }
  },
  server: {
    watch: {
      ignored: ['**/db.json']
    }
  }
})