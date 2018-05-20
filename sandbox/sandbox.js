//_____________________________________________________________________________________________
/**********************************************************************************************

	testing file

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/



//_____________________________________________________________________________________________
document.addEventListener("DOMContentLoaded", function() {

	let parser = require ("../src/parser.js").parser;
	parser.Init();

	let markup = {
		"title": "sick title",
		"description": "My own and simple description",
		"fruits": [
			{ "fruit": "apple" },
			{ "fruit": "peach" },
			{ "fruit": "banana" },
			{ "fruit": "orange" },
			{ "fruit": "cucumber" }
		],
		"subtemplate": {
			"title": "Im a subtemplate!"
		}
	}

	let result = parser.parse("test", markup);

	document.getElementById("app").innerHTML = result;
});

//_____________________________________________________________________________________________
//

/*
Probability calculation of a vocabulary pick
-117.46 (1.1^(-x)) + 117.46
*/