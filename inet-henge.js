(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"), require("cola"));
	else if(typeof define === 'function' && define.amd)
		define(["d3", "cola"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("d3"), require("cola")) : factory(root["d3"], root["cola"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, (__WEBPACK_EXTERNAL_MODULE_d3__, __WEBPACK_EXTERNAL_MODULE_cola__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/charenc/charenc.js":
/*!*****************************************!*\
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
/***/ ((module) => {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "./node_modules/crypt/crypt.js":
/*!*************************************!*\
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
/***/ ((module) => {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/lodash.clonedeep/index.js":
/*!************************************************!*\
  !*** ./node_modules/lodash.clonedeep/index.js ***!
  \************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;


/***/ }),

/***/ "./node_modules/md5/md5.js":
/*!*********************************!*\
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "./node_modules/crypt/crypt.js"),
      utf8 = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").utf8),
      isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js"),
      bin = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").bin),

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "./src/bundle.ts":
/*!***********************!*\
  !*** ./src/bundle.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bundle": () => (/* binding */ Bundle)
/* harmony export */ });
class Bundle {
    constructor(links, id) {
        this.id = id;
        this.links = links;
        this.color = "#7a4e4e";
        this.width = 2;
        this.space = 4;
    }
    static divide(links) {
        Bundle.groups = {};
        for (const l of links) {
            if (l.bundle) {
                const key = this.groupKey(l);
                (Bundle.groups[key] || (Bundle.groups[key] = [])).push(l.id);
            }
        }
        return Object.values(Bundle.groups).map((ids, i) => {
            return new Bundle(ids.map((id) => links[id]), i);
        });
    }
    static groupKey(link) {
        return JSON.stringify([link.source, link.target, link.bundle]);
    }
    static render(linkLayer, // eslint-disable-line @typescript-eslint/no-explicit-any
    bundles) {
        const bundleGroup = linkLayer
            .selectAll(".bundle")
            .data(bundles)
            .enter()
            .append("g")
            .attr("class", (d) => d.class());
        const bundle = bundleGroup
            .append("path")
            .attr("d", (d) => d.d())
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", (d) => d.width)
            .attr("fill", "none")
            .attr("id", (d) => d.bundleId());
        return bundle;
    }
    static reset() {
        Bundle.groups = null;
    }
    // sort by bundle with preserving order
    static sortByBundle(links) {
        return links.sort((a, b) => {
            switch (true) {
                case !!a.bundle && !b.bundle:
                    return -1;
                case !a.bundle && !!b.bundle:
                    return 1;
                case !a.bundle && !b.bundle:
                    return 0;
                // !!a.bundle && !!b.bundle === true
                case a.bundle.toString() < b.bundle.toString():
                    return -1;
                case a.bundle.toString() > b.bundle.toString():
                    return 1;
                default:
                    return 0;
            }
        });
    }
    d() {
        const first = this.links[0].centerCoordinates();
        const last = this.links[this.links.length - 1].centerCoordinates();
        const gap = Math.sqrt(Math.pow(first[0] - last[0], 2) + Math.pow(first[1] - last[1], 2));
        if (gap === 0) {
            return "";
        }
        const angle = this.links[0].angle() + 90;
        const start = [
            ((first[0] - last[0]) * this.space) / gap + first[0],
            ((first[1] - last[1]) * this.space) / gap + first[1],
        ];
        const end = [
            ((last[0] - first[0]) * this.space) / gap + last[0],
            ((last[1] - first[1]) * this.space) / gap + last[1],
        ];
        return `M ${start[0]} ${start[1]} A ${gap / 2 + 10},5 ${angle} 1,0 ${end[0]} ${end[1]}`;
    }
    shiftMultiplier() {
        if (!this._shiftMultiplier) {
            const members = this.links[0].group() || [];
            this._shiftMultiplier = this.links.reduce((sum, l) => (sum += l.id - (members.length - 1) / 2), 0) / 2;
        }
        return this._shiftMultiplier;
    }
    static shiftBundle(bundle) {
        bundle.attr("d", (d) => d.d());
    }
    class() {
        // modified link's class
        return this.links[0].class().replace(/^link/, "bundle");
    }
    bundleId() {
        return `bundle${this.id}`;
    }
}


/***/ }),

/***/ "./src/group.ts":
/*!**********************!*\
  !*** ./src/group.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Group": () => (/* binding */ Group),
/* harmony export */   "GroupBase": () => (/* binding */ GroupBase)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.ts");


class GroupBase {
    constructor(name, options) {
        this.name = name;
        this.options = options;
        this.padding = options.padding;
    }
    transform() {
        return `translate(${this.bounds.x}, ${this.bounds.y})`;
    }
    groupWidth() {
        return this.bounds.width();
    }
    groupHeight() {
        return this.bounds.height();
    }
    static divide(nodes, pattern, options) {
        const groups = {};
        const register = (name, node, parent) => {
            const key = `${parent}:${name}`;
            groups[key] = groups[key] || new Group(name, options);
            // hacky but required due to WebCola implementation
            groups[key].push(node);
        };
        nodes.forEach((node) => {
            let result = null;
            if (pattern) {
                result = node.name.match(pattern);
                if (result) {
                    register(result[1] || result[0], node);
                }
            }
            // Node type based group
            node.group.forEach((name) => register(name, node, String(result)));
        });
        return Object.values(groups);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(layer, groups) {
        const group = layer
            .selectAll(".group")
            .data(groups)
            .enter()
            .append("g")
            .attr("class", (d) => `group ${(0,_util__WEBPACK_IMPORTED_MODULE_1__.classify)(d.name)}`)
            .attr("transform", (d) => d.transform());
        group
            .append("rect")
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("width", (d) => d.groupWidth())
            .attr("height", (d) => d.groupHeight())
            // Fix @types/d3/index.d.ts. Should be "d3.scale.Ordinal<number, string>" but "d3.scale.Ordinal<string, string>" somehow
            .style("fill", (d, i) => d.options.color(i.toString()));
        group.append("text").text((d) => d.name);
        return group;
    }
    static tick(group) {
        group.attr("transform", (d) => d.transform());
        group
            .selectAll("rect")
            .attr("width", (d) => d.groupWidth())
            .attr("height", (d) => d.groupHeight());
    }
    static setPosition(group, position) {
        group.attr("transform", (d, i) => {
            d.bounds.x = position[i].x;
            d.bounds.y = position[i].y;
            return d.transform();
        });
        group
            .selectAll("rect")
            .attr("width", (d, i) => position[i].width)
            .attr("height", (d, i) => position[i].height);
    }
}
const WebColable = (Base) => {
    class Group extends Base {
        constructor(name, options) {
            super(name, options);
            this.leaves = [];
        }
        push(node) {
            this.leaves.push(node.id);
        }
    }
    return Group;
};
const Eventable = (Base) => {
    class EventableGroup extends Base {
        constructor(name, options) {
            super(name, options);
            this.dispatch = d3__WEBPACK_IMPORTED_MODULE_0__.dispatch("rendered");
        }
        static render(layer, groups) {
            const group = super.render(layer, groups);
            group.each(function (d) {
                d.dispatch.rendered(this);
            });
            return group;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(name, callback) {
            this.dispatch.on(name, callback);
        }
    }
    return EventableGroup;
};
const Pluggable = (Base) => {
    class Group extends Base {
        constructor(name, options) {
            super(name, options);
            for (const constructor of Group.pluginConstructors) {
                // Call Pluggable at last as constructor may call methods defined in other classes
                constructor.bind(this)(name, options);
            }
        }
        static registerConstructor(func) {
            Group.pluginConstructors.push(func);
        }
    }
    Group.pluginConstructors = [];
    return Group;
};
class WebColableGroup extends WebColable(GroupBase) {
}
class EventableGroup extends Eventable(WebColableGroup) {
}
// Call Pluggable at last as constructor may call methods defined in other classes
class Group extends Pluggable(EventableGroup) {
}



/***/ }),

/***/ "./src/link.ts":
/*!*********************!*\
  !*** ./src/link.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Link": () => (/* binding */ Link),
