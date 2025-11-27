/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0A0A0A",
                foreground: "#EDEDED",
                primary: {
                    DEFAULT: "#10B981", // Money Green
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#27272A",
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#27272A",
                    foreground: "#A1A1AA",
                },
                accent: {
                    DEFAULT: "#27272A",
                    foreground: "#FFFFFF",
                },
                card: {
                    DEFAULT: "#18181B",
                    foreground: "#EDEDED",
                },
                border: "#27272A",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
            },
            keyframes: {
                'border-beam': {
                    '100%': {
                        'offset-distance': '100%',
                    },
                },
            },
        },
    },
    plugins: [],
}
