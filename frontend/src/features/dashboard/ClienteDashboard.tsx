import { useDashboardData } from '../../features/dashboard/useDashboardData';
import { CircularGauge } from '../../components/ui/CircularGauge';
import { brDecimal, jsonDate } from '../../utils/formatters';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ClienteDashboard() {
    const [selectedDate] = useState(new Date());
    const { obras, divergentes, pendentes, isLoading } = useDashboardData(selectedDate);
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    const getGaugeColor = (percentage: number): 'green' | 'yellow' | 'orange' | 'red' => {
        if (percentage <= 70) return 'green';
        if (percentage <= 90) return 'yellow';
        if (percentage <= 100) return 'orange';
        return 'red';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Obras</h1>
                    <p className="text-slate-400">Acompanhamento de projetos e apontamentos</p>
                </div>

                {/* Obras Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {obras.map((obra) => {
                        const divergente = divergentes.find((d) => d.id_cadt === obra.id_cadt);
                        const pendente = pendentes.find((p) => p.id_cadt === obra.id_cadt);

                        const horasConsumidas = obra.re_hrap || 0;
                        const horasOrcadas = obra.oc_qthr || 1;
                        const percHorasConsumidas = (horasConsumidas / horasOrcadas) * 100;

                        const horasTrabalhadas = obra.re_htap || 0;
                        const percHorasTrabalhadas = (horasTrabalhadas / horasOrcadas) * 100;

                        const rdoPendente = (obra.cl_qrdo || 0) - (obra.cl_qaro || 0);
                        const percRdoPendente = obra.cl_qrdo > 0 ? (rdoPendente / obra.cl_qrdo) * 100 : 0;

                        const percAptPendente = pendente?.qt_tota ? (pendente.qt_pndt / pendente.qt_tota) * 100 : 0;

                        return (
                            <div
                                key={obra.id_cadt}
                                onClick={() => navigate(`/propostas?idClie=${obra.id_clie}&clientName=${encodeURIComponent(obra.cl_fant)}`)}
                                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                            >
                                {/* Obra Title */}
                                <h3 className="text-xl font-bold text-white mb-4 truncate">{obra.cl_fant}</h3>

                                {/* Gauges */}
                                <div className="flex justify-around mb-6">
                                    <CircularGauge
                                        value={percHorasTrabalhadas}
                                        label="Horas Trabalhadas"
                                        color={getGaugeColor(percHorasTrabalhadas)}
                                        size={100}
                                    />
                                    <CircularGauge
                                        value={percHorasConsumidas}
                                        label="Horas Consumidas"
                                        color={getGaugeColor(percHorasConsumidas)}
                                        size={100}
                                    />
                                </div>

                                {/* Stats */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-300">
                                        <span>Horas Orçadas:</span>
                                        <span className="font-semibold text-white">{horasOrcadas}:00</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Último Apontamento:</span>
                                        <span className="font-semibold text-white">{jsonDate(obra.ap_data)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Apt. Divergentes:</span>
                                        <span className="font-semibold text-red-400">{divergente?.qt_dvrg || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Apt. Pendentes:</span>
                                        <span className="font-semibold text-yellow-400">
                                            {pendente?.qt_pndt || 0} / {pendente?.qt_tota || 0} ({brDecimal(percAptPendente)}%)
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>RDO Pendente:</span>
                                        <span className="font-semibold text-white">
                                            {rdoPendente} / {obra.cl_qrdo} ({brDecimal(percRdoPendente)}%)
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10 my-3"></div>

                                    <div className="flex justify-between text-slate-300">
                                        <span>Desvio Anterior:</span>
                                        <span className="font-semibold text-white">{brDecimal(obra.cl_dant)}%</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Avanço:</span>
                                        <span className="font-semibold text-green-400">{brDecimal(obra.cl_pavc)}%</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Avanço Planejado:</span>
                                        <span className="font-semibold text-white">{brDecimal(obra.cl_papl)}%</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Desvio:</span>
                                        <span className={`font-semibold ${obra.cl_pavc - obra.cl_papl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {brDecimal(obra.cl_pavc - obra.cl_papl)}%
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10 my-3"></div>

                                    <div className="flex justify-between text-slate-300">
                                        <span>Modificações:</span>
                                        <span className="font-semibold text-white">{obra.qt_modi}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Mod. Atualização:</span>
                                        <span className="font-semibold text-white">{obra.qt_moda}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Prev. Término:</span>
                                        <span className="font-semibold text-white">{jsonDate(obra.cl_dtpt)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>Encarregado:</span>
                                        <span className="font-semibold text-white truncate ml-2">{obra.cl_enca}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300">
                                        <span>A Faturar:</span>
                                        <span className="font-semibold text-blue-400">{brDecimal(obra.cl_paft)}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {obras.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-slate-400 text-lg">Nenhuma obra encontrada</div>
                    </div>
                )}
            </div>
        </div>
    );
}
