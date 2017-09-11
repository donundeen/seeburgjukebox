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

var fs = require("fs");


var Mopidy = require("mopidy");

var allPlaylists = {};

var Spacebrew = require('spacebrew');
var server = "192.168.1.96";
var name = "Jukebox";
var description = "Jukebox Selections";
var sb = false;

function sb_connect(){
	if(sb){
		return;
	}
	sb = new Spacebrew.Client( server, name, description );
	if(sb){
	try{
		sb.onClose(function(){
			 console.log("sb closed");
		});
		
		sb.onOpen(function(){
			console.log("sb opened");
		});
		
		console.log("addPublish");
		sb.addPublish("selection", "string", "Jukebox selection code");  // create the publication feed
		sb.addPublish("songtitle", "string", "current jukebox song");  // create the publication feed
		sb.addPublish("songartist", "string", "current jukebox artist");  // create the publication feed
		sb.addPublish("playlistname", "string", "current jukebox playlist");  // create the publication feed
		
		sb.addSubscribe("Select_A1","string","any string to trigger A1");
		sb.addSubscribe("Select_A2","string","any string to trigger A2");
		sb.addSubscribe("Select_A3","string","any string to trigger A3");
		sb.addSubscribe("Select_A4","string","any string to trigger A4");
		sb.addSubscribe("Select_A5","string","any string to trigger A5");
		sb.addSubscribe("Select_A6","string","any string to trigger A6");
		sb.addSubscribe("Select_A7","string","any string to trigger A7");
		sb.addSubscribe("Select_A8","string","any string to trigger A8");
		sb.addSubscribe("Select_A9","string","any string to trigger A9");
		sb.addSubscribe("Select_A10","string","any string to trigger A10");
		sb.addSubscribe("Select_B1","string","any string to trigger B1");
		sb.addSubscribe("Select_B2","string","any string to trigger B2");
		sb.addSubscribe("Select_B3","string","any string to trigger B3");
		sb.addSubscribe("Select_B4","string","any string to trigger B4");
		sb.addSubscribe("Select_B5","string","any string to trigger B5");
		sb.addSubscribe("Select_B6","string","any string to trigger B6");
		sb.addSubscribe("Select_B7","string","any string to trigger B7");
		sb.addSubscribe("Select_B8","string","any string to trigger B8");
		sb.addSubscribe("Select_B9","string","any string to trigger B9");
		sb.addSubscribe("Select_B10","string","any string to trigger B10");
		sb.addSubscribe("Select_C1","string","any string to trigger C1");
		sb.addSubscribe("Select_C2","string","any string to trigger C2");
		sb.addSubscribe("Select_C3","string","any string to trigger C3");
		sb.addSubscribe("Select_C4","string","any string to trigger C4");
		sb.addSubscribe("Select_C5","string","any string to trigger C5");
		sb.addSubscribe("Select_C6","string","any string to trigger C6");
		sb.addSubscribe("Select_C7","string","any string to trigger C7");
		sb.addSubscribe("Select_C8","string","any string to trigger C8");
		sb.addSubscribe("Select_C9","string","any string to trigger C9");
		sb.addSubscribe("Select_C10","string","any string to trigger C10");
		sb.addSubscribe("Select_D1","string","any string to trigger D1");
		sb.addSubscribe("Select_D2","string","any string to trigger D2");
		sb.addSubscribe("Select_D3","string","any string to trigger D3");
		sb.addSubscribe("Select_D4","string","any string to trigger D4");
		sb.addSubscribe("Select_D5","string","any string to trigger D5");
		sb.addSubscribe("Select_D6","string","any string to trigger D6");
		sb.addSubscribe("Select_D7","string","any string to trigger D7");
		sb.addSubscribe("Select_D8","string","any string to trigger D8");
		sb.addSubscribe("Select_D9","string","any string to trigger D9");
		sb.addSubscribe("Select_D10","string","any string to trigger D10");
		sb.addSubscribe("Select_E1","string","any string to trigger E1");
		sb.addSubscribe("Select_E2","string","any string to trigger E2");
		sb.addSubscribe("Select_E3","string","any string to trigger E3");
		sb.addSubscribe("Select_E4","string","any string to trigger E4");
		sb.addSubscribe("Select_E5","string","any string to trigger E5");
		sb.addSubscribe("Select_E6","string","any string to trigger E6");
		sb.addSubscribe("Select_E7","string","any string to trigger E7");
		sb.addSubscribe("Select_E8","string","any string to trigger E8");
		sb.addSubscribe("Select_E9","string","any string to trigger E9");
		sb.addSubscribe("Select_E10","string","any string to trigger E10");
		sb.addSubscribe("Select_F1","string","any string to trigger F1");
		sb.addSubscribe("Select_F2","string","any string to trigger F2");
		sb.addSubscribe("Select_F3","string","any string to trigger F3");
		sb.addSubscribe("Select_F4","string","any string to trigger F4");
		sb.addSubscribe("Select_F5","string","any string to trigger F5");
		sb.addSubscribe("Select_F6","string","any string to trigger F6");
		sb.addSubscribe("Select_F7","string","any string to trigger F7");
		sb.addSubscribe("Select_F8","string","any string to trigger F8");
		sb.addSubscribe("Select_F9","string","any string to trigger F9");
		sb.addSubscribe("Select_F10","string","any string to trigger F10");
		sb.addSubscribe("Select_G1","string","any string to trigger G1");
		sb.addSubscribe("Select_G2","string","any string to trigger G2");
		sb.addSubscribe("Select_G3","string","any string to trigger G3");
		sb.addSubscribe("Select_G4","string","any string to trigger G4");
		sb.addSubscribe("Select_G5","string","any string to trigger G5");
		sb.addSubscribe("Select_G6","string","any string to trigger G6");
		sb.addSubscribe("Select_G7","string","any string to trigger G7");
		sb.addSubscribe("Select_G8","string","any string to trigger G8");
		sb.addSubscribe("Select_G9","string","any string to trigger G9");
		sb.addSubscribe("Select_G10","string","any string to trigger G10");
		sb.addSubscribe("Select_H1","string","any string to trigger H1");
		sb.addSubscribe("Select_H2","string","any string to trigger H2");
		sb.addSubscribe("Select_H3","string","any string to trigger H3");
		sb.addSubscribe("Select_H4","string","any string to trigger H4");
		sb.addSubscribe("Select_H5","string","any string to trigger H5");
		sb.addSubscribe("Select_H6","string","any string to trigger H6");
		sb.addSubscribe("Select_H7","string","any string to trigger H7");
		sb.addSubscribe("Select_H8","string","any string to trigger H8");
		sb.addSubscribe("Select_H9","string","any string to trigger H9");
		sb.addSubscribe("Select_H10","string","any string to trigger H10");
		sb.addSubscribe("Select_J1","string","any string to trigger J1");
		sb.addSubscribe("Select_J2","string","any string to trigger J2");
		sb.addSubscribe("Select_J3","string","any string to trigger J3");
		sb.addSubscribe("Select_J4","string","any string to trigger J4");
		sb.addSubscribe("Select_J5","string","any string to trigger J5");
		sb.addSubscribe("Select_J6","string","any string to trigger J6");
		sb.addSubscribe("Select_J7","string","any string to trigger J7");
		sb.addSubscribe("Select_J8","string","any string to trigger J8");
		sb.addSubscribe("Select_J9","string","any string to trigger J9");
		sb.addSubscribe("Select_J10","string","any string to trigger J10");
		sb.addSubscribe("Select_K1","string","any string to trigger K1");
		sb.addSubscribe("Select_K2","string","any string to trigger K2");
		sb.addSubscribe("Select_K3","string","any string to trigger K3");
		sb.addSubscribe("Select_K4","string","any string to trigger K4");
		sb.addSubscribe("Select_K5","string","any string to trigger K5");
		sb.addSubscribe("Select_K6","string","any string to trigger K6");
		sb.addSubscribe("Select_K7","string","any string to trigger K7");
		sb.addSubscribe("Select_K8","string","any string to trigger K8");
		sb.addSubscribe("Select_K9","string","any string to trigger K9");
		sb.addSubscribe("Select_K10","string","any string to trigger K10");
	
                sb.addPublish("Selected_A1","string","sent when the Jukebox has selected A1");
                sb.addPublish("Selected_A2","string","sent when the Jukebox has selected A2");
                sb.addPublish("Selected_A3","string","sent when the Jukebox has selected A3");
                sb.addPublish("Selected_A4","string","sent when the Jukebox has selected A4");
                sb.addPublish("Selected_A5","string","sent when the Jukebox has selected A5");
                sb.addPublish("Selected_A6","string","sent when the Jukebox has selected A6");
                sb.addPublish("Selected_A7","string","sent when the Jukebox has selected A7");
                sb.addPublish("Selected_A8","string","sent when the Jukebox has selected A8");
                sb.addPublish("Selected_A9","string","sent when the Jukebox has selected A9");
                sb.addPublish("Selected_A10","string","sent when the Jukebox has selected A10");
                sb.addPublish("Selected_B1","string","sent when the Jukebox has selected B1");
                sb.addPublish("Selected_B2","string","sent when the Jukebox has selected B2");
                sb.addPublish("Selected_B3","string","sent when the Jukebox has selected B3");
                sb.addPublish("Selected_B4","string","sent when the Jukebox has selected B4");
                sb.addPublish("Selected_B5","string","sent when the Jukebox has selected B5");
                sb.addPublish("Selected_B6","string","sent when the Jukebox has selected B6");
                sb.addPublish("Selected_B7","string","sent when the Jukebox has selected B7");
                sb.addPublish("Selected_B8","string","sent when the Jukebox has selected B8");
                sb.addPublish("Selected_B9","string","sent when the Jukebox has selected B9");
                sb.addPublish("Selected_B10","string","sent when the Jukebox has selected B10");
                sb.addPublish("Selected_C1","string","sent when the Jukebox has selected C1");
                sb.addPublish("Selected_C2","string","sent when the Jukebox has selected C2");
                sb.addPublish("Selected_C3","string","sent when the Jukebox has selected C3");
                sb.addPublish("Selected_C4","string","sent when the Jukebox has selected C4");
                sb.addPublish("Selected_C5","string","sent when the Jukebox has selected C5");
                sb.addPublish("Selected_C6","string","sent when the Jukebox has selected C6");
                sb.addPublish("Selected_C7","string","sent when the Jukebox has selected C7");
                sb.addPublish("Selected_C8","string","sent when the Jukebox has selected C8");
                sb.addPublish("Selected_C9","string","sent when the Jukebox has selected C9");
                sb.addPublish("Selected_C10","string","sent when the Jukebox has selected C10");
                sb.addPublish("Selected_D1","string","sent when the Jukebox has selected D1");
                sb.addPublish("Selected_D2","string","sent when the Jukebox has selected D2");
                sb.addPublish("Selected_D3","string","sent when the Jukebox has selected D3");
                sb.addPublish("Selected_D4","string","sent when the Jukebox has selected D4");
                sb.addPublish("Selected_D5","string","sent when the Jukebox has selected D5");
                sb.addPublish("Selected_D6","string","sent when the Jukebox has selected D6");
                sb.addPublish("Selected_D7","string","sent when the Jukebox has selected D7");
                sb.addPublish("Selected_D8","string","sent when the Jukebox has selected D8");
                sb.addPublish("Selected_D9","string","sent when the Jukebox has selected D9");
                sb.addPublish("Selected_D10","string","sent when the Jukebox has selected D10");
                sb.addPublish("Selected_E1","string","sent when the Jukebox has selected E1");
                sb.addPublish("Selected_E2","string","sent when the Jukebox has selected E2");
                sb.addPublish("Selected_E3","string","sent when the Jukebox has selected E3");
                sb.addPublish("Selected_E4","string","sent when the Jukebox has selected E4");
                sb.addPublish("Selected_E5","string","sent when the Jukebox has selected E5");
                sb.addPublish("Selected_E6","string","sent when the Jukebox has selected E6");
                sb.addPublish("Selected_E7","string","sent when the Jukebox has selected E7");
                sb.addPublish("Selected_E8","string","sent when the Jukebox has selected E8");
                sb.addPublish("Selected_E9","string","sent when the Jukebox has selected E9");
                sb.addPublish("Selected_E10","string","sent when the Jukebox has selected E10");
                sb.addPublish("Selected_F1","string","sent when the Jukebox has selected F1");
                sb.addPublish("Selected_F2","string","sent when the Jukebox has selected F2");
                sb.addPublish("Selected_F3","string","sent when the Jukebox has selected F3");
                sb.addPublish("Selected_F4","string","sent when the Jukebox has selected F4");
                sb.addPublish("Selected_F5","string","sent when the Jukebox has selected F5");
                sb.addPublish("Selected_F6","string","sent when the Jukebox has selected F6");
                sb.addPublish("Selected_F7","string","sent when the Jukebox has selected F7");
                sb.addPublish("Selected_F8","string","sent when the Jukebox has selected F8");
                sb.addPublish("Selected_F9","string","sent when the Jukebox has selected F9");
                sb.addPublish("Selected_F10","string","sent when the Jukebox has selected F10");
                sb.addPublish("Selected_G1","string","sent when the Jukebox has selected G1");
                sb.addPublish("Selected_G2","string","sent when the Jukebox has selected G2");
                sb.addPublish("Selected_G3","string","sent when the Jukebox has selected G3");
                sb.addPublish("Selected_G4","string","sent when the Jukebox has selected G4");
                sb.addPublish("Selected_G5","string","sent when the Jukebox has selected G5");
                sb.addPublish("Selected_G6","string","sent when the Jukebox has selected G6");
                sb.addPublish("Selected_G7","string","sent when the Jukebox has selected G7");
                sb.addPublish("Selected_G8","string","sent when the Jukebox has selected G8");
                sb.addPublish("Selected_G9","string","sent when the Jukebox has selected G9");
                sb.addPublish("Selected_G10","string","sent when the Jukebox has selected G10");
                sb.addPublish("Selected_H1","string","sent when the Jukebox has selected H1");
                sb.addPublish("Selected_H2","string","sent when the Jukebox has selected H2");
                sb.addPublish("Selected_H3","string","sent when the Jukebox has selected H3");
                sb.addPublish("Selected_H4","string","sent when the Jukebox has selected H4");
                sb.addPublish("Selected_H5","string","sent when the Jukebox has selected H5");
                sb.addPublish("Selected_H6","string","sent when the Jukebox has selected H6");
                sb.addPublish("Selected_H7","string","sent when the Jukebox has selected H7");
                sb.addPublish("Selected_H8","string","sent when the Jukebox has selected H8");
                sb.addPublish("Selected_H9","string","sent when the Jukebox has selected H9");
                sb.addPublish("Selected_H10","string","sent when the Jukebox has selected H10");
                sb.addPublish("Selected_J1","string","sent when the Jukebox has selected J1");
                sb.addPublish("Selected_J2","string","sent when the Jukebox has selected J2");
                sb.addPublish("Selected_J3","string","sent when the Jukebox has selected J3");
                sb.addPublish("Selected_J4","string","sent when the Jukebox has selected J4");
                sb.addPublish("Selected_J5","string","sent when the Jukebox has selected J5");
                sb.addPublish("Selected_J6","string","sent when the Jukebox has selected J6");
                sb.addPublish("Selected_J7","string","sent when the Jukebox has selected J7");
                sb.addPublish("Selected_J8","string","sent when the Jukebox has selected J8");
                sb.addPublish("Selected_J9","string","sent when the Jukebox has selected J9");
                sb.addPublish("Selected_J10","string","sent when the Jukebox has selected J10");
                sb.addPublish("Selected_K1","string","sent when the Jukebox has selected K1");
                sb.addPublish("Selected_K2","string","sent when the Jukebox has selected K2");
                sb.addPublish("Selected_K3","string","sent when the Jukebox has selected K3");
                sb.addPublish("Selected_K4","string","sent when the Jukebox has selected K4");
                sb.addPublish("Selected_K5","string","sent when the Jukebox has selected K5");
                sb.addPublish("Selected_K6","string","sent when the Jukebox has selected K6");
                sb.addPublish("Selected_K7","string","sent when the Jukebox has selected K7");
                sb.addPublish("Selected_K8","string","sent when the Jukebox has selected K8");
                sb.addPublish("Selected_K9","string","sent when the Jukebox has selected K9");
                sb.addPublish("Selected_K10","string","sent when the Jukebox has selected K10");
		
		
		var onStringm = function(name, value){
			console.log("string message received " + name);
			
		}
		
		sb.onStringMessage = onStringm;
		/*
		sb.onStringMessage =  function( name, value ){
			console.log("string message received " + name);
			if(name.match(/Select_.*/)) {
				console.log("Message from sb: "+name);
				var matches = name.match(/Select_([A-K][0-9]+)/);
				var sent_command = matches[1];
				processMessage(sent_command);	
			}
		}
		*/
		
		sb.onBooleanMessage = function onBoolean(name, value){
			console.log("got boolean message " + name);
		};
		
		console.log("connect");
		sb.connect();
		sb.socket.on("error",function(error){
			console.log("caught spacebrew websocket error");
			console.log(error);
			sb = false;
			setTimeout(sb_connect, 10000);
		});
		
	}catch(ex){
		console.log("sb connect exception " );
		console.log(ex);
		sb = false;
		setTimeout(sb_connect, 10000);

	}
