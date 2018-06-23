//_____________________________________________________________________________________________
/**********************************************************************************************

	testing file

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

let firstName = () => {
	return false;
}

var markups = {

	// basic marker functionality
	"test-basic-marker-functionality": {
		"first_name": "Alex",
		"last_name": "Bassov",
		"email": "blackxes@gmx.de"
	},

	// template inline declaration
	"test-template-inline-declaration": {
		"inline-template": {
			"options": {
				"if": function() { return true; }
			}
		}
	},

	// post inline template definition
	"test-post-inline-template-definition": {
		"inline-definition": {
			"inline_marker": "Sick Marker"
		}
	},

	// foreach command
	"test-foreach": {
		"fruits": [
			{ "fruit": "apple" },
			{ "fruit": "avocado" },
		]
	},

	// round and round
	"test-round-and-round": {
		"firstName": "Alexander",
		"lastName": "Bassov",
		"frameworkName": "JS_HTParser",
		"frameworkVersion": 4,
		"hobbies": [
			{ "hobby": "Piano" },
			{ "hobby": "Programming" },
			{ "hobby": "Talking" },
		],
		"prog_languages": {
			"prog_languages": [
				{ "language": "C/C++" },
				{ "language": "PHP" },
				{ "language": "JavaScript" },
				{ "language": "CSS/HTML" },
			]
		}
	}
	
};

//_____________________________________________________________________________________________
document.addEventListener("DOMContentLoaded", function() {

	let parser = require("../src/parser.js").parser;
	window.js_htparser = parser;

	// test
	let tests = [
		"test-basic-marker-functionality",
		"test-template-inline-declaration",
		"test-post-inline-template-definition",
		"test-template-placeholder",
		"test-foreach",
		"test-invalid-rules",
		"test-round-and-round"
	];

	// define test template
	let testNumbers = [1,2,3,4,5,6,7];

	// test function
	var test = function( testNrs ) {

		testNrs.forEach( (testNr) => {

			if ( !tests[testNr - 1] ) {
				document.getElementById("app").innerHTML += `<p>Test Nr. ${testNr} not found</p>`;
				return true;
			}

			console.log("Current Test: %s | Markup: %o\n---", tests[testNr - 1], markups[tests[testNr - 1]] || "none given");

			let result = js_htparser.parse(tests[testNr - 1], markups[tests[testNr - 1]] || {});
			document.getElementById("app").innerHTML += "<div class=\"test-block\">" + result + "</div>";
		});
	};
	
	test(testNumbers);

	return true;
});

//_____________________________________________________________________________________________
//
