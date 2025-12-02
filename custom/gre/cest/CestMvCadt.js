var gmWkRsqlCMC = [],
  gmCdCadtCMC = [];
var gnInListCMC = 0;
var gcFuFotoCMC = "",
  gcMvFotoCMC = "";
var glMdLoadCMC = false;

function insereFacialMovimentacaoCMC() {
  var lnIdMven = 0,
    lnIdMvsa = 0;
  var lcMvTpme = "",
    lcFtPath = "",
    lcIdMvto = "";

  try {
    if (gmMvMvtoCMM[0].mv_tpme.trim().toUpperCase() == "E") {
      lcMvTpme = "E";
    } else if (gmMvMvtoCMM[0].mv_tpme.trim().toUpperCase() == "S") {
      lcMvTpme = "S";
    }
  } catch (error) {}

  if (lcMvTpme.trim().length == 0) {
    notificacao("itens movimentados", "sucesso");

    setTimeout(function () {
      goMnView.router.back();

      setTimeout(function () {
        goMnView.router.back();
      }, 500);
    }, 500);

    return;
  }

  if (lcMvTpme.trim().toUpperCase() == "E") {
    try {
      if (parseInt(gmMvMvtoCMM[0].id_mven) > 0) {
        lnIdMven = parseInt(gmMvMvtoCMM[0].id_mven);
      }
    } catch (error) {}

    if (lnIdMven == 0) {
      notificacao("itens movimentados", "sucesso");

      setTimeout(function () {
        goMnView.router.back();

        setTimeout(function () {
          goMnView.router.back();
        }, 500);
      }, 500);

      return;
    }

    lcFtPath = "entradas";
    lcIdMvto = lnIdMven.toString();
  } else {
    try {
      if (parseInt(gmMvMvtoCMM[0].id_mvsa) > 0) {
        lnIdMvsa = parseInt(gmMvMvtoCMM[0].id_mvsa);
      }
    } catch (error) {}

    if (lnIdMvsa == 0) {
      notificacao("itens movimentados", "sucesso");

      setTimeout(function () {
        goMnView.router.back();

        setTimeout(function () {
          goMnView.router.back();
        }, 500);
      }, 500);

      return;
    }

    lcFtPath = "saidas";
    lcIdMvto = lnIdMvsa.toString();
  }

  redimensionaImagem(gcMvFotoCMC, function (lcNvBase) {
    gcMvFotoCMC = lcNvBase;

    app.dialog.preloader("enviando facial da movimentação");

    $.ajax({
      url: goCdUser.ws_http.trim() + "insereFoto",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        lcBsFoto: gcMvFotoCMC,
        lcWkPath: "movimentacoes/" + lcFtPath + "/",
        lcWkFoto: lcIdMvto + ".png",
      }),

      success: function (loWkRsql) {
        app.dialog.close();

        try {
          if (loWkRsql.ft_inse) {
          } else {
          }
        } catch (loApErro) {}

        notificacao("itens movimentados", "sucesso");

        setTimeout(function () {
          goMnView.router.back();

          setTimeout(function () {
            goMnView.router.back();
          }, 500);
        }, 500);
      },
      error: function (jqXHR, textStatus, err) {
        app.dialog.close();

        redimensionaImagemPiorQualidade(gcMvFotoCMC, function (lcNvBase) {
          gcMvFotoCMC = lcNvBase;

          insereFacialMovimentacaoCMC();
        });
      },
    });
  });
}

