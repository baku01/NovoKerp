import React, { useState, useMemo } from 'react';
import { useProductionOrders, useProductionOrderDetail } from './useProductionOrders';
import { useAllWorksites } from '../evaluations/useEvaluations';
import { useProposals } from '../service-orders/useProposals'; // Reuse proposals hook
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subMonths } from 'date-fns';
import { jsonDate } from '../../utils/formatters';
import { ProductionOrder } from './types';

export const ProductionOrderList: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedProposal, setSelectedProposal] = useState<string>('0');
    
    const { worksites } = useAllWorksites();
    // Fetch proposals if worksite selected
    const { proposals } = useProposals(parseInt(selectedWorksite) || 0);

    const filters = useMemo(() => ({
        startDate,
        endDate,
        worksiteId: parseInt(selectedWorksite) || null,
        orderId: parseInt(selectedProposal) || null // "Proposal" is Service Order here
    }), [startDate, endDate, selectedWorksite, selectedProposal]);

    const { orders, isLoading } = useProductionOrders(filters);
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold text-slate-800 mb-4">Ordens de Serviço de Produção</h1>
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
                        onChange={(e) => {
                            setSelectedWorksite(e.target.value);
                            setSelectedProposal('0');
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 flex-1">
                {/* List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">
                        Ordens ({orders.length})
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-400">Carregando...</div>
                        ) : orders.length === 0 ? (
                            <div className="p-4 text-center text-slate-400">Nenhuma ordem encontrada.</div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {orders.map((po) => (
                                    <li 
                                        key={po.po_nume} 
                                        onClick={() => setSelectedOrder(po)}
                                        className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedOrder?.po_nume === po.po_nume ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-800">PO #{po.po_nume}</span>
                                            <span className="text-xs text-slate-500">{jsonDate(po.po_data)}</span>
                                        </div>
                                        <div className="text-sm text-slate-600 mb-1 line-clamp-2">{po.po_desc}</div>
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>{po.os_nume}</span>
                                            <span className="font-medium text-blue-600">{po.ps_situ}</span>
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
                        <ProductionOrderDetails order={selectedOrder} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">Selecione uma ordem de serviço.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductionOrderDetails: React.FC<{ order: ProductionOrder }> = ({ order }) => {
    const { items, situations, isLoading } = useProductionOrderDetail(order.po_nume);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="font-bold text-lg text-slate-800 mb-2">{order.po_desc}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <DetailItem label="Planejador" value={order.po_plan} />
                    <DetailItem label="Solicitante" value={order.po_soli} />
                    <DetailItem label="Necessidade" value={jsonDate(order.po_dtnc)} />
                    <DetailItem label="Prev. Início" value={jsonDate(order.po_dtpi)} />
                    <DetailItem label="Horas Disp." value={order.po_hrdi} />
                    <DetailItem label="Situação" value={order.ps_situ} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Items */}
                <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Itens da OS</h3>
                    {isLoading ? (
                        <div className="text-slate-400 text-sm">Carregando itens...</div>
                    ) : items.length === 0 ? (
                        <div className="text-slate-400 text-sm">Nenhum item.</div>
                    ) : (
                        <ul className="space-y-2">
                            {items.map((item) => (
                                <li key={item.id_item} className="p-3 bg-slate-50 rounded border border-slate-100 text-sm">
                                    <span className="font-bold mr-2">Item {item.id_item}:</span>
                                    {item.pi_desc}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Situations */}
                <div>
                    <h3 className="font-semibold text-slate-700 mb-2">Histórico de Situações</h3>
                    {isLoading ? (
                        <div className="text-slate-400 text-sm">Carregando histórico...</div>
                    ) : situations.length === 0 ? (
                        <div className="text-slate-400 text-sm">Nenhum histórico.</div>
                    ) : (
                        <ul className="space-y-2">
                            {situations.map((sit, idx) => (
                                <li key={idx} className="flex justify-between text-sm p-2 border-b border-slate-100 last:border-0">
                                    <span>{sit.ps_situ}</span>
                                    <span className="text-slate-500">{jsonDate(sit.ps_data)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string, value: string | number }) => (
    <div>
        <span className="block text-xs text-slate-400">{label}</span>
        <span className="font-medium text-slate-700">{value || '-'}</span>
    </div>
);
