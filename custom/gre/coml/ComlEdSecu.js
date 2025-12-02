var goAsApntCES = {};
var gmTbJornCES = [];

function insereApontamentoSecullumManualCES() {
  var loHrHent = document.getElementById("hraHentCES"),
    loHrHiin = document.getElementById("hraHiinCES"),
    loHrHtin = document.getElementById("hraHtinCES"),
    loHrHter = document.getElementById("hraHterCES"),
    loTaJust = document.getElementById("txaJustCES");
  var lmWkIsql = [];
  var lcWkIsql = "",
    lcEsData = "1900-01-01",
    lcFuEmpr = "",
    lcEsJust = "";
  var lnIdMatr = 0,
    lnEsHent = 0,
    lnEsHiin = 0,
    lnEsHtin = 0,
    lnEsHter = 0;

  if (!validaHorariosCES()) {
    return;
  }

  app.input.validate(loTaJust);

  lcEsJust = loTaJust.value.toString().trim().toUpperCase();

  if (lcEsJust.trim().length == 0) {
    alerta("justificativa inválida", "alerta");

    return;
  }

  try {
    if (goAsApntCES.fu_empr.trim().length > 0) {
      lcFuEmpr = goAsApntCES.fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (parseInt(goAsApntCES.id_matr) > 0) {
      lnIdMatr = parseInt(goAsApntCES.id_matr);
    }
  } catch (error) {}

  try {
    if (jsonDate(goAsApntCES.ap_data).trim().length > 0) {
      lcEsData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data))
      );
    }
  } catch (error) {}

  if (
    loHrHent.value.toString().trim().length > 0 &&
    loHrHent.value.toString().trim() != "00:00"
  ) {
    lnEsHent = parseFloat(loHrHent.value.toString().replace(":", "."));
  }

  if (
    loHrHiin.value.toString().trim().length > 0 &&
    loHrHiin.value.toString().trim() != "00:00"
  ) {
    lnEsHiin = parseFloat(loHrHiin.value.toString().replace(":", "."));
  }

  if (
    loHrHtin.value.toString().trim().length > 0 &&
    loHrHtin.value.toString().trim() != "00:00"
  ) {
    lnEsHtin = parseFloat(loHrHtin.value.toString().replace(":", "."));
  }

  if (
    loHrHter.value.toString().trim().length > 0 &&
    loHrHter.value.toString().trim() != "00:00"
  ) {
    lnEsHter = parseFloat(loHrHter.value.toString().replace(":", "."));
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "ldEsData", pa_tipo: "SmallDatetime", pa_valo: lcEsData },
    { pa_nome: "lnEsHent", pa_tipo: "Decimal", pa_valo: lnEsHent },
    { pa_nome: "lnEsHiin", pa_tipo: "Decimal", pa_valo: lnEsHiin },
    { pa_nome: "lnEsHtin", pa_tipo: "Decimal", pa_valo: lnEsHtin },
    { pa_nome: "lnEsHter", pa_tipo: "Decimal", pa_valo: lnEsHter },
    { pa_nome: "lcEsJust", pa_tipo: "VarChar", pa_valo: lcEsJust },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereApontamentoSecullumManual",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.popup.close();

      try {
        if (lmWkRsql[0].es_erro.trim().length > 0) {
          alerta(lmWkRsql[0].es_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          montaApontamentosSecullum(lmWkRsql);
          pesquisaHistoricoEdicaoApontamentosSecullumCES();
          pesquisaApontamentosAplicativoSecullumPeriodoCAD();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function adicionaApontamentoSecullumCES() {
  var loDvTitu = document.getElementById("divTituCES");
  var loAhBtao = document.getElementById("ahrBtaoCES");
  var loIcBtao = document.getElementById("icnBtaoCES");
  var loDvBtao = document.getElementById("divBtaoCES");
  var loHrHent = document.getElementById("hraHentCES");
  var loHrHiin = document.getElementById("hraHiinCES");
  var loHrHtin = document.getElementById("hraHtinCES");
  var loHrHter = document.getElementById("hraHterCES");
  var ldAsData = new Date();
  var lnIdDsem = 0;

  ldAsData.setHours(0, 0, 0, 0);

  ldAsData = new Date(stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data)));

  if (gmTbJornCES.length == 0) {
    alerta("carregando jornada, aguarde...", "alerta");

    return;
  }

  limpaCamposPopUpCES();

  loDvTitu.innerHTML = "inclusão de apontamento facial";

  loAhBtao.onclick = function () {
    insereApontamentoSecullumManualCES();
  };

  loIcBtao.innerHTML = "cloud_upload";
  loDvBtao.innerHTML = "salvar";

  lnIdDsem = ldAsData.getDay();

  for (var i = 0; i < gmTbJornCES.length; i++) {
    if (parseInt(gmTbJornCES[i].id_dsem) == lnIdDsem + 1) {
      loHrHent.value = pad(gmTbJornCES[i].jo_hent.toFixed(2), 5).replace(
        ".",
        ":"
      );

      app.input.validate(loHrHent);

      loHrHiin.value = pad(gmTbJornCES[i].jo_hiin.toFixed(2), 5).replace(
        ".",
        ":"
      );

      app.input.validate(loHrHiin);

      loHrHtin.value = pad(gmTbJornCES[i].jo_htin.toFixed(2), 5).replace(
        ".",
        ":"
      );

      app.input.validate(loHrHtin);

      loHrHter.value = pad(gmTbJornCES[i].jo_hter.toFixed(2), 5).replace(
        ".",
        ":"
      );

      app.input.validate(loHrHter);

      calculaHorasCES();

      break;
    }
  }
}

function validaHorariosCES() {
  var loHrHent = document.getElementById("hraHentCES");
  var loHrHiin = document.getElementById("hraHiinCES");
  var loHrHtin = document.getElementById("hraHtinCES");
  var loHrHter = document.getElementById("hraHterCES");
  var ldEsHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldEsHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldEsHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldEsHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [];

  try {
    if (
      loHrHent.value.toString().trim().length > 0 &&
      loHrHent.value.toString().trim() != "00:00"
    ) {
      ldEsHent = new Date(
        stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data))
      );

      lmHrHora = loHrHent.value.toString().split(":");

      ldEsHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHiin.value.toString().trim().length > 0 &&
      loHrHiin.value.toString().trim() != "00:00"
    ) {
      ldEsHiin = new Date(
        stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data))
      );

      lmHrHora = loHrHiin.value.toString().split(":");

      ldEsHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHtin.value.toString().trim().length > 0 &&
      loHrHtin.value.toString().trim() != "00:00"
    ) {
      ldEsHtin = new Date(
        stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data))
      );

      lmHrHora = loHrHtin.value.toString().split(":");

      ldEsHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHter.value.toString().trim().length > 0 &&
      loHrHter.value.toString().trim() != "00:00"
    ) {
      ldEsHter = new Date(
        stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data))
      );

      lmHrHora = loHrHter.value.toString().split(":");

      ldEsHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  if (ldEsHent.getFullYear() == 1900) {
    app.input.validate(loHrHent);

    alerta("horário da primeira entrada inválido", "alerta");

    return false;
  }

  if (ldEsHiin.getFullYear() == 1900) {
    app.input.validate(loHrHiin);

    alerta("horário da primeira saída inválido", "alerta");

    return false;
  }

  if (ldEsHtin.getFullYear() == 1900) {
    app.input.validate(loHrHtin);

    alerta("horário da segunda entrada inválido", "alerta");

    return false;
  }

  if (ldEsHter.getFullYear() == 1900) {
    app.input.validate(loHrHter);

    alerta("horário da segunda saída inválido", "alerta");

    return false;
  }

  return true;
}

