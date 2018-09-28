var round = Math.round;
var sin = Math.sin;
var atan = Math.atan;
var sqrt = Math.sqrt;
var abs = Math.abs

var geo = geo || {}



// Function that generates the geometry of the windows based on the input window parameters.
// Originally developed by Chris Mackey (Chris@MackeyArchitecture.com) for Ladybug + Honeybee (https://github.com/mostaphaRoudsari/Honeybee)
geo.createGlazingForRect = function(rectHeight, wallLength, glazingRatio, windowWidth, winHeight, silHeight, distBreakup, ratioOrWidth, changedVar) {
	//Check to be sure that the user is not assiging crazy values and, if so, set limits on them.
	if (glazingRatio > 0.95) {
		glazingRatio = 0.95;
	}

  //Define wall coordinates for the given wall length.
  var wallCoord = [[-wallLength/2,0,0],[wallLength/2,0,0],[wallLength/2,0,rectHeight],[-wallLength/2,0,rectHeight]]

	//Find the maximum acceptable area for setting the glazing at the sill height.
  var maxWinHeightSill = rectHeight - silHeight

	//If the window height given from the formulas above is greater than the height of the wall, set the window height to be just under that of the wall.
  if (winHeight > rectHeight) {
		var winHeightFinal = rectHeight;
  } else {
		var winHeightFinal = winHeight;
	}

  //If the sill height given from the formulas above is less than 1% of the wall height, set the sill height to be 1% of the wall height.
  if (silHeight < (0.01 * rectHeight)) {
			var silHeightFinal = 0;
	} else if (silHeight > rectHeight-0.1) {
			var silHeightFinal = rectHeight-0.1;
	} else {
			var silHeightFinal = silHeight;
	}

  //Check to be sure that window height and sill height do not exceed the ceiling height.
  if (winHeightFinal + silHeightFinal > rectHeight) {
		if (changedVar == "sillHeightValue") {
			var winHeightFinal = rectHeight - silHeightFinal
		} else{
			var silHeightFinal = rectHeight - winHeightFinal;
		}
	}

	if (ratioOrWidth == true) {
		//Calculate the target area to make the glazing.
		var targetArea = wallLength * rectHeight * glazingRatio

		//Find the maximum acceptable area for breaking up the window into smaller, taller windows.
		var maxAreaBreakUp = (wallLength * 0.98) * winHeight

		//Find the window geometry in the case that the target area is below that of the maximum acceptable area for breaking up the window into smaller, taller windows.
		if (targetArea < maxAreaBreakUp) {
			//Divide up the rectangle into points on the bottom.
			if (wallLength > (distBreakup/2)) {
				var numDivisions = round(wallLength/distBreakup, 0);
			} else {
				var numDivisions = 1;
			}

 			var windowWidth = (targetArea / winHeightFinal) / numDivisions


 			var btmDivPts = [[(wallLength/2),0,silHeightFinal]]
 			var divDist = wallLength/numDivisions
 			var totalDist = 0

 			while (totalDist < wallLength) {
 				totalDist += divDist
 				btmDivPts.push([((wallLength/2)-totalDist),0,silHeightFinal])
 			}

 			//Organize the points to form lines to be used to generate the windows
 			var winLinesStart = []
 			var ptIndex = 0
 			for (var i = 0; i < btmDivPts.length; i++) {
 				var point = btmDivPts[i];
 				if (ptIndex < numDivisions) {
 					winLinesStart.push([point, btmDivPts[ptIndex+1]])
 					ptIndex ++
 				}
 			}

 			//Scale the lines to their center points based on the width that they need to be to satisfy the glazing ratio.
 			var lineCentPt = []
 			for (var i = 0; i < winLinesStart.length; i++) {
 				var line = winLinesStart[i]
 				lineCentPt.push([line[1][0]+((line[0][0]-line[1][0])/2), 0, line[0][2]])
 			}

 			if (numDivisions != 1) {
 				var distCentLine = divDist
 			} else{
 				var distCentLine = wallLength
 			}
 			var winLineBaseLength = winLinesStart[0][0][0] - winLinesStart[0][1][0]
 			var winLineReqLength = (targetArea / winHeightFinal) / numDivisions
 			var winLineScale = winLineReqLength / winLineBaseLength

			for (var i = 0; i < winLinesStart.length; i++) {
				var line = winLinesStart[i]
				var lineCenterPt = lineCentPt[i]
				var newStartPt = [line[0][0] - ((line[0][0]-lineCenterPt[0])*(1-winLineScale)), 0, line[0][2]]
				var newEndPt = [line[1][0] + ((lineCenterPt[0]-line[1][0])*(1-winLineScale)), 0, line[0][2]]
				winLinesStart[i] = [newStartPt, newEndPt]
			}

			//Extrude the lines to create windows.
			var finalGlzCoords = []
			for (var i = 0; i < winLinesStart.length; i++) {
				var line = winLinesStart[i]
				var windowCoord = []
				windowCoord.push(line[1])
				windowCoord.push(line[0])
				windowCoord.push([line[0][0], 0, line[0][2] + winHeightFinal])
				windowCoord.push([line[1][0], 0, line[1][2] + winHeightFinal])
				finalGlzCoords.push(windowCoord)
			}

		} else {
			//Find the window geometry in the case that the target area is above that of the maximum acceptable area for breaking up the window in which case we have to make one big window.
			//Move the bottom curve of the window to the appropriate sill height.
			var maxSillHeight = (rectHeight*0.99) - (targetArea / (wallLength * 0.98))
			if (silHeightFinal > maxSillHeight){
				silHeightFinal = maxSillHeight
			}
			var winLinesStart = [[wallLength/2,0,silHeightFinal],[-wallLength/2,0,silHeightFinal]]

			//Scale the curve so that it is not touching the edges of the surface.
			var distCentLine = wallLength
			var winLineScale = 0.98
			var lineCentPt = [0,0,0]
			var newStartPt = [winLinesStart[0][0] - ((winLinesStart[0][0]-lineCentPt[0])*(1-winLineScale)), 0, winLinesStart[0][2]]
			var newEndPt = [winLinesStart[1][0] + ((lineCentPt[0]-winLinesStart[1][0])*(1-winLineScale)), 0, winLinesStart[0][2]]
			var winLinesStart = [newStartPt,newEndPt]
			windowWidth = newStartPt[0] - newEndPt[0]

			//Extrude the lines to create windows.
			var finalGlzCoords = [[]]
			winHeightFinal = (targetArea / (wallLength * 0.98))
			finalGlzCoords[0].push(winLinesStart[1])
			finalGlzCoords[0].push(winLinesStart[0])
			finalGlzCoords[0].push([winLinesStart[0][0], 0, winLinesStart[0][2] + winHeightFinal])
			finalGlzCoords[0].push([winLinesStart[1][0], 0, winLinesStart[1][2] + winHeightFinal])

		}
	} else {
		//Find the maximum acceptable width for breaking up the window into smaller, taller windows.
		var maxWidthBreakUp = wallLength/2

		//Divide up the rectangle into points on the bottom.
		if (wallLength > (distBreakup/2)) {
			var numDivisions = round(wallLength/distBreakup, 0);
		} else {
			var numDivisions = 1;
		}
		//Find the window geometry in the case that the target width is below that of the maximum width acceptable area for breaking up the window into smaller windows.
		if (windowWidth < maxWidthBreakUp && numDivisions*windowWidth <= wallLength && numDivisions != 1) {
			if (numDivisions == 1) {
				var divDist = wallLength/2
			} else if (((numDivisions*windowWidth)+ (numDivisions-1)*(distBreakup-windowWidth)) > wallLength){
				numDivisions = Math.floor(wallLength/distBreakup)
				var divDist = distBreakup
			} else{
				var divDist = distBreakup
			}

			function isOdd(num) { return num % 2;}
			if (isOdd(numDivisions) == 0){
				startPtX = (numDivisions / 2) * divDist
			} else {
				startPtX = (Math.floor(numDivisions / 2) + 0.5) * divDist
			}

			var btmDivPts = [[startPtX,0,silHeightFinal]]
			var remainder = wallLength - (divDist*numDivisions)
			var totalDist = remainder/2

			while (totalDist < wallLength) {
				totalDist += divDist
				nextPt = (wallLength / 2) - totalDist
				btmDivPts.push([nextPt,0,silHeightFinal])
			}

			//Organize the points to form lines to be used to generate the windows
			var winLinesStart = []
			var ptIndex = 0
			for (var i = 0; i < btmDivPts.length; i++) {
				var point = btmDivPts[i];
				if (ptIndex < numDivisions) {
					winLinesStart.push([point, btmDivPts[ptIndex+1]])
					ptIndex ++
				}
			}

			//Scale the lines to their center points based on the width that they need to be to satisfy the glazing ratio.
			var lineCentPt = []
			for (var i = 0; i < winLinesStart.length; i++) {
				var line = winLinesStart[i]
				lineCentPt.push([line[1][0]+((line[0][0]-line[1][0])/2), 0, line[0][2]])
			}
			if (numDivisions != 1) {
				var distCentLine = divDist
			} else{
				var distCentLine = wallLength
			}

			var winLineScale = windowWidth / divDist

			for (var i = 0; i < winLinesStart.length; i++) {
				var line = winLinesStart[i]
				var lineCenterPt = lineCentPt[i]
				var newStartPt = [line[0][0] - ((line[0][0]-lineCenterPt[0])*(1-winLineScale)), 0, line[0][2]]
				var newEndPt = [line[1][0] + ((lineCenterPt[0]-line[1][0])*(1-winLineScale)), 0, line[0][2]]
				winLinesStart[i] = [newStartPt, newEndPt]
			}

			//Extrude the lines to create windows and calculate the glazing area.
			var glzArea = 0
			var finalGlzCoords = []
			for (var i = 0; i < winLinesStart.length; i++) {
				var line = winLinesStart[i]
				var windowCoord = []
				windowCoord.push(line[1])
				windowCoord.push(line[0])
				windowCoord.push([line[0][0], 0, line[0][2] + winHeightFinal])
				windowCoord.push([line[1][0], 0, line[1][2] + winHeightFinal])
				finalGlzCoords.push(windowCoord)
				glzArea += (winHeightFinal*windowWidth)
			}
		} else {
			//Find the window geometry in the case that the target width is above the maximum width acceptable area for breaking up the window into smaller windows.
			if (windowWidth > wallLength){
				windowWidth = wallLength
			}
			var winLinesStart = [[wallLength/2,0,silHeightFinal],[-wallLength/2,0,silHeightFinal]]

			//Scale the curve so that it is not touching the edges of the surface.
			var distCentLine = wallLength
			var winLineScale = windowWidth / wallLength
			var lineCentPt = [0,0,0]
			var newStartPt = [winLinesStart[0][0] - ((winLinesStart[0][0]-lineCentPt[0])*(1-winLineScale)), 0, winLinesStart[0][2]]
			var newEndPt = [winLinesStart[1][0] + ((lineCentPt[0]-winLinesStart[1][0])*(1-winLineScale)), 0, winLinesStart[0][2]]
			var winLinesStart = [newStartPt,newEndPt]

			//Extrude the lines to create windows and calculate the glazing area.
			var glzArea = (winHeightFinal*windowWidth)
			var finalGlzCoords = [[]]
			finalGlzCoords[0].push(winLinesStart[1])
			finalGlzCoords[0].push(winLinesStart[0])
			finalGlzCoords[0].push([winLinesStart[0][0], 0, winLinesStart[0][2] + winHeightFinal])
			finalGlzCoords[0].push([winLinesStart[1][0], 0, winLinesStart[1][2] + winHeightFinal])
		}
		//Calculate the glazing ratio.
		var glazingRatio = glzArea/(wallLength*rectHeight)
	}

	//Return the coordinates of the wall.
	var r = {}
	r.glzRatio = glazingRatio;
	r.windowWidth = windowWidth;
	r.windowHeight = winHeightFinal;
	r.sillHeight = silHeightFinal;
	r.centLineDist = distCentLine;
    r.wallCoords = wallCoord;
    r.glzCoords = finalGlzCoords;
	return r
}


