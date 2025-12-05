# NovoKerp React - Guia de Desenvolvimento

## 🚀 Início Rápido

### 1. Instalação
```bash
cd frontend
npm install
```

### 2. Executar em Desenvolvimento
```bash
npm run dev
```
O navegador abrirá automaticamente em `http://localhost:5173`

### 3. Build para Produção
```bash
npm run build
npm run preview  # Para testar o build
```

---

## 📂 Estrutura do Projeto

```
src/
├── api/                    # Comunicação com backend
│   ├── client.ts          # Cliente Axios configurado
│   └── procedures.ts      # Adapter para chamadaProcedure
│
├── components/
│   ├── ui/                # Componentes reutilizáveis
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Button.tsx
│   │   └── CircularGauge.tsx
│   └── common/            # Componentes compartilhados
│
├── features/              # Módulos de negócio
│   ├── auth/             # Autenticação
│   ├── dashboard/        # Dashboards
│   └── employees/        # Funcionários
│
├── pages/                # Páginas (rotas)
├── stores/               # Estado global (Zustand)
├── types/                # Definições TypeScript
└── utils/                # Funções auxiliares
```

---

## 🔧 Padrões de Código

### 1. Criar um Novo Feature Module

```typescript
// 1. Criar service (API calls)
// src/features/meumodulo/meuModuloService.ts
import { callProcedure, createParam } from '@/api/procedures';

export async function fetchDados(userId: string) {
  const params = [
    createParam('lcIdUser', 'VarChar', userId),
  ];
  return callProcedure('minhaStoredProcedure', params);
}

// 2. Criar hook customizado
// src/features/meumodulo/useMeuModulo.ts
import { useQuery } from '@tanstack/react-query';
import { fetchDados } from './meuModuloService';

export function useMeuModulo() {
  return useQuery({
    queryKey: ['meumodulo'],
    queryFn: () => fetchDados('userId'),
  });
}

// 3. Criar componente
// src/features/meumodulo/MeuModulo.tsx
export function MeuModulo() {
  const { data, isLoading } = useMeuModulo();
  
  if (isLoading) return <div>Carregando...</div>;
  
  return <div>{/* seu componente */}</div>;
}
```

### 2. Adicionar Nova Rota

```typescript
// src/App.tsx
<Route
  path="/nova-rota"
  element={
    <ProtectedRoute>
      <MeuComponente />
    </ProtectedRoute>
  }
/>
```

### 3. Usar Componentes de Formulário

```typescript
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function MeuForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nome"
        {...register('nome', { required: 'Campo obrigatório' })}
        error={errors.nome}
      />
      <Button type="submit">Salvar</Button>
    </form>
  );
}
```

---

## 🎨 Componentes Disponíveis

### Input
```tsx
<Input
  label="Nome"
  placeholder="Digite..."
  required
  error={errors.nome}
  helperText="Texto de ajuda"
/>
```

### Select
```tsx
<Select
  label="Tipo"
  options={[
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
  ]}
  placeholder="Selecione..."
/>
```

### Button
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Clique aqui
</Button>
```

### CircularGauge
```tsx
<CircularGauge
  value={75}
  max={100}
  label="Progresso"
  color="green"
/>
```

---

## 🔌 Integração com Backend

### Chamar Stored Procedure

```typescript
import { callProcedure, createParam } from '@/api/procedures';

const result = await callProcedure('nomeDaProcedure', [
  createParam('lcIdUser', 'VarChar', 'usuario123'),
  createParam('lnIdCadt', 'Int', 456),
  createParam('ldData', 'SmallDatetime', '2024-12-02'),
]);
```

### Tipos de Parâmetros
- `VarChar` - String
- `Int` - Número inteiro
- `SmallDatetime` - Data (formato: 'YYYY-MM-DD')
- `Decimal` - Número decimal
- `Bit` - Boolean (0 ou 1)

---

## 🧪 Debugging

### Ver dados do TanStack Query
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
console.log(queryClient.getQueryData(['chave-da-query']));
```

### Ver estado do Zustand
```typescript
import { useUserStore } from '@/stores/useUserStore';

const user = useUserStore((state) => state.user);
console.log('User:', user);
```

---

## 📝 Próximos Passos

### Para Continuar a Migração:

1. **Finalizar Phase 3:**
   - Migrar `CestMvMvto.js` (Movimentação de Estoque)

2. **Phase 4 - Features Complexas:**
   - Migrar `ComlOsApnt.js` (Apontamentos)
   - Upload de fotos
   - Integração com Mapbox

3. **Melhorias:**
   - Adicionar menu de navegação
   - Implementar seletor de empresa
   - Sistema de notificações
   - Testes E2E

---

## 🐛 Problemas Comuns

### Erro de CORS
Verificar configuração do backend para aceitar requisições do `localhost:5173`

### Erro de autenticação
Verificar se o `VITE_API_URL` no `.env` está correto

### Componente não atualiza
Verificar se está usando TanStack Query corretamente e se as `queryKey` são únicas

---

## 📚 Recursos

- [React Docs](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [TailwindCSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Última atualização:** 02/12/2024
