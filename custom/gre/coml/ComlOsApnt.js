var gmApFotoCOA = [],
  gmOsJornCOA = [],
  gmDrRcsoCOA = [],
  gmSmRcsoCOA = [],
  gmOsTareCOA = [],
  gmDrRcsoCDR = [],
  gmApSecuCOA = [],
  gmApFuncCOA = [],
  gmDrJornCOA = [];
var goOsLctoCOA = {},
  goApApntCOA = {},
  goOsTareCOA = {},
  goDgFotoCOA = {};
var glPqAtivCOA = false;

function adicionaFotoWebCOA() {
  var loImFoto = document.getElementById("imgFotoCOA");
  var loFlFoto = document.getElementById("fleFotoCOA");
  var loWkRead = new FileReader();
  var loWkFile = {};

  loWkFile = loFlFoto.files[0];

  loWkRead.onloadend = function () {
    loFlFoto.value = "";

    gmApFotoCOA.push({
      ap_foto: loWkRead.result,
    });

    loImFoto.src = loWkRead.result;
  };

  loWkRead.readAsDataURL(loWkFile);
}

function montaFotosCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loImFoto = document.getElementById("imgFotoCOA");
  var lmApFoto = [];
  var loAxFoto = {};
  var lcClFant = "";

  try {
    if (loSlObra.options[loSlObra.selectedIndex].text.trim().length > 0) {
      lcClFant = loSlObra.options[loSlObra.selectedIndex].text
        .trim()
        .toUpperCase();
    }
  } catch (error) {}

  for (var i = 0; i < gmApFotoCOA.length; i++) {
    lmApFoto.push({
      url: gmApFotoCOA[i].ap_foto,
      caption: lcClFant,
    });
  }

  try {
    if (lmApFoto.length > 0) {
    } else {
      alerta("clique na foto e segure para adicionar", "alerta");

      return;
    }
  } catch (error) {
    alerta("clique na foto e segure para adicionar", "alerta");

    return;
  }

  lmApFoto.reverse();

  app.photoBrowser
    .create({
      photos: lmApFoto,
      theme: "dark",
      type: "standalone",
      navbarOfText: "de",
      on: {
        close: function () {
          loImFoto.src = this.params.photos[this.activeIndex].url;

          gmApFotoCOA = [];

          for (var i = 0; i < lmApFoto.length; i++) {
            if (
              lmApFoto[i].url.trim().toUpperCase() ==
              this.params.photos[this.activeIndex].url.trim().toUpperCase()
            ) {
              loAxFoto = lmApFoto[i];
            } else {
              gmApFotoCOA.push({
                ap_foto: lmApFoto[i].url,
              });
            }
          }

          gmApFotoCOA.push({
            ap_foto: loAxFoto.url,
          });
        },
      },
    })
    .open();
}

function redirecionaAtividadesCOA() {
  if (glPqAtivCOA) {
    alerta("carregando atividades, por favor aguarde...", "alerta");

    return;
  }

  redireciona("custom/gre/coml/ComlOsTare.html", "ComlOsTare.html");
}

function alteraSituacaoRecursoCOA() {
  var loSlSirc = document.getElementById("sltSircCOA");
  var loLiJust = document.getElementById("lliJustCOA");
  var loLiObju = document.getElementById("lliObjuCOA");
  var loLiRpju = document.getElementById("lliRpjuCOA");
  var loLiAtiv = document.getElementById("lliAtivCOA");
  var loLiDres = document.getElementById("lliDresCOA");
  var lnIdSrcs = 0,
    lnSrTrab = 0,
    lnSrJust = 0;

  limpaCamposSituacaoCOA();

  try {
    if (parseInt(loSlSirc.value.toString().split("/")[0].trim()) > 0) {
      lnIdSrcs = parseInt(loSlSirc.value.toString().split("/")[0].trim());
      lnSrTrab = parseInt(loSlSirc.value.toString().split("/")[1].trim());
      lnSrJust = parseInt(loSlSirc.value.toString().split("/")[2].trim());
    }
  } catch (e) {}

  if (lnIdSrcs == 0) {
    return;
  }

  if (lnSrTrab > 0) {
    loLiAtiv.style.display = "";
    loLiDres.style.display = "";
  } else {
    if (lnSrJust > 0) {
      loLiJust.style.display = "";
      loLiObju.style.display = "";
    }

    loLiRpju.style.display = "";
  }
}

function pesquisaAtividadesCOA(lnIdOrds) {
  var lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  glPqAtivCOA = true;

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaAtividades",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      glPqAtivCOA = false;

      gmOsTareCOA = lmWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      glPqAtivCOA = false;

      gmOsTareCOA = [];
    },
  });
}

function consultaComentarioCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loLiNume = document.getElementById("lliNumeCOA");
  var loNrNume = document.getElementById("nroNumeCOA");
  var loTaCmnt = document.getElementById("txaCmntCOA");
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
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    lcCmData = loDtData.value.toString().trim().toUpperCase();
  } else {
    return;
  }

  if (
    loLiNume.style.display.trim().length == 0 &&
    loNrNume.value.toString().trim().length > 0
  ) {
    try {
      if (parseInt(goOsLctoCOA.id_ords) > 0) {
        lnIdOrds = parseInt(goOsLctoCOA.id_ords);
      }
    } catch (error) {}
  }

  if (lnIdOrds == 0) {
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

function consultaCOA(loWkRsql) {
  var loNrNume = document.getElementById("nroNumeCOA");
  var loLiTipo = document.getElementById("lliTipoCOA");
  var loDvTipo = document.getElementById("divTipoCOA");
  var loLiResp = document.getElementById("lliRespCOA");
  var loDvResp = document.getElementById("divRespCOA");
  var loLiOrca = document.getElementById("lliOrcaCOA");
  var loDvOrca = document.getElementById("divOrcaCOA");
  var loLiNcli = document.getElementById("lliNcliCOA");
  var loDvNcli = document.getElementById("divNcliCOA");
  var loLiNcon = document.getElementById("lliNconCOA");
  var loDvNcon = document.getElementById("divNconCOA");
  var loLiDesc = document.getElementById("lliDescCOA");
  var loTaDesc = document.getElementById("txaDescCOA");
  var loLiCmnt = document.getElementById("lliCmntCOA");
  var loLiSirc = document.getElementById("lliSircCOA");
  var loLiDatv = document.getElementById("lliDatvCOA");
  var lcOsTipo = "";

  limpaCamposOrdemServicoCOA();

  if (loWkRsql.id_parm.trim().toUpperCase() == "ID_ORDS") {
    goOsLctoCOA = loWkRsql;

    loNrNume.value = loWkRsql.os_nume.trim().toUpperCase();

    app.input.validate(loNrNume);

    loLiTipo.style.display = "";

    if (parseInt(loWkRsql.os_tipo) == 1) {
      lcOsTipo = "EMPREITA";

      loLiSirc.style.display = "";

      pesquisaAtividadesCOA(parseInt(loWkRsql.id_ords));
    } else if (parseInt(loWkRsql.os_tipo) == 2) {
      lcOsTipo = "HORA HOMEM";

      loLiDatv.style.display = "";
    } else if (parseInt(loWkRsql.os_tipo) == 3) {
      lcOsTipo = "LOCAÇÃO";

      loLiDatv.style.display = "";
    } else if (parseInt(loWkRsql.os_tipo) == 4) {
      lcOsTipo = "PRODUTO";

      loLiDatv.style.display = "";
    } else {
      lcOsTipo = "";

      loLiDatv.style.display = "";
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

    // loLiCmnt.style.display = "";

    consultaComentarioCOA();
    pesquisaJornadaCOA(parseInt(loWkRsql.id_ords));
  }
}

function consultaOrdemServicoCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loNrNume = document.getElementById("nroNumeCOA");
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcOsNume = "";
  var lmWkIsql = [];

  try {
    if (loNrNume.value.toString().trim().length > 0) {
      lcOsNume = loNrNume.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  if (lcOsNume.length == 0) {
    limpaCamposOrdemServicoCOA();

    return;
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    alerta("obra inválida", "alerta");

    limpaCamposOrdemServicoCOA();

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

  limpaCamposOrdemServicoCOA();

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

          consultaCOA(lmWkRsql[0]);

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

function pesquisaOrdensServicoCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
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

function alteraStatusRecursoCOA() {
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loLiJflt = document.getElementById("lliJfltCOA");
  var loLiObsr = document.getElementById("lliObsrCOA");
  var loLiNume = document.getElementById("lliNumeCOA");
  var loLiDatv = document.getElementById("lliDatvCOA");
  var lnSrDisp = 0,
    lnIdStrc = 0;

  limpaCamposStatusCOA();

  try {
    if (parseInt(loSlStrc.value.toString().split("/")[0].trim()) > 0) {
      lnIdStrc = parseInt(loSlStrc.value.toString().split("/")[0].trim());
      lnSrDisp = parseInt(loSlStrc.value.toString().split("/")[1].trim());
    }
  } catch (e) {}

  if (lnIdStrc == 0) {
    return;
  }

  if (lnSrDisp == 4) {
    pesquisaJustificativasFaltaCOA();

    loLiJflt.style.display = "";
  }

  if (lnSrDisp > 1) {
    pesquisaJornadaCOA(null);

    loLiDatv.style.display = "";
  } else if (lnSrDisp > 0) {
    loLiNume.style.display = "";
  } else {
    loLiObsr.style.display = "";
  }
}

function consultaDataCOA() {
  var loDtData = document.getElementById("datDataCOA");

  if (
    loDtData.defaultValue.toString().trim().toUpperCase() ==
    loDtData.value.toString().trim().toUpperCase()
  ) {
    return;
  }

  pesquisaSomenteRecursosCOA();
}

function pesquisaRecursosCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loDvRcso = document.getElementById("divRcsoCOA");
  var loDvCard = document.getElementById("divCardCOA");
  var lcWkIsql = "";
  var lnIdCadt = 0;
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDrData = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value.toString().trim());
  } else {
    app.input.validate(loDtData);

    return;
  }

  if (ldDrData > ldDtHoje) {
    return;
  }

  if (gmDrRcsoCDR.length == 0) {
    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
      { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(ldDrData) },
    ];

    lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

    $.ajax({
      url:
        goCdUser.ws_http.trim() +
        "chamadaProcedure?lcWkIsql=" +
        lcWkIsql +
        "&lcWkProc=pesquisaRecursos",
      type: "GET",
      dataType: "jsonp",

      success: function (lmWkRsql) {
        gmDrRcsoCDR = lmWkRsql;
      },
      error: function (jqXHR, textStatus, err) {},
    });
  }

  ldDrData.setDate(ldDrData.getDate() - 1);

  while (!isBusinessDay(ldDrData)) {
    ldDrData.setDate(ldDrData.getDate() - 1);
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(ldDrData) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmDrRcsoCOA = lmWkRsql;

      apontamentosPendentesCOA();
    },
    error: function (jqXHR, textStatus, err) {
      loDvRcso.style.display = "";
      loDvCard.style.display = "";
    },
  });
}

function pesquisaJornadaRecursosCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var ldDtHoje = new Date(),
    ldApData = new Date();
  var lcWkIsql = "",
    lcApData = "";
  var lmWkIsql = [];
  var lnIdClie = 0;

  ldDtHoje.setHours(0, 0, 0, 0);
  ldApData.setHours(0, 0, 0, 0);

  gmDrJornCOA = [];

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

  ldApData = htmlDataParaObjetoData(loDtData.value);

  if (ldDtHoje < ldApData) {
    ldApData = ldDtHoje;
  }

  lcApData = objetoDataParaStringSqlData(ldApData);

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaJornadaRecursos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmDrJornCOA = lmWkRsql;
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaFeriadoCOA() {
  var loCbFeri = document.getElementById("chbFeriCOA");
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var lcWkIsql = "",
    lcDrData = "",
    lcIdEsta = "",
    lcIdCida = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();
  var lnIdClie = 0;

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    lcDrData = loDtData.value.toString().trim();
  } else {
    return;
  }

  if (htmlDataParaObjetoData(lcDrData) > ldDtHoje) {
    return;
  }

  try {
    if (loSlObra.value.toString().split("/")[2].trim().length > 0) {
      lcIdEsta = loSlObra.value.toString().split("/")[2].trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (loSlObra.value.toString().split("/")[3].trim().length > 0) {
      lcIdCida = loSlObra.value.toString().split("/")[3].trim().toUpperCase();
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "ldIdFeri", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(lcDrData)) },
    { pa_nome: "lcIdEsta", pa_tipo: "VarChar", pa_valo: lcIdEsta },
    { pa_nome: "lcIdCida", pa_tipo: "VarChar", pa_valo: lcIdCida },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaFeriado",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loCbFeri.checked = true;
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaSomenteRecursosCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loDvRcso = document.getElementById("divRcsoCOA");
  var loDvCard = document.getElementById("divCardCOA");
  var lcWkIsql = "",
    lcDrData = "";
  var lnIdCadt = 0;
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldStDias = new Date(),
    ldFuFcon = new Date(),
    ldFuDpro = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldStDias.setHours(0, 0, 0, 0);
  ldFuFcon.setHours(0, 0, 0, 0);
  ldFuDpro.setHours(0, 0, 0, 0);

  ldStDias.setDate(ldStDias.getDate() + 7);

  limpaCamposCOA();

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    lcDrData = loDtData.value.toString().trim();
  } else {
    app.input.validate(loDtData);

    return;
  }

  if (htmlDataParaObjetoData(lcDrData) > ldDtHoje) {
    alerta("data do apontamento maior que data atual", "alerta");

    return;
  }

  consultaFeriadoCOA();
  pesquisaJornadaCOA(null);
  pesquisaJornadaRecursosCOA();

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSomenteRecursos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmSmRcsoCOA = lmWkRsql;

      for (var i = 0; i < gmSmRcsoCOA.length; i++) {
        ldFuFcon = stringDataParaObjetoData(jsonDate(gmSmRcsoCOA[i].fu_fcon));
        ldFuDpro = stringDataParaObjetoData(jsonDate(gmSmRcsoCOA[i].fu_dpro));

        if (ldFuDpro > ldFuFcon) {
          ldFuFcon = ldFuDpro;
        }

        if (ldDtHoje <= ldFuFcon && ldFuFcon <= ldStDias) {
          alerta(
            "existem recursos com data de rescisão nos próximos 7 dias",
            "alerta"
          );

          break;
        }
      }

      loDvRcso.style.display = "";
      loDvCard.style.display = "";
    },
    error: function (jqXHR, textStatus, err) {
      loDvRcso.style.display = "";
      loDvCard.style.display = "";
    },
  });
}

function calculaMinutosCOA(lcApHent, lcApHiin, lcApHtin, lcApHter) {
  var loDtData = document.getElementById("datDataCOA");
  var lnApJdms = 0,
    lnApJmms = 0,
    lnApJtms = 0;
  var ldDrData = new Date(),
    ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [];

  ldDrData.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  } else {
    loDtData.defaultValue = loDtData.value;

    loDtData.valueAsDate = ldDrData;

    consultaDataCOA();
  }

  try {
    if (lcApHent.trim().length > 0) {
      ldApHent = new Date(ldDrData);

      lmHrHora = lcApHent.trim().split(":");

      ldApHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHiin.trim().length > 0) {
      ldApHiin = new Date(ldDrData);

      lmHrHora = lcApHiin.trim().split(":");

      ldApHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHtin.trim().length > 0) {
      ldApHtin = new Date(ldDrData);

      lmHrHora = lcApHtin.trim().split(":");

      ldApHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHter.trim().length > 0) {
      ldApHter = new Date(ldDrData);

      lmHrHora = lcApHter.trim().split(":");

      ldApHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  if (ldApHent.getFullYear() > 1900 && ldApHiin.getFullYear() > 1900) {
    if (ldApHent <= ldApHiin) {
      lnApJmms = ldApHiin - ldApHent;
    } else {
      ldApHiin = ldApHiin.addDays(1);

      if (ldApHtin.getFullYear() > 1900) {
        ldApHtin = ldApHtin.addDays(1);
      }

      if (ldApHter.getFullYear() > 1900) {
        ldApHter = ldApHter.addDays(1);
      }

      lnApJmms = ldApHiin - ldApHent;
    }
  }

  if (
    ldApHiin.getFullYear() > 1900 &&
    ldApHtin.getFullYear() > 1900 &&
    ldApHiin > ldApHtin
  ) {
    ldApHtin = ldApHtin.addDays(1);

    if (ldApHter.getFullYear() > 1900) {
      ldApHter = ldApHter.addDays(1);
    }
  }

  if (ldApHtin.getFullYear() > 1900 && ldApHter.getFullYear() > 1900) {
    if (ldApHtin <= ldApHter) {
      lnApJtms = ldApHter - ldApHtin;
    } else {
      ldApHter = ldApHter.addDays(1);

      lnApJtms = ldApHter - ldApHtin;
    }
  }

  lnApJdms = lnApJmms + lnApJtms;

  return Math.floor(lnApJdms / (1000 * 60));
}

function consultaDivergenciasApontamentosCOA() {
  var loSlObra = document.getElementById("sltObraCOA"),
    loHrHent = document.getElementById("hraHentCOA"),
    loHrHiin = document.getElementById("hraHiinCOA"),
    loHrHtin = document.getElementById("hraHtinCOA"),
    loHrHter = document.getElementById("hraHterCOA");
  var lmApFunc = [];
  var lnApMnse = 0,
    lnApMnap = 0,
    lnIdClie = 0;

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    try {
      if (
        gmSmRcsoCOA[i].dr_chck &&
        gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "F"
      ) {
        lmApFunc.push({
          fu_empr: gmSmRcsoCOA[i].fu_empr.trim().toUpperCase(),
          id_matr: parseInt(gmSmRcsoCOA[i].id_matr),
          cb_tmdo: gmSmRcsoCOA[i].cb_tmdo.trim().toUpperCase(),
          fu_func: gmSmRcsoCOA[i].fu_func.trim().toUpperCase(),
          fu_nome: gmSmRcsoCOA[i].fu_nome.trim().toUpperCase(),
        });
      }
    } catch (error) {}
  }

  for (var i = 0; i < lmApFunc.length; i++) {
    lnApMnse = 0;
    lnApMnap = 0;

    for (var j = 0; j < gmApSecuCOA.length; j++) {
      if (
        lmApFunc[i].fu_empr.trim().toUpperCase() ==
          gmApSecuCOA[j].fu_empr.trim().toUpperCase() &&
        parseInt(lmApFunc[i].id_matr) == parseInt(gmApSecuCOA[j].id_matr)
      ) {
        lnApMnse += calculaMinutosCOA(
          pad(gmApSecuCOA[j].as_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCOA[j].as_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCOA[j].as_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCOA[j].as_hter.toFixed(2), 5).replace(".", ":")
        );
      }
    }

    for (var j = 0; j < gmApFuncCOA.length; j++) {
      if (
        lmApFunc[i].fu_empr.trim().toUpperCase() ==
          gmApFuncCOA[j].fu_empr.trim().toUpperCase() &&
        parseInt(lmApFunc[i].id_matr) == parseInt(gmApFuncCOA[j].id_matr)
      ) {
        lnApMnap += calculaMinutosCOA(
          pad(gmApFuncCOA[j].ap_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCOA[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCOA[j].ap_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCOA[j].ap_hter.toFixed(2), 5).replace(".", ":")
        );
      }
    }

    lnApMnap += calculaMinutosCOA(
      loHrHent.value.toString().trim(),
      loHrHiin.value.toString().trim(),
      loHrHtin.value.toString().trim(),
      loHrHter.value.toString().trim()
    );

    if (
      lnApMnse > 0 &&
      ((Math.abs(lnApMnse - lnApMnap) > 15 && lnIdClie != 69) ||
        (Math.abs(lnApMnse - lnApMnap) > 20 && lnIdClie == 69))
    ) {
      redireciona("custom/gre/coml/ComlApSecu.html", "ComlApSecu.html");

      return;
    }
  }

  insereApontamentoCOA();
}

function pesquisaApontamentosFuncionariosCOA() {
  var loDtData = document.getElementById("datDataCOA");
  var lcApData = loDtData.value.toString().trim().toUpperCase();
  var lcWkIsql = "",
    lcIdMatr = "";
  var lmWkIsql = [];

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    try {
      if (
        gmSmRcsoCOA[i].dr_chck &&
        gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "F"
      ) {
        lcIdMatr +=
          gmSmRcsoCOA[i].id_matr.toString() +
          gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() +
          ", ";
      }
    } catch (error) {}
  }

  if (lcIdMatr.trim().length > 0) {
    lcIdMatr = lcIdMatr.trim().slice(0, -1);
  } else {
    insereApontamentoCOA();

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
    { pa_nome: "lcIdMatr", pa_tipo: "VarChar", pa_valo: lcIdMatr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaApontamentosFuncionarios",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmApFuncCOA = lmWkRsql;
        }
      } catch (error) {}

      consultaDivergenciasApontamentosCOA(false);
    },
    error: function (jqXHR, textStatus, err) {
      consultaDivergenciasApontamentosCOA(false);
    },
  });
}

function novoApontamentoCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loSlObra.selectedIndex = 0;

  loDtData.valueAsDate = ldDtHoje;

  limpaCamposCOA();
}

