
/*
This script runs long-term on a "server" machine that other devices send udp data TO.
it gets messages then executes the commands in various ways (osascript, philips hue, etc).
*/

import pkg from 'node-osascript';
const osascript = pkg;


import { Server } from 'node-osc';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./config.json");

const { exec } = require("child_process");


var commandconfig = config.commands;
console.log(commandconfig);

var addone = false;

var PORT = config.osc.port;
var HOST = config.osc.host;
var buggyLetters = ["A","C","E","G","J"];




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
  // if addone and letter is one of A, C, E,G,J
  if(addone && buggyLetters.indexOf(letter) > -1 ){
  	number++;
  }
  var command = letter+number;
  console.log("command " + command);
  runCommand(command);
//  oscServer.close();
});



function runTest(){
	runCommand ("B1");
}



function runCommand(command){
	var theCommand = commandconfig[command];
	if(!theCommand){
		console.log("don't know what to do with sent command " + command);
		return;
	}
	console.log("running command " + command);
	switch(theCommand.command){
		case "calib_low":
			console.log("case calib_low");
			calib_low();
			break;
		case "calib_high":
			console.log("case calib_high");
			calib_high();
			break;
		case "donothing":
			console.log("donothing");
			donothing();
			break;
		case "playlist":
			console.log("case playlist");
			var playlist_id = theCommand.playlist;
			playPlaylist(playlist_id);
		case "setLightsHSB":
			console.log("case setLightsHSB");
			var lightvalue = theCommand.lightvalue;
			setLightsHSB(lightvalue);
			break;
		case "nextsong":
			console.log("case nextsong");
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

function setLightsHSB(lightvalue){
	// set color on the philips hue lights
	console.log("setLights " + lightvalue);
	var split = lightvalue.split(",");
	if(split.length != 4){
		console.log("bad value " + lightvalue + "  need hue,saturation,brightness,transitiontime");
		return;
	}
	var hue = parseInt(split[0]);
	var sat = parseInt(split[1]);
	var bri = parseInt(split[2]);
	var trans = parseInt(split[3]);
	setHSB(1, hue, sat, bri, trans);
	setHSB(2, hue, sat, bri, trans);

}


function donothing(){
	console.log("donothing");
}


//// HUE CONTROL FUNCTIONS
var hsldata = {"on":true,"hue":43690,"bri":254,"sat":254,"transitiontime":10};

function setLightsOff(bulb){
	hsldata.on = false;
	var jsonstring = JSON.stringify(hsldata);
	console.log(jsonstring);    
	execute('PUT', 'http://'+config.hue.bridge+'/api/'+config.hue.hash+'/lights/'+bulb+'/state',"'"+jsonstring+"'");
}


function setHSB(bulb,hcolor,satn,brt,tran) {
	// hcolor: 0-10000
	// brt : 0-200
	// satn: 0-250

	hsldata.hue = hcolor;
	hsldata.bri = brt;
	hsldata.sat = satn;
	hsldata.transitiontime = tran;

	var jsonstring = JSON.stringify(hsldata);
	console.log(jsonstring);
    
	execute('PUT', 'http://'+config.hue.bridge+'/api/'+config.hue.hash+'/lights/'+bulb+'/state',"'"+jsonstring+"'");

}



function execute($method,$url,$message, callback){

//outlet(0,"curl", "--request",$method,"--data",$message,$url);
	if($message){
		var command = "curl --request "+$method + " --data " + $message + " " + $url ;
	}else{
		var command = "curl --request "+$method + " " + $url ;

	}
	console.log(command);
	exec(command, (error, stdout, stderr) => {
	    if (error) {
	        console.log(`error: ${error.message}`);
	    }
	    if (stderr) {
	        console.log(`stderr: ${stderr}`);
	    }
	    console.log(`stdout: ${stdout}`);
	    if(callback){
	    	callback(stdout);
	    }
	});

}

/*
osascript commands
use script editor.
to find available commands:
file->open dictionary->Spotify
*/
