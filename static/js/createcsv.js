function msieversion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    return true;
  } else { // If another browser,
    return false;
  }
}


function createCSV(dataset, dataset2, dataset3, occPointData, occPointData2, occPointData3, case1Inputs, case2Inputs, case3Inputs, globInputs, unitSys) {
  // Add the data to a javascript matrix
  var initdata = [[],[],[],[],[],[],[],[],[]];
  appendDataset(initdata, dataset, "Case 1 Line Graph Results", unitSys)
  appendDataset(initdata, [occPointData], "Case 1 Occupant Results", unitSys)
  appendInputs(initdata, case1Inputs, "Case 1 Inputs", unitSys)
  if ($("#case2Button").hasClass("unselected") == false) {
    appendDataset(initdata, dataset2, "Case 2 Line Graph Results", unitSys)
    appendDataset(initdata, [occPointData2], "Case 2 Occupant Results", unitSys)
    appendInputs(initdata, case2Inputs, "Case 2 Inputs", unitSys)
  }
  if ($("#case3Button").hasClass("unselected") == false) {
    appendDataset(initdata, dataset3, "Case 3 Line Graph Results", unitSys)
    appendDataset(initdata, [occPointData3], "Case 3 Occupant Results", unitSys)
    appendInputs(initdata, case3Inputs, "Case 3 Inputs", unitSys)
  }
  appendGlobInputs(initdata, globInputs, unitSys)
  appendURLS(initdata)


  // Transpose the matrix
  var data = initdata[0].map(function(col, i) {
  return initdata.map(function(row) {
    return row[i]
    })
  });

  // Write the matrix to a csv.
  var csvContent = "";
  data.forEach(function(infoArray, index){
     dataString = infoArray.join(",");
     csvContent += index < data.length ? dataString+ "\r\n" : dataString;
  });
  return csvContent
}

function addBlankToMtx (matrix, start, count) {
  for (var i = 0; i < count; i++) {
    matrix[start+i].push("")
  }
}

function appendURLS(matrix) {
  addBlankToMtx (matrix, 0, 9)
  var standardURL = createURL(false)
  var fullURL = createURL(true)
  matrix[0].push("Standard URL")
  matrix[1].push(standardURL)
  addBlankToMtx(matrix, 2, 7)
  matrix[0].push("Full URL")
  matrix[1].push(fullURL)
  addBlankToMtx(matrix, 2, 7)
}

function appendGlobInputs(matrix, data, unitSys) {
  matrix[0].push("Global Inputs")
  addBlankToMtx(matrix, 1, 8)

  if (unitSys == "IP") {
    matrix[0].push("Occupant Distance from Facade (ft)")
  } else {
    matrix[0].push("Occupant Distance from Facade (m)")
  }
  matrix[1].push(data[0])
  addBlankToMtx(matrix, 2, 7)

  matrix[0].push("Acceptable PPD from Downdraft (%)")
  matrix[1].push(data[1])
  addBlankToMtx(matrix, 2, 7)

  matrix[0].push("Acceptable PPD from Radiant Loss (%)")
  matrix[1].push(data[2])
  addBlankToMtx(matrix, 2, 7)

}

function appendDataset(matrix, data, caseName, unitSys) {
  matrix[0].push(caseName)
  addBlankToMtx(matrix, 1, 8)

  if (unitSys == "IP") {
    matrix[0].push("Dist Facade (ft)");
  } else {
    matrix[0].push("Dist Facade (m)");
  }
  matrix[1].push("Draft PPD");
  matrix[2].push("MRT PPD");
  matrix[3].push("Comfort");
  matrix[4].push("Glz ViewFactor (%)");
  if (unitSys == "IP") {
    matrix[5].push("MRT (F)");
  } else {
    matrix[5].push("MRT (C)");
  }
  matrix[6].push("PMV");
  if (unitSys == "IP") {
    matrix[7].push("Draft Spd (fpm)");
  } else {
    matrix[7].push("Draft Spd (m/s)");
  }
  if (unitSys == "IP") {
    matrix[8].push("Draft Temp (F)");
  } else {
    matrix[8].push("Draft Temp (F)");
  }

  for (var i = 0; i < data.length; i++) {
    matrix[0].push(data[i].dist);
    matrix[1].push(data[i].ppd);
    matrix[2].push(data[i].mrtppd);
    matrix[3].push(data[i].comf);
    matrix[4].push(data[i].glzfac);
    matrix[5].push(data[i].mrt);
    matrix[6].push(data[i].pmv);
    matrix[7].push(data[i].dwnSpd);
    matrix[8].push(data[i].dwnTemp);
  }
  addBlankToMtx (matrix, 0, 9)
}