/* harmony export */   "LinkBase": () => (/* binding */ LinkBase)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bundle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bundle */ "./src/bundle.ts");
/* harmony import */ var _meta_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./meta_data */ "./src/meta_data.ts");
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node */ "./src/node.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./src/util.ts");





class LinkBase {
    constructor(data, id, options) {
        this.id = id;
        this.options = options;
        this.source = _node__WEBPACK_IMPORTED_MODULE_3__.Node.idByName(data.source);
        this.target = _node__WEBPACK_IMPORTED_MODULE_3__.Node.idByName(data.target);
        this.bundle = data.bundle;
        this.metaList = new _meta_data__WEBPACK_IMPORTED_MODULE_2__.MetaData(data.meta).get(options.metaKeys);
        this.sourceMeta = new _meta_data__WEBPACK_IMPORTED_MODULE_2__.MetaData(data.meta, "source").get(options.metaKeys);
        this.targetMeta = new _meta_data__WEBPACK_IMPORTED_MODULE_2__.MetaData(data.meta, "target").get(options.metaKeys);
        this.extraClass = data.class || "";
        if (typeof options.linkWidth === "function")
            this.width = options.linkWidth(data.meta) || 3;
        else
            this.width = options.linkWidth || 3;
        this.defaultMargin = 15;
        this.labelXOffset = 20;
        this.labelYOffset = 1.5; // em
        this.color = "#7a4e4e";
        this.register(id);
    }
    register(id) {
        Link.groups = Link.groups || {};
        // source and target
        const key = [this.source, this.target].sort().toString();
        (Link.groups[key] || (Link.groups[key] = [])).push(id);
    }
    isLabelledPath() {
        return this.metaList.length > 0;
    }
    isReversePath() {
        return this.targetMeta.length > 0;
    }
    d() {
        return `M ${this.source.x} ${this.source.y} L ${this.target.x} ${this.target.y}`;
    }
    pathId() {
        return `path${this.id}`;
    }
    linkId() {
        return `link${this.id}`;
    }
    margin() {
        if (!this._margin) {
            const margin = window.getComputedStyle(document.getElementById(this.linkId())).margin;
            // NOTE: Assuming that window.getComputedStyle() returns some value link "10px"
            // or "0px" even when not defined in .css
            if (!margin || margin === "0px") {
                this._margin = this.defaultMargin;
            }
            else {
                this._margin = parseInt(margin);
            }
        }
        return this._margin;
    }
    group() {
        return Link.groups[[this.source.id, this.target.id].sort().toString()];
    }
    // OPTIMIZE: Implement better right-alignment of the path, especially for multi tspans
    tspanXOffset() {
        switch (true) {
            case this.isLabelledPath():
                return 0;
            case this.isReversePath():
                return -this.labelXOffset;
            default:
                return this.labelXOffset;
        }
    }
    tspanYOffset() {
        if (this.isLabelledPath())
            return `${-this.labelYOffset + 0.7}em`;
        else
            return `${this.labelYOffset}em`;
    }
    rotate(bbox) {
        if (this.source.x > this.target.x)
            return `rotate(180 ${bbox.x + bbox.width / 2} ${bbox.y + bbox.height / 2})`;
        else
            return "rotate(0)";
    }
    split() {
        if (!this.metaList && !this.sourceMeta && !this.targetMeta)
            return [this];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const meta = [];
        ["metaList", "sourceMeta", "targetMeta"].forEach((key, i, keys) => {
            if (this[key]) {
                const duped = Object.assign(Object.create(this), this);
                keys.filter((k) => k !== key).forEach((k) => (duped[k] = []));
                meta.push(duped);
            }
        });
        return meta;
    }
    hasMeta() {
        return this.metaList.length > 0 || this.sourceMeta.length > 0 || this.targetMeta.length > 0;
    }
    class() {
        // eslint-disable-next-line max-len
        return `link ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.source.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.target.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.source.name)}-${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.target.name)} ${this.extraClass}`;
    }
    // after transform is applied
    centerCoordinates() {
        const link = d3__WEBPACK_IMPORTED_MODULE_0__.select(`.link #${this.linkId()}`).node();
        const bbox = link.getBBox();
        const transform = link.transform.baseVal.consolidate();
        return [bbox.x + bbox.width / 2 + (transform === null || transform === void 0 ? void 0 : transform.matrix.e) || 0, bbox.y + bbox.height / 2 + (transform === null || transform === void 0 ? void 0 : transform.matrix.f) || 0];
    }
    angle() {
        const link = d3__WEBPACK_IMPORTED_MODULE_0__.select(`.link #${this.linkId()}`).node();
        return ((Math.atan2(link.y2.baseVal.value - link.y1.baseVal.value, link.x2.baseVal.value - link.x1.baseVal.value) * 180) /
            Math.PI);
    }
    static render(linkLayer, // eslint-disable-line @typescript-eslint/no-explicit-any
    labelLayer, // eslint-disable-line @typescript-eslint/no-explicit-any
    links) {
        // Render lines
        const pathGroup = linkLayer
            .selectAll(".link")
            .data(links)
            .enter()
            .append("g")
            .attr("class", (d) => d.class());
        const link = pathGroup
            .append("line")
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y)
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", (d) => d.width)
            .attr("id", (d) => d.linkId())
            .on("mouseover.line", (d) => textGroup.selectAll(`text.${d.pathId()}`).classed("hover", true))
            .on("mouseout.line", (d) => textGroup.selectAll(`text.${d.pathId()}`).classed("hover", false));
        const path = pathGroup
            .append("path")
            .attr("d", (d) => d.d())
            .attr("id", (d) => d.pathId());
        // Render texts
        const textGroup = labelLayer
            .selectAll(".link")
            .data(links)
            .enter()
            .append("g")
            .attr("class", (d) => d.class());
        const text = textGroup
            .selectAll("text")
            .data((d) => d.split().filter((l) => l.hasMeta()))
            .enter()
            .append("text")
            .attr("class", (d) => d.pathId()); // Bind text with pathId as class
        const textPath = text.append("textPath").attr("xlink:href", (d) => `#${d.pathId()}`);
        textPath.each(function (d) {
            Link.appendMetaText(this, d.metaList);
            Link.appendMetaText(this, d.sourceMeta);
            Link.appendMetaText(this, d.targetMeta);
            if (d.isLabelledPath())
                Link.center(this);
            if (d.isReversePath())
                Link.theOtherEnd(this);
        });
        Link.zoom(); // Initialize
        return [link, path, text];
    }
    static theOtherEnd(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container).attr("class", "reverse").attr("text-anchor", "end").attr("startOffset", "100%");
    }
    static center(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container).attr("class", "center").attr("text-anchor", "middle").attr("startOffset", "50%");
    }
    static appendMetaText(container, meta) {
        meta.forEach((m) => {
            d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
                .append("tspan")
                .attr("x", (d) => d.tspanXOffset())
                .attr("dy", (d) => d.tspanYOffset())
                .attr("class", m.class)
                .text(m.value);
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static tick(link, path, label) {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);
        if (path)
            path.attr("d", (d) => d.d());
        if (label)
            label.attr("transform", function (d) {
                return d.rotate(this.getBBox());
            });
    }
    static zoom(scale) {
        let visibility = "hidden";
        if (scale && scale > 1.5)
            visibility = "visible";
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".link text").style("visibility", visibility);
    }
    static setPosition(link, position) {
        link
            .attr("x1", (d, i) => position[i].x1)
            .attr("y1", (d, i) => position[i].y1)
            .attr("x2", (d, i) => position[i].x2)
            .attr("y2", (d, i) => position[i].y2);
    }
    shiftMultiplier() {
        if (!this._shiftMultiplier) {
            const members = this.group() || [];
            this._shiftMultiplier = members.indexOf(this.id) - (members.length - 1) / 2;
        }
        return this._shiftMultiplier;
    }
    static shiftBundle(link, path, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label, bundle) {
        const transform = (d) => d.shiftBundle(d.shiftMultiplier());
        link.attr("transform", transform);
        path.attr("transform", transform);
        label.attr("transform", transform);
        _bundle__WEBPACK_IMPORTED_MODULE_1__.Bundle.shiftBundle(bundle);
    }
    shiftBundle(multiplier) {
        const gap = this.margin() * multiplier;
        const x = this.target.x - this.source.x;
        const y = this.target.y - this.source.y;
        const length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return `translate(${(-gap * y) / length}, ${(gap * x) / length})`;
    }
    static reset() {
        Link.groups = null;
    }
}
const Eventable = (Base) => {
    class EventableLink extends Base {
        constructor(data, id, options) {
            super(data, id, options);
            this.dispatch = d3__WEBPACK_IMPORTED_MODULE_0__.dispatch("rendered");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        static render(linkLayer, labelLayer, links) {
            const [link, path, text] = super.render(linkLayer, labelLayer, links);
            link.each(function (d) {
                d.dispatch.rendered(this);
            });
            return [link, path, text];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(name, callback) {
            this.dispatch.on(name, callback);
        }
    }
    return EventableLink;
};
const Pluggable = (Base) => {
    class Link extends Base {
        constructor(data, id, options) {
            super(data, id, options);
            for (const constructor of Link.pluginConstructors) {
                // Call Pluggable at last as constructor may call methods defined in other classes
                constructor.bind(this)(data, id, options);
            }
        }
        static registerConstructor(func) {
            Link.pluginConstructors.push(func);
        }
    }
    Link.pluginConstructors = [];
    return Link;
};
class EventableLink extends Eventable(LinkBase) {
}
// Call Pluggable at last as constructor may call methods defined in other classes
class Link extends Pluggable(EventableLink) {
}



/***/ }),

