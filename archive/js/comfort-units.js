var units = units || {};


// Temperature
units.C2F = function(x){
    return x * 9 / 5 + 32;
}
units.F2C = function(x) {
    return (x - 32) * 5 / 9;
}

// Heat Flow (U-Value)
units.uIP2uSI = function(x){
    return x * 5.678263337;
}
units.uSI2uIP = function(x){
    return x / 5.678263337;
}

// Heat Resistance (U-Value)
units.rIP2rSI = function(x){
    return x / 5.678263337;
}
units.rSI2rIP = function(x){
    return x * 5.678263337;
}

// length
units.Ft2M = function(x){
    return x / 3.28084;
}
units.M2Ft = function(x) {
    return x * 3.280849;
}

//Air Speed
units.fpm2mps = function(x){
    return x * 0.00508;
}
units.mps2fpm = function(x) {
    return x / 0.00508;
}
