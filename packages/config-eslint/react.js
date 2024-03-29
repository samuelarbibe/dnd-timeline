const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    JSX: true,
  },
  plugins: ["only-warn"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    "vite.config.ts",
    "node_modules/",
    "dist/",
    ".eslintrc.js",
    "**/*.css"
  ],
  rules: {
    "no-bitwise": "off",
    "import/order": "off",
    "no-nested-ternary": "off",
    "react/hook-use-state": "off",
    "react/no-array-index-key": "off",
    "unicorn/filename-case": "off",
    "import/no-default-export": "off",
    "@typescript-eslint/prefer-for-of": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};
