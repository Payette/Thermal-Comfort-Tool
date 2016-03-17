

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


	// Case 1 Data
	var allData = script.computeData(case1Data);
	var dataset = allData.dataSet;
	var occPointData = allData.occPtInfo;

	//Case 2 Data
	var allData2 = script.computeData(case2Data);
	var dataset2 = allData2.dataSet;
	var occPointData2 = allData2.occPtInfo;

	//Case 3 Data
	var allData3 = script.computeData(case3Data);
	var dataset3 = allData3.dataSet;
	var occPointData3 = allData3.occPtInfo;


	/* ------ SET UP GRAPH VARIABLES AND DATA FUNCTIONS ------ */
	var margin = {top: 57, right: 0, bottom: 75, left: 50},
    	width = maxContainerWidth - margin.left - margin.right,
    	height = 400 - margin.top - margin.bottom;


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
	    .attr("y", height + margin.bottom*1.3)
	    .text("Distance from Façade (ft)");

	graphSvg.append("g")
	.attr("transform", "translate(" + margin.left*0.2 + "," + (height/2 + margin.top) + ")")
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
			.style("stroke", orange)
			.style("stroke-width", .5);

	graphSvg.append("path")
			.attr("class", "connectLine2")
			.attr("d", line(dataset2))
			.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
			.style("fill", "none")
			.style("stroke", blue)
			.style("stroke-width", .5);

	graphSvg.append("path")
			.attr("class", "connectLine3")
			.attr("d", line(dataset3))
			.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
			.style("fill", "none")
			.style("stroke", green)
			.style("stroke-width", .5);


    // Add dots at each point
	var graphPoints = graphSvg.selectAll(".dotCase1") 
		.data(dataset) 
		.enter() 
		.append("circle") 
		.attr("class","dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.dist); })
		.attr("cy", function(d) { return y(d.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", orange);

	var graphCase2Points = graphSvg.selectAll(".dotCase2") 
		.data(dataset2) 
		.enter() 
		.append("circle") 
		.attr("class","dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.dist); })
		.attr("cy", function(d) { return y(d.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", blue);

	var graphCase3Points = graphSvg.selectAll(".dotCase2") 
		.data(dataset3) 
		.enter() 
		.append("circle") 
		.attr("class","dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.dist); })
		.attr("cy", function(d) { return y(d.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", green);

	// Add point at occupant location
	var occupantPoint = graphSvg.append("circle") 
		.attr("class","occdot1")
		.attr("r", 4)
		.attr("cx", function(d) { return x(occPointData.dist); })
		.attr("cy", function(d) { return y(occPointData.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 3)
		.style("stroke", orange);

	var occupantPoint2 = graphSvg.append("circle") 
		.attr("class","occdot2")
		.attr("r", 4)
		.attr("cx", function(d) { return x(occPointData2.dist); })
		.attr("cy", function(d) { return y(occPointData2.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 3)
		.style("stroke", blue);

	var occupantPoint3 = graphSvg.append("circle") 
		.attr("class","occdot3")
		.attr("r", 4)
		.attr("cx", function(d) { return x(occPointData3.dist); })
		.attr("cy", function(d) { return y(occPointData3.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 3)
		.style("stroke", green);

	// Add line at occupant location
	//occupantDistanceRefLine(); 

	// add text and reference line at occupanct location
	if (occPointData.ppd >= occPointData2.ppd && occPointData.ppd >= occPointData3.ppd) {
		thresholdDataText(occPointData, "circle.occdot");
	} else if (occPointData2.ppd >= occPointData.ppd && occPointData2.ppd >= occPointData3.ppd) {
		thresholdDataText(occPointData2, "circle.occdot2");
	} else if (occPointData3.ppd >= occPointData.ppd && occPointData3.ppd >= occPointData2.ppd) {
		thresholdDataText(occPointData3, "circle.occdot3");
	}
	


	
	
	// Show text on hover over dot
	var points = d3.selectAll(".dot");
	points.on("mouseover", function(d) {

		//Get this dots x/y values, then augment for the tooltip
		var xPosition = parseFloat(d3.select(this).attr("cx")) + margin.left;
		var yPosition = parseFloat(d3.select(this).attr("cy"));

		//Update the tooltip position and value
		d3.select("#tooltip")
			.style("left", xPosition + "px")
			.select("#PPDtext")
			.text(Math.round(d.ppd*10)/10 + "% PPD at " + d.dist + " ft from the façade");

		//tolerable discomfort
		if (ppdValue >= d.ppd) {
			d3.select("#discomfort")
			.text("Tolerable")
			.classed("tolerable", true)
			.classed("intolerable", false);
		
			d3.select("#solution")
			.text(".");

			d3.select("#tooltip")
			.style("top", (yPosition - margin.bottom/2) + "px")

			if (d.govfact == "mrt") {
				d3.select("#explain")
				.text("a low mean radiant temperature")
				.style("color", blue);
			} else if (d.govfact == "dwn") {
				d3.select("#explain")
				.text("downdraft")
				.style("color", orange);
			} 
		//intolerable discomfort
		} else {
			d3.select("#discomfort")
			.text("Intolerable")
			.classed("tolerable", false)
			.classed("intolerable", true);

			
			//gov factors
			if (d.govfact == "mrt") {
				d3.select("#explain")
				.text("a low mean radiant temperature")
				.style("color", blue);

				d3.select("#solution")
				.text(". Try adjusting the window geometry or reducing the U-value.");

				d3.select("#tooltip")
				.style("top", (yPosition - margin.bottom/1.2) + "px");

			} else if (d.govfact == "dwn") {
				d3.select("#explain")
				.text("downdraft")
				.style("color", orange);

				d3.select("#solution")
				.text(". Try reducing the window height or U-value.");

				d3.select("#tooltip")
				.style("top", (yPosition - margin.bottom/1.6) + "px");

			} 
		}
		

		

   
		//Show the tooltip
		$("#tooltip").fadeIn(300);
		//Hide default text
		$("#thresholdTooltip").fadeOut(300);
		
  	})
   	.on("mouseout", function() {
   		//Hide the tooltip
   		$("#tooltip").fadeOut(300);
   		//wait 1sec, then check if 'new' tooltip is present
   		setTimeout(checkTooltip, 1000);
   	})

   	
	function checkTooltip() {
		// if hover tooltip is no longer visible
		if ($("#tooltip").css("display") == "none") {
			//Show default text
			$("#thresholdTooltip").fadeIn(300);
		}
	}









/* ------ SET UP FACADE VARIABLES AND DATA FUNCTIONS ------ */
	var facMargin = {top: 10, right: 3, bottom: 5, left: 50};
	
	// wall coordinates
	var wallPointsCase1 = [{
		wallX: 0,
		wallWidth: case1Data.wallLen, 
		wallHeight: case1Data.ceilingHeightValue
	}];
	var wallPointsCase2 = [{
		wallX: 0,
		wallWidth: case2Data.wallLen, 
		wallHeight: case2Data.ceilingHeightValue
	}];
	var wallPointsCase3 = [{
		wallX: 0,
		wallWidth: case3Data.wallLen, 
		wallHeight: case3Data.ceilingHeightValue
	}];



	// window coordinates
	var glzCoords = allData.glzCoords;
	var glzWidth = allData.windowWidth;
	var glzHeight = allData.windowHeight;

	var glzCoordsCase2 = allData2.glzCoords;
	var glzWidthCase2 = allData2.windowWidth;
	var glzHeightCase2 = allData2.windowHeight;

	var glzCoordsCase3 = allData3.glzCoords;
	var glzWidthCase3 = allData3.windowWidth;
	var glzHeightCase3 = allData3.windowHeight;

	
	// Set SVG height to be proportionate to wall length and extend of wall height

	var facWidth = maxContainerWidth - facMargin.left - facMargin.right;

	// longest wall length
	var governingWallLength;

	//if only case 1 is shown, use its wall length
	if ($("#case1Label").hasClass("unselected") == false && $("#case2Label").hasClass("unselected") == true && $("#case3Label").hasClass("unselected") == true) {
		governingWallLength = case1Data.wallLen;
	}

	// if both case 1 and case 2 are selected
	if ($("#case1Label").hasClass("unselected") == false && $("#case2Label").hasClass("unselected") == false && $("#case3Label").hasClass("unselected") == true) {

		//check which wall is longer
		if ( case1Data.wallLen >= case2Data.wallLen) {
			governingWallLength = case1Data.wallLen;
		} else {
			governingWallLength = case2Data.wallLen;
		}
	}

	// if both case 1 and case 3 are selected
	if ($("#case1Label").hasClass("unselected") == false && $("#case2Label").hasClass("unselected") == true && $("#case3Label").hasClass("unselected") == false) {

		//check which wall is longer
		if ( case1Data.wallLen >= case3Data.wallLen) {
			governingWallLength = case1Data.wallLen;
		} else {
			governingWallLength = case3Data.wallLen;
		}
	}

	// if both case 2 and case 3 are selected
	if ($("#case1Label").hasClass("unselected") == true && $("#case2Label").hasClass("unselected") == false && $("#case3Label").hasClass("unselected") == false) {

		//check which wall is longer
		if ( case2Data.wallLen >= case3Data.wallLen) {
			governingWallLength = case2Data.wallLen;
		} else {
			governingWallLength = case3Data.wallLen;
		}
	}

	// if all case are selected
	if ($("#case1Label").hasClass("unselected") == false && $("#case2Label").hasClass("unselected") == false && $("#case3Label").hasClass("unselected") == false) {

		//check which wall is longer
		if (case1Data.wallLen >= case2Data.wallLen && case1Data.wallLen >= case3Data.wallLen) {
			governingWallLength = case1Data.wallLen;
		} else if (case2Data.wallLen >= case1Data.wallLen && case2Data.wallLen >= case3Data.wallLen){
			governingWallLength = case2Data.wallLen;
		} else if (case3Data.wallLen >= case1Data.wallLen && case3Data.wallLen >= case2Data.wallLen){
			governingWallLength = case3Data.wallLen;
		}
	}




	var proportinateMultiplier = facWidth/governingWallLength;

	var facHeightCase1 = proportinateMultiplier*case1Data.ceilingHeightValue;
	var facHeightCase2 = proportinateMultiplier*case2Data.ceilingHeightValue;
	var facHeightCase3 = proportinateMultiplier*case3Data.ceilingHeightValue;


	// Set up scale functions - do I need scale functions for each wall????
	var facadeScaleWidth = d3.scale.linear()
				.domain([0, governingWallLength]) //input domain
				.range([0, facWidth]); //output range

	var facadeScaleHeightCase1 = d3.scale.linear()
				.domain([0, case1Data.ceilingHeightValue]) //input domain
				.range([0, facHeightCase1]); //output range

	var facadeScaleHeightCase2 = d3.scale.linear()
				.domain([0, case2Data.ceilingHeightValue]) //input domain
				.range([0, facHeightCase2]); //output range

	var facadeScaleHeightCase3 = d3.scale.linear()
				.domain([0, case3Data.ceilingHeightValue]) //input domain
				.range([0, facHeightCase3]); //output range
				



/* ------ MAKE THE FACADE ------ */
// Case 1 Facade
	var facadeSvgCase1 = d3.select("#case1FacadeWrapper")
				.append("svg")
				.attr("id", "facadeCase1")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeightCase1 + facMargin.top + facMargin.bottom);

	var wallCase1 = facadeSvgCase1.append("rect") 
		.attr("class","wall1") 
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function(d) {return facadeScaleWidth(case1Data.wallLen)})
		.attr("height", function(d) {return facadeScaleHeightCase1(case1Data.ceilingHeightValue)})
		.attr("transform", function() {
				return "translate(" + facMargin.left + "," + facMargin.top + ")"})
		.style("fill", grey);

	facadeSvgCase1.selectAll(".window")
		.data(glzCoords)
		.enter()
		.append("rect")
		.attr("class", "window")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case1Data.wallLen)/2)})
		.attr("y", function(d) {return (facadeScaleHeightCase1(case1Data.ceilingHeightValue - d[3][2]))})
		.attr("width", facadeScaleWidth(glzWidth))
		.attr("height", facadeScaleHeightCase1(glzHeight))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
		})
		.style("fill", "url(#blueGradient)");


// Case 2 Facade
	var facadeSvgCase2 = d3.select("#case2FacadeWrapper")
				.append("svg")
				.attr("id", "facadeCase2")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeightCase2 + facMargin.top + facMargin.bottom);

	var wallCase2 = facadeSvgCase2.append("rect") 
		.attr("class","wall2") 
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function(d) {return facadeScaleWidth(case2Data.wallLen)})
		.attr("height", function(d) {return facadeScaleHeightCase2(case2Data.ceilingHeightValue)})
		.attr("transform", function() {
				return "translate(" + facMargin.left + "," + facMargin.top + ")"})
		.style("fill", grey);

	facadeSvgCase2.selectAll(".window")
		.data(glzCoordsCase2)
		.enter()
		.append("rect")
		.attr("class", "window")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case2Data.wallLen)/2)})
		.attr("y", function(d) {return (facadeScaleHeightCase2(case2Data.ceilingHeightValue - d[3][2]))})
		.attr("width", facadeScaleWidth(glzWidthCase2))
		.attr("height", facadeScaleHeightCase2(glzHeightCase2))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
		})
		.style("fill", "url(#blueGradient)");


// Case 3 Facade
	var facadeSvgCase3 = d3.select("#case3FacadeWrapper")
				.append("svg")
				.attr("id", "facadeCase3")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeightCase3 + facMargin.top + facMargin.bottom);

	var wallCase3 = facadeSvgCase3.append("rect") 
		.attr("class","wall3") 
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function(d) {return facadeScaleWidth(case3Data.wallLen)})
		.attr("height", function(d) {return facadeScaleHeightCase2(case3Data.ceilingHeightValue)})
		.attr("transform", function() {
				return "translate(" + facMargin.left + "," + facMargin.top + ")"})
		.style("fill", grey);

	facadeSvgCase3.selectAll(".window")
		.data(glzCoordsCase3)
		.enter()
		.append("rect")
		.attr("class", "window")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case3Data.wallLen)/2)})
		.attr("y", function(d) {return (facadeScaleHeightCase3(case3Data.ceilingHeightValue - d[3][2]))})
		.attr("width", facadeScaleWidth(glzWidthCase3))
		.attr("height", facadeScaleHeightCase2(glzHeightCase3))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
		})
		.style("fill", "url(#blueGradient)");











	//Initialize the windows
