import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useUserStore } from "../../stores/useUserStore";
import { fetchUserLocations } from "./locationService";

export function LocationHistory() {
    const empresa = useUserStore((state) => state.empresa);
    const [userId, setUserId] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { data = [], isFetching } = useQuery({
        queryKey: ["location-history", userId, dateStart, dateEnd],
        enabled: submitted && !!empresa && userId.length > 0,
        queryFn: () => fetchUserLocations(empresa ?? "", userId, dateStart || undefined, dateEnd || undefined),
    });

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Histórico de Localização</h2>
                <p className="text-sm text-slate-500">
                    Migrado de MapaHsLoca.js — exibe timeline de coordenadas por usuário.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:items-end">
                <Input label="Usuário" value={userId} onChange={(e) => setUserId(e.target.value.toUpperCase())} />
                <Input
                    type="date"
                    label="Data inicial"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                />
                <Input type="date" label="Data final" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
                <Button type="button" onClick={() => setSubmitted(true)} disabled={!userId}>
                    Buscar
                </Button>
            </div>

            <div className="bg-white border rounded-xl p-4 max-h-[420px] overflow-y-auto">
                {isFetching && <div className="text-sm text-slate-500">Carregando...</div>}
                {!isFetching && data.length === 0 && submitted && (
                    <div className="text-sm text-slate-500">Nenhum registro encontrado.</div>
                )}
                <ul className="space-y-3">
                    {data.map((loc, idx) => (
                        <li key={`${loc.mp_data}-${idx}`} className="p-3 rounded-lg border">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900">
                                    {format(new Date(loc.mp_data), "dd/MM/yyyy HH:mm")}
                                </div>
                                <a
                                    className="text-xs text-blue-600 hover:underline"
                                    href={`https://www.google.com/maps/search/?api=1&query=${loc.mp_lati},${loc.mp_long}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Abrir no mapa
                                </a>
                            </div>
                            <div className="text-sm text-slate-700">
                                {loc.mp_ende}, {loc.mp_nume} — {loc.mp_cida}/{loc.mp_esta} CEP {loc.mp_ncep}
                            </div>
                            <div className="text-xs text-slate-500 uppercase">Por {loc.us_nome}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
