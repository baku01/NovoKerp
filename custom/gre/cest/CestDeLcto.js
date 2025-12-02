var gmWkRsqlCDL = [];
var gnInListCDL = 0;

function pesquisaCadastrosEstoqueDevolucaoEstoqueCDL(lcDeLcto) {
  var loDeLcto = JSON.parse(unescape(lcDeLcto));

  sessionStorage.setItem("soDeLcto", JSON.stringify(loDeLcto));

  redireciona("custom/gre/cest/CestDeMvto.html", "CestDeMvto.html");
}

function montaDevolucoesEstoqueCDL() {
  var loDvLcto = document.getElementById("divLctoCDL");
  var loDvLoad = document.getElementById("divLoadCDL");
  var lcWkRsql = "",
    lcApUser = "",
    lcDLDpre = "",
    lcDLObse = "",
    lcDlDenv = "",
    lcDlUcon = "",
    lcDlDcon = "",
    lcDlDrec = "",
    lcStVcor = "",
    lcFrClor = "";
  var lnFnList = 0;

  if (gnInListCDL + 20 >= gmWkRsqlCDL.length) {
    loDvLcto.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCDL.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCDL + 20;
  }

  for (var i = gnInListCDL; i < lnFnList; i++) {
    lcStVcor = "";
    lcFrClor = "";
    lcApUser = "";
    lcDlDenv = "";
    lcDlUcon = "";
    lcDlDcon = "";
    lcDLDpre = "";
    lcDlDrec = "";
    lcDLObse = "";

    if (gmWkRsqlCDL[i].st_vcor.trim().length > 0) {
      lcStVcor =
        " style='color: rgb( " +
        gmWkRsqlCDL[i].st_vcor.trim().toUpperCase() +
        " );'";

      if (
        parseInt(gmWkRsqlCDL[i].id_situ) == 35 &&
        jsonDate(gmWkRsqlCDL[i].dl_dcon).trim().length > 0
      ) {
        lcFrClor = " style='color: rgb( 255, 160, 196 );'";
      }
    }

    if (gmWkRsqlCDL[i].ap_user.trim().length > 0) {
      //prettier-ignore
      lcApUser = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">usuário aprovação da devolução de estoque</div>" +
            "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCDL[i].ap_user.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>" +
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data aprovação da devolução de estoque</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCDL[i].ap_data) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCDL[i].dl_denv).trim().length > 0) {
      //prettier-ignore
      lcDlDenv = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data do envio</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCDL[i].dl_denv) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (gmWkRsqlCDL[i].dl_ucon.trim().length > 0) {
      //prettier-ignore
      lcDlUcon = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">usuário contestação</div>" +
            "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCDL[i].dl_ucon.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCDL[i].dl_dcon).trim().length > 0) {
      //prettier-ignore
      lcDlDcon = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data contestação</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCDL[i].dl_dcon) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCDL[i].dl_dpre).trim().length > 0) {
      //prettier-ignore
      lcDLDpre = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data de previsão de entrega</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCDL[i].dl_dpre) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCDL[i].dl_drec).trim().length > 0) {
      //prettier-ignore
      lcDlDrec = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data do recebimento</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCDL[i].dl_drec) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (gmWkRsqlCDL[i].dl_obse.trim().length > 0) {
      //prettier-ignore
      lcDLObse = 
      "<li class='item-content item-input'>" +
        "<div class='item-inner'>" +
          "<div class='item-title item-label'" + lcFrClor + ">observação da devolução de estoque</div>" +
          "<div class='item-input-wrap'>" +
            "<textarea readonly" + lcFrClor + ">" + gmWkRsqlCDL[i].dl_obse.trim().toUpperCase() + "</textarea>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='pesquisaCadastrosEstoqueDevolucaoEstoqueCDL(\"" + escape(JSON.stringify(gmWkRsqlCDL[i])) + "\");'>" +
            "<i class='material-icons'" + lcStVcor + ">info</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b" + lcFrClor + ">" + gmWkRsqlCDL[i].cl_fant.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b" + lcFrClor + ">" + brDecimal(gmWkRsqlCDL[i].dl_qtde) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">código da devolução de estoque</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCDL[i].id_dves.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">data de criação da devolução de estoque</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCDL[i].dl_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">obra da devolução de estoque</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCDL[i].cl_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">situação da devolução de estoque</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCDL[i].st_deno.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">quantidade da devolução de estoque</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + brDecimal(gmWkRsqlCDL[i].dl_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">custo da devolução de estoque</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + brMoney(gmWkRsqlCDL[i].dl_pcus) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">usuário solicitante</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCDL[i].dl_user.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcApUser +
              lcDlDenv +
              lcDlUcon +
              lcDlDcon +
              lcDLDpre +
              lcDlDrec +
              lcDLObse +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCDL = i;

  $("#uulLctoCDL").append(lcWkRsql);
}

function pesquisaDevolucoesEstoqueCDL() {
  var loDvLcto = document.getElementById("divLctoCDL");
  var loDtDtde = document.getElementById("datDtdeCDL");
  var loDtDtat = document.getElementById("datDtatCDL");
  var loSlSitu = document.getElementById("sltSituCDL");
  var loSlClie = document.getElementById("sltClieCDL");
  var loDvLoad = document.getElementById("divLoadCDL");
  var lcWkIsql = "",
    lcDlDtde = "",
    lcDlDtat = "";
  var lnIdClie = null,
    lnIdSitu = null;
  var lmWkIsql = [];
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

  lcDlDtde = loDtDtde.value.toString().trim();
  lcDlDtat = loDtDtat.value.toString().trim();

  try {
    if (parseInt(loSlSitu.value) > 0) {
      lnIdSitu = parseInt(loSlSitu.value);
    }
  } catch (error) {}

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDlDtde", pa_tipo: "SmallDatetime", pa_valo: lcDlDtde },
    { pa_nome: "ldDlDtat", pa_tipo: "SmallDatetime", pa_valo: lcDlDtat },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: lnIdSitu },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCDL();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDevolucoesEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlCDL = lmWkRsql;

      montaDevolucoesEstoqueCDL();

      loDvLcto.onscroll = function () {
        if (
          loDvLcto.scrollHeight - loDvLcto.scrollTop - loDvLcto.clientHeight <
          1
        ) {
          montaDevolucoesEstoqueCDL();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function pesquisaObrasDefinidasPeriodoCDL() {
  var loDtDtde = document.getElementById("datDtdeCDL");
  var loDtDtat = document.getElementById("datDtatCDL");
  var loSlClie = document.getElementById("sltClieCDL");
  var lcWkRsql = "<option value='0'>TODAS AS OBRAS</option>",
    lcWkIsql = "",
    lcDlDtde = "",
    lcDlDtat = "";
  var lmWkIsql = [];
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

  lcDlDtde = loDtDtde.value.toString().trim();
  lcDlDtat = loDtDtat.value.toString().trim();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrDtde", pa_tipo: "SmallDatetime", pa_valo: lcDlDtde },
    { pa_nome: "ldDrDtat", pa_tipo: "SmallDatetime", pa_valo: lcDlDtat },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlClie.disabled = true;

  loSlClie.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidasPeriodo",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlClie.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          if (lmWkRsql[i].cl_fant.trim().toUpperCase().indexOf("REAL") < 0) {
            //prettier-ignore
            lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
          }
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcWkRsql;

      pesquisaDevolucoesEstoqueCDL();
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.disabled = false;

      loSlClie.innerHTML = lcWkRsql;

      pesquisaDevolucoesEstoqueCDL();
    },
  });
}

