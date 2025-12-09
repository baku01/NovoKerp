# Plano de Refatoração - Custom para React

## Status Geral
- **Total de arquivos legados**: 46 arquivos JavaScript
- **Arquivos migrados**: 46/46 (100% ✅)
- **Features React criadas**: 17 módulos
- **Data de início**: 2025-12-08
- **Data de conclusão**: 2025-12-08

## Mapeamento de Arquivos

### 1. CADT - Cadastros (5 arquivos)
Localização: `custom/gre/cadt/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| CadtCnAval.js | evaluations | ✅ Concluído | EvaluationForm.tsx já existe |
| CadtFuAval.js | evaluations | ✅ Concluído | EvaluationForm.tsx integrado |
| CadtFuRecr.js | recruitment | ✅ Concluído | RecruitmentList em features/recruitment/ |
| CadtRlAval.js | evaluations | ✅ Concluído | EvaluationReport.tsx já existe |
| CadtRlFunc.js | employees | ✅ Concluído | EmployeeList.tsx já implementado |

**Ações necessárias**:
- [x] ✅ EvaluationReport.tsx criado em `features/evaluations/`
- [x] ✅ Funcionalidades de avaliação integradas ao `EmployeeList.tsx`
- [x] ✅ Lógica de recrutamento migrada para React hooks

---

### 2. CEST - Controle de Estoque (14 arquivos)
Localização: `custom/gre/cest/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| CestDeDgta.js | stock-movement | ✅ Concluído | StockEntryForm.tsx já existe |
| CestDeLcto.js | stock-movement | ✅ Concluído | StockMovementForm.tsx já existe |
| CestDeMvto.js | stock-movement | ✅ Concluído | useStockMovement hook implementado |
| CestDePesq.js | stock-position | ✅ Concluído | StockSearchForm.tsx já existe |
| CestDgCadt.js | stock-movement | ✅ Concluído | Consolidado em StockEntryForm.tsx |
| CestFaFoto.js | documents | ✅ Concluído | StockPhotoManager.tsx e StockPhotoCapture.tsx criados |
| CestMvCadt.js | stock-movement | ✅ Concluído | Consolidado em StockMovementForm.tsx |
| CestMvDgta.js | stock-movement | ✅ Concluído | Consolidado em StockMovementForm.tsx |
| CestMvLcto.js | stock-movement | ✅ Concluído | Consolidado em StockMovementForm.tsx |
| CestMvMvto.js | stock-movement | ✅ Concluído | Consolidado em StockMovementForm.tsx |
| CestPsEstq.js | stock-position | ✅ Concluído | useStockPosition hook + StockPositionList.tsx |
| CestStCadt.js | stock-movement | ✅ Concluído | Consolidado em hooks de movimento |
| CestStLcto.js | stock-movement | ✅ Concluído | Consolidado em hooks de movimento |
| CestStMvto.js | stock-movement | ✅ Concluído | Consolidado em hooks de movimento |

**Ações necessárias**:
- [x] ✅ StockEntryForm.tsx criado para digitação/lançamento
- [x] ✅ StockSearchForm.tsx criado para pesquisa (em stock-position/)
- [x] ✅ StockPhotoManager.tsx e StockPhotoCapture.tsx criados
- [x] ✅ Múltiplos arquivos de movimento consolidados em hooks reutilizáveis
- [x] ✅ Tipos TypeScript criados em types.ts

---

### 3. COML - Comercial/Ordens de Serviço (14 arquivos)
Localização: `custom/gre/coml/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| ComlApBmsv.js | service-orders | ✅ Concluído | AssetServiceReport.tsx já criado em service-orders/bms/ |
| ComlApDvrg.js | divergences | ✅ Concluído | DivergenceReport em features/divergences/ |
| ComlApRdob.js | daily-reports | ✅ Concluído | DailyReportList já implementado |
| ComlApSecu.js | service-orders | ✅ Concluído | Funcionalidade integrada em hooks de appointments |
| ComlCdRdob.js | daily-reports | ✅ Concluído | Integrado ao DailyReportList |
| ComlDrRcso.js | resources | ✅ Concluído | useResourceStatus hook implementado |
| ComlEdSecu.js | service-orders | ✅ Concluído | Funcionalidade integrada em hooks de appointments |
| ComlOsApnt.js | appointments | ✅ Concluído | useAppointmentEntry hook implementado |
| ComlOsCmnt.js | service-orders | ✅ Concluído | CommentsManager.tsx já criado |
| ComlOsEdts.js | service-orders | ✅ Concluído | Funcionalidade integrada ao TaskManager |
| ComlOsPlan.js | service-orders | ✅ Concluído | ServiceOrderPlanning.tsx já existe |
| ComlOsTare.js | service-orders | ✅ Concluído | TaskManager.tsx já criado |
| ComlRlRdia.js | daily-reports | ✅ Concluído | DailyReportList.tsx já existe |
| ComlTbDrve.js | resources | ✅ Concluído | Funcionalidade integrada em features/resources/ |

**Ações necessárias**:
- [x] ✅ CommentsManager.tsx criado para gerenciar comentários
- [x] ✅ TaskManager.tsx criado para gerenciar tarefas
- [x] ✅ AssetServiceReport.tsx criado para bens de serviço
- [x] ✅ Funcionalidades de RDO integradas ao DailyReportList
- [x] ✅ Hooks criados para gerenciar sequências de apontamentos

---

### 4. CPRA - Compras (2 arquivos)
Localização: `custom/gre/cpra/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| CpraPcMvto.js | purchasing | ✅ Concluído | usePurchasing hook + PurchasingList.tsx |
| CpraPcRela.js | purchasing | ✅ Concluído | PurchaseReport.tsx já criado |

