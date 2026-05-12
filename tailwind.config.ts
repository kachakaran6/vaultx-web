import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Vault Core Branding - Deep, vibrant, professional
        vault: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c1d3ff",
          300: "#92b4ff",
          400: "#5c8cff", // Accent Main
          500: "#3b66ff",
          600: "#2542eb",
          700: "#1c31cc",
          800: "#1829a3",
          900: "#162582",
          950: "#0f164d",
          
          // Legacy Bridges to map internal app natively to variables
          background: "hsl(var(--background))",
          surface: "hsl(var(--background))",
          card: "hsl(var(--card))",
          elevated: "rgba(255, 255, 255, 0.04)",
          border: "hsl(var(--border))",
          text: "hsl(var(--foreground))",
          muted: "hsl(var(--muted-foreground))",
          primary: "hsl(var(--primary))",
        },
        
        // Deep Surface Neutrals
        neutral: {
          850: "#171a21",
          900: "#0f1217",
          950: "#090b0f",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) * 1.5)",
        "2xl": "calc(var(--radius) * 2)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        // Master-class Neumorphism routed via CSS variables for zero-lag logic switching
        "neu-flat": "var(--shadow-neu-flat)",
        "neu-pressed": "var(--shadow-neu-pressed)",
        "neu-soft": "var(--shadow-neu-soft)",
        "neu-convex": "var(--shadow-neu-convex)",
        
        // Premium Soft Glow & Deep Floating Layers (Wired for dynamic toggle)
        "glow-primary": "var(--shadow-glow-primary)",
        "glow-subtle": "var(--shadow-glow-subtle)",
        "float": "var(--shadow-float)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-dark": "radial-gradient(at 0% 0%, rgba(59, 102, 255, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(131, 56, 236, 0.15) 0px, transparent 50%)",
        "premium-card": "linear-gradient(145deg, rgba(30, 38, 51, 0.5) 0%, rgba(15, 18, 23, 0.8) 100%)",
        // Surface curvature gradients mapped to global variables
        "neu-convex": "var(--bg-neu-convex)",
        "neu-pressed": "var(--bg-neu-pressed)",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "blur-in": {
          "0%": { filter: "blur(8px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "blur-in": "blur-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
