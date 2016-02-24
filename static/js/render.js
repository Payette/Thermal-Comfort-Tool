var render = render || {}

//function to make graph
render.makeGraph = function () {


	var maxContainerWidth = 570; // based on Payette website layout


	console.log("making graph");
	var allData = script.computeData()
	var dataset = allData.dataSet

	/* ------ SET UP GRAPH VARIABLES AND DATA FUNCTIONS ------ */
	var margin = {top: 20, right: 40, bottom: 20, left: 40},
    	width = maxContainerWidth - margin.left - margin.right,
    	height = 470 - margin.top - margin.bottom;
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
	var graphSvg = d3.select("#graphWrapper")
				.append("svg")
				.attr("id", "graph")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);
	// add axes
	graphSvg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    	.call(xAxis);

	graphSvg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
	    .call(yAxis);





    /* ------ PLOT THE DATA ------ */
    // Add line between points
	var line = d3.svg.line()
				.x(function(d) {return x(d.dist);})
				.y(function(d) {return y(d.ppd);});

	graphSvg.append("path")
			.attr("class", "connectLine")
			.attr("d", line(dataset))
			.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
			.style("fill", "none")
			.style("stroke", "black");


    // Add dots at each point
	var graphPoints = graphSvg.selectAll(".dot") //select all class "dot" in <svg> (empty)
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
			} else if (d.govfact == "asym") {
				return "blue";
			}
		})







	/* ------ MAKE THE FACADE ------ */

	// wall coordinates
	var wallPoints = [{
		wallX: 0,
		wallWidth: wallLen, //use wallLen from geo.js as width
		wallHeight: ceilingHeightValue
	}];

	// window coordinates
	var glzCoords = allData.glzCoords;
	var glzWidth = allData.windowWidth;
	var glzHeight = allData.windowHeight;

	console.log(glzCoords);


	//Set SVG height to be proportionate to wall length and extend of wall height
	var proportionateSVGHeight = (maxContainerWidth/wallLen)*wallPoints[0].wallHeight;

	
	var facMargin = {top: 40, right: 40, bottom: 40, left: 40},
    	facWidth = maxContainerWidth - facMargin.left - facMargin.right,
    	facHeight = proportionateSVGHeight - facMargin.top - facMargin.bottom;
    


    var facadeScaleWidth = d3.scale.linear()
				.domain([0, wallPoints[0].wallWidth]) //input domain
				.range([0, facWidth]); //output range


	var facadeScaleHeight = d3.scale.linear()
				.domain([0, wallPoints[0].wallHeight]) //input domain
				.range([0, facHeight]); //output range
				

	// Define axes
	var xFacAxis = d3.svg.axis().scale(facadeScaleWidth).orient("top").ticks(20);
	var yFacAxis = d3.svg.axis().scale(facadeScaleHeight).orient("left").ticks(10);



	/* ------ MAKE THE FACADE ------ */
	//Initialize SVG
	var facadeSvg = d3.select("#facadeWrapper")
				.append("svg")
				.attr("id", "facade")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeight + facMargin.top + facMargin.bottom);

	// add axes for reference
	facadeSvg.append("g")
		.attr("class", "axis")
		.attr("id", "xAxis")
		.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top) + ")")
    	.call(xFacAxis);

	facadeSvg.append("g")
	    .attr("class", "axis")
	    .attr("id", "yAxis")
	    .attr("transform", "translate(" + facMargin.left + "," + (facMargin.top) + ")")
	    .call(yFacAxis);



	//Initialize wall facade
	var wall = facadeSvg.selectAll(".wall") 
		.data(wallPoints) 
		.enter() 
		.append("rect") 
		.attr("class","wall") 
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function(d) {return facadeScaleWidth(d.wallWidth)})
		.attr("height", function(d) {return facadeScaleHeight(d.wallHeight)})
		.attr("transform", function() {
				return "translate(" + facMargin.left + "," + facMargin.top + ")";})
		.style("fill", "lightgrey");



	var windows = facadeSvg.selectAll(".window")
		.data(glzCoords)
		.enter()
		.append("rect")
		.attr("class", "window")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facWidth/2)})
		.attr("y", function(d) {return facadeScaleHeight(wallPoints[0].wallHeight - glzHeight - sillHeightValue)})
		.attr("width", facadeScaleWidth(glzWidth))
		.attr("height", facadeScaleHeight(glzHeight))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
		});




	/* ------ DETECT CHANGES TO INPUT VALUES ------ */
	// Trigger change events
	$("#outdoortemp, #ceiling, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowECheck, #lowE, #rvalue, #airtemp, #radiant, #airspeed, #humidity, #clothing, #metabolic").change(function(event) {
		
		//figure out what input changed
		var triggeredChange = event.target.id;
		
		if (triggeredChange == "outdoortemp") {
			outdoorTempValue = $(this).val();
		}
		else if(triggeredChange == "ceiling") {
			ceilingHeightValue = $(this).val();
			wallPoints[0].wallHeight = $(this).val(); //udpate wall geometry array
		}
		else if (triggeredChange == "windowHeight") {
			windowHeightValue = $(this).val();
		}
		else if (triggeredChange == "windowWidth") {
			windowWidthValue = $(this).val();
			//update boolean
			glzOrWidth = false;
			//update glazing ratio
			glzRatioValue = allData.glzRatio*100;
			//display updated glazing ratio
			$("#glazing").val((Math.round(glzRatioValue)));
		}
		else if (triggeredChange == "glazing") {
			glzRatioValue = $(this).val();
			//update boolean
			glzOrWidth = true;
			//update window width
			windowWidthValue = allData.windowWidth;
			//display updated window width
			$("#windowWidth").val(windowWidthValue);
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
				$("#lowE").val(0.2);
				intLowEEmissivity = 0.2;
			} else if (($("#lowECheck").is(":checked")) == false) {
				intLowEChecked = false;
				$("#lowE").val(" ");
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


		//update datasets and graph with new value
		var fullData = script.computeData()
		var newDataset = fullData.dataSet;
		var newGlzCoords = fullData.glzCoords;
		var newGlzWidth = fullData.windowWidth;
		var newGlzHeight = fullData.windowHeight;

		updateGraphData(newDataset);
		updateFacade(wallPoints, newGlzCoords, newGlzWidth, newGlzHeight); 
	})




	/* ------ FUNCTIONS TO UPDATE VISUALS ------ */

	function updateGraphData(upDataset) {
		//update graph with revised data
		graphPoints.data(upDataset)
			.attr("cx", function(d) { return x(d.dist); })
			.attr("cy", function(d) { return y(d.ppd); })
			.style("fill", function(d) { 
				if (d.govfact == "mrt") {
					return "red";
				} else if (d.govfact == "dwn") {
					return "green";
				} else if (d.govfact == "asym") {
					return "blue";
				}
			})
			.transition()
			.duration(500);

		//update connection line
		graphSvg.selectAll(".connectLine")
			.attr("d", line(upDataset))
			.transition()
			.duration(500);
	}


	function updateFacade(wallData, glzData, newGlzWidth, newGlzHeight) {
		//Update svg size to match new ceiling height
		var newProportionateSVGHeight = (maxContainerWidth/wallData[0].wallWidth)*wallData[0].wallHeight;
		//redefine facade height
		facHeight = newProportionateSVGHeight - facMargin.top - facMargin.bottom;
		//update SVG with new height
		d3.select("#facade")
			.attr("height", facHeight + facMargin.top + facMargin.bottom)
			.transition()
			.duration(500);



		//update wall with revised data
		wall.data(wallData)
			.attr("width", function(d) {return facadeScaleWidth(d.wallWidth)})
			.attr("height", function(d) {return facadeScaleHeight(d.wallHeight)})
			.transition()
			.duration(500);



		//update windows
//TO DO - windows not centering properly on update, nor is width always updating......
		windows.data(glzData)
			.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facWidth/2)})
			.attr("y", function(d) {return facadeScaleHeight(wallPoints[0].wallHeight - glzHeight - sillHeightValue)})
			.attr("width", facadeScaleWidth(newGlzWidth))
			.attr("height", facadeScaleHeight(newGlzHeight))
			.transition()
			.duration(500);
	}




	function drawHorizontalReferenceLine(data) {
		// add line for UValue
		var lineMarker = graphSvg.append("line")
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
	$('#ppd').change(function() {
		var newPPDValue = $(this).val();
		updateReferenceLine(newPPDValue);	
	})


} //end makeGraph()









