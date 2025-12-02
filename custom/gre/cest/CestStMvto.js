var gmStMvtoCSM = [],
  gmStMvrcCSM = [],
  gmCdCadtCSM = [];
var goCdCadtCSM = {};

function insereSolicitacaoTransferenciaCSM() {
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loTaObse = document.getElementById("txaObseCSM");
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var lnIdClie = 0,
    lnIdCest = 0,
    lnSmQtde = 0;
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "",
    lcApUser = "",
    lcApData = "1900-01-01",
    lcSlUenv = "",
    lcSlDenv = "1900-01-01",
    lcSlDrec = "1900-01-01";
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (loDtDnec.value.toString().trim().length > 0) {
      ldDtDnec = htmlDataParaObjetoData(loDtDnec.value);
      lcSlDnec = objetoDataParaStringSqlData(ldDtDnec);
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    app.input.validate(loDtDnec);

    return;
  }

  if (ldDtDnec < ldDtHoje) {
    return;
  }

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);
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

  if (lnSmQtde == 0) {
    app.input.validate(loNrQtde);

    return;
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: 1 },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcApUser", pa_tipo: "VarChar", pa_valo: lcApUser },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
    { pa_nome: "lcSlUenv", pa_tipo: "VarChar", pa_valo: lcSlUenv },
    { pa_nome: "ldSlDenv", pa_tipo: "SmallDatetime", pa_valo: lcSlDenv },
    { pa_nome: "ldSlDrec", pa_tipo: "SmallDatetime", pa_valo: lcSlDrec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: "" },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCadastroEstoqueCSM();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      consultaSolicitacaoTransferenciaCSM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereCadastroEstoqueSolicitacaoTransferenciaRecebidaCSM() {
  var loTaObse = document.getElementById("txaObseCSM");
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var loTaMotv = document.getElementById("txaMotvCSM");
  var lcSlObse = "",
    lcSlDnec = "",
    lcSmMotv = "",
    lcApUser = "",
    lcSlUenv = "",
    lcCeCodi = "",
    lcCeDeno = "",
    lcCeEspt = "",
    lcCeUnes = "",
    lcStDeno = "";
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnSmQtde = 0,
    lnIdCest = 0,
    lnSmPcus = 0,
    lnIdSitu = 0;
  var llSmMvrc = false,
    llSmMvto = false;

  try {
    if (parseInt(gmStMvrcCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvrcCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    return;
  }

  try {
    if (parseInt(gmStMvrcCSM[0].id_clie) > 0) {
      lnIdClie = parseInt(gmStMvrcCSM[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (jsonDate(gmStMvrcCSM[0].sl_dnec).trim().length > 0) {
      lcSlDnec = jsonDate(gmStMvrcCSM[0].sl_dnec).trim();
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    return;
  }

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  if (loTaMotv.value.toString().trim().length > 0) {
    lcSmMotv = loTaMotv.value.toString().trim().toUpperCase();
  }

  if (lcSmMotv.trim().length == 0) {
    return;
  }

  try {
    if (parseInt(gmStMvrcCSM[0].id_situ) > 0) {
      lnIdSitu = parseInt(gmStMvrcCSM[0].id_situ);
    }
  } catch (error) {}

  if (lnIdSitu == 0) {
    return;
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnSmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(goCdCadtCSM.ce_pcus) > 0) {
      lnSmPcus = parseFloat(goCdCadtCSM.ce_pcus);
    }
  } catch (error) {}

  for (var i = 0; i < gmStMvtoCSM.length; i++) {
    if (parseInt(gmStMvtoCSM[i].id_cest) == lnIdCest) {
      llSmMvto = true;

      break;
    }
  }

  for (var i = 0; i < gmStMvrcCSM.length; i++) {
    if (parseInt(gmStMvrcCSM[i].id_cest) == lnIdCest) {
      gmStMvrcCSM[i].sm_qtde = lnSmQtde;
      gmStMvrcCSM[i].sm_motv = lcSmMotv;
      gmStMvrcCSM[i].sm_pcus = lnSmPcus;

      llSmMvrc = true;

      break;
    }
  }

  if (llSmMvrc) {
    if (!llSmMvto && lnSmQtde == 0) {
      for (var i = 0; i < gmStMvrcCSM.length; i++) {
        if (parseInt(gmStMvrcCSM[i].id_cest) == lnIdCest) {
          gmStMvrcCSM.splice(i, 1);

          break;
        }
      }
    }

    limpaCamposCadastroEstoqueCSM();
    montaCadastrosEstoqueSolicitacaoTransferenciaRecebidaCSM();
  } else {
    if (lnSmQtde == 0) {
      alerta("quantidade inválida", "alerta");

      return;
    }

    try {
      if (goCdCadtCSM.ce_codi.trim().length > 0) {
        lcCeCodi = goCdCadtCSM.ce_codi.trim().toUpperCase();
      }
    } catch (error) {}

    if (lcCeCodi.trim().length == 0) {
      return;
    }

    try {
      if (goCdCadtCSM.ce_deno.trim().length > 0) {
        lcCeDeno = goCdCadtCSM.ce_deno.trim().toUpperCase();
      }
    } catch (error) {}

    try {
      if (goCdCadtCSM.ce_espt.trim().length > 0) {
        lcCeEspt = goCdCadtCSM.ce_espt.trim().toUpperCase();
      }
    } catch (error) {}

    try {
      if (goCdCadtCSM.ce_unes.trim().length > 0) {
        lcCeUnes = goCdCadtCSM.ce_unes.trim().toUpperCase();
      }
    } catch (error) {}

    limpaCamposCadastroEstoqueCSM();

    try {
      if (gmStMvrcCSM[0].ap_user.trim().length > 0) {
        lcApUser = gmStMvrcCSM[0].ap_user.trim().toUpperCase();
      }
    } catch (error) {}

    try {
      if (gmStMvrcCSM[0].sl_uenv.trim().length > 0) {
        lcSlUenv = gmStMvrcCSM[0].sl_uenv.trim().toUpperCase();
      }
    } catch (error) {}

    try {
      if (gmStMvrcCSM[0].st_deno.trim().length > 0) {
        lcStDeno = gmStMvrcCSM[0].st_deno.trim().toUpperCase();
      }
    } catch (error) {}

    gmStMvrcCSM.push({
      id_strf: lnIdStrf,
      sm_qtde: lnSmQtde,
      sm_pcus: lnSmPcus,
      id_cest: lnIdCest,
      sm_motv: lcSmMotv,
      sm_just: "",
      id_clie: lnIdClie,
      sl_obse: lcSlObse,
      sl_dnec: gmStMvrcCSM[0].sl_dnec,
      sl_denv: gmStMvrcCSM[0].sl_denv,
      sl_data: gmStMvrcCSM[0].sl_data,
      id_situ: lnIdSitu,
      ap_user: lcApUser,
      ap_data: gmStMvrcCSM[0].ap_data,
      sl_dpre: gmStMvrcCSM[0].sl_dpre,
      sl_drec: gmStMvrcCSM[0].sl_drec,
      sl_uenv: lcSlUenv,
      sl_ucon: gmStMvrcCSM[0].sl_ucon,
      sl_dcon: gmStMvrcCSM[0].sl_dcon,
      ce_codi: lcCeCodi,
      ce_deno: lcCeDeno,
      ce_espt: lcCeEspt,
      ce_unes: lcCeUnes,
      st_deno: lcStDeno,
    });

    montaCadastrosEstoqueSolicitacaoTransferenciaRecebidaCSM();
  }
}

function insereCadastroEstoqueSolicitacaoTransferenciaCSM() {
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loTaObse = document.getElementById("txaObseCSM");
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "";
  var lmWkIsql = [];
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnSmQtde = 0,
    lnIdCest = 0;
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    return;
  }

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (loDtDnec.value.toString().trim().length > 0) {
      ldDtDnec = htmlDataParaObjetoData(loDtDnec.value);
      lcSlDnec = objetoDataParaStringSqlData(ldDtDnec);
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    app.input.validate(loDtDnec);

    return;
  }

  if (ldDtDnec < ldDtHoje) {
    return;
  }

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);
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

  if (lnSmQtde == 0) {
    app.input.validate(loNrQtde);

    return;
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: "" },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCadastroEstoqueCSM();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastroEstoqueSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      consultaSolicitacaoTransferenciaCSM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function adicionaCadastroEstoqueCSM() {
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var loTaMotv = document.getElementById("txaMotvCSM");
  var lnIdClie = 0,
    lnIdCest = 0,
    lnSmQtde = 0,
    lnIdStrf = 0,
    lnIdSitu = 0;
  var lcSlDnec = "",
    lcSmMotv = "";
  var llCpAlrt = false;
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  try {
    if (parseInt(gmStMvtoCSM[0].id_situ) > 0) {
      lnIdSitu = parseInt(gmStMvtoCSM[0].id_situ);
    }
  } catch (error) {}

  if (loDtDnec.value.toString().trim().length == 0) {
    app.input.validate(loDtDnec);

    llCpAlrt = true;
  }

  if (loNrQtde.value.toString().trim().length == 0) {
    app.input.validate(loNrQtde);

    llCpAlrt = true;
  }

  if (
    lnIdStrf > 0 &&
    lnIdSitu != 1 &&
    loTaMotv.value.toString().trim().length == 0
  ) {
    app.input.validate(loTaMotv);

    llCpAlrt = true;
  }

  if (llCpAlrt) {
    return;
  }

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  try {
    if (loDtDnec.value.toString().trim().length > 0) {
      ldDtDnec = htmlDataParaObjetoData(loDtDnec.value);
      lcSlDnec = objetoDataParaStringSqlData(ldDtDnec);
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    alerta("data da necessidade inválida", "alerta");

    return;
  }

  if (lnIdSitu == 0 || lnIdSitu == 1) {
    if (ldDtDnec < ldDtHoje) {
      alerta("data da necessidade menor que data atual", "alerta");

      return;
    }
  }

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    alerta("item inválido", "alerta");

    return;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnSmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (lnIdSitu == 0 || lnIdSitu == 1) {
    if (lnSmQtde == 0) {
      alerta("quantidade inválida", "alerta");

      return;
    }
  }

  if (lnIdStrf > 0) {
    if (lnIdSitu == 1) {
      insereCadastroEstoqueSolicitacaoTransferenciaCSM();
    } else {
      if (loTaMotv.value.toString().trim().length > 0) {
        lcSmMotv = loTaMotv.value.toString().trim().toUpperCase();
      }

      if (lcSmMotv.trim().length == 0) {
        alerta("motivo da alteração obrigatório", "alerta");

        return;
      }

      insereCadastroEstoqueSolicitacaoTransferenciaRecebidaCSM();
    }
  } else {
    insereSolicitacaoTransferenciaCSM();
  }
}

function alteraQuantidadeCSM() {
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var loDvTcus = document.getElementById("divTcusCSM");
  var lnIdCest = 0,
    lnCeVcus = 0,
    lnCePcus = 0,
    lnCeCust = 0,
    lnSmQtde = 0;

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);

      lcCeTipo = goCdCadtCSM.ce_tipo.trim().toUpperCase();

      lnCeVcus = parseFloat(goCdCadtCSM.ce_vcus);
      lnCePcus = parseFloat(goCdCadtCSM.ce_pcus);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  if (lnCePcus > 0) {
    lnCeCust = lnCePcus;
  } else {
    lnCeCust = lnCeVcus;
  }

  try {
    if (parseFloat(loNrQtde.value) > 0) {
      lnSmQtde = parseFloat(loNrQtde.value);
    }
  } catch (error) {}

  if (parseFloat(lnSmQtde * lnCeCust) > 0) {
    loDvTcus.innerHTML = brMoney(lnSmQtde * lnCeCust);
  } else {
    loDvTcus.innerHTML = "";
  }
}

function pesquisaCadastroEstoqueCSM() {
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var lnIdClie = 0,
    lnIdStrf = 0,
    lnIdSitu = 0;
  var lcSlDnec = "";
  var llCpAlrt = false;
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  try {
    if (parseInt(gmStMvtoCSM[0].id_situ) > 0) {
      lnIdSitu = parseInt(gmStMvtoCSM[0].id_situ);
    }
  } catch (error) {}

  if (loDtDnec.value.toString().trim().length == 0) {
    app.input.validate(loDtDnec);

    llCpAlrt = true;
  }

  if (llCpAlrt) {
    return;
  }

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  try {
    if (loDtDnec.value.toString().trim().length > 0) {
      ldDtDnec = htmlDataParaObjetoData(loDtDnec.value);
      lcSlDnec = objetoDataParaStringSqlData(ldDtDnec);
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    alerta("data da necessidade inválida", "alerta");

    return;
  }

  if (lnIdSitu == 0 || lnIdSitu == 1) {
    if (ldDtDnec < ldDtHoje) {
      alerta("data da necessidade menor que data atual", "alerta");

      return;
    }
  }

  if (gmCdCadtCSM.length == 0) {
    alerta("carregando itens, aguarde", "alerta");

    return;
  }

  for (var i = 0; i < gmCdCadtCSM.length; i++) {
    gmCdCadtCSM[i]["id_strf"] = lnIdStrf;
    gmCdCadtCSM[i]["id_situ"] = lnIdSitu;
    gmCdCadtCSM[i]["sm_qtde"] = 0;
    gmCdCadtCSM[i]["sm_motv"] = "";
    gmCdCadtCSM[i]["ce_pcus"] = parseFloat(gmCdCadtCSM[i].ce_vcus);

    if (parseFloat(gmCdCadtCSM[i].mv_pcus) > 0) {
      gmCdCadtCSM[i].ce_pcus = parseFloat(gmCdCadtCSM[i].mv_pcus);
    }
  }

  if (lnIdStrf > 0) {
    if (lnIdSitu == 1) {
      for (var i = 0; i < gmCdCadtCSM.length; i++) {
        for (var j = 0; j < gmStMvtoCSM.length; j++) {
          if (
            parseInt(gmCdCadtCSM[i].id_cest) == parseInt(gmStMvtoCSM[j].id_cest)
          ) {
            gmCdCadtCSM[i].sm_qtde = parseFloat(gmStMvtoCSM[j].sm_qtde);
            gmCdCadtCSM[i].sm_motv = gmStMvtoCSM[j].sm_motv
              .trim()
              .toUpperCase();

            break;
          }
        }
      }
    } else {
      for (var i = 0; i < gmCdCadtCSM.length; i++) {
        for (var j = 0; j < gmStMvrcCSM.length; j++) {
          if (
            parseInt(gmCdCadtCSM[i].id_cest) == parseInt(gmStMvrcCSM[j].id_cest)
          ) {
            gmCdCadtCSM[i].sm_qtde = parseFloat(gmStMvrcCSM[j].sm_qtde);
            gmCdCadtCSM[i].sm_motv = gmStMvrcCSM[j].sm_motv
              .trim()
              .toUpperCase();

            break;
          }
        }
      }
    }
  }

  sessionStorage.setItem("smCdCadt", JSON.stringify(gmCdCadtCSM));

  redireciona("custom/gre/cest/CestStCadt.html", "CestStCadt.html");
}

function atualizaSolicitacaoTransferenciaCSM(loSlObjt) {
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loTaObse = document.getElementById("txaObseCSM");
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnIdSitu = 0;
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loSlObjt.value == loSlObjt.defaultValue) {
    return;
  }

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    return;
  }

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    if (loSlObjt.id.trim().toUpperCase() == "SLTCLIECSM") {
      loSlClie.value = loSlClie.defaultValue;
    }

    return;
  }

  try {
    if (loDtDnec.value.toString().trim().length > 0) {
      ldDtDnec = htmlDataParaObjetoData(loDtDnec.value);
      lcSlDnec = objetoDataParaStringSqlData(ldDtDnec);
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    if (loSlObjt.id.trim().toUpperCase() == "DATDNECCSM") {
      loDtDnec.value = loDtDnec.defaultValue;

      app.input.validate(loDtDnec);
    }

    return;
  }

  try {
    if (parseInt(gmStMvtoCSM[0].id_situ) > 0) {
      lnIdSitu = parseInt(gmStMvtoCSM[0].id_situ);
    }
  } catch (error) {}

  if (lnIdSitu == 0 || lnIdSitu == 1) {
    if (ldDtDnec < ldDtHoje) {
      if (loSlObjt.id.trim().toUpperCase() == "DATDNECCSM") {
        loDtDnec.value = loDtDnec.defaultValue;

        app.input.validate(loDtDnec);
      }

      return;
    }
  }

  lcSlObse = loTaObse.value.toString().trim().toUpperCase();

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].sl_erro.trim().length > 0) {
          alerta(lmWkRsql[0].sl_erro.trim().toLowerCase(), "alerta");

          loSlObjt.value = loSlObjt.defaultValue;

          return;
        }
      } catch (loApErro) {}

      consultaSolicitacaoTransferenciaCSM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

// function atualizaContestaSolicitacaoTransferenciaCSM() {
//   var loTaJcon = document.getElementById("txaJconCSM");
//   var lcWkIsql = "",
//     lcSlJcon = "";
//   var lmWkIsql = [];
//   var lnIdStrf = 0;

//   try {
//     if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
//       lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
//     }
//   } catch (error) {}

//   if (lnIdStrf == 0) {
//     return;
//   }

//   lcSlJcon = loTaJcon.value.toString().trim().toUpperCase();

//   if (lcSlJcon.trim().length == 0) {
//     alerta("justificativa da contestação inválida", "alerta");

//     return;
//   }

//   app.dialog
//     .create({
//       title: "alerta",
//       text: "deseja contestar solicitação de transferência ?",
//       buttons: [
//         {
//           text: "cancelar",
//           color: corBotaoAlerta(),
//           onClick: function () {},
//         },
//         {
//           text: "ok",
//           color: corBotaoAlerta(),
//           onClick: function () {
//             lmWkIsql = [
//               {
//                 pa_nome: "lcIdUser",
//                 pa_tipo: "VarChar",
//                 pa_valo: goCdUser.id_user.trim().toUpperCase(),
//               },
//               { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
//               { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
//               {
//                 pa_nome: "lcSlJcon",
//                 pa_tipo: "VarChar",
//                 pa_valo: lcSlJcon.trim().toUpperCase(),
//               },
//             ];

//             lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

//             $.ajax({
//               url:
//                 goCdUser.ws_http.trim() +
//                 "chamadaProcedure?lcWkIsql=" +
//                 lcWkIsql +
//                 "&lcWkProc=atualizaContestaSolicitacaoTransferencia",
//               type: "GET",
//               dataType: "jsonp",

//               success: function (lmWkRsql) {
//                 try {
//                   if (lmWkRsql.length > 0) {
//                     limpaCamposCSM();
//                     pesquisaSolicitacoesTransferenciaCSL();

//                     notificacao(
//                       "solicitação de transferência contestada",
//                       "sucesso"
//                     );

//                     goMnView.router.back();
//                   }
//                 } catch (loApErro) {}
//               },
//               error: function (jqXHR, textStatus, err) {},
//             });
//           },
//         },
//       ],
//     })
//     .open();
// }

// function atualizaReenviaSolicitacaoTransferenciaCSM(lmStMvto) {
//   var lnIdStrf = 0,
//     lnIdCest = 0;
//   var lcWkIsql = "",
//     lcSmMotv = "";
//   var lmWkIsql = [];

//   try {
//     if (parseInt(lmStMvto[0].id_strf) > 0) {
//       lnIdStrf = parseInt(lmStMvto[0].id_strf);
//     }
//   } catch (error) {}

//   if (lnIdStrf == 0) {
//     app.dialog.close();

//     return;
//   }

//   try {
//     if (parseInt(lmStMvto[0].id_cest) > 0) {
//       lnIdCest = parseInt(lmStMvto[0].id_cest);
//     }
//   } catch (error) {}

//   if (lnIdCest == 0) {
//     app.dialog.close();

//     return;
//   }

//   try {
//     if (lmStMvto[0].sm_motv.trim().length > 0) {
//       lcSmMotv = lmStMvto[0].sm_motv.trim().toUpperCase();
//     }
//   } catch (error) {}

//   if (lcSmMotv.trim().length == 0) {
//     app.dialog.close();

//     return;
//   }

//   lmWkIsql = [
//     {
//       pa_nome: "lcIdUser",
//       pa_tipo: "VarChar",
//       pa_valo: goCdUser.id_user.trim().toUpperCase(),
//     },
//     { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
//     { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
//     { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
//     { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
//   ];

//   lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

//   $.ajax({
//     url:
//       goCdUser.ws_http.trim() +
//       "chamadaProcedure?lcWkIsql=" +
//       lcWkIsql +
//       "&lcWkProc=atualizaReenviaSolicitacaoTransferencia",
//     type: "GET",
//     dataType: "jsonp",

//     success: function (lmWkRsql) {
//       try {
//         if (lmWkRsql.length > 0) {
//           lmStMvto.shift();

//           if (lmStMvto.length == 0) {
//             app.dialog.close();

//             limpaCamposCSM();
//             pesquisaSolicitacoesTransferenciaCSL();

//             notificacao("solicitação de transferência devolvida", "sucesso");

//             goMnView.router.back();
//           } else {
//             atualizaReenviaSolicitacaoTransferenciaCSM(lmStMvto);
//           }
//         }
//       } catch (loApErro) {
//         app.dialog.close();
//       }
//     },
//     error: function (jqXHR, textStatus, err) {
//       app.dialog.close();
//     },
//   });
// }

function insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
  lmRcMvto,
  lmNrMvto,
  lmStMvto
) {
  var loTaObse = document.getElementById("txaObseCSM");
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "1900-01-01",
    lcSmMotv = "";
  var lmWkIsql = [];
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnSmQtde = 0;

  if (lmRcMvto.length == 0) {
    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_strf) > 0) {
      lnIdStrf = parseInt(lmRcMvto[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_clie) > 0) {
      lnIdClie = parseInt(lmRcMvto[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_cest) > 0) {
      lnIdCest = parseInt(lmRcMvto[0].id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    lmRcMvto.shift();

    insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
      lmRcMvto,
      lmNrMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (parseFloat(lmRcMvto[0].sm_qtde) > 0) {
      lnSmQtde = parseFloat(lmRcMvto[0].sm_qtde);
    }
  } catch (error) {}

  if (lnSmQtde == 0) {
    lmRcMvto.shift();

    insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
      lmRcMvto,
      lmNrMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (jsonDate(lmRcMvto[0].sl_dnec).trim().length > 0) {
      lcSlDnec = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmRcMvto[0].sl_dnec))
      );
    }
  } catch (error) {}

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  try {
    if (lmRcMvto[0].sm_motv.trim().length > 0) {
      lcSmMotv = lmRcMvto[0].sm_motv.trim().toUpperCase();
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastroEstoqueSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmRcMvto.shift();

          if (lmRcMvto.length == 0) {
            insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
          } else {
            insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
              lmRcMvto,
              lmNrMvto,
              lmStMvto
            );
          }
        } else {
          insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
        }
      } catch (loApErro) {
        insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
      }
    },
    error: function (jqXHR, textStatus, err) {
      insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
    },
  });
}

