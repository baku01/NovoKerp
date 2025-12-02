var goVdStrmCFF = {},
  goFaSfc1CFF = {},
  goFaSfc2CFF = {},
  goDpCfotCFF = {},
  goDpCfacCFF = {};

function insereFotoFacialCFF(lmMvMvto) {
  var loImFoto = document.getElementById("imgFotoCFF");
  var lcImFoto = "",
    lcFuEmpr = gmCdCadtCMC[0].fu_empr.trim().toUpperCase(),
    lcFuMatr = gmCdCadtCMC[0].fu_matr.toString(),
    lcAxFoto = "";

  if (loImFoto.src.toString().trim().indexOf("img/semImagem.png") < 0) {
    lcImFoto = loImFoto.src.toString().trim();
  }

  if (lcImFoto.trim().length == 0) {
    alerta("foto da facial inválida", "alerta");

    return;
  }

  lcAxFoto = lcImFoto;

  redimensionaImagem(loImFoto.src.toString().trim(), function (lcNvBase) {
    loImFoto.src = lcNvBase;

    if (loImFoto.src.toString().trim().indexOf("img/semImagem.png") < 0) {
      lcImFoto = loImFoto.src.toString().trim();
    }

    if (lcImFoto.trim().length == 0) {
      alerta("foto da facial inválida", "alerta");

      return;
    }

    $.ajax({
      url: goCdUser.ws_http.trim() + "insereFoto",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        lcBsFoto: lcImFoto,
        lcWkPath: "facial/" + lcFuEmpr + lcFuMatr + "/",
        lcWkFoto: lcFuEmpr + lcFuMatr + ".png",
      }),

      success: function (loWkRsql) {
        try {
          if (loWkRsql.ft_inse) {
            consultaFotoFuncionarioCMC();

            app.dialog.progress("salvando itens");

            if (gmMvMvtoCMM.length > 0) {
              insereCadastroEstoqueMovimentacaoEstoqueCMC(lmMvMvto);
            } else {
              gcMvFotoCMC = lcAxFoto;

              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  function (loMpLoca) {
                    insereMovimentacaoEstoqueCMC(
                      lmMvMvto,
                      loMpLoca.coords.latitude.toString().trim(),
                      loMpLoca.coords.longitude.toString().trim()
                    );
                  },
                  function (error) {
                    insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
                  },
                  {
                    maximumAge: 60000,
                    timeout: 10000,
                    enableHighAccuracy: true,
                  }
                );
              } else {
                insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
              }
            }

            finalizaVideoCFF();

            goMnView.router.back();
          } else {
            alerta("erro ao salvar foto da facial", "alerta");
          }
        } catch (loApErro) {
          alerta("erro ao salvar foto da facial: " + loApErro.message, "erro");
        }
      },
      error: function (jqXHR, textStatus, err) {
        redimensionaImagemPiorQualidade(
          loImFoto.src.toString().trim(),
          function (lcNvBase) {
            loImFoto.src = lcNvBase;

            insereFotoFacialCFF(lmMvMvto);
          }
        );
      },
    });
  });
}

