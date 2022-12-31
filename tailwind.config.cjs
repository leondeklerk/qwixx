/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
    future: {
        hoverOnlyWhenSupported: true,
    },
};
