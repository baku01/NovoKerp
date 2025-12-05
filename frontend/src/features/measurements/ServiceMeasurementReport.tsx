import React, { useState, useMemo } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import { useAllWorksites } from '../evaluations/useEvaluations';
import { useProposals } from '../service-orders/useProposals';
import { fetchMeasurementResources, fetchProposalRates, fetchProposalShifts, fetchProposalDetails, logMeasurementGeneration } from './measurementService';
import { MeasurementResource, ProposalRate, ProposalShift, ProposalInfo } from './types';
import { calculateHours, minutesToHM } from './calculations';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subDays } from 'date-fns';
import { jsonDate, brMoney } from '../../utils/formatters';
import * as XLSX from 'xlsx';

export const ServiceMeasurementReport: React.FC = () => {
    const { user } = useUserStore();
    const { worksites } = useAllWorksites();

    // Filters
    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 15));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedProposals, setSelectedProposals] = useState<string[]>([]); // Multi-select simulation

    // Data
    const { proposals } = useProposals(parseInt(selectedWorksite) || 0);
    const [resources, setResources] = useState<MeasurementResource[]>([]);
    const [rates, setRates] = useState<ProposalRate[]>([]);
    const [shifts, setShifts] = useState<ProposalShift[]>([]);
    const [proposalDetails, setProposalDetails] = useState<ProposalInfo[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        if (selectedWorksite === '0') {
            alert("Selecione uma obra.");
            return;
        }
        if (selectedProposals.length === 0 && proposals.length > 0) {
             // If none selected, maybe select all? Legacy logic forces selection or handles "all".
             // Let's assume user must select at least one or we default to all.
             // For now, alert.
             alert("Selecione pelo menos uma proposta.");
             return;
        }

        setIsLoading(true);
        try {
            const propIds = selectedProposals.map(Number);
            const worksiteId = parseInt(selectedWorksite);

            // Fetch concurrently
            const [fetchedResources, fetchedRates, fetchedShifts, fetchedDetails] = await Promise.all([
                fetchMeasurementResources(user?.empresa || '1', {
                    startDate,
                    endDate,
                    worksiteId,
                    proposalIds: propIds
                }),
                fetchProposalRates(user?.empresa || '1', propIds),
                fetchProposalShifts(user?.empresa || '1', propIds, worksiteId),
                fetchProposalDetails(user?.empresa || '1', worksiteId)
            ]);

            // Filter details to only selected proposals
            const filteredDetails = fetchedDetails.filter(d => propIds.includes(d.id_ords));

            setResources(fetchedResources);
            setRates(fetchedRates);
            setShifts(fetchedShifts);
            setProposalDetails(filteredDetails);
            setGenerated(true);

            // Log
            await logMeasurementGeneration(
                user?.empresa || '1',
                user?.id_user || 'UNK',
                fetchedDetails[0]?.cl_fant || '',
                `Propostas: ${propIds.join(', ')}`
            );

        } catch (err) {
            console.error(err);
            alert("Erro ao gerar relatório.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportExcel = () => {
        if (!generated) return;

        // This is a simplified export. A full HTML-to-Excel like legacy is complex in React.
        // We will construct a data set for SheetJS.

        const wsData: any[][] = [];

        // Header
        wsData.push(["BOLETIM MEDIÇÃO DE SERVIÇO"]);
        wsData.push(["EMITIDO EM", format(new Date(), 'dd/MM/yyyy HH:mm')]);
        wsData.push([]);

        proposalDetails.forEach(prop => {
            wsData.push(["OBRA:", prop.cl_fant]);
            wsData.push(["LOCAL:", `${prop.id_cida}/${prop.id_esta}`]);
            wsData.push(["PERÍODO:", `${format(startDate, 'dd/MM/yyyy')} A ${format(endDate, 'dd/MM/yyyy')}`]);
            wsData.push(["PROPOSTA:", prop.os_nume, prop.os_desc]);
            wsData.push([]);

            wsData.push(["Data", "Tipo", "Recurso", "Função", "Evento", "Total Hrs", "Valor Unit.", "Total"]);

            let propTotal = 0;
            const propResources = resources.filter(r => r.id_ords === prop.id_ords);

            propResources.forEach(res => {
                const rateObj = rates.find(rt => rt.id_ords === res.id_ords && rt.fu_deno === res.fu_func)
                             || rates.find(rt => rt.id_ords === res.id_ords && rt.fu_deno === res.fu_nome); // Sometimes matches name for Equipment?

                const hourlyRate = rateObj?.fu_vlhr || 0;

                // Calculate lines
                // 1. Sunday/Holiday
                const sunHrs = calculateHours(res, shifts, 'SUNDAY_100');
                if (sunHrs) {
                    const h = parseFloat(sunHrs.replace(':', '.')); // Approx for math
                    // Accurate Math:
                    const [hh, mm] = sunHrs.split(':').map(Number);
                    const decHrs = hh + (mm/60);

                    const val = hourlyRate * decHrs; // No extra % usually for 100%? Legacy logic check:
                    // Legacy: if (lnOsHdrs > 0) -> Rate + Rate (100%)? Or Rate * (1 + 100/100)?
                    // Legacy code: brMoney(lnFuVlhr + lnOsHdrs) or lnFuVlhr * (1 + lnOsHdom / 100)
                    // Let's assume Rate * 2 for Sunday if not specified. But legacy uses `os_hdom` %
                    const sundayPerc = prop.os_hdom || 0;
                    const totalVal = val * (1 + sundayPerc / 100);

                    wsData.push([
                        jsonDate(res.ap_data),
                        res.cb_tmdo,
                        res.fu_nome,
                        res.fu_func,
                        `H./${sundayPerc}%`,
                        sunHrs,
                        hourlyRate * (1 + sundayPerc / 100),
                        totalVal
                    ]);
                    propTotal += totalVal;
                } else {
                    // Normal
                    const normHrs = calculateHours(res, shifts, 'NORMAL');
                    if (normHrs) {
                        const [hh, mm] = normHrs.split(':').map(Number);
                        const decHrs = hh + (mm/60);
                        const totalVal = hourlyRate * decHrs;

                        wsData.push([
                            jsonDate(res.ap_data),
                            res.cb_tmdo,
                            res.fu_nome,
                            res.fu_func,
                            `H./NORMAL`,
                            normHrs,
                            hourlyRate,
                            totalVal
                        ]);
                        propTotal += totalVal;
                    }

                    // Extra 60%
                    const extraHrs = calculateHours(res, shifts, 'EXTRA_60');
                    if (extraHrs) {
                        const [hh, mm] = extraHrs.split(':').map(Number);
                        const decHrs = hh + (mm/60);
                        const extraPerc = prop.os_hext || 0;
                        const totalVal = (hourlyRate * decHrs) * (1 + extraPerc / 100);

                        wsData.push([
                            jsonDate(res.ap_data),
                            res.cb_tmdo,
                            res.fu_nome,
                            res.fu_func,
                            `H./${extraPerc}%`,
                            extraHrs,
                            hourlyRate * (1 + extraPerc / 100),
                            totalVal
                        ]);
                        propTotal += totalVal;
                    }
                }

                // Night Aditional
                const nightHrs = calculateHours(res, shifts, 'NIGHT_20');
                if (nightHrs) {
                     const [hh, mm] = nightHrs.split(':').map(Number);
                     const decHrs = hh + (mm/60);
                     const nightPerc = prop.os_hnot || 0;
                     // Night add is usually just the percentage on top, not full hour?
                     // Legacy: lnFuVlhr * (lnOsHnot / 100) -> Just the Add-on value
                     const totalVal = (hourlyRate * decHrs) * (nightPerc / 100);

                     wsData.push([
                        jsonDate(res.ap_data),
                        res.cb_tmdo,
                        res.fu_nome,
                        res.fu_func,
                        `AD. NOT.`,
                        nightHrs,
                        hourlyRate * (nightPerc / 100),
                        totalVal
                    ]);
                    propTotal += totalVal;
                }
            });

            wsData.push(["", "", "", "", "", "", "TOTAL PROPOSTA:", propTotal]);
            wsData.push([]);
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "BMS");
        XLSX.writeFile(wb, "bms_report.xlsx");
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold text-slate-800 mb-4">Boletim de Medição de Serviço (BMS)</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        type="date"
                        label="Data Inicial"
                        value={format(startDate, 'yyyy-MM-dd')}
                        onChange={(e) => e.target.value && setStartDate(new Date(e.target.value + 'T00:00:00'))}
                    />
                    <Input
                        type="date"
                        label="Data Final"
                        value={format(endDate, 'yyyy-MM-dd')}
                        onChange={(e) => e.target.value && setEndDate(new Date(e.target.value + 'T00:00:00'))}
                    />
                    <Select
                        label="Obra"
                        options={[
                            { value: '0', label: 'SELECIONE UMA OBRA' },
                            ...worksites.map(w => ({ value: w.id_clie, label: w.cl_fant }))
                        ]}
                        value={selectedWorksite}
                        onChange={(e) => {
                            setSelectedWorksite(e.target.value);
                            setSelectedProposals([]);
                        }}
                    />
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Propostas</label>
                        <select
                            multiple
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-32"
                            value={selectedProposals}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setSelectedProposals(selected);
                            }}
                            disabled={selectedWorksite === '0'}
                        >
                            {proposals.map(p => (
                                <option key={p.id_ords} value={p.id_ords}>
                                    {p.os_nume} - {p.os_desc}
                                </option>
                            ))}
                        </select>
                        <span className="text-xs text-slate-400 mt-1">Segure Ctrl/Cmd para selecionar múltiplas</span>
                    </div>
                </div>
                <div className="mt-4 flex space-x-2">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || selectedWorksite === '0'}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Gerando...' : 'Gerar Relatório'}
                    </button>
                    {generated && (
                        <button
                            onClick={handleExportExcel}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Exportar Excel
                        </button>
                    )}
                </div>
            </div>

            {/* Preview Area */}
            {generated && (
                <div className="bg-white p-4 rounded-lg shadow flex-1 overflow-auto">
                    <div className="text-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold">BOLETIM MEDIÇÃO DE SERVIÇO</h2>
                        <p className="text-sm text-slate-500">Emitido em {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                    </div>

                    {proposalDetails.map(prop => {
                        const propResources = resources.filter(r => r.id_ords === prop.id_ords);
                        if (propResources.length === 0) return null;

                        return (
                            <div key={prop.id_ords} className="mb-8 border-b pb-8 last:border-0">
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div><span className="font-bold">OBRA:</span> {prop.cl_fant}</div>
                                    <div><span className="font-bold">LOCAL:</span> {prop.id_cida}/{prop.id_esta}</div>
                                    <div><span className="font-bold">PERÍODO:</span> {format(startDate, 'dd/MM/yyyy')} A {format(endDate, 'dd/MM/yyyy')}</div>
                                    <div><span className="font-bold">PROPOSTA:</span> {prop.os_nume} - {prop.os_desc}</div>
                                </div>

                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Recurso</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Função</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Evento</th>
                                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Hrs</th>
                                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Unit.</th>
                                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {propResources.map((res, idx) => {
                                            const rateObj = rates.find(rt => rt.id_ords === res.id_ords && rt.fu_deno === res.fu_func)
                                                         || rates.find(rt => rt.id_ords === res.id_ords && rt.fu_deno === res.fu_nome);
                                            const hourlyRate = rateObj?.fu_vlhr || 0;

                                            // Render Rows helper
                                            const rows = [];

                                            // Sunday/Holiday
                                            const sunHrs = calculateHours(res, shifts, 'SUNDAY_100');
                                            if (sunHrs) {
                                                const [hh, mm] = sunHrs.split(':').map(Number);
                                                const val = hourlyRate * (hh + mm/60) * (1 + (prop.os_hdom || 0)/100);
                                                rows.push({ event: `H./${prop.os_hdom}%`, hrs: sunHrs, rate: hourlyRate * (1 + (prop.os_hdom || 0)/100), total: val });
                                            } else {
                                                const normHrs = calculateHours(res, shifts, 'NORMAL');
                                                if (normHrs) {
                                                    const [hh, mm] = normHrs.split(':').map(Number);
                                                    rows.push({ event: `H./NORMAL`, hrs: normHrs, rate: hourlyRate, total: hourlyRate * (hh + mm/60) });
                                                }
                                                const extraHrs = calculateHours(res, shifts, 'EXTRA_60');
                                                if (extraHrs) {
                                                    const [hh, mm] = extraHrs.split(':').map(Number);
                                                    const rate = hourlyRate * (1 + (prop.os_hext || 0)/100);
                                                    rows.push({ event: `H./${prop.os_hext}%`, hrs: extraHrs, rate: rate, total: rate * (hh + mm/60) });
                                                }
                                            }

                                            const nightHrs = calculateHours(res, shifts, 'NIGHT_20');
                                            if (nightHrs) {
                                                const [hh, mm] = nightHrs.split(':').map(Number);
                                                const rate = hourlyRate * ((prop.os_hnot || 0)/100); // Only the add-on
                                                rows.push({ event: `AD. NOT.`, hrs: nightHrs, rate: rate, total: rate * (hh + mm/60) });
                                            }

                                            return rows.map((r, rIdx) => (
                                                <tr key={`${res.id_matr}-${res.ap_data}-${idx}-${rIdx}`}>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900">{rIdx === 0 ? jsonDate(res.ap_data) : ''}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-500">{rIdx === 0 ? res.cb_tmdo : ''}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900">{rIdx === 0 ? res.fu_nome : ''}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-500">{rIdx === 0 ? res.fu_func : ''}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900">{r.event}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900 text-right">{r.hrs}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900 text-right">{brMoney(r.rate)}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900 text-right font-medium">{brMoney(r.total)}</td>
                                                </tr>
                                            ));
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
