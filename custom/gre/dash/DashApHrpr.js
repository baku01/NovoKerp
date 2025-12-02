function insereHoraPremioDAH() {
  var loDtDat0 = document.getElementById("datDataDOL");
  var loDtData = document.getElementById("datDataDAH");
  var loTxHora = document.getElementById("txtHoraDAH");
  var loTaDesc = document.getElementById("txaDescDAH");
  var lcWkIsql = "",
    lcPsData = "",
    lcAhData = "",
    lcAhData = "",
    lcAhDesc = "";
  var lmWkIsql = [];
  var lnIdClie = 0,
    lnAhHora = 0,
    lnAhMinu = 0;

  app.input.validate(loTaDesc);

  if (loDtDat0.value.toString().trim().length > 0) {
    lcPsData = loDtDat0.value.toString().trim();
  } else {
    alerta("data da posição inválida", "alerta");

    return;
  }

  try {
    if (parseInt(goCdClieDOL.id_clie) > 0) {
      lnIdClie = parseInt(goCdClieDOL.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    lcAhData = loDtData.value.toString().trim();
  } else {
    alerta("data inválida", "alerta");

    return;
  }

  if (loTxHora.value.toString().trim().length > 0) {
    lnAhMinu = parseInt(loTxHora.value.toString().trim().split(":")[1]);

    if (lnAhMinu >= 60) {
      alerta("minutos inválidos", "alerta");

      return;
    }

    lnAhHora = parseFloat(loTxHora.value.toString().trim().replace(":", "."));
  } else {
    alerta("hora prêmio inválida", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(lcPsData) < htmlDataParaObjetoData(lcAhData)) {
    alerta("data maior que data da posição", "alerta");

    return;
  }

  if (loTaDesc.value.toString().trim().length > 0) {
    lcAhDesc = loTaDesc.value.toString().trim().toUpperCase();
  } else {
    alerta("descrição inválida", "alerta");

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
    { pa_nome: "ldPsData", pa_tipo: "SmallDatetime", pa_valo: lcPsData },
    { pa_nome: "ldAhData", pa_tipo: "SmallDatetime", pa_valo: lcAhData },
    { pa_nome: "lnAhHora", pa_tipo: "Decimal", pa_valo: lnAhHora },
    { pa_nome: "lcAhDesc", pa_tipo: "VarChar", pa_valo: lcAhDesc },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDtData.value = loDtDat0.value;
  loTxHora.value = "";
  loTaDesc.value = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereHoraPremio",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ah_erro.trim().length > 0) {
          alerta(lmWkRsql[0].ah_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (loApErro) {}

      pesquisaHorasPremioDCC();
      pesquisaHorasPremioDOL();
      montaHorasPremioDAH(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {
      pesquisaHorasPremioDCC();
      pesquisaHorasPremioDOL();
      montaHorasPremioDAH([]);
    },
  });
}

function deletaHoraPremioDAH(lcApHrpr) {
  var loDtData = document.getElementById("datDataDOL");
  var loApHrpr = JSON.parse(unescape(lcApHrpr));
  var lnIdClie = 0,
    lnIdHrpr = 0;
  var lcWkIsql = "",
    lcAhData = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goCdClieDOL.id_clie) > 0) {
      lnIdClie = parseInt(goCdClieDOL.id_clie);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    lcAhData = loDtData.value.toString().trim();
  }

  if (lcAhData.trim().length == 0) {
    return;
  }

  try {
    if (parseInt(loApHrpr.id_hrpr) > 0) {
      lnIdHrpr = parseInt(loApHrpr.id_hrpr);
    }
  } catch (error) {}

  if (lnIdHrpr == 0) {
    return;
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdHrpr", pa_tipo: "Int", pa_valo: lnIdHrpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldAhData", pa_tipo: "SmallDatetime", pa_valo: lcAhData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=deletaHoraPremio",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql[0].ah_erro.trim().length > 0) {
          alerta(lmWkRsql[0].ah_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (loApErro) {}

      pesquisaHorasPremioDCC();
      pesquisaHorasPremioDOL();
      montaHorasPremioDAH(lmWkRsql);
    },
    error: function (jqXHR, textStatus, err) {
      pesquisaHorasPremioDCC();
      pesquisaHorasPremioDOL();
      montaHorasPremioDAH([]);
    },
  });
}

function montaHorasPremioDAH(lmApHrpr) {
  var loUlHrpr = document.getElementById("uulHrprDAH");
  var lcWkRsql = "";

  for (var i = 0; i < lmApHrpr.length; i++) {
    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='deletaHoraPremioDAH(\"" + escape(JSON.stringify(lmApHrpr[i])) + "\");'>" + 
            "<i class='material-icons text-color-red'>remove_circle</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + jsonDate(lmApHrpr[i].ah_data) + "</b></div>" +
            "<div class='item-after'><b>" + pad(lmApHrpr[i].ah_hora.toFixed(2), 5).replace(".", ":") + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>usuário</div>" +
                    "<div class='item-after'>" + lmApHrpr[i].id_user.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data</div>" +
                    "<div class='item-after'>" + jsonDate(lmApHrpr[i].ah_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>horas prêmio</div>" +
                    "<div class='item-after'>" + pad(lmApHrpr[i].ah_hora.toFixed(2), 5).replace(".", ":") + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li class='item-content item-input'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title item-label'>descrição</div>" +
                  "<div class='item-input-wrap'>" +
                    "<textarea readonly>" + lmApHrpr[i].ah_desc.trim().toUpperCase() + "</textarea>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  loUlHrpr.innerHTML = lcWkRsql;
}

function limpaCamposDAH() {
  var loUlHrpr = document.getElementById("uulHrprDAH");
  var loDvLoad = document.getElementById("divLoadDAH");

  loUlHrpr.innerHTML = "";

  loDvLoad.style.display = "none";
}

function DashApHrpr() {
  var loDvCli0 = document.getElementById("divClieDOL");
  var loDtDat0 = document.getElementById("datDataDOL");
  var loDvClie = document.getElementById("divClieDAH");
  var loDtData = document.getElementById("datDataDAH");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDvClie.innerHTML = loDvCli0.innerHTML;

  loDtData.valueAsDate = ldDtHoje;

  if (loDtDat0) {
    loDtData.value = loDtDat0.value;
  }

  limpaCamposDAH();
  montaHorasPremioDAH(gmApHrprDOL);

  jQuery(function ($) {
    $("#txtHoraDAH").mask("999:99");
  });

  OkTecladoAndroid("datDataDAH");
  OkTecladoAndroid("txtHoraDAH");
}