//This formula for calculating solid angles and view factors to orthagonal surfaces comes from:
//Tredre, Barbara. (1965). Assessment of Mean Radiant Temperature in Indoor Envrionments.
//Britich Journal of Indutrial Medecine, 22, 58.
geo.calcViewFacs = function(srfCoords, locPts) {
    // Define a list to be filled up with view factors.
	var viewFact = []

	for (var i = 0; i < locPts.length; i++) {
		var pt = locPts[i]
        //Define variables to catch when we should be subtracting quadrants instead of summing them.
        var removeLowQuads = false
        var removeHiQuads = false
        var removeLeftQuads = false
        var removeRightQuads = false

        //Define the dimensions of the windows in relation to the point.
        var a = pt[0]-srfCoords[0][0] //a = left
        var b = srfCoords[1][0]-pt[0] //b = right
        var c = srfCoords[2][2]-pt[2] //c = upper
        var d = pt[2]-srfCoords[1][2] //d = lower
        var z = pt[1]

        //Check to see if any value are negative, indicating that we must subtract quads instead of summing them.
        if (d < 0){
            d = -d;
            removeLowQuads = true;
		}
        if (c < 0){
            c = -c;
            removeHiQuads = true;
		}
        if (a < 0){
            a = -a;
            removeLeftQuads = true;
		}
        if (b < 0){
            b = -b;
            removeRightQuads = true;
		}

        //Compute the product of the dimensions.
        var ac = a*c
        var bc = b*c
        var ad = a*d
        var bd = b*d

		// Compute the P distances by pythagorean theorem.
        var PA = sqrt((a*a)+(d*d))
        var distP4 = sqrt((PA*PA)+(z*z))

        var PB = sqrt((a*a)+(c*c))
        var distP1 = sqrt((PB*PB)+(z*z))

        var PC = sqrt((b*b)+(c*c))
        var distP2 = sqrt((PC*PC)+(z*z))

        var PD = sqrt((b*b)+(d*d))
        var distP3 = sqrt((PD*PD)+(z*z))

		// Compute the solid angles to the quadrants.
		var viewP1 = atan(ac/(z*distP1)) // Upper Left
		var viewP2 = atan(bc/(z*distP2)) // Upper Right
		var viewP3 = atan(bd/(z*distP3)) // Lower Right
		var viewP4 = atan(ad/(z*distP4)) // Lower Left

        //Make sure that the quadrant solid angles have the right sign for computing the full solid angle to the window.
        if (removeLowQuads == true && removeLeftQuads == true){
			var solid1 = -viewP1, solid2 = viewP2, solid3 = -viewP3, solid4 = viewP4
		} else if (removeLowQuads == true && removeRightQuads == true){
			var solid1 = viewP1, solid2 = -viewP2, solid3 = viewP3, solid4 = -viewP4
		} else if (removeLowQuads == true){
			var solid1 = viewP1, solid2 = viewP2, solid3 = -viewP3, solid4 = -viewP4
		} else if (removeHiQuads == true && removeLeftQuads == true){
			var solid1 = viewP1, solid2 = -viewP2, solid3 = viewP3, solid4 = -viewP4
		} else if (removeHiQuads == true && removeRightQuads == true){
			var solid1 = -viewP1, solid2 = viewP2, solid3 = -viewP3, solid4 = viewP4
		} else if (removeHiQuads == true){
			var solid1 = -viewP1, solid2 = -viewP2, solid3 = viewP3, solid4 = viewP4
		} else if (removeLeftQuads == true){
			var solid1 = -viewP1, solid2 = viewP2, solid3 = viewP3, solid4 = -viewP4
		} else if (removeRightQuads == true){
			var solid1 = viewP1, solid2 = -viewP2, solid3 = -viewP3, solid4 = viewP4
		} else {
			var solid1 = viewP1, solid2 = viewP2, solid3 = viewP3, solid4 = viewP4
		}

        //Compute the view factors by summin and dividing by 4*Pi
        var srfView = (solid1+solid2+solid3+solid4)/12.566

        viewFact.push(srfView)
    }

    return viewFact
}



