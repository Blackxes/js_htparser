(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//_____________________________________________________________________________________________
/**********************************************************************************************

	testing file

	@Author: Alexander Bassov
	@Email: blackxes@gmx.de
	@Github: https://www.github.com/Blackxes

/*********************************************************************************************/

//_____________________________________________________________________________________________
document.addEventListener("DOMContentLoaded", function() {

	let markup = {
		"title": "sick title",
		"description": "My own and simple description",
		"fruits": [
			{ "fruit": "apple" },
			{ "fruit": "avocado" },
			{ "fruit": "breadfruit" },
			{ "fruit": "cherry" },
			{ "fruit": "grapefruit" }
		],
		"subtemplate": {
			"title": "Im a subtemplate!"
		}
	}

	let result = JsHTParser.parse("test", markup);

	document.getElementById("app").innerHTML = result;
});

//_____________________________________________________________________________________________
//



/*
Probability calculation of a vocabulary pick
-117.46 (1.1^(-x)) + 117.46
*/
},{}]},{},[1]);
