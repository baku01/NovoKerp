import React, { useState, useMemo } from 'react';
import { useSalaryAnalysis } from './useSalaryAnalysis';
import { Select } from '../../components/ui/Select';
import { brMoney } from '../../utils/formatters';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { format, subDays, subMonths, subYears, parseISO } from 'date-fns';

interface ChartDataPoint {
    date: string;
    originalDate: string;
    [key: string]: string | number;
}

const PERIOD_OPTIONS = [
    { value: '30D', label: '30 Dias' },
    { value: '6M', label: '6 Meses' },
    { value: '1A', label: '1 Ano' },
];

export const SalaryAnalysisReport: React.FC = () => {
    const [selectedWorksiteId, setSelectedWorksiteId] = useState<string>('0');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('30D');
    const [selectedFunction, setSelectedFunction] = useState<string>('');

    // Date Calculation
    const { startDate, endDate } = useMemo(() => {
        const end = new Date();
        end.setHours(0, 0, 0, 0);
        
        let start = new Date(end);
        const amount = parseInt(selectedPeriod.replace(/\D/g, ''));
        const unit = selectedPeriod.replace(/\d/g, '');

        if (unit === 'D') start = subDays(end, amount);
        else if (unit === 'M') start = subMonths(end, amount);
        else if (unit === 'A') start = subYears(end, amount);

        return { startDate: start, endDate: end };
    }, [selectedPeriod]);

    const {
        worksites,
        resourceTypes,
        chartData,
        summaryData,
        isLoading
    } = useSalaryAnalysis(
        parseInt(selectedWorksiteId),
        startDate,
        endDate,
        selectedFunction || null
    );

    // Transform Chart Data
    const transformedChartData = useMemo(() => {
        if (!chartData.length) return [];

        // Group by Date
        const grouped: Record<string, ChartDataPoint> = {};
        const allFunctions = new Set<string>();

        chartData.forEach(item => {
            const dateStr = format(parseISO(item.sa_data), 'dd/MM/yyyy');
            if (!grouped[dateStr]) {
                grouped[dateStr] = { date: dateStr, originalDate: item.sa_data };
            }
            grouped[dateStr][item.fu_sgla] = item.sa_sala;
            allFunctions.add(item.fu_sgla);
        });

        return Object.values(grouped).sort((a, b) => 
            new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime()
        );
    }, [chartData]);

    // Get unique functions for lines
    const chartSeries = useMemo(() => {
        const funcs = new Set<string>();
        chartData.forEach(d => funcs.add(d.fu_sgla));
        return Array.from(funcs);
    }, [chartData]);

    // Random colors for chart series (or fixed palette)
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            {/* Header & Filters */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <h1 className="text-xl font-bold text-slate-800">Análise Média Salarial</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        label="Obra"
                        options={[
                            { value: '0', label: 'TODAS AS OBRAS' },
                            ...worksites.map(w => ({ value: w.id_cadt, label: w.cl_fant }))
                        ]}
                        value={selectedWorksiteId}
                        onChange={(e) => setSelectedWorksiteId(e.target.value)}
                    />

                    <Select
                        label="Período"
                        options={PERIOD_OPTIONS}
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    />

                    <Select
                        label="Função"
                        options={[
                            { value: '', label: 'TODAS AS FUNÇÕES' },
                            ...resourceTypes.map(t => ({ value: t.fu_sgla, label: t.fu_sgla }))
                        ]}
                        value={selectedFunction}
                        onChange={(e) => setSelectedFunction(e.target.value)}
                    />
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 rounded-lg shadow h-96">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center text-slate-500">Carregando gráfico...</div>
                ) : transformedChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500">Nenhum dado para o gráfico.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={transformedChartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(val) => `R$ ${val}`} />
                            <Tooltip formatter={(val: number) => brMoney(val)} />
                            <Legend />
                            {chartSeries.map((func, idx) => (
                                <Area
                                    key={func}
                                    type="monotone"
                                    dataKey={func}
                                    stackId="1"
                                    stroke={colors[idx % colors.length]}
                                    fill={colors[idx % colors.length]}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Summary Table */}
            {summaryData.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-2">Média Salarial por Função</h2>
                    <table className="min-w-full text-sm text-left text-slate-600 border-collapse">
                        <thead className="bg-slate-100 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-4 py-2 border text-center">Função</th>
                                <th className="px-4 py-2 border text-center">Salário Médio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaryData.map((item) => (
                                <tr key={item.fu_sgla} className="hover:bg-slate-50">
                                    <td className="px-4 py-2 border text-center font-medium">{item.fu_sgla}</td>
                                    <td className="px-4 py-2 border text-center">{brMoney(item.sa_sala)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
