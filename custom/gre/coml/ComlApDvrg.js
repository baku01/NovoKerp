var gnInListCAD = 0;
var gmApDvrgCAD = [],
  gmApFuncCAD = [],
  gmApSecuCAD = [];

function pdfCAD(lnRdVisu) {
  var lcApHtml = "",
    lcShTitu = "arquivo pdf referente as divergências de apontamentos da real",
    lcShSbti = "divergências de apontamentos da real",
    lcFlName = "divergencias_apontamentos_real";
  var lnApMnap = 0,
    lnApMnse = 0;

  if (gmApDvrgCAD.length == 0) {
    alerta("relatório sem conteúdo", "alerta");

    return;
  }

  //prettier-ignore
  lcApHtml =
    "<html>" +
      "<style>" +
        "@media print {" +
          "body {" +
            "-webkit-print-color-adjust: exact;" +
          "}" +
        "}" +
        "@media print {" +
          ".pagebreak {" +
            "page-break-before: always;" +
          "}" +
        "}" +
        ".backgroundColor {" +
          "background-color: rgba(255, 0, 0, 0.25);" +
        "}" +
      "</style>" +
      "<body>" + 
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='text-align: center; font-size: XX-large;' colspan='3'>" +
              "DIVERGÊNCIAS DE APONTAMENTOS" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; width: 33%;'></td>" +
            "<td style='border: 1px solid black; text-align: center; width: 33%;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/gre.png' style='width: 150px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large; width: 33%;'></td>" +
          "</tr>" +
        "</table>" +
        "<br />";

  for (var i = 0; i < gmApDvrgCAD.length; i++) {
    //prettier-ignore
    lcApHtml +=
        "<br />" +
        "<table class='backgroundColor' style='border: 1px solid black; width: 100%; border-spacing: 0; border-collapse: collapse; background-color: rgba(255, 0, 0, 0.25);'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>data</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>empresa</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>matrícula</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>funcionário</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>aplicativo</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>facial</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>diferença</b>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              jsonDate(gmApDvrgCAD[i].ap_data) +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              gmApDvrgCAD[i].em_fant.trim().toUpperCase() +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              gmApDvrgCAD[i].id_matr.toString() +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              gmApDvrgCAD[i].fu_nome.trim().toUpperCase() +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              pad(parseInt(Math.floor(parseInt(gmApDvrgCAD[i].ap_mnap) / 60)), 2) + ":" + pad(parseInt(parseInt(gmApDvrgCAD[i].ap_mnap) % 60), 2) +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              pad(parseInt(Math.floor(parseInt(gmApDvrgCAD[i].ap_mnse) / 60)), 2) + ":" + pad(parseInt(parseInt(gmApDvrgCAD[i].ap_mnse) % 60), 2) +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              pad(parseInt(Math.floor(Math.abs(parseInt(gmApDvrgCAD[i].ap_mnse) - parseInt(gmApDvrgCAD[i].ap_mnap)) / 60)), 2) + ":" + pad(parseInt(Math.abs(parseInt(gmApDvrgCAD[i].ap_mnse) - parseInt(gmApDvrgCAD[i].ap_mnap)) % 60), 2) +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td colspan='7'>" +
              "<br />" +
              "<div style='width: 100%; text-align: center;'>" +
                "<b>apontamento(s) aplicativo</b>" +
              "</div>"+
              "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
                "<tr>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>obra</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>entrada</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>saída</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>entrada</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>saída</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>total</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>usuário alteração</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>data alteração</b>" +
                  "</td>" +
                "</tr>";

    for (var j = 0; j < gmApFuncCAD.length; j++) {
      lnApMnap = 0;

      if (
        gmApDvrgCAD[i].fu_empr.trim().toUpperCase() ==
          gmApFuncCAD[j].fu_empr.trim().toUpperCase() &&
        parseInt(gmApDvrgCAD[i].id_matr) == parseInt(gmApFuncCAD[j].id_matr) &&
        jsonDate(gmApDvrgCAD[i].ap_data) == jsonDate(gmApFuncCAD[j].ap_data)
      ) {
        lnApMnap += calculaMinutosCAD(
          stringDataParaObjetoData(jsonDate(gmApFuncCAD[j].ap_data)),
          pad(gmApFuncCAD[j].ap_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCAD[j].ap_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCAD[j].ap_hter.toFixed(2), 5).replace(".", ":")
        );

        //prettier-ignore
        lcApHtml += 
                "<tr>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    gmApFuncCAD[j].cl_fant.trim().toUpperCase() +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApFuncCAD[j].ap_hent.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApFuncCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApFuncCAD[j].ap_htin.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApFuncCAD[j].ap_hter.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(parseInt(Math.floor(parseInt(lnApMnap) / 60)), 2) + ":" + pad(parseInt(parseInt(lnApMnap) % 60), 2) +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    gmApFuncCAD[j].id_user.trim().toUpperCase() +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    jsonDate(gmApFuncCAD[j].af_dtid) +
                  "</td>" +
                "</tr>";
      }
    }

    //prettier-ignore
    lcApHtml +=
              "</table>" +
              "<br />" +
              "<div style='width: 100%; text-align: center;'>" +
                "<b>apontamento(s) facial</b>" +
              "</div>"+
              "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
                "<tr>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>obra</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>entrada</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>saída</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>entrada</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>saída</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>total</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>usuário alteração</b>" +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    "<b>data alteração</b>" +
                  "</td>" +
                "</tr>";

    for (var j = 0; j < gmApSecuCAD.length; j++) {
      lnApMnse = 0;

      if (
        gmApDvrgCAD[i].fu_empr.trim().toUpperCase() ==
          gmApSecuCAD[j].fu_empr.trim().toUpperCase() &&
        parseInt(gmApDvrgCAD[i].id_matr) == parseInt(gmApSecuCAD[j].id_matr) &&
        jsonDate(gmApDvrgCAD[i].ap_data) == jsonDate(gmApSecuCAD[j].ap_data)
      ) {
        lnApMnse += calculaMinutosCAD(
          stringDataParaObjetoData(jsonDate(gmApSecuCAD[j].ap_data)),
          pad(gmApSecuCAD[j].ap_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCAD[j].ap_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCAD[j].ap_hter.toFixed(2), 5).replace(".", ":")
        );

        //prettier-ignore
        lcApHtml += 
                "<tr>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    gmApSecuCAD[j].cl_fant.trim().toUpperCase() +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApSecuCAD[j].ap_hent.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApSecuCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApSecuCAD[j].ap_htin.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(gmApSecuCAD[j].ap_hter.toFixed(2), 5).replace(".", ":") +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    pad(parseInt(Math.floor(parseInt(lnApMnse) / 60)), 2) + ":" + pad(parseInt(parseInt(lnApMnse) % 60), 2) +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    gmApSecuCAD[j].id_user.trim().toUpperCase() +
                  "</td>" +
                  "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
                    jsonDate(gmApSecuCAD[j].af_dtid) +
                  "</td>" +
                "</tr>";
      }
    }

    //prettier-ignore
    lcApHtml +=
              "</table>" +
              "<br />"  +
              "</td>" +
            "</tr>" +
          "</table>" +
          "<br />";
  }

  //prettier-ignore
  lcApHtml +=
        "</body>" +
      "</html>";

  if (gcSiOper == "Android") {
    app.actions
      .create({
        grid: true,
        buttons: [
          {
            text: "visualizar",
            icon: "<i class='material-icons centraliza'>visibility</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcApHtml, {
                  documentSize: "A4",
                  type: "share",
                  fileName: lcFlName + ".pdf",
                })
                .then(function (lcPdStat) {
                  app.dialog.close();
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
          {
            text: "compartilhar",
            icon: "<i class='material-icons centraliza'>share</i>",
            onClick: function () {
              app.dialog.progress("gerando pdf");

              pdf
                .fromData(lcApHtml, { documentSize: "A4", type: "base64" })
                .then(function (lo64Base) {
                  base64ParaPdf(
                    lcFlName + ".pdf",
                    lo64Base,
                    "application/pdf",
                    lcShTitu,
                    lcShSbti
                  );
                })
                .catch((lcPdErro) => console.log(lcPdErro));
            },
          },
        ],
      })
      .open();
  } else if (gcSiOper == "iOS") {
    app.dialog.progress("gerando pdf");

    pdf
      .fromData(lcApHtml, {
        documentSize: "A4",
        type: "share",
        fileName: lcFlName + ".pdf",
      })
      .then(function (lcPdStat) {
        app.dialog.close();
      })
      .catch((lcPdErro) => console.log(lcPdErro));
  } else {
    if (lnRdVisu > 0) {
      visualizaImpressao(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        lcFlName,
        lcApHtml
      );
    } else {
      impressaoPdf(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        lcFlName,
        lcApHtml
      );
    }
  }
}

function atualizaApontamentosSecullumCAD(lcApApnt) {
  var loApApnt = JSON.parse(unescape(lcApApnt));

  sessionStorage.setItem("soApApnt", JSON.stringify(loApApnt));

  redireciona("custom/gre/coml/ComlEdSecu.html", "ComlEdSecu.html");
}

function montaDivergenciasApontamentosCAD(ldDtOnte, ldDtHoje) {
  var loDvDvrg = document.getElementById("divDvrgCAD");
  var loDvLoad = document.getElementById("divLoadCAD");
  var lcWkRsql = "",
    lcEdSecu = "";
  var lnFnList = 0,
    lnApMnap = 0,
    lnApMnse = 0;

  if (gnInListCAD + 20 >= gmApDvrgCAD.length) {
    loDvDvrg.onscroll = function () {};

    loDvLoad.style.display = "none";

    lnFnList = gmApDvrgCAD.length;
  } else {
    loDvLoad.style.display = "";

    lnFnList = gnInListCAD + 20;
  }

  //prettier-ignore
  for (var i = gnInListCAD; i < lnFnList; i++) {
    lcEdSecu = "";

    lcWkRsql +=
      "<li class='accordion-item'>" +
        "<a href='#' class='item-content item-link'>" +
          "<div class='item-inner'>" +
            "<div class='item-title'><b>" + gmApDvrgCAD[i].fu_nome.trim().toUpperCase() + "</b></div>" +
            "<div class='item-after'><b>" + jsonDate(gmApDvrgCAD[i].ap_data) + "</b></div>" +
          "</div>" +
        "</a>" +
        "<div class='accordion-item-content'>" +
          "<div class='list'>" +
            "<ul>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>data</div>" +
                    "<div class='item-after'>" + jsonDate(gmApDvrgCAD[i].ap_data) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>empresa</div>" +
                    "<div class='item-after'>" + gmApDvrgCAD[i].em_fant.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>matrícula</div>" +
                    "<div class='item-after'>" + gmApDvrgCAD[i].id_matr.toString() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>funcionário</div>" +
                    "<div class='item-after'>" + gmApDvrgCAD[i].fu_nome.trim().toUpperCase() + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>aplicativo</div>" +
                    "<div class='item-after'>" + pad(parseInt(Math.floor(parseInt(gmApDvrgCAD[i].ap_mnap) / 60)), 2) + ":" + pad(parseInt(parseInt(gmApDvrgCAD[i].ap_mnap) % 60), 2) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>facial</div>" +
                    "<div class='item-after'>" + pad(parseInt(Math.floor(parseInt(gmApDvrgCAD[i].ap_mnse) / 60)), 2) + ":" + pad(parseInt(parseInt(gmApDvrgCAD[i].ap_mnse) % 60), 2) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='item-content'>" +
                  "<div class='item-inner'>" +
                    "<div class='item-title'>diferença</div>" +
                    "<div class='item-after'>" + pad(parseInt(Math.floor(Math.abs(parseInt(gmApDvrgCAD[i].ap_mnse) - parseInt(gmApDvrgCAD[i].ap_mnap)) / 60)), 2) + ":" + pad(parseInt(Math.abs(parseInt(gmApDvrgCAD[i].ap_mnse) - parseInt(gmApDvrgCAD[i].ap_mnap)) % 60), 2) + "</div>" +
                  "</div>" +
                "</div>" +
              "</li>" +
              "<li>" +
                "<div class='block-title' style='text-align: center;'><b>apontamento(s) aplicativo</b></div>" +
                "<div class='block'>" +
                  "<div class='row no-gap'>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>entrada</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>saída</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>entrada</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>saída</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>total</b></span>" +
                    "</div>" +
                  "</div>";

    for (var j = 0; j < gmApFuncCAD.length; j++) {
      lnApMnap = 0;

      if (
        gmApDvrgCAD[i].fu_empr.trim().toUpperCase() ==
          gmApFuncCAD[j].fu_empr.trim().toUpperCase() &&
        parseInt(gmApDvrgCAD[i].id_matr) ==
          parseInt(gmApFuncCAD[j].id_matr) &&
        jsonDate(gmApDvrgCAD[i].ap_data) == jsonDate(gmApFuncCAD[j].ap_data)
      ) {
        lnApMnap += calculaMinutosCAD(
          stringDataParaObjetoData(jsonDate(gmApFuncCAD[j].ap_data)),
          pad(gmApFuncCAD[j].ap_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCAD[j].ap_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApFuncCAD[j].ap_hter.toFixed(2), 5).replace(".", ":")
        );

        lcWkRsql += 
                  "<div class='row no-gap'>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + gmApFuncCAD[j].cl_fant.trim().toUpperCase() + "</span>" +
                    "</div>" +
                  "</div>" +
                  "<div class='row no-gap'>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApFuncCAD[j].ap_hent.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApFuncCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApFuncCAD[j].ap_htin.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApFuncCAD[j].ap_hter.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(parseInt(Math.floor(parseInt(lnApMnap) / 60)), 2) + ":" + pad(parseInt(parseInt(lnApMnap) % 60), 2) + "</span>" +
                    "</div>" +
                  "</div>";
      }
    }

    if ((objetoDataParaStringSqlData(stringDataParaObjetoData(jsonDate(gmApDvrgCAD[i].ap_data))) == objetoDataParaStringSqlData(ldDtOnte) && 17 <= ldDtHoje.getHours()) || stringDataParaObjetoData(jsonDate(gmApDvrgCAD[i].ap_data)) < ldDtOnte) {
      lcEdSecu = "<div class='block-title item-link' style='text-align: center; color: " + corTema() + ";' onclick='atualizaApontamentosSecullumCAD(\"" + escape(JSON.stringify(gmApDvrgCAD[i])) + "\");'>editar</div>";
    }

    lcWkRsql +=
                "</div>" +
                lcEdSecu +
                "<div class='block-title' style='text-align: center;'><b>apontamento(s) facial</b></div>" +
                "<div class='block'>" +
                  "<div class='row no-gap'>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>entrada</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>saída</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>entrada</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>saída</b></span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span><b>total</b></span>" +
                    "</div>" +
                  "</div>";

    for (var j = 0; j < gmApSecuCAD.length; j++) {
      lnApMnse = 0;

      if (
        gmApDvrgCAD[i].fu_empr.trim().toUpperCase() ==
          gmApSecuCAD[j].fu_empr.trim().toUpperCase() &&
        parseInt(gmApDvrgCAD[i].id_matr) ==
          parseInt(gmApSecuCAD[j].id_matr) &&
        jsonDate(gmApDvrgCAD[i].ap_data) == jsonDate(gmApSecuCAD[j].ap_data)
      ) {
        lnApMnse += calculaMinutosCAD(
          stringDataParaObjetoData(jsonDate(gmApSecuCAD[j].ap_data)),
          pad(gmApSecuCAD[j].ap_hent.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCAD[j].ap_htin.toFixed(2), 5).replace(".", ":"),
          pad(gmApSecuCAD[j].ap_hter.toFixed(2), 5).replace(".", ":")
        );

        lcWkRsql += 
                  "<div class='row no-gap'>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + gmApSecuCAD[j].cl_fant.trim().toUpperCase() + "</span>" +
                    "</div>" +
                  "</div>" +
                  "<div class='row no-gap'>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApSecuCAD[j].ap_hent.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApSecuCAD[j].ap_hiin.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApSecuCAD[j].ap_htin.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(gmApSecuCAD[j].ap_hter.toFixed(2), 5).replace(".", ":") + "</span>" +
                    "</div>" +
                    "<div class='col borda' style='text-align: center;'>" +
                      "<span>" + pad(parseInt(Math.floor(parseInt(lnApMnse) / 60)), 2) + ":" + pad(parseInt(parseInt(lnApMnse) % 60), 2) + "</span>" +
                    "</div>" +
                  "</div>";
      }
    }
                
    lcWkRsql +=
                "</div>" +
                "<br />" +
              "</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
      "</li>";
  }

  gnInListCAD = i;

  $("#uulDvrgCAD").append(lcWkRsql);
}

function calculaMinutosCAD(ldApData, lcApHent, lcApHiin, lcApHtin, lcApHter) {
  var lnApJdms = 0,
    lnApJmms = 0,
    lnApJtms = 0;
  var ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [];

  try {
    if (lcApHent.trim().length > 0) {
      ldApHent = new Date(ldApData);

      lmHrHora = lcApHent.trim().split(":");

      ldApHent.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHiin.trim().length > 0) {
      ldApHiin = new Date(ldApData);

      lmHrHora = lcApHiin.trim().split(":");

      ldApHiin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHtin.trim().length > 0) {
      ldApHtin = new Date(ldApData);

      lmHrHora = lcApHtin.trim().split(":");

      ldApHtin.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  try {
    if (lcApHter.trim().length > 0) {
      ldApHter = new Date(ldApData);

      lmHrHora = lcApHter.trim().split(":");

      ldApHter.setHours(parseInt(lmHrHora[0]), parseInt(lmHrHora[1]));
    }
  } catch (error) {}

  if (ldApHent.getFullYear() > 1900 && ldApHiin.getFullYear() > 1900) {
    if (ldApHent <= ldApHiin) {
      lnApJmms = ldApHiin - ldApHent;
    } else {
      ldApHiin = ldApHiin.addDays(1);

      if (ldApHtin.getFullYear() > 1900) {
        ldApHtin = ldApHtin.addDays(1);
      }

      if (ldApHter.getFullYear() > 1900) {
        ldApHter = ldApHter.addDays(1);
      }

      lnApJmms = ldApHiin - ldApHent;
    }
  }

  if (
    ldApHiin.getFullYear() > 1900 &&
    ldApHtin.getFullYear() > 1900 &&
    ldApHiin > ldApHtin
  ) {
    ldApHtin = ldApHtin.addDays(1);

    if (ldApHter.getFullYear() > 1900) {
      ldApHter = ldApHter.addDays(1);
    }
  }

  if (ldApHtin.getFullYear() > 1900 && ldApHter.getFullYear() > 1900) {
    if (ldApHtin <= ldApHter) {
      lnApJtms = ldApHter - ldApHtin;
    } else {
      ldApHter = ldApHter.addDays(1);

      lnApJtms = ldApHter - ldApHtin;
    }
  }

  lnApJdms = lnApJmms + lnApJtms;

  return Math.floor(lnApJdms / (1000 * 60));
}

function pesquisaApontamentosAplicativoSecullumPeriodoCAD() {
  var loDvDvrg = document.getElementById("divDvrgCAD");
  var loDtDtde = document.getElementById("datDtdeCAD");
  var loDtDtat = document.getElementById("datDtatCAD");
  var loSlClie = document.getElementById("sltClieCAD");
  var loSlStrc = document.getElementById("sltStrcCAD");
  var loSlPesq = document.getElementById("sltPesqCAD");
  var loTxPesq = document.getElementById("txtPesqCAD");
  var loDvLoad = document.getElementById("divLoadCAD");
  var lnIdClie = null,
    lnIdMatr = null;
  var lcWkIsql = "",
    lcIdMatr = "",
    lcFuNome = null;
  var lmWkIsql = [],
    lmApFunc = [],
    lmApSecu = [],
    lmApDvrg = [];
  var lnApMnap = 0,
    lnApMnse = 0,
    lnIdStrc = parseInt(loSlStrc.value);
  var llApFunc = false,
    llIdStrc = false;
  var ldDtOnte = new Date(),
    ldDtHoje = new Date();

  ldDtOnte.setDate(ldDtOnte.getDate() - 1);

  ldDtOnte.setHours(0, 0, 0, 0);

  limpaCamposCAD();

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  if (loSlPesq.value.toString().trim().toUpperCase() == "ID_MATR") {
    lcIdMatr = loTxPesq.value.toString().replace(/[^\d]+/g, "");

    if (lcIdMatr.trim().length > 0) {
      lnIdMatr = parseInt(lcIdMatr);
    }
  } else {
    if (loTxPesq.value.toString().trim().length > 0) {
      lcFuNome = loTxPesq.value.toString().trim().toUpperCase();
    }
  }

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)), },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)), },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lnIdMatr", pa_tipo: "Int", pa_valo: lnIdMatr },
    { pa_nome: "lcFuNome", pa_tipo: "VarChar", pa_valo: lcFuNome },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loDvLoad.style.display = "";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaApontamentosAplicativoSecullumPeriodo",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvLoad.style.display = "none";

      try {
        if (lmWkRsql.length > 0) {
          for (var i = 0; i < lmWkRsql.length; i++) {
            if (lmWkRsql[i].ap_tipo.trim().toUpperCase() == "A") {
              lmApFunc.push(lmWkRsql[i]);
            }
          }

          for (var i = 0; i < lmWkRsql.length; i++) {
            if (lmWkRsql[i].ap_tipo.trim().toUpperCase() == "S") {
              lmApSecu.push(lmWkRsql[i]);
            }
          }

          for (var i = 0; i < lmWkRsql.length; i++) {
            lnApMnap = 0;
            lnApMnse = 0;
            llApFunc = false;

            for (var j = 0; j < lmApFunc.length; j++) {
              if (
                lmWkRsql[i].fu_empr.trim().toUpperCase() ==
                  lmApFunc[j].fu_empr.trim().toUpperCase() &&
                parseInt(lmWkRsql[i].id_matr) ==
                  parseInt(lmApFunc[j].id_matr) &&
                jsonDate(lmWkRsql[i].ap_data) == jsonDate(lmApFunc[j].ap_data)
              ) {
                lnApMnap += calculaMinutosCAD(
                  stringDataParaObjetoData(jsonDate(lmApFunc[j].ap_data)),
                  pad(lmApFunc[j].ap_hent.toFixed(2), 5).replace(".", ":"),
                  pad(lmApFunc[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
                  pad(lmApFunc[j].ap_htin.toFixed(2), 5).replace(".", ":"),
                  pad(lmApFunc[j].ap_hter.toFixed(2), 5).replace(".", ":")
                );
              }
            }

            for (var j = 0; j < lmApSecu.length; j++) {
              if (
                lmWkRsql[i].fu_empr.trim().toUpperCase() ==
                  lmApSecu[j].fu_empr.trim().toUpperCase() &&
                parseInt(lmWkRsql[i].id_matr) ==
                  parseInt(lmApSecu[j].id_matr) &&
                jsonDate(lmWkRsql[i].ap_data) == jsonDate(lmApSecu[j].ap_data)
              ) {
                lnApMnse += calculaMinutosCAD(
                  stringDataParaObjetoData(jsonDate(lmApSecu[j].ap_data)),
                  pad(lmApSecu[j].ap_hent.toFixed(2), 5).replace(".", ":"),
                  pad(lmApSecu[j].ap_hiin.toFixed(2), 5).replace(".", ":"),
                  pad(lmApSecu[j].ap_htin.toFixed(2), 5).replace(".", ":"),
                  pad(lmApSecu[j].ap_hter.toFixed(2), 5).replace(".", ":")
                );
              }
            }

            if (
              (Math.abs(lnApMnse - lnApMnap) > 15 &&
                parseInt(lmWkRsql[i].id_clie) != 69) ||
              (Math.abs(lnApMnse - lnApMnap) > 20 &&
                parseInt(lmWkRsql[i].id_clie) == 69)
            ) {
              for (var j = 0; j < lmApDvrg.length; j++) {
                if (
                  lmWkRsql[i].fu_empr.trim().toUpperCase() ==
                    lmApDvrg[j].fu_empr.trim().toUpperCase() &&
                  parseInt(lmWkRsql[i].id_matr) ==
                    parseInt(lmApDvrg[j].id_matr) &&
                  jsonDate(lmWkRsql[i].ap_data) == jsonDate(lmApDvrg[j].ap_data)
                ) {
                  llApFunc = true;

                  break;
                }
              }

              if (!llApFunc) {
                lmApDvrg.push({
                  fu_empr: lmWkRsql[i].fu_empr.trim().toUpperCase(),
                  id_matr: parseInt(lmWkRsql[i].id_matr),
                  ap_data: lmWkRsql[i].ap_data,
                  em_fant: lmWkRsql[i].em_fant.trim().toUpperCase(),
                  fu_nome: lmWkRsql[i].fu_nome.trim().toUpperCase(),
                  id_clie: parseInt(lmWkRsql[i].id_clie),
                  cl_fant: lmWkRsql[i].cl_fant.trim().toUpperCase(),
                  ap_mnap: lnApMnap,
                  ap_mnse: lnApMnse,
                });
              }
            }

            // if (
            //   (lnIdStrc == 0 &&
            //     ((Math.abs(lnApMnse - lnApMnap) > 15 &&
            //       parseInt(lmWkRsql[i].id_clie) != 69) ||
            //       (Math.abs(lnApMnse - lnApMnap) > 20 &&
            //         parseInt(lmWkRsql[i].id_clie) == 69))) ||
            //   (lnIdStrc > 0 &&
            //     lnApMnap > 0 &&
            //     lnIdStrc == parseInt(lmWkRsql[i].id_strc) &&
            //     ((Math.abs(lnApMnse - lnApMnap) > 15 &&
            //       parseInt(lmWkRsql[i].id_clie) != 69) ||
            //       (Math.abs(lnApMnse - lnApMnap) > 20 &&
            //         parseInt(lmWkRsql[i].id_clie) == 69))) ||
            //   (lnIdStrc < 0 && lnApMnap == 0 && lnApMnse > 0)
            // ) {
            //   for (var j = 0; j < lmApDvrg.length; j++) {
            //     if (
            //       lmWkRsql[i].fu_empr.trim().toUpperCase() ==
            //         lmApDvrg[j].fu_empr.trim().toUpperCase() &&
            //       parseInt(lmWkRsql[i].id_matr) ==
            //         parseInt(lmApDvrg[j].id_matr) &&
            //       jsonDate(lmWkRsql[i].ap_data) == jsonDate(lmApDvrg[j].ap_data)
            //     ) {
            //       llApFunc = true;

            //       break;
            //     }
            //   }

            //   if (!llApFunc) {
            //     lmApDvrg.push({
            //       fu_empr: lmWkRsql[i].fu_empr.trim().toUpperCase(),
            //       id_matr: parseInt(lmWkRsql[i].id_matr),
            //       ap_data: lmWkRsql[i].ap_data,
            //       em_fant: lmWkRsql[i].em_fant.trim().toUpperCase(),
            //       fu_nome: lmWkRsql[i].fu_nome.trim().toUpperCase(),
            //       id_clie: parseInt(lmWkRsql[i].id_clie),
            //       cl_fant: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            //       ap_mnap: lnApMnap,
            //       ap_mnse: lnApMnse,
            //     });
            //   }
            // }
          }

          if (lnIdStrc > 0) {
            var i = lmApDvrg.length;

            while (i--) {
              llIdStrc = false;

              for (var j = 0; j < lmWkRsql.length; j++) {
                if (
                  lmApDvrg[i].fu_empr.trim().toUpperCase() ==
                    lmWkRsql[j].fu_empr.trim().toUpperCase() &&
                  parseInt(lmApDvrg[i].id_matr) ==
                    parseInt(lmWkRsql[j].id_matr) &&
                  jsonDate(lmApDvrg[i].ap_data) ==
                    jsonDate(lmWkRsql[j].ap_data) &&
                  lnIdStrc == parseInt(lmWkRsql[j].id_strc)
                ) {
                  llIdStrc = true;

                  break;
                }
              }

              if (!llIdStrc) {
                lmApDvrg.splice(i, 1);
              }
            }
          }

          if (lnIdStrc < 0) {
            var i = lmApDvrg.length;

            while (i--) {
              if (parseInt(lmApDvrg[i].ap_mnap) > 0) {
                lmApDvrg.splice(i, 1);
              }
            }
          }

          gmApFuncCAD = lmApFunc;
          gmApSecuCAD = lmApSecu;
          gmApDvrgCAD = lmApDvrg;

          gmApDvrgCAD.sort(dynamicSort("fu_nome"));
          gmApDvrgCAD.sort(dynamicSort("ap_data"));
          gmApDvrgCAD.sort(dynamicSort("cl_fant"));

          montaDivergenciasApontamentosCAD(ldDtOnte, ldDtHoje);

          loDvDvrg.onscroll = function () {
            if (
              loDvDvrg.scrollHeight -
                loDvDvrg.scrollTop -
                loDvDvrg.clientHeight <
              1
            ) {
              montaDivergenciasApontamentosCAD(ldDtOnte, ldDtHoje);
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

function pesquisaStatusFuncionariosCAD() {
  var loDtDtde = document.getElementById("datDtdeCAD");
  var loDtDtat = document.getElementById("datDtatCAD");
  var loSlStrc = document.getElementById("sltStrcCAD");
  var lnIdClie = null;
  var lcWkRsql =
      "<option value='0'>TODOS OS STATUS</option>" +
      "<option value='-1'>SEM APONTAMENTO NO APLICATIVO</option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  try {
    if (parseInt(loSlClie.value) > 0) {
      lnIdClie = parseInt(loSlClie.value);
    }
  } catch (error) {}

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)) },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlStrc.disabled = true;

  loSlStrc.innerHTML =
    "<option value='0'>CARREGANDO STATUS DOS FUNCIONÁRIOS...</option>";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaStatusFuncionarios",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loSlStrc.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_strc.toString() + "'>" + lmWkRsql[i].sr_deno.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlStrc.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {
      loSlStrc.disabled = false;

      loSlStrc.innerHTML = lcWkRsql;
    },
  });
}