/***/ "./src/link_tooltip.ts":
/*!*****************************!*\
  !*** ./src/link_tooltip.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkTooltip": () => (/* binding */ LinkTooltip)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tooltip */ "./src/tooltip.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



class LinkTooltip extends _tooltip__WEBPACK_IMPORTED_MODULE_1__.Tooltip {
    constructor(link, eventType) {
        super(eventType, { offsetX: 10 });
        this.link = link;
    }
    transform() {
        const [x, y] = this.link.centerCoordinates();
        return `translate(${x}, ${y})`;
    }
    objectId(escape = false) {
        let id = (0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(this.link.linkId());
        if (escape) {
            id = CSS.escape(id);
        }
        return id;
    }
    static appendText(container) {
        const path = d3__WEBPACK_IMPORTED_MODULE_0__.select(container).append("path");
        const text = d3__WEBPACK_IMPORTED_MODULE_0__.select(container).append("text");
        LinkTooltip.appendNameValue(text, "source", (d) => d.link.source.name);
        text.each(function (d) {
            d.link.sourceMeta.forEach((m, i) => {
                LinkTooltip.appendNameValue(text, m.class, m.value, false);
            });
        });
        LinkTooltip.appendNameValue(text, "target", (d) => d.link.source.name, true);
        text.each(function (d) {
            d.link.targetMeta.forEach((m, i) => {
                LinkTooltip.appendNameValue(text, m.class, m.value, false);
            });
        });
        text.each(function (d) {
            d.link.metaList.forEach((m, i) => {
                LinkTooltip.appendNameValue(text, m.class, m.value, i === 0);
            });
            // Add "d" after bbox calculation
            const bbox = this.getBBox();
            path
                .attr("d", (d) => LinkTooltip.pathD(d.offsetX, 0, bbox.width + 40, bbox.height + 20))
                .style("fill", function () {
                return LinkTooltip.fill(this);
            });
        });
    }
}
LinkTooltip.type = "link";



/***/ }),

