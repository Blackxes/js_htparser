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