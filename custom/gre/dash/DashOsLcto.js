var gmDsOrdsDOL = [],
  gmApHrprDOL = [];
var goCdClieDOL = {};

function horasPremioDOL() {
  redireciona("custom/gre/dash/DashApHrpr.html", "DashApHrpr.html");
}

function alteraDataPosicaoDOL() {
  var loDtDat0 = document.getElementById("datDataDCC");
  var loDtData = document.getElementById("datDataDOL");
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

  if (loDtDat0) {
    loDtDat0.value = loDtData.value;

    alteraDataPosicaoDCC();
  }

  pesquisaDashboardPropostasDOL();
  pesquisaHorasPremioDOL();
}

function atualizaInformacoesDashboardObraCOL(loObHtml) {
  var loDtData = document.getElementById("datDataDOL");
  var loNrDant = document.getElementById("nroDantDOL");
  var loNrPavc = document.getElementById("nroPavcDOL");
  var loDtDsac = document.getElementById("datDsacCOL");
  var loNrPapl = document.getElementById("nroPaplDOL");
  var loDvDesv = document.getElementById("divDesvDOL");
  var loDvModa = document.getElementById("divModaDOL");
  var loNrModp = document.getElementById("nroModpDOL");
  var loDtDtpt = document.getElementById("datDtptCOL");
  var loDtDttr = document.getElementById("datDttrCOL");
  var loDtDttp = document.getElementById("datDttpCOL");
  var loTxEnca = document.getElementById("txtEncaCOL");
  var loTxPlan = document.getElementById("txtPlanCOL");
  var loNrPaft = document.getElementById("nroPaftDOL");
  var lcWkIsql = "",
    lcClDsac = "1900-01-01",
    lcClDtpt = "1900-01-01",
    lcClDttr = "1900-01-01",
    lcClDttp = "1900-01-01",
    lcClEnca = "",
    lcClPlan = "";
  var lmWkIsql = [];
  var lnClDant = 0,
    lnClPavc = 0,
    lnClPapl = 0,
    lnClModp = 0,
    lnIdClie = 0,
    lnClPaft = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loObHtml.value == loObHtml.defaultValue) {
    return;
  }

  try {
    if (parseInt(goCdClieDOL.id_clie) > 0) {
      lnIdClie = parseInt(goCdClieDOL.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.valueAsDate = ldDtHoje;
  }

  if (ldDtHoje < htmlDataParaObjetoData(loDtData.value)) {
    loDtData.valueAsDate = ldDtHoje;
  }

  lcCaData = loDtData.value.toString().trim();

  try {
    if (parseFloat(loNrDant.value) > 0 || parseFloat(loNrDant.value) < 0) {
      lnClDant = parseFloat(loNrDant.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrPavc.value) > 0) {
      lnClPavc = parseFloat(loNrPavc.value);
    }
  } catch (error) {}

  try {
    if (loDtDsac.value.toString().trim().length > 0) {
      lcClDsac = loDtDsac.value.toString().trim();
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrPapl.value) > 0) {
      lnClPapl = parseFloat(loNrPapl.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrModp.value) > 0) {
      lnClModp = parseFloat(loNrModp.value);
    }
  } catch (error) {}

  try {
    if (loDtDtpt.value.toString().trim().length > 0) {
      lcClDtpt = loDtDtpt.value.toString().trim();
    }
  } catch (error) {}

  try {
    if (loDtDttr.value.toString().trim().length > 0) {
      lcClDttr = loDtDttr.value.toString().trim();
    }
  } catch (error) {}

  try {
    if (loDtDttp.value.toString().trim().length > 0) {
      lcClDttp = loDtDttp.value.toString().trim();
    }
  } catch (error) {}

  try {
    if (loTxEnca.value.toString().trim().length > 0) {
      lcClEnca = loTxEnca.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (loTxPlan.value.toString().trim().length > 0) {
      lcClPlan = loTxPlan.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrPaft.value) > 0) {
      lnClPaft = parseFloat(loNrPaft.value);
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnClDant", pa_tipo: "Decimal", pa_valo: lnClDant },
    { pa_nome: "lnClPavc", pa_tipo: "Decimal", pa_valo: lnClPavc },
    { pa_nome: "ldClDsac", pa_tipo: "SmallDatetime", pa_valo: lcClDsac },
    { pa_nome: "lnClPapl", pa_tipo: "Decimal", pa_valo: lnClPapl },
    { pa_nome: "lnClModp", pa_tipo: "Decimal", pa_valo: lnClModp },
    { pa_nome: "ldClDtpt", pa_tipo: "SmallDatetime", pa_valo: lcClDtpt },
    { pa_nome: "ldClDttr", pa_tipo: "SmallDatetime", pa_valo: lcClDttr },
    { pa_nome: "ldClDttp", pa_tipo: "SmallDatetime", pa_valo: lcClDttp },
    { pa_nome: "lcClEnca", pa_tipo: "VarChar", pa_valo: lcClEnca },
    { pa_nome: "lcClPlan", pa_tipo: "VarChar", pa_valo: lcClPlan },
    { pa_nome: "lnClPaft", pa_tipo: "Decimal", pa_valo: lnClPaft },
    { pa_nome: "ldCaData", pa_tipo: "SmallDatetime", pa_valo: lcCaData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loNrDant.value = "";
  loNrPavc.value = "";

  loDvDesv.innerHTML = "";
  loDvModa.innerHTML = "";

  loDtDtpt.value = "";
  loDtDttr.value = "";
  loDtDttp.value = "";
  loTxEnca.value = "";
  loTxPlan.value = "";
  loNrPaft.value = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaInformacoesDashboardObra",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          if (
            parseFloat(lmWkRsql[0].cl_dant) > 0 ||
            parseFloat(lmWkRsql[0].cl_dant) < 0
          ) {
            loNrDant.value = parseFloat(lmWkRsql[0].cl_dant.toFixed(2));
          }

          if (parseFloat(lmWkRsql[0].cl_pavc) > 0) {
            loNrPavc.value = parseFloat(lmWkRsql[0].cl_pavc.toFixed(2));
          }

          if (parseFloat(lnClPavc - lnClPapl) != 0) {
            loDvDesv.innerHTML = brDecimal(lnClPavc - lnClPapl) + "%";
          }

          if (parseInt(lmWkRsql[0].qt_moda) > 0) {
            loDvModa.innerHTML = lmWkRsql[0].qt_moda.toString();
          }

          if (jsonDate(lmWkRsql[0].cl_dtpt).trim().length > 0) {
            loDtDtpt.valueAsDate = stringDataParaObjetoData(
              jsonDate(lmWkRsql[0].cl_dtpt)
            );
          }

          if (jsonDate(lmWkRsql[0].cl_dttr).trim().length > 0) {
            loDtDttr.valueAsDate = stringDataParaObjetoData(
              jsonDate(lmWkRsql[0].cl_dttr)
            );
          }

          if (jsonDate(lmWkRsql[0].cl_dttp).trim().length > 0) {
            loDtDttp.valueAsDate = stringDataParaObjetoData(
              jsonDate(lmWkRsql[0].cl_dttp)
            );
          }

          if (lmWkRsql[0].cl_enca.trim().length > 0) {
            loTxEnca.value = lmWkRsql[0].cl_enca.trim().toUpperCase();
          }

          if (lmWkRsql[0].cl_plan.trim().length > 0) {
            loTxPlan.value = lmWkRsql[0].cl_plan.trim().toUpperCase();
          }

          if (parseFloat(lmWkRsql[0].cl_paft) > 0) {
            loNrPaft.value = parseFloat(lmWkRsql[0].cl_paft.toFixed(2));
          }
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function montaHorasPremioDOL() {
  var loDvHrpr = document.getElementById("divHrprDOL");
  var lcAhHora = "";
  var lmAhHora = [];
  var lnAhMinu = 0;

  for (var i = 0; i < gmApHrprDOL.length; i++) {
    lcAhHora = pad(gmApHrprDOL[i].ah_hora.toFixed(2), 5).replace(".", ":");

    lmAhHora = lcAhHora.trim().split(":");

    lnAhMinu += parseInt(lmAhHora[0]) * 60;
    lnAhMinu += parseInt(lmAhHora[1]);
  }

  loDvHrpr.innerHTML = "";

  if (lnAhMinu > 0) {
    loDvHrpr.innerHTML =
      pad(Math.floor(lnAhMinu / 60).toString(), 2) +
      ":" +
      pad((lnAhMinu % 60).toString(), 2);
  }
}

function pesquisaHorasPremioDOL() {
  var loDtData = document.getElementById("datDataDOL");
  var lcWkIsql = "",
    lcAhData = "";
  var lmWkIsql = [];
  var lnIdClie = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goCdClieDOL.id_clie) > 0) {
      lnIdClie = parseInt(goCdClieDOL.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.valueAsDate = ldDtHoje;
  }

  if (ldDtHoje < htmlDataParaObjetoData(loDtData.value)) {
    loDtData.valueAsDate = ldDtHoje;
  }

  lcAhData = loDtData.value.toString().trim();

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldAhData", pa_tipo: "SmallDatetime", pa_valo: lcAhData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  gmApHrprDOL = [];

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaHorasPremio",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmApHrprDOL = lmWkRsql;

      montaHorasPremioDOL();
    },
    error: function (jqXHR, textStatus, err) {
      montaHorasPremioDOL();
    },
  });
}

