var gmReQtdeDHS = [],
  gmAtQtdeDHS = [],
  gmPmDataDHS = [],
  gmCdClieDHS = [],
  gmFuSglaDHS = [];
var goSsObraDHS = {},
  goSsSglaDHS = {};
var glAxPesqDHS = true;

function alteraDataDHS() {
  var loDtData = document.getElementById("datDataDHS");

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.value = loDtData.defaultValue;
  }

  if (
    loDtData.value.toString().trim().toUpperCase() ==
    loDtData.defaultValue.toString().trim().toUpperCase()
  ) {
    return;
  }

  pesquisaQuantidadeRecursosObraFuncaoRealDHS();
}

function selecionaTodasFuncoesDHS(llCbTdos) {
  var lmCbSgla = document.querySelectorAll('input[type="checkbox"]');
  var lmFuSgla = [];

  lmCbSgla.forEach((loCbSgla) => {
    var lcFuSgla = loCbSgla.value.toString().trim().toUpperCase();

    if (lcFuSgla.trim().length > 0) {
      loCbSgla.checked = llCbTdos;
    }
  });

  for (var i = 0; i < gmFuSglaDHS.length; i++) {
    lmFuSgla.push(gmFuSglaDHS[i].fu_sgla.trim().toUpperCase());
  }

  if (llCbTdos) {
    goSsSglaDHS.setValue(lmFuSgla);
  } else {
    goSsSglaDHS.setValue([]);
  }
}

function marcaDesmarcaCheckTodosFuncoesDHS() {
  var lmCbSgla = document.querySelectorAll('input[type="checkbox"]');
  var lnCtSgla = 0;
  var lmFuSgla = goSsSglaDHS.getValue();
  var llCbTdos = false;

  lmCbSgla.forEach((loCbSgla) => {
    var lcFuSgla = loCbSgla.value.toString().trim().toUpperCase();

    if (lcFuSgla.trim().length > 0 && loCbSgla.checked) {
      lnCtSgla++;
    }
  });

  lmCbSgla.forEach((loCbSgla) => {
    var lcFuSgla = loCbSgla.value.toString().trim().toUpperCase();

    if (lcFuSgla.trim().length == 0) {
      if (lnCtSgla == gmFuSglaDHS.length) {
        loCbSgla.checked = true;

        for (var i = 0; i < lmFuSgla.length; i++) {
          if (lmFuSgla[i].trim().length == 0) {
            llCbTdos = true;

            break;
          }
        }

        if (!llCbTdos) {
          lmFuSgla.push("");

          goSsSglaDHS.setValue(lmFuSgla);
        }
      } else {
        loCbSgla.checked = false;

        for (var i = 0; i < lmFuSgla.length; i++) {
          if (lmFuSgla[i].trim().length == 0) {
            lmFuSgla.splice(i, 1);

            goSsSglaDHS.setValue(lmFuSgla);

            break;
          }
        }
      }
    }
  });
}

function selecionaTodasObrasDHS(llCbTdos) {
  var lmCbObra = document.querySelectorAll('input[type="checkbox"]');
  var lmIdClie = [];

  lmCbObra.forEach((loCbObra) => {
    var lnIdClie = parseInt(loCbObra.value);

    if (!isNaN(lnIdClie) && lnIdClie > 0) {
      loCbObra.checked = llCbTdos;
    }
  });

  for (var i = 0; i < gmCdClieDHS.length; i++) {
    lmIdClie.push(gmCdClieDHS[i].id_clie.toString());
  }

  if (llCbTdos) {
    goSsObraDHS.setValue(lmIdClie);
  } else {
    goSsObraDHS.setValue([]);
  }
}

function marcaDesmarcaCheckTodosObrasDHS() {
  var lmCbObra = document.querySelectorAll('input[type="checkbox"]');
  var lnCtClie = 0;
  var lmIdClie = goSsObraDHS.getValue();
  var llCbTdos = false;

  lmCbObra.forEach((loCbObra) => {
    var lnIdClie = parseInt(loCbObra.value);

    if (!isNaN(lnIdClie) && lnIdClie > 0 && loCbObra.checked) {
      lnCtClie++;
    }
  });

  lmCbObra.forEach((loCbObra) => {
    var lnIdClie = parseInt(loCbObra.value);

    if (!isNaN(lnIdClie) && lnIdClie == 0) {
      if (lnCtClie == gmCdClieDHS.length) {
        loCbObra.checked = true;

        for (var i = 0; i < lmIdClie.length; i++) {
          if (parseInt(lmIdClie[i]) == 0) {
            llCbTdos = true;

            break;
          }
        }

        if (!llCbTdos) {
          lmIdClie.push("0");

          goSsObraDHS.setValue(lmIdClie);
        }
      } else {
        loCbObra.checked = false;

        for (var i = 0; i < lmIdClie.length; i++) {
          if (parseInt(lmIdClie[i]) == 0) {
            lmIdClie.splice(i, 1);

            goSsObraDHS.setValue(lmIdClie);

            break;
          }
        }
      }
    }
  });
}

