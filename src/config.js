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

var exports = module.exports = {};

// general configuration
exports.config = {};

//_____________________________________________________________________________________________
// regex for extracting and filtering
exports.regex = {}

// matches a rule within a template
exports.regex.extract_rule = HP_REGEX_EXTRACT_RULE = function () { return new RegExp("{{([^<>{}]*)}}", "g"); }

// filters a rule into the specific parts
// const HP_REGEX_FILTER_RULE = function() { return new RegExp(`{{\\s*(\\w+)\\s*(\\w*)[:]\\s*([\\w+\\.]*)\\s*|{{\\s*(\\w+)\\s*}}`, "g"); }
exports.regex.filter_rule = HP_REGEX_FILTER_RULE = function() { return new RegExp("{{\\s*(\\w+)\\s*(\\w*)[:]\\s*(\\w*)\\s*}}|{{\\s*(\\w+)\\s*}}", "g"); }

// matches a complete substring from the template including content (can be accessed via group)
exports.regex.extract_area = HP_REGEX_EXTRACT_AREA = function(request, value) { return new RegExp(`{{\\s*${request}\\s+start\\s*:\\s*${value}\\s*}}(.*){{\\s*${request}\\s+end\\s*:\\s*${value}\\s*}}`, "g"); }

//_____________________________________________________________________________________________
// selector configuration
exports.config.templates = "template"
exports.config.templateAttr = "template-id"

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