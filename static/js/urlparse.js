//Assign any parameters from the URL

var thisURL = location.href;

//call URL parser function
var urlParameters = urlObject({'url':thisURL}).parameters;

// determine units
if (typeof urlParameters.units != 'undefined') {

	unitSys = urlParameters.units;

	if (unitSys == "IP") {
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
	}


	if (unitSys == "SI") {
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
		$("#calcuvalue, #calcuvalue2, #calcuvalue3").val(" ");

		// set default values for SI.
		$("#ceiling, #ceiling2, #ceiling3").val(3.66);
		$("#wallWidth, #wallWidth2, #wallWidth3").val(5.49);
		$("#windowHeight, #windowHeight2, #windowHeight3").val(2.13);
		$("#sill, #sill2, #sill3").val(0.91);
		$("#windowWidth, #windowWidth2, #windowWidth3").val(1.22);
		$("#glazing, #glazing2, #glazing3").val(39);
		$("#distWindow, #distWindow2, #distWindow3").val(1.83);
		$("#uvalue, #uvalue2, #uvalue3").val(1.99);
		$("#outdoortemp, #outdoortemp2, #outdoortemp3").val(-12);
		$("#airtemp, #airtemp2, #airtemp3").val(22.2);
		$("#rvalue, #rvalue2, #rvalue3").val(2.64);
		$("#airspeed, #airspeed2, #airspeed3").val(0.05);
		$("#distFromFacade").attr("max", 4).attr("min", .5);
		$("#distFromFacade").val(0.914);
		$("#distFromFacade").attr("value", 0.914);
		$("#distOutput").text(0.9 + " m");
	}
}


//fill form with parameters, but only if values are provided in URL
if (typeof urlParameters.ppd != 'undefined') {
	$("#ppd").val(urlParameters.ppd);
	$("#ppdOutput").text(urlParameters.ppd + "%");
}
if (typeof urlParameters.ppd2 != 'undefined') {
	$("#ppd2").val(urlParameters.ppd2);
	$("#ppdOutput2").text(urlParameters.ppd2 + "%");
}

if (typeof urlParameters.distFromFacade != 'undefined') {
	$("#distFromFacade").val(urlParameters.distFromFacade);
	if (unitSys == "IP") {
		$("#distOutput").text(urlParameters.distFromFacade + " ft");
	} else {
		$("#distFromFacade").attr("max", 4).attr("min", .5);
		$("#distFromFacade").val(urlParameters.distFromFacade);
		$("#distFromFacade").attr("value", urlParameters.distFromFacade);
		$("#distOutput").text(urlParameters.distFromFacade + " m");
	}
}

function checkSplitGraph() {
	if ($("#graphWrapper").css("display") == "none") {
		$("#graphWrapper3").slideDown(50);
	}
}
if (typeof urlParameters.graphType != 'undefined') {
	$("#graphWrapper").slideUp(50);
	$("#graphWrapper2").slideUp(50);
	setTimeout(checkSplitGraph, 70);
	$("#splitToggle").removeClass("marked");
	$("#splitToggle").addClass("unmarked");
	$("#combinedToggle").removeClass("unmarked");
	$("#combinedToggle").addClass("marked");
}

var case1visability = urlParameters.case1;
var case2visability = urlParameters.case2;
var case3visability = urlParameters.case3;


// first check should be which cases are shown - therefore if only case 1, dont need values for other cases, just fill with the same...

