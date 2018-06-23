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
// contains information about a general template process
exports.tprocess = class TemplateProcessClass {

	//_________________________________________________________________________________________
	constructor( id, template, userMarkup, isSubProcess) {

		this.id = id || null;
		this.template = template || null;
		this.userMarkup = userMarkup || null;
		this.baseMarkup = null;
		this.currentQuery = null;
		this.isSubProcess = isSubProcess || false;
	}

	//_________________________________________________________________________________________
	//
	
};

//_____________________________________________________________________________________________
// contains information about a template
exports.template = class TemplateClass {

	//_________________________________________________________________________________________
	constructor( id, value, options ) {

		this.id = ( id && id.constructor === String ) ? id : "";
		this._value = ( value || typeof value === "string" ) ? value : "";
		this.options = options || {};
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
	constructor( rule, request, key, value, options ) {

		this.rule = rule || null;
		this.request = request || null;
		this.key = key || null
		this.value = value || null;
		this.options = options || null;
	}

	//_________________________________________________________________________________________
	//

}; 

//_____________________________________________________________________________________________
// contains information about the current processing template and its request
exports.query = class QueryClass extends exports.rule {

	//_________________________________________________________________________________________
	constructor( processId, rule, template, isPostQuery = false) {

		super( rule.rule, rule.request, rule.key, rule.value, rule.options );
		
		this.processId = processId;
		this.template = template || null;
		this.isPostQuery = isPostQuery || false;
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
	constructor( replacement, value, postQuery, indexOffSet ) {

		this.replacement = replacement || "";
		this.value = value || "";
		this.postQuery = (postQuery !== undefined) ? postQuery : null;
		this.indexOffSet = (indexOffSet != undefined) ? indexOffSet : null;

		if ( this.postQuery )
			this.postQuery.isPostQuery = true;
	}

	//_________________________________________________________________________________________
	//

};

//_____________________________________________________________________________________________
// templates for debugging purposes
//
class TemplatesClass {

	//_________________________________________________________________________________________
	constructor() {
		this.templates = {};

		this.templates["hp_debug_messages"] = this.hp_debug_messages();
	}

	//_________________________________________________________________________________________
	// prints out debugging messages
	hp_debug_messages() {
		return `
			<div class="hp-debug-messages">
			{{ foreach: hp_debug_messages }}
				<p>{{ message }}</p>
			{{ foreach end: hp_debug_messages }}
			</div>
		`;
	}

	//_________________________________________________________________________________________
	//

}
exports.templates = (new TemplatesClass()).templates;

//_____________________________________________________________________________________________
//