

var render = render || {}

//function to make graph
render.makeGraph = function () {


	var maxContainerWidth = 550; // based on Payette website layout
	var color1 = "rgb(21,222,154)";
	var color2 = "rgb(0,168,150)";
	var color3 = "rgb(0,108,131)";
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
    .text("Percentage of People Dissatisfied (PPD)");






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
		.append("circle")
		.attr("class","dotCase1")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.dist); })
		.attr("cy", function(d) { return y(d.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", color1);

	var graphCase2Points = graphSvg.selectAll(".dotCase2")
		.data(dataset2)
		.enter()
		.append("circle")
		.attr("class","dotCase2")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.dist); })
		.attr("cy", function(d) { return y(d.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", color2);

	var graphCase3Points = graphSvg.selectAll(".dotCase3")
		.data(dataset3)
		.enter()
		.append("circle")
		.attr("class","dotCase3")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.dist); })
		.attr("cy", function(d) { return y(d.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", color3);

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
		.style("stroke", color1);

	var occupantPoint2 = graphSvg.append("circle")
		.attr("class","occdot2")
		.attr("r", 4)
		.attr("cx", function(d) { return x(occPointData2.dist); })
		.attr("cy", function(d) { return y(occPointData2.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 3)
		.style("stroke", color2);

	var occupantPoint3 = graphSvg.append("circle")
		.attr("class","occdot3")
		.attr("r", 4)
		.attr("cx", function(d) { return x(occPointData3.dist); })
		.attr("cy", function(d) { return y(occPointData3.ppd); })
		.attr("transform", function() {
				return "translate(" + margin.left + "," + margin.top + ")";})
		.style("fill", "#FFF")
		.style("stroke-width", 3)
		.style("stroke", color3);

	// Add line at occupant location
	occupantDistanceRefLine();

	// add text at occupanct location
/*	thresholdDataText();

*/


	// Show text on hover over dot
	var points = d3.selectAll(".dotCase1, .dotCase2, .dotCase3");
	points.on("mouseover", function(d) {

		//Get this dots x/y values, then augment for the tooltip
		var xPosition = parseFloat(d3.select(this).attr("cx")) + margin.left;
		var yPosition = parseFloat(d3.select(this).attr("cy"));

		var caseText = "";

		if (d3.select(this).attr("class") == "dotCase1") {
			caseText = "1";
			$("#tooltip h1").addClass("case1Text");
			$("#tooltip h1").removeClass("case2Text");
			$("#tooltip h1").removeClass("case3Text");
		} else if (d3.select(this).attr("class") == "dotCase2") {
			caseText = "2";
			$("#tooltip h1").addClass("case2Text");
			$("#tooltip h1").removeClass("case1Text");
			$("#tooltip h1").removeClass("case3Text");
		} else if (d3.select(this).attr("class") == "dotCase3") {
			caseText = "3";
			$("#tooltip h1").addClass("case3Text");
			$("#tooltip h1").removeClass("case1Text");
			$("#tooltip h1").removeClass("case2Text");
		}

		//Update the tooltip position and value
		d3.select("#tooltip")
			.style("left", xPosition + "px")
			.select("#PPDtext")
			.text(Math.round(d.ppd*10)/10 + "% PPD");


		d3.select("#case")
			.text(caseText);



		//tolerable discomfort
		if (ppdValue >= d.ppd) {
			d3.select("#discomfort")
			.text("Tolerable discomfort")
			.classed("tolerable", true)
			.classed("intolerable", false);

			d3.select("#solution")
			.text(".");

			d3.select("span#icon")
			.classed("check", true)
			.classed("cross", false)

			d3.select("#tooltip")
			.style("top", (yPosition - margin.bottom/2) + "px")

			if (d.govfact == "mrt") {
				d3.select("#explain")
				.text("a low mean radiant temperature");
			} else if (d.govfact == "dwn") {
				d3.select("#explain")
				.text("downdraft");
			}
		//intolerable discomfort
		} else {
			d3.select("#discomfort")
			.text("Intolerable discomfort")
			.classed("tolerable", false)
			.classed("intolerable", true);

			d3.select("span#icon")
			.classed("check", false)
			.classed("cross", true)


			//gov factors
			if (d.govfact == "mrt") {
				d3.select("#explain")
				.text("a low mean radiant temperature");

				d3.select("#solution")
				.text(". To reduce discomfort, try adjusting the window geometry or reducing the U-value.");

				console.log($("#tooltip").height());

				d3.select("#tooltip")
				.style("top", (yPosition - $("#tooltip").height() + 10) + "px");
			} else if (d.govfact == "dwn") {
				d3.select("#explain")
				.text("downdraft");

				d3.select("#solution")
				.text(". To reduce discomfort, try decreasing the window height or U-value.");

				console.log($("#tooltip").height());

				d3.select("#tooltip")
				.style("top", (yPosition - $("#tooltip").height() + 10) + "px");

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


	function defineScales() {

		var proportinateMult;
		var inputProportion = determineInputProportion();

		// determine whether to use max ceiling height or max wall length for setting scales

		if (inputProportion > governingProportion) {
			// wall width should be maximized
			wallSVGWidth = maxAllowableFacWidth;

			// make svg height proportionate to facade width
			proportinateMult = case1Data.ceilingHeightValue/case1Data.wallLen;
			wallSVGHeight = proportinateMult*wallSVGWidth;
			
		} else if (inputProportion < governingProportion) {

			// ceiling height should be maximized
			wallSVGHeight = maxAllowableFacHeight;

			proportinateMult = case1Data.wallLen/case1Data.ceilingHeightValue;
			wallSVGWidth = proportinateMult*wallSVGHeight;

			// make svg width proportionate to facade height
		}

		facadeScaleWidth = d3.scale.linear()
				.domain([0, case1Data.wallLen]) //input domain
				.range([0, wallSVGWidth]); //output range

		facadeScaleHeight = d3.scale.linear()
				.domain([0, case1Data.ceilingHeightValue]) //input domain
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
			return "translate(" + facMargin.left + "," + facMargin.top + ")"
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
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
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
				return "translate(" + facMargin.left + "," + facMargin.top + ")"});

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
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
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
				return "translate(" + facMargin.left + "," + facMargin.top + ")"});

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
			return "translate(" + facMargin.left + "," + facMargin.top + ")";
		});




	//Ensure size of occupant image is correct
/*	checkOccupantImageSize(case1Data, "#occupantImage", "#occupantDist",  "#occDistLabel");
	checkOccupantImageSize(case2Data, "#occupantImage2", "#occupantDist2", "#occDistLabel2");
	checkOccupantImageSize(case3Data, "#occupantImage3", "#occupantDist3", "#occDistLabel3");*/





	//Initialize the windows
/*


	//Add facade dimensions
	drawHorziontalDimensions(wallPoints[0].wallWidth);
	drawVerticalDimensions(wallPoints[0].wallHeight);*/




	//Add window dimensions to Case 1 facade
	windowDimensions(glzCoords, glzWidth, glzHeight);

	//Update headings
	updateFacadeHeadings();




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




    /* ------ HIDE/SHOW CASES ------ */

    $("#caseSelection #case2Label").on("click", function() {

    	$("#case2Heading").toggleClass("greyText").toggleClass("case2Text");
    	$("#case2Button").toggleClass("unselected");


    	if ($(this).hasClass("unselected") == true) {
    		//becomes selected
			$(this).removeClass("unselected");

			sizeButton();

			$("#inputs input.case2, div.case2, #sliderWrapper2, .connectLine2, .dotCase2, .occdot2").css("display","inline-block");

			d3.selectAll("rect.wall2").classed("outlined", false);
			d3.selectAll("rect.wall2").classed("filled", true);
			d3.selectAll("rect.window2").classed("white", false);
			d3.selectAll("rect.window2").classed("blue", true);


		}

		else if ($(this).hasClass("unselected") == false) {
			// becomes unselected
			$(this).addClass("unselected");

			sizeButton();


			$("#inputs input.case2, div.case2, #sliderWrapper2, .connectLine2, .dotCase2, .occdot2").css("display","none");

			d3.selectAll("rect.wall2").classed("outlined", true);
			d3.selectAll("rect.wall2").classed("filled", false);
			d3.selectAll("rect.window2").classed("white", true);
			d3.selectAll("rect.window2").classed("blue", false);
		}

		// Update static tooltip text
		thresholdDataText();
		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();

		updateFacadeHeadings();

    });

    $("#caseSelection #case3Label").on("click", function() {

    	$("#case3Heading").toggleClass("greyText").toggleClass("case3Text");
    	$("#case3Button").toggleClass("unselected");


    	if ($(this).hasClass("unselected") == true) {
    		//becomes selected
			$(this).removeClass("unselected");

			sizeButton();

			$("#inputs input.case3, div.case3, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3").css("display","inline-block");

			d3.selectAll("rect.wall3").classed("outlined", false);
			d3.selectAll("rect.wall3").classed("filled", true);
			d3.selectAll("rect.window3").classed("white", false);
			d3.selectAll("rect.window3").classed("blue", true);
		}

		else if ($(this).hasClass("unselected") == false) {
			// becomes unselected
			$(this).addClass("unselected");

			sizeButton();

			$("#inputs input.case3, div.case3, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3").css("display","none");

			d3.selectAll("rect.wall3").classed("outlined", true);
			d3.selectAll("rect.wall3").classed("filled", false);
			d3.selectAll("rect.window3").classed("white", true);
			d3.selectAll("rect.window3").classed("blue", false);
		}


		// Update static tooltip text
		thresholdDataText();
		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();

		updateFacadeHeadings();

    });






	/* ------ DETECT CHANGES TO INPUT VALUES ------ */
	// universal changes
	$("#distFromFacade").change(function(event) {
		occDistFromFacade = $(this).val();

		$("#distFromFacade").val(occDistFromFacade);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);

		thresholdDataText();
		d3.selectAll(".occupantLine").remove();
		occupantDistanceRefLine();

		updateFacadeHeadings();
	});

	$("#ppd").change(function(event) {
		if ($(this).val() <= 4) {
			ppdValue = 5;
			$("#ppd").val(5);
		}
		else if ($(this).val() >30) {
			ppdValue = 30;
			$("#ppd").val(30);
		}
		else {
			ppdValue = $(this).val();
			$("#ppd").val(ppdValue);
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

	$("#calcUValue").click(function(event) {
		autocalcUValues();
	});




	$("#outdoortemp").focusout(function(event) {
		outdoorTempValue = $(this).val();

		$("#outdoortemp, #outdoortemp2, #outdoortemp3").val(outdoorTempValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#outdoortemp").on("spin", function(event, ui) {
		outdoorTempValue = ui.value;
		$("#outdoortemp, #outdoortemp2, #outdoortemp3").val(outdoorTempValue);
		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#airtemp, #airtemp2, #airtemp3").focusout(function(event) {
		airtempValue = $(this).val();
		$("#airtemp, #airtemp2, #airtemp3").val(airtempValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	});
	$("#airtemp").on("spin", function(event, ui) {
		airtempValue = ui.value;
		$("#airtemp, #airtemp2, #airtemp3").val(airtempValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#humidity").focusout(function(event) {
		humidityValue = $(this).val();

		$("#humidity, #humidity2, #humidity3").val(humidityValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#humidity").on("spin", function(event, ui) {
		humidityValue = ui.value;

		$("#humidity, #humidity2, #humidity3").val(humidityValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
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

	$("#airspeed, #airspeed2, #airspeed3").focusout(function(event) {
		airspeedValue = $(this).val();

		$("#airspeed, #airspeed2, #airspeed3").val(airspeedValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#airspeed").on("spin", function(event, ui) {
		airspeedValue = ui.value;

		$("#airspeed, #airspeed2, #airspeed3").val(airspeedValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#clothing").focusout(function(event) {
		clothingValue = $(this).val();

		$("#clothing, #clothing2, #clothing3").val(clothingValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#clothing").on("spin", function(event, ui) {
		clothingValue = ui.value;

		$("#clothing, #clothing2, #clothing3").val(clothingValue);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})

	$("#metabolic").focusout(function(event) {
		metabolic = $(this).val();

		$("#metabolic, #metabolic2, #metabolic3").val(metabolic);

		updateData(case1Data);
		updateData(case2Data);
		updateData(case3Data);
	})
	$("#metabolic").on("spin", function(event, ui) {
		metabolic = ui.value;

		$("#metabolic, #metabolic2, #metabolic3").val(metabolic);

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





	// Case 1 - Changes based on typed inputs
	$("#ceiling, #wallWidth, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowE, #rvalue").focusout(function(event) {

		//figure out what input changed
		var triggeredChange = event.target.id;

		if(triggeredChange == "ceiling") {

			case1Data.ceilingHeightValue = $(this).val();

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
		else if (triggeredChange == "rvalue") {
			case1Data.rvalueValue = $(this).val();

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.rvalueValue = case1Data.rvalueValue;
				$("#rvalue2").val(case2Data.rvalueValue);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.rvalueValue = case1Data.rvalueValue;
				$("#rvalue3").val(case3Data.rvalueValue);
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

		$("#rvalue").on("spin", function(event, ui) {
			case1Data.rvalueValue = ui.value;

			if ($("#caseSelection #case2Label").hasClass("unselected") == true){
				case2Data.rvalueValue = case1Data.rvalueValue;
				$("#rvalue2").val(case2Data.rvalueValue);
				updateData(case2Data);
			}
			if ($("#caseSelection #case3Label").hasClass("unselected") == true){
				case3Data.rvalueValue = case1Data.rvalueValue;
				$("#rvalue3").val(case3Data.rvalueValue);
				updateData(case3Data);
			}

			updateData(case1Data);
		})


	// Case 2 - Changes based on typed inputs
	$("#ceiling2, #wallWidth2, #windowHeight2, #windowWidth2, #glazing2, #sill2, #distWindow2, #uvalue2, #lowE2, #rvalue2").focusout(function(event) {

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
		else if (triggeredChange == "rvalue2") {
			case2Data.rvalueValue = $(this).val();
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

		$("#rvalue2").on("spin", function(event, ui) {
			case2Data.rvalueValue = ui.value;

			updateData(case2Data);
		})


	// Case 3 - Changes based on typed inputs
	$("#ceiling3, #wallWidth3, #windowHeight3, #windowWidth3, #glazing3, #sill3, #distWindow3, #uvalue3, #lowE3, #rvalue3").focusout(function(event) {

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
	})

	// Case 3 - Changes based on increment buttons
		$("#ceiling3").on("spin", function(event, ui) {
			case3Data.ceilingHeightValue = ui.value;

			updateData(case3Data);
		})

		$("#wallWidth2").on("spin", function(event, ui) {
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

		$("#rvalue3").on("spin", function(event, ui) {
			case3Data.rvalueValue = ui.value;

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

			updateGraphData(newDataset, newOccLocData, graphPoints, ".connectLine", "circle.occdot1", color1);

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

			updateGraphData(newDataset, newOccLocData, graphCase2Points, ".connectLine2", "circle.occdot2", color2);

			occPointData2 = newOccLocData;
		}

		else if (object == case3Data) {
			$("#windowWidth3").val(Math.round(object.windowWidthValue * 100) / 100);
			$("#glazing3").val((Math.round(object.glzRatioValue)));
			$("#windowHeight3").val(Math.round(object.windowHeightValue * 100) / 100);
			$("#sill3").val(Math.round(object.sillHeightValue * 100) / 100);
			$("#distWindow3").val(Math.round(object.distanceWindows * 100) / 100);

			glzCoordsCase3 = newGlzCoords
			glzWidthCase3 = newGlzWidth
			glzHeightCase3 = newGlzHeight

			updateGraphData(newDataset, newOccLocData, graphCase3Points, ".connectLine3", "circle.occdot3", color3);

			occPointData3 = newOccLocData;
		}

		updateFacade();

		// Update static tooltip text
		thresholdDataText();

		updateFacadeHeadings();

	}



	function autocalcUValues() {

		// Re-run the functions with the new inputs.
		var fullDataCase1 = script.computeData(case1Data);
		var fullDataCase2 = script.computeData(case2Data);
		var fullDataCase3 = script.computeData(case3Data);

		//Compute the U-Value required to make the occupant comfortable.
		case1Data.uvalueValue = uVal.uValFinal(fullDataCase1.wallViews[12], fullDataCase1.glzViews[12], fullDataCase1.facadeDist[12], fullDataCase1.runDownCalc, parseFloat(case1Data.windowHeightValue), airtempValue, outdoorTempValue, case1Data.rvalueValue, case1Data.intLowEChecked, case1Data.intLowEEmissivity, airspeedValue, humidityValue, metabolic, clothingValue, ppdValue);

		case2Data.uvalueValue = uVal.uValFinal(fullDataCase2.wallViews[12], fullDataCase2.glzViews[12], fullDataCase2.facadeDist[12], fullDataCase2.runDownCalc, parseFloat(case2Data.windowHeightValue), airtempValue, outdoorTempValue, case2Data.rvalueValue, case2Data.intLowEChecked, case2Data.intLowEEmissivity, airspeedValue, humidityValue, metabolic, clothingValue, ppdValue);

		case3Data.uvalueValue = uVal.uValFinal(fullDataCase3.wallViews[12], fullDataCase3.glzViews[12], fullDataCase3.facadeDist[12], fullDataCase3.runDownCalc, parseFloat(case3Data.windowHeightValue), airtempValue, outdoorTempValue, case3Data.rvalueValue, case3Data.intLowEChecked, case3Data.intLowEEmissivity, airspeedValue, humidityValue, metabolic, clothingValue, ppdValue);

		// Update the value in the form.
		$("#uvalue").val(Math.round(case1Data.uvalueValue * 1000) / 1000);
		$("#uvalue2").val(Math.round(case2Data.uvalueValue * 1000) / 1000);
		$("#uvalue3").val(Math.round(case3Data.uvalueValue * 1000) / 1000);


		// Re-run the functions with the new inputs.
		fullDataCase1 = script.computeData(case1Data);
		fullDataCase2 = script.computeData(case2Data);
		fullDataCase3 = script.computeData(case3Data);


		// Update the PPD graph and facade SVG.
		updateGraphData(fullDataCase1.dataSet, fullDataCase1.occPtInfo, graphPoints, ".connectLine", "circle.occdot1", color1);
		updateFacade(case1Data, fullDataCase1.glzCoords, fullDataCase1.windowWidth, fullDataCase1.windowHeight);

		updateGraphData(fullDataCase2.dataSet, fullDataCase2.occPtInfo, graphCase2Points, ".connectLine2", "circle.occdot2", color2);
		updateFacade(case2Data, fullDataCase2.glzCoords, fullDataCase2.windowWidth, fullDataCase2.windowHeight);

		updateGraphData(fullDataCase3.dataSet, fullDataCase3.occPtInfo, graphCase3Points, ".connectLine3", "circle.occdot3", color3);
		updateFacade(case3Data, fullDataCase3.glzCoords, fullDataCase3.windowWidth, fullDataCase3.windowHeight);

		occPointData = fullDataCase1.occPtInfo;
		occPointData2 = fullDataCase2.occPtInfo;
		occPointData3 = fullDataCase3.occPtInfo;



		thresholdDataText();
		updateFacadeHeadings();

	}





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
				return "translate(" + facMargin.left + "," + facMargin.top + ")";
			});


		/* -- UPDATE CASE 2 FACADE REPRESENTATION -- */
		d3.select("#facadeCase2")
			.attr("height", facHeight + facMargin.top + facMargin.bottom)
			.transition()
			.duration(500);
		wallCase2.attr("width", function(d) {return facadeScaleWidth(case2Data.wallLen)})
			.attr("height", function(d) {return facadeScaleHeight(case2Data.ceilingHeightValue)})
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
				return "translate(" + facMargin.left + "," + facMargin.top + ")";
			});


		/* -- UPDATE CASE 3 FACADE REPRESENTATION -- */
		d3.select("#facadeCase3")
			.attr("height", facHeight + facMargin.top + facMargin.bottom)
			.transition()
			.duration(500);
		wallCase3.attr("width", function(d) {return facadeScaleWidth(case3Data.wallLen)})
			.attr("height", function(d) {return facadeScaleHeight(case3Data.ceilingHeightValue)})
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
				return "translate(" + facMargin.left + "," + facMargin.top + ")";
			});


		/*"#facadeWidth, #facadeHeightDim, #facadeHeightDimLabel, #windowHeightDimLabel, 
		
		drawHorziontalDimensions(wallPoints[0].wallWidth);
		drawVerticalDimensions(wallPoints[0].wallHeight);*/

		// Update dimensions
		$("#windowHeightDimLabel, #sillHeightDimLabelTop, #sillHeightDimLabelBottom, .dimensions").remove();
		windowDimensions(glzCoords, glzWidth, glzHeight);
		/*
		checkOccupantImageSize(case1Data, "#occupantImage", "#occupantDist",  "#occDistLabel");
		checkOccupantImageSize(case2Data, "#occupantImage2", "#occupantDist2", "#occDistLabel2");
		checkOccupantImageSize(case3Data, "#occupantImage3", "#occupantDist3", "#occDistLabel3");*/


	}



	function checkOccupantImageSize(caseName, imageID, sliderID, labelID) {



		var imageHeight = $("#occupantImage").height();
		var imageWidth = $("#occupantImage").width();

		// original image dimensions
		var originalHeight = 500;
		var originalWidth = 360;

		//assume 4.25ft sitting height
		var resizeHeight;

		if (caseName == case1Data) {
			resizeHeight = Math.round(facadeScaleHeightCase1(4.25));
		} else if (caseName == case2Data) {
			resizeHeight = Math.round(facadeScaleHeightCase2(4.25));
		} else if (caseName == case3Data) {
			resizeHeight = Math.round(facadeScaleHeightCase3(4.25));
		}


		var resizeWidth = Math.round((resizeHeight/originalHeight)*originalWidth);

		var diffBtwSVGandFacade = facWidth - facadeScaleWidth(caseName.wallLen);


		var newLeft = margin.left - resizeWidth/2 + facadeScaleWidth(caseName.wallLen/2);
		var newBottom = Math.round(resizeHeight + facMargin.bottom*2);

		var newbackgroundsize = resizeWidth.toString() + "px " + resizeHeight.toString() + "px";

		$(imageID).css({
			width: resizeWidth,
			height: resizeHeight,
			left: newLeft,
			bottom: newBottom,
			backgroundSize: newbackgroundsize,
		})

		$(sliderID).css({
			width: facadeScaleWidth(caseName.wallLen)/2,
			right: diffBtwSVGandFacade + facMargin.right,
		})

		$(labelID).css({
			right: diffBtwSVGandFacade + facMargin.right,
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

		var newLeft = margin.left - imageWidth/2 + facadeScaleWidth(caseName.wallLen/2) + newPosition;

	   	// Move occupant image
	   	$(imageID).css({
	       left: newLeft,
		})
	}


	/* ------ FUNCTIONS FOR GENERAL REFERENCE VISUALS ------ */

	function determineInputProportion() {


		// find the max ceiling height and wall length out of the 3 cases
		var ceilingHeightArray = [case1Data.ceilingHeightValue, case2Data.ceilingHeightValue, case3Data.ceilingHeightValue];
		var maxCeilingHeight = d3.max(ceilingHeightArray);

		var wallLengthArray = [case1Data.wallLen, case2Data.wallLen, case3Data.wallLen];
		var maxWallLength = d3.max(wallLengthArray);

		var thisProportion = maxWallLength/maxCeilingHeight;

		return thisProportion;
	}


	function occupantPositionText(occdata, className, caseName) {

		var downdraftSolution = "To reduce discomfort, try decreasing the window height or U-value.";
		var mrtSolution = "To reduce discomfort, try adjusting the window geometry or decreasing the U-value.";

		var text = "";
		var reason = "";
		var solution = "";

		if (occdata.govfact == "dwn") {
			reason = "downdraft";
			solution = downdraftSolution;
		} else {
			reason = "a low mean radiant temperature";
			solution = mrtSolution;
		}


		if (occdata.ppd <= ppdValue) {
			text = "<h1 class=" + className + "><span id='icon' class='check'></span>" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD</h1><p><b>Tolerable discomfort</b> is due to " + reason + ".</p>";
		} else {
			text = "<h1 class=" + className + "><span id='icon' class='cross'></span>" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD</h1><p><b>Intolerable discomfort</b> is due to " + reason + ". " + solution + "</p>";
		}

		return text;
	}



	function facadeCaseHeadings(occdata, className, caseName) {

		var text = "";

		if (occdata.ppd <= ppdValue) {
			text = "<h1 class=" + className + "><span id='iconLarge' class='check'></span><b>" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD</b> Occupant experiences tolerable discomfort</h1>";
		} else {
			text = "<h1 class=" + className + "><span id='iconLarge' class='cross'></span>" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD. Occupant experiences intolerable discomfort</h1>";
		}

		return text;

	}

	function updateFacadeHeadings() {

		$("#case1FacadeHeading").empty();
		$("#case2FacadeHeading").empty();
		$("#case3FacadeHeading").empty();

		var case1Heading = facadeCaseHeadings(occPointData, "case1Text", "Case 1");
		var case2Heading = facadeCaseHeadings(occPointData2, "case2Text", "Case 2");
		var case3Heading = facadeCaseHeadings(occPointData3, "case3Text", "Case 3");

		$("#case1FacadeHeading").append(case1Heading);
		$("#case2FacadeHeading").append(case2Heading);
		$("#case3FacadeHeading").append(case3Heading);
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

			var case1YPosition = parseFloat(d3.select("circle.occdot1").attr("cy"));
			compareOccupantArray.push(case1YPosition);
		}

		if ($("#caseSelection #case2Label").hasClass("unselected") == false ) {
			totalText = totalText + case2Text;

			var case2YPosition = parseFloat(d3.select("circle.occdot2").attr("cy"));
			compareOccupantArray.push(case2YPosition);
		}

		if ($("#caseSelection #case3Label").hasClass("unselected") == false ) {
			totalText = totalText + case3Text;

			var case3YPosition = parseFloat(d3.select("circle.occdot3").attr("cy"));
			compareOccupantArray.push(case3YPosition);
		}


		$("#thresholdTooltip").append(totalText);

		var divHeight = $("div#thresholdTooltip").height() - 20; //20 = padding

		var xPosition = parseFloat(d3.select("circle.occdot1").attr("cx")) + margin.left; // same for all cases
		var yPosition = d3.min(compareOccupantArray) - divHeight;

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
			.attr("y", function() { return y(data)})
			.attr("height", function() { return height - y(data)});
	}


	function occupantDistanceRefLine() {

		//find max cy of visible occ points
		var compareOccupantArray = [];

		if ($("#caseSelection #case1Label").hasClass("unselected") == false ) {
			var case1YPosition = parseFloat(d3.select("circle.occdot1").attr("cy"));
			compareOccupantArray.push(case1YPosition);
		}

		if ($("#caseSelection #case2Label").hasClass("unselected") == false ) {
			var case2YPosition = parseFloat(d3.select("circle.occdot2").attr("cy"));
			compareOccupantArray.push(case2YPosition);
		}

		if ($("#caseSelection #case3Label").hasClass("unselected") == false ) {
			var case3YPosition = parseFloat(d3.select("circle.occdot3").attr("cy"));
			compareOccupantArray.push(case3YPosition);
		}



		var xPosition = parseFloat(d3.select("circle.occdot1").attr("cx"));
		var yPosition = d3.max(compareOccupantArray);
		var padding = (d3.select("circle.occdot1").attr("r"))*1.8;

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
			.attr("id", "windowHeightDimLabel")
			.attr("transform", "translate(" + (middleWidth + facMargin.left + 3) + "," + (verticalWindowMidpoint + facMargin.top) + ")")
			.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Window Height");

		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowHeightDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var windowHeightDimensions = facadeSvgCase1.selectAll("#windowHeightDim");

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
		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowWidthDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var windowWidthDimensions = facadeSvgCase1.selectAll("#windowWidthDim");

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
		facadeSvgCase1.append("g")
			.attr("id", "sillHeightDimLabelTop")
			.attr("transform", "translate(" + (middleWidth + facMargin.left - 4) + "," + (bottomOfWindow + sillHeightPixels/2 + facMargin.top) + ")")
			.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Sill");

		facadeSvgCase1.append("g")
			.attr("id", "sillHeightDimLabelBottom")
			.attr("transform", "translate(" + (middleWidth + facMargin.left + 12) + "," + (bottomOfWindow + sillHeightPixels/2 + facMargin.top) + ")")
			.append("text")
		    .attr("class", "facadelabel")
		    .attr("text-anchor", "middle")
		    .attr("transform", "rotate(-90)")
		    .text("Height");

		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "sillHeightDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var sillHeightDimensions = facadeSvgCase1.selectAll("#sillHeightDim");

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
		facadeSvgCase1.append("g")
			.attr("class", "dimensions")
			.attr("id", "windowSepDim")
			.attr("transform", "translate(" + facMargin.left + "," + ( facMargin.top) + ")");

		var windowSepDimensions = facadeSvgCase1.selectAll("#windowSepDim");


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
