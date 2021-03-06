(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

The MIT License (MIT)

Original Library 
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var ansiStyles = colors.styles = require('./styles');
var defineProps = Object.defineProperties;

colors.supportsColor = require('./system/supports-colors');

if (typeof colors.enabled === "undefined") {
  colors.enabled = colors.supportsColor;
}

colors.stripColors = colors.strip = function(str){
  return ("" + str).replace(/\x1B\[\d+m/g, '');
};


var stylize = colors.stylize = function stylize (str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  return ansiStyles[style].open + str + ansiStyles[style].close;
}

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe,  '\\$&');
}

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function () {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function (key) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = arguments;
  var argsLen = args.length;
  var str = argsLen !== 0 && String(arguments[0]);
  if (argsLen > 1) {
    for (var a = 1; a < argsLen; a++) {
      str += ' ' + args[a];
    }
  }

  if (!colors.enabled || !str) {
    return str;
  }

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
  }

  return str;
}

function applyTheme (theme) {
  for (var style in theme) {
    (function(style){
      colors[style] = function(str){
        if (typeof theme[style] === 'object'){
          var out = str;
          for (var i in theme[style]){
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style)
  }
}

colors.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      colors.themes[theme] = require(theme);
      applyTheme(colors.themes[theme]);
      return colors.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

var sequencer = function sequencer (map, str) {
  var exploded = str.split(""), i = 0;
  exploded = exploded.map(map);
  return exploded.join("");
};

// custom formatter methods
colors.trap = require('./custom/trap');
colors.zalgo = require('./custom/zalgo');

// maps
colors.maps = {};
colors.maps.america = require('./maps/america');
colors.maps.zebra = require('./maps/zebra');
colors.maps.rainbow = require('./maps/rainbow');
colors.maps.random = require('./maps/random')

for (var map in colors.maps) {
  (function(map){
    colors[map] = function (str) {
      return sequencer(colors.maps[map], str);
    }
  })(map)
}

defineProps(colors, init());
},{"./custom/trap":2,"./custom/zalgo":3,"./maps/america":6,"./maps/rainbow":7,"./maps/random":8,"./maps/zebra":9,"./styles":10,"./system/supports-colors":11}],2:[function(require,module,exports){
module['exports'] = function runTheTrap (text, options) {
  var result = "";
  text = text || "Run the trap, drop the bass";
  text = text.split('');
  var trap = {
    a: ["\u0040", "\u0104", "\u023a", "\u0245", "\u0394", "\u039b", "\u0414"],
    b: ["\u00df", "\u0181", "\u0243", "\u026e", "\u03b2", "\u0e3f"],
    c: ["\u00a9", "\u023b", "\u03fe"],
    d: ["\u00d0", "\u018a", "\u0500" , "\u0501" ,"\u0502", "\u0503"],
    e: ["\u00cb", "\u0115", "\u018e", "\u0258", "\u03a3", "\u03be", "\u04bc", "\u0a6c"],
    f: ["\u04fa"],
    g: ["\u0262"],
    h: ["\u0126", "\u0195", "\u04a2", "\u04ba", "\u04c7", "\u050a"],
    i: ["\u0f0f"],
    j: ["\u0134"],
    k: ["\u0138", "\u04a0", "\u04c3", "\u051e"],
    l: ["\u0139"],
    m: ["\u028d", "\u04cd", "\u04ce", "\u0520", "\u0521", "\u0d69"],
    n: ["\u00d1", "\u014b", "\u019d", "\u0376", "\u03a0", "\u048a"],
    o: ["\u00d8", "\u00f5", "\u00f8", "\u01fe", "\u0298", "\u047a", "\u05dd", "\u06dd", "\u0e4f"],
    p: ["\u01f7", "\u048e"],
    q: ["\u09cd"],
    r: ["\u00ae", "\u01a6", "\u0210", "\u024c", "\u0280", "\u042f"],
    s: ["\u00a7", "\u03de", "\u03df", "\u03e8"],
    t: ["\u0141", "\u0166", "\u0373"],
    u: ["\u01b1", "\u054d"],
    v: ["\u05d8"],
    w: ["\u0428", "\u0460", "\u047c", "\u0d70"],
    x: ["\u04b2", "\u04fe", "\u04fc", "\u04fd"],
    y: ["\u00a5", "\u04b0", "\u04cb"],
    z: ["\u01b5", "\u0240"]
  }
  text.forEach(function(c){
    c = c.toLowerCase();
    var chars = trap[c] || [" "];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== "undefined") {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;

}

},{}],3:[function(require,module,exports){
// please no
module['exports'] = function zalgo(text, options) {
  text = text || "   he is here   ";
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }
  

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] =   typeof options["up"]   !== 'undefined' ? options["up"]   : true;
    options["mid"] =  typeof options["mid"]  !== 'undefined' ? options["mid"]  : true;
    options["down"] = typeof options["down"] !== 'undefined' ? options["down"] : true;
    options["size"] = typeof options["size"] !== 'undefined' ? options["size"] : "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.mid = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.mid = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
}

},{}],4:[function(require,module,exports){
var colors = require('./colors');

module['exports'] = function () {

  //
  // Extends prototype of native string object to allow for "foo".red syntax
  //
  var addProperty = function (color, func) {
    String.prototype.__defineGetter__(color, func);
  };

  var sequencer = function sequencer (map, str) {
      return function () {
        var exploded = this.split(""), i = 0;
        exploded = exploded.map(map);
        return exploded.join("");
      }
  };

  addProperty('strip', function () {
    return colors.strip(this);
  });

  addProperty('stripColors', function () {
    return colors.strip(this);
  });

  addProperty("trap", function(){
    return colors.trap(this);
  });

  addProperty("zalgo", function(){
    return colors.zalgo(this);
  });

  addProperty("zebra", function(){
    return colors.zebra(this);
  });

  addProperty("rainbow", function(){
    return colors.rainbow(this);
  });

  addProperty("random", function(){
    return colors.random(this);
  });

  addProperty("america", function(){
    return colors.america(this);
  });

  //
  // Iterate through all default styles and colors
  //
  var x = Object.keys(colors.styles);
  x.forEach(function (style) {
    addProperty(style, function () {
      return colors.stylize(this, style);
    });
  });

  function applyTheme(theme) {
    //
    // Remark: This is a list of methods that exist
    // on String that you should not overwrite.
    //
    var stringPrototypeBlacklist = [
      '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'charAt', 'constructor',
      'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'charCodeAt',
      'indexOf', 'lastIndexof', 'length', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substring',
      'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight'
    ];

    Object.keys(theme).forEach(function (prop) {
      if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
        console.log('warn: '.red + ('String.prototype' + prop).magenta + ' is probably something you don\'t want to override. Ignoring style name');
      }
      else {
        if (typeof(theme[prop]) === 'string') {
          colors[prop] = colors[theme[prop]];
          addProperty(prop, function () {
            return colors[theme[prop]](this);
          });
        }
        else {
          addProperty(prop, function () {
            var ret = this;
            for (var t = 0; t < theme[prop].length; t++) {
              ret = colors[theme[prop][t]](ret);
            }
            return ret;
          });
        }
      }
    });
  }

  colors.setTheme = function (theme) {
    if (typeof theme === 'string') {
      try {
        colors.themes[theme] = require(theme);
        applyTheme(colors.themes[theme]);
        return colors.themes[theme];
      } catch (err) {
        console.log(err);
        return err;
      }
    } else {
      applyTheme(theme);
    }
  };

};
},{"./colors":1}],5:[function(require,module,exports){
var colors = require('./colors');
module['exports'] = colors;

// Remark: By default, colors will add style properties to String.prototype
//
// If you don't wish to extend String.prototype you can do this instead and native String will not be touched
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
require('./extendStringPrototype')();
},{"./colors":1,"./extendStringPrototype":4}],6:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = (function() {
  return function (letter, i, exploded) {
    if(letter === " ") return letter;
    switch(i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter)
      case 2: return colors.blue(letter)
    }
  }
})();
},{"../colors":1}],7:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
})();


},{"../colors":1}],8:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = (function () {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  return function(letter, i, exploded) {
    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
  };
})();
},{"../colors":1}],9:[function(require,module,exports){
var colors = require('../colors');

module['exports'] = function (letter, i, exploded) {
  return i % 2 === 0 ? letter : colors.inverse(letter);
};
},{"../colors":1}],10:[function(require,module,exports){
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49]

};

