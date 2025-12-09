import { http, HttpResponse } from 'msw';
import {
  mockWorksites,
  mockEmployeeTypes,
  mockJobFunctions,
  mockEmployees,
  mockDashboardObras,
  mockApontamentosDivergentes,
  mockApontamentosPendentes,
  mockHorasPremio,
  mockResourceSummary,
  mockPlanningDescriptions,
  mockMenuItems,
  mockCompanies,
  mockUser,
  mockServiceOrders,
  mockActivities,
  mockSituacoesRecurso,
  mockJustificativas,
  mockStockPosition,
  mockStockMovementItems,
  mockDailyReports,
  mockPhotos,
  mockDocuments
} from './fixtures';

export const handlers = [
  // Main procedure endpoint
  http.get('*/chamadaProcedure', ({ request }) => {
    const url = new URL(request.url);
    const procName = url.searchParams.get('lcWkProc');
    const paramsStr = url.searchParams.get('lcWkIsql');

    console.log(`[MSW] 🔍 Intercepted procedure: ${procName}`);
    if (paramsStr) {
      console.log(`[MSW] 📋 Parameters: ${paramsStr}`);
    }

    // Parse parameters if needed for filtering
    interface ProcedureParam {
      pa_nome: string;
      pa_tipo: string;
      pa_valo: string | number | null;
    }

    let params: ProcedureParam[] = [];
    if (paramsStr) {
      try {
        params = JSON.parse(decodeURIComponent(paramsStr));
      } catch {
        console.warn('[MSW] Failed to parse parameters');
      }
    }

    switch (procName) {
      // ========== AUTH PROCEDURES ==========
      case 'consultaSenha':
        // Simulate login - always return success with mock user
        return HttpResponse.json([mockUser]);

      case 'pesquisaEmpresas':
        return HttpResponse.json(mockCompanies);

      case 'pesquisaMenu':
        return HttpResponse.json(mockMenuItems);

      // ========== EMPLOYEE PROCEDURES ==========
      case 'pesquisaObrasDefinidas':
      case 'pesquisaObras':
        return HttpResponse.json(mockWorksites);

      case 'pesquisaTipos':
        return HttpResponse.json(mockEmployeeTypes);

      case 'pesquisaFuncoes':
        return HttpResponse.json(mockJobFunctions);

      case 'pesquisaTodosFuncionarios':
      case 'pesquisaFuncionarios':
      case 'pesquisaSomenteRecursos':
        // Can implement filtering based on params if needed
        return HttpResponse.json(mockEmployees);

      case 'pesquisaFuncionariosPorPeriodoEMovimentacao':
        return HttpResponse.json(mockEmployees);

      // ========== DASHBOARD PROCEDURES ==========
      case 'pesquisaDashboardObras':
        return HttpResponse.json(mockDashboardObras);

      case 'pesquisaDashboardApontamentosDivergentes':
        return HttpResponse.json(mockApontamentosDivergentes);

      case 'pesquisaDashboardApontamentosPendentes':
        return HttpResponse.json(mockApontamentosPendentes);

      case 'pesquisaHorasPremio':
        return HttpResponse.json(mockHorasPremio);

      case 'pesquisaDashboardPropostas':
        return HttpResponse.json(mockServiceOrders);

      case 'pesquisaDashboardApontamentoSituacao':
        return HttpResponse.json([
          { id_cadt: 101, qt_pres: 8, qt_falt: 2, qt_ates: 1, qt_feri: 0 },
          { id_cadt: 102, qt_pres: 12, qt_falt: 3, qt_ates: 0, qt_feri: 0 }
        ]);

      case 'pesquisaDashboardApontamentoParado':
        return HttpResponse.json([
          { id_cadt: 101, qt_para: 2 },
          { id_cadt: 102, qt_para: 1 }
        ]);

      case 'pesquisaDashboardHorasPlanejadasApontadas':
        return HttpResponse.json([
          { id_cadt: 101, dt_refe: '2024-12-01', hr_plan: 160, hr_apon: 155 },
          { id_cadt: 101, dt_refe: '2024-12-02', hr_plan: 160, hr_apon: 160 }
        ]);

      // ========== STOCK TRANSFERS / RETURNS ==========
      case 'pesquisaSolicitacoesTransferencia':
        return HttpResponse.json([
          {
            id_strf: 9001,
            id_clie: 1,
            cl_fant: 'Obra A',
            sl_data: '2025-01-01',
            sl_dnec: '2025-01-10',
            st_deno: 'ABERTA',
            st_vcor: '0,128,255',
            sl_qtde: 5,
            sl_pcus: 12.5,
            sl_user: 'JOAO',
            sl_obse: 'Reposição',
          },
        ]);
      case 'pesquisaDevolucoesEstoque':
        return HttpResponse.json([
          {
            id_dves: 8001,
            id_clie: 2,
            cl_fant: 'Obra B',
            dl_data: '2025-01-03',
            st_deno: 'PENDENTE',
            st_vcor: '255,165,0',
            dl_qtde: 1,
            dl_pcus: 5,
            dl_user: 'MARIA',
            dl_obse: 'Devolução parcial',
          },
        ]);
      case 'pesquisaSituacoes':
        return HttpResponse.json([
          { id_situ: 1, st_deno: 'ABERTA', st_vcor: '0,128,255' },
          { id_situ: 2, st_deno: 'ENVIADA', st_vcor: '0,200,0' },
          { id_situ: 3, st_deno: 'FINALIZADA', st_vcor: '128,128,128' },
        ]);
      case 'insereSolicitacaoTransferencia':
        return HttpResponse.json([{ id_strf: 9001, id_clie: 1, sl_dnec: '2025-01-10', st_deno: 'ABERTA' }]);
      case 'insereCadastroEstoqueSolicitacaoTransferencia':
      case 'deletaCadastroEstoqueSolicitacaoTransferencia':
        return HttpResponse.json([{ ok: true }]);
      case 'atualizaSolicitacaoTransferencia':
      case 'atualizaContestaSolicitacaoTransferencia':
      case 'atualizaEnviaSolicitacaoTransferencia':
      case 'atualizaReenviaSolicitacaoTransferencia':
      case 'atualizaFinalizaSolicitacaoTransferencia':
      case 'deletaSolicitacaoTransferencia':
        return HttpResponse.json([{ ok: true }]);
      case 'insereDevolucaoEstoque':
        return HttpResponse.json([{ id_dves: 8001, id_clie: 1, dl_data: '2025-01-05' }]);
      case 'insereCadastrosEstoqueDevolucaoEstoque':
      case 'atualizaDevolucaoEstoque':
      case 'atualizaEnviaDevolucaoEstoque':
      case 'deletaDevolucaoEstoque':
        return HttpResponse.json([{ ok: true }]);

      // ========== SECULLUM / APONTAMENTOS ==========
      case 'pesquisaApontamentosSecullum':
      case 'pesquisaApontamentosSecullumFuncionario':
        return HttpResponse.json([
          {
            ap_data: '2025-01-10',
            id_matr: 123,
            fu_nome: 'FUNCIONARIO TESTE',
            fu_func: 'OPERADOR',
            ap_hent: 8,
            ap_hiin: 12,
            ap_htin: 13,
            ap_hter: 17,
            ap_feri: 0,
            ap_situ: 'NORMAL',
          },
        ]);
      case 'pesquisaHistoricoEdicaoApontamentosSecullum':
        return HttpResponse.json([
          { es_data: '2025-01-10', es_hent: 8, es_hiin: 12, es_htin: 13, es_hter: 17, es_just: 'Ajuste', id_user: 'TESTUSER' },
        ]);
      case 'insereApontamentoSecullumManual':
      case 'atualizaApontamentoSecullum':
      case 'deletaApontamentoSecullum':
        return HttpResponse.json([{ ok: true }]);
      case 'pesquisaJornada':
        return HttpResponse.json([{ jo_mnts: 480 }]);
      case 'pesquisaJornadaRecursos':
        return HttpResponse.json([{ id_matr: 123, fu_nome: 'FUNCIONARIO TESTE' }]);
      case 'pesquisaApontamentosFuncionarios':
        return HttpResponse.json([{ id_matr: 123, fu_nome: 'FUNCIONARIO TESTE', fu_func: 'OPERADOR', fu_empr: '01' }]);
      case 'consultaFeriado':
        return HttpResponse.json([{ isHoliday: 0 }]);
      case 'pesquisaJustificativasFalta':
        return HttpResponse.json([{ id_just: 1, ju_deno: 'ATESTADO' }]);
      case 'pesquisaStatusRecurso':
        return HttpResponse.json([{ id_sirc: 1, sr_deno: 'TRABALHANDO', sr_trab: 1, sr_just: 0 }]);

      // ========== RDO DETALHES ==========
      case 'pesquisaRecursosApontadosRelatorioDiarioObra':
        return HttpResponse.json([{ id_matr: 1, fu_nome: 'OPERADOR A', fu_func: 'OPERADOR', ap_hent: 8, ap_hter: 17 }]);
      case 'pesquisaRecursosDataApontamento':
        return HttpResponse.json([{ ap_data: '2025-01-09', id_matr: 1, fu_nome: 'OPERADOR A', fu_func: 'OPERADOR', ap_hent: 8, ap_hter: 17 }]);
      case 'pesquisaObrasDataApontamento':
        return HttpResponse.json([{ id_clie: 1, cl_fant: 'Obra A' }]);
      case 'pesquisaOrdensServicoDataApontamentoRdo':
        return HttpResponse.json([{ id_ords: 10, os_nume: 'OS-10' }]);
      case 'consultaApontamentoFinalizado':
        return HttpResponse.json([{ finalized: 0 }]);

      // ========== ATIVIDADES OS ==========
      case 'pesquisaRelatorioAtividades':
        return HttpResponse.json([
          { id_ords: 10, os_nume: 'OS-10', id_ativ: 5, at_deno: 'Montagem', at_tipo: 'A', ap_dres: 2 },
        ]);
      case 'pesquisaRecursosDiaAtividade':
        return HttpResponse.json([
          { id_matr: 1, fu_nome: 'OPERADOR A', fu_func: 'OPERADOR', ap_data: '2025-01-08', ap_hent: 8, ap_hter: 17 },
        ]);
      case 'pesquisaComentariosOrdensServico':
        return HttpResponse.json([
          { cm_desc: 'Atraso por chuva', cm_user: 'JOAO', cm_data: '2025-01-08' },
        ]);
      case 'atualizaDiasRestantesAtividade':
      case 'atualizaInativaTarefa':
        return HttpResponse.json([{ ok: true }]);

      // ========== ESTOQUE LEGACY ==========
      case 'consultaSaldoEstoque':
        return HttpResponse.json([{ id_cest: 10, ce_desc: 'CABO DE AÇO', ce_unes: 'UN', saldo: 100 }]);
      case 'consultaSaldoEstoqueEmpenhado':
        return HttpResponse.json([{ id_cest: 10, ce_desc: 'CABO DE AÇO', ce_unes: 'UN', saldo: 100, saldo_empenhado: 5 }]);
      case 'consultaCustoCadastroEstoque':
        return HttpResponse.json([{ ce_cust: 12.5 }]);
      case 'consultaCadastroEstoque':
        return HttpResponse.json([{ id_cest: 10, ce_desc: 'CABO DE AÇO', ce_unes: 'UN', saldo: 100 }]);
      case 'pesquisaMovimentacoesEstoque':
      case 'pesquisaMovimentacaoEstoque':
        return HttpResponse.json([{ id_cest: 10, ce_desc: 'CABO DE AÇO', mv_data: '2025-01-08', mv_tipo: 'E', mv_qtde: 3 }]);
      case 'pesquisaCadastrosEstoque':
      case 'pesquisaCadastrosEstoqueParaDevolucaoEstoque':
      case 'pesquisaCadastrosEstoqueDevolucaoEstoque':
        return HttpResponse.json([{ id_cest: 10, ce_desc: 'CABO DE AÇO', ce_unes: 'UN', saldo: 100 }]);

      case 'atualizaInformacoesDashboardObra':
        // Simula sucesso na atualização
        return HttpResponse.json({ success: true, message: 'Informações atualizadas' });

      // ========== RESOURCE/PLANNING PROCEDURES ==========
      case 'pesquisaQuantidadeRecursosObraFuncao':
        return HttpResponse.json(mockResourceSummary);

      case 'pesquisaDescricoesPlanejamentos':
        return HttpResponse.json(mockPlanningDescriptions);

      // ========== SERVICE ORDER PROCEDURES ==========
      case 'consultaDashboardProposta': {
        // Return details for the first service order by default
        const orderId = params.find(p => p.pa_nome === 'id_ords')?.pa_valo;
        const order = mockServiceOrders.find(o => o.id_ords === Number(orderId)) || mockServiceOrders[0];
        return HttpResponse.json([{
          ...order,
          os_ncli: 'CLI-001',
          os_ncon: 'CON-001',
          oc_nume: 'OC-001',
          mp_qthr: order.oc_qthr * 0.7,
          mi_qthr: order.oc_qthr * 0.2,
          eq_qthr: order.oc_qthr * 0.1,
          os_dtpc: '2024-12-08',
          os_uspc: 'admin'
        }]);
      }

      case 'pesquisaAtividades':
        return HttpResponse.json(mockActivities);

      case 'pesquisaApontamentosInternos':
        return HttpResponse.json([
          {
            id_apnt: 1,
            ap_data: '2024-12-08',
            id_matr: 1,
            fu_nome: 'João Silva',
            id_strc: 1,
            si_desc: 'Presente',
            ap_hent: 8,
            ap_hiin: 12,
            ap_htin: 13,
            ap_hter: 17,
            at_desc: 'Instalação de Cabos'
          }
        ]);

      case 'pesquisaJornadaOrdensServico':
        return HttpResponse.json([
          { id_jorn: 1, jo_desc: '08:00 às 17:00', jo_hini: 8, jo_hfim: 17 },
          { id_jorn: 2, jo_desc: '07:00 às 16:00', jo_hini: 7, jo_hfim: 16 }
        ]);

      case 'pesquisaRecursosApontadosProposta':
        return HttpResponse.json([
          {
            ap_data: '2024-12-08',
            id_matr: 1,
            fu_nome: 'João Silva',
            fu_func: 'Eletricista',
            ap_hora: 8,
            id_apnt: 1
          }
        ]);

      case 'pesquisaSituacoesRecurso':
        return HttpResponse.json(mockSituacoesRecurso);

      case 'pesquisaJustificativas':
        return HttpResponse.json(mockJustificativas);

      case 'pesquisaResponsabilidadeJustificativa':
        return HttpResponse.json([
          { id_rpju: 1, rj_desc: 'Cliente' },
          { id_rpju: 2, rj_desc: 'Empresa' },
          { id_rpju: 3, rj_desc: 'Fornecedor' }
        ]);

      case 'consultaComentario':
        return HttpResponse.json([
          { id_come: 1, cm_text: 'Trabalho iniciado conforme planejado', cm_data: '2024-12-08', cm_user: 'admin' }
        ]);

      case 'insereComentario':
        return HttpResponse.json({ success: true, id_come: Date.now() });

      case 'insereApontamento':
        return HttpResponse.json({ success: true, message: 'Apontamento salvo com sucesso' });

      case 'atualizaDiasRestantes':
        return HttpResponse.json({ success: true });

      // ========== STOCK PROCEDURES ==========
      case 'pesquisaPosicaoEstoque':
        return HttpResponse.json(mockStockPosition);

      case 'pesquisaConsumoEstoque':
        return HttpResponse.json([
          {
            ce_deno: 'Cimento CP-II 50kg',
            mv_qtde: 150,
            mv_tcus: 4500.00,
            mv_data: '2024-12-08',
            id_clie: 1,
            cl_fant: 'Obra Central - Shopping'
          }
        ]);

      case 'pesquisaCadastroEstoqueMovimentacaoEstoque':
        return HttpResponse.json(mockStockMovementItems);

      case 'pesquisaPropostas':
        return HttpResponse.json(mockServiceOrders.map(o => ({
          id_ords: o.id_ords,
          os_nume: o.os_nume,
          os_desc: o.os_desc
        })));

      case 'pesquisaObrasDefinidasPorPeriodo':
        return HttpResponse.json(mockWorksites);

      case 'insereMovimentacaoEstoque':
        return HttpResponse.json({ success: true, message: 'Movimentação salva com sucesso' });

      // ========== STOCK TRANSFER PROCEDURES ==========
      // ========== DAILY REPORT PROCEDURES ==========
      case 'pesquisaRelatoriosDiarioObra':
        return HttpResponse.json(mockDailyReports);

      case 'pesquisaFotos':
        return HttpResponse.json(mockPhotos);

      // ========== DOCUMENT PROCEDURES ==========
      case 'pesquisaDocumentos':
        return HttpResponse.json(mockDocuments);

      // ========== DEFAULT ==========
      default:
        console.warn(`[MSW] ⚠️  No mock defined for procedure: ${procName}`);
        console.warn(`[MSW] 💡 Add a case for this procedure in handlers.ts`);
        return HttpResponse.json([]);
    }
  }),

  // Photo upload endpoint
  http.post('*/insereFoto', async () => {
    console.log('[MSW] 📸 Photo upload intercepted');

    return HttpResponse.json({
      success: true,
      message: 'Foto salva com sucesso',
      filename: `foto_${Date.now()}.jpg`
    });
  }),

  // Email sending endpoint
  http.post('*/enviaEmail', async () => {
    console.log('[MSW] 📧 Email send intercepted');

    return HttpResponse.json({
      success: true,
      message: 'Email enviado com sucesso'
    });
  }),
];
