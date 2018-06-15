"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i])}return o}return r})()({1:[function(require,module,exports){var Parser=require("./parser.js");exports.template=function(){function templateClass(id,value){_classCallCheck(this,templateClass);this.id=id&&id.constructor===String?id:"";this._value=value||typeof value==="string"?value:""}_createClass(templateClass,[{key:"value",get:function get(){if(!this._value&&this.id)return Parser.parser.getTemplate(this.id)._value;return this._value||""}}]);return templateClass}();exports.rule=function RuleClass(rule,request,operator,key){_classCallCheck(this,RuleClass);this.rule=rule||null;this.request=request||null;this.operator=operator||null;this.key=key||null};exports.query=function QueryClass(rule,request,operator,key,template,value){var isPostQuery=arguments.length>6&&arguments[6]!==undefined?arguments[6]:false;_classCallCheck(this,QueryClass);this.rule=rule||null;this.request=request||null;this.operator=operator||null;this.key=key||null;this.template=template||null;this.value=value||null;this.isPostQuery=isPostQuery||false;this.templateId=null};exports.processResponse=function ProcessResponseClass(replacement,value,postQuery){_classCallCheck(this,ProcessResponseClass);this.replacement=replacement||"";this.value=value||"";this.postQuery=postQuery!==undefined?postQuery:null};exports.postQuery=function(_exports$query){_inherits(PostQueryClass,_exports$query);function PostQueryClass(query,_template,_markup){_classCallCheck(this,PostQueryClass);var template=_template||query.template;var markup=_markup||query.markup;return _possibleConstructorReturn(this,(PostQueryClass.__proto__||Object.getPrototypeOf(PostQueryClass)).call(this,query.rule,query.request,query.operator,query.key,template,markup,query.value,true))}return PostQueryClass}(exports.query)},{"./parser.js":4}],2:[function(require,module,exports){exports.config={};exports.regex={};exports.regex.extract_rule=function(){return new RegExp("{{([^<>]*?)}}","g")};exports.regex.filter_rule=function(){return new RegExp("{{\\s*(\\w+)\\s*(\\w*)[:]\\s*([\\w\\-]*)\\s*}}|{{\\s*([\\w\\-]+)\\s*}}","g")};exports.regex.extract_area=function(request,operator,value){return new RegExp("{{\\s*"+request+"\\s*"+operator.begin+"\\s*:\\s*"+value+"\\s*}}(.*?){{\\s*"+request+"\\s*"+operator.end+"\\s*([\\w+]*):\\s*"+value+"\\s*}}","g")};exports.config.ruleParsing={}},{}],3:[function(require,module,exports){exports.parser=require("./parser.js").parser;if(window)window.js_htparser=require("./parser.js").parser},{"./parser.js":4}],4:[function(require,module,exports){var Config=require("./config.js");var RuleProcessor=require("./ruleProcessor.js");var Classes=require("./classes.js");exports.parser=new(function(){function HTMLParserClass(){_classCallCheck(this,HTMLParserClass);this.templates={};this._loadTemplates()}_createClass(HTMLParserClass,[{key:"_loadTemplates",value:function _loadTemplates(){var raw=document.querySelector("template#templates");if(!raw)return true;var children=raw.content.children;for(var index in children){if(!children.hasOwnProperty(index))continue;var el=children[index];var templateId=el.dataset.templateId;if(!templateId)continue;if(!this.registerTemplate(templateId,el.innerHTML))console.log("HTParser: registering template %s failed",templateId)}return true}},{key:"registerTemplate",value:function registerTemplate(id,template){if(!id||id&&id.constructor!==String||!template||template.constructor!==String){return false}else if(this.hasTemplate(id)){console.log("HTParser: duplicate template: '%s'",id);return false}this.templates[id]=new Classes.template(id,template.replace(/\s{2,}/g,""));return true}},{key:"parse",value:function parse(templateDefinition,markup){if(!templateDefinition||markup&&markup.constructor!==Object)return"";var template="";if(templateDefinition instanceof Classes.template)template=templateDefinition;else template=this.getTemplate(templateDefinition);var timeStart=Date.now();var result=this._parse(template||"",markup||{});console.log("HTParser: parsing took %dms",Date.now()-timeStart);return result}},{key:"_parse",value:function _parse(_template,markup){var template=!(_template instanceof Classes.template)?new Classes.template(null,_template):_template;var content=this._queryTemplate(template,markup,function(query){var response=RuleProcessor.ruleProcessor.parse(query);return response});return content}},{key:"_queryTemplate",value:function _queryTemplate(template,_markup,_callback){var _this=arguments.length>3&&arguments[3]!==undefined?arguments[3]:null;var regex=Config.regex.extract_rule();var markup=this._prepareMarkup(template,_markup);var callback=_callback&&_callback.constructor==Function?_callback.bind(_this||this):function(){};var content=template.value;var postQueries=[];var match=null;var oldLastIndex=regex.lastIndex;while(match=regex.exec(content)){var rule=this._filterRule(match[0]);var subTemplate=content.substring(oldLastIndex);var query=this._prepareQuery(rule,subTemplate,markup);var response=callback(query);if(response.postQuery)postQueries.push(response.postQuery);else{if(response.replacement&&response.replacement.constructor!==String)response.replacement=String(response.replacement);if(response.value&&response.value.constructor!==String||response.value.constructor!==Function)response.value=String(response.value)}var indexAdjustment=-(query.rule.length-response.value.length);regex.lastIndex+=indexAdjustment;oldLastIndex=regex.lastIndex;var oldContent=content;content=content.replace(response.replacement,response.value||"")}postQueries.forEach(function(postQuery){if(!postQuery.template)content=content.replace(postQuery.rule,"");var response=RuleProcessor.ruleProcessor.parse(postQuery);content=content.replace(response.replacement,response.value)});return content}},{key:"_filterRule",value:function _filterRule(rawRule){if(!rawRule||rawRule.constructor!==String)return new Classes.rule;var pieces=Config.regex.filter_rule().exec(rawRule);if(!pieces){console.warn("HTParser: Invalid rule found: %s",rawRule);return new Classes.rule(rawRule,null,null,null)}var rule=new Classes.rule(pieces[0]||rawRule,pieces[1]||pieces[4],pieces[2],pieces[3]);return rule}},{key:"_prepareMarkup",value:function _prepareMarkup(template,_markup){if(!_markup||_markup.constructor!==Object)return{};var markup=Object.assign({},_markup);markup.hp_templateId=template.id||null;return markup}},{key:"_prepareQuery",value:function _prepareQuery(rule,templateString,markup){var queryMarkup={};queryMarkup.hp_rule=rule.rule||null;queryMarkup.hp_operator=rule.operator||null;queryMarkup.hp_key=rule.key||null;var query=new Classes.query(rule.rule,rule.request,rule.operator,rule.key,templateString,markup[rule.key]||markup[rule.request]||"");return query}},{key:"getTemplate",value:function getTemplate(templateId){if(!this.templates[templateId])return false;return this.templates[templateId]}},{key:"getSubTemplate",value:function getSubTemplate(_template,request,key){if(!_template||!request||!key)return"";var template=this.hasTemplate(_template)?this.getTemplate(_template):_template;var subtemplate=Config.regex.extract_area(request,key).exec(template)[1];return subtemplate}},{key:"hasTemplate",value:function hasTemplate(templateId){return Boolean(this.templates[templateId])}}]);return HTMLParserClass}())},{"./classes.js":1,"./config.js":2,"./ruleProcessor.js":5}],5:[function(require,module,exports){var Config=require("./config.js");var Parser=require("./parser.js");var Classes=require("./classes.js");exports.ruleProcessor=new(function(){function RuleProcessorClass(){_classCallCheck(this,RuleProcessorClass)}_createClass(RuleProcessorClass,[{key:"parse",value:function parse(query){var response=new Classes.processResponse(query.rule,query.value,false);var func=""+query.request+(query.operator?"_"+query.operator:"");if(func in this)response=this[func](query);return response}},{key:"template",value:function template(query){var response=new Classes.processResponse(query.rule,"",false);if(Parser.parser.hasTemplate(query.key))response.value=Parser.parser._parse(Parser.parser.getTemplate(query.key),query.value);else if(query instanceof Classes.postQuery)return response;else{response.value=query.rule;response.postQuery=new Classes.postQuery(query,query.template,query.value)}return response}},{key:"template_inline",value:function template_inline(query){if(!query.key)throw new Error("HTParser: Command 'template inline' is missing template key to create new template. Template: "+query.key);var pieces=Config.regex.extract_area("template",{begin:"inline",end:""},query.key).exec(query.template);var response=new Classes.processResponse(pieces[0],"",false);Parser.parser.registerTemplate(query.key,pieces[1]);return response}},{key:"foreach_begin",value:function foreach_begin(query){if(!query.key){throw new Error("RParser 'foreach': invalidly defined. Template: "+query.template.id)}if(!(query.value instanceof Array)){console.warn("RParser 'foreach': invalid markup given. Expected Array");query.value=[]}var response=new Classes.processResponse(query.rule,"");var extractRegex=Config.regex.extract_area("foreach",{begin:"begin",end:"end"},query.key);var templatePieces=extractRegex.exec(query.template);if(!templatePieces){console.log("RParser 'foreach': template couldnt be extracted: %s",query.rule);return response}response.replacement=templatePieces[0];var template=new Classes.template(null,templatePieces[1]);var content="";query.value.forEach(function(markup){if(!markup||markup.constructor!==Object)return true;content+=Parser.parser._parse(template,markup)});response.value=content;return response}}]);return RuleProcessorClass}())},{"./classes.js":1,"./config.js":2,"./parser.js":4}]},{},[3]);