var goOsLctoDCO = {};
var gmOsJornDCO = [];

function alteraDataPosicaoDCO() {
  var loDtDat1 = document.getElementById("datDataDOL");
  var loDtData = document.getElementById("datDataDCO");
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

  if (loDtDat1) {
    loDtDat1.value = loDtData.value;

    alteraDataPosicaoDOL();
  }

  pesquisaDashboardHorasPlanejadasApontadasDCO();
  pesquisaDashboardApontamentoSituacaoDCO();
  consultaDashboardPropostaDCO();
}

function calculaHorasExtrasDCO(loApApnt, lmApApnt) {
  var lnApJdms = 0,
    lnApJmms = 0,
    lnApJtms = 0,
    lnHrHora = 0,
    lnHrMnto = 0,
    lnIdDsem = 0,
    lnJoMnts = 0,
    lnHeMnts = 0;
  var ldApData = new Date(),
    ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [],
    lmApRcso = [];
  var llApJdms = false;

  ldApData.setHours(0, 0, 0, 0);

  if (jsonDate(loApApnt.ap_data).trim().length > 0) {
    ldApData = stringDataParaObjetoData(jsonDate(loApApnt.ap_data));
  }

  try {
    if (parseFloat(loApApnt.ap_hent) > 0) {
      ldApHent = new Date(ldApData);

      lmHrHora = loApApnt.ap_hent.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHent.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_hiin) > 0) {
      ldApHiin = new Date(ldApData);

      lmHrHora = loApApnt.ap_hiin.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHiin.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_htin) > 0) {
      ldApHtin = new Date(ldApData);

      lmHrHora = loApApnt.ap_htin.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHtin.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_hter) > 0) {
      ldApHter = new Date(ldApData);

      lmHrHora = loApApnt.ap_hter.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHter.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  if (ldApHent.getFullYear() > 1900 && ldApHiin.getFullYear() > 1900) {
    if (ldApHent <= ldApHiin) {
      lnApJmms = ldApHiin - ldApHent;
    } else {
      ldApHiin = ldApHiin.addDays(1);

      if (ldApHtin.getFullYear() > 1900) {
        ldApHtin = ldApHtin.addDays(1);
      }

      if (ldApHter.getFullYear() > 1900) {
        ldApHter = ldApHter.addDays(1);
      }

      lnApJmms = ldApHiin - ldApHent;
    }
  }

  if (
    ldApHiin.getFullYear() > 1900 &&
    ldApHtin.getFullYear() > 1900 &&
    ldApHiin > ldApHtin
  ) {
    ldApHtin = ldApHtin.addDays(1);

    if (ldApHter.getFullYear() > 1900) {
      ldApHter = ldApHter.addDays(1);
    }
  }

  if (ldApHtin.getFullYear() > 1900 && ldApHter.getFullYear() > 1900) {
    if (ldApHtin <= ldApHter) {
      lnApJtms = ldApHter - ldApHtin;
    } else {
      ldApHter = ldApHter.addDays(1);

      lnApJtms = ldApHter - ldApHtin;
    }
  }

  lnApJdms = lnApJmms + lnApJtms;

  lnIdDsem = ldApData.getDay();

  for (var i = 0; i < gmOsJornDCO.length; i++) {
    if (
      parseInt(gmOsJornDCO[i].id_dsem) == lnIdDsem + 1 &&
      parseInt(gmOsJornDCO[i].id_ords) == parseInt(loApApnt.id_ords)
    ) {
      lnJoMnts = parseInt(gmOsJornDCO[i].jo_mnts);

      break;
    }
  }

  if (parseInt(loApApnt.ap_feri) > 0) {
    lnHeMnts = parseInt(Math.floor(lnApJdms / 60000));

    return lnHeMnts;
  } else {
    lnApJdms = 0;

    for (var i = 0; i < lmApApnt.length; i++) {
      if (
        jsonDate(loApApnt.ap_data).trim() ==
          jsonDate(lmApApnt[i].ap_data).trim() &&
        loApApnt.fu_empr.trim().toUpperCase() ==
          lmApApnt[i].fu_empr.trim().toUpperCase() &&
        parseInt(loApApnt.id_matr) == parseInt(lmApApnt[i].id_matr)
      ) {
        ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0);
        ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0);
        ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0);
        ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
        lmHrHora = [];
        lnHrHora = 0;
        lnHrMnto = 0;
        lnApJmms = 0;
        lnApJtms = 0;

        try {
          if (parseFloat(lmApApnt[i].ap_hent) > 0) {
            ldApHent = new Date(ldApData);

            lmHrHora = lmApApnt[i].ap_hent.toString().split(".");

            try {
              lnHrHora = parseInt(lmHrHora[0]);
            } catch (error) {}

            try {
              lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
            } catch (error) {}

            ldApHent.setHours(lnHrHora, lnHrMnto);
          }
        } catch (error) {}

        lnHrHora = 0;
        lnHrMnto = 0;

        try {
          if (parseFloat(lmApApnt[i].ap_hiin) > 0) {
            ldApHiin = new Date(ldApData);

            lmHrHora = lmApApnt[i].ap_hiin.toString().split(".");

            try {
              lnHrHora = parseInt(lmHrHora[0]);
            } catch (error) {}

            try {
              lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
            } catch (error) {}

            ldApHiin.setHours(lnHrHora, lnHrMnto);
          }
        } catch (error) {}

        lnHrHora = 0;
        lnHrMnto = 0;

        try {
          if (parseFloat(lmApApnt[i].ap_htin) > 0) {
            ldApHtin = new Date(ldApData);

            lmHrHora = lmApApnt[i].ap_htin.toString().split(".");

            try {
              lnHrHora = parseInt(lmHrHora[0]);
            } catch (error) {}

            try {
              lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
            } catch (error) {}

            ldApHtin.setHours(lnHrHora, lnHrMnto);
          }
        } catch (error) {}

        lnHrHora = 0;
        lnHrMnto = 0;

        try {
          if (parseFloat(lmApApnt[i].ap_hter) > 0) {
            ldApHter = new Date(ldApData);

            lmHrHora = lmApApnt[i].ap_hter.toString().split(".");

            try {
              lnHrHora = parseInt(lmHrHora[0]);
            } catch (error) {}

            try {
              lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
            } catch (error) {}

            ldApHter.setHours(lnHrHora, lnHrMnto);
          }
        } catch (error) {}

        if (ldApHent.getFullYear() > 1900 && ldApHiin.getFullYear() > 1900) {
          if (ldApHent <= ldApHiin) {
            lnApJmms = ldApHiin - ldApHent;
          } else {
            ldApHiin = ldApHiin.addDays(1);

            if (ldApHtin.getFullYear() > 1900) {
              ldApHtin = ldApHtin.addDays(1);
            }

            if (ldApHter.getFullYear() > 1900) {
              ldApHter = ldApHter.addDays(1);
            }

            lnApJmms = ldApHiin - ldApHent;
          }
        }

        if (
          ldApHiin.getFullYear() > 1900 &&
          ldApHtin.getFullYear() > 1900 &&
          ldApHiin > ldApHtin
        ) {
          ldApHtin = ldApHtin.addDays(1);

          if (ldApHter.getFullYear() > 1900) {
            ldApHter = ldApHter.addDays(1);
          }
        }

        if (ldApHtin.getFullYear() > 1900 && ldApHter.getFullYear() > 1900) {
          if (ldApHtin <= ldApHter) {
            lnApJtms = ldApHter - ldApHtin;
          } else {
            ldApHter = ldApHter.addDays(1);

            lnApJtms = ldApHter - ldApHtin;
          }
        }

        lmApRcso.push({
          ap_data: lmApApnt[i].ap_data,
          fu_empr: lmApApnt[i].fu_empr,
          id_matr: lmApApnt[i].id_matr,
          ap_hent: lmApApnt[i].ap_hent,
          ap_jdms: lnApJmms + lnApJtms,
        });
      }
    }

    for (var i = 0; i < lmApRcso.length; i++) {
      lnApJdms += lmApRcso[i].ap_jdms;

      if (llApJdms) {
        lnHeMnts = parseInt(Math.floor(lnApJdms / 60000));
      } else if (lnJoMnts < parseInt(Math.floor(lnApJdms / 60000))) {
        lnHeMnts = parseInt(Math.floor(lnApJdms / 60000)) - lnJoMnts;
      }

      if (lnHeMnts > 0) {
        if (
          jsonDate(loApApnt.ap_data).trim() ==
            jsonDate(lmApRcso[i].ap_data).trim() &&
          loApApnt.fu_empr.trim().toUpperCase() ==
            lmApRcso[i].fu_empr.trim().toUpperCase() &&
          parseInt(loApApnt.id_matr) == parseInt(lmApRcso[i].id_matr) &&
          parseFloat(loApApnt.ap_hent) == parseFloat(lmApRcso[i].ap_hent)
        ) {
          return lnHeMnts;
        } else {
          lnApJdms = 0;
          llApJdms = true;
        }
      }
    }

    return 0;
  }
}

