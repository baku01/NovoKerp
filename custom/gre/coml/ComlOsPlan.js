var goOsLctoCOP = {},
  goOsAndmCOP = {},
  goGaPlanCOP = {};

function insereSituacaoOrdemServicoCOP() {
  var loTxSitu = document.getElementById("txtSituCOP");
  var lnIdOrds = 0;
  var lcWkIsql = "",
    lcOsSitu = "";
  var lmWkIsql = [];

  if (
    loTxSitu.defaultValue.toString().trim().toUpperCase() ==
    loTxSitu.value.toString().trim().toUpperCase()
  ) {
    return;
  }

  try {
    if (parseInt(goOsLctoCOP.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOP.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  try {
    if (loTxSitu.value.toString().trim().length > 0) {
      lcOsSitu = loTxSitu.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  if (lcOsSitu.length == 0) {
    loTxSitu.value = loTxSitu.defaultValue;

    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "lcOsSitu", pa_tipo: "VarChar", pa_valo: lcOsSitu },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereSituacaoOrdemServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      montaSituacoesCOP(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {
      montaSituacoesCOP([]);
    },
  });
}

function atualizaPorcentagemConclusaoCOP() {
  var loSlObra = document.getElementById("sltObraCOP");
  var loLiNume = document.getElementById("lliNumeCOP");
  var loNrPcon = document.getElementById("nroPconCOP");
  var ldDtHoje = new Date();
  var lnIdOrds = 0,
    lnOsPcon = 0,
    lnIdClie = null;
  var lcWkIsql = "";
  var lmWkIsql = [];

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  try {
    if (parseInt(goOsLctoCOP.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOP.id_ords);
    }
  } catch (error) {}

  if (loLiNume.style.display.trim().length == 0 && lnIdOrds == 0) {
    return;
  }

  try {
    if (parseFloat(loNrPcon.value) > 0) {
      lnOsPcon = parseFloat(loNrPcon.value);
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "lnOsPcon", pa_tipo: "Decimal", pa_valo: lnOsPcon },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loNrPcon.value = "";

  limpaGraficoCOP();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaPorcentagemConclusao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          if (lnIdClie == parseInt(lmWkRsql[0].id_clin)) {
            if (parseFloat(lmWkRsql[0].os_pcci) > 0) {
              loNrPcon.value = parseFloat(lmWkRsql[0].os_pcci);
            }
          } else {
            if (parseFloat(lmWkRsql[0].os_pcon) > 0) {
              loNrPcon.value = parseFloat(lmWkRsql[0].os_pcon);
            }
          }

          if (jsonDate(lmWkRsql[0].os_dtpc).trim().length > 0) {
            goOsLctoCOP.os_dtpc = lmWkRsql[0].os_dtpc;
          }

          if (lmWkRsql[0].os_uspc.trim().length > 0) {
            goOsLctoCOP.os_uspc = lmWkRsql[0].os_uspc.trim().toUpperCase();
          }

          if (jsonDate(lmWkRsql[0].os_dpci).trim().length > 0) {
            goOsLctoCOP.os_dpci = lmWkRsql[0].os_dpci;
          }

          if (lmWkRsql[0].os_upci.trim().length > 0) {
            goOsLctoCOP.os_upci = lmWkRsql[0].os_upci.trim().toUpperCase();
          }
        }
      } catch (error) {}

      montaGraficoCOP();
    },
    error: function (jqXHR, textStatus, err) {
      montaGraficoCOP();
    },
  });
}