Object.keys(codes).forEach(function (key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});
},{}],11:[function(require,module,exports){
(function (process){
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var argv = process.argv;

module.exports = (function () {
  if (argv.indexOf('--no-color') !== -1 ||
    argv.indexOf('--color=false') !== -1) {
    return false;
  }

  if (argv.indexOf('--color') !== -1 ||
    argv.indexOf('--color=true') !== -1 ||
    argv.indexOf('--color=always') !== -1) {
    return true;
  }

  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }

  if (process.platform === 'win32') {
    return true;
  }

  if ('COLORTERM' in process.env) {
    return true;
  }

  if (process.env.TERM === 'dumb') {
    return false;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }

  return false;
})();
}).call(this,require('_process'))
},{"_process":15}],12:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":24}],13:[function(require,module,exports){
/**
 * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
 */
(function (global) {
    'use strict';

    var param = function (a) {
        var s = [], rbracket = /\[\]$/,
            isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }, add = function (k, v) {
                v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
                s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
            }, buildParams = function (prefix, obj) {
                var i, len, key;

                if (prefix) {
                    if (isArray(obj)) {
                        for (i = 0, len = obj.length; i < len; i++) {
                            if (rbracket.test(prefix)) {
                                add(prefix, obj[i]);
                            } else {
                                buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                            }
                        }
                    } else if (obj && String(obj) === '[object Object]') {
                        for (key in obj) {
                            buildParams(prefix + '[' + key + ']', obj[key]);
                        }
                    } else {
                        add(prefix, obj);
                    }
                } else if (isArray(obj)) {
                    for (i = 0, len = obj.length; i < len; i++) {
                        add(obj[i].name, obj[i].value);
                    }
                } else {
                    for (key in obj) {
                        buildParams(key, obj[key]);
                    }
                }
                return s;
            };

        return buildParams('', a).join('&').replace(/%20/g, '+');
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = param;
    } else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return param;
        });
    } else {
        global.param = param;
    }

}(this));


},{}],14:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":15}],15:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
    try {
        cachedSetTimeout = setTimeout;
    } catch (e) {
        cachedSetTimeout = function () {
            throw new Error('setTimeout is not defined');
        }
    }
    try {
        cachedClearTimeout = clearTimeout;
    } catch (e) {
        cachedClearTimeout = function () {
            throw new Error('clearTimeout is not defined');
        }
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],16:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],19:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":17,"./encode":18}],20:[function(require,module,exports){
module.exports = require('./lib/just');

},{"./lib/just":21}],21:[function(require,module,exports){
var RE_UCHARS = /([\uD800-\uDBFF][\uDC00-\uDFFFF]|[\S\s])/g;
var codepoints = function (string) {
    return string.replace(RE_UCHARS, '_').length;
};
var substring = function (string, length) {
    return string.match(RE_UCHARS).slice(0, length).join('');
};
var just = function (append) {
    return function (string, length, chars) {
        var str, len, chr, diff, fill = '';
        if (typeof this === 'string' || this instanceof String) {
            str = this;
            len = string;
            chr = length ? length : ' ';
        }
        else {
            str = string;
            len = length;
            chr = chars ? chars : ' ';
        }
        diff = len - codepoints(str);
        if (diff <= 0) {
            return str;
        }
        do {
            fill += chr;
        } while (diff > codepoints(fill));
        fill = substring(fill, diff);
        return append ? str + fill : fill + str;
    };
};
var ljust = just(true);
var rjust = just(false);
var install = function () {
    String.prototype['ljust'] = ljust;
    String.prototype['rjust'] = rjust;
};
install.ljust = ljust;
install.rjust = rjust;
module.exports = install;

},{}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":23,"punycode":16,"querystring":19}],23:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],24:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],25:[function(require,module,exports){
(function (global){
'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.JSONAPIonify = _index2.default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index":45}],26:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client(baseUrl) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$allowSetHeaders = _ref.allowSetHeaders;
    var allowSetHeaders = _ref$allowSetHeaders === undefined ? false : _ref$allowSetHeaders;
    var _ref$headers = _ref.headers;
    var headers = _ref$headers === undefined ? {} : _ref$headers;

    _classCallCheck(this, Client);

    // Setup Headers
    this.middlewares = [];
    headers = Object.keys(headers).reduce(function (obj, key) {
      var keyName = key.split('-').map(function (part) {
        return part[0].toUpperCase() + part.slice(1, part.length);
      }).join('-');
      obj[keyName] = headers[key];
      return obj;
    }, {});
    this.headers = _extends({
      Accept: headers['Accept'] || 'application/vnd.api+json',
      'Content-Type': headers['Content-Type'] || 'application/vnd.api+json'
    }, headers);
    this.allowSetHeaders = allowSetHeaders;

    // Set baseUrl
    this.baseUrl = baseUrl;
  }

  _createClass(Client, [{
    key: 'addMiddleware',
    value: function addMiddleware(func) {
      this.middlewares.push(func);
    }

    // Invokes a GET against the API

  }, {
    key: 'get',
    value: function get(path, params, options) {
      return this.request('GET', path, undefined, params, options);
    }

    // Invokes a POST against the API

  }, {
    key: 'post',
    value: function post(path, data, params, options) {
      return this.request('POST', path, data, params, options);
    }

    // Invokes a PUT against the API

  }, {
    key: 'put',
    value: function put(path, data, params, options) {
      return this.request('PUT', path, data, params, options);
    }

    // Invokes a PATCH against the API

  }, {
    key: 'patch',
    value: function patch(path, data, params, options) {
      return this.request('PATCH', path, data, params, options);
    }

    // Invokes a DELETE against the API

  }, {
    key: 'delete',
    value: function _delete(path, data, params, options) {
      return this.request('DELETE', path, data, params, options);
    }

    // Invokes OPTIONS against the API

  }, {
    key: 'options',
    value: function options(path, params, _options) {
      return this.request('OPTIONS', path, undefined, params, _options);
    }

    // Invokes a request again the API

  }, {
    key: 'request',
    value: function request() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(_Request2.default, [null].concat([this], args)))().invoke();
    }
  }]);

  return Client;
}();

module.exports = Client;

},{"./Request":34}],27:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _Instance = require('./Instance.js');

var _Instance2 = _interopRequireDefault(_Instance);

