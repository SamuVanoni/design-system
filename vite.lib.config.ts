import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

// Build da biblioteca (nao do app de preview — esse continua no vite.config.ts).
// Saida: dist/index.mjs. Os .d.ts vem do tsc, ver tsconfig.build.json.

// Tudo que o consumidor ja tem instalado fica de fora do bundle. Sem isso o SaaS
// acabaria com uma segunda copia do React e quebraria com "Invalid hook call".
const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  'react/jsx-runtime',
];

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    rollupOptions: {
      // Casa tanto o pacote raiz quanto subcaminhos (date-fns/locale, etc).
      external: (id) => external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    },
    sourcemap: true,
    // O preview roda de dist/ tambem em outros contextos; nao apagar por engano
    // nao e problema aqui porque so a lib escreve nessa pasta.
    emptyOutDir: true,
  },
});
