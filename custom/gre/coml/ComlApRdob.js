var gnInListCAR = 0;
var gmWkRsqlCAR = [],
  gmApFotoCAR = [],
  gmOsJornCAR = [],
  gmOsCmntCAR = [],
  gmOsLctoCAR = [];

function deletaRecursoApontadoEmailCAR(lcWkIsql, lcWkProc, lmDlApnt, i) {
  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=" +
      lcWkProc,
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ap_erro.trim().length > 0) {
          notificacao(lmWkRsql[0].ap_erro.trim(), "alerta");
        }
      } catch (error) {}

      deletaRecursoApontadoCAR(lmDlApnt, i + 1);
    },
    error: function (jqXHR, textStatus, err) {
      deletaRecursoApontadoCAR(lmDlApnt, i + 1);
    },
  });
}

function enviaEmailCAR(loApApnt, lcWkIsql, lcWkProc, lmDlApnt, i) {
  var lcMgTitu = "Exclusão de apontamento",
    lcWkMsgm = "",
    lcEmTitu = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApSitu = "",
    lcOsTipo = "",
    lcApRcso = "";
  var loWkIsql = {};
  var ldDtHoje = new Date();

  lcEmTitu =
    "Exclusão de apontamento da obra " +
    loApApnt.cl_fant.trim().toUpperCase() +
    " do dia " +
    jsonDate(loApApnt.ap_data);

  if (parseInt(loApApnt.sr_disp) > 0) {
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

    if (parseInt(loApApnt.sr_trab) > 0) {
      //prettier-ignore
      lcApSitu = 
        "<tr>" +
          "<td style='text-align: right;'>" +
            "atividade: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            loApApnt.at_deno.trim().toUpperCase() +
          "</b></td>" +
          "<td style='text-align: right;'>" +
            "dias restantes: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            brDecimal(loApApnt.ap_dres) +
          "</b></td>" +
        "</tr>";
    } else {
      //prettier-ignore
      lcApSitu = 
        "<tr>" +
          "<td style='text-align: right;'>" +
            "justificativa: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            loApApnt.ju_deno.trim().toUpperCase() +
          "</b></td>" +
          "<td style='text-align: right;'>" +
            "responsabilidade: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            loApApnt.rj_deno.toString() +
          "</b></td>" +
        "</tr>" +
        "<tr>" +
          "<td style='text-align: right;'>" +
            "observação: " +
          "</td>" +
          "<td style='text-align: left;' colspan='3'><b>" +
            loApApnt.ap_obju.trim().toUpperCase() +
          "</b></td>" +
        "</tr>";
    }

    if (parseInt(loApApnt.os_tipo) == 1) {
      //prettier-ignore
      lcOsTipo = 
        "<tr>" +
          "<td style='text-align: right;'>" +
            "situação: " +
          "</td>" +
          "<td style='text-align: left;' colspan='3'><b>" +
            loApApnt.sr_deno.trim().toUpperCase() +
          "</b></td>" +
        "</tr>" +
        lcApSitu;
    } else {
      //prettier-ignore
      lcOsTipo = 
        "<tr>" +
          "<td style='text-align: right;'>" +
            "descrição das atividades: " +
          "</td>" +
          "<td style='text-align: left;' colspan='3'><b>" +
            loApApnt.ap_datv.trim().toUpperCase() +
          "</b></td>" +
        "</tr>";
    }

    //prettier-ignore
    lcApRcso = 
        "<tr>" +
          "<td style='text-align: right;'>" +
            "código: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            loApApnt.id_matr.toString() +
          "</b></td>" +
          "<td style='text-align: right;'>" +
            "tipo: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            loApApnt.cb_tmdo.trim().toUpperCase() +
          "</b></td>" +
        "</tr>" +
        "<tr>" +
          "<td style='text-align: right;'>" +
            "recurso: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            loApApnt.fu_nome.trim().toUpperCase() +
          "</b></td>" +
          "<td style='text-align: right;'>" +
            "função: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            loApApnt.fu_func.trim().toUpperCase() +
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
            calculaHorasCAR(loApApnt, false) +
          "</b></td>" +
          "<td style='text-align: right;'>" +
            "extra: " +
          "</td>" +
          "<td style='text-align: left;'><b>" +
            calculaHorasCAR(loApApnt, true) +
          "</b></td>" +
        "</tr>" +
        lcOsTipo;
  } else {
    return;
  }

  //prettier-ignore
  lcWkMsgm +=
    "<table style='width: 100%;'>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "excluído em: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + " por " + goCdUser.id_user.trim().toUpperCase() +
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
          "data do apontamento: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          jsonDate(loApApnt.ap_data) +
        "</b></td>" +
        "<td style='text-align: right;'>" +
          "os: " +
        "</td>" +
        "<td style='text-align: left;'><b>" +
          loApApnt.os_nume.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      "<tr>" +
        "<td style='text-align: right;'>" +
          "descrição: " +
        "</td>" +
        "<td style='text-align: left;' colspan='3'><b>" +
          loApApnt.os_desc.trim().toUpperCase() +
        "</b></td>" +
      "</tr>" +
      lcApRcso +
    "</table>";

  loWkIsql = {
    em_sndr: "planejamento.sede@gruporeall.com.br",
    em_from: "Grupo Real <planejamento.sede@gruporeall.com.br>",
    em_rcpt:
      "chamone@gruporeall.com.br;russo@gruporeall.com.br;alcides.franco@gruporeall.com.br;planejamento.sede@gruporeall.com.br;paulo@gruporeall.com.br",
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
          deletaRecursoApontadoEmailCAR(lcWkIsql, lcWkProc, lmDlApnt, i);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function deletaFotosCAR(lnIdApnt) {
  for (var i = 0; i < gmApFotoCAR.length; i++) {
    if (parseInt(gmApFotoCAR[i].id_apnt) == lnIdApnt) {
      $.ajax({
        url: goCdUser.ws_http.trim() + "insereFoto",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          lcBsFoto: "",
          lcWkPath: "apontamentos/" + lnIdApnt + "/",
          lcWkFoto: gmApFotoCAR[i].ex_sdir.trim(),
        }),

        success: function (loWkRsql) {},
        error: function (jqXHR, textStatus, err) {},
      });
    }
  }
}

function deletaRecursoApontadoCAR(lmDlApnt, i) {
  var lnIdApnt = 0,
    lnIdMatr = 0,
    lnIdEqto = 0,
    lnCtApnt = 0;
  var lcWkIsql = "",
    lcWkProc = "",
    lcFuEmpr = "";
  var lmWkIsql = [],
    lmApNexc = [];
  var ldDtHoje = new Date(),
    ldDtHjhr = new Date(),
    ldDtMdia = new Date(),
    ldDtHjzh = new Date(),
    ldDtOnzh = new Date();
  var llApExcl = false;

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDtMdia.setHours(12, 0, 0, 0);
  ldDtHjzh.setHours(0, 0, 0, 0);
  ldDtOnzh.setHours(0, 0, 0, 0);

  ldDtOnzh.setDate(ldDtOnzh.getDate() - 1);

  if (lmDlApnt.length <= i) {
    app.dialog.close();

    limpaCamposCAR();
    pesquisaJornadaOrdensServicoCAR();

    return;
  }

  try {
    if (parseInt(lmDlApnt[i].id_apnt) > 0) {
      lnIdApnt = parseInt(lmDlApnt[i].id_apnt);
    }
  } catch (error) {}

  if (lnIdApnt == 0) {
    deletaRecursoApontadoCAR(lmDlApnt, i + 1);

    return;
  }

  if (lmDlApnt[i].cb_tmdo.trim().toUpperCase() == "EQP") {
    try {
      if (parseInt(lmDlApnt[i].id_matr) > 0) {
        lnIdEqto = parseInt(lmDlApnt[i].id_matr);
      }
    } catch (error) {}

    if (lnIdEqto == 0) {
      deletaRecursoApontadoCAR(lmDlApnt, i + 1);

      return;
    }

    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdApnt", pa_tipo: "Int", pa_valo: lnIdApnt },
      { pa_nome: "lnIdEqto", pa_tipo: "Int", pa_valo: lnIdEqto },
    ];

    lcWkProc = "deletaEquipamentoApontamentoRdo";
  } else {
    try {
      if (parseInt(lmDlApnt[i].id_matr) > 0) {
        lnIdMatr = parseInt(lmDlApnt[i].id_matr);
      }
    } catch (error) {}

    if (lnIdMatr == 0) {
      deletaRecursoApontadoCAR(lmDlApnt, i + 1);

      return;
    }

    try {
      if (lmDlApnt[i].fu_empr.trim().length > 0) {
        lcFuEmpr = lmDlApnt[i].fu_empr.trim().toUpperCase();
      }
    } catch (error) {}

    if (lcFuEmpr.trim().length == 0) {
      deletaRecursoApontadoCAR(lmDlApnt, i + 1);

      return;
    }

    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdApnt", pa_tipo: "Int", pa_valo: lnIdApnt },
      { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
      { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: lcFuEmpr },
      {
        pa_nome: "lcIdUser",
        pa_tipo: "VarChar",
        pa_valo: goCdUser.id_user.trim().toUpperCase(),
      },
    ];

    lcWkProc = "deletaFuncionarioApontamentoRdo";
  }

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  for (var j = 0; j < gmWkRsqlCAR.length; j++) {
    llApExcl = false;

    for (var k = 0; k < lmDlApnt.length; k++) {
      if (
        parseInt(gmWkRsqlCAR[j].id_apnt) == parseInt(lmDlApnt[k].id_apnt) &&
        parseInt(gmWkRsqlCAR[j].id_matr) == parseInt(lmDlApnt[k].id_matr) &&
        gmWkRsqlCAR[j].fu_empr.trim().toUpperCase() ==
          lmDlApnt[k].fu_empr.trim().toUpperCase()
      ) {
        llApExcl = true;

        break;
      }
    }

    if (!llApExcl) {
      lmApNexc.push(gmWkRsqlCAR[j]);
    }
  }

  for (var j = 0; j < lmApNexc.length; j++) {
    if (parseInt(lmApNexc[j].id_apnt) == lnIdApnt) {
      lnCtApnt++;
    }
  }

  if (lnCtApnt == 0) {
    deletaFotosCAR(lnIdApnt);

    for (var j = 0; j < gmApFotoCAR.length; j++) {
      if (parseInt(gmApFotoCAR[j].id_apnt) == lnIdApnt) {
        gmApFotoCAR.splice(j, 1);
      }
    }
  }

  if (ldDtHjhr < ldDtMdia) {
    if (stringDataParaObjetoData(jsonDate(lmDlApnt[i].ap_data)) < ldDtOnzh) {
      enviaEmailCAR(lmDlApnt[i], lcWkIsql, lcWkProc, lmDlApnt, i);

      return;
    }
  } else {
    if (stringDataParaObjetoData(jsonDate(lmDlApnt[i].ap_data)) < ldDtHjzh) {
      enviaEmailCAR(lmDlApnt[i], lcWkIsql, lcWkProc, lmDlApnt, i);

      return;
    }
  }

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=" +
      lcWkProc,
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ap_erro.trim().length > 0) {
          notificacao(lmWkRsql[0].ap_erro.trim(), "alerta");
        }
      } catch (error) {}

      deletaRecursoApontadoCAR(lmDlApnt, i + 1);
    },
    error: function (jqXHR, textStatus, err) {
      deletaRecursoApontadoCAR(lmDlApnt, i + 1);
    },
  });
}

