var gcSiOper = "",
  gcIdEmpr = "",
  gcMbTken = "",
  gcMbWsrv = "";
var app = {},
  goMnView = {},
  goCdUser = JSON.parse(localStorage.getItem("soCdUser"));
var $$ = Dom7;

function framework7() {
  var lcSoTema = "";

  if (gcSiOper == "Android") {
    lcSoTema = "md";
  } else if (gcSiOper == "Browser") {
    lcSoTema = "aurora";
  } else {
    lcSoTema = "ios";
  }

  app = new Framework7({
    root: "#app",
    id: "br.com.ats.kerp",
    theme: lcSoTema,
    touch: {
      tapHold: true,
    },
    panel: {
      swipe: isMobile() ? "left" : "",
      swipeOnlyClose: gcSiOper == "iOS" ? true : false,
    },
    dialog: {
      buttonCancel: "cancelar",
      buttonOk: "ok",
    },
  });

  goMnView = app.views.create(".view-main", {
    stackPages: true,
  });
}

function inicializaAplicativo() {
  var loAhCadt = {};
  var lcPgAtua = "";

  gcMbTken =
    "pk.eyJ1IjoibWF0aGV1c2FtYXJhbnRlIiwiYSI6ImNrZGhwMGc5ZDJkcWgyd2pxOTNyNmtyazQifQ.ku2BSbgnuz2MTBuwnUabXw";
  gcMbWsrv = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

  if (isMobile()) {
    document.addEventListener(
      "backbutton",
      function () {
        try {
          lcPgAtua = document
            .getElementsByClassName("page-current")[0]
            .getAttribute("data-name");

          if (lcPgAtua.trim() == "LginUsKerp") {
            navigator.app.exitApp();
          } else if (lcPgAtua.trim() == "TelaPdKerp") {
            saiTPK();
          } else if (lcPgAtua.trim() == "TelaPdIcon") {
            saiTPK();
          } else if (lcPgAtua.trim() == "CadtCdClie") {
            loAhCadt = document.getElementById("ahrCadtCCC");

            if (loAhCadt.classList.contains("tab-link-active")) {
              goMnView.router.back();
            } else {
              app.tab.show("#divCadtCCC");
            }
          } else if (lcPgAtua.trim() == "VndaPeMvto") {
            try {
              adicionaProdutoDbiVPM();
            } catch (error) {}

            goMnView.router.back();
          } else if (lcPgAtua.trim() != "ExpePeMvto") {
            goMnView.router.back();
          }

          app.actions.close();
        } catch (loApErro) {}
      },
      false
    );
  }

  try {
    if (app.id.toString().trim() == "br.com.ats.kerp") {
    } else {
      framework7();
    }
  } catch (error) {
    framework7();
  }
}

function isMobile() {
  var llIsMobi = false;

  try {
    gcSiOper = device.platform;

    if (gcSiOper == "iOS" || gcSiOper == "Android") {
      return true;
    } else {
      return false;
    }
  } catch (loApErro) {
    llIsMobi =
      document.URL.indexOf("http://") === -1 &&
      document.URL.indexOf("https://") === -1;

    if (llIsMobi) {
      gcSiOper = "Android";

      return true;
    } else {
      gcSiOper = "Browser";

      return false;
    }
  }
}

function redireciona(lcCmTela, lcNmTela) {
  var lcTlAtua = "";
  var lmTlHist = [];
  var llTlHist = false;

  lcNmTela = lcNmTela.replace(".html", "");

  consultaEndereco("insereLocalizacao");

  $.ajax({
    type: "GET",
    url: lcCmTela,
    success: function (lcTlHtml) {
      try {
        lcTlAtua = document
          .getElementsByClassName("page-current")[0]
          .getAttribute("data-name");
      } catch (error) {}

      try {
        lmTlHist = document.getElementsByClassName("page page-previous");
      } catch (error) {}

      if (lcNmTela != lcTlAtua) {
        for (var i = 0; i < lmTlHist.length; i++) {
          if (lcNmTela == lmTlHist[i].getAttribute("data-name")) {
            lmTlHist[i].remove();

            goMnView.router.history.splice(i, 1);

            llTlHist = true;

            break;
          }
        }

        if (!llTlHist) {
          goMnView.routes.push({
            path: "/" + lcNmTela + "/",
            content: lcTlHtml,
          });
        }

        goMnView.router.navigate("/" + lcNmTela + "/");

        try {
          window[lcNmTela]();
        } catch (loApErro) {
          app.dialog.preloader("aguarde...");

          setTimeout(function () {
            try {
              window[lcNmTela]();
            } catch (loApErro) {}

            app.dialog.close();
          }, 500);
        }
      }
    },
    error: function (xhr, status, error) {
      alert(xhr + status + error);
    },
  });
}

$(document).ajaxSend(function (event, request, settings) {
  app.preloader.show();
});

$(document).ajaxComplete(function (event, request, settings) {
  app.preloader.hide();
});

$.ajaxSetup({
  cache: false,
});

function OkTecladoAndroid(lcTxFocu) {
  $("#" + lcTxFocu).on("keyup", function (e) {
    var theEvent = e || window.event;
    var keyPressed = theEvent.keyCode || theEvent.which;
    if (keyPressed == 13) {
      document.getElementById(lcTxFocu).blur();
    }
    return true;
  });
}

function OkTecladoAndroid2(lcTxAtua, lcTxFocu) {
  $("#" + lcTxAtua).on("keyup", function (e) {
    var theEvent = e || window.event;
    var keyPressed = theEvent.keyCode || theEvent.which;
    if (keyPressed == 13) {
      document.getElementById(lcTxFocu).focus();
    }
    return true;
  });
}

function OkTecladoAndroid3(lcTxAtua, lcTxFocu, lcAhClic) {
  $("#" + lcTxAtua).on("keyup", function (e) {
    var theEvent = e || window.event;
    var keyPressed = theEvent.keyCode || theEvent.which;
    if (keyPressed == 13) {
      document.getElementById(lcTxFocu).focus();

      if (typeof document.getElementById(lcAhClic).onclick == "function") {
        document
          .getElementById(lcAhClic)
          .onclick.apply(document.getElementById(lcAhClic));
      }
    }
    return true;
  });
}

function escondeDataZerada(lcWkData) {
  if (lcWkData == "01/01/1900" || lcWkData == null) {
    return "";
  } else {
    return lcWkData.toString().trim();
  }
}

function jsonDate(lcJsDate) {
  try {
    return escondeDataZerada(
      objetoDataParaStringData(
        new Date(lcJsDate.replace(/-/g, "/").replace(/T.+/, ""))
      )
    );
  } catch (e) {
    return "";
  }
}

function escondeHoraZerada(lcWkHora) {
  if (lcWkHora == "00:00:00" || lcWkHora == null) {
    return "";
  } else {
    return lcWkHora.toString().trim();
  }
}

function jsonHora(lcJsData) {
  if (lcJsData == null) {
    return "";
  }

  try {
    var lmJsData = lcJsData.split("T");

    if (lmJsData.length > 1) {
      var t = (lmJsData[0] + " " + lmJsData[1]).split(/[- :]/);
      var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5].substring(0, 2));
      var ldFuDate = new Date(d);
    } else {
      var ldFuDate = new Date(lcJsData.replace(/-/g, "/").replace(/T.+/, ""));
    }

    var lcBrHora =
      ("00" + ldFuDate.getHours().toString()).slice(-2) +
      ":" +
      ("00" + ldFuDate.getMinutes().toString()).slice(-2) +
      ":" +
      ("00" + ldFuDate.getSeconds().toString()).slice(-2);

    return escondeHoraZerada(lcBrHora);
  } catch (e) {
    return "";
  }
}

function objetoDataParaStringData(ldWkData) {
  var lnWkDias = ldWkData.getDate(),
    lnWkMese = ldWkData.getMonth() + 1;
  var lcWkDias = "",
    lcWkMese = "",
    lcWkAnos = ldWkData.getFullYear().toString().trim();

  if (lnWkDias < 10) {
    lcWkDias = "0" + lnWkDias.toString().trim();
  } else {
    lcWkDias = lnWkDias.toString().trim();
  }

  if (lnWkMese < 10) {
    lcWkMese = "0" + lnWkMese.toString().trim();
  } else {
    lcWkMese = lnWkMese.toString().trim();
  }

  return lcWkDias + "/" + lcWkMese + "/" + lcWkAnos;
}

function stringDataParaObjetoData(lcWkData) {
  var lmWkData = [];
  var ldDtData = new Date(1900, 0, 1, 0, 0, 0, 0);

  try {
    lmWkData = lcWkData.split("/");
    ldDtData = new Date(lmWkData[2], lmWkData[1] - 1, lmWkData[0]);
  } catch (error) {}

  return ldDtData;
}

function objetoDataParaStringSqlData(ldWkData) {
  var lcWkData = objetoDataParaStringData(ldWkData);
  var lmWkData = lcWkData.split("/");

  return (
    lmWkData[2] +
    lmWkData[1] +
    lmWkData[0] +
    " " +
    ldWkData.getHours() +
    ":" +
    ldWkData.getMinutes() +
    ":" +
    ldWkData.getSeconds()
  );
}

function formataCpf(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.trim().replace(/[^\d]/g, "");

  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formataCnpj(lcWkCnpj) {
  if (lcWkCnpj.trim().length == 0) {
    return "";
  } else {
    lcWkCnpj = lcWkCnpj.trim().replace(/[^\d]+/g, "");

    return (
      lcWkCnpj.substring(0, 2) +
      "." +
      lcWkCnpj.substring(2, 5) +
      "." +
      lcWkCnpj.substring(5, 8) +
      "/" +
      lcWkCnpj.substring(8, 12) +
      "-" +
      lcWkCnpj.substring(12)
    );
  }
}

function formataTelefone(lcStFone) {
  try {
    if (lcStFone.trim().length == 0) {
      return "";
    } else {
      lcStFone = lcStFone.trim().replace(/[^\d]+/g, "");

      return (
        "( " +
        lcStFone.substr(0, 2) +
        " )" +
        lcStFone.substr(2, 4) +
        "-" +
        lcStFone.substr(6, 4)
      );
    }
  } catch (error) {
    return "";
  }
}

function formataCelular(lcStCelu) {
  try {
    if (lcStCelu.trim().length == 0) {
      return "";
    } else {
      lcStCelu = lcStCelu.trim().replace(/[^\d]+/g, "");

      return (
        "( " +
        lcStCelu.substr(0, 2) +
        " )" +
        lcStCelu.substr(2, 1) +
        " " +
        lcStCelu.substr(3, 4) +
        "-" +
        lcStCelu.substr(7, 4)
      );
    }
  } catch (error) {
    return "";
  }
}

function validaCnpj(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj == "") {
    return true;
  }

  if (cnpj.length != 14) {
    return false;
  }

  // LINHA 10 - Elimina CNPJs invalidos conhecidos
  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  ) {
    return false;
  } // LINHA 21

  // Valida DVs LINHA 23 -
  tamanho = cnpj.length - 2;
  numeros = cnpj.substring(0, tamanho);
  digitos = cnpj.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado != digitos.charAt(1)) {
    return false;
  } // LINHA 49

  return true; // LINHA 51
}

function validaCpf(strCPF) {
  var Soma;
  var Resto;
  Soma = 0;

  strCPF = strCPF.replace(/[^\d]+/g, "");

  if (strCPF == "") {
    return true;
  }

  if (strCPF == "00000000000" || strCPF.length > 11) {
    return false;
  }

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(9, 10))) {
    return false;
  }

  Soma = 0;

  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(10, 11))) {
    return false;
  }

  return true;
}

function validaEmail(lcWkMail) {
  if (lcWkMail.trim() == "") {
    return true;
  }

  var loReStrg =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  return loReStrg.test(lcWkMail);
}

function brMoney(v) {
  if (isNaN(v)) {
    v = 0;
  }

  v = Math.round((v - 0) * 100) / 100;
  v =
    v == Math.floor(v) ? v + ".00" : v * 10 == Math.floor(v * 10) ? v + "0" : v;
  v = String(v);

  var ps = v.split(".");
  var whole = ps[0];
  var sub = ps[1] ? "," + ps[1] : ",00";
  var r = /(\d+)(\d{3})/;

  while (r.test(whole)) {
    whole = whole.replace(r, "$1" + "." + "$2");
  }

  v = whole + sub;

  if (v.charAt(0) == "-") {
    return "-R$" + v.substr(1);
  }

  return "R$ " + v;
}

function escondeNegativos(lnNrNega) {
  if (lnNrNega < 1) {
    return "";
  } else {
    return lnNrNega.toString().trim();
  }
}

function corBotaoAlerta() {
  if (gcSiOper == "Browser") {
    return corTema();
  } else {
    return corTema();
  }
}

function alerta(lcAlText, lcAlTitu) {
  app.dialog
    .create({
      title: lcAlTitu,
      text: lcAlText,
      buttons: [
        {
          text: "ok",
          color: corBotaoAlerta(),
        },
      ],
    })
    .open();
}

function htmlDataParaObjetoData(lcWkData) {
  if (lcWkData.trim() == "") {
    return new Date(1900, 0, 1, 0, 0, 0, 0);
  }

  return new Date(lcWkData.replace(/-/g, "/").replace("T", " "));
}

