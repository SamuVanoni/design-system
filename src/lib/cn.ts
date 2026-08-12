import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Concatena classes e RESOLVE conflitos: a ultima vence.
 *
 * Ate a v0.6.2 isto era um `join(' ')` puro, e um `className` do consumidor nao
 * conseguia sobrescrever a variante. `<Button variant="ghost" className="text-error">`
 * produzia `... text-text-primary ... text-error`: as duas tem a mesma
 * especificidade, entao quem decidia era a ordem no CSS gerado — e o Tailwind
 * emite `text-text-primary` depois. O botao de confirmar exclusao ficava com a
 * cor de texto normal, sem nenhuma marca de acao destrutiva.
 *
 * A configuracao abaixo NAO e enfeite. O `tailwind-merge` so conhece a escala
 * padrao do Tailwind; as extensoes do nosso preset precisam ser declaradas,
 * senao ele classifica errado e apaga classe boa.
 */
export const cn = extendTailwindMerge({
  extend: {
    classGroups: {
      /**
       * CRITICO. Sem isto, `text-body` e `text-caption` sao lidos como COR: o
       * grupo `text-color` valida com `isAny` (aceita qualquer sufixo) e o grupo
       * `font-size` so aceita tamanhos t-shirt (xs, sm, lg, 2xl...). Nenhum dos
       * nossos seis nomes casa. Resultado: `cn('text-body', 'text-text-primary')`
       * descartaria o `text-body` e o texto perderia o tamanho — um bug pior que
       * o que este arquivo veio consertar.
       */
      'font-size': [{ text: ['h1', 'h2', 'h3', 'subtitle', 'body', 'caption'] }],

      /**
       * Passos proprios de transitionDuration e boxShadow. Sem declarar, eles
       * nao seriam apagados (classe desconhecida sempre sobrevive), mas tambem
       * nunca resolveriam contra um `duration-200` / `shadow-md` do consumidor.
       *
       * As chaves aqui sao os IDs internos do tailwind-merge — `duration` e
       * `shadow`, nao `transition-duration` nem `box-shadow`. Uma chave que nao
       * existe NAO da erro: o `extend` cria um grupo novo e solto, e a classe
       * volta a nao conflitar com nada. Confira com `getDefaultConfig()` antes
       * de mexer.
       */
      duration: [{ duration: ['fast', 'base'] }],
      shadow: [{ shadow: ['focus'] }],
    },
  },
});
