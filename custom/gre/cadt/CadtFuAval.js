var goFuAvalCFA = {},
  goCdFuncCFA = {};

function consultaCFA(loWkRsql) {
  var loDvMatr = document.getElementById("divMatrCFA");
  var loDvNome = document.getElementById("divNomeCFA");
  var loDvFunc = document.getElementById("divFuncCFA");
  var loDvTmdo = document.getElementById("divTmdoCFA");

  limpaCamposFuncionarioCFA();

  if (loWkRsql.id_parm.trim().toUpperCase() == "DR_FUNC") {
    goCdFuncCFA = loWkRsql;

    loDvMatr.innerHTML = goCdFuncCFA.id_matr.toString();
    loDvNome.innerHTML = goCdFuncCFA.fu_nome.trim().toUpperCase();
    loDvFunc.innerHTML = goCdFuncCFA.fu_func.trim().toUpperCase();
    loDvTmdo.innerHTML = goCdFuncCFA.cb_tmdo.trim().toUpperCase();
  }
}

function pesquisaFuncionariosCFA() {
  var loDtData = document.getElementById("datDataCFA");
  var loSlObra = document.getElementById("sltObraCFA");
  var lnIdCadt = 0;
  var loPaPesq = {};
  var lcDrData = null;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length == 0) {
    alerta("data da avaliação inválida", "alerta");

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    alerta("data da avaliação maior que data atual", "alerta");

    return;
  } else {
    lcDrData = loDtData.value.toString().trim().toUpperCase();
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

  loPaPesq = {
    id_parm: "dr_func",
    pa_titu: "pesquisa de funcionários",
    pa_pesq: true,
    dr_data: lcDrData,
    id_cadt: lnIdCadt,
    pa_slct:
      "<option value='fu_nome' selected>nome</option>" +
      "<option value='id_matr'>matrícula</option>",
  };

  sessionStorage.setItem("soPaPesq", JSON.stringify(loPaPesq));

  limpaCamposFuncionarioCFA();

  redireciona("PesqTbCadt.html", "PesqTbCadt.html");
}

