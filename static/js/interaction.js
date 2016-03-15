$(document).ready(function () {

$("#caseSelection #case2Label").on("click", function() {
	if ($(this).hasClass("unselected") == true) {
		$(this).removeClass("unselected");
		$("#case2Button").removeClass("unselected");

		$("#inputs input.case2").css("display", "initial");
	}

	else if ($(this).hasClass("unselected") == false) {
		$(this).addClass("unselected");
		$("#case2Button").addClass("unselected");

		$("#inputs input.case2").css("display", "none");
	}
})

$("#caseSelection #case3Label").on("click", function() {
	if ($(this).hasClass("unselected") == true) {
		$(this).removeClass("unselected");
		$("#case3Button").removeClass("unselected");

		$("#inputs input.case3").css("display", "initial");
	}

	else if ($(this).hasClass("unselected") == false) {
		$(this).addClass("unselected");
		$("#case3Button").addClass("unselected");

		$("#inputs input.case3").css("display", "none");
	}
})



}); //end of document ready