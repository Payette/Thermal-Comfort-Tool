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
uVal.uValDownD = function(PPDAccept, distToFacade, windowHgt, filmCoeff, airTemp, outdoorTemp){
	var distSI = distToFacade/3.28084
	//var uValGuess = 0.2

	function uvalclos(target) {
		return function(uValGuess) {
			return comf.calcFulldonwDppd(distSI, windowHgt, filmCoeff, airTemp, outdoorTemp, uValGuess) - target
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

	return solve(PPDAccept)
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
	var uValMRT = uVal.uValMRT(opaqueViewFac, winViewFac, airTemp, outdoorTemp, opaqueRVal, filmCoeff, intLowE, lowEmissivity, vel, parseFloat(relHumid), parseFloat(metRate), parseFloat(cloLevel), parseFloat(targetPPD))

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
