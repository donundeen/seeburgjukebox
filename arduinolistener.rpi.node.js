// placeholder for the work i'll do getting node and arduino to talk:
// https://github.com/voodootikigod/node-serialport
//
// see mopidy docs here: https://docs.mopidy.com/en/latest/api/core/#mopidy.core.PlaybackController 
// fail if network isn't up:
/*
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
		console.log("no network, shutting down");
		process.exit();
        } else {
		// all ok
	}
    });
*/


var mysecrets  = require (__dirname + "/secrets.js").secrets();


var fs = require("fs");
var request = require("request");
var Mopidy = require("mopidy");

var allPlaylists = {};

var songDir = "file:///home/pi/seeburgjukebox/";
var doorbellSong = "DoorbellInterrupt.mp3";
var doorbellUri = songDir + doorbellSong;
var chatSong = "IncomingChat.mp3";
var chatUri = songDir + chatSong;


var sb = false;


var mopidy = new Mopidy({
    autoConnect: true,
    webSocketUrl : "ws://127.0.0.1:6680/mopidy/ws/",
    callingConvention : "by-position-or-name"
});

var shuffle = function(){
  mopidy.tracklist.shuffle();
};

var nextSong = function(){
  mopidy.playback.next();
};

var stopPlaying = function(){
	if(currentlyPlaying){
		mopidy.playback.stop();
	}
	currentlyPlaying = false;
	currentTrack = false;
	currentPosition = false;
};

var startPlaying = function(){
	if(!currentlyPlaying){
		currentlyPlaying = true;
		mopidy.playback.play();
	}
};

var reboot = function(){
  require('reboot').reboot();
};




var currentTrack = false;
var currentPosition = false;
var currentlyPlaying = false;
var interruptTrack = false;
var inInterruptTrack = false;
var whenDone;

whenDone = function(track){
	
	if(!interruptTrack || track.tl_track.tlid != interruptTrack.tlid){
		  console.log("not the right track, skipping");
		  return;
	}

	/*
	// need to test this part
	var uri = track.tl_track.track.uri;
	if(currentlyInterrupting[uri]){
		currentlyInterrupting[uri] = false;
	}
	*/
	
        // resume at original location
        // remove the track
	if(interruptTrack){
	        console.log("removing "+interruptTrack.tlid);
        	mopidy.tracklist.remove({'tlid': [interruptTrack.tlid]}).then(function(removed){
			interruptTrack = false;
			console.log("removed");
			console.log(JSON.stringify(removed, null, "  "));
		});
	}	
	

        if(currentTrack && currentlyPlaying){
		console.log(JSON.stringify(currentTrack, null, " " ));
                console.log("resuming track");
                mopidy.playback.play(currentTrack)
			.then(function(){
				console.log("pause");
				mopidy.playback.pause();})
			.then(function(){
				console.log("seek");
				mopidy.playback.seek(currentPosition);})
			.then(function(){
				console.log("resume");
				mopidy.playback.resume();
				currentTrack = false;
				currentPosition = false;
			});
        }else{
		console.log("not currently playing, not resuming");
		mopidy.playback.stop();
	}

};

mopidy.on("event:trackPlaybackEnded", whenDone);


var currentlyInterrupting = {};
var interruptWithTrack = function(interruptUri){
	
	console.log("interrupting");
	
	// testing this part
	/*
	if(currentlyInterrupting[interruptUri]){
		console.log("already interrupting with " + interruptUri);
		return;
	}
	currentlyInterrupting[interruptUri] = true;
	*/
	// get current track and time position
	if(currentlyPlaying){
		mopidy.playback.getCurrentTlTrack().then(function(ctrack){
        	  	console.log("currentTrack " );
        		currentTrack = ctrack;
		  	console.log(JSON.stringify(ctrack, null , "  "));
		});
		mopidy.playback.getTimePosition().then(function(cpos){
			console.log("currentPosition");
			currentPosition = cpos;
		        console.log(JSON.stringify(cpos, null, "  "));
        	});
	}
	// end playback


	// add interrupt track to playlist, at first position	
	var added = mopidy.tracklist.add(null, 0, interruptUri)
	.then(function(added){
        	// play the track
          	console.log("added");
		interruptTrack  = added[0];
		mopidy.playback.stop();
		console.log("gonna play");
		console.log(JSON.stringify(interruptTrack, null, "  "));
		mopidy.playback.play(interruptTrack).then(function(startata){
			console.log("playback happening");
			console.log(JSON.stringify(startata, null,  "  "));
		});	
	});
};


