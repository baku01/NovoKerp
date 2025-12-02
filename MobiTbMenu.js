function insereMTM() {
  var loTxPosi = document.getElementById("txtPosiMTM");
  var loTxPare = document.getElementById("txtPareMTM");
  var loTxDeno = document.getElementById("txtDenoMTM");
  var loTxImag = document.getElementById("txtImagMTM");
  var loTxTela = document.getElementById("txtTelaMTM");
  var loTxPath = document.getElementById("txtPathMTM");
  var loTxLink = document.getElementById("txtLinkMTM");
  var loSlTipo = document.getElementById("sltTipoMTM");
  var loUlMenu = document.getElementById("uulMenuMTM");
  var lcWkIsql = "";
  var lmWkIsql = [];
  var llCpAlrt = false;

  if (loTxPosi.value.toString().trim().length == 0) {
    app.input.validate(loTxPosi);

    llCpAlrt = true;
  }

  if (loTxDeno.value.toString().trim().length == 0) {
    app.input.validate(loTxDeno);

    llCpAlrt = true;
  }

  if (llCpAlrt) {
    return;
  }

  if (
    loTxPosi.value.toString().trim().length != 9 ||
    isNaN(loTxPosi.value) ||
    (loTxPosi.value.toString().trim().charAt(0) != "+" &&
      loTxPosi.value.toString().trim().charAt(0) != "-")
  ) {
    alerta("posição inválida", "alerta");

    return;
  }

  if (
    loSlTipo.value.toString().trim().toUpperCase() != "M" &&
    loSlTipo.value.toString().trim().toUpperCase() != "L" &&
    loTxTela.value.toString().trim().length == 0
  ) {
    alerta("nome da tela obrigatório", "alerta");

    return;
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdPosi", pa_tipo: "VarChar", pa_valo: loTxPosi.value.toString().trim().replace("+", "M").toUpperCase() },
    { pa_nome: "lcMnPare", pa_tipo: "VarChar", pa_valo: loTxPare.value.toString().trim().replace("+", "M").toUpperCase() },
    { pa_nome: "lcMnDeno", pa_tipo: "VarChar", pa_valo: loTxDeno.value.toString().trim().toUpperCase() },
    { pa_nome: "lcMnImag", pa_tipo: "VarChar", pa_valo: loTxImag.value.toString().trim().toUpperCase() },
    { pa_nome: "lcMnTela", pa_tipo: "VarChar", pa_valo: loTxTela.value.toString().trim() },
    { pa_nome: "lcMnPath", pa_tipo: "VarChar", pa_valo: loTxPath.value.toString().trim() },
    { pa_nome: "lcMnLink", pa_tipo: "VarChar", pa_valo: loTxLink.value.toString().trim() },
    { pa_nome: "lcMnTipo", pa_tipo: "VarChar", pa_valo: loSlTipo.value.toString().trim().toUpperCase() }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposMTM();

  loUlMenu.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereMenu",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          montaGridMTM(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function alteraTipoMTM() {
  var loLiPare = document.getElementById("lliPareMTM");
  var loTxPare = document.getElementById("txtPareMTM");
  var loLiImag = document.getElementById("lliImagMTM");
  var loTxImag = document.getElementById("txtImagMTM");
  var loLiTela = document.getElementById("lliTelaMTM");
  var loTxTela = document.getElementById("txtTelaMTM");
  var loLiPath = document.getElementById("lliPathMTM");
  var loTxPath = document.getElementById("txtPathMTM");
  var loLiLink = document.getElementById("lliLinkMTM");
  var loTxLink = document.getElementById("txtLinkMTM");
  var loSlTipo = document.getElementById("sltTipoMTM");
  var lcMnTipo = loSlTipo.value.toString().trim().toUpperCase();

  loLiPare.style.display = "";
  loLiImag.style.display = "";
  loLiTela.style.display = "";
  loLiPath.style.display = "";
  loLiLink.style.display = "";

  if (lcMnTipo.length == 0) {
    loTxPare.value = "";

    loLiPare.style.display = "none";

    loTxImag.value = "";

    loLiImag.style.display = "none";

    loTxLink.value = "";

    loLiLink.style.display = "none";
  } else if (lcMnTipo == "L") {
    loTxTela.value = "";

    loLiTela.style.display = "none";

    loTxPath.value = "";

    loLiPath.style.display = "none";
  } else if (lcMnTipo == "M") {
    loTxPare.value = "";

    loLiPare.style.display = "none";

    loTxTela.value = "";

    loLiTela.style.display = "none";

    loTxPath.value = "";

    loLiPath.style.display = "none";

    loTxLink.value = "";

    loLiLink.style.display = "none";
  } else {
    loTxLink.value = "";

    loLiLink.style.display = "none";
  }
}

function deletaMTM(lcIdPosi) {
  var loUlMenu = document.getElementById("uulMenuMTM");
  var lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdPosi", pa_tipo: "VarChar", pa_valo: lcIdPosi.replace("+", "M") }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposMTM();

  loUlMenu.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=deletaMenu",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          montaGridMTM(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function consultaMenuMTM(lcIdPosi) {
  var loTxPosi = document.getElementById("txtPosiMTM");
  var loTxPare = document.getElementById("txtPareMTM");
  var loTxDeno = document.getElementById("txtDenoMTM");
  var loTxImag = document.getElementById("txtImagMTM");
  var loTxTela = document.getElementById("txtTelaMTM");
  var loTxPath = document.getElementById("txtPathMTM");
  var loTxLink = document.getElementById("txtLinkMTM");
  var loSlTipo = document.getElementById("sltTipoMTM");
  var lcWkIsql = "";
  var lmWkIsql = [];

  if (lcIdPosi.trim().length == 0) {
    if (
      loTxPosi.value.toString().trim().length != 9 ||
      isNaN(loTxPosi.value) ||
      (loTxPosi.value.toString().trim().charAt(0) != "+" &&
        loTxPosi.value.toString().trim().charAt(0) != "-")
    ) {
      loTxPosi.value = "";

      return;
    } else {
      lcIdPosi = loTxPosi.value.toString().trim();
    }
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcMnTipo", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcIdPosi", pa_tipo: "VarChar", pa_valo: lcIdPosi.trim().replace("+", "M").toUpperCase() }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaMenu",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loTxPosi.value = lmWkRsql[0].id_posi.trim().toUpperCase();

          app.input.validate(loTxPosi);

          loTxPare.value = lmWkRsql[0].mn_pare.trim().toUpperCase();
          loTxDeno.value = lmWkRsql[0].mn_deno.trim().toUpperCase();

          app.input.validate(loTxDeno);

          loTxImag.value = lmWkRsql[0].mn_imag.trim().toUpperCase();
          loTxTela.value = lmWkRsql[0].mn_tela.trim();
          loTxPath.value = lmWkRsql[0].mn_path.trim();
          loTxLink.value = lmWkRsql[0].mn_link.trim();
          loSlTipo.value = lmWkRsql[0].mn_tipo.trim().toUpperCase();

          alteraTipoMTM();
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function montaGridMTM(lmWkRsql) {
  var loUlMenu = document.getElementById("uulMenuMTM");
  var lcWkRsql = "",
    lcMnClor = "",
    lcMnPare = "";

  for (var i = 0; i < lmWkRsql.length; i++) {
    if (parseInt(lmWkRsql[i].id_posi) < 0) {
      lcMnClor = "style='opacity: 0.2;'";
    } else {
      lcMnClor = "";
    }

    if (
      lcMnPare.trim().length > 0 &&
      lcMnPare.trim() != lmWkRsql[i].mn_pare.trim()
    ) {
      lcMnPare = "";

      //prettier-ignore
      lcWkRsql += 
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    }

    if (lmWkRsql[i].mn_tipo.trim().toUpperCase() == "M") {
      lcMnPare = lmWkRsql[i].id_posi.trim();

      //prettier-ignore
      lcWkRsql += 
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            "<div class='item-media' onclick='deletaMTM(\"" + lmWkRsql[i].id_posi.trim() + "\");'>" +
              "<i class='material-icons text-color-red'>remove_circle</i>" +
            "</div>" +
            "<div class='item-inner' onclick='consultaMenuMTM(\"" + lmWkRsql[i].id_posi.trim() + "\");'>" +
              "<div class='item-title'>" +
                lmWkRsql[i].mn_deno.trim().toUpperCase() +
              "</div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>";
    } else {
      //prettier-ignore
      lcWkRsql +=
                "<li " + lcMnClor + ">" +
                  "<div class='item-content'>" +
                    "<div class='item-media' onclick='deletaMTM(\"" + lmWkRsql[i].id_posi.trim() + "\");'>" +
                      "<i class='material-icons text-color-red'>remove_circle</i>" +
                    "</div>" +
                    "<div class='item-inner' onclick='consultaMenuMTM(\"" + lmWkRsql[i].id_posi.trim() + "\");'>" +
                      "<div class='item-title'><b>" + lmWkRsql[i].mn_deno.trim().toUpperCase() + "</b></div>" +
                    "</div>" +
                  "</div>" +
                "</li>";
    }
  }

  loUlMenu.innerHTML = lcWkRsql;
}

function pesquisaMenuMTM() {
  var loUlMenu = document.getElementById("uulMenuMTM");
  var loDvLoad = document.getElementById("divLoadMTM");
  var lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcMnTipo", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcIdPosi", pa_tipo: "VarChar", pa_valo: null }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loUlMenu.innerHTML = "";

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaMenu",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          montaGridMTM(lmWkRsql);
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function limpaCamposMTM() {
  var loTxPosi = document.getElementById("txtPosiMTM");
  var loTxPare = document.getElementById("txtPareMTM");
  var loTxDeno = document.getElementById("txtDenoMTM");
  var loTxImag = document.getElementById("txtImagMTM");
  var loTxTela = document.getElementById("txtTelaMTM");
  var loTxPath = document.getElementById("txtPathMTM");
  var loTxLink = document.getElementById("txtLinkMTM");
  var loSlTipo = document.getElementById("sltTipoMTM");
  var loDvLoad = document.getElementById("divLoadMTM");

  loTxPosi.value = "";
  loTxPare.value = "";
  loTxDeno.value = "";
  loTxImag.value = "";
  loTxTela.value = "";
  loTxPath.value = "";
  loTxLink.value = "";
  loSlTipo.value = "T";

  alteraTipoMTM();

  loDvLoad.style.display = "none";
}

function MobiTbMenu() {
  limpaCamposMTM();
  pesquisaMenuMTM();

  OkTecladoAndroid("txtPosiMTM");
  OkTecladoAndroid2("txtPareMTM", "txtDenoMTM");
  OkTecladoAndroid2("txtDenoMTM", "txtImagMTM");
  OkTecladoAndroid2("txtImagMTM", "txtTelaMTM");
  OkTecladoAndroid2("txtTelaMTM", "txtPathMTM");
  OkTecladoAndroid2("txtPathMTM", "txtLinkMTM");
  OkTecladoAndroid("txtLinkMTM");
}
