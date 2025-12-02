var gmMvMvtoCMM = [],
  gmCdCadtCMM = [];

function pesquisaCadastroEstoqueCMM() {
  var loDtData = document.getElementById("datDataCMM");
  var loSlClie = document.getElementById("sltClieCMM");
  var loSlDpar = document.getElementById("sltDparCMM");
  var loLiClcu = document.getElementById("lliClcuCMM");
  var loSlClcu = document.getElementById("sltClcuCMM");
  var loSlFunc = document.getElementById("sltFuncCMM");
  var loSlOrds = document.getElementById("sltOrdsCMM");
  var lcMvData = "",
    lcMvDpar = loSlDpar.value.toString().trim().toUpperCase();
  var lnIdClie = 0,
    lnIdMatr = 0,
    lnIdOrds = 0,
    lnCuClie = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (loDtData.value.toString().trim().length > 0) {
      lcMvData = loDtData.value.toString().trim();
    }
  } catch (error) {}

  if (lcMvData.trim().length == 0) {
    alerta("data da movimentação de estoque inválida", "alerta");

    app.input.validate(loDtData);

    return;
  }

  if (ldDtHoje < htmlDataParaObjetoData(lcMvData)) {
    alerta("data da movimentação de estoque maior que data atual", "alerta");

    return;
  }

  try {
    if (parseInt(loSlClie.value.toString().split("/")[0]) > 0) {
      lnIdClie = parseInt(loSlClie.value.toString().split("/")[0]);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra da movimentação de estoque inválida", "alerta");

    return;
  }

  if (lcMvDpar.trim().length == 0) {
    alerta(
      "movimentação de/para da movimentação de estoque inválida",
      "alerta"
    );

    return;
  }

  if (lcMvDpar.trim().toUpperCase() == "F") {
    if (loLiClcu.style.display.toString().trim().length == 0) {
      try {
        if (parseInt(loSlClcu.value.toString().split("/")[0]) > 0) {
          lnCuClie = parseInt(loSlClcu.value.toString().split("/")[0]);
        }
      } catch (error) {}

      if (lnCuClie == 0) {
        alerta("obra para apuração do custo inválida", "alerta");

        return;
      }
    }

    try {
      if (parseInt(loSlFunc.value.toString().split("/")[1]) > 0) {
        lnIdMatr = parseInt(loSlFunc.value.toString().split("/")[1]);
      }
    } catch (error) {}

    if (lnIdMatr == 0) {
      alerta("funcionário da movimentação de estoque inválido", "alerta");

      return;
    }
  } else if (lcMvDpar.trim().toUpperCase() == "P") {
    try {
      if (parseInt(loSlOrds.value) > 0) {
        lnIdOrds = parseInt(loSlOrds.value);
      }
    } catch (error) {}

    if (lnIdOrds == 0) {
      alerta("proposta da movimentação de estoque inválido", "alerta");

      return;
    }
  }

  if (gmCdCadtCMM.length == 0) {
    alerta("carregando itens, aguarde...", "alerta");

    return;
  }

  redireciona("custom/gre/cest/CestMvCadt.html", "CestMvCadt.html");
}

