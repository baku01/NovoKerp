var goOsLctoCOE = {};
var gmOsTareCOE = [],
  gmTrSglaCOE = [],
  gmAtDresCOE = [],
  gmTaInatCOE = [];

function pesquisaRelatorioAtividadesCOE() {
  var loDtDtde = document.getElementById("datDtdeCOE");
  var loDtDtat = document.getElementById("datDtatCOE");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var lnIdOrds = 0;
  var loDgRatv = {};

  try {
    if (parseInt(goOsLctoCOE.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOE.id_ords);
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    {
      pa_nome: "ldApDtde",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtDtde.value)
      ),
    },
    {
      pa_nome: "ldApDtat",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtDtat.value)
      ),
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDgRatv = app.dialog.preloader("pesquisando atividades");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRelatorioAtividades",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDgRatv.close();

      gmOsTareCOE = lmWkRsql;

      pesquisaRecursosDiaAtividadeCOE();
    },
    error: function (jqXHR, textStatus, err) {
      loDgRatv.close();

      gmOsTareCOE = [];

      pesquisaRecursosDiaAtividadeCOE();
    },
  });
}

function consultaCOE(loWkRsql) {
  var loNrNume = document.getElementById("nroNumeCOE");
  var loDvTipo = document.getElementById("divTipoCOE");
  var loDvResp = document.getElementById("divRespCOE");
  var loDvOrca = document.getElementById("divOrcaCOE");
  var loDvNcli = document.getElementById("divNcliCOE");
  var loDvNcon = document.getElementById("divNconCOE");
  var loTaDesc = document.getElementById("txaDescCOE");
  var lcOsTipo = "";

  limpaCamposCOE();

  if (loWkRsql.id_parm.trim().toUpperCase() == "ID_ORDS") {
    goOsLctoCOE = loWkRsql;

    pesquisaRelatorioAtividadesCOE();

    loNrNume.value = loWkRsql.os_nume.trim().toUpperCase();

    app.input.validate(loNrNume);

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
    loDvResp.innerHTML = loWkRsql.os_resp.trim().toUpperCase();
    loDvOrca.innerHTML = loWkRsql.oc_nume.trim().toUpperCase();
    loDvNcli.innerHTML = loWkRsql.os_ncli.trim().toUpperCase();
    loDvNcon.innerHTML = loWkRsql.os_ncon.trim().toUpperCase();

    loTaDesc.value = loWkRsql.os_desc.trim().toUpperCase();
  }
}

function consultaOrdemServicoCOE() {
  var loSlObra = document.getElementById("sltObraCOE");
  var loNrNume = document.getElementById("nroNumeCOE");
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

    limpaCamposCOE();

    return;
  }

  try {
    if (loNrNume.value.toString().trim().length > 0) {
      lcOsNume = loNrNume.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  if (lcOsNume.length == 0) {
    limpaCamposCOE();

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

  limpaCamposCOE();

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

          consultaCOE(lmWkRsql[0]);

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

function pesquisaOrdensServicoCOE() {
  var loSlObra = document.getElementById("sltObraCOE");
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

function pesquisaRecursosDiaAtividadeCOE() {
  var loSlObra = document.getElementById("sltObraCOE");
  var loDtDtde = document.getElementById("datDtdeCOE");
  var loDtDtat = document.getElementById("datDtatCOE");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var loDgRdat = {};
  var lnIdOrds = 0,
    lnIdClie = 0;

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    montaTarefasCOE();

    return;
  }

  try {
    if (parseInt(goOsLctoCOE.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOE.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    montaTarefasCOE();

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    {
      pa_nome: "ldApDtde",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtDtde.value)
      ),
    },
    {
      pa_nome: "ldApDtat",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtDtat.value)
      ),
    },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDgRdat = app.dialog.preloader("pesquisando...");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursosDiaAtividade",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDgRdat.close();

      gmTrSglaCOE = lmWkRsql;

      montaTarefasCOE();
    },
    error: function (jqXHR, textStatus, err) {
      loDgRdat.close();

      gmTrSglaCOE = [];

      montaTarefasCOE();
    },
  });
}

