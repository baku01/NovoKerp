/**
 * Finishing migration: thin wrappers for legacy procedures that still exist in `custom/gre`.
 * These helpers expose every remaining stored procedure so we can gradually
 * wire UI/flows without hunting names in the legacy code.
 *
 * All functions accept already-built params; pass them using `createParam(...)`
 * from `src/api/procedures`.
 */
import { callProcedure, type SqlParam } from '../../api/procedures';

// Re-export SqlParam for consumers
export type { SqlParam };

// Stock / Devolução / Transferência
export const stockLegacyApi = {
  consultaCadastroEstoque: (params: SqlParam[]) => callProcedure('consultaCadastroEstoque', params),
  consultaCustoCadastroEstoque: (params: SqlParam[]) => callProcedure('consultaCustoCadastroEstoque', params),
  consultaSaldoEstoque: (params: SqlParam[]) => callProcedure('consultaSaldoEstoque', params),
  consultaSaldoEstoqueEmpenhado: (params: SqlParam[]) => callProcedure('consultaSaldoEstoqueEmpenhado', params),
  insereCadastroEstoqueMovimentacaoEstoque: (params: SqlParam[]) => callProcedure('insereCadastroEstoqueMovimentacaoEstoque', params),
  insereCadastrosEstoqueDevolucaoEstoque: (params: SqlParam[]) => callProcedure('insereCadastrosEstoqueDevolucaoEstoque', params),
  insereDevolucaoEstoque: (params: SqlParam[]) => callProcedure('insereDevolucaoEstoque', params),
  insereSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('insereSolicitacaoTransferencia', params),
  insereCadastroEstoqueSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('insereCadastroEstoqueSolicitacaoTransferencia', params),
  atualizaMovimentacaoEstoque: (params: SqlParam[]) => callProcedure('atualizaMovimentacaoEstoque', params),
  atualizaDevolucaoEstoque: (params: SqlParam[]) => callProcedure('atualizaDevolucaoEstoque', params),
  atualizaEnviaDevolucaoEstoque: (params: SqlParam[]) => callProcedure('atualizaEnviaDevolucaoEstoque', params),
  atualizaSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('atualizaSolicitacaoTransferencia', params),
  atualizaContestaSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('atualizaContestaSolicitacaoTransferencia', params),
  atualizaEnviaSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('atualizaEnviaSolicitacaoTransferencia', params),
  atualizaReenviaSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('atualizaReenviaSolicitacaoTransferencia', params),
  atualizaFinalizaSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('atualizaFinalizaSolicitacaoTransferencia', params),
  deletaCadastroEstoqueDevolucaoEstoque: (params: SqlParam[]) => callProcedure('deletaCadastroEstoqueDevolucaoEstoque', params),
  deletaDevolucaoEstoque: (params: SqlParam[]) => callProcedure('deletaDevolucaoEstoque', params),
  deletaSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('deletaSolicitacaoTransferencia', params),
  deletaCadastroEstoqueSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('deletaCadastroEstoqueSolicitacaoTransferencia', params),
  pesquisaCadastrosEstoqueDevolucaoEstoque: (params: SqlParam[]) => callProcedure('pesquisaCadastrosEstoqueDevolucaoEstoque', params),
  pesquisaCadastrosEstoqueParaDevolucaoEstoque: (params: SqlParam[]) => callProcedure('pesquisaCadastrosEstoqueParaDevolucaoEstoque', params),
  pesquisaCadastrosEstoque: (params: SqlParam[]) => callProcedure('pesquisaCadastrosEstoque', params),
  pesquisaCadastrosEstoqueSolicitacaoTransferencia: (params: SqlParam[]) => callProcedure('pesquisaCadastrosEstoqueSolicitacaoTransferencia', params),
  pesquisaMovimentacaoEstoque: (params: SqlParam[]) => callProcedure('pesquisaMovimentacaoEstoque', params),
  pesquisaMovimentacoesEstoque: (params: SqlParam[]) => callProcedure('pesquisaMovimentacoesEstoque', params),
  pesquisaObrasDataMovimentacaoEstoque: (params: SqlParam[]) => callProcedure('pesquisaObrasDataMovimentacaoEstoque', params),
  pesquisaOrdensServicoDataMovimentacaoEstoque: (params: SqlParam[]) => callProcedure('pesquisaOrdensServicoDataMovimentacaoEstoque', params),
  pesquisaFuncionariosDataMovimentacaoEstoque: (params: SqlParam[]) => callProcedure('pesquisaFuncionariosDataMovimentacaoEstoque', params),
  pesquisaFichaEntregaEPI: (params: SqlParam[]) => callProcedure('pesquisaFichaEntregaEPI', params),
  pesquisaObrasDefinidasPeriodo: (params: SqlParam[]) => callProcedure('pesquisaObrasDefinidasPeriodo', params),
};

