# System Overview – NovoKerp React

## Arquitetura
- React 18 + TypeScript (Vite)
- Estado: React Query (server) + Zustand (global)
- UI: Tailwind + componentes internos (`components/ui`)
- API: `apiClient` (axios) + `callProcedure` para procedures legadas
- Mocks: MSW para desenvolvimento/testes

## Rotas Principais
- `/login` – autenticação
- `/dashboard` – visão geral (obras, divergências, horas prêmio)
- `/avaliacoes`, `/avaliacoes/relatorio` – avaliações
- `/recrutamento`, `/funcionarios` – RH
- `/ordem-servico`, `/planejamento-os`, `/os-consolidado` – OS (dash/planejamento/consolidado)
- `/apontamento` – apontamento diário (APP)
- `/secullum` – apontamentos biométricos
- `/rdo` – relatórios diários + fotos/recursos
- `/divergencias`, `/recursos-diarios` – acompanhamento
- `/relatorio-estoque`, `/movimentacao-estoque`, `/transferencias-estoque` – estoque
- `/compras`, `/ordens-producao`, `/documentos`, `/bms`, `/histograma`, `/tabela-obras` – demais módulos

## Features por Módulo
- **Estoque**: posição, lançamentos, transferências/devoluções, (pendente: fotos e painel detalhado de saldo/custo/histórico).
- **OS**: dashboard, planejamento, lista, comentários, tarefas, BMS, consolidado, (pendente: painel de atividades detalhado).
- **Apontamentos**: app diário, Secullum manual, divergências, horas prêmio.
- **RDO**: lista, fotos, recursos, status finalizado (pendente ação de fechar).
- **Compras/Produção**: pedidos compra, OPs.
- **Dashboards**: clientes, histograma, salários, recursos semanais.

## Fluxo de Dados
1) Componentes chamam services/hooks → `callProcedure` monta `lcWkIsql` e `lcWkProc`.
2) `apiClient` usa `VITE_API_URL`; em dev/test, MSW intercepta.
3) React Query cacheia dados por `queryKey`; mutações invalidam chaves pertinentes.

## Convenções
- Pastas por feature em `src/features`.
- Services: `featureService.ts`; hooks: `useFeature.ts`.
- Types colocados em `types.ts`.
- Procedures legadas agrupadas em `legacyProcedures.ts` e serviços específicos (estoque, atividades OS, Secullum, RDO etc.).

## Pontos de Atenção
- Backend ainda responde via procedures: validar payloads/datas ao conectar ambiente real.
- Autoridade/ACL (`consultaAutoridadeObjeto`) não aplicado ainda.
- Falta UI para algumas funções legadas (listadas em `MIGRATION_STATUS.md`).