function consultaInformacoesDashboardObraDOL() {
  var loDtData = document.getElementById("datDataDOL");
  var loNrDant = document.getElementById("nroDantDOL");
  var loNrPavc = document.getElementById("nroPavcDOL");
  var loDtDsac = document.getElementById("datDsacCOL");
  var loNrPapl = document.getElementById("nroPaplDOL");
  var loDvDesv = document.getElementById("divDesvDOL");
  var loDvModa = document.getElementById("divModaDOL");
  var loNrModp = document.getElementById("nroModpDOL");
  var loDtDtpt = document.getElementById("datDtptCOL");
  var loDtDttr = document.getElementById("datDttrCOL");
  var loDtDttp = document.getElementById("datDttpCOL");
  var loTxEnca = document.getElementById("txtEncaCOL");
  var loTxPlan = document.getElementById("txtPlanCOL");
  var loNrPaft = document.getElementById("nroPaftDOL");
  var lcWkIsql = "",
    lcCaData = "";
  var lmWkIsql = [];
  var lnIdClie = 0,
    lnClPavc = 0,
    lnClPapl = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goCdClieDOL.id_clie) > 0) {
      lnIdClie = parseInt(goCdClieDOL.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.valueAsDate = ldDtHoje;
  }

  if (ldDtHoje < htmlDataParaObjetoData(loDtData.value)) {
    loDtData.valueAsDate = ldDtHoje;
  }

  lcCaData = loDtData.value.toString().trim();

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldCaData", pa_tipo: "SmallDatetime", pa_valo: lcCaData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));
  
  loDvModa.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaInformacoesDashboardObra",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          if (
            parseFloat(lmWkRsql[0].cl_dant) > 0 ||
            parseFloat(lmWkRsql[0].cl_dant) < 0
          ) {
            loNrDant.value = parseFloat(lmWkRsql[0].cl_dant.toFixed(2));
          }

          if (parseFloat(lmWkRsql[0].cl_pavc) > 0) {
            lnClPavc = parseFloat(lmWkRsql[0].cl_pavc.toFixed(2));

            loNrPavc.value = lnClPavc;
          }

          if (jsonDate(lmWkRsql[0].cl_dsac).trim().length > 0) {
            loDtDsac.valueAsDate = stringDataParaObjetoData(
              jsonDate(lmWkRsql[0].cl_dsac)
            );
          }

          if (parseFloat(lmWkRsql[0].cl_papl) > 0) {
            lnClPapl = parseFloat(lmWkRsql[0].cl_papl.toFixed(2));

            loNrPapl.value = lnClPapl;
          }

          if (parseFloat(lnClPavc - lnClPapl) != 0) {
            loDvDesv.innerHTML = brDecimal(lnClPavc - lnClPapl) + "%";
          }

          if (parseInt(lmWkRsql[0].qt_moda) > 0) {
            loDvModa.innerHTML = lmWkRsql[0].qt_moda.toString();
          }

          if (parseFloat(lmWkRsql[0].cl_modp) > 0) {
            loNrModp.value = parseFloat(lmWkRsql[0].cl_modp.toFixed(2));
          }

          if (jsonDate(lmWkRsql[0].cl_dtpt).trim().length > 0) {
            loDtDtpt.valueAsDate = stringDataParaObjetoData(
              jsonDate(lmWkRsql[0].cl_dtpt)
            );
          }

          if (jsonDate(lmWkRsql[0].cl_dttr).trim().length > 0) {
            loDtDttr.valueAsDate = stringDataParaObjetoData(
              jsonDate(lmWkRsql[0].cl_dttr)
            );
          }

          if (jsonDate(lmWkRsql[0].cl_dttp).trim().length > 0) {
            loDtDttp.valueAsDate = stringDataParaObjetoData(
              jsonDate(lmWkRsql[0].cl_dttp)
            );
          }

          if (lmWkRsql[0].cl_enca.trim().length > 0) {
            loTxEnca.value = lmWkRsql[0].cl_enca.trim().toUpperCase();
          }

          if (lmWkRsql[0].cl_plan.trim().length > 0) {
            loTxPlan.value = lmWkRsql[0].cl_plan.trim().toUpperCase();
          }

          if (parseFloat(lmWkRsql[0].cl_paft) > 0) {
            loNrPaft.value = parseFloat(lmWkRsql[0].cl_paft.toFixed(2));
          }
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaDashboardPropostaDCC(lcOsLcto) {
  var loOsLcto = JSON.parse(unescape(lcOsLcto));

  sessionStorage.setItem("soOsLcto", JSON.stringify(loOsLcto));

  redireciona("custom/gre/dash/DashCnOrds.html", "DashCnOrds.html");
}