function insereMovimentacaoEstoqueCMC(lmMvMvto, lcMvLati, lcMvLong) {
  var loSlTpme = document.getElementById("sltTpmeCMM");
  var loNrNume = document.getElementById("nroNumeCMM");
  var loDtData = document.getElementById("datDataCMM");
  var loDvClie = document.getElementById("divClieCMM");
  var loSlClie = document.getElementById("sltClieCMM");
  var loSlDpar = document.getElementById("sltDparCMM");
  var loLiClcu = document.getElementById("lliClcuCMM");
  var loDvClcu = document.getElementById("divClcuCMM");
  var loSlClcu = document.getElementById("sltClcuCMM");
  var loDvFunc = document.getElementById("divFuncCMM");
  var loSlFunc = document.getElementById("sltFuncCMM");
  var loDvOrds = document.getElementById("divOrdsCMM");
  var loSlOrds = document.getElementById("sltOrdsCMM");
  var loTaObse = document.getElementById("txaObseCMM");
  var loDvAitm = document.getElementById("divAitmCMM");
  var lcWkIsql = "",
    lcMvData = "",
    lcFuEmpr = "",
    lcMvTpme = loSlTpme.value.toString().trim().toUpperCase(),
    lcMvDpar = loSlDpar.value.toString().trim().toUpperCase(),
    lcMvObse = loTaObse.value.toString().trim().toUpperCase(),
    lcMvMvto = "";
  var lmWkIsql = [];
  var lnIdClie = 0,
    lnIdFili = 1,
    lnFuMatr = 0,
    lnIdOrds = 0,
    lnCuClie = null,
    lnMvFaci = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  app.dialog.close();

  if (loDtData.value.toString().trim().length > 0) {
    lcMvData = loDtData.value.toString().trim();

    if (ldDtHoje < htmlDataParaObjetoData(lcMvData)) {
      alerta("data da movimentação de estoque maior que data atual", "alerta");

      return;
    }
  } else {
    alerta("data da movimentação de estoque inválida", "alerta");

    app.input.validate(loDtData);

    return;
  }

  try {
    if (parseInt(loSlClie.value.toString().split("/")[0]) > 0) {
      lnIdClie = parseInt(loSlClie.value.toString().split("/")[0]);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra da movimentação de estoque inválida", "alerta");

    return;
  }

  if (lcMvDpar.trim().length == 0) {
    alerta(
      "movimentação de/para da movimentação de estoque inválida",
      "alerta"
    );

    return;
  }

  if (lcMvDpar.trim().toUpperCase() == "F") {
    try {
      if (loSlFunc.value.toString().split("/")[0].trim().length > 0) {
        lcFuEmpr = loSlFunc.value.toString().split("/")[0].trim().toUpperCase();
      }
    } catch (error) {}

    if (lcFuEmpr.trim().length == 0) {
      alerta("funcionário da movimentação de estoque inválido", "alerta");

      return;
    }

    try {
      if (parseInt(loSlFunc.value.toString().split("/")[1]) > 0) {
        lnFuMatr = parseInt(loSlFunc.value.toString().split("/")[1]);
      }
    } catch (error) {}

    if (lnFuMatr == 0) {
      return;
    }

    if (loLiClcu.style.display.toString().trim().length == 0) {
      try {
        if (parseInt(loSlClcu.value.toString().split("/")[0]) > 0) {
          lnCuClie = parseInt(loSlClcu.value.toString().split("/")[0]);
        }
      } catch (error) {}

      if (lnCuClie == 0) {
        alerta("obra para apuração do custo inválida", "alerta");

        return;
      }
    }
  } else if (lcMvDpar.trim().toUpperCase() == "P") {
    try {
      if (parseInt(loSlOrds.value) > 0) {
        lnIdOrds = parseInt(loSlOrds.value);
      }
    } catch (error) {}

    if (lnIdOrds == 0) {
      alerta("proposta da movimentação de estoque inválido", "alerta");

      return;
    }
  }

  for (var i = 0; i < lmMvMvto.length; i++) {
    lcMvMvto +=
      "a:" +
      lmMvMvto[i].id_cest.toString() +
      "¢" +
      "b:" +
      lmMvMvto[i].mv_qtde.toString() +
      "¢" +
      "c:" +
      lmMvMvto[i].mv_motv.trim().toUpperCase() +
      "£";
  }

  lcMvMvto = lcMvMvto.trim().slice(0, -1);

  if (lcMvMvto.trim().length == 0) {
    alerta("nenhum item adicionado", "alerta");

    return;
  }

  if (gcMvFotoCMC.trim().length > 0) {
    lnMvFaci = 1;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdFili", pa_tipo: "Int", pa_valo: lnIdFili },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcMvTpme", pa_tipo: "VarChar", pa_valo: lcMvTpme },
    { pa_nome: "ldMvData", pa_tipo: "SmallDatetime", pa_valo: lcMvData },
    { pa_nome: "lcMvDpar", pa_tipo: "VarChar", pa_valo: lcMvDpar },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnFuMatr", pa_tipo: "Int", pa_valo: lnFuMatr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "lcMvObse", pa_tipo: "VarChar", pa_valo: lcMvObse },
    { pa_nome: "lcMvMvto", pa_tipo: "VarChar", pa_valo: lcMvMvto },
    { pa_nome: "lnCuClie", pa_tipo: "Int", pa_valo: lnCuClie },
    { pa_nome: "lcMvLati", pa_tipo: "VarChar", pa_valo: lcMvLati },
    { pa_nome: "lcMvLong", pa_tipo: "VarChar", pa_valo: lcMvLong },
    { pa_nome: "lnMvFaci", pa_tipo: "Int", pa_valo: lnMvFaci },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          try {
            if (lmWkRsql[0].mv_erro.trim().length > 0) {
              alerta(lmWkRsql[0].mv_erro.trim(), "alerta");

              return;
            }
          } catch (error) {}

          gmCdCadtCMM = [];

          pesquisaCadastroEstoqueMovimentacaoEstoqueCMM();

          gmMvMvtoCMM = lmWkRsql;

          loNrNume.value = parseInt(gmMvMvtoCMM[0].mv_docu);

          loDtData.disabled = true;

          loDvClie.style.display = "none";

          loSlClie.disabled = true;
          loSlDpar.disabled = true;

          loDvClcu.style.display = "none";

          loSlClcu.disabled = true;

          if (lcFuEmpr.trim().length > 0 && lnFuMatr > 0) {
            loDvFunc.style.display = "none";

            loSlFunc.disabled = true;
          } else if (lnIdOrds > 0) {
            loDvOrds.style.display = "none";

            loSlOrds.disabled = true;
          }

          loTaObse.value = gmMvMvtoCMM[0].mv_obse.trim().toUpperCase();

          loDvAitm.style.display = "none";

          montaMovimentacaoEstoqueCMM();
          pesquisaMovimentacoesEstoqueCML();

          if (gcMvFotoCMC.trim().length > 0) {
            insereFacialMovimentacaoCMC();
          } else {
            notificacao("itens movimentados", "sucesso");

            setTimeout(function () {
              goMnView.router.back();

              setTimeout(function () {
                goMnView.router.back();
              }, 500);
            }, 500);
          }
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereCadastroEstoqueMovimentacaoEstoqueCMC(lmMvMvto) {
  var loTaObse = document.getElementById("txaObseCMM");
  var lcWkIsql = "",
    lcMvObse = loTaObse.value.toString().trim().toUpperCase(),
    lcMvMvto = "";
  var lmWkIsql = [];
  var lnIdMven = 0,
    lnIdMvsa = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  app.dialog.close();

  try {
    if (parseInt(gmMvMvtoCMM[0].id_mven) > 0) {
      lnIdMven = parseInt(gmMvMvtoCMM[0].id_mven);
    }
  } catch (error) {}

  try {
    if (parseInt(gmMvMvtoCMM[0].id_mvsa) > 0) {
      lnIdMvsa = parseInt(gmMvMvtoCMM[0].id_mvsa);
    }
  } catch (error) {}

  if (lnIdMven + lnIdMvsa <= 0) {
    alerta("movimentação de estoque inválida", "alerta");

    return;
  }

  for (var i = 0; i < lmMvMvto.length; i++) {
    lcMvMvto +=
      "a:" +
      lmMvMvto[i].id_cest.toString() +
      "¢" +
      "b:" +
      lmMvMvto[i].mv_qtde.toString() +
      "¢" +
      "c:" +
      lmMvMvto[i].mv_motv.trim().toUpperCase() +
      "£";
  }

  lcMvMvto = lcMvMvto.trim().slice(0, -1);

  if (lcMvMvto.trim().length == 0) {
    alerta("nenhum item adicionado", "alerta");

    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lnIdMven", pa_tipo: "Int", pa_valo: lnIdMven },
    { pa_nome: "lnIdMvsa", pa_tipo: "Int", pa_valo: lnIdMvsa },
    { pa_nome: "lcMvObse", pa_tipo: "VarChar", pa_valo: lcMvObse },
    { pa_nome: "lcMvMvto", pa_tipo: "VarChar", pa_valo: lcMvMvto },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastroEstoqueMovimentacaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          try {
            if (lmWkRsql[0].mv_erro.trim().length > 0) {
              alerta(lmWkRsql[0].mv_erro.trim(), "alerta");

              return;
            }
          } catch (error) {}

          gmCdCadtCMM = [];

          pesquisaCadastroEstoqueMovimentacaoEstoqueCMM();

          gmMvMvtoCMM = lmWkRsql;

          loTaObse.value = gmMvMvtoCMM[0].mv_obse.trim().toUpperCase();

          montaMovimentacaoEstoqueCMM();
          pesquisaMovimentacoesEstoqueCML();

          notificacao("itens movimentados", "sucesso");

          setTimeout(function () {
            goMnView.router.back();

            setTimeout(function () {
              goMnView.router.back();
            }, 500);
          }, 500);
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function adicionaCadastroEstoqueCMC() {
  var lmMvMvto = [];

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseFloat(gmCdCadtCMC[i].mv_qtde) > 0) {
      lmMvMvto.push(gmCdCadtCMC[i]);
    }
  }

  if (lmMvMvto.length == 0) {
    goMnView.router.back();

    return;
  }

  if (gmCdCadtCMC[0].mv_dpar.trim().toUpperCase() == "F") {
    if (
      goCdUser.id_user.trim().toUpperCase() == "CARLA" ||
      goCdUser.id_user.trim().toUpperCase() == "CHAMONE" ||
      goCdUser.id_user.trim().toUpperCase() == "CHAMONI" ||
      goCdUser.id_user.trim().toUpperCase() == "DAVI.CASTRO" ||
      goCdUser.id_user.trim().toUpperCase() == "GUSTAVO" ||
      goCdUser.id_user.trim().toUpperCase() == "JAIRO.J" ||
      goCdUser.id_user.trim().toUpperCase() == "JORGE GENEROSO" ||
      goCdUser.id_user.trim().toUpperCase() == "LORENA" ||
      goCdUser.id_user.trim().toUpperCase() == "MARIA.EDUARDA" ||
      goCdUser.id_user.trim().toUpperCase() == "PRISCILLA.MIRELI" ||
      goCdUser.id_user.trim().toUpperCase() == "QUESIA" ||
      goCdUser.id_user.trim().toUpperCase() == "VICTORIA.ALVES" ||
      goCdUser.id_user.trim().toUpperCase() == "VICTORIA.BEATRIZ" ||
      goCdUser.id_user.trim().toUpperCase() == "VINICIUS.F" ||
      goCdUser.id_user.trim().toUpperCase() == "GABRIEL.EVANGELISTA" ||
      goCdUser.id_user.trim().toUpperCase() == "TALITA"
    ) {
      app.dialog.progress("salvando itens");

      if (gmMvMvtoCMM.length > 0) {
        insereCadastroEstoqueMovimentacaoEstoqueCMC(lmMvMvto);
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (loMpLoca) {
              insereMovimentacaoEstoqueCMC(
                lmMvMvto,
                loMpLoca.coords.latitude.toString().trim(),
                loMpLoca.coords.longitude.toString().trim()
              );
            },
            function (error) {
              insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
            },
            {
              maximumAge: 60000,
              timeout: 10000,
              enableHighAccuracy: true,
            }
          );
        } else {
          insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
        }
      }
    } else {
      if (isMobile()) {
        redireciona("custom/gre/cest/CestFaFoto.html", "CestFaFoto.html");
      } else {
        if (isLocalhost) {
          redireciona("custom/gre/cest/CestFaFoto.html", "CestFaFoto.html");
        } else {
          alerta(
            "reconhecimento facial disponível apenas na versão mobile",
            "alerta"
          );
        }
      }
    }
  } else {
    app.dialog.progress("salvando itens");

    if (gmMvMvtoCMM.length > 0) {
      insereCadastroEstoqueMovimentacaoEstoqueCMC(lmMvMvto);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (loMpLoca) {
            insereMovimentacaoEstoqueCMC(
              lmMvMvto,
              loMpLoca.coords.latitude.toString().trim(),
              loMpLoca.coords.longitude.toString().trim()
            );
          },
          function (error) {
            insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
          },
          {
            maximumAge: 60000,
            timeout: 10000,
            enableHighAccuracy: true,
          }
        );
      } else {
        insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
      }
    }
  }
}

