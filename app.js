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

	let parser = require("./src/parser.js").parser;

	document.getElementsByClassName("board")[0].innerHTML = parser.parse("testing", {
		
		"title": "was ist das für eine bullshit scheiße, ich weißt doch das",
		"title3": "Another title",
		"row": [
			{ "label1": "item1", "label2": "wusa", },
			{ "label1": "item1", "label2": "kaka", }
		],
		"label": "Test label",
	});

	return true;
});

//_____________________________________________________________________________________________
//