function montaSemanasDHS() {
  var loDvHist = document.getElementById("divHistDHS");
  var lcLiHist = "",
    lcLiSgla = "";
  var lmFuSgla = goSsSglaDHS.getValue();
  var lnReQtde = 0,
    lnAtQtde = 0,
    lnToQtde = 0;

  for (var i = 0; i < lmFuSgla.length; i++) {
    if (lmFuSgla[i].trim().length == 0) {
      lmFuSgla.splice(i, 1);

      break;
    }
  }

  //prettier-ignore
  lcLiHist =
    "<table>" +
      "<thead>" +
        "<tr>" +
          "<th class='label-cell' style='text-align: center;'>função</th>" +
          "<th class='label-cell' style='text-align: center;'>real</th>";

  for (var i = 0; i < gmPmDataDHS.length; i++) {
    //prettier-ignore
    lcLiHist +=
          "<th class='label-cell' style='text-align: center;'>" + objetoDataParaStringData(gmPmDataDHS[i]) + "</th>";
  }

  //prettier-ignore
  lcLiHist +=
        "</tr>" +
      "</thead>" +
      "<tbody>";

  for (var i = 0; i < lmFuSgla.length; i++) {
    lnToQtde = 0;
    lcLiSgla = "";

    //prettier-ignore
    lcLiSgla +=
        "<tr>" +
          "<td class='label-cell' style='text-align: center;'>" + lmFuSgla[i].trim().toUpperCase() + "</td>";

    for (var j = 0; j < gmReQtdeDHS.length; j++) {
      if (
        lmFuSgla[i].trim().toUpperCase() ==
        gmReQtdeDHS[j].fu_sgla.trim().toUpperCase()
      ) {
        //prettier-ignore
        lcLiSgla +=
          "<td class='label-cell' style='text-align: center;'>" + gmReQtdeDHS[j].qt_rcso.toString() + "</td>";

        lnToQtde += parseInt(gmReQtdeDHS[j].qt_rcso);

        break;
      }
    }

    for (var j = 0; j < gmAtQtdeDHS.length; j++) {
      if (
        lmFuSgla[i].trim().toUpperCase() ==
        gmAtQtdeDHS[j].fu_sgla.trim().toUpperCase()
      ) {
        //prettier-ignore
        lcLiSgla +=
          "<td class='label-cell' style='text-align: center;'>" + gmAtQtdeDHS[j].at_qtde.toString() + "</td>";

        lnToQtde += parseInt(gmAtQtdeDHS[j].at_qtde);
      }
    }

    //prettier-ignore
    lcLiSgla +=
        "</tr>";

    if (lnToQtde > 0) {
      lcLiHist += lcLiSgla;
    }
  }

  for (var i = 0; i < gmReQtdeDHS.length; i++) {
    lnReQtde += parseInt(gmReQtdeDHS[i].qt_rcso);
  }

  //prettier-ignore
  lcLiHist +=
        "<tr>" +
          "<td class='label-cell' style='text-align: center;'><b>total</b></td>" +
          "<td class='label-cell' style='text-align: center;'><b>" + lnReQtde.toString() + "</b></td>";

  for (var i = 0; i < gmPmDataDHS.length; i++) {
    lnAtQtde = 0;

    for (var j = 0; j < gmAtQtdeDHS.length; j++) {
      if (
        objetoDataParaStringData(gmPmDataDHS[i]) ==
        jsonDate(gmAtQtdeDHS[j].pm_data)
      ) {
        lnAtQtde += parseInt(gmAtQtdeDHS[j].at_qtde);
      }
    }

    //prettier-ignore
    lcLiHist +=
          "<td class='label-cell' style='text-align: center;'><b>" + lnAtQtde.toString() + "</b></td>";
  }

  //prettier-ignore
  lcLiHist +=
        "</tr>" +
      "</tbody>" +
    "</table>";

  loDvHist.innerHTML = lcLiHist;
}

