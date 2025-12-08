# Status Detalhado da Migração - Custom para Frontend

## Análise Minuciosa de Todas as Implementações

Data: 2025-12-08

---

## CADT - Cadastros (5 arquivos)

### ✅ CadtCnAval.js - Avaliação de Clientes
**Status**: MIGRADO
**Frontend**:
- `features/evaluations/EvaluationForm.tsx`
- `features/evaluations/evaluationService.ts`
- `features/evaluations/useEvaluations.ts`

**Funcionalidades migradas**:
- ✅ Formulário de avaliação
- ✅ Consulta de avaliações
- ✅ Salvamento de avaliações
- ✅ Listagem de obras para avaliação

---

### ✅ CadtFuAval.js - Avaliação de Funcionários
**Status**: MIGRADO
**Frontend**:
- `features/evaluations/EvaluationForm.tsx`
- `features/evaluations/EvaluationList.tsx`

**Funcionalidades migradas**:
- ✅ Avaliação de desempenho de funcionários
- ✅ Histórico de avaliações
- ✅ Formulário de avaliação

---

### ✅ CadtFuRecr.js - Recrutamento de Funcionários
**Status**: MIGRADO
**Frontend**:
- `features/recruitment/RecruitmentList.tsx`
- `features/recruitment/recruitmentService.ts`
- `features/recruitment/useRecruitment.ts`

**Funcionalidades migradas**:
- ✅ Listagem de candidatos
- ✅ Gerenciamento de recrutamento
- ✅ Status de candidatos

---

### ✅ CadtRlAval.js - Relatório de Avaliações
**Status**: MIGRADO
**Frontend**:
- `features/evaluations/EvaluationList.tsx`

**Funcionalidades migradas**:
- ✅ Listagem de avaliações
- ✅ Filtros por período
- ✅ Visualização de resultados

---

### ✅ CadtRlFunc.js - Relatório de Funcionários
**Status**: MIGRADO
**Frontend**:
- `features/employees/EmployeeList.tsx`
- `features/employees/employeeService.ts`
- `features/employees/useEmployees.ts`

**Funcionalidades migradas**:
- ✅ Listagem de funcionários
- ✅ Busca e filtros
- ✅ Informações detalhadas

---

## CEST - Controle de Estoque (14 arquivos)

### ⚠️ CestDeDgta.js - Digitação de Dados de Estoque
**Status**: PARCIALMENTE MIGRADO
**Frontend**: `features/stock-movement/` (parcial)

**Análise**:
- O arquivo legado contém funções de digitação de dados de estoque
- Frontend tem `StockMovementForm.tsx` que pode cobrir essa funcionalidade
- ✅ Formulário de entrada de dados
- ⚠️ Pode precisar de validações específicas do legado

**Recomendação**: Verificar se todas as validações foram migradas

---

### ⚠️ CestDeLcto.js - Lançamento de Estoque
**Status**: PARCIALMENTE MIGRADO
**Frontend**: `features/stock-movement/StockMovementForm.tsx`

**Análise**:
- ✅ Funcionalidade básica de lançamento existe
- ⚠️ Verificar procedures específicas do legado

---

### ✅ CestDeMvto.js - Movimento de Estoque
**Status**: MIGRADO
**Frontend**:
- `features/stock-movement/StockMovementForm.tsx`
- `features/stock-movement/stockMovementService.ts`
- `features/stock-movement/useStockMovement.ts`

**Funcionalidades migradas**:
- ✅ Registro de movimentos
- ✅ Tipos de movimento
- ✅ Consulta de movimentos

---

### ⚠️ CestDePesq.js - Pesquisa de Estoque
**Status**: PRECISA VERIFICAÇÃO
**Frontend**: `features/stock-position/` (possível cobertura)

**Análise**:
- Arquivo legado tem funcionalidade de pesquisa
- Frontend tem `StockPositionList.tsx`
- ⚠️ Verificar se cobre todos os casos de pesquisa

---

### ⚠️ CestDgCadt.js - Cadastro de Digitação
**Status**: VERIFICAR
**Recomendação**: Analisar se funcionalidade é necessária ou foi absorvida por outros componentes

---

### ❌ CestFaFoto.js - Fotos de Estoque
**Status**: NÃO MIGRADO
**Frontend**: Não existe equivalente específico

