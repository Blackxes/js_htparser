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