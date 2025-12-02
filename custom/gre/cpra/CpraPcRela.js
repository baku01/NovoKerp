var gnInListCPR = 0;
var gmPcLctoCPR = [];

function marcaTodosCPR() {
  var loCbTodo = document.getElementById("chkTodoCPR");
  var loCbPcom = {};

  for (var i = 0; i < gnInListCPR; i++) {
    loCbPcom = document.getElementById(
      "chk" + gmPcLctoCPR[i].id_pcom.toString().trim() + "CPR"
    );

    if (loCbTodo.checked) {
      if (!loCbPcom.checked) {
        checkCPR(escape(JSON.stringify(gmPcLctoCPR[i])), true);
      }
    } else {
      if (loCbPcom.checked) {
        checkCPR(escape(JSON.stringify(gmPcLctoCPR[i])), true);
      }
    }
  }
}

function desaprovaCPR(lcIdUser) {
  var loDvAprv = document.getElementById("divAprvCPR");
  var loDvDprv = document.getElementById("divDprvCPR");
  var loDvRela = document.getElementById("divRelaCPR");
  var loSlParm = document.getElementById("sltParmCPR");
  var loDtDtde = document.getElementById("datDtdeCPR");
  var loDtDtat = document.getElementById("datDtatCPR");
  var loSlAprv = document.getElementById("sltAprvCPR");
  var loSlClie = document.getElementById("sltClieCPR");
  var loTxDeno = document.getElementById("txtDenoCPR");
  var loDvTota = document.getElementById("divTotaCPR");
  var loDvTqtd = document.getElementById("divTqtdCPR");
  var loDvLoad = document.getElementById("divLoadCPR");
  var loCbPcom = {};
  var lnApSitu = parseInt(loSlAprv.value),
    lnDvTota = 0,
    lnDvTqtd = 0,
    lnIdClie = null;
  var lcWkIsql = "",
    lcIdPcom = "",
    lcSlParm = loSlParm.value.toString().trim().toUpperCase(),
    lcDtDtde = null,
    lcDtDtat = null,
    lcPcDtde = null,
    lcPcDtat = null,
    lcPcDede = null,
    lcPcDeat = null,
    lcCeDeno = null;
  var lmWkIsql = [];

  for (var i = 0; i < gnInListCPR; i++) {
    loCbPcom = document.getElementById(
      "chk" + gmPcLctoCPR[i].id_pcom.toString() + "CPR"
    );

    if (loCbPcom.checked) {
      lcIdPcom += gmPcLctoCPR[i].id_pcom.toString() + ", ";
    }
  }

  if (lcIdPcom.trim().length > 0) {
    lcIdPcom = lcIdPcom.slice(0, -2);
  }

  if (lcIdPcom.trim().length == 0) {
    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "confirma desaprovação dos pedidos de compra ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            if (loDtDtde.value.toString().trim().length > 0) {
              lcDtDtde = loDtDtde.value.toString().trim().toUpperCase();
            }

            if (loDtDtat.value.toString().trim().length > 0) {
              lcDtDtat = loDtDtat.value.toString().trim().toUpperCase();
            }

            if (lcDtDtde != null && lcDtDtat != null) {
              if (
                htmlDataParaObjetoData(lcDtDtat) <
                htmlDataParaObjetoData(lcDtDtde)
              ) {
                loDtDtde.value = lcDtDtat;
                loDtDtat.value = lcDtDtde;

                lcDtDtde = loDtDtde.value.toString().trim().toUpperCase();
                lcDtDtat = loDtDtat.value.toString().trim().toUpperCase();
              }
            }

            if (lcSlParm.trim().toUpperCase() == "PC_DATA") {
              lcPcDtde = lcDtDtde;
              lcPcDtat = lcDtDtat;
            }

            if (lcSlParm.trim().toUpperCase() == "PC_DTEN") {
              lcPcDede = lcDtDtde;
              lcPcDeat = lcDtDtat;
            }

            if (loSlClie.value > 0) {
              lnIdClie = parseInt(loSlClie.value);
            }

            if (loTxDeno.value.toString().trim().length > 0) {
              lcCeDeno = loTxDeno.value.toString().trim().toUpperCase();
            }

            //prettier-ignore
            lmWkIsql = [
              { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser },
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lcIdPcom", pa_tipo: "VarChar", pa_valo: lcIdPcom },
              { pa_nome: "ldPcDtde", pa_tipo: "SmallDateTime", pa_valo: lcPcDtde },
              { pa_nome: "ldPcDtat", pa_tipo: "SmallDateTime", pa_valo: lcPcDtat },
              { pa_nome: "ldPcDede", pa_tipo: "SmallDateTime", pa_valo: lcPcDede },
              { pa_nome: "ldPcDeat", pa_tipo: "SmallDateTime", pa_valo: lcPcDeat },
              { pa_nome: "lnApSitu", pa_tipo: "Int", pa_valo: lnApSitu },
              { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
              { pa_nome: "lcCeDeno", pa_tipo: "VarChar", pa_valo: lcCeDeno },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            limpaCamposCPR();

            loDvLoad.style.display = "";

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=atualizaDesaprovaPedidoCompra",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                notificacao("pedidos de compra desaprovados", "sucesso");

                loDvLoad.style.display = "none";

                try {
                  if (lmWkRsql.length > 0) {
                    gmPcLctoCPR = lmWkRsql;

                    if (lnApSitu == 1) {
                      loDvAprv.style.display = "";
                    } else if (lnApSitu == 2) {
                      loDvDprv.style.display = "";
                    }

                    for (var i = 0; i < gmPcLctoCPR.length; i++) {
                      lnDvTota += parseFloat(gmPcLctoCPR[i].pc_tota);
                      lnDvTqtd += parseFloat(gmPcLctoCPR[i].pc_qtde);
                    }

                    loDvTota.innerHTML = brMoney(lnDvTota);
                    loDvTqtd.innerHTML = brDecimal(lnDvTqtd);

                    montaPedidosCompraCPR();

                    loDvRela.onscroll = function () {
                      if (
                        loDvRela.scrollHeight -
                          loDvRela.scrollTop -
                          loDvRela.clientHeight <
                        1
                      ) {
                        montaPedidosCompraCPR();
                      }
                    };
                  }
                } catch (loWkErro) {}
              },
              error: function (jqXHR, textStatus, err) {
                loDvLoad.style.display = "none";
              },
            });
          },
        },
      ],
    })
    .open();
}

