var pow = Math.pow;
var exp = Math.exp;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;
var logarithm = Math.log;
var round = Math.round;

var comf = comf || {}


//***FUNCTIONS THAT COMPUTE GENERAL PHYSICAL PROPERTIES.***

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
// These functions are originally from the following paper:
// Heiselberg, Per. (1994). Draught Risk From Cold Vertical Surfaces. Building and Envrionment, Vol. 29, No. 3, pp. 297-301.
//The specific ones here come from CFD validations of the Heiselberg model, published in this paper:
//Manz, H. and Frank, T. (2003). "Analysis of Thermal Comfort near Cold Vertical Surfaces by Means of Computational Fluid Dynamics." Indoor Built Environment. 13: 233-242.
comf.calcFloorAirTemp = function(airTemp, dist, deltaT){
    return airTemp - ((0.3-(0.034*dist))*deltaT)
}
comf.velMaxClose = function(deltaT, windowHgt){
    return (0.083*(sqrt(deltaT*windowHgt)))
}
comf.velMaxMid = function(dist, deltaT, windowHgt){
    return (0.143*((sqrt(deltaT*windowHgt))/(dist+1.32)))
}
comf.velMaxFar = function(deltaT, windowHgt){
    return (0.043*(sqrt(deltaT*windowHgt)))
}

// Function that calculates dewpoint temperature from dry bulb and relative humidity.
// This function uses the "Method for obtaining wet-bulb temperatures by modifying the psychrometric formula"
// created by J. Sullivan and L. D. Sanders (Center for Experiment Design and Data Analysis).
// NOAA - National Oceanic and Atmospheric Administration
// Special thanks goes to the authors of the online wet-bulb temperature calculator
// http://www.srh.noaa.gov/epz/?n=wxcalc_rh
comf.dewptCalc = function(dbTemp, RH){
    var es = 6.112 * Math.exp((17.67 * dbTemp) / (dbTemp + 243.5))
    var e = (es * RH) / 100
    var Td = (243.5 * logarithm(e / 6.112)) / (17.67 - logarithm(e / 6.112))
    var dpTemp = round(Td,2)
    return dpTemp
}


// Function that calculates saturation pressure in torr.
comf.FindSaturatedVaporPressureTorr = function(T) {
    //calculates Saturated Vapor Pressure (Torr) at Temperature T  (C)
    return exp(18.6686 - 4030.183 / (T + 235.0));
}



//***FUNCTIONS THAT COMPUTE COMFORT / PPD VALUES USING SETS OF CONDITIONS.***

// Function that returns the radiant assymetry PPD due to a cold wall for a given interior temperature and average wall temperature.
comf.calcPPDFromAssym = function(interiorTemp, avgWallTemp){
    var delta = interiorTemp - avgWallTemp
    return (0.0006*(pow(delta, 3.8602)))
}

// Function that computes PPD from downdraft given a certain downdraft velocity and temperature.
// It is based on studies where occupants had cold air blown on the back of their neck.
// This function is no longer used and has been replaced with the new downdraft model below this function (downdraft at foot level)
// This function is taken from this paper:
// Fanger, PO and Christensen, NK. (1986). Perception of Draught in Ventilated Spaces. Ergonomics, 29:2, 215-235.
comf.calcPPDFromDowndraftOLD = function(windSpd, airTemp){
    if (windSpd > 0.7 || airTemp < 15) {
      return 9999
    } else {
      return (13800*(pow((((windSpd*0.8)-0.04)/(airTemp-13.7))+0.0293, 2) - 0.000857))
    }
}

// Function that computes PPD from downdraft given a certain downdraft velocity and PMV of the occupant.
// It is based on studies where occupants had cold air blown on their bare ankles.
// This function is taken from this paper:
// Stefano Schiavon, Donghyun Rim, Wilmer Pasut, William W Nazaroff. “Sensation of draft at uncovered ankles for women exposed to displacement ventilation and underfloor air distribution systems.” Building and Environment, 96 (2016): 228–236.
comf.calcPPDFromDowndraft = function(airSpd, pmv){
	if (airSpd > 0.7) {
      return 9999
    } else {
	  return 100 * ((exp(-2.58 + (3.05*airSpd) - (1.06*pmv)))/(1 + (exp(-2.58 + (3.05*airSpd) - (1.06*pmv)))))
	}
}


