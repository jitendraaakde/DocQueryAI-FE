/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                accent: {
                    DEFAULT: '#818cf8',
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'meteor': 'meteor 5s linear infinite',
                'spotlight': 'spotlight 2s ease .75s 1 forwards',
                'beam': 'beam 4s ease infinite',
                'text-gradient': 'textGradient 3s ease infinite',
                'aurora': 'aurora 60s linear infinite',
                'scroll': 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
                'twinkle': 'twinkle 3s ease-in-out infinite',
                'shooting-star': 'shootingStar 3s linear infinite',
                'text-reveal': 'textReveal 0.5s ease forwards',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
                'gradient-y': 'gradient-y 3s ease infinite',
                'gradient-xy': 'gradient-xy 3s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                meteor: {
                    '0%': { transform: 'rotate(215deg) translateX(0)', opacity: 1 },
                    '70%': { opacity: 1 },
                    '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: 0 },
                },
                spotlight: {
                    '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(0.5)' },
                    '100%': { opacity: 1, transform: 'translate(-50%, -40%) scale(1)' },
                },
                beam: {
                    '0%, 100%': { opacity: 0.3 },
                    '50%': { opacity: 0.8 },
                },
                textGradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                aurora: {
                    from: { backgroundPosition: '50% 50%, 50% 50%' },
                    to: { backgroundPosition: '350% 50%, 350% 50%' },
                },
                scroll: {
                    to: { transform: 'translate(calc(-50% - 0.5rem))' },
                },
                twinkle: {
                    '0%, 100%': { opacity: 0.3 },
                    '50%': { opacity: 1 },
                },
                shootingStar: {
                    '0%': { transform: 'translateX(0) translateY(0)', opacity: 1 },
                    '100%': { transform: 'translateX(-300px) translateY(300px)', opacity: 0 },
                },
                textReveal: {
                    '0%': { opacity: 0, filter: 'blur(10px)' },
                    '100%': { opacity: 1, filter: 'blur(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
                },
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'gradient-y': {
                    '0%, 100%': { backgroundPosition: '50% 0%' },
                    '50%': { backgroundPosition: '50% 100%' },
                },
                'gradient-xy': {
                    '0%, 100%': { backgroundPosition: '0% 0%' },
                    '25%': { backgroundPosition: '100% 0%' },
                    '50%': { backgroundPosition: '100% 100%' },
                    '75%': { backgroundPosition: '0% 100%' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};
