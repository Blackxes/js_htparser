//_____________________________________________________________________________________________
/**********************************************************************************************

	contains several container classes

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

// includes
var HP_Parser = require("./parser.js");

//_____________________________________________________________________________________________
// contains information about a template
exports.template = class templateClass {

	//_________________________________________________________________________________________
	// param1 (string) expects the value for this template
	//		either a template instance
	//		a template id
	//		or a raw template
	// param2 (boolean) defines wether the given value is a raw template or an id
	//		instances are handled independently
	//
	constructor( value, isTemplate = false) {

		this._value = "";
		this.id = "";

		// defined by instance
		if ( value instanceof exports.template ) {
			this.id = value.id;
			this._value = value.value;
		}

		// when its a template
		else if ( value && isTemplate )
			this._value = value
			
		// when an id is defined
		else if ( value && !isTemplate )
			this.id = value;
		
		// sad life.. nothing matches
		else;
	}

	//_________________________________________________________________________________________
	set value( template ) {

		this._value = template || "";
	}

	//_________________________________________________________________________________________
	get value() {

		// trying to pull template
		if ( HP_Parser.parser.hasTemplate( this.id ) )
			return HP_Parser.parser.getTemplate( this.id );
		
		// return pure template or null
		return this._value || "";
	}

	//_________________________________________________________________________________________
	//

}

//_____________________________________________________________________________________________
// contains information about the current processing template and its request
exports.query = class QueryClass {

	//_________________________________________________________________________________________
	constructor( rule, request, operator, key, template, markup, value ) {

		this.rule = rule || null;
		this.request = request || null;
		this.operator = operator || null;
		this.key = key || null;
		this.template = template || null;
		this.markup = markup || null;
		this.value = value || null;
	}

	//_________________________________________________________________________________________
	//

}

//_____________________________________________________________________________________________
// contains the final information about the string
// thats being replaced with the assossiated value
//
exports.processResponse = class ProcessResponseClass {

	//_________________________________________________________________________________________
	constructor( replacement, value, postQuery ) {
		
		this.replacement = replacement || "";
		this.value = value || "";
		this.postQuery = (postQuery !== undefined) ? postQuery : null;
	}

	//_________________________________________________________________________________________
	//
}

//_____________________________________________________________________________________________
// post query / when a rule needs to be parsed later on due to dependencies
exports.postQuery = class PostQueryClass extends exports.query {

	//_________________________________________________________________________________________
	constructor( query, _template, _markup ) {
		
		let template = _template || query.template;
		let markup = _markup || query.markup;

		super( query.rule, query.request, query.operator, query.key, template, markup, query.value );
	}

	//_________________________________________________________________________________________
	//

}

//_____________________________________________________________________________________________
//