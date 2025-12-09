import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CircularGauge } from '../../components/ui/CircularGauge'; // Assuming this exists
import { brDecimal, jsonDate } from '../../utils/formatters';
import { format } from 'date-fns';

export const CompanyTable: React.FC = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>(new Date());
    const [hoursType, setHoursType] = useState<'oc_qthr' | 'os_phcn'>('oc_qthr'); // 'oc_qthr' for Orçadas, 'os_phcn' for Planejadas
    
    const { obras, isLoading, aggregatedData } = useDashboardData(date);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setDate(new Date(y, m - 1, d));
        }
    };

    const totalHoursBase = useMemo(() => {
        return hoursType === 'oc_qthr' ? aggregatedData.totalHorasOrcadas : aggregatedData.totalHorasPlanejadas;
    }, [hoursType, aggregatedData]);

    const getGaugeColor = (percentage: number): 'green' | 'yellow' | 'orange' | 'red' => {
        if (percentage <= 70) return 'green';
        if (percentage <= 90) return 'yellow';
        if (percentage <= 100) return 'orange';
        return 'red';
    };


    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto">
            {/* Header & Controls */}
            <div className="panel p-5">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800">Tabela de Obras</h1>
                    <Input
                        type="date"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                        className="max-w-xs"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Select
                        label="Base Horas"
                        options={[
                            { value: 'oc_qthr', label: 'Horas Orçadas' },
                            { value: 'os_phcn', label: 'Horas Planejadas' },
                        ]}
                        value={hoursType}
                        onChange={(e) => setHoursType(e.target.value as 'oc_qthr' | 'os_phcn')}
                        className="max-w-xs"
                    />
                </div>
            </div>

            {/* Aggregated Totals & Gauges */}
            <div className="panel p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <CircularGauge
                        value={aggregatedData.percHorasTotaisConsumidas / 100}
                        label="Horas Consumidas"
                        color={getGaugeColor(aggregatedData.percHorasTotaisConsumidas)}
                        size={120}
                    />
                    <CircularGauge
                        value={aggregatedData.percHorasTrabalhadas / 100}
                        label="Horas Trabalhadas"
                        color={getGaugeColor(aggregatedData.percHorasTrabalhadas)}
                        size={80}
                    />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="col-span-2">
                        <h2 className="font-semibold text-slate-700 mb-2">Totais Consolidados</h2>
                    </div>
                    
                    <div className="text-slate-600">Total Horas Base ({hoursType === 'oc_qthr' ? 'Orçadas' : 'Planejadas'}):</div>
                    <div className="text-right font-medium">{totalHoursBase}</div>

                    <div className="text-slate-600">Apt. Divergentes:</div>
                    <div className="text-right font-medium text-red-600">{aggregatedData.totalAptDivergentes}</div>

                    <div className="text-slate-600">Apt. Pendentes:</div>
                    <div className="text-right font-medium text-yellow-600">{aggregatedData.totalAptPendentes} / {aggregatedData.totalAptTotal}</div>
                    
                    <div className="text-slate-600">RDO Pendente:</div>
                    <div className="text-right font-medium">{aggregatedData.totalRdoPendente} / {aggregatedData.totalRdoTotal}</div>

                    <div className="text-slate-600">Modificações:</div>
                    <div className="text-right font-medium">{aggregatedData.totalModificacoes}</div>

                    <div className="text-slate-600">Mod. Atualização:</div>
                    <div className="text-right font-medium">{aggregatedData.totalModAtualizacao}</div>
                </div>
            </div>


            {/* Worksites Table */}
            <div className="panel p-5 overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-8 text-slate-500">Carregando...</div>
                ) : obras.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">Nenhuma obra encontrada.</div>
                ) : (
                    <table className="min-w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-100 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">Obra</th>
                                <th className="px-4 py-3 text-center">Progresso</th>
                                <th className="px-4 py-3 text-center">Plan.</th>
                                <th className="px-4 py-3 text-center">Desvio</th>
                                <th className="px-4 py-3 text-center">Horas (Real/Orc)</th>
                                <th className="px-4 py-3 text-center">Prev. Término</th>
                                <th className="px-4 py-3 rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {obras.map((obra) => {
                                const deviation = obra.cl_pavc - obra.cl_papl;
                                return (
                                    <tr 
                                        key={obra.id_cadt} 
                                        onClick={() => navigate(`/propostas?idClie=${obra.id_clie}&clientName=${encodeURIComponent(obra.cl_fant)}`)}
                                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-800">{obra.cl_fant}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold ${obra.cl_pavc >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
                                                {brDecimal(obra.cl_pavc)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">{brDecimal(obra.cl_papl)}%</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={deviation >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                {brDecimal(deviation)}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {obra.re_hrap} / {obra.oc_qthr}
                                        </td>
                                        <td className="px-4 py-3 text-center">{jsonDate(obra.cl_dtpt)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {obra.cl_pavc >= 100 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Concluído
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Em Andamento
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
