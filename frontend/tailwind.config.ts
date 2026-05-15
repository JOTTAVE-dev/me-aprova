import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 14% 18%)",
        background: "hsl(222 22% 6%)",
        foreground: "hsl(210 24% 96%)",
        muted: "hsl(222 14% 12%)",
        accent: "hsl(164 84% 44%)",
        amber: "hsl(38 92% 55%)",
        danger: "hsl(0 80% 62%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45, 212, 191, .12), 0 20px 80px rgba(0, 0, 0, .32)",
      },
    },
  },
  plugins: [],
} satisfies Config;
