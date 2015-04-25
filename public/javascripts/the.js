(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.onload = function() {
	soundManager.setup({
				  
	});

	var resolve = require("soundcloud-resolve");

	var socket = io.connect(window.location.href);

	var progressPart = document.querySelector(".progress-part");
	currentTrack = new Audio();
	setInterval(function() {

	});

	var nowPlayingImage = document.getElementById("playlist-img");
	var nowPlayingInfo = document.getElementById("title");
	var linkToSoundcloud = document.querySelector(".request-button");

	var commentForm = document.getElementById("comment");
	commentForm.onsubmit = function(e) {
		var comment = document.getElementById("commentText");
		if (comment.value == '') {
			return false;
		}
		socket.emit('comment', comment.value);
		comment.value =''
		return false;
	};

	var trackForm = document.getElementById("track");
	trackForm.onsubmit = function(e) {
		var track = document.getElementById("url");
		resolve("6e73cbbe5e7edeba75334acbeb81492f", track.value, function(err, body, stream_url) {
			console.log(err);
			if (err || body.kind == 'playlist' || body.streamable == false) {
				comment("Sorry that track is not playable!");
				return false;
			}
			socket.emit('add track', body);
			comment("This track has been added to the queue!!!");
		});
		track.value = '';
		return false;
	}

	socket.on('comment', function(data) {
		var text = data;
		comment(text);
	});
	var odd = true;
	function comment(text) {
		var comments = document.getElementById("comments");
		if (odd) {
			comments.innerHTML = "<li class='odd'>" + text + "</li>" + comments.innerHTML;	
			odd = false;
		} else {
			comments.innerHTML = "<li>" + text + "</li>" + comments.innerHTML;
			odd = true;
		}
	}

	socket.on('set audio player', function(data) {
		console.log(data.soundcloud);
		var soundcloudInfo = data.soundcloud;

		nowPlayingImage.src = soundcloudInfo.artwork_url;
		if (nowPlayingInfo.innerText) {
			nowPlayingInfo.innerText = soundcloudInfo.title;
		} else {
			nowPlayingInfo.textContent = soundcloudInfo.title;
		}

		currentTrack.src = data.stream;
		var playing = false;
		currentTrack.addEventListener("canplay", function() {
	        if (!playing) {
	        	this.currentTime = data.currentTime / 1000;        
	        	playing = true;
	        }
	     },true);
		colors(nowPlayingImage);
		linkToSoundcloud.href = soundcloudInfo.permalink_url;
		// currentTrack.currentTime = data.currentTime / 1000;
		currentTrack.ontimeupdate = function() {
			var percent = this.currentTime / this.duration * 100;
			progressPart.style.width = percent + "%";
		};
		currentTrack.play();
	});
	function colors(image) {
		var img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = image.src;
		img.onload = function () {
			var colorThief = new ColorThief();
			var c = colorThief.getPalette(img, 2);
			if (calcLuminance(c[0][0], c[0][1], c[0][2]) < calcLuminance(c[1][0], c[1][1], c[1][2])){
				imgColor = "rgba(" + c[0][0] + "," + c[0][1] + "," + c[0][2] + ",1)";
				barColor = "rgba(" + c[1][0] + "," + c[1][1] + "," + c[1][2] + ",1)";
				darkColors = c[0];
				lightColors = c[1];
			} else {
				barColor = "rgba(" + c[0][0] + "," + c[0][1] + "," + c[0][2] + ",1)";
				imgColor = "rgba(" + c[1][0] + "," + c[1][1] + "," + c[1][2] + ",1)";
				darkColors = c[1];
				lightColors = c[0];
			}
			// console.log(darkenColor(rgbColors[0],rgbColors[1],rgbColors[2], .1));
			var playlistWrap = document.querySelector(".playlist-wrap");
			playlistWrap.style.backgroundColor = imgColor;
			playlistWrap.style.color = barColor;
			var progressFull = document.querySelector(".progress-full");
			progressFull.style.backgroundColor = darkenColor(darkColors[0],darkColors[1],darkColors[2], -0.3);
			var progressPart = document.querySelector(".progress-part");
			progressPart.style.backgroundColor = darkenColor(lightColors[0],lightColors[1],lightColors[2], -0.3);
	    };
	}
	function calcLuminance(r, g, b)
	{
	    return (r*0.299 + g*0.587 + b*0.114) / 256;
	}
	function darkenColor(r, g, b, amount) {
		r = Math.ceil(r - (r * amount));
		g = Math.ceil(g - (g * amount));
		b = Math.ceil(b - (b * amount));
		return "rgb("+r+","+g+","+b+")";
	}
}
},{"soundcloud-resolve":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":2,"./encode":3}],5:[function(require,module,exports){
var qs  = require('querystring')
var xhr = require('xhr')

module.exports = resolve

function resolve(id, goal, callback) {
  var uri = 'http://api.soundcloud.com/resolve.json?' + qs.stringify({
      url: goal
    , client_id: id
  })

  xhr({
      uri: uri
    , method: 'GET'
  }, function(err, res, body) {
    if (err) return callback(err)
    try {
      body = JSON.parse(body)
    } catch(e) {
      return callback(e)
    }
    if (body.errors) return callback(new Error(
      body.errors[0].error_message
    ))

    var stream_url = body.kind === 'track'
      && body.stream_url + '?client_id=' + id

    return callback(null, body, stream_url)
  })
}

},{"querystring":4,"xhr":6}],6:[function(require,module,exports){
var window = require("global/window")
var once = require("once")

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ?
        window.XMLHttpRequest : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr

    if (options.cors) {
        xhr = new XDR()
    } else {
        xhr = new XHR()
    }

    var uri = xhr.url = options.uri
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var isJson = false

    if ("json" in options) {
        isJson = true
        headers["Content-Type"] = "application/json"
        body = JSON.stringify(options.json)
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    // hate IE
    xhr.ontimeout = noop
    xhr.open(method, uri)
    if (options.cors) {
        xhr.withCredentials = true
    }
    xhr.timeout = "timeout" in options ? options.timeout : 5000

    if ( xhr.setRequestHeader) {
        Object.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, headers[key])
        })
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function load() {
        var error = null
        var status = xhr.statusCode = xhr.status
        var body = xhr.body = xhr.response ||
            xhr.responseText || xhr.responseXML

        if (status === 0 || (status >= 400 && status < 600)) {
            var message = xhr.responseText ||
                messages[String(xhr.status).charAt(0)]
            error = new Error(message)

            error.statusCode = xhr.status
        }

        if (isJson) {
            try {
                body = xhr.body = JSON.parse(body)
            } catch (e) {}
        }

        callback(error, xhr, body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}

},{"global/window":7,"once":8}],7:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}]},{},[1]);
