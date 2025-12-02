var gmWkRsqlCAB = [],
  gmOsJornCAB = [],
  gmOsVhfuCAB = [],
  gmOsLctoCAB = [];

function excelCAB() {
  var loDtDtde = document.getElementById("datDtdeCAB");
  var loDtDtat = document.getElementById("datDtatCAB");
  var ldDtHoje = new Date();
  var lcApHtml = "",
    lcApRcso = "",
    lcNmFile = "",
    lcBmMsgm = "",
    lcOsNume = "";
  var lnToVlhr = 0,
    lnFuVlhr = 0,
    lnIdDsem = 0,
    lnJoMnts = 0,
    lnIdOrds = 0,
    lnOsHdom = 0,
    lnOsHext = 0,
    lnOsHnot = 0,
    lnOsHdrs = 0,
    lnOsHers = 0,
    lnOsHnrs = 0,
    lnCtApnt = 0,
    lnToVhpr = 0;
  var loOsLcto = {};
  var llVhZero = false;

  ldDtHoje.setHours(0, 0, 0, 0);

  if (gmWkRsqlCAB.length == 0) {
    alerta("relatório sem conteúdo", "alerta");

    return;
  }

  if (loDtDtde.value.toString().trim().length > 0) {
    lcApDtde = loDtDtde.value.toString().trim();
  } else {
    return;
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcApDtat = loDtDtat.value.toString().trim();
  } else {
    return;
  }

  if (htmlDataParaObjetoData(lcApDtde) > htmlDataParaObjetoData(lcApDtat)) {
    return;
  }

  if (htmlDataParaObjetoData(lcApDtat) > ldDtHoje) {
    return;
  }

  try {
    for (var i = 0; i < gmOsLctoCAB.length; i++) {
      if (
        parseInt(gmOsLctoCAB[i].id_cadt) == parseInt(gmOsLctoCAB[i].pq_cadt)
      ) {
        loOsLcto = gmOsLctoCAB[i];

        break;
      }
    }
  } catch (error) {}

  //prettier-ignore
  lcApRcso +=
          "<tr>" +
            "<td colspan='5'>" +
              "obra: " + loOsLcto.cl_fant.trim().toUpperCase() +
            "</td>" +
            "<td colspan='3'>" +
              "local: " + loOsLcto.id_cida.trim().toUpperCase() + "/" + loOsLcto.id_esta.trim().toUpperCase() +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td colspan='4'>" +
              "período de: " + objetoDataParaStringData(htmlDataParaObjetoData(lcApDtde)) +
            "</td>" +
            "<td colspan='4'>" +
              "até: " + objetoDataParaStringData(htmlDataParaObjetoData(lcApDtat)) +
            "</td>" +
          "</tr>";

  for (var h = 0; h < gmOsLctoCAB.length; h++) {
    lnCtApnt = 0;
    lnIdOrds = parseInt(gmOsLctoCAB[h].id_ords);

    for (var i = 0; i < gmWkRsqlCAB.length; i++) {
      if (parseInt(gmWkRsqlCAB[i].id_ords) == lnIdOrds) {
        lnCtApnt++;
      }
    }

    if (parseInt(gmOsLctoCAB[h].os_chck) > 0 && lnCtApnt > 0) {
      lnToVlhr = 0;

      lnOsHdom = parseInt(gmOsLctoCAB[h].os_hdom);
      lnOsHext = parseInt(gmOsLctoCAB[h].os_hext);
      lnOsHnot = parseInt(gmOsLctoCAB[h].os_hnot);
      lnOsHdrs = parseInt(gmOsLctoCAB[h].os_hdrs);
      lnOsHers = parseInt(gmOsLctoCAB[h].os_hers);
      lnOsHnrs = parseInt(gmOsLctoCAB[h].os_hnrs);

      //prettier-ignore
      lcApRcso +=
          "<tr>" +
            "<td colspan='8'>" +
              "&nbsp;" +
            "</td>" + 
          "</tr>" +
          "<tr>" +
            "<td colspan='8'>" +
              "proposta: " + gmOsLctoCAB[h].os_nume.trim().toUpperCase() +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td colspan='8'>" +
              "&nbsp;" +
            "</td>" + 
          "</tr>" +
          "<tr>" +
            "<td colspan='8'>" +
              "recursos" +
            "</td>" + 
          "</tr>" +
          "<tr>" +
            "<td>" +
              "data" +
            "</td>" +
            "<td>" +
              "tipo" +
            "</td>" +
            "<td>" +
              "recurso" +
            "</td>" +
            "<td>" +
              "função" +
            "</td>" +
            "<td>" +
              "evento" +
            "</td>" +
            "<td>" +
              "total hrs" +
            "</td>" +
            "<td>" +
              "valor unit." +
            "</td>" +
            "<td>" +
              "total" +
            "</td>" +
          "</tr>";

      for (var i = 0; i < gmWkRsqlCAB.length; i++) {
        if (parseInt(gmWkRsqlCAB[i].id_ords) == lnIdOrds) {
          lnFuVlhr = 0;

          for (var j = 0; j < gmOsVhfuCAB.length; j++) {
            if (
              parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds &&
              gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() == "EQP"
            ) {
              if (
                parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds &&
                gmOsVhfuCAB[j].fu_deno.trim().toUpperCase() ==
                  gmWkRsqlCAB[i].fu_nome.trim().toUpperCase()
              ) {
                lnFuVlhr = parseFloat(gmOsVhfuCAB[j].fu_vlhr);

                break;
              }
            } else {
              if (
                parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds &&
                gmOsVhfuCAB[j].fu_deno.trim().toUpperCase() ==
                  gmWkRsqlCAB[i].fu_func.trim().toUpperCase()
              ) {
                lnFuVlhr = parseFloat(gmOsVhfuCAB[j].fu_vlhr);

                break;
              }
            }
          }

          if (lnFuVlhr == 0) {
            llVhZero = true;
          }

          lnIdDsem = stringDataParaObjetoData(
            jsonDate(gmWkRsqlCAB[i].ap_data)
          ).getDay();

          for (var j = 0; j < gmOsJornCAB.length; j++) {
            if (
              parseInt(gmOsJornCAB[j].id_ords) == lnIdOrds &&
              parseInt(gmOsJornCAB[j].id_dsem) == lnIdDsem + 1
            ) {
              lnJoMnts = parseInt(gmOsJornCAB[j].jo_mnts);

              break;
            }
          }

          if (lnJoMnts > 0) {
            if (parseInt(gmWkRsqlCAB[i].ap_feri) > 0) {
              if (lnOsHdrs > 0) {
                //prettier-ignore
                lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + brMoney(lnOsHdrs) + "</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr + lnOsHdrs) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), 0, false, lnOsHdrs)) + "</td>" +
          "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  0,
                  false,
                  lnOsHdrs
                );
              } else {
                //prettier-ignore
                lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + lnOsHdom.toString() + "%</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr * (1 + lnOsHdom / 100)) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), lnOsHdom, false, 0)) + "</td>" +
          "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  lnOsHdom,
                  false,
                  0
                );
              }
            } else {
              if (
                calculaHorasCAB(gmWkRsqlCAB[i], 0, true).trim().length > 0 &&
                calculaHorasCAB(gmWkRsqlCAB[i], 0, true).trim().toUpperCase() !=
                  "00:00"
              ) {
                //prettier-ignore
                lcApRcso += 
            "<tr>" +
              "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
              "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
              "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
              "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
              "<td>H./NORMAL</td>" +
              "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 0, true) + "</td>" +
              "<td>" + brMoney(lnFuVlhr) + "</td>" +
              "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 0, true), 0, false, 0)) + "</td>" +
            "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 0, true),
                  0,
                  false, 0
                );
              }

              if (
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().length > 0 &&
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().toUpperCase() !=
                  "00:00"
              ) {
                if (lnOsHers > 0) {
                  //prettier-ignore
                  lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + brMoney(lnOsHers) + "</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr + lnOsHers) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), 0, false, lnOsHers)) + "</td>" +
          "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    0,
                    false,
                    lnOsHers
                  );
                } else {
                  //prettier-ignore
                  lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + lnOsHext.toString() + "%</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr * (1 + lnOsHext / 100)) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), lnOsHext, false, 0)) + "</td>" +
          "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    lnOsHext,
                    false,
                    0
                  );
                }
              }
            }
          } else {
            if (parseInt(gmWkRsqlCAB[i].ap_feri) > 0 || lnIdDsem == 0) {
              if (lnOsHdrs > 0) {
                //prettier-ignore
                lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + brMoney(lnOsHdrs) + "</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr + lnOsHdrs) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), 0, false, lnOsHdrs)) + "</td>" +
          "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  0,
                  false,
                  lnOsHdrs
                );
              } else {
                //prettier-ignore
                lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + lnOsHdom.toString() + "%</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr * (1 + lnOsHdom / 100)) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), lnOsHdom, false, 0)) + "</td>" +
          "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  lnOsHdom,
                  false,
                  0
                );
              }
            } else {
              if (
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().length > 0 &&
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().toUpperCase() !=
                  "00:00"
              ) {
                if (lnOsHers > 0) {
                  //prettier-ignore
                  lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + brMoney(lnOsHers) + "</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr + lnOsHers) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), 0, false, lnOsHers)) + "</td>" +
          "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    0,
                    false,
                    lnOsHers
                  );
                } else {
                  //prettier-ignore
                  lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>H./" + lnOsHext.toString() + "%</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr * (1 + lnOsHext / 100)) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), lnOsHext, false, 0)) + "</td>" +
          "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    lnOsHext,
                    false,
                    0
                  );
                }
              }
            }
          }

          if (
            calculaHorasCAB(gmWkRsqlCAB[i], 4, true).trim().length > 0 &&
            calculaHorasCAB(gmWkRsqlCAB[i], 4, true).trim().toUpperCase() !=
              "00:00"
          ) {
            if (lnOsHnrs > 0) {
              //prettier-ignore
              lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>AD. NOT.</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 4, true) + "</td>" +
            "<td>" + brMoney(lnOsHnrs) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 4, false), 0, true, lnOsHnrs)) + "</td>" +
          "</tr>";

              lnToVlhr += calculaValorTotalHorasCAB(
                lnFuVlhr,
                calculaHorasCAB(gmWkRsqlCAB[i], 4, false),
                0,
                true,
                lnOsHnrs
              );
            } else {
              //prettier-ignore
              lcApRcso += 
          "<tr>" +
            "<td>" + jsonDate(gmWkRsqlCAB[i].ap_data) + ".</td>" +
            "<td>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</td>" +
            "<td>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</td>" +
            "<td>AD. NOT.</td>" +
            "<td>" + calculaHorasCAB(gmWkRsqlCAB[i], 4, true) + "</td>" +
            "<td>" + brMoney(lnFuVlhr * (lnOsHnot / 100)) + "</td>" +
            "<td>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 4, false), lnOsHnot, true, 0)) + "</td>" +
          "</tr>";

              lnToVlhr += calculaValorTotalHorasCAB(
                lnFuVlhr,
                calculaHorasCAB(gmWkRsqlCAB[i], 4, false),
                lnOsHnot,
                true,
                0
              );
            }
          }
        }
      }

      //prettier-ignore
      lcApRcso +=
          "<tr>" +
            "<td colspan='7'>" +
              "valor total da proposta" +
            "</td>" +
            "<td>" +
              brMoney(lnToVlhr) +
            "</td>" +
          "</tr>";

      lnToVhpr += lnToVlhr;
    }
  }

  if (llVhZero) {
    if (
      !confirm(
        "uma ou mais funções com valor da hora zerado na proposta, deseja continuar ?"
      )
    ) {
      return;
    }
  }

  //prettier-ignore
  lcApRcso +=
          "<tr>" +
            "<td colspan='8'>" +
              "&nbsp;" +
            "</td>" + 
          "</tr>" +
          "<tr>" +
            "<td colspan='7'>" +
              "valor total do bms" +
            "</td>" +
            "<td>" +
              brMoney(lnToVhpr) +
            "</td>" +
          "</tr>";

  ldDtHoje = new Date();

  //prettier-ignore
  lcApHtml =
        "<table>" +
          "<tr>" +
            "<td colspan='4'>BOLETIM MEDIÇÃO DE SERVIÇO</td>" +
            "<td colspan='4'>EMITIDO EM " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
          "<tr>" +
            "<td colspan='8'>" +
              "&nbsp;" +
            "</td>" + 
          "</tr>" +
            lcApRcso +
          "<tr>" +
            "<td colspan='8'>" +
              "&nbsp;" +
            "</td>" + 
          "</tr>" +
          "<tr>" +
            "<td colspan='8'>" +
              "aprovação" +
            "</td>" + 
          "</tr>" +
          "<tr>" +
            "<td colspan='4'>" +
              "contratante" +
            "</td>" +
            "<td colspan='4'>" +
              "contratada" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td>" +
              "nome: " +
            "</td>" +
            "<td colspan='3'>" +
              "_____________________________________" +
            "</td>" +
            "<td>" +
              "nome: " +
            "</td>" +
            "<td colspan='3'>" +
              "_____________________________________" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td>" +
              "função: " +
            "</td>" +
            "<td colspan='3'>" +
              "_____________________________________" +
            "</td>" +
            "<td>" +
              "função: " +
            "</td>" +
            "<td colspan='3'>" +
              "_____________________________________" +
            "</td>" +
          "</tr>" +
        "</table>";

  if (gmOsLctoCAB.length > 0) {
    lcNmFile = "bms_real";
  } else {
    lcNmFile = "bms_os_" + loOsLcto.os_nume.trim().toLowerCase() + "_real";
    lcBmMsgm = " da os " + loOsLcto.os_nume.trim().toLowerCase();
    lcOsNume = " DA PROPOSTA " + loOsLcto.os_nume.trim().toLowerCase();
  }

  insereLogCAB(loOsLcto.cl_fant.trim().toUpperCase(), lcOsNume);

  htmlTableToExcel(lcApHtml, "bms" + lcBmMsgm + " da real", lcNmFile + ".xlsx");
}

