/* Testing a single song with Mopidy */
/*
Track URIs:
spotify:track:3rOd76CYlqmGzp1TssXANo
spotify:track:53pAFogNWnl3dPV7RBENGq


*/

var trackURI = "spotify:track:53pAFogNWnl3dPV7RBENGq";

var mysecrets  = require (__dirname + "/secrets.js").secrets();


var fs = require("fs");
var request = require("request");
var Mopidy = require("mopidy");


var mopidy = new Mopidy({
    autoConnect: true,
    webSocketUrl : "ws://127.0.0.1:6680/mopidy/ws/",
    callingConvention : "by-position-or-name"
});

mopidy.on("state:online", function(){
    console.log("mopidy online");
    mopidy.playback.getState().then(function(state){
	    console.log("got state ");
	    console.log(state);
	    console.log("trying to play");
	    mopidy.playback.play(trackURI);
	    
    });
});

mopidy.on(console.log.bind(console));

mopidy.on("event:trackPlaybackStarted", function(track){
	console.log("track playback started 2");
	console.log(JSON.stringify(track, null, 2));
  if(true){ // send track information to adafruit.io, or create a generic IOT wrapper 
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
	}
});


//mopidy.playback.play(currentTrack);

