import { useUserStore } from '../stores/useUserStore';
import type { User } from '../types';
import { ClienteDashboard } from '../features/dashboard/ClienteDashboard';

export function DashboardPage() {
    const user = useUserStore((state) => state.user) as User | null;
    const logout = useUserStore((state) => state.logout);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">KERP</h1>
                            <p className="text-sm text-slate-600">Dashboard</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">{user?.us_nome}</p>
                                <p className="text-xs text-slate-500">{user?.us_grup}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Dashboard */}
            <main>
                <ClienteDashboard />
            </main>
        </div>
    );
}
