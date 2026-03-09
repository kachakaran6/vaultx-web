import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          background: "#0B0F14",
          surface: "#0B0F14",
          card: "#11161C",
          elevated: "#1A222C",
          border: "#1F2933",
          divider: "#1F2933",
          primary: "#5B8CFF",
          secondary: "#8338ec",
          success: "#06d6a0",
          danger: "#ef476f",
          warning: "#ffbe0b",
          text: "#E6EDF3",
          muted: "#9AA6B2",
          hint: "#4A5568"
        }
      },
      borderRadius: {
        card: "12px",
        pill: "999px"
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
