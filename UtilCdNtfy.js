var gnInListUCN = 0;
var gmWkRsqlUCN = [];

function atualizaNotificacaoUCN(lcWkRsql) {
  var loDvNtfy = document.getElementById("divNtfyUCN");
  var loSlRead = document.getElementById("sltReadUCN");
  var loLiDtde = document.getElementById("lliDtdeUCN");
  var loDtDtde = document.getElementById("datDtdeUCN");
  var loLiDtat = document.getElementById("lliDtatUCN");
  var loDtDtat = document.getElementById("datDtatUCN");
  var loDvLoad = document.getElementById("divLoadUCN");
  var loWkRsql = JSON.parse(unescape(lcWkRsql));
  var lcWkIsql = "",
    lcNoDtde = null,
    lcNoDtat = null;
  var lnNoRead = 0,
    lnIdNote = 0,
    lnPqRead = null;
  var lmWkIsql = [];

  try {
    if (parseInt(loWkRsql.id_note) > 0) {
      lnIdNote = parseInt(loWkRsql.id_note);
    } else {
      return;
    }
  } catch (error) {
    return;
  }

  try {
    if (parseInt(loWkRsql.no_read) > 0) {
      lnNoRead = 0;
    } else {
      lnNoRead = 1;
    }
  } catch (error) {
    return;
  }

  if (
    loLiDtde.style.display.trim().length == 0 &&
    loDtDtde.value.toString().trim().length > 0
  ) {
    lcNoDtde = loDtDtde.value.toString().trim();
  }

  if (
    loLiDtat.style.display.trim().length == 0 &&
    loDtDtat.value.toString().trim().length > 0
  ) {
    lcNoDtat = loDtDtat.value.toString().trim();
  }

  try {
    if (htmlDataParaObjetoData(lcNoDtde) > htmlDataParaObjetoData(lcNoDtat)) {
      alerta("data inicial maior que data final", "alerta");

      return;
    }
  } catch (error) {}

  if (parseInt(loSlRead.value) > 0) {
    lnPqRead = 1;
  } else if (parseInt(loSlRead.value) == 0) {
    lnPqRead = 0;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase(), },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdNote", pa_tipo: "Int", pa_valo: lnIdNote },
    { pa_nome: "lnNoRead", pa_tipo: "Int", pa_valo: lnNoRead },
    { pa_nome: "lnPqRead", pa_tipo: "Int", pa_valo: lnPqRead },
    { pa_nome: "ldNoDtde", pa_tipo: "SmallDatetime", pa_valo: lcNoDtde },
    { pa_nome: "ldNoDtat", pa_tipo: "SmallDatetime", pa_valo: lcNoDtat },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposUCN();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaNotificacao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      pesquisaNotificacoesTPK();

      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          gmWkRsqlUCN = lmWkRsql;

          montaGridUCN();

          loDvNtfy.onscroll = function () {
            if (
              loDvNtfy.scrollHeight -
                loDvNtfy.scrollTop -
                loDvNtfy.clientHeight <
              1
            ) {
              montaGridUCN();
            }
          };
        }
      } catch (loApErro) {
        alerta(
          "não foi possível atualizar a notificação, tenta novamente mais tarde",
          "erro"
        );
      }
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";

      alerta(
        "não foi possível atualizar a notificação, verifique sua conexão com a internet",
        "erro"
      );
    },
  });
}

function montaGridUCN() {
  var loDvNtfy = document.getElementById("divNtfyUCN");
  var loDvLoad = document.getElementById("divLoadUCN");
  var lcWkRsql = "",
    lcIcRead = "";
  var lnFnList = 0;

  if (gnInListUCN + 20 >= gmWkRsqlUCN.length) {
    loDvNtfy.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlUCN.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListUCN + 20;
  }

  for (var i = gnInListUCN; i < lnFnList; i++) {
    if (parseInt(gmWkRsqlUCN[i].no_read) > 0) {
      lcIcRead = "drafts";
    } else {
      lcIcRead = "mail";
    }

    //prettier-ignore
    lcWkRsql +=
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='atualizaNotificacaoUCN(\"" + escape(JSON.stringify(gmWkRsqlUCN[i])) + "\", " + i.toString() + ");'>" +
            "<i class='material-icons' style='color:" + corTema() + ";'>" + lcIcRead + "</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmWkRsqlUCN[i].no_text.trim() + "</b></div>" +
            "<div class='item-after'><b>" + gmWkRsqlUCN[i].no_user.trim().toUpperCase() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data da notificação</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlUCN[i].no_dthr) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>hora da solicitação</div>" +
                    "<div class='item-after'>" + jsonHora(gmWkRsqlUCN[i].no_dthr) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>enviado pelo usuário</div>" +
                    "<div class='item-after'>" + gmWkRsqlUCN[i].no_user.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li class='item-content item-input'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title item-label'>texto da notificação</div>" +
                  "<div class='item-input-wrap'>" +
                    "<textarea readonly>" + gmWkRsqlUCN[i].no_text.trim() + "</textarea>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListUCN = i;

  $("#uulGridUCN").append(lcWkRsql);
}

