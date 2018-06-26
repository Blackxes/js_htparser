"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i])}return o}return r})()({1:[function(require,module,exports){var Parser=require("./parser.js");exports.tprocess=function TemplateProcessClass(id,template,userMarkup,isSubProcess){_classCallCheck(this,TemplateProcessClass);this.id=id||null;this.template=template||null;this.userMarkup=userMarkup||null;this.baseMarkup=null;this.currentQuery=null;this.isSubProcess=isSubProcess||false};exports.template=function(){function TemplateClass(id,value,options){_classCallCheck(this,TemplateClass);this.id=id&&id.constructor===String?id:"";this._value=value||typeof value==="string"?value:"";this.options=options||{}}_createClass(TemplateClass,[{key:"value",get:function get(){if(!this._value&&this.id)return Parser.parser.getTemplate(this.id)._value;return this._value||""}}]);return TemplateClass}();exports.rule=function RuleClass(rule,request,key,value,options){_classCallCheck(this,RuleClass);this.rule=rule||null;this.request=request||null;this.key=key||null;this.value=value||null;this.options=options||null};exports.query=function(_exports$rule){_inherits(QueryClass,_exports$rule);function QueryClass(processId,rule,template){var isPostQuery=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;_classCallCheck(this,QueryClass);var _this2=_possibleConstructorReturn(this,(QueryClass.__proto__||Object.getPrototypeOf(QueryClass)).call(this,rule.rule,rule.request,rule.key,rule.value,rule.options));_this2.processId=processId;_this2.template=template||null;_this2.isPostQuery=isPostQuery||false;return _this2}return QueryClass}(exports.rule);exports.processResponse=function ProcessResponseClass(replacement,value,postQuery,indexOffSet){_classCallCheck(this,ProcessResponseClass);this.replacement=replacement||"";this.value=value||"";this.postQuery=postQuery!==undefined?postQuery:null;this.indexOffSet=indexOffSet!=undefined?indexOffSet:null;if(this.postQuery)this.postQuery.isPostQuery=true};var TemplatesClass=function(){function TemplatesClass(){_classCallCheck(this,TemplatesClass);this.templates={};this.templates["hp_debug_messages"]=this.hp_debug_messages()}_createClass(TemplatesClass,[{key:"hp_debug_messages",value:function hp_debug_messages(){return'\n\t\t\t<div class="hp-debug-messages">\n\t\t\t{{ foreach: hp_debug_messages }}\n\t\t\t\t<p>{{ message }}</p>\n\t\t\t{{ foreach end: hp_debug_messages }}\n\t\t\t</div>\n\t\t'}}]);return TemplatesClass}();exports.templates=(new TemplatesClass).templates},{"./parser.js":4}],2:[function(require,module,exports){exports.general={};exports.general.systemPrefix="hp_";exports.regex={};exports.regex.extractRule=function(){return new RegExp("{{([^<>]*?)}}","g")};exports.regex.extractRequest=function(){return new RegExp("([\\w-]+)(?:[\\w\\s:-]+)?","g")};exports.regex.extractKey=function(){return new RegExp("{{\\s*(?:[\\w-]+)\\s*:\\s*([\\w-]+)(?:[\\w\\s:-]+)?","g")};exports.regex.extractArea=function(query,id){return new RegExp(query.rule+"(.*?){{\\s*"+query.request+"\\s+end\\s*:\\s*"+id+"\\s*}}","g")};exports.debug={};exports.debug.display=true;exports.debug.display_trace=true;exports.parsing={};exports.parsing.optionSets={default:{render:true,wrap:"|"},templateInline:{renderInline:false}}},{}],3:[function(require,module,exports){exports.parser=require("./parser.js").parser;if(window)window.js_htparser=require("./parser.js").parser},{"./parser.js":4}],4:[function(require,module,exports){var Config=require("./config.js");var RequestProcessor=require("./requestProcessor.js");var Classes=require("./classes.js");exports.parser=new(function(){function HTMLParserClass(){_classCallCheck(this,HTMLParserClass);this.templates={};this.tprocesses={};this._latestProcessId=0;this._loadTemplates()}_createClass(HTMLParserClass,[{key:"_loadTemplates",value:function _loadTemplates(){var raw=document.querySelector("template#templates");if(!raw)return true;var children=raw.content.children;for(var index in children){if(!children.hasOwnProperty(index))continue;var el=children[index];var templateId=el.dataset.templateId;if(!templateId)continue;if(!this.registerTemplate(templateId,el.innerHTML))console.log("HTParser: registering template %s failed",templateId)}for(var i in Classes.templates){this.registerTemplate(i,Classes.templates[i])}return true}},{key:"registerTemplate",value:function registerTemplate(id,template){if(!id||id&&id.constructor!==String||!template||template.constructor!==String){console.log("fails",id,template);return false}else if(this.hasTemplate(id)){console.log("HTParser: duplicated template found: '%s'",id);return false}this.templates[id]=new Classes.template(id,template.replace(/\s{2,}/g,""));return true}},{key:"parse",value:function parse(templateDefinition,markup){var displayTime=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;if(!templateDefinition||markup&&markup.constructor!==Object)return"";var template="";template=templateDefinition instanceof Classes.template?templateDefinition:this.getTemplate(templateDefinition);var start=Date.now();var content=this._parse(template,markup);var end=Date.now();if(displayTime)console.log("HTParser: parsing took %sms",end-start);return content}},{key:"_parse",value:function _parse(template,markup){var content=this._processTemplate(template,markup,function(query){var response=RequestProcessor.requestProcessor.processRequest(query);return response});return content}},{key:"_processTemplate",value:function _processTemplate(template,markup,_callback){var _this=arguments.length>3&&arguments[3]!==undefined?arguments[3]:null;var tProcess=this._createTProcess(template,markup);var regExtractRule=Config.regex.extractRule();var callback=_callback&&_callback.constructor==Function?_callback.bind(_this||this):function(){return null};tProcess.baseMarkup=this._buildBaseMarkup(tProcess);var rawRule=null;var content=template.value;var oldLastIndex=regExtractRule.lastIndex;var postQuerries=[];while(rawRule=regExtractRule.exec(content)){var _rule=this._buildRule(tProcess,rawRule[0]);var query=new Classes.query(tProcess.id,_rule,content.substring(oldLastIndex),false);tProcess.currentQuery=query;var response=this._reviewProcessResponse(tProcess,callback(query));if(response.postQuery)postQuerries.push(response.postQuery);regExtractRule.lastIndex+=response.indexOffSet!==null?Number(response.indexOffSet):-(query.rule.length-response.value.length);oldLastIndex=regExtractRule.lastIndex;content=content.replace(response.replacement,query.options.wrap.replace("|",response.value))}postQuerries.forEach(function(postQuery){var response=callback(postQuery);content=content.replace(response.replacement,response.value)});this._deleteTProcess(tProcess.id);return content}},{key:"_buildBaseMarkup",value:function _buildBaseMarkup(tProcess){if(!tProcess||!(tProcess instanceof Classes.tprocess))return{};var base={};base[Config.general.systemPrefix+"templateId"]=tProcess.template.id||tProcess.isSubProcess?"Subtemplate":"Undefined template id";return base}},{key:"_buildRule",value:function _buildRule(tProcess,rawRule){var request=this._extractRulePiece(rawRule,Config.regex.extractRequest())||null;var key=this._extractRulePiece(rawRule,Config.regex.extractKey())||null;var options=Object.assign({},Config.parsing.optionSets.default,Config.parsing.optionSets[request]||{});var rule=new Classes.rule(rawRule,request,key,null,options);var prioKey=key||request;var markup=Object.assign({},tProcess.baseMarkup,this._buildRuleMarkup(rule),tProcess.userMarkup);var markupConfig=this._applyMarkupConfigOnRuleConfig(rule,markup[prioKey]);rule.options=markupConfig.options;rule.value=markupConfig.value;return rule}},{key:"_applyMarkupConfigOnRuleConfig",value:function _applyMarkupConfigOnRuleConfig(rule,config){var processedConfig={value:null,options:Object.assign({},rule.options)};if(!rule||!config)return processedConfig;if(config.constructor===String)processedConfig.value=config;else if(config.constructor===Function)processedConfig.value=config();else if(config.constructor===Object){if(config["value"])processedConfig.value=config.value.constructor===Function?config.value():config.value;else processedConfig.value=config;if(config["options"])processedConfig.options=Object.assign(processedConfig.options,this._processOptions(config.options))}else processedConfig.value=config;return processedConfig}},{key:"_processOptions",value:function _processOptions(options){if(!options||options.constructor!==Object||!Object.keys(options).length)return{};for(var option in options){if(options[option]&&options[option].constructor===Function)options[option]=options[option]()}return options}},{key:"_buildRuleMarkup",value:function _buildRuleMarkup(rule){var _markup;if(!rule||!(rule instanceof Classes.rule))return{};var markup=(_markup={},_defineProperty(_markup,Config.general.systemPrefix+"hp_rule",rule.rule),_defineProperty(_markup,Config.general.systemPrefix+"hp_request",rule.request),_defineProperty(_markup,Config.general.systemPrefix+"hp_key",rule.key||""),_markup);for(var i in rule.options){markup[Config.general.systemPrefix+"hp_option_"+i]=rule.options[i]}return markup}},{key:"_getRequestValue",value:function _getRequestValue(prioKey,markup){var config={value:null,options:{}};var value=markup[prioKey];if(!value)return config;if(value.constructor===String)config.value=value;else if(value.constructor===Object){config.value=value["value"]||null;config.options=this._processOptions(value["options"])}return config}},{key:"_extractRulePiece",value:function _extractRulePiece(source,regex){var callback=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;var match=regex.exec(source);if(!match)return null;if(callback&&callback.constructor===Function){var results=[];for(var i=1;;i++){if(!match[i])break;results.push(callback(match[i]))}return results}return match[1]||match[0]||""}},{key:"_reviewProcessResponse",value:function _reviewProcessResponse(tProcess,response){if(!response||!(response instanceof Classes.processResponse))return new Classes.processResponse(tProcess.currentQuery.rule,"",false);if(!response.replacement||response.replacement.constructor!==String)response.replacement=rule.rule;if(!response.value||response.value.constructor!==String&&response.value.constructor!==Function)response.value=String(response.value);return response}},{key:"_createTProcess",value:function _createTProcess(template,markup){if(!(template instanceof Classes.template))return undefined;if(this._hasTProcess(template.id))return null;var freshId=this._getFreeTProcessId();this.tprocesses[freshId]=new Classes.tprocess(freshId,template,markup,Boolean(template.id));return this._getTProcess(freshId)}},{key:"_deleteTProcess",value:function _deleteTProcess(processId){if(!this._getTProcess(processId))return null;delete this.tprocesses[processId];return Boolean(this._getTProcess(processId))}},{key:"_hasTProcess",value:function _hasTProcess(processId){return Boolean(this.tprocesses[processId])}},{key:"_getTProcess",value:function _getTProcess(processId){return this.tprocesses[processId]}},{key:"_getFreeTProcessId",value:function _getFreeTProcessId(){var id=++Object.values(this.tprocesses).length;while(this.tprocesses[this.tprocesses.length]){id++}return id}},{key:"setTemplateOptions",value:function setTemplateOptions(templateId,definition,value){if(!this.hasTemplate(templateId))return false;if(!definition&&!value)this.getTemplate(templateId).options={};else if(definition.constructor===Object)this.getTemplate(templateId).options=definition;else if(definition.constructor===String)this.getTemplate(templateId).options[definition]=value;else return false;return true}},{key:"getTemplate",value:function getTemplate(templateId){if(!this.templates[templateId]||!templateId.indexOf(Config.general.systemPrefix))return null;return this.templates[templateId]}},{key:"getTemplates",value:function getTemplates(){var templates={};for(var i in this.templates){if(i.indexOf(Config.general.systemPrefix))templates[i]=this.templates[i]}return templates}},{key:"getSubTemplate",value:function getSubTemplate(templateDefinition,rule){if(!_template||!request||!key)return null;var template=this.hasTemplate(templateDefinition)?this.getTemplate(templateDefinition):templateDefinition;var subtemplate=Config.regex.extract_area(request,key).exec(template)[1];return subtemplate}},{key:"hasTemplate",value:function hasTemplate(templateId){return Boolean(this.templates[templateId])}}]);return HTMLParserClass}())},{"./classes.js":1,"./config.js":2,"./requestProcessor.js":5}],5:[function(require,module,exports){var Config=require("./config.js");var Parser=require("./parser.js");var Classes=require("./classes.js");exports.requestProcessor=new(function(){function RequestProcessor(){_classCallCheck(this,RequestProcessor)}_createClass(RequestProcessor,[{key:"processRequest",value:function processRequest(query){if(String(query.options.render).toLowerCase()=="false")return new Classes.processResponse(query.rule,null,false);else if(!(query.request in this))return new Classes.processResponse(query.rule,query.value,false);return this[query.request](query)}},{key:"template",value:function template(query){if(!query.key)return null;if(!Parser.parser.hasTemplate(query.key))return new Classes.processResponse(query.rule,!query.isPostQuery?query.rule:"",!query.isPostQuery?query:false,0);var response=new Classes.processResponse(query.rule,null,false);var content=Parser.parser.parse(query.key,query.value,false);response.value=content;return response}},{key:"templateInline",value:function templateInline(query){if(!query.key)return null;var response=new Classes.processResponse(query.rule,"",false);var templateMatch=Config.regex.extractArea(query,query.key).exec(query.template);if(!templateMatch)return response;if(!Parser.parser.registerTemplate(query.key,templateMatch[1]))return response;response.replacement=templateMatch[0];if(query.options.renderInline)response.value=Parser.parser.parse(query.key,query.value);return response}},{key:"foreach",value:function foreach(query){if(!query.key||!query.value||query.value&&query.value.constructor!==Array)return null;var response=new Classes.processResponse(query.rule,"",false);var foreachMatch=Config.regex.extractArea(query,query.key).exec(query.template);if(!foreachMatch)return response;response.replacement=foreachMatch[0];var template=foreachMatch[1];var content="";query.value.forEach(function(currentMarkup){content+=Parser.parser.parse(new Classes.template(null,template),currentMarkup,false)});response.value=content;return response}},{key:"debug",value:function debug(query){var response=new Classes.processResponse(query.rule,"no data found",false);response.value="Currently not implemented!";return response}}]);return RequestProcessor}())},{"./classes.js":1,"./config.js":2,"./parser.js":4}]},{},[3]);