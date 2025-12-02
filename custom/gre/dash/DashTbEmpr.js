var gmDsObraDTE = [],
  gmApDvrgDTE = [],
  gmApPndtDTE = [],
  gmAhHrprDTE = [];
var goSsObraDTE = {};

function alteraDataPosicaoDTE() {
  var loDtData = document.getElementById("datDataDTE");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.defaultValue == loDtData.value) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.valueAsDate = ldDtHoje;
  }

  if (ldDtHoje < htmlDataParaObjetoData(loDtData.value)) {
    loDtData.valueAsDate = ldDtHoje;
  }

  pesquisaDashboardObrasDTE();
}

function redirecionaDashboardObrasDTE() {
  redireciona("custom/gre/dash/DashCdClie.html", "DashCdClie.html");
}

function montaDashboardDTE() {
  var loSlEmpr = document.getElementById("sltEmprTPK");
  var loSlHora = document.getElementById("sltHoraDTE");
  var loDvObra = document.getElementById("divObraDTE");
  var lnOsPhcn = 0,
    lnOsPhtr = 0,
    lnReHrap = 0,
    lnReHtap = 0,
    lnOpQthr = 0,
    lnApDvrg = 0,
    lnApPndt = 0,
    lnApTota = 0,
    lnPrPndt = 0,
    lnRoPndt = 0,
    lnRoTota = 0,
    lnPrRdop = 0,
    lnAhMinu = 0,
    lnQtModi = 0,
    lnQtModa = 0;
  var lcGrClor = "",
    lcWkRsql = "",
    lcSlHora = loSlHora.value.toString().trim().toLowerCase(),
    lcBdThpo = "",
    lcEmFant = loSlEmpr.options[loSlEmpr.selectedIndex].text;
  var lmDsObra = [],
    lmIdCadt = goSsObraDTE.getValue();

  if (lcSlHora.trim().toUpperCase() == "OC_QTHR") {
    lcBdThpo = "hras orçadas:";
  } else {
    lcBdThpo = "hras plan.:";
  }

  for (var i = 0; i < gmDsObraDTE.length; i++) {
    for (var j = 0; j < lmIdCadt.length; j++) {
      if (parseInt(gmDsObraDTE[i].id_cadt) == parseInt(lmIdCadt[j])) {
        lmDsObra.push(gmDsObraDTE[i]);

        break;
      }
    }
  }

  for (var i = 0; i < lmDsObra.length; i++) {
    lnOpQthr += parseInt(lmDsObra[i][lcSlHora]);

    for (var j = 0; j < gmApDvrgDTE.length; j++) {
      if (parseInt(gmApDvrgDTE[j].id_cadt) == parseInt(lmDsObra[i].id_cadt)) {
        lnApDvrg += parseInt(gmApDvrgDTE[j].qt_dvrg);

        break;
      }
    }

    for (var j = 0; j < gmApPndtDTE.length; j++) {
      if (parseInt(gmApPndtDTE[j].id_cadt) == parseInt(lmDsObra[i].id_cadt)) {
        lnApPndt += parseInt(gmApPndtDTE[j].qt_pndt);
        lnApTota += parseInt(gmApPndtDTE[j].qt_tota);

        break;
      }
    }

    lnRoPndt += parseInt(lmDsObra[i].cl_qrdo) - parseInt(lmDsObra[i].cl_qaro);
    lnRoTota += parseInt(lmDsObra[i].cl_qrdo);
    lnQtModi += parseInt(lmDsObra[i].qt_modi);
    lnQtModa += parseInt(lmDsObra[i].qt_moda);
  }

  lnPrPndt = (lnApPndt / lnApTota) * 100;

  if (lnRoTota > 0) {
    lnPrRdop = (lnRoPndt / lnRoTota) * 100;
  }

  //prettier-ignore
  lcWkRsql = 
    "<div class='row'>" +
      "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;' onclick='redirecionaDashboardObrasDTE();'>" +
        "<br /><b>" + lcEmFant.trim().toUpperCase() + "</b><br /><br />" +
        "<div class='gauge clsTr" + gcIdEmpr.trim().toUpperCase() + "DTE'></div><br />" +
        "<div class='gauge clsCl" + gcIdEmpr.trim().toUpperCase() + "DTE'></div><br />" +
        "<b>" + lcBdThpo + "</b> " + lnOpQthr.toString() + ":00" + "<br />" + 
        "<b>apt. dvrgnt.:</b> " + lnApDvrg.toString() + "<br />" + 
        "<b>apt. pend.:</b> " + lnApPndt.toString() + " / " + lnApTota.toString() + " = " + brDecimal(lnPrPndt) + "%<br />" + 
        "<b>rdo pend.:</b> " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br />" + 
        "<b>mod:</b> " + lnQtModi.toString() + "<br />" + 
        "<b>mod atualização:</b> " + lnQtModa.toString() + "<br /><br />" + 
      "</div>" +
    "</div>" +
    "<br />";

  loDvObra.innerHTML = lcWkRsql;

  for (var i = 0; i < lmDsObra.length; i++) {
    lnAhMinu = 0;

    for (var j = 0; j < gmAhHrprDTE.length; j++) {
      if (parseInt(lmDsObra[i].id_clie) == parseInt(gmAhHrprDTE[j].id_clie)) {
        lnAhMinu +=
          Math.floor(gmAhHrprDTE[j].ah_hora) * 60 +
          (parseFloat(gmAhHrprDTE[j].ah_hora) % 1) * 100;
      }
    }

    try {
      if (parseInt(lmDsObra[i].re_hrap) > 0) {
        lnReHrap += parseInt(lmDsObra[i].re_hrap);
      }
    } catch (error) {}

    lnReHrap += Math.floor(lnAhMinu / 60);

    try {
      if (parseInt(lmDsObra[i].re_htap) > 0) {
        lnReHtap += parseInt(lmDsObra[i].re_htap);
      }
    } catch (error) {}

    lnReHtap += Math.floor(lnAhMinu / 60);
  }

  if (lnOpQthr == 0) {
    lnOpQthr = 1;
  }

  if (lnOpQthr > 0) {
    lnOsPhcn = (lnReHrap / lnOpQthr) * 100;
  }

  if (lnOpQthr > 0) {
    lnOsPhtr = (lnReHtap / lnOpQthr) * 100;
  }

  if (lnOsPhcn <= 70) {
    lcGrClor = "rgba( 0, 255, 0, 1 )";
  } else if (lnOsPhcn <= 90) {
    lcGrClor = "rgba( 255, 255, 0, 1 )";
  } else if (lnOsPhcn <= 100) {
    lcGrClor = "rgba( 255, 165, 0, 1 )";
  } else {
    lcGrClor = "rgba( 255, 0, 0, 1 )";
  }

  app.gauge.create({
    el: ".clsCl" + gcIdEmpr.trim().toUpperCase() + "DTE",
    type: "circle",
    value: lnOsPhcn / 100,
    size: 250,
    borderColor: lcGrClor,
    borderWidth: 10,
    valueText: brDecimal(lnOsPhcn) + "%",
    valueFontSize: 35,
    valueTextColor: lcGrClor,
    labelFontSize: 18,
    labelText: "de horas totais consumidas",
  });

  if (lnOsPhtr <= 70) {
    lcGrClor = "rgba( 0, 255, 0, 1 )";
  } else if (lnOsPhtr <= 90) {
    lcGrClor = "rgba( 255, 255, 0, 1 )";
  } else if (lnOsPhtr <= 100) {
    lcGrClor = "rgba( 255, 165, 0, 1 )";
  } else {
    lcGrClor = "rgba( 255, 0, 0, 1 )";
  }

  app.gauge.create({
    el: ".clsTr" + gcIdEmpr.trim().toUpperCase() + "DTE",
    type: "circle",
    value: lnOsPhtr / 100,
    size: 100,
    borderColor: lcGrClor,
    borderWidth: 5,
    valueText: brDecimal(lnOsPhtr) + "%",
    valueFontSize: 15,
    valueTextColor: lcGrClor,
    labelFontSize: 8,
    labelText: "de horas trabalhadas",
  });
}

