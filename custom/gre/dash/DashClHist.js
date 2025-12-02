var goSsObraDCH = {};
var gmDrRcsoDCH = [],
  gmFlObraDCH = [],
  gmIdCadtDCH = [];

function atualizaNomeClienteHistogramaDCH(lnIdClie, lcClHgnm) {
  var loDtData = document.getElementById("datDataDCH");
  var loOgObra = document.getElementById("ogrObraDCH");
  var loNrTmin = document.getElementById("nroTminDCH");
  var loNrTmax = document.getElementById("nroTmaxDCH");
  var lcWkIsql = "",
    lcWkRsql = "",
    lcDrData = null;
  var lmWkIsql = [],
    lmIdCadt = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcDrData = objetoDataParaStringSqlData(ldDtHoje);

  try {
    if (loDtData.value.toString().trim().length > 0) {
      lcDrData = objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtData.value)
      );
    }
  } catch (error) {}

  gmDrRcsoDCH = [];
  gmFlObraDCH = [];

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcClHgnm", pa_tipo: "VarChar", pa_valo: lcClHgnm },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaNomeClienteHistograma",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.popup.close();

      for (var i = 0; i < lmWkRsql.length; i++) {
        loNrTmin.value = parseFloat(lmWkRsql[i].ht_tmin);

        app.input.validate(loNrTmin);

        loNrTmax.value = parseFloat(lmWkRsql[i].ht_tmax);

        app.input.validate(loNrTmax);

        if (
          parseInt(lmWkRsql[i].qt_func) +
            parseInt(lmWkRsql[i].qt_eqto) +
            parseInt(lmWkRsql[i].pl_func) +
            parseInt(lmWkRsql[i].pl_eqto) >
          0
        ) {
          gmDrRcsoDCH.push(lmWkRsql[i]);

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";

          if (parseInt(lmWkRsql[i].pd_cadt) > 0) {
            lmIdCadt.push(lmWkRsql[i].id_cadt.toString());
          }
        }
      }

      loOgObra.innerHTML = lcWkRsql;

      // goSsObraDCH.setValue(lmIdCadt);
      goSsObraDCH.setValue(gmIdCadtDCH);

      montaObrasDCH();
    },
    error: function (jqXHR, textStatus, err) {
      app.popup.close();

      loOgObra.innerHTML = lcWkRsql;
    },
  });
}