//only case 1 is shown, apply given values to all cases
if (urlParameters.case1 == 'show' && urlParameters.case2 == 'hide' && urlParameters.case3 == 'hide') {

	if (typeof urlParameters.ceiling != 'undefined') {
		$("#ceiling, #ceiling2, #ceiling3").val(urlParameters.ceiling);
	}
	if (typeof urlParameters.wallWidth != 'undefined') {
		$("#wallWidth, #wallWidth2, #wallWidth3").val(urlParameters.wallWidth);
	}
	if (typeof urlParameters.windowHeight != 'undefined') {
		$("#windowHeight, #windowHeight2, #windowHeight3").val(urlParameters.windowHeight);
	}
	if (typeof urlParameters.sillHeight != 'undefined') {
		$("#sill, #sill2, #sill3").val(urlParameters.sillHeight);
	}
	if (typeof urlParameters.windowWidth != 'undefined') {
		$("#windowWidth, #windowWidth2, #windowWidth3").val(urlParameters.windowWidth);
	}
	if (typeof urlParameters.glazingRatio != 'undefined') {
		$("#glazing, #glazing2, #glazing3").val(urlParameters.glazingRatio);
	}
	if (typeof urlParameters.windowSeparation != 'undefined') {
		$("#distWindow, #distWindow2, #distWindow3").val(urlParameters.windowSeparation);
	}
	if (typeof urlParameters.uValue != 'undefined') {
		$("#uvalue, #uvalue2, #uvalue3").val(urlParameters.uValue);
	}
	if (typeof urlParameters.outdoorTemp != 'undefined') {
		$("#outdoortemp, #outdoortemp2, #outdoortemp3").val(urlParameters.outdoorTemp);
	}
	if (typeof urlParameters.indoortemp != 'undefined') {
		$("#airtemp, #airtemp2, #airtemp3").val(urlParameters.indoortemp);
	}
	if (typeof urlParameters.humidity != 'undefined') {
		$("#humidity, #humidity2, #humidity3").val(urlParameters.humidity);
	}
	if (typeof urlParameters.rValue != 'undefined') {
		$("#rvalue, #rvalue2, #rvalue3").val(urlParameters.rValue);
	}
	if (typeof urlParameters.airspeed != 'undefined') {
		$("#airspeed, #airspeed2, #airspeed3").val(urlParameters.airspeed);
	}
	if (typeof urlParameters.clothing != 'undefined') {
		$("#clothing, #clothing2, #clothing3").val(urlParameters.clothing);
	}
	if (typeof urlParameters.metabolic != 'undefined') {
		$("#metabolic, #metabolic2, #metabolic3").val(urlParameters.metabolic);
	}

	if (urlParameters.lowE != null && urlParameters.lowE != ' ') {
		$("#lowE, #lowE2, #lowE3").val(urlParameters.lowE);
		$("#lowE, #lowE2, #lowE3").removeClass("inactive");
		$("#lowELabel, #lowELabel2, #lowELabel3").removeClass("inactive");
		$("#checkLowE1, #checkLowE2, #checkLowE3").removeClass("unselected");
		document.getElementById("lowECheck").checked = true;
		document.getElementById("lowECheck2").checked = true;
		document.getElementById("lowECheck3").checked = true;
	}

	if (typeof urlParameters.occPosition != 'undefined') {
		$("#occupantDist, #occupantDist2, #occupantDist3").val(urlParameters.occPosition);
	}
}

