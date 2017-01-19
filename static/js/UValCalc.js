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
uVal.uValDownD = function(PPDAccept, distToFacade, windowHgt, sillHgt, filmCoeff, airTemp, outdoorTemp, dwnPPDFac, opaqueViewFac, winViewFac, opaqueRVal, intLowE, lowEmissivity, vel, relHumid, metRate, cloLevel){
	function uvalclos(target) {
		return function(uValGuess) {
			var startPMV = comf.calcFullMRTppd(winViewFac, opaqueViewFac, filmCoeff, airTemp, outdoorTemp, airTemp, opaqueRVal, uValGuess, intLowE, lowEmissivity, cloLevel, metRate, vel, relHumid).pmv;
			return comf.calcFulldonwDppd(distToFacade, startPMV, windowHgt+sillHgt, filmCoeff, airTemp, outdoorTemp, uValGuess, dwnPPDFac).ppd - target
		}
	}
	function solve(target) {

		var epsilon = 0.01 // PPD precision
		var a = 0.01 // Start Lower Guess for U-Value
		var b = 30 // Start Upper Guess for U-Value
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
uVal.uValFinal = function(opaqueViewFac, winViewFac, distToFacade, dwnPPDFac, windowHgt, sillHgt, indoorTemp, outTemp, wallRVal, intLowE, lowEmissivity, airSpeed, relHumid, metRate, cloLevel, targetPPD, targetPPD2){
	// Convert values to SI if we have to
	if (unitSys == "IP") {
  	var windowHgtSI = units.Ft2M(windowHgt);
		var sillHgtSI = units.Ft2M(sillHgt)
  	var vel = units.fpm2mps(airSpeed);
  	var opaqueRVal = units.rIP2rSI(wallRVal);
  	var airTemp = units.F2C(indoorTemp);
  	var outdoorTemp = units.F2C(outTemp);
    var facadeDist = units.Ft2M(distToFacade);
  } else {
    var windowHgtSI = windowHgt;
		var sillHgtSI = sillHgt
  	var vel = airSpeed;
  	var opaqueRVal = wallRVal;
  	var airTemp = parseFloat(indoorTemp);
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
	var uValMRT = uVal.uValMRT(opaqueViewFac, winViewFac, airTemp, parseFloat(outdoorTemp), parseFloat(opaqueRVal), filmCoeff, intLowE, lowEmissivity, vel, parseFloat(relHumid), parseFloat(metRate), parseFloat(cloLevel), parseFloat(targetPPD2))
	if (dwnPPDFac > 0) {
		var uValDownD = uVal.uValDownD(parseFloat(targetPPD), facadeDist, windowHgtSI, sillHgtSI, filmCoeff, airTemp, parseFloat(outdoorTemp), dwnPPDFac, opaqueViewFac, winViewFac, parseFloat(opaqueRVal), intLowE, lowEmissivity, vel, parseFloat(relHumid), parseFloat(metRate), parseFloat(cloLevel))
	} else {
		if (unitSys == "IP") {
			var uValDownD = 567.8263337
		} else {
			var uValDownD = 100
		}
	}

	if (uValDownD < uValMRT){
		var uValFinal = uValDownD
	} else{
		var uValFinal = uValMRT
	}

	if (unitSys == "IP") {
		uValFinal = uValFinal/5.678263337
	}

	return uValFinal
}
