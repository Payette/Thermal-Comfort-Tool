var script = script || {}


//Pull the individual values from the form.
var ceilingHeightValue = $("#ceiling").val();
var glzRatioValue = $("#glazing").val();
var windowHeightValue = $("#window").val();
var sillHeightValue = $("#sill").val();
var distanceWindows = $('#distWindow').val();

var outdoorTempValue = $("#outdoortemp").val();
var uvalueValue = $("#uvalue").val();
var rvalueValue = $("#rvalue").val();
var ppdValue = $("#ppd").val();

var airtempValue = $("#airtemp").val();
var airspeedValue = $("#airspeed").val();
var humidityValue = $("#humidity").val();
var clothingValue = $("#clothing").val();
var metabolic = $("#metabolic").val();

	
// submit form - not needed, but holding on for now...
$('#form').on('submit', function(event) {
	event.preventDefault();
	console.log("Inputs have been submitted")
	//call function to validate the inputs
	//validate();
	//use values
	script.computeData();
})


script.computeData = function() {
	//let the console know the function is running.
	console.log("cmpute Data Running!")
	
	// Compute the window and wall geometry.
	var geoResult = geo.createGlazingForRect(ceilingHeightValue, glzRatioValue, windowHeightValue, sillHeightValue, distanceWindows);
	
	// Compute the view factors.
	var viewResult = geo.computeAllViewFac(geoResult.wallCoords, geoResult.glzCoords)
	
	// Compute the PPD for each point.
	var dataset = comf.getFullPPD(viewResult.wallViews, viewResult.glzViews, windowHeightValue, uvalueValue, false, rvalueValue, airtempValue, outdoorTempValue, false, clothingValue, metabolic, airspeedValue, humidityValue)
	//console.log(dataset);

	// Return all of the information in one dictionary
	var r = {}
	r.wallCoords = geoResult.wallCoords
	r.glzCoords = geoResult.glzCoords
	r.dataSet = dataset
	
	return r
}

//Function that calculates the real data based on the inputs
var dataset = script.computeData().dataSet;

//Call the function to render the graph.
render.makeGraph();

//Call the function to render the facade
render.makeFacade();