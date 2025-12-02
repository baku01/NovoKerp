var gmCdRdobCCR = [],
  gmRoFotoCCR = [];
var goOsLctoCCR = {},
  goCdRdobCCR = {};
var gnInListCCR = 0;

function adicionaFotoWebCCR() {
  var loFlFoto = document.getElementById("fleFotoCCR"),
    loWkRead = new FileReader(),
    loWkFile = {},
    loCdRdob = goCdRdobCCR;

  goCdRdobCCR = {};

  loWkFile = loFlFoto.files[0];

  loWkRead.onloadend = function () {
    loFlFoto.value = "";

    insereFotoCCR(loWkRead.result, loCdRdob, "PHOTOLIBRARY", false);
  };

  loWkRead.readAsDataURL(loWkFile);
}

function pesquisaPropostasCCR() {
  var loSlObra = document.getElementById("sltObraCCR");
  var lnIdCadt = 0;
  var loPaPesq = {};

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    alerta("obra inválida", "alerta");

    return;
  }

  loPaPesq = {
    id_parm: "id_prop",
    pa_titu: "pesquisa de propostas",
    pa_pesq: true,
    id_cadt: lnIdCadt,
    pa_slct:
      "<option value='os_desc' selected>descrição</option>" +
      "<option value='os_nume'>número da proposta</option>" +
      "<option value='os_ncon'>número do contrato</option>" +
      "<option value='os_ncli'>número do pedido do cliente</option>" +
      "<option value='os_resp'>responsável</option>",
  };

  sessionStorage.setItem("soPaPesq", JSON.stringify(loPaPesq));

  redireciona("PesqTbCadt.html", "PesqTbCadt.html");
}

function deletaFotoCCR(loCdRdob) {
  var lcIdClie = loCdRdob.id_clie.toString(),
    lcRoOrds = loCdRdob.ro_ords.trim().toUpperCase(),
    lcRoData = stringDataParaObjetoData(jsonDate(loCdRdob.ro_data)).yyyymmdd();
  var lnIdClie = parseInt(loCdRdob.id_clie);
  var loImRdob = document.getElementById(
    "imgRdo" + lcIdClie + lcRoData + lcRoOrds + "CCR"
  );
  var lmAxFoto = [];

  for (var i = 0; i < gmRoFotoCCR.length; i++) {
    if (
      lnIdClie == parseInt(gmRoFotoCCR[i].id_clie) &&
      lcRoData == gmRoFotoCCR[i].ro_data.yyyymmdd() &&
      lcRoOrds == gmRoFotoCCR[i].ro_ords.trim().toUpperCase() &&
      loImRdob.src.toString().trim().toUpperCase() ==
        gmRoFotoCCR[i].ro_foto.trim().toUpperCase()
    ) {
      $.ajax({
        url: goCdUser.ws_http.trim() + "insereFoto",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          lcBsFoto: "",
          lcWkPath: "rdos/" + gcIdEmpr + lcIdClie + lcRoData + lcRoOrds + "/",
          lcWkFoto: gmRoFotoCCR[i].nm_foto.trim(),
        }),

        success: function (loWkRsql) {
          try {
            if (loWkRsql.ft_inse) {
              lmAxFoto = [...gmRoFotoCCR];

              for (var i = 0; i < lmAxFoto.length; i++) {
                if (
                  lnIdClie == parseInt(lmAxFoto[i].id_clie) &&
                  lcRoData == lmAxFoto[i].ro_data.yyyymmdd() &&
                  lcRoOrds == lmAxFoto[i].ro_ords.trim().toUpperCase()
                ) {
                  for (var j = 0; j < gmRoFotoCCR.length; j++) {
                    if (
                      lnIdClie == parseInt(gmRoFotoCCR[j].id_clie) &&
                      lcRoData == gmRoFotoCCR[j].ro_data.yyyymmdd() &&
                      lcRoOrds == gmRoFotoCCR[j].ro_ords.trim().toUpperCase()
                    ) {
                      gmRoFotoCCR.splice(j, 1);

                      break;
                    }
                  }
                }
              }

              pesquisaFotosCCR(loCdRdob, "");
            } else {
              alerta("erro ao excluir foto", "alerta");
            }
          } catch (loApErro) {
            alerta("erro ao excluir a foto: " + loApErro.message, "erro");
          }
        },
        error: function (jqXHR, textStatus, err) {
          alerta(
            "não foi possível excluir a foto, verifique sua conexão com a internet: " +
              jqXHR.readyState +
              jqXHR.responseText +
              jqXHR.status +
              textStatus +
              err,
            "erro"
          );
        },
      });

      break;
    }
  }
}

