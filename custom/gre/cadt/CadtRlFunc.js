var gmWkRsqlCRF = [],
  gmFuSglaCRF = [];
var gnInListCRF = 0,
  gnPqEqtoCRF = null;
var goCdClieCRF = {};

function alteraDataCRF() {
  var loDtData = document.getElementById("datDataCRF");
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.value = loDtData.defaultValue;
  }

  ldDrData = htmlDataParaObjetoData(loDtData.value);

  if (ldDrData < ldDtHoje) {
    loDtData.valueAsDate = ldDtHoje;
  }

  if (
    loDtData.value.toString().trim().toUpperCase() ==
    loDtData.defaultValue.toString().trim().toUpperCase()
  ) {
    return;
  }

  pesquisaObrasDefinidasCRF();
  pesquisaTiposCRF();
  pesquisaFuncoesCRF();
}

function alteraObraCRF() {
  var loSlObra = document.getElementById("sltObraCRF");

  goCdClieCRF = {};

  loSlObra.options[0].innerHTML = "TODAS AS OBRAS";
}

function montaFuncionariosCRF() {
  var loDvFunc = document.getElementById("divFuncCRF");
  var loDvLoad = document.getElementById("divLoadCRF");
  var lcWkRsql = "",
    lcFuReco = "",
    lcFuSfix = "",
    lcFuNome = "",
    lcLbSfix = "";
  var lnFnList = 0;

  if (gnInListCRF + 20 >= gmWkRsqlCRF.length) {
    loDvFunc.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmWkRsqlCRF.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCRF + 20;
  }

  for (var i = gnInListCRF; i < lnFnList; i++) {
    if (gmWkRsqlCRF[i].cb_tmdo.trim().toUpperCase() == "EQP") {
      //prettier-ignore
      lcWkRsql += 
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            // "<div class='item-media'><b>" + gmWkRsqlCRF[i].id_matr.toString() + "</b></div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + gmWkRsqlCRF[i].fu_nome.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRsqlCRF[i].fu_func.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>empresa</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].em_fant.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>código</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].id_matr.toString() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>tipo</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>nome</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_nome.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>função</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_func.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>última obra</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].ul_obra.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>status</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].sr_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    } else {
      if (parseInt(gmWkRsqlCRF[i].fu_reco) > 1) {
        lcFuReco = "SIM";
      } else {
        lcFuReco = "NÃO";
      }

      if (parseInt(gmWkRsqlCRF[i].fu_sfix) > 0) {
        lcFuSfix = "SIM";

        lcFuNome = "* " + gmWkRsqlCRF[i].fu_nome.trim().toUpperCase();
        lcLbSfix = "* salário fixo";
      } else {
        lcFuSfix = "NÃO";

        lcFuNome = gmWkRsqlCRF[i].fu_nome.trim().toUpperCase();
        lcLbSfix = "salário fixo";
      }

      //prettier-ignore
      lcWkRsql += 
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            // "<div class='item-media'><b>" + gmWkRsqlCRF[i].id_matr.toString() + "</b></div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + lcFuNome + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRsqlCRF[i].fu_func.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>empresa</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].em_fant.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>matrícula</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].id_matr.toString() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>tipo</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>nome</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_nome.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>cpf</div>" +
                      "<div class='item-after'>" + formataCpf(gmWkRsqlCRF[i].fu_ncpf) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>rg</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_rgnu.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>função</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_func.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>nascimento</div>" +
                      "<div class='item-after'>" + jsonDate(gmWkRsqlCRF[i].fu_dtna) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>admissão</div>" +
                      "<div class='item-after'>" + jsonDate(gmWkRsqlCRF[i].fu_dtad) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>rescisão</div>" +
                      "<div class='item-after'>" + jsonDate(gmWkRsqlCRF[i].fu_drec) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>fim contrato experiência</div>" +
                      "<div class='item-after'>" + jsonDate(gmWkRsqlCRF[i].fu_fcon) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>prorrogação</div>" +
                      "<div class='item-after'>" + jsonDate(gmWkRsqlCRF[i].fu_dpro) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>recontratado</div>" +
                      "<div class='item-after'>" + lcFuReco + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>contratado para obra</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].dp_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>última obra</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].ul_obra.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>status</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].sr_deno.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>indicação</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_indi.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>salário</div>" +
                      "<div class='item-after'>" + brMoney(gmWkRsqlCRF[i].ff_sala) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>" + lcLbSfix + "</div>" +
                      "<div class='item-after'>" + lcFuSfix + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>cidade</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_cida.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>estado</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_esta.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>celular</div>" +
                      "<div class='item-after'>" + gmWkRsqlCRF[i].fu_celu.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    }
  }

  gnInListCRF = i;

  $("#uulFuncCRF").append(lcWkRsql);
}

