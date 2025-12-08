import React, { useState, useMemo } from 'react';
import { useDivergences } from './useDivergences';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subDays } from 'date-fns';
import { jsonDate } from '../../utils/formatters';

export const DivergenceReport: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 1));
    const [endDate, setEndDate] = useState<Date>(subDays(new Date(), 1));
    const [selectedWorksite, setSelectedWorksite] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('0');
    const [searchType, setSearchType] = useState<'NOME' | 'ID_MATR'>('NOME');
    const [searchTerm, setSearchTerm] = useState('');

    const filters = useMemo(() => ({
        startDate,
        endDate,
        worksiteId: parseInt(selectedWorksite) || null,
        statusId: parseInt(selectedStatus) || 0,
        employeeId: searchType === 'ID_MATR' ? parseInt(searchTerm) || null : null,
        employeeName: searchType === 'NOME' ? searchTerm : null
    }), [startDate, endDate, selectedWorksite, selectedStatus, searchType, searchTerm]);

    const { divergences, worksites, statuses, isLoading } = useDivergences(filters);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold text-slate-800 mb-4">Divergências de Apontamento</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        type="date"
                        label="Data Inicial"
                        value={format(startDate, 'yyyy-MM-dd')}
                        onChange={(e) => handleDateChange(e, setStartDate)}
                    />
                    <Input
                        type="date"
                        label="Data Final"
                        value={format(endDate, 'yyyy-MM-dd')}
                        onChange={(e) => handleDateChange(e, setEndDate)}
                    />
                    <Select
                        label="Obra"
                        options={[
                            { value: '', label: 'TODAS AS OBRAS' },
                            ...worksites.map(w => ({ value: w.id_clie, label: w.cl_fant }))
                        ]}
                        value={selectedWorksite}
                        onChange={(e) => setSelectedWorksite(e.target.value)}
                    />
                    <Select
                        label="Status"
                        options={[
                            { value: '0', label: 'TODOS OS STATUS' },
                            { value: '-1', label: 'SEM APONTAMENTO APP' },
                            ...statuses.map(s => ({ value: s.id_strc, label: s.sr_deno }))
                        ]}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                </div>
                
                <div className="mt-4 flex space-x-4">
                    <Select
                        className="w-32"
                        options={[{ value: 'NOME', label: 'Nome' }, { value: 'ID_MATR', label: 'Matrícula' }]}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as 'NOME' | 'ID_MATR')}
                    />
                    <Input
                        placeholder="Pesquisar funcionário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-400">Carregando...</div>
                ) : divergences.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">Nenhuma divergência encontrada.</div>
                ) : (
                    <table className="min-w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-100 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3">Obra</th>
                                <th className="px-4 py-3">Funcionário</th>
                                <th className="px-4 py-3 text-center">App (min)</th>
                                <th className="px-4 py-3 text-center">Facial (min)</th>
                                <th className="px-4 py-3 text-center">Diferença</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {divergences.map((div, idx) => {
                                const diff = Math.abs(div.ap_mnap - div.ap_mnse);
                                return (
                                    <tr key={`${div.id_matr}-${div.ap_data}-${idx}`} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 whitespace-nowrap">{jsonDate(div.ap_data)}</td>
                                        <td className="px-4 py-3">{div.cl_fant}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {div.fu_nome}
                                            <span className="block text-xs text-slate-400">{div.id_matr}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">{div.ap_mnap}</td>
                                        <td className="px-4 py-3 text-center">{div.ap_mnse}</td>
                                        <td className="px-4 py-3 text-center font-bold text-red-500">{diff}</td>
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