function removeCMC(lcWkRsql) {
  var loCbCart = document.getElementById("chkCartCMC"),
    loCbEstq = document.getElementById("chkEstqCMC"),
    loCdCadt = JSON.parse(unescape(lcWkRsql)),
    loBdQtde = {},
    loLiCadt = {};
  var lnIdCest = parseInt(loCdCadt.id_cest),
    lnMvPcus = 0,
    lnMvQtde = 0,
    lnCeQest = 0;
  var llMvDigt = false;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseInt(gmCdCadtCMC[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCMC[i]));

      break;
    }
  }

  lnMvQtde = parseFloat(loCdCadt.mv_qtde);

  if (lnMvQtde <= 0) {
    return;
  }

  if (
    loCdCadt.mv_tpme.trim().toUpperCase() == "S" &&
    loCdCadt.mv_dpar.trim().toUpperCase() == "F"
  ) {
    if (
      loCdCadt.ce_tipo.trim().toUpperCase() == "U" &&
      parseInt(loCdCadt.id_gres) == 3
    ) {
      if (parseInt(loCdCadt.du_vutl) > 0) {
        if (jsonDate(loCdCadt.sa_data).trim().length > 0) {
          if (jsonDate(loCdCadt.en_data).trim().length > 0) {
            if (
              stringDataParaObjetoData(jsonDate(loCdCadt.en_data)) <
              stringDataParaObjetoData(jsonDate(loCdCadt.sa_data))
            ) {
              if (
                datediff(
                  stringDataParaObjetoData(jsonDate(loCdCadt.sa_data)),
                  ldDtHoje
                ) < parseInt(loCdCadt.du_vutl)
              ) {
                llMvDigt = true;
              }
            }
          } else {
            if (
              datediff(
                stringDataParaObjetoData(jsonDate(loCdCadt.sa_data)),
                ldDtHoje
              ) < parseInt(loCdCadt.du_vutl)
            ) {
              llMvDigt = true;
            }
          }
        }
      }
    } else if (loCdCadt.ce_tipo.trim().toUpperCase() == "A") {
      if (parseFloat(loCdCadt.sa_fuqt) > parseFloat(loCdCadt.en_fuqt)) {
        llMvDigt = true;
      }
    }
  }

  lnMvPcus = parseFloat(loCdCadt.mv_pcus);

  if (lnMvPcus == 0) {
    lnMvPcus = parseFloat(loCdCadt.ce_vcus);
  }

  lnIdCest = parseInt(loCdCadt.id_cest);

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCMC");
  loLiCadt = document.getElementById("lli" + lnIdCest + "cdtCMC");

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseInt(gmCdCadtCMC[i].id_cest) == lnIdCest) {
      gmCdCadtCMC[i].mv_qtde--;

      calculaTotalCMC();

      lnMvQtde = gmCdCadtCMC[i].mv_qtde;
      lnCeQest =
        parseFloat(gmCdCadtCMC[i].en_qtde) -
        parseFloat(gmCdCadtCMC[i].sa_qtde) -
        parseFloat(gmCdCadtCMC[i].de_qtde);

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

  if (loCbCart.checked || loCbEstq.checked) {
    pesquisaCadastrosEstoqueCMC();
  }
}