function pesquisaTodosFuncionariosCRF() {
  var loDvFunc = document.getElementById("divFuncCRF");
  var loDtData = document.getElementById("datDataCRF");
  var loSlObra = document.getElementById("sltObraCRF");
  var loSlTmdo = document.getElementById("sltTmdoCRF");
  var loSlPesq = document.getElementById("sltPesqCRF");
  var loTxPesq = document.getElementById("txtPesqCRF");
  var loDvLoad = document.getElementById("divLoadCRF");
  var lcWkIsql = "",
    lcDrData = "",
    lcFuFunc = null,
    lcCbTmdo = null,
    lcFuNome = null,
    lcIdCadt = null;
  var lnIdCadt = null,
    lnIdMatr = null;
  var lmWkIsql = [],
    lmFuFunc = app.smartSelect.get(".clsFuncCRF").getValue();
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  if (loTxPesq.value.toString().trim().length > 0) {
    if (loSlPesq.value.toString().trim().toUpperCase() == "ID_MATR") {
      try {
        if (parseInt(loTxPesq.value) > 0) {
          lnIdMatr = parseInt(loTxPesq.value);
        }
      } catch (error) {}

      if (lnIdMatr == null) {
        alerta("matrícula inválida", "alerta");

        limpaCamposCRF();

        return;
      }
    } else {
      lcFuNome = loTxPesq.value.toString().trim().toUpperCase();
    }
  }

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDrData < ldDtHoje) {
    ldDrData = ldDtHoje;
  }

  lcDrData = objetoDataParaStringSqlData(ldDrData);

  try {
    if (parseInt(goCdClieCRF.id_cadt) > 0) {
      lnIdCadt = parseInt(goCdClieCRF.id_cadt);
      lcIdCadt = goCdClieCRF.id_cadt.toString();
    } else if (
      parseInt(goCdClieCRF.id_cadt) == 0 &&
      goCdClieCRF.ls_cadt.length > 0
    ) {
      lcIdCadt = "";

      for (var i = 0; i < goCdClieCRF.ls_cadt.length; i++) {
        lcIdCadt += goCdClieCRF.ls_cadt[i].trim().toUpperCase() + ", ";
      }

      lcIdCadt = lcIdCadt.trim().slice(0, -1);
    }
  } catch (error) {}

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1]) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1]);
    }
  } catch (error) {}

  try {
    if (loSlTmdo.value.toString().trim().length > 0) {
      lcCbTmdo = loSlTmdo.value.toString().trim().toUpperCase();
    }
  } catch (error) {}

  try {
    if (lmFuFunc.length > 0) {
      lcFuFunc = "";

      for (var i = 0; i < lmFuFunc.length; i++) {
        lcFuFunc += lmFuFunc[i].trim().toUpperCase() + "|";
      }

      lcFuFunc = lcFuFunc.slice(0, -1);
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lcCbTmdo", pa_tipo: "VarChar", pa_valo: lcCbTmdo },
    { pa_nome: "lcFuFunc", pa_tipo: "VarChar", pa_valo: lcFuFunc },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome },
    { pa_nome: "lcIdCadt", pa_tipo: "VarChar", pa_valo: lcIdCadt },
    { pa_nome: "lnPqEqto", pa_tipo: "Int", pa_valo: gnPqEqtoCRF },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCRF();

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaTodosFuncionarios",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      gmWkRsqlCRF = lmWkRsql;

      montaFuncionariosCRF();

      loDvFunc.onscroll = function () {
        if (
          loDvFunc.scrollHeight - loDvFunc.scrollTop - loDvFunc.clientHeight <
          1
        ) {
          montaFuncionariosCRF();
        }
      };
    },
    error: function (jqXHR, textStatus, err) {
      loDvLoad.style.display = "none";
    },
  });
}