function pesquisaRecursosApontadosPropostaDCO() {
  var loDvHrex = document.getElementById("divHrexDCO"),
    loBtHrex = {};
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdOrds = 0,
    lnIdClie = 0,
    lnHeMnts = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goOsLctoDCO.id_clie) > 0) {
      lnIdClie = parseInt(goOsLctoDCO.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoDCO.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvHrex.innerHTML = "CALCULANDO...";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursosApontadosProposta",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvHrex.innerHTML = "";

      try {
        if (lmWkRsql.length > 0 && lmWkRsql.length <= 2500) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            lnHeMnts += calculaHorasExtrasDCO(lmWkRsql[i], lmWkRsql);
          }

          loDvHrex.innerHTML =
            pad(Math.floor(lnHeMnts / 60), 2) + ":" + pad(lnHeMnts % 60, 2);
        } else if (lmWkRsql.length > 2500) {
          loDvHrex.innerHTML =
            "<button id='btnHrexDCO' class='button button-fill'>calcular horas extras</button>";

          loBtHrex = document.getElementById("btnHrexDCO");

          loBtHrex.onclick = function () {
            lnHeMnts = 0;

            app.dialog.preloader("carregando horas extras");

            for (var i = 0; i < lmWkRsql.length; i++) {
              lnHeMnts += calculaHorasExtrasDCO(lmWkRsql[i], lmWkRsql);
            }

            app.dialog.close();

            loDvHrex.innerHTML =
              pad(Math.floor(lnHeMnts / 60), 2) + ":" + pad(lnHeMnts % 60, 2);
          };
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      loDvHrex.innerHTML = "";
    },
  });
}