function pesquisaHorasPremioDTE() {
  var loDtData = document.getElementById("datDataDTE");
  var lcWkIsql = "",
    lcAhData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcAhData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcAhData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "ldAhData", pa_tipo: "SmallDatetime", pa_valo: lcAhData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaHorasPremio",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmAhHrprDTE = lmWkRsql;

      montaDashboardDTE();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaDashboardApontamentosPendentesDTE() {
  var loDtData = document.getElementById("datDataDTE");
  var lcWkIsql = "",
    lcCaData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcCaData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcCaData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: lcCaData,
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardApontamentosPendentes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmApPndtDTE = lmWkRsql;

      pesquisaHorasPremioDTE();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaDashboardApontamentosDivergentesDTE() {
  var loDtData = document.getElementById("datDataDTE");
  var lcWkIsql = "",
    lcCaData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcCaData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcCaData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: lcCaData,
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardApontamentosDivergentes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmApDvrgDTE = lmWkRsql;

      pesquisaDashboardApontamentosPendentesDTE();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaDashboardObrasDTE() {
  var loDtData = document.getElementById("datDataDTE");
  var loOgObra = document.getElementById("ogrObraDTE");
  var lcPgAtua = document
    .getElementsByClassName("page-current")[0]
    .getAttribute("data-name");
  var lcWkIsql = "",
    lcCaData = "",
    lcWkRsql = "";
  var lmWkIsql = [],
    lmIdCadt = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcCaData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcCaData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: lcCaData,
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  if (lcPgAtua.trim() != "DashTbEmpr") {
    setTimeout(function () {
      pesquisaDashboardObrasDTE();
    }, 500);

    return;
  } else {
    setTimeout(function () {
      pesquisaDashboardObrasDTE();
    }, 1000 * 60 * 60);
  }

  limpaCamposDTE();

  gmDsObraDTE = [];

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardObras",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            if (parseInt(lmWkRsql[i].id_clie) != 354) {
              gmDsObraDTE.push(lmWkRsql[i]);
            }
          }

          for (var i = 0; i < gmDsObraDTE.length; i++) {
            //prettier-ignore
            lcWkRsql += "<option value='" + gmDsObraDTE[i].id_cadt.toString() + "'>" + gmDsObraDTE[i].cl_fant.trim().toUpperCase() + "</option>";

            lmIdCadt.push(gmDsObraDTE[i].id_cadt.toString());
          }

          loOgObra.innerHTML = lcWkRsql;

          goSsObraDTE.setValue(lmIdCadt);

          pesquisaDashboardApontamentosDivergentesDTE();
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {
      loOgObra.innerHTML = lcWkRsql;
    },
  });
}