/***/ "./src/meta_data.ts":
/*!**************************!*\
  !*** ./src/meta_data.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MetaData": () => (/* binding */ MetaData)
/* harmony export */ });
class MetaData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data, extraKey) {
        this.data = data;
        this.extraKey = extraKey;
    }
    get(keys) {
        return this.slice(keys).filter((k) => typeof k.value === "string");
    }
    slice(keys) {
        if (!this.data)
            return [];
        if (this.extraKey)
            return this.sliceWithExtraKey(keys);
        else
            return this.sliceWithoutExtraKey(keys);
    }
    sliceWithExtraKey(keys) {
        const data = [];
        keys.forEach((k) => {
            if (this.data[k] && this.data[k][this.extraKey])
                data.push({ class: k, value: this.data[k][this.extraKey] });
        });
        return data;
    }
    sliceWithoutExtraKey(keys) {
        const data = [];
        keys.forEach((k) => {
            if (this.data[k])
                data.push({ class: k, value: this.data[k] });
        });
        return data;
    }
}


/***/ }),

/***/ "./src/node.ts":
/*!*********************!*\
  !*** ./src/node.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Node": () => (/* binding */ Node)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _meta_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./meta_data */ "./src/meta_data.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



class NodeBase {
    constructor(data, id, options) {
        this.id = id;
        this.options = options;
        this.name = data.name;
        this.group = typeof data.group === "string" ? [data.group] : data.group || [];
        this.icon = data.icon;
        this.metaList = new _meta_data__WEBPACK_IMPORTED_MODULE_1__.MetaData(data.meta).get(options.metaKeys);
        this.meta = data.meta;
        this.extraClass = data.class || "";
        this.width = options.width || 60;
        this.height = options.height || 40;
        this.padding = 3;
        this.tspanOffset = "1.1em";
        this.register(id);
    }
    register(id) {
        Node.all = Node.all || {};
        Node.all[this.name] = id;
    }
    transform() {
        const x = this.x - this.width / 2 + this.padding;
        const y = this.y - this.height / 2 + this.padding;
        return `translate(${x}, ${y})`;
    }
    nodeWidth() {
        return this.width - 2 * this.padding;
    }
    nodeHeight() {
        return this.height - 2 * this.padding;
    }
    xForText() {
        return this.width / 2;
    }
    yForText() {
        return this.height / 2;
    }
    static idByName(name) {
        if (Node.all[name] === undefined)
            throw `Unknown node "${name}"`;
        return Node.all[name];
    }
    nodeId() {
        return (0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(this.name);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(layer, nodes) {
        const node = layer
            .selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("id", (d) => d.nodeId())
            .attr("name", (d) => d.name)
            .attr("transform", (d) => d.transform());
        node.each(function (d) {
            if (d.icon)
                Node.appendImage(this);
            else
                Node.appendRect(this);
            Node.appendText(this);
        });
        return node;
    }
    static appendText(container) {
        const text = d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", (d) => d.xForText())
            .attr("y", (d) => d.yForText());
        text
            .append("tspan")
            .text((d) => d.name)
            .attr("x", (d) => d.xForText());
        text.each((d) => {
            // Show meta only when "tooltip" option is not configured
            if (!d.options.tooltip) {
                Node.appendMetaText(text, d.metaList);
            }
        });
    }
    static appendMetaText(container, meta) {
        meta.forEach((m) => {
            container
                .append("tspan")
                .attr("x", (d) => d.xForText())
                .attr("dy", (d) => d.tspanOffset)
                .attr("class", m.class)
                .text(m.value);
        });
    }
    static appendImage(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
            .attr("class", (d) => `node image ${(0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(d.name)} ${d.extraClass}`)
            .append("image")
            .attr("xlink:href", (d) => d.icon)
            .attr("width", (d) => d.nodeWidth())
            .attr("height", (d) => d.nodeHeight());
    }
    static appendRect(container) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
            .attr("class", (d) => `node rect ${(0,_util__WEBPACK_IMPORTED_MODULE_2__.classify)(d.name)} ${d.extraClass}`)
            .append("rect")
            .attr("width", (d) => d.nodeWidth())
            .attr("height", (d) => d.nodeHeight())
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", (d) => d.options.color(undefined));
    }
    static tick(node) {
        node.attr("transform", (d) => d.transform());
    }
    static setPosition(node, position) {
        node.attr("transform", (d, i) => {
            var _a, _b, _c, _d;
            if (((_a = position[i]) === null || _a === void 0 ? void 0 : _a.x) !== null &&
                ((_b = position[i]) === null || _b === void 0 ? void 0 : _b.x) !== undefined &&
                ((_c = position[i]) === null || _c === void 0 ? void 0 : _c.y) !== null &&
                ((_d = position[i]) === null || _d === void 0 ? void 0 : _d.y) !== undefined) {
                d.x = position[i].x;
                d.y = position[i].y;
            }
            return d.transform();
        });
    }
    static reset() {
        Node.all = null;
    }
}
const Eventable = (Base) => {
    class EventableNode extends Base {
        constructor(data, id, options) {
            super(data, id, options);
            this.dispatch = d3__WEBPACK_IMPORTED_MODULE_0__.dispatch("rendered");
        }
        static render(layer, nodes) {
            const node = super.render(layer, nodes);
            node.each(function (d) {
                d.dispatch.rendered(this);
            });
            return node;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(name, callback) {
            this.dispatch.on(name, callback);
        }
    }
    return EventableNode;
};
const Pluggable = (Base) => {
    class Node extends Base {
        constructor(data, id, options) {
            super(data, id, options);
            for (const constructor of Node.pluginConstructors) {
                // Call Pluggable at last as constructor may call methods defined in other classes
                constructor.bind(this)(data, id, options);
            }
        }
        static registerConstructor(func) {
            Node.pluginConstructors.push(func);
        }
    }
    Node.pluginConstructors = [];
    return Node;
};
class EventableNode extends Eventable(NodeBase) {
}
// Call Pluggable at last as constructor may call methods defined in other classes
class Node extends Pluggable(EventableNode) {
}



/***/ }),

/***/ "./src/node_tooltip.ts":
/*!*****************************!*\
  !*** ./src/node_tooltip.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NodeTooltip": () => (/* binding */ NodeTooltip)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tooltip */ "./src/tooltip.ts");