function calculaTotalCMC() {
  var loNrQtot = document.getElementById("nroQtotCMC");
  var loNrVtcu = document.getElementById("nroVtcuCMC");
  var lnMvTota = 0,
    lnMvPcus = 0,
    lnMvQtde = 0;

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    lnMvPcus = parseFloat(gmCdCadtCMC[i].mv_pcus);

    if (lnMvPcus == 0) {
      lnMvPcus = parseFloat(gmCdCadtCMC[i].ce_vcus);
    }

    lnMvQtde += parseFloat(gmCdCadtCMC[i].mv_qtde);
    lnMvTota += parseFloat(gmCdCadtCMC[i].mv_qtde) * lnMvPcus;
  }

  loNrQtot.value = lnMvQtde;
  loNrVtcu.value = parseFloat(lnMvTota.toFixed(2));
}

function digitaCMC(lcWkRsql) {
  var loCdCadt = JSON.parse(unescape(lcWkRsql));
  var lnIdCest = parseInt(loCdCadt.id_cest);

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseInt(gmCdCadtCMC[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCMC[i]));

      break;
    }
  }

  sessionStorage.setItem("soCdCadt", JSON.stringify(loCdCadt));

  redireciona("custom/gre/cest/CestMvDgta.html", "CestMvDgta.html");
}