function enviaEmailFaltaJustificadaCOA(lmEmRcso, loApApnt) {
  var lcPgAtua = document
    .getElementsByClassName("page-current")[0]
    .getAttribute("data-name");
  var lcMgTitu = "Apontamento de falta justificada",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApRcso = "",
    lcApFoto = "";
  var loWkIsql = {},
    loDgFjst = {};
  var lmEmAnxo = [];

  lcEmTitu =
    "Apontamento de falta justificada da obra " +
    loApApnt.cl_fant.trim().toUpperCase() +
    " do dia " +
    jsonDate(loApApnt.ap_data);

  if (pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHent = "";
  } else {
    lcApHent = pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHiin = "";
  } else {
    lcApHiin = pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHtin = "";
  } else {
    lcApHtin = pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHter = "";
  } else {
    lcApHter = pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":");
  }

  //prettier-ignore
  for (var i = 0; i < lmEmRcso.length; i++) {
    lcApRcso +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].id_matr.toString() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].cb_tmdo.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_nome.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_func.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  for (var i = 0; i < gmApFotoCOA.length; i++) {
    lcApFoto +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          "<img src='" + goCdUser.ws_wiis.trim().toLowerCase() + "fotos/apontamentos/" + loApApnt.id_apnt.toString() + "/" + gmApFotoCOA[i].wk_foto.trim() + "' style='width: 200px;'>" +
        "</td>" +
      "</tr>";
    
    lmEmAnxo.push({
      an_path: "fotos/apontamentos/" + loApApnt.id_apnt.toString() + "/" + gmApFotoCOA[i].wk_foto.trim(),
      an_nome: "apontamento_" + loApApnt.id_apnt.toString() + "_falta_justificada_" + (i + 1).toString() + ".png",
      an_tipo: "image/png"
    });
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "obra: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.cl_fant.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "justificativa da falta: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.jf_deno.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHent +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHiin +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHtin +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHter +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "total: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          calculaTotalHorasCOA(loApApnt) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "apontador: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.id_user.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "descrição das atividades: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ap_datv.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      "<tr>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "código" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "tipo" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "recurso" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "função" +
        "</th>" +
      "</tr>" +
      lcApRcso +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      lcApFoto +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "planejamento.sede@gruporeall.com.br;diretoria@gruporeall.com.br;oliveira@gruporeall.com.br;barravieira@gruporeall.com.br;l.paiva@gruporeall.com.br;freitas@gruporeall.com.br;gilto@gruporeall.com.br;l.vicente@gruporeall.com.br;paiola@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br;paulo@gruporeall.com.br;raissa@gruporeall.com.br;naraiane@gruporeall.com.br",
    em_host: "mail.gruporeall.com.br",
    em_pass: "@Reall@2022",
    mg_titu: lcMgTitu,
    em_msgm: lcWkMsgm,
    em_titu: lcEmTitu,
  };

  loDgFjst = app.dialog.progress(
    "finalizando apontamento de falta justificada"
  );

  $.ajax({
    url: goCdUser.ws_http.trim() + "enviaEmail",
    type: "POST",
    data: {
      lcEnMail: encodeURIComponent(JSON.stringify(loWkIsql)),
      lcEmAnxo: encodeURIComponent(JSON.stringify(lmEmAnxo)),
    },

    success: function (loWkRsql) {
      loDgFjst.close();

      try {
        if (loWkRsql.em_envi) {
          notificacao("apontamento salvo", "sucesso");

          novoApontamentoCOA();

          if (lcPgAtua.trim().toUpperCase() == "COMLAPSECU") {
            goMnView.router.back();
          }

          return;
        }
      } catch (loApErro) {}

      enviaEmailFaltaJustificadaCOA(lmEmRcso, loApApnt);
    },
    error: function (jqXHR, textStatus, err) {
      loDgFjst.close();

      enviaEmailFaltaJustificadaCOA(lmEmRcso, loApApnt);
    },
  });
}

function enviaEmailAfastadoAtestadoCOA(lmEmRcso, loApApnt) {
  var lcPgAtua = document
    .getElementsByClassName("page-current")[0]
    .getAttribute("data-name");
  var lcMgTitu = "Apontamento de afastamento ou atestado",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApRcso = "",
    lcApFoto = "";
  var loWkIsql = {},
    loDgAtes = {};
  var lmEmAnxo = [];

  lcEmTitu =
    "Apontamento de afastamento ou atestado da obra " +
    loApApnt.cl_fant.trim().toUpperCase() +
    " do dia " +
    jsonDate(loApApnt.ap_data);

  if (pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHent = "";
  } else {
    lcApHent = pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHiin = "";
  } else {
    lcApHiin = pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHtin = "";
  } else {
    lcApHtin = pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHter = "";
  } else {
    lcApHter = pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":");
  }

  //prettier-ignore
  for (var i = 0; i < lmEmRcso.length; i++) {
    lcApRcso +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].id_matr.toString() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].cb_tmdo.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_nome.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_func.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  for (var i = 0; i < gmApFotoCOA.length; i++) {
    lcApFoto +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          "<img src='" + goCdUser.ws_wiis.trim().toLowerCase() + "fotos/apontamentos/" + loApApnt.id_apnt.toString() + "/" + gmApFotoCOA[i].wk_foto.trim() + "' style='width: 200px;'>" +
        "</td>" +
      "</tr>";
    
    lmEmAnxo.push({
      an_path: "fotos/apontamentos/" + loApApnt.id_apnt.toString() + "/" + gmApFotoCOA[i].wk_foto.trim(),
      an_nome: "apontamento_" + loApApnt.id_apnt.toString() + "_atestado_" + (i + 1).toString() + ".png",
      an_tipo: "image/png"
    });
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "obra: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.cl_fant.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHent +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHiin +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHtin +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHter +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "total: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          calculaTotalHorasCOA(loApApnt) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "apontador: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.id_user.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "descrição das atividades: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ap_datv.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      "<tr>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "código" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "tipo" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "recurso" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "função" +
        "</th>" +
      "</tr>" +
      lcApRcso +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      lcApFoto +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "planejamento.sede@gruporeall.com.br;diretoria@gruporeall.com.br;oliveira@gruporeall.com.br;barravieira@gruporeall.com.br;l.paiva@gruporeall.com.br;freitas@gruporeall.com.br;gilto@gruporeall.com.br;l.vicente@gruporeall.com.br;paiola@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br;paulo@gruporeall.com.br;raissa@gruporeall.com.br;naraiane@gruporeall.com.br",
    em_host: "mail.gruporeall.com.br",
    em_pass: "@Reall@2022",
    mg_titu: lcMgTitu,
    em_msgm: lcWkMsgm,
    em_titu: lcEmTitu,
  };

  loDgAtes = app.dialog.progress(
    "finalizando apontamento de afastamento ou atestado"
  );

  $.ajax({
    url: goCdUser.ws_http.trim() + "enviaEmail",
    type: "POST",
    data: {
      lcEnMail: encodeURIComponent(JSON.stringify(loWkIsql)),
      lcEmAnxo: encodeURIComponent(JSON.stringify(lmEmAnxo)),
    },

    success: function (loWkRsql) {
      loDgAtes.close();

      try {
        if (loWkRsql.em_envi) {
          notificacao("apontamento salvo", "sucesso");

          novoApontamentoCOA();

          if (lcPgAtua.trim().toUpperCase() == "COMLAPSECU") {
            goMnView.router.back();
          }

          return;
        }
      } catch (loApErro) {}

      enviaEmailAfastadoAtestadoCOA(lmEmRcso, loApApnt);
    },
    error: function (jqXHR, textStatus, err) {
      loDgAtes.close();

      enviaEmailAfastadoAtestadoCOA(lmEmRcso, loApApnt);
    },
  });
}

function insereFotoCOA(i, llRiPior, lnIdStrc, lmEmRcso, loApApnt) {
  var lcWkFoto = "";

  if (i >= gmApFotoCOA.length) {
    goDgFotoCOA.close();

    if (lnIdStrc == 2) {
      enviaEmailAfastadoAtestadoCOA(lmEmRcso, loApApnt);
    } else if (lnIdStrc == 16) {
      enviaEmailFaltaJustificadaCOA(lmEmRcso, loApApnt);
    } else {
      notificacao("apontamento salvo", "sucesso");

      novoApontamentoCOA();
    }

    return;
  }

  if (gmApFotoCOA[i].ap_foto.trim().indexOf("base64") > 0) {
    lcWkFoto = Math.random().toString(36).substring(7) + ".png";

    gmApFotoCOA[i]["wk_foto"] = lcWkFoto;

    $.ajax({
      url: goCdUser.ws_http.trim() + "insereFoto",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        lcBsFoto: gmApFotoCOA[i].ap_foto,
        lcWkPath: "apontamentos/" + goApApntCOA.id_apnt.toString() + "/",
        lcWkFoto: lcWkFoto,
      }),

      success: function (loWkRsql) {
        insereFotoCOA(i + 1, false, lnIdStrc, lmEmRcso, loApApnt);
      },
      error: function (jqXHR, textStatus, err) {
        if (llRiPior) {
          redimensionaImagemPiorQualidade(
            gmApFotoCOA[i].ap_foto,
            function (lcNvBase) {
              gmApFotoCOA[i].ap_foto = lcNvBase;

              insereFotoCOA(i, false, lnIdStrc, lmEmRcso, loApApnt);
            }
          );
        } else {
          redimensionaImagem(gmApFotoCOA[i].ap_foto, function (lcNvBase) {
            gmApFotoCOA[i].ap_foto = lcNvBase;

            insereFotoCOA(i, true, lnIdStrc, lmEmRcso, loApApnt);
          });
        }
      },
    });
  } else {
    insereFotoCOA(i + 1, false, lnIdStrc, lmEmRcso, loApApnt);
  }
}

