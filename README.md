# i18n-jed
Node module use for translate language that can use in server, template (jade) and client (Support only Express 4)

## Version 0.1.0


## Change log


### 0.1.0

- Init project.


### Example

```javascript
// SERVER

var i18n = require('i18n-jed');

// using with express
i18n.expressBind(app, {
  defaultLang: 'en'
});

app.get('/home', function(req, res) {
  res.locals.greeting = i18n.t('Hello');
  res.render('home');
});


// TEMPLATE (jade)

h1= t('Hello')
```

// CLIENT
```html
<script src="node_modules/i18n-jed/i18n-jed.js"></script>
<script src="node_modules/i18n-jed/locales.js"></script>
```

```javascript
var div = document.createElement('div');
div.appendChild( document.createTextNode( t('Hello') ) );
document.body.appendChild(div);
```