function insereFotoCCR(lcBsFoto, loCdRdob, lcScType, llRiPior) {
  var lcIdClie = loCdRdob.id_clie.toString(),
    lcRoOrds = loCdRdob.ro_ords.trim().toUpperCase(),
    lcRoData = stringDataParaObjetoData(jsonDate(loCdRdob.ro_data)).yyyymmdd(),
    lcNmFoto = Math.random().toString(36).substring(7) + ".png";
  var lnIdClie = parseInt(loCdRdob.id_clie);
  var lmAxFoto = [];

  if (lcBsFoto.trim().indexOf("base64") > 0) {
    $.ajax({
      url: goCdUser.ws_http.trim() + "insereFoto",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        lcBsFoto: lcBsFoto,
        lcWkPath: "rdos/" + gcIdEmpr + lcIdClie + lcRoData + lcRoOrds + "/",
        lcWkFoto: lcNmFoto,
      }),

      success: function (loWkRsql) {
        try {
          if (loWkRsql.ft_inse) {
            lmAxFoto = [...gmRoFotoCCR];

            for (var i = 0; i < lmAxFoto.length; i++) {
              if (
                lnIdClie == parseInt(lmAxFoto[i].id_clie) &&
                lcRoData == lmAxFoto[i].ro_data.yyyymmdd() &&
                lcRoOrds == lmAxFoto[i].ro_ords.trim().toUpperCase()
              ) {
                for (var j = 0; j < gmRoFotoCCR.length; j++) {
                  if (
                    lnIdClie == parseInt(gmRoFotoCCR[j].id_clie) &&
                    lcRoData == gmRoFotoCCR[j].ro_data.yyyymmdd() &&
                    lcRoOrds == gmRoFotoCCR[j].ro_ords.trim().toUpperCase()
                  ) {
                    gmRoFotoCCR.splice(j, 1);

                    break;
                  }
                }
              }
            }

            pesquisaFotosCCR(loCdRdob, lcNmFoto);
          } else {
            if (lcScType.trim().toUpperCase() == "CAMERA") {
              adicionaFotoCCR("PHOTOLIBRARY", loCdRdob);
            } else {
              alerta("erro ao salvar foto", "alerta");
            }
          }
        } catch (loApErro) {
          if (lcScType.trim().toUpperCase() == "CAMERA") {
            adicionaFotoCCR("PHOTOLIBRARY", loCdRdob);
          } else {
            alerta("erro ao salvar foto: " + loApErro.message, "erro");
          }
        }
      },
      error: function (jqXHR, textStatus, err) {
        if (llRiPior) {
          redimensionaImagemPiorQualidade(lcBsFoto, function (lcNvBase) {
            insereFotoCCR(lcNvBase, loCdRdob, lcScType, false);
          });
        } else {
          redimensionaImagem(lcBsFoto, function (lcNvBase) {
            insereFotoCCR(lcNvBase, loCdRdob, lcScType, true);
          });
        }

        // if (lcScType.trim().toUpperCase() == "CAMERA") {
        //   adicionaFotoCCR("PHOTOLIBRARY", loCdRdob);
        // } else {
        //   alerta(
        //     "não foi possível salvar a foto, verifique sua conexão com a internet: " +
        //       jqXHR.readyState +
        //       jqXHR.responseText +
        //       jqXHR.status +
        //       textStatus +
        //       err,
        //     "erro"
        //   );
        // }
      },
    });
  } else {
    if (lcScType.trim().toUpperCase() == "CAMERA") {
      adicionaFotoCCR("PHOTOLIBRARY", loCdRdob);
    } else {
      alerta("foto inválida", "alerta");
    }
  }
}

