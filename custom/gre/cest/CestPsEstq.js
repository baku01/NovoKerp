var gmWkRsqlCPE = [];
var gnInListCPE = 0,
  gnPcQtdeCPE = 0,
  gnPcPcusCPE = 0,
  gnAxQtdeCPE = 0,
  gnAxPcusCPE = 0;
var gcAlDenoCPE = "",
  gcAxDenoCPE = "";

function montaRelatorioEstoque() {
  var loDvCest = document.getElementById("divCestCPE");
  var loDvLoad = document.getElementById("divLoadCPE");
  var lcWkRsql = "";
  var lnFnList = 0,
    lnPcQtde = 0,
    lnPcPcus = 0;

  if (gnInListCPE + 20 >= gmWkRsqlCPE.length) {
    loDvCest.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCPE.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCPE + 20;
  }

  for (var i = gnInListCPE; i < lnFnList; i++) {
    if (
      gcAlDenoCPE.trim().toUpperCase() !=
      gmWkRsqlCPE[i].al_deno.trim().toUpperCase()
    ) {
      if (gnPcQtdeCPE > 0) {
        //prettier-ignore
        lcWkRsql += 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title text-color-blue'><b>quantidade</b></div>" +
            "<div class='item-after'><b>" + brDecimal(gnPcQtdeCPE) + "</b></div>" +
          "</div>" +
        "</div>" +
      "</li>" +
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title text-color-blue'><b>custo</b></div>" +
            "<div class='item-after'><b>" + brMoney(gnPcPcusCPE) + "</b></div>" +
          "</div>" +
        "</div>" +
      "</li>";

        gnPcQtdeCPE = 0;
        gnPcPcusCPE = 0;
      }

      gcAlDenoCPE = gmWkRsqlCPE[i].al_deno.trim().toUpperCase();

      //prettier-ignore
      lcWkRsql += 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title text-color-orange'><b>" + gcAlDenoCPE + "</b></div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (gmWkRsqlCPE[i].ce_tipo.trim().toUpperCase() == "U") {
      lnPcQtde =
        parseFloat(gmWkRsqlCPE[i].sa_qtde) - parseFloat(gmWkRsqlCPE[i].en_qtde);

      if (
        parseFloat(gmWkRsqlCPE[i].sa_tcus) -
          parseFloat(gmWkRsqlCPE[i].en_tcus) >
        0
      ) {
        lnPcPcus =
          parseFloat(gmWkRsqlCPE[i].sa_tcus) -
          parseFloat(gmWkRsqlCPE[i].en_tcus);
      } else {
        lnPcPcus = 0;
      }

      gnPcQtdeCPE += lnPcQtde;
      gnPcPcusCPE += lnPcPcus;
    } else if (gmWkRsqlCPE[i].ce_tipo.trim().toUpperCase() == "A") {
      lnPcQtde =
        parseFloat(gmWkRsqlCPE[i].en_qtde) - parseFloat(gmWkRsqlCPE[i].sa_qtde);

      if (
        parseFloat(gmWkRsqlCPE[i].en_tcus) -
          parseFloat(gmWkRsqlCPE[i].sa_tcus) >
        0
      ) {
        lnPcPcus =
          parseFloat(gmWkRsqlCPE[i].en_tcus) -
          parseFloat(gmWkRsqlCPE[i].sa_tcus);
      } else {
        lnPcPcus = 0;
      }

      gnPcQtdeCPE += lnPcQtde;
      gnPcPcusCPE += lnPcPcus;
    }

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmWkRsqlCPE[i].ce_deno.trim().toUpperCase() + " " + gmWkRsqlCPE[i].ce_espt.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + brDecimal(lnPcQtde) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>item</div>" +
                    "<div class='item-after'>" + gmWkRsqlCPE[i].ce_deno.trim().toUpperCase() + " " + gmWkRsqlCPE[i].ce_espt.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>quantidade</div>" +
                    "<div class='item-after'>" + brDecimal(lnPcQtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>custo</div>" +
                    "<div class='item-after'>" + brMoney(lnPcPcus) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCPE = i;

  if (gnPcQtdeCPE > 0 && gnInListCPE >= gmWkRsqlCPE.length) {
    //prettier-ignore
    lcWkRsql += 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title text-color-blue'><b>quantidade</b></div>" +
            "<div class='item-after'><b>" + brDecimal(gnPcQtdeCPE) + "</b></div>" +
          "</div>" +
        "</div>" +
      "</li>" +
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title text-color-blue'><b>custo</b></div>" +
            "<div class='item-after'><b>" + brMoney(gnPcPcusCPE) + "</b></div>" +
          "</div>" +
        "</div>" +
      "</li>";

    gnPcQtdeCPE = 0;
    gnPcPcusCPE = 0;
  }

  $("#uulCestCPE").append(lcWkRsql);
}

function pesquisaPosicaoEstoqueConsumoCPE() {
  var loDvCest = document.getElementById("divCestCPE");
  var loSlTipo = document.getElementById("sltTipoCPE");
  var loDtData = document.getElementById("datDataCPE");
  var loDtDtde = document.getElementById("datDtdeCPE");
  var loDtDtat = document.getElementById("datDtatCPE");
  var loSlClie = document.getElementById("sltClieCPE");
  var loLiOrds = document.getElementById("lliOrdsCPE");
  var loSlOrds = document.getElementById("sltOrdsCPE");
  var loLiFunc = document.getElementById("lliFuncCPE");
  var loSlFunc = document.getElementById("sltFuncCPE");
  var loDvQtde = document.getElementById("divQtdeCPE");
  var loDvTcus = document.getElementById("divTcusCPE");
  var loDvLoad = document.getElementById("divLoadCPE");
  var lcWkIsql = "",
    lcWkProc = "",
    lcCeTipo = loSlTipo.value.toString().trim().toUpperCase(),
    lcMvData = loDtData.value.toString().trim().toUpperCase(),
    lcMvDtde = loDtDtde.value.toString().trim().toUpperCase(),
    lcMvDtat = loDtDtat.value.toString().trim().toUpperCase(),
    lcFuEmpr = "";
  var lnIdClie = 0,
    lnIdOrds = 0,
    lnIdMatr = 0,
    lnPcTqtd = 0,
    lnPcTcus = 0;
  var lmWkIsql = [];

  try {
    if (parseInt(loSlClie.value.toString().split("/")[0]) > 0) {
      lnIdClie = parseInt(loSlClie.value.toString().split("/")[0]);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  if (loLiFunc.style.display.toString().trim().length == 0) {
    try {
      lcFuEmpr = loSlFunc.value.toString().split("/")[0].trim().toUpperCase();
      lnIdMatr = parseInt(loSlFunc.value.toString().split("/")[1]);
    } catch (error) {}
  }

  if (lcCeTipo.trim().toUpperCase() == "U") {
    if (loLiOrds.style.display.toString().trim().length == 0) {
      try {
        lnIdOrds = parseInt(loSlOrds.value);
      } catch (error) {}
    }

    lcWkProc = "pesquisaConsumoEstoque";

    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
      { pa_nome: "ldMvDtde", pa_tipo: "SmallDatetime", pa_valo: lcMvDtde },
      { pa_nome: "ldMvDtat", pa_tipo: "SmallDatetime", pa_valo: lcMvDtat },
      { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
      { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
      { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    ];
  } else if (lcCeTipo.trim().toUpperCase() == "A") {
    lcWkProc = "pesquisaPosicaoEstoque";

    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
      { pa_nome: "ldMvData", pa_tipo: "SmallDatetime", pa_valo: lcMvData },
      { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
      { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    ];
  }

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCPE();

  loDvLoad.style.display = "";

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
      loDvLoad.style.display = "none";

      gmWkRsqlCPE = lmWkRsql;

      for (var i = 0; i < gmWkRsqlCPE.length; i++) {
        if (gmWkRsqlCPE[i].ce_tipo.trim().toUpperCase() == "U") {
          lnPcTqtd +=
            parseFloat(gmWkRsqlCPE[i].sa_qtde) -
            parseFloat(gmWkRsqlCPE[i].en_qtde);

          if (
            parseFloat(gmWkRsqlCPE[i].sa_tcus) -
              parseFloat(gmWkRsqlCPE[i].en_tcus) >
            0
          ) {
            lnPcTcus +=
              parseFloat(gmWkRsqlCPE[i].sa_tcus) -
              parseFloat(gmWkRsqlCPE[i].en_tcus);
          }
        } else if (gmWkRsqlCPE[i].ce_tipo.trim().toUpperCase() == "A") {
          lnPcTqtd +=
            parseFloat(gmWkRsqlCPE[i].en_qtde) -
            parseFloat(gmWkRsqlCPE[i].sa_qtde);

          if (
            parseFloat(gmWkRsqlCPE[i].en_tcus) -
              parseFloat(gmWkRsqlCPE[i].sa_tcus) >
            0
          ) {
            lnPcTcus +=
              parseFloat(gmWkRsqlCPE[i].en_tcus) -
              parseFloat(gmWkRsqlCPE[i].sa_tcus);
          }
        }
      }

      loDvQtde.innerHTML = brDecimal(lnPcTqtd);
      loDvTcus.innerHTML = brMoney(lnPcTcus);

      montaRelatorioEstoque();

      loDvCest.onscroll = function () {
        if (
          loDvCest.scrollHeight - loDvCest.scrollTop - loDvCest.clientHeight <
          1
        ) {
          montaRelatorioEstoque();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function pdfCPE(lnRdVisu) {
  var loSlClie = document.getElementById("sltClieCPE");
  var loSlOrds = document.getElementById("sltOrdsCPE");
  var loSlFunc = document.getElementById("sltFuncCPE");
  var lcApHtml = "",
    lcShTitu = "arquivo pdf referente à posição de estoque",
    lcShSbti = "relatório de estoque",
    lcPdHtml = "",
    lcEsTitu = "",
    lcDrTitu = "",
    lcClFant = "",
    lcOsHtml = "",
    lcFuHtml = "";
  var lnPcQtde = 0,
    lnPcPcus = 0,
    lnIdMatr = 0,
    lnIdOrds = 0;

  if (gmWkRsqlCPE.length == 0) {
    alerta("relatório sem conteúdo", "alerta");

    return;
  }

  gnAxQtdeCPE = 0;
  gnAxPcusCPE = 0;
  gcAxDenoCPE = "";

  for (var i = 0; i < gmWkRsqlCPE.length; i++) {
    if (
      gcAxDenoCPE.trim().toUpperCase() !=
      gmWkRsqlCPE[i].al_deno.trim().toUpperCase()
    ) {
      if (gnAxQtdeCPE > 0) {
        //prettier-ignore
        lcPdHtml += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>TOTAL</b>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>" + brDecimal(gnAxQtdeCPE) + "</b>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>" + brMoney(gnAxPcusCPE) + "</b>" +
              "</td>" +
            "</tr>" +
          "</table>" +
          "<br />";

        gnAxQtdeCPE = 0;
        gnAxPcusCPE = 0;
      }

      gcAxDenoCPE = gmWkRsqlCPE[i].al_deno.trim().toUpperCase();

      //prettier-ignore
      lcPdHtml += 
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td colspan='3' style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "<span><b>" + gcAxDenoCPE + "</b></span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>item</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>qtde</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>custo</b>" +
            "</td>" +
          "</tr>";
    }

    if (gmWkRsqlCPE[i].ce_tipo.trim().toUpperCase() == "U") {
      lnPcQtde =
        parseFloat(gmWkRsqlCPE[i].sa_qtde) - parseFloat(gmWkRsqlCPE[i].en_qtde);

      if (
        parseFloat(gmWkRsqlCPE[i].sa_tcus) -
          parseFloat(gmWkRsqlCPE[i].en_tcus) >
        0
      ) {
        lnPcPcus =
          parseFloat(gmWkRsqlCPE[i].sa_tcus) -
          parseFloat(gmWkRsqlCPE[i].en_tcus);
      } else {
        lnPcPcus = 0;
      }

      gnAxQtdeCPE += lnPcQtde;
      gnAxPcusCPE += lnPcPcus;
    } else if (gmWkRsqlCPE[i].ce_tipo.trim().toUpperCase() == "A") {
      lnPcQtde =
        parseFloat(gmWkRsqlCPE[i].en_qtde) - parseFloat(gmWkRsqlCPE[i].sa_qtde);

      if (
        parseFloat(gmWkRsqlCPE[i].en_tcus) -
          parseFloat(gmWkRsqlCPE[i].sa_tcus) >
        0
      ) {
        lnPcPcus =
          parseFloat(gmWkRsqlCPE[i].en_tcus) -
          parseFloat(gmWkRsqlCPE[i].sa_tcus);
      } else {
        lnPcPcus = 0;
      }

      gnAxQtdeCPE += lnPcQtde;
      gnAxPcusCPE += lnPcPcus;
    }

    //prettier-ignore
    lcPdHtml += 
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              gmWkRsqlCPE[i].ce_deno.trim().toUpperCase() + " " + gmWkRsqlCPE[i].ce_espt.trim().toUpperCase() +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              brDecimal(lnPcQtde) +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              brMoney(lnPcPcus) +
            "</td>" +
          "</tr>";
  }

  if (gnAxQtdeCPE > 0) {
    //prettier-ignore
    lcPdHtml += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>TOTAL</b>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>" + brDecimal(gnAxQtdeCPE) + "</b>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>" + brMoney(gnAxPcusCPE) + "</b>" +
              "</td>" +
            "</tr>" +
          "</table>" +
          "<br />";

    gnAxQtdeCPE = 0;
    gnAxPcusCPE = 0;
  }

  for (var i = 0; i < loSlClie.length; i++) {
    if (
      parseInt(loSlClie.options[i].value.toString().split("/")[0]) ==
      parseInt(gmWkRsqlCPE[0].id_clie)
    ) {
      lcClFant = loSlClie.options[i].text.trim().toUpperCase();

      break;
    }
  }

  lnIdOrds = parseInt(gmWkRsqlCPE[0].id_ords);
  lnIdMatr = parseInt(gmWkRsqlCPE[0].id_matr);

  //prettier-ignore
  if (lnIdOrds != -1 && lnIdMatr <= 0) {
    for (var i = 0; i < loSlOrds.length; i++) {
      if (parseInt(loSlOrds.options[i].value.toString().split("/")[0]) == lnIdOrds) {
        lcOsHtml = 
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>proposta</span> <br />" +
              "<span style='font-size: small;'>" + loSlOrds.options[i].text.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>";

        break;
      }
    }
  }

  //prettier-ignore
  if (lnIdMatr != -1 && lnIdOrds <= 0) {
    for (var i = 0; i < loSlFunc.length; i++) {
      if (loSlFunc.options[i].value.toString().split("/")[0].trim().toUpperCase() == gmWkRsqlCPE[0].fu_empr.trim().toUpperCase() && parseInt(loSlFunc.options[i].value.toString().split("/")[1]) == lnIdMatr) {
        lcFuHtml = 
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>funcionário</span> <br />" +
              "<span style='font-size: small;'>" + loSlFunc.options[i].text.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>";

        break;
      }
    }
  }

  //prettier-ignore
  if (gmWkRsqlCPE[0].ce_tipo.trim().toUpperCase() == "U") {
    lcEsTitu = "CONSUMO";
    lcDrTitu = 
      "CONSUMO ENTRE" +
      "<br />" +
      jsonDate(gmWkRsqlCPE[0].mv_dtde) + " e " + jsonDate(gmWkRsqlCPE[0].mv_dtat);
  } else {
    lcEsTitu = "POSIÇÃO DE ESTOQUE";
    lcDrTitu = 
      "POSIÇÃO EM" +
      "<br />" +
      jsonDate(gmWkRsqlCPE[0].mv_data);
  }

  //prettier-ignore
  lcApHtml =
        "<html>" +
          "<body>" + 
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'>" + 
                  lcEsTitu +
                "</td>" +
                "<td style='border: 1px solid black; text-align: center; width: 33%;'>" +
                  "<img src='http://www.atscs.com.br/images/empresas/gre.png' style='width: 150px;' />" +
                "</td>" +
                "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'>" + 
                  lcDrTitu +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>obra</span> <br />" +
                  "<span style='font-size: small;'>" + lcClFant + "</span>" +
                "</td>" +
              "</tr>" +
              lcOsHtml +
              lcFuHtml +
            "</table>" +
            "<br />" +
            lcPdHtml +
            "<br />" +
          "</body>" +
        "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcApHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName: "relatorio_estoque_real.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcApHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "relatorio_estoque_real.pdf",
                    lo64Base,
                    "application/pdf",
                    lcShTitu,
                    lcShSbti
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcApHtml, {
        documentSize: "A4",
        type: "share",
        fileName: "relatorio_estoque_real.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    if (lnRdVisu > 0) {
      visualizaImpressao(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        "relatorio_estoque_real",
        lcApHtml
      );
    } else {
      impressaoPdf(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        "relatorio_estoque_real",
        lcApHtml
      );
    }
  }
}

function alteraFuncionarioCPE() {
  var loSlTipo = document.getElementById("sltTipoCPE");
  var loLiOrds = document.getElementById("lliOrdsCPE");
  var loSlFunc = document.getElementById("sltFuncCPE");
  var lcCeTipo = loSlTipo.value.toString().trim().toUpperCase();
  var lnIdMatr = 0;

  try {
    if (parseInt(loSlFunc.value.toString().split("/")[1]) > 0) {
      lnIdMatr = parseInt(loSlFunc.value.toString().split("/")[1]);
    }
  } catch (error) {}

  if (lnIdMatr > 0) {
    loLiOrds.style.display = "none";
  } else {
    if (lcCeTipo.trim().toUpperCase() == "U") {
      loLiOrds.style.display = "";
    }
  }
}

function pesquisaFuncionariosCPE() {
  var loSlTipo = document.getElementById("sltTipoCPE");
  var loDtData = document.getElementById("datDataCPE");
  var loDtDtde = document.getElementById("datDtdeCPE");
  var loDtDtat = document.getElementById("datDtatCPE");
  var loSlClie = document.getElementById("sltClieCPE");
  var loDvFunc = document.getElementById("divFuncCPE");
  var loSlFunc = document.getElementById("sltFuncCPE");
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcWkProc = "",
    lcWkRsql =
      "<option value='/-1'></option><option value='/0' selected>TODOS OS FUNCIONÁRIOS</option>",
    lcCeTipo = loSlTipo.value.toString().trim().toUpperCase();
  var lmWkIsql = [],
    lmSlHtml = [];

  try {
    if (parseInt(loSlClie.value.toString().split("/")[1]) > 0) {
      lnIdCadt = parseInt(loSlClie.value.toString().split("/")[1]);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  if (lcCeTipo.trim().toUpperCase() == "U") {
    lcWkProc = "pesquisaFuncionariosPorPeriodoEMovimentacao";

    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
      {
        pa_nome: "ldDrDtde",
        pa_tipo: "SmallDatetime",
        pa_valo: loDtDtde.value.toString().trim().toUpperCase(),
      },
      {
        pa_nome: "ldDrDtat",
        pa_tipo: "SmallDatetime",
        pa_valo: loDtDtat.value.toString().trim().toUpperCase(),
      },
    ];
  } else if (lcCeTipo.trim().toUpperCase() == "A") {
    lcWkProc = "pesquisaFuncionarios";

    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      {
        pa_nome: "ldDrData",
        pa_tipo: "SmallDatetime",
        pa_valo: loDtData.value.toString().trim().toUpperCase(),
      },
      { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
      { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: null },
      { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: null },
      { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: null },
    ];
  }

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlFunc.disabled = true;

  loSlFunc.innerHTML = "<option value='/0'>CARREGANDO FUNCIONÁRIOS...</option>";

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
      loSlFunc.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltFuncCPE",
            sl_valu:
              lmWkRsql[i].fu_empr.trim().toUpperCase() +
              "/" +
              parseInt(lmWkRsql[i].id_matr),
            sl_text: lmWkRsql[i].fu_nome.trim().toUpperCase(),
            sl_titl: "pesquisa de funcionários",
          });

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].fu_empr.trim().toUpperCase() + "/" + lmWkRsql[i].id_matr.toString() + "'>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlFunc.innerHTML = lcWkRsql;

      loDvFunc.onclick = function () {
        pesquisaSelectCPE(lmSlHtml);
      };

      alteraFuncionarioCPE();
    },
    error: function (jqXHR, textStatus, err) {
      loSlFunc.disabled = false;

      loSlFunc.innerHTML = lcWkRsql;

      loDvFunc.onclick = function () {
        pesquisaSelectCPE([]);
      };

      alteraFuncionarioCPE();
    },
  });
}

function alteraPropostaCPE() {
  var loSlOrds = document.getElementById("sltOrdsCPE");
  var loLiFunc = document.getElementById("lliFuncCPE");
  var lnIdOrds = 0;

  try {
    if (parseInt(loSlOrds.value) > 0) {
      lnIdOrds = parseInt(loSlOrds.value);
    }
  } catch (error) {}

  if (lnIdOrds > 0) {
    loLiFunc.style.display = "none";
  } else {
    loLiFunc.style.display = "";
  }
}

function pesquisaPropostasCPE() {
  var loSlClie = document.getElementById("sltClieCPE");
  var loDvOrds = document.getElementById("divOrdsCPE");
  var loSlOrds = document.getElementById("sltOrdsCPE");
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcWkRsql =
      "<option value='-1'></option><option value='0' selected>TODAS AS PROPOSTAS</option>";
  var lmWkIsql = [],
    lmSlHtml = [];

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

  loSlOrds.disabled = true;

  loSlOrds.innerHTML = "<option value='0'>CARREGANDO PROPOSTAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaPropostas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlOrds.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltOrdsCPE",
            sl_valu: parseInt(lmWkRsql[i].id_ords),
            sl_text:
              lmWkRsql[i].os_nume.trim().toUpperCase() +
              " - " +
              lmWkRsql[i].os_desc.trim().toUpperCase(),
            sl_titl: "pesquisa de propostas",
          });

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_ords.toString() + "'>" + lmWkRsql[i].os_nume.trim().toUpperCase() + " - " + lmWkRsql[i].os_desc.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlOrds.innerHTML = lcWkRsql;

      loDvOrds.onclick = function () {
        pesquisaSelectCPE(lmSlHtml);
      };

      alteraPropostaCPE();
    },
    error: function (jqXHR, textStatus, err) {
      loSlOrds.disabled = false;

      loSlOrds.innerHTML = lcWkRsql;

      loDvOrds.onclick = function () {
        pesquisaSelectCPE([]);
      };

      alteraPropostaCPE();
    },
  });
}

