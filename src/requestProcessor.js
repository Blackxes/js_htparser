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
exports.requestProcessor = new class RequestProcessor {

	//_________________________________________________________________________________________
	constructor() {}

	//_________________________________________________________________________________________
	// processes the given query based on the request
	//
	// param1 (QueryClass) expects the query instance
	//
	// return null | ProcessResponseClass
	//
	processRequest( query ) {

		if ( String(query.options.render).toLowerCase() == "false" )
			return new Classes.processResponse( query.rule, null, false );
		
		// wether to check if the request function exists
		// its more common that a marker is given which just needs to be replaced by its value
		else if ( !(query.request in this) )
			return new Classes.processResponse(query.rule, query.value, false)
		
		return this[ query.request ]( query );
	}

	//_________________________________________________________________________________________
	// replaces current scope with the result of another template
	//
	// param1 (QueryClass) expects the query instance
	//
	// return null | ProcessResponseClass
	//
	template( query ) {
		
		if ( !query.key )
			return null;
		
		// try to requery at a later state but not when its already a post query
		if ( !Parser.parser.hasTemplate(query.key) )
			return new Classes.processResponse( query.rule, (!query.isPostQuery) ? query.rule : "", (!query.isPostQuery) ? query : false, 0 );
		
		let response = new Classes.processResponse( query.rule, null, false );
		let content = Parser.parser.parse( query.key, query.value, false );

		response.value = content;

		return response;
	}

	//_________________________________________________________________________________________
	// extract the inline defined template from the given template an stores it
	// as a separat template with the given id / when the template already exists
	// a warning is displayed in the console
	//
	// param1 (QueryClass) expects the query instance
	//
	// return ProcessResponseClass
	//
	templateInline( query ) {

		// Todo: implement displayment of invalid key definition
		if ( !query.key )
			return null;

		let response = new Classes.processResponse( query.rule, "", false );
		let templateMatch = Config.regex.extractArea( query, query.key ).exec( query.template );

		// Todo: implement displayment of not found inline template definition
		if ( !templateMatch )
			return response;
		
		// Todo: implement displayment of unsuccessful registered inline defined template
		if ( !Parser.parser.registerTemplate(query.key, templateMatch[1]) )
			return response;
		
		response.replacement = templateMatch[0];
		
		if ( query.options.renderInline )
			response.value =  Parser.parser.parse( query.key, query.value );

		return response;
	}

	//_________________________________________________________________________________________
	// extracts the content surrounded by the foreach rule and repeats it
	// with the given configuration defined in the markup by the key
	//
	// param1 (QueryClass) expects the query instance
	//
	// return ProcessResponseClass
	//
	foreach( query ) {

		// Todo: implement displayment of invalid key definition
		// or invalid markup definition
		if ( !query.key || !query.value || query.value && query.value.constructor !== Array )
			return null;

		let response = new Classes.processResponse( query.rule, "", false );
		let foreachMatch = Config.regex.extractArea( query, query.key ).exec( query.template );

		// Todo: implement displayment of undefined or invalid definition of the foreach command
		if ( !foreachMatch )
			return response;
		
		response.replacement = foreachMatch[0];
		let template = foreachMatch[1];
		let content = "";
		
		query.value.forEach( (currentMarkup) => {
			content += Parser.parser.parse( new Classes.template( null, template ), currentMarkup, false );
		});

		response.value = content;

		return response;
	}

	//_________________________________________________________________________________________
	// prints out information about a markup configuration and the current template process
	//
	// param1 (QueryClass) expects the query instance
	//
	// return ProcessResponseClass
	//
	debug( query ) {

		// Todo: finish "debug" command implementation!
		let response = new Classes.processResponse( query.rule, "no data found", false );

		response.value = "Currently not implemented!";

		return response;
	}

	//_________________________________________________________________________________________
	//

}();

//_____________________________________________________________________________________________
//
