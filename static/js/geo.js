var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;
var round = Math.round;

var geo = geo || {}


geo.createGlazingForRect = function(rectHeight, glazingRatio, winHeight, silHeight, distBreakup) {
    //Check to be sure that the user is not assiging crazy values and, if so, set limits on them.
	if (glazingRatio > 0.95) {
		glazingRatio = 0.95;
	}
	
	//Define a default wall length.
    var wallLen = 20
    
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