function notificacao(lcNtText, lcNtTitu) {
  app.notification
    .create({
      icon: "<img src='img/favicon-16x16.png' />",
      title: lcNtTitu,
      text: lcNtText,
      closeOnClick: true,
      closeTimeout: 5000,
    })
    .open();
}

function consultaLatLng(lcMpEnde, lcPaFunc) {
  var lcMpLtlg = "";
  var loMpLtlg = {
    mp_lati: "",
    mp_long: "",
  };

  $.ajax({
    url:
      gcMbWsrv.trim().toLowerCase() +
      lcMpEnde +
      ".json?access_token=" +
      gcMbTken,
    type: "GET",
    dataType: "json",

    success: function (loWkRsql) {
      try {
        try {
          if (!isNaN(loWkRsql.features[0].center[1])) {
            loMpLtlg.mp_lati = loWkRsql.features[0].center[1].toString().trim();
          }
        } catch (error) {}

        try {
          if (!isNaN(loWkRsql.features[0].center[0])) {
            loMpLtlg.mp_long = loWkRsql.features[0].center[0].toString().trim();
          }
        } catch (error) {}

        lcMpLtlg = escape(JSON.stringify(loMpLtlg));
      } catch (loApErro) {}

      eval(lcPaFunc + "('" + lcMpLtlg + "');");
    },
    error: function (jqXHR, textStatus, err) {
      lcMpLtlg = escape(JSON.stringify(loMpLtlg));

      eval(lcPaFunc + "('" + lcMpLtlg + "');");
    },
  });
}

function consultaEndereco(lcPaFunc) {
  var lcMpEnde = "";
  var loMpEnde = {
    mp_ende: "",
    mp_nume: "",
    mp_bair: "",
    mp_cida: "",
    mp_esta: "",
    mp_ncep: "",
    mp_lati: "",
    mp_long: "",
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (loMpLoca) {
        loMpEnde.mp_lati = loMpLoca.coords.latitude.toString().trim();
        loMpEnde.mp_long = loMpLoca.coords.longitude.toString().trim();

        $.ajax({
          url:
            gcMbWsrv.trim().toLowerCase() +
            loMpEnde.mp_long +
            "," +
            loMpEnde.mp_lati +
            ".json?access_token=" +
            gcMbTken,
          type: "GET",
          dataType: "json",

          success: function (loWkRsql) {
            //prettier-ignore
            try {
              for (var i = 0; i < loWkRsql.features.length; i++) {
                if (loWkRsql.features[i].id.indexOf("address") > -1) {
                  try {
                    if (loWkRsql.features[i].text.toString().trim().split(",")[0].toString().trim().length > 0) {
                      loMpEnde.mp_ende = loWkRsql.features[i].text.toString().trim().split(",")[0].toString().trim();
                    }
                  } catch (error) {}
                  
                  try {
                    if (loWkRsql.features[i].text.toString().trim().split(",")[1].toString().trim().length > 0) {
                      loMpEnde.mp_nume = loWkRsql.features[i].text.toString().trim().split(",")[1].toString().trim();
                    }
                  } catch (error) {}
                }
                
                if (loWkRsql.features[i].id.indexOf("neighborhood") > -1) {
                  try {
                    if (loWkRsql.features[i].text.toString().trim().length > 0) {
                      loMpEnde.mp_bair = loWkRsql.features[i].text.toString().trim();
                    }
                  } catch (error) {}
                }
                
                if (loWkRsql.features[i].id.indexOf("place") > -1) {
                  try {
                    if (loWkRsql.features[i].text.toString().trim().length > 0) {
                      loMpEnde.mp_cida = loWkRsql.features[i].text.toString().trim();
                    }
                  } catch (error) {}
                }
                
                if (loWkRsql.features[i].id.indexOf("region") > -1) {
                  try {
                    if (loWkRsql.features[i].text.toString().trim().length > 0) {
                      loMpEnde.mp_esta = loWkRsql.features[i].properties.short_code.replace("BR-", "").toString().trim();
                    }
                  } catch (error) {}
                }
                
                if (loWkRsql.features[i].id.indexOf("postcode") > -1) {
                  try {
                    if (loWkRsql.features[i].text.toString().trim().length > 0) {
                      loMpEnde.mp_ncep = loWkRsql.features[i].text.toString().trim();
                    }
                  } catch (error) {}
                }
              }

              lcMpEnde = escape(JSON.stringify(loMpEnde));
            } catch (loApErro) {}

            eval(lcPaFunc + "('" + lcMpEnde + "');");
          },
          error: function (jqXHR, textStatus, err) {
            lcMpEnde = escape(JSON.stringify(loMpEnde));

            eval(lcPaFunc + "('" + lcMpEnde + "');");
          },
        });
      },
      function (error) {
        lcMpEnde = escape(JSON.stringify(loMpEnde));

        eval(lcPaFunc + "('" + lcMpEnde + "');");
      },
      { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true }
    );
  } else {
    lcMpEnde = escape(JSON.stringify(loMpEnde));

    eval(lcPaFunc + "('" + lcMpEnde + "');");
  }
}

function insereLocalizacao(lcMpEnde) {
  var lcWkIsql = "";
  var lmWkIsql = [];
  var loMpEnde = JSON.parse(unescape(lcMpEnde));

  try {
    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
      { pa_nome: "lcMpLati", pa_tipo: "VarChar", pa_valo: loMpEnde.mp_lati },
      { pa_nome: "lcMpLong", pa_tipo: "VarChar", pa_valo: loMpEnde.mp_long },
      { pa_nome: "lcMpEnde", pa_tipo: "VarChar", pa_valo: loMpEnde.mp_ende.toUpperCase() },
      { pa_nome: "lcMpNume", pa_tipo: "VarChar", pa_valo: loMpEnde.mp_nume.toUpperCase() },
      { pa_nome: "lcMpCida", pa_tipo: "VarChar", pa_valo: loMpEnde.mp_cida.toUpperCase() },
      { pa_nome: "lcMpEsta", pa_tipo: "VarChar", pa_valo: loMpEnde.mp_esta.toUpperCase() },
      { pa_nome: "lcMpNcep", pa_tipo: "VarChar", pa_valo: loMpEnde.mp_ncep.replace(/[^\d]+/g, "") }
    ];

    lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

    $.ajax({
      url:
        goCdUser.ws_http.trim() +
        "chamadaProcedure?lcWkIsql=" +
        lcWkIsql +
        "&lcWkProc=insereLocalizacao",
      type: "GET",
      dataType: "jsonp",

      success: function (lmWkRsql) {},
      error: function (jqXHR, textStatus, err) {},
    });
  } catch (loApErro) {}
}

function brDecimal4(v) {
  v = Math.round((v - 0) * 1000) / 1000;
  v =
    v == Math.floor(v)
      ? v + ".0000"
      : v * 10 == Math.floor(v * 10)
      ? v + "0"
      : v;
  v = String(v);

  var ps = v.split(".");
  var whole = ps[0];
  var sub = ps[1] ? "," + ps[1] : ",0000";
  var r = /(\d+)(\d{3})/;

  while (r.test(whole)) {
    whole = whole.replace(r, "$1" + "." + "$2");
  }

  v = whole + sub;

  if (v.charAt(0) == "-") {
    return "-" + v.substr(1);
  }

  return v;
}

function brDecimal3(v) {
  v = Math.round((v - 0) * 1000) / 1000;
  v =
    v == Math.floor(v)
      ? v + ".000"
      : v * 10 == Math.floor(v * 10)
      ? v + "0"
      : v;
  v = String(v);

  var ps = v.split(".");
  var whole = ps[0];
  var sub = ps[1] ? "," + ps[1] : ",000";
  var r = /(\d+)(\d{3})/;

  while (r.test(whole)) {
    whole = whole.replace(r, "$1" + "." + "$2");
  }

  v = whole + sub;

  if (v.charAt(0) == "-") {
    return "-" + v.substr(1);
  }

  return v;
}

function toDecimal(lnToDeci) {
  var lcToDeci = brDecimal(lnToDeci);

  return parseFloat(lcToDeci.split(".").join("").replace(",", "."));
}

function brDecimal(v) {
  v = Math.round((v - 0) * 100) / 100;
  v =
    v == Math.floor(v) ? v + ".00" : v * 10 == Math.floor(v * 10) ? v + "0" : v;
  v = String(v);

  var ps = v.split(".");
  var whole = ps[0];
  var sub = ps[1] ? "," + ps[1] : ",00";
  var r = /(\d+)(\d{3})/;

  while (r.test(whole)) {
    whole = whole.replace(r, "$1" + "." + "$2");
  }

  v = whole + sub;

  if (v.charAt(0) == "-") {
    return "-" + v.substr(1);
  }

  return v;
}

function formataCep(lcWkNcep) {
  if (lcWkNcep.trim().length == 0) {
    return "";
  } else {
    lcWkNcep = lcWkNcep.trim().replace(/[^\d]+/g, "");

    return lcWkNcep.substring(0, 5) + "-" + lcWkNcep.substring(5);
  }
}

function validaCep(lcWkNcep) {
  lcWkNcep = lcWkNcep
    .toString()
    .trim()
    .replace(/[^\d]+/g, "");

  if (lcWkNcep == "") {
    return true;
  }

  if (lcWkNcep.length != 8) {
    return false;
  }

  return true;
}

function adicionaMarkers(loApMapa, lmMpMrks) {
  var lmMpBnds = [];

  lmMpMrks.map(function (loMpOptn) {
    lmMpBnds.push(loMpOptn.position);
    return loApMapa.addMarker(loMpOptn, clickMarker);
  });
}

function aplicativoMapa(lcGmLati, lcGmLong) {
  if (lcGmLati.length > 0 && lcGmLong.length > 0) {
    app.dialog
      .create({
        title: "alerta",
        text: "abrir no aplicativo de mapa ?",
        buttons: [
          {
            text: "cancelar",
            color: corBotaoAlerta(),
          },
          {
            text: "ok",
            color: corBotaoAlerta(),
            onClick: function () {
              if (gcSiOper == "Android") {
                window.open("geo:0,0?q=" + lcGmLati + "," + lcGmLong);
              } else if (gcSiOper == "iOS") {
                window.open(
                  "http://maps.apple.com/?q=" + lcGmLati + "," + lcGmLong,
                  "_system"
                );
              } else {
                window.open(
                  "http://maps.google.com/?q=" + lcGmLati + "," + lcGmLong,
                  "_system"
                );
              }
            },
          },
        ],
      })
      .open();
  }
}

function discador(lcNrFone) {
  try {
    lcNrFone = lcNrFone
      .trim()
      .toUpperCase()
      .replace(/[^\d]+/g, "");

    if (lcNrFone.trim().length == 0) {
      alerta("número de telefone inválido", "alerta");

      return;
    }

    window.location.href = "tel://" + lcNrFone;
  } catch (error) {}
}

function corTema() {
  var loSlEmpr = document.getElementById("sltEmprTPK");
  var lcEmClor = "#00FF90";

  try {
    //prettier-ignore
    lcEmClor = loSlEmpr.value.toString().split("/")[1].trim().toUpperCase();
  } catch (error) {}

  return lcEmClor;
}

function diasEntreDatas(ldDtDtde, ldDtDtat) {
  var lnMsUdia = 24 * 60 * 60 * 1000;

  return Math.round((ldDtDtat - ldDtDtde) / lnMsUdia);
}

function atualizaToken(lcUsTken) {
  var lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcUsTken", pa_tipo: "VarChar", pa_valo: lcUsTken }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaToken",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {},
    error: function (jqXHR, textStatus, err) {},
  });
}

function push(lcIdUser, lcPuTitu, lcPuMsgm) {
  var lcWkIsql = "",
    lcEnPush = "";
  var lmWkIsql = [];
  var loEnPush = {
    id_proj: "kerp",
    pu_titu: lcPuTitu,
    pu_msgm: lcPuMsgm,
  };

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));
  lcEnPush = encodeURIComponent(JSON.stringify(loEnPush));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "enviaPush?lcWkIsql=" +
      lcWkIsql +
      "&lcEnPush=" +
      lcEnPush,
    type: "GET",
    dataType: "jsonp",

    success: function (loWkRsql) {},
    error: function (jqXHR, textStatus, err) {},
  });
}

function base64ParaBlob(lo64Base, lcArTipo, lnSlSize) {
  var loBtChar = atob(lo64Base);
  var lmAsByte = [],
    lmSlBtch = [],
    lmNrByte = [],
    lmArByte = [];

  lcArTipo = lcArTipo || "";
  lnSlSize = lnSlSize || 512;

  for (var j = 0; j < loBtChar.length; j += lnSlSize) {
    lmSlBtch = loBtChar.slice(j, j + lnSlSize);

    lmNrByte = new Array(lmSlBtch.length);

    for (var i = 0; i < lmSlBtch.length; i++) {
      lmNrByte[i] = lmSlBtch.charCodeAt(i);
    }

    lmArByte = new Uint8Array(lmNrByte);

    lmAsByte.push(lmArByte);
  }

  return new Blob(lmAsByte, { type: lcArTipo });
}

