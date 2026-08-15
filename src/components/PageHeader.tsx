import { ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * PageHeader — o topo de uma tela: titulo, uma linha de contexto e as acoes.
 *
 * Existe porque este bloco e o mais copiado de qualquer app, e a copia derrapa
 * sempre no mesmo ponto. Num SaaS real havia nove cabecalhos escritos com seis
 * receitas de flex diferentes; nas duas telas em que a descricao era longa (ou
 * em que as acoes eram quatro), o grupo de botoes quebrava para uma segunda
 * linha e ia parar COLADO NA ESQUERDA, embaixo do titulo. O usuario procura a
 * acao primaria na direita, achou vazio, e o botao estava do outro lado da tela.
 *
 * O layout aqui resolve isso com tres decisoes, e sao elas que voce nao deve
 * desfazer ao customizar:
 *
 *   1. A coluna de texto cede (`min-w-0 flex-1 basis-80`). Ela ocupa a sobra,
 *      mas pode encolher ate 20rem antes de forcar quebra — sem `min-w-0` um
 *      filho flex nunca encolhe abaixo do proprio conteudo, e e por isso que a
 *      descricao empurrava os botoes.
 *   2. As acoes nao cedem (`shrink-0`) e ficam ancoradas na direita
 *      (`ml-auto justify-end`). O `ml-auto` e o que importa: quando a linha
 *      finalmente quebra — tela estreita de verdade —, elas descem JA
 *      alinhadas a direita, em vez de voltarem para a margem esquerda.
 *   3. A descricao tem `max-w-prose`. Serve a dois donos: prosa acima de ~65
 *      caracteres por linha fica ruim de ler, e o mesmo limite impede que um
 *      paragrafo comprido dispute espaco com os botoes.
 *
 * @example
 * <PageHeader
 *   title="Ocorrencias"
 *   description="Cada realizacao de um curso caminha por uma esteira."
 *   actions={
 *     <>
 *       <Button variant="secondary">Ver canceladas</Button>
 *       <Button leftIcon={<Plus className="h-4 w-4" />}>Nova ocorrencia</Button>
 *     </>
 *   }
 * />
 *
 * @example So titulo — `description` e `actions` sao opcionais
 * <PageHeader title="Dashboard" />
 */

interface PageHeaderProps {
  title: ReactNode;
  /** Uma linha (ou duas) de contexto. Truncada em largura, nunca em altura. */
  description?: ReactNode;
  /**
   * Botoes da tela, na ordem de leitura: os secundarios primeiro, a acao
   * primaria por ultimo — ela fica na quina direita, que e onde o olho procura.
   */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        // `items-start` porque o titulo pode ter duas linhas e a descricao tres:
        // as acoes acompanham o topo, na altura do titulo.
        'flex flex-wrap items-start justify-between gap-x-6 gap-y-3',
        className,
      )}
    >
      <div className="min-w-0 flex-1 basis-80">
        {/* Um <h1> por pagina — este e ele. O tamanho e text-h2 de proposito:
            h1 (2.5rem) domina demais uma tela de aplicacao, que nao e landing. */}
        <h1 className="text-h2 font-bold text-text-primary">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-prose text-body text-text-secondary">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
