var gmWkRsqlCSC = [],
  gmCdCadtCSC = [];
var gnInListCSC = 0;

function insereSolicitacaoTransferenciaCSC() {
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loTaObse = document.getElementById("txaObseCSM");
  var lcWkIsql = "",
    lcSlDnec = "";
  var lmWkIsql = [],
    lmStMvto = [];
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    if (parseFloat(gmCdCadtCSC[i].sm_qtde) > 0) {
      lmStMvto.push({
        id_strf: 0,
        sm_qtde: parseFloat(gmCdCadtCSC[i].sm_qtde),
        sm_pcus: parseFloat(gmCdCadtCSC[i].ce_pcus),
        id_cest: parseInt(gmCdCadtCSC[i].id_cest),
        sm_motv: gmCdCadtCSC[i].sm_motv.trim().toUpperCase(),
        sm_just: "",
        id_clie: 0,
        sl_obse: loTaObse.value.toString().trim().toUpperCase(),
        sl_dnec: "",
        sl_denv: "",
        sl_data: "",
        id_situ: 0,
        ap_user: "",
        ap_data: "",
        sl_dpre: "",
        sl_drec: "",
        sl_uenv: "",
        sl_ucon: "",
        sl_dcon: "",
        ce_codi: gmCdCadtCSC[i].ce_codi.trim().toUpperCase(),
        ce_deno: gmCdCadtCSC[i].ce_deno.trim().toUpperCase(),
        ce_espt: gmCdCadtCSC[i].ce_espt.trim().toUpperCase(),
        ce_unes: gmCdCadtCSC[i].ce_unes.trim().toUpperCase(),
        st_deno: "",
      });
    }
  }

  if (lmStMvto.length == 0) {
    app.dialog.close();

    alerta("selecione ao menos um item", "alerta");

    return;
  }

  try {
    if (loDtDnec.value.toString().trim().length > 0) {
      ldDtDnec = htmlDataParaObjetoData(loDtDnec.value);
      lcSlDnec = objetoDataParaStringSqlData(ldDtDnec);
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    goMnView.router.back();

    return;
  }

  if (ldDtDnec < ldDtHoje) {
    goMnView.router.back();

    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: parseInt(loSlClie.value) },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: 1 },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcApUser", pa_tipo: "VarChar", pa_valo: "" },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: "" },
    { pa_nome: "lcSlUenv", pa_tipo: "VarChar", pa_valo: "" },
    { pa_nome: "ldSlDenv", pa_tipo: "SmallDatetime", pa_valo: "1900-01-01" },
    { pa_nome: "ldSlDrec", pa_tipo: "SmallDatetime", pa_valo: "1900-01-01" },
    {
      pa_nome: "lcSlObse",
      pa_tipo: "VarChar",
      pa_valo: loTaObse.value.toString().trim().toUpperCase(),
    },
    {
      pa_nome: "lnIdCest",
      pa_tipo: "Int",
      pa_valo: parseInt(lmStMvto[0].id_cest),
    },
    {
      pa_nome: "lnSmQtde",
      pa_tipo: "Decimal",
      pa_valo: parseFloat(lmStMvto[0].sm_qtde),
    },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: "" },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmStMvto.shift();

          if (lmStMvto.length > 0) {
            for (var i = 0; i < lmStMvto.length; i++) {
              lmStMvto[i].id_strf = parseInt(lmWkRsql[0].id_strf);
              lmStMvto[i].id_clie = parseInt(lmWkRsql[0].id_clie);
              lmStMvto[i].sl_dnec = lmWkRsql[0].sl_dnec;
              lmStMvto[i].sl_denv = lmWkRsql[0].sl_denv;
              lmStMvto[i].sl_data = lmWkRsql[0].sl_data;
              lmStMvto[i].id_situ = parseInt(lmWkRsql[0].id_situ);
              lmStMvto[i].ap_user = lmWkRsql[0].ap_user.trim().toUpperCase();
              lmStMvto[i].ap_data = lmWkRsql[0].ap_data;
              lmStMvto[i].sl_dpre = lmWkRsql[0].sl_dpre;
              lmStMvto[i].sl_drec = lmWkRsql[0].sl_drec;
              lmStMvto[i].sl_uenv = lmWkRsql[0].sl_uenv.trim().toUpperCase();
              lmStMvto[i].sl_ucon = lmWkRsql[0].sl_ucon.trim().toUpperCase();
              lmStMvto[i].sl_dcon = lmWkRsql[0].sl_dcon;
              lmStMvto[i].st_deno = lmWkRsql[0].st_deno.trim().toUpperCase();
            }

            insereCadastroEstoqueSolicitacaoTransferenciaCSC(lmStMvto);
          } else {
            consultaSolicitacaoTransferenciaCSM(lmWkRsql);

            app.dialog.close();
            goMnView.router.back();
          }
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereCadastroEstoqueSolicitacaoTransferenciaCSC(lmStMvto) {
  var lcWkIsql = "",
    lcSlObse = lmStMvto[0].sl_obse.trim().toUpperCase(),
    lcSlDnec = objetoDataParaStringSqlData(
      stringDataParaObjetoData(jsonDate(lmStMvto[0].sl_dnec))
    ),
    lcSmMotv = lmStMvto[0].sm_motv.trim().toUpperCase(),
    lcWkProc = "";
  var lmWkIsql = [];
  var lnIdStrf = parseInt(lmStMvto[0].id_strf),
    lnIdClie = parseInt(lmStMvto[0].id_clie),
    lnSmQtde = parseFloat(lmStMvto[0].sm_qtde),
    lnIdCest = parseInt(lmStMvto[0].id_cest);

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
  ];

  if (lnSmQtde > 0) {
    lmWkIsql.push(
      { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
      { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv }
    );

    lcWkProc = "insereCadastroEstoqueSolicitacaoTransferencia";
  } else {
    lcWkProc = "deletaCadastroEstoqueSolicitacaoTransferencia";
  }

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=" +
      lcWkProc,
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmStMvto.shift();

          if (lmStMvto.length > 0) {
            insereCadastroEstoqueSolicitacaoTransferenciaCSC(lmStMvto);
          } else {
            consultaSolicitacaoTransferenciaCSM(lmWkRsql);

            app.dialog.close();
            goMnView.router.back();
          }
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function deletaSolicitacaoTransferenciaCSC() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdStrf = parseInt(gmCdCadtCSC[0].id_strf);

  app.dialog
    .create({
      title: "alerta",
      text: "deseja excluir solicitação de transferência ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
          onClick: function () {},
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            lmWkIsql = [
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=deletaSolicitacaoTransferencia",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].sl_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].sl_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (loApErro) {}

                try {
                  if (lmWkRsql.length == 0) {
                    limpaCamposCSM();
                    pesquisaSolicitacoesTransferenciaCSL();

                    notificacao(
                      "solicitação de transferência excluída",
                      "sucesso"
                    );

                    goMnView.router.back();

                    setTimeout(function () {
                      goMnView.router.back();
                    }, 500);
                  }
                } catch (loApErro) {}
              },
              error: function (jqXHR, textStatus, err) {},
            });
          },
        },
      ],
    })
    .open();
}

