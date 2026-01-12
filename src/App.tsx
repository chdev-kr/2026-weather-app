import { QueryProvider } from "./app/providers/QueryProvider";
import { RouterProvider } from "./app/providers/ReactProvider";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useThemeStore } from "./shared/store/useThemeStore";

function App() {
  const { theme, setTheme } = useThemeStore();

  // 앱 초기화 시 저장된 테마 적용
  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster position="top-center" richColors />
    </QueryProvider>
  );
}

export default App;
