var script = script || {}


//Pull the individual values from the form.
var ceilingHeightValue = $("#ceiling").val();
var windowHeightValue = $("#windowHeight").val();
var windowWidthValue = $("#windowWidth").val();
var glzRatioValue = $("#glazing").val();
var sillHeightValue = $("#sill").val();
var distanceWindows = $('#distWindow').val();

var outdoorTempValue = $("#outdoortemp").val();
var uvalueValue = $("#uvalue").val();
var intLowEChecked = $("#lowECheck").val();
var intLowEEmissivity = $("#lowE").val();
var rvalueValue = $("#rvalue").val();
var ppdValue = $("#ppd").val();

var airtempValue = $("#airtemp").val();
var airspeedValue = $("#airspeed").val();
var humidityValue = $("#humidity").val();
var clothingValue = $("#clothing").val();
var metabolic = $("#metabolic").val();



script.computeData = function() {
	//let the console know the function is running.
	console.log("Compute Data is Running!")
	
	// Compute the window and wall geometry.
	var geoResult = geo.createGlazingForRect(parseFloat(ceilingHeightValue), glzRatioValue/100, parseFloat(windowWidthValue), parseFloat(windowHeightValue), parseFloat(sillHeightValue), parseFloat(distanceWindows), true);
	
	// Compute the view factors.
	var viewResult = geo.computeAllViewFac(geoResult.wallCoords, geoResult.glzCoords)
	
	// Compute the PPD for each point.
	var dataset = comf.getFullPPD(viewResult.wallViews, viewResult.glzViews, windowHeightValue, uvalueValue, false, rvalueValue, airtempValue, outdoorTempValue, false, clothingValue, metabolic, airspeedValue, humidityValue)

	// Return all of the information in one dictionary
	var r = {}
	r.wallCoords = geoResult.wallCoords;
	r.glzCoords = geoResult.glzCoords;
	r.glzRatio = geoResult.glzRatio;
	r.windowWidth = geoResult.windowWidth;
	r.dataSet = dataset;
	
	return r
}

//Function that calculates the real data based on the inputs
var dataset = script.computeData().dataSet;

//Call the function to render the graph.
render.makeGraph();

//Call the function to render the facade
render.makeFacade();