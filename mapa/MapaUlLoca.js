var gmWkRsqlMUL = [];

function mapaMUL() {
  var loSlEmpr = document.getElementById("sltEmprTPK");
  var loDvMapa = document.getElementById("divMapaMUL");
  var loMpMark = {},
    loLtLong = {},
    loIfWind = {},
    loApMapa = {};
  var lcSbTitu = "",
    lcMpIcon = "",
    lcMkOncl = "";
  var llUsMapa = false;

  //prettier-ignore
  try {
    for (var i = 0; i < gmWkRsqlMUL.length; i++) {
      if (gmWkRsqlMUL[i].id_user.trim().toUpperCase() == goCdUser.id_user.trim().toUpperCase() ) {
        loApMapa = new google.maps.Map(loDvMapa, {
          center: {
            lat: parseFloat(gmWkRsqlMUL[i].mp_lati),
            lng: parseFloat(gmWkRsqlMUL[i].mp_long)
          },
          zoom: 8
        });

        llUsMapa = true;

        break;
      }
    }

    loIfWind = new google.maps.InfoWindow();

    if (!llUsMapa) {
      loApMapa = new google.maps.Map(loDvMapa, {
        center: {
          lat: parseFloat(goCdUser.em_lati),
          lng: parseFloat(goCdUser.em_long)
        },
        zoom: 8
      });

      loLtLong = {
        lat: parseFloat(goCdUser.em_lati),
        lng: parseFloat(goCdUser.em_long)
      };

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
        }
      });

      google.maps.event.addListener(
        loMpMark,
        "click",
        (function(loMpMark) {
          return function() {
            lcSbTitu = 
              "<div style='color: black;'> " +
                "<b> " +
                  goCdUser.em_fant.trim().toUpperCase() +
                "</b>" +
              "</div>";

            loIfWind.setContent(lcSbTitu);
            loIfWind.open(loApMapa, loMpMark);
          };
        })(loMpMark, i)
      );
    }

    for (var i = 0; i < gmWkRsqlMUL.length; i++) {
      loLtLong = {
        lat: parseFloat(gmWkRsqlMUL[i].mp_lati),
        lng: parseFloat(gmWkRsqlMUL[i].mp_long)
      };

      if (gmWkRsqlMUL[i].id_user.trim().toUpperCase() == goCdUser.id_user.trim().toUpperCase()) {
        lcMpIcon = loSlEmpr.value.toString().split("/")[1].trim().toUpperCase();
      } else {
        lcMpIcon = "#FF0000";
      }

      loMpMark = new google.maps.Marker({
        position: loLtLong,
        map: loApMapa,
        icon: {
          path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
          fillColor: lcMpIcon,
          fillOpacity: 1,
          anchor: new google.maps.Point(12, 17),
          strokeWeight: 2,
          scale: 1.5,
          labelOrigin: new google.maps.Point(12, 9),
        }
      });

      google.maps.event.addListener(
        loMpMark,
        "click",
        (function(loMpMark, i) {
          return function() {
            if (gmWkRsqlMUL[i].id_user.trim().toUpperCase() == goCdUser.id_user.trim().toUpperCase()) {
              lcMkOncl = "";
            } else {
              lcMkOncl = " onclick='aplicativoMapa(\"" + gmWkRsqlMUL[i].mp_lati.toString().trim() + "\", \"" + gmWkRsqlMUL[i].mp_long.toString().trim() + "\");'";
            }

            lcSbTitu = 
              "<div style='color: black;'" + lcMkOncl + "> " +
                "<b> " + gmWkRsqlMUL[i].us_nome.trim().toUpperCase() + "</b><br />  " +
                gmWkRsqlMUL[i].mp_ende.trim().toUpperCase() + ", " + gmWkRsqlMUL[i].mp_nume.trim().toUpperCase() + ", " + formataCep(gmWkRsqlMUL[i].mp_ncep) + "<br /> " +
                gmWkRsqlMUL[i].mp_cida.trim().toUpperCase() + "/" + gmWkRsqlMUL[i].mp_esta.trim().toUpperCase() + "<br /> " +
                jsonDate(gmWkRsqlMUL[i].mp_data) + " " + jsonHora(gmWkRsqlMUL[i].mp_data) +
              "</div>";

            loIfWind.setContent(lcSbTitu);
            loIfWind.open(loApMapa, loMpMark);
          };
        })(loMpMark, i)
      );
    }
  } catch (loApErro) {}
}

function pesquisaLocaisUsuarioMUL(lcWkRsql) {
  var loWkRsql = JSON.parse(unescape(lcWkRsql));

  sessionStorage.setItem("soUlLoca", JSON.stringify(loWkRsql));

  redireciona("mapa/MapaHsLoca.html", "MapaHsLoca.html");
}

function montaGridMUL(lmWkRsql) {
  var loUlGrid = document.getElementById("uulGridMUL");
  var lcWkRsql = "";

  for (var i = 0; i < lmWkRsql.length; i++) {
    //prettier-ignore
    lcWkRsql +=
      "<li>" +
        "<a href='#' class='item-link item-content' onclick='pesquisaLocaisUsuarioMUL(\"" + escape(JSON.stringify(lmWkRsql[i])) + "\");'>" +
          "<div class='item-inner'>" +
            "<div class='item-title-row'>" +
              "<div class='item-title'><b>" + lmWkRsql[i].us_nome.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + jsonHora(lmWkRsql[i].mp_data) + "</b></div>" +
            "</div>" +
            "<div class='item-subtitle'><b>" + jsonDate(lmWkRsql[i].mp_data) + "</b></div>" +
            "<div class='item-text'><b>" + lmWkRsql[i].mp_ende.trim().toUpperCase() + ", " + lmWkRsql[i].mp_nume.trim().toUpperCase() + ", " + formataCep(lmWkRsql[i].mp_ncep) + ", " + lmWkRsql[i].mp_cida.trim().toUpperCase() + "/" + lmWkRsql[i].mp_esta.trim().toUpperCase() + "</b></div>" +
          "</div>" +
        "</a>" +
      "<li>";
  }

  loUlGrid.innerHTML = lcWkRsql;
}

function pesquisaMUL() {
  var loDvLoad = document.getElementById("divLoadMUL");
  var lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposMUL();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaLocalUsuarios",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          gmWkRsqlMUL = lmWkRsql;

          montaGridMUL(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";

      alerta(
        "não foi possível pesquisar últimas localizações dos usuários, verifique sua conexão com a internet",
        "erro"
      );
    },
  });
}

function limpaCamposMUL() {
  var loUlGrid = document.getElementById("uulGridMUL");
  var loDvLoad = document.getElementById("divLoadMUL");
  var loDvMapa = document.getElementById("divMapaMUL");

  gmWkRsqlMUL = [];

  loUlGrid.innerHTML = "";

  loDvLoad.style.display = "none";

  loDvMapa.innerHTML = "";
}

function MapaUlLoca() {
  limpaCamposMUL();

  pesquisaMUL();
}