// The following 3 functions compute PPD given the 6 factors of PMV comfort.
// This javascript function for calculating PMV comes from the CBE Comfort Tool.
// Hoyt Tyler, Schiavon Stefano, Piccioli Alberto, Moon Dustin, and Steinfeld Kyle, 2013, CBE Thermal Comfort Tool.
// Center for the Built Environment, University of California Berkeley, http://cbe.berkeley.edu/comforttool/
comf.still_air_threshold = 0.1; // m/s

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

comf.pierceSET = function(ta, tr, vel, rh, met, clo, wme) {

    var TempSkinNeutral, TempBodyNeutral, SkinBloodFlowNeutral, TempSkin, TempCore,
    SkinBloodFlow, MSHIV, ALFA, ESK, PressureInAtmospheres, TIMEH, LTIME, DELTA, RCL,
    FACL, LR, RM, M, WCRIT, ICL, CHC, CHCA, CHCV, CHR, CTC, TOP, TCL, DRY, HFCS, ERES,
    CRES, SCR, SSK, TCSK, TB, SKSIG, WARMS, COLDS, WARMC, COLDC, CRSIG, WARMB, COLDB,
    REGSW, BDSIG, REA, RECL, EMAX, PRSW, PWET, EDIF, RA, TCL_OLD, TCCR, DTSK, DTCR, ERSW,
    X, X_OLD, CHCS, TIM, STORE, HSK, RN, ECOMF, EREQ, HD, HE, W, PSSK, CHRS, CTCS,
    RCLOS, RCLS, FACLS, FCLS, IMS, ICLS, RAS, REAS, RECLS, HD_S, HE_S;

    var VaporPressure = rh * comf.FindSaturatedVaporPressureTorr(ta) / 100;
    var AirVelocity = max(vel, 0.1);
    var KCLO = 0.25;
    var BODYWEIGHT = 69.9;
    var BODYSURFACEAREA = 1.8258;
    var METFACTOR = 58.2;
    var SBC = 0.000000056697; // Stefan-Boltzmann constant (W/m2K4)
    var CSW = 170;
    var CDIL = 120;
    var CSTR = 0.5;

    TempSkinNeutral = 33.7; //setpoint (neutral) value for Tsk
    TempCoreNeutral = 36.49; //setpoint value for Tcr
    TempBodyNeutral = 36.49; //setpoint for Tb (.1*TempSkinNeutral + .9*TempCoreNeutral)
    SkinBloodFlowNeutral = 6.3; //neutral value for SkinBloodFlow

    //INITIAL VALUES - start of 1st experiment
    TempSkin = TempSkinNeutral;
    TempCore = TempCoreNeutral;
    SkinBloodFlow = SkinBloodFlowNeutral;
    MSHIV = 0.0;
    ALFA = 0.1;
    ESK = 0.1 * met;

    //Start new experiment here (for graded experiments)
    //UNIT CONVERSIONS (from input variables)

    var p = 101325 / 1000; // TH : interface?

    PressureInAtmospheres = p * 0.009869;
    LTIME = 60.0;
    TIMEH = LTIME / 60.0;
    RCL = 0.155 * clo;
    // AdjustICL(RCL, Conditions);  TH: I don't think this is used in the software

    FACL = 1.0 + 0.15 * clo; //% INCREASE IN BODY SURFACE AREA DUE TO CLOTHING
    LR = 2.2 / PressureInAtmospheres; //Lewis Relation is 2.2 at sea level
    RM = met * METFACTOR;
    M = met * METFACTOR;

    if (clo <= 0) {
        WCRIT = 0.38 * pow(AirVelocity, -0.29);
        ICL = 1.0;
    } else {
        WCRIT = 0.59 * pow(AirVelocity, -0.08);
        ICL = 0.45;
    }

    CHC = 3.0 * pow(PressureInAtmospheres, 0.53);
    CHCV = 8.600001 * pow((AirVelocity * PressureInAtmospheres), 0.53);
    CHC = max(CHC, CHCV);

    //initial estimate of Tcl
    CHR = 4.7;
    CTC = CHR + CHC;
    RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
    TOP = (CHR * tr + CHC * ta) / CTC;
    TCL = TOP + (TempSkin - TOP) / (CTC * (RA + RCL));

    // ========================  BEGIN ITERATION
    //
    // Tcl and CHR are solved iteratively using: H(Tsk - To) = CTC(Tcl - To),
    //  where H = 1/(Ra + Rcl) and Ra = 1/Facl*CTC
    //

    TCL_OLD = TCL;
    var flag = true;
    for (TIM = 1; TIM <= LTIME; TIM++) {
        do {
            if (flag) {
                TCL_OLD = TCL;
                CHR = 4.0 * SBC * pow(((TCL + tr) / 2.0 + 273.15), 3.0) * 0.72;
                CTC = CHR + CHC;
                RA = 1.0 / (FACL * CTC); //resistance of air layer to dry heat transfer
                TOP = (CHR * tr + CHC * ta) / CTC;
            }
            TCL = (RA * TempSkin + RCL * TOP) / (RA + RCL);
            flag = true;
        } while (abs(TCL - TCL_OLD) > 0.01);
        flag = false;
        DRY = (TempSkin - TOP) / (RA + RCL);
        HFCS = (TempCore - TempSkin) * (5.28 + 1.163 * SkinBloodFlow);
        ERES = 0.0023 * M * (44.0 - VaporPressure);
        CRES = 0.0014 * M * (34.0 - ta);
        SCR = M - HFCS - ERES - CRES - wme;
        SSK = HFCS - DRY - ESK;
        TCSK = 0.97 * ALFA * BODYWEIGHT;
        TCCR = 0.97 * (1 - ALFA) * BODYWEIGHT;
        DTSK = (SSK * BODYSURFACEAREA) / (TCSK * 60.0); //deg C per minute
        DTCR = SCR * BODYSURFACEAREA / (TCCR * 60.0); //deg C per minute
        TempSkin = TempSkin + DTSK;
        TempCore = TempCore + DTCR;
        TB = ALFA * TempSkin + (1 - ALFA) * TempCore;
        SKSIG = TempSkin - TempSkinNeutral;
        WARMS = (SKSIG > 0) * SKSIG;
        COLDS = ((-1.0 * SKSIG) > 0) * (-1.0 * SKSIG);
        CRSIG = (TempCore - TempCoreNeutral);
        WARMC = (CRSIG > 0) * CRSIG;
        COLDC = ((-1.0 * CRSIG) > 0) * (-1.0 * CRSIG);
        BDSIG = TB - TempBodyNeutral;
        WARMB = (BDSIG > 0) * BDSIG;
        COLDB = ((-1.0 * BDSIG) > 0) * (-1.0 * BDSIG);
        SkinBloodFlow = (SkinBloodFlowNeutral + CDIL * WARMC) / (1 + CSTR * COLDS);
        if (SkinBloodFlow > 90.0) SkinBloodFlow = 90.0;
        if (SkinBloodFlow < 0.5) SkinBloodFlow = 0.5;
        REGSW = CSW * WARMB * exp(WARMS / 10.7);
        if (REGSW > 500.0) REGSW = 500.0;
        ERSW = 0.68 * REGSW;
        REA = 1.0 / (LR * FACL * CHC); //evaporative resistance of air layer
        RECL = RCL / (LR * ICL); //evaporative resistance of clothing (icl=.45)
        EMAX = (comf.FindSaturatedVaporPressureTorr(TempSkin) - VaporPressure) / (REA + RECL);
        PRSW = ERSW / EMAX;
        PWET = 0.06 + 0.94 * PRSW;
        EDIF = PWET * EMAX - ERSW;
        ESK = ERSW + EDIF;
        if (PWET > WCRIT) {
            PWET = WCRIT;
            PRSW = WCRIT / 0.94;
            ERSW = PRSW * EMAX;
            EDIF = 0.06 * (1.0 - PRSW) * EMAX;
            ESK = ERSW + EDIF;
        }
        if (EMAX < 0) {
            EDIF = 0;
            ERSW = 0;
            PWET = WCRIT;
            PRSW = WCRIT;
            ESK = EMAX;
        }
        ESK = ERSW + EDIF;
        MSHIV = 19.4 * COLDS * COLDC;
        M = RM + MSHIV;
        ALFA = 0.0417737 + 0.7451833 / (SkinBloodFlow + 0.585417);
    }

    //Define new heat flow terms, coeffs, and abbreviations
    STORE = M - wme - CRES - ERES - DRY - ESK; //rate of body heat storage

    HSK = DRY + ESK; //total heat loss from skin
    RN = M - wme; //net metabolic heat production
    ECOMF = 0.42 * (RN - (1 * METFACTOR));
    if (ECOMF < 0.0) ECOMF = 0.0; //from Fanger
    EREQ = RN - ERES - CRES - DRY;
    EMAX = EMAX * WCRIT;
    HD = 1.0 / (RA + RCL);
    HE = 1.0 / (REA + RECL);
    W = PWET;
    PSSK = comf.FindSaturatedVaporPressureTorr(TempSkin);
    // Definition of ASHRAE standard environment... denoted "S"
    CHRS = CHR;
    if (met < 0.85) {
        CHCS = 3.0;
    } else {
        CHCS = 5.66 * pow(((met - 0.85)), 0.39);
        if (CHCS < 3.0) CHCS = 3.0;
    }
    CTCS = CHCS + CHRS;
    RCLOS = 1.52 / ((met - wme / METFACTOR) + 0.6944) - 0.1835;
    RCLS = 0.155 * RCLOS;
    FACLS = 1.0 + KCLO * RCLOS;
    FCLS = 1.0 / (1.0 + 0.155 * FACLS * CTCS * RCLOS);
    IMS = 0.45;
    ICLS = IMS * CHCS / CTCS * (1 - FCLS) / (CHCS / CTCS - FCLS * IMS);
    RAS = 1.0 / (FACLS * CTCS);
    REAS = 1.0 / (LR * FACLS * CHCS);
    RECLS = RCLS / (LR * ICLS);
    HD_S = 1.0 / (RAS + RCLS);
    HE_S = 1.0 / (REAS + RECLS);

    // SET* (standardized humidity, clo, Pb, and CHC)
    // determined using Newton//s iterative solution
    // FNERRS is defined in the GENERAL SETUP section above

    DELTA = 0.0001;
    var ERR1, ERR2;
    var dx = 100.0;
    X_OLD = TempSkin - HSK / HD_S; //lower bound for SET
    while (abs(dx) > 0.01) {
        ERR1 = (HSK - HD_S * (TempSkin - X_OLD) - W * HE_S * (PSSK - 0.5 * comf.FindSaturatedVaporPressureTorr(X_OLD)));
        ERR2 = (HSK - HD_S * (TempSkin - (X_OLD + DELTA)) - W * HE_S * (PSSK - 0.5 * comf.FindSaturatedVaporPressureTorr((X_OLD + DELTA))));
        X = X_OLD - DELTA * ERR1 / (ERR2 - ERR1);
        dx = X - X_OLD;
        X_OLD = X;
    }
    return X;
}