function atualizaInativaTarefaCOE(lmTaInat) {
  var loDtDtde = document.getElementById("datDtdeCOE");
  var loDtDtat = document.getElementById("datDtatCOE");
  var lcWkIsql = "";
  var lmWkIsql = [];

  if (lmTaInat.length == 0) {
    app.dialog.close();

    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: lmTaInat[0].id_empr.trim().toUpperCase(),},
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: parseInt(lmTaInat[0].id_ords), },
    { pa_nome: "lnIdExcl", pa_tipo: "Int", pa_valo: parseInt(lmTaInat[0].id_excl), },
    { pa_nome: "lnIdAtiv", pa_tipo: "Int", pa_valo: parseInt(lmTaInat[0].id_ativ), },
    { pa_nome: "lnTaInat", pa_tipo: "Decimal", pa_valo: parseFloat(lmTaInat[0].ta_inat), },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData( htmlDataParaObjetoData(loDtDtde.value) ), },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData( htmlDataParaObjetoData(loDtDtat.value) ), },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaInativaTarefa",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmTaInat.splice(0, 1);

          if (lmTaInat.length > 0) {
            atualizaInativaTarefaCOE(lmTaInat);
          } else {
            app.dialog.close();

            limpaCamposAtividadeCOE();

            gmOsTareCOE = lmWkRsql;

            pesquisaRecursosDiaAtividadeCOE();
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

function atualizaDiasRestantesCOE(lmAtDres, lmTaInat) {
  var loDtDtde = document.getElementById("datDtdeCOE");
  var loDtDtat = document.getElementById("datDtatCOE");
  var lcWkIsql = "";
  var lmWkIsql = [];

  if (lmAtDres.length == 0 && lmTaInat.length == 0) {
    app.dialog.close();

    alerta("nenhuma alteração foi feita", "alerta");

    return;
  }

  if (lmAtDres.length == 0) {
    atualizaInativaTarefaCOE(lmTaInat);

    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: lmAtDres[0].id_empr.trim().toUpperCase(), },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: parseInt(lmAtDres[0].id_ords), },
    { pa_nome: "lnIdExcl", pa_tipo: "Int", pa_valo: parseInt(lmAtDres[0].id_excl), },
    { pa_nome: "lnIdAtiv", pa_tipo: "Int", pa_valo: parseInt(lmAtDres[0].id_ativ), },
    { pa_nome: "lnApDres", pa_tipo: "Decimal", pa_valo: parseFloat(lmAtDres[0].ap_dres), },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData( htmlDataParaObjetoData(loDtDtde.value) ), },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData( htmlDataParaObjetoData(loDtDtat.value) ), },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaDiasRestantesAtividade",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmAtDres.splice(0, 1);

          if (lmAtDres.length > 0) {
            atualizaDiasRestantesCOE(lmAtDres, lmTaInat);
          } else {
            if (lmTaInat.length > 0) {
              atualizaInativaTarefaCOE(lmTaInat);
            } else {
              app.dialog.close();

              limpaCamposAtividadeCOE();

              gmOsTareCOE = lmWkRsql;

              pesquisaRecursosDiaAtividadeCOE();
            }
          }
        } else {
          if (lmTaInat.length > 0) {
            atualizaInativaTarefaCOE(lmTaInat);
          } else {
            app.dialog.close();
          }
        }
      } catch (loApErro) {
        if (lmTaInat.length > 0) {
          atualizaInativaTarefaCOE(lmTaInat);
        } else {
          app.dialog.close();
        }
      }
    },
    error: function (jqXHR, textStatus, err) {
      if (lmTaInat.length > 0) {
        atualizaInativaTarefaCOE(lmTaInat);
      } else {
        app.dialog.close();
      }
    },
  });
}

