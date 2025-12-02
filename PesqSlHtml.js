var gmSlHtmlPSH = [],
  gmSlPesqPSH = [];
var gnInListPSH = 0;

function consultaPSH(lcWkRsql) {
  var loPgAnte = document.getElementsByClassName("page-previous");
  var lcPgAnte = loPgAnte[loPgAnte.length - 1].getAttribute("data-name");
  var loWkRsql = JSON.parse(unescape(lcWkRsql));

  window["consultaSelect" + lcPgAnte[0] + lcPgAnte[4] + lcPgAnte[6]](loWkRsql);

  goMnView.router.back();
}

function montaHtmlSelectPSH() {
  var loDvPesq = document.getElementById("divPesqPSH");
  var loDvLoad = document.getElementById("divLoadPSH");
  var lcWkRsql = "";
  var lnFnList = 0;

  if (gnInListPSH + 30 >= gmSlPesqPSH.length) {
    loDvPesq.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmSlPesqPSH.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListPSH + 30;
  }

  for (var i = gnInListPSH; i < lnFnList; i++) {
    //prettier-ignore
    lcWkRsql +=
      "<li>" +
        "<a href='#' onclick='consultaPSH(\"" + escape(JSON.stringify(gmSlPesqPSH[i])) + "\");'>" +
          "<b>" +
            gmSlPesqPSH[i].sl_text.trim().toUpperCase() +
          "</b>" +
        "</a>" +
      "</li>";
  }

  gnInListPSH = i;

  $("#uulSlctPSH").append(lcWkRsql);
}

function limpaCamposPSH() {
  var loDvPesq = document.getElementById("divPesqPSH");
  var loUlSlct = document.getElementById("uulSlctPSH");
  var loDvLoad = document.getElementById("divLoadPSH");

  gmSlPesqPSH = [];

  gnInListPSH = 0;

  loDvPesq.onscroll = function () {};

  loUlSlct.innerHTML = "";

  loDvLoad.style.display = "none";
}

function pesquisaPSH() {
  var loScPesq = document.getElementById("srcPesqPSH");
  var loDvPesq = document.getElementById("divPesqPSH");

  limpaCamposPSH();

  gmSlPesqPSH = JSON.parse(JSON.stringify(gmSlHtmlPSH));

  if (loScPesq.value.toString().trim().length > 0) {
    gmSlPesqPSH = gmSlPesqPSH.filter(function (loWkRsql) {
      return (
        loWkRsql.sl_text
          .toString()
          .trim()
          .toUpperCase()
          .indexOf(loScPesq.value.toString().trim().toUpperCase()) >= 0
      );
    });
  }

  montaHtmlSelectPSH();

  loDvPesq.onscroll = function () {
    if (
      loDvPesq.scrollHeight - loDvPesq.scrollTop - loDvPesq.clientHeight <
      1
    ) {
      montaHtmlSelectPSH();
    }
  };
}

function PesqSlHtml() {
  var loDvTitu = document.getElementById("divTituPSH");
  var lcSlTitl = "";

  try {
    gmSlHtmlPSH = JSON.parse(sessionStorage.getItem("smSlHtml"));

    if (gmSlHtmlPSH[0].sl_titl.trim().length > 0) {
      sessionStorage.removeItem("smSlHtml");

      lcSlTitl = gmSlHtmlPSH[0].sl_titl.trim().toLowerCase();

      loDvTitu.innerHTML = lcSlTitl;

      pesquisaPSH();
    }
  } catch (loApErro) {}

  if (lcSlTitl.trim().length == 0) {
    goMnView.router.back();
  }

  OkTecladoAndroid("srcPesqPSH");
}
