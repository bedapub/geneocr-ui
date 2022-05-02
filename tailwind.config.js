const { maxHeight } = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
            height: {
                '112': '28rem'
            },
            maxHeight: {
                '176': '38rem'
            }
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
}