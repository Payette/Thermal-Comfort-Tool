

var render = render || {}

//function to make graph
render.makeGraph = function () {


	var maxContainerWidth = 550; // based on Payette website layout
	var color1 = "rgb(21,222,154)";
	var color2 = "rgb(0,168,150)";
	var color3 = "rgb(0,108,131)";
	var grey = "rgb(190,190,190)";
	var lightblue = "rgb(194,224,255)";
	var lightgrey = "rgb(235,235,235)";


	// Case 1 Data
	var allData = script.computeData(case1Data);
	var dataset = allData.dataSet;
	var occPointData = allData.occPtInfo
	var condensation1 = allData.condensation;

	//Case 2 Data
	var allData2 = script.computeData(case2Data);
	var dataset2 = allData2.dataSet;
	var occPointData2 = allData2.occPtInfo;
	var condensation2 = allData2.condensation;

	//Case 3 Data
	var allData3 = script.computeData(case3Data);
	var dataset3 = allData3.dataSet;
	var occPointData3 = allData3.occPtInfo;
	var condensation3 = allData3.condensation;


	/* ------ SET UP GRAPH VARIABLES AND DATA FUNCTIONS ------ */
	var margin = {top: 45, right: 0, bottom: 45, left: 50},
    	width = maxContainerWidth - margin.left - margin.right,
    	height = 325 - margin.top - margin.bottom;


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
	    .attr("y", height + margin.top + margin.bottom - 6)
	    .text("Occupant Distance from Façade (ft)");

	graphSvg.append("g")
	.attr("transform", "translate(10," + (height/2 + margin.top) + ")")
	.append("text")
    .attr("class", "axislabel")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Percentage of People Dissatisfied from Cold (PPD)");






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
			.style("stroke", color1)
			.style("stroke-width", .5);

	graphSvg.append("path")
			.attr("class", "connectLine2")
			.attr("d", line(dataset2))
			.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
			.style("fill", "none")
			.style("stroke", color2)
			.style("stroke-width", .5);

	graphSvg.append("path")
			.attr("class", "connectLine3")
			.attr("d", line(dataset3))
			.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
			.style("fill", "none")
			.style("stroke", color3)
			.style("stroke-width", .5);


    // Add dots at each point
	var graphPoints = graphSvg.selectAll(".dotCase1")
		.data(dataset)
		.enter()
		.append("path")
		.attr("class","dotCase1")
		.attr("d", d3.svg.symbol()
			.type(function(d) {
				if (d.govfact == "dwn") {
					return "triangle-up";
				} else if (d.govfact == "mrt") {
					return "circle";
				}
			})
			.size("35"))
		.attr("transform", function(d) {
				return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.ppd)) + ")";})
		.style("fill", color1);

	var graphCase2Points = graphSvg.selectAll(".dotCase2")
		.data(dataset2)
		.enter()
		.append("path")
		.attr("class","dotCase2")
		.attr("d", d3.svg.symbol()
			.type(function(d) {
				if (d.govfact == "dwn") {
					return "triangle-up";
				} else if (d.govfact == "mrt") {
					return "circle";
				}
			})
			.size("35"))
		.attr("transform", function(d) {
				return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.ppd)) + ")";})
		.style("fill", color2);

	var graphCase3Points = graphSvg.selectAll(".dotCase3")
		.data(dataset3)
		.enter()
		.append("path")
		.attr("class","dotCase3")
		.attr("d", d3.svg.symbol()
			.type(function(d) {
				if (d.govfact == "dwn") {
					return "triangle-up";
				} else if (d.govfact == "mrt") {
					return "circle";
				}
			})
			.size("35"))
		.attr("transform", function(d) {
				return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.ppd)) + ")";})
		.style("fill", color3);

	// Add point at occupant location
	var occupantPoint = graphSvg.append("path")
		.attr("class","occdot1")
		.attr("d", d3.svg.symbol()
			.type(function() {
				if (occPointData.govfact == "dwn") {
					return "triangle-up";
				} else if (occPointData.govfact == "mrt") {
					return "circle";
				}
			})
			.size("35"))
		.attr("transform", function() {
				return "translate(" + (margin.left + x(occPointData.dist)) + "," + (margin.top + y(occPointData.ppd)) + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 2)
		.style("stroke", color1);

	var occupantPoint2 = graphSvg.append("path")
		.attr("class","occdot2")
		.attr("d", d3.svg.symbol()
			.type(function() {
				if (occPointData2.govfact == "dwn") {
					return "triangle-up";
				} else if (occPointData2.govfact == "mrt") {
					return "circle";
				}
			})
			.size("35"))
		.attr("transform", function() {
				return "translate(" + (margin.left + x(occPointData2.dist)) + "," + (margin.top + y(occPointData2.ppd)) + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 2)
		.style("stroke", color2);

	var occupantPoint3 = graphSvg.append("path")
		.attr("class","occdot3")
		.attr("d", d3.svg.symbol()
			.type(function() {
				if (occPointData3.govfact == "dwn") {
					return "triangle-up";
				} else if (occPointData3.govfact == "mrt") {
					return "circle";
				}
			})
			.size("35"))
		.attr("transform", function() {
				return "translate(" + (margin.left + x(occPointData3.dist)) + "," + (margin.top + y(occPointData3.ppd)) + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 2)
		.style("stroke", color3);

	// Add line at occupant location
	occupantDistanceRefLine();

	// add text at occupanct location
	thresholdDataText();




	// Show text on hover over dot
	var points = d3.selectAll(".dotCase1, .dotCase2, .dotCase3");
	points.on("mouseover", function(d) {



		var hoverText = "";
		var discomfortReason = "";
		var thisIcon = "";

		$("#tooltip").empty();

		// discomfort reason
		if (d.govfact == "mrt") {
			discomfortReason = "radiant discomfort";
		} else if (d.govfact == "dwn") {
			discomfortReason = "downdraft discomfort";
		}

		// ppd icon
		if (d.ppd <= ppdValue) {
			thisIcon = "check";
		} else {
			thisIcon = "cross";
		}


		if (d3.select(this).attr("class") == "dotCase1") {
			hoverText = "<h1 class='case1Text'><span id='icon' class='" + thisIcon + "'></span>CASE 1: " + Math.round(d.ppd*10)/10 + "% PPD from " + discomfortReason;

		} else if (d3.select(this).attr("class") == "dotCase2") {
			hoverText = "<h1 class='case1Text'><span id='icon' class='" + thisIcon + "'></span>CASE 2: " + Math.round(d.ppd*10)/10 + "% PPD from " + discomfortReason;

		} else if (d3.select(this).attr("class") == "dotCase3") {
			hoverText = "<h1 class='case1Text'><span id='icon' class='" + thisIcon + "'></span>CASE 3: " + Math.round(d.ppd*10)/10 + "% PPD from " + discomfortReason;

		}

		$("#tooltip").append(hoverText);

		//Get this dots x/y values, then augment for the tooltip
		var thisHeight = $("#tooltip").height();
		var xPosition = x(d.dist) + margin.left;
		var yPosition = y(d.ppd) - thisHeight + 13;




		d3.select("#tooltip")
		.style("left", xPosition + "px")
		.style("top", yPosition + "px");


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


	// check for condensation

	checkCondensation(allData.condensation, allData2.condensation, allData3.condensation);











/* ------ SET UP FACADE VARIABLES AND DATA FUNCTIONS ------ */

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


	var facMargin = {top: 43, right: 1, bottom: 2, left: 1};


	var maxAllowableFacWidth = (maxContainerWidth - 14*2 - 6)/3;
	var maxAllowableFacHeight = 128;
	var governingProportion = maxAllowableFacWidth/maxAllowableFacHeight;

	//overall SVG width is fixed
	var facSpacing = 14;
	var facWidth = maxAllowableFacWidth + facSpacing;
	var facWidthNoSpacing = maxAllowableFacWidth;
	var facHeight; // determined when comparing proportions



	// define scales based on whether width or height governs
	defineScales();
	var facadeScaleWidth;
	var facadeScaleHeight;
	// this function in turn, assigns the wall SVG extents
	var wallSVGHeight;
	var wallSVGWidth;
	var proportionData;

	// values for height difference between cases - used to offset SVG down if ceiling heights are not the same across all cases
	var case1CeilingDiff;
	var case2CeilingDiff;
	var case3CeilingDiff;


	function defineScales() {

		var proportinateMult;

		proportionData = determineInputProportion();

		var inputProportion = proportionData.maxProportion;
		var maxCeilingCase = proportionData.maxCeilingCase;
		var maxLengthCase = proportionData.maxLengthCase;


		// set height difference between cases
		case1CeilingDiff =  maxCeilingCase.ceilingHeightValue-case1Data.ceilingHeightValue;
		case2CeilingDiff =  maxCeilingCase.ceilingHeightValue-case2Data.ceilingHeightValue;
		case3CeilingDiff =  maxCeilingCase.ceilingHeightValue-case3Data.ceilingHeightValue;



		// determine whether to use max ceiling height or max wall length for setting scales

		if (inputProportion > governingProportion) {
			// wall width should be maximized
			wallSVGWidth = maxAllowableFacWidth;

			// make svg height proportionate to facade width
			proportinateMult = maxLengthCase.ceilingHeightValue/maxLengthCase.wallLen;
			wallSVGHeight = proportinateMult*wallSVGWidth;

		} else if (inputProportion < governingProportion) {

			// ceiling height should be maximized
			wallSVGHeight = maxAllowableFacHeight;

			proportinateMult = maxCeilingCase.wallLen/maxCeilingCase.ceilingHeightValue;
			wallSVGWidth = proportinateMult*wallSVGHeight;

			// make svg width proportionate to facade height
		}

		facadeScaleWidth = d3.scale.linear()
				.domain([0, maxLengthCase.wallLen]) //input domain
				.range([0, wallSVGWidth]); //output range

		facadeScaleHeight = d3.scale.linear()
				.domain([0, maxCeilingCase.ceilingHeightValue]) //input domain
				.range([0, wallSVGHeight]); //output range

		//overall SVG height can vary - determined by whether ceiling height or wall length governs
		facHeight = wallSVGHeight;

	}









/* ------ MAKE THE FACADE ------ */



// Case 1 Facade
	var facadeSvgCase1 = d3.select("#case1Chart")
				.append("svg")
				.attr("id", "facadeCase1")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeight + facMargin.top + facMargin.bottom);

	var wallCase1 = facadeSvgCase1.append("rect")
		.attr("class","wall1 filled")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function() {return facadeScaleWidth(case1Data.wallLen)})
		.attr("height", function() {return facadeScaleHeight(case1Data.ceilingHeightValue)})
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")"
		});

	facadeSvgCase1.selectAll(".window1")
		.data(glzCoords)
		.enter()
		.append("rect")
		.attr("class", "window1 blue")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case1Data.wallLen)/2)})
		.attr("y", function(d) {return (facadeScaleHeight(case1Data.ceilingHeightValue - d[3][2]))})
		.attr("width", facadeScaleWidth(glzWidth))
		.attr("height", facadeScaleHeight(glzHeight))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")";
		});



