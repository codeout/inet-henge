import prettierPlugin from "eslint-config-prettier";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";


/** @type {import("eslint").Linter.FlatConfig[]} */
export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  prettierPlugin,
  {
    plugins: {
      "simple-import-sort": simpleImportSortPlugin
    },
    rules: {
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        {
          assertionStyle: "as"
        }
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  }
);