var playPlaylist = function(playlist_uri){
	currentlyPlaying = true;
	var cleared = mopidy.tracklist.clear();
	mopidy.playback.stop();
	var playlist = allPlaylists[playlist_uri];
	//console.log("playlist is ");
	//console.log(playlist);

	cleared.then(function(){
  		mopidy.library.lookup(playlist_uri).then(function(data){
      			var added = mopidy.tracklist.add(data);
	    		console.log("playlist data");
	  //  		console.log(data);
      			added.then(function(addedTracks){
        			shuffle();
				var firstTrack = addedTracks[Math.floor((Math.random() * addedTracks.length))];
				console.log("gonna play");
		//		console.log(JSON.stringify(firstTrack, null, "  "));

        			mopidy.playback.play(firstTrack).then(function(playing){
					console.log("playing playlist");
		//			console.log(JSON.stringify(playing, null, "  "));
				});
      			});
    		});
  	});
};

var key = mysecrets.aio_key; // put AIO key here
var events_group = "MakerHubEvents";
var doorbell_feedname= "backdoorbell";
var chat_feedname = "signagemessage";
var firstrun = true;

var prev_doorbellstream_id = false;
var prev_chatstream_id= false;
function poll_events(){
  var receiveurl = "https://io.adafruit.com/api/groups/"+events_group+"/receive.json?x-aio-key="+key
  request(receiveurl, function(error, response, body){
   // console.log("receive");
//    console.log(error);
//    console.log(response);
//    console.log(body);
    if(error){
        console.log("ERROR" + error);
        return;
    }
    var data = false;
    try{ 
    	data = JSON.parse(body);
    }catch(e){
	console.log("error parsing doorbell AIO body");
	console.log(e);
	console.log(body);
    }
    if(!data.feeds){
	    console.log("no feeds returned");
	    console.log(JSON.stringify(data, null, "  "));
	return;    
    }
    // check for doorbell alerts
    var doorbell_feeds = data.feeds.filter(function(f){return f.name == doorbell_feedname});
    if(doorbell_feeds.length > 0){
        var stream = doorbell_feeds[0].stream;
	if(!stream && doorbell_feeds[0].id){
	  stream = doorbell_feeds[0];
	}
        if(!firstrun && prev_doorbellstream_id != stream.id){
          prev_doorbellstream_id = stream.id;
          doorbell_alert(stream.value);
        }else if(firstrun){
          prev_doorbellstream_id = stream.id;
         // console.log("same value");
        }else{

        }
    }
    // check for doorbell alerts
    var chat_feeds = data.feeds.filter(function(f){return f.name == chat_feedname});
    if(chat_feeds.length > 0){
        var stream = chat_feeds[0].stream;
	if(!stream && chat_feeds[0].id){
	  stream = chat_feeds[0];
	}
	    
        if(!firstrun && prev_chatstream_id != stream.id && stream.value.match(/Incoming Chat/)){
          prev_chatstream_id = stream.id;
          chat_alert(stream.value);
        }else if(firstrun){
          prev_chatstream_id = stream.id;
         // console.log("same value");
        }else{

        }
    }
    firstrun = false; 
  });
}

function doorbell_alert(value){ 	
  console.log("new value: " + value);
  interruptWithTrack(doorbellUri);
}
function chat_alert(value){ 	
  console.log("new value: " + value);
  interruptWithTrack(chatUri);
}

setInterval(function(){poll_events();}, 3000);


var command_feedname= "jukebox_command";
var command_group = "jukebox";
var prev_command_stream_id = false;
var command_firstrun = true;

