var gmWkRsqlPTC = [];
var gnInListPTC = 0;
var goPaPesqPTC = {};

function pesquisaSituacoesCadastroPTC(lnPdSitu) {
  var loSlSitu = document.getElementById("sltSituPTC");
  var lcSlRsql = "<option value='0'>TODAS AS SITUAÇÕES</option>",
    lcWkIsql = "",
    lcSlSlct = "";
  var lmWkIsql = [];

  loSlSitu.innerHTML = "<option value='0'>CARREGANDO SITUAÇÕES...</option>";

  lmWkIsql = [{ pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr }];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaSituacoesCadastro",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          if (lnPdSitu == parseInt(lmWkRsql[i].id_situ)) {
            lcSlSlct = " selected";
          } else {
            lcSlSlct = "";
          }

          //prettier-ignore
          lcSlRsql += "<option value='" + lmWkRsql[i].id_situ.toString() + "'" + lcSlSlct + ">" + lmWkRsql[i].st_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlSitu.innerHTML = lcSlRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlSitu.innerHTML = lcSlRsql;
    },
  });
}

function consultaPTC(lcWkRsql) {
  var loPgAnte = document.getElementsByClassName("page-previous");
  var lcPgAnte = loPgAnte[loPgAnte.length - 1].getAttribute("data-name");
  var loWkRsql = JSON.parse(unescape(lcWkRsql));

  loWkRsql["id_parm"] = goPaPesqPTC.id_parm;

  window["consulta" + lcPgAnte[0] + lcPgAnte[4] + lcPgAnte[6]](loWkRsql);

  goMnView.router.back();
}

