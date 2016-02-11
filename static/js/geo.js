var round = Math.round;
var sin = Math.sin;
var atan = Math.atan;

var geo = geo || {}


//Define some default global variables that we do not want to change or expose in the interface.
var wallLen = 20 // The length of the exterior wall that we are observing in feet.
var seatH = 2 // The average height above the ground that the occupan is located in feet.
var numPts = 12 // The number of points to generate.
var facadeDist = []// The distance from the facade at which we are evaluating comfort.
var locationPts = [] // The pointlocations in relation to the facade where we are evaluating comfort.
for (var i = 0; i < numPts; i++) {
	facadeDist.push(i+1)
    locationPts.push([0,i+1,seatH])
}

// Function that generates the geometry of the windows based on the input window parameters.
geo.createGlazingForRect = function(rectHeight, glazingRatio, winHeight, silHeight, distBreakup) {
	//Check to be sure that the user is not assiging crazy values and, if so, set limits on them.
	if (glazingRatio > 0.95) {
		glazingRatio = 0.95;
	}
    
    //Define wall coordinates for the given wall length.
    var wallCoord = [[-wallLen/2,0,0],[wallLen/2,0,0],[wallLen/2,0,rectHeight],[-wallLen/2,0,rectHeight]]
    
    //Calculate the target area to make the glazing.
    var targetArea = 20* rectHeight * glazingRatio
    
    //Find the maximum acceptable area for breaking up the window into smaller, taller windows.
    var maxAreaBreakUp = (wallLen * 0.98) * winHeight
    
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
		
        var winLineBaseLength = winLinesStart[0][0][0] - winLinesStart[0][1][0]
        var winLineReqLength = (targetArea / winHeightFinal) / numDivisions
        var winLineScale = winLineReqLength / winLineBaseLength
        
		for (var i = 0; i < winLinesStart.length; i++) {
			var line = winLinesStart[i]
			var lineCenterPt = lineCentPt[i]
            var newStartPt = (line[0][0] - ((line[0][0]-lineCenterPt[0])*(1-winLineScale)), 0, line[0][2])
            var newEndPt = (line[1][0] + ((lineCenterPt[0]-line[1][0])*(1-winLineScale)), 0, line[0][2])
            winLinesStart[i] = [newStartPt, newEndPt]
        }
		
        //Extrude the lines to create windows.
        var finalGlzCoords = []
		for (var i = 0; i < winLinesStart.length; i++) {
			var line = winLinesStart[i]
            var windowCoord = []
            windowCoord.push(line[1])
            windowCoord.push(line[0])
            windowCoord.push((line[0][0], 0, line[0][2] + winHeightFinal))
            windowCoord.push((line[1][0], 0, line[1][2] + winHeightFinal))
            finalGlzCoords.push(windowCoord)
		}
    }
	
	//Find the window geometry in the case that the target area is above that of the maximum acceptable area for breaking up the window in which case we have to make one big window.
    if (targetArea > maxAreaBreakUp) {
        //Move the bottom curve of the window to the appropriate sill height.
        var maxSillHeight = (rectHeight*0.99) - (targetArea / (wallLen * 0.98))
        if (silHeightFinal < maxSillHeight){
            sillVec = silHeightFinal
        } else{
            sillVec = maxSillHeight
		}
        var winLinesStart = [[wallLen/2,0,sillVec],[-wallLen/2,0,sillVec]]
        
        //Scale the curve so that it is not touching the edges of the surface.
        var winLineScale = 0.98
        var lineCentPt = [0,0,0]
        var newStartPt = [winLinesStart[0][0] - ((winLinesStart[0][0]-lineCentPt[0])*(1-winLineScale)), 0, winLinesStart[0][2]]
        var newEndPt = [winLinesStart[1][0] + ((lineCentPt[0]-winLinesStart[1][0])*(1-winLineScale)), 0, winLinesStart[0][2]]
        var winLinesStart = [newStartPt,newEndPt]
        
        //Extrude the lines to create windows.
        var finalGlzCoords = [[]]
        var extruVec = (targetArea / (wallLen * 0.98))
        finalGlzCoords[0].push(winLinesStart[1])
        finalGlzCoords[0].push(winLinesStart[0])
        finalGlzCoords[0].push([winLinesStart[0][0], 0, winLinesStart[0][2] + extruVec])
        finalGlzCoords[0].push([winLinesStart[1][0], 0, winLinesStart[1][2] + extruVec])
    }
	
	//Return the coordinates of the wall.
	var r = {}
    r.wallCoords = wallCoord;
    r.glzCoords = finalGlzCoords;
	return r
}