function atualizaMovimentacaoEstoqueCMM(loObHtml) {
  var loSlTpme = document.getElementById("sltTpmeCMM");
  var loNrNume = document.getElementById("nroNumeCMM");
  var loTaObse = document.getElementById("txaObseCMM");
  var lcWkIsql = "",
    lcMvTpme = loSlTpme.value.toString().trim().toUpperCase(),
    lcMvObse = "";
  var lmWkIsql = [];
  var lnIdFili = 1,
    lnMvDocu = 0;

  if (loObHtml.defaultValue == loObHtml.value) {
    return;
  }

  try {
    if (parseInt(loNrNume.value) > 0) {
      lnMvDocu = parseInt(loNrNume.value);
    }
  } catch (error) {}

  if (lnMvDocu == 0) {
    return;
  }

  lcMvObse = loTaObse.value.toString().trim().toUpperCase();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdFili", pa_tipo: "Int", pa_valo: lnIdFili },
    { pa_nome: "lnMvDocu", pa_tipo: "Int", pa_valo: lnMvDocu },
    { pa_nome: "lcMvTpme", pa_tipo: "VarChar", pa_valo: lcMvTpme },
    { pa_nome: "lcMvObse", pa_tipo: "VarChar", pa_valo: lcMvObse },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmMvMvtoCMM = lmWkRsql;

          loTaObse.value = gmMvMvtoCMM[0].mv_obse.trim().toUpperCase();

          montaMovimentacaoEstoqueCMM();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function alteraDataCMM() {
  var loDtData = document.getElementById("datDataCMM");

  if (loDtData.defaultValue == loDtData.value) {
    return;
  }

  pesquisaObrasDefinidasCMM();
}

function montaMovimentacaoEstoqueCMM() {
  var loUlMvto = document.getElementById("uulMvtoCMM");
  var loNrQtot = document.getElementById("nroQtotCMM");
  var loNrVtcu = document.getElementById("nroVtcuCMM");
  var lcMvMvto = "";
  var lnMvQtde = 0,
    lnMvTcus = 0;

  for (var i = 0; i < gmMvMvtoCMM.length; i++) {
    lnMvQtde += parseFloat(gmMvMvtoCMM[i].mv_qtde);
    lnMvTcus +=
      parseFloat(gmMvMvtoCMM[i].mv_qtde) * parseFloat(gmMvMvtoCMM[i].mv_pcus);

    //prettier-ignore
    lcMvMvto +=
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media'><b>" + gmMvMvtoCMM[i].id_sequ.toString() + "</b></div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmMvMvtoCMM[i].ce_deno.trim().toUpperCase() + " " + gmMvMvtoCMM[i].ce_espt.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + brDecimal(gmMvMvtoCMM[i].mv_qtde) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>sequência</div>" +
                    "<div class='item-after'>" + gmMvMvtoCMM[i].id_sequ.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>código do item</div>" +
                    "<div class='item-after'>" + gmMvMvtoCMM[i].ce_codi.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>denominação do item</div>" +
                    "<div class='item-after'>" + gmMvMvtoCMM[i].ce_deno.trim().toUpperCase() + " " + gmMvMvtoCMM[i].ce_espt.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>unidade do item</div>" +
                    "<div class='item-after'>" + gmMvMvtoCMM[i].ce_unes.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>quantidade do item</div>" +
                    "<div class='item-after'>" + brDecimal(gmMvMvtoCMM[i].mv_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>custo do item</div>" +
                    "<div class='item-after'>" + brMoney(gmMvMvtoCMM[i].mv_pcus) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>total do custo do item</div>" +
                    "<div class='item-after'>" + brMoney(parseFloat(gmMvMvtoCMM[i].mv_qtde) * parseFloat(gmMvMvtoCMM[i].mv_pcus)) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  loUlMvto.innerHTML = lcMvMvto;

  loNrQtot.value = lnMvQtde;
  loNrVtcu.value = parseFloat(lnMvTcus.toFixed(2));
}

function pesquisaMovimentacaoEstoqueCMM() {
  var loSlTpme = document.getElementById("sltTpmeCMM");
  var loNrNume = document.getElementById("nroNumeCMM");
  var loDtData = document.getElementById("datDataCMM");
  var loTaObse = document.getElementById("txaObseCMM");
  var loDvAitm = document.getElementById("divAitmCMM");
  var lcWkIsql = "",
    lcMvTpme = loSlTpme.value.toString().trim().toUpperCase();
  var lmWkIsql = [];
  var lnIdFili = 1,
    lnMvDocu = 0;

  try {
    if (parseInt(loNrNume.value) > 0) {
      lnMvDocu = parseInt(loNrNume.value);
    }
  } catch (error) {}

  if (lnMvDocu == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdFili", pa_tipo: "Int", pa_valo: lnIdFili },
    { pa_nome: "lnMvDocu", pa_tipo: "Int", pa_valo: lnMvDocu },
    { pa_nome: "lcMvTpme", pa_tipo: "VarChar", pa_valo: lcMvTpme },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmMvMvtoCMM = lmWkRsql;

          loDtData.disabled = true;

          loDtData.valueAsDate = stringDataParaObjetoData(
            jsonDate(gmMvMvtoCMM[0].mv_data)
          );

          pesquisaObrasDefinidasCMM();

          loTaObse.value = gmMvMvtoCMM[0].mv_obse.trim().toUpperCase();

          loDvAitm.style.display = "none";

          montaMovimentacaoEstoqueCMM();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaSelectCMM(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  for (var i = 0; i < loObSlct.options.length; i++) {
    if (
      loObSlct.options[i].value.toString().trim().toUpperCase() ==
      loSlHtml.sl_valu.toString().trim().toUpperCase()
    ) {
      loObSlct.selectedIndex = i;

      loObSlct.onchange();

      break;
    }
  }
}

function pesquisaSelectCMM(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function pesquisaOrdensServicoCMM() {
  var loSlClie = document.getElementById("sltClieCMM");
  var loDvOrds = document.getElementById("divOrdsCMM");
  var loSlOrds = document.getElementById("sltOrdsCMM");
  var lcSlRsql = "<option value='0'></option>",
    lcWkIsql = "",
    lcSlSlct = "";
  var lmWkIsql = [],
    lmSlHtml = [];
  var lnIdCadt = 0,
    lnIdOrds = 0;

  try {
    if (parseInt(loSlClie.value.toString().split("/")[1]) > 0) {
      lnIdCadt = parseInt(loSlClie.value.toString().split("/")[1]);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsResp", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsDesc", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcli", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcon", pa_tipo: "VarChar", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlOrds.innerHTML = "<option value='0'>CARREGANDO PROPOSTAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaOrdensServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseInt(gmMvMvtoCMM[0].id_ords) > 0) {
          loDvOrds.style.display = "none";

          loSlOrds.disabled = true;

          lnIdOrds = parseInt(gmMvMvtoCMM[0].id_ords);
        }
      } catch (error) {}

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltOrdsCMM",
            sl_valu: parseInt(lmWkRsql[i].id_ords),
            sl_text:
              lmWkRsql[i].os_nume.trim().toUpperCase() +
              " - " +
              lmWkRsql[i].os_desc.trim().toUpperCase(),
            sl_titl: "pesquisa de propostas",
          });

          lcSlSlct = "";

          if (parseInt(lmWkRsql[i].id_ords) == lnIdOrds) {
            lcSlSlct = " selected";
          }

          //prettier-ignore
          lcSlRsql += "<option value='" + lmWkRsql[i].id_ords.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].os_nume.trim().toUpperCase() + " - " + lmWkRsql[i].os_desc.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlOrds.innerHTML = lcSlRsql;

      pesquisaCadastroEstoqueMovimentacaoEstoqueCMM();

      loDvOrds.onclick = function () {
        pesquisaSelectCMM(lmSlHtml);
      };
    },
    error: function (jqXHR, textStatus, err) {
      loSlOrds.innerHTML = lcSlRsql;

      pesquisaCadastroEstoqueMovimentacaoEstoqueCMM();

      loDvOrds.onclick = function () {
        pesquisaSelectCMM(lmSlHtml);
      };
    },
  });
}

