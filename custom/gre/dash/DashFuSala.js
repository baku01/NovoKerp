function consultaMediaSalarialDFS() {
  var loSlObra = document.getElementById("sltObraDFS");
  var loSlData = document.getElementById("sltDataDFS");
  var loDvTitu = document.getElementById("divTituDFS");
  var loDvTdas = document.getElementById("divTdasDFS");
  var lcWkIsql = "",
    lcSlData = loSlData.value.toString().trim().toUpperCase(),
    lcDtTipo = lcSlData.substring(0, 1);
  var lmWkIsql = [];
  var lnIdCadt = null,
    lnDtPeri = parseInt(lcSlData.replace(/[^\d]+/g, ""));
  var ldSaDtde = new Date(),
    ldSaDtat = new Date();

  ldSaDtde.setHours(0, 0, 0, 0);
  ldSaDtat.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value) > 0) {
      lnIdCadt = parseInt(loSlObra.value);
    }
  } catch (e) {}

  if (lcDtTipo.trim().toUpperCase() == "D") {
    ldSaDtde.setDate(ldSaDtde.getDate() - lnDtPeri);
  } else if (lcDtTipo.trim().toUpperCase() == "M") {
    ldSaDtde.setMonth(ldSaDtde.getMonth() - lnDtPeri);
  } else if (lcDtTipo.trim().toUpperCase() == "A") {
    ldSaDtde.setFullYear(ldSaDtde.getFullYear() - lnDtPeri);
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    {
      pa_nome: "ldSaDtde",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldSaDtde),
    },
    {
      pa_nome: "ldSaDtat",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldSaDtat),
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaMediaSalarial",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      if (lmWkRsql.length > 0) {
        loDvTitu.style.display = "";

        //prettier-ignore
        loDvTdas.innerHTML +=
            "<div class='row no-gap'>" +
              "<div class='col borda' style='text-align: center'><b>função</b></div>" +
              "<div class='col borda' style='text-align: center'><b>salário</b></div>" +
            "</div>";

        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          loDvTdas.innerHTML +=
            "<div class='row no-gap'>" +
              "<div class='col borda' style='text-align: center'>" + lmWkRsql[i].fu_sgla.trim().toUpperCase() + "</div>" +
              "<div class='col borda' style='text-align: center'>" + brMoney(lmWkRsql[i].sa_sala) + "</div>" +
            "</div>";
        }
      }
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaMediaSalarialDFS() {
  var loSlObra = document.getElementById("sltObraDFS");
  var loSlData = document.getElementById("sltDataDFS");
  var loSlSgla = document.getElementById("sltSglaDFS");
  var loDvSala = document.getElementById("divSalaDFS");
  var loGoMtrz = {},
    loGoOpcs = {},
    loGoGraf = {};
  var lcWkIsql = "",
    lcSaData = "",
    lcFuSgla = null,
    lcSlData = loSlData.value.toString().trim().toUpperCase(),
    lcDtTipo = lcSlData.substring(0, 1);
  var lmWkIsql = [],
    lmWkGraf = [],
    lmWkGrf1 = [],
    lmFuSgla = [];
  var lnIdCadt = null,
    lnDtPeri = parseInt(lcSlData.replace(/[^\d]+/g, ""));
  var llFuSgla = false;
  var ldSaDtde = new Date(),
    ldSaDtat = new Date();

  ldSaDtde.setHours(0, 0, 0, 0);
  ldSaDtat.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value) > 0) {
      lnIdCadt = parseInt(loSlObra.value);
    }
  } catch (e) {}

  if (lcDtTipo.trim().toUpperCase() == "D") {
    ldSaDtde.setDate(ldSaDtde.getDate() - lnDtPeri);
  } else if (lcDtTipo.trim().toUpperCase() == "M") {
    ldSaDtde.setMonth(ldSaDtde.getMonth() - lnDtPeri);
  } else if (lcDtTipo.trim().toUpperCase() == "A") {
    ldSaDtde.setFullYear(ldSaDtde.getFullYear() - lnDtPeri);
  }

  if (loSlSgla.value.toString().trim().length > 0) {
    lcFuSgla = loSlSgla.value.toString().trim().toUpperCase();
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    {
      pa_nome: "ldSaDtde",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldSaDtde),
    },
    {
      pa_nome: "ldSaDtat",
      pa_tipo: "SmallDatetime",
      pa_valo: objetoDataParaStringSqlData(ldSaDtat),
    },
    { pa_nome: "lcFuSgla", pa_tipo: "VarChar", pa_valo: lcFuSgla },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaMediaSalarial",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      if (lmWkRsql.length > 0) {
        for (var i = 0; i < lmWkRsql.length; i++) {
          llFuSgla = false;

          for (var j = 0; j < lmFuSgla.length; j++) {
            if (
              lmWkRsql[i].fu_sgla.trim().toUpperCase() ==
              lmFuSgla[j].trim().toUpperCase()
            ) {
              llFuSgla = true;

              break;
            }
          }

          if (!llFuSgla) {
            lmFuSgla.push(lmWkRsql[i].fu_sgla.trim().toUpperCase());
          }
        }

        lmWkGraf.push("dia");

        for (var i = 0; i < lmFuSgla.length; i++) {
          lmWkGraf.push(lmFuSgla[i].trim().toUpperCase());
        }

        lmWkGrf1.push(lmWkGraf);

        for (var i = 0; i < lmWkRsql.length; i++) {
          if (lcSaData != jsonDate(lmWkRsql[i].sa_data)) {
            lmWkGraf = [];

            lcSaData = jsonDate(lmWkRsql[i].sa_data);

            lmWkGraf.push(lcSaData);

            for (var j = 0; j < lmFuSgla.length; j++) {
              llFuSgla = false;

              lcFuSgla = lmFuSgla[j].trim().toUpperCase();

              for (var k = 0; k < lmWkRsql.length; k++) {
                if (
                  lcSaData == jsonDate(lmWkRsql[k].sa_data) &&
                  lcFuSgla.trim().toUpperCase() ==
                    lmWkRsql[k].fu_sgla.trim().toUpperCase()
                ) {
                  llFuSgla = true;

                  lmWkGraf.push(parseFloat(lmWkRsql[k].sa_sala));

                  break;
                }
              }

              if (!llFuSgla) {
                lmWkGraf.push(0);
              }
            }

            lmWkGrf1.push(lmWkGraf);
          }
        }

        loGoMtrz = google.visualization.arrayToDataTable(lmWkGrf1);

        loGoOpcs = {
          legend: {
            position: "bottom",
            textStyle: {
              color: "#F3F3F3",
            },
          },
          hAxis: {
            titleTextStyle: { color: "#F3F3F3" },
            textStyle: {
              color: "#F3F3F3",
            },
          },
          vAxis: {
            minValue: 0,
            textStyle: {
              color: "#F3F3F3",
            },
          },
          backgroundColor: "#121212",
        };

        loGoGraf = new google.visualization.AreaChart(loDvSala);
        loGoGraf.draw(loGoMtrz, loGoOpcs);
      }
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaDFS() {
  limpaCamposDFS();
  pesquisaMediaSalarialDFS();
  consultaMediaSalarialDFS();
}

