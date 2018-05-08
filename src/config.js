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

//_____________________________________________________________________________________________
(() => {
	//
	"use strict";

	// global objects
	var txTOParser = {};
	txTOParser.Config = {};	
	txTOParser.Debug = {};
	
	// parsed content
	txTOParser.parsedContent = "";
	
	// global permission to parse
	txTOParser.Config.parse = true;

	// permission to automatically initialize the manager
	// and load every template containing a valid otp attribute
	txTOParser.Config.autoload = true;

	// defines wether the templates shall be preparsed
	// if conditions are excluded! they are checked when template builds
	txTOParser.Config.preParseTemplates = false;
	
	// insert content into the dom when parsed
	txTOParser.Config.insertToDom = true;
	
	// element in which the parsed content shall be inserted
	txTOParser.Config.contentSelector = "#site";
	
	// checks the objects within the given template to preserve errors
	// and log when incorrect objects encountered / use this for debugging
	txTOParser.Debug.checkTObject = true;


	// contains every loaded template / id : template content
	txTOParser.Templates = {};
	
//_____________________________________________________________________________________________
})();