function base64ParaPdf(lcArNome, lo64Base, lcArTipo, lcPdDesc, lcPdTitu) {
  var lcFdPath = "";

  window.requestFileSystem(
    LocalFileSystem.TEMPORARY,
    0,
    function (loWkDire) {
      lcFdPath = loWkDire.root.toURL();

      loWkDire.root.getFile(
        lcArNome,
        { create: true, exclusive: false },
        function (loWkFile) {
          loWkFile.createWriter(
            function (loWrFile) {
              loWrFile.write(base64ParaBlob(lo64Base, lcArTipo));

              window.plugins.socialsharing.share(
                lcPdDesc,
                lcPdTitu,
                lcFdPath + lcArNome
              );

              app.dialog.close();
            },
            function () {
              alerta(
                "não foi possível salvar o arquivo no caminho " +
                  lcFdPath +
                  " do seu celular",
                "alerta"
              );

              app.dialog.close();
            }
          );
        },
        function (loApErro) {
          app.dialog.close();
        }
      );
    },
    function (loApErro) {
      app.dialog.close();
    }
  );
}

function doceBrinquedoPdf(loPeLcto, lmPeMvto, lmCdCont) {
  var ldDtHoje = new Date();
  var lcPdHtml = "",
    lcClCnpj = "",
    lcClInsc = "",
    lcPeCfob = "",
    lcCpMail = "",
    lcFdMail = "",
    lcPeMvto = "",
    lcPrTipo = "",
    lcPrCbar = "",
    lcReCbar = "",
    lcDpCbar = "",
    lcMpDesc = "";
  var lnCtPven = 0,
    lnCtVdes = 0,
    lnCtPdes = 0,
    lnNcPipi = 0;
  var llMpDesc = false;

  if (parseInt(loPeLcto.cl_pfpj) == 1) {
    lcClCnpj = formataCpf(loPeLcto.cl_ncpf);
    lcClInsc = loPeLcto.cl_nrrg.trim().toUpperCase();
  } else {
    lcClCnpj = formataCnpj(loPeLcto.cl_cnpj);
    lcClInsc = loPeLcto.cl_insc.trim().toUpperCase();
  }

  if (parseInt(loPeLcto.pe_fret) > 1) {
    lcPeCfob = "FOB";
  } else {
    lcPeCfob = "CIF";
  }

  for (var i = 0; i < lmCdCont.length; i++) {
    if (
      parseInt(lmCdCont[i].id_tpco) == 6 &&
      lmCdCont[i].co_mail.trim().length > 0 &&
      lcCpMail.trim().length == 0
    ) {
      lcCpMail = lmCdCont[i].co_mail.trim().toLowerCase();
    }

    if (
      parseInt(lmCdCont[i].id_tpco) == 2 &&
      lmCdCont[i].co_mail.trim().length > 0 &&
      lcFdMail.trim().length == 0
    ) {
      lcFdMail = lmCdCont[i].co_mail.trim().toLowerCase();
    }
  }

  if (parseFloat(lmPeMvto[0].mp_des1) > 0) {
    llMpDesc = true;
  }

  for (var i = 0; i < lmPeMvto.length; i++) {
    lnCtPven += lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_pven;

    if (lmPeMvto[i].ce_tipo.trim().toUpperCase() == "P") {
      lcPrTipo = "produtosacabado";
    } else if (lmPeMvto[i].ce_tipo.trim().toUpperCase() == "R") {
      lcPrTipo = "produtosrevenda";
    } else {
      lcPrTipo = "";
    }

    try {
      if (lmPeMvto[i].pr_cbar.trim().length > 0) {
        lcPrCbar = lmPeMvto[i].pr_cbar.trim().toUpperCase();
      } else {
        lcPrCbar = "";
      }
    } catch (error) {
      lcPrCbar = "";
    }

    try {
      if (lmPeMvto[i].re_cbar.trim().length > 0) {
        lcReCbar = lmPeMvto[i].re_cbar.trim().toUpperCase();
      } else {
        lcReCbar = "";
      }
    } catch (error) {
      lcReCbar = "";
    }

    if (lcPrCbar.trim().length > 0) {
      lcDpCbar = lcPrCbar;
    } else if (lcReCbar.trim().length > 0) {
      lcDpCbar = lcPrCbar;
    } else {
      lcDpCbar = "";
    }

    try {
      if (parseInt(lmPeMvto[i].sa_gtri) == 3) {
        lnNcPipi = 0;
      } else {
        lnNcPipi = parseFloat(lmPeMvto[i].nc_pipi);
      }
    } catch (error) {
      lnNcPipi = parseFloat(lmPeMvto[i].nc_pipi);
    }

    if (llMpDesc) {
      //prettier-ignore
      lcMpDesc =  "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                    "<span style='font-size: small;'>" + brDecimal(lmPeMvto[i].mp_pven) + "</span>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                    "<span style='font-size: small;'>" + brDecimal(lmPeMvto[i].mp_des1) + "</span>" +
                  "</td>";
    } else {
      lcMpDesc = "";
    }

    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<img src='" + goCdUser.ws_wiis.trim().toLowerCase() + "fotos/" + lcPrTipo + "/" + "000000".substring(0, 6 - lmPeMvto[i].ce_codi.toString().trim().length) + lmPeMvto[i].ce_codi.toString().trim().toLowerCase() + ".jpg' style='width: 50px;' >" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" +
            "código: " + lmPeMvto[i].ce_codi.toString().trim() + " <br />" +
            lmPeMvto[i].ce_deno.trim().toUpperCase() + " " + lmPeMvto[i].ce_espt.trim().toUpperCase() + " <br />" +
            "ncm: " + lmPeMvto[i].ce_ntab.trim().toUpperCase() + " <br />" +
            "c. barras: " + lcDpCbar +
          "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brDecimal(parseFloat(lmPeMvto[i].mp_qtdp) / parseFloat(lmPeMvto[i].dp_qmas)) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtdp.toString().trim() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString().trim() + "</span>" +
        "</td>" +
        lcMpDesc +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brDecimal(lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brDecimal(lnNcPipi) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + 
          brDecimal(lmPeMvto[i].mp_qtde * (lmPeMvto[i].mp_prun + (lmPeMvto[i].mp_stdb + lmPeMvto[i].mp_ipdb) / lmPeMvto[i].mp_qtde)) + "</span>" +
        "</td>" +
      "</tr>";
  }

  // lnCtPdes = ((lnCtPven - loPeLcto.pe_vpro) * 100) / lnCtPven;
  lnCtPdes = lmPeMvto[0].mp_des1;
  lnCtVdes = lnCtPven - loPeLcto.pe_vpro;

  if (llMpDesc) {
    //prettier-ignore
    lcMpDesc =  "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "r$ unit." +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "% desc." +
                "</td>";
  } else {
    lcMpDesc = "";
  }

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>pedido " + loPeLcto.pe_nume.toString().trim().toUpperCase() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/dbi.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>cliente</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_clie.toString().trim() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cnpj/cpf</span> <br />" +
              "<span style='font-size: small;'>" + lcClCnpj + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;' colspan='2'>" +
              "<span style='font-size: x-small;'>nome fantasia</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
              "<span style='font-size: x-small;'>inscrição estadual/rg</span> <br />" +
              "<span style='font-size: small;'>" + lcClInsc + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>endereço</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_ende.trim().toUpperCase() + ", " + loPeLcto.cl_nume.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>bairro</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_bair.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cep</span> <br />" +
              "<span style='font-size: small;'>" + formataCep(loPeLcto.cl_ncep) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cidade</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_cida.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
                "<tr>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>uf</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.id_esta.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>complemento</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_comp.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>fone</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_fone.trim().toUpperCase() + "</span>" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>valores</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total líquido produtos</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_vpro) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total ipi</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_impo) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>valor frete</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_vfre) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total pedido</span> <br />" +
              "<span style='font-size: small; font-weight: bold;'>" + brMoney(loPeLcto.pe_tota) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>outras informações</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>previsão de entrega</span> <br />" +
              "<span style='font-size: small;'>" + jsonDate(loPeLcto.cg_dtpr) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>ordem de compra</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.pe_pcli.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>frete</span> <br />" +
              "<span style='font-size: small;'>" + lcPeCfob + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='3'>" +
              "<span style='font-size: x-small;'>transportadora</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.tr_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='3'>" +
              "<span style='font-size: x-small;'>tabela de preços</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.tb_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>forma de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.fp_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>volume</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.pe_qvol.toString().trim() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>peso em kg</span> <br />" +
              "<span style='font-size: small;'>" + brDecimal(loPeLcto.pe_peso) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='6'>" +
              "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cp_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='6'>" +
              "<span style='font-size: x-small;'>observação</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.pe_obcl.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='3'>" +
              "<span style='font-size: x-small;'>e-mail para envio da cópia do pedido</span> <br />" +
              "<span style='font-size: small;'>" + lcCpMail + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='3'>" +
              "<span style='font-size: x-small;'>e-mail para envio do xml da nfe</span> <br />" +
              "<span style='font-size: small;'>" + lcFdMail + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>dados dos produtos</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "imagem" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "descrição" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde cx" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde dpl" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde" +
            "</td>" +
            lcMpDesc +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "r$ líq. unit." +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "% ipi" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "total" +
            "</td>" +
          "</tr>" +
          lcPeMvto +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    loPeLcto.pe_nume.toString().trim() +
                    "_doce_brinquedo.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "pedido_" +
                      loPeLcto.pe_nume.toString().trim() +
                      "_doce_brinquedo.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da doce brinquedo",
                    "pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da doce brinquedo"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPdHtml, {
        documentSize: "A4",
        type: "share",
        fileName:
          "pedido_" +
          loPeLcto.pe_nume.toString().trim() +
          "_doce_brinquedo.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "pedido_" + loPeLcto.pe_nume.toString().trim() + "_doce_brinquedo",
      lcPdHtml
    );
  }
}

