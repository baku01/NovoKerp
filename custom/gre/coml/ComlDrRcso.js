function pesquisaRecursosCDR() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loDvRcso = document.getElementById("divRcsoCOA");
  var loDvCard = document.getElementById("divCardCOA");
  var lcWkIsql = "";
  var lnIdCadt = 0;
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDrData = new Date(1900, 0, 1, 0, 0, 0, 0);

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value.toString().trim());
  } else {
    app.input.validate(loDtData);

    return;
  }

  if (ldDrData > ldDtHoje) {
    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(ldDrData) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmDrRcsoCDR = lmWkRsql;

      pintaRecursosCDR();
    },
    error: function (jqXHR, textStatus, err) {},
  });

  if (gmDrRcsoCOA.length == 0) {
    ldDrData.setDate(ldDrData.getDate() - 1);

    while (!isBusinessDay(ldDrData)) {
      ldDrData.setDate(ldDrData.getDate() - 1);
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
      { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(ldDrData) },
    ];

    lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

    $.ajax({
      url:
        goCdUser.ws_http.trim() +
        "chamadaProcedure?lcWkIsql=" +
        lcWkIsql +
        "&lcWkProc=pesquisaRecursos",
      type: "GET",
      dataType: "jsonp",

      success: function (lmWkRsql) {
        gmDrRcsoCOA = lmWkRsql;

        apontamentosPendentesCOA();
      },
      error: function (jqXHR, textStatus, err) {
        loDvRcso.style.display = "";
        loDvCard.style.display = "";
      },
    });
  }
}

function pintaRecursosCDR() {
  var loDtData = document.getElementById("datDataCOA");
  var loDvPndt = document.getElementById("divPndtCDR");
  var loLiRcso = {};
  var lnIdDsem = 0;
  var ldDrData = new Date();

  ldDrData.setHours(0, 0, 0, 0);

  if (gmDrRcsoCDR.length > 0 && gmDrJornCOA.length > 0) {
    loDvPndt.style.display = "none";
  }

  try {
    for (var i = 0; i < gmSmRcsoCOA.length; i++) {
      loLiRcso = document.getElementById(
        "lli" +
          gmSmRcsoCOA[i].fu_empr.toString() +
          gmSmRcsoCOA[i].id_matr.toString() +
          gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() +
          "CDR"
      );

      if (loLiRcso) {
        loLiRcso.style.backgroundColor = "";
      }
    }
  } catch (error) {}

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  } else {
    loDtData.valueAsDate = ldDrData;
  }

  lnIdDsem = ldDrData.getDay();

  for (var i = 0; i < gmDrRcsoCDR.length; i++) {
    loLiRcso = document.getElementById(
      "lli" +
        gmDrRcsoCDR[i].fu_empr.toString() +
        gmDrRcsoCDR[i].id_matr.toString() +
        gmDrRcsoCDR[i].dr_tipo.trim().toUpperCase() +
        "CDR"
    );

    if (loLiRcso) {
      // if (
      //   parseInt(gmDrRcsoCDR[i].ap_feri) + parseInt(gmDrRcsoCDR[i].tb_feri) >
      //     0 ||
      //   lnIdDsem == 0 ||
      //   lnIdDsem == 6
      // ) {
      //   loLiRcso.style.backgroundColor = "rgba(0, 255, 0, 0.25)";
      // }
      // else if (parseInt(gmDrRcsoCDR[i].ap_ords) == 0) {
      //   if (parseInt(gmDrRcsoCDR[i].to_con1) > 0) {
      //     loLiRcso.style.backgroundColor = "rgba(0, 255, 0, 0.25)";
      //   } else if (parseInt(gmDrRcsoCDR[i].to_cont) == 0) {
      //     loLiRcso.style.backgroundColor = "rgba(0, 255, 0, 0.25)";
      //   }
      // } else if (parseInt(gmDrRcsoCDR[i].ap_ords) > 0) {
      //   for (var j = 0; j < gmDrJornCOA.length; j++) {
      //     if (
      //       gmDrRcsoCDR[i].fu_empr.trim().toUpperCase() ==
      //         gmDrJornCOA[j].fu_empr.trim().toUpperCase() &&
      //       parseInt(gmDrRcsoCDR[i].id_matr) ==
      //         parseInt(gmDrJornCOA[j].id_matr) &&
      //       gmDrRcsoCDR[i].dr_tipo.trim().toUpperCase() ==
      //         gmDrJornCOA[j].dr_tipo.trim().toUpperCase() &&
      //       parseInt(gmDrJornCOA[j].id_dsem) == lnIdDsem + 1
      //     ) {
      //       if (parseInt(gmDrRcsoCDR[i].ap_mnts) > 0) {
      //         if (
      //           parseInt(gmDrRcsoCDR[i].ap_mnts) >=
      //           parseInt(gmDrJornCOA[j].jo_mnts) - 10
      //         ) {
      //           loLiRcso.style.backgroundColor = "rgba(0, 255, 0, 0.25)";
      //         } else {
      //           loLiRcso.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
      //         }
      //       }

      //       break;
      //     }
      //   }
      // }
      // else {
        for (var j = 0; j < gmDrJornCOA.length; j++) {
          if (
            gmDrRcsoCDR[i].fu_empr.trim().toUpperCase() ==
              gmDrJornCOA[j].fu_empr.trim().toUpperCase() &&
            parseInt(gmDrRcsoCDR[i].id_matr) ==
              parseInt(gmDrJornCOA[j].id_matr) &&
            gmDrRcsoCDR[i].dr_tipo.trim().toUpperCase() ==
              gmDrJornCOA[j].dr_tipo.trim().toUpperCase() &&
            parseInt(gmDrJornCOA[j].id_dsem) == lnIdDsem + 1
          ) {
            if (parseInt(gmDrRcsoCDR[i].ap_mnts) > 0) {
              if (
                parseInt(gmDrRcsoCDR[i].ap_mnts) >=
                parseInt(gmDrJornCOA[j].jo_mnts) - 10
              ) {
                loLiRcso.style.backgroundColor = "rgba(0, 255, 0, 0.25)";
              } else {
                loLiRcso.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
              }
            }

            break;
          }
        }
      // }
    }
  }
}