function adicionaCMC(lcWkRsql) {
  var loCbCart = document.getElementById("chkCartCMC"),
    loCbEstq = document.getElementById("chkEstqCMC"),
    loCdCadt = JSON.parse(unescape(lcWkRsql)),
    loBdQtde = {},
    loLiCadt = {};
  var lnIdCest = parseInt(loCdCadt.id_cest),
    lnMvPcus = 0,
    lnMvQtde = 0,
    lnCeQest = 0;
  var llMvDigt = false;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseInt(gmCdCadtCMC[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCMC[i]));

      break;
    }
  }

  if (
    loCdCadt.mv_tpme.trim().toUpperCase() == "S" &&
    loCdCadt.mv_dpar.trim().toUpperCase() == "F"
  ) {
    if (
      loCdCadt.ce_tipo.trim().toUpperCase() == "U" &&
      parseInt(loCdCadt.id_gres) == 3
    ) {
      if (parseInt(loCdCadt.du_vutl) > 0) {
        if (jsonDate(loCdCadt.sa_data).trim().length > 0) {
          if (jsonDate(loCdCadt.en_data).trim().length > 0) {
            if (
              stringDataParaObjetoData(jsonDate(loCdCadt.en_data)) <
              stringDataParaObjetoData(jsonDate(loCdCadt.sa_data))
            ) {
              if (
                datediff(
                  stringDataParaObjetoData(jsonDate(loCdCadt.sa_data)),
                  ldDtHoje
                ) < parseInt(loCdCadt.du_vutl)
              ) {
                llMvDigt = true;
              }
            }
          } else {
            if (
              datediff(
                stringDataParaObjetoData(jsonDate(loCdCadt.sa_data)),
                ldDtHoje
              ) < parseInt(loCdCadt.du_vutl)
            ) {
              llMvDigt = true;
            }
          }
        }
      }
    } else if (loCdCadt.ce_tipo.trim().toUpperCase() == "A") {
      if (parseFloat(loCdCadt.sa_fuqt) > parseFloat(loCdCadt.en_fuqt)) {
        llMvDigt = true;
      }
    }
  }

  if (llMvDigt && loCdCadt.mv_motv.trim().length == 0) {
    digitaCMC(lcWkRsql);

    return;
  }

  lnMvPcus = parseFloat(loCdCadt.mv_pcus);

  if (lnMvPcus == 0) {
    lnMvPcus = parseFloat(loCdCadt.ce_vcus);
  }

  lnIdCest = parseInt(loCdCadt.id_cest);

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCMC");
  loLiCadt = document.getElementById("lli" + lnIdCest + "cdtCMC");

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseInt(gmCdCadtCMC[i].id_cest) == lnIdCest) {
      gmCdCadtCMC[i].mv_qtde++;

      calculaTotalCMC();

      lnMvQtde = gmCdCadtCMC[i].mv_qtde;
      lnCeQest =
        parseFloat(gmCdCadtCMC[i].en_qtde) -
        parseFloat(gmCdCadtCMC[i].sa_qtde) -
        parseFloat(gmCdCadtCMC[i].de_qtde);

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

  if (loCbCart.checked || loCbEstq.checked) {
    pesquisaCadastrosEstoqueCMC();
  }
}

