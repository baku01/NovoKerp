var gnInListCPM = 0;
var gmPcMvtoCPM = [],
  gmPcFiltCPM = [];
var goPcLctoCPM = {};

function filtraItensPedidoCompraCPM() {
  var loDvMvto = document.getElementById("divMvtoCPM");
  var loTxDeno = document.getElementById("txtDenoCPM");
  var loUlDmat = document.getElementById("uulCadtCPM");
  var lcCeDeno = "";

  gmPcFiltCPM = JSON.parse(JSON.stringify(gmPcMvtoCPM));

  if (loTxDeno.value.toString().trim().length > 0) {
    lcCeDeno = loTxDeno.value.toString().trim().toUpperCase();
  }

  if (lcCeDeno.trim().length > 0) {
    gmPcFiltCPM = gmPcFiltCPM.filter(function (loWkRsql) {
      return (
        (
          loWkRsql.id_sequ.toString() +
          loWkRsql.ce_codi.toString().trim().toUpperCase() +
          loWkRsql.pc_deno.toString().trim().toUpperCase() +
          loWkRsql.ce_deno.toString().trim().toUpperCase() +
          loWkRsql.pc_uncr.toString().trim().toUpperCase() +
          loWkRsql.cc_deno.toString().trim().toUpperCase()
        ).indexOf(lcCeDeno) >= 0
      );
    });
  }

  gnInListCPM = 0;

  loDvMvto.onscroll = function () {};

  loUlDmat.innerHTML = "";

  montaItensPedidoCompraCPR();

  loDvMvto.onscroll = function () {
    if (
      loDvMvto.scrollHeight - loDvMvto.scrollTop - loDvMvto.clientHeight <
      1
    ) {
      montaItensPedidoCompraCPR();
    }
  };
}

