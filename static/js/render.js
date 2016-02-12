var render = render || {}

render.makeGraph = function () {

	console.log("making graph");

	/* ------ SET UP VARIABLES AND DATA FUNCTIONS ------ */

	var margin = {top: 40, right: 60, bottom: 40, left: 60},
    	width = 600 - margin.left - margin.right,
    	height = 600 - margin.top - margin.bottom;
    	//padding = allObjectsDataset.length * 1.35;



	// Set up scale functions
	// x-axis: distance from facade
	var x = d3.scale.linear()
			.range([0, width]) // value -> display
			.domain([0, 13]);
	// y-axis: U-Value
	var y = d3.scale.linear()
			.range([height, 0])
			.domain([0, 1]);


	// Define axes
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");



	/* ------ MAKE THE GRAPH ------ */

	//Create SVG
	var svg = d3.select("body")
				.append("svg")
				.attr("id", "graph")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

	// add axes
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    	.call(xAxis);

	svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
	    .call(yAxis);


	/*var xAxisG = svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate(" + margin.left + ",34)")
		.call(xAxis);*/





    /* ------ PLOT THE DATA ------ */
    // PLOT EACH POINT
	var objects = svg.selectAll(".dot") //select all class "dot" in <svg> (empty)
		.data(dataset) // join the selection to a data array
		.enter() // create a selection for the data objects that didn't match elements (all)
		.append("circle") // add a new circle for each data object
		.attr("class","dot") // set the class to match selection criteria
		.attr("r", 3)
		.attr("cx", function(d) { return x(d.dist); })
		.attr("cy", function(d) { return y(d.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", function(d) { 
			if (d.govfact == "mrt") {
				return "red";
			} else if (d.govfact == "dwn") {
				return "green";
			} else {
				return "blue";
			}
		})



	
	// add horizontal reference line
	// TO DO: if PPD vs UValue, change detection should call different functions
	function drawHorizontalReferenceLine(data) {
		// add line for UValue
		var lineMarker = svg.append("line")
			.attr("class","refLine")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", y(data))
			.attr("y2", y(data))
			.attr("transform", function() {
					return "translate(" + margin.left + "," + margin.top + ")";})
			.style("stroke", "black");
	}


	function updateReferenceLine(data) {
		d3.selectAll(".refLine")
			.transition()
			.duration(400)
			.attr("y1", y(data))
			.attr("y2", y(data));
	}




	// variables for non-computed elements on graph
	var uvalueValue = $("#uvalue").val();
	var ppdValue = $("#ppd").val();


	

	// if in UValue graph mode...
	// TO DO: RIGHT IF STATEMENTS
		drawHorizontalReferenceLine(uvalueValue);

		// change to UValue updates horizontal reference line
		$('#uvalue').change(function()
		{
			var newUValue = $(this).val();
			console.log('uvalue change detected. new uvalue is ' + newUValue);

			updateReferenceLine(newUValue);
			
		})


	
	// if in PPD graph mode
		/*drawHorizontalReferenceLine(ppdValue);

		// change to PPD Value updates horizontal reference line
		$('#ppd').change(function()
		{
			var newPPDValue = $(this).val();
			console.log('ppd value change detected. new ppd is ' + newPPDValue);

			updateReferenceLine(newPPDValue);
			
		})*/



} //end makeGraph()