function montaCadastrosEstoqueCMC() {
  var loDvCadt = document.getElementById("divCadtCMC");
  var loDvLoad = document.getElementById("divLoadCMC");
  var lcWkRsql = "",
    lcCrQtde = "",
    lcCrVutl = "";
  var lnFnList = 0,
    lnMvQtde = 0,
    lnMvPcus = 0,
    lnCeQest = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (gnInListCMC + 20 >= gmWkRsqlCMC.length) {
    loDvCadt.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCMC.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCMC + 20;
  }

  for (var i = gnInListCMC; i < lnFnList; i++) {
    lcCrQtde = "";
    lcCrVutl = "";
    lnMvQtde = parseFloat(gmWkRsqlCMC[i].mv_qtde);
    lnMvPcus = parseFloat(gmWkRsqlCMC[i].mv_pcus);
    lnCeQest =
      parseFloat(gmWkRsqlCMC[i].en_qtde) -
      parseFloat(gmWkRsqlCMC[i].sa_qtde) -
      parseFloat(gmWkRsqlCMC[i].de_qtde);

    if (lnMvQtde > 0) {
      lcCrQtde = " style='color: " + corTema() + ";'";
    }

    if (lnCeQest < 0) {
      lnCeQest = 0;
    }

    if (lnCeQest < lnMvQtde) {
      lcCrVutl = " style='background-color: rgba(255, 255, 0, 0.25);'";
    }

    if (
      gmWkRsqlCMC[i].mv_tpme.trim().toUpperCase() == "S" &&
      gmWkRsqlCMC[i].mv_dpar.trim().toUpperCase() == "F"
    ) {
      if (
        gmWkRsqlCMC[i].ce_tipo.trim().toUpperCase() == "U" &&
        parseInt(gmWkRsqlCMC[i].id_gres) == 3
      ) {
        if (parseInt(gmWkRsqlCMC[i].du_vutl) > 0) {
          if (jsonDate(gmWkRsqlCMC[i].sa_data).trim().length > 0) {
            if (jsonDate(gmWkRsqlCMC[i].en_data).trim().length > 0) {
              if (
                stringDataParaObjetoData(jsonDate(gmWkRsqlCMC[i].en_data)) <
                stringDataParaObjetoData(jsonDate(gmWkRsqlCMC[i].sa_data))
              ) {
                if (
                  datediff(
                    stringDataParaObjetoData(jsonDate(gmWkRsqlCMC[i].sa_data)),
                    ldDtHoje
                  ) < parseInt(gmWkRsqlCMC[i].du_vutl) &&
                  gmWkRsqlCMC[i].mv_motv.trim().length == 0
                ) {
                  lcCrVutl =
                    " style='background-color: rgba(255, 255, 0, 0.25);'";
                }
              }
            } else {
              if (
                datediff(
                  stringDataParaObjetoData(jsonDate(gmWkRsqlCMC[i].sa_data)),
                  ldDtHoje
                ) < parseInt(gmWkRsqlCMC[i].du_vutl) &&
                gmWkRsqlCMC[i].mv_motv.trim().length == 0
              ) {
                lcCrVutl =
                  " style='background-color: rgba(255, 255, 0, 0.25);'";
              }
            }
          }
        }
      } else if (gmWkRsqlCMC[i].ce_tipo.trim().toUpperCase() == "A") {
        if (
          parseFloat(gmWkRsqlCMC[i].sa_fuqt) >
            parseFloat(gmWkRsqlCMC[i].en_fuqt) &&
          gmWkRsqlCMC[i].mv_motv.trim().length == 0
        ) {
          lcCrVutl = " style='background-color: rgba(255, 255, 0, 0.25);'";
        }
      }
    }

    if (lnMvPcus == 0) {
      lnMvPcus = parseFloat(gmWkRsqlCMC[i].ce_vcus);
    }

    //prettier-ignore
    lcWkRsql += 
      "<li id='lli" + gmWkRsqlCMC[i].id_cest.toString().trim() + "cdtCMC'" + lcCrVutl + ">" +
        "<a href='#' class='item-link item-content'>" +
          "<div class='item-media'>" + 
            "<div>" +
              "<i onclick='adicionaCMC(\"" + escape(JSON.stringify(gmWkRsqlCMC[i])) + "\");' class='material-icons text-color-green' style='font-size: 36px;'>add_circle</i><br />" +
              "<i onclick='removeCMC(\"" + escape(JSON.stringify(gmWkRsqlCMC[i])) + "\");' class='material-icons text-color-red' style='font-size: 36px;'>remove_circle</i>" +
            "</div>" +
          "</div>" +
          "<div class='item-inner' onclick='digitaCMC(\"" + escape(JSON.stringify(gmWkRsqlCMC[i])) + "\");'>" +
            "<div class='item-title-row'>" +
              "<div class='item-title'><b id='bld" + gmWkRsqlCMC[i].id_cest.toString().trim() + "qtdCMC'" + lcCrQtde + ">" + brDecimal(lnMvQtde) + " x " + brMoney(lnMvPcus) + " = " + brMoney(lnMvQtde * lnMvPcus) + "</b></div>" +
              "<div class='item-after'>estq: " + brDecimal(lnCeQest) + "</div>" +
            "</div>" +
            "<div class='item-subtitle'>" +
              "<b>código: " + gmWkRsqlCMC[i].ce_codi.trim().toUpperCase() + "</b><br />" +
              "<b>unidade: " + gmWkRsqlCMC[i].ce_unes.trim().toUpperCase() + "</b><br />" +
            "</div>" +
            "<div class='item-text'>" +
              "<b>" + gmWkRsqlCMC[i].ce_deno.trim().toUpperCase() + " " + gmWkRsqlCMC[i].ce_espt.trim().toUpperCase() + "</b>" +
            "</div>" +
          "</div>" +
        "</a>" +
      "<li>";
  }

  $("#uulCadtCMC").append(lcWkRsql);

  gnInListCMC = i;
}