function pesquisaCadastroEstoqueMovimentacaoEstoqueCMM() {
  var loSlTpme = document.getElementById("sltTpmeCMM");
  var loDtData = document.getElementById("datDataCMM");
  var loSlClie = document.getElementById("sltClieCMM");
  var loSlDpar = document.getElementById("sltDparCMM");
  var loLiClcu = document.getElementById("lliClcuCMM");
  var loSlClcu = document.getElementById("sltClcuCMM");
  var loSlFunc = document.getElementById("sltFuncCMM");
  var loSlOrds = document.getElementById("sltOrdsCMM");
  var lcWkIsql = "",
    lcMvData = "",
    lcFuEmpr = null,
    lcMvTpme = loSlTpme.value.toString().trim().toUpperCase(),
    lcMvDpar = loSlDpar.value.toString().trim().toUpperCase();
  var lmWkIsql = [];
  var lnIdClie = 0,
    lnFuMatr = null,
    lnIdOrds = null,
    lnCuClie = null;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length > 0) {
    lcMvData = loDtData.value.toString().trim();

    if (ldDtHoje < htmlDataParaObjetoData(lcMvData)) {
      return;
    }
  } else {
    return;
  }

  try {
    if (parseInt(loSlClie.value.toString().split("/")[0]) > 0) {
      lnIdClie = parseInt(loSlClie.value.toString().split("/")[0]);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (lcMvDpar.trim().length == 0) {
    return;
  }

  if (lcMvDpar.trim().toUpperCase() == "F") {
    if (loLiClcu.style.display.toString().trim().length == 0) {
      try {
        if (parseInt(loSlClcu.value.toString().split("/")[0]) > 0) {
          lnCuClie = parseInt(loSlClcu.value.toString().split("/")[0]);
        }
      } catch (error) {}

      if (lnCuClie == null) {
        return;
      }
    }

    try {
      if (loSlFunc.value.toString().split("/")[0].trim().length > 0) {
        lcFuEmpr = loSlFunc.value.toString().split("/")[0].trim().toUpperCase();
      }
    } catch (error) {}

    if (lcFuEmpr == null) {
      return;
    }

    try {
      if (parseInt(loSlFunc.value.toString().split("/")[1]) > 0) {
        lnFuMatr = parseInt(loSlFunc.value.toString().split("/")[1]);
      }
    } catch (error) {}

    if (lnFuMatr == null) {
      return;
    }
  } else if (lcMvDpar.trim().toUpperCase() == "P") {
    try {
      if (parseInt(loSlOrds.value) > 0) {
        lnIdOrds = parseInt(loSlOrds.value);
      }
    } catch (error) {}

    if (lnIdOrds == null) {
      return;
    }
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcMvTpme", pa_tipo: "VarChar", pa_valo: lcMvTpme },
    { pa_nome: "ldMvData", pa_tipo: "SmallDatetime", pa_valo: lcMvData },
    { pa_nome: "lcMvDpar", pa_tipo: "VarChar", pa_valo: lcMvDpar },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnFuMatr", pa_tipo: "Int", pa_valo: lnFuMatr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "lnCuClie", pa_tipo: "Int", pa_valo: lnCuClie },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaCadastroEstoqueMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmCdCadtCMM = lmWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      gmCdCadtCMM = [];
    },
  });
}