function adicionaFotoCCR(lcScType, loCdRdob) {
  var loFlFoto = document.getElementById("fleFotoCCR"),
    loWkOptn = {};
  var lnScType = 0;

  if (!isMobile()) {
    goCdRdobCCR = loCdRdob;

    loFlFoto.click();

    return;
  }

  if (lcScType.trim().toUpperCase() == "CAMERA") {
    lnScType = Camera.PictureSourceType.CAMERA;
  } else if (lcScType.trim().toUpperCase() == "PHOTOLIBRARY") {
    lnScType = Camera.PictureSourceType.PHOTOLIBRARY;
  }

  loWkOptn = {
    quality: 75,
    // targetWidth: 400,
    // targetHeight: 600,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: lnScType,
    encodingType: Camera.EncodingType.PNG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: false,
    // correctOrientation: true,
    saveToPhotoAlbum: false,
  };

  app.dialog.preloader("carregando foto");

  navigator.camera.getPicture(
    function onSuccess(lcApFoto) {
      app.dialog.close();

      // insereFotoCCR("data:image/png;base64," + lcApFoto, loCdRdob, lcScType, false);
      insereFotoCCR(lcApFoto, loCdRdob, lcScType, false);
    },
    function onFail(lcWkMnsg) {
      app.dialog.close();

      if (lcScType.trim().toUpperCase() == "CAMERA") {
        adicionaFotoCCR("PHOTOLIBRARY", loCdRdob);
      } else {
        alerta(
          "não foi possível carregar a foto: " + lcWkMnsg + ", tente novamente",
          "alerta"
        );
      }
    },
    loWkOptn
  );
}

function opcoesFotoCCR(lcCdRdob) {
  var loCdRdob = JSON.parse(unescape(lcCdRdob));
  var lmOpBtns = [];
  var llRoFoto = false;

  if (isMobile()) {
    lmOpBtns = [
      {
        text: "câmera",
        icon: "<i class='material-icons centraliza'>camera</i>",
        onClick: function () {
          adicionaFotoCCR("CAMERA", loCdRdob);
        },
      },
      {
        text: "galeria",
        icon: "<i class='material-icons centraliza'>photo_library</i>",
        onClick: function () {
          adicionaFotoCCR("PHOTOLIBRARY", loCdRdob);
        },
      },
    ];
  } else {
    lmOpBtns.push({
      text: "galeria",
      icon: "<i class='material-icons centraliza'>photo_library</i>",
      onClick: function () {
        adicionaFotoCCR("PHOTOLIBRARY", loCdRdob);
      },
    });
  }

  for (var i = 0; i < gmRoFotoCCR.length; i++) {
    if (
      parseInt(loCdRdob.id_clie) == parseInt(gmRoFotoCCR[i].id_clie) &&
      stringDataParaObjetoData(jsonDate(loCdRdob.ro_data)).yyyymmdd() ==
        gmRoFotoCCR[i].ro_data.yyyymmdd() &&
      loCdRdob.ro_ords.trim().toUpperCase() ==
        gmRoFotoCCR[i].ro_ords.trim().toUpperCase()
    ) {
      llRoFoto = true;
    }
  }

  if (llRoFoto) {
    lmOpBtns.push({
      text: "remover",
      icon: "<i class='material-icons centraliza'>cancel</i>",
      onClick: function () {
        app.dialog
          .create({
            title: "alerta",
            text: "remover foto ?",
            buttons: [
              {
                text: "cancelar",
                color: corBotaoAlerta(),
              },
              {
                text: "ok",
                color: corBotaoAlerta(),
                onClick: function () {
                  deletaFotoCCR(loCdRdob);
                },
              },
            ],
          })
          .open();
      },
    });
  }

  app.actions
    .create({
      grid: true,
      buttons: [lmOpBtns],
    })
    .open();
}

