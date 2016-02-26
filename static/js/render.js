var render = render || {}

//function to make graph
render.makeGraph = function () {


	var maxContainerWidth = 550; // based on Payette website layout
	var blue = "rgb(0,160,221)";
	var orange = "rgb(248,151,29)";
	var green = "rgb(176,199,44)";
	var grey = "rgb(190,190,190";
	var lightblue = "rgb(194,224,255)"

	var allData = script.computeData()
	var dataset = allData.dataSet

	/* ------ SET UP GRAPH VARIABLES AND DATA FUNCTIONS ------ */
	var margin = {top: 50, right: 0, bottom: 50, left: 50},
    	width = maxContainerWidth - margin.left - margin.right,
    	height = 470 - margin.top - margin.bottom;


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



	/* ------------------ MAKE THE GRAPH ------------------ */
	// Add SVG
	var graphSvg = d3.select("#graphWrapper")
				.append("svg")
				.attr("id", "graph")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);
	// add axes
	graphSvg.append("g")
		.attr("class", "axis")
		.attr("id", "graphXAxis")
		.attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    	.call(xAxis.ticks(6).tickValues([2, 4, 6, 8, 10, 12]));

	graphSvg.append("g")
	    .attr("class", "axis")
	    .attr("id", "graphYAxis")
	    .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
	    .call(yAxis.ticks(4));

	// add horizontal grid
	graphSvg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
        .call(yAxis
            .tickSize(-width, 0, 0)
            .tickFormat("")
            .ticks(7)
        );

    // add axes labels
   	graphSvg.append("text")
	    .attr("class", "axislabel")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2 + margin.left)
	    .attr("y", height + margin.bottom*1.8)
	    .text("Distance from Façade (ft)");

	graphSvg.append("g")
	.attr("transform", "translate(" + margin.left*.2 + "," + (height/2 + margin.top) + ")")
	.append("text")
    .attr("class", "axislabel")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("PPD (Percentage of People Dissatisfied)");




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
			.style("stroke", "rgb(90,90,90)")
			.style("stroke-width", .5);


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
				return blue;
			} else if (d.govfact == "dwn") {
				return orange;
			} else if (d.govfact == "asym") {
				return green;
			}
		})







	/* ------ SET UP FACADE VARIABLES AND DATA FUNCTIONS ------ */

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



	var facMargin = {top: 50, right: 0, bottom: 50, left: 50};

	// Set SVG height to be proportionate to wall length and extend of wall height

	var facWidth = maxContainerWidth - facMargin.left - facMargin.right;

	var proportinateMultiplier = facWidth/wallPoints[0].wallWidth;
    var facHeight = proportinateMultiplier*wallPoints[0].wallHeight;

	// Set up scale functions
    var facadeScaleWidth = d3.scale.linear()
				.domain([0, wallPoints[0].wallWidth]) //input domain
				.range([0, facWidth]); //output range

	var facadeScaleHeight = d3.scale.linear()
				.domain([0, wallPoints[0].wallHeight]) //input domain
				.range([0, facHeight]); //output range
				

	// Define axes
	var xFacAxis = d3.svg.axis().scale(facadeScaleWidth).orient("top").ticks(20);
	var yFacAxis = d3.svg.axis().scale(facadeScaleHeight).orient("left").ticks(15);



	/* ------ MAKE THE FACADE ------ */
	//Initialize SVG
	var facadeSvg = d3.select("#facadeWrapper")
				.append("svg")
				.attr("id", "facade")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeight + facMargin.top + facMargin.bottom);