var _optionsCache = require('../helpers/optionsCache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var Collection = function (_extendableBuiltin2) {
  _inherits(Collection, _extendableBuiltin2);

  function Collection(_ref, api, defaultResource) {
    var data = _ref.data;
    var links = _ref.links;
    var meta = _ref.meta;

    _classCallCheck(this, Collection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this));

    _this.api = api;
    _this.defaultResource = defaultResource;
    _this.optionsCache = _optionsCache.optionsCache.bind(_this);

    _this.links = Object.freeze(links || {});
    _this.meta = Object.freeze(meta || {});
    (data || []).forEach(function (instanceData) {
      _this.push(new _Instance2.default(instanceData, api, _this));
    }, _this);

    if (_this.constructor === Collection) {
      Object.freeze(_this);
    }
    return _this;
  }

  _createClass(Collection, [{
    key: 'first',
    value: function first() {
      return this[0];
    }
  }, {
    key: 'last',
    value: function last() {
      return this[this.length - 1];
    }
  }, {
    key: 'new',
    value: function _new(_ref2) {
      var type = _ref2.type;
      var attributes = _ref2.attributes;
      var relationships = _ref2.relationships;
      var id = _ref2.id;

      type = type || this.defaultResource.type;
      return new _Instance2.default({
        type: type,
        attributes: attributes,
        relationships: relationships,
        id: id
      }, this.api, this);
    }
  }, {
    key: 'create',
    value: function create(instanceData, params) {
      return this.new(instanceData).save(params);
    }
  }, {
    key: 'deleteAll',
    value: function deleteAll(params) {
      var api = this.api;
      var links = this.links;
      var meta = this.meta;
      var defaultResource = this.defaultResource;

      return Promise.all(this.map(function (instance) {
        return instance.delete(params);
      })).then(function (responses) {
        var collection = new Collection({
          data: [],
          links: links,
          meta: meta
        }, api, defaultResource);
        return {
          responses: responses,
          collection: collection
        };
      });
    }
  }, {
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      if (this.defaultResource) {
        var _defaultResource;

        return (_defaultResource = this.defaultResource).optionsCacheKey.apply(_defaultResource, additions);
      }
      return _path2.default.join.apply(_path2.default, [this.uri()].concat(additions));
    }
  }, {
    key: 'options',
    value: function options(params) {
      var _this2 = this;

      return (0, _optionsCache.optionsCache)(function () {
        return _this2.api.client.options(_this2.uri(), params).then(_processResponse2.default);
      });
    }
  }, {
    key: 'reload',
    value: function reload(params) {
      var _require = require('../helpers/builders');

      var buildCollectionWithResponse = _require.buildCollectionWithResponse;

      return this.api.client.get(this.uri(), params).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      var _require2 = require('../helpers/builders');

      var buildCollectionWithResponse = _require2.buildCollectionWithResponse;

      return this.api.client.get(this.links['next']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'prevPage',
    value: function prevPage() {
      var _require3 = require('../helpers/builders');

      var buildCollectionWithResponse = _require3.buildCollectionWithResponse;

      return this.api.client.get(this.links['prev']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'firstPage',
    value: function firstPage() {
      var _require4 = require('../helpers/builders');

      var buildCollectionWithResponse = _require4.buildCollectionWithResponse;

      return this.api.client.get(this.links['first']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'lastPage',
    value: function lastPage() {
      var _require5 = require('../helpers/builders');

      var buildCollectionWithResponse = _require5.buildCollectionWithResponse;

      return this.api.client.get(this.links['last']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'uri',
    value: function uri() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var u = _url2.default.parse(this.links.self || this.defaultResource.type);
      if (!params) {
        u.search = undefined;
        u.query = undefined;
      }
      return u.format();
    }
  }]);

  return Collection;
}(_extendableBuiltin(Array));

module.exports = Collection;

},{"../helpers/builders":39,"../helpers/optionsCache":42,"../helpers/processResponse.js":44,"./Instance.js":28,"path":14,"url":22}],28:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier2 = require('./ResourceIdentifier');

var _ResourceIdentifier3 = _interopRequireDefault(_ResourceIdentifier2);

var _errors = require('../errors');

var _instanceActions = require('../helpers/instanceActions');

var _optionsCache = require('../helpers/optionsCache');

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Instance = function (_ResourceIdentifier) {
  _inherits(Instance, _ResourceIdentifier);

  function Instance(_ref, api, collection) {
    var type = _ref.type;
    var id = _ref.id;
    var attributes = _ref.attributes;
    var links = _ref.links;
    var meta = _ref.meta;
    var relationships = _ref.relationships;

    _classCallCheck(this, Instance);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Instance).call(this, {
      type: type,
      id: id
    }));

    _this.api = api;
    _this.collection = collection;
    _this.optionsCache = _optionsCache.optionsCache.bind(_this);
    _this.attributes = Object.freeze(attributes || {});
    _this.links = Object.freeze(links || {});
    _this.meta = Object.freeze(meta || {});
    _this.relationships = Object.freeze(relationships);

    Object.freeze(_this);
    return _this;
  }

  // Checks whether or not the instance is persisted using a very
  // small response body


  _createClass(Instance, [{
    key: 'checkPersistence',
    value: function checkPersistence() {
      var instance = this;
      var params = { fields: {} };
      params.fields[this.type] = null;
      if (this.persisted) {
        return Promise.resolve(instance);
      }
      return this.reload(params).then(function () {
        return instance;
      });
    }
  }, {
    key: 'delete',


    // Deletes an instance, returning a new instance with the same attributes, but
    // with no ID. The instance can be recreated by calling save() on the instance
    value: function _delete(params) {
      return this.checkPersistence().then(_instanceActions.deleteInstance.bind(undefined, this, params));
    }
  }, {
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      var parentKey = void 0;
      var idKey = this.persisted && this.id ? ':id' : 'new';
      if (this.collection && !this.id) {
        parentKey = this.collection.optionsCacheKey();
      } else {
        parentKey = this.resource.optionsCacheKey();
      }

      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      return _path2.default.join.apply(_path2.default, [parentKey, idKey].concat(additions));
    }

    // Returns the request options

  }, {
    key: 'options',
    value: function options() {
      var _this2 = this;

      return this.optionsCache(function () {
        setTimeout(function () {
          return delete _this2.optionsCache[_this2.optionsCacheKey()];
        }, 120);
        return _this2.api.client.options(_this2.uri()).then(_processResponse2.default);
      });
    }

    // Fetches the related collection or instance

  }, {
    key: 'related',
    value: function related(name, params) {
      var RelatedProxy = require('./RelatedProxy').default;
      return new RelatedProxy(this, name, params);
    }

    // Gets options about the relation

  }, {
    key: 'relatedOptions',
    value: function relatedOptions(name) {
      var _this3 = this;

      return this.optionsCache(function () {
        return (0, _preparers.getRelationshipData)(_this3, name).then(function (_ref2) {
          var data = _ref2.data;
          var api = _ref2.api;

          return api.client.options(data.links.related);
        }).then(_processResponse2.default);
      }, name);
    }

    // Fetches the relationship

  }, {
    key: 'relationship',
    value: function relationship(name, params) {
      var RelationshipProxy = require('./RelationshipProxy').default;
      return new RelationshipProxy(this, name, params);
    }

    // Reloads the instance, returns a new instance object with the reloaded data

  }, {
    key: 'reload',
    value: function reload(params) {
      return (0, _instanceActions.reloadInstance)(this, params);
    }

    // Saves the instance, returns a new object with the saved data.

  }, {
    key: 'save',
    value: function save(params) {
      var instance = this;
      return this.checkPersistence().then(function () {
        return (0, _instanceActions.patchInstance)(instance, params);
      }).catch(function (error) {
        // Create the instance
        if (error instanceof _errors.NotPersistedError) {
          return (0, _instanceActions.postInstance)(instance, params);
        }
        throw error;
      });
    }
  }, {
    key: 'update',
    value: function update(_ref3, params) {
      var attributes = _ref3.attributes;
      var relationships = _ref3.relationships;

      return this.write({ attributes: attributes, relationships: relationships }).then(function (_ref4) {
        var instance = _ref4.instance;
        return instance.save(params);
      });
    }

    // Updates and returns a new instance object with the updated attributes

  }, {
    key: 'updateAttributes',
    value: function updateAttributes(attributes, params) {
      return this.write({ attributes: attributes }).then(function (_ref5) {
        var instance = _ref5.instance;

        return instance.save(params);
      });
    }
  }, {
    key: 'uri',
    value: function uri() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var selfUri = this.links.self;
      var parentUri = this.collection && this.collection.uri(false);
      var parts = [this.type];
      if (this.id) {
        parts.push(this.id);
      }
      var resourceUri = parts.join('/');
      var u = _url2.default.parse(selfUri || parentUri || resourceUri);
      if (!params) {
        u.search = undefined;
        u.query = undefined;
      }
      return u.format();
    }

    // Writes the new attributes, returns an instance with the newly written
    // attributes

  }, {
    key: 'write',
    value: function write(_ref6) {
      var _this4 = this;

      var attributes = _ref6.attributes;
      var relationships = _ref6.relationships;

      var _require = require('../helpers/builders');

      var buildInstance = _require.buildInstance;

      var newAttributes = {};
      var newRelationships = {};
      var keys = Object.keys(this.attributes).concat(Object.keys(attributes));
      keys.forEach(function (key) {
        if (attributes[key] !== undefined) {
          newAttributes[key] = attributes[key];
        } else {
          newAttributes[key] = _this4.attributes[key];
        }
      }, this);

      if (this.relationships) {
        keys.forEach(function (key) {
          if (attributes[key] !== undefined) {
            newAttributes[key] = attributes[key];
          } else {
            newAttributes[key] = _this4.attributes[key];
          }
        }, this);
      } else {
        newRelationships = relationships;
      }
      return buildInstance(this, {
        attributes: newAttributes,
        relationships: newRelationships
      });
    }
  }, {
    key: 'peristed',
    get: function get() {
      return Boolean(this.links.self);
    }
  }, {
    key: 'resource',
    get: function get() {
      return this.api.resource(this.type);
    }
  }]);

  return Instance;
}(_ResourceIdentifier3.default);