function comparaFacesCFF(lmMvMvto) {
  var loImFoto = document.getElementById("imgFotoCFF"),
    loImFunc = document.getElementById("imgFuncCFF");
  var lcImFoto = "",
    lcImFunc = "",
    lcAxFoto = "";

  if (loImFoto.src.toString().trim().indexOf("img/semImagem.png") < 0) {
    lcImFoto = loImFoto.src.toString().trim();
  }

  if (loImFunc.src.toString().trim().indexOf("img/semImagem.png") < 0) {
    lcImFunc = loImFunc.src.toString().trim();
  }

  if (lcImFoto.trim().length == 0) {
    alerta("facial inválida", "alerta");

    return;
  }

  if (lcImFunc.trim().length == 0) {
    alerta("facial não cadastrada", "alerta");

    return;
  }

  lcAxFoto = lcImFoto;

  redimensionaImagem(lcImFoto, function (lcNvBase) {
    loImFoto.src = lcNvBase;

    if (loImFoto.src.toString().trim().indexOf("img/semImagem.png") < 0) {
      lcImFoto = loImFoto.src.toString().trim();
    }

    if (lcImFoto.trim().length == 0) {
      alerta("facial inválida", "alerta");

      return;
    }

    redimensionaImagem(lcImFunc, function (lcNvBas1) {
      loImFunc.src = lcNvBas1;

      if (loImFunc.src.toString().trim().indexOf("img/semImagem.png") < 0) {
        lcImFunc = loImFunc.src.toString().trim();
      }

      if (lcImFunc.trim().length == 0) {
        alerta("facial não cadastrada", "alerta");

        return;
      }

      $.ajax({
        url: goCdUser.ws_http.trim() + "comparaFaces",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
          lcBsFot1: lcImFoto,
          lcBsFot2: lcImFunc,
        }),

        success: function (loWkRsql) {
          try {
            if (loWkRsql.eh_igua) {
              app.dialog.progress("salvando itens");

              if (gmMvMvtoCMM.length > 0) {
                insereCadastroEstoqueMovimentacaoEstoqueCMC(lmMvMvto);
              } else {
                gcMvFotoCMC = lcAxFoto;

                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    function (loMpLoca) {
                      insereMovimentacaoEstoqueCMC(
                        lmMvMvto,
                        loMpLoca.coords.latitude.toString().trim(),
                        loMpLoca.coords.longitude.toString().trim()
                      );
                    },
                    function (error) {
                      insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
                    },
                    {
                      maximumAge: 60000,
                      timeout: 10000,
                      enableHighAccuracy: true,
                    }
                  );
                } else {
                  insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
                }
              }

              finalizaVideoCFF();

              goMnView.router.back();
            } else {
              alerta("facial não compatível", "alerta");
            }
          } catch (loApErro) {
            alerta("erro ao comparar facial: " + loApErro.message, "erro");
          }
        },
        error: function (jqXHR, textStatus, err) {
          redimensionaImagemPiorQualidade(lcImFoto, function (lcNvBase) {
            loImFoto.src = lcNvBase;

            redimensionaImagemPiorQualidade(lcImFunc, function (lcNvBas1) {
              loImFunc.src = lcNvBas1;

              comparaFacesCFF(lmMvMvto);
            });
          });

          // alerta(
          //   "erro ao comparar facial: " +
          //     jqXHR.readyState +
          //     jqXHR.responseText +
          //     jqXHR.status +
          //     textStatus +
          //     err,
          //   "erro"
          // );
        },
      });
    });
  });
}

