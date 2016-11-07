
function createCSV(dataset, dataset2, dataset3, unitSys) {
  // Add the data to a javascript matrix
  var initdata = [[],[],[],[]];
  appendDataset(initdata, dataset, "Case 1 Results", unitSys)
  if ($("#case2Button").hasClass("unselected") == false) {
    appendDataset(initdata, dataset2, "Case 2 Results", unitSys)
  }
  if ($("#case3Button").hasClass("unselected") == false) {
    appendDataset(initdata, dataset3, "Case 3 Results", unitSys)
  }


  // Transpose the matrix
  var data = initdata[0].map(function(col, i) {
  return initdata.map(function(row) {
    return row[i]
    })
  });

  // Write the matrix to a csv.
  var csvContent = "data:text/csv;charset=utf-8,";
  data.forEach(function(infoArray, index){
     dataString = infoArray.join(",");
     csvContent += index < data.length ? dataString+ "\n" : dataString;
  });
  return csvContent
}



function appendDataset(maxtix, data, caseName, unitSys) {
  maxtix[0].push(caseName)
  maxtix[1].push("")
  maxtix[2].push("")
  maxtix[3].push("")

  if (unitSys == "IP") {
  maxtix[0].push("Dist Facade (ft)");
  } else {
    maxtix[0].push("Dist Facade (m)");
  }
  maxtix[1].push("Draft PPD");
  maxtix[2].push("MRT PPD");
  maxtix[3].push("Comfort");

  for (var i = 0; i < data.length; i++) {
    maxtix[0].push(data[i].dist);
    maxtix[1].push(data[i].ppd);
    maxtix[2].push(data[i].mrtppd);
    maxtix[3].push(data[i].comf);
  }
}
