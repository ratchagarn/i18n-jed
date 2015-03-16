# i18n-jed
Node module use for translate language that can use in `server`, `template (jade)` and `client` (Support only Express 4)

## Version 0.3.1


## Change log


### 0.3.1
- Using `vsprintf` for advance translate.
- Add `t` method to routing request for using i18n in routing.


### 0.3.0
- Change code structures.
- Optimize locales sources.


### 0.2.0
- Change how to set locales.
- Using `json` instead of `js`.


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

// set static path for client using `i18n-jed`
app.use(express["static"](path.join(__dirname, 'node_modules/i18n-jed')));

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
<script src="i18n-jed-locales.js"></script>
<!-- for using vsprintf -->
<script src="node_modules/sprintf-js/src/sprintf.js"></script>
<script src="i18n-jed.js"></script>
```

```javascript
// Javascript

i18nJed.init({
  defaultLang: 'th'
});

(function(t) {

  var div = document.createElement('div');
  div.appendChild( document.createTextNode( t('Hello') ) ); // สวัสดี
  document.body.appendChild(div);

})(i18n.t)
```
