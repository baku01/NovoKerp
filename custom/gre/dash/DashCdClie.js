var gmDsObraDCC = [],
  gmApDvrgDCC = [],
  gmApPndtDCC = [],
  gmAhHrprDCC = [];

function alteraDataPosicaoDCC() {
  var loDtData = document.getElementById("datDataDCC");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  if (loDtData.defaultValue == loDtData.value) {
    return;
  }

  if (loDtData.value.toString().trim().length == 0) {
    loDtData.valueAsDate = ldDtHoje;
  }

  if (ldDtHoje < htmlDataParaObjetoData(loDtData.value)) {
    loDtData.valueAsDate = ldDtHoje;
  }

  pesquisaDashboardObrasDCC();
}

function pesquisaDashboardPropostasDCC(lcCdClie) {
  var loCdClie = JSON.parse(unescape(lcCdClie));

  sessionStorage.setItem("soCdClie", JSON.stringify(loCdClie));

  redireciona("custom/gre/dash/DashOsLcto.html", "DashOsLcto.html");
}

function montaDashboardDCC() {
  var loSlHora = document.getElementById("sltHoraDCC");
  var loDvObra = document.getElementById("divObraDCC");
  var lnOsPhcn = 0,
    lnOsPhtr = 0,
    lnReHrap = 0,
    lnReHtap = 0,
    lnOpQthr = 0,
    lnApDvrg = 0,
    lnApPndt = 0,
    lnApTota = 0,
    lnPrPndt = 0,
    lnRoPndt = 0,
    lnRoTota = 0,
    lnPrRdop = 0,
    lnAhMinu = 0;
  var lcGrClor = "",
    lcWkRsql = "",
    lcDiGaug = "",
    lcDiGau1 = "",
    lcDiGau2 = "",
    lcSlHora = loSlHora.value.toString().trim().toLowerCase(),
    lcBdThpo = "";
  var lmDsObra = JSON.parse(JSON.stringify(gmDsObraDCC));

  if (lcSlHora.trim().toUpperCase() == "OC_QTHR") {
    lcBdThpo = "hras orçadas:";
  } else {
    lcBdThpo = "hras plan.:";
  }

  if (isMobile()) {
    //prettier-ignore
    for (var i = 0; i < lmDsObra.length; i = i + 2) {
      lnOpQthr = 0;
      lnApDvrg = 0;
      lnApPndt = 0;
      lnApTota = 0;
      lnPrPndt = 0;      
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        if (parseInt(lmDsObra[i + 1][lcSlHora]) > 0) {
          lnOpQthr = parseInt(lmDsObra[i + 1][lcSlHora]);
        }
      } catch (error) {}

      try {        
        for (var j = 0; j < gmApDvrgDCC.length; j++) {
          if (parseInt(gmApDvrgDCC[j].id_cadt) == parseInt(lmDsObra[i + 1].id_cadt)) {
            lnApDvrg = parseInt(gmApDvrgDCC[j].qt_dvrg);
            
            break;
          }
        }

        for (var j = 0; j < gmApPndtDCC.length; j++) {
          if (parseInt(gmApPndtDCC[j].id_cadt) == parseInt(lmDsObra[i + 1].id_cadt)) {
            lnApPndt = parseInt(gmApPndtDCC[j].qt_pndt);
            lnApTota = parseInt(gmApPndtDCC[j].qt_tota);
            lnPrPndt = (lnApPndt / lnApTota) * 100;
            
            break;
          }
        }
            
        lnRoPndt = parseInt(lmDsObra[i + 1].cl_qrdo) - parseInt(lmDsObra[i + 1].cl_qaro);
        lnRoTota = parseInt(lmDsObra[i + 1].cl_qrdo);

        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        }

        lcDiGaug = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;' onclick='pesquisaDashboardPropostasDCC(\"" + escape(JSON.stringify(lmDsObra[i + 1])) + "\");'>" +
            "<br /><b>" + lmDsObra[i + 1].cl_fant.trim().toUpperCase() + "</b><br /><br />" +
            "<div class='gauge clsTr" + lmDsObra[i + 1].id_clie.toString() + "DCC'></div><br />" +
            "<div class='gauge clsCl" + lmDsObra[i + 1].id_clie.toString() + "DCC'></div><br />" +
            "<b>" + lcBdThpo + "</b> " + lnOpQthr.toString() + ":00" + "<br />" + 
            "<b>último:</b> " + jsonDate(lmDsObra[i + 1].ap_data) + "<br />" + 
            "<b>apt. dvrgnt.:</b> " + lnApDvrg.toString() + "<br />" + 
            "<b>apt. pend.:</b> " + lnApPndt.toString() + " / " + lnApTota.toString() + " = " + brDecimal(lnPrPndt) + "%<br />" + 
            "<b>rdo pend.:</b> " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br />" + 
            "<b>desvio anterior:</b> " + brDecimal(lmDsObra[i + 1].cl_dant) + "%<br />" + 
            "<b>avanço:</b> " + brDecimal(lmDsObra[i + 1].cl_pavc) + "%<br />" + 
            "<b>data avanço:</b> " + jsonDate(lmDsObra[i + 1].cl_dsac) + "<br />" + 
            "<b>avanço plan.:</b> " + brDecimal(lmDsObra[i + 1].cl_papl) + "%<br />" + 
            "<b>desvio:</b> " + brDecimal(lmDsObra[i + 1].cl_pavc - lmDsObra[i + 1].cl_papl) + "%<br />" + 
            "<b>mod:</b> " + lmDsObra[i + 1].qt_modi.toString() + "<br />" + 
            // "<b>mod atualização:</b> " + lmDsObra[i + 1].cl_modp.toString() + "<br />" + 
            "<b>mod atualização:</b> " + lmDsObra[i + 1].qt_moda.toString() + "<br />" + 
            "<b>prev. término:</b> " + jsonDate(lmDsObra[i + 1].cl_dtpt) + "<br />" + 
            "<b>término atualização:</b> " + jsonDate(lmDsObra[i + 1].cl_dttr) + "<br />" + 
            "<b>término plan.:</b> " + jsonDate(lmDsObra[i + 1].cl_dttp) + "<br />" + 
            "<b>encarregado:</b> " + lmDsObra[i + 1].cl_enca.trim().toUpperCase() + "<br />" + 
            "<b>planejador:</b> " + lmDsObra[i + 1].cl_plan.trim().toUpperCase() + "<br />" + 
            "<b>a faturar:</b> " + brDecimal(lmDsObra[i + 1].cl_paft) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGaug = "";
      }

      lnOpQthr = 0;
      lnApDvrg = 0;
      lnApPndt = 0;
      lnApTota = 0;
      lnPrPndt = 0;      
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        if (parseInt(lmDsObra[i][lcSlHora]) > 0) {
          lnOpQthr = parseInt(lmDsObra[i][lcSlHora]);
        }
      } catch (error) {}

      for (var j = 0; j < gmApDvrgDCC.length; j++) {
        if (parseInt(gmApDvrgDCC[j].id_cadt) == parseInt(lmDsObra[i].id_cadt)) {
          lnApDvrg = parseInt(gmApDvrgDCC[j].qt_dvrg);
          
          break;
        }
      }

      for (var j = 0; j < gmApPndtDCC.length; j++) {
        if (parseInt(gmApPndtDCC[j].id_cadt) == parseInt(lmDsObra[i].id_cadt)) {
          lnApPndt = parseInt(gmApPndtDCC[j].qt_pndt);
          lnApTota = parseInt(gmApPndtDCC[j].qt_tota);
          lnPrPndt = (lnApPndt / lnApTota) * 100;
          
          break;
        }
      }
            
      lnRoPndt = parseInt(lmDsObra[i].cl_qrdo) - parseInt(lmDsObra[i].cl_qaro);
      lnRoTota = parseInt(lmDsObra[i].cl_qrdo);

      if (lnRoTota > 0) {
        lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
      }
  
      lcWkRsql += 
        "<div class='row'>" +
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;' onclick='pesquisaDashboardPropostasDCC(\"" + escape(JSON.stringify(lmDsObra[i])) + "\");'>" +
            "<br /><b>" + lmDsObra[i].cl_fant.trim().toUpperCase() + "</b><br /><br />" +
            "<div class='gauge clsTr" + lmDsObra[i].id_clie.toString() + "DCC'></div><br />" +
            "<div class='gauge clsCl" + lmDsObra[i].id_clie.toString() + "DCC'></div><br />" + 
            "<b>" + lcBdThpo + "</b> " + lnOpQthr.toString() + ":00" + "<br />" + 
            "<b>último:</b> " + jsonDate(lmDsObra[i].ap_data) + "<br />" + 
            "<b>apt. dvrgnt.:</b> " + lnApDvrg.toString() + "<br />" + 
            "<b>apt. pend.:</b> " + lnApPndt.toString() + " / " + lnApTota.toString() + " = " + brDecimal(lnPrPndt) + "%<br />" +  
            "<b>rdo pend.:</b> " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br />" + 
            "<b>desvio anterior:</b> " + brDecimal(lmDsObra[i].cl_dant) + "%<br />" + 
            "<b>avanço:</b> " + brDecimal(lmDsObra[i].cl_pavc) + "%<br />" + 
            "<b>data avanço:</b> " + jsonDate(lmDsObra[i].cl_dsac) + "<br />" + 
            "<b>avanço plan.:</b> " + brDecimal(lmDsObra[i].cl_papl) + "%<br />" + 
            "<b>desvio:</b> " + brDecimal(lmDsObra[i].cl_pavc - lmDsObra[i].cl_papl) + "%<br />" + 
            "<b>mod:</b> " + lmDsObra[i].qt_modi.toString() + "<br />" + 
            // "<b>mod atualização:</b> " + lmDsObra[i].cl_modp.toString() + "<br />" + 
            "<b>mod atualização:</b> " + lmDsObra[i].qt_moda.toString() + "<br />" + 
            "<b>prev. término:</b> " + jsonDate(lmDsObra[i].cl_dtpt) + "<br />" + 
            "<b>término atualização:</b> " + jsonDate(lmDsObra[i].cl_dttr) + "<br />" + 
            "<b>término plan.:</b> " + jsonDate(lmDsObra[i].cl_dttp) + "<br />" + 
            "<b>encarregado:</b> " + lmDsObra[i].cl_enca.trim().toUpperCase() + "<br />" + 
            "<b>planejador:</b> " + lmDsObra[i].cl_plan.trim().toUpperCase() + "<br />" + 
            "<b>a faturar:</b> " + brDecimal(lmDsObra[i].cl_paft) + "%<br /><br />" + 
          "</div>" +
          lcDiGaug +
        "</div>" +
        "<br />";
    }
  } else {
    //prettier-ignore
    for (var i = 0; i < lmDsObra.length; i = i + 4) {
      lnOpQthr = 0;
      lnApDvrg = 0;
      lnApPndt = 0;
      lnApTota = 0;
      lnPrPndt = 0;      
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        if (parseInt(lmDsObra[i + 1][lcSlHora]) > 0) {
          lnOpQthr = parseInt(lmDsObra[i + 1][lcSlHora]);
        }
      } catch (error) {}

      try {
        for (var j = 0; j < gmApDvrgDCC.length; j++) {
          if (parseInt(gmApDvrgDCC[j].id_cadt) == parseInt(lmDsObra[i + 1].id_cadt)) {
            lnApDvrg = parseInt(gmApDvrgDCC[j].qt_dvrg);
            
            break;
          }
        }

        for (var j = 0; j < gmApPndtDCC.length; j++) {
          if (parseInt(gmApPndtDCC[j].id_cadt) == parseInt(lmDsObra[i + 1].id_cadt)) {
            lnApPndt = parseInt(gmApPndtDCC[j].qt_pndt);
            lnApTota = parseInt(gmApPndtDCC[j].qt_tota);
            lnPrPndt = (lnApPndt / lnApTota) * 100;
            
            break;
          }
        }
            
        lnRoPndt = parseInt(lmDsObra[i + 1].cl_qrdo) - parseInt(lmDsObra[i + 1].cl_qaro);
        lnRoTota = parseInt(lmDsObra[i + 1].cl_qrdo);

        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        }

        lcDiGaug = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;' onclick='pesquisaDashboardPropostasDCC(\"" + escape(JSON.stringify(lmDsObra[i + 1])) + "\");'>" +
            "<br /><b>" + lmDsObra[i + 1].cl_fant.trim().toUpperCase() + "</b><br /><br />" +
            "<div class='gauge clsTr" + lmDsObra[i + 1].id_clie.toString() + "DCC'></div><br />" +
            "<div class='gauge clsCl" + lmDsObra[i + 1].id_clie.toString() + "DCC'></div><br />" + 
            "<b>" + lcBdThpo + "</b> " + lnOpQthr.toString() + ":00" + "<br />" + 
            "<b>último:</b> " + jsonDate(lmDsObra[i + 1].ap_data) + "<br />" + 
            "<b>apt. dvrgnt.:</b> " + lnApDvrg.toString() + "<br />" + 
            "<b>apt. pend.:</b> " + lnApPndt.toString() + " / " + lnApTota.toString() + " = " + brDecimal(lnPrPndt) + "%<br />" + 
            "<b>rdo pend.:</b> " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br />" + 
            "<b>desvio anterior:</b> " + brDecimal(lmDsObra[i + 1].cl_dant) + "%<br />" + 
            "<b>avanço:</b> " + brDecimal(lmDsObra[i + 1].cl_pavc) + "%<br />" + 
            "<b>data avanço:</b> " + jsonDate(lmDsObra[i + 1].cl_dsac) + "<br />" + 
            "<b>avanço plan.:</b> " + brDecimal(lmDsObra[i + 1].cl_papl) + "%<br />" + 
            "<b>desvio:</b> " + brDecimal(lmDsObra[i + 1].cl_pavc - lmDsObra[i + 1].cl_papl) + "%<br />" + 
            "<b>mod:</b> " + lmDsObra[i + 1].qt_modi.toString() + "<br />" + 
            // "<b>mod atualização:</b> " + lmDsObra[i + 1].cl_modp.toString() + "<br />" + 
            "<b>mod atualização:</b> " + lmDsObra[i + 1].qt_moda.toString() + "<br />" + 
            "<b>prev. término:</b> " + jsonDate(lmDsObra[i + 1].cl_dtpt) + "<br />" + 
            "<b>término atualização:</b> " + jsonDate(lmDsObra[i + 1].cl_dttr) + "<br />" + 
            "<b>término plan.:</b> " + jsonDate(lmDsObra[i + 1].cl_dttp) + "<br />" + 
            "<b>encarregado:</b> " + lmDsObra[i + 1].cl_enca.trim().toUpperCase() + "<br />" + 
            "<b>planejador:</b> " + lmDsObra[i + 1].cl_plan.trim().toUpperCase() + "<br />" + 
            "<b>a faturar:</b> " + brDecimal(lmDsObra[i + 1].cl_paft) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGaug = "";
      }
      
      lnOpQthr = 0;
      lnApDvrg = 0;
      lnApPndt = 0;
      lnApTota = 0;
      lnPrPndt = 0;      
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        if (parseInt(lmDsObra[i + 2][lcSlHora]) > 0) {
          lnOpQthr = parseInt(lmDsObra[i + 2][lcSlHora]);
        }
      } catch (error) {}
      
      try {    
        for (var j = 0; j < gmApDvrgDCC.length; j++) {
          if (parseInt(gmApDvrgDCC[j].id_cadt) == parseInt(lmDsObra[i + 2].id_cadt)) {
            lnApDvrg = parseInt(gmApDvrgDCC[j].qt_dvrg);
            
            break;
          }
        }

        for (var j = 0; j < gmApPndtDCC.length; j++) {
          if (parseInt(gmApPndtDCC[j].id_cadt) == parseInt(lmDsObra[i + 2].id_cadt)) {
            lnApPndt = parseInt(gmApPndtDCC[j].qt_pndt);
            lnApTota = parseInt(gmApPndtDCC[j].qt_tota);
            lnPrPndt = (lnApPndt / lnApTota) * 100;
            
            break;
          }
        }
            
        lnRoPndt = parseInt(lmDsObra[i + 2].cl_qrdo) - parseInt(lmDsObra[i + 2].cl_qaro);
        lnRoTota = parseInt(lmDsObra[i + 2].cl_qrdo);

        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        }

        lcDiGau1 = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;' onclick='pesquisaDashboardPropostasDCC(\"" + escape(JSON.stringify(lmDsObra[i + 2])) + "\");'>" +
            "<br /><b>" + lmDsObra[i + 2].cl_fant.trim().toUpperCase() + "</b><br /><br />" +
            "<div class='gauge clsTr" + lmDsObra[i + 2].id_clie.toString() + "DCC'></div><br />" +
            "<div class='gauge clsCl" + lmDsObra[i + 2].id_clie.toString() + "DCC'></div><br />" + 
            "<b>" + lcBdThpo + "</b> " + lnOpQthr.toString() + ":00" + "<br />" + 
            "<b>último:</b> " + jsonDate(lmDsObra[i + 2].ap_data) + "<br />" + 
            "<b>apt. dvrgnt.:</b> " + lnApDvrg.toString() + "<br />" + 
            "<b>apt. pend.:</b> " + lnApPndt.toString() + " / " + lnApTota.toString() + " = " + brDecimal(lnPrPndt) + "%<br />" + 
            "<b>rdo pend.:</b> " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br />" + 
            "<b>desvio anterior:</b> " + brDecimal(lmDsObra[i + 2].cl_dant) + "%<br />" + 
            "<b>avanço:</b> " + brDecimal(lmDsObra[i + 2].cl_pavc) + "%<br />" + 
            "<b>data avanço:</b> " + jsonDate(lmDsObra[i + 2].cl_dsac) + "<br />" + 
            "<b>avanço plan.:</b> " + brDecimal(lmDsObra[i + 2].cl_papl) + "%<br />" + 
            "<b>desvio:</b> " + brDecimal(lmDsObra[i + 2].cl_pavc - lmDsObra[i + 2].cl_papl) + "%<br />" + 
            "<b>mod:</b> " + lmDsObra[i + 2].qt_modi.toString() + "<br />" + 
            // "<b>mod atualização:</b> " + lmDsObra[i + 2].cl_modp.toString() + "<br />" + 
            "<b>mod atualização:</b> " + lmDsObra[i + 2].qt_moda.toString() + "<br />" + 
            "<b>prev. término:</b> " + jsonDate(lmDsObra[i + 2].cl_dtpt) + "<br />" + 
            "<b>término atualização:</b> " + jsonDate(lmDsObra[i + 2].cl_dttr) + "<br />" + 
            "<b>término plan.:</b> " + jsonDate(lmDsObra[i + 2].cl_dttp) + "<br />" + 
            "<b>encarregado:</b> " + lmDsObra[i + 2].cl_enca.trim().toUpperCase() + "<br />" + 
            "<b>planejador:</b> " + lmDsObra[i + 2].cl_plan.trim().toUpperCase() + "<br />" + 
            "<b>a faturar:</b> " + brDecimal(lmDsObra[i + 2].cl_paft) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGau1 = "";
      }
      
      lnOpQthr = 0;
      lnApDvrg = 0;
      lnApPndt = 0;
      lnApTota = 0;
      lnPrPndt = 0;      
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        if (parseInt(lmDsObra[i + 3][lcSlHora]) > 0) {
          lnOpQthr = parseInt(lmDsObra[i + 3][lcSlHora]);
        }
      } catch (error) {}
      
      try {
        for (var j = 0; j < gmApDvrgDCC.length; j++) {
          if (parseInt(gmApDvrgDCC[j].id_cadt) == parseInt(lmDsObra[i + 3].id_cadt)) {
            lnApDvrg = parseInt(gmApDvrgDCC[j].qt_dvrg);
            
            break;
          }
        }

        for (var j = 0; j < gmApPndtDCC.length; j++) {
          if (parseInt(gmApPndtDCC[j].id_cadt) == parseInt(lmDsObra[i + 3].id_cadt)) {
            lnApPndt = parseInt(gmApPndtDCC[j].qt_pndt);
            lnApTota = parseInt(gmApPndtDCC[j].qt_tota);
            lnPrPndt = (lnApPndt / lnApTota) * 100;
            
            break;
          }
        }
            
        lnRoPndt = parseInt(lmDsObra[i + 3].cl_qrdo) - parseInt(lmDsObra[i + 3].cl_qaro);
        lnRoTota = parseInt(lmDsObra[i + 3].cl_qrdo);

        if (lnRoTota > 0) {
          lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
        }

        lcDiGau2 = 
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;' onclick='pesquisaDashboardPropostasDCC(\"" + escape(JSON.stringify(lmDsObra[i + 3])) + "\");'>" +
            "<br /><b>" + lmDsObra[i + 3].cl_fant.trim().toUpperCase() + "</b><br /><br />" +
            "<div class='gauge clsTr" + lmDsObra[i + 3].id_clie.toString() + "DCC'></div><br />" +
            "<div class='gauge clsCl" + lmDsObra[i + 3].id_clie.toString() + "DCC'></div><br />" + 
            "<b>" + lcBdThpo + "</b> " + lnOpQthr.toString() + ":00" + "<br />" + 
            "<b>último:</b> " + jsonDate(lmDsObra[i + 3].ap_data) + "<br />" + 
            "<b>apt. dvrgnt.:</b> " + lnApDvrg.toString() + "<br />" + 
            "<b>apt. pend.:</b> " + lnApPndt.toString() + " / " + lnApTota.toString() + " = " + brDecimal(lnPrPndt) + "%<br />" +  
            "<b>rdo pend.:</b> " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br />" + 
            "<b>desvio anterior:</b> " + brDecimal(lmDsObra[i + 3].cl_dant) + "%<br />" + 
            "<b>avanço:</b> " + brDecimal(lmDsObra[i + 3].cl_pavc) + "%<br />" + 
            "<b>data avanço:</b> " + jsonDate(lmDsObra[i + 3].cl_dsac) + "<br />" + 
            "<b>avanço plan.:</b> " + brDecimal(lmDsObra[i + 3].cl_papl) + "%<br />" + 
            "<b>desvio:</b> " + brDecimal(lmDsObra[i + 3].cl_pavc - lmDsObra[i + 3].cl_papl) + "%<br />" + 
            "<b>mod:</b> " + lmDsObra[i + 3].qt_modi.toString() + "<br />" + 
            // "<b>mod atualização:</b> " + lmDsObra[i + 3].cl_modp.toString() + "<br />" + 
            "<b>mod atualização:</b> " + lmDsObra[i + 3].qt_moda.toString() + "<br />" + 
            "<b>prev. término:</b> " + jsonDate(lmDsObra[i + 3].cl_dtpt) + "<br />" + 
            "<b>término atualização:</b> " + jsonDate(lmDsObra[i + 3].cl_dttr) + "<br />" + 
            "<b>término plan.:</b> " + jsonDate(lmDsObra[i + 3].cl_dttp) + "<br />" + 
            "<b>encarregado:</b> " + lmDsObra[i + 3].cl_enca.trim().toUpperCase() + "<br />" + 
            "<b>planejador:</b> " + lmDsObra[i + 3].cl_plan.trim().toUpperCase() + "<br />" + 
            "<b>a faturar:</b> " + brDecimal(lmDsObra[i + 3].cl_paft) + "%<br /><br />" + 
          "</div>";
      } catch (error) {
        lcDiGau2 = "";
      }
      
      lnOpQthr = 0;
      lnApDvrg = 0;
      lnApPndt = 0;
      lnApTota = 0;
      lnPrPndt = 0;      
      lnRoPndt = 0;
      lnRoTota = 0;
      lnPrRdop = 0;

      try {
        if (parseInt(lmDsObra[i][lcSlHora]) > 0) {
          lnOpQthr = parseInt(lmDsObra[i][lcSlHora]);
        }
      } catch (error) {}
  
      for (var j = 0; j < gmApDvrgDCC.length; j++) {
        if (parseInt(gmApDvrgDCC[j].id_cadt) == parseInt(lmDsObra[i].id_cadt)) {
          lnApDvrg = parseInt(gmApDvrgDCC[j].qt_dvrg);
          
          break;
        }
      }

      for (var j = 0; j < gmApPndtDCC.length; j++) {
        if (parseInt(gmApPndtDCC[j].id_cadt) == parseInt(lmDsObra[i].id_cadt)) {
          lnApPndt = parseInt(gmApPndtDCC[j].qt_pndt);
          lnApTota = parseInt(gmApPndtDCC[j].qt_tota);
          lnPrPndt = (lnApPndt / lnApTota) * 100;
          
          break;
        }
      }
            
      lnRoPndt = parseInt(lmDsObra[i].cl_qrdo) - parseInt(lmDsObra[i].cl_qaro);
      lnRoTota = parseInt(lmDsObra[i].cl_qrdo);

      if (lnRoTota > 0) {
        lnPrRdop = (lnRoPndt / lnRoTota) * 100; 
      }
      
      lcWkRsql += 
        "<div class='row'>" +
          "<div class='col' style='text-align: center; border: 1px solid; border-radius: 10px;' onclick='pesquisaDashboardPropostasDCC(\"" + escape(JSON.stringify(lmDsObra[i])) + "\");'>" +
            "<br /><b>" + lmDsObra[i].cl_fant.trim().toUpperCase() + "</b><br /><br />" +
            "<div class='gauge clsTr" + lmDsObra[i].id_clie.toString() + "DCC'></div><br />" +
            "<div class='gauge clsCl" + lmDsObra[i].id_clie.toString() + "DCC'></div><br />" + 
            "<b>" + lcBdThpo + "</b> " + lnOpQthr.toString() + ":00" + "<br />" + 
            "<b>último:</b> " + jsonDate(lmDsObra[i].ap_data) + "<br />" + 
            "<b>apt. dvrgnt.:</b> " + lnApDvrg.toString() + "<br />" + 
            "<b>apt. pend.:</b> " + lnApPndt.toString() + " / " + lnApTota.toString() + " = " + brDecimal(lnPrPndt) + "%<br />" +  
            "<b>rdo pend.:</b> " + lnRoPndt.toString() + " / " + lnRoTota.toString() + " = " + brDecimal(lnPrRdop) + "%<br />" + 
            "<b>desvio anterior:</b> " + brDecimal(lmDsObra[i].cl_dant) + "%<br />" + 
            "<b>avanço:</b> " + brDecimal(lmDsObra[i].cl_pavc) + "%<br />" + 
            "<b>data avanço:</b> " + jsonDate(lmDsObra[i].cl_dsac) + "<br />" + 
            "<b>avanço plan.:</b> " + brDecimal(lmDsObra[i].cl_papl) + "%<br />" + 
            "<b>desvio:</b> " + brDecimal(lmDsObra[i].cl_pavc - lmDsObra[i].cl_papl) + "%<br />" + 
            "<b>mod:</b> " + lmDsObra[i].qt_modi.toString() + "<br />" + 
            // "<b>mod atualização:</b> " + lmDsObra[i].cl_modp.toString() + "<br />" + 
            "<b>mod atualização:</b> " + lmDsObra[i].qt_moda.toString() + "<br />" + 
            "<b>prev. término:</b> " + jsonDate(lmDsObra[i].cl_dtpt) + "<br />" + 
            "<b>término atualização:</b> " + jsonDate(lmDsObra[i].cl_dttr) + "<br />" + 
            "<b>término plan.:</b> " + jsonDate(lmDsObra[i].cl_dttp) + "<br />" + 
            "<b>encarregado:</b> " + lmDsObra[i].cl_enca.trim().toUpperCase() + "<br />" + 
            "<b>planejador:</b> " + lmDsObra[i].cl_plan.trim().toUpperCase() + "<br />" + 
            "<b>a faturar:</b> " + brDecimal(lmDsObra[i].cl_paft) + "%<br /><br />" + 
          "</div>" +
          lcDiGaug +
          lcDiGau1 +
          lcDiGau2 +
        "</div>" +
        "<br />";
    }
  }

  loDvObra.innerHTML = lcWkRsql;

  for (var i = 0; i < lmDsObra.length; i++) {
    lnReHrap = 0;
    lnReHtap = 0;
    lnOpQthr = 0;
    lnOsPhcn = 0;
    lnOsPhtr = 0;
    lnAhMinu = 0;
    lcGrClor = "";

    for (var j = 0; j < gmAhHrprDCC.length; j++) {
      if (parseInt(lmDsObra[i].id_clie) == parseInt(gmAhHrprDCC[j].id_clie)) {
        lnAhMinu +=
          Math.floor(gmAhHrprDCC[j].ah_hora) * 60 +
          (parseFloat(gmAhHrprDCC[j].ah_hora) % 1) * 100;
      }
    }

    try {
      if (parseInt(lmDsObra[i].re_hrap) > 0) {
        lnReHrap = parseInt(lmDsObra[i].re_hrap);
      }
    } catch (error) {}

    lnReHrap += Math.floor(lnAhMinu / 60);

    try {
      if (parseInt(lmDsObra[i].re_htap) > 0) {
        lnReHtap = parseInt(lmDsObra[i].re_htap);
      }
    } catch (error) {}

    lnReHtap += Math.floor(lnAhMinu / 60);

    try {
      if (parseInt(lmDsObra[i][lcSlHora]) > 0) {
        lnOpQthr = parseInt(lmDsObra[i][lcSlHora]);
      }
    } catch (error) {}

    if (lnOpQthr == 0) {
      lnOpQthr = 1;
    }

    if (lnOpQthr > 0) {
      lnOsPhcn = (lnReHrap / lnOpQthr) * 100;
    }

    if (lnOpQthr > 0) {
      lnOsPhtr = (lnReHtap / lnOpQthr) * 100;
    }

    if (lnOsPhcn <= 70) {
      lcGrClor = "rgba( 0, 255, 0, 1 )";
    } else if (lnOsPhcn <= 90) {
      lcGrClor = "rgba( 255, 255, 0, 1 )";
    } else if (lnOsPhcn <= 100) {
      lcGrClor = "rgba( 255, 165, 0, 1 )";
    } else {
      lcGrClor = "rgba( 255, 0, 0, 1 )";
    }

    app.gauge.create({
      el: ".clsCl" + lmDsObra[i].id_clie.toString() + "DCC",
      type: "circle",
      value: lnOsPhcn / 100,
      size: 250,
      borderColor: lcGrClor,
      borderWidth: 10,
      valueText: brDecimal(lnOsPhcn) + "%",
      valueFontSize: 35,
      valueTextColor: lcGrClor,
      labelFontSize: 18,
      labelText: "de horas totais consumidas",
    });

    if (lnOsPhtr <= 70) {
      lcGrClor = "rgba( 0, 255, 0, 1 )";
    } else if (lnOsPhtr <= 90) {
      lcGrClor = "rgba( 255, 255, 0, 1 )";
    } else if (lnOsPhtr <= 100) {
      lcGrClor = "rgba( 255, 165, 0, 1 )";
    } else {
      lcGrClor = "rgba( 255, 0, 0, 1 )";
    }

    app.gauge.create({
      el: ".clsTr" + lmDsObra[i].id_clie.toString() + "DCC",
      type: "circle",
      value: lnOsPhtr / 100,
      size: 100,
      borderColor: lcGrClor,
      borderWidth: 5,
      valueText: brDecimal(lnOsPhtr) + "%",
      valueFontSize: 15,
      valueTextColor: lcGrClor,
      labelFontSize: 8,
      labelText: "de horas trabalhadas",
    });
  }
}