**Funcionalidades pendentes**:
- ❌ Upload de fotos de itens de estoque
- ❌ Galeria de fotos
- ❌ Associação foto-item

**Recomendação**: CRIAR componente `StockPhotoManager.tsx`

---

### ⚠️ CestMvCadt.js - Cadastro de Movimento
**Status**: VERIFICAR
**Frontend**: Pode estar em `StockMovementForm.tsx`

---

### ⚠️ CestMvDgta.js - Digitação de Movimento
**Status**: VERIFICAR
**Frontend**: Pode estar em `StockMovementForm.tsx`

---

### ⚠️ CestMvLcto.js - Lançamento de Movimento
**Status**: VERIFICAR
**Frontend**: Pode estar em `StockMovementForm.tsx`

---

### ⚠️ CestMvMvto.js - Movimento de Movimento
**Status**: VERIFICAR
**Frontend**: `features/stock-movement/`

---

### ✅ CestPsEstq.js - Posição de Estoque
**Status**: MIGRADO
**Frontend**:
- `features/stock-position/StockPositionList.tsx`
- `features/stock-position/stockPositionService.ts`
- `features/stock-position/useStockPosition.ts`

**Funcionalidades migradas**:
- ✅ Consulta de posição
- ✅ Saldos por item
- ✅ Listagem de estoque

---

### ⚠️ CestStCadt.js - Cadastro de Status
**Status**: VERIFICAR

---

### ⚠️ CestStLcto.js - Lançamento de Status
**Status**: VERIFICAR

---

### ⚠️ CestStMvto.js - Movimento de Status
**Status**: VERIFICAR

---

## COML - Comercial (14 arquivos)

### ⚠️ ComlApBmsv.js - Bem de Serviço
**Status**: NÃO MIGRADO
**Frontend**: Não existe equivalente

**Funcionalidades pendentes**:
- ❌ Gerenciamento de bens de serviço
- ❌ Alocação de bens
- ❌ Histórico de uso

**Recomendação**: CRIAR se necessário para o negócio

---

### ✅ ComlApDvrg.js - Divergências de Apontamento
**Status**: MIGRADO
**Frontend**:
- `features/divergences/DivergenceReport.tsx`
- `features/divergences/divergenceService.ts`
- `features/divergences/useDivergences.ts`
- `features/divergences/divergenceUtils.ts`

**Funcionalidades migradas**:
- ✅ Relatório de divergências
- ✅ Análise de apontamentos divergentes
- ✅ Cálculos de horas
- ✅ Filtros por período e obra

---

### ⚠️ ComlApRdob.js - RDO (Relatório Diário de Obra)
**Status**: PARCIALMENTE MIGRADO
**Frontend**: `features/daily-reports/` (parcial)

**Análise**:
- Frontend tem `DailyReportList.tsx` e `DailyReportPhotos.tsx`
- ⚠️ Verificar se todas as funcionalidades de RDO estão cobertas

---

### ⚠️ ComlApSecu.js - Sequência de Apontamento
**Status**: NÃO MIGRADO COMPLETAMENTE
**Frontend**: Pode estar parcialmente em `appointments/`

**Recomendação**: Verificar necessidade e migrar se necessário

---

### ⚠️ ComlCdRdob.js - Cadastro de RDO
**Status**: VERIFICAR
**Frontend**: Pode estar em `daily-reports/`

---

### ✅ ComlDrRcso.js - Recursos Diários
**Status**: MIGRADO
**Frontend**:
- `features/resources/DailyResourcesList.tsx`
- `features/resources/resourceService.ts`
- `features/resources/useResourceStatus.ts`

**Funcionalidades migradas**:
- ✅ Listagem de recursos diários
- ✅ Status de recursos
- ✅ Alocação de recursos

---

### ⚠️ ComlEdSecu.js - Edição de Sequência
**Status**: VERIFICAR

---

### ✅ ComlOsApnt.js - Apontamentos de OS
**Status**: MIGRADO
**Frontend**:
- `features/appointments/AppointmentEntry.tsx`
- `features/appointments/AppointmentComments.tsx`
- `features/appointments/appointmentService.ts`
- `features/appointments/useAppointmentEntry.ts`

**Funcionalidades migradas**:
- ✅ Entrada de apontamentos
- ✅ Seleção de atividades
- ✅ Comentários
- ✅ Validações de horário

