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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
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
	fixUrls = __webpack_require__(15);

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


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseView = exports.BaseView = function () {
    function BaseView(_ref) {
        var el = _ref.el,
            router = _ref.router;

        _classCallCheck(this, BaseView);

        this.el = el;
        this.router = router;
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
/* 3 */
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
    str = str || __webpack_require__(32).readFileSync(filename, 'utf8')
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Form = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formTmpl = __webpack_require__(27);

var _formTmpl2 = _interopRequireDefault(_formTmpl);

__webpack_require__(30);

var _emitter = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Form = exports.Form = function () {
	function Form(_ref) {
		var el = _ref.el,
		    _ref$data = _ref.data,
		    data = _ref$data === undefined ? {} : _ref$data;

		_classCallCheck(this, Form);

		_emitter.Emitter.apply(this);
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
	}, {
		key: 'reset',
		value: function reset() {
			this.formEl.reset();
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

			this.trigger('submit', formData);
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Menu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _menuTmpl = __webpack_require__(28);

var _menuTmpl2 = _interopRequireDefault(_menuTmpl);

__webpack_require__(31);

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
            this.el.innerHTML = (0, _menuTmpl2.default)(this.data);
        }
    }]);

    return Menu;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Emitter = Emitter;
function Emitter() {

	/**
 * Вызов обработчиков событий
 * @param {string} name event name
 * @param {*} data event payload
 */
	this.trigger = function (name, data) {
		var _this = this;

		if (this.__callbacks && this.__callbacks[name]) {
			this.__callbacks[name].forEach(function (cb) {
				return cb.call(_this, data);
			});
		}
	};

	/**
  * Регистрация обработчика события
  * @param {string} name event name
  * @param {function} cb callback
  */
	this.on = function (name, cb) {
		if (!this.__callbacks) {
			this.__callbacks = {};
		}

		if (!this.__callbacks[name]) {
			this.__callbacks[name] = [];
		}

		this.__callbacks[name].push(cb);
	};
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ChatService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

var _emitter = __webpack_require__(7);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatService = exports.ChatService = function () {
	function ChatService(_ref) {
		var baseUrl = _ref.baseUrl,
		    _ref$pollingInterval = _ref.pollingInterval,
		    pollingInterval = _ref$pollingInterval === undefined ? 15000 : _ref$pollingInterval,
		    http = _ref.http;

		_classCallCheck(this, ChatService);

		_emitter.Emitter.apply(this);

		this.pollingInterval = pollingInterval;
		this.http = http;

		this.http.setBaseUrl(baseUrl);

		this.__messages = [];
		this.__pollingID = null;
		this.__lastReqTime = null;
		this.__username = 'anonimus';
	}

	_createClass(ChatService, [{
		key: 'setUserName',
		value: function setUserName(name) {
			this.__username = name;
		}
	}, {
		key: 'getUserName',
		value: function getUserName() {
			return this.__username;
		}
	}, {
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
			data.name = this.__username;

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
   * Get instance of this class
   * @static 
   */

	}], [{
		key: 'getInstance',
		value: function getInstance() {
			if (!this.__instance) {
				for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
					rest[_key] = arguments[_key];
				}

				this.__instance = new (Function.prototype.bind.apply(this, [null].concat(rest)))();
			}

			return this.__instance;
		}
	}]);

	return ChatService;
}();

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chat = __webpack_require__(18);

var _login = __webpack_require__(19);

var _main = __webpack_require__(20);

exports.default = { Chat: _chat.ChatView, Main: _main.MainView, Login: _login.LoginView };

/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Chat = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chatTmpl = __webpack_require__(26);

var _chatTmpl2 = _interopRequireDefault(_chatTmpl);

__webpack_require__(29);

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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(12);

__webpack_require__(11);

var _router = __webpack_require__(9);

var _utils = __webpack_require__(4);

var _views = __webpack_require__(10);

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appEl = document.querySelector('.app');

var router = new _router.Router({
    node: appEl,
    history: window.history
});

['main', 'chat', 'login'].forEach(function (viewName) {
    var el = document.createElement('div');
    var View = _views2.default[(0, _utils.capitalize)(viewName)];

    el.classList.add(viewName);
    el.hidden = true;
    appEl.appendChild(el);

    router.register('/' + viewName, new View({ el: el, router: router }));
});

if (location.pathname === '/') {
    router.go('/main');
} else {
    router.go(location.pathname);
}

router.start();

/***/ }),
/* 15 */
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
/* 16 */
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
				this._avatars[name] = this._defaultAvatar + ('=' + Math.random());
			}

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
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChatView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _view = __webpack_require__(2);

var _chat = __webpack_require__(13);

var _form = __webpack_require__(5);

var _avatar = __webpack_require__(16);

var _chat2 = __webpack_require__(8);