function pesquisaCadastrosEstoqueCMC() {
  var loDvCadt = document.getElementById("divCadtCMC"),
    loCbCart = document.getElementById("chkCartCMC"),
    loCbEstq = document.getElementById("chkEstqCMC"),
    loTxPesq = document.getElementById("txtPesqCMC");

  limpaCamposCMC();

  if (loCbCart.checked) {
    for (var i = 0; i < gmCdCadtCMC.length; i++) {
      if (parseFloat(gmCdCadtCMC[i].mv_qtde) > 0) {
        gmWkRsqlCMC.push(gmCdCadtCMC[i]);
      }
    }
  } else if (loCbCart.checked && loCbEstq.checked) {
    for (var i = 0; i < gmCdCadtCMC.length; i++) {
      if (
        parseFloat(gmCdCadtCMC[i].mv_qtde) > 0 &&
        parseFloat(gmCdCadtCMC[i].en_qtde) -
          parseFloat(gmCdCadtCMC[i].sa_qtde) -
          parseFloat(gmCdCadtCMC[i].de_qtde) >
          0
      ) {
        gmWkRsqlCMC.push(gmCdCadtCMC[i]);
      }
    }
  } else if (loCbEstq.checked) {
    for (var i = 0; i < gmCdCadtCMC.length; i++) {
      if (
        parseFloat(gmCdCadtCMC[i].en_qtde) -
          parseFloat(gmCdCadtCMC[i].sa_qtde) -
          parseFloat(gmCdCadtCMC[i].de_qtde) >
        0
      ) {
        gmWkRsqlCMC.push(gmCdCadtCMC[i]);
      }
    }
  } else {
    gmWkRsqlCMC = JSON.parse(JSON.stringify(gmCdCadtCMC));
  }

  if (loTxPesq.value.toString().trim().length > 0) {
    gmWkRsqlCMC = gmWkRsqlCMC.filter(function (loWkRsql) {
      return (
        (
          loWkRsql.ce_codi.toString().trim().toUpperCase() +
          loWkRsql.ce_deno.toString().trim().toUpperCase() +
          loWkRsql.ce_espt.toString().trim().toUpperCase()
        ).indexOf(loTxPesq.value.toString().trim().toUpperCase()) >= 0
      );
    });
  }

  montaCadastrosEstoqueCMC();

  loDvCadt.onscroll = function () {
    if (
      loDvCadt.scrollHeight - loDvCadt.scrollTop - loDvCadt.clientHeight <
      1
    ) {
      montaCadastrosEstoqueCMC();
    }
  };

  calculaTotalCMC();
}