module.exports = Instance;

},{"../errors":38,"../helpers/builders":39,"../helpers/instanceActions":41,"../helpers/optionsCache":42,"../helpers/preparers":43,"../helpers/processResponse":44,"./RelatedProxy":32,"./RelationshipProxy":33,"./ResourceIdentifier":36,"path":14,"url":22}],29:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier = require('./ResourceIdentifier');

var _ResourceIdentifier2 = _interopRequireDefault(_ResourceIdentifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function itemsToResourceIdentifiers(resourceIdentifiers) {
  if (!(resourceIdentifiers instanceof Array)) {
    resourceIdentifiers = [resourceIdentifiers];
  }
  return resourceIdentifiers.map(function (_ref) {
    var type = _ref.type;
    var id = _ref.id;

    return {
      type: type,
      id: id
    };
  });
}

function modifyRelationship(_ref2, items, action, params) {
  var api = _ref2.api;
  var links = _ref2.links;

  return api.client[action](links.self, {
    data: itemsToResourceIdentifiers(items)
  }, params).then(_processResponse2.default).then(function (response) {
    var relationship = new ManyRelationship({
      api: api
    }, response);
    return {
      relationship: relationship,
      response: response
    };
  });
}

var ManyRelationship = function (_extendableBuiltin2) {
  _inherits(ManyRelationship, _extendableBuiltin2);

  function ManyRelationship(_ref3, _ref4) {
    var api = _ref3.api;
    var links = _ref4.links;
    var meta = _ref4.meta;
    var data = _ref4.data;

    _classCallCheck(this, ManyRelationship);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ManyRelationship).call(this));

    _this.api = api;
    _this.links = Object.freeze(links);
    _this.meta = Object.freeze(meta);
    _this.concat((data || []).map(function (d) {
      return new _ResourceIdentifier2.default(d, _this.api);
    }, _this));
    Object.freeze(_this);
    return _this;
  }

  _createClass(ManyRelationship, [{
    key: 'first',
    value: function first() {
      return this[0];
    }
  }, {
    key: 'last',
    value: function last() {
      return this[this.length - 1];
    }
  }, {
    key: 'add',
    value: function add(items, params) {
      return modifyRelationship(this, items, 'post', params);
    }
  }, {
    key: 'replace',
    value: function replace(items, params) {
      return modifyRelationship(this, items, 'patch', params);
    }
  }, {
    key: 'remove',
    value: function remove(items, params) {
      return modifyRelationship(this, items, 'delete', params);
    }
  }]);

  return ManyRelationship;
}(_extendableBuiltin(Array));

module.exports = ManyRelationship;

},{"../helpers/processResponse.js":44,"./ResourceIdentifier":36}],30:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ResourceIdentifier2 = require('./ResourceIdentifier');

var _ResourceIdentifier3 = _interopRequireDefault(_ResourceIdentifier2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_ResourceIdentifier) {
  _inherits(OneRelationship, _ResourceIdentifier);

  function OneRelationship(_ref, _ref2) {
    var api = _ref.api;
    var links = _ref2.links;
    var meta = _ref2.meta;
    var data = _ref2.data;

    _classCallCheck(this, OneRelationship);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OneRelationship).call(this, data));

    _this.links = links || {};
    _this.meta = meta || {};
    _this.api = api || {};
    Object.freeze(_this);
    return _this;
  }

  _createClass(OneRelationship, [{
    key: 'replace',
    value: function replace(item, params) {
      this.client.patch(this.links.self, {
        data: item ? item.resourceIdentifier : null
      }, params).then(_processResponse2.default).then(function (response) {
        var relationship = new OneRelationship(relationship, response);
        return {
          relationship: relationship,
          response: response
        };
      });
    }
  }]);

  return OneRelationship;
}(_ResourceIdentifier3.default);

},{"../helpers/processResponse":44,"./ResourceIdentifier":36}],31:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _Collection2 = require('./Collection.js');