function atualizaApontamentoSecullumCES(loApSecu) {
  var loHrHent = document.getElementById("hraHentCES"),
    loHrHiin = document.getElementById("hraHiinCES"),
    loHrHtin = document.getElementById("hraHtinCES"),
    loHrHter = document.getElementById("hraHterCES"),
    loTaJust = document.getElementById("txaJustCES");
  var lmWkIsql = [];
  var lcWkIsql = "",
    lcAsData = "1900-01-01",
    lcFuEmpr = "",
    lcEsJust = "";
  var lnIdMatr = 0,
    lnAsHent = 0,
    lnAsHiin = 0,
    lnAsHtin = 0,
    lnAsHter = 0,
    lnEsHent = 0,
    lnEsHiin = 0,
    lnEsHtin = 0,
    lnEsHter = 0;

  if (!validaHorariosCES()) {
    return;
  }

  app.input.validate(loTaJust);

  lcEsJust = loTaJust.value.toString().trim().toUpperCase();

  if (lcEsJust.trim().length == 0) {
    alerta("justificativa inválida", "alerta");

    return;
  }

  try {
    if (loApSecu.fu_empr.trim().length > 0) {
      lcFuEmpr = loApSecu.fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (parseInt(loApSecu.id_matr) > 0) {
      lnIdMatr = parseInt(loApSecu.id_matr);
    }
  } catch (error) {}

  try {
    if (jsonDate(loApSecu.as_data).trim().length > 0) {
      lcAsData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(loApSecu.as_data))
      );
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_hent) > 0) {
      lnAsHent = parseFloat(loApSecu.as_hent);
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_hiin) > 0) {
      lnAsHiin = parseFloat(loApSecu.as_hiin);
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_htin) > 0) {
      lnAsHtin = parseFloat(loApSecu.as_htin);
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_hter) > 0) {
      lnAsHter = parseFloat(loApSecu.as_hter);
    }
  } catch (error) {}

  if (
    loHrHent.value.toString().trim().length > 0 &&
    loHrHent.value.toString().trim() != "00:00"
  ) {
    lnEsHent = parseFloat(loHrHent.value.toString().replace(":", "."));
  }

  if (
    loHrHiin.value.toString().trim().length > 0 &&
    loHrHiin.value.toString().trim() != "00:00"
  ) {
    lnEsHiin = parseFloat(loHrHiin.value.toString().replace(":", "."));
  }

  if (
    loHrHtin.value.toString().trim().length > 0 &&
    loHrHtin.value.toString().trim() != "00:00"
  ) {
    lnEsHtin = parseFloat(loHrHtin.value.toString().replace(":", "."));
  }

  if (
    loHrHter.value.toString().trim().length > 0 &&
    loHrHter.value.toString().trim() != "00:00"
  ) {
    lnEsHter = parseFloat(loHrHter.value.toString().replace(":", "."));
  }

  if (
    lnAsHent == lnEsHent &&
    lnAsHiin == lnEsHiin &&
    lnAsHtin == lnEsHtin &&
    lnAsHter == lnEsHter
  ) {
    alerta("nenhum horário alterado", "alerta");

    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "ldAsData", pa_tipo: "SmallDatetime", pa_valo: lcAsData },
    { pa_nome: "lnAsHent", pa_tipo: "Decimal", pa_valo: lnAsHent },
    { pa_nome: "lnAsHiin", pa_tipo: "Decimal", pa_valo: lnAsHiin },
    { pa_nome: "lnAsHtin", pa_tipo: "Decimal", pa_valo: lnAsHtin },
    { pa_nome: "lnAsHter", pa_tipo: "Decimal", pa_valo: lnAsHter },
    { pa_nome: "lnEsHent", pa_tipo: "Decimal", pa_valo: lnEsHent },
    { pa_nome: "lnEsHiin", pa_tipo: "Decimal", pa_valo: lnEsHiin },
    { pa_nome: "lnEsHtin", pa_tipo: "Decimal", pa_valo: lnEsHtin },
    { pa_nome: "lnEsHter", pa_tipo: "Decimal", pa_valo: lnEsHter },
    { pa_nome: "lcEsJust", pa_tipo: "VarChar", pa_valo: lcEsJust },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaApontamentoSecullum",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.popup.close();

      try {
        if (lmWkRsql[0].es_erro.trim().length > 0) {
          alerta(lmWkRsql[0].es_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          montaApontamentosSecullum(lmWkRsql);
          pesquisaHistoricoEdicaoApontamentosSecullumCES();
          pesquisaApontamentosAplicativoSecullumPeriodoCAD();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function alteraApontamentoSecullumCES(lcApSecu) {
  var loDvTitu = document.getElementById("divTituCES");
  var loAhBtao = document.getElementById("ahrBtaoCES");
  var loIcBtao = document.getElementById("icnBtaoCES");
  var loDvBtao = document.getElementById("divBtaoCES");
  var loHrHent = document.getElementById("hraHentCES");
  var loHrHiin = document.getElementById("hraHiinCES");
  var loHrHtin = document.getElementById("hraHtinCES");
  var loHrHter = document.getElementById("hraHterCES");
  var loApSecu = JSON.parse(unescape(lcApSecu));

  limpaCamposPopUpCES();

  loDvTitu.innerHTML = "alteração de apontamento facial";

  loAhBtao.onclick = function () {
    atualizaApontamentoSecullumCES(loApSecu);
  };

  loIcBtao.innerHTML = "edit";
  loDvBtao.innerHTML = "alterar";

  loHrHent.value = pad(loApSecu.as_hent.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHent);

  loHrHiin.value = pad(loApSecu.as_hiin.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHiin);

  loHrHtin.value = pad(loApSecu.as_htin.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHtin);

  loHrHter.value = pad(loApSecu.as_hter.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHter);

  calculaHorasCES();
}

function calculaHorasCES() {
  var loHrHent = document.getElementById("hraHentCES"),
    loHrHiin = document.getElementById("hraHiinCES"),
    loHrHtin = document.getElementById("hraHtinCES"),
    loHrHter = document.getElementById("hraHterCES"),
    loDvThor = document.getElementById("divThorCES");
  var lnAsJdms = 0,
    lnAsJmms = 0,
    lnAsJtms = 0;
  var ldAsData = new Date(),
    ldAsHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldAsHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldAsHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldAsHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [];

  ldAsData.setHours(0, 0, 0, 0);

  ldAsData = new Date(stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data)));

  try {
    if (
      loHrHent.value.toString().trim().length > 0 &&
      loHrHent.value.toString().trim() != "00:00"
    ) {
      ldAsHent = new Date(ldAsData);

      lmHrHora = loHrHent.value.toString().split(":");

      ldAsHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHiin.value.toString().trim().length > 0 &&
      loHrHiin.value.toString().trim() != "00:00"
    ) {
      ldAsHiin = new Date(ldAsData);

      lmHrHora = loHrHiin.value.toString().split(":");

      ldAsHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHtin.value.toString().trim().length > 0 &&
      loHrHtin.value.toString().trim() != "00:00"
    ) {
      ldAsHtin = new Date(ldAsData);

      lmHrHora = loHrHtin.value.toString().split(":");

      ldAsHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHter.value.toString().trim().length > 0 &&
      loHrHter.value.toString().trim() != "00:00"
    ) {
      ldAsHter = new Date(ldAsData);

      lmHrHora = loHrHter.value.toString().split(":");

      ldAsHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  if (ldAsHent.getFullYear() > 1900 && ldAsHiin.getFullYear() > 1900) {
    if (ldAsHent <= ldAsHiin) {
      lnAsJmms = ldAsHiin - ldAsHent;
    } else {
      ldAsHiin = ldAsHiin.addDays(1);

      if (ldAsHtin.getFullYear() > 1900) {
        ldAsHtin = ldAsHtin.addDays(1);
      }

      if (ldAsHter.getFullYear() > 1900) {
        ldAsHter = ldAsHter.addDays(1);
      }

      lnAsJmms = ldAsHiin - ldAsHent;
    }
  }

  if (
    ldAsHiin.getFullYear() > 1900 &&
    ldAsHtin.getFullYear() > 1900 &&
    ldAsHiin > ldAsHtin
  ) {
    ldAsHtin = ldAsHtin.addDays(1);

    if (ldAsHter.getFullYear() > 1900) {
      ldAsHter = ldAsHter.addDays(1);
    }
  }

  if (ldAsHtin.getFullYear() > 1900 && ldAsHter.getFullYear() > 1900) {
    if (ldAsHtin <= ldAsHter) {
      lnAsJtms = ldAsHter - ldAsHtin;
    } else {
      ldAsHter = ldAsHter.addDays(1);

      lnAsJtms = ldAsHter - ldAsHtin;
    }
  }

  lnAsJdms = lnAsJmms + lnAsJtms;

  if (lnAsJdms > 0) {
    loDvThor.innerHTML =
      pad(Math.floor(lnAsJdms / (1000 * 60 * 60)), 2) +
      ":" +
      pad((lnAsJdms % (1000 * 60 * 60)) / (1000 * 60), 2);
  } else {
    loDvThor.innerHTML = "";
  }
}

function montaHistoricoApontamentosSecullum(lmEdSecu) {
  var loDvHist = document.getElementById("divHistCES");
  var lcEdSecu = "",
    lcEsTipo = "";
  var lnEsMnap = 0,
    lnIdEdit = 0;
  var llEsJust = false;

  for (var i = 0; i < lmEdSecu.length; i++) {
    if (lmEdSecu[i].es_tipo.trim().toUpperCase() == "A") {
      lcEsTipo = "ANTES";
    } else if (lmEdSecu[i].es_tipo.trim().toUpperCase() == "D") {
      lcEsTipo = "DEPOIS";
    } else {
      lcEsTipo = "";
    }

    if (lnIdEdit != parseInt(lmEdSecu[i].id_edit)) {
      lnIdEdit = parseInt(lmEdSecu[i].id_edit);

      //prettier-ignore
      lcEdSecu +=
        "<div class='row no-gap'>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>" + lmEdSecu[i].es_desc.trim().toUpperCase() + " " + lnIdEdit.toString() + " por " + lmEdSecu[i].id_user.trim().toUpperCase() + " em " + jsonDate(lmEdSecu[i].es_dtid) + " às " + jsonHora(lmEdSecu[i].es_dtid) + "</b></span>" +
          "</div>" +
        "</div>" +
        "<div class='row no-gap'>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>tipo</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>entrada</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>saída</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>entrada</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>saída</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>total</b></span>" +
          "</div>" +
        "</div>";
    }

    lnEsMnap = calculaMinutosCES(
      stringDataParaObjetoData(jsonDate(lmEdSecu[i].es_data)),
      pad(lmEdSecu[i].es_hent.toFixed(2), 5).replace(".", ":"),
      pad(lmEdSecu[i].es_hiin.toFixed(2), 5).replace(".", ":"),
      pad(lmEdSecu[i].es_htin.toFixed(2), 5).replace(".", ":"),
      pad(lmEdSecu[i].es_hter.toFixed(2), 5).replace(".", ":")
    );

    //prettier-ignore
    lcEdSecu += 
        "<div class='row no-gap'>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + lcEsTipo + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmEdSecu[i].es_hent.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmEdSecu[i].es_hiin.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmEdSecu[i].es_htin.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmEdSecu[i].es_hter.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(parseInt(Math.floor(parseInt(lnEsMnap) / 60)), 2) + ":" + pad(parseInt(parseInt(lnEsMnap) % 60), 2) + "</span>" +
          "</div>" +
        "</div>";

    try {
      if (lnIdEdit != parseInt(lmEdSecu[i + 1].id_edit)) {
        llEsJust = true;
      } else {
        llEsJust = false;
      }
    } catch (error) {
      llEsJust = true;
    }

    if (llEsJust) {
      //prettier-ignore
      lcEdSecu += 
        "<div class='row no-gap'>" +
          "<div class='col borda'><textarea readonly style='text-align: center; font-weight: bold; width: 100%;'>" + lmEdSecu[i].es_just.trim().toUpperCase() + "</textarea></div>" +
        "</div>" +
        "<br />";
    }
  }

  loDvHist.innerHTML = lcEdSecu;
}

function pesquisaHistoricoEdicaoApontamentosSecullumCES() {
  var loDvThst = document.getElementById("divThstCES");
  var lmWkIsql = [];
  var lcWkIsql = "",
    lcEsData = "1900-01-01",
    lcFuEmpr = "";
  var lnIdMatr = 0;

  try {
    if (jsonDate(goAsApntCES.ap_data).trim().length > 0) {
      lcEsData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data))
      );
    }
  } catch (error) {}

  try {
    if (goAsApntCES.fu_empr.trim().length > 0) {
      lcFuEmpr = goAsApntCES.fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (parseInt(goAsApntCES.id_matr) > 0) {
      lnIdMatr = parseInt(goAsApntCES.id_matr);
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldEsData", pa_tipo: "SmallDatetime", pa_valo: lcEsData },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaHistoricoEdicaoApontamentosSecullum",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loDvThst.style.display = "";
        }

        montaHistoricoApontamentosSecullum(lmWkRsql);
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function deletaApontamentoSecullumCES(loApSecu) {
  var loTaJust = document.getElementById("txaJustCES");
  var lmWkIsql = [];
  var lcWkIsql = "",
    lcAsData = "1900-01-01",
    lcFuEmpr = "",
    lcEsJust = "";
  var lnIdMatr = 0,
    lnAsHent = 0,
    lnAsHiin = 0,
    lnAsHtin = 0,
    lnAsHter = 0;

  app.input.validate(loTaJust);

  lcEsJust = loTaJust.value.toString().trim().toUpperCase();

  if (lcEsJust.trim().length == 0) {
    alerta("justificativa inválida", "alerta");

    return;
  }

  try {
    if (loApSecu.fu_empr.trim().length > 0) {
      lcFuEmpr = loApSecu.fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (parseInt(loApSecu.id_matr) > 0) {
      lnIdMatr = parseInt(loApSecu.id_matr);
    }
  } catch (error) {}

  try {
    if (jsonDate(loApSecu.as_data).trim().length > 0) {
      lcAsData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(loApSecu.as_data))
      );
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_hent) > 0) {
      lnAsHent = parseFloat(loApSecu.as_hent);
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_hiin) > 0) {
      lnAsHiin = parseFloat(loApSecu.as_hiin);
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_htin) > 0) {
      lnAsHtin = parseFloat(loApSecu.as_htin);
    }
  } catch (error) {}

  try {
    if (parseFloat(loApSecu.as_hter) > 0) {
      lnAsHter = parseFloat(loApSecu.as_hter);
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "ldAsData", pa_tipo: "SmallDatetime", pa_valo: lcAsData },
    { pa_nome: "lnAsHent", pa_tipo: "Decimal", pa_valo: lnAsHent },
    { pa_nome: "lnAsHiin", pa_tipo: "Decimal", pa_valo: lnAsHiin },
    { pa_nome: "lnAsHtin", pa_tipo: "Decimal", pa_valo: lnAsHtin },
    { pa_nome: "lnAsHter", pa_tipo: "Decimal", pa_valo: lnAsHter },
    { pa_nome: "lcEsJust", pa_tipo: "VarChar", pa_valo: lcEsJust },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=deletaApontamentoSecullum",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.popup.close();

      try {
        montaApontamentosSecullum(lmWkRsql);
        pesquisaHistoricoEdicaoApontamentosSecullumCES();
        pesquisaApontamentosAplicativoSecullumPeriodoCAD();
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function removeApontamentoSecullumCES(lcApSecu) {
  var loDvTitu = document.getElementById("divTituCES");
  var loAhBtao = document.getElementById("ahrBtaoCES");
  var loIcBtao = document.getElementById("icnBtaoCES");
  var loDvBtao = document.getElementById("divBtaoCES");
  var loHrHent = document.getElementById("hraHentCES");
  var loHrHiin = document.getElementById("hraHiinCES");
  var loHrHtin = document.getElementById("hraHtinCES");
  var loHrHter = document.getElementById("hraHterCES");
  var loApSecu = JSON.parse(unescape(lcApSecu));

  limpaCamposPopUpCES();

  loDvTitu.innerHTML = "exclusão de apontamento facial";

  loAhBtao.onclick = function () {
    deletaApontamentoSecullumCES(loApSecu);
  };

  loIcBtao.innerHTML = "delete_forever";
  loDvBtao.innerHTML = "excluir";

  loHrHent.value = pad(loApSecu.as_hent.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHent);

  loHrHent.disabled = true;

  loHrHiin.value = pad(loApSecu.as_hiin.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHiin);

  loHrHiin.disabled = true;

  loHrHtin.value = pad(loApSecu.as_htin.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHtin);

  loHrHtin.disabled = true;

  loHrHter.value = pad(loApSecu.as_hter.toFixed(2), 5).replace(".", ":");

  app.input.validate(loHrHter);

  loHrHter.disabled = true;

  calculaHorasCES();
}

function calculaMinutosCES(ldAsData, lcApHent, lcApHiin, lcApHtin, lcApHter) {
  var lnAsJdms = 0,
    lnAsJmms = 0,
    lnAsJtms = 0;
  var ldAsHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldAsHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldAsHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldAsHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [];

  try {
    if (lcApHent.trim().length > 0) {
      ldAsHent = new Date(ldAsData);

      lmHrHora = lcApHent.trim().split(":");

      ldAsHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHiin.trim().length > 0) {
      ldAsHiin = new Date(ldAsData);

      lmHrHora = lcApHiin.trim().split(":");

      ldAsHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHtin.trim().length > 0) {
      ldAsHtin = new Date(ldAsData);

      lmHrHora = lcApHtin.trim().split(":");

      ldAsHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHter.trim().length > 0) {
      ldAsHter = new Date(ldAsData);

      lmHrHora = lcApHter.trim().split(":");

      ldAsHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  if (ldAsHent.getFullYear() > 1900 && ldAsHiin.getFullYear() > 1900) {
    if (ldAsHent <= ldAsHiin) {
      lnAsJmms = ldAsHiin - ldAsHent;
    } else {
      ldAsHiin = ldAsHiin.addDays(1);

      if (ldAsHtin.getFullYear() > 1900) {
        ldAsHtin = ldAsHtin.addDays(1);
      }

      if (ldAsHter.getFullYear() > 1900) {
        ldAsHter = ldAsHter.addDays(1);
      }

      lnAsJmms = ldAsHiin - ldAsHent;
    }
  }

  if (
    ldAsHiin.getFullYear() > 1900 &&
    ldAsHtin.getFullYear() > 1900 &&
    ldAsHiin > ldAsHtin
  ) {
    ldAsHtin = ldAsHtin.addDays(1);

    if (ldAsHter.getFullYear() > 1900) {
      ldAsHter = ldAsHter.addDays(1);
    }
  }

  if (ldAsHtin.getFullYear() > 1900 && ldAsHter.getFullYear() > 1900) {
    if (ldAsHtin <= ldAsHter) {
      lnAsJtms = ldAsHter - ldAsHtin;
    } else {
      ldAsHter = ldAsHter.addDays(1);

      lnAsJtms = ldAsHter - ldAsHtin;
    }
  }

  lnAsJdms = lnAsJmms + lnAsJtms;

  return Math.floor(lnAsJdms / (1000 * 60));
}

function montaApontamentosSecullum(lmApSecu) {
  var loDvSecu = document.getElementById("divSecuCES");
  var lcApSecu = "";
  var lnAsMnap = 0;

  loDvSecu.innerHTML = "";

  if (lmApSecu.length > 0) {
    //prettier-ignore
    lcApSecu +=
        "<div class='row no-gap'>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>excluir</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>editar</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>entrada</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>saída</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>entrada</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>saída</b></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span><b>total</b></span>" +
          "</div>" +
        "</div>";

    for (var i = 0; i < lmApSecu.length; i++) {
      lnAsMnap = calculaMinutosCES(
        stringDataParaObjetoData(jsonDate(lmApSecu[i].as_data)),
        pad(lmApSecu[i].as_hent.toFixed(2), 5).replace(".", ":"),
        pad(lmApSecu[i].as_hiin.toFixed(2), 5).replace(".", ":"),
        pad(lmApSecu[i].as_htin.toFixed(2), 5).replace(".", ":"),
        pad(lmApSecu[i].as_hter.toFixed(2), 5).replace(".", ":")
      );

      //prettier-ignore
      lcApSecu += 
        "<div class='row no-gap'>" +
          "<div class='col borda item-link popup-open' data-popup='.clsPpupCES' style='text-align: center;' onclick='removeApontamentoSecullumCES(\"" + escape(JSON.stringify(lmApSecu[i])) + "\");'>" +
            "<span style='color: " + corTema() + ";'><i class='material-icons' style='font-size: 16px;'>delete_forever</i></span>" +
          "</div>" +
          "<div class='col borda item-link popup-open' data-popup='.clsPpupCES' style='text-align: center;' onclick='alteraApontamentoSecullumCES(\"" + escape(JSON.stringify(lmApSecu[i])) + "\");'>" +
            "<span style='color: " + corTema() + ";'><i class='material-icons' style='font-size: 16px;'>edit</i></span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmApSecu[i].as_hent.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmApSecu[i].as_hiin.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmApSecu[i].as_htin.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(lmApSecu[i].as_hter.toFixed(2), 5).replace(".", ":") + "</span>" +
          "</div>" +
          "<div class='col borda' style='text-align: center;'>" +
            "<span>" + pad(parseInt(Math.floor(parseInt(lnAsMnap) / 60)), 2) + ":" + pad(parseInt(parseInt(lnAsMnap) % 60), 2) + "</span>" +
          "</div>" +
        "</div>";
    }

    loDvSecu.innerHTML = lcApSecu;
  }
}

function pesquisaApontamentosSecullumFuncionarioCES() {
  var lmWkIsql = [];
  var lcWkIsql = "",
    lcAsData = "1900-01-01",
    lcFuEmpr = "";
  var lnIdMatr = 0;

  try {
    if (jsonDate(goAsApntCES.ap_data).trim().length > 0) {
      lcAsData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(goAsApntCES.ap_data))
      );
    }
  } catch (error) {}

  try {
    if (goAsApntCES.fu_empr.trim().length > 0) {
      lcFuEmpr = goAsApntCES.fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (parseInt(goAsApntCES.id_matr) > 0) {
      lnIdMatr = parseInt(goAsApntCES.id_matr);
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldAsData", pa_tipo: "SmallDatetime", pa_valo: lcAsData },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaApontamentosSecullumFuncionario",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        montaApontamentosSecullum(lmWkRsql);
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaJornadaCES() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdClie = null;

  try {
    if (parseInt(goAsApntCES.id_clie) > 0) {
      lnIdClie = parseInt(goAsApntCES.id_clie);
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaJornada",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmTbJornCES = lmWkRsql;
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function limpaCamposPopUpCES() {
  var loDvTitu = document.getElementById("divTituCES");
  var loAhBtao = document.getElementById("ahrBtaoCES");
  var loIcBtao = document.getElementById("icnBtaoCES");
  var loDvBtao = document.getElementById("divBtaoCES");
  var loHrHent = document.getElementById("hraHentCES");
  var loHrHiin = document.getElementById("hraHiinCES");
  var loHrHtin = document.getElementById("hraHtinCES");
  var loHrHter = document.getElementById("hraHterCES");
  var loDvThor = document.getElementById("divThorCES");
  var loTaJust = document.getElementById("txaJustCES");

  loDvTitu.innerHTML = "";

  loAhBtao.onclick = null;

  loIcBtao.innerHTML = "";
  loDvBtao.innerHTML = "";

  loHrHent.value = "";

  loHrHent.disabled = false;

  loHrHiin.value = "";

  loHrHiin.disabled = false;

  loHrHtin.value = "";

  loHrHtin.disabled = false;

  loHrHter.value = "";

  loHrHter.disabled = false;

  loDvThor.innerHTML = "";

  loTaJust.value = "";
}

function limpaCamposCES() {
  var loDvEmpr = document.getElementById("divEmprCES");
  var loDvMatr = document.getElementById("divMatrCES");
  var loDvNome = document.getElementById("divNomeCES");
  var loDvFant = document.getElementById("divFantCES");
  var loDvData = document.getElementById("divDataCES");
  var loDvSecu = document.getElementById("divSecuCES");
  var loDvThst = document.getElementById("divThstCES");
  var loDvHist = document.getElementById("divHistCES");

  loDvEmpr.innerHTML = "";
  loDvMatr.innerHTML = "";
  loDvNome.innerHTML = "";
  loDvFant.innerHTML = "";
  loDvData.innerHTML = "";
  loDvSecu.innerHTML = "";

  loDvThst.style.display = "none";

  loDvHist.innerHTML = "";

  limpaCamposPopUpCES();
}

function ComlEdSecu() {
  var loDvEmpr = document.getElementById("divEmprCES");
  var loDvMatr = document.getElementById("divMatrCES");
  var loDvNome = document.getElementById("divNomeCES");
  var loDvFant = document.getElementById("divFantCES");
  var loDvData = document.getElementById("divDataCES");

  limpaCamposCES();

  try {
    goAsApntCES = JSON.parse(sessionStorage.getItem("soApApnt"));

    if (parseInt(goAsApntCES.id_matr) > 0) {
      sessionStorage.removeItem("soApApnt");

      loDvEmpr.innerHTML = goAsApntCES.em_fant.trim().toUpperCase();
      loDvMatr.innerHTML = goAsApntCES.id_matr.toString();
      loDvNome.innerHTML = goAsApntCES.fu_nome.trim().toUpperCase();
      loDvFant.innerHTML = goAsApntCES.cl_fant.trim().toUpperCase();
      loDvData.innerHTML = jsonDate(goAsApntCES.ap_data);
    }
  } catch (loApErro) {}

  pesquisaJornadaCES();
  pesquisaApontamentosSecullumFuncionarioCES();
  pesquisaHistoricoEdicaoApontamentosSecullumCES();
}
