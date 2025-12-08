import React from 'react';
import { AppointmentActivity, TaskUpdateInput } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskDays } from './appointmentService';
import { useUserStore } from '../../stores/useUserStore';
import { brDecimal } from '../../utils/formatters';

interface Props {
    activities: AppointmentActivity[];
    selectedActivityId: string; // Can be id_ativ or id_excl based on type, managed by parent
    idOrds: number;
    onSelect: (activity: AppointmentActivity) => void;
}

export const ActivitySelector: React.FC<Props> = ({ activities, selectedActivityId, idOrds, onSelect }) => {
    const empresa = useUserStore(state => state.empresa);
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (input: TaskUpdateInput) => updateTaskDays(empresa, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointment', 'activities'] });
        }
    });

    const handleEdit = (e: React.MouseEvent, activity: AppointmentActivity) => {
        e.stopPropagation();
        const currentDays = activity.ap_dres ?? activity.at_dres ?? 0;
        const newDays = prompt("Dias Restantes:", brDecimal(currentDays));
        if (newDays !== null) {
            const parsed = parseFloat(newDays.replace(',', '.'));
            if (!isNaN(parsed) && parsed >= 0) {
                updateMutation.mutate({
                    id_ords: idOrds,
                    id_excl: activity.at_tipo === 'T' ? activity.id_excl || 0 : 0,
                    id_ativ: activity.at_tipo === 'A' ? activity.id_ativ || 0 : 0,
                    ap_dres: parsed
                });
            }
        }
    };

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-white">
            <ul className="divide-y divide-slate-100">
                {activities.map(activity => {
                    // Logic for matching selected ID is a bit tricky since we usually just pass one ID.
                    // Let's assume parent manages ID.
                    const isSelected = activity.id_ativ.toString() === selectedActivityId; 
                    
                    // Legacy Coloring
                    const days = activity.ap_dres ?? activity.at_dres ?? 0;
                    let bgClass = '';
                    let statusText = '';

                    if (days === 0) {
                        bgClass = 'bg-green-50';
                        statusText = 'Finalizado';
                    } else if (days > 0) {
                        bgClass = 'bg-red-50';
                        statusText = `${brDecimal(days)} dias restantes`;
                    } else if (days === 1000) { // Legacy magic number
                         bgClass = 'bg-yellow-50';
                    }

                    return (
                        <li 
                            key={`${activity.id_ativ}-${activity.at_tipo}`}
                            className={`p-3 cursor-pointer hover:opacity-90 flex justify-between items-center ${isSelected ? 'bg-blue-100' : bgClass}`}
                            onClick={() => onSelect(activity)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-slate-400'}`}>
                                    {isSelected && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800">
                                        {activity.ta_codi ? `${activity.ta_codi} - ` : ''}{activity.at_deno}
                                    </div>
                                    {statusText && <div className="text-xs text-slate-500">{statusText}</div>}
                                </div>
                            </div>
                            
                            <button 
                                onClick={(e) => handleEdit(e, activity)}
                                className="text-slate-400 hover:text-blue-600 p-1"
                                title="Atualizar Dias Restantes"
                            >
                                ✎
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