function aprovaCPR(lcIdUser, lnUsFxde, lnUsFxat) {
  var loDvAprv = document.getElementById("divAprvCPR");
  var loDvDprv = document.getElementById("divDprvCPR");
  var loDvRela = document.getElementById("divRelaCPR");
  var loSlParm = document.getElementById("sltParmCPR");
  var loDtDtde = document.getElementById("datDtdeCPR");
  var loDtDtat = document.getElementById("datDtatCPR");
  var loSlAprv = document.getElementById("sltAprvCPR");
  var loSlClie = document.getElementById("sltClieCPR");
  var loTxDeno = document.getElementById("txtDenoCPR");
  var loDvTota = document.getElementById("divTotaCPR");
  var loDvTqtd = document.getElementById("divTqtdCPR");
  var loDvLoad = document.getElementById("divLoadCPR");
  var loCbPcom = {};
  var lnApSitu = parseInt(loSlAprv.value),
    lnDvTota = 0,
    lnDvTqtd = 0,
    lnIdClie = null;
  var lcWkIsql = "",
    lcMgConf = "",
    lcIdPcom = "",
    lcPcNume = "",
    lcSlParm = loSlParm.value.toString().trim().toUpperCase(),
    lcDtDtde = null,
    lcDtDtat = null,
    lcPcDtde = null,
    lcPcDtat = null,
    lcPcDede = null,
    lcPcDeat = null,
    lcCeDeno = null;
  var lmWkIsql = [];

  for (var i = 0; i < gnInListCPR; i++) {
    loCbPcom = document.getElementById(
      "chk" + gmPcLctoCPR[i].id_pcom.toString().trim() + "CPR"
    );

    if (loCbPcom.checked) {
      if (
        parseFloat(gmPcLctoCPR[i].pc_tota) < parseFloat(lnUsFxde) ||
        parseFloat(gmPcLctoCPR[i].pc_tota) > parseFloat(lnUsFxat)
      ) {
        lcPcNume += gmPcLctoCPR[i].pc_nume.toString() + ", ";
      } else {
        lcIdPcom += gmPcLctoCPR[i].id_pcom.toString() + ", ";
      }
    }
  }

  if (lcPcNume.trim().length > 0) {
    lcPcNume = lcPcNume.slice(0, -2);
  }

  if (lcIdPcom.trim().length > 0) {
    lcIdPcom = lcIdPcom.slice(0, -2);
  }

  if (lcIdPcom.trim().length == 0) {
    if (lcPcNume.trim().length > 0) {
      alerta(
        "ordens de compra " + lcPcNume + " não aprovadas por motivo de alçada",
        "alerta"
      );
    }

    return;
  }

  if (lcPcNume.trim().length > 0) {
    lcMgConf =
      "ordens de compra " +
      lcPcNume +
      " sem alçada para aprovação, deseja continuar ?";
  } else {
    lcMgConf = "confirma aprovação dos pedidos de compra ?";
  }

  app.dialog
    .create({
      title: "alerta",
      text: lcMgConf,
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            if (loDtDtde.value.toString().trim().length > 0) {
              lcDtDtde = loDtDtde.value.toString().trim().toUpperCase();
            }

            if (loDtDtat.value.toString().trim().length > 0) {
              lcDtDtat = loDtDtat.value.toString().trim().toUpperCase();
            }

            if (lcDtDtde != null && lcDtDtat != null) {
              if (
                htmlDataParaObjetoData(lcDtDtat) <
                htmlDataParaObjetoData(lcDtDtde)
              ) {
                loDtDtde.value = lcDtDtat;
                loDtDtat.value = lcDtDtde;

                lcDtDtde = loDtDtde.value.toString().trim().toUpperCase();
                lcDtDtat = loDtDtat.value.toString().trim().toUpperCase();
              }
            }

            if (lcSlParm.trim().toUpperCase() == "PC_DATA") {
              lcPcDtde = lcDtDtde;
              lcPcDtat = lcDtDtat;
            }

            if (lcSlParm.trim().toUpperCase() == "PC_DTEN") {
              lcPcDede = lcDtDtde;
              lcPcDeat = lcDtDtat;
            }

            if (loSlClie.value > 0) {
              lnIdClie = parseInt(loSlClie.value);
            }

            if (loTxDeno.value.toString().trim().length > 0) {
              lcCeDeno = loTxDeno.value.toString().trim().toUpperCase();
            }

            //prettier-ignore
            lmWkIsql = [
              { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser },
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lcIdPcom", pa_tipo: "VarChar", pa_valo: lcIdPcom },
              { pa_nome: "ldPcDtde", pa_tipo: "SmallDateTime", pa_valo: lcPcDtde },
              { pa_nome: "ldPcDtat", pa_tipo: "SmallDateTime", pa_valo: lcPcDtat },
              { pa_nome: "ldPcDede", pa_tipo: "SmallDateTime", pa_valo: lcPcDede },
              { pa_nome: "ldPcDeat", pa_tipo: "SmallDateTime", pa_valo: lcPcDeat },
              { pa_nome: "lnApSitu", pa_tipo: "Int", pa_valo: lnApSitu },
              { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
              { pa_nome: "lcCeDeno", pa_tipo: "VarChar", pa_valo: lcCeDeno },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            limpaCamposCPR();

            loDvLoad.style.display = "";

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=atualizaAprovaPedidoCompra",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                notificacao("pedidos de compra aprovados", "sucesso");

                loDvLoad.style.display = "none";

                try {
                  if (lmWkRsql.length > 0) {
                    gmPcLctoCPR = lmWkRsql;

                    if (lnApSitu == 1) {
                      loDvAprv.style.display = "";
                    } else if (lnApSitu == 2) {
                      loDvDprv.style.display = "";
                    }

                    for (var i = 0; i < gmPcLctoCPR.length; i++) {
                      lnDvTota += parseFloat(gmPcLctoCPR[i].pc_tota);
                      lnDvTqtd += parseFloat(gmPcLctoCPR[i].pc_qtde);
                    }

                    loDvTota.innerHTML = brMoney(lnDvTota);
                    loDvTqtd.innerHTML = brDecimal(lnDvTqtd);

                    montaPedidosCompraCPR();

                    loDvRela.onscroll = function () {
                      if (
                        loDvRela.scrollHeight -
                          loDvRela.scrollTop -
                          loDvRela.clientHeight <
                        1
                      ) {
                        montaPedidosCompraCPR();
                      }
                    };
                  }
                } catch (loWkErro) {}
              },
              error: function (jqXHR, textStatus, err) {
                loDvLoad.style.display = "none";
              },
            });
          },
        },
      ],
    })
    .open();
}

