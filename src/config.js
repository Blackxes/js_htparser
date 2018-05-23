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

// general configuration
exports.config = {};

//_____________________________________________________________________________________________
// regex for extracting and filtering
exports.regex = {}

// matches a rule within a template
exports.regex.extract_rule = function () { return new RegExp("{{([^<>{}]*)}}", "g"); }

// filters a rule into the specific parts
// const HP_REGEX_FILTER_RULE = function() { return new RegExp(`{{\\s*(\\w+)\\s*(\\w*)[:]\\s*([\\w+\\.]*)\\s*|{{\\s*(\\w+)\\s*}}`, "g"); }
exports.regex.filter_rule = function() { return new RegExp("{{\\s*(\\w+)\\s*(\\w*)[:]\\s*(\\w*)\\s*}}|{{\\s*(\\w+)\\s*}}", "g"); }

// matches a complete substring from the template including content (can be accessed via group)
//
// param1 (string) expects the request key
// param2 (string) expects the value of the area / like the key
// param3 (object) expects the range for the area
//		begin -> determines the start of the string
// 		end -> determines the end of the string
//
exports.regex.extract_area = function(request, value, range = { "begin": "start", "end": "end" }) {
	return new RegExp(`{{\\s*${request}\\s+${range.begin}\\s*:\\s*${value}\\s*}}(.*){{\\s*${request}\\s+${range.end}\\s*:\\s*${value}\\s*}}`, "g");
}

//_____________________________________________________________________________________________
// rule parsing configuration
exports.config.ruleParsing = {};

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