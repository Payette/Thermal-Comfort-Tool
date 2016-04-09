//Assign any parameters from the URL 

var thisURL = location.href;
//call URL parser function
var urlParameters = urlObject({'url':thisURL}).parameters;


// first check should be which cases are shown - therefore if only case 1, dont need values for other cases, just fill with the same...

var selectedCases = {
	case1: false,
	case2: false,
	case3: false
}

// determine which cases are shown
if ($("#caseSelection #case1Label").hasClass("unselected") == false) {
	selectedCases.case1 = true
}

if ($("#caseSelection #case2Label").hasClass("unselected") == false) {
	selectedCases.case2 = true
}

if ($("#caseSelection #case3Label").hasClass("unselected") == false) {
	selectedCases.case3 = true
}




// determine units
if (typeof urlParameters.units != 'undefined') {

	console.log(urlParameters.units);

	if (urlParameters.units = "IP") {
		unitSys = "IP";

		$(".optionButton#IP").addClass("selected");
		$(".optionButton#SI").removeClass("selected");
		$(".optionButton#SI").addClass("unselected");
				
		// change labels to have ft
		$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").removeClass("SI");
		$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").addClass("IP");
		$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").empty();
		$(".units").append("ft");
		$(".unitsTemp").append("&deg;F");
		$(".unitsUVal").append("Btu/hr*ft&sup2;*&deg;F");
		$(".unitsRVal").append("hr*ft&sup2;*&deg;F/Btu");
		$(".unitsAirSpeed").append("fpm");

	} else if (urlParameters.units = "SI") {

		console.log("SI noticed");
		//change to SI
		unitSys = "SI"
		$(".optionButton#SI").addClass("selected");
		$(".optionButton#IP").removeClass("selected");
		$(".optionButton#IP").addClass("unselected");

		// change units labels to be in SI
		$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").removeClass("IP");
		$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").addClass("SI");
		$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").empty();
		$(".units").append("m");
		$(".unitsTemp").append("&deg;C");
		$(".unitsUVal").append("W/m&sup2;*K");
		$(".unitsRVal").append("m&sup2;*K/W");
		$(".unitsAirSpeed").append("m/s");
	}
}

// inputs applied to all cases
if (typeof urlParameters.rValue != 'undefined') {
	$("#rvalue").val(urlParameters.rValue);
}
/*if (typeof urlParameters.radiant == 'yes') {
	$("#radiant").attr("checked", "checked");;
}*/
if (typeof urlParameters.airspeed != 'undefined') {
	$("#airspeed").val(urlParameters.airspeed);
}
if (typeof urlParameters.clothing != 'undefined') {
	$("#clothing").val(urlParameters.clothing);
}
if (typeof urlParameters.metabolic != 'undefined') {
	$("#metabolic").val(urlParameters.metabolic);
}





//fill form with parameters, but only if values are provided in URL
if (typeof urlParameters.ppd != 'undefined') {
	$("#ppd").val(urlParameters.ppd);
}
if (typeof urlParameters.distFromFacade != 'undefined') {
	$("#distFromFacade").val(urlParameters.distFromFacade);
}

if (typeof urlParameters.ceiling != 'undefined') {
	console.log("checking ceiling");
	$("#ceiling").val(urlParameters.ceiling);
}
if (typeof urlParameters.wallWidth != 'undefined') {
	$("#wallWidth").val(urlParameters.wallWidth);
}

if (typeof urlParameters.windowHeight != 'undefined') {
	$("#windowHeight").val(urlParameters.windowHeight);
}

if (typeof urlParameters.sillHeight != 'undefined') {
	$("#sill").val(urlParameters.sillHeight);
}

if (typeof urlParameters.windowWidth != 'undefined') {
	$("#windowWidth").val(urlParameters.windowWidth);
	$("#windowWidth").removeClass("inactive");
	$("#windowWidthLabel").removeClass("inactive");
	$("#glazing").addClass("inactive");
	$("#glazingLabel").addClass("inactive");
	$("#glazingRatioCheck").removeAttr("checked");
}

if (typeof urlParameters.glazingRatio != 'undefined') {
	$("#glazing").val(urlParameters.glazingRatio);
	$("#windowWidth").addClass("inactive");
	$("#windowWidthLabel").addClass("inactive");
	$("#glazing").removeClass("inactive");
	$("#glazingLabel").removeClass("inactive");

	$("#glazingRatioCheck").attr("checked", "checked");
}

if (typeof urlParameters.windowSeparation != 'undefined') {
	$("#distWindow").val(urlParameters.windowSeparation);
}

if (typeof urlParameters.uValue != 'undefined') {
	$("#uvalue").val(urlParameters.uValue);
}

if (typeof urlParameters.outdoorTemp != 'undefined') {
	$("#outdoortemp").val(urlParameters.outdoorTemp);
}

if (typeof urlParameters.indoortemp != 'undefined') {
	$("#airtemp").val(urlParameters.indoortemp);
}

if (typeof urlParameters.humidity != 'undefined') {
	$("#humidity").val(urlParameters.humidity);
}

if (typeof urlParameters.lowE != 'undefined') {
	$("#lowE").val(urlParameters.lowE);
	$("#lowE").removeClass("inactive");
	$("#lowELabel").removeClass("inactive");
}




