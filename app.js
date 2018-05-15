//_____________________________________________________________________________________________
/**********************************************************************************************

	main entry point

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/



//_____________________________________________________________________________________________
// controls update timing
document.addEventListener("DOMContentLoaded", () => {

	let TParser = require("./src/parser.js");

	document.getElementsByClassName("board")[0].innerHTML = TParser.parse("testing", {
		"title": "Test title",
		"row": [
			{ "label1": "item1 label 1", "label2": "item1 label 2" },
		],
		"label": "Test label",
	});
});

//_____________________________________________________________________________________________
//