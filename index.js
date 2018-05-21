"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	function r(e, n, t) {
		function o(i, f) {
			if (!n[i]) {
				if (!e[i]) {
					var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
				}var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
					var n = e[i][1][r];return o(n || r);
				}, p, p.exports, r, e, n, t);
			}return n[i].exports;
		}for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
			o(t[i]);
		}return o;
	}return r;
})()({ 1: [function (require, module, exports) {
		//_____________________________________________________________________________________________
		/**********************************************************************************************
  
  	testing file
  
  	@Author: Alexander Bassov
  	@Email: blackxes@gmx.de
  	@Github: https://www.github.com/Blackxes
  
  /*********************************************************************************************/

		// export for index.js
		module.exports = require("./src/Parser.js");

		//_____________________________________________________________________________________________
		document.addEventListener("DOMContentLoaded", function () {

			parser.Init();

			var markup = {
				"title": "sick title",
				"description": "My own and simple description",
				"fruits": [{ "fruit": "apple" }, { "fruit": "avocado" }, { "fruit": "breadfruit" }, { "fruit": "cherry" }, { "fruit": "grapefruit" }],
				"subtemplate": {
					"title": "Im a subtemplate!"
				}
			};

			var result = parser.parse("test", markup);

			document.getElementById("app").innerHTML = result;
		});

		//_____________________________________________________________________________________________
		//


		/*
  Probability calculation of a vocabulary pick
  -117.46 (1.1^(-x)) + 117.46
  */
	}, { "./src/Parser.js": 4 }], 2: [function (require, module, exports) {
		//_____________________________________________________________________________________________
		/**********************************************************************************************
  
  	contains several container classes
  
  	@Author: Alexander Bassov
  	@Email: blackxes@gmx.de
  	@Github: https://www.github.com/Blackxes
  
  /*********************************************************************************************/

		var exports = module.exports = {};

		// includes
		var HP_Parser = require("./Parser.js");

		//_____________________________________________________________________________________________
		// contains information about a template
		exports.template = function () {

			//_________________________________________________________________________________________
			// param1 (string) expects either the template or template id
			// 		when the template id is given the template assigns it automatically when requesting
			//		when template is given no id is needed / the raw template has a higher priority
			function templateClass(value) {
				_classCallCheck(this, templateClass);

				this._value = "";
				this.id = "";

				if (value) {
					if (HP_Parser.parser.hasTemplate(value)) {
						this._value = HP_Parser.parser.getTemplate(value);
						this.id = value;
					} else this._value = value;
				}
			}

			//_________________________________________________________________________________________


			_createClass(templateClass, [{
				key: "value",
				set: function set(template) {

					this._value = template || "";
				}

				//_________________________________________________________________________________________
				,
				get: function get() {

					// when template given
					if (this._value) return this._value;

					// try to get template by template id / assign as well
					else if (!this._value && this.id && HP_Parser.parser.hasTemplate(this.id)) {
							this._value = HP_Parser.parser.getTemplate(this.id);
							return this._value;
						}

					return null;
				}
			}]);

			return templateClass;
		}();

		//_____________________________________________________________________________________________
		// contains information about the current processing template and its request
		exports.query =

		//_________________________________________________________________________________________
		function QueryClass(rule, request, operator, key, template, markup, value) {
			_classCallCheck(this, QueryClass);

			this.rule = rule || null;
			this.request = request || null;
			this.operator = operator || null;
			this.key = key || null;
			this.template = template || null;
			this.markup = markup || null;
			this.value = value || null;
		}

		//_________________________________________________________________________________________
		//

		;

		//_____________________________________________________________________________________________
		// contains the final information about the string
		// thats being replaced with the assossiated value
		//
		exports.processResponse =

		//_________________________________________________________________________________________
		function ProcessResponseClass(replacement, value) {
			_classCallCheck(this, ProcessResponseClass);

			this.replacement = replacement || "";
			this.value = value || "";
		}

		//_________________________________________________________________________________________
		//
		;

		//_____________________________________________________________________________________________
		//
	}, { "./Parser.js": 4 }], 3: [function (require, module, exports) {
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
		exports.regex = {};

		// matches a rule within a template
		exports.regex.extract_rule = function () {
			return new RegExp("{{([^<>{}]*)}}", "g");
		};

		// filters a rule into the specific parts
		// const HP_REGEX_FILTER_RULE = function() { return new RegExp(`{{\\s*(\\w+)\\s*(\\w*)[:]\\s*([\\w+\\.]*)\\s*|{{\\s*(\\w+)\\s*}}`, "g"); }
		exports.regex.filter_rule = function () {
			return new RegExp("{{\\s*(\\w+)\\s*(\\w*)[:]\\s*(\\w*)\\s*}}|{{\\s*(\\w+)\\s*}}", "g");
		};

		// matches a complete substring from the template including content (can be accessed via group)
		exports.regex.extract_area = function (request, value) {
			return new RegExp("{{\\s*" + request + "\\s+start\\s*:\\s*" + value + "\\s*}}(.*){{\\s*" + request + "\\s+end\\s*:\\s*" + value + "\\s*}}", "g");
		};

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
	}, {}], 4: [function (require, module, exports) {
		//_____________________________________________________________________________________________
		/**********************************************************************************************
  
  	html template parsing class
  
  	@Author: Alexander Bassov
  	@Email: blackxes@gmx.de
  	@Github: https://www.github.com/Blackxes
  
  /*********************************************************************************************/

		var exports = module.exports = {};

		var HP_Config = require("./Config.js");
		var HP_RuleProcessor = require("./RuleProcessor.js");
		var HP_Classes = require("./Classes.js");

		//_____________________________________________________________________________________________
		exports.parser = new (function () {

			//_________________________________________________________________________________________
			function HTMLParserClass() {
				_classCallCheck(this, HTMLParserClass);

				this.templates = {};
				this.processingMarkup;

				this.Init();
			}

			//_________________________________________________________________________________________
			// loads templates from the dom / must be accessable with this selector
			// template#templates
			//


			_createClass(HTMLParserClass, [{
				key: "Init",
				value: function Init() {

					var raw = document.querySelector("template#templates");

					if (!raw) return true;

					var children = raw.content.children;

					for (var index in children) {

						if (!children.hasOwnProperty(index)) continue;

						var el = children[index];
						var templateid = el.getAttribute("template-id");

						if (!templateid) continue;

						this.templates[templateid] = el.innerHTML.replace(/\s{2,}/g, "");
					}
				}

				//_________________________________________________________________________________________
				// user entrance function to handle the params correctly

			}, {
				key: "parse",
				value: function parse(_template, markup) {

					var template = new HP_Classes.template(_template);

					if (!template.value || markup && markup.constructor !== Object) return false;

					return this._parse(template, markup);
				}

				//_________________________________________________________________________________________
				// actual template parsing

			}, {
				key: "_parse",
				value: function _parse(template, markup) {

					var content = template.value;

					// extract and parse marker within template
					var match = null;
					var regexExtractRule = HP_Config.regex.extract_rule();

					while (match = regexExtractRule.exec(content)) {

						// Match: 0.match/rule | 1.request | 2.operator | 3.key | 4.marker
						//
						var pieces = HP_Config.regex.filter_rule().exec(match[0]) || {};

						var query = new HP_Classes.query(pieces[0] || match[0], pieces[4] || pieces[1], pieces[2] || null, pieces[3], template, markup);

						// add additional marker
						query.markup = this._prepareMarkup(query);
						query.value = query.markup[query.key || query.request];

						var response = HP_RuleProcessor.ruleProcessor.parse(query);

						// Todo: implement display of empty values / specifically undefined and null (not empty strings!)
						content = content.replace(response.replacement, response.value);

						// adjust regex last index because the content changed
						// to ensure the search get all rules this is needed
						regexExtractRule.lastIndex -= response.replacement.length - response.value.length || 0;
					}

					return content;
				}

				//_________________________________________________________________________________________
				// adds additional marker to the markup

			}, {
				key: "_prepareMarkup",
				value: function _prepareMarkup(query) {

					var prepMarkup = query.markup || {};

					prepMarkup.hp_templateId = query.template.id;

					// kinda senseless / cause these values are defined when using them
					// {{ hp_rule }} result in {{ hp_rule }}
					// {{ hp_key }} result in nothing
					// {{ hp_request }} result for some reason in "request"
					prepMarkup.hp_rule = query.rule;
					prepMarkup.hp_key = query.key;
					prepMarkup.hp_request = query.request;

					if (Math.random() < 0.01) prepMarkup.hp_lel = "Super sick completely hidden easteregg";

					return prepMarkup;
				}

				//_________________________________________________________________________________________
				// returns a template

			}, {
				key: "getTemplate",
				value: function getTemplate(templateId) {

					if (!this.templates[templateId]) return false;

					return this.templates[templateId];
				}

				//_________________________________________________________________________________________
				// extracts a substring from a string

			}, {
				key: "getSubTemplate",
				value: function getSubTemplate(_template, request, key) {

					if (!_template || !request || !key) return "";

					var template = this.hasTemplate(_template) ? this.getTemplate(_template) : _template;

					var subtemplate = HP_Config.regex.extract_area(request, key).exec(template)[1];

					return subtemplate;
				}

				//_________________________________________________________________________________________
				// returns the existance of a template

			}, {
				key: "hasTemplate",
				value: function hasTemplate(templateId) {
					return this.templates.hasOwnProperty(templateId);
				}

				//_________________________________________________________________________________________
				// 

			}]);

			return HTMLParserClass;
		}())();

		//_____________________________________________________________________________________________
		//
	}, { "./Classes.js": 2, "./Config.js": 3, "./RuleProcessor.js": 5 }], 5: [function (require, module, exports) {
		//_____________________________________________________________________________________________
		/**********************************************************************************************
  
  	contains processing functions of the template library
  
  	@Author: Alexander Bassov
  	@Email: blackxes@gmx.de
  	@Github: https://www.github.com/Blackxes
  
  /*********************************************************************************************/

		var exports = module.exports = {};

		var HP_Config = require("./Config.js");
		var HP_Parser = require("./Parser.js");
		var HP_Classes = require("./Classes.js");

		//_____________________________________________________________________________________________
		exports.ruleProcessor = new (function () {

			//_________________________________________________________________________________________
			function RuleProcessorClass() {
				_classCallCheck(this, RuleProcessorClass);
			}

			//_________________________________________________________________________________________
			// parses the given rule


			_createClass(RuleProcessorClass, [{
				key: "parse",
				value: function parse(query) {

					// initial definition
					var response = new HP_Classes.processResponse(query.rule, query.value);

					// on empty request / due to the way the parsing works
					// this automatically being replaced with empty content
					if (!query.request) {
						console.log("Missing Request: %o", query.rule);
						// Todo: implement display of empty requests
					}

					// on a simple marker
					else if (!query.key) {
							if (query.value === undefined) console.log("Missing Key: %s", query.request);
							// Todo: implement display of invalid values (when marker is missing value)
						}

						// on command request / with(out) operator
						else if (query.request) {

								// single commands
								var func = "" + query.request + (query.operator ? "_" + query.operator : "");

								if (func in this) {
									var result = this[func](query);
									response = result || response;
								} else console.log("Invalid Request: '%s'", query.request);
							}

					return response;
				}

				//_________________________________________________________________________________________
				// replaces current scope with the result of another template

			}, {
				key: "template",
				value: function template(query) {

					var content = "";

					// Todo: implement display of invalid values
					var response = new HP_Classes.processResponse(query.rule, HP_Parser.parser.parse(query.key, query.markup[query.key]));

					return response;
				}

				//_________________________________________________________________________________________
				// repeats inner content until condition is false

			}, {
				key: "foreach_start",
				value: function foreach_start(query) {

					// Todo: implement display of invalid values
					if (!query.rule || query.value && query.value.constructor !== Array) return null;

					// Todo: implement display of invalid subtemplate / base template as backup is used
					var templatePieces = HP_Config.regex.extract_area("foreach", query.key).exec(query.template.value);

					var content = "";

					// Todo: implement display of invalid markups
					for (var index in query.value) {

						if (!(index in query.value)) continue;

						var markup = query.value[index];

						// add index / humanized and raw
						markup.hp_index = parseInt(index) + 1;
						markup.hp_index_raw = index;

						content += HP_Parser.parser._parse(new HP_Classes.template(templatePieces[1]), markup);
					};

					var response = new HP_Classes.processResponse(templatePieces[0], content);

					return response;
				}

				//_________________________________________________________________________________________
				// displays the current process markup

			}, {
				key: "debug",
				value: function debug(process) {

					var parser = require("./parser.js");
					var content = "";
					var markup = {};

					// when undefined value given
					if (process.markup === null) content = "Undefined";

					// when array or object
					else if (process.markup.constructor === Array || process.markup.constructor === Object) {
							for (var i in process.markup) {
								var item = process.markup[i];

								content += item + "<br>";
							}
						}

						// when a simple value
						else content = process.markup;

					var response = new HP_Classes.processResponse(process.rule.rule, content);

					return response;
				}

				//_________________________________________________________________________________________
				//

			}]);

			return RuleProcessorClass;
		}())();

		//_____________________________________________________________________________________________
		//
	}, { "./Classes.js": 2, "./Config.js": 3, "./Parser.js": 4, "./parser.js": 6 }], 6: [function (require, module, exports) {
		arguments[4][4][0].apply(exports, arguments);
	}, { "./Classes.js": 2, "./Config.js": 3, "./RuleProcessor.js": 5, "dup": 4 }] }, {}, [1]);
