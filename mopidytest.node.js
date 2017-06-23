
var fs = require("fs");


var Mopidy = require("mopidy");

var mopidy = new Mopidy({
    autoConnect: true,
    webSocketUrl : "ws://127.0.0.1:6680/mopidy/ws/",
    callingConvention : "by-position-or-name"
});

var interruptSong = "welcomeToMakerHub.mp3";


var interruptWithTrack = function(){
	// get current track and time position
console.log("interrupting");
        var songDir = "file:";
        interruptSong = "welcomeToMakerHub.mp3";
        var interruptUri = songDir + interruptSong;

	var currentTrack, currentPosition, newTrack;
        var whenDone;
        whenDone = function(track){
                console.log("track done");
                console.log(track);
                console.log(currentTrack);
		mopidy.playback.play(currentTrack).then(function(){
			mopidy.playback.pause().then(function(){
				mopidy.playback.seek(currenPosition).then(function(){
					mopidy.tracklist.remove(newTrack).then(function(){
						mopidy.off("event:trackPlaybackEnded", whenDone);
					})
				})
			})
		}).done();
        };
	
	// end playback
	mopidy.playback.getCurrentTrack().then(function(track){
		currentTrack = track;
		mopidy.playback.getTimePosition(function(pos){
			currentPosition = pos;
			mopidy.playback.pause().then(function(){
				mopidy.playback.stop().then(function(){
					mopidy.on("event:trackPlaybackEnded", whenDone).then(function(){
						mopidy.tracklist.add(null, 0, "file:///home/pi/Music/welcomeToMakerHub.mp3").then(function(tracks){
							console.log(JSON.stringify(tracks));
							newTrack = tracks[0];
							console.log("newTrack is ");
							console.log(JSON.stringify(newTrack));
							mopidfy.playback.play(newTrack);
						})							
					})
				})
			})
		})
	}).done();
	
};

var playPlaylist = function(playlist_uri){
  console.log("in playPlayList");
  console.log("playlist is " + playlist_uri);

  var playlist = allPlaylists[playlist_uri];
  var playlist_data;

  mopidy.playback.stop().then(function(){
	  console.log("clearing");
	  mopidy.tracklist.clear().then(function(){
		console.log("lookup");
		mopidy.library.lookup(playlist_uri).then(function(data){
			console.log("add");
			mopidy.tracklist.add(data).then(function(){
				console.log("shuffle");
				mopidy.tracklist.shuffle().then(function(){
					console.log("play");
					mopidy.playback.play();
				})
			})
		})
	  })
  }).done(); 
};


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
	/*
    mopidy.library.refresh().then(function(){
//	mopidy.library.search({"track_name":"welcomeToMakerHub.mp3"}).then(function(res){
//	mopidy.library.search({"uri":"local:"}).then(function(res){
	mopidy.library.search({}, uris=["file:"]).then(function(res){
		console.log("results are");
		console.log(JSON.stringify(res[0]));
	}).done();
	*/
    playPlaylist("spotify:user:donundeen:playlist:6wgip2mM9hKKjc9MgUbJxL");		  
setTimeout(interruptWithTrack, 3000);
	    
    
});

//mopidy.on(console.log.bind(console));

mopidy.on("event:trackPlaybackStarted", function(track){
	console.log("track playback started 2");
	console.log(JSON.stringify(track, null, 2));
	try{
		console.log("artist " + track.tl_track.track.artists[0].name);
	}catch(artisterror){
		console.log("error getting track artists name");	
	}
	try{
		console.log("song " + track.tl_track.track.name);
	}catch(titleerror){
		console.log("error getting track name");
	}
});

