var resolve = require("soundcloud-resolve");

var socket = io.connect('http://localhost:3000');

currentTrack = new Audio();

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
		if (err) return false;
		socket.emit('add track', body);
	});
	return false;
}

socket.on('comment', function(data) {
	var text = data;
	var comments = document.getElementById("comments");
	comments.innerHTML = comments.innerHTML + '<br />' + text;
});

socket.on('set audio player', function(data) {
	currentTrack.src = data.stream;
	currentTrack.currentTime = data.currentTime / 1000;
	currentTrack.play();
})