var goCdCadtCMD = {};

function alteraQuantidadeCMD() {
  var loNrQtde = document.getElementById("nroQtdeCMD");
  var loDvTcus = document.getElementById("divTcusCMD");
  var lnIdCest = 0,
    lnMvPcus = 0,
    lnMvQtde = 0;

  try {
    if (parseInt(goCdCadtCMD.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCMD.id_cest);

      lnMvPcus = parseFloat(goCdCadtCMD.mv_pcus);

      if (lnMvPcus == 0) {
        lnMvPcus = parseFloat(goCdCadtCMD.ce_vcus);
      }
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnMvQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  loDvTcus.innerHTML = brMoney(lnMvQtde * lnMvPcus);
}

function adicionaCadastroEstoqueMovimentacaoEstoqueCMD() {
  var loCbCart = document.getElementById("chkCartCMC");
  var loNrQtde = document.getElementById("nroQtdeCMD");
  var loLiMotv = document.getElementById("lliMotvCMD");
  var loTaMotv = document.getElementById("txaMotvCMD");
  var loBdQtde = {},
    loLiCadt = {};
  var lnIdCest = 0,
    lnMvQtde = 0,
    lnMvPcus = 0,
    lnCeQest = 0;
  var llCpAlrt = false,
    llMvDigt = false;

  if (loNrQtde.value.toString().trim().length == 0) {
    app.input.validate(loNrQtde);

    llCpAlrt = true;
  }

  if (loLiMotv.style.display.trim().length == 0) {
    llMvDigt = true;

    if (loTaMotv.value.toString().trim().length == 0) {
      app.input.validate(loTaMotv);

      llCpAlrt = true;
    }
  }

  if (llCpAlrt) {
    return;
  }

  try {
    if (parseInt(goCdCadtCMD.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCMD.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    goMnView.router.back();

    return;
  }

  lnMvPcus = parseFloat(goCdCadtCMD.mv_pcus);

  if (lnMvPcus == 0) {
    lnMvPcus = parseFloat(goCdCadtCMD.ce_vcus);
  }

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCMC");
  loLiCadt = document.getElementById("lli" + lnIdCest + "cdtCMC");

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnMvQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (lnMvQtde < 0) {
    return;
  }

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseInt(gmCdCadtCMC[i].id_cest) == lnIdCest) {
      gmCdCadtCMC[i].mv_qtde = lnMvQtde;
      gmCdCadtCMC[i].mv_motv = loTaMotv.value.toString().trim().toUpperCase();

      calculaTotalCMC();

      lnCeQest =
        parseFloat(gmCdCadtCMC[i].en_qtde) - parseFloat(gmCdCadtCMC[i].sa_qtde) - parseFloat(gmCdCadtCMC[i].de_qtde);

      if (lnCeQest < 0) {
        lnCeQest = 0;
      }

      loBdQtde.innerHTML =
        brDecimal(lnMvQtde) +
        " x " +
        brMoney(lnMvPcus) +
        " = " +
        brMoney(lnMvQtde * lnMvPcus);

      if (lnMvQtde > 0) {
        loBdQtde.style.color = corTema();
      } else {
        gmCdCadtCMC[i].mv_motv = "";

        loBdQtde.style.color = "";
      }

      if (
        lnCeQest < lnMvQtde ||
        (llMvDigt && gmCdCadtCMC[i].mv_motv.trim().length == 0)
      ) {
        loLiCadt.style.backgroundColor = "rgba(255, 255, 0, 0.25)";
      } else {
        loLiCadt.style.backgroundColor = "";
      }

      break;
    }
  }

  if (loCbCart.checked) {
    pesquisaCadastrosEstoqueCMC();
  }

  goMnView.router.back();
}

function consultaCadastroEstoqueMovimentacaoEstoqueCMD() {
  var loDvCodi = document.getElementById("divCodiCMD");
  var loDvDeno = document.getElementById("divDenoCMD");
  var loDvUnid = document.getElementById("divUnidCMD");
  var loLiData = document.getElementById("lliDataCMD");
  var loDvData = document.getElementById("divDataCMD");
  var loLiDias = document.getElementById("lliDiasCMD");
  var loDvDias = document.getElementById("divDiasCMD");
  var loLiVutl = document.getElementById("lliVutlCMD");
  var loDvVutl = document.getElementById("divVutlCMD");
  var loDvQapv = document.getElementById("divQapvCMD");
  var loDvQenv = document.getElementById("divQenvCMD");
  var loDvQdvl = document.getElementById("divQdvlCMD");
  var loDvQest = document.getElementById("divQestCMD");
  var loNrQtde = document.getElementById("nroQtdeCMD");
  var loDvPcus = document.getElementById("divPcusCMD");
  var loDvTcus = document.getElementById("divTcusCMD");
  var loLiMotv = document.getElementById("lliMotvCMD");
  var loTaMotv = document.getElementById("txaMotvCMD");
  var lnMvPcus = 0;
  var llLiData = false,
    llLiMotv = false;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDvCodi.innerHTML = goCdCadtCMD.ce_codi.trim().toUpperCase();
  loDvDeno.innerHTML =
    goCdCadtCMD.ce_deno.trim().toUpperCase() +
    " " +
    goCdCadtCMD.ce_espt.trim().toUpperCase();
  loDvUnid.innerHTML = goCdCadtCMD.ce_unes.trim().toUpperCase();

  if (
    goCdCadtCMD.mv_tpme.trim().toUpperCase() == "S" &&
    goCdCadtCMD.mv_dpar.trim().toUpperCase() == "F"
  ) {
    if (
      goCdCadtCMD.ce_tipo.trim().toUpperCase() == "U" &&
      parseInt(goCdCadtCMD.id_gres) == 3
    ) {
      if (parseInt(goCdCadtCMD.du_vutl) > 0) {
        if (jsonDate(goCdCadtCMD.sa_data).trim().length > 0) {
          if (jsonDate(goCdCadtCMD.en_data).trim().length > 0) {
            if (
              stringDataParaObjetoData(jsonDate(goCdCadtCMD.en_data)) <
              stringDataParaObjetoData(jsonDate(goCdCadtCMD.sa_data))
            ) {
              if (
                datediff(
                  stringDataParaObjetoData(jsonDate(goCdCadtCMD.sa_data)),
                  ldDtHoje
                ) < parseInt(goCdCadtCMD.du_vutl)
              ) {
                llLiData = true;
              }
            }
          } else {
            if (
              datediff(
                stringDataParaObjetoData(jsonDate(goCdCadtCMD.sa_data)),
                ldDtHoje
              ) < parseInt(goCdCadtCMD.du_vutl)
            ) {
              llLiData = true;
            }
          }
        }
      }
    } else if (goCdCadtCMD.ce_tipo.trim().toUpperCase() == "A") {
      if (parseFloat(goCdCadtCMD.sa_fuqt) > parseFloat(goCdCadtCMD.en_fuqt)) {
        llLiMotv = true;
      }
    }
  }

  if (llLiData) {
    loLiData.style.display = "";

    loDvData.innerHTML = jsonDate(goCdCadtCMD.sa_data);

    loLiDias.style.display = "";

    loDvDias.innerHTML = datediff(
      stringDataParaObjetoData(jsonDate(goCdCadtCMD.sa_data)),
      ldDtHoje
    ).toString();

    loLiVutl.style.display = "";

    loDvVutl.innerHTML = goCdCadtCMD.du_vutl.toString();
  }

  if (parseFloat(goCdCadtCMD.ap_qtde) > 0) {
    loDvQapv.innerHTML = brDecimal(goCdCadtCMD.ap_qtde);
  }

  if (parseFloat(goCdCadtCMD.ev_qtde) > 0) {
    loDvQenv.innerHTML = brDecimal(goCdCadtCMD.ev_qtde);
  }

  if (parseFloat(goCdCadtCMD.de_qtde) > 0) {
    loDvQdvl.innerHTML = brDecimal(goCdCadtCMD.de_qtde);
  }

  loDvQest.innerHTML = brDecimal(goCdCadtCMD.en_qtde - goCdCadtCMD.sa_qtde - goCdCadtCMD.de_qtde);

  if (parseFloat(goCdCadtCMD.mv_qtde) > 0) {
    loNrQtde.value = parseFloat(goCdCadtCMD.mv_qtde);
  }

  lnMvPcus = parseFloat(goCdCadtCMD.mv_pcus);

  if (lnMvPcus == 0) {
    lnMvPcus = parseFloat(goCdCadtCMD.ce_vcus);
  }

  loDvPcus.innerHTML = brMoney(lnMvPcus);
  loDvTcus.innerHTML = brMoney(parseFloat(goCdCadtCMD.mv_qtde) * lnMvPcus);

  if (llLiMotv || llLiData) {
    loLiMotv.style.display = "";

    loTaMotv.value = goCdCadtCMD.mv_motv.trim().toUpperCase();
  }
}

function limpaCamposCMD() {
  var loDvCodi = document.getElementById("divCodiCMD");
  var loDvDeno = document.getElementById("divDenoCMD");
  var loDvUnid = document.getElementById("divUnidCMD");
  var loLiData = document.getElementById("lliDataCMD");
  var loDvData = document.getElementById("divDataCMD");
  var loLiDias = document.getElementById("lliDiasCMD");
  var loDvDias = document.getElementById("divDiasCMD");
  var loLiVutl = document.getElementById("lliVutlCMD");
  var loDvVutl = document.getElementById("divVutlCMD");
  var loDvQapv = document.getElementById("divQapvCMD");
  var loDvQenv = document.getElementById("divQenvCMD");
  var loDvQdvl = document.getElementById("divQdvlCMD");
  var loDvQest = document.getElementById("divQestCMD");
  var loNrQtde = document.getElementById("nroQtdeCMD");
  var loDvPcus = document.getElementById("divPcusCMD");
  var loDvTcus = document.getElementById("divTcusCMD");
  var loLiMotv = document.getElementById("lliMotvCMD");
  var loTaMotv = document.getElementById("txaMotvCMD");

  goCdCadtCMD = {};

  loDvCodi.innerHTML = "";
  loDvDeno.innerHTML = "";
  loDvUnid.innerHTML = "";

  loLiData.style.display = "none";

  loDvData.innerHTML = "";

  loLiDias.style.display = "none";

  loDvDias.innerHTML = "";

  loLiVutl.style.display = "none";

  loDvVutl.innerHTML = "";
  loDvQapv.innerHTML = "";
  loDvQenv.innerHTML = "";
  loDvQdvl.innerHTML = "";
  loDvQest.innerHTML = "";

  loNrQtde.value = "";

  loDvPcus.innerHTML = "";
  loDvTcus.innerHTML = "";

  loLiMotv.style.display = "none";

  loTaMotv.value = "";
}

function CestMvDgta() {
  limpaCamposCMD();

  goCdCadtCMD = JSON.parse(sessionStorage.getItem("soCdCadt"));

  try {
    if (parseInt(goCdCadtCMD.id_cest) > 0) {
      sessionStorage.removeItem("soCdCadt");

      consultaCadastroEstoqueMovimentacaoEstoqueCMD();
    } else {
      goMnView.router.back();
    }
  } catch (error) {
    goMnView.router.back();
  }

  OkTecladoAndroid("nroQtdeCMD");
}