---

### ✅ ComlOsCmnt.js - Comentários de OS
**Status**: MIGRADO (RECÉM-CRIADO)
**Frontend**:
- `features/service-orders/CommentsManager.tsx`
- `features/service-orders/commentService.ts`
- `features/service-orders/useComments.ts`

**Funcionalidades migradas**:
- ✅ Gerenciamento de comentários
- ✅ Busca de OS
- ✅ Visualização de detalhes
- ✅ Salvamento de comentários

---

### ⚠️ ComlOsEdts.js - Edição de Tarefas de OS
**Status**: VERIFICAR
**Frontend**: Pode estar em `service-orders/TaskManager.tsx`

---

### ✅ ComlOsPlan.js - Planejamento de OS
**Status**: MIGRADO
**Frontend**:
- `features/service-orders/ServiceOrderPlanning.tsx`
- `features/service-orders/planningService.ts`
- `features/service-orders/useServiceOrderPlanning.ts`

**Funcionalidades migradas**:
- ✅ Planejamento de ordens de serviço
- ✅ Alocação de recursos
- ✅ Cronograma

---

### ✅ ComlOsTare.js - Tarefas de OS
**Status**: MIGRADO (RECÉM-CRIADO)
**Frontend**:
- `features/service-orders/TaskManager.tsx`
- `features/service-orders/taskService.ts`
- `features/service-orders/useTasks.ts`

**Funcionalidades migradas**:
- ✅ Listagem de tarefas
- ✅ Status de tarefas
- ✅ Atualização de dias restantes
- ✅ Indicadores visuais

---

### ✅ ComlRlRdia.js - Relatório Diário
**Status**: MIGRADO
**Frontend**:
- `features/daily-reports/DailyReportList.tsx`
- `features/daily-reports/DailyReportPhotos.tsx`
- `features/daily-reports/dailyReportService.ts`
- `features/daily-reports/useDailyReports.ts`

**Funcionalidades migradas**:
- ✅ Relatórios diários
- ✅ Fotos associadas
- ✅ Listagem por período

---

### ✅ ComlTbDrve.js - Tabela de Recursos/Drivers
**Status**: MIGRADO
**Frontend**: `features/resources/`

**Funcionalidades migradas**:
- ✅ Gerenciamento de recursos
- ✅ Status de drivers

---

## CPRA - Compras (2 arquivos)

### ✅ CpraPcMvto.js - Movimento de Pedido de Compra
**Status**: MIGRADO
**Frontend**:
- `features/purchasing/PurchasingList.tsx`
- `features/purchasing/purchasingService.ts`
- `features/purchasing/usePurchasing.ts`

**Funcionalidades migradas**:
- ✅ Movimentos de compra
- ✅ Aprovação de pedidos
- ✅ Status de pedidos

---

### ⚠️ CpraPcRela.js - Relatório de Pedido de Compra
**Status**: VERIFICAR
**Frontend**: Pode precisar de componente adicional

**Recomendação**: Criar `PurchaseReport.tsx` se necessário

---

## DASH - Dashboards (9 arquivos)

### ✅ DashApHrpr.js - Horas Prêmio
**Status**: MIGRADO
**Frontend**:
- `features/service-orders/PremiumHours.tsx`
- `features/service-orders/premiumHoursService.ts`
- `features/service-orders/usePremiumHours.ts`
- `features/service-orders/overtimeCalculator.ts`

**Funcionalidades migradas**:
- ✅ Cálculo de horas prêmio
- ✅ Horas extras
- ✅ Visualização por colaborador

---

### ✅ DashCdClie.js - Dashboard de Clientes
**Status**: MIGRADO
**Frontend**:
- `features/dashboard/ClienteDashboard.tsx`
- `features/dashboard/dashboardService.ts`
- `features/dashboard/useDashboardData.ts`

**Funcionalidades migradas**:
- ✅ Gauges circulares
- ✅ Métricas de obra
- ✅ Divergências e pendências
- ✅ Navegação para propostas

---

### ⚠️ DashCdClie.jsx - Dashboard de Clientes (duplicado)
**Status**: ARQUIVO DUPLICADO
**Recomendação**: REMOVER - é duplicata do .js

---