function insereLogCAB(lcClFant, lcOsNume) {
  var lcWkIsql = "",
    lcLgOcor = "";
  var lmWkIsql = [];

  lcLgOcor =
    "O USUÁRIO " +
    goCdUser.id_user.trim().toUpperCase() +
    " GEROU UM BMS DA OBRA " +
    lcClFant +
    lcOsNume;

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcLgProg", pa_tipo: "VarChar", pa_valo: "COMLAPBMSV" },
    { pa_nome: "lcLgOcor", pa_tipo: "VarChar", pa_valo: lcLgOcor },
    { pa_nome: "lcLgTipo", pa_tipo: "VarChar", pa_valo: "A" },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=insereLog",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {},
    error: function (jqXHR, textStatus, err) {},
  });
}

function pdfCAB(lnRdVisu) {
  var loDtDtde = document.getElementById("datDtdeCAB");
  var loDtDtat = document.getElementById("datDtatCAB");
  var ldDtHoje = new Date();
  var lcApHtml = "",
    lcApRcso = "",
    lcNmFile = "",
    lcBmMsgm = "",
    lcOsNume = "";
  var lnToVlhr = 0,
    lnToVhpr = 0,
    lnFuVlhr = 0,
    lnIdDsem = 0,
    lnJoMnts = 0,
    lnIdOrds = 0,
    lnOsHdom = 0,
    lnOsHext = 0,
    lnOsHnot = 0,
    lnOsHdrs = 0,
    lnOsHers = 0,
    lnOsHnrs = 0,
    lnCtApnt = 0;
  var loOsLcto = {};
  var llVhZero = false;

  ldDtHoje.setHours(0, 0, 0, 0);

  if (gmWkRsqlCAB.length == 0) {
    alerta("relatório sem conteúdo", "alerta");

    return;
  }

  if (loDtDtde.value.toString().trim().length > 0) {
    lcApDtde = loDtDtde.value.toString().trim();
  } else {
    return;
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcApDtat = loDtDtat.value.toString().trim();
  } else {
    return;
  }

  if (htmlDataParaObjetoData(lcApDtde) > htmlDataParaObjetoData(lcApDtat)) {
    return;
  }

  if (htmlDataParaObjetoData(lcApDtat) > ldDtHoje) {
    return;
  }

  try {
    for (var i = 0; i < gmOsLctoCAB.length; i++) {
      if (
        parseInt(gmOsLctoCAB[i].id_cadt) == parseInt(gmOsLctoCAB[i].pq_cadt)
      ) {
        loOsLcto = gmOsLctoCAB[i];

        break;
      }
    }
  } catch (error) {}

  //prettier-ignore
  lcApRcso +=
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>obra</span> <br />" +
              "<span style='font-size: small;'>" + loOsLcto.cl_fant.trim().toUpperCase() + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>local</span> <br />" +
              "<span style='font-size: small;'>" + loOsLcto.id_cida.trim().toUpperCase() + "/" + loOsLcto.id_esta.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>período de</span> <br />" +
              "<span style='font-size: small;'>" + objetoDataParaStringData(htmlDataParaObjetoData(lcApDtde)) + "</span>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>até</span> <br />" +
              "<span style='font-size: small;'>" + objetoDataParaStringData(htmlDataParaObjetoData(lcApDtat)) + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>"

  for (var h = 0; h < gmOsLctoCAB.length; h++) {
    lnCtApnt = 0;
    lnIdOrds = parseInt(gmOsLctoCAB[h].id_ords);

    for (var i = 0; i < gmWkRsqlCAB.length; i++) {
      if (parseInt(gmWkRsqlCAB[i].id_ords) == lnIdOrds) {
        lnCtApnt++;
      }
    }

    if (parseInt(gmOsLctoCAB[h].os_chck) > 0 && lnCtApnt > 0) {
      lnToVlhr = 0;

      lnOsHdom = parseInt(gmOsLctoCAB[h].os_hdom);
      lnOsHext = parseInt(gmOsLctoCAB[h].os_hext);
      lnOsHnot = parseInt(gmOsLctoCAB[h].os_hnot);
      lnOsHdrs = parseInt(gmOsLctoCAB[h].os_hdrs);
      lnOsHers = parseInt(gmOsLctoCAB[h].os_hers);
      lnOsHnrs = parseInt(gmOsLctoCAB[h].os_hnrs);

      //prettier-ignore
      lcApRcso +=
        "<br />" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: top;'>" +
              "<span style='font-size: x-small;'>proposta</span> <br />" +
              "<span style='font-size: small;'>" + gmOsLctoCAB[h].os_nume.trim().toUpperCase() + "</span>" +
            "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
        "<span style='font-size: large;'>recursos</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>data</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>tipo</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>recurso</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>função</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>evento</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>total hrs</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>valor unit.</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>total</b>" +
            "</td>" +
          "</tr>";

      for (var i = 0; i < gmWkRsqlCAB.length; i++) {
        if (parseInt(gmWkRsqlCAB[i].id_ords) == lnIdOrds) {
          lnFuVlhr = 0;

          for (var j = 0; j < gmOsVhfuCAB.length; j++) {
            if (
              parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds &&
              gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() == "EQP"
            ) {
              if (
                parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds &&
                gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() ==
                  gmOsVhfuCAB[j].fu_deno.trim().toUpperCase()
              ) {
                lnFuVlhr = parseFloat(gmOsVhfuCAB[j].fu_vlhr);

                break;
              }
            } else {
              if (
                parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds &&
                gmWkRsqlCAB[i].fu_func.trim().toUpperCase() ==
                  gmOsVhfuCAB[j].fu_deno.trim().toUpperCase()
              ) {
                lnFuVlhr = parseFloat(gmOsVhfuCAB[j].fu_vlhr);

                break;
              }
            }
          }

          if (lnFuVlhr == 0) {
            llVhZero = true;
          }

          lnIdDsem = stringDataParaObjetoData(
            jsonDate(gmWkRsqlCAB[i].ap_data)
          ).getDay();

          for (var j = 0; j < gmOsJornCAB.length; j++) {
            if (
              parseInt(gmOsJornCAB[j].id_ords) == lnIdOrds &&
              parseInt(gmOsJornCAB[j].id_dsem) == lnIdDsem + 1
            ) {
              lnJoMnts = parseInt(gmOsJornCAB[j].jo_mnts);

              break;
            }
          }

          if (lnJoMnts > 0) {
            if (parseInt(gmWkRsqlCAB[i].ap_feri) > 0) {
              if (lnOsHdrs > 0) {
                //prettier-ignore
                lcApRcso += 
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>H./" + brMoney(lnOsHdrs) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(lnFuVlhr + lnOsHdrs) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), 0, false, lnOsHdrs)) + "</span>" +
                "</td>" +
              "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  0,
                  false,
                  lnOsHdrs
                );
              } else {
                //prettier-ignore
                lcApRcso += 
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>H./" + lnOsHdom.toString() + "%</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(lnFuVlhr * (1 + lnOsHdom / 100)) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), lnOsHdom, false, 0)) + "</span>" +
                "</td>" +
              "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  lnOsHdom,
                  false,
                  0
                );
              }
            } else {
              if (
                calculaHorasCAB(gmWkRsqlCAB[i], 0, true).trim().length > 0 &&
                calculaHorasCAB(gmWkRsqlCAB[i], 0, true).trim().toUpperCase() !=
                  "00:00"
              ) {
                //prettier-ignore
                lcApRcso += 
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>H./NORMAL</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 0, true) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(lnFuVlhr) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 0, true), 0, false, 0)) + "</span>" +
                "</td>" +
              "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 0, true),
                  0,
                  false, 0
                );
              }

              if (
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().length > 0 &&
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().toUpperCase() !=
                  "00:00"
              ) {
                if (lnOsHers > 0) {
                  //prettier-ignore
                  lcApRcso += 
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>H./" + brMoney(lnOsHers) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(lnFuVlhr + lnOsHers) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), 0, false, lnOsHers)) + "</span>" +
                "</td>" +
              "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    0,
                    false,
                    lnOsHers
                  );
                } else {
                  //prettier-ignore
                  lcApRcso += 
              "<tr>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>H./" + lnOsHext.toString() + "%</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(lnFuVlhr * (1 + lnOsHext / 100)) + "</span>" +
                "</td>" +
                "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                  "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), lnOsHext, false, 0)) + "</span>" +
                "</td>" +
              "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    lnOsHext,
                    false,
                    0
                  );
                }
              }
            }
          } else {
            if (parseInt(gmWkRsqlCAB[i].ap_feri) > 0 || lnIdDsem == 0) {
              if (lnOsHdrs > 0) {
                //prettier-ignore
                lcApRcso += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>H./" + brMoney(lnOsHdrs) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(lnFuVlhr + lnOsHdrs) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), 0, false, lnOsHdrs)) + "</span>" +
              "</td>" +
            "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  0,
                  false,
                  lnOsHdrs
                );
              } else {
                //prettier-ignore
                lcApRcso += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>H./" + lnOsHdom.toString() + "%</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(lnFuVlhr * (1 + lnOsHdom / 100)) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), lnOsHdom, false, 0)) + "</span>" +
              "</td>" +
            "</tr>";

                lnToVlhr += calculaValorTotalHorasCAB(
                  lnFuVlhr,
                  calculaHorasCAB(gmWkRsqlCAB[i], 3, true),
                  lnOsHdom,
                  false,
                  0
                );
              }
            } else {
              if (
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().length > 0 &&
                calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().toUpperCase() !=
                  "00:00"
              ) {
                if (lnOsHers > 0) {
                  //prettier-ignore
                  lcApRcso += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>H./" + brMoney(lnOsHers) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(lnFuVlhr + lnOsHers) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), 0, false, lnOsHers)) + "</span>" +
              "</td>" +
            "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    0,
                    false,
                    lnOsHers
                  );
                } else {
                  //prettier-ignore
                  lcApRcso += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>H./" + lnOsHext.toString() + "%</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(lnFuVlhr * (1 + lnOsHext / 100)) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), lnOsHext, false, 0)) + "</span>" +
              "</td>" +
            "</tr>";

                  lnToVlhr += calculaValorTotalHorasCAB(
                    lnFuVlhr,
                    calculaHorasCAB(gmWkRsqlCAB[i], 1, true),
                    lnOsHext,
                    false,
                    0
                  );
                }
              }
            }
          }

          if (
            calculaHorasCAB(gmWkRsqlCAB[i], 4, true).trim().length > 0 &&
            calculaHorasCAB(gmWkRsqlCAB[i], 4, true).trim().toUpperCase() !=
              "00:00"
          ) {
            if (lnOsHnrs) {
              //prettier-ignore
              lcApRcso += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>AD. NOT.</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 4, true) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(lnOsHnrs) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 4, false), 0, true, lnOsHnrs)) + "</span>" +
              "</td>" +
            "</tr>";

              lnToVlhr += calculaValorTotalHorasCAB(
                lnFuVlhr,
                calculaHorasCAB(gmWkRsqlCAB[i], 4, false),
                0,
                true,
                lnOsHnrs
              );
            } else {
              //prettier-ignore
              lcApRcso += 
            "<tr>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>AD. NOT.</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + calculaHorasCAB(gmWkRsqlCAB[i], 4, true) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(lnFuVlhr * (lnOsHnot / 100)) + "</span>" +
              "</td>" +
              "<td style='border: 1px solid black; vertical-align: middle; text-align: center;'>" +
                "<span style='font-size: small;'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 4, false), lnOsHnot, true, 0)) + "</span>" +
              "</td>" +
            "</tr>";

              lnToVlhr += calculaValorTotalHorasCAB(
                lnFuVlhr,
                calculaHorasCAB(gmWkRsqlCAB[i], 4, false),
                lnOsHnot,
                true,
                0
              );
            }
          }
        }
      }

      //prettier-ignore
      lcApRcso +=
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: right;' colspan='7'>" +
              "<b>valor total da proposta</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>" + brMoney(lnToVlhr) + "</b>" +
            "</td>" +
          "</tr>" +
        "</table>";

      lnToVhpr += lnToVlhr;
    }
  }

  if (llVhZero) {
    if (
      !confirm(
        "uma ou mais funções com valor da hora zerado na proposta, deseja continuar ?"
      )
    ) {
      return;
    }
  }

  //prettier-ignore
  lcApRcso +=
        "<br />" +        
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>valor total do bms</b>" +
            "</td>" +
            "<td style='border: 1px solid black; vertical-align: center; text-align: center;'>" +
              "<b>" + brMoney(lnToVhpr) + "</b>" +
            "</td>" +
          "</tr>" +
        "</table>"

  ldDtHoje = new Date();

  //prettier-ignore
  lcApHtml =
    "<html>" +
      "<body>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>" +
          "<tr>" +
            "<td style='border: 1px solid black; text-align: center; font-size: large;'>BOLETIM MEDIÇÃO DE SERVIÇO</td>" +
            "<td style='border: 1px solid black; text-align: center;'>" +
              "<img src='http://www.atscs.com.br/images/empresas/gre.png' style='width: 150px;' />" +
            "</td>" +
            "<td style='border: 1px solid black; text-align: center;'>EMITIDO EM " + objetoDataParaStringData(ldDtHoje) + " " + ldDtHoje.toTimeString().split(" ")[0] + "</td>" +
          "</tr>" +
        "</table>" +
        "<br />" +
          lcApRcso +
        "<br />" +
        "<span style='font-size: large;'>aprovação</span>" +
        "<table style='width: 100%; border-spacing: 0; border-collapse: collapse; border: 1px solid black;'>" +
          "<tr>" +
            "<td style='vertical-align: top; width: 50%; text-align: center;'>" +
              "<span><b>contratante</b></span> <br />" +
              "<table style='margin-left: auto; margin-right: auto;'>" +
                "<tr>" +
                  "<td style='text-align: right;'>" +
                    "nome:" +
                  "</td>" +
                  "<td>" +
                    "_____________________________________" +
                  "</td>" +
                "</tr>" +
                "<tr>" +
                  "<td style='text-align: right;'>" +
                    "função:" +
                  "</td>" +
                  "<td>" +
                    "_____________________________________" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</td>" +
            "<td style='vertical-align: top; width: 50%; text-align: center;'>" +
              "<span><b>contratada</b></span> <br />" +
              "<table style='margin-left: auto; margin-right: auto;'>" +
                "<tr>" +
                  "<td style='text-align: right;'>" +
                    "nome:" +
                  "</td>" +
                  "<td>" +
                    "_____________________________________" +
                  "</td>" +
                "</tr>" +
                "<tr>" +
                  "<td style='text-align: right;'>" +
                    "função:" +
                  "</td>" +
                  "<td>" +
                    "_____________________________________" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</td>" +
          "</tr>" +
          "<tr>" +
            "<td colspan='2'>" +
              "&nbsp;" +
            "</td>" + 
          "</tr>" + 
        "</table>" + 
      "</body>" + 
    "</html>";

  if (gmOsLctoCAB.length > 0) {
    lcNmFile = "bms_real";
  } else {
    lcNmFile = "bms_os_" + loOsLcto.os_nume.trim().toLowerCase() + "_real";
    lcBmMsgm = " da os " + loOsLcto.os_nume.trim().toLowerCase();
    lcOsNume = " DA PROPOSTA " + loOsLcto.os_nume.trim().toLowerCase();
  }

  insereLogCAB(loOsLcto.cl_fant.trim().toUpperCase(), lcOsNume);

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
                  fileName: lcNmFile + ".pdf",
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
                    lcNmFile + ".pdf",
                    lo64Base,
                    "application/pdf",
                    "arquivo pdf referente ao bms" + lcBmMsgm + " da real",
                    "bms" + lcBmMsgm + " da real"
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
        fileName: lcNmFile + ".pdf",
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
        lcNmFile,
        lcApHtml
      );
    } else {
      impressaoPdf(
        screen.availWidth / 1.5,
        screen.availHeight / 1.5,
        lcNmFile,
        lcApHtml
      );
    }
  }
}

