var gmOsItemPOI = [],
  gmCdCliePOI = [];
var gcBsProjPOI = "";

function insereProjetoOrdemServicoProducaoPOI() {
  var loTxProj = document.getElementById("txtProjPOI");
  var lnPoNume = 0;
  var lcDcNome = loTxProj.value.toString().trim();

  if (lcDcNome.trim().length == 0) {
    app.input.validate(loTxProj);
  }

  if (gmOsItemPOI.length == 0) {
    alerta("ordem de serviço inválida, adicione pelo menos um item", "alerta");

    return;
  }

  if (gcBsProjPOI.trim().length == 0) {
    alerta(
      "projeto inválido, escolhe um documendo em pdf através do icone 'anexo'",
      "alerta"
    );

    return;
  }

  if (lcDcNome.trim().length == 0) {
    alerta("nome do arquivo do projeto inválido", "alerta");

    return;
  }

  if (
    goCdUser.id_user.trim().toUpperCase() != "CARLOS" &&
    goCdUser.id_user.trim().toUpperCase() != "CHAMONE" &&
    goCdUser.id_user.trim().toUpperCase() != "CHAMONI" &&
    goCdUser.id_user.trim().toUpperCase() != "DAVI.CASTRO" &&
    goCdUser.id_user.trim().toUpperCase() != "LORENA" &&
    goCdUser.id_user.trim().toUpperCase() != "MARIA.EDUARDA" &&
    goCdUser.id_user.trim().toUpperCase() != "QUESIA" &&
    goCdUser.id_user.trim().toUpperCase() != "PEDRO" &&
    goCdUser.id_user.trim().toUpperCase() != "JORGE GENEROSO" &&
    goCdUser.id_user.trim().toUpperCase() != "KAILANE" &&
    goCdUser.id_user.trim().toUpperCase() != "RICHARD" &&
    goCdUser.id_user.trim().toUpperCase() != "GUSTAVO" &&
    goCdUser.id_user.trim().toUpperCase() != "CHARLES" &&
    goCdUser.id_user.trim().toUpperCase() != "VINICIUS.F" &&
    goCdUser.id_user.trim().toUpperCase() != "GUILHERME.FERRAREZI" &&
    goCdUser.id_user.trim().toUpperCase() != "PRISCILLA.MIRELI" &&
    goCdUser.id_user.trim().toUpperCase() != "VICTORIA.ALVES" &&
    goCdUser.id_user.trim().toUpperCase() != "JAIRO.J" &&
    goCdUser.id_user.trim().toUpperCase() != "CARLA" &&
    goCdUser.id_user.trim().toUpperCase() != "VICTOR.GUSTAVO" &&
    goCdUser.id_user.trim().toUpperCase() != "LUCAS.NUNES" &&
    goCdUser.id_user.trim().toUpperCase() != "RONALDO.REIS" &&
    goCdUser.id_user.trim().toUpperCase() != "VICTORIA.BEATRIZ" &&
    goCdUser.id_user.trim().toUpperCase() != "GABRIEL.EVANGELISTA" &&
    goCdUser.id_user.trim().toUpperCase() != "TALITA"
  ) {
    alerta(
      "usuário sem autoridade para incluir projeto na ordem de serviço",
      "alerta"
    );

    return;
  }

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  if (!lcDcNome.toLowerCase().endsWith(".pdf")) {
    lcDcNome += ".pdf";
  }

  $.ajax({
    url: goCdUser.ws_http.trim() + "insereDocumento",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      lcDcBase: gcBsProjPOI,
      lcDcPath: "ordensServicoProducao/" + lnPoNume.toString() + "/",
      lcDcNome: lcDcNome,
    }),

    success: function (lmWkRsql) {
      limpaCamposProjetoOrdemServicoProducaoPOI();

      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            lmWkRsql[i]["po_nume"] = lnPoNume;
          }

          montaProjetosOrdemServicoProducaoPOI(lmWkRsql);
        }
      } catch (loWkErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function uploadProjetoEngenhariaPOI() {
  var loTxProj = document.getElementById("txtProjPOI");
  var loFlProj = document.getElementById("fleProjPOI");
  var loFlRead = new FileReader();
  var loWkFile = {};

  loWkFile = loFlProj.files[0];

  if (!loWkFile) {
    return;
  }

  if (loWkFile.type.trim().toUpperCase() != "APPLICATION/PDF") {
    alerta("arquivo inválido, somente no formado pdf", "alerta");

    return;
  }

  loFlRead.onloadend = function () {
    loFlProj.value = "";

    loTxProj.value = loWkFile.name.trim().toUpperCase();

    app.input.validate(loTxProj);

    gcBsProjPOI = loFlRead.result.split(",")[1];
  };

  loFlRead.readAsDataURL(loWkFile);
}

function selecionaProjetoEngenhariaPOI() {
  var loFlProj = document.getElementById("fleProjPOI");

  if (gmOsItemPOI.length == 0) {
    alerta("ordem de serviço inválida, adicione pelo menos um item", "alerta");

    return;
  }

  loFlProj.click();
}

function insereOrdemServicoProducaoPOI() {
  var loSlObra = document.getElementById("sltObraPOI"),
    loTxNume = document.getElementById("txtNumePOI"),
    loTaPodc = document.getElementById("txaPodcPOI"),
    loTxPlan = document.getElementById("txtPlanPOI"),
    loTxSoli = document.getElementById("txtSoliPOI"),
    loDtDtnc = document.getElementById("datDtncPOI"),
    loDtDtpi = document.getElementById("datDtpiPOI"),
    loTxHrdi = document.getElementById("txtHrdiPOI"),
    loTxSitu = document.getElementById("txtSituPOI"),
    loTaPidc = document.getElementById("txaPidcPOI");
  var lcOsNume = loTxNume.value.toString().trim(),
    lcPoDesc = loTaPodc.value.toString().trim(),
    lcPoPlan = loTxPlan.value.toString().trim(),
    lcPoSoli = loTxSoli.value.toString().trim(),
    lcPoDtnc = loDtDtnc.value.toString().trim(),
    lcPoDtpi = loDtDtpi.value.toString().trim(),
    lcPoHrdi = loTxHrdi.value.toString().trim(),
    lcPsSitu = loTxSitu.value.toString().trim(),
    lcPiDesc = loTaPidc.value.toString().trim();
  var lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim()),
    lnPoHrdi = parseFloat(lcPoHrdi.replace(":", "."));
  var lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: lcOsNume },
    { pa_nome: "lcPoDesc", pa_tipo: "VarChar", pa_valo: lcPoDesc },
    { pa_nome: "lcPoPlan", pa_tipo: "VarChar", pa_valo: lcPoPlan },
    { pa_nome: "lcPoSoli", pa_tipo: "VarChar", pa_valo: lcPoSoli },
    { pa_nome: "ldPoDtnc", pa_tipo: "SmallDatetime", pa_valo: lcPoDtnc },
    { pa_nome: "ldPoDtpi", pa_tipo: "SmallDatetime", pa_valo: lcPoDtpi },
    { pa_nome: "lnPoHrdi", pa_tipo: "Decimal", pa_valo: lnPoHrdi },
    { pa_nome: "lcPsSitu", pa_tipo: "VarChar", pa_valo: lcPsSitu },
    { pa_nome: "lcPiDesc", pa_tipo: "VarChar", pa_valo: lcPiDesc },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposItemOrdemServicoProducaoPOI();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereOrdemServicoProducao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ps_erro.trim().length > 0) {
          alerta(lmWkRsql[0].ps_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          montaOrdemServicoProducaoPOI(lmWkRsql);
          pesquisaSituacoesOrdemServicoProducaoPOI();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereItemOrdemServicoProducaoPOI() {
  var loTaPodc = document.getElementById("txaPodcPOI"),
    loTxPlan = document.getElementById("txtPlanPOI"),
    loTxSoli = document.getElementById("txtSoliPOI"),
    loDtDtnc = document.getElementById("datDtncPOI"),
    loDtDtpi = document.getElementById("datDtpiPOI"),
    loTxHrdi = document.getElementById("txtHrdiPOI"),
    loNrItem = document.getElementById("nroItemPOI"),
    loTaPidc = document.getElementById("txaPidcPOI");
  var lcPoDesc = loTaPodc.value.toString().trim(),
    lcPoPlan = loTxPlan.value.toString().trim(),
    lcPoSoli = loTxSoli.value.toString().trim(),
    lcPoDtnc = loDtDtnc.value.toString().trim(),
    lcPoDtpi = loDtDtpi.value.toString().trim(),
    lcPoHrdi = loTxHrdi.value.toString().trim(),
    lcPiDesc = loTaPidc.value.toString().trim();
  var lnPoHrdi = parseFloat(lcPoHrdi.replace(":", ".")),
    lnPoNume = 0,
    lnIdItem = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  try {
    if (parseInt(loNrItem.value) > 0) {
      lnIdItem = parseInt(loNrItem.value);
    }
  } catch (error) {}

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
    { pa_nome: "lcPoDesc", pa_tipo: "VarChar", pa_valo: lcPoDesc },
    { pa_nome: "lcPoPlan", pa_tipo: "VarChar", pa_valo: lcPoPlan },
    { pa_nome: "lcPoSoli", pa_tipo: "VarChar", pa_valo: lcPoSoli },
    { pa_nome: "ldPoDtnc", pa_tipo: "SmallDatetime", pa_valo: lcPoDtnc },
    { pa_nome: "ldPoDtpi", pa_tipo: "SmallDatetime", pa_valo: lcPoDtpi },
    { pa_nome: "lnPoHrdi", pa_tipo: "Decimal", pa_valo: lnPoHrdi },
    { pa_nome: "lnIdItem", pa_tipo: "Int", pa_valo: lnIdItem },
    { pa_nome: "lcPiDesc", pa_tipo: "VarChar", pa_valo: lcPiDesc },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposItemOrdemServicoProducaoPOI();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereItemOrdemServicoProducao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ps_erro.trim().length > 0) {
          alerta(lmWkRsql[0].ps_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          montaOrdemServicoProducaoPOI(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function validaCamposPOI() {
  var loSlObra = document.getElementById("sltObraPOI"),
    loTxNume = document.getElementById("txtNumePOI"),
    loTaPodc = document.getElementById("txaPodcPOI"),
    loTxPlan = document.getElementById("txtPlanPOI"),
    loTxSoli = document.getElementById("txtSoliPOI"),
    loDtDtnc = document.getElementById("datDtncPOI"),
    loDtDtpi = document.getElementById("datDtpiPOI"),
    loTxHrdi = document.getElementById("txtHrdiPOI");
  var lcOsNume = loTxNume.value.toString().trim(),
    lcPoDesc = loTaPodc.value.toString().trim(),
    lcPoPlan = loTxPlan.value.toString().trim(),
    lcPoSoli = loTxSoli.value.toString().trim(),
    lcPoDtnc = loDtDtnc.value.toString().trim(),
    lcPoDtpi = loDtDtpi.value.toString().trim(),
    lcPoHrdi = loTxHrdi.value.toString().trim();
  var lnIdClie = 0;

  if (lcOsNume.trim().length == 0) {
    app.input.validate(loTxNume);
  }

  if (lcPoDesc.trim().length == 0) {
    app.input.validate(loTaPodc);
  }

  if (lcPoPlan.trim().length == 0) {
    app.input.validate(loTxPlan);
  }

  if (lcPoSoli.trim().length == 0) {
    app.input.validate(loTxSoli);
  }

  if (lcPoDtnc.trim().length == 0) {
    app.input.validate(loDtDtnc);
  }

  if (lcPoDtpi.trim().length == 0) {
    app.input.validate(loDtDtpi);
  }

  if (lcPoHrdi.trim().length == 0) {
    app.input.validate(loTxHrdi);
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return false;
  }

  if (lcOsNume.trim().length == 0) {
    alerta("proposta inválida", "alerta");

    return false;
  }

  if (lcPoDesc.trim().length == 0) {
    alerta("descrição da ordem de serviço inválida", "alerta");

    return false;
  }

  if (lcPoPlan.trim().length == 0) {
    alerta("planejador inválido", "alerta");

    return false;
  }

  if (lcPoSoli.trim().length == 0) {
    alerta("solicitante inválido", "alerta");

    return false;
  }

  if (lcPoDtnc.trim().length == 0) {
    alerta("data da necessidade inválida", "alerta");

    return false;
  }

  if (lcPoDtpi.trim().length == 0) {
    alerta("previsão de início inválida", "alerta");

    return false;
  }

  if (lcPoHrdi.trim().length == 0) {
    alerta("horas disponíveis inválidas", "alerta");

    return false;
  }

  return true;
}

function adicionaItemOrdemServicoProducaoPOI() {
  var loTaPidc = document.getElementById("txaPidcPOI");
  var lnPoNume = 0;
  var lcPiDesc = loTaPidc.value.toString().trim();

  if (lcPiDesc.trim().length == 0) {
    app.input.validate(loTaPidc);
  }

  if (!validaCamposPOI()) {
    return;
  }

  if (lcPiDesc.trim().length == 0) {
    alerta("descrição do item inválida", "alerta");

    return;
  }

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  if (lnPoNume > 0) {
    insereItemOrdemServicoProducaoPOI();
  } else {
    insereOrdemServicoProducaoPOI();
  }
}

function insereSituacaoOrdemServicoProducaoPOI() {
  var loTxSitu = document.getElementById("txtSituPOI");
  var lnPoNume = 0;
  var lcWkIsql = "",
    lcPsSitu = "";
  var lmWkIsql = [];

  if (
    loTxSitu.defaultValue.toString().trim().toUpperCase() ==
    loTxSitu.value.toString().trim().toUpperCase()
  ) {
    return;
  }

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  try {
    if (loTxSitu.value.toString().trim().length > 0) {
      lcPsSitu = loTxSitu.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  if (lcPsSitu.length == 0) {
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
    { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
    { pa_nome: "lcPsSitu", pa_tipo: "VarChar", pa_valo: lcPsSitu },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposSituacaoPOI();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereSituacaoOrdemServicoProducao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ps_erro.trim().length > 0) {
          alerta(lmWkRsql[0].ps_erro.trim().toLowerCase(), "alerta");

          loTxSitu.value = loTxSitu.defaultValue;

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          montaSituacoesOrdemServicoProducaoPOI(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function atualizaInformacoesOrdemServicoProducaoPOI(loOsObjt) {
  var loTaPodc = document.getElementById("txaPodcPOI"),
    loTxPlan = document.getElementById("txtPlanPOI"),
    loTxSoli = document.getElementById("txtSoliPOI"),
    loDtDtnc = document.getElementById("datDtncPOI"),
    loDtDtpi = document.getElementById("datDtpiPOI"),
    loTxHrdi = document.getElementById("txtHrdiPOI");
  var lnPoNume = 0,
    lnPoHrdi = 0;
  var lcPoDesc = loTaPodc.value.toString().trim().toUpperCase(),
    lcPoPlan = loTxPlan.value.toString().trim().toUpperCase(),
    lcPoSoli = loTxSoli.value.toString().trim().toUpperCase(),
    lcPoDtnc = loDtDtnc.value.toString().trim().toUpperCase(),
    lcPoDtpi = loDtDtpi.value.toString().trim().toUpperCase(),
    lcPoHrdi = loTxHrdi.value.toString().trim().toUpperCase();
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  if (loOsObjt.defaultValue == loOsObjt.value) {
    return;
  }

  if (loOsObjt.value.toString().trim().length == 0) {
    loOsObjt.value = loOsObjt.defaultValue;

    return;
  }

  lnPoHrdi = parseFloat(lcPoHrdi.replace(":", "."));

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
    { pa_nome: "lcPoDesc", pa_tipo: "VarChar", pa_valo: lcPoDesc },
    { pa_nome: "lcPoPlan", pa_tipo: "VarChar", pa_valo: lcPoPlan },
    { pa_nome: "lcPoSoli", pa_tipo: "VarChar", pa_valo: lcPoSoli },
    { pa_nome: "ldPoDtnc", pa_tipo: "SmallDatetime", pa_valo: lcPoDtnc },
    { pa_nome: "ldPoDtpi", pa_tipo: "SmallDatetime", pa_valo: lcPoDtpi },
    { pa_nome: "lnPoHrdi", pa_tipo: "Decimal", pa_valo: lnPoHrdi },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaInformacoesOrdemServicoProducao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ps_erro.trim().length > 0) {
          alerta(lmWkRsql[0].ps_erro.trim().toLowerCase(), "alerta");

          loOsObjt.value = loOsObjt.defaultValue;

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          montaOrdemServicoProducaoPOI(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaPropostaPOI() {
  var loSlObra = document.getElementById("sltObraPOI");
  var loTxNume = document.getElementById("txtNumePOI");
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcOsNume = "";
  var lmWkIsql = [];

  try {
    if (loTxNume.value.toString().trim().length > 0) {
      lcOsNume = loTxNume.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  limpaCamposPropostaPOI();

  if (lcOsNume.length == 0) {
    return;
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    alerta("obra inválida", "alerta");

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

          consultaPOI(lmWkRsql[0]);

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

function consultaPOI(loPpLcto) {
  var loTxNume = document.getElementById("txtNumePOI");
  var loTaDesc = document.getElementById("txaDescPOI");

  if (loPpLcto.id_parm.trim().toUpperCase() == "ID_ORDS") {
    limpaCamposPropostaPOI();

    loTxNume.value = loPpLcto.os_nume.trim().toUpperCase();

    app.input.validate(loTxNume);

    loTaDesc.value = loPpLcto.os_desc.trim().toUpperCase();
  }
}

function pesquisaPropostasPOI() {
  var loSlObra = document.getElementById("sltObraPOI");
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

function compartilhaOrdemServicoPOI() {
  var ldDtHoje = new Date();
  var lcOsHtml = "",
    lcOsLcto = "";

  for (var i = 0; i < gmOsItemPOI.length; i++) {
    //prettier-ignore
    lcOsLcto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + gmOsItemPOI[i].id_item.toString() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" + gmOsItemPOI[i].pi_desc.trim().toUpperCase() + "</span>" +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcOsHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>ordem de serviço de fabricação " + gmOsItemPOI[0].po_nume.toString() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/gre.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>obra</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].cl_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>local</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].id_cida.trim().toUpperCase() + "/" + gmOsItemPOI[0].id_esta.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>proposta</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].os_nume.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>solicitação</span> <br />" +
              "<span style='font-size: small;'>" + jsonDate(gmOsItemPOI[0].po_data) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>descrição da proposta</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].os_desc.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>descrição da ordem de serviço</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].po_desc.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>planejador</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].po_plan.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>previsão de início</span> <br />" +
              "<span style='font-size: small;'>" + jsonDate(gmOsItemPOI[0].po_dtpi) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>solicitante</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].po_soli.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>necessidade</span> <br />" +
              "<span style='font-size: small;'>" + jsonDate(gmOsItemPOI[0].po_dtnc) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "<b>item</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<b>descrição</b>" +
            "</td>" +
          "</tr>" +
          lcOsLcto +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>quantidade de horas disponíveis</span> <br />" +
              "<span style='font-size: small;'>" + gmOsItemPOI[0].po_hrdi.toFixed(2).replace(".", ":") + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>qtde hrs solic sup fabrica</span> <br />" +
              "<span style='font-size: small;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar pdf",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcOsHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "os_" + gmOsItemPOI[0].po_nume.toString() + "_greal.pdf",
                })
                .then(function (lcPdStat) {
                  console.log("status: " + lcPdStat);

                  app.dialog.close();
                })
                .catch((lcPdErro) =>
                  alerta(
                    "não foi possível gerar o pdf, tente novamente mais tarde",
                    "alerta"
                  )
                );
            },
          },
          {
            text: "compartilhar pdf",
            icon: "<i class='material-icons centraliza'>picture_as_pdf</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcOsHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "os_" + gmOsItemPOI[0].po_nume.toString() + "_greal.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente a ordem de serviço " +
                      gmOsItemPOI[0].po_nume.toString() +
                      " da greal",
                    "ordem de serviço " +
                      gmOsItemPOI[0].po_nume.toString() +
                      " da greal"
                  );
                })
                .catch((lcPdErro) =>
                  alerta(
                    "não foi possível gerar o pdf, tente novamente mais tarde",
                    "alerta"
                  )
                );
            },
          },
          {
            text: "compartilhar imagem",
            icon: "<i class='material-icons centraliza'>image</i>",
            onClick: function () {
              app.dialog.progress("gerando imagem");

              htmlToImageBase64(lcOsHtml)
                .then((lo64Base) => {
                  app.dialog.close();

                  window.plugins.socialsharing.share(
                    "arquivo pdf referente a ordem de serviço " +
                      gmOsItemPOI[0].po_nume.toString() +
                      " da greal",
                    "ordem de serviço " +
                      gmOsItemPOI[0].po_nume.toString() +
                      " da greal",
                    lo64Base,
                    null
                  );
                })
                .catch(() => {
                  app.dialog.close();

                  alerta(
                    "não foi possível gerar a imagem, tente gerar no formato pdf",
                    "alerta"
                  );
                });
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "pdf",
            icon: "<i class='material-icons centraliza'>picture_as_pdf</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcOsHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "os_" + gmOsItemPOI[0].po_nume.toString() + "_greal.pdf",
                })
                .then(function (lcPdStat) {
                  console.log("status: " + lcPdStat);

                  app.dialog.close();
                })
                .catch((lcPdErro) =>
                  alerta(
                    "não foi possível gerar o pdf, tente novamente mais tarde",
                    "alerta"
                  )
                );
            },
          },
          {
            text: "imagem",
            icon: "<i class='material-icons centraliza'>image</i>",
            onClick: function () {
              app.dialog.progress("gerando imagem");

              htmlToImageBase64(lcOsHtml)
                .then((lo64Base) => {
                  app.dialog.close();

                  window.plugins.socialsharing.share(
                    "imagem referente a ordem de serviço " +
                      gmOsItemPOI[0].po_nume.toString() +
                      " da greal",
                    "ordem de serviço " +
                      gmOsItemPOI[0].po_nume.toString() +
                      " da greal",
                    lo64Base,
                    null
                  );
                })
                .catch(() => {
                  app.dialog.close();

                  alerta(
                    "não foi possível gerar a imagem, tente gerar no formato pdf",
                    "alerta"
                  );
                });
            },
          },
        ],
      })
      .open();
  } else {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              visualizaImpressao(
                screen.availWidth / 1.5,
                screen.availHeight / 1.5,
                "os_" + gmOsItemPOI[0].po_nume.toString() + "_greal",
                lcOsHtml
              );
            },
          },
          {
            text: "imprimir",
            icon: "<i class='material-icons centraliza'>print</i>",
            onClick: function () {
              impressaoPdf(
                screen.availWidth / 1.5,
                screen.availHeight / 1.5,
                "os_" + gmOsItemPOI[0].po_nume.toString() + "_greal",
                lcOsHtml
              );
            },
          },
        ],
      })
      .open();
  }
}

