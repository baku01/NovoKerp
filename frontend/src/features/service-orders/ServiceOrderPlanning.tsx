import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useServiceOrderPlanning } from './useServiceOrderPlanning';
import { Input } from '../../components/ui/Input';
import { CircularGauge } from '../../components/ui/CircularGauge';
import { jsonDate, brDecimal } from '../../utils/formatters';
import { ServiceOrderProgress, ServiceOrderSituation } from './planningTypes';

export const ServiceOrderPlanning: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const idClie = parseInt(searchParams.get('idClie') || '0');
    const idOrds = parseInt(searchParams.get('idOrds') || '0');
    const clientName = searchParams.get('clientName') || '';

    const { 
        progress, 
        evolution, 
        situations, 
        isLoading, 
        updateProgress, 
        addSituation, 
        deleteSituation 
    } = useServiceOrderPlanning(idClie, idOrds);

    if (idClie === 0 || idOrds === 0) return <div className="p-4">Parâmetros inválidos.</div>;

    if (isLoading) return <div className="p-4 text-center text-slate-400">Carregando Planejamento...</div>;

    // Calculate Gauge Values
    let totalPlanned = 0;
    if (evolution) {
        totalPlanned = (evolution.mp_qthr || 0) + (evolution.mi_qthr || 0) + (evolution.eq_qthr || 0);
        // Fallback to budgeted
        if (totalPlanned === 0) totalPlanned = evolution.os_hroc || 1;
    }
    
    const totalRealized = evolution?.os_hrap || 0;
    const percConsumed = totalPlanned > 0 ? (totalRealized / totalPlanned) * 100 : 0;

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Planejamento da OS</h1>
                    <p className="text-sm text-slate-500">{clientName} (ID: {idOrds})</p>
                </div>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Voltar</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Control Panel */}
                <PlanningContent 
                    key={progress?.os_pcon?.toString() || 'loading'}
                    progress={progress} 
                    situations={situations}
                    onUpdateProgress={updateProgress}
                    onAddSituation={addSituation}
                    onDeleteSituation={deleteSituation}
                />

                {/* Stats & Visualization */}
                <div className="bg-white p-4 rounded-lg shadow space-y-6">
                    <h2 className="font-semibold text-slate-700 mb-4">Evolução e Desvios</h2>
                    
                    <div className="flex justify-around">
                        <CircularGauge 
                            value={percConsumed} 
                            label="Horas Consumidas" 
                            size={160} 
                            color={percConsumed > 100 ? 'red' : 'green'} 
                        />
                        <div className="flex flex-col justify-center space-y-4 text-sm">
                            <div>
                                <span className="block text-slate-400">Planejado Total</span>
                                <span className="font-bold text-lg">{brDecimal(totalPlanned)} h</span>
                            </div>
                            <div>
                                <span className="block text-slate-400">Realizado Total</span>
                                <span className="font-bold text-lg">{brDecimal(totalRealized)} h</span>
                            </div>
                            <div>
                                <span className="block text-slate-400">Saldo</span>
                                <span className={`font-bold text-lg ${totalPlanned - totalRealized >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {brDecimal(totalPlanned - totalRealized)} h
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-4 text-center text-sm">
                        <StatBox label="Mão de Obra" planned={evolution?.mp_qthr} real={evolution?.ap_hrmd} />
                        <StatBox label="Material" planned={evolution?.mi_qthr} real={evolution?.ap_hrmi} />
                        <StatBox label="Equipamento" planned={evolution?.eq_qthr} real={evolution?.ap_hreq} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, planned, real }: { label: string, planned?: number, real?: number }) => (
    <div className="bg-slate-50 p-2 rounded">
        <div className="font-semibold text-slate-700 mb-1">{label}</div>
        <div className="text-xs text-slate-500">Plan: {planned || 0}</div>
        <div className="text-xs text-slate-500">Real: {real || 0}</div>
    </div>
);

interface PlanningContentProps {
    progress: ServiceOrderProgress | null;
    situations: ServiceOrderSituation[];
    onUpdateProgress: (val: number) => Promise<unknown>;
    onAddSituation: (sit: string) => Promise<unknown>;
    onDeleteSituation: (params: { situation: string, date: string }) => Promise<unknown>;
}

const PlanningContent: React.FC<PlanningContentProps> = ({ progress, situations, onUpdateProgress, onAddSituation, onDeleteSituation }) => {
    const [completionPercent, setCompletionPercent] = useState(progress?.os_pcon?.toString() || '');
    const [newSituation, setNewSituation] = useState('');

    const handleProgressUpdate = async () => {
        const val = parseFloat(completionPercent);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            try {
                await onUpdateProgress(val);
                alert('Progresso atualizado!');
            } catch {
                alert('Erro ao atualizar progresso.');
            }
        }
    };

    const handleAddSituation = async () => {
        if (newSituation.trim().length > 0) {
            try {
                await onAddSituation(newSituation.toUpperCase());
                setNewSituation('');
            } catch {
                alert('Erro ao adicionar situação.');
            }
        }
    };

    const handleDeleteSituation = async (sit: string, date: string) => {
        if (window.confirm('Excluir esta situação?')) {
            try {
                await onDeleteSituation({ situation: sit, date });
            } catch {
                alert('Erro ao excluir situação.');
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-6">
            <div>
                <h2 className="font-semibold text-slate-700 mb-2">Atualizar Progresso (%)</h2>
                <div className="flex space-x-2">
                    <Input 
                        type="number" 
                        value={completionPercent} 
                        onChange={(e) => setCompletionPercent(e.target.value)}
                        className="w-32"
                    />
                    <button 
                        onClick={handleProgressUpdate}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Atualizar
                    </button>
                </div>
                {progress && (
                    <p className="text-xs text-slate-400 mt-1">
                        Última atualização: {jsonDate(progress.os_dtpc)} por {progress.os_uspc}
                    </p>
                )}
            </div>

            <div className="border-t border-slate-100 pt-4">
                <h2 className="font-semibold text-slate-700 mb-2">Histórico de Situação</h2>
                <div className="flex space-x-2 mb-4">
                    <Input 
                        placeholder="Nova situação..." 
                        value={newSituation} 
                        onChange={(e) => setNewSituation(e.target.value.toUpperCase())}
                    />
                    <button 
                        onClick={handleAddSituation}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Adicionar
                    </button>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {situations.map((sit, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                            <div>
                                <span className="block text-xs text-slate-400">{jsonDate(sit.os_data)}</span>
                                <span className="text-sm font-medium">{sit.os_situ}</span>
                            </div>
                            <button 
                                onClick={() => handleDeleteSituation(sit.os_situ, sit.os_data)}
                                className="text-red-400 hover:text-red-600 px-2"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};