function doceBrinquedoTabelaPdf(lmCdProd, lcTbDeno, lcTbObse) {
  var ldDtHoje = new Date();
  var lcPrHtml = "",
    lcCdProd = "",
    lcPrTipo = "",
    lcPrCbar = "",
    lcReCbar = "",
    lcDpCbar = "",
    lcTdObse = "";
  var lnNcPipi = 0;

  for (var i = 0; i < lmCdProd.length; i++) {
    try {
      if (parseInt(lmCdProd[i].sa_gtri) == 3) {
        lnNcPipi = 0;
      } else {
        lnNcPipi = parseFloat(lmCdProd[i].nc_pipi);
      }
    } catch (error) {
      lnNcPipi = parseFloat(lmCdProd[i].nc_pipi);
    }

    if (lmCdProd[i].ce_tipo.trim().toUpperCase() == "P") {
      lcPrTipo = "produtosacabado";
    } else if (lmCdProd[i].ce_tipo.trim().toUpperCase() == "R") {
      lcPrTipo = "produtosrevenda";
    } else {
      lcPrTipo = "";
    }

    try {
      if (lmCdProd[i].pr_cbar.trim().length > 0) {
        lcPrCbar = lmCdProd[i].pr_cbar.trim().toUpperCase();
      } else {
        lcPrCbar = "";
      }
    } catch (error) {
      lcPrCbar = "";
    }

    try {
      if (lmCdProd[i].re_cbar.trim().length > 0) {
        lcReCbar = lmCdProd[i].re_cbar.trim().toUpperCase();
      } else {
        lcReCbar = "";
      }
    } catch (error) {
      lcReCbar = "";
    }

    if (lcPrCbar.trim().length > 0) {
      lcDpCbar = lcPrCbar;
    } else if (lcReCbar.trim().length > 0) {
      lcDpCbar = lcPrCbar;
    } else {
      lcDpCbar = "";
    }

    //prettier-ignore
    lcCdProd += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<img src='" + goCdUser.ws_wiis.trim().toLowerCase() + "fotos/" + lcPrTipo + "/" + "000000".substring(0, 6 - lmCdProd[i].ce_codi.toString().trim().length) + lmCdProd[i].ce_codi.toString().trim().toLowerCase() + ".jpg' style='width: 50px;' >" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<table style='width: 100%; font-size: small;'>" +
            "<tr>" +
              "<td style='text-align: right;'>código:</td>" +
              "<td><b>" + lmCdProd[i].ce_codi.toString().trim() + "</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>denominação:</td>" +
              "<td><b>" + lmCdProd[i].ce_deno.trim().toUpperCase() + "</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>embalagem:</td>" +
              "<td><b>" + lmCdProd[i].eb_deno.trim().toUpperCase() + "</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>ncm:</td>" +
              "<td><b>" + lmCdProd[i].ce_ntab.trim().toUpperCase() + "</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>ean unid.:</td>" +
              "<td><b>" + lcDpCbar + "</b></td>" +
            "</tr>" +
          "</table>" +
        "</td>" +
        // "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
        //   "<span style='font-size: small;'>" + lmCdProd[i].ce_ntab.trim().toUpperCase() + "</span>" +
        // "</td>" +
        // "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
        //   "<span style='font-size: small;'>" + lcDpCbar + "</span>" +
        // "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<table style='width: 100%; font-size: small;'>" +
            "<tr>" +
              "<td style='text-align: right;'>quantidade display:</td>" +
              "<td><b>" + lmCdProd[i].ce_qdis.toString().trim() + " unid.</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>preço:</td>" +
              "<td><b>" + brMoney(lmCdProd[i].pr_pliq) + "</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>total display:</td>" +
              "<td><b>" + brMoney(parseFloat(lmCdProd[i].ce_qdis) * parseFloat(lmCdProd[i].pr_pliq)) + "</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>preço c/ ipi:</td>" +
              "<td><b>" + brMoney(parseFloat(lmCdProd[i].pr_pliq) * (lnNcPipi / 100 + 1)) + "</b></td>" +
            "</tr>" +
            "<tr>" +
              "<td style='text-align: right;'>total display c/ ipi:</td>" +
              "<td><b>" + brMoney(parseFloat(lmCdProd[i].ce_qdis) * parseFloat(lmCdProd[i].pr_pliq) * (lnNcPipi / 100 + 1)) + "</b></td>" +
            "</tr>" +
          "</table>" +
        // "</td>" +
        // "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
        //   "<span style='font-size: small;'>" + lmCdProd[i].ce_qdis.toString().trim() + "</span>" +
        // "</td>" +
        // "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
        //   "<span style='font-size: small;'>" + brMoney(lmCdProd[i].pr_pliq) + "</span>" +
        // "</td>" +
        // "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
        //   "<span style='font-size: small;'>" + brMoney(parseFloat(lmCdProd[i].ce_qdis) * parseFloat(lmCdProd[i].pr_pliq)) + "</span>" +
        // "</td>" +
        // "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
        //   "<span style='font-size: small;'>" + brMoney(parseFloat(lmCdProd[i].pr_pliq) * (lnNcPipi / 100 + 1)) + "</span>" +
        // "</td>" +
        // "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
        //   "<span style='font-size: small;'>" + brMoney(parseFloat(lmCdProd[i].ce_qdis) * parseFloat(lmCdProd[i].pr_pliq) * (lnNcPipi / 100 + 1)) + "</span>" +
        // "</td>" +
      "</tr>";
  }

  if (lcTbObse.trim().length > 0) {
    lcTdObse =
      "<span style='font-size: small;'>observação</span> <br />" + lcTbObse;
  }

  //prettier-ignore
  lcPrHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/dbi.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
              lcTbDeno +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black;' colspan='2'>" +
              lcTdObse +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "validade de 7 dias após emissão" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "imagem" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "detalhes" +
            "</td>" +
            // "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            //   "ncm" +
            // "</td>" +
            // "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            //   "cód. barras" +
            // "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "valores" +
            "</td>" +
            // "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            //   "qtde dpl" +
            // "</td>" +
            // "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            //   "preço" +
            // "</td>" +
            // "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            //   "total dpl" +
            // "</td>" +
            // "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            //   "preço c/ ipi" +
            // "</td>" +
            // "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            //   "total dpl c/ ipi" +
            // "</td>" +
          "</tr>" +
          lcCdProd +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "esse relatório é confidencial, não pode ser repassado sem consentimento da empresa" +
        "</div>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPrHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName: "tabela_de_preços_doce_brinquedo.pdf",
                })
                .then(function (lcTbStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPrHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "tabela_de_preços_doce_brinquedo.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente a " +
                      lcTbDeno.trim().toUpperCase() +
                      " da doce brinquedo",
                    lcTbDeno.trim().toUpperCase() + " da doce brinquedo"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPrHtml, {
        documentSize: "A4",
        type: "share",
        fileName: "tabela_de_preços_doce_brinquedo.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "tabela_de_preços_doce_brinquedo",
      lcPrHtml
    );
  }
}

function visualizaImpressao(lnScWdth, lnScHght, lcScTitu, lcScHtml) {
  var loTpPdff = {};
  var lnPdLeft = screen.width / 2 - lnScWdth / 2,
    lnPdTopp = screen.height / 2 - lnScHght / 2;

  loTpPdff = window.open(
    "",
    "",
    "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      lnScWdth +
      ", height=" +
      lnScHght +
      ", top=" +
      lnPdTopp +
      ", left=" +
      lnPdLeft
  );

  loTpPdff.document.write(lcScHtml);
  loTpPdff.document.title = lcScTitu;
}

function impressaoPdf(lnScWdth, lnScHght, lcScTitu, lcScHtml) {
  var loTpPdff = {};
  var lnPdLeft = screen.width / 2 - lnScWdth / 2,
    lnPdTopp = screen.height / 2 - lnScHght / 2;

  loTpPdff = window.open(
    "",
    "",
    "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      lnScWdth +
      ", height=" +
      lnScHght +
      ", top=" +
      lnPdTopp +
      ", left=" +
      lnPdLeft
  );

  loTpPdff.document.write(lcScHtml);
  loTpPdff.document.title = lcScTitu;
  loTpPdff.document.close();

  app.dialog.progress("gerando pdf");

  setTimeout(function () {
    app.dialog.close();

    loTpPdff.focus();
    loTpPdff.print();
    loTpPdff.close();
  }, 2000);
}

function colinaPdf(loPeLcto, lmPeMvto) {
  var ldDtHoje = new Date();
  var lcPdHtml = "",
    lcClCnpj = "",
    lcClInsc = "",
    lcPeCfob = "",
    lcPeMvto = "";

  if (parseInt(loPeLcto.cl_pfpj) == 1) {
    lcClCnpj = formataCpf(loPeLcto.cl_ncpf);
    lcClInsc = loPeLcto.cl_nrrg.trim().toUpperCase();
  } else {
    lcClCnpj = formataCnpj(loPeLcto.cl_cnpj);
    lcClInsc = loPeLcto.cl_insc.trim().toUpperCase();
  }

  if (parseInt(loPeLcto.pe_fret) == 1) {
    lcPeCfob = "CIF";
  } else if (parseInt(loPeLcto.pe_fret) == 2) {
    lcPeCfob = "FOB";
  } else if (parseInt(loPeLcto.pe_fret) == 3) {
    lcPeCfob = "RETIRA";
  }

  for (var i = 0; i < lmPeMvto.length; i++) {
    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].id_prod.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].dp_deno.trim().toUpperCase() + " " + lmPeMvto[i].dp_espt.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].dp_unes.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString().trim() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_tota) + "</span>" +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>pedido " + loPeLcto.pe_nume.toString().trim().toUpperCase() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/cem.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>cliente</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_clie.toString().trim() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cnpj/cpf</span> <br />" +
              "<span style='font-size: small;'>" + lcClCnpj + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;' colspan='2'>" +
              "<span style='font-size: x-small;'>nome fantasia</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
              "<span style='font-size: x-small;'>inscrição estadual/rg</span> <br />" +
              "<span style='font-size: small;'>" + lcClInsc + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>endereço</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_ende.trim().toUpperCase() + ", " + loPeLcto.cl_nume.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>bairro</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_bair.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cep</span> <br />" +
              "<span style='font-size: small;'>" + formataCep(loPeLcto.cl_ncep) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cidade</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_cida.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
                "<tr>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>uf</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.id_esta.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>complemento</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_comp.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>fone</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_fone.trim().toUpperCase() + "</span>" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>valores</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total produtos</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_vpro) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>valor frete</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_vfre) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>icms-st</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_impo) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total pedido</span> <br />" +
              "<span style='font-size: small; font-weight: bold;'>" + brMoney(loPeLcto.pe_tota) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>outras informações</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>ordem de compra</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.pe_pcli.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>frete</span> <br />" +
              "<span style='font-size: small;'>" + lcPeCfob + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>transportadora redespacho</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.rc_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>tabela de preços</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.tb_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cp_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>dados dos produtos</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "código" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "descrição" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "un" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "preço" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "total" +
            "</td>" +
          "</tr>" +
          lcPeMvto +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    loPeLcto.pe_nume.toString().trim() +
                    "_colina.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "pedido_" +
                      loPeLcto.pe_nume.toString().trim() +
                      "_colina.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da colina",
                    "pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da colina"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPdHtml, {
        documentSize: "A4",
        type: "share",
        fileName:
          "pedido_" + loPeLcto.pe_nume.toString().trim() + "_colina.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "pedido_" + loPeLcto.pe_nume.toString().trim() + "_colina",
      lcPdHtml
    );
  }
}

function ffmPdf(lmPeMvto) {
  var ldDtHoje = new Date();
  var lcPdHtml = "",
    lcClCnpj = "",
    lcClInsc = "",
    lcPeMvto = "",
    lcMpPrun = "",
    lcMpTota = "",
    lcPeDesc = "",
    lcPeVard = "",
    lcPeQpar = "";
  var lnPeLped = 0,
    lnPeBped = 0,
    lnPeVfre = 0,
    lnPeVard = 0,
    lnPeTota = 0;

  if (parseInt(lmPeMvto[0].cl_pfpj) == 1) {
    lcClCnpj = formataCpf(lmPeMvto[0].cl_ncpf);
    lcClInsc = lmPeMvto[0].cl_nrrg.trim().toUpperCase();
  } else {
    lcClCnpj = formataCnpj(lmPeMvto[0].cl_cnpj);
    lcClInsc = lmPeMvto[0].cl_insc.trim().toUpperCase();
  }

  for (var i = 0; i < lmPeMvto.length; i++) {
    if (parseFloat(lmPeMvto[i].mp_prun) < parseFloat(lmPeMvto[i].mp_pcor)) {
      lcMpPrun =
        "<s>" +
        brMoney(lmPeMvto[i].mp_pcor) +
        "</s><br />" +
        brMoney(lmPeMvto[i].mp_prun);
      lcMpTota =
        "<s>" +
        brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_pcor) +
        "</s><br />" +
        brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun);
    } else {
      lcMpPrun = brMoney(lmPeMvto[i].mp_prun);
      lcMpTota = brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun);
    }

    lnPeBped +=
      parseFloat(lmPeMvto[i].mp_qtde) * parseFloat(lmPeMvto[i].mp_pcor);
    lnPeLped +=
      parseFloat(lmPeMvto[i].mp_qtde) * parseFloat(lmPeMvto[i].mp_prun);
    lnPeVfre += parseFloat(lmPeMvto[i].mp_vfre);
    lnPeVard += parseFloat(lmPeMvto[i].mp_vard);

    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].id_revd.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].rv_deno.trim().toUpperCase() + " " + lmPeMvto[i].rv_espt.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].rv_unes.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString().trim() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lcMpPrun + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lcMpTota + "</span>" +
        "</td>" +
      "</tr>";
  }

  if (parseInt(lmPeMvto[0].pe_qpar) > 0) {
    //prettier-ignore
    lcPeQpar = 
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>quantidade de parcelas</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].pe_qpar.toString() + "</span>" +
            "</td>";
  }

  if (lnPeLped < lnPeBped) {
    //prettier-ignore
    lcPeDesc = 
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>desconto</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeBped - lnPeLped) + "</span>" +
            "</td>"
  } else {
    lnPeBped = lnPeLped;
  }

  if (lnPeVard > 0) {
    //prettier-ignore
    lcPeVard = 
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>arredondamento</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeVard) + "</span>" +
            "</td>"
  }

  lnPeTota = lnPeLped + lnPeVfre - lnPeVard;

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>pedido " + lmPeMvto[0].pe_nume.toString().trim().toUpperCase() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/ffm.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>vendedor</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].id_vend.toString() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>nome</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].vd_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>cliente</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].id_clie.toString() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cnpj/cpf</span> <br />" +
              "<span style='font-size: small;'>" + lcClCnpj + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>nome fantasia</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>inscrição estadual/rg</span> <br />" +
              "<span style='font-size: small;'>" + lcClInsc + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>endereço de entrega</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>endereço</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_endt.trim().toUpperCase() + ", " + lmPeMvto[0].cl_numt.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>bairro</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_bait.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cep</span> <br />" +
              "<span style='font-size: small;'>" + formataCep(lmPeMvto[0].cl_cept) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cidade</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_cidt.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
                "<tr>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>uf</span> <br />" +
                    "<span style='font-size: small;'>" + lmPeMvto[0].cl_estt.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>complemento</span> <br />" +
                    "<span style='font-size: small;'>" + lmPeMvto[0].cl_cmpt.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>fone</span> <br />" +
                    "<span style='font-size: small;'>" + lmPeMvto[0].cl_fone.trim().toUpperCase() + "</span>" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>pagamento</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cp_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
            lcPeQpar +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>valores</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total bruto</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeBped) + "</span>" +
            "</td>" +
            lcPeDesc +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>valor frete</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeVfre) + "</span>" +
            "</td>" +
            lcPeVard +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total</span> <br />" +
              "<span style='font-size: small; font-weight: bold;'>" + brMoney(lnPeTota) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>dados dos produtos</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "código" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "descrição" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "un" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "preço" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "total" +
            "</td>" +
          "</tr>" +
          lcPeMvto +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    lmPeMvto[0].pe_nume.toString() +
                    "_ffmadeiras.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "pedido_" +
                      lmPeMvto[0].pe_nume.toString() +
                      "_ffmadeiras.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao pedido " +
                      lmPeMvto[0].pe_nume.toString() +
                      " da ffmadeiras",
                    "pedido " +
                      lmPeMvto[0].pe_nume.toString() +
                      " da ffmadeiras"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPdHtml, {
        documentSize: "A4",
        type: "share",
        fileName:
          "pedido_" + lmPeMvto[0].pe_nume.toString().trim() + "_ffmadeiras.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "pedido_" + lmPeMvto[0].pe_nume.toString().trim() + "_ffmadeiras",
      lcPdHtml
    );
  }
}