comf.pmvElevatedAirspeed = function(ta, tr, vel, rh, met, clo, wme) {
    var r = {}
    var set = 0
    if (vel <= comf.still_air_threshold) {
        var pmv = comf.pmv(ta, tr, vel, rh, met, clo, wme)
        var ta_adj = ta
        var ce = 0
    } else {
        var set = comf.pierceSET(ta, tr, vel, rh, met, clo, wme);
        var ce_l = 0;
        var ce_r = 40;
        var eps = 0.001;  // precision of ce
        var fn = function(ce){
            return (set - comf.pierceSET(ta - ce, tr - ce, comf.still_air_threshold, rh, met, clo, wme));
        };
        var ce = util.secant(ce_l, ce_r, fn, eps);
        if (isNaN(ce)) {
            ce = util.bisect(ce_l, ce_r, fn, eps, 0);
        }
        var pmv = comf.pmv(ta - ce, tr - ce, comf.still_air_threshold, rh, met, clo, wme);
    }
    r.pmv = pmv.pmv;
    r.ppd = pmv.ppd;
    r.ta_adj = ta - ce;
    r.tr_adj = tr - ce;
    r.cooling_effect = ce;
    return r
}




// ***FUNCTIONS THAT COMPUTE COMFORT / PPD VALUES FROM FACADE PROPERTIES.***
//Computes the PPD from MRT given a set of window properties.
comf.calcFullMRTppd = function(winView, opaView, winFilmCoeff, airTemp, outdoorTemp, indoorSrfTemp, wallRVal, windowUVal, intLowE, lowEmissivity, clo, met, vel, rh){
  //Compute the inside temperature of the glass and wall.
  var opaqueTemp = comf.calcInteriorTemp(airTemp, outdoorTemp, wallRVal+(1/8.29), 8.29)
	var windowTemp = comf.calcInteriorTemp(airTemp, outdoorTemp, 1/windowUVal, winFilmCoeff)

  var winTKelvin = windowTemp + 273.15
  var opaqueTKelvin = opaqueTemp + 273.15
  var indoorTKelvin = indoorSrfTemp + 273.15

  // Compute the mrt.
  if (intLowE != true){
    var ptMRT = pow(winView*(pow(winTKelvin,4)) + opaView*(pow(opaqueTKelvin,4)) + (1-winView-opaView)*(pow(indoorTKelvin,4)), 0.25) - 273.15
  } else {
    var ptMRT = pow(((winView*(pow(winTKelvin,4)*lowEmissivity) + (opaView*(pow(opaqueTKelvin,4))*0.9) + ((1-winView-opaView)*(pow(indoorTKelvin,4))*0.9))/(winView*lowEmissivity + (1-winView)*0.9)), 0.25) - 273.15
  }

  //Compute the PMV at the point
  var mrtResult = comf.pmvElevatedAirspeed(airTemp, ptMRT, vel, rh, met, clo, 0)
	if (mrtResult.pmv > 0){
		var finalMRTPPD = 5
  } else {
		var finalMRTPPD = mrtResult.ppd
  }

  var r = {}
  r.mrt = ptMRT;
  r.ppd = finalMRTPPD;
	r.windowTemp = windowTemp;
	r.pmv = mrtResult.pmv

  return r
}