class NodeTooltip extends _tooltip__WEBPACK_IMPORTED_MODULE_1__.Tooltip {
    constructor(node, eventType) {
        super(eventType);
        this.node = node;
    }
    transform() {
        return `translate(${this.node.x}, ${this.node.y})`;
    }
    objectId(escape = false) {
        let id = this.node.nodeId();
        if (escape) {
            id = CSS.escape(id);
        }
        return id;
    }
    static appendText(container) {
        const path = d3__WEBPACK_IMPORTED_MODULE_0__.select(container).append("path");
        const text = d3__WEBPACK_IMPORTED_MODULE_0__.select(container).append("text");
        NodeTooltip.appendNameValue(text, "node", (d) => d.node.name);
        text.each(function (d) {
            d.node.metaList.forEach((m, i) => {
                NodeTooltip.appendNameValue(text, m.class, m.value, i === 0);
            });
            // Add "d" after bbox calculation
            const bbox = this.getBBox();
            path
                .attr("d", (d) => NodeTooltip.pathD(d.offsetX, 0, bbox.width + 40, bbox.height + 20))
                .style("fill", function () {
                return NodeTooltip.fill(this);
            });
        });
    }
}
NodeTooltip.type = "node";



/***/ }),

/***/ "./src/position_cache.ts":
/*!*******************************!*\
  !*** ./src/position_cache.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PositionCache": () => (/* binding */ PositionCache)
/* harmony export */ });
const cloneDeep = __webpack_require__(/*! lodash.clonedeep */ "./node_modules/lodash.clonedeep/index.js"); // eslint-disable-line @typescript-eslint/no-var-requires
const md5 = __webpack_require__(/*! md5 */ "./node_modules/md5/md5.js"); // eslint-disable-line @typescript-eslint/no-var-requires
class PositionCache {
    constructor(data, pop, md5) {
        this.data = data;
        this.pop = pop;
        // NOTE: properties below can be undefined
        this.cachedMd5 = md5;
    }
    static getAll() {
        return JSON.parse(localStorage.getItem("positionCache")) || {};
    }
    static get() {
        return this.getAll()[location.pathname] || {};
    }
    save(group, node, link) {
        const cache = PositionCache.getAll();
        cache[location.pathname] = {
            md5: this.md5(),
            group: this.groupPosition(group),
            node: this.nodePosition(node),
            link: this.linkPosition(link),
        };
        localStorage.setItem("positionCache", JSON.stringify(cache));
    }
    md5(data, pop) {
        data = cloneDeep(data || this.data);
        data.pop = String(pop || this.pop);
        if (data.pop === "undefined") {
            data.pop = "null"; // NOTE: unify undefined with null
        }
        data.nodes &&
            data.nodes.forEach((i) => {
                delete i.icon;
                delete i.meta;
            });
        data.links &&
            data.links.forEach((i) => {
                delete i.meta;
            });
        return md5(JSON.stringify(data));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupPosition(group) {
        const position = [];
        group.each((d) => {
            position.push({
                x: d.bounds.x,
                y: d.bounds.y,
                width: d.bounds.width(),
                height: d.bounds.height(),
            });
        });
        return position;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodePosition(node) {
        const position = [];
        node.each((d) => {
            position.push({
                x: d.x,
                y: d.y,
            });
        });
        return position;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    linkPosition(link) {
        const position = [];
        link.each((d) => {
            position.push({
                x1: d.source.x,
                y1: d.source.y,
                x2: d.target.x,
                y2: d.target.y,
            });
        });
        return position;
    }
    match(data, pop) {
        return this.cachedMd5 === this.md5(data, pop);
    }
    static load(data, pop) {
        const cache = this.get();
        if (cache) {
            const position = new PositionCache(data, pop, cache.md5);
            if (position.match(data, pop)) {
                // if data and pop match saved md5
                position.group = cache.group;
                position.node = cache.node;
                position.link = cache.link;
                return position;
            }
        }
    }
}


/***/ }),

/***/ "./src/tooltip.ts":
/*!************************!*\
  !*** ./src/tooltip.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tooltip": () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);

class Tooltip {
    constructor(eventType, options = {}) {
        this.eventType = eventType;
        this.offsetX = options.offsetX !== undefined ? options.offsetX : 30;
        this.visibility = "hidden";
    }
    tspanOffsetY(marginTop) {
        return marginTop ? "2em" : "1.1em";
    }
    transform() {
        throw new Error("not implemented");
    }
    class() {
        return `tooltip ${this.constructor.type}-tooltip ${this.objectId()}`;
    }
    setVisibility(visibility) {
        this.visibility = visibility === "visible" ? "visible" : "hidden";
    }
    // This doesn't actually toggle visibility, but returns string for toggled visibility
    toggleVisibility() {
        this.visibility = this.visibility === "hidden" ? "visible" : "hidden";
        return this.visibility;
    }
    toggleVisibilityCallback(element) {
        return () => {
            // Do nothing for dragging
            if (d3__WEBPACK_IMPORTED_MODULE_0__.event.defaultPrevented) {
                return;
            }
            d3__WEBPACK_IMPORTED_MODULE_0__.select(element)
                .attr("visibility", function (d) {
                // Sync visibility before toggling. External script may change the visibility.
                d.setVisibility(this.getAttribute("visibility"));
                return d.toggleVisibility();
            })
                // bootstrap.css unexpectedly sets "opacity: 0". Reset if it's visible.
                .style("opacity", function (d) {
                return d.visibility === "visible" ? 1 : null;
            });
        };
    }
    configureObjectClickCallback(element) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(`#${this.objectId(true)}`).on("click.tooltip", this.toggleVisibilityCallback(element));
    }
    configureObjectHoverCallback(element) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(`#${this.objectId(true)}`).on("mouseenter.tooltip", this.toggleVisibilityCallback(element));
        d3__WEBPACK_IMPORTED_MODULE_0__.select(`#${this.objectId(true)}`).on("mouseleave.tooltip", this.toggleVisibilityCallback(element));
    }
    // Make tooltip selectable
    disableZoom(element) {
        d3__WEBPACK_IMPORTED_MODULE_0__.select(element).on("mousedown.tooltip", () => {
            d3__WEBPACK_IMPORTED_MODULE_0__.event.stopPropagation();
        });
    }
    static setHref(callback) {
        if (callback)
            this.href = callback;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static render(layer, tooltips) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const cls = this;
        const tooltip = layer
            .selectAll(`.tooltip.${cls.type}-tooltip`)
            .data(tooltips)
            .enter()
            .append("g")
            .attr("visibility", (d) => d.visibility)
            .attr("class", (d) => d.class())
            .attr("transform", (d) => d.transform());
        tooltip.each(function (d) {
            cls.appendText(this);
            if (typeof d.constructor.href === "function") {
                cls.appendExternalLinkIcon(this);
            }
            if (d.eventType === "hover") {
                d.configureObjectHoverCallback(this);
            }
            else {
                d.configureObjectClickCallback(this);
            }
            d.disableZoom(this);
        });
        return tooltip;
    }
    static fill(element) {
        // If no "fill" style is defined
        if (getComputedStyle(element).fill.match(/\(0,\s*0,\s*0\)/)) {
            return "#f8f1e9";
        }
    }
    static pathD(x, y, width, height) {
        const round = 8;
        return (`M ${x},${y} L ${x + 20},${y - 10} ${x + 20},${y - 20}` +
            `Q ${x + 20},${y - 20 - round} ${x + 20 + round},${y - 20 - round}` +
            `L ${x + 20 + width - round},${y - 20 - round}` +
            `Q ${x + 20 + width},${y - 20 - round} ${x + 20 + width},${y - 20}` +
            `L ${x + 20 + width},${y - 20 + height}` +
            `Q ${x + 20 + width},${y - 20 + height + round} ${x + 20 + width - round},${y - 20 + height + round}` +
            `L ${x + 20 + round},${y - 20 + height + round}` +
            `Q ${x + 20},${y - 20 + height + round} ${x + 20},${y - 20 + height}` +
            `L ${x + 20},${y + 10} Z`);
    }
    static appendText(container) {
        throw new Error("not implemented");
    }
    /**
     * Append "name: value" to the container
     * @param container
     * @param name
     * @param value
     * @param marginTop Render wide margin if true, ordinary marin if false, and no margin if undefined
     * @protected
     */
    static appendNameValue(container, name, value, marginTop) {
        container
            .append("tspan")
            .attr("x", (d) => d.offsetX + 40)
            .attr("dy", (d) => (marginTop === undefined ? undefined : d.tspanOffsetY(marginTop)))
            .attr("class", "name")
            .text(`${name}:`);
        container.append("tspan").attr("dx", 10).attr("class", "value").text(value);
    }
    // modified https://tabler-icons.io/i/external-link
    static appendExternalLinkIcon(container) {
        const bbox = container.getBBox();
        const a = d3__WEBPACK_IMPORTED_MODULE_0__.select(container)
            .append("a")
            .attr("href", (d) => d.constructor.href(d, d.constructor.type));
        const size = 20;
        const svg = a
            .append("svg")
            .attr("x", (d) => bbox.width + d.offsetX - 2 - size)
            .attr("y", bbox.height - 30 - size)
            .attr("width", size)
            .attr("height", size)
            .attr("viewBox", `0 0 24 24`)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("class", "icon external-link");
        svg.append("path").attr("d", `M0 0h24v24H0z`).attr("stroke", "none").attr("fill", "#fff").attr("fill-opacity", 0);
        svg.append("path").attr("d", "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6");
        svg.append("path").attr("d", "M11 13l9 -9");
        svg.append("path").attr("d", "M15 4h5v5");
    }
    static followObject(tooltip) {
        tooltip.attr("transform", (d) => d.transform());
    }
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "classify": () => (/* binding */ classify)
/* harmony export */ });
function classify(string) {
    return string.replace(" ", "-").toLowerCase();
}