function pesquisaAcompanhamentoHorasApontadasParadoCOP() {
  var loDvJust = document.getElementById("divJustCOP");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdOrds = 0;

  try {
    if (parseInt(goOsLctoCOP.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOP.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaAcompanhamentoHorasApontadasParado",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loDvJust.style.display = "";

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
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaAcompanhamentoHorasApontadasSituacaoCOP() {
  var loDvSirc = document.getElementById("divSircCOP");
  var lcWkIsql = "";
  var lmWkIsql = [],
    lmApSirc = [];
  var data, options, chart, view;
  var lnIdOrds = 0;

  try {
    if (parseInt(goOsLctoCOP.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOP.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaAcompanhamentoHorasApontadasSituacao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loDvSirc.style.display = "";

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
            backgroundColor: "#121212",
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

function montaGraficoCOP() {
  var loSlObra = document.getElementById("sltObraCOP");
  var loNrPcon = document.getElementById("nroPconCOP");
  var loLiData = document.getElementById("lliDataCOP");
  var loDvData = document.getElementById("divDataCOP");
  var loDvGrpl = document.getElementById("divGrplCOP");
  var loDvTsld = document.getElementById("divTsldCOP");
  var loDvPlan = document.getElementById("divPlanCOP");
  var loDvApnt = document.getElementById("divApntCOP");
  var loDvSald = document.getElementById("divSaldCOP");
  var loDvTipl = document.getElementById("divTiplCOP");
  var loDvGapl = document.getElementById("divGaplCOP");
  var loDvGrco = document.getElementById("divGrcoCOP");
  var loDvTpsd = document.getElementById("divTpsdCOP");
  var loDvPcon = document.getElementById("divPconCOP");
  var loDvPcns = document.getElementById("divPcnsCOP");
  var loDvPsld = document.getElementById("divPsldCOP");
  var loDvDtpc = document.getElementById("divDtpcCOP");
  var loIcPsld = document.getElementById("icnPsldCOP");
  var loDvPlap = document.getElementById("divPlapCOP");
  var loDvModi = document.getElementById("divModiCOP");
  var loDvMdpl = document.getElementById("divMdplCOP");
  var loDvMdap = document.getElementById("divMdapCOP");
  var loDvMoin = document.getElementById("divMoinCOP");
  var loDvMipl = document.getElementById("divMiplCOP");
  var loDvMiap = document.getElementById("divMiapCOP");
  var loDvEqpm = document.getElementById("divEqpmCOP");
  var loDvEqpl = document.getElementById("divEqplCOP");
  var loDvEqap = document.getElementById("divEqapCOP");
  var lnOsHrpl = 0,
    lnOsHroc = 0,
    lnOsHrap = 0,
    lnOsPhcn = 0,
    lnOsPcon = 0,
    lnOsMdpl = 0,
    lnOsMipl = 0,
    lnEqMdpl = 0,
    lnApHrmd = 0,
    lnApHrmi = 0,
    lnApHreq = 0,
    lnIdClie = 0;
  var lcGrClor = "",
    lcApData = "",
    lcOsDtpc = "";

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  try {
    if (parseInt(goOsLctoCOP.os_mdpl) > 0) {
      lnOsMdpl = parseInt(goOsLctoCOP.os_mdpl);
    }
  } catch (error) {}

  if (lnOsMdpl > 0) {
    lnOsHrpl = lnOsMdpl;
  } else {
    try {
      if (parseInt(goOsAndmCOP.mp_qthr) > 0) {
        lnOsMdpl = parseInt(goOsAndmCOP.mp_qthr) * 0.9;
      }
    } catch (error) {}
  }

  try {
    if (parseInt(goOsLctoCOP.os_mipl) > 0) {
      lnOsMipl = parseInt(goOsLctoCOP.os_mipl);
    }
  } catch (error) {}

  if (lnOsMipl > 0) {
    lnOsHrpl += lnOsMipl;
  } else {
    try {
      if (parseInt(goOsAndmCOP.mi_qthr) > 0) {
        lnOsMipl = parseInt(goOsAndmCOP.mi_qthr) * 0.9;
      }
    } catch (error) {}
  }

  try {
    if (parseInt(goOsLctoCOP.os_eqpl) > 0) {
      lnEqMdpl = parseInt(goOsLctoCOP.os_eqpl);
    }
  } catch (error) {}

  if (lnEqMdpl > 0) {
    lnOsHrpl += lnEqMdpl;
  } else {
    try {
      if (parseInt(goOsAndmCOP.eq_qthr) > 0) {
        lnEqMdpl = parseInt(goOsAndmCOP.eq_qthr) * 0.9;
      }
    } catch (error) {}
  }

  try {
    if (parseInt(goOsAndmCOP.os_hroc) > 0) {
      lnOsHroc = parseInt(goOsAndmCOP.os_hroc);
    }
  } catch (error) {}

  if (lnOsHrpl == 0) {
    lnOsHrpl = lnOsHroc;
  }

  loLiData.style.display = "";

  try {
    if (jsonDate(goOsAndmCOP.ap_data).trim().length > 0) {
      lcApData = jsonDate(goOsAndmCOP.ap_data);
    }
  } catch (error) {}

  loDvData.innerHTML = lcApData;

  loDvGrpl.style.display = "";

  try {
    if (parseInt(goOsAndmCOP.os_hrap) > 0) {
      lnOsHrap = parseInt(goOsAndmCOP.os_hrap);
    }
  } catch (error) {}

  // if (parseInt(goOsLctoCOP.os_tipo) == 2) {
  //   lnOsHrpl = lnOsHrap;
  // }

  loDvPlan.innerHTML = lnOsHrpl.toString();

  loDvApnt.innerHTML = lnOsHrap.toString();
  loDvSald.innerHTML = (lnOsHrpl - lnOsHrap).toString();

  if (lnOsHrpl > 0) {
    lnOsPhcn = (lnOsHrap / lnOsHrpl) * 100;
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
  loDvSald.style.color = lcGrClor;

  loDvTipl.style.display = "";
  loDvGapl.style.display = "";
  loDvGrco.style.display = "";

  goGaPlanCOP = app.gauge.create({
    el: ".clsGaPlanCOP",
    type: "circle",
    value: lnOsPhcn / 100,
    size: 250,
    borderColor: lcGrClor,
    borderWidth: 10,
    valueText: brDecimal(lnOsPhcn) + "%",
    valueFontSize: 41,
    valueTextColor: lcGrClor,
    labelText: "de horas consumidas",
  });

  try {
    if (parseFloat(loNrPcon.value) > 0) {
      lnOsPcon += parseFloat(loNrPcon.value);
    }
  } catch (error) {}

  loDvPcon.innerHTML = brDecimal(lnOsPcon) + "%";
  loDvPcns.innerHTML = brDecimal(lnOsPhcn) + "%";
  loDvPsld.innerHTML = brDecimal(lnOsPcon - lnOsPhcn) + "%";

  if (lnOsPcon - lnOsPhcn >= 0) {
    loDvTpsd.style.color = "rgba( 0, 255, 0, 1 )";
    loDvPsld.style.color = "rgba( 0, 255, 0, 1 )";

    loIcPsld.innerHTML = "sentiment_satisfied_alt";

    loIcPsld.style.color = "rgba( 0, 255, 0, 1 )";
  } else {
    loDvTpsd.style.color = "rgba( 255, 0, 0, 1 )";
    loDvPsld.style.color = "rgba( 255, 0, 0, 1 )";

    loIcPsld.innerHTML = "sentiment_very_dissatisfied";

    loIcPsld.style.color = "rgba( 255, 0, 0, 1 )";
  }

  if (lnIdClie == parseInt(goOsLctoCOP.id_clin)) {
    try {
      if (jsonDate(goOsLctoCOP.os_dpci).trim().length > 0) {
        lcOsDtpc =
          "atualizada em " +
          jsonDate(goOsLctoCOP.os_dpci) +
          " por " +
          goOsLctoCOP.os_upci.trim().toUpperCase();
      }
    } catch (error) {}
  } else {
    try {
      if (jsonDate(goOsLctoCOP.os_dtpc).trim().length > 0) {
        lcOsDtpc =
          "atualizada em " +
          jsonDate(goOsLctoCOP.os_dtpc) +
          " por " +
          goOsLctoCOP.os_uspc.trim().toUpperCase();
      }
    } catch (error) {}
  }

  loDvDtpc.innerHTML = lcOsDtpc;

  loDvPlap.style.display = "";
  loDvModi.style.display = "";

  try {
    if (parseInt(goOsAndmCOP.ap_hrmd) > 0) {
      lnApHrmd = parseInt(goOsAndmCOP.ap_hrmd);
    }
  } catch (error) {}

  if (parseInt(goOsLctoCOP.os_tipo) == 2) {
    lnOsMdpl = lnApHrmd;
  }

  loDvMdpl.innerHTML = lnOsMdpl;

  loDvMdap.innerHTML = lnApHrmd.toString();

  loDvMoin.style.display = "";

  try {
    if (parseInt(goOsAndmCOP.ap_hrmi) > 0) {
      lnApHrmi = parseInt(goOsAndmCOP.ap_hrmi);
    }
  } catch (error) {}

  if (parseInt(goOsLctoCOP.os_tipo) == 2) {
    lnOsMipl = lnApHrmi;
  }

  loDvMipl.innerHTML = lnOsMipl;

  loDvMiap.innerHTML = lnApHrmi.toString();

  loDvEqpm.style.display = "";

  try {
    if (parseInt(goOsAndmCOP.ap_hreq) > 0) {
      lnApHreq = parseInt(goOsAndmCOP.ap_hreq);
    }
  } catch (error) {}

  if (parseInt(goOsLctoCOP.os_tipo) == 2) {
    lnEqMdpl = lnApHreq;
  }

  loDvEqpl.innerHTML = lnEqMdpl;

  loDvEqap.innerHTML = lnApHreq.toString();
}

function deletaSituacaoOrdemServicoCOP(lcOsSitu) {
  var loOsSitu = JSON.parse(unescape(lcOsSitu));
  var lnIdOrds = 0;
  var lcWkIsql = "",
    lcOsData = "",
    lcOsSit1 = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goOsLctoCOP.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOP.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  try {
    if (jsonDate(loOsSitu.os_data).trim().length > 0) {
      lcOsData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(loOsSitu.os_data))
      );
    }
  } catch (error) {}

  if (lcOsData.trim().length == 0) {
    return;
  }

  try {
    if (loOsSitu.os_situ.trim().length > 0) {
      lcOsSit1 = loOsSitu.os_situ.trim().toUpperCase();
    }
  } catch (error) {}

  if (lcOsSit1.trim().length == 0) {
    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "ldOsData", pa_tipo: "SmallDatetime", pa_valo: lcOsData },
    { pa_nome: "lcOsSitu", pa_tipo: "VarChar", pa_valo: lcOsSit1 },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=deletaSituacaoOrdemServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].os_erro.trim().length > 0) {
          alerta(lmWkRsql[0].os_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (error) {}

      montaSituacoesCOP(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {
      montaSituacoesCOP([]);
    },
  });
}

function montaSituacoesCOP(lmOsSitu) {
  var loTxSitu = document.getElementById("txtSituCOP");
  var loUlSitu = document.getElementById("uulSituCOP");
  var lcUlSitu = "";

  loUlSitu.innerHTML = lcUlSitu;

  if (lmOsSitu.length > 0) {
    loTxSitu.value = lmOsSitu[0].os_situ.trim().toUpperCase();
  } else {
    loTxSitu.value = "";
  }

  for (var i = 0; i < lmOsSitu.length; i++) {
    //prettier-ignore
    lcUlSitu +=
      "<li class='swipeout'>" +
        "<div class='swipeout-content'>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" + 
                "<div class='item-title'></div>" +
                "<div class='item-after'></div>" +
              "</div>" +
              "<div class='item-subtitle'>" + jsonDate(lmOsSitu[i].os_data) + "</div>" +
              "<div class='item-text'>" + lmOsSitu[i].os_situ.trim().toUpperCase() + "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='swipeout-actions-right'>" +
          "<a href='#' onclick='deletaSituacaoOrdemServicoCOP(\"" + escape(JSON.stringify(lmOsSitu[i])) + "\");'>" +
            "<i class='material-icons'>delete_forever</i>" +
          "</a>" +
        "</div>" +
      "</li>";
  }

  loUlSitu.innerHTML = lcUlSitu;
}

function pesquisaSituacoesOrdemServicoCOP() {
  var loTxSitu = document.getElementById("txtSituCOP");
  var lnIdOrds = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goOsLctoCOP.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOP.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSituacoesOrdemServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      montaSituacoesCOP(lmWkRsql);

      try {
        if (
          loTxSitu.value.toString().trim().length == 0 &&
          goOsLctoCOP.os_situ.trim().length > 0
        ) {
          loTxSitu.value = goOsLctoCOP.os_situ.trim().toUpperCase();
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {
      montaSituacoesCOP([]);
    },
  });
}

function consultaAndamentoOSCOP() {
  var lnIdOrds = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goOsLctoCOP.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOP.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  app.dialog.preloader("calculando informações");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaAndamentoOS",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      try {
        if (lmWkRsql.length > 0) {
          goOsAndmCOP = lmWkRsql[0];
        }
      } catch (loApErro) {}

      montaGraficoCOP();
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();

      montaGraficoCOP();
    },
  });
}

function consultaCOP(loWkRsql) {
  var loSlObra = document.getElementById("sltObraCOP");
  var loNrNume = document.getElementById("nroNumeCOP");
  var loLiTipo = document.getElementById("lliTipoCOP");
  var loDvTipo = document.getElementById("divTipoCOP");
  var loLiResp = document.getElementById("lliRespCOP");
  var loDvResp = document.getElementById("divRespCOP");
  var loLiOrca = document.getElementById("lliOrcaCOP");
  var loDvOrca = document.getElementById("divOrcaCOP");
  var loLiNcli = document.getElementById("lliNcliCOP");
  var loDvNcli = document.getElementById("divNcliCOP");
  var loLiNcon = document.getElementById("lliNconCOP");
  var loDvNcon = document.getElementById("divNconCOP");
  var loLiDesc = document.getElementById("lliDescCOP");
  var loTaDesc = document.getElementById("txaDescCOP");
  var loLiPcon = document.getElementById("lliPconCOP");
  var loNrPcon = document.getElementById("nroPconCOP");
  var loLiSitu = document.getElementById("lliSituCOP");
  var loTxSitu = document.getElementById("txtSituCOP");
  var lcOsTipo = "";
  var lnIdClie = 0;

  limpaCamposOrdemServicoCOP();

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (loWkRsql.id_parm.trim().toUpperCase() == "ID_ORDS") {
    goOsLctoCOP = loWkRsql;

    loNrNume.value = loWkRsql.os_nume.trim().toUpperCase();

    app.input.validate(loNrNume);

    loLiTipo.style.display = "";

    if (parseInt(loWkRsql.os_tipo) == 1) {
      lcOsTipo = "EMPREITA";
    } else if (parseInt(loWkRsql.os_tipo) == 2) {
      lcOsTipo = "HORA HOMEM";
    } else if (parseInt(loWkRsql.os_tipo) == 3) {
      lcOsTipo = "LOCAÇÃO";
    } else if (parseInt(loWkRsql.os_tipo) == 4) {
      lcOsTipo = "PRODUTO";
    } else {
      lcOsTipo = "";
    }

    loDvTipo.innerHTML = lcOsTipo;

    loLiResp.style.display = "";

    loDvResp.innerHTML = loWkRsql.os_resp.trim().toUpperCase();

    loLiOrca.style.display = "";

    loDvOrca.innerHTML = loWkRsql.oc_nume.trim().toUpperCase();

    loLiNcli.style.display = "";

    loDvNcli.innerHTML = loWkRsql.os_ncli.trim().toUpperCase();

    loLiNcon.style.display = "";

    loDvNcon.innerHTML = loWkRsql.os_ncon.trim().toUpperCase();

    loLiDesc.style.display = "";

    loTaDesc.value = loWkRsql.os_desc.trim().toUpperCase();

    loLiPcon.style.display = "";

    if (lnIdClie == parseInt(loWkRsql.id_clin)) {
      if (parseFloat(loWkRsql.os_pcci) > 0) {
        loNrPcon.value = parseFloat(loWkRsql.os_pcci);
      }
    } else {
      if (parseFloat(loWkRsql.os_pcon) > 0) {
        loNrPcon.value = parseFloat(loWkRsql.os_pcon);
      }
    }

    loLiSitu.style.display = "";

    loTxSitu.value = loWkRsql.os_situ.trim().toUpperCase();

    pesquisaSituacoesOrdemServicoCOP();
    consultaAndamentoOSCOP();

    google.charts.load("current", { packages: ["corechart"] });

    pesquisaAcompanhamentoHorasApontadasSituacaoCOP();
    pesquisaAcompanhamentoHorasApontadasParadoCOP();
  }
}

function consultaOrdemServicoCOP() {
  var loSlObra = document.getElementById("sltObraCOP");
  var loNrNume = document.getElementById("nroNumeCOP");
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcOsNume = "";
  var lmWkIsql = [];

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    alerta("obra inválida", "alerta");

    limpaCamposCOP();

    return;
  }

  try {
    if (loNrNume.value.toString().trim().length > 0) {
      lcOsNume = loNrNume.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  if (lcOsNume.length == 0) {
    limpaCamposOrdemServicoCOP();

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: lcOsNume },
    { pa_nome: "lcOsResp", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsDesc", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcli", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcon", pa_tipo: "VarChar", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposOrdemServicoCOP();

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
        if (lmWkRsql.length > 0) {
          lmWkRsql[0]["id_parm"] = "id_ords";

          consultaCOP(lmWkRsql[0]);

          return;
        }
      } catch (loApErro) {}

      alerta("nenhuma proposta encontrada", "alerta");
    },
    error: function (jqXHR, textStatus, err) {
      alerta("nenhuma proposta encontrada", "erro");
    },
  });
}

