import { useDashboardData } from '../../features/dashboard/useDashboardData';
import { CircularGauge } from '../../components/ui/CircularGauge';
import { brDecimal, jsonDate } from '../../utils/formatters';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '../../components/layout/Panel';

export function ClienteDashboard() {
    const [selectedDate] = useState(new Date());
    const { obras, divergentes, pendentes, isLoading } = useDashboardData(selectedDate);
    const navigate = useNavigate();

    const getGaugeColor = (percentage: number): 'green' | 'yellow' | 'orange' | 'red' => {
        if (percentage <= 70) return 'green';
        if (percentage <= 90) return 'yellow';
        if (percentage <= 100) return 'orange';
        return 'red';
    };

    return (
        <div className="space-y-4">
            {isLoading && (
                <Panel className="p-6 text-center" title="Carregando painel de obras">
                    <div className="flex items-center justify-center gap-3 text-slate-600">
                        <div className="h-10 w-10 border-2 border-blue-500/50 border-t-transparent rounded-full animate-spin" />
                        <span>Buscando indicadores...</span>
                    </div>
                </Panel>
            )}

            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                onClick={() =>
                                    navigate(
                                        `/propostas?idClie=${obra.id_clie}&clientName=${encodeURIComponent(obra.cl_fant)}`,
                                    )
                                }
                                className="panel p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-white/90"
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Obra</p>
                                        <h3 className="text-lg font-semibold text-slate-900 truncate">{obra.cl_fant}</h3>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                        #{obra.id_cadt}
                                    </span>
                                </div>

                                <div className="flex justify-around mb-5 gap-3">
                                    <CircularGauge
                                        value={percHorasTrabalhadas}
                                        label="Horas Trabalhadas"
                                        color={getGaugeColor(percHorasTrabalhadas)}
                                        size={96}
                                    />
                                    <CircularGauge
                                        value={percHorasConsumidas}
                                        label="Horas Consumidas"
                                        color={getGaugeColor(percHorasConsumidas)}
                                        size={96}
                                    />
                                </div>

                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex justify-between">
                                        <span>Horas Orçadas:</span>
                                        <span className="font-semibold text-slate-900">{horasOrcadas}:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Último Apontamento:</span>
                                        <span className="font-semibold text-slate-900">{jsonDate(obra.ap_data)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Apt. Divergentes:</span>
                                        <span className="font-semibold text-rose-600">{divergente?.qt_dvrg || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Apt. Pendentes:</span>
                                        <span className="font-semibold text-amber-600">
                                            {pendente?.qt_pndt || 0} / {pendente?.qt_tota || 0} (
                                            {brDecimal(percAptPendente)}%)
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>RDO Pendente:</span>
                                        <span className="font-semibold text-slate-900">
                                            {rdoPendente} / {obra.cl_qrdo} ({brDecimal(percRdoPendente)}%)
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-200 my-3" />

                                    <div className="flex justify-between">
                                        <span>Desvio Anterior:</span>
                                        <span className="font-semibold text-slate-900">{brDecimal(obra.cl_dant)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avanço:</span>
                                        <span className="font-semibold text-emerald-600">{brDecimal(obra.cl_pavc)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avanço Planejado:</span>
                                        <span className="font-semibold text-slate-900">{brDecimal(obra.cl_papl)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Desvio:</span>
                                        <span
                                            className={`font-semibold ${
                                                obra.cl_pavc - obra.cl_papl >= 0 ? "text-emerald-600" : "text-rose-600"
                                            }`}
                                        >
                                            {brDecimal(obra.cl_pavc - obra.cl_papl)}%
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-200 my-3" />

                                    <div className="flex justify-between">
                                        <span>Modificações:</span>
                                        <span className="font-semibold text-slate-900">{obra.qt_modi}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Mod. Atualização:</span>
                                        <span className="font-semibold text-slate-900">{obra.qt_moda}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Prev. Término:</span>
                                        <span className="font-semibold text-slate-900">{jsonDate(obra.cl_dtpt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Encarregado:</span>
                                        <span className="font-semibold text-slate-900 truncate ml-2">{obra.cl_enca}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>A Faturar:</span>
                                        <span className="font-semibold text-blue-600">{brDecimal(obra.cl_paft)}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!isLoading && obras.length === 0 && (
                <Panel className="p-6 text-center">
                    <div className="text-slate-600 text-lg">Nenhuma obra encontrada</div>
                </Panel>
            )}
        </div>
    );
}
