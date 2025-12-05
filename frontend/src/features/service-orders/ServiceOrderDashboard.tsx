import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useServiceOrder } from './useServiceOrder';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format } from 'date-fns';
import { brDecimal, jsonDate } from '../../utils/formatters';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

// Simple Progress Bar Component
const ProgressBar = ({ value, max, label, colorClass = 'bg-blue-500' }: { value: number, max: number, label?: string, colorClass?: string }) => {
    const percentage = Math.min(100, Math.max(0, (value / (max || 1)) * 100));
    return (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
                <span>{label}</span>
                <span>{brDecimal(value)} / {brDecimal(max)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export const ServiceOrderDashboard: React.FC = () => {
    const [searchParams] = useSearchParams();
    // Assuming URL like /service-order?idClie=1&idOrds=100
    // In a real app, maybe route params /service-order/:idClie/:idOrds
    const idClie = parseInt(searchParams.get('idClie') || '0');
    const idOrds = parseInt(searchParams.get('idOrds') || '0');

    const [date, setDate] = useState<Date>(new Date());
    const [comparisonBase, setComparisonBase] = useState<string>('OC_QTHR'); // Default to 'Orçadas'

    const {
        details,
        internalAppointments,
        appointmentStatus,
        stoppedAppointments,
        comparison,
        overtimeMinutes,
        isLoading,
        isOvertimeLoading
    } = useServiceOrder(idClie, idOrds, date);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            setDate(new Date(y, m - 1, d));
        }
    };

    // Overtime Display
    const overtimeDisplay = useMemo(() => {
        const hours = Math.floor(overtimeMinutes / 60);
        const minutes = overtimeMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }, [overtimeMinutes]);

    // Comparison Logic
    // Legacy switches between 'OC_QTHR' (Total) vs Manual Logic.
    // Actually legacy `pesquisaDashboardHorasPlanejadasApontadasDCO` returns fields:
    // os_mdpl/fu_hamd (Labor), os_mipl/fu_hami (Material), os_eqpl/eq_hrap (Equipment).
    // BUT if `OC_QTHR` is selected, it overrides these variables with `mp_qthr`, `mi_qthr`, `eq_qthr`.
    // So we need to simulate that swap.
    
    const comparisonData = useMemo(() => {
        if (!comparison) return [];

        let laborPlanned = comparison.os_mdpl;
        let materialPlanned = comparison.os_mipl;
        let equipmentPlanned = comparison.os_eqpl;

        if (comparisonBase === 'OC_QTHR') {
            laborPlanned = comparison.mp_qthr;
            materialPlanned = comparison.mi_qthr;
            equipmentPlanned = comparison.eq_qthr;
        }

        return [
            { name: 'Mão de Obra', planned: laborPlanned, realized: comparison.fu_hamd },
            { name: 'Material', planned: materialPlanned, realized: comparison.fu_hami },
            { name: 'Equipamento', planned: equipmentPlanned, realized: comparison.eq_hrap },
        ];
    }, [comparison, comparisonBase]);

    // Status Chart Data
    const statusChartData = useMemo(() => {
        return appointmentStatus.map(s => ({
            name: s.sr_deno,
            value: s.re_hrap
        }));
    }, [appointmentStatus]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];


    if (idClie === 0 || idOrds === 0) {
        return <div className="p-4 text-center text-slate-500">Selecione uma Ordem de Serviço (Parâmetros inválidos).</div>;
    }

    if (isLoading && !details) {
         return <div className="p-4 text-center text-slate-500">Carregando Dashboard...</div>;
    }

    if (!details) {
        return <div className="p-4 text-center text-slate-500">Ordem de Serviço não encontrada.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">{details.cl_fant}</h1>
                        <p className="text-sm text-slate-500">OS: {details.os_nume} - {details.os_desc}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                             // Simple status coloring logic
                             details.os_situ === 'ABERTA' ? 'bg-green-500' : 'bg-slate-500'
                        }`}>
                            {details.os_situ}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                     <div>
                         <span className="block text-slate-400 text-xs">Responsável</span>
                         <span className="font-medium">{details.os_resp}</span>
                     </div>
                     <div>
                         <span className="block text-slate-400 text-xs">Orçamento</span>
                         <span className="font-medium">{details.oc_nume}</span>
                     </div>
                     <div>
                         <span className="block text-slate-400 text-xs">Contrato</span>
                         <span className="font-medium">{details.os_ncon}</span>
                     </div>
                     <div>
                         <span className="block text-slate-400 text-xs">Data Atualização</span>
                         <span className="font-medium">{jsonDate(details.os_dtpc)}</span>
                     </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 <Input
                    type="date"
                    label="Data de Referência"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                 />
                 <Select
                    label="Base de Comparação"
                    options={[
                        { value: 'OC_QTHR', label: 'Horas Orçadas' },
                        { value: 'OS_MDPL', label: 'Horas Planejadas' }
                    ]}
                    value={comparisonBase}
                    onChange={(e) => setComparisonBase(e.target.value)}
                 />
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Comparison Bars */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Planejado vs Realizado</h2>
                    <div className="space-y-4">
                        {comparisonData.map(item => (
                            <ProgressBar
                                key={item.name}
                                label={item.name}
                                value={item.realized}
                                max={item.planned}
                                colorClass={item.realized > item.planned ? 'bg-red-500' : 'bg-blue-500'}
                            />
                        ))}
                    </div>
                </div>

                {/* Status Chart */}
                <div className="bg-white p-4 rounded-lg shadow min-h-[300px]">
                    <h2 className="text-lg font-semibold mb-4">Situação dos Apontamentos</h2>
                     {statusChartData.length > 0 ? (
                         <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={statusChartData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8">
                                    {statusChartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     ) : (
                         <div className="text-center text-slate-400 py-10">Sem dados de situação.</div>
                     )}
                </div>
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Overtime */}
                <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
                     <h3 className="text-slate-500 text-sm uppercase font-bold mb-2">Horas Extras</h3>
                     <div className="text-3xl font-bold text-purple-600">
                         {isOvertimeLoading ? '...' : overtimeDisplay}
                     </div>
                     <p className="text-xs text-slate-400 mt-1">Calculado com base na jornada</p>
                </div>

                {/* Internal Appointments */}
                <div className="bg-white p-4 rounded-lg shadow col-span-2">
                    <h3 className="text-slate-500 text-sm uppercase font-bold mb-2">Apontamentos Internos</h3>
                    {internalAppointments.length > 0 ? (
                        <div className="overflow-x-auto">
                             <table className="min-w-full text-sm">
                                 <thead>
                                     <tr className="border-b">
                                         <th className="text-left py-2">Obra Interna</th>
                                         <th className="text-right py-2">Horas</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {internalAppointments.map((app, idx) => (
                                         <tr key={idx} className="border-b last:border-0">
                                             <td className="py-2">{app.cl_fant}</td>
                                             <td className="py-2 text-right font-medium">{brDecimal(app.re_hrap)}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                        </div>
                    ) : (
                        <div className="text-slate-400 text-sm">Nenhum apontamento interno.</div>
                    )}
                </div>
            </div>

            {/* Stopped Appointments */}
             {stoppedAppointments.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow">
                     <h3 className="text-slate-500 text-sm uppercase font-bold mb-2">Apontamentos Parados</h3>
                     <div className="overflow-x-auto">
                         <table className="min-w-full text-sm">
                             <thead>
                                 <tr className="bg-slate-100">
                                     <th className="px-4 py-2 text-left">Justificativa</th>
                                     <th className="px-4 py-2 text-center">Horas</th>
                                     <th className="px-4 py-2 text-left">Contratante</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {stoppedAppointments.map((app, idx) => (
                                     <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                         <td className="px-4 py-2">{app.ju_deno}</td>
                                         <td className="px-4 py-2 text-center font-bold text-red-500">{brDecimal(app.re_hrap)}</td>
                                         <td className="px-4 py-2">{app.re_hace}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                </div>
             )}
        </div>
    );
};
