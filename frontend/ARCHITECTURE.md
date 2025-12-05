# NovoKerp React - Arquitetura Visual

## 🏗️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    (React + TypeScript)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Pages      │  │  Features    │  │  Components  │    │
│  │              │  │              │  │              │    │
│  │ - Login      │  │ - Auth       │  │ - Input      │    │
│  │ - Dashboard  │  │ - Dashboard  │  │ - Select     │    │
│  │              │  │ - Employees  │  │ - Button     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │             │
│         └─────────────────┴─────────────────┘             │
│                           │                                │
│  ┌────────────────────────┴────────────────────────┐      │
│  │           State Management Layer                │      │
│  │                                                  │      │
│  │  ┌──────────────┐        ┌──────────────┐      │      │
│  │  │   Zustand    │        │ TanStack     │      │      │
│  │  │  (Global)    │        │   Query      │      │      │
│  │  │              │        │  (Server)    │      │      │
│  │  │ - User       │        │              │      │      │
│  │  │ - Empresa    │        │ - Cache      │      │      │
│  │  └──────────────┘        │ - Loading    │      │      │
│  │                          │ - Errors     │      │      │
│  │                          └──────────────┘      │      │
│  └───────────────────────────────────────────────┘      │
│                           │                              │
│  ┌────────────────────────┴────────────────────────┐    │
│  │              API Layer                          │    │
│  │                                                  │    │
│  │  ┌──────────────┐        ┌──────────────┐      │    │
│  │  │ Axios Client │   ───▶ │  Procedures  │      │    │
│  │  │              │        │   Adapter    │      │    │
│  │  │ - Interceptors│       │              │      │    │
│  │  │ - Auth       │        │ callProcedure│      │    │
│  │  └──────────────┘        └──────────────┘      │    │
│  └───────────────────────────────────────────────┘    │
│                           │                            │
└───────────────────────────┼────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND LEGADO                         │
│                   (Stored Procedures)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  chamadaProcedure?lcWkIsql=...&lcWkProc=...               │
│                                                             │
│  - consultaSenha                                           │
│  - pesquisaDashboardObras                                  │
│  - pesquisaTodosFuncionarios                               │
│  - ... (outras procedures)                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Autenticação
```
User Input (Login Form)
    ↓
useLogin Hook (TanStack Query Mutation)
    ↓
authService.login()
    ↓
callProcedure('consultaSenha', params)
    ↓
Axios → Backend
    ↓
Response → Update Zustand Store
    ↓
Navigate to Dashboard
```

### 2. Dashboard Data
```
Component Mount (ClienteDashboard)
    ↓
useDashboardData Hook
    ↓
TanStack Query (3 parallel queries)
    ├─ fetchDashboardObras
    ├─ fetchApontamentosDivergentes
    └─ fetchApontamentosPendentes
    ↓
callProcedure for each
    ↓
Axios → Backend
    ↓
Cache in TanStack Query
    ↓
Render with Data
```

### 3. Employee List
```
Component Mount (EmployeeList)
    ↓
useQuery Hook
    ↓
fetchFuncionarios(filters)
    ↓
callProcedure('pesquisaTodosFuncionarios', params)
    ↓
Axios → Backend
    ↓
Cache & Display
```

## 📦 Estrutura de Módulos

### Feature Module Pattern
```
features/
└── nome-feature/
    ├── nomeFeatureService.ts    # API calls
    ├── useNomeFeature.ts         # Custom hooks
    ├── NomeFeature.tsx           # Main component
    └── components/               # Feature-specific components
        └── SubComponent.tsx
```

### Exemplo Prático (Dashboard)
```
features/dashboard/
├── dashboardService.ts           # fetchDashboardObras, etc.
├── useDashboardData.ts           # useQuery hook
└── ClienteDashboard.tsx          # UI component
```

## 🎨 Component Hierarchy

```
App
├── BrowserRouter
│   └── Routes
│       ├── /login
│       │   └── LoginPage
│       │
│       ├── /dashboard (Protected)
│       │   └── DashboardPage
│       │       ├── Header (user info, logout)
│       │       └── ClienteDashboard
│       │           └── Obra Cards
│       │               ├── CircularGauge (x2)
│       │               └── Metrics
│       │
│       └── /funcionarios (Protected)
│           └── EmployeeList
│               ├── Search Filters
│               │   ├── Input (nome)
│               │   ├── Input (matricula)
│               │   └── Button (search)
│               │
│               └── Employee Cards
│                   ├── Header (collapsed)
│                   └── Details (expanded)
```

## 🔐 Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   Login Page        │
│  (not authenticated) │
└──────┬──────────────┘
       │ credentials
       ▼
┌─────────────────────┐
│  useLogin Hook      │
│  (mutation)         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Backend Auth       │
│  (consultaSenha)    │
└──────┬──────────────┘
       │ success
       ▼
┌─────────────────────┐
│  Zustand Store      │
│  setUser()          │
│  localStorage       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Navigate           │
│  /dashboard         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Protected Route    │
│  ✓ user exists      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Dashboard Page     │
│  (authenticated)    │
└─────────────────────┘
```

## 🗄️ State Management Strategy

### Global State (Zustand)
- **User session** - Persisted in localStorage
- **Selected empresa** - Current company context
- **Theme preferences** (future)

### Server State (TanStack Query)
- **Dashboard data** - Cached for 5 minutes
- **Employee list** - Cached with filters as key
- **Automatic refetch** on window focus
- **Background updates**

### Local State (useState)
- **Form inputs** - Controlled components
- **UI state** - Expanded cards, modals
- **Temporary filters** - Before search

## 🚀 Performance Optimizations

1. **Code Splitting** - React.lazy for routes
2. **Query Caching** - TanStack Query (5 min stale time)
3. **Memoization** - React.memo for expensive components
4. **Virtual Scrolling** - For long lists (future)
5. **Debounced Search** - Avoid excessive API calls

## 📱 Responsive Design

- **Mobile First** - TailwindCSS breakpoints
- **Flexible Grids** - grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Touch Friendly** - Large click targets
- **Adaptive UI** - Different layouts for mobile/desktop

---

**Última atualização:** 02/12/2024
