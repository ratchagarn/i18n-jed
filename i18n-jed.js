/**
 * @author  Ratchagarn Naewbuntad (ratchagarn@gmail.com)
 * @link    https://github.com/ratchagrn/i18n-jed
 * @license http://opensource.org/licenses/MIT
 *
 * @version 0.1.0
 */


(function() {

'use strict';


/**
 * ------------------------------------------------------------
 * Helper
 * ------------------------------------------------------------
 */

/**
 * Deep extend object.
 * ============================================================
 * @name extend
 * @param {Object} destination object.
 * @param {Object} object for extend to destination.
 * @return {Object} reference to destination.
 * See: http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
 */

function extend(dst, source) {
  for (var prop in source) {
    if (source[prop] && source[prop].constructor && source[prop].constructor === Object) {
      dst[prop] = dst[prop] || {};
      util.extend(dst[prop], source[prop]);
    } else {
      dst[prop] = source[prop];
    }
  }
  return dst;
}


/**
 * ------------------------------------------------------------
 * Check is server of client
 * ------------------------------------------------------------
 */

var isServer = false,
    isClient = false,
    lang = {};


if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
  isServer = true;
}
if (typeof window !== 'undefined') {
  isClient = true;
}


/**
 * ------------------------------------------------------------
 * Server side only
 * ------------------------------------------------------------
 */

if (isServer) {

  /**
   * ------------------------------------------------------------
   * Load requrie files
   * ------------------------------------------------------------
   */

  var fs = require('fs'),
      UglifyJS = require('uglify-js');


  /**
   * ------------------------------------------------------------
   * Load all locales files and concat to single file
   * ------------------------------------------------------------
   */

  var localesPath = __dirname + '/locales',
      concat = [];

  fs.readdirSync(localesPath).forEach(function(file) {
    var content = fs.readFileSync(localesPath + '/' + file);
    concat.push( content.toString() );
  });


  /**
   * write all locales files into single file
   * ------------------------------------------------------------
   */

  var allResources = 'var __lang = {};' +
                     concat.join(';') +
                     ';if(typeof exports !== "undefined"){' +
                     'module.exports=__lang;}';

  allResources = UglifyJS.minify( allResources, { fromString: true } ).code;

  var localesSource = __dirname + '/locales.js';

  // write file
  fs.writeFileSync( localesSource, allResources, 'UTF-8' );

}


// set language sources
var __lang = {},
    __activeLang = 'en';


if (isServer) {

  /**
   * Load language sources
   * ------------------------------------------------------------
   */

  __lang = require( localesSource );
}
else if (isClient) {

  /**
   * Get language sources from window object
   * you must include it before include i18n-jed
   * example:
   * <script src="i18n-jed/locales.js"></script>
   * <script src="i18n-jed/i18n-jed.js"></script>
   * ------------------------------------------------------------
   */

  __lang = window.__lang;
}


/**
 * ------------------------------------------------------------
 * Base function i18n
 * ------------------------------------------------------------
 */

var i18nJed = function(options) {
  if (options == null) { options = {}; }

  // default options
  this.options = {
    defaultLang: 'en',
    locales: ['en', 'th']
  };

  // merge options
  this.options = extend(this.options, options);

  // set current active language by default language
  __activeLang = this.options.defaultLang;
}


/**
 * ------------------------------------------------------------
 * i18n method
 * ------------------------------------------------------------
 */

i18nJed.prototype = {

  /**
   * Base function to translate wording
   * ------------------------------------------------------------
   * @name i18nJed.t
   * @param {String} wording for translate
   * @return {String} wording after translate
   */

  t: function(str) {
    var output = str,
        targetLang = __lang[__activeLang];

    if (targetLang && targetLang[str]) {
      output = targetLang[str];
    }

    return output;
  },


  /**
   * Get current active language
   * ------------------------------------------------------------
   * @name i18nJed.setActiveLang
   * @return {String} language is active
   */

  getActiveLang: function() {
    return __activeLang;
  },


  /**
   * Set current active language for translate
   * ------------------------------------------------------------
   * @name i18nJed.setActiveLang
   * @param {String} language for active
   */

  setActiveLang: function(lang) {
    lang = lang.replace(/"/g, '');
    if (this.options.locales.indexOf(lang) > -1) {
      __activeLang = lang;
    }
    else {
      console.warn('Not found locale "' + lang + '"');
    }
  }

}


/**
 * ------------------------------------------------------------
 * Server side only
 * ------------------------------------------------------------
 */

if (isServer) {

  /**
   * Use i18n in template
   * Example: h1= t('Hello') => 'Hallo' (Lang = de)
   * ------------------------------------------------------------
   * @name i18n.expressBind
   * @param {Object} application object (express)
   * @param {Options} options for i18n
   */

  i18nJed.expressBind = function(app, options) {
    if (!app) { return; }

    // express 4
    app.use(function(req, res, next) {

      var _i18nJed = new i18nJed(options);

      // set active lang if lang cookie is available
      if (req.cookies.lang) {
        _i18nJed.setActiveLang( req.cookies.lang );
      }

      // using translate language in template
      res.locals.t = _i18nJed.t
      next();
    });
  };

}


/**
 * ------------------------------------------------------------
 * Send i18n to side scope
 * ------------------------------------------------------------
 */

if (isServer) {
  module.exports = i18nJed;
}
else if (isClient) {
  window.i18nJed = i18nJed;
}


}).call(this);