// Function that computes downdraft PPD given window dimensions and properties.
comf.calcFulldonwDppd = function(distSI, mrtpmv, windowHeadHgt, filmCoeff, airTemp, outdoorTemp, windowUVal, dwnPPDFac){
  // Get the difference between the surface temperature and the air
	var glassAirDelta = airTemp - comf.calcInteriorTemp(airTemp, outdoorTemp, 1/windowUVal, filmCoeff)
  // Get the temperature of the downdraft.
  var downDraftTemp = comf.calcFloorAirTemp(airTemp, distSI, glassAirDelta)
  if (distSI < 0.4){
    var windSpd = comf.velMaxClose(glassAirDelta, windowHeadHgt)
  } else if (distSI < 2){
    var windSpd = comf.velMaxMid(distSI, glassAirDelta, windowHeadHgt)
  } else{
    var windSpd = comf.velMaxFar(glassAirDelta, windowHeadHgt)
  }
  var finalDDppd = comf.calcPPDFromDowndraft(windSpd, mrtpmv) * dwnPPDFac
  r = {}
  r.ppd = finalDDppd
  r.airSpd = windSpd
  r.downTemp = downDraftTemp

  return r
}




// ***FUNCTIONS THAT COMPUTE CALCUALTE COMFORT FOR LISTS OF POINTS IN SPACE.***
//Calculates the MRT and radiant assymetry PPD given a set of interior conditions and points
comf.getMRTPPD = function(winViewFacs, opaqueViewFacs, winFilmCoeff, airTemp, outdoorTemp, indoorSrfTemp, wallRVal, windowUVal, intLowE, lowEmissivity, clo, met, airSpeed, rh){
	var MRT = []
	var mrtPPD = []
	var mrtPMV = []
	//Caclulate an MRT and the average temperature of the wall for the point
	for (var i = 0; i < winViewFacs.length; i++) {
		var winView = winViewFacs[i]
		var opaView = opaqueViewFacs[i]
		var ptValue = comf.calcFullMRTppd(winView, opaView, winFilmCoeff, airTemp, outdoorTemp, indoorSrfTemp, wallRVal, windowUVal, intLowE, lowEmissivity, clo, met, airSpeed, rh)
		MRT.push(ptValue.mrt)
		mrtPPD.push(ptValue.ppd)
		mrtPMV.push(ptValue.pmv)
		var windowTemp = ptValue.windowTemp
	}

	// Return the results.
	var r = {}
  r.mrt = MRT;
  r.ppd = mrtPPD;
	r.pmv = mrtPMV;
	r.windowTemp = windowTemp;

	return r
}