function pesquisaFuncoesCRF() {
  var loDtData = document.getElementById("datDataCRF"),
    loOgFunc = document.getElementById("ogrFuncCRF");
  var lcWkRsql = "",
    lcWkIsql = "",
    lcDrData = "",
    lcFuFunc = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goCdClieCRF.id_cadt) >= 0) {
      lcFuFunc = "EQUIPAMENTO";
    }
  } catch (error) {}

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDrData < ldDtHoje) {
    ldDrData = ldDtHoje;
  }

  lcDrData = objetoDataParaStringSqlData(ldDrData);

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaFuncoes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lcFuFunc.trim().length > 0) {
          lmWkRsql.push({ fu_func: lcFuFunc.trim().toUpperCase() });

          lmWkRsql.sort(dynamicSort("fu_func"));
        }

        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].fu_func.trim().toUpperCase() + "'>" + lmWkRsql[i].fu_func.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loOgFunc.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loOgFunc.innerHTML = lcWkRsql;
    },
  });
}

function pesquisaTiposCRF() {
  var loDtData = document.getElementById("datDataCRF"),
    loSlTmdo = document.getElementById("sltTmdoCRF");
  var lcWkRsql = "<option value=''></option>",
    lcWkIsql = "",
    lcDrData = "",
    lcCbTmdo = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goCdClieCRF.id_cadt) >= 0) {
      lcCbTmdo = "EQP";
    }
  } catch (error) {}

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDrData < ldDtHoje) {
    ldDrData = ldDtHoje;
  }

  lcDrData = objetoDataParaStringSqlData(ldDrData);

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlTmdo.disabled = true;

  loSlTmdo.innerHTML = "<option value=''>CARREGANDO TIPOS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaTipos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlTmdo.disabled = false;

      if (lcCbTmdo.trim().length > 0) {
        //prettier-ignore
        lcWkRsql += "<option value='" + lcCbTmdo.trim().toUpperCase() + "'>" + lcCbTmdo.trim().toUpperCase() + "</option>";
      }

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "'>" + lmWkRsql[i].cb_tmdo.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlTmdo.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlTmdo.disabled = false;

      loSlTmdo.innerHTML = lcWkRsql;
    },
  });
}

