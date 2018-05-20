//_____________________________________________________________________________________________
/**********************************************************************************************

	contains several container classes

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

var exports = module.exports = {};

// includes
var HP_Parser = require ("./Parser.js");

//_____________________________________________________________________________________________
// contains information about a template
exports.template = class templateClass {

	//_________________________________________________________________________________________
	// param1 (string) expects either the template or template id
	// 		when the template id is given the template assigns it automatically when requesting
	//		when template is given no id is needed / the raw template has a higher priority
	constructor( value ) {

		this._value = "";
		this.id = "";

		if ( value ) {
			if ( HP_Parser.parser.hasTemplate( value ) ) {
				this._value = HP_Parser.parser.getTemplate( value );
				this.id = value;
			}
			else
				this._value = value;
		}
	}

	//_________________________________________________________________________________________
	set value( template ) {

		this._value = template || "";
	}

	//_________________________________________________________________________________________
	get value() {

		// when template given
		if ( this._value )
			return this._value;

		// try to get template by template id / assign as well
		else if ( !this._value && this.id && HP_Parser.parser.hasTemplate( this.id )) {
			this._value = HP_Parser.parser.getTemplate( this.id );
			return this._value;
		}
			
		return null;
	}

}

//_____________________________________________________________________________________________
// contains information about the current processing template and its request
exports.query = class QueryClass {

	//_________________________________________________________________________________________
	constructor(rule, request, operator, key, template, markup, value) {

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
	constructor(replacement, value) {
		
		this.replacement = replacement || "";
		this.value = value || "";
	}

	//_________________________________________________________________________________________
	//
}

//_____________________________________________________________________________________________
//