import { QueryProvider } from "./app/providers/QueryProvider";
import { RouterProvider } from "./app/providers/ReactProvider";

function App() {
  return (
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  );
}

export default App;
