// placeholder for the work i'll do getting node and arduino to talk:
// https://github.com/voodootikigod/node-serialport
//

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

var ps = require("ps-node");


ps.lookup({
    command: '/usr/bin/nodejs',
    psargs: ''
    }, function(err, resultList ) {
    if (err) {
        throw new Error( err );
    }
 
    resultList.forEach(function( process ){
        if( process ){
            console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
        }
    });
});

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
		console.log("onClose");
		sb.onClose(function(){
			 console.log("closed");
		});
		console.log("addPublish");
		sb.addPublish("selection", "string", "Jukebox selection code");  // create the publication feed
		sb.addPublish("songtitle", "string", "current jukebox song");  // create the publication feed
		sb.addPublish("songartist", "string", "current jukebox artist");  // create the publication feed
		sb.addPublish("playlistname", "string", "current jukebox playlist");  // create the publication feed
		console.log("connect");
		sb.connect();
		sb.socket.on("error",function(error){
			
			console.log("caught spacebrew websocket error");
			console.log(error);
			sb = false;
		});
		
	}catch(ex){
		console.log("exception " );
		console.log(ex);
		sb = false;
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


var playPlaylist = function(playlist_uri){
  var cleared = mopidy.tracklist.clear();
  mopidy.playback.stop();
  var playlist = allPlaylists[playlist_uri];
  console.log("playlist is ");
  console.log(playlist);
  if(sb){
	  sb.send("playlistname", "string", playlist.name);
  }
  cleared.then(function(){
    mopidy.library.lookup(playlist_uri).then(function(data){
      var added = mopidy.tracklist.add(data);
      added.then(function(){
        shuffle();
        mopidy.playback.play();
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
		sb.send("selection","string",command);
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
      break;
    case "D2":
      break;
    case "D3":
      break;
    case "D4":
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
