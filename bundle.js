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

router.go('/main');
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
																// this.chat.addOne(data);

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
exports.push([module.i, ".chat__container {\r\n  width: 100%;\r\n  display:block;\r\n  overflow: hidden;\r\n}\r\n\r\n.header{\r\n  padding:20px 20px 18px 20px;\r\n  background:#9b4dca;\r\n  color:#fff;\r\n}\r\n.header h2{\r\n  font-size:16px;\r\n  line-height:15px;\r\n  display:inline-block;\r\n  letter-spacing: 0.05em;\r\n}\r\n.header a{\r\n  display:inline-block;\r\n  float:right;\r\n  background:#3d8b4e;\r\n  font-size:25px;\r\n  line-height:20px;\r\n  padding:3px 6px;\r\n  margin-top:-5px;\r\n  border-radius:2px;\r\n}\r\n\r\n.chat__box {\r\n  background: #ECECEC;\r\n  padding: 0 20px;\r\n  color: #a1a1a1;\r\n  overflow-y: auto;\r\n  height: 60vh;\r\n}\r\n\r\n.chat__box .message-box{\r\n  padding:18px 0 10px;\r\n  clear:both;\r\n}\r\n.message-box .picture{\r\n  float:left;\r\n  width:50px;\r\n  display:block;\r\n  padding-right:10px;\r\n}\r\n.picture img{\r\n  width:43px;\r\n  height:43px;\r\n  border-radius:5px;\r\n}\r\n.picture span {\r\n  font-weight: bold;\r\n  font-size: 10px;\r\n  clear: both;\r\n  display: block;\r\n  text-align: center;\r\n  margin-top: 3px;\r\n}\r\n.message{\r\n  background:#fff;\r\n  display:inline-block;\r\n  padding:13px;\r\n  width:274px;\r\n  border-radius:2px;\r\n  box-shadow: 0 1px 1px rgba(0,0,0,.04);\r\n  position:relative;\r\n}\r\n.message:before{\r\n  content:\"\";\r\n  position:absolute;\r\n  display:block;\r\n  left:0;\r\n  border-right:6px solid #fff;\r\n  border-top: 6px solid transparent;\r\n  border-bottom:6px solid transparent;\r\n  top:10px;\r\n  margin-left:-6px;\r\n}\r\n.message span{\r\n  color:#555;\r\n  font-weight:bold;\r\n}\r\n.message p{\r\n  padding-top:5px;\r\n}\r\n.message-box.right-img .picture{\r\n  float:right;\r\n  padding:0;\r\n  padding-left:10px;\r\n}\r\n.message-box.right-img .picture img{\r\n  float:right;\r\n}\r\n.message-box.right-img .message:before{\r\n  left:100%;\r\n  margin-right:6px;\r\n  margin-left:0;\r\n  border-right:6px solid transparent;\r\n  border-left:6px solid #fff;\r\n  border-top: 6px solid transparent;\r\n  border-bottom:6px solid transparent;\r\n}", ""]);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTVkNjVjNzViYzM4MmQ0MmI3NjkiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wdWctcnVudGltZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9mcmFtZXdvcmsvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9mb3JtL2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9tZW51L21lbnUuanMiLCJ3ZWJwYWNrOi8vLy4vZnJhbWV3b3JrL2VtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmljZXMvY2hhdC5zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL2ZyYW1ld29yay9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9hcHAvYXBwLmNzcz8yMzZmIiwid2VicGFjazovLy8uL34vbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzcz8xNzIwIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LmpzIiwid2VicGFjazovLy8uL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2aWNlcy9hdmF0YXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2aWNlcy9odHRwLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvY2hhdC52aWV3LmpzIiwid2VicGFjazovLy8uL3ZpZXdzL2xvZ2luLnZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvbWFpbi52aWV3LmpzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvYXBwL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9jaGF0L2NoYXQuY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLmNzcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL21lbnUvbWVudS5jc3MiLCJ3ZWJwYWNrOi8vLy4vfi9taWxsaWdyYW0vZGlzdC9taWxsaWdyYW0uY3NzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvbWVudS9tZW51LnRtcGwucHVnIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvY2hhdC9jaGF0LmNzcz82MTYzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvZm9ybS9mb3JtLmNzcz82NmVjIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvbWVudS9tZW51LmNzcz9kNjYzIiwid2VicGFjazovLy9mcyAoaWdub3JlZCkiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsInVzZVNvdXJjZU1hcCIsImxpc3QiLCJ0b1N0cmluZyIsIm1hcCIsIml0ZW0iLCJjb250ZW50IiwiY3NzV2l0aE1hcHBpbmdUb1N0cmluZyIsImpvaW4iLCJpIiwibW9kdWxlcyIsIm1lZGlhUXVlcnkiLCJhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzIiwibGVuZ3RoIiwiaWQiLCJwdXNoIiwiY3NzTWFwcGluZyIsImJ0b2EiLCJzb3VyY2VNYXBwaW5nIiwidG9Db21tZW50Iiwic291cmNlVVJMcyIsInNvdXJjZXMiLCJzb3VyY2UiLCJzb3VyY2VSb290IiwiY29uY2F0Iiwic291cmNlTWFwIiwiYmFzZTY0IiwidW5lc2NhcGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwiZGF0YSIsIkJhc2VWaWV3IiwiZWwiLCJyb3V0ZXIiLCJoaWRkZW4iLCJkZWVwRXF1YWwiLCJzcmMiLCJkZXN0IiwiY2FwaXRhbGl6ZSIsInN0ciIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJGb3JtIiwiYXBwbHkiLCJfaW5pdEV2ZW50cyIsImlubmVySFRNTCIsImZvcm1FbCIsInF1ZXJ5U2VsZWN0b3IiLCJyZXNldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25TdWJtaXQiLCJiaW5kIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1EYXRhIiwiX2dldEZvcm1EYXRhIiwidHJpZ2dlciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfZ2V0SW5wdXRzIiwiZm9yRWFjaCIsImlucHV0IiwibmFtZSIsInZhbHVlIiwiTWVudSIsIkVtaXR0ZXIiLCJfX2NhbGxiYWNrcyIsImNiIiwiY2FsbCIsIm9uIiwiQ2hhdFNlcnZpY2UiLCJiYXNlVXJsIiwicG9sbGluZ0ludGVydmFsIiwiaHR0cCIsInNldEJhc2VVcmwiLCJfX21lc3NhZ2VzIiwiX19wb2xsaW5nSUQiLCJfX2xhc3RSZXFUaW1lIiwiX191c2VybmFtZSIsIm1ha2VSZXF1ZXN0IiwidGhlbiIsIk9iamVjdCIsInZhbHVlcyIsInJlc3AiLCJkYXRlIiwiRGF0ZSIsIm5vdyIsImRvUmVxdWVzdCIsImdldE1lc3NhZ2VzIiwic2V0TWVzc2FnZXMiLCJtZXNzYWdlcyIsInNldFRpbWVvdXQiLCJjbGVhckludGVydmFsIiwiX21lc3NhZ2VzIiwiX19pbnN0YW5jZSIsInJlc3QiLCJSb3V0ZXIiLCJub2RlIiwiaGlzdG9yeSIsInJvdXRlcyIsInJvdXRlIiwidmlldyIsInRhcmdldCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZ28iLCJnZXRBdHRyaWJ1dGUiLCJvblJvdXRlQ2hhbmdlIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsInBhdGgiLCJfZ2V0Vmlld0J5Um91dGUiLCJjdXJyZW50VmlldyIsInNob3ciLCJwdXNoU3RhdGUiLCJoaWRlIiwiQ2hhdCIsIk1haW4iLCJMb2dpbiIsImF2YXRhclNlcnZpY2UiLCJjaGF0U2VydmljZSIsIl9vbk1lc3NhZ2VzIiwiX3NhdmVTY3JvbGxUb3AiLCJfcmVzdG9yZVNjcm9sbFRvcCIsInJlbmRlciIsImNoYXRCb3giLCJfc2Nyb2xsVG9wIiwic2Nyb2xsVG9wIiwic29ydCIsIm1lc3NhZ2UxIiwibWVzc2FnZTIiLCJhZGQiLCJhZGRPbmVNZXNzYWdlTWV0aG9kIiwiYWRkT25lIiwiX3ByZXBhcmVNZXNzYWdlIiwiYXZhdGFyIiwidGV4dCIsImdldEF2YXRhciIsImlzTWluZSIsInVzZXIiLCJhcHBFbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIlZpZXciLCJ2aWV3TmFtZSIsImNsYXNzTGlzdCIsImFwcGVuZENoaWxkIiwicmVnaXN0ZXIiLCJzdGFydCIsImNzcyIsIkVycm9yIiwicHJvdG9jb2wiLCJob3N0IiwiY3VycmVudERpciIsInJlcGxhY2UiLCJmaXhlZENzcyIsImZ1bGxNYXRjaCIsIm9yaWdVcmwiLCJ1bnF1b3RlZE9yaWdVcmwiLCJ0cmltIiwibyIsIiQxIiwidGVzdCIsIm5ld1VybCIsImluZGV4T2YiLCJBdmF0YXJTZXJ2aWNlIiwiX2F2YXRhcnMiLCJfZGVmYXVsdEF2YXRhciIsIk1hdGgiLCJyYW5kb20iLCJIdHRwU2VydmljZSIsInVybCIsInR5cGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwic2VuZCIsImdldEluc3RhbmNlIiwiQ2hhdFZpZXciLCJfY3JlYXRlQ29tcG9uZW50cyIsIl9pbml0TWVkaWF0ZSIsImNoYXQiLCJmb3JtIiwid2lkZ2V0cyIsInRhZyIsImF0dHJpYnV0ZXMiLCJwbGFjZWhvbGRlciIsImlubmVyIiwiaHJlZiIsIm1lc3NhZ2UiLCJzZW5kTWVzc2FnZSIsInN0YXJ0UG9sbGluZyIsIkxvZ2luVmlldyIsIm1lbnUiLCJ0aXRsZSIsIml0ZW1zIiwic2V0VXNlck5hbWUiLCJ1c2VybmFtZSIsIk1haW5WaWV3Il0sIm1hcHBpbmdzIjoiO0FBQUE7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QUVBLDJCQUEyQixrQ0FBa0MsY0FBYyxtQ0FBbUMsRUFBRSwwQkFBMEI7QUFDMUk7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLGtEQUFrRCxrQkFBa0I7QUFDcEU7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCw4Q0FBOEMsc01BQXNNO0FBQ3BQLDBCOzs7Ozs7QUN0QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUN6QkEsZSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxNWQ2NWM3NWJjMzgyZDQyYjc2OSIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0XHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdFx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlciBcblx0XHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0XHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0XHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG5cdH0pLFxuXHRnZXRFbGVtZW50ID0gKGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW8gPSB7fTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHRcdH07XG5cdH0pKGZ1bmN0aW9uIChzdHlsZVRhcmdldCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0eWxlVGFyZ2V0KVxuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdLFxuXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vZml4VXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0SW50byA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2Vcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XG5cdHZhciBzdHlsZVRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXHRpZiAoIXN0eWxlVGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBzdHlsZVRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKHN0eWxlRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YXR0YWNoVGFnQXR0cnMobGlua0VsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaFRhZ0F0dHJzKGVsZW1lbnQsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlLCB0cmFuc2Zvcm1SZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICB0cmFuc2Zvcm1SZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblx0ICAgIFxuXHQgICAgaWYgKHRyYW5zZm9ybVJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHRyYW5zZm9ybVJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuIFxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcblx0XHRpZihuZXdPYmopIHtcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0LyogSWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpe1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBCYXNlVmlldyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih7ZWwsIHJvdXRlcn0pIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INC/0L7QutCw0LfRi9Cy0LDQtdGCIHZpZXdcbiAgICAgKi9cbiAgICBzaG93ICgpIHtcbiAgICAgICAgdGhpcy5lbC5oaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INGB0LrRgNGL0LLQsNC10YIgdmlld1xuICAgICAqL1xuICAgIGhpZGUgKCkge1xuICAgICAgICB0aGlzLmVsLmhpZGRlbiA9IHRydWU7XG4gICAgfVxuXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay92aWV3LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVnX2hhc19vd25fcHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBwdWdfbWVyZ2U7XG5mdW5jdGlvbiBwdWdfbWVyZ2UoYSwgYikge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBhdHRycyA9IGFbMF07XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRycyA9IHB1Z19tZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgaWYgKGtleSA9PT0gJ2NsYXNzJykge1xuICAgICAgdmFyIHZhbEEgPSBhW2tleV0gfHwgW107XG4gICAgICBhW2tleV0gPSAoQXJyYXkuaXNBcnJheSh2YWxBKSA/IHZhbEEgOiBbdmFsQV0pLmNvbmNhdChiW2tleV0gfHwgW10pO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICB2YXIgdmFsQSA9IHB1Z19zdHlsZShhW2tleV0pO1xuICAgICAgdmFyIHZhbEIgPSBwdWdfc3R5bGUoYltrZXldKTtcbiAgICAgIGFba2V5XSA9IHZhbEEgKyB2YWxCO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGE7XG59O1xuXG4vKipcbiAqIFByb2Nlc3MgYXJyYXksIG9iamVjdCwgb3Igc3RyaW5nIGFzIGEgc3RyaW5nIG9mIGNsYXNzZXMgZGVsaW1pdGVkIGJ5IGEgc3BhY2UuXG4gKlxuICogSWYgYHZhbGAgaXMgYW4gYXJyYXksIGFsbCBtZW1iZXJzIG9mIGl0IGFuZCBpdHMgc3ViYXJyYXlzIGFyZSBjb3VudGVkIGFzXG4gKiBjbGFzc2VzLiBJZiBgZXNjYXBpbmdgIGlzIGFuIGFycmF5LCB0aGVuIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGluIGB2YWxgIGlzXG4gKiBlc2NhcGVkIGRlcGVuZHMgb24gdGhlIGNvcnJlc3BvbmRpbmcgaXRlbSBpbiBgZXNjYXBpbmdgLiBJZiBgZXNjYXBpbmdgIGlzXG4gKiBub3QgYW4gYXJyYXksIG5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gKlxuICogSWYgYHZhbGAgaXMgYW4gb2JqZWN0LCBhbGwgdGhlIGtleXMgd2hvc2UgdmFsdWUgaXMgdHJ1dGh5IGFyZSBjb3VudGVkIGFzXG4gKiBjbGFzc2VzLiBObyBlc2NhcGluZyBpcyBkb25lLlxuICpcbiAqIElmIGB2YWxgIGlzIGEgc3RyaW5nLCBpdCBpcyBjb3VudGVkIGFzIGEgY2xhc3MuIE5vIGVzY2FwaW5nIGlzIGRvbmUuXG4gKlxuICogQHBhcmFtIHsoQXJyYXkuPHN0cmluZz58T2JqZWN0LjxzdHJpbmcsIGJvb2xlYW4+fHN0cmluZyl9IHZhbFxuICogQHBhcmFtIHs/QXJyYXkuPHN0cmluZz59IGVzY2FwaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2xhc3NlcyA9IHB1Z19jbGFzc2VzO1xuZnVuY3Rpb24gcHVnX2NsYXNzZXNfYXJyYXkodmFsLCBlc2NhcGluZykge1xuICB2YXIgY2xhc3NTdHJpbmcgPSAnJywgY2xhc3NOYW1lLCBwYWRkaW5nID0gJycsIGVzY2FwZUVuYWJsZWQgPSBBcnJheS5pc0FycmF5KGVzY2FwaW5nKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICBjbGFzc05hbWUgPSBwdWdfY2xhc3Nlcyh2YWxbaV0pO1xuICAgIGlmICghY2xhc3NOYW1lKSBjb250aW51ZTtcbiAgICBlc2NhcGVFbmFibGVkICYmIGVzY2FwaW5nW2ldICYmIChjbGFzc05hbWUgPSBwdWdfZXNjYXBlKGNsYXNzTmFtZSkpO1xuICAgIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgKyBwYWRkaW5nICsgY2xhc3NOYW1lO1xuICAgIHBhZGRpbmcgPSAnICc7XG4gIH1cbiAgcmV0dXJuIGNsYXNzU3RyaW5nO1xufVxuZnVuY3Rpb24gcHVnX2NsYXNzZXNfb2JqZWN0KHZhbCkge1xuICB2YXIgY2xhc3NTdHJpbmcgPSAnJywgcGFkZGluZyA9ICcnO1xuICBmb3IgKHZhciBrZXkgaW4gdmFsKSB7XG4gICAgaWYgKGtleSAmJiB2YWxba2V5XSAmJiBwdWdfaGFzX293bl9wcm9wZXJ0eS5jYWxsKHZhbCwga2V5KSkge1xuICAgICAgY2xhc3NTdHJpbmcgPSBjbGFzc1N0cmluZyArIHBhZGRpbmcgKyBrZXk7XG4gICAgICBwYWRkaW5nID0gJyAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY2xhc3NTdHJpbmc7XG59XG5mdW5jdGlvbiBwdWdfY2xhc3Nlcyh2YWwsIGVzY2FwaW5nKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICByZXR1cm4gcHVnX2NsYXNzZXNfYXJyYXkodmFsLCBlc2NhcGluZyk7XG4gIH0gZWxzZSBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHB1Z19jbGFzc2VzX29iamVjdCh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWwgfHwgJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IG9iamVjdCBvciBzdHJpbmcgdG8gYSBzdHJpbmcgb2YgQ1NTIHN0eWxlcyBkZWxpbWl0ZWQgYnkgYSBzZW1pY29sb24uXG4gKlxuICogQHBhcmFtIHsoT2JqZWN0LjxzdHJpbmcsIHN0cmluZz58c3RyaW5nKX0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy5zdHlsZSA9IHB1Z19zdHlsZTtcbmZ1bmN0aW9uIHB1Z19zdHlsZSh2YWwpIHtcbiAgaWYgKCF2YWwpIHJldHVybiAnJztcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIG91dCA9ICcnO1xuICAgIGZvciAodmFyIHN0eWxlIGluIHZhbCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChwdWdfaGFzX293bl9wcm9wZXJ0eS5jYWxsKHZhbCwgc3R5bGUpKSB7XG4gICAgICAgIG91dCA9IG91dCArIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXSArICc7JztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfSBlbHNlIHtcbiAgICB2YWwgKz0gJyc7XG4gICAgaWYgKHZhbFt2YWwubGVuZ3RoIC0gMV0gIT09ICc7JykgXG4gICAgICByZXR1cm4gdmFsICsgJzsnO1xuICAgIHJldHVybiB2YWw7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IHB1Z19hdHRyO1xuZnVuY3Rpb24gcHVnX2F0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmICh2YWwgPT09IGZhbHNlIHx8IHZhbCA9PSBudWxsIHx8ICF2YWwgJiYgKGtleSA9PT0gJ2NsYXNzJyB8fCBrZXkgPT09ICdzdHlsZScpKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmICh2YWwgPT09IHRydWUpIHtcbiAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbC50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YWwgPSB2YWwudG9KU09OKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gSlNPTi5zdHJpbmdpZnkodmFsKTtcbiAgICBpZiAoIWVzY2FwZWQgJiYgdmFsLmluZGV4T2YoJ1wiJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cXCcnICsgdmFsLnJlcGxhY2UoLycvZywgJyYjMzk7JykgKyAnXFwnJztcbiAgICB9XG4gIH1cbiAgaWYgKGVzY2FwZWQpIHZhbCA9IHB1Z19lc2NhcGUodmFsKTtcbiAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVyc2Ugd2hldGhlciB0byB1c2UgSFRNTDUgdGVyc2UgYm9vbGVhbiBhdHRyaWJ1dGVzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0cnMgPSBwdWdfYXR0cnM7XG5mdW5jdGlvbiBwdWdfYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBhdHRycyA9ICcnO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAocHVnX2hhc19vd25fcHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgIHZhciB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT09IGtleSkge1xuICAgICAgICB2YWwgPSBwdWdfY2xhc3Nlcyh2YWwpO1xuICAgICAgICBhdHRycyA9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpICsgYXR0cnM7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKCdzdHlsZScgPT09IGtleSkge1xuICAgICAgICB2YWwgPSBwdWdfc3R5bGUodmFsKTtcbiAgICAgIH1cbiAgICAgIGF0dHJzICs9IHB1Z19hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhdHRycztcbn07XG5cbi8qKlxuICogRXNjYXBlIHRoZSBnaXZlbiBzdHJpbmcgb2YgYGh0bWxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgcHVnX21hdGNoX2h0bWwgPSAvW1wiJjw+XS87XG5leHBvcnRzLmVzY2FwZSA9IHB1Z19lc2NhcGU7XG5mdW5jdGlvbiBwdWdfZXNjYXBlKF9odG1sKXtcbiAgdmFyIGh0bWwgPSAnJyArIF9odG1sO1xuICB2YXIgcmVnZXhSZXN1bHQgPSBwdWdfbWF0Y2hfaHRtbC5leGVjKGh0bWwpO1xuICBpZiAoIXJlZ2V4UmVzdWx0KSByZXR1cm4gX2h0bWw7XG5cbiAgdmFyIHJlc3VsdCA9ICcnO1xuICB2YXIgaSwgbGFzdEluZGV4LCBlc2NhcGU7XG4gIGZvciAoaSA9IHJlZ2V4UmVzdWx0LmluZGV4LCBsYXN0SW5kZXggPSAwOyBpIDwgaHRtbC5sZW5ndGg7IGkrKykge1xuICAgIHN3aXRjaCAoaHRtbC5jaGFyQ29kZUF0KGkpKSB7XG4gICAgICBjYXNlIDM0OiBlc2NhcGUgPSAnJnF1b3Q7JzsgYnJlYWs7XG4gICAgICBjYXNlIDM4OiBlc2NhcGUgPSAnJmFtcDsnOyBicmVhaztcbiAgICAgIGNhc2UgNjA6IGVzY2FwZSA9ICcmbHQ7JzsgYnJlYWs7XG4gICAgICBjYXNlIDYyOiBlc2NhcGUgPSAnJmd0Oyc7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogY29udGludWU7XG4gICAgfVxuICAgIGlmIChsYXN0SW5kZXggIT09IGkpIHJlc3VsdCArPSBodG1sLnN1YnN0cmluZyhsYXN0SW5kZXgsIGkpO1xuICAgIGxhc3RJbmRleCA9IGkgKyAxO1xuICAgIHJlc3VsdCArPSBlc2NhcGU7XG4gIH1cbiAgaWYgKGxhc3RJbmRleCAhPT0gaSkgcmV0dXJuIHJlc3VsdCArIGh0bWwuc3Vic3RyaW5nKGxhc3RJbmRleCwgaSk7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgcHVnIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIG9yaWdpbmFsIHNvdXJjZVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gcHVnX3JldGhyb3c7XG5mdW5jdGlvbiBwdWdfcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcHVnX3JldGhyb3coZXJyLCBudWxsLCBsaW5lbm8pXG4gIH1cbiAgdmFyIGNvbnRleHQgPSAzXG4gICAgLCBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJylcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcbiAgICAsIGVuZCA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgbGluZW5vICsgY29udGV4dCk7XG5cbiAgLy8gRXJyb3IgY29udGV4dFxuICB2YXIgY29udGV4dCA9IGxpbmVzLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmdW5jdGlvbihsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdQdWcnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9wdWctcnVudGltZS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcclxuICog0KHRgNCw0LLQvdC40LLQsNC10YIg0L7QsdGK0LXQutGC0Ysg0L/QviDQt9C90LDRh9C90LjQuNGOXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzcmNcclxuICogQHBhcmFtIHtPYmplY3R9IGRlc3RcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwRXF1YWwgKHNyYywgZGVzdCkge1xyXG5cdHJldHVybiBKU09OLnN0cmluZ2lmeShzcmMpID09PSBKU09OLnN0cmluZ2lmeShkZXN0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0L7QtNC90LjQvNCw0LXRgiDQv9C10YDQstGD0Y4g0LHRg9C60LLRgyDRgdGC0YDQvtC60Lgg0LIg0LLQtdGA0YXQvdC40Lkg0YDQtdCz0LjRgdGC0YBcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gY2FwaXRhbGl6ZSAoc3RyKSB7XHJcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xyXG59XHJcblxyXG5leHBvcnQge2RlZXBFcXVhbCwgY2FwaXRhbGl6ZX07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZnJhbWV3b3JrL3V0aWxzLmpzIiwiaW1wb3J0IHRtcGwgZnJvbSAnLi9mb3JtLnRtcGwucHVnJztcclxuaW1wb3J0ICcuL2Zvcm0uY3NzJztcclxuXHJcbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrL2VtaXR0ZXInO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBGb3JtIHtcclxuXHRjb25zdHJ1Y3Rvcih7ZWwsIGRhdGEgPSB7fX0pIHtcclxuXHRcdEVtaXR0ZXIuYXBwbHkodGhpcyk7XHJcblx0XHR0aGlzLmVsID0gZWw7XHJcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xyXG5cclxuXHRcdHRoaXMuX2luaXRFdmVudHMoKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHR0aGlzLmVsLmlubmVySFRNTCA9IHRtcGwodGhpcy5kYXRhKTtcclxuXHJcblx0XHR0aGlzLmZvcm1FbCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignZm9ybScpO1xyXG5cdH1cclxuXHJcblx0cmVzZXQgKCkge1xyXG5cdFx0dGhpcy5mb3JtRWwucmVzZXQoKTtcclxuXHR9XHJcblxyXG5cdF9pbml0RXZlbnRzICgpIHtcclxuXHRcdHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5fb25TdWJtaXQuYmluZCh0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRfb25TdWJtaXQgKGV2ZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0bGV0IGZvcm1EYXRhID0gdGhpcy5fZ2V0Rm9ybURhdGEoKTtcclxuXHJcblx0XHR0aGlzLnRyaWdnZXIoJ3N1Ym1pdCcsIGZvcm1EYXRhKTtcclxuXHR9XHJcblxyXG5cdF9nZXRJbnB1dHMgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHRleHRhcmVhJyk7XHJcblx0fVxyXG5cclxuXHRfZ2V0Rm9ybURhdGEgKCkge1xyXG5cdFx0bGV0IGZvcm1EYXRhID0ge307XHJcblxyXG5cdFx0Wy4uLnRoaXMuX2dldElucHV0cygpXS5mb3JFYWNoKGlucHV0ID0+IHtcclxuXHRcdFx0Zm9ybURhdGFbaW5wdXQubmFtZV0gPSB7XHJcblx0XHRcdFx0dmFsdWU6IGlucHV0LnZhbHVlXHJcblx0XHRcdH07XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gZm9ybURhdGE7XHJcblx0fVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvZm9ybS9mb3JtLmpzIiwiaW1wb3J0IHRtcGwgZnJvbSAnLi9tZW51LnRtcGwucHVnJztcbmltcG9ydCAnLi9tZW51LmNzcyc7XG5cblxuZXhwb3J0IGNsYXNzIE1lbnUge1xuICAgIGNvbnN0cnVjdG9yICh7ZWwsIGRhdGEgPSB7fX0pIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdG1wbCh0aGlzLmRhdGEpO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL21lbnUvbWVudS5qcyIsImV4cG9ydCBmdW5jdGlvbiBFbWl0dGVyICgpIHtcblxuICAgIC8qKlxuXHQgKiDQktGL0LfQvtCyINC+0LHRgNCw0LHQvtGC0YfQuNC60L7QsiDRgdC+0LHRi9GC0LjQuVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBldmVudCBuYW1lXG5cdCAqIEBwYXJhbSB7Kn0gZGF0YSBldmVudCBwYXlsb2FkXG5cdCAqL1xuXHR0aGlzLnRyaWdnZXIgPSBmdW5jdGlvbiAobmFtZSwgZGF0YSkge1xuXHRcdGlmICh0aGlzLl9fY2FsbGJhY2tzICYmIHRoaXMuX19jYWxsYmFja3NbbmFtZV0pIHtcblx0XHRcdHRoaXMuX19jYWxsYmFja3NbbmFtZV0uZm9yRWFjaChjYiA9PiBjYi5jYWxsKHRoaXMsIGRhdGEpKTtcblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0L7QsdGA0LDQsdC+0YLRh9C40LrQsCDRgdC+0LHRi9GC0LjRj1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBldmVudCBuYW1lXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIGNhbGxiYWNrXG5cdCAqL1xuXHR0aGlzLm9uID0gZnVuY3Rpb24gKG5hbWUsIGNiKSB7XG5cdFx0aWYgKCF0aGlzLl9fY2FsbGJhY2tzKSB7XG5cdFx0XHR0aGlzLl9fY2FsbGJhY2tzID0ge307XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLl9fY2FsbGJhY2tzW25hbWVdKSB7XG5cdFx0XHR0aGlzLl9fY2FsbGJhY2tzW25hbWVdID0gW107XG5cdFx0fVxuXG5cdFx0dGhpcy5fX2NhbGxiYWNrc1tuYW1lXS5wdXNoKGNiKTtcblx0fTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9mcmFtZXdvcmsvZW1pdHRlci5qcyIsImltcG9ydCB7ZGVlcEVxdWFsfSBmcm9tICcuLi9mcmFtZXdvcmsvdXRpbHMnO1xyXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJy4uL2ZyYW1ld29yay9lbWl0dGVyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGF0U2VydmljZSB7XHJcblxyXG5cdGNvbnN0cnVjdG9yICh7YmFzZVVybCwgcG9sbGluZ0ludGVydmFsID0gMTUwMDAsIGh0dHB9KSB7XHJcblx0XHRFbWl0dGVyLmFwcGx5KHRoaXMpO1xyXG5cclxuXHRcdHRoaXMucG9sbGluZ0ludGVydmFsID0gcG9sbGluZ0ludGVydmFsO1xyXG5cdFx0dGhpcy5odHRwID0gaHR0cDtcclxuXHJcblx0XHR0aGlzLmh0dHAuc2V0QmFzZVVybChiYXNlVXJsKTtcclxuXHJcblx0XHR0aGlzLl9fbWVzc2FnZXMgPSBbXTtcclxuXHRcdHRoaXMuX19wb2xsaW5nSUQgPSBudWxsO1xyXG5cdFx0dGhpcy5fX2xhc3RSZXFUaW1lID0gbnVsbDtcclxuXHRcdHRoaXMuX191c2VybmFtZSA9ICdhbm9uaW11cyc7XHJcblx0fVxyXG5cclxuXHRzZXRVc2VyTmFtZSAobmFtZSkge1xyXG5cdFx0dGhpcy5fX3VzZXJuYW1lID0gbmFtZTtcclxuXHR9XHJcblxyXG5cdGdldFVzZXJOYW1lICgpIHtcclxuXHRcdHJldHVybiB0aGlzLl9fdXNlcm5hbWU7XHJcblx0fVxyXG5cclxuXHRnZXRNZXNzYWdlcyAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5odHRwLm1ha2VSZXF1ZXN0KClcclxuXHRcdFx0LnRoZW4ocmVzcCA9PiBPYmplY3QudmFsdWVzKHJlc3AuZGF0YSkpO1xyXG5cdH1cclxuXHJcblx0c2VuZE1lc3NhZ2UgKGRhdGEpIHtcclxuXHRcdGRhdGEuZGF0ZSA9IERhdGUubm93KCk7XHJcblx0XHRkYXRhLm5hbWUgPSB0aGlzLl9fdXNlcm5hbWU7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuaHR0cC5tYWtlUmVxdWVzdCgnUE9TVCcsIGRhdGEpXHJcblx0XHRcdC50aGVuKHJlc3AgPT4gcmVzcC5kYXRhKTtcclxuXHR9XHJcblxyXG5cdHN0YXJ0UG9sbGluZyAoKSB7XHJcblx0XHRsZXQgZG9SZXF1ZXN0ID0gKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmdldE1lc3NhZ2VzKCkudGhlbihtZXNzYWdlcyA9PiB7XHJcblx0XHRcdFx0dGhpcy5zZXRNZXNzYWdlcyhtZXNzYWdlcyk7XHJcblx0XHRcdFx0dGhpcy5fX3BvbGxpbmdJRCA9IHNldFRpbWVvdXQoZG9SZXF1ZXN0LCB0aGlzLnBvbGxpbmdJbnRlcnZhbCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHRkb1JlcXVlc3QoKTtcclxuXHR9XHJcblxyXG5cdHN0b3BQb2xsaW5nICgpIHtcclxuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5fX3BvbGxpbmdJRCk7XHJcblx0fVxyXG5cclxuXHRzZXRNZXNzYWdlcyAobWVzc2FnZXMpIHtcclxuXHRcdGlmIChkZWVwRXF1YWwodGhpcy5fbWVzc2FnZXMsIG1lc3NhZ2VzKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fbWVzc2FnZXMgPSBtZXNzYWdlcztcclxuXHRcdHRoaXMudHJpZ2dlcignbWVzc2FnZXMnLCB0aGlzLl9tZXNzYWdlcyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzc1xyXG5cdCAqIEBzdGF0aWMgXHJcblx0ICovXHJcblx0c3RhdGljIGdldEluc3RhbmNlICguLi5yZXN0KSB7XHJcblx0XHRpZiAoIXRoaXMuX19pbnN0YW5jZSkge1xyXG5cdFx0XHR0aGlzLl9faW5zdGFuY2UgPSBuZXcgdGhpcyguLi5yZXN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fX2luc3RhbmNlO1xyXG5cdH1cclxuXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvY2hhdC5zZXJ2aWNlLmpzIiwiZXhwb3J0IGNsYXNzIFJvdXRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih7bm9kZSwgaGlzdG9yeX0pIHtcbiAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5oaXN0b3J5ID0gaGlzdG9yeTtcblxuICAgICAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0LzQsNGA0YjRgNGD0YLQsFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByb3V0ZVxuICAgICAqIEBwYXJhbSB7QmFzZVZpZXd9IHZpZXdcbiAgICAgKi9cbiAgICByZWdpc3Rlcihyb3V0ZSwgdmlldykge1xuICAgICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0gPSB2aWV3O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCS0YvQsdC+0YAgVmlldyDQv9C+INC80LDRgNGI0YDRg9GC0YNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGVcbiAgICAgKiBAcmV0dXJucyB7QmFzZVZpZXd9XG4gICAgICovXG4gICAgX2dldFZpZXdCeVJvdXRlKHJvdXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvdXRlc1tyb3V0ZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7QsdGA0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPINC60LvQuNC60LAg0L/QviDRgdGB0YvQu9C60LVcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgb25Sb3V0ZUNoYW5nZShldmVudCkge1xuXG4gICAgICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ28oZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpKSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCX0LDQv9GD0YHRgtC40YLRjCDQv9GA0L7RhtC10YEg0LzQsNGA0YjRgNGD0YLQuNC30LDRhtC40LhcbiAgICAgKi9cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5ub2RlXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB0aGlzLm9uUm91dGVDaGFuZ2UoZXZlbnQpKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBfID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ28obG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9C10YDQtdGC0LjQuSDQv9C+INC80LDRgNGI0YDRg9GC0YNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtINC10YHQu9C4INC10YHRgtGMINC80LDRgNGI0YDRg9GA0YJcbiAgICAgKi9cbiAgICBnbyhwYXRoKSB7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5fZ2V0Vmlld0J5Um91dGUocGF0aCk7XG5cbiAgICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VmlldyA9PT0gdmlldykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2aWV3LnNob3coKTtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIHBhdGgpO1xuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHZpZXc7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2ZyYW1ld29yay9yb3V0ZXIuanMiLCJpbXBvcnQge0NoYXRWaWV3fSBmcm9tICcuL2NoYXQudmlldyc7XG5pbXBvcnQge0xvZ2luVmlld30gZnJvbSAnLi9sb2dpbi52aWV3JztcbmltcG9ydCB7TWFpblZpZXd9IGZyb20gJy4vbWFpbi52aWV3JztcblxuZXhwb3J0IGRlZmF1bHQge0NoYXQ6IENoYXRWaWV3LCBNYWluOiBNYWluVmlldywgTG9naW46IExvZ2luVmlld307XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvaW5kZXguanMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9hcHAuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vYXBwLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9hcHAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWlsbGlncmFtLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9taWxsaWdyYW0uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbWlsbGlncmFtLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L21pbGxpZ3JhbS9kaXN0L21pbGxpZ3JhbS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxyXG5pbXBvcnQgdG1wbCBmcm9tICcuL2NoYXQudG1wbC5wdWcnO1xyXG5pbXBvcnQgJy4vY2hhdC5jc3MnO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENoYXREYXRhXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1c2VyIC0g0LjQvNGPINGC0LXQutGD0YnQtdCz0L4g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8Q2hhdE1lc3NhZ2U+fSBtZXNzYWdlcyAtINC80LDRgdGB0Lgg0YHQvtC+0LHRidC10L3QuNC5INCyINGH0LDRgtC1XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENoYXRNZXNzYWdlXHJcbiAqXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0ZXh0IC0g0KLQtdC60YHRgiDRgdC+0L7QsdGJ0LXQvdC40Y9cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgLSDQuNC80Y8g0L7RgtC/0YDQsNCy0LjRgtC10LvRjyDRgdC+0L7QsdGJ0LXQvdC40Y9cclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhdCB7XHJcblx0Y29uc3RydWN0b3Ioe1xyXG5cdFx0XHRlbCxcclxuXHRcdFx0ZGF0YSA9IHttZXNzYWdlczogW119LFxyXG5cdFx0XHRhdmF0YXJTZXJ2aWNlLFxyXG5cdFx0XHRjaGF0U2VydmljZVxyXG5cdFx0fSkge1xyXG5cdFx0dGhpcy5lbCA9IGVsO1xyXG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcclxuXHJcblx0XHR0aGlzLmF2YXRhclNlcnZpY2UgPSBhdmF0YXJTZXJ2aWNlO1xyXG5cdFx0dGhpcy5jaGF0U2VydmljZSA9IGNoYXRTZXJ2aWNlO1xyXG5cclxuXHRcdHRoaXMuX2luaXRFdmVudHMoKTtcclxuXHR9XHJcblxyXG5cdF9pbml0RXZlbnRzICgpIHtcclxuXHRcdHRoaXMuY2hhdFNlcnZpY2Uub24oJ21lc3NhZ2VzJywgdGhpcy5fb25NZXNzYWdlcy5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdHJlbmRlciAoKSB7XHJcblx0XHR0aGlzLl9zYXZlU2Nyb2xsVG9wKCk7XHJcblx0XHR0aGlzLmVsLmlubmVySFRNTCA9IHRtcGwodGhpcy5kYXRhKTtcclxuXHRcdHRoaXMuX3Jlc3RvcmVTY3JvbGxUb3AoKTtcclxuXHR9XHJcblxyXG5cdF9vbk1lc3NhZ2VzIChtZXNzYWdlcykge1xyXG5cdFx0dGhpcy5zZXRNZXNzYWdlcyhtZXNzYWdlcyk7XHJcblx0XHR0aGlzLnJlbmRlcigpO1xyXG5cdH1cclxuXHJcblx0X3NhdmVTY3JvbGxUb3AgKCkge1xyXG5cdFx0bGV0IGNoYXRCb3ggPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5jaGF0X19ib3gnKTtcclxuXHJcblx0XHRpZiAoY2hhdEJveCkge1xyXG5cdFx0XHR0aGlzLl9zY3JvbGxUb3AgPSBjaGF0Qm94LnNjcm9sbFRvcDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdF9yZXN0b3JlU2Nyb2xsVG9wICgpIHtcclxuXHRcdGxldCBjaGF0Qm94ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuY2hhdF9fYm94Jyk7XHJcblxyXG5cdFx0aWYgKGNoYXRCb3gpIHtcclxuXHRcdFx0Y2hhdEJveC5zY3JvbGxUb3AgPSB0aGlzLl9zY3JvbGxUb3A7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRfdXBkYXRlTWVzc2FnZXMgKCkge1xyXG5cdFx0dGhpcy5kYXRhLm1lc3NhZ2VzID0gdGhpcy5kYXRhLm1lc3NhZ2VzLnNvcnQoKG1lc3NhZ2UxLCBtZXNzYWdlMikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gbWVzc2FnZTIuZGF0ZSAtIG1lc3NhZ2UxLmRhdGU7XHJcblx0XHR9KTtcdFxyXG5cdH1cclxuXHJcblx0c2V0TWVzc2FnZXMgKG1lc3NhZ2VzID0gW10pIHtcclxuXHRcdHRoaXMuZGF0YS5tZXNzYWdlcy5sZW5ndGggPSAwO1xyXG5cdFx0dGhpcy5hZGQobWVzc2FnZXMpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog0JzQsNGB0YHQvtCy0L7QtSDQtNC+0LHQsNCy0LvQtdC90LjQtSDRgdC+0L7QsdGJ0LXQvdC40LlcclxuXHQgKiBAcGFyYW0ge0FycmF5PENoYXRNZXNzYWdlcz59IG1lc3NhZ2VzXHJcblx0ICovXHJcblx0YWRkIChtZXNzYWdlcyA9IFtdKSB7XHJcblx0XHRsZXQgYWRkT25lTWVzc2FnZU1ldGhvZCA9IHRoaXMuYWRkT25lLmJpbmQodGhpcyk7XHJcblxyXG5cdFx0bWVzc2FnZXMuZm9yRWFjaChhZGRPbmVNZXNzYWdlTWV0aG9kKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqINCU0L7QsdCw0LLQuNGC0Ywg0L3QvtCy0L7QtSDRgdC+0L7QsdGJ0LXQvdC40LUg0LIg0YfQsNGCXHJcblx0ICogQHBhcmFtIHtDaGF0TWVzc2FnZX0gZGF0YVxyXG5cdCAqL1xyXG5cdGFkZE9uZSAoZGF0YSkge1xyXG5cdFx0dGhpcy5kYXRhLm1lc3NhZ2VzLnB1c2godGhpcy5fcHJlcGFyZU1lc3NhZ2UoZGF0YSkpO1xyXG5cdH1cclxuXHJcblx0X3ByZXBhcmVNZXNzYWdlICh7YXZhdGFyLCBuYW1lLCB0ZXh0LCBkYXRlID0gRGF0ZS5ub3coKX0pIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGF2YXRhcjogdGhpcy5hdmF0YXJTZXJ2aWNlLmdldEF2YXRhcihuYW1lKSxcclxuXHRcdFx0bmFtZSxcclxuXHRcdFx0aXNNaW5lOiBuYW1lID09PSB0aGlzLmRhdGEudXNlcixcclxuXHRcdFx0dGV4dCxcclxuXHRcdFx0ZGF0ZTogbmV3IERhdGUoZGF0ZSlcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRgtC10LrRg9GJ0LXQs9C+INGO0LfQtdGA0LBcclxuXHQgKi9cclxuXHRzZXRVc2VyTmFtZSAobmFtZSkge1xyXG5cdFx0dGhpcy5kYXRhLnVzZXIgPSBuYW1lO1xyXG5cdH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL2NoYXQvY2hhdC5qcyIsImltcG9ydCAnbWlsbGlncmFtL2Rpc3QvbWlsbGlncmFtLmNzcyc7XG5pbXBvcnQgJy4vY29tcG9uZW50cy9hcHAvYXBwLmNzcyc7XG5cbmltcG9ydCB7Um91dGVyfSBmcm9tICcuL2ZyYW1ld29yay9yb3V0ZXInO1xuaW1wb3J0IHtjYXBpdGFsaXplfSBmcm9tICcuL2ZyYW1ld29yay91dGlscyc7XG5cbmltcG9ydCB2aWV3cyBmcm9tICcuL3ZpZXdzJztcblxuY29uc3QgYXBwRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXBwJyk7XG5cbmNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuICAgIG5vZGU6IGFwcEVsLFxuICAgIGhpc3Rvcnk6IHdpbmRvdy5oaXN0b3J5XG59KTtcblxuWydtYWluJywgJ2NoYXQnLCAnbG9naW4nXS5mb3JFYWNoKHZpZXdOYW1lID0+IHtcbiAgICBsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZXQgVmlldyA9IHZpZXdzW2NhcGl0YWxpemUodmlld05hbWUpXTtcblxuICAgIGVsLmNsYXNzTGlzdC5hZGQodmlld05hbWUpO1xuICAgIGVsLmhpZGRlbiA9IHRydWU7XG4gICAgYXBwRWwuYXBwZW5kQ2hpbGQoZWwpO1xuXG4gICAgcm91dGVyLnJlZ2lzdGVyKGAvJHt2aWV3TmFtZX1gLCBuZXcgVmlldyh7IGVsLCByb3V0ZXIgfSkpO1xufSk7XG5cbnJvdXRlci5nbygnL21haW4nKTtcbnJvdXRlci5zdGFydCgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW4uanMiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vc3R5bGUtbG9hZGVyL2ZpeFVybHMuanMiLCJleHBvcnQgY2xhc3MgQXZhdGFyU2VydmljZSB7XHJcblxyXG5cdGNvbnN0cnVjdG9yICgpIHtcclxuXHRcdHRoaXMuX2F2YXRhcnMgPSB7XHJcblx0XHRcdCdUaW0nOiAnaHR0cDovL2kuaW1ndXIuY29tL0ZITW5zVk50LmpwZycsXHJcblx0XHRcdCdNYXR0JzogJy8vMS5ncmF2YXRhci5jb20vYXZhdGFyLzc2N2ZjOWMxMTVhMWI5ODk3NDRjNzU1ZGI0N2ZlYjYwP3M9MjAwJnI9cGcmZD1tbSdcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5fZGVmYXVsdEF2YXRhciA9ICdodHRwczovL3Vuc3BsYXNoLml0LzIwMC8yMDAvP3JhbmRvbSc7XHJcblx0fVxyXG5cclxuXHRnZXRBdmF0YXIgKG5hbWUgPSAnJykge1xyXG5cdFx0aWYgKCF0aGlzLl9hdmF0YXJzW25hbWVdKSB7XHJcblx0XHRcdHRoaXMuX2F2YXRhcnNbbmFtZV0gPSB0aGlzLl9kZWZhdWx0QXZhdGFyICsgYD0ke01hdGgucmFuZG9tKCl9YDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fYXZhdGFyc1tuYW1lXTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRJbnN0YW5jZSAoLi4ucmVzdCkge1xyXG5cdFx0cmV0dXJuIG5ldyB0aGlzKC4uLnJlc3QpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NlcnZpY2VzL2F2YXRhci5zZXJ2aWNlLmpzIiwiZXhwb3J0IGNsYXNzIEh0dHBTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7fVxuXG4gICAgLyoqXG4gICAgICogU2V0dGluZyB0aGUgYmFzZSBVUkwgZm9yIHJlcXVlc3RzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgICAqL1xuICAgIHNldEJhc2VVcmwgKHVybCkge1xuICAgICAgICB0aGlzLmJhc2VVcmwgPSB1cmw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFraW5nIGEgSFRUUCByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgc3BlY2lmaWVkIGEgSFRUUCBtZXRob2RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBzcGVjaWZpZWQgYSBib2R5IG9mIHJlcXVlc3RcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cblx0bWFrZVJlcXVlc3QgKHR5cGUgPSAnR0VUJywgZGF0YSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3Blbih0eXBlLCB0aGlzLmJhc2VVcmwsIHRydWUpO1xuXG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICAgICAgeGhyXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCByZWplY3QpO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgcmVqZWN0KTtcblxuICAgICAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICB9KTtcblx0fVxuXG4gICAgc3RhdGljIGdldEluc3RhbmNlICguLi5yZXN0KSB7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKC4uLnJlc3QpO1xuXHR9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2VydmljZXMvaHR0cC5zZXJ2aWNlLmpzIiwiaW1wb3J0IHtCYXNlVmlld30gZnJvbSAnLi4vZnJhbWV3b3JrL3ZpZXcnO1xuXG5pbXBvcnQge0NoYXR9IGZyb20gJy4uL2NvbXBvbmVudHMvY2hhdC9jaGF0JztcbmltcG9ydCB7Rm9ybX0gZnJvbSAnLi4vY29tcG9uZW50cy9mb3JtL2Zvcm0nO1xuaW1wb3J0IHtBdmF0YXJTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9hdmF0YXIuc2VydmljZSc7XG5pbXBvcnQge0NoYXRTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9jaGF0LnNlcnZpY2UnO1xuaW1wb3J0IHtIdHRwU2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvaHR0cC5zZXJ2aWNlJztcblxuXG5jb25zdCBjaGF0U2VydmljZSA9IENoYXRTZXJ2aWNlLmdldEluc3RhbmNlKHtcblx0YmFzZVVybDogJ2h0dHBzOi8vY29tcG9uZW50cy1lMmU2ZS5maXJlYmFzZWlvLmNvbS9jaGF0L21lc3NhZ2VzL2lrZXRhcmkuanNvbicsXG5cdGh0dHA6IEh0dHBTZXJ2aWNlLmdldEluc3RhbmNlKCksXG5cdHBvbGxpbmdJbnRlcnZhbDogMTAwMFxufSk7XG5cbmNvbnN0IGF2YXRhclNlcnZpY2UgPSBBdmF0YXJTZXJ2aWNlLmdldEluc3RhbmNlKCk7XG5cbmV4cG9ydCBjbGFzcyBDaGF0VmlldyBleHRlbmRzIEJhc2VWaWV3IHtcbiAgICBjb25zdHJ1Y3RvciAoLi4ucmVzdCkge1xuICAgICAgICBzdXBlciguLi5yZXN0KTtcblxuICAgICAgICB0aGlzLl9jcmVhdGVDb21wb25lbnRzKCk7XG5cdFx0dGhpcy5faW5pdE1lZGlhdGUoKTtcblxuXHRcdHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5jaGF0LmVsKTtcblx0XHR0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuZm9ybS5lbCk7XG5cblx0XHR0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHJlbmRlciAoKSB7XG5cdFx0dGhpcy5jaGF0LnJlbmRlcigpO1xuXHRcdHRoaXMuZm9ybS5yZW5kZXIoKTtcblx0fVxuXG5cdF9jcmVhdGVDb21wb25lbnRzICgpIHtcblx0XHR0aGlzLmNoYXQgPSBuZXcgQ2hhdCh7XG5cdFx0XHRlbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRhdmF0YXJTZXJ2aWNlLFxuXHRcdFx0Y2hhdFNlcnZpY2Vcblx0XHR9KTtcblxuXHRcdHRoaXMuZm9ybSA9IG5ldyBGb3JtKHtcblx0XHRcdGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB3aWRnZXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ3RleHRhcmVhJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ21lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAn0JLQstC10LTQuNGC0LUg0YHQvtC+0LHRidC10L3QuNC1Li4uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICfQntGC0L/RgNCw0LLQuNGC0YwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZzogJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXI6ICfQktGL0LnRgtC4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiAnL21haW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuXHRcdH0pO1xuXHR9XG5cblx0X2luaXRNZWRpYXRlICgpIHtcblx0XHR0aGlzLmZvcm0ub24oJ3N1Ym1pdCcsIChmb3JtRGF0YSkgPT4ge1xuXHRcdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRcdHRleHQ6IGZvcm1EYXRhLm1lc3NhZ2UudmFsdWVcblx0XHRcdH07XG5cblx0XHRcdGNoYXRTZXJ2aWNlLnNlbmRNZXNzYWdlKGRhdGEpO1xuXHRcdFx0Ly8gdGhpcy5jaGF0LmFkZE9uZShkYXRhKTtcblxuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9KTtcblxuXHRcdGNoYXRTZXJ2aWNlLnN0YXJ0UG9sbGluZygpO1xuXHR9XG5cblx0YWRkTWVzc2FnZSAoZGF0YSkge1xuXHRcdHRoaXMuY2hhdC5hZGRPbmUoZGF0YSk7XG5cdH1cblxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdmlld3MvY2hhdC52aWV3LmpzIiwiaW1wb3J0IHtCYXNlVmlld30gZnJvbSAnLi4vZnJhbWV3b3JrL3ZpZXcnO1xuXG5pbXBvcnQge0Zvcm19IGZyb20gJy4uL2NvbXBvbmVudHMvZm9ybS9mb3JtJztcbmltcG9ydCB7TWVudX0gZnJvbSAnLi4vY29tcG9uZW50cy9tZW51L21lbnUnO1xuXG5pbXBvcnQge0NoYXRTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9jaGF0LnNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgTG9naW5WaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yICguLi5yZXN0KSB7XG4gICAgICAgIHN1cGVyKC4uLnJlc3QpO1xuXG4gICAgICAgIHRoaXMubWVudSA9IG5ldyBNZW51KHtcbiAgICAgICAgICAgIGVsOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ9CQ0LLRgtC+0YDQuNC30LDRhtC40Y8nLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvcm0gPSBuZXcgRm9ybSh7XG4gICAgICAgICAgICBlbDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgd2lkZ2V0czogW1xuICAgICAgICAgICAgICAgICAgICB7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd1c2VybmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICfQmNC80Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPLi4uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWc6ICdpbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICfQktC+0LnRgtC4J1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMubWVudS5lbCk7XG4gICAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5mb3JtLmVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZm9ybS5yZW5kZXIoKTtcbiAgICAgICAgdGhpcy5tZW51LnJlbmRlcigpO1xuXG4gICAgICAgIHRoaXMuX2luaXRNZWRpYXRlKCk7XG4gICAgfVxuXG4gICAgX2luaXRNZWRpYXRlICgpIHtcbiAgICAgICAgdGhpcy5mb3JtLm9uKCdzdWJtaXQnLCBmb3JtRGF0YSA9PiB7XG4gICAgICAgICAgICBsZXQgY2hhdFNlcnZpY2UgPSBDaGF0U2VydmljZS5nZXRJbnN0YW5jZSgpO1xuXG4gICAgICAgICAgICBjaGF0U2VydmljZS5zZXRVc2VyTmFtZShmb3JtRGF0YS51c2VybmFtZS52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5nbygnL2NoYXQnKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ZpZXdzL2xvZ2luLnZpZXcuanMiLCJpbXBvcnQge0Jhc2VWaWV3fSBmcm9tICcuLi9mcmFtZXdvcmsvdmlldyc7XG5cbmltcG9ydCB7TWVudX0gZnJvbSAnLi4vY29tcG9uZW50cy9tZW51L21lbnUnO1xuXG5leHBvcnQgY2xhc3MgTWFpblZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG4gICAgY29uc3RydWN0b3IgKC4uLnJlc3QpIHtcbiAgICAgICAgc3VwZXIoLi4ucmVzdCk7XG5cbiAgICAgICAgdGhpcy5tZW51ID0gbmV3IE1lbnUoe1xuICAgICAgICAgICAgZWw6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnU2luZ2xlIFBhZ2UgQ2hhdCcsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgICAge2hyZWY6ICcvbG9naW4nLCB0ZXh0OiAn0JLQvtC50YLQuCd9LFxuICAgICAgICAgICAgICAgICAgICB7aHJlZjogJy9jaGF0JywgdGV4dDogJ9Cn0LDRgid9LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLm1lbnUuZWwpO1xuICAgICAgICB0aGlzLm1lbnUucmVuZGVyKCk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ZpZXdzL21haW4udmlldy5qcyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIioge1xcclxcbiAgZm9udC1mYW1pbHk6J0hlbHZldGljYSBOZXVlJyxIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxyXFxuICBmb250LXNpemU6IDE0cHg7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxufVxcclxcblxcclxcbi5hcHAge1xcclxcblxcdHdpZHRoOiA0MDBweDtcXHJcXG5cXHRtYXJnaW46MCBhdXRvO1xcclxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5jaGF0X19jb250YWluZXIge1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBkaXNwbGF5OmJsb2NrO1xcclxcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmhlYWRlcntcXHJcXG4gIHBhZGRpbmc6MjBweCAyMHB4IDE4cHggMjBweDtcXHJcXG4gIGJhY2tncm91bmQ6IzliNGRjYTtcXHJcXG4gIGNvbG9yOiNmZmY7XFxyXFxufVxcclxcbi5oZWFkZXIgaDJ7XFxyXFxuICBmb250LXNpemU6MTZweDtcXHJcXG4gIGxpbmUtaGVpZ2h0OjE1cHg7XFxyXFxuICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG4gIGxldHRlci1zcGFjaW5nOiAwLjA1ZW07XFxyXFxufVxcclxcbi5oZWFkZXIgYXtcXHJcXG4gIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xcclxcbiAgZmxvYXQ6cmlnaHQ7XFxyXFxuICBiYWNrZ3JvdW5kOiMzZDhiNGU7XFxyXFxuICBmb250LXNpemU6MjVweDtcXHJcXG4gIGxpbmUtaGVpZ2h0OjIwcHg7XFxyXFxuICBwYWRkaW5nOjNweCA2cHg7XFxyXFxuICBtYXJnaW4tdG9wOi01cHg7XFxyXFxuICBib3JkZXItcmFkaXVzOjJweDtcXHJcXG59XFxyXFxuXFxyXFxuLmNoYXRfX2JveCB7XFxyXFxuICBiYWNrZ3JvdW5kOiAjRUNFQ0VDO1xcclxcbiAgcGFkZGluZzogMCAyMHB4O1xcclxcbiAgY29sb3I6ICNhMWExYTE7XFxyXFxuICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbiAgaGVpZ2h0OiA2MHZoO1xcclxcbn1cXHJcXG5cXHJcXG4uY2hhdF9fYm94IC5tZXNzYWdlLWJveHtcXHJcXG4gIHBhZGRpbmc6MThweCAwIDEwcHg7XFxyXFxuICBjbGVhcjpib3RoO1xcclxcbn1cXHJcXG4ubWVzc2FnZS1ib3ggLnBpY3R1cmV7XFxyXFxuICBmbG9hdDpsZWZ0O1xcclxcbiAgd2lkdGg6NTBweDtcXHJcXG4gIGRpc3BsYXk6YmxvY2s7XFxyXFxuICBwYWRkaW5nLXJpZ2h0OjEwcHg7XFxyXFxufVxcclxcbi5waWN0dXJlIGltZ3tcXHJcXG4gIHdpZHRoOjQzcHg7XFxyXFxuICBoZWlnaHQ6NDNweDtcXHJcXG4gIGJvcmRlci1yYWRpdXM6NXB4O1xcclxcbn1cXHJcXG4ucGljdHVyZSBzcGFuIHtcXHJcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgZm9udC1zaXplOiAxMHB4O1xcclxcbiAgY2xlYXI6IGJvdGg7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gIG1hcmdpbi10b3A6IDNweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2V7XFxyXFxuICBiYWNrZ3JvdW5kOiNmZmY7XFxyXFxuICBkaXNwbGF5OmlubGluZS1ibG9jaztcXHJcXG4gIHBhZGRpbmc6MTNweDtcXHJcXG4gIHdpZHRoOjI3NHB4O1xcclxcbiAgYm9yZGVyLXJhZGl1czoycHg7XFxyXFxuICBib3gtc2hhZG93OiAwIDFweCAxcHggcmdiYSgwLDAsMCwuMDQpO1xcclxcbiAgcG9zaXRpb246cmVsYXRpdmU7XFxyXFxufVxcclxcbi5tZXNzYWdlOmJlZm9yZXtcXHJcXG4gIGNvbnRlbnQ6XFxcIlxcXCI7XFxyXFxuICBwb3NpdGlvbjphYnNvbHV0ZTtcXHJcXG4gIGRpc3BsYXk6YmxvY2s7XFxyXFxuICBsZWZ0OjA7XFxyXFxuICBib3JkZXItcmlnaHQ6NnB4IHNvbGlkICNmZmY7XFxyXFxuICBib3JkZXItdG9wOiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItYm90dG9tOjZweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIHRvcDoxMHB4O1xcclxcbiAgbWFyZ2luLWxlZnQ6LTZweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2Ugc3BhbntcXHJcXG4gIGNvbG9yOiM1NTU7XFxyXFxuICBmb250LXdlaWdodDpib2xkO1xcclxcbn1cXHJcXG4ubWVzc2FnZSBwe1xcclxcbiAgcGFkZGluZy10b3A6NXB4O1xcclxcbn1cXHJcXG4ubWVzc2FnZS1ib3gucmlnaHQtaW1nIC5waWN0dXJle1xcclxcbiAgZmxvYXQ6cmlnaHQ7XFxyXFxuICBwYWRkaW5nOjA7XFxyXFxuICBwYWRkaW5nLWxlZnQ6MTBweDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94LnJpZ2h0LWltZyAucGljdHVyZSBpbWd7XFxyXFxuICBmbG9hdDpyaWdodDtcXHJcXG59XFxyXFxuLm1lc3NhZ2UtYm94LnJpZ2h0LWltZyAubWVzc2FnZTpiZWZvcmV7XFxyXFxuICBsZWZ0OjEwMCU7XFxyXFxuICBtYXJnaW4tcmlnaHQ6NnB4O1xcclxcbiAgbWFyZ2luLWxlZnQ6MDtcXHJcXG4gIGJvcmRlci1yaWdodDo2cHggc29saWQgdHJhbnNwYXJlbnQ7XFxyXFxuICBib3JkZXItbGVmdDo2cHggc29saWQgI2ZmZjtcXHJcXG4gIGJvcmRlci10b3A6IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcXHJcXG4gIGJvcmRlci1ib3R0b206NnB4IHNvbGlkIHRyYW5zcGFyZW50O1xcclxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL2NvbXBvbmVudHMvY2hhdC9jaGF0LmNzc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9jb21wb25lbnRzL2Zvcm0vZm9ybS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vY29tcG9uZW50cy9tZW51L21lbnUuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi8qIVxcbiAqIE1pbGxpZ3JhbSB2MS4zLjBcXG4gKiBodHRwczovL21pbGxpZ3JhbS5naXRodWIuaW9cXG4gKlxcbiAqIENvcHlyaWdodCAoYykgMjAxNyBDSiBQYXRvaWxvXFxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXFxuICovXFxuXFxuKixcXG4qOmFmdGVyLFxcbio6YmVmb3JlIHtcXG4gIGJveC1zaXppbmc6IGluaGVyaXQ7XFxufVxcblxcbmh0bWwge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGZvbnQtc2l6ZTogNjIuNSU7XFxufVxcblxcbmJvZHkge1xcbiAgY29sb3I6ICM2MDZjNzY7XFxuICBmb250LWZhbWlseTogJ1JvYm90bycsICdIZWx2ZXRpY2EgTmV1ZScsICdIZWx2ZXRpY2EnLCAnQXJpYWwnLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxLjZlbTtcXG4gIGZvbnQtd2VpZ2h0OiAzMDA7XFxuICBsZXR0ZXItc3BhY2luZzogLjAxZW07XFxuICBsaW5lLWhlaWdodDogMS42O1xcbn1cXG5cXG5ibG9ja3F1b3RlIHtcXG4gIGJvcmRlci1sZWZ0OiAwLjNyZW0gc29saWQgI2QxZDFkMTtcXG4gIG1hcmdpbi1sZWZ0OiAwO1xcbiAgbWFyZ2luLXJpZ2h0OiAwO1xcbiAgcGFkZGluZzogMXJlbSAxLjVyZW07XFxufVxcblxcbmJsb2NrcXVvdGUgKjpsYXN0LWNoaWxkIHtcXG4gIG1hcmdpbi1ib3R0b206IDA7XFxufVxcblxcbi5idXR0b24sXFxuYnV0dG9uLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10sXFxuaW5wdXRbdHlwZT0nc3VibWl0J10ge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzliNGRjYTtcXG4gIGJvcmRlcjogMC4xcmVtIHNvbGlkICM5YjRkY2E7XFxuICBib3JkZXItcmFkaXVzOiAuNHJlbTtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgZm9udC1zaXplOiAxLjFyZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgaGVpZ2h0OiAzLjhyZW07XFxuICBsZXR0ZXItc3BhY2luZzogLjFyZW07XFxuICBsaW5lLWhlaWdodDogMy44cmVtO1xcbiAgcGFkZGluZzogMCAzLjByZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG59XFxuXFxuLmJ1dHRvbjpmb2N1cywgLmJ1dHRvbjpob3ZlcixcXG5idXR0b246Zm9jdXMsXFxuYnV0dG9uOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddOmZvY3VzLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjA2Yzc2O1xcbiAgYm9yZGVyLWNvbG9yOiAjNjA2Yzc2O1xcbiAgY29sb3I6ICNmZmY7XFxuICBvdXRsaW5lOiAwO1xcbn1cXG5cXG4uYnV0dG9uW2Rpc2FibGVkXSxcXG5idXR0b25bZGlzYWJsZWRdLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddW2Rpc2FibGVkXSxcXG5pbnB1dFt0eXBlPSdyZXNldCddW2Rpc2FibGVkXSxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXVtkaXNhYmxlZF0ge1xcbiAgY3Vyc29yOiBkZWZhdWx0O1xcbiAgb3BhY2l0eTogLjU7XFxufVxcblxcbi5idXR0b25bZGlzYWJsZWRdOmZvY3VzLCAuYnV0dG9uW2Rpc2FibGVkXTpob3ZlcixcXG5idXR0b25bZGlzYWJsZWRdOmZvY3VzLFxcbmJ1dHRvbltkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ11bZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdyZXNldCddW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdyZXNldCddW2Rpc2FibGVkXTpob3ZlcixcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0nc3VibWl0J11bZGlzYWJsZWRdOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM5YjRkY2E7XFxuICBib3JkZXItY29sb3I6ICM5YjRkY2E7XFxufVxcblxcbi5idXR0b24uYnV0dG9uLW91dGxpbmUsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmUsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tb3V0bGluZTpmb2N1cywgLmJ1dHRvbi5idXR0b24tb3V0bGluZTpob3ZlcixcXG5idXR0b24uYnV0dG9uLW91dGxpbmU6Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lOmZvY3VzLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLW91dGxpbmU6Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZTpob3ZlcixcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tb3V0bGluZTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogIzYwNmM3NjtcXG4gIGNvbG9yOiAjNjA2Yzc2O1xcbn1cXG5cXG4uYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cywgLmJ1dHRvbi5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cyxcXG5idXR0b24uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tb3V0bGluZVtkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLW91dGxpbmVbZGlzYWJsZWRdOmZvY3VzLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1vdXRsaW5lW2Rpc2FibGVkXTpob3ZlciB7XFxuICBib3JkZXItY29sb3I6IGluaGVyaXQ7XFxuICBjb2xvcjogIzliNGRjYTtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tY2xlYXIsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcixcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGNvbG9yOiAjOWI0ZGNhO1xcbn1cXG5cXG4uYnV0dG9uLmJ1dHRvbi1jbGVhcjpmb2N1cywgLmJ1dHRvbi5idXR0b24tY2xlYXI6aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcjpmb2N1cyxcXG5idXR0b24uYnV0dG9uLWNsZWFyOmhvdmVyLFxcbmlucHV0W3R5cGU9J2J1dHRvbiddLmJ1dHRvbi1jbGVhcjpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXI6aG92ZXIsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXI6Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncmVzZXQnXS5idXR0b24tY2xlYXI6aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyOmZvY3VzLFxcbmlucHV0W3R5cGU9J3N1Ym1pdCddLmJ1dHRvbi1jbGVhcjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBjb2xvcjogIzYwNmM3NjtcXG59XFxuXFxuLmJ1dHRvbi5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmZvY3VzLCAuYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06Zm9jdXMsXFxuYnV0dG9uLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nYnV0dG9uJ10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdidXR0b24nXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyLFxcbmlucHV0W3R5cGU9J3Jlc2V0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdyZXNldCddLmJ1dHRvbi1jbGVhcltkaXNhYmxlZF06aG92ZXIsXFxuaW5wdXRbdHlwZT0nc3VibWl0J10uYnV0dG9uLWNsZWFyW2Rpc2FibGVkXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzdWJtaXQnXS5idXR0b24tY2xlYXJbZGlzYWJsZWRdOmhvdmVyIHtcXG4gIGNvbG9yOiAjOWI0ZGNhO1xcbn1cXG5cXG5jb2RlIHtcXG4gIGJhY2tncm91bmQ6ICNmNGY1ZjY7XFxuICBib3JkZXItcmFkaXVzOiAuNHJlbTtcXG4gIGZvbnQtc2l6ZTogODYlO1xcbiAgbWFyZ2luOiAwIC4ycmVtO1xcbiAgcGFkZGluZzogLjJyZW0gLjVyZW07XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbn1cXG5cXG5wcmUge1xcbiAgYmFja2dyb3VuZDogI2Y0ZjVmNjtcXG4gIGJvcmRlci1sZWZ0OiAwLjNyZW0gc29saWQgIzliNGRjYTtcXG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcXG59XFxuXFxucHJlID4gY29kZSB7XFxuICBib3JkZXItcmFkaXVzOiAwO1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwYWRkaW5nOiAxcmVtIDEuNXJlbTtcXG4gIHdoaXRlLXNwYWNlOiBwcmU7XFxufVxcblxcbmhyIHtcXG4gIGJvcmRlcjogMDtcXG4gIGJvcmRlci10b3A6IDAuMXJlbSBzb2xpZCAjZjRmNWY2O1xcbiAgbWFyZ2luOiAzLjByZW0gMDtcXG59XFxuXFxuaW5wdXRbdHlwZT0nZW1haWwnXSxcXG5pbnB1dFt0eXBlPSdudW1iZXInXSxcXG5pbnB1dFt0eXBlPSdwYXNzd29yZCddLFxcbmlucHV0W3R5cGU9J3NlYXJjaCddLFxcbmlucHV0W3R5cGU9J3RlbCddLFxcbmlucHV0W3R5cGU9J3RleHQnXSxcXG5pbnB1dFt0eXBlPSd1cmwnXSxcXG50ZXh0YXJlYSxcXG5zZWxlY3Qge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgICAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xcbiAgICAgICAgICBhcHBlYXJhbmNlOiBub25lO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXI6IDAuMXJlbSBzb2xpZCAjZDFkMWQxO1xcbiAgYm9yZGVyLXJhZGl1czogLjRyZW07XFxuICBib3gtc2hhZG93OiBub25lO1xcbiAgYm94LXNpemluZzogaW5oZXJpdDtcXG4gIGhlaWdodDogMy44cmVtO1xcbiAgcGFkZGluZzogLjZyZW0gMS4wcmVtO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbmlucHV0W3R5cGU9J2VtYWlsJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0nbnVtYmVyJ106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ncGFzc3dvcmQnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSdzZWFyY2gnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSd0ZWwnXTpmb2N1cyxcXG5pbnB1dFt0eXBlPSd0ZXh0J106Zm9jdXMsXFxuaW5wdXRbdHlwZT0ndXJsJ106Zm9jdXMsXFxudGV4dGFyZWE6Zm9jdXMsXFxuc2VsZWN0OmZvY3VzIHtcXG4gIGJvcmRlci1jb2xvcjogIzliNGRjYTtcXG4gIG91dGxpbmU6IDA7XFxufVxcblxcbnNlbGVjdCB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBoZWlnaHQ9XFxcIjE0XFxcIiB2aWV3Qm94PVxcXCIwIDAgMjkgMTRcXFwiIHdpZHRoPVxcXCIyOVxcXCI+PHBhdGggZmlsbD1cXFwiI2QxZDFkMVxcXCIgZD1cXFwiTTkuMzc3MjcgMy42MjVsNS4wODE1NCA2LjkzNTIzTDE5LjU0MDM2IDMuNjI1XFxcIi8+PC9zdmc+JykgY2VudGVyIHJpZ2h0IG5vLXJlcGVhdDtcXG4gIHBhZGRpbmctcmlnaHQ6IDMuMHJlbTtcXG59XFxuXFxuc2VsZWN0OmZvY3VzIHtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIGhlaWdodD1cXFwiMTRcXFwiIHZpZXdCb3g9XFxcIjAgMCAyOSAxNFxcXCIgd2lkdGg9XFxcIjI5XFxcIj48cGF0aCBmaWxsPVxcXCIjOWI0ZGNhXFxcIiBkPVxcXCJNOS4zNzcyNyAzLjYyNWw1LjA4MTU0IDYuOTM1MjNMMTkuNTQwMzYgMy42MjVcXFwiLz48L3N2Zz4nKTtcXG59XFxuXFxudGV4dGFyZWEge1xcbiAgbWluLWhlaWdodDogNi41cmVtO1xcbn1cXG5cXG5sYWJlbCxcXG5sZWdlbmQge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBmb250LXNpemU6IDEuNnJlbTtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBtYXJnaW4tYm90dG9tOiAuNXJlbTtcXG59XFxuXFxuZmllbGRzZXQge1xcbiAgYm9yZGVyLXdpZHRoOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuaW5wdXRbdHlwZT0nY2hlY2tib3gnXSxcXG5pbnB1dFt0eXBlPSdyYWRpbyddIHtcXG4gIGRpc3BsYXk6IGlubGluZTtcXG59XFxuXFxuLmxhYmVsLWlubGluZSB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgbWFyZ2luLWxlZnQ6IC41cmVtO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgbWF4LXdpZHRoOiAxMTIuMHJlbTtcXG4gIHBhZGRpbmc6IDAgMi4wcmVtO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBwYWRkaW5nOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5yb3cucm93LW5vLXBhZGRpbmcge1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLnJvdy5yb3ctbm8tcGFkZGluZyA+IC5jb2x1bW4ge1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLnJvdy5yb3ctd3JhcCB7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxufVxcblxcbi5yb3cucm93LXRvcCB7XFxuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXG59XFxuXFxuLnJvdy5yb3ctYm90dG9tIHtcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcXG59XFxuXFxuLnJvdy5yb3ctY2VudGVyIHtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5yb3cucm93LXN0cmV0Y2gge1xcbiAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XFxufVxcblxcbi5yb3cucm93LWJhc2VsaW5lIHtcXG4gIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcXG59XFxuXFxuLnJvdyAuY29sdW1uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZmxleDogMSAxIGF1dG87XFxuICBtYXJnaW4tbGVmdDogMDtcXG4gIG1heC13aWR0aDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0xMCB7XFxuICBtYXJnaW4tbGVmdDogMTAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0yMCB7XFxuICBtYXJnaW4tbGVmdDogMjAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0yNSB7XFxuICBtYXJnaW4tbGVmdDogMjUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC0zMywgLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtMzQge1xcbiAgbWFyZ2luLWxlZnQ6IDMzLjMzMzMlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC01MCB7XFxuICBtYXJnaW4tbGVmdDogNTAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC02NiwgLnJvdyAuY29sdW1uLmNvbHVtbi1vZmZzZXQtNjcge1xcbiAgbWFyZ2luLWxlZnQ6IDY2LjY2NjYlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC03NSB7XFxuICBtYXJnaW4tbGVmdDogNzUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC04MCB7XFxuICBtYXJnaW4tbGVmdDogODAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLW9mZnNldC05MCB7XFxuICBtYXJnaW4tbGVmdDogOTAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTEwIHtcXG4gIGZsZXg6IDAgMCAxMCU7XFxuICBtYXgtd2lkdGg6IDEwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi0yMCB7XFxuICBmbGV4OiAwIDAgMjAlO1xcbiAgbWF4LXdpZHRoOiAyMCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tMjUge1xcbiAgZmxleDogMCAwIDI1JTtcXG4gIG1heC13aWR0aDogMjUlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTMzLCAucm93IC5jb2x1bW4uY29sdW1uLTM0IHtcXG4gIGZsZXg6IDAgMCAzMy4zMzMzJTtcXG4gIG1heC13aWR0aDogMzMuMzMzMyU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNDAge1xcbiAgZmxleDogMCAwIDQwJTtcXG4gIG1heC13aWR0aDogNDAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTUwIHtcXG4gIGZsZXg6IDAgMCA1MCU7XFxuICBtYXgtd2lkdGg6IDUwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi02MCB7XFxuICBmbGV4OiAwIDAgNjAlO1xcbiAgbWF4LXdpZHRoOiA2MCU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tNjYsIC5yb3cgLmNvbHVtbi5jb2x1bW4tNjcge1xcbiAgZmxleDogMCAwIDY2LjY2NjYlO1xcbiAgbWF4LXdpZHRoOiA2Ni42NjY2JTtcXG59XFxuXFxuLnJvdyAuY29sdW1uLmNvbHVtbi03NSB7XFxuICBmbGV4OiAwIDAgNzUlO1xcbiAgbWF4LXdpZHRoOiA3NSU7XFxufVxcblxcbi5yb3cgLmNvbHVtbi5jb2x1bW4tODAge1xcbiAgZmxleDogMCAwIDgwJTtcXG4gIG1heC13aWR0aDogODAlO1xcbn1cXG5cXG4ucm93IC5jb2x1bW4uY29sdW1uLTkwIHtcXG4gIGZsZXg6IDAgMCA5MCU7XFxuICBtYXgtd2lkdGg6IDkwJTtcXG59XFxuXFxuLnJvdyAuY29sdW1uIC5jb2x1bW4tdG9wIHtcXG4gIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi5yb3cgLmNvbHVtbiAuY29sdW1uLWJvdHRvbSB7XFxuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDtcXG59XFxuXFxuLnJvdyAuY29sdW1uIC5jb2x1bW4tY2VudGVyIHtcXG4gIC1tcy1ncmlkLXJvdy1hbGlnbjogY2VudGVyO1xcbiAgICAgIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuQG1lZGlhIChtaW4td2lkdGg6IDQwcmVtKSB7XFxuICAucm93IHtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAgbWFyZ2luLWxlZnQ6IC0xLjByZW07XFxuICAgIHdpZHRoOiBjYWxjKDEwMCUgKyAyLjByZW0pO1xcbiAgfVxcbiAgLnJvdyAuY29sdW1uIHtcXG4gICAgbWFyZ2luLWJvdHRvbTogaW5oZXJpdDtcXG4gICAgcGFkZGluZzogMCAxLjByZW07XFxuICB9XFxufVxcblxcbmEge1xcbiAgY29sb3I6ICM5YjRkY2E7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcbmE6Zm9jdXMsIGE6aG92ZXIge1xcbiAgY29sb3I6ICM2MDZjNzY7XFxufVxcblxcbmRsLFxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgcGFkZGluZy1sZWZ0OiAwO1xcbn1cXG5cXG5kbCBkbCxcXG5kbCBvbCxcXG5kbCB1bCxcXG5vbCBkbCxcXG5vbCBvbCxcXG5vbCB1bCxcXG51bCBkbCxcXG51bCBvbCxcXG51bCB1bCB7XFxuICBmb250LXNpemU6IDkwJTtcXG4gIG1hcmdpbjogMS41cmVtIDAgMS41cmVtIDMuMHJlbTtcXG59XFxuXFxub2wge1xcbiAgbGlzdC1zdHlsZTogZGVjaW1hbCBpbnNpZGU7XFxufVxcblxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IGNpcmNsZSBpbnNpZGU7XFxufVxcblxcbi5idXR0b24sXFxuYnV0dG9uLFxcbmRkLFxcbmR0LFxcbmxpIHtcXG4gIG1hcmdpbi1ib3R0b206IDEuMHJlbTtcXG59XFxuXFxuZmllbGRzZXQsXFxuaW5wdXQsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcXG59XFxuXFxuYmxvY2txdW90ZSxcXG5kbCxcXG5maWd1cmUsXFxuZm9ybSxcXG5vbCxcXG5wLFxcbnByZSxcXG50YWJsZSxcXG51bCB7XFxuICBtYXJnaW4tYm90dG9tOiAyLjVyZW07XFxufVxcblxcbnRhYmxlIHtcXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbnRkLFxcbnRoIHtcXG4gIGJvcmRlci1ib3R0b206IDAuMXJlbSBzb2xpZCAjZTFlMWUxO1xcbiAgcGFkZGluZzogMS4ycmVtIDEuNXJlbTtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxufVxcblxcbnRkOmZpcnN0LWNoaWxkLFxcbnRoOmZpcnN0LWNoaWxkIHtcXG4gIHBhZGRpbmctbGVmdDogMDtcXG59XFxuXFxudGQ6bGFzdC1jaGlsZCxcXG50aDpsYXN0LWNoaWxkIHtcXG4gIHBhZGRpbmctcmlnaHQ6IDA7XFxufVxcblxcbmIsXFxuc3Ryb25nIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG5wIHtcXG4gIG1hcmdpbi10b3A6IDA7XFxufVxcblxcbmgxLFxcbmgyLFxcbmgzLFxcbmg0LFxcbmg1LFxcbmg2IHtcXG4gIGZvbnQtd2VpZ2h0OiAzMDA7XFxuICBsZXR0ZXItc3BhY2luZzogLS4xcmVtO1xcbiAgbWFyZ2luLWJvdHRvbTogMi4wcmVtO1xcbiAgbWFyZ2luLXRvcDogMDtcXG59XFxuXFxuaDEge1xcbiAgZm9udC1zaXplOiA0LjZyZW07XFxuICBsaW5lLWhlaWdodDogMS4yO1xcbn1cXG5cXG5oMiB7XFxuICBmb250LXNpemU6IDMuNnJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjI1O1xcbn1cXG5cXG5oMyB7XFxuICBmb250LXNpemU6IDIuOHJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjM7XFxufVxcblxcbmg0IHtcXG4gIGZvbnQtc2l6ZTogMi4ycmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IC0uMDhyZW07XFxuICBsaW5lLWhlaWdodDogMS4zNTtcXG59XFxuXFxuaDUge1xcbiAgZm9udC1zaXplOiAxLjhyZW07XFxuICBsZXR0ZXItc3BhY2luZzogLS4wNXJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjU7XFxufVxcblxcbmg2IHtcXG4gIGZvbnQtc2l6ZTogMS42cmVtO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDA7XFxuICBsaW5lLWhlaWdodDogMS40O1xcbn1cXG5cXG5pbWcge1xcbiAgbWF4LXdpZHRoOiAxMDAlO1xcbn1cXG5cXG4uY2xlYXJmaXg6YWZ0ZXIge1xcbiAgY2xlYXI6IGJvdGg7XFxuICBjb250ZW50OiAnICc7XFxuICBkaXNwbGF5OiB0YWJsZTtcXG59XFxuXFxuLmZsb2F0LWxlZnQge1xcbiAgZmxvYXQ6IGxlZnQ7XFxufVxcblxcbi5mbG9hdC1yaWdodCB7XFxuICBmbG9hdDogcmlnaHQ7XFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vfi9taWxsaWdyYW0vZGlzdC9taWxsaWdyYW0uY3NzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAobWVzc2FnZXMsIHVzZXIpIHtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2IGNsYXNzPVxcXCJjaGF0XFxcIlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjaGF0X19jb250YWluZXJcXFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcImhlYWRlclxcXCJcXHUwMDNFXFx1MDAzQ2gyXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9ICfQlNC+0LHRgNC+INC/0L7QttCw0LvQvtCy0LDRgtGMICcgKyAodXNlciB8fCAnJykpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoMlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJjaGF0X19ib3hcXFwiXFx1MDAzRVwiO1xuaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NoM1xcdTAwM0XQn9C+0LrQsCDQvdC10YIg0YHQvtC+0LHRidC10L3QuNC5XFx1MDAzQ1xcdTAwMkZoM1xcdTAwM0VcIjtcbn1cbi8vIGl0ZXJhdGUgbWVzc2FnZXNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gbWVzc2FnZXM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJCRsOyBwdWdfaW5kZXgwKyspIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAkJG9ialtwdWdfaW5kZXgwXTtcbnB1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0NkaXZcIiArIChwdWcuYXR0cihcImNsYXNzXCIsIHB1Zy5jbGFzc2VzKFtcIm1lc3NhZ2UtYm94XCIsbWVzc2FnZS5pc01pbmUgPyAnbGVmdC1pbWcnIDogJ3JpZ2h0LWltZyddLCBbZmFsc2UsdHJ1ZV0pLCBmYWxzZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXFx1MDAzQ2RpdiBjbGFzcz1cXFwicGljdHVyZVxcXCJcXHUwMDNFXFx1MDAzQ2ltZ1wiICsgKHB1Zy5hdHRyKFwic3JjXCIsIG1lc3NhZ2UuYXZhdGFyLCB0cnVlLCB0cnVlKStcIiB0aXRsZT1cXFwibmFtZSBvZiB1c2VyXFxcIlwiKSArIFwiXFx1MDAzRVxcdTAwM0NzcGFuIGNsYXNzPVxcXCJ0aW1lXFxcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLmRhdGUgJiYgbWVzc2FnZS5kYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMF0pID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NcXHUwMDJGZGl2XFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcIm1lc3NhZ2VcXFwiXFx1MDAzRVxcdTAwM0NzcGFuXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UubmFtZSkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnNwYW5cXHUwMDNFXFx1MDAzQ3BcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS50ZXh0KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGcFxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjtcbiAgICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBwdWdfaW5kZXgwIGluICQkb2JqKSB7XG4gICAgICAkJGwrKztcbiAgICAgIHZhciBtZXNzYWdlID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDZGl2XCIgKyAocHVnLmF0dHIoXCJjbGFzc1wiLCBwdWcuY2xhc3NlcyhbXCJtZXNzYWdlLWJveFwiLG1lc3NhZ2UuaXNNaW5lID8gJ2xlZnQtaW1nJyA6ICdyaWdodC1pbWcnXSwgW2ZhbHNlLHRydWVdKSwgZmFsc2UsIHRydWUpKSArIFwiXFx1MDAzRVxcdTAwM0NkaXYgY2xhc3M9XFxcInBpY3R1cmVcXFwiXFx1MDAzRVxcdTAwM0NpbWdcIiArIChwdWcuYXR0cihcInNyY1wiLCBtZXNzYWdlLmF2YXRhciwgdHJ1ZSwgdHJ1ZSkrXCIgdGl0bGU9XFxcIm5hbWUgb2YgdXNlclxcXCJcIikgKyBcIlxcdTAwM0VcXHUwMDNDc3BhbiBjbGFzcz1cXFwidGltZVxcXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gbWVzc2FnZS5kYXRlICYmIG1lc3NhZ2UuZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzBdKSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGc3BhblxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIlxcdTAwM0VcXHUwMDNDc3BhblxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBtZXNzYWdlLm5hbWUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZzcGFuXFx1MDAzRVxcdTAwM0NwXFx1MDAzRVwiICsgKHB1Zy5lc2NhcGUobnVsbCA9PSAocHVnX2ludGVycCA9IG1lc3NhZ2UudGV4dCkgPyBcIlwiIDogcHVnX2ludGVycCkpICsgXCJcXHUwMDNDXFx1MDAyRnBcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXFx1MDAzQ1xcdTAwMkZkaXZcXHUwMDNFXCI7XG4gICAgfVxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcXHUwMDNDXFx1MDAyRmRpdlxcdTAwM0VcIjt9LmNhbGwodGhpcyxcIm1lc3NhZ2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tZXNzYWdlczp0eXBlb2YgbWVzc2FnZXMhPT1cInVuZGVmaW5lZFwiP21lc3NhZ2VzOnVuZGVmaW5lZCxcInVzZXJcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXI6dHlwZW9mIHVzZXIhPT1cInVuZGVmaW5lZFwiP3VzZXI6dW5kZWZpbmVkKSk7O3JldHVybiBwdWdfaHRtbDt9O1xubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvY2hhdC9jaGF0LnRtcGwucHVnXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcHVnID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvcHVnLXJ1bnRpbWUvaW5kZXguanNcIik7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge3ZhciBwdWdfaHRtbCA9IFwiXCIsIHB1Z19taXhpbnMgPSB7fSwgcHVnX2ludGVycDs7dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAod2lkZ2V0cykge3B1Z19odG1sID0gcHVnX2h0bWwgKyBcIlxcdTAwM0Nmb3JtXFx1MDAzRVwiO1xuLy8gaXRlcmF0ZSB3aWRnZXRzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IHdpZGdldHM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBwdWdfaW5kZXgwID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBwdWdfaW5kZXgwIDwgJCRsOyBwdWdfaW5kZXgwKyspIHtcbiAgICAgICAgdmFyIHdpZGdldCA9ICQkb2JqW3B1Z19pbmRleDBdO1xudmFyIHRhZ05hbWUgPSB3aWRnZXQudGFnIHx8ICdpbnB1dCdcbnZhciBpbm5lciA9IHdpZGdldC5pbm5lciB8fCAnJ1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1wiICsgKHRhZ05hbWUpICsgKHB1Zy5hdHRycyh3aWRnZXQuYXR0cmlidXRlcywgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaW5uZXIpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZcIiArICh0YWdOYW1lKSArIFwiXFx1MDAzRVwiO1xuICAgICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyIHB1Z19pbmRleDAgaW4gJCRvYmopIHtcbiAgICAgICQkbCsrO1xuICAgICAgdmFyIHdpZGdldCA9ICQkb2JqW3B1Z19pbmRleDBdO1xudmFyIHRhZ05hbWUgPSB3aWRnZXQudGFnIHx8ICdpbnB1dCdcbnZhciBpbm5lciA9IHdpZGdldC5pbm5lciB8fCAnJ1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1wiICsgKHRhZ05hbWUpICsgKHB1Zy5hdHRycyh3aWRnZXQuYXR0cmlidXRlcywgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaW5uZXIpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZcIiArICh0YWdOYW1lKSArIFwiXFx1MDAzRVwiO1xuICAgIH1cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZmb3JtXFx1MDAzRVwiO30uY2FsbCh0aGlzLFwid2lkZ2V0c1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgud2lkZ2V0czp0eXBlb2Ygd2lkZ2V0cyE9PVwidW5kZWZpbmVkXCI/d2lkZ2V0czp1bmRlZmluZWQpKTs7cmV0dXJuIHB1Z19odG1sO307XG5tb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9mb3JtL2Zvcm0udG1wbC5wdWdcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBwdWcgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9wdWctcnVudGltZS9pbmRleC5qc1wiKTtcblxuZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7dmFyIHB1Z19odG1sID0gXCJcIiwgcHVnX21peGlucyA9IHt9LCBwdWdfaW50ZXJwOzt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpdGVtcywgdGl0bGUpIHtwdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDaDFcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gdGl0bGUpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZoMVxcdTAwM0VcXHUwMDNDdWxcXHUwMDNFXCI7XG4vLyBpdGVyYXRlIGl0ZW1zXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IGl0ZW1zO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgcHVnX2luZGV4MCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgcHVnX2luZGV4MCA8ICQkbDsgcHVnX2luZGV4MCsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gJCRvYmpbcHVnX2luZGV4MF07XG5wdWdfaHRtbCA9IHB1Z19odG1sICsgXCJcXHUwMDNDbGlcXHUwMDNFXFx1MDAzQ2FcIiArIChwdWcuYXR0cihcImhyZWZcIiwgaXRlbS5ocmVmLCB0cnVlLCB0cnVlKSkgKyBcIlxcdTAwM0VcIiArIChwdWcuZXNjYXBlKG51bGwgPT0gKHB1Z19pbnRlcnAgPSBpdGVtLnRleHQpID8gXCJcIiA6IHB1Z19pbnRlcnApKSArIFwiXFx1MDAzQ1xcdTAwMkZhXFx1MDAzRVxcdTAwM0NcXHUwMDJGbGlcXHUwMDNFXCI7XG4gICAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgcHVnX2luZGV4MCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7XG4gICAgICB2YXIgaXRlbSA9ICQkb2JqW3B1Z19pbmRleDBdO1xucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ2xpXFx1MDAzRVxcdTAwM0NhXCIgKyAocHVnLmF0dHIoXCJocmVmXCIsIGl0ZW0uaHJlZiwgdHJ1ZSwgdHJ1ZSkpICsgXCJcXHUwMDNFXCIgKyAocHVnLmVzY2FwZShudWxsID09IChwdWdfaW50ZXJwID0gaXRlbS50ZXh0KSA/IFwiXCIgOiBwdWdfaW50ZXJwKSkgKyBcIlxcdTAwM0NcXHUwMDJGYVxcdTAwM0VcXHUwMDNDXFx1MDAyRmxpXFx1MDAzRVwiO1xuICAgIH1cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxucHVnX2h0bWwgPSBwdWdfaHRtbCArIFwiXFx1MDAzQ1xcdTAwMkZ1bFxcdTAwM0VcIjt9LmNhbGwodGhpcyxcIml0ZW1zXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pdGVtczp0eXBlb2YgaXRlbXMhPT1cInVuZGVmaW5lZFwiP2l0ZW1zOnVuZGVmaW5lZCxcInRpdGxlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC50aXRsZTp0eXBlb2YgdGl0bGUhPT1cInVuZGVmaW5lZFwiP3RpdGxlOnVuZGVmaW5lZCkpOztyZXR1cm4gcHVnX2h0bWw7fTtcbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL21lbnUvbWVudS50bXBsLnB1Z1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vY2hhdC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9jaGF0LmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9jaGF0LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL2NoYXQvY2hhdC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL2Zvcm0uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZm9ybS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4vZm9ybS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29tcG9uZW50cy9mb3JtL2Zvcm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9tZW51LmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21lbnUuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21lbnUuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2NvbXBvbmVudHMvbWVudS9tZW51LmNzc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogKGlnbm9yZWQpICovXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZnMgKGlnbm9yZWQpXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9