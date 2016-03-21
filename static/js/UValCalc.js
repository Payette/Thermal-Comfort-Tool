var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

var uVal = uVal || {}



// FUNCTIONS FOR CALCULATING THE MAX U-VALUE WITH PMV
// Function that converts a target PPD to a target PMV.
uVal.calcPMVtarget = function(targetPPD){
	var pmvGuess = 0
	var increment = 0.01
	var PPD = 100.0 - 95.0 * exp(-0.03353 * pow(pmvGuess, 4) - 0.2179 * pow(pmvGuess, 2))
	var eps = 0.01
	while (abs(targetPPD - PPD) > eps) {
		pmvGuess = pmvGuess + increment
		PPD = 100.0 - 95.0 * exp(-0.03353 * pow(pmvGuess, 4) - 0.2179 * pow(pmvGuess, 2))
	}
	return pmvGuess
}

//Function that computes the minimum acceptable MRT given PMV values and a PPD target.
uVal.calcMinAcceptMRT =  function (airTemp, windSpeed, relHumid, metRate, cloLevel, targetPPD){
	// Turn the target PPD into a target PMV.
	if (targetPPD == 10){
		var pmvlimit = 0.5
	} else if (targetPPD == 6){
		var pmvlimit = 0.220
	} else if (targetPPD == 15){
		var pmvlimit = 0.690
	} else if (targetPPD == 20){
		var pmvlimit = 0.84373
	} else if (targetPPD < 5.0){
		var pmvlimit = 0.0001
	} else{
        var pmvlimit = uVal.calcPMVtarget(targetPPD)
	}
	
	function mrtclos(target) {
		return function(mrt) {
			return comf.pmv(airTemp, mrt, windSpeed, relHumid, metRate, cloLevel, 0).pmv - target
		}
	}
	
	function solve(target) {
		
		var epsilon = 0.001 // tr precision
		var a = -50
		var b = 50
		var fn = mrtclos(target)
		var t = util.secant(a, b, fn, epsilon)
		if (isNaN(t)) {
			t = util.bisect(a, b, fn, epsilon, 0)
		}
		return t
	}
	
	return solve(-pmvlimit +0.01) // This is correct for error in the relation of PMV and PPD
}

// Functions that that help compute U-Values with an acceptable MRT threshold.
uVal.MRTCondtribOfOpaque = function(opaqueTemp, opaqueView, windowView, airTemp) {
    return (pow((airTemp+273),4)*(1-(opaqueView+windowView))) + (pow((opaqueTemp+273),4)*(opaqueView));
}
uVal.maxUOfMRT = function(minAcceptMRT, airTemp, outTemp, winViewFac, opaqueContrib, filmCoeff) {
    return (((airTemp+273) - (pow(abs(((pow((minAcceptMRT+273),4))-opaqueContrib)/winViewFac), 0.25))) * filmCoeff) / (airTemp-outTemp)
}

// Function that computes U-Values acceptable with MRT threshold.
uVal.uValMRT = function(opaqueViewFac, winViewFac, airTemp, outdoorTemp, opaqueRVal, filmCoeff, lowEmissivity, vel, relHumid, metRate, cloLevel, targetPPD){
	if (winViewFac > 0.01) {
		// Calculate the minimum acceptable MRT to satisfy the input PPD.
		var minAcceptMRT = uVal.calcMinAcceptMRT(airTemp, vel, relHumid, metRate, cloLevel, targetPPD)
		//console.log(comf.pmv(airTemp, minAcceptMRT, vel, relHumid, metRate, cloLevel, 0).ppd)
		//Calculate the temperature of the opaque wall and its contribution to the comfort.
		var opaqueTemp = comf.calcInteriorTemp(airTemp, outdoorTemp, opaqueRVal, 8.29)
		var opaqueContrib = uVal.MRTCondtribOfOpaque(opaqueTemp, opaqueViewFac, winViewFac, airTemp);
		
		// Calculate the minimum acceptable U-Values for the PMV model.
		var UMax = uVal.maxUOfMRT(minAcceptMRT, airTemp, outdoorTemp, winViewFac, opaqueContrib, filmCoeff);
		if (filmCoeff > 5) {
			var UVal = UMax;
		} else {
			var UVal = UMax/lowEmissivity;
		}
		
		if (UVal < 0) {
			UVal = 0
		}
	} else {
		// UValue function breaks at very small glazing view factors.
		// In this case, let's just check if PMV is comfortable and, if so, we will just return a very high U-Value.
		// Otherwise, we return a U-Value of zero.
		if (comf.pmv(airTemp, airTemp, vel, relHumid, metRate, cloLevel, 0).ppd > 10){
			var UVal = 0
		}else{
			var UVal = 10
		}
	}
	
	return UVal
}