function pesquisaSiglasDFS() {
  var loSlSgla = document.getElementById("sltSglaDFS");
  var lcWkRsql = "<option value=''>TODAS AS FUNÇÕES</option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlSgla.disabled = true;

  loSlSgla.innerHTML = "<option value=''>CARREGANDO FUNÇÕES...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSiglas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlSgla.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].fu_sgla.trim().toUpperCase() + "'>" + lmWkRsql[i].fu_sgla.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlSgla.innerHTML = lcWkRsql;

      pesquisaDFS();
    },
    error: function (jqXHR, textStatus, err) {
      loSlSgla.disabled = false;

      loSlSgla.innerHTML = lcWkRsql;

      pesquisaDFS();
    },
  });
}

function pesquisaObrasDFS() {
  var loSlObra = document.getElementById("sltObraDFS");
  var lcWkRsql = "<option value='0'>TODAS AS OBRAS</option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

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
          lcWkRsql += "<option value='" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlObra.innerHTML = lcWkRsql;

      pesquisaSiglasDFS();
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcWkRsql;

      pesquisaSiglasDFS();
    },
  });
}

function limpaCamposDFS() {
  var loDvSala = document.getElementById("divSalaDFS");
  var loDvTitu = document.getElementById("divTituDFS");
  var loDvTdas = document.getElementById("divTdasDFS");

  loDvSala.innerHTML = "";

  loDvTitu.style.display = "none";

  loDvTdas.innerHTML = "";
}

function DashFuSala() {
  limpaCamposDFS();

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(pesquisaObrasDFS);
}