function deletaAvaliacaoCFA() {
  var lnIdAval = 0;
  var lcWkIsql = "",
    lcIdUser = "";
  var lmWkIsql = [];

  try {
    if (goFuAvalCFA.id_user.trim().length > 0) {
      lcIdUser = goFuAvalCFA.id_user.trim().toUpperCase();
    }
  } catch (error) {}

  if (
    lcIdUser.trim().length > 0 &&
    goCdUser.id_user.trim().toUpperCase() != lcIdUser
  ) {
    alerta(
      "impossível excluir, usuário " + lcIdUser + " responsável pela avaliação",
      "alerta"
    );

    return;
  }

  try {
    if (parseInt(goFuAvalCFA.id_aval) > 0) {
      lnIdAval = parseInt(goFuAvalCFA.id_aval);
    }
  } catch (error) {}

  if (lnIdAval == 0) {
    limpaCamposCFA();

    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdAval", pa_tipo: "Int", pa_valo: lnIdAval },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCFA();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=deletaAvaliacao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      notificacao("avaliação excluída", "sucesso");

      try {
        pesquisaAvaliacoesCRA();
      } catch (error) {}

      try {
        pesquisaAvaliacoesCCA();
      } catch (error) {}

      goMnView.router.back();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereAvaliacaoCFA() {
  var loDtData = document.getElementById("datDataCFA");
  var loSlObra = document.getElementById("sltObraCFA");
  var loNrOrga = document.getElementById("nroOrgaCFA");
  var loNrProd = document.getElementById("nroProdCFA");
  var loNrQual = document.getElementById("nroQualCFA");
  var loNrDisc = document.getElementById("nroDiscCFA");
  var loNrFalt = document.getElementById("nroFaltCFA");
  var loNrCelu = document.getElementById("nroCeluCFA");
  var loNrAloj = document.getElementById("nroAlojCFA");
  var loNrResc = document.getElementById("nroRescCFA");
  var loNrFerr = document.getElementById("nroFerrCFA");
  var loNrFabr = document.getElementById("nroFabrCFA");
  var loNrMsol = document.getElementById("nroMsolCFA");
  var loNrMalt = document.getElementById("nroMaltCFA");
  var loNrTubu = document.getElementById("nroTubuCFA");
  var loNrPtaa = document.getElementById("nroPtaaCFA");
  var loNrSgsl = document.getElementById("nroSgslCFA");
  var loTaObse = document.getElementById("txaObseCFA");
  var ldDtHoje = new Date();
  var lnIdClie = 0,
    lnIdMatr = 0,
    lnAvOrga = 0,
    lnAvProd = 0,
    lnAvQual = 0,
    lnAvDisc = 0,
    lnAvFalt = 0,
    lnAvCelu = 0,
    lnAvAloj = 0,
    lnAvResc = 0,
    lnAvFerr = 0,
    lnAvFabr = 0,
    lnAvMsol = 0,
    lnAvMalt = 0,
    lnAvTubu = 0,
    lnAvPtaa = 0,
    lnIdAval = 0,
    lnAvSgsl = 0;
  var lcWkIsql = "",
    lcAvData = "",
    lcFuEmpr = "",
    lcIdUser = "",
    lcAvObse = "";
  var lmWkIsql = [];
  var llCpAlrt = false;

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loNrOrga.value.toString().trim().length == 0) {
    app.input.validate(loNrOrga);

    llCpAlrt = true;
  }

  if (loNrProd.value.toString().trim().length == 0) {
    app.input.validate(loNrProd);

    llCpAlrt = true;
  }

  if (loNrQual.value.toString().trim().length == 0) {
    app.input.validate(loNrQual);

    llCpAlrt = true;
  }

  if (loNrDisc.value.toString().trim().length == 0) {
    app.input.validate(loNrDisc);

    llCpAlrt = true;
  }

  if (loNrFalt.value.toString().trim().length == 0) {
    app.input.validate(loNrFalt);

    llCpAlrt = true;
  }

  if (loNrCelu.value.toString().trim().length == 0) {
    app.input.validate(loNrCelu);

    llCpAlrt = true;
  }

  if (loNrAloj.value.toString().trim().length == 0) {
    app.input.validate(loNrAloj);

    llCpAlrt = true;
  }

  if (loNrResc.value.toString().trim().length == 0) {
    app.input.validate(loNrResc);

    llCpAlrt = true;
  }

  if (loNrFerr.value.toString().trim().length == 0) {
    app.input.validate(loNrFerr);

    llCpAlrt = true;
  }

  if (loNrFabr.value.toString().trim().length == 0) {
    app.input.validate(loNrFabr);

    llCpAlrt = true;
  }

  if (loNrMsol.value.toString().trim().length == 0) {
    app.input.validate(loNrMsol);

    llCpAlrt = true;
  }

  if (loNrMalt.value.toString().trim().length == 0) {
    app.input.validate(loNrMalt);

    llCpAlrt = true;
  }

  if (loNrTubu.value.toString().trim().length == 0) {
    app.input.validate(loNrTubu);

    llCpAlrt = true;
  }

  if (loNrPtaa.value.toString().trim().length == 0) {
    app.input.validate(loNrPtaa);

    llCpAlrt = true;
  }

  if (llCpAlrt) {
    return;
  }

  try {
    if (goFuAvalCFA.id_user.trim().length > 0) {
      lcIdUser = goFuAvalCFA.id_user.trim().toUpperCase();
    }
  } catch (error) {}

  if (
    lcIdUser.trim().length > 0 &&
    goCdUser.id_user.trim().toUpperCase() != lcIdUser
  ) {
    alerta(
      "impossível alterar, usuário " + lcIdUser + " responsável pela avaliação",
      "alerta"
    );

    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    alerta("data da avaliação inválida", "alerta");

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    alerta("data da avaliação maior que data atual", "alerta");

    return;
  } else {
    lcAvData = loDtData.value.toString().trim().toUpperCase();
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  try {
    if (parseInt(goCdFuncCFA.id_matr) > 0) {
      lnIdMatr = parseInt(goCdFuncCFA.id_matr);
      lcFuEmpr = goCdFuncCFA.fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  if (lnIdMatr == 0) {
    alerta("funcionário inválido", "alerta");

    return;
  }

  try {
    if (parseInt(goFuAvalCFA.id_aval) > 0) {
      lnIdAval = parseInt(goFuAvalCFA.id_aval);
    }
  } catch (error) {}

  try {
    if (parseInt(loNrOrga.value) > 0) {
      lnAvOrga = parseInt(loNrOrga.value);
    }
  } catch (error) {}

  if (lnAvOrga > 10) {
    alerta("nota para organização inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrProd.value) > 0) {
      lnAvProd = parseInt(loNrProd.value);
    }
  } catch (error) {}

  if (lnAvProd > 10) {
    alerta("nota para produção inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrQual.value) > 0) {
      lnAvQual = parseInt(loNrQual.value);
    }
  } catch (error) {}

  if (lnAvQual > 10) {
    alerta("nota para qualidade inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrDisc.value) > 0) {
      lnAvDisc = parseInt(loNrDisc.value);
    }
  } catch (error) {}

  if (lnAvDisc > 10) {
    alerta("nota para disciplina inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrFalt.value) > 0) {
      lnAvFalt = parseInt(loNrFalt.value);
    }
  } catch (error) {}

  if (lnAvFalt > 10) {
    alerta("nota para faltas inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrCelu.value) > 0) {
      lnAvCelu = parseInt(loNrCelu.value);
    }
  } catch (error) {}

  if (lnAvCelu > 10) {
    alerta("nota para celular inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrAloj.value) > 0) {
      lnAvAloj = parseInt(loNrAloj.value);
    }
  } catch (error) {}

  if (lnAvAloj > 10) {
    alerta("nota para alojamento inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrResc.value) > 0) {
      lnAvResc = parseInt(loNrResc.value);
    }
  } catch (error) {}

  if (lnAvResc > 10) {
    alerta("nota para rescisão inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrFerr.value) > 0) {
      lnAvFerr = parseInt(loNrFerr.value);
    }
  } catch (error) {}

  if (lnAvFerr > 10) {
    alerta("nota para ferramental inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrFabr.value) > 0) {
      lnAvFabr = parseInt(loNrFabr.value);
    }
  } catch (error) {}

  if (lnAvFabr > 10) {
    alerta("nota para fabricação inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrMsol.value) > 0) {
      lnAvMsol = parseInt(loNrMsol.value);
    }
  } catch (error) {}

  if (lnAvMsol > 10) {
    alerta("nota para montagem( solo ) inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrMalt.value) > 0) {
      lnAvMalt = parseInt(loNrMalt.value);
    }
  } catch (error) {}

  if (lnAvMalt > 10) {
    alerta("nota para montagem( altura ) inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrTubu.value) > 0) {
      lnAvTubu = parseInt(loNrTubu.value);
    }
  } catch (error) {}

  if (lnAvTubu > 10) {
    alerta("nota para tubulação inválida", "alerta");

    return;
  }

  try {
    if (parseInt(loNrPtaa.value) > 0) {
      lnAvPtaa = parseInt(loNrPtaa.value);
    }
  } catch (error) {}

  if (lnAvPtaa > 10) {
    alerta("nota para pta inválida", "alerta");

    return;
  }

  try {
    if (parseFloat(loNrSgsl.value) > 0) {
      lnAvSgsl = parseFloat(loNrSgsl.value);
    }
  } catch (error) {}

  if (lnAvSgsl < 0) {
    alerta("sugestão de salário inválida", "alerta");

    return;
  }

  lcAvObse = loTaObse.value.toString().trim().toUpperCase();

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdAval", pa_tipo: "Int", pa_valo: lnIdAval },
    { pa_nome: "ldAvData", pa_tipo: "SmallDatetime", pa_valo: lcAvData },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lnAvOrga", pa_tipo: "Decimal", pa_valo: lnAvOrga },
    { pa_nome: "lnAvProd", pa_tipo: "Decimal", pa_valo: lnAvProd },
    { pa_nome: "lnAvQual", pa_tipo: "Decimal", pa_valo: lnAvQual },
    { pa_nome: "lnAvDisc", pa_tipo: "Decimal", pa_valo: lnAvDisc },
    { pa_nome: "lnAvFalt", pa_tipo: "Decimal", pa_valo: lnAvFalt },
    { pa_nome: "lnAvCelu", pa_tipo: "Decimal", pa_valo: lnAvCelu },
    { pa_nome: "lnAvAloj", pa_tipo: "Decimal", pa_valo: lnAvAloj },
    { pa_nome: "lnAvResc", pa_tipo: "Decimal", pa_valo: lnAvResc },
    { pa_nome: "lnAvFerr", pa_tipo: "Decimal", pa_valo: lnAvFerr },
    { pa_nome: "lnAvFabr", pa_tipo: "Decimal", pa_valo: lnAvFabr },
    { pa_nome: "lnAvMsol", pa_tipo: "Decimal", pa_valo: lnAvMsol },
    { pa_nome: "lnAvMalt", pa_tipo: "Decimal", pa_valo: lnAvMalt },
    { pa_nome: "lnAvTubu", pa_tipo: "Decimal", pa_valo: lnAvTubu },
    { pa_nome: "lnAvPtaa", pa_tipo: "Decimal", pa_valo: lnAvPtaa },
    { pa_nome: "lnAvSgsl", pa_tipo: "Decimal", pa_valo: lnAvSgsl },
    { pa_nome: "lcAvObse", pa_tipo: "VarChar", pa_valo: lcAvObse },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCFA();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereAvaliacao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          notificacao("avaliação salva", "sucesso");

          try {
            pesquisaAvaliacoesCRA();
          } catch (error) {}

          try {
            pesquisaAvaliacoesCCA();
          } catch (error) {}

          goMnView.router.back();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaFuncionarioCFA() {
  var loSlObra = document.getElementById("sltObraCFA");
  var lcWkIsql = "",
    lcFuEmpr = "";
  var lmWkIsql = [];
  var lnIdMatr = 0,
    lnIdCadt = 0;

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    limpaCamposCFA();

    return;
  }

  try {
    if (parseInt(goFuAvalCFA.id_matr) > 0) {
      lnIdMatr = parseInt(goFuAvalCFA.id_matr);
      lcFuEmpr = goFuAvalCFA.fu_empr.trim().toUpperCase();
    }
  } catch (error) {}

  if (lnIdMatr == 0) {
    limpaCamposCFA();

    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: null },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
    { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposFuncionarioCFA();

  app.dialog.preloader("consultando funcionário...");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFuncionarios",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      try {
        if (lmWkRsql.length > 0) {
          lmWkRsql[0]["id_parm"] = "dr_func";

          consultaCFA(lmWkRsql[0]);

          return;
        }
      } catch (loApErro) {}

      limpaCamposCFA();
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();

      limpaCamposCFA();
    },
  });
}

function pesquisaObrasDefinidasCFA() {
  var loSlObra = document.getElementById("sltObraCFA");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "",
    lcSlSlct = "",
    lcClFant = "";
  var lmWkIsql = [];
  var lnIdClie = 0,
    lnAxClie = 0,
    lnIdCadt = 0;

  try {
    if (parseInt(goFuAvalCFA.id_clie) > 0) {
      lnIdClie = parseInt(goFuAvalCFA.id_clie);
      lnIdCadt = parseInt(goFuAvalCFA.id_cadt);
      lcClFant = goFuAvalCFA.cl_fant.trim().toUpperCase();
    }
  } catch (loApErro) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

  limpaCamposFuncionarioCFA();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlObra.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          if (parseInt(lmWkRsql[i].id_clie) == lnIdClie) {
            lcSlSlct = " selected";
          } else {
            lcSlSlct = "";
          }

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlObra.innerHTML = lcWkRsql;

      if (lnIdClie > 0) {
        try {
          if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
            lnAxClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
          }
        } catch (error) {}

        if (lnAxClie == 0) {
          //prettier-ignore
          loSlObra.innerHTML += "<option value='" + lnIdClie.toString() + "/" + lnIdCadt.toString() + "' selected>" + lcClFant + "</option>";
        }

        consultaFuncionarioCFA();
      }
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcWkRsql;

      if (lnIdClie > 0) {
        try {
          if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
            lnAxClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
          }
        } catch (error) {}

        if (lnAxClie == 0) {
          //prettier-ignore
          loSlObra.innerHTML += "<option value='" + lnIdClie.toString() + "/" + lnIdCadt.toString() + "' selected>" + lcClFant + "</option>";
        }

        consultaFuncionarioCFA();
      }
    },
  });
}

