function atualizaUsuarioCDU(lnPtCadt) {
  var loTxNome = document.getElementById("txtNomeCDU");
  var loEmMail = document.getElementById("emlMailCDU");
  var loPwSnat = document.getElementById("pwdSnatCDU");
  var loPwNsen = document.getElementById("pwdNsenCDU");
  var loPwCnsn = document.getElementById("pwdCnsnCDU");
  var lcWkIsql = "",
    lcApErro = "",
    lcUsNome = null,
    lcUsMail = null,
    lcUsSmd5 = null;
  var lmWkIsql = [];
  var llCpAlrt = false;

  if (lnPtCadt == 1) {
    if (loTxNome.value.toString().trim().length == 0) {
      app.input.validate(loTxNome);

      llCpAlrt = true;
    }
  }

  if (lnPtCadt == 2) {
    if (loPwSnat.value.toString().trim().length == 0) {
      app.input.validate(loPwSnat);

      llCpAlrt = true;
    }

    if (loPwNsen.value.toString().trim().length == 0) {
      app.input.validate(loPwNsen);

      llCpAlrt = true;
    }

    if (loPwCnsn.value.toString().trim().length == 0) {
      app.input.validate(loPwCnsn);

      llCpAlrt = true;
    }
  }

  if (llCpAlrt) {
    return;
  }

  if (lnPtCadt == 1) {
    if (!validaEmail(loEmMail.value.toString().trim())) {
      alerta("e-mail inválido, verifique o que foi digitado", "alerta");

      return;
    }

    lcUsNome = loTxNome.value.toString().trim().toUpperCase();

    lcUsMail = loEmMail.value.toString().trim().toUpperCase();
  }

  if (lnPtCadt == 2) {
    if (
      CryptoJS.MD5(loPwSnat.value.toString().trim().toUpperCase())
        .toString()
        .trim()
        .toUpperCase() != goCdUser.us_smd5.toString().trim().toUpperCase()
    ) {
      alerta("senha atual incorreta", "alerta");

      return;
    }

    if (
      loPwNsen.value.toString().trim().toUpperCase() !=
      loPwCnsn.value.toString().trim().toUpperCase()
    ) {
      alerta("senhas não conferem", "alerta");

      return;
    }

    lcUsSmd5 = CryptoJS.MD5(loPwNsen.value.toString().trim().toUpperCase())
      .toString()
      .trim()
      .toUpperCase();
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() }, 
    { pa_nome: "lcUsNome", pa_tipo: "VarChar", pa_valo: lcUsNome },
    { pa_nome: "lcUsMail", pa_tipo: "VarChar", pa_valo: lcUsMail },
    { pa_nome: "lcUsSmd5", pa_tipo: "VarChar", pa_valo: lcUsSmd5 }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=atualizaUsuario",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          lmWkRsql[0]["ws_http"] = goCdUser.ws_http.trim();
          lmWkRsql[0]["ws_wiis"] = goCdUser.ws_wiis.trim();
          lmWkRsql[0]["em_sqlt"] = goCdUser.em_sqlt.trim();

          localStorage.setItem("soCdUser", JSON.stringify(lmWkRsql[0]));

          goCdUser = lmWkRsql[0];

          limpaCamposCDU();

          if (lnPtCadt == 1) {
            lcSuMsgm = "dados pessoais alterados";
          }

          if (lnPtCadt == 2) {
            lcSuMsgm = "senha alterada";
          }

          notificacao(lcSuMsgm, "sucesso");

          return;
        } else {
          localStorage.removeItem("soCdUser");

          window.location = "LginUsKerp.html";

          return;
        }
      } catch (loApErro) {
        lcApErro = loApErro.message;
      }
    },
    error: function (jqXHR, textStatus, err) {
      alerta(
        "não foi possível alterar o cadastro, verifique sua conexão com a internet",
        "erro"
      );
    },
  });
}

function limpaCamposCDU() {
  var loDvUser = document.getElementById("divUserCDU");
  var loTxNome = document.getElementById("txtNomeCDU");
  var loEmMail = document.getElementById("emlMailCDU");
  var loPwSnat = document.getElementById("pwdSnatCDU");
  var loPwNsen = document.getElementById("pwdNsenCDU");
  var loPwCnsn = document.getElementById("pwdCnsnCDU");

  loDvUser.innerHTML = goCdUser.id_user.trim().toUpperCase();

  loTxNome.value = goCdUser.us_nome.trim().toUpperCase();

  app.input.validate(loTxNome);

  loEmMail.value = goCdUser.us_mail.trim().toLowerCase();
  loPwSnat.value = "";
  loPwNsen.value = "";
  loPwCnsn.value = "";
}

function CntaDoUser() {
  limpaCamposCDU();

  OkTecladoAndroid2("txtNomeCDU", "emlMailCDU");
  OkTecladoAndroid3("emlMailCDU", "btnDpesCDU", "btnDpesCDU");
  OkTecladoAndroid2("pwdSnatCDU", "pwdNsenCDU");
  OkTecladoAndroid2("pwdNsenCDU", "pwdCnsnCDU");
  OkTecladoAndroid3("pwdCnsnCDU", "btnSenhCDU", "btnSenhCDU");
}
