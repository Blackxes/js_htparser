//_____________________________________________________________________________________________
/**********************************************************************************************

	contains processing functions of the template library

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

// var Parser = require ("./parser.js");

//_____________________________________________________________________________________________
class ProcessorClass {

	//_________________________________________________________________________________________
	constructor() {}

	//_________________________________________________________________________________________
	// replaces current scope with the result of another template
	template(template, markup, value) {

		let content = "";

		return "";
	}

	//_________________________________________________________________________________________
	// repeats inner content until condition is false
	foreach(process) {

		console.log(process);

		throw new Error();

		// Todo: implement display of invalid values
		// if ( !process.markerValue || process.markerValue && process.markerValue.constructor !== Array )
		// 	return "";
		
		// let content = "";
		
		// Todo: implement display of invalid values
		// process.markerValue.forEach( (value, index) => {
		// 	content += (require ("./parser.js"))._parseTemplate(process.markerTemplate, value, (subProcess) => {
		// 		return subProcess.markerValue;
		// 	});
		// });
		
		return "";
	}

	//_________________________________________________________________________________________
	// displays the current process markup
	debug(process) {

		// console.log(process);

		return "";
	}
	
	//_________________________________________________________________________________________
	//
}

//_____________________________________________________________________________________________
//
module.exports = new ProcessorClass();