**Ações necessárias**:
- [x] ✅ PurchaseReport.tsx criado
- [x] ✅ Relatórios integrados ao módulo purchasing

---

### 5. DASH - Dashboards (9 arquivos)
Localização: `custom/gre/dash/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| DashApHrpr.js | service-orders | ✅ Concluído | PremiumHours.tsx já existe |
| DashCdClie.js | dashboard | ✅ Concluído | ClienteDashboard.tsx já existe |
| DashCdClie.jsx | dashboard | ✅ Concluído | Versão duplicada (remover após validação) |
| DashClHist.js | dashboard | ✅ Concluído | ClientHistogram.tsx já criado |
| DashCnOrds.js | service-orders | ✅ Concluído | useServiceOrderConsolidated hook implementado |
| DashFuSala.js | dashboard | ✅ Concluído | SalaryAnalysisReport.tsx já existe |
| DashHsSema.js | dashboard | ✅ Concluído | WeeklyResourcesReport.tsx já existe |
| DashOsLcto.js | service-orders | ✅ Concluído | ServiceOrderList.tsx já existe |
| DashTbEmpr.js | dashboard | ✅ Concluído | CompanyTable.tsx já criado |

**Ações necessárias**:
- [x] ✅ ClientHistogram.tsx criado para histograma de recursos
- [x] ✅ CompanyTable.tsx criado para dashboard de empresas
- [x] ✅ useServiceOrderConsolidated hook criado para consolidado de OS
- [x] ✅ Remover arquivo duplicado DashCdClie.jsx após validação (pasta legada removida)

---

### 6. PCPR - Propostas/Orçamentos (2 arquivos)
Localização: `custom/gre/pcpr/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| PcprOsItem.js | production-orders | ✅ Concluído | ProductionOrderForm.tsx já criado |
| PcprOsLcto.js | production-orders | ✅ Concluído | Integrado ao ProductionOrderForm e useProposals |

**Ações necessárias**:
- [x] ✅ ProductionOrderForm.tsx criado com gerenciamento de itens
- [x] ✅ useProposals hook com funcionalidades de lançamento

---

## Padrões de Refatoração

### Estrutura de Componente React
```typescript
// 1. Imports
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

// 2. Types
interface Props {
  // ...
}

// 3. Service/API functions
export const fetchData = async () => {
  // ...
};

// 4. Custom hooks
export function useFeature() {
  return useQuery({
    queryKey: ['feature'],
    queryFn: fetchData
  });
}

// 5. Component
export function FeatureComponent({ }: Props) {
  const { data, isLoading } = useFeature();

  return (
    // JSX
  );
}
```

### Migração de Ajax para React Query
```typescript
// Antes (jQuery Ajax)
$.ajax({
  url: goCdUser.ws_http + "chamadaProcedure?lcWkIsql=" + lcWkIsql,
  type: "GET",
  dataType: "jsonp",
  success: function(data) { /* ... */ }
});

// Depois (React Query)
export function useData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const response = await apiClient.callProcedure('procedureName', params);
      return response.data;
    }
  });
}
```

### Migração de Manipulação DOM para State
```typescript
// Antes (DOM manipulation)
var loElement = document.getElementById("elementId");
loElement.innerHTML = "<div>content</div>";

// Depois (React state)
const [content, setContent] = useState("");
// ... usar {content} no JSX
```

## Priorização

### Fase 1 - Alta Prioridade ✅ CONCLUÍDA
- ✅ Dashboard (ClienteDashboard, CompanyTable, ClientHistogram)
- ✅ Service Orders (completo)
- ✅ Divergences
- ✅ Daily Reports

### Fase 2 - Média Prioridade ✅ CONCLUÍDA
- ✅ Stock Movement (módulos consolidados)
- ✅ Appointments (migração completa)
- ✅ Service Order Tasks e Comments (TaskManager, CommentsManager)
- ✅ Purchasing Reports (PurchaseReport)

### Fase 3 - Baixa Prioridade ✅ CONCLUÍDA
- ✅ Stock Photos (StockPhotoManager, StockPhotoCapture)
- ✅ Company Dashboard (CompanyTable)
- ✅ Client History (ClientHistogram)
- ✅ Resource Tables (integrado em features/resources/)

## Checklist Geral ✅ CONCLUÍDO

### Por arquivo refatorado:
- [x] ✅ Analisar dependências e funções globais
- [x] ✅ Identificar chamadas de API (Ajax)
- [x] ✅ Extrair lógica de negócio
- [x] ✅ Criar tipos TypeScript
- [x] ✅ Criar service/API functions
- [x] ✅ Criar custom hooks
- [x] ✅ Criar componentes React
- [x] ✅ Adicionar tratamento de erros
- [x] ✅ Adicionar loading states
- [x] ✅ Testar funcionalidades
- [x] ✅ Remover arquivos legados após validação final (pasta `custom/` removida)

## Notas Técnicas

### Dependências a remover
- jQuery
- Framework7 (app.gauge, app.photoBrowser)
- Manipulação direta do DOM

### Dependências a usar
- React 18+
- TypeScript
- TanStack Query (React Query)
- Zustand (gerenciamento de estado)
- React Hook Form (formulários)
- TailwindCSS (estilização)

### Convenções de nomenclatura
- Componentes: PascalCase (ex: `ClienteDashboard.tsx`)
- Hooks: camelCase com prefixo 'use' (ex: `useAppointments.ts`)
- Services: camelCase (ex: `appointmentService.ts`)
- Types: PascalCase em arquivo `types.ts`
