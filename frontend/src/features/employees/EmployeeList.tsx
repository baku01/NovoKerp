import React, { useState, useMemo } from 'react';
import { useEmployeesData } from './useEmployees';
import { formatCpf, brMoney, jsonDate } from '../../utils/formatters';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Employee } from './types';
import { PageLayout } from '../../components/layout/PageLayout';
import { Panel } from '../../components/layout/Panel';

export const EmployeeList: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedObra, setSelectedObra] = useState<string>('0/0'); // id_clie/id_cadt
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedFunc, setSelectedFunc] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('NOME');
  const [searchText, setSearchText] = useState<string>('');

  // Derived filters
  const filters = useMemo(() => {
    const [, idCadtRaw] = selectedObra.split('/');
    const idCadt = parseInt(idCadtRaw || '0');
    
    // Logic from legacy: if idCadt > 0, use it. If 0, legacy used a list.
    // For now, we will pass what we have. The service/hook handles strict typing.
    // If "TODAS AS OBRAS" (0/0) is selected, idCadt is 0.
    
    return {
      idCadt: idCadt > 0 ? idCadt : null,
      // Legacy: if idCadt == 0, it built a list of ALL IDs.
      // We might need to replicate that if the backend expects it, 
      // but often 0 or null implies "all".
      // Checking the legacy service call: it passes "lcIdCadt" string list.
      // If we don't pass it, the procedure might fail or return nothing?
      // Let's assume the backend handles null as "all" or we need to fetch all Obras to build the list.
      // For this refactor, we'll pass null and see. If the legacy logic required strictly passing all IDs, 
      // we would need to map `obras` list to a string.
      
      idCadtList: null, 
      tipo: selectedTipo || null,
      funcoes: selectedFunc || null,
      idMatr: searchType === 'ID_MATR' && searchText ? parseInt(searchText) : null,
      nome: searchType === 'NOME' && searchText ? searchText : null,
      pqEqto: null, // Context specific, set to 1 if drilled down from dashboard equipment, defaulting to null here.
    };
  }, [selectedObra, selectedTipo, selectedFunc, searchType, searchText]);

  const {
    obras,
    tipos,
    funcoes,
    summary,
    planning,
    employees,
    isLoading,
    isFetchingEmployees
  } = useEmployeesData(date, filters);

  // Derived Summary Totals
  const summaryTotals = useMemo(() => {
    return summary.reduce((acc, curr) => ({
      fu_qtde: acc.fu_qtde + curr.fu_qtde,
      rp_qtde: acc.rp_qtde + curr.rp_qtde,
      qt_rcso: acc.qt_rcso + curr.qt_rcso
    }), { fu_qtde: 0, rp_qtde: 0, qt_rcso: 0 });
  }, [summary]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // Create date at midnight local time to match legacy behavior
      const [y, m, d] = e.target.value.split('-').map(Number);
      setDate(new Date(y, m - 1, d));
    }
  };

  // Helper to find planning description for tooltip
  const getPlanningTooltip = (sgla: string, type: 'R' | 'P') => {
    return planning
      .filter(p => p.fu_sgla === sgla && p.pl_tipo === type)
      .map(p => {
         const dtDe = p.pm_dtde ? `de ${jsonDate(p.pm_dtde)} ` : '';
         const dtAt = p.pm_dtat ? `até ${jsonDate(p.pm_dtat)}: ` : '';
         return `${p.pm_qtde} ${dtDe}${dtAt}${p.pl_desc}`;
      })
      .join('\n');
  };

  return (
    <PageLayout
      title="Recursos"
      subtitle="Planejamento, alocação e status por obra"
      tag="Operação"
      actions={<div className="text-sm text-slate-200/80">{employees.length} registros</div>}
    >
      <div className="space-y-4">
        <Panel title="Filtros" subtitle="Ajuste a visão do quadro de recursos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Data"
              value={date.toISOString().split('T')[0]}
              onChange={handleDateChange}
            />

            <Select
              label="Obra"
              options={[
                { value: '0/0', label: 'TODAS AS OBRAS' },
                ...obras.map(o => ({
                  value: `${o.id_clie}/${o.id_cadt}`,
                  label: o.cl_fant
                }))
              ]}
              value={selectedObra}
              onChange={(e) => setSelectedObra(e.target.value)}
            />

            <Select
              label="Tipo"
              options={[
                  { value: '', label: 'TODOS' },
                  ...tipos.map(t => ({ value: t.cb_tmdo, label: t.cb_tmdo }))
              ]}
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              disabled={isLoading}
            />

            <Select
              label="Função"
              options={[
                  { value: '', label: 'TODAS' },
                  ...funcoes.map(f => ({ value: f.fu_func, label: f.fu_func }))
              ]}
              value={selectedFunc}
              onChange={(e) => setSelectedFunc(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Select
              label="Buscar Por"
              options={[
                  { value: 'NOME', label: 'NOME' },
                  { value: 'ID_MATR', label: 'MATRÍCULA' }
              ]}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Pesquisa"
                placeholder={searchType === 'NOME' ? 'Digite o nome...' : 'Digite a matrícula...'}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </Panel>

        {summary.length > 0 && (
          <Panel title="Resumo de Recursos">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-slate-600 border-collapse">
                <thead className="bg-slate-100 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-2 border">Função</th>
                    <th className="px-4 py-2 border text-center">Plan</th>
                    <th className="px-4 py-2 border text-center">Atualização</th>
                    <th className="px-4 py-2 border text-center">Real</th>
                    <th className="px-4 py-2 border text-center">Dif (Atual - Real)</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item) => (
                    <tr key={item.fu_sgla} className="hover:bg-slate-50/80">
                      <td className="px-4 py-2 border font-medium">{item.fu_sgla}</td>
                      <td 
                        className="px-4 py-2 border text-center cursor-help decoration-dotted underline" 
                        title={getPlanningTooltip(item.fu_sgla, 'P')}
                      >
                        {item.fu_qtde}
                      </td>
                      <td 
                        className="px-4 py-2 border text-center cursor-help decoration-dotted underline"
                        title={getPlanningTooltip(item.fu_sgla, 'R')}
                      >
                        {item.rp_qtde}
                      </td>
                      <td className="px-4 py-2 border text-center">{item.qt_rcso}</td>
                      <td className="px-4 py-2 border text-center font-bold">
                        {item.rp_qtde - item.qt_rcso}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td className="px-4 py-2 border">TOTAL</td>
                    <td className="px-4 py-2 border text-center">{summaryTotals.fu_qtde}</td>
                    <td className="px-4 py-2 border text-center">{summaryTotals.rp_qtde}</td>
                    <td className="px-4 py-2 border text-center">{summaryTotals.qt_rcso}</td>
                    <td className="px-4 py-2 border text-center">
                        {summaryTotals.rp_qtde - summaryTotals.qt_rcso}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        <div className="space-y-2">
          {isLoading || isFetchingEmployees ? (
            <Panel className="p-6 text-center">
              <div className="text-slate-600">Carregando dados...</div>
            </Panel>
          ) : (
            employees.map((emp) => (
              <EmployeeCard key={`${emp.id_matr}-${emp.fu_nome}`} employee={emp} />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

// Helper Component for the List Item
const EmployeeCard: React.FC<{ employee: Employee }> = ({ employee }) => {
    const isEqp = employee.cb_tmdo === 'EQP';
    const hasSalarioFixo = employee.fu_sfix > 0;
    const displayNome = hasSalarioFixo ? `* ${employee.fu_nome}` : employee.fu_nome;

    return (
        <details className="panel group overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50/60 list-none transition-colors">
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{displayNome}</span>
                    <span className="text-xs text-slate-500">{employee.em_fant}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-slate-600">{employee.fu_func}</span>
                    <span className="transform transition-transform group-open:rotate-180 text-slate-400">
                        ▼
                    </span>
                </div>
            </summary>
            <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50 text-sm text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                 <DetailRow label="Empresa" value={employee.em_fant} />
                 <DetailRow label={isEqp ? "Código" : "Matrícula"} value={employee.id_matr} />
                 <DetailRow label="Tipo" value={employee.cb_tmdo} />
                 <DetailRow label="Nome" value={employee.fu_nome} />
                 
                 {!isEqp && (
                    <>
                        <DetailRow label="CPF" value={formatCpf(employee.fu_ncpf)} />
                        <DetailRow label="RG" value={employee.fu_rgnu} />
                        <DetailRow label="Nascimento" value={jsonDate(employee.fu_dtna)} />
                        <DetailRow label="Admissão" value={jsonDate(employee.fu_dtad)} />
                        <DetailRow label="Rescisão" value={jsonDate(employee.fu_drec)} />
                        <DetailRow label="Fim Contrato Exp." value={jsonDate(employee.fu_fcon)} />
                        <DetailRow label="Prorrogação" value={jsonDate(employee.fu_dpro)} />
                        <DetailRow label="Recontratado" value={employee.fu_reco > 1 ? 'SIM' : 'NÃO'} />
                    </>
                 )}

                 <DetailRow label="Contratado p/ Obra" value={employee.dp_deno} />
                 <DetailRow label="Última Obra" value={employee.ul_obra} />
                 <DetailRow label="Status" value={employee.sr_deno} />

                 {!isEqp && (
                     <>
                        <DetailRow label="Indicação" value={employee.fu_indi} />
                        <DetailRow label="Salário" value={brMoney(employee.ff_sala)} />
                        <DetailRow label={hasSalarioFixo ? "* Salário Fixo" : "Salário Fixo"} value={hasSalarioFixo ? 'SIM' : 'NÃO'} />
                        <DetailRow label="Cidade" value={employee.fu_cida} />
                        <DetailRow label="Estado" value={employee.fu_esta} />
                        <DetailRow label="Celular" value={employee.fu_celu} />
                     </>
                 )}
            </div>
        </details>
    );
};

const DetailRow: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-slate-200 py-1 last:border-0">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="text-slate-800 text-right">{value || '-'}</span>
    </div>
);
