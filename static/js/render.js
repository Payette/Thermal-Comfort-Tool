var render = render || {}

//function to make graph
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
			.domain([0, 30]);


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





    /* ------ PLOT THE DATA ------ */
    // PLOT EACH POINT
	var graphPoints = svg.selectAll(".dot") //select all class "dot" in <svg> (empty)
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




	function updateGraphData(dataset) {

		console.log("updating plotted points");
		//update graph with revised data
		graphPoints.data(dataset)
			.attr("cx", function(d) { return x(d.dist); })
			.attr("cy", function(d) { return y(d.ppd); })
			.transition()
			.duration(500);

	}


	// DETECT CHANGES TO INPUT FIELDS
	$("#window").change(function() {
		//get changed value
		windowHeightValue = $(this).val();

		//update dataset and graph with new value
		var newDataset = script.computeData().dataSet;
		updateGraphData(newDataset);

	})



	
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





	// if in VERIFICATION graph mode...
	drawHorizontalReferenceLine(ppdValue);

	// detect change to PPD Value, then update horizontal reference line
	$('#ppd').change(function()
	{
		var newPPDValue = $(this).val();
		updateReferenceLine(newPPDValue);
		
	})



} //end makeGraph()



//function to make graph
render.makeFacade = function () {

	//console.log("rendering facade");
	//var wallPoints = script.computeData().wallCoords;
	//var windowPoints = script.computeData().glzCoords;
	//console.log(wallPoints);


		//var newWallCoords = script.computeData().wallCoords;
		//var newGlzCoords = script.computeData().glzCoords;

} //end makeFacade()



