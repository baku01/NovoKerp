import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { useUserStore } from "../../../stores/useUserStore";
import { fetchMenu } from "../authority/authorityService";
import { createMenu, deleteMenu } from "./menuService";

export function MenuManager() {
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        id_posi: "",
        mn_pare: "",
        mn_deno: "",
        mn_tela: "",
        mn_path: "",
        mn_tipo: "T",
    });

    const { data: menu = [] } = useQuery({
        queryKey: ["menu", empresa],
        queryFn: () => fetchMenu(empresa ?? "", null),
        enabled: !!empresa,
    });

    const createMutation = useMutation({
        mutationFn: () => createMenu(empresa ?? "", form),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu", empresa] });
            setForm({ id_posi: "", mn_pare: "", mn_deno: "", mn_tela: "", mn_path: "", mn_tipo: "T" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteMenu(empresa ?? "", id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu", empresa] }),
    });

    return (
        <div className="space-y-4">
            <header className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Catálogo de Menus</h2>
                <p className="text-sm text-slate-500">
                    Migrado de MobiTbMenu.js com criação/remoção de entradas do menu.
                </p>
            </header>

            <div className="bg-white border rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                        label="Posição"
                        value={form.id_posi}
                        onChange={(e) => setForm((prev) => ({ ...prev, id_posi: e.target.value }))}
                        placeholder="+0000000"
                        required
                    />
                    <Input
                        label="Pai"
                        value={form.mn_pare}
                        onChange={(e) => setForm((prev) => ({ ...prev, mn_pare: e.target.value }))}
                        placeholder="+0000000"
                    />
                    <Select
                        label="Tipo"
                        value={form.mn_tipo}
                        onChange={(e) => setForm((prev) => ({ ...prev, mn_tipo: e.target.value }))}
                        options={[
                            { value: "M", label: "Menu (agrupador)" },
                            { value: "L", label: "Link externo" },
                            { value: "T", label: "Tela" },
                        ]}
                    />
                </div>
                <Input
                    label="Título"
                    value={form.mn_deno}
                    onChange={(e) => setForm((prev) => ({ ...prev, mn_deno: e.target.value }))}
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                        label="Tela"
                        value={form.mn_tela}
                        onChange={(e) => setForm((prev) => ({ ...prev, mn_tela: e.target.value }))}
                        disabled={form.mn_tipo === "M"}
                    />
                    <Input
                        label="Path"
                        value={form.mn_path}
                        onChange={(e) => setForm((prev) => ({ ...prev, mn_path: e.target.value }))}
                        disabled={form.mn_tipo === "M"}
                    />
                </div>
                <Button type="button" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Salvando..." : "Salvar menu"}
                </Button>
            </div>

            <div className="bg-white border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Itens existentes</h3>
                <div className="divide-y">
                    {menu.map((item) => (
                        <div key={item.id_posi} className="flex items-center justify-between py-2">
                            <div>
                                <div className="text-sm font-medium text-slate-900">{item.mn_deno}</div>
                                <div className="text-xs text-slate-500">
                                    {item.id_posi} · {item.mn_tipo}
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => deleteMutation.mutate(item.id_posi)}
                                disabled={deleteMutation.isPending}
                            >
                                Remover
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
