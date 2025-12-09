import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { createParam } from "../../../api/procedures";
import { searchEntities } from "./searchService";
import { useUserStore } from "../../../stores/useUserStore";

type SearchKind = "users" | "clients" | "employees" | "materials" | "orders";

const SEARCH_CONFIG: Record<SearchKind, { procedure: string; paramName: string; label: string }> = {
    users: { procedure: "pesquisaUsuarios", paramName: "lcIdUser", label: "Usuário ou nome" },
    clients: { procedure: "pesquisaClientes", paramName: "lcClNome", label: "Cliente" },
    employees: { procedure: "pesquisaFuncionarios", paramName: "lcFuNome", label: "Funcionário" },
    materials: { procedure: "pesquisaMateriais", paramName: "lcDmDeno", label: "Material" },
    orders: { procedure: "pesquisaOrdensServico", paramName: "lcOsDesc", label: "OS" },
};

export function DirectorySearch() {
    const empresa = useUserStore((state) => state.empresa);
    const [kind, setKind] = useState<SearchKind>("users");
    const [term, setTerm] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const { data = [], isFetching } = useQuery({
        queryKey: ["directory-search", kind, term],
        enabled: submitted && term.length > 1,
        queryFn: () =>
            searchEntities({
                procedure: SEARCH_CONFIG[kind].procedure,
                params: [
                    createParam("lcIdEmpr", "VarChar", empresa),
                    createParam(SEARCH_CONFIG[kind].paramName, "VarChar", term.toUpperCase()),
                ],
            }),
    });

    return (
        <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
                <Select
                    label="Tipo de pesquisa"
                    value={kind}
                    onChange={(e) => setKind(e.target.value as SearchKind)}
                    options={[
                        { value: "users", label: "Usuários" },
                        { value: "clients", label: "Clientes" },
                        { value: "employees", label: "Funcionários" },
                        { value: "materials", label: "Materiais" },
                        { value: "orders", label: "Ordens de Serviço" },
                    ]}
                />
                <Input
                    label={SEARCH_CONFIG[kind].label}
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Digite para pesquisar"
                />
                <Button type="button" onClick={() => setSubmitted(true)} disabled={term.trim().length < 2}>
                    Buscar
                </Button>
            </div>

            <div className="bg-white border rounded-xl p-4 max-h-[320px] overflow-y-auto">
                {isFetching && <div className="text-sm text-slate-500">Buscando...</div>}
                {!isFetching && data.length === 0 && submitted && (
                    <div className="text-sm text-slate-500">Nenhum resultado encontrado.</div>
                )}
                <ul className="space-y-2">
                    {(data as unknown[]).map((item, idx: number) => (
                        <li key={idx} className="p-3 rounded-lg border">
                            <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                                {JSON.stringify(item, null, 2)}
                            </pre>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