function consultaApontamentoFinalizadoCAR(lmDlApnt, i) {
  var ldDtHoje = new Date();
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcDrData = "";
  var lmWkIsql = [];

  ldDtHoje.setHours(0, 0, 0, 0);

  if (lmDlApnt.length <= i) {
    app.dialog.close();

    app.dialog
      .create({
        title: "alerta",
        text: "deseja excluir apontamentos selecionados ?",
        buttons: [
          {
            text: "cancelar",
            color: corBotaoAlerta(),
          },
          {
            text: "ok",
            color: corBotaoAlerta(),
            onClick: function () {
              app.dialog.preloader("excluindo apontamentos...");

              deletaRecursoApontadoCAR(lmDlApnt, 0);
            },
          },
        ],
      })
      .open();

    return;
  }

  try {
    if (parseInt(lmDlApnt[i].id_cadt) > 0) {
      lnIdCadt = parseInt(lmDlApnt[i].id_cadt);
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    consultaApontamentoFinalizadoCAR(lmDlApnt, i + 1);

    return;
  }

  if (jsonDate(lmDlApnt[i].ap_data).length > 0) {
    lcDrData = objetoDataParaStringSqlData(
      stringDataParaObjetoData(jsonDate(lmDlApnt[i].ap_data))
    );
  }

  if (lcDrData.trim().length == 0) {
    consultaApontamentoFinalizadoCAR(lmDlApnt, i + 1);

    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
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
      "&lcWkProc=consultaApontamentoFinalizado",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (parseInt(lmWkRsql[0].ap_fnlz) > 0) {
          app.dialog.close();

          if (
            goCdUser.id_user.trim().toUpperCase() != "CHAMONE" &&
            goCdUser.id_user.trim().toUpperCase() != "CHAMONI" &&
            goCdUser.id_user.trim().toUpperCase() != "DAVI.CASTRO" &&
            goCdUser.id_user.trim().toUpperCase() != "GUSTAVO" &&
            goCdUser.id_user.trim().toUpperCase() != "JORGE GENEROSO" &&
            goCdUser.id_user.trim().toUpperCase() != "LORENA" &&
            goCdUser.id_user.trim().toUpperCase() != "MARIA.EDUARDA" &&
            goCdUser.id_user.trim().toUpperCase() != "KAILANE" &&
            goCdUser.id_user.trim().toUpperCase() != "QUESIA" &&
            goCdUser.id_user.trim().toUpperCase() != "MARCELO" &&
            goCdUser.id_user.trim().toUpperCase() != "VINICIUS.F" &&
            goCdUser.id_user.trim().toUpperCase() != "GUILHERME.FERRAREZI" &&
            goCdUser.id_user.trim().toUpperCase() != "PRISCILLA.MIRELI" &&
            goCdUser.id_user.trim().toUpperCase() != "VICTORIA.ALVES" &&
            goCdUser.id_user.trim().toUpperCase() != "MARCOS.PORTELLA" &&
            goCdUser.id_user.trim().toUpperCase() != "CARLA" &&
            goCdUser.id_user.trim().toUpperCase() != "PAULO" &&
            goCdUser.id_user.trim().toUpperCase() != "JAIRO.J" &&
            goCdUser.id_user.trim().toUpperCase() != "RICHARD" &&
            goCdUser.id_user.trim().toUpperCase() != "VICTOR.GUSTAVO" &&
            goCdUser.id_user.trim().toUpperCase() != "VICTORIA.BEATRIZ" &&
            goCdUser.id_user.trim().toUpperCase() != "GABRIEL.EVANGELISTA" &&
            goCdUser.id_user.trim().toUpperCase() != "TALITA"
          ) {
            alerta(
              "apontamento de " +
                lmDlApnt[i].fu_nome.trim().toUpperCase() +
                " já finalizado, não é possível excluir, entre em contato com a adminsitração",
              "alerta"
            );

            return;
          }
        }
      } catch (loApErro) {}

      consultaApontamentoFinalizadoCAR(lmDlApnt, i + 1);
    },
    error: function (jqXHR, textStatus, err) {
      consultaApontamentoFinalizadoCAR(lmDlApnt, i + 1);
    },
  });
}

function checkCAR(lnAlIndx, llCbTodo) {
  var loDvExcl = document.getElementById("divExclCAR");
  var loCbTodo = document.getElementById("chkTodoCAR");
  var loCbRcso = document.getElementById(
    "chkRcs" + lnAlIndx.toString() + "CAR"
  );
  var loLiRcso = document.getElementById(
    "lliRcs" + lnAlIndx.toString() + "CAR"
  );
  var lnRcChck = 0,
    lnCtChck = 0,
    lnCtRsql = 0;

  if (!llCbTodo) {
    app.accordion.toggle(loLiRcso);
  }

  if (loCbRcso.checked) {
    loCbRcso.checked = false;
    loCbTodo.checked = false;
  } else {
    loCbRcso.checked = true;

    lnRcChck = 1;
  }

  gmWkRsqlCAR[lnAlIndx].rc_chck = lnRcChck;

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    if (parseInt(gmWkRsqlCAR[i].rc_chck) > 0) {
      lnCtChck++;
    }
  }

  if (lnCtChck > 0) {
    loDvExcl.style.display = "";
  } else {
    loDvExcl.style.display = "none";
  }

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    for (var j = 0; j < gmOsLctoCAR.length; j++) {
      if (
        parseInt(gmOsLctoCAR[j].id_ords) == parseInt(gmWkRsqlCAR[i].id_ords) &&
        parseInt(gmOsLctoCAR[j].os_chck) > 0
      ) {
        lnCtRsql++;
      }
    }
  }

  if (lnCtChck == lnCtRsql) {
    loCbTodo.checked = true;
  }
}

function montaFotosCAR(lcWkRsql, lnIdIndx) {
  var loWkRsql = JSON.parse(unescape(lcWkRsql));
  var loImFoto = document.getElementById("img" + lnIdIndx.toString() + "CAR");
  var lmApFoto = [];

  for (var i = 0; i < gmApFotoCAR.length; i++) {
    if (parseInt(gmApFotoCAR[i].id_apnt) == parseInt(loWkRsql.id_apnt)) {
      lmApFoto.push({
        url:
          goCdUser.ws_wiis.trim().toLowerCase() +
          "fotos/apontamentos/" +
          gmApFotoCAR[i].id_apnt.toString() +
          "/" +
          gmApFotoCAR[i].ex_sdir,
        caption: "apontamento " + gmApFotoCAR[i].id_apnt.toString(),
      });
    }
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
        },
      },
    })
    .open();
}

function montaRecursosApontadosCAR() {
  var loDvRdob = document.getElementById("divRdobCAR");
  var loDvLoad = document.getElementById("divLoadCAR");
  var lcWkRsql = "",
    lcApSitu = "",
    lcOsTipo = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcApFoto = "",
    lcScFoto = "",
    lcSrDisp = "",
    lcRcChck = "";
  var lnFnList = 0,
    lnIdOrds = 0;
  var lmWkRsql = [];
  var loWkRsql = {};

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    lnIdOrds = parseInt(gmWkRsqlCAR[i].id_ords);

    for (var j = 0; j < gmOsLctoCAR.length; j++) {
      if (
        parseInt(gmOsLctoCAR[j].id_ords) == lnIdOrds &&
        parseInt(gmOsLctoCAR[j].os_chck) > 0
      ) {
        loWkRsql = gmWkRsqlCAR[i];

        loWkRsql["al_indx"] = i;

        lmWkRsql.push(loWkRsql);
      }
    }
  }

  if (gnInListCAR + 20 >= lmWkRsql.length) {
    loDvRdob.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = lmWkRsql.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCAR + 20;
  }

  try {
    for (var i = gnInListCAR; i < lnFnList; i++) {
      lcScFoto = "";

      if (parseInt(lmWkRsql[i].sr_disp) > 0) {
        if (parseInt(lmWkRsql[i].sr_trab) > 0) {
          //prettier-ignore
          lcApSitu = 
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>atividade</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].at_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>dias restantes</div>" +
                      "<div class='item-after'>" + brDecimal(lmWkRsql[i].ap_dres) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>";
        } else {
          if (parseInt(lmWkRsql[i].sr_just) > 0) {
            //prettier-ignore
            lcApSitu = 
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>justificativa</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].ju_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li class='item-content item-input'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title item-label'>observação</div>" +
                    "<div class='item-input-wrap'>" +
                      "<textarea readonly>" + lmWkRsql[i].ap_obju.trim().toUpperCase() + "</textarea>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>responsabilidade</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].rj_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>";
          } else {
            //prettier-ignore
            lcApSitu = 
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>responsabilidade</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].rj_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>";
          }
        }

        if (parseInt(lmWkRsql[i].os_tipo) == 1) {
          //prettier-ignore
          lcOsTipo = 
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>situação</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].sr_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
          lcApSitu;
        } else {
          //prettier-ignore
          lcOsTipo = 
                "<li class='item-content item-input'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title item-label'>descrição das atividades</div>" +
                    "<div class='item-input-wrap'>" +
                      "<textarea readonly>" + lmWkRsql[i].ap_datv.trim().toUpperCase() + "</textarea>" +
                    "</div>" +
                  "</div>" +
                "</li>";
        }

        if (
          pad(lmWkRsql[i].ap_hent.toFixed(2), 5).replace(".", ":") == "00:00"
        ) {
          lcApHent = "";
        } else {
          lcApHent = pad(lmWkRsql[i].ap_hent.toFixed(2), 5).replace(".", ":");
        }

        if (
          pad(lmWkRsql[i].ap_hiin.toFixed(2), 5).replace(".", ":") == "00:00"
        ) {
          lcApHiin = "";
        } else {
          lcApHiin = pad(lmWkRsql[i].ap_hiin.toFixed(2), 5).replace(".", ":");
        }

        if (
          pad(lmWkRsql[i].ap_htin.toFixed(2), 5).replace(".", ":") == "00:00"
        ) {
          lcApHtin = "";
        } else {
          lcApHtin = pad(lmWkRsql[i].ap_htin.toFixed(2), 5).replace(".", ":");
        }

        if (
          pad(lmWkRsql[i].ap_hter.toFixed(2), 5).replace(".", ":") == "00:00"
        ) {
          lcApHter = "";
        } else {
          lcApHter = pad(lmWkRsql[i].ap_hter.toFixed(2), 5).replace(".", ":");
        }

        //prettier-ignore
        lcSrDisp = 
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>data</div>" +
                        "<div class='item-after'>" + jsonDate(lmWkRsql[i].ap_data) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>entrada</div>" +
                      "<div class='item-after'>" + lcApHent + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>saída</div>" +
                      "<div class='item-after'>" + lcApHiin + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>entrada</div>" +
                      "<div class='item-after'>" + lcApHtin + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>saída</div>" +
                      "<div class='item-after'>" + lcApHter + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>total</div>" +
                      "<div class='item-after'>" + calculaHorasCAR(lmWkRsql[i], false) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>hora extra</div>" +
                      "<div class='item-after'>" + calculaHorasCAR(lmWkRsql[i], true) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                lcOsTipo +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>obra</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>proposta</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].os_nume.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li class='item-content item-input'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title item-label'>descrição da proposta</div>" +
                    "<div class='item-input-wrap'>" +
                      "<textarea readonly>" + lmWkRsql[i].os_desc.trim().toUpperCase() + "</textarea>" +
                    "</div>" +
                  "</div>" +
                "</li>";
      } else {
        //prettier-ignore
        lcSrDisp = 
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>status do recurso</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].ap_strc.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li class='item-content item-input'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title item-label'>observação do status do recurso</div>" +
                    "<div class='item-input-wrap'>" +
                      "<textarea readonly>" + lmWkRsql[i].ap_obsr.trim().toUpperCase() + "</textarea>" +
                    "</div>" +
                  "</div>" +
                "</li>";
      }

      for (var j = 0; j < gmApFotoCAR.length; j++) {
        if (parseInt(gmApFotoCAR[j].id_apnt) == parseInt(lmWkRsql[i].id_apnt)) {
          lcScFoto =
            goCdUser.ws_wiis.trim().toLowerCase() +
            "fotos/apontamentos/" +
            gmApFotoCAR[j].id_apnt.toString() +
            "/" +
            gmApFotoCAR[j].ex_sdir.trim();

          break;
        }
      }

      if (lcScFoto.trim().length > 0) {
        //prettier-ignore
        lcApFoto = 
                "<div class='card'>" +
                  "<div class='card-header'>foto</div>" +
                  "<div class='card-content card-content-padding' style='text-align: center;'>" +
                    "<a href='#' onclick='montaFotosCAR(\"" + escape(JSON.stringify(lmWkRsql[i])) + "\", " + i.toString() + ");'>" +
                      "<img id='img" + i.toString() + "CAR' style='width: 100px' onerror='this.src=\"img/semImagem.png\"' src='" + lcScFoto + "' />" +
                    "</a>" +
                  "</div>" +
                "</div>";
      } else {
        lcApFoto = "";
      }

      if (parseInt(lmWkRsql[i].rc_chck) > 0) {
        lcRcChck = " checked";
      } else {
        lcRcChck = "";
      }

      //prettier-ignore
      lcWkRsql += 
        "<li id='lliRcs" + lmWkRsql[i].al_indx.toString().toString() + "CAR' class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            "<div class='item-media' onclick='checkCAR(" + lmWkRsql[i].al_indx.toString() + ", false);'>" + 
              "<label class='checkbox'> " +
                "<input id='chkRcs" + lmWkRsql[i].al_indx.toString().toString() + "CAR' type='checkbox'" + lcRcChck + " /> " +
                "<i class='icon-checkbox'></i> " +
              "</label>" +
            "</div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>tipo</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>recurso</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>função</div>" +
                      "<div class='item-after'>" + lmWkRsql[i].fu_func.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                lcSrDisp +
              "</ul>" +
            "</div>" +
            lcApFoto +
          "</div>" +
        "</li>";
    }
  } catch (error) {}

  gnInListCAR = i;

  $("#uulApntCAR").append(lcWkRsql);
}

