//_____________________________________________________________________________________________
/**********************************************************************************************

	a rule is a set of information given by a definition within a template

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

var exports = module.exports = {};

//_____________________________________________________________________________________________
// contains information about the current rule and its values
exports.rule = class RuleClass {

	//_________________________________________________________________________________________
	constructor(rule, request, operator, key, template, markup) {

		this.rule = rule || null;
		this.request = request || null;
		this.operator = operator || null;
		this.key = key || null;
		this.template = template || null;
		this.markup = markup || null;
	}

	//_________________________________________________________________________________________
	//

}

//_____________________________________________________________________________________________
//