function atualizaConfiguracaoHistogramaCDH() {
  var loDtData = document.getElementById("datDataDCH");
  var loOgObra = document.getElementById("ogrObraDCH");
  var loNrTmin = document.getElementById("nroTminDCH");
  var loNrTmax = document.getElementById("nroTmaxDCH");
  var lcWkIsql = "",
    lcWkRsql = "",
    lcDrData = null;
  var lmWkIsql = [],
    lmIdCadt = [];
  var lnHtTmin = 0,
    lnHtTmax = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseFloat(loNrTmin.value) > 0) {
      lnHtTmin = parseFloat(loNrTmin.value);
    }
  } catch (error) {}

  if (lnHtTmin == 0) {
    alerta("tamanho mínimo do quadrado inválido", "alerta");

    return;
  }

  try {
    if (parseFloat(loNrTmax.value) > 0) {
      lnHtTmax = parseFloat(loNrTmax.value);
    }
  } catch (error) {}

  if (lnHtTmax == 0) {
    alerta("tamanho máximo do quadrado inválido", "alerta");

    return;
  }

  if (lnHtTmax < lnHtTmin) {
    alerta("tamanho máximo menor que mínimo do quadrado", "alerta");

    return;
  }

  lcDrData = objetoDataParaStringSqlData(ldDtHoje);

  try {
    if (loDtData.value.toString().trim().length > 0) {
      lcDrData = objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtData.value)
      );
    }
  } catch (error) {}

  gmDrRcsoDCH = [];
  gmFlObraDCH = [];

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnHtTmin", pa_tipo: "Decimal", pa_valo: lnHtTmin },
    { pa_nome: "lnHtTmax", pa_tipo: "Decimal", pa_valo: lnHtTmax },
    { pa_nome: "lnIdCadt", pa_tipo: "int", pa_valo: null },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaConfiguracaoHistograma",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.popup.close();

      for (var i = 0; i < lmWkRsql.length; i++) {
        loNrTmin.value = parseFloat(lmWkRsql[i].ht_tmin);

        app.input.validate(loNrTmin);

        loNrTmax.value = parseFloat(lmWkRsql[i].ht_tmax);

        app.input.validate(loNrTmax);

        if (
          parseInt(lmWkRsql[i].qt_func) +
            parseInt(lmWkRsql[i].qt_eqto) +
            parseInt(lmWkRsql[i].pl_func) +
            parseInt(lmWkRsql[i].pl_eqto) >
          0
        ) {
          gmDrRcsoDCH.push(lmWkRsql[i]);

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";

          if (parseInt(lmWkRsql[i].pd_cadt) > 0) {
            lmIdCadt.push(lmWkRsql[i].id_cadt.toString());
          }
        }
      }

      loOgObra.innerHTML = lcWkRsql;

      // goSsObraDCH.setValue(lmIdCadt);
      goSsObraDCH.setValue(gmIdCadtDCH);

      montaObrasDCH();
    },
    error: function (jqXHR, textStatus, err) {
      app.popup.close();

      loOgObra.innerHTML = lcWkRsql;
    },
  });
}

function pesquisaTodosFuncionariosDCH() {
  var lmIdCadt = goSsObraDCH.getValue(),
    lmClFant = [];
  var loCdClie = {};

  for (var i = 0; i < gmDrRcsoDCH.length; i++) {
    lmClFant.push(gmDrRcsoDCH[i].cl_fant.trim().toUpperCase());
  }

  loCdClie = { id_cadt: 0, ls_cadt: lmIdCadt, ls_fant: lmClFant };

  sessionStorage.setItem("soCdClie", JSON.stringify(loCdClie));

  redireciona("custom/gre/cadt/CadtRlFunc.html", "CadtRlFunc.html");
}

function alteraDataDCH() {
  var loDtData = document.getElementById("datDataDCH");
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.value = loDtData.defaultValue;
  }

  ldDrData = htmlDataParaObjetoData(loDtData.value);

  if (ldDrData < ldDtHoje) {
    loDtData.valueAsDate = ldDtHoje;
  }

  if (
    loDtData.value.toString().trim().toUpperCase() ==
    loDtData.defaultValue.toString().trim().toUpperCase()
  ) {
    return;
  }

  pesquisaQuantidadeRecursos();
}

