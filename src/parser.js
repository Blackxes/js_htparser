//_____________________________________________________________________________________________
/**********************************************************************************************

	html template parsing class

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/



// regex to match/extract sub strings within a template
//
// matches a rule within a template
const HP_REGEX_EXTRACT_RULE = function () { return new RegExp("{{([^<>])*}}", "g"); }

// filters a rule into the specific parts
// const HP_REGEX_FILTER_RULE = function() { return new RegExp(`{{\\s*(\\w+)\\s*(\\w*)[:]\\s*([\\w+\\.]*)\\s*|{{\\s*(\\w+)\\s*}}`, "g"); }
const HP_REGEX_FILTER_RULE = function() { return new RegExp("{{\\s*(\\w+)\\s*(\\w*)[:]\\s*(\\w*)\\s*}}|{{\\s*(\\w+)\\s*}}", "g"); }

//_____________________________________________________________________________________________
// contains information about the current rule and its values
class RuleClass {
	constructor(rule, request, operator, key, value, template) {
		this.rule = rule || null;
		this.request = request || null;
		this.operator = operator || null;
		this.key = key || null;
		this.value = value || null;
		this.template = template || null;
	}
}

//_____________________________________________________________________________________________
class HTMLParserClass {

	//_________________________________________________________________________________________
	constructor() {
		
		this.matchparser = require ("./matchparser.js");

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
		
		let content = this._parseTemplate(template, markup, (process) => {

			
			
			// process subpart within template in processing function
			if (process.commandName in this.processor) {
				return this.processor[process.commandName](process);
			}

			// else return marker value
			return process.markerValue;
		});
		
		console.log("-------------------\nContent: \n%s", content);
		
		return content;
	}

	//_________________________________________________________________________________________
	// executes the marker regex onto the template and the callback / 2 params are passed
	// command|marker (string) either its the command eg. "for" or "command" or the marker
	// value (string) the value of the command eg. its id
	//		nothing is passed when the command is a marker
	// subpart (string) the sub string from the template when a command is given
	//		will be replaced by the returned content of the command function
	// 
	_parseTemplate(template, markup, callback) {

		if ( !template || markup && markup.constructor !== Object || !callback || callback && callback.constructor !== Function )
			return false;
		
		let content = template;
		
		// extract and parse marker within template
		let match = null;
		let regexExtractRule = HP_REGEX_EXTRACT_RULE();
		
		while ( match = regexExtractRule.exec(content) ) {
			
			// rule pieces
			// 0 = full rule match
			// 1 = request
			// 2 = operator
			// 3 = value
			// 4 = marker / this is used as request when no command is defined
			//
			let pieces = HP_REGEX_FILTER_RULE().exec(match[0]);
			
			let rule = new RuleClass(
				pieces[0],									// complete rul
				pieces[1] || pieces[4],						// request / either the command or the marker
				pieces[2],									// operator / not implement so far
				pieces[3],									// key of the request
				markup[pieces[4]], 							// value of the markup
				match[1]									// template of the match
			);

			let process = this.matchparser.parse( rule, content );

			// update regex index since the content might changed
			regexExtractRule.lastIndex = process.regexIndex || regexExtractRule.lastIndex;

			console.log(process);

			// let result = callback( process );
		}
		
		throw new Error();
		
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
module.exports = new HTMLParserClass();