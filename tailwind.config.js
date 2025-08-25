import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */

export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                inter: ['Inter', 'sans-serif'],
                'black-han-sans': ['Black Han Sans', 'sans-serif'],
                erica: ["'Erica One'", "cursive"],
            },
            textShadow: {
                custom: "-3px 5px 0px #282725",
            },
        },
    },

    plugins: [
    function ({ addUtilities, theme }) {
      const shadows = theme('textShadow');
      const utilities = Object.entries(shadows).map(([key, value]) => {
        return [`.text-shadow-${key}`, { textShadow: value }];
      });
      addUtilities(Object.fromEntries(utilities));
    },
  ],

};
