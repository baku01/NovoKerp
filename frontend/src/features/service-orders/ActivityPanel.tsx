import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { jsonDate } from "../../utils/formatters";
import { useActivities, useUpdateRemainingDays, useInactivateActivity, type ActivityRow } from "./useActivities";
import { useRdoOrdersByDate, useRdoWorksitesByDate } from "../daily-reports/useDailyReportDetails";

export function ActivityPanel() {
    const [date, setDate] = useState<Date>(new Date());
    const [worksiteId, setWorksiteId] = useState<number>(0);
    const [orderId, setOrderId] = useState<number>(0);
    const [remainingDraft, setRemainingDraft] = useState<Record<number, string>>({});

    const worksitesQuery = useRdoWorksitesByDate(date);
    const ordersQuery = useRdoOrdersByDate(worksiteId, date);

    const { reportQuery, resourcesQuery, commentsQuery } = useActivities(worksiteId, orderId, date);
    const updateRemaining = useUpdateRemainingDays(worksiteId, orderId, date);
    const inactivate = useInactivateActivity(orderId);

    const dateStr = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

    const handleUpdateRemaining = (activity: ActivityRow) => {
        const exclusionId = activity.id_excl || 0;
        const activityId = activity.id_ativ || 0;
        if (exclusionId + activityId === 0) {
            alert("Atividade inválida para atualização.");
            return;
        }
        const draftValue = remainingDraft[exclusionId] ?? activity.ap_dres ?? 0;
        const parsed = Number(draftValue);
        if (Number.isNaN(parsed)) {
            alert("Informe um número válido para dias restantes.");
            return;
        }
        updateRemaining.mutate(
            { exclusionId, activityId, remainingDays: parsed },
            {
                onSuccess: () => {
                    alert("Dias restantes atualizados.");
                },
                onError: () => alert("Erro ao atualizar dias restantes."),
            },
        );
    };

    const handleInactivate = (activity: ActivityRow) => {
        const exclusionId = activity.id_excl || 0;
        if (!exclusionId) {
            alert("Atividade inválida para inativar.");
            return;
        }
        if (!confirm("Deseja inativar esta atividade?")) return;
        inactivate.mutate(
            { exclusionId },
            {
                onSuccess: () => alert("Atividade inativada."),
                onError: () => alert("Erro ao inativar atividade."),
            },
        );
    };

    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Atividades da OS</h1>
                    <p className="text-sm text-slate-500">
                        Consulta diária de atividades, recursos e comentários da OS.
                    </p>
                </div>
                <div className="text-sm text-slate-500">Data: {jsonDate(date.toISOString())}</div>
            </div>

            {/* Filtros */}
            <div className="panel p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    type="date"
                    label="Data"
                    value={dateStr}
                    onChange={(e) => {
                        const [y, m, d] = e.target.value.split("-").map(Number);
                        setDate(new Date(y, m - 1, d));
                    }}
                />
                <Select
                    label="Obra"
                    options={[
                        { value: "0", label: "Selecione..." },
                        ...(worksitesQuery.data || []).map((w) => ({
                            value: w.id_clie,
                            label: w.cl_fant,
                        })),
                    ]}
                    value={worksiteId}
                    onChange={(e) => {
                        const id = Number(e.target.value);
                        setWorksiteId(id);
                        setOrderId(0);
                    }}
                />
                <Select
                    label="Ordem de Serviço"
                    options={[
                        { value: "0", label: "Selecione..." },
                        ...(ordersQuery.data || []).map((o) => ({
                            value: o.id_ords,
                            label: `${o.os_nume} - ${o.os_desc ?? ""}`,
                        })),
                    ]}
                    value={orderId}
                    onChange={(e) => setOrderId(Number(e.target.value))}
                    disabled={!worksiteId}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Lista de atividades */}
                <div className="bg-white rounded-lg shadow p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">Atividades</h2>
                        {(reportQuery.isLoading || updateRemaining.isPending || inactivate.isPending) && (
                            <span className="text-xs text-slate-500">Atualizando...</span>
                        )}
                    </div>
                    {reportQuery.isLoading ? (
                        <div className="text-slate-500">Carregando atividades...</div>
                    ) : (reportQuery.data || []).length === 0 ? (
                        <div className="text-slate-500">Nenhuma atividade encontrada para os filtros.</div>
                    ) : (
                        (reportQuery.data || []).map((act) => (
                            <div
                                key={`${act.id_excl ?? act.id_ativ}`}
                                className="border border-slate-100 rounded-lg p-3 flex flex-col gap-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-slate-500">Atividade</div>
                                        <div className="font-semibold text-slate-800">{act.at_deno}</div>
                                        <div className="text-xs text-slate-500">
                                            Tipo: {act.at_tipo} • OS {act.os_nume}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">Dias restantes</div>
                                        <div className="text-lg font-bold text-amber-600">{act.ap_dres ?? 0}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
                                    <div className="p-2 bg-slate-50 rounded">Entrada: {act.ap_hent ?? "-"}</div>
                                    <div className="p-2 bg-slate-50 rounded">Saída: {act.ap_hter ?? "-"}</div>
                                    <div className="p-2 bg-slate-50 rounded">
                                        Apontado em: {jsonDate(act.ap_real ?? null)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 items-center">
                                    <Input
                                        label="Dias restantes"
                                        value={remainingDraft[act.id_excl || 0] ?? act.ap_dres ?? ""}
                                        onChange={(e) =>
                                            setRemainingDraft((prev) => ({
                                                ...prev,
                                                [act.id_excl || 0]: e.target.value,
                                            }))
                                        }
                                        className="w-32"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => handleUpdateRemaining(act)}
                                        disabled={updateRemaining.isPending}
                                    >
                                        Salvar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleInactivate(act)}
                                        disabled={inactivate.isPending}
                                    >
                                        Inativar
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Recursos e comentários */}
                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">Recursos</h2>
                        {resourcesQuery.isLoading ? (
                            <div className="text-slate-500">Carregando recursos...</div>
                        ) : (resourcesQuery.data || []).length === 0 ? (
                            <div className="text-slate-500">Nenhum recurso encontrado.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-100 text-slate-600">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Funcionário</th>
                                            <th className="px-3 py-2 text-left">Função</th>
                                            <th className="px-3 py-2 text-center">Entrada</th>
                                            <th className="px-3 py-2 text-center">Saída</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(resourcesQuery.data || []).map((rc, idx) => (
                                            <tr key={`${rc.id_matr}-${idx}`} className="border-b border-slate-100">
                                                <td className="px-3 py-2">{rc.fu_nome}</td>
                                                <td className="px-3 py-2">{rc.fu_func}</td>
                                                <td className="px-3 py-2 text-center">{rc.ap_hent ?? "-"}</td>
                                                <td className="px-3 py-2 text-center">{rc.ap_hter ?? "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">Comentários</h2>
                        {commentsQuery.isLoading ? (
                            <div className="text-slate-500">Carregando comentários...</div>
                        ) : (commentsQuery.data || []).length === 0 ? (
                            <div className="text-slate-500">Nenhum comentário registrado.</div>
                        ) : (
                            <ul className="space-y-2">
                                {(commentsQuery.data || []).map((cm, idx) => (
                                    <li key={idx} className="border border-slate-100 rounded-lg p-3">
                                        <div className="text-sm font-semibold text-slate-800">{cm.cm_user}</div>
                                        <div className="text-xs text-slate-500 mb-1">{jsonDate(cm.cm_data)}</div>
                                        <div className="text-sm text-slate-700 whitespace-pre-wrap">{cm.cm_desc}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
