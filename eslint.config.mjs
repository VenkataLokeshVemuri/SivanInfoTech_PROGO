import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  // Project specific rule relaxations for build environments. These are intentionally
  // relaxed to prevent the Next.js production build from failing on stylistic issues.
  {
    rules: {
      // Allow `any` in various places during development/build.
      "@typescript-eslint/no-explicit-any": "off",
      // React hooks exhaustive deps can be noisy in this codebase; keep as warning or off.
      "react-hooks/exhaustive-deps": "off",
      // Allow unescaped entities in JSX for existing content.
      "react/no-unescaped-entities": "off",
      // next/no-img-element: the codebase uses <img> intentionally in places.
      "next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