function pesquisaNotificacoesUCN() {
  var loDvNtfy = document.getElementById("divNtfyUCN");
  var loSlRead = document.getElementById("sltReadUCN");
  var loLiDtde = document.getElementById("lliDtdeUCN");
  var loDtDtde = document.getElementById("datDtdeUCN");
  var loLiDtat = document.getElementById("lliDtatUCN");
  var loDtDtat = document.getElementById("datDtatUCN");
  var loDvLoad = document.getElementById("divLoadUCN");
  var lcWkIsql = "",
    lcNoDtde = null,
    lcNoDtat = null;
  var lnNoRead = null;
  var lmWkIsql = [];

  if (
    loLiDtde.style.display.trim().length == 0 &&
    loDtDtde.value.toString().trim().length > 0
  ) {
    lcNoDtde = loDtDtde.value.toString().trim();
  }

  if (
    loLiDtat.style.display.trim().length == 0 &&
    loDtDtat.value.toString().trim().length > 0
  ) {
    lcNoDtat = loDtDtat.value.toString().trim();
  }

  try {
    if (htmlDataParaObjetoData(lcNoDtde) > htmlDataParaObjetoData(lcNoDtat)) {
      alerta("data inicial maior que data final", "alerta");

      return;
    }
  } catch (error) {}

  if (parseInt(loSlRead.value) > 0) {
    lnNoRead = 1;
  } else if (parseInt(loSlRead.value) == 0) {
    lnNoRead = 0;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase(), },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnNoRead", pa_tipo: "Int", pa_valo: lnNoRead },
    { pa_nome: "ldNoDtde", pa_tipo: "SmallDatetime", pa_valo: lcNoDtde },
    { pa_nome: "ldNoDtat", pa_tipo: "SmallDatetime", pa_valo: lcNoDtat },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposUCN();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaNotificacoes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          gmWkRsqlUCN = lmWkRsql;

          montaGridUCN();

          loDvNtfy.onscroll = function () {
            if (
              loDvNtfy.scrollHeight -
                loDvNtfy.scrollTop -
                loDvNtfy.clientHeight <
              1
            ) {
              montaGridUCN();
            }
          };
        }
      } catch (loApErro) {
        alerta(
          "não foi possível pesquisar as notificações, tenta novamente mais tarde",
          "erro"
        );
      }
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";

      alerta(
        "não foi possível pesquisar as notificações, verifique sua conexão com a internet",
        "erro"
      );
    },
  });
}

function alteraTipoUCN() {
  var loSlRead = document.getElementById("sltReadUCN");
  var loLiDtde = document.getElementById("lliDtdeUCN");
  var loLiDtat = document.getElementById("lliDtatUCN");

  if (parseInt(loSlRead.value) == 0) {
    loLiDtde.style.display = "none";
    loLiDtat.style.display = "none";
  } else {
    loLiDtde.style.display = "";
    loLiDtat.style.display = "";
  }
}

function limpaCamposUCN() {
  var loDvNtfy = document.getElementById("divNtfyUCN");
  var loUlGrid = document.getElementById("uulGridUCN");
  var loDvLoad = document.getElementById("divLoadUCN");

  gmWkRsqlUCN = [];

  gnInListUCN = 0;

  loDvNtfy.onscroll = function () {};

  loUlGrid.innerHTML = "";

  loDvLoad.style.display = "none";
}

function UtilCdNtfy() {
  var loDtDtde = document.getElementById("datDtdeUCN");
  var loDtDtat = document.getElementById("datDtatUCN");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposUCN();

  loDtDtde.valueAsDate = ldDtHoje;
  loDtDtat.valueAsDate = ldDtHoje;

  alteraTipoUCN();
  pesquisaNotificacoesUCN();
}
