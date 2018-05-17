//_____________________________________________________________________________________________
/**********************************************************************************************

	contains processing functions of the template library

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

var exports = module.exports = {}

var HP_Config = require ("./config.js");
var HP_Process = require ("./process.js").process;
var HP_ProcessResponse = require ("./processresponse.js").processResponse;

//_____________________________________________________________________________________________
exports.ruleProcessing = new class RuleProcessingClass {

	//_________________________________________________________________________________________
	constructor() {}

	//_________________________________________________________________________________________
	// parses the given rule
	parse( rule ) {

		// initial definition
		let response = new HP_ProcessResponse(rule.rule, rule.markup);

		// on empty request
		// due to the way the parsing works this automatically being replaced with empty content
		if ( !rule.request ) {
			console.log("Missing Request: %o", rule.rule);
			// Todo: implement display of empty requests
		}
		
		// on a simple marker
		else if ( !rule.key ) {
			if ( rule.markup === undefined )
				console.log("Missing Key: %s", rule.request);
			// Todo: implement display of invalid values (when marker is missing value)
		}
		
		// on command request / with(out) operator
		else if ( rule.request ) {

			// single commands
			let func = `${rule.request}${ rule.operator ? "_" + rule.operator : "" }`;

			if ( func in this ) {
				let result = this[func]( new HP_Process(rule, rule.template, rule.markup) );
				response = result || response;
			}

			else
				console.log("Invalid Request: '%s'", rule.request);
		}

		return response;
	}

	//_________________________________________________________________________________________
	// replaces current scope with the result of another template
	template( process ) {
		
		let parser = require ("./parser.js").parser;
		let content = "";

		// Todo: implement display of invalid values
		if ( parser.hasTemplate(process.rule.key) )
			content = parser.parse(process.rule.key, process.markup);
			
		let response = new HP_ProcessResponse( process.rule.rule, content );

		return response;
	}

	//_________________________________________________________________________________________
	// repeats inner content until condition is false
	foreach_start( process ) {
		
		// Todo: implement display of invalid values
		if ( !process.rule || process.markup && process.markup.constructor !== Array )
			return null;
		
		// Todo: implement display of invalid subtemplate / base template as backup is used
		let template = HP_Config.regex.extract_area("foreach", process.rule.key).exec(process.template);
		let indexTemplate = template[1] || process.template;
		let content = "";
		let parser = require ("./parser.js").parser;
		
		// Todo: implement display of invalid markups
		process.markup.forEach( (markup, index) => {
			content += parser._parseTemplate(indexTemplate, markup) || "";
		});
		
		let response = new HP_ProcessResponse( template[0], content );
		
		return response;
	}

	//_________________________________________________________________________________________
	// displays the current process markup
	debug(process) {
		
		let parser = require ("./parser.js");
		let content = "";
		let markup = {};

		// when undefined value given
		if ( process.markup === null )
			content = "Undefined";
		
		// when array or object
		else if ( process.markup.constructor === Array || process.markup.constructor === Object ) {
			for (let i in process.markup) {
				let item = process.markup[i];

				content += item + "<br>";
			}
		}

		// when a simple value
		else
			content = process.markup;

		let response = new HP_ProcessResponse( process.rule.rule, content );

		return response;
	}
	
	//_________________________________________________________________________________________
	//
}

//_____________________________________________________________________________________________
//