function pesquisaOrdensServicoCOP() {
  var loSlObra = document.getElementById("sltObraCOP");
  var lnIdCadt = 0;
  var loPaPesq = {};

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  loPaPesq = {
    id_parm: "id_ords",
    pa_titu: "pesquisa de propostas",
    pa_pesq: true,
    id_cadt: lnIdCadt,
    pa_slct:
      "<option value='os_desc' selected>descrição</option>" +
      "<option value='os_nume'>número da proposta</option>" +
      "<option value='os_ncon'>número do contrato</option>" +
      "<option value='os_ncli'>número do pedido do cliente</option>" +
      "<option value='os_resp'>responsável</option>",
  };

  sessionStorage.setItem("soPaPesq", JSON.stringify(loPaPesq));

  redireciona("PesqTbCadt.html", "PesqTbCadt.html");
}

function alteraObraCOP() {
  var loSlObra = document.getElementById("sltObraCOP");
  var loLiNume = document.getElementById("lliNumeCOP");
  var lnIdClie = 0;

  limpaCamposCOP();

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  loLiNume.style.display = "";
}

function pesquisaObrasCOP() {
  var loSlObra = document.getElementById("sltObraCOP");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObras",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlObra.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlObra.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcWkRsql;
    },
  });
}

function limpaGraficoCOP() {
  var loDvGrpl = document.getElementById("divGrplCOP");
  var loDvTsld = document.getElementById("divTsldCOP");
  var loDvPlan = document.getElementById("divPlanCOP");
  var loDvApnt = document.getElementById("divApntCOP");
  var loDvSald = document.getElementById("divSaldCOP");
  var loDvTipl = document.getElementById("divTiplCOP");
  var loDvGapl = document.getElementById("divGaplCOP");
  var loDvGrco = document.getElementById("divGrcoCOP");
  var loDvTpsd = document.getElementById("divTpsdCOP");
  var loDvPcon = document.getElementById("divPconCOP");
  var loDvPcns = document.getElementById("divPcnsCOP");
  var loDvPsld = document.getElementById("divPsldCOP");
  var loDvDtpc = document.getElementById("divDtpcCOP");
  var loIcPsld = document.getElementById("icnPsldCOP");

  loDvGrpl.style.display = "none";

  loDvTsld.style.color = "";

  loDvPlan.innerHTML = "";
  loDvApnt.innerHTML = "";
  loDvSald.innerHTML = "";

  loDvSald.style.color = "";

  loDvTipl.style.display = "none";
  loDvGapl.style.display = "none";

  try {
    app.gauge.destroy(goGaPlanCOP);
  } catch (error) {}

  loDvGrco.style.display = "none";

  loDvTpsd.style.color = "";

  loDvPcon.innerHTML = "";
  loDvPcns.innerHTML = "";
  loDvPsld.innerHTML = "";

  loDvPsld.style.color = "";

  loDvDtpc.innerHTML = "";
  loIcPsld.innerHTML = "";

  loIcPsld.style.color = "";
}

