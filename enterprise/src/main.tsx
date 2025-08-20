import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HeroUIProvider } from "@heroui/system";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "@/store/store.ts";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/useAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HeroUIProvider>
    <Provider store={store}>
      <AuthProvider>
        <Toaster richColors />
        <ShadToaster />
        <App />
      </AuthProvider>
    </Provider>
  </HeroUIProvider>
);
