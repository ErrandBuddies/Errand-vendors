import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import AppRoutes from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppRoutes />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