function pesquisaHorasPremioDCC() {
  var loDtData = document.getElementById("datDataDCC");
  var lcWkIsql = "",
    lcAhData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcAhData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcAhData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lnIdClie", pa_tipo: "Int", pa_valo: null },
    { pa_nome: "ldAhData", pa_tipo: "SmallDatetime", pa_valo: lcAhData },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaHorasPremio",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmAhHrprDCC = lmWkRsql;

      montaDashboardDCC();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaDashboardApontamentosPendentesDCC() {
  var loDtData = document.getElementById("datDataDCC");
  var lcWkIsql = "",
    lcCaData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcCaData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcCaData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: lcCaData,
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardApontamentosPendentes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmApPndtDCC = lmWkRsql;

      pesquisaHorasPremioDCC();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaDashboardApontamentosDivergentesDCC() {
  var loDtData = document.getElementById("datDataDCC");
  var lcWkIsql = "",
    lcCaData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcCaData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcCaData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: lcCaData,
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardApontamentosDivergentes",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmApDvrgDCC = lmWkRsql;

      pesquisaDashboardApontamentosPendentesDCC();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function pesquisaDashboardObrasDCC() {
  var loDtData = document.getElementById("datDataDCC");
  var lcPgAtua = document
    .getElementsByClassName("page-current")[0]
    .getAttribute("data-name");
  var lcWkIsql = "",
    lcCaData = "";
  var lmWkIsql = [];
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  lcCaData = objetoDataParaStringSqlData(ldDtHoje);

  if (loDtData.value.toString().trim().length > 0) {
    lcCaData = objetoDataParaStringSqlData(
      htmlDataParaObjetoData(loDtData.value)
    );
  }

  lmWkIsql = [
    {
      pa_nome: "lcIdUser",
      pa_tipo: "VarChar",
      pa_valo: goCdUser.id_user.trim().toUpperCase(),
    },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    {
      pa_nome: "ldCaData",
      pa_tipo: "SmallDatetime",
      pa_valo: lcCaData,
    },
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  if (lcPgAtua.trim() != "DashCdClie") {
    setTimeout(function () {
      pesquisaDashboardObrasDCC();
    }, 500);

    return;
  } else {
    setTimeout(function () {
      pesquisaDashboardObrasDCC();
    }, 1000 * 60 * 60);
  }

  limpaCamposDCC();

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=pesquisaDashboardObras",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      gmDsObraDCC = lmWkRsql;

      pesquisaDashboardApontamentosDivergentesDCC();
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function limpaCamposDCC() {
  var loDvObra = document.getElementById("divObraDCC");

  for (var i = 0; i < gmDsObraDCC.length; i++) {
    try {
      app.gauge.destroy("clsCl" + gmDsObraDCC[i].id_clie.toString() + "DCC");
      app.gauge.destroy("clsTr" + gmDsObraDCC[i].id_clie.toString() + "DCC");
    } catch (error) {}
  }

  loDvObra.innerHTML = "";
}

function consultaAutoridadeObjetoDCC() {
  var loSlHora = document.getElementById("sltHoraDCC");
  var lcWkIsql = "";
  var lmWkIsql = [];

  //prettier-ignore
  lmWkIsql = [
    { pa_nome: "lcIdUser", pa_tipo: "VarChar", pa_valo: goCdUser.id_user.trim().toUpperCase() },
    { pa_nome: "lcIdEmpr", pa_tipo: "VarChar", pa_valo: gcIdEmpr },
    { pa_nome: "lcIdFile", pa_tipo: "VarChar", pa_valo: "DASHCDCLIE" },
    { pa_nome: "lcIdObjt", pa_tipo: "VarChar", pa_valo: "SLTHORADCC" }
  ];

  lcWkIsql = encodeURIComponent(JSON.stringify(lmWkIsql));

  loSlHora.disabled = true;

  $.ajax({
    url:
      goCdUser.ws_http.trim() +
      "chamadaProcedure?lcWkIsql=" +
      lcWkIsql +
      "&lcWkProc=consultaAutoridadeObjeto",
    type: "GET",
    dataType: "jsonp",

    success: function (lmWkRsql) {
      try {
        if (lmWkRsql.length > 0) {
          loSlHora.disabled = false;
        }
      } catch (loApErro) {}
    },
    error: function (jqXHR, textStatus, err) {},
  });
}

function DashCdClie() {
  var loDtData = document.getElementById("datDataDCC");
  var ldDtHoje = new Date();

  ldDtHoje.setHours(0, 0, 0, 0);

  loDtData.valueAsDate = ldDtHoje;

  consultaAutoridadeObjetoDCC();
  pesquisaDashboardObrasDCC();

  OkTecladoAndroid("datDataDCC");
}
