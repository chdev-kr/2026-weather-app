import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'default' | 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',

      setTheme: (theme) => {
        set({ theme });

        // DOM 업데이트
        const root = document.documentElement;

        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // default: 시스템 설정 따르기
          const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          if (systemPrefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
    }),
    {
      name: 'theme-storage', // LocalStorage 키
    }
  )
);
