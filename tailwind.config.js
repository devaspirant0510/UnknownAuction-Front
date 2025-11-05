/** @type {import('tailwindcss').Config} */

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                uprimary: 'var(--uprimary)',
                usecondary: 'var(--usecondary)',
                background1: 'var(--background1)',
                background2: 'var(--background2)',
                udark: 'var(--udark)',
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
