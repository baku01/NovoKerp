import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchComment, insertComment } from './appointmentService';
import { useUserStore } from '../../stores/useUserStore';

interface Props {
    idClie: number;
    idOrds: number;
    date: Date;
}

export const AppointmentComments: React.FC<Props> = ({ idClie, idOrds, date }) => {
    const { empresa, user } = useUserStore();
    const [comment, setComment] = useState('');

    const { data: comments, isLoading } = useQuery({
        queryKey: ['appointment', 'comments', empresa, idClie, idOrds, date],
        queryFn: () => fetchComment(empresa, idClie, idOrds, date),
        enabled: !!empresa && idClie > 0 && idOrds > 0
    });

    useEffect(() => {
        if (comments && comments.length > 0) {
            setComment(comments[0].cm_desc);
        } else {
            setComment('');
        }
    }, [comments]);

    const mutation = useMutation({
        mutationFn: (newComment: string) => 
            insertComment(user?.id_user || '', empresa, idClie, idOrds, date, newComment),
        onSuccess: () => {
            alert('Comentário salvo com sucesso!');
        },
        onError: () => alert('Erro ao salvar comentário.')
    });

    const handleSave = () => {
        if (!comment.trim()) return;
        mutation.mutate(comment);
    };

    if (idClie === 0 || idOrds === 0) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-slate-700 mb-2">Comentários do Dia</h3>
            {isLoading ? (
                <div className="text-sm text-slate-400">Carregando...</div>
            ) : (
                <div className="space-y-2">
                    <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value.toUpperCase())}
                        placeholder="Insira um comentário para este dia..."
                    />
                    <div className="flex justify-end">
                        <button 
                            onClick={handleSave} 
                            disabled={mutation.isPending}
                            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded"
                        >
                            {mutation.isPending ? 'Salvando...' : 'Salvar Comentário'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
