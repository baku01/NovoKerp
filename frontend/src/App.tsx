import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './stores/useUserStore';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeeList } from './features/employees/EmployeeList';
import { WeeklyResourcesReport } from './features/dashboard/WeeklyResourcesReport';
import { SalaryAnalysisReport } from './features/dashboard/SalaryAnalysisReport';
import { ServiceOrderDashboard } from './features/service-orders/ServiceOrderDashboard';
import { ServiceOrderList } from './features/service-orders/ServiceOrderList';
import { ServiceOrderPlanning } from './features/service-orders/ServiceOrderPlanning';
import { PremiumHours } from './features/service-orders/PremiumHours';
import { AppointmentEntry } from './features/appointments/AppointmentEntry';
import { ClientHistogram } from './features/dashboard/ClientHistogram';
import { CompanyTable } from './features/dashboard/CompanyTable';
import { EvaluationList } from './features/evaluations/EvaluationList';
import { EvaluationForm } from './features/evaluations/EvaluationForm';
import { RecruitmentList } from './features/recruitment/RecruitmentList';
import { DailyReportList } from './features/daily-reports/DailyReportList';
import { DivergenceReport } from './features/divergences/DivergenceReport';
import { DailyResourcesList } from './features/resources/DailyResourcesList';
import { StockPositionList } from './features/stock-position/StockPositionList';
import { StockMovementForm } from './features/stock-movement/StockMovementForm';
import { StockMovementList } from './features/transfers/StockMovementList'; // Added
import { ServiceMeasurementReport } from './features/measurements/ServiceMeasurementReport';
import { PurchasingList } from './features/purchasing/PurchasingList';
import { ProductionOrderList } from './features/production-orders/ProductionOrderList';
import { DocumentBrowser } from './features/documents/DocumentBrowser';
import './index.css';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funcionarios"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programacao-semanal"
            element={
              <ProtectedRoute>
                <WeeklyResourcesReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analise-salarial"
            element={
              <ProtectedRoute>
                <SalaryAnalysisReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordem-servico"
            element={
              <ProtectedRoute>
                <ServiceOrderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planejamento-os"
            element={
              <ProtectedRoute>
                <ServiceOrderPlanning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apontamento"
            element={
              <ProtectedRoute>
                <AppointmentEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/propostas"
            element={
              <ProtectedRoute>
                <ServiceOrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/horas-premio"
            element={
              <ProtectedRoute>
                <PremiumHours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/histograma"
            element={
              <ProtectedRoute>
                <ClientHistogram />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tabela-obras"
            element={
              <ProtectedRoute>
                <CompanyTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avaliacoes"
            element={
              <ProtectedRoute>
                <EvaluationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avaliacoes/:id"
            element={
              <ProtectedRoute>
                <EvaluationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recrutamento"
            element={
              <ProtectedRoute>
                <RecruitmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rdo"
            element={
              <ProtectedRoute>
                <DailyReportList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/divergencias"
            element={
              <ProtectedRoute>
                <DivergenceReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recursos-diarios"
            element={
              <ProtectedRoute>
                <DailyResourcesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorio-estoque"
            element={
              <ProtectedRoute>
                <StockPositionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movimentacao-estoque"
            element={
              <ProtectedRoute>
                <StockMovementForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transferencias-estoque"
            element={
              <ProtectedRoute>
                <StockMovementList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compras"
            element={
              <ProtectedRoute>
                <PurchasingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ordens-producao"
            element={
              <ProtectedRoute>
                <ProductionOrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentos"
            element={
              <ProtectedRoute>
                <DocumentBrowser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicao-servico"
            element={
              <ProtectedRoute>
                <ServiceMeasurementReport />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