//Calculate all viewFactors for the graph.
geo.computeAllViewFac = function(wallCoords, glazingCoords, occDistToWall){
	var facadeDist = []// The distance from the facade at which we are evaluating comfort.
	var locationPts = [] // The pointlocations in relation to the facade where we are evaluating comfort.

	if (unitSys == "IP"){
		var seatH = 2 // The average height above the ground that the occupan is located in feet.
		var numPts = 12 // The number of points to generate.  They will be generated at each foot.
	} else {
		var seatH = 0.6096 // The average height above the ground that the occupan is located in meters.
		var numPts = 8 // The number of points to generate.  They will be generated at 50 cm.
	}

	for (var i = 0; i < numPts; i++) {
		if (unitSys == "IP"){
			var dist = i+1
		} else {
			var dist = (i+1)*0.5
		}
		facadeDist.push(dist)
		locationPts.push([parseFloat(occDistToWall),dist,seatH])
	}
	// Add a point for the occupant distance from facade.
	facadeDist.push(parseFloat(occDistFromFacade))
	locationPts.push([parseFloat(occDistToWall),parseFloat(occDistFromFacade),seatH])

	// Calculate the view factor to the glazing
	var glzViewFac = geo.calcViewFacs(glazingCoords[0], locationPts)
	for (var i = 1; i < glazingCoords.length; i++){
		var viewFa = geo.calcViewFacs(glazingCoords[i], locationPts)
		for (var j = 0; j < viewFa.length; j++){
			glzViewFac[j] +=  viewFa[j]
		}
	}

	// Calculate the view factor to the wall.
	var fullWallViewFac = geo.calcViewFacs(wallCoords, locationPts)
	var wallViewFac = []
	for (var i = 0; i < fullWallViewFac.length; i++){
		var wallView = fullWallViewFac[i]
		wallViewFac.push(wallView - glzViewFac[i])
	}

	// Calculate the intervals along the facade where the occupant is directly in front of the window.
	var windIntervals = [[],[]]
	if (parseInt(glazingCoords.length/2) != glazingCoords.length/2) {
		for (var i = 0; i < parseInt(glazingCoords.length/2)+1; i++) {
			if (i == 0){
				windIntervals[0].push(0)
				windIntervals[1].push(glazingCoords[parseInt(glazingCoords.length/2)][1][0])
			} else {
				windIntervals[1].push(abs(glazingCoords[parseInt(glazingCoords.length/2) + i][0][0]))
				windIntervals[0].push(abs(glazingCoords[parseInt(glazingCoords.length/2) + i][1][0]))
			}
		}
	} else {
		for (var i = 0; i < glazingCoords.length/2; i++) {
			windIntervals[1].push(abs(glazingCoords[parseInt(glazingCoords.length/2) + i][0][0]))
			windIntervals[0].push(abs(glazingCoords[parseInt(glazingCoords.length/2) + i][1][0]))
		}
	}

	//Return the coordinates of the wall.
	var r = {}
    r.wallViews = wallViewFac;
    r.glzViews = glzViewFac;
	r.facadeDist = facadeDist;
	r.windIntervals = windIntervals;
	return r
}
