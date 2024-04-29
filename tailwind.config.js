/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "foto": "url('/assets/bg.png')" // Adicionei a vírgula aqui
      }
    }
  },
  plugins: [],
};