function paginaLiberaAprovacaoCPR(llPcAprv) {
  var lnCbCont = 0;
  var loCbPcom = {};

  for (var i = 0; i < gnInListCPR; i++) {
    loCbPcom = document.getElementById(
      "chk" + gmPcLctoCPR[i].id_pcom.toString().trim() + "CPR"
    );

    if (loCbPcom.checked) {
      lnCbCont++;
    }
  }

  if (lnCbCont == 0) {
    alerta("nenhum pedido de compra selecionado", "alerta");

    return;
  }

  if (llPcAprv) {
    paginaLibera("CPRAE", null, "aprovaCPR(lmWkRsql[0].id_user.trim().toUpperCase(), parseFloat(lmWkRsql[0].us_fxde), parseFloat(lmWkRsql[0].us_fxat));", "", "black");
  } else {
    paginaLibera("CPRAE", null, "desaprovaCPR(lmWkRsql[0].id_user.trim().toUpperCase());", "", "black");
  }
}

function checkCPR(lcPcLcto, llCbTodo) {
  var loPcLcto = JSON.parse(unescape(lcPcLcto));
  var loDvSele = document.getElementById("divSeleCPR");
  var loDvSqtd = document.getElementById("divSqtdCPR");
  var loCbTodo = document.getElementById("chkTodoCPR");
  var loCbPcom = document.getElementById(
    "chk" + loPcLcto.id_pcom.toString().trim() + "CPR"
  );
  var loLiPcom = document.getElementById(
    "lli" + loPcLcto.id_pcom.toString().trim() + "CPR"
  );
  var lnDvSele = 0,
    lnDvSqtd = 0,
    lnPcTota = parseFloat(loPcLcto.pc_tota),
    lnPcQtde = parseFloat(loPcLcto.pc_qtde);

  if (!llCbTodo) {
    app.accordion.toggle(loLiPcom);
  }

  if (loDvSele.innerHTML.trim().length > 0) {
    lnDvSele = parseFloat(
      loDvSele.innerHTML
        .replace("R$ ", "")
        .split(".")
        .join("")
        .replace(",", ".")
    );
  }

  if (loDvSqtd.innerHTML.trim().length > 0) {
    lnDvSqtd = parseFloat(
      loDvSqtd.innerHTML.split(".").join("").replace(",", ".")
    );
  }

  if (loCbPcom.checked) {
    loCbPcom.checked = false;
    loCbTodo.checked = false;
    lnDvSele -= lnPcTota;
    lnDvSqtd -= lnPcQtde;
  } else {
    loCbPcom.checked = true;
    lnDvSele += lnPcTota;
    lnDvSqtd += lnPcQtde;
  }

  if (lnDvSele > 0) {
    loDvSele.innerHTML = brMoney(lnDvSele);
  } else {
    loDvSele.innerHTML = "";
  }

  if (lnDvSqtd > 0) {
    loDvSqtd.innerHTML = brDecimal(lnDvSqtd);
  } else {
    loDvSqtd.innerHTML = "";
  }
}

