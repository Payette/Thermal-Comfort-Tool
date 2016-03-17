$(document).ready(function () {

$("#caseSelection #case1Label").on("click", function() {
	if ($(this).hasClass("unselected") == true) {
		$(this).removeClass("unselected");
		$("#case1Button").removeClass("unselected");

		$("#inputs input.case1, .connectLine, .dotCase1, .occdot1").css("display", "initial");
	}

	else if ($(this).hasClass("unselected") == false) {
		$(this).addClass("unselected");
		$("#case1Button").addClass("unselected");

		$("#inputs input.case1, .connectLine, .dotCase1, .occdot1").css("display", "none");

	}
})



$("#caseSelection #case3Label").on("click", function() {
	if ($(this).hasClass("unselected") == true) {
		$(this).removeClass("unselected");
		$("#case3Button").removeClass("unselected");

		$("#inputs input.case3, #case3FacadeWrapper, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3").css("display", "initial");
	}

	else if ($(this).hasClass("unselected") == false) {
		$(this).addClass("unselected");
		$("#case3Button").addClass("unselected");

		$("#inputs input.case3, #case3FacadeWrapper, #sliderWrapper3, .connectLine3, .dotCase3, .occdot3").css("display", "none");
	}
})



}); //end of document ready