import React, { useState, useMemo } from 'react';
import { useStockPosition } from './useStockPosition';
import { useAllWorksites } from '../evaluations/useEvaluations';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subMonths } from 'date-fns';
import { brDecimal, brMoney } from '../../utils/formatters';
import { StockItem } from './types';

export const StockPositionReport: React.FC = () => {
    // Mode: 'A' (Position) or 'U' (Consumption)
    const [mode, setMode] = useState<'POSITION' | 'CONSUMPTION'>('POSITION');
    
    const [date, setDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('0'); // "EMPR/ID"
    const [selectedOrder, setSelectedOrder] = useState<string>('0');

    const { worksites } = useAllWorksites();

    // Derived Filters
    const filters = useMemo(() => {
        let empId: number | null = null;
        let empCo: string | null = null;
        
        if (selectedEmployee !== '0') {
            const [co, id] = selectedEmployee.split('/');
            empId = parseInt(id);
            empCo = co;
        }

        return {
            mode,
            worksiteId: parseInt(selectedWorksite) || null,
            date,
            startDate,
            endDate,
            orderId: parseInt(selectedOrder) || null,
            employeeId: empId,
            employeeCompany: empCo
        };
    }, [mode, date, startDate, endDate, selectedWorksite, selectedEmployee, selectedOrder]);

    const { stockItems, employees, orders, isLoading } = useStockPosition(filters);

    // Group items for display
    // Legacy groups by `al_deno` (Category).
    const groupedItems = useMemo(() => {
        const groups: Record<string, { items: StockItem[], totalQty: number, totalCost: number }> = {};
        
        stockItems.forEach(item => {
            const cat = item.al_deno || 'OUTROS';
            if (!groups[cat]) {
                groups[cat] = { items: [], totalQty: 0, totalCost: 0 };
            }
            
            let qty = 0;
            let cost = 0;

            // Calculation Logic from Legacy `montaRelatorioEstoque`
            // if 'U' (Consumption): Qty = Out - In. Cost = Out - In.
            // if 'A' (Position): Qty = In - Out. Cost = In - Out.
            // Wait, legacy logic:
            // if 'U': lnPcQtde = sa_qtde - en_qtde.
            // if 'A': lnPcQtde = en_qtde - sa_qtde.
            
            // Note: `stockItems` from API usually come with `ce_tipo` matching the query mode?
            // Or we use the selected mode?
            // Legacy checks `gmWkRsqlCPE[i].ce_tipo`.
            // Let's assume the items have the type.
            
            // We need to inject `ce_tipo` if missing, or assume based on mode.
            // Legacy `pesquisaPosicaoEstoque` returns items. `pesquisaConsumoEstoque` returns items.
            // `ce_tipo` usually comes from DB.
            // If missing, we might need to infer.
            
            const type = item.ce_tipo || (mode === 'CONSUMPTION' ? 'U' : 'A');

            if (type === 'U') {
                qty = (item.sa_qtde || 0) - (item.en_qtde || 0);
                cost = (item.sa_tcus || 0) - (item.en_tcus || 0);
            } else {
                qty = (item.en_qtde || 0) - (item.sa_qtde || 0);
                cost = (item.en_tcus || 0) - (item.sa_tcus || 0);
            }
            
            // Sanity check for cost > 0? Legacy does `if (cost > 0)`. 
            // We accumulate raw values.
            
            groups[cat].items.push({ ...item, sa_qtde: qty, sa_tcus: cost }); // Reusing fields to store net result
            groups[cat].totalQty += qty;
            groups[cat].totalCost += cost;
        });
        
        return groups;
    }, [stockItems, mode]);

    const grandTotal = useMemo(() => {
        return Object.values(groupedItems).reduce((acc, g) => ({
            qty: acc.qty + g.totalQty,
            cost: acc.cost + g.totalCost
        }), { qty: 0, cost: 0 });
    }, [groupedItems]);

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800">Relatório de Estoque</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setMode('POSITION')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'POSITION' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                            Posição
                        </button>
                        <button
                            onClick={() => setMode('CONSUMPTION')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'CONSUMPTION' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                            Consumo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        label="Obra"
                        options={[
                            { value: '0', label: 'SELECIONE UMA OBRA' },
                            ...worksites.map(w => ({ value: w.id_clie, label: w.cl_fant }))
                        ]}
                        value={selectedWorksite}
                        onChange={(e) => setSelectedWorksite(e.target.value)}
                    />

                    {mode === 'POSITION' ? (
                        <Input
                            type="date"
                            label="Data"
                            value={format(date, 'yyyy-MM-dd')}
                            onChange={(e) => e.target.value && setDate(new Date(e.target.value))}
                        />
                    ) : (
                        <>
                            <Input
                                type="date"
                                label="Data Inicial"
                                value={format(startDate, 'yyyy-MM-dd')}
                                onChange={(e) => e.target.value && setStartDate(new Date(e.target.value))}
                            />
                            <Input
                                type="date"
                                label="Data Final"
                                value={format(endDate, 'yyyy-MM-dd')}
                                onChange={(e) => e.target.value && setEndDate(new Date(e.target.value))}
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Select
                        label="Funcionário"
                        options={[
                            { value: '0', label: 'TODOS OS FUNCIONÁRIOS' },
                            ...employees.map(e => ({ value: `${e.fu_empr}/${e.id_matr}`, label: e.fu_nome }))
                        ]}
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        disabled={!selectedWorksite || selectedWorksite === '0'}
                    />
                    
                    {mode === 'CONSUMPTION' && (
                        <Select
                            label="Proposta"
                            options={[
                                { value: '0', label: 'TODAS AS PROPOSTAS' },
                                ...orders.map(o => ({ value: o.id_ords, label: `${o.os_nume} - ${o.os_desc}` }))
                            ]}
                            value={selectedOrder}
                            onChange={(e) => setSelectedOrder(e.target.value)}
                            disabled={!selectedWorksite || selectedWorksite === '0'}
                        />
                    )}
                </div>
            </div>

            {/* Summary Card */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <span className="text-sm text-blue-600 font-semibold">Quantidade Total</span>
                    <div className="text-2xl font-bold text-slate-800">{brDecimal(grandTotal.qty)}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <span className="text-sm text-green-600 font-semibold">Custo Total</span>
                    <div className="text-2xl font-bold text-slate-800">{brMoney(grandTotal.cost)}</div>
                </div>
            </div>

            {/* Results */}
            <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="text-center py-8 text-slate-400">Carregando...</div>
                ) : Object.keys(groupedItems).length === 0 ? (
                    <div className="text-center py-8 text-slate-400">Nenhum item encontrado.</div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedItems).map(([category, group]) => (
                            <div key={category} className="border rounded-lg overflow-hidden">
                                <div className="bg-slate-100 p-3 font-bold text-slate-700 flex justify-between">
                                    <span>{category}</span>
                                    <div className="text-sm font-normal">
                                        <span className="mr-4">Qtd: {brDecimal(group.totalQty)}</span>
                                        <span>Custo: {brMoney(group.totalCost)}</span>
                                    </div>
                                </div>
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-slate-50 border-b">
                                        <tr>
                                            <th className="px-4 py-2">Item</th>
                                            <th className="px-4 py-2 text-right">Quantidade</th>
                                            <th className="px-4 py-2 text-right">Custo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.items.map((item, idx) => (
                                            <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                                <td className="px-4 py-2">{item.ce_deno} {item.ce_espt}</td>
                                                <td className="px-4 py-2 text-right font-medium">{brDecimal(item.sa_qtde)}</td>
                                                <td className="px-4 py-2 text-right text-slate-600">{brMoney(item.sa_tcus)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
