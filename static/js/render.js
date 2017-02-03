var render = render || {}

//function to make graph
render.makeGraph = function () {

  var maxContainerWidth = 550; // based on Payette website layout
  var color1 = "rgb(0,160,221)";
  var color2 = "rgb(248,151,29)";
  var color3 = "rgb(108,28,131)";
  var grey = "rgb(190,190,190)";
  var lightblue = "rgb(194,224,255)";


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
  var margin = {top: 20, right: 45, bottom: 40, left: 55},
      width = maxContainerWidth - margin.left - margin.right,
      height = 275 - margin.top - margin.bottom;

  // Set up scale functions
  // x-axis: distance from facade
  var x;
  if (unitSys == "IP") {
    x = d3.scale.linear()
      .range([0, width]) // value -> display
      .domain([0, 13]);
  } else if (unitSys == "SI") {
    x = d3.scale.linear()
      .range([0, width]) // value -> display
      .domain([0, 4.5]);
  }

  // y-axis: PPD
  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, 30]);

  // y-axes combined
  var y3 = d3.scale.linear()
      .range([height, 0])
      .domain([parseFloat(ppdValue)-10, parseFloat(ppdValue)+10]);
  var y4 = d3.scale.linear()
      .range([height, 0])
      .domain([parseFloat(ppdValue2)-10, parseFloat(ppdValue2)+10]);
  var y5 = d3.scale.linear()
      .range([height, 0])
      .domain([-10, 10]);

  // Define axes
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis1 = d3.svg.axis().scale(y).orient("left");
  var yAxis2 = d3.svg.axis().scale(y).orient("left");
  var yAxis3 = d3.svg.axis().scale(y3).orient("left");
  var yAxis4 = d3.svg.axis().scale(y4).orient("right");
  var yAxis5 = d3.svg.axis().scale(y3).orient("left");

  /* ------------------ MAKE THE GRAPHS ------------------ */
  // Add SVG
  var graphSvg = d3.select("#graphWrapper")
        .append("svg")
        .attr("id", "graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

  var graphSvg2 = d3.select("#graphWrapper2")
        .append("svg")
        .attr("id", "graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

  var graphSvg3 = d3.select("#graphWrapper3")
        .append("svg")
        .attr("id", "graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

  // Draw PPD threshold so that it's behind the data and axes
  var ppdLine = drawPPDThreshold(graphSvg, ppdValue, "dwn");
  var ppdLine2 = drawPPDThreshold(graphSvg2, ppdValue2, "mrt");
  var ppdLine3 = drawPPDThreshold(graphSvg3, ppdValue, "comb");
  drawGraph(graphSvg, "Downdraft Discomfort (PPD) - ", "dwn");
  drawGraph(graphSvg2, "Radiant Discomfort (PPD) - ", "mrt");
  drawGraph(graphSvg3, "Downdraft Discomfort (PPD) - ", "comb");

  /* ------ PLOT THE DATA ------ */
  //draw occupant position line so that it's behind the points
  occupantDistanceRefLine();
  defDrawData(graphSvg, "dwn")
  defDrawData(graphSvg2, "mrt")
  defDrawData(graphSvg3, "comb")

  // call function to initialize all data points
  updateGraphPoints(graphSvg, dataset, "dotCase1", color1, "dwn");
  updateGraphPoints(graphSvg, dataset2, "dotCase2", color2, "dwn");
  updateGraphPoints(graphSvg, dataset3, "dotCase3", color3, "dwn");
  updateGraphPoints(graphSvg2, dataset, "dotCase1", color1, "mrt");
  updateGraphPoints(graphSvg2, dataset2, "dotCase2", color2, "mrt");
  updateGraphPoints(graphSvg2, dataset3, "dotCase3", color3, "mrt");
  updateGraphPoints(graphSvg3, dataset, "dotCase1", color1, "comb");
  updateGraphPoints(graphSvg3, dataset2, "dotCase2", color2, "comb");
  updateGraphPoints(graphSvg3, dataset3, "dotCase3", color3, "comb");

  // call function to initialize point at occupant location
  updateOccupantPoint(graphSvg, [occPointData], "occdot1", color1, "dwn");
  updateOccupantPoint(graphSvg, [occPointData2], "occdot2", color2, "dwn");
  updateOccupantPoint(graphSvg, [occPointData3], "occdot3", color3, "dwn");
  updateOccupantPoint(graphSvg2, [occPointData], "occdot1", color1, "mrt");
  updateOccupantPoint(graphSvg2, [occPointData2], "occdot2", color2, "mrt");
  updateOccupantPoint(graphSvg2, [occPointData3], "occdot3", color3, "mrt");
  updateOccupantPoint(graphSvg3, [occPointData], "occdot1", color1, "comb");
  updateOccupantPoint(graphSvg3, [occPointData2], "occdot2", color2, "comb");
  updateOccupantPoint(graphSvg3, [occPointData3], "occdot3", color3, "comb");

  // add text at occupanct location
  thresholdDataText("dwn");
  thresholdDataText("mrt");
  thresholdDataText("comb");
  setHover(graphSvg, "dwn");
  setHover(graphSvg2, "mrt");
  setHover(graphSvg3, "comb");

  function setHover (mySVG, param) {
    // Show text on hover over dot
    var points = mySVG.selectAll(".dotCase1, .dotCase2, .dotCase3");
    points.on("mouseover", function(d) {

      var hoverText = "";
      var thisIcon = "";

      if (param == "dwn") {
        $("#tooltip").empty();
      } else if (param == "mrt") {
        $("#tooltip2").empty();
      } else {
        $("#tooltip3").empty();
      }

      // ppd icon
      if (d.comf == "True") {
        thisIcon = "<img src='static/images/check.png' class='icon'>";
      } else {
        thisIcon = "<img src='static/images/x.png' class='icon'>";
      }

      if (param == "dwn") {
        if (d3.select(this).attr("class") == "dotCase1") {
          hoverText = thisIcon + "<h1 class='case1Text'>Case 1: " + Math.round(d.ppd*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        } else if (d3.select(this).attr("class") == "dotCase2") {
          hoverText = thisIcon + "<h1 class='case2Text'>Case 2: " + Math.round(d.ppd*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        } else if (d3.select(this).attr("class") == "dotCase3") {
          hoverText = thisIcon + "<h1 class='case3Text'>Case 3: " + Math.round(d.ppd*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        }
      } else if (param == "mrt") {
        if (d3.select(this).attr("class") == "dotCase1") {
          hoverText = thisIcon + "<h1 class='case1Text'>Case 1: " + Math.round(d.mrtppd*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        } else if (d3.select(this).attr("class") == "dotCase2") {
          hoverText = thisIcon + "<h1 class='case2Text'>Case 2: " + Math.round(d.mrtppd*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        } else if (d3.select(this).attr("class") == "dotCase3") {
          hoverText = thisIcon + "<h1 class='case3Text'>Case 3: " + Math.round(d.mrtppd*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        }
      } else {
        if (d3.select(this).attr("class") == "dotCase1") {
          hoverText = thisIcon + "<h1 class='case1Text'>Case 1: " + Math.round(d.govPPD*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        } else if (d3.select(this).attr("class") == "dotCase2") {
          hoverText = thisIcon + "<h1 class='case2Text'>Case 2: " + Math.round(d.govPPD*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        } else if (d3.select(this).attr("class") == "dotCase3") {
          hoverText = thisIcon + "<h1 class='case3Text'>Case 3: " + Math.round(d.govPPD*10)/10 + "% PPD." + "</h1><div style='clear:both;'></div>";
        }
      }

      if (param == "dwn") {
        $("#tooltip").append(hoverText);
      } else if (param == "mrt") {
        $("#tooltip2").append(hoverText);
      } else {
        $("#tooltip3").append(hoverText);
      }

      //Get this dots x/y values, then augment for the tooltip
      var thisHeight = $("#tooltip").height();
      var xPosition;
      var yPosition;

      // set XPosition for tooltip
      // change width of tooltip so it doesn't stretch outside wrapper
      if (param == "dwn") {
        $("div#tooltip").css("width","150px");
        $("div#tooltip h1").css("width","135px");
      } else if (param == "mrt") {
        $("div#tooltip2").css("width","150px");
        $("div#tooltip2 h1").css("width","135px");
      } else {
        $("div#tooltip3").css("width","150px");
        $("div#tooltip3 h1").css("width","135px");
      }
      if (param == "dwn") {
        yPosition = y(d.ppd) - thisHeight + margin.top - 5;
      } else if (param == "mrt") {
        yPosition = y(d.mrtppd) - thisHeight + margin.top -5;
      } else {
        yPosition = y5(d.tarDist) - thisHeight + margin.top -20;
      }

      // prevent the tooltip from going outside the graph wrapper
      if (x(d.dist) > 300) {
        // keep fixed at right edge
        xPosition = maxContainerWidth - margin.right - $("div#tooltip").width();
      } else {
        // position relative to data point
        xPosition = x(d.dist) + margin.left + 8;
      }

      if (param == "dwn") {
        d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      } else if (param == "mrt"){
        d3.select("#tooltip2")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      } else {
        d3.select("#tooltip3")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      }

      if (param == "dwn") {
        //Show the tooltip
        $("#tooltip").fadeIn(100);
        //Hide default text
        $("#thresholdTooltip").fadeOut(100);
      } else if (param == "mrt") {
        $("#tooltip2").fadeIn(100);
        $("#thresholdTooltip2").fadeOut(100);
      } else{
        $("#tooltip3").fadeIn(100);
        $("#thresholdTooltip3").fadeOut(100);
      }

      })
       .on("mouseout", function() {
         //Hide the tooltip
         if (param == "dwn") {
           $("#tooltip").fadeOut(0);
           setTimeout(checkTooltip, 150);
         } else if (param == "mrt") {
           $("#tooltip2").fadeOut(0);
           setTimeout(checkTooltip2, 150);
         } else {
           $("#tooltip3").fadeOut(0);
           setTimeout(checkTooltip3, 150);
         }

       })
  }

  function checkTooltip() {
    // if hover tooltip is no longer visible
    if ($("#tooltip").css("display") == "none") {
      //Show default text
      $("#thresholdTooltip").fadeIn(100);
    }
  }

  function checkTooltip2() {
    if ($("#tooltip2").css("display") == "none") {
      $("#thresholdTooltip2").fadeIn(100);
    }
  }

  function checkTooltip3() {
    // if hover tooltip is no longer visible
    if ($("#tooltip3").css("display") == "none") {
      //Show default text
      $("#thresholdTooltip3").fadeIn(100);
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

  var facMargin = {top: 1, right: 1, bottom: 2, left: 1};

  var maxAllowableSVGWidth = (maxContainerWidth - 14*2 - 6)/3;
  var maxAllowableSVGHeight = 128;

  //overall SVG width is fixed
  var facSpacing = 14;
  var facWidth = maxAllowableSVGWidth + facSpacing;
  var facWidthNoSpacing = maxAllowableSVGWidth;
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

    var maxCeilingHeight = d3.max([Math.ceil(case1Data.ceilingHeightValue), Math.ceil(case2Data.ceilingHeightValue), Math.ceil(case3Data.ceilingHeightValue)]);
    var ceilingPixelMultipler = maxAllowableSVGHeight/maxCeilingHeight; // pixel per ft or m

    var maxWallLength = d3.max([Math.ceil(case1Data.wallLen), Math.ceil(case2Data.wallLen), Math.ceil(case3Data.wallLen)]);
    var lengthPixelMultipler = maxAllowableSVGWidth/maxWallLength; // pixels per ft or m

    if (ceilingPixelMultipler < lengthPixelMultipler) {
      // use ceiling height as the constraining dimension

      // # of feet along width based on height factor
      var proportionateWidth = maxAllowableSVGWidth/(maxAllowableSVGHeight/maxCeilingHeight);

      if (proportionateWidth < maxWallLength) {
        alert("uh oh! width is bigger than container");
      } else {

        facadeScaleWidth = d3.scale.linear()
          .domain([0, proportionateWidth]) //input domain
          .range([0, maxAllowableSVGWidth]); //output range

        facadeScaleHeight = d3.scale.linear()
          .domain([0, maxCeilingHeight]) //input domain
          .range([0, maxAllowableSVGHeight]); //output range

        //overall SVG height can vary - determined by whether ceiling height or wall length governs
        facHeight = maxAllowableSVGHeight;

      }
    } else if (ceilingPixelMultipler > lengthPixelMultipler) {
      // use wall length as the constraining dimension

      // # of feet along height based on width factor
      var proportionateHeight = maxAllowableSVGHeight/(maxAllowableSVGWidth/maxWallLength);

      if (proportionateHeight < maxCeilingHeight) {
        alert("uh oh! height is bigger than container");
      } else {

        var PixelsMaxCeilingHeight = maxCeilingHeight*(maxAllowableSVGWidth/maxWallLength);

        facadeScaleWidth = d3.scale.linear()
          .domain([0, maxWallLength]) //input domain
          .range([0, maxAllowableSVGWidth]); //output range

        facadeScaleHeight = d3.scale.linear()
          .domain([0, maxCeilingHeight]) //input domain
          .range([0, PixelsMaxCeilingHeight]); //output range

        //overall SVG height can vary - determined by whether ceiling height or wall length governs
        facHeight = PixelsMaxCeilingHeight;
      }
    }

    // set height difference between cases
    case1CeilingDiff =  maxCeilingHeight-case1Data.ceilingHeightValue;
    case2CeilingDiff =  maxCeilingHeight-case2Data.ceilingHeightValue;
    case3CeilingDiff =  maxCeilingHeight-case3Data.ceilingHeightValue;

  }









/* ------ MAKE THE FACADE ------ */

// Case 1 Facade
  var facadeSvgCase1 = d3.select("#case1Chart")
        .append("svg")
        .attr("id", "facadeCase1")
        .attr("width", facWidth + facMargin.left + facMargin.right)
        .attr("height", facHeight + facMargin.top + facMargin.bottom);

  var wallCase1 = facadeSvgCase1.append("rect")
    .attr("class", "wall1 filled")
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
    .attr("class", "wall2")
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
    .attr("class", "window2")
    .attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case2Data.wallLen)/2)})
    .attr("y", function(d) {return (facadeScaleHeight(case2Data.ceilingHeightValue - d[3][2]))})
    .attr("width", facadeScaleWidth(glzWidthCase2))
    .attr("height", facadeScaleHeight(glzHeightCase2))
    .attr("transform", function() {
      return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case2CeilingDiff)) + ")";
    });

  if ($("#caseSelection #case2Label").hasClass("unselected") == true) {
    d3.selectAll("rect.wall2").classed("outlined", true);
    d3.selectAll("rect.wall2").classed("filled", false);
    d3.selectAll("rect.window2").classed("white", true);
    d3.selectAll("rect.window2").classed("blue", false);
  }
  else {
    d3.selectAll("rect.wall2").classed("outlined", false);
    d3.selectAll("rect.wall2").classed("filled", true);
    d3.selectAll("rect.window2").classed("white", false);
    d3.selectAll("rect.window2").classed("blue", true);
  }


// Case 3 Facade
  var facadeSvgCase3 = d3.select("#case3Chart")
        .append("svg")
        .attr("id", "facadeCase3")
        .attr("width", facWidthNoSpacing + facMargin.left + facMargin.right)
        .attr("height", facHeight + facMargin.top + facMargin.bottom);

  var wallCase3 = facadeSvgCase3.append("rect")
    .attr("class","wall3")
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
    .attr("class", "window3")
    .attr("x", function(d) {return (facadeScaleWidth(d[3][0])+facadeScaleWidth(case3Data.wallLen)/2)})
    .attr("y", function(d) {return (facadeScaleHeight(case3Data.ceilingHeightValue - d[3][2]))})
    .attr("width", facadeScaleWidth(glzWidthCase3))
    .attr("height", facadeScaleHeight(glzHeightCase3))
    .attr("transform", function() {
      return "translate(" + facMargin.left + "," + (facMargin.top + facadeScaleHeight(case3CeilingDiff)) + ")";
    });

  if ($("#caseSelection #case3Label").hasClass("unselected") == true) {
    d3.selectAll("rect.wall3").classed("outlined", true);
    d3.selectAll("rect.wall3").classed("filled", false);
    d3.selectAll("rect.window3").classed("white", true);
    d3.selectAll("rect.window3").classed("blue", false);
  }
  else {
    d3.selectAll("rect.wall3").classed("outlined", false);
    d3.selectAll("rect.wall3").classed("filled", true);
    d3.selectAll("rect.window3").classed("white", false);
    d3.selectAll("rect.window3").classed("blue", true);
  }




  //Ensure size of occupant image is correct
  checkOccupantImageSize(case1Data, "#occupantImage", "#sliderWrapper", "#case1Heading");
  checkOccupantImageSize(case2Data, "#occupantImage2", "#sliderWrapper2", "#case2Heading");
  checkOccupantImageSize(case3Data, "#occupantImage3", "#sliderWrapper3", "#case3Heading");

  // Make sure that the unexpanded classes have a label.
  $(".expandExplanation").addClass("unexpanded");
  $(".expandRef").addClass("unexpanded");


    /* ------ HIDE/SHOW CASES / ALERTS ------ */

    $("#caseSelection #case2Label").on("click", function() {

      $("#case2Heading").toggleClass("greyText").toggleClass("case2Text");
      $("#case2Button").toggleClass("unselected");

      if ($(this).hasClass("unselected") == true) {
        //becomes selected
      $(this).removeClass("unselected");
      $("#inputs input.case2").removeClass("unselected");

      $("#inputs input.case2, div.case2, #sliderWrapper2, .connectLine2, .dotCase2, .occdot2").css("display","inline-block");
      $("hr.case2, #occupantImage2, div.customCheckStyleCentered.case2").css("display","block");

      d3.selectAll("rect.wall2").classed("outlined", false);
      d3.selectAll("rect.wall2").classed("filled", true);
      d3.selectAll("rect.window2").classed("white", false);
      d3.selectAll("rect.window2").classed("blue", true);
    }

    else if ($(this).hasClass("unselected") == false) {
      // becomes unselected
      $(this).addClass("unselected");

      $("#inputs input.case2, div.case2, #sliderWrapper2, .connectLine2, .dotCase2, .occdot2, hr.case2, #occupantImage2").css("display","none");
      $("#inputs input.case2").addClass("unselected");

      d3.selectAll("rect.wall2").classed("outlined", true);
      d3.selectAll("rect.wall2").classed("filled", false);
      d3.selectAll("rect.window2").classed("white", true);
      d3.selectAll("rect.window2").classed("blue", false);
    }

    // Update static tooltip text
    thresholdDataText("dwn");
    thresholdDataText("mrt");
    thresholdDataText("comb");
    updateOccupantDistanceRefLine();

    });

    $("#caseSelection #case3Label").on("click", function() {

      $("#case3Heading").toggleClass("greyText").toggleClass("case3Text");
      $("#case3Button").toggleClass("unselected");


      if ($(this).hasClass("unselected") == true) {
        //becomes selected
      $(this).removeClass("unselected");
      $("#inputs input.case3").removeClass("unselected");

      $("#inputs input.case3, div.case3, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3").css("display","inline-block");
      $("hr.case3, #occupantImage3, div.customCheckStyleCentered.case3").css("display","block");


      d3.selectAll("rect.wall3").classed("outlined", false);
      d3.selectAll("rect.wall3").classed("filled", true);
      d3.selectAll("rect.window3").classed("white", false);
      d3.selectAll("rect.window3").classed("blue", true);
    }

    else if ($(this).hasClass("unselected") == false) {
      // becomes unselected
      $(this).addClass("unselected");

      $("#inputs input.case3, div.case3, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3, hr.case3, #occupantImage3").css("display","none");

      $("#inputs input.case2").addClass("unselected");

      d3.selectAll("rect.wall3").classed("outlined", true);
      d3.selectAll("rect.wall3").classed("filled", false);
      d3.selectAll("rect.window3").classed("white", true);
      d3.selectAll("rect.window3").classed("blue", false);
    }


    // Update static tooltip text
    thresholdDataText("dwn");
    thresholdDataText("mrt");
    thresholdDataText("comb");
    updateOccupantDistanceRefLine();
    });



    $("#uvaluePop img.close").on("click", function() {
       $("#uvaluePop").css("display","none");
    })


  // expand options
    $(".expandOptions").on("click", function(){

      if ($(".expandOptions").hasClass("expanded")) {
        $(".expandOptions").removeClass("expanded")
        $(".expandOptions span.expand").css("backgroundPosition", "0 0");
      $(".hideContent").slideUp(400, "swing");
      } else {
        $(".expandOptions").addClass("expanded");
        $(".expandOptions span.expand").css("backgroundPosition", "0 -12px");
      $(".hideContent").slideDown(400, "swing");
      }
  })

  // expand explanation
    $(".expandExplanation").on("click", function(){

      if ($(".expandExplanation").hasClass("expanded")) {
        $(".expandExplanation").removeClass("expanded")
        $(".expandExplanation span.expand").css("backgroundPosition", "0 0");
        $(".expandExplanation").addClass("unexpanded");
      $(".explanContent").slideUp(400, "swing");
      } else {
        $(".expandExplanation").addClass("expanded");
        $(".expandExplanation span.expand").css("backgroundPosition", "0 -12px");
        $(".expandExplanation").removeClass("unexpanded")
      $(".explanContent").slideDown(400, "swing");
      }
  })

  // expand references
    $(".expandRef").on("click", function(){

      if ($(".expandRef").hasClass("expanded")) {
        $(".expandRef").removeClass("expanded")
        $(".expandRef span.expand").css("backgroundPosition", "0 0");
        $(".expandRef").addClass("unexpanded");
      $(".refcontent").slideUp(400, "swing");
      } else {
        $(".expandRef").addClass("expanded");
        $(".expandRef span.expand").css("backgroundPosition", "0 -12px");
        $(".expandRef").removeClass("unexpanded")
      $(".refcontent").slideDown(400, "swing");
      }
  })

  /* ------ SWITCH BETWEEN SPLIT AND COMBINED VIEW ------ */


  function checkSplitGraph() {
  // if hover tooltip is no longer visible
  if ($("#graphWrapper").css("display") == "none") {
  //Show default text
  $("#graphWrapper3").slideDown(500);
  }
  }

  function checkCombinedGraph() {
  // if hover tooltip is no longer visible
  if ($("#graphWrapper3").css("display") == "none") {
  //Show default text
  $("#graphWrapper").slideDown(500);
  $("#graphWrapper2").slideDown(500);
  }
  }

  $(".viewTypeToggle").click(function(event) {
    if ($("#splitToggle").hasClass("marked") == true) {
      //change to Combined view.
      $("#graphWrapper").slideUp(500);
      $("#graphWrapper2").slideUp(500);
      setTimeout(checkSplitGraph, 520);
      $("#splitToggle").removeClass("marked");
      $("#splitToggle").addClass("unmarked");
      $("#combinedToggle").removeClass("unmarked");
      $("#combinedToggle").addClass("marked");
    } else {
      //change to split view.
      $("#graphWrapper3").slideUp(500);
      setTimeout(checkCombinedGraph, 520);
      $("#splitToggle").removeClass("unmarked");
      $("#splitToggle").addClass("marked");
      $("#combinedToggle").removeClass("marked");
      $("#combinedToggle").addClass("unmarked");
    }
  })

  /* ----- DETECT CHANGE BETWEEN SI AND IP ----- */
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
      $("#ceiling").val(round(case1Data.ceilingHeightValue*10)/10);
      case2Data.ceilingHeightValue = units.M2Ft(case2Data.ceilingHeightValue);
      $("#ceiling2").val(round(case2Data.ceilingHeightValue*10)/10);
      case3Data.ceilingHeightValue = units.M2Ft(case3Data.ceilingHeightValue);
      $("#ceiling3").val(round(case3Data.ceilingHeightValue*10)/10);

      case1Data.wallLen = units.M2Ft(case1Data.wallLen);
      $("#wallWidth").val(round(case1Data.wallLen*10)/10);
      case2Data.wallLen = units.M2Ft(case2Data.wallLen);
      $("#wallWidth2").val(round(case2Data.wallLen*10)/10);
      case3Data.wallLen = units.M2Ft(case3Data.wallLen);
      $("#wallWidth3").val(round(case3Data.wallLen*10)/10);

      case1Data.windowHeightValue = units.M2Ft(case1Data.windowHeightValue);
      $("#windowHeight").val(round(case1Data.windowHeightValue*10)/10);
      case2Data.windowHeightValue = units.M2Ft(case2Data.windowHeightValue);
      $("#windowHeight2").val(round(case2Data.windowHeightValue*10)/10);
      case3Data.windowHeightValue = units.M2Ft(case3Data.windowHeightValue);
      $("#windowHeight3").val(round(case3Data.windowHeightValue*10)/10);

      case1Data.windowWidthValue = units.M2Ft(case1Data.windowWidthValue);
      $("#windowWidth").val(round(case1Data.windowWidthValue*10)/10);
      case2Data.windowWidthValue = units.M2Ft(case2Data.windowWidthValue);
      $("#windowWidth2").val(round(case2Data.windowWidthValue*10)/10);
      case3Data.windowWidthValue = units.M2Ft(case3Data.windowWidthValue);
      $("#windowWidth3").val(round(case3Data.windowWidthValue*10)/10);

      case1Data.sillHeightValue = units.M2Ft(case1Data.sillHeightValue);
      $("#sill").val(round(case1Data.sillHeightValue*10)/10);
      case2Data.sillHeightValue = units.M2Ft(case2Data.sillHeightValue);
      $("#sill2").val(round(case2Data.sillHeightValue*10)/10);
      case3Data.sillHeightValue = units.M2Ft(case3Data.sillHeightValue);
      $("#sill3").val(round(case3Data.sillHeightValue*10)/10);

      case1Data.distanceWindows = units.M2Ft(case1Data.distanceWindows);
      $("#distWindow").val(round(case1Data.distanceWindows*10)/10);
      case2Data.distanceWindows = units.M2Ft(case2Data.distanceWindows);
      $("#distWindow2").val(round(case2Data.distanceWindows*10)/10);
      case3Data.distanceWindows = units.M2Ft(case3Data.distanceWindows);
      $("#distWindow3").val(round(case3Data.distanceWindows*10)/10);

      case1Data.uvalueValue = units.uSI2uIP(case1Data.uvalueValue);
      $("#uvalue").val(round(case1Data.uvalueValue*100)/100);
      case2Data.uvalueValue = units.uSI2uIP(case2Data.uvalueValue);
      $("#uvalue2").val(round(case2Data.uvalueValue*100)/100);
      case3Data.uvalueValue = units.uSI2uIP(case3Data.uvalueValue);
      $("#uvalue3").val(round(case3Data.uvalueValue*100)/100);

      case1Data.outdoorTempValue = units.C2F(case1Data.outdoorTempValue);
      $("#outdoortemp").val(round(case1Data.outdoorTempValue));
      case2Data.outdoorTempValue = units.C2F(case2Data.outdoorTempValue);
      $("#outdoortemp2").val(round(case2Data.outdoorTempValue));
      case3Data.outdoorTempValue = units.C2F(case3Data.outdoorTempValue);
      $("#outdoortemp3").val(round(case3Data.outdoorTempValue));

      case1Data.airtempValue = units.C2F(case1Data.airtempValue);
      $("#airtemp").val(round(case1Data.airtempValue));
      case2Data.airtempValue = units.C2F(case2Data.airtempValue);
      $("#airtemp2").val(round(case2Data.airtempValue));
      case3Data.airtempValue = units.C2F(case3Data.airtempValue);
      $("#airtemp3").val(round(case3Data.airtempValue));

      case1Data.rvalueValue = units.rSI2rIP(case1Data.rvalueValue);
      $("#rvalue").val(round(case1Data.rvalueValue*100)/100);
      case2Data.rvalueValue = units.rSI2rIP(case2Data.rvalueValue);
      $("#rvalue2").val(round(case2Data.rvalueValue*100)/100);
      case3Data.rvalueValue = units.rSI2rIP(case3Data.rvalueValue);
      $("#rvalue3").val(round(case3Data.rvalueValue*100)/100);

      case1Data.airspeedValue = units.mps2fpm(case1Data.airspeedValue);
      $("#airspeed").val(round(case1Data.airspeedValue*10)/10);
      case2Data.airspeedValue = units.mps2fpm(case2Data.airspeedValue);
      $("#airspeed2").val(round(case2Data.airspeedValue*10)/10);
      case3Data.airspeedValue = units.mps2fpm(case3Data.airspeedValue);
      $("#airspeed3").val(round(case3Data.airspeedValue*10)/10);

      occDistFromFacade = units.M2Ft(occDistFromFacade);
      // update occupant dist from facade slider
      $("#distFromFacade").attr("max", 12).attr("min", 1);
      $("#distFromFacade").val(occDistFromFacade);
      $("#distFromFacade").attr("value", occDistFromFacade);
      $("#distOutput").empty;
      $("#distOutput").text(round(occDistFromFacade * 10)/10 + " ft");

      // update graph axis / scales
      x = d3.scale.linear()
      .range([0, width]) // value -> display
      .domain([0, 13]);


      xAxis = d3.svg.axis().scale(x).orient("bottom");

      graphSvg.select("#graphXAxis")
        .call(xAxis.ticks(6).tickValues([2, 4, 6, 8, 10, 12]));
      graphSvg.select("#XAxisLabel")
      .text("Occupant Distance from Façade (ft)");
      graphSvg2.select("#graphXAxis")
        .call(xAxis.ticks(6).tickValues([2, 4, 6, 8, 10, 12]));
      graphSvg2.select("#XAxisLabel")
      .text("Occupant Distance from Façade ft");

      updateData(case1Data);
      updateData(case2Data);
      updateData(case3Data);

      updateOccupantDistanceRefLine();
    }
  })

  $(".optionButton#SI").click(function(event) {

    if ($(".optionButton#SI").hasClass("selected") == false) {
      //change to SI;
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
      $("#ceiling").val(round(case1Data.ceilingHeightValue*100)/100);
      case2Data.ceilingHeightValue = units.Ft2M(case2Data.ceilingHeightValue);
      $("#ceiling2").val(round(case2Data.ceilingHeightValue*100)/100);
      case3Data.ceilingHeightValue = units.Ft2M(case3Data.ceilingHeightValue);
      $("#ceiling3").val(round(case3Data.ceilingHeightValue*100)/100);

      case1Data.wallLen = units.Ft2M(case1Data.wallLen);
      $("#wallWidth").val(round(case1Data.wallLen*100)/100);
      case2Data.wallLen = units.Ft2M(case2Data.wallLen);
      $("#wallWidth2").val(round(case2Data.wallLen*100)/100);
      case3Data.wallLen = units.Ft2M(case3Data.wallLen);
      $("#wallWidth3").val(round(case3Data.wallLen*100)/100);

      case1Data.windowHeightValue = units.Ft2M(case1Data.windowHeightValue);
      $("#windowHeight").val(round(case1Data.windowHeightValue*100)/100);
      case2Data.windowHeightValue = units.Ft2M(case2Data.windowHeightValue);
      $("#windowHeight2").val(round(case2Data.windowHeightValue*100)/100);
      case3Data.windowHeightValue = units.Ft2M(case3Data.windowHeightValue);
      $("#windowHeight3").val(round(case3Data.windowHeightValue*100)/100);

      case1Data.windowWidthValue = units.Ft2M(case1Data.windowWidthValue);
      $("#windowWidth").val(round(case1Data.windowWidthValue*100)/100);
      case2Data.windowWidthValue = units.Ft2M(case2Data.windowWidthValue);
      $("#windowWidth2").val(round(case2Data.windowWidthValue*100)/100);
      case3Data.windowWidthValue = units.Ft2M(case3Data.windowWidthValue);
      $("#windowWidth3").val(round(case3Data.windowWidthValue*100)/100);

      case1Data.sillHeightValue = units.Ft2M(case1Data.sillHeightValue);
      $("#sill").val(round(case1Data.sillHeightValue*100)/100);
      case2Data.sillHeightValue = units.Ft2M(case2Data.sillHeightValue);
      $("#sill2").val(round(case2Data.sillHeightValue*100)/100);
      case3Data.sillHeightValue = units.Ft2M(case3Data.sillHeightValue);
      $("#sill3").val(round(case3Data.sillHeightValue*100)/100);

      case1Data.distanceWindows = units.Ft2M(case1Data.distanceWindows);
      $("#distWindow").val(round(case1Data.distanceWindows*100)/100);
      case2Data.distanceWindows = units.Ft2M(case2Data.distanceWindows);
      $("#distWindow2").val(round(case2Data.distanceWindows*100)/100);
      case3Data.distanceWindows = units.Ft2M(case3Data.distanceWindows);
      $("#distWindow3").val(round(case3Data.distanceWindows*100)/100);

      case1Data.uvalueValue = units.uIP2uSI(case1Data.uvalueValue);
      $("#uvalue").val(round(case1Data.uvalueValue*100)/100);
      case2Data.uvalueValue = units.uIP2uSI(case2Data.uvalueValue);
      $("#uvalue2").val(round(case2Data.uvalueValue*100)/100);
      case3Data.uvalueValue = units.uIP2uSI(case3Data.uvalueValue);
      $("#uvalue3").val(round(case3Data.uvalueValue*100)/100);

      case1Data.outdoorTempValue = units.F2C(case1Data.outdoorTempValue);
      $("#outdoortemp").val(round(case1Data.outdoorTempValue));
      case2Data.outdoorTempValue = units.F2C(case2Data.outdoorTempValue);
      $("#outdoortemp2").val(round(case2Data.outdoorTempValue));
      case3Data.outdoorTempValue = units.F2C(case3Data.outdoorTempValue);
      $("#outdoortemp3").val(round(case3Data.outdoorTempValue));

      case1Data.airtempValue = units.F2C(case1Data.airtempValue);
      $("#airtemp").val(round(case1Data.airtempValue));
      case2Data.airtempValue = units.F2C(case2Data.airtempValue);
      $("#airtemp2").val(round(case2Data.airtempValue));
      case3Data.airtempValue = units.F2C(case3Data.airtempValue);
      $("#airtemp3").val(round(case3Data.airtempValue));

      case1Data.rvalueValue = units.rIP2rSI(case1Data.rvalueValue);
      $("#rvalue").val(round(case1Data.rvalueValue*100)/100);
      case2Data.rvalueValue = units.rIP2rSI(case2Data.rvalueValue);
      $("#rvalue2").val(round(case2Data.rvalueValue*100)/100);
      case3Data.rvalueValue = units.rIP2rSI(case3Data.rvalueValue);
      $("#rvalue3").val(round(case3Data.rvalueValue*100)/100);

      case1Data.airspeedValue = units.fpm2mps(case1Data.airspeedValue);
      $("#airspeed").val(round(case1Data.airspeedValue*100)/100);
      case2Data.airspeedValue = units.fpm2mps(case2Data.airspeedValue);
      $("#airspeed2").val(round(case2Data.airspeedValue*100)/100);
      case3Data.airspeedValue = units.fpm2mps(case3Data.airspeedValue);
      $("#airspeed3").val(round(case3Data.airspeedValue*100)/100);

      occDistFromFacade = units.Ft2M(occDistFromFacade);
      // update occupant dist from facade slider
      $("#distFromFacade").attr("max", 4).attr("min", .5);
      $("#distFromFacade").val(occDistFromFacade);
      $("#distFromFacade").attr("value", occDistFromFacade);
      $("#distOutput").empty();
      $("#distOutput").text(round(occDistFromFacade * 10)/10 + " m");

      // update graph axis / scales
      x = d3.scale.linear()
      .range([0, width]) // value -> display
      .domain([0, 4.5]);

      xAxis = d3.svg.axis().scale(x).orient("bottom");

      graphSvg.select("#graphXAxis")
        .call(xAxis.ticks(8).tickValues([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]));
      graphSvg.select("#XAxisLabel")
      .text("Occupant Distance from Façade (m)");
      graphSvg2.select("#graphXAxis")
        .call(xAxis.ticks(8).tickValues([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]));
      graphSvg2.select("#XAxisLabel")
      .text("Occupant Distance from Façade (m)");

      updateData(case1Data);
      updateData(case2Data);
      updateData(case3Data);

      updateOccupantDistanceRefLine();
    }
  })

  // show URL in modal alert
    $(".optionButton#URL").click(function(event) {
    var urlresult = createURL();

    $("#URLpop textarea").empty();
    $("#URLpop textarea").append(urlresult);

    $("#URLpop").dialog("open");
    $("#URLpop textarea").select();
  })

  // print to PDF
  $(".optionButton#PDF").click(function(event) {
    window.print();
  })

  // CSV Download
  $(".optionButton#CSV").click(function(event) {
    globInputs = [occDistFromFacade, ppdValue, ppdValue2]
    csvContent = createCSV(dataset, dataset2, dataset3, occPointData, occPointData2, occPointData3, case1Data, case2Data, case3Data, globInputs, unitSys)
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  })



  /* ------ DETECT CHANGES TO INPUT VALUES ------ */
  // universal changes

  // occupant threshold sliders - to show value change as slider moves
  if (Modernizr.oninput) {

  } else { //for IE support
      // not-supported
      $("#distFromFacade").on("change", function(event) {
      occDistFromFacade = $(this).val();

      $("#distFromFacade").val(occDistFromFacade);
      $("#distFromFacade").attr("value",occDistFromFacade);
      if (unitSys == "IP") {
        $("#distOutput").text(occDistFromFacade + " ft");
      } else {
        $("#distOutput").text(occDistFromFacade + " m");
      }

      updateData(case1Data);
      updateData(case2Data);
      updateData(case3Data);

      thresholdDataText("dwn");
      thresholdDataText("mrt");
      thresholdDataText("comb");
      updateOccupantDistanceRefLine();
    })
    $("#ppd").on("change", function(event) {
      if ($(this).val() <= 4) {
        ppdValue = 5;
        $("#ppd").val(5);
        $("#ppdOutput").text("5%");
      }
      else if ($(this).val() >30) {
        ppdValue = 30;
        $("#ppd").val(30);
        $("#ppdOutput").text("30%");
      }
      else {
        ppdValue = $(this).val();
        $("#ppd").attr("value",ppdValue);
        $("#ppdOutput").text(ppdValue + "%");
      }
      // Update target PPD threshold line
      updatePPDThreshold(graphSvg, ppdValue);
      updateCombPPDThreshold(graphSvg3, ppdValue, "dwn");
      thresholdDataText("dwn");
      thresholdDataText("mrt");
      thresholdDataText("comb");
      // update calculated uvalue
      autocalcUValues();
    });

    $("#ppd2").on("change", function(event) {
      if ($(this).val() <= 4) {
        ppdValue2 = 5;
        $("#ppd2").val(5);
        $("#ppdOutput2").text("5%");
      }
      else if ($(this).val() >30) {
        ppdValue2 = 30;
        $("#ppd2").val(30);
        $("#ppdOutput2").text("30%");
      }
      else {
        ppdValue2 = $(this).val();
        $("#ppd2").attr("value",ppdValue2);
        $("#ppdOutput2").text(ppdValue2 + "%");
      }
      // Update target PPD threshold line
      updatePPDThreshold(graphSvg2, ppdValue2);
      updateCombPPDThreshold(graphSvg3, ppdValue, "mrt");
      thresholdDataText("dwn");
      thresholdDataText("mrt");
      thresholdDataText("comb");

      // update calculated uvalue
      autocalcUValues();
    });

    $("#occupantDist").on("change", function(event) {
      //assign new value
      case1Data.occDistToWallCenter = $(this).val();
      $("#occupantDist").attr("value", case1Data.occDistToWallCenter);
      updateOccupantImageLocation("#occupantImage", "#occupantDist", case1Data);
      updateData(case1Data);
    })
    $("#occupantDist2").on("change", function(event) {
      //assign new value
      case2Data.occDistToWallCenter = $(this).val();
      updateOccupantImageLocation("#occupantImage2", "#occupantDist2", case2Data);
      updateData(case2Data);
    })
    $("#occupantDist3").on("change", function(event) {
      //assign new value
      case3Data.occDistToWallCenter = $(this).val();
      updateOccupantImageLocation("#occupantImage3", "#occupantDist3", case3Data);
      updateData(case3Data);
    })
  }

  // does not work in IE, see Modernizer code above
  $("#distFromFacade").on("input", function(event) {
    occDistFromFacade = $(this).val();

    $("#distFromFacade").val(occDistFromFacade);
    $("#distFromFacade").attr("value",occDistFromFacade);
    if (unitSys == "IP") {
      $("#distOutput").text(occDistFromFacade + " ft");
    } else {
      $("#distOutput").text(occDistFromFacade + " m");
    }

    updateData(case1Data);
    updateData(case2Data);
    updateData(case3Data);

    thresholdDataText("dwn");
    thresholdDataText("mrt");
    thresholdDataText("comb");
    updateOccupantDistanceRefLine();
  })

  // does not work in IE, see Modernizer code above
  $("#ppd").on("input", function(event) {
    if ($(this).val() <= 4) {
      ppdValue = 5;
      $("#ppd").val(5);
      $("#ppdOutput").text("5%");
    }
    else if ($(this).val() >30) {
      ppdValue = 30;
      $("#ppd").val(30);
      $("#ppdOutput").text("30%");
    }
    else {
      ppdValue = $(this).val();
      $("#ppd").attr("value",ppdValue);
      $("#ppdOutput").text(ppdValue + "%");
    }
    // Update target PPD threshold line
    updatePPDThreshold(graphSvg, ppdValue);
    updateCombPPDThreshold(graphSvg3, ppdValue, "dwn");
    thresholdDataText("dwn");
    thresholdDataText("mrt");
    thresholdDataText("comb");

    // update calculated uvalue
    autocalcUValues();
  });

  // does not work in IE, see Modernizer code above
  $("#ppd2").on("input", function(event) {
    if ($(this).val() <= 4) {
      ppdValue2 = 5;
      $("#ppd2").val(5);
      $("#ppdOutput2").text("5%");
    }
    else if ($(this).val() >30) {
      ppdValue2 = 30;
      $("#ppd2").val(30);
      $("#ppdOutput2").text("30%");
    }
    else {
      ppdValue2 = $(this).val();
      $("#ppd2").attr("value",ppdValue2);
      $("#ppdOutput2").text(ppdValue2 + "%");
    }
    // Update target PPD threshold line
    updatePPDThreshold(graphSvg2, ppdValue2);
    updateCombPPDThreshold(graphSvg3, ppdValue, "mrt");
    thresholdDataText("dwn");
    thresholdDataText("mrt");
    thresholdDataText("comb");

    // update calculated uvalue
    autocalcUValues();
  });

  // does not work in IE, see Modernizer code above
  $("#occupantDist").on("input", function(event) {
    //assign new value
    case1Data.occDistToWallCenter = $(this).val();
    $("#occupantDist").attr("value", case1Data.occDistToWallCenter);
    updateOccupantImageLocation("#occupantImage", "#occupantDist", case1Data);
    updateData(case1Data);
  })
  $("#occupantDist2").on("input", function(event) {
    //assign new value
    case2Data.occDistToWallCenter = $(this).val();
    updateOccupantImageLocation("#occupantImage2", "#occupantDist2", case2Data);
    updateData(case2Data);
  })
  $("#occupantDist3").on("input", function(event) {
    //assign new value
    case3Data.occDistToWallCenter = $(this).val();
    updateOccupantImageLocation("#occupantImage3", "#occupantDist3", case3Data);
    updateData(case3Data);
  })



  $("#windowWidthCheck").change(function(event) {
    if (($("#windowWidthCheck").is(":checked")) == true) {
      glzOrWidth = false; // set by width
      $("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").removeClass("inactive");
      $("#glazing, #glazing2, #glazing3, #glazingLabel").addClass("inactive");

      $("#checkWindWidth").removeClass("unselected");
      $("#checkGlzRatio").addClass("unselected");

      $("#glazingRatioCheck").prop(":checked", false);

      $("#windowWidth, #windowWidth2, #windowWidth3").prop("disabled", false);
      $("#windowWidth, #windowWidth2, #windowWidth3").spinner("enable");
      $("#glazing, #glazing2, #glazing3").prop("disabled", true);
      $("#glazing, #glazing2, #glazing3").spinner("disable");


    } else if (($("#windowWidthCheck").is(":checked")) == false) {
      glzOrWidth = true; // set by ratio
      $("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").addClass("inactive");
      $("#glazing, #glazing2, #glazing3, #glazingLabel").removeClass("inactive");



      $("#checkGlzRatio").removeClass("unselected");
      $("#checkWindWidth").addClass("unselected");

      $("#glazingRatioCheck").prop(":checked", true);

      $("#windowWidth, #windowWidth2, #windowWidth3").prop("disabled", true);
      $("#windowWidth, #windowWidth2, #windowWidth3").spinner("disable");
      $("#glazing, #glazing2, #glazing3").prop("disabled", false);
      $("#glazing, #glazing2, #glazing3").spinner("enable");

    }
  });
  $("#glazingRatioCheck").change(function(event) {
    if (($("#glazingRatioCheck").is(":checked")) == true) {
      glzOrWidth = true;
      $("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").addClass("inactive");
      $("#glazing, #glazing2, #glazing3, #glazingLabel").removeClass("inactive");

      $("#checkGlzRatio").removeClass("unselected");
      $("#checkWindWidth").addClass("unselected");
      $("#windowWidth, #windowWidth2, #windowWidth3").prop("disabled", false);

      $("#windowWidth, #windowWidth2, #windowWidth3").prop("disabled", true);
      $("#windowWidth, #windowWidth2, #windowWidth3").spinner("disable");
      $("#glazing, #glazing2, #glazing3").prop("disabled", false);
      $("#glazing, #glazing2, #glazing3").spinner("enable");

    } else if (($("#glazingRatioCheck").is(":checked")) == false) {
      glzOrWidth = false;
      $("#windowWidth, #windowWidth2, #windowWidth3, #windowWidthLabel").removeClass("inactive");
      $("#glazing, #glazing2, #glazing3, #glazingLabel").addClass("inactive");

      $("#checkGlzRatio").addClass("unselected");
      $("#checkWindWidth").removeClass("unselected");

      $("#windowWidthCheck").prop(":checked", true);


      // disable and enable input boxes
      $("#windowWidth, #windowWidth2, #windowWidth3").prop("disabled", false);
      $("#windowWidth, #windowWidth2, #windowWidth3").spinner("enable");
      $("#glazing, #glazing2, #glazing3").prop("disabled", true);
      $("#glazing, #glazing2, #glazing3").spinner("disable");
    }
  })


  // prevent enter from trigger footnotes, use enter to update value in field
  $("#ceiling, #wallWidth, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowE, #outdoortemp, #airtemp, #humidity, #ceiling2, #wallWidth2, #windowHeight2, #windowWidth2, #glazing2, #sill2, #distWindow2, #uvalue2, #lowE2, #outdoortemp2, #airtemp2, #humidity2, #ceiling3, #wallWidth3, #windowHeight3, #windowWidth3, #glazing3, #sill3, #distWindow3, #uvalue3, #lowE3, #outdoortemp3, #airtemp3, #humidity3, #rvalue, #airspeed, #clothing, #metabolic, #rvalue2, #airspeed2, #clothing2, #metabolic2, #rvalue3, #airspeed3, #clothing3, #metabolic3").keydown(function(event) {
    if (event.keyCode == 13) {
      $(this).blur();
      event.preventDefault();
    }
  });


  // Case 1 - Changes based on typed inputs
  $("#ceiling, #wallWidth, #windowHeight, #windowWidth, #glazing, #sill, #distWindow, #uvalue, #lowE, #outdoortemp, #airtemp, #humidity, #rvalue, #airspeed, #clothing, #metabolic").focusout(function(event) {

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
    else if (triggeredChange == "airspeed") {
      case1Data.airspeedValue = $(this).val();

      if ($("#caseSelection #case2Label").hasClass("unselected") == true){
        case2Data.airspeedValue = case1Data.airspeedValue;
        $("#airspeed2").val(case2Data.airspeedValue);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == true){
        case3Data.airspeedValue = case1Data.airspeedValue;
        $("#airspeed3").val(case3Data.airspeedValue);
      }
    }
    else if (triggeredChange == "clothing") {
      case1Data.clothingValue = $(this).val();

      if ($("#caseSelection #case2Label").hasClass("unselected") == true){
        case2Data.clothingValue = case1Data.clothingValue;
        $("#clothing2").val(case2Data.clothingValue);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == true){
        case3Data.clothingValue = case1Data.clothingValue;
        $("#clothing3").val(case3Data.clothingValue);
      }
    }
    else if (triggeredChange == "metabolic") {
      case1Data.metabolic = $(this).val();

      if ($("#caseSelection #case2Label").hasClass("unselected") == true){
        case2Data.metabolic = case1Data.metabolic;
        $("#metabolic2").val(case2Data.metabolic);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == true){
        case3Data.metabolic = case1Data.metabolic;
        $("#metabolic3").val(case3Data.metabolic);
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

    $("#airspeed").on("spin", function(event, ui) {
      case1Data.airspeedValue = ui.value;
      if ($("#caseSelection #case2Label").hasClass("unselected") == true){
        case2Data.airspeedValue = case1Data.airspeedValue;
        $("#airspeed2").val(case2Data.airspeedValue);
        updateData(case2Data);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == true){
        case3Data.airspeedValue = case1Data.airspeedValue;
        $("#airspeed3").val(case3Data.airspeedValue);
        updateData(case3Data);
      }
      updateData(case1Data);
    })

    $("#clothing").on("spin", function(event, ui) {
      case1Data.clothingValue = ui.value;
      if ($("#caseSelection #case2Label").hasClass("unselected") == true){
        case2Data.clothingValue = case1Data.clothingValue;
        $("#clothing2").val(case2Data.clothingValue);
        updateData(case2Data);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == true){
        case3Data.clothingValue = case1Data.clothingValue;
        $("#clothing3").val(case3Data.clothingValue);
        updateData(case3Data);
      }
      updateData(case1Data);
    })

    $("#metabolic").on("spin", function(event, ui) {
      case1Data.metabolic = ui.value;
      if ($("#caseSelection #case2Label").hasClass("unselected") == true){
        case2Data.metabolic = case1Data.metabolic;
        $("#metabolic2").val(case2Data.metabolic);
        updateData(case2Data);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == true){
        case3Data.metabolic = case1Data.metabolic;
        $("#metabolic3").val(case3Data.metabolic);
        updateData(case3Data);
      }
      updateData(case1Data);
    })




  // Case 2 - Changes based on typed inputs
  $("#ceiling2, #wallWidth2, #windowHeight2, #windowWidth2, #glazing2, #sill2, #distWindow2, #uvalue2, #lowE2, #outdoortemp2, #airtemp2, #humidity2").focusout(function(event) {

    //figure out what input changed
    var triggeredChange = event.target.id;


    if(triggeredChange == "ceiling2") {
      changedVar = "ceilingHeightValue";
      case2Data.ceilingHeightValue = $(this).val();

    }
    else if(triggeredChange == "wallWidth2") {
      changedVar = "wallLen";
      case2Data.wallLen = $(this).val();

      $("#occupantDist2").attr("max", case2Data.wallLen/2);
    }

    else if (triggeredChange == "windowHeight2") {
      changedVar = "windowHeightValue";
      case2Data.windowHeightValue = $(this).val();
    }
    else if (triggeredChange == "windowWidth2") {
      changedVar = "windowWidthValue";
      case2Data.windowWidthValue = $(this).val();
    }
    else if (triggeredChange == "glazing2") {
      changedVar = "glzRatioValue";
      case2Data.glzRatioValue = $(this).val();
    }
    else if (triggeredChange == "sill2") {
      changedVar = "sillHeightValue";
      case2Data.sillHeightValue = $(this).val();
    }
    else if (triggeredChange == "distWindow2") {
      changedVar = "distanceWindows";
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
    else if (triggeredChange == "rvalue2") {
      case2Data.rvalueValue = $(this).val();
    }
    else if (triggeredChange == "airspeed2") {
      case2Data.airspeedValue = $(this).val();
    }
    else if (triggeredChange == "clothing2") {
      case2Data.clothingValue = $(this).val();
    }
    else if (triggeredChange == "metabolic2") {
      case2Data.metabolic = $(this).val();
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
      changedVar = "ceilingHeightValue";
      updateData(case2Data);
    })

    $("#wallWidth2").on("spin", function(event, ui) {
      case2Data.wallLen = ui.value;
      changedVar = "wallLen";
      $("#occupantDist2").attr("max", case2Data.wallLen/2);

      updateData(case2Data);
    })


    $("#windowHeight2").on("spin", function(event, ui) {
      case2Data.windowHeightValue = ui.value;
      changedVar = "windowHeightValue";
      updateData(case2Data);
    })

    $("#windowWidth2").on("spin", function(event, ui) {
      case2Data.windowWidthValue = ui.value;
      changedVar = "windowWidthValue";
      updateData(case2Data);
    })

    $("#glazing2").on("spin", function(event, ui) {
      case2Data.glzRatioValue = ui.value;
      changedVar = "glzRatioValue";
      updateData(case2Data);
    })

    $("#sill2").on("spin", function(event, ui) {
      case2Data.sillHeightValue = ui.value;
      changedVar = "sillHeightValue"
      updateData(case2Data);
    })

    $("#distWindow2").on("spin", function(event, ui) {
      case2Data.distanceWindows = ui.value;

      updateData(case2Data);
    })

    $("#uvalue2").on("spin", function(event, ui) {
      case2Data.uvalueValue = ui.value;
      changedVar = "distanceWindows";
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
    $("#rvalue2").on("spin", function(event, ui) {
      case2Data.rvalueValue = ui.value;
      updateData(case2Data);
    })
    $("#airspeed2").on("spin", function(event, ui) {
      case2Data.airspeedValue = ui.value;
      updateData(case2Data);
    })
    $("#clothing2").on("spin", function(event, ui) {
      case2Data.clothingValue = ui.value;
      updateData(case2Data);
    })
    $("#metabolic2").on("spin", function(event, ui) {
      case2Data.metabolic = ui.value;
      updateData(case2Data);
    })


  // Case 3 - Changes based on typed inputs
  $("#ceiling3, #wallWidth3, #windowHeight3, #windowWidth3, #glazing3, #sill3, #distWindow3, #uvalue3, #lowE3, #outdoortemp3, #airtemp3, #humidity3").focusout(function(event) {

    //figure out what input changed
    var triggeredChange = event.target.id;


    if(triggeredChange == "ceiling3") {
      case3Data.ceilingHeightValue = $(this).val();
      changedVar = "ceilingHeightValue";
    }
    else if(triggeredChange == "wallWidth3") {
      case3Data.wallLen = $(this).val();
      changedVar = "wallLen";
      $("#occupantDist3").attr("max", case3Data.wallLen/2);

    }

    else if (triggeredChange == "windowHeight3") {
      case3Data.windowHeightValue = $(this).val();
      changedVar = "windowHeightValue";
    }
    else if (triggeredChange == "windowWidth3") {
      case3Data.windowWidthValue = $(this).val();
      changedVar = "windowWidthValue";
    }
    else if (triggeredChange == "glazing3") {
      case3Data.glzRatioValue = $(this).val();
      changedVar = "glzRatioValue";
    }
    else if (triggeredChange == "sill3") {
      changedVar = "sillHeightValue"
      case3Data.sillHeightValue = $(this).val();
    }
    else if (triggeredChange == "distWindow3") {
      case3Data.distanceWindows = $(this).val();
      changedVar = "distanceWindows";
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
    else if (triggeredChange == "rvalue3") {
      case3Data.rvalueValue = $(this).val();
    }
    else if (triggeredChange == "airspeed3") {
      case3Data.airspeedValue = $(this).val();
    }
    else if (triggeredChange == "clothing3") {
      case3Data.clothingValue = $(this).val();
    }
    else if (triggeredChange == "metabolic3") {
      case3Data.metabolic = $(this).val();
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
      changedVar = "ceilingHeightValue";
      updateData(case3Data);
    })

    $("#wallWidth3").on("spin", function(event, ui) {
      case3Data.wallLen = ui.value;
      changedVar = "wallLen";

      $("#occupantDist3").attr("max", case3Data.wallLen/2);


      updateData(case3Data);
    })


    $("#windowHeight3").on("spin", function(event, ui) {
      case3Data.windowHeightValue = ui.value;
      changedVar = "windowHeightValue";
      updateData(case3Data);
    })

    $("#windowWidth3").on("spin", function(event, ui) {
      case3Data.windowWidthValue = ui.value;
      changedVar = "windowWidthValue";
      updateData(case3Data);
    })

    $("#glazing3").on("spin", function(event, ui) {
      case3Data.glzRatioValue = ui.value;
      changedVar = "glzRatioValue";
      updateData(case3Data);
    })

    $("#sill3").on("spin", function(event, ui) {
      case3Data.sillHeightValue = ui.value;
      changedVar = "sillHeightValue"
      updateData(case3Data);
    })

    $("#distWindow3").on("spin", function(event, ui) {
      case3Data.distanceWindows = ui.value;
      changedVar = "distanceWindows";
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
    $("#rvalue3").on("spin", function(event, ui) {
      case3Data.rvalueValue = ui.value;
      updateData(case2Data);
    })
    $("#airspeed3").on("spin", function(event, ui) {
      case3Data.airspeedValue = ui.value;
      updateData(case3Data);
    })
    $("#clothing2").on("spin", function(event, ui) {
      case3Data.clothingValue = ui.value;
      updateData(case2Data);
    })
    $("#metabolic2").on("spin", function(event, ui) {
      case3Data.metabolic = ui.value;
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

      occPointData = newOccLocData;

      condensation1 = newCondensation;
      checkCondensation(condensation1, condensation2, condensation3);

      // update data points
      updateGraphPoints(graphSvg, newDataset, "dotCase1", color1, "dwn");
      updateGraphPoints(graphSvg2, newDataset, "dotCase1", color1, "mrt");
      updateGraphPoints(graphSvg3, newDataset, "dotCase1", color1, "comb");
      updateOccupantPoint(graphSvg, [occPointData], "occdot1", color1, "dwn");
      updateOccupantPoint(graphSvg2, [occPointData], "occdot1", color1, "mrt");
      updateOccupantPoint(graphSvg3, [occPointData], "occdot1", color1, "comb");
      updateConnectedLine(newDataset, ".connectLine");
      updateOccupantDistanceRefLine();
      dataset = newDataset
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

      occPointData2 = newOccLocData;

      condensation2 = newCondensation;
      checkCondensation(condensation1, condensation2, condensation3);

      // update data points
      updateGraphPoints(graphSvg, newDataset, "dotCase2", color2, "dwn");
      updateGraphPoints(graphSvg2, newDataset, "dotCase2", color2, "mrt");
      updateGraphPoints(graphSvg3, newDataset, "dotCase2", color2, "comb");
      updateOccupantPoint(graphSvg, [occPointData2], "occdot2", color2, "dwn");
      updateOccupantPoint(graphSvg2, [occPointData2], "occdot2", color2, "mrt");
      updateOccupantPoint(graphSvg3, [occPointData2], "occdot2", color2, "comb");
      updateConnectedLine(newDataset, ".connectLine2");
      updateOccupantDistanceRefLine();
      dataset2 = newDataset
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

      occPointData3 = newOccLocData;

      condensation3 = newCondensation;
      checkCondensation(condensation1, condensation2, condensation3);

      // update data points
      updateGraphPoints(graphSvg, newDataset, "dotCase3", color3, "dwn");
      updateGraphPoints(graphSvg2, newDataset, "dotCase3", color3, "mrt");
      updateGraphPoints(graphSvg3, newDataset, "dotCase3", color3, "comb");
      updateOccupantPoint(graphSvg, [occPointData3], "occdot3", color3, "dwn");
      updateOccupantPoint(graphSvg2, [occPointData3], "occdot3", color3, "mrt");
      updateOccupantPoint(graphSvg3, [occPointData3], "occdot3", color3, "comb");
      updateConnectedLine(newDataset, ".connectLine3");
      updateOccupantDistanceRefLine();
      dataset3 = newDataset
    }

    autocalcUValues();

    updateFacade();

    // Update static tooltip text
    thresholdDataText("dwn");
    thresholdDataText("mrt");
    thresholdDataText("comb");

  }


  function autocalcUValues() {
    // Re-run the functions with the new inputs.
    var fullDataCase1 = script.computeData(case1Data);
    var fullDataCase2 = script.computeData(case2Data);
    var fullDataCase3 = script.computeData(case3Data);

    //Compute the U-Value required to make the occupant comfortable.
    var numPtsLen = (fullDataCase1.wallViews.length)-1
    case1Data.calcUVal = uVal.uValFinal(fullDataCase1.wallViews[numPtsLen], fullDataCase1.glzViews[numPtsLen], fullDataCase1.facadeDist[numPtsLen], fullDataCase1.dwnPPDFac, parseFloat(case1Data.windowHeightValue), parseFloat(case1Data.sillHeightValue), case1Data.airtempValue, case1Data.outdoorTempValue, case1Data.rvalueValue, case1Data.intLowEChecked, case1Data.intLowEEmissivity, case1Data.airspeedValue, case1Data.humidityValue, case1Data.metabolic, case1Data.clothingValue, ppdValue, ppdValue2);
    case2Data.calcUVal = uVal.uValFinal(fullDataCase2.wallViews[numPtsLen], fullDataCase2.glzViews[numPtsLen], fullDataCase2.facadeDist[numPtsLen], fullDataCase2.dwnPPDFac, parseFloat(case2Data.windowHeightValue), parseFloat(case2Data.sillHeightValue), case2Data.airtempValue, case2Data.outdoorTempValue, case2Data.rvalueValue, case2Data.intLowEChecked, case2Data.intLowEEmissivity, case2Data.airspeedValue, case2Data.humidityValue, case2Data.metabolic, case2Data.clothingValue, ppdValue, ppdValue2);
    case3Data.calcUVal = uVal.uValFinal(fullDataCase3.wallViews[numPtsLen], fullDataCase3.glzViews[numPtsLen], fullDataCase3.facadeDist[numPtsLen], fullDataCase3.dwnPPDFac, parseFloat(case3Data.windowHeightValue), parseFloat(case3Data.sillHeightValue), case3Data.airtempValue, case3Data.outdoorTempValue, case3Data.rvalueValue, case3Data.intLowEChecked, case3Data.intLowEEmissivity, case3Data.airspeedValue, case3Data.humidityValue, case3Data.metabolic, case3Data.clothingValue, ppdValue, ppdValue2);

    // Update the value in the form.
    $("#calcuvalue").val(Math.round(case1Data.calcUVal * 100) / 100);
    $("#calcuvalue2").val(Math.round(case2Data.calcUVal * 100) / 100);
    $("#calcuvalue3").val(Math.round(case3Data.calcUVal * 100) / 100);

    if (case1Data.calcUVal <= 0.01 || case2Data.calcUVal <= 0.01 || case3Data.calcUVal <= 0.01) {
      $("#uvaluePop").css("display","block");

      if (case1Data.calcUVal <= 0.01) {
        $("#calcuvalue").css("color", "#f72734");
      }
      if (case2Data.calcUVal <= 0.01) {
        $("#calcuvalue2").css("color", "#f72734");
      }
      if (case3Data.calcUVal <= 0.01) {
        $("#calcuvalue3").css("color", "#f72734");
      }
    } else {
      $("#uvaluePop").css("display","none");
      $("#calcuvalue, #calcuvalue2, #calcuvalue3").css("color", "#ADADAD");
    }
  }

  function checkCondensation(conValue1, conValue2, conValue3) {

    if (conValue1 != "none" || conValue2 != "none" || conValue3 != "none") {
      $("#condRisk button.bigfoot-footnote__button").css("background-color", "#f72734");
      $("#condRisk button.bigfoot-footnote__button").css("color","white");

      if (conValue1 != "none") {
        $("#condRisk1").addClass("alert").val("YES");
      } else {
        $("#condRisk1").removeClass("alert").val("NO");
      }

      if (conValue2 != "none") {
        $("#condRisk2").addClass("alert").val("YES");
      } else {
        $("#condRisk2").removeClass("alert").val("NO");
      }

      if (conValue3 != "none") {
        $("#condRisk3").addClass("alert").val("YES");
      } else {
        $("#condRisk3").removeClass("alert").val("NO");
      }
    }

    if (conValue1 == "none" && conValue2 == "none" && conValue3 == "none") {
      $("#condRisk button.bigfoot-footnote__button").css("background-color", "rgba(110, 110, 110, 0.2)");
      $("#condRisk button.bigfoot-footnote__button").css("color","black");
      $("#condRisk1, #condRisk2, #condRisk3").removeClass("alert").val("NO");
    }
  }





  /* ------ FUNCTIONS TO INITIALIZE AND UPDATE GRAPH ------ */
  function updateGraphPoints(svgToUpdate, data, className, color, param) {
    // DATA JOIN
    // Join new data with old elements, if any.
    var thesePoints = svgToUpdate.selectAll("." + className)
      .data(data);

    // ENTER
    // Create new elements as needed
    if (param == "mrt" || param == "dwn") {
      thesePoints.enter().append("path")
        .attr("d", d3.svg.symbol()
          .type(function(d) {
            if (param == "dwn") {
              return "triangle-up";
            } else if (param == "mrt") {
              return "circle";
            }
          })
          .size("35"))
        .attr("class",className)
        .style("fill", color);
    } else {
      thesePoints.enter().append("path")
        .attr("d", d3.svg.symbol()
          .type(function(d) {
              if (d.govFact == "dwn") {
              return "triangle-up";
            } else if (d.govFact == "mrt") {
              return "circle";
            }
          })
          .size("35"))
        .attr("class",className)
        .style("fill", color);
      }

    if (param == "dwn") {
      thesePoints.attr("transform", function(d) {
        return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.ppd)) + ")";})
    } else if (param == "mrt") {
      thesePoints.attr("transform", function(d) {
        return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.mrtppd)) + ")";})
    } else {
      thesePoints.attr("transform", function(d) {
        return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y5(d.tarDist)) + ")";})
      thesePoints.attr("d", d3.svg.symbol()
        .type(function(d) {
          if (d.govFact == "dwn") {
            return "triangle-up";
          } else if (d.govFact == "mrt") {
            return "circle";
          }
        })
        .size("35"))
      .attr("class",className)
      .style("fill", color);
    }

    // EXIT
    // Remove old elements as needed
    thesePoints.exit().remove();


    // hide or show different cases on the chart
    if ($("#caseSelection #case2Label").hasClass("unselected") == true) {
      $(".connectLine2, .dotCase2").css("display","none");
    } else {
      $(".connectLine2, .dotCase2").css("display","inline-block");
    }

    if ($("#caseSelection #case3Label").hasClass("unselected") == true) {
      $(".connectLine3, .dotCase3").css("display","none");
    } else {
      $(".connectLine3, .dotCase3").css("display","inline-block");
    }
  }

  function findMaxVisiblePPD() {
    var maxPPD;
    // if only case 1 is shown:
    if ($("#caseSelection #case2Label").hasClass("unselected") == true && $("#caseSelection #case3Label").hasClass("unselected") == true) {
      maxPPD = occPointData.ppd;
    // compare case 1 and case 2
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == false && $("#caseSelection #case3Label").hasClass("unselected") == true) {
      maxPPD = d3.max([occPointData.ppd, occPointData2.ppd]);
    // compare case 1 and case 3
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == true && $("#caseSelection #case3Label").hasClass("unselected") == false) {
      maxPPD = d3.max([occPointData.ppd, occPointData3.ppd]);
    // compare case 1, case 2 and 3
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == false && $("#caseSelection #case3Label").hasClass("unselected") == false) {
      maxPPD = d3.max([occPointData.ppd, occPointData2.ppd, occPointData3.ppd]);
    }
    return maxPPD;
  }
  function findMaxVisiblePPDmrt() {
    var maxPPD;
    if ($("#caseSelection #case2Label").hasClass("unselected") == true && $("#caseSelection #case3Label").hasClass("unselected") == true) {
      maxPPD = occPointData.mrtppd;
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == false && $("#caseSelection #case3Label").hasClass("unselected") == true) {
      maxPPD = d3.max([occPointData.mrtppd, occPointData2.mrtppd]);
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == true && $("#caseSelection #case3Label").hasClass("unselected") == false) {
      maxPPD = d3.max([occPointData.mrtppd, occPointData3.mrtppd]);
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == false && $("#caseSelection #case3Label").hasClass("unselected") == false) {
      maxPPD = d3.max([occPointData.mrtppd, occPointData2.mrtppd, occPointData3.mrtppd]);
    }
    return maxPPD;
  }
  function findMaxVisiblePPDcomb() {
    var maxPPD;
    if ($("#caseSelection #case2Label").hasClass("unselected") == true && $("#caseSelection #case3Label").hasClass("unselected") == true) {
      maxPPD = occPointData.tarDist;
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == false && $("#caseSelection #case3Label").hasClass("unselected") == true) {
      maxPPD = d3.max([occPointData.tarDist, occPointData2.tarDist]);
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == true && $("#caseSelection #case3Label").hasClass("unselected") == false) {
      maxPPD = d3.max([occPointData.tarDist, occPointData3.tarDist]);
    } else if ($("#caseSelection #case2Label").hasClass("unselected") == false && $("#caseSelection #case3Label").hasClass("unselected") == false) {
      maxPPD = d3.max([occPointData.tarDist, occPointData2.tarDist, occPointData3.tarDist]);
    }
    return maxPPD;
  }

  function occupantDistanceRefLine() {

    var maxPPD = findMaxVisiblePPD();
    var maxPPDmrt = findMaxVisiblePPDmrt();
    var maxPPDComb = findMaxVisiblePPDcomb();
    var xPosition = x(occPointData.dist);
    var yPosition = y(maxPPD);
    var yPositionmrt = y(maxPPDmrt);
    var yPositionComb = y5(maxPPDComb);

    graphSvg.append("line")
      .attr("class","occupantLine")
      .attr("x1", xPosition)
      .attr("x2", xPosition)
      .attr("y1", height)
      .attr("y2", yPosition)
      .attr("transform", function() {
        return "translate(" + margin.left + "," + margin.top + ")";
    });

    graphSvg2.append("line")
      .attr("class","occupantLine2")
      .attr("x1", xPosition)
      .attr("x2", xPosition)
      .attr("y1", height)
      .attr("y2", yPositionmrt)
      .attr("transform", function() {
        return "translate(" + margin.left + "," + margin.top + ")";
    });

    graphSvg3.append("line")
      .attr("class","occupantLine3")
      .attr("x1", xPosition)
      .attr("x2", xPosition)
      .attr("y1", height)
      .attr("y2", yPositionComb)
      .attr("transform", function() {
        return "translate(" + margin.left + "," + margin.top + ")";
    });

    d3.selectAll(".occupantLine").classed("draggable", true);
    d3.selectAll(".occupantLine2").classed("draggable", true);
    d3.selectAll(".occupantLine3").classed("draggable", true);
  }

  function updateOccupantDistanceRefLine() {
    var newMaxPPD = findMaxVisiblePPD();
    var newYPosition = y(newMaxPPD);
    var newXPosition = x(occPointData.dist);
    d3.select(".occupantLine")
      .attr("x1", newXPosition)
      .attr("x2", newXPosition)
      .attr("y2", newYPosition)
      .transition();

    var newMaxPPD2 = findMaxVisiblePPDmrt();
    var newYPosition2 = y(newMaxPPD2);
    d3.select(".occupantLine2")
      .attr("x1", newXPosition)
      .attr("x2", newXPosition)
      .attr("y2", newYPosition2)
      .transition();

    var newMaxPPD3 = findMaxVisiblePPDcomb();
    var newYPosition3 = y5(newMaxPPD3);
    var newXPosition3 = x(occPointData.dist);
    d3.select(".occupantLine3")
      .attr("x1", newXPosition)
      .attr("x2", newXPosition)
      .attr("y2", newYPosition3)
      .transition();
  }


  function updateOccupantPoint(chartsvg, data, className, color, param) {
    // DATA JOIN
    // Join new data with old elements, if any.
    var thisOccupantPoint = chartsvg.selectAll("." + className)
      .data(data);

    // ENTER
    // Create new elements as needed
    if (param == "dwn" || param == "mrt") {
      thisOccupantPoint.enter().append("path")
        .attr("d", d3.svg.symbol()
          .type(function(d) {
            if (param == "dwn") {
              return "triangle-up";
            } else if (param == "mrt") {
              return "circle";
            }
          })
          .size("35"))
        .attr("class",className)
        .style("fill", "#FFF")
        .style("stroke", color)
        .style("stroke-width", 2);
    } else {
      thisOccupantPoint.enter().append("path")
        .attr("d", d3.svg.symbol()
          .type(function(d) {
              if (d.govFact == "dwn") {
              return "triangle-up";
            } else if (d.govFact == "mrt") {
              return "circle";
            }
          })
          .size("35"))
        .attr("class",className)
        .style("fill", "#FFF")
        .style("stroke-width", 2)
        .style("stroke", color)
        .style("stroke-width", 2);
    }

    if (param == "dwn") {
      thisOccupantPoint.attr("transform", function(d) {
        return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.ppd)) + ")";})
    } else if (param == "mrt") {
      thisOccupantPoint.attr("transform", function(d) {
        return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y(d.mrtppd)) + ")";})
    }  else {
      thisOccupantPoint.attr("transform", function(d) {
        return "translate(" + (margin.left + x(d.dist)) + "," + (margin.top + y5(d.tarDist)) + ")";})
      thisOccupantPoint.attr("d", d3.svg.symbol()
        .type(function(d) {
          if (d.govFact == "dwn") {
            return "triangle-up";
          } else if (d.govFact == "mrt") {
            return "circle";
          }
        })
        .size("35"))
      .attr("class",className)
      .style("fill", "#FFF")
      .style("stroke-width", 2)
      .style("stroke", color);
    }

    // EXIT
    // Remove old elements as needed
    thisOccupantPoint.exit().remove();


    // hide or show different cases on the chart
    if ($("#caseSelection #case2Label").hasClass("unselected") == true) {
      $(".occdot2").css("display","none");
    } else {
      $(".occdot2").css("display","inline-block");
    }

    if ($("#caseSelection #case3Label").hasClass("unselected") == true) {
      $(".occdot3").css("display","none");
    } else {
      $(".occdot3").css("display","inline-block");
    }
  }


  function updateConnectedLine(data, lineClass) {

    var line = d3.svg.line()
        .x(function(d) {return x(d.dist);})
        .y(function(d) {return y(d.ppd);});

    graphSvg.selectAll(lineClass)
      .attr("d", line(data))
      .transition()
      .duration(500);

    var line2 = d3.svg.line()
      .x(function(d) {return x(d.dist);})
      .y(function(d) {return y(d.mrtppd);});

    graphSvg2.selectAll(lineClass)
      .attr("d", line2(data))
      .transition()
      .duration(500);

    var line3 = d3.svg.line()
      .x(function(d) {return x(d.dist);})
      .y(function(d) {return y5(d.tarDist);});

    graphSvg3.selectAll(lineClass)
      .attr("d", line3(data))
      .transition()
      .duration(500);

  }

  function occupantPositionText(occdata, className, caseName, param) {

    var text = "";
    var reason = "";

    if (param == "dwn") {
      reason = "downdraft";
    } else if (param == "mrt") {
      reason = "radiant";
    } else {
      if (occdata.govFact == "dwn") {
        reason = "downdraft";
      } else {
        reason = "radiant";
      }
    }

    if (param == "dwn") {
      if (occdata.ppd <= ppdValue) {
        text = "<img src='static/images/check.png' class='icon'><h1 class=" + className + ">" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD</h1><div style='clear:both;'></div>";
      } else {
        text = "<img src='static/images/x.png' class='icon'><h1 class=" + className + ">" + caseName +": " + Math.round(occdata.ppd*10)/10 + "% PPD</h1><div style='clear:both;'></div>";
      }
    } else if (param == "mrt") {
      if (occdata.mrtppd <= ppdValue2) {
        text = "<img src='static/images/check.png' class='icon'><h1 class=" + className + ">" + caseName +": " + Math.round(occdata.mrtppd*10)/10 + "% PPD</h1><div style='clear:both;'></div>";
      } else {
        text = "<img src='static/images/x.png' class='icon'><h1 class=" + className + ">" + caseName +": " + Math.round(occdata.mrtppd*10)/10 + "% PPD</h1><div style='clear:both;'></div>";
      }
    } else {
      if (occdata.govFact == "dwn"){
        var govPPD = Math.round(occdata.ppd*10)/10
      } else {
        var govPPD = Math.round(occdata.mrtppd*10)/10
      }
      if (occdata.comf == "True") {
        text = "<img src='static/images/check.png' class='icon'><h1 class=" + className + ">" + caseName +": " + govPPD + "% PPD - " + reason + "</h1><div style='clear:both;'></div>";
      } else {
        text = "<img src='static/images/x.png' class='icon'><h1 class=" + className + ">" + caseName +": " + govPPD + "% PPD - " + reason + "</h1><div style='clear:both;'></div>";
      }
    }

    return text;
  }



  // Display text for occupancy dist from facade
  function thresholdDataText(param) {
    var totalText = "";
    if (param == "dwn"){
      $("#thresholdTooltip").empty();
    } else if (param == "mrt") {
      $("#thresholdTooltip2").empty();
    } else {
      $("#thresholdTooltip3").empty();
    }

    var case1Text = occupantPositionText(occPointData, "case1Text", "Case 1", param);
    var case2Text = occupantPositionText(occPointData2, "case2Text", "Case 2", param);
    var case3Text = occupantPositionText(occPointData3, "case3Text", "Case 3", param);

    //find min cy of visible occ points
    var compareOccupantArray = [];
    if (param == "dwn") {
      compareOccupantArray.push(occPointData.ppd);
      if ($("#caseSelection #case2Label").hasClass("unselected") == false ) {
        compareOccupantArray.push(occPointData2.ppd);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == false ) {
        compareOccupantArray.push(occPointData3.ppd);
      }
    } else if (param == "mrt") {
      compareOccupantArray.push(occPointData.mrtppd);
      if ($("#caseSelection #case2Label").hasClass("unselected") == false ) {
        compareOccupantArray.push(occPointData2.mrtppd);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == false ) {
        compareOccupantArray.push(occPointData3.mrtppd);
      }
    } else {
      compareOccupantArray.push(occPointData.tarDist);
      if ($("#caseSelection #case2Label").hasClass("unselected") == false ) {
        compareOccupantArray.push(occPointData2.tarDist);
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == false ) {
        compareOccupantArray.push(occPointData3.tarDist);
      }
    }

    // put text in correct order
    var maxCase = d3.max(compareOccupantArray);
    var minCase = d3.min(compareOccupantArray);

    if (param == "dwn") {
      // if only case 1 is shown
      if ($("#caseSelection #case2Label").hasClass("unselected") == true  && $("#caseSelection #case3Label").hasClass("unselected") == true) {
        totalText = case1Text;
      }
      // if only cases 1 and 2
      if ($("#caseSelection #case2Label").hasClass("unselected") == false  && $("#caseSelection #case3Label").hasClass("unselected") == true) {
        // determine if case 1 or case 2 is greater
        if (maxCase == occPointData.ppd) {
          totalText = case1Text + case2Text;
        } else {
          totalText = case2Text + case1Text;
        }
      }
      // if only cases 1 and 3
      if ($("#caseSelection #case2Label").hasClass("unselected") == true  && $("#caseSelection #case3Label").hasClass("unselected") == false) {
        // determine if case 1 or case 3 is greater
        if (maxCase == occPointData.ppd) {
          totalText = case1Text + case3Text;
        } else {
          totalText = case3Text + case1Text;
        }
      }
      // if cases 1, 2 and 3
      if ($("#caseSelection #case2Label").hasClass("unselected") == false  && $("#caseSelection #case3Label").hasClass("unselected") == false) {
        // if case 1 is greatest...
        if (maxCase == occPointData.ppd) {
          // case 1 is first
          totalText = case1Text;
          // find out what's next
          if (occPointData2.ppd >= occPointData3.ppd) {
            // case 2 is second
            totalText = totalText + case2Text + case3Text;
          } else {
            // case 3 is second
            totalText = totalText + case3Text + case2Text;
          }
        }
        // if case 2 is greatest...
        else if (maxCase == occPointData2.ppd) {
          // case 2 is first
          totalText = case2Text;
          // find out what's next
          if (occPointData.ppd >= occPointData3.ppd) {
            // case 1 is second
            totalText = totalText + case1Text + case3Text;
          } else {
            // case 3 is second
            totalText = totalText + case3Text + case1Text;
          }
        }
        // if case 3 is greatest...
        else if (maxCase == occPointData3.ppd) {
          // case 3 is first
          totalText = case3Text;
          // find out what's next
          if (occPointData.ppd >= occPointData2.ppd) {
            // case 1 is second
            totalText = totalText + case1Text + case2Text;
          } else {
            // case 2 is second
            totalText = totalText + case2Text + case1Text;
          }
        }
      }
    } else if (param == "mrt") {
      if ($("#caseSelection #case2Label").hasClass("unselected") == true  && $("#caseSelection #case3Label").hasClass("unselected") == true) {
        totalText = case1Text;
      }
      if ($("#caseSelection #case2Label").hasClass("unselected") == false  && $("#caseSelection #case3Label").hasClass("unselected") == true) {
        if (maxCase == occPointData.mrtppd) {
          totalText = case1Text + case2Text;
        } else {
          totalText = case2Text + case1Text;
        }
      }
      if ($("#caseSelection #case2Label").hasClass("unselected") == true  && $("#caseSelection #case3Label").hasClass("unselected") == false) {
        if (maxCase == occPointData.mrtppd) {
          totalText = case1Text + case3Text;
        } else {
          totalText = case3Text + case1Text;
        }
      }
      if ($("#caseSelection #case2Label").hasClass("unselected") == false  && $("#caseSelection #case3Label").hasClass("unselected") == false) {
        if (maxCase == occPointData.mrtppd) {
          totalText = case1Text;
          if (occPointData2.mrtppd >= occPointData3.mrtppd) {
            totalText = totalText + case2Text + case3Text;
          } else {
            totalText = totalText + case3Text + case2Text;
          }
        }
        else if (maxCase == occPointData2.mrtppd) {
          totalText = case2Text;
          if (occPointData.mrtppd >= occPointData3.mrtppd) {
            totalText = totalText + case1Text + case3Text;
          } else {
            totalText = totalText + case3Text + case1Text;
          }
        }
        else if (maxCase == occPointData3.mrtppd) {
          totalText = case3Text;
          if (occPointData.mrtppd >= occPointData2.mrtppd) {
            totalText = totalText + case1Text + case2Text;
          } else {
            totalText = totalText + case2Text + case1Text;
          }
        }
      }
    } else {
      if ($("#caseSelection #case2Label").hasClass("unselected") == true  && $("#caseSelection #case3Label").hasClass("unselected") == true) {
        totalText = case1Text;
      }
      if ($("#caseSelection #case2Label").hasClass("unselected") == false  && $("#caseSelection #case3Label").hasClass("unselected") == true) {
        if (maxCase == occPointData.tarDist) {
          totalText = case1Text + case2Text;
        } else {
          totalText = case2Text + case1Text;
        }
      }
      if ($("#caseSelection #case2Label").hasClass("unselected") == true  && $("#caseSelection #case3Label").hasClass("unselected") == false) {
        if (maxCase == occPointData.tarDist) {
          totalText = case1Text + case3Text;
        } else {
          totalText = case3Text + case1Text;
        }
      }
      if ($("#caseSelection #case2Label").hasClass("unselected") == false  && $("#caseSelection #case3Label").hasClass("unselected") == false) {
        if (maxCase == occPointData.tarDist) {
          totalText = case1Text;
          if (occPointData2.tarDist >= occPointData3.tarDist) {
            totalText = totalText + case2Text + case3Text;
          } else {
            totalText = totalText + case3Text + case2Text;
          }
        }
        else if (maxCase == occPointData2.tarDist) {
          totalText = case2Text;
          if (occPointData.tarDist >= occPointData3.tarDist) {
            totalText = totalText + case1Text + case3Text;
          } else {
            totalText = totalText + case3Text + case1Text;
          }
        }
        else if (maxCase == occPointData3.tarDist) {
          totalText = case3Text;
          if (occPointData.tarDist >= occPointData2.tarDist) {
            totalText = totalText + case1Text + case2Text;
          } else {
            totalText = totalText + case2Text + case1Text;
          }
        }
      }
    }


    if (param == "dwn"){
      $("#thresholdTooltip").append(totalText);
    } else if (param == "mrt") {
      $("#thresholdTooltip2").append(totalText);
    } else {
      $("#thresholdTooltip3").append(totalText);
    }

    if ($("#splitToggle").hasClass("marked") == true) {
      var divHeight = $("div#thresholdTooltip").height() - 25;
    } else {
      var divHeight = $("div#thresholdTooltip3").height() - 25;
    }

    if (divHeight == -25) {
      divHeight = -7
      if ($("#caseSelection #case2Label").hasClass("unselected") == false) {
        divHeight = divHeight + 18
      }
      if ($("#caseSelection #case3Label").hasClass("unselected") == false) {
        divHeight = divHeight + 18
      }
    }


    var xPosition;
    var yPosition;
    var yPadding;

    // set XPosition for tooltip
    // change width of tooltip so it doesn't stretch outside wrapper
    yPadding = -15;

    if (param == "dwn") {
      var ppdScaleFac = d3.max(compareOccupantArray) + 1
    } else if (param == "mrt") {
      var ppdScaleFac = d3.max(compareOccupantArray) + 1.5
    } else {
      var ppdScaleFac = d3.max(compareOccupantArray) + 1
    }

    // full width tooltip
    if (param == "dwn"){
      $("div#thresholdTooltip").css("width","190px");
      $("div#thresholdTooltip h1").css("width","auto");
    } else if (param == "mrt") {
      $("div#thresholdTooltip2").css("width","190px");
      $("div#thresholdTooltip2 h1").css("width","auto");
    } else {
      $("div#thresholdTooltip3").css("width","200px");
      $("div#thresholdTooltip3 h1").css("width","auto");
    }

    if (x(occPointData.dist) < 250) {
      xPosition = x(occPointData.dist) + margin.left + 8;
    } else {
      xPosition = maxContainerWidth - margin.right - $("div#thresholdTooltip").width();
    }

    // set YPosition for tooltip
    if (param == "comb"){
      if (y5(ppdScaleFac) - divHeight + yPadding > 0) {
        yPosition = y5(ppdScaleFac) - divHeight + margin.top + yPadding;
      } else {
        yPosition = margin.top;
      }
    } else {
      if (y(ppdScaleFac) - divHeight + yPadding > 0) {
        yPosition = y(ppdScaleFac) - divHeight + margin.top + yPadding;
      } else {
        yPosition = margin.top;
      }
    }

    if (param == "dwn"){
      d3.select("#thresholdTooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");
    } else if (param == "mrt") {
      d3.select("#thresholdTooltip2")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");
    } else {
      d3.select("#thresholdTooltip3")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");
    }
  }


  function drawGraph(thesvg, yAxisTitle, param) {
    // add axes
    thesvg.append("g")
      .attr("class", "axis")
      .attr("id", "graphXAxis")
      .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")");

    if (unitSys == "IP") {
      thesvg.select("#graphXAxis")
        .call(xAxis.ticks(6).tickValues([2, 4, 6, 8, 10, 12]));
      } else if (unitSys == "SI") {
      thesvg.select("#graphXAxis")
        .call(xAxis.ticks(7).tickValues([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4.0]));
      }

    if (param == "dwn") {
      thesvg.append("g")
          .attr("class", "axis")
          .attr("id", "graphYAxis")
          .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
          .call(yAxis1.ticks(4));
      // add horizontal grid
      thesvg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
            .call(yAxis1
                .tickSize(-width, 0, 0)
                .tickFormat("")
                .ticks(7)
            );
      thesvg.append("svg:image")
           .attr("xlink:href", "static/images/triangle-grey.png")
           .attr("x", 15)
           .attr("y", 30)
           .attr("width", "9")
           .attr("height", "9");

    } else if (param == "mrt"){
      thesvg.append("g")
          .attr("class", "axis")
          .attr("id", "graphYAxis")
          .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
          .call(yAxis2.ticks(4));
      // add horizontal grid
      thesvg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
            .call(yAxis2
                .tickSize(-width, 0, 0)
                .tickFormat("")
                .ticks(7)
            );
      thesvg.append("svg:image")
           .attr("xlink:href", "static/images/circle-grey.png")
           .attr("x", 15)
           .attr("y", 37)
           .attr("width", "9")
           .attr("height", "9");
    } else {
      thesvg.append("g")
            .attr("class", "axis")
            .attr("id", "graphYAxis")
            .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
            .call(yAxis3.ticks(3));
      thesvg.append("g")
            .attr("class", "axis")
            .attr("id", "graphYAxis")
            .attr("transform", "translate(" + (margin.left + width - 5) + "," + margin.top + ")")
            .call(yAxis4.ticks(3));
      // add horizontal grid
      thesvg.append("g")
              .attr("class", "grid")
              .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
              .call(yAxis5
                  .tickSize(-width, 0, 0)
                  .tickFormat("")
                  .ticks(5));
      thesvg.append("svg:image")
           .attr("xlink:href", "static/images/triangle-grey.png")
           .attr("x", 15)
           .attr("y", 30)
           .attr("width", "9")
           .attr("height", "9");
     thesvg.append("svg:image")
          .attr("xlink:href", "static/images/circle-grey.png")
          .attr("x", margin.left + width + margin.right - 22)
          .attr("y", 37)
          .attr("width", "9")
          .attr("height", "9");
    }

    // add axes labels
     thesvg.append("text")
      .attr("class", "axislabel")
      .attr("id", "XAxisLabel")
      .attr("text-anchor", "middle")
      .attr("x", width/2 + margin.left)
      .attr("y", height + margin.top + margin.bottom - 5);

    if (unitSys == "IP") {
      thesvg.select("#XAxisLabel")
        .text("Occupant Distance from Façade (ft)");
      } else if (unitSys == "SI") {
      thesvg.select("#XAxisLabel")
        .text("Occupant Distance from Façade (m)");
      }

    thesvg.append("g")
    .attr("transform", "translate(23," + (height/2 + margin.top) + ")")
    .append("text")
      .attr("class", "yaxislabel")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text(yAxisTitle);

    if (param == "comb") {
      thesvg.append("g")
      .attr("transform", "translate(" + (margin.left + width + margin.right - 14) + "," + (height/2 + margin.top) + ")")
      .append("text")
        .attr("class", "yaxislabel")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Radiant Discomfort (PPD) - ");
    }
  }

  function defDrawData(gsvg, param) {
    // Add line between points
    if (param == "dwn") {
      var line = d3.svg.line()
        .x(function(d) {return x(d.dist);})
        .y(function(d) {return y(d.ppd);});
    } else if (param == "mrt") {
      var line = d3.svg.line()
        .x(function(d) {return x(d.dist);})
        .y(function(d) {return y(d.mrtppd);});
    } else {
      var line = d3.svg.line()
        .x(function(d) {return x(d.dist);})
        .y(function(d) {return y5(d.tarDist);});
    }

    gsvg.append("path")
        .attr("class", "connectLine")
        .attr("d", line(dataset))
        .attr("transform", function() {
          return "translate(" + margin.left + "," + margin.top + ")";})
        .style("fill", "none")
        .style("stroke", color1)
        .style("stroke-width", .5);

    gsvg.append("path")
        .attr("class", "connectLine2")
        .attr("d", line(dataset2))
        .attr("transform", function() {
          return "translate(" + margin.left + "," + margin.top + ")";})
        .style("fill", "none")
        .style("stroke", color2)
        .style("stroke-width", .5);

    gsvg.append("path")
        .attr("class", "connectLine3")
        .attr("d", line(dataset3))
        .attr("transform", function() {
          return "translate(" + margin.left + "," + margin.top + ")";})
        .style("fill", "none")
        .style("stroke", color3)
        .style("stroke-width", .5);
  }

  function drawPPDThreshold(theGraph, data, param) {
    //data = PPD threshold (ie 10%)
    // add shaded rectangle
    if (param == "comb"){
      theGraph.append("rect")
        .attr("class", "thresholdRect")
        .attr("x", 0)
        .attr("y", function() { return y3(data)})
        .attr("width", width) //use width of graph
        .attr("height", function() { return height - y3(data)})
        .attr("transform", function() {
            return "translate(" + margin.left + "," + margin.top + ")";})
        .style("fill", "white");
    } else {
      theGraph.append("rect")
        .attr("class", "thresholdRect")
        .attr("x", 0)
        .attr("y", function() { return y(data)})
        .attr("width", width) //use width of graph
        .attr("height", function() { return height - y(data)})
        .attr("transform", function() {
            return "translate(" + margin.left + "," + margin.top + ")";})
        .style("fill", "white");
    }

    var ppdL = theGraph.append("g")
      .attr("class", "referenceLineGroup")
      .attr("transform", function() {
          return "translate(" + margin.left + "," + margin.top + ")";})


    // add line
    if (param == "dwn") {
      ppdL.append("line")
        .attr("class","refLine")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(data))
        .attr("y2", y(data))
        .style("stroke", "black")
        .style("stroke-width", "2");
      d3.selectAll(".refLine").classed("draggable", true);
    } else if (param == "mrt") {
      ppdL.append("line")
        .attr("class","refLine2")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(data))
        .attr("y2", y(data))
        .style("stroke", "black")
        .style("stroke-width", "2");
      d3.selectAll(".refLine2").classed("draggable", true);
    } else {
      ppdL.append("line")
        .attr("class","refLine3")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y3(data))
        .attr("y2", y3(data))
        .style("stroke", "black")
        .style("stroke-width", "2");
      d3.selectAll(".refLine3").classed("draggable", false);
    }

    // add symbols
    if (param == "comb"){
      ppdL.append("svg:image")
        .attr("class", "checkLine")
        .attr("xlink:href", "static/images/check.png")
        .attr("x", 4)
        .attr("y", y3(data) + 4)
        .attr("width", 12)
        .attr("height", 12);
      ppdL.append("svg:image")
        .attr("class", "crossLine")
        .attr("xlink:href", "static/images/x.png")
        .attr("x", 4)
        .attr("y", y3(data) - 16)
        .attr("width", 12)
        .attr("height", 12);
    } else {
      ppdL.append("svg:image")
        .attr("class", "checkLine")
        .attr("xlink:href", "static/images/check.png")
        .attr("x", 4)
        .attr("y", y(data) + 4)
        .attr("width", 12)
        .attr("height", 12);
      ppdL.append("svg:image")
        .attr("class", "crossLine")
        .attr("xlink:href", "static/images/x.png")
        .attr("x", 4)
        .attr("y", y(data) - 16)
        .attr("width", 12)
        .attr("height", 12);
    }

    return ppdL
  }


  function updatePPDThreshold(chSvg, data) {
    chSvg.selectAll(".refLine")
      .transition()
      .duration(400)
      .attr("y1", y(data))
      .attr("y2", y(data));

    chSvg.selectAll(".refLine2")
      .transition()
      .duration(400)
      .attr("y1", y(data))
      .attr("y2", y(data));

    chSvg.selectAll(".thresholdRect")
      .transition()
      .duration(400)
      .attr("y", function() { return y(data)})
      .attr("height", function() { return height - y(data)});

    // add symbols
    chSvg.selectAll(".checkLine")
      .transition()
      .duration(400)
      .attr("y", y(data) + 4);

    chSvg.selectAll(".crossLine")
      .transition()
      .duration(400)
      .attr("y", y(data) - 16);
  }

  function updateCombPPDThreshold(chSvg, data, threshType) {
    // Calculate where the new points should be for the sake of the combined chart.
    updateData(case1Data);
    updateData(case2Data);
    updateData(case3Data);

    // Update the graph points and occupant point of the combined chart.
    updateGraphPoints(chSvg, dataset, "dotCase1", color1, "comb");
    updateGraphPoints(chSvg, dataset2, "dotCase2", color2, "comb");
    updateGraphPoints(chSvg, dataset3, "dotCase3", color3, "comb");

    updateOccupantPoint(chSvg, [occPointData], "occdot1", color1, "comb");
    updateOccupantPoint(chSvg, [occPointData2], "occdot2", color2, "comb");
    updateOccupantPoint(chSvg, [occPointData3], "occdot3", color3, "comb");

    // Update the axes labes with the new threshold information.
    y3 = d3.scale.linear()
        .range([height, 0])
        .domain([parseFloat(ppdValue)-10, parseFloat(ppdValue)+10]);
    y4 = d3.scale.linear()
        .range([height, 0])
        .domain([parseFloat(ppdValue2)-10, parseFloat(ppdValue2)+10]);
    yAxis3 = d3.svg.axis().scale(y3).orient("left");
    yAxis4 = d3.svg.axis().scale(y4).orient("right");

    chSvg.selectAll("#graphYAxis").remove();

    chSvg.append("g")
          .attr("class", "axis")
          .attr("id", "graphYAxis")
          .attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
          .call(yAxis3.ticks(3));
    chSvg.append("g")
          .attr("class", "axis")
          .attr("id", "graphYAxis")
          .attr("transform", "translate(" + (margin.left + width - 5) + "," + margin.top + ")")
          .call(yAxis4.ticks(3));

  }


  function updateOnlyOccupantPointData() {
    var newOccData1 = script.computeData(case1Data).occPtInfo;
    occPointData = newOccData1;
    var newOccData2 = script.computeData(case2Data).occPtInfo;
    occPointData2 = newOccData2;
    var newOccData3 = script.computeData(case3Data).occPtInfo;
    occPointData3 = newOccData3;

    thresholdDataText("dwn");
    thresholdDataText("mrt");
    thresholdDataText("comb");
  }


  // Draggable occupant and PPD lines on graph
  var dragPPDLine = d3.behavior.drag()
    .on("drag", function() {
      var newY = d3.event.y;
      var oldY = parseFloat(graphSvg.select(".thresholdRect").attr("y"));
      // update value of slider
      // define scale to map the new Y value
      ppdSliderDragScale = d3.scale.linear()
          .domain([0, 260]) //input domain
          .range([30, 0]); //output range
      var updatedPPD = ppdSliderDragScale(newY);
      // prevent line from sliding beyond bounds of axis
      if (updatedPPD < 5) {
        updatedPPD = 5;
        newY = y(5);
      }
      if (updatedPPD > 30) {
        updatedPPD = 30;
        newY = y(30);
      }
      // adjust PPD threshold line
      d3.select(this)
        .attr("y1", newY)
        .attr("y2", newY)
        .transition();
      // adjust the X and Check Indicators
      graphSvg.select(".checkLine")
        .attr("y", newY + 4)
        .transition();
      graphSvg.select(".crossLine")
        .attr("y", newY - 16)
        .transition();
      var originalRectHeight = parseFloat(graphSvg.select(".thresholdRect").attr("height"));
      var newRectHeight = originalRectHeight + (oldY - newY);
      // adjust PPD threshold rectangle
      graphSvg.select(".thresholdRect")
        .attr("y", newY)
        .attr("height", newRectHeight)
        .transition();
      ppdValue = Math.round(updatedPPD);
      $("#ppd").attr("value",ppdValue);
      $("#ppdOutput").text(ppdValue + "%");
      // update occupant position text
      thresholdDataText("dwn");
      thresholdDataText("mrt");
      thresholdDataText("comb");
      // update calculated uvalue
      autocalcUValues();
    });

    var dragPPDLineMRT = d3.behavior.drag()
      .on("drag", function() {
        var newY = d3.event.y;
        var oldY = parseFloat(graphSvg2.select(".thresholdRect").attr("y"));
        // update value of slider
        // define scale to map the new Y value
        ppdSliderDragScale = d3.scale.linear()
            .domain([0, 260]) //input domain
            .range([30, 0]); //output range
        var updatedPPD = ppdSliderDragScale(newY);
        // prevent line from sliding beyond bounds of axis
        if (updatedPPD < 5) {
          updatedPPD = 5;
          newY = y(5);
        }
        if (updatedPPD > 30) {
          updatedPPD = 30;
          newY = y(30);
        }
        // adjust PPD threshold line
        d3.select(this)
          .attr("y1", newY)
          .attr("y2", newY)
          .transition();
        // adjust the X and Check Indicators
        graphSvg2.select(".checkLine")
          .attr("y", newY + 4)
          .transition();
        graphSvg2.select(".crossLine")
          .attr("y", newY - 16)
          .transition();
        var originalRectHeight = parseFloat(graphSvg2.select(".thresholdRect").attr("height"));
        var newRectHeight = originalRectHeight + (oldY - newY);
        // adjust PPD threshold rectangle
        graphSvg2.select(".thresholdRect")
          .attr("y", newY)
          .attr("height", newRectHeight)
          .transition();
        ppdValue2 = Math.round(updatedPPD);
        $("#ppd2").attr("value",ppdValue2);
        $("#ppdOutput2").text(ppdValue2 + "%");
        // update occupant position text
        thresholdDataText("dwn");
        thresholdDataText("mrt");
        thresholdDataText("comb");
        // update calculated uvalue
        autocalcUValues();
      });

  var dragOccupantLine = d3.behavior.drag()
    .on("drag", function() {

      var newX = d3.event.x;

      // define scale to map the new X value
      if (unitSys == "IP") {
        var occDistSliderDragScale = d3.scale.linear()
          .domain([margin.left, width+margin.left]) //input domain
          .range([0, 13]); //output range
      } else {
        var occDistSliderDragScale = d3.scale.linear()
          .domain([margin.left, width+margin.left]) //input domain
          .range([0, 4.5]); //output range
      }

      var newOccPosition = occDistSliderDragScale(newX);

      // prevent line from sliding beyond boudns of data paints
      if (unitSys == "IP") {
        if (newOccPosition < 1) {
          newOccPosition = 1;
          newX = x(1) + margin.left;
        }
        if (newOccPosition > 12) {
          newOccPosition = 12;
          newX = x(12) + margin.left;
        }
      } else {
        if (newOccPosition < 0.5) {
          newOccPosition = 0.5;
          newX = x(0.5) + margin.left;
        }
        if (newOccPosition > 4) {
          newOccPosition = 4;
          newX = x(4) + margin.left;
        }
      }

      // update the global value
      occDistFromFacade = Math.round(newOccPosition*10)/10;

      // update the slider
      $("#distFromFacade").val(occDistFromFacade);
      $("#distFromFacade").attr("value",occDistFromFacade);
      if (unitSys == "IP") {
        $("#distOutput").text(occDistFromFacade + " ft");
      } else {
        $("#distOutput").text(occDistFromFacade + " m");
      }

      //update occupant point data
      updateOnlyOccupantPointData();

      // adjust the occupant point
      updateOccupantPoint(graphSvg, [occPointData], "occdot1", color1, "dwn");
      updateOccupantPoint(graphSvg, [occPointData2], "occdot2", color2, "dwn");
      updateOccupantPoint(graphSvg, [occPointData3], "occdot3", color3, "dwn");
      updateOccupantPoint(graphSvg2, [occPointData], "occdot1", color1, "mrt");
      updateOccupantPoint(graphSvg2, [occPointData2], "occdot2", color2, "mrt");
      updateOccupantPoint(graphSvg2, [occPointData3], "occdot3", color3, "mrt");
      updateOccupantPoint(graphSvg3, [occPointData], "occdot1", color1, "comb");
      updateOccupantPoint(graphSvg3, [occPointData2], "occdot2", color2, "comb");
      updateOccupantPoint(graphSvg3, [occPointData3], "occdot3", color3, "comb");

      var newMaxPPD = findMaxVisiblePPD();
      var newYPosition = y(newMaxPPD);
      var newMaxPPD2 = findMaxVisiblePPDmrt();
      var newYPosition2 = y(newMaxPPD2);
      var newMaxPPD3 = findMaxVisiblePPDcomb();
      var newYPosition3 = y5(newMaxPPD3);

      // update calculated uvalue
      autocalcUValues();

      // adjust PPD threshold line
      d3.selectAll(".occupantLine")
        .attr("x1", newX - margin.left)
        .attr("x2", newX - margin.left)
        .attr("y2", newYPosition)
        .transition();

      // adjust PPD threshold line
      d3.selectAll(".occupantLine2")
        .attr("x1", newX - margin.left)
        .attr("x2", newX - margin.left)
        .attr("y2", newYPosition2)
        .transition();

      // adjust PPD threshold line
      d3.selectAll(".occupantLine3")
        .attr("x1", newX - margin.left)
        .attr("x2", newX - margin.left)
        .attr("y2", newYPosition3)
        .transition();
    });

  d3.selectAll(".refLine").call(dragPPDLine);
  d3.selectAll(".refLine2").call(dragPPDLineMRT);
  d3.selectAll(".occupantLine").call(dragOccupantLine);
  d3.selectAll(".occupantLine2").call(dragOccupantLine);
  d3.selectAll(".occupantLine3").call(dragOccupantLine);



  /* ------ FUNCTIONS TO UPDATE FACADE IMAGES ------ */
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


    var resizeHeight;
    //assume 4.35ft/1.32m sitting height
    if (unitSys == "IP") {
      resizeHeight = Math.round(facadeScaleHeight(4.35));
    } else {
      resizeHeight = Math.round(facadeScaleHeight(1.32588));
    }




    var resizeWidth = Math.round((resizeHeight/originalHeight)*originalWidth);

    var diffBtwSVGandFacade = facWidth - facadeScaleWidth(caseName.wallLen);


    var newLeft = 0 - resizeWidth/2;
    var newBottom = Math.round(resizeHeight + facMargin.bottom + 5);

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
    $(sliderID).attr("max", (caseName.wallLen)/2);

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


} //end makeGraph()
