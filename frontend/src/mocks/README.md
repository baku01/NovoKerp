# Sistema de Mocks - NovoKerp

Este diretório contém a configuração completa do **Mock Service Worker (MSW)** para simular todas as APIs do sistema NovoKerp.

## 📁 Estrutura

```
src/mocks/
├── README.md          # Este arquivo - documentação
├── fixtures.ts        # Dados mock organizados
├── handlers.ts        # Handlers MSW para interceptar requisições
├── browser.ts         # Configuração MSW para navegador (dev)
└── server.ts          # Configuração MSW para Node (testes)
```

## 🚀 Como Funciona

### Em Desenvolvimento (Browser)

Os mocks são **automaticamente ativados** quando você executa `npm run dev`. Você verá mensagens no console:

```
🚀 [MSW] Starting Mock Service Worker...
📦 [MSW] All API calls will be intercepted by mock handlers
💡 [MSW] To disable mocks, comment out enableMocking() in main.tsx
```

Todas as chamadas de API passarão pelos handlers definidos em `handlers.ts` em vez de acessar o servidor real.

### Em Testes (Node)

Os mocks são configurados automaticamente pelo `setupTests.ts`:
- Inicializa antes de todos os testes
- Reseta entre testes
- Fecha após todos os testes

## 📦 Dados Mock Disponíveis

### Autenticação
- `mockUser` - Usuário de teste
- `mockCompanies` - Empresas disponíveis
- `mockMenuItems` - Menu do sistema

### Obras e Funcionários
- `mockWorksites` - 5 obras de exemplo
- `mockEmployees` - 5 funcionários variados
- `mockEmployeeTypes` - Tipos de contrato (CLT, PJ, etc.)
- `mockJobFunctions` - Funções (Eletricista, Pedreiro, etc.)

### Dashboard
- `mockDashboardObras` - Dados de progresso das obras
- `mockApontamentosDivergentes` - Apontamentos divergentes
- `mockApontamentosPendentes` - Apontamentos pendentes
- `mockHorasPremio` - Horas prêmio

### Ordens de Serviço
- `mockServiceOrders` - Ordens de serviço
- `mockActivities` - Atividades
- `mockSituacoesRecurso` - Status de recursos

### Estoque
- `mockStockPosition` - Posição de estoque
- `mockStockMovementItems` - Itens para movimentação

### RDO e Documentos
- `mockDailyReports` - Relatórios diários
- `mockPhotos` - Fotos de obras
- `mockDocuments` - Documentos

## 🔧 Procedimentos Mockados

O sistema intercepta chamadas para `/chamadaProcedure` e retorna dados baseados no parâmetro `lcWkProc`:

### Autenticação
- `consultaSenha` - Login
- `pesquisaEmpresas` - Buscar empresas
- `pesquisaMenu` - Menu do usuário

### Funcionários
- `pesquisaTodosFuncionarios` - Listar funcionários
- `pesquisaSomenteRecursos` - Listar recursos
- `pesquisaTipos` - Tipos de funcionário
- `pesquisaFuncoes` - Funções/cargos

### Dashboard
- `pesquisaDashboardObras` - Dashboard de obras
- `pesquisaDashboardApontamentosDivergentes` - Apontamentos divergentes
- `pesquisaDashboardApontamentosPendentes` - Apontamentos pendentes
- `pesquisaHorasPremio` - Horas prêmio

### Ordens de Serviço
- `consultaDashboardProposta` - Detalhes da OS
- `pesquisaAtividades` - Listar atividades
- `insereApontamento` - Salvar apontamento

### Estoque
- `pesquisaPosicaoEstoque` - Posição de estoque
- `pesquisaConsumoEstoque` - Consumo
- `insereMovimentacaoEstoque` - Salvar movimentação

### RDO
- `pesquisaRelatoriosDiarioObra` - Relatórios diários
- `pesquisaFotos` - Fotos da obra

E muitos outros! Veja `handlers.ts` para a lista completa.

## ✏️ Como Adicionar Novos Mocks

### 1. Adicionar Dados no `fixtures.ts`

```typescript
export const mockNovosDados = [
    { id: 1, nome: 'Item 1', valor: 100 },
    { id: 2, nome: 'Item 2', valor: 200 },
];
```