function adicionaAtualizaDiasRestantesCOE(
  lcWkRsql,
  lnNrIndx,
  lnGrDres,
  lnGrInat,
  lcBgClor
) {
  var loDvMais = document.getElementById("divMaisCOE");
  var loBdDres = document.getElementById(
    "bldDrs" + lnNrIndx.toString() + "COE"
  );
  var loLiEdts = document.getElementById(
    "lliEdt" + lnNrIndx.toString() + "COE"
  );
  var loTaEdts = document.getElementById(
    "txaEdt" + lnNrIndx.toString() + "COE"
  );
  var loWkRsql = JSON.parse(unescape(lcWkRsql));
  var lcApDres = "",
    lcApData = "",
    lcGrDres = "",
    lcBtInat = "",
    lcBtClor = "";
  var lnIdOrds = 0,
    lnIdExcl = 0,
    lnIdAtiv = 0,
    lnApDres = 0,
    lnAxDres = lnGrDres,
    lnTaInat = 0,
    lnAxInat = lnGrInat;
  var llAtDres = false,
    llTaInat = false;
  var lmBtList = [];

  try {
    if (parseInt(loWkRsql.id_ords) > 0) {
      lnIdOrds = parseInt(loWkRsql.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds == 0) {
    alerta("proposta inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loWkRsql.id_excl) > 0) {
      lnIdExcl = parseInt(loWkRsql.id_excl);
    }
  } catch (error) {}

  if (lnIdExcl == 0) {
    try {
      if (parseInt(loWkRsql.id_ativ) > 0) {
        lnIdAtiv = parseInt(loWkRsql.id_ativ);
      }
    } catch (error) {}
  }

  if (lnIdExcl + lnIdAtiv == 0) {
    alerta("atividade inválida", "alerta");

    return;
  }

  try {
    if (jsonDate(loWkRsql.ap_real).trim().length > 0) {
      lcApData = objetoDataParaStringSqlData(
        stringDataParaObjetoData(jsonDate(loWkRsql.ap_real))
      );
    }
  } catch (error) {}

  if (lcApData.trim().length == 0) {
    alerta("data inválida", "alerta");

    return;
  }

  for (var i = 0; i < gmTaInatCOE.length; i++) {
    if (
      parseInt(gmTaInatCOE[i].id_excl) == lnIdExcl &&
      parseInt(gmTaInatCOE[i].id_ativ) == lnIdAtiv
    ) {
      lnAxInat = parseFloat(gmTaInatCOE[i].ta_inat);

      break;
    }
  }

  if (lnAxInat > 0) {
    lcBtInat = "reativar";
    lcBtClor = "botaoVerdeClaro";
  } else {
    lcBtInat = "desativar";
    lcBtClor = "color-red";
  }

  for (var i = 0; i < gmAtDresCOE.length; i++) {
    if (
      parseInt(gmAtDresCOE[i].id_excl) == lnIdExcl &&
      parseInt(gmAtDresCOE[i].id_ativ) == lnIdAtiv
    ) {
      lnAxDres = parseFloat(gmAtDresCOE[i].ap_dres);

      break;
    }
  }

  // lcApDres = prompt("dias restantes", brDecimal(lnAxDres));

  // if (lcApDres == null) {
  //   return;
  // }

  if (
    goCdUser.id_user.trim().toUpperCase() == "CHAMONE" ||
    goCdUser.id_user.trim().toUpperCase() == "CHAMONI" ||
    goCdUser.id_user.trim().toUpperCase() == "DAVI.CASTRO" ||
    goCdUser.id_user.trim().toUpperCase() == "GUSTAVO" ||
    goCdUser.id_user.trim().toUpperCase() == "JORGE GENEROSO" ||
    goCdUser.id_user.trim().toUpperCase() == "LORENA" ||
    goCdUser.id_user.trim().toUpperCase() == "MARIA.EDUARDA" ||
    goCdUser.id_user.trim().toUpperCase() == "KAILANE" ||
    goCdUser.id_user.trim().toUpperCase() == "VINICIUS.F" ||
    goCdUser.id_user.trim().toUpperCase() == "GUILHERME.FERRAREZI" ||
    goCdUser.id_user.trim().toUpperCase() == "PRISCILLA.MIRELI" ||
    goCdUser.id_user.trim().toUpperCase() == "VICTORIA.ALVES" ||
    goCdUser.id_user.trim().toUpperCase() == "MARCOS.PORTELLA" ||
    goCdUser.id_user.trim().toUpperCase() == "CARLA" ||
    goCdUser.id_user.trim().toUpperCase() == "PAULO" ||
    goCdUser.id_user.trim().toUpperCase() == "JAIRO.J" ||
    goCdUser.id_user.trim().toUpperCase() == "RICHARD" ||
    goCdUser.id_user.trim().toUpperCase() == "VICTOR.GUSTAVO" ||
    goCdUser.id_user.trim().toUpperCase() == "VICTORIA.BEATRIZ" ||
    goCdUser.id_user.trim().toUpperCase() == "GABRIEL.EVANGELISTA" ||
    goCdUser.id_user.trim().toUpperCase() == "TALITA" ||
    goCdUser.id_user.trim().toUpperCase() == "QUESIA"
  ) {
    lmBtList = [
      {
        text: lcBtInat,
        cssClass: lcBtClor,
        onClick: function () {
          if (lnAxInat > 0) {
            lnTaInat = 0;

            loLiEdts.style.textDecoration = "";
            loLiEdts.style.backgroundColor = lcBgClor;
            loLiEdts.style.color = "white";
            loTaEdts.style.color = "white";
            loBdDres.style.color = "#979797";
          } else {
            lnTaInat = 1;

            loLiEdts.style.textDecoration = "line-through";
            loLiEdts.style.backgroundColor = "white";
            loLiEdts.style.color = "black";
            loTaEdts.style.color = "black";
            loBdDres.style.color = "black";
          }

          if (lnGrInat == lnTaInat) {
            for (var i = 0; i < gmTaInatCOE.length; i++) {
              if (
                parseInt(gmTaInatCOE[i].id_excl) == lnIdExcl &&
                parseInt(gmTaInatCOE[i].id_ativ) == lnIdAtiv
              ) {
                gmTaInatCOE.splice(i, 1);

                if (gmTaInatCOE.length == 0 && gmAtDresCOE.length == 0) {
                  loDvMais.style.display = "none";
                }

                break;
              }
            }

            return;
          }

          for (var i = 0; i < gmTaInatCOE.length; i++) {
            if (
              parseInt(gmTaInatCOE[i].id_excl) == lnIdExcl &&
              parseInt(gmTaInatCOE[i].id_ativ) == lnIdAtiv
            ) {
              llTaInat = true;

              gmTaInatCOE[i].ta_inat = parseInt(lnTaInat);

              break;
            }
          }

          if (!llTaInat) {
            gmTaInatCOE.push({
              id_empr: gcIdEmpr,
              id_ords: lnIdOrds,
              id_excl: lnIdExcl,
              id_ativ: lnIdAtiv,
              ta_inat: lnTaInat,
              ap_data: lcApData,
            });

            loDvMais.style.display = "";
          }
        },
      },
      {
        text: "ok",
        cssClass: "color-blue",
        onClick: function () {
          var loNrDres = document.getElementById("nroDresCOE");

          if (lnIdExcl == 0) {
            try {
              if (parseFloat(loWkRsql.ap_dres) == -1) {
                alerta("atividade sem apontamento", "alerta");

                return;
              }
            } catch (error) {}
          }

          try {
            if (parseFloat(parseFloat(loNrDres.value).toFixed(2)) >= 0) {
              lnApDres = parseFloat(parseFloat(loNrDres.value).toFixed(2));
            }
          } catch (error) {}

          if (lnGrDres == lnApDres) {
            if (lnApDres > 0) {
              lcApDres = brDecimal(lnApDres) + " dias restantes";
            } else {
              lcApDres = "finalizado";
            }

            loBdDres.innerHTML = lcApDres;

            for (var i = 0; i < gmAtDresCOE.length; i++) {
              if (
                parseInt(gmAtDresCOE[i].id_excl) == lnIdExcl &&
                parseInt(gmAtDresCOE[i].id_ativ) == lnIdAtiv
              ) {
                gmAtDresCOE.splice(i, 1);

                if (gmAtDresCOE.length == 0 && gmTaInatCOE.length == 0) {
                  loDvMais.style.display = "none";
                }

                break;
              }
            }

            return;
          }

          for (var i = 0; i < gmAtDresCOE.length; i++) {
            if (
              parseInt(gmAtDresCOE[i].id_excl) == lnIdExcl &&
              parseInt(gmAtDresCOE[i].id_ativ) == lnIdAtiv
            ) {
              llAtDres = true;

              gmAtDresCOE[i].ap_dres = parseFloat(lnApDres);

              break;
            }
          }

          if (!llAtDres) {
            gmAtDresCOE.push({
              id_empr: gcIdEmpr,
              id_ords: lnIdOrds,
              id_excl: lnIdExcl,
              id_ativ: lnIdAtiv,
              ap_dres: lnApDres,
              ap_data: lcApData,
            });

            loDvMais.style.display = "";
          }

          if (lnApDres > 0) {
            lcApDres = brDecimal(lnApDres) + " dias restantes";
          } else {
            lcApDres = "finalizado";
          }

          if (lnGrDres > 0) {
            lcGrDres = brDecimal(lnGrDres) + " dias restantes";
          } else {
            lcGrDres = "finalizado";
          }

          loBdDres.innerHTML =
            "<s>" +
            lcGrDres +
            "</s><br /><span style='color: orange;'>" +
            lcApDres +
            "</span>";
        },
      },
      {
        text: "cancelar",
        cssClass: "botaoAzulClaro",
      },
    ];
  } else {
    lmBtList = [
      {
        text: "ok",
        cssClass: "color-blue",
        onClick: function () {
          var loNrDres = document.getElementById("nroDresCOE");

          if (lnIdExcl == 0) {
            try {
              if (parseFloat(loWkRsql.ap_dres) == -1) {
                alerta("atividade sem apontamento", "alerta");

                return;
              }
            } catch (error) {}
          }

          try {
            if (parseFloat(parseFloat(loNrDres.value).toFixed(2)) >= 0) {
              lnApDres = parseFloat(parseFloat(loNrDres.value).toFixed(2));
            }
          } catch (error) {}

          if (lnGrDres == lnApDres) {
            if (lnApDres > 0) {
              lcApDres = brDecimal(lnApDres) + " dias restantes";
            } else {
              lcApDres = "finalizado";
            }

            loBdDres.innerHTML = lcApDres;

            for (var i = 0; i < gmAtDresCOE.length; i++) {
              if (
                parseInt(gmAtDresCOE[i].id_excl) == lnIdExcl &&
                parseInt(gmAtDresCOE[i].id_ativ) == lnIdAtiv
              ) {
                gmAtDresCOE.splice(i, 1);

                if (gmAtDresCOE.length == 0 && gmTaInatCOE.length == 0) {
                  loDvMais.style.display = "none";
                }

                break;
              }
            }

            return;
          }

          for (var i = 0; i < gmAtDresCOE.length; i++) {
            if (
              parseInt(gmAtDresCOE[i].id_excl) == lnIdExcl &&
              parseInt(gmAtDresCOE[i].id_ativ) == lnIdAtiv
            ) {
              llAtDres = true;

              gmAtDresCOE[i].ap_dres = parseFloat(lnApDres);

              break;
            }
          }

          if (!llAtDres) {
            gmAtDresCOE.push({
              id_empr: gcIdEmpr,
              id_ords: lnIdOrds,
              id_excl: lnIdExcl,
              id_ativ: lnIdAtiv,
              ap_dres: lnApDres,
              ap_data: lcApData,
            });

            loDvMais.style.display = "";
          }

          if (lnApDres > 0) {
            lcApDres = brDecimal(lnApDres) + " dias restantes";
          } else {
            lcApDres = "finalizado";
          }

          if (lnGrDres > 0) {
            lcGrDres = brDecimal(lnGrDres) + " dias restantes";
          } else {
            lcGrDres = "finalizado";
          }

          loBdDres.innerHTML =
            "<s>" +
            lcGrDres +
            "</s><br /><span style='color: orange;'>" +
            lcApDres +
            "</span>";
        },
      },
      {
        text: "cancelar",
        cssClass: "botaoAzulClaro",
      },
    ];
  }

  app.dialog
    .create({
      title: "informação",
      text: "dias restantes",
      content:
        "<input type='number' min='0' step='0.1' id='nroDresCOE' value='" +
        lnAxDres.toString() +
        "' placeholder='digite os dias restantes' class='dialog-input'>",
      buttons: lmBtList,
    })
    .open();
}

function montaTarefasCOE() {
  var loDvMais = document.getElementById("divMaisCOE");
  var loTxDeno = document.getElementById("txtDenoCOE");
  var loUlAtiv = document.getElementById("uulAtivCOE");
  var lcWkRsql = "",
    lcCrDres = "",
    lcTaCodi = "",
    lcApDres = "",
    lcUaData = "",
    lcApExcl = "",
    lcApData = "",
    lcBtDres = "",
    lcOnCont = "",
    lcAlClas = "",
    lcAlAhrf = "",
    lcBgClor = "",
    lcFrClor = "";
  var lmOsTare = [];
  var lnApDres = 0,
    lnTaInat = 0;
  var llAlOpen = false;

  gmAtDresCOE = [];
  gmTaInatCOE = [];

  loDvMais.style.display = "none";

  try {
    if (loTxDeno.value.toString().trim().length > 0) {
      lmOsTare = gmOsTareCOE.filter(function (loWkRsql) {
        return (
          (
            loWkRsql.ta_codi.trim().toUpperCase() +
            loWkRsql.id_ativ.toString() +
            loWkRsql.at_deno.toString().trim().toUpperCase()
          ).indexOf(loTxDeno.value.toString().trim().toUpperCase()) >= 0
        );
      });
    } else {
      lmOsTare = gmOsTareCOE;
    }

    for (var i = 0; i < lmOsTare.length; i++) {
      lcCrDres = "";
      lcUaData = "";
      lcAlClas = "";
      lcAlAhrf = "";
      lcBgClor = "";
      lcFrClor = "";
      llAlOpen = false;
      lnTaInat = parseInt(lmOsTare[i].ta_inat);

      if (parseFloat(lmOsTare[i].ap_dres) == 0) {
        if (lnTaInat > 0) {
          lcCrDres =
            " style='background-color: white; text-decoration: line-through; color: black;'";
          lcFrClor = " style='color: black;'";
        } else {
          lcCrDres = " style='background-color: rgba( 0, 255, 0, 0.25 );'";
          lcFrClor = "";
        }

        lcBgClor = "rgba( 0, 255, 0, 0.25 )";

        lcApDres = "finalizado";
        lnApDres = 0;
        //prettier-ignore
        lcUaData = 
          "<div class='row no-gap'>" +
            "<div class='col borda' style='text-align: center;'>término real</div>" +
            "<div class='col borda' style='text-align: center;'><b>" + jsonDate(lmOsTare[i].ua_data) + "</b></div>" +
          "</div>";
      } else if (parseFloat(lmOsTare[i].ap_dres) > 0) {
        if (lnTaInat > 0) {
          lcCrDres =
            " style='background-color: white; text-decoration: line-through; color: black;'";
          lcFrClor = " style='color: black;'";
        } else {
          lcCrDres = " style='background-color: rgba( 255, 0, 0, 0.25 );'";
          lcFrClor = "";
        }

        lcBgClor = "rgba( 255, 0, 0, 0.25 )";

        lcApDres = brDecimal(lmOsTare[i].ap_dres) + " dias restantes";
        lnApDres = parseFloat(lmOsTare[i].ap_dres);
      } else {
        if (lnTaInat > 0) {
          lcCrDres =
            " style='background-color: white; text-decoration: line-through; color: black;'";
          lcFrClor = " style='color: black;'";
        } else {
          lcCrDres = "";
          lcFrClor = "";
        }

        lcBgClor = "";

        if (parseFloat(lmOsTare[i].at_dres) > 0) {
          lcApDres = brDecimal(lmOsTare[i].at_dres) + " dias restantes";
          lnApDres = parseFloat(lmOsTare[i].at_dres);
        } else {
          if (lmOsTare[i].at_tipo.trim().toUpperCase() == "T") {
            if (lnTaInat > 0) {
              lcCrDres =
                " style='background-color: white; text-decoration: line-through; color: black;'";
              lcFrClor = " style='color: black;'";
            } else {
              lcCrDres = " style='background-color: rgba( 0, 255, 0, 0.25 );'";
              lcFrClor = "";
            }

            lcBgClor = "rgba( 0, 255, 0, 0.25 )";

            lcApDres = "finalizado";
            lnApDres = 0;
            //prettier-ignore
            lcUaData = 
              "<div class='row no-gap'>" +
                "<div class='col borda' style='text-align: center;'>término real</div>" +
                "<div class='col borda' style='text-align: center;'><b>" + jsonDate(lmOsTare[i].ta_dtid) + "</b></div>" +
              "</div>";
          } else {
            lcApDres = "";
            lnApDres = 0;
          }
        }
      }

      if (lmOsTare[i].at_tipo.trim().toUpperCase() == "T") {
        lcTaCodi = lmOsTare[i].ta_codi.trim().toUpperCase();
      } else {
        lcTaCodi = lmOsTare[i].id_ativ.toString();
      }

      if (parseInt(lmOsTare[i].qt_apex) > 0) {
        lcApExcl =
          "<i class='material-icons text-color-orange'>warning</i> " +
          lmOsTare[i].qt_apex.toString() +
          " apontamento(s) apagado(s)</br>" +
          "<i class='material-icons text-color-orange'>warning</i> último apagado em " +
          jsonDate(lmOsTare[i].ae_data) +
          "</br>" +
          "<i class='material-icons text-color-orange'>warning</i> último apagado por " +
          lmOsTare[i].ae_user.trim().toUpperCase();
      } else {
        lcApExcl = "";
      }

      if (parseFloat(lmOsTare[i].at_dres) == 1000) {
        //prettier-ignore
        lcWkRsql +=
          "<li style='background-color: rgba( 255, 255, 0, 0.25 );'>" +
            "<div class='item-content'>" +
              "<div class='item-inner'>" +
                "<div class='item-title'><b>" + lcTaCodi + " - " + lmOsTare[i].at_deno.trim().toUpperCase() + "</b></div>" +
              "</div>" +
            "</div>" +
          "</li>";
      } else {
        lcApData = jsonDate(lmOsTare[i].ap_data);

        if (lcApData.trim().length == 0) {
          lcApData = "&nbsp;";
        }

        if (gcSiOper == "iOS") {
          lcOnCont = "";
          //prettier-ignore
          lcBtDres = 
                "<div class='row no-gap'>" +
                  "<button class='col button button-fill' onclick='adicionaAtualizaDiasRestantesCOE(\"" + escape(JSON.stringify(lmOsTare[i])) + "\", " + i.toString() + ", " + lnApDres.toString() + ", " + lnTaInat.toString() + ", \"" + lcBgClor + "\");'>alterar dias restantes</button>" +
                "</div>" +
                "<div class='row no-gap'>&nbsp;</div>";
        } else {
          //prettier-ignore
          lcOnCont = " oncontextmenu='adicionaAtualizaDiasRestantesCOE(\"" + escape(JSON.stringify(lmOsTare[i])) + '", ' + i.toString() + ", " + lnApDres.toString() + ", " + lnTaInat.toString() + ", \"" + lcBgClor + "\");'";
          lcBtDres = "";
        }

        for (var j = 0; j < gmTrSglaCOE.length; j++) {
          if (lmOsTare[i].at_tipo.trim().toUpperCase() == "T") {
            if (
              parseInt(lmOsTare[i].id_excl) == parseInt(gmTrSglaCOE[j].id_excl)
            ) {
              llAlOpen = true;

              break;
            }
          } else {
            if (
              parseInt(lmOsTare[i].id_ativ) == parseInt(gmTrSglaCOE[j].id_ativ)
            ) {
              llAlOpen = true;

              break;
            }
          }
        }

        if (llAlOpen) {
          lcAlClas = " accordion-item-opened always-open";

          //prettier-ignore
          lcAlAhrf = 
            "<div class='item-content'" + lcOnCont + ">" +
              "<div class='item-inner'>" +
                "<div class='item-title'><b>" + lcTaCodi + " - " + lmOsTare[i].at_deno.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b id='bldDrs" + i.toString() + "COE'" + lcFrClor + ">" + lcApDres + "</b></div>" + 
              "</div>" +
            "</div>";
        } else {
          //prettier-ignore
          lcAlAhrf = 
            "<a href='#' class='item-content item-link'" + lcOnCont + ">" +
              "<div class='item-inner'>" +
                "<div class='item-title'><b>" + lcTaCodi + " - " + lmOsTare[i].at_deno.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b id='bldDrs" + i.toString() + "COE'" + lcFrClor + ">" + lcApDres + "</b></div>" + 
              "</div>" +
            "</a>";
        }

        //prettier-ignore
        lcWkRsql += 
          "<li id='lliEdt" + i.toString() + "COE' class='accordion-item" + lcAlClas + "'" + lcCrDres + ">" +
            lcAlAhrf +
            "<div class='accordion-item-content'>" +
              "<div class='block'>" +
                lcBtDres +
                lcApExcl +
                "<div class='row no-gap'>" +
                  "<div class='col borda'><textarea id='txaEdt" + i.toString() + "COE' readonly style='text-align: center; font-weight: bold;'" + lcFrClor + ">" + lcTaCodi + " - " + lmOsTare[i].at_deno.trim().toUpperCase() + "</textarea></div>" +
                "</div>" +
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center; border-bottom-width: 2px;'>" +
                    "trab. real antes<br/>" +
                    "até " + jsonDate(lmOsTare[i].ap_ante) +
                  "</div>" +
                  "<div class='col borda' style='text-align: center;'>" +
                    "<div class='row no-gap'>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px; border-bottom-style: solid; border-bottom-width: 1px;'>MOI</div>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px; border-bottom-style: solid; border-bottom-width: 1px;'>MOD</div>" +
                      "<div class='col' style='text-align: center; border-bottom-style: solid; border-bottom-width: 1px;'>EQP</div>" +
                    "</div>" + 
                    "<div class='row no-gap'>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px;'><b>" + lmOsTare[i].ap_anmi.trim().toUpperCase() + "</b></div>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px;'><b>" + lmOsTare[i].ap_anmd.trim().toUpperCase() + "</b></div>" +
                      "<div class='col' style='text-align: center;'><b>" + lmOsTare[i].ap_aneq.trim().toUpperCase() + "</b></div>" +
                    "</div>" + 
                  "</div>" +
                "</div>" +
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center; border-bottom-width: 2px;'>" +
                    "trab. real atual<br/>" +
                    "até " + jsonDate(lmOsTare[i].ap_real) +
                  "</div>" +
                  "<div class='col borda' style='text-align: center;'>" +
                    "<div class='row no-gap'>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px; border-bottom-style: solid; border-bottom-width: 1px;'>MOI</div>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px; border-bottom-style: solid; border-bottom-width: 1px;'>MOD</div>" +
                      "<div class='col' style='text-align: center; border-bottom-style: solid; border-bottom-width: 1px;'>EQP</div>" +
                    "</div>" + 
                    "<div class='row no-gap'>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px;'><b>" + lmOsTare[i].ap_atmi.trim().toUpperCase() + "</b></div>" +
                      "<div class='col' style='text-align: center; border-right-style: solid; border-right-width: 1px;'><b>" + lmOsTare[i].ap_atmd.trim().toUpperCase() + "</b></div>" +
                      "<div class='col' style='text-align: center;'><b>" + lmOsTare[i].ap_ateq.trim().toUpperCase() + "</b></div>" +
                    "</div>" + 
                  "</div>" +
                "</div>" +
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center;'>horas plan.</div>" +
                  "<div class='col borda' style='text-align: center;'><b>" + pad(lmOsTare[i].ta_hrpl.toFixed(2), 5).replace(".", ":") + "</b></div>" +
                "</div>" +
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center;'>início real</div>" +
                  "<div class='col borda' style='text-align: center;'><b>" + lcApData + "</b></div>" +
                "</div>" +
                lcUaData +                 
              "</div>";

        for (var j = 0; j < gmTrSglaCOE.length; j++) {
          if (lmOsTare[i].at_tipo.trim().toUpperCase() == "T") {
            if (
              parseInt(lmOsTare[i].id_excl) == parseInt(gmTrSglaCOE[j].id_excl)
            ) {
              //prettier-ignore
              lcWkRsql += 
              "<div class='block-title'>apontamentos, por função, entre os dias " + jsonDate(lmOsTare[i].ax_ante) + " e " + jsonDate(lmOsTare[i].ap_real) + "</div>" +
              "<div class='block'>" +
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center;'><b>função</b></div>" +
                  "<div class='col borda' style='text-align: center;'><b>qtde</b></div>" +
                  "<div class='col borda' style='text-align: center;'><b>horas</b></div>" +
                "</div>";

              break;
            }
          } else {
            if (
              parseInt(lmOsTare[i].id_ativ) == parseInt(gmTrSglaCOE[j].id_ativ)
            ) {
              //prettier-ignore
              lcWkRsql += 
              "<div class='block-title'>apontamentos, por função, entre os dias " + jsonDate(lmOsTare[i].ax_ante) + " e " + jsonDate(lmOsTare[i].ap_real) + "</div>" +
              "<div class='block'>" +
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center;'><b>função</b></div>" +
                  "<div class='col borda' style='text-align: center;'><b>qtde</b></div>" +
                  "<div class='col borda' style='text-align: center;'><b>horas</b></div>" +
                "</div>";

              break;
            }
          }
        }

        for (var j = 0; j < gmTrSglaCOE.length; j++) {
          if (lmOsTare[i].at_tipo.trim().toUpperCase() == "T") {
            if (
              parseInt(lmOsTare[i].id_excl) == parseInt(gmTrSglaCOE[j].id_excl)
            ) {
              //prettier-ignore
              lcWkRsql += 
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center;'>" + gmTrSglaCOE[j].fu_sgla.trim().toUpperCase() + "</div>" +
                  "<div class='col borda' style='text-align: center;'>" + gmTrSglaCOE[j].qt_apnt.toString() + "</div>" +
                  "<div class='col borda' style='text-align: center;'>" + gmTrSglaCOE[j].ap_hras.trim().toUpperCase() + "</div>" +
                "</div>";
            }
          } else {
            if (
              parseInt(lmOsTare[i].id_ativ) == parseInt(gmTrSglaCOE[j].id_ativ)
            ) {
              //prettier-ignore
              lcWkRsql += 
                "<div class='row no-gap'>" +
                  "<div class='col borda' style='text-align: center;'>" + gmTrSglaCOE[j].fu_sgla.trim().toUpperCase() + "</div>" +
                  "<div class='col borda' style='text-align: center;'>" + gmTrSglaCOE[j].qt_apnt.toString() + "</div>" +
                  "<div class='col borda' style='text-align: center;'>" + gmTrSglaCOE[j].ap_hras.trim().toUpperCase() + "</div>" +
                "</div>";
            }
          }
        }

        for (var j = 0; j < gmTrSglaCOE.length; j++) {
          if (lmOsTare[i].at_tipo.trim().toUpperCase() == "T") {
            if (
              parseInt(lmOsTare[i].id_excl) == parseInt(gmTrSglaCOE[j].id_excl)
            ) {
              //prettier-ignore
              lcWkRsql += 
              "</div>";

              break;
            }
          } else {
            if (
              parseInt(lmOsTare[i].id_ativ) == parseInt(gmTrSglaCOE[j].id_ativ)
            ) {
              //prettier-ignore
              lcWkRsql += 
              "</div>";

              break;
            }
          }
        }

        //prettier-ignore
        lcWkRsql += 
            "</div>" +
          "</li>";
      }
    }
  } catch (loApErro) {}

  loUlAtiv.innerHTML = lcWkRsql;

  document.querySelectorAll(".accordion-item").forEach(function (loAcItem) {
    loAcItem.addEventListener("accordion:beforeclose", function (e) {
      if (loAcItem.classList.contains("always-open")) {
        e.detail.prevent();
      }
    });
  });
}

function pesquisaObrasCOE() {
  var loSlObra = document.getElementById("sltObraCOE");
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

function consultaApontamentoFinalizadoCOE(loDtData) {
  var loSlObra = document.getElementById("sltObraCOE");
  var ldDtHoje = new Date();
  var lnIdCadt = 0,
    lnIdOrds = 0;
  var lcWkIsql = "",
    lcDrData = "";
  var lmWkIsql = [];

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    alerta("obra inválida", "alerta");

    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    lcDrData = loDtData.value.toString().trim();
  } else {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (htmlDataParaObjetoData(lcDrData) > ldDtHoje) {
    alerta("data maior que data atual", "alerta");

    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  try {
    if (parseInt(goOsLctoCOE.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOE.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds > 0) {
    pesquisaRelatorioAtividadesCOE();
  }
}

function validaDataCOE(loDtData) {
  var loDtDtde = document.getElementById("datDtdeCOE");
  var loDtDtat = document.getElementById("datDtatCOE");
  var lnIdOrds = 0;
  var ldDtHoje = new Date();

  if (loDtData.value == loDtData.defaultValue) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (
    htmlDataParaObjetoData(loDtDtat.value) <
    htmlDataParaObjetoData(loDtDtde.value)
  ) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  ldDtHoje.setDate(ldDtHoje.getDate() - 1);

  if (ldDtHoje.getHours() < 12) {
    ldDtHoje.setDate(ldDtHoje.getDate() - 1);
  }

  if (ldDtHoje < htmlDataParaObjetoData(loDtData.value)) {
    consultaApontamentoFinalizadoCOE(loDtData);

    return;
  }

  try {
    if (parseInt(goOsLctoCOE.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCOE.id_ords);
    }
  } catch (error) {}

  if (lnIdOrds > 0) {
    pesquisaRelatorioAtividadesCOE();
  }
}

function limpaCamposAtividadeCOE() {
  var loDvMais = document.getElementById("divMaisCOE");
  var loUlAtiv = document.getElementById("uulAtivCOE");

  gmOsTareCOE = [];
  gmTrSglaCOE = [];
  gmAtDresCOE = [];
  gmTaInatCOE = [];

  loDvMais.style.display = "none";

  loUlAtiv.innerHTML = "";
}

function limpaCamposCOE() {
  var loNrNume = document.getElementById("nroNumeCOE");
  var loDvTipo = document.getElementById("divTipoCOE");
  var loDvResp = document.getElementById("divRespCOE");
  var loDvOrca = document.getElementById("divOrcaCOE");
  var loDvNcli = document.getElementById("divNcliCOE");
  var loDvNcon = document.getElementById("divNconCOE");
  var loTaDesc = document.getElementById("txaDescCOE");

  goOsLctoCOE = {};

  loNrNume.value = "";

  loDvTipo.innerHTML = "";
  loDvResp.innerHTML = "";
  loDvOrca.innerHTML = "";
  loDvNcli.innerHTML = "";
  loDvNcon.innerHTML = "";

  loTaDesc.value = "";

  limpaCamposAtividadeCOE();
}

function limpaDataCOE() {
  var loDtDtde = document.getElementById("datDtdeCOE");
  var loDtDtat = document.getElementById("datDtatCOE");
  var ldDtHoje = new Date();

  ldDtHoje.setDate(ldDtHoje.getDate() - 1);

  if (ldDtHoje.getHours() >= 12) {
    loDtDtat.valueAsDate = ldDtHoje;
  } else {
    ldDtHoje.setDate(ldDtHoje.getDate() - 1);

    loDtDtat.valueAsDate = ldDtHoje;
  }

  app.input.validate(loDtDtat);

  ldDtHoje.setDate(ldDtHoje.getDate() - 6);

  loDtDtde.valueAsDate = ldDtHoje;

  app.input.validate(loDtDtde);
}

function ComlOsEdts() {
  var loSlObra = document.getElementById("sltObraCOE");
  var loDvDica = document.getElementById("divDicaCOE");

  loSlObra.selectedIndex = 0;

  if (isMobile()) {
    if (gcSiOper == "Android") {
      loDvDica.innerHTML =
        "dica: clique na atividade e segure para editar os dias restantes";
    }
  } else {
    loDvDica.innerHTML =
      "dica: clique na atividade com o botão direito do mouse para editar os dias restantes";
  }

  limpaDataCOE();
  limpaCamposCOE();
  pesquisaObrasCOE();

  OkTecladoAndroid("nroNumeCOE");
  OkTecladoAndroid("txtDenoCOE");
}