function montaFotosCCR(lcCdRdob) {
  var loCdRdob = JSON.parse(unescape(lcCdRdob));
  var loImRdob = document.getElementById(
    "imgRdo" +
      loCdRdob.id_clie.toString() +
      stringDataParaObjetoData(jsonDate(loCdRdob.ro_data)).yyyymmdd() +
      loCdRdob.ro_ords.trim().toUpperCase() +
      "CCR"
  );
  var lmRoFoto = [];

  for (var i = 0; i < gmRoFotoCCR.length; i++) {
    if (
      parseInt(loCdRdob.id_clie) == parseInt(gmRoFotoCCR[i].id_clie) &&
      stringDataParaObjetoData(jsonDate(loCdRdob.ro_data)).yyyymmdd() ==
        gmRoFotoCCR[i].ro_data.yyyymmdd() &&
      loCdRdob.ro_ords.trim().toUpperCase() ==
        gmRoFotoCCR[i].ro_ords.trim().toUpperCase()
    ) {
      lmRoFoto.push({
        url: gmRoFotoCCR[i].ro_foto,
        caption:
          "RDO " +
          jsonDate(loCdRdob.ro_data) +
          " " +
          loCdRdob.cl_fant.trim().toUpperCase(),
      });
    }
  }

  if (lmRoFoto.length == 0) {
    return;
  }

  lmRoFoto.unshift(
    lmRoFoto.splice(
      lmRoFoto.findIndex(
        (loRoFoto) =>
          loRoFoto.url.toString().trim().toUpperCase() ===
          loImRdob.src.toString().trim().toUpperCase()
      ),
      1
    )[0]
  );

  app.photoBrowser
    .create({
      photos: lmRoFoto,
      theme: "dark",
      type: "standalone",
      navbarOfText: "de",
      on: {
        close: function () {
          loImRdob.src = this.params.photos[this.activeIndex].url;
        },
      },
    })
    .open();
}

function montaRelatoriosDiarioObraCCR() {
  var loDvRdob = document.getElementById("divRdobCCR"),
    loDvLoad = document.getElementById("divLoadCCR");
  var lcCdRdob = "",
    lcUrImge = "";
  var lnFnList = 0;

  if (gnInListCCR + 20 >= gmCdRdobCCR.length) {
    loDvRdob.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmCdRdobCCR.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCCR + 20;
  }

  for (var i = gnInListCCR; i < lnFnList; i++) {
    lcUrImge = "";

    for (var j = 0; j < gmRoFotoCCR.length; j++) {
      if (
        parseInt(gmCdRdobCCR[i].id_clie) == parseInt(gmRoFotoCCR[j].id_clie) &&
        stringDataParaObjetoData(jsonDate(gmCdRdobCCR[i].ro_data)).yyyymmdd() ==
          gmRoFotoCCR[j].ro_data.yyyymmdd() &&
        gmCdRdobCCR[i].ro_ords.trim().toUpperCase() ==
          gmRoFotoCCR[j].ro_ords.trim().toUpperCase()
      ) {
        lcUrImge = gmRoFotoCCR[j].ro_foto;

        break;
      }
    }

    //prettier-ignore
    lcCdRdob +=
      "<li>" +
        "<a href='#' class='item-link item-content'>" +
          "<div class='item-media' onclick='montaFotosCCR(\"" + escape(JSON.stringify(gmCdRdobCCR[i])) + "\");'>" +
            "<img id='imgRdo" + gmCdRdobCCR[i].id_clie.toString() + stringDataParaObjetoData(jsonDate(gmCdRdobCCR[i].ro_data)).yyyymmdd() + gmCdRdobCCR[i].ro_ords.trim().toUpperCase() + "CCR' src='" + lcUrImge + "' width='80' onerror='this.src=\"img/semImagem.png\";' >" +
          "</div>" +
          "<div class='item-inner' onclick='opcoesFotoCCR(\"" + escape(JSON.stringify(gmCdRdobCCR[i])) + "\");'>" +
            "<div class='item-title-row'>" +
              "<div class='item-title'><b>" + jsonDate(gmCdRdobCCR[i].ro_data) + "</b></div>" +
              "<div class='item-after'><b></b></div>" +
            "</div>" +
            "<div class='item-subtitle'><b>" + gmCdRdobCCR[i].cl_fant.trim().toUpperCase() + "</b></div>" +
            "<div class='item-text'><b>proposta(s): " + gmCdRdobCCR[i].ro_nume.trim().toUpperCase() + "</b></div>" +
          "</div>" +
        "</a>" +
      "<li>";
  }

  $("#uulRdobCCR").append(lcCdRdob);

  gnInListCCR = i;
}

