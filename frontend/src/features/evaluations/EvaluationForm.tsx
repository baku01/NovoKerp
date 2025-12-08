import React, { useState, useMemo } from 'react';
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
    const [date, setDate] = useState<Date>(() => {
        if (isEdit && existingData) {
            try { return new Date(existingData.av_data); } catch { return new Date(); }
        }
        return new Date();
    });

    const [worksiteId, setWorksiteId] = useState<string>(
        isEdit && existingData ? existingData.id_clie.toString() : ''
    );
    
    // Employee Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<{id: number, name: string, func: string, empr: string} | null>(
        isEdit && existingData ? {
            id: existingData.id_matr,
            name: existingData.fu_nome,
            func: existingData.fu_func,
            empr: existingData.fu_empr || ''
        } : null
    );
    
    // Form Data
    const [scores, setScores] = useState<Record<string, number>>(() => {
        const newScores: Record<string, number> = {};
        if (isEdit && existingData) {
            [...SCORE_FIELDS, ...TECHNICAL_FIELDS].forEach(f => {
                const val = existingData[f.key];
                newScores[f.key] = typeof val === 'number' ? val : 0;
            });
        }
        return newScores;
    });

    const [salary, setSalary] = useState<string>(
        isEdit && existingData ? existingData.av_sgsl.toString() : ''
    );
    const [observations, setObservations] = useState(
        isEdit && existingData ? existingData.av_obse : ''
    );

    // Hooks
    const { worksites } = useAllWorksites();
    const { saveEvaluation, deleteEvaluation, isSaving, isDeleting } = useEvaluationMutations();
    const { data: employees = [] } = useEmployeeSearch(parseInt(worksiteId) || 0, searchTerm);

    // Average Score
    const averageScore = useMemo(() => {
        const sum = SCORE_FIELDS.reduce((acc, f) => acc + (scores[f.key] || 0), 0);
        return sum / SCORE_FIELDS.length;
    }, [scores]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee || !worksiteId) return;

        const fuEmpr = selectedEmployee.empr || existingData?.fu_empr || '';

        const payload = {
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
            console.error(err);
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
                console.error(err);
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