function consultaSelectCAD(loSlHtml) {
  var loObSlct = document.getElementById(loSlHtml.id_slct.trim());

  for (var i = 0; i < loObSlct.options.length; i++) {
    if (
      loObSlct.options[i].value.toString().trim().toUpperCase() ==
      loSlHtml.sl_valu.toString().trim().toUpperCase()
    ) {
      loObSlct.selectedIndex = i;

      pesquisaStatusFuncionariosCAD();

      break;
    }
  }
}

function pesquisaSelectCAD(lmSlHtml) {
  if (lmSlHtml.length == 0) {
    alerta("pesquisa vazia", "alerta");

    return;
  }

  sessionStorage.setItem("smSlHtml", JSON.stringify(lmSlHtml));

  redireciona("PesqSlHtml.html", "PesqSlHtml.html");
}

function pesquisaObrasDefinidasPorPeriodoCAD() {
  var loDtDtde = document.getElementById("datDtdeCAD");
  var loDtDtat = document.getElementById("datDtatCAD");
  var loDvClie = document.getElementById("divClieCAD");
  var loSlClie = document.getElementById("sltClieCAD");
  var loDvPesq = document.getElementById("divPesqCAD");
  var lcWkRsql = "<option value='0'>TODAS AS OBRAS</option>",
    lcWkIsql = "";
  var lmWkIsql = [],
    lmSlHtml = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "ldDrDtde", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtde.value)) },
    { pa_nome: "ldDrDtat", pa_tipo: "SmallDatetime", pa_valo: objetoDataParaStringSqlData(htmlDataParaObjetoData(loDtDtat.value)) },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlClie.disabled = true;

  loSlClie.innerHTML = "<option value='0'>CARREGANDO OBRAS...</option>";

  loDvPesq.style.display = "none";

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaObrasDefinidasPorPeriodo",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loDvPesq.style.display = "";

      loSlClie.disabled = false;

      try {
        for (var i = 0; i < lmWkRsql.length; i++) {
          lmSlHtml.push({
            id_slct: "sltClieCAD",
            sl_valu: lmWkRsql[i].id_clie.toString(),
            sl_text: lmWkRsql[i].cl_fant.trim().toUpperCase(),
            sl_titl: "pesquisa de obras",
          });

          //prettier-ignore
          lcWkRsql += "<option value='" + lmWkRsql[i].id_clie.toString() + "'>" + lmWkRsql[i].cl_fant.trim().toUpperCase() + "</option>";
        }
      } catch (loApErro) {}

      loSlClie.innerHTML = lcWkRsql;

      loDvClie.onclick = function () {
        pesquisaSelectCAD(lmSlHtml);
      };

      pesquisaStatusFuncionariosCAD();
    },
    error: function (jqXHR, textStatus, err) {
      loDvPesq.style.display = "";

      loSlClie.disabled = false;

      loSlClie.innerHTML = lcWkRsql;

      loDvClie.onclick = function () {
        pesquisaSelectCAD([]);
      };

      pesquisaStatusFuncionariosCAD();
    },
  });
}

