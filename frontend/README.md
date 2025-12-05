# NovoKerp - React Migration

Modern React application migrating from legacy jQuery/Framework7/Cordova stack.

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Access: `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # Backend communication layer
│   ├── components/ui/    # Reusable UI components
│   ├── features/         # Feature modules (auth, dashboard, employees)
│   ├── pages/            # Route pages
│   ├── stores/           # Zustand global state
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
├── .env                  # Environment variables
└── package.json
```

## 🎯 Current Status

- ✅ **Phase 0:** Foundation (100%)
- ✅ **Phase 1:** Authentication (100%)
- ✅ **Phase 2:** Dashboards (100%)
- 🔄 **Phase 3:** Cadastros (66%)
- ⏳ **Phase 4:** Complex Features (0%)

## 📚 Documentation

- [`SUMMARY.md`](/.gemini/antigravity/brain/ece2eb06-3062-4219-885c-38cb9cc323d4/SUMMARY.md) - Executive summary
- [`implementation_plan.md`](/.gemini/antigravity/brain/ece2eb06-3062-4219-885c-38cb9cc323d4/implementation_plan.md) - Detailed migration plan
- [`walkthrough.md`](/.gemini/antigravity/brain/ece2eb06-3062-4219-885c-38cb9cc323d4/walkthrough.md) - Phase-by-phase walkthrough
- [`task.md`](/.gemini/antigravity/brain/ece2eb06-3062-4219-885c-38cb9cc323d4/task.md) - Task tracking

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Routing
- **React Hook Form + Zod** - Forms & validation
- **Recharts** - Data visualization

## 🔗 Available Routes

- `/login` - Authentication page
- `/dashboard` - Dashboard de Obras
- `/funcionarios` - Employee list

## 🤝 Contributing

Follow the migration plan and maintain consistency with established patterns.
