import { useState, useMemo } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import { callProcedure } from '../../api/procedures';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { brDecimal, jsonDate } from '../../utils/formatters';
import { subMonths, format } from 'date-fns';

interface PurchaseReportData {
    id_pedc: number;
    pc_nume: string;
    pc_data: string;
    pc_stat: string;
    cl_fant: string;
    fo_raso: string;
    pc_vtot: number;
    pc_vape: number;
    pc_vsld: number;
    it_desc: string;
    pi_qtde: number;
    pi_vuni: number;
    pi_vtot: number;
}

export function PurchaseReport() {
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || '';

    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedWorksite, setSelectedWorksite] = useState<string>('0');
    const [selectedStatus, setSelectedStatus] = useState<string>('T');
    const [reportData, setReportData] = useState<PurchaseReportData[]>([]);
    const [worksites, setWorksites] = useState<{ id_cadt: number; cl_fant: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    useState(() => {
        loadWorksites();
    });

    const loadWorksites = async () => {
        try {
            const params = [
                { pa_nome: 'lcIdUser', pa_tipo: 'VarChar' as const, pa_valo: user?.id_user || '' },
                { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
            ];

            const result = await callProcedure<{ id_cadt: number; cl_fant: string }>('consultaObras', params);
            setWorksites([{ id_cadt: 0, cl_fant: 'TODAS' }, ...(result || [])]);
        } catch (error) {
            console.error('Erro ao carregar obras:', error);
        }
    };

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setHasGenerated(true);

        try {
            const params = [
                { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
                {
                    pa_nome: 'lnIdCadt',
                    pa_tipo: 'Int' as const,
                    pa_valo: parseInt(selectedWorksite) || null,
                },
                {
                    pa_nome: 'ldPcDtde',
                    pa_tipo: 'SmallDatetime' as const,
                    pa_valo: format(startDate, 'yyyy-MM-dd'),
                },
                {
                    pa_nome: 'ldPcDtat',
                    pa_tipo: 'SmallDatetime' as const,
                    pa_valo: format(endDate, 'yyyy-MM-dd'),
                },
                { pa_nome: 'lcPcStat', pa_tipo: 'VarChar' as const, pa_valo: selectedStatus },
            ];

            const result = await callProcedure<PurchaseReportData>('relatorioPedidosCompra', params);
            setReportData(result || []);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório');
            setReportData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const groupedData = useMemo(() => {
        const groups: { [key: string]: PurchaseReportData[] } = {};

        reportData.forEach((item) => {
            const key = item.pc_nume;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        return groups;
    }, [reportData]);

    const getTotalValue = () => {
        return Object.values(groupedData).reduce(
            (sum, items) => sum + (items[0]?.pc_vtot || 0),
            0
        );
    };

    const getTotalPending = () => {
        return Object.values(groupedData).reduce(
            (sum, items) => sum + (items[0]?.pc_vsld || 0),
            0
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Relatório de Pedidos de Compra</h1>

                {/* Filters */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Data Inicial
                            </label>
                            <Input
                                type="date"
                                value={format(startDate, 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [y, m, d] = e.target.value.split('-').map(Number);
                                        setStartDate(new Date(y, m - 1, d));
                                    }
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Data Final
                            </label>
                            <Input
                                type="date"
                                value={format(endDate, 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [y, m, d] = e.target.value.split('-').map(Number);
                                        setEndDate(new Date(y, m - 1, d));
                                    }
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Obra
                            </label>
                            <select
                                value={selectedWorksite}
                                onChange={(e) => setSelectedWorksite(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {worksites.map((ws) => (
                                    <option key={ws.id_cadt} value={ws.id_cadt}>
                                        {ws.cl_fant}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="T">TODOS</option>
                                <option value="P">PENDENTE</option>
                                <option value="A">APROVADO</option>
                                <option value="R">REPROVADO</option>
                                <option value="C">CANCELADO</option>
                                <option value="F">FINALIZADO</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button onClick={handleGenerateReport} disabled={isLoading}>
                            {isLoading ? 'Gerando...' : 'Gerar Relatório'}
                        </Button>
                    </div>
                </div>

                {/* Results */}
                {hasGenerated && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                        {Object.keys(groupedData).length > 0 ? (
                            <div className="space-y-6">
                                {/* Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-sm text-slate-400">Total de Pedidos</div>
                                        <div className="text-2xl font-bold text-white">
                                            {Object.keys(groupedData).length}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-sm text-slate-400">Valor Total</div>
                                        <div className="text-2xl font-bold text-green-400">
                                            R$ {brDecimal(getTotalValue())}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-sm text-slate-400">Saldo Pendente</div>
                                        <div className="text-2xl font-bold text-yellow-400">
                                            R$ {brDecimal(getTotalPending())}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed List */}
                                {Object.entries(groupedData).map(([pcNume, items]) => {
                                    const pedido = items[0];
                                    return (
                                        <div
                                            key={pcNume}
                                            className="bg-white/5 rounded-lg border border-white/20 p-4"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        Pedido #{pedido.pc_nume}
                                                    </h3>
                                                    <div className="text-sm text-slate-300 mt-1">
                                                        <span>Data: {jsonDate(pedido.pc_data)}</span>
                                                        <span className="mx-2">|</span>
                                                        <span>Obra: {pedido.cl_fant}</span>
                                                        <span className="mx-2">|</span>
                                                        <span>Fornecedor: {pedido.fo_raso}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                            pedido.pc_stat === 'A'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : pedido.pc_stat === 'P'
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : pedido.pc_stat === 'R'
                                                                ? 'bg-red-500/20 text-red-400'
                                                                : 'bg-slate-500/20 text-slate-400'
                                                        }`}
                                                    >
                                                        {pedido.pc_stat}
                                                    </span>
                                                    <div className="text-lg font-bold text-white mt-2">
                                                        R$ {brDecimal(pedido.pc_vtot)}
                                                    </div>
                                                    <div className="text-sm text-slate-400">
                                                        Saldo: R$ {brDecimal(pedido.pc_vsld)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items Table */}
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-white/20">
                                                            <th className="text-left py-2 px-3 text-slate-300 text-sm">
                                                                Item
                                                            </th>
                                                            <th className="text-right py-2 px-3 text-slate-300 text-sm">
                                                                Qtde
                                                            </th>
                                                            <th className="text-right py-2 px-3 text-slate-300 text-sm">
                                                                Valor Unit.
                                                            </th>
                                                            <th className="text-right py-2 px-3 text-slate-300 text-sm">
                                                                Valor Total
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, idx) => (
                                                            <tr
                                                                key={idx}
                                                                className="border-b border-white/10"
                                                            >
                                                                <td className="py-2 px-3 text-slate-200 text-sm">
                                                                    {item.it_desc}
                                                                </td>
                                                                <td className="py-2 px-3 text-right text-white text-sm">
                                                                    {brDecimal(item.pi_qtde)}
                                                                </td>
                                                                <td className="py-2 px-3 text-right text-slate-200 text-sm">
                                                                    R$ {brDecimal(item.pi_vuni)}
                                                                </td>
                                                                <td className="py-2 px-3 text-right text-white text-sm font-semibold">
                                                                    R$ {brDecimal(item.pi_vtot)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400">
                                    Nenhum pedido encontrado com os filtros selecionados
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