//	sb.send("selection","string","boot");
}
}
sb_connect();

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
  mopidy.playback.stop();
};

var startPlaying = function(){
  mopidy.playback.play();
};

var reboot = function(){
  require('reboot').reboot();
};

var interruptWithTrack = function(){
	// get current track and time position
	var currentTrack = mopidy.playback.getCurrentTrack();
	var currentPosition = mopidy.playback.getTimePosition();
	// end playback
	
	var songDir = "";
	var interruptSong = "welcomeToMakerHub.mp3";
	var interruptUri = songDir + interruptSong;
	// add interrupt track to playlist, at first position	
	var added = mopidy.tracklist.add(null, 0, interruptUri);
	// play the track
	var newTrack  =added[0];
	var whenDone;
	whenDone = function(track){
	
		mopidy.playback.play(currentTrack);
		mopidy.playback.pause();
		mopidy.playback.seek(currentPosition);
		mopidy.playback.resume();
		// resume at original location
		// remove the track
		mopidy.tracklist.remove(newTrack);
		
		// remove the listener
		mopidy.off("event:trackPlaybackEnded", whenDone);
	};
	mopidy.playback.stop();

	mopidy.on("event:trackPlaybackEnded", whenDone);
	mopidy.playback.play(newTrack);
};


var playPlaylist = function(playlist_uri){
  var cleared = mopidy.tracklist.clear();
  mopidy.playback.stop();
  var playlist = allPlaylists[playlist_uri];
  console.log("playlist is ");
  console.log(playlist);

  cleared.then(function(){
    mopidy.library.lookup(playlist_uri).then(function(data){
      var added = mopidy.tracklist.add(data);
      added.then(function(){
        shuffle();
        mopidy.playback.play();

	  if(sb){
		  try{
			  sb.send("playlistname", "string", playlist.name);
		  }catch(e){
			console.log("sb send error " + e);
			  console.log(data);
		  }
	  }	      
	      
	      
	      
      });
    });
  });
};

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
    listPlaylists();
    setVolumeLow();
});

