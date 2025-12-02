var gmWkRdiaCRR = [],
  gmSrRdiaCRR = [];

function montaRecursosDiaCRR() {
  var loUlRcso = document.getElementById("uulRcsoCRR");
  var lcUlRcso = "",
    lcOsTipo = "",
    lcSrRdia = "",
    lcOsNume = "";
  var lnOsTipo = -1;

  //prettier-ignore
  for (var i = 0; i < gmWkRdiaCRR.length; i++) {
    lcSrRdia = "";

    if (parseInt(gmWkRdiaCRR[i].os_tipo) != lnOsTipo) {
      lcOsNume = "";
      lnOsTipo = parseInt(gmWkRdiaCRR[i].os_tipo);
      
      if (lnOsTipo == 1) {
        lcOsTipo = "EMPREITA";
      } else if (lnOsTipo == 2) {
        lcOsTipo = "HORA HOMEM";
      } else if (lnOsTipo == 3) {
        lcOsTipo = "LOCAÇÃO";
      } else if (lnOsTipo == 4) {
        lcOsTipo = "PRODUTO";
      } else {
        lcOsTipo = "OUTROS";
      }

      lcUlRcso += 
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title' style='color: " + corTema() + "'><b>" + lcOsTipo + "</b></div>" +
            "</div>" +
          "</div>" +
        "</li>";
    }

    if (gmWkRdiaCRR[i].os_nume.trim().toUpperCase() != lcOsNume.trim().toUpperCase()) {
      lcOsNume = gmWkRdiaCRR[i].os_nume.trim().toUpperCase();

      lcUlRcso += 
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title text-color-orange'><b> proposta " + lcOsNume + "</b></div>" +
            "</div>" +
          "</div>" +
        "</li>";
    }

    if (parseInt(gmWkRdiaCRR[i].os_tipo) == 0) {
      for (var j = 0; j < gmSrRdiaCRR.length; j++) {
        if (gmWkRdiaCRR[i].fu_sgla.trim().toUpperCase() == gmSrRdiaCRR[j].fu_sgla.trim().toUpperCase() && parseInt(gmWkRdiaCRR[i].os_tipo) == parseInt(gmSrRdiaCRR[j].os_tipo)) {
          lcSrRdia += 
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>" + gmSrRdiaCRR[j].sr_deno.trim().toUpperCase() + "</div>" +
                      "<div class='item-after'>" + gmSrRdiaCRR[j].qt_apnt.toString() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>";
        }
      }
      
      lcUlRcso += 
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + gmWkRdiaCRR[i].fu_sgla.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRdiaCRR[i].qt_apnt.toString() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                lcSrRdia +
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    } else {
      lcUlRcso += 
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + gmWkRdiaCRR[i].fu_sgla.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRdiaCRR[i].qt_apnt.toString() + "</b></div>" +
            "</div>" +
          "</div>" +
        "</li>";
    }    
  }

  loUlRcso.innerHTML = lcUlRcso;
}

function pesquisaStatusRecursosDiaCRR() {
  var loDtData = document.getElementById("datDataCRR");
  var loSlObra = document.getElementById("sltObraCRR");
  var loDvLoad = document.getElementById("divLoadCRR");
  var lnIdClie = 0;
  var lcWkIsql = "",
    lcDtData = "1900-01-01";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length == 0) {
    alerta("data inválida", "alerta");

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    alerta("data maior que data atual", "alerta");

    return;
  } else {
    lcDtData = loDtData.value.toString().trim().toUpperCase();
  }

  try {
    if (parseInt(loSlObra.value) > 0) {
      lnIdClie = parseInt(loSlObra.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDtData },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaStatusRecursosDia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmSrRdiaCRR = lmWkRsql;

      montaRecursosDiaCRR();
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";

      montaRecursosDiaCRR();
    },
  });
}

function pesquisaRecursosDiaCRR() {
  var loDtData = document.getElementById("datDataCRR");
  var loSlObra = document.getElementById("sltObraCRR");
  var loDvLoad = document.getElementById("divLoadCRR");
  var lnIdClie = 0;
  var lcWkIsql = "",
    lcDtData = "1900-01-01";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposCRR();

  if (loDtData.value.toString().trim().length == 0) {
    alerta("data inválida", "alerta");

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    alerta("data maior que data atual", "alerta");

    return;
  } else {
    lcDtData = loDtData.value.toString().trim().toUpperCase();
  }

  try {
    if (parseInt(loSlObra.value) > 0) {
      lnIdClie = parseInt(loSlObra.value);
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDtData },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursosDia",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRdiaCRR = lmWkRsql;

      pesquisaStatusRecursosDiaCRR();

      try {
        montaRecursosDiaCRR(lmWkRsql);
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";

      pesquisaStatusRecursosDiaCRR();
    },
  });
}

function alteraDataCRR() {
  var loDtData = document.getElementById("datDataCRR");

  if (
    loDtData.defaultValue.toString().trim().toUpperCase() ==
    loDtData.value.toString().trim().toUpperCase()
  ) {
    return;
  }

  pesquisaObrasDefinidasCRR();
}

function pesquisaObrasDefinidasCRR() {
  var loDtData = document.getElementById("datDataCRR");
  var loSlObra = document.getElementById("sltObraCRR");
  var lcWkRsql = "<option value='0'></option>",
    lcWkIsql = "",
    lcDtData = "1900-01-01";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposCRR();

  if (loDtData.value.toString().trim().length == 0) {
    alerta("data inválida", "alerta");

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    alerta("data maior que data atual", "alerta");

    return;
  } else {
    lcDtData = loDtData.value.toString().trim().toUpperCase();
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDtData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidas",
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
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcWkRsql;
    },
  });
}

function limpaCamposCRR() {
  var loUlRcso = document.getElementById("uulRcsoCRR");
  var loDvLoad = document.getElementById("divLoadCRR");

  gmWkRdiaCRR = [];
  gmSrRdiaCRR = [];

  loUlRcso.innerHTML = "";

  loDvLoad.style.display = "none";
}

function ComlRlRdia() {
  var loDtData = document.getElementById("datDataCRR");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtData.valueAsDate = ldDtHoje;

  pesquisaObrasDefinidasCRR();
}