function poll_command(callback){
  var receiveurl = "https://io.adafruit.com/api/groups/"+command_group+"/receive.json?x-aio-key="+key
  request(receiveurl, function(error, response, body){
   // console.log("receive");
//    console.log(error);
//    console.log(response);
//    console.log(body);
    if(error){
        console.log("ERROR" + error);
        return;
    }
    var data = false;
    try{ 
    	data = JSON.parse(body);
    }catch(e){
	console.log("error parsing command AIO body");
	console.log(e);
	console.log(body);
    }
    var stream = false;
    if(!data.feeds){
	    console.log("no feeds returned");
	    console.log(JSON.stringify(data, null, "  "));
	return;    
    }
   // console.log(data.feeds);
    var feeds = data.feeds.filter(function(f){return f.name == command_feedname});
    if(feeds.length > 0){
        stream = feeds[0].stream;
	if(!stream){
		console.log("nothing at feeds[0].stream");
		console.log(feeds[0]);
		if(feeds[0].id){
		  stream = feeds[0];	
		}
	}
        if(!command_firstrun && prev_command_stream_id != stream.id){
          prev_command_stream_id = stream.id;
          callback(stream.value);
        }else if(command_firstrun){
          prev_command_stream_id = stream.id;
//          console.log("same value");
        }else{

        }
    }
    command_firstrun = false; 
  });
}

function command_sent(value){ 	
  console.log("new command value: " + value);
  processMessage(value);
}


function send_command_recieved(value){
	// send the jukebox command that was recieved
	//gumakerhub/feeds/jukebox.jukebox-command
    var sendurl = "https://io.adafruit.com/api/groups/jukebox/send.json?x-aio-key="+key+"&jukebox_keypress="+value;
  console.log("sending url " + sendurl);
  request(sendurl, function(error, response, body){ 
  	console.log("response");
	console.log(response);
	console.log(error);
  });
	
}

setInterval(function(){poll_command(command_sent);}, 3000);

var setVolumeLow = function(){
	var result = mopidy.mixer.setVolume(5);
	console.log("set volume low " + result);
};

var setVolumeMedium = function(){
	mopidy.mixer.setVolume(15);
};

var setVolumeHigh = function(){
	mopidy.mixer.setVolume(25);
};

var listPlaylists = function(){
  console.log("listing playlists");
  mopidy.playlists.asList().then(function(data){
	  console.log(data);
	  for (var i=0; i < data.length; i++){
		allPlaylists[data[i].uri] = data[i];	  
	  }
  });
};

//mopidy.on(console.log.bind(console));

var mopidy_online = false;

mopidy.on("state:online", function(){
    console.log("mopidy online");
    mopidy.playback.getState().then(function(state){
	    console.log("got state ");
	    console.log(state);
	    if(state == "playing"){
		currentlyPlaying = true;
	    }
    });
    listPlaylists();
    setVolumeLow();
});

//mopidy.on(console.log.bind(console));

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

//mopidy.connect();

console.log("got mopidy");
console.log(mopidy); 
/*
*/

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var files = fs.readdirSync("/dev");
var portname = false;
files.forEach(function(filename){
  if(filename.match(/^ttyACM[0-9]/)){
    portname = "/dev/"+ filename;
    console.log("port is " + portname);
  }  
});

if(!portname){
  console.log("don't have an arduino to listen to!");
  process.exit(1);
}

var serialport = require("serialport");
var SerialPort  = serialport.SerialPort;
var serialPort = new SerialPort(portname, {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n") 
});


serialPort.on("open", function () {
	console.log('open');
    	serialPort.on('data', function(data) {
    		data = data.toString().trim();
    		var done = false;
      		if(data != ""){
	  		if(/^[A-K][0-9]+$/.test(data)){
  	    			fullMessage = data;
		  	    	done = true;
  	    			waitingOnNumber = false;
		  	}else{
  	    			console.log("don't understand " + data);
  	    		}
		      	if(done){
 		 	    	done = false;
  	    			processMessage(fullMessage.toUpperCase());
	  		} 
      		}
    	});  
    	serialPort.write("ls\n", function(err, results) {
      		console.log('err ' + err);
		console.log('results ' + results);
	});  
});



