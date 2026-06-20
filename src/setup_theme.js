const fs = require('fs');
const path = require('path');

const colorsDark = {
    "surface-container": "#1f1f27",
    "secondary": "#b9c8de",
    "on-primary-fixed": "#07006c",
    "on-tertiary-container": "#452000",
    "on-primary-container": "#0d0096",
    "tertiary": "#ffb783",
    "surface-container-low": "#1b1b23",
    "on-background": "#e4e1ed",
    "secondary-container": "#39485a",
    "primary-fixed-dim": "#c0c1ff",
    "on-surface-variant": "#c7c4d7",
    "tertiary-fixed-dim": "#ffb783",
    "surface-container-high": "#292932",
    "primary-fixed": "#e1e0ff",
    "secondary-fixed-dim": "#b9c8de",
    "secondary-fixed": "#d4e4fa",
    "surface-variant": "#34343d",
    "surface-container-lowest": "#0d0d15",
    "on-tertiary-fixed": "#301400",
    "on-secondary-fixed-variant": "#39485a",
    "tertiary-fixed": "#ffdcc5",
    "tertiary-container": "#d97721",
    "outline": "#908fa0",
    "on-surface": "#e4e1ed",
    "on-error": "#690005",
    "inverse-primary": "#494bd6",
    "background": "#13131b",
    "primary-container": "#8083ff",
    "on-secondary-container": "#a7b6cc",
    "surface": "#13131b",
    "on-primary": "#1000a9",
    "error-container": "#93000a",
    "on-secondary-fixed": "#0d1c2d",
    "on-tertiary-fixed-variant": "#703700",
    "surface-tint": "#c0c1ff",
    "inverse-surface": "#e4e1ed",
    "outline-variant": "#464554",
    "error": "#ffb4ab",
    "surface-bright": "#393841",
    "on-primary-fixed-variant": "#2f2ebe",
    "surface-dim": "#13131b",
    "on-secondary": "#233143",
    "on-error-container": "#ffdad6",
    "inverse-on-surface": "#303038",
    "primary": "#c0c1ff",
    "surface-container-highest": "#34343d",
    "on-tertiary": "#4f2500"
};

const colorsLight = {
    "surface-container": "#f1f5f9",
    "secondary": "#64748b",
    "on-primary-fixed": "#ffffff",
    "on-tertiary-container": "#ffffff",
    "on-primary-container": "#ffffff",
    "tertiary": "#f59e0b",
    "surface-container-low": "#f8fafc",
    "on-background": "#0f172a",
    "secondary-container": "#e2e8f0",
    "primary-fixed-dim": "#4f46e5",
    "on-surface-variant": "#475569",
    "tertiary-fixed-dim": "#f59e0b",
    "surface-container-high": "#e2e8f0",
    "primary-fixed": "#4f46e5",
    "secondary-fixed-dim": "#64748b",
    "secondary-fixed": "#64748b",
    "surface-variant": "#e2e8f0",
    "surface-container-lowest": "#ffffff",
    "on-tertiary-fixed": "#ffffff",
    "on-secondary-fixed-variant": "#ffffff",
    "tertiary-fixed": "#f59e0b",
    "tertiary-container": "#fef3c7",
    "outline": "#94a3b8",
    "on-surface": "#0f172a",
    "on-error": "#ffffff",
    "inverse-primary": "#818cf8",
    "background": "#f8fafc",
    "primary-container": "#e0e7ff",
    "on-secondary-container": "#1e293b",
    "surface": "#ffffff",
    "on-primary": "#ffffff",
    "error-container": "#fee2e2",
    "on-secondary-fixed": "#ffffff",
    "on-tertiary-fixed-variant": "#ffffff",
    "surface-tint": "#4f46e5",
    "inverse-surface": "#1e293b",
    "outline-variant": "#cbd5e1",
    "error": "#ef4444",
    "surface-bright": "#ffffff",
    "on-primary-fixed-variant": "#ffffff",
    "surface-dim": "#f1f5f9",
    "on-secondary": "#ffffff",
    "on-error-container": "#991b1b",
    "inverse-on-surface": "#f8fafc",
    "primary": "#4f46e5",
    "surface-container-highest": "#cbd5e1",
    "on-tertiary": "#ffffff"
};

let cssVarsLight = '';
let cssVarsDark = '';
let twColors = '';

for (const [key, value] of Object.entries(colorsDark)) {
    cssVarsDark += `    --${key}: ${value};\n`;
    cssVarsLight += `    --${key}: ${colorsLight[key]};\n`;
    twColors += `        "${key}": "var(--${key})",\n`;
}

const tailwindConfig = `
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
${twColors}
        // Legacy fallbacks
        background: "var(--background)",
        foreground: "var(--on-background)",
        border: "var(--outline-variant)",
        input: "var(--outline-variant)",
        ring: "var(--primary)",
        card: {
          DEFAULT: "var(--surface-container-low)",
          foreground: "var(--on-surface)",
        },
        muted: {
          DEFAULT: "var(--surface-variant)",
          foreground: "var(--on-surface-variant)",
        },
      },
      borderRadius: {
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      spacing: {
        "sidebar-width": "260px",
        "stack-xs": "4px",
        "grid-gutter": "16px",
        "stack-md": "12px",
        "stack-sm": "8px",
        "stack-lg": "24px",
        "container-padding": "32px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        "body-md": ["Inter"],
        "headline-md": ["Inter"],
        "label-caps": ["JetBrains Mono"],
        "code-sm": ["JetBrains Mono"],
        "display-sm": ["Inter"],
        "body-sm": ["Inter"]
      },
      fontSize: {
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-md": ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "code-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "display-sm": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }]
      }
    },
  },
  plugins: [],
} satisfies Config;
`;

const indexCss = \`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
\${cssVarsLight}
  }

  .dark {
\${cssVarsDark}
  }
}

@layer base {
  * {
    @apply border-outline-variant selection:bg-primary/20;
  }
  
  body {
    @apply bg-background text-on-background font-sans antialiased overflow-x-hidden;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11", "ss01";
  }
}

@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--outline-variant);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--outline);
  }

  .sidebar-active-line {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--primary);
  }
}
\`;

fs.writeFileSync('d:/vaultx-web/tailwind.config.ts', tailwindConfig);
fs.writeFileSync('d:/vaultx-web/src/styles/index.css', indexCss);
console.log('Successfully updated tailwind config and index.css');
