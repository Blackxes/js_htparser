(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	main entry point

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/



//_____________________________________________________________________________________________
// controls update timing
document.addEventListener("DOMContentLoaded", () => {

	let parser = require("./src/parser.js").parser;

	document.getElementsByClassName("board")[0].innerHTML = parser.parse("testing", {
		
		"title": "was ist das für eine bullshit scheiße, ich weißt doch das",
		"title3": "Another title",
		"row": [
			{ "label1": "item1", "label2": "wusa", },
			{ "label1": "item1", "label2": "kaka", }
		],
		"label": "Test label",
	});

	return true;
});

//_____________________________________________________________________________________________
//
},{"./src/parser.js":3}],2:[function(require,module,exports){
//_____________________________________________________________________________________________
//*********************************************************************************************
//
//	defaults and configuration
//
//	Author: Alexander Bassov
//	Email: blackxes@gmx.de
//	Github: https://github.com/Blackxes
//
//*********************************************************************************************

var exports = module.exports = {};

// general configuration
exports.config = {};

//_____________________________________________________________________________________________
// regex for extracting and filtering
exports.regex = {}

// matches a rule within a template
exports.regex.extract_rule = HP_REGEX_EXTRACT_RULE = function () { return new RegExp("{{([^<>{}]*)}}", "g"); }

// filters a rule into the specific parts
// const HP_REGEX_FILTER_RULE = function() { return new RegExp(`{{\\s*(\\w+)\\s*(\\w*)[:]\\s*([\\w+\\.]*)\\s*|{{\\s*(\\w+)\\s*}}`, "g"); }
exports.regex.filter_rule = HP_REGEX_FILTER_RULE = function() { return new RegExp("{{\\s*(\\w+)\\s*(\\w*)[:]\\s*(\\w*)\\s*}}|{{\\s*(\\w+)\\s*}}", "g"); }

// matches a complete substring from the template including content (can be accessed via group)
exports.regex.extract_area = HP_REGEX_EXTRACT_AREA = function(request, value) { return new RegExp(`{{\\s*${request}\\s+start\\s*:\\s*${value}\\s*}}(.*){{\\s*${request}\\s+end\\s*:\\s*${value}\\s*}}`, "g"); }

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

var exports = module.exports = {};

var HP_Config = require ("./config.js");
var HP_RuleProcessor = require ("./ruleprocessor.js").ruleProcessing;
var HP_Rule = require ("./rule.js").rule;

//_____________________________________________________________________________________________
exports.parser = new class HTMLParserClass {

	//_________________________________________________________________________________________
	constructor() {

		this.templates = {};
		this.processingMarkup;

		this.loadTemplates();
	}

	//_________________________________________________________________________________________
	// loads templates from the dom / must be accessable with this selector
	// template#templates
	//
	loadTemplates() {
		
		let raw = document.querySelector("template#templates").content.children;

		for (let index in raw) {

			if (!raw.hasOwnProperty(index))
				continue;
			
			let el = raw[index];
			let templateid = el.getAttribute("template-id");

			if (!templateid)
				continue;
			
			this.templates [templateid] = el.innerHTML.replace(/\s{2,}/g, "");
		}
	}

	//_________________________________________________________________________________________
	// user entrance function to handle the params correctly
	parse(template_id, _markup) {

		if ( !template_id || _markup && _markup.constructor !== Object || !this.hasTemplate(template_id) )
			return false;

		// Todo: implement display of invalid values
		let template = this.templates[template_id];
		let markup = (_markup) ? _markup : {};
		
		return this._parseTemplate(template, markup);
	}

	//_________________________________________________________________________________________
	// actual template parsing
	_parseTemplate(template, markup) {

		if ( !template || markup && markup.constructor !== Object )
			return false;
		
		let content = template;
		
		// extract and parse marker within template
		let match = null;
		let regexExtractRule = HP_Config.regex.extract_rule();
		
		while ( match = regexExtractRule.exec(content) ) {
			
			// Match: match/rule, request, operator, key, markerkey
			// Rule: rule, request, operator, key, template, markup
			let pieces = HP_Config.regex.filter_rule().exec(match[0]) || {};

			let rule = new HP_Rule(
				pieces[0] || match[0],				// complete rule / when not given use match
				pieces[1] || pieces[4],				// request / either the command or the marker
				pieces[2],							// operator / not implement so far
				pieces[3],							// key of the request
				template,							// template of the match
				markup[pieces[4] || pieces[3]]		// value of the markup
			);
			
			let response = HP_RuleProcessor.parse( rule );

			// Todo: implement display of empty values / specifically undefined and null (not empty strings!)
			content = content.replace( response.replacement, response.value );

			// adjust regex last index because the content changed
			// to ensure the search get all rules this is needed
			regexExtractRule.lastIndex -= response.replacement.length - response.value.length || 0;
		}
		
		return content;
	}

	//_________________________________________________________________________________________
	// returns a template
	getTemplate(template_id) {

		if (!this.templates[template_id])
			return false;
		
		return this.templates[template_id];			
	}

	//_________________________________________________________________________________________
	// returns the existance of a template
	hasTemplate(template_id) {
		return this.templates.hasOwnProperty(template_id);
	}

	//_________________________________________________________________________________________
	// 
	
}

//_____________________________________________________________________________________________
//
},{"./config.js":2,"./rule.js":6,"./ruleprocessor.js":7}],4:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	Todo: edit file description

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

var exports = module.exports = {};

//_____________________________________________________________________________________________
// process class / containg information about the current processing rule
exports.process = class ProcessClass {

	//_________________________________________________________________________________________
	constructor(rule, template, markup) {
		
		this.rule = rule || null;
		this.template = template || null;
		this.markup = markup || null;
	}

	//_________________________________________________________________________________________
	//
}

//_____________________________________________________________________________________________
//
},{}],5:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	Todo: edit file description

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

var exports = module.exports = {};

//_____________________________________________________________________________________________
// process class / containg information about the current processing rule
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
},{}],6:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	a rule is a set of information given by a definition within a template

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

var exports = module.exports = {};

//_____________________________________________________________________________________________
// contains information about the current rule and its values
exports.rule = class RuleClass {

	//_________________________________________________________________________________________
	constructor(rule, request, operator, key, template, markup) {

		this.rule = rule || null;
		this.request = request || null;
		this.operator = operator || null;
		this.key = key || null;
		this.template = template || null;
		this.markup = markup || null;
	}

	//_________________________________________________________________________________________
	//

}

//_____________________________________________________________________________________________
//
},{}],7:[function(require,module,exports){
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
},{"./config.js":2,"./parser.js":3,"./process.js":4,"./processresponse.js":5}]},{},[1]);
