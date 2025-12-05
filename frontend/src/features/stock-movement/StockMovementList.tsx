import React, { useState, useMemo } from 'react';
import { useStockMovementList } from './useStockMovement';
import { useAllWorksites } from '../evaluations/useEvaluations';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subDays } from 'date-fns';
import { jsonDate, brDecimal, brMoney } from '../../utils/formatters';

export const StockMovementList: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [type, setType] = useState<'T' | 'E' | 'S'>('T');
    const [searchType, setSearchType] = useState<'F' | 'P'>('F');

    const { worksites } = useAllWorksites();

    const filters = useMemo(() => ({
        startDate,
        endDate,
        worksiteId: parseInt(selectedWorksite) || null,
        type,
        searchType,
    }), [startDate, endDate, selectedWorksite, type, searchType]);

    const { movements, isLoading } = useStockMovementList(filters);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold text-slate-800 mb-4">Movimentação de Estoque</h1>
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
                            { value: '0', label: 'SELECIONE UMA OBRA' },
                            ...worksites.map(w => ({ value: w.id_clie, label: w.cl_fant }))
                        ]}
                        value={selectedWorksite}
                        onChange={(e) => setSelectedWorksite(e.target.value)}
                    />
                    <Select
                        label="Tipo"
                        options={[
                            { value: 'T', label: 'TODOS' },
                            { value: 'E', label: 'ENTRADA / DEVOLUÇÃO' },
                            { value: 'S', label: 'SAÍDA / ENTREGA' },
                        ]}
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                    />
                    <Select
                        label="Pesquisar Por"
                        options={[
                            { value: 'F', label: 'FUNCIONÁRIO' },
                            { value: 'P', label: 'PROPOSTA' },
                        ]}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as any)}
                    />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-400">Carregando...</div>
                ) : movements.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">Nenhuma movimentação encontrada.</div>
                ) : (
                    <div className="space-y-4">
                        {movements.map((mov, idx) => {
                            const isEntry = mov.mv_tpme === 'E';
                            const colorClass = isEntry ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200';
                            const typeLabel = isEntry ? 'DEVOLUÇÃO' : 'SAÍDA';

                            return (
                                <details key={`${mov.mv_docu}-${idx}`} className={`border rounded-lg ${colorClass} group`}>
                                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <div className="font-bold text-slate-800">{mov.cl_fant}</div>
                                                <div className="text-xs text-slate-500">
                                                    Doc: {mov.mv_docu} • {jsonDate(mov.mv_data)} • {typeLabel}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 text-sm">
                                            <div className="text-right">
                                                <div className="font-medium">{brDecimal(mov.mv_qtde)} un</div>
                                                <div className="text-xs text-slate-500">{brMoney(mov.mv_tcus)}</div>
                                            </div>
                                            <span className="transform transition-transform group-open:rotate-180 text-slate-400">▼</span>
                                        </div>
                                    </summary>
                                    <div className="p-4 pt-0 border-t border-slate-200/50 text-sm grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                                        <DetailRow label="Responsável" value={mov.mv_user} />
                                        {mov.fu_nome && <DetailRow label="Funcionário" value={mov.fu_nome} />}
                                        {mov.os_nume && <DetailRow label="Proposta" value={`${mov.os_nume} - ${mov.os_desc}`} />}
                                        <div className="md:col-span-2 mt-2">
                                            <div className="font-semibold text-slate-700">Itens</div>
                                            <div className="bg-white p-2 rounded border border-slate-200 mt-1">
                                                <div className="flex justify-between text-xs font-medium text-slate-500 border-b pb-1 mb-1">
                                                    <span>Item</span>
                                                    <span>Qtd</span>
                                                </div>
                                                {/* API might return multiple rows for same doc, or one row per item. 
                                                    If one row per item, we should group them in the hook.
                                                    Currently rendering individually. */}
                                                <div className="flex justify-between">
                                                    <span>{mov.ce_deno} {mov.ce_espt}</span>
                                                    <span>{brDecimal(mov.mv_qtde)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {mov.mv_obse && (
                                            <div className="md:col-span-2 mt-2">
                                                <span className="font-medium text-slate-600">Observação:</span>
                                                <p className="text-slate-700">{mov.mv_obse}</p>
                                            </div>
                                        )}
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-slate-200/50 py-1 last:border-0">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="text-slate-800 text-right">{value || '-'}</span>
    </div>
);
