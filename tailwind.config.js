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
                vault: {
                    50: "#f0f4ff",
                    100: "#e0e9ff",
                    200: "#c1d3ff",
                    300: "#92b4ff",
                    400: "#4F7CFF", // Primary Target
                    500: "#3F6EF0", // Hover Target
                    600: "#2542eb",
                    700: "#1c31cc",
                    800: "#1829a3",
                    900: "#162582",
                    950: "#0f164d",
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
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "12px",    // Cards
                md: "10px",    // Buttons/Inputs
                sm: "8px",
                full: "9999px",
            },
            fontFamily: {
                sans: [
                    "Plus Jakarta Sans",
                    "Inter",
                    "system-ui",
                    "-apple-system",
                    "sans-serif",
                ],
            },
            boxShadow: {
                "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                "DEFAULT": "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)",
                "md": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
                "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -4px rgba(0, 0, 0, 0.03)",
                // Map existing variable queries to elegant default shadows to prevent code breakages
                "neu-flat": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                "neu-pressed": "inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
                "neu-soft": "0 4px 12px -2px rgba(0, 0, 0, 0.04)",
                "neu-convex": "0 8px 24px -4px rgba(0, 0, 0, 0.04)",
                "glow-primary": "none",
                "glow-subtle": "none",
                "float": "0 12px 24px -6px rgba(0, 0, 0, 0.06)",
            },
            spacing: {
                "section": "32px",
            },
            transitionDuration: {
                DEFAULT: "200ms",
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "blur-in": {
                    "0%": { filter: "blur(4px)", opacity: "0" },
                    "100%": { filter: "blur(0)", opacity: "1" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.3s ease-out forwards",
                "blur-in": "blur-in 0.3s ease-out forwards",
            },
        },
    },
    plugins: [],
};
