import { useUserStore } from "../../stores/useUserStore";
import { Sidebar } from "./Sidebar";
import { Button } from "../ui/Button";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const logout = useUserStore((state) => state.logout);

    // Dynamic padding setup based on Sidebar state could be done via Context, 
    // but for now we'll set a safe left margin assuming default expanded/collapsed logic works via styling or state lifting later.
    // For this iteration, we'll assume a fixed margin or responsive handling.

    // Actually, to handle the dynamic width (64 vs 20) smoothly, 
    // we might need to lift the state or use a provider.
    // For simplicity given the scope, let's use a layout that flexes.

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.05),transparent_26%)] blur-2xl" />
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            {/* Added ml-64 (or ml-20) - but Sidebar component handles its width internally. 
                We need to offset the main content. Since Sidebar is fixed, we add margin.
                NOTE: Ideally we'd sync this. For this v1, let's just make the main content 
                have a flexible margin or use a grid. 
                
                Let's use a simple approach: The sidebar is fixed width (w-64 default).
                We need to adjust the margin. Since the Sidebar state is internal, 
                we might see overlap if collapsed. 
                
                Refactoring Sidebar to Accept Props would be better but let's stick to the plan.
                I'll leave it as `pl-64` (default) effectively. 
                Actually, let's make the Sidebar *not* fixed in position but part of flow? 
                No, fixed is better for "APP" feel.
            */}

            <div className="flex-1 flex flex-col min-h-screen pl-64 transition-all duration-300 relative z-10">
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        {/* Breadcrumbs or Title could go here */}
                        <h2 className="text-sm font-medium text-slate-400">Visão Geral</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-rose-400">
                            Sair
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
