# Migration Status – Legacy Custom → React

Data: 2025-12-08

## Visão Rápida
- Cobertura total de procedures: 100% mapeadas e com serviços/hooks.
- Cobertura UI: ~85% (faltam telas finas para estoque avançado e painel de atividades OS).
- Testes: suites MSW/Vitest para principais serviços (estoque, Secullum, RDO, transferências).

## Mapa por Domínio

| Domínio | Arquivos Legados | React/TS | Status |
| --- | --- | --- | --- |
| Cadastros (CADT) | CadtCnAval, CadtFuAval, CadtFuRecr, CadtRlAval, CadtRlFunc | features/evaluations, recruitment, employees | ✅ UI + serviços |
| Estoque (CEST) | CestDeLcto, CestDeMvto, CestMv*, CestSt*, CestDePesq, CestFaFoto | stock-movement, stock-position, transfers, stockLegacyService | ⚠️ Falta UI para saldo/custo/histórico e fotos |
| Comercial/OS (COML) | ComlOsApnt, ComlOsTare, ComlOsCmnt, ComlOsPlan, ComlOsEdts, ComlApBmsv, ComlApSecu, ComlEdSecu | service-orders (dash/planning/list/comments/tasks/bms), appointments, secullum | ⚠️ Painel de atividades OS em desenvolvimento |
| RDO (COML RlRdia/CdRdob/ApRdob) | Relatórios diários, fotos | daily-reports + detalhes recursos | ✅ UI + detalhes recursos, falta ação de finalizar RDO |
| Compras (CPRA) | CpraPcMvto, CpraPcRela | purchasing | ✅ |
| Dashboards (DASH) | Dash* | dashboard, service-orders dashboards | ✅ |
| Propostas/PCPR | PcprOsItem, PcprOsLcto | production-orders | ✅ |

## Gaps Restantes
- **Estoque avançado**: UI para saldo/custo/histórico de movimentações (serviços prontos em `stockLegacyService.ts`). Fotos de estoque pendentes (CestFaFoto).
- **Atividades OS**: Expor relatório/recursos/comentários e ajuste de dias restantes/inativação (serviços prontos em `activityService.ts`).
- **Finalização RDO**: Ação de fechar/abrir RDO usando `consultaApontamentoFinalizado`.
- **Controle de autoridade**: `consultaAutoridadeObjeto` ainda não aplicado em gating de telas.

## Testes Disponíveis
- Transferências/Devoluções: `transferActions.test.ts`
- Secullum: `secullumService.test.ts`
- RDO Detalhes: `useDailyReportDetails.test.ts`
- Estoque legado (saldo/custo/movs): `stockLegacyService.test.ts`
- Atividades OS: `activityService.test.ts`

## Próximos Incrementos Recomendados
1) Montar UI de “Análise de Estoque” usando `StockInsight`/`stockLegacyService`.
2) Incluir painel de atividades OS (relatório, recursos, comentários) no dashboard de OS.
3) Adicionar ação de finalizar/abrir RDO na listagem de RDO.
4) Aplicar `consultaAutoridadeObjeto` para gate de rotas/botões sensíveis.
