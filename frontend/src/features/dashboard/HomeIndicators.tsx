import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../../stores/useUserStore";
import { callProcedure, createParam } from "../../api/procedures";
import { Button } from "../../components/ui/Button";
import { Panel } from "../../components/layout/Panel";

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
            <Panel className="p-5" subtitle="Solicitações aguardando ação" title="Orçamentos pendentes">
                <div className="flex items-center justify-between">
                    <div className="text-4xl font-black text-slate-900">
                        {orcamentosQuery.isLoading ? "..." : (orcamentosQuery.data?.length ?? 0)}
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 grid place-items-center font-semibold">
                        ↗
                    </div>
                </div>
            </Panel>

            <Panel className="p-5" subtitle="Alertas para você" title="Notificações não lidas">
                <div className="flex items-center justify-between">
                    <div className="text-4xl font-black text-slate-900">
                        {notificacoesQuery.isLoading ? "..." : (notificacoesQuery.data?.length ?? 0)}
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 grid place-items-center font-semibold">
                        !
                    </div>
                </div>
            </Panel>

            <Panel className="p-5 flex items-center justify-between" subtitle="Acesso rápido ao cockpit" title="Ações rápidas">
                <Button type="button" variant="secondary">
                    Abrir dashboard
                </Button>
            </Panel>
        </div>
    );
}
