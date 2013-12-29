

$( document ).ready(function() {
  videojs('vid3', { "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }).ready(function() {
		// Cue a video using ended event
		this.one('ended', function() {
			this.src('http://www.youtube.com/watch?v=jofNR_WkoCE');
		});
	});
});


//SCRAPING FUNCTIONS---------------------------
//VIDINFO CLASS
function vidInfo(src, width, height, type){
	this.src = src;
	this.size = [width, height];
	this.type = type;
}

//PARSE THE JSON DATA FROM YQL
function doParseData(o){  
	 alert("BEGINNING PARSE");
	//alert("parsing data"+o.query.results.iframe[0]);

	 var urlList = new Array();
     var items = o.query.results.iframe;
     var itemsNum=items.length;  
	 
     for(var i=0;i<itemsNum;i++){  
	 
	  	var itemInfo = new vidInfo();
		itemInfo.src = items[i].src;
	  	itemInfo.size = [items[i].width,items[i].height];
		itemInfo.type = "NULL";
		console.log(itemInfo.src + "  ***** "  + itemInfo.size[0] + itemInfo.size[1]);
		urlList.push(itemInfo);
	 }
	 
	 alert("done parsing data")
	 
	 //write to global variable
	 window.myVideoList = urlList;
	 
	 //clean the parsed data
	 scrapeMotionographer();
}

//CYCLE THROUGH AND PRINT THE SCRAPED DATA
function scrapeMotionographer(){
		
	alert("PRINTING MOTIONOGRAPHER SCRAPE");
	var myExtras = document.getElementById("Extras");
	
	totalLinks = window.myVideoList.length;
	
	myExtras.insertAdjacentHTML("beforeEnd", "LINKS ARE: </p>");
	
	for(x=0;x<totalLinks;x++){
		//FEED THE PARSED DATA BACK INTO THE GLOBAL LIST
		try{
			window.myVideoList[x].src = parseSrc(window.myVideoList[x].src);
			console.log("cleaning videoList "+window.myVideoList[x].src);
		}
		catch(e){
			console.log("somthing fucked up with "+e);	
		}
		
		//DETECT VIDEOTYPE
		window.myVideoList[x].type = detectVideoType(window.myVideoList[x].src);
		console.log("getting type "+window.myVideoList[x].type);

		
		//PRINT CUR ITEM
		//myExtras.insertAdjacentHTML("beforeEnd", src + " " + width + " " + height + "</p>" );
		//console.log(window.myVideoList[x].src + "  ***** "  + window.myVideoList[x].size[0] + "  " + window.myVideoList[x].size[1] + "<br>");
		
	}
	
	//this call will begin a loop! (because each video instance
	//spawns a new one upon its death.
	
	playNextVideo();
	
}

function playNextVideo(){
	var videoInfo = window.myVideoList[0];
	videojs('vid', { "techOrder": [videoInfo.type], "src": videoInfo.src }).ready(function() {
		// Cue a video using ended event
		this.one('ended', function() {
			//this.src('http://www.youtube.com/watch?v=jofNR_WkoCE');
		});
	});
}

//PARSE SCRAPED URL STRINGS
function parseSrc(src){
	
	splitSrc = src.split("?");
	if (splitSrc.length > 0){
		src = splitSrc[0];
	}
	
	slashAt = src.indexOf("//");
	if (slashAt == 0){
		src = src.substring(2);
	}

	//PARSE VIMEO LINKS
	pAt = src.indexOf("player.");
	if(pAt == 0){
		src = src.substring(7);
	}
	
	vAt = src.indexOf("vimeo");
	if (vAt != -1){
		splitSrc3 = src.split("/video/");
		if (splitSrc3.length >0){
			src = splitSrc3[0]+"/"+splitSrc3[1];	
		}
	}
	
	//add http for those that need it
	httpAt = src.indexOf("http://");
	if (httpAt == -1){
		src = ("http://"+src);
	}
	
	//alert("PARSED "+src);	
	return src;
	
}

function detectVideoType(src){

	if( src.indexOf('vimeo') >= 0){
		return "vimeo";
	}else if( src.indexOf('youtube') >= 0){
		return "youtube";
	}else{
		return "standard";	
	}
}