function insereCadastroEstoqueSolicitacaoTransferenciaNaoRecebidaCSM(
  lmNrMvto,
  lmStMvto
) {
  var loTaObse = document.getElementById("txaObseCSM");
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "1900-01-01",
    lcSmMotv = "";
  var lmWkIsql = [];
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnSmQtde = 0;

  if (lmNrMvto.length == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmNrMvto[0].id_strf) > 0) {
      lnIdStrf = parseInt(lmNrMvto[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmNrMvto[0].id_clie) > 0) {
      lnIdClie = parseInt(lmNrMvto[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmNrMvto[0].id_cest) > 0) {
      lnIdCest = parseInt(lmNrMvto[0].id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    lmNrMvto.shift();

    insereCadastroEstoqueSolicitacaoTransferenciaNaoRecebidaCSM(
      lmNrMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (parseFloat(lmNrMvto[0].sm_qtde) > 0) {
      lnSmQtde = parseFloat(lmNrMvto[0].sm_qtde);
    }
  } catch (error) {}

  if (lnSmQtde == 0) {
    lmNrMvto.shift();

    insereCadastroEstoqueSolicitacaoTransferenciaNaoRecebidaCSM(
      lmNrMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (jsonDate(lmNrMvto[0].sl_dnec).trim().length > 0) {
      lcSlDnec = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmNrMvto[0].sl_dnec))
      );
    }
  } catch (error) {}

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  try {
    if (lmNrMvto[0].sm_motv.trim().length > 0) {
      lcSmMotv = lmNrMvto[0].sm_motv.trim().toUpperCase();
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastroEstoqueSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmNrMvto.shift();

          if (lmNrMvto.length == 0) {
            atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
          } else {
            insereCadastroEstoqueSolicitacaoTransferenciaNaoRecebidaCSM(
              lmNrMvto,
              lmStMvto
            );
          }
        } else {
          atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
    },
  });
}

function insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto) {
  var loTaObse = document.getElementById("txaObseCSM");
  var lnIdClie = 0,
    lnIdCest = 0,
    lnSmQtde = 0;
  // lnSlQtde = 0;
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "1900-01-01",
    lcApUser = "",
    lcApData = "1900-01-01",
    lcSlUenv = "",
    lcSlDenv = "1900-01-01",
    lcSlDrec = "1900-01-01",
    lcSmMotv = "";
  var lmWkIsql = [];

  // if (lmStMvto.length > 0) {
  //   for (var i = 0; i < lmStMvto.length; i++) {
  //     lnSlQtde += parseFloat(lmStMvto[i].sm_qtde);
  //   }

  //   if (lnSlQtde == 0) {
  //     atualizaReenviaSolicitacaoTransferenciaCSM(lmStMvto);

  //     return;
  //   }
  // }

  if (lmNrMvto.length == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmNrMvto[0].id_clie) > 0) {
      lnIdClie = parseInt(lmNrMvto[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmNrMvto[0].id_cest) > 0) {
      lnIdCest = parseInt(lmNrMvto[0].id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    lmNrMvto.shift();

    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (parseFloat(lmNrMvto[0].sm_qtde) > 0) {
      lnSmQtde = parseFloat(lmNrMvto[0].sm_qtde);
    }
  } catch (error) {}

  if (lnSmQtde == 0) {
    lmNrMvto.shift();

    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (lmNrMvto[0].sm_motv.trim().length > 0) {
      lcSmMotv = lmNrMvto[0].sm_motv.trim().toUpperCase();
    }
  } catch (error) {}

  if (lcSmMotv.trim().length == 0) {
    lmNrMvto.shift();

    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (jsonDate(lmNrMvto[0].sl_dnec).trim().length > 0) {
      lcSlDnec = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmNrMvto[0].sl_dnec))
      );
    }
  } catch (error) {}

  try {
    if (lmNrMvto[0].ap_user.trim().length > 0) {
      lcApUser = lmNrMvto[0].ap_user.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (jsonDate(lmNrMvto[0].ap_data).trim().length > 0) {
      lcApData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmNrMvto[0].ap_data))
      );
    }
  } catch (error) {}

  try {
    if (lmNrMvto[0].sl_uenv.trim().length > 0) {
      lcSlUenv = lmNrMvto[0].sl_uenv.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (jsonDate(lmNrMvto[0].sl_denv).trim().length > 0) {
      lcSlDenv = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmNrMvto[0].sl_denv))
      );
    }
  } catch (error) {}

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: 35 },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcApUser", pa_tipo: "VarChar", pa_valo: lcApUser },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
    { pa_nome: "lcSlUenv", pa_tipo: "VarChar", pa_valo: lcSlUenv },
    { pa_nome: "ldSlDenv", pa_tipo: "SmallDatetime", pa_valo: lcSlDenv },
    { pa_nome: "ldSlDrec", pa_tipo: "SmallDatetime", pa_valo: lcSlDrec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmNrMvto.shift();

          if (lmNrMvto.length == 0) {
            atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
          } else {
            for (var i = 0; i < lmNrMvto.length; i++) {
              lmNrMvto[i].id_strf = parseInt(lmWkRsql[0].id_strf);
            }

            insereCadastroEstoqueSolicitacaoTransferenciaNaoRecebidaCSM(
              lmNrMvto,
              lmStMvto
            );
          }
        } else {
          atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
    },
  });
}

function insereSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
  lmRcMvto,
  lmNrMvto,
  lmStMvto
) {
  var loTaObse = document.getElementById("txaObseCSM");
  var lnIdClie = 0,
    lnIdCest = 0,
    lnSmQtde = 0;
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "1900-01-01",
    lcApUser = "",
    lcApData = "1900-01-01",
    lcSlUenv = "",
    lcSlDenv = "1900-01-01",
    lcSlDrec = "1900-01-01",
    lcSmMotv = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (lmRcMvto.length == 0) {
    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_clie) > 0) {
      lnIdClie = parseInt(lmRcMvto[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_cest) > 0) {
      lnIdCest = parseInt(lmRcMvto[0].id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    lmRcMvto.shift();

    insereSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
      lmRcMvto,
      lmNrMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (parseFloat(lmRcMvto[0].sm_qtde) > 0) {
      lnSmQtde = parseFloat(lmRcMvto[0].sm_qtde);
    }
  } catch (error) {}

  if (lnSmQtde == 0) {
    lmRcMvto.shift();

    insereSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
      lmRcMvto,
      lmNrMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (lmRcMvto[0].sm_motv.trim().length > 0) {
      lcSmMotv = lmRcMvto[0].sm_motv.trim().toUpperCase();
    }
  } catch (error) {}

  if (lcSmMotv.trim().length == 0) {
    lmRcMvto.shift();

    insereSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
      lmRcMvto,
      lmNrMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (jsonDate(lmRcMvto[0].sl_dnec).trim().length > 0) {
      lcSlDnec = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmRcMvto[0].sl_dnec))
      );
    }
  } catch (error) {}

  try {
    if (lmRcMvto[0].sl_uenv.trim().length > 0) {
      lcSlUenv = lmRcMvto[0].sl_uenv.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (jsonDate(lmRcMvto[0].sl_denv).trim().length > 0) {
      lcSlDenv = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmRcMvto[0].sl_denv))
      );
    }
  } catch (error) {}

  lcSlDrec = objetoDataParaStringSqlData(ldDtHoje);

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: 35 },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcApUser", pa_tipo: "VarChar", pa_valo: lcApUser },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
    { pa_nome: "lcSlUenv", pa_tipo: "VarChar", pa_valo: lcSlUenv },
    { pa_nome: "ldSlDenv", pa_tipo: "SmallDatetime", pa_valo: lcSlDenv },
    { pa_nome: "ldSlDrec", pa_tipo: "SmallDatetime", pa_valo: lcSlDrec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmRcMvto.shift();

          if (lmRcMvto.length == 0) {
            insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
          } else {
            for (var i = 0; i < lmRcMvto.length; i++) {
              lmRcMvto[i].id_strf = parseInt(lmWkRsql[0].id_strf);
            }

            insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
              lmRcMvto,
              lmNrMvto,
              lmStMvto
            );
          }
        } else {
          insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
        }
      } catch (loApErro) {
        insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
      }
    },
    error: function (jqXHR, textStatus, err) {
      insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
    },
  });
}

function insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(
  lmRcMvto,
  lmStMvto
) {
  var loTaObse = document.getElementById("txaObseCSM");
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "1900-01-01",
    lcSmMotv = "";
  var lmWkIsql = [];
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnSmQtde = 0;

  if (lmRcMvto.length == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_strf) > 0) {
      lnIdStrf = parseInt(lmRcMvto[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_clie) > 0) {
      lnIdClie = parseInt(lmRcMvto[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_cest) > 0) {
      lnIdCest = parseInt(lmRcMvto[0].id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    lmRcMvto.shift();

    insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(
      lmRcMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (parseFloat(lmRcMvto[0].sm_qtde) > 0) {
      lnSmQtde = parseFloat(lmRcMvto[0].sm_qtde);
    }
  } catch (error) {}

  if (lnSmQtde == 0) {
    lmRcMvto.shift();

    insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(
      lmRcMvto,
      lmStMvto
    );

    return;
  }

  try {
    if (jsonDate(lmRcMvto[0].sl_dnec).trim().length > 0) {
      lcSlDnec = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmRcMvto[0].sl_dnec))
      );
    }
  } catch (error) {}

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  try {
    if (lmRcMvto[0].sm_motv.trim().length > 0) {
      lcSmMotv = lmRcMvto[0].sm_motv.trim().toUpperCase();
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastroEstoqueSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmRcMvto.shift();

          if (lmRcMvto.length == 0) {
            atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
          } else {
            insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(
              lmRcMvto,
              lmStMvto
            );
          }
        } else {
          atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
        }
      } catch (loApErro) {
        atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
      }
    },
    error: function (jqXHR, textStatus, err) {
      atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
    },
  });
}

function atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto) {
  var loTaObse = document.getElementById("txaObseCSM");
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "1900-01-01",
    // lcWkProc = "",
    lcSmMotv = "";
  var lmWkIsql = [];
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnSmQtde = 0;

  if (lmStMvto.length == 0) {
    atualizaFinalizaSolicitacaoTransferenciaCSM();

    return;
  }

  try {
    if (parseInt(lmStMvto[0].id_strf) > 0) {
      lnIdStrf = parseInt(lmStMvto[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    app.dialog.close();

    return;
  }

  try {
    if (parseInt(lmStMvto[0].id_clie) > 0) {
      lnIdClie = parseInt(lmStMvto[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    app.dialog.close();

    return;
  }

  try {
    if (parseInt(lmStMvto[0].id_cest) > 0) {
      lnIdCest = parseInt(lmStMvto[0].id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    lmStMvto.shift();

    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (jsonDate(lmStMvto[0].sl_dnec).trim().length > 0) {
      lcSlDnec = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmStMvto[0].sl_dnec))
      );
    }
  } catch (error) {}

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  try {
    if (parseFloat(lmStMvto[0].sm_qtde) > 0) {
      lnSmQtde = parseFloat(lmStMvto[0].sm_qtde);
    }
  } catch (error) {}

  try {
    if (lmStMvto[0].sm_motv.trim().length > 0) {
      lcSmMotv = lmStMvto[0].sm_motv.trim().toUpperCase();
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
  ];

  // if (lnSmQtde > 0) {
  //   lmWkIsql.push(
  //     { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
  //     { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv }
  //   );

  //   lcWkProc = "insereCadastroEstoqueSolicitacaoTransferencia";
  // } else {
  //   lcWkProc = "deletaCadastroEstoqueSolicitacaoTransferencia";
  // }

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereCadastroEstoqueSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmStMvto.shift();

          if (lmStMvto.length == 0) {
            atualizaFinalizaSolicitacaoTransferenciaCSM();
          } else {
            atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
          }
        } else {
          app.dialog.close();
        }
      } catch (loApErro) {
        app.dialog.close();
      }
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function insereSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(
  lmRcMvto,
  lmStMvto
) {
  var loTaObse = document.getElementById("txaObseCSM");
  var lnIdClie = 0,
    lnIdCest = 0,
    lnSmQtde = 0;
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "1900-01-01",
    lcApUser = "",
    lcApData = "1900-01-01",
    lcSlUenv = "",
    lcSlDenv = "1900-01-01",
    lcSlDrec = "1900-01-01",
    lcSmMotv = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (lmRcMvto.length == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_clie) > 0) {
      lnIdClie = parseInt(lmRcMvto[0].id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);

    return;
  }

  try {
    if (parseInt(lmRcMvto[0].id_cest) > 0) {
      lnIdCest = parseInt(lmRcMvto[0].id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    lmRcMvto.shift();

    insereSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(lmRcMvto, lmStMvto);

    return;
  }

  try {
    if (parseFloat(lmRcMvto[0].sm_qtde) > 0) {
      lnSmQtde = parseFloat(lmRcMvto[0].sm_qtde);
    }
  } catch (error) {}

  if (lnSmQtde == 0) {
    lmRcMvto.shift();

    insereSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(lmRcMvto, lmStMvto);

    return;
  }

  try {
    if (lmRcMvto[0].sm_motv.trim().length > 0) {
      lcSmMotv = lmRcMvto[0].sm_motv.trim().toUpperCase();
    }
  } catch (error) {}

  if (lcSmMotv.trim().length == 0) {
    lmRcMvto.shift();

    insereSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(lmRcMvto, lmStMvto);

    return;
  }

  try {
    if (jsonDate(lmRcMvto[0].sl_dnec).trim().length > 0) {
      lcSlDnec = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmRcMvto[0].sl_dnec))
      );
    }
  } catch (error) {}

  try {
    if (lmRcMvto[0].sl_uenv.trim().length > 0) {
      lcSlUenv = lmRcMvto[0].sl_uenv.trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (jsonDate(lmRcMvto[0].sl_denv).trim().length > 0) {
      lcSlDenv = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(lmRcMvto[0].sl_denv))
      );
    }
  } catch (error) {}

  lcSlDrec = objetoDataParaStringSqlData(ldDtHoje);

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: 35 },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcApUser", pa_tipo: "VarChar", pa_valo: lcApUser },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
    { pa_nome: "lcSlUenv", pa_tipo: "VarChar", pa_valo: lcSlUenv },
    { pa_nome: "ldSlDenv", pa_tipo: "SmallDatetime", pa_valo: lcSlDenv },
    { pa_nome: "ldSlDrec", pa_tipo: "SmallDatetime", pa_valo: lcSlDrec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
    { pa_nome: "lnSmQtde", pa_tipo: "Decimal", pa_valo: lnSmQtde },
    { pa_nome: "lcSmMotv", pa_tipo: "VarChar", pa_valo: lcSmMotv },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmRcMvto.shift();

          if (lmRcMvto.length == 0) {
            atualizaCadastroEstoqueSolicitacaoTransferenciaCSM(lmStMvto);
          } else {
            for (var i = 0; i < lmRcMvto.length; i++) {
              lmRcMvto[i].id_strf = parseInt(lmWkRsql[0].id_strf);
            }

            insereCadastroEstoqueSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(
              lmRcMvto,
              lmStMvto
            );
          }
        } else {
          insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
        }
      } catch (loApErro) {
        insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
      }
    },
    error: function (jqXHR, textStatus, err) {
      insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
    },
  });
}

function atualizaFinalizaSolicitacaoTransferenciaCSM() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdStrf = 0;

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaFinalizaSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      try {
        if (lmWkRsql.length > 0) {
          limpaCamposCSM();
          pesquisaSolicitacoesTransferenciaCSL();

          notificacao("solicitação de transferência finalizada", "sucesso");

          goMnView.router.back();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function pdfCSM(lnRdVisu) {
  var ldDtHoje = new Date();
  var lcStHtml = "",
    lcShTitu =
      "arquivo pdf referente aos itens enviados da solicitação de transferência",
    lcShSbti = "itens enviados da solicitação de transferência",
    lcStLcto = "",
    lcSmPcus = "",
    lcSmTota = "";
  var lnSlQtde = 0,
    lnSlPcus = 0,
    lnIdStrf = 0;

  if (gmStMvtoCSM.length == 0) {
    alerta("nenhum item recebido", "alerta");

    return;
  }

  lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);

  for (var i = 0; i < gmStMvtoCSM.length; i++) {
    lcSmPcus = "";
    lcSmTota = "";

    if (parseFloat(gmStMvtoCSM[i].sm_pcus) >= 0) {
      lcSmPcus = brMoney(gmStMvtoCSM[i].sm_pcus);
    }

    if (parseFloat(gmStMvtoCSM[i].sm_qtde * gmStMvtoCSM[i].sm_pcus) >= 0) {
      lcSmTota = brMoney(gmStMvtoCSM[i].sm_qtde * gmStMvtoCSM[i].sm_pcus);
    }

    lnSlQtde += parseFloat(gmStMvtoCSM[i].sm_qtde);
    lnSlPcus += parseFloat(gmStMvtoCSM[i].sm_qtde * gmStMvtoCSM[i].sm_pcus);

    //prettier-ignore
    lcStLcto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" +
            "código: " + gmStMvtoCSM[i].ce_codi.trim().toUpperCase() + " <br />" +
            gmStMvtoCSM[i].ce_deno.trim().toUpperCase() + " " + gmStMvtoCSM[i].ce_espt.trim().toUpperCase() +
          "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + gmStMvtoCSM[i].ce_unes.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brDecimal(gmStMvtoCSM[i].sm_qtde) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lcSmPcus + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lcSmTota + "</span>" +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcStHtml =
        "<html>" +
          "<body>" + 
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'>" + 
                  "solicitação de transferência " + lnIdStrf.toString() +
                "</td>" +
                "<td style='border: 1px solid black; text-align: center; width: 33%;'>" +
                  "<img src='http://www.atscs.com.br/images/empresas/gre.png' style='width: 150px;' />" +
                "</td>" +
                "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'>" + 
                  "emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>data da solicitação de transferência</span> <br />" +
                  "<span style='font-size: small;'>" + jsonDate(gmStMvtoCSM[0].sl_data) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
                  "<span style='font-size: x-small;'>obra da solicitação de transferência</span> <br />" +
                  "<span style='font-size: small;'>" + gmStMvtoCSM[0].cl_fant.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
                  "<span style='font-size: x-small;'>data da necessidade</span> <br />" +
                  "<span style='font-size: small;'>" + jsonDate(gmStMvtoCSM[0].sl_dnec) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;' colspan='2'>" +
                  "<span style='font-size: x-small;'>situação da solicitação de transferência</span> <br />" +
                  "<span style='font-size: small;'>" + gmStMvtoCSM[0].st_deno.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;' colspan='2'>" +
                  "<span style='font-size: x-small;'>usuário da aprovação da solicitação de transferência</span> <br />" +
                  "<span style='font-size: small;'>" + gmStMvtoCSM[0].ap_user.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
                  "<span style='font-size: x-small;'>data da aprovação da solicitação de transferência</span> <br />" +
                  "<span style='font-size: small;'>" + jsonDate(gmStMvtoCSM[0].ap_data) + "</span>" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
                  "<span style='font-size: x-small;'>usuário do envio</span> <br />" +
                  "<span style='font-size: small;'>" + gmStMvtoCSM[0].sl_uenv.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
                  "<span style='font-size: x-small;'>data do envio</span> <br />" +
                  "<span style='font-size: small;'>" + jsonDate(gmStMvtoCSM[0].sl_denv) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
                  "<span style='font-size: x-small;'>data da previsão de entrega</span> <br />" +
                  "<span style='font-size: small;'>" + jsonDate(gmStMvtoCSM[0].sl_dpre) + "</span>" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;' colspan='4'>" +
                  "<span style='font-size: x-small;'>observação</span> <br />" +
                  "<span style='font-size: small;'>" + gmStMvtoCSM[0].sl_obse.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<span style='font-size: large;'>valores</span>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>quantidade total</span> <br />" +
                  "<span style='font-size: small;'>" + brDecimal(lnSlQtde) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>custo total</span> <br />" +
                  "<span style='font-size: small;'>" + brMoney(lnSlPcus) + "</span>" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<span style='font-size: large;'>itens enviados</span>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "item" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "un." +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "qtde" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "custo" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "total" +
                "</td>" +
              "</tr>" +
              lcStLcto +
            "</table>" +
          "</body>" +
        "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcStHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "solicitacao_transferencia_" + lnIdStrf.toString() + ".pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcStHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "solicitacao_transferencia_" + lnIdStrf.toString() + ".pdf",
                    lo64Base,
                    "application/pdf",
                    lcShTitu,
                    lcShSbti
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcStHtml, {
        documentSize: "A4",
        type: "share",
        fileName: "solicitacao_transferencia_" + lnIdStrf.toString() + ".pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    if (lnRdVisu > 0) {
      visualizaImpressao(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        "solicitacao_transferencia_" + lnIdStrf.toString(),
        lcStHtml
      );
    } else {
      impressaoPdf(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        "solicitacao_transferencia_" + lnIdStrf.toString(),
        lcStHtml
      );
    }
  }
}

function finalizaSolicitacaoTransferenciaCSM() {
  var lmStMvto = [],
    lmNrMvto = [],
    lmRcMvto = [];
  var loStMvrc = {};
  var lnIdStrf = 0;
  var llRcNenv = true;

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    alerta("solicitação de transferência inválida", "alerta");

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "deseja finalizar solicitação de transferência ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
          onClick: function () {},
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            //monta arrays com qtdes a mais e a menos dos itens solicitados, os arrays são lmNrMvto( qtdes não recebidos ) e lmRcMvto( qtdes recebidas a mais ) e depois tem que atualizar CestStMvto com lmStMvto
            for (var i = 0; i < gmStMvtoCSM.length; i++) {
              for (var j = 0; j < gmStMvrcCSM.length; j++) {
                if (
                  parseInt(gmStMvtoCSM[i].id_cest) ==
                  parseInt(gmStMvrcCSM[j].id_cest)
                ) {
                  loStMvrc = JSON.parse(JSON.stringify(gmStMvrcCSM[j]));

                  if (
                    parseFloat(gmStMvrcCSM[j].sm_qtde) <
                    parseFloat(gmStMvtoCSM[i].sm_qtde)
                  ) {
                    lmStMvto.push(gmStMvrcCSM[j]);

                    loStMvrc.sm_qtde =
                      parseFloat(gmStMvtoCSM[i].sm_qtde) -
                      parseFloat(gmStMvrcCSM[j].sm_qtde);

                    lmNrMvto.push(loStMvrc);
                  } else if (
                    parseFloat(gmStMvtoCSM[i].sm_qtde) <
                    parseFloat(gmStMvrcCSM[j].sm_qtde)
                  ) {
                    lmStMvto.push(gmStMvtoCSM[j]);

                    loStMvrc.sm_qtde =
                      parseFloat(gmStMvrcCSM[j].sm_qtde) -
                      parseFloat(gmStMvtoCSM[i].sm_qtde);

                    lmRcMvto.push(loStMvrc);
                  } else {
                    lmStMvto.push(gmStMvrcCSM[j]);
                  }

                  break;
                }
              }
            }

            for (var i = 0; i < gmStMvrcCSM.length; i++) {
              llRcNenv = true;

              for (var j = 0; j < gmStMvtoCSM.length; j++) {
                if (
                  parseInt(gmStMvrcCSM[i].id_cest) ==
                  parseInt(gmStMvtoCSM[j].id_cest)
                ) {
                  llRcNenv = false;
                }
              }

              if (llRcNenv) {
                lmRcMvto.push(gmStMvrcCSM[i]);
              }
            }

            app.dialog.preloader("finalizando...");

            if (lmRcMvto.length == 0 && lmNrMvto.length == 0) {
              atualizaFinalizaSolicitacaoTransferenciaCSM();
            } else if (lmRcMvto.length > 0 && lmNrMvto.length == 0) {
              insereSolicitacaoTransferenciaRecebidaNaoEnviadaCSM(
                lmRcMvto,
                lmStMvto
              );
            } else if (lmRcMvto.length > 0 && lmNrMvto.length > 0) {
              insereSolicitacaoTransferenciaRecebidaNaoEnviadaNaoRecebidaCSM(
                lmRcMvto,
                lmNrMvto,
                lmStMvto
              );
            } else if (lmRcMvto.length == 0 && lmNrMvto.length > 0) {
              insereSolicitacaoTransferenciaNaoRecebidaCSM(lmNrMvto, lmStMvto);
            }
          },
        },
      ],
    })
    .open();
}