function desaprovaCPM(lcIdUser) {
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

  lcIdPcom = gmPcMvtoCPM[0].id_pcom.toString();

  if (lcIdPcom.trim().length == 0) {
    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "confirma desaprovação do pedido de compra ?",
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
                notificacao("pedido de compra desaprovado", "sucesso");

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

                goMnView.router.back();
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

function aprovaCPM(lcIdUser, lnUsFxde, lnUsFxat) {
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

  if (
    parseFloat(gmPcMvtoCPM[0].pc_tota) < parseFloat(lnUsFxde) ||
    parseFloat(gmPcMvtoCPM[0].pc_tota) > parseFloat(lnUsFxat)
  ) {
    alerta("ordem de compra não aprovada por motivo de alçada", "alerta");

    return;
  }

  lcIdPcom = gmPcMvtoCPM[0].id_pcom.toString();

  if (lcIdPcom.trim().length == 0) {
    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "confirma aprovação do pedido de compra ?",
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
                notificacao("pedido de compra aprovado", "sucesso");

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

                goMnView.router.back();
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

function paginaLiberaAprovacaoCPM(llPcAprv) {
  if (llPcAprv) {
    paginaLibera(
      "CPRAE",
      null,
      "aprovaCPM(lmWkRsql[0].id_user.trim().toUpperCase(), parseFloat(lmWkRsql[0].us_fxde), parseFloat(lmWkRsql[0].us_fxat));",
      "",
      "black"
    );
  } else {
    paginaLibera(
      "CPRAE",
      null,
      "desaprovaCPM(lmWkRsql[0].id_user.trim().toUpperCase());",
      "",
      "black"
    );
  }
}

function montaItensPedidoCompraCPR() {
  var loDvMvto = document.getElementById("divMvtoCPM");
  var loDvLoad = document.getElementById("divLoadCPM");
  var lcWkRsql = "",
    lcCeDeno = "";
  var lnFnList = 0,
    lnPcVpro = 0,
    lnPcVicm = 0,
    lnPcVipi = 0,
    lnPcTliq = 0;

  if (gnInListCPM + 20 >= gmPcFiltCPM.length) {
    loDvMvto.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmPcFiltCPM.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCPM + 20;
  }

  for (var i = gnInListCPM; i < lnFnList; i++) {
    if (gmPcFiltCPM[i].pc_deno.trim().length > 0) {
      lcCeDeno = gmPcFiltCPM[i].pc_deno.trim().toUpperCase();
    } else {
      lcCeDeno = gmPcFiltCPM[i].ce_deno.trim().toUpperCase();
    }

    lnPcVpro =
      parseFloat(gmPcFiltCPM[i].pc_qtde) * parseFloat(gmPcFiltCPM[i].pc_prun);
    lnPcVipi =
      ((parseFloat(gmPcFiltCPM[i].pc_qtde) *
        parseFloat(gmPcFiltCPM[i].pc_prun) -
        parseFloat(gmPcFiltCPM[i].pc_vdes)) *
        parseFloat(gmPcFiltCPM[i].pc_pipi)) /
      100;
    lnPcTliq = lnPcVpro + lnPcVipi - parseFloat(gmPcFiltCPM[i].pc_vdes);
    lnPcVicm =
      ((parseFloat(gmPcFiltCPM[i].pc_qtde) *
        parseFloat(gmPcFiltCPM[i].pc_prun) -
        parseFloat(gmPcFiltCPM[i].pc_vdes)) *
        parseFloat(gmPcFiltCPM[i].pc_picm)) /
      100;

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + lcCeDeno + "</b></div>" +
            "<div class='item-after'><b>" + gmPcFiltCPM[i].cc_deno.trim().toUpperCase() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>sequência</div>" +
                    "<div class='item-after'>" + gmPcFiltCPM[i].id_sequ.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>código</div>" +
                    "<div class='item-after'>" + gmPcFiltCPM[i].ce_codi.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>denominação</div>" +
                    "<div class='item-after'>" + lcCeDeno + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>unidade de compra</div>" +
                    "<div class='item-after'>" + gmPcFiltCPM[i].pc_uncr.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>quantidade</div>" +
                    "<div class='item-after'>" + brDecimal(gmPcFiltCPM[i].pc_qtde) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>preço unitário</div>" +
                    "<div class='item-after'>" + brMoney(gmPcFiltCPM[i].pc_prun) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>desconto</div>" +
                    "<div class='item-after'>" + brMoney(gmPcFiltCPM[i].pc_vdes) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>ipi</div>" +
                    "<div class='item-after'>" + brMoney(lnPcVipi) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>total líquido</div>" +
                    "<div class='item-after'>" + brMoney(lnPcTliq) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>icms</div>" +
                    "<div class='item-after'>" + brMoney(lnPcVicm) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>obra</div>" +
                    "<div class='item-after'>" + gmPcFiltCPM[i].cc_deno.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCPM = i;

  $("#uulCadtCPM").append(lcWkRsql);
}

function pesquisaItensPedidoCompraCPM() {
  var loDvAprv = document.getElementById("divAprvCPM");
  var loDvDprv = document.getElementById("divDprvCPM");
  var loDvMvto = document.getElementById("divMvtoCPM");
  var loDvUser = document.getElementById("divUserCPM");
  var loDvNume = document.getElementById("divNumeCPM");
  var loDvData = document.getElementById("divDataCPM");
  var loDvSitu = document.getElementById("divSituCPM");
  var loDvCodi = document.getElementById("divCodiCPM");
  var loDvNome = document.getElementById("divNomeCPM");
  var loDvCpgt = document.getElementById("divCpgtCPM");
  var loDvDtpe = document.getElementById("divDtpeCPM");
  var loDvDten = document.getElementById("divDtenCPM");
  var loTaObse = document.getElementById("txaObseCPM");
  var loDvTqtd = document.getElementById("divTqtdCPM");
  var loDvVpro = document.getElementById("divVproCPM");
  var loDvVipi = document.getElementById("divVipiCPM");
  var loDvTdes = document.getElementById("divTdesCPM");
  var loDvTliq = document.getElementById("divTliqCPM");
  var loDvVicm = document.getElementById("divVicmCPM");
  var loDvLoad = document.getElementById("divLoadCPM");
  var lnPcQtde = 0,
    lnIdPcom = 0,
    lnPcVicm = 0,
    lnPcVpro = 0,
    lnPcVipi = 0,
    lnPcVdes = 0;
  var lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(goPcLctoCPM.id_pcom) > 0) {
      lnIdPcom = parseInt(goPcLctoCPM.id_pcom);
    }
  } catch (error) {}

  if (lnIdPcom == 0) {
    return;
  }

  lmWkIsql = [{ pa_nome: "lnIdPcom", pa_tipo: "Int", pa_valo: lnIdPcom }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaItensPedidoCompra",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          gmPcMvtoCPM = lmWkRsql;

          if (
            gmPcMvtoCPM[0].ap_user.trim().length > 0 &&
            jsonDate(gmPcMvtoCPM[0].ap_data).trim().length > 0
          ) {
            loDvDprv.style.display = "";
          } else {
            loDvAprv.style.display = "";
          }

          loDvUser.innerHTML = gmPcMvtoCPM[0].pc_user.trim().toUpperCase();
          loDvNume.innerHTML = gmPcMvtoCPM[0].pc_nume.toString();
          loDvData.innerHTML = jsonDate(gmPcMvtoCPM[0].pc_data);
          loDvSitu.innerHTML = gmPcMvtoCPM[0].st_deno.trim().toUpperCase();
          loDvCodi.innerHTML = gmPcMvtoCPM[0].ca_codi.toString();
          loDvNome.innerHTML = gmPcMvtoCPM[0].ca_nome.trim().toUpperCase();
          loDvCpgt.innerHTML = gmPcMvtoCPM[0].cp_deno.trim().toUpperCase();
          loDvDtpe.innerHTML = jsonDate(gmPcMvtoCPM[0].pc_dtpe);
          loDvDten.innerHTML = jsonDate(gmPcMvtoCPM[0].pc_dten);

          loTaObse.value = gmPcMvtoCPM[0].pc_obse.trim().toUpperCase();

          for (var i = 0; i < gmPcMvtoCPM.length; i++) {
            lnPcQtde += parseFloat(gmPcMvtoCPM[i].pc_qtde);
            lnPcVpro +=
              parseFloat(gmPcMvtoCPM[i].pc_qtde) *
              parseFloat(gmPcMvtoCPM[i].pc_prun);
            lnPcVipi +=
              ((parseFloat(gmPcMvtoCPM[i].pc_qtde) *
                parseFloat(gmPcMvtoCPM[i].pc_prun) -
                parseFloat(gmPcMvtoCPM[i].pc_vdes)) *
                parseFloat(gmPcMvtoCPM[i].pc_pipi)) /
              100;
            lnPcVdes += parseFloat(gmPcMvtoCPM[i].pc_vdes);
            lnPcVicm +=
              ((parseFloat(gmPcMvtoCPM[i].pc_qtde) *
                parseFloat(gmPcMvtoCPM[i].pc_prun) -
                parseFloat(gmPcMvtoCPM[i].pc_vdes)) *
                parseFloat(gmPcMvtoCPM[i].pc_picm)) /
              100;
          }

          loDvTqtd.innerHTML = brDecimal(lnPcQtde);
          loDvVpro.innerHTML = brMoney(lnPcVpro);
          loDvVipi.innerHTML = brMoney(lnPcVipi);
          loDvTdes.innerHTML = brMoney(lnPcVdes);
          loDvTliq.innerHTML = brMoney(lnPcVpro + lnPcVipi - lnPcVdes);
          loDvVicm.innerHTML = brMoney(lnPcVicm);

          gmPcFiltCPM = JSON.parse(JSON.stringify(gmPcMvtoCPM));

          montaItensPedidoCompraCPR();

          loDvMvto.onscroll = function () {
            if (
              loDvMvto.scrollHeight -
                loDvMvto.scrollTop -
                loDvMvto.clientHeight <
              1
            ) {
              montaItensPedidoCompraCPR();
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

function consultaSelectCPM(loSlHtml) {
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

function pesquisaSelectCPM(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function limpaCamposCPM() {
  var loDvAprv = document.getElementById("divAprvCPM");
  var loDvDprv = document.getElementById("divDprvCPM");
  var loDvMvto = document.getElementById("divMvtoCPM");
  var loDvUser = document.getElementById("divUserCPM");
  var loDvNume = document.getElementById("divNumeCPM");
  var loDvData = document.getElementById("divDataCPM");
  var loDvSitu = document.getElementById("divSituCPM");
  var loDvCodi = document.getElementById("divCodiCPM");
  var loDvNome = document.getElementById("divNomeCPM");
  var loDvCpgt = document.getElementById("divCpgtCPM");
  var loDvDtpe = document.getElementById("divDtpeCPM");
  var loDvDten = document.getElementById("divDtenCPM");
  var loTaObse = document.getElementById("txaObseCPM");
  var loDvTqtd = document.getElementById("divTqtdCPM");
  var loDvVpro = document.getElementById("divVproCPM");
  var loDvVipi = document.getElementById("divVipiCPM");
  var loDvTdes = document.getElementById("divTdesCPM");
  var loDvTliq = document.getElementById("divTliqCPM");
  var loDvVicm = document.getElementById("divVicmCPM");
  var loUlDmat = document.getElementById("uulCadtCPM");
  var loDvLoad = document.getElementById("divLoadCPM");

  gnInListCPM = 0;
  gmPcMvtoCPM = [];
  gmPcFiltCPM = [];
  goPcLctoCPM = {};

  loDvAprv.style.display = "none";
  loDvDprv.style.display = "none";

  loDvMvto.onscroll = function () {};

  loDvUser.innerHTML = "";
  loDvNume.innerHTML = "";
  loDvData.innerHTML = "";
  loDvSitu.innerHTML = "";
  loDvCodi.innerHTML = "";
  loDvNome.innerHTML = "";
  loDvCpgt.innerHTML = "";
  loDvDtpe.innerHTML = "";
  loDvDten.innerHTML = "";

  loTaObse.value = "";

  loDvTqtd.innerHTML = "";
  loDvVpro.innerHTML = "";
  loDvVipi.innerHTML = "";
  loDvTdes.innerHTML = "";
  loDvTliq.innerHTML = "";
  loDvVicm.innerHTML = "";
  loUlDmat.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CpraPcMvto() {
  var loDvAprv = document.getElementById("divAprvCPM");
  var loDvDprv = document.getElementById("divDprvCPM");
  var loDvUser = document.getElementById("divUserCPM");
  var loDvNume = document.getElementById("divNumeCPM");
  var loDvData = document.getElementById("divDataCPM");
  var loDvSitu = document.getElementById("divSituCPM");
  var loDvCodi = document.getElementById("divCodiCPM");
  var loDvNome = document.getElementById("divNomeCPM");
  var loDvCpgt = document.getElementById("divCpgtCPM");
  var loDvDtpe = document.getElementById("divDtpeCPM");
  var loDvDten = document.getElementById("divDtenCPM");
  var loTaObse = document.getElementById("txaObseCPM");
  var loDvTqtd = document.getElementById("divTqtdCPM");
  var loDvTliq = document.getElementById("divTliqCPM");

  limpaCamposCPM();

  goPcLctoCPM = JSON.parse(sessionStorage.getItem("soPcLcto"));

  try {
    if (
      goPcLctoCPM.ap_user.trim().length > 0 &&
      jsonDate(goPcLctoCPM.ap_data).trim().length > 0
    ) {
      loDvDprv.style.display = "";
    } else {
      loDvAprv.style.display = "";
    }

    loDvUser.innerHTML = goPcLctoCPM.pc_user.trim().toUpperCase();
    loDvNume.innerHTML = goPcLctoCPM.pc_nume.toString();
    loDvData.innerHTML = jsonDate(goPcLctoCPM.pc_data);
    loDvSitu.innerHTML = goPcLctoCPM.st_deno.trim().toUpperCase();
    loDvCodi.innerHTML = goPcLctoCPM.ca_codi.toString();
    loDvNome.innerHTML = goPcLctoCPM.ca_nome.trim().toUpperCase();
    loDvCpgt.innerHTML = goPcLctoCPM.cp_deno.trim().toUpperCase();
    loDvDtpe.innerHTML = jsonDate(goPcLctoCPM.pc_dtpe);
    loDvDten.innerHTML = jsonDate(goPcLctoCPM.pc_dten);

    loTaObse.value = goPcLctoCPM.pc_obse.trim().toUpperCase();

    loDvTqtd.innerHTML = brDecimal(goPcLctoCPM.pc_qtde);
    loDvTliq.innerHTML = brMoney(goPcLctoCPM.pc_tota);
  } catch (error) {}

  pesquisaItensPedidoCompraCPM();

  OkTecladoAndroid("txtDenoCPM");
}