// Case 2 Facade
	var facadeSvgCase2 = d3.select("#case2Chart")
				.append("svg")
				.attr("id", "facadeCase2")
				.attr("width", facWidth + facMargin.left + facMargin.right)
				.attr("height", facHeight + facMargin.top + facMargin.bottom);

	var wallCase2 = facadeSvgCase2.append("rect")
		.attr("class","wall2 outlined")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function(d) {return facadeScaleWidth(case2Data.wallLen)})
		.attr("height", function(d) {return facadeScaleHeight(case2Data.ceilingHeightValue)})
		.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case2CeilingDiff)) + ")"});

	facadeSvgCase2.selectAll(".window2")
		.data(glzCoordsCase2)
		.enter()
		.append("rect")
		.attr("class", "window2 white")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case2Data.wallLen)/2)})
		.attr("y", function(d) {return (facadeScaleHeight(case2Data.ceilingHeightValue - d[3][2]))})
		.attr("width", facadeScaleWidth(glzWidthCase2))
		.attr("height", facadeScaleHeight(glzHeightCase2))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case2CeilingDiff)) + ")";
		});


// Case 3 Facade
	var facadeSvgCase3 = d3.select("#case3Chart")
				.append("svg")
				.attr("id", "facadeCase3")
				.attr("width", facWidthNoSpacing + facMargin.left + facMargin.right)
				.attr("height", facHeight + facMargin.top + facMargin.bottom);

	var wallCase3 = facadeSvgCase3.append("rect")
		.attr("class","wall3 outlined")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", function(d) {return facadeScaleWidth(case3Data.wallLen)})
		.attr("height", function(d) {return facadeScaleHeight(case3Data.ceilingHeightValue)})
		.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case3CeilingDiff)) + ")"});

	facadeSvgCase3.selectAll(".window3")
		.data(glzCoordsCase3)
		.enter()
		.append("rect")
		.attr("class", "window3 white")
		.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case3Data.wallLen)/2)})
		.attr("y", function(d) {return (facadeScaleHeight(case3Data.ceilingHeightValue - d[3][2]))})
		.attr("width", facadeScaleWidth(glzWidthCase3))
		.attr("height", facadeScaleHeight(glzHeightCase3))
		.attr("transform", function() {
			return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case3CeilingDiff)) + ")";
		});




	//Ensure size of occupant image is correct
	checkOccupantImageSize(case1Data, "#occupantImage", "#sliderWrapper", "#case1Heading");
	checkOccupantImageSize(case2Data, "#occupantImage2", "#sliderWrapper2", "#case2Heading");
	checkOccupantImageSize(case3Data, "#occupantImage3", "#sliderWrapper3", "#case3Heading");








	//Add dimensions to Case 1 facade
	addDimensions(glzCoords, glzWidth, glzHeight);



	$("#ceilingHeightButt").on("mouseover", function() {
		$("#facadeHeightDim").fadeIn("fast");
	})
	$("#ceilingHeightButt").on("mouseout", function() {
		$("#facadeHeightDim").fadeOut("fast");
	})

	$("#roomLengthButt").on("mouseover", function() {
		$("#facadeWidthDim").fadeIn("fast");
	})
	$("#roomLengthButt").on("mouseout", function() {
		$("#facadeWidthDim").fadeOut("fast");
	})


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


		/* ---- SVG DEFINITIONS ---- */

	var defs = facadeSvgCase1.append("defs");
	var defs2 = facadeSvgCase2.append("defs");
	var defs3 = facadeSvgCase3.append("defs");

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
    	.attr("offset", "100%");

    var blueGradient2 = defs2.append("linearGradient")
    	.attr("id", "blueGradient2")
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

    var blueGradient3 = defs3.append("linearGradient")
    	.attr("id", "blueGradient3")
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
















    /* ------ HIDE/SHOW CASES / ALERTS ------ */

    $("#caseSelection #case2Label").on("click", function() {

    	$("#case2Heading").toggleClass("greyText").toggleClass("case2Text");
    	$("#case2Button").toggleClass("unselected");


    	if ($(this).hasClass("unselected") == true) {
    		//becomes selected
			$(this).removeClass("unselected");

			sizeButton();

			$("#inputs input.case2, div.case2, #sliderWrapper2, .connectLine2, .dotCase2, .occdot2").css("display","inline-block");
			$("hr.case2").css("display","block");

			d3.selectAll("rect.wall2").classed("outlined", false);
			d3.selectAll("rect.wall2").classed("filled", true);
			d3.selectAll("rect.window2").classed("white", false);
			d3.selectAll("rect.window2").classed("blue", true);


		}

		else if ($(this).hasClass("unselected") == false) {
			// becomes unselected
			$(this).addClass("unselected");

			sizeButton();


			$("#inputs input.case2, div.case2, #sliderWrapper2, .connectLine2, .dotCase2, .occdot2, hr.case2").css("display","none");

			d3.selectAll("rect.wall2").classed("outlined", true);
			d3.selectAll("rect.wall2").classed("filled", false);
			d3.selectAll("rect.window2").classed("white", true);
			d3.selectAll("rect.window2").classed("blue", false);
		}

		// Update static tooltip text
		thresholdDataText();
		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();



    });

    $("#caseSelection #case3Label").on("click", function() {

    	$("#case3Heading").toggleClass("greyText").toggleClass("case3Text");
    	$("#case3Button").toggleClass("unselected");


    	if ($(this).hasClass("unselected") == true) {
    		//becomes selected
			$(this).removeClass("unselected");

			sizeButton();

			$("#inputs input.case3, div.case3, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3").css("display","inline-block");
			$("hr.case3").css("display","block");

			d3.selectAll("rect.wall3").classed("outlined", false);
			d3.selectAll("rect.wall3").classed("filled", true);
			d3.selectAll("rect.window3").classed("white", false);
			d3.selectAll("rect.window3").classed("blue", true);
		}

		else if ($(this).hasClass("unselected") == false) {
			// becomes unselected
			$(this).addClass("unselected");

			sizeButton();

			$("#inputs input.case3, div.case3, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3, hr.case3").css("display","none");

			d3.selectAll("rect.wall3").classed("outlined", true);
			d3.selectAll("rect.wall3").classed("filled", false);
			d3.selectAll("rect.window3").classed("white", true);
			d3.selectAll("rect.window3").classed("blue", false);
		}


		// Update static tooltip text
		thresholdDataText();
		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();


    });

    // remove condensation alert on click
    $("#condensation img.close").on("click", function() {
    	$("#condensation").css("display","none");
    	$("#humidity, #humidity2, #humidity3").css("color", "black");
    })

	// remove uvalue alert on click
    $("#uvaluePop img.close").on("click", function() {
    	$("#uvaluePop").css("display","none");
    	$("#uvalue, #uvalue2, #uvalue3, #airtemp, #airtemp2, #airtemp3, #clothing").css("color", "black");
    })







	/* ----- DETECT FORM BUTTONS ----- */
	$(".optionButton#IP").click(function(event) {
		if ($(".optionButton#IP").hasClass("selected") == false) {
			//change to IP
			unitSys = "IP"
			$(".optionButton#IP").addClass("selected");
			$(".optionButton#SI").removeClass("selected");
			$(".optionButton#SI").addClass("unselected");

			// change labels to have ft
			$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").removeClass("SI");
			$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").addClass("IP");
			$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").empty();
			$(".units").append("ft");
			$(".unitsTemp").append("&deg;F");
			$(".unitsUVal").append("Btu/hr*ft&sup2;*&deg;F");
			$(".unitsRVal").append("hr*ft&sup2;*&deg;F/Btu");
			$(".unitsAirSpeed").append("fpm");

			// change values in form.
			case1Data.occDistToWallCenter = units.M2Ft(case1Data.occDistToWallCenter);
			$("#occupantDist").attr("value", case1Data.occDistToWallCenter);
			updateOccupantImageLocation("#occupantImage", "#occupantDist", case1Data);
			case2Data.occDistToWallCenter = units.M2Ft(case2Data.occDistToWallCenter);
			updateOccupantImageLocation("#occupantImage2", "#occupantDist2", case2Data);
			case3Data.occDistToWallCenter = units.M2Ft(case3Data.occDistToWallCenter);
			updateOccupantImageLocation("#occupantImage3", "#occupantDist3", case3Data);

			case1Data.ceilingHeightValue = units.M2Ft(case1Data.ceilingHeightValue);
			$("#ceiling").val(case1Data.ceilingHeightValue);
			case2Data.ceilingHeightValue = units.M2Ft(case2Data.ceilingHeightValue);
			$("#ceiling2").val(case2Data.ceilingHeightValue);
			case3Data.ceilingHeightValue = units.M2Ft(case3Data.ceilingHeightValue);
			$("#ceiling3").val(case3Data.ceilingHeightValue);

			case1Data.wallLen = units.M2Ft(case1Data.wallLen);
			$("#wallWidth").val(case1Data.wallLen);
			case2Data.wallLen = units.M2Ft(case2Data.wallLen);
			$("#wallWidth2").val(case2Data.wallLen);
			case3Data.wallLen = units.M2Ft(case3Data.wallLen);
			$("#wallWidth3").val(case3Data.wallLen);

			case1Data.windowHeightValue = units.M2Ft(case1Data.windowHeightValue);
			$("#windowHeight").val(case1Data.windowHeightValue);
			case2Data.windowHeightValue = units.M2Ft(case2Data.windowHeightValue);
			$("#windowHeight2").val(case2Data.windowHeightValue);
			case3Data.windowHeightValue = units.M2Ft(case3Data.windowHeightValue);
			$("#windowHeight3").val(case3Data.windowHeightValue);

			case1Data.windowWidthValue = units.M2Ft(case1Data.windowWidthValue);
			$("#windowWidth").val(case1Data.windowWidthValue);
			case2Data.windowWidthValue = units.M2Ft(case2Data.windowWidthValue);
			$("#windowWidth2").val(case2Data.windowWidthValue);
			case3Data.windowWidthValue = units.M2Ft(case3Data.windowWidthValue);
			$("#windowWidth3").val(case3Data.windowWidthValue);

			case1Data.sillHeightValue = units.M2Ft(case1Data.sillHeightValue);
			$("#sill").val(case1Data.sillHeightValue);
			case2Data.sillHeightValue = units.M2Ft(case2Data.sillHeightValue);
			$("#sill2").val(case2Data.sillHeightValue);
			case3Data.sillHeightValue = units.M2Ft(case3Data.sillHeightValue);
			$("#sill3").val(case3Data.sillHeightValue);

			case1Data.distanceWindows = units.M2Ft(case1Data.distanceWindows);
			$("#distWindow").val(case1Data.distanceWindows);
			case2Data.distanceWindows = units.M2Ft(case2Data.distanceWindows);
			$("#distWindow2").val(case2Data.distanceWindows);
			case3Data.distanceWindows = units.M2Ft(case3Data.distanceWindows);
			$("#distWindow3").val(case3Data.distanceWindows);

			case1Data.uvalueValue = units.uSI2uIP(case1Data.uvalueValue);
			$("#uvalue").val(case1Data.uvalueValue);
			case2Data.uvalueValue = units.uSI2uIP(case2Data.uvalueValue);
			$("#uvalue2").val(case2Data.uvalueValue);
			case3Data.uvalueValue = units.uSI2uIP(case3Data.uvalueValue);
			$("#uvalue3").val(case3Data.uvalueValue);

			case1Data.outdoorTempValue = units.C2F(case1Data.outdoorTempValue);
			$("#outdoortemp").val(case1Data.outdoorTempValue);
			case2Data.outdoorTempValue = units.C2F(case2Data.outdoorTempValue);
			$("#outdoortemp2").val(case2Data.outdoorTempValue);
			case3Data.outdoorTempValue = units.C2F(case3Data.outdoorTempValue);
			$("#outdoortemp3").val(case3Data.outdoorTempValue);

			case1Data.airtempValue = units.C2F(case1Data.airtempValue);
			$("#airtemp").val(case1Data.airtempValue);
			case2Data.airtempValue = units.C2F(case2Data.airtempValue);
			$("#airtemp2").val(case2Data.airtempValue);
			case3Data.airtempValue = units.C2F(case3Data.airtempValue);
			$("#airtemp3").val(case3Data.airtempValue);

			rvalueValue = units.rSI2rIP(rvalueValue);
			$("#rvalue").val(rvalueValue);

			airspeedValue = units.mps2fpm(airspeedValue);
			$("#airspeed").val(airspeedValue);

			occDistFromFacade = units.M2Ft(occDistFromFacade);
			$("#distFromFacade").val(occDistFromFacade);
			$("#distOutput").val(round(occDistFromFacade * 10)/10 + " ft");

			updateData(case1Data);
			updateData(case2Data);
			updateData(case3Data);
		}
	})

	$(".optionButton#SI").click(function(event) {

		if ($(".optionButton#SI").hasClass("selected") == false) {
			//change to SI
			unitSys = "SI"
			$(".optionButton#SI").addClass("selected");
			$(".optionButton#IP").removeClass("selected");
			$(".optionButton#IP").addClass("unselected");

			// change units labels to be in SI
			$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").removeClass("IP");
			$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").addClass("SI");
			$(".units, .unitsTemp, .unitsUVal, .unitsRVal, .unitsAirSpeed").empty();
			$(".units").append("m");
			$(".unitsTemp").append("&deg;C");
			$(".unitsUVal").append("W/m&sup2;*K");
			$(".unitsRVal").append("m&sup2;*K/W");
			$(".unitsAirSpeed").append("m/s");

			// change values in form.
			case1Data.occDistToWallCenter = units.Ft2M(case1Data.occDistToWallCenter);
			$("#occupantDist").attr("value", case1Data.occDistToWallCenter);
			updateOccupantImageLocation("#occupantImage", "#occupantDist", case1Data);
			case2Data.occDistToWallCenter = units.Ft2M(case2Data.occDistToWallCenter);
			updateOccupantImageLocation("#occupantImage2", "#occupantDist2", case2Data);
			case3Data.occDistToWallCenter = units.Ft2M(case3Data.occDistToWallCenter);
			updateOccupantImageLocation("#occupantImage3", "#occupantDist3", case3Data);

			case1Data.ceilingHeightValue = units.Ft2M(case1Data.ceilingHeightValue);
			$("#ceiling").val(case1Data.ceilingHeightValue);
			case2Data.ceilingHeightValue = units.Ft2M(case2Data.ceilingHeightValue);
			$("#ceiling2").val(case2Data.ceilingHeightValue);
			case3Data.ceilingHeightValue = units.Ft2M(case3Data.ceilingHeightValue);
			$("#ceiling3").val(case3Data.ceilingHeightValue);

			case1Data.wallLen = units.Ft2M(case1Data.wallLen);
			$("#wallWidth").val(case1Data.wallLen);
			case2Data.wallLen = units.Ft2M(case2Data.wallLen);
			$("#wallWidth2").val(case2Data.wallLen);
			case3Data.wallLen = units.Ft2M(case3Data.wallLen);
			$("#wallWidth3").val(case3Data.wallLen);

			case1Data.windowHeightValue = units.Ft2M(case1Data.windowHeightValue);
			$("#windowHeight").val(case1Data.windowHeightValue);
			case2Data.windowHeightValue = units.Ft2M(case2Data.windowHeightValue);
			$("#windowHeight2").val(case2Data.windowHeightValue);
			case3Data.windowHeightValue = units.Ft2M(case3Data.windowHeightValue);
			$("#windowHeight3").val(case3Data.windowHeightValue);

			case1Data.windowWidthValue = units.Ft2M(case1Data.windowWidthValue);
			$("#windowWidth").val(case1Data.windowWidthValue);
			case2Data.windowWidthValue = units.Ft2M(case2Data.windowWidthValue);
			$("#windowWidth2").val(case2Data.windowWidthValue);
			case3Data.windowWidthValue = units.Ft2M(case3Data.windowWidthValue);
			$("#windowWidth3").val(case3Data.windowWidthValue);

			case1Data.sillHeightValue = units.Ft2M(case1Data.sillHeightValue);
			$("#sill").val(case1Data.sillHeightValue);
			case2Data.sillHeightValue = units.Ft2M(case2Data.sillHeightValue);
			$("#sill2").val(case2Data.sillHeightValue);
			case3Data.sillHeightValue = units.Ft2M(case3Data.sillHeightValue);
			$("#sill3").val(case3Data.sillHeightValue);

			case1Data.distanceWindows = units.Ft2M(case1Data.distanceWindows);
			$("#distWindow").val(case1Data.distanceWindows);
			case2Data.distanceWindows = units.Ft2M(case2Data.distanceWindows);
			$("#distWindow2").val(case2Data.distanceWindows);
			case3Data.distanceWindows = units.Ft2M(case3Data.distanceWindows);
			$("#distWindow3").val(case3Data.distanceWindows);

			case1Data.uvalueValue = units.uIP2uSI(case1Data.uvalueValue);
			$("#uvalue").val(case1Data.uvalueValue);
			case2Data.uvalueValue = units.uIP2uSI(case2Data.uvalueValue);
			$("#uvalue2").val(case2Data.uvalueValue);
			case3Data.uvalueValue = units.uIP2uSI(case3Data.uvalueValue);
			$("#uvalue3").val(case3Data.uvalueValue);

			case1Data.outdoorTempValue = units.F2C(case1Data.outdoorTempValue);
			$("#outdoortemp").val(case1Data.outdoorTempValue);
			case2Data.outdoorTempValue = units.F2C(case2Data.outdoorTempValue);
			$("#outdoortemp2").val(case2Data.outdoorTempValue);
			case3Data.outdoorTempValue = units.F2C(case3Data.outdoorTempValue);
			$("#outdoortemp3").val(case3Data.outdoorTempValue);

			case1Data.airtempValue = units.F2C(case1Data.airtempValue);
			$("#airtemp").val(case1Data.airtempValue);
			case2Data.airtempValue = units.F2C(case2Data.airtempValue);
			$("#airtemp2").val(case2Data.airtempValue);
			case3Data.airtempValue = units.F2C(case3Data.airtempValue);
			$("#airtemp3").val(case3Data.airtempValue);

			rvalueValue = units.rIP2rSI(rvalueValue);
			$("#rvalue").val(rvalueValue);

			airspeedValue = units.fpm2mps(airspeedValue);
			$("#airspeed").val(airspeedValue);

			occDistFromFacade = units.Ft2M(occDistFromFacade);
			$("#distFromFacade").val(occDistFromFacade);
			$("#distOutput").val(round(occDistFromFacade * 10)/10 + " m");

			updateData(case1Data);
			updateData(case2Data);
			updateData(case3Data);

		}
	})

	$("#calcUValue").click(function(event) {
		autocalcUValues();
	});



	/* ------ DETECT CHANGES TO INPUT VALUES ------ */
	// universal changes
	$("#distFromFacade").change(function(event) {
		occDistFromFacade = $(this).val();

		$("#distFromFacade").val(occDistFromFacade);
		if (unitSys == "IP") {
			$("#distOutput").val(occDistFromFacade + " ft");
		} else {
			$("#distOutput").val(occDistFromFacade + " m");
		}

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);

		thresholdDataText();
		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();

	});

	$("#ppd").change(function(event) {
		if ($(this).val() <= 4) {
			ppdValue = 5;
			$("#ppd").val(5);
			$("#ppdOutput").val("5%");
		}
		else if ($(this).val() >30) {
			ppdValue = 30;
			$("#ppd").val(30);
			$("#ppdOutput").val("30%");
		}
		else {
			ppdValue = $(this).val();
			$("#ppd").val(ppdValue);
			$("#ppdOutput").val(ppdValue + "%");
		}
		// Update target PPD threshold line
		updatePPDThreshold(ppdValue);
		thresholdDataText()
	});


	$("#windowWidthCheck").change(function(event) {
		if (($("#windowWidthCheck").is(":checked")) == true) {
			glzOrWidth = false;
			$("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").removeClass("inactive");
			$("#glazing, #glazing2, #glazing3, #glazingLabel").addClass("inactive");

			$("#checkWindWidth").removeClass("unselected");
			$("#checkGlzRatio").addClass("unselected");

			$("#glazingRatioCheck").removeAttr("checked");


		} else if (($("#windowWidthCheck").is(":checked")) == false) {
			glzOrWidth = true;
			$("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").addClass("inactive");
			$("#glazing, #glazing2, #glazing3, #glazingLabel").removeClass("inactive");



			$("#checkGlzRatio").removeClass("unselected");
			$("#checkWindWidth").addClass("unselected");

			$("#glazingRatioCheck").attr("checked", "checked");

		}
	});
	$("#glazingRatioCheck").change(function(event) {
		if (($("#glazingRatioCheck").is(":checked")) == true) {
			glzOrWidth = true;
			$("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").addClass("inactive");
			$("#glazing, #glazing2, #glazing3, #glazingLabel").removeClass("inactive");

			$("#checkGlzRatio").removeClass("unselected");
			$("#checkWindWidth").addClass("unselected");

			$("#windowWidthCheck").removeAttr("checked");

		} else if (($("#glazingRatioCheck").is(":checked")) == false) {
			glzOrWidth = false;
			$("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").removeClass("inactive");
			$("#glazing, #glazing2, #glazing3, #glazingLabel").addClass("inactive");



			$("#checkWindWidth").removeClass("unselected");
			$("#checkGlzRatio").addClass("unselected");

			$("#windowWidthCheck").attr("checked", "checked");
		}
	})


	/*$("#radiant, #radiant2, #radiant3").change(function(event) {
		if (($("#radiant").is(":checked")) == true) {
			radiantFloorChecked = true;

			$("#radiantCheck1, #radiantCheck2, #radiantCheck3").removeClass("unselected");

		} else if (($("#radiant").is(":checked")) == false) {
			radiantFloorChecked = false;

			$("#radiantCheck1, #radiantCheck2, #radiantCheck3").addClass("unselected");
		}

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})*/


	$("#rvalue").focusout(function(event) {
		rvalueValue = $(this).val();
		$("#rvalue").val(rvalueValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#rvalue").on("spin", function(event, ui) {
		rvalueValue = ui.value;
		$("#rvalue").val(rvalueValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})



	$("#airspeed").focusout(function(event) {
		airspeedValue = $(this).val();

		$("#airspeed").val(airspeedValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#airspeed").on("spin", function(event, ui) {
		airspeedValue = ui.value;

		$("#airspeed").val(airspeedValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#clothing").focusout(function(event) {
		clothingValue = $(this).val();

		$("#clothing").val(clothingValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#clothing").on("spin", function(event, ui) {
		clothingValue = ui.value;

		$("#clothing").val(clothingValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#metabolic").focusout(function(event) {
		metabolic = $(this).val();

		$("#metabolic").val(metabolic);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#metabolic").on("spin", function(event, ui) {
		metabolic = ui.value;

		$("#metabolic").val(metabolic);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})


	$("#occupantDist").change(function(event) {
		//assign new value

		case1Data.occDistToWallCenter = $(this).val();
		$("#occupantDist").attr("value", case1Data.occDistToWallCenter);

		updateOccupantImageLocation("#occupantImage", "#occupantDist", case1Data);

		updateData(case1Data);
	})
	$("#occupantDist2").change(function(event) {
		//assign new value
		case2Data.occDistToWallCenter = $(this).val();
		updateOccupantImageLocation("#occupantImage2", "#occupantDist2", case2Data);
		updateData(case2Data);
	})
	$("#occupantDist3").change(function(event) {
		//assign new value
		case3Data.occDistToWallCenter = $(this).val();
		updateOccupantImageLocation("#occupantImage3", "#occupantDist3", case3Data);
		updateData(case3Data);
	})




	// prevent enter from trigger footnotes, use enter to update value in field
	$("#ceiling, #wallWidth, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowE, #outdoortemp, #airtemp, #humidity, #ceiling2, #wallWidth2, #windowHeight2, #windowWidth2, #glazing2, #sill2, #distWindow2, #uvalue2, #lowE2, #outdoortemp2, #airtemp2, #humidity2, #ceiling3, #wallWidth3, #windowHeight3, #windowWidth3, #glazing3, #sill3, #distWindow3, #uvalue3, #lowE3, #outdoortemp3, #airtemp3, #humidity3, #rvalue, #airspeed, #clothing, #metabolic").keydown(function(event) {

		if (event.keyCode == 13) {
			$(this).blur();
			event.preventDefault();
		}

	});







	// Case 1 - Changes based on typed inputs
	$("#ceiling, #wallWidth, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowE, #outdoortemp, #airtemp, #humidity").focusout(function(event) {

		//figure out what input changed
		var triggeredChange = event.target.id;

		if(triggeredChange == "ceiling") {
			case1Data.ceilingHeightValue = $(this).val();
			changedVar = "ceilingHeightValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.ceilingHeightValue = case1Data.ceilingHeightValue;
				$("#ceiling2").val(case2Data.ceilingHeightValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.ceilingHeightValue = case1Data.ceilingHeightValue;
				$("#ceiling3").val(case3Data.ceilingHeightValue);
			}

		}
		else if(triggeredChange == "wallWidth") {
			case1Data.wallLen = $(this).val();
			changedVar = "wallLen"

			$("#occupantDist").attr("max", case1Data.wallLen/2);

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.wallLen = case1Data.wallLen;
				$("#wallWidth2").val(case2Data.wallLen);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.wallLen = case1Data.wallLen;
				$("#wallWidth3").val(case3Data.wallLen);
			}

		}
		else if (triggeredChange == "windowHeight") {
			case1Data.windowHeightValue = $(this).val();
			changedVar = "windowHeight"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.windowHeightValue = case1Data.windowHeightValue;
				$("#windowHeight2").val(case2Data.windowHeightValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.windowHeightValue = case1Data.windowHeightValue;
				$("#windowHeight3").val(case3Data.windowHeightValue);
			}
		}
		else if (triggeredChange == "windowWidth") {
			case1Data.windowWidthValue = $(this).val();
			changedVar = "windowWidthValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.windowWidthValue = case1Data.windowWidthValue;
				$("#windowWidth2").val(case2Data.windowWidthValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.windowWidthValue = case1Data.windowWidthValue;
				$("#windowWidth3").val(case3Data.windowWidthValue);
			}

		}
		else if (triggeredChange == "glazing") {
			case1Data.glzRatioValue = $(this).val();
			changedVar = "glzRatioValue"

			$("#occupantDist").attr("max", case1Data.wallLen/2);

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.glzRatioValue = case1Data.glzRatioValue;
				$("#glazing2").val(case2Data.glzRatioValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.glzRatioValue = case1Data.glzRatioValue;
				$("#glazing3").val(case3Data.glzRatioValue);
			}
		}
		else if (triggeredChange == "sill") {
			case1Data.sillHeightValue = $(this).val();
			changedVar = "sillHeightValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.sillHeightValue = case1Data.sillHeightValue;
				$("#sill2").val(case2Data.sillHeightValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.sillHeightValue = case1Data.sillHeightValue;
				$("#sill3").val(case3Data.sillHeightValue);
			}
		}
		else if (triggeredChange == "distWindow") {
			case1Data.distanceWindows = $(this).val();
			changedVar = "distanceWindows"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.distanceWindows = case1Data.distanceWindows;
				$("#distWindow2").val(case2Data.distanceWindows);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.distanceWindows = case1Data.distanceWindows;
				$("#distWindow3").val(case3Data.distanceWindows);
			}

		}

		else if (triggeredChange == "uvalue") {
			case1Data.uvalueValue = $(this).val();

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.uvalueValue = case1Data.uvalueValue;
				$("#uvalue2").val(case2Data.uvalueValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.uvalueValue = case1Data.uvalueValue;
				$("#uvalue3").val(case3Data.uvalueValue);
			}
		}

		else if (triggeredChange == "lowE") {
			case1Data.intLowEEmissivity = $(this).val();

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.intLowEEmissivity = case1Data.intLowEEmissivity;
				$("#lowE2").val(case2Data.intLowEEmissivity);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.intLowEEmissivity = case1Data.intLowEEmissivity;
				$("#lowE3").val(case3Data.intLowEEmissivity);
			}
		}
		else if (triggeredChange == "outdoortemp") {
			case1Data.outdoorTempValue = $(this).val();

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.outdoorTempValue = case1Data.outdoorTempValue;
				$("#outdoortemp2").val(case2Data.outdoorTempValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.outdoorTempValue = case1Data.outdoorTempValue;
				$("#outdoortemp3").val(case3Data.outdoorTempValue);
			}
		}
		else if (triggeredChange == "airtemp") {
			case1Data.airtempValue = $(this).val();

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.airtempValue = case1Data.airtempValue;
				$("#airtemp2").val(case2Data.airtempValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.airtempValue = case1Data.airtempValue;
				$("#airtemp3").val(case3Data.airtempValue);
			}
		}
		else if (triggeredChange == "humidity") {
			case1Data.humidityValue = $(this).val();

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.humidityValue = case1Data.humidityValue;
				$("#humidity2").val(case2Data.humidityValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.humidityValue = case1Data.humidityValue;
				$("#humidity3").val(case3Data.humidityValue);
			}
		}

		else {
			alert("Don't know what changed!");
		}

		updateData(case1Data);

		if ($("#caseSelection #case2Label").hasClass("unselected") == true){
			updateData(case2Data);
		}
		if ($("#caseSelection #case3Label").hasClass("unselected") == true){
			updateData(case3Data);
		}

	})
	$("#lowECheck").change(function(event) {

		if (($("#lowECheck").is(":checked")) == true) {
			case1Data.intLowEChecked = true;
			$("#lowE").val(0.2);

			case1Data.intLowEEmissivity = 0.2;

			$("#lowE").removeClass("inactive");
			$("#lowELabel").removeClass("inactive");
			$("#checkLowE1").removeClass("unselected");

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.intLowEChecked = case1Data.intLowEChecked;
				$("#lowE2").val(0.2);

				case2Data.intLowEEmissivity = 0.2;

				$("#lowE2").removeClass("inactive");
				$("#checkLowE2").removeClass("unselected");
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.intLowEChecked = case1Data.intLowEChecked;
				$("#lowE3").val(0.2);

				case3Data.intLowEEmissivity = 0.2;

				$("#lowE3").removeClass("inactive");
				$("#checkLowE3").removeClass("unselected");
			}


		} else if (($("#lowECheck").is(":checked")) == false) {
			case1Data.intLowEChecked = false;
			$("#lowE").val(" ");
			$("#lowE").addClass("inactive");
			$("#lowELabel").addClass("inactive");
			$("#checkLowE1").addClass("unselected");

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.intLowEChecked = case1Data.intLowEChecked;
				$("#lowE2").val(" ");

				$("#lowE2").addClass("inactive");
				$("#checkLowE2").addClass("unselected");
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.intLowEChecked = case1Data.intLowEChecked;
				$("#lowE3").val(" ");

				$("#lowE3").addClass("inactive");
				$("#checkLowE3").addClass("unselected");
			}


		}

		updateData(case1Data);

		if ($("#caseSelection #case2Label").hasClass("unselected") == true){
			updateData(case2Data);
		}
		if ($("#caseSelection #case3Label").hasClass("unselected") == true){
			updateData(case3Data);
		}
	})


	// Case 1 - Changes based on increment buttons
		$("#ceiling").on("spin", function(event, ui) {
			case1Data.ceilingHeightValue = ui.value;
			changedVar = "ceilingHeightValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.ceilingHeightValue = case1Data.ceilingHeightValue;
				$("#ceiling2").val(case2Data.ceilingHeightValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.ceilingHeightValue = case1Data.ceilingHeightValue;
				$("#ceiling3").val(case3Data.ceilingHeightValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#wallWidth").on("spin", function(event, ui) {
			case1Data.wallLen = ui.value;
			changedVar = "wallLen"

			$("#occupantDist").attr("max", case1Data.wallLen/2);

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.wallLen = case1Data.wallLen;
				$("#wallWidth2").val(case2Data.wallLen);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.wallLen = case1Data.wallLen;
				$("#wallWidth3").val(case3Data.wallLen);
				updateData(case3Data);
			}

			updateData(case1Data);

		})

		$("#windowHeight").on("spin", function(event, ui) {
			case1Data.windowHeightValue = ui.value;
			changedVar = "windowHeightValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.windowHeightValue = case1Data.windowHeightValue;
				$("#windowHeight2").val(case2Data.windowHeightValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.windowHeightValue = case1Data.windowHeightValue;
				$("#windowHeight3").val(case3Data.windowHeightValue);
				updateData(case3Data);
			}


			updateData(case1Data);
		})

		$("#windowWidth").on("spin", function(event, ui) {
			case1Data.windowWidthValue = ui.value;
			changedVar = "windowWidthValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.windowWidthValue = case1Data.windowWidthValue;
				$("#windowWidth2").val(case2Data.windowWidthValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.windowWidthValue = case1Data.windowWidthValue;
				$("#windowWidth3").val(case3Data.windowWidthValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#glazing").on("spin", function(event, ui) {
			case1Data.glzRatioValue = ui.value;
			changedVar = "glzRatioValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.glzRatioValue = case1Data.glzRatioValue;
				$("#glazing2").val(case2Data.glzRatioValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.glzRatioValue = case1Data.glzRatioValue;
				$("#glazing3").val(case3Data.glzRatioValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#sill").on("spin", function(event, ui) {
			case1Data.sillHeightValue = ui.value;
			changedVar = "sillHeightValue"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.sillHeightValue = case1Data.sillHeightValue;
				$("#sill2").val(case2Data.sillHeightValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.sillHeightValue = case1Data.sillHeightValue;
				$("#sill3").val(case3Data.sillHeightValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#distWindow").on("spin", function(event, ui) {
			case1Data.distanceWindows = ui.value;
			changedVar = "distanceWindows"

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.distanceWindows = case1Data.distanceWindows;
				$("#distWindow2").val(case2Data.distanceWindows);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.distanceWindows = case1Data.distanceWindows;
				$("#distWindow3").val(case3Data.distanceWindows);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#uvalue").on("spin", function(event, ui) {
			case1Data.uvalueValue = ui.value;

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.uvalueValue = case1Data.uvalueValue;
				$("#uvalue2").val(case2Data.uvalueValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.uvalueValue = case1Data.uvalueValue;
				$("#uvalue3").val(case3Data.uvalueValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#lowE").on("spin", function(event, ui) {
			case1Data.intLowEEmissivity = ui.value;

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.intLowEEmissivity = case1Data.intLowEEmissivity;
				$("#lowE2").val(case2Data.intLowEEmissivity);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.intLowEEmissivity = case1Data.intLowEEmissivity;
				$("#lowE3").val(case3Data.intLowEEmissivity);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#outdoortemp").on("spin", function(event, ui) {
			case1Data.outdoorTempValue = ui.value;

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.outdoorTempValue = case1Data.outdoorTempValue;
				$("#outdoortemp2").val(case2Data.outdoorTempValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.outdoorTempValue = case1Data.outdoorTempValue;
				$("#outdoortemp3").val(case3Data.outdoorTempValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#airtemp").on("spin", function(event, ui) {
			case1Data.airtempValue = ui.value;

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.airtempValue = case1Data.airtempValue;
				$("#airtemp2").val(case2Data.airtempValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.airtempValue = case1Data.airtempValue;
				$("#airtemp3").val(case3Data.airtempValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})

		$("#humidity").on("spin", function(event, ui) {
			case1Data.humidityValue = ui.value;

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.humidityValue = case1Data.humidityValue;
				$("#humidity2").val(case2Data.humidityValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.humidityValue = case1Data.humidityValue;
				$("#humidity3").val(case3Data.humidityValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})






	// Case 2 - Changes based on typed inputs
	$("#ceiling2, #wallWidth2, #windowHeight2, #windowWidth2, #glazing2, #sill2, #distWindow2, #uvalue2, #lowE2, #outdoortemp2, #airtemp2, #humidity2").focusout(function(event) {

		//figure out what input changed
		var triggeredChange = event.target.id;


		if(triggeredChange == "ceiling2") {
			case2Data.ceilingHeightValue = $(this).val();

		}
		else if(triggeredChange == "wallWidth2") {
			case2Data.wallLen = $(this).val();

			$("#occupantDist2").attr("max", case2Data.wallLen/2);
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
		else if (triggeredChange == "lowE2") {
			case2Data.intLowEEmissivity = $(this).val();
		}
		else if (triggeredChange == "outdoortemp2") {
			case2Data.outdoorTempValue = $(this).val();
		}
		else if (triggeredChange == "airtemp2") {
			case2Data.airtempValue = $(this).val();
		}
		else if (triggeredChange == "humidity2") {
			case2Data.humidityValue = $(this).val();
		}



		else {
			alert("Don't know what changed!");
		}


		updateData(case2Data);
	})

	$("#lowECheck2").change(function(event){

		if (($("#lowECheck2").is(":checked")) == true) {
			case2Data.intLowEChecked = true;
			$("#lowE2").val(0.2);
			case2Data.intLowEEmissivity = 0.2;

			$("#lowE2").removeClass("inactive");
			$("#lowELabel2").removeClass("inactive");
			$("#checkLowE2").removeClass("unselected");

		} else if (($("#lowECheck2").is(":checked")) == false) {
			case2Data.intLowEChecked = false;
			$("#lowE2").val(" ");
			$("#lowE2").addClass("inactive");
			$("#lowELabel2").addClass("inactive");
			$("#checkLowE2").addClass("unselected");
		}

		updateData(case2Data);

	})

	// Case 2 - Changes based on increment bttons
		$("#ceiling2").on("spin", function(event, ui) {
			case2Data.ceilingHeightValue = ui.value;

			updateData(case2Data);
		})

		$("#wallWidth2").on("spin", function(event, ui) {
			case2Data.wallLen = ui.value;

			$("#occupantDist2").attr("max", case2Data.wallLen/2);

			updateData(case2Data);
		})


		$("#windowHeight2").on("spin", function(event, ui) {
			case2Data.windowHeightValue = ui.value;

			updateData(case2Data);
		})

		$("#windowWidth2").on("spin", function(event, ui) {
			case2Data.windowWidthValue = ui.value;
			updateData(case2Data);
		})

		$("#glazing2").on("spin", function(event, ui) {
			case2Data.glzRatioValue = ui.value;
			updateData(case2Data);
		})

		$("#sill2").on("spin", function(event, ui) {
			case2Data.sillHeightValue = ui.value;

			updateData(case2Data);
		})

		$("#distWindow2").on("spin", function(event, ui) {
			case2Data.distanceWindows = ui.value;

			updateData(case2Data);
		})

		$("#uvalue2").on("spin", function(event, ui) {
			case2Data.uvalueValue = ui.value;

			updateData(case2Data);
		})

		$("#lowE2").on("spin", function(event, ui) {
			case2Data.intLowEEmissivity = ui.value;

			updateData(case2Data);
		})

		$("#outdoortemp2").on("spin", function(event, ui) {
			case2Data.outdoorTempValue = ui.value;

			updateData(case2Data);
		})

		$("#airtemp2").on("spin", function(event, ui) {
			case2Data.airtempValue = ui.value;

			updateData(case2Data);
		})
		$("#humidity2").on("spin", function(event, ui) {
			case2Data.humidityValue = ui.value;

			updateData(case2Data);
		})


	// Case 3 - Changes based on typed inputs
	$("#ceiling3, #wallWidth3, #windowHeight3, #windowWidth3, #glazing3, #sill3, #distWindow3, #uvalue3, #lowE3, #outdoortemp3, #airtemp3, #humidity3").focusout(function(event) {

		//figure out what input changed
		var triggeredChange = event.target.id;


		if(triggeredChange == "ceiling3") {
			case3Data.ceilingHeightValue = $(this).val();

		}
		else if(triggeredChange == "wallWidth3") {
			case3Data.wallLen = $(this).val();

			$("#occupantDist3").attr("max", case3Data.wallLen/2);

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
		else if (triggeredChange == "lowE3") {
			case3Data.intLowEEmissivity = $(this).val();
		}
		else if (triggeredChange == "rvalue3") {
			case3Data.rvalueValue = $(this).val();
		}
		else if (triggeredChange == "outdoortemp3") {
			case3Data.outdoorTempValue = $(this).val();
		}
		else if (triggeredChange == "airtemp3") {
			case3Data.airtempValue = $(this).val();
		}
		else if (triggeredChange == "humidity3") {
			case3Data.humidityValue = $(this).val();
		}

		else {
			alert("Don't know what changed!");
		}


		updateData(case3Data);
	})

	$("#lowECheck3").change(function(event) {
		if (($("#lowECheck3").is(":checked")) == true) {
			case3Data.intLowEChecked = true;
			$("#lowE3").val(0.2);
			case3Data.intLowEEmissivity = 0.2;

			$("#lowE3").removeClass("inactive");
			$("#lowELabel3").removeClass("inactive");
			$("#checkLowE3").removeClass("unselected");

		} else if (($("#lowECheck3").is(":checked")) == false) {
			case3Data.intLowEChecked = false;
			$("#lowE3").val(" ");
			$("#lowE3").addClass("inactive");
			$("#lowELabel3").addClass("inactive");
			$("#checkLowE3").addClass("unselected");
		}

		updateData(case3Data);
	})

	// Case 3 - Changes based on increment buttons
		$("#ceiling3").on("spin", function(event, ui) {
			case3Data.ceilingHeightValue = ui.value;

			updateData(case3Data);
		})

		$("#wallWidth3").on("spin", function(event, ui) {
			case3Data.wallLen = ui.value;


			$("#occupantDist3").attr("max", case3Data.wallLen/2);


			updateData(case3Data);
		})


		$("#windowHeight3").on("spin", function(event, ui) {
			case3Data.windowHeightValue = ui.value;
			updateData(case3Data);
		})

		$("#windowWidth3").on("spin", function(event, ui) {
			case3Data.windowWidthValue = ui.value;
			updateData(case3Data);
		})

		$("#glazing3").on("spin", function(event, ui) {
			case3Data.glzRatioValue = ui.value;
			updateData(case3Data);
		})

		$("#sill3").on("spin", function(event, ui) {
			case3Data.sillHeightValue = ui.value;

			updateData(case3Data);
		})

		$("#distWindow3").on("spin", function(event, ui) {
			case3Data.distanceWindows = ui.value;

			updateData(case3Data);
		})

		$("#uvalue3").on("spin", function(event, ui) {
			case3Data.uvalueValue = ui.value;

			updateData(case3Data);
		})

		$("#lowE3").on("spin", function(event, ui) {
			case3Data.intLowEEmissivity = ui.value;

			updateData(case3Data);
		})

		$("#outdoortemp3").on("spin", function(event, ui) {
			case3Data.outdoorTempValue = ui.value;

			updateData(case2Data);
		})

		$("#airtemp3").on("spin", function(event, ui) {
			case3Data.airtempValue = ui.value;

			updateData(case2Data);
		})
		$("#humidity3").on("spin", function(event, ui) {
			case3Data.humidityValue = ui.value;

			updateData(case2Data);
		})








	/* ------ FUNCTIONS TO UPDATE DATA ------ */
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
		var newCondensation = fullData.condensation;


		// Update values in object
		//update window width
		object.windowWidthValue = newGlzWidth;
		//update glazing ratio
		object.glzRatioValue = newGlzRatio*100;
		//update window height
		object.windowHeightValue = newGlzHeight;
		//update sill height
		object.sillHeightValue = newSillHeight;
		//update dist btwn windows.
		object.distanceWindows = newCentLineDist;



		// Update the PPD graph and facade SVG.
		// Update the geometry values in the form.
		if (object == case1Data) {
			$("#windowWidth").val(Math.round(object.windowWidthValue * 100) / 100);
			$("#glazing").val((Math.round(object.glzRatioValue)));
			$("#windowHeight").val(Math.round(object.windowHeightValue * 100) / 100);
			$("#sill").val(Math.round(object.sillHeightValue * 100) / 100);
			$("#distWindow").val(Math.round(object.distanceWindows * 100) / 100);

			glzCoords = newGlzCoords;
			glzWidth = newGlzWidth;
			glzHeight = newGlzHeight;

			checkCondensation(newCondensation, allData2.condensation, allData3.condensation);

			updateGraphData(newDataset, newOccLocData, graphPoints, ".connectLine", ".occdot1");

			occPointData = newOccLocData;

		}

		else if (object == case2Data) {
			$("#windowWidth2").val(Math.round(object.windowWidthValue * 100) / 100);
			$("#glazing2").val((Math.round(object.glzRatioValue)));
			$("#windowHeight2").val(Math.round(object.windowHeightValue * 100) / 100);
			$("#sill2").val(Math.round(object.sillHeightValue * 100) / 100);
			$("#distWindow2").val(Math.round(object.distanceWindows * 100) / 100);

			glzCoordsCase2 = newGlzCoords;
			glzWidthCase2 = newGlzWidth;
			glzHeightCase2 = newGlzHeight;

			checkCondensation(allData.condensation, newCondensation, allData3.condensation);

			updateGraphData(newDataset, newOccLocData, graphCase2Points, ".connectLine2", ".occdot2");

			occPointData2 = newOccLocData;
		}

		else if (object == case3Data) {
			$("#windowWidth3").val(Math.round(object.windowWidthValue * 100) / 100);
			$("#glazing3").val((Math.round(object.glzRatioValue)));
			$("#windowHeight3").val(Math.round(object.windowHeightValue * 100) / 100);
			$("#sill3").val(Math.round(object.sillHeightValue * 100) / 100);
			$("#distWindow3").val(Math.round(object.distanceWindows * 100) / 100);

			glzCoordsCase3 = newGlzCoords;
			glzWidthCase3 = newGlzWidth;
			glzHeightCase3 = newGlzHeight;

			checkCondensation(allData.condensation, allData2.condensation, newCondensation);

			updateGraphData(newDataset, newOccLocData, graphCase3Points, ".connectLine3", ".occdot3");

			occPointData3 = newOccLocData;
		}

		updateFacade();

		// Update static tooltip text
		thresholdDataText();

	}


	function autocalcUValues() {

		// Re-run the functions with the new inputs.
		var fullDataCase1 = script.computeData(case1Data);
		var fullDataCase2 = script.computeData(case2Data);
		var fullDataCase3 = script.computeData(case3Data);

		//Compute the U-Value required to make the occupant comfortable.
		case1Data.uvalueValue = uVal.uValFinal(fullDataCase1.wallViews[12], fullDataCase1.glzViews[12], fullDataCase1.facadeDist[12], fullDataCase1.dwnPPDFac, parseFloat(case1Data.windowHeightValue), case1Data.airtempValue, case1Data.outdoorTempValue, rvalueValue, case1Data.intLowEChecked, case1Data.intLowEEmissivity, airspeedValue, case1Data.humidityValue, metabolic, clothingValue, ppdValue);

		case2Data.uvalueValue = uVal.uValFinal(fullDataCase2.wallViews[12], fullDataCase2.glzViews[12], fullDataCase2.facadeDist[12], fullDataCase2.dwnPPDFac, parseFloat(case2Data.windowHeightValue), case2Data.airtempValue, case2Data.outdoorTempValue, rvalueValue, case2Data.intLowEChecked, case2Data.intLowEEmissivity, airspeedValue, case2Data.humidityValue, metabolic, clothingValue, ppdValue);

		case3Data.uvalueValue = uVal.uValFinal(fullDataCase3.wallViews[12], fullDataCase3.glzViews[12], fullDataCase3.facadeDist[12], fullDataCase3.dwnPPDFac, parseFloat(case3Data.windowHeightValue), case3Data.airtempValue, case3Data.outdoorTempValue, rvalueValue, case3Data.intLowEChecked, case3Data.intLowEEmissivity, airspeedValue, case3Data.humidityValue, metabolic, clothingValue, ppdValue);

		// Update the value in the form.
		$("#uvalue").val(Math.round(case1Data.uvalueValue * 1000) / 1000);
		$("#uvalue2").val(Math.round(case2Data.uvalueValue * 1000) / 1000);
		$("#uvalue3").val(Math.round(case3Data.uvalueValue * 1000) / 1000);


		// Re-run the functions with the new inputs.
		fullDataCase1 = script.computeData(case1Data);
		fullDataCase2 = script.computeData(case2Data);
		fullDataCase3 = script.computeData(case3Data);


		// Update the PPD graph and facade SVG.
		updateGraphData(fullDataCase1.dataSet, fullDataCase1.occPtInfo, graphPoints, ".connectLine", ".occdot1");
		updateFacade(case1Data, fullDataCase1.glzCoords, fullDataCase1.windowWidth, fullDataCase1.windowHeight);

		updateGraphData(fullDataCase2.dataSet, fullDataCase2.occPtInfo, graphCase2Points, ".connectLine2", ".occdot2");
		updateFacade(case2Data, fullDataCase2.glzCoords, fullDataCase2.windowWidth, fullDataCase2.windowHeight);

		updateGraphData(fullDataCase3.dataSet, fullDataCase3.occPtInfo, graphCase3Points, ".connectLine3", ".occdot3");
		updateFacade(case3Data, fullDataCase3.glzCoords, fullDataCase3.windowWidth, fullDataCase3.windowHeight);

		checkUValue(case1Data.uvalueValue, case2Data.uvalueValue, case3Data.uvalueValue);

		occPointData = fullDataCase1.occPtInfo;
		occPointData2 = fullDataCase2.occPtInfo;
		occPointData3 = fullDataCase3.occPtInfo;



		thresholdDataText();

	}



	/* ------ FUNCTIONS TO UPDATE VISUALS ------ */
	function updateGraphData(upDataset, upOccupantPoint, dotSelector, lineSelector, occSelector) {

		defineScales();

		//update graph with revised data
		dotSelector.data(upDataset)
			.attr("d", d3.svg.symbol()
				.type(function(d) {
					if (d.govfact == "dwn") {
						return "triangle-up";
					} else if (d.govfact == "mrt") {
						return "circle";
					}
				})
				.size("35"))
			.attr("transform", function(d) {
					return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.ppd)) + ")";})
			.transition()
			.duration(500);


		//update connection line
		graphSvg.selectAll(lineSelector)
			.attr("d", line(upDataset))
			.transition()
			.duration(500);

		//update occupant point if different
		d3.selectAll(occSelector)
			.attr("d", d3.svg.symbol()
				.type(function() {
					if (upOccupantPoint.govfact == "dwn") {
						return "triangle-up";
					} else if (upOccupantPoint.govfact == "mrt") {
						return "circle";
					}
				})
				.size("35"))
			.attr("transform", function() {
				return "translate(" + (margin.left + x(upOccupantPoint.dist)) + "," + (margin.top + y(upOccupantPoint.ppd)) + ")";})
			.transition()
			.duration(500);

		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();
	}


	function updateFacade() {

		//re-evaluate scales
		defineScales();


		/* -- UPDATE CASE 1 FACADE REPRESENTATION -- */
		//update wall
		d3.select("#facadeCase1")
			.attr("height", facHeight + facMargin.top + facMargin.bottom)
			.transition()
			.duration(500);
		wallCase1
			.attr("width", function(d) {return facadeScaleWidth(case1Data.wallLen)})
			.attr("height", function(d) {return facadeScaleHeight(case1Data.ceilingHeightValue)})
			.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")"
			})
			.transition()
			.duration(500);
		//update windows
		d3.selectAll("rect.window1").remove();
		facadeSvgCase1.selectAll(".window1")
			.data(glzCoords)
			.enter()
			.append("rect")
			.attr("class", "window1 blue")
			.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case1Data.wallLen)/2)})
			.attr("y", function(d) {return (facadeScaleHeight(case1Data.ceilingHeightValue - d[3][2]))})
			.attr("width", facadeScaleWidth(glzWidth))
			.attr("height", facadeScaleHeight(glzHeight))
			.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")"
			});


		/* -- UPDATE CASE 2 FACADE REPRESENTATION -- */
		d3.select("#facadeCase2")
			.attr("height", facHeight + facMargin.top + facMargin.bottom)
			.transition()
			.duration(500);
		wallCase2.attr("width", function(d) {return facadeScaleWidth(case2Data.wallLen)})
			.attr("height", function(d) {return facadeScaleHeight(case2Data.ceilingHeightValue)})
			.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case2CeilingDiff)) + ")"
			})
			.transition()
			.duration(500);
		//update windows
		d3.selectAll("rect.window2").remove()
		facadeSvgCase2.selectAll(".window2")
			.data(glzCoordsCase2)
			.enter()
			.append("rect")
			.attr("class", function(d) {
				if ($("#caseSelection #case2Label").hasClass("unselected")) {
					return "window2 white"
				} else {
					return "window2 blue"
				}
			})
			.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case2Data.wallLen)/2)})
			.attr("y", function(d) {return (facadeScaleHeight(case2Data.ceilingHeightValue - d[3][2]))})
			.attr("width", facadeScaleWidth(glzWidthCase2))
			.attr("height", facadeScaleHeight(glzHeightCase2))
			.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case2CeilingDiff)) + ")"
			});




		/* -- UPDATE CASE 3 FACADE REPRESENTATION -- */
		d3.select("#facadeCase3")
			.attr("height", facHeight + facMargin.top + facMargin.bottom)
			.transition()
			.duration(500);
		wallCase3.attr("width", function(d) {return facadeScaleWidth(case3Data.wallLen)})
			.attr("height", function(d) {return facadeScaleHeight(case3Data.ceilingHeightValue)})
			.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case3CeilingDiff)) + ")"
			})
			.transition()
			.duration(500);
		//update windows
		d3.selectAll("rect.window3").remove()
		facadeSvgCase3.selectAll(".window3")
			.data(glzCoordsCase3)
			.enter()
			.append("rect")
			.attr("class", function(d) {
				if ($("#caseSelection #case3Label").hasClass("unselected")) {
					return "window3 white"
				} else {
					return "window3 blue"
				}
			})
			.attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case3Data.wallLen)/2)})
			.attr("y", function(d) {return (facadeScaleHeight(case3Data.ceilingHeightValue - d[3][2]))})
			.attr("width", facadeScaleWidth(glzWidthCase3))
			.attr("height", facadeScaleHeight(glzHeightCase3))
			.attr("transform", function() {
				return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case3CeilingDiff)) + ")"
			});




		// Update dimensions
		$(".dimensions").remove();
		addDimensions(glzCoords, glzWidth, glzHeight);

		checkOccupantImageSize(case1Data, "#occupantImage", "#occupantDist", "#case1Heading");
		checkOccupantImageSize(case2Data, "#occupantImage2", "#occupantDist2", "#case2Heading");
		checkOccupantImageSize(case3Data, "#occupantImage3", "#occupantDist3", "#case3Heading");


	}



	function checkOccupantImageSize(caseName, imageID, sliderID, labelID) {

		var imageHeight = $("#occupantImage").height();
		var imageWidth = $("#occupantImage").width();

		// original image dimensions
		var originalHeight = 500;
		var originalWidth = 360;

		//assume 4.25ft sitting height
		var resizeHeight = resizeHeight = Math.round(facadeScaleHeight(4.25));


		var resizeWidth = Math.round((resizeHeight/originalHeight)*originalWidth);

		var diffBtwSVGandFacade = facWidth - facadeScaleWidth(caseName.wallLen);


		var newLeft = 0 - resizeWidth/2;
		var newBottom = Math.round(resizeHeight + facMargin.bottom*2);

		var newbackgroundsize = resizeWidth.toString() + "px " + resizeHeight.toString() + "px";

		$(imageID).css({
			width: resizeWidth,
			height: resizeHeight,
			//left: newLeft,
			bottom: newBottom,
			backgroundSize: newbackgroundsize,
		})

		$(labelID).css({
			width: facadeScaleWidth(caseName.wallLen)/2
		})


		$(sliderID).css({
			width: facadeScaleWidth(caseName.wallLen)/2,
		})

	}

	function updateOccupantImageLocation(imageID, sliderID, caseName) {


		var slider = $(sliderID);
 		var width = slider.width();
 		var imageWidth = parseFloat($(imageID).css("width"));

		var sliderScale = d3.scale.linear()
			.domain([slider.attr("min"), slider.attr("max")])
			.range([0, width]);

		var newPosition = sliderScale(caseName.occDistToWallCenter);

		var newLeftPosition = (0 - imageWidth/2 + newPosition) + "px";

	   	// Move occupant image
	   	$(imageID).css({
	       left: newLeftPosition,
		})
	}


	/* ------ FUNCTIONS FOR GENERAL REFERENCE VISUALS ------ */

	function sizeButton() {
    	if (($("#caseSelection #case2Label").hasClass("unselected")==true) && ($("#caseSelection #case3Label").hasClass("unselected")==true)) {

    		$("#calcUValue").css("width","48px");

    	} else if (($("#caseSelection #case2Label").hasClass("unselected")==true) && ($("#caseSelection #case3Label").hasClass("unselected")==false)) {
    		$("#calcUValue").css("width","171px");

    	} else if (($("#caseSelection #case2Label").hasClass("unselected")==false) && ($("#caseSelection #case3Label").hasClass("unselected")==true)) {
    		$("#calcUValue").css("width","101px");

    	} else if (($("#caseSelection #case2Label").hasClass("unselected")==false) && ($("#caseSelection #case3Label").hasClass("unselected")==false)) {
    		$("#calcUValue").css("width","171px");

    	}
    }

	function checkCondensation(conValue1, conValue2, conValue3) {

		if (conValue1 != "none" || conValue2 != "none" || conValue3 != "none") {
			$("#condensation").css("display","block");

			if (conValue1 != "none") {
				$("#humidity").css("color", "#f72734");
			}

			if (conValue2 != "none") {
				$("#humidity2").css("color", "#f72734");
			}

			if (conValue3 != "none") {
				$("#humidity3").css("color", "#f72734");
			}

		} else {
			$("#condensation").css("display","none")
			$("#humidity, #humidity2, #humidity3").css("color", "black");
		}
	}

	function checkUValue(UValue1, UValue2, UValue3) {

		if (UValue1 <= 0.05 || UValue2 <= 0.05 || UValue3 <= 0.05) {
			$("#uvaluePop").css("display","block");

			if (UValue1 <= 0.05) {
				$("#uvalue").css("color", "#f72734");
				$("#airtemp").css("color", "#f72734");
				$("#clothing").css("color", "#f72734");
			}

			if (UValue2 <= 0.05) {
				$("#uvalue2").css("color", "#f72734");
				$("#airtemp2").css("color", "#f72734");
				$("#clothing").css("color", "#f72734");
			}

			if (UValue3 <= 0.05) {
				$("#uvalue3").css("color", "#f72734");
				$("#airtemp3").css("color", "#f72734");
				$("#clothing").css("color", "#f72734");
			}

		} else {
			$("#uvaluePop").css("display","none")
			$("#uvalue, #uvalue2, #uvalue3").css("color", "black");
		}
	}

	function determineInputProportion() {

		var svgProportionData = {};
		// maxCeilingCase, maxLengthCase, maxProportion

		// find the max ceiling height and wall length out of the 3 cases
		var ceilingHeightArray = [case1Data.ceilingHeightValue, case2Data.ceilingHeightValue, case3Data.ceilingHeightValue];
		var maxCeilingHeight = d3.max(ceilingHeightArray);

		if (maxCeilingHeight == case1Data.ceilingHeightValue) {
			svgProportionData.maxCeilingCase = case1Data;
		} else if (maxCeilingHeight == case2Data.ceilingHeightValue) {
			svgProportionData.maxCeilingCase = case2Data;
		} else if (maxCeilingHeight == case3Data.ceilingHeightValue) {
			svgProportionData.maxCeilingCase = case3Data;
		};


		var wallLengthArray = [case1Data.wallLen, case2Data.wallLen, case3Data.wallLen];
		var maxWallLength = d3.max(wallLengthArray);

		if (maxWallLength == case1Data.wallLen) {
			svgProportionData.maxLengthCase = case1Data;
		} else if (maxWallLength == case2Data.wallLen) {
			svgProportionData.maxLengthCase = case2Data;
		} else if (maxWallLength == case3Data.wallLen) {
			svgProportionData.maxLengthCase = case3Data;
		};


		svgProportionData.maxProportion = maxWallLength/maxCeilingHeight;

		return svgProportionData;
	}


	function occupantPositionText(occdata, className, caseName) {

		var text = "";
		var reason = "";

		if (occdata.govfact == "dwn") {
			reason = "downdraft discomfort";
		} else {
			reason = "radiant discomfort";
		}


		if (occdata.ppd <= ppdValue) {
			text = "<h1 class=" + className + "><span id='icon' class='check'></span>" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD from " + reason + ".</h1>";
		} else {
			text = "<h1 class=" + className + "><span id='icon' class='cross'></span>" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD from " + reason + ".</h1>";
		}

		return text;
	}



	// Display text for occupancy dist from facade
	function thresholdDataText() {


		var totalText = "";
		$("#thresholdTooltip").empty();

		var case1Text = occupantPositionText(occPointData, "case1Text", "Case 1");
		var case2Text = occupantPositionText(occPointData2, "case2Text", "Case 2");
		var case3Text = occupantPositionText(occPointData3, "case3Text", "Case 3");



		//find min cy of visible occ points
		var compareOccupantArray = [];


		if ($("#caseSelection #case1Label").hasClass("unselected") == false ) {
			totalText = case1Text;
			compareOccupantArray.push(occPointData.ppd);
		}

		if ($("#caseSelection #case2Label").hasClass("unselected") == false ) {
			totalText = totalText + case2Text;
			compareOccupantArray.push(occPointData2.ppd);
		}

		if ($("#caseSelection #case3Label").hasClass("unselected") == false ) {
			totalText = totalText + case3Text;
			compareOccupantArray.push(occPointData3.ppd);
		}


		$("#thresholdTooltip").append(totalText);

		var divHeight = $("div#thresholdTooltip").height() - 10; //10 = padding

		var xPosition = x(occPointData.dist) + margin.left + 15;
		var yPosition;
		if (d3.max(compareOccupantArray) < 25) {
			// all ppd values are less than 25
			yPosition = y(d3.max(compareOccupantArray)) - divHeight;
		} else if (d3.max(compareOccupantArray) > 25) {
			// at least one case is above 25
			if (d3.min(compareOccupantArray) <= 23) {
				// but at least 1 case below 23
				// locate text box next to lowest point
				yPosition = y(d3.min(compareOccupantArray)) - divHeight;
			} else { // all are above 25
				// locate text box at top of chart
				yPosition = 0 + margin.top;
			}
		}


		d3.select("#thresholdTooltip")
		.style("left", xPosition + "px")
		.style("top", yPosition + "px");


	} // end thresholdDataText


	function drawPPDThreshold(data) {

		//data = PPD threshold (ie 10%)

		// add shaded rectangle
		graphSvg.append("rect")
			.attr("class", "thresholdRect")
			.attr("x", 0)
			.attr("y", function() { return y(data)})
			.attr("width", width) //use width of graph
			.attr("height", function() { return height - y(data)})
			.attr("transform", function() {
					return "translate(" + margin.left + "," + margin.top + ")";})
			.style("fill", lightgrey);

		var ppdLine = graphSvg.append("g")
			.attr("class", "referenceLineGroup")
			.attr("transform", function() {
					return "translate(" + margin.left + "," + margin.top + ")";})


		// add line
		ppdLine.append("line")
			.attr("class","refLine")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", y(data))
			.attr("y2", y(data))
			.style("stroke", "black");


		// add symbols
		ppdLine.append("svg:image")
			.attr("class", "checkLine")
			.attr("xlink:href", "static/images/check.png")
			.attr("x", 4)
			.attr("y", y(data) + 4)
			.attr("width", 12)
			.attr("height", 12);

		var crossLine = ppdLine.append("svg:image")
			.attr("class", "crossLine")
			.attr("xlink:href", "static/images/x.png")
			.attr("x", 4)
			.attr("y", y(data) - 16)
			.attr("width", 12)
			.attr("height", 12);

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
			.attr("y", function() { return y(data)})
			.attr("height", function() { return height - y(data)});

		// add symbols
		d3.selectAll(".checkLine")
			.transition()
			.duration(400)
			.attr("y", y(data) + 4);

		d3.selectAll(".crossLine")
			.transition()
			.duration(400)
			.attr("y", y(data) - 16);
	}


	function occupantDistanceRefLine() {

		//find max cy of visible occ points
		var compareOccupantArray = [];

		if ($("#caseSelection #case1Label").hasClass("unselected") == false ) {
			compareOccupantArray.push(occPointData.ppd);
		}

		if ($("#caseSelection #case2Label").hasClass("unselected") == false ) {
			compareOccupantArray.push(occPointData2.ppd);
		}

		if ($("#caseSelection #case3Label").hasClass("unselected") == false ) {
			compareOccupantArray.push(occPointData3.ppd);
		}



		var xPosition = x(occPointData.dist);
		var yPosition = y(d3.min(compareOccupantArray));

		// add line
		graphSvg.append("line")
			.attr("class","occupantLine")
			.attr("x1", xPosition)
			.attr("x2", xPosition)
			.attr("y1", height)
			.attr("y2", yPosition + 8)
			.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";
			});
	}





	function addDimensions(glazingData, glazingWidth, glazingHeight) {

		//get position of left-most window
		var firstWindow = $(".window1:last");


		var leftEdgeWindow = parseFloat(firstWindow.attr("x"));
		var middleWidth = parseFloat(firstWindow.attr("x")) + facadeScaleWidth(glazingWidth/2);
		var verticalWindowMidpoint = parseFloat(firstWindow.attr("y")) + facadeScaleHeight(glazingHeight/2);
		var topOfWindow = parseFloat(firstWindow.attr("y"));
		var bottomOfWindow = parseFloat(firstWindow.attr("y")) + facadeScaleHeight(glazingHeight);
		var sillHeightPixels = facadeScaleHeight(glazingData[0][0][2]);

		try {
			var windowSeparationPixels = facadeScaleWidth(glazingData[0][0][0]) - facadeScaleWidth(glazingData[1][0][0]);
		} catch (err) {
			var windowSeparationPixels = case1Data.wallLen/2
		}



		// window height
		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowHeightDim")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")");
		var windowHeightDimensions = facadeSvgCase1.selectAll("#windowHeightDim");
		windowHeightDimensions.append("line")
		    .attr("class", "dimline")
		    .attr("x2", middleWidth)
			.attr("x1", middleWidth)
			.attr("y1", topOfWindow)
			.attr("y2", bottomOfWindow)
			.attr("marker-end", "url(#arrowhead)")
			.attr("marker-start", "url(#arrowhead)");


		//window width
		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowWidthDim")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")");
		var windowWidthDimensions = facadeSvgCase1.selectAll("#windowWidthDim");
		windowWidthDimensions.append("line")
		    .attr("class", "dimline")
		    .attr("x1", leftEdgeWindow)
			.attr("x2", leftEdgeWindow + facadeScaleWidth(glazingWidth))
			.attr("y1", verticalWindowMidpoint)
			.attr("y2", verticalWindowMidpoint)
			.attr("marker-start", "url(#arrowhead)")
			.attr("marker-end", "url(#arrowhead)");


		//sill height
		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "sillHeightDim")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")");
		var sillHeightDimensions = facadeSvgCase1.selectAll("#sillHeightDim");
		sillHeightDimensions.append("line")
		    .attr("class", "dimline")
		    .attr("x2", middleWidth)
			.attr("x1", middleWidth)
			.attr("y1", bottomOfWindow)
			.attr("y2", bottomOfWindow + sillHeightPixels)
			.attr("marker-end", "url(#arrowhead)")
			.attr("marker-start", "url(#arrowhead)");


		//window separation

		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowSepDim")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")");
		var windowSepDimensions = facadeSvgCase1.selectAll("#windowSepDim");

		if (case1Data.distanceWindows != case1Data.wallLen) {
			windowSepDimensions.append("line")
		    .attr("class", "dimline")
		    .attr("x1", middleWidth)
			.attr("x2", middleWidth + windowSeparationPixels)
			.attr("y1", verticalWindowMidpoint)
			.attr("y2", verticalWindowMidpoint)
			.attr("marker-start", "url(#arrowhead)")
			.attr("marker-end", "url(#arrowhead)");
		} else {
			windowSepDimensions.append("line")
		    .attr("class", "dimline")
		    .attr("x1", 0)
			.attr("x2", function() {return facadeScaleWidth(case1Data.wallLen)})
			.attr("y1", function() {return facadeScaleHeight(case1Data.ceilingHeightValue/2)})
			.attr("y2", function() {return facadeScaleHeight(case1Data.ceilingHeightValue/2)})
			.attr("marker-start", "url(#arrowhead)")
			.attr("marker-end", "url(#arrowhead)");
		}


		// ceiling height
		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "facadeHeightDim")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")");
		var facHeightDimensions = facadeSvgCase1.selectAll("#facadeHeightDim");
		facHeightDimensions.append("line")
		    .attr("class", "dimline")
		    .attr("x1", function() {return facadeScaleWidth(case1Data.wallLen/4)})
			.attr("x2", function() {return facadeScaleWidth(case1Data.wallLen/4)})
			.attr("y2", 0)
			.attr("y1", function() {return facadeScaleHeight(case1Data.ceilingHeightValue)})
			.attr("marker-end", "url(#arrowhead)")
			.attr("marker-start", "url(#arrowhead)");

		// room length
		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "facadeWidthDim")
			.attr("transform", "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case1CeilingDiff)) + ")");
		var facWidthDimensions = facadeSvgCase1.selectAll("#facadeWidthDim");
		facWidthDimensions.append("line")
		    .attr("class", "dimline")
		    .attr("x1", 0)
			.attr("x2", function() {return facadeScaleWidth(case1Data.wallLen)})
			.attr("y1", function() {return facadeScaleHeight(case1Data.ceilingHeightValue/2)})
			.attr("y2", function() {return facadeScaleHeight(case1Data.ceilingHeightValue/2)})
			.attr("marker-start", "url(#arrowhead)")
			.attr("marker-end", "url(#arrowhead)");
	}




} //end makeGraph()