function pesquisaSituacoesCDL() {
  var loSlSitu = document.getElementById("sltSituCDL");
  var lcWkRsql = "<option value='0'>TODAS AS SITUAÇÕES</option>",
    lcWkIsql = "",
    lcSlSlct = "";
  var lmWkIsql = [];

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnStTrnf", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "lnStDevl", pa_tipo: "Int", pa_valo: 1 },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlSitu.disabled = true;

  loSlSitu.innerHTML = "<option value='0'>CARREGANDO SITUAÇÕES...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSituacoes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlSitu.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          if (parseInt(lmWkRsql[i].id_situ) == parseInt(lmWkRsql[i].st_ativ)) {
            lcSlSlct = " selected";
          } else {
            lcSlSlct = "";
          }

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_situ.toString() + "' style='background-color: rgb( " + lmWkRsql[i].st_vcor.trim().toUpperCase() + " );'" + lcSlSlct + ">" + lmWkRsql[i].st_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlSitu.innerHTML = lcWkRsql;

      pesquisaObrasDefinidasPeriodoCDL();
    },
    error: function (jqXHR, textStatus, err) {
      loSlSitu.disabled = false;

      loSlSitu.innerHTML = lcWkRsql;

      pesquisaObrasDefinidasPeriodoCDL();
    },
  });
}

function limpaCamposCDL() {
  var loDvLcto = document.getElementById("divLctoCDL");
  var loUlLcto = document.getElementById("uulLctoCDL");
  var loDvLoad = document.getElementById("divLoadCDL");

  gmWkRsqlCDL = [];
  gnInListCDL = 0;

  loDvLcto.onscroll = function () {};

  loUlLcto.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CestDeLcto() {
  var loDtDtde = document.getElementById("datDtdeCDL");
  var loDtDtat = document.getElementById("datDtatCDL");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setMonth(ldDtHoje.getMonth() - 1);

  loDtDtde.valueAsDate = ldDtHoje;

  limpaCamposCDL();
  pesquisaSituacoesCDL();
}
