module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      height:{
        '112': '28rem'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