// show only case 1 and 2
// case 3 to match case 1
if (urlParameters.case1 == 'show' && urlParameters.case2 == 'show' &&  urlParameters.case3 == 'hide') {

	showCase2();
	sizeButton();


	if (typeof urlParameters.ceiling != 'undefined') {
		$("#ceiling, #ceiling3").val(urlParameters.ceiling);
	}
	if (typeof urlParameters.ceiling2 != 'undefined') {
		$("#ceiling2").val(urlParameters.ceiling2);
	}


	if (typeof urlParameters.wallWidth != 'undefined') {
		$("#wallWidth, #wallWidth3").val(urlParameters.wallWidth);
	}
	if (typeof urlParameters.wallWidth2 != 'undefined') {
		$("#wallWidth2").val(urlParameters.wallWidth2);
	}

	if (typeof urlParameters.windowHeight != 'undefined') {
		$("#windowHeight, #windowHeight3").val(urlParameters.windowHeight);
	}
	if (typeof urlParameters.windowHeight2 != 'undefined') {
		$("#windowHeight2").val(urlParameters.windowHeight2);
	}

	if (typeof urlParameters.sillHeight != 'undefined') {
		$("#sill, #sill3").val(urlParameters.sillHeight);
	}
	if (typeof urlParameters.sillHeight2 != 'undefined') {
		$("#sill2").val(urlParameters.sillHeight2);
	}

	if (typeof urlParameters.windowWidth != 'undefined') {
		$("#windowWidth, #windowWidth3").val(urlParameters.windowWidth);
	}
	if (typeof urlParameters.windowWidth2 != 'undefined') {
		$("#windowWidth2").val(urlParameters.windowWidth2);
	}

	if (typeof urlParameters.glazingRatio != 'undefined') {
		$("#glazing, #glazing3").val(urlParameters.glazingRatio);
	}
	if (typeof urlParameters.glazingRatio2 != 'undefined') {
		$("#glazing2").val(urlParameters.glazingRatio2);
	}

	if (typeof urlParameters.windowSeparation != 'undefined') {
		$("#distWindow, #distWindow3").val(urlParameters.windowSeparation);
	}
	if (typeof urlParameters.windowSeparation2 != 'undefined') {
		$("#distWindow2").val(urlParameters.windowSeparation2);
	}

	if (typeof urlParameters.uValue != 'undefined') {
		$("#uvalue, #uvalue3").val(urlParameters.uValue);
	}
	if (typeof urlParameters.uValue2 != 'undefined') {
		$("#uvalue2").val(urlParameters.uValue2);
	}

	if (typeof urlParameters.outdoorTemp != 'undefined') {
		$("#outdoortemp, #outdoortemp3").val(urlParameters.outdoorTemp);
	}
	if (typeof urlParameters.outdoorTemp2 != 'undefined') {
		$("#outdoortemp2").val(urlParameters.outdoorTemp2);
	}

	if (typeof urlParameters.indoortemp != 'undefined') {
		$("#airtemp, #airtemp3").val(urlParameters.indoortemp);
	}
	if (typeof urlParameters.indoortemp2 != 'undefined') {
		$("#airtemp2").val(urlParameters.indoortemp2);
	}

	if (typeof urlParameters.humidity != 'undefined') {
		$("#humidity, #humidity3").val(urlParameters.humidity);
	}
	if (typeof urlParameters.humidity2 != 'undefined') {
		$("#humidity2").val(urlParameters.humidity2);
	}

	if (typeof urlParameters.rValue != 'undefined') {
		$("#rvalue, #rvalue3").val(urlParameters.rValue);
	}
	if (typeof urlParameters.rValue2 != 'undefined') {
		$("#rvalue2").val(urlParameters.rValue2);
	}

	if (typeof urlParameters.airspeed != 'undefined') {
		$("#airspeed, #airspeed3").val(urlParameters.airspeed);
	}
	if (typeof urlParameters.airspeed2 != 'undefined') {
		$("#airspeed2").val(urlParameters.airspeed2);
	}

	if (typeof urlParameters.clothing != 'undefined') {
		$("#clothing, #clothing3").val(urlParameters.clothing);
	}
	if (typeof urlParameters.clothing2 != 'undefined') {
		$("#clothing2").val(urlParameters.clothing2);
	}

	if (typeof urlParameters.metabolic != 'undefined') {
		$("#metabolic, #metabolic3").val(urlParameters.metabolic);
	}
	if (typeof urlParameters.metabolic2 != 'undefined') {
		$("#metabolic2").val(urlParameters.metabolic2);
	}

	if (urlParameters.lowE != null && urlParameters.lowE != ' ') {
		$("#lowE, #lowE3").val(urlParameters.lowE);
		$("#lowE, #lowE3").removeClass("inactive");
		$("#lowELabel, #lowELabel3").removeClass("inactive");
		$("#checkLowE1, #checkLowE3").removeClass("unselected");
		document.getElementById("lowECheck").checked = true;
		document.getElementById("lowECheck3").checked = true;
	}
	if (urlParameters.lowE2 != null && urlParameters.lowE2 != ' ') {
		$("#lowE2").val(urlParameters.lowE2);
		$("#lowE2").removeClass("inactive");
		$("#lowELabel2").removeClass("inactive");
		$("#checkLowE2").removeClass("unselected");
		document.getElementById("lowECheck2").checked = true;
	}

	if (typeof urlParameters.occPosition != 'undefined') {
		$("#occupantDist, #occupantDist3").val(urlParameters.occPosition);
	}
	if (typeof urlParameters.occPosition2 != 'undefined') {
		$("#occupantDist2").val(urlParameters.occPosition2);
	}
}

