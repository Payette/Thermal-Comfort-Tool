




$('#form').on('submit', function(event) {
	event.preventDefault();
	console.log("Inputs have been submitted")
	//call function to validate the inputs
	//validate();
	//use values
	doSomethingWithValues();
})


function doSomethingWithValues() {

	//returns name value objects in an array
	var inputValues = $('#form').serializeArray();
	console.log(inputValues);


	//individual values
	var outdoorTempValue = $("#outdoortemp").val();
	var ceilingHeightValue = $("#ceiling").val();
	var windowHeightValue = $("#window").val();
	var sillHeightValue = $("#sill").val();
	var uvalueValue = $("#uvalue").val();
	var rvalueValue = $("#rvalue").val();
	var ppdValue = $("#ppd").val();
	var airtempValue = $("#airtemp").val();
	var srftempValue = $("#srftemp").val();
	var airspeedValue = $("#airspeed").val();
	var humidityValue = $("#humidity").val();
	var clothingValue = $("#clothing").val();
	var metabolic = $("#metabolic").val();

}




var dataset = [
		{
			dist: 1,
			uval: 0.15,
			govfact: "dwn"
		},
		{
			dist: 2,
			uval: 0.17,
			govfact: "dwn"
		},
		{
			dist: 3,
			uval: 0.22,
			govfact: "dwn"
		},
		{
			dist: 4,
			uval: 0.27,
			govfact: "mrt"
		},
		{
			dist: 5,
			uval: 0.31,
			govfact: "mrt"
		},
		{
			dist: 6,
			uval: 0.35,
			govfact: "mrt"
		},
		{
			dist: 7,
			uval: 0.4,
			govfact: "mrt"
		},
		{
			dist: 8,
			uval: 0.47,
			govfact: "mrt"
		},
		{
			dist: 9,
			uval: 0.51,
			govfact: "dwn"
		},
		{
			dist: 10,
			uval: 0.51,
			govfact: "dwn"
		},
		{
			dist: 11,
			uval: 0.51,
			govfact: "dwn"
		},
		{
			dist: 12,
			uval: 0.51,
			govfact: "dwn"
		}

	];
makeGraph();