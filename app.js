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

	TParser.parse("testing", {
		"title": "Test title",
		"label": "Test label",
		"row": [
			{ "label": "item label 1" },
			{ "label": "item label 2" }
		]
	});

	console.log("done");
});

//_____________________________________________________________________________________________
//