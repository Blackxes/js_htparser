
# *outdated! - documentation on v3 follows*
# HTML Template parser v2 

a simple template markup parse to use within your html
to build dynamic html content

this parser searches the body container of the html document for a
"templates" template element and extracts the inner templates.

```html
<templates id="templates">
	<!-- Hi im a test template -->
	<template template-id="test-template">
		<p>Test Content</p>
	</template>
</template>
```

marker are now rules which describe a certain request to the parser.<br>
a rule looks like the following

```html
{{ request operator: value }}
```

the rule can be written in different ways wheres every writing
in other inpretation results.

## [ request ]
request have different meaning depending on the value

#### # marker
marker are request without any functionalities
they are just being replaced by the value defined in the given markup<br>
marker requests look like the following

```html
{{ marker }}
```

#### # single commands
single commands are a oneline command and are being replaced
by the parsed content from the command function<br>
single commands look like the following

```html
{{ command: value }}
```

#### # area commands
area commands are commands which affect more than its initial rule.
They look like the following

```html
{{ command start: value }}
/* html content */
{{ command end }}
```

when defining such rule its start, end point and content are being replaced
by the created content from the command

## [ operator ]
the operator describes what the command has to do.
An operator has an effect on the outcome of content the command creates.
More under "operator" functions.

## [ value ]
the value is important for commands to know which index to use in the
markup. When no value is given no content will be created.

---
# Commands

## [ foreach ]
foreach is like the foreach you know. It loops through the defined markup
value and parses every single item.

```html
<!-- template -->
<template template-id="fruit-template">
	{{ foreach start: fruits }}
		<p>{{ fruit }}</p>
	{{ foreach end: fruits }}
</template>
```

```javascript
// the parser
var parser = require( "js_htparser" ).parser;

// markup
var markup = fruits: [
		{ "fruit": "apple" },
		{ "fruit": "orange" },
		{ "fruit": "banana" }
	]
}

// parse content into "content"
var content = parser.parse( "fruit-template", markup );
```

```html
<!-- result -->
<p>apple</p>
<p>orange</p>
<p>banana</p>
```

## [ template ]
serves as either a placeholder for later defined templates or a template itself.
By defining the template command as a single line command will result in being interpreted
as a template placeholder:

```html
<!-- main template -->
<template template-id="cuptypes">
	<ul>
	{{ foreach start: cups }}
		<p>{{ cup }}</p>
	{{ foreach end: cups }}
	</ul>
</temlate>

<!-- subtemplate -->
<template template-id="template-placeholder">
	{{ template: cuptypes }}
</template>
```

```javascript
// parser
var parser = require( "js_htparser" ).parser;

// markup
var markup = {
	"cuptypes": {
		"cups": [
		    { "cup": "glass" },
		    { "cup": "goblet" },
		    { "cup": "mug" }
		]
	}
}

// parse content direct into a container
document.getElementById("app").innerHTML = parser.parse( "template-placeholder", markup );
```

By defining the request as a area command result in being interpreted as
a template itself:

```html
<template template-id="vegetables">
	{{ template start: feelings_on_vegetables }}
		<p>Olaf appreciates: {{ olaf_veg }}</p>
		<p>Peter disgraces: {{ peter_veg }}</p>
		<p>George exterminates: {{ george_veg }}</p>
	{{ template end: feelings_on_vegetables }}
</template>
```

```javascript
// parser
var parser = require( "js_htparser" );

// george specific function
var george_veg = () => { return "ogonori"; }

// markup
var markup = {
	"feelings_on_vegetables": {
		"olaf_veg": "kurrat",
		"peter_veg": "canna",
		"george_veg": george_veg()
	}
}

// store parsed content
var content = parser.parse( "feelings_on_vegetables", markup );
```
