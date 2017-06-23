
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
                playTrack(currentTrack) 
                .then(pause)  
                .then(seek(currentPosition))
                .then(resume)
                .then(removeTrack(newTrack)) 
                .then(function(){ 
                        // remove the listener
                        return mopidy.off("event:trackPlaybackEnded", whenDone);
                }).done();
        };
	
	var getCurrentTimePosition = function(){
		return mopidy.playback.getTimePosition().then(function(value){currentPosition = value;});
	};
	
	var getCurrentTrack = function(){
		return mopidy.playback.getCurrentTrack().then(function(value){currentTrack = value;});
	};

	var pause = function(){
		return mopidy.playback.pause();
	};

	var playTrack = function(track){
		console.log("going to plauy track");
		console.log(JSON.stringify(track));
		return mopidy.playback.play(track);
	};
	
	var stop = function(){
		return mopidy.playback.stop();
	};
	var seek = function(time){
		return mopidy.playback.seek(time);
	};

	var resume = function(){
		return mopidy.playback.resume();
	};

	var addTrack = function(uri){
//		return mopidy.tracklist.add(null, 0, uri).then(function(tracks){
		return mopidy.tracklist.add(null, 0, "local:track:/home/pi/Music/interruptSong.mp3").then(function(tracks){
			console.log(JSON.stringify(tracks));
			newTrack = tracks[0];
			console.log("newTrack is ");
			console.log(JSON.stringify(newTrack));
		});
	};

 	var removeTrack = function(track){
		return mopidy.tracklist.remove(track);
	};

	// end playback
	getCurrentTrack()
	.then(getCurrentTimePosition)
	.then(pause)
	.then(stop)
	.then(function(){
		return mopidy.on("event:trackPlaybackEnded", whenDone);
	})
	.then(addTrack(interruptUri))
	.then(playTrack(newTrack))
	.done();
};

var playPlaylist = function(playlist_uri){
  console.log("in playPlayList");
  console.log("playlist is " + playlist_uri);

  var playlist = allPlaylists[playlist_uri];
  var playlist_data;
	
  var clear = function(){
  	return mopidy.tracklist.clear();   	  
  };
  var stop = function(){
	return mopidy.playback.stop();
  };
	
  var lookup = function(playlist_uri){
	return mopidy.library.lookup(playlist_uri)
	  .then(function(data){
		playlist_data = data;
	});	  
  };
	
  var add = function(data){
	return mopidy.tracklist.add(data);	  
  };
	
  var play = function(){
	shuffle();
	return mopidy.playback.play();	  
  };
	
  stop()
	.then(clear())
	.then(lookup(playlist_uri))
	.then(add(playlist_data))
	.then(shuffle())
	.then(play())
	.done();
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
    mopidy.library.refresh().then(function(){
//	mopidy.library.search({"track_name":"welcomeToMakerHub.mp3"}).then(function(res){
//	mopidy.library.search({"uri":"local:"}).then(function(res){
	mopidy.library.search({'artist':"Manu Dibango"}).then(function(res){
		console.log("results are");
		console.log(JSON.stringify(res[0]));
	}).done();
 //   playPlaylist("spotify:user:donundeen:playlist:6wgip2mM9hKKjc9MgUbJxL");		  
//setTimeout(interruptWithTrack, 3000);
	    
    });
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


console.log("done");