function pesquisaDescricoesPlanejamentosCRF() {
  var loDtData = document.getElementById("datDataCRF"),
    loSlObra = document.getElementById("sltObraCRF");
  var lnIdCadt = null;
  var lcWkIsql = "",
    lcIdCadt = null,
    lcPlDesc = "",
    lcRpDesc = "",
    lcPmDtde = "",
    lcPmDtat = "",
    lcDrData = null;
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goCdClieCRF.id_cadt) == 0 && goCdClieCRF.ls_cadt.length > 0) {
      lcIdCadt = "";

      for (var i = 0; i < goCdClieCRF.ls_cadt.length; i++) {
        lcIdCadt += goCdClieCRF.ls_cadt[i].trim().toUpperCase() + ", ";
      }

      lcIdCadt = lcIdCadt.trim().slice(0, -1);
    }
  } catch (error) {}

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1]) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1]);
    }
  } catch (error) {}

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDrData < ldDtHoje) {
    ldDrData = ldDtHoje;
  }

  lcDrData = objetoDataParaStringSqlData(ldDrData);

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "int", pa_valo: lnIdCadt },
    { pa_nome: "lcIdCadt", pa_tipo: "VarChar", pa_valo: lcIdCadt },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDescricoesPlanejamentos",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      for (var i = 0; i < gmFuSglaCRF.length; i++) {
        lcPlDesc = "";
        lcRpDesc = "";

        for (var j = 0; j < lmWkRsql.length; j++) {
          if (
            gmFuSglaCRF[i].fu_sgla.trim().toUpperCase() ==
            lmWkRsql[j].fu_sgla.trim().toUpperCase()
          ) {
            lcPmDtde = "";
            lcPmDtat = "";

            if (jsonDate(lmWkRsql[j].pm_dtde).trim().length > 0) {
              lcPmDtde = "de " + jsonDate(lmWkRsql[j].pm_dtde) + " ";
            }

            if (jsonDate(lmWkRsql[j].pm_dtde).trim().length > 0) {
              lcPmDtat = "até " + jsonDate(lmWkRsql[j].pm_dtat) + ": ";
            }

            if (lmWkRsql[j].pl_tipo.trim().toUpperCase() == "R") {
              lcRpDesc +=
                lmWkRsql[j].pm_qtde.toString() +
                " " +
                lcPmDtde +
                lcPmDtat +
                lmWkRsql[j].pl_desc.trim().toUpperCase() +
                "<br>";
            } else {
              lcPlDesc +=
                lmWkRsql[j].pm_qtde.toString() +
                " " +
                lcPmDtde +
                lcPmDtat +
                lmWkRsql[j].pl_desc.trim().toUpperCase() +
                "<br>";
            }
          }
        }

        if (lcPlDesc.trim().length > 0) {
          app.tooltip.create({
            targetEl: ".clsPln" + i.toString() + "CRF",
            text: lcPlDesc,
          });
        }

        if (lcRpDesc.trim().length > 0) {
          app.tooltip.create({
            targetEl: ".clsRpl" + i.toString() + "CRF",
            text: lcRpDesc,
          });
        }
      }
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaQuantidadeRecursosObraFuncaoCRF() {
  var loDtData = document.getElementById("datDataCRF"),
    loSlObra = document.getElementById("sltObraCRF");
  var loLiQtde = document.getElementById("lliQtdeCRF");
  var lnQtRcso = 0,
    lnFuQtde = 0,
    lnRpQtde = 0,
    lnIdCadt = null;
  var lcWkIsql = "",
    lcIdCadt = null,
    lcDrData = null;
  var lmWkIsql = [];
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goCdClieCRF.id_cadt) == 0 && goCdClieCRF.ls_cadt.length > 0) {
      lcIdCadt = "";

      for (var i = 0; i < goCdClieCRF.ls_cadt.length; i++) {
        lcIdCadt += goCdClieCRF.ls_cadt[i].trim().toUpperCase() + ", ";
      }

      lcIdCadt = lcIdCadt.trim().slice(0, -1);
    }
  } catch (error) {}

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1]) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1]);
    }
  } catch (error) {}

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDrData < ldDtHoje) {
    ldDrData = ldDtHoje;
  }

  lcDrData = objetoDataParaStringSqlData(ldDrData);

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "int", pa_valo: lnIdCadt },
    { pa_nome: "lcIdCadt", pa_tipo: "VarChar", pa_valo: lcIdCadt },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  gmFuSglaCRF = [];

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaQuantidadeRecursosObraFuncao",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmFuSglaCRF = lmWkRsql;

      //prettier-ignore
      loLiQtde.innerHTML =
        "<div class='row no-gap'>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>função</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>plan</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>atualização</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>real</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>atualização - real</b></span>" +
          "</div>" +
        "</div>";

      for (var i = 0; i < gmFuSglaCRF.length; i++) {
        lnQtRcso += parseInt(gmFuSglaCRF[i].qt_rcso);
        lnFuQtde += parseInt(gmFuSglaCRF[i].fu_qtde);
        lnRpQtde += parseInt(gmFuSglaCRF[i].rp_qtde);

        //prettier-ignore
        loLiQtde.innerHTML +=
        "<div class='row no-gap'>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span>" + gmFuSglaCRF[i].fu_sgla.trim().toUpperCase() + "</span>" +
          "</div>" +
          "<div class='col link clsPln" + i.toString() + "CRF' style='text-align: center; border: 1px solid;'>" +
            "<span>" + gmFuSglaCRF[i].fu_qtde.toString() + "</span>" +
          "</div>" +
          "<div class='col link clsRpl" + i.toString() + "CRF' style='text-align: center; border: 1px solid;'>" +
            "<span>" + gmFuSglaCRF[i].rp_qtde.toString() + "</span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span>" + gmFuSglaCRF[i].qt_rcso.toString() + "</span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span>" + (gmFuSglaCRF[i].rp_qtde - gmFuSglaCRF[i].qt_rcso).toString() + "</span>" +
          "</div>" +
        "</div>";
      }

      //prettier-ignore
      loLiQtde.innerHTML +=
        "<div class='row no-gap'>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>TODAS</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>" + lnFuQtde.toString() + "</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>" + lnRpQtde.toString() + "</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span><b>" + lnQtRcso.toString() + "</b></span>" +
          "</div>" +
          "<div class='col' style='text-align: center; border: 1px solid;'>" +
            "<span>" + (lnRpQtde - lnQtRcso).toString() + "</span>" +
          "</div>" +
        "</div>";

      pesquisaDescricoesPlanejamentosCRF();
    },
    error: function (jqXHR, textStatus, err) {
      loLiQtde.innerHTML = "";
    },
  });
}

