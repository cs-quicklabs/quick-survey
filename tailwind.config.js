module.exports = {
  mode: 'jit',
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
    content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js'
  ]
}