function deletaProjetosOrdemServicoProducaoPOI() {
  var lnPoNume = 0;

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "deletaDocumentos?lcDcPath=OrdensServicoProducao/" +
      lnPoNume.toString(),
    type: "GET",
    dataType: "jsonp",

    success: function (loWkRsql) {
      try {
        if (!loWkRsql.dc_suce) {
          alerta(loWkRsql.dc_erro.trim().toLowerCase(), "alerta");
        }
      } catch (loWkErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function deletaOrdemServicoProducaoPOI() {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnPoNume = 0;

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  app.dialog
    .create({
      title: "alerta",
      text: "deseja excluir a ordem de serviço ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            if (lnPoNume == 0) {
              limpaCamposPOI();

              goMnView.router.back();

              return;
            }

            if (
              goCdUser.id_user.trim().toUpperCase() != "CARLOS" &&
              goCdUser.id_user.trim().toUpperCase() != "CHAMONE" &&
              goCdUser.id_user.trim().toUpperCase() != "CHAMONI" &&
              goCdUser.id_user.trim().toUpperCase() != "DAVI.CASTRO" &&
              goCdUser.id_user.trim().toUpperCase() != "LORENA" &&
              goCdUser.id_user.trim().toUpperCase() != "MARIA.EDUARDA" &&
              goCdUser.id_user.trim().toUpperCase() != "QUESIA" &&
              goCdUser.id_user.trim().toUpperCase() != "PEDRO" &&
              goCdUser.id_user.trim().toUpperCase() != "JORGE GENEROSO" &&
              goCdUser.id_user.trim().toUpperCase() != "KAILANE" &&
              goCdUser.id_user.trim().toUpperCase() != "RICHARD" &&
              goCdUser.id_user.trim().toUpperCase() != "GUSTAVO" &&
              goCdUser.id_user.trim().toUpperCase() != "CHARLES" &&
              goCdUser.id_user.trim().toUpperCase() != "VINICIUS.F" &&
              goCdUser.id_user.trim().toUpperCase() != "GUILHERME.FERRAREZI" &&
              goCdUser.id_user.trim().toUpperCase() != "PRISCILLA.MIRELI" &&
              goCdUser.id_user.trim().toUpperCase() != "VICTORIA.ALVES" &&
              goCdUser.id_user.trim().toUpperCase() != "JAIRO.J" &&
              goCdUser.id_user.trim().toUpperCase() != "CARLA" &&
              goCdUser.id_user.trim().toUpperCase() != "VICTOR.GUSTAVO" &&
              goCdUser.id_user.trim().toUpperCase() != "LUCAS.NUNES" &&
              goCdUser.id_user.trim().toUpperCase() != "RONALDO.REIS" &&
              goCdUser.id_user.trim().toUpperCase() != "VICTORIA.BEATRIZ" &&
              goCdUser.id_user.trim().toUpperCase() != "GABRIEL.EVANGELISTA" &&
              goCdUser.id_user.trim().toUpperCase() != "TALITA"
            ) {
              alerta(
                "usuário sem autoridade para excluir ordem de serviço",
                "alerta"
              );

              return;
            }

            lmWkIsql = [
              {
                pa_nome: "lcIdUser",
                pa_tipo: "VarChar",
                pa_valo: goCdUser.id_user.trim().toUpperCase(),
              },
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            deletaProjetosOrdemServicoProducaoPOI();

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=deletaOrdemServicoProducao",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].ps_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].ps_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (error) {}

                pesquisaOrdensServicoProducaoPOL();

                goMnView.router.back();
              },
              error: function (jqXHR, textStatus, err) {},
            });
          },
        },
      ],
    })
    .open();
}

