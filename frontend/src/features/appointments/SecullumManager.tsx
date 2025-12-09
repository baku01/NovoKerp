import { useMemo, useState } from 'react';
import { format, subDays } from 'date-fns';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useSecullumByWorksite, useSecullumHistory, useSecullumMutations } from './useSecullum';
import { useUserStore } from '../../stores/useUserStore';
import { fetchTransferWorksites } from '../transfers/stockService';
import { useQuery } from '@tanstack/react-query';
import { jsonDate } from '../../utils/formatters';

export function SecullumManager() {
    const [date, setDate] = useState<Date>(subDays(new Date(), 1));
    const [selectedWorksite, setSelectedWorksite] = useState<number>(0);
    const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
    const [manualForm, setManualForm] = useState({ hent: '', hiin: '', htin: '', hter: '', justification: '' });

    const empresa = useUserStore((state) => state.empresa);
    const user = useUserStore((state) => state.user);

    const worksitesQuery = useQuery({
        queryKey: ['secullum', 'worksites', empresa],
        queryFn: () => fetchTransferWorksites(empresa),
        enabled: !!empresa,
    });

    const { data: appointments = [], isLoading } = useSecullumByWorksite(selectedWorksite, date);
    const { data: history = [] } = useSecullumHistory(selectedEmployee, date);
    const { insertSecullum, deleteSecullum, isSaving, isDeleting } = useSecullumMutations();

    const employeesOptions = useMemo(() => {
        const unique = new Map<number, { id_matr: number; fu_nome: string }>();
        appointments.forEach((a) => unique.set(a.id_matr, { id_matr: a.id_matr, fu_nome: a.fu_nome }));
        return Array.from(unique.values());
    }, [appointments]);

    const handleManualInsert = async () => {
        if (!user || !selectedEmployee) return;
        await insertSecullum({
            employeeId: selectedEmployee,
            date,
            hent: Number(manualForm.hent) || 0,
            hiin: Number(manualForm.hiin) || 0,
            htin: Number(manualForm.htin) || 0,
            hter: Number(manualForm.hter) || 0,
            justification: manualForm.justification || 'AJUSTE MANUAL',
        });
        setManualForm({ hent: '', hiin: '', htin: '', hter: '', justification: '' });
    };

    const handleDelete = async (idApnt: number | undefined) => {
        if (!idApnt) return;
        await deleteSecullum(idApnt);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <h1 className="text-xl font-bold text-slate-800">Apontamentos Secullum</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select
                        label="Obra"
                        value={selectedWorksite || ''}
                        onChange={(e) => setSelectedWorksite(parseInt(e.target.value) || 0)}
                        options={[
                            { value: '', label: 'Selecione' },
                            ...(worksitesQuery.data || []).map((w) => ({ value: w.id_clie, label: w.cl_fant })),
                        ]}
                    />
                    <Input
                        type="date"
                        label="Data"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={(e) => {
                            if (e.target.value) {
                                const [y, m, d] = e.target.value.split('-').map(Number);
                                setDate(new Date(y, m - 1, d));
                            }
                        }}
                    />
                    <Select
                        label="Funcionário"
                        value={selectedEmployee || ''}
                        onChange={(e) => setSelectedEmployee(parseInt(e.target.value) || 0)}
                        options={[
                            { value: '', label: 'Selecione' },
                            ...employeesOptions.map((emp) => ({ value: emp.id_matr, label: `${emp.fu_nome} (${emp.id_matr})` })),
                        ]}
                    />
                    <div className="flex items-end">
                        <Button type="button" onClick={() => {}}>
                            Atualizar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Apontamentos</h2>
                    {isLoading ? (
                        <div className="text-slate-400 text-sm">Carregando...</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-slate-400 text-sm">Nenhum apontamento para os filtros.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-100 text-slate-600">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Func.</th>
                                        <th className="px-3 py-2">Entrada</th>
                                        <th className="px-3 py-2">Intervalo</th>
                                        <th className="px-3 py-2">Retorno</th>
                                        <th className="px-3 py-2">Saída</th>
                                        <th className="px-3 py-2">Situação</th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((ap) => (
                                        <tr key={`${ap.id_matr}-${ap.ap_data}`} className="border-b border-slate-100">
                                            <td className="px-3 py-2 text-left">{ap.fu_nome}</td>
                                            <td className="px-3 py-2 text-center">{ap.ap_hent}</td>
                                            <td className="px-3 py-2 text-center">{ap.ap_hiin}</td>
                                            <td className="px-3 py-2 text-center">{ap.ap_htin}</td>
                                            <td className="px-3 py-2 text-center">{ap.ap_hter}</td>
                                            <td className="px-3 py-2 text-center">{ap.ap_situ}</td>
                                            <td className="px-3 py-2 text-right">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="text-xs"
                                                    onClick={() => {
                                                        setSelectedEmployee(ap.id_matr);
                                                    }}
                                                >
                                                    Histórico
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow space-y-3">
                    <h2 className="text-lg font-semibold">Histórico / Ajuste Manual</h2>
                    {selectedEmployee ? (
                        <>
                            <div className="text-sm text-slate-500">
                                Histórico do funcionário #{selectedEmployee} na data {jsonDate(date.toISOString())}
                            </div>
                            <div className="bg-slate-50 border border-slate-100 rounded p-3 max-h-48 overflow-y-auto text-sm space-y-2">
                                {history.length === 0 ? (
                                    <div className="text-slate-400">Nenhum histórico.</div>
                                ) : (
                                    history.map((h, idx) => (
                                        <div key={idx} className="border-b border-slate-200 pb-2">
                                            <div className="font-semibold">{jsonDate(h.es_data)}</div>
                                            <div>Entrada: {h.es_hent} | Início: {h.es_hiin} | Retorno: {h.es_htin} | Saída: {h.es_hter}</div>
                                            <div>Justificativa: {h.es_just}</div>
                                            <div className="text-xs text-slate-500">Usuário: {h.id_user}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Input
                                    label="Entrada"
                                    value={manualForm.hent}
                                    onChange={(e) => setManualForm((f) => ({ ...f, hent: e.target.value }))}
                                    placeholder="Ex: 8.00"
                                />
                                <Input
                                    label="Início"
                                    value={manualForm.hiin}
                                    onChange={(e) => setManualForm((f) => ({ ...f, hiin: e.target.value }))}
                                    placeholder="Ex: 12.00"
                                />
                                <Input
                                    label="Retorno"
                                    value={manualForm.htin}
                                    onChange={(e) => setManualForm((f) => ({ ...f, htin: e.target.value }))}
                                    placeholder="Ex: 13.00"
                                />
                                <Input
                                    label="Saída"
                                    value={manualForm.hter}
                                    onChange={(e) => setManualForm((f) => ({ ...f, hter: e.target.value }))}
                                    placeholder="Ex: 17.00"
                                />
                            </div>
                            <Input
                                label="Justificativa"
                                value={manualForm.justification}
                                onChange={(e) => setManualForm((f) => ({ ...f, justification: e.target.value }))}
                                placeholder="Motivo do ajuste"
                            />
                            <div className="flex gap-2">
                                <Button type="button" onClick={handleManualInsert} disabled={isSaving || !user}>
                                    Salvar ajuste manual
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => history[0] && handleDelete((history[0] as unknown as { id_apnt?: number }).id_apnt)}
                                    disabled={isDeleting}
                                >
                                    Excluir último
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-400 text-sm">Selecione um funcionário para ver histórico e ajustar.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
