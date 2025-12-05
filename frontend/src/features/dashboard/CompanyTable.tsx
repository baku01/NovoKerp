import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { Input } from '../../components/ui/Input';
import { brDecimal, jsonDate } from '../../utils/formatters';

export const CompanyTable: React.FC = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>(new Date());
    const { obras, isLoading } = useDashboardData(date);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setDate(new Date(y, m - 1, d));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Tabela de Obras</h1>
                <Input
                    type="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="max-w-xs"
                />
            </div>

            <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
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
