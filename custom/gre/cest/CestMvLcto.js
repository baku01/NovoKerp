var gmWkRsqlCML = [],
  gmMvMvtoCML = [];
var gnInListCML = 0;

function pesquisaCadastrosEstoqueMovimentacaoEstoqueCML(lcMvLcto) {
  var loMvLcto = JSON.parse(unescape(lcMvLcto));

  sessionStorage.setItem("soMvLcto", JSON.stringify(loMvLcto));

  redireciona("custom/gre/cest/CestMvMvto.html", "CestMvMvto.html");
}

function montaMovimentacoesEstoqueCML() {
  var loDvLcto = document.getElementById("divLctoCML");
  var loDvLoad = document.getElementById("divLoadCML");
  var lcWkRsql = "",
    lcEsClor = "",
    lcMvTpme = "",
    lcEsClor = "",
    lcCdFunc = "",
    lcOsLcto = "",
    lcFnOsdc = "";
  var lnFnList = 0,
    lnMvQtde = 0,
    lnMvTcus = 0;

  if (gnInListCML + 20 >= gmWkRsqlCML.length) {
    loDvLcto.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCML.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCML + 20;
  }

  for (var i = gnInListCML; i < lnFnList; i++) {
    lcMvTpme = "";
    lcEsClor = "";
    lcCdFunc = "";
    lcOsLcto = "";
    lcFnOsdc = "";
    lnMvQtde = parseFloat(gmWkRsqlCML[i].mv_qtde);
    lnMvTcus = parseFloat(gmWkRsqlCML[i].mv_tcus);

    if (gmWkRsqlCML[i].mv_tpme.trim().toUpperCase() == "E") {
      lcMvTpme = "DEVOLUÇÃO";
      lcEsClor = " style='background-color: rgba(0, 0, 255, 0.25);'";
    } else if (gmWkRsqlCML[i].mv_tpme.trim().toUpperCase() == "S") {
      lcMvTpme = "SAÍDA";
      lcEsClor = " style='background-color: rgba(255, 0, 0, 0.25);'";
      lnMvQtde = lnMvQtde * -1;
      lnMvTcus = lnMvTcus * -1;
    }

    if (parseInt(gmWkRsqlCML[i].id_matr) > 0) {
      //prettier-ignore
      lcCdFunc = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'>matrícula do funcionário</div>" +
            "<div class='item-after'>" + gmWkRsqlCML[i].id_matr.toString() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>" +
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'>nome do funcionário</div>" +
            "<div class='item-after'>" + gmWkRsqlCML[i].fu_nome.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";

      lcFnOsdc = gmWkRsqlCML[i].fu_nome.trim().toUpperCase();
    }

    if (parseInt(gmWkRsqlCML[i].id_ords) > 0) {
      //prettier-ignore
      lcOsLcto = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'>número da proposta</div>" +
            "<div class='item-after'>" + gmWkRsqlCML[i].os_nume.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>" +
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'>descrição da proposta</div>" +
            "<div class='item-after'>" + gmWkRsqlCML[i].os_desc.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";

      lcFnOsdc = gmWkRsqlCML[i].os_desc.trim().toUpperCase();
    }

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'" + lcEsClor + ">" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='pesquisaCadastrosEstoqueMovimentacaoEstoqueCML(\"" + escape(JSON.stringify(gmWkRsqlCML[i])) + "\");'>" +
            "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + lcFnOsdc + "</b></div>" +
            "<div class='item-after'><b>" + jsonDate(gmWkRsqlCML[i].mv_data) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul" + lcEsClor + ">" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>número do documento da movimentação de estoque</div>" +
                    "<div class='item-after'>" + gmWkRsqlCML[i].mv_docu.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data da movimentação de estoque</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlCML[i].mv_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>obra</div>" +
                    "<div class='item-after'>" + gmWkRsqlCML[i].cl_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>usuário responsável pelo lançamento</div>" +
                    "<div class='item-after'>" + gmWkRsqlCML[i].mv_user.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>matrícula do funcionário responsável pelo lançamento</div>" +
                    "<div class='item-after'>" + gmWkRsqlCML[i].sl_matr.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>nome do funcionário responsável pelo lançamento</div>" +
                    "<div class='item-after'>" + gmWkRsqlCML[i].sl_nome.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>tipo de movimentação</div>" +
                    "<div class='item-after'>" + lcMvTpme + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcCdFunc +
              lcOsLcto +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>quantidade de itens de movimentação</div>" +
                    "<div class='item-after'>" + brDecimal(lnMvQtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>custo da movimentação</div>" +
                    "<div class='item-after'>" + brMoney(lnMvTcus) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li class='item-content item-input'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title item-label'>observação</div>" +
                  "<div class='item-input-wrap'>" +
                    "<textarea readonly>" + gmWkRsqlCML[i].mv_obse.trim().toUpperCase() + "</textarea>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCML = i;

  $("#uulLctoCML").append(lcWkRsql);
}

function pesquisaFichaEntregaEPICML() {
  var loDtDtde = document.getElementById("datDtdeCML");
  var loDtDtat = document.getElementById("datDtatCML");
  var loSlTpme = document.getElementById("sltTpmeCML");
  var loSlClie = document.getElementById("sltClieCML");
  var loSlPesq = document.getElementById("sltPesqCML");
  var lcWkIsql = "",
    lcMvDtde = "",
    lcMvDtat = "",
    lcMvTpme = null,
    lcMvPesq = null,
    lcFuEmpr = null,
    lcIdMatr = null,
    lcIdOrds = null;
  var lnIdClie = 0;
  var lmWkIsql = [],
    lmCdFunc = [],
    lmIdOrds = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (
    loDtDtde.value.toString().trim().length == 0 ||
    htmlDataParaObjetoData(loDtDtde.value.toString().trim()) > ldDtHoje
  ) {
    loDtDtde.valueAsDate = ldDtHoje;
  }

  if (
    loDtDtat.value.toString().trim().length == 0 ||
    htmlDataParaObjetoData(loDtDtat.value.toString().trim()) > ldDtHoje
  ) {
    loDtDtat.valueAsDate = ldDtHoje;
  }

  if (
    htmlDataParaObjetoData(loDtDtde.value.toString().trim()) >
    htmlDataParaObjetoData(loDtDtat.value.toString().trim())
  ) {
    loDtDtde.value = loDtDtat.value;
  }

  lcMvDtde = loDtDtde.value.toString().trim();
  lcMvDtat = loDtDtat.value.toString().trim();

  if (loSlTpme.value.toString().trim().toUpperCase() != "T") {
    lcMvTpme = loSlTpme.value.toString().trim().toUpperCase();
  }

  lcMvPesq = loSlPesq.value.toString().trim().toUpperCase();

  if (lcMvPesq.trim().toUpperCase() == "F") {
    try {
      lmCdFunc = app.smartSelect.get(".clsFuncCML").getValue();
    } catch (error) {}

    if (lmCdFunc.length > 0) {
      lcFuEmpr = "";
      lcIdMatr = "";

      for (var i = 0; i < lmCdFunc.length; i++) {
        lcFuEmpr += lmCdFunc[i].split("/")[0].trim().toUpperCase() + "|";
        lcIdMatr += lmCdFunc[i].split("/")[1].trim() + "|";
      }

      lcFuEmpr = lcFuEmpr.slice(0, -1);
      lcIdMatr = lcIdMatr.slice(0, -1);
    }
  } else if (lcMvPesq.trim().toUpperCase() == "P") {
    try {
      lmIdOrds = app.smartSelect.get(".clsOrdsCML").getValue();
    } catch (error) {}

    if (lmIdOrds.length > 0) {
      lcIdOrds = "";

      for (var i = 0; i < lmIdOrds.length; i++) {
        lcIdOrds += lmIdOrds[i].trim() + "|";
      }

      lcIdOrds = lcIdOrds.slice(0, -1);
    }
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldMvDtde", pa_tipo: "SmallDatetime", pa_valo: lcMvDtde },
    { pa_nome: "ldMvDtat", pa_tipo: "SmallDatetime", pa_valo: lcMvDtat },
    { pa_nome: "lcMvTpme", pa_tipo: "VarChar", pa_valo: lcMvTpme },
    { pa_nome: "lcMvPesq", pa_tipo: "VarChar", pa_valo: lcMvPesq },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lcIdMatr", pa_tipo: "VarChar", pa_valo: lcIdMatr },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFichaEntregaEPI",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmMvMvtoCML = lmWkRsql;
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaMovimentacoesEstoqueCML() {
  var loDvFabm = document.getElementById("divFabmCML");
  var loDvFabw = document.getElementById("divFabwCML");
  var loDvLcto = document.getElementById("divLctoCML");
  var loDtDtde = document.getElementById("datDtdeCML");
  var loDtDtat = document.getElementById("datDtatCML");
  var loSlTpme = document.getElementById("sltTpmeCML");
  var loSlClie = document.getElementById("sltClieCML");
  var loSlPesq = document.getElementById("sltPesqCML");
  var loDvQtsa = document.getElementById("divQtsaCML");
  var loDvQten = document.getElementById("divQtenCML");
  var loDvQtde = document.getElementById("divQtdeCML");
  var loDvTcsa = document.getElementById("divTcsaCML");
  var loDvTcen = document.getElementById("divTcenCML");
  var loDvTcus = document.getElementById("divTcusCML");
  var loDvLoad = document.getElementById("divLoadCML");
  var lcWkIsql = "",
    lcMvDtde = "",
    lcMvDtat = "",
    lcMvTpme = null,
    lcMvPesq = null,
    lcFuEmpr = null,
    lcIdMatr = null,
    lcIdOrds = null;
  var lnIdClie = 0,
    lnMvQtsa = 0,
    lnMvQten = 0,
    lnMvTcsa = 0,
    lnMvTcen = 0;
  var lmWkIsql = [],
    lmCdFunc = [],
    lmIdOrds = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (
    loDtDtde.value.toString().trim().length == 0 ||
    htmlDataParaObjetoData(loDtDtde.value.toString().trim()) > ldDtHoje
  ) {
    loDtDtde.valueAsDate = ldDtHoje;
  }

  if (
    loDtDtat.value.toString().trim().length == 0 ||
    htmlDataParaObjetoData(loDtDtat.value.toString().trim()) > ldDtHoje
  ) {
    loDtDtat.valueAsDate = ldDtHoje;
  }

  if (
    htmlDataParaObjetoData(loDtDtde.value.toString().trim()) >
    htmlDataParaObjetoData(loDtDtat.value.toString().trim())
  ) {
    loDtDtde.value = loDtDtat.value;
  }

  lcMvDtde = loDtDtde.value.toString().trim();
  lcMvDtat = loDtDtat.value.toString().trim();

  if (loSlTpme.value.toString().trim().toUpperCase() != "T") {
    lcMvTpme = loSlTpme.value.toString().trim().toUpperCase();
  }

  lcMvPesq = loSlPesq.value.toString().trim().toUpperCase();

  if (lcMvPesq.trim().toUpperCase() == "F") {
    try {
      lmCdFunc = app.smartSelect.get(".clsFuncCML").getValue();
    } catch (error) {}

    if (lmCdFunc.length > 0) {
      lcFuEmpr = "";
      lcIdMatr = "";

      for (var i = 0; i < lmCdFunc.length; i++) {
        lcFuEmpr += lmCdFunc[i].split("/")[0].trim().toUpperCase() + "|";
        lcIdMatr += lmCdFunc[i].split("/")[1].trim() + "|";
      }

      lcFuEmpr = lcFuEmpr.slice(0, -1);
      lcIdMatr = lcIdMatr.slice(0, -1);
    }
  } else if (lcMvPesq.trim().toUpperCase() == "P") {
    try {
      lmIdOrds = app.smartSelect.get(".clsOrdsCML").getValue();
    } catch (error) {}

    if (lmIdOrds.length > 0) {
      lcIdOrds = "";

      for (var i = 0; i < lmIdOrds.length; i++) {
        lcIdOrds += lmIdOrds[i].trim() + "|";
      }

      lcIdOrds = lcIdOrds.slice(0, -1);
    }
  }

  pesquisaFichaEntregaEPICML();

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldMvDtde", pa_tipo: "SmallDatetime", pa_valo: lcMvDtde },
    { pa_nome: "ldMvDtat", pa_tipo: "SmallDatetime", pa_valo: lcMvDtat },
    { pa_nome: "lcMvTpme", pa_tipo: "VarChar", pa_valo: lcMvTpme },
    { pa_nome: "lcMvPesq", pa_tipo: "VarChar", pa_valo: lcMvPesq },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lcIdMatr", pa_tipo: "VarChar", pa_valo: lcIdMatr },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCML();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaMovimentacoesEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlCML = lmWkRsql;

      for (var i = 0; i < gmWkRsqlCML.length; i++) {
        if (parseInt(gmWkRsqlCML[i].mv_fepi) > 0) {
          if (isMobile()) {
            loDvFabm.style.display = "";
          } else {
            loDvFabw.style.display = "";
          }
        }

        if (gmWkRsqlCML[i].mv_tpme.trim().toUpperCase() == "E") {
          lnMvQten += parseFloat(gmWkRsqlCML[i].mv_qtde);
          lnMvTcen += parseFloat(gmWkRsqlCML[i].mv_tcus);
        } else if (gmWkRsqlCML[i].mv_tpme.trim().toUpperCase() == "S") {
          lnMvQtsa += parseFloat(gmWkRsqlCML[i].mv_qtde);
          lnMvTcsa += parseFloat(gmWkRsqlCML[i].mv_tcus);
        }
      }

      if (lnMvQtsa > 0) {
        loDvQtsa.innerHTML = brDecimal(-lnMvQtsa);
      }

      if (lnMvQten > 0) {
        loDvQten.innerHTML = brDecimal(lnMvQten);
      }

      if (lnMvQten - lnMvQtsa != 0) {
        loDvQtde.innerHTML = brDecimal(lnMvQten - lnMvQtsa);

        if (lnMvQten - lnMvQtsa > 0) {
          loDvQtde.style.color = "lightblue";
        } else if (lnMvQten - lnMvQtsa < 0) {
          loDvQtde.style.color = "indianred";
        }
      }

      if (lnMvTcsa > 0) {
        loDvTcsa.innerHTML = brMoney(-lnMvTcsa);
      }

      if (lnMvTcen > 0) {
        loDvTcen.innerHTML = brMoney(lnMvTcen);
      }

      if (lnMvTcen - lnMvTcsa != 0) {
        loDvTcus.innerHTML = brMoney(lnMvTcen - lnMvTcsa);

        if (lnMvTcen - lnMvTcsa > 0) {
          loDvTcus.style.color = "lightblue";
        } else if (lnMvTcen - lnMvTcsa < 0) {
          loDvTcus.style.color = "indianred";
        }
      }

      montaMovimentacoesEstoqueCML();

      loDvLcto.onscroll = function () {
        if (
          loDvLcto.scrollHeight - loDvLcto.scrollTop - loDvLcto.clientHeight <
          1
        ) {
          montaMovimentacoesEstoqueCML();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function fichaEntregaEPICML(lnFeVisu) {
  var ldDtHoje = new Date();
  var lcFiHtml = "",
    lcShTitu = "arquivo pdf referente à ficha de entrega de epi",
    lcShSbti = "ficha de entrega de epi",
    lcMvTpme = "",
    lcFeMatr = "",
    lcMvImge = "";

  if (gmMvMvtoCML.length == 0) {
    alerta("relatório sem conteúdo", "alerta");

    return;
  }

  //prettier-ignore
  lcFiHtml +=
    "<html>" +
      "<style>" +
        "@media print {" +
          "@page {" +
            "size: A4;" +
            "margin: 1.5cm 1.5cm 3cm 1.5cm;" +
          "}" +              
          ".footer {" +
            "position: fixed;" +
            "bottom: 0;" +
            "left: 0;" +
            "right: 0;" +
            "text-align: center;" +
            "font-size: 10px;" +
            "padding: 0px 0;" +
            "border-top: 1px solid #000;" +
            "background: white;" +
          "}" +
          "body {" +
            "padding-bottom: 50px;" +
          "}" +              
          "tr {" +
            "break-inside: avoid;" +
            "page-break-inside: avoid;" +
          "}" +
          ".pagebreak {" +
            "page-break-before: always;" +
          "}" +
        "}" +
        "@media screen {" +
          ".footer {" +
            "display: none;" +
          "}" +
        "}" +
      "</style>" +
      "<body>";

  for (var i = 0; i < gmMvMvtoCML.length; i++) {
    if (
      lcFeMatr.trim().toUpperCase() !=
      gmMvMvtoCML[i].fe_matr.trim().toUpperCase()
    ) {
      if (lcFeMatr.trim().length > 0) {
        //prettier-ignore
        lcFiHtml +=
          "<br />" +
          "<br />" +
          "<div class='pagebreak'></div>";
      }

      lcFeMatr = gmMvMvtoCML[i].fe_matr.trim().toUpperCase();

      //prettier-ignore
      lcFiHtml +=
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'>" + 
              "Recibo e Controle de E.P.I" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center; width: 33%;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/" + gmMvMvtoCML[i].fu_empr.trim().toLowerCase() + ".png' style='width: 150px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'>" + 
              "De " + jsonDate(gmMvMvtoCML[i].mv_dtde) + "<br /> " +
              "Até " +  jsonDate(gmMvMvtoCML[i].mv_dtat) +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>matrícula</span> <br />" +
              "<span style='font-size: small;'>" + gmMvMvtoCML[i].id_matr.toString() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>funcionário</span> <br />" +
              "<span style='font-size: small;'>" + gmMvMvtoCML[i].fu_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>data de admissão</span> <br />" +
              "<span style='font-size: small;'>" + jsonDate(gmMvMvtoCML[i].fu_dtad) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>função</span> <br />" +
              "<span style='font-size: small;'>" + gmMvMvtoCML[i].fu_func.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: small;'>" +
                "Recebi da empresa <b>" + gmMvMvtoCML[i].em_nome.trim().toUpperCase() + ", CNPJ nº " + formataCnpj(gmMvMvtoCML[i].em_cnpj) + "</b>, os EPIs, relacionados que me são fornecidos gratuitamente nos termos do artigo 166 da CLTe NR-6, item 6.5.1<br />" +
                "Declaro estar ciente que, de acordo com o artigo 158 - parágrafo único - letra B e artigo 462, parágrafo 1º da CLT e NR-6 - item 6.7.1 e das normas vigentes da empresa, devo usar obrigatoriamente os equipamentos que são fornecidos para as finalidades a que se destinarem. Declaro ainda estar ciente que devo comunicar meus superiores sobre qualquer irregularidade que venha ocorrer com os equipamentos e que na dispensa ou interrupção da atividade procederei a devolução ou reembolsarei a empresa no caso de dano indevido ou extravio dos equipamentos.<br />" +
                "<b>DECLARO AINDA TER RECEBIDO TREINAMENTO DO DEPARTAMENTO DE SEGURANÇA DO TRABALHO, DE COMO USAR OS EQUIPAMENTOS DE SEGURANÇA, CONFORME NORMA REGULAMENTADORA NR-6 ITEM 6.6.1 LETRA 'C'</b>" +
              "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>tipo</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>data</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>qtde</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>epi</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>ca</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>localização</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>lançamento</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>facial</b>" +
            "</td>" +
          "</tr>";

      for (var j = 0; j < gmMvMvtoCML.length; j++) {
        if (
          lcFeMatr.trim().toUpperCase() ==
          gmMvMvtoCML[j].fe_matr.trim().toUpperCase()
        ) {
          lcMvTpme = "";

          if (gmMvMvtoCML[j].mv_tpme.trim().toUpperCase() == "E") {
            lcMvTpme = "DEVOLUÇÃO";
            lcMvImge =
              goCdUser.ws_wiis.trim().toLowerCase() +
              "fotos/movimentacoes/entradas/" +
              gmMvMvtoCML[j].id_mven.toString() +
              ".png";
          } else if (gmMvMvtoCML[j].mv_tpme.trim().toUpperCase() == "S") {
            lcMvTpme = "SAÍDA";
            lcMvImge =
              goCdUser.ws_wiis.trim().toLowerCase() +
              "fotos/movimentacoes/saidas/" +
              gmMvMvtoCML[j].id_mvsa.toString() +
              ".png";
          }

          //prettier-ignore
          lcFiHtml += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                lcMvTpme +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                jsonDate(gmMvMvtoCML[j].mv_data) +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                brDecimal(gmMvMvtoCML[j].mv_qtde) +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                gmMvMvtoCML[j].du_deno.trim().toUpperCase() +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                gmMvMvtoCML[j].du_canr.trim().toUpperCase() +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                gmMvMvtoCML[j].mv_lati.trim().toUpperCase() + "<br />" +
                gmMvMvtoCML[j].mv_long.trim().toUpperCase() +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                jsonDate(gmMvMvtoCML[j].mv_dtid) + "<br />" +
                jsonHora(gmMvMvtoCML[j].mv_dtid) +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<img src='" + lcMvImge + "' style='width: 75px;' >" +
              "</td>" +
            "</tr>";
        }
      }

      //prettier-ignore
      lcFiHtml +=
        "</table>" +
        "<br />" +
        "<br />" +
        "<div class='footer' style='text-align: center;'>" +
          "EMITIDO EM " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] +
        "</div>";
    }
  }

  //prettier-ignore
  lcFiHtml +=
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
                .fromData(lcFiHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName: "recibo_e_controle_de_epi.pdf",
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
                .fromData(lcFiHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "recibo_e_controle_de_epi.pdf",
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
      .fromData(lcFiHtml, {
        documentSize: "A4",
        type: "share",
        fileName: "recibo_e_controle_de_epi.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    if (lnFeVisu > 0) {
      visualizaImpressao(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        "recibo_e_controle_de_epi",
        lcFiHtml
      );
    } else {
      impressaoPdf(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        "recibo_e_controle_de_epi",
        lcFiHtml
      );
    }
  }
}

function consultaSelectCML(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  for (var i = 0; i < loObSlct.options.length; i++) {
    if (parseInt(loObSlct.options[i].value) == parseInt(loSlHtml.sl_valu)) {
      loObSlct.selectedIndex = i;

      break;
    }
  }
}

function pesquisaSelectCML(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function pesquisaOrdensServicoDataMovimentacaoEstoqueCML() {
  var loDtDtde = document.getElementById("datDtdeCML");
  var loDtDtat = document.getElementById("datDtatCML");
  var loSlClie = document.getElementById("sltClieCML");
  var loLiOrds = document.getElementById("lliOrdsCML");
  var loOgOrds = {};
  var lcWkRsql = "",
    lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdClie = 0;

  //prettier-ignore
  loLiOrds.innerHTML =
    "<a class='item-link smart-select smart-select-init clsOrdsCML' data-open-in='popup' data-searchbar='true' data-searchbar-placeholder='pesquisa de propostas'>" +
      "<select multiple>" +
        "<optgroup id='ogrOrdsCML' label='propostas'></optgroup>" +
      "</select>" +
      "<div class='item-content'>" +
        "<div class='item-inner'>" +
          "<div class='item-title'>propostas</div>" +
        "</div>" +
      "</div>" +
    "</a>";

  app.smartSelect.create({
    el: ".clsOrdsCML",
    openIn: "popup",
    searchbar: true,
    searchbarPlaceholder: "pesquisa de propostas",
  });

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldMvDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)) },
    { pa_nome: "ldMvDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loLiOrds.disabled = true;

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaOrdensServicoDataMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loLiOrds.disabled = false;

      loOgOrds = document.getElementById("ogrOrdsCML");

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_ords.toString() + "'>" + lmWkRsql[i].os_nume.trim().toUpperCase() + " - " + lmWkRsql[i].os_desc.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loOgOrds.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loLiOrds.disabled = false;
    },
  });
}

function pesquisaFuncionariosDataMovimentacaoEstoqueCML() {
  var loDtDtde = document.getElementById("datDtdeCML");
  var loDtDtat = document.getElementById("datDtatCML");
  var loSlClie = document.getElementById("sltClieCML");
  var loLiFunc = document.getElementById("lliFuncCML");
  var loOgFunc = {};
  var lcWkRsql = "",
    lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdClie = 0;

  //prettier-ignore
  loLiFunc.innerHTML =
    "<a class='item-link smart-select smart-select-init clsFuncCML' data-open-in='popup' data-searchbar='true' data-searchbar-placeholder='pesquisa de funcionários'>" +
      "<select multiple>" +
        "<optgroup id='ogrFuncCML' label='funcionários'></optgroup>" +
      "</select>" +
      "<div class='item-content'>" +
        "<div class='item-inner'>" +
          "<div class='item-title'>funcionários</div>" +
        "</div>" +
      "</div>" +
    "</a>";

  app.smartSelect.create({
    el: ".clsFuncCML",
    openIn: "popup",
    searchbar: true,
    searchbarPlaceholder: "pesquisa de funcionários",
  });

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldMvDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)) },
    { pa_nome: "ldMvDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loLiFunc.disabled = true;

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFuncionariosDataMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loLiFunc.disabled = false;

      loOgFunc = document.getElementById("ogrFuncCML");

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].fu_empr.trim().toUpperCase() + "/" + lmWkRsql[i].id_matr.toString() + "'>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loOgFunc.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loLiFunc.disabled = false;
    },
  });
}