function enviaEmailResponsabilidadeCOA(lmEmRcso, loApApnt) {
  var lcMgTitu = "",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApRcso = "",
    lcIdJust = "",
    lcRjDeno = loApApnt.rj_deno.trim().toUpperCase(),
    lcSiDeno = loApApnt.si_deno.trim().toUpperCase();
  var loWkIsql = {};

  if (parseInt(loApApnt.id_rpju) == 1 || parseInt(loApApnt.id_rpju) == 2) {
    lcMgTitu = "Apontamento de responsabilidade";
    lcEmTitu =
      "Apontamento de responsabilidade da " +
      lcRjDeno +
      " na obra " +
      loApApnt.cl_fant.trim().toUpperCase() +
      " do dia " +
      jsonDate(loApApnt.ap_data);
  } else {
    lcMgTitu = "Apontamento de " + lcSiDeno.trim().toUpperCase();
    lcEmTitu =
      "Apontamento de " +
      lcSiDeno.trim().toUpperCase() +
      " na obra " +
      loApApnt.cl_fant.trim().toUpperCase() +
      " do dia " +
      jsonDate(loApApnt.ap_data);
  }

  if (pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHent = "";
  } else {
    lcApHent = pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHiin = "";
  } else {
    lcApHiin = pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHtin = "";
  } else {
    lcApHtin = pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHter = "";
  } else {
    lcApHter = pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":");
  }

  if (parseInt(loApApnt.id_just) > 0) {
    //prettier-ignore
    lcIdJust =
      "<tr>" +
        "<td style='text-align: right;'>" +
          "justificativa: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ju_deno.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "observação da justificativa: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ap_obju.trim().toUpperCase() +
        "</b></td>" +
      "</tr>";
  }

  //prettier-ignore
  for (var i = 0; i < lmEmRcso.length; i++) {
    lcApRcso +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].id_matr.toString() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].cb_tmdo.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_nome.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_func.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "apontador: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.id_user.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "obra: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.cl_fant.trim().toUpperCase() +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "proposta: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.os_nume.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHent +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHiin +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHtin +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHter +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "total: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          calculaTotalHorasCOA(loApApnt) +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "situação do recurso: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.si_deno.trim().toUpperCase() +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "responsabilidade: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcRjDeno +
        "</b></td>" +
      "</tr>" + 
      lcIdJust +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      "<tr>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "código" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "tipo" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "recurso" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "função" +
        "</th>" +
      "</tr>" +
      lcApRcso +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "planejamento.sede@gruporeall.com.br;diretoria@gruporeall.com.br;oliveira@gruporeall.com.br;barravieira@gruporeall.com.br;l.paiva@gruporeall.com.br;freitas@gruporeall.com.br;murilo@gruporeall.com.br;gilto@gruporeall.com.br;l.vicente@gruporeall.com.br;paiola@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br",
    em_host: "mail.gruporeall.com.br",
    em_pass: "@Reall@2022",
    mg_titu: lcMgTitu,
    em_msgm: lcWkMsgm,
    em_titu: lcEmTitu,
  };

  $.ajax({
    url: goCdUser.ws_http.trim() + "enviaEmail",
    type: "POST",
    data: {
      lcEnMail: encodeURIComponent(JSON.stringify(loWkIsql)),
    },

    success: function (loWkRsql) {
      try {
        if (loWkRsql.em_envi) {
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function calculaTotalHorasCOA(loApApnt) {
  var lnApJdms = 0,
    lnApJmms = 0,
    lnApJtms = 0,
    lnHrHora = 0,
    lnHrMnto = 0;
  var ldApData = new Date(),
    ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [];

  ldApData.setHours(0, 0, 0, 0);

  if (jsonDate(loApApnt.ap_data).trim().length > 0) {
    ldApData = stringDataParaObjetoData(jsonDate(loApApnt.ap_data));
  }

  try {
    if (parseFloat(loApApnt.ap_hent) > 0) {
      ldApHent = new Date(ldApData);

      lmHrHora = loApApnt.ap_hent.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHent.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_hiin) > 0) {
      ldApHiin = new Date(ldApData);

      lmHrHora = loApApnt.ap_hiin.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHiin.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_htin) > 0) {
      ldApHtin = new Date(ldApData);

      lmHrHora = loApApnt.ap_htin.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHtin.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_hter) > 0) {
      ldApHter = new Date(ldApData);

      lmHrHora = loApApnt.ap_hter.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHter.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  if (ldApHent.getFullYear() > 1900 && ldApHiin.getFullYear() > 1900) {
    if (ldApHent <= ldApHiin) {
      lnApJmms = ldApHiin - ldApHent;
    } else {
      ldApHiin = ldApHiin.addDays(1);

      if (ldApHtin.getFullYear() > 1900) {
        ldApHtin = ldApHtin.addDays(1);
      }

      if (ldApHter.getFullYear() > 1900) {
        ldApHter = ldApHter.addDays(1);
      }

      lnApJmms = ldApHiin - ldApHent;
    }
  }

  if (
    ldApHiin.getFullYear() > 1900 &&
    ldApHtin.getFullYear() > 1900 &&
    ldApHiin > ldApHtin
  ) {
    ldApHtin = ldApHtin.addDays(1);

    if (ldApHter.getFullYear() > 1900) {
      ldApHter = ldApHter.addDays(1);
    }
  }

  if (ldApHtin.getFullYear() > 1900 && ldApHter.getFullYear() > 1900) {
    if (ldApHtin <= ldApHter) {
      lnApJtms = ldApHter - ldApHtin;
    } else {
      ldApHter = ldApHter.addDays(1);

      lnApJtms = ldApHter - ldApHtin;
    }
  }

  lnApJdms = lnApJmms + lnApJtms;

  if (lnApJdms > 0) {
    return (
      pad(Math.floor(lnApJdms / (1000 * 60 * 60)), 2) +
      ":" +
      pad((lnApJdms % (1000 * 60 * 60)) / (1000 * 60), 2)
    );
  } else {
    return "";
  }
}

function enviaEmailAbonoCOA(lmEmRcso, loApApnt) {
  var lcMgTitu = "Apontamento de abono",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApRcso = "";
  var loWkIsql = {},
    loDgAbno = {};

  lcEmTitu =
    "Apontamento de abono da obra " +
    loApApnt.cl_fant.trim().toUpperCase() +
    " do dia " +
    jsonDate(loApApnt.ap_data);

  if (pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHent = "";
  } else {
    lcApHent = pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHiin = "";
  } else {
    lcApHiin = pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHtin = "";
  } else {
    lcApHtin = pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHter = "";
  } else {
    lcApHter = pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":");
  }

  //prettier-ignore
  for (var i = 0; i < lmEmRcso.length; i++) {
    lcApRcso +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].id_matr.toString() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].cb_tmdo.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_nome.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_func.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "obra: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.cl_fant.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHent +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHiin +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHtin +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHter +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "total: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          calculaTotalHorasCOA(loApApnt) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "apontador: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.id_user.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "descrição das atividades: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ap_datv.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      "<tr>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "código" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "tipo" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "recurso" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "função" +
        "</th>" +
      "</tr>" +
      lcApRcso +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "planejamento.sede@gruporeall.com.br;diretoria@gruporeall.com.br;oliveira@gruporeall.com.br;barravieira@gruporeall.com.br;l.paiva@gruporeall.com.br;freitas@gruporeall.com.br;gilto@gruporeall.com.br;l.vicente@gruporeall.com.br;paiola@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br;paulo@gruporeall.com.br;raissa@gruporeall.com.br;naraiane@gruporeall.com.br",
    em_host: "mail.gruporeall.com.br",
    em_pass: "@Reall@2022",
    mg_titu: lcMgTitu,
    em_msgm: lcWkMsgm,
    em_titu: lcEmTitu,
  };

  loDgAbno = app.dialog.progress("finalizando apontamento abono");

  $.ajax({
    url: goCdUser.ws_http.trim() + "enviaEmail",
    type: "POST",
    data: {
      lcEnMail: encodeURIComponent(JSON.stringify(loWkIsql)),
    },

    success: function (loWkRsql) {
      loDgAbno.close();

      try {
        if (loWkRsql.em_envi) {
          return;
        }
      } catch (loApErro) {}

      enviaEmailAbonoCOA(lmEmRcso, loApApnt);
    },
    error: function (jqXHR, textStatus, err) {
      loDgAbno.close();

      enviaEmailAbonoCOA(lmEmRcso, loApApnt);
    },
  });
}

function enviaEmailDispensadoCOA(lmEmRcso, loApApnt) {
  var lcMgTitu = "Apontamento de dispensa",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApRcso = "";
  var loWkIsql = {},
    loDgAbno = {};

  lcEmTitu =
    "Apontamento de dispensa da obra " +
    loApApnt.cl_fant.trim().toUpperCase() +
    " do dia " +
    jsonDate(loApApnt.ap_data);

  if (pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHent = "";
  } else {
    lcApHent = pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHiin = "";
  } else {
    lcApHiin = pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHtin = "";
  } else {
    lcApHtin = pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHter = "";
  } else {
    lcApHter = pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":");
  }

  //prettier-ignore
  for (var i = 0; i < lmEmRcso.length; i++) {
    lcApRcso +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].id_matr.toString() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].cb_tmdo.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_nome.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_func.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "obra: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.cl_fant.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "justificativa da dispensa: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.jf_deno.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHent +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHiin +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHtin +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHter +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "total: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          calculaTotalHorasCOA(loApApnt) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "apontador: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.id_user.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "descrição das atividades: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ap_datv.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      "<tr>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "código" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "tipo" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "recurso" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "função" +
        "</th>" +
      "</tr>" +
      lcApRcso +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "planejamento.sede@gruporeall.com.br;diretoria@gruporeall.com.br;oliveira@gruporeall.com.br;barravieira@gruporeall.com.br;l.paiva@gruporeall.com.br;freitas@gruporeall.com.br;gilto@gruporeall.com.br;l.vicente@gruporeall.com.br;paiola@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br;paulo@gruporeall.com.br",
    em_host: "mail.gruporeall.com.br",
    em_pass: "@Reall@2022",
    mg_titu: lcMgTitu,
    em_msgm: lcWkMsgm,
    em_titu: lcEmTitu,
  };

  loDgAbno = app.dialog.progress("finalizando apontamento de dispensa");

  $.ajax({
    url: goCdUser.ws_http.trim() + "enviaEmail",
    type: "POST",
    data: {
      lcEnMail: encodeURIComponent(JSON.stringify(loWkIsql)),
    },

    success: function (loWkRsql) {
      loDgAbno.close();

      try {
        if (loWkRsql.em_envi) {
          return;
        }
      } catch (loApErro) {}

      enviaEmailDispensadoCOA(lmEmRcso, loApApnt);
    },
    error: function (jqXHR, textStatus, err) {
      loDgAbno.close();

      enviaEmailDispensadoCOA(lmEmRcso, loApApnt);
    },
  });
}

function enviaEmailTransferenciaCOA(lmEmRcso, loApApnt) {
  var lcMgTitu = "Apontamento de transferência",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApRcso = "";
  var loWkIsql = {},
    loDgTrnf = {};

  lcEmTitu =
    "Apontamento de transferência da obra " +
    loApApnt.cl_fant.trim().toUpperCase() +
    " do dia " +
    jsonDate(loApApnt.ap_data);

  if (pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHent = "";
  } else {
    lcApHent = pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHiin = "";
  } else {
    lcApHiin = pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHtin = "";
  } else {
    lcApHtin = pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHter = "";
  } else {
    lcApHter = pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":");
  }

  //prettier-ignore
  for (var i = 0; i < lmEmRcso.length; i++) {
    lcApRcso +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].id_matr.toString() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].cb_tmdo.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_nome.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_func.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "obra: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.cl_fant.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHent +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHiin +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHtin +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHter +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "total: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          calculaTotalHorasCOA(loApApnt) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "apontador: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.id_user.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "descrição das atividades: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ap_datv.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      "<tr>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "código" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "tipo" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "recurso" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "função" +
        "</th>" +
      "</tr>" +
      lcApRcso +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "planejamento.sede@gruporeall.com.br;diretoria@gruporeall.com.br;oliveira@gruporeall.com.br;barravieira@gruporeall.com.br;l.paiva@gruporeall.com.br;freitas@gruporeall.com.br;gilto@gruporeall.com.br;l.vicente@gruporeall.com.br;paiola@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br;paulo@gruporeall.com.br",
    em_host: "mail.gruporeall.com.br",
    em_pass: "@Reall@2022",
    mg_titu: lcMgTitu,
    em_msgm: lcWkMsgm,
    em_titu: lcEmTitu,
  };

  loDgTrnf = app.dialog.progress("finalizando apontamento transferência");

  $.ajax({
    url: goCdUser.ws_http.trim() + "enviaEmail",
    type: "POST",
    data: {
      lcEnMail: encodeURIComponent(JSON.stringify(loWkIsql)),
    },

    success: function (loWkRsql) {
      loDgTrnf.close();

      try {
        if (loWkRsql.em_envi) {
          return;
        }
      } catch (loApErro) {}

      enviaEmailTransferenciaCOA(lmEmRcso, loApApnt);
    },
    error: function (jqXHR, textStatus, err) {
      loDgTrnf.close();

      enviaEmailTransferenciaCOA(lmEmRcso, loApApnt);
    },
  });
}