// FUNCTIONS FOR CALCULATING THE MAX U-VALUE WITH DOWNDRAFT
uVal.calcAcceptWindSpd = function(PPD, airTemp){
    return ((((sqrt((PPD/13800)+0.000857))-0.0293)*(airTemp-13.7))+0.04)/0.8
}
uVal.deltaTAcceptClose =  function(windSpd, windowHgt){
    return (pow((windSpd/0.055),2))/windowHgt
}
uVal.deltaTAcceptMid = function(dist, windSpd, windowHgt){
    return pow((((dist+1.32)*windSpd)/0.095), 2)/windowHgt
}
uVal.deltaTAcceptFar =  function(windSpd, windowHgt){
    return (pow((windSpd/0.028),2))/windowHgt
}

uVal.uValDownD = function(PPDAccept, distToFacade, windowHgt, filmCoeff, airTemp, outdoorTemp){
	var distSI = distToFacade/3.28084
	var windAccept = uVal.calcAcceptWindSpd(PPDAccept, airTemp)
	
	if (distSI < 0.4){
		var deltT = uVal.deltaTAcceptClose(windAccept, windowHgt)
	} else if (distSI < 2){
		var deltT = uVal.deltaTAcceptMid(distSI, windAccept, windowHgt)
	} else{
		var deltT = uVal.deltaTAcceptFar(windAccept, windowHgt)
	}
	return ((deltT/(airTemp-outdoorTemp))*filmCoeff)
}



// FUNCTION THAT RETURNS THE LOWEST U-VALUE GIVEN COMFORT CRITERIA
uVal.uValFinal = function(opaqueViewFac, winViewFac, distToFacade, runDownCalc, windowHgt, indoorTemp, outTemp, wallRVal, intLowE, lowEmissivity, airSpeed, relHumid, metRate, cloLevel, targetPPD){
	// Convert window height to meters (yay for SI!!)
	var windowHgtSI = windowHgt/3.28084
	
	// Convert air velocity to m/s.
	var vel = airSpeed*0.00508
	
	// Convert R-Vals to SI.
	var opaqueRVal = wallRVal/5.678263337
	
	// Convert all Tempreatures ot Celcius.
	var airTemp = (indoorTemp-32) * 5 / 9
	var outdoorTemp = (outTemp-32) * 5 / 9
	
	//Assign variable for film coefficient and  based on interior Low-E coating.
	if (intLowE == true){
		var filmCoeff = comf.calcFilmCoeff(lowEmissivity)
	} else {
		var filmCoeff = 8.29
	}
	
	
	//Compute the required U-Value for PMV model.
	var uValMRT = uVal.uValMRT(opaqueViewFac, winViewFac, airTemp, outdoorTemp, opaqueRVal, filmCoeff, lowEmissivity, vel, relHumid, metRate, cloLevel, targetPPD)
	
	//Compute the required U-Value for the Downdraft model.
	if (runDownCalc== true) {
		var uValDownD = uVal.uValDownD(targetPPD, distToFacade, windowHgtSI, filmCoeff, airTemp, outdoorTemp)
	} else {
		var uValDownD = 10
	}
	
	if (uValDownD < uValMRT){
		var uValFinal = uValDownD/5.678263337
	} else{
		var uValFinal = uValMRT/5.678263337
	}
	
	return uValFinal
}




