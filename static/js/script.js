var script = script || {}


//Pull the individual values from the form.
if ($("#windowWidthCheck").is(":checked")) {
	glzOrWidth = false;
} else {
	glzOrWidth = true;
}

var occDistFromFacade = $('#distFromFacade').val();
var ppdValue = $("#ppd").val();
var ppdValue2 = $("#ppd2").val();

// need to remove radiant floor from calculation
var radiantFloorChecked = $("#radiant").is(":checked"); //provides a true/false

var case1Data = {
	ceilingHeightValue: $("#ceiling").val(),
	wallLen: $("#wallWidth").val(),
	windowHeightValue: $("#windowHeight").val(),
	windowWidthValue: $("#windowWidth").val(),
	glzRatioValue: $("#glazing").val(),
	sillHeightValue: $("#sill").val(),
	distanceWindows: $('#distWindow').val(),

	occDistToWallCenter: $("#occupantDist").val(),

	uvalueValue: $("#uvalue").val(),
	calcUVal: $("#calcuvalue").val(),
	intLowEChecked: $("#lowECheck").is(":checked"), //provides a true/false
	intLowEEmissivity: $("#lowE").val(),

	outdoorTempValue: $("#outdoortemp").val(),
	airtempValue: $("#airtemp").val(),
	humidityValue: $("#humidity").val(),

	rvalueValue: $("#rvalue").val(),
	airspeedValue: $("#airspeed").val(),
	clothingValue: $("#clothing").val(),
	metabolic: $("#metabolic").val()
}



var case2Data = {
	ceilingHeightValue: $("#ceiling2").val(),
	wallLen: $("#wallWidth2").val(),
	windowHeightValue: $("#windowHeight2").val(),
	windowWidthValue: $("#windowWidth2").val(),
	glzRatioValue: $("#glazing2").val(),
	sillHeightValue: $("#sill2").val(),
	distanceWindows: $('#distWindow2').val(),

	occDistToWallCenter: $("#occupantDist2").val(),

	uvalueValue: $("#uvalue2").val(),
	calcUVal: $("#calcuvalue2").val(),
	intLowEChecked: $("#lowECheck2").is(":checked"), //provides a true/false
	intLowEEmissivity: $("#lowE2").val(),

	outdoorTempValue: $("#outdoortemp2").val(),
	airtempValue: $("#airtemp2").val(),
	humidityValue: $("#humidity2").val(),

	rvalueValue: $("#rvalue2").val(),
	airspeedValue: $("#airspeed2").val(),
	clothingValue: $("#clothing2").val(),
	metabolic: $("#metabolic2").val()
}


var case3Data = {
	ceilingHeightValue: $("#ceiling3").val(),
	wallLen: $("#wallWidth3").val(),
	windowHeightValue: $("#windowHeight3").val(),
	windowWidthValue: $("#windowWidth3").val(),
	glzRatioValue: $("#glazing3").val(),
	sillHeightValue: $("#sill3").val(),
	distanceWindows: $('#distWindow3').val(),

	occDistToWallCenter: $("#occupantDist3").val(),

	uvalueValue: $("#uvalue3").val(),
	calcUVal: $("#calcuvalue3").val(),
	intLowEChecked: $("#lowECheck3").is(":checked"), //provides a true/false
	intLowEEmissivity: $("#lowE3").val(),

	outdoorTempValue: $("#outdoortemp3").val(),
	airtempValue: $("#airtemp3").val(),
	humidityValue: $("#humidity3").val(),

	rvalueValue: $("#rvalue3").val(),
	airspeedValue: $("#airspeed3").val(),
	clothingValue: $("#clothing3").val(),
	metabolic: $("#metabolic3").val()
}

var changedVar = "ceilingHeightValue";
var unitSys;

if ($(".optionButton#IP").hasClass("selected") == true) {
	unitSys = "IP";
} else {
	unitSys = "SI";
}

// ensure slider has correct max value
$("#occupantDist").attr("max", case1Data.wallLen/2);


// Load up the json with all of the design temperatures.
script.readJsonFile = function(file){
	var allText = ""
	var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
	console.log(allText)
	var jsonObj = JSON.parse(allText);
	return jsonObj
}

var jsonData = script.readJsonFile('../static/json/test.json')

// Main function to run the analysis.
script.computeData = function(object) {
	// Compute the window and wall geometry.
	var geoResult = geo.createGlazingForRect(parseFloat(object.ceilingHeightValue), object.wallLen, object.glzRatioValue/100, parseFloat(object.windowWidthValue), parseFloat(object.windowHeightValue), parseFloat(object.sillHeightValue), parseFloat(object.distanceWindows), glzOrWidth, changedVar);
	// Compute the view factors to make the graph.
	var viewResult = geo.computeAllViewFac(geoResult.wallCoords, geoResult.glzCoords, object.occDistToWallCenter)
	// Compute the PPD to make the graph.
	var comfortResult = comf.getFullPPD(viewResult.wallViews, viewResult.glzViews, viewResult.facadeDist, viewResult.windIntervals, object.occDistToWallCenter, geoResult.windowHeight, geoResult.sillHeight, object.uvalueValue, object.intLowEChecked, object.intLowEEmissivity, parseFloat(object.rvalueValue), parseFloat(object.airtempValue), parseFloat(object.outdoorTempValue), radiantFloorChecked, parseFloat(object.clothingValue), parseFloat(object.metabolic), parseFloat(object.airspeedValue), parseFloat(object.humidityValue), ppdValue, ppdValue2)

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
	r.dwnPPDFac = comfortResult.dwnPPDFac;  // Boolean value for whether the occupant is in front of the window or not.


	return r
}


//Call the function to render the graph.
render.makeGraph();