function pesquisaFotosCCR(loCdRdob, lcNmFoto) {
  var lcWkIsql = "",
    lcIdClie = loCdRdob.id_clie.toString(),
    lcRoOrds = loCdRdob.ro_ords.trim().toUpperCase(),
    lcRoData = stringDataParaObjetoData(jsonDate(loCdRdob.ro_data)).yyyymmdd();
  var loImRdob = {};
  var lmWkIsql = [];
  var llNmFoto = false;

  lmWkIsql = [
    {
      pa_nome: "lcPtFoto",
      pa_tipo: "VarChar",
      pa_valo: "rdos/" + gcIdEmpr + lcIdClie + lcRoData + lcRoOrds,
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFotos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          gmRoFotoCCR.push({
            id_clie: parseInt(loCdRdob.id_clie),
            ro_data: stringDataParaObjetoData(jsonDate(loCdRdob.ro_data)),
            ro_ords: lcRoOrds,
            ro_foto:
              goCdUser.ws_wiis.trim() +
              "fotos/rdos/" +
              gcIdEmpr +
              lcIdClie +
              lcRoData +
              lcRoOrds +
              "/" +
              lmWkRsql[i].ex_sdir.trim(),
            nm_foto: lmWkRsql[i].ex_sdir.trim(),
          });
        }

        loImRdob = document.getElementById(
          "imgRdo" + lcIdClie + lcRoData + lcRoOrds + "CCR"
        );

        if (loImRdob) {
          loImRdob.src = "";

          if (lmWkRsql.length > 0) {
            if (lcNmFoto.trim().length == 0) {
              lcNmFoto = lmWkRsql[0].ex_sdir.trim();

              llNmFoto = true;
            }

            loImRdob.src =
              goCdUser.ws_wiis.trim() +
              "fotos/rdos/" +
              gcIdEmpr +
              lcIdClie +
              lcRoData +
              lcRoOrds +
              "/" +
              lcNmFoto;

            setTimeout(function () {
              if (
                loImRdob.src.toString().trim().indexOf("img/semImagem.png") >= 0
              ) {
                if (lmWkRsql.length > 1) {
                  if (llNmFoto) {
                    lcNmFoto = lmWkRsql[1].ex_sdir.trim();

                    loImRdob.src =
                      goCdUser.ws_wiis.trim() +
                      "fotos/rdos/" +
                      gcIdEmpr +
                      lcIdClie +
                      lcRoData +
                      lcRoOrds +
                      "/" +
                      lcNmFoto;
                  }
                }
              }
            }, 1000);
          }
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaRelatoriosDiarioObraCCR() {
  var loDvRdob = document.getElementById("divRdobCCR");
  var loDtDtde = document.getElementById("datDtdeCCR");
  var loDtDtat = document.getElementById("datDtatCCR");
  var loSlObra = document.getElementById("sltObraCCR");
  var loDvLoad = document.getElementById("divLoadCCR");
  var lcWkIsql = "",
    lcRoDtde = null,
    lcRoDtat = null;
  var lnIdClie = null,
    lnIdOrds = null;
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtDtde.value.toString().trim().length > 0) {
    lcRoDtde = loDtDtde.value.toString().trim();
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcRoDtat = loDtDtat.value.toString().trim();
  }

  if (lcRoDtde != null) {
    if (ldDtHoje < htmlDataParaObjetoData(lcRoDtde)) {
      alerta("data inicial maior que data atual", "alerta");

      return;
    }
  }

  if (lcRoDtat != null) {
    if (ldDtHoje < htmlDataParaObjetoData(lcRoDtat)) {
      alerta("data final maior que data atual", "alerta");

      return;
    }
  }

  if (lcRoDtde != null && lcRoDtat != null) {
    if (htmlDataParaObjetoData(lcRoDtat) < htmlDataParaObjetoData(lcRoDtde)) {
      alerta("data inicial maior que data final", "alerta");

      return;
    }
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  try {
    if (parseInt(goOsLctoCCR.id_ords) > 0) {
      lnIdOrds = parseInt(goOsLctoCCR.id_ords);
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldRoDtde", pa_tipo: "SmallDatetime", pa_valo: lcRoDtde },
    { pa_nome: "ldRoDtat", pa_tipo: "SmallDatetime", pa_valo: lcRoDtat },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCCR();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRelatoriosDiarioObra",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          gmCdRdobCCR = lmWkRsql;

          for (var i = 0; i < gmCdRdobCCR.length; i++) {
            pesquisaFotosCCR(gmCdRdobCCR[i], "");
          }

          montaRelatoriosDiarioObraCCR();

          loDvRdob.onscroll = function () {
            if (
              loDvRdob.scrollHeight -
                loDvRdob.scrollTop -
                loDvRdob.clientHeight <
              1
            ) {
              montaRelatoriosDiarioObraCCR();
            }
          };
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function consultaCCR(loOsLcto) {
  var loNrNume = document.getElementById("nroNumeCCR");
  var loTaDesc = document.getElementById("txaDescCCR");

  if (loOsLcto.id_parm.trim().toUpperCase() == "ID_PROP") {
    limpaCamposOrdemServicoCCR();

    goOsLctoCCR = loOsLcto;

    loNrNume.value = loOsLcto.os_nume.trim().toUpperCase();

    app.input.validate(loNrNume);

    loTaDesc.value = loOsLcto.os_desc.trim().toUpperCase();

    pesquisaRelatoriosDiarioObraCCR();
  }
}

function limpaCamposOrdemServicoCCR() {
  var loNrNume = document.getElementById("nroNumeCCR");
  var loTaDesc = document.getElementById("txaDescCCR");

  goOsLctoCCR = {};

  loNrNume.value = "";
  loTaDesc.value = "";
}

function consultaOrdemServicoCCR() {
  var loSlObra = document.getElementById("sltObraCCR");
  var loNrNume = document.getElementById("nroNumeCCR");
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcOsNume = "";
  var lmWkIsql = [];

  try {
    if (loNrNume.value.toString().trim().length > 0) {
      lcOsNume = loNrNume.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  if (lcOsNume.length == 0) {
    limpaCamposOrdemServicoCCR();

    return;
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    alerta("obra inválida", "alerta");

    limpaCamposOrdemServicoCCR();

    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: lcOsNume },
    { pa_nome: "lcOsResp", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsDesc", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcli", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcon", pa_tipo: "VarChar", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposOrdemServicoCCR();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaPropostas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmWkRsql[0]["id_parm"] = "id_prop";

          consultaCCR(lmWkRsql[0]);

          return;
        }
      } catch (loApErro) {}

      alerta("nenhuma proposta encontrada", "alerta");
    },
    error: function (jqXHR, textStatus, err) {
      alerta("nenhuma proposta encontrada", "erro");
    },
  });
}

function pesquisaObrasCCR() {
  var loSlClie = document.getElementById("sltClieCAR");
  var loNrNume = document.getElementById("nroNumeCCR");
  var loSlObra = document.getElementById("sltObraCCR");
  var lcSlClie = "<option value='0/0'>TODAS AS OBRAS</option>",
    lcWkIsql = "",
    lcSlSlct = "",
    lcOsNume = "";
  var lmWkIsql = [];
  var lnIdClie = 0;

  try {
    if (parseInt(loSlClie.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlClie.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  try {
    if (loNrNume.value.toString().trim().length > 0) {
      lcOsNume = loNrNume.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0/0'>CCRREGANDO OBRAS...</option>";

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
          if (lnIdClie == parseInt(lmWkRsql[i].id_clie)) {
            lcSlSlct = " selected";
          } else {
            lcSlSlct = "";
          }

          //prettier-ignore
          lcSlClie += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlObra.innerHTML = lcSlClie;

      if (lcOsNume.length > 0) {
        consultaOrdemServicoCCR();
      } else {
        pesquisaRelatoriosDiarioObraCCR();
      }
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.disabled = false;

      loSlObra.innerHTML = lcSlClie;
    },
  });
}

function limpaCamposCCR() {
  var loDvRdob = document.getElementById("divRdobCCR");
  var loUlRdob = document.getElementById("uulRdobCCR");
  var loDvLoad = document.getElementById("divLoadCCR");
  var loFlFoto = document.getElementById("fleFotoCCR");

  gmRoFotoCCR = [];
  gmCdRdobCCR = [];
  gnInListCCR = 0;
  goCdRdobCCR = {};

  loDvRdob.onscroll = function () {};

  loUlRdob.innerHTML = "";

  loDvLoad.style.display = "none";

  loFlFoto.value = "";
}

function ComlCdRdob() {
  var loDtDdec = document.getElementById("datDtdeCAR");
  var loDtDatc = document.getElementById("datDtatCAR");
  var loDtDtde = document.getElementById("datDtdeCCR");
  var loDtDtat = document.getElementById("datDtatCCR");

  limpaCamposCCR();

  loDtDtde.value = loDtDdec.value;

  loDtDtat.value = loDtDatc.value;

  pesquisaObrasCCR();

  OkTecladoAndroid("nroNumeCCR");
}