function montaObrasDCH() {
  var loDvTdas = document.getElementById("divTdasDCG"),
    loDvObra = document.getElementById("divObraDCG");
  var loTmChrt = {},
    loCrScle = {};
  var lmIdCadt = goSsObraDCH.getValue(),
    lmTmObra = [];
  var lnQtRcso = 0,
    lnQtFunc = 0,
    lnQtEqto = 0,
    lnPlRcso = 0,
    lnRpRcso = 0,
    lnPlFunc = 0,
    lnRpFunc = 0,
    lnPlEqto = 0,
    lnRpEqto = 0,
    lnHtSize = 0;
  var lcIdNovo = "",
    lnClFant = "";

  gmIdCadtDCH = lmIdCadt;

  gmFlObraDCH = [];

  loDvObra.innerHTML = "";

  for (var i = 0; i < gmDrRcsoDCH.length; i++) {
    for (var j = 0; j < lmIdCadt.length; j++) {
      if (parseInt(gmDrRcsoDCH[i].id_cadt) == parseInt(lmIdCadt[j])) {
        gmFlObraDCH.push(gmDrRcsoDCH[i]);

        lnQtRcso +=
          parseInt(gmDrRcsoDCH[i].qt_func) + parseInt(gmDrRcsoDCH[i].qt_eqto);
        lnQtFunc += parseInt(gmDrRcsoDCH[i].qt_func);
        lnQtEqto += parseInt(gmDrRcsoDCH[i].qt_eqto);
        lnPlRcso +=
          parseInt(gmDrRcsoDCH[i].pl_func) + parseInt(gmDrRcsoDCH[i].pl_eqto);
        lnRpRcso +=
          parseInt(gmDrRcsoDCH[i].rp_func) + parseInt(gmDrRcsoDCH[i].rp_eqto);
        lnPlFunc += parseInt(gmDrRcsoDCH[i].pl_func);
        lnRpFunc += parseInt(gmDrRcsoDCH[i].rp_func);
        lnPlEqto += parseInt(gmDrRcsoDCH[i].pl_eqto);
        lnRpEqto += parseInt(gmDrRcsoDCH[i].rp_eqto);

        break;
      }
    }
  }

  for (var i = 0; i < gmFlObraDCH.length; i++) {
    if (parseInt(gmFlObraDCH[i].id_novo) > 0) {
      lcIdNovo = " color: white;";
    } else {
      lcIdNovo = " color: black;";
    }

    lnHtSize = parseFloat(
      parseInt(gmFlObraDCH[i].qt_func) + parseInt(gmFlObraDCH[i].qt_eqto)
    );

    if (lnHtSize < parseFloat(gmFlObraDCH[i].ht_tmin)) {
      lnHtSize = parseFloat(gmFlObraDCH[i].ht_tmin);
    }

    if (parseFloat(gmFlObraDCH[i].ht_tmax) < lnHtSize) {
      lnHtSize = parseFloat(gmFlObraDCH[i].ht_tmax);
    }

    if (gmFlObraDCH[i].cl_hgnm.trim().length > 0) {
      lnClFant = gmFlObraDCH[i].cl_hgnm.trim().toUpperCase();
    } else {
      lnClFant = gmFlObraDCH[i].cl_fant.trim().toUpperCase();
    }

    lmTmObra.push({
      name:
        "<span style='" +
        lcIdNovo +
        "'>" +
        lnClFant +
        "<br />" +
        gmFlObraDCH[i].qt_func.toString() +
        "</span>",
      tooltip:
        "<span>" +
        "<b>PLANEJADO:</b>" +
        "<br />" +
        "EQP: " +
        gmFlObraDCH[i].pl_eqto.toString() +
        "<br />" +
        "MO: " +
        gmFlObraDCH[i].pl_func.toString() +
        "<br />" +
        "<b>REAL:</b>" +
        "<br />" +
        "EQP: " +
        gmFlObraDCH[i].qt_eqto.toString() +
        "<br />" +
        "MO: " +
        gmFlObraDCH[i].qt_func.toString() +
        "<br />" +
        "<b>atualização:</b>" +
        "<br />" +
        "EQP: " +
        gmFlObraDCH[i].rp_eqto.toString() +
        "<br />" +
        "MO: " +
        gmFlObraDCH[i].rp_func.toString() +
        "</span>",
      size: lnHtSize,
      value:
        parseInt(gmFlObraDCH[i].rp_func) +
        parseInt(gmFlObraDCH[i].rp_eqto) -
        (parseInt(gmFlObraDCH[i].qt_func) + parseInt(gmFlObraDCH[i].qt_eqto)),
      fontSize:
        lnHtSize > 125
          ? lnHtSize / 6
          : lnHtSize > 100
          ? lnHtSize / 5
          : lnHtSize > 75
          ? lnHtSize / 4
          : lnHtSize > 50
          ? lnHtSize / 3
          : lnHtSize > 25
          ? lnHtSize / 2
          : lnHtSize,
    });

    // lmTmObra.push({
    //   name:
    //     "<span style='text-decoration: underline;" +
    //     lcIdNovo +
    //     "'>" +
    //     gmFlObraDCH[i].cl_fant.trim().toUpperCase() +
    //     "</span>" +
    //     "<br />" +
    //     "<span style='" +
    //     lcIdNovo +
    //     "'>(planejado: MO: " +
    //     gmFlObraDCH[i].pl_func.toString() +
    //     " / EQP: " +
    //     gmFlObraDCH[i].pl_eqto.toString() +
    //     ")</span><br / ><span style='" +
    //     lcIdNovo +
    //     "'>" +
    //     "(total: MO: " +
    //     gmFlObraDCH[i].qt_func.toString() +
    //     " / EQP: " +
    //     gmFlObraDCH[i].qt_eqto.toString() +
    //     ")</span><br /><span style='" +
    //     lcIdNovo +
    //     "'>" +
    //     brDecimal(
    //       ((parseInt(gmFlObraDCH[i].qt_func) +
    //         parseInt(gmFlObraDCH[i].qt_eqto)) /
    //         lnQtRcso) *
    //         100
    //     ) +
    //     "%</span>",
    //   size: parseFloat(
    //     parseInt(gmFlObraDCH[i].qt_func) + parseInt(gmFlObraDCH[i].qt_eqto)
    //   ),
    //   value:
    //     parseInt(gmFlObraDCH[i].pl_func) +
    //     parseInt(gmFlObraDCH[i].pl_eqto) -
    //     (parseInt(gmFlObraDCH[i].qt_func) + parseInt(gmFlObraDCH[i].qt_eqto)),
    // });
  }

  //prettier-ignore
  loDvTdas.innerHTML =
    "<div class='row no-gap'>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span><b>&nbsp</b></span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span><b>plan</b></span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span><b>atualização</b></span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span><b>real</b></span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span><b>atualização - real</b></span>" +
      "</div>" +
    "</div>" +
    "<div class='row no-gap'>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>todos os funcionários</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnPlFunc.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnRpFunc.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnQtFunc.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + (lnRpFunc - lnQtFunc).toString() + "</span>" +
      "</div>" +
    "</div>" +
    "<div class='row no-gap'>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>todos os equipamentos</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnPlEqto.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnRpEqto.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnQtEqto.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + (lnRpEqto - lnQtEqto).toString() + "</span>" +
      "</div>" +
    "</div>" +
    "<div class='row no-gap'>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>todas as obras</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnPlRcso.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnRpRcso.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + lnQtRcso.toString() + "</span>" +
      "</div>" +
      "<div class='col' style='text-align: center; border: 1px solid;'>" +
        "<span>" + (lnRpRcso - lnQtRcso).toString() + "</span>" +
      "</div>" +
    "</div>";

  lmTmObra = [
    {
      name: "obras",
      children: lmTmObra,
    },
  ];

  loTmChrt = anychart.treeMap(lmTmObra, "as-tree");

  loCrScle = anychart.scales.ordinalColor();

  loCrScle.ranges([{ less: -1 }, { from: 0, to: 0 }, { greater: 1 }]);
  loCrScle.colors(["#FF0000", "#FFFF00", "#00FF00"]);

  loTmChrt.colorScale(loCrScle);
  loTmChrt.colorRange().enabled(true);
  loTmChrt.labels().useHtml(true);

  loTmChrt
    .labels()
    .format("<span style='font-size: {%fontSize}px;'>{%name}</span>");

  loTmChrt.sort("desc");
  loTmChrt.container("divObraDCG");
  loTmChrt.tooltip().useHtml(true);
  loTmChrt.tooltip().titleFormat("");
  loTmChrt.tooltip().format("<span style='font-size: 25px;'>{%tooltip}</span>");
  loTmChrt.interactivity().selectionMode("none");
  loTmChrt.listen("click", function (e) {
    var loCdClie = {};

    try {
      loCdClie = gmFlObraDCH[e.pointIndex - 1];

      loCdClie["ls_cadt"] = [loCdClie.id_cadt.toString()];

      loCdClie["ls_fant"] = [loCdClie.cl_fant.trim().toUpperCase()];

      sessionStorage.setItem("soCdClie", JSON.stringify(loCdClie));

      redireciona("custom/gre/cadt/CadtRlFunc.html", "CadtRlFunc.html");
    } catch (error) {}
  });

  loTmChrt.listen("contextmenu", function (e) {
    var loCdClie = {};
    var lcClFant = "",
      lcClHgnm = "";
    var lnIdClie = 0;

    try {
      loCdClie = gmFlObraDCH[e.pointIndex - 1];

      lnIdClie = parseInt(loCdClie.id_clie);

      if (loCdClie.cl_hgnm.trim().length > 0) {
        lcClFant = loCdClie.cl_hgnm.trim().toUpperCase();
      } else {
        lcClFant = loCdClie.cl_fant.trim().toUpperCase();
      }

      lcClHgnm = prompt("nome da obra no histograma", lcClFant);

      if (lcClHgnm != null) {
        if (lcClHgnm.trim().length > 0) {
          atualizaNomeClienteHistogramaDCH(
            lnIdClie,
            lcClHgnm.trim().toUpperCase()
          );
        }
      }
    } catch (error) {}
  });

  loTmChrt.draw();
}