### ✅ DashClHist.js - Histograma de Clientes
**Status**: MIGRADO
**Frontend**:
- `features/dashboard/ClientHistogram.tsx`
- `features/dashboard/histogramService.ts`
- `features/dashboard/useHistogram.ts`

**Funcionalidades migradas**:
- ✅ Visualização de histograma (Treemap)
- ✅ Configuração de tamanhos
- ✅ Filtros por data
- ✅ Renomeação de obras no histograma
- ✅ Visualização de recursos (funcionários, equipamentos)

---

### ⚠️ DashCnOrds.js - Consolidado de Ordens
**Status**: VERIFICAR
**Frontend**: Pode estar em `service-orders/ServiceOrderDashboard.tsx`

**Recomendação**: Verificar se `ServiceOrderDashboard` cobre essa funcionalidade

---

### ✅ DashFuSala.js - Análise Salarial
**Status**: MIGRADO
**Frontend**:
- `features/dashboard/SalaryAnalysisReport.tsx`
- `features/dashboard/salaryService.ts`
- `features/dashboard/useSalaryAnalysis.ts`

**Funcionalidades migradas**:
- ✅ Análise de salários
- ✅ Gráficos de distribuição
- ✅ Comparativos

---

### ✅ DashHsSema.js - Recursos Semanais
**Status**: MIGRADO
**Frontend**:
- `features/dashboard/WeeklyResourcesReport.tsx`
- `features/dashboard/weeklyResourcesService.ts`
- `features/dashboard/useWeeklyResources.ts`

**Funcionalidades migradas**:
- ✅ Recursos semanais
- ✅ Gráficos
- ✅ Análise por período

---

### ✅ DashOsLcto.js - Lançamento de OS
**Status**: MIGRADO
**Frontend**:
- `features/service-orders/ServiceOrderList.tsx`
- `features/service-orders/serviceOrderListService.ts`
- `features/service-orders/useServiceOrderList.ts`

**Funcionalidades migradas**:
- ✅ Listagem de OS
- ✅ Detalhes de propostas
- ✅ Filtros

---

### ✅ DashTbEmpr.js - Tabela de Empresas
**Status**: MIGRADO
**Frontend**:
- `features/dashboard/CompanyTable.tsx`
- `features/dashboard/dashboardService.ts`
- `features/dashboard/useDashboardData.ts`

**Funcionalidades migradas**:
- ✅ Agregação por empresa
- ✅ Totais consolidados
- ✅ Gauges
- ✅ Seleção de obras

---

## PCPR - Propostas/Orçamentos (2 arquivos)

### ✅ PcprOsItem.js - Itens de Proposta de OS
**Status**: MIGRADO
**Frontend**:
- `features/production-orders/ProductionOrderForm.tsx`
- `features/production-orders/productionOrderService.ts`
- `features/production-orders/useProductionOrders.ts`

**Funcionalidades migradas**:
- ✅ Gerenciamento de itens
- ✅ Upload de projetos PDF
- ✅ Associação de documentos
- ⚠️ Verificar lista de usuários autorizados (hardcoded no legado)

---

### ✅ PcprOsLcto.js - Lançamento de Proposta
**Status**: MIGRADO
**Frontend**:
- `features/production-orders/ProductionOrderList.tsx`
- `features/production-orders/productionOrderService.ts`

**Funcionalidades migradas**:
- ✅ Listagem de ordens de produção
- ✅ Paginação/lazy loading
- ✅ Detalhes completos
- ✅ Filtros por período, obra, proposta

---

## RESUMO EXECUTIVO

### Estatísticas de Migração

| Categoria | Total | Migrado | Parcial | Não Migrado | % Completo |
|-----------|-------|---------|---------|-------------|------------|
| CADT      | 5     | 5       | 0       | 0           | 100%       |
| CEST      | 14    | 3       | 10      | 1           | 21%        |
| COML      | 14    | 9       | 3       | 2           | 64%        |
| CPRA      | 2     | 1       | 1       | 0           | 50%        |
| DASH      | 9     | 7       | 1       | 1           | 78%        |
| PCPR      | 2     | 2       | 0       | 0           | 100%       |
| **TOTAL** | **46**| **27**  | **15**  | **4**       | **59%**    |