function hmxPdf(loPeLcto, lmPeMvto, lmCdCont) {
  var ldDtHoje = new Date();
  var lcPdHtml = "",
    lcClCnpj = "",
    lcClInsc = "",
    lcPeCfob = "",
    lcCpMail = "",
    lcFdMail = "",
    lcPeMvto = "";

  if (parseInt(loPeLcto.cl_pfpj) == 1) {
    lcClCnpj = formataCpf(loPeLcto.cl_ncpf);
    lcClInsc = loPeLcto.cl_nrrg.trim().toUpperCase();
  } else {
    lcClCnpj = formataCnpj(loPeLcto.cl_cnpj);
    lcClInsc = loPeLcto.cl_insc.trim().toUpperCase();
  }

  if (parseInt(loPeLcto.pe_cfob) > 1) {
    lcPeCfob = "FOB";
  } else {
    lcPeCfob = "CIF";
  }

  for (var i = 0; i < lmCdCont.length; i++) {
    if (
      parseInt(lmCdCont[i].id_tpco) == 6 &&
      lmCdCont[i].co_mail.trim().length > 0 &&
      lcCpMail.trim().length == 0
    ) {
      lcCpMail = lmCdCont[i].co_mail.trim().toLowerCase();
    }

    if (
      parseInt(lmCdCont[i].id_tpco) == 1 &&
      lmCdCont[i].co_mail.trim().length > 0 &&
      lcFdMail.trim().length == 0
    ) {
      lcFdMail = lmCdCont[i].co_mail.trim().toLowerCase();
    }
  }

  for (var i = 0; i < lmPeMvto.length; i++) {
    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].ce_codi.toString().trim() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].ce_deno.trim().toUpperCase() + " " + lmPeMvto[i].ce_espt.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].ce_unes.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString().trim() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_tota) + "</span>" +
        "</td>" +
      "</tr>";
  }

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>pedido " + loPeLcto.pe_nume.toString().trim().toUpperCase() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/hmx.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>cliente</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_clie.toString().trim() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cnpj/cpf</span> <br />" +
              "<span style='font-size: small;'>" + lcClCnpj + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;' colspan='2'>" +
              "<span style='font-size: x-small;'>nome fantasia</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
              "<span style='font-size: x-small;'>inscrição estadual/rg</span> <br />" +
              "<span style='font-size: small;'>" + lcClInsc + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>endereço</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_ende.trim().toUpperCase() + ", " + loPeLcto.cl_nume.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>bairro</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_bair.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cep</span> <br />" +
              "<span style='font-size: small;'>" + formataCep(loPeLcto.cl_ncep) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cidade</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_cida.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
                "<tr>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>uf</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.id_esta.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>complemento</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_comp.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>fone</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_fone.trim().toUpperCase() + "</span>" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>valores</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total produtos</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_vpro) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>valor frete</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_vfre) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>icms-st</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_impo) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>desconto</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_vdes) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total pedido</span> <br />" +
              "<span style='font-size: small; font-weight: bold;'>" + brMoney(loPeLcto.pe_tota) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>outras informações</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>ordem de compra</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.pe_pcli.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>frete</span> <br />" +
              "<span style='font-size: small;'>" + lcPeCfob + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cp_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>e-mail para envio da cópia do pedido</span> <br />" +
              "<span style='font-size: small;'>" + lcCpMail + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>e-mail para envio do xml da nfe</span> <br />" +
              "<span style='font-size: small;'>" + lcFdMail + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>dados dos produtos</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "código" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "descrição" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "un" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "preço" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "total" +
            "</td>" +
          "</tr>" +
          lcPeMvto +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    loPeLcto.pe_nume.toString().trim() +
                    "_hortimulti.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "pedido_" +
                      loPeLcto.pe_nume.toString().trim() +
                      "_hortimulti.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da hortimulti",
                    "pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da hortimulti"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPdHtml, {
        documentSize: "A4",
        type: "share",
        fileName:
          "pedido_" + loPeLcto.pe_nume.toString().trim() + "_hortimulti.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "pedido_" + loPeLcto.pe_nume.toString().trim() + "_hortimulti",
      lcPdHtml
    );
  }
}

async function htmlToImageBase64(htmlContent) {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "600px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#000000"; // Força cor do texto
  container.style.fontFamily = "Arial, sans-serif"; // Força fonte
  container.innerHTML = htmlContent;

  document.body.appendChild(container);

  // Força estilos inline em todos os elementos
  setTimeout(() => {
    const allElements = container.querySelectorAll("*");
    allElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      el.style.color = style.color;
      el.style.fontFamily = "Arial, sans-serif";
      el.style.backgroundColor = style.backgroundColor;
    });
  }, 100);

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(container, {
      useCORS: true,
      scale: 2,
      backgroundColor: "#ffffff",
      logging: true, // Ativa logs para debug
      onclone: (clonedDoc, element) => {
        // Força estilos no clone
        const elements = clonedDoc.querySelectorAll("*");
        elements.forEach((el) => {
          el.style.fontFamily = "Arial, sans-serif !important";
          el.style.color = "#000000 !important";
          el.style.opacity = "1 !important";
          el.style.visibility = "visible !important";
        });
      },
    });

    const imageData = canvas.toDataURL("image/png");
    return imageData;
  } catch (error) {
    console.error("Erro detalhado:", error);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
}

function hmtDocumento(lmPeMvto) {
  var ldDtHoje = new Date();
  var lcPdHtml = "",
    lcPeMvto = "",
    lcMpPrun = "",
    lcMpTota = "",
    lcPeDesc = "",
    lcPeVard = "",
    lcPeTroc = "";
  var lnPeLpro = 0,
    lnPeBpro = 0,
    lnPePbru = 0,
    lnPeVfre = 0,
    lnPeVard = 0,
    lnPeTota = 0,
    lnPeTroc = 0,
    lnPeImpo = 0;

  for (var i = 0; i < lmPeMvto.length; i++) {
    if (parseFloat(lmPeMvto[i].mp_prun) < parseFloat(lmPeMvto[i].mp_pcor)) {
      lcMpPrun =
        "<s>" +
        brMoney(lmPeMvto[i].mp_pcor) +
        "</s><br />" +
        brMoney(lmPeMvto[i].mp_prun);
      lcMpTota =
        "<s>" +
        brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_pcor) +
        "</s><br />" +
        brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun);
    } else {
      lcMpPrun = brMoney(lmPeMvto[i].mp_prun);
      lcMpTota = brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun);
    }

    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" +
            "código: " + lmPeMvto[i].id_revd.trim().toUpperCase() + " <br />" +
            lmPeMvto[i].rv_deno.trim().toUpperCase() + " " + lmPeMvto[i].rv_espt.trim().toUpperCase() +
          "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center; display: none;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].ma_deno.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].rv_unes.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lcMpPrun + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lcMpTota + "</span>" +
        "</td>" +
      "</tr>";
  }

  lnPeBpro = parseFloat(lmPeMvto[0].pe_bpro);
  lnPePbru = parseFloat(lmPeMvto[0].pe_pbru);
  lnPeLpro = parseFloat(lmPeMvto[0].pe_lpro);
  lnPeVfre = parseFloat(lmPeMvto[0].pe_vfre);
  lnPeVard = parseFloat(lmPeMvto[0].pe_vard);

  if (lnPeLpro < lnPeBpro) {
    //prettier-ignore
    lcPeDesc = 
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>desconto</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeBpro - lnPeLpro) + "</span>" +
            "</td>";
  } else {
    lnPeBpro = lnPeLpro;
  }

  lnPeImpo = parseFloat(lmPeMvto[0].pe_impo);

  if (lnPeVard > 0) {
    //prettier-ignore
    lcPeVard = 
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>arredondamento</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeVard) + "</span>" +
            "</td>";
  }

  lnPeTroc = parseFloat(lmPeMvto[0].pe_troc);

  if (lnPeTroc > 0) {
    //prettier-ignore
    lcPeTroc = 
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>troco para</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeTroc) + "</span>" +
            "</td>";
  }

  lnPeTota = parseFloat(lmPeMvto[0].pe_tota);

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>orçamento " + lmPeMvto[0].pe_nume.toString() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/hmt.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>data do orçamento</span> <br />" +
              "<span style='font-size: small;'>" + jsonDate(lmPeMvto[0].pe_data) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>filial</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].fi_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>vendedor</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].vd_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].id_clie.toString() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>cidade</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].id_cida.trim().toUpperCase() + "/" + lmPeMvto[0].id_esta.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cep</span> <br />" +
              "<span style='font-size: small;'>" + formataCep(lmPeMvto[0].cl_ncep) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>fone</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_fone.replace(/[^\d]+/g, "") + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>celular</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_celu.replace(/[^\d]+/g, "") + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>forma de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].fg_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cp_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='3'>" +
              "<span style='font-size: x-small;'>observação</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].pe_obcl.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "produto" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center; display: none;'>" +
              "marca" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "un." +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "preço" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "total" +
            "</td>" +
          "</tr>" +
          lcPeMvto +
        "</table>" +
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>peso bruto</span> <br />" +
              "<span style='font-size: small;'>" + brDecimal(lnPePbru) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total bruto</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeBpro) + "</span>" +
            "</td>" +
            lcPeDesc +
            "<td style='border: 1px solid black; vertical-align: top; display: none;'>" +
              "<span style='font-size: x-small;'>icms-st</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeImpo) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>valor frete</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeVfre) + "</span>" +
            "</td>" +
            lcPeVard +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total</span> <br />" +
              "<span style='font-size: small; font-weight: bold;'>" + brMoney(lnPeTota) + "</span>" +
            "</td>" +
            lcPeTroc +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar pdf",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    lmPeMvto[0].pe_nume.toString().trim() +
                    "_hortimulti.pdf",
                })
                .then(function (lcPdStat) {
                  console.log("status: " + lcPdStat);

                  app.dialog.close();
                })
                .catch((lcPdErro) =>
                  alerta(
                    "não foi possível gerar o pdf, tente novamente mais tarde",
                    "alerta"
                  )
                );
            },
          },
          {
            text: "compartilhar pdf",
            icon: "<i class='material-icons centraliza'>picture_as_pdf</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "pedido_" +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      "_hortimulti.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao pedido " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da hortimulti",
                    "pedido " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da hortimulti"
                  );
                })
                .catch((lcPdErro) =>
                  alerta(
                    "não foi possível gerar o pdf, tente novamente mais tarde",
                    "alerta"
                  )
                );
            },
          },
          {
            text: "compartilhar imagem",
            icon: "<i class='material-icons centraliza'>image</i>",
            onClick: function () {
              app.dialog.progress("gerando imagem");

              htmlToImageBase64(lcPdHtml)
                .then((lo64Base) => {
                  app.dialog.close();

                  window.plugins.socialsharing.share(
                    "arquivo pdf referente ao pedido " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da hortimulti",
                    "pedido " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da hortimulti",
                    lo64Base,
                    null
                  );
                })
                .catch(() => {
                  app.dialog.close();

                  alerta(
                    "não foi possível gerar a imagem, tente gerar no formato pdf",
                    "alerta"
                  );
                });
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "pdf",
            icon: "<i class='material-icons centraliza'>picture_as_pdf</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    lmPeMvto[0].pe_nume.toString().trim() +
                    "_hortimulti.pdf",
                })
                .then(function (lcPdStat) {
                  console.log("status: " + lcPdStat);

                  app.dialog.close();
                })
                .catch((lcPdErro) =>
                  alerta(
                    "não foi possível gerar o pdf, tente novamente mais tarde",
                    "alerta"
                  )
                );
            },
          },
          {
            text: "imagem",
            icon: "<i class='material-icons centraliza'>image</i>",
            onClick: function () {
              app.dialog.progress("gerando imagem");

              htmlToImageBase64(lcPdHtml)
                .then((lo64Base) => {
                  app.dialog.close();

                  window.plugins.socialsharing.share(
                    "arquivo pdf referente ao pedido " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da hortimulti",
                    "pedido " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da hortimulti",
                    lo64Base,
                    null
                  );
                })
                .catch(() => {
                  app.dialog.close();

                  alerta(
                    "não foi possível gerar a imagem, tente gerar no formato pdf",
                    "alerta"
                  );
                });
            },
          },
        ],
      })
      .open();
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "pedido_" + lmPeMvto[0].pe_nume.toString().trim() + "_hortimulti",
      lcPdHtml
    );
  }
}

