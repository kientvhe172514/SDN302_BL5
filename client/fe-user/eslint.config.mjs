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
    rules: {
      // Tắt lỗi no-explicit-any
      "@typescript-eslint/no-explicit-any": "off",

      // Hoặc nếu muốn chỉ cảnh báo thay vì lỗi:
      // "@typescript-eslint/no-explicit-any": "warn",

      // Hoặc nếu muốn cho phép trong một số trường hợp:
      // "@typescript-eslint/no-explicit-any": ["error", {
      //   "fixToUnknown": false,
      //   "ignoreRestArgs": true
      // }],
    },
  },
];

export default eslintConfig;
