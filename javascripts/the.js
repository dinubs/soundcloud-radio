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