//mopidy.on(console.log.bind(console));

mopidy.on("event:trackPlaybackStarted", function(track){
	console.log("track playback started 2");
	console.log(JSON.stringify(track, null, 2));
	try{
		console.log("artist " + track.tl_track.track.artists[0].name);
		sb.send("songartist","string", track.tl_track.track.artists[0].name);
	}catch(artisterror){
		console.log("error getting track artists name");	
	}
	try{
		console.log("song " + track.tl_track.track.name);
		sb.send("songtitle","string", track.tl_track.track.name);
	}catch(titleerror){
		console.log("error getting track name");
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
  	 //   console.log('data received: ' + data);
  	    if(/^[A-K][0-9]+$/.test(data)){
  	    	fullMessage = data;
  	    	done = true;
  	    	waitingOnNumber = false;
  	    }else{
  	    	console.log("don't understand " + data);
  	    }
  	    if(done){
  	   // 	console.log("final signal" + fullMessage);
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
	sb_connect();
	if(sb){
		console.log("sending to spacebrew");
		try{
			sb.send("selection","string",command);
			sb.send("Selected_" + command,"string",command);
		}catch(e){
			console.log("error sending to spacebrew : "  + e);	
		}
	}else{
		console.log("not going to send to spacebrew");	
	}
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
      break;
    case "C5":
      break;
    case "C6":
      break;
    case "C7":
      break;
    case "C8":
      break;
    case "C9":
      break;
    case "C10":
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
      break;
    case "D6":
      break;
    case "D7":
      break;
    case "D8":
      break;
    case "D9":
      break;
    case "D10":

      break;
    case "E1":

      break;
    case "E2":

      break;
    case "E3":

      break;
    case "E4":

      break;
    case "E5":

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

      break;
    case "K9":

      break;
    case "K10":
      //reboot
      reboot();
      break;


    default:
      console.log("don't know what to do with that command");


  }

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
