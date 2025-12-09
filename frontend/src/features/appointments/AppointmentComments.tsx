import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchComment, insertComment } from './appointmentService';
import { useUserStore } from '../../stores/useUserStore';

interface Props {
    idClie: number;
    idOrds: number;
    date: Date;
}

const CommentInput = ({ 
    initialValue, 
    onSave, 
    isPending 
}: { 
    initialValue: string; 
    onSave: (val: string) => void; 
    isPending: boolean; 
}) => {
    const [comment, setComment] = useState(initialValue);

    return (
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
                    onClick={() => onSave(comment)} 
                    disabled={isPending}
                    className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded"
                >
                    {isPending ? 'Salvando...' : 'Salvar Comentário'}
                </button>
            </div>
        </div>
    );
};

export const AppointmentComments: React.FC<Props> = ({ idClie, idOrds, date }) => {
    const { empresa, user } = useUserStore();

    const { data: comments, isLoading } = useQuery({
        queryKey: ['appointment', 'comments', empresa, idClie, idOrds, date],
        queryFn: () => fetchComment(empresa, idClie, idOrds, date),
        enabled: !!empresa && idClie > 0 && idOrds > 0
    });

    const mutation = useMutation({
        mutationFn: (newComment: string) => 
            insertComment(user?.id_user || '', empresa, idClie, idOrds, date, newComment),
        onSuccess: () => {
            alert('Comentário salvo com sucesso!');
        },
        onError: () => alert('Erro ao salvar comentário.')
    });

    if (idClie === 0 || idOrds === 0) return null;

    return (
        <div className="panel p-5">
            <h3 className="font-semibold text-slate-700 mb-2">Comentários do Dia</h3>
            {isLoading ? (
                <div className="text-sm text-slate-400">Carregando...</div>
            ) : (
                <CommentInput 
                    key={`${idClie}-${idOrds}-${date.toISOString()}`}
                    initialValue={comments && comments.length > 0 ? comments[0].cm_desc : ''}
                    onSave={(val) => mutation.mutate(val)}
                    isPending={mutation.isPending}
                />
            )}
        </div>
    );
};