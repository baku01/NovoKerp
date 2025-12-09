import { useMemo, useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchStockBalance,
    fetchStockBalanceCommitted,
    fetchStockCost,
    fetchStockMovements,
} from './stockLegacyService';
import { format, subMonths } from 'date-fns';
import { brDecimal } from '../../utils/formatters';

interface StockInsightProps {
    defaultItemId?: number;
}

export function StockInsight({ defaultItemId }: StockInsightProps) {
    const empresa = useUserStore((state) => state.empresa);
    const [itemId, setItemId] = useState<number>(defaultItemId || 0);
    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);

    const [saldo, setSaldo] = useState<{ saldo?: number; saldo_empenhado?: number; ce_cust?: number } | null>(null);
    const [movs, setMovs] = useState<
        { mv_data: string; mv_tipo: string; mv_qtde: number; mv_obse?: string; ce_desc?: string }[]
    >([]);

    const balanceSummary = useMemo(() => {
        if (!saldo) return null;
        return {
            disponivel: saldo.saldo ?? 0,
            empenhado: saldo.saldo_empenhado ?? 0,
            custo: saldo.ce_cust ?? 0,
        };
    }, [saldo]);

    const handleLoad = async () => {
        if (!empresa || !itemId) {
            alert('Informe um ID de item (id_cest).');
            return;
        }
        try {
            setLoading(true);
            const [bal, emp, cost, mvts] = await Promise.all([
                fetchStockBalance(empresa, itemId),
                fetchStockBalanceCommitted(empresa, itemId),
                fetchStockCost(empresa, itemId),
                fetchStockMovements(empresa, format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), null, null),
            ]);
            setSaldo({
                saldo: bal[0]?.saldo,
                saldo_empenhado: emp[0]?.saldo_empenhado,
                ce_cust: cost[0]?.ce_cust,
            });
            setMovs(mvts || []);
        } catch (error) {
            console.error(error);
            alert('Erro ao consultar estoque.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Análise de Estoque</h2>
                <Button type="button" onClick={handleLoad} disabled={loading}>
                    {loading ? 'Carregando...' : 'Consultar'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                    label="ID Item (id_cest)"
                    type="number"
                    value={itemId || ''}
                    onChange={(e) => setItemId(parseInt(e.target.value) || 0)}
                    required
                />
                <Input
                    label="Data Inicial"
                    type="date"
                    value={format(startDate, 'yyyy-MM-dd')}
                    onChange={(e) => {
                        const [y, m, d] = e.target.value.split('-').map(Number);
                        setStartDate(new Date(y, m - 1, d));
                    }}
                />
                <Input
                    label="Data Final"
                    type="date"
                    value={format(endDate, 'yyyy-MM-dd')}
                    onChange={(e) => {
                        const [y, m, d] = e.target.value.split('-').map(Number);
                        setEndDate(new Date(y, m - 1, d));
                    }}
                />
            </div>

            {balanceSummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Stat label="Saldo Disponível" value={brDecimal(balanceSummary.disponivel)} />
                    <Stat label="Saldo Empenhado" value={brDecimal(balanceSummary.empenhado)} />
                    <Stat label="Custo Unitário" value={`R$ ${brDecimal(balanceSummary.custo)}`} />
                </div>
            )}

            <div>
                <h3 className="font-semibold text-slate-700 mb-2">Movimentações</h3>
                {loading ? (
                    <div className="text-slate-400 text-sm">Carregando movimentações...</div>
                ) : movs.length === 0 ? (
                    <div className="text-slate-400 text-sm">Sem movimentações no período.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="px-3 py-2 text-left">Data</th>
                                    <th className="px-3 py-2 text-left">Tipo</th>
                                    <th className="px-3 py-2 text-right">Qtde</th>
                                    <th className="px-3 py-2 text-left">Obs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movs.map((mv, idx) => (
                                    <tr key={idx} className="border-b border-slate-100">
                                        <td className="px-3 py-2">{mv.mv_data}</td>
                                        <td className="px-3 py-2">{mv.mv_tipo}</td>
                                        <td className="px-3 py-2 text-right">{brDecimal(mv.mv_qtde)}</td>
                                        <td className="px-3 py-2">{mv.mv_obse || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-xl font-semibold text-slate-800">{value}</div>
        </div>
    );
}
