function doParseData(){
	console.log("function goes here!")
}

$( document ).ready(function() {
  videojs('vid3', { "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }).ready(function() {
		// Cue a video using ended event
		this.one('ended', function() {
			this.src('http://www.youtube.com/watch?v=jofNR_WkoCE');
		});
	});
});