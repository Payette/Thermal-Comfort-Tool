var script = script || {}


//Pull the individual values from the form.
var ceilingHeightValue = $("#ceiling").val();
var wallLen = $("#wallWidth").val();
var windowHeightValue = $("#windowHeight").val();
var windowWidthValue = $("#windowWidth").val();
var glzRatioValue = $("#glazing").val();
var glzOrWidth = false;
var sillHeightValue = $("#sill").val();
var distanceWindows = $('#distWindow').val();
var occDistToWallCenter = $("#occupantDist").val();
var occDistFromFacade = $('#distFromFacade').val();

if ($("#windowWidthCheck").is(":checked")) {
	glzOrWidth = false;
} else {
	glzOrWidth = true;
}

var outdoorTempValue = $("#outdoortemp").val();
var uvalueValue = $("#uvalue").val();
var intLowEChecked = $("#lowECheck").is(":checked"); //provides a true/false
var intLowEEmissivity = $("#lowE").val();
var rvalueValue = $("#rvalue").val();
var ppdValue = $("#ppd").val();

var airtempValue = $("#airtemp").val();
var radiantFloorChecked = $("#radiant").is(":checked"); //provides a true/false
var airspeedValue = $("#airspeed").val();
var humidityValue = $("#humidity").val();
var clothingValue = $("#clothing").val();
var metabolic = $("#metabolic").val();


var case2Data = {
	ceilingHeightValue: $("#ceiling2").val(),
	wallLen: $("#wallWidth2").val(),
	windowHeightValue: $("#windowHeight2").val(),
	windowWidthValue: $("#windowWidth2").val(),
	glzRatioValue: $("#glazing2").val(),

	sillHeightValue: $("#sill2").val(),
	distanceWindows: $('#distWindow2').val(),
	occDistToWallCenter: 1,
	occDistFromFacade: $('#distFromFacade2').val(),
	outdoorTempValue: $("#outdoortemp2").val(),

	uvalueValue: $("#uvalue2").val(),
	intLowEChecked: $("#lowECheck2").is(":checked"), //provides a true/false
	intLowEEmissivity: $("#lowE2").val(),
	rvalueValue: $("#rvalue2").val(),
	ppdValue: $("#ppd2").val(),

	airtempValue: $("#airtemp2").val(),
	radiantFloorChecked: $("#radiant2").is(":checked"),//provides a true/false
	airspeedValue: $("#airspeed2").val(),
	humidityValue: $("#humidity2").val(),
	clothingValue: $("#clothing2").val(),
	metabolic: $("#metabolic2").val(),
}






//ensure slider has correct max value
$("#occupantDist").attr("max", wallLen/2);



// Main function to run the analysis.
script.computeData = function(object) {
	// Compute the window and wall geometry.
	var geoResult = geo.createGlazingForRect(parseFloat(object.ceilingHeightValue), object.wallLen, object.glzRatioValue/100, parseFloat(object.windowWidthValue), parseFloat(object.windowHeightValue), parseFloat(object.sillHeightValue), parseFloat(object.distanceWindows), glzOrWidth);
	
	// Compute the view factors to make the graph.
	var viewResult = geo.computeAllViewFac(geoResult.wallCoords, geoResult.glzCoords, object.occDistToWallCenter)
	
	// Compute the PPD to make the graph.
	var comfortResult = comf.getFullPPD(viewResult.wallViews, viewResult.glzViews, viewResult.facadeDist, viewResult.windIntervals, object.occDistToWallCenter, geoResult.windowHeight, object.uvalueValue, object.intLowEChecked, object.intLowEEmissivity, object.rvalueValue, object.airtempValue, object.outdoorTempValue, object.radiantFloorChecked, object.clothingValue, object.metabolic, object.airspeedValue, object.humidityValue)
	

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
