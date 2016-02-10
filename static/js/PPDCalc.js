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
var opaqueViewFacs =[0.359653,0.261388,0.219306,0.178742,0.155965,0.137527,0.121041,0.108894,0.096529,0.087636,0.080694,0.079176]
var winViewFacs = [0.03167,0.051193,0.040781,0.040347,0.033839,0.0282,0.024729,0.020824,0.021692,0.02039,0.016486,0.01128]


// Computes PPD given the 6 factors of PMV comfort.
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

