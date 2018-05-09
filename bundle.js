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

	let TParser = require("./src/parser.js");

	TParser.parse("testing", {
		"title": "Test title",
		"label": "Test label",
		"row": [
			{ "label": "item label 1" },
			{ "label": "item label 2" }
		]
	});

	console.log("done");
});

//_____________________________________________________________________________________________
//
},{"./src/parser.js":2}],2:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	html template parsing class

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/



//_____________________________________________________________________________________________
class HTMLParser {

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
	parse(templateid, markup) {

		if ( !templateid || markup && markup.constructor !== Object || this.templates[templateid] === undefined )
			return false;

		let content = this._parse(
			this._prepareTemplate(this.getTemplate(templateid)),
			this._prepareMarkup(markup)
		);
		
		console.log("-------------------\nContent: \n%s", content);
		
		return content;
	}

	//_________________________________________________________________________________________
	// actual parsing
	_parse(givenTemplate, givenMarkup) {
		
		if ( !givenTemplate )
			return "";
		
		let template = givenTemplate;
		let markup = this._prepareMarkup( (givenMarkup) ? givenMarkup : {} );

		let regex = /{{\s*([\w\:\s]*)\s*}}/g;
		let marker = regex.exec(template);
		let match;

		while ( match = regex.exec(template) )
			console.log(match[1]);

		return true;
		
		for (let key in markup) {

			let item = markup[key];
			let content = "";

			// if (item.constructor === Array || item.constructor === Object)
				// content = this._parse( this._getSubpart(key),  )


			// console.log(key);

			// if (item && item.constructor === Array)
			// 	this._parse(template, item);
		}

		return "";
	}

	//_________________________________________________________________________________________
	// prepares the markup to be more safe to parse
	// rows needs to be placed at the beginning of the array because they can contain marker
	// which are samely labeled as the ones "above" the row config.
	// and since the template is being replaced with the configuration globaly to reduce
	// uneccessary string cut rows, deeep rows are being parsed first
	//
	_prepareMarkup(givenMarkup) {

		if ( !givenMarkup || givenMarkup && givenMarkup.constructor !== Array && givenMarkup.constructor !== Object )
			return {};
		
		let prepared = {};
		let markup = Object.assign({}, givenMarkup);

		for (let index in markup) {

			let item = markup[index];

			if (item.constructor !== Array && item.constructor !== Object)
				continue;

			prepared[index] = item;
		}
		prepared = Object.assign(prepared, markup);
		
		return prepared;
	}

	//_________________________________________________________________________________________
	// builds the actual element from a html string
	buildTemplate(templateid, givenMarkup = false, insert = null, givenSelector = null) {

		if ( !templateid || (givenMarkup && givenMarkup.constructor !== Object) || !this.templates[templateid] )
			return false;
		
		let template = this.templates[templateid];
		let markup = ( !givenMarkup || givenMarkup.constructor !== Object) ? {} : givenMarkup;
		let content = this.parse(template, markup);

		let wrapper = document.createElement("div");
		wrapper.innerHTML = content;
		
		if ( (insert !== null) && !insert || (insert === null) && !this.insert )
			return wrapper.children;
		
		if (!givenSelector && !this.selector)
			return false;

		let selector = givenSelector || this.selector;
		let container = document.querySelector(selector);
		let items = wrapper.children;

		for (let prop in items) {

			if (!items.hasOwnProperty(prop))
				continue;
			
			container.appendChild(items.item(prop));
		}
		
		return true;
	}

	//_________________________________________________________________________________________
	// returns a template
	getTemplate(templateid) {

		if (!this.templates[templateid])
			return false;
		
		return this.templates[templateid];			
	}

	//_________________________________________________________________________________________
	// 
	
}

//_____________________________________________________________________________________________
//
module.exports = new HTMLParser();
},{}]},{},[1]);