function appendInputs(matrix, data, caseName, unitSys) {
  matrix[0].push(caseName)
  addBlankToMtx(matrix, 1, 8)

  if (unitSys == "IP") {
    matrix[0].push("Ceiling Height (ft)")
  } else {
    matrix[0].push("Ceiling Height (m)")
  }
  matrix[1].push(data.ceilingHeightValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Room Length (ft)")
  } else {
    matrix[0].push("Room Length (m)")
  }
  matrix[1].push(data.wallLen)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Window Height (ft)")
  } else {
    matrix[0].push("Window Height (m)")
  }
  matrix[1].push(data.windowHeightValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Window Width (ft)")
  } else {
    matrix[0].push("Window Width (m)")
  }
  matrix[1].push(data.windowWidthValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Sill Height (ft)")
  } else {
    matrix[0].push("Sill Height (m)")
  }
  matrix[1].push(data.sillHeightValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Window Separation (ft)")
  } else {
    matrix[0].push("Window Separation (m)")
  }
  matrix[1].push(data.distanceWindows)
  addBlankToMtx(matrix, 2, 7)

  matrix[0].push("Glazing Ratio (%)")
  matrix[1].push(data.glzRatioValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Window U-Value (Btu/hr*ft2*F)")
  } else {
    matrix[0].push("Window U-Value (W/m²*K)")
  }
  matrix[1].push(data.uvalueValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Target U-Value (Btu/hr*ft2*F)")
  } else {
    matrix[0].push("Target U-Value (W/m²*K)")
  }
  matrix[1].push(data.calcUVal)
  addBlankToMtx(matrix, 2, 7)

  matrix[0].push("Interior Emissivity")
  if (data.intLowEChecked == true) {
    matrix[1].push(data.intLowEEmissivity)
  } else{
    matrix[1].push(0.9)
  }
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Outdoor Temperature (F)")
  } else {
    matrix[0].push("Outdoor Temperature (C)")
  }
  matrix[1].push(data.outdoorTempValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Indoor Temperature (F)")
  } else {
    matrix[0].push("Indoor Temperature (C)")
  }
  matrix[1].push(data.airtempValue)
  addBlankToMtx(matrix, 2, 7)

  matrix[0].push("Indoor Humidity (%)")
  matrix[1].push(data.humidityValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Wall R-Value (hr*ft2*F/Btu)")
  } else {
    matrix[0].push("Wall R-Value (m²*K/W)")
  }
  matrix[1].push(data.rvalueValue)
  addBlankToMtx(matrix, 2, 7)

  if (unitSys == "IP") {
    matrix[0].push("Air Speed (fpm)")
  } else {
    matrix[0].push("Air Speed (m/s)")
  }
  matrix[1].push(data.airspeedValue)
  addBlankToMtx(matrix, 2, 7)

  matrix[0].push("Clothing Insulation (clo)")
  matrix[1].push(data.clothingValue)
  addBlankToMtx(matrix, 2, 7)

  matrix[0].push("Metabolic Rate (met)")
  matrix[1].push(data.metabolic)
  addBlankToMtx(matrix, 2, 7)

  addBlankToMtx (matrix, 0, 9)
}