function calculaValorTotalHorasCAB(
  lnFuVlhr,
  lcHrHora,
  lnHePerc,
  llAdNotu,
  lnHeValo
) {
  var lmHrHora = [];
  var lnHrHora = 0,
    lnHrMnto = 0;

  if (lcHrHora.trim().length == 0 || lnFuVlhr == 0) {
    return 0;
  }

  lmHrHora = lcHrHora.split(":");

  try {
    lnHrHora = parseInt(lmHrHora[0]);
  } catch (error) {}

  try {
    lnHrMnto = parseInt(lmHrHora[1]);
  } catch (error) {}

  if (llAdNotu) {
    if (lcHrHora.trim().length > 0) {
      if (lnHeValo > 0) {
        return lnHeValo * (parseFloat(lcHrHora) / 60);
      } else {
        return lnFuVlhr * (parseFloat(lcHrHora) / 60) * (lnHePerc / 100);
      }
    } else {
      return 0;
    }
  } else {
    if (lnHeValo > 0) {
      return (
        (lnFuVlhr + lnHeValo) * lnHrHora +
        (lnFuVlhr + lnHeValo) * (lnHrMnto / 60)
      );
    } else {
      return (
        (lnFuVlhr * lnHrHora + lnFuVlhr * (lnHrMnto / 60)) *
        (1 + lnHePerc / 100)
      );
    }
  }
}