function alteraClienteCPE() {
  var loSlTipo = document.getElementById("sltTipoCPE");
  var loLiOrds = document.getElementById("lliOrdsCPE");
  var loDvOrds = document.getElementById("divOrdsCPE");
  var loSlOrds = document.getElementById("sltOrdsCPE");
  var loLiFunc = document.getElementById("lliFuncCPE");
  var loDvFunc = document.getElementById("divFuncCPE");
  var loSlFunc = document.getElementById("sltFuncCPE");
  var lcCeTipo = loSlTipo.value.toString().trim().toUpperCase();

  loLiOrds.style.display = "none";

  loDvOrds.onclick = function () {
    pesquisaSelectCPE([]);
  };

  loSlOrds.innerHTML = "";

  loLiFunc.style.display = "";

  loDvFunc.onclick = function () {
    pesquisaSelectCPE([]);
  };

  loSlFunc.innerHTML = "";

  if (lcCeTipo.trim().toUpperCase() == "U") {
    loLiOrds.style.display = "";

    pesquisaPropostasCPE();
  }

  pesquisaFuncionariosCPE();
}

function consultaSelectCPE(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  for (var i = 0; i < loObSlct.options.length; i++) {
    if (parseInt(loObSlct.options[i].value) == parseInt(loSlHtml.sl_valu)) {
      loObSlct.selectedIndex = i;

      break;
    }
  }

  if (loSlHtml.id_slct.trim().toUpperCase() == "SLTCLIECPE") {
    alteraClienteCPE();
  }

  if (loSlHtml.id_slct.trim().toUpperCase() == "SLTORDSCPE") {
    alteraPropostaCPE();
  }

  if (loSlHtml.id_slct.trim().toUpperCase() == "SLTFUNCCPE") {
    alteraFuncionarioCPE();
  }
}

