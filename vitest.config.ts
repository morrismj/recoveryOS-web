import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsxInject: "import React from 'react'"
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    clearMocks: true,
    restoreMocks: true
  }
});