function calculaMinutosNoturnosCAB(lcPaInic, lcPaTerm, lnMnInic, lnMnTerm) {
  var lnPaInic = parseInt(lcPaInic) / 100,
    lnPaTerm = parseInt(lcPaTerm) / 100,
    lnMnRetn = 0;

  if (lnPaInic < 22 && lnPaTerm > 22) {
    lnMnRetn = lnMnTerm - 1320;
  } else if (lnPaInic >= 22 && lnPaTerm > 5 && lnPaTerm > lnPaInic) {
    lnMnRetn = lnMnTerm - lnMnInic;
  } else if (lnPaInic >= 22 && lnPaTerm > 5 && lnPaTerm < lnPaInic) {
    lnMnRetn = 1440 - lnMnInic + 300;
  } else if (lnPaInic < 22 && lnPaInic > 12 && lnPaTerm <= 5) {
    lnMnRetn = 120 + lnMnTerm;
  } else if (lnPaInic >= 22 && lnPaTerm <= 5) {
    lnMnRetn = 1440 - lnMnInic + lnMnTerm;
  } else if (
    lnPaTerm > lnPaInic &&
    0 <= lnPaInic &&
    lnPaInic <= 5 &&
    lnPaTerm <= 5
  ) {
    lnMnRetn = lnMnTerm - lnMnInic;
  } else if (
    lnPaTerm > lnPaInic &&
    0 <= lnPaInic &&
    lnPaInic <= 5 &&
    lnPaTerm > 5
  ) {
    lnMnRetn = 300 - lnMnInic;
  } else if (lnPaInic < 22 && lnPaInic > 20 && lnPaTerm > 5 && lnPaTerm < 8) {
    lnMnRetn = 420;
  } else if (lnPaInic < 22 && lnPaInic > lnPaTerm && lnPaTerm > 5) {
    lnMnRetn = 420;
  }

  return lnMnRetn;
}

