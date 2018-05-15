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

	document.getElementsByClassName("board")[0].innerHTML = TParser.parse("testing", {
		"title": "Test title",
		"row": [
			{ "label1": "item1 label 1", "label2": "item1 label 2" },
		],
		"label": "Test label",
	});
});

//_____________________________________________________________________________________________
//
},{"./src/parser.js":4}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	parses a match within a template

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/



// includes
var Parser = require ("./parser.js");

// matches a complete substring from the template including content (can be accessed via group)
const HP_REGEX_AREA = function(request, value) { return new RegExp(`{{\\s*${request}\\s+start\\s*:\\s*${value}\\s*}}(.*){{\\s*${request}\\s+end\\s*}}`, "g"); }

//_____________________________________________________________________________________________
// represents a command with its information
class CommandClass {
	constructor(name, value) {
		this.name = name || null;
		this.value = value || null;
	}
}

//_____________________________________________________________________________________________
// process class / contains information about the current processing marker/command section
// within the template
class ProcessClass {
	constructor(request, value, template, replacement) {
		this.request = request || null;
		this.value = value || null;
		this.template = template || null;
		this.replacement = replacement || null;
	}
}

//_____________________________________________________________________________________________
class MatchParserClass {

	//_________________________________________________________________________________________
	constructor() {
		
		this.ruleprocessor = require ("./ruleprocessor.js");
	}

	//_________________________________________________________________________________________
	// extracts the command, command value and the subtemplate of the marker
	parse(rule) {
		
		let process = new ProcessClass();

		console.log(rule);

		throw new Error();

		// on empty request
		if ( !rule.request )
			return process;
		
		// on command request
		else if ( rule.request in this.ruleprocessor ) {

			process = this.ruleprocessor[rule.request]( rule );
			
			// console.log(process);

			return process;
		}

		// on simple marker
		else if ( !(rule.request in this) && (rule.value) ) {
			process.value = rule.value;
			process.request = rule.request;
		}

		// process.regexIndex = 4;

		return process;
		
		//----------------------------
		// extract values
		//
		// basic: {{ request(_start) : commandValue - arguments }} ( content {{ request : commandValue }} )
		// markerTemplate: content
		// replacement: {{ request : secondary - tertiary }} content {{ request }}
		//
		// with round brackets surrounded sections are optional - depending on the case
		// in that case the secondary/content/closing marker is not defined

		// request either a command or a marker
		// let requestParts = match[1].split(/[_\s]/);
		// let request = requestParts[0].trim();
		
		// // request value / only defined when a command is given
		// let value = match[2].trim();

		// Idea: implement arguments for commands besides the value itself
		// let tertiaryValue = null;

		//----------------------------
		// build process

		// on empty command
		if ( !value )
			return process;

		// on defined single command / not existing !
		else if ( requestParts[1].toLowerCase() === "start" && request && value )
			return this.buildCommandProcess();
		

		return process;
	}
	
	//_________________________________________________________________________________________
	// builds a command process
	buildCommandProcess(match) {
	}

	//_________________________________________________________________________________________
	// builds a marker process
	buildMarkerProcess(match) {

	}

	//_________________________________________________________________________________________
	// builds an area process
	buildAreaProcess(match) {

		// console.log()
	}

}
var MatchParser = new MatchParserClass();

//_____________________________________________________________________________________________
//
module.exports = MatchParser;
},{"./parser.js":4,"./ruleprocessor.js":5}],4:[function(require,module,exports){
(function (process){
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
}).call(this,require('_process'))
},{"./matchparser.js":3,"_process":2}],5:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	contains processing functions of the template library

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

// var Parser = require ("./parser.js");

//_____________________________________________________________________________________________
class ProcessorClass {

	//_________________________________________________________________________________________
	constructor() {}

	//_________________________________________________________________________________________
	// replaces current scope with the result of another template
	template(template, markup, value) {

		let content = "";

		return "";
	}

	//_________________________________________________________________________________________
	// repeats inner content until condition is false
	foreach(process) {

		console.log(process);

		throw new Error();

		// Todo: implement display of invalid values
		// if ( !process.markerValue || process.markerValue && process.markerValue.constructor !== Array )
		// 	return "";
		
		// let content = "";
		
		// Todo: implement display of invalid values
		// process.markerValue.forEach( (value, index) => {
		// 	content += (require ("./parser.js"))._parseTemplate(process.markerTemplate, value, (subProcess) => {
		// 		return subProcess.markerValue;
		// 	});
		// });
		
		return "";
	}

	//_________________________________________________________________________________________
	// displays the current process markup
	debug(process) {

		// console.log(process);

		return "";
	}
	
	//_________________________________________________________________________________________
	//
}

//_____________________________________________________________________________________________
//
module.exports = new ProcessorClass();
},{}]},{},[1]);
