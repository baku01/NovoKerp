var gmWkRsqlCFR = [];
var gnInListCFR = 0;

function pesquisaAvaliacoesCFR(lcCdFunc) {
  var loCdFunc = JSON.parse(unescape(lcCdFunc));

  sessionStorage.setItem("soCdFunc", JSON.stringify(loCdFunc));

  redireciona("custom/gre/cadt/CadtCnAval.html", "CadtCnAval.html");
}

function montaFuncionariosCFR() {
  var loDvFunc = document.getElementById("divFuncCFR");
  var loDvLoad = document.getElementById("divLoadCFR");
  var lcWkRsql = "",
    lcFuReco = "",
    lcFuNota = "",
    lcFuNot1 = "";
  var lnFnList = 0;

  if (gnInListCFR + 20 >= gmWkRsqlCFR.length) {
    loDvFunc.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCFR.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCFR + 20;
  }

  for (var i = gnInListCFR; i < lnFnList; i++) {
    lcFuNota = "";
    lcFuNot1 = "";

    if (parseInt(gmWkRsqlCFR[i].fu_reco) > 1) {
      lcFuReco = "SIM";
    } else {
      lcFuReco = "NÃO";
    }

    if (parseFloat(gmWkRsqlCFR[i].fu_nota) >= 0) {
      lcFuNota = brDecimal(gmWkRsqlCFR[i].fu_nota);
      lcFuNot1 = "<b style='color: " + corTema() + "'>" + lcFuNota + "</b>";
      //prettier-ignore
      lcFuNot1 = 
        "<div class='item-media' onclick='pesquisaAvaliacoesCFR(\"" + escape(JSON.stringify(gmWkRsqlCFR[i])) + "\");'>" +
          "<b style='color: " + corTema() + "'>" + lcFuNota + "</b>" +  
        "</div>"
    }

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          lcFuNot1 +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmWkRsqlCFR[i].fu_nome.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + gmWkRsqlCFR[i].fu_func.trim().toUpperCase() + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>empresa</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].em_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>matrícula</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].id_matr.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>tipo</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>nome</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].fu_nome.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>cpf</div>" +
                    "<div class='item-after'>" + formataCpf(gmWkRsqlCFR[i].fu_ncpf) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>rg</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].fu_rgnu.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>função</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].fu_func.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>admissão</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlCFR[i].fu_dtad) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>rescisão</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlCFR[i].fu_drec) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>fim contrato experiência</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlCFR[i].fu_fcon) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>prorrogação</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlCFR[i].fu_dpro) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>recontratado</div>" +
                    "<div class='item-after'>" + lcFuReco + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>contratado para obra</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].dp_deno.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>última obra</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].ul_obra.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>status</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].sr_deno.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>indicação</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].fu_indi.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>salário</div>" +
                    "<div class='item-after'>" + brMoney(gmWkRsqlCFR[i].ff_sala) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>cidade</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].fu_cida.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>estado</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].fu_esta.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>celular</div>" +
                    "<div class='item-after'>" + gmWkRsqlCFR[i].fu_celu.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>nota última avaliação</div>" +
                    "<div class='item-after'>" + lcFuNota + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCFR = i;

  $("#uulFuncCFR").append(lcWkRsql);
}

function pesquisaFuncionariosDemitidosCFR() {
  var loDvFunc = document.getElementById("divFuncCFR");
  var loSlPesq = document.getElementById("sltPesqCFR");
  var loTxPesq = document.getElementById("txtPesqCFR");
  var loDvLoad = document.getElementById("divLoadCFR");
  var lcWkIsql = "",
    lcDrData = "",
    lcFuFunc = null,
    lcFuNome = null;
  var lnIdMatr = null;
  var lmWkIsql = [],
    lmFuFunc = app.smartSelect.get(".clsFuncCFR").getValue();
  var ldDtHoje = new Date();

  if (loTxPesq.value.toString().trim().length > 0) {
    if (loSlPesq.value.toString().trim().toUpperCase() == "ID_MATR") {
      try {
        if (parseInt(loTxPesq.value) > 0) {
          lnIdMatr = parseInt(loTxPesq.value);
        }
      } catch (error) {}

      if (lnIdMatr == null) {
        alerta("matrícula inválida", "alerta");

        limpaCamposCFR();

        return;
      }
    } else {
      lcFuNome = loTxPesq.value.toString().trim().toUpperCase();
    }
  }

  ldDtHoje.setHours(0, 0, 0, 0);

  lcDrData = objetoDataParaStringSqlData(ldDtHoje);

  try {
    if (lmFuFunc.length > 0) {
      lcFuFunc = "";

      for (var i = 0; i < lmFuFunc.length; i++) {
        lcFuFunc += lmFuFunc[i].trim().toUpperCase() + "|";
      }

      lcFuFunc = lcFuFunc.slice(0, -1);
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
    { pa_nome: "lcFuFunc", pa_tipo: "VarChar", pa_valo: lcFuFunc },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCFR();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFuncionariosDemitidos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlCFR = lmWkRsql;

      montaFuncionariosCFR();

      loDvFunc.onscroll = function () {
        if (
          loDvFunc.scrollHeight - loDvFunc.scrollTop - loDvFunc.clientHeight <
          1
        ) {
          montaFuncionariosCFR();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function pesquisaFuncoesCFR() {
  var loOgFunc = document.getElementById("ogrFuncCFR");
  var lcWkRsql = "",
    lcWkIsql = "",
    lcDrData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcDrData = objetoDataParaStringSqlData(ldDtHoje);

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFuncoes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].fu_func.trim().toUpperCase() + "'>" + lmWkRsql[i].fu_func.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loOgFunc.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loOgFunc.innerHTML = lcWkRsql;
    },
  });
}

function limpaCamposCFR() {
  var loDvFunc = document.getElementById("divFuncCFR");
  var loUlFunc = document.getElementById("uulFuncCFR");
  var loDvLoad = document.getElementById("divLoadCFR");

  gmWkRsqlCFR = [];
  gnInListCFR = 0;

  loDvFunc.onscroll = function () {};

  loUlFunc.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CadtFuRecr() {
  limpaCamposCFR();
  pesquisaFuncoesCFR();
  // pesquisaFuncionariosDemitidosCFR();

  OkTecladoAndroid("txtPesqCFR");
}