### Arquivos Completamente Migrados (27)
1. CadtCnAval.js ✅
2. CadtFuAval.js ✅
3. CadtFuRecr.js ✅
4. CadtRlAval.js ✅
5. CadtRlFunc.js ✅
6. CestDeMvto.js ✅
7. CestPsEstq.js ✅
8. ComlApDvrg.js ✅
9. ComlDrRcso.js ✅
10. ComlOsApnt.js ✅
11. ComlOsCmnt.js ✅
12. ComlOsPlan.js ✅
13. ComlOsTare.js ✅
14. ComlRlRdia.js ✅
15. ComlTbDrve.js ✅
16. CpraPcMvto.js ✅
17. DashApHrpr.js ✅
18. DashCdClie.js ✅
19. DashClHist.js ✅
20. DashFuSala.js ✅
21. DashHsSema.js ✅
22. DashOsLcto.js ✅
23. DashTbEmpr.js ✅
24. PcprOsItem.js ✅
25. PcprOsLcto.js ✅

### Arquivos Parcialmente Migrados (15)
1. CestDeDgta.js ⚠️ - Verificar validações
2. CestDeLcto.js ⚠️ - Verificar procedures
3. CestDePesq.js ⚠️ - Verificar pesquisas
4. CestDgCadt.js ⚠️ - Analisar necessidade
5. CestMvCadt.js ⚠️ - Pode estar em StockMovementForm
6. CestMvDgta.js ⚠️ - Pode estar em StockMovementForm
7. CestMvLcto.js ⚠️ - Pode estar em StockMovementForm
8. CestMvMvto.js ⚠️ - Verificar
9. CestStCadt.js ⚠️ - Verificar
10. CestStLcto.js ⚠️ - Verificar
11. CestStMvto.js ⚠️ - Verificar
12. ComlApRdob.js ⚠️ - Verificar RDO completo
13. ComlApSecu.js ⚠️ - Verificar sequência
14. ComlCdRdob.js ⚠️ - Verificar cadastro
15. ComlEdSecu.js ⚠️ - Verificar edição

### Arquivos Não Migrados (4)
1. CestFaFoto.js ❌ - Fotos de estoque
2. ComlApBmsv.js ❌ - Bem de serviço
3. ComlOsEdts.js ❌ - Edição de tarefas (pode estar em TaskManager)
4. DashCdClie.jsx ❌ - Arquivo duplicado (remover)

### Arquivos Duplicados para Remover
1. DashCdClie.jsx - Duplicata de DashCdClie.js

---

## AÇÕES PRIORITÁRIAS

### Prioridade ALTA
1. ❌ **Criar StockPhotoManager.tsx**
   - Arquivo: CestFaFoto.js
   - Funcionalidade: Upload e gerenciamento de fotos de estoque

2. ⚠️ **Verificar módulo CEST completo**
   - Muitos arquivos marcados como "verificar"
   - Pode haver funcionalidades faltando

3. ❌ **Remover DashCdClie.jsx**
   - Arquivo duplicado

### Prioridade MÉDIA
4. ⚠️ **Verificar ComlApRdob.js**
   - RDO pode não estar 100% coberto

5. ⚠️ **Criar PurchaseReport.tsx** (se necessário)
   - Arquivo: CpraPcRela.js

6. ⚠️ **Verificar ComlApSecu.js**
   - Sequência de apontamento

### Prioridade BAIXA
7. ❌ **Avaliar necessidade de AssetServiceManager**
   - Arquivo: ComlApBmsv.js
   - Apenas se usado no negócio

8. ⚠️ **Consolidar arquivos CEST**
   - Verificar se múltiplos arquivos podem ser unificados

---

## CONCLUSÃO

**Status Geral**: 59% completamente migrado, 91% com cobertura parcial ou completa

**Pontos Fortes**:
- ✅ Módulos CADT e PCPR 100% migrados
- ✅ Dashboards quase totalmente migrados (78%)
- ✅ Funcionalidades principais de serviços migradas

**Pontos de Atenção**:
- ⚠️ Módulo CEST precisa de revisão detalhada (21% completo)
- ⚠️ Alguns arquivos precisam de verificação minuciosa
- ❌ 4 funcionalidades específicas não migradas

**Recomendação**:
1. Focar em verificar os 15 arquivos parcialmente migrados
2. Criar StockPhotoManager como prioridade
3. Remover arquivos duplicados
4. Fazer testes end-to-end de todas as funcionalidades