function pesquisaComentariosOrdensServicoCAR() {
  var loDvRdob = document.getElementById("divRdobCAR");
  var loDtDtde = document.getElementById("datDtdeCAR");
  var loDtDtat = document.getElementById("datDtatCAR");
  var loSlPesq = document.getElementById("sltPesqCAR");
  var loSlClie = document.getElementById("sltClieCAR");
  var loDvTodo = document.getElementById("divTodoCAR");
  var lcWkIsql = "",
    lcIdOrds = "";
  var lmWkIsql = [],
    lmIdOrds = [];
  var lnIdClie = null;
  var lnCtApnt = 0;

  if (loSlPesq.value.toString().trim().toUpperCase() == "O") {
    try {
      if (parseInt(loSlClie.value.toString().split("/")[1].trim()) > 0) {
        lnIdClie = parseInt(loSlClie.value.toString().split("/")[0].trim());
      }
    } catch (error) {}

    if (lnIdClie == 0) {
      return;
    }
  }

  try {
    lmIdOrds = app.smartSelect.get(".clsOrdsCAR").getValue();
  } catch (error) {}

  if (lmIdOrds.length > 0) {
    for (var i = 0; i < lmIdOrds.length; i++) {
      lcIdOrds += lmIdOrds[i].trim().toUpperCase() + "|";
    }

    lcIdOrds = lcIdOrds.slice(0, -1);
  } else {
    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldCmDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)), },
    { pa_nome: "ldCmDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)), },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaComentariosOrdensServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmOsCmntCAR = lmWkRsql;
        }
      } catch (loApErro) {}

      for (var i = 0; i < gmWkRsqlCAR.length; i++) {
        for (var j = 0; j < gmOsLctoCAR.length; j++) {
          if (
            parseInt(gmOsLctoCAR[j].id_ords) ==
              parseInt(gmWkRsqlCAR[i].id_ords) &&
            parseInt(gmOsLctoCAR[j].os_chck) > 0
          ) {
            lnCtApnt++;
          }
        }
      }

      if (lnCtApnt > 0) {
        loDvTodo.style.display = "";
      }

      montaRecursosApontadosCAR();

      loDvRdob.onscroll = function () {
        if (
          loDvRdob.scrollHeight - loDvRdob.scrollTop - loDvRdob.clientHeight <
          1
        ) {
          montaRecursosApontadosCAR();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      montaRecursosApontadosCAR();

      loDvRdob.onscroll = function () {
        if (
          loDvRdob.scrollHeight - loDvRdob.scrollTop - loDvRdob.clientHeight <
          1
        ) {
          montaRecursosApontadosCAR();
        }
      };
    },
  });
}

function pesquisaFotosCAR(i) {
  var lcWkIsql = "";
  var lmWkIsql = [],
    lmAxRsql = [];
  var lnIdApnt = 0;
  var llIdApnt = false;

  if (i == 0) {
    app.dialog.preloader("carregando fotos...");
  }

  for (var j = 0; j < gmWkRsqlCAR.length; j++) {
    for (var k = 0; k < gmOsLctoCAR.length; k++) {
      if (
        parseInt(gmOsLctoCAR[k].id_ords) == parseInt(gmWkRsqlCAR[j].id_ords) &&
        parseInt(gmOsLctoCAR[k].os_chck) > 0
      ) {
        lmAxRsql.push(gmWkRsqlCAR[j]);
      }
    }
  }

  if (i >= lmAxRsql.length) {
    app.dialog.close();

    pesquisaComentariosOrdensServicoCAR();

    return;
  }

  lnIdApnt = parseInt(lmAxRsql[i].id_apnt);

  if (i > 0) {
    for (var j = 0; j < gmApFotoCAR.length; j++) {
      if (lnIdApnt == parseInt(gmApFotoCAR[j].id_apnt)) {
        llIdApnt = true;

        break;
      }
    }

    if (llIdApnt) {
      pesquisaFotosCAR(i + 1);

      return;
    }
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcPtFoto", pa_tipo: "VarChar", pa_valo: "apontamentos/" + lnIdApnt.toString() }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFotos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        for (var j = 0; j < lmWkRsql.length; j++) {
          gmApFotoCAR.push({
            id_apnt: parseInt(lmAxRsql[i].id_apnt),
            ap_data: stringDataParaObjetoData(jsonDate(lmAxRsql[i].ap_data)),
            id_clie: parseInt(lmAxRsql[i].id_clie),
            id_ords: parseInt(lmAxRsql[i].id_ords),
            ex_sdir: lmWkRsql[j].ex_sdir.trim(),
          });
        }
      } catch (loApErro) {}

      pesquisaFotosCAR(i + 1);
    },
    error: function (jqXHR, textStatus, err) {
      pesquisaFotosCAR(i + 1);
    },
  });
}

function pesquisaRecursosApontadosRelatorioDiarioObraCAR() {
  var loDtDtde = document.getElementById("datDtdeCAR");
  var loDtDtat = document.getElementById("datDtatCAR");
  var loSlPesq = document.getElementById("sltPesqCAR");
  var loSlClie = document.getElementById("sltClieCAR");
  var lcWkIsql = "",
    lcIdOrds = "",
    lcIdRcso = null;
  var lnIdClie = null;
  var lmWkIsql = [],
    lmIdOrds = [],
    lmIdRcso = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loSlPesq.value.toString().trim().toUpperCase() == "R") {
    try {
      lmIdRcso = app.smartSelect.get(".clsRcsoCAR").getValue();
    } catch (error) {}

    if (lmIdRcso.length > 0) {
      lcIdRcso = "";

      for (var i = 0; i < lmIdRcso.length; i++) {
        lcIdRcso += lmIdRcso[i].trim().toUpperCase() + "|";
      }

      lcIdRcso = lcIdRcso.slice(0, -1);
    } else {
      return;
    }
  } else {
    try {
      if (parseInt(loSlClie.value.toString().split("/")[0].trim()) > 0) {
        lnIdClie = parseInt(loSlClie.value.toString().split("/")[0].trim());
      }
    } catch (error) {}

    if (lnIdClie == null) {
      return;
    }
  }

  try {
    lmIdOrds = app.smartSelect.get(".clsOrdsCAR").getValue();
  } catch (error) {}

  if (lmIdOrds.length > 0) {
    for (var i = 0; i < lmIdOrds.length; i++) {
      lcIdOrds += lmIdOrds[i].trim().toUpperCase() + "|";
    }

    lcIdOrds = lcIdOrds.slice(0, -1);
  } else {
    return;
  }

  //alteração, para pegar todas as propostas, para calculo correto das horas extras
  lcIdOrds = "";

  for (var i = 0; i < gmOsLctoCAR.length; i++) {
    // if (parseInt(gmOsLctoCAR[i].os_tipo) != 1) {
    lcIdOrds += gmOsLctoCAR[i].id_ords.toString() + "|";
    // }
  }

  lcIdOrds = lcIdOrds.slice(0, -1);

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)), },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)), },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcIdRcso", pa_tipo: "VarChar", pa_valo: lcIdRcso },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCAR();

  app.dialog.preloader("carregando apontamentos...");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursosApontadosRelatorioDiarioObra",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      gmWkRsqlCAR = lmWkRsql;

      for (var i = 0; i < gmWkRsqlCAR.length; i++) {
        gmWkRsqlCAR[i]["rc_chck"] = 0;
      }

      for (var i = 0; i < gmOsLctoCAR.length; i++) {
        gmOsLctoCAR[i].os_chck = 0;
      }

      for (var i = 0; i < gmOsLctoCAR.length; i++) {
        for (var j = 0; j < lmIdOrds.length; j++) {
          if (parseInt(gmOsLctoCAR[i].id_ords) == parseInt(lmIdOrds[j])) {
            gmOsLctoCAR[i].os_chck = 1;
          }
        }
      }

      pesquisaFotosCAR(0);
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function pesquisaJornadaOrdensServicoCAR() {
  var loSlPesq = document.getElementById("sltPesqCAR");
  var loSlClie = document.getElementById("sltClieCAR");
  var lcWkIsql = "",
    lcIdOrds = "";
  var lmWkIsql = [],
    lmIdOrds = [],
    lmIdMatr = [];
  var lnIdClie = 0;

  if (loSlPesq.value.toString().trim().toUpperCase() == "R") {
    try {
      lmIdMatr = app.smartSelect.get(".clsRcsoCAR").getValue();
    } catch (error) {}

    if (lmIdMatr.length == 0) {
      alerta("recurso inválido", "alerta");

      return;
    }
  } else {
    try {
      if (parseInt(loSlClie.value.toString().split("/")[1].trim()) > 0) {
        lnIdClie = parseInt(loSlClie.value.toString().split("/")[0].trim());
      }
    } catch (error) {}

    if (lnIdClie == 0) {
      alerta("obra inválida", "alerta");

      return;
    }
  }

  try {
    lmIdOrds = app.smartSelect.get(".clsOrdsCAR").getValue();
  } catch (error) {}

  if (lmIdOrds.length > 0) {
    for (var i = 0; i < lmIdOrds.length; i++) {
      lcIdOrds += lmIdOrds[i].trim().toUpperCase() + "|";
    }

    lcIdOrds = lcIdOrds.slice(0, -1);
  } else {
    alerta("selecione uma proposta ou a opção 'sem proposta'", "alerta");

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  gmOsJornCAR = [];

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaJornadaOrdensServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmOsJornCAR = lmWkRsql;

      pesquisaRecursosApontadosRelatorioDiarioObraCAR();
    },
    error: function (jqXHR, textStatus, err) {
      pesquisaRecursosApontadosRelatorioDiarioObraCAR();
    },
  });
}

