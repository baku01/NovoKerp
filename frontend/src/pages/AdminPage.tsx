import { UserProfileSettings } from "../features/admin/user/UserProfileSettings";
import { AuthorityManager } from "../features/admin/authority/AuthorityManager";
import { MenuManager } from "../features/admin/menu/MenuManager";
import { NotificationCenter } from "../features/admin/notifications/NotificationCenter";
import { DirectorySearch } from "../features/admin/search/DirectorySearch";
import { LocationHistory } from "../features/maps/LocationHistory";

export function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-slate-900">Administração</h1>
                    <p className="text-sm text-slate-600">Ferramentas migradas dos utilitários legados.</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow p-4">
                        <UserProfileSettings />
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900">Notificações</h2>
                        <NotificationCenter />
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow p-4">
                        <AuthorityManager />
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <MenuManager />
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow p-4">
                        <DirectorySearch />
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <LocationHistory />
                    </div>
                </section>
            </main>
        </div>
    );
}
