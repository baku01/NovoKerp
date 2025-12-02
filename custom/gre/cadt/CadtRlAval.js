var gmWkRsqlCRA = [];
var goCdFuncCRA = {};
var gnInListCRA = 0;

function consultaCRA(loWkRsql) {
  var loDvFunc = document.getElementById("divFuncCRA");

  if (loWkRsql.id_parm.trim().toUpperCase() == "AV_MATR") {
    goCdFuncCRA = loWkRsql;

    loDvFunc.innerHTML = loWkRsql.fu_nome.trim().toUpperCase();
  }
}

function limpaCamposFuncionarioCRA() {
  var loDvFunc = document.getElementById("divFuncCRA");

  goCdFuncCRA = {};

  loDvFunc.innerHTML = "";
}

function pesquisaFuncionariosAvaliadosCRA() {
  var loDtDtde = document.getElementById("datDtdeCRA");
  var loDtDtat = document.getElementById("datDtatCRA");
  var lcAvDtde = null,
    lcAvDtat = null;
  var loPaPesq = {};
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposFuncionarioCRA();

  if (loDtDtde.value.toString().trim().length > 0) {
    if (htmlDataParaObjetoData(loDtDtde.value.toString().trim()) > ldDtHoje) {
      loDtDtde.valueAsDate = ldDtHoje;
    }
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    if (htmlDataParaObjetoData(loDtDtat.value.toString().trim()) > ldDtHoje) {
      loDtDtat.valueAsDate = ldDtHoje;
    }
  }

  if (
    loDtDtde.value.toString().trim().length > 0 &&
    loDtDtat.value.toString().trim().length > 0
  ) {
    if (
      htmlDataParaObjetoData(loDtDtde.value.toString().trim()) >
      htmlDataParaObjetoData(loDtDtat.value.toString().trim())
    ) {
      loDtDtde.value = loDtDtat.value;
    }
  }

  if (loDtDtde.value.toString().trim().length > 0) {
    lcAvDtde = loDtDtde.value.toString().trim();
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcAvDtat = loDtDtat.value.toString().trim();
  }

  loPaPesq = {
    id_parm: "av_matr",
    pa_titu: "pesquisa de funcionários avaliados",
    pa_pesq: true,
    av_dtde: lcAvDtde,
    av_dtat: lcAvDtat,
    pa_slct:
      "<option value='fu_nome' selected>nome</option>" +
      "<option value='id_matr'>matrícula</option>",
  };

  sessionStorage.setItem("soPaPesq", JSON.stringify(loPaPesq));

  redireciona("PesqTbCadt.html", "PesqTbCadt.html");
}

function consultaAvaliacaoCRA(lcFuAval) {
  var loFuAval = JSON.parse(unescape(lcFuAval));

  sessionStorage.setItem("soFuAval", JSON.stringify(loFuAval));

  redireciona("custom/gre/cadt/CadtFuAval.html", "CadtFuAval.html");
}

