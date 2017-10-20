
var fs = require("fs");


var Mopidy = require("mopidy");

var mopidy = new Mopidy({
    autoConnect: true,
    webSocketUrl : "ws://127.0.0.1:6680/mopidy/ws/",
    callingConvention : "by-position-or-name"
});


var searchAndPlay = function(query){
	if (!query){
		query = "birthday";	
	}
	
	var queryObj = {
		'track_name':[query]
	};
	console.log("searching");
	mopidy.library.search(queryObj).then(function(results){
		console.log(results);
		for(var i = 0; i< results.length; i++){
			if(results[i].tracks && results[i].uri && results[i].uri.match("spotify")){
				var tracks = results[i].tracks;
				mopidy.tracklist.add(tracks).then(function(tracks){
					console.log("added tracks");
					console.log(JSON.stringify(tracks));
				});
			}
		}
        });
}

var shuffle = function(){
  return mopidy.tracklist.shuffle();
};

var setVolumeLow = function(){
	return mopidy.mixer.setVolume(5);
};

var setVolumeMedium = function(){
	return mopidy.mixer.setVolume(15);
};

var setVolumeHigh = function(){
	return mopidy.mixer.setVolume(25);
};

var allPlaylists = [];
var listPlaylists = function(){
  mopidy.playlists.asList().then(function(data){
//	  console.log(data);
	  for (var i=0; i < data.length; i++){
		allPlaylists[data[i].uri] = data[i];	  
	  }
  });
};

//mopidy.on(console.log.bind(console));

var mopidy_online = false;

mopidy.on("state:online", function(){
    listPlaylists();
    setVolumeLow();

	
    searchAndPlay("love");
	    
    
});