function consultaFotoFuncionarioCMC() {
  var lcFuEmpr = gmCdCadtCMC[0].fu_empr.trim().toUpperCase(),
    lcFuMatr = gmCdCadtCMC[0].fu_matr.toString();

  gcFuFotoCMC = "pesquisandoFoto";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "pesquisaFotos?lcPtFoto=facial/" +
      lcFuEmpr +
      lcFuMatr,
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gcFuFotoCMC = "";

      try {
        if (lmWkRsql.length > 0) {
          gcFuFotoCMC = "data:image/png;base64," + lmWkRsql[0].ft_base.trim();
        }
      } catch (loWkErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      gcFuFotoCMC = "";
    },
  });
}

async function loadModelsCMC() {
  glMdLoadCMC = false;

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.ageGenderNet.loadFromUri("./models"),
  ]);

  glMdLoadCMC = true;
}

async function loadModelsAndroidCMC() {
  glMdLoadCMC = false;

  await faceapi.nets.ssdMobilenetv1.loadFromUri(
    "http://www.atscs.com.br/kerp/models"
  );
  await faceapi.nets.faceLandmark68Net.loadFromUri(
    "http://www.atscs.com.br/kerp/models"
  );
  await faceapi.nets.faceRecognitionNet.loadFromUri(
    "http://www.atscs.com.br/kerp/models"
  );
  await faceapi.nets.ageGenderNet.loadFromUri(
    "http://www.atscs.com.br/kerp/models"
  );

  glMdLoadCMC = true;
}

function limpaCamposCMC() {
  var loDvCadt = document.getElementById("divCadtCMC");
  var loUlCadt = document.getElementById("uulCadtCMC");
  var loDvLoad = document.getElementById("divLoadCMC");

  gmWkRsqlCMC = [];

  gnInListCMC = 0;

  loDvCadt.onscroll = function () {};

  loUlCadt.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CestMvCadt() {
  limpaCamposCMC();

  gcFuFotoCMC = "";
  gcMvFotoCMC = "";
  gmCdCadtCMC = [];

  for (var i = 0; i < gmCdCadtCMM.length; i++) {
    gmCdCadtCMC.push(gmCdCadtCMM[i]);

    gmCdCadtCMC[i]["mv_qtde"] = 0;
    gmCdCadtCMC[i]["mv_motv"] = "";
  }

  if (gmCdCadtCMC[0].mv_dpar.trim().toUpperCase() == "F") {
    if (isMobile()) {
      if (gcSiOper == "Android") {
        loadModelsAndroidCMC();
      }
    } else {
      loadModelsCMC();
    }

    consultaFotoFuncionarioCMC();
  }

  pesquisaCadastrosEstoqueCMC();

  OkTecladoAndroid("txtPesqCMC");
}
