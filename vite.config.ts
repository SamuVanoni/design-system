import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// App de preview (o build da biblioteca fica no vite.lib.config.ts).
//
// O Tailwind entra pelo PostCSS (postcss.config.cjs), nao pelo plugin do Vite.
// Isso e deliberado: o tema do kit mora no `tailwind.preset.cjs`, que e um preset
// no formato Tailwind 3, e os SaaS que consomem o pacote usam Tailwind 3. Com o
// plugin da v4 o preset era ignorado em silencio — as utilidades de layout
// funcionavam (sao nativas da v4) e TODA utilidade de cor do tema saia
// transparente, entao a ProgressBar renderizava sem trilho e sem barra.
// O preview precisa enxergar o kit pela mesma via que o consumidor, senao ele
// deixa de ser prova do que o consumidor ve.
export default defineConfig({
  plugins: [react()],
});
