var gmWkRsqlCSL = [];
var gnInListCSL = 0;

function pesquisaCadastrosEstoqueSolicitacaoTransferenciaCSL(lcStLcto) {
  var loStLcto = JSON.parse(unescape(lcStLcto));

  sessionStorage.setItem("soStLcto", JSON.stringify(loStLcto));

  redireciona("custom/gre/cest/CestStMvto.html", "CestStMvto.html");
}

function montaSolicitacoesTransferenciaCSL() {
  var loDvLcto = document.getElementById("divLctoCSL");
  var loDvLoad = document.getElementById("divLoadCSL");
  var lcWkRsql = "",
    lcApUser = "",
    lcSlDpre = "",
    lcSlObse = "",
    lcSlUenv = "",
    lcSlDenv = "",
    lcSlUcon = "",
    lcSlDcon = "",
    lcSlDrec = "",
    lcStVcor = "",
    lcFrClor = "";
  var lnFnList = 0;

  if (gnInListCSL + 20 >= gmWkRsqlCSL.length) {
    loDvLcto.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCSL.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCSL + 20;
  }

  for (var i = gnInListCSL; i < lnFnList; i++) {
    lcStVcor = "";
    lcFrClor = "";
    lcApUser = "";
    lcSlUenv = "";
    lcSlDenv = "";
    lcSlUcon = "";
    lcSlDcon = "";
    lcSlDpre = "";
    lcSlDrec = "";
    lcSlObse = "";

    if (gmWkRsqlCSL[i].st_vcor.trim().length > 0) {
      lcStVcor =
        " style='color: rgb( " +
        gmWkRsqlCSL[i].st_vcor.trim().toUpperCase() +
        " );'";

      if (
        parseInt(gmWkRsqlCSL[i].id_situ) == 36 &&
        jsonDate(gmWkRsqlCSL[i].sl_denv).trim().length > 0
      ) {
        lcFrClor =
          " style='color: rgb( " +
          gmWkRsqlCSL[i].st_vcor.trim().toUpperCase() +
          " );'";
      }

      if (
        parseInt(gmWkRsqlCSL[i].id_situ) == 35 &&
        jsonDate(gmWkRsqlCSL[i].sl_dcon).trim().length > 0
      ) {
        lcFrClor = " style='color: rgb( 255, 160, 196 );'";
      }
    }

    if (gmWkRsqlCSL[i].ap_user.trim().length > 0) {
      //prettier-ignore
      lcApUser = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">usuário aprovação da solicitação de transferência</div>" +
            "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCSL[i].ap_user.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>" +
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data aprovação da solicitação de transferência</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCSL[i].ap_data) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (gmWkRsqlCSL[i].sl_uenv.trim().length > 0) {
      //prettier-ignore
      lcSlUenv = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">usuário envio</div>" +
            "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCSL[i].sl_uenv.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCSL[i].sl_denv).trim().length > 0) {
      //prettier-ignore
      lcSlDenv = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data do envio</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCSL[i].sl_denv) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (gmWkRsqlCSL[i].sl_ucon.trim().length > 0) {
      //prettier-ignore
      lcSlUcon = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">usuário contestação</div>" +
            "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCSL[i].sl_ucon.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCSL[i].sl_dcon).trim().length > 0) {
      //prettier-ignore
      lcSlDcon = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data contestação</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCSL[i].sl_dcon) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCSL[i].sl_dpre).trim().length > 0) {
      //prettier-ignore
      lcSlDpre = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data de previsão de entrega</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCSL[i].sl_dpre) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (jsonDate(gmWkRsqlCSL[i].sl_drec).trim().length > 0) {
      //prettier-ignore
      lcSlDrec = 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'" + lcFrClor + ">data do recebimento</div>" +
            "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCSL[i].sl_drec) + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    if (gmWkRsqlCSL[i].sl_obse.trim().length > 0) {
      //prettier-ignore
      lcSlObse = 
      "<li class='item-content item-input'>" +
        "<div class='item-inner'>" +
          "<div class='item-title item-label'" + lcFrClor + ">observação da solicitação de transferência</div>" +
          "<div class='item-input-wrap'>" +
            "<textarea readonly" + lcFrClor + ">" + gmWkRsqlCSL[i].sl_obse.trim().toUpperCase() + "</textarea>" +
          "</div>" +
        "</div>" +
      "</li>";
    }

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='pesquisaCadastrosEstoqueSolicitacaoTransferenciaCSL(\"" + escape(JSON.stringify(gmWkRsqlCSL[i])) + "\");'>" +
            "<i class='material-icons'" + lcStVcor + ">info</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b" + lcFrClor + ">" + gmWkRsqlCSL[i].cl_fant.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b" + lcFrClor + ">" + brDecimal(gmWkRsqlCSL[i].sl_qtde) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">código da solicitação de transferência</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCSL[i].id_strf.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">data da solicitação de transferência</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCSL[i].sl_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">obra da solicitação de transferência</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCSL[i].cl_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">data da necessidade</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + jsonDate(gmWkRsqlCSL[i].sl_dnec) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">situação da solicitação de transferência</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCSL[i].st_deno.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">quantidade da solicitação de transferência</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + brDecimal(gmWkRsqlCSL[i].sl_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">custo da solicitação de transferência</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + brMoney(gmWkRsqlCSL[i].sl_pcus) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcFrClor + ">usuário solicitante</div>" +
                    "<div class='item-after'" + lcFrClor + ">" + gmWkRsqlCSL[i].sl_user.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcApUser +
              lcSlUenv +
              lcSlDenv +
              lcSlUcon +
              lcSlDcon +
              lcSlDpre +
              lcSlDrec +
              lcSlObse +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCSL = i;

  $("#uulLctoCSL").append(lcWkRsql);
}