function montaAvaliacoesCRA() {
  var loDvAval = document.getElementById("divAvalCRA");
  var loDvLoad = document.getElementById("divLoadCRA");
  var lcWkRsql = "";
  var lnFnList = 0,
    lnAvNota = 0;

  if (gnInListCRA + 20 >= gmWkRsqlCRA.length) {
    loDvAval.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCRA.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCRA + 20;
  }

  for (var i = gnInListCRA; i < lnFnList; i++) {
    lnAvNota =
      (parseFloat(gmWkRsqlCRA[i].av_orga) +
        parseFloat(gmWkRsqlCRA[i].av_prod) +
        parseFloat(gmWkRsqlCRA[i].av_qual) +
        parseFloat(gmWkRsqlCRA[i].av_disc) +
        parseFloat(gmWkRsqlCRA[i].av_falt) +
        parseFloat(gmWkRsqlCRA[i].av_celu) +
        parseFloat(gmWkRsqlCRA[i].av_aloj) +
        parseFloat(gmWkRsqlCRA[i].av_resc) +
        parseFloat(gmWkRsqlCRA[i].av_ferr)) /
      9;

    //prettier-ignore
    lcWkRsql += 
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-media' onclick='consultaAvaliacaoCRA(\"" + escape(JSON.stringify(gmWkRsqlCRA[i])) + "\");'>" +
            "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
          "</div>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmWkRsqlCRA[i].fu_nome.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + brDecimal(lnAvNota) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data</div>" +
                    "<div class='item-after'>" + jsonDate(gmWkRsqlCRA[i].av_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>obra</div>" +
                    "<div class='item-after'>" + gmWkRsqlCRA[i].cl_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>matrícula</div>" +
                    "<div class='item-after'>" + gmWkRsqlCRA[i].id_matr.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>funcionário</div>" +
                    "<div class='item-after'>" + gmWkRsqlCRA[i].fu_nome.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>função</div>" +
                    "<div class='item-after'>" + gmWkRsqlCRA[i].fu_func.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>avaliador</div>" +
                    "<div class='item-after'>" + gmWkRsqlCRA[i].id_user.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>nota</div>" +
                    "<div class='item-after'>" + brDecimal(lnAvNota) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCRA = i;

  $("#uulAvalCRA").append(lcWkRsql);
}

function pesquisaAvaliacoesCRA() {
  var loDvAval = document.getElementById("divAvalCRA");
  var loDtDtde = document.getElementById("datDtdeCRA");
  var loDtDtat = document.getElementById("datDtatCRA");
  var loSlObra = document.getElementById("sltObraCRA");
  var loDvLoad = document.getElementById("divLoadCRA");
  var lcWkIsql = "",
    lcFuNome = null,
    lcAvDtde = null,
    lcAvDtat = null;
  var lnIdClie = null;
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtDtde.value.toString().trim().length > 0) {
    lcAvDtde = loDtDtde.value.toString().trim();
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcAvDtat = loDtDtat.value.toString().trim();
  }

  if (lcAvDtde != null) {
    if (htmlDataParaObjetoData(lcAvDtde) > ldDtHoje) {
      alerta("data inicial maior que data atual", "alerta");

      return;
    }
  }

  if (lcAvDtat != null) {
    if (htmlDataParaObjetoData(lcAvDtat) > ldDtHoje) {
      alerta("data final maior que data atual", "alerta");

      return;
    }
  }

  if (lcAvDtde != null && lcAvDtat != null) {
    if (htmlDataParaObjetoData(lcAvDtde) > htmlDataParaObjetoData(lcAvDtat)) {
      alerta("data inicial maior que data final", "alerta");

      return;
    }
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0]) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0]);
    }
  } catch (error) {}

  try {
    if (parseInt(goCdFuncCRA.id_matr) > 0) {
      lcFuNome = goCdFuncCRA.fu_nome.trim().toUpperCase();
    }
  } catch (error) {}

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldAvDtde", pa_tipo: "SmallDatetime", pa_valo: lcAvDtde },
    { pa_nome: "ldAvDtat", pa_tipo: "SmallDatetime", pa_valo: lcAvDtat },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCRA();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaAvaliacoes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlCRA = lmWkRsql;

      montaAvaliacoesCRA();

      loDvAval.onscroll = function () {
        if (
          loDvAval.scrollHeight - loDvAval.scrollTop - loDvAval.clientHeight <
          1
        ) {
          montaAvaliacoesCRA();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function pesquisaObrasAvaliadasCRA() {
  var loDtDtde = document.getElementById("datDtdeCRA");
  var loDtDtat = document.getElementById("datDtatCRA");
  var loSlObra = document.getElementById("sltObraCRA");
  var loDvFunc = document.getElementById("divFuncCRA");
  var lcWkRsql = "<option value='0/0'>TODAS AS OBRAS</option>",
    lcWkIsql = "",
    lcAvDtde = null,
    lcAvDtat = null;
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtDtde.value.toString().trim().length > 0) {
    if (htmlDataParaObjetoData(loDtDtde.value.toString().trim()) > ldDtHoje) {
      loDtDtde.valueAsDate = ldDtHoje;
    }
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    if (htmlDataParaObjetoData(loDtDtat.value.toString().trim()) > ldDtHoje) {
      loDtDtat.valueAsDate = ldDtHoje;
    }
  }

  if (
    loDtDtde.value.toString().trim().length > 0 &&
    loDtDtat.value.toString().trim().length > 0
  ) {
    if (
      htmlDataParaObjetoData(loDtDtde.value.toString().trim()) >
      htmlDataParaObjetoData(loDtDtat.value.toString().trim())
    ) {
      loDtDtde.value = loDtDtat.value;
    }
  }

  if (loDtDtde.value.toString().trim().length > 0) {
    lcAvDtde = loDtDtde.value.toString().trim();
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcAvDtat = loDtDtat.value.toString().trim();
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldAvDtde", pa_tipo: "SmallDatetime", pa_valo: lcAvDtde },
    { pa_nome: "ldAvDtat", pa_tipo: "SmallDatetime", pa_valo: lcAvDtat },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0/0'>CRAREGANDO OBRAS...</option>";

  goCdFuncCRA = {};

  loDvFunc.innerHTML = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasAvaliadas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlObra.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
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

function limpaCamposCRA() {
  var loDvAval = document.getElementById("divAvalCRA");
  var loUlAval = document.getElementById("uulAvalCRA");
  var loDvLoad = document.getElementById("divLoadCRA");

  gmWkRsqlCRA = [];
  gnInListCRA = 0;

  loDvAval.onscroll = function () {};

  loUlAval.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CadtRlAval() {
  var loDtDtde = document.getElementById("datDtdeCRA");
  var loDtDtat = document.getElementById("datDtatCRA");
  var ldDtHoje = new Date();

  goCdFuncCRA = {};

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setMonth(ldDtHoje.getMonth() - 1);

  loDtDtde.valueAsDate = ldDtHoje;

  limpaCamposCRA();
  pesquisaObrasAvaliadasCRA();
  pesquisaAvaliacoesCRA();
}