/*	facadeSvg.selectAll(".window")
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
	drawHorziontalDimensions(wallPoints[0].wallWidth);
	drawVerticalDimensions(wallPoints[0].wallHeight);
	
	//Ensure size of occupant image is correct
	checkOccupantImageSize();


	//Add window dimensions
	windowDimensions(glzCoords, glzWidth, glzHeight);*/





	
/*
	$("#windHeightButt").on("mouseover", function() {
		$("#windowHeightDimLabel, #windowHeightDim").fadeIn("fast");
	})
	$("#windHeightButt").on("mouseout", function() {
		$("#windowHeightDimLabel, #windowHeightDim").fadeOut("fast");
	})

	$("#windWidthButt").on("mouseover", function() {
		$("#windowWidthDim").fadeIn("fast");
	})
	$("#windWidthButt").on("mouseout", function() {
		$("#windowWidthDim").fadeOut("fast");
	})

	$("#sillHeightButt").on("mouseover", function() {
		$("#sillHeightDim, #sillHeightDimLabelTop, #sillHeightDimLabelBottom").fadeIn("fast");
	})
	$("#sillHeightButt").on("mouseout", function() {
		$("#sillHeightDim, #sillHeightDimLabelTop, #sillHeightDimLabelBottom").fadeOut("fast");
	})

	$("#windSepButt").on("mouseover", function() {
		$("#windowSepDim").fadeIn("fast");
	})
	$("#windSepButt").on("mouseout", function() {
		$("#windowSepDim").fadeOut("fast");
	})
*/

	/*$("#submit").on("mouseover", function() {
		$("#submit").removeClass("inactive");
	})
	$("#submit").on("mouseout", function() {
		$("#submit").addClass("inactive");
	})*/








	/* ---- SVG DEFINITIONS ---- */

	var defs = facadeSvgCase1.append("defs");
	var defsCase2 = facadeSvgCase2.append("defs");
	var defsCase3 = facadeSvgCase3.append("defs");

	//arrowhead marker
    var arrow = defs.append("marker")
	    .attr("id", "arrowhead")
	    .attr("refX", 3.5)
	    .attr("refY", 3.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto");
	arrow.append("line")
	    .attr("stroke", "#777")
        .attr("x1", "0")
        .attr("x2", "6")
        .attr("y1", "0")
        .attr("y2", "6");


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

    var blueGradient2 = defsCase2.append("linearGradient")
    	.attr("id", "blueGradient")
    	.attr( 'x1', '0' )
        .attr( 'x2', '0' )
        .attr( 'y1', '0' )
        .attr( 'y2', '1' ); // makes vertical gradient
    blueGradient2.append("stop")
    	.attr("class", "blueGradientStop1")
    	.attr("offset", "60%");
    blueGradient2.append("stop")
    	.attr("class", "blueGradientStop2")
    	.attr("offset", "100%")

    var blueGradient3 = defsCase3.append("linearGradient")
    	.attr("id", "blueGradient")
    	.attr( 'x1', '0' )
        .attr( 'x2', '0' )
        .attr( 'y1', '0' )
        .attr( 'y2', '1' ); // makes vertical gradient
    blueGradient3.append("stop")
    	.attr("class", "blueGradientStop1")
    	.attr("offset", "60%");
    blueGradient3.append("stop")
    	.attr("class", "blueGradientStop2")
    	.attr("offset", "100%")





	/* ------ DETECT CHANGES TO INPUT VALUES ------ */
	$("#distFromFacade, #distFromFacade2, #distFromFacade3").change(function(event) {
		occDistFromFacade = $(this).val();

		$("#distFromFacade, #distFromFacade2, #distFromFacade3").val(occDistFromFacade);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	});
	$("#distFromFacade").on("spinstop", function(event) {
		occDistFromFacade = $(this).val();

		$("#distFromFacade, #distFromFacade2, #distFromFacade3").val(occDistFromFacade);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#ppd, #ppd2, #ppd3").change(function(event) {
		if ($(this).val() <= 4) {
			ppdValue = 5;
			$("#ppd, #ppd2, #ppd3").val(5);
		}
		else if ($(this).val() >30) {
			ppdValue = 30;
			$("#ppd, #ppd2, #ppd3").val(30);
		}
		else {
			ppdValue = $(this).val();
			$("#ppd, #ppd2, #ppd3").val(ppdValue);
		}
		// Update target PPD threshold line
		updatePPDThreshold(ppdValue);	
	});
	$("#ppd, #ppd2, #ppd3").on("spinstop", function(event) {
		ppdValue = $(this).val();
		$("#ppd, #ppd2, #ppd3").val(ppdValue);

		updatePPDThreshold(ppdValue);	
	})

	$("#windowWidthCheck").change(function(event) {
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
	});
	$("#glazingRatioCheck").change(function(event) {
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
	})
	
	$("#outdoortemp").change(function(event) {
		outdoorTempValue = $(this).val();

		$("#outdoortemp, #outdoortemp2, #outdoortemp3").val(outdoorTempValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#outdoortemp").on("spinstop", function(event) {
		outdoorTempValue = $(this).val();
		$("#outdoortemp, #outdoortemp2, #outdoortemp3").val(outdoorTempValue);
		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#airtemp, #airtemp2, #airtemp3").change(function(event) {
		airtempValue = $(this).val();
		$("#airtemp, #airtemp2, #airtemp3").val(airtempValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	});
	$("#airtemp").on("spinstop", function(event) {
		airtempValue = $(this).val();
		$("#airtemp, #airtemp2, #airtemp3").val(airtempValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#humidity").change(function(event) {
		humidityValue = $(this).val();

		$("#humidity, #humidity2, #humidity3").val(humidityValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#humidity").on("spinstop", function(event) {
		humidityValue = $(this).val();

		$("#humidity, #humidity2, #humidity3").val(humidityValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#radiant, #radiant2, #radiant3").change(function(event) {
		if (($("#radiant").is(":checked")) == true) {
			radiantFloorChecked = true;
		} else if (($("#radiant").is(":checked")) == false) {
			radiantFloorChecked = false;
		}

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	
	$("#airspeed, #airspeed2, #airspeed3").change(function(event) {
		airspeedValue = $(this).val();

		$("#airspeed, #airspeed2, #airspeed3").val(airspeedValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#airspeed").on("spinstop", function(event) {
		airspeedValue = $(this).val();

		$("#airspeed, #airspeed2, #airspeed3").val(airspeedValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	
	$("#clothing").change(function(event) {
		clothingValue = $(this).val();

		$("#clothing, #clothing2, #clothing3").val(clothingValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#clothing").on("spinstop", function(event) {
		clothingValue = $(this).val();

		$("#clothing, #clothing2, #clothing3").val(clothingValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#metabolic").change(function(event) {
		metabolic = $(this).val();

		$("#metabolic, #metabolic2, #metabolic3").val(metabolic);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#metabolic").on("spinstop", function(event) {
		metabolic = $(this).val();

		$("#metabolic, #metabolic2, #metabolic3").val(metabolic);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})




	// Case 1 - Changes based on typed inputs
	$("#ceiling, #wallWidth, #occupantDist, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowECheck, #lowE, #rvalue").change(function(event) {
		
		//figure out what input changed
		var triggeredChange = event.target.id;
		
		
		if(triggeredChange == "ceiling") {
			case1Data.ceilingHeightValue = $(this).val();
			wallPointsCase1[0].wallHeight = $(this).val(); //udpate wall geometry array
		}
		else if(triggeredChange == "wallWidth") {
			case1Data.wallLen = $(this).val();
			wallPointsCase1[0].wallWidth = $(this).val(); //udpate wall geometry array
			proportinateMultiplier = facWidth/wallPointsCase1[0].wallWidth;
			facHeight = proportinateMultiplier*wallPointsCase1[0].wallHeight;

			// Set up scale functions
			facadeScaleWidth = d3.scale.linear()
						.domain([0, wallPointsCase1[0].wallWidth]) //input domain
						.range([0, facWidth]); //output range

			facadeScaleHeight = d3.scale.linear()
						.domain([0, wallPointsCase1[0].wallHeight]) //input domain
						.range([0, facHeight]); //output range
			

			$("#occupantDist").attr("max", case1Data.wallLen/2);
			checkOccupantImageSize();
		}
		else if(triggeredChange == "occupantDist") {
			//assign new value
			case1Data.occDistToWallCenter = $(this).val();
			$("#occupantDist").attr("value", case1Data.occDistToWallCenter);

 			var slider = $("#occupantDist");
 			var width = slider.width();
 			var imageWidth = parseFloat($("#occupantImage").css("width"));

		 	var sliderScale = d3.scale.linear()
				.domain([slider.attr("min"), slider.attr("max")])
				.range([0, width]);

			var newPosition = sliderScale(case1Data.occDistToWallCenter);

		   	// Move occupant image
		   	$("#occupantImage").css({
		       left: facWidth/2 + newPosition - imageWidth/2,
			})
		}
		
		else if (triggeredChange == "windowHeight") {
			case1Data.windowHeightValue = $(this).val();
		}
		else if (triggeredChange == "windowWidth") {
			case1Data.windowWidthValue = $(this).val();
		}
		else if (triggeredChange == "glazing") {
			case1Data.glzRatioValue = $(this).val();
		}
		else if (triggeredChange == "sill") {
			case1Data.sillHeightValue = $(this).val();
		}
		else if (triggeredChange == "distWindow") {
			case1Data.distanceWindows = $(this).val();
		}

		else if (triggeredChange == "uvalue") {
			case1Data.uvalueValue = $(this).val();
		}
		else if (triggeredChange == "lowECheck") {

			if (($("#lowECheck").is(":checked")) == true) {
				case1Data.intLowEChecked = true;
				$("#lowE").val(0.2);
				case1Data.intLowEEmissivity = 0.2;

				$("#lowE").removeClass("inactive");
				$("#lowELabel").removeClass("inactive");

			} else if (($("#lowECheck").is(":checked")) == false) {
				case1Data.intLowEChecked = false;
				$("#lowE").val(" ");
				$("#lowE").addClass("inactive");
				$("#lowELabel").addClass("inactive");
			}
		}
		else if (triggeredChange == "lowE") {
			case1Data.intLowEEmissivity = $(this).val();
		}
		else if (triggeredChange == "rvalue") {
			case1Data.rvalueValue = $(this).val();
		}
		
		else {
			alert("Don't know what changed!");
		}
		
		
		updateData(case1Data);
	})

	// Case 1 - Changes based on increment buttons
		$("#ceiling").on("spinstop", function(event) {
			case1Data.ceilingHeightValue = $(this).val();
			wallPointsCase1[0].wallHeight = $(this).val();

			updateData(case1Data);
		})
		
		$("#wallWidth").on("spinstop", function(event) {
			case1Data.wallLen = $(this).val();
			wallPointsCase1[0].wallWidth = $(this).val(); //udpate wall geometry array
			proportinateMultiplier = facWidth/wallPointsCase1[0].wallWidth;
			facHeight = proportinateMultiplier*wallPointsCase1[0].wallHeight;

			// Set up scale functions
			facadeScaleWidth = d3.scale.linear()
						.domain([0, wallPointsCase1[0].wallWidth]) //input domain
						.range([0, facWidth]); //output range

			facadeScaleHeight = d3.scale.linear()
						.domain([0, wallPointsCase1[0].wallHeight]) //input domain
						.range([0, facHeight]); //output range
			

			$("#occupantDist").attr("max", case1Data.wallLen/2);
			checkOccupantImageSize();

			updateData(case1Data);
		})


		$("#windowHeight").on("spinstop", function(event) {
			case1Data.windowHeightValue = $(this).val();
			updateData(case1Data);
		})

		$("#windowWidth").on("spinstop", function(event) {
			case1Data.windowWidthValue = $(this).val();
			updateData(case1Data);
		})

		$("#glazing").on("spinstop", function(event) {
			case1Data.glzRatioValue = $(this).val();
			updateData(case1Data);
		})

		$("#sill").on("spinstop", function(event) {
			case1Data.sillHeightValue = $(this).val();

			updateData(case1Data);
		})

		$("#distWindow").on("spinstop", function(event) {
			case1Data.distanceWindows = $(this).val();

			updateData(case1Data);
		})

		$("#uvalue").on("spinstop", function(event) {
			case1Data.uvalueValue = $(this).val();

			updateData(case1Data);
		})

		$("#lowE").on("spinstop", function(event) {
			case1Data.intLowEEmissivity = $(this).val();

			updateData(case1Data);
		})

		$("#rvalue").on("spinstop", function(event) {
			case1Data.rvalueValue = $(this).val();

			updateData(case1Data);
		})

		
	// Case 2 - Changes based on typed inputs
	$("#ceiling2, #wallWidth2, #occupantDist2, #windowHeight2, #windowWidth2, #glazing2, #sill2, #distWindow2, #uvalue2, #lowECheck2, #lowE2, #rvalue2").change(function(event) {
		
		//figure out what input changed
		var triggeredChange = event.target.id;
		
		
		if(triggeredChange == "ceiling2") {
			case2Data.ceilingHeightValue = $(this).val();
			wallPointsCase2[0].wallHeight = $(this).val(); //udpate wall geometry array
		}
		else if(triggeredChange == "wallWidth2") {
			case2Data.wallLen = $(this).val();
			wallPointsCase2[0].wallWidth = $(this).val(); //udpate wall geometry array
			proportinateMultiplier = facWidth/wallPointsCase2[0].wallWidth;
			facHeight = proportinateMultiplier*wallPointsCase2[0].wallHeight;

			// Set up scale functions
			facadeScaleWidth = d3.scale.linear()
						.domain([0, wallPointsCase2[0].wallWidth]) //input domain
						.range([0, facWidth]); //output range

			facadeScaleHeight = d3.scale.linear()
						.domain([0, wallPointsCase2[0].wallHeight]) //input domain
						.range([0, facHeight]); //output range
			

			$("#occupantDist2").attr("max", case2Data.wallLen/2);
			checkOccupantImageSize();
		}
		else if(triggeredChange == "occupantDist2") {
			//assign new value
			case2Data.occDistToWallCenter = $(this).val();
			$("#occupantDist2").attr("value", case2Data.occDistToWallCenter);

 			var slider = $("#occupantDist2");
 			var width = slider.width();
 			var imageWidth = parseFloat($("#occupantImage2").css("width"));

		 	var sliderScale = d3.scale.linear()
				.domain([slider.attr("min"), slider.attr("max")])
				.range([0, width]);

			var newPosition = sliderScale(case1Data.occDistToWallCenter);

		   	// Move occupant image
		   	$("#occupantImage2").css({
		       left: facWidth/2 + newPosition - imageWidth/2,
			})
		}
		
		else if (triggeredChange == "windowHeight2") {
			case2Data.windowHeightValue = $(this).val();
		}
		else if (triggeredChange == "windowWidth2") {
			case2Data.windowWidthValue = $(this).val();
		}
		else if (triggeredChange == "glazing2") {
			case2Data.glzRatioValue = $(this).val();
		}
		else if (triggeredChange == "sill2") {
			case2Data.sillHeightValue = $(this).val();
		}
		else if (triggeredChange == "distWindow2") {
			case2Data.distanceWindows = $(this).val();
		}

		else if (triggeredChange == "uvalue2") {
			case2Data.uvalueValue = $(this).val();
		}
		else if (triggeredChange == "lowECheck2") {

			if (($("#lowECheck2").is(":checked")) == true) {
				case2Data.intLowEChecked = true;
				$("#lowE2").val(0.2);
				case2Data.intLowEEmissivity = 0.2;

				$("#lowE2").removeClass("inactive");
				$("#lowELabel2").removeClass("inactive");

			} else if (($("#lowECheck2").is(":checked")) == false) {
				case2Data.intLowEChecked = false;
				$("#lowE2").val(" ");
				$("#lowE2").addClass("inactive");
				$("#lowELabel2").addClass("inactive");
			}
		}
		else if (triggeredChange == "lowE2") {
			case2Data.intLowEEmissivity = $(this).val();
		}
		else if (triggeredChange == "rvalue2") {
			case2Data.rvalueValue = $(this).val();
		}
		
		else {
			alert("Don't know what changed!");
		}
		
		
		updateData(case2Data);
	})

	// Case 2 - Changes based on increment buttons
		$("#ceiling2").on("spinstop", function(event) {
			case2Data.ceilingHeightValue = $(this).val();
			wallPointsCase2[0].wallHeight = $(this).val();

			updateData(case2Data);
		})
		
		$("#wallWidth2").on("spinstop", function(event) {
			case2Data.wallLen = $(this).val();
			wallPointsCase2[0].wallWidth = $(this).val(); //udpate wall geometry array
			proportinateMultiplier = facWidth/wallPointsCase2[0].wallWidth;
			facHeight = proportinateMultiplier*wallPointsCase2[0].wallHeight;

			// Set up scale functions
			facadeScaleWidth = d3.scale.linear()
						.domain([0, wallPointsCase2[0].wallWidth]) //input domain
						.range([0, facWidth]); //output range

			facadeScaleHeight = d3.scale.linear()
						.domain([0, wallPointsCase2[0].wallHeight]) //input domain
						.range([0, facHeight]); //output range
			

			$("#occupantDist2").attr("max", case2Data.wallLen/2);
			checkOccupantImageSize();

			updateData(case2Data);
		})


		$("#windowHeight2").on("spinstop", function(event) {
			case2Data.windowHeightValue = $(this).val();
			updateData(case2Data);
		})

		$("#windowWidth2").on("spinstop", function(event) {
			case2Data.windowWidthValue = $(this).val();
			updateData(case2Data);
		})

		$("#glazing2").on("spinstop", function(event) {
			case2Data.glzRatioValue = $(this).val();
			updateData(case2Data);
		})

		$("#sill2").on("spinstop", function(event) {
			case2Data.sillHeightValue = $(this).val();

			updateData(case2Data);
		})

		$("#distWindow2").on("spinstop", function(event) {
			case2Data.distanceWindows = $(this).val();

			updateData(case2Data);
		})

		$("#uvalue2").on("spinstop", function(event) {
			case2Data.uvalueValue = $(this).val();

			updateData(case2Data);
		})

		$("#lowE2").on("spinstop", function(event) {
			case2Data.intLowEEmissivity = $(this).val();

			updateData(case2Data);
		})

		$("#rvalue2").on("spinstop", function(event) {
			case2Data.rvalueValue = $(this).val();

			updateData(case2Data);
		})


	// Case 3 - Changes based on typed inputs
	$("#ceiling3, #wallWidth3, #occupantDist3, #windowHeight3, #windowWidth3, #glazing3, #sill3, #distWindow3, #uvalue3, #lowECheck3, #lowE3, #rvalue3").change(function(event) {
		
		//figure out what input changed
		var triggeredChange = event.target.id;
		
		
		if(triggeredChange == "ceiling3") {
			case3Data.ceilingHeightValue = $(this).val();
			wallPointsCase3[0].wallHeight = $(this).val(); //udpate wall geometry array
		}
		else if(triggeredChange == "wallWidth3") {
			case3Data.wallLen = $(this).val();
			wallPointsCase3[0].wallWidth = $(this).val(); //udpate wall geometry array
			proportinateMultiplier = facWidth/wallPointsCase3[0].wallWidth;
			facHeight = proportinateMultiplier*wallPointsCase3[0].wallHeight;

			// Set up scale functions
			facadeScaleWidth = d3.scale.linear()
						.domain([0, wallPointsCase3[0].wallWidth]) //input domain
						.range([0, facWidth]); //output range

			facadeScaleHeight = d3.scale.linear()
						.domain([0, wallPointsCase3[0].wallHeight]) //input domain
						.range([0, facHeight]); //output range
			

			$("#occupantDist3").attr("max", case3Data.wallLen/2);
			checkOccupantImageSize();
		}
		else if(triggeredChange == "occupantDist3") {
			//assign new value
			case3Data.occDistToWallCenter = $(this).val();
			$("#occupantDist3").attr("value", case3Data.occDistToWallCenter);

 			var slider = $("#occupantDist3");
 			var width = slider.width();
 			var imageWidth = parseFloat($("#occupantImage3").css("width"));

		 	var sliderScale = d3.scale.linear()
				.domain([slider.attr("min"), slider.attr("max")])
				.range([0, width]);

			var newPosition = sliderScale(case3Data.occDistToWallCenter);

		   	// Move occupant image
		   	$("#occupantImage3").css({
		       left: facWidth/2 + newPosition - imageWidth/2,
			})
		}
		
		else if (triggeredChange == "windowHeight3") {
			case3Data.windowHeightValue = $(this).val();
		}
		else if (triggeredChange == "windowWidth3") {
			case3Data.windowWidthValue = $(this).val();
		}
		else if (triggeredChange == "glazing3") {
			case3Data.glzRatioValue = $(this).val();
		}
		else if (triggeredChange == "sill3") {
			case3Data.sillHeightValue = $(this).val();
		}
		else if (triggeredChange == "distWindow3") {
			case3Data.distanceWindows = $(this).val();
		}

		else if (triggeredChange == "uvalue3") {
			case3Data.uvalueValue = $(this).val();
		}
		else if (triggeredChange == "lowECheck3") {

			if (($("#lowECheck3").is(":checked")) == true) {
				case3Data.intLowEChecked = true;
				$("#lowE3").val(0.2);
				case3Data.intLowEEmissivity = 0.2;

				$("#lowE3").removeClass("inactive");
				$("#lowELabel3").removeClass("inactive");

			} else if (($("#lowECheck3").is(":checked")) == false) {
				case3Data.intLowEChecked = false;
				$("#lowE3").val(" ");
				$("#lowE3").addClass("inactive");
				$("#lowELabel3").addClass("inactive");
			}
		}
		else if (triggeredChange == "lowE3") {
			case3Data.intLowEEmissivity = $(this).val();
		}
		else if (triggeredChange == "rvalue3") {
			case3Data.rvalueValue = $(this).val();
		}
		
		else {
			alert("Don't know what changed!");
		}
		
		
		updateData(case3Data);
	})

	// Case 3 - Changes based on increment buttons
		$("#ceiling3").on("spinstop", function(event) {
			case3Data.ceilingHeightValue = $(this).val();
			wallPointsCase3[0].wallHeight = $(this).val();

			updateData(case3Data);
		})
		
		$("#wallWidth2").on("spinstop", function(event) {
			case3Data.wallLen = $(this).val();
			wallPointsCase3[0].wallWidth = $(this).val(); //udpate wall geometry array
			proportinateMultiplier = facWidth/wallPointsCase3[0].wallWidth;
			facHeight = proportinateMultiplier*wallPointsCase3[0].wallHeight;

			// Set up scale functions
			facadeScaleWidth = d3.scale.linear()
						.domain([0, wallPointsCase3[0].wallWidth]) //input domain
						.range([0, facWidth]); //output range

			facadeScaleHeight = d3.scale.linear()
						.domain([0, wallPointsCase3[0].wallHeight]) //input domain
						.range([0, facHeight]); //output range
			

			$("#occupantDist3").attr("max", case3Data.wallLen/2);
			checkOccupantImageSize();

			updateData(case3Data);
		})


		$("#windowHeight3").on("spinstop", function(event) {
			case3Data.windowHeightValue = $(this).val();
			updateData(case3Data);
		})

		$("#windowWidth3").on("spinstop", function(event) {
			case3Data.windowWidthValue = $(this).val();
			updateData(case3Data);
		})

		$("#glazing3").on("spinstop", function(event) {
			case3Data.glzRatioValue = $(this).val();
			updateData(case3Data);
		})

		$("#sill3").on("spinstop", function(event) {
			case3Data.sillHeightValue = $(this).val();

			updateData(case3Data);
		})

		$("#distWindow3").on("spinstop", function(event) {
			case3Data.distanceWindows = $(this).val();

			updateData(case3Data);
		})

		$("#uvalue3").on("spinstop", function(event) {
			case3Data.uvalueValue = $(this).val();

			updateData(case3Data);
		})

		$("#lowE3").on("spinstop", function(event) {
			case3Data.intLowEEmissivity = $(this).val();

			updateData(case3Data);
		})

		$("#rvalue3").on("spinstop", function(event) {
			case3Data.rvalueValue = $(this).val();

			updateData(case3Data);
		})




	// Called after adjusting values based on change events
	function updateData(object) {
		// Re-run the functions with the new inputs.
		var fullData = script.computeData(object);
		
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
/*		windowWidthValue = newGlzWidth;
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
		*/

		// Update the PPD graph and facade SVG.
		if (object == case1Data) {
			updateGraphData(newDataset, newOccLocData, graphPoints, ".connectLine", "circle.occdot1", orange);
		}
		
		else if (object == case2Data) {
			updateGraphData(newDataset, newOccLocData, graphCase2Points, ".connectLine2", "circle.occdot2", blue);
		}

		else if (object == case3Data) {
			updateGraphData(newDataset, newOccLocData, graphCase3Points, ".connectLine3", "circle.occdot3", green);
		}

		//updateFacade(wallPoints, newGlzCoords, newGlzWidth, newGlzHeight); 

		// Update static tooltip text
		//thresholdDataText(newOccLocData);

		
	}


	


	
	// Update when autocalculate U Value is pressed.
	$('#form').on('submit', function(event) {
		event.preventDefault();
		
		// Re-run the functions with the new inputs.
		var fullData = script.computeData()
		
		//Compute the U-Value required to make the occupant comfortable.
		uvalueValue = uVal.uValFinal(fullData.wallViews[12], fullData.glzViews[12], fullData.facadeDist[12], fullData.runDownCalc, parseFloat(windowHeightValue), airtempValue, outdoorTempValue, rvalueValue, intLowEChecked, intLowEEmissivity, airspeedValue, humidityValue, metabolic, clothingValue, ppdValue)
		
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

	function updateGraphData(upDataset, upOccupantPoint, dotSelector, lineSelector, occSelector, color) {

		//update graph with revised data
		dotSelector.data(upDataset)
			.attr("cx", function(d) { return x(d.dist); })
			.attr("cy", function(d) { return y(d.ppd); })
			.style("fill", color)
			.transition()
			.duration(500);


		//update connection line
		graphSvg.selectAll(lineSelector)
			.attr("d", line(upDataset))
			.transition()
			.duration(500);

		//update occupant point if different		
		d3.selectAll(occSelector)
			.attr("cx", function(d) { return x(upOccupantPoint.dist); })
			.attr("cy", function(d) { return y(upOccupantPoint.ppd); })
			.style("stroke", color)
			.transition()
			.duration(1000);

		//d3.selectAll(".occupantLine").remove();
		//occupantDistanceRefLine();
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


		// Update dimensions
		facadeSvg.selectAll("#facadeWidth, #facadeHeightDim, #facadeHeightDimLabel, #windowHeightDimLabel, #windowHeightDim, #sillHeightDim, #sillHeightDimLabelTop, #sillHeightDimLabelBottom, #windowSepDim").remove();
		drawHorziontalDimensions(wallPoints[0].wallWidth);
		drawVerticalDimensions(wallPoints[0].wallHeight);
		windowDimensions(glzData, newGlzWidth, newGlzHeight);

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
	function thresholdDataText(occdata, className) {

	
		var xPosition = parseFloat(d3.select(className).attr("cx")) + margin.left;
		var yPosition = parseFloat(d3.select(className).attr("cy"));

		d3.select("#thresholdTooltip")
		.style("left", xPosition + "px")
		.select("#thisPPDtext")
		.text(Math.round(occdata.ppd*10)/10 + "% PPD at " + occdata.dist + " ft from the façade");

		// tolerable discomfort
		if (ppdValue >= Math.round(occdata.ppd)) {

			d3.select("#thisDiscomfort")
			.text("Tolerable")
			.classed("tolerable", true)
			.classed("intolerable", false);

			d3.select("#thisSolution")
			.text(".");

			//governing factor
			if (occdata.govfact == "mrt") {
				d3.select("#thisExplain")
				.text("a low mean radiant temperature")
				.style("color", blue);

			} else if (occdata.govfact == "dwn") {
				d3.select("#thisExplain")
				.text("downdraft")
				.style("color", orange);
			}

			d3.select("#thresholdTooltip")
			.style("top", (yPosition - margin.bottom/2) + "px")


		// intolerable discomfort
		} else {
			d3.select("#thisDiscomfort")
			.text("Intolerable")
			.classed("tolerable", false)
			.classed("intolerable", true);

			//governing factor
			if (occdata.govfact == "mrt") {
				d3.select("#thisExplain")
				.text("a low mean radiant temperature")
				.style("color", blue);

				d3.select("#thisSolution")
				.text(". Try adjusting the window geometry or reducing the U-value.");

				d3.select("#thresholdTooltip")
				.style("top", (yPosition - margin.bottom/1.2) + "px");

			} else if (occdata.govfact == "dwn") {
				d3.select("#thisExplain")
				.text("downdraft")
				.style("color", orange);

				d3.select("#thisSolution")
				.text(". Try reducing the window height or U-value.");

				d3.select("#thresholdTooltip")
				.style("top", (yPosition - margin.bottom/1.6) + "px");
			}



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


	function drawHorziontalDimensions(length) {

		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "facadeWidth")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top*0.7) + ")");

		var facWidthDimensions = facadeSvg.selectAll("#facadeWidth");

		facWidthDimensions.append("text") // add width label
			.attr("class", "facadelabel")
			.attr("text-anchor", "middle")
		    .attr("x", function() {return facadeScaleWidth(length/2)})
		    .attr("y", 0)
		    .text("Wall Length: " + length + " ft");

		facWidthDimensions.append("line") // add line on left side of text
		    .attr("class", "dimline")
		    .attr("x2", 0)
			.attr("x1", function() {return facadeScaleWidth(length/2) - 60})
			.attr("y1", -4)
			.attr("y2", -4)
			.attr("marker-end", "url(#arrowhead)");

		facWidthDimensions.append("line") // add line on right side of text
		    .attr("class", "dimline")
		    .attr("x1", function() {return facadeScaleWidth(length/2) + 60})
			.attr("x2", function() {return facadeScaleWidth(length)})
			.attr("y1", -4)
			.attr("y2", -4)
			.attr("marker-end", "url(#arrowhead)");
	}


	function drawVerticalDimensions(height) {

		facadeSvg.append("g")
			.attr("id", "facadeHeightDimLabel")
			.attr("transform", "translate(" + facMargin.left*0.75 + "," + (facHeight/2 + facMargin.top) + ")")
			.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Ceiling Height: " + height + " ft");

		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "facadeHeightDim")
			.attr("transform", "translate(" + facMargin.left*0.75 + "," + ( facMargin.top) + ")");

		var facHeightDimensions = facadeSvg.selectAll("#facadeHeightDim");

		facHeightDimensions.append("line") // add line on left side of text
		    .attr("class", "dimline")
		    .attr("x2", 0)
			.attr("x1", 0)
			.attr("y2", 0)
			.attr("y1", function() {return facadeScaleHeight(height/2) - 65})
			.attr("marker-end", "url(#arrowhead)");

		facHeightDimensions.append("line") // add line on right side of text
		    .attr("class", "dimline")
		    .attr("x1", 0)
			.attr("x2", 0)
		    .attr("y1", function() {return facadeScaleHeight(height/2) + 65})
			.attr("y2", function() {return facadeScaleHeight(height)})
			.attr("marker-end", "url(#arrowhead)");
	}


	function windowDimensions(glazingData, glazingWidth, glazingHeight) {

		//get position of left-most window
		var firstWindow = $(".window:last");


		var leftEdgeWindow = parseFloat(firstWindow.attr("x"));
		var middleWidth = parseFloat(firstWindow.attr("x")) + facadeScaleWidth(glazingWidth/2);
		var verticalWindowMidpoint = parseFloat(firstWindow.attr("y")) + facadeScaleHeight(glazingHeight/2);
		var topOfWindow = parseFloat(firstWindow.attr("y"));
		var bottomOfWindow = parseFloat(firstWindow.attr("y")) + facadeScaleHeight(glazingHeight);
		var sillHeightPixels = facadeScaleHeight(glazingData[0][0][2]);
		
		try {
			var windowSeparationPixels = facadeScaleWidth(glazingData[0][0][0]) - facadeScaleWidth(glazingData[1][0][0]);
		} catch (err) {
			var windowSeparationPixels = wallLen/2
		}


		// window height
		facadeSvg.append("g")
			.attr("id", "windowHeightDimLabel")
			.attr("transform", "translate(" + (middleWidth + facMargin.left + 3) + "," + (verticalWindowMidpoint + facMargin.top) + ")")
			.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Window Height");

		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowHeightDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var windowHeightDimensions = facadeSvg.selectAll("#windowHeightDim");

		windowHeightDimensions.append("line") // add line to left of text
		    .attr("class", "dimline")
		    .attr("x2", middleWidth)
			.attr("x1", middleWidth)
			.attr("y1", verticalWindowMidpoint + 50)
			.attr("y2", bottomOfWindow)
			.attr("marker-end", "url(#arrowhead)");

		windowHeightDimensions.append("line") // add line to right of text
		    .attr("class", "dimline")
		    .attr("x2", middleWidth)
			.attr("x1", middleWidth)
			.attr("y1", topOfWindow)
			.attr("y2", verticalWindowMidpoint - 50)
			.attr("marker-start", "url(#arrowhead)");



		//window width
		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowWidthDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var windowWidthDimensions = facadeSvg.selectAll("#windowWidthDim");

		windowWidthDimensions.append("line") // add line to left of text
		    .attr("class", "dimline")
		    .attr("x1", leftEdgeWindow)
			.attr("x2", middleWidth - 25)
			.attr("y1", verticalWindowMidpoint)
			.attr("y2", verticalWindowMidpoint)
			.attr("marker-start", "url(#arrowhead)");

		windowWidthDimensions.append("line") // add line to right of text
		    .attr("class", "dimline")
		    .attr("x1", middleWidth + 25)
			.attr("x2", leftEdgeWindow + facadeScaleWidth(glazingWidth))
			.attr("y1", verticalWindowMidpoint)
			.attr("y2", verticalWindowMidpoint)
			.attr("marker-end", "url(#arrowhead)");

		windowWidthDimensions.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("x", middleWidth)
		    .attr("y", verticalWindowMidpoint - 3)
		    .text("Window");

		windowWidthDimensions.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("x", middleWidth)
		    .attr("y", verticalWindowMidpoint + 12)
		    .text("Width");


		//sill height
		facadeSvg.append("g")
			.attr("id", "sillHeightDimLabelTop")
			.attr("transform", "translate(" + (middleWidth + facMargin.left - 4) + "," + (bottomOfWindow + sillHeightPixels/2 + facMargin.top) + ")")
			.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Sill");

		facadeSvg.append("g")
			.attr("id", "sillHeightDimLabelBottom")
			.attr("transform", "translate(" + (middleWidth + facMargin.left + 12) + "," + (bottomOfWindow + sillHeightPixels/2 + facMargin.top) + ")")
			.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Height");

		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "sillHeightDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var sillHeightDimensions = facadeSvg.selectAll("#sillHeightDim");

		sillHeightDimensions.append("line") // add line to left of text
		    .attr("class", "dimline")
		    .attr("x2", middleWidth)
			.attr("x1", middleWidth)
			.attr("y1", bottomOfWindow + sillHeightPixels/2 + 10)
			.attr("y2", bottomOfWindow + sillHeightPixels)
			.attr("marker-end", "url(#arrowhead)");

		sillHeightDimensions.append("line") // add line to right of text
		    .attr("class", "dimline")
		    .attr("x2", middleWidth)
			.attr("x1", middleWidth)
			.attr("y1", bottomOfWindow)
			.attr("y2", bottomOfWindow + sillHeightPixels/2 - 10)
			.attr("marker-start", "url(#arrowhead)");



		//window separation
		facadeSvg.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowSepDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var windowSepDimensions = facadeSvg.selectAll("#windowSepDim");


		windowSepDimensions.append("line") // add line to left of text
		    .attr("class", "dimline")
		    .attr("x1", middleWidth)
			.attr("x2", middleWidth + windowSeparationPixels/2 - 60)
			.attr("y1", verticalWindowMidpoint)
			.attr("y2", verticalWindowMidpoint)
			.attr("marker-start", "url(#arrowhead)");

		windowSepDimensions.append("line") // add line to right of text
		    .attr("class", "dimline")
		    .attr("x1", middleWidth + windowSeparationPixels/2 + 60)
			.attr("x2", middleWidth + windowSeparationPixels)
			.attr("y1", verticalWindowMidpoint)
			.attr("y2", verticalWindowMidpoint)
			.attr("marker-end", "url(#arrowhead)");

		

		windowSepDimensions.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("x", middleWidth + windowSeparationPixels/2)
		    .attr("y", verticalWindowMidpoint + 4)
		    .text("Window Separation");

	}




} //end makeGraph()









