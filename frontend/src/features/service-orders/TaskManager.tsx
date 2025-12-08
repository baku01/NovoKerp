import { useState } from 'react';
import { useTasks, useUpdateRemainingDays } from './useTasks';
import { brDecimal } from '../../utils/formatters';
import type { Task } from './types';
import { Button } from '../../components/ui/Button';

interface TaskManagerProps {
    idOrds: number;
    osNume: string;
}

export function TaskManager({ idOrds, osNume }: TaskManagerProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const { data: tasks, isLoading } = useTasks(idOrds);
    const updateRemainingDays = useUpdateRemainingDays();

    const getTaskStatusColor = (task: Task): string => {
        if (task.ap_dres === 0) {
            return 'bg-green-500/25 border-green-500/50';
        } else if (task.ap_dres > 0) {
            return 'bg-red-500/25 border-red-500/50';
        } else if (task.at_dres === 0) {
            return 'bg-green-500/25 border-green-500/50';
        }
        return 'bg-white/5 border-white/20';
    };

    const getTaskStatusText = (task: Task): string => {
        if (task.ap_dres === 0) {
            return 'Finalizado';
        } else if (task.ap_dres > 0) {
            return `${brDecimal(task.ap_dres)} dias restantes`;
        } else if (task.at_dres === 0) {
            return 'Finalizado';
        } else if (task.at_dres > 0) {
            return `${brDecimal(task.at_dres)} dias restantes`;
        }
        return '';
    };

    const getTaskCode = (task: Task): string => {
        if (task.at_tipo === 'T' && task.ta_codi) {
            return task.ta_codi;
        }
        return task.id_ativ.toString();
    };

    const handleUpdateRemainingDays = async (task: Task) => {
        if (task.at_dres === 1000) {
            alert('Esta é uma atividade de marco/separador');
            return;
        }

        if (task.ap_dres === -1) {
            alert('Atividade sem apontamento');
            return;
        }

        const currentDays = task.ap_dres > 0 ? task.ap_dres : 0;
        const input = prompt('Dias restantes:', brDecimal(currentDays));

        if (input === null) return;

        try {
            const newDays = parseFloat(input.replace(/\./g, '').replace(',', '.'));

            if (isNaN(newDays) || newDays < 0) {
                alert('Valor inválido');
                return;
            }

            await updateRemainingDays.mutateAsync({
                idOrds: task.id_ords,
                idExcl: task.id_excl || 0,
                idAtiv: task.id_ativ,
                apDres: newDays,
            });

            alert('Dias restantes atualizados com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar dias restantes:', error);
            alert('Erro ao atualizar dias restantes');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Tarefas - OS {osNume}
                </h1>

                {/* Atividade Selecionada */}
                {selectedTask && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 mb-6">
                        <h3 className="text-sm text-slate-400 mb-1">Atividade Selecionada:</h3>
                        <p className="text-white font-medium">
                            {selectedTask.at_tipo === 'T' && selectedTask.ta_codi
                                ? `${selectedTask.ta_codi} - ${selectedTask.at_deno}`
                                : selectedTask.at_deno}
                        </p>
                    </div>
                )}

                {/* Lista de Tarefas */}
                <div className="space-y-3">
                    {tasks && tasks.length > 0 ? (
                        tasks.map((task) => {
                            const isMarco = task.at_dres === 1000;
                            const code = getTaskCode(task);
                            const statusText = getTaskStatusText(task);
                            const statusColor = getTaskStatusColor(task);

                            if (isMarco) {
                                return (
                                    <div
                                        key={task.id_ativ}
                                        className="bg-yellow-500/25 border border-yellow-500/50 rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-white font-bold">{code}</div>
                                                <div className="text-slate-200 font-semibold mt-1">
                                                    {task.at_deno}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={task.id_ativ}
                                    className={`rounded-lg border p-4 cursor-pointer transition-all hover:scale-[1.02] ${statusColor}`}
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <input
                                                type="radio"
                                                name="taskRadio"
                                                checked={selectedTask?.id_ativ === task.id_ativ}
                                                onChange={() => setSelectedTask(task)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <div className="flex-1">
                                                <div className="text-slate-200 font-medium">
                                                    {code} - {task.at_deno}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-300 text-sm">
                                                {statusText}
                                            </span>
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateRemainingDays(task);
                                                }}
                                                disabled={updateRemainingDays.isPending}
                                            >
                                                Atualizar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-lg">
                            <p className="text-slate-400">Nenhuma tarefa encontrada</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
