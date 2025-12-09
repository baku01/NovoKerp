import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useEvaluations, useEvaluationWorksites } from './useEvaluations';
import { Evaluation } from './types';
import { brDecimal, jsonDate } from '../../utils/formatters';

type MetricKey =
    | 'av_orga'
    | 'av_prod'
    | 'av_qual'
    | 'av_disc'
    | 'av_falt'
    | 'av_celu'
    | 'av_aloj'
    | 'av_resc'
    | 'av_ferr';

const METRICS: { key: MetricKey; label: string }[] = [
    { key: 'av_orga', label: 'Organização' },
    { key: 'av_prod', label: 'Produtividade' },
    { key: 'av_qual', label: 'Qualidade' },
    { key: 'av_disc', label: 'Disciplina' },
    { key: 'av_falt', label: 'Faltas' },
    { key: 'av_celu', label: 'Uso de Celular' },
    { key: 'av_aloj', label: 'Alojamento' },
    { key: 'av_resc', label: 'Rescisão' },
    { key: 'av_ferr', label: 'Ferramentas' },
];

function calculateOverallScore(evaluation: Evaluation) {
    const values = METRICS.map((metric) => Number(evaluation[metric.key] || 0));
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export const EvaluationReport: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [worksiteId, setWorksiteId] = useState<number | null>(null);
    const [employeeName, setEmployeeName] = useState<string>('');

    const { evaluations, isLoading } = useEvaluations({
        startDate,
        endDate,
        worksiteId,
        employeeId: null,
        employeeName: employeeName || null,
    });

    const { worksites } = useEvaluationWorksites(startDate || undefined, endDate || undefined);

    const aggregated = useMemo(() => {
        if (!evaluations.length) {
            return {
                total: 0,
                employees: 0,
                worksites: 0,
                overallAvg: 0,
                metrics: METRICS.map((metric) => ({ ...metric, avg: 0 })),
                ranking: [] as { name: string; score: number; count: number }[],
                byWorksite: [] as { worksite: string; score: number; count: number }[],
            };
        }

        const employeeScores: Record<string, { sum: number; count: number }> = {};
        const worksiteScores: Record<string, { sum: number; count: number }> = {};

        const metricSums: Record<MetricKey, number> = METRICS.reduce(
            (acc, metric) => ({ ...acc, [metric.key]: 0 }),
            {} as Record<MetricKey, number>
        );

        for (const ev of evaluations) {
            const overall = calculateOverallScore(ev);

            METRICS.forEach((metric) => {
                metricSums[metric.key] += Number(ev[metric.key] || 0);
            });

            if (!employeeScores[ev.fu_nome]) {
                employeeScores[ev.fu_nome] = { sum: 0, count: 0 };
            }
            employeeScores[ev.fu_nome].sum += overall;
            employeeScores[ev.fu_nome].count += 1;

            const worksiteKey = ev.cl_fant || `Obra ${ev.id_clie}`;
            if (!worksiteScores[worksiteKey]) {
                worksiteScores[worksiteKey] = { sum: 0, count: 0 };
            }
            worksiteScores[worksiteKey].sum += overall;
            worksiteScores[worksiteKey].count += 1;
        }

        const total = evaluations.length;
        const metrics = METRICS.map((metric) => ({
            ...metric,
            avg: total > 0 ? metricSums[metric.key] / total : 0,
        }));

        const ranking = Object.entries(employeeScores)
            .map(([name, data]) => ({
                name,
                score: data.sum / data.count,
                count: data.count,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        const byWorksite = Object.entries(worksiteScores)
            .map(([worksite, data]) => ({
                worksite,
                score: data.sum / data.count,
                count: data.count,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        const overallAvg = evaluations.reduce((sum, ev) => sum + calculateOverallScore(ev), 0) / total;

        return {
            total,
            employees: Object.keys(employeeScores).length,
            worksites: Object.keys(worksiteScores).length,
            overallAvg,
            metrics,
            ranking,
            byWorksite,
        };
    }, [evaluations]);

    const handleDateChange = (setter: (value: Date | null) => void) => (value: string) => {
        if (!value) {
            setter(null);
            return;
        }
        const [y, m, d] = value.split('-').map(Number);
        setter(new Date(y, m - 1, d));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Relatório de Avaliações</h1>
                    <p className="text-slate-300">Consolidações e ranking de avaliações de funcionários</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Input
                        type="date"
                        label="Início"
                        value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => handleDateChange(setStartDate)(e.target.value)}
                        className="min-w-[150px]"
                    />
                    <Input
                        type="date"
                        label="Fim"
                        value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => handleDateChange(setEndDate)(e.target.value)}
                        className="min-w-[150px]"
                    />
                    <Select
                        label="Obra"
                        value={worksiteId ?? ''}
                        onChange={(e) => setWorksiteId(e.target.value ? parseInt(e.target.value) : null)}
                        options={[
                            { value: '', label: 'Todas as obras' },
                            ...worksites.map((ws) => ({
                                value: ws.id_clie,
                                label: `${ws.cl_fant} (${ws.id_clie})`,
                            })),
                        ]}
                        className="min-w-[200px]"
                    />
                    <Input
                        label="Nome do funcionário"
                        placeholder="Filtrar por nome..."
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        className="min-w-[200px]"
                    />
                    <Button
                        type="button"
                        disabled={isLoading}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Atualizar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-sm text-slate-300">Avaliações</div>
                    <div className="text-3xl font-bold">{aggregated.total}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-sm text-slate-300">Funcionários</div>
                    <div className="text-3xl font-bold">{aggregated.employees}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-sm text-slate-300">Obras</div>
                    <div className="text-3xl font-bold">{aggregated.worksites}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-sm text-slate-300">Média Geral</div>
                    <div className="text-3xl font-bold text-emerald-400">
                        {brDecimal(aggregated.overallAvg)}
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h2 className="text-xl font-semibold mb-4">Médias por Critério</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {aggregated.metrics.map((metric) => (
                        <div key={metric.key} className="bg-slate-900/40 border border-white/5 rounded-lg p-3">
                            <div className="text-sm text-slate-300">{metric.label}</div>
                            <div className="text-2xl font-semibold">{brDecimal(metric.avg)}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                    <h2 className="text-xl font-semibold">Top Funcionários</h2>
                    {aggregated.ranking.length === 0 ? (
                        <p className="text-slate-400 text-sm">Nenhuma avaliação encontrada.</p>
                    ) : (
                        <ul className="space-y-2">
                            {aggregated.ranking.map((item) => (
                                <li
                                    key={item.name}
                                    className="flex items-center justify-between bg-slate-900/40 border border-white/5 rounded-lg p-3"
                                >
                                    <div>
                                        <div className="font-semibold text-slate-100">{item.name}</div>
                                        <div className="text-xs text-slate-400">{item.count} avaliações</div>
                                    </div>
                                    <div className="text-xl font-bold text-emerald-400">
                                        {brDecimal(item.score)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                    <h2 className="text-xl font-semibold">Obras com melhor média</h2>
                    {aggregated.byWorksite.length === 0 ? (
                        <p className="text-slate-400 text-sm">Nenhuma avaliação encontrada.</p>
                    ) : (
                        <ul className="space-y-2">
                            {aggregated.byWorksite.map((item) => (
                                <li
                                    key={item.worksite}
                                    className="flex items-center justify-between bg-slate-900/40 border border-white/5 rounded-lg p-3"
                                >
                                    <div>
                                        <div className="font-semibold text-slate-100">{item.worksite}</div>
                                        <div className="text-xs text-slate-400">{item.count} avaliações</div>
                                    </div>
                                    <div className="text-xl font-bold text-blue-300">
                                        {brDecimal(item.score)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">Avaliações</h2>
                    <span className="text-slate-300 text-sm">{evaluations.length} registros</span>
                </div>
                {isLoading ? (
                    <div className="text-slate-400 text-sm">Carregando avaliações...</div>
                ) : evaluations.length === 0 ? (
                    <div className="text-slate-400 text-sm">Nenhuma avaliação encontrada com os filtros atuais.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr className="text-slate-300 border-b border-white/10">
                                    <th className="py-3 px-4">Data</th>
                                    <th className="py-3 px-4">Obra</th>
                                    <th className="py-3 px-4">Funcionário</th>
                                    <th className="py-3 px-4">Função</th>
                                    <th className="py-3 px-4">Média</th>
                                    <th className="py-3 px-4">Observações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluations.map((ev) => (
                                    <tr key={ev.id_aval} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4">{jsonDate(ev.av_data)}</td>
                                        <td className="py-3 px-4">{ev.cl_fant}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-slate-100">{ev.fu_nome}</div>
                                            <div className="text-xs text-slate-400">{ev.fu_empr}</div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-200">{ev.fu_func}</td>
                                        <td className="py-3 px-4 font-bold text-emerald-400">
                                            {brDecimal(calculateOverallScore(ev))}
                                        </td>
                                        <td className="py-3 px-4 text-slate-200 max-w-xs whitespace-pre-line">
                                            {ev.av_obse || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
