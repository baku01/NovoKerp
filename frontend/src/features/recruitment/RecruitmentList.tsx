import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecruitment } from './useRecruitment';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { formatCpf, brMoney, jsonDate, brDecimal } from '../../utils/formatters';
import { DismissedEmployee } from './types';

export const RecruitmentList: React.FC = () => {
    const navigate = useNavigate();
    
    const [searchType, setSearchType] = useState<'NOME' | 'ID_MATR'>('NOME');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFunctions, setSelectedFunctions] = useState<(string | number)[]>([]);

    // Debounce search term for query? Or just pass it. 
    // React Query handles caching, but rapid typing might spam.
    // Legacy requires button press or enter usually? Legacy uses `OkTecladoAndroid` which implies enter key or loose focus.
    // I'll pass it directly but user might want a "Search" button.
    // For now, live filtering if performance allows, or use a manual trigger.
    // Given legacy behavior (often explicit), I'll add a "Search" button paradigm or just simple state.
    // I'll use a temporary state for input and commit on blur/enter? 
    // Let's stick to simple state for now.

    const { functions, employees, isLoading, isFetchingEmployees } = useRecruitment({
        functions: selectedFunctions.map(String),
        searchType,
        searchTerm // Note: This will trigger fetch on every keystroke if not debounced. 
                   // Ideally we should debounce or use a "trigger" state.
    });

    const navigateToEvaluations = (employee: DismissedEmployee) => {
        // Redirect to Evaluation List filtered by this employee
        // Need to ensure EvaluationList supports employeeId filter
        // For now, navigate to /avaliacoes with state
        navigate('/avaliacoes', { 
            state: { 
                employeeId: employee.id_matr,
                employeeName: employee.fu_nome
            } 
        });
    };

    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="panel p-5">
                <h1 className="text-xl font-bold text-slate-800 mb-4">Histórico de Funcionários (Demitidos)</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex space-x-2 md:col-span-2">
                        <Select
                            className="w-32"
                            options={[
                                { value: 'NOME', label: 'Nome' },
                                { value: 'ID_MATR', label: 'Matrícula' }
                            ]}
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as 'NOME' | 'ID_MATR')}
                        />
                        <Input
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <MultiSelect
                        label="Funções"
                        options={functions.map(f => ({ value: f.fu_func, label: f.fu_func }))}
                        value={selectedFunctions}
                        onChange={setSelectedFunctions}
                        placeholder="Filtrar por função..."
                    />
                </div>
            </div>

            {/* Results */}
            <div className="space-y-2">
                {isLoading || isFetchingEmployees ? (
                    <div className="text-center py-8 text-slate-500">Carregando...</div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">Nenhum registro encontrado.</div>
                ) : (
                    employees.map(emp => (
                        <EmployeeCard 
                            key={`${emp.id_matr}-${emp.fu_nome}`} 
                            employee={emp} 
                            onEvaluationClick={() => navigateToEvaluations(emp)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const EmployeeCard: React.FC<{ employee: DismissedEmployee, onEvaluationClick: () => void }> = ({ employee, onEvaluationClick }) => {
    const hasNote = employee.fu_nota >= 0;
    const noteColor = hasNote ? 'text-blue-600' : 'text-slate-400';

    return (
        <details className="bg-white rounded-lg shadow group overflow-hidden border border-slate-200">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 list-none">
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{employee.fu_nome}</span>
                    <span className="text-xs text-slate-500">{employee.fu_func} - {employee.em_fant}</span>
                </div>
                <div className="flex items-center space-x-4">
                    {hasNote && (
                        <div 
                            onClick={(e) => {
                                e.preventDefault(); // Prevent toggle
                                onEvaluationClick();
                            }}
                            className="flex items-center bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                            title="Ver Avaliações"
                        >
                            <span className="text-xs text-slate-500 mr-1">Nota:</span>
                            <span className={`font-bold ${noteColor}`}>{brDecimal(employee.fu_nota)}</span>
                        </div>
                    )}
                    <span className="transform transition-transform group-open:rotate-180 text-slate-400">▼</span>
                </div>
            </summary>
            <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50 text-sm text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                 <DetailRow label="Matrícula" value={employee.id_matr} />
                 <DetailRow label="Tipo" value={employee.cb_tmdo} />
                 <DetailRow label="CPF" value={formatCpf(employee.fu_ncpf)} />
                 <DetailRow label="RG" value={employee.fu_rgnu} />
                 <DetailRow label="Admissão" value={jsonDate(employee.fu_dtad)} />
                 <DetailRow label="Rescisão" value={jsonDate(employee.fu_drec)} />
                 <DetailRow label="Recontratado" value={employee.fu_reco > 1 ? 'SIM' : 'NÃO'} />
                 <DetailRow label="Última Obra" value={employee.ul_obra} />
                 <DetailRow label="Status" value={employee.sr_deno} />
                 <DetailRow label="Salário" value={brMoney(employee.ff_sala)} />
                 <DetailRow label="Cidade" value={`${employee.fu_cida} - ${employee.fu_esta}`} />
                 <DetailRow label="Celular" value={employee.fu_celu} />
            </div>
        </details>
    );
};

const DetailRow: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-slate-200 py-1 last:border-0">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="text-slate-800 text-right">{value || '-'}</span>
    </div>
);
