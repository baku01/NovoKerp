import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePremiumHours } from './usePremiumHours';
import { Input } from '../../components/ui/Input';
import { format } from 'date-fns';
import { jsonDate } from '../../utils/formatters';
import { PageLayout } from '../../components/layout/PageLayout';
import { Panel } from '../../components/layout/Panel';

export const PremiumHours: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const idClie = parseInt(searchParams.get('idClie') || '0');
    const clientName = searchParams.get('clientName') || 'Cliente';

    // State for Filter/Context
    const [referenceDate, setReferenceDate] = useState<Date>(new Date()); // "Data" in legacy (filters list)
    const [positionDate, setPositionDate] = useState<Date>(new Date()); // "Data Posição" (used for insert check)

    // State for New Entry
    const [newDate, setNewDate] = useState<Date>(new Date());
    const [newTime, setNewTime] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { 
        premiumHours, 
        isLoading, 
        insertPremiumHour, 
        deletePremiumHour,
        isInserting 
    } = usePremiumHours(idClie, referenceDate);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (d: Date) => void) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setter(new Date(y, m - 1, d));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!newTime || !newDesc) {
            setError('Preencha todos os campos.');
            return;
        }

        // Legacy Validation: Position Date must be >= New Date?
        // Legacy: if (htmlDataParaObjetoData(lcPsData) < htmlDataParaObjetoData(lcAhData)) alert...
        // So Position Date (loDtDat0) must be >= New Date (loDtData).
        // Wait, legacy says: if (PositionDate < RecordDate) alert("data maior que data da posição").
        // Meaning Record Date cannot be in the future relative to Position Date?
        // Or Position Date is the "Cutoff"?
        // "data maior que data da posição" -> "Date > Position Date" is the error condition.
        
        if (positionDate < newDate) {
            setError('Data do lançamento não pode ser maior que a Data da Posição.');
            return;
        }

        try {
            await insertPremiumHour({
                positionDate: positionDate,
                recordDate: newDate,
                timeStr: newTime,
                description: newDesc
            });
            // Reset form
            setNewTime('');
            setNewDesc('');
            // Legacy sets newDate to positionDate after insert? 
            // "loDtData.value = loDtDat0.value;"
            setNewDate(positionDate);
        } catch (err: unknown) {
            setError('Erro ao inserir horas prêmio. Tente novamente.');
            console.error(err);
        }
    };

    const handleDelete = async (idHrpr: number, date: string) => {
        if (window.confirm('Deseja realmente excluir este registro?')) {
            try {
                await deletePremiumHour({ idHrpr, recordDate: date });
            } catch (err) {
                console.error(err);
                alert('Erro ao excluir registro.');
            }
        }
    };

    if (idClie === 0) {
        return (
            <PageLayout title="Horas Prêmio" subtitle="Selecione um cliente válido" tag="Serviços">
                <Panel className="p-6 text-center text-slate-600">Cliente inválido.</Panel>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Horas Prêmio" subtitle={clientName} tag="Serviços">
            <div className="space-y-4">
                <Panel className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Horas Prêmio</h1>
                        <p className="text-sm text-slate-500">{clientName}</p>
                    </div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Voltar
                    </button>
                </Panel>

                <Panel className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="date"
                            label="Data da Posição (Referência)"
                            value={format(positionDate, 'yyyy-MM-dd')}
                            onChange={(e) => handleDateChange(e, setPositionDate)}
                        />
                        <Input
                            type="date"
                            label="Filtrar Lista por Data"
                            value={format(referenceDate, 'yyyy-MM-dd')}
                            onChange={(e) => handleDateChange(e, setReferenceDate)}
                        />
                    </div>

                    <hr className="border-slate-100" />

                    <h2 className="font-semibold text-slate-700">Novo Lançamento</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="date"
                                label="Data"
                                value={format(newDate, 'yyyy-MM-dd')}
                                onChange={(e) => handleDateChange(e, setNewDate)}
                                required
                            />
                            <Input
                                type="time"
                                label="Hora (HH:MM)"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                required
                            />
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
                                <textarea
                                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white/90 shadow-inner shadow-slate-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                                    rows={2}
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value.toUpperCase())}
                                    required
                                />
                            </div>
                        </div>
                        
                        {error && <p className="text-rose-600 text-sm">{error}</p>}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isInserting}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                            >
                                {isInserting ? 'Salvando...' : 'Adicionar'}
                            </button>
                        </div>
                    </form>
                </Panel>

                <Panel className="p-5">
                    <h2 className="font-semibold text-slate-700 mb-4">Histórico</h2>
                    {isLoading ? (
                        <div className="text-center text-slate-400">Carregando...</div>
                    ) : premiumHours.length === 0 ? (
                        <div className="text-center text-slate-400">Nenhum registro encontrado.</div>
                    ) : (
                        <div className="space-y-2">
                            {premiumHours.map((item) => (
                                <div key={item.id_hrpr} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors flex justify-between items-start group">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-bold text-slate-800">{jsonDate(item.ah_data)}</span>
                                            <span className="text-sm text-slate-500">•</span>
                                            <span className="font-bold text-purple-600">
                                                {/* Convert decimal 1.30 to 1:30 display */}
                                                {item.ah_hora.toFixed(2).replace('.', ':')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700">{item.ah_desc}</p>
                                        <p className="text-xs text-slate-400 mt-1">Usuário: {item.id_user}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id_hrpr, item.ah_data)}
                                        className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Excluir"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </Panel>
            </div>
        </PageLayout>
    );
};