function enviaEmailFolgaCampoCOA(lmEmRcso, loApApnt) {
  var lcMgTitu = "Apontamento de folga de campo",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApRcso = "";
  var loWkIsql = {},
    loDgFcmp = {};

  lcEmTitu =
    "Apontamento de folga de campo da obra " +
    loApApnt.cl_fant.trim().toUpperCase() +
    " do dia " +
    jsonDate(loApApnt.ap_data);

  if (pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHent = "";
  } else {
    lcApHent = pad(loApApnt.ap_hent.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHiin = "";
  } else {
    lcApHiin = pad(loApApnt.ap_hiin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHtin = "";
  } else {
    lcApHtin = pad(loApApnt.ap_htin.toFixed(2), 5).replace(".", ":");
  }

  if (pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":") == "00:00") {
    lcApHter = "";
  } else {
    lcApHter = pad(loApApnt.ap_hter.toFixed(2), 5).replace(".", ":");
  }

  //prettier-ignore
  for (var i = 0; i < lmEmRcso.length; i++) {
    lcApRcso +=
      "<tr>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].id_matr.toString() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].cb_tmdo.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_nome.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; border-collapse: collapse;'>" +
          lmEmRcso[i].fu_func.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "obra: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.cl_fant.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHent +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHiin +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "entrada: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHtin +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "saída: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          lcApHter +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "total: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          calculaTotalHorasCOA(loApApnt) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "apontador: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.id_user.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "descrição das atividades: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.ap_datv.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
    "</table>" +
    "<br>" +
    "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'>" +
      "<tr>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "código" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "tipo" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "recurso" +
        "</th>" +
        "<th style='border: 1px solid black; border-collapse: collapse;'>" +
          "função" +
        "</th>" +
      "</tr>" +
      lcApRcso +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "planejamento.sede@gruporeall.com.br;diretoria@gruporeall.com.br;oliveira@gruporeall.com.br;barravieira@gruporeall.com.br;l.paiva@gruporeall.com.br;freitas@gruporeall.com.br;gilto@gruporeall.com.br;l.vicente@gruporeall.com.br;paiola@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br;paulo@gruporeall.com.br;raissa@gruporeall.com.br;naraiane@gruporeall.com.br",
    em_host: "mail.gruporeall.com.br",
    em_pass: "@Reall@2022",
    mg_titu: lcMgTitu,
    em_msgm: lcWkMsgm,
    em_titu: lcEmTitu,
  };

  loDgFcmp = app.dialog.progress("finalizando apontamento de folga de campo");

  $.ajax({
    url: goCdUser.ws_http.trim() + "enviaEmail",
    type: "POST",
    data: {
      lcEnMail: encodeURIComponent(JSON.stringify(loWkIsql)),
    },

    success: function (loWkRsql) {
      loDgFcmp.close();

      try {
        if (loWkRsql.em_envi) {
          return;
        }
      } catch (loApErro) {}

      enviaEmailFolgaCampoCOA(lmEmRcso, loApApnt);
    },
    error: function (jqXHR, textStatus, err) {
      loDgFcmp.close();

      enviaEmailFolgaCampoCOA(lmEmRcso, loApApnt);
    },
  });
}

function insereComentarioCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loLiNume = document.getElementById("lliNumeCOA");
  var loNrNume = document.getElementById("nroNumeCOA");
  var loTaCmnt = document.getElementById("txaCmntCOA");
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
    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    return;
  } else {
    lcCmData = loDtData.value.toString().trim().toUpperCase();
  }

  if (
    loLiNume.style.display.trim().length == 0 &&
    loNrNume.value.toString().trim().length == 0
  ) {
    alerta("proposta inválida", "alerta");

    return;
  }

  try {
    if (parseInt(goOsLctoCOA.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOA.id_ords);
    }
  } catch (error) {}

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
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereApontamentoCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loCbFeri = document.getElementById("chbFeriCOA");
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loLiJflt = document.getElementById("lliJfltCOA");
  var loSlJflt = document.getElementById("sltJfltCOA");
  var loLiObsr = document.getElementById("lliObsrCOA");
  var loTaObsr = document.getElementById("txaObsrCOA");
  var loLiNume = document.getElementById("lliNumeCOA");
  var loNrNume = document.getElementById("nroNumeCOA");
  var loHrHent = document.getElementById("hraHentCOA");
  var loHrHiin = document.getElementById("hraHiinCOA");
  var loHrHtin = document.getElementById("hraHtinCOA");
  var loHrHter = document.getElementById("hraHterCOA");
  var loSlSirc = document.getElementById("sltSircCOA");
  var loSlJust = document.getElementById("sltJustCOA");
  var loLiObju = document.getElementById("lliObjuCOA");
  var loTaObju = document.getElementById("txaObjuCOA");
  var loSlRpju = document.getElementById("sltRpjuCOA");
  var loNrDres = document.getElementById("nroDresCOA");
  var loTaDatv = document.getElementById("txaDatvCOA");
  var lnIdClie = 0,
    lnIdStrc = 0,
    lnIdOrds = 0,
    lnApHent = 0,
    lnApHiin = 0,
    lnApHtin = 0,
    lnApHter = 0,
    lnIdSirc = 0,
    lnIdJust = 0,
    lnIdRpju = 0,
    lnIdAtiv = 0,
    lnApDres = -1,
    lnApFeri = 0,
    lnIdExcl = 0,
    lnIdJflt = 0;
  var lcApObsr = "",
    lcApObju = "",
    lcApDatv = "",
    lcWkIsql = "",
    lcApData = "",
    lcIdMatr = "",
    lcIdEqto = "";
  var lmWkIsql = [],
    lmEmRcso = [];

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  lcApData = loDtData.value.toString().trim().toUpperCase();

  if (loCbFeri.checked) {
    lnApFeri = 1;
  }

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    try {
      if (gmSmRcsoCOA[i].dr_chck) {
        if (gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "E") {
          lcIdEqto += gmSmRcsoCOA[i].id_matr.toString() + ", ";
        } else {
          lcIdMatr +=
            gmSmRcsoCOA[i].id_matr.toString() +
            gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() +
            ", ";
        }

        lmEmRcso.push(gmSmRcsoCOA[i]);
      }
    } catch (error) {}
  }

  if (lcIdEqto.trim().length > 0) {
    lcIdEqto = lcIdEqto.trim().slice(0, -1);
  }

  if (lcIdMatr.trim().length > 0) {
    lcIdMatr = lcIdMatr.trim().slice(0, -1);
  }

  try {
    if (parseInt(loSlStrc.value.toString().split("/")[0].trim()) > 0) {
      lnIdStrc = parseInt(loSlStrc.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (loLiJflt.style.display.trim().length == 0) {
    try {
      if (parseInt(loSlJflt.value) > 0) {
        lnIdJflt = parseInt(loSlJflt.value);
      }
    } catch (error) {}
  }

  if (loLiObsr.style.display.trim().length == 0) {
    lcApObsr = loTaObsr.value.toString().trim().toUpperCase();
  }

  if (
    loLiNume.style.display.trim().length == 0 &&
    loNrNume.value.toString().trim().length > 0
  ) {
    try {
      if (parseInt(goOsLctoCOA.id_ords) > 0) {
        lnIdOrds = parseInt(goOsLctoCOA.id_ords);
      }
    } catch (error) {}
  }

  if (
    loHrHent.value.toString().trim().length > 0 &&
    loHrHent.value.toString().trim() != "00:00"
  ) {
    lnApHent = parseFloat(loHrHent.value.toString().replace(":", "."));
  }

  if (
    loHrHiin.value.toString().trim().length > 0 &&
    loHrHiin.value.toString().trim() != "00:00"
  ) {
    lnApHiin = parseFloat(loHrHiin.value.toString().replace(":", "."));
  }

  if (
    loHrHtin.value.toString().trim().length > 0 &&
    loHrHtin.value.toString().trim() != "00:00"
  ) {
    lnApHtin = parseFloat(loHrHtin.value.toString().replace(":", "."));
  }

  if (
    loHrHter.value.toString().trim().length > 0 &&
    loHrHter.value.toString().trim() != "00:00"
  ) {
    lnApHter = parseFloat(loHrHter.value.toString().replace(":", "."));
  }

  try {
    if (parseInt(loSlSirc.value.toString().split("/")[0].trim()) > 0) {
      lnIdSirc = parseInt(loSlSirc.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  try {
    if (parseInt(loSlJust.value) > 0) {
      lnIdJust = parseInt(loSlJust.value);
    }
  } catch (error) {}

  if (loLiObju.style.display.trim().length == 0) {
    lcApObju = loTaObju.value.toString().trim().toUpperCase();
  }

  try {
    if (parseInt(loSlRpju.value) > 0) {
      lnIdRpju = parseInt(loSlRpju.value);
    }
  } catch (error) {}

  try {
    if (goOsTareCOA.at_tipo.trim().toUpperCase() == "A") {
      lnIdAtiv = parseInt(goOsTareCOA.id_ativ);
    } else if (goOsTareCOA.at_tipo.trim().toUpperCase() == "T") {
      lnIdExcl = parseInt(goOsTareCOA.id_excl);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrDres.value) >= 0) {
      lnApDres = parseFloat(loNrDres.value);
    }
  } catch (error) {}

  if (loTaDatv.value.toString().trim().length > 0) {
    lcApDatv = loTaDatv.value.toString().trim().toUpperCase();
  }

  if (lnApDres < 0) {
    lnApDres = 0;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdApnt", pa_tipo: "Int", pa_valo: 0 },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
    { pa_nome: "lnIdStrc", pa_tipo: "Int", pa_valo: lnIdStrc },
    { pa_nome: "lnIdJflt", pa_tipo: "Int", pa_valo: lnIdJflt },
    { pa_nome: "lcApObsr", pa_tipo: "VarChar", pa_valo: lcApObsr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "lnApHent", pa_tipo: "Decimal", pa_valo: lnApHent },
    { pa_nome: "lnApHiin", pa_tipo: "Decimal", pa_valo: lnApHiin },
    { pa_nome: "lnApHtin", pa_tipo: "Decimal", pa_valo: lnApHtin },
    { pa_nome: "lnApHter", pa_tipo: "Decimal", pa_valo: lnApHter },
    { pa_nome: "lnIdSirc", pa_tipo: "Int", pa_valo: lnIdSirc },
    { pa_nome: "lnIdJust", pa_tipo: "Int", pa_valo: lnIdJust },
    { pa_nome: "lcApObju", pa_tipo: "VarChar", pa_valo: lcApObju },
    { pa_nome: "lnIdRpju", pa_tipo: "Int", pa_valo: lnIdRpju },
    { pa_nome: "lnIdAtiv", pa_tipo: "Int", pa_valo: lnIdAtiv },
    { pa_nome: "lnApDres", pa_tipo: "Decimal", pa_valo: lnApDres },
    { pa_nome: "lcApDatv", pa_tipo: "VarChar", pa_valo: lcApDatv },
    { pa_nome: "lnApFeri", pa_tipo: "Int", pa_valo: lnApFeri },
    { pa_nome: "lnIdExcl", pa_tipo: "Int", pa_valo: lnIdExcl },
    { pa_nome: "lcIdMatr", pa_tipo: "VarChar", pa_valo: lcIdMatr },
    { pa_nome: "lcIdEqto", pa_tipo: "VarChar", pa_valo: lcIdEqto }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  insereComentarioCOA();

  app.dialog.progress("enviando apontamento");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereApontamento",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      try {
        if (lmWkRsql[0].ap_erro.trim().length > 0) {
          alerta(lmWkRsql[0].ap_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          goApApntCOA = lmWkRsql[0];

          if (lnIdStrc == 6) {
            enviaEmailFolgaCampoCOA(lmEmRcso, goApApntCOA);
          }

          if (lnIdStrc == 9) {
            enviaEmailTransferenciaCOA(lmEmRcso, goApApntCOA);
          }

          if (lnIdStrc == 10) {
            enviaEmailDispensadoCOA(lmEmRcso, goApApntCOA);
          }

          if (lnIdStrc == 17) {
            enviaEmailAbonoCOA(lmEmRcso, goApApntCOA);
          }

          if (
            lnIdRpju == 1 ||
            lnIdRpju == 2 ||
            lnIdSirc == 4 ||
            lnIdSirc == 5 ||
            lnIdSirc == 3
          ) {
            enviaEmailResponsabilidadeCOA(lmEmRcso, goApApntCOA);
          }

          if (gmApFotoCOA.length > 0) {
            goDgFotoCOA = app.dialog.progress("enviando fotos");

            insereFotoCOA(0, false, lnIdStrc, lmEmRcso, goApApntCOA);
          } else {
            notificacao("apontamento salvo", "sucesso");

            novoApontamentoCOA();
          }
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function pesquisaApontamentosSecullumCOA() {
  var loDtData = document.getElementById("datDataCOA");
  var lcAsData = loDtData.value.toString().trim().toUpperCase();
  var lcWkIsql = "",
    lcIdMatr = "";
  var lmWkIsql = [];

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    try {
      if (
        gmSmRcsoCOA[i].dr_chck &&
        gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "F"
      ) {
        lcIdMatr +=
          gmSmRcsoCOA[i].id_matr.toString() +
          gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() +
          ", ";
      }
    } catch (error) {}
  }

  if (lcIdMatr.trim().length > 0) {
    lcIdMatr = lcIdMatr.trim().slice(0, -1);
  } else {
    insereApontamentoCOA();

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldAsData", pa_tipo: "SmallDatetime", pa_valo: lcAsData },
    { pa_nome: "lcIdMatr", pa_tipo: "VarChar", pa_valo: lcIdMatr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaApontamentosSecullum",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmApSecuCOA = lmWkRsql;

          pesquisaApontamentosFuncionariosCOA();
        } else {
          insereApontamentoCOA();
        }
      } catch (error) {
        insereApontamentoCOA();
      }
    },
    error: function (jqXHR, textStatus, err) {
      insereApontamentoCOA();
    },
  });
}

function validaApontamentoCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loLiStrc = document.getElementById("lliStrcCOA");
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loLiJflt = document.getElementById("lliJfltCOA");
  var loSlJflt = document.getElementById("sltJfltCOA");
  var loLiNume = document.getElementById("lliNumeCOA");
  var loNrNume = document.getElementById("nroNumeCOA");
  var loLiHent = document.getElementById("lliHentCOA");
  var loHrHent = document.getElementById("hraHentCOA");
  var loLiHiin = document.getElementById("lliHiinCOA");
  var loHrHiin = document.getElementById("hraHiinCOA");
  var loLiHtin = document.getElementById("lliHtinCOA");
  var loHrHtin = document.getElementById("hraHtinCOA");
  var loLiHter = document.getElementById("lliHterCOA");
  var loHrHter = document.getElementById("hraHterCOA");
  var loLiSirc = document.getElementById("lliSircCOA");
  var loSlSirc = document.getElementById("sltSircCOA");
  var loLiJust = document.getElementById("lliJustCOA");
  var loSlJust = document.getElementById("sltJustCOA");
  var loLiRpju = document.getElementById("lliRpjuCOA");
  var loSlRpju = document.getElementById("sltRpjuCOA");
  var loLiAtiv = document.getElementById("lliAtivCOA");
  var loLiDres = document.getElementById("lliDresCOA");
  var loNrDres = document.getElementById("nroDresCOA");
  var loLiDatv = document.getElementById("lliDatvCOA");
  var loTaDatv = document.getElementById("txaDatvCOA");
  var loImFoto = document.getElementById("imgFotoCOA");
  var ldDtHoje = new Date(),
    ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lnIdClie = 0,
    lnCtRcso = 0,
    lnIdStrc = 0,
    lnIdOrds = 0,
    lnIdSirc = 0,
    lnIdJust = 0,
    lnIdRpju = 0,
    lnIdAtiv = 0,
    lnApDres = -1,
    lnIdExcl = 0,
    lnIdJflt = 0;
  var lcApDatv = "";
  var lmHrHora = [];

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
    alerta("data do apontamento inválida", "alerta");

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    alerta("data do apontamento maior que data atual", "alerta");

    return;
  }

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    try {
      if (gmSmRcsoCOA[i].dr_chck) {
        lnCtRcso++;
      }
    } catch (error) {}
  }

  if (lnCtRcso == 0) {
    alerta("nenhum recurso selecionado", "alerta");

    return;
  }

  try {
    if (parseInt(loSlStrc.value.toString().split("/")[0].trim()) > 0) {
      lnIdStrc = parseInt(loSlStrc.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (loLiStrc.style.display.trim().length == 0 && lnIdStrc == 0) {
    alerta("status do recurso inválido", "alerta");

    return;
  }

  if (loLiJflt.style.display.trim().length == 0) {
    try {
      if (parseInt(loSlJflt.value) > 0) {
        lnIdJflt = parseInt(loSlJflt.value);
      }
    } catch (error) {}

    if (lnIdJflt == 0) {
      alerta("justificativa inválida", "alerta");

      return;
    }
  }

  if (
    loLiNume.style.display.trim().length == 0 &&
    loNrNume.value.toString().trim().length > 0
  ) {
    try {
      if (parseInt(goOsLctoCOA.id_ords) > 0) {
        lnIdOrds = parseInt(goOsLctoCOA.id_ords);
      }
    } catch (error) {}
  }

  if (
    loLiNume.style.display.trim().length == 0 &&
    loNrNume.value.toString().trim().length == 0 &&
    lnIdOrds == 0
  ) {
    alerta("proposta inválida", "alerta");

    return;
  }

  try {
    if (
      loHrHent.value.toString().trim().length > 0 &&
      loHrHent.value.toString().trim() != "00:00"
    ) {
      ldApHent = new Date(htmlDataParaObjetoData(loDtData.value));

      lmHrHora = loHrHent.value.toString().split(":");

      ldApHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHiin.value.toString().trim().length > 0 &&
      loHrHiin.value.toString().trim() != "00:00"
    ) {
      ldApHiin = new Date(htmlDataParaObjetoData(loDtData.value));

      lmHrHora = loHrHiin.value.toString().split(":");

      ldApHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHtin.value.toString().trim().length > 0 &&
      loHrHtin.value.toString().trim() != "00:00"
    ) {
      ldApHtin = new Date(htmlDataParaObjetoData(loDtData.value));

      lmHrHora = loHrHtin.value.toString().split(":");

      ldApHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHter.value.toString().trim().length > 0 &&
      loHrHter.value.toString().trim() != "00:00"
    ) {
      ldApHter = new Date(htmlDataParaObjetoData(loDtData.value));

      lmHrHora = loHrHter.value.toString().split(":");

      ldApHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  if (
    loLiHent.style.display.trim().length == 0 &&
    loLiHiin.style.display.trim().length == 0 &&
    loLiHtin.style.display.trim().length == 0 &&
    loLiHter.style.display.trim().length == 0
  ) {
    if (ldApHent.getFullYear() == 1900) {
      alerta("horário da primeira entrada inválido", "alerta");

      return;
    }

    if (ldApHiin.getFullYear() == 1900) {
      alerta("horário da primeira saída inválido", "alerta");

      return;
    }

    if (ldApHtin.getFullYear() == 1900) {
      alerta("horário da segunda entrada inválido", "alerta");

      return;
    }

    if (ldApHter.getFullYear() == 1900) {
      alerta("horário da segunda saída inválido", "alerta");

      return;
    }
  }

  try {
    if (parseInt(loSlSirc.value.toString().split("/")[0].trim()) > 0) {
      lnIdSirc = parseInt(loSlSirc.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (loLiSirc.style.display.trim().length == 0 && lnIdSirc == 0) {
    alerta("situação do recurso inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loSlJust.value) > 0) {
      lnIdJust = parseInt(loSlJust.value);
    }
  } catch (error) {}

  if (loLiJust.style.display.trim().length == 0 && lnIdJust == 0) {
    alerta("justificativa inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loSlRpju.value) > 0) {
      lnIdRpju = parseInt(loSlRpju.value);
    }
  } catch (error) {}

  if (loLiRpju.style.display.trim().length == 0 && lnIdRpju == 0) {
    alerta("responsabilidade inválida", "alerta");

    return;
  }

  try {
    if (goOsTareCOA.at_tipo.trim().toUpperCase() == "A") {
      lnIdAtiv = parseInt(goOsTareCOA.id_ativ);
    } else if (goOsTareCOA.at_tipo.trim().toUpperCase() == "T") {
      lnIdExcl = parseInt(goOsTareCOA.id_excl);
    }
  } catch (error) {}

  if (
    loLiAtiv.style.display.trim().length == 0 &&
    lnIdAtiv == 0 &&
    lnIdExcl == 0
  ) {
    alerta("atividade inválida", "alerta");

    return;
  }

  try {
    if (parseFloat(loNrDres.value) >= 0) {
      lnApDres = parseFloat(loNrDres.value);
    }
  } catch (error) {}

  if (loLiDres.style.display.trim().length == 0 && lnApDres < 0) {
    app.input.validate(loNrDres);

    alerta("quantidade de dias restantes inválida", "alerta");

    return;
  }

  if (loTaDatv.value.toString().trim().length > 0) {
    lcApDatv = loTaDatv.value.toString().trim().toUpperCase();
  }

  if (
    loLiStrc.style.display.trim().length == 0 &&
    (lnIdStrc == 2 || lnIdStrc == 16)
  ) {
    if (loImFoto.src.toString().trim().indexOf("img/semImagem.png") >= 0) {
      alerta(
        "foto do documento comprobatório obrigatório, caso não tenha, escolha a opção FALTA",
        "alerta"
      );

      return;
    }
  } else {
    if (
      loLiDatv.style.display.trim().length == 0 &&
      lcApDatv.trim().length == 0
    ) {
      alerta("descrição das atividades inválida", "alerta");

      return;
    }
  }

  if (
    loLiHent.style.display.trim().length == 0 &&
    loLiHiin.style.display.trim().length == 0 &&
    loLiHtin.style.display.trim().length == 0 &&
    loLiHter.style.display.trim().length == 0
  ) {
    pesquisaApontamentosSecullumCOA();
  } else {
    insereApontamentoCOA();
  }
}

function excluiFotoCOA() {
  var loImFoto = document.getElementById("imgFotoCOA");

  if (
    loImFoto.src.toString().trim().length > 0 &&
    loImFoto.src.toString().trim().indexOf("base64") > 0
  ) {
    gmApFotoCOA.pop();

    if (gmApFotoCOA.length > 0) {
      loImFoto.src = gmApFotoCOA[gmApFotoCOA.length - 1].ap_foto;
    } else {
      loImFoto.src = "img/semImagem.png";
    }
  }
}

function adicionaFotoCOA(lcScType) {
  var loImFoto = document.getElementById("imgFotoCOA");
  var loFlFoto = document.getElementById("fleFotoCOA");
  var loWkOptn = {};
  var lnScType = 0;

  if (!isMobile()) {
    loFlFoto.click();

    return;
  }

  if (lcScType.trim().toUpperCase() == "CAMERA") {
    lnScType = Camera.PictureSourceType.CAMERA;
  } else if (lcScType.trim().toUpperCase() == "PHOTOLIBRARY") {
    lnScType = Camera.PictureSourceType.PHOTOLIBRARY;
  }

  loWkOptn = {
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: lnScType,
    encodingType: Camera.EncodingType.PNG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: false,
    // correctOrientation: true,
    saveToPhotoAlbum: false,
  };

  app.dialog.preloader("carregando foto");

  navigator.camera.getPicture(
    function onSuccess(lcApFoto) {
      app.dialog.close();

      gmApFotoCOA.push({
        // ap_foto: "data:image/png;base64," + lcApFoto,
        ap_foto: lcApFoto,
      });

      // loImFoto.src = "data:image/png;base64," + lcApFoto;
      loImFoto.src = lcApFoto;
    },
    function onFail(lcWkMnsg) {
      app.dialog.close();

      alerta(
        "não foi possível carregar a foto: " + lcWkMnsg + ", tente novamente",
        "alerta"
      );
    },
    loWkOptn
  );
}

function opcoesFotoCOA() {
  var loImFoto = document.getElementById("imgFotoCOA");
  var lmOpBtns = [];

  if (isMobile()) {
    lmOpBtns = [
      {
        text: "câmera",
        icon: "<i class='material-icons centraliza'>camera</i>",
        onClick: function () {
          adicionaFotoCOA("CAMERA");
        },
      },
      {
        text: "galeria",
        icon: "<i class='material-icons centraliza'>photo_library</i>",
        onClick: function () {
          adicionaFotoCOA("PHOTOLIBRARY");
        },
      },
    ];
  } else {
    lmOpBtns.push({
      text: "galeria",
      icon: "<i class='material-icons centraliza'>photo_library</i>",
      onClick: function () {
        adicionaFotoCOA("PHOTOLIBRARY");
      },
    });
  }

  if (
    loImFoto.src.toString().trim().length > 0 &&
    loImFoto.src.toString().trim().indexOf("img/semImagem.png") < 0
  ) {
    lmOpBtns.push({
      text: "remover",
      icon: "<i class='material-icons centraliza'>cancel</i>",
      onClick: function () {
        app.dialog
          .create({
            title: "alerta",
            text: "remover foto ?",
            buttons: [
              {
                text: "cancelar",
                color: corBotaoAlerta(),
              },
              {
                text: "ok",
                color: corBotaoAlerta(),
                onClick: function () {
                  excluiFotoCOA();
                },
              },
            ],
          })
          .open();
      },
    });
  }

  app.actions
    .create({
      grid: true,
      buttons: [lmOpBtns],
    })
    .open();
}

function pesquisaResponsabilidadeJustificativaCOA() {
  var loSlRpju = document.getElementById("sltRpjuCOA");
  var lcWkRsql = "<option value='0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlRpju.disabled = true;

  loSlRpju.innerHTML =
    "<option value='0'>CARREGANDO RESPONSABILIDADES...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaResponsabilidadeJustificativa",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlRpju.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_rpju.toString() + "'>" + lmWkRsql[i].rj_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlRpju.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlRpju.disabled = false;

      loSlRpju.innerHTML = lcWkRsql;
    },
  });
}

function pesquisaJustificativasCOA() {
  var loSlJust = document.getElementById("sltJustCOA");
  var lcWkRsql = "<option value='0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlJust.disabled = true;

  loSlJust.innerHTML =
    "<option value='0'>CARREGANDO JUSTIFICATIVAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaJustificativas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlJust.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_just.toString() + "'>" + lmWkRsql[i].ju_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlJust.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlJust.disabled = false;

      loSlJust.innerHTML = lcWkRsql;
    },
  });
}

function pesquisaSituacoesRecursoCOA() {
  var loSlSirc = document.getElementById("sltSircCOA");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlSirc.disabled = true;

  loSlSirc.innerHTML =
    "<option value='0/0'>CARREGANDO SITUAÇÕES DO RECURSO...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSituacoesRecurso",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlSirc.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_sirc.toString() + "/" + lmWkRsql[i].sr_trab.toString() + "/" + lmWkRsql[i].sr_just.toString() + "'>" + lmWkRsql[i].sr_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlSirc.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlSirc.disabled = false;

      loSlSirc.innerHTML = lcWkRsql;
    },
  });
}

function apontamentosPendentesCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var lnIdCadt = 0,
    lnIdDsem = 0;
  var ldDtHoje = new Date(),
    ldAnData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldAnData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldAnData = htmlDataParaObjetoData(loDtData.value);
  } else {
    return;
  }

  if (ldAnData > ldDtHoje) {
    return;
  }

  ldAnData.setDate(ldAnData.getDate() - 1);

  while (!isBusinessDay(ldAnData)) {
    ldAnData.setDate(ldAnData.getDate() - 1);
  }

  lnIdDsem = ldAnData.getDay();

  try {
    for (var i = 0; i < gmOsJornCOA.length; i++) {
      if (parseInt(gmOsJornCOA[i].id_dsem) == lnIdDsem + 1) {
        for (var j = 0; j < gmDrRcsoCOA.length; j++) {
          if (
            parseInt(gmDrRcsoCOA[j].ap_feri) +
              parseInt(gmDrRcsoCOA[j].tb_feri) ==
            0
          ) {
            if (parseInt(gmDrRcsoCOA[j].ap_ords) < 0) {
              alerta(
                "existem apontamentos pendentes para os dias anteriores ",
                "alerta"
              );

              break;
            } else if (parseInt(gmDrRcsoCOA[j].ap_ords) == 0) {
              if (
                parseInt(gmDrRcsoCOA[j].to_cont) > 0 &&
                parseInt(gmDrRcsoCOA[j].to_con1) == 0
              ) {
                alerta(
                  "existem apontamentos pendentes para os dias anteriores ",
                  "alerta"
                );

                break;
              } else {
                break;
              }
            } else if (parseInt(gmDrRcsoCOA[j].ap_ords) > 0) {
              if (
                parseInt(gmDrRcsoCOA[j].ap_mnts) <
                parseInt(gmOsJornCOA[i].jo_mnts) - 10
              ) {
                alerta(
                  "existem apontamentos pendentes para os dias anteriores ",
                  "alerta"
                );

                break;
              }
            }
          }
        }

        break;
      }
    }
  } catch (error) {}
}

