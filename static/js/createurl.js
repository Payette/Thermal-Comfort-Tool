

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
	var distFromFacade = $('#distFromFacade').val();
	var ppd = $("#ppd").val();


	var rvalue = $("#rvalue").val();
	var airspeed = $("#airspeed").val();
	var clothing = $("#clothing").val();
	var met = $("#metabolic").val();


	var generatedURL = location.href + "/?units=" + units + "case1=" + case1Vis + "&case2=" + case2Vis + "&case3=" + case3Vis;

	return generatedURL;

}


/*var case1Data = {
	ceilingHeightValue: $("#ceiling").val(),
	wallLen: $("#wallWidth").val(),
	windowHeightValue: $("#windowHeight").val(),
	windowWidthValue: $("#windowWidth").val(),
	glzRatioValue: $("#glazing").val(),
	sillHeightValue: $("#sill").val(),
	distanceWindows: $('#distWindow').val(),

	occDistToWallCenter: 0,

	uvalueValue: $("#uvalue").val(),
	intLowEChecked: $("#lowECheck").is(":checked"), //provides a true/false
	intLowEEmissivity: $("#lowE").val(),

	outdoorTempValue: $("#outdoortemp").val(),
	airtempValue: $("#airtemp").val(),
	humidityValue: $("#humidity").val()
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
