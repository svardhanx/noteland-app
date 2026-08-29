import eslint from "@eslint/js";
import globals from "globals";

export default [
  eslint.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },

  {
    ignores: ["node_modules/**"],
  },
];
