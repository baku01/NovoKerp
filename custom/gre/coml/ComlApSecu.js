var gmApSecuCAS = [];

function pesquisaRecursosCAS() {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
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
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function insereFotoCAS(i, lmApApnt, llRiPior, lnIdStrc, lmEmRcso, loApApnt) {
  if (i >= gmApFotoCOA.length) {
    goDgFotoCOA.close();

    lmApApnt = lmApApnt.slice(1);

    if (lmApApnt.length > 0) {
      montaDivergenciasApontamentosCAS();
      insereApontamentoCAS(lmApApnt);
    } else {
      if (lnIdStrc == 2) {
        enviaEmailAfastadoAtestadoCOA(lmEmRcso, loApApnt);
      } else if (lnIdStrc == 16) {
        enviaEmailFaltaJustificadaCOA(lmEmRcso, loApApnt);
      } else {
        notificacao("apontamento salvo", "sucesso");

        novoApontamentoCOA();

        goMnView.router.back();
      }
    }

    return;
  }

  if (gmApFotoCOA[i].ap_foto.trim().indexOf("base64") > 0) {
    $.ajax({
      url: goCdUser.ws_http.trim() + "insereFoto",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        lcBsFoto: gmApFotoCOA[i].ap_foto,
        lcWkPath: "apontamentos/" + goApApntCOA.id_apnt.toString() + "/",
        lcWkFoto: Math.random().toString(36).substring(7) + ".png",
      }),

      success: function (loWkRsql) {
        insereFotoCAS(i + 1, lmApApnt, false, lnIdStrc, lmEmRcso, loApApnt);
      },
      error: function (jqXHR, textStatus, err) {
        if (llRiPior) {
          redimensionaImagemPiorQualidade(
            gmApFotoCOA[i].ap_foto,
            function (lcNvBase) {
              gmApFotoCOA[i].ap_foto = lcNvBase;

              insereFotoCAS(i, lmApApnt, false, lnIdStrc, lmEmRcso, loApApnt);
            }
          );
        } else {
          redimensionaImagem(gmApFotoCOA[i].ap_foto, function (lcNvBase) {
            gmApFotoCOA[i].ap_foto = lcNvBase;

            insereFotoCAS(i, lmApApnt, true, lnIdStrc, lmEmRcso, loApApnt);
          });
        }
      },
    });
  } else {
    insereFotoCAS(i + 1, lmApApnt, false, lnIdStrc, lmEmRcso, loApApnt);
  }
}

