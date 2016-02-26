var round = Math.round;
var sin = Math.sin;
var atan = Math.atan;
var sqrt = Math.sqrt;

var geo = geo || {}


//Define some default global variables that we do not want to change or expose in the interface.
var wallLen = 20 // The length of the exterior wall that we are observing in feet.
var seatH = 2 // The average height above the ground that the occupan is located in feet.
var numPts = 12 // The number of points to generate.  They will be generated at each foot.
var facadeDist = []// The distance from the facade at which we are evaluating comfort.
var locationPts = [] // The pointlocations in relation to the facade where we are evaluating comfort.
for (var i = 0; i < numPts; i++) {
	facadeDist.push(i+1)
    locationPts.push([0,i+1,seatH])
}

// Function that generates the geometry of the windows based on the input window parameters.
// Originally developed by Chris Mackey (Chris@MackeyArchitecture.com) for Ladybug + Honeybee (https://github.com/mostaphaRoudsari/Honeybee)
geo.createGlazingForRect = function(rectHeight, glazingRatio, windowWidth, winHeight, silHeight, distBreakup, ratioOrWidth) {
	//Check to be sure that the user is not assiging crazy values and, if so, set limits on them.
	if (glazingRatio > 0.95) {
		glazingRatio = 0.95;
	}
	
    //Define wall coordinates for the given wall length.
    var wallCoord = [[-wallLen/2,0,0],[wallLen/2,0,0],[wallLen/2,0,rectHeight],[-wallLen/2,0,rectHeight]]
    
	//Find the maximum acceptable area for setting the glazing at the sill height.
    var maxWinHeightSill = rectHeight - silHeight
    
	//If the window height given from the formulas above is greater than the height of the wall, set the window height to be just under that of the wall.
    if (winHeight > (0.98 * rectHeight)) {
		var winHeightFinal = (0.98 * rectHeight);
    } else {
		var winHeightFinal = winHeight;
	}
    
    //If the sill height given from the formulas above is less than 1% of the wall height, set the sill height to be 1% of the wall height.
    if (silHeight < (0.01 * rectHeight)) {
		var silHeightFinal = (0.01 * rectHeight);
	} else {
		var silHeightFinal = silHeight;
	} 
    
    //Check to be sure that window height and sill height do not exceed the rectandgly height.
    if (winHeightFinal + silHeightFinal > rectHeight) {
        var silHeightFinal = rectHeight - winHeightFinal;
	}
	
	
	if (ratioOrWidth == true) {
		//Calculate the target area to make the glazing.
		var targetArea = wallLen * rectHeight * glazingRatio
		
		//Find the maximum acceptable area for breaking up the window into smaller, taller windows.
		var maxAreaBreakUp = (wallLen * 0.98) * winHeight
		
		//Find the window geometry in the case that the target area is below that of the maximum acceptable area for breaking up the window into smaller, taller windows.
		if (targetArea < maxAreaBreakUp) {
			//Divide up the rectangle into points on the bottom.
			if (wallLen > (distBreakup/2)) {
				var numDivisions = round(wallLen/distBreakup, 0);
			} else {
				var numDivisions = 1;
			}
			
			var btmDivPts = [[(wallLen/2),0,silHeightFinal]]
			var divDist = wallLen/numDivisions
			var totalDist = 0
			
			while (totalDist < wallLen) {
				totalDist += divDist
				btmDivPts.push([((wallLen/2)-totalDist),0,silHeightFinal])
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
				var distCentLine = lineCentPt[0][0] - lineCentPt[1][0]
			} else{
				var distCentLine = 20
			}
			var winLineBaseLength = winLinesStart[0][0][0] - winLinesStart[0][1][0]
			var winLineReqLength = (targetArea / winHeightFinal) / numDivisions
			var winLineScale = winLineReqLength / winLineBaseLength
			var windowWidth = winLineReqLength
			
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
			
		}
		
		//Find the window geometry in the case that the target area is above that of the maximum acceptable area for breaking up the window in which case we have to make one big window.
		if (targetArea > maxAreaBreakUp) {
			//Move the bottom curve of the window to the appropriate sill height.
			var maxSillHeight = (rectHeight*0.99) - (targetArea / (wallLen * 0.98))
			if (silHeightFinal > maxSillHeight){
				silHeightFinal = maxSillHeight
			}
			var winLinesStart = [[wallLen/2,0,silHeightFinal],[-wallLen/2,0,silHeightFinal]]
			
			//Scale the curve so that it is not touching the edges of the surface.
			var distCentLine = 20
			var winLineScale = 0.98
			var lineCentPt = [0,0,0]
			var newStartPt = [winLinesStart[0][0] - ((winLinesStart[0][0]-lineCentPt[0])*(1-winLineScale)), 0, winLinesStart[0][2]]
			var newEndPt = [winLinesStart[1][0] + ((lineCentPt[0]-winLinesStart[1][0])*(1-winLineScale)), 0, winLinesStart[0][2]]
			var winLinesStart = [newStartPt,newEndPt]
			windowWidth = newStartPt[0] - newEndPt[0]
			
			//Extrude the lines to create windows.
			var finalGlzCoords = [[]]
			winHeightFinal = (targetArea / (wallLen * 0.98))
			finalGlzCoords[0].push(winLinesStart[1])
			finalGlzCoords[0].push(winLinesStart[0])
			finalGlzCoords[0].push([winLinesStart[0][0], 0, winLinesStart[0][2] + winHeightFinal])
			finalGlzCoords[0].push([winLinesStart[1][0], 0, winLinesStart[1][2] + winHeightFinal])
		}
	} else {
		//Find the maximum acceptable width for breaking up the window into smaller, taller windows.
		var maxWidthBreakUp = wallLen/2
		
		//Find the window geometry in the case that the target width is below that of the maximum width acceptable area for breaking up the window into smaller windows.
		if (windowWidth < maxWidthBreakUp) {
			//Divide up the rectangle into points on the bottom.
			if (wallLen > (distBreakup/2)) {
				var numDivisions = round(wallLen/distBreakup, 0);
			} else {
				var numDivisions = 1;
			}
			
			if (numDivisions*windowWidth > wallLen){
				numDivisions = numDivisions = 1
			}
			console.log(numDivisions)
			if (((numDivisions*windowWidth)+ (numDivisions-1)*(distBreakup-windowWidth)) > wallLen){
				numDivisions = Math.floor(wallLen/distBreakup);
			}
			console.log(numDivisions)
			var btmDivPts = [[(wallLen/2),0,silHeightFinal]]
			var divDist = distBreakup
			var remainder = wallLen - (distBreakup*numDivisions)
			
			var totalDist = remainder/2
			
			while (totalDist < wallLen) {
				totalDist += divDist
				btmDivPts.push([((wallLen/2)-totalDist),0,silHeightFinal])
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
				var distCentLine = 20
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
		}
		//Find the window geometry in the case that the target width is above the maximum width acceptable area for breaking up the window into smaller windows.
		if (windowWidth >= maxWidthBreakUp) {
			if (windowWidth > wallLen){
				windowWidth = wallLen
			}
			var winLinesStart = [[wallLen/2,0,silHeightFinal],[-wallLen/2,0,silHeightFinal]]
			
			//Scale the curve so that it is not touching the edges of the surface.
			var distCentLine = 20
			var winLineScale = windowWidth / wallLen
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
		var glazingRatio = glzArea/(wallLen*rectHeight)
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
geo.calcViewFacs = function(srfCoords) {
    // Define a list to be filled up with view factors.
	var viewFact = []
	
	for (var i = 0; i < locationPts.length; i++) {
		var pt = locationPts[i]
        //Define variables to catch when we should be subtracting quadrants instead of summing them.
        var removeLowQuads = false
        var removeHiQuads = false
        var removeLeftQuads = false
        var removeRightQuads = false
        
        //Define the dimensions of the windows in relation to the point.
        var a = -srfCoords[0][0] //a = left
        var b = srfCoords[1][0] //b = right
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
        var wallView = (solid1+solid2+solid3+solid4)/12.566
		
        viewFact.push(wallView)
    }
    return viewFact
}


//Calculate all viewFactors from surfcace coordinates.
geo.computeAllViewFac = function(wallCoords, glzCoords){
	var fullWallViewFac = geo.calcViewFacs(wallCoords)
	var glzViewFac = []
	for (var i = 0; i < glzCoords.length; i++){
		var glzSrf = glzCoords[i]
		var viewFa = geo.calcViewFacs(glzSrf)
		if (i == 0){
			var glzViewFac = viewFa.slice()
		} else {
			for (var i = 0; i < viewFa.length; i++){
				var pt = viewFa[i]
				glzViewFac[i] = glzViewFac[i] + pt
			}
		}
	}
	var wallViewFac = []
	for (var i = 0; i < fullWallViewFac.length; i++){
		var wallView = fullWallViewFac[i]
		wallViewFac.push(wallView - glzViewFac[i])
	}
	
	//Return the coordinates of the wall.
	var r = {}
    r.wallViews = wallViewFac;
    r.glzViews = glzViewFac;
	return r
}
	