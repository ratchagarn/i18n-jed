# i18n-jed
Node module use for translate language that can use in `server`, `template (jade)` and `client` (Support only Express 4)

## Version 0.2.0


## Change log


### 0.2.0
- Change how to set locales
- Using `json` instead of `js`


### 0.1.0

- Init project.


### Seting locale files
Open i18n-jed directories and then create `locales` folder. You can create/edit translate resources here.
You must use file name with lang code `english = en (en.json), thai = th (th.json)`

example locales content (th.json):

```json
{
  "Hello": "สวัสดี"
}
```


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
<script src="i18n-jed-locales.js"></script>
```

```javascript
// Javascript

var i18n = new i18nJed({
  defaultLang: 'th'
});

(function(t) {

  var div = document.createElement('div');
  div.appendChild( document.createTextNode( t('Hello') ) ); // สวัสดี
  document.body.appendChild(div);

})(i18n.t)
```
