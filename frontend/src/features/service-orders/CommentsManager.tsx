import { useState } from 'react';
import { useComment, useServiceOrderSearch, useSaveComment } from './useComments';
import { getServiceOrderTypeName, type ServiceOrder } from './types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface CommentsManagerProps {
    obras: { id_clie: number; id_cadt: number; cl_fant: string }[];
}

interface CommentEditorProps {
    initialValue: string;
    onSave: (text: string) => void;
    onClear: () => void;
    isPending: boolean;
}

const CommentEditor = ({ initialValue, onSave, onClear, isPending }: CommentEditorProps) => {
    const [commentText, setCommentText] = useState(initialValue);

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Comentário
                </label>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.toUpperCase())}
                    className="w-full min-h-[120px] px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o comentário..."
                />
            </div>
            <div className="flex gap-3">
                <Button
                    onClick={() => onSave(commentText)}
                    disabled={!commentText.trim() || isPending}
                >
                    {isPending ? 'Salvando...' : 'Salvar Comentário'}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setCommentText('');
                        onClear();
                    }}
                >
                    Limpar
                </Button>
            </div>
        </>
    );
};

export function CommentsManager({ obras }: CommentsManagerProps) {
    const [selectedObra, setSelectedObra] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [osNume, setOsNume] = useState<string>('');
    const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null);

    const idClie = selectedObra ? parseInt(selectedObra.split('/')[0]) : 0;
    const idCadt = selectedObra ? parseInt(selectedObra.split('/')[1]) : 0;
    const idOrds = serviceOrder?.id_ords || 0;

    const { data: comment } = useComment(idClie, idOrds, selectedDate);
    const searchServiceOrder = useServiceOrderSearch();
    const saveComment = useSaveComment();

    const handleSearchServiceOrder = async () => {
        if (!osNume || !idCadt) {
            setServiceOrder(null);
            return;
        }

        try {
            const result = await searchServiceOrder.mutateAsync({ idCadt, osNume });
            if (result && result.length > 0) {
                setServiceOrder(result[0]);
            } else {
                setServiceOrder(null);
            }
        } catch (error) {
            console.error('Erro ao buscar ordem de serviço:', error);
            setServiceOrder(null);
        }
    };

    const handleSaveComment = async (text: string) => {
        if (!idClie || !idOrds || !selectedDate || !text.trim()) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            await saveComment.mutateAsync({
                idClie,
                idOrds,
                cmData: selectedDate,
                cmDesc: text.trim().toUpperCase(),
            });
            alert('Comentário salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar comentário:', error);
            alert('Erro ao salvar comentário');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Comentários de Ordem de Serviço</h1>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 space-y-4">
                    {/* Seleção de Obra */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Obra</label>
                        <select
                            value={selectedObra}
                            onChange={(e) => {
                                setSelectedObra(e.target.value);
                                setServiceOrder(null);
                                setOsNume('');
                            }}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Selecione uma obra</option>
                            {obras.map((obra) => (
                                <option
                                    key={`${obra.id_clie}/${obra.id_cadt}`}
                                    value={`${obra.id_clie}/${obra.id_cadt}`}
                                >
                                    {obra.cl_fant}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Data */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Data</label>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Número da OS */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Número da OS
                        </label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={osNume}
                                onChange={(e) => setOsNume(e.target.value.toUpperCase())}
                                onBlur={handleSearchServiceOrder}
                                placeholder="Digite o número da OS"
                            />
                        </div>
                    </div>

                    {/* Detalhes da OS */}
                    {serviceOrder && (
                        <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-slate-400">Tipo:</span>
                                    <p className="text-white font-medium">
                                        {getServiceOrderTypeName(serviceOrder.os_tipo)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-400">Responsável:</span>
                                    <p className="text-white font-medium">{serviceOrder.os_resp}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-400">Orçamento:</span>
                                    <p className="text-white font-medium">{serviceOrder.oc_nume}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-400">N° Cliente:</span>
                                    <p className="text-white font-medium">{serviceOrder.os_ncli}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-sm text-slate-400">N° Contrato:</span>
                                    <p className="text-white font-medium">{serviceOrder.os_ncon}</p>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-slate-400">Descrição:</span>
                                <p className="text-white font-medium mt-1">{serviceOrder.os_desc}</p>
                            </div>
                        </div>
                    )}

                    {/* Comentário */}
                    {serviceOrder && (
                        <CommentEditor
                            key={`${idClie}-${idOrds}-${selectedDate}`}
                            initialValue={comment?.cm_desc || ''}
                            onSave={handleSaveComment}
                            onClear={() => {
                                setServiceOrder(null);
                                setOsNume('');
                            }}
                            isPending={saveComment.isPending}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}