function pesquisaOrdensServicoDataApontamentoRdoCAR() {
  var loDtDtde = document.getElementById("datDtdeCAR");
  var loDtDtat = document.getElementById("datDtatCAR");
  var loSlPesq = document.getElementById("sltPesqCAR");
  var loSlClie = document.getElementById("sltClieCAR");
  var loLiOrds = document.getElementById("lliOrdsCAR");
  var loOgOrds = {};
  var lnIdCadt = null;
  var lcWkIsql = "",
    lcWkRsql = "",
    lcIdRcso = null;
  var lmWkIsql = [],
    lmIdRcso = [];

  limpaCamposOrdemServicoCAR();

  if (loSlPesq.value.toString().trim().toUpperCase() == "R") {
    try {
      lmIdRcso = app.smartSelect.get(".clsRcsoCAR").getValue();
    } catch (error) {}

    if (lmIdRcso.length > 0) {
      lcIdRcso = "";

      for (var i = 0; i < lmIdRcso.length; i++) {
        lcIdRcso += lmIdRcso[i].trim().toUpperCase() + "|";
      }

      lcIdRcso = lcIdRcso.slice(0, -1);
    } else {
      return;
    }
  } else {
    try {
      if (parseInt(loSlClie.value.toString().split("/")[1].trim()) > 0) {
        lnIdCadt = parseInt(loSlClie.value.toString().split("/")[1].trim());
      }
    } catch (error) {}

    if (lnIdCadt == null) {
      return;
    }
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)), },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)), },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lcIdRcso", pa_tipo: "VarChar", pa_valo: lcIdRcso },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaOrdensServicoDataApontamentoRdo",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loOgOrds = document.getElementById("ogrOrdsCAR");

      gmOsLctoCAR = lmWkRsql;

      try {
        if (gmOsLctoCAR.length > 0) {
          loLiOrds.style.display = "";

          for (var i = 0; i < gmOsLctoCAR.length; i++) {
            gmOsLctoCAR[i]["os_chck"] = 0;

            if (parseInt(gmOsLctoCAR[i].os_tipo) != 1) {
              //prettier-ignore
              lcWkRsql += "<option value='" + gmOsLctoCAR[i].id_ords.toString() + "'>" + gmOsLctoCAR[i].os_nume.trim().toUpperCase() + " - " + gmOsLctoCAR[i].os_desc.trim().toUpperCase() + "</option>";
            }
          }
        }
      } catch (loApErro) {}

      loOgOrds.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function marcaTodosCAR() {
  var loDvExcl = document.getElementById("divExclCAR");
  var loCbTodo = document.getElementById("chkTodoCAR");
  var loCbRcso = {},
    loWkRsql = {};
  var lnCtChck = 0;
  var lmWkRsql = [];

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    for (var j = 0; j < gmOsLctoCAR.length; j++) {
      if (
        parseInt(gmOsLctoCAR[j].id_ords) == parseInt(gmWkRsqlCAR[i].id_ords) &&
        parseInt(gmOsLctoCAR[j].os_chck) > 0
      ) {
        loWkRsql = gmWkRsqlCAR[i];

        loWkRsql["al_indx"] = i;

        lmWkRsql.push(loWkRsql);
      }
    }
  }

  for (var i = 0; i < lmWkRsql.length; i++) {
    loCbRcso = document.getElementById(
      "chkRcs" + lmWkRsql[i].al_indx.toString() + "CAR"
    );

    if (loCbRcso) {
      if (loCbTodo.checked) {
        if (!loCbRcso.checked) {
          checkCAR(parseInt(lmWkRsql[i].al_indx), true);
        }
      } else {
        if (loCbRcso.checked) {
          checkCAR(parseInt(lmWkRsql[i].al_indx), true);
        }
      }
    }

    if (loCbTodo.checked) {
      gmWkRsqlCAR[parseInt(lmWkRsql[i].al_indx)].rc_chck = 1;
    } else {
      gmWkRsqlCAR[parseInt(lmWkRsql[i].al_indx)].rc_chck = 0;
    }
  }

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    for (var j = 0; j < gmOsLctoCAR.length; j++) {
      if (
        parseInt(gmOsLctoCAR[j].id_ords) == parseInt(gmWkRsqlCAR[i].id_ords) &&
        parseInt(gmOsLctoCAR[j].os_chck) > 0
      ) {
        if (parseInt(gmWkRsqlCAR[i].rc_chck) > 0) {
          lnCtChck++;
        }
      }
    }
  }

  if (lnCtChck > 0) {
    loDvExcl.style.display = "";
  } else {
    loDvExcl.style.display = "none";
  }
}

function alteraPesquisaCAR() {
  var loSlPesq = document.getElementById("sltPesqCAR");
  var loLiClie = document.getElementById("lliClieCAR");
  var loLiRcso = document.getElementById("lliRcsoCAR");

  limpaCamposOrdemServicoCAR();

  if (loSlPesq.value.toString().trim().toUpperCase() == "R") {
    pesquisaRecursosDataApontamentoCAR();

    loLiClie.style.display = "none";
    loLiRcso.style.display = "";
  } else {
    pesquisaObrasDataApontamentoCAR();

    loLiClie.style.display = "";
    loLiRcso.style.display = "none";
  }
}

function excluiApontamentosCAR() {
  var lmDlApnt = [];

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    for (var j = 0; j < gmOsLctoCAR.length; j++) {
      if (
        parseInt(gmOsLctoCAR[j].id_ords) == parseInt(gmWkRsqlCAR[i].id_ords) &&
        parseInt(gmOsLctoCAR[j].os_chck) > 0
      ) {
        if (parseInt(gmWkRsqlCAR[i].rc_chck) > 0) {
          lmDlApnt.push(gmWkRsqlCAR[i]);
        }
      }
    }
  }

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
    (goCdUser.id_user.trim().toUpperCase() == "QUESIA" &&
      goCdUser.id_user.trim().toUpperCase() != "MARCELO")
  ) {
    app.dialog
      .create({
        title: "alerta",
        text: "deseja excluir apontamentos selecionados ?",
        buttons: [
          {
            text: "cancelar",
            color: corBotaoAlerta(),
          },
          {
            text: "ok",
            color: corBotaoAlerta(),
            onClick: function () {
              app.dialog.preloader("excluindo apontamentos...");

              deletaRecursoApontadoCAR(lmDlApnt, 0);
            },
          },
        ],
      })
      .open();
  } else {
    app.dialog.preloader("verificando apontamentos...");

    consultaApontamentoFinalizadoCAR(lmDlApnt, 0);
  }
}

