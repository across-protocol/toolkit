import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {
        "header-height": "var(--header-height)",
        "screen-without-header": "calc(100svh - var(--header-height))",
      },
      colors: {
        success: "hsl(var(--success)  / <alpha-value>)",
        destructive: "hsl(var(--destructive)  / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        accent2: "hsl(var(--accent-2) / <alpha-value>)",
        border: {
          DEFAULT: "hsl(var(--border) / <alpha-value>)",
          secondary: "hsl(var(--border-secondary) / <alpha-value>)",
          input: "hsl(var(--border-secondary) / <alpha-value>)",
        },
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        text: "hsl(var(--text-color) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        popover: "hsl(var(--popover) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
