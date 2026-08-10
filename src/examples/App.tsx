import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Home, Folder, Building2, Users, CreditCard, ShieldCheck, Plug,
  Plus, RotateCcw, Upload,
} from 'lucide-react';
import {
  Avatar, AvatarGroup,
  ProgressBar, CircularProgress,
  Accordion, Breadcrumbs, Stepper, Slider, FileUpload, EmptyState,
  Button, Badge, Card, Field, ThemeToggle, ThemeProvider, useTheme,
  ToastProvider, useToast,
} from '../components';
import '../styles/variables.css';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NewComponents />
      </ToastProvider>
    </ThemeProvider>
  );
}

/* ============================================================
   Layout do review
   ============================================================ */

const SECTIONS = [
  { id: 'avatar',    label: 'Avatar + Group' },
  { id: 'progress',  label: 'Progress' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'breadcrumbs', label: 'Breadcrumbs' },
  { id: 'stepper',   label: 'Stepper' },
  { id: 'slider',    label: 'Slider' },
  { id: 'upload',    label: 'File upload' },
  { id: 'empty',     label: 'Empty states' },
];

function Section({ id, n, title, description, children }: {
  id: string; n: number; title: string; description: string; children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div className="border-b border-border-subtle pb-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-caption font-bold text-text-onPrimary">
            {n}
          </span>
          <h2 className="text-h2">{title}</h2>
        </div>
        <p className="mt-2 text-text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Block({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-h3">{title}</h3>
        {note && <p className="mt-1 text-sm text-text-secondary">{note}</p>}
      </div>
      <div className="rounded-lg border border-border bg-surface-elevated p-6">{children}</div>
    </div>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="text-caption text-text-tertiary">{children}</p>;
}

/* ============================================================
   Review
   ============================================================ */

const TEAM = ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'Diego Reis', 'Elisa Prado', 'Fábio Nunes'];

const CHECKOUT_STEPS = [
  { label: 'Conta',     description: 'Dados de acesso' },
  { label: 'Workspace', description: 'Nome e domínio' },
  { label: 'Equipe',    description: 'Convidar membros' },
  { label: 'Pronto' },
];

const SETUP_STEPS = [
  { label: 'Conectar repositório', description: 'GitHub, GitLab ou Bitbucket', icon: <Plug className="h-4 w-4" /> },
  { label: 'Definir ambiente',     description: 'Variáveis e secrets',        icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'Primeiro deploy',      description: 'Build e publicação',         icon: <Upload className="h-4 w-4" /> },
];

