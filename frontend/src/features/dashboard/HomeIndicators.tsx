import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../../stores/useUserStore";
import { callProcedure, createParam } from "../../api/procedures";
import { Button } from "../../components/ui/Button";

export function HomeIndicators() {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const orcamentosQuery = useQuery({
        queryKey: ["home-indicators", "orcamentos", empresa],
        queryFn: () =>
            callProcedure<Record<string, unknown>[]>("pesquisaOrcamentos", [
                createParam("lcIdEmpr", "VarChar", empresa),
                createParam("lcIdUser", "VarChar", user?.id_user ?? ""),
                createParam("lnIdSitu", "Int", 35),
                createParam("lnIdClie", "Int", null),
                createParam("ldPeDtde", "SmallDatetime", null),
                createParam("ldPeDtat", "SmallDatetime", null),
                createParam("lnIdVend", "Int", null),
                createParam("lnStAplc", "Int", null),
            ]),
        enabled: !!empresa && !!user,
    });

    const notificacoesQuery = useQuery({
        queryKey: ["home-indicators", "notifications", empresa],
        queryFn: () =>
            callProcedure<Record<string, unknown>[]>("pesquisaNotificacoes", [
                createParam("lcIdUser", "VarChar", user?.id_user ?? ""),
                createParam("lcIdEmpr", "VarChar", empresa),
                createParam("lnNoRead", "Int", 0),
                createParam("ldNoDtde", "SmallDatetime", null),
                createParam("ldNoDtat", "SmallDatetime", null),
            ]),
        enabled: !!empresa && !!user,
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-xl p-4">
                <div className="text-sm text-slate-500">Orçamentos pendentes</div>
                <div className="text-3xl font-bold text-slate-900">
                    {orcamentosQuery.isLoading ? "..." : (orcamentosQuery.data?.length ?? 0)}
                </div>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
                <div className="text-sm text-slate-500">Notificações não lidas</div>
                <div className="text-3xl font-bold text-slate-900">
                    {notificacoesQuery.isLoading ? "..." : (notificacoesQuery.data?.length ?? 0)}
                </div>
            </div>
            <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
                <div>
                    <div className="text-sm text-slate-500">Ações rápidas</div>
                    <div className="text-base font-semibold text-slate-900">Abrir dashboard</div>
                </div>
                <Button type="button" variant="secondary">
                    Abrir
                </Button>
            </div>
        </div>
    );
}
