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
	}
}


//fill form with parameters, but only if values are provided in URL
if (typeof urlParameters.ppd != 'undefined') {
	$("#ppd").val(urlParameters.ppd);
}
if (typeof urlParameters.distFromFacade != 'undefined') {
	$("#distFromFacade").val(urlParameters.distFromFacade);
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

	if (typeof urlParameters.lowE != 'undefined') {
		$("#lowE, #lowE2, #lowE3").val(urlParameters.lowE);
		$("#lowE").removeClass("inactive");
		$("#lowELabel").removeClass("inactive");
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
	if (typeof urlParameters.sillHeight != 'undefined') {
		$("#sill2").val(urlParameters.sillHeight2);
	}

	if (typeof urlParameters.windowWidth != 'undefined') {
		$("#windowWidth, #windowWidth3").val(urlParameters.windowWidth);
		$("#windowWidth").removeClass("inactive");
		$("#windowWidthLabel").removeClass("inactive");
		$("#glazing").addClass("inactive");
		$("#glazingLabel").addClass("inactive");
		$("#glazingRatioCheck").removeAttr("checked");
	}
	if (typeof urlParameters.windowWidth2 != 'undefined') {
		$("#windowWidth2").val(urlParameters.windowWidth2);
	}

	if (typeof urlParameters.glazingRatio != 'undefined') {
		$("#glazing, #glazing3").val(urlParameters.glazingRatio);
		$("#windowWidth").addClass("inactive");
		$("#windowWidthLabel").addClass("inactive");
		$("#glazing").removeClass("inactive");
		$("#glazingLabel").removeClass("inactive");

		$("#glazingRatioCheck").attr("checked", "checked");
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

	if (typeof urlParameters.lowE != 'undefined') {
		$("#lowE,#lowE3").val(urlParameters.lowE);
		$("#lowE").removeClass("inactive");
		$("#lowELabel").removeClass("inactive");
	}
	if (typeof urlParameters.lowE2 != 'undefined') {
		$("#lowE2").val(urlParameters.lowE2);
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
