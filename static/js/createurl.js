function createURL() {

	// create a dictionary of defaults.
	var defaultSettings = {
		units: "IP",
		ppd: "20",
		ppd2: "10",
		distFromFacade: "3"
	}

	var defaultDict = {
		ceiling: "12",
		wallWidth: "18",
		windowHeight: "7",
		sillHeight: "3",
		windowWidth: "4",
		glazingRatio: "39",
		windowSeparation: "6",
		uValue: "0.35",
		outdoorTemp: "10",
		indoortemp: "72",
		humidity: "20",
		lowE: "",
		occPosition: "0",
		rValue: "15",
		airspeed: "10",
		clothing: "0.85",
		metabolic: "1.2"
	}

	// case visibility
	var case1Vis = "show";
	var case2Vis, case3Vis;
	if ($("#caseSelection #case2Label").hasClass("unselected") == false) {
		case2Vis = "show";
	} else {
		case2Vis = "hide";
	}

	if ($("#caseSelection #case3Label").hasClass("unselected") == false) {
		case3Vis = "show";
	} else {
		case3Vis = "hide";
	}

	// units
	if ($(".optionButton#IP").hasClass("selected") == true) {
		var units = "IP";
	} else {
		var units = "SI";
	}

	// values regardless of case
	var thisDistFromFacade = round(occDistFromFacade*10)/10;
	var thisPpd = $("#ppd").val();
	var thisPpd2 = $("#ppd2").val();

	// check to be sure that this is not already a long URL.
	locationURL = location.href.split("?")[0]

	// Start the URL and create dictioaries of all values.
	var paramURL = locationURL + "?case1=show" + "&case2=" + case2Vis + "&case3=" + case3Vis

	var valDictionary = {
		units: units,
		ppd: thisPpd,
		ppd2: thisPpd2,
		distFromFacade: thisDistFromFacade
	}

	// values for only case 1
	var case1Dict = {
		ceiling: $("#ceiling").val(),
		wallWidth: $("#wallWidth").val(),
		windowHeight: $("#windowHeight").val(),
		sillHeight: $("#sill").val(),
		windowWidth: $("#windowWidth").val(),
		glazingRatio: $("#glazing").val(),
		windowSeparation: $('#distWindow').val(),
		uValue: $("#uvalue").val(),
		outdoorTemp: $("#outdoortemp").val(),
		indoortemp: round(case1Data.airtempValue*10)/10,
		humidity: $("#humidity").val(),
		lowE: $("#lowE").val(),
		occPosition: $("#occupantDist").val(),
		rValue: $("#rvalue").val(),
		airspeed: $("#airspeed").val(),
		clothing: $("#clothing").val(),
		metabolic: $("#metabolic").val()
	}

	// values for only case 2
	var case2Dict = {
		ceiling: $("#ceiling2").val(),
		wallWidth: $("#wallWidth2").val(),
		windowHeight: $("#windowHeight2").val(),
		sillHeight: $("#sill2").val(),
		windowWidth: $("#windowWidth2").val(),
		glazingRatio: $("#glazing2").val(),
		windowSeparation: $('#distWindow2').val(),
		uValue: $("#uvalue2").val(),
		outdoorTemp: $("#outdoortemp2").val(),
		indoortemp: round(case2Data.airtempValue*10)/10,
		humidity: $("#humidity2").val(),
		lowE: $("#lowE2").val(),
		occPosition: $("#occupantDist2").val(),
		rValue: $("#rvalue2").val(),
		airspeed: $("#airspeed2").val(),
		clothing: $("#clothing2").val(),
		metabolic: $("#metabolic2").val()
	}

	// values for only case 3
	var case3Dict = {
		ceiling: $("#ceiling3").val(),
		wallWidth: $("#wallWidth3").val(),
		windowHeight: $("#windowHeight3").val(),
		sillHeight: $("#sill3").val(),
		windowWidth: $("#windowWidth3").val(),
		glazingRatio: $("#glazing3").val(),
		windowSeparation: $('#distWindow3').val(),
		uValue: $("#uvalue3").val(),
		outdoorTemp: $("#outdoortemp3").val(),
		indoortemp: round(case3Data.airtempValue*10)/10,
		humidity: $("#humidity3").val(),
		lowE: $("#lowE3").val(),
		occPosition: $("#occupantDist3").val(),
		rValue: $("#rvalue3").val(),
		airspeed: $("#airspeed3").val(),
		clothing: $("#clothing3").val(),
		metabolic: $("#metabolic3").val()
	}


	// build the URL
	for (var key in valDictionary) {
		if (valDictionary[key] != defaultSettings[key]) {
			paramURL = paramURL + "&" + key + "=" + valDictionary[key]
		}
	}

	for (var key in case1Dict) {
		if (case1Dict[key] != defaultDict[key]) {
			paramURL = paramURL + "&" + key + "=" + case1Dict[key]
		}
	}

	for (var key in case2Dict) {
		if (case2Dict[key] != defaultDict[key]) {
			paramURL = paramURL + "&" + key + "2=" + case2Dict[key]
		}
	}

	for (var key in case3Dict) {
		if (case3Dict[key] != defaultDict[key]) {
			paramURL = paramURL + "&" + key + "3=" + case3Dict[key]
		}
	}


	return paramURL;

}
