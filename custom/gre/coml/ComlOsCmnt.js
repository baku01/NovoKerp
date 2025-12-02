var goOsLctoCOC = {};

function consultaComentarioCOC() {
  var loSlObra = document.getElementById("sltObraCOC");
  var loDtData = document.getElementById("datDataCOC");
  var loTaCmnt = document.getElementById("txaCmntCOC");
  var lnIdOrds = 0,
    lnIdClie = 0;
  var lcWkIsql = "",
    lcCmData = "";
  var lmWkIsql = [];

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    limpaCamposCOC();

    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    lcCmData = loDtData.value.toString().trim().toUpperCase();
  } else {
    limpaCamposCOC();

    return;
  }

  try {
    if (parseInt(goOsLctoCOC.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOC.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    limpaCamposOrdemServicoCOC();

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "ldCmData", pa_tipo: "SmallDatetime", pa_valo: lcCmData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaComentario",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loTaCmnt.value = lmWkRsql[0].cm_desc.trim().toUpperCase();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaCOC(loWkRsql) {
  var loNrNume = document.getElementById("nroNumeCOC");
  var loLiTipo = document.getElementById("lliTipoCOC");
  var loDvTipo = document.getElementById("divTipoCOC");
  var loLiResp = document.getElementById("lliRespCOC");
  var loDvResp = document.getElementById("divRespCOC");
  var loLiOrca = document.getElementById("lliOrcaCOC");
  var loDvOrca = document.getElementById("divOrcaCOC");
  var loLiNcli = document.getElementById("lliNcliCOC");
  var loDvNcli = document.getElementById("divNcliCOC");
  var loLiNcon = document.getElementById("lliNconCOC");
  var loDvNcon = document.getElementById("divNconCOC");
  var loLiDesc = document.getElementById("lliDescCOC");
  var loTaDesc = document.getElementById("txaDescCOC");
  var loLiCmnt = document.getElementById("lliCmntCOC");
  var lcOsTipo = "";

  limpaCamposOrdemServicoCOC();

  if (loWkRsql.id_parm.trim().toUpperCase() == "ID_ORDS") {
    goOsLctoCOC = loWkRsql;

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

    loLiCmnt.style.display = "";

    consultaComentarioCOC();
  }
}

function consultaOrdemServicoCOC() {
  var loSlObra = document.getElementById("sltObraCOC");
  var loNrNume = document.getElementById("nroNumeCOC");
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

    limpaCamposCOC();

    return;
  }

  try {
    if (loNrNume.value.toString().trim().length > 0) {
      lcOsNume = loNrNume.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  if (lcOsNume.length == 0) {
    limpaCamposOrdemServicoCOC();

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

  limpaCamposOrdemServicoCOC();

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

          consultaCOC(lmWkRsql[0]);

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

function pesquisaOrdensServicoCOC() {
  var loSlObra = document.getElementById("sltObraCOC");
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

function alteraDataCOC() {
  var loSlObra = document.getElementById("sltObraCOC");
  var loDtData = document.getElementById("datDataCOC");
  var loLiNume = document.getElementById("lliNumeCOC");
  var lnIdClie = 0;

  if (
    loDtData.defaultValue.toString().trim().toUpperCase() ==
    loDtData.value.toString().trim().toUpperCase()
  ) {
    return;
  }

  limpaCamposCOC();

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    return;
  }

  loLiNume.style.display = "";
}

function alteraObraCOC() {
  var loSlObra = document.getElementById("sltObraCOC");
  var loDtData = document.getElementById("datDataCOC");
  var loLiNume = document.getElementById("lliNumeCOC");
  var lnIdClie = 0;

  limpaCamposCOC();

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    return;
  }

  loLiNume.style.display = "";
}

function insereComentarioCOC() {
  var loSlObra = document.getElementById("sltObraCOC");
  var loDtData = document.getElementById("datDataCOC");
  var loLiNume = document.getElementById("lliNumeCOC");
  var loTaCmnt = document.getElementById("txaCmntCOC");
  var ldDtHoje = new Date();
  var lnIdOrds = 0,
    lnIdClie = 0;
  var lcWkIsql = "",
    lcCmData = "",
    lcCmDesc = "";
  var lmWkIsql = [];

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    alerta("data do comentário inválida", "alerta");

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    alerta("data do comentário maior que data atual", "alerta");

    return;
  } else {
    lcCmData = loDtData.value.toString().trim().toUpperCase();
  }

  try {
    if (parseInt(goOsLctoCOC.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOC.id_ords);
    }
  } catch (error) {}

  if (loLiNume.style.display.trim().length == 0 && lnIdOrds == 0) {
    alerta("proposta inválida", "alerta");

    return;
  }

  if (loTaCmnt.value.toString().trim().length > 0) {
    lcCmDesc = loTaCmnt.value.toString().trim().toUpperCase();
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "ldCmData", pa_tipo: "SmallDatetime", pa_valo: lcCmData },
    { pa_nome: "lcCmDesc", pa_tipo: "VarChar", pa_valo: lcCmDesc },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereComentario",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          notificacao("comentário salvo", "sucesso");
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaObrasCOC() {
  var loSlObra = document.getElementById("sltObraCOC");
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

function limpaCamposOrdemServicoCOC() {
  var loNrNume = document.getElementById("nroNumeCOC");
  var loLiTipo = document.getElementById("lliTipoCOC");
  var loDvTipo = document.getElementById("divTipoCOC");
  var loLiResp = document.getElementById("lliRespCOC");
  var loDvResp = document.getElementById("divRespCOC");
  var loLiOrca = document.getElementById("lliOrcaCOC");
  var loDvOrca = document.getElementById("divOrcaCOC");
  var loLiNcli = document.getElementById("lliNcliCOC");
  var loDvNcli = document.getElementById("divNcliCOC");
  var loLiNcon = document.getElementById("lliNconCOC");
  var loDvNcon = document.getElementById("divNconCOC");
  var loLiDesc = document.getElementById("lliDescCOC");
  var loTaDesc = document.getElementById("txaDescCOC");
  var loLiCmnt = document.getElementById("lliCmntCOC");
  var loTaCmnt = document.getElementById("txaCmntCOC");

  goOsLctoCOC = {};

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

  loLiCmnt.style.display = "none";

  loTaCmnt.value = "";
}

function limpaCamposCOC() {
  var loLiNume = document.getElementById("lliNumeCOC");

  loLiNume.style.display = "none";

  limpaCamposOrdemServicoCOC();
}

function ComlOsCmnt() {
  var loSlObra = document.getElementById("sltObraCOC");
  var loDtData = document.getElementById("datDataCOC");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loSlObra.selectedIndex = 0;

  loDtData.valueAsDate = ldDtHoje;

  limpaCamposCOC();
  pesquisaObrasCOC();

  OkTecladoAndroid("nroNumeCOC");
}
