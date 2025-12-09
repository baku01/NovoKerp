import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useUserStore } from "../../../stores/useUserStore";
import { fetchNotifications, updateNotification, type NotificationItem } from "./notificationService";

export function NotificationCenter() {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();
    const [dateStart, setDateStart] = useState<string>("");
    const [dateEnd, setDateEnd] = useState<string>("");
    const [onlyUnread, setOnlyUnread] = useState(true);

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ["notifications", user?.id_user, empresa, dateStart, dateEnd, onlyUnread],
        queryFn: () =>
            fetchNotifications(user?.id_user ?? "", empresa ?? "", {
                read: onlyUnread ? true : undefined,
                startDate: dateStart || null,
                endDate: dateEnd || null,
            }),
        enabled: !!user && !!empresa,
    });

    const mutation = useMutation({
        mutationFn: (payload: { id: number; markAsRead: boolean }) =>
            updateNotification(user?.id_user ?? "", empresa ?? "", payload.id, payload.markAsRead),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const toggleRead = (notification: NotificationItem) => {
        mutation.mutate({
            id: notification.id_note,
            markAsRead: notification.no_read === 0,
        });
    };

    return (
        <div className="space-y-4">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Notificações</h2>
                    <p className="text-sm text-slate-500">Migrado de UtilCdNtfy.js com filtros e marcação de lido.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Input
                        type="date"
                        label="Data inicial"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        max={dateEnd || format(new Date(), "yyyy-MM-dd")}
                    />
                    <Input
                        type="date"
                        label="Data final"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        min={dateStart}
                        max={format(new Date(), "yyyy-MM-dd")}
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={onlyUnread}
                            onChange={(e) => setOnlyUnread(e.target.checked)}
                        />
                        Somente não lidas
                    </label>
                    <Button type="button" onClick={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })}>
                        Atualizar
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow divide-y">
                {isLoading && <div className="p-4 text-sm text-slate-500">Carregando notificações...</div>}
                {!isLoading && notifications.length === 0 && (
                    <div className="p-4 text-sm text-slate-500">Nenhuma notificação encontrada.</div>
                )}
                {notifications.map((item) => (
                    <article
                        key={item.id_note}
                        className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                        <div>
                            <div className="text-sm text-slate-500">
                                {format(new Date(item.no_dthr), "dd/MM/yyyy HH:mm")}
                            </div>
                            <div className="text-base font-semibold text-slate-900">{item.no_text}</div>
                            <div className="text-xs text-slate-500 uppercase">Enviado por {item.no_user}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                    item.no_read > 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                }`}
                            >
                                {item.no_read > 0 ? "Lida" : "Não lida"}
                            </span>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => toggleRead(item)}
                                disabled={mutation.isPending}
                            >
                                {item.no_read > 0 ? "Marcar como não lida" : "Marcar como lida"}
                            </Button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