function calculaHorasCOA(lcIdObjt, llPuSecu) {
  var loDtData = document.getElementById("datDataCOA"),
    loHrHen0 = {},
    loHrHii0 = {},
    loHrHti0 = {},
    loHrHte0 = {},
    loDvTho0 = {},
    loHrHent = {},
    loHrHiin = {},
    loHrHtin = {},
    loHrHter = {},
    loDvThor = {};
  var loHrObjt = {};
  var lnApJdms = 0,
    lnApJmms = 0,
    lnApJtms = 0;
  var ldDrData = new Date(),
    ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [];

  ldDrData.setHours(0, 0, 0, 0);

  if (llPuSecu) {
    loHrHen0 = document.getElementById("hraHentCOA");
    loHrHii0 = document.getElementById("hraHiinCOA");
    loHrHti0 = document.getElementById("hraHtinCOA");
    loHrHte0 = document.getElementById("hraHterCOA");
    loDvTho0 = document.getElementById("divThorCOA");
    loHrHent = document.getElementById("hraHentCAS");
    loHrHiin = document.getElementById("hraHiinCAS");
    loHrHtin = document.getElementById("hraHtinCAS");
    loHrHter = document.getElementById("hraHterCAS");
    loDvThor = document.getElementById("divThorCAS");
  } else {
    loHrHent = document.getElementById("hraHentCOA");
    loHrHiin = document.getElementById("hraHiinCOA");
    loHrHtin = document.getElementById("hraHtinCOA");
    loHrHter = document.getElementById("hraHterCOA");
    loDvThor = document.getElementById("divThorCOA");
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  } else {
    loDtData.defaultValue = loDtData.value;

    loDtData.valueAsDate = ldDrData;

    consultaDataCOA();
  }

  try {
    if (
      loHrHent.value.toString().trim().length > 0 &&
      loHrHent.value.toString().trim() != "00:00"
    ) {
      ldApHent = new Date(ldDrData);

      lmHrHora = loHrHent.value.toString().split(":");

      ldApHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHiin.value.toString().trim().length > 0 &&
      loHrHiin.value.toString().trim() != "00:00"
    ) {
      ldApHiin = new Date(ldDrData);

      lmHrHora = loHrHiin.value.toString().split(":");

      ldApHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHtin.value.toString().trim().length > 0 &&
      loHrHtin.value.toString().trim() != "00:00"
    ) {
      ldApHtin = new Date(ldDrData);

      lmHrHora = loHrHtin.value.toString().split(":");

      ldApHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (
      loHrHter.value.toString().trim().length > 0 &&
      loHrHter.value.toString().trim() != "00:00"
    ) {
      ldApHter = new Date(ldDrData);

      lmHrHora = loHrHter.value.toString().split(":");

      ldApHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  if (ldApHent.getFullYear() > 1900 && ldApHiin.getFullYear() > 1900) {
    if (ldApHent <= ldApHiin) {
      lnApJmms = ldApHiin - ldApHent;
    } else {
      ldApHiin = ldApHiin.addDays(1);

      if (ldApHtin.getFullYear() > 1900) {
        ldApHtin = ldApHtin.addDays(1);
      }

      if (ldApHter.getFullYear() > 1900) {
        ldApHter = ldApHter.addDays(1);
      }

      lnApJmms = ldApHiin - ldApHent;
    }
  }

  if (
    ldApHiin.getFullYear() > 1900 &&
    ldApHtin.getFullYear() > 1900 &&
    ldApHiin > ldApHtin
  ) {
    ldApHtin = ldApHtin.addDays(1);

    if (ldApHter.getFullYear() > 1900) {
      ldApHter = ldApHter.addDays(1);
    }
  }

  if (ldApHtin.getFullYear() > 1900 && ldApHter.getFullYear() > 1900) {
    if (ldApHtin <= ldApHter) {
      lnApJtms = ldApHter - ldApHtin;
    } else {
      ldApHter = ldApHter.addDays(1);

      lnApJtms = ldApHter - ldApHtin;
    }
  }

  lnApJdms = lnApJmms + lnApJtms;

  if (lnApJdms > 0) {
    // if (
    //   lcIdObjt.trim().length > 0 &&
    //   lnApJdms / (1000 * 60 * 60) > 12 &&
    //   goCdUser.id_user.trim().toUpperCase() != "CARLOS" &&
    //   goCdUser.id_user.trim().toUpperCase() != "CHAMONE" &&
    //   goCdUser.id_user.trim().toUpperCase() != "CHAMONI" &&
    //   goCdUser.id_user.trim().toUpperCase() != "DAVI.CASTRO" &&
    //   goCdUser.id_user.trim().toUpperCase() != "GUILHERME" &&
    //   goCdUser.id_user.trim().toUpperCase() != "GUSTAVO" &&
    //   goCdUser.id_user.trim().toUpperCase() != "JORGE GENEROSO" &&
    //   goCdUser.id_user.trim().toUpperCase() != "LORENA" &&
    //   goCdUser.id_user.trim().toUpperCase() != "MARIA.EDUARDA" &&
    //   goCdUser.id_user.trim().toUpperCase() != "PAULO" &&
    //   goCdUser.id_user.trim().toUpperCase() != "QUESIA" &&
    //   goCdUser.id_user.trim().toUpperCase() != "VINICIUS.F" &&
    //   goCdUser.id_user.trim().toUpperCase() != "GUILHERME.FERRAREZI" &&
    //   goCdUser.id_user.trim().toUpperCase() != "PRISCILLA.MIRELI" &&
    //   goCdUser.id_user.trim().toUpperCase() != "VICTORIA.ALVES"
    // ) {
    //   alerta(
    //     "horário inválido, total acima de 12 horas, entre em contato com a adminsitração",
    //     "alerta"
    //   );

    //   loHrObjt = document.getElementById(lcIdObjt);

    //   loHrObjt.value = loHrObjt.defaultValue;

    //   return;
    // }

    loDvThor.innerHTML =
      pad(Math.floor(lnApJdms / (1000 * 60 * 60)), 2) +
      ":" +
      pad((lnApJdms % (1000 * 60 * 60)) / (1000 * 60), 2);
  } else {
    loDvThor.innerHTML = "";
  }

  if (llPuSecu) {
    loHrHen0.value = loHrHent.value.toString().trim().toUpperCase();
    loHrHii0.value = loHrHiin.value.toString().trim().toUpperCase();
    loHrHti0.value = loHrHtin.value.toString().trim().toUpperCase();
    loHrHte0.value = loHrHter.value.toString().trim().toUpperCase();

    loDvTho0.innerHTML = loDvThor.innerHTML.trim().toUpperCase();
  }
}

function pesquisaJornadaCOA(lnIdOrds) {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loLiHent = document.getElementById("lliHentCOA");
  var loHrHent = document.getElementById("hraHentCOA");
  var loLiHiin = document.getElementById("lliHiinCOA");
  var loHrHiin = document.getElementById("hraHiinCOA");
  var loLiHtin = document.getElementById("lliHtinCOA");
  var loHrHtin = document.getElementById("hraHtinCOA");
  var loLiHter = document.getElementById("lliHterCOA");
  var loHrHter = document.getElementById("hraHterCOA");
  var loLiThor = document.getElementById("lliThorCOA");
  var ldDrData = new Date();
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnSrDisp = 0,
    lnIdStrc = 0,
    lnIdDsem = 0,
    lnIdClie = null;

  ldDrData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
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
      try {
        if (lmWkRsql.length > 0) {
          gmOsJornCOA = lmWkRsql;

          if (loDtData.value.toString().trim().length > 0) {
            ldDrData = htmlDataParaObjetoData(loDtData.value);
          } else {
            loDtData.defaultValue = loDtData.value;

            loDtData.valueAsDate = ldDrData;

            consultaDataCOA();
          }

          lnIdDsem = ldDrData.getDay();

          for (var i = 0; i < gmOsJornCOA.length; i++) {
            if (parseInt(gmOsJornCOA[i].id_dsem) == lnIdDsem + 1) {
              loHrHent.value = pad(
                gmOsJornCOA[i].jo_hent.toFixed(2),
                5
              ).replace(".", ":");
              loHrHiin.value = pad(
                gmOsJornCOA[i].jo_hiin.toFixed(2),
                5
              ).replace(".", ":");
              loHrHtin.value = pad(
                gmOsJornCOA[i].jo_htin.toFixed(2),
                5
              ).replace(".", ":");
              loHrHter.value = pad(
                gmOsJornCOA[i].jo_hter.toFixed(2),
                5
              ).replace(".", ":");

              calculaHorasCOA("", false);

              break;
            }
          }

          if (parseInt(loSlStrc.value.toString().split("/")[0].trim()) > 0) {
            lnIdStrc = parseInt(loSlStrc.value.toString().split("/")[0].trim());
            lnSrDisp = parseInt(loSlStrc.value.toString().split("/")[1].trim());
          }

          if (lnIdStrc > 0) {
            if (lnSrDisp > 0) {
              loLiHent.style.display = "";
              loLiHiin.style.display = "";
              loLiHtin.style.display = "";
              loLiHter.style.display = "";
              loLiThor.style.display = "";
            }
          }
        }
      } catch (loApErro) {}

      if (gmDrRcsoCOA.length == 0) {
        pesquisaRecursosCOA();
      } else {
        apontamentosPendentesCOA();
      }
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaJustificativasFaltaCOA() {
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loDvJflt = document.getElementById("divJfltCOA");
  var loSlJflt = document.getElementById("sltJfltCOA");
  var lcWkRsql = "<option value='0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdStrc = null;

  try {
    if (parseInt(loSlStrc.value.toString().split("/")[0].trim()) > 0) {
      lnIdStrc = parseInt(loSlStrc.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdStrc == 10) {
    loDvJflt.innerHTML = "justificativa de dispensa";
  } else if (lnIdStrc == 16) {
    loDvJflt.innerHTML = "justificativa de falta";
  } else {
    loDvJflt.innerHTML = "justificativa";
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdStrc", pa_tipo: "Int", pa_valo: lnIdStrc },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlJflt.disabled = true;

  loSlJflt.innerHTML =
    "<option value='0'>CARREGANDO JUSTIFICATIVAS DE FALTA...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaJustificativasFalta",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlJflt.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_jflt.toString() + "'>" + lmWkRsql[i].jf_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlJflt.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlJflt.disabled = false;

      loSlJflt.innerHTML = lcWkRsql;
    },
  });
}

function pesquisaStatusRecursoCOA() {
  var loSlStrc = document.getElementById("sltStrcCOA");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlStrc.disabled = true;

  loSlStrc.innerHTML =
    "<option value='0/0'>CARREGANDO STATUS DOS RECURSOS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaStatusRecurso",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlStrc.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_strc.toString() + "/" + lmWkRsql[i].sr_disp.toString() + "'>" + lmWkRsql[i].sr_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlStrc.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlStrc.disabled = false;

      loSlStrc.innerHTML = lcWkRsql;
    },
  });
}

function pesquisaObrasCOA() {
  var loSlObra = document.getElementById("sltObraCOA");
  var lcWkRsql = "<option value='0/0//'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0/0//'>CARREGANDO OBRAS...</option>";

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
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "/" + lmWkRsql[i].id_esta.trim().toUpperCase() + "/" + lmWkRsql[i].id_cida.trim().toUpperCase() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
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

function limpaCamposSituacaoCOA() {
  var loLiJust = document.getElementById("lliJustCOA");
  var loSlJust = document.getElementById("sltJustCOA");
  var loLiObju = document.getElementById("lliObjuCOA");
  var loTaObju = document.getElementById("txaObjuCOA");
  var loLiRpju = document.getElementById("lliRpjuCOA");
  var loSlRpju = document.getElementById("sltRpjuCOA");
  var loLiAtiv = document.getElementById("lliAtivCOA");
  var loDvAtiv = document.getElementById("divAtivCOA");
  var loLiDres = document.getElementById("lliDresCOA");
  var loNrDres = document.getElementById("nroDresCOA");

  goOsTareCOA = {};

  loLiJust.style.display = "none";

  loSlJust.selectedIndex = 0;

  loLiObju.style.display = "none";

  loTaObju.value = "";

  loLiRpju.style.display = "none";

  loSlRpju.selectedIndex = 0;

  loLiAtiv.style.display = "none";

  loDvAtiv.innerHTML = "";

  loLiDres.style.display = "none";

  loNrDres.value = "";
}

function limpaCamposOrdemServicoCOA() {
  var loNrNume = document.getElementById("nroNumeCOA");
  var loLiTipo = document.getElementById("lliTipoCOA");
  var loDvTipo = document.getElementById("divTipoCOA");
  var loLiResp = document.getElementById("lliRespCOA");
  var loDvResp = document.getElementById("divRespCOA");
  var loLiOrca = document.getElementById("lliOrcaCOA");
  var loDvOrca = document.getElementById("divOrcaCOA");
  var loLiNcli = document.getElementById("lliNcliCOA");
  var loDvNcli = document.getElementById("divNcliCOA");
  var loLiNcon = document.getElementById("lliNconCOA");
  var loDvNcon = document.getElementById("divNconCOA");
  var loLiDesc = document.getElementById("lliDescCOA");
  var loTaDesc = document.getElementById("txaDescCOA");
  var loLiCmnt = document.getElementById("lliCmntCOA");
  var loTaCmnt = document.getElementById("txaCmntCOA");
  var loLiHent = document.getElementById("lliHentCOA");
  var loHrHent = document.getElementById("hraHentCOA");
  var loLiHiin = document.getElementById("lliHiinCOA");
  var loHrHiin = document.getElementById("hraHiinCOA");
  var loLiHtin = document.getElementById("lliHtinCOA");
  var loHrHtin = document.getElementById("hraHtinCOA");
  var loLiHter = document.getElementById("lliHterCOA");
  var loHrHter = document.getElementById("hraHterCOA");
  var loLiThor = document.getElementById("lliThorCOA");
  var loDvThor = document.getElementById("divThorCOA");
  var loLiSirc = document.getElementById("lliSircCOA");
  var loSlSirc = document.getElementById("sltSircCOA");
  var loLiDatv = document.getElementById("lliDatvCOA");
  var loTaDatv = document.getElementById("txaDatvCOA");

  goOsLctoCOA = {};
  gmOsTareCOA = [];

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

  loLiHent.style.display = "none";

  loHrHent.value = "";

  loLiHiin.style.display = "none";

  loHrHiin.value = "";

  loLiHtin.style.display = "none";

  loHrHtin.value = "";

  loLiHter.style.display = "none";

  loHrHter.value = "";

  loLiThor.style.display = "none";

  loDvThor.innerHTML = "";

  loLiSirc.style.display = "none";

  loSlSirc.selectedIndex = 0;

  loLiDatv.style.display = "none";

  loTaDatv.value = "";

  limpaCamposSituacaoCOA();
}

function limpaCamposStatusCOA() {
  var loLiJflt = document.getElementById("lliJfltCOA");
  var loDvJflt = document.getElementById("divJfltCOA");
  var loSlJflt = document.getElementById("sltJfltCOA");
  var loLiObsr = document.getElementById("lliObsrCOA");
  var loTaObsr = document.getElementById("txaObsrCOA");
  var loLiNume = document.getElementById("lliNumeCOA");

  loLiJflt.style.display = "none";

  loDvJflt.innerHTML = "justificativa";

  loSlJflt.innerHTML = "<option value='0'></option>";

  loLiObsr.style.display = "none";

  loTaObsr.value = "";

  loLiNume.style.display = "none";

  limpaCamposOrdemServicoCOA();
}

function limpaCamposCOA() {
  var loCbFeri = document.getElementById("chbFeriCOA");
  var loDvRcso = document.getElementById("divRcsoCOA");
  var loLiStrc = document.getElementById("lliStrcCOA");
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loDvCard = document.getElementById("divCardCOA");
  var loImFoto = document.getElementById("imgFotoCOA");
  var loFlFoto = document.getElementById("fleFotoCOA");

  gmApFotoCOA = [];
  gmDrRcsoCOA = [];
  gmSmRcsoCOA = [];
  gmDrRcsoCDR = [];
  gmApSecuCOA = [];
  gmApFuncCOA = [];
  goApApntCOA = {};

  loCbFeri.checked = false;

  loDvRcso.style.display = "none";
  loLiStrc.style.display = "none";

  loSlStrc.selectedIndex = 0;

  loDvCard.style.display = "none";

  loImFoto.src = "img/semImagem.png";

  loFlFoto.value = "";

  limpaCamposStatusCOA();
}

function ComlOsApnt() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loDvFoto = document.getElementById("divFotoCOA");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loSlObra.selectedIndex = 0;

  loDtData.valueAsDate = ldDtHoje;

  limpaCamposCOA();
  pesquisaObrasCOA();
  pesquisaStatusRecursoCOA();
  pesquisaJornadaCOA(null);
  pesquisaSituacoesRecursoCOA();
  pesquisaJustificativasCOA();
  pesquisaResponsabilidadeJustificativaCOA();

  if (gcSiOper == "iOS") {
    $$("#divFotoCOA").on("taphold", function () {
      opcoesFotoCOA();
    });
  } else {
    loDvFoto.oncontextmenu = function () {
      opcoesFotoCOA();
    };
  }

  OkTecladoAndroid("nroNumeCOA");
  OkTecladoAndroid("nroDresCOA");
}