function pesquisaCadastrosEstoquePedidoCompraCPR(lcPcLcto) {
  var loPcLcto = JSON.parse(unescape(lcPcLcto));

  if (parseInt(loPcLcto.id_pcom) > 0) {
    sessionStorage.setItem("soPcLcto", JSON.stringify(loPcLcto));

    redireciona("custom/gre/cpra/CpraPcMvto.html", "CpraPcMvto.html");
  }
}

function montaPedidosCompraCPR() {
  var loDvRela = document.getElementById("divRelaCPR");
  var loDvLoad = document.getElementById("divLoadCPR");
  var lcWkRsql = "",
    lcBtMvto = "",
    lcOnCont = "";
  var lmWkRsql = gmPcLctoCPR;
  var lnFnList = 0;

  if (gnInListCPR + 20 >= lmWkRsql.length) {
    loDvRela.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = lmWkRsql.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCPR + 20;
  }

  for (var i = gnInListCPR; i < lnFnList; i++) {
    if (gcSiOper == "iOS") {
      lcOnCont = "";
      //prettier-ignore
      lcBtMvto = 
              "<li>" +
                "<div class='block'>" +
                  "<div class='row'>" +
                    "<button class='col button button-fill' onclick='pesquisaCadastrosEstoquePedidoCompraCPR(\"" + escape(JSON.stringify(lmWkRsql[i])) + "\");'>mais informações</button>" +
                  "</div>" +
                "</div>" +
              "</li>";
    } else {
      //prettier-ignore
      lcOnCont =
        " oncontextmenu='pesquisaCadastrosEstoquePedidoCompraCPR(\"" + escape(JSON.stringify(lmWkRsql[i])) + "\");'";
      lcBtMvto = "";
    }

    //prettier-ignore
    lcWkRsql += 
      "<li id='lli" + lmWkRsql[i].id_pcom.toString().trim() + "CPR' class='accordion-item'>" +
        "<a href='#' class='item-content item-link'" + lcOnCont + ">" +
          "<div class='item-media' onclick='checkCPR(\"" + escape(JSON.stringify(lmWkRsql[i])) + "\", false);'>" + 
            "<label class='checkbox'> " +
              "<input id='chk" + lmWkRsql[i].id_pcom.toString().trim() + "CPR' type='checkbox' /> " +
              "<i class='icon-checkbox'></i> " +
            "</label>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + lmWkRsql[i].ca_nome.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + jsonDate(lmWkRsql[i].pc_dten) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              lcBtMvto +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>número da ordem de compra</div>" +
                    "<div class='item-after'>" + lmWkRsql[i].pc_nume.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data de lançamento</div>" +
                    "<div class='item-after'>" + jsonDate(lmWkRsql[i].pc_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data previsão de entrega</div>" +
                    "<div class='item-after'>" + jsonDate(lmWkRsql[i].pc_dtpe) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data de entrega</div>" +
                    "<div class='item-after'>" + jsonDate(lmWkRsql[i].pc_dten) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>fornecedor</div>" +
                    "<div class='item-after'>" + lmWkRsql[i].ca_nome.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>quantidade</div>" +
                    "<div class='item-after'>" + brDecimal(lmWkRsql[i].pc_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>valor</div>" +
                    "<div class='item-after'>" + brMoney(lmWkRsql[i].pc_tota) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>lançamento</div>" +
                    "<div class='item-after'>" + lmWkRsql[i].pc_user.trim().toUpperCase() + " " + jsonDate(lmWkRsql[i].pc_data) + " " + jsonHora(lmWkRsql[i].pc_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>aprovação</div>" +
                    "<div class='item-after'>" + lmWkRsql[i].ap_user.trim().toUpperCase() + " " + jsonDate(lmWkRsql[i].ap_data) + " " + jsonHora(lmWkRsql[i].ap_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li class='item-content item-input'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title item-label'>observação</div>" +
                  "<div class='item-input-wrap'>" +
                    "<textarea readonly>" + lmWkRsql[i].pc_obse.trim().toUpperCase() + "</textarea>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCPR = i;

  $("#uulPcomCPR").append(lcWkRsql);
}

function pesquisaPedidosCompraCPR() {
  var loDvAprv = document.getElementById("divAprvCPR");
  var loDvDprv = document.getElementById("divDprvCPR");
  var loDvRela = document.getElementById("divRelaCPR");
  var loSlParm = document.getElementById("sltParmCPR");
  var loDtDtde = document.getElementById("datDtdeCPR");
  var loDtDtat = document.getElementById("datDtatCPR");
  var loSlAprv = document.getElementById("sltAprvCPR");
  var loSlClie = document.getElementById("sltClieCPR");
  var loTxDeno = document.getElementById("txtDenoCPR");
  var loDvTota = document.getElementById("divTotaCPR");
  var loDvTqtd = document.getElementById("divTqtdCPR");
  var loDvLoad = document.getElementById("divLoadCPR");
  var lnApSitu = parseInt(loSlAprv.value),
    lnDvTota = 0,
    lnDvTqtd = 0,
    lnIdClie = null;
  var lcWkIsql = "",
    lcSlParm = loSlParm.value.toString().trim().toUpperCase(),
    lcDtDtde = null,
    lcDtDtat = null,
    lcPcDtde = null,
    lcPcDtat = null,
    lcPcDede = null,
    lcPcDeat = null,
    lcCeDeno = null;
  var lmWkIsql = [];

  if (loDtDtde.value.toString().trim().length > 0) {
    lcDtDtde = loDtDtde.value.toString().trim().toUpperCase();
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcDtDtat = loDtDtat.value.toString().trim().toUpperCase();
  }

  if (lcDtDtde != null && lcDtDtat != null) {
    if (htmlDataParaObjetoData(lcDtDtat) < htmlDataParaObjetoData(lcDtDtde)) {
      alerta("período inválido", "alerta");

      return;
    }
  }

  if (lcSlParm.trim().toUpperCase() == "PC_DATA") {
    lcPcDtde = lcDtDtde;
    lcPcDtat = lcDtDtat;
  }

  if (lcSlParm.trim().toUpperCase() == "PC_DTEN") {
    lcPcDede = lcDtDtde;
    lcPcDeat = lcDtDtat;
  }

  if (loSlClie.value > 0) {
    lnIdClie = parseInt(loSlClie.value);
  }

  if (loTxDeno.value.toString().trim().length > 0) {
    lcCeDeno = loTxDeno.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldPcDtde", pa_tipo: "SmallDateTime", pa_valo: lcPcDtde },
    { pa_nome: "ldPcDtat", pa_tipo: "SmallDateTime", pa_valo: lcPcDtat },
    { pa_nome: "ldPcDede", pa_tipo: "SmallDateTime", pa_valo: lcPcDede },
    { pa_nome: "ldPcDeat", pa_tipo: "SmallDateTime", pa_valo: lcPcDeat },
    { pa_nome: "lnApSitu", pa_tipo: "Int", pa_valo: lnApSitu },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcCeDeno", pa_tipo: "VarChar", pa_valo: lcCeDeno },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCPR();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaPedidosCompra",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          gmPcLctoCPR = lmWkRsql;

          if (lnApSitu == 1) {
            loDvAprv.style.display = "";
          } else if (lnApSitu == 2) {
            loDvDprv.style.display = "";
          }

          for (var i = 0; i < gmPcLctoCPR.length; i++) {
            lnDvTota += parseFloat(gmPcLctoCPR[i].pc_tota);
            lnDvTqtd += parseFloat(gmPcLctoCPR[i].pc_qtde);
          }

          loDvTota.innerHTML = brMoney(lnDvTota);
          loDvTqtd.innerHTML = brDecimal(lnDvTqtd);

          montaPedidosCompraCPR();

          loDvRela.onscroll = function () {
            if (
              loDvRela.scrollHeight -
                loDvRela.scrollTop -
                loDvRela.clientHeight <
              1
            ) {
              montaPedidosCompraCPR();
            }
          };
        }
      } catch (loWkErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function consultaSelectCPR(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  for (var i = 0; i < loObSlct.options.length; i++) {
    if (
      loObSlct.options[i].value.toString().trim().toUpperCase() ==
      loSlHtml.sl_valu.toString().trim().toUpperCase()
    ) {
      loObSlct.selectedIndex = i;

      loObSlct.onchange();

      break;
    }
  }
}

function pesquisaSelectCPR(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function pesquisaObrasCPR() {
  var loDvClie = document.getElementById("divClieCPR");
  var loSlClie = document.getElementById("sltClieCPR");
  var lcSlRsql = "<option value='0'>CARREGANDO OBRAS...</option>",
    lcWkIsql = "";
  var lmWkIsql = [],
    lmSlHtml = [];

  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvClie.style.display = "none";

  loSlClie.disabled = true;

  loSlClie.innerHTML = lcSlRsql;

  lcSlRsql = "<option value='0'>TODAS AS OBRAS</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObras",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loDvClie.style.display = "";

          loSlClie.disabled = false;

          for (var i = 0; i < lmWkRsql.length; i++) {
            lmSlHtml.push({
              id_slct: "sltClieCPR",
              sl_valu: lmWkRsql[i].id_clie.toString(),
              sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
              sl_titl: "pesquisa de obras",
            });

            //prettier-ignore
            lcSlRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
          }

          loDvClie.onclick = function () {
            pesquisaSelectCPR(lmSlHtml);
          };
        }
      } catch (loWkErro) {}

      loSlClie.innerHTML = lcSlRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlClie.innerHTML = lcSlRsql;
    },
  });
}

function limpaCamposCPR() {
  var loDvAprv = document.getElementById("divAprvCPR");
  var loDvDprv = document.getElementById("divDprvCPR");
  var loDvRela = document.getElementById("divRelaCPR");
  var loDvTota = document.getElementById("divTotaCPR");
  var loDvTqtd = document.getElementById("divTqtdCPR");
  var loDvSele = document.getElementById("divSeleCPR");
  var loDvSqtd = document.getElementById("divSqtdCPR");
  var loCbTodo = document.getElementById("chkTodoCPR");
  var loUlPcom = document.getElementById("uulPcomCPR");
  var loDvLoad = document.getElementById("divLoadCPR");

  gnInListCPR = 0;
  gmPcLctoCPR = [];

  loDvAprv.style.display = "none";
  loDvDprv.style.display = "none";

  loDvRela.onscroll = function () {};

  loDvTota.innerHTML = "";
  loDvTqtd.innerHTML = "";
  loDvSele.innerHTML = "";
  loDvSqtd.innerHTML = "";

  loCbTodo.checked = false;

  loUlPcom.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CpraPcRela() {
  var loDtDtde = document.getElementById("datDtdeCPR");
  var loDtDtat = document.getElementById("datDtatCPR");
  var loDvDica = document.getElementById("divDicaCPR");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposCPR();

  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setMonth(ldDtHoje.getMonth() - 1);

  loDtDtde.valueAsDate = ldDtHoje;

  if (isMobile()) {
    if (gcSiOper == "Android") {
      loDvDica.innerHTML =
        "clique e segure no pedido de compra para mais informações";
    }
  } else {
    loDvDica.innerHTML =
      "clique com o botão direito do mouse no pedido de compra para mais informações";
  }

  pesquisaObrasCPR();
  pesquisaPedidosCompraCPR();

  OkTecladoAndroid("txtDenoCPR");
}
