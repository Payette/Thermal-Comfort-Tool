var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

var comf = comf || {}


// ***FUNCTIONS THAT COMPUTE GENERAL PHYSICAL PROPERTIES.

// Function that returns the interior surface temperature given the temperature gradient across it, surface resistance, and film coefficient.
comf.calcInteriorTemp = function(airTemp, outTemp, wallR, filmCoeff){
    return (airTemp-(((1/wallR)*(airTemp-outTemp))/filmCoeff))
}

// Function that computes a film coefficient based on emissivity and a dimensionless orientation.
// Derived from data published in ASHRAE Fundementals.
comf.calcFilmCoeff = function(glzSysEmiss){
	var dimHeatFlow = 0.5 // Indicates a vertically-oriented surface.  0 is a horizontal surface with upward heat flow.  1 is a horizontal surface with downward heat flow.
	var heatFlowFactor = (-12.443 * (pow(dimHeatFlow,3))) + (24.28 * (pow(dimHeatFlow,2))) - (16.898 * dimHeatFlow) + 8.1275
    var filmCoeff = (heatFlowFactor * dimHeatFlow) + (5.81176 * glzSysEmiss) + 0.9629
	return filmCoeff
}

// Functions that compute the temperature and speed of air from downdraft.
// These functions are taken from the following paper:
// Heiselberg, Per. (1994). Draught Risk From Cold Vertical Surfaces. Building and Envrionment, Vol. 29, No. 3, pp. 297-301.
comf.calcFloorAirTemp = function(airTemp, dist, deltaT){
    return airTemp - ((0.3-(0.034*dist))*deltaT)
}
comf.velMaxClose = function(deltaT, windowHgt){
    return (0.055*(sqrt(deltaT*windowHgt)))
}
comf.velMaxMid = function(dist, deltaT, windowHgt){
    return (0.095*((sqrt(deltaT*windowHgt))/(dist+1.32)))
}
comf.velMaxFar = function(deltaT, windowHgt){
    return (0.028*(sqrt(deltaT*windowHgt)))
}


// ***FUNCTIONS THAT COMPUTE COMFORT / PPD VALUES.

// Function that returns the radiant assymetry PPD due to a cold wall for a given interior temperature and average wall temperature.
comf.calcPPDFromAssym = function(interiorTemp, avgWallTemp){
    var delta = interiorTemp - avgWallTemp
    return (0.0006*(pow(delta, 3.8602)))
}

// Function that computes PPD given a certain downdraft velocity.
// This function is taken from this paper:
// Fanger, PO and Christensen, NK. (1986). Perception of Draught in Ventilated Spaces. rgonomics, 29:2, 215-235.
comf.calcPPDFromDowndraft = function(windSpd, airTemp){
    return (13800*(pow((((windSpd*0.8)-0.04)/(airTemp-13.7))+0.0293, 2) - 0.000857))
}
	
