/*!
 * inet-henge  v1.4.7
 * @author Shintaro Kojima
 * @license MIT
 * Copyright (c) 2016-2024 Shintaro Kojima
 */
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

/***/ "./node_modules/crypto-js/core.js":
/*!****************************************!*\
  !*** ./node_modules/crypto-js/core.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory();
	}
	else {}
}(this, function () {

	/*globals window, global, require*/

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {

	    var crypto;

	    // Native crypto from window (Browser)
	    if (typeof window !== 'undefined' && window.crypto) {
	        crypto = window.crypto;
	    }

	    // Native crypto in web worker (Browser)
	    if (typeof self !== 'undefined' && self.crypto) {
	        crypto = self.crypto;
	    }

	    // Native crypto from worker
	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
	        crypto = globalThis.crypto;
	    }

	    // Native (experimental IE 11) crypto from window (Browser)
	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
	        crypto = window.msCrypto;
	    }

	    // Native crypto from global (NodeJS)
	    if (!crypto && typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.crypto) {
	        crypto = __webpack_require__.g.crypto;
	    }

	    // Native crypto import via require (NodeJS)
	    if (!crypto && "function" === 'function') {
	        try {
	            crypto = __webpack_require__(/*! crypto */ "?9157");
	        } catch (err) {}
	    }

	    /*
	     * Cryptographically secure pseudorandom number generator
	     *
	     * As Math.random() is cryptographically not safe to use
	     */
	    var cryptoSecureRandomInt = function () {
	        if (crypto) {
	            // Use getRandomValues method (Browser)
	            if (typeof crypto.getRandomValues === 'function') {
	                try {
	                    return crypto.getRandomValues(new Uint32Array(1))[0];
	                } catch (err) {}
	            }

	            // Use randomBytes method (NodeJS)
	            if (typeof crypto.randomBytes === 'function') {
	                try {
	                    return crypto.randomBytes(4).readInt32LE();
	                } catch (err) {}
	            }
	        }

	        throw new Error('Native crypto module could not be used to get secure random number.');
	    };

	    /*
	     * Local polyfill of Object.create

	     */
	    var create = Object.create || (function () {
	        function F() {}

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }());

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var j = 0; j < thatSigBytes; j += 4) {
	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            for (var i = 0; i < nBytes; i += 4) {
	                words.push(cryptoSecureRandomInt());
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            var processedWords;

	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));

/***/ }),

