var gmWkRsqlPOL = [];
var gnInListPOL = 0;

function pesquisaItensOrdemServicoProducaoPOL(lcOsLcto) {
  var loOsLcto = JSON.parse(unescape(lcOsLcto));

  sessionStorage.setItem("soOsLcto", JSON.stringify(loOsLcto));

  redireciona("custom/gre/pcpr/PcprOsItem.html", "PcprOsItem.html");
}

function montaOrdensServicoProducaoPOL() {
  var loDvLcto = document.getElementById("divLctoPOL");
  var loDvLoad = document.getElementById("divLoadPOL");
  var lcWkRsql = "";
  var lnFnList = 0;

  if (gnInListPOL + 20 >= gmWkRsqlPOL.length) {
    loDvLcto.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlPOL.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListPOL + 20;
  }

  for (var i = gnInListPOL; i < lnFnList; i++) {
    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='pesquisaItensOrdemServicoProducaoPOL(\"" + escape(JSON.stringify(gmWkRsqlPOL[i])) + "\");'>" +
            "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmWkRsqlPOL[i].po_desc.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + gmWkRsqlPOL[i].po_nume.toString() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>número</div>" +
                    "<div class='item-after'>" + gmWkRsqlPOL[i].po_nume.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlPOL[i].po_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>obra</div>" +
                    "<div class='item-after'>" + gmWkRsqlPOL[i].cl_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>proposta</div>" +
                    "<div class='item-after'>" + gmWkRsqlPOL[i].os_nume.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>planejador</div>" +
                    "<div class='item-after'>" + gmWkRsqlPOL[i].po_plan.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>solicitante</div>" +
                    "<div class='item-after'>" + gmWkRsqlPOL[i].po_soli.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data da necessidade</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlPOL[i].po_dtnc) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data da previsão de início</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlPOL[i].po_dtpi) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>horas disponíveis</div>" +
                    "<div class='item-after'>" + pad(gmWkRsqlPOL[i].po_hrdi.toFixed(2), 5).replace(".", ":") + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>situação</div>" +
                    "<div class='item-after'>" + gmWkRsqlPOL[i].ps_situ.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li class='item-content item-input'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title item-label'>descrição</div>" +
                  "<div class='item-input-wrap'>" +
                    "<textarea readonly>" + gmWkRsqlPOL[i].po_desc.trim().toUpperCase() + "</textarea>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListPOL = i;

  $("#uulLctoPOL").append(lcWkRsql);
}

function pesquisaOrdensServicoProducaoPOL() {
  var loDtDtde = document.getElementById("datDtdePOL");
  var loDtDtat = document.getElementById("datDtatPOL");
  var loDvLcto = document.getElementById("divLctoPOL");
  var loSlObra = document.getElementById("sltObraPOL");
  var loSlProp = document.getElementById("sltPropPOL");
  var loDvQtde = document.getElementById("divQtdePOL");
  var loDvLoad = document.getElementById("divLoadPOL");
  var lcWkIsql = "",
    lcDrDtde = loDtDtde.value.toString().trim(),
    lcDrDtat = loDtDtat.value.toString().trim();
  var lnIdClie = null,
    lnMvQten = 0,
    lnIdOrds = null,
    lnPoQtde = 0;
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  if (lcDrDtde.trim().length == 0) {
    alerta("data inicial obrigatória", "alerta");

    return;
  }

  if (lcDrDtat.trim().length == 0) {
    alerta("data final obrigatória", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(lcDrDtde) > htmlDataParaObjetoData(lcDrDtat)) {
    alerta("data inicial maior que data final", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(lcDrDtde) > ldDtHoje) {
    alerta("data inicial maior que data atual", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(lcDrDtat) > ldDtHoje) {
    alerta("data final maior que data atual", "alerta");

    return;
  }

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0]) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0]);
    }
  } catch (error) {}

  try {
    if (parseInt(loSlProp.value) > 0) {
      lnIdOrds = parseInt(loSlProp.value);
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrDtde", pa_tipo: "SmallDateTime", pa_valo: lcDrDtde },
    { pa_nome: "ldDrDtat", pa_tipo: "SmallDateTime", pa_valo: lcDrDtat },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposPOL();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaOrdensServicoProducao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlPOL = lmWkRsql;

      for (var i = 0; i < gmWkRsqlPOL.length; i++) {
        lnPoQtde++;
      }

      if (lnMvQten > 0) {
        loDvQtde.innerHTML = lnPoQtde.toString();
      }

      montaOrdensServicoProducaoPOL();

      loDvLcto.onscroll = function () {
        if (
          loDvLcto.scrollHeight - loDvLcto.scrollTop - loDvLcto.clientHeight <
          1
        ) {
          montaOrdensServicoProducaoPOL();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function alteraDataPOL(loDtData) {
  var loDtDtde = document.getElementById("datDtdePOL");
  var loDtDtat = document.getElementById("datDtatPOL");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.defaultValue == loDtData.value) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.value = loDtData.defaultValue;
  }

  if (
    htmlDataParaObjetoData(loDtDtde.value) >
    htmlDataParaObjetoData(loDtDtat.value)
  ) {
    loDtData.value = loDtData.defaultValue;

    return;
  }

  if (htmlDataParaObjetoData(loDtDtde.value) > ldDtHoje) {
    loDtData.value = loDtData.defaultValue;

    return;
  }

  if (htmlDataParaObjetoData(loDtDtat.value) > ldDtHoje) {
    loDtData.value = loDtData.defaultValue;

    return;
  }

  pesquisaObrasDefinidasPorPeriodoPOL();
}

function pesquisaPropostasPOL() {
  var loSlObra = document.getElementById("sltObraPOL");
  var loDvProp = document.getElementById("divPropPOL");
  var loSlProp = document.getElementById("sltPropPOL");
  var lcSlRsql = "<option value='0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [],
    lmSlHtml = [];
  var lnIdCadt = 0;

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1]) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1]);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    loSlProp.innerHTML = lcSlRsql;

    loDvProp.onclick = function () {
      pesquisaSelectPOL([]);
    };

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

  loSlProp.innerHTML = "<option value='0'>CARREGANDO PROPOSTAS...</option>";

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
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltPropPOL",
            sl_valu: parseInt(lmWkRsql[i].id_ords),
            sl_text:
              lmWkRsql[i].os_nume.trim().toUpperCase() +
              " - " +
              lmWkRsql[i].os_desc.trim().toUpperCase(),
            sl_titl: "pesquisa de propostas",
          });

          //prettier-ignore
          lcSlRsql += "<option value='" + lmWkRsql[i].id_ords.toString() + "'>" + lmWkRsql[i].os_nume.trim().toUpperCase() + " - " + lmWkRsql[i].os_desc.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlProp.innerHTML = lcSlRsql;

      loDvProp.onclick = function () {
        pesquisaSelectPOL(lmSlHtml);
      };
    },
    error: function (jqXHR, textStatus, err) {
      loSlProp.innerHTML = lcSlRsql;

      loDvProp.onclick = function () {
        pesquisaSelectPOL(lmSlHtml);
      };
    },
  });
}

