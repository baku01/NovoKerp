var gmWkRsqlCTD = [];
var gnInListCTD = 0;

function consultaArquivoCTD(lcWkRsql, lnNrIndx) {
  var loWkRsql = JSON.parse(unescape(lcWkRsql)),
    loSlObra = document.getElementById("sltObraCTD");
  var lcArLink = "",
    lcPaNome = "",
    lcPtDrve = "";
  var loTpDocu = {};
  var lnPdLeft = screen.width / 2 - screen.availWidth / 2,
    lnPdTopp = screen.height / 2 - screen.availHeight / 2,
    lnIdClie = -1;

  try {
    if (gmWkRsqlCTD[lnNrIndx].ex_sdir.trim().length > 0) {
      lcPaNome = gmWkRsqlCTD[lnNrIndx].ex_sdir.trim();
    }
  } catch (error) {}

  if (lcPaNome.trim().length == 0) {
    return;
  }

  try {
    if (parseInt(loSlObra.value) >= 0) {
      lnIdClie = parseInt(loSlObra.value);
    }
  } catch (error) {}

  if (lnIdClie < 0) {
    lcPtDrve = "drive/geral";
  } else if (lnIdClie > 0) {
    lcPtDrve =
      "drive/obras/" + gcIdEmpr.trim().toLowerCase() + lnIdClie.toString();
  } else {
    lcPtDrve = "drive/usuarios/" + goCdUser.id_user.trim().toLowerCase();
  }

  lcArLink =
    "Docs/" +
    lcPtDrve +
    "/" +
    lcPaNome +
    "/" +
    loWkRsql.ex_sdir.trim().toUpperCase();

  if (isMobile()) {
    cordova.InAppBrowser.open(
      goCdUser.ws_wiis.trim() + lcArLink,
      "_system",
      "location=yes"
    );
  } else {
    loTpDocu = window.open(
      goCdUser.ws_wiis.trim() + lcArLink,
      loWkRsql.ex_sdir.trim(),
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        screen.availWidth +
        ", height=" +
        screen.availHeight +
        ", top=" +
        lnPdTopp +
        ", left=" +
        lnPdLeft
    );

    loTpDocu.focus();
  }
}