function deletaItemOrdemServicoProducaoPOI(lcOsItem) {
  var loOsItem = JSON.parse(unescape(lcOsItem));
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnPoNume = 0,
    lnIdItem = 0;

  try {
    if (parseInt(loOsItem.po_nume) > 0) {
      lnPoNume = parseInt(loOsItem.po_nume);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  try {
    if (parseInt(loOsItem.id_item) > 0) {
      lnIdItem = parseInt(loOsItem.id_item);
    }
  } catch (error) {}

  if (lnIdItem == 0) {
    return;
  }

  if (gmOsItemPOI.length == 1) {
    deletaOrdemServicoProducaoPOI();

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "deseja excluir o item da ordem de serviço ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
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
              { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
              { pa_nome: "lnIdItem", pa_tipo: "Int", pa_valo: lnIdItem },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=deletaItemOrdemServicoProducao",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].ps_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].ps_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (error) {}

                try {
                  if (lmWkRsql.length > 0) {
                    montaOrdemServicoProducaoPOI(lmWkRsql);
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

function consultaItemOrdemServicoProducaoPOI(lcOsItem) {
  var loOsItem = {},
    loNrItem = document.getElementById("nroItemPOI"),
    loTaPidc = document.getElementById("txaPidcPOI");
  var lnIdItem = 0,
    lnPoNume = 0;

  try {
    if (parseInt(gmOsItemPOI[0].po_nume) > 0) {
      lnPoNume = parseInt(gmOsItemPOI[0].po_nume);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    limpaCamposItemOrdemServicoProducaoPOI();

    return;
  }

  if (lcOsItem.trim().length > 0) {
    loOsItem = JSON.parse(unescape(lcOsItem));

    try {
      if (parseInt(loOsItem.id_item) > 0) {
        lnIdItem = parseInt(loOsItem.id_item);
      }
    } catch (error) {}
  } else {
    try {
      if (parseInt(loNrItem.value) > 0) {
        lnIdItem = parseInt(loNrItem.value);
      }
    } catch (error) {}
  }

  limpaCamposItemOrdemServicoProducaoPOI();

  if (lnIdItem == 0) {
    return;
  }

  for (var i = 0; i < gmOsItemPOI.length; i++) {
    if (parseInt(gmOsItemPOI[i].id_item) == lnIdItem) {
      loNrItem.value = parseInt(gmOsItemPOI[i].id_item);

      loTaPidc.value = gmOsItemPOI[i].pi_desc.trim().toUpperCase();

      app.input.validate(loTaPidc);

      break;
    }
  }
}

function montaItensOrdemServicoProducaoPOI() {
  var loUlItem = document.getElementById("uulItemPOI");
  var lcOsItem = "",
    lcSmDica = "",
    lcOnCont = "oncontextmenu";

  if (gmOsItemPOI.length > 0) {
    if (isMobile()) {
      if (gcSiOper == "iOS") {
        lcSmDica = "CLIQUE NO ITEM PARA EDITAR";

        lcOnCont = "onclick";
      } else {
        lcSmDica = "CLIQUE E SEGURE NO ITEM PARA EDITAR";
      }
    } else {
      lcSmDica = "CLIQUE COM O BOTÃO DIREITO DO MOUSE NO ITEM PARA EDITAR";
    }

    //prettier-ignore
    lcOsItem += 
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'>dica</div>" +
            "<div class='item-after'>" + lcSmDica.trim().toUpperCase() + "</div>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  for (var i = 0; i < gmOsItemPOI.length; i++) {
    //prettier-ignore
    lcOsItem +=
      "<li class='accordion-item' " + lcOnCont + "='consultaItemOrdemServicoProducaoPOI(\"" + escape(JSON.stringify(gmOsItemPOI[i])) + "\");'>" +
        "<a href='#' class='item-content item-link'>" +          
          "<div class='item-media' onclick='deletaItemOrdemServicoProducaoPOI(\"" + escape(JSON.stringify(gmOsItemPOI[i])) + "\");'>" +
            "<i class='material-icons text-color-red'>remove_circle</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmOsItemPOI[i].pi_desc.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + gmOsItemPOI[i].id_item.toString() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>item</div>" +
                    "<div class='item-after'>" + gmOsItemPOI[i].id_item.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li class='item-content item-input'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title item-label'>descrição</div>" +
                  "<div class='item-input-wrap'>" +
                    "<textarea readonly>" + gmOsItemPOI[i].pi_desc.trim().toUpperCase() + "</textarea>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  loUlItem.innerHTML = lcOsItem;
}

function consultaProjetoOrdemServicoProducaoPOI(lcOsProj) {
  var loOsProj = JSON.parse(unescape(lcOsProj));
  var lcDcLink =
    "Docs/" +
    loOsProj.dc_path.trim().toUpperCase() +
    "/" +
    loOsProj.ex_sdir.trim().toUpperCase();
  var loTpDocu = {};
  var lnPdLeft = screen.width / 2 - screen.availWidth / 2,
    lnPdTopp = screen.height / 2 - screen.availHeight / 2;

  if (isMobile()) {
    cordova.InAppBrowser.open(
      goCdUser.ws_wiis.trim() + lcDcLink,
      "_system",
      "location=yes"
    );
  } else {
    loTpDocu = window.open(
      goCdUser.ws_wiis.trim() + lcDcLink,
      loOsProj.ex_sdir.trim().toUpperCase(),
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        screen.availWidth +
        ", height=" +
        screen.availHeight +
        ", top=" +
        lnPdTopp +
        ", left=" +
        lnPdLeft
    );

    loTpDocu.focus();
  }
}

function deletaProjetoOrdemServicoProducaoPOI(lcOsProj) {
  var loOsProj = JSON.parse(unescape(lcOsProj));
  var lnPoNume = 0;
  var lcExSdir = "";

  try {
    if (parseInt(loOsProj.po_nume) > 0) {
      lnPoNume = parseInt(loOsProj.po_nume);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  try {
    if (loOsProj.ex_sdir.trim().length > 0) {
      lcExSdir = loOsProj.ex_sdir.trim().toUpperCase();
    }
  } catch (error) {}

  if (lcExSdir.trim().length == 0) {
    return;
  }

  if (
    goCdUser.id_user.trim().toUpperCase() != "CARLOS" &&
    goCdUser.id_user.trim().toUpperCase() != "CHAMONE" &&
    goCdUser.id_user.trim().toUpperCase() != "CHAMONI" &&
    goCdUser.id_user.trim().toUpperCase() != "DAVI.CASTRO" &&
    goCdUser.id_user.trim().toUpperCase() != "LORENA" &&
    goCdUser.id_user.trim().toUpperCase() != "MARIA.EDUARDA" &&
    goCdUser.id_user.trim().toUpperCase() != "QUESIA" &&
    goCdUser.id_user.trim().toUpperCase() != "PEDRO" &&
    goCdUser.id_user.trim().toUpperCase() != "JORGE GENEROSO" &&
    goCdUser.id_user.trim().toUpperCase() != "KAILANE" &&
    goCdUser.id_user.trim().toUpperCase() != "RICHARD" &&
    goCdUser.id_user.trim().toUpperCase() != "GUSTAVO" &&
    goCdUser.id_user.trim().toUpperCase() != "CHARLES" &&
    goCdUser.id_user.trim().toUpperCase() != "VINICIUS.F" &&
    goCdUser.id_user.trim().toUpperCase() != "GUILHERME.FERRAREZI" &&
    goCdUser.id_user.trim().toUpperCase() != "PRISCILLA.MIRELI" &&
    goCdUser.id_user.trim().toUpperCase() != "VICTORIA.ALVES" &&
    goCdUser.id_user.trim().toUpperCase() != "JAIRO.J" &&
    goCdUser.id_user.trim().toUpperCase() != "CARLA" &&
    goCdUser.id_user.trim().toUpperCase() != "VICTOR.GUSTAVO" &&
    goCdUser.id_user.trim().toUpperCase() != "LUCAS.NUNES" &&
    goCdUser.id_user.trim().toUpperCase() != "RONALDO.REIS" &&
    goCdUser.id_user.trim().toUpperCase() != "VICTORIA.BEATRIZ" &&
    goCdUser.id_user.trim().toUpperCase() != "GABRIEL.EVANGELISTA" &&
    goCdUser.id_user.trim().toUpperCase() != "TALITA"
  ) {
    alerta(
      "usuário sem autoridade para excluir projeto da ordem de serviço",
      "alerta"
    );

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "excluir projeto da ordem de serviço ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "deletaDocumento?lcPtDocu=OrdensServicoProducao/" +
                lnPoNume.toString() +
                "&lcExSdir=/" +
                lcExSdir,
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                limpaCamposProjetoOrdemServicoProducaoPOI();

                try {
                  if (lmWkRsql.length > 0) {
                    for (var i = 0; i < lmWkRsql.length; i++) {
                      lmWkRsql[i]["po_nume"] = lnPoNume;
                    }

                    montaProjetosOrdemServicoProducaoPOI(lmWkRsql);
                  }
                } catch (loWkErro) {}
              },
              error: function (jqXHR, textStatus, err) {},
            });
          },
        },
      ],
    })
    .open();
}

function montaProjetosOrdemServicoProducaoPOI(lmOsProj) {
  var loUlProj = document.getElementById("uulProjPOI");
  var lcUlProj = "";

  for (var i = 0; i < lmOsProj.length; i++) {
    //prettier-ignore
    lcUlProj +=
      "<li>" +
        "<a href='#' class='item-link item-content'>" +
          "<div class='item-media' onclick='deletaProjetoOrdemServicoProducaoPOI(\"" + escape(JSON.stringify(lmOsProj[i])) + "\");'>" +
            "<i class='material-icons text-color-red'>remove_circle</i>" +
          "</div>" +
          "<div class='item-inner' onclick='consultaProjetoOrdemServicoProducaoPOI(\"" + escape(JSON.stringify(lmOsProj[i])) + "\");'>" +
            "<div class='item-title'><b>projeto " + (i + 1).toString() + "</b></div>" +
            "<div class='item-after'><b>" + lmOsProj[i].ex_sdir.trim().toUpperCase() + "</b></div>" +
          "</div>" +
        "</a>" +
      "</li>";
  }

  loUlProj.innerHTML = lcUlProj;
}

function pesquisaProjetosOrdemServicoProducaoPOI() {
  var loNrNume = document.getElementById("nroNumePOI");
  var lnPoNume = 0;

  try {
    if (parseInt(loNrNume.value) > 0) {
      lnPoNume = parseInt(loNrNume.value);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  limpaCamposProjetoOrdemServicoProducaoPOI();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "pesquisaDocumentos?lcPtDocu=OrdensServicoProducao/" +
      lnPoNume.toString(),
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            lmWkRsql[i]["po_nume"] = lnPoNume;
          }

          montaProjetosOrdemServicoProducaoPOI(lmWkRsql);
        }
      } catch (loWkErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function deletaSituacaoOrdemServicoProducaoCOI(lcOsSitu) {
  var loOsSitu = JSON.parse(unescape(lcOsSitu));
  var lnPoNume = 0;
  var lcWkIsql = "",
    lcPsData = "",
    lcPsSitu = "";
  var lmWkIsql = [];

  try {
    if (parseInt(loOsSitu.po_nume) > 0) {
      lnPoNume = parseInt(loOsSitu.po_nume);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  try {
    if (jsonDate(loOsSitu.ps_data).trim().length > 0) {
      lcPsData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(loOsSitu.ps_data))
      );
    }
  } catch (error) {}

  if (lcPsData.trim().length == 0) {
    return;
  }

  try {
    if (loOsSitu.ps_situ.trim().length > 0) {
      lcPsSitu = loOsSitu.ps_situ.trim().toUpperCase();
    }
  } catch (error) {}

  if (lcPsSitu.trim().length == 0) {
    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "excluir situação da ordem de serviço ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            limpaCamposSituacaoPOI();

            lmWkIsql = [
              {
                pa_nome: "lcIdUser",
                pa_tipo: "VarChar",
                pa_valo: goCdUser.id_user.trim().toUpperCase(),
              },
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
              {
                pa_nome: "ldPsData",
                pa_tipo: "SmallDatetime",
                pa_valo: lcPsData,
              },
              { pa_nome: "lcPsSitu", pa_tipo: "VarChar", pa_valo: lcPsSitu },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=deletaSituacaoOrdemServicoProducao",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  if (lmWkRsql[0].ps_erro.trim().length > 0) {
                    alerta(lmWkRsql[0].ps_erro.trim().toLowerCase(), "alerta");

                    return;
                  }
                } catch (error) {}

                montaSituacoesOrdemServicoProducaoPOI(lmWkRsql);
              },
              error: function (jqXHR, textStatus, err) {},
            });
          },
        },
      ],
    })
    .open();
}

