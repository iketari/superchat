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

		this._messages = [];
		this._pollingID = null;
		this._stopped = false;
		this._username = 'anonimus';
	}

	_createClass(ChatService, [{
		key: 'setUserName',
		value: function setUserName(name) {
			this._username = name;
		}
	}, {
		key: 'getUserName',
		value: function getUserName() {
			return this._username;
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
			data.name = this._username;

			return this.http.makeRequest('POST', data).then(function (resp) {
				return resp.data;
			});
		}
	}, {
		key: 'startPolling',
		value: function startPolling() {
			var _this = this;

			this._stopped = false;

			var doRequest = function doRequest() {
				if (_this._stopped) {
					return;
				}

				_this.getMessages().then(function (messages) {
					_this.setMessages(messages);
					_this._pollingID = setTimeout(doRequest, _this.pollingInterval);
				});
			};

			doRequest();
		}
	}, {
		key: 'stopPolling',
		value: function stopPolling() {
			clearInterval(this._pollingID);
			this._stopped = true;
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
            chatService.startPolling();

            _get(ChatView.prototype.__proto__ || Object.getPrototypeOf(ChatView.prototype), 'show', this).call(this);
        }
    }, {
        key: 'hide',
        value: function hide() {
            chatService.stopPolling();

            _get(ChatView.prototype.__proto__ || Object.getPrototypeOf(ChatView.prototype), 'hide', this).call(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzgwMWFkZTUyMDc3YzQyNmExMDIiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wdWctcnVudGltZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9mcmFtZXdvcmsvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9mb3JtL2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9tZW51L21lbnUuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL2VtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmljZXMvY2hhdC5zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL2ZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9hcHAvYXBwLmNzcz8yMzZmIiwid2VicGFjazovLy8uL34vbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzcz8xNzIwIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LmpzIiwid2VicGFjazovLy8uL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2aWNlcy9hdmF0YXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2aWNlcy9odHRwLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvY2hhdC52aWV3LmpzIiwid2VicGFjazovLy8uL3ZpZXdzL2xvZ2luLnZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvbWFpbi52aWV3LmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvYXBwL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jaGF0L2NoYXQuY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLmNzcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL21lbnUvbWVudS5jc3MiLCJ3ZWJwYWNrOi8vLy4vfi9taWxsaWdyYW0vZGlzdC9taWxsaWdyYW0uY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvbWVudS9tZW51LnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LmNzcz82MTYzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLmNzcz82NmVjIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvbWVudS9tZW51LmNzcz9kNjYzIiwid2VicGFjazovLy9mcyAoaWdub3JlZCkiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsInVzZVNvdXJjZU1hcCIsImxpc3QiLCJ0b1N0cmluZyIsIm1hcCIsIml0ZW0iLCJjb250ZW50IiwiY3NzV2l0aE1hcHBpbmdUb1N0cmluZyIsImpvaW4iLCJpIiwibW9kdWxlcyIsIm1lZGlhUXVlcnkiLCJhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzIiwibGVuZ3RoIiwiaWQiLCJwdXNoIiwiY3NzTWFwcGluZyIsImJ0b2EiLCJzb3VyY2VNYXBwaW5nIiwidG9Db21tZW50Iiwic291cmNlVVJMcyIsInNvdXJjZXMiLCJzb3VyY2UiLCJzb3VyY2VSb290IiwiY29uY2F0Iiwic291cmNlTWFwIiwiYmFzZTY0IiwidW5lc2NhcGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwiZGF0YSIsIkJhc2VWaWV3IiwiZWwiLCJyb3V0ZXIiLCJoaWRkZW4iLCJkZWVwRXF1YWwiLCJzcmMiLCJkZXN0IiwiY2FwaXRhbGl6ZSIsInN0ciIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJGb3JtIiwiYXBwbHkiLCJfaW5pdEV2ZW50cyIsImlubmVySFRNTCIsImZvcm1FbCIsInF1ZXJ5U2VsZWN0b3IiLCJyZXNldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25TdWJtaXQiLCJiaW5kIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiX2dldEZvcm1EYXRhIiwidHJpZ2dlciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfZ2V0SW5wdXRzIiwiZm9yRWFjaCIsImlucHV0IiwibmFtZSIsInZhbHVlIiwiTWVudSIsIkVtaXR0ZXIiLCJfX2NhbGxiYWNrcyIsImNiIiwiY2FsbCIsIm9uIiwiQ2hhdFNlcnZpY2UiLCJiYXNlVXJsIiwicG9sbGluZ0ludGVydmFsIiwiaHR0cCIsInNldEJhc2VVcmwiLCJfbWVzc2FnZXMiLCJfcG9sbGluZ0lEIiwiX3N0b3BwZWQiLCJfdXNlcm5hbWUiLCJtYWtlUmVxdWVzdCIsInRoZW4iLCJPYmplY3QiLCJ2YWx1ZXMiLCJyZXNwIiwiZGF0ZSIsIkRhdGUiLCJub3ciLCJkb1JlcXVlc3QiLCJnZXRNZXNzYWdlcyIsInNldE1lc3NhZ2VzIiwibWVzc2FnZXMiLCJzZXRUaW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsIl9faW5zdGFuY2UiLCJyZXN0IiwiUm91dGVyIiwibm9kZSIsImhpc3RvcnkiLCJyb3V0ZXMiLCJyb3V0ZSIsInZpZXciLCJ0YXJnZXQiLCJIVE1MQW5jaG9yRWxlbWVudCIsImdvIiwiZ2V0QXR0cmlidXRlIiwib25Sb3V0ZUNoYW5nZSIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJwYXRoIiwiX2dldFZpZXdCeVJvdXRlIiwiY3VycmVudFZpZXciLCJzaG93IiwicHVzaFN0YXRlIiwiaGlkZSIsIkNoYXQiLCJNYWluIiwiTG9naW4iLCJhdmF0YXJTZXJ2aWNlIiwiY2hhdFNlcnZpY2UiLCJfb25NZXNzYWdlcyIsIl9zYXZlU2Nyb2xsVG9wIiwiX3Jlc3RvcmVTY3JvbGxUb3AiLCJyZW5kZXIiLCJjaGF0Qm94IiwiX3Njcm9sbFRvcCIsInNjcm9sbFRvcCIsInNvcnQiLCJtZXNzYWdlMSIsIm1lc3NhZ2UyIiwiYWRkIiwiYWRkT25lTWVzc2FnZU1ldGhvZCIsImFkZE9uZSIsIl9wcmVwYXJlTWVzc2FnZSIsImF2YXRhciIsInRleHQiLCJnZXRBdmF0YXIiLCJpc01pbmUiLCJ1c2VyIiwiYXBwRWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJWaWV3Iiwidmlld05hbWUiLCJjbGFzc0xpc3QiLCJhcHBlbmRDaGlsZCIsInJlZ2lzdGVyIiwic3RhcnQiLCJjc3MiLCJFcnJvciIsInByb3RvY29sIiwiaG9zdCIsImN1cnJlbnREaXIiLCJyZXBsYWNlIiwiZml4ZWRDc3MiLCJmdWxsTWF0Y2giLCJvcmlnVXJsIiwidW5xdW90ZWRPcmlnVXJsIiwidHJpbSIsIm8iLCIkMSIsInRlc3QiLCJuZXdVcmwiLCJpbmRleE9mIiwiQXZhdGFyU2VydmljZSIsIl9hdmF0YXJzIiwiX2RlZmF1bHRBdmF0YXIiLCJNYXRoIiwicmFuZG9tIiwiSHR0cFNlcnZpY2UiLCJ1cmwiLCJ0eXBlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJwYXJzZSIsInJlc3BvbnNlVGV4dCIsInNlbmQiLCJnZXRJbnN0YW5jZSIsIkNoYXRWaWV3IiwiX2NyZWF0ZUNvbXBvbmVudHMiLCJfaW5pdE1lZGlhdGUiLCJjaGF0IiwiZm9ybSIsInNldFVzZXJOYW1lIiwiZ2V0VXNlck5hbWUiLCJzdGFydFBvbGxpbmciLCJzdG9wUG9sbGluZyIsIndpZGdldHMiLCJ0YWciLCJhdHRyaWJ1dGVzIiwicGxhY2Vob2xkZXIiLCJpbm5lciIsImhyZWYiLCJtZXNzYWdlIiwic2VuZE1lc3NhZ2UiLCJMb2dpblZpZXciLCJtZW51IiwidGl0bGUiLCJpdGVtcyIsInVzZXJuYW1lIiwiTWFpblZpZXciXSwibWFwcGluZ3Mi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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQSxlIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM4MDFhZGU1MjA3N2M0MjZhMTAyIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW87XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9O1xuXHR9LFxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcblx0XHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHRcdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0XHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyIFxuXHRcdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHRcdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRcdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcblx0fSksXG5cdGdldEVsZW1lbnQgPSAoZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgbWVtbyA9IHt9O1xuXHRcdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdFx0fTtcblx0fSkoZnVuY3Rpb24gKHN0eWxlVGFyZ2V0KSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3R5bGVUYXJnZXQpXG5cdH0pLFxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW10sXG5cdGZpeFVybHMgPSByZXF1aXJlKFwiLi9maXhVcmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRJbnRvID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZVxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcblx0dmFyIHN0eWxlVGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cdGlmICghc3R5bGVUYXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIHN0eWxlVGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YXR0YWNoVGFnQXR0cnMoc3R5bGVFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhsaW5rRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XG5cdHJldHVybiBsaW5rRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gYXR0YWNoVGFnQXR0cnMoZWxlbWVudCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmUsIHRyYW5zZm9ybVJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHRyYW5zZm9ybVJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXHQgICAgXG5cdCAgICBpZiAodHJhbnNmb3JtUmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gdHJhbnNmb3JtUmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy4gXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuXHRcdGlmKG5ld09iaikge1xuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKiBJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscyl7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcblxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIEJhc2VWaWV3IHtcblxuICAgIGNvbnN0cnVjdG9yKHtlbCwgcm91dGVyfSkge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCc0LXRgtC+0LQg0L/QvtC60LDQt9GL0LLQsNC10YIgdmlld1xuICAgICAqL1xuICAgIHNob3cgKCkge1xuICAgICAgICB0aGlzLmVsLmhpZGRlbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCc0LXRgtC+0LQg0YHQutGA0YvQstCw0LXRgiB2aWV3XG4gICAgICovXG4gICAgaGlkZSAoKSB7XG4gICAgICAgIHRoaXMuZWwuaGlkZGVuID0gdHJ1ZTtcbiAgICB9XG5cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZnJhbWV3b3JrL3ZpZXcuanMiLCIndXNlIHN0cmljdCc7XG5cbnZhciBwdWdfaGFzX293bl9wcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IHB1Z19tZXJnZTtcbmZ1bmN0aW9uIHB1Z19tZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gcHVnX21lcmdlKGF0dHJzLCBhW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ID09PSAnY2xhc3MnKSB7XG4gICAgICB2YXIgdmFsQSA9IGFba2V5XSB8fCBbXTtcbiAgICAgIGFba2V5XSA9IChBcnJheS5pc0FycmF5KHZhbEEpID8gdmFsQSA6IFt2YWxBXSkuY29uY2F0KGJba2V5XSB8fCBbXSk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICAgIHZhciB2YWxBID0gcHVnX3N0eWxlKGFba2V5XSk7XG4gICAgICB2YXIgdmFsQiA9IHB1Z19zdHlsZShiW2tleV0pO1xuICAgICAgYVtrZXldID0gdmFsQSArIHZhbEI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogUHJvY2VzcyBhcnJheSwgb2JqZWN0LCBvciBzdHJpbmcgYXMgYSBzdHJpbmcgb2YgY2xhc3NlcyBkZWxpbWl0ZWQgYnkgYSBzcGFjZS5cbiAqXG4gKiBJZiBgdmFsYCBpcyBhbiBhcnJheSwgYWxsIG1lbWJlcnMgb2YgaXQgYW5kIGl0cyBzdWJhcnJheXMgYXJlIGNvdW50ZWQgYXNcbiAqIGNsYXNzZXMuIElmIGBlc2NhcGluZ2AgaXMgYW4gYXJyYXksIHRoZW4gd2hldGhlciBvciBub3QgdGhlIGl0ZW0gaW4gYHZhbGAgaXNcbiAqIGVzY2FwZWQgZGVwZW5kcyBvbiB0aGUgY29ycmVzcG9uZGluZyBpdGVtIGluIGBlc2NhcGluZ2AuIElmIGBlc2NhcGluZ2AgaXNcbiAqIG5vdCBhbiBhcnJheSwgbm8gZXNjYXBpbmcgaXMgZG9uZS5cbiAqXG4gKiBJZiBgdmFsYCBpcyBhbiBvYmplY3QsIGFsbCB0aGUga2V5cyB3aG9zZSB2YWx1ZSBpcyB0cnV0aHkgYXJlIGNvdW50ZWQgYXNcbiAqIGNsYXNzZXMuIE5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gKlxuICogSWYgYHZhbGAgaXMgYSBzdHJpbmcsIGl0IGlzIGNvdW50ZWQgYXMgYSBjbGFzcy4gTm8gZXNjYXBpbmcgaXMgZG9uZS5cbiAqXG4gKiBAcGFyYW0geyhBcnJheS48c3RyaW5nPnxPYmplY3QuPHN0cmluZywgYm9vbGVhbj58c3RyaW5nKX0gdmFsXG4gKiBAcGFyYW0gez9BcnJheS48c3RyaW5nPn0gZXNjYXBpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbGFzc2VzID0gcHVnX2NsYXNzZXM7XG5mdW5jdGlvbiBwdWdfY2xhc3Nlc19hcnJheSh2YWwsIGVzY2FwaW5nKSB7XG4gIHZhciBjbGFzc1N0cmluZyA9ICcnLCBjbGFzc05hbWUsIHBhZGRpbmcgPSAnJywgZXNjYXBlRW5hYmxlZCA9IEFycmF5LmlzQXJyYXkoZXNjYXBpbmcpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xuICAgIGNsYXNzTmFtZSA9IHB1Z19jbGFzc2VzKHZhbFtpXSk7XG4gICAgaWYgKCFjbGFzc05hbWUpIGNvbnRpbnVlO1xuICAgIGVzY2FwZUVuYWJsZWQgJiYgZXNjYXBpbmdbaV0gJiYgKGNsYXNzTmFtZSA9IHB1Z19lc2NhcGUoY2xhc3NOYW1lKSk7XG4gICAgY2xhc3NTdHJpbmcgPSBjbGFzc1N0cmluZyArIHBhZGRpbmcgKyBjbGFzc05hbWU7XG4gICAgcGFkZGluZyA9ICcgJztcbiAgfVxuICByZXR1cm4gY2xhc3NTdHJpbmc7XG59XG5mdW5jdGlvbiBwdWdfY2xhc3Nlc19vYmplY3QodmFsKSB7XG4gIHZhciBjbGFzc1N0cmluZyA9ICcnLCBwYWRkaW5nID0gJyc7XG4gIGZvciAodmFyIGtleSBpbiB2YWwpIHtcbiAgICBpZiAoa2V5ICYmIHZhbFtrZXldICYmIHB1Z19oYXNfb3duX3Byb3BlcnR5LmNhbGwodmFsLCBrZXkpKSB7XG4gICAgICBjbGFzc1N0cmluZyA9IGNsYXNzU3RyaW5nICsgcGFkZGluZyArIGtleTtcbiAgICAgIHBhZGRpbmcgPSAnICc7XG4gICAgfVxuICB9XG4gIHJldHVybiBjbGFzc1N0cmluZztcbn1cbmZ1bmN0aW9uIHB1Z19jbGFzc2VzKHZhbCwgZXNjYXBpbmcpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgIHJldHVybiBwdWdfY2xhc3Nlc19hcnJheSh2YWwsIGVzY2FwaW5nKTtcbiAgfSBlbHNlIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gcHVnX2NsYXNzZXNfb2JqZWN0KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbCB8fCAnJztcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgb2JqZWN0IG9yIHN0cmluZyB0byBhIHN0cmluZyBvZiBDU1Mgc3R5bGVzIGRlbGltaXRlZCBieSBhIHNlbWljb2xvbi5cbiAqXG4gKiBAcGFyYW0geyhPYmplY3QuPHN0cmluZywgc3RyaW5nPnxzdHJpbmcpfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLnN0eWxlID0gcHVnX3N0eWxlO1xuZnVuY3Rpb24gcHVnX3N0eWxlKHZhbCkge1xuICBpZiAoIXZhbCkgcmV0dXJuICcnO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgb3V0ID0gJyc7XG4gICAgZm9yICh2YXIgc3R5bGUgaW4gdmFsKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHB1Z19oYXNfb3duX3Byb3BlcnR5LmNhbGwodmFsLCBzdHlsZSkpIHtcbiAgICAgICAgb3V0ID0gb3V0ICsgc3R5bGUgKyAnOicgKyB2YWxbc3R5bGVdICsgJzsnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9IGVsc2Uge1xuICAgIHZhbCArPSAnJztcbiAgICBpZiAodmFsW3ZhbC5sZW5ndGggLSAxXSAhPT0gJzsnKSBcbiAgICAgIHJldHVybiB2YWwgKyAnOyc7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gcHVnX2F0dHI7XG5mdW5jdGlvbiBwdWdfYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKHZhbCA9PT0gZmFsc2UgfHwgdmFsID09IG51bGwgfHwgIXZhbCAmJiAoa2V5ID09PSAnY2xhc3MnIHx8IGtleSA9PT0gJ3N0eWxlJykpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKHZhbCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhbCA9IHZhbC50b0pTT04oKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbCAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBKU09OLnN0cmluZ2lmeSh2YWwpO1xuICAgIGlmICghZXNjYXBlZCAmJiB2YWwuaW5kZXhPZignXCInKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVxcJycgKyB2YWwucmVwbGFjZSgvJy9nLCAnJiMzOTsnKSArICdcXCcnO1xuICAgIH1cbiAgfVxuICBpZiAoZXNjYXBlZCkgdmFsID0gcHVnX2VzY2FwZSh2YWwpO1xuICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZXMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZXJzZSB3aGV0aGVyIHRvIHVzZSBIVE1MNSB0ZXJzZSBib29sZWFuIGF0dHJpYnV0ZXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IHB1Z19hdHRycztcbmZ1bmN0aW9uIHB1Z19hdHRycyhvYmosIHRlcnNlKXtcbiAgdmFyIGF0dHJzID0gJyc7XG5cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChwdWdfaGFzX293bl9wcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgdmFyIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PT0ga2V5KSB7XG4gICAgICAgIHZhbCA9IHB1Z19jbGFzc2VzKHZhbCk7XG4gICAgICAgIGF0dHJzID0gcHVnX2F0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkgKyBhdHRycztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoJ3N0eWxlJyA9PT0ga2V5KSB7XG4gICAgICAgIHZhbCA9IHB1Z19zdHlsZSh2YWwpO1xuICAgICAgfVxuICAgICAgYXR0cnMgKz0gcHVnX2F0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGF0dHJzO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciBwdWdfbWF0Y2hfaHRtbCA9IC9bXCImPD5dLztcbmV4cG9ydHMuZXNjYXBlID0gcHVnX2VzY2FwZTtcbmZ1bmN0aW9uIHB1Z19lc2NhcGUoX2h0bWwpe1xuICB2YXIgaHRtbCA9ICcnICsgX2h0bWw7XG4gIHZhciByZWdleFJlc3VsdCA9IHB1Z19tYXRjaF9odG1sLmV4ZWMoaHRtbCk7XG4gIGlmICghcmVnZXhSZXN1bHQpIHJldHVybiBfaHRtbDtcblxuICB2YXIgcmVzdWx0ID0gJyc7XG4gIHZhciBpLCBsYXN0SW5kZXgsIGVzY2FwZTtcbiAgZm9yIChpID0gcmVnZXhSZXN1bHQuaW5kZXgsIGxhc3RJbmRleCA9IDA7IGkgPCBodG1sLmxlbmd0aDsgaSsrKSB7XG4gICAgc3dpdGNoIChodG1sLmNoYXJDb2RlQXQoaSkpIHtcbiAgICAgIGNhc2UgMzQ6IGVzY2FwZSA9ICcmcXVvdDsnOyBicmVhaztcbiAgICAgIGNhc2UgMzg6IGVzY2FwZSA9ICcmYW1wOyc7IGJyZWFrO1xuICAgICAgY2FzZSA2MDogZXNjYXBlID0gJyZsdDsnOyBicmVhaztcbiAgICAgIGNhc2UgNjI6IGVzY2FwZSA9ICcmZ3Q7JzsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGxhc3RJbmRleCAhPT0gaSkgcmVzdWx0ICs9IGh0bWwuc3Vic3RyaW5nKGxhc3RJbmRleCwgaSk7XG4gICAgbGFzdEluZGV4ID0gaSArIDE7XG4gICAgcmVzdWx0ICs9IGVzY2FwZTtcbiAgfVxuICBpZiAobGFzdEluZGV4ICE9PSBpKSByZXR1cm4gcmVzdWx0ICsgaHRtbC5zdWJzdHJpbmcobGFzdEluZGV4LCBpKTtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBwdWcgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lbm9cbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgb3JpZ2luYWwgc291cmNlXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBwdWdfcmV0aHJvdztcbmZ1bmN0aW9uIHB1Z19yZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSBzdHIgfHwgcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBwdWdfcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ1B1ZycpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3B1Zy1ydW50aW1lL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxyXG4gKiDQodGA0LDQstC90LjQstCw0LXRgiDQvtCx0YrQtdC60YLRiyDQv9C+INC30L3QsNGH0L3QuNC40Y5cclxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xyXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBFcXVhbCAoc3JjLCBkZXN0KSB7XHJcblx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHNyYykgPT09IEpTT04uc3RyaW5naWZ5KGRlc3QpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC00L3QuNC80LDQtdGCINC/0LXRgNCy0YPRjiDQsdGD0LrQstGDINGB0YLRgNC+0LrQuCDQsiDQstC10YDRhdC90LjQuSDRgNC10LPQuNGB0YLRgFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBjYXBpdGFsaXplIChzdHIpIHtcclxuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCB7ZGVlcEVxdWFsLCBjYXBpdGFsaXplfTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mcmFtZXdvcmsvdXRpbHMuanMiLCJpbXBvcnQgdG1wbCBmcm9tICcuL2Zvcm0udG1wbC5wdWcnO1xyXG5pbXBvcnQgJy4vZm9ybS5jc3MnO1xyXG5cclxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsvZW1pdHRlcic7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEZvcm0ge1xyXG5cdGNvbnN0cnVjdG9yKHtlbCwgZGF0YSA9IHt9fSkge1xyXG5cdFx0RW1pdHRlci5hcHBseSh0aGlzKTtcclxuXHRcdHRoaXMuZWwgPSBlbDtcclxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XHJcblxyXG5cdFx0dGhpcy5faW5pdEV2ZW50cygpO1xyXG5cdH1cclxuXHJcblx0cmVuZGVyICgpIHtcclxuXHRcdHRoaXMuZWwuaW5uZXJIVE1MID0gdG1wbCh0aGlzLmRhdGEpO1xyXG5cclxuXHRcdHRoaXMuZm9ybUVsID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XHJcblx0fVxyXG5cclxuXHRyZXNldCAoKSB7XHJcblx0XHR0aGlzLmZvcm1FbC5yZXNldCgpO1xyXG5cdH1cclxuXHJcblx0X2luaXRFdmVudHMgKCkge1xyXG5cdFx0dGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLl9vblN1Ym1pdC5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdF9vblN1Ym1pdCAoZXZlbnQpIHtcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRsZXQgZm9ybURhdGEgPSB0aGlzLl9nZXRGb3JtRGF0YSgpO1xyXG5cclxuXHRcdHRoaXMudHJpZ2dlcignc3VibWl0JywgZm9ybURhdGEpO1xyXG5cdH1cclxuXHJcblx0X2dldElucHV0cyAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCwgdGV4dGFyZWEnKTtcclxuXHR9XHJcblxyXG5cdF9nZXRGb3JtRGF0YSAoKSB7XHJcblx0XHRsZXQgZm9ybURhdGEgPSB7fTtcclxuXHJcblx0XHRbLi4udGhpcy5fZ2V0SW5wdXRzKCldLmZvckVhY2goaW5wdXQgPT4ge1xyXG5cdFx0XHRmb3JtRGF0YVtpbnB1dC5uYW1lXSA9IHtcclxuXHRcdFx0XHR2YWx1ZTogaW5wdXQudmFsdWVcclxuXHRcdFx0fTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBmb3JtRGF0YTtcclxuXHR9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50cy9mb3JtL2Zvcm0uanMiLCJpbXBvcnQgdG1wbCBmcm9tICcuL21lbnUudG1wbC5wdWcnO1xuaW1wb3J0ICcuL21lbnUuY3NzJztcblxuXG5leHBvcnQgY2xhc3MgTWVudSB7XG4gICAgY29uc3RydWN0b3IgKHtlbCwgZGF0YSA9IHt9fSkge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuXG4gICAgcmVuZGVyICgpIHtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB0bXBsKHRoaXMuZGF0YSk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvbWVudS9tZW51LmpzIiwiZXhwb3J0IGZ1bmN0aW9uIEVtaXR0ZXIgKCkge1xuXG4gICAgLyoqXG5cdCAqINCS0YvQt9C+0LIg0L7QsdGA0LDQsdC+0YLRh9C40LrQvtCyINGB0L7QsdGL0YLQuNC5XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGV2ZW50IG5hbWVcblx0ICogQHBhcmFtIHsqfSBkYXRhIGV2ZW50IHBheWxvYWRcblx0ICovXG5cdHRoaXMudHJpZ2dlciA9IGZ1bmN0aW9uIChuYW1lLCBkYXRhKSB7XG5cdFx0aWYgKHRoaXMuX19jYWxsYmFja3MgJiYgdGhpcy5fX2NhbGxiYWNrc1tuYW1lXSkge1xuXHRcdFx0dGhpcy5fX2NhbGxiYWNrc1tuYW1lXS5mb3JFYWNoKGNiID0+IGNiLmNhbGwodGhpcywgZGF0YSkpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICog0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDQvtCx0YDQsNCx0L7RgtGH0LjQutCwINGB0L7QsdGL0YLQuNGPXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGV2ZW50IG5hbWVcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2IgY2FsbGJhY2tcblx0ICovXG5cdHRoaXMub24gPSBmdW5jdGlvbiAobmFtZSwgY2IpIHtcblx0XHRpZiAoIXRoaXMuX19jYWxsYmFja3MpIHtcblx0XHRcdHRoaXMuX19jYWxsYmFja3MgPSB7fTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuX19jYWxsYmFja3NbbmFtZV0pIHtcblx0XHRcdHRoaXMuX19jYWxsYmFja3NbbmFtZV0gPSBbXTtcblx0XHR9XG5cblx0XHR0aGlzLl9fY2FsbGJhY2tzW25hbWVdLnB1c2goY2IpO1xuXHR9O1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay9lbWl0dGVyLmpzIiwiaW1wb3J0IHtkZWVwRXF1YWx9IGZyb20gJy4uL2ZyYW1ld29yay91dGlscyc7XHJcbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnLi4vZnJhbWV3b3JrL2VtaXR0ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXRTZXJ2aWNlIHtcclxuXHJcblx0Y29uc3RydWN0b3IgKHtiYXNlVXJsLCBwb2xsaW5nSW50ZXJ2YWwgPSAxNTAwMCwgaHR0cH0pIHtcclxuXHRcdEVtaXR0ZXIuYXBwbHkodGhpcyk7XHJcblxyXG5cdFx0dGhpcy5wb2xsaW5nSW50ZXJ2YWwgPSBwb2xsaW5nSW50ZXJ2YWw7XHJcblx0XHR0aGlzLmh0dHAgPSBodHRwO1xyXG5cclxuXHRcdHRoaXMuaHR0cC5zZXRCYXNlVXJsKGJhc2VVcmwpO1xyXG5cclxuXHRcdHRoaXMuX21lc3NhZ2VzID0gW107XHJcblx0XHR0aGlzLl9wb2xsaW5nSUQgPSBudWxsO1xyXG5cdFx0dGhpcy5fc3RvcHBlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5fdXNlcm5hbWUgPSAnYW5vbmltdXMnO1xyXG5cdH1cclxuXHJcblx0c2V0VXNlck5hbWUgKG5hbWUpIHtcclxuXHRcdHRoaXMuX3VzZXJuYW1lID0gbmFtZTtcclxuXHR9XHJcblxyXG5cdGdldFVzZXJOYW1lICgpIHtcclxuXHRcdHJldHVybiB0aGlzLl91c2VybmFtZTtcclxuXHR9XHJcblxyXG5cdGdldE1lc3NhZ2VzICgpIHtcclxuXHRcdHJldHVybiB0aGlzLmh0dHAubWFrZVJlcXVlc3QoKVxyXG5cdFx0XHQudGhlbihyZXNwID0+IE9iamVjdC52YWx1ZXMocmVzcC5kYXRhKSk7XHJcblx0fVxyXG5cclxuXHRzZW5kTWVzc2FnZSAoZGF0YSkge1xyXG5cdFx0ZGF0YS5kYXRlID0gRGF0ZS5ub3coKTtcclxuXHRcdGRhdGEubmFtZSA9IHRoaXMuX3VzZXJuYW1lO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmh0dHAubWFrZVJlcXVlc3QoJ1BPU1QnLCBkYXRhKVxyXG5cdFx0XHQudGhlbihyZXNwID0+IHJlc3AuZGF0YSk7XHJcblx0fVxyXG5cclxuXHRzdGFydFBvbGxpbmcgKCkge1xyXG5cdFx0dGhpcy5fc3RvcHBlZCA9IGZhbHNlO1xyXG5cclxuXHRcdGxldCBkb1JlcXVlc3QgPSAoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLl9zdG9wcGVkKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmdldE1lc3NhZ2VzKCkudGhlbihtZXNzYWdlcyA9PiB7XHJcblx0XHRcdFx0dGhpcy5zZXRNZXNzYWdlcyhtZXNzYWdlcyk7XHJcblx0XHRcdFx0dGhpcy5fcG9sbGluZ0lEID0gc2V0VGltZW91dChkb1JlcXVlc3QsIHRoaXMucG9sbGluZ0ludGVydmFsKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGRvUmVxdWVzdCgpO1xyXG5cdH1cclxuXHJcblx0c3RvcFBvbGxpbmcgKCkge1xyXG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLl9wb2xsaW5nSUQpO1xyXG5cdFx0dGhpcy5fc3RvcHBlZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRzZXRNZXNzYWdlcyAobWVzc2FnZXMpIHtcclxuXHRcdGlmIChkZWVwRXF1YWwodGhpcy5fbWVzc2FnZXMsIG1lc3NhZ2VzKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fbWVzc2FnZXMgPSBtZXNzYWdlcztcclxuXHRcdHRoaXMudHJpZ2dlcignbWVzc2FnZXMnLCB0aGlzLl9tZXNzYWdlcyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzc1xyXG5cdCAqIEBzdGF0aWMgXHJcblx0ICovXHJcblx0c3RhdGljIGdldEluc3RhbmNlICguLi5yZXN0KSB7XHJcblx0XHRpZiAoIXRoaXMuX19pbnN0YW5jZSkge1xyXG5cdFx0XHR0aGlzLl9faW5zdGFuY2UgPSBuZXcgdGhpcyguLi5yZXN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fX2luc3RhbmNlO1xyXG5cdH1cclxuXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvY2hhdC5zZXJ2aWNlLmpzIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih7bm9kZSwgaGlzdG9yeX0pIHtcbiAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5oaXN0b3J5ID0gaGlzdG9yeTtcblxuICAgICAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0LzQsNGA0YjRgNGD0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZVxuICAgICAqIEBwYXJhbSB7QmFzZVZpZXd9IHZpZXdcbiAgICAgKi9cbiAgICByZWdpc3Rlcihyb3V0ZSwgdmlldykge1xuICAgICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0gPSB2aWV3O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCS0YvQsdC+0YAgVmlldyDQv9C+INC80LDRgNGI0YDRg9GC0YNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGVcbiAgICAgKiBAcmV0dXJucyB7QmFzZVZpZXd9XG4gICAgICovXG4gICAgX2dldFZpZXdCeVJvdXRlKHJvdXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlc1tyb3V0ZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPINC60LvQuNC60LAg0L/QviDRgdGB0YvQu9C60LVcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgb25Sb3V0ZUNoYW5nZShldmVudCkge1xuXG4gICAgICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ28oZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpKSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCX0LDQv9GD0YHRgtC40YLRjCDQv9GA0L7RhtC10YEg0LzQsNGA0YjRgNGD0YLQuNC30LDRhtC40LhcbiAgICAgKi9cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5ub2RlXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB0aGlzLm9uUm91dGVDaGFuZ2UoZXZlbnQpKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBfID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ28obG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9C10YDQtdGC0LjQuSDQv9C+INC80LDRgNGI0YDRg9GC0YNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtINC10YHQu9C4INC10YHRgtGMINC80LDRgNGI0YDRg9GA0YJcbiAgICAgKi9cbiAgICBnbyhwYXRoKSB7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5fZ2V0Vmlld0J5Um91dGUocGF0aCk7XG5cbiAgICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VmlldyA9PT0gdmlldykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2aWV3LnNob3coKTtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIHBhdGgpO1xuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHZpZXc7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay9yb3V0ZXIuanMiLCJpbXBvcnQge0NoYXRWaWV3fSBmcm9tICcuL2NoYXQudmlldyc7XG5pbXBvcnQge0xvZ2luVmlld30gZnJvbSAnLi9sb2dpbi52aWV3JztcbmltcG9ydCB7TWFpblZpZXd9IGZyb20gJy4vbWFpbi52aWV3JztcblxuZXhwb3J0IGRlZmF1bHQge0NoYXQ6IENoYXRWaWV3LCBNYWluOiBNYWluVmlldywgTG9naW46IExvZ2luVmlld307XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvaW5kZXguanMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9hcHAuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vYXBwLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9hcHAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWlsbGlncmFtLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9taWxsaWdyYW0uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWlsbGlncmFtLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L21pbGxpZ3JhbS9kaXN0L21pbGxpZ3JhbS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxyXG5pbXBvcnQgdG1wbCBmcm9tICcuL2NoYXQudG1wbC5wdWcnO1xyXG5pbXBvcnQgJy4vY2hhdC5jc3MnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENoYXREYXRhXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1c2VyIC0g0LjQvNGPINGC0LXQutGD0YnQtdCz0L4g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8Q2hhdE1lc3NhZ2U+fSBtZXNzYWdlcyAtINC80LDRgdGB0Lgg0YHQvtC+0LHRidC10L3QuNC5INCyINGH0LDRgtC1XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENoYXRNZXNzYWdlXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0ZXh0IC0g0KLQtdC60YHRgiDRgdC+0L7QsdGJ0LXQvdC40Y9cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgLSDQuNC80Y8g0L7RgtC/0YDQsNCy0LjRgtC10LvRjyDRgdC+0L7QsdGJ0LXQvdC40Y9cclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhdCB7XHJcblx0Y29uc3RydWN0b3Ioe1xyXG5cdFx0XHRlbCxcclxuXHRcdFx0ZGF0YSA9IHttZXNzYWdlczogW119LFxyXG5cdFx0XHRhdmF0YXJTZXJ2aWNlLFxyXG5cdFx0XHRjaGF0U2VydmljZVxyXG5cdFx0fSkge1xyXG5cdFx0dGhpcy5lbCA9IGVsO1xyXG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcclxuXHJcblx0XHR0aGlzLmF2YXRhclNlcnZpY2UgPSBhdmF0YXJTZXJ2aWNlO1xyXG5cdFx0dGhpcy5jaGF0U2VydmljZSA9IGNoYXRTZXJ2aWNlO1xyXG5cclxuXHRcdHRoaXMuX2luaXRFdmVudHMoKTtcclxuXHR9XHJcblxyXG5cdF9pbml0RXZlbnRzICgpIHtcclxuXHRcdHRoaXMuY2hhdFNlcnZpY2Uub24oJ21lc3NhZ2VzJywgdGhpcy5fb25NZXNzYWdlcy5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHR0aGlzLl9zYXZlU2Nyb2xsVG9wKCk7XHJcblx0XHR0aGlzLmVsLmlubmVySFRNTCA9IHRtcGwodGhpcy5kYXRhKTtcclxuXHRcdHRoaXMuX3Jlc3RvcmVTY3JvbGxUb3AoKTtcclxuXHR9XHJcblxyXG5cdF9vbk1lc3NhZ2VzIChtZXNzYWdlcykge1xyXG5cdFx0dGhpcy5zZXRNZXNzYWdlcyhtZXNzYWdlcyk7XHJcblx0XHR0aGlzLnJlbmRlcigpO1xyXG5cdH1cclxuXHJcblx0X3NhdmVTY3JvbGxUb3AgKCkge1xyXG5cdFx0bGV0IGNoYXRCb3ggPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5jaGF0X19ib3gnKTtcclxuXHJcblx0XHRpZiAoY2hhdEJveCkge1xyXG5cdFx0XHR0aGlzLl9zY3JvbGxUb3AgPSBjaGF0Qm94LnNjcm9sbFRvcDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yZXN0b3JlU2Nyb2xsVG9wICgpIHtcclxuXHRcdGxldCBjaGF0Qm94ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuY2hhdF9fYm94Jyk7XHJcblxyXG5cdFx0aWYgKGNoYXRCb3gpIHtcclxuXHRcdFx0Y2hhdEJveC5zY3JvbGxUb3AgPSB0aGlzLl9zY3JvbGxUb3A7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfdXBkYXRlTWVzc2FnZXMgKCkge1xyXG5cdFx0dGhpcy5kYXRhLm1lc3NhZ2VzID0gdGhpcy5kYXRhLm1lc3NhZ2VzLnNvcnQoKG1lc3NhZ2UxLCBtZXNzYWdlMikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gbWVzc2FnZTIuZGF0ZSAtIG1lc3NhZ2UxLmRhdGU7XHJcblx0XHR9KTtcdFxyXG5cdH1cclxuXHJcblx0c2V0TWVzc2FnZXMgKG1lc3NhZ2VzID0gW10pIHtcclxuXHRcdHRoaXMuZGF0YS5tZXNzYWdlcy5sZW5ndGggPSAwO1xyXG5cdFx0dGhpcy5hZGQobWVzc2FnZXMpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JzQsNGB0YHQvtCy0L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDRgdC+0L7QsdGJ0LXQvdC40LlcclxuXHQgKiBAcGFyYW0ge0FycmF5PENoYXRNZXNzYWdlcz59IG1lc3NhZ2VzXHJcblx0ICovXHJcblx0YWRkIChtZXNzYWdlcyA9IFtdKSB7XHJcblx0XHRsZXQgYWRkT25lTWVzc2FnZU1ldGhvZCA9IHRoaXMuYWRkT25lLmJpbmQodGhpcyk7XHJcblxyXG5cdFx0bWVzc2FnZXMuZm9yRWFjaChhZGRPbmVNZXNzYWdlTWV0aG9kKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCU0L7QsdCw0LLQuNGC0Ywg0L3QvtCy0L7QtSDRgdC+0L7QsdGJ0LXQvdC40LUg0LIg0YfQsNGCXHJcblx0ICogQHBhcmFtIHtDaGF0TWVzc2FnZX0gZGF0YVxyXG5cdCAqL1xyXG5cdGFkZE9uZSAoZGF0YSkge1xyXG5cdFx0dGhpcy5kYXRhLm1lc3NhZ2VzLnB1c2godGhpcy5fcHJlcGFyZU1lc3NhZ2UoZGF0YSkpO1xyXG5cdH1cclxuXHJcblx0X3ByZXBhcmVNZXNzYWdlICh7YXZhdGFyLCBuYW1lLCB0ZXh0LCBkYXRlID0gRGF0ZS5ub3coKX0pIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGF2YXRhcjogdGhpcy5hdmF0YXJTZXJ2aWNlLmdldEF2YXRhcihuYW1lKSxcclxuXHRcdFx0bmFtZSxcclxuXHRcdFx0aXNNaW5lOiBuYW1lID09PSB0aGlzLmRhdGEudXNlcixcclxuXHRcdFx0dGV4dCxcclxuXHRcdFx0ZGF0ZTogbmV3IERhdGUoZGF0ZSlcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRgtC10LrRg9GJ0LXQs9C+INGO0LfQtdGA0LBcclxuXHQgKi9cclxuXHRzZXRVc2VyTmFtZSAobmFtZSkge1xyXG5cdFx0dGhpcy5kYXRhLnVzZXIgPSBuYW1lO1xyXG5cdH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL2NoYXQvY2hhdC5qcyIsImltcG9ydCAnbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzcyc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9hcHAvYXBwLmNzcyc7XG5cbmltcG9ydCB7Um91dGVyfSBmcm9tICcuL2ZyYW1ld29yay9yb3V0ZXInO1xuaW1wb3J0IHtjYXBpdGFsaXplfSBmcm9tICcuL2ZyYW1ld29yay91dGlscyc7XG5cbmltcG9ydCB2aWV3cyBmcm9tICcuL3ZpZXdzJztcblxuY29uc3QgYXBwRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXBwJyk7XG5cbmNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuICAgIG5vZGU6IGFwcEVsLFxuICAgIGhpc3Rvcnk6IHdpbmRvdy5oaXN0b3J5XG59KTtcblxuWydtYWluJywgJ2NoYXQnLCAnbG9naW4nXS5mb3JFYWNoKHZpZXdOYW1lID0+IHtcbiAgICBsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZXQgVmlldyA9IHZpZXdzW2NhcGl0YWxpemUodmlld05hbWUpXTtcblxuICAgIGVsLmNsYXNzTGlzdC5hZGQodmlld05hbWUpO1xuICAgIGVsLmhpZGRlbiA9IHRydWU7XG4gICAgYXBwRWwuYXBwZW5kQ2hpbGQoZWwpO1xuXG4gICAgcm91dGVyLnJlZ2lzdGVyKGAvJHt2aWV3TmFtZX1gLCBuZXcgVmlldyh7IGVsLCByb3V0ZXIgfSkpO1xufSk7XG5cbmlmIChsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy8nKSB7XG4gICAgcm91dGVyLmdvKCcvbWFpbicpO1xufSBlbHNlIHtcbiAgICByb3V0ZXIuZ28obG9jYXRpb24ucGF0aG5hbWUpO1xufVxuXG5yb3V0ZXIuc3RhcnQoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluLmpzIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzIiwiZXhwb3J0IGNsYXNzIEF2YXRhclNlcnZpY2Uge1xyXG5cclxuXHRjb25zdHJ1Y3RvciAoKSB7XHJcblx0XHR0aGlzLl9hdmF0YXJzID0ge1xyXG5cdFx0XHQnVGltJzogJ2h0dHA6Ly9pLmltZ3VyLmNvbS9GSE1uc1ZOdC5qcGcnLFxyXG5cdFx0XHQnTWF0dCc6ICcvLzEuZ3JhdmF0YXIuY29tL2F2YXRhci83NjdmYzljMTE1YTFiOTg5NzQ0Yzc1NWRiNDdmZWI2MD9zPTIwMCZyPXBnJmQ9bW0nXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuX2RlZmF1bHRBdmF0YXIgPSAnaHR0cHM6Ly91bnNwbGFzaC5pdC8yMDAvMjAwLz9yYW5kb20nO1xyXG5cdH1cclxuXHJcblx0Z2V0QXZhdGFyIChuYW1lID0gJycpIHtcclxuXHRcdGlmICghdGhpcy5fYXZhdGFyc1tuYW1lXSkge1xyXG5cdFx0XHR0aGlzLl9hdmF0YXJzW25hbWVdID0gdGhpcy5fZGVmYXVsdEF2YXRhciArIGA9JHtNYXRoLnJhbmRvbSgpfWA7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2F2YXRhcnNbbmFtZV07XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0SW5zdGFuY2UgKC4uLnJlc3QpIHtcclxuXHRcdHJldHVybiBuZXcgdGhpcyguLi5yZXN0KTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zZXJ2aWNlcy9hdmF0YXIuc2VydmljZS5qcyIsImV4cG9ydCBjbGFzcyBIdHRwU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IgKCkge31cblxuICAgIC8qKlxuICAgICAqIFNldHRpbmcgdGhlIGJhc2UgVVJMIGZvciByZXF1ZXN0c1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICAgKi9cbiAgICBzZXRCYXNlVXJsICh1cmwpIHtcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gdXJsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2luZyBhIEhUVFAgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIHNwZWNpZmllZCBhIEhUVFAgbWV0aG9kXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgc3BlY2lmaWVkIGEgYm9keSBvZiByZXF1ZXN0XG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICovXG5cdG1ha2VSZXF1ZXN0ICh0eXBlID0gJ0dFVCcsIGRhdGEgPSB7fSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdGhpcy5iYXNlVXJsLCB0cnVlKTtcblxuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLFxuICAgICAgICAgICAgICAgIHhoclxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIHJlamVjdCk7XG5cbiAgICAgICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSk7XG5cdH1cblxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSAoLi4ucmVzdCkge1xuXHRcdHJldHVybiBuZXcgdGhpcyguLi5yZXN0KTtcblx0fVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NlcnZpY2VzL2h0dHAuc2VydmljZS5qcyIsImltcG9ydCB7QmFzZVZpZXd9IGZyb20gJy4uL2ZyYW1ld29yay92aWV3JztcblxuaW1wb3J0IHtDaGF0fSBmcm9tICcuLi9jb21wb25lbnRzL2NoYXQvY2hhdCc7XG5pbXBvcnQge0Zvcm19IGZyb20gJy4uL2NvbXBvbmVudHMvZm9ybS9mb3JtJztcbmltcG9ydCB7QXZhdGFyU2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvYXZhdGFyLnNlcnZpY2UnO1xuaW1wb3J0IHtDaGF0U2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvY2hhdC5zZXJ2aWNlJztcbmltcG9ydCB7SHR0cFNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL2h0dHAuc2VydmljZSc7XG5cblxuY29uc3QgY2hhdFNlcnZpY2UgPSBDaGF0U2VydmljZS5nZXRJbnN0YW5jZSh7XG5cdGJhc2VVcmw6ICdodHRwczovL2NvbXBvbmVudHMtZTJlNmUuZmlyZWJhc2Vpby5jb20vY2hhdC9tZXNzYWdlcy9pa2V0YXJpLmpzb24nLFxuXHRodHRwOiBIdHRwU2VydmljZS5nZXRJbnN0YW5jZSgpLFxuXHRwb2xsaW5nSW50ZXJ2YWw6IDEwMDBcbn0pO1xuXG5jb25zdCBhdmF0YXJTZXJ2aWNlID0gQXZhdGFyU2VydmljZS5nZXRJbnN0YW5jZSgpO1xuXG5leHBvcnQgY2xhc3MgQ2hhdFZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG4gICAgY29uc3RydWN0b3IgKC4uLnJlc3QpIHtcbiAgICAgICAgc3VwZXIoLi4ucmVzdCk7XG5cbiAgICAgICAgdGhpcy5fY3JlYXRlQ29tcG9uZW50cygpO1xuXHRcdHRoaXMuX2luaXRNZWRpYXRlKCk7XG5cblx0XHR0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuY2hhdC5lbCk7XG5cdFx0dGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLmZvcm0uZWwpO1xuXG5cdFx0dGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBzaG93ICgpIHtcbiAgICAgICAgdGhpcy5jaGF0LnNldFVzZXJOYW1lKGNoYXRTZXJ2aWNlLmdldFVzZXJOYW1lKCkpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICBjaGF0U2VydmljZS5zdGFydFBvbGxpbmcoKTtcblxuICAgICAgICBzdXBlci5zaG93KCk7XG4gICAgfVxuXG4gICAgaGlkZSAoKSB7XG4gICAgICAgIGNoYXRTZXJ2aWNlLnN0b3BQb2xsaW5nKCk7XG5cbiAgICAgICAgc3VwZXIuaGlkZSgpO1xuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG5cdFx0dGhpcy5jaGF0LnJlbmRlcigpO1xuXHRcdHRoaXMuZm9ybS5yZW5kZXIoKTtcblx0fVxuXG5cdF9jcmVhdGVDb21wb25lbnRzICgpIHtcblx0XHR0aGlzLmNoYXQgPSBuZXcgQ2hhdCh7XG5cdFx0XHRlbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRhdmF0YXJTZXJ2aWNlLFxuXHRcdFx0Y2hhdFNlcnZpY2Vcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybSA9IG5ldyBGb3JtKHtcblx0XHRcdGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB3aWRnZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ3RleHRhcmVhJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ21lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAn0JLQstC10LTQuNGC0LUg0YHQvtC+0LHRidC10L3QuNC1Li4uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICfQntGC0L/RgNCw0LLQuNGC0YwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXI6ICfQktGL0LnRgtC4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiAnL21haW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuXHRcdH0pO1xuXHR9XG5cblx0X2luaXRNZWRpYXRlICgpIHtcblx0XHR0aGlzLmZvcm0ub24oJ3N1Ym1pdCcsIChmb3JtRGF0YSkgPT4ge1xuXHRcdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRcdHRleHQ6IGZvcm1EYXRhLm1lc3NhZ2UudmFsdWVcblx0XHRcdH07XG5cblx0XHRcdGNoYXRTZXJ2aWNlLnNlbmRNZXNzYWdlKGRhdGEpO1xuXG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH0pO1xuXHR9XG5cblx0YWRkTWVzc2FnZSAoZGF0YSkge1xuXHRcdHRoaXMuY2hhdC5hZGRPbmUoZGF0YSk7XG5cdH1cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvY2hhdC52aWV3LmpzIiwiaW1wb3J0IHtCYXNlVmlld30gZnJvbSAnLi4vZnJhbWV3b3JrL3ZpZXcnO1xuXG5pbXBvcnQge0Zvcm19IGZyb20gJy4uL2NvbXBvbmVudHMvZm9ybS9mb3JtJztcbmltcG9ydCB7TWVudX0gZnJvbSAnLi4vY29tcG9uZW50cy9tZW51L21lbnUnO1xuXG5pbXBvcnQge0NoYXRTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9jaGF0LnNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgTG9naW5WaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yICguLi5yZXN0KSB7XG4gICAgICAgIHN1cGVyKC4uLnJlc3QpO1xuXG4gICAgICAgIHRoaXMubWVudSA9IG5ldyBNZW51KHtcbiAgICAgICAgICAgIGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ9CQ0LLRgtC+0YDQuNC30LDRhtC40Y8nLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0gPSBuZXcgRm9ybSh7XG4gICAgICAgICAgICBlbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgd2lkZ2V0czogW1xuICAgICAgICAgICAgICAgICAgICB7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd1c2VybmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICfQmNC80Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPLi4uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICfQktC+0LnRgtC4J1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMubWVudS5lbCk7XG4gICAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5mb3JtLmVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZm9ybS5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy5tZW51LnJlbmRlcigpO1xuXG4gICAgICAgIHRoaXMuX2luaXRNZWRpYXRlKCk7XG4gICAgfVxuXG4gICAgX2luaXRNZWRpYXRlICgpIHtcbiAgICAgICAgdGhpcy5mb3JtLm9uKCdzdWJtaXQnLCBmb3JtRGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhdFNlcnZpY2UgPSBDaGF0U2VydmljZS5nZXRJbnN0YW5jZSgpO1xuXG4gICAgICAgICAgICBjaGF0U2VydmljZS5zZXRVc2VyTmFtZShmb3JtRGF0YS51c2VybmFtZS52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5nbygnL2NoYXQnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ZpZXdzL2xvZ2luLnZpZXcuanMiLCJpbXBvcnQge0Jhc2VWaWV3fSBmcm9tICcuLi9mcmFtZXdvcmsvdmlldyc7XG5cbmltcG9ydCB7TWVudX0gZnJvbSAnLi4vY29tcG9uZW50cy9tZW51L21lbnUnO1xuXG5leHBvcnQgY2xhc3MgTWFpblZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG4gICAgY29uc3RydWN0b3IgKC4uLnJlc3QpIHtcbiAgICAgICAgc3VwZXIoLi4ucmVzdCk7XG5cbiAgICAgICAgdGhpcy5tZW51ID0gbmV3IE1lbnUoe1xuICAgICAgICAgICAgZWw6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnU2luZ2xlIFBhZ2UgQ2hhdCcsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgICAge2hyZWY6ICcvbG9naW4nLCB0ZXh0OiAn0JLQvtC50YLQuCd9LFxuICAgICAgICAgICAgICAgICAgICB7aHJlZjogJy9jaGF0JywgdGV4dDogJ9Cn0LDRgid9LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLm1lbnUuZWwpO1xuICAgICAgICB0aGlzLm1lbnUucmVuZGVyKCk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ZpZXdzL21haW4udmlldy5qcyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIioge1xcclxcbiAgZm9udC1mYW1pbHk6J0hlbHZldGljYSBOZXVlJyxIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxyXFxuICBmb250LXNpemU6IDE0cHg7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxufVxcclxcblxcclxcbi5hcHAge1xcclxcblxcdHdpZHRoOiA0MDBweDtcXHJcXG5cXHRtYXJnaW46MCBhdXRvO1xcclxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5jaGF0X19jb250YWluZXIge1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBkaXNwbGF5OmJsb2NrO1xcclxcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmhlYWRlcntcXHJcXG4gIHBhZGRpbmc6MjBweCAyMHB4IDE4cHggMjBweDtcXHJcXG4gIGJhY2tncm91bmQ6IzliNGRjYTtcXHJcXG4gIGNvbG9yOiNmZmY7XFxyXFxufVxcclxcbi5oZWFkZXIgaDJ7XFxyXFxuICBmb250LXNpemU6MTZweDtcXHJcXG4gIGxpbmUtaGVpZ2h0OjE1cHg7XFxyXFxuICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG4gIGxldHRlci1zcGFjaW5nOiAwLjA1ZW07XFxyXFxufVxcclxcbi5oZWFkZXIgYXtcXHJcXG4gIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xcclxcbiAgYmFja2dyb3VuZDojM2Q4YjRlO1xcclxcbiAgZm9udC1zaXplOjI1cHg7XFxyXFxuICBsaW5lLWhlaWdodDoyMHB4O1xcclxcbiAgcGFkZGluZzozcHggNnB4O1xcclxcbiAgbWFyZ2luLXRvcDotNXB4O1xcclxcbiAgYm9yZGVyLXJhZGl1czoycHg7XFxyXFxufVxcclxcblxcclxcbi5jaGF0X19ib3gge1xcclxcbiAgYmFja2dyb3VuZDogI0VDRUNFQztcXHJcXG4gIHBhZGRpbmc6IDAgMjBweDtcXHJcXG4gIGNvbG9yOiAjYTFhMWExO1xcclxcbiAgb3ZlcmZsb3cteTogYXV0bztcXHJcXG4gIGhlaWdodDogNjB2aDtcXHJcXG59XFxyXFxuXFxyXFxuLmNoYXRfX2JveCAubWVzc2FnZS1ib3h7XFxyXFxuICBwYWRkaW5nOjE4cHggMCAxMHB4O1xcclxcbiAgY2xlYXI6Ym90aDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94IC5waWN0dXJle1xcclxcbiAgZmxvYXQ6bGVmdDtcXHJcXG4gIHdpZHRoOjUwcHg7XFxyXFxuICBkaXNwbGF5OmJsb2NrO1xcclxcbiAgcGFkZGluZy1yaWdodDoxMHB4O1xcclxcbn1cXHJcXG4ucGljdHVyZSBpbWd7XFxyXFxuICB3aWR0aDo0M3B4O1xcclxcbiAgaGVpZ2h0OjQzcHg7XFxyXFxuICBib3JkZXItcmFkaXVzOjVweDtcXHJcXG59XFxyXFxuLnBpY3R1cmUgc3BhbiB7XFxyXFxuICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gIGZvbnQtc2l6ZTogMTBweDtcXHJcXG4gIGNsZWFyOiBib3RoO1xcclxcbiAgZGlzcGxheTogYmxvY2s7XFxyXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICBtYXJnaW4tdG9wOiAzcHg7XFxyXFxufVxcclxcbi5tZXNzYWdle1xcclxcbiAgYmFja2dyb3VuZDojZmZmO1xcclxcbiAgZGlzcGxheTppbmxpbmUtYmxvY2s7XFxyXFxuICBwYWRkaW5nOjEzcHg7XFxyXFxuICB3aWR0aDoyNzRweDtcXHJcXG4gIGJvcmRlci1yYWRpdXM6MnB4O1xcclxcbiAgYm94LXNoYWRvdzogMCAxcHggMXB4IHJnYmEoMCwwLDAsLjA0KTtcXHJcXG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xcclxcbn1cXHJcXG4ubWVzc2FnZTpiZWZvcmV7XFxyXFxuICBjb250ZW50OlxcXCJcXFwiO1xcclxcbiAgcG9zaXRpb246YWJzb2x1dGU7XFxyXFxuICBkaXNwbGF5OmJsb2NrO1xcclxcbiAgbGVmdDowO1xcclxcbiAgYm9yZGVyLXJpZ2h0OjZweCBzb2xpZCAjZmZmO1xcclxcbiAgYm9yZGVyLXRvcDogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWJvdHRvbTo2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICB0b3A6MTBweDtcXHJcXG4gIG1hcmdpbi1sZWZ0Oi02cHg7XFxyXFxufVxcclxcbi5tZXNzYWdlIHNwYW57XFxyXFxuICBjb2xvcjojNTU1O1xcclxcbiAgZm9udC13ZWlnaHQ6Ym9sZDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UgcHtcXHJcXG4gIHBhZGRpbmctdG9wOjVweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94LnJpZ2h0LWltZyAucGljdHVyZXtcXHJcXG4gIGZsb2F0OnJpZ2h0O1xcclxcbiAgcGFkZGluZzowO1xcclxcbiAgcGFkZGluZy1sZWZ0OjEwcHg7XFxyXFxufVxcclxcbi5tZXNzYWdlLWJveC5yaWdodC1pbWcgLnBpY3R1cmUgaW1ne1xcclxcbiAgZmxvYXQ6cmlnaHQ7XFxyXFxufVxcclxcbi5tZXNzYWdlLWJveC5yaWdodC1pbWcgLm1lc3NhZ2U6YmVmb3Jle1xcclxcbiAgbGVmdDoxMDAlO1xcclxcbiAgbWFyZ2luLXJpZ2h0OjZweDtcXHJcXG4gIG1hcmdpbi1sZWZ0OjA7XFxyXFxuICBib3JkZXItcmlnaHQ6NnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbiAgYm9yZGVyLWxlZnQ6NnB4IHNvbGlkICNmZmY7XFxyXFxuICBib3JkZXItdG9wOiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOjZweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9jb21wb25lbnRzL2NoYXQvY2hhdC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vY29tcG9uZW50cy9mb3JtL2Zvcm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL2NvbXBvbmVudHMvbWVudS9tZW51LmNzc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKiFcXG4gKiBNaWxsaWdyYW0gdjEuMy4wXFxuICogaHR0cHM6Ly9taWxsaWdyYW0uZ2l0aHViLmlvXFxuICpcXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgQ0ogUGF0b2lsb1xcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxcbiAqL1xcblxcbiosXFxuKjphZnRlcixcXG4qOmJlZm9yZSB7XFxuICBib3gtc2l6aW5nOiBpbmhlcml0O1xcbn1cXG5cXG5odG1sIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBmb250LXNpemU6IDYyLjUlO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGNvbG9yOiAjNjA2Yzc2O1xcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCAnSGVsdmV0aWNhIE5ldWUnLCAnSGVsdmV0aWNhJywgJ0FyaWFsJywgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMS42ZW07XFxuICBmb250LXdlaWdodDogMzAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC4wMWVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuNjtcXG59XFxuXFxuYmxvY2txdW90ZSB7XFxuICBib3JkZXItbGVmdDogMC4zcmVtIHNvbGlkICNkMWQxZDE7XFxuICBtYXJnaW4tbGVmdDogMDtcXG4gIG1hcmdpbi1yaWdodDogMDtcXG4gIHBhZGRpbmc6IDFyZW0gMS41cmVtO1xcbn1cXG5cXG5ibG9ja3F1b3RlICo6bGFzdC1jaGlsZCB7XFxuICBtYXJnaW4tYm90dG9tOiAwO1xcbn1cXG5cXG4uYnV0dG9uLFxcbmJ1dHRvbixcXG5pbnB1dFt0eXBlPSdidXR0b24nXSxcXG5pbnB1dFt0eXBlPSdyZXNldCddLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM5YjRkY2E7XFxuICBib3JkZXI6IDAuMXJlbSBzb2xpZCAjOWI0ZGNhO1xcbiAgYm9yZGVyLXJhZGl1czogLjRyZW07XFxuICBjb2xvcjogI2ZmZjtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGhlaWdodDogMy44cmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC4xcmVtO1xcbiAgbGluZS1oZWlnaHQ6IDMuOHJlbTtcXG4gIHBhZGRpbmc6IDAgMy4wcmVtO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxufVxcblxcbi5idXR0b246Zm9jdXMsIC5idXR0b246aG92ZXIsXFxuYnV0dG9uOmZvY3VzLFxcbmJ1dHRvbjpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J106aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J106Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J106aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzYwNmM3NjtcXG4gIGJvcmRlci1jb2xvcjogIzYwNmM3NjtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgb3V0bGluZTogMDtcXG59XFxuXFxuLmJ1dHRvbltkaXNhYmxlZF0sXFxuYnV0dG9uW2Rpc2FibGVkXSxcXG5pbnB1dFt0eXBlPSdidXR0b24nXVtkaXNhYmxlZF0sXFxuaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF0sXFxuaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdIHtcXG4gIGN1cnNvcjogZGVmYXVsdDtcXG4gIG9wYWNpdHk6IC41O1xcbn1cXG5cXG4uYnV0dG9uW2Rpc2FibGVkXTpmb2N1cywgLmJ1dHRvbltkaXNhYmxlZF06aG92ZXIsXFxuYnV0dG9uW2Rpc2FibGVkXTpmb2N1cyxcXG5idXR0b25bZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddW2Rpc2FibGVkXTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjOWI0ZGNhO1xcbiAgYm9yZGVyLWNvbG9yOiAjOWI0ZGNhO1xcbn1cXG5cXG4uYnV0dG9uLmJ1dHRvbi1vdXRsaW5lLFxcbmJ1dHRvbi5idXR0b24tb3V0bGluZSxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZSxcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1vdXRsaW5lLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6ICM5YjRkY2E7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLW91dGxpbmU6Zm9jdXMsIC5idXR0b24uYnV0dG9uLW91dGxpbmU6aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lOmZvY3VzLFxcbmJ1dHRvbi5idXR0b24tb3V0bGluZTpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1vdXRsaW5lOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmU6aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmU6Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmU6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItY29sb3I6ICM2MDZjNzY7XFxuICBjb2xvcjogIzYwNmM3NjtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsIC5idXR0b24uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmJ1dHRvbi5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIge1xcbiAgYm9yZGVyLWNvbG9yOiBpbmhlcml0O1xcbiAgY29sb3I6ICM5YjRkY2E7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLWNsZWFyLFxcbmJ1dHRvbi5idXR0b24tY2xlYXIsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tY2xlYXI6Zm9jdXMsIC5idXR0b24uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmJ1dHRvbi5idXR0b24tY2xlYXI6Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcjpob3ZlcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXI6Zm9jdXMsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhcjpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tY2xlYXI6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6ICM2MDZjNzY7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cywgLmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmZvY3VzLFxcbmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpob3ZlciB7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuY29kZSB7XFxuICBiYWNrZ3JvdW5kOiAjZjRmNWY2O1xcbiAgYm9yZGVyLXJhZGl1czogLjRyZW07XFxuICBmb250LXNpemU6IDg2JTtcXG4gIG1hcmdpbjogMCAuMnJlbTtcXG4gIHBhZGRpbmc6IC4ycmVtIC41cmVtO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG59XFxuXFxucHJlIHtcXG4gIGJhY2tncm91bmQ6ICNmNGY1ZjY7XFxuICBib3JkZXItbGVmdDogMC4zcmVtIHNvbGlkICM5YjRkY2E7XFxuICBvdmVyZmxvdy15OiBoaWRkZW47XFxufVxcblxcbnByZSA+IGNvZGUge1xcbiAgYm9yZGVyLXJhZGl1czogMDtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcGFkZGluZzogMXJlbSAxLjVyZW07XFxuICB3aGl0ZS1zcGFjZTogcHJlO1xcbn1cXG5cXG5ociB7XFxuICBib3JkZXI6IDA7XFxuICBib3JkZXItdG9wOiAwLjFyZW0gc29saWQgI2Y0ZjVmNjtcXG4gIG1hcmdpbjogMy4wcmVtIDA7XFxufVxcblxcbmlucHV0W3R5cGU9J2VtYWlsJ10sXFxuaW5wdXRbdHlwZT0nbnVtYmVyJ10sXFxuaW5wdXRbdHlwZT0ncGFzc3dvcmQnXSxcXG5pbnB1dFt0eXBlPSdzZWFyY2gnXSxcXG5pbnB1dFt0eXBlPSd0ZWwnXSxcXG5pbnB1dFt0eXBlPSd0ZXh0J10sXFxuaW5wdXRbdHlwZT0ndXJsJ10sXFxudGV4dGFyZWEsXFxuc2VsZWN0IHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gICAgIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcXG4gICAgICAgICAgYXBwZWFyYW5jZTogbm9uZTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyOiAwLjFyZW0gc29saWQgI2QxZDFkMTtcXG4gIGJvcmRlci1yYWRpdXM6IC40cmVtO1xcbiAgYm94LXNoYWRvdzogbm9uZTtcXG4gIGJveC1zaXppbmc6IGluaGVyaXQ7XFxuICBoZWlnaHQ6IDMuOHJlbTtcXG4gIHBhZGRpbmc6IC42cmVtIDEuMHJlbTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG5pbnB1dFt0eXBlPSdlbWFpbCddOmZvY3VzLFxcbmlucHV0W3R5cGU9J251bWJlciddOmZvY3VzLFxcbmlucHV0W3R5cGU9J3Bhc3N3b3JkJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc2VhcmNoJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ndGVsJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ndGV4dCddOmZvY3VzLFxcbmlucHV0W3R5cGU9J3VybCddOmZvY3VzLFxcbnRleHRhcmVhOmZvY3VzLFxcbnNlbGVjdDpmb2N1cyB7XFxuICBib3JkZXItY29sb3I6ICM5YjRkY2E7XFxuICBvdXRsaW5lOiAwO1xcbn1cXG5cXG5zZWxlY3Qge1xcbiAgYmFja2dyb3VuZDogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgaGVpZ2h0PVxcXCIxNFxcXCIgdmlld0JveD1cXFwiMCAwIDI5IDE0XFxcIiB3aWR0aD1cXFwiMjlcXFwiPjxwYXRoIGZpbGw9XFxcIiNkMWQxZDFcXFwiIGQ9XFxcIk05LjM3NzI3IDMuNjI1bDUuMDgxNTQgNi45MzUyM0wxOS41NDAzNiAzLjYyNVxcXCIvPjwvc3ZnPicpIGNlbnRlciByaWdodCBuby1yZXBlYXQ7XFxuICBwYWRkaW5nLXJpZ2h0OiAzLjByZW07XFxufVxcblxcbnNlbGVjdDpmb2N1cyB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBoZWlnaHQ9XFxcIjE0XFxcIiB2aWV3Qm94PVxcXCIwIDAgMjkgMTRcXFwiIHdpZHRoPVxcXCIyOVxcXCI+PHBhdGggZmlsbD1cXFwiIzliNGRjYVxcXCIgZD1cXFwiTTkuMzc3MjcgMy42MjVsNS4wODE1NCA2LjkzNTIzTDE5LjU0MDM2IDMuNjI1XFxcIi8+PC9zdmc+Jyk7XFxufVxcblxcbnRleHRhcmVhIHtcXG4gIG1pbi1oZWlnaHQ6IDYuNXJlbTtcXG59XFxuXFxubGFiZWwsXFxubGVnZW5kIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZm9udC1zaXplOiAxLjZyZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgbWFyZ2luLWJvdHRvbTogLjVyZW07XFxufVxcblxcbmZpZWxkc2V0IHtcXG4gIGJvcmRlci13aWR0aDogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbmlucHV0W3R5cGU9J2NoZWNrYm94J10sXFxuaW5wdXRbdHlwZT0ncmFkaW8nXSB7XFxuICBkaXNwbGF5OiBpbmxpbmU7XFxufVxcblxcbi5sYWJlbC1pbmxpbmUge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gIG1hcmdpbi1sZWZ0OiAuNXJlbTtcXG59XFxuXFxuLmNvbnRhaW5lciB7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIG1heC13aWR0aDogMTEyLjByZW07XFxuICBwYWRkaW5nOiAwIDIuMHJlbTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgcGFkZGluZzogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucm93LnJvdy1uby1wYWRkaW5nIHtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5yb3cucm93LW5vLXBhZGRpbmcgPiAuY29sdW1uIHtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5yb3cucm93LXdyYXAge1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG5cXG4ucm93LnJvdy10b3Age1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi5yb3cucm93LWJvdHRvbSB7XFxuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XFxufVxcblxcbi5yb3cucm93LWNlbnRlciB7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4ucm93LnJvdy1zdHJldGNoIHtcXG4gIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xcbn1cXG5cXG4ucm93LnJvdy1iYXNlbGluZSB7XFxuICBhbGlnbi1pdGVtczogYmFzZWxpbmU7XFxufVxcblxcbi5yb3cgLmNvbHVtbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGZsZXg6IDEgMSBhdXRvO1xcbiAgbWFyZ2luLWxlZnQ6IDA7XFxuICBtYXgtd2lkdGg6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMTAge1xcbiAgbWFyZ2luLWxlZnQ6IDEwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMjAge1xcbiAgbWFyZ2luLWxlZnQ6IDIwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMjUge1xcbiAgbWFyZ2luLWxlZnQ6IDI1JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMzMsIC5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTM0IHtcXG4gIG1hcmdpbi1sZWZ0OiAzMy4zMzMzJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNTAge1xcbiAgbWFyZ2luLWxlZnQ6IDUwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNjYsIC5yb3cgLmNvbHVtbi5jb2x1bW4tb2Zmc2V0LTY3IHtcXG4gIG1hcmdpbi1sZWZ0OiA2Ni42NjY2JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNzUge1xcbiAgbWFyZ2luLWxlZnQ6IDc1JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtODAge1xcbiAgbWFyZ2luLWxlZnQ6IDgwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtOTAge1xcbiAgbWFyZ2luLWxlZnQ6IDkwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi0xMCB7XFxuICBmbGV4OiAwIDAgMTAlO1xcbiAgbWF4LXdpZHRoOiAxMCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tMjAge1xcbiAgZmxleDogMCAwIDIwJTtcXG4gIG1heC13aWR0aDogMjAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTI1IHtcXG4gIGZsZXg6IDAgMCAyNSU7XFxuICBtYXgtd2lkdGg6IDI1JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi0zMywgLnJvdyAuY29sdW1uLmNvbHVtbi0zNCB7XFxuICBmbGV4OiAwIDAgMzMuMzMzMyU7XFxuICBtYXgtd2lkdGg6IDMzLjMzMzMlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTQwIHtcXG4gIGZsZXg6IDAgMCA0MCU7XFxuICBtYXgtd2lkdGg6IDQwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi01MCB7XFxuICBmbGV4OiAwIDAgNTAlO1xcbiAgbWF4LXdpZHRoOiA1MCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNjAge1xcbiAgZmxleDogMCAwIDYwJTtcXG4gIG1heC13aWR0aDogNjAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTY2LCAucm93IC5jb2x1bW4uY29sdW1uLTY3IHtcXG4gIGZsZXg6IDAgMCA2Ni42NjY2JTtcXG4gIG1heC13aWR0aDogNjYuNjY2NiU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNzUge1xcbiAgZmxleDogMCAwIDc1JTtcXG4gIG1heC13aWR0aDogNzUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTgwIHtcXG4gIGZsZXg6IDAgMCA4MCU7XFxuICBtYXgtd2lkdGg6IDgwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi05MCB7XFxuICBmbGV4OiAwIDAgOTAlO1xcbiAgbWF4LXdpZHRoOiA5MCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbiAuY29sdW1uLXRvcCB7XFxuICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xcbn1cXG5cXG4ucm93IC5jb2x1bW4gLmNvbHVtbi1ib3R0b20ge1xcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XFxufVxcblxcbi5yb3cgLmNvbHVtbiAuY29sdW1uLWNlbnRlciB7XFxuICAtbXMtZ3JpZC1yb3ctYWxpZ246IGNlbnRlcjtcXG4gICAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbkBtZWRpYSAobWluLXdpZHRoOiA0MHJlbSkge1xcbiAgLnJvdyB7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIG1hcmdpbi1sZWZ0OiAtMS4wcmVtO1xcbiAgICB3aWR0aDogY2FsYygxMDAlICsgMi4wcmVtKTtcXG4gIH1cXG4gIC5yb3cgLmNvbHVtbiB7XFxuICAgIG1hcmdpbi1ib3R0b206IGluaGVyaXQ7XFxuICAgIHBhZGRpbmc6IDAgMS4wcmVtO1xcbiAgfVxcbn1cXG5cXG5hIHtcXG4gIGNvbG9yOiAjOWI0ZGNhO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5hOmZvY3VzLCBhOmhvdmVyIHtcXG4gIGNvbG9yOiAjNjA2Yzc2O1xcbn1cXG5cXG5kbCxcXG5vbCxcXG51bCB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbiAgbWFyZ2luLXRvcDogMDtcXG4gIHBhZGRpbmctbGVmdDogMDtcXG59XFxuXFxuZGwgZGwsXFxuZGwgb2wsXFxuZGwgdWwsXFxub2wgZGwsXFxub2wgb2wsXFxub2wgdWwsXFxudWwgZGwsXFxudWwgb2wsXFxudWwgdWwge1xcbiAgZm9udC1zaXplOiA5MCU7XFxuICBtYXJnaW46IDEuNXJlbSAwIDEuNXJlbSAzLjByZW07XFxufVxcblxcbm9sIHtcXG4gIGxpc3Qtc3R5bGU6IGRlY2ltYWwgaW5zaWRlO1xcbn1cXG5cXG51bCB7XFxuICBsaXN0LXN0eWxlOiBjaXJjbGUgaW5zaWRlO1xcbn1cXG5cXG4uYnV0dG9uLFxcbmJ1dHRvbixcXG5kZCxcXG5kdCxcXG5saSB7XFxuICBtYXJnaW4tYm90dG9tOiAxLjByZW07XFxufVxcblxcbmZpZWxkc2V0LFxcbmlucHV0LFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XFxufVxcblxcbmJsb2NrcXVvdGUsXFxuZGwsXFxuZmlndXJlLFxcbmZvcm0sXFxub2wsXFxucCxcXG5wcmUsXFxudGFibGUsXFxudWwge1xcbiAgbWFyZ2luLWJvdHRvbTogMi41cmVtO1xcbn1cXG5cXG50YWJsZSB7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG50ZCxcXG50aCB7XFxuICBib3JkZXItYm90dG9tOiAwLjFyZW0gc29saWQgI2UxZTFlMTtcXG4gIHBhZGRpbmc6IDEuMnJlbSAxLjVyZW07XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbn1cXG5cXG50ZDpmaXJzdC1jaGlsZCxcXG50aDpmaXJzdC1jaGlsZCB7XFxuICBwYWRkaW5nLWxlZnQ6IDA7XFxufVxcblxcbnRkOmxhc3QtY2hpbGQsXFxudGg6bGFzdC1jaGlsZCB7XFxuICBwYWRkaW5nLXJpZ2h0OiAwO1xcbn1cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxucCB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbn1cXG5cXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNiB7XFxuICBmb250LXdlaWdodDogMzAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMXJlbTtcXG4gIG1hcmdpbi1ib3R0b206IDIuMHJlbTtcXG4gIG1hcmdpbi10b3A6IDA7XFxufVxcblxcbmgxIHtcXG4gIGZvbnQtc2l6ZTogNC42cmVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuMjtcXG59XFxuXFxuaDIge1xcbiAgZm9udC1zaXplOiAzLjZyZW07XFxuICBsaW5lLWhlaWdodDogMS4yNTtcXG59XFxuXFxuaDMge1xcbiAgZm9udC1zaXplOiAyLjhyZW07XFxuICBsaW5lLWhlaWdodDogMS4zO1xcbn1cXG5cXG5oNCB7XFxuICBmb250LXNpemU6IDIuMnJlbTtcXG4gIGxldHRlci1zcGFjaW5nOiAtLjA4cmVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuMzU7XFxufVxcblxcbmg1IHtcXG4gIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMDVyZW07XFxuICBsaW5lLWhlaWdodDogMS41O1xcbn1cXG5cXG5oNiB7XFxuICBmb250LXNpemU6IDEuNnJlbTtcXG4gIGxldHRlci1zcGFjaW5nOiAwO1xcbiAgbGluZS1oZWlnaHQ6IDEuNDtcXG59XFxuXFxuaW1nIHtcXG4gIG1heC13aWR0aDogMTAwJTtcXG59XFxuXFxuLmNsZWFyZml4OmFmdGVyIHtcXG4gIGNsZWFyOiBib3RoO1xcbiAgY29udGVudDogJyAnO1xcbiAgZGlzcGxheTogdGFibGU7XFxufVxcblxcbi5mbG9hdC1sZWZ0IHtcXG4gIGZsb2F0OiBsZWZ0O1xcbn1cXG5cXG4uZmxvYXQtcmlnaHQge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL34vbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKG1lc3NhZ2VzLCB1c2VyKSB7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2hhdFxcXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2hhdF9fY29udGFpbmVyXFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJoZWFkZXJcXFwiXFx1MDAzRVxcdTAwM0NoMlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSAn0JTQvtCx0YDQviDQv9C+0LbQsNC70L7QstCw0YLRjCAnICsgKHVzZXIgfHwgJycpKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGaDJcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwiY2hhdF9fYm94XFxcIlxcdTAwM0VcIjtcbmlmICghbWVzc2FnZXMubGVuZ3RoKSB7XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDaDNcXHUwMDNF0J/QvtC60LAg0L3QtdGCINGB0L7QvtCx0YnQtdC90LjQuVxcdTAwM0NcXHUwMDJGaDNcXHUwMDNFXCI7XG59XG4vLyBpdGVyYXRlIG1lc3NhZ2VzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IG1lc3NhZ2VzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgcHVnX2luZGV4MCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgcHVnX2luZGV4MCA8ICQkbDsgcHVnX2luZGV4MCsrKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XCIgKyAocHVnLmF0dHIoXCJjbGFzc1wiLCBwdWcuY2xhc3NlcyhbXCJtZXNzYWdlLWJveFwiLG1lc3NhZ2UuaXNNaW5lID8gJ2xlZnQtaW1nJyA6ICdyaWdodC1pbWcnXSwgW2ZhbHNlLHRydWVdKSwgZmFsc2UsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInBpY3R1cmVcXFwiXFx1MDAzRVxcdTAwM0NpbWdcIiArIChwdWcuYXR0cihcInNyY1wiLCBtZXNzYWdlLmF2YXRhciwgdHJ1ZSwgdHJ1ZSkrXCIgdGl0bGU9XFxcIm5hbWUgb2YgdXNlclxcXCJcIikgKyBcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwidGltZVxcXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS5kYXRlICYmIG1lc3NhZ2UuZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzBdKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NwXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UudGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7XG4gICAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgcHVnX2luZGV4MCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7XG4gICAgICB2YXIgbWVzc2FnZSA9ICQkb2JqW3B1Z19pbmRleDBdO1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2RpdlwiICsgKHB1Zy5hdHRyKFwiY2xhc3NcIiwgcHVnLmNsYXNzZXMoW1wibWVzc2FnZS1ib3hcIixtZXNzYWdlLmlzTWluZSA/ICdsZWZ0LWltZycgOiAncmlnaHQtaW1nJ10sIFtmYWxzZSx0cnVlXSksIGZhbHNlLCB0cnVlKSkgKyBcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJwaWN0dXJlXFxcIlxcdTAwM0VcXHUwMDNDaW1nXCIgKyAocHVnLmF0dHIoXCJzcmNcIiwgbWVzc2FnZS5hdmF0YXIsIHRydWUsIHRydWUpK1wiIHRpdGxlPVxcXCJuYW1lIG9mIHVzZXJcXFwiXCIpICsgXCJcXHUwMDNFXFx1MDAzQ3NwYW4gY2xhc3M9XFxcInRpbWVcXFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UuZGF0ZSAmJiBtZXNzYWdlLmRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVswXSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwibWVzc2FnZVxcXCJcXHUwMDNFXFx1MDAzQ3NwYW5cXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS5uYW1lKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDcFxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLnRleHQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZwXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVwiO1xuICAgIH1cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJtZXNzYWdlc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubWVzc2FnZXM6dHlwZW9mIG1lc3NhZ2VzIT09XCJ1bmRlZmluZWRcIj9tZXNzYWdlczp1bmRlZmluZWQsXCJ1c2VyXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VyOnR5cGVvZiB1c2VyIT09XCJ1bmRlZmluZWRcIj91c2VyOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2NoYXQvY2hhdC50bXBsLnB1Z1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHB1ZyA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3B1Zy1ydW50aW1lL2luZGV4LmpzXCIpO1xuXG5mdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHt2YXIgcHVnX2h0bWwgPSBcIlwiLCBwdWdfbWl4aW5zID0ge30sIHB1Z19pbnRlcnA7O3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHdpZGdldHMpIHtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZm9ybVxcdTAwM0VcIjtcbi8vIGl0ZXJhdGUgd2lkZ2V0c1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSB3aWRnZXRzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgcHVnX2luZGV4MCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgcHVnX2luZGV4MCA8ICQkbDsgcHVnX2luZGV4MCsrKSB7XG4gICAgICAgIHZhciB3aWRnZXQgPSAkJG9ialtwdWdfaW5kZXgwXTtcbnZhciB0YWdOYW1lID0gd2lkZ2V0LnRhZyB8fCAnaW5wdXQnXG52YXIgaW5uZXIgPSB3aWRnZXQuaW5uZXIgfHwgJydcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NcIiArICh0YWdOYW1lKSArIChwdWcuYXR0cnMod2lkZ2V0LmF0dHJpYnV0ZXMsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGlubmVyKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGXCIgKyAodGFnTmFtZSkgKyBcIlxcdTAwM0VcIjtcbiAgICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICQkb2JqKSB7XG4gICAgICAkJGwrKztcbiAgICAgIHZhciB3aWRnZXQgPSAkJG9ialtwdWdfaW5kZXgwXTtcbnZhciB0YWdOYW1lID0gd2lkZ2V0LnRhZyB8fCAnaW5wdXQnXG52YXIgaW5uZXIgPSB3aWRnZXQuaW5uZXIgfHwgJydcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NcIiArICh0YWdOYW1lKSArIChwdWcuYXR0cnMod2lkZ2V0LmF0dHJpYnV0ZXMsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGlubmVyKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGXCIgKyAodGFnTmFtZSkgKyBcIlxcdTAwM0VcIjtcbiAgICB9XG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NcXHUwMDJGZm9ybVxcdTAwM0VcIjt9LmNhbGwodGhpcyxcIndpZGdldHNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLndpZGdldHM6dHlwZW9mIHdpZGdldHMhPT1cInVuZGVmaW5lZFwiP3dpZGdldHM6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvZm9ybS9mb3JtLnRtcGwucHVnXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaXRlbXMsIHRpdGxlKSB7cHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2gxXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IHRpdGxlKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGaDFcXHUwMDNFXFx1MDAzQ3VsXFx1MDAzRVwiO1xuLy8gaXRlcmF0ZSBpdGVtc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBpdGVtcztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIHB1Z19pbmRleDAgPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7IHB1Z19pbmRleDAgPCAkJGw7IHB1Z19pbmRleDArKykge1xuICAgICAgICB2YXIgaXRlbSA9ICQkb2JqW3B1Z19pbmRleDBdO1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2xpXFx1MDAzRVxcdTAwM0NhXCIgKyAocHVnLmF0dHIoXCJocmVmXCIsIGl0ZW0uaHJlZiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaXRlbS50ZXh0KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGYVxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVwiO1xuICAgICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyIHB1Z19pbmRleDAgaW4gJCRvYmopIHtcbiAgICAgICQkbCsrO1xuICAgICAgdmFyIGl0ZW0gPSAkJG9ialtwdWdfaW5kZXgwXTtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NsaVxcdTAwM0VcXHUwMDNDYVwiICsgKHB1Zy5hdHRyKFwiaHJlZlwiLCBpdGVtLmhyZWYsIHRydWUsIHRydWUpKSArIFwiXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IGl0ZW0udGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRmFcXHUwMDNFXFx1MDAzQ1xcdTAwMkZsaVxcdTAwM0VcIjtcbiAgICB9XG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NcXHUwMDJGdWxcXHUwMDNFXCI7fS5jYWxsKHRoaXMsXCJpdGVtc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaXRlbXM6dHlwZW9mIGl0ZW1zIT09XCJ1bmRlZmluZWRcIj9pdGVtczp1bmRlZmluZWQsXCJ0aXRsZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudGl0bGU6dHlwZW9mIHRpdGxlIT09XCJ1bmRlZmluZWRcIj90aXRsZTp1bmRlZmluZWQpKTs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9tZW51L21lbnUudG1wbC5wdWdcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2NoYXQuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vY2hhdC5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vY2hhdC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9jaGF0L2NoYXQuY3NzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9mb3JtLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2Zvcm0uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2Zvcm0uY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvZm9ybS9mb3JtLmNzc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWVudS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9tZW51LmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9tZW51LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL21lbnUvbWVudS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDMxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIChpZ25vcmVkKSAqL1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGZzIChpZ25vcmVkKVxuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==