/***/ }),

/***/ "./src/hack_cola.js":
/*!**************************!*\
  !*** ./src/hack_cola.js ***!
  \**************************/
/***/ (() => {

/* eslint-disable */

// Ported from WebCola/cola.js and overrode jaccardLinkLengths()

function unionCount(a, b) {
  var u = {};
  for (var i in a) u[i] = {};
  for (var i in b) u[i] = {};
  return Object.keys(u).length;
}

function intersectionCount(a, b) {
  var n = 0;
  for (var i in a) if (typeof b[i] !== "undefined") ++n;
  return n;
}

function getNeighbours(links, la) {
  var neighbours = {};
  var addNeighbours = function (u, v) {
    if (typeof neighbours[u] === "undefined") neighbours[u] = {};
    neighbours[u][v] = {};
  };
  links.forEach(function (e) {
    var u = la.getSourceIndex(e),
      v = la.getTargetIndex(e);
    addNeighbours(u, v);
    addNeighbours(v, u);
  });
  return neighbours;
}

function computeLinkLengths(links, w, f, la) {
  var neighbours = getNeighbours(links, la);
  links.forEach(function (l) {
    var a = neighbours[la.getSourceIndex(l)];
    var b = neighbours[la.getTargetIndex(l)];
    la.setLength(l, 1 + w * f(a, b));
  });
}

function jaccardLinkLengths(links, la, w) {
  if (w === void 0) {
    w = 1;
  }
  computeLinkLengths(
    links,
    w,
    function (a, b) {
      return Math.min(Object.keys(a).length, Object.keys(b).length) < 1.1
        ? 0
        : 1 - intersectionCount(a, b) / unionCount(a, b);
    },
    la,
  );
}

cola.Layout.prototype.jaccardLinkLengths = function (idealLength, w) {
  var _this = this;
  if (w === void 0) {
    w = 1;
  }
  this.linkDistance(function (l) {
    return idealLength * l.length;
  });
  this._linkLengthCalculator = function () {
    return jaccardLinkLengths(_this._links, _this.linkAccessor, w);
  };
  return this;
};


/***/ }),

/***/ "cola":
/*!***********************!*\
  !*** external "cola" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_cola__;

/***/ }),

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_d3__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/diagram.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Diagram": () => (/* binding */ Diagram)
/* harmony export */ });
/* harmony import */ var _hack_cola__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hack_cola */ "./src/hack_cola.js");
/* harmony import */ var _hack_cola__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hack_cola__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "d3");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _bundle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bundle */ "./src/bundle.ts");
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./group */ "./src/group.ts");
/* harmony import */ var _link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./link */ "./src/link.ts");
/* harmony import */ var _link_tooltip__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./link_tooltip */ "./src/link_tooltip.ts");
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node */ "./src/node.ts");
/* harmony import */ var _node_tooltip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_tooltip */ "./src/node_tooltip.ts");
/* harmony import */ var _position_cache__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./position_cache */ "./src/position_cache.ts");









