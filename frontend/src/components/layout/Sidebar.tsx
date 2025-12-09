import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

export function Sidebar() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const menuItems = [
        { label: "Dashboard", path: "/dashboard", icon: "📊" },
        { label: "Funcionários", path: "/funcionarios", icon: "👥" },
        { label: "Propostas / OS", path: "/propostas", icon: "📝" },
        { label: "Planejamento", path: "/planejamento-os", icon: "📅" },
        { label: "Apontamento", path: "/apontamento", icon: "⏱️" },
        { label: "Documentos", path: "/documentos", icon: "📁" },
        { label: "Estoque", path: "/relatorio-estoque", icon: "📦" },
        { label: "Avaliações", path: "/avaliacoes", icon: "⭐" },
    ];

    if (user?.ad_admi === "J") {
        menuItems.push({ label: "Admin", path: "/admin", icon: "⚙️" });
    }

    return (
        <aside
            className={`
                fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out
                border-r border-white/5 bg-slate-900/95 backdrop-blur-xl
                ${isCollapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
                <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                        K
                    </div>
                    {!isCollapsed && (
                        <div>
                            <span className="font-bold text-lg tracking-tight text-white block leading-none">KERP</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">Corporativo</span>
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        ←
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-10rem)] custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                                ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                }
                            `}
                            title={isCollapsed ? item.label : ""}
                        >
                            <span className="text-xl flex-shrink-0">{item.icon}</span>
                            {!isCollapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}
                            {isActive && !isCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Expander text if collapsed */}
            {isCollapsed && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    >
                        →
                    </button>
                </div>
            )}

            {/* User Profile Summary (Bottom) */}
            {!isCollapsed && (
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 grid place-items-center text-xs font-bold text-slate-300">
                            {user?.us_nome?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.us_nome}</p>
                            <p className="text-xs text-slate-500 truncate">{empresa || user?.us_grup}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