function pesquisaFuncionariosCMM() {
  var loDtData = document.getElementById("datDataCMM");
  var loSlClie = document.getElementById("sltClieCMM");
  var loDvFunc = document.getElementById("divFuncCMM");
  var loSlFunc = document.getElementById("sltFuncCMM");
  var lcSlRsql = "<option value='/0'></option>",
    lcWkIsql = "",
    lcSlSlct = "",
    lcDrData = "",
    lcFuEmpr = "";
  var lmWkIsql = [],
    lmSlHtml = [];
  var lnIdCadt = 0,
    lnFuMatr = 0;
  var ldDtHoje = new Date();

  try {
    if (parseInt(loSlClie.value.toString().split("/")[1]) > 0) {
      lnIdCadt = parseInt(loSlClie.value.toString().split("/")[1]);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length > 0) {
    lcDrData = loDtData.value.toString().trim();

    if (ldDtHoje < htmlDataParaObjetoData(lcDrData)) {
      return;
    }
  } else {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlFunc.innerHTML = "<option value='/0'>CARREGANDO FUNCIONÁRIOS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFuncionarios",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (gmMvMvtoCMM[0].fu_empr.trim().length > 0) {
          lcFuEmpr = gmMvMvtoCMM[0].fu_empr.trim().toUpperCase();
        }
      } catch (error) {}

      try {
        if (parseInt(gmMvMvtoCMM[0].fu_matr) > 0) {
          lnFuMatr = parseInt(gmMvMvtoCMM[0].fu_matr);
        }
      } catch (error) {}

      if (lcFuEmpr.trim().length > 0 && lnFuMatr > 0) {
        loDvFunc.style.display = "none";

        loSlFunc.disabled = true;
      }

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltFuncCMM",
            sl_valu:
              lmWkRsql[i].fu_empr.trim().toUpperCase() +
              "/" +
              lmWkRsql[i].id_matr.toString(),
            sl_text: lmWkRsql[i].fu_nome.trim().toUpperCase(),
            sl_titl: "pesquisa de funcionários",
          });

          lcSlSlct = "";

          if (
            lmWkRsql[i].fu_empr.trim().toUpperCase() == lcFuEmpr &&
            parseInt(lmWkRsql[i].id_matr) == lnFuMatr
          ) {
            lcSlSlct = " selected";
          }

          //prettier-ignore
          lcSlRsql += "<option value='" + lmWkRsql[i].fu_empr.trim().toUpperCase() + "/" + lmWkRsql[i].id_matr.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlFunc.innerHTML = lcSlRsql;

      pesquisaCadastroEstoqueMovimentacaoEstoqueCMM();

      loDvFunc.onclick = function () {
        pesquisaSelectCMM(lmSlHtml);
      };
    },
    error: function (jqXHR, textStatus, err) {
      loSlFunc.innerHTML = lcSlRsql;

      pesquisaCadastroEstoqueMovimentacaoEstoqueCMM();

      loDvFunc.onclick = function () {
        pesquisaSelectCMM(lmSlHtml);
      };
    },
  });
}