const cola = __webpack_require__(/*! cola */ "cola"); // eslint-disable-line @typescript-eslint/no-var-requires
class DiagramBase {
    constructor(container, urlOrData, options) {
        options || (options = {});
        this.options = Object.assign({}, options);
        this.options.selector = container;
        this.options.urlOrData = urlOrData;
        this.options.groupPattern = options.pop;
        this.options.width = options.width || 960;
        this.options.height = options.height || 600;
        this.options.positionHint = options.positionHint || {};
        this.options.positionConstraints = options.positionConstraints || [];
        this.options.color = d3__WEBPACK_IMPORTED_MODULE_1__.scale.category20();
        this.options.initialTicks = options.initialTicks || 0;
        this.options.maxTicks = options.ticks || 1000;
        // NOTE: true or 'fixed' (experimental) affects behavior
        this.options.positionCache = "positionCache" in options ? options.positionCache : true;
        // NOTE: This is an experimental option
        this.options.bundle = "bundle" in options ? options.bundle : false;
        this.options.tooltip = options.tooltip;
        this.setDistance = this.linkDistance(options.distance || 150);
        _node_tooltip__WEBPACK_IMPORTED_MODULE_7__.NodeTooltip.setHref(options.href);
        _link_tooltip__WEBPACK_IMPORTED_MODULE_5__.LinkTooltip.setHref(options.href);
    }
    init(...meta) {
        this.options.meta = meta;
        this.cola = this.initCola();
        this.svg = this.initSvg();
        this.displayLoadMessage();
        if (typeof this.options.urlOrData === "object") {
            setTimeout(() => {
                // Run asynchronously
                this.render(this.options.urlOrData);
            });
        }
        else {
            d3__WEBPACK_IMPORTED_MODULE_1__.json(this.url(), (error, data) => {
                if (error) {
                    console.error(error);
                    this.showMessage(`Failed to load "${this.url()}"`);
                }
                this.render(data);
            });
        }
    }
    initCola() {
        return cola
            .d3adaptor()
            .avoidOverlaps(true)
            .handleDisconnected(false)
            .size([this.options.width, this.options.height]);
    }
    initSvg() {
        this.zoom = d3__WEBPACK_IMPORTED_MODULE_1__.behavior.zoom();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const container = d3__WEBPACK_IMPORTED_MODULE_1__.select(this.options.selector)
            .append("svg")
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .append("g")
            .call(this.zoom.on("zoom", () => this.zoomCallback(container)))
            .append("g");
        container
            .append("rect")
            .attr("width", this.options.width * 10) // 10 is huge enough
            .attr("height", this.options.height * 10)
            .attr("transform", `translate(-${this.options.width * 5}, -${this.options.height * 5})`)
            .style("opacity", 0);
        return container;
    }
    render(data) {
        try {
            const nodes = data.nodes
                ? data.nodes.map((n, i) => new _node__WEBPACK_IMPORTED_MODULE_6__.Node(n, i, {
                    width: this.options.nodeWidth,
                    height: this.options.nodeHeight,
                    metaKeys: this.options.meta,
                    color: this.options.color,
                    tooltip: !!this.options.tooltip,
                }))
                : [];
            const links = data.links
                ? _bundle__WEBPACK_IMPORTED_MODULE_2__.Bundle.sortByBundle(data.links).map((l, i) => new _link__WEBPACK_IMPORTED_MODULE_4__.Link(l, i, {
                    metaKeys: this.options.meta,
                    linkWidth: this.getLinkWidth,
                }))
                : [];
            const groups = _group__WEBPACK_IMPORTED_MODULE_3__.Group.divide(nodes, this.options.groupPattern, {
                color: this.options.color,
                padding: this.options.groupPadding,
            });
            const nodeTooltips = nodes.map((n) => new _node_tooltip__WEBPACK_IMPORTED_MODULE_7__.NodeTooltip(n, this.options.tooltip));
            const linkTooltips = links.map((l) => new _link_tooltip__WEBPACK_IMPORTED_MODULE_5__.LinkTooltip(l, this.options.tooltip));
            const bundles = _bundle__WEBPACK_IMPORTED_MODULE_2__.Bundle.divide(links);
            this.cola.nodes(nodes).links(links).groups(groups);
            this.applyConstraints(this.options.positionConstraints, nodes);
            this.setDistance(this.cola);
            // Start to update Link.source and Link.target with Node object after
            // initial layout iterations without any constraints.
            this.cola.start(this.options.initialTicks);
            const groupLayer = this.svg.append("g").attr("id", "groups");
            const linkLayer = this.svg.append("g").attr("id", "links");
            const nodeLayer = this.svg.append("g").attr("id", "nodes");
            const linkLabelLayer = this.svg.append("g").attr("id", "link-labels");
            const tooltipLayer = this.svg.append("g").attr("id", "tooltips");
            const [link, path, label] = _link__WEBPACK_IMPORTED_MODULE_4__.Link.render(linkLayer, linkLabelLayer, links);
            const bundle = _bundle__WEBPACK_IMPORTED_MODULE_2__.Bundle.render(linkLayer, bundles);
            const group = _group__WEBPACK_IMPORTED_MODULE_3__.Group.render(groupLayer, groups).call(this.cola
                .drag()
                .on("dragstart", DiagramBase.dragstartCallback)
                .on("drag", () => {
                if (this.options.bundle) {
                    _link__WEBPACK_IMPORTED_MODULE_4__.Link.shiftBundle(link, path, label, bundle);
                }
                _node_tooltip__WEBPACK_IMPORTED_MODULE_7__.NodeTooltip.followObject(nodeTooltip);
                _link_tooltip__WEBPACK_IMPORTED_MODULE_5__.LinkTooltip.followObject(linkTooltip);
            }));
            const node = _node__WEBPACK_IMPORTED_MODULE_6__.Node.render(nodeLayer, nodes).call(this.cola
                .drag()
                .on("dragstart", DiagramBase.dragstartCallback)
                .on("drag", () => {
                if (this.options.bundle) {
                    _link__WEBPACK_IMPORTED_MODULE_4__.Link.shiftBundle(link, path, label, bundle);
                }
                _node_tooltip__WEBPACK_IMPORTED_MODULE_7__.NodeTooltip.followObject(nodeTooltip);
                _link_tooltip__WEBPACK_IMPORTED_MODULE_5__.LinkTooltip.followObject(linkTooltip);
            }));
            // without path calculation
            this.configureTick(group, node, link);
            this.positionCache = _position_cache__WEBPACK_IMPORTED_MODULE_8__.PositionCache.load(data, this.options.groupPattern);
            if (this.options.positionCache && this.positionCache) {
                // NOTE: Evaluate only when positionCache: true or 'fixed', and
                //       when the stored position cache matches a pair of given data and pop
                _group__WEBPACK_IMPORTED_MODULE_3__.Group.setPosition(group, this.positionCache.group);
                _node__WEBPACK_IMPORTED_MODULE_6__.Node.setPosition(node, this.positionCache.node);
                _link__WEBPACK_IMPORTED_MODULE_4__.Link.setPosition(link, this.positionCache.link);
            }
            else {
                if (this.options.positionHint.nodeCallback) {
                    _node__WEBPACK_IMPORTED_MODULE_6__.Node.setPosition(node, node.data().map((d) => this.options.positionHint.nodeCallback(d)));
                    this.cola.start(); // update internal positions of objects before ticks forward
                }
                this.ticksForward();
                this.positionCache = new _position_cache__WEBPACK_IMPORTED_MODULE_8__.PositionCache(data, this.options.groupPattern);
                this.savePosition(group, node, link);
            }
            this.hideLoadMessage();
            this.configureTick(group, node, link, path, label); // render path
            this.removeConstraints();
            this.cola.start();
            if (this.options.bundle) {
                _link__WEBPACK_IMPORTED_MODULE_4__.Link.shiftBundle(link, path, label, bundle);
            }
            path.attr("d", (d) => d.d()); // make sure path calculation is done
            DiagramBase.freeze(node);
            const nodeTooltip = _node_tooltip__WEBPACK_IMPORTED_MODULE_7__.NodeTooltip.render(tooltipLayer, nodeTooltips);
            const linkTooltip = _link_tooltip__WEBPACK_IMPORTED_MODULE_5__.LinkTooltip.render(tooltipLayer, linkTooltips);
            // NOTE: This is an experimental option
            if (this.options.positionCache === "fixed") {
                this.cola.on("end", () => {
                    this.savePosition(group, node, link);
                });
            }
        }
        catch (e) {
            this.showMessage(e);
            throw e;
        }
    }
    linkWidth(func) {
        this.getLinkWidth = func;
    }
    attr(name, value) {
        if (!this.initialTranslate) {
            this.saveInitialTranslate();
        }
        this.svg.attr(name, value);
        const transform = d3__WEBPACK_IMPORTED_MODULE_1__.transform(this.svg.attr("transform")); // FIXME: This is valid only for d3.js v3
        this.zoom.scale(transform.scale[0]); // NOTE: Assuming ky = kx
        this.zoom.translate(transform.translate);
    }
    destroy() {
        d3__WEBPACK_IMPORTED_MODULE_1__.select("body svg").remove();
        _node__WEBPACK_IMPORTED_MODULE_6__.Node.reset();
        _link__WEBPACK_IMPORTED_MODULE_4__.Link.reset();
        _bundle__WEBPACK_IMPORTED_MODULE_2__.Bundle.reset();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static freeze(container) {
        container.each((d) => (d.fixed = true));
    }
    static dragstartCallback() {
        d3__WEBPACK_IMPORTED_MODULE_1__.event.sourceEvent.stopPropagation();
    }
    linkDistance(distance) {
        if (typeof distance === "function")
            return distance;
        else
            return (cola) => cola.linkDistance(distance);
    }
    url() {
        if (this.uniqueUrl) {
            return this.uniqueUrl;
        }
        this.uniqueUrl = `${this.options.urlOrData}?${new Date().getTime()}`;
        return this.uniqueUrl;
    }
    configureTick(group, node, link, path, label) {
        this.cola.on("tick", () => {
            _node__WEBPACK_IMPORTED_MODULE_6__.Node.tick(node);
            _link__WEBPACK_IMPORTED_MODULE_4__.Link.tick(link, path, label);
            _group__WEBPACK_IMPORTED_MODULE_3__.Group.tick(group);
        });
    }
    ticksForward(count) {
        count = count || this.options.maxTicks;
        for (let i = 0; i < count; i++)
            this.cola.tick();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zoomCallback(container) {
        if (!this.initialTranslate) {
            this.saveInitialTranslate();
        }
        const event = d3__WEBPACK_IMPORTED_MODULE_1__.event;
        event.scale *= this.initialScale;
        event.translate[0] += this.initialTranslate[0];
        event.translate[1] += this.initialTranslate[1];
        _link__WEBPACK_IMPORTED_MODULE_4__.Link.zoom(event.scale);
        container.attr("transform", `translate(${event.translate}) scale(${event.scale})`);
    }
    displayLoadMessage() {
        this.indicator = this.svg
            .append("text")
            .attr("x", this.options.width / 2)
            .attr("y", this.options.height / 2)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text("Simulating. Just a moment ...");
    }
    hideLoadMessage() {
        if (this.indicator)
            this.indicator.remove();
    }
    showMessage(message) {
        if (this.indicator)
            this.indicator.text(message);
    }
    saveInitialTranslate() {
        const transform = d3__WEBPACK_IMPORTED_MODULE_1__.transform(this.svg.attr("transform")); // FIXME: This is valid only for d3.js v3
        this.initialScale = transform.scale[0]; // NOTE: Assuming ky = kx
        this.initialTranslate = transform.translate;
    }
    savePosition(group, node, link) {
        this.positionCache.save(group, node, link);
    }
    applyConstraints(constraints, nodes) {
        const colaConstraints = [];
        for (const constraint of constraints) {
            for (const ns of constraint.nodesCallback(nodes)) {
                colaConstraints.push({
                    type: "alignment",
                    axis: constraint.axis,
                    offsets: ns.map((n) => ({ node: n.id, offset: 0 })),
                });
            }
        }
        this.cola.constraints(colaConstraints);
    }
    removeConstraints() {
        this.cola.constraints([]);
    }
}
const Pluggable = (Base) => {
    class Diagram extends Base {
        static plugin(cls, options = {}) {
            cls.load(_group__WEBPACK_IMPORTED_MODULE_3__.Group, _node__WEBPACK_IMPORTED_MODULE_6__.Node, _link__WEBPACK_IMPORTED_MODULE_4__.Link, options);
        }
    }
    return Diagram;
};
const Eventable = (Base) => {
    class Diagram extends Base {
        constructor(container, urlOrData, options) {
            super(container, urlOrData, options);
            this.dispatch = d3__WEBPACK_IMPORTED_MODULE_1__.dispatch("rendered");
        }
        render(arg) {
            super.render(arg);
            this.dispatch.rendered();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        on(name, callback) {
            this.dispatch.on(name, callback);
        }
    }
    return Diagram;
};
class PluggableDiagram extends Pluggable(DiagramBase) {
}
class Diagram extends Eventable(PluggableDiagram) {
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=inet-henge.js.map