var _Collection3 = _interopRequireDefault(_Collection2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RelatedCollection = function (_Collection) {
  _inherits(RelatedCollection, _Collection);

  function RelatedCollection(_ref, parent, relName, defaultResource) {
    var data = _ref.data;
    var links = _ref.links;
    var meta = _ref.meta;

    _classCallCheck(this, RelatedCollection);

    var api = parent.api;

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RelatedCollection).call(this, { data: data, links: links, meta: meta }, api, defaultResource));

    _this.parent = parent;
    _this.relationshipName = relName;
    if (_this.constructor === RelatedCollection) {
      Object.freeze(_this);
    }
    return _this;
  }

  _createClass(RelatedCollection, [{
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      var _parent;

      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      return (_parent = this.parent).optionsCacheKey.apply(_parent, [this.relationshipName].concat(additions));
    }
  }, {
    key: 'options',
    value: function options(params) {
      return this.api.client.options(this.uri(), params).then(_processResponse2.default);
    }
  }, {
    key: 'reload',
    value: function reload(params) {
      var _require = require('../helpers/builders');

      var buildCollectionWithResponse = _require.buildCollectionWithResponse;

      return this.api.client.get(this.uri(), params).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      var _require2 = require('../helpers/builders');

      var buildCollectionWithResponse = _require2.buildCollectionWithResponse;

      return this.api.client.get(this.links['next']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'prevPage',
    value: function prevPage() {
      var _require3 = require('../helpers/builders');

      var buildCollectionWithResponse = _require3.buildCollectionWithResponse;

      return this.api.client.get(this.links['prev']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'firstPage',
    value: function firstPage() {
      var _require4 = require('../helpers/builders');

      var buildCollectionWithResponse = _require4.buildCollectionWithResponse;

      return this.api.client.get(this.links['first']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'lastPage',
    value: function lastPage() {
      var _require5 = require('../helpers/builders');

      var buildCollectionWithResponse = _require5.buildCollectionWithResponse;

      return this.api.client.get(this.links['last']).then(_processResponse2.default).then(buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'uri',
    value: function uri() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var u = _url2.default.parse(this.links.self || this.defaultResource.type);
      if (!params) {
        u.search = undefined;
        u.query = undefined;
      }
      return u.format();
    }
  }]);

  return RelatedCollection;
}(_Collection3.default);

module.exports = RelatedCollection;

},{"../helpers/builders":39,"../helpers/processResponse.js":44,"./Collection.js":27,"url":22}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _RelatedCollection = require('./RelatedCollection');

var _RelatedCollection2 = _interopRequireDefault(_RelatedCollection);

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RelatedProxy = function () {
  function RelatedProxy(instance, name, params, url) {
    _classCallCheck(this, RelatedProxy);

    this.params = params;
    this.instance = instance;
    this.name = name;
    this.getUrl = url ? Promise.resolve(url) : (0, _preparers.getRelationshipData)(instance, name).then(function (_ref) {
      var data = _ref.data;
      return data.links.related;
    });
  }

  _createClass(RelatedProxy, [{
    key: 'create',
    value: function create() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var instance = this.instance;
      var name = this.name;
      var getUrl = this.getUrl;

      return getUrl.then(function (url) {
        var collection = new _RelatedCollection2.default({ data: [], links: { self: url } }, instance, name);
        return collection.create.apply(collection, args);
      });
    }
  }, {
    key: 'load',
    value: function load() {
      var instance = this.instance;
      var name = this.name;
      var params = this.params;
      var getUrl = this.getUrl;
      var api = instance.api;

      var _require = require('../helpers/builders');

      var buildCollectionOrInstance = _require.buildCollectionOrInstance;

      return getUrl.then(function (url) {
        return api.client.get(url, params);
      }).then(_processResponse2.default).then(function (response) {
        return buildCollectionOrInstance(instance, name, response);
      });
    }
  }, {
    key: 'reload',
    value: function reload() {
      return this.load();
    }
  }, {
    key: 'then',
    value: function then(fn) {
      return this.load().then(fn);
    }
  }]);

  return RelatedProxy;
}();

exports.default = RelatedProxy;

},{"../helpers/builders":39,"../helpers/preparers":43,"../helpers/processResponse":44,"./RelatedCollection":31}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _ManyRelationship = require('./ManyRelationship');

var _ManyRelationship2 = _interopRequireDefault(_ManyRelationship);

var _OneRelationship = require('./OneRelationship');

var _OneRelationship2 = _interopRequireDefault(_OneRelationship);

var _preparers = require('../helpers/preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function invoke(proxy, RelType, fnName) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var instance = proxy.instance;
  var getUrl = proxy.getUrl;
  var api = instance.api;

  return getUrl.then(function (url) {
    var relationship = new RelType({ api: api }, { links: { self: url } });
    return relationship[fnName].apply(relationship, args);
  });
}

var RelationshipProxy = function () {
  function RelationshipProxy(instance, name, params, url) {
    _classCallCheck(this, RelationshipProxy);

    this.instance = instance;
    this.name = name;
    this.params = params;
    this.getUrl = url ? Promise.resolve(url) : (0, _preparers.getRelationshipData)(instance, name).then(function (_ref) {
      var data = _ref.data;
      return data.links.related;
    });
  }

  _createClass(RelationshipProxy, [{
    key: 'load',
    value: function load() {
      var getUrl = this.getUrl;
      var params = this.params;
      var instance = this.instance;
      var api = instance.api;

      var _require = require('../helpers/builders');

      var buildOneOrManyRelationship = _require.buildOneOrManyRelationship;

      return getUrl.then(function (url) {
        return api.client.get(url, params);
      }).then(_processResponse2.default).then(function (response) {
        return buildOneOrManyRelationship(instance, response);
      });
    }
  }, {
    key: 'reload',
    value: function reload() {
      return this.load();
    }
  }, {
    key: 'add',
    value: function add() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return invoke.apply(undefined, [this, _ManyRelationship2.default, 'add'].concat(args));
    }
  }, {
    key: 'remove',
    value: function remove() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return invoke.apply(undefined, [this, _ManyRelationship2.default, 'remove'].concat(args));
    }
  }, {
    key: 'replace',
    value: function replace(itemOrArray) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      if (itemOrArray instanceof Array) {
        return invoke.apply(undefined, [_ManyRelationship2.default, 'replace', itemOrArray].concat(args));
      } else if (itemOrArray instanceof Object) {
        return invoke.apply(undefined, [this, _OneRelationship2.default, 'replace', itemOrArray].concat(args));
      }
    }
  }, {
    key: 'then',
    value: function then(fn) {
      return this.load().then(fn);
    }
  }]);

  return RelationshipProxy;
}();

exports.default = RelationshipProxy;

},{"../helpers/builders":39,"../helpers/preparers":43,"../helpers/processResponse":44,"./ManyRelationship":29,"./OneRelationship":30}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _jqueryParam = require('jquery-param');

var _jqueryParam2 = _interopRequireDefault(_jqueryParam);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _Response = require('./Response');

