import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { MultiSelect } from "../../../components/ui/MultiSelect";
import { useAllWorksites } from "../../evaluations/useEvaluations";
import { useProposals } from "../useProposals";
import { useBmsReport } from "./useBmsReport";
import type { BmsFilters } from "./types";
import { brMoney } from "../../../utils/formatters";
import { PageLayout } from "../../../components/layout/PageLayout";
import { Panel } from "../../../components/layout/Panel";

function minutesToTime(minutes: number) {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

function downloadCsv(filename: string, rows: string[][]) {
    const csvContent = rows.map((cols) =>
        cols
            .map((value) => {
                if (value == null) return "";
                if (/[";\n]/.test(value)) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            })
            .join(";"),
    );

    const blob = new Blob([`\ufeff${csvContent.join("\n")}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function AssetServiceReport() {
    const defaultEndDate = useMemo(() => new Date(), []);
    const defaultStartDate = useMemo(() => subDays(defaultEndDate, 7), [defaultEndDate]);

    const [worksiteId, setWorksiteId] = useState("0");
    const [startDate, setStartDate] = useState<Date>(defaultStartDate);
    const [endDate, setEndDate] = useState<Date>(defaultEndDate);
    const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
    const [ordersTouched, setOrdersTouched] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    const numericWorksiteId = Number.parseInt(worksiteId, 10) || 0;

    const { worksites, isLoading: loadingWorksites } = useAllWorksites();
    const { proposals, isLoading: loadingProposals } = useProposals(
        Number.isFinite(numericWorksiteId) ? numericWorksiteId : 0,
    );

    const proposalOrderIds = useMemo(() => proposals.map((proposal) => proposal.id_ords), [proposals]);

    const effectiveSelectedOrderIds = useMemo(() => {
        if (!ordersTouched) return proposalOrderIds;
        return selectedOrderIds.filter((orderId) => proposalOrderIds.includes(orderId));
    }, [ordersTouched, proposalOrderIds, selectedOrderIds]);

    const filters: BmsFilters = useMemo(
        () => ({
            worksiteId: numericWorksiteId,
            startDate,
            endDate,
        }),
        [numericWorksiteId, startDate, endDate],
    );

    const allOrderIds = useMemo(() => proposals.map((proposal) => proposal.id_ords), [proposals]);

    const report = useBmsReport({
        filters,
        selectedOrderIds: effectiveSelectedOrderIds,
        allOrderIds,
        orders: proposals,
        enabled: hasGenerated,
    });

    const isGenerateDisabled =
        numericWorksiteId === 0 ||
        startDate > endDate ||
        effectiveSelectedOrderIds.length === 0 ||
        loadingProposals ||
        loadingWorksites;

    const handleGenerate = () => {
        if (!isGenerateDisabled) {
            setHasGenerated(true);
        }
    };

    const handleExport = () => {
        if (!report.rows.length) {
            return;
        }

        const header = [
            "Data",
            "Tipo",
            "Recurso",
            "Função",
            "Proposta",
            "Horas Normais",
            "Horas Extras 60%",
            "Horas Dom/Feriado",
            "Adic. Noturno",
            "Valor Total",
        ];

        const rows = report.rows.map((row) => [
            row.date,
            row.resourceType,
            row.resourceName,
            row.resourceFunction,
            row.orderName,
            minutesToTime(row.normalMinutes),
            minutesToTime(row.overtimeMinutes),
            minutesToTime(row.holidayMinutes),
            minutesToTime(row.nightMinutes),
            brMoney(row.totalValue),
        ]);

        downloadCsv(`bms-${format(startDate, "yyyyMMdd")}-${format(endDate, "yyyyMMdd")}.csv`, [header, ...rows]);
    };

    return (
        <PageLayout
            title="Bens de Serviço (BMS)"
            subtitle="Relatório consolidado de recursos apontados por obra e proposta."
            tag="OS"
        >
            <div className="space-y-6">
                <Panel className="lg:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select
                            label="Obra"
                            options={[
                                { value: "0", label: loadingWorksites ? "Carregando..." : "Selecione" },
                                ...worksites.map((worksite) => ({
                                    value: worksite.id_clie.toString(),
                                    label: worksite.cl_fant,
                                })),
                            ]}
                            value={worksiteId}
                            onChange={(event) => {
                                setWorksiteId(event.target.value);
                                setOrdersTouched(false);
                                setSelectedOrderIds([]);
                                setHasGenerated(false);
                            }}
                            disabled={loadingWorksites}
                        />

                        <Input
                            type="date"
                            label="Data Inicial"
                            value={format(startDate, "yyyy-MM-dd")}
                            onChange={(event) => {
                                if (event.target.value) {
                                    setStartDate(new Date(event.target.value));
                                }
                            }}
                        />
                        <Input
                            type="date"
                            label="Data Final"
                            value={format(endDate, "yyyy-MM-dd")}
                            onChange={(event) => {
                                if (event.target.value) {
                                    setEndDate(new Date(event.target.value));
                                }
                            }}
                        />

                        <MultiSelect
                            label="Propostas"
                            options={proposals.map((proposal) => ({
                                value: proposal.id_ords,
                                label: `${proposal.os_nume} - ${proposal.os_desc}`,
                            }))}
                            value={effectiveSelectedOrderIds}
                            onChange={(values) => {
                                setOrdersTouched(true);
                                setSelectedOrderIds(values.map((value) => Number(value)));
                            }}
                            placeholder={loadingProposals ? "Carregando propostas..." : "Selecione uma ou mais propostas"}
                            disabled={loadingProposals || !numericWorksiteId}
                        />
                    </div>

                    {startDate > endDate && (
                        <p className="text-sm text-red-600">A data inicial não pode ser maior que a data final.</p>
                    )}
                    {hasGenerated && selectedOrderIds.length === 0 && (
                        <p className="text-sm text-red-600">Selecione ao menos uma proposta.</p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
                            Gerar Relatório
                        </Button>
                        <Button onClick={handleExport} variant="secondary" disabled={!report.rows.length || report.isLoading}>
                            Exportar CSV
                        </Button>
                    </div>
                </Panel>

                <Panel className="lg:p-6 space-y-4">
                    {report.isLoading && <div className="text-center text-slate-500 py-12">Carregando BMS...</div>}

                    {!report.isLoading && hasGenerated && report.rows.length === 0 && (
                        <div className="text-center text-slate-400 py-12">
                            Nenhum apontamento encontrado para os filtros informados.
                        </div>
                    )}

                    {report.summary && report.rows.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                    <p className="text-sm text-slate-500">Registros</p>
                                    <p className="text-2xl font-bold text-slate-900">{report.summary.totalRows}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                                    <p className="text-sm text-slate-500">Horas Totais</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {report.summary.totalHours.toFixed(2)} h
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                    <p className="text-sm text-slate-500">Valor Total</p>
                                    <p className="text-2xl font-bold text-slate-900">{brMoney(report.summary.totalValue)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                                    <p className="text-sm text-slate-500">Sem Valor Hora</p>
                                    <p className="text-2xl font-bold text-slate-900">{report.summary.missingRates}</p>
                                </div>
                            </div>

                            {report.summary.missingRates > 0 && (
                                <p className="text-sm text-amber-600">
                                    Existem recursos sem valor de hora configurado. Atualize os valores de função ou
                                    equipamento nas propostas para cálculo completo.
                                </p>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-sm">
                                    <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Data</th>
                                            <th className="px-3 py-2 text-left">Tipo</th>
                                            <th className="px-3 py-2 text-left">Recurso</th>
                                            <th className="px-3 py-2 text-left">Função</th>
                                            <th className="px-3 py-2 text-left">Proposta</th>
                                            <th className="px-3 py-2 text-right">Horas Normais</th>
                                            <th className="px-3 py-2 text-right">Horas Extra 60%</th>
                                            <th className="px-3 py-2 text-right">Horas Dom/Fer</th>
                                            <th className="px-3 py-2 text-right">Adic. Noturno</th>
                                            <th className="px-3 py-2 text-right">Valor Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {report.rows.map((row) => (
                                            <tr key={row.id} className="hover:bg-slate-50">
                                                <td className="px-3 py-2 whitespace-nowrap">{row.date}</td>
                                                <td className="px-3 py-2 whitespace-nowrap">{row.resourceType}</td>
                                                <td className="px-3 py-2 whitespace-nowrap font-semibold">{row.resourceName}</td>
                                                <td className="px-3 py-2">{row.resourceFunction}</td>
                                                <td className="px-3 py-2 whitespace-nowrap">{row.orderName}</td>
                                                <td className="px-3 py-2 text-right font-mono">{minutesToTime(row.normalMinutes)}</td>
                                                <td className="px-3 py-2 text-right font-mono">{minutesToTime(row.overtimeMinutes)}</td>
                                                <td className="px-3 py-2 text-right font-mono">{minutesToTime(row.holidayMinutes)}</td>
                                                <td className="px-3 py-2 text-right font-mono">{minutesToTime(row.nightMinutes)}</td>
                                                <td className="px-3 py-2 text-right font-semibold">{brMoney(row.totalValue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </Panel>
            </div>
        </PageLayout>
    );
}