/*//------ add axes for reference - TO BE DELETED
	facadeSvg.append("g")
		.attr("class", "facadeaxis")
		.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top) + ")")
    	.call(xFacAxis);

	facadeSvg.append("g")
	    .attr("class", "facadeaxis")
	    .attr("transform", "translate(" + facMargin.left + "," + (facMargin.top) + ")")
	    .call(yFacAxis);
*/


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
		.style("fill", grey);

	
	//Initialize the windows.
	facadeSvg.selectAll(".window")
		.data(glzCoords)
		.enter()
		.append("rect")
		.attr("class", "window")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facWidth/2)})
		.attr("y", function(d) {return (facadeScaleHeight(wallPoints[0].wallHeight - d[3][2]))})
		.attr("width", facadeScaleWidth(glzWidth))
		.attr("height", facadeScaleHeight(glzHeight))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
		})
		.style("fill", lightblue);




	//Add facade dimensions
	drawHorziontalDimensions(wallPoints[0].wallWidth, facHeight);



	/* ------ DETECT CHANGES TO INPUT VALUES ------ */
	// Trigger change events
	$("#outdoortemp, #ceiling, #windowWidthCheck, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowECheck, #lowE, #rvalue, #airtemp, #radiant, #airspeed, #humidity, #clothing, #metabolic").change(function(event) {
		
		//figure out what input changed
		var triggeredChange = event.target.id;
		
		
		if (triggeredChange == "outdoortemp") {
			outdoorTempValue = $(this).val();
		}
		else if(triggeredChange == "ceiling") {
			ceilingHeightValue = $(this).val();
			wallPoints[0].wallHeight = $(this).val(); //udpate wall geometry array
		}
		else if (triggeredChange == "windowWidthCheck") {
			if (($("#windowWidthCheck").is(":checked")) == true) {
				glzOrWidth = false;
				$("#windowWidth").removeClass("inactive");
				$("#windowWidthLabel").removeClass("inactive");
				$("#glazing").addClass("inactive");
				$("#glazingLabel").addClass("inactive");
			} else if (($("#windowWidthCheck").is(":checked")) == false) {
				glzOrWidth = true;
				$("#windowWidth").addClass("inactive");
				$("#windowWidthLabel").addClass("inactive");
				$("#glazing").removeClass("inactive");
				$("#glazingLabel").removeClass("inactive");
			}
		}
		else if (triggeredChange == "windowHeight") {
			windowHeightValue = $(this).val();
		}
		else if (triggeredChange == "windowWidth") {
			windowWidthValue = $(this).val();
		}
		else if (triggeredChange == "glazing") {
			glzRatioValue = $(this).val();
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

				$("#lowE").removeClass("inactive");
				$("#lowELabel").removeClass("inactive");

			} else if (($("#lowECheck").is(":checked")) == false) {
				intLowEChecked = false;
				$("#lowE").val(" ");
				$("#lowE").addClass("inactive");
				$("#lowELabel").addClass("inactive");
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
		
		// Re-run the functions with the new inputs.
		var fullData = script.computeData()
		
		//update datasets with new value
		var newDataset = fullData.dataSet;
		var newGlzCoords = fullData.glzCoords;
		var newGlzWidth = fullData.windowWidth;
		var newGlzHeight = fullData.windowHeight;
		var newGlzRatio = fullData.glzRatio;
		var newSillHeight = fullData.sillHeight
		var newCentLineDist = fullData.centLineDist
		
		
		// Update the geometry values in the form.
		//update window width
		windowWidthValue = newGlzWidth;
		$("#windowWidth").val(windowWidthValue);

		//update glazing ratio
		glzRatioValue = newGlzRatio*100;
		$("#glazing").val((Math.round(glzRatioValue)));

		//update window height.
		windowHeightValue = newGlzHeight;
		$("#windowHeight").val(Math.round(windowHeightValue * 100) / 100);
		//update sill
		sillHeightValue = newSillHeight;
		$("#sill").val(Math.round(sillHeightValue * 100) / 100);
		//update dist btwn windows.
		distanceWindows = newCentLineDist;
		$("#distWindow").val(Math.round(distanceWindows * 100) / 100);
		
		
		// Update the PPD graph and facade SVG.
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
					return blue;
				} else if (d.govfact == "dwn") {
					return orange;
				} else if (d.govfact == "asym") {
					return green;
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
		///Update svg size to match new ceiling height
		var newProportinateMultiplier = facWidth/wallData[0].wallWidth;

		//redefine facade height
		facHeight = newProportinateMultiplier*wallData[0].wallHeight;

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
		d3.selectAll("rect.window").remove()
		
		for (var i = 0; i < glzData.length; i++) {
			facadeSvg.append("rect")
				.attr("class", "window")
				.attr("x", function() {return (facadeScaleWidth(glzData[i][3][0])+facWidth/2)})
				.attr("y", function() {return (facadeScaleHeight(wallPoints[0].wallHeight - glzData[i][3][2]))})
				.attr("width", facadeScaleWidth(newGlzWidth))
				.attr("height", facadeScaleHeight(newGlzHeight))
				.attr("transform", function() {
					return "translate(" + facMargin.left + "," + facMargin.top + ")";
				})
				.style("fill", lightblue);
		}

		//update dimensions
		d3.select("#facadeWidth")
			.transition()
			.duration(500)
			.attr("transform", "translate(" + facMargin.left + "," + (facHeight + facMargin.bottom*1.4) + ")");

	}




	//create arrowhead marker
	facadeSvg.append("defs").append("marker")
	    .attr("id", "arrowhead")
	    .attr("refX", 6)
	    .attr("refY", 2)
	    .attr("viewBox", "0 0 6 6")
	    .attr("markerWidth", 8)
	    .attr("markerHeight", 8)
	    .attr("orient", "auto")
	    .append("path")
        .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead


	function drawHorziontalDimensions(length, svgHeight) {

		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "facadeWidth")
			.attr("transform", "translate(" + facMargin.left + "," + (svgHeight + facMargin.bottom*1.4) + ")");

		var facWidthDimensions = facadeSvg.selectAll("#facadeWidth");

		facWidthDimensions.append("text") // add width label
			.attr("class", "axislabel")
			.attr("text-anchor", "middle")
		    .attr("x", function() {return facadeScaleWidth(length/2)})
		    .attr("y", 0)
		    .text(length + " ft");

		facWidthDimensions.append("line") // add line on left side of text
		    .attr("class", "dimline")
		    .attr("x2", 0)
			.attr("x1", function() {return facadeScaleWidth(length/2) - 20})
			.attr("y1", -4)
			.attr("y2", -4)
			.attr("marker-end", "url(#arrowhead)");

		facWidthDimensions.append("line") // add line on right side of text
		    .attr("class", "dimline")
		    .attr("x1", function() {return facadeScaleWidth(length/2) + 20})
			.attr("x2", function() {return facadeScaleWidth(length)})
			.attr("y1", -4)
			.attr("y2", -4)
			.attr("marker-end", "url(#arrowhead)");
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