//lnHrExtr( 0: normal, 1: hora extra 60%, 2: adicional noturno 40%, 3: domingo/feriado 100%, 4: adicional noturno hora cheia )
function calculaHorasCAB(loApApnt, lnHrExtr, llHrMnto) {
  var lnApJdms = 0,
    lnApJmms = 0,
    lnApJtms = 0,
    lnHrHora = 0,
    lnHrMnto = 0,
    lnIdDsem = 0,
    lnJoMnts = 0,
    lnAdMnts = 0,
    lnAxJdms = 0;
  var ldApData = new Date(),
    ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0),
    ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
  var lmHrHora = [],
    lmApRcso = [];

  ldApData.setHours(0, 0, 0, 0);

  if (jsonDate(loApApnt.ap_data).trim().length > 0) {
    ldApData = stringDataParaObjetoData(jsonDate(loApApnt.ap_data));
  }

  try {
    if (parseFloat(loApApnt.ap_hent) > 0) {
      ldApHent = new Date(ldApData);

      lmHrHora = loApApnt.ap_hent.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHent.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_hiin) > 0) {
      ldApHiin = new Date(ldApData);

      lmHrHora = loApApnt.ap_hiin.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHiin.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_htin) > 0) {
      ldApHtin = new Date(ldApData);

      lmHrHora = loApApnt.ap_htin.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHtin.setHours(lnHrHora, lnHrMnto);
    }
  } catch (error) {}

  lnHrHora = 0;
  lnHrMnto = 0;

  try {
    if (parseFloat(loApApnt.ap_hter) > 0) {
      ldApHter = new Date(ldApData);

      lmHrHora = loApApnt.ap_hter.toString().split(".");

      try {
        lnHrHora = parseInt(lmHrHora[0]);
      } catch (error) {}

      try {
        lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
      } catch (error) {}

      ldApHter.setHours(lnHrHora, lnHrMnto);
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

  if (lnApJdms == 0) {
    if (llHrMnto) {
      return "";
    } else {
      return 0;
    }
  }

  lnIdDsem = ldApData.getDay();

  for (var i = 0; i < gmOsJornCAB.length; i++) {
    if (
      parseInt(gmOsJornCAB[i].id_dsem) == lnIdDsem + 1 &&
      parseInt(gmOsJornCAB[i].id_ords) == parseInt(loApApnt.id_ords)
    ) {
      lnJoMnts = parseInt(gmOsJornCAB[i].jo_mnts);

      break;
    }
  }

  lnAdMnts += calculaMinutosNoturnosCAB(
    pad(ldApHent.getHours(), 2) + pad(ldApHent.getMinutes(), 2),
    pad(ldApHiin.getHours(), 2) + pad(ldApHiin.getMinutes(), 2),
    ldApHent.getHours() * 60 + ldApHent.getMinutes(),
    ldApHiin.getHours() * 60 + ldApHiin.getMinutes()
  );

  lnAdMnts += calculaMinutosNoturnosCAB(
    pad(ldApHtin.getHours(), 2) + pad(ldApHtin.getMinutes(), 2),
    pad(ldApHter.getHours(), 2) + pad(ldApHter.getMinutes(), 2),
    ldApHtin.getHours() * 60 + ldApHtin.getMinutes(),
    ldApHter.getHours() * 60 + ldApHter.getMinutes()
  );

  for (var i = 0; i < gmWkRsqlCAB.length; i++) {
    if (
      jsonDate(loApApnt.ap_data).trim() ==
        jsonDate(gmWkRsqlCAB[i].ap_data).trim() &&
      loApApnt.fu_empr.trim().toUpperCase() ==
        gmWkRsqlCAB[i].fu_empr.trim().toUpperCase() &&
      parseInt(loApApnt.id_matr) == parseInt(gmWkRsqlCAB[i].id_matr)
    ) {
      ldApHent = new Date(1900, 0, 1, 0, 0, 0, 0);
      ldApHiin = new Date(1900, 0, 1, 0, 0, 0, 0);
      ldApHtin = new Date(1900, 0, 1, 0, 0, 0, 0);
      ldApHter = new Date(1900, 0, 1, 0, 0, 0, 0);
      lmHrHora = [];
      lnHrHora = 0;
      lnHrMnto = 0;
      lnApJmms = 0;
      lnApJtms = 0;

      try {
        if (parseFloat(gmWkRsqlCAB[i].ap_hent) > 0) {
          ldApHent = new Date(ldApData);

          lmHrHora = gmWkRsqlCAB[i].ap_hent.toString().split(".");

          try {
            lnHrHora = parseInt(lmHrHora[0]);
          } catch (error) {}

          try {
            lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
          } catch (error) {}

          ldApHent.setHours(lnHrHora, lnHrMnto);
        }
      } catch (error) {}

      lnHrHora = 0;
      lnHrMnto = 0;

      try {
        if (parseFloat(gmWkRsqlCAB[i].ap_hiin) > 0) {
          ldApHiin = new Date(ldApData);

          lmHrHora = gmWkRsqlCAB[i].ap_hiin.toString().split(".");

          try {
            lnHrHora = parseInt(lmHrHora[0]);
          } catch (error) {}

          try {
            lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
          } catch (error) {}

          ldApHiin.setHours(lnHrHora, lnHrMnto);
        }
      } catch (error) {}

      lnHrHora = 0;
      lnHrMnto = 0;

      try {
        if (parseFloat(gmWkRsqlCAB[i].ap_htin) > 0) {
          ldApHtin = new Date(ldApData);

          lmHrHora = gmWkRsqlCAB[i].ap_htin.toString().split(".");

          try {
            lnHrHora = parseInt(lmHrHora[0]);
          } catch (error) {}

          try {
            lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
          } catch (error) {}

          ldApHtin.setHours(lnHrHora, lnHrMnto);
        }
      } catch (error) {}

      lnHrHora = 0;
      lnHrMnto = 0;

      try {
        if (parseFloat(gmWkRsqlCAB[i].ap_hter) > 0) {
          ldApHter = new Date(ldApData);

          lmHrHora = gmWkRsqlCAB[i].ap_hter.toString().split(".");

          try {
            lnHrHora = parseInt(lmHrHora[0]);
          } catch (error) {}

          try {
            lnHrMnto = parseInt(lmHrHora[1].padEnd(2, "0"));
          } catch (error) {}

          ldApHter.setHours(lnHrHora, lnHrMnto);
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

      lmApRcso.push({
        ap_data: gmWkRsqlCAB[i].ap_data,
        fu_empr: gmWkRsqlCAB[i].fu_empr,
        id_matr: gmWkRsqlCAB[i].id_matr,
        ap_hent: gmWkRsqlCAB[i].ap_hent,
        ap_jdms: lnApJmms + lnApJtms,
        id_ords: parseInt(gmWkRsqlCAB[i].id_ords),
      });
    }
  }

  if (lnHrExtr == 1) {
    lmApRcso.sort(dynamicSort("ap_hent"));

    lnApJdms = 0;
    lnAxJdms = 0;

    for (var i = 0; i < lmApRcso.length; i++) {
      lnAxJdms += lmApRcso[i].ap_jdms;

      if (parseInt(loApApnt.id_ords) == parseInt(lmApRcso[i].id_ords)) {
        lnApJdms += lmApRcso[i].ap_jdms;
      }

      if (parseFloat(loApApnt.ap_hent) == parseFloat(lmApRcso[i].ap_hent)) {
        try {
          if (
            parseInt(lmApRcso[i].id_ords) == parseInt(lmApRcso[i + 1].id_ords)
          ) {
            if (llHrMnto) {
              return "";
            } else {
              return 0;
            }
          }
        } catch (error) {}

        if (lnJoMnts < parseInt(Math.floor(lnAxJdms / 60000))) {
          if (lnAxJdms - lnApJdms == 0) {
            if (llHrMnto) {
              return (
                pad(
                  Math.floor(
                    (parseInt(Math.floor(lnApJdms / 60000)) - lnJoMnts) / 60
                  ),
                  2
                ) +
                ":" +
                pad(
                  parseInt(
                    (parseInt(Math.floor(lnApJdms / 60000)) - lnJoMnts) % 60
                  ),
                  2
                )
              );
            } else {
              return (
                parseInt(Math.floor(lnApJdms / 60000)) - lnJoMnts
              ).toString();
            }
          }

          if (parseInt(Math.floor((lnAxJdms - lnApJdms) / 60000)) < lnJoMnts) {
            if (llHrMnto) {
              return (
                pad(
                  Math.floor(
                    (parseInt(Math.floor(lnAxJdms / 60000)) - lnJoMnts) / 60
                  ),
                  2
                ) +
                ":" +
                pad(
                  parseInt(
                    (parseInt(Math.floor(lnAxJdms / 60000)) - lnJoMnts) % 60
                  ),
                  2
                )
              );
            } else {
              return (
                parseInt(Math.floor(lnAxJdms / 60000)) - lnJoMnts
              ).toString();
            }
          } else {
            if (llHrMnto) {
              return (
                pad(
                  Math.floor(parseInt(Math.floor(lnApJdms / 60000)) / 60),
                  2
                ) +
                ":" +
                pad(parseInt(parseInt(Math.floor(lnApJdms / 60000)) % 60), 2)
              );
            } else {
              return parseInt(Math.floor(lnApJdms / 60000)).toString();
            }
          }
        } else {
          if (llHrMnto) {
            return "";
          } else {
            return 0;
          }
        }
      }
    }
  } else if (lnHrExtr == 3) {
    if (lnApJdms > 0) {
      if (llHrMnto) {
        return (
          pad(parseInt(Math.floor(lnApJdms / (1000 * 60 * 60))), 2) +
          ":" +
          pad(parseInt((lnApJdms % (1000 * 60 * 60)) / (1000 * 60)), 2)
        );
      } else {
        return (lnApJdms / (1000 * 60)).toString();
      }
    } else {
      return "";
    }
  } else if (lnHrExtr == 4) {
    if (lnAdMnts > 0) {
      if (llHrMnto) {
        return (
          pad(parseInt(Math.floor(lnAdMnts / 60)), 2) +
          ":" +
          pad(parseInt(lnAdMnts % 60), 2)
        );
      } else {
        return lnAdMnts.toString();
      }
    } else {
      return "";
    }
  } else if (lnHrExtr == 0) {
    lmApRcso.sort(dynamicSort("ap_hent"));

    lnApJdms = 0;
    lnAxJdms = 0;

    for (var i = 0; i < lmApRcso.length; i++) {
      lnAxJdms += lmApRcso[i].ap_jdms;

      if (parseInt(loApApnt.id_ords) == parseInt(lmApRcso[i].id_ords)) {
        lnApJdms += lmApRcso[i].ap_jdms;
      }

      if (parseFloat(loApApnt.ap_hent) == parseFloat(lmApRcso[i].ap_hent)) {
        try {
          if (
            parseInt(lmApRcso[i].id_ords) == parseInt(lmApRcso[i + 1].id_ords)
          ) {
            if (llHrMnto) {
              return "";
            } else {
              return 0;
            }
          }
        } catch (error) {}

        if (lnJoMnts < parseInt(Math.floor(lnAxJdms / 60000))) {
          if (lnAxJdms - lnApJdms == 0) {
            if (llHrMnto) {
              return (
                pad(Math.floor(lnJoMnts / 60), 2) +
                ":" +
                pad(parseInt(lnJoMnts % 60), 2)
              );
            } else {
              return lnJoMnts.toString();
            }
          }

          if (parseInt(Math.floor((lnAxJdms - lnApJdms) / 60000)) < lnJoMnts) {
            if (llHrMnto) {
              return (
                pad(
                  Math.floor(
                    (lnJoMnts -
                      parseInt(Math.floor((lnAxJdms - lnApJdms) / 60000))) /
                      60
                  ),
                  2
                ) +
                ":" +
                pad(
                  parseInt(
                    (lnJoMnts -
                      parseInt(Math.floor((lnAxJdms - lnApJdms) / 60000))) %
                      60
                  ),
                  2
                )
              );
            } else {
              return (
                lnJoMnts - parseInt(Math.floor(lnAxJdms - lnApJdms) / 60000)
              ).toString();
            }
          } else {
            if (llHrMnto) {
              return "";
            } else {
              return 0;
            }
          }
        } else {
          if (llHrMnto) {
            return (
              pad(Math.floor(parseInt(Math.floor(lnApJdms / 60000)) / 60), 2) +
              ":" +
              pad(parseInt(parseInt(Math.floor(lnApJdms / 60000)) % 60), 2)
            );
          } else {
            return parseInt(Math.floor(lnApJdms / 60000)).toString();
          }
        }
      }
    }
  } else {
    if (lnApJdms > 0) {
      if (lnJoMnts > 0 && lnJoMnts < parseInt(Math.floor(lnApJdms / 60000))) {
        if (llHrMnto) {
          return (
            pad(Math.floor(lnJoMnts / 60), 2) +
            ":" +
            pad(parseInt(lnJoMnts % 60), 2)
          );
        } else {
          return lnJoMnts.toString();
        }
      } else {
        if (llHrMnto) {
          return (
            pad(parseInt(Math.floor(lnApJdms / (1000 * 60 * 60))), 2) +
            ":" +
            pad(parseInt((lnApJdms % (1000 * 60 * 60)) / (1000 * 60)), 2)
          );
        } else {
          return (lnApJdms / (1000 * 60)).toString();
        }
      }
    } else {
      return "";
    }
  }
}

function montaRecursosApontadosCAB() {
  var loUlApnt = document.getElementById("uulApntCAB");
  var lcWkRsql = "",
    lcVhClor = "",
    lcOsHext = "",
    lcOsHnot = "",
    lcOsHdom = "";
  var lnFuVlhr = 0,
    lnIdDsem = 0,
    lnJoMnts = 0,
    lnIdOrds = 0,
    lnOsHdom = 0,
    lnOsHext = 0,
    lnOsHnot = 0,
    lnOsHdrs = 0,
    lnOsHers = 0,
    lnOsHnrs = 0;
  var llIdOrds = false;

  try {
    for (var i = 0; i < gmWkRsqlCAB.length; i++) {
      llIdOrds = false;
      lnFuVlhr = 0;
      lcVhClor = "";
      lnIdOrds = parseInt(gmWkRsqlCAB[i].id_ords);

      for (var j = 0; j < gmOsLctoCAB.length; j++) {
        if (
          parseInt(gmOsLctoCAB[j].id_ords) == lnIdOrds &&
          parseInt(gmOsLctoCAB[j].os_chck) > 0
        ) {
          lnOsHdom = parseInt(gmOsLctoCAB[j].os_hdom);
          lnOsHext = parseInt(gmOsLctoCAB[j].os_hext);
          lnOsHnot = parseInt(gmOsLctoCAB[j].os_hnot);
          lnOsHdrs = parseInt(gmOsLctoCAB[j].os_hdrs);
          lnOsHers = parseInt(gmOsLctoCAB[j].os_hers);
          lnOsHnrs = parseInt(gmOsLctoCAB[j].os_hnrs);

          llIdOrds = true;

          break;
        }
      }

      if (llIdOrds) {
        for (var j = 0; j < gmOsVhfuCAB.length; j++) {
          if (gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() == "EQP") {
            if (
              gmOsVhfuCAB[j].fu_deno.trim().toUpperCase() ==
                gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() &&
              parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds
            ) {
              lnFuVlhr = parseFloat(gmOsVhfuCAB[j].fu_vlhr);

              break;
            }
          } else {
            if (
              gmOsVhfuCAB[j].fu_deno.trim().toUpperCase() ==
                gmWkRsqlCAB[i].fu_func.trim().toUpperCase() &&
              parseInt(gmOsVhfuCAB[j].id_ords) == lnIdOrds
            ) {
              lnFuVlhr = parseFloat(gmOsVhfuCAB[j].fu_vlhr);

              break;
            }
          }
        }

        if (lnFuVlhr == 0) {
          lcVhClor = " style='background-color: rgba( 255, 0, 0, 0.25 );'";
        }

        lnIdDsem = stringDataParaObjetoData(
          jsonDate(gmWkRsqlCAB[i].ap_data)
        ).getDay();

        for (var j = 0; j < gmOsJornCAB.length; j++) {
          if (
            parseInt(gmOsJornCAB[j].id_dsem) == lnIdDsem + 1 &&
            parseInt(gmOsJornCAB[j].id_ords) == lnIdOrds
          ) {
            lnJoMnts = parseInt(gmOsJornCAB[j].jo_mnts);

            break;
          }
        }

        if (lnJoMnts > 0) {
          if (parseInt(gmWkRsqlCAB[i].ap_feri) > 0) {
            if (lnOsHdrs > 0) {
              //prettier-ignore
              lcOsHdom =
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>evento</div>" +
                          "<div class='item-after'>H./" + brMoney(lnOsHdrs) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total hrs</div>" +
                          "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnFuVlhr + lnOsHdrs) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), 0, false, lnOsHdrs)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
            } else {
              //prettier-ignore
              lcOsHdom =
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>evento</div>" +
                          "<div class='item-after'>H./" + lnOsHdom.toString() + "%</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total hrs</div>" +
                          "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnFuVlhr * (1 + lnOsHdom / 100)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), lnOsHdom, false, 0)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
            }

            //prettier-ignore
            lcWkRsql += 
            "<li class='accordion-item'" + lcVhClor + ">" +
              "<a href='#' class='item-content item-link'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title'><b>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</b></div>" +
                  "<div class='item-after'><b>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</b></div>" +
                "</div>" +
              "</a>" +
              "<div class='accordion-item-content'>" +
                "<div class='list'>" +
                  "<ul" + lcVhClor + ">" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>proposta</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].os_nume.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>data</div>" +
                          "<div class='item-after'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>tipo</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>recurso</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>função</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    lcOsHdom +
                  "</ul>" +
                "</div>" +
              "</div>" +
            "</li>";
          } else {
            if (
              calculaHorasCAB(gmWkRsqlCAB[i], 0, true).trim().length > 0 &&
              calculaHorasCAB(gmWkRsqlCAB[i], 0, true).trim().toUpperCase() !=
                "00:00"
            ) {
              //prettier-ignore
              lcWkRsql += 
            "<li class='accordion-item'" + lcVhClor + ">" +
              "<a href='#' class='item-content item-link'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title'><b>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</b></div>" +
                  "<div class='item-after'><b>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</b></div>" +
                "</div>" +
              "</a>" +
              "<div class='accordion-item-content'>" +
                "<div class='list'>" +
                  "<ul" + lcVhClor + ">" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>proposta</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].os_nume.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>data</div>" +
                          "<div class='item-after'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>tipo</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>recurso</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>função</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>evento</div>" +
                          "<div class='item-after'>H./NORMAL</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total hrs</div>" +
                          "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 0, true) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnFuVlhr) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 0, true), 0, false, 0)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                  "</ul>" +
                "</div>" +
              "</div>" +
            "</li>";
            }

            if (
              calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().length > 0 &&
              calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().toUpperCase() !=
                "00:00"
            ) {
              if (lnOsHers > 0) {
                //prettier-ignore
                lcOsHext =
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>evento</div>" +
                        "<div class='item-after'>H./" + brMoney(lnOsHers) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>total hrs</div>" +
                        "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>valor unit.</div>" +
                        "<div class='item-after'>" + brMoney(lnFuVlhr + lnOsHers) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>total</div>" +
                        "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), 0, false, lnOsHers)) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>";
              } else {
                //prettier-ignore
                lcOsHext =
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>evento</div>" +
                        "<div class='item-after'>H./" + lnOsHext.toString() + "%</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>total hrs</div>" +
                        "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>valor unit.</div>" +
                        "<div class='item-after'>" + brMoney(lnFuVlhr * (1 + lnOsHext / 100)) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>total</div>" +
                        "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), lnOsHext, false, 0)) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>";
              }

              //prettier-ignore
              lcWkRsql += 
            "<li class='accordion-item'" + lcVhClor + ">" +
              "<a href='#' class='item-content item-link'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title'><b>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</b></div>" +
                  "<div class='item-after'><b>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</b></div>" +
                "</div>" +
              "</a>" +
              "<div class='accordion-item-content'>" +
                "<div class='list'>" +
                  "<ul" + lcVhClor + ">" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>proposta</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].os_nume.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>data</div>" +
                          "<div class='item-after'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>tipo</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>recurso</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>função</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    lcOsHext +
                  "</ul>" +
                "</div>" +
              "</div>" +
            "</li>";
            }
          }
        } else {
          if (parseInt(gmWkRsqlCAB[i].ap_feri) > 0 || lnIdDsem == 0) {
            if (lnOsHdrs > 0) {
              //prettier-ignore
              lcOsHdom =
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>evento</div>" +
                          "<div class='item-after'>H./" + brMoney(lnOsHdrs) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total hrs</div>" +
                          "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnFuVlhr + lnOsHdrs) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), 0, false, lnOsHdrs)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
            } else {
              //prettier-ignore
              lcOsHdom =
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>evento</div>" +
                          "<div class='item-after'>H./" + lnOsHdom.toString() + "%</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total hrs</div>" +
                          "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 3, true) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnFuVlhr * (1 + lnOsHdom / 100)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 3, true), lnOsHdom, false, 0)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
            }

            //prettier-ignore
            lcWkRsql += 
            "<li class='accordion-item'" + lcVhClor + ">" +
              "<a href='#' class='item-content item-link'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title'><b>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</b></div>" +
                  "<div class='item-after'><b>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</b></div>" +
                "</div>" +
              "</a>" +
              "<div class='accordion-item-content'>" +
                "<div class='list'>" +
                  "<ul" + lcVhClor + ">" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>proposta</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].os_nume.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>data</div>" +
                          "<div class='item-after'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>tipo</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>recurso</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>função</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    lcOsHdom +
                  "</ul>" +
                "</div>" +
              "</div>" +
            "</li>";
          } else {
            if (
              calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().length > 0 &&
              calculaHorasCAB(gmWkRsqlCAB[i], 1, true).trim().toUpperCase() !=
                "00:00"
            ) {
              if (lnOsHers > 0) {
                //prettier-ignore
                lcOsHext =
                  "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>evento</div>" +
                          "<div class='item-after'>H./" + brMoney(lnOsHers) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total hrs</div>" +
                          "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnFuVlhr + lnOsHers) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), 0, false, lnOsHers)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
              } else {
                //prettier-ignore
                lcOsHext =
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>evento</div>" +
                        "<div class='item-after'>H./" + lnOsHext.toString() + "%</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>total hrs</div>" +
                        "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 1, true) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>valor unit.</div>" +
                        "<div class='item-after'>" + brMoney(lnFuVlhr * (1 + lnOsHext / 100)) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>" +
                  "<li>" +
                    "<div class='item-content'>" +
                      "<div class='item-inner'>" +
                        "<div class='item-title'>total</div>" +
                        "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 1, true), lnOsHext, false, 0)) + "</div>" +
                      "</div>" +
                    "</div>" +
                  "</li>";
              }

              //prettier-ignore
              lcWkRsql += 
            "<li class='accordion-item'" + lcVhClor + ">" +
              "<a href='#' class='item-content item-link'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title'><b>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</b></div>" +
                  "<div class='item-after'><b>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</b></div>" +
                "</div>" +
              "</a>" +
              "<div class='accordion-item-content'>" +
                "<div class='list'>" +
                  "<ul" + lcVhClor + ">" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>proposta</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].os_nume.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>data</div>" +
                          "<div class='item-after'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>tipo</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>recurso</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>função</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    lcOsHext +
                  "</ul>" +
                "</div>" +
              "</div>" +
            "</li>";
            }
          }
        }

        if (
          calculaHorasCAB(gmWkRsqlCAB[i], 4, true).trim().length > 0 &&
          calculaHorasCAB(gmWkRsqlCAB[i], 4, true).trim().toUpperCase() !=
            "00:00"
        ) {
          if (lnOsHnrs > 0) {
            //prettier-ignore
            lcOsHnot =
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnOsHnrs) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 4, false), 0, true, lnOsHnrs)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
          } else {
            //prettier-ignore
            lcOsHnot =
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>valor unit.</div>" +
                          "<div class='item-after'>" + brMoney(lnFuVlhr * (lnOsHnot / 100)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total</div>" +
                          "<div class='item-after'>" + brMoney(calculaValorTotalHorasCAB(lnFuVlhr, calculaHorasCAB(gmWkRsqlCAB[i], 4, false), lnOsHnot, true, 0)) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>";
          }

          //prettier-ignore
          lcWkRsql += 
            "<li class='accordion-item'" + lcVhClor + ">" +
              "<a href='#' class='item-content item-link'>" +
                "<div class='item-inner'>" +
                  "<div class='item-title'><b>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</b></div>" +
                  "<div class='item-after'><b>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</b></div>" +
                "</div>" +
              "</a>" +
              "<div class='accordion-item-content'>" +
                "<div class='list'>" +
                  "<ul" + lcVhClor + ">" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>proposta</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].os_nume.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>data</div>" +
                          "<div class='item-after'>" + jsonDate(gmWkRsqlCAB[i].ap_data) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>tipo</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].cb_tmdo.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>recurso</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_nome.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>função</div>" +
                          "<div class='item-after'>" + gmWkRsqlCAB[i].fu_func.trim().toUpperCase() + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>evento</div>" +
                          "<div class='item-after'>AD. NOT.</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    "<li>" +
                      "<div class='item-content'>" +
                        "<div class='item-inner'>" +
                          "<div class='item-title'>total hrs</div>" +
                          "<div class='item-after'>" + calculaHorasCAB(gmWkRsqlCAB[i], 4, true) + "</div>" +
                        "</div>" +
                      "</div>" +
                    "</li>" +
                    lcOsHnot +
                  "</ul>" +
                "</div>" +
              "</div>" +
            "</li>";
        }
      }
    }
  } catch (error) {}

  loUlApnt.innerHTML = lcWkRsql;
}

