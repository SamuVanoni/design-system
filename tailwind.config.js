/** @type {import('tailwindcss').Config} */
// Config local do app de preview. Todo o tema mora em tailwind.preset.cjs,
// que e o que os SaaS consomem via `@samuvanoni/design-system/tailwind-preset`.
// Nao adicione tokens aqui — adicione no preset, senao eles nao chegam nos consumidores.

module.exports = {
  presets: [require('./tailwind.preset.cjs')],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
};
