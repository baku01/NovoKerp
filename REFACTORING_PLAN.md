# Plano de Refatoração - Custom para React

## Status Geral
- **Total de arquivos legados**: 46 arquivos JavaScript
- **Features React já criadas**: 17 módulos
- **Data de início**: 2025-12-08

## Mapeamento de Arquivos

### 1. CADT - Cadastros (5 arquivos)
Localização: `custom/gre/cadt/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| CadtCnAval.js | evaluations | ✅ Parcial | Cadastro de avaliações de clientes - migrar para EvaluationForm |
| CadtFuAval.js | evaluations | ✅ Parcial | Avaliações de funcionários - integrar com EmployeeList |
| CadtFuRecr.js | recruitment | ✅ Parcial | Recrutamento de funcionários - migrar para RecruitmentList |
| CadtRlAval.js | evaluations | ✅ Parcial | Relatório de avaliações - criar EvaluationReport |
| CadtRlFunc.js | employees | ✅ Parcial | Relatório de funcionários - integrar com EmployeeList |

**Ações necessárias**:
- [ ] Criar componente `EvaluationReport.tsx` em `features/evaluations/`
- [ ] Adicionar funcionalidades de avaliação ao `EmployeeList.tsx`
- [ ] Migrar lógica de recrutamento para React hooks

---

### 2. CEST - Controle de Estoque (14 arquivos)
Localização: `custom/gre/cest/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| CestDeDgta.js | stock-movement | ⚠️ Criar | Digitação de dados de estoque |
| CestDeLcto.js | stock-movement | ⚠️ Criar | Lançamento de estoque |
| CestDeMvto.js | stock-movement | ✅ Parcial | Movimento de estoque - integrar com StockMovementList |
| CestDePesq.js | stock-position | ⚠️ Criar | Pesquisa de estoque |
| CestDgCadt.js | stock-movement | ⚠️ Criar | Cadastro de digitação |
| CestFaFoto.js | documents | ⚠️ Criar | Fotos de estoque - criar StockPhotoManager |
| CestMvCadt.js | stock-movement | ⚠️ Criar | Cadastro de movimento |
| CestMvDgta.js | stock-movement | ⚠️ Criar | Digitação de movimento |
| CestMvLcto.js | stock-movement | ⚠️ Criar | Lançamento de movimento |
| CestMvMvto.js | stock-movement | ⚠️ Criar | Movimento de movimento |
| CestPsEstq.js | stock-position | ✅ Parcial | Posição de estoque - useStockPosition já existe |
| CestStCadt.js | stock-movement | ⚠️ Criar | Cadastro de status |
| CestStLcto.js | stock-movement | ⚠️ Criar | Lançamento de status |
| CestStMvto.js | stock-movement | ⚠️ Criar | Movimento de status |

**Ações necessárias**:
- [ ] Criar componente `StockEntryForm.tsx` para digitação/lançamento
- [ ] Criar componente `StockSearch.tsx` para pesquisa
- [ ] Criar componente `StockPhotoManager.tsx` para gerenciamento de fotos
- [ ] Consolidar múltiplos arquivos de movimento em hooks reutilizáveis
- [ ] Criar tipos TypeScript para entidades de estoque

---

### 3. COML - Comercial/Ordens de Serviço (14 arquivos)
Localização: `custom/gre/coml/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| ComlApBmsv.js | service-orders | ⚠️ Criar | Bem de serviço - criar AssetServiceManager |
| ComlApDvrg.js | divergences | ✅ Existe | Divergências de apontamento - DivergenceReport já existe |
| ComlApRdob.js | daily-reports | ⚠️ Criar | RDO (Relatório Diário de Obra) - integrar com DailyReportList |
| ComlApSecu.js | service-orders | ⚠️ Criar | Sequência de apontamento |
| ComlCdRdob.js | daily-reports | ⚠️ Criar | Cadastro de RDO |
| ComlDrRcso.js | resources | ⚠️ Criar | Recursos diários - integrar com useResourceStatus |
| ComlEdSecu.js | service-orders | ⚠️ Criar | Edição de sequência |
| ComlOsApnt.js | appointments | ✅ Parcial | Apontamentos de OS - migrar para useAppointmentEntry |
| ComlOsCmnt.js | service-orders | ⚠️ Criar | Comentários de OS - criar CommentsManager |
| ComlOsEdts.js | service-orders | ⚠️ Criar | Edição de tarefas de OS |
| ComlOsPlan.js | service-orders | ✅ Parcial | Planejamento de OS - ServiceOrderPlanning já existe |
| ComlOsTare.js | service-orders | ⚠️ Criar | Tarefas de OS - criar TaskManager |
| ComlRlRdia.js | daily-reports | ✅ Existe | Relatório diário - DailyReportList já existe |
| ComlTbDrve.js | resources | ⚠️ Criar | Tabela de recursos/drivers |

**Ações necessárias**:
- [ ] Criar `CommentsManager.tsx` para gerenciar comentários
- [ ] Criar `TaskManager.tsx` para gerenciar tarefas
- [ ] Criar `AssetServiceManager.tsx` para bens de serviço
- [ ] Integrar funcionalidades de RDO ao DailyReportList existente
- [ ] Criar hooks para gerenciar sequências de apontamentos

---

### 4. CPRA - Compras (2 arquivos)
Localização: `custom/gre/cpra/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| CpraPcMvto.js | purchasing | ✅ Parcial | Movimento de pedido de compra - integrar com usePurchasing |
| CpraPcRela.js | purchasing | ⚠️ Criar | Relatório de pedido de compra - criar PurchaseReport |