function NewComponents() {
  const { theme } = useTheme();
  const toast = useToast();

  // Progress
  const [upload, setUpload] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setUpload((v) => (v >= 100 ? 0 : v + 4)), 320);
    return () => clearInterval(t);
  }, []);

  // Stepper
  const [step, setStep] = useState(1);

  // Slider
  const [budget, setBudget] = useState([45]);
  const [priceRange, setPriceRange] = useState([200, 700]);
  const [quality, setQuality] = useState([2]);

  // Upload
  const [files, setFiles] = useState<File[]>([]);
  const [avatarFile, setAvatarFile] = useState<File[]>([]);

  // Empty state demo
  const [hasResults, setHasResults] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base font-sans text-text-primary">
      <header className="sticky top-0 z-40 border-b border-border bg-surface-base/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <div>
            <p className="font-semibold">Novos componentes</p>
            <p className="text-caption text-text-tertiary">
              8 adições para validação · tema {theme}
            </p>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-10 px-6 py-10">
        <nav className="sticky top-24 hidden h-fit w-40 shrink-0 lg:block" aria-label="Componentes">
          <ul className="space-y-1">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <span className="text-text-disabled tabular-nums">{i + 1}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 space-y-16">
          <div className="space-y-3">
            <h1 className="text-h1">Rodada de novos componentes</h1>
            <p className="max-w-2xl text-subtitle text-text-secondary">
              Oito adições ao kit, isoladas para avaliação. Tudo interativo — arraste,
              clique, solte arquivos e alterne o tema no topo.
            </p>
          </div>

          {/* ==================== 1. AVATAR ==================== */}
          <Section
            id="avatar"
            n={1}
            title="Avatar + AvatarGroup"
            description="Imagem com fallback automático para iniciais. Se o src falhar, o fallback entra sozinho — nunca aparece imagem quebrada."
          >
            <Block title="Tamanhos" note="xs · sm · md · lg · xl">
              <div className="flex flex-wrap items-end gap-5">
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <Avatar name="Ana Souza" size={s} />
                    <code className="text-caption text-text-tertiary">{s}</code>
                  </div>
                ))}
              </div>
            </Block>

            <Block title="Variações de conteúdo">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar name="Ana Souza" src="https://i.pravatar.cc/150?img=47" size="lg" />
                  <Caption>com imagem</Caption>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar name="Bruno Lima" size="lg" />
                  <Caption>iniciais</Caption>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar name="Carla Dias" src="/imagem-que-nao-existe.png" size="lg" />
                  <Caption>src quebrado → fallback</Caption>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar icon={<Building2 />} size="lg" />
                  <Caption>ícone</Caption>
                </div>
              </div>
            </Block>

            <Block title="Presença">
              <div className="flex flex-wrap items-center gap-6">
                {(['online', 'busy', 'away', 'offline'] as const).map((st) => (
                  <div key={st} className="flex flex-col items-center gap-2">
                    <Avatar name="Ana Souza" size="lg" status={st} />
                    <Caption>{st}</Caption>
                  </div>
                ))}
              </div>
            </Block>

            <Block title="AvatarGroup" note="max define quantos aparecem antes do “+N”.">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <AvatarGroup max={4} size="md">
                    {TEAM.map((n) => <Avatar key={n} name={n} />)}
                  </AvatarGroup>
                  <Caption>6 membros, max=4</Caption>
                </div>
                <div className="flex items-center gap-4">
                  <AvatarGroup max={3} size="sm">
                    {TEAM.slice(0, 3).map((n) => <Avatar key={n} name={n} />)}
                  </AvatarGroup>
                  <Caption>cabe tudo, sem “+N”</Caption>
                </div>
                <div className="flex items-center gap-4">
                  <AvatarGroup max={2} size="lg">
                    {TEAM.map((n) => <Avatar key={n} name={n} />)}
                  </AvatarGroup>
                  <Caption>max=2</Caption>
                </div>
              </div>
            </Block>
          </Section>

          {/* ==================== 2. PROGRESS ==================== */}
          <Section
            id="progress"
            n={2}
            title="ProgressBar + CircularProgress"
            description="Para quando dá pra estimar quanto falta. Se não dá e a espera é curta, Spinner; se é a tela toda, Skeleton."
          >
            <Block title="ProgressBar" note="A primeira barra está animada em loop para você ver a transição.">
              <div className="space-y-6">
                <ProgressBar value={upload} label="Enviando arquivos" showValue />
                <ProgressBar value={30} tone="info" size="sm" label="sm · info" showValue />
                <ProgressBar value={68} tone="success" label="md · success" showValue />
                <ProgressBar value={88} tone="warning" size="lg" label="lg · warning" showValue />
                <ProgressBar value={96} tone="error" label="error — cota quase estourada" showValue />
                <ProgressBar indeterminate label="Indeterminado (progresso desconhecido)" />
              </div>
            </Block>

            <Block title="CircularProgress">
              <div className="flex flex-wrap items-center gap-10">
                <div className="flex flex-col items-center gap-2">
                  <CircularProgress value={upload} showValue />
                  <Caption>animado</Caption>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CircularProgress value={72} tone="success" showValue size={80} />
                  <Caption>80px · success</Caption>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CircularProgress value={40} tone="warning" size={48} thickness={4} showValue />
                  <Caption>48px fino</Caption>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CircularProgress value={85} size={88} thickness={8}>
                    <span className="text-center">
                      <span className="block text-h3 leading-none">17</span>
                      <span className="block text-caption text-text-tertiary">de 20</span>
                    </span>
                  </CircularProgress>
                  <Caption>centro customizado</Caption>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CircularProgress indeterminate />
                  <Caption>indeterminado</Caption>
                </div>
              </div>
            </Block>
          </Section>

          {/* ==================== 3. ACCORDION ==================== */}
          <Section
            id="accordion"
            n={3}
            title="Accordion"
            description="Teclado, aria-expanded e a medição de altura da animação vêm do Radix."
          >
            <Block title="single + collapsible" note="Um painel por vez; clicar no aberto fecha.">
              <Accordion type="single" collapsible defaultValue="billing">
                <Accordion.Item
                  value="billing"
                  title="Cobrança"
                  description="Faturas, limites e método de pagamento"
                  icon={<CreditCard className="h-4 w-4" />}
                  meta={<Badge variant="warning">85% da cota</Badge>}
                >
                  <p>Plano Pro · próxima fatura em 12 dias. O limite de requisições renova junto com o ciclo.</p>
                </Accordion.Item>
                <Accordion.Item
                  value="team"
                  title="Equipe"
                  description="18 membros em 4 papéis"
                  icon={<Users className="h-4 w-4" />}
                >
                  <p>Owners podem transferir a titularidade. Viewers não enxergam configurações de cobrança.</p>
                </Accordion.Item>
                <Accordion.Item
                  value="security"
                  title="Segurança"
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  <p>2FA obrigatório para Admins. SSO disponível no plano Enterprise.</p>
                </Accordion.Item>
                <Accordion.Item value="disabled" title="Integrações (em breve)" disabled>
                  <p>Indisponível.</p>
                </Accordion.Item>
              </Accordion>
            </Block>

            <Block title="multiple + separated" note="Vários abertos ao mesmo tempo, cada um como card.">
              <Accordion type="multiple" separated defaultValue={['q1']}>
                <Accordion.Item value="q1" title="Como funciona o período de teste?">
                  <p>14 dias com todos os recursos do Pro, sem cartão. Ao fim, a conta volta para o Free.</p>
                </Accordion.Item>
                <Accordion.Item value="q2" title="Posso trocar de plano depois?">
                  <p>Sim, a qualquer momento. O valor é ajustado proporcionalmente no ciclo seguinte.</p>
                </Accordion.Item>
                <Accordion.Item value="q3" title="Vocês têm SLA?">
                  <p>99,9% de disponibilidade no Enterprise, com crédito automático em caso de descumprimento.</p>
                </Accordion.Item>
              </Accordion>
            </Block>
          </Section>

          {/* ==================== 4. BREADCRUMBS ==================== */}
          <Section
            id="breadcrumbs"
            n={4}
            title="Breadcrumbs"
            description="O último item é sempre a página atual: vira texto, não link, e recebe aria-current='page'."
          >
            <Block title="Trilha padrão">
              <Breadcrumbs
                items={[
                  { label: 'Início', href: '#breadcrumbs', icon: <Home className="h-3.5 w-3.5" /> },
                  { label: 'Projetos', href: '#breadcrumbs' },
                  { label: 'Acme Produção', href: '#breadcrumbs' },
                  { label: 'Configurações' },
                ]}
              />
            </Block>

            <Block title="Colapso automático" note="Acima de maxItems, o miolo vira “…”. Primeiro e dois últimos permanecem.">
              <div className="space-y-5">
                <Breadcrumbs
                  maxItems={4}
                  items={[
                    { label: 'Início', href: '#breadcrumbs', icon: <Home className="h-3.5 w-3.5" /> },
                    { label: 'Organizações', href: '#breadcrumbs' },
                    { label: 'Acme', href: '#breadcrumbs' },
                    { label: 'Projetos', href: '#breadcrumbs' },
                    { label: 'API Gateway', href: '#breadcrumbs' },
                    { label: 'Deploy #482' },
                  ]}
                />
                <Caption>6 itens com maxItems=4</Caption>

                <Breadcrumbs
                  maxItems={0}
                  items={[
                    { label: 'Início', href: '#breadcrumbs', icon: <Home className="h-3.5 w-3.5" /> },
                    { label: 'Organizações', href: '#breadcrumbs' },
                    { label: 'Acme', href: '#breadcrumbs' },
                    { label: 'Projetos', href: '#breadcrumbs' },
                    { label: 'API Gateway', href: '#breadcrumbs' },
                    { label: 'Deploy #482' },
                  ]}
                />
                <Caption>os mesmos 6 com maxItems=0 (nunca colapsa)</Caption>
              </div>
            </Block>

            <Block title="Com callback" note="Sem href, o item vira <button> — para router client-side.">
              <Breadcrumbs
                items={[
                  { label: 'Início', icon: <Home className="h-3.5 w-3.5" />, onClick: () => toast.default('Navegou: Início') },
                  { label: 'Projetos', icon: <Folder className="h-3.5 w-3.5" />, onClick: () => toast.default('Navegou: Projetos') },
                  { label: 'Detalhe' },
                ]}
              />
            </Block>
          </Section>

          {/* ==================== 5. STEPPER ==================== */}
          <Section
            id="stepper"
            n={5}
            title="Stepper"
            description="Etapas antes da atual contam como concluídas. Sem onStepClick, os passos não viram alvo de clique."
          >
            <Block title="Horizontal, navegável" note="Só permite voltar — etapas futuras ficam bloqueadas.">
              <div className="space-y-8">
                <Stepper steps={CHECKOUT_STEPS} current={step} onStepClick={setStep} />
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    Voltar
                  </Button>
                  <Button
                    size="sm"
                    disabled={step === CHECKOUT_STEPS.length - 1}
                    onClick={() => setStep((s) => Math.min(CHECKOUT_STEPS.length - 1, s + 1))}
                  >
                    Avançar
                  </Button>
                  <Caption>etapa {step + 1} de {CHECKOUT_STEPS.length}</Caption>
                </div>
              </div>
            </Block>

            <Block title="Vertical, com ícones" note="Melhor quando cada etapa tem descrição longa.">
              <Stepper steps={SETUP_STEPS} current={1} orientation="vertical" />
            </Block>
          </Section>

          {/* ==================== 6. SLIDER ==================== */}
          <Section
            id="slider"
            n={6}
            title="Slider"
            description="Valor é sempre array — dois valores viram range com dois thumbs. Teclado (setas, Home/End, PageUp/Down) vem do Radix."
          >
            <Block title="Único valor">
              <Field label="Orçamento mensal" helperText="Use as setas do teclado após focar o thumb.">
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  showValue
                  formatValue={(n) => `R$ ${n * 100}`}
                />
              </Field>
            </Block>

            <Block title="Range" note="Dois valores no array → dois thumbs, cada um com aria-label próprio.">
              <Field label="Faixa de preço">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={50}
                  showValue
                  formatValue={(n) => `R$ ${n}`}
                />
              </Field>
            </Block>

            <Block title="Com marcas e passo discreto">
              <Field label="Qualidade da build">
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  min={0}
                  max={4}
                  step={1}
                  marks={[
                    { value: 0, label: 'Rascunho' },
                    { value: 2, label: 'Padrão' },
                    { value: 4, label: 'Máxima' },
                  ]}
                />
              </Field>
              <div className="mt-6">
                <Caption>valor atual: <span className="text-text-primary">{quality[0]}</span></Caption>
              </div>
            </Block>

            <Block title="sm e desabilitado">
              <div className="space-y-8">
                <Slider defaultValue={[30]} size="sm" label="Tamanho sm" showValue />
                <Field label="Bloqueado" disabled helperText="Herda disabled do Field.">
                  <Slider defaultValue={[60]} />
                </Field>
              </div>
            </Block>
          </Section>

          {/* ==================== 7. FILE UPLOAD ==================== */}
          <Section
            id="upload"
            n={7}
            title="FileUpload"
            description="Arraste arquivos de verdade para as zonas abaixo. A zona é um <label> ligado a um input real, então clique e teclado funcionam nativamente."
          >
            <Block title="Múltiplos, com validação" note="Tente soltar um arquivo grande ou de tipo errado para ver a rejeição.">
              <Field
                label="Anexos"
                helperText="Aceita PDF e imagens, até 2MB por arquivo, máximo 4."
              >
                <FileUpload
                  value={files}
                  onValueChange={setFiles}
                  accept=".pdf,.png,.jpg,.jpeg"
                  multiple
                  maxSize={2 * 1024 * 1024}
                  maxFiles={4}
                />
              </Field>
              <div className="mt-4">
                <Caption>{files.length} arquivo(s) na fila</Caption>
              </div>
            </Block>

            <Block title="Arquivo único">
              <Field label="Foto de perfil" helperText="Substitui o anterior a cada seleção.">
                <FileUpload
                  value={avatarFile}
                  onValueChange={setAvatarFile}
                  accept="image/*"
                  hint="PNG ou JPG quadrado, mínimo 200×200"
                />
              </Field>
            </Block>

            <Block title="Desabilitado">
              <Field label="Importar CSV" disabled helperText="Disponível apenas no plano Enterprise.">
                <FileUpload accept=".csv" />
              </Field>
            </Block>
          </Section>

          {/* ==================== 8. EMPTY STATES ==================== */}
          <Section
            id="empty"
            n={8}
            title="Empty states ilustrados"
            description="SVG inline pintado com tokens semânticos — as ilustrações trocam de cor junto com o tema. Sempre ofereça a próxima ação."
          >
            <Block title="Presets">
              <div className="grid gap-5 md:grid-cols-2">
                <EmptyState
                  illustration="empty"
                  title="Nenhum projeto ainda"
                  description="Crie o primeiro projeto para começar a publicar."
                  action={<Button leftIcon={<Plus className="h-4 w-4" />}>Novo projeto</Button>}
                />
                <EmptyState
                  illustration="search"
                  title="Nenhum resultado"
                  description="Não encontramos nada para “gateway v3”. Tente outros termos."
                  action={<Button variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />}>Limpar filtros</Button>}
                />
                <EmptyState
                  illustration="files"
                  title="Sem anexos"
                  description="Arraste arquivos ou selecione do seu computador."
                  action={<Button variant="secondary">Enviar arquivo</Button>}
                />
                <EmptyState
                  illustration="error"
                  title="Falha ao carregar"
                  description="Não conseguimos buscar os dados. Verifique sua conexão."
                  action={<Button variant="secondary" onClick={() => toast.error('Nova tentativa falhou')}>Tentar de novo</Button>}
                  footer="Erro DS-503 · há 2 minutos"
                />
              </div>
            </Block>

            <Block title="success · tamanhos · bare" note="bare remove a moldura, para usar dentro de um Card que já tem borda.">
              <div className="space-y-5">
                <EmptyState
                  illustration="success"
                  size="sm"
                  title="Tudo em dia"
                  description="Nenhuma pendência de revisão."
                />

                <Card>
                  <Card.Header title="Atividade recente" description="Últimos 7 dias" />
                  <Card.Body>
                    <EmptyState
                      bare
                      size="sm"
                      illustration="empty"
                      title="Sem atividade no período"
                      description="Assim que houver deploys, eles aparecem aqui."
                      action={<Button variant="info" size="sm">Dados atualizam a cada 24h</Button>}
                    />
                  </Card.Body>
                </Card>
              </div>
            </Block>

            <Block title="Em contexto" note="Alternando entre lista vazia e com conteúdo.">
              <div className="space-y-4">
                <Button size="sm" variant="secondary" onClick={() => setHasResults((v) => !v)}>
                  {hasResults ? 'Esvaziar lista' : 'Carregar resultados'}
                </Button>

                {hasResults ? (
                  <ul className="divide-y divide-border-subtle rounded-lg border border-border">
                    {TEAM.slice(0, 3).map((n) => (
                      <li key={n} className="flex items-center gap-3 px-4 py-3">
                        <Avatar name={n} size="sm" status="online" />
                        <span className="text-sm">{n}</span>
                        <Badge variant="success" className="ml-auto">Ativo</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    illustration="search"
                    size="sm"
                    title="Nenhum membro encontrado"
                    description="Ajuste a busca ou convide alguém para o workspace."
                    action={<Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>Convidar</Button>}
                  />
                )}
              </div>
            </Block>
          </Section>

          <footer className="border-t border-border-subtle pb-4 pt-8">
            <p className="text-caption text-text-tertiary">
              8 componentes novos · tema {theme} — alterne no topo e revalide cada seção.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