function pesquisaSelectCPE(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function pesquisaClientesCPE() {
  var loSlTipo = document.getElementById("sltTipoCPE");
  var loDtData = document.getElementById("datDataCPE");
  var loDtDtde = document.getElementById("datDtdeCPE");
  var loDtDtat = document.getElementById("datDtatCPE");
  var loDvClie = document.getElementById("divClieCPE");
  var loSlClie = document.getElementById("sltClieCPE");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "",
    lcMvDtde = "",
    lcMvDtat = "",
    lcWkProc = "",
    lcCeTipo = loSlTipo.value.toString().trim().toUpperCase(),
    lcMvData = loDtData.value.toString().trim().toUpperCase(),
    lcMvDtde = loDtDtde.value.toString().trim().toUpperCase(),
    lcMvDtat = loDtDtat.value.toString().trim().toUpperCase();
  var lmWkIsql = [],
    lmSlHtml = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (lcCeTipo.trim().toUpperCase() == "U") {
    if (lcMvDtde.trim().length == 0) {
      loDtDtde.value = loDtDtde.defaultValue;
    }

    if (lcMvDtat.trim().length == 0) {
      loDtDtat.value = loDtDtat.defaultValue;
    }

    if (htmlDataParaObjetoData(lcMvDtat) < htmlDataParaObjetoData(lcMvDtde)) {
      loDtDtde.valueAsDate = htmlDataParaObjetoData(lcMvDtat);
    }

    lcWkProc = "pesquisaObrasDefinidasPorPeriodo";

    lmWkIsql = [
      {
        pa_nome: "lcIdUser",
        pa_tipo: "VarChar",
        pa_valo: goCdUser.id_user.trim().toUpperCase(),
      },
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "ldDrDtde", pa_tipo: "SmallDatetime", pa_valo: lcMvDtde },
      { pa_nome: "ldDrDtat", pa_tipo: "SmallDatetime", pa_valo: lcMvDtat },
    ];
  } else if (lcCeTipo.trim().toUpperCase() == "A") {
    if (lcMvData.trim().length == 0) {
      loDtData.value = loDtData.defaultValue;
    }

    if (ldDtHoje < htmlDataParaObjetoData(lcMvData)) {
      loDtData.valueAsDate = ldDtHoje;
    }

    lcWkProc = "pesquisaObrasDefinidas";

    lmWkIsql = [
      {
        pa_nome: "lcIdUser",
        pa_tipo: "VarChar",
        pa_valo: goCdUser.id_user.trim().toUpperCase(),
      },
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcMvData },
    ];
  }

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlClie.disabled = true;

  loSlClie.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

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
      loSlClie.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltClieCPE",
            sl_valu:
              lmWkRsql[i].id_clie.toString() +
              "/" +
              lmWkRsql[i].id_cadt.toString(),
            sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            sl_titl: "pesquisa de obras",
          });

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcWkRsql;

      loDvClie.onclick = function () {
        pesquisaSelectCPE(lmSlHtml);
      };

      alteraClienteCPE();
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.disabled = false;

      loSlClie.innerHTML = lcWkRsql;

      loDvClie.onclick = function () {
        pesquisaSelectCPE([]);
      };

      alteraClienteCPE();
    },
  });
}