function excelCAR() {
  var ldDtHoje = new Date();
  var lcApSitu = "",
    lcOsTipo = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcHdTipo = "",
    lcApHtml = "",
    lcApRcso = "",
    lcShSbti = "rdo da real",
    lcFlName = "",
    lcCmDesc = "",
    lcRsQtde = "",
    lcSrDeno = "",
    lcApStrc = "",
    lcSrTabl = "";
  var lmIdOrds = [],
    lmIdClie = [],
    lmApRcso = [],
    lmHrModi = [],
    lmHrMoin = [],
    lmHrEqpm = [],
    lmApHora = [],
    lmSrHora = [],
    lmSrHrmn = [],
    lmSrHrex = [],
    lmWkRsql = [];
  var lnCtRsq1 = 0,
    lnCtRsq1 = 0,
    lnQtModi = 0,
    lnQtMoin = 0,
    lnQtEqpm = 0;

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    for (var j = 0; j < gmOsLctoCAR.length; j++) {
      if (
        parseInt(gmOsLctoCAR[j].id_ords) == parseInt(gmWkRsqlCAR[i].id_ords) &&
        parseInt(gmOsLctoCAR[j].os_chck) > 0
      ) {
        lmWkRsql.push(gmWkRsqlCAR[i]);
      }
    }
  }

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;

    for (var j = 0; j < lmIdClie.length; j++) {
      if (
        parseInt(lmWkRsql[i].id_clie) != parseInt(lmIdClie[j].id_clie) ||
        jsonDate(lmWkRsql[i].ap_data) !=
          objetoDataParaStringData(lmIdClie[j].ap_data)
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmIdClie.length) {
      lmIdClie.push({
        id_clie: parseInt(lmWkRsql[i].id_clie),
        cl_fant: lmWkRsql[i].cl_fant.trim().toUpperCase(),
        ap_data: stringDataParaObjetoData(jsonDate(lmWkRsql[i].ap_data)),
      });
    }
  }

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;

    for (var j = 0; j < lmIdOrds.length; j++) {
      if (
        parseInt(lmWkRsql[i].id_clie) != parseInt(lmIdOrds[j].id_clie) ||
        jsonDate(lmWkRsql[i].ap_data) !=
          objetoDataParaStringData(lmIdOrds[j].ap_data) ||
        parseInt(lmWkRsql[i].id_ords) != parseInt(lmIdOrds[j].id_ords)
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmIdOrds.length) {
      lmIdOrds.push({
        id_ords: parseInt(lmWkRsql[i].id_ords),
        id_clie: parseInt(lmWkRsql[i].id_clie),
        ap_data: stringDataParaObjetoData(jsonDate(lmWkRsql[i].ap_data)),
        os_nume: lmWkRsql[i].os_nume.trim().toUpperCase(),
      });
    }
  }

  if (lmIdOrds.length == 0) {
    alerta("relatório sem conteúdo", "alerta");

    return;
  }

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;

    if (lmWkRsql[i].cb_tmdo.trim().toUpperCase() == "MOD") {
      if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
        lmHrModi.push({
          hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
          minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
        });
      }
    }

    if (lmWkRsql[i].cb_tmdo.trim().toUpperCase() == "MOI") {
      if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
        lmHrMoin.push({
          hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
          minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
        });
      }
    }

    if (lmWkRsql[i].cb_tmdo.trim().toUpperCase() == "EQP") {
      if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
        lmHrEqpm.push({
          hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
          minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
        });
      }
    }

    if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
      lmApHora.push({
        hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
        minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
      });
    }

    for (var j = 0; j < lmApRcso.length; j++) {
      if (
        parseInt(lmWkRsql[i].id_matr) != parseInt(lmApRcso[j].id_matr) ||
        lmWkRsql[i].fu_empr.trim().toUpperCase() !=
          lmApRcso[j].fu_empr.trim().toUpperCase()
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmApRcso.length) {
      lmApRcso.push({
        fu_empr: lmWkRsql[i].fu_empr.trim().toUpperCase(),
        id_matr: parseInt(lmWkRsql[i].id_matr),
        cb_tmdo: lmWkRsql[i].cb_tmdo.trim().toUpperCase(),
      });
    }
  }

  for (var i = 0; i < lmApRcso.length; i++) {
    if (lmApRcso[i].cb_tmdo.trim().toUpperCase() == "MOD") {
      lnQtModi++;
    }

    if (lmApRcso[i].cb_tmdo.trim().toUpperCase() == "MOI") {
      lnQtMoin++;
    }

    if (lmApRcso[i].cb_tmdo.trim().toUpperCase() == "EQP") {
      lnQtEqpm++;
    }
  }

  //prettier-ignore
  lcRsQtde = 
    "<tr>" +
      "<td colspan='4'>" +
        "tipo" +
      "</td>" +
      "<td colspan='4'>" +
        "qtde" +
      "</td>" +
      "<td colspan='6'>" +
        "horas" +
      "</td>" +
    "</tr>" +
    "<tr>" +
      "<td colspan='4'>" +
        "MOD" +
      "</td>" +
      "<td colspan='4'>" +
        lnQtModi.toString() +
      "</td>" +
      "<td colspan='6'>" +
        "_" + addTimes(lmHrModi) +
      "</td>" +
    "</tr>" +
    "<tr>" +
      "<td colspan='4'>" +
        "MOI" +
      "</td>" +
      "<td colspan='4'>" +
        lnQtMoin.toString() +
      "</td>" +
      "<td colspan='6'>" +
        "_" + addTimes(lmHrMoin) +
      "</td>" +
    "</tr>" +
    "<tr>" +
      "<td colspan='4'>" +
        "EQP" +
      "</td>" +
      "<td colspan='4'>" +
        lnQtEqpm.toString() +
      "</td>" +
      "<td colspan='6'>" +
        "_" + addTimes(lmHrEqpm) +
      "</td>" +
    "</tr>" +
    "<tr>" +
      "<td colspan='4'>" +
        "TOTAL" +
      "</td>" +
      "<td colspan='4'>" +
        (lnQtModi + lnQtMoin + lnQtEqpm).toString() +
      "</td>" +
      "<td colspan='6'>" +
        "_" + addTimes(lmApHora) +
      "</td>" +
    "</tr>";

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;
    lcApStrc = "";
    lcSrDeno = "";
    lmSrHrmn = [];
    lmSrHrex = [];

    lcApStrc = lmWkRsql[i].ap_strc.trim().toUpperCase();
    lcSrDeno = lmWkRsql[i].sr_deno.trim().toUpperCase();

    for (var j = 0; j < lmSrHora.length; j++) {
      if (
        lmWkRsql[i].ap_strc.trim().toUpperCase() !=
          lmSrHora[j].ap_strc.trim().toUpperCase() ||
        lmWkRsql[i].sr_deno.trim().toUpperCase() !=
          lmSrHora[j].sr_deno.trim().toUpperCase()
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmSrHora.length) {
      for (var j = 0; j < lmWkRsql.length; j++) {
        if (
          lmWkRsql[j].ap_strc.trim().toUpperCase() == lcApStrc &&
          lmWkRsql[j].sr_deno.trim().toUpperCase() == lcSrDeno
        ) {
          if (calculaHorasCAR(lmWkRsql[j], false).trim().length > 0) {
            lmSrHrmn.push({
              hour: parseInt(calculaHorasCAR(lmWkRsql[j], false).split(":")[0]),
              minutes: parseInt(
                calculaHorasCAR(lmWkRsql[j], false).split(":")[1]
              ),
            });
          }

          if (calculaHorasCAR(lmWkRsql[j], true).trim().length > 0) {
            lmSrHrex.push({
              hour: parseInt(calculaHorasCAR(lmWkRsql[j], true).split(":")[0]),
              minutes: parseInt(
                calculaHorasCAR(lmWkRsql[j], true).split(":")[1]
              ),
            });
          }
        }
      }

      lmSrHora.push({
        ap_strc: lcApStrc,
        sr_deno: lcSrDeno,
        sr_hora: addTimes(lmSrHrmn),
        sr_hext: addTimes(lmSrHrex),
      });
    }
  }

  //prettier-ignore
  lcSrTabl = 
        "<tr>" +
          "<td colspan='6'>" +
            "status" +
          "</td>" +
          "<td colspan='6'>" +
            "situação" +
          "</td>" +
          "<td colspan='4'>" +
            "horas" +
          "</td>" +
          "<td colspan='4'>" +
            "extra" +
          "</td>" +
        "</tr>";

  for (var i = 0; i < lmSrHora.length; i++) {
    //prettier-ignore
    lcSrTabl += 
        "<tr>" +
          "<td colspan='6'>" +
            lmSrHora[i].ap_strc.trim().toUpperCase() +
          "</td>" +
          "<td colspan='6'>" +
            lmSrHora[i].sr_deno.trim().toUpperCase() +
          "</td>" +
          "<td colspan='4'>" +
            "_" + lmSrHora[i].sr_hora.trim().toUpperCase() +
          "</td>" +
          "<td colspan='4'>" +
            "_" + lmSrHora[i].sr_hext.trim().toUpperCase() +
          "</td>" +
        "</tr>";
  }

  //prettier-ignore
  lcApHtml =
          "<table>" +
            "<tr>" +
              "<td colspan='14'>RELATÓRIO DIÁRIO DE OBRA</td>" +
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            lcSrTabl +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            lcRsQtde +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>";

  for (var k = 0; k < lmIdClie.length; k++) {
    //prettier-ignore
    lcApHtml +=
            "<tr>" +
              "<td colspan='7'>" +
                "obra: " + lmIdClie[k].cl_fant.trim().toUpperCase() +
              "</td>" +
              "<td colspan='7'>" +
                "data: " + objetoDataParaStringData(lmIdClie[k].ap_data) +
              "</td>" +
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>";

    for (var j = 0; j < lmIdOrds.length; j++) {
      lcApRcso = "";
      lcCmDesc = "";

      if (
        parseInt(lmIdClie[k].id_clie) == parseInt(lmIdOrds[j].id_clie) &&
        objetoDataParaStringData(lmIdClie[k].ap_data) ==
          objetoDataParaStringData(lmIdOrds[j].ap_data)
      ) {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lcApSitu = "";
          lcOsTipo = "";
          lcApHent = "";
          lcApHiin = "";
          lcApHtin = "";
          lcApHter = "";

          if (
            parseInt(lmWkRsql[i].id_ords) == parseInt(lmIdOrds[j].id_ords) &&
            objetoDataParaStringData(lmIdOrds[j].ap_data) ==
              jsonDate(lmWkRsql[i].ap_data) &&
            parseInt(lmIdOrds[j].id_clie) == parseInt(lmWkRsql[i].id_clie)
          ) {
            if (parseInt(lmWkRsql[i].sr_disp) > 0) {
              if (parseInt(lmWkRsql[i].sr_trab) > 0) {
                //prettier-ignore
                lcApSitu =
              "<td>" + lmWkRsql[i].at_deno.trim().toUpperCase() + "</td>" +   
              "<td>" + brDecimal(lmWkRsql[i].ap_dres) + " dia(s)</span>" + "</td>" +   
              "<td></td>";
              } else {
                if (parseInt(lmWkRsql[i].sr_just) > 0) {
                  //prettier-ignore
                  lcApSitu =
                "<td>" + lmWkRsql[i].ju_deno.trim().toUpperCase() + "</td>" +
                "<td>" + lmWkRsql[i].rj_deno.trim().toUpperCase() + "</td>" +
                "<td>" + lmWkRsql[i].ap_obju.trim().toUpperCase() + "</td>";
                } else {
                  //prettier-ignore
                  lcApSitu =
                "<td></td>" +
                "<td>" + lmWkRsql[i].rj_deno.trim().toUpperCase() + "</td>" +
                "<td></td>";
                }
              }

              if (parseInt(lmWkRsql[i].os_tipo) == 1) {
                //prettier-ignore
                lcOsTipo = 
              "<td>" + lmWkRsql[i].sr_deno.trim().toUpperCase() + "</td>" +
              lcApSitu;
              } else {
                //prettier-ignore
                lcOsTipo = 
              "<td colspan='4'>" + lmWkRsql[i].ap_datv.trim().toUpperCase() + "</td>";
              }

              if (
                pad(lmWkRsql[i].ap_hent.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHent = "";
              } else {
                lcApHent = pad(lmWkRsql[i].ap_hent.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              if (
                pad(lmWkRsql[i].ap_hiin.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHiin = "";
              } else {
                lcApHiin = pad(lmWkRsql[i].ap_hiin.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              if (
                pad(lmWkRsql[i].ap_htin.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHtin = "";
              } else {
                lcApHtin = pad(lmWkRsql[i].ap_htin.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              if (
                pad(lmWkRsql[i].ap_hter.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHter = "";
              } else {
                lcApHter = pad(lmWkRsql[i].ap_hter.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              //prettier-ignore
              lcApRcso +=
            "<tr>" +
              "<td>" + lmWkRsql[i].id_apnt.toString() + "</td>" +
              "<td>" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "</td>" +
              "<td>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</td>" +
              "<td>" + lmWkRsql[i].fu_func.trim().toUpperCase() + "</td>" +
              "<td>_" + lcApHent + "</td>" +
              "<td>_" + lcApHiin + "</td>" +
              "<td>_" + lcApHtin + "</td>" +
              "<td>_" + lcApHter + "</td>" +
              "<td>_" + calculaHorasCAR(lmWkRsql[i], false) + "</td>" +
              "<td>_" + calculaHorasCAR(lmWkRsql[i], true) + "</td>" +
              lcOsTipo +
            "</tr>";
            } else {
              //prettier-ignore
              lcApRcso +=
            "<tr>" +
              "<td>" + lmWkRsql[i].id_apnt.toString() + "</td>" +
              "<td>" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "</td>" +
              "<td>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</td>" +
              "<td>" + lmWkRsql[i].fu_func.trim().toUpperCase() + "</td>" +
              "<td colspan='6'>" + lmWkRsql[i].ap_strc.trim().toUpperCase() + "</td>" +
              "<td>" + lmWkRsql[i].ap_obsr.trim().toUpperCase() + "</td>" +
            "</tr>";
            }
          }
        }

        for (var i = 0; i < lmWkRsql.length; i++) {
          lcHdTipo = "";

          if (
            parseInt(lmWkRsql[i].id_ords) == parseInt(lmIdOrds[j].id_ords) &&
            objetoDataParaStringData(lmIdOrds[j].ap_data) ==
              jsonDate(lmWkRsql[i].ap_data) &&
            parseInt(lmIdOrds[j].id_clie) == parseInt(lmWkRsql[i].id_clie)
          ) {
            if (parseInt(lmWkRsql[i].sr_disp) > 0) {
              if (parseInt(lmWkRsql[i].os_tipo) == 1) {
                //prettier-ignore
                lcHdTipo = 
              "<td>situação</td>" +
              "<td>ativ./just.</td>" +
              "<td>d. rest./resp.</td>" +
              "<td>obs.</td>";
              } else {
                //prettier-ignore
                lcHdTipo = 
              "<td colspan='4'>descrição das atividades</td>";
              }

              break;
            }
          }
        }

        if (gmOsCmntCAR.length > 0) {
          for (var i = 0; i < gmOsCmntCAR.length; i++) {
            lcCmDesc = "";

            if (
              parseInt(gmOsCmntCAR[i].id_clie) ==
                parseInt(lmIdOrds[j].id_clie) &&
              parseInt(gmOsCmntCAR[i].id_ords) ==
                parseInt(lmIdOrds[j].id_ords) &&
              objetoDataParaStringData(lmIdOrds[j].ap_data) ==
                jsonDate(gmOsCmntCAR[i].cm_data)
            ) {
              lcCmDesc = gmOsCmntCAR[i].cm_desc.trim().toUpperCase();

              break;
            }
          }
        }

        for (var i = 0; i < lmWkRsql.length; i++) {
          if (
            parseInt(lmWkRsql[i].id_ords) == parseInt(lmIdOrds[j].id_ords) &&
            objetoDataParaStringData(lmIdOrds[j].ap_data) ==
              jsonDate(lmWkRsql[i].ap_data) &&
            parseInt(lmIdOrds[j].id_clie) == parseInt(lmWkRsql[i].id_clie)
          ) {
            if (parseInt(lmWkRsql[i].sr_disp) > 0) {
              //prettier-ignore
              lcApHtml +=
            "<tr>" +
              "<td colspan='7'>proposta: " + lmWkRsql[i].os_nume.trim().toUpperCase() + "</td>" +
              "<td colspan='7'>descrição: " + lmWkRsql[i].os_desc.trim().toUpperCase() + "</td>" +
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>" +
                "recursos" +
              "</td>" + 
            "</tr>" +
            "<tr>" +
              "<td>cód.</td>" +
              "<td>tipo</td>" +
              "<td>recurso</td>" +
              "<td>função</td>" +
              "<td>entr.</td>" +
              "<td>saída</td>" +
              "<td>entr.</td>" +
              "<td>saída</td>" +
              "<td>total</td>" +
              "<td>extra</td>" +
              lcHdTipo +
            "</tr>" +
            lcApRcso +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='7'>comentários real</td>" +
              "<td colspan='7'>comentários fiscalização/supervisor( cliente )</td>" +
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='7'>" + lcCmDesc + "</td>" +
              "<td colspan='7'>&nbsp;</td>" +
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='6'>_________________________________</td>" + 
              "<td colspan='4'>_________________________________</td>" + 
              "<td colspan='4'>_________________________________</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='6'>responsável real: " + goCdUser.us_nome.trim().toUpperCase() + "</td>" + 
              "<td colspan='4'>solicitante</td>" + 
              "<td colspan='4'>aprovação do serviço</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>ótimo</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>satisfatório</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>ruim</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>EMITIDO EM " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" + 
            "</tr>" +
            "<tr>" +
              "<td colspan='14'>&nbsp;</td>" + 
            "</tr>";

              break;
            }
          }
        }
      }
    }
  }

  //prettier-ignore
  lcApHtml +=
          "</table>";

  if (lmIdOrds.length == 1) {
    lcFlName = "proposta_" + lmIdOrds[0].os_nume.trim().toLowerCase() + "_";

    lcShSbti =
      "rdo da proposta " +
      lmIdOrds[0].os_nume.trim().toLowerCase() +
      " da real";
  }

  htmlTableToExcel(lcApHtml, lcShSbti, "rdo_" + lcFlName + "real.xlsx");
}

function calculaHorasCAR(loApApnt, llHrExtr) {
  var lnApJdms = 0,
    lnAxJdms = 0,
    lnApJmms = 0,
    lnApJtms = 0,
    lnHrHora = 0,
    lnHrMnto = 0,
    lnIdDsem = 0,
    lnJoMnts = 0,
    lnHeMnts = 0;
  var ldApData = new Date(),
    ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [],
    lmApRcso = [];

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

  if (llHrExtr) {
    lnIdDsem = ldApData.getDay();

    for (var i = 0; i < gmOsJornCAR.length; i++) {
      if (
        parseInt(gmOsJornCAR[i].id_dsem) == lnIdDsem + 1 &&
        parseInt(gmOsJornCAR[i].id_ords) == parseInt(loApApnt.id_ords)
      ) {
        lnJoMnts = parseInt(gmOsJornCAR[i].jo_mnts);

        break;
      }
    }

    if (parseInt(loApApnt.ap_feri) > 0) {
      lnHeMnts = parseInt(Math.floor(lnApJdms / 60000));

      return pad(Math.floor(lnHeMnts / 60), 2) + ":" + pad(lnHeMnts % 60, 2);
    } else {
      lnApJdms = 0;
      lnAxJdms = 0;

      for (var i = 0; i < gmWkRsqlCAR.length; i++) {
        if (
          jsonDate(loApApnt.ap_data).trim() ==
            jsonDate(gmWkRsqlCAR[i].ap_data).trim() &&
          loApApnt.fu_empr.trim().toUpperCase() ==
            gmWkRsqlCAR[i].fu_empr.trim().toUpperCase() &&
          parseInt(loApApnt.id_matr) == parseInt(gmWkRsqlCAR[i].id_matr)
        ) {
          ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0);
          ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0);
          ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0);
          ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
          lmHrHora = [];
          lnHrHora = 0;
          lnHrMnto = 0;
          lnApJmms = 0;
          lnApJtms = 0;

          try {
            if (parseFloat(gmWkRsqlCAR[i].ap_hent) > 0) {
              ldApHent = new Date(ldApData);

              lmHrHora = gmWkRsqlCAR[i].ap_hent.toString().split(".");

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
            if (parseFloat(gmWkRsqlCAR[i].ap_hiin) > 0) {
              ldApHiin = new Date(ldApData);

              lmHrHora = gmWkRsqlCAR[i].ap_hiin.toString().split(".");

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
            if (parseFloat(gmWkRsqlCAR[i].ap_htin) > 0) {
              ldApHtin = new Date(ldApData);

              lmHrHora = gmWkRsqlCAR[i].ap_htin.toString().split(".");

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
            if (parseFloat(gmWkRsqlCAR[i].ap_hter) > 0) {
              ldApHter = new Date(ldApData);

              lmHrHora = gmWkRsqlCAR[i].ap_hter.toString().split(".");

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

          lmApRcso.push({
            ap_data: gmWkRsqlCAR[i].ap_data,
            fu_empr: gmWkRsqlCAR[i].fu_empr,
            id_matr: gmWkRsqlCAR[i].id_matr,
            ap_hent: gmWkRsqlCAR[i].ap_hent,
            ap_jdms: lnApJmms + lnApJtms,
            id_ords: parseInt(gmWkRsqlCAR[i].id_ords),
          });
        }
      }

      lmApRcso.sort(dynamicSort("ap_hent"));

      for (var i = 0; i < lmApRcso.length; i++) {
        lnAxJdms += lmApRcso[i].ap_jdms;

        if (parseInt(loApApnt.id_ords) == parseInt(lmApRcso[i].id_ords)) {
          lnApJdms += lmApRcso[i].ap_jdms;
        }

        if (parseFloat(loApApnt.ap_hent) == parseFloat(lmApRcso[i].ap_hent)) {
          try {
            if (
              parseInt(lmApRcso[i].id_ords) == parseInt(lmApRcso[i + 1].id_ords)
            ) {
              return "";
            }
          } catch (error) {}

          if (lnJoMnts < parseInt(Math.floor(lnAxJdms / 60000))) {
            if (lnAxJdms - lnApJdms == 0) {
              return (
                pad(
                  Math.floor(
                    (parseInt(Math.floor(lnApJdms / 60000)) - lnJoMnts) / 60
                  ),
                  2
                ) +
                ":" +
                pad(
                  parseInt(
                    (parseInt(Math.floor(lnApJdms / 60000)) - lnJoMnts) % 60
                  ),
                  2
                )
              );
            }

            if (
              parseInt(Math.floor((lnAxJdms - lnApJdms) / 60000)) < lnJoMnts
            ) {
              return (
                pad(
                  Math.floor(
                    (parseInt(Math.floor(lnAxJdms / 60000)) - lnJoMnts) / 60
                  ),
                  2
                ) +
                ":" +
                pad(
                  parseInt(
                    (parseInt(Math.floor(lnAxJdms / 60000)) - lnJoMnts) % 60
                  ),
                  2
                )
              );
            } else {
              return (
                pad(
                  Math.floor(parseInt(Math.floor(lnApJdms / 60000)) / 60),
                  2
                ) +
                ":" +
                pad(parseInt(parseInt(Math.floor(lnApJdms / 60000)) % 60), 2)
              );
            }
          } else {
            return "";
          }
        }
      }
    }
  } else {
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
}

function pdfCAR(lnRdVisu) {
  var ldDtHoje = new Date();
  var lcApSitu = "",
    lcOsTipo = "",
    lcApHent = "",
    lcApHiin = "",
    lcApHtin = "",
    lcApHter = "",
    lcHdTipo = "",
    lcApHtml = "",
    lcApRcso = "",
    lcApFoto = "",
    lcShTitu = "arquivo pdf referente ao rdo da real",
    lcShSbti = "rdo da real",
    lcFlName = "",
    lcCmDesc = "",
    lcRsQtde = "",
    lcSrDeno = "",
    lcApStrc = "",
    lcSrTabl = "",
    lcPgBrek = "<div class='pagebreak'></div>";
  var lnIdApnt = 0,
    lnCtRsq1 = 0,
    lnQtModi = 0,
    lnQtMoin = 0,
    lnQtEqpm = 0,
    lnOfIndx = 0;
  var lmIdOrds = [],
    lmIdClie = [],
    lmApRcso = [],
    lmHrModi = [],
    lmHrMoin = [],
    lmHrEqpm = [],
    lmApHora = [],
    lmSrHora = [],
    lmSrHrmn = [],
    lmSrHrex = [],
    lmWkRsql = [];

  for (var i = 0; i < gmWkRsqlCAR.length; i++) {
    for (var j = 0; j < gmOsLctoCAR.length; j++) {
      if (
        parseInt(gmOsLctoCAR[j].id_ords) == parseInt(gmWkRsqlCAR[i].id_ords) &&
        parseInt(gmOsLctoCAR[j].os_chck) > 0
      ) {
        lmWkRsql.push(gmWkRsqlCAR[i]);
      }
    }
  }

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;

    for (var j = 0; j < lmIdClie.length; j++) {
      if (
        parseInt(lmWkRsql[i].id_clie) != parseInt(lmIdClie[j].id_clie) ||
        jsonDate(lmWkRsql[i].ap_data) !=
          objetoDataParaStringData(lmIdClie[j].ap_data)
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmIdClie.length) {
      lmIdClie.push({
        id_clie: parseInt(lmWkRsql[i].id_clie),
        cl_fant: lmWkRsql[i].cl_fant.trim().toUpperCase(),
        ap_data: stringDataParaObjetoData(jsonDate(lmWkRsql[i].ap_data)),
      });
    }
  }

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;

    for (var j = 0; j < lmIdOrds.length; j++) {
      if (
        parseInt(lmWkRsql[i].id_clie) != parseInt(lmIdOrds[j].id_clie) ||
        jsonDate(lmWkRsql[i].ap_data) !=
          objetoDataParaStringData(lmIdOrds[j].ap_data) ||
        parseInt(lmWkRsql[i].id_ords) != parseInt(lmIdOrds[j].id_ords)
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmIdOrds.length) {
      lmIdOrds.push({
        id_ords: parseInt(lmWkRsql[i].id_ords),
        id_clie: parseInt(lmWkRsql[i].id_clie),
        ap_data: stringDataParaObjetoData(jsonDate(lmWkRsql[i].ap_data)),
        os_nume: lmWkRsql[i].os_nume.trim().toUpperCase(),
      });
    }
  }

  if (lmIdOrds.length == 0) {
    alerta("relatório sem conteúdo", "alerta");

    return;
  }

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;

    if (lmWkRsql[i].cb_tmdo.trim().toUpperCase() == "MOD") {
      if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
        lmHrModi.push({
          hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
          minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
        });
      }
    }

    if (lmWkRsql[i].cb_tmdo.trim().toUpperCase() == "MOI") {
      if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
        lmHrMoin.push({
          hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
          minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
        });
      }
    }

    if (lmWkRsql[i].cb_tmdo.trim().toUpperCase() == "EQP") {
      if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
        lmHrEqpm.push({
          hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
          minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
        });
      }
    }

    if (calculaHorasCAR(lmWkRsql[i], false).trim().length > 0) {
      lmApHora.push({
        hour: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[0]),
        minutes: parseInt(calculaHorasCAR(lmWkRsql[i], false).split(":")[1]),
      });
    }

    for (var j = 0; j < lmApRcso.length; j++) {
      if (
        parseInt(lmWkRsql[i].id_matr) != parseInt(lmApRcso[j].id_matr) ||
        lmWkRsql[i].fu_empr.trim().toUpperCase() !=
          lmApRcso[j].fu_empr.trim().toUpperCase()
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmApRcso.length) {
      lmApRcso.push({
        fu_empr: lmWkRsql[i].fu_empr.trim().toUpperCase(),
        id_matr: parseInt(lmWkRsql[i].id_matr),
        cb_tmdo: lmWkRsql[i].cb_tmdo.trim().toUpperCase(),
      });
    }
  }

  for (var i = 0; i < lmApRcso.length; i++) {
    if (lmApRcso[i].cb_tmdo.trim().toUpperCase() == "MOD") {
      lnQtModi++;
    }

    if (lmApRcso[i].cb_tmdo.trim().toUpperCase() == "MOI") {
      lnQtMoin++;
    }

    if (lmApRcso[i].cb_tmdo.trim().toUpperCase() == "EQP") {
      lnQtEqpm++;
    }
  }

  //prettier-ignore
  lcRsQtde = 
    "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "<b>tipo</b>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "<b>qtde</b>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "<b>horas</b>" +
        "</td>" +
      "</tr>" +
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "MOD" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          lnQtModi.toString() +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          addTimes(lmHrModi) +
        "</td>" +
      "</tr>" +
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "MOI" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          lnQtMoin.toString() +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          addTimes(lmHrMoin) +
        "</td>" +
      "</tr>" +
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "EQP" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          lnQtEqpm.toString() +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          addTimes(lmHrEqpm) +
        "</td>" +
      "</tr>" +
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "TOTAL" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          (lnQtModi + lnQtMoin + lnQtEqpm).toString() +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          addTimes(lmApHora) +
        "</td>" +
      "</tr>" +
    "</table>";

  for (var i = 0; i < lmWkRsql.length; i++) {
    lnCtRsq1 = 0;
    lcApStrc = "";
    lcSrDeno = "";
    lmSrHrmn = [];
    lmSrHrex = [];

    lcApStrc = lmWkRsql[i].ap_strc.trim().toUpperCase();
    lcSrDeno = lmWkRsql[i].sr_deno.trim().toUpperCase();

    for (var j = 0; j < lmSrHora.length; j++) {
      if (
        lmWkRsql[i].ap_strc.trim().toUpperCase() !=
          lmSrHora[j].ap_strc.trim().toUpperCase() ||
        lmWkRsql[i].sr_deno.trim().toUpperCase() !=
          lmSrHora[j].sr_deno.trim().toUpperCase()
      ) {
        lnCtRsq1++;
      }
    }

    if (lnCtRsq1 == lmSrHora.length) {
      for (var j = 0; j < lmWkRsql.length; j++) {
        if (
          lmWkRsql[j].ap_strc.trim().toUpperCase() == lcApStrc &&
          lmWkRsql[j].sr_deno.trim().toUpperCase() == lcSrDeno
        ) {
          if (calculaHorasCAR(lmWkRsql[j], false).trim().length > 0) {
            lmSrHrmn.push({
              hour: parseInt(calculaHorasCAR(lmWkRsql[j], false).split(":")[0]),
              minutes: parseInt(
                calculaHorasCAR(lmWkRsql[j], false).split(":")[1]
              ),
            });
          }

          if (calculaHorasCAR(lmWkRsql[j], true).trim().length > 0) {
            lmSrHrex.push({
              hour: parseInt(calculaHorasCAR(lmWkRsql[j], true).split(":")[0]),
              minutes: parseInt(
                calculaHorasCAR(lmWkRsql[j], true).split(":")[1]
              ),
            });
          }
        }
      }

      lmSrHora.push({
        ap_strc: lcApStrc,
        sr_deno: lcSrDeno,
        sr_hora: addTimes(lmSrHrmn),
        sr_hext: addTimes(lmSrHrex),
      });
    }
  }

  //prettier-ignore
  lcSrTabl = 
    "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "<b>status</b>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "<b>situação</b>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "<b>horas</b>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          "<b>extra</b>" +
        "</td>" +
      "</tr>";

  for (var i = 0; i < lmSrHora.length; i++) {
    //prettier-ignore
    lcSrTabl += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          lmSrHora[i].ap_strc.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          lmSrHora[i].sr_deno.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          lmSrHora[i].sr_hora.trim().toUpperCase() +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
          lmSrHora[i].sr_hext.trim().toUpperCase() +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcSrTabl += 
    "</table>";

  //prettier-ignore
  lcApHtml =
        "<html>" +
          "<style>" +
            "@media print {" +
              ".bordaDireita {" +
                "border-right: 2px solid black !important;" +
              "}" +
              "@page {" +
                "size: A4;" +
                "margin: 1.5cm 1.5cm 3cm 1.5cm;" +
              "}" +              
              ".footer {" +
                "position: fixed;" +
                "bottom: 0;" +
                "left: 0;" +
                "right: 0;" +
                "text-align: center;" +
                "font-size: 10px;" +
                "padding: 0px 0;" +
                "border-top: 1px solid #000;" +
                "background: white;" +
              "}" +              
              "body {" +
                "padding-bottom: 50px;" +
              "}" +              
              "tr {" +
                "break-inside: avoid;" +
                "page-break-inside: avoid;" +
              "}" +
              ".pagebreak {" +
                "page-break-before: always;" +
              "}" +

              // "body {" +
              //   "margin: 0 0 60px 0;" +
              //   "padding: 0;" +
              //   "zoom: 90%;" +
              // "}" +
              // "table {" +
              //   "width: 100%;" +
              //   "border-collapse: collapse;" +
              //   "table-layout: auto;" +
              // "}" +
              // "th, td {" +
              //   "padding: 12px 8px;" +
              //   "line-height: 1.6;" +
              //   "vertical-align: middle;" +
              //   "white-space: normal;" +
              //   "word-break: keep-all;" +
              // "}" +
              // ".footer {" +
              //   "position: fixed;" +
              //   "bottom: 0;" +
              //   "left: 0;" +
              //   "right: 0;" +
              //   "height: 40px;" +
              //   "text-align: center;" +
              //   "font-size: 18px;" +
              //   "background: white;" +
              //   "border-top: 1px solid #ccc;" +
              //   "z-index: 999;" +
              // "}" +
              // "@page {" +
              //   "size: landscape;" +
              //   "margin: 1cm;" +
              // "}" +
            "}" +

            "@media screen {" +
              ".footer {" +
                "display: none;" +
              "}" +
            "}" +
          "</style>" +
          "<body>" + 
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='text-align: center; font-size: XX-large;' colspan='3'>" +
                  "RELATÓRIO DIÁRIO DE OBRA" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; text-align: center; width: 33%;'>" +
                  lcSrTabl +
                "</td>" +
                "<td style='border: 1px solid black; text-align: center; width: 33%;'>" +
                  "<img src='http://www.atscs.com.br/images/empresas/gre.png' style='width: 150px;' />" +
                "</td>" +
                "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'>" +
                  lcRsQtde +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />";

  for (var k = 0; k < lmIdClie.length; k++) {
    //prettier-ignore
    lcApHtml +=
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>obra</span> <br />" +
                  "<span style='font-size: small;'>" + lmIdClie[k].cl_fant.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>data</span> <br />" +
                  "<span style='font-size: small;'>" + objetoDataParaStringData(lmIdClie[k].ap_data) + "</span>" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />";

    for (var j = 0; j < lmIdOrds.length; j++) {
      lcApRcso = "";
      lcApFoto = "";
      lcCmDesc = "";
      lnIdApnt = 0;

      if (
        parseInt(lmIdClie[k].id_clie) == parseInt(lmIdOrds[j].id_clie) &&
        objetoDataParaStringData(lmIdClie[k].ap_data) ==
          objetoDataParaStringData(lmIdOrds[j].ap_data)
      ) {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lcApSitu = "";
          lcOsTipo = "";
          lcApHent = "";
          lcApHiin = "";
          lcApHtin = "";
          lcApHter = "";

          if (
            parseInt(lmWkRsql[i].id_ords) == parseInt(lmIdOrds[j].id_ords) &&
            objetoDataParaStringData(lmIdOrds[j].ap_data) ==
              jsonDate(lmWkRsql[i].ap_data) &&
            parseInt(lmIdOrds[j].id_clie) == parseInt(lmWkRsql[i].id_clie)
          ) {
            if (parseInt(lmWkRsql[i].sr_disp) > 0) {
              if (parseInt(lmWkRsql[i].sr_trab) > 0) {
                //prettier-ignore
                lcApSitu =
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].at_deno.trim().toUpperCase() + "</span>" +
                "</td>" +   
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brDecimal(lmWkRsql[i].ap_dres) + " dia(s)</span>" +
                "</td>" +   
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'></td>";
              } else {
                if (parseInt(lmWkRsql[i].sr_just) > 0) {
                  //prettier-ignore
                  lcApSitu =
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].ju_deno.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].rj_deno.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].ap_obju.trim().toUpperCase() + "</span>" +
                "</td>";
                } else {
                  //prettier-ignore
                  lcApSitu =
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].rj_deno.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>";
                }
              }

              if (parseInt(lmWkRsql[i].os_tipo) == 1) {
                //prettier-ignore
                lcOsTipo = 
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].sr_deno.trim().toUpperCase() + "</span>" +
                "</td>" +
                lcApSitu;
              } else {
                if (parseInt(lmWkRsql[i].id_ords) > 0) {
                  //prettier-ignore
                  lcOsTipo = 
                  "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                    "<span style='font-size: small;'>" + lmWkRsql[i].ap_datv.trim().toUpperCase() + "</span>" +
                  "</td>";
                } else {
                  //prettier-ignore
                  lcOsTipo = 
                  "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                    "<span style='font-size: small;'>" + lmWkRsql[i].ap_strc.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                    "<span style='font-size: small;'>" + lmWkRsql[i].ap_datv.trim().toUpperCase() + "</span>" +
                  "</td>";
                }
              }

              if (
                pad(lmWkRsql[i].ap_hent.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHent = "";
              } else {
                lcApHent = pad(lmWkRsql[i].ap_hent.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              if (
                pad(lmWkRsql[i].ap_hiin.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHiin = "";
              } else {
                lcApHiin = pad(lmWkRsql[i].ap_hiin.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              if (
                pad(lmWkRsql[i].ap_htin.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHtin = "";
              } else {
                lcApHtin = pad(lmWkRsql[i].ap_htin.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              if (
                pad(lmWkRsql[i].ap_hter.toFixed(2), 5).replace(".", ":") ==
                "00:00"
              ) {
                lcApHter = "";
              } else {
                lcApHter = pad(lmWkRsql[i].ap_hter.toFixed(2), 5).replace(
                  ".",
                  ":"
                );
              }

              //prettier-ignore
              lcApRcso +=
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].id_apnt.toString() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].fu_func.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lcApHent + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lcApHiin + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lcApHtin + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lcApHter + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + calculaHorasCAR(lmWkRsql[i], false) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + calculaHorasCAR(lmWkRsql[i], true) + "</span>" +
                "</td>" +
                lcOsTipo +
              "</tr>";
            } else {
              //prettier-ignore
              lcApRcso +=
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].id_apnt.toString() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].fu_func.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'></span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].ap_strc.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].ap_obsr.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>";
            }
          }
        }

        for (var i = 0; i < lmWkRsql.length; i++) {
          lcHdTipo = "";

          if (
            parseInt(lmWkRsql[i].id_ords) == parseInt(lmIdOrds[j].id_ords) &&
            objetoDataParaStringData(lmIdOrds[j].ap_data) ==
              jsonDate(lmWkRsql[i].ap_data) &&
            parseInt(lmIdOrds[j].id_clie) == parseInt(lmWkRsql[i].id_clie)
          ) {
            if (parseInt(lmWkRsql[i].sr_disp) > 0) {
              if (parseInt(lmWkRsql[i].os_tipo) == 1) {
                //prettier-ignore
                lcHdTipo = 
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>situação</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>ativ./just.</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>d. rest./resp.</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>obs.</b>" +
                  "</td>";
              } else {
                if (parseInt(lmWkRsql[i].id_ords) > 0) {
                  //prettier-ignore
                  lcHdTipo = 
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>descrição das atividades" +
                  "</td>";
                } else {
                  //prettier-ignore
                  lcHdTipo = 
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>status" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>descrição das atividades" +
                  "</td>";
                }
              }

              break;
            } else {
              //prettier-ignore
              lcHdTipo = 
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>status" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                "<b>descrição das atividades" +
              "</td>";

              break;
            }
          }
        }

        if (gmOsCmntCAR.length > 0) {
          for (var i = 0; i < gmOsCmntCAR.length; i++) {
            lcCmDesc = "";

            if (
              parseInt(gmOsCmntCAR[i].id_clie) ==
                parseInt(lmIdOrds[j].id_clie) &&
              parseInt(gmOsCmntCAR[i].id_ords) ==
                parseInt(lmIdOrds[j].id_ords) &&
              objetoDataParaStringData(lmIdOrds[j].ap_data) ==
                jsonDate(gmOsCmntCAR[i].cm_data)
            ) {
              lcCmDesc = "<br />" + gmOsCmntCAR[i].cm_desc.trim().toUpperCase();

              break;
            }
          }
        }

        if (gmApFotoCAR.length > 0) {
          for (var i = 0; i < gmApFotoCAR.length; i++) {
            if (
              parseInt(gmApFotoCAR[i].id_ords) ==
                parseInt(lmIdOrds[j].id_ords) &&
              objetoDataParaStringData(lmIdOrds[j].ap_data) ==
                objetoDataParaStringData(gmApFotoCAR[i].ap_data) &&
              parseInt(lmIdOrds[j].id_clie) == parseInt(gmApFotoCAR[i].id_clie)
            ) {
              if (lnIdApnt != parseInt(gmApFotoCAR[i].id_apnt)) {
                if (i > 0) {
                  //prettier-ignore
                  lcApFoto +=
              "</tr>" +
            "</table>";
                }

                //prettier-ignore
                lcApFoto +=
            "<span style='font-size: large;'>apontamento " + gmApFotoCAR[i].id_apnt.toString() + "</span>" +
            "<br />" +
            "<table style='border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>";

                lnIdApnt = parseInt(gmApFotoCAR[i].id_apnt);
              }

              //prettier-ignore
              lcApFoto +=
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<img src='" + goCdUser.ws_wiis.trim().toLowerCase() + "fotos/apontamentos/" + gmApFotoCAR[i].id_apnt.toString() + "/" + gmApFotoCAR[i].ex_sdir.trim() + "' style='width: 200px;' >" +
                "</td>";
            }
          }

          //prettier-ignore
          lcApFoto +=
              "</tr>" +
            "</table>";
        }

        for (var i = 0; i < lmWkRsql.length; i++) {
          if (
            parseInt(lmWkRsql[i].id_ords) == parseInt(lmIdOrds[j].id_ords) &&
            objetoDataParaStringData(lmIdOrds[j].ap_data) ==
              jsonDate(lmWkRsql[i].ap_data) &&
            parseInt(lmIdOrds[j].id_clie) == parseInt(lmWkRsql[i].id_clie)
          ) {
            //prettier-ignore
            lcApHtml +=
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>proposta</span> <br />" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].os_nume.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>descrição</span> <br />" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].os_desc.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<span style='font-size: large;'>recursos</span>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;' class='bordaDireita'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>cód.</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>tipo</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>recurso</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>função</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>entr.</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>saída</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>entr.</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>saída</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>total</b>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                  "<b>extra</b>" +
                "</td>" +
                lcHdTipo +
              "</tr>" +
              lcApRcso +
            "</table>" +
            "<br />" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top; width: 50%;'>" +
                  "<span style='font-size: x-small;'>comentários real</span> <br />" +
                  "<span style='font-size: small;'>" + lcCmDesc + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; width: 50%;'>" +
                  "<span style='font-size: x-small;'>comentários fiscalização/supervisor( cliente )</span> <br />" +
                  "<span style='font-size: small;'><br /><br /><br /><br /><br /><br /><br /><br /></span>" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<br />" +
            "<br />" +
            "<br />" +
            "<table style='width: 100%;'>" +
              "<tr>" +
                "<td style='width: 28%;'>" +
                  "<hr style='width: 95%; margin-left: 0px;' />" +
                  "<span style='font-size: x-small;'>responsável real: " + goCdUser.us_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='width: 28%;'>" +
                  "<hr style='width: 95%; margin-left: 0px;' />" +
                  "<span style='font-size: x-small;'>solicitante</span>" +
                "</td>" +
                "<td style='width: 28%;'>" +
                  "<hr style='width: 95%; margin-left: 0px;' />" +
                  "<span style='font-size: x-small;'>aprovação do serviço</span>" +
                "</td>" +
                "<td style='width: 15%; text-align: right;'>" +
                  "<label for='chbOtmoCAR'>ótimo</label>" +
                  "<input type='checkbox' id='chbOtmoCAR'><br />" +
                  "<label for='chbSatsCAR'>satisfatório</label>" +
                  "<input type='checkbox' id='chbSatsCAR'><br />" +
                  "<label for='chbRuiCAR'>ruim</label>" +
                  "<input type='checkbox' id='chbRuiCAR'><br />" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<br />" +
            lcApFoto +
            "<div class='pagebreak'></div>" +
            "<br />" +
            "<br />" +
            "<div class='footer' style='text-align: center;'>" +
              "EMITIDO EM " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] +
            "</div>";

            break;
          }
        }
      }
    }
  }

  lnOfIndx = lcApHtml.lastIndexOf(lcPgBrek);

  if (lnOfIndx !== -1) {
    lcApHtml =
      lcApHtml.slice(0, lnOfIndx) + lcApHtml.slice(lnOfIndx + lcPgBrek.length);
  }

  //prettier-ignore
  lcApHtml +=
          "</body>" +
        "</html>";

  if (lmIdOrds.length == 1) {
    lcFlName = "proposta_" + lmIdOrds[0].os_nume.trim().toLowerCase() + "_";

    lcShTitu =
      "arquivo pdf referente ao rdo da proposta " +
      lmIdOrds[0].os_nume.trim().toLowerCase() +
      " da real";

    lcShSbti =
      "rdo da proposta " +
      lmIdOrds[0].os_nume.trim().toLowerCase() +
      " da real";
  }

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
                .fromData(lcApHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName: "rdo_" + lcFlName + "real.pdf",
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
                .fromData(lcApHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "rdo_" + lcFlName + "real.pdf",
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
      .fromData(lcApHtml, {
        documentSize: "A4",
        type: "share",
        fileName: "rdo_" + lcFlName + "real.pdf",
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
        "rdo_" + lcFlName + "real",
        lcApHtml
      );
    } else {
      impressaoPdf(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        "rdo_" + lcFlName + "real",
        lcApHtml
      );
    }
  }
}

function consultaSelectCAR(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  for (var i = 0; i < loObSlct.options.length; i++) {
    if (
      loObSlct.options[i].value.toString().trim().toUpperCase() ==
      loSlHtml.sl_valu.toString().trim().toUpperCase()
    ) {
      loObSlct.selectedIndex = i;

      pesquisaOrdensServicoDataApontamentoRdoCAR();

      break;
    }
  }
}

function pesquisaSelectCAR(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function pesquisaObrasDataApontamentoCAR() {
  var loDtDtde = document.getElementById("datDtdeCAR");
  var loDtDtat = document.getElementById("datDtatCAR");
  var loDvClie = document.getElementById("divClieCAR");
  var loSlClie = document.getElementById("sltClieCAR");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [],
    lmSlHtml = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)) },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlClie.disabled = true;

  loSlClie.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDataApontamento",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlClie.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltClieCAR",
            sl_valu:
              lmWkRsql[i].id_clie.toString() +
              "/" +
              lmWkRsql[i].id_cadt.toString(),
            sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            sl_titl: "pesquisa de obras",
          });

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcWkRsql;

      loDvClie.onclick = function () {
        pesquisaSelectCAR(lmSlHtml);
      };
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.disabled = false;

      loSlClie.innerHTML = lcWkRsql;

      loDvClie.onclick = function () {
        pesquisaSelectCAR([]);
      };
    },
  });
}

