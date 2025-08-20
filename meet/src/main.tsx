import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./contexts/useAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </AuthProvider>
);
