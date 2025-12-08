import { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUserStore } from '../../stores/useUserStore';
import { callProcedure } from '../../api/procedures';

interface StockEntryData {
    id_item: number;
    it_desc: string;
    it_qtde: number;
    it_unit: string;
    mv_tipo: string; // E=Entrada, S=Saída, T=Transferência
    id_alma: number; // Almoxarifado origem
    id_alde: number; // Almoxarifado destino (para transferências)
    mv_data: string;
    mv_obse: string;
}

interface StockEntryFormProps {
    onSubmit?: (data: StockEntryData) => void;
    onCancel?: () => void;
}

export function StockEntryForm({ onSubmit, onCancel }: StockEntryFormProps) {
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || '';

    const [formData, setFormData] = useState<StockEntryData>({
        id_item: 0,
        it_desc: '',
        it_qtde: 0,
        it_unit: 'UN',
        mv_tipo: 'E',
        id_alma: 0,
        id_alde: 0,
        mv_data: new Date().toISOString().split('T')[0],
        mv_obse: '',
    });

    const [items, setItems] = useState<{ id_item: number; it_desc: string }[]>([]);
    const [warehouses, setWarehouses] = useState<{ id_alma: number; al_desc: string }[]>([]);

    const searchItems = async (searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 2) return;

        try {
            const params = [
                { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
                { pa_nome: 'lcItDesc', pa_tipo: 'VarChar' as const, pa_valo: searchTerm },
            ];

            const result = await callProcedure<{ id_item: number; it_desc: string }>('pesquisaItens', params);
            setItems(result || []);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    };

    const loadWarehouses = async () => {
        try {
            const params = [
                { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
            ];

            const result = await callProcedure<{ id_alma: number; al_desc: string }>('consultaAlmoxarifados', params);
            setWarehouses(result || []);
        } catch (error) {
            console.error('Erro ao carregar almoxarifados:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id_item) {
            alert('Selecione um item');
            return;
        }

        if (formData.it_qtde <= 0) {
            alert('Quantidade deve ser maior que zero');
            return;
        }

        if (!formData.id_alma) {
            alert('Selecione um almoxarifado');
            return;
        }

        if (formData.mv_tipo === 'T' && !formData.id_alde) {
            alert('Para transferências, selecione o almoxarifado de destino');
            return;
        }

        if (formData.mv_tipo === 'T' && formData.id_alma === formData.id_alde) {
            alert('Almoxarifados de origem e destino devem ser diferentes');
            return;
        }

        try {
            const params = [
                { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
                { pa_nome: 'lnIdItem', pa_tipo: 'Int' as const, pa_valo: formData.id_item },
                { pa_nome: 'lnItQtde', pa_tipo: 'Decimal' as const, pa_valo: formData.it_qtde },
                { pa_nome: 'lcMvTipo', pa_tipo: 'VarChar' as const, pa_valo: formData.mv_tipo },
                { pa_nome: 'lnIdAlma', pa_tipo: 'Int' as const, pa_valo: formData.id_alma },
                { pa_nome: 'lnIdAlde', pa_tipo: 'Int' as const, pa_valo: formData.id_alde || null },
                { pa_nome: 'ldMvData', pa_tipo: 'SmallDatetime' as const, pa_valo: formData.mv_data },
                { pa_nome: 'lcMvObse', pa_tipo: 'VarChar' as const, pa_valo: formData.mv_obse },
            ];

            await callProcedure('insereMovimentoEstoque', params);

            alert('Movimento de estoque registrado com sucesso!');
            onSubmit?.(formData);

            // Reset form
            setFormData({
                id_item: 0,
                it_desc: '',
                it_qtde: 0,
                it_unit: 'UN',
                mv_tipo: 'E',
                id_alma: 0,
                id_alde: 0,
                mv_data: new Date().toISOString().split('T')[0],
                mv_obse: '',
            });
        } catch (error) {
            console.error('Erro ao registrar movimento:', error);
            alert('Erro ao registrar movimento de estoque');
        }
    };

    useState(() => {
        loadWarehouses();
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Lançamento de Estoque</h2>

            {/* Tipo de Movimento */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo de Movimento
                </label>
                <select
                    value={formData.mv_tipo}
                    onChange={(e) => setFormData({ ...formData, mv_tipo: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="E">Entrada</option>
                    <option value="S">Saída</option>
                    <option value="T">Transferência</option>
                </select>
            </div>

            {/* Data */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Data</label>
                <Input
                    type="date"
                    value={formData.mv_data}
                    onChange={(e) => setFormData({ ...formData, mv_data: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    required
                />
            </div>

            {/* Item */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Item *
                </label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={formData.it_desc}
                        onChange={(e) => {
                            setFormData({ ...formData, it_desc: e.target.value });
                            searchItems(e.target.value);
                        }}
                        placeholder="Digite para buscar..."
                        required
                    />
                </div>
                {items.length > 0 && (
                    <div className="mt-2 bg-slate-800 rounded-lg border border-slate-600 max-h-48 overflow-y-auto">
                        {items.map((item) => (
                            <div
                                key={item.id_item}
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        id_item: item.id_item,
                                        it_desc: item.it_desc,
                                    });
                                    setItems([]);
                                }}
                                className="p-2 hover:bg-slate-700 cursor-pointer text-white border-b border-slate-700 last:border-b-0"
                            >
                                {item.it_desc}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quantidade e Unidade */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Quantidade *
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.it_qtde || ''}
                        onChange={(e) =>
                            setFormData({ ...formData, it_qtde: parseFloat(e.target.value) || 0 })
                        }
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Unidade
                    </label>
                    <Input
                        type="text"
                        value={formData.it_unit}
                        onChange={(e) =>
                            setFormData({ ...formData, it_unit: e.target.value.toUpperCase() })
                        }
                        maxLength={3}
                    />
                </div>
            </div>

            {/* Almoxarifado Origem */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Almoxarifado {formData.mv_tipo === 'T' ? 'Origem' : ''} *
                </label>
                <select
                    value={formData.id_alma || ''}
                    onChange={(e) =>
                        setFormData({ ...formData, id_alma: parseInt(e.target.value) || 0 })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Selecione...</option>
                    {warehouses.map((wh) => (
                        <option key={wh.id_alma} value={wh.id_alma}>
                            {wh.al_desc}
                        </option>
                    ))}
                </select>
            </div>

            {/* Almoxarifado Destino (apenas para transferências) */}
            {formData.mv_tipo === 'T' && (
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Almoxarifado Destino *
                    </label>
                    <select
                        value={formData.id_alde || ''}
                        onChange={(e) =>
                            setFormData({ ...formData, id_alde: parseInt(e.target.value) || 0 })
                        }
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Selecione...</option>
                        {warehouses
                            .filter((wh) => wh.id_alma !== formData.id_alma)
                            .map((wh) => (
                                <option key={wh.id_alma} value={wh.id_alma}>
                                    {wh.al_desc}
                                </option>
                            ))}
                    </select>
                </div>
            )}

            {/* Observação */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Observação</label>
                <textarea
                    value={formData.mv_obse}
                    onChange={(e) =>
                        setFormData({ ...formData, mv_obse: e.target.value.toUpperCase() })
                    }
                    className="w-full min-h-[80px] px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações sobre o movimento..."
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <Button type="submit">Salvar Movimento</Button>
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    );
}
