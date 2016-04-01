var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

var uVal = uVal || {}



// FUNCTIONS FOR CALCULATING THE MAX U-VALUE WITH PMV
// Function that computes U-Values acceptable using a set of view factors and window properties.
uVal.uValMRT = function(opaqueViewFac, winViewFac, airTemp, outdoorTemp, opaqueRVal, filmCoeff, intLowE, lowEmissivity, vel, relHumid, metRate, cloLevel, targetPPD){

	function uvalclos(target) {
		return function(uValGuess) {
			return comf.calcFullMRTppd(winViewFac, opaqueViewFac, filmCoeff, airTemp, outdoorTemp, airTemp, opaqueRVal, uValGuess, intLowE, lowEmissivity, cloLevel, metRate, vel, relHumid).ppd - target
		}
	}

	function solve(target) {

		var epsilon = 0.01 // PPD precision
		var a = 0.001 // Start Lower Guess for U-Value
		var b = 20 // Start Upper Guess for U-Value
		var fn = uvalclos(target)
		var t = util.secant(a, b, fn, epsilon)
		if (isNaN(t)) {
			t = util.bisect(a, b, fn, epsilon, 0)
		}
		return t
	}

	var correctuVal = solve(targetPPD)
	if (correctuVal < 0) {
		correctuVal = 0
	}

	return correctuVal
}



// FUNCTIONS FOR CALCULATING THE MAX U-VALUE WITH DOWNDRAFT
uVal.uValDownD = function(PPDAccept, distToFacade, windowHgt, filmCoeff, airTemp, outdoorTemp, dwnPPDFac){
	function uvalclos(target) {
		return function(uValGuess) {
			return comf.calcFulldonwDppd(distToFacade, windowHgt, filmCoeff, airTemp, outdoorTemp, uValGuess, dwnPPDFac) - target
		}
	}
	function solve(target) {

		var epsilon = 0.01 // PPD precision
		var a = 0.01 // Start Lower Guess for U-Value
		var b = 20 // Start Upper Guess for U-Value
		var fn = uvalclos(target)
		var t = util.secant(a, b, fn, epsilon)
		if (isNaN(t)) {
			t = util.bisect(a, b, fn, epsilon, 0)
		}
		return t
	}

	return solve(PPDAccept)
}


// FUNCTION THAT RETURNS THE LOWEST U-VALUE GIVEN COMFORT CRITERIA
uVal.uValFinal = function(opaqueViewFac, winViewFac, distToFacade, dwnPPDFac, windowHgt, indoorTemp, outTemp, wallRVal, intLowE, lowEmissivity, airSpeed, relHumid, metRate, cloLevel, targetPPD){
	// Convert values to SI if we have to
	if (unitSys == "IP") {
  	var windowHgtSI = units.Ft2M(windowHgt);
  	var vel = units.fpm2mps(airSpeed);
  	var opaqueRVal = units.rIP2rSI(wallRVal);
  	var airTemp = units.F2C(indoorTemp);
  	var outdoorTemp = units.F2C(outTemp);
    var facadeDist = units.Ft2M(distToFacade);
  } else {
    var windowHgtSI = windowHgt;
  	var vel = airSpeed;
  	var opaqueRVal = wallRVal;
  	var airTemp = indoorTemp;
  	var outdoorTemp = outTemp;
    var facadeDist = distToFacade;
  }


	//Assign variable for film coefficient and  based on interior Low-E coating.
	if (intLowE == true){
		var filmCoeff = comf.calcFilmCoeff(lowEmissivity)
	} else {
		var filmCoeff = 8.29
	}

	//Compute the required U-Value for PMV model.
	var uValMRT = uVal.uValMRT(opaqueViewFac, winViewFac, airTemp, outdoorTemp, opaqueRVal, filmCoeff, intLowE, lowEmissivity, vel, parseFloat(relHumid), parseFloat(metRate), parseFloat(cloLevel), parseFloat(targetPPD))

	if (dwnPPDFac > 0) {
		var uValDownD = uVal.uValDownD(targetPPD, facadeDist, windowHgtSI, filmCoeff, airTemp, outdoorTemp, dwnPPDFac)
	} else {
		var uValDownD = 50
	}

	if (uValDownD < uValMRT){
		var uValFinal = uValDownD/5.678263337
	} else{
		var uValFinal = uValMRT/5.678263337
	}

	return uValFinal
}