function pesquisaRecursosApontadosOrdensServicoCAB() {
  var loDtDtde = document.getElementById("datDtdeCAB");
  var loDtDtat = document.getElementById("datDtatCAB");
  var loSlObra = document.getElementById("sltObraCAB");
  var lcWkIsql = "",
    lcApDtde = "",
    lcApDtat = "",
    lcIdOrds = "";
  var lmWkIsql = [],
    lmIdOrds = [];
  var lnIdClie = 0;
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    return;
  }

  try {
    lmIdOrds = app.smartSelect.get(".clsOrdsCAB").getValue();
  } catch (error) {}

  if (lmIdOrds.length == 0) {
    return;
  }

  if (loDtDtde.value.toString().trim().length > 0) {
    lcApDtde = loDtDtde.value.toString().trim();
  } else {
    return;
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcApDtat = loDtDtat.value.toString().trim();
  } else {
    return;
  }

  if (htmlDataParaObjetoData(lcApDtde) > htmlDataParaObjetoData(lcApDtat)) {
    return;
  }

  if (htmlDataParaObjetoData(lcApDtat) > ldDtHoje) {
    return;
  }

  for (var i = 0; i < lmIdOrds.length; i++) {
    lcIdOrds += lmIdOrds[i].trim().toUpperCase() + "|";
  }

  lcIdOrds = lcIdOrds.slice(0, -1);

  //alteração, para pegar todas as propostas, para calculo correto das horas extras
  lcIdOrds = "";

  for (var i = 0; i < gmOsLctoCAB.length; i++) {
    // if (parseInt(gmOsLctoCAB[i].os_tipo) != 1) {
    lcIdOrds += gmOsLctoCAB[i].id_ords.toString() + "|";
    // }
  }

  lcIdOrds = lcIdOrds.slice(0, -1);

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: lnIdClie },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
    { pa_nome: "ldApData", pa_tipo: "SmallDatetime", pa_valo: null },
    { pa_nome: "ldApDtde", pa_tipo: "SmallDatetime", pa_valo: lcApDtde },
    { pa_nome: "ldApDtat", pa_tipo: "SmallDatetime", pa_valo: lcApDtat },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  limpaCamposCAB();

  app.dialog.preloader("carregando apontamentos...");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaRecursosApontadosOrdensServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      gmWkRsqlCAB = lmWkRsql;

      for (var i = 0; i < gmOsLctoCAB.length; i++) {
        gmOsLctoCAB[i].os_chck = 0;
      }

      for (var i = 0; i < gmOsLctoCAB.length; i++) {
        for (var j = 0; j < lmIdOrds.length; j++) {
          if (parseInt(gmOsLctoCAB[i].id_ords) == parseInt(lmIdOrds[j])) {
            gmOsLctoCAB[i].os_chck = 1;
          }
        }
      }

      montaRecursosApontadosCAB();
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function pesquisaValoresHoraFuncaoOrdensServicoCAB() {
  var lcWkIsql = "",
    lcIdOrds = "";
  var lmWkIsql = [],
    lmIdOrds = [];

  try {
    lmIdOrds = app.smartSelect.get(".clsOrdsCAB").getValue();
  } catch (error) {}

  if (lmIdOrds.length == 0) {
    return;
  }

  for (var i = 0; i < lmIdOrds.length; i++) {
    lcIdOrds += lmIdOrds[i].trim().toUpperCase() + "|";
  }

  lcIdOrds = lcIdOrds.slice(0, -1);

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  gmOsVhfuCAB = [];

  app.dialog.preloader("carregando valores por função...");

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaValoresHoraFuncaoOrdensServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      app.dialog.close();

      gmOsVhfuCAB = lmWkRsql;

      pesquisaRecursosApontadosOrdensServicoCAB();
    },
    error: function (jqXHR, textStatus, err) {
      app.dialog.close();
    },
  });
}