function pesquisaQuantidadeRecursos() {
  var loDtData = document.getElementById("datDataDCH");
  var loOgObra = document.getElementById("ogrObraDCH");
  var loNrTmin = document.getElementById("nroTminDCH");
  var loNrTmax = document.getElementById("nroTmaxDCH");
  var lcWkIsql = "",
    lcWkRsql = "",
    lcDrData = null;
  var lmWkIsql = [],
    lmIdCadt = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcDrData = objetoDataParaStringSqlData(ldDtHoje);

  try {
    if (loDtData.value.toString().trim().length > 0) {
      lcDrData = objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtData.value)
      );
    }
  } catch (error) {}

  gmDrRcsoDCH = [];
  gmFlObraDCH = [];

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaQuantidadeRecursos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      for (var i = 0; i < lmWkRsql.length; i++) {
        loNrTmin.value = parseFloat(lmWkRsql[i].ht_tmin);

        app.input.validate(loNrTmin);

        loNrTmax.value = parseFloat(lmWkRsql[i].ht_tmax);

        app.input.validate(loNrTmax);

        if (
          parseInt(lmWkRsql[i].qt_func) +
            parseInt(lmWkRsql[i].qt_eqto) +
            parseInt(lmWkRsql[i].pl_func) +
            parseInt(lmWkRsql[i].pl_eqto) >
          0
        ) {
          gmDrRcsoDCH.push(lmWkRsql[i]);

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";

          if (parseInt(lmWkRsql[i].pd_cadt) > 0) {
            lmIdCadt.push(lmWkRsql[i].id_cadt.toString());
          }
        }
      }

      loOgObra.innerHTML = lcWkRsql;

      goSsObraDCH.setValue(lmIdCadt);

      montaObrasDCH();
    },
    error: function (jqXHR, textStatus, err) {
      loOgObra.innerHTML = lcWkRsql;
    },
  });
}

function DashClHist() {
  var loDtData = document.getElementById("datDataDCH");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  goSsObraDCH = {};
  gmFlObraDCH = [];

  loDtData.valueAsDate = ldDtHoje;

  goSsObraDCH = app.smartSelect.create({
    el: ".clsObraDCH",
  });

  goSsObraDCH.on("closed", function () {
    montaObrasDCH();
  });

  pesquisaQuantidadeRecursos();

  OkTecladoAndroid("datDataDCH");
  OkTecladoAndroid("nroTminDCH");
  OkTecladoAndroid("nroTmaxDCH");
}