function pesquisaJornadaOrdensServicoDCO() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdOrds = 0;

  try {
    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoDCO.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lnIdOrds.toString() },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  gmOsJornDCO = [];

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaJornadaOrdensServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmOsJornDCO = lmWkRsql;

      pesquisaRecursosApontadosPropostaDCO();
    },
    error: function (jqXHR, textStatus, err) {
      pesquisaRecursosApontadosPropostaDCO();
    },
  });
}

function pesquisaDashboardHorasPlanejadasApontadasDCO() {
  var loSlHora = document.getElementById("sltHoraDCC");
  var loDtData = document.getElementById("datDataDCO");
  var loDvMdpl = document.getElementById("divMdplDCO");
  var loDvMdap = document.getElementById("divMdapDCO");
  var loDvMipl = document.getElementById("divMiplDCO");
  var loDvMiap = document.getElementById("divMiapDCO");
  var loDvEqpl = document.getElementById("divEqplDCO");
  var loDvEqap = document.getElementById("divEqapDCO");
  var lcWkIsql = "",
    lcDvMdpl = "os_mdpl",
    lcDvMipl = "os_mipl",
    lcDvEqpl = "os_eqpl";
  var lmWkIsql = [];
  var lnIdOrds = 0,
    lnIdCadt = 0;
  var ldDtHoje = new Date(),
    ldCaData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldCaData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goOsLctoDCO.id_cadt) > 0) {
      lnIdCadt = parseInt(goOsLctoDCO.id_cadt);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  try {
    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoDCO.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldCaData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDtHoje < ldCaData) {
    ldCaData = ldDtHoje;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldCaData),
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvMdpl.innerHTML = "";
  loDvMdap.innerHTML = "";
  loDvMipl.innerHTML = "";
  loDvMiap.innerHTML = "";
  loDvEqpl.innerHTML = "";
  loDvEqap.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardHorasPlanejadasApontadas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          if (loSlHora.value.toString().trim().toUpperCase() == "OC_QTHR") {
            lcDvMdpl = "mp_qthr";
            lcDvMipl = "mi_qthr";
            lcDvEqpl = "eq_qthr";
          }

          loDvMdpl.innerHTML = lmWkRsql[0][lcDvMdpl].toString();
          loDvMdap.innerHTML = lmWkRsql[0].fu_hamd.toString();
          loDvMipl.innerHTML = lmWkRsql[0][lcDvMipl].toString();
          loDvMiap.innerHTML = lmWkRsql[0].fu_hami.toString();
          loDvEqpl.innerHTML = lmWkRsql[0][lcDvEqpl].toString();
          loDvEqap.innerHTML = lmWkRsql[0].eq_hrap.toString();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaAcompanhamentoHorasApontadasParadoDCO() {
  var loDtData = document.getElementById("datDataDCO");
  var loDvJust = document.getElementById("divJustDCO");
  var loDvLjst = document.getElementById("divLjstDCO");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdOrds = 0,
    lnIdCadt = 0;
  var ldDtHoje = new Date(),
    ldCaData = new Date();

  try {
    if (parseInt(goOsLctoDCO.id_cadt) > 0) {
      lnIdCadt = parseInt(goOsLctoDCO.id_cadt);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  try {
    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoDCO.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldCaData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDtHoje < ldCaData) {
    ldCaData = ldDtHoje;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldCaData),
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvLjst.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardApontamentoParado",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      document.getElementById("divLjstDCO").style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          //prettier-ignore
          loDvJust.innerHTML += 
            "<div class='block-title' style='text-align: center'>apontamentos parados</div>" +
            "<div class='row no-gap'>" +
              "<div class='col borda' style='text-align: center'><b>justificativa</b></div>" +
              "<div class='col borda' style='text-align: center'><b>horas apontadas</b></div>" +
              "<div class='col borda' style='text-align: center'><b>contratante</b></div>" +
            "</div>";

          for (var i = 0; i < lmWkRsql.length; i++) {
            //prettier-ignore
            loDvJust.innerHTML += 
            "<div class='row no-gap'>" +
              "<div class='col borda' style='text-align: center'>" + lmWkRsql[i].ju_deno.trim().toLowerCase() + "</div>" +
              "<div class='col borda' style='text-align: center'>" + lmWkRsql[i].re_hrap.toString() + "</div>" +
              "<div class='col borda' style='text-align: center'>" + lmWkRsql[i].re_hace.toString() + "</div>" +
            "</div>";
          }
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      document.getElementById("divLjstDCO").style.display = "none";
    },
  });
}

