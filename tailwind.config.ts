import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
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
        // Background colors
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",

        // Surface colors for cards, panels, etc.
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          secondary: "rgb(var(--surface-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--surface-tertiary) / <alpha-value>)",
        },

        // Border colors
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          secondary: "rgb(var(--border-secondary) / <alpha-value>)",
        },

        // Primary brand color - Deutsche Telekom Magenta (#E200FF only)
        primary: {
          500: "rgb(var(--primary-500) / <alpha-value>)",
          DEFAULT: "rgb(var(--primary-500) / <alpha-value>)",
        },

        // Text colors
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
          inverse: "rgb(var(--text-inverse) / <alpha-value>)",
        },

        // Security-specific semantic colors
        security: {
          critical: "rgb(var(--security-critical) / <alpha-value>)",
          high: "rgb(var(--security-high) / <alpha-value>)",
          medium: "rgb(var(--security-medium) / <alpha-value>)",
          low: "rgb(var(--security-low) / <alpha-value>)",
          info: "rgb(var(--security-info) / <alpha-value>)",
          safe: "rgb(var(--security-safe) / <alpha-value>)",
        },

        // Status colors
        status: {
          success: "rgb(var(--status-success) / <alpha-value>)",
          warning: "rgb(var(--status-warning) / <alpha-value>)",
          error: "rgb(var(--status-error) / <alpha-value>)",
          info: "rgb(var(--status-info) / <alpha-value>)",
        },

        // Accent colors (cyan, teal — used for card borders, highlights)
        'accent-teal': "rgb(var(--accent-teal) / <alpha-value>)",
        'accent-blue': "rgb(var(--accent-blue) / <alpha-value>)",

        // Interactive states
        interactive: {
          DEFAULT: "rgb(var(--interactive) / <alpha-value>)",
          hover: "rgb(var(--interactive-hover) / <alpha-value>)",
          active: "rgb(var(--interactive-active) / <alpha-value>)",
          disabled: "rgb(var(--interactive-disabled) / <alpha-value>)",
        },

        // shadcn/ui specific colors
        card: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--surface-secondary) / <alpha-value>)",
          foreground: "rgb(var(--text-secondary) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--surface-secondary) / <alpha-value>)",
          foreground: "rgb(var(--text-primary) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--status-error) / <alpha-value>)",
          foreground: "rgb(var(--text-inverse) / <alpha-value>)",
        },
        input: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--primary-500) / <alpha-value>)",
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
      },

      boxShadow: {
        "soft": "0 2px 8px -2px rgba(0, 0, 0, 0.20), 0 4px 16px -4px rgba(0, 0, 0, 0.15)",
        "soft-lg": "0 4px 20px -4px rgba(0, 0, 0, 0.30), 0 8px 36px -8px rgba(0, 0, 0, 0.22)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        "glow-primary": "0 0 20px -5px rgb(var(--primary-500))",
        "glow-error": "0 0 20px -5px rgb(var(--status-error))",
        "glow-success": "0 0 20px -5px rgb(var(--status-success))",
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "fade-out": "fadeOut 0.2s ease-in",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "slide-in-up": "slideInUp 0.3s ease-out",
        "slide-in-down": "slideInDown 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 2s linear infinite",
        // shadcn/ui animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // shadcn/ui keyframes
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
      },

      backdropBlur: {
        xs: "2px",
      },

      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
