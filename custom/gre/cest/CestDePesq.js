var gmWkRsqlCDP = [],
  gmCdCadtCDP = [];
var gnInListCDP = 0;

function insereDevolucaoEstoqueCDP(lmDeMvto) {
  var loSlClie = document.getElementById("sltClieCDM");
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var loTaObse = document.getElementById("txaObseCDM");
  var lcWkIsql = "",
    lcDeMvto = "",
    lcDlObse = "",
    lcDlDenv = "1900-01-01",
    lcDlDpre = "1900-01-01";
  var lmWkIsql = [];
  var lnIdClie = 0;

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtEnvi.value.toString().trim().length > 0) {
    lcDlDenv = loDtEnvi.value.toString().trim().toUpperCase();
  }

  if (loDtPrev.value.toString().trim().length > 0) {
    lcDlDpre = loDtPrev.value.toString().trim().toUpperCase();
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcDlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  for (var i = 0; i < lmDeMvto.length; i++) {
    lcDeMvto +=
      "a:" +
      lmDeMvto[i].id_cest.toString() +
      "¢" +
      "b:" +
      lmDeMvto[i].dm_qtde.toString() +
      "£";
  }

  lcDeMvto = lcDeMvto.trim().slice(0, -1);

  if (lcDeMvto.trim().length == 0) {
    alerta("nenhum item adicionado", "alerta");

    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldDlDenv", pa_tipo: "SmallDatetime", pa_valo: lcDlDenv },
    { pa_nome: "ldDlDpre", pa_tipo: "SmallDatetime", pa_valo: lcDlDpre },
    { pa_nome: "lcDlObse", pa_tipo: "VarChar", pa_valo: lcDlObse },
    { pa_nome: "lcDeMvto", pa_tipo: "VarChar", pa_valo: lcDeMvto },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          try {
            if (lmWkRsql[0].dm_erro.trim().length > 0) {
              alerta(lmWkRsql[0].dm_erro.trim(), "alerta");

              return;
            }
          } catch (error) {}

          consultaDevolucaoEstoqueCDM(lmWkRsql);

          setTimeout(function () {
            goMnView.router.back();
          }, 500);
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereCadastrosEstoqueDevolucaoEstoqueCDP(lmDeMvto) {
  var loDtEnvi = document.getElementById("datEnviCDM");
  var loDtPrev = document.getElementById("datPrevCDM");
  var loTaObse = document.getElementById("txaObseCDM");
  var lcWkIsql = "",
    lcDeMvto = "",
    lcDlObse = "",
    lcDlDenv = "1900-01-01",
    lcDlDpre = "1900-01-01";
  var lmWkIsql = [];
  var lnIdDves = 0;

  try {
    if (parseInt(gmDeMvtoCDM[0].id_dves) > 0) {
      lnIdDves = parseInt(gmDeMvtoCDM[0].id_dves);
    }
  } catch (error) {}

  if (lnIdDves == 0) {
    return;
  }

  if (loDtEnvi.value.toString().trim().length > 0) {
    lcDlDenv = loDtEnvi.value.toString().trim().toUpperCase();
  }

  if (loDtPrev.value.toString().trim().length > 0) {
    lcDlDpre = loDtPrev.value.toString().trim().toUpperCase();
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcDlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  for (var i = 0; i < lmDeMvto.length; i++) {
    lcDeMvto +=
      "a:" +
      lmDeMvto[i].id_cest.toString() +
      "¢" +
      "b:" +
      lmDeMvto[i].dm_qtde.toString() +
      "£";
  }

  lcDeMvto = lcDeMvto.trim().slice(0, -1);

  if (lcDeMvto.trim().length == 0) {
    alerta("nenhum item adicionado", "alerta");

    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdDves", pa_tipo: "Int", pa_valo: lnIdDves },
    { pa_nome: "ldDlDenv", pa_tipo: "SmallDatetime", pa_valo: lcDlDenv },
    { pa_nome: "ldDlDpre", pa_tipo: "SmallDatetime", pa_valo: lcDlDpre },
    { pa_nome: "lcDlObse", pa_tipo: "VarChar", pa_valo: lcDlObse },
    { pa_nome: "lcDeMvto", pa_tipo: "VarChar", pa_valo: lcDeMvto },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastrosEstoqueDevolucaoEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          try {
            if (lmWkRsql[0].dm_erro.trim().length > 0) {
              alerta(lmWkRsql[0].dm_erro.trim(), "alerta");

              return;
            }
          } catch (error) {}

          consultaDevolucaoEstoqueCDM(lmWkRsql);

          setTimeout(function () {
            goMnView.router.back();
          }, 500);
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function adicionaCadastroEstoqueCDP() {
  var lmDeMvto = [];

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    if (parseFloat(gmCdCadtCDP[i].dm_qtde) > 0) {
      lmDeMvto.push(gmCdCadtCDP[i]);
    }
  }

  if (lmDeMvto.length == 0) {
    goMnView.router.back();

    return;
  }

  if (gmDeMvtoCDM.length > 0) {
    insereCadastrosEstoqueDevolucaoEstoqueCDP(lmDeMvto);
  } else {
    insereDevolucaoEstoqueCDP(lmDeMvto);
  }
}

function digitaCDP(lcWkRsql) {
  var loCdCadt = JSON.parse(unescape(lcWkRsql));
  var lnIdCest = parseInt(loCdCadt.id_cest);

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    if (parseInt(gmCdCadtCDP[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCDP[i]));

      break;
    }
  }

  sessionStorage.setItem("soCdCadt", JSON.stringify(loCdCadt));

  redireciona("custom/gre/cest/CestDeDgta.html", "CestDeDgta.html");
}

function removeCDP(lcWkRsql) {
  var loCbCart = document.getElementById("chkCartCDP"),
    loCbEstq = document.getElementById("chkEstqCDP"),
    loCdCadt = JSON.parse(unescape(lcWkRsql)),
    loBdQtde = {},
    loLiCadt = {};
  var lnIdCest = parseInt(loCdCadt.id_cest),
    lnDmPcus = 0,
    lnDmQtde = 0,
    lnCeQest = 0;

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    if (parseInt(gmCdCadtCDP[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCDP[i]));

      break;
    }
  }

  lnDmQtde = parseFloat(loCdCadt.dm_qtde);

  if (lnDmQtde <= 0) {
    return;
  }

  lnDmPcus = parseFloat(loCdCadt.ce_vcus);

  if (parseFloat(loCdCadt.mv_pcus) > 0) {
    lnDmPcus = parseFloat(loCdCadt.mv_pcus);
  }

  if (parseFloat(loCdCadt.dm_pcus) > 0) {
    lnDmPcus = parseFloat(loCdCadt.dm_pcus);
  }

  lnIdCest = parseInt(loCdCadt.id_cest);

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCDP");
  loLiCadt = document.getElementById("lli" + lnIdCest + "cdtCDP");

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    if (parseInt(gmCdCadtCDP[i].id_cest) == lnIdCest) {
      gmCdCadtCDP[i].dm_qtde--;

      calculaTotalCDP();

      lnDmQtde = gmCdCadtCDP[i].dm_qtde;
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

  if (loCbCart.checked || loCbEstq.checked) {
    pesquisaCadastrosEstoqueCDP();
  }
}

function calculaTotalCDP() {
  var loNrQtot = document.getElementById("nroQtotCDP");
  var loNrVtcu = document.getElementById("nroVtcuCDP");
  var lnDmTota = 0,
    lnDmPcus = 0,
    lnDmQtde = 0;

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    lnDmPcus = parseFloat(gmCdCadtCDP[i].ce_vcus);

    if (parseFloat(gmCdCadtCDP[i].mv_pcus) > 0) {
      lnDmPcus = parseFloat(gmCdCadtCDP[i].mv_pcus);
    }

    if (parseFloat(gmCdCadtCDP[i].dm_pcus) > 0) {
      lnDmPcus = parseFloat(gmCdCadtCDP[i].dm_pcus);
    }

    lnDmQtde += parseFloat(gmCdCadtCDP[i].dm_qtde);
    lnDmTota += parseFloat(gmCdCadtCDP[i].dm_qtde) * lnDmPcus;
  }

  loNrQtot.value = lnDmQtde;
  loNrVtcu.value = parseFloat(lnDmTota.toFixed(2));
}

function adicionaCDP(lcWkRsql) {
  var loCbCart = document.getElementById("chkCartCDP"),
    loCbEstq = document.getElementById("chkEstqCDP"),
    loCdCadt = JSON.parse(unescape(lcWkRsql)),
    loBdQtde = {},
    loLiCadt = {};
  var lnIdCest = parseInt(loCdCadt.id_cest),
    lnDmPcus = 0,
    lnDmQtde = 0,
    lnCeQest = 0;

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    if (parseInt(gmCdCadtCDP[i].id_cest) == lnIdCest) {
      loCdCadt = JSON.parse(JSON.stringify(gmCdCadtCDP[i]));

      break;
    }
  }

  lnDmPcus = parseFloat(loCdCadt.ce_vcus);

  if (parseFloat(loCdCadt.mv_pcus) > 0) {
    lnDmPcus = parseFloat(loCdCadt.mv_pcus);
  }

  if (parseFloat(loCdCadt.dm_pcus) > 0) {
    lnDmPcus = parseFloat(loCdCadt.dm_pcus);
  }

  lnIdCest = parseInt(loCdCadt.id_cest);

  loBdQtde = document.getElementById("bld" + lnIdCest + "qtdCDP");
  loLiCadt = document.getElementById("lli" + lnIdCest + "cdtCDP");

  for (var i = 0; i < gmCdCadtCDP.length; i++) {
    if (parseInt(gmCdCadtCDP[i].id_cest) == lnIdCest) {
      gmCdCadtCDP[i].dm_qtde++;

      calculaTotalCDP();

      lnDmQtde = gmCdCadtCDP[i].dm_qtde;
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

  if (loCbCart.checked || loCbEstq.checked) {
    pesquisaCadastrosEstoqueCDP();
  }
}

function montaCadastrosEstoqueCDP() {
  var loDvCadt = document.getElementById("divCadtCDP");
  var loDvLoad = document.getElementById("divLoadCDP");
  var lcWkRsql = "",
    lcCrQtde = "",
    lcLiCorr = "";
  var lnFnList = 0,
    lnDmQtde = 0,
    lnDmPcus = 0,
    lnCeQest = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (gnInListCDP + 20 >= gmWkRsqlCDP.length) {
    loDvCadt.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCDP.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCDP + 20;
  }

  for (var i = gnInListCDP; i < lnFnList; i++) {
    lcCrQtde = "";
    lcLiCorr = "";
    lnDmQtde = parseFloat(gmWkRsqlCDP[i].dm_qtde);
    lnDmPcus = parseFloat(gmWkRsqlCDP[i].ce_vcus);
    lnCeQest =
      parseFloat(gmWkRsqlCDP[i].en_qtde) -
      parseFloat(gmWkRsqlCDP[i].sa_qtde) -
      parseFloat(gmWkRsqlCDP[i].de_qtde);

    if (parseFloat(gmWkRsqlCDP[i].mv_pcus) > 0) {
      lnDmPcus = parseFloat(gmWkRsqlCDP[i].mv_pcus);
    }

    if (parseFloat(gmWkRsqlCDP[i].dm_pcus) > 0) {
      lnDmPcus = parseFloat(gmWkRsqlCDP[i].dm_pcus);
    }

    if (lnDmQtde > 0) {
      lcCrQtde = " style='color: " + corTema() + ";'";
    }

    if (lnCeQest < 0) {
      lnCeQest = 0;
    }

    if (lnCeQest < lnDmQtde) {
      lcLiCorr = " style='background-color: rgba(255, 255, 0, 0.25);'";
    }

    //prettier-ignore
    lcWkRsql += 
      "<li id='lli" + gmWkRsqlCDP[i].id_cest.toString().trim() + "cdtCDP'" + lcLiCorr + ">" +
        "<a href='#' class='item-link item-content'>" +
          "<div class='item-media'>" + 
            "<div>" +
              "<i onclick='adicionaCDP(\"" + escape(JSON.stringify(gmWkRsqlCDP[i])) + "\");' class='material-icons text-color-green' style='font-size: 36px;'>add_circle</i><br />" +
              "<i onclick='removeCDP(\"" + escape(JSON.stringify(gmWkRsqlCDP[i])) + "\");' class='material-icons text-color-red' style='font-size: 36px;'>remove_circle</i>" +
            "</div>" +
          "</div>" +
          "<div class='item-inner' onclick='digitaCDP(\"" + escape(JSON.stringify(gmWkRsqlCDP[i])) + "\");'>" +
            "<div class='item-title-row'>" +
              "<div class='item-title'><b id='bld" + gmWkRsqlCDP[i].id_cest.toString().trim() + "qtdCDP'" + lcCrQtde + ">" + brDecimal(lnDmQtde) + " x " + brMoney(lnDmPcus) + " = " + brMoney(lnDmQtde * lnDmPcus) + "</b></div>" +
              "<div class='item-after'>estq: " + brDecimal(lnCeQest) + "</div>" +
            "</div>" +
            "<div class='item-subtitle'>" +
              "<b>código: " + gmWkRsqlCDP[i].ce_codi.trim().toUpperCase() + "</b><br />" +
              "<b>unidade: " + gmWkRsqlCDP[i].ce_unes.trim().toUpperCase() + "</b>" +
            "</div>" +
            "<div class='item-text'>" +
              "<b>" + gmWkRsqlCDP[i].ce_deno.trim().toUpperCase() + " " + gmWkRsqlCDP[i].ce_espt.trim().toUpperCase() + "</b>" +
            "</div>" +
          "</div>" +
        "</a>" +
      "<li>";
  }

  $("#uulCadtCDP").append(lcWkRsql);

  gnInListCDP = i;
}

function pesquisaCadastrosEstoqueCDP() {
  var loDvCadt = document.getElementById("divCadtCDP"),
    loCbCart = document.getElementById("chkCartCDP"),
    loCbEstq = document.getElementById("chkEstqCDP"),
    loTxPesq = document.getElementById("txtPesqCDP");

  limpaCamposCDP();

  if (loCbCart.checked) {
    for (var i = 0; i < gmCdCadtCDP.length; i++) {
      if (parseFloat(gmCdCadtCDP[i].dm_qtde) > 0) {
        gmWkRsqlCDP.push(gmCdCadtCDP[i]);
      }
    }
  } else if (loCbCart.checked && loCbEstq.checked) {
    for (var i = 0; i < gmCdCadtCDP.length; i++) {
      if (
        parseFloat(gmCdCadtCDP[i].dm_qtde) > 0 &&
        parseFloat(gmCdCadtCDP[i].en_qtde) -
          parseFloat(gmCdCadtCDP[i].sa_qtde) -
          parseFloat(gmCdCadtCDP[i].de_qtde) >
          0
      ) {
        gmWkRsqlCDP.push(gmCdCadtCDP[i]);
      }
    }
  } else if (loCbEstq.checked) {
    for (var i = 0; i < gmCdCadtCDP.length; i++) {
      if (
        parseFloat(gmCdCadtCDP[i].en_qtde) -
          parseFloat(gmCdCadtCDP[i].sa_qtde) -
          parseFloat(gmCdCadtCDP[i].de_qtde) >
        0
      ) {
        gmWkRsqlCDP.push(gmCdCadtCDP[i]);
      }
    }
  } else {
    gmWkRsqlCDP = JSON.parse(JSON.stringify(gmCdCadtCDP));
  }

  if (loTxPesq.value.toString().trim().length > 0) {
    gmWkRsqlCDP = gmWkRsqlCDP.filter(function (loWkRsql) {
      return (
        (
          loWkRsql.ce_codi.toString().trim().toUpperCase() +
          loWkRsql.ce_deno.toString().trim().toUpperCase() +
          loWkRsql.ce_espt.toString().trim().toUpperCase()
        ).indexOf(loTxPesq.value.toString().trim().toUpperCase()) >= 0
      );
    });
  }

  montaCadastrosEstoqueCDP();

  loDvCadt.onscroll = function () {
    if (
      loDvCadt.scrollHeight - loDvCadt.scrollTop - loDvCadt.clientHeight <
      1
    ) {
      montaCadastrosEstoqueCDP();
    }
  };

  calculaTotalCDP();
}

function limpaCamposCDP() {
  var loDvCadt = document.getElementById("divCadtCDP");
  var loUlCadt = document.getElementById("uulCadtCDP");
  var loDvLoad = document.getElementById("divLoadCDP");

  gmWkRsqlCDP = [];

  gnInListCDP = 0;

  loDvCadt.onscroll = function () {};

  loUlCadt.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CestDePesq() {
  var loCdCadt = {};

  limpaCamposCDP();

  gmCdCadtCDP = [];

  for (var i = 0; i < gmCdCadtCDM.length; i++) {
    loCdCadt = gmCdCadtCDM[i];

    loCdCadt["dm_qtde"] = 0;
    loCdCadt["dm_pcus"] = 0;

    for (var j = 0; j < gmDeMvtoCDM.length; j++) {
      if (parseInt(loCdCadt.id_cest) == parseInt(gmDeMvtoCDM[j].id_cest)) {
        loCdCadt["dm_qtde"] = parseFloat(gmDeMvtoCDM[j].dm_qtde);
        loCdCadt["dm_pcus"] = parseFloat(gmDeMvtoCDM[j].dm_pcus);

        break;
      }
    }

    gmCdCadtCDP.push(loCdCadt);
  }

  pesquisaCadastrosEstoqueCDP();

  OkTecladoAndroid("txtPesqCDP");
}