// Calculates the PPD from downdraft given a set of interior conditions.
comf.getDowndraftPPD = function(distToFacade, mrtPMV, windowHgt, sillHgt, filmCoeff, airTemp, outdoorTemp, windowUVal, dwnPPDFac){
	// Calculate the PPD at each point.
	var PPD = []
  var DDSpd = []
  var DDTemp = []
	for (var i = 0; i < distToFacade.length; i++) {
		var ddPPD = comf.calcFulldonwDppd(distToFacade[i], mrtPMV[i], windowHgt+sillHgt, filmCoeff, airTemp, outdoorTemp, windowUVal, dwnPPDFac)
		PPD.push(ddPPD.ppd)
    DDSpd.push(ddPPD.airSpd)
    DDTemp.push(ddPPD.downTemp)
	}
  r = {}
  r.ppd = PPD
  r.ddSpd = DDSpd
  r.ddTemp = DDTemp
	return r
}




/// ***FUNCTION THAT COMPUTE FINAL RESULTS THE INTERFACE.***
// Constructs a dictionary of PPD and the limiting factors from a given set of interior conditions.
comf.getFullPPD = function(wallViewFac, glzViewFac, facadeDist, windIntervals, occDistToWallCenter, windowHgt, sillHgt, glzUVal, intLowE, lowEmissivity, wallRVal, indoorTemp, outTemp, radiantFloor, clo, met, airSpeed, rh, ppdValue, ppdValue2){
  if (unitSys == "IP") {
  	var windowHgtSI = units.Ft2M(windowHgt)
    var sillHgtSI = units.Ft2M(sillHgt)
  	var vel = units.fpm2mps(airSpeed)
  	var windowUVal = units.uIP2uSI(glzUVal)
  	var opaqueRVal = units.rIP2rSI(wallRVal)
  	var airTemp = units.F2C(indoorTemp)
  	var outdoorTemp = units.F2C(outTemp)
    var facadeDistSI = []
    for (var i = 0; i < facadeDist.length; i++) {
  		var distSI = units.Ft2M(facadeDist[i])
      facadeDistSI.push(distSI)
    }
  } else {
    var windowHgtSI = windowHgt
    var sillHgt = sillHgt
  	var vel = airSpeed
  	var windowUVal = glzUVal
  	var opaqueRVal = wallRVal
  	var airTemp = indoorTemp
  	var outdoorTemp = outTemp
    var facadeDistSI = facadeDist
  }

	// Assign variable for average indoor surface temperature based on specification of radiant floor vs. air system.
	if (radiantFloor == true) {
		var indoorSrfTemp = airTemp + 1.5
		//airTemp = airTemp - 1.5
	} else {
		var indoorSrfTemp = airTemp
	}

	//Assign variable for film coefficient and  based on interior Low-E coating.
	if (intLowE == true){
		var winFilmCoeff = comf.calcFilmCoeff(lowEmissivity)
	} else {
		var winFilmCoeff = 8.29
	}

	// Get the radiant assymetry PPD results and the MRT values.
	var mrtPPDResult = comf.getMRTPPD(glzViewFac, wallViewFac, winFilmCoeff, airTemp, outdoorTemp, indoorSrfTemp, opaqueRVal, windowUVal, intLowE, lowEmissivity, clo, met, vel, rh)
	var windowTemp = mrtPPDResult.windowTemp
	var mrtPPD = mrtPPDResult.ppd
	var mrtPMV = mrtPPDResult.pmv

	// Determine whether the occupant is in front of a window such that they can expereince downdraft.
	var runDownCalc = false
	for (var i = 0; i < windIntervals[0].length; i++) {
		if (occDistToWallCenter >= windIntervals[0][i] && occDistToWallCenter <= windIntervals[1][i]){
			runDownCalc = true
		}
	}

  // If the occupant is not directly in front of the window, check to see if they are close to the window.
  // In this case, multpily downdraft results by a factor based on proximity.
  if (runDownCalc == false) {
    var distOccToNearWind = []
    //Find the distance to the closest window.
    for (var i = 0; i < windIntervals[0].length; i++){
      distOccToNearWind.push(abs(windIntervals[0][i] - occDistToWallCenter))
    }
    for (var i = 0; i < windIntervals[1].length; i++){
      distOccToNearWind.push(abs(windIntervals[1][i] - occDistToWallCenter))
    }
    distOccToNearWind.sort()
    var closestDist = distOccToNearWind[0]

    // Convert this closest distance into a factor that will be multiplied by the downdraftPPD
    if (unitSys == "IP") {
      var rampDwnDist = 3
    } else {
      var rampDwnDist = 0.9144
    }

    if (closestDist < rampDwnDist){
      var dwnPPDFac = 0.75*((rampDwnDist - closestDist)/rampDwnDist) + 0.25
    } else {
      var dwnPPDFac = 0.25
    }
    //var dwnPPDFac = 0
  } else {
    var dwnPPDFac = 1
  }

	// Get the Downdraft PPD results.
	downDresult = comf.getDowndraftPPD(facadeDistSI, mrtPMV, windowHgtSI, sillHgtSI, winFilmCoeff, airTemp, outdoorTemp, windowUVal, dwnPPDFac)
  downDPPD = downDresult.ppd
  downDSpeed = downDresult.ddSpd
  downDTemper = downDresult.ddTemp

	// Construct the dictionary of the PPD values with the governing factors for the graph.
	var myDataset = []
	for (var i = 0; i < mrtPPD.length-1; i++) {
		var ptInfo = {}
    // Distance from Facade
    if (unitSys == "IP") {
      ptInfo.dist = facadeDist[i]
    } else {
      ptInfo.dist = facadeDistSI[i];
    }

    // Mean Radiant Temperature
    if (unitSys == "IP") {
      ptInfo.mrt = units.C2F(mrtPPDResult.mrt[i])
    } else {
      ptInfo.mrt = mrtPPDResult.mrt[i];
    }

    // Glazing View factor, PMV
    ptInfo.glzfac = glzViewFac[i] * 100
    ptInfo.pmv = mrtPMV[i]

    // Downdraft Speed, Temperature
    if (unitSys == "IP") {
      ptInfo.dwnSpd = units.mps2fpm(downDSpeed[i])
    } else {
      ptInfo.dwnSpd = downDSpeed[i]
    }
    if (unitSys == "IP") {
      ptInfo.dwnTemp = units.C2F(downDTemper[i])
    } else {
      ptInfo.dwnTemp = downDTemper[i]
    }

    // PPD
    ptInfo.ppd = downDPPD[i];
    ptInfo.mrtppd = mrtPPD[i];
    if (mrtPPD[i] > ppdValue2 || downDPPD[i] > ppdValue) {
      ptInfo.comf = "False"
    } else {
      ptInfo.comf = "True"
    }

		myDataset.push(ptInfo)
	}

	// Construct a dictionary of PPD for the occupant location.
	var occPtInfo = {}
	occPtInfo.dist = facadeDist[i]
  if (unitSys == "IP") {
    occPtInfo.mrt = units.C2F(mrtPPDResult.mrt[i])
  } else {
    occPtInfo.mrt = mrtPPDResult.mrt[i]
  }
  occPtInfo.glzfac = glzViewFac[i] * 100
  occPtInfo.pmv = mrtPMV[i]
  if (unitSys == "IP") {
    occPtInfo.dwnSpd = units.mps2fpm(downDSpeed[i])
  } else {
    occPtInfo.dwnSpd = downDSpeed[i]
  }
  if (unitSys == "IP") {
    occPtInfo.dwnTemp = units.C2F(downDTemper[i])
  } else {
    occPtInfo.dwnTemp = downDTemper[i]
  }
  occPtInfo.ppd = downDPPD[i];
  occPtInfo.mrtppd = mrtPPD[i];

	// Calculate whether there is risk of condensation.
	var dewPoint = comf.dewptCalc(airTemp, rh)
	if (windowTemp < dewPoint){
		var condensation = "certain"
	} else if (windowTemp < dewPoint+3){
		var condensation = "risky"
	} else {
		var condensation = "none"
	}

	// Return all results.
	r = {}
	r.myDataset = myDataset
	r.condensation = condensation
	r.occPtInfo = occPtInfo
	r.dwnPPDFac = dwnPPDFac

	return r
}
