// Pipeline de CSS do app de preview. O Tailwind 3 acha o `tailwind.config.js` da
// raiz sozinho, e e por ele que o `tailwind.preset.cjs` (o tema do kit) entra.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
