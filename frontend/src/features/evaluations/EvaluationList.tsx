import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEvaluations, useEvaluationWorksites } from './useEvaluations';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subMonths } from 'date-fns';
import { jsonDate, brDecimal } from '../../utils/formatters';

export const EvaluationList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as {
        employeeId?: number,
        employeeName?: string,
        employeeFunc?: string, // If passed
        employeeMatr?: number // If passed
    } | undefined;

    // Filter State
    // If coming from Employee History, default dates to null/empty to show all history?
    // Legacy `CadtCnAval` sends null dates.
    const [startDate, setStartDate] = useState<Date | null>(state?.employeeName ? null : subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date | null>(state?.employeeName ? null : new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [employeeName, setEmployeeName] = useState<string>(state?.employeeName || '');
    
    // Derived Filters
    const filters = useMemo(() => ({
        startDate,
        endDate,
        worksiteId: parseInt(selectedWorksite) || null,
        employeeId: state?.employeeId || null,
        employeeName: employeeName || null
    }), [startDate, endDate, selectedWorksite, employeeName, state?.employeeId]);

    const { evaluations, isLoading } = useEvaluations(filters);
    // Worksites for filter dropdown - might strictly need date range? Legacy `pesquisaObrasAvaliadas` uses dates.
    // If dates are null, it might return all?
    const { worksites } = useEvaluationWorksites(startDate || undefined, endDate || undefined);

    // Reset filters when state changes (e.g. navigation)
    useEffect(() => {
        if (state?.employeeName) {
            setEmployeeName(state.employeeName);
            setStartDate(null);
            setEndDate(null);
            setSelectedWorksite('0');
        }
    }, [state]);

    // Handlers
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date | null) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        } else {
            setter(null);
        }
    };

    const clearEmployeeFilter = () => {
        setEmployeeName('');
        // Clear history state and reset dates to default
        navigate(location.pathname, { replace: true, state: {} });
        setStartDate(subMonths(new Date(), 1));
        setEndDate(new Date());
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header & Actions */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800">Avaliações de Desempenho</h1>
                    {state?.employeeName && (
                        <div className="text-sm text-slate-600 mt-1">
                            Histórico de: <span className="font-bold text-blue-800">{state.employeeName}</span>
                            {state.employeeFunc && ` - ${state.employeeFunc}`}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => navigate('/avaliacoes/nova')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    + Nova Avaliação
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input
                    type="date"
                    label="Data Inicial"
                    value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => handleDateChange(e, setStartDate)}
                />
                <Input
                    type="date"
                    label="Data Final"
                    value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => handleDateChange(e, setEndDate)}
                />
                <Select
                    label="Obra"
                    options={[
                        { value: 0, label: 'TODAS AS OBRAS' },
                        ...worksites.map(w => ({ value: w.id_cadt, label: w.cl_fant }))
                    ]}
                    value={selectedWorksite}
                    onChange={(e) => setSelectedWorksite(e.target.value)}
                />

                {/* Employee Filter Indicator */}
                {employeeName && (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-slate-700 mb-1">Filtro Ativo</label>
                        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                             <div className="flex flex-col overflow-hidden">
                                <span className="text-xs text-blue-600 uppercase font-bold">Funcionário</span>
                                <span className="text-sm font-semibold text-blue-800 truncate" title={employeeName}>{employeeName}</span>
                             </div>
                             <button
                                onClick={clearEmployeeFilter}
                                className="ml-2 text-blue-400 hover:text-blue-600 font-bold px-2"
                                title="Limpar filtro"
                             >
                                ✕
                             </button>
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="bg-white p-4 rounded-lg shadow">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-400">Carregando avaliações...</div>
                ) : evaluations.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">Nenhuma avaliação encontrada.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-slate-600">
                            <thead className="bg-slate-100 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Data</th>
                                    <th className="px-4 py-3">Funcionário</th>
                                    <th className="px-4 py-3">Função</th>
                                    <th className="px-4 py-3">Obra</th>
                                    <th className="px-4 py-3 text-center">Nota</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {evaluations.map((ev) => {
                                    const avgScore = (
                                        ev.av_orga + ev.av_prod + ev.av_qual + 
                                        ev.av_disc + ev.av_falt + ev.av_celu + 
                                        ev.av_aloj + ev.av_resc + ev.av_ferr
                                    ) / 9;

                                    return (
                                        <tr key={ev.id_aval} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">{jsonDate(ev.av_data)}</td>
                                            <td className="px-4 py-3 font-medium text-slate-800">{ev.fu_nome}</td>
                                            <td className="px-4 py-3">{ev.fu_func}</td>
                                            <td className="px-4 py-3">{ev.cl_fant}</td>
                                            <td className="px-4 py-3 text-center font-bold text-blue-600">
                                                {brDecimal(avgScore)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => navigate(`/avaliacoes/${ev.id_aval}`, { state: { evaluation: ev } })}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                                                >
                                                    Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