function montaSituacoesOrdemServicoProducaoPOI(lmOsSitu) {
  var loTxSitu = document.getElementById("txtSituPOI");
  var loUlSitu = document.getElementById("uulSituPOI");
  var lcUlSitu = "";

  if (lmOsSitu.length > 0) {
    loTxSitu.value = lmOsSitu[0].ps_situ.trim().toUpperCase();
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
              "<div class='item-subtitle'>" + jsonDate(lmOsSitu[i].ps_data) + "</div>" +
              "<div class='item-text'>" + lmOsSitu[i].ps_situ.trim().toUpperCase() + "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='swipeout-actions-right'>" +
          "<a href='#' onclick='deletaSituacaoOrdemServicoProducaoCOI(\"" + escape(JSON.stringify(lmOsSitu[i])) + "\");'>" +
            "<i class='material-icons'>delete_forever</i>" +
          "</a>" +
        "</div>" +
      "</li>";
  }

  loUlSitu.innerHTML = lcUlSitu;
}

function pesquisaSituacoesOrdemServicoProducaoPOI() {
  var loNrNume = document.getElementById("nroNumePOI");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnPoNume = 0;

  try {
    if (parseInt(loNrNume.value) > 0) {
      lnPoNume = parseInt(loNrNume.value);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposSituacaoPOI();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSituacoesOrdemServicoProducao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          montaSituacoesOrdemServicoProducaoPOI(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function montaOrdemServicoProducaoPOI(lmOsItem) {
  var loNrNume = document.getElementById("nroNumePOI");
  var loDtData = document.getElementById("datDataPOI");
  var loDvObra = document.getElementById("divObraPOI");
  var loSlObra = document.getElementById("sltObraPOI");
  var loDvProp = document.getElementById("divPropPOI");
  var loTxNume = document.getElementById("txtNumePOI");
  var loTaDesc = document.getElementById("txaDescPOI");
  var loTaPodc = document.getElementById("txaPodcPOI");
  var loTxPlan = document.getElementById("txtPlanPOI");
  var loTxSoli = document.getElementById("txtSoliPOI");
  var loDtDtnc = document.getElementById("datDtncPOI");
  var loDtDtpi = document.getElementById("datDtpiPOI");
  var loTxHrdi = document.getElementById("txtHrdiPOI");

  pesquisaOrdensServicoProducaoPOL();

  gmOsItemPOI = lmOsItem;

  loNrNume.value = parseInt(gmOsItemPOI[0].po_nume);

  loDtData.valueAsDate = stringDataParaObjetoData(
    jsonDate(gmOsItemPOI[0].po_data)
  );

  loDvObra.style.display = "none";

  loSlObra.disabled = true;

  loSlObra.innerHTML =
    "<option value='" +
    gmOsItemPOI[0].id_clie.toString() +
    "/" +
    gmOsItemPOI[0].id_cadt.toString() +
    "'>" +
    gmOsItemPOI[0].cl_fant.trim().toUpperCase() +
    "</option>";

  loDvProp.style.display = "none";

  loTxNume.disabled = true;

  loTxNume.value = gmOsItemPOI[0].os_nume.trim().toUpperCase();

  app.input.validate(loTxNume);

  loTaDesc.value = gmOsItemPOI[0].os_desc.trim().toUpperCase();
  loTaPodc.value = gmOsItemPOI[0].po_desc.trim().toUpperCase();

  app.input.validate(loTaPodc);

  loTxPlan.value = gmOsItemPOI[0].po_plan.trim().toUpperCase();

  app.input.validate(loTxPlan);

  loTxSoli.value = gmOsItemPOI[0].po_soli.trim().toUpperCase();

  app.input.validate(loTxSoli);

  loDtDtnc.valueAsDate = stringDataParaObjetoData(
    jsonDate(gmOsItemPOI[0].po_dtnc)
  );

  app.input.validate(loDtDtnc);

  loDtDtpi.valueAsDate = stringDataParaObjetoData(
    jsonDate(gmOsItemPOI[0].po_dtpi)
  );

  app.input.validate(loDtDtpi);

  loTxHrdi.value = gmOsItemPOI[0].po_hrdi.toFixed(2).replace(".", ":");

  app.input.validate(loTxHrdi);

  montaItensOrdemServicoProducaoPOI();
}

function pesquisaItensOrdemServicoProducaoPOI() {
  var loNrNume = document.getElementById("nroNumePOI");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnPoNume = 0;

  try {
    if (parseInt(loNrNume.value) > 0) {
      lnPoNume = parseInt(loNrNume.value);
    }
  } catch (error) {}

  if (lnPoNume == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnPoNume", pa_tipo: "Int", pa_valo: lnPoNume },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  pesquisaSituacoesOrdemServicoProducaoPOI();
  pesquisaProjetosOrdemServicoProducaoPOI();

  limpaCamposPOI();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaItensOrdemServicoProducao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          montaOrdemServicoProducaoPOI(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaObrasPOI() {
  var loDvObra = document.getElementById("divObraPOI");
  var loSlObra = document.getElementById("sltObraPOI");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdClie = 0;

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
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

      gmCdCliePOI = lmWkRsql;

      montaObrasPOI();

      try {
        if (parseInt(gmOsItemPOI[0].id_clie) > 0) {
          lnIdClie = parseInt(gmOsItemPOI[0].id_clie);
        }
      } catch (error) {}

      if (lnIdClie > 0) {
        loDvObra.style.display = "none";

        loSlObra.innerHTML =
          "<option value='" +
          gmOsItemPOI[0].id_clie.toString() +
          "/'" +
          gmOsItemPOI[0].id_cadt.toString() +
          "'>" +
          gmOsItemPOI[0].cl_fant.trim().toUpperCase() +
          "</option>";

        loSlObra.disabled = true;
      }
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      montaObrasPOI();
    },
  });
}

function limpaCamposSituacaoPOI() {
  var loTxSitu = document.getElementById("txtSituPOI");
  var loUlSitu = document.getElementById("uulSituPOI");

  loTxSitu.value = "";

  loUlSitu.innerHTML = "";
}

function limpaCamposProjetoOrdemServicoProducaoPOI() {
  var loTxProj = document.getElementById("txtProjPOI");
  var loUlProj = document.getElementById("uulProjPOI");

  gcBsProjPOI = "";

  loTxProj.value = "";

  loUlProj.innerHTML = "";
}

function limpaCamposItemOrdemServicoProducaoPOI() {
  var loNrItem = document.getElementById("nroItemPOI");
  var loTaPidc = document.getElementById("txaPidcPOI");

  loNrItem.value = "";
  loTaPidc.value = "";
}

function limpaCamposPropostaPOI() {
  var loDvProp = document.getElementById("divPropPOI");
  var loTxNume = document.getElementById("txtNumePOI");
  var loTaDesc = document.getElementById("txaDescPOI");

  loDvProp.style.display = "";

  loTxNume.disabled = false;

  loTxNume.value = "";
  loTaDesc.value = "";
}

function consultaSelectPOI(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  if (loSlHtml.id_slct.trim().toUpperCase() == "SLTOBRAPOI") {
    for (var i = 0; i < loObSlct.options.length; i++) {
      if (
        parseInt(loObSlct.options[i].value.toString().split("/")[0]) ==
        parseInt(loSlHtml.sl_valu)
      ) {
        loObSlct.selectedIndex = i;

        break;
      }
    }
  }
}

function pesquisaSelectPOI(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function montaObrasPOI() {
  var loDvObra = document.getElementById("divObraPOI");
  var loSlObra = document.getElementById("sltObraPOI");
  var lcCdClie = "<option value='0/0'></option>";
  var lmSlHtml = [];

  for (var i = 0; i < gmCdCliePOI.length; i++) {
    lmSlHtml.push({
      id_slct: "sltObraPOI",
      sl_valu: parseInt(gmCdCliePOI[i].id_clie),
      sl_text: gmCdCliePOI[i].cl_fant.trim().toUpperCase(),
      sl_titl: "pesquisa de obras",
    });

    //prettier-ignore
    lcCdClie += "<option value='" + gmCdCliePOI[i].id_clie.toString() + "/" + gmCdCliePOI[i].id_cadt.toString() + "'>" + gmCdCliePOI[i].cl_fant.trim().toUpperCase() + "</option>";
  }

  loSlObra.innerHTML = lcCdClie;

  loDvObra.onclick = function () {
    pesquisaSelectPOI(lmSlHtml);
  };
}

function limpaCamposPOI() {
  var loNrNume = document.getElementById("nroNumePOI");
  var loDtData = document.getElementById("datDataPOI");
  var loDvObra = document.getElementById("divObraPOI");
  var loSlObra = document.getElementById("sltObraPOI");
  var loTaPodc = document.getElementById("txaPodcPOI");
  var loTxPlan = document.getElementById("txtPlanPOI");
  var loTxSoli = document.getElementById("txtSoliPOI");
  var loDtDtnc = document.getElementById("datDtncPOI");
  var loDtDtpi = document.getElementById("datDtpiPOI");
  var loTxHrdi = document.getElementById("txtHrdiPOI");
  var loUlItem = document.getElementById("uulItemPOI");
  var ldDtHoje = new Date();

  gmOsItemPOI = [];

  ldDtHoje.setHours(0, 0, 0, 0);

  loNrNume.value = "";

  loDtData.valueAsDate = ldDtHoje;

  loDvObra.style.display = "";

  loSlObra.disabled = false;

  montaObrasPOI();
  limpaCamposPropostaPOI();

  loTaPodc.value = "";
  loTxPlan.value = "";
  loTxSoli.value = "";
  loDtDtnc.value = "";
  loDtDtpi.value = "";
  loTxHrdi.value = "";

  limpaCamposItemOrdemServicoProducaoPOI();

  loUlItem.innerHTML = "";

  limpaCamposProjetoOrdemServicoProducaoPOI();
  limpaCamposSituacaoPOI();
}

function PcprOsItem() {
  var loNrNume = document.getElementById("nroNumePOI");
  var loOsLcto = {};

  gmCdCliePOI = [];

  limpaCamposPOI();
  pesquisaObrasPOI();

  loOsLcto = JSON.parse(sessionStorage.getItem("soOsLcto"));

  try {
    if (parseInt(loOsLcto.po_nume) > 0) {
      sessionStorage.removeItem("soOsLcto");

      loNrNume.value = parseInt(loOsLcto.po_nume);

      pesquisaItensOrdemServicoProducaoPOI();
    }
  } catch (error) {}

  jQuery(function ($) {
    $("#txtHrdiPOI").mask("9999:99");
  });

  OkTecladoAndroid("nroNumePOI");
  OkTecladoAndroid("datDataPOI");
  OkTecladoAndroid("txtNumePOI");
  OkTecladoAndroid("txtPlanPOI");
  OkTecladoAndroid("txtSoliPOI");
  OkTecladoAndroid("datDtncPOI");
  OkTecladoAndroid("datDtpiPOI");
  OkTecladoAndroid("txtHrdiPOI");
  OkTecladoAndroid("txtSituPOI");
  OkTecladoAndroid("nroItemPOI");
  OkTecladoAndroid("txtProjPOI");
  OkTecladoAndroid("txtHrdiPOI");
}
