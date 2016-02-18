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
			if (d.govfact = "mrt") {
				return "red";
			} else if (d.govfact = "dwn") {
				return "green";
			} else if (d.govfact = "asym") {
				return "blue";
			}
		})




	function updateGraphData(dataset) {

		console.log("updating plotted points");
		//update graph with revised data
		graphPoints.data(dataset)
			.attr("cx", function(d) { return x(d.dist); })
			.attr("cy", function(d) { return y(d.ppd); })
			.style("fill", function(d) { 
				if (d.govfact = "mrt") {
					return "red";
				} else if (d.govfact = "dwn") {
					return "green";
				} else if (d.govfact = "asym") {
					return "blue";
				}
			})
			.transition()
			.duration(500);

	}



	// DETECT CHANGES TO INPUT FIELDS
	$("#outdoortemp, #ceiling, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowECheck, #lowE, #rvalue, #airtemp, #radiant, #airspeed, #humidity, #clothing, #metabolic").change(function(event) {
		
		//figure out what input changed
		var triggeredChange = event.target.id;
		
		if (triggeredChange == "outdoortemp") {
			outdoorTempValue = $(this).val();
		}
		else if(triggeredChange == "ceiling") {
			ceilingHeightValue = $(this).val();
		}
		else if (triggeredChange == "windowHeight") {
			windowHeightValue = $(this).val();
		}
		else if (triggeredChange == "windowWidth") {
			windowWidthValue = $(this).val();
			//update boolean
			glzOrWidth = false;
			//update glazing ratio
			glzRatioValue = script.computeData().glzRatio*100;
		}
		else if (triggeredChange == "glazing") {
			glzRatioValue = $(this).val();
			//update boolean
			console.log("old: " + windowWidthValue);
			glzOrWidth = true;
			//update window width
			windowWidthValue = script.computeData().windowWidth;
			console.log("new: " + windowWidthValue);
		}
		else if (triggeredChange == "sill") {
			sillHeightValue = $(this).val();
		}
		else if (triggeredChange == "distWindow") {
			distanceWindows = $(this).val();
		}
		else if (triggeredChange == "uvalue") {
			uvalueValue = $(this).val();
		}
		else if (triggeredChange == "lowECheck") {

			if (($("#lowECheck").is(":checked")) == true) {
				intLowEChecked = true;
			} else if (($("#lowECheck").is(":checked")) == false) {
				intLowEChecked = false;
			}
		}
		else if (triggeredChange == "lowE") {
			intLowEEmissivity = $(this).val();
		}
		else if (triggeredChange == "rvalue") {
			rvalueValue = $(this).val();
		}
		else if (triggeredChange == "airtemp") {
			airtempValue = $(this).val();
		}
		else if (triggeredChange == "radiant") {
			if (($("#radiant").is(":checked")) == true) {
				radiantFloorChecked = true;
			} else if (($("#radiant").is(":checked")) == false) {
				radiantFloorChecked = false;
			}
		}
		else if (triggeredChange == "airspeed") {
			airspeedValue = $(this).val();
		}
		else if (triggeredChange == "humidity") {
			humidityValue = $(this).val();
		}
		else if (triggeredChange == "clothing") {
			clothingValue = $(this).val();
		}
		else if (triggeredChange == "metabolic") {
			metabolic = $(this).val();
		}
		else {
			alert("Don't know what changed!");
		}


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



