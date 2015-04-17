var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});

var theForm = document.getElementById("comment");
theForm.onsubmit = function(e) {
	var comment = document.getElementById("commentText");
	if (comment.value == '') {
		return false;
	}
	socket.emit('comment', comment.value);
	comment.value =''
	return false;
};

socket.on('comment', function(data) {
	console.log(data);
	var text = data;
	var comments = document.getElementById("comments");
	comments.innerHTML = comments.innerHTML + '<br />' + text;
});

SC.initialize({
	client_id: "6e73cbbe5e7edeba75334acbeb81492f"
});

var request = new XMLHttpRequest();
request.open("GET", "http://api.soundcloud.com/resolve.json?url=https://www.souncloud.com/lazyboyzmusic/og-robert-johnson&client_id=6e73cbbe5e7edeba75334acbeb81492f");
request.send();
console.log(request.responseText);
SC.get("/resolve.json?url=https://www.souncloud.com/lazyboyzmusic/og-robert-johnson", function(sound){
	console.log(sound);
});