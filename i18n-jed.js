/**
 * @author  Ratchagarn Naewbuntad (ratchagarn@gmail.com)
 * @link    https://github.com/ratchagrn/i18n-jed
 * @license http://opensource.org/licenses/MIT
 *
 * @version 0.3.1
 */


(function() {

'use strict';


/**
 * ------------------------------------------------------------
 * Check is server of client
 * ------------------------------------------------------------
 */

var isServer = false,
    isClient = false,
    slice = Array.prototype.slice,
    vsprintf = function(str) { return str; };


if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
  isServer = true;
}
if (typeof window !== 'undefined') {
  isClient = true;
}


/**
 * ------------------------------------------------------------
 * Load sprintf
 * ------------------------------------------------------------
 */

if (isServer) {
  vsprintf = require('sprintf-js').vsprintf;
}
else if (typeof window.vsprintf === 'function') {
  vsprintf = window.vsprintf;
}


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
 * Base function i18n
 * ------------------------------------------------------------
 */


var i18nJed = (function() {


  // current using language
  var _activeLang = 'en',

      /**
       * ------------------------------------------------------------
       * locales sources storage
       * ------------------------------------------------------------
       */

      _locales = {},


      /**
       * ------------------------------------------------------------
       * locales sources storage cache
       * ------------------------------------------------------------
       */

      _localesCache = {},


      /**
       * ------------------------------------------------------------
       * Default options
       * ------------------------------------------------------------
       */

      _defaultOptions = {
        defaultLang: 'en',
        locales: ['en', 'th'],
        cookieName: 'lang'
      },


      /**
       * ------------------------------------------------------------
       * Options for use in i18n
       * ------------------------------------------------------------
       */

      _options = {};


  /**
   * ------------------------------------------------------------
   * Public method
   * ------------------------------------------------------------
   */


  return {

    /**
     * Initialize for i18n
     * ------------------------------------------------------------
     * @name i18nJed.init
     * @param {Object} options for set
     * @return {Object} current using options
     */

    init: function(options) {
      if (options == null) { options = {}; }
      _options = extend( _defaultOptions, options );
      this.setActiveLang( _options.defaultLang );
      this.createLocaleSource();
    },


    /**
     * ------------------------------------------------------------
     * Create locale source from active string for server and client
     * (this function for Server only)
     * ------------------------------------------------------------
     * @name _createLocaleSource
     * @param {String} lang code for create locale source
     */

    createLocaleSource: function(langCode) {

      // this path for server only
      if (isServer) {

        // set default lang code for create
        if (langCode == null) { langCode = this.getActiveLang(); }


        /**
         * ------------------------------------------------------------
         * Load requrie files
         * ------------------------------------------------------------
         */

        var fs = require('fs');


        /**
         * ------------------------------------------------------------
         * Load all locales files and concat to single file
         * ------------------------------------------------------------
         */

        var publicFolder = __dirname + '/../../public',
            localesPath = publicFolder + '/locales',
            localeContent = '';


        // create locales folder if not exists
        if ( !fs.existsSync(localesPath) ) {
          fs.mkdirSync(localesPath);
        }

        fs.readdirSync(localesPath).forEach(function(file) {
          // read json file only
          if ( /.+\.json$/.test(file) ) {
            var content = fs.readFileSync(localesPath + '/' + file),
                targetLangCode = file.replace('.json', '');

            if (langCode === targetLangCode) {
              localeContent = content.toString();
              _localesCache = JSON.parse( localeContent );
            }
          }
        });


        /**
         * write all locales files into single file
         * ------------------------------------------------------------
         */

        var allResources = 'var __locales = ' + localeContent;

        // add comment at first line
        allResources = '/* This file generate by node modules `i18n-jed` */\n' +
                       allResources;


        var localesSourceDest = publicFolder + '/i18n-jed-locales.js';

        // write file
        fs.writeFileSync( localesSourceDest, allResources, 'UTF-8' );

      }


      if (isServer) {
        _locales = _localesCache;
      }
      else if (isClient) {
        _locales = window.__locales;
      }

    },


    /**
     * Get current using options
     * ------------------------------------------------------------
     * @name getOptions
     * @return {Object} current using options
     */

    getOptions: function() {
      return _options;
    },


    /**
     * wrapper function for translate language with `vsprintf`
     * ------------------------------------------------------------
     * @name i18nJed.t
     * @param {String} message for translate with `vsprintf`
     * @return {String} message after translate with `vsprintf`
     */

    t: function(msg) {
      var output = this.translate(msg);
      if (arguments.length > 1) {
        output = vsprintf( output, slice.call(arguments, 1) );
      }
      return output;
    },


    /**
     * Base function to translate wording
     * ------------------------------------------------------------
     * @name i18nJed.translate
     * @param {String} message for translate
     * @return {String} message after translate
     */
    
    translate: function(msg) {
      var output = msg;
      if (_locales[msg]) { output = _locales[msg]; }
      return output;
    },


    /**
     * Get current active language
     * ------------------------------------------------------------
     * @name i18nJed.setActiveLang
     * @return {String} language is active
     */

    getActiveLang: function() {
      return _activeLang;
    },


    /**
     * Set current active language for translate
     * ------------------------------------------------------------
     * @name i18nJed.setActiveLang
     * @param {String} language for active
     */

    setActiveLang: function(lang) {
      lang = lang.replace(/"/g, '');
      if (_options.locales.indexOf(lang) > -1) {
        _activeLang = lang;
      }
      else {
        console.warn('Not found locale "' + lang + '"');
      }

      // create new locale source
      if (isServer) {
        this.createLocaleSource();
      }
    }

  }

})();


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

    // init i18n
    i18nJed.init( options );

    // get options
    var i18nOption = i18nJed.getOptions(),
        previousActiveLang = i18nOption.defaultLang;

    // express 4
    app.use(function(req, res, next) {

      // get lang code from cookie for auto create new locate source
      var langFromCookie = req.cookies[i18nOption.cookieName];
      if (typeof langFromCookie === 'string') {
        langFromCookie = langFromCookie.replace(/"/g, '');
      }

      // auto set active lang if lang cookie is available
      if ( langFromCookie != null && langFromCookie !== previousActiveLang ) {
        i18nJed.setActiveLang( req.cookies[i18nOption.cookieName] );
        previousActiveLang = i18nJed.getActiveLang();
      }

      // using translate language in routing
      req.t = i18nJed.t
      // using translate language in template (jade)
      res.locals.t = i18nJed.t

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