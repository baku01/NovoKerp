import React, { useState, useMemo } from 'react';
import { useDailyReports } from './useDailyReports';
import { useAllWorksites } from '../evaluations/useEvaluations';
import { useProposals } from '../service-orders/useProposals'; // Reuse proposals hook
import { DailyReportPhotos } from './DailyReportPhotos';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subDays } from 'date-fns';
import { jsonDate } from '../../utils/formatters';
import { DailyReport } from './types';

export const DailyReportList: React.FC = () => {
    // Filters
    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedProposal, setSelectedProposal] = useState<string>('0');

    // Only fetch proposals if a worksite is selected
    const { proposals } = useProposals(parseInt(selectedWorksite) || 0);

    const filters = useMemo(() => ({
        startDate,
        endDate,
        worksiteId: parseInt(selectedWorksite) || null,
        proposalId: parseInt(selectedProposal) || null
    }), [startDate, endDate, selectedWorksite, selectedProposal]);

    const { reports, isLoading } = useDailyReports(filters);
    const { worksites } = useAllWorksites();

    // Selection for Photos
    const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold text-slate-800 mb-4">Relatórios Diários de Obra (RDO)</h1>
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
                            { value: '0', label: 'TODAS AS OBRAS' },
                            ...worksites.map(w => ({ value: w.id_clie, label: w.cl_fant }))
                        ]}
                        value={selectedWorksite}
                        onChange={(e) => {
                            setSelectedWorksite(e.target.value);
                            setSelectedProposal('0'); // Reset proposal when worksite changes
                        }}
                    />
                    <Select
                        label="Proposta (OS)"
                        options={[
                            { value: '0', label: 'TODAS' },
                            ...proposals.map(p => ({ value: p.id_ords, label: `${p.os_nume} - ${p.os_desc}` }))
                        ]}
                        value={selectedProposal}
                        onChange={(e) => setSelectedProposal(e.target.value)}
                        disabled={selectedWorksite === '0'}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 flex-1">
                {/* List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">
                        Relatórios Encontrados ({reports.length})
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-400">Carregando...</div>
                        ) : reports.length === 0 ? (
                            <div className="p-4 text-center text-slate-400">Nenhum RDO encontrado.</div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {reports.map((rdo, idx) => (
                                    <li 
                                        key={`${rdo.id_clie}-${rdo.ro_data}-${idx}`}
                                        onClick={() => setSelectedReport(rdo)}
                                        className={`
                                            p-4 cursor-pointer hover:bg-blue-50 transition-colors
                                            ${selectedReport === rdo ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-800">{jsonDate(rdo.ro_data)}</span>
                                            <span className="text-xs text-slate-400">#{rdo.id_clie}</span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-700 mb-1">{rdo.cl_fant}</div>
                                        <div className="text-xs text-slate-500 truncate">
                                            Proposta(s): {rdo.ro_nume}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Photos / Detail */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    {selectedReport ? (
                        <DailyReportPhotos report={selectedReport} onClose={() => setSelectedReport(null)} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center">
                            Selecione um relatório ao lado para visualizar ou gerenciar fotos.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