function consultaSelectPOL(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  if (loSlHtml.id_slct.trim().toUpperCase() == "SLTOBRAPOL") {
    for (var i = 0; i < loObSlct.options.length; i++) {
      if (
        parseInt(loObSlct.options[i].value.toString().split("/")[0]) ==
        parseInt(loSlHtml.sl_valu)
      ) {
        loObSlct.selectedIndex = i;

        break;
      }
    }

    pesquisaPropostasPOL();
  }

  if (loSlHtml.id_slct.trim().toUpperCase() == "SLTPROPPOL") {
    for (var i = 0; i < loObSlct.options.length; i++) {
      if (parseInt(loObSlct.options[i].value) == parseInt(loSlHtml.sl_valu)) {
        loObSlct.selectedIndex = i;

        break;
      }
    }
  }
}

function pesquisaSelectPOL(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function pesquisaObrasDefinidasPorPeriodoPOL() {
  var loDtDtde = document.getElementById("datDtdePOL");
  var loDtDtat = document.getElementById("datDtatPOL");
  var loDvObra = document.getElementById("divObraPOL");
  var loSlObra = document.getElementById("sltObraPOL");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "",
    lcDrDtde = loDtDtde.value.toString().trim(),
    lcDrDtat = loDtDtat.value.toString().trim();
  var lmWkIsql = [],
    lmSlHtml = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (lcDrDtde.trim().length == 0) {
    alerta("data inicial obrigatória", "alerta");

    return;
  }

  if (lcDrDtat.trim().length == 0) {
    alerta("data final obrigatória", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(lcDrDtde) > htmlDataParaObjetoData(lcDrDtat)) {
    alerta("data inicial maior que data final", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(lcDrDtde) > ldDtHoje) {
    alerta("data inicial maior que data atual", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(lcDrDtat) > ldDtHoje) {
    alerta("data final maior que data atual", "alerta");

    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrDtde", pa_tipo: "SmallDateTime", pa_valo: lcDrDtde },
    { pa_nome: "ldDrDtat", pa_tipo: "SmallDateTime", pa_valo: lcDrDtat },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidasPorPeriodo",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlObra.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltObraPOL",
            sl_valu: parseInt(lmWkRsql[i].id_clie),
            sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            sl_titl: "pesquisa de obras",
          });

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlObra.innerHTML = lcWkRsql;

      loDvObra.onclick = function () {
        pesquisaSelectPOL(lmSlHtml);
      };
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcWkRsql;

      loDvObra.onclick = function () {
        pesquisaSelectPOL([]);
      };
    },
  });
}

function limpaCamposPOL() {
  var loDvLcto = document.getElementById("divLctoPOL");
  var loDvQtde = document.getElementById("divQtdePOL");
  var loUlLcto = document.getElementById("uulLctoPOL");
  var loDvLoad = document.getElementById("divLoadPOL");

  gmWkRsqlPOL = [];
  gnInListPOL = 0;

  loDvLcto.onscroll = function () {};

  loDvQtde.innerHTML = "";
  loUlLcto.innerHTML = "";

  loDvLoad.style.display = "none";
}

function PcprOsLcto() {
  var loDtDtde = document.getElementById("datDtdePOL");
  var loDtDtat = document.getElementById("datDtatPOL");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setMonth(ldDtHoje.getMonth() - 1);

  loDtDtde.valueAsDate = ldDtHoje;

  limpaCamposPOL();
  pesquisaObrasDefinidasPorPeriodoPOL();
  pesquisaOrdensServicoProducaoPOL();
}
