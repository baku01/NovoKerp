function montaGridMCA(lmWkRsql) {
  if (lmWkRsql.length > 0) {
    $(":checkbox").each(function() {
      for (var i = 0; i < lmWkRsql.length; i++) {
        if (parseInt(this.value) == parseInt(lmWkRsql[i].id_posi)) {
          this.checked = true;

          break;
        }
      }
    });
  }
}

function insereMCA() {
  var loDvUser = document.getElementById("divUserMCA");
  var lcWkIsql = "",
    lcAtChck = "";
  var lmWkIsql = [];
  var lcIdUser = 0;

  try {
    if (loDvUser.innerHTML.trim().length > 0) {
      lcIdUser = loDvUser.innerHTML.trim().toUpperCase();
    } else {
      alerta("pesquise um usuário utilizando a lupinha", "alerta");

      return;
    }
  } catch (error) {
    alerta("pesquise um usuário utilizando a lupinha", "erro");

    return;
  }

  $(":checkbox").each(function() {
    if (this.checked) {
      lcAtChck += this.value
        .toString()
        .trim()
        .replace("+", "M");
    }
  });

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser },
    { pa_nome: "lcAtChck", pa_tipo: "VarChar", pa_valo: lcAtChck }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposMCA();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereAutoridade",
    type: "GET",
    dataType: "jsonp",

    success: function(lmWkRsql) {
      try {
        montaGridMCA(lmWkRsql);

        notificacao("autoridade alterada", "sucesso");
      } catch (loApErro) {}
    },
    error: function(jqXHR, textStatus, err) {}
  });
}

function consultaMCA(loWkRsql) {
  var loDvUser = document.getElementById("divUserMCA");
  var lcWkIsql = "";
  var lmWkIsql = [];

  limpaCamposMCA();

  loDvUser.innerHTML = loWkRsql.id_user.trim().toUpperCase();

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: loWkRsql.id_user.trim().toUpperCase() }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaAutoridades",
    type: "GET",
    dataType: "jsonp",

    success: function(lmWkRsql) {
      try {
        montaGridMCA(lmWkRsql);
      } catch (loApErro) {}
    },
    error: function(jqXHR, textStatus, err) {}
  });
}

function pesquisaUsuariosMCA() {
  var loPaPesq = {
    id_parm: "id_user",
    pa_titu: "pesquisa de usuários",
    pa_slct:
      "<option value='id_user'>usuário</option>" +
      "<option value='us_nome'>nome</option>" +
      "<option value='us_mail'>e-mail</option>"
  };

  sessionStorage.setItem("soPaPesq", JSON.stringify(loPaPesq));

  redireciona("PesqTbCadt.html", "PesqTbCadt.html");
}

function pesquisaMenuMCA() {
  var loUlMenu = document.getElementById("uulMenuMCA");
  var loDvLoad = document.getElementById("divLoadMCA");
  var lcWkRsql = "",
    lcWkIsql = "",
    lcMnPare = "";
  var lmWkIsql = [];

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcMnTipo", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcIdPosi", pa_tipo: "VarChar", pa_valo: null }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaMenu",
    type: "GET",
    dataType: "jsonp",
    success: function(lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            if (parseInt(lmWkRsql[i].id_posi) > 0) {
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
                      "<div class='item-media'></div>" +
                      "<div class='item-inner'>" +
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
                          "<li>" +
                            "<label class='item-checkbox item-content'>" +
                              "<input type='checkbox' value='" + lmWkRsql[i].id_posi.trim() + "'>" +
                              "<i class='icon icon-checkbox'></i>" +
                              "<div class='item-inner'>" +
                                "<div class='item-title'>" + lmWkRsql[i].mn_deno.trim().toUpperCase() + "</div>" +
                              "</div>" +
                            "</label>" +
                          "</li>";
              }
            }
          }
        }
      } catch (loApErro) {}

      loUlMenu.innerHTML = lcWkRsql;
    },
    error: function(jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";

      loUlMenu.innerHTML = lcWkRsql;
    }
  });
}

function limpaCamposMCA() {
  $(":checkbox").each(function() {
    this.checked = false;
  });
}

function MobiCdAutd() {
  pesquisaMenuMCA();
}
