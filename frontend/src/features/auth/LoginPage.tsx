import { useState } from "react";
import { useLogin } from "./useLogin";
import { useUserStore } from "../../stores/useUserStore";
import { Navigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const user = useUserStore((state) => state.user);
    const loginMutation = useLogin();

    // Redirect if already logged in
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ username, password });
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.18),transparent_25%),radial-gradient(circle_at_50%_75%,rgba(99,102,241,0.28),transparent_30%)] blur-sm" />
            <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_0%,transparent_18%,rgba(255,255,255,0.04)_35%,transparent_60%)]" />

            <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
                <div className="grid w-full max-w-5xl grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="hidden lg:flex flex-col gap-6 text-white">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-500 grid place-items-center text-2xl font-black shadow-2xl shadow-blue-500/40">
                            K
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm uppercase tracking-[0.28em] text-blue-100/80">Kerp • vNext</p>
                            <h1 className="text-4xl font-bold leading-tight">Sistema corporativo para gestão integrada.</h1>
                            <p className="text-lg text-slate-200/90">
                                Acesse dashboards, ordens de serviço, recursos e documentos em um ambiente único, seguro e
                                consistente.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur shadow-lg shadow-blue-500/10">
                                <p className="text-sm text-blue-100/80">Disponibilidade</p>
                                <p className="text-2xl font-bold">99.9%</p>
                                <p className="text-xs text-slate-200/80 mt-1">Monitoração ativa e redundância</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur shadow-lg shadow-blue-500/10">
                                <p className="text-sm text-blue-100/80">Segurança</p>
                                <p className="text-2xl font-bold">LDAP / MFA</p>
                                <p className="text-xs text-slate-200/80 mt-1">Fluxo seguro com auditoria</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-8 lg:p-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none" />
                        <div className="relative space-y-8">
                            <div className="space-y-2 text-white">
                                <p className="text-sm uppercase tracking-[0.28em] text-blue-100/80">Acesso seguro</p>
                                <h2 className="text-3xl font-semibold">Entrar no KERP</h2>
                                <p className="text-sm text-slate-200/85">Use suas credenciais corporativas.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    id="username"
                                    label="Usuário"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Digite seu usuário"
                                    required
                                    autoComplete="username"
                                    className="bg-white/90"
                                />

                                <Input
                                    id="password"
                                    label="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                    required
                                    autoComplete="current-password"
                                    className="bg-white/90"
                                />

                                {loginMutation.isError && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 shadow-inner">
                                        {loginMutation.error?.message || "Erro ao fazer login"}
                                    </div>
                                )}

                                <Button type="submit" size="lg" className="w-full" isLoading={loginMutation.isPending}>
                                    {loginMutation.isPending ? "Entrando..." : "Entrar"}
                                </Button>
                            </form>

                            <div className="flex items-center justify-between text-xs text-slate-200/80">
                                <span>© 2024 KERP • Todos os direitos reservados</span>
                                <span className="text-blue-100/80">Ambiente corporativo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