// show only case 1 and 3
// case 2 to match case 1
if (urlParameters.case1 == 'show' && urlParameters.case2 == 'hide' &&  urlParameters.case3 == 'show') {

	showCase3();
	sizeButton();


	if (typeof urlParameters.ceiling != 'undefined') {
		$("#ceiling, #ceiling2").val(urlParameters.ceiling);
	}
	if (typeof urlParameters.ceiling3 != 'undefined') {
		$("#ceiling3").val(urlParameters.ceiling3);
	}


	if (typeof urlParameters.wallWidth != 'undefined') {
		$("#wallWidth, #wallWidth2").val(urlParameters.wallWidth);
	}
	if (typeof urlParameters.wallWidth3 != 'undefined') {
		$("#wallWidth3").val(urlParameters.wallWidth3);
	}

	if (typeof urlParameters.windowHeight != 'undefined') {
		$("#windowHeight, #windowHeight2").val(urlParameters.windowHeight);
	}
	if (typeof urlParameters.windowHeight3 != 'undefined') {
		$("#windowHeight3").val(urlParameters.windowHeight3);
	}

	if (typeof urlParameters.sillHeight != 'undefined') {
		$("#sill, #sill2").val(urlParameters.sillHeight);
	}
	if (typeof urlParameters.sillHeight3 != 'undefined') {
		$("#sill3").val(urlParameters.sillHeight3);
	}

	if (typeof urlParameters.windowWidth != 'undefined') {
		$("#windowWidth, #windowWidth2").val(urlParameters.windowWidth);
	}
	if (typeof urlParameters.windowWidth3 != 'undefined') {
		$("#windowWidth3").val(urlParameters.windowWidth3);
	}

	if (typeof urlParameters.glazingRatio != 'undefined') {
		$("#glazing, #glazing2").val(urlParameters.glazingRatio);
	}
	if (typeof urlParameters.glazingRatio3 != 'undefined') {
		$("#glazing3").val(urlParameters.glazingRatio3);
	}

	if (typeof urlParameters.windowSeparation != 'undefined') {
		$("#distWindow, #distWindow2").val(urlParameters.windowSeparation);
	}
	if (typeof urlParameters.windowSeparation3 != 'undefined') {
		$("#distWindow3").val(urlParameters.windowSeparation3);
	}

	if (typeof urlParameters.uValue != 'undefined') {
		$("#uvalue, #uvalue2").val(urlParameters.uValue);
	}
	if (typeof urlParameters.uValue3 != 'undefined') {
		$("#uvalue3").val(urlParameters.uValue3);
	}

	if (typeof urlParameters.outdoorTemp != 'undefined') {
		$("#outdoortemp, #outdoortemp2").val(urlParameters.outdoorTemp);
	}
	if (typeof urlParameters.outdoorTemp3 != 'undefined') {
		$("#outdoortemp3").val(urlParameters.outdoorTemp3);
	}

	if (typeof urlParameters.indoortemp != 'undefined') {
		$("#airtemp, #airtemp2").val(urlParameters.indoortemp);
	}
	if (typeof urlParameters.indoortemp3 != 'undefined') {
		$("#airtemp3").val(urlParameters.indoortemp3);
	}

	if (typeof urlParameters.humidity != 'undefined') {
		$("#humidity, #humidity2").val(urlParameters.humidity);
	}
	if (typeof urlParameters.humidity3 != 'undefined') {
		$("#humidity3").val(urlParameters.humidity3);
	}

	if (typeof urlParameters.rValue != 'undefined') {
		$("#rvalue, #rvalue2").val(urlParameters.rValue);
	}
	if (typeof urlParameters.rValue3 != 'undefined') {
		$("#rvalue3").val(urlParameters.rValue3);
	}

	if (typeof urlParameters.airspeed != 'undefined') {
		$("#airspeed, #airspeed2").val(urlParameters.airspeed);
	}
	if (typeof urlParameters.airspeed3 != 'undefined') {
		$("#airspeed3").val(urlParameters.airspeed3);
	}

	if (typeof urlParameters.clothing != 'undefined') {
		$("#clothing, #clothing2").val(urlParameters.clothing);
	}
	if (typeof urlParameters.clothing3 != 'undefined') {
		$("#clothing3").val(urlParameters.clothing3);
	}

	if (typeof urlParameters.metabolic != 'undefined') {
		$("#metabolic, #metabolic2").val(urlParameters.metabolic);
	}
	if (typeof urlParameters.metabolic3 != 'undefined') {
		$("#metabolic3").val(urlParameters.metabolic3);
	}

	if (urlParameters.lowE != null && urlParameters.lowE != ' ') {
		$("#lowE, #lowE2").val(urlParameters.lowE);
		$("#lowE, #lowE2").removeClass("inactive");
		$("#lowELabel, #lowELabel2").removeClass("inactive");
		$("#checkLowE1, #checkLowE2").removeClass("unselected");
		document.getElementById("lowECheck").checked = true;
		document.getElementById("lowECheck2").checked = true;
	}
	if (urlParameters.lowE3 != null && urlParameters.lowE3 != '') {
		$("#lowE3").val(urlParameters.lowE3);
		$("#lowE3").removeClass("inactive");
		$("#lowELabel3").removeClass("inactive");
		$("#checkLowE3").removeClass("unselected");
		document.getElementById("lowECheck3").checked = true;
	}

	if (typeof urlParameters.occPosition != 'undefined') {
		$("#occupantDist, #occupantDist2").val(urlParameters.occPosition);
	}
	if (typeof urlParameters.occPosition3 != 'undefined') {
		$("#occupantDist3").val(urlParameters.occPosition3);
	}
}