// Computes PPD given the 6 factors of PMV comfort.
// This javascript function for calculating PMV comes from the CBE Comfort Tool.
// Hoyt Tyler, Schiavon Stefano, Piccioli Alberto, Moon Dustin, and Steinfeld Kyle, 2013, CBE Thermal Comfort Tool.
// Center for the Built Environment, University of California Berkeley, http://cbe.berkeley.edu/comforttool/ 
comf.pmv = function(ta, tr, vel, rh, met, clo, wme) {
    // returns [pmv, ppd]
    // ta, air temperature (°C)
    // tr, mean radiant temperature (°C)
    // vel, relative air velocity (m/s)
    // rh, relative humidity (%) Used only this way to input humidity level
    // met, metabolic rate (met)
    // clo, clothing (clo)
    // wme, external work, normally around 0 (met)

    var pa, icl, m, w, mw, fcl, hcf, taa, tra, tcla, p1, p2, p3, p4,
    p5, xn, xf, eps, hcn, hc, tcl, hl1, hl2, hl3, hl4, hl5, hl6,
    ts, pmv, ppd, n;

    pa = rh * 10 * exp(16.6536 - 4030.183 / (ta + 235));

    icl = 0.155 * clo; //thermal insulation of the clothing in M2K/W
    m = met * 58.15; //metabolic rate in W/M2
    w = wme * 58.15; //external work in W/M2
    mw = m - w; //internal heat production in the human body
    if (icl <= 0.078) fcl = 1 + (1.29 * icl);
    else fcl = 1.05 + (0.645 * icl);

    //heat transf. coeff. by forced convection
    hcf = 12.1 * sqrt(vel);
    taa = ta + 273;
    tra = tr + 273;
    tcla = taa + (35.5 - ta) / (3.5 * icl + 0.1);

    p1 = icl * fcl;
    p2 = p1 * 3.96;
    p3 = p1 * 100;
    p4 = p1 * taa;
    p5 = 308.7 - 0.028 * mw + p2 * pow(tra / 100, 4);
    xn = tcla / 100;
    xf = tcla / 50;
    eps = 0.00015;

    n = 0;
    while (abs(xn - xf) > eps) {
        xf = (xf + xn) / 2;
        hcn = 2.38 * pow(abs(100.0 * xf - taa), 0.25);
        if (hcf > hcn) hc = hcf;
        else hc = hcn;
        xn = (p5 + p4 * hc - p2 * pow(xf, 4)) / (100 + p3 * hc);
        ++n;
        if (n > 150) {
            alert('Max iterations exceeded');
            return 1;
        }
    }

    tcl = 100 * xn - 273;

    // heat loss diff. through skin 
    hl1 = 3.05 * 0.001 * (5733 - (6.99 * mw) - pa);
    // heat loss by sweating
    if (mw > 58.15) hl2 = 0.42 * (mw - 58.15);
    else hl2 = 0;
    // latent respiration heat loss 
    hl3 = 1.7 * 0.00001 * m * (5867 - pa);
    // dry respiration heat loss
    hl4 = 0.0014 * m * (34 - ta);
    // heat loss by radiation  
    hl5 = 3.96 * fcl * (pow(xn, 4) - pow(tra / 100, 4));
    // heat loss by convection
    hl6 = fcl * hc * (tcl - ta);

    ts = 0.303 * exp(-0.036 * m) + 0.028;
    pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6);
    ppd = 100.0 - 95.0 * exp(-0.03353 * pow(pmv, 4.0) - 0.2179 * pow(pmv, 2.0));

    var r = {}
    r.pmv = pmv;
    r.ppd = ppd;

    return r
}



// ***FUNCTIONS THAT COMPUTE FINAL RESULTS.

//Calculates the MRT and radiant assymetry PPD given a set of interior conditions and points 
comf.getMRTandRadAssym = function(winViewFacs, opaqueViewFacs, winFilmCoeff, airTemp, outdoorTemp, indoorSrfTemp, wallRVal, windowUVal){
	var opaqueTemp = comf.calcInteriorTemp(airTemp, outdoorTemp, wallRVal, 8.29)
	var windowTemp = comf.calcInteriorTemp(airTemp, outdoorTemp, 1/windowUVal, winFilmCoeff)
	var MRT = []
	var radAssymPPD = []
	
	//Caclulate an MRT and the average temperature of the wall for the point
	for (var i = 0; i < winViewFacs.length; i++) {
		var winView = winViewFacs[i]
		var opaView = opaqueViewFacs[i]
		if (winFilmCoeff > 5){
			var ptMRT = winView*windowTemp + opaView*opaqueTemp + (1-winView-opaView)*indoorSrfTemp
			var avgWallTemp = (winView*windowTemp + opaView*opaqueTemp)/(winView+opaView)
		} else {
			var ptMRT = (winView*windowTemp*0.2 + opaView*opaqueTemp*0.9 + (1-winView-opaView)*indoorSrfTemp*0.9)/(winView*0.2 + (1-winView)*0.9)
			var avgWallTemp = (winView*windowTemp*0.2 + opaView*opaqueTemp*0.9)/(winView*0.2 + opaView*0.9)
		}
		MRT.push(ptMRT)
		radAssymPPD.push(comf.calcPPDFromAssym(indoorSrfTemp, avgWallTemp))
	}
	// Return the results.
	var r = {}
    r.mrt = MRT;
    r.ppd = radAssymPPD;
	return r 
}