function pesquisaDashboardApontamentoSituacaoDCO() {
  var loDtData = document.getElementById("datDataDCO");
  var loDvSirc = document.getElementById("divSircDCO");
  var lcWkIsql = "";
  var lmWkIsql = [],
    lmApSirc = [];
  var data, options, chart, view;
  var lnIdOrds = 0,
    lnIdCadt = 0;
  var ldDtHoje = new Date(),
    ldCaData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldCaData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goOsLctoDCO.id_cadt) > 0) {
      lnIdCadt = parseInt(goOsLctoDCO.id_cadt);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  try {
    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoDCO.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldCaData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDtHoje < ldCaData) {
    ldCaData = ldDtHoje;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldCaData),
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvSirc.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardApontamentoSituacao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          data = google.visualization.arrayToDataTable([]);

          lmApSirc.push(["situação", "horas apontadas"]);

          for (var i = 0; i < lmWkRsql.length; i++) {
            lmApSirc.push([
              lmWkRsql[i].sr_deno.trim().toUpperCase(),
              lmWkRsql[i].re_hrap,
            ]);
          }

          data.addColumn("string", lmApSirc[0][0]);
          data.addColumn("number", lmApSirc[0][1]);

          for (var i = 1; i < lmApSirc.length; i++) {
            data.addRow(lmApSirc[i]);
          }

          view = new google.visualization.DataView(data);

          view.setColumns([
            0,
            1,
            {
              calc: "stringify",
              sourceColumn: 1,
              type: "string",
              role: "annotation",
            },
          ]);

          options = {
            hAxis: {
              title: "horas apontadas",
              minValue: 0,
              textStyle: {
                color: "white",
              },
              titleTextStyle: {
                color: "white",
              },
            },
            vAxis: {
              title: "situação",
              textStyle: {
                color: "white",
              },
              titleTextStyle: {
                color: "white",
              },
            },
            legend: { position: "none" },
            backgroundColor: "black",
            colors: [corTema()],
            annotations: {
              textStyle: {
                color: "white",
              },
            },
          };

          chart = new google.visualization.BarChart(loDvSirc);

          chart.draw(view, options);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaApontamentosInternosDCO() {
  var loDvClin = document.getElementById("divClinDCO");
  var loDvLcin = document.getElementById("divLcinDCO");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdOrds = 0,
    lnIdClie = 0;

  try {
    if (parseInt(goOsLctoDCO.id_clie) > 0) {
      lnIdClie = parseInt(goOsLctoDCO.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoDCO.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvLcin.style.display = "";
  loDvClin.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaApontamentosInternos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      document.getElementById("divLcinDCO").style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          //prettier-ignore
          loDvClin.innerHTML += 
            "<div class='block-title' style='text-align: center'>apontamentos internos</div>" +
            "<div class='row no-gap'>" +
              "<div class='col borda' style='text-align: center'><b>obra interna</b></div>" +
              "<div class='col borda' style='text-align: center'><b>horas apontadas</b></div>" +
            "</div>";

          for (var i = 0; i < lmWkRsql.length; i++) {
            //prettier-ignore
            loDvClin.innerHTML += 
            "<div class='row no-gap'>" +
              "<div class='col borda' style='text-align: center'>" + lmWkRsql[i].cl_fant.trim().toLowerCase() + "</div>" +
              "<div class='col borda' style='text-align: center'>" + lmWkRsql[i].re_hrap.toString() + "</div>" +
            "</div>";
          }
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      document.getElementById("divLcinDCO").style.display = "none";
    },
  });
}

function consultaDashboardPropostaDCO() {
  var loSlHora = document.getElementById("sltHoraDCC");
  var lcPgAtua = document
    .getElementsByClassName("page-current")[0]
    .getAttribute("data-name");
  var loDtData = document.getElementById("datDataDCO");
  var loDvClie = document.getElementById("divClieDCO");
  var loDvNume = document.getElementById("divNumeDCO");
  var loDvTipo = document.getElementById("divTipoDCO");
  var loDvResp = document.getElementById("divRespDCO");
  var loDvOrca = document.getElementById("divOrcaDCO");
  var loDvNcli = document.getElementById("divNcliDCO");
  var loDvNcon = document.getElementById("divNconDCO");
  var loTaDesc = document.getElementById("txaDescDCO");
  var loDvSitu = document.getElementById("divSituDCO");
  var loDvTsld = document.getElementById("divTsldDCO");
  var loDvPlan = document.getElementById("divPlanDCO");
  var loDvApnt = document.getElementById("divApntDCO");
  var loDvSald = document.getElementById("divSaldDCO");
  var loDvTpsd = document.getElementById("divTpsdDCO");
  var loDvPcon = document.getElementById("divPconDCO");
  var loDvPcns = document.getElementById("divPcnsDCO");
  var loDvPsld = document.getElementById("divPsldDCO");
  var loDvDtpc = document.getElementById("divDtpcDCO");
  var lcWkIsql = "",
    lcOsTipo = "",
    lcGrClor = "",
    lcSlHora = loSlHora.value.toString().trim().toLowerCase(),
    lcOsDtpc = "";
  var lmWkIsql = [];
  var lnIdClie = 0,
    lnIdOrds = 0,
    lnOpQthr = 0,
    lnReHrap = 0,
    lnOsPhcn = 0,
    lnOsPcon = 0;
  var ldDtHoje = new Date(),
    ldCaData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldCaData.setHours(0, 0, 0, 0);

  if (lcPgAtua.trim() != "DashCnOrds") {
    setTimeout(function () {
      consultaDashboardPropostaDCO();
    }, 500);

    return;
  } else {
    setTimeout(function () {
      consultaDashboardPropostaDCO();
    }, 1000 * 60 * 60);
  }

  limpaCamposDCO();

  try {
    if (parseInt(goOsLctoDCO.id_clie) > 0) {
      lnIdClie = parseInt(goOsLctoDCO.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoDCO.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldCaData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDtHoje < ldCaData) {
    ldCaData = ldDtHoje;
  }

  google.charts.load("current", { packages: ["corechart"] });

  pesquisaApontamentosInternosDCO();
  pesquisaDashboardApontamentoSituacaoDCO();
  pesquisaAcompanhamentoHorasApontadasParadoDCO();
  pesquisaDashboardHorasPlanejadasApontadasDCO();
  pesquisaJornadaOrdensServicoDCO();

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldCaData),
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaDashboardProposta",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loDvClie.innerHTML = lmWkRsql[0].cl_fant.trim().toUpperCase();
          loDvNume.innerHTML = lmWkRsql[0].os_nume.trim().toUpperCase();

          if (parseInt(lmWkRsql[0].os_tipo) == 1) {
            lcOsTipo = "EMPREITA";
          } else if (parseInt(lmWkRsql[0].os_tipo) == 2) {
            lcOsTipo = "HORA HOMEM";
          } else if (parseInt(lmWkRsql[0].os_tipo) == 3) {
            lcOsTipo = "LOCAÇÃO";
          } else if (parseInt(lmWkRsql[0].os_tipo) == 4) {
            lcOsTipo = "PRODUTO";
          } else {
            lcOsTipo = "";
          }

          loDvTipo.innerHTML = lcOsTipo;
          loDvResp.innerHTML = lmWkRsql[0].os_resp.trim().toUpperCase();
          loDvOrca.innerHTML = lmWkRsql[0].oc_nume.trim().toUpperCase();
          loDvNcli.innerHTML = lmWkRsql[0].os_ncli.trim().toUpperCase();
          loDvNcon.innerHTML = lmWkRsql[0].os_ncon.trim().toUpperCase();

          loTaDesc.value = lmWkRsql[0].os_desc.trim().toUpperCase();

          loDvSitu.innerHTML = lmWkRsql[0].os_situ.trim().toUpperCase();

          try {
            if (parseInt(lmWkRsql[0].re_hrap) > 0) {
              lnReHrap = parseInt(lmWkRsql[0].re_hrap);
            }
          } catch (error) {}

          try {
            if (parseInt(lmWkRsql[0][lcSlHora]) > 0) {
              lnOpQthr = parseInt(lmWkRsql[0][lcSlHora]);
            }
          } catch (error) {}

          if (lnOpQthr == 0) {
            lnOpQthr = 1;
          }

          if (lnOpQthr > 0) {
            lnOsPhcn = (lnReHrap / lnOpQthr) * 100;
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

          loDvTsld.style.color = lcGrClor;

          loDvPlan.innerHTML = lnOpQthr.toString();
          loDvApnt.innerHTML = lnReHrap.toString();

          loDvSald.style.color = lcGrClor;

          loDvSald.innerHTML = (lnOpQthr - lnReHrap).toString();

          try {
            if (parseInt(lmWkRsql[0].os_pcon) > 0) {
              lnOsPcon = parseInt(lmWkRsql[0].os_pcon);
            }
          } catch (error) {}

          loDvPcon.innerHTML = brDecimal(lnOsPcon) + "%";
          loDvPcns.innerHTML = brDecimal(lnOsPhcn) + "%";
          loDvPsld.innerHTML = brDecimal(lnOsPcon - lnOsPhcn) + "%";

          if (lnOsPcon - lnOsPhcn >= 0) {
            loDvTpsd.style.color = "rgba( 0, 255, 0, 1 )";
            loDvPsld.style.color = "rgba( 0, 255, 0, 1 )";
          } else {
            loDvTpsd.style.color = "rgba( 255, 0, 0, 1 )";
            loDvPsld.style.color = "rgba( 255, 0, 0, 1 )";
          }

          try {
            if (jsonDate(lmWkRsql[0].os_dtpc).trim().length > 0) {
              lcOsDtpc =
                "atualizada em " +
                jsonDate(lmWkRsql[0].os_dtpc) +
                " por " +
                lmWkRsql[0].os_uspc.trim().toUpperCase();
            }
          } catch (error) {}

          if (lcOsDtpc.trim().length > 0) {
            loDvDtpc.innerHTML = lcOsDtpc;
          }
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function limpaCamposDCO() {
  var loDvClie = document.getElementById("divClieDCO");
  var loDvNume = document.getElementById("divNumeDCO");
  var loDvTipo = document.getElementById("divTipoDCO");
  var loDvResp = document.getElementById("divRespDCO");
  var loDvOrca = document.getElementById("divOrcaDCO");
  var loDvNcli = document.getElementById("divNcliDCO");
  var loDvNcon = document.getElementById("divNconDCO");
  var loTaDesc = document.getElementById("txaDescDCO");
  var loDvSitu = document.getElementById("divSituDCO");
  var loDvHrex = document.getElementById("divHrexDCO");
  var loDvTsld = document.getElementById("divTsldDCO");
  var loDvPlan = document.getElementById("divPlanDCO");
  var loDvApnt = document.getElementById("divApntDCO");
  var loDvSald = document.getElementById("divSaldDCO");
  var loDvTpsd = document.getElementById("divTpsdDCO");
  var loDvPcon = document.getElementById("divPconDCO");
  var loDvPcns = document.getElementById("divPcnsDCO");
  var loDvPsld = document.getElementById("divPsldDCO");
  var loDvDtpc = document.getElementById("divDtpcDCO");
  var loDvClin = document.getElementById("divClinDCO");
  var loDvSirc = document.getElementById("divSircDCO");
  var loDvJust = document.getElementById("divJustDCO");
  var loDvMdpl = document.getElementById("divMdplDCO");
  var loDvMdap = document.getElementById("divMdapDCO");
  var loDvMipl = document.getElementById("divMiplDCO");
  var loDvMiap = document.getElementById("divMiapDCO");
  var loDvEqpl = document.getElementById("divEqplDCO");
  var loDvEqap = document.getElementById("divEqapDCO");

  loDvClie.innerHTML = "";
  loDvNume.innerHTML = "";
  loDvTipo.innerHTML = "";
  loDvResp.innerHTML = "";
  loDvOrca.innerHTML = "";
  loDvNcli.innerHTML = "";
  loDvNcon.innerHTML = "";

  loTaDesc.value = "";

  loDvSitu.innerHTML = "";
  loDvHrex.innerHTML = "";

  loDvTsld.style.color = "";

  loDvPlan.innerHTML = "";
  loDvApnt.innerHTML = "";
  loDvSald.innerHTML = "";

  loDvSald.style.color = "";
  loDvTpsd.style.color = "";

  loDvPcon.innerHTML = "";
  loDvPcns.innerHTML = "";
  loDvPsld.innerHTML = "";

  loDvPsld.style.color = "";

  loDvDtpc.innerHTML = "";

  loDvClin.innerHTML = "";
  loDvSirc.innerHTML = "";
  loDvJust.innerHTML = "";
  loDvMdpl.innerHTML = "";
  loDvMdap.innerHTML = "";
  loDvMipl.innerHTML = "";
  loDvMiap.innerHTML = "";
  loDvEqpl.innerHTML = "";
  loDvEqap.innerHTML = "";
}

function DashCnOrds() {
  var loSlHora = document.getElementById("sltHoraDCC"),
    loDtDat0 = document.getElementById("datDataDOL"),
    loDtData = document.getElementById("datDataDCO"),
    loDvOcpl = document.getElementById("divOcplDCO"),
    loBdOcpl = document.getElementById("bldOcplDCO");
  var lcSlHora = loSlHora.value.toString().trim().toUpperCase();
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtData.valueAsDate = ldDtHoje;

  if (lcSlHora == "OC_QTHR") {
    loDvOcpl.innerHTML = "orçadas";
    loBdOcpl.innerHTML = "orçado";
  }

  try {
    goOsLctoDCO = JSON.parse(sessionStorage.getItem("soOsLcto"));

    if (parseInt(goOsLctoDCO.id_ords) > 0) {
      sessionStorage.removeItem("soOsLcto");

      if (loDtDat0) {
        loDtData.value = loDtDat0.value;
      }

      consultaDashboardPropostaDCO();
    }
  } catch (loApErro) {}

  OkTecladoAndroid("datDataDCO");
}
