import React, { useState, useMemo } from 'react';
import { usePurchasing, usePurchaseOrderItems, usePurchasingMutations } from './usePurchasing';
import { useAllWorksites } from '../evaluations/useEvaluations';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subDays } from 'date-fns';
import { jsonDate, brDecimal, brMoney } from '../../utils/formatters';
import { PurchaseOrder } from './types';

export const PurchasingList: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [dateType, setDateType] = useState<'PC_DATA' | 'PC_DTEN'>('PC_DATA');
    const [status, setStatus] = useState<string>('0'); // 0=Pend, 1=Aprv, 2=Disap
    const [worksite, setWorksite] = useState<string>('0');
    const [desc, setDesc] = useState('');

    const { worksites } = useAllWorksites();
    const { approve, disapprove, isApproving, isDisapproving } = usePurchasingMutations();

    const filters = useMemo(() => ({
        startDate,
        endDate,
        paramType: dateType,
        status: parseInt(status),
        worksiteId: parseInt(worksite) || null,
        description: desc
    }), [startDate, endDate, dateType, status, worksite, desc]);

    const { orders, isLoading } = usePurchasing(filters);

    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

    const handleCheck = (id: number) => {
        setCheckedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleApprove = async () => {
        if (checkedIds.size === 0) return;
        if (confirm(`Aprovar ${checkedIds.size} pedidos?`)) {
            await approve(Array.from(checkedIds));
            setCheckedIds(new Set());
        }
    };

    const handleDisapprove = async () => {
        if (checkedIds.size === 0) return;
        if (confirm(`Desaprovar ${checkedIds.size} pedidos?`)) {
            await disapprove(Array.from(checkedIds));
            setCheckedIds(new Set());
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800">Pedidos de Compra</h1>
                    <div className="space-x-2">
                        <button 
                            onClick={handleApprove}
                            disabled={isApproving || checkedIds.size === 0}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Aprovar
                        </button>
                        <button 
                            onClick={handleDisapprove}
                            disabled={isDisapproving || checkedIds.size === 0}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Desaprovar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input type="date" label="Início" value={format(startDate, 'yyyy-MM-dd')} onChange={e => e.target.value && setStartDate(new Date(e.target.value))} />
                    <Input type="date" label="Fim" value={format(endDate, 'yyyy-MM-dd')} onChange={e => e.target.value && setEndDate(new Date(e.target.value))} />
                    <Select label="Filtrar Data Por" options={[{value: 'PC_DATA', label: 'Lançamento'}, {value: 'PC_DTEN', label: 'Entrega'}]} value={dateType} onChange={e => setDateType(e.target.value as any)} />
                    <Select label="Status" options={[{value: '0', label: 'Pendentes'}, {value: '1', label: 'Aprovados'}, {value: '2', label: 'Desaprovados'}, {value: '3', label: 'Todos'}]} value={status} onChange={e => setStatus(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Select label="Obra" options={[{value: '0', label: 'TODAS'}, ...worksites.map(w => ({value: w.id_cadt, label: w.cl_fant}))]} value={worksite} onChange={e => setWorksite(e.target.value)} />
                    <Input label="Descrição Item" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Filtrar por item..." />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 flex-1">
                <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">Pedidos</div>
                    <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-400">Carregando...</div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {orders.map(order => (
                                    <li key={order.id_pcom} className={`p-4 hover:bg-blue-50 transition-colors ${selectedOrder?.id_pcom === order.id_pcom ? 'bg-blue-50' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <input 
                                                type="checkbox" 
                                                className="mt-1"
                                                checked={checkedIds.has(order.id_pcom)}
                                                onChange={() => handleCheck(order.id_pcom)}
                                            />
                                            <div className="flex-1 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-slate-800">{order.ca_nome}</span>
                                                    <span className="text-xs text-slate-500">{jsonDate(order.pc_data)}</span>
                                                </div>
                                                <div className="text-sm text-slate-600">PC: {order.pc_nume}</div>
                                                <div className="flex justify-between text-xs mt-1">
                                                    <span className="font-medium text-slate-700">{brDecimal(order.pc_qtde)} un</span>
                                                    <span className="font-medium text-green-600">{brMoney(order.pc_tota)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    {selectedOrder ? (
                        <PurchaseOrderDetails order={selectedOrder} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">Selecione um pedido</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PurchaseOrderDetails: React.FC<{ order: PurchaseOrder }> = ({ order }) => {
    const { items, isLoading } = usePurchaseOrderItems(order.id_pcom);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="font-bold text-lg text-slate-800">{order.ca_nome}</h2>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                        <span className="text-slate-500 block">Solicitante</span>
                        <span className="font-medium">{order.pc_user}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block">Entrega</span>
                        <span className="font-medium">{jsonDate(order.pc_dten)}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-slate-500 block">Observação</span>
                        <p className="bg-white p-2 rounded border border-slate-200 mt-1">{order.pc_obse}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="font-semibold text-slate-700 mb-2">Itens</h3>
                {isLoading ? (
                    <div className="text-center py-4 text-slate-400">Carregando itens...</div>
                ) : (
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Un</th>
                                <th className="px-4 py-2 text-right">Qtd</th>
                                <th className="px-4 py-2 text-right">V. Unit</th>
                                <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                    <td className="px-4 py-2">
                                        <div className="font-medium">{item.ce_deno}</div>
                                        <div className="text-xs text-slate-500">{item.ce_codi}</div>
                                    </td>
                                    <td className="px-4 py-2">{item.pc_uncr}</td>
                                    <td className="px-4 py-2 text-right">{brDecimal(item.pc_qtde)}</td>
                                    <td className="px-4 py-2 text-right">{brMoney(item.pc_prun)}</td>
                                    <td className="px-4 py-2 text-right font-medium">
                                        {brMoney(item.pc_qtde * item.pc_prun)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