function pesquisaArquivosCTD(lcWkRsql, lnNrIndx) {
  var loWkRsql = JSON.parse(unescape(lcWkRsql)),
    loSlObra = document.getElementById("sltObraCTD"),
    loLiPast = document.getElementById("lliPst" + lnNrIndx.toString() + "CTD"),
    loUlPast = document.getElementById("uulPst" + lnNrIndx.toString() + "CTD");
  var lcWkIsql = "",
    lcExSdir = "",
    lcPtDocs = "";
  var lnIdClie = -1;
  var lmWkIsql = [];

  if (!loLiPast) {
    return;
  }

  if (!loUlPast) {
    return;
  }

  if (loUlPast.innerHTML.trim().length > 0) {
    return;
  }

  try {
    if (loWkRsql.ex_sdir.trim().length > 0) {
      lcExSdir = loWkRsql.ex_sdir.trim();
    }
  } catch (error) {}

  if (lcExSdir.trim().length == 0) {
    return;
  }

  try {
    if (parseInt(loSlObra.value) >= 0) {
      lnIdClie = parseInt(loSlObra.value);
    }
  } catch (error) {}

  if (lnIdClie < 0) {
    lcPtDocs = "drive/geral";
  } else if (lnIdClie > 0) {
    lcPtDocs =
      "drive/obras/" + gcIdEmpr.trim().toLowerCase() + lnIdClie.toString();
  } else {
    lcPtDocs = "drive/usuarios/" + goCdUser.id_user.trim().toLowerCase();
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcPtDocs", pa_tipo: "VarChar", pa_valo: lcPtDocs + "/" + lcExSdir },
    { pa_nome: "lnExFile", pa_tipo: "Int", pa_valo: 1 }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDocumentos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            //prettier-ignore
            loUlPast.innerHTML += 
              "<li>" +
                "<a href='#' class='item-link item-content' onclick='consultaArquivoCTD(\"" + escape(JSON.stringify(lmWkRsql[i])) + "\", " + lnNrIndx.toString() + ");'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>" + lmWkRsql[i].ex_sdir.trim() + "</div>" +
                    "<div class='item-after'></div>" +
                  "</div>" +
                "</a>" +
              "</li>";
          }

          app.accordion.toggle(loLiPast);
          app.accordion.toggle(loLiPast);
        }
      } catch (loWkErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function montaPastasCTD() {
  var loDvDrve = document.getElementById("divDrveCTD");
  var loDvLoad = document.getElementById("divLoadCTD");
  var lcWkRsql = "";
  var lnFnList = 0;

  if (gnInListCTD + 20 >= gmWkRsqlCTD.length) {
    loDvDrve.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCTD.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCTD + 20;
  }

  for (var i = gnInListCTD; i < lnFnList; i++) {
    //prettier-ignore
    lcWkRsql += 
      "<li id='lliPst" + i.toString() + "CTD' class='accordion-item'>" +
        "<a href='#' class='item-content item-link' onclick='pesquisaArquivosCTD(\"" + escape(JSON.stringify(gmWkRsqlCTD[i])) + "\", " + i.toString() + ");'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmWkRsqlCTD[i].ex_sdir.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b></b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul id='uulPst" + i.toString() + "CTD'></ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  $("#uulPastCTD").append(lcWkRsql);

  gnInListCTD = i;
}

function limpaCamposCTD() {
  var loDvDrve = document.getElementById("divDrveCTD");
  var loUlPast = document.getElementById("uulPastCTD");
  var loDvLoad = document.getElementById("divLoadCTD");

  gmWkRsqlCTD = [];

  gnInListCTD = 0;

  loDvDrve.onscroll = function () {};

  loUlPast.innerHTML = "";

  loDvLoad.style.display = "none";
}

function pesquisaPastasCTD() {
  var loSlObra = document.getElementById("sltObraCTD");
  var loDvDrve = document.getElementById("divDrveCTD");
  var loDvLoad = document.getElementById("divLoadCTD");
  var lnIdClie = -1;
  var lcPtDocu = "";

  limpaCamposCTD();

  try {
    if (parseInt(loSlObra.value) >= 0) {
      lnIdClie = parseInt(loSlObra.value);
    }
  } catch (error) {}

  if (lnIdClie < 0) {
    lcPtDocu = "drive/geral";
  } else if (lnIdClie > 0) {
    lcPtDocu =
      "drive/obras/" + gcIdEmpr.trim().toLowerCase() + lnIdClie.toString();
  } else {
    lcPtDocu = "drive/usuarios/" + goCdUser.id_user.trim().toLowerCase();
  }

  loDvLoad.style.display = "";

  $.ajax({
    url: goCdUser.ws_http.trim() + "pesquisaDocumentos?lcPtDocu=" + lcPtDocu,
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          gmWkRsqlCTD = lmWkRsql;

          montaPastasCTD();

          loDvDrve.onscroll = function () {
            if (
              loDvDrve.scrollHeight -
                loDvDrve.scrollTop -
                loDvDrve.clientHeight <
              1
            ) {
              montaPastasCTD();
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

function pesquisaObrasCTD() {
  var loSlObra = document.getElementById("sltObraCTD");
  var lcWkRsql =
      "<option value='-1'>DRIVE GERAL</option><option value='0'>MEU DRIVE</option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='-1'>CARREGANDO DRIVES...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObras",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlObra.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlObra.innerHTML = lcWkRsql;

      pesquisaPastasCTD();
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcWkRsql;

      pesquisaPastasCTD();
    },
  });
}

function ComlTbDrve() {
  pesquisaObrasCTD();
}