function calculaNotaCFA() {
  var loNrOrga = document.getElementById("nroOrgaCFA");
  var loNrProd = document.getElementById("nroProdCFA");
  var loNrQual = document.getElementById("nroQualCFA");
  var loNrDisc = document.getElementById("nroDiscCFA");
  var loNrFalt = document.getElementById("nroFaltCFA");
  var loNrCelu = document.getElementById("nroCeluCFA");
  var loNrAloj = document.getElementById("nroAlojCFA");
  var loNrResc = document.getElementById("nroRescCFA");
  var loNrFerr = document.getElementById("nroFerrCFA");
  var loDvNota = document.getElementById("divNotaCFA");
  var lnAvOrga = 0,
    lnAvProd = 0,
    lnAvQual = 0,
    lnAvDisc = 0,
    lnAvFalt = 0,
    lnAvCelu = 0,
    lnAvAloj = 0,
    lnAvResc = 0,
    lnAvFerr = 0;

  try {
    if (parseFloat(loNrOrga.value) > 0) {
      lnAvOrga = parseFloat(loNrOrga.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrProd.value) > 0) {
      lnAvProd = parseFloat(loNrProd.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrQual.value) > 0) {
      lnAvQual = parseFloat(loNrQual.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrDisc.value) > 0) {
      lnAvDisc = parseFloat(loNrDisc.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrFalt.value) > 0) {
      lnAvFalt = parseFloat(loNrFalt.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrCelu.value) > 0) {
      lnAvCelu = parseFloat(loNrCelu.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrAloj.value) > 0) {
      lnAvAloj = parseFloat(loNrAloj.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrResc.value) > 0) {
      lnAvResc = parseFloat(loNrResc.value);
    }
  } catch (error) {}

  try {
    if (parseFloat(loNrFerr.value) > 0) {
      lnAvFerr = parseFloat(loNrFerr.value);
    }
  } catch (error) {}

  loDvNota.innerHTML = brDecimal(
    (lnAvOrga +
      lnAvProd +
      lnAvQual +
      lnAvDisc +
      lnAvFalt +
      lnAvCelu +
      lnAvAloj +
      lnAvResc +
      lnAvFerr) /
      9
  );
}