function alteraMovimentacaoDeParaCMM() {
  var loSlClie = document.getElementById("sltClieCMM");
  var loSlDpar = document.getElementById("sltDparCMM");
  var loLiClcu = document.getElementById("lliClcuCMM");
  var loLiFunc = document.getElementById("lliFuncCMM");
  var loDvFunc = document.getElementById("divFuncCMM");
  var loSlFunc = document.getElementById("sltFuncCMM");
  var loLiOrds = document.getElementById("lliOrdsCMM");
  var loDvOrds = document.getElementById("divOrdsCMM");
  var loSlOrds = document.getElementById("sltOrdsCMM");

  loLiClcu.style.display = "none";
  loLiFunc.style.display = "none";
  loDvFunc.style.display = "";

  loSlFunc.disabled = false;

  loSlFunc.innerHTML = "";

  loLiOrds.style.display = "none";
  loDvOrds.style.display = "";

  loSlOrds.disabled = false;

  loSlOrds.innerHTML = "";

  if (loSlDpar.value.toString().trim().toUpperCase() == "F") {
    pesquisaFuncionariosCMM();

    if (
      loSlClie.options[loSlClie.selectedIndex].text
        .trim()
        .toUpperCase()
        .startsWith("REAL")
    ) {
      loLiClcu.style.display = "";
    }

    loLiFunc.style.display = "";
  } else if (loSlDpar.value.toString().trim().toUpperCase() == "P") {
    pesquisaOrdensServicoCMM();

    loLiOrds.style.display = "";
  }
}

