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
import { PageLayout } from '../../components/layout/PageLayout';
import { Panel } from '../../components/layout/Panel';

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
        return (
            <PageLayout title="Dashboard da OS" subtitle="Selecione uma ordem para visualizar" tag="Serviços">
                <Panel className="p-6 text-center text-slate-600">
                    Selecione uma Ordem de Serviço (parâmetros inválidos).
                </Panel>
            </PageLayout>
        );
    }

    if (isLoading && !details) {
        return (
            <PageLayout title="Dashboard da OS" subtitle="Carregando dados..." tag="Serviços">
                <Panel className="p-6 text-center text-slate-600">Carregando Dashboard...</Panel>
            </PageLayout>
        );
    }

    if (!details) {
        return (
            <PageLayout title="Dashboard da OS" subtitle="Ordem de Serviço não encontrada" tag="Serviços">
                <Panel className="p-6 text-center text-slate-600">Ordem de Serviço não encontrada.</Panel>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title={`OS ${details.os_nume}`}
            subtitle={`${details.cl_fant} • ${details.os_desc}`}
            tag="Serviços"
            actions={
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        details.os_situ === 'ABERTA' ? 'bg-emerald-600' : 'bg-slate-500'
                    }`}
                >
                    {details.os_situ}
                </span>
            }
        >
            <div className="space-y-4">
                <Panel
                    title="Contexto da OS"
                    subtitle="Dados-chave da operação"
                    actions={
                        <span className="text-xs rounded-full bg-blue-50 text-blue-700 px-3 py-1 font-semibold">
                            Atualizado em {jsonDate(details.os_dtpc)}
                        </span>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="block text-slate-400 text-xs">Responsável</span>
                            <span className="font-medium text-slate-900">{details.os_resp}</span>
                        </div>
                        <div>
                            <span className="block text-slate-400 text-xs">Orçamento</span>
                            <span className="font-medium text-slate-900">{details.oc_nume}</span>
                        </div>
                        <div>
                            <span className="block text-slate-400 text-xs">Contrato</span>
                            <span className="font-medium text-slate-900">{details.os_ncon}</span>
                        </div>
                        <div>
                            <span className="block text-slate-400 text-xs">Data Atualização</span>
                            <span className="font-medium text-slate-900">{jsonDate(details.os_dtpc)}</span>
                        </div>
                    </div>
                </Panel>

                <Panel title="Parâmetros" subtitle="Defina a data e base de comparação">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
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
                </Panel>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Panel title="Planejado vs Realizado">
                        <div className="space-y-4">
                            {comparisonData.map(item => (
                                <ProgressBar
                                    key={item.name}
                                    label={item.name}
                                    value={item.realized}
                                    max={item.planned}
                                    colorClass={item.realized > item.planned ? 'bg-rose-500' : 'bg-blue-500'}
                                />
                            ))}
                        </div>
                    </Panel>

                    <Panel title="Situação dos Apontamentos" className="min-h-[300px]">
                        {statusChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={statusChartData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
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
                    </Panel>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Panel className="flex flex-col items-center justify-center" title="Horas Extras" subtitle="Calculado com base na jornada">
                        <div className="text-3xl font-bold text-purple-600">
                            {isOvertimeLoading ? '...' : overtimeDisplay}
                        </div>
                    </Panel>

                    <Panel className="col-span-2" title="Apontamentos Internos">
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
                    </Panel>
                </div>

                {stoppedAppointments.length > 0 && (
                    <Panel title="Apontamentos Parados">
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
                    </Panel>
                )}
            </div>
        </PageLayout>
    );
};
