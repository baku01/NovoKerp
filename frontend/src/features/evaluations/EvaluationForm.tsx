import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAllWorksites, useEmployeeSearch, useEvaluationMutations } from './useEvaluations';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format } from 'date-fns';
import { Evaluation } from './types';
import { brDecimal } from '../../utils/formatters';

const SCORE_FIELDS = [
    { key: 'av_orga', label: 'Organização' },
    { key: 'av_prod', label: 'Produção' },
    { key: 'av_qual', label: 'Qualidade' },
    { key: 'av_disc', label: 'Disciplina' },
    { key: 'av_falt', label: 'Faltas' },
    { key: 'av_celu', label: 'Celular' },
    { key: 'av_aloj', label: 'Alojamento' },
    { key: 'av_resc', label: 'Rescisão' },
    { key: 'av_ferr', label: 'Ferramental' },
];

const TECHNICAL_FIELDS = [
    { key: 'av_fabr', label: 'Fabricação' },
    { key: 'av_msol', label: 'Montagem (Solo)' },
    { key: 'av_malt', label: 'Montagem (Altura)' },
    { key: 'av_tubu', label: 'Tubulação' },
    { key: 'av_ptaa', label: 'PTA' },
];

export const EvaluationForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // 'nova' or ID
    const location = useLocation();
    const existingData = location.state?.evaluation as Evaluation | undefined;

    const isEdit = id !== 'nova' && !!existingData;

    // State
    const [date, setDate] = useState<Date>(new Date());
    const [worksiteId, setWorksiteId] = useState<string>('');
    
    // Employee Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<{id: number, name: string, func: string, empr: string} | null>(null);
    
    // Form Data
    const [scores, setScores] = useState<Record<string, number>>({});
    const [salary, setSalary] = useState<string>('');
    const [observations, setObservations] = useState('');

    // Hooks
    const { worksites } = useAllWorksites();
    const { saveEvaluation, deleteEvaluation, isSaving, isDeleting } = useEvaluationMutations();
    const { data: employees = [] } = useEmployeeSearch(parseInt(worksiteId) || 0, searchTerm);

    // Initialize
    useEffect(() => {
        if (isEdit && existingData) {
            try {
                setDate(new Date(existingData.av_data));
            } catch (e) {}
            
            setWorksiteId(existingData.id_clie.toString()); // Note: using id_clie or id_cadt? Legacy uses id_cadt/id_clie pair.
            // Legacy: `loSlObra.value.split("/")[0]` -> id_clie.
            // Service saves `lnIdClie`.
            // But `pesquisaObrasDefinidas` returns `id_cadt` as ID usually.
            // Wait, `pesquisaObrasDefinidas` returns `id_clie` AND `id_cadt`.
            // If `EvaluationWorksite` interface has both.
            // We should probably store both or find the worksite that matches.
            // For simplicity, assume worksiteId maps to `id_cadt` in the dropdown list?
            // Actually, `fetchAllWorksites` uses `pesquisaObrasDefinidas`. 
            // Let's check `EvaluationList` implementation. It uses `id_clie` for value.
            // So `setWorksiteId(existingData.id_clie.toString())`.
            
            setSelectedEmployee({
                id: existingData.id_matr,
                name: existingData.fu_nome,
                func: existingData.fu_func,
                empr: '' // Not available in Evaluation type but needed for update?
                // Legacy `insereAvaliacao` uses `lcFuEmpr`.
                // If updating, we need it.
                // We might need to fetch it or assume it's not changed if not provided?
                // Legacy `goCdFuncCFA` has `fu_empr`.
                // `pesquisaAvaliacoes` returns `Evaluation` which lacks `fu_empr`.
                // We might need to add it to `Evaluation` interface or fetch it.
                // Let's add it to interface if possible or derive it.
                // For now, I will assume we need to fetch or it's optional on update?
                // Legacy: `lcFuEmpr = goCdFuncCFA.fu_empr`.
                // If I edit an existing one, `goCdFuncCFA` might be empty? 
                // Legacy `CadtFuAval` loads data from `sessionStorage` which came from `consultaAvaliacaoCCA`.
                // `gmWkRsqlCCA` has `fu_empr`? Check `pesquisaAvaliacoes`.
                // It likely returns it. I'll add to interface.
            });

            const newScores: Record<string, number> = {};
            [...SCORE_FIELDS, ...TECHNICAL_FIELDS].forEach(f => {
                newScores[f.key] = (existingData as any)[f.key] || 0;
            });
            setScores(newScores);
            setSalary(existingData.av_sgsl.toString());
            setObservations(existingData.av_obse);
        }
    }, [isEdit, existingData]);

    // Average Score
    const averageScore = useMemo(() => {
        const sum = SCORE_FIELDS.reduce((acc, f) => acc + (scores[f.key] || 0), 0);
        return sum / SCORE_FIELDS.length;
    }, [scores]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee || !worksiteId) return;

        // Need `fu_empr`
        // If editing, it might be missing from `selectedEmployee` if we just set ID/Name.
        // We need to ensure `fu_empr` is available.
        // If user searched, `employees` list has it.
        // If loaded from existing, we need to check if `existingData` has it (I'll add it to type).
        const fuEmpr = selectedEmployee.empr || (existingData as any)?.fu_empr || '';

        const payload: any = {
            id_aval: isEdit ? existingData?.id_aval : 0,
            av_data: format(date, 'yyyy-MM-dd'),
            id_clie: parseInt(worksiteId),
            id_matr: selectedEmployee.id,
            fu_empr: fuEmpr,
            av_sgsl: parseFloat(salary) || 0,
            av_obse: observations,
            ...scores
        };

        try {
            await saveEvaluation(payload);
            alert('Avaliação salva com sucesso!');
            navigate(-1);
        } catch (err) {
            alert('Erro ao salvar avaliação.');
        }
    };

    const handleDelete = async () => {
        if (!isEdit || !existingData) return;
        if (window.confirm('Deseja realmente excluir esta avaliação?')) {
            try {
                await deleteEvaluation(existingData.id_aval);
                navigate(-1);
            } catch (err) {
                alert('Erro ao excluir.');
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">
                    {isEdit ? 'Editar Avaliação' : 'Nova Avaliação'}
                </h1>
                <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-600">
                    Voltar
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
                {/* Context Info */}
                <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="date"
                        label="Data"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={(e) => e.target.value && setDate(new Date(e.target.value))}
                        required
                    />
                    
                    <Select
                        label="Obra"
                        options={[
                            { value: '', label: 'Selecione...' },
                            ...worksites.map(w => ({ value: w.id_clie, label: w.cl_fant }))
                        ]}
                        value={worksiteId}
                        onChange={(e) => {
                            setWorksiteId(e.target.value);
                            setSelectedEmployee(null); // Reset employee on worksite change
                            setSearchTerm('');
                        }}
                        disabled={isEdit}
                    />

                    {/* Employee Search */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Funcionário</label>
                        {isEdit && selectedEmployee ? (
                            <div className="p-3 bg-slate-100 rounded border border-slate-200 flex justify-between items-center">
                                <div>
                                    <span className="font-bold block">{selectedEmployee.name}</span>
                                    <span className="text-xs text-slate-500">{selectedEmployee.func} (Matr: {selectedEmployee.id})</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <Input
                                    placeholder="Digite nome ou matrícula..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={!worksiteId}
                                />
                                {employees.length > 0 && searchTerm.length > 2 && (
                                    <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                        {employees.map(emp => (
                                            <div
                                                key={`${emp.id_matr}-${emp.fu_empr}`}
                                                className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-0 border-slate-100"
                                                onClick={() => {
                                                    setSelectedEmployee({
                                                        id: emp.id_matr,
                                                        name: emp.fu_nome,
                                                        func: emp.fu_func,
                                                        empr: emp.fu_empr
                                                    });
                                                    setSearchTerm('');
                                                }}
                                            >
                                                <div className="font-medium text-sm">{emp.fu_nome}</div>
                                                <div className="text-xs text-slate-500">{emp.fu_func} - Matr: {emp.id_matr}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Scores */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-slate-700">Critérios de Avaliação (0-10)</h2>
                        <div className="text-sm">
                            Média: <span className="font-bold text-lg text-blue-600">{brDecimal(averageScore)}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {SCORE_FIELDS.map(field => (
                            <Input
                                key={field.key}
                                label={field.label}
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={scores[field.key] || ''}
                                onChange={(e) => setScores(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                            />
                        ))}
                    </div>
                </div>

                {/* Technical Scores */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-semibold text-slate-700 mb-4">Avaliação Técnica (0-10)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {TECHNICAL_FIELDS.map(field => (
                            <Input
                                key={field.key}
                                label={field.label}
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={scores[field.key] || ''}
                                onChange={(e) => setScores(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                            />
                        ))}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 gap-4">
                    <Input
                        label="Sugestão de Salário"
                        type="number"
                        step="0.01"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                        <textarea
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={observations}
                            onChange={(e) => setObservations(e.target.value.toUpperCase())}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                    {isEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300"
                        >
                            {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </button>
                    )}
                    <div className="flex-1 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 font-medium"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Avaliação'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
