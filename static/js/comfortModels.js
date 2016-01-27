var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

var comf = comf || {}



//Define some dummy variables.
var airTemp = 22.2
var outdoorTemp = -9
var wallRVal = 5
var minAcceptMRT = 20.87
var filmCoeff = 8.29


// Functions that compute U-Values acceptable with MRT threshold.

comf.calcOpaqueTemp = function(airTemp, outTemp, wallR) {
    return airTemp-(((1/wallR)*(airTemp-outTemp))/8.29);
}

comf.MRTCondtribOfOpaque = function(opaqueTemp, opaqueView, windowView, airTemp) {
    return (pow((airTemp+273),4)*(1-(opaqueView+windowView))) + (pow((opaqueTemp+273),4)*(opaqueView));
}

comf.maxUOfMRT = function(minAcceptMRT, airTemp, outTemp, winViewFac, opaqueContrib, filmCoeff) {
    return (((airTemp+273) - (pow(abs(((pow((minAcceptMRT+273),4))-opaqueContrib)/winViewFac), 0.25))) * filmCoeff) / (airTemp-outTemp)
}


var opaqueTemp = comf.calcOpaqueTemp(airTemp, outdoorTemp, wallRVal)

var opaqueContrib = []
for (var i = 0; i < opaqueViewFacs.length; i++) {
	var opaViewFac_i = opaqueViewFacs[i];
	var winViewFac_i = winViewFacs[i]];
	var opaqContrib_i = comf.MRTCondtribOfOpaque(opaqueTemp, opaViewFac_i, winViewFac_i, airTemp);
	opaqueContrib.push(opaqContrib_i);
}


var UVals = []
for (var i = 0; i < winViewFacs.length; i++) {
	var winViewFac_i = winViewFacs[i]];
	var opaqContrib_i = opaqueContrib[i];
	var UMax = comf.maxUOfMRT(minAcceptMRT, airTemp, outdoorTemp, winViewFac_i, opaqContrib_i, filmCoeff);
	if (filmCoeff > 5) {
		UVals.push(UMax);
	} else {
		UVals.push(UMax/0.2);
	}
}

