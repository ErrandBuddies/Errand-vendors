import { AuthProvider } from "@/contexts/AuthContext";
import AppRoutes from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthProvider>
  );
}

export default App;
