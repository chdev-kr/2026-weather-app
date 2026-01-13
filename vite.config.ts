import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI 라이브러리
          'ui-vendor': ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot'],
          // 상태 관리
          'state-vendor': ['zustand', '@tanstack/react-query'],
          // 기타 유틸리티
          'utils-vendor': ['sonner', 'axios'],
        },
      },
    },
    // 청크 크기 경고 임계값 증가 (임시)
    chunkSizeWarningLimit: 1000,
  },
});
