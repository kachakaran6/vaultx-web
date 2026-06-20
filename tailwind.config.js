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
                // Core refactored tokens
                bg: "var(--bg)",
                surface: "var(--surface)",
                "surface-2": "var(--surface-2)",
                border: "var(--border)",
                text: "var(--text)",
                "text-muted": "var(--text-muted)",
                "text-faint": "var(--text-faint)",
                accent: "var(--accent)",
                "accent-hover": "var(--accent-hover)",
                "accent-soft": "var(--accent-soft)",
                success: "var(--success)",
                danger: "var(--danger)",
                warning: "var(--warning)",
                // shadcn legacy fallback aliases
                background: "var(--bg)",
                foreground: "var(--text)",
                input: "var(--border)",
                ring: "var(--accent)",
                primary: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--surface)",
                },
                secondary: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--text)",
                },
                destructive: {
                    DEFAULT: "var(--danger)",
                    foreground: "var(--surface)",
                },
                muted: {
                    DEFAULT: "var(--surface-2)",
                    foreground: "var(--text-muted)",
                },
                popover: {
                    DEFAULT: "var(--surface)",
                    foreground: "var(--text)",
                },
                card: {
                    DEFAULT: "var(--surface)",
                    foreground: "var(--text)",
                },
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
            },
            spacing: {
                "1": "var(--space-1)",
                "2": "var(--space-2)",
                "3": "var(--space-3)",
                "4": "var(--space-4)",
                "5": "var(--space-5)",
                "6": "var(--space-6)",
                "8": "var(--space-8)",
                "sidebar-width": "220px",
                "sidebar-collapsed": "64px",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            fontSize: {
                xs: ["12px", { lineHeight: "16px" }],
                sm: ["13px", { lineHeight: "18px" }],
                base: ["14px", { lineHeight: "20px" }],
                lg: ["16px", { lineHeight: "24px" }],
                xl: ["20px", { lineHeight: "28px" }],
                "2xl": ["24px", { lineHeight: "32px" }],
            }
        },
    },
    plugins: [require("tailwindcss-animate")],
};