function atualizaEnviaSolicitacaoTransferenciaCSM() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdStrf = 0;

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    alerta("solicitação de transferência inválida", "alerta");

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "deseja enviar solicitação de transferência ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
          onClick: function () {},
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            lmWkIsql = [
              {
                pa_nome: "lcIdUser",
                pa_tipo: "VarChar",
                pa_valo: goCdUser.id_user.trim().toUpperCase(),
              },
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=atualizaEnviaSolicitacaoTransferencia",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].sl_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].sl_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (loApErro) {}

                try {
                  if (lmWkRsql.length > 0) {
                    limpaCamposCSM();
                    pesquisaSolicitacoesTransferenciaCSL();

                    notificacao(
                      "solicitação de transferência enviada",
                      "sucesso"
                    );

                    goMnView.router.back();
                  }
                } catch (loApErro) {}
              },
              error: function (jqXHR, textStatus, err) {},
            });
          },
        },
      ],
    })
    .open();
}

function pesquisaCadastrosEstoqueCSM() {
  var lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdAlmx", pa_tipo: "Int", pa_valo: 1 },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaCadastrosEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmCdCadtCSM = lmWkRsql;
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function deletaSolicitacaoTransferenciaCSM() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdStrf = 0;

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    limpaCamposCSM();

    goMnView.router.back();

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "deseja excluir solicitação de transferência ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
          onClick: function () {},
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            lmWkIsql = [
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=deletaSolicitacaoTransferencia",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].sl_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].sl_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (loApErro) {}

                try {
                  if (lmWkRsql.length == 0) {
                    limpaCamposCSM();
                    pesquisaSolicitacoesTransferenciaCSL();

                    notificacao(
                      "solicitação de transferência excluída",
                      "sucesso"
                    );

                    goMnView.router.back();
                  }
                } catch (loApErro) {}
              },
              error: function (jqXHR, textStatus, err) {},
            });
          },
        },
      ],
    })
    .open();
}