function alteraClienteCML() {
  pesquisaFuncionariosDataMovimentacaoEstoqueCML();
  pesquisaOrdensServicoDataMovimentacaoEstoqueCML();
}

function pesquisaObrasDataMovimentacaoEstoqueCML() {
  var loDtDtde = document.getElementById("datDtdeCML");
  var loDtDtat = document.getElementById("datDtatCML");
  var loDvClie = document.getElementById("divClieCML");
  var loSlClie = document.getElementById("sltClieCML");
  var lcWkRsql = "<option value='0'></option>",
    lcWkIsql = "",
    lcMvDtde = "",
    lcMvDtat = "";
  var lmWkIsql = [],
    lmSlHtml = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (
    loDtDtde.value.toString().trim().length == 0 ||
    htmlDataParaObjetoData(loDtDtde.value.toString().trim()) > ldDtHoje
  ) {
    loDtDtde.valueAsDate = ldDtHoje;
  }

  if (
    loDtDtat.value.toString().trim().length == 0 ||
    htmlDataParaObjetoData(loDtDtat.value.toString().trim()) > ldDtHoje
  ) {
    loDtDtat.valueAsDate = ldDtHoje;
  }

  if (
    htmlDataParaObjetoData(loDtDtde.value.toString().trim()) >
    htmlDataParaObjetoData(loDtDtat.value.toString().trim())
  ) {
    loDtDtde.value = loDtDtat.value;
  }

  lcMvDtde = loDtDtde.value.toString().trim();
  lcMvDtat = loDtDtat.value.toString().trim();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldMvDtde", pa_tipo: "SmallDatetime", pa_valo: lcMvDtde },
    { pa_nome: "ldMvDtat", pa_tipo: "SmallDatetime", pa_valo: lcMvDtat },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlClie.disabled = true;

  loSlClie.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDataMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlClie.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltClieCML",
            sl_valu: parseInt(lmWkRsql[i].id_clie),
            sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            sl_titl: "pesquisa de obras",
          });

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcWkRsql;

      alteraClienteCML();

      loDvClie.onclick = function () {
        pesquisaSelectCML(lmSlHtml);
      };
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.disabled = false;

      loSlClie.innerHTML = lcWkRsql;

      alteraClienteCML();

      loDvClie.onclick = function () {
        pesquisaSelectCML([]);
      };
    },
  });
}