function montaDashboardDOL() {
  var loSlHora = document.getElementById("sltHoraDCC");
  var loDvOrds = document.getElementById("divOrdsDOL"),
    loDvFace = {},
    loDvFctr = {},
    loDvDesv = {},
    loDvDstr = {};
  var lnOsPhcn = 0,
    lnOsPhtr = 0,
    lnReHrap = 0,
    lnReHtap = 0,
    lnOpQthr = 0,
    lnOsPcon = 0,
    lnRoPndt = 0,
    lnRoTota = 0,
    lnPrRdop = 0;
  var lcGrClor = "",
    lcWkRsql = "",
    lcDiGaug = "",
    lcDiGau1 = "",
    lcDiGau2 = "",
    lcBdClor = "",
    lcSlHora = loSlHora.value.toString().trim().toLowerCase();

  if (isMobile()) {
    //prettier-ignore
    for (var i = 0; i < gmDsOrdsDOL.length; i = i + 2) {
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        lcBdClor = "";
  
        if (parseFloat(gmDsOrdsDOL[i + 1].os_pcon) >= 100) {
          lcBdClor = " border-color: rgba( 0, 255, 0, 1 );";
        }
            
        lnRoPndt = parseInt(gmDsOrdsDOL[i + 1].os_qrdo) - parseInt(gmDsOrdsDOL[i + 1].os_qaro);
        lnRoTota = parseInt(gmDsOrdsDOL[i + 1].os_qrdo);
  
        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        } else {
          lnPrRdop = 0;
        }

        lcDiGaug = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcBdClor + "' onclick='consultaDashboardPropostaDCC(\"" + escape(JSON.stringify(gmDsOrdsDOL[i + 1])) + "\");'>" +
            "<div class='block-title'>" + gmDsOrdsDOL[i + 1].os_nume.trim().toUpperCase() + "</div><br />" +
            "<div class='gauge clsTr" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFt" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='material-icons' style='font-size: 35px'></i>" +
            "</div>" +
            "<div id='divDt" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='block' style='font-size: smaller;'></div>" +
            "<div class='gauge clsOs" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFc" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='material-icons' style='font-size: 75px'></i>" +
            "</div>" +
            "<div id='divDs" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='block'></div>" +
            "último apontamento: " + jsonDate(gmDsOrdsDOL[i + 1].ap_data) + "<br />" +  
            "rdo pend.: " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGaug = "";
      }
      
      lcBdClor = "";

      if (parseFloat(gmDsOrdsDOL[i].os_pcon) >= 100) {
        lcBdClor = " border-color: rgba( 0, 255, 0, 1 );";
      }
            
      lnRoPndt = parseInt(gmDsOrdsDOL[i].os_qrdo) - parseInt(gmDsOrdsDOL[i].os_qaro);
      lnRoTota = parseInt(gmDsOrdsDOL[i].os_qrdo);

      if (lnRoTota > 0) {
        lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
      } else {
        lnPrRdop = 0;
      }

      lcWkRsql += 
        "<div class='row'>" +
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcBdClor + "' onclick='consultaDashboardPropostaDCC(\"" + escape(JSON.stringify(gmDsOrdsDOL[i])) + "\");'>" +
            "<div class='block-title'>" + gmDsOrdsDOL[i].os_nume.trim().toUpperCase() + "</div><br />" +
            "<div class='gauge clsTr" + gmDsOrdsDOL[i].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFt" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='material-icons' style='font-size: 35px'></i>" +
            "</div>" +
            "<div id='divDt" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='block' style='font-size: smaller;'></div>" +
            "<div class='gauge clsOs" + gmDsOrdsDOL[i].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFc" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='material-icons' style='font-size: 75px'></i>" +
            "</div>" +
            "<div id='divDs" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='block'></div>" +
            "último apontamento: " + jsonDate(gmDsOrdsDOL[i].ap_data) + "<br />" +  
            "rdo pend.: " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br /><br />" + 
          "</div>" +
          lcDiGaug +
        "</div>" +
        "<br />";
    }
  } else {
    //prettier-ignore
    for (var i = 0; i < gmDsOrdsDOL.length; i = i + 4) {
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        lcBdClor = "";
  
        if (parseFloat(gmDsOrdsDOL[i + 1].os_pcon) >= 100) {
          lcBdClor = " border-color: rgba( 0, 255, 0, 1 );";
        }
            
        lnRoPndt = parseInt(gmDsOrdsDOL[i + 1].os_qrdo) - parseInt(gmDsOrdsDOL[i + 1].os_qaro);
        lnRoTota = parseInt(gmDsOrdsDOL[i + 1].os_qrdo);
  
        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        } else {
          lnPrRdop = 0;
        }
        
        lcDiGaug = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcBdClor + "' onclick='consultaDashboardPropostaDCC(\"" + escape(JSON.stringify(gmDsOrdsDOL[i + 1])) + "\");'>" +
            "<div class='block-title'>" + gmDsOrdsDOL[i + 1].os_nume.trim().toUpperCase() + "</div><br />" +
            "<div class='gauge clsTr" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFt" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='material-icons' style='font-size: 35px'></i>" +
            "</div>" +
            "<div id='divDt" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='block' style='font-size: smaller;'></div>" +
            "<div class='gauge clsOs" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFc" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='material-icons' style='font-size: 75px'></i>" +
            "</div>" +
            "<div id='divDs" + gmDsOrdsDOL[i + 1].id_ords.toString() + "DOL' class='block'></div>" +
            "último apontamento: " + jsonDate(gmDsOrdsDOL[i + 1].ap_data) + "<br />" +  
            "rdo pend.: " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGaug = "";
      }
      
      try {
        lcBdClor = "";
  
        if (parseFloat(gmDsOrdsDOL[i + 2].os_pcon) >= 100) {
          lcBdClor = " border-color: rgba( 0, 255, 0, 1 );";
        }
            
        lnRoPndt = parseInt(gmDsOrdsDOL[i + 2].os_qrdo) - parseInt(gmDsOrdsDOL[i + 2].os_qaro);
        lnRoTota = parseInt(gmDsOrdsDOL[i + 2].os_qrdo);
  
        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        } else {
          lnPrRdop = 0;
        }
        
        lcDiGau1 = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcBdClor + "' onclick='consultaDashboardPropostaDCC(\"" + escape(JSON.stringify(gmDsOrdsDOL[i + 2])) + "\");'>" +
            "<div class='block-title'>" + gmDsOrdsDOL[i + 2].os_nume.trim().toUpperCase() + "</div><br />" +
            "<div class='gauge clsTr" + gmDsOrdsDOL[i + 2].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFt" + gmDsOrdsDOL[i + 2].id_ords.toString() + "DOL' class='material-icons' style='font-size: 35px'></i>" +
            "</div>" +
            "<div id='divDt" + gmDsOrdsDOL[i + 2].id_ords.toString() + "DOL' class='block' style='font-size: smaller;'></div>" +
            "<div class='gauge clsOs" + gmDsOrdsDOL[i + 2].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFc" + gmDsOrdsDOL[i + 2].id_ords.toString() + "DOL' class='material-icons' style='font-size: 75px'></i>" +
            "</div>" +
            "<div id='divDs" + gmDsOrdsDOL[i + 2].id_ords.toString() + "DOL' class='block'></div>" +
            "último apontamento: " + jsonDate(gmDsOrdsDOL[i + 2].ap_data) + "<br />" +  
            "rdo pend.: " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGau1 = "";
      }
      
      try {
        lcBdClor = "";
  
        if (parseFloat(gmDsOrdsDOL[i + 3].os_pcon) >= 100) {
          lcBdClor = " border-color: rgba( 0, 255, 0, 1 );";
        }
            
        lnRoPndt = parseInt(gmDsOrdsDOL[i + 3].os_qrdo) - parseInt(gmDsOrdsDOL[i + 3].os_qaro);
        lnRoTota = parseInt(gmDsOrdsDOL[i + 3].os_qrdo);
  
        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        } else {
          lnPrRdop = 0;
        }

        lcDiGau2 = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcBdClor + "' onclick='consultaDashboardPropostaDCC(\"" + escape(JSON.stringify(gmDsOrdsDOL[i + 3])) + "\");'>" +
            "<div class='block-title'>" + gmDsOrdsDOL[i + 3].os_nume.trim().toUpperCase() + "</div><br />" +
            "<div class='gauge clsTr" + gmDsOrdsDOL[i + 3].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFt" + gmDsOrdsDOL[i + 3].id_ords.toString() + "DOL' class='material-icons' style='font-size: 35px'></i>" +
            "</div>" +
            "<div id='divDt" + gmDsOrdsDOL[i + 3].id_ords.toString() + "DOL' class='block' style='font-size: smaller;'></div>" +
            "<div class='gauge clsOs" + gmDsOrdsDOL[i + 3].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFc" + gmDsOrdsDOL[i + 3].id_ords.toString() + "DOL' class='material-icons' style='font-size: 75px'></i>" +
            "</div>" +
            "<div id='divDs" + gmDsOrdsDOL[i + 3].id_ords.toString() + "DOL' class='block'></div>" +
            "último apontamento: " + jsonDate(gmDsOrdsDOL[i + 3].ap_data) + "<br />" +  
            "rdo pend.: " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGau2 = "";
      }

      lcBdClor = "";
  
      if (parseFloat(gmDsOrdsDOL[i].os_pcon) >= 100) {
        lcBdClor = " border-color: rgba( 0, 255, 0, 1 );";
      }
            
      lnRoPndt = parseInt(gmDsOrdsDOL[i].os_qrdo) - parseInt(gmDsOrdsDOL[i].os_qaro);
      lnRoTota = parseInt(gmDsOrdsDOL[i].os_qrdo);

      if (lnRoTota > 0) {
        lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
      } else {
        lnPrRdop = 0;
      }

      lcWkRsql += 
        "<div class='row'>" +
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcBdClor + "' onclick='consultaDashboardPropostaDCC(\"" + escape(JSON.stringify(gmDsOrdsDOL[i])) + "\");'>" +
            "<div class='block-title'>" + gmDsOrdsDOL[i].os_nume.trim().toUpperCase() + "</div><br />" +
            "<div class='gauge clsTr" + gmDsOrdsDOL[i].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFt" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='material-icons' style='font-size: 35px'></i>" +
            "</div>" +
            "<div id='divDt" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='block' style='font-size: smaller;'></div>" +
            "<div class='gauge clsOs" + gmDsOrdsDOL[i].id_ords.toString() + "DOL'></div>" +
            "<div class='block'>" +
              "<i id='icnFc" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='material-icons' style='font-size: 75px'></i>" +
            "</div>" +
            "<div id='divDs" + gmDsOrdsDOL[i].id_ords.toString() + "DOL' class='block'></div>" +
            "último apontamento: " + jsonDate(gmDsOrdsDOL[i].ap_data) + "<br />" +  
            "rdo pend.: " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br /><br />" + 
          "</div>" +
          lcDiGaug +
          lcDiGau1 +
          lcDiGau2 +
        "</div>" +
        "<br />";
    }
  }

  loDvOrds.innerHTML = lcWkRsql;

  for (var i = 0; i < gmDsOrdsDOL.length; i++) {
    lnReHrap = 0;
    lnReHtap = 0;
    lnOpQthr = 0;
    lnOsPhcn = 0;
    lnOsPhtr = 0;
    lnOsPcon = 0;
    lcGrClor = "";

    loDvFace = document.getElementById(
      "icnFc" + gmDsOrdsDOL[i].id_ords.toString() + "DOL"
    );
    loDvFctr = document.getElementById(
      "icnFt" + gmDsOrdsDOL[i].id_ords.toString() + "DOL"
    );
    loDvDesv = document.getElementById(
      "divDs" + gmDsOrdsDOL[i].id_ords.toString() + "DOL"
    );
    loDvDstr = document.getElementById(
      "divDt" + gmDsOrdsDOL[i].id_ords.toString() + "DOL"
    );

    try {
      if (parseInt(gmDsOrdsDOL[i].re_hrap) > 0) {
        lnReHrap = parseInt(gmDsOrdsDOL[i].re_hrap);
      }
    } catch (error) {}

    try {
      if (parseInt(gmDsOrdsDOL[i].re_htap) > 0) {
        lnReHtap = parseInt(gmDsOrdsDOL[i].re_htap);
      }
    } catch (error) {}

    try {
      if (parseInt(gmDsOrdsDOL[i][lcSlHora]) > 0) {
        lnOpQthr = parseInt(gmDsOrdsDOL[i][lcSlHora]);
      }
    } catch (error) {}

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
      el: ".clsOs" + gmDsOrdsDOL[i].id_ords.toString() + "DOL",
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
      el: ".clsTr" + gmDsOrdsDOL[i].id_ords.toString() + "DOL",
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

    try {
      if (parseInt(gmDsOrdsDOL[i].os_pcon) > 0) {
        lnOsPcon = parseInt(gmDsOrdsDOL[i].os_pcon);
      }
    } catch (error) {}

    loDvDesv.innerHTML = brDecimal(lnOsPcon - lnOsPhcn) + "%";
    loDvDstr.innerHTML = brDecimal(lnOsPcon - lnOsPhtr) + "%";

    if (lnOsPcon - lnOsPhcn >= 0) {
      loDvDesv.style.color = "rgba( 0, 255, 0, 1 )";

      loDvFace.innerHTML = "sentiment_satisfied_alt";

      loDvFace.style.color = "rgba( 0, 255, 0, 1 )";
    } else {
      loDvDesv.style.color = "rgba( 255, 0, 0, 1 )";

      loDvFace.innerHTML = "sentiment_very_dissatisfied";

      loDvFace.style.color = "rgba( 255, 0, 0, 1 )";
    }

    if (lnOsPcon - lnOsPhtr >= 0) {
      loDvDstr.style.color = "rgba( 0, 255, 0, 1 )";

      loDvFctr.innerHTML = "sentiment_satisfied_alt";

      loDvFctr.style.color = "rgba( 0, 255, 0, 1 )";
    } else {
      loDvDstr.style.color = "rgba( 255, 0, 0, 1 )";

      loDvFctr.innerHTML = "sentiment_very_dissatisfied";

      loDvFctr.style.color = "rgba( 255, 0, 0, 1 )";
    }
  }
}

