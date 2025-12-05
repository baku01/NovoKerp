import React, { useState, useMemo } from 'react';
import { useStockTransfers } from './useStockTransfers';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format, subMonths } from 'date-fns';
import { jsonDate, brDecimal, brMoney } from '../../utils/formatters';
import { StockTransfer, StockReturn } from './types';

export const StockMovementList: React.FC = () => {
    const [mode, setMode] = useState<'TRANSFER' | 'RETURN'>('TRANSFER');
    
    // Filters
    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedStatus, setSelectedStatus] = useState<string>('0');

    const filters = useMemo(() => ({
        startDate,
        endDate,
        worksiteId: parseInt(selectedWorksite) || null,
        statusId: parseInt(selectedStatus) || null
    }), [startDate, endDate, selectedWorksite, selectedStatus]);

    const { items, worksites, statuses, isLoading } = useStockTransfers(filters, mode);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800">Movimentações de Estoque</h1>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setMode('TRANSFER')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'TRANSFER' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Solicitações de Transferência
                        </button>
                        <button 
                            onClick={() => setMode('RETURN')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'RETURN' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Devoluções
                        </button>
                    </div>
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
                            { value: '0', label: 'TODAS AS OBRAS' },
                            ...worksites.map(w => ({ value: w.id_clie, label: w.cl_fant }))
                        ]}
                        value={selectedWorksite}
                        onChange={(e) => setSelectedWorksite(e.target.value)}
                    />
                    <Select
                        label="Situação"
                        options={[
                            { value: '0', label: 'TODAS AS SITUAÇÕES' },
                            ...statuses.map(s => ({ value: s.id_situ, label: s.st_deno }))
                        ]}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-400">Carregando...</div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">Nenhuma movimentação encontrada.</div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => {
                            // Type guard or safe access
                            const isTransfer = 'id_strf' in item;
                            const id = isTransfer ? (item as StockTransfer).id_strf : (item as StockReturn).id_dves;
                            const data = isTransfer ? (item as StockTransfer).sl_data : (item as StockReturn).dl_data;
                            const qtde = isTransfer ? (item as StockTransfer).sl_qtde : (item as StockReturn).dl_qtde;
                            const pcus = isTransfer ? (item as StockTransfer).sl_pcus : (item as StockReturn).dl_pcus;
                            const user = isTransfer ? (item as StockTransfer).sl_user : (item as StockReturn).dl_user;
                            const obse = isTransfer ? (item as StockTransfer).sl_obse : (item as StockReturn).dl_obse;

                            // Dates
                            const denv = isTransfer ? (item as StockTransfer).sl_denv : (item as StockReturn).dl_denv;
                            const drec = isTransfer ? (item as StockTransfer).sl_drec : (item as StockReturn).dl_drec;

                            return (
                                <details key={id} className="border border-slate-200 rounded-lg group">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 list-none">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: `rgb(${item.st_vcor})` }}
                                                title={item.st_deno}
                                            ></div>
                                            <div>
                                                <div className="font-bold text-slate-800">{item.cl_fant}</div>
                                                <div className="text-xs text-slate-500">
                                                    {isTransfer ? `Solicitação #${id}` : `Devolução #${id}`} • {jsonDate(data)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 text-sm">
                                            <div className="text-right">
                                                <div className="font-medium">{brDecimal(qtde)} un</div>
                                                <div className="text-xs text-slate-500">{brMoney(pcus)}</div>
                                            </div>
                                            <span className="transform transition-transform group-open:rotate-180 text-slate-400">▼</span>
                                        </div>
                                    </summary>
                                    <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50 text-sm grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                                        <DetailRow label="Situação" value={item.st_deno} />
                                        <DetailRow label="Solicitante" value={user} />
                                        {item.ap_user && (
                                            <>
                                                <DetailRow label="Aprovado Por" value={item.ap_user} />
                                                <DetailRow label="Data Aprovação" value={jsonDate(item.ap_data)} />
                                            </>
                                        )}
                                        {/* {isTransfer && <DetailRow label="Data Necessidade" value={jsonDate((item as StockTransfer).sl_dnec || '')} />} */}
                                        {denv && <DetailRow label="Data Envio" value={jsonDate(denv || '')} />}
                                        {drec && <DetailRow label="Data Recebimento" value={jsonDate(drec || '')} />}
                                        {obse && (
                                            <div className="md:col-span-2 mt-2">
                                                <span className="font-medium text-slate-600 block mb-1">Observação:</span>
                                                <p className="bg-white p-2 rounded border border-slate-200 text-slate-700">
                                                    {obse}
                                                </p>
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

const DetailRow: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-slate-200 py-1 last:border-0">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="text-slate-800 text-right">{value || '-'}</span>
    </div>
);