function pesquisaQuantidadeRecursosObraFuncaoAtualizacaoDHS(lmPmData) {
  var lcWkIsql = "",
    lcIdClie = "",
    lcFuSgla = "",
    lcPmData = "";
  var lmWkIsql = [],
    lmIdClie = goSsObraDHS.getValue(),
    lmFuSgla = goSsSglaDHS.getValue();

  if (lmPmData.length == 0) {
    montaSemanasDHS();

    return;
  }

  lcPmData = objetoDataParaStringSqlData(lmPmData[0]);

  if (lmIdClie.length > 0) {
    for (var i = 0; i < lmIdClie.length; i++) {
      if (parseInt(lmIdClie[i]) > 0) {
        lcIdClie += lmIdClie[i].toString() + ", ";
      }
    }

    lcIdClie = lcIdClie.slice(0, -2);
  }

  if (lmFuSgla.length > 0) {
    for (var i = 0; i < lmFuSgla.length; i++) {
      if (lmFuSgla[i].trim().length > 0) {
        lcFuSgla += lmFuSgla[i].trim().toUpperCase() + ", ";
      }
    }

    lcFuSgla = lcFuSgla.slice(0, -2);
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldPmData", pa_tipo: "SmallDatetime", pa_valo: lcPmData },
    { pa_nome: "lcIdClie", pa_tipo: "VarChar", pa_valo: lcIdClie },
    { pa_nome: "lcFuSgla", pa_tipo: "VarChar", pa_valo: lcFuSgla },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  app.dialog.preloader(
    "pesquisando quantidades por funções do dia " +
      objetoDataParaStringData(lmPmData[0])
  );

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaQuantidadeRecursosObraFuncaoAtualizacao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            gmAtQtdeDHS.push(lmWkRsql[i]);
          }
        }

        lmPmData.shift();

        pesquisaQuantidadeRecursosObraFuncaoAtualizacaoDHS(lmPmData);
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();

      lmPmData.shift();

      pesquisaQuantidadeRecursosObraFuncaoAtualizacaoDHS(lmPmData);
    },
  });
}

function pesquisaQuantidadeRecursosObraFuncaoRealDHS() {
  var loDtData = document.getElementById("datDataDHS");
  var lcWkIsql = "",
    lcDrData = "",
    lcIdClie = "",
    lcFuSgla = "";
  var lmWkIsql = [],
    lmIdClie = goSsObraDHS.getValue(),
    lmFuSgla = goSsSglaDHS.getValue(),
    lmPmData = [];
  var ldDtHoje = new Date(),
    ldPmDtat = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  lcDrData = objetoDataParaStringSqlData(ldDtHoje);

  try {
    if (loDtData.value.toString().trim().length > 0) {
      ldDrData = htmlDataParaObjetoData(loDtData.value);

      lcDrData = objetoDataParaStringSqlData(ldDrData);
    }
  } catch (error) {}

  if (lmIdClie.length > 0) {
    for (var i = 0; i < lmIdClie.length; i++) {
      if (parseInt(lmIdClie[i]) > 0) {
        lcIdClie += lmIdClie[i].toString() + ", ";
      }
    }

    lcIdClie = lcIdClie.slice(0, -2);
  }

  if (lmFuSgla.length > 0) {
    for (var i = 0; i < lmFuSgla.length; i++) {
      if (lmFuSgla[i].trim().length > 0) {
        lcFuSgla += lmFuSgla[i].trim().toUpperCase() + ", ";
      }
    }

    lcFuSgla = lcFuSgla.slice(0, -2);
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
    { pa_nome: "lcIdClie", pa_tipo: "VarChar", pa_valo: lcIdClie },
    { pa_nome: "lcFuSgla", pa_tipo: "VarChar", pa_valo: lcFuSgla },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposDHS();

  app.dialog.preloader("pesquisando quantidades por funções real");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaQuantidadeRecursosObraFuncaoReal",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      try {
        if (lmWkRsql.length > 0) {
          gmReQtdeDHS = lmWkRsql;

          ldPmDtat = stringDataParaObjetoData(jsonDate(lmWkRsql[0].pm_dtat));

          while (ldDrData <= new Date(ldPmDtat)) {
            if (ldDrData.getDay() === 1 || ldDrData.getDay() === 4) {
              gmPmDataDHS.push(new Date(ldDrData));

              lmPmData.push(new Date(ldDrData));
            }

            ldDrData.setDate(ldDrData.getDate() + 1);
          }

          // while (ldDrData.getDay() != 1) {
          //   ldDrData.setDate(ldDrData.getDate() + 1);
          // }

          // while (ldDrData <= new Date(ldPmDtat)) {
          //   gmPmDataDHS.push(new Date(ldDrData));

          //   lmPmData.push(new Date(ldDrData));

          //   ldDrData.setDate(ldDrData.getDate() + 7);
          // }

          pesquisaQuantidadeRecursosObraFuncaoAtualizacaoDHS(lmPmData);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function pesquisaSiglasDHS() {
  var loOgSgla = document.getElementById("ogrSglaDHS");
  var lcWkRsql = "",
    lcWkIsql = "";
  var lmWkIsql = [],
    lmFuSgla = [];

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  app.dialog.preloader("pesquisando funções");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSiglas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      gmFuSglaDHS = lmWkRsql;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].fu_sgla.trim().toUpperCase() + "'>" + lmWkRsql[i].fu_sgla.trim().toUpperCase() + "</option>";

          if (parseInt(lmWkRsql[i].pd_sgla) > 0) {
            lmFuSgla.push(lmWkRsql[i].fu_sgla.trim().toUpperCase());
          }
        }
      } catch (loApErro) {}

      loOgSgla.innerHTML = lcWkRsql;

      goSsSglaDHS.setValue(lmFuSgla);

      pesquisaQuantidadeRecursosObraFuncaoRealDHS();
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();

      loOgSgla.innerHTML = lcWkRsql;

      goSsSglaDHS.setValue(lmFuSgla);

      pesquisaQuantidadeRecursosObraFuncaoRealDHS();
    },
  });
}