/***/ "./node_modules/crypto-js/md5.js":
/*!***************************************!*\
  !*** ./node_modules/crypto-js/md5.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(/*! ./core */ "./node_modules/crypto-js/core.js"));
	}
	else {}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var T = [];

	    // Compute constants
	    (function () {
	        for (var i = 0; i < 64; i++) {
	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
	        }
	    }());

	    /**
	     * MD5 hash algorithm.
	     */
	    var MD5 = C_algo.MD5 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }

	            // Shortcuts
	            var H = this._hash.words;

	            var M_offset_0  = M[offset + 0];
	            var M_offset_1  = M[offset + 1];
	            var M_offset_2  = M[offset + 2];
	            var M_offset_3  = M[offset + 3];
	            var M_offset_4  = M[offset + 4];
	            var M_offset_5  = M[offset + 5];
	            var M_offset_6  = M[offset + 6];
	            var M_offset_7  = M[offset + 7];
	            var M_offset_8  = M[offset + 8];
	            var M_offset_9  = M[offset + 9];
	            var M_offset_10 = M[offset + 10];
	            var M_offset_11 = M[offset + 11];
	            var M_offset_12 = M[offset + 12];
	            var M_offset_13 = M[offset + 13];
	            var M_offset_14 = M[offset + 14];
	            var M_offset_15 = M[offset + 15];

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];

	            // Computation
	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
	            var nBitsTotalL = nBitsTotal;
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
	            );
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
	            );

	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                // Shortcut
	                var H_i = H[i];

	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    function FF(a, b, c, d, x, s, t) {
	        var n = a + ((b & c) | (~b & d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function GG(a, b, c, d, x, s, t) {
	        var n = a + ((b & d) | (c & ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function HH(a, b, c, d, x, s, t) {
	        var n = a + (b ^ c ^ d) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function II(a, b, c, d, x, s, t) {
	        var n = a + (c ^ (b | ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.MD5('message');
	     *     var hash = CryptoJS.MD5(wordArray);
	     */
	    C.MD5 = Hasher._createHelper(MD5);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacMD5(message, key);
	     */
	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
	}(Math));


	return CryptoJS.MD5;

}));

/***/ }),

/***/ "./src/bundle.ts":
/*!***********************!*\
  !*** ./src/bundle.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bundle: () => (/* binding */ Bundle)
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
/* harmony export */   Group: () => (/* binding */ Group),
/* harmony export */   GroupBase: () => (/* binding */ GroupBase)
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
/* harmony export */   Link: () => (/* binding */ Link),
/* harmony export */   LinkBase: () => (/* binding */ LinkBase)
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
    isLabelVisible() {
        const pathLength = document.getElementById(this.pathId()).getTotalLength();
        const isShort = Array.from(document.getElementsByClassName(this.pathId())).some((p) => {
            // <text /> has only one <textPath />
            const tp = p.firstChild;
            // center label
            if (tp.classList.contains("center")) {
                return tp.getComputedTextLength() > pathLength;
            }
            else {
                return tp.getComputedTextLength() + this.labelXOffset > pathLength;
            }
        });
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(`text.${this.pathId()}`).classed("short", isShort);
        // Link.scale is initially undefined
        return Link.scale > 1.5 && !isShort;
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
        return `link ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.source.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.target.name)} ${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.source.name)}-${(0,_util__WEBPACK_IMPORTED_MODULE_4__.classify)(this.target.name)} ${this.extraClass}`;
    }
    // after transform is applied
    centerCoordinates() {
        const link = d3__WEBPACK_IMPORTED_MODULE_0__.select(`.link #${this.linkId()}`).node();
        const bbox = link.getBBox();
        const transform = link.transform.baseVal.consolidate();
        return [
            bbox.x + bbox.width / 2 + ((transform === null || transform === void 0 ? void 0 : transform.matrix.e) || 0),
            bbox.y + bbox.height / 2 + ((transform === null || transform === void 0 ? void 0 : transform.matrix.f) || 0),
        ];
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
        if (path) {
            path.attr("d", (d) => d.d());
        }
        if (label) {
            label.attr("transform", function (d) {
                return d.rotate(this.getBBox());
            });
        }
        // hide labels when the path is too short
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".link text").style("visibility", (d) => (d.isLabelVisible() ? "visible" : "hidden"));
    }
    static zoom(scale) {
        Link.scale = scale;
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".link text").style("visibility", (d) => (d.isLabelVisible() ? "visible" : "hidden"));
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
/* harmony export */   LinkTooltip: () => (/* binding */ LinkTooltip)
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
            d.link.sourceMeta.forEach((m) => {
                LinkTooltip.appendNameValue(text, m.class, m.value, false);
            });
        });
        LinkTooltip.appendNameValue(text, "target", (d) => d.link.target.name, true);
        text.each(function (d) {
            d.link.targetMeta.forEach((m) => {
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
/* harmony export */   MetaData: () => (/* binding */ MetaData)
/* harmony export */ });
class MetaData {
    constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data, extraKey) {
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
/* harmony export */   Node: () => (/* binding */ Node)
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
/* harmony export */   NodeTooltip: () => (/* binding */ NodeTooltip)
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
/* harmony export */   PositionCache: () => (/* binding */ PositionCache)
/* harmony export */ });
/* harmony import */ var crypto_js_md5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto-js/md5 */ "./node_modules/crypto-js/md5.js");
/* harmony import */ var crypto_js_md5__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto_js_md5__WEBPACK_IMPORTED_MODULE_0__);

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
        data = structuredClone(data || this.data);
        data.pop = String(pop || this.pop);
        if (data.pop === "undefined") {
            data.pop = "null"; // NOTE: unify undefined with null
        }
        if (data.nodes) {
            data.nodes.forEach((i) => {
                delete i.icon;
                delete i.meta;
            });
        }
        if (data.links) {
            data.links.forEach((i) => {
                delete i.meta;
            });
        }
        return crypto_js_md5__WEBPACK_IMPORTED_MODULE_0__(JSON.stringify(data)).toString();
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
/* harmony export */   Tooltip: () => (/* binding */ Tooltip)
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
/* harmony export */   classify: () => (/* binding */ classify)
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

/***/ }),

/***/ "?9157":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/* harmony export */   Diagram: () => (/* binding */ Diagram)
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









const diagram_cola = __webpack_require__(/*! cola */ "cola"); // eslint-disable-line @typescript-eslint/no-require-imports
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
        return diagram_cola
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
        // this.cola.on() overrides existing listener, not additionally register it.
        // May need to call it manually.
        this.tickCallback = () => {
            _node__WEBPACK_IMPORTED_MODULE_6__.Node.tick(node);
            _link__WEBPACK_IMPORTED_MODULE_4__.Link.tick(link, path, label);
            _group__WEBPACK_IMPORTED_MODULE_3__.Group.tick(group);
        };
        this.cola.on("tick", this.tickCallback);
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