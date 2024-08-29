/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@across-toolkit/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
