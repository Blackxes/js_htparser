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
			this._prepareTemplate(this.templates[template]),
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
	// 


}
module.exports = new HTMLParser();

//_____________________________________________________________________________________________
//