function adicionaCadastroEstoqueCSC() {
  var loTaObse = document.getElementById("txaObseCSM");
  var lnIdSitu = parseInt(gmCdCadtCSC[0].id_situ),
    lnIdStrf = parseInt(gmCdCadtCSC[0].id_strf),
    lnSlQtde = 0;
  var llIdCest = false;
  var lmStMvto = [];

  if (lnIdSitu > 1) {
    for (var i = 0; i < gmCdCadtCSC.length; i++) {
      llIdCest = false;

      for (var j = 0; j < gmStMvrcCSM.length; j++) {
        if (
          parseInt(gmCdCadtCSC[i].id_cest) == parseInt(gmStMvrcCSM[j].id_cest)
        ) {
          gmStMvrcCSM[j].sm_qtde = parseFloat(gmCdCadtCSC[i].sm_qtde);
          gmStMvrcCSM[j].sm_motv = gmCdCadtCSC[i].sm_motv.trim().toUpperCase();
          gmStMvrcCSM[j].sm_pcus = parseFloat(gmCdCadtCSC[i].ce_pcus);

          llIdCest = true;

          break;
        }
      }

      if (!llIdCest && parseFloat(gmCdCadtCSC[i].sm_qtde) > 0) {
        gmStMvrcCSM.push({
          id_strf: parseInt(gmCdCadtCSC[i].id_strf),
          sm_qtde: parseFloat(gmCdCadtCSC[i].sm_qtde),
          sm_pcus: parseFloat(gmCdCadtCSC[i].ce_pcus),
          id_cest: parseInt(gmCdCadtCSC[i].id_cest),
          sm_motv: gmCdCadtCSC[i].sm_motv.trim().toUpperCase(),
          sm_just: "",
          id_clie: parseInt(gmStMvrcCSM[0].id_clie),
          sl_obse: loTaObse.value.toString().trim().toUpperCase(),
          sl_dnec: gmStMvrcCSM[0].sl_dnec,
          sl_denv: gmStMvrcCSM[0].sl_denv,
          sl_data: gmStMvrcCSM[0].sl_data,
          id_situ: parseInt(gmStMvrcCSM[0].id_situ),
          ap_user: gmStMvrcCSM[0].ap_user.trim().toUpperCase(),
          ap_data: gmStMvrcCSM[0].ap_data,
          sl_dpre: gmStMvrcCSM[0].sl_dpre,
          sl_drec: gmStMvrcCSM[0].sl_drec,
          sl_uenv: gmStMvrcCSM[0].sl_uenv.trim().toUpperCase(),
          sl_ucon: gmStMvrcCSM[0].sl_ucon,
          sl_dcon: gmStMvrcCSM[0].sl_dcon,
          ce_codi: gmCdCadtCSC[i].ce_codi.trim().toUpperCase(),
          ce_deno: gmCdCadtCSC[i].ce_deno.trim().toUpperCase(),
          ce_espt: gmCdCadtCSC[i].ce_espt.trim().toUpperCase(),
          ce_unes: gmCdCadtCSC[i].ce_unes.trim().toUpperCase(),
          st_deno: gmStMvrcCSM[0].st_deno.trim().toUpperCase(),
        });
      }
    }

    limpaCamposCadastroEstoqueCSM();
    montaCadastrosEstoqueSolicitacaoTransferenciaRecebidaCSM();

    goMnView.router.back();
  } else {
    if (lnIdStrf > 0) {
      for (var i = 0; i < gmCdCadtCSC.length; i++) {
        lnSlQtde += parseFloat(gmCdCadtCSC[i].sm_qtde);
      }

      if (lnSlQtde == 0) {
        deletaSolicitacaoTransferenciaCSC();
      } else {
        for (var i = 0; i < gmCdCadtCSC.length; i++) {
          llIdCest = false;

          for (var j = 0; j < gmStMvtoCSM.length; j++) {
            if (
              parseInt(gmCdCadtCSC[i].id_cest) ==
              parseInt(gmStMvtoCSM[j].id_cest)
            ) {
              lmStMvto.push({
                id_strf: parseInt(gmCdCadtCSC[i].id_strf),
                sm_qtde: parseFloat(gmCdCadtCSC[i].sm_qtde),
                sm_pcus: parseFloat(gmCdCadtCSC[i].ce_pcus),
                id_cest: parseInt(gmCdCadtCSC[i].id_cest),
                sm_motv: gmCdCadtCSC[i].sm_motv.trim().toUpperCase(),
                sm_just: gmStMvtoCSM[j].sm_just.trim().toUpperCase(),
                id_clie: parseInt(gmStMvtoCSM[0].id_clie),
                sl_obse: loTaObse.value.toString().trim().toUpperCase(),
                sl_dnec: gmStMvtoCSM[0].sl_dnec,
                sl_denv: gmStMvtoCSM[0].sl_denv,
                sl_data: gmStMvtoCSM[0].sl_data,
                id_situ: parseInt(gmStMvtoCSM[0].id_situ),
                ap_user: gmStMvtoCSM[0].ap_user.trim().toUpperCase(),
                ap_data: gmStMvtoCSM[0].ap_data,
                sl_dpre: gmStMvtoCSM[0].sl_dpre,
                sl_drec: gmStMvtoCSM[0].sl_drec,
                sl_uenv: gmStMvtoCSM[0].sl_uenv.trim().toUpperCase(),
                sl_ucon: gmStMvtoCSM[0].sl_ucon,
                sl_dcon: gmStMvtoCSM[0].sl_dcon,
                ce_codi: gmCdCadtCSC[i].ce_codi.trim().toUpperCase(),
                ce_deno: gmCdCadtCSC[i].ce_deno.trim().toUpperCase(),
                ce_espt: gmCdCadtCSC[i].ce_espt.trim().toUpperCase(),
                ce_unes: gmCdCadtCSC[i].ce_unes.trim().toUpperCase(),
                st_deno: gmStMvtoCSM[0].st_deno.trim().toUpperCase(),
              });

              llIdCest = true;

              break;
            }
          }

          if (!llIdCest && parseFloat(gmCdCadtCSC[i].sm_qtde) > 0) {
            lmStMvto.push({
              id_strf: parseInt(gmCdCadtCSC[i].id_strf),
              sm_qtde: parseFloat(gmCdCadtCSC[i].sm_qtde),
              sm_pcus: parseFloat(gmCdCadtCSC[i].ce_pcus),
              id_cest: parseInt(gmCdCadtCSC[i].id_cest),
              sm_motv: gmCdCadtCSC[i].sm_motv.trim().toUpperCase(),
              sm_just: "",
              id_clie: parseInt(gmStMvtoCSM[0].id_clie),
              sl_obse: loTaObse.value.toString().trim().toUpperCase(),
              sl_dnec: gmStMvtoCSM[0].sl_dnec,
              sl_denv: gmStMvtoCSM[0].sl_denv,
              sl_data: gmStMvtoCSM[0].sl_data,
              id_situ: parseInt(gmStMvtoCSM[0].id_situ),
              ap_user: gmStMvtoCSM[0].ap_user.trim().toUpperCase(),
              ap_data: gmStMvtoCSM[0].ap_data,
              sl_dpre: gmStMvtoCSM[0].sl_dpre,
              sl_drec: gmStMvtoCSM[0].sl_drec,
              sl_uenv: gmStMvtoCSM[0].sl_uenv.trim().toUpperCase(),
              sl_ucon: gmStMvtoCSM[0].sl_ucon,
              sl_dcon: gmStMvtoCSM[0].sl_dcon,
              ce_codi: gmCdCadtCSC[i].ce_codi.trim().toUpperCase(),
              ce_deno: gmCdCadtCSC[i].ce_deno.trim().toUpperCase(),
              ce_espt: gmCdCadtCSC[i].ce_espt.trim().toUpperCase(),
              ce_unes: gmCdCadtCSC[i].ce_unes.trim().toUpperCase(),
              st_deno: gmStMvtoCSM[0].st_deno.trim().toUpperCase(),
            });
          }
        }

        app.dialog.progress("salvando itens");

        insereCadastroEstoqueSolicitacaoTransferenciaCSC(lmStMvto);
      }
    } else {
      app.dialog.progress("salvando itens");

      insereSolicitacaoTransferenciaCSC();
    }
  }
}

