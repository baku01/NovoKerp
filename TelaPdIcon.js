function pesquisaOrcamentosTPI() {
  var loSpOrca = document.getElementById("spnOrcaTPI");
  var lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lnIdSitu", pa_tipo: "Int", pa_valo: 35 },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "ldPeDtde", pa_tipo: "SmallDatetime", pa_valo: null },
    { pa_nome: "ldPeDtat", pa_tipo: "SmallDatetime", pa_valo: null },
    { pa_nome: "lnIdVend", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "lnStAplc", pa_tipo: "Int", pa_valo: null }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSpOrca.className = "";
  loSpOrca.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaOrcamentos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loSpOrca.className = "badge color-red";
          loSpOrca.innerHTML = lmWkRsql.length.toString();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaNotificacoesTPI() {
  var loSpNtfy = document.getElementById("spnNtfyTPI");
  var lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase(), },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnNoRead", pa_tipo: "Int", pa_valo: 0 },
    { pa_nome: "ldNoDtde", pa_tipo: "SmallDatetime", pa_valo: null },
    { pa_nome: "ldNoDtat", pa_tipo: "SmallDatetime", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSpNtfy.className = "";
  loSpNtfy.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaNotificacoes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loSpNtfy.className = "badge color-red";
          loSpNtfy.innerHTML = lmWkRsql.length.toString();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function linkTPI(lcMnLink) {
  app.dialog.preloader("carregando...");

  window.open(lcMnLink, "_system");

  setTimeout(function () {
    app.dialog.close();
  }, 3000);
}

function pesquisaMenuTPI() {
  var loDvMenu = document.getElementById("divMenuTPI");
  var lcWkRsql = "",
    lcWkIsql = "",
    lcSgImge = "",
    lcMnStyl = "",
    lcBdNtfy = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcMnTipo", pa_tipo: "VarChar", pa_valo: "T" },
    { pa_nome: "lcIdPosi", pa_tipo: "VarChar", pa_valo: null }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaMenu",
    type: "GET",
    dataType: "jsonp",
    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          //prettier-ignore
          for (var i = 0; i < lmWkRsql.length; i = i + 2) {
            try {
              if (lmWkRsql[i + 1].mn_imag.trim().charAt(0) == "-") {
                lcMnImag = lmWkRsql[i + 1].mn_imag.trim().toLowerCase().substr(1);
              } else {
                lcMnImag = lmWkRsql[i + 1].mn_imag.trim().toLowerCase();
              }             

              try {
                if (lmWkRsql[i + 1].mn_styl.trim().length > 0) {
                  lcMnStyl = " " + lmWkRsql[i + 1].mn_styl.trim();
                } else {
                  lcMnStyl = "";
                }
              } catch (error) {
                lcMnStyl = "";
              }

              if (lmWkRsql[i + 1].mn_tipo.trim().toUpperCase() == "L") {
                lcSgImge = 
                    "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcMnStyl + "' onclick='linkTPI(\"" + lmWkRsql[i + 1].mn_link.trim() + "\");'>" +
                      lmWkRsql[i + 1].mn_deno.trim().toLowerCase() + "<br />" +
                      "<i class='material-icons'>" + lcMnImag + "</i>" + 
                    "</div>";
              } else {
                if (
                  lmWkRsql[i + 1].mn_tela.trim().toUpperCase() ==
                  "UTILCDNTFY.HTML"
                ) {
                  lcBdNtfy = "<span id='spnNtfyTPI' style='margin-bottom: 11px;'></span>";
                } else if (
                  lmWkRsql[i + 1].mn_tela.trim().toUpperCase() ==
                  "VNDAPEORCA.HTML"
                ) {
                  lcBdNtfy = "<span id='spnOrcaTPI' style='margin-bottom: 11px;'></span>";
                } else {
                  lcBdNtfy = "";
                }

                lcSgImge = 
                    "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcMnStyl + "' onclick='redireciona(\"" + lmWkRsql[i + 1].mn_path.trim() + lmWkRsql[i + 1].mn_tela.trim() + '", "' + lmWkRsql[i + 1].mn_tela.trim() + "\");'>" +
                      lmWkRsql[i + 1].mn_deno.trim().toLowerCase() + "<br />" +
                      "<i class='material-icons'>" + lcMnImag + "</i>" + lcBdNtfy + 
                    "</div>";
              }              
            } catch (error) {
              lcSgImge = "";
            }

            if (lmWkRsql[i].mn_imag.trim().charAt(0) == "-") {
              lcMnImag = lmWkRsql[i].mn_imag.trim().toLowerCase().substr(1);
            } else {
              lcMnImag = lmWkRsql[i].mn_imag.trim().toLowerCase();
            }
            
            try {
              if (lmWkRsql[i].mn_styl.trim().length > 0) {
                lcMnStyl = " " + lmWkRsql[i].mn_styl.trim();
              } else {
                lcMnStyl = "";
              }
            } catch (error) {
              lcMnStyl = "";
            }

            if (lmWkRsql[i].mn_tipo.trim().toUpperCase() == "L") {
              lcWkRsql += 
                "<div class='row'>" +
                  "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcMnStyl + "' onclick='linkTPI(\"" + lmWkRsql[i].mn_link.trim() + "\");'>" +
                    lmWkRsql[i].mn_deno.trim().toLowerCase() + "<br />" +
                    "<i class='material-icons'>" + lcMnImag + "</i>" + 
                  "</div>" +
                  lcSgImge +
                "</div>" +
                "<br />";
            } else {
              if (
                lmWkRsql[i].mn_tela.trim().toUpperCase() ==
                "UTILCDNTFY.HTML"
              ) {
                lcBdNtfy = "<span id='spnNtfyTPI' style='margin-bottom: 11px;'></span>";
              } else if (
                lmWkRsql[i].mn_tela.trim().toUpperCase() ==
                "VNDAPEORCA.HTML"
              ) {
                lcBdNtfy = "<span id='spnOrcaTPI' style='margin-bottom: 11px;'></span>";
              } else {
                lcBdNtfy = "";
              }

              lcWkRsql += 
                "<div class='row'>" +
                  "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;" + lcMnStyl + "' onclick='redireciona(\"" + lmWkRsql[i].mn_path.trim() + lmWkRsql[i].mn_tela.trim() + '", "' + lmWkRsql[i].mn_tela.trim() + "\");'>" +
                    lmWkRsql[i].mn_deno.trim().toLowerCase() + "<br />" +
                    "<i class='material-icons'>" + lcMnImag + "</i>" + lcBdNtfy + 
                  "</div>" +
                  lcSgImge +
                "</div>" +
                "<br />";
            }
          }
        }
      } catch (loApErro) {}

      loDvMenu.innerHTML = lcWkRsql;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          if (lmWkRsql[i].mn_tela.trim().toUpperCase() == "UTILCDNTFY.HTML") {
            pesquisaNotificacoesTPI();
          } else if (
            lmWkRsql[i].mn_tela.trim().toUpperCase() == "VNDAPEORCA.HTML"
          ) {
            pesquisaOrcamentosTPI();
          }
        }
      } catch (error) {}
    },
    error: function (jqXHR, textStatus, err) {
      loDvMenu.innerHTML = lcWkRsql;
    },
  });
}

function TelaPdIcon() {
  pesquisaMenuTPI();
}
