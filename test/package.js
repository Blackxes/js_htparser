(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./parser.js":3}],2:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	defaults and configuration

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

/* jshint -W084 */

// includes
// general configuration
exports.config = {};

//_____________________________________________________________________________________________
// regex for extracting and filtering
exports.regex = {};

// matches a rule within a template
exports.regex.extractRule = function() { return new RegExp("{{([^<>]*?)}}", "g"); };

// rule filtering regex / extract the request, key and the options string
exports.regex.extractRequest = function() { return new RegExp("([\\w-]+)(?:[\\w\\s:-]+)?", "g"); }
exports.regex.extractKey = function() { return new RegExp("{{\\s*(?:[\\w-]+)\\s*:\\s*([\\w-]+)(?:[\\w\\s:-]+)?", "g"); }
// exports.regex.extractOptionsString = function() { return new RegExp("\\w+(?::\\w+)?\\s+(\\w+[\\s\\w+-:]+)", "g"); }

// extracts single options from the option part within the rule
// exports.regex.extractOption = () => { return new RegExp("\\s*([\\w-]+)\\s*:\\s*([\\w-]+)\\s*", "g"); };

// extract a substring based on the given rule
// build based on the given rule to extract area
exports.regex.extractArea = function( query, id ) { return new RegExp( `${query.rule}(.*?){{\\s*${query.request}\\s+end\\s*:\\s*${id}\\s*}}`, "g" ); };

//_____________________________________________________________________________________________
// debugging configuration
exports.debug = {};

// display messages in general
exports.debug.display = true;

// display trace
exports.debug.display_trace = true;

//_____________________________________________________________________________________________
// rule parsing configuration
exports.parsing = {};

// contains the default option set for a rule
// Idea: maybe required attribute to each option value?
//
exports.parsing.optionSets = {
	"default": {
		"render": true,
		"wrap": "|"
	},
	"templateInline": {
		"renderInline": false
	}
};

//_____________________________________________________________________________________________
// debugging stuff when working with the library
// Todo: implement debuggin usage
// exports.config.debug = {};

// displays every invalid value within the template
// exports.config.debug.displayInvalidValues = true;
// exports.config.debug.displayInvalidValuesAttributes = {
// 	"request": true,
// 	"operator": true,
// 	"key": true,
// 	"template": true,
// 	"value": true
// };

//_____________________________________________________________________________________________
//

},{}],3:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	html template parsing class

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

/* jshint -W084 */

// includes
var Config = require( "./config.js" );
var RequestProcessor = require( "./requestProcessor.js" );
var Classes = require( "./classes.js" );