function pesquisaObrasDefinidasCRF() {
  var loDtData = document.getElementById("datDataCRF"),
    loSlObra = document.getElementById("sltObraCRF");
  var lcWkRsql = "<option value='0/0'>TODAS AS OBRAS</option>",
    lcWkIsql = "",
    lcDrData = null,
    lcSlSlct = "";
  var lnIdCadt = 0;
  var lmWkIsql = [];
  var llSlSlct = false;
  var ldDtHoje = new Date(),
    ldDrData = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);
  ldDrData.setHours(0, 0, 0, 0);

  try {
    if (parseInt(goCdClieCRF.id_cadt) > 0) {
      lnIdCadt = parseInt(goCdClieCRF.id_cadt);
    } else if (parseInt(goCdClieCRF.id_cadt) == 0) {
      lcWkRsql = "<option value='0/0'>";

      for (var i = 0; i < goCdClieCRF.ls_fant.length; i++) {
        lcWkRsql += goCdClieCRF.ls_fant[i].trim().toUpperCase() + ", ";
      }

      lcWkRsql = lcWkRsql.slice(0, -2);

      lcWkRsql += "</option>";
    }
  } catch (error) {}

  if (loDtData.value.toString().trim().length > 0) {
    ldDrData = htmlDataParaObjetoData(loDtData.value);
  }

  if (ldDrData < ldDtHoje) {
    ldDrData = ldDtHoje;
  }

  lcDrData = objetoDataParaStringSqlData(ldDrData);

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          if (lnIdCadt == parseInt(lmWkRsql[i].id_cadt)) {
            lcSlSlct = " selected";

            llSlSlct = true;
          } else {
            lcSlSlct = "";
          }

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "/" + lmWkRsql[i].id_cadt.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      if (lnIdCadt > 0 && !llSlSlct) {
        //prettier-ignore
        lcWkRsql += "<option value='" + goCdClieCRF.id_clie.toString() + "/" + goCdClieCRF.id_cadt.toString() + "' selected>" + goCdClieCRF.cl_fant.trim().toUpperCase() + "</option>";
      }

      loSlObra.innerHTML = lcWkRsql;

      pesquisaQuantidadeRecursosObraFuncaoCRF();
      pesquisaTodosFuncionariosCRF();
    },
    error: function (jqXHR, textStatus, err) {
      loSlObra.innerHTML = lcWkRsql;

      pesquisaQuantidadeRecursosObraFuncaoCRF();
      pesquisaTodosFuncionariosCRF();
    },
  });
}

function limpaCamposCRF() {
  var loDvFunc = document.getElementById("divFuncCRF");
  var loUlFunc = document.getElementById("uulFuncCRF");
  var loDvLoad = document.getElementById("divLoadCRF");

  gmWkRsqlCRF = [];
  gnInListCRF = 0;

  loDvFunc.onscroll = function () {};

  loUlFunc.innerHTML = "";

  loDvLoad.style.display = "none";
}

function CadtRlFunc() {
  var loDtDat0 = document.getElementById("datDataDCH");
  var loDvTitu = document.getElementById("divTituCRF"),
    loDvLeft = document.getElementById("divLeftCRF"),
    loDvRght = document.getElementById("divRghtCRF"),
    loLiData = document.getElementById("lliDataCRF"),
    loDtData = document.getElementById("datDataCRF"),
    // loSlObra = document.getElementById("sltObraCRF"),
    loLiQtde = document.getElementById("lliQtdeCRF"),
    loSlPesq = document.getElementById("sltPesqCRF");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  goCdClieCRF = {};
  gnPqEqtoCRF = null;

  loDtData.valueAsDate = ldDtHoje;

  limpaCamposCRF();

  try {
    goCdClieCRF = JSON.parse(sessionStorage.getItem("soCdClie"));

    if (parseInt(goCdClieCRF.id_cadt) >= 0) {
      sessionStorage.removeItem("soCdClie");

      gnPqEqtoCRF = 1;

      //prettier-ignore
      loDvLeft.innerHTML = 
        "<a href='#' class='back link icon-only'>" +
          "<i class='icon icon-back'></i>" +
        "</a>";
      loDvRght.innerHTML = "";

      loDvTitu.innerHTML = "recursos";

      loLiData.style.display = "";

      if (loDtDat0) {
        loDtData.value = loDtDat0.value;
      }

      // loSlObra.disabled = true;

      loLiQtde.style.display = "";

      loSlPesq[1].innerHTML = "MATRÍCULA OU CÓD. EQUIPAMENTO";
    }
  } catch (error) {}

  pesquisaObrasDefinidasCRF();
  pesquisaTiposCRF();
  pesquisaFuncoesCRF();

  OkTecladoAndroid("txtPesqCRF");
}