function cdmPdf(loPeLcto, lmPeMvto) {
  var ldDtHoje = new Date();
  var lcPdHtml = "",
    lcClCnpj = "",
    lcClInsc = "",
    lcPeMvto = "",
    lcPeQbon = "";
  var lnPeQbon = 0;

  if (parseInt(loPeLcto.cl_pfpj) == 1) {
    lcClCnpj = formataCpf(loPeLcto.cl_ncpf);
    lcClInsc = loPeLcto.cl_nrrg.trim().toUpperCase();
  } else {
    lcClCnpj = formataCnpj(loPeLcto.cl_cnpj);
    lcClInsc = loPeLcto.cl_insc.trim().toUpperCase();
  }

  for (var i = 0; i < lmPeMvto.length; i++) {
    lnPeQbon += parseFloat(lmPeMvto[i].mp_qbon);

    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].id_dmat.toString() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].dm_deno.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].dm_unid.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString().trim() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
      "</tr>";
  }

  if (lnPeQbon > 0) {
    //prettier-ignore
    lcPeQbon += 
      "<br />" +
      "<span style='font-size: large;'>bonificações</span>" +
      "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "código" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "denominação" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "un." +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "qtde" +
          "</td>" +
        "</tr>";

    for (var i = 0; i < lmPeMvto.length; i++) {
      if (parseFloat(lmPeMvto[i].mp_qbon) > 0) {
        //prettier-ignore
        lcPeQbon += 
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
              "<span style='font-size: small;'>" + lmPeMvto[i].id_dmat.toString() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: middle;'>" +
              "<span style='font-size: small;'>" + lmPeMvto[i].dm_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
              "<span style='font-size: small;'>" + lmPeMvto[i].dm_unid.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
              "<span style='font-size: small;'>" + lmPeMvto[i].mp_qbon.toString().trim() + "</span>" +
            "</td>" +
          "</tr>";
      }
    }

    //prettier-ignore
    lcPeQbon += 
      "</table>";
  }

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>pedido " + loPeLcto.pe_nume.toString().trim().toUpperCase() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/cdm.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>emitido em " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>cliente</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_clie.toString().trim() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cnpj/cpf</span> <br />" +
              "<span style='font-size: small;'>" + lcClCnpj + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;' colspan='2'>" +
              "<span style='font-size: x-small;'>nome fantasia</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; border-bottom: 0px;'>" +
              "<span style='font-size: x-small;'>inscrição estadual/rg</span> <br />" +
              "<span style='font-size: small;'>" + lcClInsc + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>endereço</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_ende.trim().toUpperCase() + ", " + loPeLcto.cl_nume.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>bairro</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_bair.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cep</span> <br />" +
              "<span style='font-size: small;'>" + formataCep(loPeLcto.cl_ncep) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cidade</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_cida.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
                "<tr>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>uf</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_esta.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='border-right: 1px solid black; vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>celular</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_celu.trim().toUpperCase() + "</span>" +
                  "</td>" +
                  "<td style='vertical-align: top;'>" +
                    "<span style='font-size: x-small;'>telefone</span> <br />" +
                    "<span style='font-size: small;'>" + loPeLcto.cl_fone.trim().toUpperCase() + "</span>" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>informações do pedido</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td colspan='2' style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>vendedor</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.vd_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>data</span> <br />" +
              "<span style='font-size: small;'>" + jsonDate(loPeLcto.pe_data) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cp_deno.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>quantidade de produtos</span> <br />" +
              "<span style='font-size: small;'>" + brDecimal(loPeLcto.pe_qtde) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total</span> <br />" +
              "<span style='font-size: small; font-weight: bold;'>" + brMoney(loPeLcto.pe_tota) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>dados dos produtos</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "código" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "denominação" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "un." +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "preço" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "total" +
            "</td>" +
          "</tr>" +
          lcPeMvto +
        "</table>" +
        lcPeQbon +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    loPeLcto.pe_nume.toString().trim() +
                    "_allfrig.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "pedido_" +
                      loPeLcto.pe_nume.toString().trim() +
                      "_allfrig.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da allfrig",
                    "pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da allfrig"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPdHtml, {
        documentSize: "A4",
        type: "share",
        fileName:
          "pedido_" + loPeLcto.pe_nume.toString().trim() + "_allfrig.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "pedido_" + loPeLcto.pe_nume.toString().trim() + "_allfrig",
      lcPdHtml
    );
  }
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function paginaLibera(lcIdFile, lcIdObjt, lcExJava, lcErJava, lcBgClor) {
  var loSlUser = {};
  var lcSlRsql = "",
    lcWkIsql = "",
    lcWkPoup = "",
    lcWkSlct = "";
  var lmWkIsql = [];

  //prettier-ignore
  lcWkPoup =
    "<div class='popup bg-color-" + lcBgClor + "'>" +
      "<div class='block'>" +
        "<p>autorização</p>" +
      "</div>" +
      "<div class='list'>" +
        "<ul>" +
          "<li class='item-content item-input'>" +
            "<div class='item-inner'>" +
              "<div class='item-title item-label'>usuário</div>" +
              "<div class='item-input-wrap input-dropdown-wrap'>" +
                "<select id='sltUser'></select>" +
              "</div>" +
            "</div>" +
          "</li>" +
          "<li class='item-content item-input'>" +
            "<div class='item-inner'>" +
              "<div class='item-title item-label'>senha</div>" +
              "<div class='item-input-wrap'>" +
                "<input id='txtSenh' type='password'>" +
              "</div>" +
            "</div>" +
          "</li>" +
        "</ul>" +
      "</div>" +      
      "<div class='block'>" +
        "<p class='row'>" +
          "<button id='btnLibe' class='col button button-fill'>liberar</button>" +
        "</p>" +
      "</div>" +
      "<div class='block'>" +
        "<p><a id='ahrFech' href='#' class='link popup-close'>fechar</a></p>" +
      "</div>" +
    "</div>";

  app.popup
    .create({
      content: lcWkPoup,
    })
    .open();

  OkTecladoAndroid3("txtSenh", "btnLibe", "btnLibe");

  $("#btnLibe").click(function () {
    consultaUsuarioPaginaLibera(lcExJava.trim(), lcErJava.trim());
  });

  $("#ahrFech").click(function () {
    eval(lcErJava);
  });

  loSlUser = document.getElementById("sltUser");

  loSlUser.disabled = true;

  $("#sltUser").html("<option value=''>CARREGANDO USUÁRIOS...</option>").show();

  lmWkIsql = [
    { pa_nome: "lcIdFile", pa_tipo: "VarChar", pa_valo: lcIdFile },
    { pa_nome: "lcIdEmpr", pa_tipo: "Char", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdObjt", pa_tipo: "VarChar", pa_valo: lcIdObjt },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaUsuariosLibera",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lcSlRsql = "<option value=''>LISTA DE USUÁRIOS</option>";

          for (var i = 0; i < lmWkRsql.length; i++) {
            if (
              lmWkRsql[i].id_user.trim().toUpperCase() ==
              goCdUser.id_user.trim().toUpperCase()
            ) {
              lcWkSlct = "selected";
            } else {
              lcWkSlct = "";
            }

            //prettier-ignore
            lcSlRsql += "<option value='" + lmWkRsql[i].id_user + "' " + lcWkSlct + ">" + lmWkRsql[i].id_user + "</option>";
          }

          $("#sltUser").html(lcSlRsql).show();

          loSlUser.disabled = false;

          return;
        }
      } catch (loApErro) {}

      $("#sltUser").html("<option value=''></option>").show();
    },
    error: function (jqXHR, textStatus, err) {
      $("#sltUser").html("<option value=''></option>").show();
    },
  });
}

function consultaUsuarioPaginaLibera(lcExJava, lcErJava) {
  var loSlUser = document.getElementById("sltUser");
  var loTxSenh = document.getElementById("txtSenh");
  var lmWkIsql = [];
  var lcWkIsql = "";

  //prettier-ignore
  if (loSlUser.value.toString().toUpperCase().trim().split(" ").join("") == "") {
    alerta("campo usuário obrigatório", "alerta");

    return;
  } else if (loTxSenh.value.toString().toUpperCase().trim() == "") {
    alerta("campo senha obrigatório", "alerta");

    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: loSlUser.value.toString().toUpperCase().trim().split(" ").join("") }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaUsuario",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          if (
            lmWkRsql[0].us_smd5.trim().toUpperCase() ==
            CryptoJS.MD5(loTxSenh.value.toString().trim().toUpperCase())
              .toString()
              .trim()
              .toUpperCase()
          ) {
            app.popup.close();

            eval(lcExJava);
          } else {
            alerta("usuário ou senha inválidos", "alerta");

            app.popup.close();

            eval(lcErJava);
          }
        }
      } catch (loApErro) {
        alerta("usuário ou senha inválidos", "erro");

        app.popup.close();

        eval(lcErJava);
      }
    },
    error: function (jqXHR, textStatus, err) {
      alerta("usuário ou senha inválidos", "erro");

      app.popup.close();

      eval(lcErJava);
    },
    timeout: 10000000,
  });
}

function deletaUsuarioAutoridadeObjeto(lcIdFile, lcIdObjt, lcCdUser) {
  var loUlUser = document.getElementById("uulUser"),
    loCdUser = JSON.parse(unescape(lcCdUser));
  var lcWkIsql = "",
    lcUlUser = "",
    lcIdUser = "";
  var lmWkIsql = [];

  try {
    if (loCdUser.id_user.trim().length > 0) {
      lcIdUser = loCdUser.id_user.trim().toUpperCase();
    }
  } catch (error) {}

  if (lcIdUser.length == 0) {
    alerta("usuário inválido", "alerta");

    return;
  }

  app.dialog
    .create({
      title: "alerta",
      text: "deseja excluir autoridade do usuário ?",
      buttons: [
        {
          text: "cancelar",
          color: corBotaoAlerta(),
        },
        {
          text: "ok",
          color: corBotaoAlerta(),
          onClick: function () {
            lmWkIsql = [
              { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
              { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser },
              { pa_nome: "lcIdFile", pa_tipo: "VarChar", pa_valo: lcIdFile },
              { pa_nome: "lcIdObjt", pa_tipo: "VarChar", pa_valo: lcIdObjt },
            ];

            lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

            $.ajax({
              url:
                goCdUser.ws_http.trim() +
                "chamadaProcedure?lcWkIsql=" +
                lcWkIsql +
                "&lcWkProc=deletaUsuarioAutoridadeObjeto",
              type: "GET",
              dataType: "jsonp",

              success: function (lmWkRsql) {
                try {
                  for (var i = 0; i < lmWkRsql.length; i++) {
                    //prettier-ignore
                    lcUlUser += 
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-media' onclick='deletaUsuarioAutoridadeObjeto(\"" + lcIdFile + "\", \"" + lcIdObjt + "\", \"" + escape(JSON.stringify(lmWkRsql[i])) + "\");'>" +
                          "<i class='material-icons text-color-red'>remove_circle</i>" +
                        "</div>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'><b>" + lmWkRsql[i].id_user.trim().toUpperCase() + "</b></div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
                  }
                } catch (loWkErro) {}

                loUlUser.innerHTML = lcUlUser;
              },
              error: function (jqXHR, textStatus, err) {
                loUlUser.innerHTML = lcUlUser;
              },
            });
          },
        },
      ],
    })
    .open();
}

function insereUsuarioAutoridadeObjeto(lcIdFile, lcIdObjt) {
  var loSlUser = document.getElementById("sltUser"),
    loUlUser = document.getElementById("uulUser");
  var lcWkIsql = "",
    lcUlUser = "",
    lcIdUser = loSlUser.value.toString().trim().toUpperCase();
  var lmWkIsql = [];

  if (lcIdUser.length == 0) {
    alerta("usuário inválido", "alerta");

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser },
    { pa_nome: "lcIdFile", pa_tipo: "VarChar", pa_valo: lcIdFile },
    { pa_nome: "lcIdObjt", pa_tipo: "VarChar", pa_valo: lcIdObjt },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereUsuarioAutoridadeObjeto",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcUlUser += 
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-media' onclick='deletaUsuarioAutoridadeObjeto(\"" + lcIdFile + "\", \"" + lcIdObjt + "\", \"" + escape(JSON.stringify(lmWkRsql[i])) + "\");'>" +
                    "<i class='material-icons text-color-red'>remove_circle</i>" +
                  "</div>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'><b>" + lmWkRsql[i].id_user.trim().toUpperCase() + "</b></div>" +
                  "</div>" +
                "</div>" +
              "</li>";
        }
      } catch (loWkErro) {}

      loUlUser.innerHTML = lcUlUser;

      loSlUser.selectedIndex = 0;
    },
    error: function (jqXHR, textStatus, err) {
      loUlUser.innerHTML = lcUlUser;
    },
  });
}

