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
exports.general = {};

exports.general.systemPrefix = "hp_";

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
