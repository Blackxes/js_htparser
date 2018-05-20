//_____________________________________________________________________________________________
/**********************************************************************************************

	testing file

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/



//_____________________________________________________________________________________________
document.addEventListener("DOMContentLoaded", function() {

	let parser = require ("html_template_parser_v2").parser;

	console.log(parser);

	

	return true;




	// parser.Init();

	// let markup = {
	// 	"title": "sick title",
	// 	"description": "My own and simple description",
	// 	"fruits": [
	// 		{ "fruit": "apple" },
	// 		{ "fruit": "avocado" },
	// 		{ "fruit": "breadfruit" },
	// 		{ "fruit": "cherry" },
	// 		{ "fruit": "grapefruit" }
	// 	],
	// 	"subtemplate": {
	// 		"title": "Im a subtemplate!"
	// 	}
	// }

	// let result = parser.parse("test", markup);

	// document.getElementById("app").innerHTML = result;
});

//_____________________________________________________________________________________________
//

module.exports = require ("../src/Parser.js");

/*
Probability calculation of a vocabulary pick
-117.46 (1.1^(-x)) + 117.46
*/