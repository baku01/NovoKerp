import { useUserStore } from "../stores/useUserStore";
import type { User } from "../types";
import { ClienteDashboard } from "../features/dashboard/ClienteDashboard";
import { HomeIndicators } from "../features/dashboard/HomeIndicators";
import { PageLayout } from "../components/layout/PageLayout";

export function DashboardPage() {
    const user = useUserStore((state) => state.user) as User | null;

    return (
        <PageLayout
            title="Dashboard"
            subtitle="Acompanhe a operação em tempo real e os indicadores críticos."
            tag="Visão executiva"
            actions={
                <div className="text-right text-sm text-slate-200/80">
                    <p className="font-semibold">{user?.us_nome}</p>
                    <p className="text-xs">{user?.us_grup}</p>
                </div>
            }
        >
            <div className="space-y-6">
                <HomeIndicators />
                <ClienteDashboard />
            </div>
        </PageLayout>
    );
}