function processMessage(command){
	console.log("going to process command : " + command);
  command = command.toUpperCase();
  send_command_recieved(command);
	
  switch(command){
  case "A1":
      // Maker Hub Staff picks
      playPlaylist("spotify:user:donundeen:playlist:6HxYIhgWt8BOoDpC9Scpcz");
      break;
  case "A2":
      // Barry White
      playPlaylist("spotify:user:donundeen:playlist:6zIuFUjOIvG3qG1ORyuHOb");
      break;
  case "A3":
      // Johnny Hartman
      playPlaylist("spotify:user:donundeen:playlist:3hx6GfQJENuW84C7YQ6cIe");
      break;
  case "A4":
      // vibraphone players
      playPlaylist("spotify:user:donundeen:playlist:2qbUArKUbtWwWdYlJ1o0LD");
      break;
  case "A5":
      // fierce tenors
      playPlaylist("spotify:user:donundeen:playlist:0G1EhPDl2ef4KfoZrIusQi");
      break;
  case "A6":
      // wilco
      playPlaylist("spotify:user:donundeen:playlist:2nxQBojlEceOCnBjXZNdal");
      break;
   case "A7":
      // dorothy ashby
      playPlaylist("spotify:user:donundeen:playlist:18BWkPW3hXIVv276wstMxT");
      break;
  case "A8":
      // classic tenors
      playPlaylist("spotify:user:donundeen:playlist:6QRS4jCAsPKK4zSG3SPQfj");
      break;
  case "A9":
      // jazz organ
      playPlaylist("spotify:user:donundeen:playlist:4OOD1glae7mrq4Z6hA4fEi");
      break;
  case "A10":
      //afrobeat
      playPlaylist("spotify:user:donundeen:playlist:3o4MEIW5FWeEYnLIat9SiG");
      break;
    case "B1":
      // next song
      nextSong();
      break;
    case "B2":
      //shuffle
      shuffle();
      break;
    case "B3":
      // stop playback
      stopPlaying();
      break;
    case "B4":
      //start playback
      startPlaying();
      break;
    case "B5":
      // Brian Eno spotify:user:donundeen:playlist:1upuMzQyMwwAHVf2msmDWm
      playPlaylist("spotify:user:donundeen:playlist:1upuMzQyMwwAHVf2msmDWm");		  
      break;
    case "B6":
      // the Shins spotify:user:donundeen:playlist:6wgip2mM9hKKjc9MgUbJxL
      playPlaylist("spotify:user:donundeen:playlist:6wgip2mM9hKKjc9MgUbJxL");		  
      break;
    case "B7":
		  // Smooth 80's Jams
      playPlaylist("spotify:user:donundeen:playlist:7DMtiftZqnle27n9uCNOR2");
      break;
    case "B8":
		  // Clap your hands say yeah 
      playPlaylist("spotify:user:donundeen:playlist:4iEKSHmA51XCv58mZ2JpND");
      break;
    case "B9": 
		  // magnetic fields
      playPlaylist("spotify:user:donundeen:playlist:7oekMg1d0Jd4V9Pl242DV8");
      break;
    case "B10":
		  // The Hold Steady
      playPlaylist("spotify:user:donundeen:playlist:3Hs9sHphOiM8JeyI6nudZG");
      break;
    case "C1": // set volume low
      setVolumeLow();
      break;
    case "C2": // set volume Medium
      setVolumeMedium();
      break;
    case "C3": // set volume High
      setVolumeHigh();
      break;
    case "C4":
	//spotify:user:flameon8761:playlist:6MpfBzPKdETCQdOTgCmtE0
	// Calvin's Vibez
	playPlaylist("spotify:user:flameon8761:playlist:6MpfBzPKdETCQdOTgCmtE0");
      break;
    case "C5":
	// Madeline Lee's Summer 2018 playlist
		  // spotify:user:121910898:playlist:0cyBjxXtzdAKzrZHkZ1Hsc
	playPlaylist("spotify:user:121910898:playlist:0cyBjxXtzdAKzrZHkZ1Hsc");		  
      break;
    case "C6":
		  //spotify:user:donundeen:playlist:4OhFqNQsL9Vp2S5RmtyHQ3
		  // Kadhja Bonet and friends
	playPlaylist("spotify:user:donundeen:playlist:4OhFqNQsL9Vp2S5RmtyHQ3");		  
		  
      break;
    case "C7":
		  // spotify:user:ryan.mannion:playlist:7a0gj4eUHONHVWZ83O5PUZ
		  // Ryan Mannion's Outlaw Country
	playPlaylist("spotify:user:ryan.mannion:playlist:7a0gj4eUHONHVWZ83O5PUZ");
      break;
    case "C8":
		  // Sarah Harper's Summer 2018
		  // spotify:user:15sharper:playlist:7rsGH7Ug5OHSKIuFIQOMZd
	playPlaylist("spotify:user:15sharper:playlist:7rsGH7Ug5OHSKIuFIQOMZd");
		  
      break;
    case "C9":
		  // Maya Archer's Maker Hub Bops
		  // spotify:user:mayarcher17:playlist:0hgN4px8QwVhVuQxO96tp8
	playPlaylist("spotify:user:mayarcher17:playlist:0hgN4px8QwVhVuQxO96tp8");
		  
		  
      break;
    case "C10":
		  // Zihan Xiao's maroon 5 et al playlist
		  // spotify:user:cdental:playlist:7iDoasWCg3G0AXeYBh0fxz
	playPlaylist("spotify:user:cdental:playlist:7iDoasWCg3G0AXeYBh0fxz");
		  
      break;
    case "D1":
		// Bailey Premeaux's Objective Jams
		  // spotify:user:1269706439:playlist:1JuUoy8kiYVXlwnmpUg3lo
		  //https://open.spotify.com/user/1269706439/playlist/1JuUoy8kiYVXlwnmpUg3lo
      playPlaylist("spotify:user:1269706439:playlist:1JuUoy8kiYVXlwnmpUg3lo");
      break;
    case "D2":
		  // spotify:user:mariejameson:playlist:7lAlqwCBMr7HpxuxnBuPWo
		  // Sarah Harper's Cla$$y Brunch
      playPlaylist("spotify:user:mariejameson:playlist:7lAlqwCBMr7HpxuxnBuPWo");	 
      break;
    case "D3":
		  // https://open.spotify.com/user/13maddiefun./playlist/1YpohO70HMMrTBfSQRjEej
		  // spotify:user:13maddiefun.:playlist:1YpohO70HMMrTBfSQRjEej
		  // Madeline Clement's Maker Hub Jamz
      playPlaylist("spotify:user:13maddiefun.:playlist:1YpohO70HMMrTBfSQRjEej");	 
      break;
    case "D4":
		  //spotify:user:josegah:playlist:1mMwQNSzwBLpPU93xzkL5e
	// Jose Andrade daft punk and gaming music
      playPlaylist("spotify:user:josegah:playlist:1mMwQNSzwBLpPU93xzkL5e");
      break;
    case "D5":
		  // Derek acosta, Gusto
		  //spotify:user:cube4d:playlist:3tlhAC2zp3btb1X4Uf1tjR
      playPlaylist("spotify:user:cube4d:playlist:3tlhAC2zp3btb1X4Uf1tjR");
      break;
    case "D6":
		  // https://open.spotify.com/user/pepprcabbg/playlist/3vhSAm7EnAJBHZH1eoLaCS
		  // spotify:user:pepprcabbg:playlist:3vhSAm7EnAJBHZH1eoLaCS
		  // Mickey Cervino's "Juke"
      playPlaylist("spotify:user:pepprcabbg:playlist:3vhSAm7EnAJBHZH1eoLaCS");
      break;
    case "D7":
		  // Samu's spotify playlist : Mood Modd
		  //spotify:user:figrenergif:playlist:0ycw1aCcoWeRlldoNMvfRn
      playPlaylist("spotify:user:figrenergif:playlist:0ycw1aCcoWeRlldoNMvfRn");
		  
      break;
    case "D8":
		  // Closing time:
		  // spotify:user:donundeen:playlist:26D49gSujdIToi4TlG8klK
      playPlaylist("spotify:user:donundeen:playlist:26D49gSujdIToi4TlG8klK");		  
      break;
    case "D9":
		  // Don's fun rocking playlist
		  // spotify:user:donundeen:playlist:4TrfQdPpWHXt7YCwevK7x1
      playPlaylist("spotify:user:donundeen:playlist:4TrfQdPpWHXt7YCwevK7x1");		  
		  
      break;
    case "D10":
		  // Don's fun 80's playlist
		  // spotify:user:eepulos:playlist:2IHK7qjrzm6BV81UbDHW6U
      playPlaylist("spotify:user:eepulos:playlist:2IHK7qjrzm6BV81UbDHW6U");
      break;
    case "E1":
	// spotify:user:donundeen:playlist:4Z9TnvMCmrZAfjl2jbeYeJ
	// happy birthday playlist
      playPlaylist("spotify:user:donundeen:playlist:4Z9TnvMCmrZAfjl2jbeYeJ");

      break;
    case "E2":
	//Jamie Farrell's on the road playlist
	playPlaylist("spotify:user:1268743304:playlist:3vZNSz4PZXAt7CyvFaluBV");
      break;
    case "E3":
	//Jamie Farrell's shboom doo wop
	playPlaylist("spotify:user:1268743304:playlist:1fhHOLImGS78RmISCNSFyI");
      break;
    case "E4":
	//Kat's Throback Playlist
	playPlaylist("spotify:user:12151279994:playlist:6qwifqfBA0S7g6oWUuKv4M");
      break;
    case "E5":
	//Daria's Akon Only Playlist
	playPlaylist("spotify:user:spotify:playlist:37i9dQZF1DZ06evO0gCG2c");
    break;
    case "E6":

      break;
    case "E7":

      break;
    case "E8":

      break;
    case "E9":

      break;
    case "E10":

      break;
    case "F1":

      break;
    case "F2":

      break;
    case "F3":

      break;
    case "F4":

      break;
    case "F5":

      break;
    case "F6":

      break;
    case "F7":

      break;
    case "F8":

      break;
    case "F9":

      break;
    case "F10":

      break;
    case "G1":

      break;
    case "G2":

      break;
    case "G3":

      break;
    case "G4":

      break;
    case "G5":

      break;
    case "G6":

      break;
    case "G7":

      break;
    case "G8":

      break;
    case "G9":

      break;
    case "G10":

      break;
    case "H1":

      break;
    case "H2":

      break;
    case "H3":

      break;
    case "H4":

      break;
    case "H5":

      break;
    case "H6":

      break;
    case "H7":

      break;
    case "H8":

      break;
    case "H9":

      break;
    case "H10":

      break;
    case "J1":

      break;
    case "J2":

      break;
    case "J3":

      break;
    case "J4":

      break;
    case "J5":

      break;
    case "J6":

      break;
    case "J7":

      break;
    case "J8":

      break;
    case "J9":

      break;
    case "J10":

      break;
    case "K1":

      break;
    case "K2":

      break;
    case "K3":

      break;
    case "K4":

      break;
    case "K5":

      break;
    case "K6":

      break;
    case "K7":

      break;
    case "K8":
      reboot();

      break;
    case "K9":

      break;
    case "K10":
      //reboot
      break;
    case "L1":
      // secret Jukebox-code-compatible code for triggering doorbell. So the jukebox can listen to ONE adafruit.io channel eventually
      interruptWithTrack();		  
      break;
    case "DOORBELL":		  
     interruptWithTrack();		  
      break;
    default:
      console.log("don't know what to do with that command");


  }


}



var searchAndPlay = function(query){
	if (!query){
		query = "birthday";	
	}
	
	var queryObj = {
		'track_name':[query]
	};
	//queryObj = {'any' : ['a']};
	
	console.log("searching");
	console.log(queryObj);
	mopidy.library.search(queryObj).then(function(results){
//		console.log(JSON.stringify(results));
		for(var i = 0; i< results.length; i++){
			if(results[i].uri && results[i].uri.match("spotify")){
				var tracks = results[i].tracks;
				if(tracks && tracks.length > 0){
					mopidy.tracklist.clear().then(function(){
						mopidy.tracklist.add(tracks).then(function(tracks){
							console.log("added tracks");
							console.log(JSON.stringify(tracks));
							mopidy.tracklist.shuffle().then(function(){
								console.log("playing");
								mopidy.playback.play();	
							});
						});
					});
				}else{
					console.log("no results found");	
				}
			}
		}
        });
}


/*
To get list of available ports (selectable from MAX?)
serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

*/
