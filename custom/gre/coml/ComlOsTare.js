function limpaCamposCOT() {
  var loDvAtiv = document.getElementById("divAtivCOA");
  var loUlAtiv = document.getElementById("uulAtivCOT");

  goOsTareCOA = {};

  loDvAtiv.innerHTML = "";

  gmOsTareCOA = [];

  loUlAtiv.innerHTML = "";
}

function atualizaDiasRestantesCOT(lcWkRsql) {
  var loWkRsql = JSON.parse(unescape(lcWkRsql));
  var lcWkIsql = "",
    lcApDres = "";
  var lmWkIsql = [];
  var lnIdOrds = 0,
    lnIdExcl = 0,
    lnIdAtiv = 0,
    lnApDres = 0;

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
      if (parseFloat(loWkRsql.ap_dres) == -1) {
        alerta("atividade sem apontamento", "alerta");

        return;
      }
    } catch (error) {}

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
    if (parseFloat(loWkRsql.ap_dres) > 0) {
      lnApDres = parseFloat(loWkRsql.ap_dres);
    }
  } catch (error) {}

  lcApDres = prompt("dias restantes", brDecimal(lnApDres));

  if (lcApDres == null) {
    return;
  }

  try {
    if (parseFloat(lcApDres.split(".").join("").replace(",", ".")) >= 0) {
      lnApDres = parseFloat(lcApDres.split(".").join("").replace(",", "."));
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "lnIdExcl", pa_tipo: "Int", pa_valo: lnIdExcl },
    { pa_nome: "lnIdAtiv", pa_tipo: "Int", pa_valo: lnIdAtiv },
    { pa_nome: "lnApDres", pa_tipo: "Decimal", pa_valo: lnApDres },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCOT();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaDiasRestantes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmOsTareCOA = lmWkRsql;

          montaTarefasCOT();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function alteraAtividadeCOT(lcWkRsql) {
  var loDvAtiv = document.getElementById("divAtivCOA");
  var loWkRsql = JSON.parse(unescape(lcWkRsql));
  var lcAtDeno = "";

  goOsTareCOA = loWkRsql;

  if (loWkRsql.at_tipo.trim().toUpperCase() == "T") {
    lcAtDeno =
      loWkRsql.ta_codi.trim().toUpperCase() +
      " - " +
      loWkRsql.at_deno.trim().toUpperCase();
  } else {
    lcAtDeno = loWkRsql.at_deno.trim().toUpperCase();
  }

  loDvAtiv.innerHTML = lcAtDeno;
}

function montaTarefasCOT() {
  var loUlAtiv = document.getElementById("uulAtivCOT");
  var lcWkRsql = "",
    lcCrDres = "",
    lcTaCodi = "",
    lcApDres = "";

  try {
    for (var i = 0; i < gmOsTareCOA.length; i++) {
      if (parseFloat(gmOsTareCOA[i].ap_dres) == 0) {
        lcCrDres = " style='background-color: rgba( 0, 255, 0, 0.25 );'";
        lcApDres = "finalizado";
      } else if (parseFloat(gmOsTareCOA[i].ap_dres) > 0) {
        lcCrDres = " style='background-color: rgba( 255, 0, 0, 0.25 );'";
        lcApDres = brDecimal(gmOsTareCOA[i].ap_dres) + " dias restantes";
      } else {
        lcCrDres = "";

        if (parseFloat(gmOsTareCOA[i].at_dres) > 0) {
          lcApDres = brDecimal(gmOsTareCOA[i].at_dres) + " dias restantes";
        } else {
          // lcApDres = "";

          lcCrDres = " style='background-color: rgba( 0, 255, 0, 0.25 );'";
          lcApDres = "finalizado";
        }
      }

      if (gmOsTareCOA[i].at_tipo.trim().toUpperCase() == "T") {
        lcTaCodi = gmOsTareCOA[i].ta_codi.trim().toUpperCase();
      } else {
        lcTaCodi = gmOsTareCOA[i].id_ativ.toString();
      }

      if (parseFloat(gmOsTareCOA[i].at_dres) == 1000) {
        //prettier-ignore
        lcWkRsql +=
          "<li style='background-color: rgba( 255, 255, 0, 0.25 );'>" +
            "<div class='item-content'>" +
              "<div class='item-inner'>" +
                "<div class='item-title-row'>" +
                  "<div class='item-title'><b>" +
                    lcTaCodi +
                  "</b></div>" +
                  "<div class='item-after'></div>" +
                "</div>" +
                "<div class='item-subtitle'><b>" +
                  gmOsTareCOA[i].at_deno.trim().toUpperCase() +
                "</b></div>" +
                "<div class='item-text'></div>" +
              "</div>" +
            "</div>" +
          "</li>";
      } else {
        //prettier-ignore
        lcWkRsql += 
          "<li class='swipeout'" + lcCrDres + ">" +
            "<div class='swipeout-content'>" +
              "<label class='item-radio item-radio-icon-start item-content'>" +
                "<input type='radio' name='rdoAtivCOA' onchange='alteraAtividadeCOT(\"" + escape(JSON.stringify(gmOsTareCOA[i])) + "\");'>" +
                "<i class='icon icon-radio'></i>" +
                "<div class='item-inner'>" +
                  "<div class='item-title-row'>" + 
                    "<div class='item-title'></div>" +
                    "<div class='item-after'>" + lcApDres + "</div>" +
                  "</div>" +
                  "<div class='item-subtitle'>" + lcTaCodi + "</div>" +
                  "<div class='item-text'>" + gmOsTareCOA[i].at_deno.trim().toUpperCase() + "</div>" +
                "</div>" +
              "</label>" +
            "</div>" +
            "<div class='swipeout-actions-right'>" +
              "<a href='#' onclick='atualizaDiasRestantesCOT(\"" + escape(JSON.stringify(gmOsTareCOA[i])) + "\");'>" +
                "<i class='material-icons'>edit</i>" +
              "</a>" +
            "</div>" +
          "</li>";
      }
    }
  } catch (loApErro) {}

  loUlAtiv.innerHTML = lcWkRsql;
}

function ComlOsTare() {
  montaTarefasCOT();
}
