import { QueryProvider } from "./app/providers/QueryProvider";
import { RouterProvider } from "./app/providers/ReactProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster position="top-center" richColors />
    </QueryProvider>
  );
}

export default App;
