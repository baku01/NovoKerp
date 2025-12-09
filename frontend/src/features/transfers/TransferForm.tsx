import { useMemo, useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useUserStore } from '../../stores/useUserStore';
import { TransferItemInput, TransferRequestInput, ReturnRequestInput } from './types';
import { createTransferRequest, createReturn } from './transferActions';
import { format } from 'date-fns';

interface TransferFormProps {
    mode: 'TRANSFER' | 'RETURN';
    worksites: { id_clie: number; cl_fant: string }[];
    onCreated?: () => void;
}

export function TransferForm({ mode, worksites, onCreated }: TransferFormProps) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const [worksiteId, setWorksiteId] = useState<number | null>(worksites[0]?.id_clie ?? null);
    const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<TransferItemInput[]>([
        { id_cest: 0, quantity: 0, unitCost: 0, motive: '' },
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const title = useMemo(
        () => (mode === 'TRANSFER' ? 'Nova Solicitação de Transferência' : 'Nova Devolução de Estoque'),
        [mode]
    );

    const addItem = () => {
        setItems([...items, { id_cest: 0, quantity: 0, unitCost: 0, motive: '' }]);
    };

    const updateItem = (index: number, patch: Partial<TransferItemInput>) => {
        const next = [...items];
        next[index] = { ...next[index], ...patch };
        setItems(next);
    };

    const removeItem = (index: number) => {
        if (items.length === 1) return;
        const next = [...items];
        next.splice(index, 1);
        setItems(next);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !empresa || !worksiteId) return;

        // Basic validation
        const validItems = items.filter((i) => i.id_cest && i.quantity > 0);
        if (!validItems.length) {
            alert('Inclua ao menos um item com quantidade válida.');
            return;
        }

        try {
            setIsSaving(true);

            if (mode === 'TRANSFER') {
                const payload: TransferRequestInput = {
                    worksiteId,
                    neededDate: date,
                    notes,
                    items: validItems,
                };
                await createTransferRequest(user.id_user, empresa, payload);
            } else {
                const payload: ReturnRequestInput = {
                    worksiteId,
                    returnDate: date,
                    notes,
                    items: validItems.map((i) => ({
                        id_cest: i.id_cest,
                        quantity: i.quantity,
                        unitCost: i.unitCost,
                        motive: i.motive,
                    })),
                };
                await createReturn(user.id_user, empresa, payload);
            }

            onCreated?.();
            setNotes('');
            setItems([{ id_cest: 0, quantity: 0, unitCost: 0, motive: '' }]);
            alert(mode === 'TRANSFER' ? 'Solicitação criada com sucesso.' : 'Devolução criada com sucesso.');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar. Verifique os campos e tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                <Button type="submit" disabled={isSaving || !user || !empresa}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    label="Obra"
                    value={worksiteId ?? ''}
                    onChange={(e) => setWorksiteId(parseInt(e.target.value) || null)}
                    options={worksites.map((w) => ({ value: w.id_clie, label: `${w.cl_fant}` }))}
                    placeholder="Selecione"
                    required
                />
                <Input
                    type="date"
                    label={mode === 'TRANSFER' ? 'Data Necessidade' : 'Data Devolução'}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <Input
                    label="Observações"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opcional"
                />
            </div>

            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border-b pb-3">
                        <Input
                            label="ID Item (id_cest)"
                            type="number"
                            value={item.id_cest || ''}
                            onChange={(e) => updateItem(idx, { id_cest: parseInt(e.target.value) || 0 })}
                            required
                        />
                        <Input
                            label="Quantidade"
                            type="number"
                            value={item.quantity || ''}
                            onChange={(e) => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })}
                            required
                            min={0}
                            step="0.01"
                        />
                        <Input
                            label="Custo Unit."
                            type="number"
                            value={item.unitCost || ''}
                            onChange={(e) => updateItem(idx, { unitCost: parseFloat(e.target.value) || 0 })}
                            min={0}
                            step="0.01"
                        />
                        <Input
                            label="Motivo"
                            value={item.motive || ''}
                            onChange={(e) => updateItem(idx, { motive: e.target.value })}
                            placeholder="Opcional"
                        />
                        <div className="flex gap-2">
                            {idx === items.length - 1 && (
                                <Button type="button" variant="secondary" onClick={addItem}>
                                    + Item
                                </Button>
                            )}
                            {items.length > 1 && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => removeItem(idx)}
                                    className="bg-red-100 text-red-600 hover:bg-red-200"
                                >
                                    Remover
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
}