### 2. Importar no `handlers.ts`

```typescript
import { mockNovosDados } from './fixtures';
```

### 3. Adicionar Case no Switch

```typescript
case 'pesquisaNovoProcedimento':
    return HttpResponse.json(mockNovosDados);
```

## 🧪 Executando Testes

### Rodar todos os testes
```bash
npm test
```

### Rodar testes específicos
```bash
npm test employeeService
```

### Rodar testes em modo watch
```bash
npm test -- --watch
```

## 🎯 Exemplos de Uso

### Testando um Service

```typescript
import { describe, it, expect } from 'vitest';
import { employeeService } from './employeeService';
import { mockEmployees } from '../../mocks/fixtures';

describe('EmployeeService', () => {
    it('should fetch employees', async () => {
        const employees = await employeeService.getEmployees({});

        expect(employees).toEqual(mockEmployees);
        expect(employees.length).toBeGreaterThan(0);
    });
});
```

### Testando um Componente

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmployeeList from './EmployeeList';

describe('EmployeeList', () => {
    it('should display employees', async () => {
        render(<EmployeeList />);

        await waitFor(() => {
            expect(screen.getByText('João Silva')).toBeInTheDocument();
            expect(screen.getByText('Maria Souza')).toBeInTheDocument();
        });
    });
});
```

## 🔄 Desativando Mocks

### Temporariamente (Desenvolvimento)

Comente a linha em `main.tsx`:

```typescript
// enableMocking().then(() => {
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
// })
```

### Para um Teste Específico

```typescript
import { server } from '../../mocks/server';
import { rest } from 'msw';

it('should call real API', async () => {
    // Desativa os mocks para este teste
    server.resetHandlers();

    // Seu teste aqui
});
```

## 📝 Logs e Debug

O MSW loga automaticamente as requisições interceptadas:

```
[MSW] 🔍 Intercepted procedure: pesquisaTodosFuncionarios
[MSW] 📋 Parameters: [{"pa_nome":"id_empr","pa_tipo":"Int","pa_valo":1}]
```

Se um procedimento não estiver mockado:

```
[MSW] ⚠️  No mock defined for procedure: novoProcedimento
[MSW] 💡 Add a case for this procedure in handlers.ts
```

## 🎨 Personalizando Respostas

### Resposta Baseada em Parâmetros

```typescript
case 'pesquisaFuncionarios':
    // Pega o id_empr dos parâmetros
    const empresaId = params.find(p => p.pa_nome === 'id_empr')?.pa_valo;

    // Filtra funcionários por empresa
    const filtered = mockEmployees.filter(e => e.id_empr === empresaId);

    return HttpResponse.json(filtered);
```

### Simulando Erro

```typescript
case 'procedimentoComErro':
    return HttpResponse.json(
        { error: 'Erro simulado' },
        { status: 500 }
    );
```

### Simulando Delay

```typescript
case 'procedimentoLento':
    await delay(2000); // 2 segundos
    return HttpResponse.json(mockData);
```

## 🌐 Endpoints Adicionais

Além dos procedimentos, também mockamos:

### Upload de Fotos
```typescript
POST /insereFoto
// Retorna: { success: true, filename: "foto_123.jpg" }
```

### Envio de Email
```typescript
POST /enviaEmail
// Retorna: { success: true, message: "Email enviado" }
```

## 📚 Recursos

- [MSW Documentation](https://mswjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

## 🆘 Problemas Comuns

### Mocks não estão funcionando

1. Verifique se o Service Worker está registrado (veja o console)
2. Limpe o cache do navegador
3. Reinicie o servidor de desenvolvimento

### Teste falha com "network error"

1. Verifique se `setupTests.ts` está configurado
2. Confirme que o server MSW está iniciando no beforeAll

### Procedimento não mockado

1. Adicione o case no switch em `handlers.ts`
2. Crie os dados mock em `fixtures.ts` se necessário
3. Verifique os logs do console para ver o nome exato do procedimento

## 🤝 Contribuindo

Ao adicionar novas features:

1. **Adicione dados mock** em `fixtures.ts`
2. **Adicione handlers** em `handlers.ts`
3. **Crie testes** para validar os mocks
4. **Atualize esta documentação** se necessário