var _Response2 = _interopRequireDefault(_Response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function parseParams(search) {
  if (!search) {
    return {};
  }
  return search.replace(/(^\?)/, '').split('&').reduce(function (params, param) {
    var kv = param.split('=');
    var k = kv[0];
    var v = kv[1] || true;
    params[k] = v;
    return params;
  }, {});
}

var Request = function () {
  function Request(client, method, pathname, data, params) {
    var _ref = arguments.length <= 5 || arguments[5] === undefined ? {} : arguments[5];

    var _ref$headers = _ref.headers;
    var headers = _ref$headers === undefined ? {} : _ref$headers;

    _classCallCheck(this, Request);

    this.client = client;
    this.data = data;
    this.path = pathname || '';
    if (params) {
      this.params = _extends({}, this.params, params);
    }
    this.method = method || 'GET';
    this.headers = headers || {};
  }

  _createClass(Request, [{
    key: 'addHeader',
    value: function addHeader(key, value) {
      this._headers[key] = value;
      return this.headers[key];
    }
  }, {
    key: 'addParam',
    value: function addParam(key, value) {
      this.params[key] = value;
      return this.params[key];
    }
  }, {
    key: 'invoke',
    value: function invoke() {
      var _this = this;

      return this.client.middlewares.reduce(function (responseFns, mw) {
        responseFns.unshift(mw(_this));
        return responseFns;
      }, []).reduce(function (res, fn) {
        return res.then(fn);
      }, this.invokeWithoutMiddlware());
    }
  }, {
    key: 'invokeWithoutMiddlware',
    value: function invokeWithoutMiddlware() {
      var client = this.client;
      var method = this.method;
      var headers = this.headers;
      var body = this.body;
      if (body && this.method.toLowerCase() === 'delete') {
        headers['X-Http-Method-Override'] = this.method.toUpperCase();
        method = 'POST';
      }

      return (0, _isomorphicFetch2.default)(this.url, { headers: headers, body: body, method: method }).then(function (res) {
        var headersToSet = res.headers.get('x-jsonapionify-set-headers');
        if (client.allowSetHeaders && headersToSet) {
          headersToSet.split(',').forEach(function (value) {
            var kv = value.split('=');
            client.headers[kv[0]] = kv[1];
          });
        }
        return res.text().then(function (text) {
          return new _Response2.default(res, text);
        });
      });
    }
  }, {
    key: 'path',
    set: function set(value) {
      var baseUrl = _url2.default.parse(this.client.baseUrl);
      var url = _url2.default.parse(value);
      this.params = parseParams(url.search);
      if (url.pathname.indexOf(baseUrl.path) === 0) {
        this._path = url.pathname.replace(new RegExp('^' + baseUrl.path), '');
      } else {
        this._path = url.pathname;
      }
      return this._path;
    },
    get: function get() {
      return this._path;
    }
  }, {
    key: 'fullpath',
    get: function get() {
      return this.urlObject.path;
    }
  }, {
    key: 'headers',
    set: function set(val) {
      this._headers = val;
    },
    get: function get() {
      return _extends({}, this.client.headers, this._headers);
    }
  }, {
    key: 'urlObject',
    get: function get() {
      var baseUrl = _url2.default.parse(this.client.baseUrl);
      baseUrl.pathname = _path2.default.join(baseUrl.path, this.path);
      baseUrl.search = (0, _jqueryParam2.default)(this.params);
      return baseUrl;
    }
  }, {
    key: 'url',
    get: function get() {
      var url = _url2.default.format(this.urlObject);
      return url;
    }
  }, {
    key: 'body',
    set: function set(value) {
      this._body = value;
      return this.body;
    },
    get: function get() {
      return this._body || JSON.stringify(this.data);
    }
  }]);

  return Request;
}();

exports.default = Request;

},{"./Response":37,"isomorphic-fetch":12,"jquery-param":13,"path":14,"url":22}],35:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _processResponse = require('../helpers/processResponse.js');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _Collection = require('./Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _Instance = require('./Instance.js');

var _Instance2 = _interopRequireDefault(_Instance);

var _RelatedProxy = require('./RelatedProxy');

var _RelatedProxy2 = _interopRequireDefault(_RelatedProxy);

var _RelationshipProxy = require('./RelationshipProxy');

var _RelationshipProxy2 = _interopRequireDefault(_RelationshipProxy);

var _builders = require('../helpers/builders');

var _optionsCache = require('../helpers/optionsCache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Resource(type, api) {
    _classCallCheck(this, Resource);

    this.type = type;
    this.api = api;
    this.optionsCache = _optionsCache.optionsCache.bind(this);
    Object.freeze(this);
  }

  _createClass(Resource, [{
    key: 'list',
    value: function list(params) {
      return this.api.client.get(this.type, params).then(_processResponse2.default).then(_builders.buildCollectionWithResponse.bind(undefined, this));
    }
  }, {
    key: 'emptyCollection',
    value: function emptyCollection() {
      return new _Collection2.default({}, this.api, this);
    }
  }, {
    key: 'new',
    value: function _new(instanceData) {
      instanceData.type = this.type;
      return new _Instance2.default(instanceData, this.api);
    }
  }, {
    key: 'relatedForId',
    value: function relatedForId(id, name, params) {
      var parentInstance = this.new({ id: id });
      var url = this.type + '/' + id + '/' + name;
      return new _RelatedProxy2.default(parentInstance, name, params, url);
    }
  }, {
    key: 'relationshipForId',
    value: function relationshipForId(id, name, params) {
      var parentInstance = this.new({ id: id });
      var url = this.type + '/' + id + '/relationships/' + name;
      return new _RelationshipProxy2.default(parentInstance, name, params, url);
    }
  }, {
    key: 'create',
    value: function create(instanceData, params) {
      return this.new(instanceData).save(params);
    }
  }, {
    key: 'read',
    value: function read(id, params) {
      return new _Instance2.default({ type: this.type, id: id }, this.api).reload(params);
    }
  }, {
    key: 'uri',
    value: function uri() {
      return this.type;
    }
  }, {
    key: 'optionsCacheKey',
    value: function optionsCacheKey() {
      for (var _len = arguments.length, additions = Array(_len), _key = 0; _key < _len; _key++) {
        additions[_key] = arguments[_key];
      }

      return _path2.default.join.apply(_path2.default, [this.type].concat(additions));
    }
  }, {
    key: 'options',
    value: function options() {
      return this.api.client.options(this.type).then(_processResponse2.default);
    }
  }]);

  return Resource;
}();

},{"../helpers/builders":39,"../helpers/optionsCache":42,"../helpers/processResponse.js":44,"./Collection.js":27,"./Instance.js":28,"./RelatedProxy":32,"./RelationshipProxy":33,"path":14}],36:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function ResourceIdentifier() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var type = _ref.type;
    var id = _ref.id;

    _classCallCheck(this, ResourceIdentifier);

    this.type = type;
    this.id = id;
    if (this.constructor === ResourceIdentifier) {
      Object.freeze(this);
    }
  }

  _createClass(ResourceIdentifier, [{
    key: "resourceIdentifier",
    value: function resourceIdentifier() {
      return new ResourceIdentifier(this);
    }
  }]);

  return ResourceIdentifier;
}();

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Response = function () {
  function Response(_ref, text) {
    var ok = _ref.ok;
    var status = _ref.status;
    var statusText = _ref.statusText;
    var type = _ref.type;
    var url = _ref.url;
    var body = _ref.body;
    var headers = _ref.headers;

    _classCallCheck(this, Response);

    this.ok = ok;
    this.status = status;
    this.statusText = statusText;
    this.type = type;
    this.url = url;
    this.body = body;
    this.headers = headers;
    this.text = text;
  }

  _createClass(Response, [{
    key: "json",
    get: function get() {
      this._json = this._json || JSON.parse(this.text);
      return this._json;
    }
  }]);

  return Response;
}();

exports.default = Response;

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _extendableBuiltin7(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _extendableBuiltin5(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _extendableBuiltin3(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var CompositeError = exports.CompositeError = function (_extendableBuiltin2) {
  _inherits(CompositeError, _extendableBuiltin2);

  function CompositeError(response) {
    _classCallCheck(this, CompositeError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompositeError).call(this));

    _this.response = response;
    return _this;
  }

  _createClass(CompositeError, [{
    key: 'hasStatus',
    value: function hasStatus(code) {
      return this.errors.filter(function (error) {
        return parseInt(error.status, 10) === code;
      }).length > 1;
    }
  }, {
    key: 'errors',
    get: function get() {
      return this.response.json.errors;
    }
  }, {
    key: 'message',
    get: function get() {
      return this.errors.map(function (error) {
        var msg = '';
        if (error.status) {
          msg += error.status;
        }
        if (error.title) {
          msg += msg ? ' ' + error.title : error.title;
        }
        if (error.detail) {
          msg += msg ? ': ' + error.detail : error.detail;
        }
        return msg;
      }).join(', ');
    }
  }]);

  return CompositeError;
}(_extendableBuiltin(Error));

var VerbUnsupportedError = exports.VerbUnsupportedError = function (_extendableBuiltin4) {
  _inherits(VerbUnsupportedError, _extendableBuiltin4);

  function VerbUnsupportedError() {
    var _Object$getPrototypeO;

    _classCallCheck(this, VerbUnsupportedError);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(VerbUnsupportedError)).call.apply(_Object$getPrototypeO, [this].concat(args)));
  }

  return VerbUnsupportedError;
}(_extendableBuiltin3(Error));

