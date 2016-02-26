var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

var uVal = uVal || {}



//Define some dummy variables.
var minAcceptMRT = 20.87



// Functions that that help comput U-Values with an acceptable MRT threshold.
uVal.MRTCondtribOfOpaque = function(opaqueTemp, opaqueView, windowView, airTemp) {
    return (pow((airTemp+273),4)*(1-(opaqueView+windowView))) + (pow((opaqueTemp+273),4)*(opaqueView));
}
uVal.maxUOfMRT = function(minAcceptMRT, airTemp, outTemp, winViewFac, opaqueContrib, filmCoeff) {
    return (((airTemp+273) - (pow(abs(((pow((minAcceptMRT+273),4))-opaqueContrib)/winViewFac), 0.25))) * filmCoeff) / (airTemp-outTemp)
}


// Function that computes U-Values acceptable with MRT threshold.
uVal.maxAcceptMRT = function(opaqueViewFacs, winViewFacs, airTemp, outdoorTemp, wallRVal, filmCoeff){
	var opaqueTemp = uVal.comf.calcInteriorTemp(airTemp, outdoorTemp, wallRVal, 8.29)

	var opaqueContrib = []
	for (var i = 0; i < opaqueViewFacs.length; i++) {
	  var opaViewFac_i = opaqueViewFacs[i];
	  var winViewFac_i = winViewFacs[i];
	  var opaqContrib_i = uVal.MRTCondtribOfOpaque(opaqueTemp, opaViewFac_i, winViewFac_i, airTemp);
	  opaqueContrib.push(opaqContrib_i);
	}

	var UVals = []
	for (var i = 0; i < winViewFacs.length; i++) {
	  var winViewFac_i = winViewFacs[i];
	  var opaqContrib_i = opaqueContrib[i];
	  var UMax = uVal.maxUOfMRT(minAcceptMRT, airTemp, outdoorTemp, winViewFac_i, opaqContrib_i, filmCoeff);
	  if (filmCoeff > 5) {
		UVals.push(UMax);
	  } else {
		UVals.push(UMax/0.2);
	  }
	}
	return UVals
}