function deletaCadastroEstoqueSolicitacaoTransferenciaCSM(lcStMvto) {
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loTaObse = document.getElementById("txaObseCSM");
  var loStMvto = JSON.parse(unescape(lcStMvto));
  var lcWkIsql = "",
    lcSlObse = "",
    lcSlDnec = "";
  var lmWkIsql = [];
  var lnIdStrf = 0,
    lnIdClie = 0,
    lnIdCest = 0;
  var ldDtHoje = new Date(),
    ldDtDnec = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  if (gmStMvtoCSM.length <= 1) {
    deletaSolicitacaoTransferenciaCSM();

    return;
  }

  try {
    if (parseInt(gmStMvtoCSM[0].id_strf) > 0) {
      lnIdStrf = parseInt(gmStMvtoCSM[0].id_strf);
    }
  } catch (error) {}

  if (lnIdStrf == 0) {
    return;
  }

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    if (loDtDnec.value.toString().trim().length > 0) {
      ldDtDnec = htmlDataParaObjetoData(loDtDnec.value);
      lcSlDnec = objetoDataParaStringSqlData(ldDtDnec);
    }
  } catch (error) {}

  if (lcSlDnec.trim().length == 0) {
    app.input.validate(loDtDnec);

    return;
  }

  if (ldDtDnec < ldDtHoje) {
    return;
  }

  try {
    if (parseInt(loStMvto.id_cest) > 0) {
      lnIdCest = parseInt(loStMvto.id_cest);
    }
  } catch (error) {}

  if (lnIdCest == 0) {
    return;
  }

  if (loTaObse.value.toString().trim().length > 0) {
    lcSlObse = loTaObse.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldSlDnec", pa_tipo: "SmallDatetime", pa_valo: lcSlDnec },
    { pa_nome: "lcSlObse", pa_tipo: "VarChar", pa_valo: lcSlObse },
    { pa_nome: "lnIdCest", pa_tipo: "Int", pa_valo: lnIdCest },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCadastroEstoqueCSM();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=deletaCadastroEstoqueSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        consultaSolicitacaoTransferenciaCSM(lmWkRsql);
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function montaCadastrosEstoqueSolicitacaoTransferenciaCSM(llStEnvi) {
  var loUlCest = document.getElementById("uulCestCSM");
  var loDvQtot = document.getElementById("divQtotCSM");
  var loDvVtot = document.getElementById("divVtotCSM");
  var lcStMvto = "",
    lcSmPcus = "",
    lcSmTota = "",
    lcSmDele = "",
    lcSmDica = "",
    lcSmMotv = "",
    lcSmJust = "",
    lcSmEdit = "",
    lcCrJust = "",
    lcCeQmax = "",
    lcCrQmax = "";
  var lnSlQtde = 0,
    lnSlPcus = 0,
    lnCeQmax = 0;

  if (gmStMvtoCSM.length > 0) {
    if (llStEnvi) {
      lcStMvto += "<li class='item-divider'>itens enviados</li>";
    } else {
      lcStMvto += "<li class='item-divider'>itens da solicitação</li>";
    }

    if (parseInt(gmStMvtoCSM[0].id_situ) == 1) {
      if (isMobile()) {
        if (gcSiOper == "iOS") {
          lcSmDica = "CLIQUE NO ITEM PARA EDITAR";
        } else {
          lcSmDica = "CLIQUE E SEGURE NO ITEM PARA EDITAR";
        }
      } else {
        lcSmDica = "CLIQUE COM O BOTÃO DIREITO DO MOUSE NO ITEM PARA EDITAR";
      }

      //prettier-ignore
      lcStMvto += 
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title'>dica</div>" +
              "<div class='item-after'>" + lcSmDica.trim().toUpperCase() + "</div>" +
            "</div>" +
          "</div>" +
        "</li>";
    }
  }

  for (var i = 0; i < gmStMvtoCSM.length; i++) {
    lcSmDele = "";
    lcSmEdit = "";
    lcSmJust = "";
    lcCrJust = "";
    lcSmMotv = "";
    lcSmPcus = "";
    lcSmTota = "";
    lcCeQmax = "";
    lcCrQmax = "";
    lnCeQmax = 0;

    if (gmStMvtoCSM[i].sm_just.trim().length > 0) {
      lcCrJust = " style='color: rgb( 255, 255, 196 );'";

      //prettier-ignore
      lcSmJust = 
        "<li class='item-content item-input'>" +
          "<div class='item-inner'>" +
            "<div class='item-title item-label'" + lcCrJust + ">justificativa da alteração</div>" +
            "<div class='item-input-wrap'>" + 
              "<textarea readonly" + lcCrJust + ">" +
                gmStMvtoCSM[i].sm_just.trim().toUpperCase() +
              "</textarea>" + 
            "</div>" +
          "</div>" +
        "</li>";
    }

    if (gmStMvtoCSM[i].sm_motv.trim().length > 0) {
      //prettier-ignore
      lcSmMotv = 
        "<li class='item-content item-input'>" +
          "<div class='item-inner'>" +
            "<div class='item-title item-label'" + lcCrJust + ">motivo da devolução</div>" +
            "<div class='item-input-wrap'>" + 
              "<textarea readonly" + lcCrJust + ">" +
                gmStMvtoCSM[i].sm_motv.trim().toUpperCase() +
              "</textarea>" + 
            "</div>" +
          "</div>" +
        "</li>";
    }

    //prettier-ignore
    if (parseInt(gmStMvtoCSM[i].id_situ) == 1) {
      lcSmDele = 
        "<div class='item-media' onclick='deletaCadastroEstoqueSolicitacaoTransferenciaCSM(\"" + escape(JSON.stringify(gmStMvtoCSM[i])) + "\");'>" +
          "<i class='f7-icons text-color-red'>delete_round_fill</i>" +
        "</div>";

        
      if (isMobile() && gcSiOper == "iOS") {
        lcSmEdit = " onclick='consultaCadastroEstoqueCSM(\"" + escape(JSON.stringify(gmStMvtoCSM[i])) + "\");'"; 
      } else {
        lcSmEdit = " oncontextmenu='consultaCadastroEstoqueCSM(\"" + escape(JSON.stringify(gmStMvtoCSM[i])) + "\");'"; 
      }
      
      if (parseFloat(gmStMvtoCSM[i].ce_qmax) > 0) {
        lnCeQmax = parseFloat(gmStMvtoCSM[i].ce_qmax);
      }
      
      if (parseFloat(gmStMvtoCSM[i].cq_qtde) > 0) {
        lnCeQmax = parseFloat(gmStMvtoCSM[i].cq_qtde);
      }

      if (lnCeQmax > 0) {
        lcCeQmax = 
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">quantidade máxima permitida em estoque na obra</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + brDecimal(lnCeQmax) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">quantidade em estoque na obra</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + brDecimal(gmStMvtoCSM[i].en_qtde - gmStMvtoCSM[i].sa_qtde - gmStMvtoCSM[i].de_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>";

        if (lnCeQmax < (parseFloat(gmStMvtoCSM[i].en_qtde) - parseFloat(gmStMvtoCSM[i].sa_qtde) - parseFloat(gmStMvtoCSM[i].de_qtde) + parseFloat(gmStMvtoCSM[i].sm_qtde))) {
          lcCrQmax = " style='background-color: rgba( 255, 0, 0, 0.25 );'";
        }
      }
    }

    lnSlQtde += parseFloat(gmStMvtoCSM[i].sm_qtde);
    lnSlPcus += parseFloat(gmStMvtoCSM[i].sm_qtde * gmStMvtoCSM[i].sm_pcus);

    if (parseFloat(gmStMvtoCSM[i].sm_pcus) > 0) {
      lcSmPcus = brMoney(gmStMvtoCSM[i].sm_pcus);
    }

    if (parseFloat(gmStMvtoCSM[i].sm_qtde * gmStMvtoCSM[i].sm_pcus) > 0) {
      lcSmTota = brMoney(gmStMvtoCSM[i].sm_qtde * gmStMvtoCSM[i].sm_pcus);
    }

    //prettier-ignore
    lcStMvto +=
      "<li class='accordion-item'" + lcSmEdit + ">" +
        "<a href='#' class='item-content item-link'" + lcCrQmax + ">" +
          lcSmDele +
          "<div class='item-inner'>" +
            "<div class='item-title'><b" + lcCrJust + ">" + gmStMvtoCSM[i].ce_deno.trim().toUpperCase() + " " + gmStMvtoCSM[i].ce_espt.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b" + lcCrJust + ">" + gmStMvtoCSM[i].sm_qtde.toString().trim() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul" + lcCrQmax + ">" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">código do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmStMvtoCSM[i].ce_codi.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">denominação do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmStMvtoCSM[i].ce_deno.trim().toUpperCase() + " " + gmStMvtoCSM[i].ce_espt.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">unidade do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmStMvtoCSM[i].ce_unes.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcCeQmax +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">quantidade solicitada do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + brDecimal(gmStMvtoCSM[i].sm_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">custo do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + lcSmPcus + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">total do custo do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + lcSmTota + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcSmJust +
              lcSmMotv +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  loUlCest.innerHTML = lcStMvto;

  if (lnSlQtde > 0) {
    loDvQtot.innerHTML = brDecimal(lnSlQtde);
  }

  if (lnSlPcus > 0) {
    loDvVtot.innerHTML = brMoney(lnSlPcus);
  }
}

function consultaCustoCadastroEstoqueCSM() {
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var loDvPcus = document.getElementById("divPcusCSM");
  var loDvTcus = document.getElementById("divTcusCSM");
  var lnIdCest = 0,
    lnIdAlmx = 1,
    lnCePcus = 0,
    lnSmQtde = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);
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

      goCdCadtCSM["ce_pcus"] = lnCePcus;

      if (lnCePcus > 0) {
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
    error: function (jqXHR, textStatus, err) {
      goCdCadtCSM["ce_pcus"] = lnCePcus;

      if (lnCePcus > 0) {
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
  });
}

function consultaSaldoEstoqueEmpenhadoCSM() {
  var loDvQemp = document.getElementById("divQempCSM");
  var loDvQenv = document.getElementById("divQenvCSM");
  var loDvQvir = document.getElementById("divQvirCSM");
  var loDvQesd = document.getElementById("divQesdCSM");
  var lnIdCest = 0,
    lnCeQest = 0,
    lnCeQemp = 0,
    lnCeQenv = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);
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

      goCdCadtCSM["ce_qemp"] = lnCeQemp;
      goCdCadtCSM["ce_qenv"] = lnCeQenv;

      if (lnCeQemp > 0) {
        loDvQemp.innerHTML = brDecimal(lnCeQemp);
      }

      if (lnCeQenv > 0) {
        loDvQenv.innerHTML = brDecimal(lnCeQenv);
      }

      try {
        if (parseFloat(goCdCadtCSM.ce_qest) > 0) {
          lnCeQest = parseFloat(goCdCadtCSM.ce_qest);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
    error: function (jqXHR, textStatus, err) {
      goCdCadtCSM["ce_qemp"] = lnCeQemp;
      goCdCadtCSM["ce_qenv"] = lnCeQenv;

      if (lnCeQemp > 0) {
        loDvQemp.innerHTML = brDecimal(lnCeQemp);
      }

      if (lnCeQenv > 0) {
        loDvQenv.innerHTML = brDecimal(lnCeQenv);
      }

      try {
        if (parseFloat(goCdCadtCSM.ce_qest) > 0) {
          lnCeQest = parseFloat(goCdCadtCSM.ce_qest);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
  });
}

function consultaSaldoEstoqueCSM() {
  var loDvQest = document.getElementById("divQestCSM");
  var loDvQvir = document.getElementById("divQvirCSM");
  var loDvQesd = document.getElementById("divQesdCSM");
  var lnIdCest = 0,
    lnIdAlmx = 1,
    lnCeQest = 0,
    lnCeQemp = 0,
    lnCeQenv = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goCdCadtCSM.id_cest) > 0) {
      lnIdCest = parseInt(goCdCadtCSM.id_cest);
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

      goCdCadtCSM["ce_qest"] = lnCeQest;

      if (lnCeQest > 0) {
        loDvQest.innerHTML = brDecimal(lnCeQest);
      }

      try {
        if (parseFloat(goCdCadtCSM.ce_qemp) > 0) {
          lnCeQemp = parseFloat(goCdCadtCSM.ce_qemp);
        }
      } catch (error) {}

      try {
        if (parseFloat(goCdCadtCSM.ce_qenv) > 0) {
          lnCeQenv = parseFloat(goCdCadtCSM.ce_qenv);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
    error: function (jqXHR, textStatus, err) {
      goCdCadtCSM["ce_qest"] = lnCeQest;

      goCdCadtCSM["ce_qest"] = lnCeQest;

      if (lnCeQest > 0) {
        loDvQest.innerHTML = brDecimal(lnCeQest);
      }

      try {
        if (parseFloat(goCdCadtCSM.ce_qemp) > 0) {
          lnCeQemp = parseFloat(goCdCadtCSM.ce_qemp);
        }
      } catch (error) {}

      try {
        if (parseFloat(goCdCadtCSM.ce_qenv) > 0) {
          lnCeQenv = parseFloat(goCdCadtCSM.ce_qenv);
        }
      } catch (error) {}

      loDvQvir.innerHTML = brDecimal(lnCeQest - lnCeQemp - lnCeQenv);
      loDvQesd.innerHTML = brDecimal(lnCeQest - lnCeQenv);
    },
  });
}

function consultaCSM(loCdCadt) {
  var loDvCodi = document.getElementById("divCodiCSM");
  var loDvDeno = document.getElementById("divDenoCSM");
  var loDvUnid = document.getElementById("divUnidCSM");
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var loDvPcus = document.getElementById("divPcusCSM");
  var loTaMotv = document.getElementById("txaMotvCSM");

  if (loCdCadt.id_parm.trim().toUpperCase() == "CE_CODI") {
    limpaCamposCadastroEstoqueCSM();

    goCdCadtCSM = loCdCadt;

    loDvCodi.innerHTML = goCdCadtCSM.ce_codi.trim().toUpperCase();
    loDvDeno.innerHTML =
      goCdCadtCSM.ce_deno.trim().toUpperCase() +
      " " +
      goCdCadtCSM.ce_espt.trim().toUpperCase();
    loDvUnid.innerHTML = goCdCadtCSM.ce_unes.trim().toUpperCase();

    consultaSaldoEstoqueCSM();
    consultaSaldoEstoqueEmpenhadoCSM();

    if (parseFloat(goCdCadtCSM.ce_vcus) > 0) {
      loDvPcus.innerHTML = brMoney(goCdCadtCSM.ce_vcus);
    }

    consultaCustoCadastroEstoqueCSM();

    try {
      if (gmStMvrcCSM.length > 0) {
        for (var i = 0; i < gmStMvrcCSM.length; i++) {
          if (
            parseInt(gmStMvrcCSM[i].id_cest) == parseInt(goCdCadtCSM.id_cest)
          ) {
            if (parseFloat(gmStMvrcCSM[i].sm_qtde) >= 0) {
              loNrQtde.value = parseFloat(gmStMvrcCSM[i].sm_qtde);

              app.input.validate(loNrQtde);
            }

            if (gmStMvrcCSM[i].sm_motv.trim().length > 0) {
              loTaMotv.value = gmStMvrcCSM[i].sm_motv.trim().toUpperCase();

              app.input.validate(loTaMotv);
            }

            break;
          }
        }
      } else {
        for (var i = 0; i < gmStMvtoCSM.length; i++) {
          if (
            parseInt(gmStMvtoCSM[i].id_cest) == parseInt(goCdCadtCSM.id_cest)
          ) {
            if (parseFloat(gmStMvtoCSM[i].sm_qtde) >= 0) {
              loNrQtde.value = parseFloat(gmStMvtoCSM[i].sm_qtde);

              app.input.validate(loNrQtde);
            }

            break;
          }
        }
      }
    } catch (error) {}
  }
}

function consultaCadastroEstoqueCSM(lcStMvto) {
  var loStMvto = JSON.parse(unescape(lcStMvto));
  var lmWkIsql = [];
  var lcWkIsql = "";
  var lnIdCest = 0;

  try {
    if (parseInt(loStMvto.id_cest) > 0) {
      lnIdCest = parseInt(loStMvto.id_cest);
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

  limpaCamposCadastroEstoqueCSM();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaCadastroEstoque",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        try {
          if (lmWkRsql.length > 0) {
            lmWkRsql[0]["id_parm"] = "ce_codi";

            consultaCSM(lmWkRsql[0]);
          }
        } catch (error) {}
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function montaCadastrosEstoqueSolicitacaoTransferenciaRecebidaCSM() {
  var loUlCerc = document.getElementById("uulCercCSM");
  var loDvQtrc = document.getElementById("divQtrcCSM");
  var loDvVtrc = document.getElementById("divVtrcCSM");
  var lcStMvto = "",
    lcSmPcus = "",
    lcSmTota = "",
    lcSmMotv = "",
    lcSmJust = "",
    lcCrJust = "";
  var lnSlQtde = 0,
    lnSlPcus = 0;

  lcStMvto = "<li class='item-divider'>itens recebidos</li>";

  for (var i = 0; i < gmStMvrcCSM.length; i++) {
    lcSmJust = "";
    lcCrJust = "";
    lcSmMotv = "";
    lcSmPcus = "";
    lcSmTota = "";

    if (gmStMvrcCSM[i].sm_just.trim().length > 0) {
      lcCrJust = " style='color: rgb( 255, 255, 196 );'";

      //prettier-ignore
      lcSmJust = 
        "<li class='item-content item-input'>" +
          "<div class='item-inner'>" +
            "<div class='item-title item-label'" + lcCrJust + ">justificativa da alteração</div>" +
            "<div class='item-input-wrap'>" + 
              "<textarea readonly" + lcCrJust + ">" +
                gmStMvrcCSM[i].sm_just.trim().toUpperCase() +
              "</textarea>" + 
            "</div>" +
          "</div>" +
        "</li>";
    }

    if (gmStMvrcCSM[i].sm_motv.trim().length > 0) {
      //prettier-ignore
      lcSmMotv = 
        "<li class='item-content item-input'>" +
          "<div class='item-inner'>" +
            "<div class='item-title item-label'" + lcCrJust + ">motivo da alteração</div>" +
            "<div class='item-input-wrap'>" + 
              "<textarea readonly" + lcCrJust + ">" +
                gmStMvrcCSM[i].sm_motv.trim().toUpperCase() +
              "</textarea>" + 
            "</div>" +
          "</div>" +
        "</li>";
    }

    lnSlQtde += parseFloat(gmStMvrcCSM[i].sm_qtde);
    lnSlPcus += parseFloat(gmStMvrcCSM[i].sm_qtde * gmStMvrcCSM[i].sm_pcus);

    if (parseFloat(gmStMvrcCSM[i].sm_pcus) >= 0) {
      lcSmPcus = brMoney(gmStMvrcCSM[i].sm_pcus);
    }

    if (parseFloat(gmStMvrcCSM[i].sm_qtde * gmStMvrcCSM[i].sm_pcus) >= 0) {
      lcSmTota = brMoney(gmStMvrcCSM[i].sm_qtde * gmStMvrcCSM[i].sm_pcus);
    }

    //prettier-ignore
    lcStMvto +=
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='consultaCadastroEstoqueCSM(\"" + escape(JSON.stringify(gmStMvrcCSM[i])) + "\");'>" +
            "<i class='material-icons' style='color: " + corTema() + "'>edit</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b" + lcCrJust + ">" + gmStMvrcCSM[i].ce_deno.trim().toUpperCase() + " " + gmStMvrcCSM[i].ce_espt.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b" + lcCrJust + ">" + gmStMvrcCSM[i].sm_qtde.toString().trim() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">código do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmStMvrcCSM[i].ce_codi.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">denominação do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmStMvrcCSM[i].ce_deno.trim().toUpperCase() + " " + gmStMvrcCSM[i].ce_espt.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">unidade do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + gmStMvrcCSM[i].ce_unes.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">quantidade do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + brDecimal(gmStMvrcCSM[i].sm_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">custo do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + lcSmPcus + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'" + lcCrJust + ">total do custo do item</div>" +
                    "<div class='item-after'" + lcCrJust + ">" + lcSmTota + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              lcSmJust +
              lcSmMotv +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  loUlCerc.innerHTML = lcStMvto;
  loDvQtrc.innerHTML = brDecimal(lnSlQtde);
  loDvVtrc.innerHTML = brMoney(lnSlPcus);
}

function consultaSolicitacaoTransferenciaCSM(lmStMvto) {
  var loDvMsnv = document.getElementById("divMsnvCSM");
  var loDvMsap = document.getElementById("divMsapCSM");
  var loAhWimp = document.getElementById("ahrWimpCSM");
  var loAhWvis = document.getElementById("ahrWvisCSM");
  var loAhMpdf = document.getElementById("ahrMpdfCSM");
  var loNrStrf = document.getElementById("nroStrfCSM");
  var loLiData = document.getElementById("lliDataCSM");
  var loDvData = document.getElementById("divDataCSM");
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loLiSitu = document.getElementById("lliSituCSM");
  var loDvSitu = document.getElementById("divSituCSM");
  var loLiApus = document.getElementById("lliApusCSM");
  var loDvApus = document.getElementById("divApusCSM");
  var loLiApdt = document.getElementById("lliApdtCSM");
  var loDvApdt = document.getElementById("divApdtCSM");
  var loLiUenv = document.getElementById("lliUenvCSM");
  var loDvUenv = document.getElementById("divUenvCSM");
  var loLiEnvi = document.getElementById("lliEnviCSM");
  var loDvEnvi = document.getElementById("divEnviCSM");
  var loLiUcon = document.getElementById("lliUconCSM");
  var loDvUcon = document.getElementById("divUconCSM");
  var loLiDcon = document.getElementById("lliDconCSM");
  var loDvDcon = document.getElementById("divDconCSM");
  var loLiPrev = document.getElementById("lliPrevCSM");
  var loDvPrev = document.getElementById("divPrevCSM");
  var loLiRecb = document.getElementById("lliRecbCSM");
  var loDvRecb = document.getElementById("divRecbCSM");
  var loTaObse = document.getElementById("txaObseCSM");
  var loLiJcon = document.getElementById("lliJconCSM");
  var loTaJcon = document.getElementById("txaJconCSM");
  var loLiJnap = document.getElementById("lliJnapCSM");
  var loTaJnap = document.getElementById("txaJnapCSM");
  var loLiCodi = document.getElementById("lliCodiCSM");
  var loLiDeno = document.getElementById("lliDenoCSM");
  var loLiUnid = document.getElementById("lliUnidCSM");
  var loLiQest = document.getElementById("lliQestCSM");
  var loLiQemp = document.getElementById("lliQempCSM");
  var loLiQenv = document.getElementById("lliQenvCSM");
  var loLiQvir = document.getElementById("lliQvirCSM");
  var loLiQesd = document.getElementById("lliQesdCSM");
  var loLiQtde = document.getElementById("lliQtdeCSM");
  var loLiPcus = document.getElementById("lliPcusCSM");
  var loLiTcus = document.getElementById("lliTcusCSM");
  var loLiMotv = document.getElementById("lliMotvCSM");
  var loDvAdcn = document.getElementById("divAdcnCSM");
  var loDvCerc = document.getElementById("divCercCSM");
  var loDvTorc = document.getElementById("divTorcCSM");
  var loDvVtrc = document.getElementById("divVtrcCSM");
  var lnIdSitu = 0;
  var lcSlDenv = "",
    lcSlDcon = "",
    lcSlDnec = "",
    lcApUser = "",
    lcSlDpre = "",
    lcSlDrec = "";
  var llStEnvi = false;

  limpaCamposCSM();
  pesquisaSolicitacoesTransferenciaCSL();

  try {
    if (lmStMvto.length > 0) {
      gmStMvtoCSM = JSON.parse(JSON.stringify(lmStMvto));

      lnIdSitu = parseInt(gmStMvtoCSM[0].id_situ);

      lcSlDenv = jsonDate(gmStMvtoCSM[0].sl_denv);
      lcSlDcon = jsonDate(gmStMvtoCSM[0].sl_dcon);
      lcSlDnec = jsonDate(gmStMvtoCSM[0].sl_dnec);
      lcApUser = gmStMvtoCSM[0].ap_user.trim().toUpperCase();
      lcSlDpre = jsonDate(gmStMvtoCSM[0].sl_dpre);
      lcSlDrec = jsonDate(gmStMvtoCSM[0].sl_drec);

      if (lnIdSitu == 36 && lcSlDenv.trim().length > 0) {
        gmStMvrcCSM = JSON.parse(JSON.stringify(lmStMvto));
      }

      if (lnIdSitu == 36) {
        if (lcSlDenv.trim().length > 0) {
          loDvMsnv.style.display = "none";
          loDvMsap.style.display = "";
          loLiJcon.style.display = "";
        } else {
          loDvMsnv.style.display = "none";
          loDvMsap.style.display = "none";
          loLiJcon.style.display = "none";
        }
      } else if (lnIdSitu == 3 || lnIdSitu == 38 || lnIdSitu == 35) {
        loDvMsnv.style.display = "none";
        loDvMsap.style.display = "none";
        loLiJcon.style.display = "none";
      }

      if (loDvMsap.style.display.toString().trim().length == 0) {
        if (isMobile()) {
          loAhWimp.style.display = "none";
          loAhWvis.style.display = "none";
          loAhMpdf.style.display = "";
        } else {
          loAhWimp.style.display = "";
          loAhWvis.style.display = "";
          loAhMpdf.style.display = "none";
        }
      }

      loNrStrf.value = parseInt(gmStMvtoCSM[0].id_strf);

      if (lnIdSitu != 1) {
        loLiData.style.display = "";

        loDvData.innerHTML = jsonDate(gmStMvtoCSM[0].sl_data);
      }

      for (var i = 0; i < loSlClie.length; i++) {
        if (
          parseInt(loSlClie.options[i].value) ==
          parseInt(gmStMvtoCSM[0].id_clie)
        ) {
          loSlClie.selectedIndex = i;

          break;
        }
      }

      if (lnIdSitu != 1) {
        loSlClie.disabled = true;
      }

      if (lcSlDnec.trim().length > 0) {
        loDtDnec.valueAsDate = stringDataParaObjetoData(lcSlDnec);

        app.input.validate(loDtDnec);
      }

      if (lnIdSitu != 1) {
        loDtDnec.disabled = true;

        loLiSitu.style.display = "";

        loDvSitu.innerHTML = gmStMvtoCSM[0].st_deno.trim().toUpperCase();
      }

      if (lcApUser.trim().length > 0) {
        loLiApus.style.display = "";

        loDvApus.innerHTML = lcApUser.trim().toUpperCase();

        loLiApdt.style.display = "";

        loDvApdt.innerHTML = jsonDate(gmStMvtoCSM[0].ap_data);
      }

      if (lcSlDenv.trim().length > 0) {
        loLiUenv.style.display = "";

        loDvUenv.innerHTML = gmStMvtoCSM[0].sl_uenv.trim().toUpperCase();

        loLiEnvi.style.display = "";

        loDvEnvi.innerHTML = lcSlDenv;
      }

      if (lcSlDcon.trim().length > 0) {
        loLiUcon.style.display = "";

        loDvUcon.innerHTML = gmStMvtoCSM[0].sl_ucon.trim().toUpperCase();

        loLiDcon.style.display = "";

        loDvDcon.innerHTML = lcSlDcon;

        loLiJcon.style.display = "";

        loTaJcon.value = gmStMvtoCSM[0].sl_jcon.trim().toUpperCase();

        loTaJcon.readOnly = true;
      }

      if (lcSlDpre.trim().length > 0) {
        loLiPrev.style.display = "";

        loDvPrev.innerHTML = lcSlDpre;
      }

      if (lcSlDrec.trim().length > 0) {
        loLiRecb.style.display = "";

        loDvRecb.innerHTML = lcSlDrec;
      }

      loTaObse.value = gmStMvtoCSM[0].sl_obse.trim().toUpperCase();

      if (lnIdSitu == 3) {
        loLiJnap.style.display = "";

        loTaJnap.value = gmStMvtoCSM[0].sl_jnap.trim().toUpperCase();
      }

      if (
        (lnIdSitu == 36 && lcSlDenv.trim().length == 0) ||
        lnIdSitu == 3 ||
        lnIdSitu == 38 ||
        lnIdSitu == 35
      ) {
        loLiCodi.style.display = "none";
        loLiDeno.style.display = "none";
        loLiUnid.style.display = "none";
        loLiQest.style.display = "none";
        loLiQemp.style.display = "none";
        loLiQenv.style.display = "none";
        loLiQvir.style.display = "none";
        loLiQesd.style.display = "none";
        loLiQtde.style.display = "none";
        loLiPcus.style.display = "none";
        loLiTcus.style.display = "none";
      }

      if (lnIdSitu == 36 && lcSlDenv.trim().length > 0) {
        loLiMotv.style.display = "";
      }

      if (
        (lnIdSitu == 36 && lcSlDenv.trim().length == 0) ||
        lnIdSitu == 3 ||
        lnIdSitu == 38 ||
        lnIdSitu == 35
      ) {
        loDvAdcn.style.display = "none";
      }

      if (lnIdSitu == 36 && lcSlDenv.trim().length > 0) {
        loDvCerc.style.display = "";

        montaCadastrosEstoqueSolicitacaoTransferenciaRecebidaCSM();

        loDvTorc.style.display = "";
        loDvVtrc.style.display = "";

        llStEnvi = true;
      }

      montaCadastrosEstoqueSolicitacaoTransferenciaCSM(llStEnvi);
    }
  } catch (error) {}
}

function pesquisaCadastrosEstoqueSolicitacaoTransferenciaCSM() {
  var loNrStrf = document.getElementById("nroStrfCSM");
  var lnIdStrf = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  if (loNrStrf.value.toString().trim().length == 0) {
    return;
  }

  try {
    if (parseInt(loNrStrf.value) > 0) {
      lnIdStrf = parseInt(loNrStrf.value);
    }
  } catch (error) {}

  limpaCamposCSM();

  if (lnIdStrf == 0) {
    alerta("código da solicitação de transferência inválido", "alerta");

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrf", pa_tipo: "Int", pa_valo: lnIdStrf },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaCadastrosEstoqueSolicitacaoTransferencia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      consultaSolicitacaoTransferenciaCSM(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaObrasCSM() {
  var loSlClie = document.getElementById("sltClieCSM");
  var lcSlRsql = "<option value='0'></option>",
    lcWkIsql = "",
    lcSlSlct = "";
  var lmWkIsql = [];
  var lnIdClie = 0,
    lnIdSitu = 0;

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlClie.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObras",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseInt(gmStMvtoCSM[0].id_clie) > 0) {
          lnIdClie = parseInt(gmStMvtoCSM[0].id_clie);
          lnIdSitu = parseInt(gmStMvtoCSM[0].id_situ);
        }
      } catch (error) {}

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lcSlSlct = "";

          if (parseInt(lmWkRsql[i].id_clie) == lnIdClie) {
            lcSlSlct = " selected";
          }

          if (lmWkRsql[i].cl_fant.trim().toUpperCase().indexOf("REAL") < 0) {
            //prettier-ignore
            lcSlRsql += "<option value='" + lmWkRsql[i].id_clie.toString().trim() + "'" + lcSlSlct + ">" + lmWkRsql[i].cl_fant.toUpperCase().trim() + "</option>";
          }
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcSlRsql;

      if (lnIdSitu != 1 && lnIdSitu != 0) {
        loSlClie.disabled = true;
      }
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.innerHTML = lcSlRsql;
    },
  });
}

function limpaCamposCadastroEstoqueCSM() {
  var loDvCodi = document.getElementById("divCodiCSM");
  var loDvDeno = document.getElementById("divDenoCSM");
  var loDvUnid = document.getElementById("divUnidCSM");
  var loDvQest = document.getElementById("divQestCSM");
  var loDvQemp = document.getElementById("divQempCSM");
  var loDvQenv = document.getElementById("divQenvCSM");
  var loDvQvir = document.getElementById("divQvirCSM");
  var loDvQesd = document.getElementById("divQesdCSM");
  var loNrQtde = document.getElementById("nroQtdeCSM");
  var loDvPcus = document.getElementById("divPcusCSM");
  var loDvTcus = document.getElementById("divTcusCSM");
  var loTaMotv = document.getElementById("txaMotvCSM");

  goCdCadtCSM = {};

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

  loTaMotv.value = "";
}

function limpaCamposCSM() {
  var loDvMsnv = document.getElementById("divMsnvCSM");
  var loDvMsap = document.getElementById("divMsapCSM");
  var loAhWimp = document.getElementById("ahrWimpCSM");
  var loAhWvis = document.getElementById("ahrWvisCSM");
  var loAhMpdf = document.getElementById("ahrMpdfCSM");
  var loNrStrf = document.getElementById("nroStrfCSM");
  var loLiData = document.getElementById("lliDataCSM");
  var loDvData = document.getElementById("divDataCSM");
  var loSlClie = document.getElementById("sltClieCSM");
  var loDtDnec = document.getElementById("datDnecCSM");
  var loLiSitu = document.getElementById("lliSituCSM");
  var loDvSitu = document.getElementById("divSituCSM");
  var loLiApus = document.getElementById("lliApusCSM");
  var loDvApus = document.getElementById("divApusCSM");
  var loLiApdt = document.getElementById("lliApdtCSM");
  var loDvApdt = document.getElementById("divApdtCSM");
  var loLiUenv = document.getElementById("lliUenvCSM");
  var loDvUenv = document.getElementById("divUenvCSM");
  var loLiEnvi = document.getElementById("lliEnviCSM");
  var loDvEnvi = document.getElementById("divEnviCSM");
  var loLiUcon = document.getElementById("lliUconCSM");
  var loDvUcon = document.getElementById("divUconCSM");
  var loLiDcon = document.getElementById("lliDconCSM");
  var loDvDcon = document.getElementById("divDconCSM");
  var loLiPrev = document.getElementById("lliPrevCSM");
  var loDvPrev = document.getElementById("divPrevCSM");
  var loLiRecb = document.getElementById("lliRecbCSM");
  var loDvRecb = document.getElementById("divRecbCSM");
  var loTaObse = document.getElementById("txaObseCSM");
  var loLiJcon = document.getElementById("lliJconCSM");
  var loTaJcon = document.getElementById("txaJconCSM");
  var loLiJnap = document.getElementById("lliJnapCSM");
  var loTaJnap = document.getElementById("txaJnapCSM");
  var loLiCodi = document.getElementById("lliCodiCSM");
  var loLiDeno = document.getElementById("lliDenoCSM");
  var loLiUnid = document.getElementById("lliUnidCSM");
  var loLiQest = document.getElementById("lliQestCSM");
  var loLiQemp = document.getElementById("lliQempCSM");
  var loLiQenv = document.getElementById("lliQenvCSM");
  var loLiQvir = document.getElementById("lliQvirCSM");
  var loLiQesd = document.getElementById("lliQesdCSM");
  var loLiQtde = document.getElementById("lliQtdeCSM");
  var loLiPcus = document.getElementById("lliPcusCSM");
  var loLiTcus = document.getElementById("lliTcusCSM");
  var loLiMotv = document.getElementById("lliMotvCSM");
  var loDvAdcn = document.getElementById("divAdcnCSM");
  var loDvCerc = document.getElementById("divCercCSM");
  var loUlCerc = document.getElementById("uulCercCSM");
  var loDvTorc = document.getElementById("divTorcCSM");
  var loDvQtrc = document.getElementById("divQtrcCSM");
  var loDvVtrc = document.getElementById("divVtrcCSM");
  var loUlCest = document.getElementById("uulCestCSM");
  var loDvQtot = document.getElementById("divQtotCSM");
  var loDvVtot = document.getElementById("divVtotCSM");

  gmStMvtoCSM = [];
  gmStMvrcCSM = [];

  loDvMsnv.style.display = "";
  loDvMsap.style.display = "none";
  loAhWimp.style.display = "";
  loAhWvis.style.display = "";
  loAhMpdf.style.display = "";

  loNrStrf.value = "";

  loLiData.style.display = "none";

  loDvData.innerHTML = "";

  loSlClie.disabled = false;

  loSlClie.selectedIndex = 0;

  loDtDnec.disabled = false;

  loDtDnec.value = "";

  loLiSitu.style.display = "none";

  loDvSitu.innerHTML = "";

  loLiApus.style.display = "none";

  loDvApus.innerHTML = "";

  loLiApdt.style.display = "none";

  loDvApdt.innerHTML = "";

  loLiUenv.style.display = "none";

  loDvUenv.innerHTML = "";

  loLiEnvi.style.display = "none";

  loDvEnvi.innerHTML = "";

  loLiUcon.style.display = "none";

  loDvUcon.innerHTML = "";

  loLiDcon.style.display = "none";

  loDvDcon.innerHTML = "";

  loLiPrev.style.display = "none";

  loDvPrev.innerHTML = "";

  loLiRecb.style.display = "none";

  loDvRecb.innerHTML = "";

  loTaObse.value = "";

  loLiJcon.style.display = "none";

  loTaJcon.value = "";

  loTaJcon.readOnly = false;

  loLiJnap.style.display = "none";

  loTaJnap.value = "";

  loLiCodi.style.display = "";
  loLiDeno.style.display = "";
  loLiUnid.style.display = "";
  loLiQest.style.display = "";
  loLiQemp.style.display = "";
  loLiQenv.style.display = "";
  loLiQvir.style.display = "";
  loLiQesd.style.display = "";
  loLiQtde.style.display = "";
  loLiPcus.style.display = "";
  loLiTcus.style.display = "";
  loLiMotv.style.display = "none";
  loDvAdcn.style.display = "";

  limpaCamposCadastroEstoqueCSM();

  loDvCerc.style.display = "none";

  loUlCerc.innerHTML = "";

  loDvTorc.style.display = "none";

  loDvQtrc.innerHTML = "";
  loDvVtrc.innerHTML = "";
  loUlCest.innerHTML = "";
  loDvQtot.innerHTML = "";
  loDvVtot.innerHTML = "";
}

function CestStMvto() {
  var loNrStrf = document.getElementById("nroStrfCSM");
  var loStLcto = {};

  gmCdCadtCSM = [];

  limpaCamposCSM();
  pesquisaObrasCSM();

  loStLcto = JSON.parse(sessionStorage.getItem("soStLcto"));

  try {
    if (parseInt(loStLcto.id_strf) > 0) {
      sessionStorage.removeItem("soStLcto");

      loNrStrf.value = parseInt(loStLcto.id_strf);

      pesquisaCadastrosEstoqueSolicitacaoTransferenciaCSM();
    }
  } catch (error) {}

  pesquisaCadastrosEstoqueCSM();

  OkTecladoAndroid("nroStrfCSM");
  OkTecladoAndroid("nroQtdeCSM");
}