var NotPersistedError = exports.NotPersistedError = function (_extendableBuiltin6) {
  _inherits(NotPersistedError, _extendableBuiltin6);

  function NotPersistedError() {
    var _Object$getPrototypeO2;

    _classCallCheck(this, NotPersistedError);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(NotPersistedError)).call.apply(_Object$getPrototypeO2, [this].concat(args)));
  }

  return NotPersistedError;
}(_extendableBuiltin5(Error));

var InvalidRelationshipError = exports.InvalidRelationshipError = function (_extendableBuiltin8) {
  _inherits(InvalidRelationshipError, _extendableBuiltin8);

  function InvalidRelationshipError() {
    var _Object$getPrototypeO3;

    _classCallCheck(this, InvalidRelationshipError);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _possibleConstructorReturn(this, (_Object$getPrototypeO3 = Object.getPrototypeOf(InvalidRelationshipError)).call.apply(_Object$getPrototypeO3, [this].concat(args)));
  }

  return InvalidRelationshipError;
}(_extendableBuiltin7(Error));

},{}],39:[function(require,module,exports){
'use strict';

var _require = require('./collectionModifiers');

var collectionWithInstance = _require.collectionWithInstance;
var collectionWithoutInstance = _require.collectionWithoutInstance;


function buildCollectionOrInstance(instance, relName, response) {
  var api = instance.api;
  var links = instance.links;
  var json = response.json;

  // Return the collection, we need to fetch the options to determine the
  // resource type

  if (json.data instanceof Array) {
    return buildRelatedCollectionWithResponse(instance, relName, response);
  } else if (json.data instanceof Object) {
    return buildInstanceWithResponse({ api: api }, response);
  } else if (json.data === null) {
    return buildEmptyInstanceWithResponse({ api: api, links: links }, response);
  }
}

function buildOneOrManyRelationship(_ref, response) {
  var api = _ref.api;

  var ManyRelationship = require('../classes/ManyRelationship.js');
  var OneRelationship = require('../classes/OneRelationship.js');
  var relationship = void 0;

  if (response.json.data instanceof Array) {
    relationship = new ManyRelationship({
      api: api
    }, response.json);
  } else {
    relationship = new OneRelationship({
      api: api
    }, response.json);
  }

  return {
    relationship: relationship,
    response: response
  };
}

function buildEmptyInstanceWithResponse(_ref2, response) {
  var api = _ref2.api;
  var links = _ref2.links;

  var Instance = require('../classes/Instance.js');
  return api.client.options(links.self).then(function (_ref3) {
    var optionsJson = _ref3.json;

    return new Instance({
      type: optionsJson.meta.type,
      links: {
        self: response.json.links.self
      }
    }, api);
  });
}

function buildDeletedInstanceWithResponse(_ref4, response) {
  var collection = _ref4.collection;
  var type = _ref4.type;
  var attributes = _ref4.attributes;
  var api = _ref4.api;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance({
    type: type,
    attributes: attributes
  }, api);
  var newCollection = collectionWithoutInstance(collection, instance);
  return {
    instance: instance,
    collection: newCollection,
    response: response
  };
}

function buildInstanceWithResponse(_ref5, _ref6) {
  var collection = _ref5.collection;
  var api = _ref5.api;
  var json = _ref6.json;
  var response = _ref6.response;

  var Instance = require('../classes/Instance.js');
  var instance = new Instance(json.data, api);
  var newCollection = collectionWithInstance(collection, instance);
  return {
    instance: instance,
    response: response,
    collection: newCollection
  };
}

function buildRelatedCollectionWithResponse(parent, relName, responseObj) {
  var json = responseObj.json;
  var response = responseObj.response;

  var RelatedCollection = require('../classes/RelatedCollection.js');
  return parent.relatedOptions(relName).then(function (_ref7) {
    var optsJson = _ref7.json;

    var defResource = parent.api.resource(optsJson.meta.type);
    var collection = new RelatedCollection(json, parent, relName, defResource);
    return {
      collection: collection,
      response: response
    };
  });
}

function buildCollectionWithResponse(_ref8, _ref9) {
  var api = _ref8.api;
  var type = _ref8.type;
  var json = _ref9.json;
  var response = _ref9.response;

  var collection = void 0;
  var uri = response.url;
  var Collection = require('../classes/Collection.js');
  if (type) {
    collection = new Collection(json, api, type);
    return {
      collection: collection,
      response: response
    };
  }
  return api.client.options(uri).then(function (_ref10) {
    var optionsJson = _ref10.json;

    var defaultResource = api.resource(optionsJson.meta.type);
    collection = new Collection(json, api, defaultResource);
    return {
      collection: collection,
      response: response
    };
  });
}

function buildInstance() {
  var oldOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var newOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var Instance = require('../classes/Instance.js');
  var instance = new Instance({
    type: newOptions.type || oldOptions.type,
    id: newOptions.id || oldOptions.id,
    links: newOptions.links || oldOptions.links,
    meta: newOptions.meta || oldOptions.meta,
    relationships: newOptions.relationships || oldOptions.relationships,
    attributes: newOptions.attributes || oldOptions.attributes
  }, oldOptions.api);
  return Promise.resolve({
    instance: instance
  });
}

module.exports = {
  buildCollectionOrInstance: buildCollectionOrInstance,
  buildOneOrManyRelationship: buildOneOrManyRelationship,
  buildInstance: buildInstance,
  buildDeletedInstanceWithResponse: buildDeletedInstanceWithResponse,
  buildInstanceWithResponse: buildInstanceWithResponse,
  buildCollectionWithResponse: buildCollectionWithResponse
};

},{"../classes/Collection.js":27,"../classes/Instance.js":28,"../classes/ManyRelationship.js":29,"../classes/OneRelationship.js":30,"../classes/RelatedCollection.js":31,"./collectionModifiers":40}],40:[function(require,module,exports){
'use strict';

var _Collection = require('../classes/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Collection Modifiers
function collectionWithoutInstance(collection, instance) {
  if (!(collection instanceof _Collection2.default) || !instance) {
    return collection;
  }
  var instanceIndex = collection.indexOf(instance);
  var data = Array.of.apply(Array, _toConsumableArray(collection)).splice(0, instanceIndex);
  var links = collection.links;
  var meta = collection.meta;

  return new _Collection2.default({
    data: data,
    links: links,
    meta: meta
  }, collection.api, collection.defaultResource);
}

function collectionWithInstance(collection, instance) {
  if (!(collection instanceof _Collection2.default) || !instance) {
    return collection;
  }
  var data = Array.of.apply(Array, _toConsumableArray(collection).concat([instance]));
  var links = collection.links;
  var meta = collection.meta;

  return new _Collection2.default({
    data: data,
    links: links,
    meta: meta
  }, collection.api, collection.defaultResource);
}

module.exports = {
  collectionWithInstance: collectionWithInstance,
  collectionWithoutInstance: collectionWithoutInstance
};

},{"../classes/Collection":27}],41:[function(require,module,exports){
'use strict';

var _processResponse = require('../helpers/processResponse');

var _processResponse2 = _interopRequireDefault(_processResponse);

var _errors = require('../errors');

var _preparers = require('./preparers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reloadInstance(instance, params) {
  var _require = require('./builders');

  var buildInstanceWithResponse = _require.buildInstanceWithResponse;

  var uri = instance.uri();
  var collectionUri = instance.collection && instance.collection.uri();
  if (uri === undefined || uri === collectionUri || instance.id === undefined) {
    return Promise.reject(new _errors.NotPersistedError('Instance is not persisted'));
  }
  return instance.api.client.get(uri, params).then(_processResponse2.default).then(buildInstanceWithResponse.bind(undefined, instance)).catch(function (error) {
    if (error.hasStatus instanceof Function && error.hasStatus(404)) {
      return Promise.reject(new _errors.NotPersistedError('Instance is not persisted'));
    }
    throw error;
  });
}

function deleteInstance(instance, params) {
  var _require2 = require('./builders');

  var buildDeletedInstanceWithResponse = _require2.buildDeletedInstanceWithResponse;

  return instance.api.client.delete(instance.links.self, params).then(buildDeletedInstanceWithResponse.bind(undefined, instance));
}

function patchInstance(instance, params) {
  var _require3 = require('./builders');

  var buildInstanceWithResponse = _require3.buildInstanceWithResponse;

  return (0, _preparers.prepareInstanceRequestBodyFor)(instance, 'PATCH').then(function (body) {
    return instance.api.client.patch(instance.uri(), body, params).then(_processResponse2.default).then(buildInstanceWithResponse.bind(undefined, instance));
  });
}

function postInstance(instance, params) {
  var _require4 = require('./builders');

  var buildInstanceWithResponse = _require4.buildInstanceWithResponse;

  return (0, _preparers.prepareInstanceRequestBodyFor)(instance, 'POST').then(function (body) {
    return instance.api.client.post(instance.uri(), body, params).then(_processResponse2.default).then(buildInstanceWithResponse.bind(undefined, instance));
  });
}

module.exports = {
  deleteInstance: deleteInstance,
  patchInstance: patchInstance,
  postInstance: postInstance,
  reloadInstance: reloadInstance
};

},{"../errors":38,"../helpers/processResponse":44,"./builders":39,"./preparers":43}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var optsCache = {};

function optionsCache(fn) {
  var _this = this;

  for (var _len = arguments.length, additions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    additions[_key - 1] = arguments[_key];
  }

  var expiresIn = 30000;
  var key = this.optionsCacheKey.apply(this, additions);
  var time = new Date();
  var promise = void 0;

  // Cache Hit
  if (optsCache[key] && time - optsCache[key].time < expiresIn) {
    promise = optsCache[key].promise;
  } else {
    // Cache Miss
    delete optsCache[key];
    promise = fn();
    var retrys = 0;
    optsCache[key] = { promise: promise, time: time, retrys: retrys };
  }

  return promise.catch(function (reason) {
    if (optsCache[key]) {
      if (optsCache[key].retrys++ > 3) {
        delete optsCache[key];
        throw reason;
      }
      return optionsCache.bind(_this).apply(undefined, [fn].concat(additions));
    }
    throw reason;
  });
}

function clearOptionsCache() {
  Object.keys(optsCache).forEach(function (key) {
    return delete optsCache[key];
  });
}

exports.optionsCache = optionsCache;
exports.clearOptionsCache = clearOptionsCache;

},{}],43:[function(require,module,exports){
'use strict';

var _errors = require('../errors');

// Prep Instance Data
function prepareInstanceRequestBodyFor(instance, verb) {
  return instance.options().then(function (_ref) {
    var json = _ref.json;

    var attributes = {};
    var relationships = {};

    if (json.meta.requests[verb] === undefined) {
      throw new _errors.VerbUnsupportedError('\'' + instance.uri() + '\' does not support \'' + verb + '\'');
    }

    if (instance.attributes) {
      json.meta.requests[verb].request_attributes.forEach(function (attr) {
        var value = instance.attributes[attr.name];
        if (value) {
          attributes[attr.name] = instance.attributes[attr.name];
        }
      });
    }

    if (instance.relationships) {
      json.meta.requests[verb].relationships.forEach(function (rel) {
        var value = instance.relationships[rel.name];
        if (value) {
          relationships[rel.name] = instance.relationships[rel.name];
        }
      });
    }

    var body = { data: { type: instance.type } };

    if (Object.keys(attributes)) {
      body.data.attributes = attributes;
    }

    if (Object.keys(attributes)) {
      body.data.relationships = relationships;
    }

    if (instance.id) {
      body.data.id = instance.id;
    }
    return body;
  });
}

function getRelationshipData(instance, name) {
  var error = new _errors.InvalidRelationshipError(name + ' is not a valid relationship');
  var api = instance.api;
  var relationships = instance.relationships;

  if (instance.relationships === undefined) {
    var fields = {};
    fields[instance.type] = name;
    return instance.reload({ fields: fields }).then(function (_ref2) {
      var reloadedInstance = _ref2.instance;

      var data = reloadedInstance.relationships[name];
      if (data === undefined) {
        throw error;
      }
      return {
        data: data,
        api: api
      };
    });
  }
  var data = relationships[name];
  if (data === undefined) {
    throw error;
  }
  return Promise.resolve({
    data: data,
    api: api
  });
}

module.exports = {
  prepareInstanceRequestBodyFor: prepareInstanceRequestBodyFor,
  getRelationshipData: getRelationshipData
};

},{"../errors":38}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errors = require('../errors');

function processResponse(response) {
  return new Promise(function (resolve, reject) {
    var json = response.json;
    if (json.errors) {
      reject(new _errors.CompositeError(response));
    } else {
      resolve({
        json: json,
        response: response
      });
    }
  });
}

exports.default = processResponse;

},{"../errors":38}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Client = require('./classes/Client');