function pesquisaRecursosDataApontamentoCAR() {
  var loDtDtde = document.getElementById("datDtdeCAR");
  var loDtDtat = document.getElementById("datDtatCAR");
  var loLiRcso = document.getElementById("lliRcsoCAR");
  var loOgRcso = {};
  var lcWkRsql = "",
    lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)) },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  //prettier-ignore
  loLiRcso.innerHTML =
    "<a class='item-link smart-select smart-select-init clsRcsoCAR' data-open-in='popup' data-searchbar='true' data-searchbar-placeholder='pesquisa de recursos'>" +
      "<select multiple>" +
        "<optgroup id='ogrRcsoCAR' label='recursos'></optgroup>" +
      "</select>" +
      "<div class='item-content'>" +
        "<div class='item-inner'>" +
          "<div class='item-title'>recursos</div>" +
        "</div>" +
      "</div>" +
    "</a>";

  app.smartSelect.create({
    el: ".clsRcsoCAR",
    openIn: "popup",
    searchbar: true,
    searchbarPlaceholder: "pesquisa de recursos",
    on: {
      closed: function () {
        pesquisaOrdensServicoDataApontamentoRdoCAR();
      },
    },
  });

  loLiRcso.disabled = true;

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursosDataApontamento",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loLiRcso.disabled = false;

      loOgRcso = document.getElementById("ogrRcsoCAR");

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].dr_tipo.trim().toUpperCase() + lmWkRsql[i].fu_empr.trim().toUpperCase() + lmWkRsql[i].id_matr.toString() + "'>" + lmWkRsql[i].fu_nome.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loOgRcso.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loLiRcso.disabled = false;
    },
  });
}

