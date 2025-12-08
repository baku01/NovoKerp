import React, { useState, useMemo } from 'react';
import { useStockPosition, useWorksites, useServiceOrders, useEmployees } from './useStockPosition';
import { StockPosition, StockPositionFilters } from './types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { brDecimal, brMoney } from '../../utils/formatters';
import { format, subMonths } from 'date-fns';

export const StockPositionList: React.FC = () => {
    // State
    const [type, setType] = useState<'U' | 'A'>('A'); // Default to Position (A)
    const [date, setDate] = useState<Date>(new Date()); // For Position
    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1)); // For Usage
    const [endDate, setEndDate] = useState<Date>(new Date()); // For Usage

    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedOrder, setSelectedOrder] = useState<string>('0');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('0');

    // Derived Filters
    // Note: Legacy passes `id_clie` to procedures but select value uses `id_clie/id_cadt`.
    // Legacy `pesquisaObrasDefinidas` returns `id_clie` and `id_cadt`.
    // Legacy `CestPsEstq` uses `parseInt(loSlClie.value.split("/")[0])` for `lnIdClie` in `pesquisaPosicaoEstoqueConsumoCPE`.
    // `pesquisaPosicaoEstoque` takes `lnIdClie`.
    // So parse index 0.
    const realWorksiteId = parseInt(selectedWorksite.split('/')[0]) || 0;

    // Filters object for hooks
    const filters: StockPositionFilters = useMemo(() => ({
        type,
        date,
        startDate,
        endDate,
        worksiteId: realWorksiteId,
        serviceOrderId: parseInt(selectedOrder) || null,
        employeeId: parseInt(selectedEmployee.split('/')[1]) || null, // Employee val usually id_empr/id_matr
        employeeCompany: selectedEmployee.split('/')[0] === '0' ? null : selectedEmployee.split('/')[0]
    }), [type, date, startDate, endDate, realWorksiteId, selectedOrder, selectedEmployee]);

    // Data Hooks
    const { worksites, isLoading: loadingWorksites } = useWorksites({ type, date, startDate, endDate });
    const { data: stockData, isLoading: loadingData } = useStockPosition(filters);

    // Only fetch dependent dropdowns if worksite selected
    const { orders } = useServiceOrders(parseInt(selectedWorksite.split('/')[1]) || 0); // Orders usually need id_cadt
    const { employees } = useEmployees(parseInt(selectedWorksite.split('/')[1]) || 0, { type, date, startDate, endDate });

    // Legacy `pesquisaPropostas` takes `lnIdCadt` which is usually the second part of the worksite value.
    // Legacy `pesquisaFuncionarios` takes `lnIdCadt` (second part).

    // Handlers
    const handleTypeChange = (newType: 'U' | 'A') => {
        setType(newType);
        setSelectedOrder('0');
        setSelectedEmployee('0');
        // Reset worksite? Legacy `alteraTipoRelatorioCPE` triggers `pesquisaClientesCPE` which reloads worksites.
        // Hook will auto-reload worksites.
    };

    // Grouping Logic (Client-side grouping by `al_deno`)
    const groupedData = useMemo(() => {
        if (!stockData) return [];

        const groups: { [key: string]: { items: (StockPosition & { calcQty: number, calcCost: number })[], totalQty: number, totalCost: number } } = {};

        stockData.forEach(item => {
            const groupName = item.al_deno || 'OUTROS';
            if (!groups[groupName]) {
                groups[groupName] = { items: [], totalQty: 0, totalCost: 0 };
            }

            // Calculate Qty/Cost based on Type logic from legacy
            let qty = 0;
            let cost = 0;

            if (type === 'U') {
                qty = item.sa_qtde - item.en_qtde;
                const costDiff = item.sa_tcus - item.en_tcus;
                cost = costDiff > 0 ? costDiff : 0;
            } else {
                qty = item.en_qtde - item.sa_qtde;
                const costDiff = item.en_tcus - item.sa_tcus;
                cost = costDiff > 0 ? costDiff : 0;
            }

            groups[groupName].items.push({ ...item, calcQty: qty, calcCost: cost });
            groups[groupName].totalQty += qty;
            groups[groupName].totalCost += cost;
        });

        return Object.entries(groups).map(([name, data]) => ({ name, ...data }));
    }, [stockData, type]);

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <h1 className="text-xl font-bold text-slate-800">Relatório de Estoque</h1>

                <div className="flex space-x-4 mb-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={type === 'A'}
                            onChange={() => handleTypeChange('A')}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Posição Atual</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={type === 'U'}
                            onChange={() => handleTypeChange('U')}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Consumo</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {type === 'A' ? (
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

                    <Select
                        label="Obra"
                        options={[
                            { value: '0', label: loadingWorksites ? 'Carregando...' : 'Selecione...' },
                            ...worksites.map(w => ({ value: `${w.id_clie}/${w.id_cadt}`, label: w.cl_fant }))
                        ]}
                        value={selectedWorksite}
                        onChange={(e) => setSelectedWorksite(e.target.value)}
                    />

                    {type === 'U' && (
                        <>
                            <Select
                                label="Proposta"
                                options={[
                                    { value: '0', label: 'TODAS' },
                                    ...orders.map(o => ({ value: o.id_ords, label: `${o.os_nume} - ${o.os_desc}` }))
                                ]}
                                value={selectedOrder}
                                onChange={(e) => {
                                    setSelectedOrder(e.target.value);
                                    if(e.target.value !== '0') setSelectedEmployee('0');
                                }}
                                disabled={selectedEmployee !== '0'}
                            />
                            <Select
                                label="Funcionário"
                                options={[
                                    { value: '0', label: 'TODOS' },
                                    ...employees.map(e => ({ value: `${e.fu_empr}/${e.id_matr}`, label: e.fu_nome }))
                                ]}
                                value={selectedEmployee}
                                onChange={(e) => {
                                    setSelectedEmployee(e.target.value);
                                    if(e.target.value !== '0') setSelectedOrder('0');
                                }}
                                disabled={selectedOrder !== '0'}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex-1">
                {loadingData ? (
                    <div className="text-center py-8 text-slate-500">Carregando dados...</div>
                ) : groupedData.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">Nenhum registro encontrado.</div>
                ) : (
                    <div className="space-y-6">
                        {groupedData.map(group => (
                            <div key={group.name} className="border-b border-slate-200 pb-4 last:border-0">
                                <h3 className="font-bold text-lg text-orange-600 mb-2 px-2 bg-orange-50 rounded py-1">
                                    {group.name}
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-600 text-left">
                                                <th className="px-4 py-2 font-semibold">Item</th>
                                                <th className="px-4 py-2 font-semibold text-right">Quantidade</th>
                                                <th className="px-4 py-2 font-semibold text-right">Custo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2 border-t border-slate-100">
                                                        {item.ce_deno} {item.ce_espt}
                                                    </td>
                                                    <td className="px-4 py-2 text-right border-t border-slate-100 font-medium">
                                                        {brDecimal(item.calcQty)}
                                                    </td>
                                                    <td className="px-4 py-2 text-right border-t border-slate-100 text-slate-600">
                                                        {brMoney(item.calcCost)}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-blue-50 font-bold text-slate-800">
                                                <td className="px-4 py-2 text-right">TOTAL {group.name}</td>
                                                <td className="px-4 py-2 text-right text-blue-700">{brDecimal(group.totalQty)}</td>
                                                <td className="px-4 py-2 text-right text-blue-700">{brMoney(group.totalCost)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
