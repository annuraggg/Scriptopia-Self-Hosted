import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        base: env.VITE_BASENAME || "/",
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        build: {
            minify: false, // Disable minification
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            return id
                                .toString()
                                .split("node_modules/")[1]
                                .split("/")[0]
                                .toString();
                        }
                    },
                },
            },
        },
    };
});
