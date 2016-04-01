var script = script || {}


//Pull the individual values from the form.



if ($("#windowWidthCheck").is(":checked")) {
	glzOrWidth = false;
} else {
	glzOrWidth = true;
}

var occDistFromFacade = $('#distFromFacade').val();
var ppdValue = $("#ppd").val();

// need to remove radiant floor from calculation
var radiantFloorChecked = $("#radiant").is(":checked"); //provides a true/false
var rvalueValue = $("#rvalue").val();
var airspeedValue = $("#airspeed").val();
var clothingValue = $("#clothing").val();
var metabolic = $("#metabolic").val();



var case1Data = {
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

var changedVar = "ceilingHeightValue"
var unitSys = "IP"


//ensure slider has correct max value
$("#occupantDist").attr("max", case1Data.wallLen/2);



// Main function to run the analysis.
script.computeData = function(object) {
	// Compute the window and wall geometry.
	var geoResult = geo.createGlazingForRect(parseFloat(object.ceilingHeightValue), object.wallLen, object.glzRatioValue/100, parseFloat(object.windowWidthValue), parseFloat(object.windowHeightValue), parseFloat(object.sillHeightValue), parseFloat(object.distanceWindows), glzOrWidth, changedVar);

	// Compute the view factors to make the graph.
	var viewResult = geo.computeAllViewFac(geoResult.wallCoords, geoResult.glzCoords, object.occDistToWallCenter)

	// Compute the PPD to make the graph.
	var comfortResult = comf.getFullPPD(viewResult.wallViews, viewResult.glzViews, viewResult.facadeDist, viewResult.windIntervals, object.occDistToWallCenter, geoResult.windowHeight, object.uvalueValue, object.intLowEChecked, object.intLowEEmissivity, rvalueValue, parseFloat(object.airtempValue), parseFloat(object.outdoorTempValue), radiantFloorChecked, parseFloat(clothingValue), parseFloat(metabolic), parseFloat(airspeedValue), parseFloat(object.humidityValue))


	// Return all of the information in one dictionary
	var r = {}

	r.wallCoords = geoResult.wallCoords;
	r.glzCoords = geoResult.glzCoords;
	r.glzRatio = geoResult.glzRatio;
	r.windowWidth = geoResult.windowWidth;
	r.windowHeight = geoResult.windowHeight;
	r.sillHeight = geoResult.sillHeight;
	r.centLineDist = geoResult.centLineDist;

	r.wallViews = viewResult.wallViews;
	r.glzViews = viewResult.glzViews;
	r.facadeDist = viewResult.facadeDist;

	r.condensation = comfortResult.condensation; // Text string value that is either: "certain", "risky", "none".
	r.dataSet = comfortResult.myDataset; // Data to construct the graph.
	r.occPtInfo = comfortResult.occPtInfo;  // The status of the occupant at the input location.
	r.runDownCalc = comfortResult.runDownCalc;  // Boolean value for whether the occupant is in front of the window or not.


	return r
}


//Call the function to render the graph.
render.makeGraph();