function alteraDataCAD(loDtData) {
  var loDtDtde = document.getElementById("datDtdeCAD");
  var loDtDtat = document.getElementById("datDtatCAD");
  var ldDtHoje = new Date();

  ldDtHoje.setDate(ldDtHoje.getDate() - 1);

  if (loDtData.value == loDtData.defaultValue) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (
    htmlDataParaObjetoData(loDtDtde.value) >
    htmlDataParaObjetoData(loDtDtat.value)
  ) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  if (ldDtHoje.getHours() < 12) {
    ldDtHoje.setDate(ldDtHoje.getDate() - 1);
  }

  if (htmlDataParaObjetoData(loDtDtat.value) > ldDtHoje) {
    loDtData.value = loDtData.defaultValue;

    app.input.validate(loDtData);

    return;
  }

  pesquisaObrasDefinidasPorPeriodoCAD();
}

function limpaCamposCAD() {
  var loDvDvrg = document.getElementById("divDvrgCAD");
  var loUlDvrg = document.getElementById("uulDvrgCAD");
  var loDvLoad = document.getElementById("divLoadCAD");

  gnInListCAD = 0;
  gmApDvrgCAD = [];

  loDvDvrg.onscroll = function () {};

  loUlDvrg.innerHTML = "";

  loDvLoad.style.display = "none";
}

function ComlApDvrg() {
  var loDvFabm = document.getElementById("divFabmCAD");
  var loDvFabw = document.getElementById("divFabwCAD");
  var loDtDtde = document.getElementById("datDtdeCAD");
  var loDtDtat = document.getElementById("datDtatCAD");
  var ldDtHoje = new Date();

  ldDtHoje.setDate(ldDtHoje.getDate() - 1);

  limpaCamposCAD();

  if (isMobile()) {
    loDvFabw.style.display = "none";
  } else {
    loDvFabm.style.display = "none";
  }

  if (ldDtHoje.getHours() < 12) {
    ldDtHoje.setDate(ldDtHoje.getDate() - 1);
  }

  loDtDtde.valueAsDate = ldDtHoje;
  loDtDtat.valueAsDate = ldDtHoje;

  alteraDataCAD(loDtDtat);

  OkTecladoAndroid3("txtPesqCAD", "btnPesqCAD", "btnPesqCAD");
}
