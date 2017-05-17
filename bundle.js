/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pug_has_own_property = Object.prototype.hasOwnProperty;

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = pug_merge;
function pug_merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = pug_merge(attrs, a[i]);
    }
    return attrs;
  }

  for (var key in b) {
    if (key === 'class') {
      var valA = a[key] || [];
      a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
    } else if (key === 'style') {
      var valA = pug_style(a[key]);
      var valB = pug_style(b[key]);
      a[key] = valA + valB;
    } else {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Process array, object, or string as a string of classes delimited by a space.
 *
 * If `val` is an array, all members of it and its subarrays are counted as
 * classes. If `escaping` is an array, then whether or not the item in `val` is
 * escaped depends on the corresponding item in `escaping`. If `escaping` is
 * not an array, no escaping is done.
 *
 * If `val` is an object, all the keys whose value is truthy are counted as
 * classes. No escaping is done.
 *
 * If `val` is a string, it is counted as a class. No escaping is done.
 *
 * @param {(Array.<string>|Object.<string, boolean>|string)} val
 * @param {?Array.<string>} escaping
 * @return {String}
 */
exports.classes = pug_classes;
function pug_classes_array(val, escaping) {
  var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
  for (var i = 0; i < val.length; i++) {
    className = pug_classes(val[i]);
    if (!className) continue;
    escapeEnabled && escaping[i] && (className = pug_escape(className));
    classString = classString + padding + className;
    padding = ' ';
  }
  return classString;
}
function pug_classes_object(val) {
  var classString = '', padding = '';
  for (var key in val) {
    if (key && val[key] && pug_has_own_property.call(val, key)) {
      classString = classString + padding + key;
      padding = ' ';
    }
  }
  return classString;
}
function pug_classes(val, escaping) {
  if (Array.isArray(val)) {
    return pug_classes_array(val, escaping);
  } else if (val && typeof val === 'object') {
    return pug_classes_object(val);
  } else {
    return val || '';
  }
}

/**
 * Convert object or string to a string of CSS styles delimited by a semicolon.
 *
 * @param {(Object.<string, string>|string)} val
 * @return {String}
 */

exports.style = pug_style;
function pug_style(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    var out = '';
    for (var style in val) {
      /* istanbul ignore else */
      if (pug_has_own_property.call(val, style)) {
        out = out + style + ':' + val[style] + ';';
      }
    }
    return out;
  } else {
    val += '';
    if (val[val.length - 1] !== ';') 
      return val + ';';
    return val;
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = pug_attr;
function pug_attr(key, val, escaped, terse) {
  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
    return '';
  }
  if (val === true) {
    return ' ' + (terse ? key : key + '="' + key + '"');
  }
  if (typeof val.toJSON === 'function') {
    val = val.toJSON();
  }
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
    if (!escaped && val.indexOf('"') !== -1) {
      return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
    }
  }
  if (escaped) val = pug_escape(val);
  return ' ' + key + '="' + val + '"';
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} terse whether to use HTML5 terse boolean attributes
 * @return {String}
 */
exports.attrs = pug_attrs;
function pug_attrs(obj, terse){
  var attrs = '';

  for (var key in obj) {
    if (pug_has_own_property.call(obj, key)) {
      var val = obj[key];

      if ('class' === key) {
        val = pug_classes(val);
        attrs = pug_attr(key, val, false, terse) + attrs;
        continue;
      }
      if ('style' === key) {
        val = pug_style(val);
      }
      attrs += pug_attr(key, val, false, terse);
    }
  }

  return attrs;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var pug_match_html = /["&<>]/;
exports.escape = pug_escape;
function pug_escape(_html){
  var html = '' + _html;
  var regexResult = pug_match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the pug in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @param {String} str original source
 * @api private
 */

exports.rethrow = pug_rethrow;
function pug_rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || __webpack_require__(31).readFileSync(filename, 'utf8')
  } catch (ex) {
    pug_rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Pug') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Сравнивает объекты по значниию
 * @param {Object} src
 * @param {Object} dest
 * @returns {boolean}
 */
function deepEqual(src, dest) {
  return JSON.stringify(src) === JSON.stringify(dest);
}

/**
 * Поднимает первую букву строки в верхний регистр
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.deepEqual = deepEqual;
exports.capitalize = capitalize;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseView = exports.BaseView = function () {
    function BaseView(_ref) {
        var el = _ref.el;

        _classCallCheck(this, BaseView);

        this.el = el;
    }

    /**
     * Метод показывает view
     */


    _createClass(BaseView, [{
        key: "show",
        value: function show() {
            this.el.hidden = false;
        }

        /**
         * Метод скрывает view
         */

    }, {
        key: "hide",
        value: function hide() {
            this.el.hidden = true;
        }
    }]);

    return BaseView;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = exports.Router = function () {
    function Router(_ref) {
        var node = _ref.node,
            history = _ref.history;

        _classCallCheck(this, Router);

        this.node = node;
        this.history = history;

        this.routes = {};
    }

    /**
     * Регистрация маршрута
     * @param {string} route
     * @param {BaseView} view
     */


    _createClass(Router, [{
        key: 'register',
        value: function register(route, view) {
            this.routes[route] = view;
        }

        /**
         * Выбор View по маршруту
         * @param {string} route
         * @returns {BaseView}
         */

    }, {
        key: '_getViewByRoute',
        value: function _getViewByRoute(route) {
            return this.routes[route];
        }

        /**
         * Обрботчик события клика по ссылке
         * @param {MouseEvent} event
         */

    }, {
        key: 'onRouteChange',
        value: function onRouteChange(event) {

            if (!(event.target instanceof HTMLAnchorElement)) {
                return;
            }

            if (this.go(event.target.getAttribute('href'))) {
                event.preventDefault();
            }
        }

        /**
         * Запустить процес маршрутизации
         */

    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            this.node.addEventListener('click', function (event) {
                return _this.onRouteChange(event);
            });

            window.addEventListener('popstate', function (_) {
                _this.go(location.pathname);
            });
        }

        /**
         * Перетий по маршруту
         * @param {string} path
         * @returns {boolean} - если есть маршрурт
         */

    }, {
        key: 'go',
        value: function go(path) {
            var view = this._getViewByRoute(path);

            if (!view) {
                return false;
            }

            if (this.currentView === view) {
                return true;
            }

            view.show();
            this.history.pushState({}, '', path);

            if (this.currentView) {
                this.currentView.hide();
            }

            this.currentView = view;
            return true;
        }
    }]);

    return Router;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chat = __webpack_require__(18);

var _main = __webpack_require__(19);

exports.default = { Chat: _chat.ChatView, Main: _main.MainView };
// import {LoginView} from './login.view';

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./app.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./milligram.css", function() {
			var newContent = require("!!../../css-loader/index.js!./milligram.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Chat = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chatTmpl = __webpack_require__(25);

var _chatTmpl2 = _interopRequireDefault(_chatTmpl);

__webpack_require__(28);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} ChatData
 *
 * @property {string} user - имя текущего пользователя
 * @property {Array<ChatMessage>} messages - масси сообщений в чате
 */

/**
 * @typedef {Object} ChatMessage
 *
 * @property {string} text - Текст сообщения
 * @property {string} name - имя отправителя сообщения
 */

var Chat = exports.Chat = function () {
	function Chat(_ref) {
		var el = _ref.el,
		    _ref$data = _ref.data,
		    data = _ref$data === undefined ? { messages: [] } : _ref$data,
		    avatarService = _ref.avatarService,
		    chatService = _ref.chatService;

		_classCallCheck(this, Chat);

		this.el = el;
		this.data = data;

		this.avatarService = avatarService;
		this.chatService = chatService;

		this._initEvents();
	}

	_createClass(Chat, [{
		key: '_initEvents',
		value: function _initEvents() {
			this.chatService.on('messages', this._onMessages.bind(this));
		}
	}, {
		key: 'render',
		value: function render() {
			this._saveScrollTop();
			this.el.innerHTML = (0, _chatTmpl2.default)(this.data);
			this._restoreScrollTop();
		}
	}, {
		key: '_onMessages',
		value: function _onMessages(messages) {
			this.setMessages(messages);
			this.render();
		}
	}, {
		key: '_saveScrollTop',
		value: function _saveScrollTop() {
			var chatBox = this.el.querySelector('.chat__box');

			if (chatBox) {
				this._scrollTop = chatBox.scrollTop;
			}
		}
	}, {
		key: '_restoreScrollTop',
		value: function _restoreScrollTop() {
			var chatBox = this.el.querySelector('.chat__box');

			if (chatBox) {
				chatBox.scrollTop = this._scrollTop;
			}
		}
	}, {
		key: 'getUsername',
		value: function getUsername() {
			return this.data.user;
		}
	}, {
		key: '_updateMessages',
		value: function _updateMessages() {
			this.data.messages = this.data.messages.sort(function (message1, message2) {
				return message2.date - message1.date;
			});
		}
	}, {
		key: 'setMessages',
		value: function setMessages() {
			var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			this.data.messages.length = 0;
			this.add(messages);
		}

		/**
   * Массовое добавление сообщений
   * @param {Array<ChatMessages>} messages
   */

	}, {
		key: 'add',
		value: function add() {
			var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			var addOneMessageMethod = this.addOne.bind(this);

			messages.forEach(addOneMessageMethod);
		}

		/**
   * Добавить новое сообщение в чат
   * @param {ChatMessage} data
   */

	}, {
		key: 'addOne',
		value: function addOne(data) {
			this.data.messages.push(this._prepareMessage(data));
		}
	}, {
		key: '_prepareMessage',
		value: function _prepareMessage(_ref2) {
			var avatar = _ref2.avatar,
			    name = _ref2.name,
			    text = _ref2.text,
			    _ref2$date = _ref2.date,
			    date = _ref2$date === undefined ? Date.now() : _ref2$date;

			return {
				avatar: this.avatarService.getAvatar(name),
				name: name,
				isMine: name === this.data.user,
				text: text,
				date: new Date(date)
			};
		}

		/**
   * Устанавливаем текущего юзера
   */

	}, {
		key: 'setUserName',
		value: function setUserName(name) {
			this.data.user = name;
		}
	}]);

	return Chat;
}();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Form = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formTmpl = __webpack_require__(26);

var _formTmpl2 = _interopRequireDefault(_formTmpl);

__webpack_require__(29);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Form = exports.Form = function () {
	function Form(_ref) {
		var el = _ref.el,
		    _ref$data = _ref.data,
		    data = _ref$data === undefined ? {} : _ref$data;

		_classCallCheck(this, Form);

		this.el = el;
		this.data = data;

		this._initEvents();
	}

	_createClass(Form, [{
		key: 'render',
		value: function render() {
			this.el.innerHTML = (0, _formTmpl2.default)(this.data);

			this.formEl = this.el.querySelector('form');
		}

		/**
   * Регистрация обработчика события
   * @param  {string}   name - тип события
   * @param  {function} cb
   */

	}, {
		key: 'on',
		value: function on(name, cb) {
			this.el.addEventListener(name, cb);
		}

		/**
   * Вызов обработчиков событий
   * @param  {string} name - тип события
   * @param  {*} data
   */

	}, {
		key: 'trigger',
		value: function trigger(name, data) {
			var event = new CustomEvent(name, { detail: data });

			this.el.dispatchEvent(event);
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.formEl.reset();
		}
	}, {
		key: 'setUserName',
		value: function setUserName(name) {
			this.data.username = name;
		}
	}, {
		key: '_initEvents',
		value: function _initEvents() {
			this.el.addEventListener('submit', this._onSubmit.bind(this));
		}
	}, {
		key: '_onSubmit',
		value: function _onSubmit(event) {
			event.preventDefault();
			var formData = this._getFormData();

			this.trigger('message', formData);
		}
	}, {
		key: '_getInputs',
		value: function _getInputs() {
			return this.el.querySelectorAll('input, textarea');
		}
	}, {
		key: '_getFormData',
		value: function _getFormData() {
			var formData = {};

			[].concat(_toConsumableArray(this._getInputs())).forEach(function (input) {
				formData[input.name] = {
					value: input.value
				};
			});

			return formData;
		}
	}]);

	return Form;
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Menu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _menuTmpl = __webpack_require__(27);

var _menuTmpl2 = _interopRequireDefault(_menuTmpl);

__webpack_require__(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Menu = exports.Menu = function () {
    function Menu(_ref) {
        var el = _ref.el,
            _ref$data = _ref.data,
            data = _ref$data === undefined ? {} : _ref$data;

        _classCallCheck(this, Menu);

        this.el = el;
        this.data = data;
    }

    _createClass(Menu, [{
        key: 'render',
        value: function render() {
            console.log(this.data);
            this.el.innerHTML = (0, _menuTmpl2.default)(this.data);
        }
    }]);

    return Menu;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(8);

__webpack_require__(7);

var _router = __webpack_require__(5);

var _utils = __webpack_require__(3);

var _views = __webpack_require__(6);

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appEl = document.querySelector('.app');

var router = new _router.Router({
    node: appEl,
    history: window.history
});

['main', 'chat'].forEach(function (viewName) {
    var el = document.createElement('div');
    var View = _views2.default[(0, _utils.capitalize)(viewName)];

    el.classList.add(viewName);
    el.hidden = true;
    appEl.appendChild(el);

    router.register('/' + viewName, new View({ el: el }));
});

router.go('/main');
router.start();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AvatarService = exports.AvatarService = function () {
	function AvatarService() {
		_classCallCheck(this, AvatarService);

		this._avatars = {
			'Tim': 'http://i.imgur.com/FHMnsVNt.jpg',
			'Matt': '//1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60?s=200&r=pg&d=mm'
		};

		this._defaultAvatar = 'https://unsplash.it/200/200/?random';
	}

	_createClass(AvatarService, [{
		key: 'getAvatar',
		value: function getAvatar() {
			var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			if (!this._avatars[name]) {
				this._avatars[name] = this._defaultAvatar + ('=' + Date.now());
			}

			console.log(this._avatars[name]);
			return this._avatars[name];
		}
	}], [{
		key: 'getInstance',
		value: function getInstance() {
			for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
				rest[_key] = arguments[_key];
			}

			return new (Function.prototype.bind.apply(this, [null].concat(rest)))();
		}
	}]);

	return AvatarService;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ChatService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatService = exports.ChatService = function () {
	function ChatService(_ref) {
		var baseUrl = _ref.baseUrl,
		    _ref$pollingInterval = _ref.pollingInterval,
		    pollingInterval = _ref$pollingInterval === undefined ? 15000 : _ref$pollingInterval,
		    http = _ref.http;

		_classCallCheck(this, ChatService);

		this.pollingInterval = pollingInterval;
		this.http = http;

		this.http.setBaseUrl(baseUrl);

		this.__messages = [];
		this.__pollingID = null;
		this.__lastReqTime = null;
	}

	_createClass(ChatService, [{
		key: 'getMessages',
		value: function getMessages() {
			return this.http.makeRequest().then(function (resp) {
				return Object.values(resp.data);
			});
		}
	}, {
		key: 'sendMessage',
		value: function sendMessage(data) {
			data.date = Date.now();

			return this.http.makeRequest('POST', data).then(function (resp) {
				return resp.data;
			});
		}
	}, {
		key: 'startPolling',
		value: function startPolling() {
			var _this = this;

			var doRequest = function doRequest() {
				_this.getMessages().then(function (messages) {
					_this.setMessages(messages);
					_this.__pollingID = setTimeout(doRequest, _this.pollingInterval);
				});
			};

			doRequest();
		}
	}, {
		key: 'stopPolling',
		value: function stopPolling() {
			clearInterval(this.__pollingID);
		}
	}, {
		key: 'setMessages',
		value: function setMessages(messages) {
			if ((0, _utils.deepEqual)(this._messages, messages)) {
				return;
			}

			this._messages = messages;
			this.trigger('messages', this._messages);
		}

		/**
   * Dispatch an event on this object
   * @param {string} name event name
   * @param {any} data event payload
   */

	}, {
		key: 'trigger',
		value: function trigger(name, data) {
			var _this2 = this;

			if (this.__callbacks && this.__callbacks[name]) {
				this.__callbacks[name].forEach(function (cb) {
					return cb.call(_this2, data);
				});
			}
		}

		/**
   * Subscribe on event
   * @param {string} name event name
   * @param {function} cb callback
   */

	}, {
		key: 'on',
		value: function on(name, cb) {
			if (!this.__callbacks) {
				this.__callbacks = {};
			}

			if (!this.__callbacks[name]) {
				this.__callbacks[name] = [];
			}

			this.__callbacks[name].push(cb);
		}

		/**
   * Get instance of this class
   * @static 
   */

	}], [{
		key: 'getInstance',
		value: function getInstance() {
			for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
				rest[_key] = arguments[_key];
			}

			return new (Function.prototype.bind.apply(this, [null].concat(rest)))();
		}
	}]);

	return ChatService;
}();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpService = exports.HttpService = function () {
    function HttpService() {
        _classCallCheck(this, HttpService);
    }

    /**
     * Setting the base URL for requests
     * @param {string} url
     */


    _createClass(HttpService, [{
        key: 'setBaseUrl',
        value: function setBaseUrl(url) {
            this.baseUrl = url;
        }

        /**
         * Making a HTTP request
         * @param {string} type specified a HTTP method
         * @param {Object} data specified a body of request
         * @returns {Promise}
         */

    }, {
        key: 'makeRequest',
        value: function makeRequest() {
            var _this = this;

            var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open(type, _this.baseUrl, true);

                xhr.addEventListener('load', function () {
                    return resolve({
                        data: JSON.parse(xhr.responseText),
                        xhr: xhr
                    });
                });
                xhr.addEventListener('error', reject);
                xhr.addEventListener('abort', reject);

                xhr.send(JSON.stringify(data));
            });
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            return new (Function.prototype.bind.apply(this, [null].concat(rest)))();
        }
    }]);

    return HttpService;
}();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WindowService = exports.WindowService = function () {
  function WindowService(_ref) {
    var document = _ref.document;

    _classCallCheck(this, WindowService);

    this.document = document;
  }

  /**
   * Add listener to 'visibilitychange' event
   * @param {function} cb
   */


  _createClass(WindowService, [{
    key: 'onVisibilityChange',
    value: function onVisibilityChange(cb) {
      this.document.addEventListener('visibilitychange', function () {
        cb(document.visibilityState);
      });
    }
  }], [{
    key: 'getInstance',
    value: function getInstance() {
      for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(this, [null].concat(rest)))();
    }
  }]);

  return WindowService;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ChatView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _view = __webpack_require__(4);

var _chat = __webpack_require__(9);

var _form = __webpack_require__(10);

var _avatar = __webpack_require__(14);

var _chat2 = __webpack_require__(15);

var _window = __webpack_require__(17);

var _http = __webpack_require__(16);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var chatService = _chat2.ChatService.getInstance({
	baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json',
	http: _http.HttpService.getInstance(),
	pollingInterval: 1000
});

var windowService = _window.WindowService.getInstance({ document: document });
var avatarService = _avatar.AvatarService.getInstance();

var ChatView = exports.ChatView = function (_BaseView) {
	_inherits(ChatView, _BaseView);

	function ChatView() {
		var _ref;

		_classCallCheck(this, ChatView);

		for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
			rest[_key] = arguments[_key];
		}

		var _this = _possibleConstructorReturn(this, (_ref = ChatView.__proto__ || Object.getPrototypeOf(ChatView)).call.apply(_ref, [this].concat(rest)));

		_this._createComponents();
		_this._initMediate();

		_this.el.appendChild(_this.chat.el);
		_this.el.appendChild(_this.form.el);

		_this.render();
		return _this;
	}

	_createClass(ChatView, [{
		key: 'render',
		value: function render() {
			this.chat.render();
			this.form.render();
		}
	}, {
		key: '_createComponents',
		value: function _createComponents() {
			this.chat = new _chat.Chat({
				el: document.createElement('div'),
				avatarService: avatarService,
				chatService: chatService
			});

			this.form = new _form.Form({
				el: document.createElement('div')
			});
		}
	}, {
		key: '_initMediate',
		value: function _initMediate() {
			var _this2 = this;

			windowService.onVisibilityChange(function (status) {
				console.log(status);
			});

			this.form.on('message', function (event) {
				var data = event.detail;
				var userName = event.detail.username.value;

				if (userName) {
					_this2.chat.setUserName(userName);
					_this2.form.setUserName(userName);
				}

				data = {
					text: data.message.value,
					name: _this2.chat.getUsername()
				};

				chatService.sendMessage(data, function () {
					console.log('NEW MSG');
				});

				_this2.chat.addOne(data);

				_this2.render();
			});

			chatService.startPolling();
		}
	}, {
		key: 'addMessage',
		value: function addMessage(data) {
			this.chat.addOne(data);
		}
	}]);

	return ChatView;
}(_view.BaseView);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MainView = undefined;

var _view = __webpack_require__(4);

var _menu = __webpack_require__(11);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainView = exports.MainView = function (_BaseView) {
    _inherits(MainView, _BaseView);

    function MainView() {
        var _ref;

        _classCallCheck(this, MainView);

        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = MainView.__proto__ || Object.getPrototypeOf(MainView)).call.apply(_ref, [this].concat(rest)));

        _this.menu = new _menu.Menu({
            el: document.createElement('div'),
            data: {
                title: 'Single Page Chat',
                items: [{ href: '/login', text: 'Войти' }, { href: '/chat', text: 'Чат' }]
            }
        });

        _this.el.appendChild(_this.menu.el);
        _this.menu.render();
        return _this;
    }

    return MainView;
}(_view.BaseView);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "* {\r\n  font-family:'Helvetica Neue',Helvetica, sans-serif;\r\n  font-size: 14px;\r\n  margin: 0;\r\n}\r\n\r\n.app {\r\n\twidth: 400px;\r\n\tmargin:0 auto;\r\n}", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".chat__container {\r\n  width: 100%;\r\n  display:block;\r\n  overflow: hidden;\r\n}\r\n\r\n.header{\r\n  padding:20px 20px 18px 20px;\r\n  background:#9b4dca;\r\n  color:#fff;\r\n}\r\n.header h2{\r\n  font-size:16px;\r\n  line-height:15px;\r\n  display:inline-block;\r\n  letter-spacing: 0.05em;\r\n}\r\n.header a{\r\n  display:inline-block;\r\n  float:right;\r\n  background:#3d8b4e;\r\n  font-size:25px;\r\n  line-height:20px;\r\n  padding:3px 6px;\r\n  margin-top:-5px;\r\n  border-radius:2px;\r\n}\r\n\r\n.chat__box {\r\n  background: #ECECEC;\r\n  padding: 0 20px;\r\n  color: #a1a1a1;\r\n  overflow-y: auto;\r\n  height: 60vh;\r\n}\r\n\r\n.chat__box .message-box{\r\n  padding:18px 0 10px;\r\n  clear:both;\r\n}\r\n.message-box .picture{\r\n  float:left;\r\n  width:50px;\r\n  display:block;\r\n  padding-right:10px;\r\n}\r\n.picture img{\r\n  width:43px;\r\n  height:43px;\r\n  border-radius:5px;\r\n}\r\n.picture span {\r\n  font-weight: bold;\r\n  font-size: 10px;\r\n  clear: both;\r\n  display: block;\r\n  text-align: center;\r\n  margin-top: 3px;\r\n}\r\n.message{\r\n  background:#fff;\r\n  display:inline-block;\r\n  padding:13px;\r\n  width:274px;\r\n  border-radius:2px;\r\n  box-shadow: 0 1px 1px rgba(0,0,0,.04);\r\n  position:relative;\r\n}\r\n.message:before{\r\n  content:\"\";\r\n  position:absolute;\r\n  display:block;\r\n  left:0;\r\n  border-right:6px solid #fff;\r\n  border-top: 6px solid transparent;\r\n  border-bottom:6px solid transparent;\r\n  top:10px;\r\n  margin-left:-6px;\r\n}\r\n.message span{\r\n  color:#555;\r\n  font-weight:bold;\r\n}\r\n.message p{\r\n  padding-top:5px;\r\n}\r\n.message-box.right-img .picture{\r\n  float:right;\r\n  padding:0;\r\n  padding-left:10px;\r\n}\r\n.message-box.right-img .picture img{\r\n  float:right;\r\n}\r\n.message-box.right-img .message:before{\r\n  left:100%;\r\n  margin-right:6px;\r\n  margin-left:0;\r\n  border-right:6px solid transparent;\r\n  border-left:6px solid #fff;\r\n  border-top: 6px solid transparent;\r\n  border-bottom:6px solid transparent;\r\n}", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n * Milligram v1.3.0\n * https://milligram.github.io\n *\n * Copyright (c) 2017 CJ Patoilo\n * Licensed under the MIT license\n */\n\n*,\n*:after,\n*:before {\n  box-sizing: inherit;\n}\n\nhtml {\n  box-sizing: border-box;\n  font-size: 62.5%;\n}\n\nbody {\n  color: #606c76;\n  font-family: 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;\n  font-size: 1.6em;\n  font-weight: 300;\n  letter-spacing: .01em;\n  line-height: 1.6;\n}\n\nblockquote {\n  border-left: 0.3rem solid #d1d1d1;\n  margin-left: 0;\n  margin-right: 0;\n  padding: 1rem 1.5rem;\n}\n\nblockquote *:last-child {\n  margin-bottom: 0;\n}\n\n.button,\nbutton,\ninput[type='button'],\ninput[type='reset'],\ninput[type='submit'] {\n  background-color: #9b4dca;\n  border: 0.1rem solid #9b4dca;\n  border-radius: .4rem;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-size: 1.1rem;\n  font-weight: 700;\n  height: 3.8rem;\n  letter-spacing: .1rem;\n  line-height: 3.8rem;\n  padding: 0 3.0rem;\n  text-align: center;\n  text-decoration: none;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n\n.button:focus, .button:hover,\nbutton:focus,\nbutton:hover,\ninput[type='button']:focus,\ninput[type='button']:hover,\ninput[type='reset']:focus,\ninput[type='reset']:hover,\ninput[type='submit']:focus,\ninput[type='submit']:hover {\n  background-color: #606c76;\n  border-color: #606c76;\n  color: #fff;\n  outline: 0;\n}\n\n.button[disabled],\nbutton[disabled],\ninput[type='button'][disabled],\ninput[type='reset'][disabled],\ninput[type='submit'][disabled] {\n  cursor: default;\n  opacity: .5;\n}\n\n.button[disabled]:focus, .button[disabled]:hover,\nbutton[disabled]:focus,\nbutton[disabled]:hover,\ninput[type='button'][disabled]:focus,\ninput[type='button'][disabled]:hover,\ninput[type='reset'][disabled]:focus,\ninput[type='reset'][disabled]:hover,\ninput[type='submit'][disabled]:focus,\ninput[type='submit'][disabled]:hover {\n  background-color: #9b4dca;\n  border-color: #9b4dca;\n}\n\n.button.button-outline,\nbutton.button-outline,\ninput[type='button'].button-outline,\ninput[type='reset'].button-outline,\ninput[type='submit'].button-outline {\n  background-color: transparent;\n  color: #9b4dca;\n}\n\n.button.button-outline:focus, .button.button-outline:hover,\nbutton.button-outline:focus,\nbutton.button-outline:hover,\ninput[type='button'].button-outline:focus,\ninput[type='button'].button-outline:hover,\ninput[type='reset'].button-outline:focus,\ninput[type='reset'].button-outline:hover,\ninput[type='submit'].button-outline:focus,\ninput[type='submit'].button-outline:hover {\n  background-color: transparent;\n  border-color: #606c76;\n  color: #606c76;\n}\n\n.button.button-outline[disabled]:focus, .button.button-outline[disabled]:hover,\nbutton.button-outline[disabled]:focus,\nbutton.button-outline[disabled]:hover,\ninput[type='button'].button-outline[disabled]:focus,\ninput[type='button'].button-outline[disabled]:hover,\ninput[type='reset'].button-outline[disabled]:focus,\ninput[type='reset'].button-outline[disabled]:hover,\ninput[type='submit'].button-outline[disabled]:focus,\ninput[type='submit'].button-outline[disabled]:hover {\n  border-color: inherit;\n  color: #9b4dca;\n}\n\n.button.button-clear,\nbutton.button-clear,\ninput[type='button'].button-clear,\ninput[type='reset'].button-clear,\ninput[type='submit'].button-clear {\n  background-color: transparent;\n  border-color: transparent;\n  color: #9b4dca;\n}\n\n.button.button-clear:focus, .button.button-clear:hover,\nbutton.button-clear:focus,\nbutton.button-clear:hover,\ninput[type='button'].button-clear:focus,\ninput[type='button'].button-clear:hover,\ninput[type='reset'].button-clear:focus,\ninput[type='reset'].button-clear:hover,\ninput[type='submit'].button-clear:focus,\ninput[type='submit'].button-clear:hover {\n  background-color: transparent;\n  border-color: transparent;\n  color: #606c76;\n}\n\n.button.button-clear[disabled]:focus, .button.button-clear[disabled]:hover,\nbutton.button-clear[disabled]:focus,\nbutton.button-clear[disabled]:hover,\ninput[type='button'].button-clear[disabled]:focus,\ninput[type='button'].button-clear[disabled]:hover,\ninput[type='reset'].button-clear[disabled]:focus,\ninput[type='reset'].button-clear[disabled]:hover,\ninput[type='submit'].button-clear[disabled]:focus,\ninput[type='submit'].button-clear[disabled]:hover {\n  color: #9b4dca;\n}\n\ncode {\n  background: #f4f5f6;\n  border-radius: .4rem;\n  font-size: 86%;\n  margin: 0 .2rem;\n  padding: .2rem .5rem;\n  white-space: nowrap;\n}\n\npre {\n  background: #f4f5f6;\n  border-left: 0.3rem solid #9b4dca;\n  overflow-y: hidden;\n}\n\npre > code {\n  border-radius: 0;\n  display: block;\n  padding: 1rem 1.5rem;\n  white-space: pre;\n}\n\nhr {\n  border: 0;\n  border-top: 0.1rem solid #f4f5f6;\n  margin: 3.0rem 0;\n}\n\ninput[type='email'],\ninput[type='number'],\ninput[type='password'],\ninput[type='search'],\ninput[type='tel'],\ninput[type='text'],\ninput[type='url'],\ntextarea,\nselect {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: transparent;\n  border: 0.1rem solid #d1d1d1;\n  border-radius: .4rem;\n  box-shadow: none;\n  box-sizing: inherit;\n  height: 3.8rem;\n  padding: .6rem 1.0rem;\n  width: 100%;\n}\n\ninput[type='email']:focus,\ninput[type='number']:focus,\ninput[type='password']:focus,\ninput[type='search']:focus,\ninput[type='tel']:focus,\ninput[type='text']:focus,\ninput[type='url']:focus,\ntextarea:focus,\nselect:focus {\n  border-color: #9b4dca;\n  outline: 0;\n}\n\nselect {\n  background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"14\" viewBox=\"0 0 29 14\" width=\"29\"><path fill=\"#d1d1d1\" d=\"M9.37727 3.625l5.08154 6.93523L19.54036 3.625\"/></svg>') center right no-repeat;\n  padding-right: 3.0rem;\n}\n\nselect:focus {\n  background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"14\" viewBox=\"0 0 29 14\" width=\"29\"><path fill=\"#9b4dca\" d=\"M9.37727 3.625l5.08154 6.93523L19.54036 3.625\"/></svg>');\n}\n\ntextarea {\n  min-height: 6.5rem;\n}\n\nlabel,\nlegend {\n  display: block;\n  font-size: 1.6rem;\n  font-weight: 700;\n  margin-bottom: .5rem;\n}\n\nfieldset {\n  border-width: 0;\n  padding: 0;\n}\n\ninput[type='checkbox'],\ninput[type='radio'] {\n  display: inline;\n}\n\n.label-inline {\n  display: inline-block;\n  font-weight: normal;\n  margin-left: .5rem;\n}\n\n.container {\n  margin: 0 auto;\n  max-width: 112.0rem;\n  padding: 0 2.0rem;\n  position: relative;\n  width: 100%;\n}\n\n.row {\n  display: flex;\n  flex-direction: column;\n  padding: 0;\n  width: 100%;\n}\n\n.row.row-no-padding {\n  padding: 0;\n}\n\n.row.row-no-padding > .column {\n  padding: 0;\n}\n\n.row.row-wrap {\n  flex-wrap: wrap;\n}\n\n.row.row-top {\n  align-items: flex-start;\n}\n\n.row.row-bottom {\n  align-items: flex-end;\n}\n\n.row.row-center {\n  align-items: center;\n}\n\n.row.row-stretch {\n  align-items: stretch;\n}\n\n.row.row-baseline {\n  align-items: baseline;\n}\n\n.row .column {\n  display: block;\n  flex: 1 1 auto;\n  margin-left: 0;\n  max-width: 100%;\n  width: 100%;\n}\n\n.row .column.column-offset-10 {\n  margin-left: 10%;\n}\n\n.row .column.column-offset-20 {\n  margin-left: 20%;\n}\n\n.row .column.column-offset-25 {\n  margin-left: 25%;\n}\n\n.row .column.column-offset-33, .row .column.column-offset-34 {\n  margin-left: 33.3333%;\n}\n\n.row .column.column-offset-50 {\n  margin-left: 50%;\n}\n\n.row .column.column-offset-66, .row .column.column-offset-67 {\n  margin-left: 66.6666%;\n}\n\n.row .column.column-offset-75 {\n  margin-left: 75%;\n}\n\n.row .column.column-offset-80 {\n  margin-left: 80%;\n}\n\n.row .column.column-offset-90 {\n  margin-left: 90%;\n}\n\n.row .column.column-10 {\n  flex: 0 0 10%;\n  max-width: 10%;\n}\n\n.row .column.column-20 {\n  flex: 0 0 20%;\n  max-width: 20%;\n}\n\n.row .column.column-25 {\n  flex: 0 0 25%;\n  max-width: 25%;\n}\n\n.row .column.column-33, .row .column.column-34 {\n  flex: 0 0 33.3333%;\n  max-width: 33.3333%;\n}\n\n.row .column.column-40 {\n  flex: 0 0 40%;\n  max-width: 40%;\n}\n\n.row .column.column-50 {\n  flex: 0 0 50%;\n  max-width: 50%;\n}\n\n.row .column.column-60 {\n  flex: 0 0 60%;\n  max-width: 60%;\n}\n\n.row .column.column-66, .row .column.column-67 {\n  flex: 0 0 66.6666%;\n  max-width: 66.6666%;\n}\n\n.row .column.column-75 {\n  flex: 0 0 75%;\n  max-width: 75%;\n}\n\n.row .column.column-80 {\n  flex: 0 0 80%;\n  max-width: 80%;\n}\n\n.row .column.column-90 {\n  flex: 0 0 90%;\n  max-width: 90%;\n}\n\n.row .column .column-top {\n  align-self: flex-start;\n}\n\n.row .column .column-bottom {\n  align-self: flex-end;\n}\n\n.row .column .column-center {\n  -ms-grid-row-align: center;\n      align-self: center;\n}\n\n@media (min-width: 40rem) {\n  .row {\n    flex-direction: row;\n    margin-left: -1.0rem;\n    width: calc(100% + 2.0rem);\n  }\n  .row .column {\n    margin-bottom: inherit;\n    padding: 0 1.0rem;\n  }\n}\n\na {\n  color: #9b4dca;\n  text-decoration: none;\n}\n\na:focus, a:hover {\n  color: #606c76;\n}\n\ndl,\nol,\nul {\n  list-style: none;\n  margin-top: 0;\n  padding-left: 0;\n}\n\ndl dl,\ndl ol,\ndl ul,\nol dl,\nol ol,\nol ul,\nul dl,\nul ol,\nul ul {\n  font-size: 90%;\n  margin: 1.5rem 0 1.5rem 3.0rem;\n}\n\nol {\n  list-style: decimal inside;\n}\n\nul {\n  list-style: circle inside;\n}\n\n.button,\nbutton,\ndd,\ndt,\nli {\n  margin-bottom: 1.0rem;\n}\n\nfieldset,\ninput,\nselect,\ntextarea {\n  margin-bottom: 1.5rem;\n}\n\nblockquote,\ndl,\nfigure,\nform,\nol,\np,\npre,\ntable,\nul {\n  margin-bottom: 2.5rem;\n}\n\ntable {\n  border-spacing: 0;\n  width: 100%;\n}\n\ntd,\nth {\n  border-bottom: 0.1rem solid #e1e1e1;\n  padding: 1.2rem 1.5rem;\n  text-align: left;\n}\n\ntd:first-child,\nth:first-child {\n  padding-left: 0;\n}\n\ntd:last-child,\nth:last-child {\n  padding-right: 0;\n}\n\nb,\nstrong {\n  font-weight: bold;\n}\n\np {\n  margin-top: 0;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-weight: 300;\n  letter-spacing: -.1rem;\n  margin-bottom: 2.0rem;\n  margin-top: 0;\n}\n\nh1 {\n  font-size: 4.6rem;\n  line-height: 1.2;\n}\n\nh2 {\n  font-size: 3.6rem;\n  line-height: 1.25;\n}\n\nh3 {\n  font-size: 2.8rem;\n  line-height: 1.3;\n}\n\nh4 {\n  font-size: 2.2rem;\n  letter-spacing: -.08rem;\n  line-height: 1.35;\n}\n\nh5 {\n  font-size: 1.8rem;\n  letter-spacing: -.05rem;\n  line-height: 1.5;\n}\n\nh6 {\n  font-size: 1.6rem;\n  letter-spacing: 0;\n  line-height: 1.4;\n}\n\nimg {\n  max-width: 100%;\n}\n\n.clearfix:after {\n  clear: both;\n  content: ' ';\n  display: table;\n}\n\n.float-left {\n  float: left;\n}\n\n.float-right {\n  float: right;\n}", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(2);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (messages, user) {pug_html = pug_html + "\u003Cdiv class=\"chat\"\u003E\u003Cdiv class=\"chat__container\"\u003E\u003Cdiv class=\"header\"\u003E\u003Ch2\u003E" + (pug.escape(null == (pug_interp = 'Добро пожаловать ' + (user || '')) ? "" : pug_interp)) + "\u003C\u002Fh2\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"chat__box\"\u003E";
if (!messages.length) {
pug_html = pug_html + "\u003Ch3\u003EПока нет сообщений\u003C\u002Fh3\u003E";
}
// iterate messages
;(function(){
  var $$obj = messages;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var message = $$obj[pug_index0];
pug_html = pug_html + "\u003Cdiv" + (pug.attr("class", pug.classes(["message-box",message.isMine ? 'left-img' : 'right-img'], [false,true]), false, true)) + "\u003E\u003Cdiv class=\"picture\"\u003E\u003Cimg" + (pug.attr("src", message.avatar, true, true)+" title=\"name of user\"") + "\u003E\u003Cspan class=\"time\"\u003E" + (pug.escape(null == (pug_interp = message.date && message.date.toTimeString().split(' ')[0]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"message\"\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = message.name) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cp\u003E" + (pug.escape(null == (pug_interp = message.text) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var message = $$obj[pug_index0];
pug_html = pug_html + "\u003Cdiv" + (pug.attr("class", pug.classes(["message-box",message.isMine ? 'left-img' : 'right-img'], [false,true]), false, true)) + "\u003E\u003Cdiv class=\"picture\"\u003E\u003Cimg" + (pug.attr("src", message.avatar, true, true)+" title=\"name of user\"") + "\u003E\u003Cspan class=\"time\"\u003E" + (pug.escape(null == (pug_interp = message.date && message.date.toTimeString().split(' ')[0]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"message\"\u003E\u003Cspan\u003E" + (pug.escape(null == (pug_interp = message.name) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003Cp\u003E" + (pug.escape(null == (pug_interp = message.text) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"messages" in locals_for_with?locals_for_with.messages:typeof messages!=="undefined"?messages:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return pug_html;};
module.exports = template;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(2);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (username) {pug_html = pug_html + "\u003Cform\u003E\u003Ctextarea name=\"message\" placeholder=\"Введите сообщение...\"\u003E\u003C\u002Ftextarea\u003E\u003Cbr\u003E\u003Cinput" + (" type=\"text\" name=\"username\""+pug.attr("placeholder", username || "Имя пользователя...", true, true)) + "\u003E\u003Cinput type=\"submit\" value=\"Отправить\"\u003E\u003C\u002Fform\u003E";}.call(this,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return pug_html;};
module.exports = template;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(2);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (items, title) {pug_html = pug_html + "\u003Ch1\u003E" + (pug.escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Fh1\u003E\u003Cul\u003E";
// iterate items
;(function(){
  var $$obj = items;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var item = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli\u003E\u003Ca" + (pug.attr("href", item.href, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = item.text) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var item = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli\u003E\u003Ca" + (pug.attr("href", item.href, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = item.text) ? "" : pug_interp)) + "\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E";}.call(this,"items" in locals_for_with?locals_for_with.items:typeof items!=="undefined"?items:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));;return pug_html;};
module.exports = template;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./chat.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./chat.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./form.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./form.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./menu.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./menu.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 31 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTlhZmRmZjc4OTg5MTg0ZmU0NzYiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wdWctcnVudGltZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9mcmFtZXdvcmsvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2FwcC9hcHAuY3NzPzIzNmYiLCJ3ZWJwYWNrOi8vLy4vfi9taWxsaWdyYW0vZGlzdC9taWxsaWdyYW0uY3NzPzE3MjAiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jaGF0L2NoYXQuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9mb3JtL2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9tZW51L21lbnUuanMiLCJ3ZWJwYWNrOi8vLy4vbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwid2VicGFjazovLy8uL3NlcnZpY2VzL2F2YXRhci5zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3NlcnZpY2VzL2NoYXQuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2aWNlcy9odHRwLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmljZXMvd2luZG93LnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvY2hhdC52aWV3LmpzIiwid2VicGFjazovLy8uL3ZpZXdzL21haW4udmlldy5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2FwcC9hcHAuY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LmNzcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2Zvcm0vZm9ybS5jc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9tZW51L21lbnUuY3NzIiwid2VicGFjazovLy8uL34vbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NoYXQvY2hhdC50bXBsLnB1ZyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2Zvcm0vZm9ybS50bXBsLnB1ZyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL21lbnUvbWVudS50bXBsLnB1ZyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NoYXQvY2hhdC5jc3M/NjE2MyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2Zvcm0vZm9ybS5jc3M/NjZlYyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL21lbnUvbWVudS5jc3M/ZDY2MyIsIndlYnBhY2s6Ly8vZnMgKGlnbm9yZWQpIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJ1c2VTb3VyY2VNYXAiLCJsaXN0IiwidG9TdHJpbmciLCJtYXAiLCJpdGVtIiwiY29udGVudCIsImNzc1dpdGhNYXBwaW5nVG9TdHJpbmciLCJqb2luIiwiaSIsIm1vZHVsZXMiLCJtZWRpYVF1ZXJ5IiwiYWxyZWFkeUltcG9ydGVkTW9kdWxlcyIsImxlbmd0aCIsImlkIiwicHVzaCIsImNzc01hcHBpbmciLCJidG9hIiwic291cmNlTWFwcGluZyIsInRvQ29tbWVudCIsInNvdXJjZVVSTHMiLCJzb3VyY2VzIiwic291cmNlIiwic291cmNlUm9vdCIsImNvbmNhdCIsInNvdXJjZU1hcCIsImJhc2U2NCIsInVuZXNjYXBlIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsImRhdGEiLCJkZWVwRXF1YWwiLCJzcmMiLCJkZXN0IiwiY2FwaXRhbGl6ZSIsInN0ciIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJCYXNlVmlldyIsImVsIiwiaGlkZGVuIiwiUm91dGVyIiwibm9kZSIsImhpc3RvcnkiLCJyb3V0ZXMiLCJyb3V0ZSIsInZpZXciLCJldmVudCIsInRhcmdldCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZ28iLCJnZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvblJvdXRlQ2hhbmdlIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsInBhdGgiLCJfZ2V0Vmlld0J5Um91dGUiLCJjdXJyZW50VmlldyIsInNob3ciLCJwdXNoU3RhdGUiLCJoaWRlIiwiQ2hhdCIsIk1haW4iLCJtZXNzYWdlcyIsImF2YXRhclNlcnZpY2UiLCJjaGF0U2VydmljZSIsIl9pbml0RXZlbnRzIiwib24iLCJfb25NZXNzYWdlcyIsImJpbmQiLCJfc2F2ZVNjcm9sbFRvcCIsImlubmVySFRNTCIsIl9yZXN0b3JlU2Nyb2xsVG9wIiwic2V0TWVzc2FnZXMiLCJyZW5kZXIiLCJjaGF0Qm94IiwicXVlcnlTZWxlY3RvciIsIl9zY3JvbGxUb3AiLCJzY3JvbGxUb3AiLCJ1c2VyIiwic29ydCIsIm1lc3NhZ2UxIiwibWVzc2FnZTIiLCJkYXRlIiwiYWRkIiwiYWRkT25lTWVzc2FnZU1ldGhvZCIsImFkZE9uZSIsImZvckVhY2giLCJfcHJlcGFyZU1lc3NhZ2UiLCJhdmF0YXIiLCJuYW1lIiwidGV4dCIsIkRhdGUiLCJub3ciLCJnZXRBdmF0YXIiLCJpc01pbmUiLCJGb3JtIiwiZm9ybUVsIiwiY2IiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImRpc3BhdGNoRXZlbnQiLCJyZXNldCIsInVzZXJuYW1lIiwiX29uU3VibWl0IiwiZm9ybURhdGEiLCJfZ2V0Rm9ybURhdGEiLCJ0cmlnZ2VyIiwicXVlcnlTZWxlY3RvckFsbCIsIl9nZXRJbnB1dHMiLCJpbnB1dCIsInZhbHVlIiwiTWVudSIsImNvbnNvbGUiLCJsb2ciLCJhcHBFbCIsImRvY3VtZW50Iiwicm91dGVyIiwiY3JlYXRlRWxlbWVudCIsIlZpZXciLCJ2aWV3TmFtZSIsImNsYXNzTGlzdCIsImFwcGVuZENoaWxkIiwicmVnaXN0ZXIiLCJzdGFydCIsImNzcyIsIkVycm9yIiwiYmFzZVVybCIsInByb3RvY29sIiwiaG9zdCIsImN1cnJlbnREaXIiLCJyZXBsYWNlIiwiZml4ZWRDc3MiLCJmdWxsTWF0Y2giLCJvcmlnVXJsIiwidW5xdW90ZWRPcmlnVXJsIiwidHJpbSIsIm8iLCIkMSIsInRlc3QiLCJuZXdVcmwiLCJpbmRleE9mIiwiQXZhdGFyU2VydmljZSIsIl9hdmF0YXJzIiwiX2RlZmF1bHRBdmF0YXIiLCJyZXN0IiwiQ2hhdFNlcnZpY2UiLCJwb2xsaW5nSW50ZXJ2YWwiLCJodHRwIiwic2V0QmFzZVVybCIsIl9fbWVzc2FnZXMiLCJfX3BvbGxpbmdJRCIsIl9fbGFzdFJlcVRpbWUiLCJtYWtlUmVxdWVzdCIsInRoZW4iLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZXNwIiwiZG9SZXF1ZXN0IiwiZ2V0TWVzc2FnZXMiLCJzZXRUaW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsIl9tZXNzYWdlcyIsIl9fY2FsbGJhY2tzIiwiY2FsbCIsIkh0dHBTZXJ2aWNlIiwidXJsIiwidHlwZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJzZW5kIiwiV2luZG93U2VydmljZSIsInZpc2liaWxpdHlTdGF0ZSIsImdldEluc3RhbmNlIiwid2luZG93U2VydmljZSIsIkNoYXRWaWV3IiwiX2NyZWF0ZUNvbXBvbmVudHMiLCJfaW5pdE1lZGlhdGUiLCJjaGF0IiwiZm9ybSIsIm9uVmlzaWJpbGl0eUNoYW5nZSIsInN0YXR1cyIsInVzZXJOYW1lIiwic2V0VXNlck5hbWUiLCJtZXNzYWdlIiwiZ2V0VXNlcm5hbWUiLCJzZW5kTWVzc2FnZSIsInN0YXJ0UG9sbGluZyIsIk1haW5WaWV3IiwibWVudSIsInRpdGxlIiwiaXRlbXMiLCJocmVmIl0sIm1hcHBpbmdzIjoiO0FBQUE7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LyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEyKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1OWFmZGZmNzg5ODkxODRmZTQ3NiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0XHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdFx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlciBcblx0XHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0XHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0XHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG5cdH0pLFxuXHRnZXRFbGVtZW50ID0gKGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW8gPSB7fTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHRcdH07XG5cdH0pKGZ1bmN0aW9uIChzdHlsZVRhcmdldCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0eWxlVGFyZ2V0KVxuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdLFxuXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vZml4VXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0SW50byA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2Vcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XG5cdHZhciBzdHlsZVRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXHRpZiAoIXN0eWxlVGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBzdHlsZVRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKHN0eWxlRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YXR0YWNoVGFnQXR0cnMobGlua0VsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaFRhZ0F0dHJzKGVsZW1lbnQsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlLCB0cmFuc2Zvcm1SZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICB0cmFuc2Zvcm1SZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblx0ICAgIFxuXHQgICAgaWYgKHRyYW5zZm9ybVJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHRyYW5zZm9ybVJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuIFxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcblx0XHRpZihuZXdPYmopIHtcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0LyogSWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpe1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIHB1Z19oYXNfb3duX3Byb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gcHVnX21lcmdlO1xuZnVuY3Rpb24gcHVnX21lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBwdWdfbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgIHZhciB2YWxBID0gYVtrZXldIHx8IFtdO1xuICAgICAgYVtrZXldID0gKEFycmF5LmlzQXJyYXkodmFsQSkgPyB2YWxBIDogW3ZhbEFdKS5jb25jYXQoYltrZXldIHx8IFtdKTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgdmFyIHZhbEEgPSBwdWdfc3R5bGUoYVtrZXldKTtcbiAgICAgIHZhciB2YWxCID0gcHVnX3N0eWxlKGJba2V5XSk7XG4gICAgICBhW2tleV0gPSB2YWxBICsgdmFsQjtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBQcm9jZXNzIGFycmF5LCBvYmplY3QsIG9yIHN0cmluZyBhcyBhIHN0cmluZyBvZiBjbGFzc2VzIGRlbGltaXRlZCBieSBhIHNwYWNlLlxuICpcbiAqIElmIGB2YWxgIGlzIGFuIGFycmF5LCBhbGwgbWVtYmVycyBvZiBpdCBhbmQgaXRzIHN1YmFycmF5cyBhcmUgY291bnRlZCBhc1xuICogY2xhc3Nlcy4gSWYgYGVzY2FwaW5nYCBpcyBhbiBhcnJheSwgdGhlbiB3aGV0aGVyIG9yIG5vdCB0aGUgaXRlbSBpbiBgdmFsYCBpc1xuICogZXNjYXBlZCBkZXBlbmRzIG9uIHRoZSBjb3JyZXNwb25kaW5nIGl0ZW0gaW4gYGVzY2FwaW5nYC4gSWYgYGVzY2FwaW5nYCBpc1xuICogbm90IGFuIGFycmF5LCBubyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIElmIGB2YWxgIGlzIGFuIG9iamVjdCwgYWxsIHRoZSBrZXlzIHdob3NlIHZhbHVlIGlzIHRydXRoeSBhcmUgY291bnRlZCBhc1xuICogY2xhc3Nlcy4gTm8gZXNjYXBpbmcgaXMgZG9uZS5cbiAqXG4gKiBJZiBgdmFsYCBpcyBhIHN0cmluZywgaXQgaXMgY291bnRlZCBhcyBhIGNsYXNzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIEBwYXJhbSB7KEFycmF5LjxzdHJpbmc+fE9iamVjdC48c3RyaW5nLCBib29sZWFuPnxzdHJpbmcpfSB2YWxcbiAqIEBwYXJhbSB7P0FycmF5LjxzdHJpbmc+fSBlc2NhcGluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNsYXNzZXMgPSBwdWdfY2xhc3NlcztcbmZ1bmN0aW9uIHB1Z19jbGFzc2VzX2FycmF5KHZhbCwgZXNjYXBpbmcpIHtcbiAgdmFyIGNsYXNzU3RyaW5nID0gJycsIGNsYXNzTmFtZSwgcGFkZGluZyA9ICcnLCBlc2NhcGVFbmFibGVkID0gQXJyYXkuaXNBcnJheShlc2NhcGluZyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgY2xhc3NOYW1lID0gcHVnX2NsYXNzZXModmFsW2ldKTtcbiAgICBpZiAoIWNsYXNzTmFtZSkgY29udGludWU7XG4gICAgZXNjYXBlRW5hYmxlZCAmJiBlc2NhcGluZ1tpXSAmJiAoY2xhc3NOYW1lID0gcHVnX2VzY2FwZShjbGFzc05hbWUpKTtcbiAgICBjbGFzc1N0cmluZyA9IGNsYXNzU3RyaW5nICsgcGFkZGluZyArIGNsYXNzTmFtZTtcbiAgICBwYWRkaW5nID0gJyAnO1xuICB9XG4gIHJldHVybiBjbGFzc1N0cmluZztcbn1cbmZ1bmN0aW9uIHB1Z19jbGFzc2VzX29iamVjdCh2YWwpIHtcbiAgdmFyIGNsYXNzU3RyaW5nID0gJycsIHBhZGRpbmcgPSAnJztcbiAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgIGlmIChrZXkgJiYgdmFsW2tleV0gJiYgcHVnX2hhc19vd25fcHJvcGVydHkuY2FsbCh2YWwsIGtleSkpIHtcbiAgICAgIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgKyBwYWRkaW5nICsga2V5O1xuICAgICAgcGFkZGluZyA9ICcgJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNsYXNzU3RyaW5nO1xufVxuZnVuY3Rpb24gcHVnX2NsYXNzZXModmFsLCBlc2NhcGluZykge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuIHB1Z19jbGFzc2VzX2FycmF5KHZhbCwgZXNjYXBpbmcpO1xuICB9IGVsc2UgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBwdWdfY2xhc3Nlc19vYmplY3QodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsIHx8ICcnO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBvYmplY3Qgb3Igc3RyaW5nIHRvIGEgc3RyaW5nIG9mIENTUyBzdHlsZXMgZGVsaW1pdGVkIGJ5IGEgc2VtaWNvbG9uLlxuICpcbiAqIEBwYXJhbSB7KE9iamVjdC48c3RyaW5nLCBzdHJpbmc+fHN0cmluZyl9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuc3R5bGUgPSBwdWdfc3R5bGU7XG5mdW5jdGlvbiBwdWdfc3R5bGUodmFsKSB7XG4gIGlmICghdmFsKSByZXR1cm4gJyc7XG4gIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBvdXQgPSAnJztcbiAgICBmb3IgKHZhciBzdHlsZSBpbiB2YWwpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocHVnX2hhc19vd25fcHJvcGVydHkuY2FsbCh2YWwsIHN0eWxlKSkge1xuICAgICAgICBvdXQgPSBvdXQgKyBzdHlsZSArICc6JyArIHZhbFtzdHlsZV0gKyAnOyc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH0gZWxzZSB7XG4gICAgdmFsICs9ICcnO1xuICAgIGlmICh2YWxbdmFsLmxlbmd0aCAtIDFdICE9PSAnOycpIFxuICAgICAgcmV0dXJuIHZhbCArICc7JztcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBwdWdfYXR0cjtcbmZ1bmN0aW9uIHB1Z19hdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAodmFsID09PSBmYWxzZSB8fCB2YWwgPT0gbnVsbCB8fCAhdmFsICYmIChrZXkgPT09ICdjbGFzcycgfHwga2V5ID09PSAnc3R5bGUnKSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAodmFsID09PSB0cnVlKSB7XG4gICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFsID0gdmFsLnRvSlNPTigpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsICE9PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEpTT04uc3RyaW5naWZ5KHZhbCk7XG4gICAgaWYgKCFlc2NhcGVkICYmIHZhbC5pbmRleE9mKCdcIicpICE9PSAtMSkge1xuICAgICAgcmV0dXJuICcgJyArIGtleSArICc9XFwnJyArIHZhbC5yZXBsYWNlKC8nL2csICcmIzM5OycpICsgJ1xcJyc7XG4gICAgfVxuICB9XG4gIGlmIChlc2NhcGVkKSB2YWwgPSBwdWdfZXNjYXBlKHZhbCk7XG4gIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IHRlcnNlIHdoZXRoZXIgdG8gdXNlIEhUTUw1IHRlcnNlIGJvb2xlYW4gYXR0cmlidXRlc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gcHVnX2F0dHJzO1xuZnVuY3Rpb24gcHVnX2F0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYXR0cnMgPSAnJztcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKHB1Z19oYXNfb3duX3Byb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICB2YXIgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09PSBrZXkpIHtcbiAgICAgICAgdmFsID0gcHVnX2NsYXNzZXModmFsKTtcbiAgICAgICAgYXR0cnMgPSBwdWdfYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSArIGF0dHJzO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICgnc3R5bGUnID09PSBrZXkpIHtcbiAgICAgICAgdmFsID0gcHVnX3N0eWxlKHZhbCk7XG4gICAgICB9XG4gICAgICBhdHRycyArPSBwdWdfYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0cnM7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHB1Z19tYXRjaF9odG1sID0gL1tcIiY8Pl0vO1xuZXhwb3J0cy5lc2NhcGUgPSBwdWdfZXNjYXBlO1xuZnVuY3Rpb24gcHVnX2VzY2FwZShfaHRtbCl7XG4gIHZhciBodG1sID0gJycgKyBfaHRtbDtcbiAgdmFyIHJlZ2V4UmVzdWx0ID0gcHVnX21hdGNoX2h0bWwuZXhlYyhodG1sKTtcbiAgaWYgKCFyZWdleFJlc3VsdCkgcmV0dXJuIF9odG1sO1xuXG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIGksIGxhc3RJbmRleCwgZXNjYXBlO1xuICBmb3IgKGkgPSByZWdleFJlc3VsdC5pbmRleCwgbGFzdEluZGV4ID0gMDsgaSA8IGh0bWwubGVuZ3RoOyBpKyspIHtcbiAgICBzd2l0Y2ggKGh0bWwuY2hhckNvZGVBdChpKSkge1xuICAgICAgY2FzZSAzNDogZXNjYXBlID0gJyZxdW90Oyc7IGJyZWFrO1xuICAgICAgY2FzZSAzODogZXNjYXBlID0gJyZhbXA7JzsgYnJlYWs7XG4gICAgICBjYXNlIDYwOiBlc2NhcGUgPSAnJmx0Oyc7IGJyZWFrO1xuICAgICAgY2FzZSA2MjogZXNjYXBlID0gJyZndDsnOyBicmVhaztcbiAgICAgIGRlZmF1bHQ6IGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobGFzdEluZGV4ICE9PSBpKSByZXN1bHQgKz0gaHRtbC5zdWJzdHJpbmcobGFzdEluZGV4LCBpKTtcbiAgICBsYXN0SW5kZXggPSBpICsgMTtcbiAgICByZXN1bHQgKz0gZXNjYXBlO1xuICB9XG4gIGlmIChsYXN0SW5kZXggIT09IGkpIHJldHVybiByZXN1bHQgKyBodG1sLnN1YnN0cmluZyhsYXN0SW5kZXgsIGkpO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIHB1ZyBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBvcmlnaW5hbCBzb3VyY2VcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IHB1Z19yZXRocm93O1xuZnVuY3Rpb24gcHVnX3JldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHB1Z19yZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnUHVnJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcHVnLXJ1bnRpbWUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXHJcbiAqINCh0YDQsNCy0L3QuNCy0LDQtdGCINC+0LHRitC10LrRgtGLINC/0L4g0LfQvdCw0YfQvdC40LjRjlxyXG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcEVxdWFsIChzcmMsIGRlc3QpIHtcclxuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3JjKSA9PT0gSlNPTi5zdHJpbmdpZnkoZGVzdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LTQvdC40LzQsNC10YIg0L/QtdGA0LLRg9GOINCx0YPQutCy0YMg0YHRgtGA0L7QutC4INCyINCy0LXRgNGF0L3QuNC5INGA0LXQs9C40YHRgtGAXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIGNhcGl0YWxpemUgKHN0cikge1xyXG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcclxufVxyXG5cclxuZXhwb3J0IHtkZWVwRXF1YWwsIGNhcGl0YWxpemV9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay91dGlscy5qcyIsImV4cG9ydCBjbGFzcyBCYXNlVmlldyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih7ZWx9KSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INC/0L7QutCw0LfRi9Cy0LDQtdGCIHZpZXdcbiAgICAgKi9cbiAgICBzaG93ICgpIHtcbiAgICAgICAgdGhpcy5lbC5oaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INGB0LrRgNGL0LLQsNC10YIgdmlld1xuICAgICAqL1xuICAgIGhpZGUgKCkge1xuICAgICAgICB0aGlzLmVsLmhpZGRlbiA9IHRydWU7XG4gICAgfVxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay92aWV3LmpzIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih7bm9kZSwgaGlzdG9yeX0pIHtcbiAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5oaXN0b3J5ID0gaGlzdG9yeTtcblxuICAgICAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0LzQsNGA0YjRgNGD0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZVxuICAgICAqIEBwYXJhbSB7QmFzZVZpZXd9IHZpZXdcbiAgICAgKi9cbiAgICByZWdpc3Rlcihyb3V0ZSwgdmlldykge1xuICAgICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0gPSB2aWV3O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCS0YvQsdC+0YAgVmlldyDQv9C+INC80LDRgNGI0YDRg9GC0YNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGVcbiAgICAgKiBAcmV0dXJucyB7QmFzZVZpZXd9XG4gICAgICovXG4gICAgX2dldFZpZXdCeVJvdXRlKHJvdXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlc1tyb3V0ZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPINC60LvQuNC60LAg0L/QviDRgdGB0YvQu9C60LVcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgb25Sb3V0ZUNoYW5nZShldmVudCkge1xuXG4gICAgICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ28oZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpKSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCX0LDQv9GD0YHRgtC40YLRjCDQv9GA0L7RhtC10YEg0LzQsNGA0YjRgNGD0YLQuNC30LDRhtC40LhcbiAgICAgKi9cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5ub2RlXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB0aGlzLm9uUm91dGVDaGFuZ2UoZXZlbnQpKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBfID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ28obG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9C10YDQtdGC0LjQuSDQv9C+INC80LDRgNGI0YDRg9GC0YNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtINC10YHQu9C4INC10YHRgtGMINC80LDRgNGI0YDRg9GA0YJcbiAgICAgKi9cbiAgICBnbyhwYXRoKSB7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5fZ2V0Vmlld0J5Um91dGUocGF0aCk7XG5cbiAgICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VmlldyA9PT0gdmlldykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2aWV3LnNob3coKTtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIHBhdGgpO1xuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHZpZXc7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay9yb3V0ZXIuanMiLCJpbXBvcnQge0NoYXRWaWV3fSBmcm9tICcuL2NoYXQudmlldyc7XG4vLyBpbXBvcnQge0xvZ2luVmlld30gZnJvbSAnLi9sb2dpbi52aWV3JztcbmltcG9ydCB7TWFpblZpZXd9IGZyb20gJy4vbWFpbi52aWV3JztcblxuZXhwb3J0IGRlZmF1bHQge0NoYXQ6IENoYXRWaWV3LCBNYWluOiBNYWluVmlld307XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvaW5kZXguanMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9hcHAuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vYXBwLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9hcHAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9taWxsaWdyYW0uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuL21pbGxpZ3JhbS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9taWxsaWdyYW0uY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcclxuaW1wb3J0IHRtcGwgZnJvbSAnLi9jaGF0LnRtcGwucHVnJztcclxuaW1wb3J0ICcuL2NoYXQuY3NzJztcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDaGF0RGF0YVxyXG4gKlxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXNlciAtINC40LzRjyDRgtC10LrRg9GJ0LXQs9C+INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xyXG4gKiBAcHJvcGVydHkge0FycmF5PENoYXRNZXNzYWdlPn0gbWVzc2FnZXMgLSDQvNCw0YHRgdC4INGB0L7QvtCx0YnQtdC90LjQuSDQsiDRh9Cw0YLQtVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDaGF0TWVzc2FnZVxyXG4gKlxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGV4dCAtINCi0LXQutGB0YIg0YHQvtC+0LHRidC10L3QuNGPXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIC0g0LjQvNGPINC+0YLQv9GA0LDQstC40YLQtdC70Y8g0YHQvtC+0LHRidC10L3QuNGPXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXQge1xyXG5cdGNvbnN0cnVjdG9yKHtcclxuXHRcdFx0ZWwsXHJcblx0XHRcdGRhdGEgPSB7bWVzc2FnZXM6IFtdfSxcclxuXHRcdFx0YXZhdGFyU2VydmljZSxcclxuXHRcdFx0Y2hhdFNlcnZpY2VcclxuXHRcdH0pIHtcclxuXHRcdHRoaXMuZWwgPSBlbDtcclxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XHJcblxyXG5cdFx0dGhpcy5hdmF0YXJTZXJ2aWNlID0gYXZhdGFyU2VydmljZTtcclxuXHRcdHRoaXMuY2hhdFNlcnZpY2UgPSBjaGF0U2VydmljZTtcclxuXHJcblx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0fVxyXG5cclxuXHRfaW5pdEV2ZW50cyAoKSB7XHJcblx0XHR0aGlzLmNoYXRTZXJ2aWNlLm9uKCdtZXNzYWdlcycsIHRoaXMuX29uTWVzc2FnZXMuYmluZCh0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0dGhpcy5fc2F2ZVNjcm9sbFRvcCgpO1xyXG5cdFx0dGhpcy5lbC5pbm5lckhUTUwgPSB0bXBsKHRoaXMuZGF0YSk7XHJcblx0XHR0aGlzLl9yZXN0b3JlU2Nyb2xsVG9wKCk7XHJcblx0fVxyXG5cclxuXHRfb25NZXNzYWdlcyAobWVzc2FnZXMpIHtcclxuXHRcdHRoaXMuc2V0TWVzc2FnZXMobWVzc2FnZXMpO1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHR9XHJcblxyXG5cdF9zYXZlU2Nyb2xsVG9wICgpIHtcclxuXHRcdGxldCBjaGF0Qm94ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuY2hhdF9fYm94Jyk7XHJcblxyXG5cdFx0aWYgKGNoYXRCb3gpIHtcclxuXHRcdFx0dGhpcy5fc2Nyb2xsVG9wID0gY2hhdEJveC5zY3JvbGxUb3A7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcmVzdG9yZVNjcm9sbFRvcCAoKSB7XHJcblx0XHRsZXQgY2hhdEJveCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignLmNoYXRfX2JveCcpO1xyXG5cclxuXHRcdGlmIChjaGF0Qm94KSB7XHJcblx0XHRcdGNoYXRCb3guc2Nyb2xsVG9wID0gdGhpcy5fc2Nyb2xsVG9wO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0VXNlcm5hbWUgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZGF0YS51c2VyO1xyXG5cdH1cclxuXHJcblx0X3VwZGF0ZU1lc3NhZ2VzICgpIHtcclxuXHRcdHRoaXMuZGF0YS5tZXNzYWdlcyA9IHRoaXMuZGF0YS5tZXNzYWdlcy5zb3J0KChtZXNzYWdlMSwgbWVzc2FnZTIpID0+IHtcclxuXHRcdFx0cmV0dXJuIG1lc3NhZ2UyLmRhdGUgLSBtZXNzYWdlMS5kYXRlO1xyXG5cdFx0fSk7XHRcclxuXHR9XHJcblxyXG5cdHNldE1lc3NhZ2VzIChtZXNzYWdlcyA9IFtdKSB7XHJcblx0XHR0aGlzLmRhdGEubWVzc2FnZXMubGVuZ3RoID0gMDtcclxuXHRcdHRoaXMuYWRkKG1lc3NhZ2VzKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCc0LDRgdGB0L7QstC+0LUg0LTQvtCx0LDQstC70LXQvdC40LUg0YHQvtC+0LHRidC10L3QuNC5XHJcblx0ICogQHBhcmFtIHtBcnJheTxDaGF0TWVzc2FnZXM+fSBtZXNzYWdlc1xyXG5cdCAqL1xyXG5cdGFkZCAobWVzc2FnZXMgPSBbXSkge1xyXG5cdFx0bGV0IGFkZE9uZU1lc3NhZ2VNZXRob2QgPSB0aGlzLmFkZE9uZS5iaW5kKHRoaXMpO1xyXG5cclxuXHRcdG1lc3NhZ2VzLmZvckVhY2goYWRkT25lTWVzc2FnZU1ldGhvZCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQlNC+0LHQsNCy0LjRgtGMINC90L7QstC+0LUg0YHQvtC+0LHRidC10L3QuNC1INCyINGH0LDRglxyXG5cdCAqIEBwYXJhbSB7Q2hhdE1lc3NhZ2V9IGRhdGFcclxuXHQgKi9cclxuXHRhZGRPbmUgKGRhdGEpIHtcclxuXHRcdHRoaXMuZGF0YS5tZXNzYWdlcy5wdXNoKHRoaXMuX3ByZXBhcmVNZXNzYWdlKGRhdGEpKTtcclxuXHR9XHJcblxyXG5cdF9wcmVwYXJlTWVzc2FnZSAoe2F2YXRhciwgbmFtZSwgdGV4dCwgZGF0ZSA9IERhdGUubm93KCl9KSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhdmF0YXI6IHRoaXMuYXZhdGFyU2VydmljZS5nZXRBdmF0YXIobmFtZSksXHJcblx0XHRcdG5hbWUsXHJcblx0XHRcdGlzTWluZTogbmFtZSA9PT0gdGhpcy5kYXRhLnVzZXIsXHJcblx0XHRcdHRleHQsXHJcblx0XHRcdGRhdGU6IG5ldyBEYXRlKGRhdGUpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0YLQtdC60YPRidC10LPQviDRjtC30LXRgNCwXHJcblx0ICovXHJcblx0c2V0VXNlck5hbWUgKG5hbWUpIHtcclxuXHRcdHRoaXMuZGF0YS51c2VyID0gbmFtZTtcclxuXHR9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50cy9jaGF0L2NoYXQuanMiLCJpbXBvcnQgdG1wbCBmcm9tICcuL2Zvcm0udG1wbC5wdWcnO1xyXG5pbXBvcnQgJy4vZm9ybS5jc3MnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBGb3JtIHtcclxuXHRjb25zdHJ1Y3Rvcih7ZWwsIGRhdGEgPSB7fX0pIHtcclxuXHRcdHRoaXMuZWwgPSBlbDtcclxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XHJcblxyXG5cdFx0dGhpcy5faW5pdEV2ZW50cygpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHRoaXMuZWwuaW5uZXJIVE1MID0gdG1wbCh0aGlzLmRhdGEpO1xyXG5cclxuXHRcdHRoaXMuZm9ybUVsID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINC+0LHRgNCw0LHQvtGC0YfQuNC60LAg0YHQvtCx0YvRgtC40Y9cclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9ICAgbmFtZSAtINGC0LjQvyDRgdC+0LHRi9GC0LjRj1xyXG5cdCAqIEBwYXJhbSAge2Z1bmN0aW9ufSBjYlxyXG5cdCAqL1xyXG5cdG9uIChuYW1lLCBjYikge1xyXG5cdFx0dGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGNiKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCS0YvQt9C+0LIg0L7QsdGA0LDQsdC+0YLRh9C40LrQvtCyINGB0L7QsdGL0YLQuNC5XHJcblx0ICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIC0g0YLQuNC/INGB0L7QsdGL0YLQuNGPXHJcblx0ICogQHBhcmFtICB7Kn0gZGF0YVxyXG5cdCAqL1xyXG5cdHRyaWdnZXIgKG5hbWUsIGRhdGEpIHtcclxuXHRcdGxldCBldmVudCA9IG5ldyBDdXN0b21FdmVudChuYW1lLCB7ZGV0YWlsOiBkYXRhfSk7XHJcblxyXG5cdFx0dGhpcy5lbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHR9XHJcblxyXG5cdHJlc2V0ICgpIHtcclxuXHRcdHRoaXMuZm9ybUVsLnJlc2V0KCk7XHJcblx0fVxyXG5cclxuXHRzZXRVc2VyTmFtZSAobmFtZSkge1xyXG5cdFx0dGhpcy5kYXRhLnVzZXJuYW1lID0gbmFtZTtcclxuXHR9XHJcblxyXG5cdF9pbml0RXZlbnRzICgpIHtcclxuXHRcdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5fb25TdWJtaXQuYmluZCh0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRfb25TdWJtaXQgKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0bGV0IGZvcm1EYXRhID0gdGhpcy5fZ2V0Rm9ybURhdGEoKTtcclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ21lc3NhZ2UnLCBmb3JtRGF0YSk7XHJcblx0fVxyXG5cclxuXHRfZ2V0SW5wdXRzICgpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cdH1cclxuXHJcblx0X2dldEZvcm1EYXRhICgpIHtcclxuXHRcdGxldCBmb3JtRGF0YSA9IHt9O1xyXG5cclxuXHRcdFsuLi50aGlzLl9nZXRJbnB1dHMoKV0uZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRcdGZvcm1EYXRhW2lucHV0Lm5hbWVdID0ge1xyXG5cdFx0XHRcdHZhbHVlOiBpbnB1dC52YWx1ZVxyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGZvcm1EYXRhO1xyXG5cdH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL2Zvcm0vZm9ybS5qcyIsImltcG9ydCB0bXBsIGZyb20gJy4vbWVudS50bXBsLnB1Zyc7XG5pbXBvcnQgJy4vbWVudS5jc3MnO1xuXG5cbmV4cG9ydCBjbGFzcyBNZW51IHtcbiAgICBjb25zdHJ1Y3RvciAoe2VsLCBkYXRhID0ge319KSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRtcGwodGhpcy5kYXRhKTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50cy9tZW51L21lbnUuanMiLCJpbXBvcnQgJ21pbGxpZ3JhbS9kaXN0L21pbGxpZ3JhbS5jc3MnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvYXBwL2FwcC5jc3MnO1xuXG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnLi9mcmFtZXdvcmsvcm91dGVyJztcbmltcG9ydCB7Y2FwaXRhbGl6ZX0gZnJvbSAnLi9mcmFtZXdvcmsvdXRpbHMnO1xuXG5pbXBvcnQgdmlld3MgZnJvbSAnLi92aWV3cyc7XG5cbmNvbnN0IGFwcEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcCcpO1xuXG5jb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKHtcbiAgICBub2RlOiBhcHBFbCxcbiAgICBoaXN0b3J5OiB3aW5kb3cuaGlzdG9yeVxufSk7XG5cblsnbWFpbicsICdjaGF0J10uZm9yRWFjaCh2aWV3TmFtZSA9PiB7XG4gICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGV0IFZpZXcgPSB2aWV3c1tjYXBpdGFsaXplKHZpZXdOYW1lKV07XG5cbiAgICBlbC5jbGFzc0xpc3QuYWRkKHZpZXdOYW1lKTtcbiAgICBlbC5oaWRkZW4gPSB0cnVlO1xuICAgIGFwcEVsLmFwcGVuZENoaWxkKGVsKTtcblxuICAgIHJvdXRlci5yZWdpc3RlcihgLyR7dmlld05hbWV9YCwgbmV3IFZpZXcoeyBlbCB9KSk7XG59KTtcblxucm91dGVyLmdvKCcvbWFpbicpO1xucm91dGVyLnN0YXJ0KCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbWFpbi5qcyIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qcyIsImV4cG9ydCBjbGFzcyBBdmF0YXJTZXJ2aWNlIHtcclxuXHJcblx0Y29uc3RydWN0b3IgKCkge1xyXG5cdFx0dGhpcy5fYXZhdGFycyA9IHtcclxuXHRcdFx0J1RpbSc6ICdodHRwOi8vaS5pbWd1ci5jb20vRkhNbnNWTnQuanBnJyxcclxuXHRcdFx0J01hdHQnOiAnLy8xLmdyYXZhdGFyLmNvbS9hdmF0YXIvNzY3ZmM5YzExNWExYjk4OTc0NGM3NTVkYjQ3ZmViNjA/cz0yMDAmcj1wZyZkPW1tJ1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLl9kZWZhdWx0QXZhdGFyID0gJ2h0dHBzOi8vdW5zcGxhc2guaXQvMjAwLzIwMC8/cmFuZG9tJztcclxuXHR9XHJcblxyXG5cdGdldEF2YXRhciAobmFtZSA9ICcnKSB7XHJcblx0XHRpZiAoIXRoaXMuX2F2YXRhcnNbbmFtZV0pIHtcclxuXHRcdFx0dGhpcy5fYXZhdGFyc1tuYW1lXSA9IHRoaXMuX2RlZmF1bHRBdmF0YXIgKyBgPSR7RGF0ZS5ub3coKX1gO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLl9hdmF0YXJzW25hbWVdKTtcclxuXHRcdHJldHVybiB0aGlzLl9hdmF0YXJzW25hbWVdO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldEluc3RhbmNlICguLi5yZXN0KSB7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoLi4ucmVzdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvYXZhdGFyLnNlcnZpY2UuanMiLCJpbXBvcnQge2RlZXBFcXVhbH0gZnJvbSAnLi4vZnJhbWV3b3JrL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGF0U2VydmljZSB7XHJcblxyXG5cdGNvbnN0cnVjdG9yICh7YmFzZVVybCwgcG9sbGluZ0ludGVydmFsID0gMTUwMDAsIGh0dHB9KSB7XHJcblx0XHR0aGlzLnBvbGxpbmdJbnRlcnZhbCA9IHBvbGxpbmdJbnRlcnZhbDtcclxuXHRcdHRoaXMuaHR0cCA9IGh0dHA7XHJcblxyXG5cdFx0dGhpcy5odHRwLnNldEJhc2VVcmwoYmFzZVVybCk7XHJcblxyXG5cdFx0dGhpcy5fX21lc3NhZ2VzID0gW107XHJcblx0XHR0aGlzLl9fcG9sbGluZ0lEID0gbnVsbDtcclxuXHRcdHRoaXMuX19sYXN0UmVxVGltZSA9IG51bGw7XHJcblx0fVxyXG5cclxuXHRnZXRNZXNzYWdlcyAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5odHRwLm1ha2VSZXF1ZXN0KClcclxuXHRcdFx0LnRoZW4ocmVzcCA9PiBPYmplY3QudmFsdWVzKHJlc3AuZGF0YSkpO1xyXG5cdH1cclxuXHJcblx0c2VuZE1lc3NhZ2UgKGRhdGEpIHtcclxuXHRcdGRhdGEuZGF0ZSA9IERhdGUubm93KCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuaHR0cC5tYWtlUmVxdWVzdCgnUE9TVCcsIGRhdGEpXHJcblx0XHRcdC50aGVuKHJlc3AgPT4gcmVzcC5kYXRhKTtcclxuXHR9XHJcblxyXG5cdHN0YXJ0UG9sbGluZyAoKSB7XHJcblx0XHRsZXQgZG9SZXF1ZXN0ID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmdldE1lc3NhZ2VzKCkudGhlbihtZXNzYWdlcyA9PiB7XHJcblx0XHRcdFx0dGhpcy5zZXRNZXNzYWdlcyhtZXNzYWdlcyk7XHJcblx0XHRcdFx0dGhpcy5fX3BvbGxpbmdJRCA9IHNldFRpbWVvdXQoZG9SZXF1ZXN0LCB0aGlzLnBvbGxpbmdJbnRlcnZhbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHRkb1JlcXVlc3QoKTtcclxuXHR9XHJcblxyXG5cdHN0b3BQb2xsaW5nICgpIHtcclxuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5fX3BvbGxpbmdJRCk7XHJcblx0fVxyXG5cclxuXHRzZXRNZXNzYWdlcyAobWVzc2FnZXMpIHtcclxuXHRcdGlmIChkZWVwRXF1YWwodGhpcy5fbWVzc2FnZXMsIG1lc3NhZ2VzKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fbWVzc2FnZXMgPSBtZXNzYWdlcztcclxuXHRcdHRoaXMudHJpZ2dlcignbWVzc2FnZXMnLCB0aGlzLl9tZXNzYWdlcyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEaXNwYXRjaCBhbiBldmVudCBvbiB0aGlzIG9iamVjdFxyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGV2ZW50IG5hbWVcclxuXHQgKiBAcGFyYW0ge2FueX0gZGF0YSBldmVudCBwYXlsb2FkXHJcblx0ICovXHJcblx0dHJpZ2dlciAobmFtZSwgZGF0YSkge1xyXG5cdFx0aWYgKHRoaXMuX19jYWxsYmFja3MgJiYgdGhpcy5fX2NhbGxiYWNrc1tuYW1lXSkge1xyXG5cdFx0XHR0aGlzLl9fY2FsbGJhY2tzW25hbWVdLmZvckVhY2goY2IgPT4gY2IuY2FsbCh0aGlzLCBkYXRhKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTdWJzY3JpYmUgb24gZXZlbnRcclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBldmVudCBuYW1lXHJcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2IgY2FsbGJhY2tcclxuXHQgKi9cclxuXHRvbiAobmFtZSwgY2IpIHtcclxuXHRcdGlmICghdGhpcy5fX2NhbGxiYWNrcykge1xyXG5cdFx0XHR0aGlzLl9fY2FsbGJhY2tzID0ge307XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9fY2FsbGJhY2tzW25hbWVdKSB7XHJcblx0XHRcdHRoaXMuX19jYWxsYmFja3NbbmFtZV0gPSBbXTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9fY2FsbGJhY2tzW25hbWVdLnB1c2goY2IpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2V0IGluc3RhbmNlIG9mIHRoaXMgY2xhc3NcclxuXHQgKiBAc3RhdGljIFxyXG5cdCAqL1xyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZSAoLi4ucmVzdCkge1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKC4uLnJlc3QpO1xyXG5cdH1cclxuXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvY2hhdC5zZXJ2aWNlLmpzIiwiZXhwb3J0IGNsYXNzIEh0dHBTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7fVxuXG4gICAgLyoqXG4gICAgICogU2V0dGluZyB0aGUgYmFzZSBVUkwgZm9yIHJlcXVlc3RzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgICAqL1xuICAgIHNldEJhc2VVcmwgKHVybCkge1xuICAgICAgICB0aGlzLmJhc2VVcmwgPSB1cmw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFraW5nIGEgSFRUUCByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgc3BlY2lmaWVkIGEgSFRUUCBtZXRob2RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBzcGVjaWZpZWQgYSBib2R5IG9mIHJlcXVlc3RcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cblx0bWFrZVJlcXVlc3QgKHR5cGUgPSAnR0VUJywgZGF0YSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3Blbih0eXBlLCB0aGlzLmJhc2VVcmwsIHRydWUpO1xuXG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgeGhyXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgcmVqZWN0KTtcblxuICAgICAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICB9KTtcblx0fVxuXG4gICAgc3RhdGljIGdldEluc3RhbmNlICguLi5yZXN0KSB7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKC4uLnJlc3QpO1xuXHR9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvaHR0cC5zZXJ2aWNlLmpzIiwiZXhwb3J0IGNsYXNzIFdpbmRvd1NlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yICh7ZG9jdW1lbnR9KSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgbGlzdGVuZXIgdG8gJ3Zpc2liaWxpdHljaGFuZ2UnIGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2JcbiAgICAgKi9cbiAgICBvblZpc2liaWxpdHlDaGFuZ2UgKGNiKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsICgpID0+IHtcblx0XHRcdGNiKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSk7XG5cdFx0fSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEluc3RhbmNlICguLi5yZXN0KSB7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKC4uLnJlc3QpO1xuXHR9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvd2luZG93LnNlcnZpY2UuanMiLCJpbXBvcnQge0Jhc2VWaWV3fSBmcm9tICcuLi9mcmFtZXdvcmsvdmlldyc7XG5cbmltcG9ydCB7Q2hhdH0gZnJvbSAnLi4vY29tcG9uZW50cy9jaGF0L2NoYXQnO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuLi9jb21wb25lbnRzL2Zvcm0vZm9ybSc7XG5pbXBvcnQge0F2YXRhclNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2F2YXRhci5zZXJ2aWNlJztcbmltcG9ydCB7Q2hhdFNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2NoYXQuc2VydmljZSc7XG5pbXBvcnQge1dpbmRvd1NlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL3dpbmRvdy5zZXJ2aWNlJztcbmltcG9ydCB7SHR0cFNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2h0dHAuc2VydmljZSc7XG5cblxuY29uc3QgY2hhdFNlcnZpY2UgPSBDaGF0U2VydmljZS5nZXRJbnN0YW5jZSh7XG5cdGJhc2VVcmw6ICdodHRwczovL2NvbXBvbmVudHMtZTJlNmUuZmlyZWJhc2Vpby5jb20vY2hhdC9tZXNzYWdlcy9pa2V0YXJpLmpzb24nLFxuXHRodHRwOiBIdHRwU2VydmljZS5nZXRJbnN0YW5jZSgpLFxuXHRwb2xsaW5nSW50ZXJ2YWw6IDEwMDBcbn0pO1xuXG5jb25zdCB3aW5kb3dTZXJ2aWNlID0gV2luZG93U2VydmljZS5nZXRJbnN0YW5jZSh7ZG9jdW1lbnR9KTtcbmNvbnN0IGF2YXRhclNlcnZpY2UgPSBBdmF0YXJTZXJ2aWNlLmdldEluc3RhbmNlKCk7XG5cbmV4cG9ydCBjbGFzcyBDaGF0VmlldyBleHRlbmRzIEJhc2VWaWV3IHtcbiAgICBjb25zdHJ1Y3RvciAoLi4ucmVzdCkge1xuICAgICAgICBzdXBlciguLi5yZXN0KTtcblxuICAgICAgICB0aGlzLl9jcmVhdGVDb21wb25lbnRzKCk7XG5cdFx0dGhpcy5faW5pdE1lZGlhdGUoKTtcblxuXHRcdHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5jaGF0LmVsKTtcblx0XHR0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuZm9ybS5lbCk7XG5cblx0XHR0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG5cdFx0dGhpcy5jaGF0LnJlbmRlcigpO1xuXHRcdHRoaXMuZm9ybS5yZW5kZXIoKTtcblx0fVxuXG5cdF9jcmVhdGVDb21wb25lbnRzICgpIHtcblx0XHR0aGlzLmNoYXQgPSBuZXcgQ2hhdCh7XG5cdFx0XHRlbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRhdmF0YXJTZXJ2aWNlLFxuXHRcdFx0Y2hhdFNlcnZpY2Vcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybSA9IG5ldyBGb3JtKHtcblx0XHRcdGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdH0pO1xuXHR9XG5cblx0X2luaXRNZWRpYXRlICgpIHtcblx0XHR3aW5kb3dTZXJ2aWNlLm9uVmlzaWJpbGl0eUNoYW5nZShzdGF0dXMgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coc3RhdHVzKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybS5vbignbWVzc2FnZScsIChldmVudCkgPT4ge1xuXHRcdFx0bGV0IGRhdGEgPSBldmVudC5kZXRhaWw7XG5cdFx0XHRsZXQgdXNlck5hbWUgPSBldmVudC5kZXRhaWwudXNlcm5hbWUudmFsdWU7XG5cblx0XHRcdGlmICh1c2VyTmFtZSkge1xuXHRcdFx0XHR0aGlzLmNoYXQuc2V0VXNlck5hbWUodXNlck5hbWUpO1xuXHRcdFx0XHR0aGlzLmZvcm0uc2V0VXNlck5hbWUodXNlck5hbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRkYXRhID0ge1xuXHRcdFx0XHR0ZXh0OiBkYXRhLm1lc3NhZ2UudmFsdWUsXG5cdFx0XHRcdG5hbWU6IHRoaXMuY2hhdC5nZXRVc2VybmFtZSgpXG5cdFx0XHR9O1xuXG5cdFx0XHRjaGF0U2VydmljZS5zZW5kTWVzc2FnZShkYXRhLCAoKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdORVcgTVNHJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5jaGF0LmFkZE9uZShkYXRhKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9KTtcblxuXHRcdGNoYXRTZXJ2aWNlLnN0YXJ0UG9sbGluZygpO1xuXHR9XG5cblx0YWRkTWVzc2FnZSAoZGF0YSkge1xuXHRcdHRoaXMuY2hhdC5hZGRPbmUoZGF0YSk7XG5cdH1cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvY2hhdC52aWV3LmpzIiwiaW1wb3J0IHtCYXNlVmlld30gZnJvbSAnLi4vZnJhbWV3b3JrL3ZpZXcnO1xuXG5pbXBvcnQge01lbnV9IGZyb20gJy4uL2NvbXBvbmVudHMvbWVudS9tZW51JztcblxuZXhwb3J0IGNsYXNzIE1haW5WaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yICguLi5yZXN0KSB7XG4gICAgICAgIHN1cGVyKC4uLnJlc3QpO1xuXG4gICAgICAgIHRoaXMubWVudSA9IG5ldyBNZW51KHtcbiAgICAgICAgICAgIGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1NpbmdsZSBQYWdlIENoYXQnLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtocmVmOiAnL2xvZ2luJywgdGV4dDogJ9CS0L7QudGC0LgnfSxcbiAgICAgICAgICAgICAgICAgICAge2hyZWY6ICcvY2hhdCcsIHRleHQ6ICfQp9Cw0YInfSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5tZW51LmVsKTtcbiAgICAgICAgdGhpcy5tZW51LnJlbmRlcigpO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi92aWV3cy9tYWluLnZpZXcuanMiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIqIHtcXHJcXG4gIGZvbnQtZmFtaWx5OidIZWx2ZXRpY2EgTmV1ZScsSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcclxcbiAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbn1cXHJcXG5cXHJcXG4uYXBwIHtcXHJcXG5cXHR3aWR0aDogNDAwcHg7XFxyXFxuXFx0bWFyZ2luOjAgYXV0bztcXHJcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9jb21wb25lbnRzL2FwcC9hcHAuY3NzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuY2hhdF9fY29udGFpbmVyIHtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgZGlzcGxheTpibG9jaztcXHJcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxyXFxufVxcclxcblxcclxcbi5oZWFkZXJ7XFxyXFxuICBwYWRkaW5nOjIwcHggMjBweCAxOHB4IDIwcHg7XFxyXFxuICBiYWNrZ3JvdW5kOiM5YjRkY2E7XFxyXFxuICBjb2xvcjojZmZmO1xcclxcbn1cXHJcXG4uaGVhZGVyIGgye1xcclxcbiAgZm9udC1zaXplOjE2cHg7XFxyXFxuICBsaW5lLWhlaWdodDoxNXB4O1xcclxcbiAgZGlzcGxheTppbmxpbmUtYmxvY2s7XFxyXFxuICBsZXR0ZXItc3BhY2luZzogMC4wNWVtO1xcclxcbn1cXHJcXG4uaGVhZGVyIGF7XFxyXFxuICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG4gIGZsb2F0OnJpZ2h0O1xcclxcbiAgYmFja2dyb3VuZDojM2Q4YjRlO1xcclxcbiAgZm9udC1zaXplOjI1cHg7XFxyXFxuICBsaW5lLWhlaWdodDoyMHB4O1xcclxcbiAgcGFkZGluZzozcHggNnB4O1xcclxcbiAgbWFyZ2luLXRvcDotNXB4O1xcclxcbiAgYm9yZGVyLXJhZGl1czoycHg7XFxyXFxufVxcclxcblxcclxcbi5jaGF0X19ib3gge1xcclxcbiAgYmFja2dyb3VuZDogI0VDRUNFQztcXHJcXG4gIHBhZGRpbmc6IDAgMjBweDtcXHJcXG4gIGNvbG9yOiAjYTFhMWExO1xcclxcbiAgb3ZlcmZsb3cteTogYXV0bztcXHJcXG4gIGhlaWdodDogNjB2aDtcXHJcXG59XFxyXFxuXFxyXFxuLmNoYXRfX2JveCAubWVzc2FnZS1ib3h7XFxyXFxuICBwYWRkaW5nOjE4cHggMCAxMHB4O1xcclxcbiAgY2xlYXI6Ym90aDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94IC5waWN0dXJle1xcclxcbiAgZmxvYXQ6bGVmdDtcXHJcXG4gIHdpZHRoOjUwcHg7XFxyXFxuICBkaXNwbGF5OmJsb2NrO1xcclxcbiAgcGFkZGluZy1yaWdodDoxMHB4O1xcclxcbn1cXHJcXG4ucGljdHVyZSBpbWd7XFxyXFxuICB3aWR0aDo0M3B4O1xcclxcbiAgaGVpZ2h0OjQzcHg7XFxyXFxuICBib3JkZXItcmFkaXVzOjVweDtcXHJcXG59XFxyXFxuLnBpY3R1cmUgc3BhbiB7XFxyXFxuICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gIGZvbnQtc2l6ZTogMTBweDtcXHJcXG4gIGNsZWFyOiBib3RoO1xcclxcbiAgZGlzcGxheTogYmxvY2s7XFxyXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICBtYXJnaW4tdG9wOiAzcHg7XFxyXFxufVxcclxcbi5tZXNzYWdle1xcclxcbiAgYmFja2dyb3VuZDojZmZmO1xcclxcbiAgZGlzcGxheTppbmxpbmUtYmxvY2s7XFxyXFxuICBwYWRkaW5nOjEzcHg7XFxyXFxuICB3aWR0aDoyNzRweDtcXHJcXG4gIGJvcmRlci1yYWRpdXM6MnB4O1xcclxcbiAgYm94LXNoYWRvdzogMCAxcHggMXB4IHJnYmEoMCwwLDAsLjA0KTtcXHJcXG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xcclxcbn1cXHJcXG4ubWVzc2FnZTpiZWZvcmV7XFxyXFxuICBjb250ZW50OlxcXCJcXFwiO1xcclxcbiAgcG9zaXRpb246YWJzb2x1dGU7XFxyXFxuICBkaXNwbGF5OmJsb2NrO1xcclxcbiAgbGVmdDowO1xcclxcbiAgYm9yZGVyLXJpZ2h0OjZweCBzb2xpZCAjZmZmO1xcclxcbiAgYm9yZGVyLXRvcDogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTo2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICB0b3A6MTBweDtcXHJcXG4gIG1hcmdpbi1sZWZ0Oi02cHg7XFxyXFxufVxcclxcbi5tZXNzYWdlIHNwYW57XFxyXFxuICBjb2xvcjojNTU1O1xcclxcbiAgZm9udC13ZWlnaHQ6Ym9sZDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UgcHtcXHJcXG4gIHBhZGRpbmctdG9wOjVweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94LnJpZ2h0LWltZyAucGljdHVyZXtcXHJcXG4gIGZsb2F0OnJpZ2h0O1xcclxcbiAgcGFkZGluZzowO1xcclxcbiAgcGFkZGluZy1sZWZ0OjEwcHg7XFxyXFxufVxcclxcbi5tZXNzYWdlLWJveC5yaWdodC1pbWcgLnBpY3R1cmUgaW1ne1xcclxcbiAgZmxvYXQ6cmlnaHQ7XFxyXFxufVxcclxcbi5tZXNzYWdlLWJveC5yaWdodC1pbWcgLm1lc3NhZ2U6YmVmb3Jle1xcclxcbiAgbGVmdDoxMDAlO1xcclxcbiAgbWFyZ2luLXJpZ2h0OjZweDtcXHJcXG4gIG1hcmdpbi1sZWZ0OjA7XFxyXFxuICBib3JkZXItcmlnaHQ6NnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWxlZnQ6NnB4IHNvbGlkICNmZmY7XFxyXFxuICBib3JkZXItdG9wOiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOjZweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9jb21wb25lbnRzL2NoYXQvY2hhdC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vY29tcG9uZW50cy9mb3JtL2Zvcm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL2NvbXBvbmVudHMvbWVudS9tZW51LmNzc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKiFcXG4gKiBNaWxsaWdyYW0gdjEuMy4wXFxuICogaHR0cHM6Ly9taWxsaWdyYW0uZ2l0aHViLmlvXFxuICpcXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgQ0ogUGF0b2lsb1xcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxcbiAqL1xcblxcbiosXFxuKjphZnRlcixcXG4qOmJlZm9yZSB7XFxuICBib3gtc2l6aW5nOiBpbmhlcml0O1xcbn1cXG5cXG5odG1sIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBmb250LXNpemU6IDYyLjUlO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGNvbG9yOiAjNjA2Yzc2O1xcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCAnSGVsdmV0aWNhIE5ldWUnLCAnSGVsdmV0aWNhJywgJ0FyaWFsJywgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMS42ZW07XFxuICBmb250LXdlaWdodDogMzAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC4wMWVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuNjtcXG59XFxuXFxuYmxvY2txdW90ZSB7XFxuICBib3JkZXItbGVmdDogMC4zcmVtIHNvbGlkICNkMWQxZDE7XFxuICBtYXJnaW4tbGVmdDogMDtcXG4gIG1hcmdpbi1yaWdodDogMDtcXG4gIHBhZGRpbmc6IDFyZW0gMS41cmVtO1xcbn1cXG5cXG5ibG9ja3F1b3RlICo6bGFzdC1jaGlsZCB7XFxuICBtYXJnaW4tYm90dG9tOiAwO1xcbn1cXG5cXG4uYnV0dG9uLFxcbmJ1dHRvbixcXG5pbnB1dFt0eXBlPSdidXR0b24nXSxcXG5pbnB1dFt0eXBlPSdyZXNldCddLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM5YjRkY2E7XFxuICBib3JkZXI6IDAuMXJlbSBzb2xpZCAjOWI0ZGNhO1xcbiAgYm9yZGVyLXJhZGl1czogLjRyZW07XFxuICBjb2xvcjogI2ZmZjtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGhlaWdodDogMy44cmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC4xcmVtO1xcbiAgbGluZS1oZWlnaHQ6IDMuOHJlbTtcXG4gIHBhZGRpbmc6IDAgMy4wcmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxufVxcblxcbi5idXR0b246Zm9jdXMsIC5idXR0b246aG92ZXIsXFxuYnV0dG9uOmZvY3VzLFxcbmJ1dHRvbjpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J106aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J106Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J106aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzYwNmM3NjtcXG4gIGJvcmRlci1jb2xvcjogIzYwNmM3NjtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgb3V0bGluZTogMDtcXG59XFxuXFxuLmJ1dHRvbltkaXNhYmxlZF0sXFxuYnV0dG9uW2Rpc2FibGVkXSxcXG5pbnB1dFt0eXBlPSdidXR0b24nXVtkaXNhYmxlZF0sXFxuaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF0sXFxuaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdIHtcXG4gIGN1cnNvcjogZGVmYXVsdDtcXG4gIG9wYWNpdHk6IC41O1xcbn1cXG5cXG4uYnV0dG9uW2Rpc2FibGVkXTpmb2N1cywgLmJ1dHRvbltkaXNhYmxlZF06aG92ZXIsXFxuYnV0dG9uW2Rpc2FibGVkXTpmb2N1cyxcXG5idXR0b25bZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddW2Rpc2FibGVkXTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjOWI0ZGNhO1xcbiAgYm9yZGVyLWNvbG9yOiAjOWI0ZGNhO1xcbn1cXG5cXG4uYnV0dG9uLmJ1dHRvbi1vdXRsaW5lLFxcbmJ1dHRvbi5idXR0b24tb3V0bGluZSxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZSxcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1vdXRsaW5lLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6ICM5YjRkY2E7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLW91dGxpbmU6Zm9jdXMsIC5idXR0b24uYnV0dG9uLW91dGxpbmU6aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lOmZvY3VzLFxcbmJ1dHRvbi5idXR0b24tb3V0bGluZTpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1vdXRsaW5lOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmU6aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmU6Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmU6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItY29sb3I6ICM2MDZjNzY7XFxuICBjb2xvcjogIzYwNmM3NjtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsIC5idXR0b24uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmJ1dHRvbi5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIge1xcbiAgYm9yZGVyLWNvbG9yOiBpbmhlcml0O1xcbiAgY29sb3I6ICM5YjRkY2E7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLWNsZWFyLFxcbmJ1dHRvbi5idXR0b24tY2xlYXIsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tY2xlYXI6Zm9jdXMsIC5idXR0b24uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmJ1dHRvbi5idXR0b24tY2xlYXI6Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcjpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXI6Zm9jdXMsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhcjpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tY2xlYXI6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6ICM2MDZjNzY7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cywgLmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmZvY3VzLFxcbmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpob3ZlciB7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuY29kZSB7XFxuICBiYWNrZ3JvdW5kOiAjZjRmNWY2O1xcbiAgYm9yZGVyLXJhZGl1czogLjRyZW07XFxuICBmb250LXNpemU6IDg2JTtcXG4gIG1hcmdpbjogMCAuMnJlbTtcXG4gIHBhZGRpbmc6IC4ycmVtIC41cmVtO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG59XFxuXFxucHJlIHtcXG4gIGJhY2tncm91bmQ6ICNmNGY1ZjY7XFxuICBib3JkZXItbGVmdDogMC4zcmVtIHNvbGlkICM5YjRkY2E7XFxuICBvdmVyZmxvdy15OiBoaWRkZW47XFxufVxcblxcbnByZSA+IGNvZGUge1xcbiAgYm9yZGVyLXJhZGl1czogMDtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcGFkZGluZzogMXJlbSAxLjVyZW07XFxuICB3aGl0ZS1zcGFjZTogcHJlO1xcbn1cXG5cXG5ociB7XFxuICBib3JkZXI6IDA7XFxuICBib3JkZXItdG9wOiAwLjFyZW0gc29saWQgI2Y0ZjVmNjtcXG4gIG1hcmdpbjogMy4wcmVtIDA7XFxufVxcblxcbmlucHV0W3R5cGU9J2VtYWlsJ10sXFxuaW5wdXRbdHlwZT0nbnVtYmVyJ10sXFxuaW5wdXRbdHlwZT0ncGFzc3dvcmQnXSxcXG5pbnB1dFt0eXBlPSdzZWFyY2gnXSxcXG5pbnB1dFt0eXBlPSd0ZWwnXSxcXG5pbnB1dFt0eXBlPSd0ZXh0J10sXFxuaW5wdXRbdHlwZT0ndXJsJ10sXFxudGV4dGFyZWEsXFxuc2VsZWN0IHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gICAgIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcXG4gICAgICAgICAgYXBwZWFyYW5jZTogbm9uZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyOiAwLjFyZW0gc29saWQgI2QxZDFkMTtcXG4gIGJvcmRlci1yYWRpdXM6IC40cmVtO1xcbiAgYm94LXNoYWRvdzogbm9uZTtcXG4gIGJveC1zaXppbmc6IGluaGVyaXQ7XFxuICBoZWlnaHQ6IDMuOHJlbTtcXG4gIHBhZGRpbmc6IC42cmVtIDEuMHJlbTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG5pbnB1dFt0eXBlPSdlbWFpbCddOmZvY3VzLFxcbmlucHV0W3R5cGU9J251bWJlciddOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Bhc3N3b3JkJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc2VhcmNoJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ndGVsJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ndGV4dCddOmZvY3VzLFxcbmlucHV0W3R5cGU9J3VybCddOmZvY3VzLFxcbnRleHRhcmVhOmZvY3VzLFxcbnNlbGVjdDpmb2N1cyB7XFxuICBib3JkZXItY29sb3I6ICM5YjRkY2E7XFxuICBvdXRsaW5lOiAwO1xcbn1cXG5cXG5zZWxlY3Qge1xcbiAgYmFja2dyb3VuZDogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgaGVpZ2h0PVxcXCIxNFxcXCIgdmlld0JveD1cXFwiMCAwIDI5IDE0XFxcIiB3aWR0aD1cXFwiMjlcXFwiPjxwYXRoIGZpbGw9XFxcIiNkMWQxZDFcXFwiIGQ9XFxcIk05LjM3NzI3IDMuNjI1bDUuMDgxNTQgNi45MzUyM0wxOS41NDAzNiAzLjYyNVxcXCIvPjwvc3ZnPicpIGNlbnRlciByaWdodCBuby1yZXBlYXQ7XFxuICBwYWRkaW5nLXJpZ2h0OiAzLjByZW07XFxufVxcblxcbnNlbGVjdDpmb2N1cyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBoZWlnaHQ9XFxcIjE0XFxcIiB2aWV3Qm94PVxcXCIwIDAgMjkgMTRcXFwiIHdpZHRoPVxcXCIyOVxcXCI+PHBhdGggZmlsbD1cXFwiIzliNGRjYVxcXCIgZD1cXFwiTTkuMzc3MjcgMy42MjVsNS4wODE1NCA2LjkzNTIzTDE5LjU0MDM2IDMuNjI1XFxcIi8+PC9zdmc+Jyk7XFxufVxcblxcbnRleHRhcmVhIHtcXG4gIG1pbi1oZWlnaHQ6IDYuNXJlbTtcXG59XFxuXFxubGFiZWwsXFxubGVnZW5kIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZm9udC1zaXplOiAxLjZyZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgbWFyZ2luLWJvdHRvbTogLjVyZW07XFxufVxcblxcbmZpZWxkc2V0IHtcXG4gIGJvcmRlci13aWR0aDogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbmlucHV0W3R5cGU9J2NoZWNrYm94J10sXFxuaW5wdXRbdHlwZT0ncmFkaW8nXSB7XFxuICBkaXNwbGF5OiBpbmxpbmU7XFxufVxcblxcbi5sYWJlbC1pbmxpbmUge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gIG1hcmdpbi1sZWZ0OiAuNXJlbTtcXG59XFxuXFxuLmNvbnRhaW5lciB7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIG1heC13aWR0aDogMTEyLjByZW07XFxuICBwYWRkaW5nOiAwIDIuMHJlbTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgcGFkZGluZzogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucm93LnJvdy1uby1wYWRkaW5nIHtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5yb3cucm93LW5vLXBhZGRpbmcgPiAuY29sdW1uIHtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5yb3cucm93LXdyYXAge1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG5cXG4ucm93LnJvdy10b3Age1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi5yb3cucm93LWJvdHRvbSB7XFxuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XFxufVxcblxcbi5yb3cucm93LWNlbnRlciB7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ucm93LnJvdy1zdHJldGNoIHtcXG4gIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xcbn1cXG5cXG4ucm93LnJvdy1iYXNlbGluZSB7XFxuICBhbGlnbi1pdGVtczogYmFzZWxpbmU7XFxufVxcblxcbi5yb3cgLmNvbHVtbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGZsZXg6IDEgMSBhdXRvO1xcbiAgbWFyZ2luLWxlZnQ6IDA7XFxuICBtYXgtd2lkdGg6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMTAge1xcbiAgbWFyZ2luLWxlZnQ6IDEwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMjAge1xcbiAgbWFyZ2luLWxlZnQ6IDIwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMjUge1xcbiAgbWFyZ2luLWxlZnQ6IDI1JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMzMsIC5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTM0IHtcXG4gIG1hcmdpbi1sZWZ0OiAzMy4zMzMzJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNTAge1xcbiAgbWFyZ2luLWxlZnQ6IDUwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNjYsIC5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTY3IHtcXG4gIG1hcmdpbi1sZWZ0OiA2Ni42NjY2JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNzUge1xcbiAgbWFyZ2luLWxlZnQ6IDc1JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtODAge1xcbiAgbWFyZ2luLWxlZnQ6IDgwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtOTAge1xcbiAgbWFyZ2luLWxlZnQ6IDkwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi0xMCB7XFxuICBmbGV4OiAwIDAgMTAlO1xcbiAgbWF4LXdpZHRoOiAxMCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tMjAge1xcbiAgZmxleDogMCAwIDIwJTtcXG4gIG1heC13aWR0aDogMjAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTI1IHtcXG4gIGZsZXg6IDAgMCAyNSU7XFxuICBtYXgtd2lkdGg6IDI1JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi0zMywgLnJvdyAuY29sdW1uLmNvbHVtbi0zNCB7XFxuICBmbGV4OiAwIDAgMzMuMzMzMyU7XFxuICBtYXgtd2lkdGg6IDMzLjMzMzMlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTQwIHtcXG4gIGZsZXg6IDAgMCA0MCU7XFxuICBtYXgtd2lkdGg6IDQwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi01MCB7XFxuICBmbGV4OiAwIDAgNTAlO1xcbiAgbWF4LXdpZHRoOiA1MCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNjAge1xcbiAgZmxleDogMCAwIDYwJTtcXG4gIG1heC13aWR0aDogNjAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTY2LCAucm93IC5jb2x1bW4uY29sdW1uLTY3IHtcXG4gIGZsZXg6IDAgMCA2Ni42NjY2JTtcXG4gIG1heC13aWR0aDogNjYuNjY2NiU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNzUge1xcbiAgZmxleDogMCAwIDc1JTtcXG4gIG1heC13aWR0aDogNzUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTgwIHtcXG4gIGZsZXg6IDAgMCA4MCU7XFxuICBtYXgtd2lkdGg6IDgwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi05MCB7XFxuICBmbGV4OiAwIDAgOTAlO1xcbiAgbWF4LXdpZHRoOiA5MCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbiAuY29sdW1uLXRvcCB7XFxuICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xcbn1cXG5cXG4ucm93IC5jb2x1bW4gLmNvbHVtbi1ib3R0b20ge1xcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxufVxcblxcbi5yb3cgLmNvbHVtbiAuY29sdW1uLWNlbnRlciB7XFxuICAtbXMtZ3JpZC1yb3ctYWxpZ246IGNlbnRlcjtcXG4gICAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbkBtZWRpYSAobWluLXdpZHRoOiA0MHJlbSkge1xcbiAgLnJvdyB7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIG1hcmdpbi1sZWZ0OiAtMS4wcmVtO1xcbiAgICB3aWR0aDogY2FsYygxMDAlICsgMi4wcmVtKTtcXG4gIH1cXG4gIC5yb3cgLmNvbHVtbiB7XFxuICAgIG1hcmdpbi1ib3R0b206IGluaGVyaXQ7XFxuICAgIHBhZGRpbmc6IDAgMS4wcmVtO1xcbiAgfVxcbn1cXG5cXG5hIHtcXG4gIGNvbG9yOiAjOWI0ZGNhO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5hOmZvY3VzLCBhOmhvdmVyIHtcXG4gIGNvbG9yOiAjNjA2Yzc2O1xcbn1cXG5cXG5kbCxcXG5vbCxcXG51bCB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgbWFyZ2luLXRvcDogMDtcXG4gIHBhZGRpbmctbGVmdDogMDtcXG59XFxuXFxuZGwgZGwsXFxuZGwgb2wsXFxuZGwgdWwsXFxub2wgZGwsXFxub2wgb2wsXFxub2wgdWwsXFxudWwgZGwsXFxudWwgb2wsXFxudWwgdWwge1xcbiAgZm9udC1zaXplOiA5MCU7XFxuICBtYXJnaW46IDEuNXJlbSAwIDEuNXJlbSAzLjByZW07XFxufVxcblxcbm9sIHtcXG4gIGxpc3Qtc3R5bGU6IGRlY2ltYWwgaW5zaWRlO1xcbn1cXG5cXG51bCB7XFxuICBsaXN0LXN0eWxlOiBjaXJjbGUgaW5zaWRlO1xcbn1cXG5cXG4uYnV0dG9uLFxcbmJ1dHRvbixcXG5kZCxcXG5kdCxcXG5saSB7XFxuICBtYXJnaW4tYm90dG9tOiAxLjByZW07XFxufVxcblxcbmZpZWxkc2V0LFxcbmlucHV0LFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XFxufVxcblxcbmJsb2NrcXVvdGUsXFxuZGwsXFxuZmlndXJlLFxcbmZvcm0sXFxub2wsXFxucCxcXG5wcmUsXFxudGFibGUsXFxudWwge1xcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xcbn1cXG5cXG50YWJsZSB7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG50ZCxcXG50aCB7XFxuICBib3JkZXItYm90dG9tOiAwLjFyZW0gc29saWQgI2UxZTFlMTtcXG4gIHBhZGRpbmc6IDEuMnJlbSAxLjVyZW07XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbn1cXG5cXG50ZDpmaXJzdC1jaGlsZCxcXG50aDpmaXJzdC1jaGlsZCB7XFxuICBwYWRkaW5nLWxlZnQ6IDA7XFxufVxcblxcbnRkOmxhc3QtY2hpbGQsXFxudGg6bGFzdC1jaGlsZCB7XFxuICBwYWRkaW5nLXJpZ2h0OiAwO1xcbn1cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxucCB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbn1cXG5cXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNiB7XFxuICBmb250LXdlaWdodDogMzAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMXJlbTtcXG4gIG1hcmdpbi1ib3R0b206IDIuMHJlbTtcXG4gIG1hcmdpbi10b3A6IDA7XFxufVxcblxcbmgxIHtcXG4gIGZvbnQtc2l6ZTogNC42cmVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuMjtcXG59XFxuXFxuaDIge1xcbiAgZm9udC1zaXplOiAzLjZyZW07XFxuICBsaW5lLWhlaWdodDogMS4yNTtcXG59XFxuXFxuaDMge1xcbiAgZm9udC1zaXplOiAyLjhyZW07XFxuICBsaW5lLWhlaWdodDogMS4zO1xcbn1cXG5cXG5oNCB7XFxuICBmb250LXNpemU6IDIuMnJlbTtcXG4gIGxldHRlci1zcGFjaW5nOiAtLjA4cmVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuMzU7XFxufVxcblxcbmg1IHtcXG4gIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMDVyZW07XFxuICBsaW5lLWhlaWdodDogMS41O1xcbn1cXG5cXG5oNiB7XFxuICBmb250LXNpemU6IDEuNnJlbTtcXG4gIGxldHRlci1zcGFjaW5nOiAwO1xcbiAgbGluZS1oZWlnaHQ6IDEuNDtcXG59XFxuXFxuaW1nIHtcXG4gIG1heC13aWR0aDogMTAwJTtcXG59XFxuXFxuLmNsZWFyZml4OmFmdGVyIHtcXG4gIGNsZWFyOiBib3RoO1xcbiAgY29udGVudDogJyAnO1xcbiAgZGlzcGxheTogdGFibGU7XFxufVxcblxcbi5mbG9hdC1sZWZ0IHtcXG4gIGZsb2F0OiBsZWZ0O1xcbn1cXG5cXG4uZmxvYXQtcmlnaHQge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL34vbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKG1lc3NhZ2VzLCB1c2VyKSB7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2hhdFxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2hhdF9fY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJoZWFkZXJcXFwiXFx1MDAzRVxcdTAwM0NoMlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSAn0JTQvtCx0YDQviDQv9C+0LbQsNC70L7QstCw0YLRjCAnICsgKHVzZXIgfHwgJycpKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2hhdF9fYm94XFxcIlxcdTAwM0VcIjtcbmlmICghbWVzc2FnZXMubGVuZ3RoKSB7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDaDNcXHUwMDNF0J/QvtC60LAg0L3QtdGCINGB0L7QvtCx0YnQtdC90LjQuVxcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXCI7XG59XG4vLyBpdGVyYXRlIG1lc3NhZ2VzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IG1lc3NhZ2VzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgcHVnX2luZGV4MCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgcHVnX2luZGV4MCA8ICQkbDsgcHVnX2luZGV4MCsrKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XCIgKyAocHVnLmF0dHIoXCJjbGFzc1wiLCBwdWcuY2xhc3NlcyhbXCJtZXNzYWdlLWJveFwiLG1lc3NhZ2UuaXNNaW5lID8gJ2xlZnQtaW1nJyA6ICdyaWdodC1pbWcnXSwgW2ZhbHNlLHRydWVdKSwgZmFsc2UsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInBpY3R1cmVcXFwiXFx1MDAzRVxcdTAwM0NpbWdcIiArIChwdWcuYXR0cihcInNyY1wiLCBtZXNzYWdlLmF2YXRhciwgdHJ1ZSwgdHJ1ZSkrXCIgdGl0bGU9XFxcIm5hbWUgb2YgdXNlclxcXCJcIikgKyBcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwidGltZVxcXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS5kYXRlICYmIG1lc3NhZ2UuZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzBdKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NwXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UudGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7XG4gICAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgcHVnX2luZGV4MCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7XG4gICAgICB2YXIgbWVzc2FnZSA9ICQkb2JqW3B1Z19pbmRleDBdO1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdlwiICsgKHB1Zy5hdHRyKFwiY2xhc3NcIiwgcHVnLmNsYXNzZXMoW1wibWVzc2FnZS1ib3hcIixtZXNzYWdlLmlzTWluZSA/ICdsZWZ0LWltZycgOiAncmlnaHQtaW1nJ10sIFtmYWxzZSx0cnVlXSksIGZhbHNlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJwaWN0dXJlXFxcIlxcdTAwM0VcXHUwMDNDaW1nXCIgKyAocHVnLmF0dHIoXCJzcmNcIiwgbWVzc2FnZS5hdmF0YXIsIHRydWUsIHRydWUpK1wiIHRpdGxlPVxcXCJuYW1lIG9mIHVzZXJcXFwiXCIpICsgXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcInRpbWVcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UuZGF0ZSAmJiBtZXNzYWdlLmRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVswXSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWVzc2FnZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDcFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLnRleHQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiO1xuICAgIH1cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJtZXNzYWdlc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubWVzc2FnZXM6dHlwZW9mIG1lc3NhZ2VzIT09XCJ1bmRlZmluZWRcIj9tZXNzYWdlczp1bmRlZmluZWQsXCJ1c2VyXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VyOnR5cGVvZiB1c2VyIT09XCJ1bmRlZmluZWRcIj91c2VyOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2NoYXQvY2hhdC50bXBsLnB1Z1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHVzZXJuYW1lKSB7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2Zvcm1cXHUwMDNFXFx1MDAzQ3RleHRhcmVhIG5hbWU9XFxcIm1lc3NhZ2VcXFwiIHBsYWNlaG9sZGVyPVxcXCLQktCy0LXQtNC40YLQtSDRgdC+0L7QsdGJ0LXQvdC40LUuLi5cXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGdGV4dGFyZWFcXHUwMDNFXFx1MDAzQ2JyXFx1MDAzRVxcdTAwM0NpbnB1dFwiICsgKFwiIHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcInVzZXJuYW1lXFxcIlwiK3B1Zy5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdXNlcm5hbWUgfHwgXCLQmNC80Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPLi4uXCIsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NpbnB1dCB0eXBlPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCLQntGC0L/RgNCw0LLQuNGC0YxcXFwiXFx1MDAzRVxcdTAwM0NcXHUwMDJGZm9ybVxcdTAwM0VcIjt9LmNhbGwodGhpcyxcInVzZXJuYW1lXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VybmFtZTp0eXBlb2YgdXNlcm5hbWUhPT1cInVuZGVmaW5lZFwiP3VzZXJuYW1lOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2Zvcm0vZm9ybS50bXBsLnB1Z1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGl0ZW1zLCB0aXRsZSkge3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NoMVxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSB0aXRsZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmgxXFx1MDAzRVxcdTAwM0N1bFxcdTAwM0VcIjtcbi8vIGl0ZXJhdGUgaXRlbXNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gaXRlbXM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJCRsOyBwdWdfaW5kZXgwKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSAkJG9ialtwdWdfaW5kZXgwXTtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NsaVxcdTAwM0VcXHUwMDNDYVwiICsgKHB1Zy5hdHRyKFwiaHJlZlwiLCBpdGVtLmhyZWYsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGl0ZW0udGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmFcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcIjtcbiAgICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICQkb2JqKSB7XG4gICAgICAkJGwrKztcbiAgICAgIHZhciBpdGVtID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDbGlcXHUwMDNFXFx1MDAzQ2FcIiArIChwdWcuYXR0cihcImhyZWZcIiwgaXRlbS5ocmVmLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBpdGVtLnRleHQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZhXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXCI7XG4gICAgfVxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDXFx1MDAyRnVsXFx1MDAzRVwiO30uY2FsbCh0aGlzLFwiaXRlbXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLml0ZW1zOnR5cGVvZiBpdGVtcyE9PVwidW5kZWZpbmVkXCI/aXRlbXM6dW5kZWZpbmVkLFwidGl0bGVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnRpdGxlOnR5cGVvZiB0aXRsZSE9PVwidW5kZWZpbmVkXCI/dGl0bGU6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvbWVudS9tZW51LnRtcGwucHVnXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9jaGF0LmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2NoYXQuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2NoYXQuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvY2hhdC9jaGF0LmNzc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZm9ybS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9mb3JtLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9mb3JtLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2Zvcm0vZm9ybS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21lbnUuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWVudS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWVudS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9tZW51L21lbnUuY3NzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiAoaWdub3JlZCkgKi9cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBmcyAoaWdub3JlZClcbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=