function limpaCamposDTE() {
  var loDvObra = document.getElementById("divObraDTE");

  for (var i = 0; i < gmDsObraDTE.length; i++) {
    try {
      app.gauge.destroy("clsCl" + gmDsObraDTE[i].id_clie.toString() + "DTE");
      app.gauge.destroy("clsTr" + gmDsObraDTE[i].id_clie.toString() + "DTE");
    } catch (error) {}
  }

  loDvObra.innerHTML = "";
}

function consultaAutoridadeObjetoDTE() {
  var loSlHora = document.getElementById("sltHoraDTE");
  var lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdFile", pa_tipo: "VarChar", pa_valo: "DASHTBEMPR" },
    { pa_nome: "lcIdObjt", pa_tipo: "VarChar", pa_valo: "SLTHORADTE" }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlHora.disabled = true;

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaAutoridadeObjeto",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loSlHora.disabled = false;
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function DashTbEmpr() {
  var loDtData = document.getElementById("datDataDTE");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  goSsObraDTE = {};

  loDtData.valueAsDate = ldDtHoje;

  goSsObraDTE = app.smartSelect.create({
    el: ".clsObraDTE",
  });

  goSsObraDTE.on("closed", function () {
    montaDashboardDTE();
  });

  consultaAutoridadeObjetoDTE();
  pesquisaDashboardObrasDTE();

  OkTecladoAndroid("datDataDTE");
}
