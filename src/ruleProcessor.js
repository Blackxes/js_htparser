//_____________________________________________________________________________________________
/**********************************************************************************************

	contains processing functions of the template library

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

/* jshint -W084 */

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

		// console.log("RP: Query: %o", query);

		// initial definition
		let response = new Classes.processResponse( query.rule, query.value, false );

		// use request functions (and its operator)
		let func = `${query.request}${ (query.operator) ? "_" + query.operator : "" }`;

		if ( func in this )
			response = this[func]( query );

		// console.log("RP: Response: %o", response);

		return response;
	}

	//_________________________________________________________________________________________
	// replaces current scope with the result of another template
	template( query ) {

		// console.log("RuleParser: Template: ", query);

		// initial definition
		let response = new Classes.processResponse( query.rule, "", false );

		if ( Parser.parser.hasTemplate(query.key) )
			response.value = Parser.parser._parse( Parser.parser.getTemplate( query.key ), query.value );

		else if ( query instanceof Classes.postQuery )
			return response;

		// .. or create post request to parse it later on
		else {
			// console.log("Create PostQuery", query.rule );
			response.value = query.rule;
			response.postQuery = new Classes.postQuery( query, query.template, query.value );
		}

		// console.log("Template Done");

		return response;
	}

	//_________________________________________________________________________________________
	// extracts a string from a template to be a template on its on
	template_inline( query ) {

		// console.log("RuleParser: InlineTemplate: \n\t%o", query);

		if ( !query.key )
			throw new Error("HTParser: Command 'template inline' is missing template key to create new template. Template: " + query.key);

		let pieces = Config.regex.extract_area( "template", {"begin": "inline", "end": ""}, query.key ).exec( query.template );

		let response = new Classes.processResponse( pieces[0], "", false );

		Parser.parser.registerTemplate( query.key, pieces[1] );

		// console.log("Template Created: ", query.key );

		// Idea: configurable by the option list of the rule / wether to also template the template
		// response.value = Parser.parser._parse( Parser.parser.getTemplate( query.key ), query.value );

		// console.log("TemplateInline Done");

		return response;
	}

	//_________________________________________________________________________________________
	// repeats the inner content
	foreach_begin( query ) {

		// console.log("RParser 'foreach': Parse %s \n\t%o", query.key, query);

		// Todo: implement display of invalid values
		if ( !query.key ) {
			throw new Error("RParser 'foreach': invalidly defined. Template: " + query.template.id);
		}

		// adjust value to avoid error but display it
		if ( !(query.value instanceof Array) ) {
			console.warn("RParser 'foreach': invalid markup given. Expected Array");
			query.value = [];
		}

		// Todo: implement display of invalid subtemplate / base template as backup is used
		let response = new Classes.processResponse( query.rule, "" );
		let extractRegex = Config.regex.extract_area( "foreach", {"begin": "begin", "end": "end"}, query.key );
		let templatePieces = extractRegex.exec(query.template);

		if ( !templatePieces ) {
			console.log("RParser 'foreach': template couldnt be extracted: %s", query.rule);
			return response;
		}

		// console.log("RParser 'foreach': template extraction: \n\tInput: %s \n\tExtract: %s \n\tRegex: %s", templatePieces[0], templatePieces[1], extractRegex);

		response.replacement = templatePieces[0];

		let template = new Classes.template( null, templatePieces[1] );
		let content = "";

		// console.log("RParser 'foreach': start loop parsing ..");
		query.value.forEach( (markup) => {

			if ( !markup || markup.constructor !== Object )
				return true;

			// console.log("RParser 'foreach': create content \n\tTemplate: %s \n\tMarkup: %o", template.value, markup);
			content += Parser.parser._parse( template, markup );
		});

		// console.log("RParser 'foreach': end loop parsing ..");

		response.value = content;

		// console.log("RParser 'foreach': Done \n\tCreated Content: %s", response.value);

		return response;
	}

	//_________________________________________________________________________________________
	// displays the current process markup
	// debug(process) {
	//
	// 	let parser = require ("./parser.js");
	// 	let content = "";
	// 	let markup = {};
	//
	// 	// when undefined value given
	// 	if ( process.markup === null )
	// 		content = "Undefined";
	//
	// 	// when array or object
	// 	else if ( process.markup.constructor === Array || process.markup.constructor === Object ) {
	// 		for (let i in process.markup) {
	// 			let item = process.markup[i];
	//
	// 			content += item + "<br>";
	// 		}
	// 	}
	//
	// 	// when a simple value
	// 	else
	// 		content = process.markup;
	//
	// 	let response = new Classes.processResponse( process.rule.rule, content );
	//
	// 	return response;
	// }

	//_________________________________________________________________________________________
	// builds single line requests
	// _buildSingleRequest(request, key, operator = null) {
	// 	return `{{ ${request} ${(operator) ? operator : ""}: ${key} }}`;
	// }
	//
	// //_________________________________________________________________________________________
	// // builds area requests
	// _buildAreaRequest(request, range, key, content) {
	// 	return `{{ ${request} ${range.begin}: ${key} }}${content}{{ ${request} ${range.end}: ${key} }}`;
	// }

	//_________________________________________________________________________________________
	//

}();

//_____________________________________________________________________________________________
//