function pesquisaUsuariosAutoridadeObjeto(lcIdFile, lcIdObjt) {
  var loSlUser = {},
    loUlUser = {};
  var lcSlRsql = "<option value=''>LISTA DE USUÁRIOS</option>",
    lcWkIsql = "",
    lcUlRsql = "",
    lcWkPoup = "";
  var lmWkIsql = [];

  if (
    goCdUser.id_user.trim().toUpperCase() == "ADMIN" ||
    goCdUser.us_grup.trim().toUpperCase() == "ADMINISTRADOR"
  ) {
  } else {
    return;
  }

  //prettier-ignore
  lcWkPoup =
    "<div class='popup'>" +
      "<div class='block'>" +
        "<p><a href='#' class='link popup-close'>fechar</a></p>" +
      "</div>" +
      "<div class='block-title'>" +
        "autoridade no campo" +
      "</div>" +
      "<div class='list no-hairlines-md'>" +
        "<ul>" +
          "<li class='item-content item-input'>" +
            "<div class='item-inner'>" +
              "<div class='item-title item-label'>usuário</div>" +
              "<div class='item-input-wrap input-dropdown-wrap'>" +
                "<select id='sltUser'></select>" +
              "</div>" +
            "</div>" +
          "</li>" +
        "</ul>" +
      "</div>" +
      "<div class='block'>" +
        "<p class='row'>" +
          "<button onclick='insereUsuarioAutoridadeObjeto(\"" + lcIdFile + "\", \"" + lcIdObjt + "\")' class='col button button-fill'>adicionar</button>" +
        "</p>" +
      "</div>" +
      "<div class='list'>" +
        "<ul id='uulUser'>" +
        "</ul>" +
      "</div>" +
    "</div>";

  app.popup
    .create({
      content: lcWkPoup,
    })
    .open();

  loSlUser = document.getElementById("sltUser");
  loUlUser = document.getElementById("uulUser");

  loSlUser.disabled = true;

  loSlUser.innerHTML = "<option value=''>CARREGANDO USUÁRIOS...</option>";

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcUsNome", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcUsMail", pa_tipo: "VarChar", pa_valo: null }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaUsuarios",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlUser.disabled = false;

      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            //prettier-ignore
            lcSlRsql += "<option value='" + lmWkRsql[i].id_user.trim().toUpperCase() + "'>" + lmWkRsql[i].id_user.trim().toUpperCase() + "</option>";
          }
        }
      } catch (loWkErro) {}

      loSlUser.innerHTML = lcSlRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlUser.disabled = false;

      loSlUser.innerHTML = lcSlRsql;
    },
  });

  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdFile", pa_tipo: "VarChar", pa_valo: lcIdFile },
    { pa_nome: "lcIdObjt", pa_tipo: "VarChar", pa_valo: lcIdObjt },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaUsuariosAutoridadeObjeto",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcUlRsql += 
            "<li>" +
              "<div class='item-content'>" +
                "<div class='item-media' onclick='deletaUsuarioAutoridadeObjeto(\"" + lcIdFile + "\", \"" + lcIdObjt + "\", \"" + escape(JSON.stringify(lmWkRsql[i])) + "\");'>" +
                  "<i class='material-icons text-color-red'>remove_circle</i>" +
                "</div>" +
                "<div class='item-inner'>" +
                  "<div class='item-title'><b>" + lmWkRsql[i].id_user.trim().toUpperCase() + "</b></div>" +
                "</div>" +
              "</div>" +
            "</li>";
        }
      } catch (loWkErro) {}

      loUlUser.innerHTML = lcUlRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loUlUser.innerHTML = lcUlRsql;
    },
  });
}

function fabriPdf(lmPeMvto) {
  var ldDtHoje = new Date();
  var lcPdHtml = "",
    lcPeMvto = "",
    lcClCnpj = "",
    lcLbCnpj = "",
    lcPeCfob = "",
    lcPeAssi = "",
    lcTpDeno = "",
    lcPeInfo = "";

  if (parseInt(lmPeMvto[0].pe_cfob) == 1) {
    lcPeCfob = "CIF";
  } else if (parseInt(lmPeMvto[0].pe_cfob) == 2) {
    lcPeCfob = "FOB";
  }

  if (parseInt(lmPeMvto[0].cl_pfpj) == 1) {
    lcLbCnpj = "cpf";
    lcClCnpj = lmPeMvto[0].cl_ncpf.trim().toUpperCase();
  } else if (parseInt(lmPeMvto[0].cl_pfpj) == 2) {
    lcLbCnpj = "cnpj";
    lcClCnpj = formataCnpj(lmPeMvto[0].cl_cnpj);
  }

  if (parseInt(lmPeMvto[0].id_nope) == 33) {
    lcPeAssi = "assistência";

    for (var i = 0; i < lmPeMvto.length; i++) {
      try {
        if (lmPeMvto[i].tp_deno.trim().length > 0) {
          lcTpDeno = lmPeMvto[i].tp_deno.trim().toUpperCase();
        } else {
          lcTpDeno = "";
        }
      } catch (error) {
        lcTpDeno = "";
      }

      //prettier-ignore
      lcPeMvto += 
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
            "<span style='font-size: small;'>" + lmPeMvto[i].ce_codi.trim().toUpperCase() + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: middle;'>" +
            "<span style='font-size: small;'>" + lmPeMvto[i].ce_deno.trim().toUpperCase() + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
            "<span style='font-size: small;'>" + lcTpDeno + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
            "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString() + "</span>" +
          "</td>" +
        "</tr>";
    }

    //prettier-ignore
    lcPeInfo = 
      "<br />" +
      "<span style='font-size: large;'>valores</span>" +
      "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "<span style='font-size: x-small;'>quantidade</span> <br />" +
            "<span style='font-size: small;'>" + lmPeMvto[0].pe_qtde.toString() + "</span>" +
          "</td>" +
        "</tr>" +
      "</table>" +
      "<br />" +
      "<span style='font-size: large;'>materiais</span>" +
      "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "código" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "denominação" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "motivo" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "qtde" +
          "</td>" +
        "</tr>" +
        lcPeMvto +
      "</table>";
  } else {
    lcPeAssi = "pedido";

    for (var i = 0; i < lmPeMvto.length; i++) {
      //prettier-ignore
      lcPeMvto += 
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
            "<span style='font-size: small;'>" + lmPeMvto[i].ce_codi.trim().toUpperCase() + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: middle;'>" +
            "<span style='font-size: small;'>" + lmPeMvto[i].ce_desc.trim().toUpperCase() + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
            "<span style='font-size: small;'>" + lmPeMvto[i].mp_qtde.toString() + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
            "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_prun) + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
            "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun) + "</span>" +
          "</td>" +
        "</tr>";
    }

    //prettier-ignore
    lcPeInfo = 
      "<br />" +
      "<span style='font-size: large;'>mais informações do pedido</span>" +
      "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
            "<span style='font-size: small;'>" + lmPeMvto[0].cp_deno.trim().toUpperCase() + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "<span style='font-size: x-small;'>frete</span> <br />" +
            "<span style='font-size: small;'>" + lcPeCfob + "</span>" +
          "</td>" +
        "</tr>" +
      "</table>" +
      "<br />" +
      "<span style='font-size: large;'>valores</span>" +
      "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "<span style='font-size: x-small;'>quantidade</span> <br />" +
            "<span style='font-size: small;'>" + lmPeMvto[0].pe_qtde.toString() + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "<span style='font-size: x-small;'>valor pedido</span> <br />" +
            "<span style='font-size: small;'>" + brMoney(lmPeMvto[0].pe_tota - lmPeMvto[0].pe_desc) + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "<span style='font-size: x-small;'>valor ipi</span> <br />" +
            "<span style='font-size: small;'>" + brMoney(lmPeMvto[0].pe_vipi) + "</span>" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "<span style='font-size: x-small;'>valor total</span> <br />" +
            "<span style='font-size: small;'>" + brMoney((lmPeMvto[0].pe_tota - lmPeMvto[0].pe_desc) + lmPeMvto[0].pe_vipi) + "</span>" +
          "</td>" +
        "</tr>" +
      "</table>" +
      "<br />" +
      "<span style='font-size: large;'>produtos</span>" +
      "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
        "<tr>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "código" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top;'>" +
            "denominação" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "qtde" +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "preço unit." +
          "</td>" +
          "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
            "total" +
          "</td>" +
        "</tr>" +
        lcPeMvto +
      "</table>" +
      "<br />" +
      "<div style='width: 100%; text-align: center; font-size: small;'>" +
        "PREÇOS SUJEITOS A ALTERAÇÃO" +
      "</div>";
  }

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>" + lcPeAssi + " " + lmPeMvto[0].pe_nume.toString().trim().toUpperCase() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/fbm.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "emitido em " + objetoDataParaStringData(ldDtHoje) + "</br>" + 
              "às " + ldDtHoje.toTimeString().split(" ")[0] + "</br>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>cliente</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].id_clie.toString().trim() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>" + lcLbCnpj + "</span> <br />" +
              "<span style='font-size: small;'>" + lcClCnpj + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>endereço</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_ende.trim().toUpperCase() + ", " + lmPeMvto[0].cl_nume.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>bairro</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_bair.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cidade</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].id_cida.trim().toUpperCase() + "/" + lmPeMvto[0].id_esta.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>cep</span> <br />" +
              "<span style='font-size: small;'>" + formataCep(lmPeMvto[0].cl_ncep.trim()) + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>inscrição</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_insc.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>fone</span> <br />" +
              "<span style='font-size: small;'>" + lmPeMvto[0].cl_fone.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        lcPeInfo +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    lcPeAssi +
                    "_" +
                    lmPeMvto[0].pe_nume.toString().trim().toUpperCase() +
                    "_fabrimoveis.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    lcPeAssi +
                      "_" +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      "_fabrimoveis.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente a(o) " +
                      lcPeAssi +
                      " " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da fabrimoveis",
                    lcPeAssi +
                      " " +
                      lmPeMvto[0].pe_nume.toString().trim() +
                      " da fabrimoveis"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPdHtml, {
        documentSize: "A4",
        type: "share",
        fileName:
          lcPeAssi +
          "_" +
          lmPeMvto[0].pe_nume.toString().trim().toUpperCase() +
          "_fabrimoveis.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      lcPeAssi +
        "_" +
        lmPeMvto[0].pe_nume.toString().trim().toUpperCase() +
        "_fabrimoveis",
      lcPdHtml
    );
  }
}

function fplPdf(loPeLcto, lmPeMvto) {
  var ldDtHoje = new Date(),
    ldDtDtvl = new Date();
  var lcPdHtml = "",
    lcPeMvto = "",
    lcMpDesc = "",
    lcPeDesc = "";
  var lnPeTota = 0;
  var llMpDesc = false;

  ldDtDtvl.setDate(ldDtDtvl.getDate() + 3);

  try {
    for (var i = 0; i < lmPeMvto.length; i++) {
      if (parseFloat(lmPeMvto[i].dm_pven) > parseFloat(lmPeMvto[i].mp_prun)) {
        llMpDesc = true;

        break;
      }
    }
  } catch (error) {}

  for (var i = 0; i < lmPeMvto.length; i++) {
    lnPeTota += lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun;

    if (llMpDesc) {
      //prettier-ignore
      lcMpDesc = 
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].dm_pven) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brDecimal(100 - (parseFloat(lmPeMvto[i].mp_prun) * 100) / parseFloat(lmPeMvto[i].dm_pven)) + " %</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(parseFloat(lmPeMvto[i].dm_pven) - parseFloat(lmPeMvto[i].mp_prun)) + "</span>" +
        "</td>";
    }

    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].id_dmat.toString() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].dm_deno.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brDecimal(lmPeMvto[i].mp_qtde) + "</span>" +
        "</td>" +
        lcMpDesc +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
      "</tr>";
  }

  if (parseFloat(loPeLcto.pe_desc) > 0) {
    //prettier-ignore
    lcPeDesc = 
      "<td style='border: 1px solid black; vertical-align: top;'>" +
        "<span style='font-size: x-small;'>desconto</span> <br />" +
        "<span style='font-size: small;'>" + brMoney(loPeLcto.pe_desc) + "</span>" +
      "</td>";
  }

  if (llMpDesc) {
    //prettier-ignore
    lcMpDesc = 
      "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
        "p. tabela" +
      "</td>" +
      "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
        "% desc." +
      "</td>" +
      "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
        "v. desc." +
      "</td>";
  }

  //prettier-ignore
  lcPdHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>pedido " + loPeLcto.pe_nume.toString().trim().toUpperCase() + "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/fpl.png' style='width: 250px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "emitido em " + objetoDataParaStringData(ldDtHoje) + "</br>" + 
              "às " + ldDtHoje.toTimeString().split(" ")[0] + "</br>" +
              "válido por 3 dias" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>cliente</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>código</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.id_clie.toString().trim() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>razão social</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.cl_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
              "<span style='font-size: x-small;'>vendedor</span> <br />" +
              "<span style='font-size: small;'>" + loPeLcto.vd_nome.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>valores</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeTota) + "</span>" +
            "</td>" +
            lcPeDesc +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>total líquido</span> <br />" +
              "<span style='font-size: small;'>" + brMoney(lnPeTota - loPeLcto.pe_desc) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>dados dos materiais</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "código" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "denominação" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "qtde" +
            "</td>" +
            lcMpDesc +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "preço" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
              "total" +
            "</td>" +
          "</tr>" +
          lcPeMvto +
        "</table>" +
        "<br />" +
        "<div style='width: 100%; text-align: center; font-size: small;'>" +
          "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
        "</div>" +
      "</body>" +
    "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName:
                    "pedido_" +
                    loPeLcto.pe_nume.toString().trim() +
                    "_ff_madeiras.pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    "pedido_" +
                      loPeLcto.pe_nume.toString().trim() +
                      "_ff_madeiras.pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da ff madeiras",
                    "pedido " +
                      loPeLcto.pe_nume.toString().trim() +
                      " da ff madeiras"
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcPdHtml, {
        documentSize: "A4",
        type: "share",
        fileName:
          "pedido_" + loPeLcto.pe_nume.toString().trim() + "_ff_madeiras.pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    impressaoPdf(
      screen.availWidth / 1.5,
      screen.availHeight / 1.5,
      "pedido_" + loPeLcto.pe_nume.toString().trim() + "_ff_madeiras",
      lcPdHtml
    );
  }
}

