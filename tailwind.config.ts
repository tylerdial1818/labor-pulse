import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        panel: "var(--panel)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        navy: "var(--lp-navy)",
        ink: "var(--lp-ink)",
        sub: "var(--lp-sub)",
        faint: "var(--lp-faint)",
        paper: "var(--lp-paper)",
        rule: "var(--lp-rule)",
        hair: "var(--lp-hair)",
        up: "var(--lp-up)",
        down: "var(--lp-down)"
      },
      fontFamily: {
        serif: ["var(--lp-serif)", "Georgia", "serif"],
        sans: ["var(--lp-sans)", "Helvetica Neue", "Helvetica", "Arial", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "none"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        badge: "10px"
      }
    }
  },
  plugins: []
};

export default config;
