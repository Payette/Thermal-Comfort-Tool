var script = script || {}


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
	//define a variable that holds all of the results.
	var r = {}
	
	//returns name value objects in an array
	//var inputValues = $('#form').serializeArray();
	//console.log(inputValues);

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
	var srftempValue = $("#srftemp").val();
	var airspeedValue = $("#airspeed").val();
	var humidityValue = $("#humidity").val();
	var clothingValue = $("#clothing").val();
	var metabolic = $("#metabolic").val();
	
	// Compute the window and wall geometry.
	var geoResult = geo.createGlzForRect(ceilingHeightValue, glzRatioValue, windowHeightValue, sillHeightValue, distanceWindows);
	r.wallCoords = geoResult.wallCoords
	r.glzCoords = geoResult.glzCoords
	
	// Compute the view factors.
	
	
	// Compute the PPD for each point.
	
	
	return r
}

//Function that calculates the real data based on the inputs
var dataset = script.computeData()
// Dummy data for the time being.
var dataset = [
		{
			dist: 1,
			ppd: 0.15,
			govfact: "dwn"
		},
		{
			dist: 2,
			ppd: 0.17,
			govfact: "dwn"
		},
		{
			dist: 3,
			ppd: 0.22,
			govfact: "dwn"
		},
		{
			dist: 4,
			ppd: 0.27,
			govfact: "mrt"
		},
		{
			dist: 5,
			ppd: 0.31,
			govfact: "mrt"
		},
		{
			dist: 6,
			ppd: 0.35,
			govfact: "mrt"
		},
		{
			dist: 7,
			ppd: 0.4,
			govfact: "mrt"
		},
		{
			dist: 8,
			ppd: 0.47,
			govfact: "mrt"
		},
		{
			dist: 9,
			ppd: 0.51,
			govfact: "dwn"
		},
		{
			dist: 10,
			ppd: 0.51,
			govfact: "dwn"
		},
		{
			dist: 11,
			ppd: 0.51,
			govfact: "dwn"
		},
		{
			dist: 12,
			ppd: 0.51,
			govfact: "dwn"
		}

	];

//Call the function to render the graph.
render.makeGraph();