function rpCimentoECalPdf(loPeLcto, lmPeMvto) {
  var ldDtHoje = new Date(),
    ldNfDtdp = new Date(),
    ldCrDtve = new Date();
  var lcPdHtml = "",
    lcPeMvto = "",
    lcWkIsql = "",
    lcPeDupl = "";
  var lnPeTota = 0,
    lnPeQtde = 0,
    lnWkNpar = 0,
    lnWkVpar = 0,
    lnWkDeci = 0,
    lnCrValo = 0;
  var lmWkIsql = [];

  ldNfDtdp.setHours(0, 0, 0, 0);
  ldCrDtve.setHours(0, 0, 0, 0);

  for (var i = 0; i < lmPeMvto.length; i++) {
    lnPeTota += lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun;
    lnPeQtde += lmPeMvto[i].mp_qtde;

    //prettier-ignore
    lcPeMvto += 
      "<tr>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].id_dmat.toString() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].dm_deno.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + lmPeMvto[i].dm_unid.trim().toUpperCase() + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brDecimal(lmPeMvto[i].mp_qtde) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
        "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
          "<span style='font-size: small;'>" + brMoney(lmPeMvto[i].mp_qtde * lmPeMvto[i].mp_prun) + "</span>" +
        "</td>" +
      "</tr>";
  }

  try {
    if (jsonDate(loPeLcto.pe_data).trim().length > 0) {
      ldNfDtdp = stringDataParaObjetoData(jsonDate(loPeLcto.pe_data));
    }
  } catch (e) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCpgt", pa_tipo: "Int", pa_valo: parseInt(loPeLcto.id_cpgt) }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaParcelas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          //prettier-ignore
          lcPeDupl += 
            "<br />" +
            "<span style='font-size: large;'>parcelas</span>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "parcela" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "data de vencimento" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "valor" +
                "</td>" +
              "</tr>";

          lnWkNpar = lmWkRsql.length;
          lnWkVpar = parseInt(lnPeTota / lnWkNpar);
          lnWkDeci = lnPeTota - lnWkVpar * lnWkNpar;

          for (var i = 0; i < lmWkRsql.length; i++) {
            ldCrDtve = ldNfDtdp.addDays(parseInt(lmWkRsql[i].cp_dias));

            if (i == 0) {
              lnCrValo = lnWkVpar + lnWkDeci;
            } else {
              lnCrValo = lnWkVpar;
            }

            //prettier-ignore
            lcPeDupl += 
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + lmWkRsql[i].cp_parc.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + objetoDataParaStringData(ldCrDtve) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(lnCrValo) + "</span>" +
                "</td>" +
              "</tr>";
          }

          //prettier-ignore
          lcPeDupl += 
            "</table>";
        }
      } catch (loApErro) {}

      //prettier-ignore
      lcPdHtml =
        "<html>" +
          "<body>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; text-align: center; font-size: large;'>pedido " + loPeLcto.pe_nume.toString().trim().toUpperCase() + "</td>" +
                "<td style='border: 1px solid black; text-align: center;'>" +
                  "<img src='http://www.atscs.com.br/images/empresas/pdo.png' style='width: 250px;' />" +
                "</td>" +
                "<td style='border: 1px solid black; text-align: center;'>" +
                  "emitido em " + objetoDataParaStringData(ldDtHoje) + "</br>" + 
                  "às " + ldDtHoje.toTimeString().split(" ")[0] +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<span style='font-size: large;'>cliente</span>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>código</span> <br />" +
                  "<span style='font-size: small;'>" + loPeLcto.id_clie.toString().trim() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>razão social</span> <br />" +
                  "<span style='font-size: small;'>" + loPeLcto.cl_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
                  "<span style='font-size: x-small;'>nome fantasia</span> <br />" +
                  "<span style='font-size: small;'>" + loPeLcto.cl_fant.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
                  "<span style='font-size: x-small;'>vendedor</span> <br />" +
                  "<span style='font-size: small;'>" + loPeLcto.vd_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;' colspan='2'>" +
                  "<span style='font-size: x-small;'>condição de pagamento</span> <br />" +
                  "<span style='font-size: small;'>" + loPeLcto.cp_deno.trim().toUpperCase() + "</span>" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<span style='font-size: large;'>valores</span>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>quantidade de materiais</span> <br />" +
                  "<span style='font-size: small;'>" + lnPeQtde.toString() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "<span style='font-size: x-small;'>valor</span> <br />" +
                  "<span style='font-size: small;'>" + brMoney(lnPeTota) + "</span>" +
                "</td>" +
              "</tr>" +
            "</table>" +
            "<br />" +
            "<span style='font-size: large;'>dados dos materiais</span>" +
            "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "código" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top;'>" +
                  "denominação" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "un." +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "qtde" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "preço" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: top; text-align: center;'>" +
                  "total" +
                "</td>" +
              "</tr>" +
              lcPeMvto +
            "</table>" +
            lcPeDupl +
            "<br />" +
            "<div style='width: 100%; text-align: center; font-size: small;'>" +
              "aplicativo KERP desenvolvido por ATS Consultoria e Sistemas - www.ats.com.br" +
            "</div>" +
          "</body>" +
        "</html>";

      if (gcSiOper == "Android") {
        app.actions
          .create({
            grid: true,
            buttons: [
              {
                text: "visualizar",
                icon: "<i class='material-icons centraliza'>visibility</i>",
                onClick: function () {
                  app.dialog.progress("gerando pdf");

                  pdf
                    .fromData(lcPdHtml, {
                      documentSize: "A4",
                      type: "share",
                      fileName:
                        "pedido_" +
                        loPeLcto.pe_nume.toString().trim() +
                        "_rp_cimento_e_cal.pdf",
                    })
                    .then(function (lcPdStat) {
                      app.dialog.close();
                    })
                    .catch((lcPdErro) => console.log(lcPdErro));
                },
              },
              {
                text: "compartilhar",
                icon: "<i class='material-icons centraliza'>share</i>",
                onClick: function () {
                  app.dialog.progress("gerando pdf");

                  pdf
                    .fromData(lcPdHtml, { documentSize: "A4", type: "base64" })
                    .then(function (lo64Base) {
                      base64ParaPdf(
                        "pedido_" +
                          loPeLcto.pe_nume.toString().trim() +
                          "_rp_cimento_e_cal.pdf",
                        lo64Base,
                        "application/pdf",
                        "arquivo pdf referente ao pedido " +
                          loPeLcto.pe_nume.toString().trim() +
                          " da rp cimento e cal",
                        "pedido " +
                          loPeLcto.pe_nume.toString().trim() +
                          " da rp cimento e cal"
                      );
                    })
                    .catch((lcPdErro) => console.log(lcPdErro));
                },
              },
            ],
          })
          .open();
      } else if (gcSiOper == "iOS") {
        app.dialog.progress("gerando pdf");

        pdf
          .fromData(lcPdHtml, {
            documentSize: "A4",
            type: "share",
            fileName:
              "pedido_" +
              loPeLcto.pe_nume.toString().trim() +
              "_rp_cimento_e_cal.pdf",
          })
          .then(function (lcPdStat) {
            app.dialog.close();
          })
          .catch((lcPdErro) => console.log(lcPdErro));
      } else {
        impressaoPdf(
          screen.availWidth / 1.5,
          screen.availHeight / 1.5,
          "pedido_" + loPeLcto.pe_nume.toString().trim() + "_rp_cimento_e_cal",
          lcPdHtml
        );
      }
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined
          : cache.push(value) && value
        : value,
    indent
  );
  cache = null;
  return retVal;
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function datasEntreSemana(ldDtData) {
  var lnPdSema = ldDtData.getDate() - ldDtData.getDay();
  var lnUdSema = lnPdSema + 6;
  var loPuDsem = {
    pd_sema: new Date(ldDtData.setDate(lnPdSema)),
    ud_sema: new Date(ldDtData.setDate(lnUdSema)),
  };

  return loPuDsem;
}

function getMonday() {
  var d = new Date();
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 0);
  return new Date(d.setDate(diff));
}

function semana() {
  var firstday = getMonday();
  var lastday = firstday.addDays(6);

  firstday.setHours(0, 0, 0, 0);
  lastday.setHours(0, 0, 0, 0);

  return {
    sm_dmng: firstday,
    sm_sbdo: lastday,
  };
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  var view = new Uint8Array(buf); //create uint8array as viewer
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
  return buf;
}

function htmlTableToExcel(lcTbHtml, lcAbNome, lcAqNome) {
  var loTbHtml = document.createElement("table");

  loTbHtml.innerHTML = lcTbHtml;

  var wb = XLSX.utils.table_to_book(loTbHtml, { sheet: lcAbNome });

  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

  if (isMobile()) {
    compartilhaExcel(blob, lcAbNome, lcAqNome);
  } else {
    saveAs(blob, lcAqNome);
  }

  loTbHtml.remove();
}

function excel(lmWsData, lcAbNome, lcAqNome) {
  var wb = XLSX.utils.book_new();

  wb.SheetNames.push(lcAbNome);

  var ws_data = lmWsData;

  var ws = XLSX.utils.aoa_to_sheet(ws_data);

  wb.Sheets[lcAbNome] = ws;

  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

  if (isMobile()) {
    compartilhaExcel(blob, lcAbNome, lcAqNome);
  } else {
    saveAs(blob, lcAqNome);
  }
}

function compartilhaExcel(loExBlob, lcPdDesc, lcArNome) {
  var lcFdPath = "";

  window.requestFileSystem(
    LocalFileSystem.TEMPORARY,
    0,
    function (loWkDire) {
      lcFdPath = loWkDire.root.toURL();

      loWkDire.root.getFile(
        lcArNome,
        { create: true, exclusive: false },
        function (loWkFile) {
          loWkFile.createWriter(
            function (loWrFile) {
              loWrFile.write(loExBlob);

              window.plugins.socialsharing.share(
                lcPdDesc,
                lcPdDesc,
                lcFdPath + lcArNome
              );

              app.dialog.close();
            },
            function () {
              alerta(
                "não foi possível salvar o arquivo no caminho " +
                  lcFdPath +
                  " do seu celular",
                "alerta"
              );

              app.dialog.close();
            }
          );
        },
        function (loApErro) {
          app.dialog.close();
        }
      );
    },
    function (loApErro) {
      app.dialog.close();
    }
  );
}

function pad(lcNrNume, lnNrTmnh) {
  lcNrNume = lcNrNume.toString();

  while (lcNrNume.length < lnNrTmnh) {
    lcNrNume = "0" + lcNrNume;
  }

  return lcNrNume;
}

function isBusinessDay(date) {
  var day = date.getDay();
  if (day == 0 || day == 6) {
    return false;
  }
  return true;
}

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [
    this.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("");
};

addTimes = function (timeMap) {
  var totalH = 0,
    totalM = 0;

  // First simply adding all of it together, total hours and total minutes
  for (var x in timeMap) {
    totalH += parseInt(timeMap[x].hour, 10);
    totalM += parseInt(timeMap[x].minutes, 10);
  }

  // If the minutes exceed 60
  if (totalM >= 60) {
    // Divide minutes by 60 and add result to hours
    totalH += Math.floor(totalM / 60);
    // Add remainder of totalM / 60 to minutes
    totalM = totalM % 60;
  }

  return totalH + ":" + totalM;
};

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  img.crossOrigin = "Anonymous";
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  img.crossOrigin = "";
  return dataURL;
}

function datediff(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function redimensionaImagemPiorQualidade(base64, callback) {
  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 640; // ou outro valor menor
    canvas.height = 480;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var novoBase64 = canvas.toDataURL("image/jpeg", 0.7); // compressão 70%
    callback(novoBase64);
  };
  img.src = base64;
}

function redimensionaImagem(base64, callback) {
  const img = new Image();

  img.onload = function () {
    const MAX_WIDTH = 1500; // Aumentei para 1500 px

    const MAX_HEIGHT = 2000; // Mantendo uma proporção generosa para documentos

    let width = img.width;

    let height = img.height;

    // Mantém a proporção

    if (width > height) {
      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));

        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width = Math.round(width * (MAX_HEIGHT / height));

        height = MAX_HEIGHT;
      }
    }

    const canvas = document.createElement("canvas");

    canvas.width = width;

    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;

    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, width, height);

    // Mantém qualidade alta, mas se quiser pode ajustar para 0.85

    const novoBase64 = canvas.toDataURL("image/jpeg", 0.85);

    callback(novoBase64);
  };

  img.onerror = function () {
    console.error("Erro ao carregar imagem");

    callback(null);
  };

  img.src = base64;
}

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "::1" || // IPv6 localhost
    // Suporte a redes locais (ex: 192.168.x.x ou 10.x.x.x)
    /^192\.168\./.test(window.location.hostname) ||
    /^10\./.test(window.location.hostname)
);