function montaGridPTC() {
  var loDvLoad = document.getElementById("divLoadPTC");
  var lcWkRsql = "",
    lcOsTipo = "";
  var lnFnList = 0;

  if (gnInListPTC + 20 >= gmWkRsqlPTC.length) {
    app.infiniteScroll.destroy($$("#divPesqPTC"));
    loDvLoad.style.display = "none";
    lnFnList = gmWkRsqlPTC.length;
  } else {
    loDvLoad.style.display = "";
    lnFnList = gnInListPTC + 20;
  }

  for (var i = gnInListPTC; i < lnFnList; i++) {
    if (goPaPesqPTC.id_parm == "av_matr") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].id_matr.toString().trim() + "</b></div>" +
                "<div class='item-after'><b>" + gmWkRsqlPTC[i].cb_tmdo.trim().toUpperCase() + "</b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].fu_nome.trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].fu_func.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "dr_func") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].id_matr.toString().trim() + "</b></div>" +
                "<div class='item-after'><b>" + gmWkRsqlPTC[i].cb_tmdo.trim().toUpperCase() + "</b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].fu_nome.trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].fu_func.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_user") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].id_user.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b>" + gmWkRsqlPTC[i].id_oper.toString().trim() + "</b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].us_mail.toString().trim().toLowerCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].us_nome.toString().trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_clie") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].id_cida.trim().toUpperCase() + "/" + gmWkRsqlPTC[i].id_esta.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b>" + gmWkRsqlPTC[i].id_clie.toString().trim() + "</b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].cl_fant.trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].cl_nome.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_dmat") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].dm_unid.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b></b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].id_dmat.toString().trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].dm_deno.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_matr") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + formataCpf(gmWkRsqlPTC[i].fu_ncpf) + "</b></div>" +
                "<div class='item-after'><b>" + gmWkRsqlPTC[i].id_matr.toString().trim() + "</b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].fu_nome.trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].id_cida.trim().toUpperCase() + "/" + gmWkRsqlPTC[i].id_esta.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_ords") {
      if (parseInt(gmWkRsqlPTC[i].os_tipo) == 1) {
        lcOsTipo = "EMPREITA";
      } else if (parseInt(gmWkRsqlPTC[i].os_tipo) == 2) {
        lcOsTipo = "HORA HOMEM";
      } else if (parseInt(gmWkRsqlPTC[i].os_tipo) == 3) {
        lcOsTipo = "LOCAÇÃO";
      } else if (parseInt(gmWkRsqlPTC[i].os_tipo) == 4) {
        lcOsTipo = "PRODUTO";
      } else {
        lcOsTipo = "";
      }

      //prettier-ignore
      lcWkRsql +=
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            "<div class='item-media' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
              "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
            "</div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + gmWkRsqlPTC[i].os_desc.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRsqlPTC[i].os_nume.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número da ordem de serviço</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_nume.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>tipo</div>" +
                      "<div class='item-after'>" + lcOsTipo + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>responsável</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_resp.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número da proposta</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].oc_nume.trim().toUpperCase() + "/" + gmWkRsqlPTC[i].id_revs.toString() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número do pedido do cliente</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_ncli.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número do contrato</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_ncon.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li class='item-content item-input'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title item-label'>descrição</div>" +
                    "<div class='item-input-wrap'>" +
                      "<textarea readonly>" + gmWkRsqlPTC[i].os_desc.trim().toUpperCase() + "</textarea>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_prod") {
      //prettier-ignore
      lcWkRsql += 
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].id_prod.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b></b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b></b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].dp_desc.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_prop") {
      if (parseInt(gmWkRsqlPTC[i].os_tipo) == 1) {
        lcOsTipo = "EMPREITA";
      } else if (parseInt(gmWkRsqlPTC[i].os_tipo) == 2) {
        lcOsTipo = "HORA HOMEM";
      } else if (parseInt(gmWkRsqlPTC[i].os_tipo) == 3) {
        lcOsTipo = "LOCAÇÃO";
      } else if (parseInt(gmWkRsqlPTC[i].os_tipo) == 4) {
        lcOsTipo = "PRODUTO";
      } else {
        lcOsTipo = "";
      }

      //prettier-ignore
      lcWkRsql +=
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            "<div class='item-media' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
              "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
            "</div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + gmWkRsqlPTC[i].os_desc.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRsqlPTC[i].os_nume.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número da ordem de serviço</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_nume.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>tipo</div>" +
                      "<div class='item-after'>" + lcOsTipo + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>responsável</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_resp.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número da proposta</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].oc_nume.trim().toUpperCase() + "/" + gmWkRsqlPTC[i].id_revs.toString() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número do pedido do cliente</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_ncli.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número do contrato</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_ncon.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li class='item-content item-input'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title item-label'>descrição</div>" +
                    "<div class='item-input-wrap'>" +
                      "<textarea readonly>" + gmWkRsqlPTC[i].os_desc.trim().toUpperCase() + "</textarea>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "dp_deno") {
      //prettier-ignore
      lcWkRsql += 
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].id_prod.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b></b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b></b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].dp_deno.trim().toUpperCase() + " " + gmWkRsqlPTC[i].dp_espt.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_vend") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].id_cida.trim().toUpperCase() + "/" + gmWkRsqlPTC[i].id_esta.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b>" + gmWkRsqlPTC[i].id_vend.toString().trim() + "</b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].vd_fant.trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].vd_nome.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "id_tran") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + formataCnpj(gmWkRsqlPTC[i].tr_cnpj.trim().toUpperCase()) + "</b></div>" +
                "<div class='item-after'><b>" + gmWkRsqlPTC[i].id_tran.toString().trim() + "</b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].tr_fant.trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].tr_nome.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "ce_codi") {
      //prettier-ignore
      lcWkRsql +=
        "<li>" +
          "<a href='#' class='item-link item-content' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
            "<div class='item-inner'>" +
              "<div class='item-title-row'>" +
                "<div class='item-title'><b>" + gmWkRsqlPTC[i].ce_unes.trim().toUpperCase() + "</b></div>" +
                "<div class='item-after'><b></b></div>" + 
              "</div>" +
              "<div class='item-subtitle'><b>" + gmWkRsqlPTC[i].ce_codi.toString().trim().toUpperCase() + "</b></div>" +
              "<div class='item-text'><b>" + gmWkRsqlPTC[i].ce_deno.trim().toUpperCase() + " " + gmWkRsqlPTC[i].ce_espt.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "os_nume") {
      //prettier-ignore
      lcWkRsql +=
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            "<div class='item-media' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
              "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
            "</div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + gmWkRsqlPTC[i].cl_nome.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRsqlPTC[i].os_nume.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número o.s.</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].os_nume.toString().trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>data</div>" +
                      "<div class='item-after'>" + jsonDate(gmWkRsqlPTC[i].os_data.trim().toUpperCase()) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>cliente</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].cl_nome.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>previsão de término</div>" +
                      "<div class='item-after'>" + jsonDate(gmWkRsqlPTC[i].os_dfim.trim().toUpperCase()) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li class='item-content item-input'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title item-label'>descrição</div>" +
                    "<div class='item-input-wrap'>" +
                      "<textarea readonly>" + gmWkRsqlPTC[i].os_desc.trim().toUpperCase() + "</textarea>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    } else if (goPaPesqPTC.id_parm == "tl_ende") {
      //prettier-ignore
      lcWkRsql +=
        "<li class='accordion-item'>" +
          "<a href='#' class='item-content item-link'>" +
            "<div class='item-media' onclick='consultaPTC(\"" + escape(JSON.stringify(gmWkRsqlPTC[i])) + "\");'>" +
              "<i class='material-icons' style='color: " + corTema() + "'>info</i>" +
            "</div>" +
            "<div class='item-inner'>" +
              "<div class='item-title'><b>" + gmWkRsqlPTC[i].tl_ende.trim().toUpperCase() + "</b></div>" +
              "<div class='item-after'><b>" + gmWkRsqlPTC[i].tl_nume.trim().toUpperCase() + "</b></div>" +
            "</div>" +
          "</a>" +
          "<div class='accordion-item-content'>" +
            "<div class='list'>" +
              "<ul>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>endereço</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].tl_ende.toString().trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>número</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].tl_nume.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>bairro</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].tl_bair.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>complemento</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].tl_cmpl.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>cidade</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].id_cida.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>estado</div>" +
                      "<div class='item-after'>" + gmWkRsqlPTC[i].id_esta.trim().toUpperCase() + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
                "<li>" +
                  "<div class='item-content'>" +
                    "<div class='item-inner'>" +
                      "<div class='item-title'>cep</div>" +
                      "<div class='item-after'>" + formataCep(gmWkRsqlPTC[i].tl_ncep) + "</div>" +
                    "</div>" +
                  "</div>" +
                "</li>" +
              "</ul>" +
            "</div>" +
          "</div>" +
        "</li>";
    }
  }

  $("#uulPesqPTC").append(lcWkRsql);

  gnInListPTC = i;
}