// Calculates the PPD from downdraft given a set of interior conditions.
comf.getDowndraftPPD = function(distToFacade, windowHgt, filmCoeff, airTemp, outdoorTemp, windowUVal){
	// Get the difference between the surface temperature and the air
	var glassAirDelta = airTemp - comf.calcInteriorTemp(airTemp, outdoorTemp, 1/windowUVal, filmCoeff)
	
	// Calculate the PPD at each point.
	var PPD = []
	for (var i = 0; i < distToFacade.length; i++) {
		var dist = distToFacade[i]
		var distSI = dist/3.28084
		var downDraftTemp = comf.calcFloorAirTemp(airTemp, distSI, glassAirDelta)
		if (distSI < 0.4){
			var windSpd = comf.velMaxClose(glassAirDelta, windowHgt)
		} else if (distSI < 2){
			var windSpd = comf.velMaxMid(distSI, glassAirDelta, windowHgt)
		} else{
			var windSpd = comf.velMaxFar(glassAirDelta, windowHgt)
		}
		PPD.push(comf.calcPPDFromDowndraft(windSpd, downDraftTemp))
	}
	return PPD
}


// Constructs a dictionary of PPD and the limiting factors from a given set of interior conditions.
comf.getFullPPD = function(wallViewFac, glzViewFac, facadeDist, windowHgt, glzUVal, intLowE, lowEmissivity, wallRVal, indoorTemp, outTemp, radiantFloor, clo, met, airSpeed, rh){	
	// Convert window height to meters (yay for SI!!)
	var windowHgtSI = windowHgt/3.28084
	
	// Convert air velocity to m/s.
	var vel = airSpeed*0.00508
	
	// Convert U-Vals and R-Vals to SI.
	var windowUVal = glzUVal*5.678263337
	var opaqueRVal = wallRVal/5.678263337
	
	// Convert all Tempreatures ot Celcius.
	var airTemp = (indoorTemp-32) * 5 / 9
	var outdoorTemp = (outTemp-32) * 5 / 9
	
	// Assign variable for average indoor surface temperature based on specification of radiant floor vs. air system.
	if (radiantFloor == true) {
		var indoorSrfTemp = airTemp + 3
	} else {
		var indoorSrfTemp = airTemp
	}
	
	//Assign variable for film coefficient and  based on interior Low-E coating.
	if (intLowE == true){
		var winFilmCoeff = comf.calcFilmCoeff(lowEmissivity)
	} else {
		var winFilmCoeff = 8.29
	}
	
	
	// Get the radiant assymetry PPD results.
	var radAssymResult = comf.getMRTandRadAssym(glzViewFac, wallViewFac, winFilmCoeff, airTemp, outdoorTemp, indoorSrfTemp, opaqueRVal, windowUVal)
	var radAssymPPD = radAssymResult.ppd
	var MRTvals = radAssymResult.mrt
	
	// Get the MRT PPD results.
	var mrtPPD = []
	for (var i = 0; i < MRTvals.length; i++) {
		var MRT = MRTvals[i]
		var mrtResult = comf.pmv(airTemp, MRT, vel, rh, met, clo, 0)
		mrtPPD.push(mrtResult.ppd)
	}
	
	// Get the Downdraft PPD results.
	var downDPPD = comf.getDowndraftPPD(facadeDist, windowHgtSI, winFilmCoeff, airTemp, outdoorTemp, windowUVal)
	
	// Construct the dictionary of the PPD values with the governing factors.
	var myDataset = []
	for (var i = 0; i < radAssymPPD.length; i++) {
		var ptInfo = {}
		
		if (radAssymPPD[i] > mrtPPD[i] && radAssymPPD[i] > downDPPD[i]){
			ptInfo.dist = i+1;
			ptInfo.ppd = radAssymPPD[i];
			ptInfo.govfact = "asym";
		} else if (mrtPPD[i] > downDPPD[i]) {
			ptInfo.dist = i+1;
			ptInfo.ppd = mrtPPD[i];
			ptInfo.govfact = "mrt";
		} else {
			ptInfo.dist = i+1;
			ptInfo.ppd = downDPPD[i];
			ptInfo.govfact = "dwn";
		}
		myDataset.push(ptInfo)
	}
	
	return myDataset
}