function insereApontamentoCAS(lmApApnt) {
  var loSlObra = document.getElementById("sltObraCOA");
  var loDtData = document.getElementById("datDataCOA");
  var loCbFeri = document.getElementById("chbFeriCOA");
  var loLiStrc = document.getElementById("lliStrcCOA");
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loLiJflt = document.getElementById("lliJfltCOA");
  var loSlJflt = document.getElementById("sltJfltCOA");
  var loLiObsr = document.getElementById("lliObsrCOA");
  var loTaObsr = document.getElementById("txaObsrCOA");
  var loLiNume = document.getElementById("lliNumeCOA");
  var loNrNume = document.getElementById("nroNumeCOA");
  var loLiSirc = document.getElementById("lliSircCOA");
  var loSlSirc = document.getElementById("sltSircCOA");
  var loLiJust = document.getElementById("lliJustCOA");
  var loSlJust = document.getElementById("sltJustCOA");
  var loLiObju = document.getElementById("lliObjuCOA");
  var loTaObju = document.getElementById("txaObjuCOA");
  var loLiRpju = document.getElementById("lliRpjuCOA");
  var loSlRpju = document.getElementById("sltRpjuCOA");
  var loLiAtiv = document.getElementById("lliAtivCOA");
  var loLiDres = document.getElementById("lliDresCOA");
  var loNrDres = document.getElementById("nroDresCOA");
  var loLiDatv = document.getElementById("lliDatvCOA");
  var loTaDatv = document.getElementById("txaDatvCOA");
  var ldDtHoje = new Date();
  var lnIdClie = 0,
    lnIdStrc = 0,
    lnIdOrds = 0,
    lnApHent = parseFloat(lmApApnt[0].ap_hent),
    lnApHiin = parseFloat(lmApApnt[0].ap_hiin),
    lnApHtin = parseFloat(lmApApnt[0].ap_htin),
    lnApHter = parseFloat(lmApApnt[0].ap_hter),
    lnIdSirc = 0,
    lnIdJust = 0,
    lnIdRpju = 0,
    lnIdAtiv = 0,
    lnApDres = -1,
    lnApFeri = 0,
    lnIdExcl = 0,
    lnIdJflt = 0;
  var lcApObsr = "",
    lcApObju = "",
    lcApDatv = "",
    lcWkIsql = "",
    lcApData = "",
    lcIdMatr = lmApApnt[0].id_matr.trim().toUpperCase(),
    lcIdEqto = lmApApnt[0].id_eqto.trim().toUpperCase();
  var lmWkIsql = [],
    lmEmRcso = [],
    lmIdMatr = [],
    lmIdEqto = [];

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    notificacao("obra inválida", "alerta");

    goMnView.router.back();

    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    notificacao("data do apontamento inválida", "alerta");

    goMnView.router.back();

    return;
  } else if (htmlDataParaObjetoData(loDtData.value) > ldDtHoje) {
    notificacao("data do apontamento maior que data atual", "alerta");

    goMnView.router.back();

    return;
  } else {
    lcApData = loDtData.value.toString().trim().toUpperCase();
  }

  if (loCbFeri.checked) {
    lnApFeri = 1;
  }

  if (lcIdMatr.trim().length + lcIdEqto.trim().length == 0) {
    notificacao("nenhum recurso selecionado", "alerta");

    goMnView.router.back();

    return;
  }

  try {
    if (parseInt(loSlStrc.value.toString().split("/")[0].trim()) > 0) {
      lnIdStrc = parseInt(loSlStrc.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (loLiStrc.style.display.trim().length == 0 && lnIdStrc == 0) {
    notificacao("status do recurso inválido", "alerta");

    goMnView.router.back();

    return;
  }

  if (loLiJflt.style.display.trim().length == 0) {
    try {
      if (parseInt(loSlJflt.value) > 0) {
        lnIdJflt = parseInt(loSlJflt.value);
      }
    } catch (error) {}

    if (lnIdJflt == 0) {
      alerta("justificativa da falta inválida", "alerta");

      return;
    }
  }

  if (loLiObsr.style.display.trim().length == 0) {
    lcApObsr = loTaObsr.value.toString().trim().toUpperCase();
  }

  if (
    loLiNume.style.display.trim().length == 0 &&
    loNrNume.value.toString().trim().length > 0
  ) {
    try {
      if (parseInt(goOsLctoCOA.id_ords) > 0) {
        lnIdOrds = parseInt(goOsLctoCOA.id_ords);
      }
    } catch (error) {}
  }

  if (
    loLiNume.style.display.trim().length == 0 &&
    loNrNume.value.toString().trim().length == 0 &&
    lnIdOrds == 0
  ) {
    notificacao("proposta inválida", "alerta");

    goMnView.router.back();

    return;
  }

  try {
    if (parseInt(loSlSirc.value.toString().split("/")[0].trim()) > 0) {
      lnIdSirc = parseInt(loSlSirc.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (loLiSirc.style.display.trim().length == 0 && lnIdSirc == 0) {
    notificacao("situação do recurso inválida", "alerta");

    goMnView.router.back();

    return;
  }

  try {
    if (parseInt(loSlJust.value) > 0) {
      lnIdJust = parseInt(loSlJust.value);
    }
  } catch (error) {}

  if (loLiJust.style.display.trim().length == 0 && lnIdJust == 0) {
    notificacao("justificativa inválida", "alerta");

    goMnView.router.back();

    return;
  }

  if (loLiObju.style.display.trim().length == 0) {
    lcApObju = loTaObju.value.toString().trim().toUpperCase();
  }

  try {
    if (parseInt(loSlRpju.value) > 0) {
      lnIdRpju = parseInt(loSlRpju.value);
    }
  } catch (error) {}

  if (loLiRpju.style.display.trim().length == 0 && lnIdRpju == 0) {
    notificacao("responsabilidade inválida", "alerta");

    goMnView.router.back();

    return;
  }

  try {
    if (goOsTareCOA.at_tipo.trim().toUpperCase() == "A") {
      lnIdAtiv = parseInt(goOsTareCOA.id_ativ);
    } else if (goOsTareCOA.at_tipo.trim().toUpperCase() == "T") {
      lnIdExcl = parseInt(goOsTareCOA.id_excl);
    }
  } catch (error) {}

  if (
    loLiAtiv.style.display.trim().length == 0 &&
    lnIdAtiv == 0 &&
    lnIdExcl == 0
  ) {
    notificacao("atividade inválida", "alerta");

    goMnView.router.back();

    return;
  }

  try {
    if (parseFloat(loNrDres.value) >= 0) {
      lnApDres = parseFloat(loNrDres.value);
    }
  } catch (error) {}

  if (loLiDres.style.display.trim().length == 0 && lnApDres < 0) {
    app.input.validate(loNrDres);

    notificacao("quantidade de dias restantes inválida", "alerta");

    goMnView.router.back();

    return;
  }

  if (loTaDatv.value.toString().trim().length > 0) {
    lcApDatv = loTaDatv.value.toString().trim().toUpperCase();
  }

  if (
    loLiDatv.style.display.trim().length == 0 &&
    lcApDatv.trim().length == 0
  ) {
    notificacao("descrição das atividades inválida", "alerta");

    goMnView.router.back();

    return;
  }

  if (lnApDres < 0) {
    lnApDres = 0;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdApnt", pa_tipo: "Int", pa_valo: 0 },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: lcApData },
    { pa_nome: "lnIdStrc", pa_tipo: "Int", pa_valo: lnIdStrc },
    { pa_nome: "lnIdJflt", pa_tipo: "Int", pa_valo: lnIdJflt },
    { pa_nome: "lcApObsr", pa_tipo: "VarChar", pa_valo: lcApObsr },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
    { pa_nome: "lnApHent", pa_tipo: "Decimal", pa_valo: lnApHent },
    { pa_nome: "lnApHiin", pa_tipo: "Decimal", pa_valo: lnApHiin },
    { pa_nome: "lnApHtin", pa_tipo: "Decimal", pa_valo: lnApHtin },
    { pa_nome: "lnApHter", pa_tipo: "Decimal", pa_valo: lnApHter },
    { pa_nome: "lnIdSirc", pa_tipo: "Int", pa_valo: lnIdSirc },
    { pa_nome: "lnIdJust", pa_tipo: "Int", pa_valo: lnIdJust },
    { pa_nome: "lcApObju", pa_tipo: "VarChar", pa_valo: lcApObju },
    { pa_nome: "lnIdRpju", pa_tipo: "Int", pa_valo: lnIdRpju },
    { pa_nome: "lnIdAtiv", pa_tipo: "Int", pa_valo: lnIdAtiv },
    { pa_nome: "lnApDres", pa_tipo: "Decimal", pa_valo: lnApDres },
    { pa_nome: "lcApDatv", pa_tipo: "VarChar", pa_valo: lcApDatv },
    { pa_nome: "lnApFeri", pa_tipo: "Int", pa_valo: lnApFeri },
    { pa_nome: "lnIdExcl", pa_tipo: "Int", pa_valo: lnIdExcl },
    { pa_nome: "lcIdMatr", pa_tipo: "VarChar", pa_valo: lcIdMatr },
    { pa_nome: "lcIdEqto", pa_tipo: "VarChar", pa_valo: lcIdEqto }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  insereComentarioCOA();

  app.dialog.progress("enviando apontamento");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereApontamento",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      try {
        if (lmWkRsql[0].ap_erro.trim().length > 0) {
          pesquisaRecursosCAS();

          alerta(lmWkRsql[0].ap_erro.trim().toLowerCase(), "alerta");

          return;
        }
      } catch (error) {}

      try {
        if (lmWkRsql.length > 0) {
          goApApntCOA = lmWkRsql[0];

          lmIdMatr = lmApApnt[0].id_matr.split(",");
          lmIdEqto = lmApApnt[0].id_eqto.split(",");

          for (var i = 0; i < gmSmRcsoCOA.length; i++) {
            try {
              if (gmSmRcsoCOA[i].dr_chck) {
                if (gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "E") {
                  for (var j = 0; j < lmIdEqto.length; j++) {
                    if (
                      parseInt(gmSmRcsoCOA[i].id_matr) == parseInt(lmIdEqto[j])
                    ) {
                      gmSmRcsoCOA[i]["dr_chck"] = false;

                      lmEmRcso.push(gmSmRcsoCOA[i]);

                      break;
                    }
                  }
                } else {
                  for (var j = 0; j < lmIdMatr.length; j++) {
                    if (
                      gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() ==
                        lmIdMatr[j].trim().slice(-3).toUpperCase() &&
                      parseInt(gmSmRcsoCOA[i].id_matr) ==
                        parseInt(lmIdMatr[j].replace(/[^\d]+/g, ""))
                    ) {
                      gmSmRcsoCOA[i]["dr_chck"] = false;

                      lmEmRcso.push(gmSmRcsoCOA[i]);

                      break;
                    }
                  }
                }
              }
            } catch (error) {}
          }

          if (lnIdStrc == 6) {
            enviaEmailFolgaCampoCOA(lmEmRcso, goApApntCOA);
          }

          if (lnIdStrc == 9) {
            enviaEmailTransferenciaCOA(lmEmRcso, goApApntCOA);
          }

          if (lnIdStrc == 10) {
            enviaEmailDispensadoCOA(lmEmRcso, goApApntCOA);
          }

          if (lnIdStrc == 17) {
            enviaEmailAbonoCOA(lmEmRcso, goApApntCOA);
          }

          if (
            lnIdRpju == 1 ||
            lnIdRpju == 2 ||
            lnIdSirc == 4 ||
            lnIdSirc == 5 ||
            lnIdSirc == 3
          ) {
            enviaEmailResponsabilidadeCOA(lmEmRcso, goApApntCOA);
          }

          if (gmApFotoCOA.length > 0) {
            goDgFotoCOA = app.dialog.progress("enviando fotos");

            insereFotoCAS(0, lmApApnt, false, lnIdStrc, lmEmRcso, goApApntCOA);
          } else {
            lmApApnt = lmApApnt.slice(1);

            if (lmApApnt.length > 0) {
              montaDivergenciasApontamentosCAS();

              insereApontamentoCAS(lmApApnt);
            } else {
              notificacao("apontamento salvo", "sucesso");

              novoApontamentoCOA();

              goMnView.router.back();
            }
          }
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function adicionaApontamentosCAS() {
  var loDtData = document.getElementById("datDataCOA"),
    loRdDigi = document.getElementById("rdoDigiCAS"),
    loHrHent = document.getElementById("hraHentCAS"),
    loHrHiin = document.getElementById("hraHiinCAS"),
    loHrHtin = document.getElementById("hraHtinCAS"),
    loHrHter = document.getElementById("hraHterCAS");
  var lnApHent = 0,
    lnApHiin = 0,
    lnApHtin = 0,
    lnApHter = 0;
  var lmApApnt = [],
    lmHrHora = [];
  var lcIdMatr = "",
    lcIdEqto = "";
  var llApSecu = false;
  var ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);

  if (loRdDigi.checked) {
    for (var i = 0; i < gmSmRcsoCOA.length; i++) {
      try {
        if (gmSmRcsoCOA[i].dr_chck) {
          if (gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "E") {
            lcIdEqto += gmSmRcsoCOA[i].id_matr.toString() + ", ";
          } else {
            lcIdMatr +=
              gmSmRcsoCOA[i].id_matr.toString() +
              gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() +
              ", ";
          }
        }
      } catch (error) {}
    }

    if (lcIdMatr.trim().length + lcIdEqto.trim().length > 0) {
      if (lcIdMatr.trim().length > 0) {
        lcIdMatr = lcIdMatr.trim().slice(0, -1);
      }

      if (lcIdEqto.trim().length > 0) {
        lcIdEqto = lcIdEqto.trim().slice(0, -1);
      }
    } else {
      alerta("nenhum recurso selecionado", "alerta");

      return;
    }

    try {
      if (
        loHrHent.value.toString().trim().length > 0 &&
        loHrHent.value.toString().trim() != "00:00"
      ) {
        lnApHent = parseFloat(loHrHent.value.toString().replace(":", "."));

        ldApHent = new Date(htmlDataParaObjetoData(loDtData.value));

        lmHrHora = loHrHent.value.toString().split(":");

        ldApHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
      }
    } catch (error) {}

    try {
      if (
        loHrHiin.value.toString().trim().length > 0 &&
        loHrHiin.value.toString().trim() != "00:00"
      ) {
        lnApHiin = parseFloat(loHrHiin.value.toString().replace(":", "."));

        ldApHiin = new Date(htmlDataParaObjetoData(loDtData.value));

        lmHrHora = loHrHiin.value.toString().split(":");

        ldApHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
      }
    } catch (error) {}

    try {
      if (
        loHrHtin.value.toString().trim().length > 0 &&
        loHrHtin.value.toString().trim() != "00:00"
      ) {
        lnApHtin = parseFloat(loHrHtin.value.toString().replace(":", "."));

        ldApHtin = new Date(htmlDataParaObjetoData(loDtData.value));

        lmHrHora = loHrHtin.value.toString().split(":");

        ldApHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
      }
    } catch (error) {}

    try {
      if (
        loHrHter.value.toString().trim().length > 0 &&
        loHrHter.value.toString().trim() != "00:00"
      ) {
        lnApHter = parseFloat(loHrHter.value.toString().replace(":", "."));

        ldApHter = new Date(htmlDataParaObjetoData(loDtData.value));

        lmHrHora = loHrHter.value.toString().split(":");

        ldApHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
      }
    } catch (error) {}

    if (ldApHent.getFullYear() == 1900) {
      alerta("horário da primeira entrada inválido", "alerta");

      return;
    }

    if (ldApHiin.getFullYear() == 1900) {
      alerta("horário da primeira saída inválido", "alerta");

      return;
    }

    if (ldApHtin.getFullYear() == 1900) {
      alerta("horário da segunda entrada inválido", "alerta");

      return;
    }

    if (ldApHter.getFullYear() == 1900) {
      alerta("horário da segunda saída inválido", "alerta");

      return;
    }

    lmApApnt.push({
      id_matr: lcIdMatr,
      id_eqto: lcIdEqto,
      ap_hent: lnApHent,
      ap_hiin: lnApHiin,
      ap_htin: lnApHtin,
      ap_hter: lnApHter,
    });

    insereApontamentoCAS(lmApApnt);
  } else {
    for (var i = 0; i < gmSmRcsoCOA.length; i++) {
      llApSecu = false;

      if (gmSmRcsoCOA[i].dr_chck) {
        if (gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "E") {
          lcIdEqto += gmSmRcsoCOA[i].id_matr.toString() + ", ";
        } else {
          for (var j = 0; j < gmApSecuCAS.length; j++) {
            if (
              gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() ==
                gmApSecuCAS[j].id_matr.trim().slice(-3).toUpperCase() &&
              parseInt(gmSmRcsoCOA[i].id_matr) ==
                parseInt(gmApSecuCAS[j].id_matr.replace(/[^\d]+/g, ""))
            ) {
              llApSecu = true;

              break;
            }
          }

          if (!llApSecu) {
            lcIdMatr +=
              gmSmRcsoCOA[i].id_matr.toString() +
              gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() +
              ", ";
          }
        }
      }
    }

    if (lcIdMatr.trim().length + lcIdEqto.trim().length > 0) {
      try {
        if (
          loHrHent.value.toString().trim().length > 0 &&
          loHrHent.value.toString().trim() != "00:00"
        ) {
          lnApHent = parseFloat(loHrHent.value.toString().replace(":", "."));

          ldApHent = new Date(htmlDataParaObjetoData(loDtData.value));

          lmHrHora = loHrHent.value.toString().split(":");

          ldApHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
        }
      } catch (error) {}

      try {
        if (
          loHrHiin.value.toString().trim().length > 0 &&
          loHrHiin.value.toString().trim() != "00:00"
        ) {
          lnApHiin = parseFloat(loHrHiin.value.toString().replace(":", "."));

          ldApHiin = new Date(htmlDataParaObjetoData(loDtData.value));

          lmHrHora = loHrHiin.value.toString().split(":");

          ldApHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
        }
      } catch (error) {}

      try {
        if (
          loHrHtin.value.toString().trim().length > 0 &&
          loHrHtin.value.toString().trim() != "00:00"
        ) {
          lnApHtin = parseFloat(loHrHtin.value.toString().replace(":", "."));

          ldApHtin = new Date(htmlDataParaObjetoData(loDtData.value));

          lmHrHora = loHrHtin.value.toString().split(":");

          ldApHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
        }
      } catch (error) {}

      try {
        if (
          loHrHter.value.toString().trim().length > 0 &&
          loHrHter.value.toString().trim() != "00:00"
        ) {
          lnApHter = parseFloat(loHrHter.value.toString().replace(":", "."));

          ldApHter = new Date(htmlDataParaObjetoData(loDtData.value));

          lmHrHora = loHrHter.value.toString().split(":");

          ldApHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
        }
      } catch (error) {}

      if (ldApHent.getFullYear() == 1900) {
        alerta("horário da primeira entrada inválido", "alerta");

        return;
      }

      if (ldApHiin.getFullYear() == 1900) {
        alerta("horário da primeira saída inválido", "alerta");

        return;
      }

      if (ldApHtin.getFullYear() == 1900) {
        alerta("horário da segunda entrada inválido", "alerta");

        return;
      }

      if (ldApHter.getFullYear() == 1900) {
        alerta("horário da segunda saída inválido", "alerta");

        return;
      }

      if (lcIdMatr.trim().length > 0) {
        lcIdMatr = lcIdMatr.trim().slice(0, -1);
      }

      if (lcIdEqto.trim().length > 0) {
        lcIdEqto = lcIdEqto.trim().slice(0, -1);
      }

      lmApApnt.push({
        id_matr: lcIdMatr,
        id_eqto: lcIdEqto,
        ap_hent: lnApHent,
        ap_hiin: lnApHiin,
        ap_htin: lnApHtin,
        ap_hter: lnApHter,
      });
    }

    for (var i = 0; i < gmApSecuCAS.length; i++) {
      lmApApnt.push(gmApSecuCAS[i]);
    }

    if (lmApApnt.length == 0) {
      alerta("nenhum recurso selecionado", "alerta");

      return;
    }

    insereApontamentoCAS(lmApApnt);
  }
}

function excluiFuncionarioApontamento(lcApFunc) {
  var loLiStrc = document.getElementById("lliStrcCOA");
  var loSlStrc = document.getElementById("sltStrcCOA");
  var loApFunc = JSON.parse(unescape(lcApFunc));
  var lnCtChck = 0;

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    try {
      if (
        gmSmRcsoCOA[i].dr_chck &&
        gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "F" &&
        loApFunc.fu_empr.trim().toUpperCase() ==
          gmSmRcsoCOA[i].fu_empr.trim().toUpperCase() &&
        parseInt(loApFunc.id_matr) == parseInt(gmSmRcsoCOA[i].id_matr)
      ) {
        gmSmRcsoCOA[i]["dr_chck"] = false;
      }

      if (gmSmRcsoCOA[i].dr_chck) {
        lnCtChck++;
      }
    } catch (error) {}
  }

  if (lnCtChck > 0) {
    montaDivergenciasApontamentosCAS();
  } else {
    loLiStrc.style.display = "none";
    loSlStrc.selectedIndex = 0;

    alteraStatusRecursoCOA();

    goMnView.router.back();
  }
}

function montaDivergenciasApontamentosCAS() {
  var loSlObra = document.getElementById("sltObraCOA"),
    loUlDvrg = document.getElementById("uulDvrgCAS"),
    loHrHent = document.getElementById("hraHentCAS"),
    loHrHiin = document.getElementById("hraHiinCAS"),
    loHrHtin = document.getElementById("hraHtinCAS"),
    loHrHter = document.getElementById("hraHterCAS");
  var lmApFunc = [],
    lmApSecu = [];
  var lnApMnse = 0,
    lnApMnap = 0,
    lnIdClie = 0;
  var lcUlDvrg = "",
    lcApSecu = "",
    lcApFunc = "",
    lcApDife = "";

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  gmApSecuCAS = [];

  for (var i = 0; i < gmSmRcsoCOA.length; i++) {
    try {
      if (
        gmSmRcsoCOA[i].dr_chck &&
        gmSmRcsoCOA[i].dr_tipo.trim().toUpperCase() == "F"
      ) {
        lmApFunc.push({
          fu_empr: gmSmRcsoCOA[i].fu_empr.trim().toUpperCase(),
          id_matr: parseInt(gmSmRcsoCOA[i].id_matr),
          cb_tmdo: gmSmRcsoCOA[i].cb_tmdo.trim().toUpperCase(),
          fu_func: gmSmRcsoCOA[i].fu_func.trim().toUpperCase(),
          fu_nome: gmSmRcsoCOA[i].fu_nome.trim().toUpperCase(),
        });
      }
    } catch (error) {}
  }

  for (var i = 0; i < lmApFunc.length; i++) {
    lmApSecu = [];
    lnApMnse = 0;
    lnApMnap = 0;
    lcApSecu = "";
    lcApFunc = "";
    lcApDife = "";

    for (var j = 0; j < gmApSecuCOA.length; j++) {
      if (
        lmApFunc[i].fu_empr.trim().toUpperCase() ==
          gmApSecuCOA[j].fu_empr.trim().toUpperCase() &&
        parseInt(lmApFunc[i].id_matr) == parseInt(gmApSecuCOA[j].id_matr)
      ) {
        lnApMnse += calculaMinutosCOA(
          pad(gmApSecuCOA[j].as_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCOA[j].as_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCOA[j].as_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCOA[j].as_hter.toFixed(2), 5).replace(".", ":")
        );

        lmApSecu.push({
          id_matr:
            lmApFunc[i].id_matr.toString() +
            lmApFunc[i].fu_empr.trim().toUpperCase(),
          id_eqto: "",
          ap_hent: parseFloat(gmApSecuCOA[j].as_hent),
          ap_hiin: parseFloat(gmApSecuCOA[j].as_hiin),
          ap_htin: parseFloat(gmApSecuCOA[j].as_htin),
          ap_hter: parseFloat(gmApSecuCOA[j].as_hter),
        });

        //prettier-ignore
        lcApSecu +=
          "<div class='row no-gap'>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApSecuCOA[j].as_hent.toFixed(2), 5).replace(".", ":") +
            "</div>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApSecuCOA[j].as_hiin.toFixed(2), 5).replace(".", ":") +
            "</div>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApSecuCOA[j].as_htin.toFixed(2), 5).replace(".", ":") +
            "</div>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApSecuCOA[j].as_hter.toFixed(2), 5).replace(".", ":") +
            "</div>" +
          "</div>";
      }
    }

    for (var j = 0; j < gmApFuncCOA.length; j++) {
      if (
        lmApFunc[i].fu_empr.trim().toUpperCase() ==
          gmApFuncCOA[j].fu_empr.trim().toUpperCase() &&
        parseInt(lmApFunc[i].id_matr) == parseInt(gmApFuncCOA[j].id_matr)
      ) {
        lnApMnap += calculaMinutosCOA(
          pad(gmApFuncCOA[j].ap_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCOA[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCOA[j].ap_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCOA[j].ap_hter.toFixed(2), 5).replace(".", ":")
        );

        //prettier-ignore
        lcApFunc +=
          "<div class='row no-gap'>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApFuncCOA[j].ap_hent.toFixed(2), 5).replace(".", ":") +
            "</div>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApFuncCOA[j].ap_hiin.toFixed(2), 5).replace(".", ":") +
            "</div>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApFuncCOA[j].ap_htin.toFixed(2), 5).replace(".", ":") +
            "</div>" +
            "<div class='col' style='text-align: center; border: 1px solid;'>" +
              pad(gmApFuncCOA[j].ap_hter.toFixed(2), 5).replace(".", ":") +
            "</div>" +
          "</div>";
      }
    }

    lnApMnap += calculaMinutosCOA(
      loHrHent.value.toString().trim(),
      loHrHiin.value.toString().trim(),
      loHrHtin.value.toString().trim(),
      loHrHter.value.toString().trim()
    );

    //prettier-ignore
    lcApFunc +=
      "<div class='row no-gap'>" +
        "<div class='col' style='text-align: center; border: 1px solid;'>" +
          loHrHent.value.toString().trim() +
        "</div>" +
        "<div class='col' style='text-align: center; border: 1px solid;'>" +
          loHrHiin.value.toString().trim() +
        "</div>" +
        "<div class='col' style='text-align: center; border: 1px solid;'>" +
          loHrHtin.value.toString().trim() +
        "</div>" +
        "<div class='col' style='text-align: center; border: 1px solid;'>" +
          loHrHter.value.toString().trim() +
        "</div>" +
      "</div>";

    //prettier-ignore
    lcApDife +=
      "<div class='row no-gap'>" +
        "<div class='col' style='text-align: center; border: 1px solid;'>" +
          pad(Math.floor(lnApMnse / 60), 2) +
          ":" +
          pad((lnApMnse % 60), 2) +
        "</div>" +
        "<div class='col' style='text-align: center; border: 1px solid;'>" +
          pad(Math.floor(lnApMnap / 60), 2) +
          ":" +
          pad((lnApMnap % 60), 2) +
        "</div>" +
        "<div class='col' style='text-align: center; border: 1px solid;'>" +
          pad(Math.floor(Math.abs(lnApMnse - lnApMnap) / 60), 2) +
          ":" +
          pad((Math.abs(lnApMnse - lnApMnap) % 60), 2) +
        "</div>" +
      "</div>";

    if (
      lnApMnse > 0 &&
      ((Math.abs(lnApMnse - lnApMnap) > 15 && lnIdClie != 69) ||
        (Math.abs(lnApMnse - lnApMnap) > 20 && lnIdClie == 69))
    ) {
      for (var j = 0; j < lmApSecu.length; j++) {
        gmApSecuCAS.push(lmApSecu[j]);
      }

      //prettier-ignore
      lcUlDvrg +=
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-media' onclick='excluiFuncionarioApontamento(\"" + escape(JSON.stringify(lmApFunc[i])) + "\");'>" +
              "<i class='material-icons text-color-red'>remove_circle</i>" +
            "</div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + lmApFunc[i].fu_nome.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</div>" +
        "</li>" +
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title'>matrícula</div>" +
              "<div class='item-after'>" + lmApFunc[i].id_matr.toString() + "</div>" +
            "</div>" +
          "</div>" +
        "</li>" +
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title'>função</div>" +
              "<div class='item-after'>" + lmApFunc[i].fu_func.trim().toUpperCase() + "</div>" +
            "</div>" +
          "</div>" +
        "</li>" +
        "<li>" +
          "<div class='item-content'>" +
            "<div class='item-inner'>" +
              "<div class='item-title'>tipo</div>" +
              "<div class='item-after'>" + lmApFunc[i].cb_tmdo.trim().toUpperCase() + "</div>" +
            "</div>" +
          "</div>" +
        "</li>" +
        "<li>" +
          "<div class='block-title' style='text-align: center'>" +
            "apontamentos facial" +
          "</div>" +
          "<div class='block'>" +
            "<div class='row no-gap'>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>entrada</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>saída</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>entrada</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>saída</b>" +
              "</div>" +
            "</div>" +
            lcApSecu +
          "</div>" +
        "</li>" +
        "<li>" +
          "<div class='block-title' style='text-align: center'>" +
            "apontamentos aplicativo" +
          "</div>" +
          "<div class='block'>" +
            "<div class='row no-gap'>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>entrada</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>saída</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>entrada</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>saída</b>" +
              "</div>" +
            "</div>" +
            lcApFunc +
          "</div>" +
        "</li>" +
        "<li>" +
          "<div class='block-title' style='text-align: center'>" +
            "diferença" +
          "</div>" +
          "<div class='block'>" +
            "<div class='row no-gap'>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>total facial</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>total aplicativo</b>" +
              "</div>" +
              "<div class='col' style='text-align: center; border: 1px solid;'>" +
                "<b>diferença</b>" +
              "</div>" +
            "</div>" +
            lcApDife +
          "</div>" +
        "</li>";
    }
  }

  loUlDvrg.innerHTML = lcUlDvrg;

  if (lcUlDvrg.trim().length == 0) {
    goMnView.router.back();
  }
}

function alteraAcaoDivergenciaCAS() {
  var loRdCopi = document.getElementById("rdoCopiCAS");
  var loRdDigi = document.getElementById("rdoDigiCAS");

  if (loRdDigi.checked) {
    loRdCopi.checked = false;
  } else {
    loRdCopi.checked = true;
    loRdDigi.checked = false;
  }
}

function limpaCamposCAS() {
  var loHrHen0 = document.getElementById("hraHentCOA");
  var loHrHii0 = document.getElementById("hraHiinCOA");
  var loHrHti0 = document.getElementById("hraHtinCOA");
  var loHrHte0 = document.getElementById("hraHterCOA");
  var loDvTho0 = document.getElementById("divThorCOA");
  var loUlDvrg = document.getElementById("uulDvrgCAS");
  var loRdCopi = document.getElementById("rdoCopiCAS");
  var loRdDigi = document.getElementById("rdoDigiCAS");
  var loHrHent = document.getElementById("hraHentCAS");
  var loHrHiin = document.getElementById("hraHiinCAS");
  var loHrHtin = document.getElementById("hraHtinCAS");
  var loHrHter = document.getElementById("hraHterCAS");
  var loDvThor = document.getElementById("divThorCAS");

  gmApSecuCAS = [];

  loUlDvrg.innerHTML = "";

  loRdCopi.checked = true;
  loRdDigi.checked = false;

  alteraAcaoDivergenciaCAS();

  loHrHent.value = loHrHen0.value.toString().trim().toUpperCase();
  loHrHiin.value = loHrHii0.value.toString().trim().toUpperCase();
  loHrHtin.value = loHrHti0.value.toString().trim().toUpperCase();
  loHrHter.value = loHrHte0.value.toString().trim().toUpperCase();

  loDvThor.innerHTML = loDvTho0.innerHTML.trim().toUpperCase();
}

function ComlApSecu() {
  limpaCamposCAS();
  montaDivergenciasApontamentosCAS();
}