function pesquisaPTC() {
  var loLiSitu = document.getElementById("lliSituPTC");
  var loSlSitu = document.getElementById("sltSituPTC");
  var loNrClie = document.getElementById("nroClieVPL");
  var loSlPesq = document.getElementById("sltPesqPTC");
  var loTxPesq = document.getElementById("txtPesqPTC");
  var loDvList = document.getElementById("divListPTC");
  var lcSlPesq = loSlPesq.value.toString().trim();
  var lcTxPesq = loTxPesq.value.toString().trim().toUpperCase();
  var lcUsNome = null,
    lcUsMail = null,
    lcIdUser = null,
    lcClNome = null,
    lcClFant = null,
    lcClNcpf = null,
    lcClCnpj = null,
    lcDmDeno = null,
    lcIdProd = null,
    lcDpDesc = null,
    lcDpDeno = null,
    lcIdCida = null,
    lcOsNume = null,
    lcOsDesc = null,
    lcFuNome = null,
    lcFuNcpf = null,
    lcClFone = null,
    lcVdNome = null,
    lcVdFant = null,
    lcVdNcpf = null,
    lcVdCnpj = null,
    lcCeCodi = null,
    lcCeDeno = null,
    lcTrNome = null,
    lcTrFant = null,
    lcTrCnpj = null,
    lcOsResp = null,
    lcOsNcli = null,
    lcOsNcon = null,
    lcAvDtde = null,
    lcAvDtat = null,
    lcTlEnde = null,
    lcTlNume = null,
    lcTlBair = null,
    lcTlCmpl = null,
    lcIdEsta = null,
    lcTlNcep = null,
    lcDrData = null,
    lcWkIsql = "",
    lcWkProc = "";
  var lmWkIsql = [];
  var lnIdClie = null,
    lnIdDmat = null,
    lnIdMatr = null,
    lnIdVend = null,
    lnIdTran = null,
    lnIdSitu = null,
    lnIdCadt = 0,
    lnIdOrds = 0;

  if (goPaPesqPTC.id_parm == "av_matr") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_matr") {
      try {
        if (parseInt(lcTxPesq) > 0) {
          lnIdMatr = parseInt(lcTxPesq);
        } else {
          alerta("matrícula do funcionário inválida", "alerta");

          limpaCamposPTC();

          return;
        }
      } catch (error) {
        alerta("matrícula do funcionário inválida", "erro");

        limpaCamposPTC();

        return;
      }
    } else if (lcSlPesq == "fu_nome") {
      lcFuNome = lcTxPesq;
    }

    try {
      if (goPaPesqPTC.av_dtde.trim().length > 0) {
        lcAvDtde = goPaPesqPTC.av_dtde.trim();
      }
    } catch (error) {}

    try {
      if (goPaPesqPTC.av_dtat.trim().length > 0) {
        lcAvDtat = goPaPesqPTC.av_dtat.trim();
      }
    } catch (error) {}

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "ldAvDtde", pa_tipo: "SmallDatetime", pa_valo: lcAvDtde },
      { pa_nome: "ldAvDtat", pa_tipo: "SmallDatetime", pa_valo: lcAvDtat },
      { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
      { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome }
    ];

    lcWkProc = "pesquisaFuncionariosAvaliados";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "dr_func") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_matr") {
      try {
        if (parseInt(lcTxPesq) > 0) {
          lnIdMatr = parseInt(lcTxPesq);
        } else {
          alerta("matrícula do funcionário inválida", "alerta");

          limpaCamposPTC();

          return;
        }
      } catch (error) {
        alerta("matrícula do funcionário inválida", "erro");

        limpaCamposPTC();

        return;
      }
    } else if (lcSlPesq == "fu_nome") {
      lcFuNome = lcTxPesq;
    }

    try {
      if (goPaPesqPTC.dr_data.trim().length > 0) {
        lcDrData = goPaPesqPTC.dr_data.trim();
      }
    } catch (error) {}

    try {
      if (parseInt(goPaPesqPTC.id_cadt) > 0) {
        lnIdCadt = parseInt(goPaPesqPTC.id_cadt);
      }
    } catch (error) {}

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "ldDrData", pa_tipo: "SmallDatetime", pa_valo: lcDrData },
      { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
      { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
      { pa_nome: "lcFuEmpr", pa_tipo: "VarChar", pa_valo: null },
      { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome }
    ];

    lcWkProc = "pesquisaFuncionarios";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "id_user") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_user") {
      lcIdUser = lcTxPesq;
    } else if (lcSlPesq == "us_nome") {
      lcUsNome = lcTxPesq;
    } else if (lcSlPesq == "us_mail") {
      lcUsMail = lcTxPesq.toLowerCase();
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser },
      { pa_nome: "lcUsNome", pa_tipo: "VarChar", pa_valo: lcUsNome },
      { pa_nome: "lcUsMail", pa_tipo: "VarChar", pa_valo: lcUsMail }
    ];

    lcWkProc = "pesquisaUsuarios";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "id_clie") {
    lcIdUser = goCdUser.id_user.trim().toUpperCase();

    try {
      if ("id_user" in goPaPesqPTC) {
        lcIdUser = goPaPesqPTC.id_user;
      }
    } catch (error) {}

    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_clie") {
      try {
        if (parseInt(lcTxPesq) > 0) {
          lnIdClie = parseInt(lcTxPesq);
        } else {
          alerta("código do cliente inválido", "alerta");

          limpaCamposPTC();

          return;
        }
      } catch (error) {
        alerta("código do cliente inválido", "alerta");

        limpaCamposPTC();

        return;
      }
    } else if (lcSlPesq == "id_cida") {
      lcIdCida = lcTxPesq;
    } else if (lcSlPesq == "cl_nome") {
      lcClNome = lcTxPesq;
    } else if (lcSlPesq == "cl_fant") {
      lcClFant = lcTxPesq;
    } else if (lcSlPesq == "cl_ncpf") {
      lcClNcpf = lcTxPesq.replace(/[^\d]+/g, "");
    } else if (lcSlPesq == "cl_cnpj") {
      lcClCnpj = lcTxPesq.replace(/[^\d]+/g, "");
    } else if (lcSlPesq == "cl_fone") {
      lcClFone = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
      { pa_nome: "lcClNome", pa_tipo: "VarChar", pa_valo: lcClNome },
      { pa_nome: "lcClFant", pa_tipo: "VarChar", pa_valo: lcClFant },
      { pa_nome: "lcClNcpf", pa_tipo: "VarChar", pa_valo: lcClNcpf },
      { pa_nome: "lcClCnpj", pa_tipo: "VarChar", pa_valo: lcClCnpj },
      { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: lcIdUser },
      { pa_nome: "lcIdCida", pa_tipo: "VarChar", pa_valo: lcIdCida },
      { pa_nome: "lcClFone", pa_tipo: "VarChar", pa_valo: lcClFone }
    ];

    if (loLiSitu.style.display.trim().length == 0) {
      try {
        if (parseInt(loSlSitu.value) > 0) {
          lnIdSitu = parseInt(loSlSitu.value);
        }
      } catch (error) {}

      lmWkIsql.push({
        pa_nome: "lnIdSitu",
        pa_tipo: "Int",
        pa_valo: lnIdSitu,
      });
    }

    lcWkProc = "pesquisaClientes";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "id_dmat") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_dmat") {
      try {
        if (parseInt(lcTxPesq) > 0) {
          lnIdDmat = parseInt(lcTxPesq);
        } else {
          alerta("código do material inválido", "alerta");

          limpaCamposPTC();

          return;
        }
      } catch (error) {
        alerta("código do material inválido", "alerta");

        limpaCamposPTC();

        return;
      }
    } else if (lcSlPesq == "dm_deno") {
      lcDmDeno = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdDmat", pa_tipo: "Int", pa_valo: lnIdDmat },
      { pa_nome: "lcDmDeno", pa_tipo: "VarChar", pa_valo: lcDmDeno }
    ];

    lcWkProc = "pesquisaMateriais";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "id_matr") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_matr") {
      try {
        if (parseInt(lcTxPesq) > 0) {
          lnIdMatr = parseInt(lcTxPesq);
        } else {
          alerta("matrícula do funcionário inválida", "alerta");

          limpaCamposPTC();

          return;
        }
      } catch (error) {
        alerta("matrícula do funcionário inválida", "erro");

        limpaCamposPTC();

        return;
      }
    } else if (lcSlPesq == "fu_nome") {
      lcFuNome = lcTxPesq;
    } else if (lcSlPesq == "id_cida") {
      lcIdCida = lcTxPesq;
    } else if (lcSlPesq == "fu_ncpf") {
      lcFuNcpf = lcTxPesq.replace(/[^\d]+/g, "");
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
      { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome },
      { pa_nome: "lcIdCida", pa_tipo: "VarChar", pa_valo: lcIdCida },
      { pa_nome: "lcFuNcpf", pa_tipo: "VarChar", pa_valo: lcFuNcpf }
    ];

    lcWkProc = "pesquisaFuncionarios";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "id_ords") {
    try {
      if (parseInt(goPaPesqPTC.id_cadt) > 0) {
        lnIdCadt = parseInt(goPaPesqPTC.id_cadt);
      }
    } catch (error) {}

    if (lnIdCadt == 0) {
      goMnView.router.back();

      return;
    }

    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "os_nume") {
      lcOsNume = lcTxPesq;
    } else if (lcSlPesq == "os_resp") {
      lcOsResp = lcTxPesq;
    } else if (lcSlPesq == "os_desc") {
      lcOsDesc = lcTxPesq;
    } else if (lcSlPesq == "os_ncli") {
      lcOsNcli = lcTxPesq;
    } else if (lcSlPesq == "os_ncon") {
      lcOsNcon = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
      { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: lcOsNume },
      { pa_nome: "lcOsResp", pa_tipo: "VarChar", pa_valo: lcOsResp },
      { pa_nome: "lcOsDesc", pa_tipo: "VarChar", pa_valo: lcOsDesc },
      { pa_nome: "lcOsNcli", pa_tipo: "VarChar", pa_valo: lcOsNcli },
      { pa_nome: "lcOsNcon", pa_tipo: "VarChar", pa_valo: lcOsNcon }
    ];

    lcWkProc = "pesquisaOrdensServico";

    loDvList.className = "list accordion-list";
  } else if (goPaPesqPTC.id_parm == "id_prod") {
    try {
      if (parseInt(loNrClie.value) > 0) {
        lnIdClie = parseInt(loNrClie.value);
      } else {
        alerta("consulta um cliente utilizando a lupinha", "alerta");

        goMnView.router.back();

        return;
      }
    } catch (error) {
      alerta("consulta um cliente utilizando a lupinha", "erro");

      goMnView.router.back();

      return;
    }

    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_prod") {
      lcIdProd = lcTxPesq;
    } else if (lcSlPesq == "dp_desc") {
      lcDpDesc = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
      { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
      { pa_nome: "lcIdProd", pa_tipo: "VarChar", pa_valo: lcIdProd },
      { pa_nome: "lcDpDesc", pa_tipo: "VarChar", pa_valo: lcDpDesc }
    ];

    lcWkProc = "pesquisaProdutosApp";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "id_prop") {
    try {
      if (parseInt(goPaPesqPTC.id_cadt) > 0) {
        lnIdCadt = parseInt(goPaPesqPTC.id_cadt);
      }
    } catch (error) {}

    if (lnIdCadt == 0) {
      goMnView.router.back();

      return;
    }

    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "os_nume") {
      lcOsNume = lcTxPesq;
    } else if (lcSlPesq == "os_resp") {
      lcOsResp = lcTxPesq;
    } else if (lcSlPesq == "os_desc") {
      lcOsDesc = lcTxPesq;
    } else if (lcSlPesq == "os_ncli") {
      lcOsNcli = lcTxPesq;
    } else if (lcSlPesq == "os_ncon") {
      lcOsNcon = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
      { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: lcOsNume },
      { pa_nome: "lcOsResp", pa_tipo: "VarChar", pa_valo: lcOsResp },
      { pa_nome: "lcOsDesc", pa_tipo: "VarChar", pa_valo: lcOsDesc },
      { pa_nome: "lcOsNcli", pa_tipo: "VarChar", pa_valo: lcOsNcli },
      { pa_nome: "lcOsNcon", pa_tipo: "VarChar", pa_valo: lcOsNcon }
    ];

    lcWkProc = "pesquisaPropostas";

    loDvList.className = "list accordion-list";
  } else if (goPaPesqPTC.id_parm == "id_tran") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_tran") {
      try {
        if (parseInt(lcTxPesq) > 0) {
          lnIdTran = parseInt(lcTxPesq);
        } else {
          alerta("código da transportadora inválido", "alerta");

          limpaCamposPTC();

          return;
        }
      } catch (error) {
        alerta("código da transportadora inválido", "erro");

        limpaCamposPTC();

        return;
      }
    } else if (lcSlPesq == "tr_nome") {
      lcTrNome = lcTxPesq;
    } else if (lcSlPesq == "tr_fant") {
      lcTrFant = lcTxPesq;
    } else if (lcSlPesq == "tr_cnpj") {
      lcTrCnpj = lcTxPesq.replace(/[^\d]+/g, "");
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdTran", pa_tipo: "Int", pa_valo: lnIdTran },
      { pa_nome: "lcTrNome", pa_tipo: "VarChar", pa_valo: lcTrNome },
      { pa_nome: "lcTrFant", pa_tipo: "VarChar", pa_valo: lcTrFant },
      { pa_nome: "lcTrCnpj", pa_tipo: "VarChar", pa_valo: lcTrCnpj }
    ];

    lcWkProc = "pesquisaTransportadoras";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "id_vend") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_vend") {
      try {
        if (parseInt(lcTxPesq) > 0) {
          lnIdVend = parseInt(lcTxPesq);
        } else {
          alerta("código do vendedor inválido", "alerta");

          limpaCamposPTC();

          return;
        }
      } catch (error) {
        alerta("código do vendedor inválido", "alerta");

        limpaCamposPTC();

        return;
      }
    } else if (lcSlPesq == "id_cida") {
      lcIdCida = lcTxPesq;
    } else if (lcSlPesq == "vd_nome") {
      lcVdNome = lcTxPesq;
    } else if (lcSlPesq == "vd_fant") {
      lcVdFant = lcTxPesq;
    } else if (lcSlPesq == "vd_ncpf") {
      lcVdNcpf = lcTxPesq.replace(/[^\d]+/g, "");
    } else if (lcSlPesq == "vd_cnpj") {
      lcVdCnpj = lcTxPesq.replace(/[^\d]+/g, "");
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
      { pa_nome: "lnIdVend", pa_tipo: "Int", pa_valo: lnIdVend },
      { pa_nome: "lcVdNome", pa_tipo: "VarChar", pa_valo: lcVdNome },
      { pa_nome: "lcVdFant", pa_tipo: "VarChar", pa_valo: lcVdFant },
      { pa_nome: "lcVdNcpf", pa_tipo: "VarChar", pa_valo: lcVdNcpf },
      { pa_nome: "lcVdCnpj", pa_tipo: "VarChar", pa_valo: lcVdCnpj },
      { pa_nome: "lcIdCida", pa_tipo: "VarChar", pa_valo: lcIdCida }
    ];

    lcWkProc = "pesquisaVendedores";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "ce_codi") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "ce_codi") {
      lcCeCodi = lcTxPesq;
    } else if (lcSlPesq == "ce_deno") {
      lcCeDeno = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lcCeCodi", pa_tipo: "VarChar", pa_valo: lcCeCodi },
      { pa_nome: "lcCeDeno", pa_tipo: "VarChar", pa_valo: lcCeDeno }
    ];

    lcWkProc = "pesquisaEstoque";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "dp_deno") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "id_prod") {
      lcIdProd = lcTxPesq;
    } else if (lcSlPesq == "dp_deno") {
      lcDpDeno = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lcIdProd", pa_tipo: "VarChar", pa_valo: lcIdProd },
      { pa_nome: "lcDpDeno", pa_tipo: "VarChar", pa_valo: lcDpDeno }
    ];

    lcWkProc = "pesquisaProdutos";

    loDvList.className = "list media-list";
  } else if (goPaPesqPTC.id_parm == "os_nume") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "os_nume") {
      lcOsNume = lcTxPesq;
    } else if (lcSlPesq == "cl_nome") {
      lcClNome = lcTxPesq;
    } else if (lcSlPesq == "os_desc") {
      lcOsDesc = lcTxPesq;
    }

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: lcOsNume },
      { pa_nome: "lcClNome", pa_tipo: "VarChar", pa_valo: lcClNome },
      { pa_nome: "lcOsDesc", pa_tipo: "VarChar", pa_valo: lcOsDesc },
      { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() }
    ];

    lcWkProc = "pesquisaOrdensServico";

    loDvList.className = "list accordion-list";
  } else if (goPaPesqPTC.id_parm == "tl_ende") {
    if (lcTxPesq.length == 0) {
    } else if (lcSlPesq == "tl_ende") {
      lcTlEnde = lcTxPesq;
    } else if (lcSlPesq == "tl_nume") {
      lcTlNume = lcTxPesq;
    } else if (lcSlPesq == "tl_bair") {
      lcTlBair = lcTxPesq;
    } else if (lcSlPesq == "tl_cmpl") {
      lcTlCmpl = lcTxPesq;
    } else if (lcSlPesq == "id_cida") {
      lcIdCida = lcTxPesq;
    } else if (lcSlPesq == "id_esta") {
      lcIdEsta = lcTxPesq;
    } else if (lcSlPesq == "tl_ncep") {
      lcTlNcep = lcTxPesq.replace(/[^\d]+/g, "");
    }

    try {
      if (parseInt(goPaPesqPTC.id_ords) > 0) {
        lnIdOrds = parseInt(goPaPesqPTC.id_ords);
      }
    } catch (error) {}

    //prettier-ignore
    lmWkIsql = [
      { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
      { pa_nome: "lnIdOrds", pa_tipo: "Int", pa_valo: lnIdOrds },
      { pa_nome: "lcTlEnde", pa_tipo: "VarChar", pa_valo: lcTlEnde },
      { pa_nome: "lcTlBair", pa_tipo: "VarChar", pa_valo: lcTlBair },
      { pa_nome: "lcTlCmpl", pa_tipo: "VarChar", pa_valo: lcTlCmpl },
      { pa_nome: "lcIdCida", pa_tipo: "VarChar", pa_valo: lcIdCida },
      { pa_nome: "lcIdEsta", pa_tipo: "VarChar", pa_valo: lcIdEsta },
      { pa_nome: "lcTlNcep", pa_tipo: "VarChar", pa_valo: lcTlNcep }
    ];

    lcWkProc = "pesquisaEnderecos";

    loDvList.className = "list accordion-list";
  } else {
    alerta("nenhum parâmetro de pesquisa passado", "alerta");

    goMnView.router.back();

    return;
  }

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposPTC();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=" +
      lcWkProc,
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          gmWkRsqlPTC = lmWkRsql;

          app.infiniteScroll.create($$("#divPesqPTC"));

          montaGridPTC();

          $$("#divPesqPTC").on("infinite", function () {
            montaGridPTC();
          });
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {
      alerta(
        "não foi possível fazer a pesquisa, verifique sua conexão com a internet",
        "erro"
      );
    },
  });
}