**Ações necessárias**:
- [ ] Criar componente `PurchaseReport.tsx`
- [ ] Adicionar relatórios ao módulo purchasing existente

---

### 5. DASH - Dashboards (9 arquivos)
Localização: `custom/gre/dash/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| DashApHrpr.js | service-orders | ✅ Existe | Horas prêmio - PremiumHours.tsx já existe |
| DashCdClie.js | dashboard | ✅ Existe | Dashboard de clientes - ClienteDashboard.tsx já existe |
| DashCdClie.jsx | dashboard | ✅ Existe | Versão JSX (duplicada) |
| DashClHist.js | dashboard | ⚠️ Criar | Histórico de clientes - criar ClientHistory |
| DashCnOrds.js | service-orders | ⚠️ Criar | Consolidado de ordens de serviço |
| DashFuSala.js | dashboard | ✅ Existe | Análise salarial - SalaryAnalysisReport.tsx já existe |
| DashHsSema.js | dashboard | ✅ Existe | Recursos semanais - WeeklyResourcesReport.tsx já existe |
| DashOsLcto.js | service-orders | ✅ Existe | Lançamento de OS - ServiceOrderList.tsx já existe |
| DashTbEmpr.js | dashboard | ⚠️ Criar | Tabela de empresas - criar CompanyDashboard |

**Ações necessárias**:
- [ ] Criar `ClientHistory.tsx` para histórico de clientes
- [ ] Criar `CompanyDashboard.tsx` para dashboard de empresas
- [ ] Criar `ServiceOrderConsolidated.tsx` para consolidado de OS
- [ ] Remover arquivo duplicado DashCdClie.jsx

---

### 6. PCPR - Propostas/Orçamentos (2 arquivos)
Localização: `custom/gre/pcpr/`

| Arquivo Legado | Feature React | Status | Observações |
|---------------|---------------|--------|-------------|
| PcprOsItem.js | service-orders | ⚠️ Criar | Itens de proposta de OS - criar ProposalItems |
| PcprOsLcto.js | service-orders | ⚠️ Criar | Lançamento de proposta - integrar com useProposals |

**Ações necessárias**:
- [ ] Criar componente `ProposalItems.tsx`
- [ ] Estender hook `useProposals` com funcionalidades de lançamento

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

### Fase 1 - Alta Prioridade (Já iniciada)
- ✅ Dashboard (ClienteDashboard)
- ✅ Service Orders (parcial)
- ✅ Divergences
- ✅ Daily Reports

### Fase 2 - Média Prioridade
- ⚠️ Stock Movement (consolidar módulos)
- ⚠️ Appointments (completar migração)
- ⚠️ Service Order Tasks e Comments
- ⚠️ Purchasing Reports

### Fase 3 - Baixa Prioridade
- ⚠️ Stock Photos
- ⚠️ Company Dashboard
- ⚠️ Client History
- ⚠️ Resource Tables

## Checklist Geral

### Por arquivo a refatorar:
- [ ] Analisar dependências e funções globais
- [ ] Identificar chamadas de API (Ajax)
- [ ] Extrair lógica de negócio
- [ ] Criar tipos TypeScript
- [ ] Criar service/API functions
- [ ] Criar custom hooks
- [ ] Criar componentes React
- [ ] Adicionar tratamento de erros
- [ ] Adicionar loading states
- [ ] Testar funcionalidades
- [ ] Remover arquivo legado após validação

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
