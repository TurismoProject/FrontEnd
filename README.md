# Conheça seu destino — frontend

Aplicação Next.js 14 com React, TypeScript, Tailwind e componentes Radix/shadcn.

## Desenvolvimento

```sh
npm install
cp .env.example .env.local
npm run dev
```

O frontend inicia em `http://localhost:3000`. O backend NestJS deve estar disponível
em `http://127.0.0.1:3003`; configure `TURISMO_API_URL` (área do empresário) e
`API_URL` (autenticação e produtos) em `.env.local` se ele usar outro endereço.
As duas variáveis são privadas do servidor Next.js. Reinicie o frontend depois
de alterá-las.

## Acesso do usuário

`/login` abre diretamente o formulário de usuário; `/login/usuario` mantém o
mesmo acesso para links existentes. `/cadastro` permite escolher uma conta de
usuário ou provedor. O cadastro de usuário tem cinco etapas, com progresso e
retorno preservando os dados preenchidos.
Login e cadastro compartilham `src/components/forms/sign-box/auth-layout.tsx` e
usam a identidade visual da área do empresário, com adaptação para celular.

O cadastro consulta `POST /usuario/check-cpf`, `/usuario/check-phone` e
`/usuario/check-email`. Essas rotas precisam responder com `{ inUse: boolean }`;
respostas indisponíveis ou incompatíveis mostram uma mensagem de erro e não
aprovam a verificação.

## Área do empresário

- `/empresario/login`: acesso com uma conta já cadastrada como fornecedor.
- `/empresario`: resumo por período, agenda de saídas e resultados por passeio/dia.
- `/empresario/reservas`: todas as saídas por padrão, com paginação e filtros opcionais por período, situação e ID do passeio.
- `/empresario/reservas/:departureId`: reservas, passageiros, ações em massa,
  comparecimento, histórico e encerramento da saída.

A página pública tem o acesso “Área do empresário” na seção “Empresa” do rodapé.
Os fluxos de login/cadastro de turistas e fornecedores trazidos da branch Isaac
continuam disponíveis, separados desta área.

Os dados vêm do backend; sem saídas ou reservas cadastradas, as telas mostram
estados vazios. Nenhum dado demonstrativo é carregado na aplicação.

### Organização

```text
src/app/empresario/           Rotas e layouts; o grupo (painel) compartilha a sessão
src/app/api/empresario/       Adaptadores HTTP para o backend, com rotas permitidas
src/features/supplier/
  components/                Telas e componentes da operação do fornecedor
  types.ts                   Contratos usados pela interface
  api.ts                     Requisições e erros no navegador
  format.ts                  Datas, moeda e intervalos
  use-resource.ts            Consulta com descarte de respostas antigas
  use-departure.ts           Localização de saída pelo contrato disponível
  supplier.module.css        Estilos isolados da área do empresário
src/lib/supplier-server.ts   Cookies, comunicação privada e renovação da sessão
```

### Regras da integração

- Access e refresh tokens ficam em cookies HttpOnly, com `SameSite=Lax` e `Secure`
  em produção. Não são gravados em localStorage nem retornados para o JavaScript.
- O servidor Next renova o acesso e deduplica renovações simultâneas na mesma
  instância. Uma implantação com várias instâncias exige coordenação compartilhada
  da rotação ou ajuste no contrato de renovação do backend.
- Mutações exigem a mesma origem do frontend. O backend continua responsável por
  autorização, propriedade, capacidade, transações e transições de estado.
- O logout limpa a sessão deste navegador. O backend atual não expõe uma rota de
  revogação para o fornecedor.
- Apenas reservas confirmadas ocupam vagas. Uma reserva pode ter vários passageiros;
  o responsável não embarca automaticamente.
- As seleções são limitadas à página atual. Comparecimento aceita até 100 pessoas
  por operação. Falhas não provocam reenvio automático de mutações.
- Datas de filtro usam Maceió (UTC−3). Horários de cada saída respeitam seu fuso;
  o painel usa os agrupamentos calculados pelo backend.
- O filtro de passeio usa UUID porque o backend atual não expõe uma listagem de
  produtos do fornecedor. Também não há consulta individual de saída: os links
  levam produto/instante para filtrar a listagem; sem contexto, a consulta percorre
  as páginas até encontrar o ID, sempre dentro dos dados autorizados pelo backend.
- Criação de produtos, upload de imagens e pagamentos não fazem parte destas telas.

O contrato completo está em `back-end/Back-end/docs/reservations.md` no projeto irmão.

## Verificação

Pare o servidor de desenvolvimento antes de compilar e testar na mesma pasta:
o build e o `npm run dev` compartilham o diretório gerado `.next`.

```sh
npx tsc --noEmit --incremental false
npm run build
npm run test:supplier
```

O build usa a fonte Inter já configurada em `next/font/google`, precisando de acesso
ao Google Fonts quando ela ainda não estiver em cache.

Os testes de integração iniciam um Next de produção e um backend descartável em
portas locais livres. Execute o build antes dos testes. Eles verificam cookies,
autorização, origem, rotação simultânea, erros e encaminhamento das ações. Não
acessam o PostgreSQL nem substituem testes completos contra o NestJS real.

`tests/fixtures/supplier-backend.mjs` contém somente dados fictícios para testes;
não é importado pelo código da aplicação.
