import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { useDashboardData } from "../dashboard/useDashboardData";
import { useServiceOrderList } from "./useServiceOrderList";
import { useServiceOrderConsolidated } from "./useServiceOrderConsolidated";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { brDecimal } from "../../utils/formatters";

export const ServiceOrderConsolidated: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<number | null>(null);
    const [worksiteTouched, setWorksiteTouched] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const [orderTouched, setOrderTouched] = useState(false);
    const [hoursBase, setHoursBase] = useState<"planned" | "budget">("planned");

    const { obras, isLoading: loadingObras } = useDashboardData(date);
    const defaultWorksiteId = obras[0]?.id_clie ?? 0;
    const activeWorksiteId = worksiteTouched ? selectedWorksite || 0 : defaultWorksiteId;

    const { orders, isLoading: loadingOrders, summary } = useServiceOrderList(activeWorksiteId, date);

    const defaultOrderId = orders[0]?.id_ords ?? 0;
    const activeOrderId = orderTouched ? selectedOrder || 0 : defaultOrderId;

    const { plannedActual, situations, detail, isLoading, refetch } = useServiceOrderConsolidated(
        activeWorksiteId,
        activeOrderId,
        date,
    );

    const plannedCards = useMemo(() => {
        const plannedOrBudget = (planned?: number, budget?: number) =>
            hoursBase === "planned" ? planned || 0 : budget || planned || 0;

        const totalPlanned =
            plannedOrBudget(plannedActual?.os_mdpl, plannedActual?.mp_qthr) +
            plannedOrBudget(plannedActual?.os_mipl, plannedActual?.mi_qthr) +
            plannedOrBudget(plannedActual?.os_eqpl, plannedActual?.eq_qthr);

        const totalActual =
            (plannedActual?.fu_hamd || 0) + (plannedActual?.fu_hami || 0) + (plannedActual?.eq_hrap || 0);

        return {
            rows: [
                {
                    label: "Mão de Obra",
                    planned: plannedOrBudget(plannedActual?.os_mdpl, plannedActual?.mp_qthr),
                    actual: plannedActual?.fu_hamd || 0,
                },
                {
                    label: "Montagem/Instalação",
                    planned: plannedOrBudget(plannedActual?.os_mipl, plannedActual?.mi_qthr),
                    actual: plannedActual?.fu_hami || 0,
                },
                {
                    label: "Equipamentos",
                    planned: plannedOrBudget(plannedActual?.os_eqpl, plannedActual?.eq_qthr),
                    actual: plannedActual?.eq_hrap || 0,
                },
            ],
            totalPlanned,
            totalActual,
        };
    }, [plannedActual, hoursBase]);

    const statusTotal = situations.reduce((sum, s) => sum + (s.re_hrap || 0), 0);

    const orderTypeLabel = useMemo(() => {
        switch (detail?.os_tipo) {
            case 1:
                return "EMPREITA";
            case 2:
                return "HORA HOMEM";
            case 3:
                return "LOCAÇÃO";
            case 4:
                return "PRODUTO";
            default:
                return "N/D";
        }
    }, [detail?.os_tipo]);

    const completion = useMemo(() => {
        if (!plannedCards.totalPlanned) return 0;
        return Math.min(100, (plannedCards.totalActual / plannedCards.totalPlanned) * 100);
    }, [plannedCards]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Consolidado de Ordem de Serviço</h1>
                    <p className="text-slate-300">Migrado de DashCnOrds.js para React + React Query</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Input
                        type="date"
                        label="Data de referência"
                        value={format(date, "yyyy-MM-dd")}
                        onChange={(e) => {
                            if (e.target.value) {
                                const [y, m, d] = e.target.value.split("-").map(Number);
                                setDate(new Date(y, m - 1, d));
                            }
                        }}
                        className="min-w-[180px]"
                    />
                    <Select
                        label="Obra"
                        value={activeWorksiteId ? activeWorksiteId.toString() : ""}
                        onChange={(e) => {
                            const parsed = parseInt(e.target.value) || 0;
                            setWorksiteTouched(true);
                            setSelectedWorksite(parsed);
                            setOrderTouched(false);
                            setSelectedOrder(null);
                        }}
                        disabled={loadingObras}
                        options={[
                            { value: "", label: loadingObras ? "Carregando obras..." : "Selecione" },
                            ...obras.map((obra) => ({
                                value: obra.id_clie.toString(),
                                label: `${obra.cl_fant} (${obra.id_clie})`,
                            })),
                        ]}
                        className="min-w-[220px]"
                    />
                    <Select
                        label="O.S."
                        value={activeOrderId ? activeOrderId.toString() : ""}
                        onChange={(e) => {
                            setOrderTouched(true);
                            setSelectedOrder(parseInt(e.target.value) || 0);
                        }}
                        disabled={loadingOrders || !activeWorksiteId}
                        options={[
                            {
                                value: "",
                                label: loadingOrders ? "Carregando OS..." : "Selecione",
                            },
                            ...orders.map((order) => ({
                                value: order.id_ords.toString(),
                                label: `${order.os_nume} - ${order.cl_fant}`,
                            })),
                        ]}
                        className="min-w-[220px]"
                    />
                    <Select
                        label="Base de Horas"
                        value={hoursBase}
                        onChange={(e) => setHoursBase((e.target.value as "planned" | "budget") || "planned")}
                        options={[
                            { value: "planned", label: "Planejadas" },
                            { value: "budget", label: "Orçadas" },
                        ]}
                        className="min-w-[160px]"
                    />
                    <Button type="button" onClick={() => refetch()} disabled={isLoading || !activeOrderId}>
                        Atualizar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur rounded-xl border border-white/10 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Horas Planejadas x Apontadas</h2>
                        <span className="text-sm text-slate-300">
                            Base: {hoursBase === "planned" ? "Planejada (OS)" : "Orçada (OC)"}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {plannedCards.rows.map((row) => {
                            const pct = row.planned > 0 ? Math.min(100, (row.actual / row.planned) * 100) : 0;
                            return (
                                <div key={row.label} className="bg-slate-900/40 border border-white/5 rounded-lg p-4">
                                    <div className="text-slate-300 text-sm">{row.label}</div>
                                    <div className="text-2xl font-bold mt-1">{brDecimal(row.actual)} h</div>
                                    <div className="text-xs text-slate-400">Planejado: {brDecimal(row.planned)} h</div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className="h-2 bg-emerald-400"
                                            style={{ width: `${pct}%` }}
                                            aria-label={`${pct.toFixed(1)}% do planejado`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/60 border border-white/5 rounded-lg p-4">
                        <div>
                            <div className="text-slate-300 text-sm">Total Apontado</div>
                            <div className="text-3xl font-bold">{brDecimal(plannedCards.totalActual)} h</div>
                        </div>
                        <div className="text-right">
                            <div className="text-slate-300 text-sm">Total Planejado</div>
                            <div className="text-2xl font-semibold">{brDecimal(plannedCards.totalPlanned)} h</div>
                            <div className="text-emerald-400 text-sm mt-1">Progresso: {brDecimal(completion)}%</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Situação dos Apontamentos</h2>
                        <span className="text-sm text-slate-300">Total: {brDecimal(statusTotal)} h</span>
                    </div>
                    <div className="space-y-2">
                        {situations.length === 0 ? (
                            <p className="text-slate-400 text-sm">Nenhuma situação encontrada para a OS selecionada.</p>
                        ) : (
                            situations.map((situation) => {
                                const pct =
                                    statusTotal > 0 ? Math.min(100, (situation.re_hrap / statusTotal) * 100) : 0;
                                return (
                                    <div key={situation.sr_deno} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-200 font-medium">{situation.sr_deno}</span>
                                            <span className="text-slate-300">{brDecimal(situation.re_hrap)} h</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="h-2 bg-blue-400"
                                                style={{ width: `${pct}%` }}
                                                aria-label={`${pct.toFixed(1)}% das horas`}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-5 space-y-3">
                    <h2 className="text-xl font-semibold">Detalhes da OS</h2>
                    {detail ? (
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <dt className="text-slate-400">Cliente</dt>
                            <dd className="text-slate-100 font-medium">{detail.cl_fant}</dd>

                            <dt className="text-slate-400">Número</dt>
                            <dd className="text-slate-100">{detail.os_nume}</dd>

                            <dt className="text-slate-400">Tipo</dt>
                            <dd className="text-slate-100">{orderTypeLabel}</dd>

                            <dt className="text-slate-400">Responsável</dt>
                            <dd className="text-slate-100">{detail.os_resp}</dd>

                            <dt className="text-slate-400">Orçamento</dt>
                            <dd className="text-slate-100">{detail.oc_nume}</dd>

                            <dt className="text-slate-400">Cliente Final</dt>
                            <dd className="text-slate-100">{detail.os_ncli}</dd>

                            <dt className="text-slate-400">Contrato</dt>
                            <dd className="text-slate-100">{detail.os_ncon}</dd>

                            <dt className="text-slate-400">Situação</dt>
                            <dd className="text-slate-100">{detail.os_situ}</dd>

                            <dt className="text-slate-400">Horas Apontadas</dt>
                            <dd className="text-slate-100">{brDecimal(detail.re_hrap || 0)} h</dd>

                            {summary ? (
                                <>
                                    <dt className="text-slate-400">RDO Pendentes</dt>
                                    <dd className="text-slate-100">
                                        {summary.cl_qrdo - summary.cl_qaro} / {summary.cl_qrdo}
                                    </dd>
                                    <dt className="text-slate-400">% Avanço</dt>
                                    <dd className="text-slate-100">{brDecimal(summary.cl_pavc)}%</dd>
                                </>
                            ) : null}
                        </dl>
                    ) : (
                        <p className="text-slate-400 text-sm">Selecione uma OS para ver os detalhes.</p>
                    )}
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-5 space-y-3">
                    <h2 className="text-xl font-semibold">Descrição / Observações</h2>
                    {detail?.os_desc ? (
                        <p className="text-slate-100 leading-relaxed whitespace-pre-line">{detail.os_desc}</p>
                    ) : (
                        <p className="text-slate-400 text-sm">Nenhuma descrição disponível.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
