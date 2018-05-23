//_____________________________________________________________________________________________
/**********************************************************************************************

	contains processing functions of the template library

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

// includes
var Config = require("./config.js");
var Parser = require("./parser.js");
var Classes = require("./classes.js");

//_____________________________________________________________________________________________
exports.ruleProcessor = new class RuleProcessorClass {

	//_________________________________________________________________________________________
	constructor() {}

	//_________________________________________________________________________________________
	// parses the given rule
	parse( query ) {
		
		// initial definition		
		let response = new Classes.processResponse( query.rule, query.value || query.markup[query.key] );

		// on empty request / due to the way the parsing works
		// this automatically being replaced with empty content
		if ( !query.request ) {
			// console.log("Missing Request: %o", query.rule);
			// Todo: implement display of empty requests
		}
		
		// on a simple marker
		else if ( !query.key ) {
			// if ( query.value === undefined )
				// console.log("Missing Key: %s", query.request, query);
			// Todo: implement display of invalid values (when marker is missing value)
		}
		
		// on command request / with(out) operator
		else if ( query.request ) {

			// single commands
			let func = `${query.request}${ query.operator ? "_" + query.operator : "" }`;

			if ( func in this ) {
				let result = this[func]( query );
				response = result || response;
			}

			else
				console.log("Invalid Request: '%s'", query.request);
		}

		return response;
	}

	//_________________________________________________________________________________________
	// replaces current scope with the result of another template
	template( query ) {

		// initial definition
		let response = new Classes.processResponse( query.rule, query.rule, false );
		let content = "";
		
		// parse on existing template
		if ( Parser.parser.hasTemplate(query.key) )
			response.value = Parser.parser.parse( query.template, query.markup );
		
		// .. or create post request to parse it later on
		else {
			
			let postQuery = new Classes.postQuery(
				Parser.parser._prepareQuery( query.rule, new Classes.template(query.key), query.markup[query.key] )
			);
			response.postQuery = postQuery;
		}

		return response;
	}

	//_________________________________________________________________________________________
	// extracts a string from a template to be a template on its on
	template_start( query ) {

		// add template
		let templatePieces = Config.regex.extract_area("template", query.key).exec( query.template.value );
		Parser.parser.addTemplate( query.key, templatePieces[1] );
		
		let response = new Classes.processResponse(
			templatePieces[0],
			Parser.parser.parse( query.key, query.markup[query.key] )
		);

		return response;
	}

	//_________________________________________________________________________________________
	// repeats inner content until condition is false
	foreach_start( query ) {
		
		// Todo: implement display of invalid values
		if ( !query.rule || query.value && query.value.constructor !== Array )
			return null;
		
		// Todo: implement display of invalid subtemplate / base template as backup is used
		let templatePieces = Config.regex.extract_area( "foreach", query.key ).exec(query.template.value);

		let content = "";
		
		// Todo: implement display of invalid markups
		for (let index in query.value ) {

			if ( !(index in query.value) )
				continue;
			
			let markup = query.value[index];

			// add index / humanized and raw
			markup.hp_index = parseInt(index) + 1;
			markup.hp_index_raw = index;

			content += Parser.parser._parse( new Classes.template(templatePieces[1]), markup );
		};
		
		let response = new Classes.processResponse( templatePieces[0], content );
		
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

		let response = new Classes.processResponse( process.rule.rule, content );

		return response;
	}

	//_________________________________________________________________________________________
	// builds single line requests
	_buildSingleRequest(request, key, operator = null) {
		return `{{ ${request} ${(operator) ? operator : ""}: ${key} }}`;
	}

	//_________________________________________________________________________________________
	// builds area requests
	_buildAreaRequest(request, range, key, content) {
		return `{{ ${request} ${range.begin}: ${key} }}${content}{{ ${request} ${range.end}: ${key} }}`;
	}
	
	//_________________________________________________________________________________________
	//
}

//_____________________________________________________________________________________________
//