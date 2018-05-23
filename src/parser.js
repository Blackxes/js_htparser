//_____________________________________________________________________________________________
/**********************************************************************************************

	html template parsing class

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

// includes
var HP_Config = require("./config.js");
var HP_RuleProcessor = require("./ruleProcessor.js");
var HP_Classes = require("./classes.js");

//_____________________________________________________________________________________________
exports.parser = new class HTMLParserClass {

	//_________________________________________________________________________________________
	constructor() {

		this.templates = {};

		this._loadTemplates();
	}

	//_________________________________________________________________________________________
	// loads templates from the dom
	_loadTemplates() {

		let raw = document.querySelector("template#templates");

		if (!raw)
			return true;
		
		let children = raw.content.children;

		for (let index in children) {

			if (!children.hasOwnProperty(index))
				continue;
			
			let el = children[index];
			let templateId = el.getAttribute("template-id");

			this.addTemplate( templateId, el.innerHTML );
		}

		return true;
	}

	//_________________________________________________________________________________________
	// adds another templates
	addTemplate( id, template ) {

		if (!id || id && id.constructor !== String ||
			!template || template.constructor !== String ||
			this.hasTemplate(id) )
		{
			return false;
		}
		
		this.templates[id] = template.replace(/\s{2,}/g, "");
		
		return true;
	}

	//_________________________________________________________________________________________
	// user entrance function to handle the params correctly
	parse( _template, markup ) {

		let template = new HP_Classes.template( _template );

		if ( !template.value || markup && markup.constructor !== Object )
			return false;
		
		return this._parse( template, markup );
	}

	//_________________________________________________________________________________________
	// actual template parsing
	_parse( template, markup ) {

		let content = template.value;
		
		// extract and parse marker within template
		let match = null;
		let regexExtractRule = HP_Config.regex.extract_rule();
		let postQueries = [];
		
		while ( match = regexExtractRule.exec(content) ) {

			let query = this._prepareQuery( match[0], template, markup );
			
			let response = HP_RuleProcessor.ruleProcessor.parse( query );
			
			content = content.replace( response.replacement, response.value );

			// adjust regex last index because the content changed
			// to ensure the search get all rules this is needed
			regexExtractRule.lastIndex -= response.replacement.length - response.value.length || 0;

			// post queries needs to be parsed later on because they depend
			// on other requests to be proceeded before
			if (response.postQuery)
				postQueries.push( response.postQuery );
		}

		// some querries rely on others and need to be executed later on
		// eg. the template requests a template thats been used and declared
		// later in the same template / that template is known by the parser later on
		postQueries.forEach( (postQuery) => {

			// when template is not giving at this time / it cant be parsed
			if ( !postQuery.template.value )
				content = content.replace( postQuery.rule, "" );
			
			let response = HP_RuleProcessor.ruleProcessor.parse( postQuery );
			content = content.replace( response.replacement, response.value );
		})
		
		return content;
	}

	//_________________________________________________________________________________________
	// splits a rule into its pieces and prepares it for use
	_prepareQuery( rule, template = null, markup = {}, debug ) {
		
		// Match: 0.match/rule | 1.request | 2.operator | 3.key | 4.marker
		//
		let pieces = HP_Config.regex.filter_rule().exec(rule) || {};

		let query = new HP_Classes.query(
			pieces[0] || rule,
			pieces[4] || pieces[1],
			pieces[2] || null,
			pieces[3],
			template,
			markup
		);

		// add additional marker
		query.markup = this._prepareMarkup( query );
		query.value = query.markup[ query.key || query.request ];

		return query;
	}
	
	//_________________________________________________________________________________________
	// adds additional marker to the markup
	_prepareMarkup( query ) {

		let prepMarkup = query.markup || {};

		prepMarkup.hp_templateId = query.template.id;

		// kinda senseless / cause these values are defined when using them
		// {{ hp_rule }} result in {{ hp_rule }}
		// {{ hp_key }} result in nothing
		// {{ hp_request }} result for some reason in "request"
		prepMarkup.hp_rule = query.rule;
		prepMarkup.hp_key = query.key;
		prepMarkup.hp_request = query.request;

		if (Math.random() < 0.01)
			prepMarkup.hp_lel = "Super sick completely hidden easteregg";

		return prepMarkup;
	}

	//_________________________________________________________________________________________
	// returns a template
	getTemplate( templateId ) {

		if (!this.templates[templateId])
			return false;
		
		return this.templates[templateId];			
	}

	//_________________________________________________________________________________________
	// extracts a substring from a string
	getSubTemplate( _template, request, key ) {

		if ( !_template || !request || !key )
			return "";
		
		let template = this.hasTemplate(_template) ? this.getTemplate(_template) : _template;

		let subtemplate = HP_Config.regex.extract_area(request, key).exec(template)[1];
		
		return subtemplate;
	}

	//_________________________________________________________________________________________
	// returns the existance of a template
	hasTemplate( templateId ) {
		return this.templates.hasOwnProperty(templateId);
	}

	//_________________________________________________________________________________________
	// 
	
}

//_____________________________________________________________________________________________
//