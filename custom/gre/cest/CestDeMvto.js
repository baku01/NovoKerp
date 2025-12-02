var gmDeMvtoCDM = [],
  gmCdCadtCDM = [];
var goCdCadtCDM = {};

function insereDevolucaoEstoqueCDM() {
  var loSlClie = document.getElementById("sltClieCDM");
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var loTaObse = document.getElementById("txaObseCDM");
  var loNrQtde = document.getElementById("nroQtdeCDM");
  var lnIdClie = 0,
    lnIdCest = 0,
    lnDmQtde = 0;
  var lcWkIsql = "",
    lcDlObse = "",
    lcDlDenv = "1900-01-01",
    lcDlDpre = "1900-01-01",
    lcDeMvto = "";
  var lmWkIsql = [];

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (parseInt(goCdCadtCDM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDM.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnDmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (lnDmQtde == 0) {
    app.input.validate(loNrQtde);

    return;
  }

  if (loDtEnvi.value.toString().trim().length > 0) {
    lcDlDenv = loDtEnvi.value.toString().trim().toUpperCase();
  }

  if (loDtPrev.value.toString().trim().length > 0) {
    lcDlDpre = loDtPrev.value.toString().trim().toUpperCase();
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcDlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lcDeMvto = "a:" + lnIdCest.toString() + "¢b:" + lnDmQtde.toString();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldDlDenv", pa_tipo: "SmallDatetime", pa_valo: lcDlDenv },
    { pa_nome: "ldDlDpre", pa_tipo: "SmallDatetime", pa_valo: lcDlDpre },
    { pa_nome: "lcDlObse", pa_tipo: "VarChar", pa_valo: lcDlObse },
    { pa_nome: "lcDeMvto", pa_tipo: "VarChar", pa_valo: lcDeMvto },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCadastroEstoqueCDM();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      consultaDevolucaoEstoqueCDM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereCadastrosEstoqueDevolucaoEstoqueCDM() {
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var loTaObse = document.getElementById("txaObseCDM");
  var loNrQtde = document.getElementById("nroQtdeCDM");
  var lcWkIsql = "",
    lcDlObse = "",
    lcDlDenv = "1900-01-01",
    lcDlDpre = "1900-01-01",
    lcDeMvto = "";
  var lmWkIsql = [];
  var lnIdDves = 0,
    lnIdClie = 0,
    lnDmQtde = 0,
    lnIdCest = 0;

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  if (lnIdDves == 0) {
    return;
  }

  try {
    if (parseInt(gmDeMvtoCDM[0].id_clie) > 0) {
      lnIdClie = parseInt(gmDeMvtoCDM[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (parseInt(goCdCadtCDM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDM.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnDmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (lnDmQtde == 0) {
    app.input.validate(loNrQtde);

    return;
  }

  if (loDtEnvi.value.toString().trim().length > 0) {
    lcDlDenv = loDtEnvi.value.toString().trim().toUpperCase();
  }

  if (loDtPrev.value.toString().trim().length > 0) {
    lcDlDpre = loDtPrev.value.toString().trim().toUpperCase();
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcDlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lcDeMvto = "a:" + lnIdCest.toString() + "¢b:" + lnDmQtde.toString();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdDves", pa_tipo: "Int", pa_valo: lnIdDves },
    { pa_nome: "ldDlDenv", pa_tipo: "SmallDatetime", pa_valo: lcDlDenv },
    { pa_nome: "ldDlDpre", pa_tipo: "SmallDatetime", pa_valo: lcDlDpre },
    { pa_nome: "lcDlObse", pa_tipo: "VarChar", pa_valo: lcDlObse },
    { pa_nome: "lcDeMvto", pa_tipo: "VarChar", pa_valo: lcDeMvto },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCadastroEstoqueCDM();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastrosEstoqueDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      consultaDevolucaoEstoqueCDM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function adicionaCadastroEstoqueCDM() {
  var loSlClie = document.getElementById("sltClieCDM");
  var loNrQtde = document.getElementById("nroQtdeCDM");
  var lnIdClie = 0,
    lnIdCest = 0,
    lnDmQtde = 0,
    lnIdDves = 0;

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  try {
    if (parseInt(goCdCadtCDM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDM.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    alerta("item inválido", "alerta");

    return;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnDmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (lnDmQtde == 0) {
    app.input.validate(loNrQtde);

    alerta("quantidade inválida", "alerta");

    return;
  }

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  if (lnIdDves > 0) {
    insereCadastrosEstoqueDevolucaoEstoqueCDM();
  } else {
    insereDevolucaoEstoqueCDM();
  }
}

function alteraQuantidadeCDM() {
  var loNrQtde = document.getElementById("nroQtdeCDM");
  var loDvTcus = document.getElementById("divTcusCDM");
  var lnIdCest = 0,
    lnDmQtde = 0,
    lnCeVcus = 0,
    lnMvPcus = 0,
    lnDmPcus = 0,
    lnCePcus = 0;

  try {
    if (parseInt(goCdCadtCDM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDM.id_cest);

      lnCeVcus = parseFloat(goCdCadtCDM.ce_vcus);
      lnMvPcus = parseFloat(goCdCadtCDM.mv_pcus);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  for (var i = 0; i < gmDeMvtoCDM.length; i++) {
    if (lnIdCest == parseInt(gmDeMvtoCDM[i].id_cest)) {
      lnDmPcus = parseFloat(gmDeMvtoCDM[i].dm_pcus);

      break;
    }
  }

  if (lnCeVcus > 0) {
    lnCePcus = lnCeVcus;
  }

  if (lnMvPcus > 0) {
    lnCePcus = lnMvPcus;
  }

  if (lnDmPcus > 0) {
    lnCePcus = lnDmPcus;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnDmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  loDvTcus.innerHTML = brMoney(lnDmQtde * lnCePcus);
}

function pesquisaCadastroEstoqueCDM() {
  var loSlClie = document.getElementById("sltClieCDM");
  var lnIdClie = 0,
    lnIdDves = 0,
    lnIdSitu = 0;
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  try {
    if (parseInt(gmDeMvtoCDM[0].id_situ) > 0) {
      lnIdSitu = parseInt(gmDeMvtoCDM[0].id_situ);
    }
  } catch (error) {}

  if (lnIdSitu == 0 || lnIdSitu == 1) {
    if (parseInt(ldDtDnec.getFullYear()) > 1900 && ldDtDnec < ldDtHoje) {
      alerta("data da necessidade menor que data atual", "alerta");

      return;
    }
  }

  if (gmCdCadtCDM.length == 0) {
    alerta("carregando itens, aguarde", "alerta");

    return;
  }

  for (var i = 0; i < gmCdCadtCDM.length; i++) {
    gmCdCadtCDM[i]["dm_qtde"] = 0;
    gmCdCadtCDM[i]["dm_pcus"] = 0;
  }

  if (lnIdDves > 0) {
    for (var i = 0; i < gmCdCadtCDM.length; i++) {
      for (var j = 0; j < gmDeMvtoCDM.length; j++) {
        if (
          parseInt(gmCdCadtCDM[i].id_cest) == parseInt(gmDeMvtoCDM[j].id_cest)
        ) {
          gmCdCadtCDM[i].dm_qtde = parseFloat(gmDeMvtoCDM[j].dm_qtde);
          gmCdCadtCDM[i].dm_pcus = parseFloat(gmDeMvtoCDM[j].dm_pcus);

          break;
        }
      }
    }
  }

  sessionStorage.setItem("smCdCadt", JSON.stringify(gmCdCadtCDM));

  redireciona("custom/gre/cest/CestDePesq.html", "CestDePesq.html");
}

function atualizaDevolucaoEstoqueCDM(loSlObjt) {
  var loDtEnvi = document.getElementById("datEnviCDM"),
    loDtPrev = document.getElementById("datPrevCDM"),
    loTaObse = document.getElementById("txaObseCDM");
  var lnIdDves = 0,
    lnIdSitu = 0,
    lnStAtiv = 0;
  var lcWkIsql = "",
    lcDlObse = "",
    lcDlDenv = "",
    lcDlDpre = "";
  var lmWkIsql = [];

  if (loSlObjt.value == loSlObjt.defaultValue) {
    return;
  }

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  if (lnIdDves == 0) {
    return;
  }

  try {
    if (parseInt(gmDeMvtoCDM[0].id_situ) > 0) {
      lnIdSitu = parseInt(gmDeMvtoCDM[0].id_situ);
    }
  } catch (error) {}

  try {
    if (parseInt(gmDeMvtoCDM[0].st_ativ) > 0) {
      lnStAtiv = parseInt(gmDeMvtoCDM[0].st_ativ);
    }
  } catch (error) {}

  if (lnIdSitu != lnStAtiv) {
    loSlObjt.value = loSlObjt.defaultValue;

    return;
  }

  lcDlDenv = loDtEnvi.value.toString().trim().toUpperCase();
  lcDlDpre = loDtPrev.value.toString().trim().toUpperCase();

  if (lcDlDenv.length > 0 && lcDlDpre.length > 0) {
    if (htmlDataParaObjetoData(lcDlDpre) < htmlDataParaObjetoData(lcDlDenv)) {
      loSlObjt.value = loSlObjt.defaultValue;

      return;
    }
  }

  lcDlObse = loTaObse.value.toString().trim().toUpperCase();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdDves", pa_tipo: "Int", pa_valo: lnIdDves },
    { pa_nome: "ldDlDenv", pa_tipo: "SmallDatetime", pa_valo: lcDlDenv },
    { pa_nome: "ldDlDpre", pa_tipo: "SmallDatetime", pa_valo: lcDlDpre },
    { pa_nome: "lcDlObse", pa_tipo: "VarChar", pa_valo: lcDlObse },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].dl_erro.trim().length > 0) {
          alerta(lmWkRsql[0].dl_erro.trim().toLowerCase(), "alerta");

          loSlObjt.value = loSlObjt.defaultValue;

          return;
        }
      } catch (loApErro) {}

      consultaDevolucaoEstoqueCDM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function atualizaEnviaDevolucaoEstoqueCDM() {
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var lcWkIsql = "",
    lcDlDenv = loDtEnvi.value.toString().trim().toUpperCase(),
    lcDlDpre = loDtPrev.value.toString().trim().toUpperCase();
  var lmWkIsql = [];
  var lnIdDves = 0;

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  if (lnIdDves == 0) {
    alerta("devolução de estoque inválida", "alerta");

    return;
  }

  if (lcDlDenv.trim().length == 0) {
    app.input.validate(loDtEnvi);
  }

  if (lcDlDpre.trim().length == 0) {
    app.input.validate(loDtPrev);
  }

  if (lcDlDenv.trim().length == 0) {
    alerta("data de envio da devolução de estoque inválida", "alerta");

    return;
  }

  if (lcDlDpre.trim().length == 0) {
    alerta(
      "data da previsão de entrega da devolução de estoque inválida",
      "alerta"
    );

    return;
  }

  if (htmlDataParaObjetoData(lcDlDpre) < htmlDataParaObjetoData(lcDlDenv)) {
    alerta(
      "data da previsão de entrega menor que data de envio da devolução de estoque",
      "alerta"
    );

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "deseja enviar devolução de estoque ?",
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
              {
                pa_nome: "lcIdUser",
                pa_tipo: "VarChar",
                pa_valo: goCdUser.id_user.trim().toUpperCase(),
              },
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lnIdDves", pa_tipo: "Int", pa_valo: lnIdDves },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=atualizaEnviaDevolucaoEstoque",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].dl_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].dl_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (loApErro) {}

                try {
                  if (lmWkRsql.length > 0) {
                    limpaCamposCDM();
                    pesquisaDevolucoesEstoqueCDL();

                    notificacao("devolução de estoque enviada", "sucesso");

                    goMnView.router.back();
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

function consultaCadastroEstoqueCDM(lcDeMvto) {
  var loDvCodi = document.getElementById("divCodiCDM");
  var loDvDeno = document.getElementById("divDenoCDM");
  var loDvUnid = document.getElementById("divUnidCDM");
  var loDvQest = document.getElementById("divQestCDM");
  var loDvDevl = document.getElementById("divDevlCDM");
  var loDvQesd = document.getElementById("divQesdCDM");
  var loNrQtde = document.getElementById("nroQtdeCDM");
  var loDvPcus = document.getElementById("divPcusCDM");
  var loDvTcus = document.getElementById("divTcusCDM");
  var loDeMvto = JSON.parse(unescape(lcDeMvto));
  var lnIdCest = 0;

  limpaCamposCadastroEstoqueCDM();

  try {
    if (parseInt(loDeMvto.id_cest) > 0) {
      lnIdCest = parseInt(loDeMvto.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  for (var i = 0; i < gmCdCadtCDM.length; i++) {
    if (lnIdCest == parseInt(gmCdCadtCDM[i].id_cest)) {
      goCdCadtCDM = gmCdCadtCDM[i];

      loDvCodi.innerHTML = gmCdCadtCDM[i].ce_codi.trim().toUpperCase();
      loDvDeno.innerHTML =
        gmCdCadtCDM[i].ce_deno.trim().toUpperCase() +
        " " +
        gmCdCadtCDM[i].ce_espt.trim().toUpperCase();
      loDvUnid.innerHTML = gmCdCadtCDM[i].ce_unes.trim().toUpperCase();
      loDvQest.innerHTML = brDecimal(
        parseFloat(gmCdCadtCDM[i].en_qtde) - parseFloat(gmCdCadtCDM[i].sa_qtde)
      );
      loDvDevl.innerHTML = brDecimal(parseFloat(gmCdCadtCDM[i].de_qtde));
      loDvQesd.innerHTML = brDecimal(
        parseFloat(gmCdCadtCDM[i].en_qtde) -
          parseFloat(gmCdCadtCDM[i].sa_qtde) -
          parseFloat(gmCdCadtCDM[i].de_qtde)
      );

      break;
    }
  }

  loNrQtde.value = parseFloat(loDeMvto.dm_qtde);

  app.input.validate(loNrQtde);

  loDvPcus.innerHTML = brDecimal(parseFloat(loDeMvto.dm_pcus));
  loDvTcus.innerHTML = brDecimal(
    parseFloat(loDeMvto.dm_pcus) * parseFloat(loDeMvto.dm_qtde)
  );
}

function deletaDevolucaoEstoqueCDM() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdDves = 0;

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  if (lnIdDves == 0) {
    limpaCamposCDM();

    goMnView.router.back();

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "deseja excluir devolução de estoque ?",
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
              { pa_nome: "lnIdDves", pa_tipo: "Int", pa_valo: lnIdDves },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=deletaDevolucaoEstoque",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].dl_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].dl_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (loApErro) {}

                try {
                  if (lmWkRsql.length == 0) {
                    limpaCamposCDM();
                    pesquisaDevolucoesEstoqueCDL();

                    notificacao("devolução de estoque excluída", "sucesso");

                    goMnView.router.back();
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

function deletaCadastroEstoqueDevolucaoEstoqueCDM(lcDeMvto) {
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var loTaObse = document.getElementById("txaObseCDM");
  var loDeMvto = JSON.parse(unescape(lcDeMvto));
  var lcWkIsql = "",
    lcDlObse = "",
    lcDlDenv = "1900-01-01",
    lcDlDpre = "1900-01-01";
  var lmWkIsql = [];
  var lnIdDves = 0,
    lnIdCest = 0;

  if (gmDeMvtoCDM.length <= 1) {
    deletaDevolucaoEstoqueCDM();

    return;
  }

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  if (lnIdDves == 0) {
    return;
  }

  try {
    if (parseInt(loDeMvto.id_cest) > 0) {
      lnIdCest = parseInt(loDeMvto.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  if (loDtEnvi.value.toString().trim().length > 0) {
    lcDlDenv = loDtEnvi.value.toString().trim().toUpperCase();
  }

  if (loDtPrev.value.toString().trim().length > 0) {
    lcDlDpre = loDtPrev.value.toString().trim().toUpperCase();
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcDlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdDves", pa_tipo: "Int", pa_valo: lnIdDves },
    { pa_nome: "ldDlDenv", pa_tipo: "SmallDatetime", pa_valo: lcDlDenv },
    { pa_nome: "ldDlDpre", pa_tipo: "SmallDatetime", pa_valo: lcDlDpre },
    { pa_nome: "lcDlObse", pa_tipo: "VarChar", pa_valo: lcDlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCadastroEstoqueCDM();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=deletaCadastroEstoqueDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        consultaDevolucaoEstoqueCDM(lmWkRsql);
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function montaCadastrosEstoqueDevolucaoEstoqueCDM() {
  var loUlCest = document.getElementById("uulCestCDM");
  var loDvQtot = document.getElementById("divQtotCDM");
  var loDvVtot = document.getElementById("divVtotCDM");
  var lcDeMvto = "",
    lcDmPcus = "",
    lcDmTota = "",
    lcDmDele = "",
    lcDmDica = "",
    lcDmJust = "",
    lcDmEdit = "",
    lcCrJust = "",
    lcCeQest = "",
    lcCrQest = "";
  var lnDlQtde = 0,
    lnDlPcus = 0,
    lnIdSitu = 0,
    lnStAtiv = 0,
    lnCeQest = 0,
    lnDmQtde = 0;

  if (gmDeMvtoCDM.length > 0) {
    lnIdSitu = parseInt(gmDeMvtoCDM[0].id_situ);
    lnStAtiv = parseInt(gmDeMvtoCDM[0].st_ativ);

    if (lnIdSitu == lnStAtiv) {
      if (isMobile()) {
        if (gcSiOper == "iOS") {
          lcDmDica = "CLIQUE NO ITEM PARA EDITAR";
        } else {
          lcDmDica = "CLIQUE E SEGURE NO ITEM PARA EDITAR";
        }
      } else {
        lcDmDica = "CLIQUE COM O BOTÃO DIREITO DO MOUSE NO ITEM PARA EDITAR";
      }

      //prettier-ignore
      lcDeMvto += 
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title'>dica</div>" +
              "<div class='item-after'>" + lcDmDica.trim().toUpperCase() + "</div>" +
            "</div>" +
          "</div>" +
        "</li>";
    }
  }

  for (var i = 0; i < gmDeMvtoCDM.length; i++) {
    lcDmDele = "";
    lcDmEdit = "";
    lcDmJust = "";
    lcCrJust = "";
    lcDmPcus = "";
    lcDmTota = "";
    lcCeQest = "";
    lcCrQest = "";
    lnCeQest = 0;
    lnDmQtde = parseFloat(gmDeMvtoCDM[i].dm_qtde);

    //prettier-ignore
    if (lnIdSitu == lnStAtiv) {
      lcDmDele = 
        "<div class='item-media' onclick='deletaCadastroEstoqueDevolucaoEstoqueCDM(\"" + escape(JSON.stringify(gmDeMvtoCDM[i])) + "\");'>" +
          "<i class='f7-icons text-color-red'>delete_round_fill</i>" +
        "</div>";

      if (gcSiOper == "iOS") {
        lcDmEdit = " onclick='consultaCadastroEstoqueCDM(\"" + escape(JSON.stringify(gmDeMvtoCDM[i])) + "\");'"; 
      } else {
        lcDmEdit = " oncontextmenu='consultaCadastroEstoqueCDM(\"" + escape(JSON.stringify(gmDeMvtoCDM[i])) + "\");'"; 
      }
    }

    if (gmDeMvtoCDM[i].dm_just.trim().length > 0) {
      lcCrJust = " style='color: rgb( 255, 255, 196 );'";

      //prettier-ignore
      lcDmJust = 
        "<li class='item-content item-input'>" +
          "<div class='item-inner'>" +
            "<div class='item-title item-label'" + lcCrJust + ">justificativa da alteração</div>" +
            "<div class='item-input-wrap'>" + 
              "<textarea readonly" + lcCrJust + ">" +
                gmDeMvtoCDM[i].dm_just.trim().toUpperCase() +
              "</textarea>" + 
            "</div>" +
          "</div>" +
        "</li>";
    }

    if (lnIdSitu == lnStAtiv) {
      //prettier-ignore
      for (var j = 0; j < gmCdCadtCDM.length; j++) {
        if (parseInt(gmDeMvtoCDM[i].id_cest) == parseInt(gmCdCadtCDM[j].id_cest)) {
          lnCeQest = parseFloat(gmCdCadtCDM[j].en_qtde) - parseFloat(gmCdCadtCDM[j].sa_qtde) - parseFloat(gmCdCadtCDM[j].de_qtde);

          lcCeQest = 
          "</li>" +
            "<div class='item-content'>" +
              "<div class='item-inner'>" +
                "<div class='item-title'" + lcCrJust + ">quantidade em estoque do item</div>" +
                "<div class='item-after'" + lcCrJust + ">" + brDecimal(lnCeQest) + "</div>" + 
              "</div>" +
            "</div>" +
          "</li>";

          if (lnCeQest < lnDmQtde) {
            lcCrQest = " style='background-color: rgba( 255, 0, 0, 0.25 );'";
          }

          break;
        }
      }
    }

    lnDlQtde += lnDmQtde;
    lnDlPcus += lnDmQtde * parseFloat(gmDeMvtoCDM[i].dm_pcus);

    lcDmPcus = brMoney(gmDeMvtoCDM[i].dm_pcus);
    lcDmTota = brMoney(lnDmQtde * parseFloat(gmDeMvtoCDM[i].dm_pcus));

    //prettier-ignore
    lcDeMvto +=
      "<li id='lliMvt" + gmDeMvtoCDM[i].id_cest.toString().trim() + "CDM' class='accordion-item'" + lcDmEdit + ">" +
        "<a href='#' class='item-content item-link'" + lcCrQest + ">" +
          lcDmDele +
          "<div class='item-inner'>" +
            "<div class='item-title'><b" + lcCrJust + ">" + gmDeMvtoCDM[i].ce_deno.trim().toUpperCase() + " " + gmDeMvtoCDM[i].ce_espt.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b" + lcCrJust + ">" + lnDmQtde.toString().trim() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul" + lcCrQest + ">" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">código do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmDeMvtoCDM[i].ce_codi.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">denominação do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmDeMvtoCDM[i].ce_deno.trim().toUpperCase() + " " + gmDeMvtoCDM[i].ce_espt.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">unidade do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmDeMvtoCDM[i].ce_unes.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcCeQest +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">quantidade do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + brDecimal(lnDmQtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">custo do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + lcDmPcus + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">total do custo do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + lcDmTota + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcDmJust +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  loUlCest.innerHTML = lcDeMvto;
  loDvQtot.innerHTML = brDecimal(lnDlQtde);
  loDvVtot.innerHTML = brMoney(lnDlPcus);
}

function consultaDevolucaoEstoqueCDM(lmDeMvto) {
  var loDvMsnv = document.getElementById("divMsnvCDM");
  var loNrDves = document.getElementById("nroDvesCDM");
  var loDvData = document.getElementById("divDataCDM");
  var loSlClie = document.getElementById("sltClieCDM");
  var loDvSitu = document.getElementById("divSituCDM");
  var loLiApus = document.getElementById("lliApusCDM");
  var loDvApus = document.getElementById("divApusCDM");
  var loLiApdt = document.getElementById("lliApdtCDM");
  var loDvApdt = document.getElementById("divApdtCDM");
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loLiUcon = document.getElementById("lliUconCDM");
  var loDvUcon = document.getElementById("divUconCDM");
  var loLiDcon = document.getElementById("lliDconCDM");
  var loDvDcon = document.getElementById("divDconCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var loLiRecb = document.getElementById("lliRecbCDM");
  var loDvRecb = document.getElementById("divRecbCDM");
  var loTaObse = document.getElementById("txaObseCDM");
  var loLiJcon = document.getElementById("lliJconCDM");
  var loTaJcon = document.getElementById("txaJconCDM");
  var loLiJnap = document.getElementById("lliJnapCDM");
  var loTaJnap = document.getElementById("txaJnapCDM");
  var loLiCodi = document.getElementById("lliCodiCDM");
  var loLiDeno = document.getElementById("lliDenoCDM");
  var loLiUnid = document.getElementById("lliUnidCDM");
  var loLiQest = document.getElementById("lliQestCDM");
  var loLiQdvl = document.getElementById("lliQdvlCDM");
  var loLiQesd = document.getElementById("lliQesdCDM");
  var loLiQtde = document.getElementById("lliQtdeCDM");
  var loLiPcus = document.getElementById("lliPcusCDM");
  var loLiTcus = document.getElementById("lliTcusCDM");
  var loDvAdcn = document.getElementById("divAdcnCDM");
  var lnIdSitu = 0,
    lnStAtiv = 0;
  var lcDlDenv = "",
    lcDlUcon = "",
    lcDlDcon = "",
    lcDlJcon = "",
    lcApUser = "",
    lcDlDpre = "",
    lcDlDrec = "",
    lcApData = "",
    lcDlJnap = "";

  limpaCamposCDM();
  pesquisaDevolucoesEstoqueCDL();

  try {
    if (lmDeMvto.length > 0) {
      gmDeMvtoCDM = JSON.parse(JSON.stringify(lmDeMvto));

      lnIdSitu = parseInt(gmDeMvtoCDM[0].id_situ);
      lnStAtiv = parseInt(gmDeMvtoCDM[0].st_ativ);

      lcApData = jsonDate(gmDeMvtoCDM[0].ap_data);
      lcDlDenv = jsonDate(gmDeMvtoCDM[0].dl_denv);
      lcDlUcon = gmDeMvtoCDM[0].dl_ucon.trim().toUpperCase();
      lcDlDcon = jsonDate(gmDeMvtoCDM[0].dl_dcon);
      lcDlJcon = gmDeMvtoCDM[0].dl_jcon.trim().toUpperCase();
      lcDlJnap = gmDeMvtoCDM[0].dl_jnap.trim().toUpperCase();
      lcApUser = gmDeMvtoCDM[0].ap_user.trim().toUpperCase();
      lcDlDpre = jsonDate(gmDeMvtoCDM[0].dl_dpre);
      lcDlDrec = jsonDate(gmDeMvtoCDM[0].dl_drec);

      if (lnIdSitu != lnStAtiv) {
        loDvMsnv.style.display = "none";
      }

      loNrDves.value = parseInt(gmDeMvtoCDM[0].id_dves);

      loDvData.innerHTML = jsonDate(gmDeMvtoCDM[0].dl_data);

      for (var i = 0; i < loSlClie.length; i++) {
        if (
          parseInt(loSlClie.options[i].value) ==
          parseInt(gmDeMvtoCDM[0].id_clie)
        ) {
          loSlClie.selectedIndex = i;

          pesquisaCadastrosEstoqueParaDevolucaoEstoqueCDM();

          break;
        }
      }

      loSlClie.disabled = true;

      loDvSitu.innerHTML = gmDeMvtoCDM[0].st_deno.trim().toUpperCase();

      if (lcApUser.trim().length > 0) {
        loLiApus.style.display = "";

        loDvApus.innerHTML = lcApUser.trim().toUpperCase();
      }

      if (lcApData.trim().length > 0) {
        loLiApdt.style.display = "";

        loDvApdt.innerHTML = lcApData;
      }

      if (lcDlDenv.trim().length > 0) {
        loDtEnvi.valueAsDate = stringDataParaObjetoData(lcDlDenv);

        app.input.validate(loDtEnvi);
      }

      if (lcDlUcon.trim().length > 0) {
        loLiUcon.style.display = "";

        loDvUcon.innerHTML = lcDlUcon;
      }

      if (lcDlDcon.trim().length > 0) {
        loLiDcon.style.display = "";

        loDvDcon.innerHTML = lcDlDcon;
      }

      if (lcDlDpre.trim().length > 0) {
        loDtPrev.valueAsDate = stringDataParaObjetoData(lcDlDpre);

        app.input.validate(loDtPrev);
      }

      if (lcDlDrec.trim().length > 0) {
        loLiRecb.style.display = "";

        loDvRecb.innerHTML = lcDlDrec;
      }

      loTaObse.value = gmDeMvtoCDM[0].dl_obse.trim().toUpperCase();

      if (lcDlJcon.trim().length > 0) {
        loLiJcon.style.display = "";

        loTaJcon.value = lcDlJcon;
      }

      if (lcDlJnap.trim().length > 0) {
        loLiJnap.style.display = "";

        loTaJnap.value = lcDlJnap;
      }

      if (lnIdSitu != lnStAtiv) {
        loLiCodi.style.display = "none";
        loLiDeno.style.display = "none";
        loLiUnid.style.display = "none";
        loLiQest.style.display = "none";
        loLiQdvl.style.display = "none";
        loLiQesd.style.display = "none";
        loLiQtde.style.display = "none";
        loLiPcus.style.display = "none";
        loLiTcus.style.display = "none";
        loDvAdcn.style.display = "none";
      }

      montaCadastrosEstoqueDevolucaoEstoqueCDM();
    }
  } catch (error) {}
}

function pesquisaCadastrosEstoqueDevolucaoEstoqueCDM() {
  var loNrDves = document.getElementById("nroDvesCDM");
  var lnIdDves = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  if (loNrDves.value.toString().trim().length == 0) {
    return;
  }

  try {
    if (parseInt(loNrDves.value) > 0) {
      lnIdDves = parseInt(loNrDves.value);
    }
  } catch (error) {}

  limpaCamposCDM();

  if (lnIdDves == 0) {
    alerta("código da devolução de estoque inválido", "alerta");

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdDves", pa_tipo: "Int", pa_valo: lnIdDves },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaCadastrosEstoqueDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      consultaDevolucaoEstoqueCDM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaCadastrosEstoqueParaDevolucaoEstoqueCDM() {
  var loSlClie = document.getElementById("sltClieCDM");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdClie = 0;

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaCadastrosEstoqueParaDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmCdCadtCDM = lmWkRsql;

      montaCadastrosEstoqueDevolucaoEstoqueCDM();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaObrasCDM() {
  var loSlClie = document.getElementById("sltClieCDM");
  var lcDlRsql = "<option value='0'></option>",
    lcWkIsql = "",
    lcSlSlct = "";
  var lmWkIsql = [];
  var lnIdClie = 0;

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlClie.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObras",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseInt(gmDeMvtoCDM[0].id_clie) > 0) {
          lnIdClie = parseInt(gmDeMvtoCDM[0].id_clie);
        }
      } catch (error) {}

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lcSlSlct = "";

          if (parseInt(lmWkRsql[i].id_clie) == lnIdClie) {
            lcSlSlct = " selected";
          }

          if (lmWkRsql[i].cl_fant.trim().toUpperCase().indexOf("REAL") < 0) {
            //prettier-ignore
            lcDlRsql += "<option value='" + lmWkRsql[i].id_clie.toString().trim() + "'" + lcSlSlct + ">" + lmWkRsql[i].cl_fant.toUpperCase().trim() + "</option>";
          }
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcDlRsql;

      if (lnIdClie > 0) {
        loSlClie.disabled = true;

        pesquisaCadastrosEstoqueParaDevolucaoEstoqueCDM();
      }
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.innerHTML = lcDlRsql;
    },
  });
}

function limpaCamposCadastroEstoqueCDM() {
  var loDvCodi = document.getElementById("divCodiCDM");
  var loDvDeno = document.getElementById("divDenoCDM");
  var loDvUnid = document.getElementById("divUnidCDM");
  var loDvQest = document.getElementById("divQestCDM");
  var loDvDevl = document.getElementById("divDevlCDM");
  var loDvQesd = document.getElementById("divQesdCDM");
  var loNrQtde = document.getElementById("nroQtdeCDM");
  var loDvPcus = document.getElementById("divPcusCDM");
  var loDvTcus = document.getElementById("divTcusCDM");

  goCdCadtCDM = {};

  loDvCodi.innerHTML = "";
  loDvDeno.innerHTML = "";
  loDvUnid.innerHTML = "";
  loDvQest.innerHTML = "";
  loDvDevl.innerHTML = "";
  loDvQesd.innerHTML = "";

  loNrQtde.value = "";

  loDvPcus.innerHTML = "";
  loDvTcus.innerHTML = "";
}

function limpaCamposCDM() {
  var loDvMsnv = document.getElementById("divMsnvCDM");
  var loNrDves = document.getElementById("nroDvesCDM");
  var loDvData = document.getElementById("divDataCDM");
  var loSlClie = document.getElementById("sltClieCDM");
  var loDvSitu = document.getElementById("divSituCDM");
  var loLiApus = document.getElementById("lliApusCDM");
  var loDvApus = document.getElementById("divApusCDM");
  var loLiApdt = document.getElementById("lliApdtCDM");
  var loDvApdt = document.getElementById("divApdtCDM");
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loLiUcon = document.getElementById("lliUconCDM");
  var loDvUcon = document.getElementById("divUconCDM");
  var loLiDcon = document.getElementById("lliDconCDM");
  var loDvDcon = document.getElementById("divDconCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var loLiRecb = document.getElementById("lliRecbCDM");
  var loDvRecb = document.getElementById("divRecbCDM");
  var loTaObse = document.getElementById("txaObseCDM");
  var loLiJcon = document.getElementById("lliJconCDM");
  var loTaJcon = document.getElementById("txaJconCDM");
  var loLiJnap = document.getElementById("lliJnapCDM");
  var loTaJnap = document.getElementById("txaJnapCDM");
  var loLiCodi = document.getElementById("lliCodiCDM");
  var loLiDeno = document.getElementById("lliDenoCDM");
  var loLiUnid = document.getElementById("lliUnidCDM");
  var loLiQest = document.getElementById("lliQestCDM");
  var loLiQdvl = document.getElementById("lliQdvlCDM");
  var loLiQesd = document.getElementById("lliQesdCDM");
  var loLiQtde = document.getElementById("lliQtdeCDM");
  var loLiPcus = document.getElementById("lliPcusCDM");
  var loLiTcus = document.getElementById("lliTcusCDM");
  var loDvAdcn = document.getElementById("divAdcnCDM");
  var loUlCest = document.getElementById("uulCestCDM");
  var loDvQtot = document.getElementById("divQtotCDM");
  var loDvVtot = document.getElementById("divVtotCDM");

  gmDeMvtoCDM = [];
  gmCdCadtCDM = [];

  loDvMsnv.style.display = "";

  loNrDves.value = "";

  loDvData.innerHTML = "";

  loSlClie.disabled = false;

  loSlClie.selectedIndex = 0;

  loDvSitu.innerHTML = "";

  loLiApus.style.display = "none";

  loDvApus.innerHTML = "";

  loLiApdt.style.display = "none";

  loDvApdt.innerHTML = "";

  loDtEnvi.disabled = false;

  loDtEnvi.value = "";

  loLiUcon.style.display = "none";

  loDvUcon.innerHTML = "";

  loLiDcon.style.display = "none";

  loDvDcon.innerHTML = "";

  loDtPrev.disabled = false;

  loDtPrev.value = "";

  loLiRecb.style.display = "none";

  loDvRecb.innerHTML = "";

  loTaObse.value = "";

  loLiJcon.style.display = "none";

  loTaJcon.value = "";

  loLiJnap.style.display = "none";

  loTaJnap.value = "";

  loLiCodi.style.display = "";
  loLiDeno.style.display = "";
  loLiUnid.style.display = "";
  loLiQest.style.display = "";
  loLiQdvl.style.display = "";
  loLiQesd.style.display = "";
  loLiQtde.style.display = "";
  loLiPcus.style.display = "";
  loLiTcus.style.display = "";
  loDvAdcn.style.display = "";

  limpaCamposCadastroEstoqueCDM();

  loUlCest.innerHTML = "";
  loDvQtot.innerHTML = "";
  loDvVtot.innerHTML = "";
}

function CestDeMvto() {
  var loNrDves = document.getElementById("nroDvesCDM");
  var loDeLcto = {};

  gmCdCadtCDM = [];

  limpaCamposCDM();
  pesquisaObrasCDM();

  loDeLcto = JSON.parse(sessionStorage.getItem("soDeLcto"));

  try {
    if (parseInt(loDeLcto.id_dves) > 0) {
      sessionStorage.removeItem("soDeLcto");

      loNrDves.value = parseInt(loDeLcto.id_dves);

      pesquisaCadastrosEstoqueDevolucaoEstoqueCDM();
    }
  } catch (error) {}

  OkTecladoAndroid("nroDvesCDM");
  OkTecladoAndroid("nroQtdeCDM");
}