function alteraPesquisaCML() {
  var loSlPesq = document.getElementById("sltPesqCML");
  var loLiFunc = document.getElementById("lliFuncCML");
  var loLiOrds = document.getElementById("lliOrdsCML");

  if (loSlPesq.value.toString().trim().toUpperCase() == "F") {
    loLiFunc.style.display = "";
    loLiOrds.style.display = "none";
  } else if (loSlPesq.value.toString().trim().toUpperCase() == "P") {
    loLiFunc.style.display = "none";
    loLiOrds.style.display = "";
  } else {
    loLiFunc.style.display = "none";
    loLiOrds.style.display = "none";
  }
}

function limpaCamposCML() {
  var loDvFabm = document.getElementById("divFabmCML");
  var loDvFabw = document.getElementById("divFabwCML");
  var loDvLcto = document.getElementById("divLctoCML");
  var loDvQtsa = document.getElementById("divQtsaCML");
  var loDvQten = document.getElementById("divQtenCML");
  var loDvQtde = document.getElementById("divQtdeCML");
  var loDvTcsa = document.getElementById("divTcsaCML");
  var loDvTcen = document.getElementById("divTcenCML");
  var loDvTcus = document.getElementById("divTcusCML");
  var loUlLcto = document.getElementById("uulLctoCML");
  var loDvLoad = document.getElementById("divLoadCML");

  gmWkRsqlCML = [];
  gmMvMvtoCML = [];
  gnInListCML = 0;

  loDvFabm.style.display = "none";
  loDvFabw.style.display = "none";

  loDvLcto.onscroll = function () {};

  loDvQtsa.innerHTML = "";
  loDvQten.innerHTML = "";
  loDvQtde.innerHTML = "";
  loDvTcsa.innerHTML = "";
  loDvTcen.innerHTML = "";
  loDvTcus.innerHTML = "";
  loUlLcto.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CestMvLcto() {
  var loDtDtde = document.getElementById("datDtdeCML");
  var loDtDtat = document.getElementById("datDtatCML");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setDate(ldDtHoje.getDate() - 7);

  loDtDtde.valueAsDate = ldDtHoje;

  limpaCamposCML();
  alteraPesquisaCML();
  pesquisaObrasDataMovimentacaoEstoqueCML();
}
