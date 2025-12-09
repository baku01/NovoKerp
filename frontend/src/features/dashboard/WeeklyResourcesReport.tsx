/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useMemo, useEffect } from "react";
import { useWeeklyResources } from "./useWeeklyResources";
import { Input } from "../../components/ui/Input";
import { MultiSelect } from "../../components/ui/MultiSelect";
import { format } from "date-fns";
import { jsonDate } from "../../utils/formatters";
import { useAuthority } from "../auth/useAuthority";
import { PageLayout } from "../../components/layout/PageLayout";
import { Panel } from "../../components/layout/Panel";

export const WeeklyResourcesReport: React.FC = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedWorksiteIds, setSelectedWorksiteIds] = useState<(string | number)[]>([]);
    const [selectedTypeSglas, setSelectedTypeSglas] = useState<(string | number)[]>([]);
    const authority = useAuthority("DASHTBEMPR", "SLTHORADTE"); // Same gate used in legacy dashboard

    const { worksites, resourceTypes, realUsage, updateDates, updatedUsageMap, isLoading } = useWeeklyResources(
        date,
        selectedWorksiteIds.map(String),
        selectedTypeSglas.map(String),
    );

    // Initialize selections when data loads (Select All by default logic from legacy?)
    // Legacy: "marcaDesmarcaCheckTodos..." implies manual selection but maybe defaults to all?
    // "glAxPesqDHS = true" initially.
    // Let's default to selecting all if nothing selected, or let the user select.
    // Actually, legacy `pesquisaQuantidade...` checks if array > 0. If empty, it passes empty string?
    // But the "Select All" button logic implies users interact.
    // Let's leave empty initially or Select All if convenient.
    // UX: Usually better to show everything by default.

    const worksitesInitialized = React.useRef(false);
    const typesInitialized = React.useRef(false);

    useEffect(() => {
        if (!worksitesInitialized.current && worksites.length > 0) {
            const preSelected = worksites.filter((w) => w.pd_clie > 0).map((w) => w.id_clie);
            if (preSelected.length > 0) {
                setSelectedWorksiteIds(preSelected);
            } else {
                setSelectedWorksiteIds(worksites.map((w) => w.id_clie));
            }

            worksitesInitialized.current = true;
        }
    }, [worksites]);

    useEffect(() => {
        if (!typesInitialized.current && resourceTypes.length > 0) {
            const preSelected = resourceTypes.filter((t) => t.pd_sgla > 0).map((t) => t.fu_sgla);
            if (preSelected.length > 0) {
                setSelectedTypeSglas(preSelected);
            } else {
                setSelectedTypeSglas(resourceTypes.map((t) => t.fu_sgla));
            }

            typesInitialized.current = true;
        }
    }, [resourceTypes]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split("-").map(Number);
            setDate(new Date(y, m - 1, d));
        }
    };

    // Process Data for Table
    // We need a row for each Selected Type (or all types returned in RealUsage?)
    // Legacy iterates `lmFuSgla` (selected functions).
    const tableRows = useMemo(() => {
        // Filter types based on selection
        const activeTypes = resourceTypes.filter(
            (t) => selectedTypeSglas.length === 0 || selectedTypeSglas.includes(t.fu_sgla),
        );

        return activeTypes
            .map((type) => {
                const realItem = realUsage.find((r) => r.fu_sgla === type.fu_sgla);
                const realQty = realItem ? realItem.qt_rcso : 0;

                const dateQtys = updateDates.map((d) => {
                    const dStr = format(d, "yyyy-MM-dd");
                    const updates = updatedUsageMap[dStr] || [];
                    const updateItem = updates.find((u) => u.fu_sgla === type.fu_sgla);
                    return updateItem ? updateItem.at_qtde : 0;
                });

                // Only show row if there is some data? Legacy: `if (lnToQtde > 0) { lcLiHist += lcLiSgla; }`
                const totalRowQty = realQty + dateQtys.reduce((a, b) => a + b, 0);

                return {
                    sgla: type.fu_sgla,
                    realQty,
                    dateQtys,
                    totalRowQty,
                };
            })
            .filter((row) => row.totalRowQty > 0);
    }, [resourceTypes, selectedTypeSglas, realUsage, updateDates, updatedUsageMap]);

    // Totals
    const totals = useMemo(() => {
        const realTotal = tableRows.reduce((acc, row) => acc + row.realQty, 0);
        const dateTotals = updateDates.map((_, idx) => {
            return tableRows.reduce((acc, row) => acc + row.dateQtys[idx], 0);
        });
        return { realTotal, dateTotals };
    }, [tableRows, updateDates]);

    return (
        <PageLayout
            title="Programação Semanal de Recursos"
            subtitle="Distribuição real e planejada por obra e função"
            tag="Planejamento"
        >
            <div className="space-y-4">
                <Panel title="Filtros">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            type="date"
                            label="Data Inicial"
                            value={format(date, "yyyy-MM-dd")}
                            onChange={handleDateChange}
                        />

                        <MultiSelect
                            label="Obras"
                            options={worksites.map((w) => ({ value: w.id_clie, label: w.cl_fant }))}
                            value={selectedWorksiteIds}
                            onChange={setSelectedWorksiteIds}
                            placeholder="Selecione as obras..."
                            disabled={isLoading || !authority.data?.allowed}
                        />

                        <MultiSelect
                            label="Funções"
                            options={resourceTypes.map((t) => ({ value: t.fu_sgla, label: t.fu_sgla }))}
                            value={selectedTypeSglas}
                            onChange={setSelectedTypeSglas}
                            placeholder="Selecione as funções..."
                            disabled={isLoading || !authority.data?.allowed}
                        />
                    </div>

                    {!authority.isLoading && authority.data && !authority.data.allowed && (
                        <div className="text-sm text-amber-600 mt-3">
                            Seu usuário não possui permissão para editar filtros avançados deste painel
                            (consultaAutoridadeObjeto).
                        </div>
                    )}
                </Panel>

                <Panel className="overflow-x-auto" title="Alocação por função">
                    {isLoading ? (
                        <div className="text-center py-8 text-slate-500">Carregando dados...</div>
                    ) : tableRows.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            Nenhum dado encontrado para os filtros selecionados.
                        </div>
                    ) : (
                        <table className="min-w-full text-sm text-left text-slate-600 border-collapse">
                            <thead className="bg-slate-100 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-4 py-2 border text-center">Função</th>
                                    <th className="px-4 py-2 border text-center bg-blue-50">Real</th>
                                    {updateDates.map((d) => (
                                        <th key={d.toISOString()} className="px-4 py-2 border text-center">
                                            {jsonDate(d.toISOString())} <br />
                                            <span className="text-[10px] text-slate-400">
                                                {format(d, "EEE", { locale: undefined })}
                                            </span>
                                            {/* Note: locale logic needed for 'seg', 'qui' etc if strict. jsonDate handles format. */}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row) => (
                                    <tr key={row.sgla} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 border font-medium text-center">{row.sgla}</td>
                                        <td className="px-4 py-2 border text-center bg-blue-50 font-semibold">
                                            {row.realQty}
                                        </td>
                                        {row.dateQtys.map((qty, idx) => (
                                            <td key={idx} className="px-4 py-2 border text-center">
                                                {qty}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr className="bg-slate-100 font-bold">
                                    <td className="px-4 py-2 border text-center">TOTAL</td>
                                    <td className="px-4 py-2 border text-center bg-blue-100">{totals.realTotal}</td>
                                    {totals.dateTotals.map((tot, idx) => (
                                        <td key={idx} className="px-4 py-2 border text-center">
                                            {tot}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    )}
                </Panel>
            </div>
        </PageLayout>
    );
};
