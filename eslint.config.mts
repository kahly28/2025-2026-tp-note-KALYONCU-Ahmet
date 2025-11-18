import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import type { Linter, ESLint } from "eslint";

const tsPlugin = tseslint as unknown as ESLint.Plugin;

const config: Linter.Config[] = [
  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: tsparser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
      sourceType: "module",
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,

      "no-console": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      camelcase: [
        "error",
        {
          properties: "always",
          ignoreDestructuring: false,
          ignoreImports: false,
        },
      ],
    },
  },
];

export default config;
