/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'addModal': '0px 5px 5px 2px #333',
      }
    },
  },
  plugins: [],
}