function salvaCFF() {
  var loImFoto = document.getElementById("imgFotoCFF");
  var lmMvMvto = [];

  for (var i = 0; i < gmCdCadtCMC.length; i++) {
    if (parseFloat(gmCdCadtCMC[i].mv_qtde) > 0) {
      lmMvMvto.push(gmCdCadtCMC[i]);
    }
  }

  if (lmMvMvto.length == 0) {
    finalizaVideoCFF();

    goMnView.router.back();

    setTimeout(function () {
      goMnView.router.back();
    }, 500);

    return;
  }

  if (gcFuFotoCMC.trim().length > 0) {
    if (gcSiOper == "iOS") {
      comparaFacesCFF(lmMvMvto);
    } else {
      if (glMdLoadCMC) {
        if (goFaSfc1CFF) {
          try {
            if (
              faceapi.euclideanDistance(
                goFaSfc1CFF.descriptor,
                goFaSfc2CFF.descriptor
              ) > 0.5
            ) {
              comparaFacesCFF(lmMvMvto);

              return;
            } else {
              app.dialog.progress("salvando itens");

              if (gmMvMvtoCMM.length > 0) {
                insereCadastroEstoqueMovimentacaoEstoqueCMC(lmMvMvto);
              } else {
                if (
                  loImFoto.src.toString().trim().indexOf("img/semImagem.png") <
                  0
                ) {
                  gcMvFotoCMC = loImFoto.src.toString().trim();
                }

                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    function (loMpLoca) {
                      insereMovimentacaoEstoqueCMC(
                        lmMvMvto,
                        loMpLoca.coords.latitude.toString().trim(),
                        loMpLoca.coords.longitude.toString().trim()
                      );
                    },
                    function (error) {
                      insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
                    },
                    {
                      maximumAge: 60000,
                      timeout: 10000,
                      enableHighAccuracy: true,
                    }
                  );
                } else {
                  insereMovimentacaoEstoqueCMC(lmMvMvto, "", "");
                }
              }

              finalizaVideoCFF();

              goMnView.router.back();
            }
          } catch (error) {
            comparaFacesCFF(lmMvMvto);

            return;
          }
        } else {
          comparaFacesCFF(lmMvMvto);

          return;
        }
      } else {
        comparaFacesCFF(lmMvMvto);
      }
    }
  } else {
    if (gcSiOper == "iOS") {
      insereFotoFacialCFF(lmMvMvto);
    } else {
      if (glMdLoadCMC) {
        if (goFaSfc1CFF) {
          try {
            if (
              faceapi.euclideanDistance(
                goFaSfc1CFF.descriptor,
                goFaSfc1CFF.descriptor
              ) <= 0.5
            ) {
              insereFotoFacialCFF(lmMvMvto);
            } else {
              alerta("nenhum rosto detectado na foto cadastrada", "alerta");

              return;
            }
          } catch (error) {
            insereFotoFacialCFF(lmMvMvto);

            return;
          }
        } else {
          insereFotoFacialCFF(lmMvMvto);

          return;
        }
      } else {
        insereFotoFacialCFF(lmMvMvto);
      }
    }
  }
}

function finalizaVideoCFF() {
  try {
    goVdStrmCFF.getTracks().forEach(function (loStTrck) {
      loStTrck.stop();
    });
  } catch (error) {}
}

async function setaGoFaSfc2CFF(loImHtml) {
  goFaSfc2CFF = await faceapi
    .detectSingleFace(loImHtml)
    .withFaceLandmarks()
    .withFaceDescriptor();
}

function setTimeOutFacialCFF() {
  var loDvTitu = document.getElementById("divTituCFF"),
    loDvFunc = document.getElementById("divFuncCFF"),
    loImFunc = document.getElementById("imgFuncCFF");

  if (gcFuFotoCMC.trim().toUpperCase() == "PESQUISANDOFOTO") {
    goDpCfacCFF = app.dialog.preloader("consultando cadastro de facial");

    setTimeout(function () {
      goDpCfacCFF.close();

      if (gcFuFotoCMC.trim().toUpperCase() == "PESQUISANDOFOTO") {
        setTimeOutFacialCFF();
      } else {
        if (gcFuFotoCMC.trim().length > 0) {
          loDvTitu.innerHTML = "reconhecimento facial";

          loImFunc.src = gcFuFotoCMC;

          setaGoFaSfc2CFF(loImFunc);
        } else {
          loDvTitu.innerHTML = "cadastro de facial";

          loDvFunc.style.display = "none";
        }
      }
    }, 1000);
  } else {
    if (gcFuFotoCMC.trim().length > 0) {
      loDvTitu.innerHTML = "reconhecimento facial";

      loImFunc.src = gcFuFotoCMC;

      setaGoFaSfc2CFF(loImFunc);
    } else {
      loDvTitu.innerHTML = "cadastro de facial";

      loDvFunc.style.display = "none";
    }
  }
}

async function setaGoFaSfc1CFF(loImHtml) {
  goFaSfc1CFF = await faceapi
    .detectSingleFace(loImHtml)
    .withFaceLandmarks()
    .withFaceDescriptor();
}

