import React, { useState } from 'react';
import { useResourceStatus } from './useResourceStatus';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format } from 'date-fns';
import { jsonDate } from '../../utils/formatters';
import { useAllWorksites } from '../evaluations/useEvaluations';

export const DailyResourcesList: React.FC = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const { worksites } = useAllWorksites();
    const { resources, isLoading } = useResourceStatus(parseInt(selectedWorksite) || 0, date);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setDate(new Date(y, m - 1, d));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow">
                <h1 className="text-xl font-bold text-slate-800 mb-4">Status Diário de Recursos</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="date"
                        label="Data"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
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
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                {isLoading ? (
                    <div className="text-center py-8 text-slate-400">Carregando...</div>
                ) : resources.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">Nenhum recurso encontrado.</div>
                ) : (
                    <div className="space-y-2">
                        {resources.map((res) => {
                            // Pending Logic Check
                            // Legacy: if (ap_ords < 0 || ap_ords == 0 ...) color = green?
                            // Legacy logic is complex coloring based on pending status.
                            // I'll just display the raw data for now.
                            
                            return (
                                <div key={`${res.id_matr}-${res.fu_empr}`} className="p-3 border border-slate-200 rounded hover:bg-slate-50 flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-slate-800">{res.fu_nome}</div>
                                        <div className="text-xs text-slate-500">{res.fu_func} - {res.cb_tmdo}</div>
                                    </div>
                                    <div className="text-right text-xs">
                                        {res.fu_fcon && (
                                            <div className="text-orange-600">
                                                Exp: {jsonDate(res.fu_fcon)}
                                            </div>
                                        )}
                                        <div className="text-slate-400">Matr: {res.id_matr}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