function alteraTipoRelatorioCPE() {
  var loSlTipo = document.getElementById("sltTipoCPE");
  var loLiData = document.getElementById("lliDataCPE");
  var loLiDtde = document.getElementById("lliDtdeCPE");
  var loLiDtat = document.getElementById("lliDtatCPE");
  var loLiFunc = document.getElementById("lliFuncCPE");
  var loLiOrds = document.getElementById("lliOrdsCPE");
  var lcCeTipo = loSlTipo.value.toString().trim().toUpperCase();

  if (lcCeTipo.trim().toUpperCase() == "U") {
    loLiData.style.display = "none";
    loLiDtde.style.display = "";
    loLiDtat.style.display = "";
    loLiFunc.style.display = "";
    loLiOrds.style.display = "";
  } else if (lcCeTipo.trim().toUpperCase() == "A") {
    loLiData.style.display = "";
    loLiDtde.style.display = "none";
    loLiDtat.style.display = "none";
    loLiFunc.style.display = "";
    loLiOrds.style.display = "none";
  }

  pesquisaClientesCPE();
}

function limpaCamposCPE() {
  var loDvCest = document.getElementById("divCestCPE");
  var loDvQtde = document.getElementById("divQtdeCPE");
  var loDvTcus = document.getElementById("divTcusCPE");
  var loUlCest = document.getElementById("uulCestCPE");
  var loDvLoad = document.getElementById("divLoadCPE");

  gmWkRsqlCPE = [];
  gnInListCPE = 0;
  gnPcQtdeCPE = 0;
  gnPcPcusCPE = 0;
  gnAxQtdeCPE = 0;
  gnAxPcusCPE = 0;
  gcAlDenoCPE = "";
  gcAxDenoCPE = "";

  loDvCest.onscroll = function () {};

  loDvQtde.innerHTML = "";
  loDvTcus.innerHTML = "";
  loUlCest.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CestPsEstq() {
  var loDvFabm = document.getElementById("divFabmCPE");
  var loDvFabw = document.getElementById("divFabwCPE");
  var loDtData = document.getElementById("datDataCPE");
  var loDtDtde = document.getElementById("datDtdeCPE");
  var loDtDtat = document.getElementById("datDtatCPE");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (isMobile()) {
    loDvFabw.style.display = "none";
  } else {
    loDvFabm.style.display = "none";
  }

  loDtData.valueAsDate = ldDtHoje;
  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setMonth(ldDtHoje.getMonth() - 1);

  loDtDtde.valueAsDate = ldDtHoje;

  limpaCamposCPE();
  alteraTipoRelatorioCPE();
}
