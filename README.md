# i18n-jed
Node module use for translate language that can use in `server`, `template (jade)` and `client` (Support only Express 4)

## Version 0.1.0


## Change log


### 0.1.0

- Init project.


### Seting locale files
Open i18n-jed directories see `locales` folder you can edit translate resources here.
You must create file name with lang code `enlish = en (en.js), thai = th (th.js)`

example locales content:

__lang['th'] = {

"Hello": "สวัสดี"

}


### Example

#### SERVER
```javascript

var i18n = require('i18n-jed');

// using with express
i18n.expressBind(app, {
  defaultLang: 'th' // set default language is `thai`
});

app.get('/home', function(req, res) {
  res.locals.greeting = i18n.t('Hello'); // สวัสดี
  res.render('home');
});
```

#### TEMPLATE (jade)

```javascript
h1= t('Hello') // สวัสดี
```

#### Client
```html
<!-- HTML -->
<script src="node_modules/i18n-jed/i18n-jed.js"></script>
<script src="node_modules/i18n-jed/locales.js"></script>
```

```javascript
// Javascript
var div = document.createElement('div');
div.appendChild( document.createTextNode( t('Hello') ) ); // สวัสดี
document.body.appendChild(div);
```
