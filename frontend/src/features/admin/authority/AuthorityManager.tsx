import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useUserStore } from "../../../stores/useUserStore";
import { fetchAuthorities, fetchMenu, updateAuthorities, type MenuItem } from "./authorityService";

function buildTree(menu: MenuItem[]) {
    const byParent = new Map<string | null, MenuItem[]>();
    menu.forEach((item) => {
        const parent = item.mn_pare || null;
        if (!byParent.has(parent)) byParent.set(parent, []);
        byParent.get(parent)!.push(item);
    });
    return byParent;
}

export function AuthorityManager() {
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const { data: menu = [], isLoading: loadingMenu } = useQuery({
        queryKey: ["authority", "menu", empresa],
        queryFn: () => fetchMenu(empresa ?? "", null),
        enabled: !!empresa,
    });

    const authoritiesQuery = useQuery({
        queryKey: ["authority", "user", selectedUserId],
        queryFn: () => fetchAuthorities(empresa ?? "", selectedUserId),
        enabled: !!empresa && !!selectedUserId,
    });

    // React Query v5: onSuccess removido, usar useEffect
    useEffect(() => {
        if (authoritiesQuery.data) {
            setSelected(new Set(authoritiesQuery.data.map((a) => a.id_posi.trim().replace("M", "+"))));
        }
    }, [authoritiesQuery.data]);

    const tree = useMemo(() => buildTree(menu), [menu]);

    const mutation = useMutation({
        mutationFn: () => updateAuthorities(empresa ?? "", selectedUserId, Array.from(selected)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authority", "user", selectedUserId] });
        },
    });

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const renderChildren = (parent: string | null, depth = 0) => {
        const children = tree.get(parent) ?? [];
        return children.map((item) => (
            <div key={item.id_posi} className="flex items-center gap-2 py-1" style={{ marginLeft: depth * 16 }}>
                <input
                    type="checkbox"
                    checked={selected.has(item.id_posi)}
                    onChange={() => toggle(item.id_posi)}
                    className="h-4 w-4"
                />
                <span className="text-sm text-slate-800">
                    {item.mn_deno} {item.mn_tipo === "M" ? "(Menu)" : ""}
                </span>
                {renderChildren(item.id_posi, depth + 1)}
            </div>
        ));
    };

    return (
        <div className="space-y-4">
            <header className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Autoridade de Menu</h2>
                <p className="text-sm text-slate-500">
                    Migrado de MobiCdAutd.js: selecione um usuário e marque menus/telas permitidas.
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-3 md:items-end">
                <Input
                    label="Usuário"
                    placeholder="Informe o ID do usuário"
                    value={selectedUserId}
                    onChange={(e) => {
                        setSelectedUserId(e.target.value.toUpperCase());
                        if (!e.target.value) {
                            setSelected(new Set());
                        }
                    }}
                />
                <Button
                    type="button"
                    onClick={() => mutation.mutate()}
                    disabled={!selectedUserId || mutation.isPending || authoritiesQuery.isLoading}
                >
                    {mutation.isPending ? "Salvando..." : "Salvar autoridade"}
                </Button>
            </div>

            <div className="bg-white border rounded-xl p-4 max-h-[480px] overflow-y-auto">
                {loadingMenu ? <div className="text-sm text-slate-500">Carregando menus...</div> : renderChildren(null)}
            </div>
        </div>
    );
}
