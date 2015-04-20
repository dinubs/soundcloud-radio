window.onload = function() {
	soundManager.setup({
				  
	});

	var resolve = require("soundcloud-resolve");

	var socket = io.connect("http://localhost:3000");

	var currentTrack = new Audio();

	var nowPlayingImage = document.getElementById("nowPlayingImage");
	var nowPlayingInfo = document.getElementById("nowPlayingInfo");


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

	function comment(text) {
		var comments = document.getElementById("comments");
		comments.innerHTML = text + "<br />" + comments.innerHTML;
	}

	socket.on('set audio player', function(data) {
		// console.log(data.soundcloud);
		var soundcloudInfo = data.soundcloud;

		nowPlayingImage.src = soundcloudInfo.artwork_url;
		nowPlayingInfo.innerText = soundcloudInfo.title;

		currentTrack.src = data.stream;
		var playing = false;
		currentTrack.addEventListener("canplay", function() {
	        if (!playing) {
	        	this.currentTime = data.currentTime / 1000;        
	        	playing = true;
	        }
	     },true);
		// currentTrack.currentTime = data.currentTime / 1000;

		currentTrack.play();
	});
}