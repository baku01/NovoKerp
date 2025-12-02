var gmWkRsqlMHL = [];
var gnInListMHL = 0;

function mapaMHL(lcMpEnde) {
  var loSlEmpr = document.getElementById("sltEmprTPK");
  var loDvMapa = document.getElementById("divMapaMHL");
  var loMpEnde = JSON.parse(unescape(lcMpEnde));
  var loMpMark = {},
    loLtLong = {
      lat: 0,
      lng: 0,
    },
    loIfWind = new google.maps.InfoWindow(),
    loApMapa = {},
    loMpLine = {};
  var lmMpLine = [];
  var llLtLong = false;

  loDvMapa.innerHTML = "";

  try {
    if (!isNaN(parseFloat(loMpEnde.mp_lati) + parseFloat(loMpEnde.mp_long))) {
      llLtLong = true;
    }
  } catch (error) {}

  try {
    if (llLtLong) {
      loLtLong = {
        lat: parseFloat(loMpEnde.mp_lati),
        lng: parseFloat(loMpEnde.mp_long),
      };
    } else {
      loLtLong = {
        lat: parseFloat(goCdUser.em_lati),
        lng: parseFloat(goCdUser.em_long),
      };
    }

    loApMapa = new google.maps.Map(loDvMapa, {
      center: loLtLong,
      zoom: 8,
    });

    loOvMark = new OverlappingMarkerSpiderfier(loApMapa, {
      markersWontMove: true,
      markersWontHide: true,
      basicFormatEvents: true,
      keepSpiderfied: true,
    });

    loMpMark = new google.maps.Marker({
      position: loLtLong,
      map: loApMapa,
      icon: {
        path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
        fillColor: loSlEmpr.value.toString().split("/")[1].trim().toUpperCase(),
        fillOpacity: 1,
        anchor: new google.maps.Point(12, 17),
        strokeWeight: 2,
        scale: 1.5,
        labelOrigin: new google.maps.Point(12, 9),
      },
    });

    if (llLtLong) {
      //prettier-ignore
      google.maps.event.addListener(loMpMark, "spider_click",
        (function (loIfWind, loMpMark, loSlVend, loMpEnde) {
          return function () {
            loIfWind.setContent(
              "<div style='color: black;'> " +
                "<b> " +
                  goCdUser.id_user.trim().toUpperCase() +
                "</b><br />  " +
                loMpEnde.mp_ende + ", " + loMpEnde.mp_nume + "<br />  " +
                loMpEnde.mp_cida + ", " + loMpEnde.mp_esta + ", " + loMpEnde.mp_ncep +
              "</div>"
            );
            
            loIfWind.open(loApMapa, loMpMark);
          };
        })(loIfWind, loMpMark, loSlVend, loMpEnde));
    } else {
      //prettier-ignore
      google.maps.event.addListener(loMpMark, "spider_click",
        (function (loIfWind, loMpMark) {
          return function () {
            loIfWind.setContent(
              "<div style='color: black;'> " +
                "<b> " +
                  goCdUser.em_fant.trim().toUpperCase() +
                "</b>" +
              "</div>"
            );
            
            loIfWind.open(loApMapa, loMpMark);
          };
        })(loIfWind, loMpMark));
    }

    google.maps.event.addListener(
      loMpMark,
      "click",
      (function (loIfWind) {
        return function () {
          loIfWind.close();
        };
      })(loIfWind)
    );

    loOvMark.addMarker(loMpMark);
  } catch (loApErro) {}

  //prettier-ignore
  for (var i = 0; i < gmWkRsqlMHL.length; i++) {
    if (gmWkRsqlMHL[i].mp_lati.toString().trim().length > 0 && gmWkRsqlMHL[i].mp_long.toString().trim().length > 0) {
      loLtLong = {
        lat: parseFloat(gmWkRsqlMHL[i].mp_lati),
        lng: parseFloat(gmWkRsqlMHL[i].mp_long)
      };

      loMpMark = new google.maps.Marker({
        position: loLtLong,
        map: loApMapa,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillOpacity: 1,
          fillColor: "#fff",
          strokeOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#333",
          scale: 12
        },
        label: { color: "#000", fontSize: "12px", fontWeight: "600", text: ((i - gmWkRsqlMHL.length) * -1).toString() }
      });

      google.maps.event.addListener(
        loMpMark,
        "spider_click",
        (function(loIfWind, loMpMark, i) {
          return function() {
            loIfWind.setContent(
              "<div style='color: black;' onclick='aplicativoMapa(\"" + gmWkRsqlMHL[i].mp_lati.toString().trim() + "\", \"" + gmWkRsqlMHL[i].mp_long.toString().trim() + "\");'> " +
                "<b> " + gmWkRsqlMHL[i].us_nome.trim().toUpperCase() + "</b><br /> " +
                gmWkRsqlMHL[i].mp_ende.trim().toUpperCase() + ", " + gmWkRsqlMHL[i].mp_nume.trim().toUpperCase() + ", " + formataCep(gmWkRsqlMHL[i].mp_ncep) + "<br />  " +
                gmWkRsqlMHL[i].mp_cida.trim().toUpperCase() + "/" + gmWkRsqlMHL[i].mp_esta.trim().toUpperCase() + "<br /> " +
                jsonDate(gmWkRsqlMHL[i].mp_data) + " " + jsonHora(gmWkRsqlMHL[i].mp_data) +
              "</div>"
            );

            loIfWind.open(loApMapa, loMpMark);
          };
        })(loIfWind, loMpMark, i)
      );

      google.maps.event.addListener(
        loMpMark,
        "click",
        (function (loIfWind) {
          return function () {
            loIfWind.close();
          };
        })(loIfWind)
      );

      loOvMark.addMarker(loMpMark);

      lmMpLine.push({
        lat: parseFloat(gmWkRsqlMHL[i].mp_lati),
        lng: parseFloat(gmWkRsqlMHL[i].mp_long)
      });
    }
  }

  loMpLine = new google.maps.Polyline({
    path: lmMpLine,
    strokeColor: "#00B3FD",
  });

  loMpLine.setMap(loApMapa);
}