function limpaCamposFuncionarioCFA() {
  var loDvMatr = document.getElementById("divMatrCFA");
  var loDvNome = document.getElementById("divNomeCFA");
  var loDvFunc = document.getElementById("divFuncCFA");
  var loDvTmdo = document.getElementById("divTmdoCFA");

  goCdFuncCFA = {};

  loDvMatr.innerHTML = "";
  loDvNome.innerHTML = "";
  loDvFunc.innerHTML = "";
  loDvTmdo.innerHTML = "";
}

function limpaCamposCFA() {
  var loNrOrga = document.getElementById("nroOrgaCFA");
  var loNrProd = document.getElementById("nroProdCFA");
  var loNrQual = document.getElementById("nroQualCFA");
  var loNrDisc = document.getElementById("nroDiscCFA");
  var loNrFalt = document.getElementById("nroFaltCFA");
  var loNrCelu = document.getElementById("nroCeluCFA");
  var loNrAloj = document.getElementById("nroAlojCFA");
  var loNrResc = document.getElementById("nroRescCFA");
  var loNrFerr = document.getElementById("nroFerrCFA");
  var loDvNota = document.getElementById("divNotaCFA");
  var loNrFabr = document.getElementById("nroFabrCFA");
  var loNrMsol = document.getElementById("nroMsolCFA");
  var loNrMalt = document.getElementById("nroMaltCFA");
  var loNrTubu = document.getElementById("nroTubuCFA");
  var loNrPtaa = document.getElementById("nroPtaaCFA");
  var loNrSgsl = document.getElementById("nroSgslCFA");
  var loTaObse = document.getElementById("txaObseCFA");

  goFuAvalCFA = {};

  limpaCamposFuncionarioCFA();

  loNrOrga.value = "";
  loNrProd.value = "";
  loNrQual.value = "";
  loNrDisc.value = "";
  loNrFalt.value = "";
  loNrCelu.value = "";
  loNrAloj.value = "";
  loNrResc.value = "";
  loNrFerr.value = "";

  loDvNota.innerHTML = "";

  loNrFabr.value = "";
  loNrMsol.value = "";
  loNrMalt.value = "";
  loNrTubu.value = "";
  loNrPtaa.value = "";
  loNrSgsl.value = "";
  loTaObse.value = "";
}