function marcaRecursoCDR(lcWkRsql) {
  var loLiStrc = document.getElementById("lliStrcCOA");
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loWkRsql = JSON.parse(unescape(lcWkRsql));
  var loCbRcso = {};
  var lnCtChck = 0;

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    if (
      gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() ==
        loWkRsql.fu_empr.trim().toUpperCase() &&
      parseInt(gmSmRcsoCOA[i].id_matr) == parseInt(loWkRsql.id_matr) &&
      gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() ==
        loWkRsql.dr_tipo.trim().toUpperCase()
    ) {
      loCbRcso = document.getElementById(
        "ckb" +
          gmSmRcsoCOA[i].fu_empr.toString() +
          gmSmRcsoCOA[i].id_matr.toString() +
          gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() +
          "CDR"
      );

      gmSmRcsoCOA[i]["dr_chck"] = loCbRcso.checked;
    }

    try {
      if (gmSmRcsoCOA[i].dr_chck) {
        lnCtChck++;
      }
    } catch (error) {}
  }

  if (lnCtChck > 0) {
    loLiStrc.style.display = "";
  } else {
    loLiStrc.style.display = "none";
    loSlStrc.selectedIndex = 0;

    alteraStatusRecursoCOA();
  }
}

function montaRecursosCDR() {
  var loDtData = document.getElementById("datDataCOA");
  var loUlRcso = document.getElementById("uulRcsoCDR");
  var lcDrChck = "",
    lcWkRsql = "",
    lcFuFcon = "",
    lcDtFcon = "";
  var ldDrData = new Date();

  ldDrData.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  } else {
    loDtData.valueAsDate = ldDrData;
  }

  try {
    for (var i = 0; i < gmSmRcsoCOA.length; i++) {
      lcDrChck = "";
      lcFuFcon = "";
      lcDtFcon = "";

      try {
        if (gmSmRcsoCOA[i].dr_chck) {
          lcDrChck = " checked";
        }
      } catch (error) {}

      if (jsonDate(gmSmRcsoCOA[i].fu_fcon).trim().length > 0) {
        lcDtFcon = jsonDate(gmSmRcsoCOA[i].fu_fcon);
        lcFuFcon = "<br />fim do contrato experiência: " + lcDtFcon;

        if (jsonDate(gmSmRcsoCOA[i].fu_dpro).trim().length > 0) {
          if (
            stringDataParaObjetoData(jsonDate(gmSmRcsoCOA[i].fu_dpro)) >
            stringDataParaObjetoData(jsonDate(gmSmRcsoCOA[i].fu_fcon))
          ) {
            lcDtFcon = jsonDate(gmSmRcsoCOA[i].fu_fcon);
            lcFuFcon = "<br />prorrogação do contrato experiência: " + lcDtFcon;
          }
        }

        if (stringDataParaObjetoData(lcDtFcon) < ldDrData) {
          lcFuFcon = "";
        }
      }

      //prettier-ignore
      lcWkRsql += 
        "<li id='lli" + gmSmRcsoCOA[i].fu_empr.toString() + gmSmRcsoCOA[i].id_matr.toString() + gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() + "CDR'>" +
          "<label class='item-checkbox item-content'>" +
            "<input id='ckb" + gmSmRcsoCOA[i].fu_empr.toString() + gmSmRcsoCOA[i].id_matr.toString() + gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() + "CDR' type='checkbox' value='" + gmSmRcsoCOA[i].fu_empr.toString() + "/" + gmSmRcsoCOA[i].id_matr.toString() + "/" + gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() + "' onchange='marcaRecursoCDR(\"" + escape(JSON.stringify(gmSmRcsoCOA[i])) + "\");'" + lcDrChck + ">" +
            "<i class='icon icon-checkbox'></i>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" + 
                "<div class='item-title'>" + gmSmRcsoCOA[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                "<div class='item-after'>" + gmSmRcsoCOA[i].id_matr.toString() + "</div>" +
              "</div>" +
              "<div class='item-subtitle'>" + gmSmRcsoCOA[i].fu_nome.trim().toUpperCase() + "</div>" +
              "<div class='item-text'>" + 
                gmSmRcsoCOA[i].fu_func.trim().toUpperCase() + lcFuFcon +
              "</div>" +
            "</div>" +
          "</label>" +
        "</li>";
    }
  } catch (loApErro) {}

  loUlRcso.innerHTML = lcWkRsql;

  try {
    pintaRecursosCDR();
  } catch (error) {}
}

function ComlDrRcso() {
  montaRecursosCDR();

  OkTecladoAndroid("txtPesqCDR");
}