function limpaCamposOrdemServicoCAR() {
  var loLiOrds = document.getElementById("lliOrdsCAR");

  gmOsLctoCAR = [];

  //prettier-ignore
  loLiOrds.innerHTML =
    "<a class='item-link smart-select smart-select-init clsOrdsCAR' data-open-in='popup' data-searchbar='true' data-searchbar-placeholder='pesquisa de propostas'>" +
      "<select multiple>" +
        "<optgroup id='ogrOrdsCAR' label='propostas'></optgroup>" +
      "</select>" +
      "<div class='item-content'>" +
        "<div class='item-inner'>" +
          "<div class='item-title'>propostas</div>" +
        "</div>" +
      "</div>" +
    "</a>";

  loLiOrds.style.display = "none";
}

function alteraDataCAR(loDtData) {
  var loDtDtde = document.getElementById("datDtdeCAR");
  var loDtDtat = document.getElementById("datDtatCAR");
  var loSlPesq = document.getElementById("sltPesqCAR");
  var loLiClie = document.getElementById("lliClieCAR");
  var loLiRcso = document.getElementById("lliRcsoCAR");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.value == loDtData.defaultValue) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (
    htmlDataParaObjetoData(loDtDtde.value) >
    htmlDataParaObjetoData(loDtDtat.value)
  ) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (htmlDataParaObjetoData(loDtDtat.value) > ldDtHoje) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (loSlPesq.value.toString().trim().toUpperCase() == "R") {
    pesquisaRecursosDataApontamentoCAR();

    loLiClie.style.display = "none";
    loLiRcso.style.display = "";
  } else {
    pesquisaObrasDataApontamentoCAR();

    loLiClie.style.display = "";
    loLiRcso.style.display = "none";
  }

  limpaCamposOrdemServicoCAR();
}