function CadtFuAval() {
  var loDtData = document.getElementById("datDataCFA");
  var loNrOrga = document.getElementById("nroOrgaCFA");
  var loNrProd = document.getElementById("nroProdCFA");
  var loNrQual = document.getElementById("nroQualCFA");
  var loNrDisc = document.getElementById("nroDiscCFA");
  var loNrFalt = document.getElementById("nroFaltCFA");
  var loNrCelu = document.getElementById("nroCeluCFA");
  var loNrAloj = document.getElementById("nroAlojCFA");
  var loNrResc = document.getElementById("nroRescCFA");
  var loNrFerr = document.getElementById("nroFerrCFA");
  var loNrFabr = document.getElementById("nroFabrCFA");
  var loNrMsol = document.getElementById("nroMsolCFA");
  var loNrMalt = document.getElementById("nroMaltCFA");
  var loNrTubu = document.getElementById("nroTubuCFA");
  var loNrPtaa = document.getElementById("nroPtaaCFA");
  var loNrSgsl = document.getElementById("nroSgslCFA");
  var loTaObse = document.getElementById("txaObseCFA");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtData.valueAsDate = ldDtHoje;

  limpaCamposCFA();

  try {
    goFuAvalCFA = JSON.parse(sessionStorage.getItem("soFuAval"));

    if (parseInt(goFuAvalCFA.id_aval) > 0) {
      sessionStorage.removeItem("soFuAval");

      loDtData.valueAsDate = stringDataParaObjetoData(
        jsonDate(goFuAvalCFA.av_data)
      );

      loNrOrga.value = parseFloat(goFuAvalCFA.av_orga);
      loNrProd.value = parseFloat(goFuAvalCFA.av_prod);
      loNrQual.value = parseFloat(goFuAvalCFA.av_qual);
      loNrDisc.value = parseFloat(goFuAvalCFA.av_disc);
      loNrFalt.value = parseFloat(goFuAvalCFA.av_falt);
      loNrCelu.value = parseFloat(goFuAvalCFA.av_celu);
      loNrAloj.value = parseFloat(goFuAvalCFA.av_aloj);
      loNrResc.value = parseFloat(goFuAvalCFA.av_resc);
      loNrFerr.value = parseFloat(goFuAvalCFA.av_ferr);

      calculaNotaCFA();

      loNrFabr.value = parseFloat(goFuAvalCFA.av_fabr);
      loNrMsol.value = parseFloat(goFuAvalCFA.av_msol);
      loNrMalt.value = parseFloat(goFuAvalCFA.av_malt);
      loNrTubu.value = parseFloat(goFuAvalCFA.av_tubu);
      loNrPtaa.value = parseFloat(goFuAvalCFA.av_ptaa);
      loNrSgsl.value = parseFloat(goFuAvalCFA.av_sgsl);
      loTaObse.value = goFuAvalCFA.av_obse;
    }
  } catch (loApErro) {}

  pesquisaObrasDefinidasCFA();

  OkTecladoAndroid2("nroOrgaCFA", "nroProdCFA");
  OkTecladoAndroid2("nroProdCFA", "nroQualCFA");
  OkTecladoAndroid2("nroQualCFA", "nroDiscCFA");
  OkTecladoAndroid2("nroDiscCFA", "nroFaltCFA");
  OkTecladoAndroid2("nroFaltCFA", "nroCeluCFA");
  OkTecladoAndroid2("nroCeluCFA", "nroAlojCFA");
  OkTecladoAndroid2("nroAlojCFA", "nroRescCFA");
  OkTecladoAndroid2("nroRescCFA", "nroFerrCFA");
  OkTecladoAndroid("nroFerrCFA");
  OkTecladoAndroid2("nroFabrCFA", "nroMsolCFA");
  OkTecladoAndroid2("nroMsolCFA", "nroMaltCFA");
  OkTecladoAndroid2("nroMaltCFA", "nroTubuCFA");
  OkTecladoAndroid2("nroTubuCFA", "nroPtaaCFA");
  OkTecladoAndroid2("nroPtaaCFA", "nroSgslCFA");
  OkTecladoAndroid2("nroSgslCFA", "txaObseCFA");
}