function montaGridMHL() {
  var loDvLoad = document.getElementById("divLoadMHL");
  var lcWkRsql = "";
  var lnFnList = 0;

  if (gnInListMHL + 20 >= gmWkRsqlMHL.length) {
    app.infiniteScroll.destroy($$("#divRribRR"));
    loDvLoad.style.display = "none";
    lnFnList = gmWkRsqlMHL.length;
  } else {
    loDvLoad.style.display = "";
    lnFnList = gnInListMHL + 20;
  }

  for (var i = gnInListMHL; i < lnFnList; i++) {
    //prettier-ignore
    lcWkRsql +=
      "<li>" +
        "<div class='item-content'>" +
          "<div class='item-inner'>" +
            "<div class='item-title-row'>" +
              "<div class='item-title'><b>" + jsonDate(gmWkRsqlMHL[i].mp_data) + "</b></div>" +
              "<div class='item-after'><b>" + jsonHora(gmWkRsqlMHL[i].mp_data) + "</b></div>" + 
            "</div>" +
            "<div class='item-subtitle'><b>" + gmWkRsqlMHL[i].mp_cida.trim().toUpperCase() + "/" + gmWkRsqlMHL[i].mp_esta.trim().toUpperCase() + "</b></div>" + 
            "<div class='item-text'><b>" + gmWkRsqlMHL[i].mp_ende.trim().toUpperCase() + ", " + gmWkRsqlMHL[i].mp_nume.trim().toUpperCase() + ", " + formataCep(gmWkRsqlMHL[i].mp_ncep) + "</b></div>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListMHL = i;

  $("#uulGridMHL").append(lcWkRsql);
}

function pesquisaMHL() {
  var loDvUser = document.getElementById("divUserMHL");
  var loDtInic = document.getElementById("datInicMHL");
  var loDtFnal = document.getElementById("datFnalMHL");
  var lcWkIsql = "",
    lcMpDtde = null,
    lcMpDtat = null;
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposMHL();

  if (
    loDtInic.value.toString().trim().length == 0 &&
    loDtFnal.value.toString().trim().length > 0
  ) {
    alerta("preencha a data inicial", "alerta");

    return;
  }

  if (
    loDtInic.value.toString().trim().length > 0 &&
    loDtFnal.value.toString().trim().length == 0
  ) {
    alerta("preencha a data final", "alerta");

    return;
  }

  if (
    htmlDataParaObjetoData(loDtInic.value) >
    htmlDataParaObjetoData(loDtFnal.value)
  ) {
    alerta("data inicial maior que data final", "alerta");

    return;
  }

  if (htmlDataParaObjetoData(loDtFnal.value) > ldDtHoje) {
    alerta("data final maior que data atual", "alerta");

    return;
  }

  if (loDtInic.value.toString().trim().length > 0) {
    lcMpDtde = loDtInic.value.toString().trim();
  }

  if (loDtFnal.value.toString().trim().length > 0) {
    lcMpDtat = loDtFnal.value.toString().trim();
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: loDvUser.innerHTML.trim() },
    { pa_nome: "ldMpDtde", pa_tipo: "SmallDateTime", pa_valo: lcMpDtde },
    { pa_nome: "ldMpDtat", pa_tipo: "SmallDateTime", pa_valo: lcMpDtat }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaLocaisUsuario",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmWkRsqlMHL = lmWkRsql;

          app.infiniteScroll.create($$("#divHistMHL"));

          montaGridMHL();

          $$("#divHistMHL").on("infinite", function () {
            montaGridMHL();
          });
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      alerta(
        "não foi possível pesquisar locais do usuário, verifique sua conexão com a internet",
        "alerta"
      );
    },
  });
}

function limpaCamposMHL() {
  var loUlGrid = document.getElementById("uulGridMHL");
  var loDvLoad = document.getElementById("divLoadMHL");
  var loDvMapa = document.getElementById("divMapaMHL");

  gmWkRsqlMHL = [];
  gnInListMHL = 0;

  loUlGrid.innerHTML = "";

  loDvLoad.style.display = "none";

  loDvMapa.innerHTML = "";
}

function MapaHsLoca() {
  var loDtInic = document.getElementById("datInicMHL");
  var loDtFnal = document.getElementById("datFnalMHL");
  var loDvUser = document.getElementById("divUserMHL");
  var loDvNome = document.getElementById("divNomeMHL");
  var ldDtHoje = new Date();
  var loUlLoca = {};

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtInic.valueAsDate = ldDtHoje;
  loDtFnal.valueAsDate = ldDtHoje;

  limpaCamposMHL();

  app.dialog.preloader("carregando...");

  setTimeout(function () {
    try {
      loUlLoca = JSON.parse(sessionStorage.getItem("soUlLoca"));

      if (loUlLoca.id_user.trim().length > 0) {
        sessionStorage.removeItem("soUlLoca");

        loDvUser.innerHTML = loUlLoca.id_user.trim().toUpperCase();
        loDvNome.innerHTML = loUlLoca.us_nome.trim().toUpperCase();

        pesquisaMHL();
      }
    } catch (loApErro) {}

    app.dialog.close();
  }, 500);
}