function removeCSC(lcWkRsql) {
  var loCdCadt = JSON.parse(unescape(lcWkRsql)),
    loBdQtde = {};
  var lnIdCest = parseInt(loCdCadt.id_cest),
    lnCePcus = 0,
    lnSmQtde = 0;

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    if (parseInt(gmCdCadtCSC[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCSC[i]));

      break;
    }
  }

  lnCePcus = parseFloat(loCdCadt.ce_pcus);
  lnSmQtde = parseFloat(loCdCadt.sm_qtde);

  if (lnSmQtde <= 0) {
    return;
  }

  if (parseInt(loCdCadt.id_situ) > 1 && loCdCadt.sm_motv.trim().length == 0) {
    digitaCSC(lcWkRsql);

    return;
  }

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCSC");

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    if (parseInt(gmCdCadtCSC[i].id_cest) == lnIdCest) {
      gmCdCadtCSC[i].sm_qtde--;

      totalCSC();

      lnSmQtde = gmCdCadtCSC[i].sm_qtde;

      loBdQtde.innerHTML =
        brDecimal(lnSmQtde) +
        " x " +
        brMoney(lnCePcus) +
        " = " +
        brMoney(lnSmQtde * lnCePcus);

      if (lnSmQtde == 0) {
        loBdQtde.style.color = "";
      }

      break;
    }
  }
}

