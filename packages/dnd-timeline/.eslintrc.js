/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/index.js", "@repo/eslint-config/react.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  env: {
    jest: true,
  },
};