//This formula for calculating solid angles and view factors to orthagonal surfaces comes from:
//Tredre, Barbara. (1965). Assessment of Mean Radiant Temperature in Indoor Envrionments.
//Britich Journal of Indutrial Medecine, 22, 58.
geo.calcViewFacs = function(srfCoords) {
    var viewFact = []
	for (var i = 0; i < locationPts.length; i++) {
		var pt = locationPts[i]
        //Define variables to catch when we should be subtracting quadrants instead of summing them.
        var removeLowQuads = false
        var removeHiQuads = false
        var removeLeftQuads = false
        var removeRightQuads = false
        
        //Define the dimensions of the windows in relation to the point.
        var a = -srfCoords[0][0]
        var b = srfCoords[1][0]
        var c = srfCoords[2][2]-pt[2]
        var d = pt[2]-srfCoords[1][2]
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
        if (b < 0){}
            b = -b;
            removeRightQuads = true;
		}
        
        //Compute the solid angles.
        var ac = a*c
        var bc = b*c
        var ad = a*d
        var bd = b*d
        var distLH = a/(sin(atan(a/z)))
        var distRH = b/(sin(atan(b/z)))
        
        var angP1 = atan(d/distLH)
        try {
			distP1 = d/(sin(angP1))
        } catch(err) {
			distP1 = 0
		}
        var angP2 = (atan((d+c)/distLH))-angP1
        try {
			distP2 = c/(sin(angP2))
        } catch(err) {
			distP2 = 0
		}
        
        angP3 = atan(d/distRH)
        try: distP3 = d/(sin(angP1))
        except: distP3 = 0
        angP4 = (atan((d+c)/distRH))-angP3
        try: distP4 = c/(sin(angP4))
        except: distP4 = 0
        
        try: viewP1 = atan(ad/(z*distP1))
        except: viewP1 = 0
        try: viewP2 = atan(ac/(z*distP2))
        except: viewP2 = 0
        try: viewP3 = atan(bd/(z*distP3))
        except: viewP3 = 0
        try: viewP4 = atan(bc/(z*distP4))
        except: viewP4 = 0
        
        //Make sure that the solid angles have the right sign for computing the full solid angle to the window.
        if removeLowQuads == True and removeLeftQuads: solid1, solid2, solid3, solid4 = -viewP1, -viewP2, -viewP3, viewP4
        elif removeLowQuads == True and removeRightQuads: solid1, solid2, solid3, solid4 = -viewP1, viewP2, -viewP3, -viewP4
        elif removeLowQuads == True: solid1, solid2, solid3, solid4 = -viewP1, viewP2, -viewP3, viewP4
        elif removeHiQuads == True and removeLeftQuads: solid1, solid2, solid3, solid4 = -viewP1, -viewP2, viewP3, -viewP4
        elif removeHiQuads == True and removeRightQuads: solid1, solid2, solid3, solid4 = viewP1, -viewP2, -viewP3, -viewP4
        elif removeHiQuads == True: solid1, solid2, solid3, solid4 = viewP1, -viewP2, viewP3, -viewP4
        elif removeLeftQuads == True: solid1, solid2, solid3, solid4 = -viewP1, -viewP2, viewP3, viewP4
        elif removeRightQuads == True: solid1, solid2, solid3, solid4 = viewP1, viewP2, -viewP3, -viewP4
        else: solid1, solid2, solid3, solid4 = viewP1, viewP2, viewP3, viewP4
        
        //Compute the view factors.
        wallView = (solid1+solid2+solid3+solid4)/12.566
        viewFact.push(wallView)
    
    return viewFact