function alteraClienteCMM() {
  var loSlDpar = document.getElementById("sltDparCMM");
  var lcMvDpar = "",
    lcFuEmpr = "";
  var lnIdOrds = 0,
    lnFuMatr = 0;

  loSlDpar.disabled = false;

  try {
    if (gmMvMvtoCMM[0].fu_empr.trim().length > 0) {
      lcFuEmpr = gmMvMvtoCMM[0].fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (parseInt(gmMvMvtoCMM[0].fu_matr) > 0) {
      lnFuMatr = parseInt(gmMvMvtoCMM[0].fu_matr);
    }
  } catch (error) {}

  try {
    if (parseInt(gmMvMvtoCMM[0].id_ords) > 0) {
      lnIdOrds = parseInt(gmMvMvtoCMM[0].id_ords);
    }
  } catch (error) {}

  if (lcFuEmpr.trim().length > 0 && lnFuMatr > 0) {
    loSlDpar.disabled = true;

    lcMvDpar = "F";
  } else if (lnIdOrds > 0) {
    loSlDpar.disabled = true;

    lcMvDpar = "P";
  }

  for (var i = 0; i < loSlDpar.length; i++) {
    if (loSlDpar.options[i].value.toString().trim().toUpperCase() == lcMvDpar) {
      loSlDpar.selectedIndex = i;

      break;
    }
  }

  alteraMovimentacaoDeParaCMM();
}

function pesquisaObrasDefinidasCMM() {
  var loDtData = document.getElementById("datDataCMM");
  var loDvClie = document.getElementById("divClieCMM");
  var loSlClie = document.getElementById("sltClieCMM");
  var loDvClcu = document.getElementById("divClcuCMM");
  var loSlClcu = document.getElementById("sltClcuCMM");
  var lcSlRsql = "<option value='0/0'></option>",
    lcWkIsql = "",
    lcSlSlct = "",
    lcDrData = "";
  var lmWkIsql = [],
    lmSlHtml = [],
    lmSlHtm1 = [];
  var lnIdClie = 0,
    lnCuClie = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length > 0) {
    if (ldDtHoje < htmlDataParaObjetoData(loDtData.value.toString().trim())) {
      loDtData.valueAsDate = ldDtHoje;
    }
  } else {
    loDtData.valueAsDate = ldDtHoje;
  }

  lcDrData = loDtData.value.toString().trim();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvClie.style.display = "";

  loSlClie.disabled = false;

  loSlClie.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

  loDvClcu.style.display = "";

  loSlClcu.disabled = false;

  loSlClcu.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseInt(gmMvMvtoCMM[0].id_clie) > 0) {
          loDvClie.style.display = "none";

          loSlClie.disabled = true;

          loDvClcu.style.display = "none";

          loSlClcu.disabled = true;

          lnIdClie = parseInt(gmMvMvtoCMM[0].id_clie);
          lnCuClie = parseInt(gmMvMvtoCMM[0].cu_clie);
        }
      } catch (error) {}

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltClieCMM",
            sl_valu:
              lmWkRsql[i].id_clie.toString() +
              "/" +
              lmWkRsql[i].id_cadt.toString(),
            sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            sl_titl: "pesquisa de obras",
          });

          lcSlSlct = "";

          if (parseInt(lmWkRsql[i].id_clie) == lnIdClie) {
            lcSlSlct = " selected";
          }

          //prettier-ignore
          lcSlRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcSlRsql;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtm1.push({
            id_slct: "sltClcuCMM",
            sl_valu:
              lmWkRsql[i].id_clie.toString() +
              "/" +
              lmWkRsql[i].id_cadt.toString(),
            sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            sl_titl: "pesquisa de obras",
          });

          lcSlSlct = "";

          if (parseInt(lmWkRsql[i].id_clie) == lnCuClie) {
            lcSlSlct = " selected";
          }

          //prettier-ignore
          lcSlRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}
      
      loSlClcu.innerHTML = lcSlRsql;

      alteraClienteCMM();

      loDvClie.onclick = function () {
        pesquisaSelectCMM(lmSlHtml);
      };

      loDvClcu.onclick = function () {
        pesquisaSelectCMM(lmSlHtm1);
      };
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.innerHTML = lcSlRsql;
      loSlClcu.innerHTML = lcSlRsql;

      alteraClienteCMM();

      loDvClie.onclick = function () {
        pesquisaSelectCMM(lmSlHtml);
      };

      loDvClcu.onclick = function () {
        pesquisaSelectCMM(lmSlHtm1);
      };
    },
  });
}

function limpaCamposCMM() {
  var loNrNume = document.getElementById("nroNumeCMM");
  var loDtData = document.getElementById("datDataCMM");
  var loTaObse = document.getElementById("txaObseCMM");
  var loDvAitm = document.getElementById("divAitmCMM");
  var loUlMvto = document.getElementById("uulMvtoCMM");
  var loNrQtot = document.getElementById("nroQtotCMM");
  var loNrVtcu = document.getElementById("nroVtcuCMM");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  gmMvMvtoCMM = [];
  gmCdCadtCMM = [];

  loNrNume.value = "";

  loDtData.disabled = false;

  loDtData.valueAsDate = ldDtHoje;

  pesquisaObrasDefinidasCMM();

  loTaObse.value = "";

  loDvAitm.style.display = "";

  loUlMvto.innerHTML = "";

  loNrQtot.value = "";
  loNrVtcu.value = "";
}

function CestMvMvto() {
  var loSlTpme = document.getElementById("sltTpmeCMM");
  var loNrNume = document.getElementById("nroNumeCMM");
  var loMvLcto = {};

  limpaCamposCMM();

  loMvLcto = JSON.parse(sessionStorage.getItem("soMvLcto"));

  try {
    if (parseInt(loMvLcto.mv_docu) > 0) {
      sessionStorage.removeItem("soMvLcto");

      loSlTpme.value = loMvLcto.mv_tpme.trim().toUpperCase();
      loNrNume.value = parseInt(loMvLcto.mv_docu);

      pesquisaMovimentacaoEstoqueCMM();
    }
  } catch (error) {}

  OkTecladoAndroid("nroQtdeCMM");
}