var _Client2 = _interopRequireDefault(_Client);

var _Resource = require('./classes/Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _errors = require('./errors');

var Errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('colors');

var JSONAPIonify = function () {
  function JSONAPIonify(baseUrl, ClientOptions) {
    _classCallCheck(this, JSONAPIonify);

    this.url = baseUrl;
    this.client = new _Client2.default(baseUrl, ClientOptions);
  }

  _createClass(JSONAPIonify, [{
    key: 'resource',
    value: function resource(name) {
      return new _Resource2.default(name, this);
    }
  }, {
    key: 'addMiddleware',
    value: function addMiddleware() {
      var _client;

      return (_client = this.client).addMiddleware.apply(_client, arguments);
    }
  }]);

  return JSONAPIonify;
}();

JSONAPIonify.Logger = _logger2.default;
JSONAPIonify.Errors = Errors;
exports.default = JSONAPIonify;

},{"./classes/Client":26,"./classes/Resource":35,"./errors":38,"./logger":46,"colors":5}],46:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringJust = require('string-just');

function colorStatus(status) {
  var color = 'white';
  if (status < 300) {
    color = 'green';
  } else if (status < 400) {
    color = 'cyan';
  } else if (status < 500) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  return ('' + status)[color];
}

function colorDuration(duration) {
  var color = 'white';
  if (duration < 500) {
    color = 'green';
  } else if (duration < 1000) {
    color = 'yellow';
  } else if (duration < 2500) {
    color = 'magenta';
  } else {
    color = 'red';
  }
  return (0, _stringJust.ljust)(duration + ' ms', '10000.00 ms'.length)[color];
}

function colorMethod(method) {
  var colormap = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'yellow',
    PATCH: 'yellow',
    DELETE: 'red',
    OPTIONS: 'cyan',
    HEAD: 'white'
  };
  return ('' + (0, _stringJust.ljust)(method, 'OPTIONS'.length))[colormap[method]];
}

function colorUrl(url) {
  return ('' + url)['white'];
}

exports.default = function (request) {
  var method = request.method;
  var url = request.url;

  var start = new Date();
  return function (response) {
    var status = response.status;

    var duration = (new Date() - start).toFixed(2);
    global.console.log([(0, _stringJust.ljust)('JSONAPI', 10), '|', colorMethod(method), '>', colorStatus(status), '|', colorDuration(duration), '|', colorUrl(url)].join(' '));
    return response;
  };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"string-just":20}]},{},[25]);
