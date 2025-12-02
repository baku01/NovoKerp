var gmWkRsqlCCA = [];
var goCdFuncCCA = {};
var gnInListCCA = 0;

function consultaAvaliacaoCCA(lcFuAval) {
  var loFuAval = JSON.parse(unescape(lcFuAval));

  sessionStorage.setItem("soFuAval", JSON.stringify(loFuAval));

  redireciona("custom/gre/cadt/CadtFuAval.html", "CadtFuAval.html");
}

function montaAvaliacoesCCA() {
  var loDvAval = document.getElementById("divAvalCCA");
  var loDvLoad = document.getElementById("divLoadCCA");
  var lcWkRsql = "";
  var lnFnList = 0,
    lnAvNota = 0;

  if (gnInListCCA + 20 >= gmWkRsqlCCA.length) {
    loDvAval.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCCA.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCCA + 20;
  }

  for (var i = gnInListCCA; i < lnFnList; i++) {
    lnAvNota =
      (parseFloat(gmWkRsqlCCA[i].av_orga) +
        parseFloat(gmWkRsqlCCA[i].av_prod) +
        parseFloat(gmWkRsqlCCA[i].av_qual) +
        parseFloat(gmWkRsqlCCA[i].av_disc) +
        parseFloat(gmWkRsqlCCA[i].av_falt) +
        parseFloat(gmWkRsqlCCA[i].av_celu) +
        parseFloat(gmWkRsqlCCA[i].av_aloj) +
        parseFloat(gmWkRsqlCCA[i].av_resc) +
        parseFloat(gmWkRsqlCCA[i].av_ferr)) /
      9;

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='consultaAvaliacaoCCA(\"" + escape(JSON.stringify(gmWkRsqlCCA[i])) + "\");'>" +
            "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmWkRsqlCCA[i].cl_fant.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + brDecimal(lnAvNota) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlCCA[i].av_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>obra</div>" +
                    "<div class='item-after'>" + gmWkRsqlCCA[i].cl_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>avaliador</div>" +
                    "<div class='item-after'>" + gmWkRsqlCCA[i].id_user.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>nota</div>" +
                    "<div class='item-after'>" + brDecimal(lnAvNota) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCCA = i;

  $("#uulAvalCCA").append(lcWkRsql);
}

function pesquisaAvaliacoesCCA() {
  var loDvAval = document.getElementById("divAvalCCA");
  var loDvLoad = document.getElementById("divLoadCCA");
  var lcWkIsql = "",
    lcFuNome = null;
  var lmWkIsql = [];

  try {
    if (parseInt(goCdFuncCCA.id_matr) > 0) {
      lcFuNome = goCdFuncCCA.fu_nome.trim().toUpperCase();
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldAvDtde", pa_tipo: "SmallDatetime", pa_valo: null },
    { pa_nome: "ldAvDtat", pa_tipo: "SmallDatetime", pa_valo: null },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCCA();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaAvaliacoes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlCCA = lmWkRsql;

      montaAvaliacoesCCA();

      loDvAval.onscroll = function () {
        if (
          loDvAval.scrollHeight - loDvAval.scrollTop - loDvAval.clientHeight <
          1
        ) {
          montaAvaliacoesCCA();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function limpaCamposCCA() {
  var loDvAval = document.getElementById("divAvalCCA");
  var loUlAval = document.getElementById("uulAvalCCA");
  var loDvLoad = document.getElementById("divLoadCCA");

  gmWkRsqlCCA = [];
  gnInListCCA = 0;

  loDvAval.onscroll = function () {};

  loUlAval.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CadtCnAval() {
  var loDvMatr = document.getElementById("divMatrCCA");
  var loDvNome = document.getElementById("divNomeCCA");
  var loDvFunc = document.getElementById("divFuncCCA");

  limpaCamposCCA();

  goCdFuncCCA = JSON.parse(sessionStorage.getItem("soCdFunc"));

  try {
    if (parseInt(goCdFuncCCA.id_matr) > 0) {
      sessionStorage.removeItem("soCdFunc");

      loDvMatr.innerHTML = goCdFuncCCA.id_matr.toString();
      loDvNome.innerHTML = goCdFuncCCA.fu_nome.trim().toUpperCase();
      loDvFunc.innerHTML = goCdFuncCCA.fu_func.trim().toUpperCase();

      pesquisaAvaliacoesCCA();
    }
  } catch (error) {}
}
