
/*
This script runs long-term on a "server" machine that other devices send udp data TO.
it gets messages then executes the commands in various ways (osascript, philips hue, etc).
*/

import pkg from 'node-osascript';
const osascript = pkg;


import { Server } from 'node-osc';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const commandconfig = require("./commands.json");

console.log(commandconfig);

var addone = false;


var PORT = 9002;
var HOST = '127.0.0.1';


var oscServer = new Server(PORT, '0.0.0.0', () => {
  console.log('OSC Server is listening');
  runTest();
});

oscServer.on('message', function (msg) {
  console.log(`Message: ${msg}`);
  console.log(msg);
  var path = msg[0];
  var letter = msg[1];
  var number = msg[2];
  if(addone){
  	number++;
  }
  var command = letter+number;
  console.log("command " + command);
  runCommand(command);
//  oscServer.close();
});



function runTest(){
	runCommand ("A2");
}



function runCommand(command){
	var theCommand = commandconfig[command];
	if(!theCommand){
		console.log("don't know what to do with sent command " + command);
	}
	switch(theCommand.command){
		case "calib_low":
			calib_low();
			break;
		case "calib_high":
			calib_high();
			break;
		case "donothing":
			donothing();
			break;
		case "playlist":
			var playlist_id = theCommand.playlist;
			playPlaylist(playlist_id);
		case "setlights":
			var lightvalue = theCommand.lightvalue;
			setLights(lightvalue);
		case "nextsong":
			playNextSong();
			break;
		default:
			console.log("don't have a function for " + theCommand.command);
			break;
	}
}


function calib_low(){
	console.log("calib_low");
	// this means that there are command number 0s coming from the system, 
	// so we add one to commands that start with:
	// A,C,E,G,J
	addone = true;
	
}
function calib_high(){
	console.log("calib_high");
	// this means that there are command number 10s coming from the system, 
	// so we DON'T add one to commands that start with:
	// A,C,E,G,J
	addone = false;	
}

function donothing(){
	console.log("donothing");

	
}


function playPlaylist(playlist_id){
	console.log("play playlist " +playlist_id);

	var scriptline = "tell application \"Spotify\" to play track  \"spotify:playlist:"+playlist_id+"\"";

	console.log(scriptline);
	osascript.execute(scriptline, function(err, result, raw){
  		if (err) return console.error(err)
  		console.log(result, raw)
	});
}

function playNextSong(){
	var scriptline = "tell application \"Spotify\" to play (next track)";

	console.log(scriptline);
	osascript.execute(scriptline, function(err, result, raw){
  		if (err) return console.error(err)
  		console.log(result, raw)
	});

}

function setLights(lightvalue){
	// set color on the philips hue lights
	console.log("setLights " + lightvalue);
	console.log("not implemented");

}

/*
osascript commands
use script editor.
to find available commands:
file->open dictionary->Spotify
*/