// show all cases
if (urlParameters.case1 == 'show' && urlParameters.case2 == 'show' &&  urlParameters.case3 == 'show') {

	showCase2();
	showCase3();
	sizeButton();


	if (typeof urlParameters.ceiling != 'undefined') {
		$("#ceiling").val(urlParameters.ceiling);
	}
	if (typeof urlParameters.ceiling2 != 'undefined') {
		$("#ceiling2").val(urlParameters.ceiling2);
	}
	if (typeof urlParameters.ceiling3 != 'undefined') {
		$("#ceiling3").val(urlParameters.ceiling3);
	}


	if (typeof urlParameters.wallWidth != 'undefined') {
		$("#wallWidth").val(urlParameters.wallWidth);
	}
	if (typeof urlParameters.wallWidth2 != 'undefined') {
		$("#wallWidth2").val(urlParameters.wallWidth2);
	}
	if (typeof urlParameters.wallWidth3 != 'undefined') {
		$("#wallWidth3").val(urlParameters.wallWidth3);
	}

	if (typeof urlParameters.windowHeight != 'undefined') {
		$("#windowHeight").val(urlParameters.windowHeight);
	}
	if (typeof urlParameters.windowHeight2 != 'undefined') {
		$("#windowHeight2").val(urlParameters.windowHeight2);
	}
	if (typeof urlParameters.windowHeight3 != 'undefined') {
		$("#windowHeight3").val(urlParameters.windowHeight3);
	}

	if (typeof urlParameters.sillHeight != 'undefined') {
		$("#sill").val(urlParameters.sillHeight);
	}
	if (typeof urlParameters.sillHeight2 != 'undefined') {
		$("#sill2").val(urlParameters.sillHeight2);
	}
	if (typeof urlParameters.sillHeight3 != 'undefined') {
		$("#sill3").val(urlParameters.sillHeight3);
	}

	if (typeof urlParameters.windowWidth != 'undefined') {
		$("#windowWidth").val(urlParameters.windowWidth);
	}
	if (typeof urlParameters.windowWidth2 != 'undefined') {
		$("#windowWidth2").val(urlParameters.windowWidth2);
	}
	if (typeof urlParameters.windowWidth3 != 'undefined') {
		$("#windowWidth3").val(urlParameters.windowWidth3);
	}

	if (typeof urlParameters.glazingRatio != 'undefined') {
		$("#glazing").val(urlParameters.glazingRatio);
	}
	if (typeof urlParameters.glazingRatio2 != 'undefined') {
		$("#glazing2").val(urlParameters.glazingRatio2);
	}
	if (typeof urlParameters.glazingRatio3 != 'undefined') {
		$("#glazing3").val(urlParameters.glazingRatio3);
	}

	if (typeof urlParameters.windowSeparation != 'undefined') {
		$("#distWindow").val(urlParameters.windowSeparation);
	}
	if (typeof urlParameters.windowSeparation2 != 'undefined') {
		$("#distWindow2").val(urlParameters.windowSeparation2);
	}
	if (typeof urlParameters.windowSeparation3 != 'undefined') {
		$("#distWindow3").val(urlParameters.windowSeparation3);
	}

	if (typeof urlParameters.uValue != 'undefined') {
		$("#uvalue").val(urlParameters.uValue);
	}
	if (typeof urlParameters.uValue2 != 'undefined') {
		$("#uvalue2").val(urlParameters.uValue2);
	}
	if (typeof urlParameters.uValue3 != 'undefined') {
		$("#uvalue3").val(urlParameters.uValue3);
	}

	if (typeof urlParameters.outdoorTemp != 'undefined') {
		$("#outdoortemp").val(urlParameters.outdoorTemp);
	}
	if (typeof urlParameters.outdoorTemp2 != 'undefined') {
		$("#outdoortemp2").val(urlParameters.outdoorTemp2);
	}
	if (typeof urlParameters.outdoorTemp3 != 'undefined') {
		$("#outdoortemp3").val(urlParameters.outdoorTemp3);
	}

	if (typeof urlParameters.indoortemp != 'undefined') {
		$("#airtemp").val(urlParameters.indoortemp);
	}
	if (typeof urlParameters.indoortemp2 != 'undefined') {
		$("#airtemp2").val(urlParameters.indoortemp2);
	}
	if (typeof urlParameters.indoortemp3 != 'undefined') {
		$("#airtemp3").val(urlParameters.indoortemp3);
	}

	if (typeof urlParameters.humidity != 'undefined') {
		$("#humidity").val(urlParameters.humidity);
	}
	if (typeof urlParameters.humidity2 != 'undefined') {
		$("#humidity2").val(urlParameters.humidity2);
	}
	if (typeof urlParameters.humidity3 != 'undefined') {
		$("#humidity3").val(urlParameters.humidity3);
	}

	if (typeof urlParameters.rValue != 'undefined') {
		$("#rvalue").val(urlParameters.rValue);
	}
	if (typeof urlParameters.rValue2 != 'undefined') {
		$("#rvalue2").val(urlParameters.rValue2);
	}
	if (typeof urlParameters.rValue3 != 'undefined') {
		$("#rvalue3").val(urlParameters.rValue3);
	}

	if (typeof urlParameters.airspeed != 'undefined') {
		$("#airspeed").val(urlParameters.airspeed);
	}
	if (typeof urlParameters.airspeed2 != 'undefined') {
		$("#airspeed2").val(urlParameters.airspeed2);
	}
	if (typeof urlParameters.airspeed3 != 'undefined') {
		$("#airspeed3").val(urlParameters.airspeed3);
	}

	if (typeof urlParameters.clothing != 'undefined') {
		$("#clothing").val(urlParameters.clothing);
	}
	if (typeof urlParameters.clothing2 != 'undefined') {
		$("#clothing2").val(urlParameters.clothing2);
	}
	if (typeof urlParameters.clothing3 != 'undefined') {
		$("#clothing3").val(urlParameters.clothing3);
	}

	if (typeof urlParameters.metabolic != 'undefined') {
		$("#metabolic").val(urlParameters.metabolic);
	}
	if (typeof urlParameters.metabolic2 != 'undefined') {
		$("#metabolic2").val(urlParameters.metabolic2);
	}
	if (typeof urlParameters.metabolic3 != 'undefined') {
		$("#metabolic3").val(urlParameters.metabolic3);
	}

	if (urlParameters.lowE != null && urlParameters.lowE != ' '){
		$("#lowE").val(urlParameters.lowE);
		$("#lowE").removeClass("inactive");
		$("#lowELabel").removeClass("inactive");
		$("#checkLowE1").removeClass("unselected");
		document.getElementById("lowECheck").checked = true;
	}
	if (urlParameters.lowE2 != null && urlParameters.lowE2 != ' ') {
		$("#lowE2").val(urlParameters.lowE2);
		$("#lowE2").removeClass("inactive");
		$("#lowELabel2").removeClass("inactive");
		$("#checkLowE2").removeClass("unselected");
		document.getElementById("lowECheck2").checked = true;
	}
	if (urlParameters.lowE3 != null && urlParameters.lowE3 != '') {
		$("#lowE3").val(urlParameters.lowE3);
		$("#lowE3").removeClass("inactive");
		$("#lowELabel3").removeClass("inactive");
		$("#checkLowE3").removeClass("unselected");
		document.getElementById("lowECheck3").checked = true;
	}

	if (typeof urlParameters.occPosition != 'undefined') {
		$("#occupantDist").val(urlParameters.occPosition);
	}
	if (typeof urlParameters.occPosition2 != 'undefined') {
		$("#occupantDist2").val(urlParameters.occPosition2);
	}
	if (typeof urlParameters.occPosition3 != 'undefined') {
		$("#occupantDist3").val(urlParameters.occPosition3);
	}
}


function showCase2() {
	$("#caseSelection #case2Label").removeClass("unselected");
	$("#case2Heading").removeClass("greyText").addClass("case2Text");
    $("#case2Button").removeClass("unselected");

    $("#inputs input.case2, div.case2, #sliderWrapper2, .connectLine2, .dotCase2, .occdot2").css("display","inline-block");
	$("hr.case2").css("display","block");
}

function showCase3() {
	$("#caseSelection #case3Label").removeClass("unselected");
	$("#case3Heading").removeClass("greyText").addClass("case3Text");
    $("#case3Button").removeClass("unselected");

    $("#inputs input.case3, div.case3, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3").css("display","inline-block");
	$("hr.case3").css("display","block");
}
