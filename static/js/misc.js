function sizeButton() {
	if (($("#caseSelection #case2Label").hasClass("unselected")==true) && ($("#caseSelection #case3Label").hasClass("unselected")==true)) {
		$("#calcUValue").css("width","48px");
	} else if (($("#caseSelection #case2Label").hasClass("unselected")==true) && ($("#caseSelection #case3Label").hasClass("unselected")==false)) {
		$("#calcUValue").css("width","171px");
	} else if (($("#caseSelection #case2Label").hasClass("unselected")==false) && ($("#caseSelection #case3Label").hasClass("unselected")==true)) {
		$("#calcUValue").css("width","101px");
	} else if (($("#caseSelection #case2Label").hasClass("unselected")==false) && ($("#caseSelection #case3Label").hasClass("unselected")==false)) {
		$("#calcUValue").css("width","171px");
	}
}