// Apontamentos / Secullum
export const secullumApi = {
  insereApontamentoSecullumManual: (params: SqlParam[]) => callProcedure('insereApontamentoSecullumManual', params),
  atualizaApontamentoSecullum: (params: SqlParam[]) => callProcedure('atualizaApontamentoSecullum', params),
  deletaApontamentoSecullum: (params: SqlParam[]) => callProcedure('deletaApontamentoSecullum', params),
  pesquisaApontamentosSecullum: (params: SqlParam[]) => callProcedure('pesquisaApontamentosSecullum', params),
  pesquisaApontamentosSecullumFuncionario: (params: SqlParam[]) => callProcedure('pesquisaApontamentosSecullumFuncionario', params),
  pesquisaHistoricoEdicaoApontamentosSecullum: (params: SqlParam[]) => callProcedure('pesquisaHistoricoEdicaoApontamentosSecullum', params),
  pesquisaJornada: (params: SqlParam[]) => callProcedure('pesquisaJornada', params),
  pesquisaJornadaRecursos: (params: SqlParam[]) => callProcedure('pesquisaJornadaRecursos', params),
  pesquisaApontamentosFuncionarios: (params: SqlParam[]) => callProcedure('pesquisaApontamentosFuncionarios', params),
  consultaFeriado: (params: SqlParam[]) => callProcedure('consultaFeriado', params),
  pesquisaJustificativasFalta: (params: SqlParam[]) => callProcedure('pesquisaJustificativasFalta', params),
  pesquisaStatusRecurso: (params: SqlParam[]) => callProcedure('pesquisaStatusRecurso', params),
};

// RDO / Relatórios diários
export const rdoApi = {
  consultaApontamentoFinalizado: (params: SqlParam[]) => callProcedure('consultaApontamentoFinalizado', params),
  pesquisaRecursosApontadosRelatorioDiarioObra: (params: SqlParam[]) => callProcedure('pesquisaRecursosApontadosRelatorioDiarioObra', params),
  pesquisaRecursosDataApontamento: (params: SqlParam[]) => callProcedure('pesquisaRecursosDataApontamento', params),
  pesquisaObrasDataApontamento: (params: SqlParam[]) => callProcedure('pesquisaObrasDataApontamento', params),
  pesquisaOrdensServicoDataApontamentoRdo: (params: SqlParam[]) => callProcedure('pesquisaOrdensServicoDataApontamentoRdo', params),
};

// OS / Planejamento e tarefas
export const serviceOrderLegacyApi = {
  pesquisaRelatorioAtividades: (params: SqlParam[]) => callProcedure('pesquisaRelatorioAtividades', params),
  pesquisaRecursosDiaAtividade: (params: SqlParam[]) => callProcedure('pesquisaRecursosDiaAtividade', params),
  pesquisaComentariosOrdensServico: (params: SqlParam[]) => callProcedure('pesquisaComentariosOrdensServico', params),
  atualizaDiasRestantesAtividade: (params: SqlParam[]) => callProcedure('atualizaDiasRestantesAtividade', params),
  atualizaInativaTarefa: (params: SqlParam[]) => callProcedure('atualizaInativaTarefa', params),
  pesquisaAcompanhamentoHorasApontadasParado: (params: SqlParam[]) => callProcedure('pesquisaAcompanhamentoHorasApontadasParado', params),
  pesquisaAcompanhamentoHorasApontadasSituacao: (params: SqlParam[]) => callProcedure('pesquisaAcompanhamentoHorasApontadasSituacao', params),
  insereLog: (params: SqlParam[]) => callProcedure('insereLog', params),
};

// Dashboard / Autoridade
export const dashboardLegacyApi = {
  consultaAutoridadeObjeto: (params: SqlParam[]) => callProcedure('consultaAutoridadeObjeto', params),
  consultaInformacoesDashboardObra: (params: SqlParam[]) => callProcedure('consultaInformacoesDashboardObra', params),
  pesquisaDashboardApontamentosDivergentes: (params: SqlParam[]) => callProcedure('pesquisaDashboardApontamentosDivergentes', params),
  pesquisaDashboardApontamentosPendentes: (params: SqlParam[]) => callProcedure('pesquisaDashboardApontamentosPendentes', params),
};

// Recursos / Dia
export const resourcesLegacyApi = {
  pesquisaRecursosDia: (params: SqlParam[]) => callProcedure('pesquisaRecursosDia', params),
  pesquisaStatusRecursosDia: (params: SqlParam[]) => callProcedure('pesquisaStatusRecursosDia', params),
};

// Utilidades genéricas (quando precisarmos apenas chamar por nome)
export async function callLegacyProcedure<T = unknown>(procedure: string, params: SqlParam[]) {
  return callProcedure<T>(procedure, params);
}