function limpaCamposPTC() {
  var loDvLoad = document.getElementById("divLoadPTC");
  var loUlPesq = document.getElementById("uulPesqPTC");

  gmWkRsqlPTC = [];

  gnInListPTC = 0;

  loUlPesq.innerHTML = "";

  loDvLoad.style.display = "none";
}

function PesqTbCadt() {
  var loDvTitu = document.getElementById("divTituPTC");
  var loLiSitu = document.getElementById("lliSituPTC");
  var loSlSitu = document.getElementById("sltSituPTC");
  var loSlPesq = document.getElementById("sltPesqPTC");
  var llPaPesq = false,
    llPaSitu = false,
    llTrSitu = false;
  var lnPdSitu = 0;

  limpaCamposPTC();

  app.dialog.preloader("carregando...");

  setTimeout(function () {
    try {
      goPaPesqPTC = JSON.parse(sessionStorage.getItem("soPaPesq"));

      if (goPaPesqPTC.id_parm.toString().trim().length > 0) {
        sessionStorage.removeItem("soPaPesq");

        loDvTitu.innerHTML = goPaPesqPTC.pa_titu;

        try {
          llPaSitu = goPaPesqPTC.pa_situ;
        } catch (error) {}

        if (llPaSitu) {
          loLiSitu.style.display = "";

          try {
            if (goPaPesqPTC.tr_situ) {
              llTrSitu = goPaPesqPTC.tr_situ;
            }
          } catch (error) {}

          loSlSitu.disabled = llTrSitu;

          try {
            if (parseInt(goPaPesqPTC.pd_situ) > 0) {
              lnPdSitu = parseInt(goPaPesqPTC.pd_situ);
            }
          } catch (error) {}

          pesquisaSituacoesCadastroPTC(lnPdSitu);
        }

        loSlPesq.innerHTML = goPaPesqPTC.pa_slct;

        try {
          llPaPesq = goPaPesqPTC.pa_pesq;
        } catch (error) {}

        if (llPaPesq) {
          pesquisaPTC();
        }
      }
    } catch (loApErro) {}

    app.dialog.close();
  }, 500);

  OkTecladoAndroid3("txtPesqPTC", "btnPesqPTC", "btnPesqPTC");
}
