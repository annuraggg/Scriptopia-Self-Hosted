import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    base: process.env.VITE_BASENAME || "/",
    server: {
      port: parseInt(process.env.VITE_PORT!),
    },
    plugins: [react(), tailwindcss()],
  };
});
