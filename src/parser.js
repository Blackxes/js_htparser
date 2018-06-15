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
var RuleProcessor = require( "./ruleProcessor.js" );
var Classes = require( "./classes.js" );

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

			let templateId = el.dataset.templateId;

			if (!templateId)
				continue;

			if (!this.registerTemplate( templateId, el.innerHTML ))
				console.log("HTParser: registering template %s failed", templateId);
		}

		return true;
	}

	//_________________________________________________________________________________________
	// register a template
	registerTemplate( id, template ) {

		// Todo: implement displayment of duplicated templates

		if (!id || id && id.constructor !== String ||
			!template || template.constructor !== String)
		{
			return false;
		}

		else if ( this.hasTemplate(id) ) {
			console.log("HTParser: duplicate template: '%s'", id);
			return false;
		}

		this.templates[id] = new Classes.template( id, template.replace(/\s{2,}/g, "") );

		return true;
	}

	//_________________________________________________________________________________________
	// user entrance function to handle the params correctly
	parse( templateDefinition, markup ) {

		if ( !templateDefinition || markup && markup.constructor !== Object )
			return "";

		let template = "";

		if ( templateDefinition instanceof Classes.template )
			template = templateDefinition;
		else
			template = this.getTemplate( templateDefinition );

		let timeStart = Date.now();

		let result = this._parse ( template || "", markup || {} );

		console.log("HTParser: parsing took %dms", Date.now() - timeStart);

		return result;
	}

	//_________________________________________________________________________________________
	// actual template parsing
	_parse( _template, markup ) {

		let template = ( !(_template instanceof Classes.template ) ) ? new Classes.template( null, _template ) : _template;

		let content = this._queryTemplate( template, markup, function( query ) {

			// use processing functions to get response
			let response = RuleProcessor.ruleProcessor.parse( query );

			return response;
		});

		return content;
	}

	//_________________________________________________________________________________________
	// executes the regex onto the given templates
	_queryTemplate( template, _markup, _callback, _this = null ) {

		// console.log("QueryT: ", template, _markup);

		// constant values
		let regex = Config.regex.extract_rule();
		let markup = this._prepareMarkup( template, _markup );
		let callback = (_callback && _callback.constructor == Function) ? _callback.bind(_this || this) : function() {};

		// progressing
		let content = template.value;
		let postQueries = [];
		let match = null;
		let oldLastIndex = regex.lastIndex;

		// query templates marker
		while (match = regex.exec( content )) {

			let rule = this._filterRule( match[0] );

			// console.log("Match: %s (%d) %s \n\t%o", template.id || "not given", regex.lastIndex, rule.rule, markup);

			let subTemplate = content.substring( oldLastIndex );

			let query = this._prepareQuery( rule, subTemplate, markup );

			// console.log("QT: Query: %o", query);

			let response = callback( query );

			// console.log("QT: CallbackResponse: %o", response);

			// post queries needs to be parsed later on because they depend
			// on other requests to be proceeded before
			if (response.postQuery)
				postQueries.push( response.postQuery );

			// adjust types cause the processing functions might not return a string but null
			else {

				if ( response.replacement && response.replacement.constructor !== String)
					response.replacement = String(response.replacement);

				if ( response.value && response.value.constructor !== String || response.value.constructor !== Function )
					response.value = String(response.value);
			}

			oldLastIndex = regex.lastIndex;

			// calculate the regex iterator position change cause the replaced substring within the content
			// changed but the iterator still pointing to the position before the change
			// implement debugging displayment / current-last index
			let indexAdjustment = -(query.rule.length - response.value.length);
			regex.lastIndex += indexAdjustment;

			let oldContent = content;

			// console.log("Response (%s): %o", query.rule, response.value);

			content = content.replace( response.replacement, response.value || "" );

			// console.log("Content (Old:%d New:%d Adjust:%d): \n\tOld: %s \n\tNew: %s", oldLastIndex, regex.lastIndex, indexAdjustment, oldContent, content);
			// console.log("------------------------------------------");
		}

		// some querries rely on others and need to be executed later on
		// eg. the template requests a template thats been used and declared
		// later in the same template / that template is known by the parser later on
		postQueries.forEach( (postQuery) => {

			// console.log("PostQuery", postQuery.rule);

			// when template is not giving at this time / it cant be parsed
			if ( !postQuery.template )
				content = content.replace( postQuery.rule, "" );

			let response = RuleProcessor.ruleProcessor.parse( postQuery );
			content = content.replace( response.replacement, response.value );

			// console.log("PostQuerries Done");
		});

		// console.log("Parsing Done \n\tFinal Content: %s\n------------------------------------------------------", content);

		return content;
	}

	//_________________________________________________________________________________________
	// splits given rule into its pieces and returns an assossiated object
	_filterRule( rawRule ) {

		// Todo: implement display of invalid parameter
		if ( !rawRule || rawRule.constructor !== String )
			return new Classes.rule();

		let pieces = Config.regex.filter_rule().exec( rawRule );

		if (!pieces) {

			console.warn("HTParser: Invalid rule found: %s", rawRule);
			return new Classes.rule( rawRule, null, null, null );
		}

		// rule / request / operator / key
		let rule = new Classes.rule(
			pieces[0] || rawRule,
			pieces[1] || pieces[4],
			pieces[2],
			pieces[3]
		);

		return rule;
	}

	//_________________________________________________________________________________________
	// general markup before the template is being parsed
	// marker like {{ hp_templateId }} are build in here
	//
	_prepareMarkup( template, _markup ) {

		// Todo: implement display of invalid parameter
		if ( !_markup || _markup.constructor !== Object )
			return {};

		let markup = Object.assign({}, _markup);
		markup.hp_templateId = template.id || null;

		return markup;
	}

	//_________________________________________________________________________________________
	// prepares the query for the processing functions
	_prepareQuery( rule, templateString, markup ) {

		let queryMarkup = {};
		queryMarkup.hp_rule = rule.rule || null;
		queryMarkup.hp_operator = rule.operator || null;
		queryMarkup.hp_key = rule.key || null;

		let query = new Classes.query(
			rule.rule, rule.request, rule.operator, rule.key,
			templateString, markup[ rule.key ] || markup[ rule.request ] || ""
		);

		// console.log("PQuery: \n\tRule: %s \n\tTemplate: %s \n\tMarkup: %o \n\tFinal Query: %o", rule.rule, templateString, markup, query);

		return query;
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

		let subtemplate = Config.regex.extract_area(request, key).exec(template)[1];

		return subtemplate;
	}

	//_________________________________________________________________________________________
	// returns the existance of a template
	hasTemplate( templateId ) {
		return Boolean(this.templates[templateId]);
	}

	//_________________________________________________________________________________________
	//

}();

//_____________________________________________________________________________________________
//
