import React, { useState, useMemo } from 'react';
import { useProductionOrders } from './useProductionOrders';
import { useAllWorksites } from '../evaluations/useEvaluations';
import { useProposals } from '../service-orders/useProposals';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { format, subMonths } from 'date-fns';
import { jsonDate } from '../../utils/formatters';
import { ProductionOrder } from './types';
import { ProductionOrderForm } from './ProductionOrderForm';

export const ProductionOrderList: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedProposal, setSelectedProposal] = useState<string>('0');
    
    const { worksites } = useAllWorksites();
    const { proposals } = useProposals(parseInt(selectedWorksite) || 0);

    const filters = useMemo(() => ({
        startDate,
        endDate,
        worksiteId: parseInt(selectedWorksite) || null,
        orderId: parseInt(selectedProposal) || null
    }), [startDate, endDate, selectedWorksite, selectedProposal]);

    const { orders, isLoading } = useProductionOrders(filters);
    
    // Selection state
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        }
    };

    const handleCreateNew = () => {
        if (selectedWorksite === '0') {
            alert('Selecione uma obra para criar uma nova ordem.');
            return;
        }
        setSelectedOrder(null);
        setIsCreating(true);
    };

    const handleCloseForm = () => {
        setSelectedOrder(null);
        setIsCreating(false);
    };

    const getWorksiteName = () => {
        const w = worksites.find(w => w.id_clie.toString() === selectedWorksite);
        return w ? w.cl_fant : '';
    };

    return (
        <div className="flex flex-col h-full space-y-4 overflow-y-auto">
            <div className="panel p-5">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800">Ordens de Serviço de Produção</h1>
                    <Button onClick={handleCreateNew} disabled={selectedWorksite === '0'}>
                        Nova Ordem
                    </Button>
                </div>
                
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
                            setSelectedOrder(null);
                            setIsCreating(false);
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
                                        onClick={() => {
                                            setIsCreating(false);
                                            setSelectedOrder(po);
                                        }}
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

                {/* Edit Form */}
                <div className="lg:col-span-2 flex flex-col min-h-0">
                    {(selectedOrder || isCreating) ? (
                        <ProductionOrderForm 
                            key={selectedOrder?.po_nume || 'new'}
                            order={selectedOrder}
                            worksiteId={parseInt(selectedWorksite)}
                            worksiteName={getWorksiteName()}
                            onClose={handleCloseForm}
                            onSaved={() => {
                                // If creating, maybe select the new order? 
                                // For now just refresh happens via react-query invalidate
                                setIsCreating(false);
                                setSelectedOrder(null); 
                            }}
                        />
                    ) : (
                        <div className="bg-white rounded-lg shadow flex-1 flex items-center justify-center text-slate-400">
                            Selecione uma ordem para editar ou crie uma nova.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