//_____________________________________________________________________________________________
exports.parser = new class HTMLParserClass {

	//_________________________________________________________________________________________
	constructor() {

		this.templates = {};
		this.tprocesses = {};
		this._latestProcessId = 0;

		this._loadTemplates();
	}

	//_________________________________________________________________________________________
	// loads templates from the dom
	_loadTemplates() {

		let raw = document.querySelector("template#templates");

		if (!raw)
			return true;

		let children = raw.content.children;

		// load custom user
		for (let index in children) {

			if (!children.hasOwnProperty(index))
				continue;

			let el = children[index];
			let templateId = el.dataset.templateId;

			if (!templateId)
				continue;

			if (!this.registerTemplate( templateId, el.innerHTML ))
				console.log("HTParser: registering template %s failed", templateId);
		}

		// load core templates after custom to ensure they wont be overwritten
		for ( let i in Classes.templates )
			this.registerTemplate( i, Classes.templates[i] );

		return true;
	}

	//_________________________________________________________________________________________
	// register a template
	registerTemplate( id, template ) {

		// Todo: implement displayment of duplicated templates
		if (!id || id && id.constructor !== String ||
			!template || template.constructor !== String)
		{
			console.log("fails", id, template);
			return false;
		}

		else if ( this.hasTemplate(id) ) {
			console.log("HTParser: duplicated template found: '%s'", id);
			return false;
		}

		this.templates[id] = new Classes.template( id, template.replace(/\s{2,}/g, "") );

		return true;
	}

	//_________________________________________________________________________________________
	// user entrance function to handle the params correctly
	//
	// param1 (string|TemplateObject) expects either the templateId or a template instance
	// param2 (object) expects the markup of the template
	//
	parse( templateDefinition, markup, displayTime = true ) {

		if ( !templateDefinition || markup && markup.constructor !== Object )
			return "";

		let template = "";

		template = ( templateDefinition instanceof Classes.template )
			? templateDefinition
			: this.getTemplate( templateDefinition );
		
		let start = Date.now();
		let content = this._parse( template, markup );
		let end = Date.now();

		if ( displayTime )
			console.log( "HTParser: parsing took %sms", (end - start) );

		return content;
	}

	//_________________________________________________________________________________________
	// actual template parsing
	//
	// param1 (TemplateClass) expects the template object
	// param2 (object) expects the object
	//
	_parse( template, markup ) {

		let content = this._processTemplate( template, markup, function( query ) {

			// use processing functions to get response
			let response = RequestProcessor.requestProcessor.processRequest( query );
			return response;
		});

		return content;
	}

	//_________________________________________________________________________________________
	// queries through the given template and executes the rule extraction regex onto it
	// builds the querry for the matched rule and builds, based on the returned response
	// of the callback, the content.

	_processTemplate( template, markup, _callback, _this = null ) {

		// register current template process
		let tProcess = this._createTProcess( template, markup );

		// constant values / they are used not changed
		let regExtractRule = Config.regex.extractRule();
		let callback = ( _callback && _callback.constructor == Function ) ? _callback.bind( _this || this ) : () => null;
		tProcess.baseMarkup = this._buildBaseMarkup( tProcess );

		// values that being ressigned while processing
		let rawRule = null;
		let content = template.value;
		let oldLastIndex = regExtractRule.lastIndex;
		let postQuerries = [];

		while ( rawRule = regExtractRule.exec(content) ) {
			
			let rule = this._buildRule( tProcess, rawRule[0] );
			let query = new Classes.query( tProcess.id, rule, content.substring(oldLastIndex), false );
			tProcess.currentQuery = query;

			// get and review response / the rule is used to build a default response
			let response = this._reviewProcessResponse( tProcess, callback( query ) );

			// track post queries
			if ( response.postQuery )
				postQuerries.push( response.postQuery );
			
			// adjust last index to avoid unecessary regex execution and fails when searching for rules
			// replacements smaller than the rule itself in length result in missing rules
			// written directly after the rule
			regExtractRule.lastIndex += (response.indexOffSet !== null)
				? Number(response.indexOffSet)
				: -(query.rule.length - response.value.length);

			// the last index is needed to create a substring from the content
			// to speed up the processing when the processing functions query inner rules
			oldLastIndex = regExtractRule.lastIndex;

			// !! THE HEART LINE of this framework !! YEAAAAAH !!
			// - and the one in the post query post processing
			//
			// finally replacing the content with its value
			// for semantic reason this has to happen after the index got adjusted
			// console.log(response);
			content = content.replace( response.replacement, query.options.wrap.replace( "|", response.value ) );
		}

		// process post queries
		postQuerries.forEach( (postQuery) => {

			let response = callback( postQuery );
			content = content.replace( response.replacement, response.value );
		});

		// delete process
		this._deleteTProcess( tProcess.id );

		return content;
	}

	//_________________________________________________________________________________________
	// builds the base markup for the processing template
	//
	// param1 (TemplateProcessClass) expects the template process instance
	//
	// return Object
	//
	_buildBaseMarkup( tProcess ) {

		if ( !tProcess || !(tProcess instanceof Classes.tprocess) )
			return {};

		let base = {};

		// Todo: implement relation to parent templates when a subprocess
		base.hp_templateId = tProcess.template.id || (tProcess.isSubProcess) ? "Subtemplate": "Undefined template id";

		return base;
	}

	//_________________________________________________________________________________________
	// builds the rule object for further processing
	//
	// param2 (TemplateProcessClass) expects the process instance
	// param2 (String) expects the raw rule
	//
	// return RuleClass
	//
	_buildRule( tProcess, rawRule ) {
		
		// build base rule
		let request = this._extractRulePiece( rawRule, Config.regex.extractRequest() ) || null;
		let key = this._extractRulePiece( rawRule, Config.regex.extractKey() ) || null;

		let options = Object.assign( {},
			Config.parsing.optionSets.default,
			Config.parsing.optionSets[ request ] || {}
		);
		let rule = new Classes.rule( rawRule, request, key, null, options );

		// the prio key is the value that defines the key of the markup
		// marker are referenced with there name in the markup
		// but the value for commands such as "template" or "foreach" are found under the key in the markup
		// therefor a priority key is needed to identify the corrent value from the markup
		let prioKey = key || request;
		let markup = Object.assign( {}, tProcess.baseMarkup, this._buildRuleMarkup( rule ), tProcess.userMarkup );

		// apply markup configurations
		let markupConfig = this._applyMarkupConfigOnRuleConfig( rule, markup[prioKey] );
		rule.options = markupConfig.options;
		rule.value = markupConfig.value;

		return rule;
	}

	//_________________________________________________________________________________________
	// applies the configuration of the markup onto the ones defined in the rule
	//
	// param1 (RuleClass) expects the rule instance
	// param2 (mixed) expects the configuration
	//
	// return Object
	//
	_applyMarkupConfigOnRuleConfig( rule, config ) {
		
		let processedConfig = { "value": null, "options": Object.assign({}, rule.options) };

		if ( !rule || !config )
			return processedConfig;
		
		if ( config.constructor === String )
			processedConfig.value = config;

		else if ( config.constructor === Function )
			processedConfig.value = config();
		
		else if ( config.constructor === Object ) {
			
			if ( config["value"] )
				processedConfig.value = (config.value.constructor === Function) ? config.value() : config.value;
			else
				processedConfig.value = config;
			
			if ( config["options"] )
				processedConfig.options = Object.assign( processedConfig.options, this._processOptions(config.options) );
		}

		else
			processedConfig.value = config;
		
		return processedConfig;
	}

	//_________________________________________________________________________________________
	// process options values / simple checks when the option value is a function
	// and overwrites the value with the returned value from the function
	//
	// param1 (Object) expects the options object
	//
	// return Object
	//
	_processOptions( options ) {

		if ( !options || options.constructor !== Object || !Object.keys(options).length )
			return {};

		for ( let option in options )
			if ( options[option] && options[option].constructor === Function )
				options[option] = options[option]();
		
		return options;
	}

	//_________________________________________________________________________________________
	// returns a markup based on the given rule
	//
	// param1 (RuleInstance) expects the process instance
	//
	// return Object
	//
	_buildRuleMarkup( rule ) {

		if ( !rule || !(rule instanceof Classes.rule) )
			return {};

		let markup = {
			"hp_rule": rule.rule,
			"hp_request": rule.request,
			"hp_key": rule.key || ""
		};
		
		for ( let i in rule.options ) {
			markup[`hp_option_${i}`] = rule.options[i];
		}

		return markup;
	}

	//_________________________________________________________________________________________
	// gets the request value as "value" and "options" object by the markup and rule
	//
	// param1 (string) expects the prioirity key of the rule
	// param2 (Object) expects the markup value
	//
	// return Object
	//
	_getRequestValue( prioKey, markup ) {

		let config = { "value": null, "options": {} };
		let value = markup[ prioKey ];

		if ( !value )
			return config;
		
		if ( value.constructor === String )
			config.value = value;
		
		else if ( value.constructor === Object ) {
			config.value = value["value"] || null;
			config.options = this._processOptions(value["options"]);
		}

		return config;
	}	

	//_________________________________________________________________________________________
	// extracts a value from a string with a given regex
	// a valid result will be qued through the possible matched groups and passed
	// to the callback and collected in an array that will be returned
	// when no callback is provided it returns either the first group
	// the raw match or an empty string
	//
	// param1 (string) expects the search string
	// param2 (RegExp) expects the regex
	// param3 (Function) (optional) expects a callback function
	//
	// return array
	//
	_extractRulePiece( source, regex, callback = null ) {
		
		let match = regex.exec( source );

		if ( !match )
			return null;
		
		if ( callback && callback.constructor === Function ) {

			let results = [];

			for ( let i = 1;; i++ ) {
				if ( !match[i] )
					break;
				results.push( callback(match[i]) );
			}
			return results;
		}
		
		return match[1] || match[0] || "";
	}

	//_________________________________________________________________________________________
	// builds the markup for the current query
	//
	// param1 (RuleClass) expects the current rule instance
	//
	// return Object
	//
	_buildQueryMarkup( rule, userMarkup ) {

		let markup = {};
		markup.hp_rule = rule.rule;
		markup.hp_request = rule.request;
		markup.hp_key = rule.key;

		let baseOptions = Config.parsing.defaultOptionSet;

		for ( let i in baseOptions ) {
			markup[`hp_option_${i}`] = baseOptions[i];
		}

		return markup;
	}

	//_________________________________________________________________________________________
	// checks the given response and corrects it if necessary
	//
	// param1 (ProcessResponse) expects the response instance
	// param2 (RuleClass) expects the processing rule instance
	//
	// return ProcessResponse
	//
	_reviewProcessResponse( tProcess, response ) {

		if ( !response || !(response instanceof Classes.processResponse) )
			return new Classes.processResponse( tProcess.currentQuery.rule, "", false );
		
		if ( !response.replacement || response.replacement.constructor !== String )
			response.replacement = rule.rule;
		
		if ( !response.value || response.value.constructor !== String && response.value.constructor !== Function )
			response.value = "";

		return response;
	}

	//_________________________________________________________________________________________
	// creates a new template process
	//
	// param1 (TemplateClass) expects the template instance
	//
	// return undefined | null | >0 Number
	//
	_createTProcess( template, markup ) {

		if ( !(template instanceof Classes.template) )
			return undefined;
		
		if ( this._hasTProcess(template.id) )
			return null;
		
		let freshId = this._getFreeTProcessId();
		this.tprocesses[freshId] = new Classes.tprocess( freshId, template, markup, Boolean(template.id) );

		return this._getTProcess( freshId );
	}

	//_________________________________________________________________________________________
	// deletes a template process
	_deleteTProcess( processId ) {

		if ( !this._getTProcess(processId) )
			return null;
		
		delete this.tprocesses[processId];

		return Boolean( this._getTProcess(processId) );
	}

	//_________________________________________________________________________________________
	// returns the existance of a process as a boolean
	_hasTProcess( processId ) {
		return Boolean( this.tprocesses[processId] );
	}

	//_________________________________________________________________________________________
	// returns a template process
	_getTProcess( processId ) {
		return this.tprocesses[processId];
	}

	//_________________________________________________________________________________________
	// returns a usable unique process id
	_getFreeTProcessId() {

		let id = ++Object.values(this.tprocesses).length;
		while ( this.tprocesses[this.tprocesses.length] )
			id++;

		return id;
	}

	//_________________________________________________________________________________________
	// defines either the full options of a template or a specific option
	//
	// param1 (String) expects the template id
	// param2 (String|Object) expects either the options object or the option key
	// param3 (mixed) expects the value for a option / only used when param2 is a string
	//
	// return Boolean
	//
	setTemplateOptions( templateId, definition, value ) {

		if ( !this.hasTemplate(templateId) )
			return false;
		
		if ( !definition && !value )
			this.getTemplate( templateId ).options = {};
		
		else if ( definition.constructor === Object )
			this.getTemplate( templateId ).options = definition;

		else if ( definition.constructor === String )
			this.getTemplate( templateId ).options[definition] = value;
		
		else
			return false;
		
		return true;
	}
	
	//_________________________________________________________________________________________
	// returns a template
	//
	// param1 (String) expects the template id
	//
	// return null | TemplateClass
	//
	getTemplate( templateId ) {

		if (!this.templates[templateId])
			return null;

		return this.templates[templateId];
	}

	//_________________________________________________________________________________________
	// extracts a substring from a string
	//
	// param1 (string|object) expects either the template as string or the object instance
	// param2 (RuleClass) expects the rule instance
	//
	// return null | string
	//
	getSubTemplate( templateDefinition, rule ) {

		if ( !_template || !request || !key )
			return null;

		let template = this.hasTemplate(templateDefinition) ? this.getTemplate(templateDefinition) : templateDefinition;

		let subtemplate = Config.regex.extract_area(request, key).exec(template)[1];

		return subtemplate;
	}

	//_________________________________________________________________________________________
	// returns the existance of a template
	//
	// return boolean
	//
	hasTemplate( templateId ) {
		return Boolean(this.templates[templateId]);
	}

	//_________________________________________________________________________________________
	//

}();

//_____________________________________________________________________________________________
//
},{"./classes.js":1,"./config.js":2,"./requestProcessor.js":4}],4:[function(require,module,exports){
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

		let response = new Classes.processResponse( query.rule, "no data found", false );



		// return 
	}

	//_________________________________________________________________________________________
	//

}();

//_____________________________________________________________________________________________
//

},{"./classes.js":1,"./config.js":2,"./parser.js":3}],5:[function(require,module,exports){
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
	},

	"vocabulary-add": {
		"form-section-title": "Vokabular",
		"form-items": [
			{ "form-attribute-for": "form-vocabulary-add", "form-label": "Vokabel" },
			{ "form-attribute-for": "form-language-add", "form-label": "Sprache" },
		]
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
		"test-round-and-round",
		"vocabulary-add"
	];

	// define test template
	let testNumbers = [8];

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

},{"../src/parser.js":3}]},{},[5]);