function totalCSC() {
  var loDvTota = document.getElementById("divTotaCSC");
  var lnStTota = 0;

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    lnStTota +=
      parseFloat(gmCdCadtCSC[i].sm_qtde) * parseFloat(gmCdCadtCSC[i].ce_pcus);
  }

  loDvTota.innerHTML = brMoney(lnStTota);
}

function digitaCSC(lcWkRsql) {
  var loCdCadt = JSON.parse(unescape(lcWkRsql));
  var lnIdCest = parseInt(loCdCadt.id_cest);

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    if (parseInt(gmCdCadtCSC[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCSC[i]));

      break;
    }
  }

  sessionStorage.setItem("soCdCadt", JSON.stringify(loCdCadt));

  redireciona("custom/gre/cest/CestDgCadt.html", "CestDgCadt.html");
}

function adicionaCSC(lcWkRsql) {
  var loCdCadt = JSON.parse(unescape(lcWkRsql)),
    loBdQtde = {};
  var lnIdSitu = 0,
    lnIdCest = parseInt(loCdCadt.id_cest),
    lnCePcus = 0,
    lnSmQtde = 0;
  var lcSmMotv = "";

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    if (parseInt(gmCdCadtCSC[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCSC[i]));

      break;
    }
  }

  lnIdSitu = parseInt(loCdCadt.id_situ);
  lnIdCest = parseInt(loCdCadt.id_cest);
  lnCePcus = parseFloat(loCdCadt.ce_pcus);
  lcSmMotv = loCdCadt.sm_motv.trim().toUpperCase();

  if (lnIdSitu > 1 && lcSmMotv.length == 0) {
    digitaCSC(lcWkRsql);

    return;
  }

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCSC");

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    if (parseInt(gmCdCadtCSC[i].id_cest) == lnIdCest) {
      gmCdCadtCSC[i].sm_qtde++;

      totalCSC();

      lnSmQtde = gmCdCadtCSC[i].sm_qtde;

      loBdQtde.innerHTML =
        brDecimal(lnSmQtde) +
        " x " +
        brMoney(lnCePcus) +
        " = " +
        brMoney(lnSmQtde * lnCePcus);

      loBdQtde.style.color = corTema();

      break;
    }
  }
}

