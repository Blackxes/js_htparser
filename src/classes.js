//_____________________________________________________________________________________________
/**********************************************************************************************

	contains several container classes

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

// includes
var Parser = require( "./parser.js" );

//_____________________________________________________________________________________________
// contains information about a template
exports.template = class templateClass {

	//_________________________________________________________________________________________
	constructor( id, value ) {

		this.id = ( id && id.constructor === String ) ? id : "";
		this._value = ( value || typeof value === "string" ) ? value : "";
	}

	//_________________________________________________________________________________________
	//
	get value() {

		if ( !this._value && this.id )
			return Parser.parser.getTemplate( this.id )._value;

		return this._value || "";
	}

	//_________________________________________________________________________________________
	//

};

//_____________________________________________________________________________________________
// contains information about the rule
exports.rule = class RuleClass {

	//_________________________________________________________________________________________
	constructor( rule, request, operator, key ) {

		this.rule = rule || null;
		this.request = request || null;
		this.operator = operator || null;
		this.key = key || null;
	}

	//_________________________________________________________________________________________
	//

};

//_____________________________________________________________________________________________
// contains information about the current processing template and its request
exports.query = class QueryClass {

	//_________________________________________________________________________________________
	constructor( rule, request, operator, key, template, value, isPostQuery = false) {

		this.rule = rule || null;
		this.request = request || null;
		this.operator = operator || null;
		this.key = key || null;
		this.template = template || null;
		this.value = value || null;
		this.isPostQuery = isPostQuery || false;

		this.templateId = null;
	}

	//_________________________________________________________________________________________
	//

};

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

};

//_____________________________________________________________________________________________
// post query / when a rule needs to be parsed later on due to dependencies
exports.postQuery = class PostQueryClass extends exports.query {

	//_________________________________________________________________________________________
	constructor( query, _template, _markup ) {

		let template = _template || query.template;
		let markup = _markup || query.markup;

		super( query.rule, query.request, query.operator, query.key, template, markup, query.value, true );
	}

	//_________________________________________________________________________________________
	//

};

//_____________________________________________________________________________________________
//
