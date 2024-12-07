import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        dropdown: [
          "0 24px 24px -12px rgba(0,0,0,0.03)",
          "0 12px 12px -6px rgba(0,0,0,0.03)",
          "0 6px 6px -3px rgba(0,0,0,0.03)",
          "0 1px 1px -0.5px rgba(0,0,0,0.03)",
        ],
        button: [
          "0 3px 3px -1.5px rgba(0,0,0,0.03)",
          "0 1px 1px -0.5px rgba(0,0,0,0.03)",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
