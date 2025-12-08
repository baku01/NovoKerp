import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { format } from 'date-fns';
import { useWorksites } from '../stock-position/useStockPosition'; // Reuse worksites hook
import { useServiceOrders, useEmployees } from '../stock-position/useStockPosition'; // Reuse these hooks too
import { useStockItems, useStockMovementMutation } from './useStockMovement';
import { StockMovementHeader, StockMovementItem } from './types';
import { brDecimal, brMoney } from '../../utils/formatters';
import { StockPhotoCapture } from './StockPhotoCapture'; // Import StockPhotoCapture
import { uploadStockMovementPhoto } from './stockMovementService'; // Import uploadStockMovementPhoto

export const StockMovementForm: React.FC = () => {
    // Header State
    const [type, setType] = useState<'E' | 'S'>('S'); // Default Exit
    const [date, setDate] = useState<Date>(new Date());
    const [worksiteId, setWorksiteId] = useState<string>('0');

    // De/Para Context
    const [context, setContext] = useState<'F' | 'P'>('F'); // Funcionario or Proposta
    const [employeeId, setEmployeeId] = useState<string>('0'); // id_empr/id_matr
    const [orderId, setOrderId] = useState<string>('0'); // id_ords
    const [costWorksiteId, setCostWorksiteId] = useState<string>('0'); // id_clie for cost

    const [observation, setObservation] = useState('');
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null); // New state for captured photo
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false); // New state for photo upload status

    // Items State
    const [items, setItems] = useState<StockMovementItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch dependencies
    // Use 'A' (Asset/Position) mode for single date queries which maps to legacy `pesquisaObrasDefinidas` and `pesquisaFuncionarios`
    const { worksites } = useWorksites({ type: 'A', date });

    // Employees and Orders depend on the selected worksite (id_cadt part)
    const idCadt = parseInt(worksiteId.split('/')[1]) || 0;
    const realWorksiteId = parseInt(worksiteId.split('/')[0]) || 0;

    const { employees } = useEmployees(idCadt, { type: 'A', date });
    const { orders } = useServiceOrders(idCadt);

    // Fetch Items Logic
    // We fetch items when we have enough header info.
    const header: StockMovementHeader = {
        id_clie: realWorksiteId,
        mv_tpme: type,
        mv_data: format(date, 'yyyy-MM-dd'),
        mv_dpar: context,
        id_empr_func: context === 'F' ? employeeId.split('/')[0] : undefined,
        id_matr_func: context === 'F' ? (parseInt(employeeId.split('/')[1]) || 0) : undefined,
        id_ords: context === 'P' ? (parseInt(orderId) || 0) : undefined,
        id_clie_cost: context === 'F' ? (parseInt(costWorksiteId.split('/')[0]) || 0) : undefined,
        mv_obse: observation
    };

    // Only fetch if valid
    const isValidHeader = realWorksiteId > 0 &&
        ((context === 'F' && header.id_matr_func! > 0 && (type === 'S' ? header.id_clie_cost! > 0 : true)) ||
         (context === 'P' && header.id_ords! > 0));

    const { items: fetchedItems, isLoading: loadingItems } = useStockItems(header, isValidHeader);
    const { saveMovement, isSaving } = useStockMovementMutation();

    // Sync fetched items to local state to allow editing
    useEffect(() => {
        if (fetchedItems && fetchedItems.length > 0) {
            // Merge logic: preserve existing local edits if any?
            // For simplicity, we replace or merge based on ID.
            // If user has edited mv_qtde, keep it.
            setItems(prev => {
                const newItems = fetchedItems.map(fetched => {
                    const existing = prev.find(p => p.id_cest === fetched.id_cest);
                    return existing ? { ...fetched, mv_qtde: existing.mv_qtde, mv_motv: existing.mv_motv } : { ...fetched, mv_qtde: 0 };
                });
                return newItems;
            });
        }
    }, [fetchedItems]);

    const handleQtyChange = (id: number, qty: number) => {
        setItems(prev => prev.map(i => i.id_cest === id ? { ...i, mv_qtde: qty } : i));
    };

    const handleSave = async () => {
        if (!isValidHeader) {
            alert("Preencha todos os campos obrigatórios do cabeçalho.");
            return;
        }

        const itemsToMove = items.filter(i => i.mv_qtde > 0);
        if (itemsToMove.length === 0) {
            alert("Nenhum item com quantidade maior que zero selecionado.");
            return;
        }

        // Handle photo upload if a photo is captured
        if (capturedPhoto && context === 'F' && header.id_empr_func && header.id_matr_func) {
            setIsUploadingPhoto(true);
            try {
                const lcFuEmpr = header.id_empr_func.trim().toUpperCase();
                const lcFuMatr = header.id_matr_func.toString();
                const workPath = `facial/${lcFuEmpr}${lcFuMatr}/`;
                const fileName = `${lcFuEmpr}${lcFuMatr}.png`;
                
                await uploadStockMovementPhoto(capturedPhoto, workPath, fileName);
                alert("Foto salva com sucesso!");
                    } catch (photoError: unknown) {
                        console.error("Erro ao salvar a foto:", photoError);
                        alert("Erro ao salvar a foto. A movimentação não será salva.");
                        setIsUploadingPhoto(false);
                        return; // Prevent stock movement save if photo upload fails
                    } finally {
                        setIsUploadingPhoto(false);
                    }
                } else if (capturedPhoto) {
                    alert("Não é possível associar a foto sem um funcionário válido no contexto 'Funcionário'. A movimentação não será salva.");
                    return; // Prevent stock movement save if photo is captured but context is wrong
                }
            
            
                // Geolocation
                let lat = '', long = '';
                if (navigator.geolocation) {
                    try {
                        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                        });
                        lat = pos.coords.latitude.toString();
                        long = pos.coords.longitude.toString();
                    } catch (e: unknown) {
                        console.warn("Geolocation failed or denied", e);
                    }
                }
        try {
            await saveMovement({ // Pass only payload here
                ...header,
                mv_lati: lat,
                mv_long: long,
                items: itemsToMove
            });
            alert("Movimentação salva com sucesso!");
            // Reset form or navigate
            setItems(prev => prev.map(i => ({ ...i, mv_qtde: 0 })));
            setObservation('');
            setCapturedPhoto(null); // Clear captured photo after successful save
        } catch (err: unknown) { // Changed to unknown
            alert(`Erro ao salvar: ${(err as Error).message || 'Desconhecido'}`);
        }
    };

    // Filter items by search
    const filteredItems = items.filter(i =>
        i.ce_deno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.ce_codi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalQty = items.reduce((acc, i) => acc + i.mv_qtde, 0);
    const totalCost = items.reduce((acc, i) => acc + (i.mv_qtde * i.mv_pcus || i.mv_qtde * i.ce_vcus), 0);

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <h1 className="text-xl font-bold text-slate-800">Movimentação de Estoque</h1>

            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                    label="Tipo"
                    options={[{ value: 'E', label: 'ENTRADA' }, { value: 'S', label: 'SAÍDA' }]}
                    value={type}
                    onChange={(e) => setType(e.target.value as 'E' | 'S')}
                />
                <Input
                    type="date"
                    label="Data"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => e.target.value && setDate(new Date(e.target.value))}
                />
                <Select
                    label="Obra"
                    options={[{ value: '0', label: 'Selecione...' }, ...worksites.map(w => ({ value: `${w.id_clie}/${w.id_cadt}`, label: w.cl_fant }))]}
                    value={worksiteId}
                    onChange={(e) => setWorksiteId(e.target.value)}
                />
                <Select
                    label="Destino/Origem"
                    options={[{ value: 'F', label: 'FUNCIONÁRIO' }, { value: 'P', label: 'PROPOSTA' }]}
                    value={context}
                    onChange={(e) => setContext(e.target.value as 'F' | 'P')}
                />

                {context === 'F' && (
                    <>
                        <div className="lg:col-span-2">
                            <Select
                                label="Funcionário"
                                options={[{ value: '0', label: 'Selecione...' }, ...employees.map(e => ({ value: `${e.fu_empr}/${e.id_matr}`, label: e.fu_nome }))]}
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                disabled={worksiteId === '0'}
                            />
                        </div>
                        {/* Cost Center Worksite needed for Exit to Employee? Legacy `lliClcuCMM` shows `sltClcuCMM` if "REAL" work type? Or based on logic.
                            Legacy: "if (loSlClie...startsWith('REAL')) { loLiClcu.style.display = '' }"
                            Let's show it always for simplicity or replicate logic.
                            If 'F', we usually need to know where the cost goes.
                        */}
                        <Select
                            label="Obra Custo (Se Saída)"
                            options={[{ value: '0', label: 'Selecione...' }, ...worksites.map(w => ({ value: `${w.id_clie}/${w.id_cadt}`, label: w.cl_fant }))]}
                            value={costWorksiteId}
                            onChange={(e) => setCostWorksiteId(e.target.value)}
                            disabled={type !== 'S'} // Only needed for Exit?
                        />
                    </>
                )}

                {context === 'P' && (
                    <div className="lg:col-span-2">
                        <Select
                            label="Proposta (OS)"
                            options={[{ value: '0', label: 'Selecione...' }, ...orders.map(o => ({ value: o.id_ords, label: `${o.os_nume} - ${o.os_desc}` }))]}
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            disabled={worksiteId === '0'}
                        />
                    </div>
                )}

                <div className="lg:col-span-4">
                    <Input
                        label="Observação"
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                    />
                </div>
            </div>

            {/* Photo Capture */}
            {context === 'F' && ( // Only show photo capture if context is employee
                <StockPhotoCapture onCapture={setCapturedPhoto} currentPhoto={capturedPhoto} />
            )}

            {/* Items */}
            <div className="bg-white p-4 rounded-lg shadow flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Itens ({items.filter(i => i.mv_qtde > 0).length})</h2>
                    <Input
                        placeholder="Filtrar itens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                </div>

                {loadingItems ? (
                    <div className="text-center py-8">Carregando itens...</div>
                ) : !isValidHeader ? (
                    <div className="text-center py-8 text-slate-500">Selecione Obra, Funcionário/Proposta para carregar itens.</div>
                ) : (
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-slate-100 text-left">
                                    <th className="p-2">Código</th>
                                    <th className="p-2">Descrição</th>
                                    <th className="p-2 text-right">Estoque</th>
                                    <th className="p-2 text-center w-32">Movimento</th>
                                    <th className="p-2 text-right">Custo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredItems.map(item => {
                                    const stock = item.en_qtde - item.sa_qtde - item.de_qtde;
                                    const isActive = item.mv_qtde > 0;
                                    return (
                                        <tr key={item.id_cest} className={isActive ? 'bg-blue-50' : ''}>
                                            <td className="p-2">{item.ce_codi}</td>
                                            <td className="p-2">
                                                <div className="font-medium">{item.ce_deno}</div>
                                                <div className="text-xs text-slate-500">{item.ce_espt}</div>
                                            </td>
                                            <td className="p-2 text-right font-mono">{brDecimal(stock)}</td>
                                            <td className="p-2">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        className="w-8 h-8 bg-slate-200 rounded hover:bg-slate-300 font-bold"
                                                        onClick={() => handleQtyChange(item.id_cest, Math.max(0, item.mv_qtde - 1))}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="w-16 text-center border rounded p-1"
                                                        value={item.mv_qtde}
                                                        onChange={(e) => handleQtyChange(item.id_cest, parseFloat(e.target.value) || 0)}
                                                    />
                                                    <button
                                                        className="w-8 h-8 bg-slate-200 rounded hover:bg-slate-300 font-bold"
                                                        onClick={() => handleQtyChange(item.id_cest, item.mv_qtde + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-2 text-right">
                                                {brMoney((item.mv_qtde * (item.mv_pcus || item.ce_vcus)))}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm">
                        Total Qtd: <b>{brDecimal(totalQty)}</b> | Total Custo: <b>{brMoney(totalCost)}</b>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isUploadingPhoto || totalQty === 0}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-slate-300 font-bold"
                    >
                        {isSaving || isUploadingPhoto ? 'Salvando...' : 'Salvar Movimentação'}
                    </button>
                </div>
            </div>
        </div>
    );
};
