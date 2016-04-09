

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

	var LowECheck1 = $("#lowECheck").is(":checked"); //provides a true/false
	var LowEEmis1 = $("#lowE").val();

	var occToWallCenter1 = $("#occupantDist").val();


	var startURL = location.href + "/?units=" + units + "&case1=" + case1Vis + "&case2=" + case2Vis + "&case3=" + case3Vis + "&ppd=" + thisPpd + "&distFromFacade=" + thisDistFromFacade;

	var endURL = "&rValue=" + thisRvalue + "&airspeed=" + thisAirspeed + "&clothing=" + thisClothing + "&metabolic=" + thisMet;

	var case1URL = "&ceiling=" + ceiling1 + "&wallWidth=" + length1 + "&windowHeight=" + windowHeight1 + "&sillHeight=" + sillHeight1 + "&windowWidth=" + windowWidth1 + "&glazingRatio=" + glzRatio1 + "&windowSeparation=" + windowSep1 + "&uValue=" + uvalue1 + "&outdoorTemp=" + outdoorTemp1 + "&indoortemp=" + indoorTemp1 + "&humidity=" + humid1 + "&lowE=" + LowEEmis1 + "&occPosition=" + occToWallCenter1;

	var case2URL;




	

	var completeURL = startURL + case1URL + endURL;

	return completeURL;

}


/*var case1Data = {
	ceilingHeightValue: $("#ceiling").val(),
	wallLen: $("#wallWidth").val(),
	
}



var case2Data = {
	ceilingHeightValue: $("#ceiling2").val(),
	wallLen: $("#wallWidth2").val(),
	windowHeightValue: $("#windowHeight2").val(),
	windowWidthValue: $("#windowWidth2").val(),
	glzRatioValue: $("#glazing2").val(),
	sillHeightValue: $("#sill2").val(),
	distanceWindows: $('#distWindow2').val(),

	occDistToWallCenter: 0,

	uvalueValue: $("#uvalue2").val(),
	intLowEChecked: $("#lowECheck2").is(":checked"), //provides a true/false
	intLowEEmissivity: $("#lowE2").val(),

	outdoorTempValue: $("#outdoortemp2").val(),
	airtempValue: $("#airtemp2").val(),
	humidityValue: $("#humidity2").val()

}


var case3Data = {
	ceilingHeightValue: $("#ceiling3").val(),
	wallLen: $("#wallWidth3").val(),
	windowHeightValue: $("#windowHeight3").val(),
	windowWidthValue: $("#windowWidth3").val(),
	glzRatioValue: $("#glazing3").val(),
	sillHeightValue: $("#sill3").val(),
	distanceWindows: $('#distWindow3').val(),

	occDistToWallCenter: 0,

	uvalueValue: $("#uvalue3").val(),
	intLowEChecked: $("#lowECheck3").is(":checked"), //provides a true/false
	intLowEEmissivity: $("#lowE3").val(),

	outdoorTempValue: $("#outdoortemp3").val(),
	airtempValue: $("#airtemp3").val(),
	humidityValue: $("#humidity3").val()
}
*/