function validaCamposCAB() {
  var loDtDtde = document.getElementById("datDtdeCAB");
  var loDtDtat = document.getElementById("datDtatCAB");
  var loSlObra = document.getElementById("sltObraCAB");
  var lcApDtde = "",
    lcApDtat = "";
  var lnIdClie = 0;
  var llCpAlrt = false;
  var ldDtHoje = new Date();
  var lmIdOrds = [];

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtDtde.value.toString().trim().length > 0) {
    lcApDtde = loDtDtde.value.toString().trim();
  } else {
    app.input.validate(loDtDtde);

    llCpAlrt = true;
  }

  if (loDtDtat.value.toString().trim().length > 0) {
    lcApDtat = loDtDtat.value.toString().trim();
  } else {
    app.input.validate(loDtDtat);

    llCpAlrt = true;
  }

  if (llCpAlrt) {
    return false;
  }

  if (htmlDataParaObjetoData(lcApDtde) > htmlDataParaObjetoData(lcApDtat)) {
    alerta("data inicial maior que data final", "alerta");

    return false;
  }

  if (htmlDataParaObjetoData(lcApDtat) > ldDtHoje) {
    alerta("data final maior que data atual", "alerta");

    return false;
  }

  try {
    if (parseInt(loSlObra.value.toString().split("/")[0].trim()) > 0) {
      lnIdClie = parseInt(loSlObra.value.toString().split("/")[0].trim());
    }
  } catch (error) {}

  if (lnIdClie == 0) {
    alerta("obra inválida", "alerta");

    return false;
  }

  try {
    lmIdOrds = app.smartSelect.get(".clsOrdsCAB").getValue();
  } catch (error) {}

  if (lmIdOrds.length == 0) {
    alerta("proposta inválida", "alerta");

    return false;
  }

  return true;
}