function pesquisaDashboardPropostasDOL() {
  var loDtData = document.getElementById("datDataDOL");
  var lcPgAtua = document
    .getElementsByClassName("page-current")[0]
    .getAttribute("data-name");
  var lcWkIsql = "",
    lcCaData = "";
  var lmWkIsql = [];
  var lnIdClie = 0;
  var ldDtHoje = new Date();

  if (lcPgAtua.trim() != "DashOsLcto") {
    setTimeout(function () {
      pesquisaDashboardPropostasDOL();
    }, 500);

    return;
  } else {
    setTimeout(function () {
      pesquisaDashboardPropostasDOL();
    }, 1000 * 60 * 60);
  }

  limpaCamposDOL();

  try {
    if (parseInt(goCdClieDOL.id_clie) > 0) {
      lnIdClie = parseInt(goCdClieDOL.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  ldDtHoje.setHours(0, 0, 0, 0);

  lcCaData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcCaData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
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
      "&lcWkProc=pesquisaDashboardPropostas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmDsOrdsDOL = lmWkRsql;

      montaDashboardDOL();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function limpaCamposDOL() {
  var loDvOrds = document.getElementById("divOrdsDOL");

  for (var i = 0; i < gmDsOrdsDOL.length; i++) {
    try {
      app.gauge.destroy("clsOs" + gmDsOrdsDOL[i].id_ords.toString() + "DOL");
      app.gauge.destroy("clsTr" + gmDsOrdsDOL[i].id_ords.toString() + "DOL");
    } catch (error) {}
  }

  loDvOrds.innerHTML = "";
}

function DashOsLcto() {
  var loDtDat0 = document.getElementById("datDataDCC");
  var loSlHora = document.getElementById("sltHoraDCC");
  var loDtData = document.getElementById("datDataDOL");
  var loDvClie = document.getElementById("divClieDOL");
  var loDvThpo = document.getElementById("divThpoDOL");
  var loDvHrpo = document.getElementById("divHrpoDOL");
  var ldDtHoje = new Date();
  var loCdClie = {};

  ldDtHoje.setHours(0, 0, 0, 0);

  gmApHrprDOL = [];

  loDtData.valueAsDate = ldDtHoje;

  try {
    goCdClieDOL = JSON.parse(sessionStorage.getItem("soCdClie"));

    if (parseInt(goCdClieDOL.id_clie) > 0) {
      sessionStorage.removeItem("soCdClie");

      if (loDtDat0) {
        loDtData.value = loDtDat0.value;
      }

      loDvClie.innerHTML = goCdClieDOL.cl_fant.trim().toUpperCase();

      if (loSlHora.value.toString().trim().toUpperCase() == "OC_QTHR") {
        loDvThpo.innerHTML = "horas orçadas";
        loDvHrpo.innerHTML = goCdClieDOL.oc_qthr.toString() + ":00";
      } else {
        loDvThpo.innerHTML = "horas planejadas";
        loDvHrpo.innerHTML = goCdClieDOL.pl_qthr.toString() + ":00";
      }

      pesquisaDashboardPropostasDOL();
      consultaInformacoesDashboardObraDOL();
      pesquisaHorasPremioDOL();
    }
  } catch (loApErro) {}

  OkTecladoAndroid("datDataDOL");
  OkTecladoAndroid("nroDantDOL");
  OkTecladoAndroid("nroPavcDOL");
  OkTecladoAndroid("datDsacCOL");
  OkTecladoAndroid("nroPaplDOL");
  OkTecladoAndroid("nroModpDOL");
  OkTecladoAndroid("datDtptCOL");
  OkTecladoAndroid("datDttrCOL");
  OkTecladoAndroid("datDttpCOL");
  OkTecladoAndroid("txtEncaCOL");
  OkTecladoAndroid("txtPlanCOL");
  OkTecladoAndroid("nroPaftDOL");
}
