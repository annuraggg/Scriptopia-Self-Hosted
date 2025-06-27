import { build } from "esbuild";
import { resolve } from "path";

try {
  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node18",
    format: "esm",
    outdir: "dist",
    sourcemap: true,

    external: [
      // AWS SDK
      "@aws-sdk/client-lambda",
      "@aws-sdk/client-s3",
      "@aws-sdk/lib-storage",
      "@aws-sdk/s3-request-presigner",

      // Core dependencies
      "@axiomhq/pino",
      "@dopplerhq/node-sdk",
      "@google/generative-ai",
      "@hono/node-server",
      "@lemonsqueezy/lemonsqueezy.js",
      "@stream-io/node-sdk",
      "@web3-react/core",
      "@web3-react/injected-connector",

      // Regular dependencies
      "axios",
      "chalk",
      "dotenv",
      "ethers",
      "generate-passphrase",
      "hono",
      "ioredis",
      "jsonwebtoken",
      "loops",
      "mongoose",
      "multer",
      "ora",
      "pdf.js-extract",
      "pino",
      "scriptopia-types",
      "socket.io",
      "web3",

      // Node.js built-ins
      "timers",
      "fs",
      "path",
      "crypto",
      "http",
      "https",
      "url",
      "util",
      "events",
      "stream",
      "buffer",
      "os",
      "child_process",
      "net",
      "tls",
      "dns",
      "zlib",
    ],

    alias: {
      "@/*": resolve("src"),
      "@shared-types": resolve("../common/types"),
      "@shared-data": resolve("../common/data"),
    },

    metafile: true,

    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
    },

    tsconfig: "./tsconfig.json",

    outbase: "src",

    plugins: [
      {
        name: "node-externals",
        setup(build) {
          const nodeBuiltins = [
            "assert",
            "buffer",
            "child_process",
            "cluster",
            "crypto",
            "dgram",
            "dns",
            "events",
            "fs",
            "http",
            "https",
            "net",
            "os",
            "path",
            "querystring",
            "readline",
            "stream",
            "string_decoder",
            "timers",
            "tls",
            "tty",
            "url",
            "util",
            "v8",
            "vm",
            "zlib",
          ];

          build.onResolve({ filter: /^(node:)?[a-z_]+$/ }, (args) => {
            const moduleName = args.path.replace(/^node:/, "");
            if (nodeBuiltins.includes(moduleName)) {
              return { path: args.path, external: true };
            }
          });

          build.onResolve({ filter: /\.node$/ }, (args) => ({
            path: args.path,
            external: true,
          }));
        },
      },
    ],
  });

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}
