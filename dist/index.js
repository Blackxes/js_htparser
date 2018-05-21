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
		var HP_Parser = require("./parser.js");

		exports.template = function () {
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

			_createClass(templateClass, [{
				key: "value",
				set: function set(template) {

					this._value = template || "";
				},
				get: function get() {
					if (this._value) return this._value;else if (!this._value && this.id && HP_Parser.parser.hasTemplate(this.id)) {
							this._value = HP_Parser.parser.getTemplate(this.id);
							return this._value;
						}

					return null;
				}
			}]);

			return templateClass;
		}();

		exports.query = function QueryClass(rule, request, operator, key, template, markup, value) {
			_classCallCheck(this, QueryClass);

			this.rule = rule || null;
			this.request = request || null;
			this.operator = operator || null;
			this.key = key || null;
			this.template = template || null;
			this.markup = markup || null;
			this.value = value || null;
		};

		exports.processResponse = function ProcessResponseClass(replacement, value) {
			_classCallCheck(this, ProcessResponseClass);

			this.replacement = replacement || "";
			this.value = value || "";
		};
	}, { "./parser.js": 4 }], 2: [function (require, module, exports) {
		exports.config = {};

		exports.regex = {};

		exports.regex.extract_rule = function () {
			return new RegExp("{{([^<>{}]*)}}", "g");
		};

		exports.regex.filter_rule = function () {
			return new RegExp("{{\\s*(\\w+)\\s*(\\w*)[:]\\s*(\\w*)\\s*}}|{{\\s*(\\w+)\\s*}}", "g");
		};

		exports.regex.extract_area = function (request, value) {
			return new RegExp("{{\\s*" + request + "\\s+start\\s*:\\s*" + value + "\\s*}}(.*){{\\s*" + request + "\\s+end\\s*:\\s*" + value + "\\s*}}", "g");
		};

		exports.config.ruleParsing = {};
	}, {}], 3: [function (require, module, exports) {
		exports.parser = require("./parser.js").parser;

		if (window) window.JsHTParser = require("./parser.js").parser;
	}, { "./parser.js": 4 }], 4: [function (require, module, exports) {
		var HP_Config = require("./config.js");
		var HP_RuleProcessor = require("./ruleProcessor.js");
		var HP_Classes = require("./classes.js");

		exports.parser = new (function () {
			function HTMLParserClass() {
				_classCallCheck(this, HTMLParserClass);

				this.templates = {};
				this.processingMarkup;

				this.Init();
			}

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
			}, {
				key: "parse",
				value: function parse(_template, markup) {

					var template = new HP_Classes.template(_template);

					if (!template.value || markup && markup.constructor !== Object) return false;

					return this._parse(template, markup);
				}
			}, {
				key: "_parse",
				value: function _parse(template, markup) {

					var content = template.value;

					var match = null;
					var regexExtractRule = HP_Config.regex.extract_rule();

					while (match = regexExtractRule.exec(content)) {
						var pieces = HP_Config.regex.filter_rule().exec(match[0]) || {};

						var query = new HP_Classes.query(pieces[0] || match[0], pieces[4] || pieces[1], pieces[2] || null, pieces[3], template, markup);

						query.markup = this._prepareMarkup(query);
						query.value = query.markup[query.key || query.request];

						var response = HP_RuleProcessor.ruleProcessor.parse(query);

						content = content.replace(response.replacement, response.value);

						regexExtractRule.lastIndex -= response.replacement.length - response.value.length || 0;
					}

					return content;
				}
			}, {
				key: "_prepareMarkup",
				value: function _prepareMarkup(query) {

					var prepMarkup = query.markup || {};

					prepMarkup.hp_templateId = query.template.id;

					prepMarkup.hp_rule = query.rule;
					prepMarkup.hp_key = query.key;
					prepMarkup.hp_request = query.request;

					if (Math.random() < 0.01) prepMarkup.hp_lel = "Super sick completely hidden easteregg";

					return prepMarkup;
				}
			}, {
				key: "getTemplate",
				value: function getTemplate(templateId) {

					if (!this.templates[templateId]) return false;

					return this.templates[templateId];
				}
			}, {
				key: "getSubTemplate",
				value: function getSubTemplate(_template, request, key) {

					if (!_template || !request || !key) return "";

					var template = this.hasTemplate(_template) ? this.getTemplate(_template) : _template;

					var subtemplate = HP_Config.regex.extract_area(request, key).exec(template)[1];

					return subtemplate;
				}
			}, {
				key: "hasTemplate",
				value: function hasTemplate(templateId) {
					return this.templates.hasOwnProperty(templateId);
				}
			}]);

			return HTMLParserClass;
		}())();
	}, { "./classes.js": 1, "./config.js": 2, "./ruleProcessor.js": 5 }], 5: [function (require, module, exports) {
		var HP_Config = require("./config.js");
		var HP_Parser = require("./parser.js");
		var HP_Classes = require("./classes.js");

		exports.ruleProcessor = new (function () {
			function RuleProcessorClass() {
				_classCallCheck(this, RuleProcessorClass);
			}

			_createClass(RuleProcessorClass, [{
				key: "parse",
				value: function parse(query) {
					var response = new HP_Classes.processResponse(query.rule, query.value);

					if (!query.request) {} else if (!query.key) {} else if (query.request) {
								var func = "" + query.request + (query.operator ? "_" + query.operator : "");

								if (func in this) {
									var result = this[func](query);
									response = result || response;
								} else console.log("Invalid Request: '%s'", query.request);
							}

					return response;
				}
			}, {
				key: "template",
				value: function template(query) {

					var content = "";

					var response = new HP_Classes.processResponse(query.rule, HP_Parser.parser.parse(query.key, query.markup[query.key]));

					return response;
				}
			}, {
				key: "foreach_start",
				value: function foreach_start(query) {
					if (!query.rule || query.value && query.value.constructor !== Array) return null;

					var templatePieces = HP_Config.regex.extract_area("foreach", query.key).exec(query.template.value);

					var content = "";

					for (var index in query.value) {

						if (!(index in query.value)) continue;

						var markup = query.value[index];

						markup.hp_index = parseInt(index) + 1;
						markup.hp_index_raw = index;

						content += HP_Parser.parser._parse(new HP_Classes.template(templatePieces[1]), markup);
					};

					var response = new HP_Classes.processResponse(templatePieces[0], content);

					return response;
				}
			}, {
				key: "debug",
				value: function debug(process) {

					var parser = require("./parser.js");
					var content = "";
					var markup = {};

					if (process.markup === null) content = "Undefined";else if (process.markup.constructor === Array || process.markup.constructor === Object) {
							for (var i in process.markup) {
								var item = process.markup[i];

								content += item + "<br>";
							}
						} else content = process.markup;

					var response = new HP_Classes.processResponse(process.rule.rule, content);

					return response;
				}
			}]);

			return RuleProcessorClass;
		}())();
	}, { "./classes.js": 1, "./config.js": 2, "./parser.js": 4 }] }, {}, [3]);
