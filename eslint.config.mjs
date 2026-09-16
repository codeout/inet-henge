import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/config-helpers";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tsEslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

// react is a devDependency of the react/ workspace only, so resolve it from there
const require = createRequire(new URL("react/", import.meta.url));
const { version: reactVersion } = require("react/package.json");

export default defineConfig(
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),

  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  eslint.configs.recommended,
  {
    rules: {
      "object-shorthand": ["error", "properties"],
    },
  },

  tsEslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    },
  },

  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    // eslint-config-next sets settings.react.version to "detect", and eslint-plugin-react 7.37.5 resolves that through
    // the context.getFilename() that ESLint 10 removed, so pin the installed version to skip the detection path
    settings: {
      react: {
        version: reactVersion,
      },
    },
    rules: {
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          reservedFirst: true,
        },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },

  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
    },
  },

  reactHooks.configs.flat.recommended,

  prettierRecommended,

  unicorn.configs["flat/recommended"],
  {
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/number-literal-case": "off", // conflicts with prettier
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-sort": "off", // toSorted() needs es2023, tsconfig targets es2017
      "unicorn/no-await-expression-member": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-at": "off", // at() needs es2022, tsconfig targets es2017
      "unicorn/prefer-module": "off",
      "unicorn/prefer-node-protocol": "off",
      "unicorn/prefer-switch": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },

  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
);
