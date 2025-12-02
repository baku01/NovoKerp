var goCdCadtCDD = {};

function alteraQuantidadeCDD() {
  var loNrQtde = document.getElementById("nroQtdeCDD");
  var loDvTcus = document.getElementById("divTcusCDD");
  var lnIdCest = 0,
    lnDmPcus = 0,
    lnDmQtde = 0;

  try {
    if (parseInt(goCdCadtCDD.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDD.id_cest);

      lnDmPcus = parseFloat(goCdCadtCDD.ce_vcus);
    
      if (parseFloat(goCdCadtCDD.mv_pcus) > 0) {
        lnDmPcus = parseFloat(goCdCadtCDD.mv_pcus);
      }
    
      if (parseFloat(goCdCadtCDD.dm_pcus) > 0) {
        lnDmPcus = parseFloat(goCdCadtCDD.dm_pcus);
      }
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnDmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  loDvTcus.innerHTML = brMoney(lnDmQtde * lnDmPcus);
}

function adicionaCadastroEstoqueDevolucaoEstoqueCDD() {
  var loCbCart = document.getElementById("chkCartCDP");
  var loNrQtde = document.getElementById("nroQtdeCDD");
  var loBdQtde = {},
    loLiCadt = {};
  var lnIdCest = 0,
    lnDmQtde = 0,
    lnDmPcus = 0,
    lnCeQest = 0;

  if (loNrQtde.value.toString().trim().length == 0) {
    app.input.validate(loNrQtde);

    alerta("quantidade inválida", "alerta");

    return;
  }

  try {
    if (parseInt(goCdCadtCDD.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCDD.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    goMnView.router.back();

    return;
  }

  lnDmPcus = parseFloat(goCdCadtCDD.ce_vcus);

  if (parseFloat(goCdCadtCDD.mv_pcus) > 0) {
    lnDmPcus = parseFloat(goCdCadtCDD.mv_pcus);
  }

  if (parseFloat(goCdCadtCDD.dm_pcus) > 0) {
    lnDmPcus = parseFloat(goCdCadtCDD.dm_pcus);
  }

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCDP");
  loLiCadt = document.getElementById("lli" + lnIdCest + "cdtCDP");

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnDmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (lnDmQtde < 0) {
    return;
  }

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    if (parseInt(gmCdCadtCDP[i].id_cest) == lnIdCest) {
      gmCdCadtCDP[i].dm_qtde = lnDmQtde;

      calculaTotalCDP();

      lnCeQest =
        parseFloat(gmCdCadtCDP[i].en_qtde) -
        parseFloat(gmCdCadtCDP[i].sa_qtde) -
        parseFloat(gmCdCadtCDP[i].de_qtde);

      if (lnCeQest < 0) {
        lnCeQest = 0;
      }

      loBdQtde.innerHTML =
        brDecimal(lnDmQtde) +
        " x " +
        brMoney(lnDmPcus) +
        " = " +
        brMoney(lnDmQtde * lnDmPcus);

      if (lnDmQtde > 0) {
        loBdQtde.style.color = corTema();
      } else {
        loBdQtde.style.color = "";
      }

      if (lnCeQest < lnDmQtde) {
        loLiCadt.style.backgroundColor = "rgba(255, 255, 0, 0.25)";
      } else {
        loLiCadt.style.backgroundColor = "";
      }

      break;
    }
  }

  if (loCbCart.checked) {
    pesquisaCadastrosEstoqueCDP();
  }

  goMnView.router.back();
}

function consultaCadastroEstoqueDevolucaoEstoqueCDD() {
  var loDvCodi = document.getElementById("divCodiCDD");
  var loDvDeno = document.getElementById("divDenoCDD");
  var loDvUnid = document.getElementById("divUnidCDD");
  var loDvQest = document.getElementById("divQestCDD");
  var loDvQdvl = document.getElementById("divQdvlCDD");
  var loDvSfis = document.getElementById("divSfisCDD");
  var loNrQtde = document.getElementById("nroQtdeCDD");
  var loDvPcus = document.getElementById("divPcusCDD");
  var loDvTcus = document.getElementById("divTcusCDD");
  var lnDmPcus = 0,
    lnDmQtde = 0;

  loDvCodi.innerHTML = goCdCadtCDD.ce_codi.trim().toUpperCase();
  loDvDeno.innerHTML =
    goCdCadtCDD.ce_deno.trim().toUpperCase() +
    " " +
    goCdCadtCDD.ce_espt.trim().toUpperCase();
  loDvUnid.innerHTML = goCdCadtCDD.ce_unes.trim().toUpperCase();
  loDvQest.innerHTML = brDecimal(goCdCadtCDD.en_qtde - goCdCadtCDD.sa_qtde);
  loDvQdvl.innerHTML = brDecimal(goCdCadtCDD.de_qtde);
  loDvSfis.innerHTML = brDecimal(
    goCdCadtCDD.en_qtde - goCdCadtCDD.sa_qtde - goCdCadtCDD.de_qtde
  );

  if (parseFloat(goCdCadtCDD.dm_qtde) > 0) {
    lnDmQtde = parseFloat(goCdCadtCDD.dm_qtde);

    loNrQtde.value = lnDmQtde;
  }

  if (parseFloat(goCdCadtCDD.ce_vcus) > 0) {
    lnDmPcus = parseFloat(goCdCadtCDD.ce_vcus);
  }

  if (parseFloat(goCdCadtCDD.mv_pcus) > 0) {
    lnDmPcus = parseFloat(goCdCadtCDD.mv_pcus);
  }

  if (parseFloat(goCdCadtCDD.dm_pcus) > 0) {
    lnDmPcus = parseFloat(goCdCadtCDD.dm_pcus);
  }

  loDvPcus.innerHTML = brMoney(lnDmPcus);
  loDvTcus.innerHTML = brMoney(lnDmQtde * lnDmPcus);
}

function limpaCamposCDD() {
  var loDvCodi = document.getElementById("divCodiCDD");
  var loDvDeno = document.getElementById("divDenoCDD");
  var loDvUnid = document.getElementById("divUnidCDD");
  var loDvQest = document.getElementById("divQestCDD");
  var loDvQdvl = document.getElementById("divQdvlCDD");
  var loDvQfis = document.getElementById("divSfisCDD");
  var loNrQtde = document.getElementById("nroQtdeCDD");
  var loDvPcus = document.getElementById("divPcusCDD");
  var loDvTcus = document.getElementById("divTcusCDD");

  goCdCadtCDD = {};

  loDvCodi.innerHTML = "";
  loDvDeno.innerHTML = "";
  loDvUnid.innerHTML = "";
  loDvQest.innerHTML = "";
  loDvQdvl.innerHTML = "";
  loDvQfis.innerHTML = "";

  loNrQtde.value = "";

  loDvPcus.innerHTML = "";
  loDvTcus.innerHTML = "";
}

function CestDeDgta() {
  limpaCamposCDD();

  goCdCadtCDD = JSON.parse(sessionStorage.getItem("soCdCadt"));

  try {
    if (parseInt(goCdCadtCDD.id_cest) > 0) {
      sessionStorage.removeItem("soCdCadt");

      consultaCadastroEstoqueDevolucaoEstoqueCDD();
    } else {
      goMnView.router.back();
    }
  } catch (error) {
    goMnView.router.back();
  }

  OkTecladoAndroid("nroQtdeCDD");
}
