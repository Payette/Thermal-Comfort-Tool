$(".optionButton#IP").on("click", function(event) {
	if ($(".optionButton#IP").hasClass("selected") == false) {
		$(".optionButton#IP").addClass("selected");
		$(".optionButton#SI").removeClass("selected");
		$(".optionButton#SI").addClass("unselected");

		// change labels to have ft
		$(".units, .unitsTemp, .unitsUVal").removeClass("SI");
		$(".units, .unitsTemp, .unitsUVal").addClass("IP");
		$(".units, .unitsTemp, .unitsUVal").empty();
		$(".units").append("(ft)");
		$(".unitsTemp").append("(&deg;F)");
		$(".unitsUVal").append("(Btu/hr*ft&sup2;*&deg;F)");
	}
})

$(".optionButton#SI").on("click", function(event) {

	if ($(".optionButton#SI").hasClass("selected") == false) {
		$(".optionButton#SI").addClass("selected");
		$(".optionButton#IP").removeClass("selected");
		$(".optionButton#IP").addClass("unselected");

		// change labels to have metres
		$(".units, .unitsTemp, .unitsUVal").removeClass("IP");
		$(".units, .unitsTemp, .unitsUVal").addClass("SI");
		$(".units, .unitsTemp, .unitsUVal").empty();
		$(".units").append("(m)");
		$(".unitsTemp").append("(&deg;C)");
		$(".unitsUVal").append("(W/hr*m&sup2;*K)");
	}
})