function limpaCamposCFF() {
  var loDvTitu = document.getElementById("divTituCFF"),
    loDvVdeo = document.getElementById("divVdeoCFF"),
    loDvTira = document.getElementById("divTiraCFF"),
    loDvCanv = document.getElementById("divCanvCFF"),
    loDvFoto = document.getElementById("divFotoCFF"),
    loImFoto = document.getElementById("imgFotoCFF"),
    loDvFunc = document.getElementById("divFuncCFF"),
    loImFunc = document.getElementById("imgFuncCFF");

  goVdStrmCFF = {};
  goFaSfc1CFF = {};
  goFaSfc2CFF = {};

  loDvTitu.innerHTML = "";

  loDvVdeo.style.display = "";
  loDvTira.style.display = "";
  loDvCanv.style.display = "";

  finalizaVideoCFF();

  loDvFoto.style.display = "";

  loImFoto.src = "img/semImagem.png";

  loDvFunc.style.display = "";

  loImFunc.src = "img/semImagem.png";
}

function CestFaFoto() {
  var loDvTitu = document.getElementById("divTituCFF"),
    loDvVdeo = document.getElementById("divVdeoCFF"),
    loDvTira = document.getElementById("divTiraCFF"),
    loDvCanv = document.getElementById("divCanvCFF"),
    loDvFoto = document.getElementById("divFotoCFF"),
    loImFoto = document.getElementById("imgFotoCFF"),
    loDvFunc = document.getElementById("divFuncCFF"),
    loImFunc = document.getElementById("imgFuncCFF");
  var loBtStrt = document.querySelector("#btnStrtCFF"),
    loVdCame = document.querySelector("#vdoCameCFF"),
    loBtTira = document.querySelector("#btnTiraCFF"),
    loCvCanv = document.querySelector("#cnvCanvCFF");
  var loCmOptn = {};

  limpaCamposCFF();

  if (isMobile()) {
    loDvVdeo.style.display = "none";
    loDvTira.style.display = "none";
    loDvCanv.style.display = "none";

    loCmOptn = {
      // quality: 45,
      // targetWidth: 200,
      // targetHeight: 300,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: false,
      // correctOrientation: true,
      saveToPhotoAlbum: false,
    };

    loBtStrt.addEventListener("click", async function () {
      goDpCfotCFF = app.dialog.preloader("carregando foto");

      navigator.camera.getPicture(
        function onSuccess(lcFuBs64) {
          goDpCfotCFF.close();

          // loImFoto.src = "data:image/png;base64," + lcFuBs64;
          loImFoto.src = lcFuBs64;

          setaGoFaSfc1CFF(loImFoto);
        },
        function onFail(lcWkMnsg) {
          goDpCfotCFF.close();

          alerta(
            "não foi possível carregar a foto: " +
              lcWkMnsg +
              ", tente novamente",
            "alerta"
          );
        },
        loCmOptn
      );
    });
  } else {
    loDvFoto.style.display = "none";

    loBtStrt.addEventListener("click", async function () {
      goVdStrmCFF = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      loVdCame.srcObject = goVdStrmCFF;
    });

    loBtTira.addEventListener("click", async function () {
      loCvCanv
        .getContext("2d")
        .drawImage(loVdCame, 0, 0, loCvCanv.width, loCvCanv.height);

      loImFoto.src = loCvCanv.toDataURL("image/png");

      goFaSfc1CFF = await faceapi
        .detectSingleFace(loImFoto)
        .withFaceLandmarks()
        .withFaceDescriptor();
    });
  }

  if (gcFuFotoCMC.trim().toUpperCase() == "PESQUISANDOFOTO") {
    setTimeOutFacialCFF();

    return;
  }

  if (gcFuFotoCMC.trim().length > 0) {
    loDvTitu.innerHTML = "reconhecimento facial";

    loImFunc.src = gcFuFotoCMC;

    setaGoFaSfc2CFF(loImFunc);
  } else {
    loDvTitu.innerHTML = "cadastro de facial";

    loDvFunc.style.display = "none";
  }
}
