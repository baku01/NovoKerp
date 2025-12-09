import { useState, useEffect } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useUserStore } from "../../stores/useUserStore";
import { callProcedure } from "../../api/procedures";
import { brDecimal } from "../../utils/formatters";

interface StockSearchResult {
    id_item: number;
    it_desc: string;
    it_unit: string;
    al_desc: string;
    st_qtde: number;
    st_vuni: number;
    st_vtot: number;
}

export function StockSearchForm() {
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || "";

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("0");
    const [results, setResults] = useState<StockSearchResult[]>([]);
    const [warehouses, setWarehouses] = useState<{ id_alma: number; al_desc: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        loadWarehouses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idEmpr]);

    const loadWarehouses = async () => {
        try {
            const params = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar" as const, pa_valo: idEmpr }];

            const result = await callProcedure<{ id_alma: number; al_desc: string }>("consultaAlmoxarifados", params);
            setWarehouses([{ id_alma: 0, al_desc: "TODOS" }, ...(result || [])]);
        } catch (error) {
            console.error("Erro ao carregar almoxarifados:", error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            alert("Digite um termo de busca");
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        try {
            const params = [
                { pa_nome: "lcIdEmpr", pa_tipo: "VarChar" as const, pa_valo: idEmpr },
                { pa_nome: "lcItDesc", pa_tipo: "VarChar" as const, pa_valo: searchTerm.trim().toUpperCase() },
                {
                    pa_nome: "lnIdAlma",
                    pa_tipo: "Int" as const,
                    pa_valo: parseInt(selectedWarehouse) || null,
                },
            ];

            const result = await callProcedure<StockSearchResult>("pesquisaPosicaoEstoque", params);
            setResults(result || []);
        } catch (error) {
            console.error("Erro ao pesquisar estoque:", error);
            alert("Erro ao pesquisar estoque");
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedWarehouse("0");
        setResults([]);
        setHasSearched(false);
    };

    const getTotalQuantity = () => {
        return results.reduce((sum, item) => sum + item.st_qtde, 0);
    };

    const getTotalValue = () => {
        return results.reduce((sum, item) => sum + item.st_vtot, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Pesquisa de Estoque</h1>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Descrição do Item</label>
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                                placeholder="Digite o nome ou código do item..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Almoxarifado</label>
                            <select
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {warehouses.map((wh) => (
                                    <option key={wh.id_alma} value={wh.id_alma}>
                                        {wh.al_desc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button type="submit" disabled={isSearching}>
                            {isSearching ? "Pesquisando..." : "Pesquisar"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleClear}>
                            Limpar
                        </Button>
                    </div>
                </form>

                {/* Results */}
                {hasSearched && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">
                                Resultados ({results.length} {results.length === 1 ? "item" : "itens"})
                            </h2>
                            {results.length > 0 && (
                                <div className="text-right">
                                    <div className="text-sm text-slate-300">
                                        Total: {brDecimal(getTotalQuantity())} itens
                                    </div>
                                    <div className="text-sm text-slate-300">Valor: R$ {brDecimal(getTotalValue())}</div>
                                </div>
                            )}
                        </div>

                        {results.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Item</th>
                                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                                                Almoxarifado
                                            </th>
                                            <th className="text-right py-3 px-4 text-slate-300 font-semibold">
                                                Quantidade
                                            </th>
                                            <th className="text-right py-3 px-4 text-slate-300 font-semibold">
                                                Valor Unit.
                                            </th>
                                            <th className="text-right py-3 px-4 text-slate-300 font-semibold">
                                                Valor Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="py-3 px-4 text-white">
                                                    <div className="font-medium">{item.it_desc}</div>
                                                    <div className="text-sm text-slate-400">Un: {item.it_unit}</div>
                                                </td>
                                                <td className="py-3 px-4 text-slate-200">{item.al_desc}</td>
                                                <td className="py-3 px-4 text-right text-white font-medium">
                                                    {brDecimal(item.st_qtde)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-slate-200">
                                                    R$ {brDecimal(item.st_vuni)}
                                                </td>
                                                <td className="py-3 px-4 text-right text-white font-semibold">
                                                    R$ {brDecimal(item.st_vtot)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-white/20 font-bold">
                                            <td colSpan={2} className="py-3 px-4 text-right text-white">
                                                TOTAL:
                                            </td>
                                            <td className="py-3 px-4 text-right text-white">
                                                {brDecimal(getTotalQuantity())}
                                            </td>
                                            <td className="py-3 px-4"></td>
                                            <td className="py-3 px-4 text-right text-white">
                                                R$ {brDecimal(getTotalValue())}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400">Nenhum item encontrado com os critérios informados</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