function pesquisaObrasDefinidasDHS() {
  var loDtData = document.getElementById("datDataDHS"),
    loOgObra = document.getElementById("ogrObraDHS");
  var lcWkRsql = "",
    lcWkIsql = "",
    lcDrData = "";
  var lmWkIsql = [],
    lmIdClie = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcDrData = objetoDataParaStringSqlData(ldDtHoje);

  try {
    if (loDtData.value.toString().trim().length > 0) {
      lcDrData = objetoDataParaStringSqlData(
        htmlDataParaObjetoData(loDtData.value)
      );
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  app.dialog.preloader("pesquisando obras");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasComRecurso",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      gmCdClieDHS = lmWkRsql;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";

          if (parseInt(lmWkRsql[i].pd_clie) > 0) {
            lmIdClie.push(lmWkRsql[i].id_clie.toString());
          }
        }
      } catch (loApErro) {}

      loOgObra.innerHTML = lcWkRsql;

      goSsObraDHS.setValue(lmIdClie);

      pesquisaSiglasDHS();
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();

      loOgObra.innerHTML = lcWkRsql;

      goSsObraDHS.setValue(lmIdClie);

      pesquisaSiglasDHS();
    },
  });
}

function limpaCamposDHS() {
  var loDvHist = document.getElementById("divHistDHS");

  gmReQtdeDHS = [];
  gmAtQtdeDHS = [];
  gmPmDataDHS = [];

  loDvHist.innerHTML = "";
}

function DashHsSema() {
  var loDtData = document.getElementById("datDataDHS");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposDHS();

  gmCdClieDHS = [];
  gmFuSglaDHS = [];

  loDtData.valueAsDate = ldDtHoje;

  goSsObraDHS = app.smartSelect.create({
    el: ".clsObraDHS",
  });

  goSsObraDHS.on("closed", function () {
    if (glAxPesqDHS) {
      pesquisaQuantidadeRecursosObraFuncaoRealDHS();
    }
  });

  goSsObraDHS.on("opened", function () {
    var lmCbObra = document.querySelectorAll('input[type="checkbox"]');

    glAxPesqDHS = false;

    lmCbObra.forEach(function (loCbObra) {
      var lnIdClie = parseInt(loCbObra.value);

      if (!isNaN(lnIdClie)) {
        if (lnIdClie > 0) {
          loCbObra.addEventListener("change", function () {
            glAxPesqDHS = true;

            marcaDesmarcaCheckTodosObrasDHS();
          });
        } else {
          loCbObra.addEventListener("change", function () {
            glAxPesqDHS = true;

            selecionaTodasObrasDHS(loCbObra.checked);
          });
        }
      }
    });
  });

  goSsSglaDHS = app.smartSelect.create({
    el: ".clsSglaDHS",
  });

  goSsSglaDHS.on("closed", function () {
    if (glAxPesqDHS) {
      pesquisaQuantidadeRecursosObraFuncaoRealDHS();
    }
  });

  goSsSglaDHS.on("opened", function () {
    var lmCbSgla = document.querySelectorAll('input[type="checkbox"]');

    glAxPesqDHS = false;

    lmCbSgla.forEach(function (loCbSgla) {
      var lcFuSgla = loCbSgla.value.toString().trim().toUpperCase();

      if (lcFuSgla.trim().length > 0) {
        loCbSgla.addEventListener("change", function () {
          glAxPesqDHS = true;

          marcaDesmarcaCheckTodosFuncoesDHS();
        });
      } else {
        loCbSgla.addEventListener("change", function () {
          glAxPesqDHS = true;

          selecionaTodasFuncoesDHS(loCbSgla.checked);
        });
      }
    });
  });

  pesquisaObrasDefinidasDHS();

  OkTecladoAndroid("datDataDHS");
}