function limpaCamposOrdemServicoCOP() {
  var loNrNume = document.getElementById("nroNumeCOP");
  var loLiTipo = document.getElementById("lliTipoCOP");
  var loDvTipo = document.getElementById("divTipoCOP");
  var loLiResp = document.getElementById("lliRespCOP");
  var loDvResp = document.getElementById("divRespCOP");
  var loLiOrca = document.getElementById("lliOrcaCOP");
  var loDvOrca = document.getElementById("divOrcaCOP");
  var loLiNcli = document.getElementById("lliNcliCOP");
  var loDvNcli = document.getElementById("divNcliCOP");
  var loLiNcon = document.getElementById("lliNconCOP");
  var loDvNcon = document.getElementById("divNconCOP");
  var loLiDesc = document.getElementById("lliDescCOP");
  var loTaDesc = document.getElementById("txaDescCOP");
  var loLiPcon = document.getElementById("lliPconCOP");
  var loNrPcon = document.getElementById("nroPconCOP");
  var loLiSitu = document.getElementById("lliSituCOP");
  var loTxSitu = document.getElementById("txtSituCOP");
  var loUlSitu = document.getElementById("uulSituCOP");
  var loLiData = document.getElementById("lliDataCOP");
  var loDvData = document.getElementById("divDataCOP");
  var loDvSirc = document.getElementById("divSircCOP");
  var loDvJust = document.getElementById("divJustCOP");
  var loDvPlap = document.getElementById("divPlapCOP");
  var loDvModi = document.getElementById("divModiCOP");
  var loDvMdpl = document.getElementById("divMdplCOP");
  var loDvMdap = document.getElementById("divMdapCOP");
  var loDvMoin = document.getElementById("divMoinCOP");
  var loDvMipl = document.getElementById("divMiplCOP");
  var loDvMiap = document.getElementById("divMiapCOP");
  var loDvEqpm = document.getElementById("divEqpmCOP");
  var loDvEqpl = document.getElementById("divEqplCOP");
  var loDvEqap = document.getElementById("divEqapCOP");

  goOsLctoCOP = {};
  goOsAndmCOP = {};

  loNrNume.value = "";

  loLiTipo.style.display = "none";

  loDvTipo.innerHTML = "";

  loLiResp.style.display = "none";

  loDvResp.innerHTML = "";

  loLiOrca.style.display = "none";

  loDvOrca.innerHTML = "";

  loLiNcli.style.display = "none";

  loDvNcli.innerHTML = "";

  loLiNcon.style.display = "none";

  loDvNcon.innerHTML = "";

  loLiDesc.style.display = "none";

  loTaDesc.value = "";

  loLiPcon.style.display = "none";

  loNrPcon.value = "";

  loLiSitu.style.display = "none";

  loTxSitu.value = "";

  loUlSitu.innerHTML = "";

  loLiData.style.display = "none";

  loDvData.innerHTML = "";

  loDvSirc.style.display = "none";

  loDvSirc.innerHTML = "";

  loDvJust.style.display = "none";

  loDvJust.innerHTML = "";

  loDvPlap.style.display = "none";
  loDvModi.style.display = "none";

  loDvMdpl.innerHTML = "";
  loDvMdap.innerHTML = "";

  loDvMoin.style.display = "none";

  loDvMipl.innerHTML = "";
  loDvMiap.innerHTML = "";

  loDvEqpm.style.display = "none";

  loDvEqpl.innerHTML = "";
  loDvEqap.innerHTML = "";

  limpaGraficoCOP();
}

function limpaCamposCOP() {
  var loLiNume = document.getElementById("lliNumeCOP");

  loLiNume.style.display = "none";

  limpaCamposOrdemServicoCOP();
}

function ComlOsPlan() {
  var loSlObra = document.getElementById("sltObraCOP");

  loSlObra.selectedIndex = 0;

  limpaCamposCOP();
  pesquisaObrasCOP();

  OkTecladoAndroid("nroNumeCOP");
  OkTecladoAndroid("nroPconCOP");
  OkTecladoAndroid("txtSituCOP");
}
