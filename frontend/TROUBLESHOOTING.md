# NovoKerp React - Troubleshooting Guide

## 🔧 Problemas Comuns e Soluções

### 1. Erro ao Iniciar o Projeto

#### Problema: `npm run dev` falha
```bash
Error: Cannot find module 'vite'
```

**Solução:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### 2. Erros de CORS

#### Problema: Requisições bloqueadas pelo CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solução:**
1. Verificar se o backend está configurado para aceitar `localhost:5173`
2. Verificar o `.env`:
```bash
VITE_API_URL=http://www.atscs.com.br/
```

---

### 3. Erro de Autenticação

#### Problema: Login não funciona
```
Usuário ou senha inválidos
```

**Checklist:**
- [ ] Verificar se o backend está rodando
- [ ] Verificar URL da API no `.env`
- [ ] Testar credenciais no sistema legado
- [ ] Verificar console do navegador para erros de rede

**Debug:**
```typescript
// Em authService.ts, adicione:
console.log('Login params:', params);
console.log('Response:', result);
```

---

### 4. Dados Não Aparecem no Dashboard

#### Problema: Dashboard vazio ou com loading infinito

**Solução 1: Verificar empresa selecionada**
```typescript
// No console do navegador:
const user = JSON.parse(localStorage.getItem('soCdUser'));
console.log('User:', user);
console.log('Empresa:', user?.empresa);
```

**Solução 2: Verificar queries**
```typescript
// Adicione em useDashboardData.ts:
console.log('Obras query:', obrasQuery.data, obrasQuery.error);
```

**Solução 3: Limpar cache**
```typescript
// No console do navegador:
localStorage.clear();
// Depois faça login novamente
```

---

### 5. TypeScript Errors

#### Problema: Erros de tipo em imports
```
Cannot find module '@/components/ui/Input'
```

**Solução:**
Verificar se `tsconfig.json` tem path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

E `vite.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

### 6. Componentes Não Atualizam

#### Problema: Dados mudam mas UI não atualiza

**Causa:** TanStack Query cache

**Solução 1: Invalidar query**
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['dashboard'] });
```

**Solução 2: Forçar refetch**
```typescript
const { refetch } = useQuery({ ... });
refetch();
```

---

### 7. Erro 401 - Unauthorized

#### Problema: Requisições retornam 401

**Causa:** Token expirado ou inválido

**Solução:**
```typescript
// O sistema já faz logout automático em client.ts
// Mas você pode forçar:
localStorage.removeItem('soCdUser');
window.location.href = '/login';
```

---

### 8. Build Falha

#### Problema: `npm run build` com erros TypeScript

**Solução:**
```bash
# Verificar erros
npm run build

# Se houver erros de tipo, corrija-os
# Ou temporariamente:
npx tsc --noEmit --skipLibCheck
```

---

### 9. Lentidão na Aplicação

#### Problema: App lento ou travando

**Checklist:**
- [ ] Verificar se há muitos re-renders (React DevTools)
- [ ] Verificar queries duplicadas (TanStack Query DevTools)
- [ ] Verificar tamanho do bundle (npm run build)

**Solução: Adicionar React Query DevTools**
```bash
npm install @tanstack/react-query-devtools
```

```typescript
// Em App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

### 10. Erro em Produção

#### Problema: Funciona em dev mas não em produção

**Checklist:**
- [ ] Verificar variáveis de ambiente
- [ ] Verificar console do navegador
- [ ] Verificar se build foi feito corretamente
- [ ] Verificar HTTPS vs HTTP

**Debug:**
```bash
# Testar build localmente
npm run build
npm run preview
```

---

## 🐛 Debugging Tips

### 1. React DevTools
```bash
# Instalar extensão do navegador
# Chrome: React Developer Tools
# Firefox: React DevTools
```

### 2. TanStack Query DevTools
```typescript
// Ver estado de todas as queries
// Ver cache
// Ver loading states
```

### 3. Console Logging
```typescript
// Em qualquer componente:
console.log('Props:', props);
console.log('State:', state);
console.log('Query data:', data);
```

### 4. Network Tab
```
1. Abrir DevTools (F12)
2. Ir para Network
3. Filtrar por XHR
4. Ver requisições e respostas
```

---

## 📞 Quando Pedir Ajuda

Se nenhuma solução acima funcionar:

1. **Coletar informações:**
   - Mensagem de erro completa
   - Console do navegador
   - Network tab (requisições)
   - Versão do Node.js (`node -v`)
   - Sistema operacional

2. **Verificar documentação:**
   - `DEVELOPMENT.md`
   - `ARCHITECTURE.md`
   - `implementation_plan.md`

3. **Criar issue:**
   - Descrever o problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots se aplicável

---

## 🔍 Logs Úteis

### Ver todas as queries ativas
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
console.log('All queries:', queryClient.getQueryCache().getAll());
```

### Ver estado do Zustand
```typescript
import { useUserStore } from '@/stores/useUserStore';

console.log('User store:', useUserStore.getState());
```

### Ver localStorage
```typescript
console.log('LocalStorage:', {
  user: localStorage.getItem('soCdUser'),
  empresa: localStorage.getItem('scIdEmpr'),
});
```

---

**Última atualização:** 02/12/2024