var _http = __webpack_require__(17);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var chatService = _chat2.ChatService.getInstance({
    baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json',
    http: _http.HttpService.getInstance(),
    pollingInterval: 1000
});

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
        key: 'show',
        value: function show() {
            this.chat.setUserName(chatService.getUserName());
            this.render();
            _get(ChatView.prototype.__proto__ || Object.getPrototypeOf(ChatView.prototype), 'show', this).call(this);
        }
    }, {
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
                el: document.createElement('div'),
                data: {
                    widgets: [{
                        tag: 'textarea',
                        attributes: {
                            name: 'message',
                            placeholder: 'Введите сообщение...'
                        }
                    }, {
                        tag: 'input',
                        attributes: {
                            type: 'submit',
                            value: 'Отправить'
                        }
                    }, {
                        tag: 'a',
                        inner: 'Выйти',
                        attributes: {
                            href: '/main'
                        }
                    }]
                }
            });
        }
    }, {
        key: '_initMediate',
        value: function _initMediate() {
            var _this2 = this;

            this.form.on('submit', function (formData) {
                var data = {
                    text: formData.message.value
                };

                chatService.sendMessage(data);

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
exports.LoginView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _view = __webpack_require__(2);

var _form = __webpack_require__(5);

var _menu = __webpack_require__(6);

var _chat = __webpack_require__(8);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginView = exports.LoginView = function (_BaseView) {
    _inherits(LoginView, _BaseView);

    function LoginView() {
        var _ref;

        _classCallCheck(this, LoginView);

        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = LoginView.__proto__ || Object.getPrototypeOf(LoginView)).call.apply(_ref, [this].concat(rest)));

        _this.menu = new _menu.Menu({
            el: document.createElement('div'),
            data: {
                title: 'Авторизация',
                items: []
            }
        });

        _this.form = new _form.Form({
            el: document.createElement('div'),
            data: {
                widgets: [{
                    tag: 'input',
                    attributes: {
                        type: 'text',
                        name: 'username',
                        placeholder: 'Имя пользователя...'
                    }
                }, {
                    tag: 'input',
                    attributes: {
                        type: 'submit',
                        value: 'Войти'
                    }
                }]
            }
        });

        _this.el.appendChild(_this.menu.el);
        _this.el.appendChild(_this.form.el);

        _this.form.render();
        _this.menu.render();

        _this._initMediate();
        return _this;
    }

    _createClass(LoginView, [{
        key: '_initMediate',
        value: function _initMediate() {
            var _this2 = this;

            this.form.on('submit', function (formData) {
                var chatService = _chat.ChatService.getInstance();

                chatService.setUserName(formData.username.value);
                _this2.router.go('/chat');
            });
        }
    }]);

    return LoginView;
}(_view.BaseView);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MainView = undefined;

var _view = __webpack_require__(2);

var _menu = __webpack_require__(6);

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "* {\r\n  font-family:'Helvetica Neue',Helvetica, sans-serif;\r\n  font-size: 14px;\r\n  margin: 0;\r\n}\r\n\r\n.app {\r\n\twidth: 400px;\r\n\tmargin:0 auto;\r\n}", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".chat__container {\r\n  width: 100%;\r\n  display:block;\r\n  overflow: hidden;\r\n}\r\n\r\n.header{\r\n  padding:20px 20px 18px 20px;\r\n  background:#9b4dca;\r\n  color:#fff;\r\n}\r\n.header h2{\r\n  font-size:16px;\r\n  line-height:15px;\r\n  display:inline-block;\r\n  letter-spacing: 0.05em;\r\n}\r\n.header a{\r\n  display:inline-block;\r\n  background:#3d8b4e;\r\n  font-size:25px;\r\n  line-height:20px;\r\n  padding:3px 6px;\r\n  margin-top:-5px;\r\n  border-radius:2px;\r\n}\r\n\r\n.chat__box {\r\n  background: #ECECEC;\r\n  padding: 0 20px;\r\n  color: #a1a1a1;\r\n  overflow-y: auto;\r\n  height: 60vh;\r\n}\r\n\r\n.chat__box .message-box{\r\n  padding:18px 0 10px;\r\n  clear:both;\r\n}\r\n.message-box .picture{\r\n  float:left;\r\n  width:50px;\r\n  display:block;\r\n  padding-right:10px;\r\n}\r\n.picture img{\r\n  width:43px;\r\n  height:43px;\r\n  border-radius:5px;\r\n}\r\n.picture span {\r\n  font-weight: bold;\r\n  font-size: 10px;\r\n  clear: both;\r\n  display: block;\r\n  text-align: center;\r\n  margin-top: 3px;\r\n}\r\n.message{\r\n  background:#fff;\r\n  display:inline-block;\r\n  padding:13px;\r\n  width:274px;\r\n  border-radius:2px;\r\n  box-shadow: 0 1px 1px rgba(0,0,0,.04);\r\n  position:relative;\r\n}\r\n.message:before{\r\n  content:\"\";\r\n  position:absolute;\r\n  display:block;\r\n  left:0;\r\n  border-right:6px solid #fff;\r\n  border-top: 6px solid transparent;\r\n  border-bottom:6px solid transparent;\r\n  top:10px;\r\n  margin-left:-6px;\r\n}\r\n.message span{\r\n  color:#555;\r\n  font-weight:bold;\r\n}\r\n.message p{\r\n  padding-top:5px;\r\n}\r\n.message-box.right-img .picture{\r\n  float:right;\r\n  padding:0;\r\n  padding-left:10px;\r\n}\r\n.message-box.right-img .picture img{\r\n  float:right;\r\n}\r\n.message-box.right-img .message:before{\r\n  left:100%;\r\n  margin-right:6px;\r\n  margin-left:0;\r\n  border-right:6px solid transparent;\r\n  border-left:6px solid #fff;\r\n  border-top: 6px solid transparent;\r\n  border-bottom:6px solid transparent;\r\n}", ""]);

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
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n * Milligram v1.3.0\n * https://milligram.github.io\n *\n * Copyright (c) 2017 CJ Patoilo\n * Licensed under the MIT license\n */\n\n*,\n*:after,\n*:before {\n  box-sizing: inherit;\n}\n\nhtml {\n  box-sizing: border-box;\n  font-size: 62.5%;\n}\n\nbody {\n  color: #606c76;\n  font-family: 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;\n  font-size: 1.6em;\n  font-weight: 300;\n  letter-spacing: .01em;\n  line-height: 1.6;\n}\n\nblockquote {\n  border-left: 0.3rem solid #d1d1d1;\n  margin-left: 0;\n  margin-right: 0;\n  padding: 1rem 1.5rem;\n}\n\nblockquote *:last-child {\n  margin-bottom: 0;\n}\n\n.button,\nbutton,\ninput[type='button'],\ninput[type='reset'],\ninput[type='submit'] {\n  background-color: #9b4dca;\n  border: 0.1rem solid #9b4dca;\n  border-radius: .4rem;\n  color: #fff;\n  cursor: pointer;\n  display: inline-block;\n  font-size: 1.1rem;\n  font-weight: 700;\n  height: 3.8rem;\n  letter-spacing: .1rem;\n  line-height: 3.8rem;\n  padding: 0 3.0rem;\n  text-align: center;\n  text-decoration: none;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n\n.button:focus, .button:hover,\nbutton:focus,\nbutton:hover,\ninput[type='button']:focus,\ninput[type='button']:hover,\ninput[type='reset']:focus,\ninput[type='reset']:hover,\ninput[type='submit']:focus,\ninput[type='submit']:hover {\n  background-color: #606c76;\n  border-color: #606c76;\n  color: #fff;\n  outline: 0;\n}\n\n.button[disabled],\nbutton[disabled],\ninput[type='button'][disabled],\ninput[type='reset'][disabled],\ninput[type='submit'][disabled] {\n  cursor: default;\n  opacity: .5;\n}\n\n.button[disabled]:focus, .button[disabled]:hover,\nbutton[disabled]:focus,\nbutton[disabled]:hover,\ninput[type='button'][disabled]:focus,\ninput[type='button'][disabled]:hover,\ninput[type='reset'][disabled]:focus,\ninput[type='reset'][disabled]:hover,\ninput[type='submit'][disabled]:focus,\ninput[type='submit'][disabled]:hover {\n  background-color: #9b4dca;\n  border-color: #9b4dca;\n}\n\n.button.button-outline,\nbutton.button-outline,\ninput[type='button'].button-outline,\ninput[type='reset'].button-outline,\ninput[type='submit'].button-outline {\n  background-color: transparent;\n  color: #9b4dca;\n}\n\n.button.button-outline:focus, .button.button-outline:hover,\nbutton.button-outline:focus,\nbutton.button-outline:hover,\ninput[type='button'].button-outline:focus,\ninput[type='button'].button-outline:hover,\ninput[type='reset'].button-outline:focus,\ninput[type='reset'].button-outline:hover,\ninput[type='submit'].button-outline:focus,\ninput[type='submit'].button-outline:hover {\n  background-color: transparent;\n  border-color: #606c76;\n  color: #606c76;\n}\n\n.button.button-outline[disabled]:focus, .button.button-outline[disabled]:hover,\nbutton.button-outline[disabled]:focus,\nbutton.button-outline[disabled]:hover,\ninput[type='button'].button-outline[disabled]:focus,\ninput[type='button'].button-outline[disabled]:hover,\ninput[type='reset'].button-outline[disabled]:focus,\ninput[type='reset'].button-outline[disabled]:hover,\ninput[type='submit'].button-outline[disabled]:focus,\ninput[type='submit'].button-outline[disabled]:hover {\n  border-color: inherit;\n  color: #9b4dca;\n}\n\n.button.button-clear,\nbutton.button-clear,\ninput[type='button'].button-clear,\ninput[type='reset'].button-clear,\ninput[type='submit'].button-clear {\n  background-color: transparent;\n  border-color: transparent;\n  color: #9b4dca;\n}\n\n.button.button-clear:focus, .button.button-clear:hover,\nbutton.button-clear:focus,\nbutton.button-clear:hover,\ninput[type='button'].button-clear:focus,\ninput[type='button'].button-clear:hover,\ninput[type='reset'].button-clear:focus,\ninput[type='reset'].button-clear:hover,\ninput[type='submit'].button-clear:focus,\ninput[type='submit'].button-clear:hover {\n  background-color: transparent;\n  border-color: transparent;\n  color: #606c76;\n}\n\n.button.button-clear[disabled]:focus, .button.button-clear[disabled]:hover,\nbutton.button-clear[disabled]:focus,\nbutton.button-clear[disabled]:hover,\ninput[type='button'].button-clear[disabled]:focus,\ninput[type='button'].button-clear[disabled]:hover,\ninput[type='reset'].button-clear[disabled]:focus,\ninput[type='reset'].button-clear[disabled]:hover,\ninput[type='submit'].button-clear[disabled]:focus,\ninput[type='submit'].button-clear[disabled]:hover {\n  color: #9b4dca;\n}\n\ncode {\n  background: #f4f5f6;\n  border-radius: .4rem;\n  font-size: 86%;\n  margin: 0 .2rem;\n  padding: .2rem .5rem;\n  white-space: nowrap;\n}\n\npre {\n  background: #f4f5f6;\n  border-left: 0.3rem solid #9b4dca;\n  overflow-y: hidden;\n}\n\npre > code {\n  border-radius: 0;\n  display: block;\n  padding: 1rem 1.5rem;\n  white-space: pre;\n}\n\nhr {\n  border: 0;\n  border-top: 0.1rem solid #f4f5f6;\n  margin: 3.0rem 0;\n}\n\ninput[type='email'],\ninput[type='number'],\ninput[type='password'],\ninput[type='search'],\ninput[type='tel'],\ninput[type='text'],\ninput[type='url'],\ntextarea,\nselect {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: transparent;\n  border: 0.1rem solid #d1d1d1;\n  border-radius: .4rem;\n  box-shadow: none;\n  box-sizing: inherit;\n  height: 3.8rem;\n  padding: .6rem 1.0rem;\n  width: 100%;\n}\n\ninput[type='email']:focus,\ninput[type='number']:focus,\ninput[type='password']:focus,\ninput[type='search']:focus,\ninput[type='tel']:focus,\ninput[type='text']:focus,\ninput[type='url']:focus,\ntextarea:focus,\nselect:focus {\n  border-color: #9b4dca;\n  outline: 0;\n}\n\nselect {\n  background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"14\" viewBox=\"0 0 29 14\" width=\"29\"><path fill=\"#d1d1d1\" d=\"M9.37727 3.625l5.08154 6.93523L19.54036 3.625\"/></svg>') center right no-repeat;\n  padding-right: 3.0rem;\n}\n\nselect:focus {\n  background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"14\" viewBox=\"0 0 29 14\" width=\"29\"><path fill=\"#9b4dca\" d=\"M9.37727 3.625l5.08154 6.93523L19.54036 3.625\"/></svg>');\n}\n\ntextarea {\n  min-height: 6.5rem;\n}\n\nlabel,\nlegend {\n  display: block;\n  font-size: 1.6rem;\n  font-weight: 700;\n  margin-bottom: .5rem;\n}\n\nfieldset {\n  border-width: 0;\n  padding: 0;\n}\n\ninput[type='checkbox'],\ninput[type='radio'] {\n  display: inline;\n}\n\n.label-inline {\n  display: inline-block;\n  font-weight: normal;\n  margin-left: .5rem;\n}\n\n.container {\n  margin: 0 auto;\n  max-width: 112.0rem;\n  padding: 0 2.0rem;\n  position: relative;\n  width: 100%;\n}\n\n.row {\n  display: flex;\n  flex-direction: column;\n  padding: 0;\n  width: 100%;\n}\n\n.row.row-no-padding {\n  padding: 0;\n}\n\n.row.row-no-padding > .column {\n  padding: 0;\n}\n\n.row.row-wrap {\n  flex-wrap: wrap;\n}\n\n.row.row-top {\n  align-items: flex-start;\n}\n\n.row.row-bottom {\n  align-items: flex-end;\n}\n\n.row.row-center {\n  align-items: center;\n}\n\n.row.row-stretch {\n  align-items: stretch;\n}\n\n.row.row-baseline {\n  align-items: baseline;\n}\n\n.row .column {\n  display: block;\n  flex: 1 1 auto;\n  margin-left: 0;\n  max-width: 100%;\n  width: 100%;\n}\n\n.row .column.column-offset-10 {\n  margin-left: 10%;\n}\n\n.row .column.column-offset-20 {\n  margin-left: 20%;\n}\n\n.row .column.column-offset-25 {\n  margin-left: 25%;\n}\n\n.row .column.column-offset-33, .row .column.column-offset-34 {\n  margin-left: 33.3333%;\n}\n\n.row .column.column-offset-50 {\n  margin-left: 50%;\n}\n\n.row .column.column-offset-66, .row .column.column-offset-67 {\n  margin-left: 66.6666%;\n}\n\n.row .column.column-offset-75 {\n  margin-left: 75%;\n}\n\n.row .column.column-offset-80 {\n  margin-left: 80%;\n}\n\n.row .column.column-offset-90 {\n  margin-left: 90%;\n}\n\n.row .column.column-10 {\n  flex: 0 0 10%;\n  max-width: 10%;\n}\n\n.row .column.column-20 {\n  flex: 0 0 20%;\n  max-width: 20%;\n}\n\n.row .column.column-25 {\n  flex: 0 0 25%;\n  max-width: 25%;\n}\n\n.row .column.column-33, .row .column.column-34 {\n  flex: 0 0 33.3333%;\n  max-width: 33.3333%;\n}\n\n.row .column.column-40 {\n  flex: 0 0 40%;\n  max-width: 40%;\n}\n\n.row .column.column-50 {\n  flex: 0 0 50%;\n  max-width: 50%;\n}\n\n.row .column.column-60 {\n  flex: 0 0 60%;\n  max-width: 60%;\n}\n\n.row .column.column-66, .row .column.column-67 {\n  flex: 0 0 66.6666%;\n  max-width: 66.6666%;\n}\n\n.row .column.column-75 {\n  flex: 0 0 75%;\n  max-width: 75%;\n}\n\n.row .column.column-80 {\n  flex: 0 0 80%;\n  max-width: 80%;\n}\n\n.row .column.column-90 {\n  flex: 0 0 90%;\n  max-width: 90%;\n}\n\n.row .column .column-top {\n  align-self: flex-start;\n}\n\n.row .column .column-bottom {\n  align-self: flex-end;\n}\n\n.row .column .column-center {\n  -ms-grid-row-align: center;\n      align-self: center;\n}\n\n@media (min-width: 40rem) {\n  .row {\n    flex-direction: row;\n    margin-left: -1.0rem;\n    width: calc(100% + 2.0rem);\n  }\n  .row .column {\n    margin-bottom: inherit;\n    padding: 0 1.0rem;\n  }\n}\n\na {\n  color: #9b4dca;\n  text-decoration: none;\n}\n\na:focus, a:hover {\n  color: #606c76;\n}\n\ndl,\nol,\nul {\n  list-style: none;\n  margin-top: 0;\n  padding-left: 0;\n}\n\ndl dl,\ndl ol,\ndl ul,\nol dl,\nol ol,\nol ul,\nul dl,\nul ol,\nul ul {\n  font-size: 90%;\n  margin: 1.5rem 0 1.5rem 3.0rem;\n}\n\nol {\n  list-style: decimal inside;\n}\n\nul {\n  list-style: circle inside;\n}\n\n.button,\nbutton,\ndd,\ndt,\nli {\n  margin-bottom: 1.0rem;\n}\n\nfieldset,\ninput,\nselect,\ntextarea {\n  margin-bottom: 1.5rem;\n}\n\nblockquote,\ndl,\nfigure,\nform,\nol,\np,\npre,\ntable,\nul {\n  margin-bottom: 2.5rem;\n}\n\ntable {\n  border-spacing: 0;\n  width: 100%;\n}\n\ntd,\nth {\n  border-bottom: 0.1rem solid #e1e1e1;\n  padding: 1.2rem 1.5rem;\n  text-align: left;\n}\n\ntd:first-child,\nth:first-child {\n  padding-left: 0;\n}\n\ntd:last-child,\nth:last-child {\n  padding-right: 0;\n}\n\nb,\nstrong {\n  font-weight: bold;\n}\n\np {\n  margin-top: 0;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-weight: 300;\n  letter-spacing: -.1rem;\n  margin-bottom: 2.0rem;\n  margin-top: 0;\n}\n\nh1 {\n  font-size: 4.6rem;\n  line-height: 1.2;\n}\n\nh2 {\n  font-size: 3.6rem;\n  line-height: 1.25;\n}\n\nh3 {\n  font-size: 2.8rem;\n  line-height: 1.3;\n}\n\nh4 {\n  font-size: 2.2rem;\n  letter-spacing: -.08rem;\n  line-height: 1.35;\n}\n\nh5 {\n  font-size: 1.8rem;\n  letter-spacing: -.05rem;\n  line-height: 1.5;\n}\n\nh6 {\n  font-size: 1.6rem;\n  letter-spacing: 0;\n  line-height: 1.4;\n}\n\nimg {\n  max-width: 100%;\n}\n\n.clearfix:after {\n  clear: both;\n  content: ' ';\n  display: table;\n}\n\n.float-left {\n  float: left;\n}\n\n.float-right {\n  float: right;\n}", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(3);

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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(3);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (widgets) {pug_html = pug_html + "\u003Cform\u003E";
// iterate widgets
;(function(){
  var $$obj = widgets;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var widget = $$obj[pug_index0];
var tagName = widget.tag || 'input'
var inner = widget.inner || ''
pug_html = pug_html + "\u003C" + (tagName) + (pug.attrs(widget.attributes, true)) + "\u003E" + (pug.escape(null == (pug_interp = inner) ? "" : pug_interp)) + "\u003C\u002F" + (tagName) + "\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var widget = $$obj[pug_index0];
var tagName = widget.tag || 'input'
var inner = widget.inner || ''
pug_html = pug_html + "\u003C" + (tagName) + (pug.attrs(widget.attributes, true)) + "\u003E" + (pug.escape(null == (pug_interp = inner) ? "" : pug_interp)) + "\u003C\u002F" + (tagName) + "\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fform\u003E";}.call(this,"widgets" in locals_for_with?locals_for_with.widgets:typeof widgets!=="undefined"?widgets:undefined));;return pug_html;};
module.exports = template;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(3);

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
/* 31 */
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
/* 32 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmY2NjVlM2JiMjk3N2VkNjk4YzUiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wdWctcnVudGltZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9mcmFtZXdvcmsvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9mb3JtL2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9tZW51L21lbnUuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL2VtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmljZXMvY2hhdC5zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL2ZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9hcHAvYXBwLmNzcz8yMzZmIiwid2VicGFjazovLy8uL34vbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzcz8xNzIwIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LmpzIiwid2VicGFjazovLy8uL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2aWNlcy9hdmF0YXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2aWNlcy9odHRwLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvY2hhdC52aWV3LmpzIiwid2VicGFjazovLy8uL3ZpZXdzL2xvZ2luLnZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvbWFpbi52aWV3LmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvYXBwL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jaGF0L2NoYXQuY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLmNzcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL21lbnUvbWVudS5jc3MiLCJ3ZWJwYWNrOi8vLy4vfi9taWxsaWdyYW0vZGlzdC9taWxsaWdyYW0uY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvbWVudS9tZW51LnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LmNzcz82MTYzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLmNzcz82NmVjIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvbWVudS9tZW51LmNzcz9kNjYzIiwid2VicGFjazovLy9mcyAoaWdub3JlZCkiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsInVzZVNvdXJjZU1hcCIsImxpc3QiLCJ0b1N0cmluZyIsIm1hcCIsIml0ZW0iLCJjb250ZW50IiwiY3NzV2l0aE1hcHBpbmdUb1N0cmluZyIsImpvaW4iLCJpIiwibW9kdWxlcyIsIm1lZGlhUXVlcnkiLCJhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzIiwibGVuZ3RoIiwiaWQiLCJwdXNoIiwiY3NzTWFwcGluZyIsImJ0b2EiLCJzb3VyY2VNYXBwaW5nIiwidG9Db21tZW50Iiwic291cmNlVVJMcyIsInNvdXJjZXMiLCJzb3VyY2UiLCJzb3VyY2VSb290IiwiY29uY2F0Iiwic291cmNlTWFwIiwiYmFzZTY0IiwidW5lc2NhcGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwiZGF0YSIsIkJhc2VWaWV3IiwiZWwiLCJyb3V0ZXIiLCJoaWRkZW4iLCJkZWVwRXF1YWwiLCJzcmMiLCJkZXN0IiwiY2FwaXRhbGl6ZSIsInN0ciIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJGb3JtIiwiYXBwbHkiLCJfaW5pdEV2ZW50cyIsImlubmVySFRNTCIsImZvcm1FbCIsInF1ZXJ5U2VsZWN0b3IiLCJyZXNldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25TdWJtaXQiLCJiaW5kIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiX2dldEZvcm1EYXRhIiwidHJpZ2dlciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfZ2V0SW5wdXRzIiwiZm9yRWFjaCIsImlucHV0IiwibmFtZSIsInZhbHVlIiwiTWVudSIsIkVtaXR0ZXIiLCJfX2NhbGxiYWNrcyIsImNiIiwiY2FsbCIsIm9uIiwiQ2hhdFNlcnZpY2UiLCJiYXNlVXJsIiwicG9sbGluZ0ludGVydmFsIiwiaHR0cCIsInNldEJhc2VVcmwiLCJfX21lc3NhZ2VzIiwiX19wb2xsaW5nSUQiLCJfX2xhc3RSZXFUaW1lIiwiX191c2VybmFtZSIsIm1ha2VSZXF1ZXN0IiwidGhlbiIsIk9iamVjdCIsInZhbHVlcyIsInJlc3AiLCJkYXRlIiwiRGF0ZSIsIm5vdyIsImRvUmVxdWVzdCIsImdldE1lc3NhZ2VzIiwic2V0TWVzc2FnZXMiLCJtZXNzYWdlcyIsInNldFRpbWVvdXQiLCJjbGVhckludGVydmFsIiwiX21lc3NhZ2VzIiwiX19pbnN0YW5jZSIsInJlc3QiLCJSb3V0ZXIiLCJub2RlIiwiaGlzdG9yeSIsInJvdXRlcyIsInJvdXRlIiwidmlldyIsInRhcmdldCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZ28iLCJnZXRBdHRyaWJ1dGUiLCJvblJvdXRlQ2hhbmdlIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsInBhdGgiLCJfZ2V0Vmlld0J5Um91dGUiLCJjdXJyZW50VmlldyIsInNob3ciLCJwdXNoU3RhdGUiLCJoaWRlIiwiQ2hhdCIsIk1haW4iLCJMb2dpbiIsImF2YXRhclNlcnZpY2UiLCJjaGF0U2VydmljZSIsIl9vbk1lc3NhZ2VzIiwiX3NhdmVTY3JvbGxUb3AiLCJfcmVzdG9yZVNjcm9sbFRvcCIsInJlbmRlciIsImNoYXRCb3giLCJfc2Nyb2xsVG9wIiwic2Nyb2xsVG9wIiwic29ydCIsIm1lc3NhZ2UxIiwibWVzc2FnZTIiLCJhZGQiLCJhZGRPbmVNZXNzYWdlTWV0aG9kIiwiYWRkT25lIiwiX3ByZXBhcmVNZXNzYWdlIiwiYXZhdGFyIiwidGV4dCIsImdldEF2YXRhciIsImlzTWluZSIsInVzZXIiLCJhcHBFbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIlZpZXciLCJ2aWV3TmFtZSIsImNsYXNzTGlzdCIsImFwcGVuZENoaWxkIiwicmVnaXN0ZXIiLCJzdGFydCIsImNzcyIsIkVycm9yIiwicHJvdG9jb2wiLCJob3N0IiwiY3VycmVudERpciIsInJlcGxhY2UiLCJmaXhlZENzcyIsImZ1bGxNYXRjaCIsIm9yaWdVcmwiLCJ1bnF1b3RlZE9yaWdVcmwiLCJ0cmltIiwibyIsIiQxIiwidGVzdCIsIm5ld1VybCIsImluZGV4T2YiLCJBdmF0YXJTZXJ2aWNlIiwiX2F2YXRhcnMiLCJfZGVmYXVsdEF2YXRhciIsIk1hdGgiLCJyYW5kb20iLCJIdHRwU2VydmljZSIsInVybCIsInR5cGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwic2VuZCIsImdldEluc3RhbmNlIiwiQ2hhdFZpZXciLCJfY3JlYXRlQ29tcG9uZW50cyIsIl9pbml0TWVkaWF0ZSIsImNoYXQiLCJmb3JtIiwic2V0VXNlck5hbWUiLCJnZXRVc2VyTmFtZSIsIndpZGdldHMiLCJ0YWciLCJhdHRyaWJ1dGVzIiwicGxhY2Vob2xkZXIiLCJpbm5lciIsImhyZWYiLCJtZXNzYWdlIiwic2VuZE1lc3NhZ2UiLCJzdGFydFBvbGxpbmciLCJMb2dpblZpZXciLCJtZW51IiwidGl0bGUiLCJpdGVtcyIsInVzZXJuYW1lIiwiTWFpblZpZXciXSwibWFw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VGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNmY2NjVlM2JiMjk3N2VkNjk4YzUiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgbWVtbztcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH07XG5cdH0sXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdFx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHRcdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXIgXG5cdFx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdFx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdFx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xuXHR9KSxcblx0Z2V0RWxlbWVudCA9IChmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vID0ge307XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdG1lbW9bc2VsZWN0b3JdID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0XHR9O1xuXHR9KShmdW5jdGlvbiAoc3R5bGVUYXJnZXQpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdHlsZVRhcmdldClcblx0fSksXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXSxcblx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL2ZpeFVybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEludG8gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xuXHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblx0aWYgKCFzdHlsZVRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgc3R5bGVUYXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhzdHlsZUVsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKGxpbmtFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBhdHRhY2hUYWdBdHRycyhlbGVtZW50LCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZSwgdHJhbnNmb3JtUmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgdHJhbnNmb3JtUmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cdCAgICBcblx0ICAgIGlmICh0cmFuc2Zvcm1SZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSB0cmFuc2Zvcm1SZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLiBcblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG5cdFx0aWYobmV3T2JqKSB7XG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2Rlcztcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qIElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKXtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZihzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xuXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYylcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgQmFzZVZpZXcge1xuXG4gICAgY29uc3RydWN0b3Ioe2VsLCByb3V0ZXJ9KSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JzQtdGC0L7QtCDQv9C+0LrQsNC30YvQstCw0LXRgiB2aWV3XG4gICAgICovXG4gICAgc2hvdyAoKSB7XG4gICAgICAgIHRoaXMuZWwuaGlkZGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JzQtdGC0L7QtCDRgdC60YDRi9Cy0LDQtdGCIHZpZXdcbiAgICAgKi9cbiAgICBoaWRlICgpIHtcbiAgICAgICAgdGhpcy5lbC5oaWRkZW4gPSB0cnVlO1xuICAgIH1cblxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mcmFtZXdvcmsvdmlldy5qcyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHB1Z19oYXNfb3duX3Byb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcbiAqIHRvIHZhbHVlcyBpbiBvYmplY3QgYGJgLiBDbGFzc2VzIGFyZSBzcGVjaWFsLWNhc2VkXG4gKiBhbGxvd2luZyBmb3IgYXJyYXlzIGFuZCBtZXJnaW5nL2pvaW5pbmcgYXBwcm9wcmlhdGVseVxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICogQHJldHVybiB7T2JqZWN0fSBhXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLm1lcmdlID0gcHVnX21lcmdlO1xuZnVuY3Rpb24gcHVnX21lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBwdWdfbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgIHZhciB2YWxBID0gYVtrZXldIHx8IFtdO1xuICAgICAgYVtrZXldID0gKEFycmF5LmlzQXJyYXkodmFsQSkgPyB2YWxBIDogW3ZhbEFdKS5jb25jYXQoYltrZXldIHx8IFtdKTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgdmFyIHZhbEEgPSBwdWdfc3R5bGUoYVtrZXldKTtcbiAgICAgIHZhciB2YWxCID0gcHVnX3N0eWxlKGJba2V5XSk7XG4gICAgICBhW2tleV0gPSB2YWxBICsgdmFsQjtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBQcm9jZXNzIGFycmF5LCBvYmplY3QsIG9yIHN0cmluZyBhcyBhIHN0cmluZyBvZiBjbGFzc2VzIGRlbGltaXRlZCBieSBhIHNwYWNlLlxuICpcbiAqIElmIGB2YWxgIGlzIGFuIGFycmF5LCBhbGwgbWVtYmVycyBvZiBpdCBhbmQgaXRzIHN1YmFycmF5cyBhcmUgY291bnRlZCBhc1xuICogY2xhc3Nlcy4gSWYgYGVzY2FwaW5nYCBpcyBhbiBhcnJheSwgdGhlbiB3aGV0aGVyIG9yIG5vdCB0aGUgaXRlbSBpbiBgdmFsYCBpc1xuICogZXNjYXBlZCBkZXBlbmRzIG9uIHRoZSBjb3JyZXNwb25kaW5nIGl0ZW0gaW4gYGVzY2FwaW5nYC4gSWYgYGVzY2FwaW5nYCBpc1xuICogbm90IGFuIGFycmF5LCBubyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIElmIGB2YWxgIGlzIGFuIG9iamVjdCwgYWxsIHRoZSBrZXlzIHdob3NlIHZhbHVlIGlzIHRydXRoeSBhcmUgY291bnRlZCBhc1xuICogY2xhc3Nlcy4gTm8gZXNjYXBpbmcgaXMgZG9uZS5cbiAqXG4gKiBJZiBgdmFsYCBpcyBhIHN0cmluZywgaXQgaXMgY291bnRlZCBhcyBhIGNsYXNzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIEBwYXJhbSB7KEFycmF5LjxzdHJpbmc+fE9iamVjdC48c3RyaW5nLCBib29sZWFuPnxzdHJpbmcpfSB2YWxcbiAqIEBwYXJhbSB7P0FycmF5LjxzdHJpbmc+fSBlc2NhcGluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNsYXNzZXMgPSBwdWdfY2xhc3NlcztcbmZ1bmN0aW9uIHB1Z19jbGFzc2VzX2FycmF5KHZhbCwgZXNjYXBpbmcpIHtcbiAgdmFyIGNsYXNzU3RyaW5nID0gJycsIGNsYXNzTmFtZSwgcGFkZGluZyA9ICcnLCBlc2NhcGVFbmFibGVkID0gQXJyYXkuaXNBcnJheShlc2NhcGluZyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgY2xhc3NOYW1lID0gcHVnX2NsYXNzZXModmFsW2ldKTtcbiAgICBpZiAoIWNsYXNzTmFtZSkgY29udGludWU7XG4gICAgZXNjYXBlRW5hYmxlZCAmJiBlc2NhcGluZ1tpXSAmJiAoY2xhc3NOYW1lID0gcHVnX2VzY2FwZShjbGFzc05hbWUpKTtcbiAgICBjbGFzc1N0cmluZyA9IGNsYXNzU3RyaW5nICsgcGFkZGluZyArIGNsYXNzTmFtZTtcbiAgICBwYWRkaW5nID0gJyAnO1xuICB9XG4gIHJldHVybiBjbGFzc1N0cmluZztcbn1cbmZ1bmN0aW9uIHB1Z19jbGFzc2VzX29iamVjdCh2YWwpIHtcbiAgdmFyIGNsYXNzU3RyaW5nID0gJycsIHBhZGRpbmcgPSAnJztcbiAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgIGlmIChrZXkgJiYgdmFsW2tleV0gJiYgcHVnX2hhc19vd25fcHJvcGVydHkuY2FsbCh2YWwsIGtleSkpIHtcbiAgICAgIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgKyBwYWRkaW5nICsga2V5O1xuICAgICAgcGFkZGluZyA9ICcgJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNsYXNzU3RyaW5nO1xufVxuZnVuY3Rpb24gcHVnX2NsYXNzZXModmFsLCBlc2NhcGluZykge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuIHB1Z19jbGFzc2VzX2FycmF5KHZhbCwgZXNjYXBpbmcpO1xuICB9IGVsc2UgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBwdWdfY2xhc3Nlc19vYmplY3QodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsIHx8ICcnO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBvYmplY3Qgb3Igc3RyaW5nIHRvIGEgc3RyaW5nIG9mIENTUyBzdHlsZXMgZGVsaW1pdGVkIGJ5IGEgc2VtaWNvbG9uLlxuICpcbiAqIEBwYXJhbSB7KE9iamVjdC48c3RyaW5nLCBzdHJpbmc+fHN0cmluZyl9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuc3R5bGUgPSBwdWdfc3R5bGU7XG5mdW5jdGlvbiBwdWdfc3R5bGUodmFsKSB7XG4gIGlmICghdmFsKSByZXR1cm4gJyc7XG4gIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBvdXQgPSAnJztcbiAgICBmb3IgKHZhciBzdHlsZSBpbiB2YWwpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocHVnX2hhc19vd25fcHJvcGVydHkuY2FsbCh2YWwsIHN0eWxlKSkge1xuICAgICAgICBvdXQgPSBvdXQgKyBzdHlsZSArICc6JyArIHZhbFtzdHlsZV0gKyAnOyc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH0gZWxzZSB7XG4gICAgdmFsICs9ICcnO1xuICAgIGlmICh2YWxbdmFsLmxlbmd0aCAtIDFdICE9PSAnOycpIFxuICAgICAgcmV0dXJuIHZhbCArICc7JztcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxuICogQHBhcmFtIHtCb29sZWFufSB0ZXJzZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHIgPSBwdWdfYXR0cjtcbmZ1bmN0aW9uIHB1Z19hdHRyKGtleSwgdmFsLCBlc2NhcGVkLCB0ZXJzZSkge1xuICBpZiAodmFsID09PSBmYWxzZSB8fCB2YWwgPT0gbnVsbCB8fCAhdmFsICYmIChrZXkgPT09ICdjbGFzcycgfHwga2V5ID09PSAnc3R5bGUnKSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAodmFsID09PSB0cnVlKSB7XG4gICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFsID0gdmFsLnRvSlNPTigpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsICE9PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEpTT04uc3RyaW5naWZ5KHZhbCk7XG4gICAgaWYgKCFlc2NhcGVkICYmIHZhbC5pbmRleE9mKCdcIicpICE9PSAtMSkge1xuICAgICAgcmV0dXJuICcgJyArIGtleSArICc9XFwnJyArIHZhbC5yZXBsYWNlKC8nL2csICcmIzM5OycpICsgJ1xcJyc7XG4gICAgfVxuICB9XG4gIGlmIChlc2NhcGVkKSB2YWwgPSBwdWdfZXNjYXBlKHZhbCk7XG4gIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IHRlcnNlIHdoZXRoZXIgdG8gdXNlIEhUTUw1IHRlcnNlIGJvb2xlYW4gYXR0cmlidXRlc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gcHVnX2F0dHJzO1xuZnVuY3Rpb24gcHVnX2F0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYXR0cnMgPSAnJztcblxuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKHB1Z19oYXNfb3duX3Byb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICB2YXIgdmFsID0gb2JqW2tleV07XG5cbiAgICAgIGlmICgnY2xhc3MnID09PSBrZXkpIHtcbiAgICAgICAgdmFsID0gcHVnX2NsYXNzZXModmFsKTtcbiAgICAgICAgYXR0cnMgPSBwdWdfYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKSArIGF0dHJzO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICgnc3R5bGUnID09PSBrZXkpIHtcbiAgICAgICAgdmFsID0gcHVnX3N0eWxlKHZhbCk7XG4gICAgICB9XG4gICAgICBhdHRycyArPSBwdWdfYXR0cihrZXksIHZhbCwgZmFsc2UsIHRlcnNlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXR0cnM7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHB1Z19tYXRjaF9odG1sID0gL1tcIiY8Pl0vO1xuZXhwb3J0cy5lc2NhcGUgPSBwdWdfZXNjYXBlO1xuZnVuY3Rpb24gcHVnX2VzY2FwZShfaHRtbCl7XG4gIHZhciBodG1sID0gJycgKyBfaHRtbDtcbiAgdmFyIHJlZ2V4UmVzdWx0ID0gcHVnX21hdGNoX2h0bWwuZXhlYyhodG1sKTtcbiAgaWYgKCFyZWdleFJlc3VsdCkgcmV0dXJuIF9odG1sO1xuXG4gIHZhciByZXN1bHQgPSAnJztcbiAgdmFyIGksIGxhc3RJbmRleCwgZXNjYXBlO1xuICBmb3IgKGkgPSByZWdleFJlc3VsdC5pbmRleCwgbGFzdEluZGV4ID0gMDsgaSA8IGh0bWwubGVuZ3RoOyBpKyspIHtcbiAgICBzd2l0Y2ggKGh0bWwuY2hhckNvZGVBdChpKSkge1xuICAgICAgY2FzZSAzNDogZXNjYXBlID0gJyZxdW90Oyc7IGJyZWFrO1xuICAgICAgY2FzZSAzODogZXNjYXBlID0gJyZhbXA7JzsgYnJlYWs7XG4gICAgICBjYXNlIDYwOiBlc2NhcGUgPSAnJmx0Oyc7IGJyZWFrO1xuICAgICAgY2FzZSA2MjogZXNjYXBlID0gJyZndDsnOyBicmVhaztcbiAgICAgIGRlZmF1bHQ6IGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobGFzdEluZGV4ICE9PSBpKSByZXN1bHQgKz0gaHRtbC5zdWJzdHJpbmcobGFzdEluZGV4LCBpKTtcbiAgICBsYXN0SW5kZXggPSBpICsgMTtcbiAgICByZXN1bHQgKz0gZXNjYXBlO1xuICB9XG4gIGlmIChsYXN0SW5kZXggIT09IGkpIHJldHVybiByZXN1bHQgKyBodG1sLnN1YnN0cmluZyhsYXN0SW5kZXgsIGkpO1xuICBlbHNlIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZVxuICogdGhlIHB1ZyBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBvcmlnaW5hbCBzb3VyY2VcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucmV0aHJvdyA9IHB1Z19yZXRocm93O1xuZnVuY3Rpb24gcHVnX3JldGhyb3coZXJyLCBmaWxlbmFtZSwgbGluZW5vLCBzdHIpe1xuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnIHx8ICFmaWxlbmFtZSkgJiYgIXN0cikge1xuICAgIGVyci5tZXNzYWdlICs9ICcgb24gbGluZSAnICsgbGluZW5vO1xuICAgIHRocm93IGVycjtcbiAgfVxuICB0cnkge1xuICAgIHN0ciA9IHN0ciB8fCByZXF1aXJlKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxuICB9IGNhdGNoIChleCkge1xuICAgIHB1Z19yZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnUHVnJykgKyAnOicgKyBsaW5lbm9cbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XG4gIHRocm93IGVycjtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcHVnLXJ1bnRpbWUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXHJcbiAqINCh0YDQsNCy0L3QuNCy0LDQtdGCINC+0LHRitC10LrRgtGLINC/0L4g0LfQvdCw0YfQvdC40LjRjlxyXG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcEVxdWFsIChzcmMsIGRlc3QpIHtcclxuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3JjKSA9PT0gSlNPTi5zdHJpbmdpZnkoZGVzdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LTQvdC40LzQsNC10YIg0L/QtdGA0LLRg9GOINCx0YPQutCy0YMg0YHRgtGA0L7QutC4INCyINCy0LXRgNGF0L3QuNC5INGA0LXQs9C40YHRgtGAXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIGNhcGl0YWxpemUgKHN0cikge1xyXG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcclxufVxyXG5cclxuZXhwb3J0IHtkZWVwRXF1YWwsIGNhcGl0YWxpemV9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay91dGlscy5qcyIsImltcG9ydCB0bXBsIGZyb20gJy4vZm9ybS50bXBsLnB1Zyc7XHJcbmltcG9ydCAnLi9mb3JtLmNzcyc7XHJcblxyXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJy4uLy4uL2ZyYW1ld29yay9lbWl0dGVyJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRm9ybSB7XHJcblx0Y29uc3RydWN0b3Ioe2VsLCBkYXRhID0ge319KSB7XHJcblx0XHRFbWl0dGVyLmFwcGx5KHRoaXMpO1xyXG5cdFx0dGhpcy5lbCA9IGVsO1xyXG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcclxuXHJcblx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0dGhpcy5lbC5pbm5lckhUTUwgPSB0bXBsKHRoaXMuZGF0YSk7XHJcblxyXG5cdFx0dGhpcy5mb3JtRWwgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcclxuXHR9XHJcblxyXG5cdHJlc2V0ICgpIHtcclxuXHRcdHRoaXMuZm9ybUVsLnJlc2V0KCk7XHJcblx0fVxyXG5cclxuXHRfaW5pdEV2ZW50cyAoKSB7XHJcblx0XHR0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuX29uU3VibWl0LmJpbmQodGhpcykpO1xyXG5cdH1cclxuXHJcblx0X29uU3VibWl0IChldmVudCkge1xyXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGxldCBmb3JtRGF0YSA9IHRoaXMuX2dldEZvcm1EYXRhKCk7XHJcblxyXG5cdFx0dGhpcy50cmlnZ2VyKCdzdWJtaXQnLCBmb3JtRGF0YSk7XHJcblx0fVxyXG5cclxuXHRfZ2V0SW5wdXRzICgpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCB0ZXh0YXJlYScpO1xyXG5cdH1cclxuXHJcblx0X2dldEZvcm1EYXRhICgpIHtcclxuXHRcdGxldCBmb3JtRGF0YSA9IHt9O1xyXG5cclxuXHRcdFsuLi50aGlzLl9nZXRJbnB1dHMoKV0uZm9yRWFjaChpbnB1dCA9PiB7XHJcblx0XHRcdGZvcm1EYXRhW2lucHV0Lm5hbWVdID0ge1xyXG5cdFx0XHRcdHZhbHVlOiBpbnB1dC52YWx1ZVxyXG5cdFx0XHR9O1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGZvcm1EYXRhO1xyXG5cdH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL2Zvcm0vZm9ybS5qcyIsImltcG9ydCB0bXBsIGZyb20gJy4vbWVudS50bXBsLnB1Zyc7XG5pbXBvcnQgJy4vbWVudS5jc3MnO1xuXG5cbmV4cG9ydCBjbGFzcyBNZW51IHtcbiAgICBjb25zdHJ1Y3RvciAoe2VsLCBkYXRhID0ge319KSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRtcGwodGhpcy5kYXRhKTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50cy9tZW51L21lbnUuanMiLCJleHBvcnQgZnVuY3Rpb24gRW1pdHRlciAoKSB7XG5cbiAgICAvKipcblx0ICog0JLRi9C30L7QsiDQvtCx0YDQsNCx0L7RgtGH0LjQutC+0LIg0YHQvtCx0YvRgtC40Llcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgZXZlbnQgbmFtZVxuXHQgKiBAcGFyYW0geyp9IGRhdGEgZXZlbnQgcGF5bG9hZFxuXHQgKi9cblx0dGhpcy50cmlnZ2VyID0gZnVuY3Rpb24gKG5hbWUsIGRhdGEpIHtcblx0XHRpZiAodGhpcy5fX2NhbGxiYWNrcyAmJiB0aGlzLl9fY2FsbGJhY2tzW25hbWVdKSB7XG5cdFx0XHR0aGlzLl9fY2FsbGJhY2tzW25hbWVdLmZvckVhY2goY2IgPT4gY2IuY2FsbCh0aGlzLCBkYXRhKSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINC+0LHRgNCw0LHQvtGC0YfQuNC60LAg0YHQvtCx0YvRgtC40Y9cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgZXZlbnQgbmFtZVxuXHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYiBjYWxsYmFja1xuXHQgKi9cblx0dGhpcy5vbiA9IGZ1bmN0aW9uIChuYW1lLCBjYikge1xuXHRcdGlmICghdGhpcy5fX2NhbGxiYWNrcykge1xuXHRcdFx0dGhpcy5fX2NhbGxiYWNrcyA9IHt9O1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5fX2NhbGxiYWNrc1tuYW1lXSkge1xuXHRcdFx0dGhpcy5fX2NhbGxiYWNrc1tuYW1lXSA9IFtdO1xuXHRcdH1cblxuXHRcdHRoaXMuX19jYWxsYmFja3NbbmFtZV0ucHVzaChjYik7XG5cdH07XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZnJhbWV3b3JrL2VtaXR0ZXIuanMiLCJpbXBvcnQge2RlZXBFcXVhbH0gZnJvbSAnLi4vZnJhbWV3b3JrL3V0aWxzJztcclxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICcuLi9mcmFtZXdvcmsvZW1pdHRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhdFNlcnZpY2Uge1xyXG5cclxuXHRjb25zdHJ1Y3RvciAoe2Jhc2VVcmwsIHBvbGxpbmdJbnRlcnZhbCA9IDE1MDAwLCBodHRwfSkge1xyXG5cdFx0RW1pdHRlci5hcHBseSh0aGlzKTtcclxuXHJcblx0XHR0aGlzLnBvbGxpbmdJbnRlcnZhbCA9IHBvbGxpbmdJbnRlcnZhbDtcclxuXHRcdHRoaXMuaHR0cCA9IGh0dHA7XHJcblxyXG5cdFx0dGhpcy5odHRwLnNldEJhc2VVcmwoYmFzZVVybCk7XHJcblxyXG5cdFx0dGhpcy5fX21lc3NhZ2VzID0gW107XHJcblx0XHR0aGlzLl9fcG9sbGluZ0lEID0gbnVsbDtcclxuXHRcdHRoaXMuX19sYXN0UmVxVGltZSA9IG51bGw7XHJcblx0XHR0aGlzLl9fdXNlcm5hbWUgPSAnYW5vbmltdXMnO1xyXG5cdH1cclxuXHJcblx0c2V0VXNlck5hbWUgKG5hbWUpIHtcclxuXHRcdHRoaXMuX191c2VybmFtZSA9IG5hbWU7XHJcblx0fVxyXG5cclxuXHRnZXRVc2VyTmFtZSAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fX3VzZXJuYW1lO1xyXG5cdH1cclxuXHJcblx0Z2V0TWVzc2FnZXMgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuaHR0cC5tYWtlUmVxdWVzdCgpXHJcblx0XHRcdC50aGVuKHJlc3AgPT4gT2JqZWN0LnZhbHVlcyhyZXNwLmRhdGEpKTtcclxuXHR9XHJcblxyXG5cdHNlbmRNZXNzYWdlIChkYXRhKSB7XHJcblx0XHRkYXRhLmRhdGUgPSBEYXRlLm5vdygpO1xyXG5cdFx0ZGF0YS5uYW1lID0gdGhpcy5fX3VzZXJuYW1lO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmh0dHAubWFrZVJlcXVlc3QoJ1BPU1QnLCBkYXRhKVxyXG5cdFx0XHQudGhlbihyZXNwID0+IHJlc3AuZGF0YSk7XHJcblx0fVxyXG5cclxuXHRzdGFydFBvbGxpbmcgKCkge1xyXG5cdFx0bGV0IGRvUmVxdWVzdCA9ICgpID0+IHtcclxuXHRcdFx0dGhpcy5nZXRNZXNzYWdlcygpLnRoZW4obWVzc2FnZXMgPT4ge1xyXG5cdFx0XHRcdHRoaXMuc2V0TWVzc2FnZXMobWVzc2FnZXMpO1xyXG5cdFx0XHRcdHRoaXMuX19wb2xsaW5nSUQgPSBzZXRUaW1lb3V0KGRvUmVxdWVzdCwgdGhpcy5wb2xsaW5nSW50ZXJ2YWwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0ZG9SZXF1ZXN0KCk7XHJcblx0fVxyXG5cclxuXHRzdG9wUG9sbGluZyAoKSB7XHJcblx0XHRjbGVhckludGVydmFsKHRoaXMuX19wb2xsaW5nSUQpO1xyXG5cdH1cclxuXHJcblx0c2V0TWVzc2FnZXMgKG1lc3NhZ2VzKSB7XHJcblx0XHRpZiAoZGVlcEVxdWFsKHRoaXMuX21lc3NhZ2VzLCBtZXNzYWdlcykpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX21lc3NhZ2VzID0gbWVzc2FnZXM7XHJcblx0XHR0aGlzLnRyaWdnZXIoJ21lc3NhZ2VzJywgdGhpcy5fbWVzc2FnZXMpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2V0IGluc3RhbmNlIG9mIHRoaXMgY2xhc3NcclxuXHQgKiBAc3RhdGljIFxyXG5cdCAqL1xyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZSAoLi4ucmVzdCkge1xyXG5cdFx0aWYgKCF0aGlzLl9faW5zdGFuY2UpIHtcclxuXHRcdFx0dGhpcy5fX2luc3RhbmNlID0gbmV3IHRoaXMoLi4ucmVzdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX19pbnN0YW5jZTtcclxuXHR9XHJcblxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NlcnZpY2VzL2NoYXQuc2VydmljZS5qcyIsImV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuXG4gICAgY29uc3RydWN0b3Ioe25vZGUsIGhpc3Rvcnl9KSB7XG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgICAgIHRoaXMuaGlzdG9yeSA9IGhpc3Rvcnk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINC80LDRgNGI0YDRg9GC0LBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGVcbiAgICAgKiBAcGFyYW0ge0Jhc2VWaWV3fSB2aWV3XG4gICAgICovXG4gICAgcmVnaXN0ZXIocm91dGUsIHZpZXcpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXNbcm91dGVdID0gdmlldztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQktGL0LHQvtGAIFZpZXcg0L/QviDQvNCw0YDRiNGA0YPRgtGDXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJvdXRlXG4gICAgICogQHJldHVybnMge0Jhc2VWaWV3fVxuICAgICAqL1xuICAgIF9nZXRWaWV3QnlSb3V0ZShyb3V0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXNbcm91dGVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0LHRgNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQutC70LjQutCwINC/0L4g0YHRgdGL0LvQutC1XG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudFxuICAgICAqL1xuICAgIG9uUm91dGVDaGFuZ2UoZXZlbnQpIHtcblxuICAgICAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdvKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQl9Cw0L/Rg9GB0YLQuNGC0Ywg0L/RgNC+0YbQtdGBINC80LDRgNGI0YDRg9GC0LjQt9Cw0YbQuNC4XG4gICAgICovXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMubm9kZVxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5vblJvdXRlQ2hhbmdlKGV2ZW50KSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgXyA9PiB7XG4gICAgICAgICAgICB0aGlzLmdvKGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J/QtdGA0LXRgtC40Lkg0L/QviDQvNCw0YDRiNGA0YPRgtGDXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSDQtdGB0LvQuCDQtdGB0YLRjCDQvNCw0YDRiNGA0YPRgNGCXG4gICAgICovXG4gICAgZ28ocGF0aCkge1xuICAgICAgICBsZXQgdmlldyA9IHRoaXMuX2dldFZpZXdCeVJvdXRlKHBhdGgpO1xuXG4gICAgICAgIGlmICghdmlldykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXcgPT09IHZpZXcpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmlldy5zaG93KCk7XG4gICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCBwYXRoKTtcblxuICAgICAgICBpZih0aGlzLmN1cnJlbnRWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWaWV3LmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFZpZXcgPSB2aWV3O1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mcmFtZXdvcmsvcm91dGVyLmpzIiwiaW1wb3J0IHtDaGF0Vmlld30gZnJvbSAnLi9jaGF0LnZpZXcnO1xuaW1wb3J0IHtMb2dpblZpZXd9IGZyb20gJy4vbG9naW4udmlldyc7XG5pbXBvcnQge01haW5WaWV3fSBmcm9tICcuL21haW4udmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtDaGF0OiBDaGF0VmlldywgTWFpbjogTWFpblZpZXcsIExvZ2luOiBMb2dpblZpZXd9O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ZpZXdzL2luZGV4LmpzIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vYXBwLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2FwcC5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vYXBwLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2FwcC9hcHAuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuL21pbGxpZ3JhbS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWlsbGlncmFtLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuL21pbGxpZ3JhbS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9taWxsaWdyYW0vZGlzdC9taWxsaWdyYW0uY3NzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcclxuaW1wb3J0IHRtcGwgZnJvbSAnLi9jaGF0LnRtcGwucHVnJztcclxuaW1wb3J0ICcuL2NoYXQuY3NzJztcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDaGF0RGF0YVxyXG4gKlxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXNlciAtINC40LzRjyDRgtC10LrRg9GJ0LXQs9C+INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xyXG4gKiBAcHJvcGVydHkge0FycmF5PENoYXRNZXNzYWdlPn0gbWVzc2FnZXMgLSDQvNCw0YHRgdC4INGB0L7QvtCx0YnQtdC90LjQuSDQsiDRh9Cw0YLQtVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDaGF0TWVzc2FnZVxyXG4gKlxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGV4dCAtINCi0LXQutGB0YIg0YHQvtC+0LHRidC10L3QuNGPXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIC0g0LjQvNGPINC+0YLQv9GA0LDQstC40YLQtdC70Y8g0YHQvtC+0LHRidC10L3QuNGPXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXQge1xyXG5cdGNvbnN0cnVjdG9yKHtcclxuXHRcdFx0ZWwsXHJcblx0XHRcdGRhdGEgPSB7bWVzc2FnZXM6IFtdfSxcclxuXHRcdFx0YXZhdGFyU2VydmljZSxcclxuXHRcdFx0Y2hhdFNlcnZpY2VcclxuXHRcdH0pIHtcclxuXHRcdHRoaXMuZWwgPSBlbDtcclxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XHJcblxyXG5cdFx0dGhpcy5hdmF0YXJTZXJ2aWNlID0gYXZhdGFyU2VydmljZTtcclxuXHRcdHRoaXMuY2hhdFNlcnZpY2UgPSBjaGF0U2VydmljZTtcclxuXHJcblx0XHR0aGlzLl9pbml0RXZlbnRzKCk7XHJcblx0fVxyXG5cclxuXHRfaW5pdEV2ZW50cyAoKSB7XHJcblx0XHR0aGlzLmNoYXRTZXJ2aWNlLm9uKCdtZXNzYWdlcycsIHRoaXMuX29uTWVzc2FnZXMuYmluZCh0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXIgKCkge1xyXG5cdFx0dGhpcy5fc2F2ZVNjcm9sbFRvcCgpO1xyXG5cdFx0dGhpcy5lbC5pbm5lckhUTUwgPSB0bXBsKHRoaXMuZGF0YSk7XHJcblx0XHR0aGlzLl9yZXN0b3JlU2Nyb2xsVG9wKCk7XHJcblx0fVxyXG5cclxuXHRfb25NZXNzYWdlcyAobWVzc2FnZXMpIHtcclxuXHRcdHRoaXMuc2V0TWVzc2FnZXMobWVzc2FnZXMpO1xyXG5cdFx0dGhpcy5yZW5kZXIoKTtcclxuXHR9XHJcblxyXG5cdF9zYXZlU2Nyb2xsVG9wICgpIHtcclxuXHRcdGxldCBjaGF0Qm94ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuY2hhdF9fYm94Jyk7XHJcblxyXG5cdFx0aWYgKGNoYXRCb3gpIHtcclxuXHRcdFx0dGhpcy5fc2Nyb2xsVG9wID0gY2hhdEJveC5zY3JvbGxUb3A7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfcmVzdG9yZVNjcm9sbFRvcCAoKSB7XHJcblx0XHRsZXQgY2hhdEJveCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignLmNoYXRfX2JveCcpO1xyXG5cclxuXHRcdGlmIChjaGF0Qm94KSB7XHJcblx0XHRcdGNoYXRCb3guc2Nyb2xsVG9wID0gdGhpcy5fc2Nyb2xsVG9wO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3VwZGF0ZU1lc3NhZ2VzICgpIHtcclxuXHRcdHRoaXMuZGF0YS5tZXNzYWdlcyA9IHRoaXMuZGF0YS5tZXNzYWdlcy5zb3J0KChtZXNzYWdlMSwgbWVzc2FnZTIpID0+IHtcclxuXHRcdFx0cmV0dXJuIG1lc3NhZ2UyLmRhdGUgLSBtZXNzYWdlMS5kYXRlO1xyXG5cdFx0fSk7XHRcclxuXHR9XHJcblxyXG5cdHNldE1lc3NhZ2VzIChtZXNzYWdlcyA9IFtdKSB7XHJcblx0XHR0aGlzLmRhdGEubWVzc2FnZXMubGVuZ3RoID0gMDtcclxuXHRcdHRoaXMuYWRkKG1lc3NhZ2VzKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCc0LDRgdGB0L7QstC+0LUg0LTQvtCx0LDQstC70LXQvdC40LUg0YHQvtC+0LHRidC10L3QuNC5XHJcblx0ICogQHBhcmFtIHtBcnJheTxDaGF0TWVzc2FnZXM+fSBtZXNzYWdlc1xyXG5cdCAqL1xyXG5cdGFkZCAobWVzc2FnZXMgPSBbXSkge1xyXG5cdFx0bGV0IGFkZE9uZU1lc3NhZ2VNZXRob2QgPSB0aGlzLmFkZE9uZS5iaW5kKHRoaXMpO1xyXG5cclxuXHRcdG1lc3NhZ2VzLmZvckVhY2goYWRkT25lTWVzc2FnZU1ldGhvZCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQlNC+0LHQsNCy0LjRgtGMINC90L7QstC+0LUg0YHQvtC+0LHRidC10L3QuNC1INCyINGH0LDRglxyXG5cdCAqIEBwYXJhbSB7Q2hhdE1lc3NhZ2V9IGRhdGFcclxuXHQgKi9cclxuXHRhZGRPbmUgKGRhdGEpIHtcclxuXHRcdHRoaXMuZGF0YS5tZXNzYWdlcy5wdXNoKHRoaXMuX3ByZXBhcmVNZXNzYWdlKGRhdGEpKTtcclxuXHR9XHJcblxyXG5cdF9wcmVwYXJlTWVzc2FnZSAoe2F2YXRhciwgbmFtZSwgdGV4dCwgZGF0ZSA9IERhdGUubm93KCl9KSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhdmF0YXI6IHRoaXMuYXZhdGFyU2VydmljZS5nZXRBdmF0YXIobmFtZSksXHJcblx0XHRcdG5hbWUsXHJcblx0XHRcdGlzTWluZTogbmFtZSA9PT0gdGhpcy5kYXRhLnVzZXIsXHJcblx0XHRcdHRleHQsXHJcblx0XHRcdGRhdGU6IG5ldyBEYXRlKGRhdGUpXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0YLQtdC60YPRidC10LPQviDRjtC30LXRgNCwXHJcblx0ICovXHJcblx0c2V0VXNlck5hbWUgKG5hbWUpIHtcclxuXHRcdHRoaXMuZGF0YS51c2VyID0gbmFtZTtcclxuXHR9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50cy9jaGF0L2NoYXQuanMiLCJpbXBvcnQgJ21pbGxpZ3JhbS9kaXN0L21pbGxpZ3JhbS5jc3MnO1xuaW1wb3J0ICcuL2NvbXBvbmVudHMvYXBwL2FwcC5jc3MnO1xuXG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnLi9mcmFtZXdvcmsvcm91dGVyJztcbmltcG9ydCB7Y2FwaXRhbGl6ZX0gZnJvbSAnLi9mcmFtZXdvcmsvdXRpbHMnO1xuXG5pbXBvcnQgdmlld3MgZnJvbSAnLi92aWV3cyc7XG5cbmNvbnN0IGFwcEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcCcpO1xuXG5jb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKHtcbiAgICBub2RlOiBhcHBFbCxcbiAgICBoaXN0b3J5OiB3aW5kb3cuaGlzdG9yeVxufSk7XG5cblsnbWFpbicsICdjaGF0JywgJ2xvZ2luJ10uZm9yRWFjaCh2aWV3TmFtZSA9PiB7XG4gICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGV0IFZpZXcgPSB2aWV3c1tjYXBpdGFsaXplKHZpZXdOYW1lKV07XG5cbiAgICBlbC5jbGFzc0xpc3QuYWRkKHZpZXdOYW1lKTtcbiAgICBlbC5oaWRkZW4gPSB0cnVlO1xuICAgIGFwcEVsLmFwcGVuZENoaWxkKGVsKTtcblxuICAgIHJvdXRlci5yZWdpc3RlcihgLyR7dmlld05hbWV9YCwgbmV3IFZpZXcoeyBlbCwgcm91dGVyIH0pKTtcbn0pO1xuXG5pZiAobG9jYXRpb24ucGF0aG5hbWUgPT09ICcvJykge1xuICAgIHJvdXRlci5nbygnL21haW4nKTtcbn0gZWxzZSB7XG4gICAgcm91dGVyLmdvKGxvY2F0aW9uLnBhdGhuYW1lKTtcbn1cblxucm91dGVyLnN0YXJ0KCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbWFpbi5qcyIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qcyIsImV4cG9ydCBjbGFzcyBBdmF0YXJTZXJ2aWNlIHtcclxuXHJcblx0Y29uc3RydWN0b3IgKCkge1xyXG5cdFx0dGhpcy5fYXZhdGFycyA9IHtcclxuXHRcdFx0J1RpbSc6ICdodHRwOi8vaS5pbWd1ci5jb20vRkhNbnNWTnQuanBnJyxcclxuXHRcdFx0J01hdHQnOiAnLy8xLmdyYXZhdGFyLmNvbS9hdmF0YXIvNzY3ZmM5YzExNWExYjk4OTc0NGM3NTVkYjQ3ZmViNjA/cz0yMDAmcj1wZyZkPW1tJ1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLl9kZWZhdWx0QXZhdGFyID0gJ2h0dHBzOi8vdW5zcGxhc2guaXQvMjAwLzIwMC8/cmFuZG9tJztcclxuXHR9XHJcblxyXG5cdGdldEF2YXRhciAobmFtZSA9ICcnKSB7XHJcblx0XHRpZiAoIXRoaXMuX2F2YXRhcnNbbmFtZV0pIHtcclxuXHRcdFx0dGhpcy5fYXZhdGFyc1tuYW1lXSA9IHRoaXMuX2RlZmF1bHRBdmF0YXIgKyBgPSR7TWF0aC5yYW5kb20oKX1gO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLl9hdmF0YXJzW25hbWVdO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldEluc3RhbmNlICguLi5yZXN0KSB7XHJcblx0XHRyZXR1cm4gbmV3IHRoaXMoLi4ucmVzdCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvYXZhdGFyLnNlcnZpY2UuanMiLCJleHBvcnQgY2xhc3MgSHR0cFNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHt9XG5cbiAgICAvKipcbiAgICAgKiBTZXR0aW5nIHRoZSBiYXNlIFVSTCBmb3IgcmVxdWVzdHNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICovXG4gICAgc2V0QmFzZVVybCAodXJsKSB7XG4gICAgICAgIHRoaXMuYmFzZVVybCA9IHVybDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYWtpbmcgYSBIVFRQIHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBzcGVjaWZpZWQgYSBIVFRQIG1ldGhvZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIHNwZWNpZmllZCBhIGJvZHkgb2YgcmVxdWVzdFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuXHRtYWtlUmVxdWVzdCAodHlwZSA9ICdHRVQnLCBkYXRhID0ge30pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci5vcGVuKHR5cGUsIHRoaXMuYmFzZVVybCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSxcbiAgICAgICAgICAgICAgICB4aHJcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCByZWplY3QpO1xuXG4gICAgICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIH0pO1xuXHR9XG5cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UgKC4uLnJlc3QpIHtcblx0XHRyZXR1cm4gbmV3IHRoaXMoLi4ucmVzdCk7XG5cdH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zZXJ2aWNlcy9odHRwLnNlcnZpY2UuanMiLCJpbXBvcnQge0Jhc2VWaWV3fSBmcm9tICcuLi9mcmFtZXdvcmsvdmlldyc7XG5cbmltcG9ydCB7Q2hhdH0gZnJvbSAnLi4vY29tcG9uZW50cy9jaGF0L2NoYXQnO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuLi9jb21wb25lbnRzL2Zvcm0vZm9ybSc7XG5pbXBvcnQge0F2YXRhclNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2F2YXRhci5zZXJ2aWNlJztcbmltcG9ydCB7Q2hhdFNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2NoYXQuc2VydmljZSc7XG5pbXBvcnQge0h0dHBTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9odHRwLnNlcnZpY2UnO1xuXG5cbmNvbnN0IGNoYXRTZXJ2aWNlID0gQ2hhdFNlcnZpY2UuZ2V0SW5zdGFuY2Uoe1xuXHRiYXNlVXJsOiAnaHR0cHM6Ly9jb21wb25lbnRzLWUyZTZlLmZpcmViYXNlaW8uY29tL2NoYXQvbWVzc2FnZXMvaWtldGFyaS5qc29uJyxcblx0aHR0cDogSHR0cFNlcnZpY2UuZ2V0SW5zdGFuY2UoKSxcblx0cG9sbGluZ0ludGVydmFsOiAxMDAwXG59KTtcblxuY29uc3QgYXZhdGFyU2VydmljZSA9IEF2YXRhclNlcnZpY2UuZ2V0SW5zdGFuY2UoKTtcblxuZXhwb3J0IGNsYXNzIENoYXRWaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yICguLi5yZXN0KSB7XG4gICAgICAgIHN1cGVyKC4uLnJlc3QpO1xuXG4gICAgICAgIHRoaXMuX2NyZWF0ZUNvbXBvbmVudHMoKTtcblx0XHR0aGlzLl9pbml0TWVkaWF0ZSgpO1xuXG5cdFx0dGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLmNoYXQuZWwpO1xuXHRcdHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5mb3JtLmVsKTtcblxuXHRcdHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgc2hvdyAoKSB7XG4gICAgICAgIHRoaXMuY2hhdC5zZXRVc2VyTmFtZShjaGF0U2VydmljZS5nZXRVc2VyTmFtZSgpKTtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgc3VwZXIuc2hvdygpO1xuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG5cdFx0dGhpcy5jaGF0LnJlbmRlcigpO1xuXHRcdHRoaXMuZm9ybS5yZW5kZXIoKTtcblx0fVxuXG5cdF9jcmVhdGVDb21wb25lbnRzICgpIHtcblx0XHR0aGlzLmNoYXQgPSBuZXcgQ2hhdCh7XG5cdFx0XHRlbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRhdmF0YXJTZXJ2aWNlLFxuXHRcdFx0Y2hhdFNlcnZpY2Vcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybSA9IG5ldyBGb3JtKHtcblx0XHRcdGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB3aWRnZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ3RleHRhcmVhJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ21lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAn0JLQstC10LTQuNGC0LUg0YHQvtC+0LHRidC10L3QuNC1Li4uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICfQntGC0L/RgNCw0LLQuNGC0YwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXI6ICfQktGL0LnRgtC4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiAnL21haW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuXHRcdH0pO1xuXHR9XG5cblx0X2luaXRNZWRpYXRlICgpIHtcblx0XHR0aGlzLmZvcm0ub24oJ3N1Ym1pdCcsIChmb3JtRGF0YSkgPT4ge1xuXHRcdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRcdHRleHQ6IGZvcm1EYXRhLm1lc3NhZ2UudmFsdWVcblx0XHRcdH07XG5cblx0XHRcdGNoYXRTZXJ2aWNlLnNlbmRNZXNzYWdlKGRhdGEpO1xuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0pO1xuXG5cdFx0Y2hhdFNlcnZpY2Uuc3RhcnRQb2xsaW5nKCk7XG5cdH1cblxuXHRhZGRNZXNzYWdlIChkYXRhKSB7XG5cdFx0dGhpcy5jaGF0LmFkZE9uZShkYXRhKTtcblx0fVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi92aWV3cy9jaGF0LnZpZXcuanMiLCJpbXBvcnQge0Jhc2VWaWV3fSBmcm9tICcuLi9mcmFtZXdvcmsvdmlldyc7XG5cbmltcG9ydCB7Rm9ybX0gZnJvbSAnLi4vY29tcG9uZW50cy9mb3JtL2Zvcm0nO1xuaW1wb3J0IHtNZW51fSBmcm9tICcuLi9jb21wb25lbnRzL21lbnUvbWVudSc7XG5cbmltcG9ydCB7Q2hhdFNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2NoYXQuc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBMb2dpblZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG4gICAgY29uc3RydWN0b3IgKC4uLnJlc3QpIHtcbiAgICAgICAgc3VwZXIoLi4ucmVzdCk7XG5cbiAgICAgICAgdGhpcy5tZW51ID0gbmV3IE1lbnUoe1xuICAgICAgICAgICAgZWw6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn0JDQstGC0L7RgNC40LfQsNGG0LjRjycsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9ybSA9IG5ldyBGb3JtKHtcbiAgICAgICAgICAgIGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB3aWRnZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ2lucHV0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3VzZXJuYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ9CY0LzRjyDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8uLi4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ2lucHV0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VibWl0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ9CS0L7QudGC0LgnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5tZW51LmVsKTtcbiAgICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLmZvcm0uZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5mb3JtLnJlbmRlcigpO1xuICAgICAgICB0aGlzLm1lbnUucmVuZGVyKCk7XG5cbiAgICAgICAgdGhpcy5faW5pdE1lZGlhdGUoKTtcbiAgICB9XG5cbiAgICBfaW5pdE1lZGlhdGUgKCkge1xuICAgICAgICB0aGlzLmZvcm0ub24oJ3N1Ym1pdCcsIGZvcm1EYXRhID0+IHtcbiAgICAgICAgICAgIGxldCBjaGF0U2VydmljZSA9IENoYXRTZXJ2aWNlLmdldEluc3RhbmNlKCk7XG5cbiAgICAgICAgICAgIGNoYXRTZXJ2aWNlLnNldFVzZXJOYW1lKGZvcm1EYXRhLnVzZXJuYW1lLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLmdvKCcvY2hhdCcpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvbG9naW4udmlldy5qcyIsImltcG9ydCB7QmFzZVZpZXd9IGZyb20gJy4uL2ZyYW1ld29yay92aWV3JztcblxuaW1wb3J0IHtNZW51fSBmcm9tICcuLi9jb21wb25lbnRzL21lbnUvbWVudSc7XG5cbmV4cG9ydCBjbGFzcyBNYWluVmlldyBleHRlbmRzIEJhc2VWaWV3IHtcbiAgICBjb25zdHJ1Y3RvciAoLi4ucmVzdCkge1xuICAgICAgICBzdXBlciguLi5yZXN0KTtcblxuICAgICAgICB0aGlzLm1lbnUgPSBuZXcgTWVudSh7XG4gICAgICAgICAgICBlbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdTaW5nbGUgUGFnZSBDaGF0JyxcbiAgICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgICAgICB7aHJlZjogJy9sb2dpbicsIHRleHQ6ICfQktC+0LnRgtC4J30sXG4gICAgICAgICAgICAgICAgICAgIHtocmVmOiAnL2NoYXQnLCB0ZXh0OiAn0KfQsNGCJ30sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMubWVudS5lbCk7XG4gICAgICAgIHRoaXMubWVudS5yZW5kZXIoKTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvbWFpbi52aWV3LmpzIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiKiB7XFxyXFxuICBmb250LWZhbWlseTonSGVsdmV0aWNhIE5ldWUnLEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXHJcXG4gIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmFwcCB7XFxyXFxuXFx0d2lkdGg6IDQwMHB4O1xcclxcblxcdG1hcmdpbjowIGF1dG87XFxyXFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vY29tcG9uZW50cy9hcHAvYXBwLmNzc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmNoYXRfX2NvbnRhaW5lciB7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGRpc3BsYXk6YmxvY2s7XFxyXFxuICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbn1cXHJcXG5cXHJcXG4uaGVhZGVye1xcclxcbiAgcGFkZGluZzoyMHB4IDIwcHggMThweCAyMHB4O1xcclxcbiAgYmFja2dyb3VuZDojOWI0ZGNhO1xcclxcbiAgY29sb3I6I2ZmZjtcXHJcXG59XFxyXFxuLmhlYWRlciBoMntcXHJcXG4gIGZvbnQtc2l6ZToxNnB4O1xcclxcbiAgbGluZS1oZWlnaHQ6MTVweDtcXHJcXG4gIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xcclxcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDVlbTtcXHJcXG59XFxyXFxuLmhlYWRlciBhe1xcclxcbiAgZGlzcGxheTppbmxpbmUtYmxvY2s7XFxyXFxuICBiYWNrZ3JvdW5kOiMzZDhiNGU7XFxyXFxuICBmb250LXNpemU6MjVweDtcXHJcXG4gIGxpbmUtaGVpZ2h0OjIwcHg7XFxyXFxuICBwYWRkaW5nOjNweCA2cHg7XFxyXFxuICBtYXJnaW4tdG9wOi01cHg7XFxyXFxuICBib3JkZXItcmFkaXVzOjJweDtcXHJcXG59XFxyXFxuXFxyXFxuLmNoYXRfX2JveCB7XFxyXFxuICBiYWNrZ3JvdW5kOiAjRUNFQ0VDO1xcclxcbiAgcGFkZGluZzogMCAyMHB4O1xcclxcbiAgY29sb3I6ICNhMWExYTE7XFxyXFxuICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbiAgaGVpZ2h0OiA2MHZoO1xcclxcbn1cXHJcXG5cXHJcXG4uY2hhdF9fYm94IC5tZXNzYWdlLWJveHtcXHJcXG4gIHBhZGRpbmc6MThweCAwIDEwcHg7XFxyXFxuICBjbGVhcjpib3RoO1xcclxcbn1cXHJcXG4ubWVzc2FnZS1ib3ggLnBpY3R1cmV7XFxyXFxuICBmbG9hdDpsZWZ0O1xcclxcbiAgd2lkdGg6NTBweDtcXHJcXG4gIGRpc3BsYXk6YmxvY2s7XFxyXFxuICBwYWRkaW5nLXJpZ2h0OjEwcHg7XFxyXFxufVxcclxcbi5waWN0dXJlIGltZ3tcXHJcXG4gIHdpZHRoOjQzcHg7XFxyXFxuICBoZWlnaHQ6NDNweDtcXHJcXG4gIGJvcmRlci1yYWRpdXM6NXB4O1xcclxcbn1cXHJcXG4ucGljdHVyZSBzcGFuIHtcXHJcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgZm9udC1zaXplOiAxMHB4O1xcclxcbiAgY2xlYXI6IGJvdGg7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gIG1hcmdpbi10b3A6IDNweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2V7XFxyXFxuICBiYWNrZ3JvdW5kOiNmZmY7XFxyXFxuICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG4gIHBhZGRpbmc6MTNweDtcXHJcXG4gIHdpZHRoOjI3NHB4O1xcclxcbiAgYm9yZGVyLXJhZGl1czoycHg7XFxyXFxuICBib3gtc2hhZG93OiAwIDFweCAxcHggcmdiYSgwLDAsMCwuMDQpO1xcclxcbiAgcG9zaXRpb246cmVsYXRpdmU7XFxyXFxufVxcclxcbi5tZXNzYWdlOmJlZm9yZXtcXHJcXG4gIGNvbnRlbnQ6XFxcIlxcXCI7XFxyXFxuICBwb3NpdGlvbjphYnNvbHV0ZTtcXHJcXG4gIGRpc3BsYXk6YmxvY2s7XFxyXFxuICBsZWZ0OjA7XFxyXFxuICBib3JkZXItcmlnaHQ6NnB4IHNvbGlkICNmZmY7XFxyXFxuICBib3JkZXItdG9wOiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOjZweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIHRvcDoxMHB4O1xcclxcbiAgbWFyZ2luLWxlZnQ6LTZweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2Ugc3BhbntcXHJcXG4gIGNvbG9yOiM1NTU7XFxyXFxuICBmb250LXdlaWdodDpib2xkO1xcclxcbn1cXHJcXG4ubWVzc2FnZSBwe1xcclxcbiAgcGFkZGluZy10b3A6NXB4O1xcclxcbn1cXHJcXG4ubWVzc2FnZS1ib3gucmlnaHQtaW1nIC5waWN0dXJle1xcclxcbiAgZmxvYXQ6cmlnaHQ7XFxyXFxuICBwYWRkaW5nOjA7XFxyXFxuICBwYWRkaW5nLWxlZnQ6MTBweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94LnJpZ2h0LWltZyAucGljdHVyZSBpbWd7XFxyXFxuICBmbG9hdDpyaWdodDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94LnJpZ2h0LWltZyAubWVzc2FnZTpiZWZvcmV7XFxyXFxuICBsZWZ0OjEwMCU7XFxyXFxuICBtYXJnaW4tcmlnaHQ6NnB4O1xcclxcbiAgbWFyZ2luLWxlZnQ6MDtcXHJcXG4gIGJvcmRlci1yaWdodDo2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItbGVmdDo2cHggc29saWQgI2ZmZjtcXHJcXG4gIGJvcmRlci10b3A6IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1ib3R0b206NnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL2NvbXBvbmVudHMvY2hhdC9jaGF0LmNzc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9jb21wb25lbnRzL2Zvcm0vZm9ybS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vY29tcG9uZW50cy9tZW51L21lbnUuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi8qIVxcbiAqIE1pbGxpZ3JhbSB2MS4zLjBcXG4gKiBodHRwczovL21pbGxpZ3JhbS5naXRodWIuaW9cXG4gKlxcbiAqIENvcHlyaWdodCAoYykgMjAxNyBDSiBQYXRvaWxvXFxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXFxuICovXFxuXFxuKixcXG4qOmFmdGVyLFxcbio6YmVmb3JlIHtcXG4gIGJveC1zaXppbmc6IGluaGVyaXQ7XFxufVxcblxcbmh0bWwge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGZvbnQtc2l6ZTogNjIuNSU7XFxufVxcblxcbmJvZHkge1xcbiAgY29sb3I6ICM2MDZjNzY7XFxuICBmb250LWZhbWlseTogJ1JvYm90bycsICdIZWx2ZXRpY2EgTmV1ZScsICdIZWx2ZXRpY2EnLCAnQXJpYWwnLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxLjZlbTtcXG4gIGZvbnQtd2VpZ2h0OiAzMDA7XFxuICBsZXR0ZXItc3BhY2luZzogLjAxZW07XFxuICBsaW5lLWhlaWdodDogMS42O1xcbn1cXG5cXG5ibG9ja3F1b3RlIHtcXG4gIGJvcmRlci1sZWZ0OiAwLjNyZW0gc29saWQgI2QxZDFkMTtcXG4gIG1hcmdpbi1sZWZ0OiAwO1xcbiAgbWFyZ2luLXJpZ2h0OiAwO1xcbiAgcGFkZGluZzogMXJlbSAxLjVyZW07XFxufVxcblxcbmJsb2NrcXVvdGUgKjpsYXN0LWNoaWxkIHtcXG4gIG1hcmdpbi1ib3R0b206IDA7XFxufVxcblxcbi5idXR0b24sXFxuYnV0dG9uLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10sXFxuaW5wdXRbdHlwZT0nc3VibWl0J10ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzliNGRjYTtcXG4gIGJvcmRlcjogMC4xcmVtIHNvbGlkICM5YjRkY2E7XFxuICBib3JkZXItcmFkaXVzOiAuNHJlbTtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgZm9udC1zaXplOiAxLjFyZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgaGVpZ2h0OiAzLjhyZW07XFxuICBsZXR0ZXItc3BhY2luZzogLjFyZW07XFxuICBsaW5lLWhlaWdodDogMy44cmVtO1xcbiAgcGFkZGluZzogMCAzLjByZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG59XFxuXFxuLmJ1dHRvbjpmb2N1cywgLmJ1dHRvbjpob3ZlcixcXG5idXR0b246Zm9jdXMsXFxuYnV0dG9uOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddOmZvY3VzLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjA2Yzc2O1xcbiAgYm9yZGVyLWNvbG9yOiAjNjA2Yzc2O1xcbiAgY29sb3I6ICNmZmY7XFxuICBvdXRsaW5lOiAwO1xcbn1cXG5cXG4uYnV0dG9uW2Rpc2FibGVkXSxcXG5idXR0b25bZGlzYWJsZWRdLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddW2Rpc2FibGVkXSxcXG5pbnB1dFt0eXBlPSdyZXNldCddW2Rpc2FibGVkXSxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXVtkaXNhYmxlZF0ge1xcbiAgY3Vyc29yOiBkZWZhdWx0O1xcbiAgb3BhY2l0eTogLjU7XFxufVxcblxcbi5idXR0b25bZGlzYWJsZWRdOmZvY3VzLCAuYnV0dG9uW2Rpc2FibGVkXTpob3ZlcixcXG5idXR0b25bZGlzYWJsZWRdOmZvY3VzLFxcbmJ1dHRvbltkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ11bZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdyZXNldCddW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM5YjRkY2E7XFxuICBib3JkZXItY29sb3I6ICM5YjRkY2E7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLW91dGxpbmUsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmUsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tb3V0bGluZTpmb2N1cywgLmJ1dHRvbi5idXR0b24tb3V0bGluZTpob3ZlcixcXG5idXR0b24uYnV0dG9uLW91dGxpbmU6Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lOmZvY3VzLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmU6Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZTpob3ZlcixcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogIzYwNmM3NjtcXG4gIGNvbG9yOiAjNjA2Yzc2O1xcbn1cXG5cXG4uYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cywgLmJ1dHRvbi5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cyxcXG5idXR0b24uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpob3ZlciB7XFxuICBib3JkZXItY29sb3I6IGluaGVyaXQ7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tY2xlYXIsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGNvbG9yOiAjOWI0ZGNhO1xcbn1cXG5cXG4uYnV0dG9uLmJ1dHRvbi1jbGVhcjpmb2N1cywgLmJ1dHRvbi5idXR0b24tY2xlYXI6aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcjpmb2N1cyxcXG5idXR0b24uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1jbGVhcjpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXI6aG92ZXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXI6Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXI6aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyOmZvY3VzLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhcjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogIzYwNmM3NjtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmZvY3VzLCAuYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyIHtcXG4gIGNvbG9yOiAjOWI0ZGNhO1xcbn1cXG5cXG5jb2RlIHtcXG4gIGJhY2tncm91bmQ6ICNmNGY1ZjY7XFxuICBib3JkZXItcmFkaXVzOiAuNHJlbTtcXG4gIGZvbnQtc2l6ZTogODYlO1xcbiAgbWFyZ2luOiAwIC4ycmVtO1xcbiAgcGFkZGluZzogLjJyZW0gLjVyZW07XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbn1cXG5cXG5wcmUge1xcbiAgYmFja2dyb3VuZDogI2Y0ZjVmNjtcXG4gIGJvcmRlci1sZWZ0OiAwLjNyZW0gc29saWQgIzliNGRjYTtcXG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcXG59XFxuXFxucHJlID4gY29kZSB7XFxuICBib3JkZXItcmFkaXVzOiAwO1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwYWRkaW5nOiAxcmVtIDEuNXJlbTtcXG4gIHdoaXRlLXNwYWNlOiBwcmU7XFxufVxcblxcbmhyIHtcXG4gIGJvcmRlcjogMDtcXG4gIGJvcmRlci10b3A6IDAuMXJlbSBzb2xpZCAjZjRmNWY2O1xcbiAgbWFyZ2luOiAzLjByZW0gMDtcXG59XFxuXFxuaW5wdXRbdHlwZT0nZW1haWwnXSxcXG5pbnB1dFt0eXBlPSdudW1iZXInXSxcXG5pbnB1dFt0eXBlPSdwYXNzd29yZCddLFxcbmlucHV0W3R5cGU9J3NlYXJjaCddLFxcbmlucHV0W3R5cGU9J3RlbCddLFxcbmlucHV0W3R5cGU9J3RleHQnXSxcXG5pbnB1dFt0eXBlPSd1cmwnXSxcXG50ZXh0YXJlYSxcXG5zZWxlY3Qge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgICAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xcbiAgICAgICAgICBhcHBlYXJhbmNlOiBub25lO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXI6IDAuMXJlbSBzb2xpZCAjZDFkMWQxO1xcbiAgYm9yZGVyLXJhZGl1czogLjRyZW07XFxuICBib3gtc2hhZG93OiBub25lO1xcbiAgYm94LXNpemluZzogaW5oZXJpdDtcXG4gIGhlaWdodDogMy44cmVtO1xcbiAgcGFkZGluZzogLjZyZW0gMS4wcmVtO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbmlucHV0W3R5cGU9J2VtYWlsJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0nbnVtYmVyJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncGFzc3dvcmQnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzZWFyY2gnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSd0ZWwnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSd0ZXh0J106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ndXJsJ106Zm9jdXMsXFxudGV4dGFyZWE6Zm9jdXMsXFxuc2VsZWN0OmZvY3VzIHtcXG4gIGJvcmRlci1jb2xvcjogIzliNGRjYTtcXG4gIG91dGxpbmU6IDA7XFxufVxcblxcbnNlbGVjdCB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBoZWlnaHQ9XFxcIjE0XFxcIiB2aWV3Qm94PVxcXCIwIDAgMjkgMTRcXFwiIHdpZHRoPVxcXCIyOVxcXCI+PHBhdGggZmlsbD1cXFwiI2QxZDFkMVxcXCIgZD1cXFwiTTkuMzc3MjcgMy42MjVsNS4wODE1NCA2LjkzNTIzTDE5LjU0MDM2IDMuNjI1XFxcIi8+PC9zdmc+JykgY2VudGVyIHJpZ2h0IG5vLXJlcGVhdDtcXG4gIHBhZGRpbmctcmlnaHQ6IDMuMHJlbTtcXG59XFxuXFxuc2VsZWN0OmZvY3VzIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIGhlaWdodD1cXFwiMTRcXFwiIHZpZXdCb3g9XFxcIjAgMCAyOSAxNFxcXCIgd2lkdGg9XFxcIjI5XFxcIj48cGF0aCBmaWxsPVxcXCIjOWI0ZGNhXFxcIiBkPVxcXCJNOS4zNzcyNyAzLjYyNWw1LjA4MTU0IDYuOTM1MjNMMTkuNTQwMzYgMy42MjVcXFwiLz48L3N2Zz4nKTtcXG59XFxuXFxudGV4dGFyZWEge1xcbiAgbWluLWhlaWdodDogNi41cmVtO1xcbn1cXG5cXG5sYWJlbCxcXG5sZWdlbmQge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBmb250LXNpemU6IDEuNnJlbTtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBtYXJnaW4tYm90dG9tOiAuNXJlbTtcXG59XFxuXFxuZmllbGRzZXQge1xcbiAgYm9yZGVyLXdpZHRoOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuaW5wdXRbdHlwZT0nY2hlY2tib3gnXSxcXG5pbnB1dFt0eXBlPSdyYWRpbyddIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG59XFxuXFxuLmxhYmVsLWlubGluZSB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgbWFyZ2luLWxlZnQ6IC41cmVtO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgbWF4LXdpZHRoOiAxMTIuMHJlbTtcXG4gIHBhZGRpbmc6IDAgMi4wcmVtO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5yb3cucm93LW5vLXBhZGRpbmcge1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLnJvdy5yb3ctbm8tcGFkZGluZyA+IC5jb2x1bW4ge1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLnJvdy5yb3ctd3JhcCB7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxufVxcblxcbi5yb3cucm93LXRvcCB7XFxuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXG59XFxuXFxuLnJvdy5yb3ctYm90dG9tIHtcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcXG59XFxuXFxuLnJvdy5yb3ctY2VudGVyIHtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5yb3cucm93LXN0cmV0Y2gge1xcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XFxufVxcblxcbi5yb3cucm93LWJhc2VsaW5lIHtcXG4gIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcXG59XFxuXFxuLnJvdyAuY29sdW1uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZmxleDogMSAxIGF1dG87XFxuICBtYXJnaW4tbGVmdDogMDtcXG4gIG1heC13aWR0aDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0xMCB7XFxuICBtYXJnaW4tbGVmdDogMTAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0yMCB7XFxuICBtYXJnaW4tbGVmdDogMjAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0yNSB7XFxuICBtYXJnaW4tbGVmdDogMjUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0zMywgLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMzQge1xcbiAgbWFyZ2luLWxlZnQ6IDMzLjMzMzMlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC01MCB7XFxuICBtYXJnaW4tbGVmdDogNTAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC02NiwgLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNjcge1xcbiAgbWFyZ2luLWxlZnQ6IDY2LjY2NjYlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC03NSB7XFxuICBtYXJnaW4tbGVmdDogNzUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC04MCB7XFxuICBtYXJnaW4tbGVmdDogODAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC05MCB7XFxuICBtYXJnaW4tbGVmdDogOTAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTEwIHtcXG4gIGZsZXg6IDAgMCAxMCU7XFxuICBtYXgtd2lkdGg6IDEwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi0yMCB7XFxuICBmbGV4OiAwIDAgMjAlO1xcbiAgbWF4LXdpZHRoOiAyMCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tMjUge1xcbiAgZmxleDogMCAwIDI1JTtcXG4gIG1heC13aWR0aDogMjUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTMzLCAucm93IC5jb2x1bW4uY29sdW1uLTM0IHtcXG4gIGZsZXg6IDAgMCAzMy4zMzMzJTtcXG4gIG1heC13aWR0aDogMzMuMzMzMyU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNDAge1xcbiAgZmxleDogMCAwIDQwJTtcXG4gIG1heC13aWR0aDogNDAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTUwIHtcXG4gIGZsZXg6IDAgMCA1MCU7XFxuICBtYXgtd2lkdGg6IDUwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi02MCB7XFxuICBmbGV4OiAwIDAgNjAlO1xcbiAgbWF4LXdpZHRoOiA2MCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNjYsIC5yb3cgLmNvbHVtbi5jb2x1bW4tNjcge1xcbiAgZmxleDogMCAwIDY2LjY2NjYlO1xcbiAgbWF4LXdpZHRoOiA2Ni42NjY2JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi03NSB7XFxuICBmbGV4OiAwIDAgNzUlO1xcbiAgbWF4LXdpZHRoOiA3NSU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tODAge1xcbiAgZmxleDogMCAwIDgwJTtcXG4gIG1heC13aWR0aDogODAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTkwIHtcXG4gIGZsZXg6IDAgMCA5MCU7XFxuICBtYXgtd2lkdGg6IDkwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uIC5jb2x1bW4tdG9wIHtcXG4gIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi5yb3cgLmNvbHVtbiAuY29sdW1uLWJvdHRvbSB7XFxuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcXG59XFxuXFxuLnJvdyAuY29sdW1uIC5jb2x1bW4tY2VudGVyIHtcXG4gIC1tcy1ncmlkLXJvdy1hbGlnbjogY2VudGVyO1xcbiAgICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuQG1lZGlhIChtaW4td2lkdGg6IDQwcmVtKSB7XFxuICAucm93IHtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAgbWFyZ2luLWxlZnQ6IC0xLjByZW07XFxuICAgIHdpZHRoOiBjYWxjKDEwMCUgKyAyLjByZW0pO1xcbiAgfVxcbiAgLnJvdyAuY29sdW1uIHtcXG4gICAgbWFyZ2luLWJvdHRvbTogaW5oZXJpdDtcXG4gICAgcGFkZGluZzogMCAxLjByZW07XFxuICB9XFxufVxcblxcbmEge1xcbiAgY29sb3I6ICM5YjRkY2E7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcbmE6Zm9jdXMsIGE6aG92ZXIge1xcbiAgY29sb3I6ICM2MDZjNzY7XFxufVxcblxcbmRsLFxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgcGFkZGluZy1sZWZ0OiAwO1xcbn1cXG5cXG5kbCBkbCxcXG5kbCBvbCxcXG5kbCB1bCxcXG5vbCBkbCxcXG5vbCBvbCxcXG5vbCB1bCxcXG51bCBkbCxcXG51bCBvbCxcXG51bCB1bCB7XFxuICBmb250LXNpemU6IDkwJTtcXG4gIG1hcmdpbjogMS41cmVtIDAgMS41cmVtIDMuMHJlbTtcXG59XFxuXFxub2wge1xcbiAgbGlzdC1zdHlsZTogZGVjaW1hbCBpbnNpZGU7XFxufVxcblxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IGNpcmNsZSBpbnNpZGU7XFxufVxcblxcbi5idXR0b24sXFxuYnV0dG9uLFxcbmRkLFxcbmR0LFxcbmxpIHtcXG4gIG1hcmdpbi1ib3R0b206IDEuMHJlbTtcXG59XFxuXFxuZmllbGRzZXQsXFxuaW5wdXQsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcXG59XFxuXFxuYmxvY2txdW90ZSxcXG5kbCxcXG5maWd1cmUsXFxuZm9ybSxcXG5vbCxcXG5wLFxcbnByZSxcXG50YWJsZSxcXG51bCB7XFxuICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XFxufVxcblxcbnRhYmxlIHtcXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbnRkLFxcbnRoIHtcXG4gIGJvcmRlci1ib3R0b206IDAuMXJlbSBzb2xpZCAjZTFlMWUxO1xcbiAgcGFkZGluZzogMS4ycmVtIDEuNXJlbTtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxufVxcblxcbnRkOmZpcnN0LWNoaWxkLFxcbnRoOmZpcnN0LWNoaWxkIHtcXG4gIHBhZGRpbmctbGVmdDogMDtcXG59XFxuXFxudGQ6bGFzdC1jaGlsZCxcXG50aDpsYXN0LWNoaWxkIHtcXG4gIHBhZGRpbmctcmlnaHQ6IDA7XFxufVxcblxcbmIsXFxuc3Ryb25nIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG5wIHtcXG4gIG1hcmdpbi10b3A6IDA7XFxufVxcblxcbmgxLFxcbmgyLFxcbmgzLFxcbmg0LFxcbmg1LFxcbmg2IHtcXG4gIGZvbnQtd2VpZ2h0OiAzMDA7XFxuICBsZXR0ZXItc3BhY2luZzogLS4xcmVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMi4wcmVtO1xcbiAgbWFyZ2luLXRvcDogMDtcXG59XFxuXFxuaDEge1xcbiAgZm9udC1zaXplOiA0LjZyZW07XFxuICBsaW5lLWhlaWdodDogMS4yO1xcbn1cXG5cXG5oMiB7XFxuICBmb250LXNpemU6IDMuNnJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjI1O1xcbn1cXG5cXG5oMyB7XFxuICBmb250LXNpemU6IDIuOHJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjM7XFxufVxcblxcbmg0IHtcXG4gIGZvbnQtc2l6ZTogMi4ycmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMDhyZW07XFxuICBsaW5lLWhlaWdodDogMS4zNTtcXG59XFxuXFxuaDUge1xcbiAgZm9udC1zaXplOiAxLjhyZW07XFxuICBsZXR0ZXItc3BhY2luZzogLS4wNXJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjU7XFxufVxcblxcbmg2IHtcXG4gIGZvbnQtc2l6ZTogMS42cmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDA7XFxuICBsaW5lLWhlaWdodDogMS40O1xcbn1cXG5cXG5pbWcge1xcbiAgbWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG4uY2xlYXJmaXg6YWZ0ZXIge1xcbiAgY2xlYXI6IGJvdGg7XFxuICBjb250ZW50OiAnICc7XFxuICBkaXNwbGF5OiB0YWJsZTtcXG59XFxuXFxuLmZsb2F0LWxlZnQge1xcbiAgZmxvYXQ6IGxlZnQ7XFxufVxcblxcbi5mbG9hdC1yaWdodCB7XFxuICBmbG9hdDogcmlnaHQ7XFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vfi9taWxsaWdyYW0vZGlzdC9taWxsaWdyYW0uY3NzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAobWVzc2FnZXMsIHVzZXIpIHtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjaGF0XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjaGF0X19jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImhlYWRlclxcXCJcXHUwMDNFXFx1MDAzQ2gyXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9ICfQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMICcgKyAodXNlciB8fCAnJykpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoMlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjaGF0X19ib3hcXFwiXFx1MDAzRVwiO1xuaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NoM1xcdTAwM0XQn9C+0LrQsCDQvdC10YIg0YHQvtC+0LHRidC10L3QuNC5XFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcIjtcbn1cbi8vIGl0ZXJhdGUgbWVzc2FnZXNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gbWVzc2FnZXM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJCRsOyBwdWdfaW5kZXgwKyspIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAkJG9ialtwdWdfaW5kZXgwXTtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXZcIiArIChwdWcuYXR0cihcImNsYXNzXCIsIHB1Zy5jbGFzc2VzKFtcIm1lc3NhZ2UtYm94XCIsbWVzc2FnZS5pc01pbmUgPyAnbGVmdC1pbWcnIDogJ3JpZ2h0LWltZyddLCBbZmFsc2UsdHJ1ZV0pLCBmYWxzZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicGljdHVyZVxcXCJcXHUwMDNFXFx1MDAzQ2ltZ1wiICsgKHB1Zy5hdHRyKFwic3JjXCIsIG1lc3NhZ2UuYXZhdGFyLCB0cnVlLCB0cnVlKStcIiB0aXRsZT1cXFwibmFtZSBvZiB1c2VyXFxcIlwiKSArIFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJ0aW1lXFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLmRhdGUgJiYgbWVzc2FnZS5kYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMF0pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcIm1lc3NhZ2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ3BcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS50ZXh0KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjtcbiAgICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICQkb2JqKSB7XG4gICAgICAkJGwrKztcbiAgICAgIHZhciBtZXNzYWdlID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XCIgKyAocHVnLmF0dHIoXCJjbGFzc1wiLCBwdWcuY2xhc3NlcyhbXCJtZXNzYWdlLWJveFwiLG1lc3NhZ2UuaXNNaW5lID8gJ2xlZnQtaW1nJyA6ICdyaWdodC1pbWcnXSwgW2ZhbHNlLHRydWVdKSwgZmFsc2UsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInBpY3R1cmVcXFwiXFx1MDAzRVxcdTAwM0NpbWdcIiArIChwdWcuYXR0cihcInNyY1wiLCBtZXNzYWdlLmF2YXRhciwgdHJ1ZSwgdHJ1ZSkrXCIgdGl0bGU9XFxcIm5hbWUgb2YgdXNlclxcXCJcIikgKyBcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwidGltZVxcXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS5kYXRlICYmIG1lc3NhZ2UuZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzBdKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NwXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UudGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7XG4gICAgfVxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjt9LmNhbGwodGhpcyxcIm1lc3NhZ2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tZXNzYWdlczp0eXBlb2YgbWVzc2FnZXMhPT1cInVuZGVmaW5lZFwiP21lc3NhZ2VzOnVuZGVmaW5lZCxcInVzZXJcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXI6dHlwZW9mIHVzZXIhPT1cInVuZGVmaW5lZFwiP3VzZXI6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvY2hhdC9jaGF0LnRtcGwucHVnXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAod2lkZ2V0cykge3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0Nmb3JtXFx1MDAzRVwiO1xuLy8gaXRlcmF0ZSB3aWRnZXRzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IHdpZGdldHM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJCRsOyBwdWdfaW5kZXgwKyspIHtcbiAgICAgICAgdmFyIHdpZGdldCA9ICQkb2JqW3B1Z19pbmRleDBdO1xudmFyIHRhZ05hbWUgPSB3aWRnZXQudGFnIHx8ICdpbnB1dCdcbnZhciBpbm5lciA9IHdpZGdldC5pbm5lciB8fCAnJ1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1wiICsgKHRhZ05hbWUpICsgKHB1Zy5hdHRycyh3aWRnZXQuYXR0cmlidXRlcywgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaW5uZXIpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZcIiArICh0YWdOYW1lKSArIFwiXFx1MDAzRVwiO1xuICAgICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyIHB1Z19pbmRleDAgaW4gJCRvYmopIHtcbiAgICAgICQkbCsrO1xuICAgICAgdmFyIHdpZGdldCA9ICQkb2JqW3B1Z19pbmRleDBdO1xudmFyIHRhZ05hbWUgPSB3aWRnZXQudGFnIHx8ICdpbnB1dCdcbnZhciBpbm5lciA9IHdpZGdldC5pbm5lciB8fCAnJ1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1wiICsgKHRhZ05hbWUpICsgKHB1Zy5hdHRycyh3aWRnZXQuYXR0cmlidXRlcywgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaW5uZXIpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZcIiArICh0YWdOYW1lKSArIFwiXFx1MDAzRVwiO1xuICAgIH1cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZmb3JtXFx1MDAzRVwiO30uY2FsbCh0aGlzLFwid2lkZ2V0c1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgud2lkZ2V0czp0eXBlb2Ygd2lkZ2V0cyE9PVwidW5kZWZpbmVkXCI/d2lkZ2V0czp1bmRlZmluZWQpKTs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9mb3JtL2Zvcm0udG1wbC5wdWdcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwOzt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpdGVtcywgdGl0bGUpIHtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDaDFcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGl0bGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoMVxcdTAwM0VcXHUwMDNDdWxcXHUwMDNFXCI7XG4vLyBpdGVyYXRlIGl0ZW1zXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IGl0ZW1zO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgcHVnX2luZGV4MCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgcHVnX2luZGV4MCA8ICQkbDsgcHVnX2luZGV4MCsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDbGlcXHUwMDNFXFx1MDAzQ2FcIiArIChwdWcuYXR0cihcImhyZWZcIiwgaXRlbS5ocmVmLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBpdGVtLnRleHQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZhXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXCI7XG4gICAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgcHVnX2luZGV4MCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7XG4gICAgICB2YXIgaXRlbSA9ICQkb2JqW3B1Z19pbmRleDBdO1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2xpXFx1MDAzRVxcdTAwM0NhXCIgKyAocHVnLmF0dHIoXCJocmVmXCIsIGl0ZW0uaHJlZiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaXRlbS50ZXh0KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGYVxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVwiO1xuICAgIH1cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZ1bFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcIml0ZW1zXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pdGVtczp0eXBlb2YgaXRlbXMhPT1cInVuZGVmaW5lZFwiP2l0ZW1zOnVuZGVmaW5lZCxcInRpdGxlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50aXRsZTp0eXBlb2YgdGl0bGUhPT1cInVuZGVmaW5lZFwiP3RpdGxlOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL21lbnUvbWVudS50bXBsLnB1Z1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vY2hhdC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9jaGF0LmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9jaGF0LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2NoYXQvY2hhdC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2Zvcm0uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZm9ybS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZm9ybS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9mb3JtL2Zvcm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9tZW51LmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21lbnUuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21lbnUuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvbWVudS9tZW51LmNzc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogKGlnbm9yZWQpICovXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZnMgKGlnbm9yZWQpXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9