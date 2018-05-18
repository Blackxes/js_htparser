
# HTML Template parser v2 ( incomplete )

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

```
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
<template template-id="fruit_template">
	{{ foreach start: fruits }}
		<p>{{ fruit }}</p>
	{{ foreach end: fruits }}
</template>
```

```javascript
// markup
var markup = {
	"fruits": [
		{ "fruit": "apple" },
		{ "fruit": "orange" },
		{ "fruit": "banana" }
	]
}

var parser = require ("./parser").parser;
var content = parser.parse( "fruit_template", markup );
```

```html
<!-- result -->
<p>apple</p>
<p>orange</p>
<p>banana</p>
```
