//Assign any parameters from the URL 

var thisURL = location.href;
//call URL parser function
var urlParameters = urlObject({'url':thisURL}).parameters;


// first check should be which cases are shown - therefore if only case 1, dont need values for other cases, just fill with the same...




//fill form with parameters, but only if values are provided in URL
if (typeof urlParameters.ceiling != 'undefined') {
	$("#ceiling").val(urlParameters.ceiling);
}
if (typeof urlParameters.wallWidth != 'undefined') {
	$("#wallWidth").val(urlParameters.wallWidth);
}
if (typeof urlParameters.windowHeight != 'undefined') {
	$("#windowHeight").val(urlParameters.windowHeight);
}
if (typeof urlParameters.windowWidth != 'undefined') {
	$("#windowWidth").val(urlParameters.windowWidth);
	$("#windowWidth").removeClass("inactive");
	$("#windowWidthLabel").removeClass("inactive");
	$("#glazing").addClass("inactive");
	$("#glazingLabel").addClass("inactive");
	$("#glazingRatioCheck").removeAttr("checked");
}
if (typeof urlParameters.glazingRatio != 'undefined') {
	$("#glazing").val(urlParameters.glazingRatio);
	$("#windowWidth").addClass("inactive");
	$("#windowWidthLabel").addClass("inactive");
	$("#glazing").removeClass("inactive");
	$("#glazingLabel").removeClass("inactive");

	$("#glazingRatioCheck").attr("checked", "checked");
}
if (typeof urlParameters.sillHeight != 'undefined') {
	$("#sill").val(urlParameters.sillHeight);
}
if (typeof urlParameters.windowSeparation != 'undefined') {
	$("#distWindow").val(urlParameters.windowSeparation);
}
if (typeof urlParameters.uValue != 'undefined') {
	$("#uvalue").val(urlParameters.uValue);
}
if (typeof urlParameters.lowE != 'undefined') {
	$("#lowE").val(urlParameters.lowE);
	$("#lowE").removeClass("inactive");
	$("#lowELabel").removeClass("inactive");
}
if (typeof urlParameters.rValue != 'undefined') {
	$("#rvalue").val(urlParameters.rValue);
}
if (typeof urlParameters.ppd != 'undefined') {
	$("#ppd").val(urlParameters.ppd);
}
if (typeof urlParameters.distFromFacade != 'undefined') {
	$("#distFromFacade").val(urlParameters.distFromFacade);
}
if (typeof urlParameters.outdoorTemp != 'undefined') {
	$("#outdoortemp").val(urlParameters.outdoorTemp);
}
if (typeof urlParameters.indoortemp != 'undefined') {
	$("#airtemp").val(urlParameters.indoortemp);
}
if (typeof urlParameters.humidity != 'undefined') {
	$("#humidity").val(urlParameters.humidity);
}
if (typeof urlParameters.radiant == 'yes') {
	$("#radiant").attr("checked", "checked");;
}
if (typeof urlParameters.clothing != 'undefined') {
	$("#clothing").val(urlParameters.clothing);
}
if (typeof urlParameters.metabolic != 'undefined') {
	$("#metabolic").val(urlParameters.metabolic);
}