function pesquisaSolicitacoesTransferenciaCSL() {
  var loDvLcto = document.getElementById("divLctoCSL");
  var loDtDtde = document.getElementById("datDtdeCSL");
  var loDtDtat = document.getElementById("datDtatCSL");
  var loSlSitu = document.getElementById("sltSituCSL");
  var loSlObra = document.getElementById("sltObraCSL");
  var loDvLoad = document.getElementById("divLoadCSL");
  var lcWkIsql = "",
    lcSlDtde = "",
    lcSlDtat = "";
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

  lcSlDtde = loDtDtde.value.toString().trim();
  lcSlDtat = loDtDtat.value.toString().trim();

  try {
    if (parseInt(loSlSitu.value) > 0) {
      lnIdSitu = parseInt(loSlSitu.value);
    }
  } catch (error) {}

  try {
    if (parseInt(loSlObra.value) > 0) {
      lnIdClie = parseInt(loSlObra.value);
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldSlDtde", pa_tipo: "SmallDatetime", pa_valo: lcSlDtde },
    { pa_nome: "ldSlDtat", pa_tipo: "SmallDatetime", pa_valo: lcSlDtat },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: lnIdSitu },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCSL();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSolicitacoesTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlCSL = lmWkRsql;

      montaSolicitacoesTransferenciaCSL();

      loDvLcto.onscroll = function () {
        if (
          loDvLcto.scrollHeight - loDvLcto.scrollTop - loDvLcto.clientHeight <
          1
        ) {
          montaSolicitacoesTransferenciaCSL();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function pesquisaObrasDefinidasCSL() {
  var loSlObra = document.getElementById("sltObraCSL");
  var lcWkRsql = "<option value='0'>TODAS AS OBRAS</option>",
    lcWkIsql = "",
    lcDtHoje = "1900-01-01";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcDtHoje = objetoDataParaStringSqlData(ldDtHoje);

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDtHoje },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlObra.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          if (lmWkRsql[i].cl_fant.trim().toUpperCase().indexOf("REAL") < 0) {
            //prettier-ignore
            lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
          }
        }
      } catch (loApErro) {}

      loSlObra.innerHTML = lcWkRsql;

      pesquisaSolicitacoesTransferenciaCSL();
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcWkRsql;

      pesquisaSolicitacoesTransferenciaCSL();
    },
  });
}

function pesquisaSituacoesCSL() {
  var loSlSitu = document.getElementById("sltSituCSL");
  var lcWkRsql = "<option value='0'>TODAS AS SITUAÇÕES</option>",
    lcWkIsql = "",
    lcSlSlct = "";
  var lmWkIsql = [];

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnStTrnf", pa_tipo: "Int", pa_valo: 1 },
    { pa_nome: "lnStDevl", pa_tipo: "Int", pa_valo: null },
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
          if (parseInt(lmWkRsql[i].id_situ) == parseInt(lmWkRsql[i].st_aprv)) {
            lcSlSlct = " selected";
          } else {
            lcSlSlct = "";
          }

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_situ.toString() + "' style='background-color: rgb( " + lmWkRsql[i].st_vcor.trim().toUpperCase() + " );'" + lcSlSlct + ">" + lmWkRsql[i].st_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlSitu.innerHTML = lcWkRsql;

      pesquisaObrasDefinidasCSL();
    },
    error: function (jqXHR, textStatus, err) {
      loSlSitu.disabled = false;

      loSlSitu.innerHTML = lcWkRsql;

      pesquisaObrasDefinidasCSL();
    },
  });
}

function limpaCamposCSL() {
  var loDvLcto = document.getElementById("divLctoCSL");
  var loUlLcto = document.getElementById("uulLctoCSL");
  var loDvLoad = document.getElementById("divLoadCSL");

  gmWkRsqlCSL = [];
  gnInListCSL = 0;

  loDvLcto.onscroll = function () {};

  loUlLcto.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CestStLcto() {
  var loDtDtde = document.getElementById("datDtdeCSL");
  var loDtDtat = document.getElementById("datDtatCSL");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setMonth(ldDtHoje.getMonth() - 1);

  loDtDtde.valueAsDate = ldDtHoje;

  limpaCamposCSL();
  pesquisaSituacoesCSL();
}