function pesquisaJornadaOrdensServicoCAB() {
  var lcWkIsql = "",
    lcIdOrds = "";
  var lmWkIsql = [],
    lmIdOrds = [];

  if (!validaCamposCAB()) {
    return;
  }

  try {
    lmIdOrds = app.smartSelect.get(".clsOrdsCAB").getValue();
  } catch (error) {}

  for (var i = 0; i < lmIdOrds.length; i++) {
    lcIdOrds += lmIdOrds[i].trim().toUpperCase() + "|";
  }

  lcIdOrds = lcIdOrds.slice(0, -1);

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdOrds", pa_tipo: "VarChar", pa_valo: lcIdOrds },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  gmOsJornCAB = [];

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaJornadaOrdensServico",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmOsJornCAB = lmWkRsql;

      pesquisaValoresHoraFuncaoOrdensServicoCAB();
    },
    error: function (jqXHR, textStatus, err) {
      pesquisaValoresHoraFuncaoOrdensServicoCAB();
    },
  });
}

function pesquisaPropostasCAB() {
  var loSlObra = document.getElementById("sltObraCAB");
  var loOgOrds = {};
  var lnIdCadt = 0;
  var lcWkIsql = "",
    lcWkRsql = "";
  var lmWkIsql = [];

  limpaCamposOrdemServicoCAB();

  try {
    if (parseInt(loSlObra.value.toString().split("/")[1].trim()) > 0) {
      lnIdCadt = parseInt(loSlObra.value.toString().split("/")[1].trim());
    }
  } catch (error) {}

  if (lnIdCadt == 0) {
    return;
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdCadt", pa_tipo: "Int", pa_valo: lnIdCadt },
    { pa_nome: "lcOsNume", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsResp", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsDesc", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcli", pa_tipo: "VarChar", pa_valo: null },
    { pa_nome: "lcOsNcon", pa_tipo: "VarChar", pa_valo: null },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaPropostas",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      loOgOrds = document.getElementById("ogrOrdsCAB");

      gmOsLctoCAB = lmWkRsql;

      try {
        for (var i = 0; i < gmOsLctoCAB.length; i++) {
          gmOsLctoCAB[i]["os_chck"] = 0;
          gmOsLctoCAB[i]["pq_cadt"] = lnIdCadt;

          if (parseInt(gmOsLctoCAB[i].os_tipo) != 1) {
            //prettier-ignore
            lcWkRsql += "<option value='" + gmOsLctoCAB[i].id_ords.toString() + "'>" + gmOsLctoCAB[i].os_nume.trim().toUpperCase() + " - " + gmOsLctoCAB[i].os_desc.trim().toUpperCase() + "</option>";
          }
        }
      } catch (loApErro) {}

      loOgOrds.innerHTML = lcWkRsql;
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function limpaCamposOrdemServicoCAB() {
  var loLiOrds = document.getElementById("lliOrdsCAB");

  gmOsLctoCAB = [];

  //prettier-ignore
  loLiOrds.innerHTML =
    "<a class='item-link smart-select smart-select-init clsOrdsCAB' data-open-in='popup' data-searchbar='true' data-searchbar-placeholder='pesquisa de propostas'>" +
      "<select multiple>" +
        "<optgroup id='ogrOrdsCAB' label='propostas'></optgroup>" +
      "</select>" +
      "<div class='item-content'>" +
        "<div class='item-inner'>" +
          "<div class='item-title'>propostas</div>" +
        "</div>" +
      "</div>" +
    "</a>";
}

function pesquisaObrasCAB() {
  var loSlObra = document.getElementById("sltObraCAB");
  var lcWkRsql = "<option value='0/0'></option>",
    lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlObra.disabled = true;

  loSlObra.innerHTML = "<option value='0/0'>CARREGANDO OBRAS...</option>";

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

function limpaCamposCAB() {
  var loUlApnt = document.getElementById("uulApntCAB");

  gmWkRsqlCAB = [];

  loUlApnt.innerHTML = "";
}

function ComlApBmsv() {
  var loAhVisu = document.getElementById("ahrVisuCAB");
  var loDtDtde = document.getElementById("datDtdeCAB");
  var loDtDtat = document.getElementById("datDtatCAB");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  limpaCamposCAB();

  if (isMobile()) {
    loAhVisu.style.display = "none";
  }

  loDtDtat.valueAsDate = ldDtHoje;

  ldDtHoje.setDate(ldDtHoje.getDate() - 15);

  loDtDtde.valueAsDate = ldDtHoje;

  pesquisaObrasCAB();
}
