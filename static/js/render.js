

var render = render || {}

//function to make graph
render.makeGraph = function () {


	var maxContainerWidth = 550; // based on Payette website layout
	var blue = "rgb(0,160,221)";
	var orange = "rgb(248,151,29)";
	var green = "rgb(176,199,44)";
	var grey = "rgb(190,190,190)";
	var lightblue = "rgb(194,224,255)";
	var lightgrey = "rgb(245,245,245)";

	var allData = script.computeData();
	var dataset = allData.dataSet;
	var occPointData = allData.occPtInfo; 



	/* ------ SET UP GRAPH VARIABLES AND DATA FUNCTIONS ------ */
	var margin = {top: 57, right: 0, bottom: 50, left: 50},
    	width = maxContainerWidth - margin.left - margin.right,
    	height = 375 - margin.top - margin.bottom;


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


	// Draw PPD threshold so that it's behind the data and axes
	drawPPDThreshold(ppdValue);
	$('#ppd').change(function() {
		var newPPDValue = $(this).val();
		updatePPDThreshold(newPPDValue);	
	})


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
    .text("Dissatisfaction from Cold (%)");






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
	var graphPoints = graphSvg.selectAll(".dot") 
		.data(dataset) 
		.enter() 
		.append("circle") 
		.attr("class","dot")
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

	// Add point at occupant location
	var occupantPoint = graphSvg.append("circle") 
		.attr("class","occdot")
		.attr("r", 4)
		.attr("cx", function(d) { return x(occDistFromFacade); }) //replace with occPointData.dist
		.attr("cy", function(d) { return y(occPointData.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 3)
		.style("stroke", function(d) { 
			if (occPointData.govfact == "mrt") {
				return blue;
			} else if (occPointData.govfact == "dwn") {
				return orange;
			} else if (occPointData.govfact == "asym") {
				return green;
			}
		})

	// Add line at occupant location
	occupantDistanceRefLine(); 

	// add text at occupanct location
	thresholdDataText(occPointData);
	

	// Show text on hover over dot
	graphPoints.on("mouseover", function(d) {

		//Get this dots x/y values, then augment for the tooltip
		var xPosition = parseFloat(d3.select(this).attr("cx")) + margin.left;
		var yPosition = parseFloat(d3.select(this).attr("cy"));

		//Update the tooltip position and value
		d3.select("#tooltip")
			.style("left", xPosition + "px")
			.select("#PPDtext")
			.text(Math.round(d.ppd*10)/10 + "% PPD at " + d.dist + "ft from the façade");

		//tolerable discomfort
		if (ppdValue >= d.ppd) {
			d3.select("#discomfort")
			.text("Tolerable")
			.classed("tolerable", true)
			.classed("intolerable", false);
		
			d3.select("#solution")
			.text(".");

			d3.select("#tooltip")
			.style("top", (yPosition - margin.bottom/1.5) + "px")

		//intolerable discomfort
		} else {
			d3.select("#discomfort")
			.text("Intolerable")
			.classed("tolerable", false)
			.classed("intolerable", true);

			d3.select("#solution")
			.text(". Try adjusting the window geometry or U-Value.");

			d3.select("#tooltip")
			.style("top", (yPosition - margin.bottom*0.85) + "px")
		}
		//gov factors
		if (d.govfact == "mrt") {
			d3.select("#explain")
			.text("mean radiant temperature")
			.style("color", blue);
		} else if (d.govfact == "dwn") {
			d3.select("#explain")
			.text("downdraft")
			.style("color", orange);
		} else if (d.govfact == "asym") {
			d3.select("#explain")
			.text("asymmetry");
		}

		
   
		//Show the tooltip
		$("#tooltip").fadeIn(300);
		//Hide default text
		$("#thresholdTooltip").fadeOut(300);
		

   })
   .on("mouseout", function() {
   
		//Hide the tooltip
		$("#tooltip").fadeOut(300);
		//Show default text
		$("#thresholdTooltip").fadeIn(300);
		
   })









	/* ------ SET UP FACADE VARIABLES AND DATA FUNCTIONS ------ */
	var facMargin = {top: 25, right: 0, bottom: 5, left: 50};
	
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
				



	/* ------ MAKE THE FACADE ------ */
	//Initialize SVG
	var facadeSvg = d3.select("#facadeWrapper")
				.append("svg")
				.attr("id", "facade")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeight + facMargin.top + facMargin.bottom);

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
				return "translate(" + facMargin.left + "," + facMargin.top + ")"})
		.style("fill", grey);

	//Initialize the windows
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
		.style("fill", "url(#blueGradient)");

	
	//Add facade dimensions
	drawHorziontalDimensions(wallPoints[0].wallWidth, facHeight);
	
	//Ensure size of occupant image is correct
	checkOccupantImageSize();


	







	/* ---- SVG DEFINITIONS ---- */

	var defs = facadeSvg.append("defs");

	//arrowhead marker
	defs.append("marker")
	    .attr("id", "arrowhead")
	    .attr("refX", 6)
	    .attr("refY", 2)
	    .attr("viewBox", "0 0 6 6")
	    .attr("markerWidth", 8)
	    .attr("markerHeight", 8)
	    .attr("orient", "auto")
	    .append("path")
	    .attr("fill", "rgb(150,150,150)")
        .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead

    //gradient fill
    var blueGradient = defs.append("linearGradient")
    	.attr("id", "blueGradient")
    	.attr( 'x1', '0' )
        .attr( 'x2', '0' )
        .attr( 'y1', '0' )
        .attr( 'y2', '1' ); // makes vertical gradient

    blueGradient.append("stop")
    	.attr("class", "blueGradientStop1")
    	.attr("offset", "60%");

    blueGradient.append("stop")
    	.attr("class", "blueGradientStop2")
    	.attr("offset", "100%")





	/* ------ DETECT CHANGES TO INPUT VALUES ------ */

	// Trigger change events
	$("#outdoortemp, #ceiling, #wallWidth, #occupantDist, #distFromFacade, #ppd, #windowWidthCheck, #glazingRatioCheck, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowECheck, #lowE, #rvalue, #airtemp, #radiant, #airspeed, #humidity, #clothing, #metabolic").change(function(event) {
		
		//figure out what input changed
		var triggeredChange = event.target.id;
		
		if (triggeredChange == "outdoortemp") {
			outdoorTempValue = $(this).val();
		}
		else if(triggeredChange == "ceiling") {
			ceilingHeightValue = $(this).val();
			wallPoints[0].wallHeight = $(this).val(); //udpate wall geometry array
		}
		else if(triggeredChange == "wallWidth") {
			wallLen = $(this).val();
			wallPoints[0].wallWidth = $(this).val(); //udpate wall geometry array
			proportinateMultiplier = facWidth/wallPoints[0].wallWidth;
			facHeight = proportinateMultiplier*wallPoints[0].wallHeight;

			// Set up scale functions
			facadeScaleWidth = d3.scale.linear()
						.domain([0, wallPoints[0].wallWidth]) //input domain
						.range([0, facWidth]); //output range

			facadeScaleHeight = d3.scale.linear()
						.domain([0, wallPoints[0].wallHeight]) //input domain
						.range([0, facHeight]); //output range
			// Update dimensions
			facadeSvg.selectAll("#facadeWidth").remove()
			drawHorziontalDimensions(wallPoints[0].wallWidth, facHeight);

			$("#occupantDist").attr("max", wallLen/2);
			checkOccupantImageSize();
		}
		else if(triggeredChange == "occupantDist") {
			//assign new value
			occDistToWallCenter = $(this).val();
			$("#occupantDist").attr("value", occDistToWallCenter);

 			var slider = $("#occupantDist");
 			var width = slider.width();
 			var imageWidth = parseFloat($("#occupantImage").css("width"));

		 	var sliderScale = d3.scale.linear()
				.domain([slider.attr("min"), slider.attr("max")])
				.range([0, width]);

			var newPosition = sliderScale(occDistToWallCenter);

		   	// Move occupant image
		   	$("#occupantImage").css({
		       left: facWidth/2 + newPosition - imageWidth/2,
			})
		}
		else if(triggeredChange == "distFromFacade") {
			occDistFromFacade = $(this).val();
		}
		else if(triggeredChange == "ppd") {
			ppdValue = $(this).val();
		}
		else if (triggeredChange == "windowWidthCheck") {
			if (($("#windowWidthCheck").is(":checked")) == true) {
				glzOrWidth = false;
				$("#windowWidth").removeClass("inactive");
				$("#windowWidthLabel").removeClass("inactive");
				$("#glazing").addClass("inactive");
				$("#glazingLabel").addClass("inactive");

				$("#glazingRatioCheck").removeAttr("checked");

			} else if (($("#windowWidthCheck").is(":checked")) == false) {
				glzOrWidth = true;
				$("#windowWidth").addClass("inactive");
				$("#windowWidthLabel").addClass("inactive");
				$("#glazing").removeClass("inactive");
				$("#glazingLabel").removeClass("inactive");

				$("#glazingRatioCheck").attr("checked", "checked");
			}
		}
		else if (triggeredChange == "glazingRatioCheck") {
			if (($("#glazingRatioCheck").is(":checked")) == true) {
				glzOrWidth = true;
				$("#windowWidth").addClass("inactive");
				$("#windowWidthLabel").addClass("inactive");
				$("#glazing").removeClass("inactive");
				$("#glazingLabel").removeClass("inactive");

				$("#windowWidthCheck").removeAttr("checked");

			} else if (($("#glazingRatioCheck").is(":checked")) == false) {
				glzOrWidth = false;
				$("#windowWidth").removeClass("inactive");
				$("#windowWidthLabel").removeClass("inactive");
				$("#glazing").addClass("inactive");
				$("#glazingLabel").addClass("inactive");

				$("#windowWidthCheck").attr("checked", "checked");
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
		var newSillHeight = fullData.sillHeight;
		var newCentLineDist = fullData.centLineDist;
		var newOccLocData = fullData.occPtInfo;

		
		
		// Update the geometry values in the form.
		//update window width
		windowWidthValue = newGlzWidth;
		$("#windowWidth").val(Math.round(windowWidthValue * 100) / 100);

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
		updateGraphData(newDataset, newOccLocData);
		updateFacade(wallPoints, newGlzCoords, newGlzWidth, newGlzHeight); 

		// Update static tooltip text
		thresholdDataText(newOccLocData);


	})


	
	// Update when autocolculate U Value is pressed.
	$('#form').on('submit', function(event) {
		event.preventDefault();
		
		// Re-run the functions with the new inputs.
		var fullData = script.computeData()
		
		//Compute the U-Value required to make the occupant comfortable.
		uvalueValue = uVal.uValFinal(fullData.wallViews[12], fullData.glzViews[12], fullData.facadeDist[12], parseFloat(windowHeightValue), airtempValue, outdoorTempValue, rvalueValue, intLowEChecked, intLowEEmissivity, airspeedValue, humidityValue, metabolic, clothingValue, ppdValue)
		
		// Update the value in the form.
		$("#uvalue").val(Math.round(uvalueValue * 1000) / 1000);
		
		// Re-run the functions with the new inputs.
		var fullData = script.computeData()
		
		//update datasets with new value
		var newDataset = fullData.dataSet;
		var newGlzCoords = fullData.glzCoords;
		var newGlzWidth = fullData.windowWidth;
		var newGlzHeight = fullData.windowHeight;
		var newOccLocData = fullData.occPtInfo;
		
		// Update the PPD graph and facade SVG.
		updateGraphData(newDataset, newOccLocData);
		updateFacade(wallPoints, newGlzCoords, newGlzWidth, newGlzHeight); 

		thresholdDataText(newOccLocData);
		
	})

	

	/* ------ FUNCTIONS TO UPDATE VISUALS ------ */

	function updateGraphData(upDataset, upOccupantPoint) {

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

		console.log(upOccupantPoint);

		//update occupant point if different		
		d3.selectAll("circle.occdot")
			.attr("cx", function(d) { return x(occDistFromFacade); }) //replace with upOccupantPoint.dist
			.attr("cy", function(d) { return y(upOccupantPoint.ppd); })
			.style("stroke", function(d) { 
				if (upOccupantPoint.govfact == "mrt") {
					return blue;
				} else if (upOccupantPoint.govfact == "dwn") {
					return orange;
				} else if (upOccupantPoint.govfact == "asym") {
					return green;
				}
			})
			.transition()
			.duration(1000);

		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();
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

		facadeSvg.selectAll(".window")
			.data(glzData)
			.enter()
			.append("rect")
			.attr("class", "window")
			.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facWidth/2)})
			.attr("y", function(d) {return (facadeScaleHeight(wallPoints[0].wallHeight - d[3][2]))})
			.attr("width", facadeScaleWidth(newGlzWidth))
			.attr("height", facadeScaleHeight(newGlzHeight))
			.attr("transform", function() {
				return "translate(" + facMargin.left + "," + facMargin.top + ")";
			})
			.style("fill", "url(#blueGradient)");

		//update dimensions
		d3.select("#facadeWidth")
			.transition()
			.duration(500)
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top*0.75) + ")");

	}

	function checkOccupantImageSize() {
		// original image dimensions
		var originalHeight = 500;
		var originalWidth = 360;

		var resizeHeight = Math.round(facadeScaleHeight(4.25)); //assume 4.25ft sitting height
		var resizeWidth = Math.round((resizeHeight/originalHeight)*originalWidth);

		var newLeft = Math.round(facWidth/2 - resizeWidth/2);
		var newBottom = Math.round(resizeHeight + facMargin.bottom*2);

		var newbackgroundsize = resizeWidth.toString() + "px " + resizeHeight.toString() + "px";

		$("#occupantImage").css({
			width: resizeWidth,
			height: resizeHeight,
			left: newLeft,
			bottom: newBottom,
			backgroundSize: newbackgroundsize,
		})
	}
	



	/* ------ FUNCTIONS FOR GENERAL REFERENCE VISUALS ------ */

	// Display text for occupancy dist from facade
	function thresholdDataText(occdata) {

		var xPosition = parseFloat(d3.select("circle.occdot").attr("cx")) + margin.left;
		var yPosition = parseFloat(d3.select("circle.occdot").attr("cy"));

		d3.select("#thresholdTooltip")
		.style("left", xPosition + "px")
		.select("#thisPPDtext")
		.text(Math.round(occdata.ppd*10)/10 + "% PPD at " + occdata.dist + "ft from the façade");

		// tolerable discomfort
		if (ppdValue >= Math.round(occdata.ppd)) {

			d3.select("#thisDiscomfort")
			.text("Tolerable")
			.classed("tolerable", true)
			.classed("intolerable", false);

			d3.select("#thisSolution")
			.text(".");

			d3.select("#thresholdTooltip")
			.style("top", (yPosition - margin.bottom/1.5) + "px")

			$("#submitLabel").addClass("inactive");
		// intolerable discomfort
		} else {
			d3.select("#thisDiscomfort")
			.text("Intolerable")
			.classed("tolerable", false)
			.classed("intolerable", true);

			d3.select("#thisSolution")
			.text(". Try adjusting the window geometry or the auto-calculating U-Value.");

			$("#submitLabel").removeClass("inactive");

			d3.select("#thresholdTooltip")
			.style("top", (yPosition - margin.bottom*1.2) + "px")
		}

		//governing factor
		if (occdata.govfact == "mrt") {
			d3.select("#thisExplain")
			.text("mean radiant temperature")
			.style("color", blue);
		} else if (occdata.govfact == "dwn") {
			d3.select("#thisExplain")
			.text("downdraft")
			.style("color", orange);
		} else if (occdata.govfact == "asym") {
			d3.select("#thisExplain")
			.text("asymmetry");
		}
	} // end thresholdDataText


	function drawPPDThreshold(data) {

		//data = PPD threshold (ie 10%)

		// add shaded rectangle
		graphSvg.append("rect")
			.attr("class", "thresholdRect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width) //use width of graph
			.attr("height", function() { return y(data)})
			.attr("transform", function() {
					return "translate(" + margin.left + "," + margin.top + ")";})
			.style("fill", lightgrey);

		// add line
		graphSvg.append("line")
			.attr("class","refLine")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", y(data))
			.attr("y2", y(data))
			.attr("transform", function() {
					return "translate(" + margin.left + "," + margin.top + ")";})
			.style("stroke", "black");
	}

	function updatePPDThreshold(data) {
		d3.selectAll(".refLine")
			.transition()
			.duration(400)
			.attr("y1", y(data))
			.attr("y2", y(data));

		d3.selectAll(".thresholdRect")
			.transition()
			.duration(400)
			.attr("height", function() {return y(data)});
	}

	function occupantDistanceRefLine() {

		var xPosition = parseFloat(d3.select("circle.occdot").attr("cx"));
		var yPosition = parseFloat(d3.select("circle.occdot").attr("cy"));
		var padding = (d3.select("circle.occdot").attr("r"))*1.8;

		// add line
		graphSvg.append("line")
			.attr("class","occupantLine")
			.attr("x1", xPosition)
			.attr("x2", xPosition)
			.attr("y1", height - padding/2)
			.attr("y2", yPosition + padding)
			.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";
			});
	}


	function drawHorziontalDimensions(length, svgHeight) {

		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "facadeWidth")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top*0.7) + ")");

		var facWidthDimensions = facadeSvg.selectAll("#facadeWidth");

		facWidthDimensions.append("text") // add width label
			.attr("class", "axislabel")
			.attr("text-anchor", "middle")
		    .attr("x", function() {return facadeScaleWidth(length/2)})
		    .attr("y", 0)
		    .text("Wall Length: " + length + " ft");

		facWidthDimensions.append("line") // add line on left side of text
		    .attr("class", "dimline")
		    .attr("x2", 0)
			.attr("x1", function() {return facadeScaleWidth(length/2) - 50})
			.attr("y1", -4)
			.attr("y2", -4)
			.attr("marker-end", "url(#arrowhead)");

		facWidthDimensions.append("line") // add line on right side of text
		    .attr("class", "dimline")
		    .attr("x1", function() {return facadeScaleWidth(length/2) + 50})
			.attr("x2", function() {return facadeScaleWidth(length)})
			.attr("y1", -4)
			.attr("y2", -4)
			.attr("marker-end", "url(#arrowhead)");
	}



} //end makeGraph()