function limpaCamposCAR() {
  var loDvExcl = document.getElementById("divExclCAR");
  var loDvRdob = document.getElementById("divRdobCAR");
  var loDvTodo = document.getElementById("divTodoCAR");
  var loCbTodo = document.getElementById("chkTodoCAR");
  var loUlApnt = document.getElementById("uulApntCAR");
  var loDvLoad = document.getElementById("divLoadCAR");

  gnInListCAR = 0;
  gmWkRsqlCAR = [];
  gmApFotoCAR = [];
  gmOsCmntCAR = [];

  loDvExcl.style.display = "none";

  loDvRdob.onscroll = function () {};

  loDvTodo.style.display = "none";

  loCbTodo.checked = false;

  loUlApnt.innerHTML = "";

  loDvLoad.style.display = "none";
}

function ComlApRdob() {
  var loDvFabm = document.getElementById("divFabmCAR");
  var loDvFabw = document.getElementById("divFabwCAR");
  var loDtDtde = document.getElementById("datDtdeCAR");
  var loDtDtat = document.getElementById("datDtatCAR");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposCAR();

  if (isMobile()) {
    loDvFabw.style.display = "none";
  } else {
    loDvFabm.style.display = "none";
  }

  loDtDtde.valueAsDate = ldDtHoje;
  loDtDtat.valueAsDate = ldDtHoje;

  alteraDataCAR(loDtDtat);

  OkTecladoAndroid("nroNumeCAR");
}
