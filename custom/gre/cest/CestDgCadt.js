var goCdCadtCDC = {};

function alteraQuantidadeCDC() {
  var loNrQtde = document.getElementById("nroQtdeCDC");
  var loDvTcus = document.getElementById("divTcusCDC");
  var lnIdCest = 0,
    lnCePcus = 0,
    lnSmQtde = 0;

  try {
    if (parseInt(goCdCadtCDC.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDC.id_cest);

      lcCeTipo = goCdCadtCDC.ce_tipo.trim().toUpperCase();

      lnCePcus = parseFloat(goCdCadtCDC.ce_pcus);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnSmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (parseFloat(lnSmQtde * lnCePcus) > 0) {
    loDvTcus.innerHTML = brMoney(lnSmQtde * lnCePcus);
  } else {
    loDvTcus.innerHTML = "";
  }
}

function adicionaCadastroEstoqueCDC() {
  var loNrQtde = document.getElementById("nroQtdeCDC");
  var loLiMotv = document.getElementById("lliMotvCDC");
  var loTaMotv = document.getElementById("txaMotvCDC");
  var loBdQtde = {};
  var lnIdCest = 0,
    lnSmQtde = 0,
    lnCePcus = 0;
  var llCpAlrt = false;

  if (loNrQtde.value.toString().trim().length == 0) {
    app.input.validate(loNrQtde);

    llCpAlrt = true;
  }

  if (
    loLiMotv.style.display.trim().length == 0 &&
    loTaMotv.value.toString().trim().length == 0
  ) {
    app.input.validate(loTaMotv);

    llCpAlrt = true;
  }

  if (llCpAlrt) {
    return;
  }

  try {
    if (parseInt(goCdCadtCDC.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDC.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    goMnView.router.back();

    return;
  }

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCSC");

  if (parseFloat(goCdCadtCDC.ce_pcus) > 0) {
    lnCePcus = parseFloat(goCdCadtCDC.ce_pcus);
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnSmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  for (var i = 0; i < gmCdCadtCSC.length; i++) {
    if (parseInt(gmCdCadtCSC[i].id_cest) == lnIdCest) {
      gmCdCadtCSC[i].sm_qtde = lnSmQtde;
      gmCdCadtCSC[i].sm_motv = loTaMotv.value.toString().trim().toUpperCase();
      gmCdCadtCSC[i].sm_pcus = lnCePcus;

      totalCSC();

      loBdQtde.innerHTML =
        brDecimal(lnSmQtde) +
        " x " +
        brMoney(lnCePcus) +
        " = " +
        brMoney(lnSmQtde * lnCePcus);

      if (lnSmQtde > 0) {
        loBdQtde.style.color = corTema();
      } else {
        loBdQtde.style.color = "";
      }

      break;
    }
  }

  goMnView.router.back();
}

function consultaCustoCadastroEstoqueCDC() {
  var loNrQtde = document.getElementById("nroQtdeCDC");
  var loDvPcus = document.getElementById("divPcusCDC");
  var loDvTcus = document.getElementById("divTcusCDC");
  var lnIdCest = 0,
    lnIdAlmx = 1,
    lnCePcus = 0,
    lnSmQtde = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goCdCadtCDC.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDC.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdAlmx", pa_tipo: "Int", pa_valo: lnIdAlmx },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaCustoCadastroEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseFloat(lmWkRsql[0].ce_pcus) > 0) {
          lnCePcus = parseFloat(lmWkRsql[0].ce_pcus);
        }
      } catch (loApErro) {}

      if (lnCePcus > 0) {
        goCdCadtCDC.ce_pcus = lnCePcus;

        loDvPcus.innerHTML = brMoney(lnCePcus);
      }

      try {
        if (parseFloat(loNrQtde.value) > 0) {
          lnSmQtde = parseFloat(loNrQtde.value);
        }
      } catch (error) {}

      if (parseFloat(lnSmQtde * lnCePcus) > 0) {
        loDvTcus.innerHTML = brMoney(lnSmQtde * lnCePcus);
      }
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaSaldoEstoqueEmpenhadoCDC() {
  var loDvQemp = document.getElementById("divQempCDC");
  var loDvQenv = document.getElementById("divQenvCDC");
  var loDvQvir = document.getElementById("divQvirCDC");
  var loDvQesd = document.getElementById("divQesdCDC");
  var lnIdCest = 0,
    lnCeQest = 0,
    lnCeQemp = 0,
    lnCeQenv = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goCdCadtCDC.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDC.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaSaldoEstoqueEmpenhado",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseFloat(lmWkRsql[0].ce_qemp) > 0) {
          lnCeQemp = parseFloat(lmWkRsql[0].ce_qemp);
        }

        if (parseFloat(lmWkRsql[0].ce_qenv) > 0) {
          lnCeQenv = parseFloat(lmWkRsql[0].ce_qenv);
        }
      } catch (loApErro) {}

      goCdCadtCDC["ce_qemp"] = lnCeQemp;
      goCdCadtCDC["ce_qenv"] = lnCeQenv;

      if (lnCeQemp > 0) {
        loDvQemp.innerHTML = brDecimal(lnCeQemp);
      }

      if (lnCeQenv > 0) {
        loDvQenv.innerHTML = brDecimal(lnCeQenv);
      }

      try {
        if (parseFloat(goCdCadtCDC.ce_qest) > 0) {
          lnCeQest = parseFloat(goCdCadtCDC.ce_qest);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
    error: function (jqXHR, textStatus, err) {
      goCdCadtCDC["ce_qemp"] = lnCeQemp;
      goCdCadtCDC["ce_qenv"] = lnCeQenv;

      if (lnCeQemp > 0) {
        loDvQemp.innerHTML = brDecimal(lnCeQemp);
      }

      if (lnCeQenv > 0) {
        loDvQenv.innerHTML = brDecimal(lnCeQenv);
      }

      try {
        if (parseFloat(goCdCadtCDC.ce_qest) > 0) {
          lnCeQest = parseFloat(goCdCadtCDC.ce_qest);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
  });
}

function consultaSaldoEstoqueCDC() {
  var loDvQest = document.getElementById("divQestCDC");
  var loDvQvir = document.getElementById("divQvirCDC");
  var loDvQesd = document.getElementById("divQesdCDC");
  var lnIdCest = 0,
    lnIdAlmx = 1,
    lnCeQest = 0,
    lnCeQemp = 0,
    lnCeQenv = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goCdCadtCDC.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDC.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdAlmx", pa_tipo: "Int", pa_valo: lnIdAlmx },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaSaldoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseFloat(lmWkRsql[0].ce_qest) > 0) {
          lnCeQest = parseFloat(lmWkRsql[0].ce_qest);
        }
      } catch (loApErro) {}

      goCdCadtCDC["ce_qest"] = lnCeQest;

      if (lnCeQest > 0) {
        loDvQest.innerHTML = brDecimal(lnCeQest);
      }

      try {
        if (parseFloat(goCdCadtCDC.ce_qemp) > 0) {
          lnCeQemp = parseFloat(goCdCadtCDC.ce_qemp);
        }
      } catch (error) {}

      try {
        if (parseFloat(goCdCadtCDC.ce_qenv) > 0) {
          lnCeQenv = parseFloat(goCdCadtCDC.ce_qenv);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
    error: function (jqXHR, textStatus, err) {
      goCdCadtCDC["ce_qest"] = lnCeQest;

      goCdCadtCDC["ce_qest"] = lnCeQest;

      if (lnCeQest > 0) {
        loDvQest.innerHTML = brDecimal(lnCeQest);
      }

      try {
        if (parseFloat(goCdCadtCDC.ce_qemp) > 0) {
          lnCeQemp = parseFloat(goCdCadtCDC.ce_qemp);
        }
      } catch (error) {}

      try {
        if (parseFloat(goCdCadtCDC.ce_qenv) > 0) {
          lnCeQenv = parseFloat(goCdCadtCDC.ce_qenv);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
  });
}

function consultaCadastroEstoqueCDC() {
  var loDvCodi = document.getElementById("divCodiCDC");
  var loDvDeno = document.getElementById("divDenoCDC");
  var loDvUnid = document.getElementById("divUnidCDC");
  var loNrQtde = document.getElementById("nroQtdeCDC");
  var loDvPcus = document.getElementById("divPcusCDC");
  var loLiMotv = document.getElementById("lliMotvCDC");
  var loTaMotv = document.getElementById("txaMotvCDC");

  loDvCodi.innerHTML = goCdCadtCDC.ce_codi.trim().toUpperCase();
  loDvDeno.innerHTML =
    goCdCadtCDC.ce_deno.trim().toUpperCase() +
    " " +
    goCdCadtCDC.ce_espt.trim().toUpperCase();
  loDvUnid.innerHTML = goCdCadtCDC.ce_unes.trim().toUpperCase();

  consultaSaldoEstoqueCDC();
  consultaSaldoEstoqueEmpenhadoCDC();

  loDvPcus.innerHTML = brMoney(goCdCadtCDC.ce_pcus);

  consultaCustoCadastroEstoqueCDC();

  if (parseFloat(goCdCadtCDC.sm_qtde) > 0) {
    loNrQtde.value = parseFloat(goCdCadtCDC.sm_qtde);

    alteraQuantidadeCDC();
  }

  if (loLiMotv.style.display.trim().length == 0) {
    loTaMotv.value = goCdCadtCDC.sm_motv.trim().toUpperCase();
  }
}

function limpaCamposCDC() {
  var loDvCodi = document.getElementById("divCodiCDC");
  var loDvDeno = document.getElementById("divDenoCDC");
  var loDvUnid = document.getElementById("divUnidCDC");
  var loDvQest = document.getElementById("divQestCDC");
  var loDvQemp = document.getElementById("divQempCDC");
  var loDvQenv = document.getElementById("divQenvCDC");
  var loDvQvir = document.getElementById("divQvirCDC");
  var loDvQesd = document.getElementById("divQesdCDC");
  var loNrQtde = document.getElementById("nroQtdeCDC");
  var loDvPcus = document.getElementById("divPcusCDC");
  var loDvTcus = document.getElementById("divTcusCDC");
  var loLiMotv = document.getElementById("lliMotvCDC");
  var loTaMotv = document.getElementById("txaMotvCDC");

  goCdCadtCDC = {};

  loDvCodi.innerHTML = "";
  loDvDeno.innerHTML = "";
  loDvUnid.innerHTML = "";
  loDvQest.innerHTML = "";
  loDvQemp.innerHTML = "";
  loDvQenv.innerHTML = "";
  loDvQvir.innerHTML = "";
  loDvQesd.innerHTML = "";

  loNrQtde.value = "";

  loDvPcus.innerHTML = "";
  loDvTcus.innerHTML = "";

  loLiMotv.style.display = "none";

  loTaMotv.value = "";
}

function CestDgCadt() {
  var loLiMotv = document.getElementById("lliMotvCDC");

  limpaCamposCDC();

  goCdCadtCDC = JSON.parse(sessionStorage.getItem("soCdCadt"));

  try {
    if (parseInt(goCdCadtCDC.id_cest) > 0) {
      sessionStorage.removeItem("soCdCadt");

      if (parseInt(goCdCadtCDC.id_situ) > 1) {
        loLiMotv.style.display = "";
      }

      consultaCadastroEstoqueCDC();
    }
  } catch (error) {}

  OkTecladoAndroid("nroQtdeCDC");
}
