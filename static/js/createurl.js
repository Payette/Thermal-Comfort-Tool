
function createURL() {

	// case visibility
	var case1Vis = "show"; 
	var case2Vis, case3Vis;
	if ($("#caseSelection #case2Label").hasClass("unselected") == false) {
		case2Vis = "show";
	} else {
		case2Vis = "hide";
	}

	if ($("#caseSelection #case3Label").hasClass("unselected") == false) {
		case3Vis = "show";
	} else {
		case3Vis = "hide";
	}

	// units
	if ($(".optionButton#IP").hasClass("selected") == true) {
		var units = "IP";
	} else {
		var units = "SI";
	}


	// values regardless of case
	var thisDistFromFacade = $('#distFromFacade').val();
	var thisPpd = $("#ppd").val();

	var thisRvalue = $("#rvalue").val();
	var thisAirspeed = $("#airspeed").val();
	var thisClothing = $("#clothing").val();
	var thisMet = $("#metabolic").val();

	// values for only case 1
	var ceiling1 = $("#ceiling").val();
	var length1 = $("#wallWidth").val();
	var windowHeight1 = $("#windowHeight").val();
	var sillHeight1 = $("#sill").val();
	var windowWidth1 = $("#windowWidth").val();
	var glzRatio1 = $("#glazing").val();
	var windowSep1 =  $('#distWindow').val();
	var uvalue1 = $("#uvalue").val();
	var outdoorTemp1 = $("#outdoortemp").val();
	var indoorTemp1 = $("#airtemp").val();
	var humid1 = $("#humidity").val();
	var LowEEmis1 = $("#lowE").val();
	var occToWallCenter1 = $("#occupantDist").val();

	// values for only case 2
	var ceiling2 = $("#ceiling2").val();
	var length2 = $("#wallWidth2").val();
	var windowHeight2 = $("#windowHeight2").val();
	var sillHeight2 = $("#sill2").val();
	var windowWidth2 = $("#windowWidth2").val();
	var glzRatio2 = $("#glazing2").val();
	var windowSep2 =  $('#distWindow2').val();
	var uvalue2 = $("#uvalue2").val();
	var outdoorTemp2 = $("#outdoortemp2").val();
	var indoorTemp2 = $("#airtemp2").val();
	var humid2 = $("#humidity2").val();
	var LowEEmis2 = $("#lowE2").val();
	var occToWallCenter2 = $("#occupantDist2").val();

	// values for only case 3
	var ceiling3 = $("#ceiling3").val();
	var length3 = $("#wallWidth3").val();
	var windowHeight3 = $("#windowHeight3").val();
	var sillHeight3 = $("#sill2").val();
	var windowWidth3 = $("#windowWidth3").val();
	var glzRatio3 = $("#glazing3").val();
	var windowSep3 =  $('#distWindow3').val();
	var uvalue3 = $("#uvalue3").val();
	var outdoorTemp3 = $("#outdoortemp3").val();
	var indoorTemp3 = $("#airtemp3").val();
	var humid3 = $("#humidity3").val();
	var LowEEmis3 = $("#lowE3").val();
	var occToWallCenter3 = $("#occupantDist3").val();


	// build the URL

	
	var startURL = location.href + "/?units=" + units + "&case1=" + case1Vis + "&case2=" + case2Vis + "&case3=" + case3Vis + "&ppd=" + thisPpd + "&distFromFacade=" + thisDistFromFacade;

	var endURL = "&rValue=" + thisRvalue + "&airspeed=" + thisAirspeed + "&clothing=" + thisClothing + "&metabolic=" + thisMet;

	var case1URL = "&ceiling=" + ceiling1 + "&wallWidth=" + length1 + "&windowHeight=" + windowHeight1 + "&sillHeight=" + sillHeight1 + "&windowWidth=" + windowWidth1 + "&glazingRatio=" + glzRatio1 + "&windowSeparation=" + windowSep1 + "&uValue=" + uvalue1 + "&outdoorTemp=" + outdoorTemp1 + "&indoortemp=" + indoorTemp1 + "&humidity=" + humid1 + "&lowE=" + LowEEmis1 + "&occPosition=" + occToWallCenter1;

	var case2URL = "&ceiling2=" + ceiling2 + "&wallWidth2=" + length2 + "&windowHeight2=" + windowHeight2 + "&sillHeight2=" + sillHeight2 + "&windowWidth2=" + windowWidth2 + "&glazingRatio2=" + glzRatio2 + "&windowSeparation2=" + windowSep2 + "&uValue2=" + uvalue2 + "&outdoorTemp2=" + outdoorTemp2 + "&indoortemp2=" + indoorTemp2 + "&humidity2=" + humid2 + "&lowE2=" + LowEEmis2 + "&occPosition2=" + occToWallCenter2;

	var case3URL = "&ceiling3=" + ceiling3 + "&wallWidth3=" + length3 + "&windowHeight3=" + windowHeight3 + "&sillHeight3=" + sillHeight3 + "&windowWidth3=" + windowWidth3 + "&glazingRatio3=" + glzRatio3 + "&windowSeparation3=" + windowSep3 + "&uValue3=" + uvalue3 + "&outdoorTemp3=" + outdoorTemp3 + "&indoortemp3=" + indoorTemp3 + "&humidity3=" + humid3 + "&lowE3=" + LowEEmis3 + "&occPosition3=" + occToWallCenter3;


	var caseURL = case1URL;

	if ($("#caseSelection #case2Label").hasClass("unselected") == false) {
		caseURL = caseURL + case2URL;
	} 

	if ($("#caseSelection #case3Label").hasClass("unselected") == false) {
		caseURL = caseURL + case3URL;
	}
	


	var completeURL = startURL + caseURL + endURL;

	return completeURL;

}