function montaCadastrosEstoqueCSC() {
  var loDvCadt = document.getElementById("divCadtCSC");
  var loDvLoad = document.getElementById("divLoadCSC");
  var lcWkRsql = "",
    lcCrQtde = "",
    lcSmMotv = "";
  var lnFnList = 0,
    lnSmQtde = 0,
    lnCePcus = 0;

  if (gnInListCSC + 20 >= gmWkRsqlCSC.length) {
    loDvCadt.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCSC.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCSC + 20;
  }

  for (var i = gnInListCSC; i < lnFnList; i++) {
    lcCrQtde = "";
    lcSmMotv = "";
    lnSmQtde = parseFloat(gmWkRsqlCSC[i].sm_qtde);
    lnCePcus = parseFloat(gmWkRsqlCSC[i].ce_pcus);

    if (lnSmQtde > 0) {
      lcCrQtde = " style='color: " + corTema() + ";'";
    }

    if (gmWkRsqlCSC[i].sm_motv.trim().length > 0) {
      lcSmMotv =
        "<br /><b>motivo da alteração: " +
        gmWkRsqlCSC[i].sm_motv.trim().toUpperCase() +
        "</b>";
    }

    //prettier-ignore
    lcWkRsql += 
      "<li>" +
        "<a href='#' class='item-link item-content'>" +
          "<div class='item-media'>" + 
            "<div>" +
              "<i onclick='adicionaCSC(\"" + escape(JSON.stringify(gmWkRsqlCSC[i])) + "\");' class='material-icons text-color-green' style='font-size: 36px;'>add_circle</i><br />" +
              "<i onclick='removeCSC(\"" + escape(JSON.stringify(gmWkRsqlCSC[i])) + "\");' class='material-icons text-color-red' style='font-size: 36px;'>remove_circle</i>" +
            "</div>" +
          "</div>" +
          "<div class='item-inner' onclick='digitaCSC(\"" + escape(JSON.stringify(gmWkRsqlCSC[i])) + "\");'>" +
            "<div class='item-title-row'>" +
              "<div class='item-title'><b id='bld" + gmWkRsqlCSC[i].id_cest.toString().trim() + "qtdCSC'" + lcCrQtde + ">" + brDecimal(lnSmQtde) + " x " + brMoney(lnCePcus) + " = " + brMoney(lnSmQtde * lnCePcus) + "</b></div>" +
              "<div class='item-after'>fís.: " + brDecimal(gmWkRsqlCSC[i].ce_qfis) + "</div>" +
            "</div>" +
            "<div class='item-subtitle'>" +
              "<b>código: " + gmWkRsqlCSC[i].ce_codi.trim().toUpperCase() + "</b><br />" +
              "<b>unidade: " + gmWkRsqlCSC[i].ce_unes.trim().toUpperCase() + "</b>" +
            "</div>" +
            "<div class='item-text'>" +
              "<b>" + gmWkRsqlCSC[i].ce_deno.trim().toUpperCase() + " " + gmWkRsqlCSC[i].ce_espt.trim().toUpperCase() + "</b>" +
              lcSmMotv +
            "</div>" +
          "</div>" +
        "</a>" +
      "<li>";
  }

  $("#uulCadtCSC").append(lcWkRsql);

  gnInListCSC = i;
}

