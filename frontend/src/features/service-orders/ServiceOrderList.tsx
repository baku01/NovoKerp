import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useServiceOrderList } from './useServiceOrderList';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CircularGauge } from '../../components/ui/CircularGauge';
import { format } from 'date-fns';
import { brDecimal, jsonDate } from '../../utils/formatters';

export const ServiceOrderList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const idClie = parseInt(searchParams.get('idClie') || '0');
    // Assuming we can get client name from query param too, or fetch it.
    // For now, we'll rely on the API returning data or pass it via state.
    // Legacy relied on sessionStorage. Let's assume query param 'clientName' for UX or the API data (ServiceOrder list has cl_fant).
    const clientNameParam = searchParams.get('clientName') || '';

    const [date, setDate] = useState<Date>(new Date());
    const [hoursType, setHoursType] = useState<string>('OC_QTHR'); // 'OC_QTHR' (Orçadas) or 'PL_QTHR' (Planejadas)

    const { orders, summary, premiumHours, isLoading } = useServiceOrderList(idClie, date);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setDate(new Date(y, m - 1, d));
        }
    };

    // Derived Premium Hours Total
    const totalPremiumMinutes = useMemo(() => {
        return premiumHours.reduce((acc, curr) => {
            // Legacy logic uses "Clock Decimal" (e.g. 1.30 = 1h 30m)
            const val = curr.ah_hora.toFixed(2);
            const [h, m] = val.split('.').map(Number);
            return acc + (h * 60) + m;
        }, 0);
    }, [premiumHours]);

    const premiumDisplay = useMemo(() => {
        const h = Math.floor(totalPremiumMinutes / 60);
        const m = totalPremiumMinutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }, [totalPremiumMinutes]);

    const clientName = orders.length > 0 ? orders[0].cl_fant : clientNameParam;

    if (idClie === 0) {
        return <div className="p-4 text-center text-slate-500">Cliente não selecionado.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
             {/* Header */}
             <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-slate-800">{clientName}</h1>
                    <button 
                        onClick={() => navigate(`/horas-premio?idClie=${idClie}&clientName=${encodeURIComponent(clientName)}`)}
                        className="text-sm text-slate-500 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                         Horas Prêmio: <span className="font-bold text-purple-600">{premiumDisplay}</span>
                         <span className="ml-1 text-xs">✎</span>
                    </button>
                </div>

                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <SummaryItem label="Avanço" value={`${brDecimal(summary.cl_pavc)}%`} color="text-green-600" />
                        <SummaryItem label="Planejado" value={`${brDecimal(summary.cl_papl)}%`} />
                        <SummaryItem 
                            label="Desvio" 
                            value={`${brDecimal(summary.cl_pavc - summary.cl_papl)}%`} 
                            color={summary.cl_pavc - summary.cl_papl >= 0 ? 'text-green-600' : 'text-red-600'}
                        />
                        <SummaryItem label="A Faturar" value={`${brDecimal(summary.cl_paft)}%`} color="text-blue-600" />
                        
                        <SummaryItem label="Encarregado" value={summary.cl_enca} colSpan={2} />
                        <SummaryItem label="Planejador" value={summary.cl_plan} colSpan={2} />
                        
                        <SummaryItem label="Prev. Término" value={jsonDate(summary.cl_dtpt)} />
                        <SummaryItem label="Término Real" value={jsonDate(summary.cl_dttr)} />
                    </div>
                )}
             </div>

             {/* Controls */}
             <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input
                    type="date"
                    label="Data de Referência"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                 />
                 <Select
                    label="Base Horas"
                    options={[
                        { value: 'OC_QTHR', label: 'Horas Orçadas' },
                        { value: 'PL_QTHR', label: 'Horas Planejadas' } // Legacy had this logic implicitly?
                    ]}
                    value={hoursType}
                    onChange={(e) => setHoursType(e.target.value)}
                 />
             </div>

             {/* Orders Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {isLoading ? (
                     <div className="col-span-full text-center py-8 text-slate-500">Carregando Propostas...</div>
                 ) : orders.length === 0 ? (
                     <div className="col-span-full text-center py-8 text-slate-500">Nenhuma proposta encontrada.</div>
                 ) : (
                     orders.map(order => (
                         <OrderCard 
                            key={order.id_ords} 
                            order={order} 
                            hoursType={hoursType}
                            onClick={() => navigate(`/ordem-servico?idClie=${idClie}&idOrds=${order.id_ords}`)}
                            onPlanClick={() => navigate(`/planejamento-os?idClie=${idClie}&idOrds=${order.id_ords}&clientName=${encodeURIComponent(clientName)}`)}
                         />
                     ))
                 )}
             </div>
        </div>
    );
};

const SummaryItem = ({ label, value, color = 'text-slate-800', colSpan = 1 }: { label: string, value: string | number, color?: string, colSpan?: number }) => (
    <div className={`col-span-${colSpan}`}>
        <span className="block text-xs text-slate-400">{label}</span>
        <span className={`font-medium ${color}`}>{value || '-'}</span>
    </div>
);

const OrderCard = ({ order, hoursType, onClick, onPlanClick }: { order: any, hoursType: string, onClick: () => void, onPlanClick: () => void }) => {
    // Calculate percentages
    // Legacy logic:
    // lnOpQthr = parseInt(gmDsOrdsDOL[i][lcSlHora]); (Orçadas or Planejadas)
    // lnOsPhcn = (lnReHrap / lnOpQthr) * 100; (Consumed %)
    // lnOsPhtr = (lnReHtap / lnOpQthr) * 100; (Worked %)
    
    const hoursBase = hoursType === 'OC_QTHR' ? order.oc_qthr : (order.pl_qthr || order.oc_qthr); // Fallback
    const base = hoursBase || 1;
    
    const percConsumed = (order.re_hrap / base) * 100;
    const percWorked = (order.re_htap / base) * 100;

    const rdoPending = order.os_qrdo - order.os_qaro;
    const rdoTotal = order.os_qrdo;
    const percRdo = rdoTotal > 0 ? (rdoPending / rdoTotal) * 100 : 0;

    // Color logic
    const getColor = (p: number) => {
        if (p <= 70) return 'green';
        if (p <= 90) return 'yellow';
        if (p <= 100) return 'orange';
        return 'red';
    };

    return (
        <div 
            onClick={onClick}
            className={`
                bg-white p-4 rounded-lg shadow cursor-pointer transition-all hover:shadow-md border-2 relative
                ${order.os_pcon >= 100 ? 'border-green-500' : 'border-transparent'}
            `}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-700">{order.os_nume}</h3>
                <span 
                    className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPlanClick();
                    }}
                    title="Ir para Planejamento"
                >
                    ⚙
                </span>
                <span 
                    className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-600 hover:bg-blue-200 transition-colors ml-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to Appointment Entry
                        // Pass basic info
                        window.location.href = `/apontamento?idClie=${order.id_clie}&idOrds=${order.id_ords}&clientName=${encodeURIComponent(order.cl_fant)}`;
                    }}
                    title="Novo Apontamento"
                >
                    +
                </span>
            </div>

            <div className="flex justify-between items-start mb-4">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {jsonDate(order.ap_data)}
                </span>
            </div>

            <div className="flex justify-around mb-4">
                <CircularGauge
                    value={percWorked}
                    label="Trabalhadas"
                    color={getColor(percWorked)}
                    size={80}
                />
                <CircularGauge
                    value={percConsumed}
                    label="Consumidas"
                    color={getColor(percConsumed)}
                    size={80}
                />
            </div>

            <div className="space-y-2 text-xs text-slate-600">
                 <div className="flex justify-between">
                     <span>Base Horas ({hoursType === 'OC_QTHR' ? 'Orç' : 'Plan'}):</span>
                     <span className="font-bold">{base}</span>
                 </div>
                 <div className="flex justify-between">
                     <span>RDO Pendente:</span>
                     <span>{rdoPending} / {rdoTotal} ({brDecimal(percRdo)}%)</span>
                 </div>
            </div>
        </div>
    );
}