function pesquisaCadastrosEstoqueCSC() {
  var loDvCadt = document.getElementById("divCadtCSC");
  var loCbCart = document.getElementById("chkCartCSC");
  var loTxPesq = document.getElementById("txtPesqCSC");

  limpaCamposCSC();

  if (loCbCart.checked) {
    for (var i = 0; i < gmCdCadtCSC.length; i++) {
      if (parseFloat(gmCdCadtCSC[i].sm_qtde) > 0) {
        gmWkRsqlCSC.push(gmCdCadtCSC[i]);
      }
    }
  } else {
    gmWkRsqlCSC = JSON.parse(JSON.stringify(gmCdCadtCSC));
  }

  if (loTxPesq.value.toString().trim().length > 0) {
    gmWkRsqlCSC = gmWkRsqlCSC.filter(function (loWkRsql) {
      return (
        (
          loWkRsql.ce_codi.toString().trim().toUpperCase() +
          loWkRsql.ce_deno.toString().trim().toUpperCase() +
          loWkRsql.ce_espt.toString().trim().toUpperCase()
        ).indexOf(loTxPesq.value.toString().trim().toUpperCase()) >= 0
      );
    });
  }

  montaCadastrosEstoqueCSC();

  loDvCadt.onscroll = function () {
    if (
      loDvCadt.scrollHeight - loDvCadt.scrollTop - loDvCadt.clientHeight <
      1
    ) {
      montaCadastrosEstoqueCSC();
    }
  };

  totalCSC();
}

function limpaCamposCSC() {
  var loDvCadt = document.getElementById("divCadtCSC");
  var loUlCadt = document.getElementById("uulCadtCSC");
  var loDvLoad = document.getElementById("divLoadCSC");

  gmWkRsqlCSC = [];

  gnInListCSC = 0;

  loDvCadt.onscroll = function () {};

  loUlCadt.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CestStCadt() {
  limpaCamposCSC();

  try {
    gmCdCadtCSC = JSON.parse(sessionStorage.getItem("smCdCadt"));

    if (parseInt(gmCdCadtCSC[0].id_cest) > 0) {
      sessionStorage.removeItem("smCdCadt");

      pesquisaCadastrosEstoqueCSC();
    }
  } catch (loApErro) {}

  OkTecladoAndroid("txtPesqCSC");
}
